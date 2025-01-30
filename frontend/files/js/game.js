export   function initializeGame() {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    const ballRadius = 10;
    let ballSpeedX = Math.random() > 0.5 ? 6 : -6;
    let ballSpeedY = Math.random() > 0.5 ? 6 : -6;

    const paddleWidth = 10;
    const paddleHeight = 120;
    let playerPaddleY = (canvas.height - paddleHeight) / 2;
    let aiPaddleY = (canvas.height - paddleHeight) / 2;

    let playerSpeed = 12;
    let aiSpeed = 6;

    let playerScore = 0;
    let aiScore = 0;
    const winningScore = 10;
    let keys = { up: false, down: false };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') keys.up = true;
        if (event.key === 'ArrowDown') keys.down = true;
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowUp') keys.up = false;
        if (event.key === 'ArrowDown') keys.down = false;
    });

    function drawEverything() {
        context.fillStyle = 'green';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = 'white';
        for (let i = 0; i < canvas.height; i += 20) {
            context.fillRect(canvas.width / 2 - 1, i, 2, 10);
        }

        context.fillStyle = 'red';
        context.beginPath();
        context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, true);
        context.fill();

        context.fillStyle = 'white';
        context.fillRect(0, playerPaddleY, paddleWidth, paddleHeight);
        context.fillRect(canvas.width - paddleWidth, aiPaddleY, paddleWidth, paddleHeight);

        context.font = '20px Arial';
        context.fillText(`Player: ${playerScore}`, 50, 30);
        context.fillText(`AI: ${aiScore}`, canvas.width - 120, 30);
    }

    function moveEverything() {
        if (keys.up) playerPaddleY = Math.max(playerPaddleY - playerSpeed, 0);
        if (keys.down) playerPaddleY = Math.min(playerPaddleY + playerSpeed, canvas.height - paddleHeight);

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY > canvas.height - ballRadius || ballY < ballRadius) {
            ballSpeedY = -ballSpeedY;
        }

        if (
            ballX < paddleWidth &&
            ballY > playerPaddleY &&
            ballY < playerPaddleY + paddleHeight
        ) {
            ballSpeedX = -ballSpeedX;
            ballSpeedY += (Math.random() - 0.5) * 4;
        } else if (
            ballX > canvas.width - paddleWidth &&
            ballY > aiPaddleY &&
            ballY < aiPaddleY + paddleHeight
        ) {
            ballSpeedX = -ballSpeedX;
            ballSpeedY += (Math.random() - 0.5) * 4;
        }

        if (ballX < 0) {
            aiScore++;
            resetBall();
        } else if (ballX > canvas.width) {
            playerScore++;
            resetBall();
        }

        if (aiPaddleY + paddleHeight / 2 < ballY - 20) {
            aiPaddleY = Math.min(aiPaddleY + aiSpeed, canvas.height - paddleHeight);
        } else if (aiPaddleY + paddleHeight / 2 > ballY + 20) {
            aiPaddleY = Math.max(aiPaddleY - aiSpeed, 0);
        }
    }

    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = Math.random() > 0.5 ? 6 : -6;
        ballSpeedY = Math.random() > 0.5 ? 6 : -6;
    }

    function checkWin() {
        if (playerScore === winningScore || aiScore === winningScore) {
            clearInterval(gameInterval);
            context.fillStyle = 'white';
            context.font = '40px Arial';
            const winner = playerScore === winningScore ? 'Player Wins!' : 'AI Wins!';
            context.fillText(winner, canvas.width / 2 - 100, canvas.height / 2);
            drawRestartButton();
        }
    }

    function drawRestartButton() {
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart';
        restartButton.style.position = 'absolute';
        restartButton.style.top = `${canvas.offsetTop + canvas.height / 2 + 40}px`;
        restartButton.style.left = `${canvas.offsetLeft + canvas.width / 2 - 40}px`;
        restartButton.style.padding = '10px 20px';
        restartButton.style.fontSize = '16px';
        document.body.appendChild(restartButton);

        restartButton.addEventListener('click', () => {
            document.body.removeChild(restartButton);
            restartGame();
        });
    }

    function restartGame() {
        playerScore = 0;
        aiScore = 0;
        resetBall();
        gameInterval = setInterval(gameLoop, 1000 / 60);
    }

    function gameLoop() {
        moveEverything();
        drawEverything();
        checkWin();
    }

    let gameInterval = setInterval(gameLoop, 1000 / 60);
}