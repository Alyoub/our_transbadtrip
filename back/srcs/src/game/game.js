let gameState = {
    leftPaddleY: 300,
    rightPaddleY: 300,
    ballX: 750,
    ballY: 350,
    ballSpeedX: 8,
    ballSpeedY: 8,
};

let players = {
    left: null,
    right: null,
};

let waitingQueue = []; // Queue for matchmaking
let gameLoopRunning = false;


    function game_logic(socket, fastify) {
        console.log("client connected", socket.id);

      // hna kat add player l q
        socket.on("requestMatch", () => {
        waitingQueue.push(socket.id);
        console.log("Player added to queue:", socket.id);
        if (waitingQueue.length >= 2) {
            const player1 = waitingQueue.shift();
            const player2 = waitingQueue.shift();

            // Assign paddles
            players.left = player1;
            players.right = player2;

            // kat3lame l players
            fastify.io.to(player1).emit("assignPaddle", "left");
            fastify.io.to(player2).emit("assignPaddle", "right");

            // Start the game loop if not already running
            if (!gameLoopRunning) 
            {
                startGameLoop();
            }

            console.log(`Match started: ${player1} (left) vs ${player2} (right)`);
          }
        });
      
        // Handle paddle movement
        socket.on("paddleMoving", (data) => {
            if (data.player === "left" && players.left === socket.id) 
            {
                gameState.leftPaddleY = data.y;
            } 
            else if (data.player === "right" && players.right === socket.id) 
            {
                gameState.rightPaddleY = data.y;
            }
            fastify.io.emit("gameState", gameState);
        });

    
        socket.on("disconnect", () => {
            console.log("client disconnected:", socket.id);

            // Remove player man l q ila deconecta
            const index = waitingQueue.indexOf(socket.id);
            if (index !== -1) {
                waitingQueue.splice(index, 1);
                console.log("Player removed from queue:", socket.id);
            }

            // reste l game ila l player deconecta
            if (players.left === socket.id || players.right === socket.id) {
                players.left = null;
                players.right = null;
                gameState = {
                    leftPaddleY: 300,
                    rightPaddleY: 300,
                    ballX: 750,
                    ballY: 350,
                    ballSpeedX: 8,
                    ballSpeedY: 8,
                };
                fastify.io.emit("resetGame");
                console.log("Game reset due to player disconnect");
            }
        });
    };


function startGameLoop() {
    if (gameLoopRunning) return;
    gameLoopRunning = true;

    const tickRate = 60;
    const radius = 5;
    const paddleWidth = 11;

    setInterval(() => {
        gameState.ballX += gameState.ballSpeedX;
        gameState.ballY += gameState.ballSpeedY;

        if (gameState.ballY <= 0 || gameState.ballY >= 700) {
            gameState.ballSpeedY *= -1;
        }

        // Ball collision with paddles
        if (
            gameState.ballX <= paddleWidth &&
            gameState.ballY >= gameState.leftPaddleY &&
            gameState.ballY <= gameState.leftPaddleY + 100
        ) {
            gameState.ballX = paddleWidth + radius;
            const paddleCenterY = gameState.leftPaddleY + 50;
            const relativeIntersectY = paddleCenterY - gameState.ballY;
            const normalizedIntersectY = relativeIntersectY / 50;
            const bounceAngle = normalizedIntersectY * 0.75;
            const speed = Math.sqrt(gameState.ballSpeedX ** 2 + gameState.ballSpeedY ** 2);
            gameState.ballSpeedX = speed * Math.cos(bounceAngle);
            gameState.ballSpeedY = -speed * Math.sin(bounceAngle);
        }

        if (
            gameState.ballX >= 1500 - paddleWidth &&
            gameState.ballY >= gameState.rightPaddleY &&
            gameState.ballY <= gameState.rightPaddleY + 100
        ) {
            gameState.ballX = 1500 - paddleWidth - radius;
            const paddleCenterY = gameState.rightPaddleY + 50;
            const relativeIntersectY = paddleCenterY - gameState.ballY;
            const normalizedIntersectY = relativeIntersectY / 50;
            const bounceAngle = normalizedIntersectY * 0.75;
            const speed = Math.sqrt(gameState.ballSpeedX ** 2 + gameState.ballSpeedY ** 2);
            gameState.ballSpeedX = -speed * Math.cos(bounceAngle);
            gameState.ballSpeedY = -speed * Math.sin(bounceAngle);
        }

        if (gameState.ballX <= 0 || gameState.ballX >= 1500) {
            gameState.ballX = 750;
            gameState.ballY = 350;
            gameState.ballSpeedX = 12;
            gameState.ballSpeedY = 12;
        }

        fastify.io.emit("gameState", gameState);
    }, 1000 / tickRate);
}

module.exports = {game_logic};