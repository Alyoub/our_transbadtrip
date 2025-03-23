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


    socket.on("requestMatch", () => {
        waitingQueue.push(socket.id);
        //console.log("Player added to queue:", socket.id);

        if (waitingQueue.length >= 2) {
            const player1 = waitingQueue.shift();
            const player2 = waitingQueue.shift();

            // Create a new game instance
            const game = new Game(player1, player2);
            activeGames.push(game);

            // Start the game
            game.start(fastify);
        }
    });


    socket.on("paddleMoving", (data) => 
    {
        const game = activeGames.find((g) => g.players.left === socket.id || g.players.right === socket.id);
        if (game) 
        {
            if (data.player === "left" && game.players.left === socket.id) {
                game.gameState.leftPaddleY = data.y;
            } else if (data.player === "right" && game.players.right === socket.id) {
                game.gameState.rightPaddleY = data.y;
            }
        }
    });
    socket.on("joinTournament", async () => {
        const tournament = await createTournament([socket.id]);
        socket.emit("tournamentJoined", tournament);
    });
    
    socket.on("matchResult", async (data) => {
        const { matchId, winnerId } = data;
        await updateMatchWinner(matchId, winnerId);
    
        const match = await prisma.match.findUnique({ where: { id: matchId } });
        const tournament = await prisma.tournament.findUnique({
            where: { id: match.tournamentId },
        });
    
        if (tournament) {
            const updatedTournament = await prisma.tournament.update({
                where: { id: tournament.id },
                data: { winnerId },
            });
            socket.emit("tournamentUpdated", updatedTournament);
        }
    });
    socket.on("disconnect", () => {
        //console.log("client disconnected:", socket.id);

        const indexInQueue = waitingQueue.indexOf(socket.id);
        if (indexInQueue !== -1) 
        {
            waitingQueue.splice(indexInQueue, 1);
            //console.log("Player removed from queue:", socket.id);
        }

        const gameIndex = activeGames.findIndex((g) => g.players.left === socket.id || g.players.right === socket.id);
        if (gameIndex !== -1) {
            const [removedGame] = activeGames.splice(gameIndex, 1);

            removedGame.stopGameLoop();

            const otherPlayer =
                removedGame.players.left === socket.id
                    ? removedGame.players.right
                    : removedGame.players.left;
            if (otherPlayer) 
            {
                fastify.io.to(otherPlayer).emit("gameEnded", "Opponent disconnected");
                //console.log("Game ended due to player disconnect");
            }
        }
    });
}

module.exports = { game_logic };