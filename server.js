const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 1234;
const TEMPLATES_FILE = path.join(__dirname, '/data/items.json');
const CREATED_FILE = path.join(__dirname, '/data/created-templates.json');

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/data', express.static(path.join(__dirname, '/data')));

// helper to read default templates
const readDefaultTemplates = () => {
    try {
        return JSON.parse(fs.readFileSync(TEMPLATES_FILE, 'utf8'));
    } catch (err) {
        return [];
    }
};

// helper to read created templates
const readCreatedTemplates = () => {
    try {
        return JSON.parse(fs.readFileSync(CREATED_FILE, 'utf8'));
    } catch (err) {
        return [];
    }
};

// helper to write created templates
const writeCreatedTemplates = (templates) => {
    try {
        fs.writeFileSync(CREATED_FILE, JSON.stringify(templates, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error('Error writing templates:', err);
        return false;
    }
};

// helper to format date
const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

// API: get all user-created templates
app.get('/api/created-templates', (req, res) => {
    const templates = readCreatedTemplates();
    res.json(templates);
});

// API: create new template
app.post('/api/create-template', (req, res) => {
    const { templateName } = req.body;
    
    // validate fields
    if (!templateName) {
        return res.status(400).json({ error: 'Missing templateName' });
    }
    
    const defaultTemplates = readDefaultTemplates();
    const sourceTemplate = defaultTemplates.find(t => t.name === templateName);
    
    if (!sourceTemplate) {
        return res.status(404).json({ error: 'Template not found' });
    }
    
    const newTemplate = {
        id: Date.now(),
        name: sourceTemplate.name,
        icon: sourceTemplate.icon,
        description: sourceTemplate.description,
        color: sourceTemplate.color,
        createdAt: formatDate(new Date())
    };
    
    const createdTemplates = readCreatedTemplates();
    createdTemplates.push(newTemplate);
    
    if (!writeCreatedTemplates(createdTemplates)) {
        return res.status(500).json({ error: 'Failed to save template' });
    }
    
    res.json(newTemplate);
});

// API: delete template
app.delete('/api/templates/:id', (req, res) => {
    const templates = readTemplates();
    const id = req.params.id;

    const index = templates.findIndex(t => String(t.id) === String(id));
    if (index === -1) {
        return res.status(404).json({ error: "Template not found" });
    }

    templates[index].deleted = true;
    writeTemplates(templates);

    return res.status(200).json({ message: "Deleted", id });

});

// invalid routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/error.html'));
});

app.listen(PORT, () => { console.log("server started on port:", PORT) })

