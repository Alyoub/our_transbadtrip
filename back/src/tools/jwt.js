const jwt = require('jsonwebtoken');

module.exports = class jwt {
    constructor(key,time,op){
        this.key = key;
        this.time = time;
        this.op = op;
    }
    async generate(user){
        return {yasalam:'zeb' , user};
    }

    async verify(token){
        // verify token algo 
        return token

    }

}