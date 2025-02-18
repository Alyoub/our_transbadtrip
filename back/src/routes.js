const {register , login, profile ,users} = require('./user/user')
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

    fastify.post('/friends/:action',{preHandler:[fastify.authenticate]},(request,reply)=>{
        try{
            const {action} = request.params;
            const {userId} = request.user;
            const {friendId } = request.body;

            console.log("\nparams ===>> ",request.params,"\n");

            // action must be add , remove , cancel
            console.log("\naction  =====> \n",action,"\n");
            
            
            switch(action){
                case 'add':
                    await prisma.friends.create({
                        data:{
                            userId: userId,
                            friendId : friendId,
                            acc

                        }
                    })
                    return reply.code(69).send({haha:'add'});
                case 'cancel':
                    return reply.code(70).send({haha:'cancel'});
                case 'remove':
                    return reply.code(71).send({haha:"remove"});
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

