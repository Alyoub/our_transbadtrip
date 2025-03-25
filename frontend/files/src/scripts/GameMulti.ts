export function GameMulti()
{
const canvas = document.getElementById("PingpongMulti") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = 1000;
canvas.height = 500;

const paddleWidth = 11;
const paddleHeight = 125;

const paddleWidth2 = 12;
const paddleHeight2 = 100;
const ballSize = 20;

let leftPaddleY: number = (canvas.height - paddleHeight) / 2;
let leftPaddleX: number = 0;

let leftPaddleY2: number = (canvas.height - paddleHeight2) / 2;
let leftPaddleX2: number = canvas.width / 4;

let rightPaddleY: number = (canvas.height - paddleHeight) / 2;
let rightPaddleX: number = canvas.width - paddleWidth;

let rightPaddleY2: number = (canvas.height - paddleHeight2) / 2;
let rightPaddleX2: number = canvas.width * 3 / 4;

let ballX: number = canvas.width / 2;
let ballY: number = canvas.height / 2;
let ballSpeedX: number = 7;
let ballSpeedY: number = 7;

const paddleSpeed: number = 8;

let lastTime: number = 0;

let leftPlayerScore: number = 0;
let rightPlayerScore: number = 0;

let gameOver: boolean = false;

const keys: { [key: string]: boolean } = {
    w: false,
    s: false,
    y: false,
    h: false,
    ArrowUp: false,
    ArrowDown: false,
    8: false,
    5: false,
};

function drawPaddles(): void {
    ctx.fillStyle = "#fff";
    ctx.fillRect(leftPaddleX, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(leftPaddleX2, leftPaddleY2, paddleWidth2, paddleHeight2);
    ctx.fillRect(rightPaddleX, rightPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(rightPaddleX2, rightPaddleY2, paddleWidth2, paddleHeight2);
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

function drawScores(): void {
    ctx.fillStyle = "#fff";
    ctx.font = "50px Arial";
    ctx.fillText(leftPlayerScore.toString(), canvas.width / 4, 50);
    ctx.fillText(rightPlayerScore.toString(), (3 * canvas.width) / 4, 50);
}

function drawWinMessage(message: string): void {
    ctx.fillStyle = "#fff";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function updateCanvas(timestamp: number): void {
    if (gameOver) return;

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddles();
    drawBall();
    drawCenterCircle();
    drawCenterLines();
    drawScores();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY - ballSize <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX - ballSize / 2 <= leftPaddleX + paddleWidth && ballY >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) {
        ballX = leftPaddleX + paddleWidth + ballSize / 2;
        const paddleCenterY = leftPaddleY + paddleHeight / 2;
        const relativeIntersectY = paddleCenterY - ballY;
        const normalizedIntersectY = relativeIntersectY / (paddleHeight / 2);
        const bounceAngle = normalizedIntersectY * 0.75;
        const speed = Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2);
        ballSpeedX = speed * Math.cos(bounceAngle);
        ballSpeedY = -speed * Math.sin(bounceAngle);
    }
    
    if (ballX - ballSize / 2 <= leftPaddleX2 + paddleWidth2 && 
        ballX - ballSize / 2 >= leftPaddleX2 && 
        ballY >= leftPaddleY2 && 
        ballY <= leftPaddleY2 + paddleHeight2) {
        ballX = leftPaddleX2 + paddleWidth2 + ballSize / 2;
        const paddleCenterY = leftPaddleY2 + paddleHeight2 / 2;
        const relativeIntersectY = paddleCenterY - ballY;
        const normalizedIntersectY = relativeIntersectY / (paddleHeight2 / 2);
        const bounceAngle = normalizedIntersectY * 0.75;
        const speed = Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2);
        ballSpeedX = speed * Math.cos(bounceAngle);
        ballSpeedY = -speed * Math.sin(bounceAngle);
    }
    
    if (ballX + ballSize / 2 >= rightPaddleX && ballY >= rightPaddleY && ballY <= rightPaddleY + paddleHeight) {
        ballX = rightPaddleX - ballSize / 2;
        const paddleCenterY = rightPaddleY + paddleHeight / 2;
        const relativeIntersectY = paddleCenterY - ballY;
        const normalizedIntersectY = relativeIntersectY / (paddleHeight / 2);
        const bounceAngle = normalizedIntersectY * 0.75;
        const speed = Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2);
        ballSpeedX = -speed * Math.cos(bounceAngle);
        ballSpeedY = -speed * Math.sin(bounceAngle);
    }
    
    if (ballX + ballSize / 2 >= rightPaddleX2 && 
        ballX + ballSize / 2 <= rightPaddleX2 + paddleWidth2 &&
        ballY >= rightPaddleY2 && 
        ballY <= rightPaddleY2 + paddleHeight2) {
        ballX = rightPaddleX2 - ballSize / 2;
        const paddleCenterY = rightPaddleY2 + paddleHeight2 / 2;
        const relativeIntersectY = paddleCenterY - ballY;
        const normalizedIntersectY = relativeIntersectY / (paddleHeight2 / 2);
        const bounceAngle = normalizedIntersectY * 0.75;
        const speed = Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2);
        ballSpeedX = -speed * Math.cos(bounceAngle);
        ballSpeedY = -speed * Math.sin(bounceAngle);
    }

    if (ballX <= 0) {
        rightPlayerScore++;
        resetBall();
    }

    if (ballX >= canvas.width) {
        leftPlayerScore++;
        resetBall();
    }

    if (leftPlayerScore >= 5) {
        gameOver = true;
        drawWinMessage("Team 1 Wins!");
        return;
    }

    if (rightPlayerScore >= 5) {
        gameOver = true;
        drawWinMessage("Team 2 Wins!");
        return;
    }

    if (keys.w && leftPaddleY > 0) {
        leftPaddleY -= paddleSpeed;
    }
    if (keys.s && leftPaddleY < canvas.height - paddleHeight) {
        leftPaddleY += paddleSpeed;
    }
    if (keys.y && leftPaddleY2 > 150) {
        leftPaddleY2 -= paddleSpeed;
    }
    if (keys.h && leftPaddleY2 < canvas.height - 250) {
        leftPaddleY2 += paddleSpeed;
    }
    if (keys.ArrowUp && rightPaddleY > 0) {
        rightPaddleY -= paddleSpeed;
    }
    if (keys.ArrowDown && rightPaddleY < canvas.height - paddleHeight) {
        rightPaddleY += paddleSpeed;
    }
    if (keys[8] && rightPaddleY2 > 150) {
        rightPaddleY2 -= paddleSpeed;
    }
    if (keys[5] && rightPaddleY2 < canvas.height - 250) {
        rightPaddleY2 += paddleSpeed;
    }
    
    if (rightPaddleY < 0) {
        rightPaddleY = 0;
    } else if (rightPaddleY > canvas.height - paddleHeight) {
        rightPaddleY = canvas.height - paddleHeight;
    }
    
    requestAnimationFrame(updateCanvas);
}

function resetBall(): void {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    const randomDirectionX = Math.random() < 0.5 ? -1 : 1;
    const randomDirectionY = Math.random() < 0.5 ? -1 : 1;
    ballSpeedX = 7 * randomDirectionX;
    ballSpeedY = 7 * randomDirectionY;
    ballY += (Math.random() * 100 - 50);
}

function restartGame(): void {
    leftPlayerScore = 0;
    rightPlayerScore = 0;
    gameOver = false;
    resetBall();
}

document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key in keys) {
        keys[event.key] = true;
    }
});

document.addEventListener("keyup", (event: KeyboardEvent) => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "r" || event.key === "R") {
        restartGame();
    }
});

requestAnimationFrame(updateCanvas);
}