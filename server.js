const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 1234;
const DATA_FILE = path.join(__dirname, '/data/items.json');

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '/public')));

// helper to read templates
const readTemplates = () => {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (err) {
        return [];
    }
};


// main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/project-plan', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/project-plan.html'));
});

app.get('/meeting-notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/meeting-notes.html'));
});

app.get('/bug-report', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/bug-report.html'));
});

// API: get all templates
app.get('/api/templates', (req, res) => {
    const templates = readTemplates();
    res.json(templates);
});

// API: add template
app.post('/api/templates', (req, res) => {
});

// API: delete template
app.delete('/api/templates/:id', (req, res) => {
});

// invalid routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/error.html'));
});

app.listen(PORT, () => { console.log("server started on port:", PORT) })

