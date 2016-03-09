'use strict';
// Hapi framework
const Hapi = require('hapi');
// our plugin in the file api.js
const ApiPlugin = require('./api');

// We create a server object
const server = new Hapi.Server();
// Server will listen on port 8080
server.connection({
    port: 8080
});

// register the plugin
server.register(ApiPlugin)
    // start the server
    .then(() => server.start())
    // If the server is correctely started, we log it
    .then(() => console.log(`Server running at: ${server.info.uri}`))
    // If something wrong happens, we log it
    .catch(console.log);
