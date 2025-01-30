const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 80;

app.use(express.static(path.join(__dirname, 'files')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'files', 'index.html'));
});

app.listen(PORT,'0.0.0.0',() => {
    console.log(`Server is running on broadcast ${PORT}`);
});
