const { prisma } = require("./db");
const bcrypt = require('bcrypt');
const jwt = require('../tools/jwt');
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
        //console.error('Error during user registration:', err);
        reply.code(400).send({ error: "database" });
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
        const token = jwt.generate(user.id);
        reply.header('Set-Cookie', [
            `jwt=${token}; Max-Age=900000; Path=/; HttpOnly; Secure; SameSite=Strict`,
            'Max-Age=3600000; Path=/; HttpOnly'
        ]);
        // towfa case 
        // return reply.code(200).send({message : "2FA"})
            // other logic for 2fa

        return reply.code(200).send({ message : "OK" });
    } catch (err) {
        //console.error('Error during login:', err);
        reply.code(500).send({ badtrip: "login error" });
    }
}

async function logout(request,reply){
    try{
        

    }catch(err){
        //console.log('logout :( error',err);
        return reply.code(444).send({
            badtrip : 'hadchi makdamch ',
            error: err,
        })
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
        const users = await prisma.user.findMany();
        return users;
    } catch (err) {
        //console.error('Error fetching users:', err);
        reply.code(500).send({ error: "makayn la users la zbi" });
    }
}


module.exports = {register,login,logout, profile, users}

