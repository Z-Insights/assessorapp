// FILE: core.js
// CLASSIFICATION: The Engine - State Management, Rendering, Compression, Reporting
// PURPOSE: Executable processor that brings the app to life

// ============================================================================
// GLOBAL STATE & INITIALIZATION
// ============================================================================

let appState = {
    // Header Information
    header: {
        propAddress: "",
        unitRef: "",
        cityRegion: "",
        inspectDate: new Date().toISOString().split('T')[0],
        assessorName: "",
        tenantName: "",
        inspectionType: "routine"
    },
    
    // Checklist Items: { [itemId]: { status, note, photos: [], timestamp } }
    items: {},
    
    // Global Photos (Evidence Locker)
    photos: [], // { id, data, caption, itemId, timestamp }
    
    // Global Notes
    deficiencyNotes: "",
    finalNotes: "",
    unitStatus: "",
    
    // Metadata
    lastSaved: null,
    version: APP_CONFIG.VERSION
};

// ============================================================================
// INITIALIZATION FUNCTIONS
// ============================================================================

function initApp() {
    console.log(`Initializing ${APP_CONFIG.BRAND_NAME} Assessor v${APP_CONFIG.VERSION}`);
    
    // 1. Load saved draft
    loadDraft();
    
    // 2. Initialize property autocomplete
    initPropertyList();
    
    // 3. Render the checklist based on current type
    renderChecklist();
    
    // 4. Set up event listeners
    setupEventListeners();
    
    // 5. Fix Bulk Photo Input for Gallery Access
    optimizePhotoInput('bulkPhotoInput');
    
    // 6. Start auto-save interval
    startAutoSave();
    
    // 7. Update UI based on state
    updateUIFromState();
    
    // 8. Initialize type description
    updateTypeDescription();
    
    console.log("App initialized successfully");
}

function initPropertyList() {
    const datalist = document.getElementById('propertyList');
    if (!datalist) return;
    
    datalist.innerHTML = '';
    
    PROPERTIES_DATA.forEach(property => {
        const option = document.createElement('option');
        option.value = `${property.address}, ${property.city}`;
        datalist.appendChild(option);
    });
    
    // Auto-fill city when address is selected
    document.getElementById('propAddress').addEventListener('change', function(e) {
        const selected = PROPERTIES_DATA.find(p => 
            e.target.value.includes(p.address)
        );
        if (selected) {
            document.getElementById('cityRegion').value = selected.city;
            updateStateField('cityRegion', selected.city);
        }
    });
}

function optimizePhotoInput(elementId) {
    const input = document.getElementById(elementId);
    if (input) {
        // Use specific MIME types to encourage "Gallery or Camera" prompt
        // instead of forcing camera.
        input.accept = "image/png, image/jpeg, image/jpg, image/webp, image/heic";
        input.removeAttribute('capture'); 
    }
}

function setupEventListeners() {
    // Header field auto-save
    document.querySelectorAll('[data-state-key]').forEach(field => {
        const key = field.dataset.stateKey;
        field.addEventListener('input', () => {
            updateStateField(key, field.value);
            
            if (key === 'inspectionType') {
                updateTypeDescription();
                renderChecklist();
            }
        });
    });
    
    // Inspection type description
    document.getElementById('inspectionType').addEventListener('change', updateTypeDescription);
    
    // Photo upload
    document.getElementById('bulkPhotoInput').addEventListener('change', handlePhotoUpload);
    
    // Buttons
    document.getElementById('btnSaveDraft').addEventListener('click', saveDraft);
    document.getElementById('btnGenerateReport').addEventListener('click', generateReport);
    document.getElementById('btnShowReport').addEventListener('click', () => {
        generateReport(); // Regenerate before showing
    });
    document.getElementById('btnReset').addEventListener('click', confirmReset);
    document.getElementById('btnAutoSummary').addEventListener('click', generateAutoSummary);
    
    // Unit status radio buttons
    document.querySelectorAll('input[name="unitStatus"]').forEach(radio => {
        radio.addEventListener('change', function() {
            appState.unitStatus = this.value;
            debouncedSave();
        });
    });
    
    // Deficiency notes auto-save
    document.getElementById('deficiencyNotes').addEventListener('input', function() {
        appState.deficiencyNotes = this.value;
        debouncedSave();
    });
    
    // Final notes auto-save
    document.getElementById('finalNotes').addEventListener('input', function() {
        appState.finalNotes = this.value;
        debouncedSave();
    });
    
    // Print handling
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('print-mode');
    });
    
    window.addEventListener('afterprint', () => {
        document.body.classList.remove('print-mode');
    });
    
    // Close modal when clicking outside
    document.getElementById('reportModal').addEventListener('click', function(e) {
        if (e.target === this) {
            toggleReportModal();
        }
    });
}

// ============================================================================
// CHECKLIST RENDERING ENGINE
// ============================================================================

function renderChecklist() {
    const container = document.getElementById('checklistContainer');
    if (!container) return;
    
    const type = appState.header.inspectionType || 'routine';
    const schema = CHECKLIST_SCHEMAS[type] || CHECKLIST_SCHEMAS.routine;
    
    container.innerHTML = '';
    
    schema.forEach(section => {
        // Create section card
        const sectionCard = document.createElement('div');
        sectionCard.className = `bg-white rounded-lg shadow-sm border p-5 ${section.colorClass}`;
        sectionCard.dataset.sectionId = section.id;
        
        // Section header
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-4 border-b pb-2';
        
        const title = document.createElement('h2');
        title.className = 'font-bold text-lg text-gray-800';
        title.innerHTML = `<i class="fas fa-folder-open mr-2"></i>${section.title}`;
        
        const badge = document.createElement('span');
        badge.className = 'text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700';
        badge.textContent = section.badge;
        
        header.appendChild(title);
        header.appendChild(badge);
        
        // Items container
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'space-y-4';
        
        // Render each item
        section.items.forEach(item => {
            const itemId = item.id;
            const existingState = appState.items[itemId] || { status: '', note: '', photos: [] };
            
            const itemDiv = document.createElement('div');
            itemDiv.className = `check-item bg-gray-50 rounded p-4 ${item.critical ? 'border-l-4 border-l-red-600' : ''}`;
            itemDiv.dataset.itemId = itemId;
            itemDiv.dataset.critical = item.critical;
            
            // Item label
            const label = document.createElement('label');
            label.className = 'block font-bold text-gray-800 mb-2';
            label.textContent = item.label;
            
            // Instruction subtext
            if (item.sub) {
                const sub = document.createElement('p');
                sub.className = 'text-xs text-gray-600 mb-3';
                sub.textContent = item.sub;
                label.appendChild(sub);
            }
            
            // Status selector
            const statusRow = document.createElement('div');
            statusRow.className = 'flex flex-wrap gap-2 mb-3';
            
            APP_CONFIG.STATUS_OPTIONS.forEach(status => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `px-3 py-1.5 rounded text-xs font-medium ${existingState.status === status.value ? `status-${status.value}` : 'bg-gray-200 text-gray-700'}`;
                button.textContent = status.label;
                button.dataset.status = status.value;
                
                button.addEventListener('click', () => {
                    updateItemStatus(itemId, status.value);
                    // Update button styles
                    statusRow.querySelectorAll('button').forEach(btn => {
                        btn.className = `px-3 py-1.5 rounded text-xs font-medium bg-gray-200 text-gray-700`;
                    });
                    button.className = `px-3 py-1.5 rounded text-xs font-medium status-${status.value}`;
                });
                
                statusRow.appendChild(button);
            });
            
            // Photo upload for this item
            const photoRow = document.createElement('div');
            photoRow.className = 'flex items-center gap-2 mb-3';
            
            const photoInput = document.createElement('input');
            photoInput.type = 'file';
            // FIX: Specific accept types to prevent "Camera Only" lock
            photoInput.accept = 'image/png, image/jpeg, image/jpg, image/webp';
            photoInput.className = 'text-xs hidden'; // Hidden, triggered by label
            photoInput.multiple = true;
            photoInput.removeAttribute('capture');
            photoInput.addEventListener('change', (e) => handleItemPhotoUpload(e, itemId));
            
            const photoLabel = document.createElement('span');
            photoLabel.className = 'text-xs text-gray-600';
            photoLabel.innerHTML = '<i class="fas fa-camera mr-1"></i> Add Photo';
            
            const photoWrapper = document.createElement('label');
            photoWrapper.className = 'cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200';
            photoWrapper.appendChild(photoLabel);
            photoWrapper.appendChild(photoInput);
            photoRow.appendChild(photoWrapper);
            
            // Note input
            const noteInput = document.createElement('textarea');
            noteInput.className = 'w-full border rounded px-3 py-2 text-sm mt-2';
            noteInput.placeholder = 'Notes for this item...';
            noteInput.value = existingState.note || '';
            noteInput.addEventListener('input', () => {
                updateItemNote(itemId, noteInput.value);
            });
            
            // Assemble item
            itemDiv.appendChild(label);
            itemDiv.appendChild(statusRow);
            itemDiv.appendChild(photoRow);
            itemDiv.appendChild(noteInput);
            
            // Show existing photos for this item
            if (existingState.photos && existingState.photos.length > 0) {
                const photoGrid = document.createElement('div');
                photoGrid.className = 'flex gap-2 mt-2 flex-wrap';
                
                existingState.photos.forEach(photoId => {
                    const photo = appState.photos.find(p => p.id === photoId);
                    if (photo) {
                        const thumb = document.createElement('img');
                        thumb.src = photo.data;
                        thumb.className = 'photo-thumbnail';
                        thumb.title = photo.caption || 'Evidence';
                        photoGrid.appendChild(thumb);
                    }
                });
                
                itemDiv.appendChild(photoGrid);
            }
            
            itemsContainer.appendChild(itemDiv);
        });
        
        sectionCard.appendChild(header);
        sectionCard.appendChild(itemsContainer);
        container.appendChild(sectionCard);
    });
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

function updateStateField(key, value) {
    if (key in appState.header) {
        appState.header[key] = value;
    } else {
        appState[key] = value;
    }
    debouncedSave();
}

function updateItemStatus(itemId, status) {
    if (!appState.items[itemId]) {
        appState.items[itemId] = { status: '', note: '', photos: [], timestamp: Date.now() };
    }
    
    appState.items[itemId].status = status;
    appState.items[itemId].timestamp = Date.now();
    
    // Update critical fail tracking
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    if (itemElement && status === 'fail' && itemElement.dataset.critical === 'true') {
        // Optional: Alert animation or logic here
    }
    
    debouncedSave();
}

function updateItemNote(itemId, note) {
    if (!appState.items[itemId]) {
        appState.items[itemId] = { status: '', note: '', photos: [], timestamp: Date.now() };
    }
    
    appState.items[itemId].note = note;
    appState.items[itemId].timestamp = Date.now();
    debouncedSave();
}

function updateUIFromState() {
    // Update header fields
    Object.keys(appState.header).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = appState.header[key] || '';
        }
    });
    
    // Update notes
    document.getElementById('deficiencyNotes').value = appState.deficiencyNotes || '';
    document.getElementById('finalNotes').value = appState.finalNotes || '';
    
    // Update unit status
    if (appState.unitStatus) {
        const radio = document.querySelector(`input[name="unitStatus"][value="${appState.unitStatus}"]`);
        if (radio) {
            radio.checked = true;
        }
    }
    
    // Update photo counter
    updatePhotoCounter();
    
    // Update type description
    updateTypeDescription();
}

// ============================================================================
// IMAGE COMPRESSION ENGINE
// ============================================================================

function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;
                
                if (width > APP_CONFIG.IMAGE.MAX_WIDTH) {
                    height = (height * APP_CONFIG.IMAGE.MAX_WIDTH) / width;
                    width = APP_CONFIG.IMAGE.MAX_WIDTH;
                }
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with quality setting
                const compressedData = canvas.toDataURL('image/jpeg', APP_CONFIG.IMAGE.QUALITY);
                
                resolve({
                    original: file.name,
                    data: compressedData,
                    size: compressedData.length,
                    width: width,
                    height: height,
                    timestamp: Date.now()
                });
            };
            
            img.onerror = reject;
            img.src = e.target.result;
        };
        
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function handlePhotoUpload(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    
    // Check limit
    const remaining = APP_CONFIG.IMAGE.MAX_PHOTOS - appState.photos.length;
    const toProcess = files.slice(0, Math.min(remaining, files.length));
    
    if (toProcess.length < files.length) {
        alert(`Photo limit reached. Only ${remaining} photos will be processed.`);
    }
    
    for (const file of toProcess) {
        try {
            const compressed = await compressImage(file);
            
            const photo = {
                id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                data: compressed.data,
                caption: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                timestamp: Date.now(),
                itemId: null // Global photo
            };
            
            appState.photos.push(photo);
            renderPhotoGrid();
            updatePhotoCounter();
            
        } catch (error) {
            console.error('Photo compression failed:', error);
            alert(`Failed to process ${file.name}: ${error.message}`);
        }
    }
    
    // Reset input
    event.target.value = '';
    debouncedSave();
}

async function handleItemPhotoUpload(event, itemId) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    
    const remaining = APP_CONFIG.IMAGE.MAX_PHOTOS - appState.photos.length;
    const toProcess = files.slice(0, Math.min(remaining, files.length));
    
    for (const file of toProcess) {
        try {
            const compressed = await compressImage(file);
            
            const photo = {
                id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                data: compressed.data,
                caption: `${itemId}_evidence`,
                timestamp: Date.now(),
                itemId: itemId
            };
            
            appState.photos.push(photo);
            
            // Link photo to item
            if (!appState.items[itemId]) {
                appState.items[itemId] = { status: '', note: '', photos: [], timestamp: Date.now() };
            }
            
            if (!appState.items[itemId].photos) {
                appState.items[itemId].photos = [];
            }
            
            appState.items[itemId].photos.push(photo.id);
            
            renderChecklist();
            renderPhotoGrid();
            updatePhotoCounter();
            
        } catch (error) {
            console.error('Item photo compression failed:', error);
        }
    }
    
    event.target.value = '';
    debouncedSave();
}

function renderPhotoGrid() {
    const grid = document.getElementById('photoGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (appState.photos.length === 0) {
        grid.innerHTML = `
            <div class="col-span-2 md:col-span-4 text-center py-8 text-gray-500">
                <i class="fas fa-images text-3xl mb-2"></i>
                <p class="text-sm">No photos added yet</p>
            </div>
        `;
        return;
    }
    
    appState.photos.forEach((photo, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'relative group';
        
        const img = document.createElement('img');
        img.src = photo.data;
        img.className = 'photo-thumbnail w-full h-24 object-cover';
        img.alt = photo.caption;
        
        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'bg-red-600 text-white p-1 rounded-full';
        deleteBtn.innerHTML = '<i class="fas fa-trash text-xs"></i>';
        deleteBtn.addEventListener('click', () => removePhoto(photo.id));
        
        overlay.appendChild(deleteBtn);
        
        const caption = document.createElement('div');
        caption.className = 'text-xs text-gray-700 truncate mt-1';
        caption.textContent = photo.caption || `Photo ${index + 1}`;
        
        wrapper.appendChild(img);
        wrapper.appendChild(overlay);
        wrapper.appendChild(caption);
        grid.appendChild(wrapper);
    });
}

function removePhoto(photoId) {
    if (!confirm('Remove this photo?')) return;
    
    appState.photos = appState.photos.filter(p => p.id !== photoId);
    
    Object.keys(appState.items).forEach(itemId => {
        if (appState.items[itemId].photos) {
            appState.items[itemId].photos = appState.items[itemId].photos.filter(p => p !== photoId);
        }
    });
    
    renderPhotoGrid();
    renderChecklist();
    updatePhotoCounter();
    debouncedSave();
}

function updatePhotoCounter() {
    const counter = document.getElementById('photoCounter');
    if (counter) {
        counter.textContent = `${appState.photos.length}/${APP_CONFIG.IMAGE.MAX_PHOTOS}`;
        
        if (appState.photos.length >= APP_CONFIG.IMAGE.MAX_PHOTOS) {
            counter.className = 'ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded';
        } else if (appState.photos.length >= APP_CONFIG.IMAGE.MAX_PHOTOS * 0.8) {
            counter.className = 'ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded';
        } else {
            counter.className = 'ml-2 text-xs bg-gray-200 px-2 py-1 rounded';
        }
    }
}

// ============================================================================
// STORAGE & PERSISTENCE
// ============================================================================

// Debounce wrapper to prevent too many saves
let saveTimeout;
function debouncedSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveDraft, 1000);
}

function saveDraft() {
    try {
        appState.lastSaved = new Date().toISOString();
        localStorage.setItem(APP_CONFIG.STORAGE.DRAFT_KEY, JSON.stringify(appState));
        
        const btn = document.getElementById('btnSaveDraft');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check mr-1"></i> Saved';
        btn.className = 'px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-save mr-1"></i> Save';
            btn.className = 'px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 smooth-transition';
        }, 1500);
        
    } catch (error) {
        console.error('Save failed:', error);
        if (error.name === 'QuotaExceededError') {
            alert('Storage full. Please delete some photos or clear browser data.');
        }
    }
}

function loadDraft() {
    try {
        const saved = localStorage.getItem(APP_CONFIG.STORAGE.DRAFT_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed) {
                appState = {
                    ...appState,
                    ...parsed,
                    header: { ...appState.header, ...parsed.header },
                    items: { ...appState.items, ...parsed.items }
                };
                appState.photos = parsed.photos || [];
                console.log('Draft loaded successfully');
                return true;
            }
        }
    } catch (error) {
        console.warn('Failed to load draft:', error);
    }
    return false;
}

function startAutoSave() {
    setInterval(() => {
        saveDraft(); // Basic interval save
    }, APP_CONFIG.STORAGE.AUTO_SAVE_INTERVAL);
}

// ============================================================================
// REPORT GENERATION ENGINE
// ============================================================================

function toggleReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.toggle('hidden');
    }
}

function showReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function generateReport() {
    // 1. Collect all data
    collectFormData();
    
    // 2. Run logic (summary)
    if (APP_CONFIG.UI.AUTO_GENERATE_SUMMARY) {
        generateAutoSummary();
    }
    
    // 3. Render HTML
    const reportContent = document.getElementById('reportContent');
    if (!reportContent) return;
    
    const inspectionType = appState.header.inspectionType || 'routine';
    const typeLabel = APP_CONFIG.INSPECTION_TYPES[inspectionType] || inspectionType;
    
    const reportHTML = `
        <div class="space-y-6">
            <div class="border-b-2 border-blue-600 pb-4">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-xs uppercase tracking-widest text-gray-500 mb-1">${APP_CONFIG.BRAND_NAME}</p>
                        <h1 class="text-2xl font-bold text-gray-900">Field Assessment Report</h1>
                        <p class="text-sm text-gray-600 mt-1">Forensic Safety + Rent-Ready Protocol</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-mono">${new Date().toLocaleDateString('en-CA')}</p>
                        <p class="text-xs text-gray-500">v${APP_CONFIG.VERSION}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase">Property Address</p>
                    <p class="font-bold">${appState.header.propAddress || 'Not specified'}</p>
                </div>
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase">Unit / Area</p>
                    <p>${appState.header.unitRef || 'N/A'}</p>
                </div>
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase">City / Region</p>
                    <p>${appState.header.cityRegion || 'Not specified'}</p>
                </div>
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase">Inspection Type</p>
                    <p class="font-bold">${typeLabel}</p>
                </div>
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase">Assessor</p>
                    <p>${appState.header.assessorName || 'Not specified'}</p>
                </div>
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase">Tenant Reference</p>
                    <p>${appState.header.tenantName || 'Vacant / N/A'}</p>
                </div>
            </div>
            
            <div>
                <h2 class="text-lg font-bold border-b pb-2 mb-3 text-gray-800">
                    <i class="fas fa-chart-line mr-2"></i>Executive Summary
                </h2>
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p class="text-sm text-gray-700 whitespace-pre-wrap">${appState.finalNotes || 'No summary provided.'}</p>
                </div>
            </div>
            
            <div>
                <h2 class="text-lg font-bold border-b pb-2 mb-3 text-gray-800">
                    <i class="fas fa-clipboard-check mr-2"></i>Detailed Findings
                </h2>
                ${generateFindingsHTML()}
            </div>
            
            <div>
                <h2 class="text-lg font-bold border-b pb-2 mb-3 text-gray-800">
                    <i class="fas fa-camera mr-2"></i>Photographic Evidence
                    <span class="text-sm font-normal text-gray-600 ml-2">(${appState.photos.length} photos)</span>
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    ${generatePhotoEvidenceHTML()}
                </div>
            </div>
            
            <div class="pt-6 border-t text-center">
                <p class="text-xs text-gray-500">
                    Generated by ${APP_CONFIG.BRAND_NAME} Unified Field Assessor<br>
                    This report is an official property management record.
                </p>
                <div class="mt-4 flex justify-between text-xs text-gray-600">
                    <div class="text-left">
                        <p><strong>Report ID:</strong> ${generateReportId()}</p>
                    </div>
                    <div class="text-right">
                        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    reportContent.innerHTML = reportHTML;
    
    // 4. Show Modal
    showReportModal();
}

function generateFindingsHTML() {
    const type = appState.header.inspectionType || 'routine';
    const schema = CHECKLIST_SCHEMAS[type] || CHECKLIST_SCHEMAS.routine;
    let html = '';
    
    schema.forEach(section => {
        const sectionItems = section.items.filter(item => 
            appState.items[item.id] && appState.items[item.id].status
        );
        
        if (sectionItems.length === 0) return;
        
        html += `
            <div class="mb-6">
                <h3 class="font-bold text-gray-800 mb-2 ${section.colorClass} pl-2">${section.title}</h3>
                <div class="space-y-3">
        `;
        
        sectionItems.forEach(item => {
            const itemState = appState.items[item.id];
            const statusClass = itemState.status === 'pass' ? 'bg-green-100 text-green-800' :
                              itemState.status === 'fail' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800';
            
            html += `
                <div class="border rounded p-3 break-inside-avoid">
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-medium">${item.label}</span>
                        <span class="text-xs px-2 py-1 rounded ${statusClass}">${itemState.status.toUpperCase()}</span>
                    </div>
                    ${itemState.note ? `<p class="text-sm text-gray-600 mt-1">${itemState.note}</p>` : ''}
                    ${itemState.photos && itemState.photos.length > 0 ? 
                        `<p class="text-xs text-gray-500 mt-2"><i class="fas fa-camera mr-1"></i>${itemState.photos.length} photo(s) attached</p>` : ''}
                </div>
            `;
        });
        
        html += `</div></div>`;
    });
    
    return html || '<p class="text-gray-500 italic">No findings recorded.</p>';
}

function generatePhotoEvidenceHTML() {
    if (appState.photos.length === 0) {
        return '<p class="col-span-3 text-gray-500 italic text-center py-4">No photos attached</p>';
    }
    
    let html = '';
    appState.photos.slice(0, 12).forEach(photo => {
        // FIXED: Letterbox Container for Forensic Data Integrity
        html += `
            <div class="break-inside-avoid">
                <div class="w-full aspect-square bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                    <img src="${photo.data}" class="max-w-full max-h-full object-contain" alt="${photo.caption}">
                </div>
                <div class="p-2 text-xs text-gray-600 truncate text-center">${photo.caption}</div>
            </div>
        `;
    });
    
    return html;
}

function generateReportId() {
    const seed = `${appState.header.propAddress}_${appState.header.inspectDate}_${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash = hash & hash;
    }
    return `LPM-${Math.abs(hash).toString(36).substr(0, 8).toUpperCase()}`;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function updateTypeDescription() {
    const type = document.getElementById('inspectionType').value;
    const desc = document.getElementById('typeDescription');
    const descriptions = APP_CONFIG.INSPECTION_TYPES;
    
    if (desc && descriptions[type]) {
        desc.textContent = descriptions[type];
    }
}

function generateAutoSummary() {
    const type = appState.header.inspectionType || 'routine';
    const typeLabel = APP_CONFIG.INSPECTION_TYPES[type];
    const today = appState.header.inspectDate || new Date().toISOString().split('T')[0];
    
    // Count statuses
    let passCount = 0, failCount = 0, criticalFail = 0;
    Object.values(appState.items).forEach(item => {
        if (item.status === 'pass') passCount++;
        if (item.status === 'fail') failCount++;
    });
    
    // Get critical items
    const criticalItems = Object.keys(appState.items).filter(itemId => {
        const item = document.querySelector(`[data-item-id="${itemId}"]`);
        return item && item.dataset.critical === 'true' && appState.items[itemId].status === 'fail';
    });
    
    criticalFail = criticalItems.length;
    
    let summary = `On ${today}, a ${typeLabel} was conducted at ${appState.header.propAddress || 'the property'}. `;
    
    if (passCount > 0) summary += `${passCount} items passed. `;
    if (failCount > 0) summary += `${failCount} items failed. `;
    if (criticalFail > 0) summary += `CRITICAL: ${criticalFail} safety-critical items failed. `;
    if (appState.photos.length > 0) summary += `${appState.photos.length} photos captured. `;
    
    if (failCount === 0 && criticalFail === 0) {
        summary += `The property meets all standards.`;
    } else if (criticalFail > 0) {
        summary += `IMMEDIATE ACTION REQUIRED: Critical safety items must be addressed before listing.`;
    } else {
        summary += `Non-critical deficiencies require follow-up.`;
    }
    
    document.getElementById('finalNotes').value = summary;
    updateStateField('finalNotes', summary);
}

function collectFormData() {
    document.querySelectorAll('[data-state-key]').forEach(field => {
        const key = field.dataset.stateKey;
        updateStateField(key, field.value);
    });
    
    const unitStatus = document.querySelector('input[name="unitStatus"]:checked');
    if (unitStatus) {
        appState.unitStatus = unitStatus.value;
    }
    
    appState.deficiencyNotes = document.getElementById('deficiencyNotes').value;
    appState.finalNotes = document.getElementById('finalNotes').value;
}

function confirmReset() {
    if (!APP_CONFIG.UI.CONFIRM_RESET || confirm('Clear all inspection data? This cannot be undone.')) {
        resetForm();
    }
}

function resetForm() {
    appState = {
        header: {
            propAddress: "",
            unitRef: "",
            cityRegion: "",
            inspectDate: new Date().toISOString().split('T')[0],
            assessorName: "",
            tenantName: "",
            inspectionType: "routine"
        },
        items: {},
        photos: [],
        deficiencyNotes: "",
        finalNotes: "",
        unitStatus: "",
        lastSaved: null,
        version: APP_CONFIG.VERSION
    };
    
    localStorage.removeItem(APP_CONFIG.STORAGE.DRAFT_KEY);
    updateUIFromState();
    renderChecklist();
    renderPhotoGrid();
    window.location.reload();
}

// Start the engine
document.addEventListener('DOMContentLoaded', initApp);
