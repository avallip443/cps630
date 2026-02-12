let templates = [];
let defaultTemplates = [];
const templatesContainer = document.getElementById('templates-container');
const templateModal = document.getElementById('template-modal');
const templateForm = document.getElementById('template-form');
const newTemplateBtn = document.getElementById('open-modal');
const closeModal = document.getElementById('close-modal');

const templatesBtn = document.getElementById('templatesBtn');
const templatesDropdown = document.getElementById('templatesDropdown');

templatesBtn.addEventListener('click', () => {
    templatesDropdown.classList.toggle('show');
});

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

    const url = '/' + template.name.toLowerCase().replace(/\s+/g, '-');
    card.dataset.url = url;

    card.innerHTML = `
        <div class="template-icon" style="background-color: ${template.color}">
            ${template.icon}
        </div>
        <div class="template-name">${template.name}</div>
        <div class="template-description">${template.description}</div>
        <div class="template-info">
            <span>Created ${template.createdAt}</span>
            <div class="template-actions">
                <button class="btn btn-delete" onclick="deleteTemplate(${template.id}); event.stopPropagation();">
                    Delete
                </button>
            </div>
        </div>
    `;

    return card;
}

function renderDashboard() {
    templatesContainer.innerHTML = '';
    
    if (templates.length === 0) {
        templatesContainer.innerHTML = `<div class="empty-state">No saved templates yet!</div>`;
        return;
    }
    templates.forEach(item => {
        const card = createTemplateCard(item); 
        templatesContainer.appendChild(card);
    });
}

// Renders the Sidebar using only items from default.json
function renderSidebar() {
    const dropdown = document.getElementById('templatesDropdown');
    dropdown.innerHTML = ''; 

    defaultTemplates.forEach(temp => {
        const link = document.createElement('a');
        link.href = temp.route;
        link.textContent = temp.name;
        dropdown.appendChild(link);
    });
}


/* api functions */


// load all available templates
async function loadTemplates() {
    try {
        const response = await fetch('/api/templates');
        const data = await response.json();
        
        // Store them separately
        defaultTemplates = data.defaults;
        templates = data.userSaved;
        
        renderDashboard(); // Show saved items in the grid
        renderSidebar();   // Show default items in the sidebar
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

        form.innerHTML = `
            <div class="items-list">
                ${templates.map(renderModalItem).join('')}
            </div>
        `;

        templateModal.classList.remove('hidden');
    } catch (err) {
        console.error('Error opening modal:', err);
    }
}

function renderModalItem(item) {
    return `
        <div class="item-option"
            style="
                border-left: 4px solid ${item.color};
                padding: 15px;
                margin-bottom: 10px;
                background: #f9f9f9;
                border-radius: 4px;
                cursor: pointer;
            ">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">${item.icon}</span>
                <div>
                    <div style="font-weight: bold;">${item.name}</div>
                    <div style="font-size: 12px; color: #666;">
                        ${item.description}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// close modal
function closeTemplateModal() {
    templateModal.classList.add('hidden');
    templateForm.reset();
}
