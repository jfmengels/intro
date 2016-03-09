'use strict';
// Hapi framework
const Hapi = require('hapi');
// our plugin in the file api.js
const ApiPlugin = require('../api');

// assertion library
const Code = require('code');
// Lab test runner
const Lab = require('lab');
// instance of our test suite
const lab = exports.lab = Lab.script();

// let's get a server instance
const getServer = function () {
// We create a server object
    const server = new Hapi.Server();
// Server will listen on port 8080
    server.connection();

// register the plugin
    return server.register(ApiPlugin)
        .then(() => server);
};

lab.test('Ensure that the server exists', (done) => {

    getServer()
        .then((server) => {

            Code.expect(server).to.exist();
            done();
        })
        .catch(done);
});

lab.test('Simply test the unique route', (done) => {

    // What we will inject in the server
    const toInject = {
        method: 'POST',
        url: '/hello?item=10',
        payload: { alive: true }
    };

    getServer()
        // inject lets us pass a request to the server event if it is not started
        .then((server) => server.inject(toInject))
        // The server's response is given in a promise (or a callback if we wanted)
        .then((response) => {

            // we did not specified any other status-code, so 200 is th default one
            Code.expect(response.statusCode).to.equal(200);
            // We parse the payload as a JSON object
            const payload = JSON.parse(response.payload);
            // payload exists
            Code.expect(payload).to.exist();
            // it has the fields named: 'alive', 'item' and 'parameter'
            Code.expect(payload).to.contain(['alive', 'item', 'parameter']);

            // The values of each field is the one we expect
            Code.expect(payload.alive).to.be.true();
            Code.expect(payload.item).to.equal(10);
            Code.expect(payload.parameter).to.equal('hello');
            done();
        })
        .catch(done);
});

lab.test('Simple example of a bad request', (done) => {

    // What we will inject into the server
    const toInject = {
        method: 'POST',
        url: '/hello?item=101', // 101 > 100, this will fail!
        payload: { alive: true }
    };

    getServer()
    // Inject lets us pass a request to the server event if it is not started
        .then((server) => server.inject(toInject))
        // The server's response is given in a promise (or a callback if we wanted)
        .then((response) => {

            // we issued a bad request, the proper response status-code is 400 then
            Code.expect(response.statusCode).to.equal(400);
            /**
             * response.payload is
             * {
             *   "statusCode":400,
             *   "error":"Bad Request","message":"child \"item\" fails because [\"item\" must be less than or equal to 100]",
             *   "validation":{"source":"query","keys":["item"]}
             * }
             */

            done();
        })
        .catch(done);
});
