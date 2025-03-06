const { google_auth, tow_factor_auth } = require('./user/auth');
const { register, login, profile, users } = require('./user/user');
const { HandleFriends } = require('./user/friends');
const { upload_, change_password, update_, delete_ } = require('./user/user_managment');
const jwt = require('@fastify/jwt');
const multipart = require('@fastify/multipart');

module.exports = async function routes(fastify, options) {

    fastify.get('/', async (request, reply) => {
        return {
            bad: 'trip'
        };
    });
    // khasna nhaydo had jwt hit wajda khas n9ado dyalna 
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

    fastify.register(multipart, {
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    });

    fastify.post('/login/google/', google_auth);

    fastify.post('/auth/:action',tow_factor_auth);

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

    fastify.post('/login', async (request, reply) => { return login(request, reply, fastify); });

    fastify.get('/users', { preHandler: [fastify.authenticate] }, users);

    fastify.post('/api/:login/upload', { preHandler: [fastify.authenticate] }, upload_);

    fastify.put('/api/:login/change_password', { preHandler: [fastify.authenticate] }, change_password);

    fastify.put('/user/:login', { preHandler: [fastify.authenticate] }, update_);

    fastify.delete('/user/:id', { preHandler: [fastify.authenticate] }, delete_);
};