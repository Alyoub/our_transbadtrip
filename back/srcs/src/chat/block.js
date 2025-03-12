const { prisma } = require("../user/db");


async function blockUser(req , reply){
    const { user_id } = req.user;
    const { blockedId } = req.body;

    try {
        await prisma.blockedUser.create({
            data: {
                blockerId: user_id,
                blocked_id: blockedId
            }
        });
        return reply.code(201).send({message: "user blocked successfully"});
    } catch (err)
    {
        console.error("error blocking user : " , err);
        return reply.code(500).send({error: "error blocking user ouff"});
    }
}

async function unblockUser(req , reply){
    const { user_id } = req.user;
    const { blockedId } = req.body;

    try {
        await prisma.blockedUser.deleteMany({
            where: {
                blockerId: user_id,
                blocked_id: blockedId
            }
        });
        return reply.code(200).send({message: "user unblocked successfully"});
    } catch (err)
    {
        console.error("error unblocking user : " , err);
        return reply.code(500).send({error: "error unblocking user ouff"});
    }
}

module.exports = {blockUser , unblockUser}


