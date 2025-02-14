const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('@fastify/jwt');
const path = require('path');
const fs = require('fs')
const { error } = require('console');
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
    });


    fastify.get('/profile',{preHandler:[fastify.authenticate]},async (request,reply) => {
        
        const {userId} = request.user
        const user = await prisma.user.findUnique({
            where: { id : userId }
        });

        return reply.code(200).send(user)
    
    })
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

    fastify.post('/api/:login/upload', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        if (!request.isMultipart()) {
            return reply.code(400).send({ error: "Request is not multipart" });
        }
    
        const parts = request.parts();
        let file;
        let type;
    
        for await (const part of parts) {
            if (part.file) {
                file = part;
            } else if (part.fieldname === 'type') {
                type = part.value;
            }
        }
    
        const { userId } = request.user;
        const { login } = request.params;
    
        if (!file || !type) {
            return reply.code(400).send({ error: "File and type are required" });
        }
    
        try {
            const user = await prisma.user.findUnique({
                where: { login }
            });
    
            if (!user || user.id !== userId) {
                return reply.code(403).send({ error: "Unauthorized access" });
            }
    
            if (!file.filename.endsWith('.png')) {
                return reply.status(400).send({ error: 'Invalid file type, only .png allowed' });
            }
    
            let uploadPath;
            if (type === "profilepic") {
                uploadPath = path.join(__dirname, '../uploads/', `${login}.png`);
            } else {
                uploadPath = path.join(__dirname, '../uploads', `${login}_${file.filename}`);
            }
    
            const fileStream = fs.createWriteStream(uploadPath);
            file.file.pipe(fileStream);
    
            return reply.code(200).send({
                message: "File uploaded successfully",
                path: uploadPath
            });
        } catch (err) {
            return reply.code(500).send({ error: "File upload failed" });
        }
    });

    fastify.post('/upload', async (request, reply) => {
    const data = await request.file(); // Get the uploaded file
    if (!data) {
        return reply.code(400).send({ error: "No file uploaded" });
    }

    // Save the file to the uploads directory
    const fileStream = fs.createWriteStream(`./uploads/${data.filename}`);
    data.file.pipe(fileStream);

    return reply.send({ message: "File uploaded successfully", filename: data.filename });
    });

    fastify.put('/api/:login/change_password', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { userId } = request.user; 
        const { password } = request.body;
        const { login } = request.params;
    
        try {

            const user = await prisma.user.findUnique({
                where: { login }
            });
    
            if (!user || user.id !== userId) {
                return reply.code(403).send({ error: "Unauthorized access" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            });
    
            return reply.code(200).send({ success: true });
    
        } catch (err) {
            console.error("bad trip:", err);
            reply.code(500).send({ error: "Internal Server Error" });
        }
    });

    fastify.put('/user/:login', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        // khas check l login wach s7i7 maybe use login  as paramiter in jwt (maybeeeee :( )
        const { id } = request.params;
        const { email, name,login} = request.body;
        const { userId } = request.user; 
    
        if (parseInt(id) !== userId) {
            console.log('ha wahed l hacker ');
            console.log("userId:", userId, "id:", id);
    
            return reply.code(403).send({
                error: "wach nta hacker"
            });
        }
        // if there is no name or email
        if (!email || !name || !login) {
            return reply.code(400).send({ error: 'Invalid input' });
        }
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: userId },
                data: { email, name, password: hashedPassword }
            });
            return reply.code(200).send({ success: true });
        } catch (err) {
            console.error('Error updating user:', err);
            reply.code(500).send({ error: "Error updating user" });
        }
    });

    fastify.delete('/user/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { userId } = request.user;
        try {
            await prisma.user.delete({
                where: { id: userId }
            });
            return { success: true };
        } catch (err) {
            console.error('Error deleting user:', err);
            reply.code(500).send({ error: "badtrip" });
        }
    });
}

