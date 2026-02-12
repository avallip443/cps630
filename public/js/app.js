// default templates the user can select from when creating a new template
let defaultTemplates = [];
// templates created by the user
let createdTemplates = [];

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

// handle click on template card to navigate to template page
function handleTemplateClick(e) {
    const card = e.target.closest('.template-card');
    if (!card) return;

    const url = card.dataset.url;
    if (url) window.location.href = url;
}


/* template container functions */

// render user-created templates to ui
function renderTemplates() {
    templatesContainer.innerHTML = '';
    
    // shows empty state if no templates were created
    if (createdTemplates.length === 0) {
        templatesContainer.innerHTML = emptyTemplatesHTML();
        return;
    }

    // shows user-created templates
    createdTemplates.forEach(template => {
        templatesContainer.appendChild(createTemplateCard(template));
    });
}

// returns empty state html
function emptyTemplatesHTML() {
    return `
        <div class="empty-state">
            <h1>No templates yet</h1>
            <p>Add your first template using the + New Template button</p>
        </div>
    `;
}

// creates a template card element
function createTemplateCard(template) {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.dataset.id = template.id;

    const url = '/' + template.name.toLowerCase().replace(/\s+/g, '-');
    card.dataset.url = url;

    card.innerHTML = templateCardHTML(template);

    return card;
}

// return html for a template card
function templateCardHTML(template) {
    return `
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
}


/* api functions */

// load all default templates
async function loadDefaultTemplates() {
    try {
        const response = await fetch('/api/default-templates');
        defaultTemplates = await response.json();
    }
    catch (err) {
        console.error('Error loading templates:', err);
    }
}

// load all user-created templates
async function loadTemplates() {
    try {
        const response = await fetch('/api/templates');
        createdTemplates = await response.json();
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

// create new template from modal selection
async function createNewTemplate(templateName) {
    try {
        // send post request to create a new template
        // sends template name to verify which template to copy
        const response = await fetch('/api/create-template', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ templateName })
        });

        if (response.ok) {
            const newTemplate = await response.json();
            createdTemplates.push(newTemplate);
            closeTemplateModal();
            renderTemplates();
        } else {
            console.error('Failed to create template');
        }
    } catch (err) {
        console.error('Error creating template:', err);
    }
}


/* modal functions */

// open modal
async function openModal() {
    try {
        await loadDefaultTemplates();
        
        const form = templateModal.querySelector('.modal-body');

        // render deafult template options
        form.innerHTML = `
            <div class="items-list">
                ${defaultTemplates.map(renderModalItem).join('')}
            </div>
        `;

        // add click listeners to items
        form.querySelectorAll('.item-option').forEach(item => {
            item.addEventListener('click', () => {
                const templateName = item.dataset.templateName;
                createNewTemplate(templateName);
            });
        });

        templateModal.classList.remove('hidden');
    } catch (err) {
        console.error('Error opening modal:', err);
    }
}

function renderModalItem(item) {
    return `
        <div class="item-option" data-template-name="${item.name}">
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
