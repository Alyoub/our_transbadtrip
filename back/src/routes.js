const {register , login, profile ,users} = require('./user/user')
const {add_friend,remove_friend,list_friends,accept_friend,cancel_friend,friend_requests} = require('./user/friends')
const {upload_,change_password,update_, delete_} = require('./user/user_managment')
const jwt = require('@fastify/jwt');

module.exports = async function routes(fastify, options) {
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

    fastify.get('/', async (request, reply) => {
        return {
            bad: 'trip'
        };
    });

    fastify.post('/friends/:action',{preHandler:[fastify.authenticate]},async (request,reply)=>{
        try{
            const {action} = request.params;
            switch(action){
                case 'add':
                    return await add_friend(request,reply,prisma);
                case 'cancel':
                    return await cancel_friend(request,reply,prisma);
                case 'remove':
                    return await remove_friend(request,reply,prisma);
                case 'list':
                    return await list_friends(request,reply,prisma);
                case 'requests':
                    return await friend_requests(request,reply,prisma);
                case 'accept':
                        return await accept_friend(request,reply,prisma);
                default:
                    return reply.code(69).send({haha: "ka3ka3"});
            }


        } catch (err){
            console.error("error: ",err);
            return reply.code(222).send({err:"failed to add friend! :( "})
        }
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

