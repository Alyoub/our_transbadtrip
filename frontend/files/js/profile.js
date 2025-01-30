export function initializeProfile() {
    if (!localStorage.getItem('currentUser')) {
        loadPage('signin');
        return;
    }

    const user = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('profileContainer').innerHTML = `
        <h2>Profile</h2>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <button id="logoutButton">Logout</button>
    `;

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        loadPage('home');
    });
}
