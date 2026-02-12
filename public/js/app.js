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
    const deleteBtn = e.target.closest('.btn-delete');
    if (deleteBtn) {
        e.stopPropagation();

        const id = deleteBtn.dataset.id;
        deleteTemplate(id);
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

    const visibleTemplates = templates.filter(t => !t.deleted);

    if (visibleTemplates.length === 0) {
        templatesContainer.innerHTML = emptyStateTemplate();
        return;
    }

    visibleTemplates.forEach(template => {
        templatesContainer.appendChild(createTemplateCard(template));
    });
}

// create empty state template
function emptyStateTemplate() {
    return `
        <div class="empty-state">
            <h1>No templates yet</h1>
            <p>Add your first template using the + New Template button</p>
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

    const url = '/' + template.name.toLowerCase().replace(/\s+/g, '-');
    card.dataset.url = url;

    card.innerHTML = `
        <div class="icon" style="background-color: ${template.color}">
            ${template.icon}
        </div>
        <h2>${template.name}</h2>
        <div class="template-description">${template.description}</div>
        <div class="template-info">
            <span>Created ${template.createdAt}</span>
            <div>
                <button class="btn btn-delete" onclick="deleteTemplate(${template.id}); event.stopPropagation();">
                    Delete
                </button>
            </div>
        </div>
    `;

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
    
    try {
        const response = await fetch(`/api/templates/${encodeURIComponent(id)}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            alert('Delete failed.');
            return;
        }

        await loadTemplates()
    } catch (err) {
        console.error('Error deleting template:', err);
        alert('Could not connect to server.')
    }
}

/* modal functions */

// open modal
async function openModal() {
    try {
        await loadTemplates();

        const body = templateModal.querySelector('.modal-body');

        body.innerHTML = `
            <div class="items-list">
                ${templates.map(renderModalItem).join('')}


            </div>
        `;

        body.onclick = (e) => {
            const option = e.target.closest('.item-option');
                if (!option) return;

            const url = option.dataset.url;
                if (url) window.location.href = url;
            };

        templateModal.classList.remove('hidden');
    } catch (err) {
    console.error('Error opening modal:', err);
    }
}


function renderModalItem(item) {
    return `
        <div class="item-option">
            <div class="icon">${item.icon}</div>
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
