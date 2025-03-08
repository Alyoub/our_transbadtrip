
function zeb (connection, req) {
  connection.on('message', message => {
      connection.send('Hello Fastify WebSockets');
  });
}

module.exports = {zeb}