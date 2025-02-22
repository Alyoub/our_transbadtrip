const {google_auth,tow_factor_auth} = require('./user/auth')
const {register , login, profile ,users} = require('./user/user')
const {friends} = require('./user/friends')
const {upload_,change_password,update_, delete_} = require('./user/user_managment')
const jwt = require('@fastify/jwt');

module.exports = async function routes(fastify, options) {

    fastify.get('/', async (request, reply) => {
        return {
            bad: 'trip'
        };
    });

    fastify.post('/login/google/',google_auth(request,reply))

    fastify.post('/friends/:action',{preHandler:[fastify.authenticate]},friends(request,reply))

    fastify.post('/register',register);
    
    fastify.get('/profile',{preHandler:[fastify.authenticate]},profile)
    
    fastify.post('/login', async (request,reply )=> { return login(request,reply,fastify) });

    fastify.get('/users', { preHandler: [fastify.authenticate] },users);

    fastify.post('/api/:login/upload', { preHandler: [fastify.authenticate] },upload_ );

    fastify.put('/api/:login/change_password', { preHandler: [fastify.authenticate] },change_password);

    fastify.put('/user/:login', { preHandler: [fastify.authenticate] }, update_);

    fastify.delete('/user/:id', { preHandler: [fastify.authenticate] }, delete_);
}

