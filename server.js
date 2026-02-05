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

//helper to write templates
const writeTemplates = (templates) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(templates, null, 2), 'utf8');
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

app.get('/default-lined-sheet', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/default-lined-sheet.html'));
});

app.get('/default-grid-sheet', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/default-grid-sheet.html'));
});


// API: get all templates
app.get('/api/templates', (req, res) => {
    const templates = readTemplates();
    res.json(templates);
});

// API: add template
app.post('/api/templates', (req, res) => {
    const templates = readTemplates();
    const { name, icon, description, color, createdAt } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: "Missing required fields: name, description" });
    }

    const newTemplate = {
        id: Date.now(),
        name: String(name),
        icon: String(icon || "📄"),
        description: String(description),
        color: String(color || "#D5E8FF"),
        createdAt: String(createdAt || new Date().toDateString().slice(4,10))
    };

    templates.push(newTemplate);
    writeTemplates(templates);

    return res.status(201).json(newTemplate);
});

// API: delete template
app.delete('/api/templates/:id', (req, res) => {
    const templates = readTemplates();
    const id = req.params.id;

    const index = templates.findIndex(t => String(t.id) === String(id));

    if (index === -1) {
        return res.status(404).json({ error: "Template not found" });
    }

    const deleted = templates.splice(index, 1)[0];
    writeTemplates(templates);

    return res.status(200).json({ message: "Deleted", deleted });
});

// invalid routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/error.html'));
});

app.listen(PORT, () => { console.log("server started on port:", PORT) })

