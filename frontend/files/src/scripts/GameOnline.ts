import { copyFileSync } from "fs";

declare const io: any; 

export function GameOnline2()
{
    const socket = io('https://localhost',{path: '/api/socket.io'});

    interface Keys {
        w: boolean;
        s: boolean;
        ArrowUp: boolean;
        ArrowDown: boolean;
    }

    interface GameState {
        leftPaddleY: number;
        rightPaddleY: number;
        ballX: number;
        ballY: number;
        ballSpeedX: number;
        ballSpeedY: number;
        leftPlayerScore: number;
        rightPlayerScore: number;
    }

    interface FinalScore {
        left: number;
        right: number;
    }

    interface GameEndData {
        message: string;
        finalScore: FinalScore;
    }

    const canvas = document.getElementById("pingPongCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const startBtn = document.getElementById("startBtn") as HTMLButtonElement;


    canvas.width = 1000;
    canvas.height = 500;

    const paddleWidth = 11;
    const paddleHeight = 100;
    const ballSize = 20;

    let leftPaddleY: number = (canvas.height - paddleHeight) / 2;
    let rightPaddleY: number = (canvas.height - paddleHeight) / 2;

    let ballX: number = canvas.width / 2;
    let ballY: number = canvas.height / 2;
    let ballSpeedX: number = 12;
    let ballSpeedY: number = 12;
    let leftPlayerScore: number = 0;
    let rightPlayerScore: number = 0;


    const paddleSpeed: number = 15;

    let playerPaddle: string | null = null;
    let startGame: boolean = false;
    let waitingForOpponent: boolean = false;

    let gameOver: boolean = false;
    let winnerMessage: string = "";
    let finalScores: FinalScore = { left: 0, right: 0 };

    const keys: Keys = {
        w: false,
        s: false,
        ArrowUp: false,
        ArrowDown: false,
    };

    // Connect socket
    //const socket = io("http://10.11.2.3:3000");

    // Show start button
    startBtn.style.display = "block";

    // Socket event listeners
    socket.on("assignPaddle", (paddle: string) => {
        playerPaddle = paddle;
        waitingForOpponent = false;
        startGame = true;
        console.log(`You are controlling the ${paddle} paddle`);
    });

    const player11 = document.querySelector('.user1TEXT') as HTMLElement;
    const player22 = document.querySelector('.user2TEXT') as HTMLElement;


        // fetch(`${window.location.origin}/api/profile`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     credentials : "include"
        // })
        // .then(response => response.json())
        // .then(data => {
        
        // const nameVal = data.name;
        // // const userVal = data.login;
        // // const emailVal = data.email;

        // player11.textContent = nameVal;
            
        // })


    socket.on("gameState", (state: GameState) => {


        leftPaddleY = state.leftPaddleY;
        rightPaddleY = state.rightPaddleY;
        ballX = state.ballX;
        ballY = state.ballY;
        ballSpeedX = state.ballSpeedX;
        ballSpeedY = state.ballSpeedY;
        leftPlayerScore = state.leftPlayerScore;
        rightPlayerScore = state.rightPlayerScore;
        
        player11.textContent = state.leftPlayerScore.toString();
        player22.textContent = state.rightPlayerScore.toString();
    });





    socket.on("gameEnded", (data: GameEndData) => {
        gameOver = true;
        winnerMessage = data.message;
        finalScores = data.finalScore;
        startBtn.style.display = "block";
        startGame = false;
        waitingForOpponent = false;

        // Reset game state
        leftPaddleY = (canvas.height - paddleHeight) / 2;
        rightPaddleY = (canvas.height - paddleHeight) / 2;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = 12;
        ballSpeedY = 12;
        leftPlayerScore = 0;
        rightPlayerScore = 0;
    });

    socket.on("resetGame", (data: { message?: string; finalScore?: FinalScore }) => {
        gameOver = true;
        winnerMessage = data.message || "Opponent disconnected";
        finalScores = data.finalScore || { left: leftPlayerScore, right: rightPlayerScore };
        startBtn.style.display = "block";
        startGame = false;
        waitingForOpponent = false;
    });

    // Drawing functions
    function drawGameOver(): void {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#fff";
        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.fillText(winnerMessage, canvas.width / 2, canvas.height / 2 - 50);
        
        ctx.font = "40px Arial";
        ctx.fillText(`Final Score: ${finalScores.left} - ${finalScores.right}`, canvas.width / 2, canvas.height / 2 + 30);
        
        ctx.font = "30px Arial";
        ctx.fillText("Click Start to play again", canvas.width / 2, canvas.height / 2 + 100);
    }

    function drawWaitingMessage(): void {
        ctx.fillStyle = "#fff";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Waiting for an opponent...", canvas.width / 2, canvas.height / 2);
    }

    function updateCanvas(timestamp?: number): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (waitingForOpponent) {
            drawWaitingMessage();
        } else if (gameOver) {
            drawGameOver();
        } else if (startGame) {
            drawPaddles();
            drawBall();
            drawCenterCircle();
            drawCenterLines();
            drawScores();

            if (playerPaddle === "left") {
                handleLeftPaddleMovement();
            } else if (playerPaddle === "right") {
                handleRightPaddleMovement();
            }
        }

        requestAnimationFrame(updateCanvas);
    }

    function drawPaddles(): void {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    }

    function drawBall(): void {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
    }

    function drawCenterCircle(): void {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    function drawScores(): void {
        ctx.fillStyle = "#fff";
        ctx.font = "60px Arial";
        ctx.textAlign = "right";
        // ctx.fillText(leftPlayerScore.toString(), canvas.width / 2 - 40, 60);
        ctx.textAlign = "left";
        // ctx.fillText(rightPlayerScore.toString(), canvas.width / 2 + 40, 60);
    }

    function drawCenterLines(): void {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 50);
        ctx.lineTo(centerX, 0);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 50);
        ctx.lineTo(centerX, canvas.height);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    function handleLeftPaddleMovement(): void {
        if (keys.w && leftPaddleY > 0) {
            leftPaddleY -= paddleSpeed;
            socket.emit("paddleMoving", { player: "left", y: leftPaddleY });
        }
        if (keys.s && leftPaddleY < canvas.height - paddleHeight) {
            leftPaddleY += paddleSpeed;
            socket.emit("paddleMoving", { player: "left", y: leftPaddleY });
        }
    }

    function handleRightPaddleMovement(): void {
        if (keys.ArrowUp && rightPaddleY > 0) {
            rightPaddleY -= paddleSpeed;
            socket.emit("paddleMoving", { player: "right", y: rightPaddleY });
        }
        if (keys.ArrowDown && rightPaddleY < canvas.height - paddleHeight) {
            rightPaddleY += paddleSpeed;
            socket.emit("paddleMoving", { player: "right", y: rightPaddleY });
        }
    }

    // Event listeners
    document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key in keys) {
            (keys as any)[event.key] = true;
        }
    });

    document.addEventListener("keyup", (event: KeyboardEvent) => {
        if (event.key in keys) {
            (keys as any)[event.key] = false;
        }
    });

    startBtn.addEventListener("click", () => {
        startBtn.style.display = "none";
        waitingForOpponent = true;
        gameOver = false;
        leftPlayerScore = 0;
        rightPlayerScore = 0;
        socket.emit("requestMatch");
    });

    // Start the game loop
    requestAnimationFrame(updateCanvas);
}
