document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const links = document.querySelectorAll('.nav-link');

    const pages = {
        home: '<h2 class="text-center">Home</h2><p class="text-center">BAAAD TRIPP WALO !</p>',
        game: `
            <h2 class="text-center">Game</h2>
            <canvas class="container d-flex justify-content-center" id="gameCanvas" width="800" height="400"></canvas>
        `,
        about: '<h2 class="text-center">About</h2><p class="text-center">This is a simple ping pong game built with HTML, CSS, and JavaScript.</p>',
        help: '<h2 class="text-center">Help</h2><p class="text-center">Here you can find help and support for the Ping Pong Game.</p>',
        signin: `
        <div class="container d-flex justify-content-center mt-5">
            <div class="w-50 bg-light p-5 rounded shadow form-container">
                <h2 class="text-center fs-1 mb-4">Sign In</h2>
                <form id="signinForm" class="d-flex flex-column">
                    <!-- Username -->
                    <div class="mb-3">
                        <label class="fs-5" for="username">Username:</label>
                        <input class="form-control" type="text" id="username" name="username" required>
                    </div>
    
                    <!-- Password -->
                    <div class="mb-3">
                        <label class="fs-5" for="password">Password:</label>
                        <input class="form-control" type="password" id="password" name="password" required>
                    </div>
    
                    <!-- Submit Button -->
                    <div class="d-flex justify-content-center">
                        <button class="btn btn-primary btn-lg mt-3" type="submit">Sign In</button>
                    </div>
                </form>
                <p id="signinMessage" class="text-center mt-3 text-danger"></p>
            </div>
        </div>
    `,
        createaccount: `
        <div class="container d-flex justify-content-center mt-5">
            <div class="w-50 bg-light p-5 rounded shadow form-container">
                <h2 class="text-center fs-1 mb-4">Create Account</h2>
                <form class="d-flex flex-column" id="createAccountForm">
                    <!-- First and Last Name -->
                    <div class="mb-3 d-flex justify-content-between">
                        <div class="w-50 me-2">
                            <label class="fs-5" for="firstName">First Name:</label>
                            <input class="form-control" type="text" id="firstName" name="firstName" required>
                        </div>
                        <div class="w-50 ms-2">
                            <label class="fs-5" for="lastName">Last Name:</label>
                            <input class="form-control" type="text" id="lastName" name="lastName" required>
                        </div>
                    </div>
    
                    <!-- Username -->
                    <div class="mb-3">
                        <label class="fs-5" for="newUsername">Username:</label>
                        <input class="form-control" type="text" id="newUsername" name="newUsername" required>
                    </div>
    
                    <!-- Password -->
                    <div class="mb-3">
                        <label class="fs-5" for="newPassword">Password:</label>
                        <input class="form-control" type="password" id="newPassword" name="newPassword" required>
                    </div>
    
                    <!-- Email -->
                    <div class="mb-3">
                        <label class="fs-5" for="newEmail">Email:</label>
                        <input class="form-control" type="email" id="newEmail" name="newEmail" required>
                    </div>
    
                    <!-- Date of Birth -->
                    <div class="mb-3">
                        <label class="fs-5" for="birthDate">Date of Birth:</label>
                        <input class="form-control" type="date" id="birthDate" name="birthDate" required>
                    </div>
    
                    <!-- Gender -->
                    <div class="mb-3">
                        <label class="fs-5">Gender:</label>
                        <div class="d-flex">
                            <div class="form-check me-3">
                                <input class="form-check-input" type="radio" id="male" name="gender" value="Male" required>
                                <label class="form-check-label fs-5" for="male">Male</label>
                            </div>
                            <div class="form-check me-3">
                                <input class="form-check-input" type="radio" id="female" name="gender" value="Female" required>
                                <label class="form-check-label fs-5" for="female">Female</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" id="other" name="gender" value="Other" required>
                                <label class="form-check-label fs-5" for="other">Other</label>
                            </div>
                        </div>
                    </div>
    
                    <!-- Submit Button -->
                    <div class="d-flex justify-content-center">
                        <button class="btn btn-primary btn-lg mt-3" type="submit">Create Account</button>
                    </div>
                </form>
            </div>
        </div>
    `,
        profile: `
        <div class="container d-flex justify-content-center mt-5">
            <div class="w-50 bg-light p-5 rounded shadow form-container">
                <h2 class="text-center fs-1 mb-4">Profile</h2>
                <div id="profileInfo">
                    <p class="fs-5"><strong>Username:</strong> <span id="profileUsername"></span></p>
                    <p class="fs-5"><strong>Email:</strong> <span id="profileEmail"></span></p>
                    <p class="fs-5"><strong>First Name:</strong> <span id="profileFirstName"></span></p>
                    <p class="fs-5"><strong>Last Name:</strong> <span id="profileLastName"></span></p>
                    <p class="fs-5"><strong>Date of Birth:</strong> <span id="profileBirthDate"></span></p>
                    <p class="fs-5"><strong>Gender:</strong> <span id="profileGender"></span></p>
                </div>
                <div class="d-flex justify-content-center mt-4">
                    <button id="logoutButton" class="btn btn-danger btn-lg">Logout</button>
                </div>
            </div>
        </div>
    `
    };

    let currentUser = null;

    function loadPage(page) {
        content.innerHTML = pages[page];
        if (page === 'game') {
            initializeGame();
        } else if (page === 'signin') {
            initializeSignIn();
        } else if (page === 'createaccount') {
            initializeCreateAccount();
        } else if (page === 'profile') {
            initializeProfile();
        }
    }

    function initializeGame() {
        const canvas = document.getElementById('gameCanvas');
        const context = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        let ballX = canvas.width / 2;
        let ballY = canvas.height / 2;
        const ballRadius = 10;
        let ballSpeedX = 12;
        let ballSpeedY = 12;
    
        const paddleWidth = 10;
        const paddleHeight = 120;
        let playerPaddleY = (canvas.height - paddleHeight) / 2;
        let aiPaddleY = (canvas.height - paddleHeight) / 2;
    
        let playerSpeed = 18;
        let aiSpeed = 7;
    
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
            context.fillStyle = 'black';
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
            } else if (
                ballX > canvas.width - paddleWidth &&
                ballY > aiPaddleY &&
                ballY < aiPaddleY + paddleHeight
            ) {
                ballSpeedX = -ballSpeedX;
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
            ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 12;
            ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 12;
        }
    
        function checkWin() {
            if (playerScore === winningScore || aiScore === winningScore) {
                clearInterval(gameInterval);
                context.fillStyle = 'white';
                context.font = '40px Arial';
                const winner = playerScore === winningScore ? 'Player Wins!' : 'AI Wins!';
                context.fillText(winner, canvas.width / 2 - 100, canvas.height / 2);
                setTimeout(() => location.reload(), 2000);
            }
        }
    
        function gameLoop() {
            moveEverything();
            drawEverything();
            checkWin();
        }
    
        const gameInterval = setInterval(gameLoop, 1000 / 60);
    }    
    
    function initializeSignIn() {
        const signInForm = document.getElementById('signinForm');
        signInForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();
                const signInMessage = document.getElementById('signinMessage');
                if (response.ok) {
                    signInMessage.textContent = 'Sign in successful!';
                    currentUser = result.user;
                    loadPage('profile');
                } else {
                    signInMessage.textContent = `Sign in failed: ${result.message}`;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    function initializeCreateAccount() {
        const createAccountForm = document.getElementById('createAccountForm');
        createAccountForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newUsername = document.getElementById('newUsername').value;
            const newPassword = document.getElementById('newPassword').value;
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('newEmail').value;
            const birthDate = document.getElementById('birthDate').value;
            const gender = document.querySelector('input[name="gender"]:checked').value;

            try {
                const response = await fetch('/api/createaccount', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        username: newUsername, 
                        password: newPassword,
                        firstName,
                        lastName,
                        email,
                        birthDate,
                        gender
                    })
                });

                const result = await response.json();
                const createAccountMessage = document.getElementById('createAccountMessage');
                if (response.ok) {
                    createAccountMessage.textContent = 'Account creation successful!';
                    currentUser = result.user;
                    loadPage('profile');
                } else {
                    createAccountMessage.textContent = `Account creation failed: ${result.message}`;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    function initializeProfile() {
        if (!currentUser) {
            loadPage('signin');
            return;
        }

        document.getElementById('profileUsername').textContent = currentUser.username;
        document.getElementById('profileEmail').textContent = currentUser.email;
        document.getElementById('profileFirstName').textContent = currentUser.firstName;
        document.getElementById('profileLastName').textContent = currentUser.lastName;
        document.getElementById('profileBirthDate').textContent = currentUser.birthDate;
        document.getElementById('profileGender').textContent = currentUser.gender;

        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', () => {
            currentUser = null;
            loadPage('home');
        });
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('href').substring(1);
            loadPage(page);
        });
    });

    // Load the default page
    loadPage('home');
});