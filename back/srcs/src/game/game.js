let gameState = {
    lpY: 300,
    rpY: 300,
    bx: 750,
    by: 350,
    bsX: 12,
    bsY: 12,
};

let players = {
    left: null,
    right: null,
};

let waitingQueue = []; // Queue for matchmaking
let gameLoopRunning = false;

function game_logic(socket, fastify) {
    console.log("client connected", socket.id);

    // Add player to queue
    socket.on("requestMatch", () => {
        waitingQueue.push(socket.id);
        console.log("Player added to queue:", socket.id);

        if (waitingQueue.length >= 2) {
            const player1 = waitingQueue.shift();
            const player2 = waitingQueue.shift();

            // Assign paddles
            players.left = player1;
            players.right = player2;

            // Notify players of their paddles
            fastify.io.to(player1).emit("assignPaddle", "left");
            fastify.io.to(player2).emit("assignPaddle", "right");

            // Start the game loop if not already running
            if (!gameLoopRunning) {
                startGameLoop(fastify);
            }

            console.log(`Match started: ${player1} (left) vs ${player2} (right)`);
        }
    });

    // Handle paddle movement
    socket.on("paddleMoving", (data) => {
        if (data.player === "left" && players.left === socket.id) {
            gameState.lpY = data.y;
        } else if (data.player === "right" && players.right === socket.id) {
            gameState.rpY = data.y;
        }

        // Broadcast updated game state to both players
        fastify.io.emit("updateGameState", gameState);
    });

    // Handle player disconnect
    socket.on("disconnect", () => {
        console.log("client disconnected:", socket.id);

        // Remove player from queue if they were waiting
        const index = waitingQueue.indexOf(socket.id);
        if (index !== -1) {
            waitingQueue.splice(index, 1);
            console.log("Player removed from queue:", socket.id);
        }

        // Reset game if a player disconnects
        if (players.left === socket.id || players.right === socket.id) {
            players.left = null;
            players.right = null;
            gameState = {
                lpY: 300,
                rpY: 300,
                bx: 750,
                by: 350,
                bsX: 12,
                bsY: 12,
            };
            fastify.io.emit("resetGame");
            console.log("Game reset due to player disconnect");
        }
    });
}

function startGameLoop(fastify) {
    if (gameLoopRunning) return;
    gameLoopRunning = true;

    const tickRate = 60;
    const updateRate = 30; // Send updates 30 times per second
    const paddleWidth = 11; // Define paddleWidth
    const radius = 5; // Define radius for ball collision
    let lastUpdate = Date.now();

    setInterval(() => {
        // Update ball position
        gameState.bx += gameState.bsX;
        gameState.by += gameState.bsY;

        // Ball collision with top and bottom walls
        if (gameState.by <= 0 || gameState.by >= 700) {
            gameState.bsY *= -1;
        }

        // Ball collision with paddles
        if (
            gameState.bx <= paddleWidth &&
            gameState.by >= gameState.lpY &&
            gameState.by <= gameState.lpY + 100
        ) {
            gameState.bx = paddleWidth + radius;
            gameState.bsX *= -1;
        }

        if (
            gameState.bx >= 1500 - paddleWidth &&
            gameState.by >= gameState.rpY &&
            gameState.by <= gameState.rpY + 100
        ) {
            gameState.bx = 1500 - paddleWidth - radius;
            gameState.bsX *= -1;
        }

        // Ball out of bounds (reset)
        if (gameState.bx <= 0 || gameState.bx >= 1500) {
            gameState.bx = 750;
            gameState.by = 350;
            gameState.bsX = 12;
            gameState.bsY = 12;
        }

        // Broadcast updates at a reduced rate
        if (Date.now() - lastUpdate >= 1000 / updateRate) {
            fastify.io.emit("updateGameState", gameState);
            lastUpdate = Date.now();
        }
    }, 1000 / tickRate);
}

module.exports = { game_logic };