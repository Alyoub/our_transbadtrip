const path = require('path');
const bcrypt = require('bcrypt');
const { prisma } = require('./db');
const fs = require('fs');
async function delete_(request,reply){
    const { userId } = request.user;
    try {
        await prisma.user.delete({
            where: { id: userId }
        });
        const token = "bslama";
        reply.header('Set-Cookie', [
            `jwt=${token}; Max-Age=900000; Path=/; SameSite=None; Secure`,
            'Max-Age=3600000; Path=/; SameSite=None; Secure'
        ]);
    } catch (err) {
        //console.error('Error deleting user:', err);
        reply.code(500).send({ error: "badtrip" });
    }
}

async function update_(request, reply){
    const { login: urllogin } = request.params;
    const { new_email, new_name, new_login } = request.body;
    const { userId } = request.user;

    const user = await prisma.user.findUnique({
        where: { login: urllogin },
    });

    if (!user || parseInt(user.id) !== userId || urllogin !== user.login) {
        //console.log('Unauthorized access attempt');
        //console.log("userId:", userId, "id:", user.id);
        return reply.code(403).send({
            error: "Unauthorized access"
        });
    }

    if (!new_email && !new_name && !new_login) {
        return reply.code(400).send({ error: 'Invalid input' });
    }

    try {
        let updateData = {};

        if (new_email) {
            updateData.email = new_email;
        }
        if (new_login) {
            updateData.login = new_login;
        }
        if (new_name) {
            updateData.name = new_name;
        }

        await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return reply.code(200).send({ success: true });
    } catch (err) {
        //console.error('Error updating user:', err);
        reply.code(500).send({ error: "Error updating user" });
    }
}

async function change_password(request , reply ){
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
        //console.error("bad trip:", err);
        reply.code(500).send({ error: "Internal Server Error" });
    }
};


async function upload_(request, reply) {
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
        const allowedImageTypes = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];
        const fileExtension = path.extname(file.filename).toLowerCase();
        
        if (!allowedImageTypes.includes(fileExtension)) {
            return reply.status(400).send({ error: 'Invalid file type, only image files are allowed' });
        }
        
        let uploadPath;
        if (type === "profilepic") {
            uploadPath = path.join(__dirname, '../../uploads/', `${login}${fileExtension}`);
        } else if (type === "wallpaper") {
            uploadPath = path.join(__dirname, '../../uploads/', `${login}_wallpaper${fileExtension}`);
        } else {
            uploadPath = path.join(__dirname, '../../uploads', `${login}_${file.filename}`);
        }
        
        const fileStream = fs.createWriteStream(uploadPath);
        file.file.pipe(fileStream);
        
        let updateData = {};
        if (type === "profilepic") {
            updateData.profilePicPath = uploadPath;
        } else if (type === "wallpaper") {
            updateData.wallpaperPath = uploadPath;
        }
        
        await prisma.user.update({
            where: { login },
            data: updateData
        });
        
        return reply.code(200).send({
            message: "File uploaded successfully",
            path: uploadPath
        });
    } catch (err) {
        console.error(err);
        return reply.code(500).send({ error: "File upload failed" });
    }
}

module.exports = {upload_,change_password,update_,delete_};