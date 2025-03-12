//https://rahulomnitrics.medium.com/integrate-google-authenticator-app-with-nodejs-two-factor-authentication-77426e2353dc

// for security https://hub.docker.com/r/owasp/modsecurity firewall

const speakeasy = require('speakeasy'); // https://www.npmjs.com/package/speakeasy
const QRcode = require('qrcode'); // https://www.npmjs.com/package/qrcode
const {prisma} = require('../user/db');


class Two_Factor_Auth {

    static async activate(params) {
        try {
            const { userId } = params.request.user; 
            if (typeof params.request.body.activate !== 'boolean') {
                return params.reply.code(400).send({ error: 'Invalid request: activate must be a boolean' });
            }
            await prisma.user.update({
                where: { id: userId },
                data: { tfa: params.request.body.activate },
            });

            return params.reply.code(200).send({ success: '2FA status updated successfully' });
        } catch (err) {
            console.error("Error updating 2FA status: ", err);
            return params.reply.code(500).send({ error: 'Failed to update 2FA status', err });
        }
    }

    static async generate(params) {
        try {
            const { userId } = params.request.user;

            const secret = speakeasy.generateSecret({
                length: 20,
            });

            const token = speakeasy.totp({
                secret: secret.base32,
                encoding: 'base32',
            });

            await prisma.user.update({
                where: { id: userId },
                data: { tfa_key: secret.base32 },
            });

            const qr_url = await QRcode.toDataURL(secret.otpauth_url);

            return params.reply.code(200).send({
                success: '2FA secret generated successfully',
                secret: secret.base32, 
                qr_url: qr_url, 
            });
        } catch (err) {
            console.error("Error generating 2FA secret: ", err);
            return params.reply.code(500).send({
                error: "Failed to generate 2FA secret",
            });
        }
    }

    static async verify(params) {
        try {
            const { userId } = params.request.user;
            const { otp } = params.request.body;

            if (!otp || typeof otp !== 'string') {
                return params.reply.code(400).send({ error: 'Invalid OTP' });
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { tfa_key: true },
            });

            if (!user || !user.tfa_key) {
                return params.reply.code(400).send({
                    error: "2FA not set up for this user",
                });
            }

            const isVerified = speakeasy.totp.verify({
                secret: user.tfa_key,
                token: otp,
                encoding: 'base32',
                window: 6, 
            });

            if (isVerified) {
                return params.reply.code(200).send({
                    success: '2FA token verified successfully',
                });
            } else {
                return params.reply.code(400).send({
                    error: "Invalid 2FA token",
                });
            }
        } catch (err) {
            console.error("Error verifying 2FA token: ", err);
            return params.reply.code(500).send({
                error: "Failed to verify 2FA token",
                err,
            });
        }
    }
}

module.exports = { Two_Factor_Auth };