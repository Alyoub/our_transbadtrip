const { prisma } = require("./db");
const bcrypt = require('bcrypt');
const {jwt} = require('../tools/jwt');
async function register(request, reply){
    const { email, name, password , login  } = request.body;
    if (!email || !name || !password) {
        return reply.code(400).send({ error: 'Missing required fields' });
    }
    try {
        // khas n3awed nchof had l hashing techniques :)
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                login,
                email,
                name,
                password: hashedPassword,
                tfa : false,
                tfa_key : "null"
            }
        });
        if(user)
            reply.code(201).send({
                "message": "User created successfully",
            });
    } catch (err) {
        console.log(err);
        //console.error('Error during user registration:', err);
        reply.code(400).send({ error: "database LLL ",err });
    }
}

async function logout (request, reply ){
    try{
        // unset the jwt token 

    }catch (err){
        //console.log("zeb");
        return reply.code(500).send({
            badtrip : "hadchi makhdamch",
            error : err,

        })
    }

}

async function login (request, reply){
    const { email, password } = request.body;
    if (!email || !password) {
        return reply.code(400).send({ error: "bad 3amar l3ibat" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return reply.code(404).send({ error: "bad trip had khina makaynch" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return reply.code(401).send({ error: "password ghalet " });
        }

        if(user.tfa){
            const p_token = jwt.generate(user.id,false);// need to modify 
            reply.header('Set-Cookie', [
                `jwt=${p_token}; Max-Age=900000; Path=/; HttpOnly; Secure; SameSite=Strict`,
                'Max-Age=3600000; Path=/; HttpOnly'
            ]);
            return reply.code(200).send({
                message:"tfa needed"
            })
        }
        const token = jwt.generate(user.id,true);
        reply.header('Set-Cookie', [
            `jwt=${token}; Max-Age=900000; Path=/; HttpOnly; Secure; SameSite=Strict`,
            'Max-Age=3600000; Path=/; HttpOnly'
        ]);

        return reply.code(200).send({ message : "OK" });
    } catch (err) {

        console.log(err);
        //console.error('Error during login:', err);
        reply.code(500).send({ badtrip: "login error" ,err:err});
    }
}

async function logout(request,reply){
    try{
        const token = "bslama";
        return reply.header('Set-Cookie', [
            `jwt=${token}; Max-Age=900000; Path=/; HttpOnly; Secure; SameSite=Strict`,
            'Max-Age=3600000; Path=/; HttpOnly'
        ]).code(200).send({message:"OK"});

    }catch(err){
        //console.log('logout :( error',err);
        return reply.code(444).send({
            badtrip : 'hadchi makdamch ',
            error: err,
        })
    }

}

async function verify2FA(request, reply) {
    const { totpCode } = request.body;

    try {
        const { userId } = await jwt.verify(partialToken);

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.tfa) {
            return reply.code(400).send({ error: "2FA not enabled for this user" });
        }

        const isValidTOTP = verifyTOTP(user.tfa_key, totpCode);
        if (!isValidTOTP) {
            return reply.code(401).send({ error: "Invalid 2FA code" });
        }

        const finalToken = jwt.generate(user.id, true);

        reply.header('Set-Cookie', [
            `jwt=${finalToken}; Max-Age=900000; Path=/; HttpOnly; Secure; SameSite=Strict`,
            'Max-Age=3600000; Path=/; HttpOnly'
        ]);

        return reply.code(200).send({ 
            message: "2FA verified successfully",
            is2FAVerified: true 
        });

    } catch (err) {
        console.error(err);
        reply.code(500).send({ error: "2FA verification failed", details: err.message });
    }
}

async function  profile (request,reply) {
        
    const {userId} = request.user
    //console.log('userId',userId);
    const user = await prisma.user.findUnique({
        where: { id : userId }
    });

    return reply.code(200).send({
        id: user.id,
        login: user.login,
        email: user.email,
        name: user.name,
    });

}

async function users (request, reply) {
    try {
        const users = await prisma.user.findMany({
            select:{
                id:true,
                login:true,
                name:true,
            }
        });
        return users;
    } catch (err) {
        //console.error('Error fetching users:', err);
        reply.code(500).send({ error: "makayn la users la zbi" });
    }
}


module.exports = {register,login,logout, profile, users}

