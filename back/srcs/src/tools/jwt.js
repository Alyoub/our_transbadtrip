const jsonwebtoken = require('jsonwebtoken');

class JWT {
    constructor(key, time, algorithm = 'HS256') {
        this.key = key;
        this.time = time;
        this.algorithm = algorithm;
    }

    generate(userId) {
        const data = {
            time: Date.now(),
            userId: userId,
        };
        return jsonwebtoken.sign(data, this.key, { expiresIn: this.time, algorithm: this.algorithm });
    }

    async verify(token) {
        try {
            const decoded = jsonwebtoken.verify(token, this.key, { algorithms: [this.algorithm] });
            return decoded.userId;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
}

module.exports = JWT;