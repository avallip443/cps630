const express = require('express');
const app = express();
const path = require('path');

const PORT = 1234;

app.use('/', express.static(path.join(__dirname, '/public')));
console.log("__dirname:", __dirname)

// valid routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/library', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/library.html'));
});

app.get('/catalogue', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/catalogue.html'));
});

// invalid routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/error.html'));
});

app.listen(PORT, () => { console.log("server started on port:", PORT) })

