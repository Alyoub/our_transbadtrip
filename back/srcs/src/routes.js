const { google_auth, tow_factor_auth } = require('./user/auth');
const { register, login, profile, users } = require('./user/user');
const { HandleFriends } = require('./user/friends');
const { upload_, change_password, update_, delete_ } = require('./user/user_managment');
const JWT = require('./tools/jwt');
const multipart = require('@fastify/multipart');

// const JWT_KEY = process.env.SECRET_KEY;
// const JWT_HASHING_ALGO = process.env.HASHING_ALGO;
// const JWT_EXP_TIME = process.env.JWT_EXP_TIME;



const jwt = new JWT('ccdjkhjklhlashscjklhioefhpiuhidbcsvHBPIU32493748HEH!@@##JKDNJK','1h','HS256');


module.exports = async function routes(fastify, options) {

    fastify.get('/', async (request, reply) => {
        return {
            bad: 'trip'
        };
    });
    // khasna nhaydo had jwt hit wajda khas n9ado dyalna // DONE 

    fastify.decorate('authenticate', async function (request, reply) {
        try {
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new Error('No token provided');
            }
    

            const userId = await jwt.verify(token);
            request.userId = userId;
        } catch (error) {
            reply.status(401).send({ error: 'Unauthorized', message: error.message });
        }
    });

    fastify.register(multipart, {
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    });

    // fastify.post('/login/google/', google_auth);

    // fastify.post('/auth/:action',tow_factor_auth);

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