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
// https://stackoverflow.com/questions/10730362/get-cookie-by-name
// https://stackoverflow.com/questions/34558264/fetch-api-with-cookie
// https://stackoverflow.com/questions/55897099/cross-origin-request-blocked-the-same-origin-policy-disallows-reading-the-remot
fastify.register(cors, {
    origin: ['http://localhost:8000','http://localhost:3000','http://localhost:8000/','http://localhost','http://localhost:8000/'], // Replace with your trusted origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization','Origin','X-Requested-With'], // Allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
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

// const HOST = process.env.HOST;
// const PORT =  process.env.PORT;


fastify.register(routes);

fastify.listen({port : 3000,host:'0.0.0.0'}, err => {
    if (err) {
        //console.error(err);
        process.exit(1);
    }
    // //console.log('Server listening on http://' + host +':' + port);
});