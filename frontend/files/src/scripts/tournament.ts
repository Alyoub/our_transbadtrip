export function tournament() {
    document.addEventListener('DOMContentLoaded', function () {
        const canvas = document.getElementById('pingPongT') as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
        const tournamentSetup = document.getElementById('tournamentSetup') as HTMLElement;
        const gameContainer = document.querySelector('.Game') as HTMLElement | null;
        const startTournamentBtn = document.getElementById('startTournament') as HTMLButtonElement;
        const exitButton = document.getElementById('exitButton') as HTMLButtonElement;

        if (!canvas || !ctx || !tournamentSetup || !gameContainer || !startTournamentBtn || !exitButton) {
            console.error('One or more required DOM elements are missing!');
            return;
        }

        // Game settings
        canvas.width = 1000;
        canvas.height = 500;
        const paddleWidth = 11;
        const paddleHeight = 100;
        const ballSize = 20;
        const winningScore = 5;

        // Game state
        let leftPaddleY = (canvas.height - paddleHeight) / 2;
        let rightPaddleY = (canvas.height - paddleHeight) / 2;
        let ballX = canvas.width / 2;
        let ballY = canvas.height / 2;
        let ballSpeedX = 9;
        let ballSpeedY = 9;
        let leftScore = 0;
        let rightScore = 0;
        let gameRunning = false;
        const paddleSpeed = 12;

        // Tournament state
        let tournamentPlayers: string[] = [];
        let currentMatch = 0;
        let matches: { player1: number | null; player2: number | null; winner: number | null }[] = [];
        let leftPlayerName = '';
        let rightPlayerName = '';

        // Key states
        const keys: { [key: string]: boolean } = {
            w: false,
            s: false,
            ArrowUp: false,
            ArrowDown: false,
        };

        function init() {
            setupEventListeners();
        }

        function setupEventListeners() {
            startTournamentBtn?.addEventListener('click', startTournament);
            exitButton?.addEventListener('click', () => {
                window.location.reload();
            });

            document.addEventListener('keydown', function (e) {
                if (e.key in keys) keys[e.key] = true;
            });

            document.addEventListener('keyup', function (e) {
                if (e.key in keys) keys[e.key] = false;
            });
        }

        function startTournament() {
            tournamentPlayers = [
                (document.getElementById('player1') as HTMLInputElement)?.value || 'Player 1',
                (document.getElementById('player2') as HTMLInputElement)?.value || 'Player 2',
                (document.getElementById('player3') as HTMLInputElement)?.value || 'Player 3',
                (document.getElementById('player4') as HTMLInputElement)?.value || 'Player 4',
            ];

            matches = [
                { player1: 0, player2: 1, winner: null },
                { player1: 2, player2: 3, winner: null },
                { player1: null, player2: null, winner: null },
            ];

            currentMatch = 0;
            startMatch(matches[currentMatch]);
        }

        function startMatch(match: { player1: number | null; player2: number | null; winner: number | null }) {
            if (match.player1 === null || match.player2 === null) return;

            leftPlayerName = tournamentPlayers[match.player1];
            rightPlayerName = tournamentPlayers[match.player2];

            const user1Texts = document.querySelectorAll('.user1TEXT');
            if (user1Texts.length >= 2) {
                (user1Texts[0] as HTMLElement).textContent = leftPlayerName;
                (user1Texts[1] as HTMLElement).textContent = rightPlayerName;
            }

            leftScore = 0;
            rightScore = 0;
            resetBall();
            resetPaddles();

            if (tournamentSetup)
                tournamentSetup.style.display = 'none';
            if (gameContainer)
                gameContainer.style.display = 'flex';

            gameRunning = true;
            requestAnimationFrame(gameLoop);
        }

        function gameLoop() {
            if (!gameRunning) return;

            // Clear canvas
            ctx.fillStyle = '#09203b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update game state
            updateGame();

            // Draw game elements
            drawPaddles();
            drawBall();
            drawScores();
            drawCenterLine();
            drawPlayerNames();

            // Continue the loop
            requestAnimationFrame(gameLoop);
        }

        function updateGame() {
            // Move ball
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Ball collision with top and bottom
            if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
                ballSpeedY = -ballSpeedY;
            }

            // Ball collision with paddles
            handlePaddleCollision();

            // Scoring
            if (ballX < 0) {
                rightScore++;
                resetBall();
            }
            if (ballX > canvas.width) {
                leftScore++;
                resetBall();
            }

            // Check for winner
            if (leftScore >= winningScore || rightScore >= winningScore) {
                endMatch();
            }

            // Paddle movement
            handlePaddleMovement();
        }

        function handlePaddleCollision() {
            // Left paddle
            if (
                ballX - ballSize / 2 <= paddleWidth &&
                ballY >= leftPaddleY &&
                ballY <= leftPaddleY + paddleHeight
            ) {
                ballSpeedX = -ballSpeedX * 1.1;
                ballX = paddleWidth + ballSize / 2;
            }

            // Right paddle
            if (
                ballX + ballSize / 2 >= canvas.width - paddleWidth &&
                ballY >= rightPaddleY &&
                ballY <= rightPaddleY + paddleHeight
            ) {
                ballSpeedX = -ballSpeedX * 1.1;
                ballX = canvas.width - paddleWidth - ballSize / 2;
            }
        }

        function handlePaddleMovement() {
            if (keys.w && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
            if (keys.s && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;
            if (keys.ArrowUp && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
            if (keys.ArrowDown && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;
        }

        function drawPaddles() {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
            ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
        }

        function drawBall() {
            ctx.beginPath();
            ctx.arc(ballX, ballY, ballSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        }

        function drawScores() {
            ctx.fillStyle = 'white';
            ctx.font = '32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(leftScore.toString(), canvas.width / 4, 50);
            ctx.fillText(rightScore.toString(), (canvas.width * 3) / 4, 50);
        }

        function drawCenterLine() {
            ctx.strokeStyle = 'white';
            ctx.setLineDash([5, 15]);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();
        }

        function drawPlayerNames() {
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(leftPlayerName, 20, 30);
            ctx.textAlign = 'right';
            ctx.fillText(rightPlayerName, canvas.width - 20, 30);
        }

        function resetBall() {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
            ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
        }

        function resetPaddles() {
            leftPaddleY = (canvas.height - paddleHeight) / 2;
            rightPaddleY = (canvas.height - paddleHeight) / 2;
        }

        function endMatch() {
            gameRunning = false;

            const winner =
                leftScore >= winningScore
                    ? matches[currentMatch].player1
                    : matches[currentMatch].player2;

            matches[currentMatch].winner = winner;

            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${tournamentPlayers[winner!]} wins!`, canvas.width / 2, canvas.height / 2);

            setTimeout(() => {
                currentMatch++;
                if (currentMatch < matches.length - 1) {
                    startMatch(matches[currentMatch]);
                } else {
                    const champion = tournamentPlayers[matches[matches.length - 1].winner!];
                    ctx.fillText(`${champion} wins the tournament!`, canvas.width / 2, canvas.height / 2 - 50);
                }
            }, 2000);
        }

        init();
    });
}