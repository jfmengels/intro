'use strict';
// Object validation library
const Joi = require('joi');

// define a single route
const myRoute = {
    // HTTP method
    method: 'POST',
    // route path
    path: '/{parameter}',
    // route config object
    config: {
        // validation rules:
        validate: {
            // for url parameters
            params: {
                // 'parameter' cannot be longer than 10 characters
                parameter: Joi.string().max(10).required()
            },
            // for query string
            query: {
                // optional query string part 'item' must be a number <= 100
                item: Joi.number().max(100).optional()
            },
            // for payload
            payload: {
                // payload must only have one field 'alive' which is a boolean
                alive: Joi.boolean().required()
            }
        },
        // actual route controller logic
        handler: function (request, reply){

            // we merge the payload, the query object and the params in a single object
            const response = Object.assign(request.payload, request.query, request.params);
            // this object is returned to the client
            return reply(response);
        }
    }
};

// plugin definitions
const myPlugin = {
    // method that will be called to register the plugin
    register: function (server, options, next) {

        // add the route to the server
        server.route(myRoute);
        // registration is done, let the framework take over again
        next();
    }
};

// Plugin's information
myPlugin.register.attributes = {
    name: 'simplePlugin',
    version: '1.0.0'
};

// export the plugin outside of this field
module.exports = myPlugin;
