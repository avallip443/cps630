let templates = [];

const templatesContainer = document.getElementById('templates-container');
const templateModal = document.getElementById('template-modal');
const templateForm = document.getElementById('template-form');
const newTemplateBtn = document.getElementById('open-modal');
const closeModal = document.getElementById('close-modal');

window.addEventListener('DOMContentLoaded', () => {
    loadTemplates();
    setupEventListeners();
});

// event listeners
function setupEventListeners() {
    newTemplateBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeTemplateModal);
    templatesContainer.addEventListener('click', handleTemplateClick);
}

function handleTemplateClick(e) {
    if (e.target.classList.contains('template-name')) {
        return;
    }

    const card = e.target.closest('.template-card');
    if (!card) return;

    const url = card.dataset.url;
    if (url) window.location.href = url;
}


// navigate to template
function navigateToTemplate(url) {
    window.location.href = url;
}


/* template container functions */

// render templates to ui
function renderTemplates() {
    templatesContainer.innerHTML = '';

    if (templates.length === 0) {
        templatesContainer.innerHTML = emptyStateTemplate();
        return;
    }

    templates.forEach(template => {
        templatesContainer.appendChild(createTemplateCard(template));
    });
}

// create empty state template
function emptyStateTemplate() {
    return `
        <div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <h3>No templates yet</h3>
            <p>Create your first template using the + New Template button</p>
            <button class="btn btn-primary" id="empty-new-template">
                + New Template
            </button>
        </div>
    `;
}

// create a template card element
function createTemplateCard(template) {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.dataset.id = template.id;

    card.dataset.url = '/' + template.name.toLowerCase().replace(/\s+/g, '-');

    card.innerHTML = `
        <div class="template-icon" style="background-color: ${template.color}">
            ${template.icon}
        </div>

        <div class="template-name" contenteditable="true" spellcheck="false">
            ${template.name}
        </div>

        <div class="template-description">${template.description}</div>

        <div class="template-info">
            <span>Created ${template.createdAt}</span>
            <div class="template-actions">
                <button class="btn btn-delete"
                    onclick="deleteTemplate(${template.id}); event.stopPropagation();">
                    Delete
                </button>
            </div>
        </div>
    `;

    const nameEl = card.querySelector('.template-name');

    nameEl.addEventListener('blur', async () => {
        const newName = nameEl.textContent.trim() || 'Untitled';
        nameEl.textContent = newName;

        try {
            const res = await fetch(`/api/templates/${template.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            });

            if (!res.ok) throw new Error('Failed to save');

            // backend is now source of truth
            template.name = newName;
            card.dataset.url =
                '/' + newName.toLowerCase().replace(/\s+/g, '-');

        } catch (err) {
            console.error('Rename failed:', err);
        }
    });

    return card;
}


/* api functions */

// load all available templates
async function loadTemplates() {
    try {
        const response = await fetch('/api/templates');
        templates = await response.json();
        renderTemplates();
    } catch (err) {
        console.error('Error loading templates:', err);
    }
}

// delete template
async function deleteTemplate(id) {
    if (!confirm('Are you sure you want to delete this template?')) {
        return;
    }
}

/* modal functions */

// open modal
async function openModal() {
    try {
        const form = templateModal.querySelector('.modal-body');

        const baseNames = ['Project Plan', 'Meeting Notes', 'Bug Report'];

        const baseTemplates = templates.filter(t =>
            baseNames.includes(t.name)
        );

        // render modal items
        form.innerHTML = `
            <div class="items-list">
                ${templates.map(renderModalItem).join('')}
            </div>
        `;

        // show modal
        templateModal.classList.remove('hidden');

        // attach click handlers AFTER rendering
        document.querySelectorAll('.item-option').forEach(option => {
            option.addEventListener('click', async () => {
                const id = option.dataset.id;
                const template = templates.find(t => t.id == id);

                try {
                    const response = await fetch('/api/templates', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                        icon: template.icon,
                        description: template.description,
                        color: template.color
                        })

                    });

                    // backend should return updated array
                    templates = await response.json();
                    renderTemplates();
                    closeTemplateModal();
                } catch (err) {
                    console.error('Error creating template:', err);
                }
            });
        });

    } catch (err) {
        console.error('Error opening modal:', err);
    }
}


function renderModalItem(item) {
    return `
        <div class="item-option" data-id="${item.id}">
            <div class="item-option-icon">${item.icon}</div>
            <div class="item-option-content">
                <div class="item-option-title">${item.name}</div>
                <div class="item-option-desc">${item.description}</div>
            </div>
        </div>
    `;
}


// close modal
function closeTemplateModal() {
    templateModal.classList.add('hidden');
    templateForm.reset();
}
