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
            secure: this.secure, 
            auth: {
                user: this.user,
                pass: this.pass,
            },
            tls: {
                minVersion: 'TLSv1.2'
            },
            debug: true, 
            logger: true 
        });

        try {
            await transporter.sendMail({
                from: params.sender,
                to: params.to,
                subject: params.subject,
                html: params.body,
            });
            // console.log('Email sent successfully');
        } catch (error) {
            // console.error('Error sending email:', error);
        }
    }

    async forget_pass(email) {
        const token = crypto.randomBytes(32).toString('hex');
        const resetUrl = `https://localhost/api/reset_password/${email}/${token}`;
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
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT, 
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    secure: false, 
    from : process.env.SMTP_SENDER
});

module.exports = { SMTP };