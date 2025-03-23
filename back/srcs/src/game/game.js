
const {prisma} = require('../user/db')
class Game {
    constructor(player1, player2) {
        this.players = {
            left: player1,
            right: player2,
        };
        this.gameState = {
            leftPaddleY: 300,
            rightPaddleY: 300,
            ballX: 750,
            ballY: 350,
            ballSpeedX: 8,
            ballSpeedY: 8,
        };
        this.gameLoopRunning = false;
        this.intervalId = null;
    }

    start(fastify) {
        fastify.io.to(this.players.left).emit("assignPaddle", "left");
        fastify.io.to(this.players.right).emit("assignPaddle", "right");

        if (!this.gameLoopRunning) {
            this.startGameLoop(fastify);
        }

        //console.log(`Match started: ${this.players.left} (left) vs ${this.players.right} (right)`);
    }

    startGameLoop(fastify) {
        if (this.gameLoopRunning) return;
        this.gameLoopRunning = true;

        const tickRate = 60;
        const radius = 5;
        const paddleWidth = 11;

        this.intervalId = setInterval(() => {
            if (!this.players.left || !this.players.right) 
            {
                this.stopGameLoop();
                return;
            }

            this.gameState.ballX += this.gameState.ballSpeedX;
            this.gameState.ballY += this.gameState.ballSpeedY;

            if (this.gameState.ballY <= 0 || this.gameState.ballY >= 700) {
                this.gameState.ballSpeedY *= -1;
            }

            // Ball collision with paddles
            if (
                this.gameState.ballX <= paddleWidth &&
                this.gameState.ballY >= this.gameState.leftPaddleY &&
                this.gameState.ballY <= this.gameState.leftPaddleY + 100
            ) {
                this.gameState.ballX = paddleWidth + radius;
                const paddleCenterY = this.gameState.leftPaddleY + 50;
                const relativeIntersectY = paddleCenterY - this.gameState.ballY;
                const normalizedIntersectY = relativeIntersectY / 50;
                const bounceAngle = normalizedIntersectY * 0.75;
                const speed = Math.sqrt(this.gameState.ballSpeedX ** 2 + this.gameState.ballSpeedY ** 2);
                this.gameState.ballSpeedX = speed * Math.cos(bounceAngle);
                this.gameState.ballSpeedY = -speed * Math.sin(bounceAngle);
            }

            if (
                this.gameState.ballX >= 1500 - paddleWidth &&
                this.gameState.ballY >= this.gameState.rightPaddleY &&
                this.gameState.ballY <= this.gameState.rightPaddleY + 100
            ) {
                this.gameState.ballX = 1500 - paddleWidth - radius;
                const paddleCenterY = this.gameState.rightPaddleY + 50;
                const relativeIntersectY = paddleCenterY - this.gameState.ballY;
                const normalizedIntersectY = relativeIntersectY / 50;
                const bounceAngle = normalizedIntersectY * 0.75;
                const speed = Math.sqrt(this.gameState.ballSpeedX ** 2 + this.gameState.ballSpeedY ** 2);
                this.gameState.ballSpeedX = -speed * Math.cos(bounceAngle);
                this.gameState.ballSpeedY = -speed * Math.sin(bounceAngle);
            }

            if (this.gameState.ballX <= 0 || this.gameState.ballX >= 1500) {
                this.gameState.ballX = 750;
                this.gameState.ballY = 350;
                this.gameState.ballSpeedX = 12;
                this.gameState.ballSpeedY = 12;
            }

         
            if (this.players.left && this.players.right) 
            {
                fastify.io.to(this.players.left).emit("gameState", this.gameState);
                fastify.io.to(this.players.right).emit("gameState", this.gameState);
            }
        }, 1000 / tickRate);
    }

    stopGameLoop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.gameLoopRunning = false;
            this.intervalId = null;
            //console.log("game loop stop:", this.players.left, this.players.right);
        }
    }
}

let waitingQueue = [];
let activeGames = []; 


function game_logic(socket, fastify) {
    //console.log("client connected", socket.id);

    socket.on("jwt", async (token) => {
        try {
            const decoded = jwt.verify(token, 'your_secret_key'); // Replace 'your_secret_key' with your actual secret key
            const userId = decoded.userId;

            // Save the user ID and socket ID to the database
            await prisma.user.update({
                where: { id: userId },
                data: { socketId: socket.id }
            });

            // Store the userId in the socket object
            socket.userId = userId;

            // Emit a success message back to the client
            socket.emit("jwtVerified", { success: true, userId });
        } catch (error) {
            // Emit an error message back to the client
            socket.emit("jwtVerified", { success: false, message: "Invalid token" });
        }
    });

    socket.on("requestMatch", () => {
        waitingQueue.push(socket);

        if (waitingQueue.length >= 2) {
            const player1 = waitingQueue.shift();
            const player2 = waitingQueue.shift();

            // Create a new game instance
            const game = new Game(player1.userId, player2.userId);
            activeGames.push(game);

            // Start the game
            game.start(fastify);
        }
    });

    socket.on("paddleMoving", (data) => {
        const game = activeGames.find((g) => g.players.left === socket.userId || g.players.right === socket.userId);
        if (game) {
            if (data.player === "left" && game.players.left === socket.userId) {
                game.gameState.leftPaddleY = data.y;
            } else if (data.player === "right" && game.players.right === socket.userId) {
                game.gameState.rightPaddleY = data.y;
            }
        }
    });

    socket.on("disconnect", () => {
        const indexInQueue = waitingQueue.indexOf(socket);
        if (indexInQueue !== -1) {
            waitingQueue.splice(indexInQueue, 1);
        }

        const gameIndex = activeGames.findIndex((g) => g.players.left === socket.userId || g.players.right === socket.userId);
        if (gameIndex !== -1) {
            const [removedGame] = activeGames.splice(gameIndex, 1);

            removedGame.stopGameLoop();

            const otherPlayer =
                removedGame.players.left === socket.userId
                    ? removedGame.players.right
                    : removedGame.players.left;
            if (otherPlayer) {
                fastify.io.to(otherPlayer).emit("gameEnded", "Opponent disconnected");
            }
        }
    });
}

module.exports = { game_logic };