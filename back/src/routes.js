const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
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
            trip: 'bad'
        };
    });

    fastify.post('/register', async (request, reply) => {
        const { email, name, password } = request.body;
        if (!email || !name || !password) {
            return reply.code(400).send({ error: 'Missing required fields' });
        }
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
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
    });

    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body;
        if (!email || !password) {
            return reply.code(400).send({ error: "bad 3amar l3ibat" });
        }
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                return reply.code(404).send({ error: "bade trip had khina makaynch" });
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
    });

    fastify.get('/users', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        try {
            const users = await prisma.user.findMany();
            return users;
        } catch (err) {
            console.error('Error fetching users:', err);
            reply.code(500).send({ error: "makayn la users la zbi" });
        }
    });

    fastify.put('/user/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { id } = request.params;
        const { email, name, password } = request.body;
        if (!email || !name || !password) {
            return reply.code(400).send({ error: 'Invalid input' });
        }
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: parseInt(id) },
                data: { email, name, password: hashedPassword }
            });
            return { success: true };
        } catch (err) {
            console.error('Error updating user:', err);
            reply.code(500).send({ error: "bad tripa l update" });
        }
    });

    fastify.delete('/user/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { id } = request.params;
        try {
            await prisma.user.delete({
                where: { id: parseInt(id) }
            });
            return { success: true };
        } catch (err) {
            console.error('Error deleting user:', err);
            reply.code(500).send({ error: "badtrip" });
        }
    });
}

