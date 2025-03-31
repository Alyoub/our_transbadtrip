const {prisma} = require('./db');

class HandleFriends {
    constructor(request, reply) {
        this.request = request;
        this.reply = reply;
        this.prisma = prisma;
    }

    async addFriend() {
        const { friendId } = this.request.body;
        const { userId } = this.request.user;

        if (userId === friendId) {
            return this.reply.code(400).send({ error: "You cannot add yourself as a friend." });
        }

        try {
            const friendRequest = await this.prisma.friends.create({
                data: { userId, friendId, accepted: false, date: Math.floor(Date.now() / 1000) },
            });

            return this.reply.code(201).send({ message: "Friend request sent.", friendRequest });
        } catch (error) {
            if (error.code === 'P2002') {
                return this.reply.code(400).send({ error: "Friend request already exists." });
            }
            //// console.error('Error adding friend:', error);
            return this.reply.code(500).send({ error: "Internal server error" });
        }
    }

    async friendRequests() {
        const { userId } = this.request.user;

        const requests = await this.prisma.friends.findMany({
            where: { friendId: userId, accepted: false },
            include: { user: true },
        });

        return this.reply.code(200).send({
            message: requests.length ? "Incoming friend requests." : "No incoming friend requests.",
            requests,
        });
    }

    async acceptFriend() {
        const { userId } = this.request.user;
        const { friendId } = this.request.body;

        const friendRequest = await this.prisma.friends.findFirst({
            where: { userId: friendId, friendId: userId, accepted: false },
        });

        if (!friendRequest) {
            return this.reply.code(404).send({ error: "Friend request not found." });
        }

        await this.prisma.friends.update({
            where: { id: friendRequest.id },
            data: { accepted: true, date: Math.floor(Date.now() / 1000) },
        });

        return this.reply.code(200).send({ message: "Friend request accepted." });
    }

    async listRequests() {
        const { userId } = this.request.user;

        const requests = await this.prisma.friends.findMany({
            where: { userId, accepted: false },
            include: { friend: true },
        });

        return this.reply.code(200).send({
            message: requests.length ? "Outgoing friend requests." : "No outgoing friend requests.",
            requests,
        });
    }

    async cancelFriend() {
        const { userId } = this.request.user;
        const { friendId } = this.request.body;

        const requestExists = await this.prisma.friends.findFirst({
            where: { userId, friendId, accepted: false },
        });

        if (!requestExists) {
            return this.reply.code(404).send({ error: "Friend request not found." });
        }

        await this.prisma.friends.delete({ where: { id: requestExists.id } });

        return this.reply.code(200).send({ message: "Friend request canceled." });
    }

    async removeFriend() {
        const { userId } = this.request.user;
        const { friendId } = this.request.body;

        const friendship = await this.prisma.friends.findFirst({
            where: {
                OR: [
                    { userId, friendId, accepted: true },
                    { userId: friendId, friendId: userId, accepted: true },
                ],
            },
        });

        if (!friendship) {
            return this.reply.code(404).send({ error: "Friendship not found." });
        }

        await this.prisma.friends.delete({ where: { id: friendship.id } });

        return this.reply.code(200).send({ message: "Friend removed." });
    }

    async listFriends() {
        const { userId } = this.request.user;

        const friendships = await this.prisma.friends.findMany({
            where: {
                OR: [
                    { userId, accepted: true },
                    { friendId: userId, accepted: true },
                ],
            },
            include: { user: true, friend: true },
        });

        const friends = friendships.map(friendship =>
            friendship.userId === userId ? friendship.friend : friendship.user
        );

        return this.reply.code(200).send({
            message: friends.length ? "Friends list." : "You have no friends yet.",
            friends,
        });
    }
}

module.exports = { HandleFriends };