class Game {
    constructor(player1, player2) 
    {

        this.players = 
        {
            left: player1,
            right: player2,
        };
        this.gameState = {
            leftPaddleY: 200,
            rightPaddleY: 200,
            ballX: 500,
            ballY: 250,
            ballSpeedX: 4,
            ballSpeedY: 4,
            leftPlayerScore: 0, 
            rightPlayerScore: 0,
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

        console.log(`Match started: ${this.players.left} (left) vs ${this.players.right} (right)`);
    }

    startGameLoop(fastify) {
        if (this.gameLoopRunning) return;
        this.gameLoopRunning = true;

        const tickRate = 60;
        const radius = 5;
        const paddleWidth = 11;

        this.intervalId = setInterval(() => 
        {
            if (!this.players.left || !this.players.right) 
            {
                this.stopGameLoop();
                return;
            }

            this.gameState.ballX += this.gameState.ballSpeedX;
            this.gameState.ballY += this.gameState.ballSpeedY;

    
            if (this.gameState.ballY <= 0 || this.gameState.ballY >= 500) 
            {
                this.gameState.ballSpeedY *= -1;
            }

    
            if (this.gameState.ballX <= paddleWidth &&  this.gameState.ballY >= this.gameState.leftPaddleY && this.gameState.ballY <= this.gameState.leftPaddleY + 100) 
            {
                this.gameState.ballX = paddleWidth + radius;
                const paddleCenterY = this.gameState.leftPaddleY + 50;
                const relativeIntersectY = paddleCenterY - this.gameState.ballY;
                const normalizedIntersectY = relativeIntersectY / 50;
                const bounceAngle = normalizedIntersectY * 0.75;
                const speed = Math.sqrt(this.gameState.ballSpeedX ** 2 + this.gameState.ballSpeedY ** 2);
                this.gameState.ballSpeedX = speed * Math.cos(bounceAngle);
                this.gameState.ballSpeedY = -speed * Math.sin(bounceAngle);
                this.gameState.ballSpeedX *= 1.08;  
                this.gameState.ballSpeedY *= 1.08;
            }

            if (this.gameState.ballX >= 1000 - paddleWidth &&  this.gameState.ballY >= this.gameState.rightPaddleY &&  this.gameState.ballY <= this.gameState.rightPaddleY + 100) 
            {
                this.gameState.ballX = 1000 - paddleWidth - radius;
                const paddleCenterY = this.gameState.rightPaddleY + 50;
                const relativeIntersectY = paddleCenterY - this.gameState.ballY;
                const normalizedIntersectY = relativeIntersectY / 50;
                const bounceAngle = normalizedIntersectY * 0.75;
                const speed = Math.sqrt(this.gameState.ballSpeedX ** 2 + this.gameState.ballSpeedY ** 2);
                this.gameState.ballSpeedX = -speed * Math.cos(bounceAngle);
                this.gameState.ballSpeedY = -speed * Math.sin(bounceAngle);
                this.gameState.ballSpeedX *= 1.08;  
                this.gameState.ballSpeedY *= 1.08;
            }
            if (this.gameState.ballX < 0) 
            {
                this.gameState.rightPlayerScore++;
                this.resetBall();
        
                fastify.io.to(this.players.left).emit("scoreUpdate", {leftPlayerScore: this.gameState.leftPlayerScore,rightPlayerScore: this.gameState.rightPlayerScore});
                fastify.io.to(this.players.right).emit("scoreUpdate", {leftPlayerScore: this.gameState.leftPlayerScore,rightPlayerScore: this.gameState.rightPlayerScore});
            } 
            else if (this.gameState.ballX > 1000) 
            {
                this.gameState.leftPlayerScore++;
                this.resetBall();
                fastify.io.to(this.players.left).emit("scoreUpdate",{leftPlayerScore: this.gameState.leftPlayerScore,rightPlayerScore: this.gameState.rightPlayerScore});
                fastify.io.to(this.players.right).emit("scoreUpdate", {leftPlayerScore: this.gameState.leftPlayerScore,rightPlayerScore: this.gameState.rightPlayerScore});
            }
            
            if (this.players.left && this.players.right) 
            {
                fastify.io.to(this.players.left).emit("gameState", this.gameState);
                fastify.io.to(this.players.right).emit("gameState", this.gameState);
            }

            if (this.gameState.leftPlayerScore >= 5 || this.gameState.rightPlayerScore >= 5) 
            {
                this.handleGameEnd(fastify);
            }

        }, 1000 / tickRate);
    }

    resetBall() 
    {
        this.gameState.ballX = 500;
        this.gameState.ballY = 250;
        this.gameState.ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
        this.gameState.ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
    }

    handleGameEnd(fastify) 
    {
        // Determine winner
        const winner = this.gameState.leftPlayerScore > this.gameState.rightPlayerScore ? 
                      this.players.left : this.players.right;
        if(winner === this.players.left)
        {
            try {
                prisma.user.update({
                    where: { id: user.id },
                    data: { wonGames: { increment: 1 } }
                });
    
                const userrr = prisma.user.findUnique({
                    where: { id: user.id }
                });
    
                const levelsToIncrement = Math.floor(userrr.wonGames / 3);
                console.log('levelsToIncrement', levelsToIncrement);
                if (levelsToIncrement > 0) {
                    prisma.user.update({
                        where: { id: user.id },
                        data: { level: { increment: levelsToIncrement } }
                    });    
                }
            }
            catch (error)
            {
                console.log("Failed to record win");
            }
        }
        
        // Notify both players
        fastify.io.to(this.players.left).emit("gameEnded", 
        {
            message: this.gameState.leftPlayerScore > this.gameState.rightPlayerScore ?  "You won!" : "You lost!",
            finalScore:
            {
                left: this.gameState.leftPlayerScore,
                right: this.gameState.rightPlayerScore
            }
        });
        
        fastify.io.to(this.players.right).emit("gameEnded", 
        {
            message: this.gameState.rightPlayerScore > this.gameState.leftPlayerScore ? "You won!" : "You lost!",
            finalScore: 
            {
                left: this.gameState.leftPlayerScore,
                right: this.gameState.rightPlayerScore
            }
        });

        this.stopGameLoop();
        
        // Remove from active games
        const index = activeGames.indexOf(this);
        if (index !== -1) {
            activeGames.splice(index, 1);
        }
    }

    stopGameLoop() {
        if (this.intervalId) 
        {
            clearInterval(this.intervalId);
            this.gameLoopRunning = false;
            this.intervalId = null;
            console.log("Game loop stopped for:", this.players.left, this.players.right);
        }
    }
}

let waitingQueue = [];
let activeGames = [];

function game_logic(socket, fastify) 
{
    console.log("client connected", socket.id);

    socket.on("requestMatch", () => {
        waitingQueue.push(socket.id);
        console.log("Player added to queue:", socket.id);

        if (waitingQueue.length >= 2) {
            const player1 = waitingQueue.shift();
            const player2 = waitingQueue.shift();

            const game = new Game(player1, player2);
            activeGames.push(game);
            game.start(fastify);
        }
    });

    socket.on("paddleMoving", (data) => 
    {
        const game = activeGames.find((g) => g.players.left === socket.id || g.players.right === socket.id);
        if (game) 
        {
            if (data.player === "left" && game.players.left === socket.id) 
            {
                game.gameState.leftPaddleY = data.y;
            } 
            else if (data.player === "right" && game.players.right === socket.id) 
            {
                game.gameState.rightPaddleY = data.y;
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("client disconnected:", socket.id);

        const indexInQueue = waitingQueue.indexOf(socket.id);
        if (indexInQueue !== -1) 
        {
            waitingQueue.splice(indexInQueue, 1);
            console.log("Player removed from queue:", socket.id);
        }

        const gameIndex = activeGames.findIndex((g) => g.players.left === socket.id || g.players.right === socket.id);
        if (gameIndex !== -1) {
            const [removedGame] = activeGames.splice(gameIndex, 1);
            removedGame.stopGameLoop();

            const otherPlayer = removedGame.players.left === socket.id ? 
                              removedGame.players.right : removedGame.players.left;
            if (otherPlayer) 
            {
                fastify.io.to(otherPlayer).emit("gameEnded", 
                {
                    message: "Opponent disconnected",
                    finalScore: 
                    {
                        left: removedGame.gameState.leftPlayerScore,
                        right: removedGame.gameState.rightPlayerScore
                    }
                });
                console.log("Game ended due to player disconnect");
            }
        }
    });
}

module.exports = { game_logic };