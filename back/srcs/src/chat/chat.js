const { prisma } = require("../user/db");

function chat (connection, req) {

  
  connection.on('message', message => {
      connection.send('Hello from server dear: ' + message);
  });
  
  connection.on('close', () => {
      console.log('Connection closed');
  });
}

module.exports = {chat}