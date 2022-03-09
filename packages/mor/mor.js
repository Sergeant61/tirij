export const name = 'mor';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import query from 'array-query';

checkNpmVersions({
  'simpl-schema': '1.12.0'
}, 'bordo:mor');

const Fiber = require('fibers');
MORAPIProducts = [];

function getUserIdFromAuthToken(token) {
  if (!token) {
    return null;
  }

  var user = Meteor.users.findOne({
    'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token)
  }, { fields: { _id: 1 } });
  if (user) {
    return user._id;
  }

  return null;
}

Picker.middleware(function (req, res, next) {
  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');

    if (parts.length === 2) {
      var scheme = parts[0];
      var credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        req.authToken = credentials;
      }
    }
  }

  next();
});

Picker.middleware(function (req, res, next) {
  Fiber(function () {
    var userId = getUserIdFromAuthToken(req.authToken);
    if (userId) {
      req.userId = userId;
    }

    next();
  }).run();
});


Picker.route(`/api/methods/:methodName`, function (params, request, response, next) {
  const fiber = Fiber(function (body) {
    const onError = function (error) {
      response.setHeader('Content-Type', 'application/json');
      response.statusCode = parseInt(error.error) || 500;
      response.write(JSON.stringify({
        error: error || {}
      }));
      response.end();
    };

    try {
      DDP._CurrentMethodInvocation.withValue({
        userId: request.userId
      }, function () {
        try {
          const data = body || {};
          response.setHeader('Content-Type', 'application/json');
          response.statusCode = 200;
          const methodResult = Meteor.call(params.methodName, data) || {};
          response.write(JSON.stringify(methodResult));
          response.end();
        } catch (error) {
          onError(error)
        }
      });
    } catch (error) {
      onError(error)
    }
  });

  fiber.run(request.body);
});

Meteor.startup(() => {
  Object.keys(ValidatedMethods).forEach(function (validatedMethodName) {
    const validatedMethod = ValidatedMethods[validatedMethodName];
    const schema = validatedMethod.schema;
    let isAuth = false;

    if (validatedMethod.requiredUserType || validatedMethod.roles) {
      isAuth = true;
    }

    const apiProductName = validatedMethodName.split('.')[0];
    let apiProduct = query('name').is(apiProductName).on(MORAPIProducts)[0];

    if (!apiProduct) {
      apiProduct = {
        name: apiProductName,
        spec: {}
      }

      MORAPIProducts.push(apiProduct);
    }

    SwaggerUtil.createPath(apiProduct.spec, validatedMethodName, schema, isAuth);
  });

  MORAPIProducts.forEach(function (apiProduct) {
    apiProduct.spec = SwaggerUtil.generateSwagger(apiProduct.spec);
  });
});