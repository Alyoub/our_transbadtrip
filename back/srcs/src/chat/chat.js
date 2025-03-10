const { prisma } = require("../user/db");

function chat(connection, req) {
  // console.log("request.user", req.user);
  connection.on("message", async (message) => {
    const parsedMessage = JSON.parse(message);
    console.log("parsedMessage", parsedMessage.type);
    connection.send("Hello from server dear: " + message);
  });

  connection.on("close", () => {
    console.log("Connection closed");
  });
}

module.exports = { chat };
