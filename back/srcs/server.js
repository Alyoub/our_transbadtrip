const fastify = require('fastify')({
    logger: 
    {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        },
    },

});


const cors = require('@fastify/cors');


// mohim fel cors =>
// https://stackoverflow.com/questions/10730362/get-cookie-by-named
// https://stackoverflow.com/questions/34558264/fetch-api-with-cookie
// https://stackoverflow.com/questions/55897099/cross-origin-request-blocked-the-same-origin-policy-disallows-reading-the-remot
fastify.register(cors, {
    origin: (origin, callback) => {
        callback(null, true);
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With'],
      credentials: true
  });

fastify.register(require("@fastify/websocket"));
// fastify.addHook('onRequest',);
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
  

const routes = require('./src/routes');

const HOST = process.env.BASE_URL;
const PORT =  process.env.BASE_PORT;

fastify.register(routes);
fastify.listen({port : PORT,host: HOST}, err => {
    if (err) {
        // console.error(err);
        // process.exit(1);
    }
    // //// console.log('Server listening on http://' + host +':' + port);
});