const {prisma} = require("../user/db");

async function inviteToGame(req , reply){
    const user_id = req.user.userId;
    const {invitedId} = req.body;

    try{
        if(user_id === invitedId){
            return reply.code(400).send({error : "you can't invite yourself"});
        }
        const user = await prisma.user.findUnique({where : {id : invitedId}});
        if(user === null){
            return reply.code(404).send({error : "user not found"});
        }
        
        // return reply.code(201).send({message : "user invited successfully"});
    }catch(err){
        console.error("error inviting user : ", err);
        return reply.code(500).send({error : "error inviting user", err});
    }
}