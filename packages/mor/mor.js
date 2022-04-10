export const name = 'mor';
import query from 'array-query';
import { compareSync } from 'bcrypt';

const Fiber = require('fibers');
MORAPIProducts = [];

function getUserIdFromApiKey(publicKey, secretKey) {
  if (!publicKey || !secretKey) {
    return null;
  }

  const apiKey = ApiKeys.findOne({ publicKey: publicKey });
  if (!apiKey) {
    return null;
  }

  if (!compareSync(secretKey, apiKey.secretKey)) {
    return null;
  }

  const user = Meteor.users.findOne({ _id: apiKey.createdUserId }, { fields: { _id: 1 } });
  if (user) {
    return user._id;
  }

  return null;
}

const options = {}

const max = Meteor.settings.mor?.max;
const windowMs = Meteor.settings.mor?.windowMs;

if (max) {
  options.max = max;
}

if (windowMs) {
  options.windowMs = windowMs;
}

const pickerRateLimiter = new PickerRateLimiter(options);
Picker.middleware(pickerRateLimiter);

Picker.middleware(function (req, res, next) {
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');

    if (parts.length === 2) {
      const scheme = parts[0];
      const base64 = parts[1];

      if (/^Basic$/i.test(scheme)) {
        const buff = Buffer.from(base64, 'base64');
        const apiKeys = buff.toString('utf-8');
        const apiKeyParts = apiKeys.split(':');

        if (apiKeyParts.length === 2) {
          req.publicKey = apiKeyParts[0];
          req.secretKey = apiKeyParts[1];
        }
      }
    }
  }

  next();
});

Picker.middleware(function (req, res, next) {
  Fiber(function () {
    const userId = getUserIdFromApiKey(req.publicKey, req.secretKey);
    if (userId) {
      req.userId = userId;
    }

    next();
  }).run();
});

const postRoutes = Picker.filter(function(req, res) {
  return req.method === "POST";
});

postRoutes.route(`/api/methods/:methodName`, function (params, request, response, next) {
  const product = MORAPIProducts.find(MORAPIProduct => {
    return MORAPIProduct.spec.paths[request._parsedUrl.pathname];
  });

  if (!product) {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify({ error: { message: 'End point not found.' } }));
    response.end();
    return;
  }

  const fiber = Fiber(function (body) {
    const onError = function (error) {
      response.setHeader('Content-Type', 'application/json');

      let statusCode = 400;
      if (isNaN(error.error) && typeof error.error === 'string') {
        switch (error.error) {
          case 'unauthorized':
            statusCode = 401;
            break;
          case 'forbidden':
          case 'not-verified':
            statusCode = 403;
            break;
          case 'schema-error':
            statusCode = 422;
            break;
        }
      } else if (!isNaN(error.error)) {
        statusCode = parseInt(error.error);
      }

      response.statusCode = statusCode;
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
    if (!schema) {
      return;
    }

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