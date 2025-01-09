const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'pingpong-app' directory
app.use(express.static(path.join(__dirname, 'pingpong-app')));

// Route for the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pingpong-app', 'login.html'));
});

// Route for the main application page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pingpong-app', 'index.html'));
});

app.listen(PORT,'0.0.0.0',() => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
