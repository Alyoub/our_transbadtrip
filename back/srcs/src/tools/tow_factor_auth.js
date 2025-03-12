// https://docs.npmjs.com/configuring-two-factor-authentication
//https://rahulomnitrics.medium.com/integrate-google-authenticator-app-with-nodejs-two-factor-authentication-77426e2353dc

// for security https://hub.docker.com/r/owasp/modsecurity firewall

const speakeasy = require('speakeasy'); // https://www.npmjs.com/package/speakeasy
const QRcode = require('qrcode'); // https://www.npmjs.com/package/qrcode
const {prisma} = require('../user/db');

class Tow_Facor_Auth{
    
    static async activate(params){
        try{
            const {userId } = params.request.user;
            if(params.body.activate = true){
                await prisma.user.update({
                    where: {id:userId},
                    data: {tfa:true},
                });}
            else{
                await prisma.user.update({
                    where: {id:userId},
                    data: {tfa:false},
                });
            }
            return reply.code(200).send({suc:'goodtrip'});
            
        }catch(err){
            console.log("bad trip err ",err);
            return params.reply.code(89).send({error:'bad trip',err});
        }
    }

    static  async generate(params) {
        // generate secret 

        // const token = speakeasy.generateSecret();
        try{
                const token = speakeasy.totp({
                    secret : secret.base32,
                    encoding: 'base32'
                });
                await prisma.update({
                    where:{
                        userId : params.user.userId
                    },
                    data:{
                        tfa_key : token
                    }
                })

                return params.reply.code(200).send({
                    goodtrip: 'hadchi khdam',
                    token : token 
                });
            }catch(err){
                console.log("error bad trip",err);
                return params.reply.code(500).send({
                    error: "w9a3 chi error fe hadchi "
                })
            }
        // save to databse 
    }

    static async Verify(params){
        try{
            var verify = speakeasy.verify({
                secret : secret.base32,
                token: params.request.body.otp,
                window: 6
            });
            if(verify){
                return params.reply.code(200).send({
                    yaslam: 'good trip',
                });
            } else{
                return params.reply.code(300).send({
                    badtrip: "wach nta hacker"
                });
            }
        } catch(err){
            console.log("bad trip: ",err);
            return  params.reply.code(500).send({
                error: "baaad trip",
                err
            })
        }
    }
}

module.exports = {Tow_Facor_Auth};