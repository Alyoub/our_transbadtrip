const {} = require('./tools/google-auth');
const {Two_Factor_Auth} = require('./tools/tow_factor_auth');
const { register, login,logout, profile, users } = require('./user/user');
const { HandleFriends } = require('./user/friends');
const { upload_, change_password, update_, delete_ } = require('./user/user_managment');
const jwt = require('./tools/jwt');
const multipart = require('@fastify/multipart');
const {chat, load_conversation} = require('./chat/chat');
const {blockUser,unblockUser} = require('./chat/block');
const {google_login_flow,google_login_response} = require('./tools/google-auth');
const {game_logic} = require('./game/game');
const {handel_cookies} = require('./tools/middlewares');
// const {createTournament} = require('./game/tournament')

const fastifyIO = require("fastify-socket.io");

module.exports = async function routes(fastify, options) {

    // fastify.register(cookie);
    fastify.addHook('preHandler', handel_cookies);

    
    fastify.get('/', async (request, reply) => {
        const token =  "sedbaraka ealiya mn trip ;";
        reply.header('Set-Cookie', [
            `jwt=${token}; Max-Age=900000; Path=/; HttpOnly; Secure; SameSite=Strict`,
            'Max-Age=3600000; Path=/; HttpOnly'
        ]);
        return reply.code(200).send({
            goodtrip :"transbadtrip khdama ",
        })
    
    });

    fastify.decorate('authenticate', async function (request, reply) {
        try {
            console.log('request cookes jwt ? ',request.cookies.jwt,' request headres auth ? ',request.headers.authorization)
             token = request.cookies.jwt || request.headers.authorization?.split(' ')[1];
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


    fastify.register(fastifyIO, {
        cors: {
            origin: "*",
            methods: ["*"],
        },
    });
    
    fastify.after( ()=>{
        // //console.log("hna ");
        fastify.io.on("connection",(socket)=>{
            //console.log('rakman');
            game_logic(socket,fastify)
        });
    })

    // fastify.get("/api/tournaments/:id", async (request, reply) => {
    //     const tournament = await prisma.tournament.findUnique({
    //         where: { id: parseInt(request.params.id) },
    //         include: { players: true, matches: true, winner: true },
    //     });
    //     return tournament;
    // });
    
    // fastify.post("/api/tournaments/join", async (request, reply) => {
    //     const { userId } = request.body;
    //     const tournament = await createTournament([userId]);
    //     return tournament;
    // });
    // not working  yet 
    fastify.get('/google_auth/flow',google_login_flow);
    fastify.get('/auth/google/callback',google_login_response);

    // fastify.post('/login/google/', google_auth);
    fastify.post('/2fa/:action',{preHandler:[fastify.authenticate]},async (request,reply)=>{
        const { action } = request.params;
        // //console.log(request.body);
        switch(action){
            case 'activate':
                return await Two_Factor_Auth.activate({
                    request:request,
                    reply:reply
                })
            case 'generate':
                return await Two_Factor_Auth.generate({
                    request: request,
                    reply: reply
                })
            case 'verify':
                return await Two_Factor_Auth.verify({
                    request: request,
                    reply: reply
                })
        }

    });

    fastify.post('/friends/:action', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { action } = request.params;
        const handler = new HandleFriends(request, reply);

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
    fastify.post('/logout',{preHandler: [fastify.authenticate]},logout);
    fastify.get('/users', { preHandler: [fastify.authenticate]}, users);

    fastify.post('/api/:login/upload', { preHandler: [fastify.authenticate] }, upload_);

    fastify.put('/api/:login/change_password', { preHandler: [fastify.authenticate] }, change_password);

    fastify.put('/user/:login', { preHandler: [fastify.authenticate] }, update_);

    fastify.delete('/user/:id', { preHandler: [fastify.authenticate] }, delete_);

    fastify.get('/chat', { websocket: true , preHandler: [fastify.authenticate] },  (socket, req) => {
     return  chat(socket , req);
    })
    fastify.post('/block', { preHandler: [fastify.authenticate] }, blockUser);
    fastify.post('/unblock', { preHandler: [fastify.authenticate] }, unblockUser);
    fastify.post('/chat/:login', { preHandler: [fastify.authenticate] }, load_conversation);
};