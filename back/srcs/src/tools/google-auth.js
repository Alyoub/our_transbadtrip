// https://codeculturepro.medium.com/implementing-google-login-in-a-node-js-application-b6fbd98ce5e
// https://github.com/atultyagi612/Google-Authentication-nodejs?tab=readme-ov-file
const axios = require('axios');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {SMTP} = require('./smtp')
const {prisma} = require('../user/db');
const CLIENT_ID = process.env.CLIENT_ID;

const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
// mohim kasni n9rah hadchi :
// https://github.com/fastify/fastify-cookie?tab=readme-ov-file#importing-serialize-and-parse
// https://www.npmjs.com/package/@fastify/passport
// https://camo.githubusercontent.com/f35bf5748b0b04ae72930beacbf93634ff1e0a8f31a1ac9d54b606ea88ba22c7/68747470733a2f2f6465762d746f2d75706c6f6164732e73332e616d617a6f6e6177732e636f6d2f75706c6f6164732f61727469636c65732f66697767796c74736578306a357872316c726f722e706e67
// https://github.com/atultyagi612/Google-Authentication-nodejs?tab=readme-ov-file#configure-passports-google-startegy

// https://fastify.dev/docs/latest/Reference/Hooks/

function generatePassword() {
    return crypto.randomBytes(8).toString('hex');
}

function google_login_flow(request , reply){
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email` ;
    reply.redirect(url);
    
}

async function google_login_response(request, reply) {
    const { code } = request.query;
    try {
        const { data } = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        });

        const { access_token } = data;
        const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        console.log("profile : ", profile);
        const { email, name, sub: googleId, picture } = profile;
        let user = await prisma.user.findUnique({
            where: { email },
        });
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    tfa:false,
                    tfa_key : "null",
                    profilePicPath: picture, 
                    wallpaperPath: '/path/to/default/wallpaper.png' ,
                    login: `given_name_{${googleId}}`,
                    password:hashedPassword,
                },
            });
        }
        await SMTP.send({
            sender: process.env.SMTP_SENDER,
            to: email,
            subject: 'Your New Account Password',
            body: `<p>Your password is: ${password}</p>`
        });


        return reply.redirect('/profile');
    } catch (err) {
        console.error('Authentication error:', err);
        return reply.redirect('/?error=auth_failed');
    }
}

module.exports =  {google_login_flow,google_login_response}