export function tournament()
{
    document.addEventListener('DOMContentLoaded', function() {
        const canvas = document.getElementById('pingPongT') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const tournamentSetup = document.getElementById('tournamentSetup') as HTMLElement;
        const gameContainer = document.querySelector('.Game') as HTMLElement;
        const startTournamentBtn = document.getElementById('startTournament') as HTMLButtonElement;
        const exitButton = document.getElementById('exitButton') as HTMLButtonElement;
    
        // Game settings
        canvas.width = 1000;
        canvas.height = 500;
        const paddleWidth: number = 11;
        const paddleHeight: number = 100;
        const ballSize: number = 20;
        const winningScore: number = 5;
        
        // Game state
        let leftPaddleY: number = (canvas.height - paddleHeight) / 2;
        let rightPaddleY: number = (canvas.height - paddleHeight) / 2;
        let ballX: number = canvas.width / 2;
        let ballY: number = canvas.height / 2;
        let ballSpeedX: number = 9;
        let ballSpeedY: number = 9;
        let leftScore: number = 0;
        let rightScore: number = 0;
        let gameRunning: boolean = false;
        let paddleSpeed: number = 12;
        
        // Tournament state
        let tournamentPlayers: string[] = [];
        let currentMatch: number = 0;
        let matches: {player1: number | null, player2: number | null, winner: number | null}[] = [];
        let leftPlayerName: string = '';
        let rightPlayerName: string = '';
        
        // Key states
        const keys: {[key: string]: boolean} = {
            w: false,
            s: false,
            ArrowUp: false,
            ArrowDown: false

        };
    
        function init(): void {
            setupEventListeners();
        }
    
        function setupEventListeners(): void {
            startTournamentBtn.addEventListener('click', startTournament);
            exitButton.addEventListener('click', () => {
                window.location.reload();
            });
            
            document.addEventListener('keydown', function(e: KeyboardEvent) {
                if (e.key in keys) keys[e.key] = true;
            });
            
            document.addEventListener('keyup', function(e: KeyboardEvent) {
                if (e.key in keys) keys[e.key] = false;
            });
        }
    
        function startTournament(): void {
            tournamentPlayers = [
                (document.getElementById('player1') as HTMLInputElement).value || 'Player 1',
                (document.getElementById('player2') as HTMLInputElement).value || 'Player 2',
                (document.getElementById('player3') as HTMLInputElement).value || 'Player 3',
                (document.getElementById('player4') as HTMLInputElement).value || 'Player 4'
            ];
            
            matches = [
                { player1: 0, player2: 1, winner: null },
                { player1: 2, player2: 3, winner: null },
                { player1: null, player2: null, winner: null }
            ];
            
            currentMatch = 0;
            startMatch(matches[currentMatch]);
        }
    
        function startMatch(match: {player1: number | null, player2: number | null, winner: number | null}): void {
            if (match.player1 === null || match.player2 === null) return;
            
            // Set player names
            leftPlayerName = tournamentPlayers[match.player1];
            rightPlayerName = tournamentPlayers[match.player2];
            
            // Update player display names
            const user1Texts = document.querySelectorAll('.user1TEXT');
            (user1Texts[0] as HTMLElement).textContent = leftPlayerName;
            (user1Texts[1] as HTMLElement).textContent = rightPlayerName;
            
            // Reset scores and positions
            leftScore = 0;
            rightScore = 0;
            resetBall();
            resetPaddles();
            
            // Show game and hide setup
            tournamentSetup.style.display = 'none';
            gameContainer.style.display = 'flex';
            
            gameRunning = true;
            requestAnimationFrame(gameLoop);
        }
    
        function gameLoop(): void {
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
    
        function updateGame(): void {
            // Move ball
            ballX += ballSpeedX;
            ballY += ballSpeedY;
            
            // Ball collision with top and bottom
            if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
                ballSpeedY = -ballSpeedY;
            }
            
            // Ball collision with left paddle
            if (ballX - ballSize / 2 <= paddleWidth && 
                ballY >= leftPaddleY && 
                ballY <= leftPaddleY + paddleHeight) {
                ballSpeedX = -ballSpeedX * 1.1;
                ballX = paddleWidth + ballSize / 2;
                const paddleCenterY = leftPaddleY + paddleHeight / 2;
                const relativeIntersectY = paddleCenterY - ballY;
                const normalizedIntersectY = relativeIntersectY / (paddleHeight / 2);
                const bounceAngle = normalizedIntersectY * 0.75;
                const speed = Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2);
                ballSpeedX = speed * Math.cos(bounceAngle);
                ballSpeedY = -speed * Math.sin(bounceAngle);
            }
       
            // Ball collision with right paddle
            if (ballX + ballSize / 2 >= canvas.width - paddleWidth && 
                ballY >= rightPaddleY && 
                ballY <= rightPaddleY + paddleHeight) {
                ballSpeedX = -ballSpeedX * 1.1;
                ballX = canvas.width - paddleWidth - ballSize / 2;
                const paddleCenterY = rightPaddleY + paddleHeight / 2;
                const relativeIntersectY = paddleCenterY - ballY;
                const normalizedIntersectY = relativeIntersectY / (paddleHeight / 2);
                const bounceAngle = normalizedIntersectY * 0.75;
                const speed = Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2);
                ballSpeedX = -speed * Math.cos(bounceAngle);
                ballSpeedY = -speed * Math.sin(bounceAngle);
            }
    
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
            if ((keys.w) && leftPaddleY > 0) {
                leftPaddleY -= paddleSpeed;
            }
            if ((keys.s) && leftPaddleY < canvas.height - paddleHeight) {
                leftPaddleY += paddleSpeed;
            }
            if (keys.ArrowUp && rightPaddleY > 0) {
                rightPaddleY -= paddleSpeed;
            }
            if (keys.ArrowDown && rightPaddleY < canvas.height - paddleHeight) {
                rightPaddleY += paddleSpeed;
            }
    
            // Paddle boundary checks
            if (rightPaddleY < 0) {
                rightPaddleY = 0;
            } else if (rightPaddleY > canvas.height - paddleHeight) {
                rightPaddleY = canvas.height - paddleHeight;
            }
        }
    
        function drawPaddles(): void {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
            ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
        }
    
        function drawBall(): void {
            ctx.beginPath();
            ctx.arc(ballX, ballY, ballSize/2, 0, Math.PI*2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        }
    
        function drawScores(): void {
            ctx.fillStyle = 'white';
            ctx.font = '32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(leftScore.toString(), canvas.width/4, 50);
            ctx.fillText(rightScore.toString(), canvas.width*3/4, 50);
        }
    
        function drawCenterLine(): void {
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
    
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
    
        function drawPlayerNames(): void {
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(leftPlayerName, 20, 30);
            ctx.textAlign = 'right';
            ctx.fillText(rightPlayerName, canvas.width - 20, 30);
        }
    
        function resetBall(): void {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
            ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
        }
    
        function resetPaddles(): void {
            leftPaddleY = (canvas.height - paddleHeight) / 2;
            rightPaddleY = (canvas.height - paddleHeight) / 2;
        }
    
        function endMatch(): void {
            gameRunning = false;
            
            if (matches[currentMatch].player1 === null || matches[currentMatch].player2 === null) return;
            
            const winner = leftScore >= winningScore ? 
                matches[currentMatch].player1 : 
                matches[currentMatch].player2;
            
            matches[currentMatch].winner = winner;
            
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${tournamentPlayers[winner as number]} wins!`, canvas.width/2, canvas.height/2);
            
            setTimeout(() => {
                currentMatch++;
                
                if (currentMatch < matches.length - 1) {
                    startMatch(matches[currentMatch]);
                } else if (currentMatch === matches.length - 1) {
                    // Final match between winners of first two matches
                    if (matches[0].winner !== null && matches[1].winner !== null) {
                        matches[currentMatch].player1 = matches[0].winner;
                        matches[currentMatch].player2 = matches[1].winner;
                        startMatch(matches[currentMatch]);
                    }
                } else {
                    // Tournament over
                    const champion = tournamentPlayers[matches[matches.length-1].winner as number];
                    ctx.fillText(`${champion} wins the tournament!`, canvas.width/2, canvas.height/2 - 50);
                    ctx.fillText('Refresh to play again', canvas.width/2, canvas.height/2 + 50);
                }
            }, 2000);
        }
    
        init();
    });
}