const {google_auth,tow_factor_auth} = require('./user/auth')
const {register , login, profile ,users} = require('./user/user')
const {handle_friends} = require('./user/friends')
const {upload_,change_password,update_, delete_} = require('./user/user_managment')
const jwt = require('@fastify/jwt');
const multipart = require('@fastify/multipart');


module.exports = async function routes(fastify, options) {

    fastify.get('/', async (request, reply) => {
        return {
            bad: 'trip'
        };
    });
    fastify.register(jwt, {
        secret: ';o2u3ur02435702985ofhladkkhnf;sh@^%$&(&*^#987e093ueor1bnadkljcc'
    });
    
    fastify.decorate('authenticate', async function(request, reply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
    
    
    fastify.register(multipart,{
        limits:{
            fileSize : 10 * 1024 * 1024,
        },
    });
    fastify.post('/login/google/',google_auth)

    fastify.post('/friends/:action',{preHandler:[fastify.authenticate]} , async (request,reply)=>{
        const handler = new handle_friends(request,reply,prisma);
        return  await handler.handle_request();

    })

    fastify.post('/register',register);
    
    fastify.get('/profile',{preHandler:[fastify.authenticate]},profile)
    
    fastify.post('/login', async (request,reply )=> { return login(request,reply,fastify) });

    fastify.get('/users', { preHandler: [fastify.authenticate] },users);

    fastify.post('/api/:login/upload', { preHandler: [fastify.authenticate] },upload_ );

    fastify.put('/api/:login/change_password', { preHandler: [fastify.authenticate] },change_password);

    fastify.put('/user/:login', { preHandler: [fastify.authenticate] }, update_);

    fastify.delete('/user/:id', { preHandler: [fastify.authenticate] }, delete_);
}

