export function initializeSignIn() {
    document.getElementById('signinFormContainer').innerHTML = `
        <form id="signinForm">
            <input type="text" id="username" placeholder="Username" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Sign In</button>
            <p id="signinMessage"></p>
        </form>
    `;

    document.getElementById('signinForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            document.getElementById('signinMessage').textContent = response.ok ? 'Sign in successful!' : `Failed: ${result.message}`;
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

export function initializeCreateAccount() {
    document.getElementById('createAccountFormContainer').innerHTML = `
        <form id="createAccountForm">
            <input type="text" id="newUsername" placeholder="Username" required>
            <input type="password" id="newPassword" placeholder="Password" required>
            <input type="email" id="newEmail" placeholder="Email" required>
            <button type="submit">Create Account</button>
            <p id="createAccountMessage"></p>
        </form>
    `;

    document.getElementById('createAccountForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newUsername = document.getElementById('newUsername').value;
        const newPassword = document.getElementById('newPassword').value;
        const email = document.getElementById('newEmail').value;

        try {
            const response = await fetch('/api/createaccount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newUsername, password: newPassword, email })
            });

            const result = await response.json();
            document.getElementById('createAccountMessage').textContent = response.ok ? 'Account created!' : `Failed: ${result.message}`;
        } catch (error) {
            console.error('Error:', error);
        }
    });
}
