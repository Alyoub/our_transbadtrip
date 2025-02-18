import { initializeGame } from './game.js';
import { initializeGameAI } from './gameAI.js';
import { initializeSignIn, initializeCreateAccount } from './auth.js';
import { initializeProfile } from './profile.js';

const content = document.getElementById('content');
const links = document.querySelectorAll('.nav-link');

const pages = {
    home: '<h2 class="text-center">Home</h2><p class="text-center">BAAAD TRIPP WALO !</p>',
    gameAI: `
    <h2 class="text-center">Game</h2>   
    <canvas class="container d-flex justify-content-center" id="gameCanvasAI" width="800" height="400"></canvas>
`,
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


export function loadPage(page) {
    content.innerHTML = pages[page];

    if (page === 'game') 
    {
        initializeGame();
    }
    else if (page == 'gameAI')
    {
        initializeGameAI()
    }
    else if (page == 'game')
    {
        initializeGame()
    }
    else if (page === 'signin') {
        initializeSignIn();
    } else if (page === 'createaccount') {
        initializeCreateAccount();
    } else if (page === 'profile') {
        initializeProfile();
    }
}

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('href').substring(1);
        loadPage(page);
    });
});
