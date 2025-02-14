const fastify = require('fastify')({ logger: true })

//https://www.npmjs.com/package/@fastify/auth
// https://github.com/fastify/fastify/blob/main/docs/Guides/Getting-Started.md
// https://github.com/fastify/fastify-auth/blob/main/auth.js



// mohim !! ==>  https://dev.to/elijahtrillionz/build-a-crud-api-with-fastify-688 
// mohim 2 !! ==> https://dev.to/elijahtrillionz/fastify-crud-api-with-authentication-2p


// mohim websocket fastify https://github.com/fastify/fastify-websocket

// Declare a route
// fastify.get('/', function handler (_, reply) {
//     reply.send({ hello: 'world' })
// })
// const fastify = require('fastify')();

const multipart = require('@fastify/multipart');

const routes = require('./src/routes');

fastify.register(multipart,{
    limits:{
        fileSize : 10 * 1024 * 1024,
    },
});

fastify.register(routes);

fastify.listen({port : 3000}, err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Server listening on http://localhost:3000');
});