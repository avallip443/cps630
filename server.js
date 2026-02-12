const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 1234;
const DATA_FILE = path.join(__dirname, '/data/items.json');

const DEFAULT_TEMPLATES = [
  {
    type: "project-plan",
    name: "Project Plan",
    icon: "📊",
    description: "Template for planning and tracking project milestones",
    color: "#D5E8FF"
  },
  {
    type: "meeting-notes",
    name: "Meeting Notes",
    icon: "📝",
    description: "Template for documenting meetings",
    color: "#FFE8D5"
  },
  {
    type: "bug-report",
    name: "Bug Report",
    icon: "🐛",
    description: "Template for tracking bugs",
    color: "#FFD5D5"
  }
];

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

// helper to read templates
const readTemplates = () => {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (err) {
        return [];
    }
};


app.get('/api/default-templates', (req, res) => {
    res.json(DEFAULT_TEMPLATES);
});

app.get('/api/templates', (req, res) => {
    const templates = readTemplates();
    res.json(templates);
});

// main page


// API: add template
app.post('/api/templates', (req, res) => {
    const { name, type } = req.body;

    if (!name || !type) {
        return res.status(400).json({ error: "Missing name or type" });
    }

    const templates = readTemplates();

    const defaultTemplate = DEFAULT_TEMPLATES.find(t => t.type === type);

    if (!defaultTemplate) {
        return res.status(400).json({ error: "Invalid template type" });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const defaultFilePath = path.join(__dirname, `/views/${type}.html`);
    const newFilePath = path.join(__dirname, `/views/${slug}.html`);

    if (!fs.existsSync(defaultFilePath)) {
        return res.status(400).json({ error: "Default template not found" });
    }

    if (fs.existsSync(newFilePath)) {
        return res.status(400).json({ error: "File already exists" });
    }

    let templateContent = fs.readFileSync(defaultFilePath, 'utf8');

    templateContent = templateContent
        .replace(/<title>.*?<\/title>/, `<title>${name}</title>`)
        .replace(/<h1>.*?<\/h1>/, `<h1>${name}</h1>`);

    fs.writeFileSync(newFilePath, templateContent);

    const newTemplate = {
        id: Date.now(),
        name,
        type,
        slug,
        icon: defaultTemplate.icon,
        color: defaultTemplate.color,
        description: defaultTemplate.description,
        createdAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit'
        })
    };

    templates.push(newTemplate);
    fs.writeFileSync(DATA_FILE, JSON.stringify(templates, null, 2));

    res.json(newTemplate);
});


// API: delete template
app.delete('/api/templates/:id', (req, res) => {
});

app.get('/:slug', (req, res, next) => {
    const slug = req.params.slug;

    // Don't intercept API routes
    if (slug.startsWith('api')) return next();

    const filePath = path.join(__dirname, `/views/${slug}.html`);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }

    next();
});

// invalid routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/error.html'));
});

app.listen(PORT, () => { console.log("server started on port:", PORT) })

