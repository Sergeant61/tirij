import SimpleSchema from 'simpl-schema';

SwaggerUtil = {
  _paths: {},

  processArrays: function(root) {
    if(typeof root != 'object') {
      return root;
    }
  
    const removedKeys = [];
  
    for (const [key, value] of Object.entries(root)) {
      if(value.type !== 'array') {
        continue;
      }
      
      const itemsKey = `${key}.$`;
      value.items = root[itemsKey];
      removedKeys.push(itemsKey);
    }
  
    removedKeys.forEach(function(removedKey) {
      delete root[removedKey];
    });
  
    return root;
  },
  
  parser: function(definition) {
    let result = {};

    if(definition.type instanceof SimpleSchema) {
      result = SwaggerUtil.parseObject(definition.type._schema);
    } else if(typeof definition.type === 'string' && definition.type.startsWith('SimpleSchema.')) {
      result = {
        type: definition.type.split('.')[1].toLowerCase()
      };
    } else if(typeof definition.type === 'array') {
      result = {
        type: 'array',
        items: []
      };
    } else if(definition.type.name === 'Date') {
      result = {
        type: 'string'
      };
    } else {
      result = {
        type: definition.type.name?.toLowerCase()
      };
    }

    if(definition.allowedValues) {
      result.enum = definition.allowedValues;
    }

    return result;
  },
  
  parseObject: function(objectDefinition) {
    const result = {
      type: 'object',
      properties: {},
      required: []
    };

    Object.keys(objectDefinition).forEach(function(key) {
      const field = objectDefinition[key];
      const type = field.type;
      const optional = field.optional;
      const allowedValues = field.allowedValues;
      const definitions = type.definitions;
      
      if(definitions.length === 1) {
        result.properties[key] = SwaggerUtil.parser(definitions[0]);
      } else {
        result.properties[key] = {
          oneOf: definitions.map(function(definition) {
            return SwaggerUtil.parser(definition);
          })
        };
      }
  
      if(!optional) {
        result.required.push(key);
      }
  
      if(allowedValues) {
        result.properties[key].enum = allowedValues;
      }
    });

    if(result.required.length === 0) {
      delete result.required;
    }

    result.properties = SwaggerUtil.processArrays(result.properties);
    return result;
  },

  createPath: function(spec, methodName, schema, isAuth) {
    const key = `/api/methods/${methodName}`;
    const methodNameParts = methodName.split('.');
    let tags = [methodNameParts[0]];

    if(methodNameParts.length > 2) {
      tags = methodNameParts.slice(1,2);
    }

    if(!spec.paths) {
      spec.paths = {}
    }

    spec.paths[key] = {
      post: {
        tags: tags,
        responses: {
          200: {
            description: 'success'
          }
        }
      }
    };

    if(schema) {
      spec.paths[key].post.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: SwaggerUtil.parseObject(schema._schema)
          }
        }
      };
    }

    if(isAuth) {
      spec.paths[key].post.security = [{
        bearerAuth: []
      }];
    }

    return spec.paths[key];
  },

  generateSwagger: function(spec) {
    return Object.assign({
      openapi: '3.0.3',
      info: {
        description: '',
        version: '',
        title: 'Tirij Api'
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer'
          }
        }
      },
      servers: [
        {
          url: Meteor.absoluteUrl()
        }
      ]
    }, spec);
  }
};