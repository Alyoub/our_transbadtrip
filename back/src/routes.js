const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('@fastify/jwt')
const bcrypt = require('bcrypt')

module.exports = async function routes(fastify, options) {
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
            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password
                }
            });
            reply.code(201).send(user);
        } catch (err) {
            reply.code(400).send({ error: "Database error" });
        }
    });

    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body;
        if (!email || !password) {
            return reply.code(300).send({ error: "Missing required fields" });
        }
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                return reply.code(494).send({ error: "No user with this email" });
            } else if (user.password !== password) {
                return reply.code(873).send({ error: "Incorrect password" });
            } else {
                return reply.code(200).send({ success: true });
            }
        } catch (err) {
            reply.code(440).send({ error: "Database error" });
        }
    });

    fastify.get('/users', async (request, reply) => {
        try {
            const users = await prisma.user.findMany(); // fetch all users from the database
            return users;
        } catch (err) {
            reply.code(500).send({ error: "Failed to fetch users" });
        }
    });

    fastify.put('/user/:id', async (request, reply) => {
        const { id } = request.params;
        const { email, name, password } = request.body;
        if (!email || !name || !password) {
            return reply.code(400).send({ error: 'Invalid input' });
        }
        try {
            await prisma.user.update({
                where: { id: parseInt(id) },
                data: { email, name, password }
            });
            return { success: true };
        } catch (err) {
            reply.code(500).send({ error: "Failed to update user" });
        }
    });

    fastify.delete('/user/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            await prisma.user.delete({
                where: { id: parseInt(id) }
            }); // delete user from the database
            return { success: true };
        } catch (err) {
            reply.code(500).send({ error: "Failed to delete user" });
        }
    });
}

