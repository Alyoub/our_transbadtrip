const crypto = require('crypto');
const { prisma } = require('../user/db'); // Adjust the path as needed
const nodemailer= require('nodemailer');

class smtp {
    constructor(params) {
        this.host = params.host;
        this.port = params.port;
        this.user = params.user;
        this.pass = params.pass;
        this.secure = params.secure;
        this.from = params.from || 'test@test.com';
    }

    async send(params) {
        const transporter = nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: this.secure, // Set secure to true for port 465, false for port 587
            auth: {
                user: this.user,
                pass: this.pass,
            },
            tls: {
                // Explicitly set the TLS version
                minVersion: 'TLSv1.2'
            },
            debug: true, // Enable debug output
            logger: true 
        });

        try {
            await transporter.sendMail({
                from: params.sender,
                to: params.to,
                subject: params.subject,
                html: params.body,
            });
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    async forget_pass(email) {
        const token = crypto.randomBytes(32).toString('hex');
        const resetUrl = `http://localhost:3000/reset_password/${email}/${token}`;
        await prisma.user.update({
            where: { email },
            data: { resetToken: token, resetTokenExpiry:new Date( Date.now() + 3600000 )} 
        });

        await this.send({
            sender: this.from,
            to: email,
            subject: 'Reset Your Password',
            body: `Click <a href="${resetUrl}">here</a> to loge in to your acount `,
        });
    }
}

const SMTP = new smtp({
    host: '',
    port: 587, 
    user: '',
    pass: '',
    secure: false, 
    from : ''
});

module.exports = { SMTP };