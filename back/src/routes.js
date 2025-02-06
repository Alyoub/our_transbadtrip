const { request } = require("http");

async function routes(fastify,options){
    fastify.get('/',async (request,reply) => {
        return {
            trip:'bad'
        }
    })
}

// export default routes;

module.exports = routes