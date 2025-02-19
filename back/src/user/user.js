const { prisma } = require("./db");
const bcrypt = require('bcrypt');

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
                password: hashedPassword
            }
        });
        reply.code(201).send(user);
    } catch (err) {
        console.error('Error during user registration:', err);
        reply.code(400).send({ error: "database" });
    }
}
async function login (request, reply,fastify){
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
        const token = fastify.jwt.sign({ userId: user.id }, { expiresIn: '1h' });
        return reply.code(200).send({ token });
    } catch (err) {
        console.error('Error during login:', err);
        reply.code(500).send({ badtrip: "login error" });
    }
}
async function  profile (request,reply) {
        
    const {userId} = request.user
    const user = await prisma.user.findUnique({
        where: { id : userId }
    });

    return reply.code(200).send(user);

}

async function users (request, reply) {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (err) {
        console.error('Error fetching users:', err);
        reply.code(500).send({ error: "makayn la users la zbi" });
    }
}

//khasni nzid  add friend remove friend maybee array of ids 



module.exports = {register,login, profile, users}