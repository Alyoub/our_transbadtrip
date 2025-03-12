const {} = require('./tools/google-auth');
const {Tow_Facor_Auth} = require('./tools/tow_factor_auth');
const { register, login,logout, profile, users } = require('./user/user');
const { HandleFriends } = require('./user/friends');
const { upload_, change_password, update_, delete_ } = require('./user/user_managment');
const jwt = require('./tools/jwt');
const multipart = require('@fastify/multipart');
const {chat} = require('./chat/chat');
const {google_login_flow,google_login_response} = require('./tools/google-auth')

module.exports = async function routes(fastify, options) {
    
    fastify.get('/', async (request, reply) => {
        return {
            goood: 'trip'
        };
    });


    fastify.decorate('authenticate', async function (request, reply) {
        try {
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new Error('No token provided');
            }
            const userId = await jwt.verify(token);
            request.user = {};
            request.user.userId = userId;
        } catch (error) {
            reply.status(401).send({ error: 'Unauthorized', message: error.message });
        }
    });

    fastify.register(multipart, {
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    });


    // not working 
    fastify.post('/google_auth/flow',google_login_flow);
    fastify.post('/google_auth/response',google_login_response);
    // fastify.post('/login/google/', google_auth);
    fastify.post('/2fa/:action',async (request,reply)=>{
        switch(action){
            case 'activate':
                return await Tow_Facor_Auth.activate({
                    request:request,
                    reply:reply
                })
            case 'generate':
                return await Tow_Facor_Auth.generate({
                    request: request,
                    reply: reply
                })
            case 'verify':
                return await Tow_Facor_Auth.Verify({
                    request: request,
                    reply: reply
                })
        }

    });

    fastify.post('/friends/:action', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { action } = request.params;
        const handler = new HandleFriends(request, reply, prisma);

        switch (action) {
            case 'add':
                return handler.addFriend();
            case 'cancel':
                return handler.cancelFriend();
            case 'remove':
                return handler.removeFriend();
            case 'list':
                return handler.listFriends();
            case 'requests':
                return handler.friendRequests();
            case 'accept':
                return handler.acceptFriend();
            case 'my_requests':
                return handler.listRequests();
            default:
                return reply.code(400).send({ error: "Invalid action" });
        }
    });

    fastify.post('/register', register);

    fastify.get('/profile', { preHandler: [fastify.authenticate] }, profile);

    fastify.post('/login', login);
    
    fastify.post('/logout',logout);

    fastify.get('/users', { preHandler: [fastify.authenticate] }, users);

    fastify.post('/api/:login/upload', { preHandler: [fastify.authenticate] }, upload_);

    fastify.put('/api/:login/change_password', { preHandler: [fastify.authenticate] }, change_password);

    fastify.put('/user/:login', { preHandler: [fastify.authenticate] }, update_);

    fastify.delete('/user/:id', { preHandler: [fastify.authenticate] }, delete_);

    fastify.get('/chat', { websocket: true , preHandler: [fastify.authenticate] },  (socket, req) => {
     return  chat(socket , req);   
    })
};