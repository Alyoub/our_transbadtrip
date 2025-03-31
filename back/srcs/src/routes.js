const {} = require('./tools/google-auth');
const {Two_Factor_Auth} = require('./tools/tow_factor_auth');
const { register, login,logout, profile, users ,verify2FA} = require('./user/user');
const { HandleFriends } = require('./user/friends');
const { upload_, change_password, update_, delete_ } = require('./user/user_managment');
const {jwt} = require('./tools/jwt');
const multipart = require('@fastify/multipart');
const {chat, load_conversation} = require('./chat/chat');
const {blockUser,unblockUser} = require('./chat/block');
const {google_login_flow,google_login_response} = require('./tools/google-auth');
const {game_logic} = require('./game/game');
const {handel_cookies} = require('./tools/middlewares');
const {SMTP} = require('./tools/smtp');
const {prisma} = require('./user/db')
// const {createTournament} = require('./game/tournament')~

const fastifyIO = require("fastify-socket.io");
const { compare } = require('bcrypt');

module.exports = async function routes(fastify, options) {

    // fastify.register(cookie);
    fastify.addHook('preHandler', handel_cookies);

    
    fastify.get('/', async (request, reply) => {
        // const token =  "sedbaraka ealiya mn trip ;";
        // reply.header('Set-Cookie', [
        //     `jwt=${token}; Max-Age=900000; Path=/; HttpOnly; Secure;  `,
        //     'Max-Age=3600000; Path=/; HttpOnly'
        // ]);
        return reply.code(200).send({
            goodtrip :"transbadtrip khdama ",
        })
    
    });

    fastify.decorate('authenticate', async function (request, reply) {
        try {
            // console.log('request cookes jwt ? ',request.cookies.jwt)
             token = request.cookies.jwt ;
            if (!token) {
                throw new Error('No token provided');
            }
            const  data = await jwt.verify(token);
            // console.log("data in teh jwt is ",data);
            request.user = {};
            request.user = data;

            if(request.user.is2FAVerified == false)
                throw new Error('2fa is not verified');
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
    
    fastify.after(() => {
        fastify.io.on("connection", (socket) => {
            // console.log("client connected", socket.id);
            game_logic(socket, fastify);
        });
    });

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
        // //// console.log(request.body);
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


    fastify.post('/forget_password', async (request, reply) => {
        const { email } = request.body;
        if (!email) {
            return reply.code(400).send({ error: 'Email is required' });
        }
        await SMTP.forget_pass(email);
        return reply.code(200).send({ message: 'Password reset email sent' });
    });
    fastify.get('/reset_password/:email/:token', async (request, reply) => {
        const { email, token } = request.params;
        if (!token) {
            return reply.code(400).send({ error: 'Token and new password are required' });
        }
    
        const user = await prisma.user.findUnique({
            where: {
                resetToken: token,
                email: email
            }
        });
    
        if (!user) {
            return reply.code(400).send({ error: 'Invalid or expired token' });
        }
    
        // const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken: null, resetTokenExpiry: null }
        });
        const jwt_token = jwt.generate(user.id);
        reply.header('Set-Cookie', [
            `jwt=${jwt_token}; Max-Age=900000; Path=/; HttpOnly; Secure;`,
            'Max-Age=3600000; Path=/; HttpOnly'
        ]);
        return reply.code(200).send({ message: 'logged in' });
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

    fastify.post('/verify_tfa', verify2FA)
    fastify.post('/register', register);

    fastify.get('/profile', { preHandler: [fastify.authenticate] }, profile);

    fastify.post('/login', async (request, reply) => { return login(request, reply, fastify); });
    fastify.post('/logout',{preHandler: [fastify.authenticate]},logout);
    fastify.get('/users', { preHandler: [fastify.authenticate]}, users);
    fastify.post('/access',{preHandler:[fastify.authenticate]}, async (request,reply)=>{
        return reply.code(200).send({message:"OK!"});
    })
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

    fastify.post('/wingame', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const user = request.user;
    
        try {
            await prisma.user.update({
                where: { id: user.userId },
                data: { wonGames: { increment: 1 } }
            });

            const userrr = await prisma.user.findUnique({
                where: { id: user.userId }
            });

            const levelsToIncrement = Math.floor(userrr.wonGames / 3);
            // console.log('levelsToIncrement', levelsToIncrement);
            if (levelsToIncrement > 0) {
                await prisma.user.update({
                    where: { id: user.userId },
                    data: { level: { increment: levelsToIncrement } }
                });
            }
            reply.status(200).send({ message: 'Win recorded' });
        } catch (error) {
            reply.status(500).send({ error: 'Failed to record win' });
        }
    });
    
    fastify.post('/losegame', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const user = request.user;
    
        try {
            await prisma.user.update({
                where: { id: user.userId },
                data: { lostGames: { increment: 1 } }
            });
            reply.status(200).send({ message: 'Loss recorded' });
        } catch (error) {
            reply.status(500).send({ error: 'Failed to record loss' });
        }
    });

    fastify.get('/wingame', {preHandler: [fastify.authenticate]} , async (request, reply) => {
        const user = request.user;
        const user_ = await prisma.user.findUnique({
            where: { id: user.userId }
        });
        return reply.status(200).send({ wonGames: user_.wonGames });
    });

    fastify.get('/losegame', {preHandler: [fastify.authenticate]} , async (request, reply) => {
        const user = request.user;
        const user_ = await prisma.user.findUnique({
            where: { id: user.userId }
        });
        return reply.status(200).send({ lostGames: user_.lostGames });
    });

    fastify.post('/uploadpicb64', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const user = request.user;
        const { pic } = request.body;
        // // console.log('pic', pic);
        try {
            await prisma.user.update({
                where: { id: request.user.userId },
                data: { profilePicPath: pic }
            });
            reply.status(200).send({ message: 'Picture uploaded' });
        } catch (error) {
            // console.error('Prisma error:', error);
            reply.status(500).send({ error: 'Failed to upload picture', details: error.message });
        }      
    });

    fastify.post('/uploadcover', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const user = request.user;
        const { cover } = request.body;

        try {
            await prisma.user.update({
                where: { id: request.user.userId },
                data: { wallpaperPath: cover }
            });
            reply.status(200).send({ message: 'cover uploaded' });
        } catch (error) {
            // console.error('Prisma error:', error);
            reply.status(500).send({ error: 'Failed to upload cover', details: error.message });
        }      
    });
};