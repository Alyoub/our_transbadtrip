const { prisma } = require("../user/db");


async function blockUser(req, reply) {
    const user_id = req.user.userId;
    const { blockedId } = req.body;

    try {

        if (user_id === blockedId) {
            return reply.code(400).send({ error: "you can't block yourself" });
        }
        const user = await prisma.user.findUnique({ where: { id: blockedId } });
        if (user === null) {
            return reply.code(404).send({ error: "user not found" });
        }
        const blocked = await prisma.blockedUser.findFirst({
            where: {
                blockerId: user_id,
                blockedId: blockedId
            }
        });
        if (blocked !== null) {
            return reply.code(400).send({ error: "user already blocked" });
        }
        await prisma.blockedUser.create({
            data: {
                blocker: {
                    connect: {
                        id: user_id
                    }
                },
                blocked: {
                    connect: {
                        id: blockedId
                    }
                }
            }
        });
        return reply.code(201).send({ message: "user blocked successfully" });
    } catch (err) {
        //// console.error("error blocking user : ", err);
        return reply.code(500).send({ error: "error blocking user", err });
    }
}

async function unblockUser(req, reply) {
    const user_id = req.user.userId;
    const { blocked_Id } = req.body;

    try {
        if (user_id === blocked_Id) {
            return reply.code(400).send({ error: "you can't unblock yourself" });
        }
        if (blocked_Id === undefined) {
            return reply.code(400).send({ error: "blocked_Id is required" });
        }
        const user = await prisma.user.findUnique({ where: { id: blocked_Id } });
        if (user === null) {
            return reply.code(404).send({ error: "user not found" });
        }
        const blocked = await prisma.blockedUser.findFirst({
            where: {
                blockerId: user_id,
                blockedId: blocked_Id
            }
        });
        if (blocked === null) {
            return reply.code(400).send({ error: "user not blocked" });
        }
        await prisma.blockedUser.deleteMany({
            where: {
                blockerId: user_id,
                blockedId: blocked_Id
            }
        });
        return reply.code(200).send({ message: "user unblocked successfully" });
    } catch (err) {
        //// console.error("error unblocking user : ", err);
        return reply.code(500).send({ error: "error unblocking user ouff" });
    }
}

module.exports = { blockUser, unblockUser }


