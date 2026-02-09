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



// API: get all templates
app.get('/api/templates', (req, res) => {
    const templates = readTemplates();
    res.json(templates);
});


// API: add template
app.post('/api/templates', (req, res) => {
    const templates = readTemplates();

    const { name, icon, description, color } = req.body;

    // basic validation
    if (!icon || !description || !color) {
    return res.status(400).json({ error: 'Missing required fields' });
}


    const newTemplate = {
    id: Date.now(),
    name: 'Untitled', 
    icon,
    description,
    color,
    createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit'
    })
    };

    templates.push(newTemplate);

    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(templates, null, 2));
        res.status(201).json(templates);
    } catch (err) {
        res.status(500).json({ error: 'Could not save template' });
    }
});

// API: update template name
app.put('/api/templates/:id', (req, res) => {
    const templates = readTemplates();
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const template = templates.find(t => t.id === id);

    if (!template) {
        return res.status(404).json({ error: 'Template not found' });
    }

    template.name = name;

    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(templates, null, 2));
        res.json(template);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update template' });
    }
});


// API: delete template
app.delete('/api/templates/:id', (req, res) => {
});

// invalid routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/error.html'));
});

app.listen(PORT, () => { console.log("server started on port:", PORT) })

