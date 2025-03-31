import { loadnhistory , fetchPlayerData } from './app.js';

export async function	setupTournamentPage() {
    const homeBtn = document.querySelector('.home-btn') as HTMLButtonElement;

    homeBtn.addEventListener('click', () => loadnhistory('profil'));
	try
	{
		const playerData = await fetchPlayerData();
		// const iPlayerName = document.getElementById('iPlayerName') as HTMLSpanElement;
		const iPlayerUsername = document.getElementById('iPlayerUsername') as HTMLSpanElement;

		// if (iPlayerName)
		// 	iPlayerName.textContent = playerData.name;
		if (iPlayerUsername)
			iPlayerUsername.textContent = playerData.login;
	}
	catch(error)
	{
		// console.error("Failed to update the Player's name: ", error);
	}
	
};


export function tournament(tournamentPlayers: string[])
{
    const canvas = document.getElementById('pingPongT') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
    //const tournamentSetup = document.getElementById('tournamentSetup');
    //const gameContainer = document.querySelector('.Game') as HTMLElement;
    const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
    const exitBtn = document.getElementById('exitBtn') as HTMLButtonElement;
    
    canvas.width = 1000;
    canvas.height = 500;
    const paddleWidth = 11;
    const paddleHeight = 100;
    const ballSize = 20;
    const winningScore = 5;

    // Game state
    let leftPaddleY: number = (canvas.height - paddleHeight) / 2;
    let rightPaddleY: number = (canvas.height - paddleHeight) / 2;
    let ballX: number = canvas.width / 2;
    let ballY: number = canvas.height / 2;
    let ballSpeedX: number = 4;
    let ballSpeedY: number = 4;
    let leftScore: number = 0;
    let rightScore: number = 0;
    let gameRunning: boolean = false;
    const paddleSpeed: number = 12;

    // Tournament state
    //let tournamentPlayers: string[] = [];
    let currentMatch = 0;
    
    interface Match {
        player1: number | null;
        player2: number | null;
        winner: number | null;
    }
    
    let matches: Match[] = [];
    let leftPlayerName = '';
    let rightPlayerName = '';

    // Key states
    const keys: { [key: string]: boolean } = 
    {
        w: false,
        s: false,
        ArrowUp: false,
        ArrowDown: false,
    };

    // function init() {
    setupEventListeners();
    // }
    startBtn?.addEventListener('click', start);
    exitBtn?.addEventListener('click', () => loadnhistory('createtourn'));

    
    function setupEventListeners() {
        
        document.addEventListener('keydown', function (e) {
            if (e.key in keys) {
                keys[e.key] = true;
            }
        });

        document.addEventListener('keyup', function (e) {
            if (e.key in keys) {
                keys[e.key] = false;
            }
        });
    }

    function start() 
    {
        

        matches = [
            { player1: 0, player2: 1, winner: null },
            { player1: 2, player2: 3, winner: null },
            { player1: null, player2: null, winner: null },
        ];

        currentMatch = 0;
        startMatch(matches[currentMatch]);
    }

    function startMatch(match: Match) 
    {
        if (match.player1 === null || match.player2 === null) return;

        leftPlayerName = tournamentPlayers[match.player1];
        rightPlayerName = tournamentPlayers[match.player2];

        const user1Texts = document.querySelectorAll('.user1TEXT');
        if (user1Texts.length >= 2) 
        {
            (user1Texts[0] as HTMLElement).textContent = leftPlayerName;
            (user1Texts[1] as HTMLElement).textContent = rightPlayerName;
        }

        leftScore = 0;
        rightScore = 0;
        resetBall();
        resetPaddles();

        // if (tournamentSetup)
        //     tournamentSetup.style.display = 'none';
        // if (gameContainer)
        //     gameContainer.style.display = 'flex';
        
        gameRunning = true;
        requestAnimationFrame(gameLoop);
    }

    function gameLoop() {
        if (!gameRunning) return;

        ctx.fillStyle = '#09203b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        updateGame();

       
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
        
        if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }
        
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

        if (ballX < 0) {
            rightScore++;
            resetBall();
        }
        if (ballX > canvas.width) {
            leftScore++;
            resetBall();
        }
        
        if (leftScore >= winningScore || rightScore >= winningScore) {
            endMatch();
        }
        
        if ((keys.w || keys.W) && leftPaddleY > 0) {
            leftPaddleY -= paddleSpeed;
        }
        if ((keys.s || keys.S) && leftPaddleY < canvas.height - paddleHeight) {
            leftPaddleY += paddleSpeed;
        }
        if (keys.ArrowUp && rightPaddleY > 0) {
            rightPaddleY -= paddleSpeed;
        }
        if (keys.ArrowDown && rightPaddleY < canvas.height - paddleHeight) {
            rightPaddleY += paddleSpeed;
        }

        if (rightPaddleY < 0) {
            rightPaddleY = 0;
        } else if (rightPaddleY > canvas.height - paddleHeight) {
            rightPaddleY = canvas.height - paddleHeight;
        }
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
        
        const winner = leftScore >= winningScore 
            ? matches[currentMatch].player1 
            : matches[currentMatch].player2;
            
        matches[currentMatch].winner = winner;

        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${tournamentPlayers[winner as number]} wins!`, canvas.width / 2, canvas.height / 2);

        setTimeout(() => {
            currentMatch++;
            
            if (currentMatch < matches.length - 1) 
            {
                startMatch(matches[currentMatch]);
            } 
            else if (currentMatch === matches.length - 1) 
            {

                matches[currentMatch].player1 = matches[0].winner;
                matches[currentMatch].player2 = matches[1].winner;
                startMatch(matches[currentMatch]);
            } 
            else {
                
                const champion = tournamentPlayers[matches[matches.length-1].winner as number];
                ctx.fillText(`${champion} wins the tournament!`, canvas.width/2, canvas.height/2 - 50);
                ctx.fillText('Refresh to play again', canvas.width/2, canvas.height/2 + 50);
            }
        }, 2000);
    }

    //init();
};
