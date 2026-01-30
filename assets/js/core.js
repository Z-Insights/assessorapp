// FILE: core.js (Enhanced Version)
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
    photos: [], // { id, data, caption, itemId, timestamp, filename }
    
    // Global Notes
    deficiencyNotes: "",
    finalNotes: "",
    unitStatus: "",
    
    // Metadata
    lastSaved: null,
    created: new Date().toISOString(),
    version: APP_CONFIG.VERSION,
    sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    
    // Analytics
    timeSpent: 0, // in seconds
    lastActivity: Date.now()
};

// ============================================================================
// INITIALIZATION FUNCTIONS
// ============================================================================

function initApp() {
    console.log(`Initializing ${APP_CONFIG.BRAND_NAME} Assessor v${APP_CONFIG.VERSION}`);
    
    // Check dependencies
    if (!window.APP_CONFIG || !window.PROPERTIES_DATA || !window.CHECKLIST_SCHEMAS) {
        console.error('Missing dependencies. Please check script loading order.');
        showError('Application failed to initialize. Please refresh the page.');
        return;
    }
    
    // 1. Load saved draft
    const draftLoaded = loadDraft();
    
    // 2. Initialize property autocomplete
    initPropertyList();
    
    // 3. Set default inspection type radio
    const defaultType = appState.header.inspectionType || 'routine';
    document.querySelector(`input[name="inspectionType"][value="${defaultType}"]`).checked = true;
    
    // 4. Render the checklist based on current type
    renderChecklist();
    
    // 5. Set up event listeners
    setupEventListeners();
    
    // 6. Start auto-save interval
    startAutoSave();
    
    // 7. Update UI based on state
    updateUIFromState();
    
    // 8. Initialize time tracking
    startTimeTracking();
    
    // 9. Check online status
    updateConnectionStatus();
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    
    console.log("App initialized successfully" + (draftLoaded ? " (draft loaded)" : ""));
}

function initPropertyList() {
    const datalist = document.getElementById('propertyList');
    if (!datalist) return;
    
    datalist.innerHTML = '';
    
    PROPERTIES_DATA.forEach(property => {
        const option = document.createElement('option');
        option.value = `${property.address}, ${property.city}`;
        option.dataset.city = property.city;
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

function setupEventListeners() {
    // Header field auto-save (using more efficient event delegation)
    document.addEventListener('input', (e) => {
        const target = e.target;
        if (target.matches('[data-state-key]')) {
            const key = target.dataset.stateKey;
            const value = target.type === 'radio' ? target.value : target.value;
            updateStateField(key, value);
            
            if (key === 'inspectionType') {
                updateTypeDescription();
                renderChecklist();
            }
            
            if (target.matches('textarea')) {
                updateCharacterCount(target.id);
            }
        }
    });
    
    // Radio button changes (inspection type)
    document.querySelectorAll('input[name="inspectionType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            updateStateField('inspectionType', e.target.value);
            updateTypeDescription();
            renderChecklist();
        });
    });
    
    // Radio button changes (unit status)
    document.querySelectorAll('input[name="unitStatus"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            updateStateField('unitStatus', e.target.value);
            updateRadioVisual(e.target);
        });
    });
    
    // Photo upload
    document.getElementById('bulkPhotoInput').addEventListener('change', handlePhotoUpload);
    document.getElementById('btnBulkUpload').addEventListener('click', () => {
        document.getElementById('bulkPhotoInput').click();
    });
    
    // Buttons
    document.getElementById('btnSaveDraft').addEventListener('click', saveDraft);
    document.getElementById('btnShowReport').addEventListener('click', () => toggleReportModal(true));
    document.getElementById('btnGenerateReport').addEventListener('click', function() {
        showLoading();
        setTimeout(() => {
            generateReport();
            toggleReportModal(false);
            hideLoading();
        }, 500);
    });
    
    document.getElementById('btnReset').addEventListener('click', confirmReset);
    document.getElementById('btnAutoSummary').addEventListener('click', generateAutoSummary);
    document.getElementById('btnQuickFill').addEventListener('click', quickFillDemoData);
    document.getElementById('btnExportData').addEventListener('click', exportData);
    
    // Character count for textareas
    document.getElementById('deficiencyNotes').addEventListener('input', () => {
        updateCharacterCount('deficiencyNotes');
    });
    document.getElementById('finalNotes').addEventListener('input', () => {
        updateCharacterCount('finalNotes');
    });
    
    // Print handling
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('print-mode');
    });
    
    window.addEventListener('afterprint', () => {
        document.body.classList.remove('print-mode');
    });
    
    // Prevent accidental navigation
    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges() && appState.photos.length > 0) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes and photos. Are you sure you want to leave?';
            return e.returnValue;
        }
    });
    
    // Initialize radio button visuals
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        updateRadioVisual(radio);
        radio.addEventListener('change', (e) => updateRadioVisual(e.target));
    });
}

// ============================================================================
// CHECKLIST RENDERING ENGINE (ENHANCED)
// ============================================================================

function renderChecklist() {
    const container = document.getElementById('checklistContainer');
    if (!container) return;
    
    const type = appState.header.inspectionType || 'routine';
    const schema = CHECKLIST_SCHEMAS[type] || CHECKLIST_SCHEMAS.routine;
    
    container.innerHTML = '';
    
    // Add search/filter functionality for large checklists
    if (schema.length > 3) {
        const searchBox = document.createElement('div');
        searchBox.className = 'mb-4';
        searchBox.innerHTML = `
            <div class="relative">
                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                <input type="text" id="checklistSearch" 
                       class="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                       placeholder="Search checklist items...">
                <button id="clearSearch" class="absolute right-3 top-2 text-gray-400 hover:text-gray-600 hidden">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        container.appendChild(searchBox);
        
        // Add search functionality
        const searchInput = searchBox.querySelector('#checklistSearch');
        const clearBtn = searchBox.querySelector('#clearSearch');
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            clearBtn.classList.toggle('hidden', !searchTerm);
            
            container.querySelectorAll('.check-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.classList.toggle('hidden', searchTerm && !text.includes(searchTerm));
                item.classList.toggle('opacity-100', !searchTerm || text.includes(searchTerm));
                item.classList.toggle('opacity-50', searchTerm && !text.includes(searchTerm));
            });
        });
        
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.classList.add('hidden');
            container.querySelectorAll('.check-item').forEach(item => {
                item.classList.remove('hidden', 'opacity-50');
                item.classList.add('opacity-100');
            });
        });
    }
    
    let totalItems = 0;
    let completedItems = 0;
    
    schema.forEach(section => {
        // Create section card
        const sectionCard = document.createElement('div');
        sectionCard.className = `bg-white rounded-lg shadow-sm border p-5 ${section.colorClass} checklist-section`;
        sectionCard.dataset.sectionId = section.id;
        
        // Section header with expand/collapse
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-4 border-b pb-2 cursor-pointer';
        header.addEventListener('click', () => {
            const content = sectionCard.querySelector('.section-content');
            const icon = header.querySelector('.toggle-icon');
            content.classList.toggle('hidden');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
        
        const title = document.createElement('div');
        title.className = 'flex items-center';
        title.innerHTML = `
            <i class="fas fa-folder-open mr-2"></i>
            <h2 class="font-bold text-lg text-gray-800">${section.title}</h2>
        `;
        
        const headerRight = document.createElement('div');
        headerRight.className = 'flex items-center gap-3';
        
        const badge = document.createElement('span');
        badge.className = 'text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700';
        badge.textContent = section.badge;
        
        const toggleIcon = document.createElement('i');
        toggleIcon.className = 'toggle-icon fas fa-chevron-down text-gray-400';
        
        const sectionCount = document.createElement('span');
        sectionCount.className = 'text-xs text-gray-500';
        sectionCount.textContent = `${section.items.length} items`;
        
        headerRight.appendChild(sectionCount);
        headerRight.appendChild(badge);
        headerRight.appendChild(toggleIcon);
        
        header.appendChild(title);
        header.appendChild(headerRight);
        
        // Items container (initially visible)
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'section-content space-y-4 mt-4';
        
        // Render each item
        section.items.forEach(item => {
            totalItems++;
            const itemId = item.id;
            const existingState = appState.items[itemId] || { status: '', note: '', photos: [] };
            if (existingState.status) completedItems++;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = `check-item bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors ${item.critical ? 'border-l-4 border-l-red-600' : ''}`;
            itemDiv.dataset.itemId = itemId;
            itemDiv.dataset.critical = item.critical;
            itemDiv.dataset.searchable = `${item.label} ${item.sub || ''}`.toLowerCase();
            
            // Item header with quick actions
            const itemHeader = document.createElement('div');
            itemHeader.className = 'flex justify-between items-start mb-3';
            
            const labelContainer = document.createElement('div');
            labelContainer.className = 'flex-1';
            
            const label = document.createElement('label');
            label.className = 'block font-bold text-gray-800 mb-1 cursor-pointer';
            label.textContent = item.label;
            label.addEventListener('click', () => {
                const noteInput = itemDiv.querySelector('textarea');
                noteInput.focus();
            });
            
            if (item.sub) {
                const sub = document.createElement('p');
                sub.className = 'text-xs text-gray-600';
                sub.textContent = item.sub;
                labelContainer.appendChild(label);
                labelContainer.appendChild(sub);
            } else {
                labelContainer.appendChild(label);
            }
            
            // Quick status buttons
            const quickStatus = document.createElement('div');
            quickStatus.className = 'flex gap-1 ml-2';
            
            ['pass', 'fail', 'na'].forEach(status => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `w-8 h-8 rounded text-xs ${existingState.status === status ? `status-${status}` : 'bg-gray-200 text-gray-700'}`;
                btn.innerHTML = status === 'pass' ? '✓' : status === 'fail' ? '✗' : '–';
                btn.title = status.toUpperCase();
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    updateItemStatus(itemId, status);
                    // Update all buttons in this item
                    itemDiv.querySelectorAll('.quick-status button').forEach(b => {
                        b.className = 'w-8 h-8 rounded text-xs bg-gray-200 text-gray-700';
                    });
                    btn.className = `w-8 h-8 rounded text-xs status-${status}`;
                });
                quickStatus.appendChild(btn);
            });
            quickStatus.className += ' quick-status';
            
            itemHeader.appendChild(labelContainer);
            itemHeader.appendChild(quickStatus);
            
            // Status selector (full buttons)
            const statusRow = document.createElement('div');
            statusRow.className = 'flex flex-wrap gap-2 mb-3';
            
            APP_CONFIG.STATUS_OPTIONS.forEach(status => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `px-3 py-1.5 rounded text-xs font-medium transition-all ${existingState.status === status.value ? `status-${status.value} scale-105` : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;
                button.textContent = status.label;
                button.dataset.status = status.value;
                
                button.addEventListener('click', () => {
                    updateItemStatus(itemId, status.value);
                    // Update all buttons in this row
                    statusRow.querySelectorAll('button').forEach(btn => {
                        btn.className = 'px-3 py-1.5 rounded text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300';
                    });
                    button.className = `px-3 py-1.5 rounded text-xs font-medium status-${status.value} scale-105`;
                });
                
                statusRow.appendChild(button);
            });
            
            // Photo upload for this item
            const photoRow = document.createElement('div');
            photoRow.className = 'flex items-center gap-2 mb-3 flex-wrap';
            
            const photoInput = document.createElement('input');
            photoInput.type = 'file';
            photoInput.accept = 'image/*, .heic, .heif';
            photoInput.className = 'text-xs';
            photoInput.multiple = true;
            photoInput.addEventListener('change', (e) => handleItemPhotoUpload(e, itemId));
            
            // Accessibility: unique described-by hint per item
            const itemHelpId = `photoHelpText-${itemId}`;
            photoInput.setAttribute('aria-describedby', itemHelpId);
            
            const photoLabel = document.createElement('span');
            photoLabel.className = 'text-xs text-gray-600';
            photoLabel.innerHTML = '<i class="fas fa-camera mr-1"></i> Add Evidence';
            
            const photoWrapper = document.createElement('label');
            photoWrapper.className = 'cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors';
            photoWrapper.appendChild(photoLabel);
            photoWrapper.appendChild(photoInput);
            photoRow.appendChild(photoWrapper);
            
            // Show existing photos count
            if (existingState.photos && existingState.photos.length > 0) {
                const photoCount = document.createElement('span');
                photoCount.className = 'text-xs bg-green-100 text-green-800 px-2 py-1 rounded';
                photoCount.innerHTML = `<i class="fas fa-check mr-1"></i>${existingState.photos.length} photo(s)`;
                photoRow.appendChild(photoCount);
            }

            // Note input with character count
            const noteWrapper = document.createElement('div');
            noteWrapper.className = 'relative';
            
            const noteInput = document.createElement('textarea');
            noteInput.className = 'w-full border rounded px-3 py-2 text-sm mt-2 pr-10';
            noteInput.placeholder = 'Add notes for this item...';
            noteInput.value = existingState.note || '';
            noteInput.rows = 2;
            noteInput.addEventListener('input', () => {
                updateItemNote(itemId, noteInput.value);
                updateNoteCharacterCount(noteInput, noteCounter);
            });
            
            const noteCounter = document.createElement('span');
            noteCounter.className = 'absolute bottom-3 right-2 text-xs text-gray-400';
            noteCounter.textContent = `${existingState.note?.length || 0}/500`;
            
            noteWrapper.appendChild(noteInput);
            noteWrapper.appendChild(noteCounter);
            
            // Assemble item
            itemDiv.appendChild(itemHeader);
            itemDiv.appendChild(statusRow);
            itemDiv.appendChild(photoRow);
            itemDiv.appendChild(noteWrapper);
            
            // Show existing photos for this item (as thumbnails)
            if (existingState.photos && existingState.photos.length > 0) {
                const photoGrid = document.createElement('div');
                photoGrid.className = 'flex gap-2 mt-3 overflow-x-auto pb-2';
                
                existingState.photos.forEach(photoId => {
                    const photo = appState.photos.find(p => p.id === photoId);
                    if (photo) {
                        const thumbWrapper = document.createElement('div');
                        thumbWrapper.className = 'relative flex-shrink-0';
                        
                        const thumb = document.createElement('img');
                        thumb.src = photo.data;
                        thumb.className = 'photo-thumbnail w-20 h-20';
                        thumb.title = photo.caption || 'Evidence';
                        thumb.loading = 'lazy';
                        
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center';
                        deleteBtn.innerHTML = '×';
                        deleteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            removePhoto(photo.id);
                        });
                        
                        thumbWrapper.appendChild(thumb);
                        thumbWrapper.appendChild(deleteBtn);
                        photoGrid.appendChild(thumbWrapper);
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
    
    // Update progress
    updateProgress(completedItems, totalItems);
    
    // Update critical findings
    updateCriticalFindings();
}

// ============================================================================
// ENHANCED STATE MANAGEMENT
// ============================================================================

function updateStateField(key, value) {
    // Handle nested state (header fields)
    if (key in appState.header) {
        appState.header[key] = value;
    } else {
        appState[key] = value;
    }
    
    // Update last activity
    appState.lastActivity = Date.now();
    
    // Auto-save trigger
    debouncedSave();
    
    // Update progress if checklist items changed
    if (key.startsWith('items.')) {
        updateProgressFromState();
    }
}

function updateItemStatus(itemId, status) {
    if (!appState.items[itemId]) {
        appState.items[itemId] = { status: '', note: '', photos: [], timestamp: Date.now() };
    }
    
    appState.items[itemId].status = status;
    appState.items[itemId].timestamp = Date.now();
    appState.lastActivity = Date.now();
    
    // Update critical fail tracking
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    if (itemElement && status === 'fail' && itemElement.dataset.critical === 'true') {
        showCriticalAlert(itemId);
        updateCriticalFindings();
    }
    
    // Update progress
    updateProgressFromState();
    
    debouncedSave();
}

function updateItemNote(itemId, note) {
    if (!appState.items[itemId]) {
        appState.items[itemId] = { status: '', note: '', photos: [], timestamp: Date.now() };
    }
    
    appState.items[itemId].note = note.substring(0, 500); // Limit to 500 chars
    appState.items[itemId].timestamp = Date.now();
    appState.lastActivity = Date.now();
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
    
    // Update radio buttons
    const inspectionTypeRadio = document.querySelector(`input[name="inspectionType"][value="${appState.header.inspectionType}"]`);
    if (inspectionTypeRadio) inspectionTypeRadio.checked = true;
    
    const unitStatusRadio = document.querySelector(`input[name="unitStatus"][value="${appState.unitStatus}"]`);
    if (unitStatusRadio) unitStatusRadio.checked = true;
    
    // Update notes
    document.getElementById('deficiencyNotes').value = appState.deficiencyNotes || '';
    document.getElementById('finalNotes').value = appState.finalNotes || '';
    
    // Update character counts
    updateCharacterCount('deficiencyNotes');
    updateCharacterCount('finalNotes');
    
    // Update photo counter
    updatePhotoCounter();
    
    // Update type description
    updateTypeDescription();
    
    // Update last saved indicator
    updateLastSavedIndicator();
    
    // Update progress
    updateProgressFromState();
}

// ============================================================================
// ENHANCED IMAGE COMPRESSION ENGINE
// ============================================================================

async function compressImage(file) {
    return new Promise((resolve, reject) => {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            reject(new Error('File size exceeds 10MB limit'));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions maintaining aspect ratio
                let width = img.width;
                let height = img.height;
                
                if (width > APP_CONFIG.IMAGE.MAX_WIDTH) {
                    const ratio = APP_CONFIG.IMAGE.MAX_WIDTH / width;
                    width = APP_CONFIG.IMAGE.MAX_WIDTH;
                    height = height * ratio;
                }
                
                // Ensure minimum dimensions for thumbnails
                if (width < 100) width = 100;
                if (height < 100) height = 100;
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with quality setting
                const compressedData = canvas.toDataURL('image/jpeg', APP_CONFIG.IMAGE.QUALITY);
                
                // Generate filename with timestamp
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `evidence_${timestamp}_${Math.random().toString(36).substr(2, 5)}.jpg`;
                
                resolve({
                    original: file.name,
                    data: compressedData,
                    filename: filename,
                    size: compressedData.length,
                    originalSize: file.size,
                    width: width,
                    height: height,
                    timestamp: Date.now(),
                    compressed: (file.size - compressedData.length) > 0
                });
            };
            
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
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
        showNotification(`Photo limit reached. Only ${remaining} photos will be processed.`, 'warning');
    }
    
    // Show processing indicator
    showLoading(`Processing ${toProcess.length} photo(s)...`);
    
    let processed = 0;
    let errors = [];
    
    for (const file of toProcess) {
        try {
            const compressed = await compressImage(file);
            
            const photo = {
                id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                data: compressed.data,
                filename: compressed.filename,
                caption: file.name.replace(/\.[^/.]+$/, ""),
                timestamp: Date.now(),
                itemId: null,
                metadata: {
                    originalSize: compressed.originalSize,
                    compressedSize: compressed.size,
                    dimensions: `${compressed.width}x${compressed.height}`,
                    compressionRatio: Math.round((1 - compressed.size / compressed.originalSize) * 100)
                }
            };
            
            appState.photos.push(photo);
            processed++;
            
            // Update progress
            updatePhotoCounter();
            
        } catch (error) {
            console.error('Photo compression failed:', error);
            errors.push(`${file.name}: ${error.message}`);
        }
    }
    
    // Hide loading
    hideLoading();
    
    // Show results
    if (processed > 0) {
        renderPhotoGrid();
        showNotification(`Successfully added ${processed} photo(s)`, 'success');
    }
    
    if (errors.length > 0) {
        showNotification(`Failed to process ${errors.length} photo(s): ${errors.join(', ')}`, 'error');
    }
    
    // Reset input
    event.target.value = '';
    debouncedSave();
}

async function handleItemPhotoUpload(event, itemId) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    
    // Check limit
    const remaining = APP_CONFIG.IMAGE.MAX_PHOTOS - appState.photos.length;
    const toProcess = files.slice(0, Math.min(remaining, files.length));
    
    showLoading(`Adding ${toProcess.length} photo(s) to item...`);
    
    for (const file of toProcess) {
        try {
            const compressed = await compressImage(file);
            
            const photo = {
                id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                data: compressed.data,
                filename: compressed.filename,
                caption: `item_${itemId}_evidence`,
                timestamp: Date.now(),
                itemId: itemId,
                metadata: {
                    originalSize: compressed.originalSize,
                    compressedSize: compressed.size,
                    dimensions: `${compressed.width}x${compressed.height}`
                }
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
            
        } catch (error) {
            console.error('Item photo compression failed:', error);
        }
    }
    
    hideLoading();
    
    // Re-render checklist to show new photo
    renderChecklist();
    renderPhotoGrid();
    updatePhotoCounter();
    
    event.target.value = '';
    debouncedSave();
}

// ============================================================================
// ENHANCED REPORT GENERATION ENGINE
// ============================================================================

function generateReport() {
    // Update state from form
    collectFormData();
    
    // Generate auto-summary if enabled
    if (APP_CONFIG.UI.AUTO_GENERATE_SUMMARY) {
        generateAutoSummary();
    }
    
    const reportContent = document.getElementById('reportContent');
    if (!reportContent) return;
    
    const inspectionType = appState.header.inspectionType || 'routine';
    const typeLabel = APP_CONFIG.INSPECTION_TYPES[inspectionType] || inspectionType;
    
    // Calculate statistics
    const stats = calculateInspectionStats();
    
    // Build report HTML with enhanced styling
    const reportHTML = `
        <div class="space-y-8">
            <!-- Header -->
            <div class="border-b-2 border-blue-600 pb-6">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <div class="bg-blue-600 text-white p-3 rounded-lg">
                                <i class="fas fa-clipboard-check text-2xl"></i>
                            </div>
                            <div>
                                <p class="text-xs uppercase tracking-widest text-gray-500 mb-1">${APP_CONFIG.BRAND_NAME}</p>
                                <h1 class="text-2xl font-bold text-gray-900">Field Assessment Report</h1>
                                <p class="text-sm text-gray-600">Forensic Safety + Rent-Ready Protocol</p>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="bg-gray-50 p-3 rounded-lg inline-block">
                            <p class="text-sm font-mono font-bold">${new Date().toLocaleDateString('en-CA')}</p>
                            <p class="text-xs text-gray-500">v${APP_CONFIG.VERSION}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Executive Summary Card -->
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                <div class="flex items-center mb-4">
                    <i class="fas fa-chart-line text-2xl text-blue-600 mr-3"></i>
                    <h2 class="text-xl font-bold text-gray-900">Executive Summary</h2>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">${appState.finalNotes || 'No summary provided.'}</p>
                </div>
                <div class="grid grid-cols-4 gap-4 mt-6">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-600">${stats.pass}</div>
                        <div class="text-xs text-gray-600">Passed</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold ${stats.fail > 0 ? 'text-red-600' : 'text-gray-600'}">${stats.fail}</div>
                        <div class="text-xs text-gray-600">Failed</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-600">${stats.photos}</div>
                        <div class="text-xs text-gray-600">Photos</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold ${stats.critical > 0 ? 'text-red-600' : 'text-green-600'}">${stats.critical}</div>
                        <div class="text-xs text-gray-600">Critical</div>
                    </div>
                </div>
            </div>
            
            <!-- Property Information -->
            <div>
                <h2 class="text-lg font-bold border-b pb-2 mb-4 text-gray-800">
                    <i class="fas fa-home mr-2"></i>Property Information
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase block mb-1">Property Address</label>
                            <p class="font-bold text-gray-900 text-lg">${appState.header.propAddress || 'Not specified'}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-xs font-bold text-gray-500 uppercase block mb-1">Unit / Area</label>
                                <p class="text-gray-700">${appState.header.unitRef || 'N/A'}</p>
                            </div>
                            <div>
                                <label class="text-xs font-bold text-gray-500 uppercase block mb-1">City / Region</label>
                                <p class="text-gray-700">${appState.header.cityRegion || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-xs font-bold text-gray-500 uppercase block mb-1">Inspection Type</label>
                                <p class="font-bold text-gray-700">${typeLabel}</p>
                            </div>
                            <div>
                                <label class="text-xs font-bold text-gray-500 uppercase block mb-1">Inspection Date</label>
                                <p class="text-gray-700">${appState.header.inspectDate || 'Not specified'}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-xs font-bold text-gray-500 uppercase block mb-1">Assessor</label>
                                <p class="text-gray-700">${appState.header.assessorName || 'Not specified'}</p>
                            </div>
                            <div>
                                <label class="text-xs font-bold text-gray-500 uppercase block mb-1">Tenant Reference</label>
                                <p class="text-gray-700">${appState.header.tenantName || 'Vacant / N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Findings by Section -->
            <div>
                <h2 class="text-lg font-bold border-b pb-2 mb-4 text-gray-800">
                    <i class="fas fa-clipboard-check mr-2"></i>Detailed Findings
                </h2>
                
                ${generateFindingsHTML()}
            </div>
            
            <!-- Photo Evidence -->
            ${appState.photos.length > 0 ? `
            <div>
                <h2 class="text-lg font-bold border-b pb-2 mb-4 text-gray-800">
                    <i class="fas fa-camera mr-2"></i>Photographic Evidence
                    <span class="text-sm font-normal text-gray-600 ml-2">(${appState.photos.length} photos)</span>
                </h2>
                
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    ${generatePhotoEvidenceHTML()}
                </div>
            </div>
            ` : ''}
            
            <!-- Footer -->
            <div class="pt-8 border-t">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="text-center md:text-left">
                        <p class="text-xs font-bold text-gray-500 mb-2">Report Information</p>
                        <p class="text-sm text-gray-600">
                            <strong>Report ID:</strong> ${generateReportId()}<br>
                            <strong>Session:</strong> ${appState.sessionId.substring(0, 8)}<br>
                            <strong>Time Spent:</strong> ${formatTimeSpent(appState.timeSpent)}
                        </p>
                    </div>
                    <div class="text-center">
                        <div class="bg-gray-50 p-4 rounded-lg inline-block">
                            <p class="text-xs text-gray-500 mb-1">Overall Status</p>
                            <p class="text-xl font-bold ${appState.unitStatus === 'PASS' ? 'text-green-600' : appState.unitStatus === 'FAIL' ? 'text-red-600' : 'text-yellow-600'}">
                                ${appState.unitStatus || 'PENDING'}
                            </p>
                        </div>
                    </div>
                    <div class="text-center md:text-right">
                        <p class="text-xs text-gray-500">
                            Generated by ${APP_CONFIG.BRAND_NAME} Unified Field Assessor<br>
                            This report is an official property management record.
                        </p>
                        <p class="text-xs text-gray-400 mt-2">
                            <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
                            ${navigator.onLine ? '<i class="fas fa-wifi text-green-500"></i> Online' : '<i class="fas fa-wifi-slash text-red-500"></i> Offline'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    reportContent.innerHTML = reportHTML;
}

// ============================================================================
// NEW ENHANCEMENT FUNCTIONS
// ============================================================================

function updateProgressFromState() {
    const type = appState.header.inspectionType || 'routine';
    const schema = CHECKLIST_SCHEMAS[type] || CHECKLIST_SCHEMAS.routine;
    
    let totalItems = 0;
    let completedItems = 0;
    
    schema.forEach(section => {
        totalItems += section.items.length;
        section.items.forEach(item => {
            if (appState.items[item.id] && appState.items[item.id].status) {
                completedItems++;
            }
        });
    });
    
    updateProgress(completedItems, totalItems);
}

function updateProgress(completed, total) {
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
        
        // Color code based on progress
        if (percent >= 90) {
            progressBar.className = 'bg-green-600 h-2 rounded-full progress-fill';
        } else if (percent >= 50) {
            progressBar.className = 'bg-blue-600 h-2 rounded-full progress-fill';
        } else {
            progressBar.className = 'bg-yellow-600 h-2 rounded-full progress-fill';
        }
    }
    
    if (progressPercent) {
        progressPercent.textContent = `${percent}%`;
    }
}

function updateCriticalFindings() {
    const criticalItems = Object.keys(appState.items).filter(itemId => {
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        return itemElement && 
               itemElement.dataset.critical === 'true' && 
               appState.items[itemId].status === 'fail';
    });
    
    const criticalSection = document.getElementById('criticalSummary');
    const criticalCount = document.getElementById('criticalCount');
    const criticalList = document.getElementById('criticalList');
    
    if (criticalItems.length > 0) {
        criticalSection.classList.remove('hidden');
        criticalCount.textContent = criticalItems.length;
        
        let listHTML = '<ul class="list-disc pl-5 space-y-1">';
        criticalItems.forEach(itemId => {
            const item = document.querySelector(`[data-item-id="${itemId}"]`);
            const label = item?.querySelector('label')?.textContent || itemId;
            listHTML += `<li>${label}</li>`;
        });
        listHTML += '</ul>';
        criticalList.innerHTML = listHTML;
    } else {
        criticalSection.classList.add('hidden');
    }
}

function updateCharacterCount(textareaId) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(textareaId === 'deficiencyNotes' ? 'deficiencyCount' : 'summaryCount');
    
    if (textarea && counter) {
        const length = textarea.value.length;
        counter.textContent = `${length} characters`;
        
        // Color code based on length
        if (length > 1000) {
            counter.className = 'text-xs text-red-500';
        } else if (length > 500) {
            counter.className = 'text-xs text-yellow-500';
        } else {
            counter.className = 'text-xs text-gray-500';
        }
    }
}

function updateNoteCharacterCount(textarea, counter) {
    const length = textarea.value.length;
    counter.textContent = `${length}/500`;
    counter.className = `text-xs ${length >= 450 ? 'text-red-500' : 'text-gray-400'}`;
}

function updateConnectionStatus() {
    const statusElement = document.getElementById('connectionStatus');
    if (statusElement) {
        if (navigator.onLine) {
            statusElement.innerHTML = '<i class="fas fa-circle text-[8px] text-green-500"></i> Online';
            statusElement.className = 'text-xs text-green-600 flex items-center gap-1';
        } else {
            statusElement.innerHTML = '<i class="fas fa-circle text-[8px] text-red-500"></i> Offline';
            statusElement.className = 'text-xs text-red-600 flex items-center gap-1';
            
            // Show offline notification
            showNotification('Working offline - changes will sync when connection is restored', 'warning');
        }
    }
}

function updateLastSavedIndicator() {
    const lastSavedElement = document.getElementById('lastSaved');
    if (lastSavedElement && appState.lastSaved) {
        const lastSaved = new Date(appState.lastSaved);
        const now = new Date();
        const diffMinutes = Math.round((now - lastSaved) / (1000 * 60));
        
        if (diffMinutes < 1) {
            lastSavedElement.textContent = '• Just now';
        } else if (diffMinutes < 60) {
            lastSavedElement.textContent = `• ${diffMinutes}m ago`;
        } else {
            lastSavedElement.textContent = `• ${lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }
    }
}

function updateRadioVisual(radio) {
    const label = radio.closest('label');
    if (!label) return;
    
    if (radio.checked) {
        label.classList.add('has-checked:border-green-500', 'has-checked:bg-green-50');
        const checkmark = label.querySelector('.w-3.h-3');
        if (checkmark) checkmark.classList.remove('hidden');
    } else {
        label.classList.remove('has-checked:border-green-500', 'has-checked:bg-green-50');
        const checkmark = label.querySelector('.w-3.h-3');
        if (checkmark) checkmark.classList.add('hidden');
    }
}

function calculateInspectionStats() {
    const stats = {
        pass: 0,
        fail: 0,
        na: 0,
        repair: 0,
        critical: 0,
        photos: appState.photos.length,
        total: 0
    };
    
    Object.values(appState.items).forEach(item => {
        if (item.status) {
            stats[item.status]++;
            stats.total++;
        }
    });
    
    // Count critical failures
    Object.keys(appState.items).forEach(itemId => {
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        if (itemElement && 
            itemElement.dataset.critical === 'true' && 
            appState.items[itemId].status === 'fail') {
            stats.critical++;
        }
    });
    
    return stats;
}

function startTimeTracking() {
    setInterval(() => {
        if (document.hasFocus()) {
            appState.timeSpent++;
        }
    }, 1000);
}

function formatTimeSpent(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

function quickFillDemoData() {
    if (!confirm('Fill with demo data? This will replace current data.')) return;
    
    // Sample demo data
    appState.header = {
        propAddress: "2480 Prince Michael Drive",
        unitRef: "Unit 201",
        cityRegion: "Oakville",
        inspectDate: new Date().toISOString().split('T')[0],
        assessorName: "John Smith",
        tenantName: "Demo Tenant",
        inspectionType: "turnover"
    };
    
    // Fill some checklist items
    const schema = CHECKLIST_SCHEMAS.turnover;
    schema.forEach(section => {
        section.items.forEach((item, index) => {
            const statuses = ['pass', 'fail', 'na', 'repair'];
            appState.items[item.id] = {
                status: statuses[index % 4],
                note: index % 3 === 0 ? 'Sample note for this item' : '',
                photos: [],
                timestamp: Date.now()
            };
        });
    });
    
    // Update UI
    updateUIFromState();
    renderChecklist();
    showNotification('Demo data loaded successfully', 'success');
}

function exportData() {
    const dataStr = JSON.stringify(appState, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `leaso_inspection_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Data exported successfully', 'success');
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();
    
    const colors = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `notification-toast fixed top-4 right-4 z-[9999] p-4 rounded-lg border ${colors[type]} shadow-lg max-w-sm transition-all duration-300 transform translate-x-0`;
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas ${icons[type]} text-lg"></i>
            <div class="flex-1">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

function showLoading(message = 'Processing...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.querySelector('p').textContent = message;
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

function downloadReportPDF() {
    showLoading('Generating PDF...');
    
    setTimeout(() => {
        // In a real implementation, this would use jsPDF or similar library
        // For now, we'll use the print functionality
        window.print();
        hideLoading();
        showNotification('PDF ready for printing/download', 'success');
    }, 1500);
}

// ============================================================================
// INITIALIZE APPLICATION
// ============================================================================

// Wait for DOM and dependencies
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        appState, 
        initApp, 
        compressImage, 
        generateReport,
        generateAutoSummary,
        calculateInspectionStats,
        formatTimeSpent
    };
}
