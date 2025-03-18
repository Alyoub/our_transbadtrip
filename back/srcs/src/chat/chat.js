const { prisma } = require("../user/db");

const connections = new Map();


function chat(connection, req) {
  const userId = req.user.userId;
  connections.set(userId, connection);
  
  connection.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
    }
    catch (error) {
      console.error('Error parsing message:', error);
      return connection.send(JSON.stringify({ error: "Invalid message" }));
    }
    const { text, receiverId } = parsedMessage;
    const senderId = req.user.userId;
    const isBlocked = await prisma.blockedUser.findFirst({
      where: {
        OR : [
          {
            blockerId: receiverId,
            blockedId: senderId,
          },
          {
            blockerId: senderId,
            blockedId: receiverId,
          },
        ],
      },
    });
    if (isBlocked) {
      return connection.send(JSON.stringify({ error: "You are blocked, or you blocked this user" }));
    }

    try {
      const chat = await prisma.message.create({
        data: {
          text,
          senderId,
          receiverId,
        },
      });
      const receiverConnection = connections.get(receiverId);
      if (receiverConnection && receiverConnection.readyState === WebSocket.OPEN) {
        receiverConnection.send(JSON.stringify({ senderId, text }));
      }
  
    }
    catch (error) {
      console.error('Error sending message:', error);
    }
  });
  connection.on("close", () => {
    connections.delete(userId);
    console.log("Connection closed");
  });
}

async function load_conversation(req, reply) {
  const userId = req.user.userId;
  const { login } = req.params;
  try {
    const user = await prisma.user.findFirst({ where: { login } });
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: user.id,
          },
          {
            senderId: user.id,
            receiverId: userId,
          },
        ],
      },
      orderBy: { createdAt: 'asc' }, // Order by timestamp
    });
    reply.send(messages);
  } catch (err) {
    console.error('Error loading conversation:', err);
    reply.status(500).send({ error: "An error occurred while loading conversation" });
  }
}

module.exports = { chat, load_conversation};
