const fastify = require('fastify')({ logger: true })

//https://www.npmjs.com/package/@fastify/auth
// https://github.com/fastify/fastify/blob/main/docs/Guides/Getting-Started.md
// https://github.com/fastify/fastify-auth/blob/main/auth.js


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