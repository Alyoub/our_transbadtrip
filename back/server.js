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
fastify.register(require("./src/routes"))
fastify.register(require("./src/db_connector"))
// Run the server!
fastify.listen( { port: 3000 ,host :'localhost'}, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})