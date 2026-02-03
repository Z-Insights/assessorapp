// FILE: core.js
// CLASSIFICATION: The Engine - State Management, Rendering, Compression, Reporting + Delta Report + QR Code
// PURPOSE: Executable processor that brings the app to life with forensic Move-In/Move-Out capability
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
    // Checklist Items
    items: {},
    // Global Photos
    photos: [],
    // Global Notes
    deficiencyNotes: "",
    finalNotes: "",
    unitStatus: "",
    // Metadata
    lastSaved: null,
    version: APP_CONFIG.VERSION,
    // === DELTA REPORT ENHANCEMENTS v3.2 ===
    moveInReference: null,     // Stores imported Move-In baseline data
    moveOutReference: null,    // Stores imported Move-Out report data
    deltaReport: null,         // Stores generated comparison analysis
    deltaImportStatus: {       // Tracks import completion for Delta Report workflow
        moveInImported: false,
        moveOutImported: false,
        addressMatch: false,
        validationErrors: []
    }
};

// ============================================================================
// INITIALIZATION FUNCTIONS
// ============================================================================
function initApp() {
    console.log(`Initializing \( {APP_CONFIG.BRAND_NAME} Assessor v \){APP_CONFIG.VERSION}`);
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
    // 9. Load inspection history for current property if available
    if (appState.header.propAddress && appState.header.inspectionType === 'moveOut') {
        loadMoveInReference();
    }
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
            // Load inspection history for this property
            updateInspectionHistoryBadge(e.target.value);
            if (appState.header.inspectionType === 'moveOut') {
                loadMoveInReference();
            }
        }
    });
}

function optimizePhotoInput(elementId) {
    const input = document.getElementById(elementId);
    if (input) {
        // Use specific MIME types to encourage "Gallery or Camera" prompt
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
                // Load Move-In reference if switching to Move-Out with property set
                if (field.value === 'moveOut' && appState.header.propAddress) {
                    loadMoveInReference();
                } else if (field.value !== 'moveOut') {
                    appState.moveInReference = null;
                    document.getElementById('btnGenerateDelta')?.classList.add('hidden');
                }
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
    // NEW: Delta Report button
    document.getElementById('btnGenerateDelta')?.addEventListener('click', () => {
        const deltaReport = generateDeltaReport();
        if (deltaReport) {
            // Visual feedback
            const btn = document.getElementById('btnGenerateDelta');
            btn.innerHTML = '<i class="fas fa-check mr-1"></i> Delta Generated';
            btn.classList.replace('bg-purple-600', 'bg-green-600');
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-balance-scale mr-1"></i> Generate Delta Report';
                btn.classList.replace('bg-green-600', 'bg-purple-600');
            }, 2000);
            // Regenerate report to include Delta section when shown
        }
    });
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
    // Delta banner scroll handling
    document.getElementById('reportModal')?.addEventListener('scroll', function() {
        const banner = document.getElementById('deltaReportBanner');
        if (banner && !banner.classList.contains('hidden')) {
            banner.style.position = 'sticky';
            banner.style.top = '0';
            banner.style.zIndex = '100';
        }
    });
    
    // NEW: Export/Import Baseline Event Listeners
    document.getElementById('btnExportBaseline')?.addEventListener('click', exportMoveInBaseline);
    document.getElementById('btnImportBaseline')?.addEventListener('click', () => {
        document.getElementById('importBaselineInput').click();
    });
    document.getElementById('importBaselineInput')?.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            importMoveInBaseline(e.target.files[0]);
            e.target.value = ''; // Reset input for re-use
        }
    });
    // === DELTA REPORT EVENT LISTENERS ===
    document.getElementById('btnImportMoveIn')?.addEventListener('click', importMoveInBaseline);
    document.getElementById('btnImportMoveOut')?.addEventListener('click', importMoveOutReport);
    document.getElementById('btnQRScanMoveIn')?.addEventListener('click', () => openQRScanner('moveIn'));
    document.getElementById('btnQRScanMoveOut')?.addEventListener('click', () => openQRScanner('moveOut'));
    document.getElementById('btnCloseQRScanner')?.addEventListener('click', closeQRScanner);

    // Show/hide Delta Report import controls based on inspection type
    document.getElementById('inspectionType').addEventListener('change', function() {
        const deltaControls = document.getElementById('deltaReportControls');
        if (deltaControls) {
            if (this.value === 'deltaReport') {
                deltaControls.classList.remove('hidden');
            } else {
                deltaControls.classList.add('hidden');
            }
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
            // Status selector - FIXED: Using event delegation
            const statusRow = document.createElement('div');
            statusRow.className = 'flex flex-wrap gap-2 mb-3';
            APP_CONFIG.STATUS_OPTIONS.forEach(status => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `px-3 py-1.5 rounded text-xs font-medium \( {existingState.status === status.value ? `status- \){status.value}` : 'bg-gray-200 text-gray-700'}`;
                button.textContent = status.label;
                button.dataset.itemId = itemId; // Store item ID on button
                button.dataset.status = status.value; // Store status on button
                statusRow.appendChild(button);
            });
            // Add click event to status row using event delegation
            statusRow.addEventListener('click', function(e) {
                if (e.target.tagName === 'BUTTON' && e.target.dataset.itemId && e.target.dataset.status) {
                    const clickedItemId = e.target.dataset.itemId;
                    const clickedStatus = e.target.dataset.status;
                    
                    // Update item status
                    updateItemStatus(clickedItemId, clickedStatus);
                    
                    // Update button styles
                    const buttons = this.querySelectorAll('button');
                    buttons.forEach(btn => {
                        const btnStatus = btn.dataset.status;
                        if (btnStatus === clickedStatus) {
                            btn.className = `px-3 py-1.5 rounded text-xs font-medium status-${clickedStatus}`;
                        } else {
                            btn.className = `px-3 py-1.5 rounded text-xs font-medium bg-gray-200 text-gray-700`;
                        }
                    });
                }
            });
            // Photo upload for this item
            const photoRow = document.createElement('div');
            photoRow.className = 'flex items-center gap-2 mb-3';
            const photoInput = document.createElement('input');
            photoInput.type = 'file';
            photoInput.accept = 'image/png, image/jpeg, image/jpg, image/webp';
            photoInput.className = 'text-xs hidden';
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
// DELTA REPORT: JSON IMPORT & QR CODE SCANNING FUNCTIONS
// ============================================================================

/**
* Opens file picker for importing Move-In baseline JSON
* Triggered by "Import Move-In Baseline" button in Delta Report mode
*/
function importMoveInBaseline() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);
                    validateAndLoadMoveInBaseline(data);
                } catch (error) {
                    alert(`Error reading Move-In baseline file: ${error.message}\n\nPlease ensure you selected a valid JSON export file from a
Move-In inspection.`);
                    console.error('Move-In baseline import error:', error);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

/**
* Opens file picker for importing Move-Out report JSON
* Triggered by "Import Move-Out Report" button in Delta Report mode
*/
function importMoveOutReport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);
                    validateAndLoadMoveOutReport(data);
                } catch (error) {
                    alert(`Error reading Move-Out report file: ${error.message}\n\nPlease ensure you selected a valid JSON export file from a
Move-Out inspection.`);
                    console.error('Move-Out report import error:', error);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

/**
* Validates and loads Move-In baseline data into appState
* Performs comprehensive validation of data structure and content
*/
function validateAndLoadMoveInBaseline(data) {
    const errors = [];
    // Validate basic structure
    if (!data || typeof data !== 'object') {
        errors.push('Invalid data format - not a valid JSON object');
    }
    // Validate inspection type
    if (data.header && data.header.inspectionType !== 'moveIn') {
        errors.push(`Wrong inspection type: Expected "moveIn" but got "${data.header.inspectionType}"`);
    }
    // Validate required fields
    if (!data.header || !data.header.propAddress) {
        errors.push('Missing property address in baseline data');
    }
    if (!data.header || !data.header.inspectDate) {
        errors.push('Missing inspection date in baseline data');
    }
    if (!data.items || Object.keys(data.items).length === 0) {
        errors.push('No inspection items found in baseline data');
    }
    // Display errors if any
    if (errors.length > 0) {
        alert(`Cannot import Move-In baseline:\n\n${errors.join('\n')}\n\nPlease verify you selected the correct Move-In inspection export
file.`);
        appState.deltaImportStatus.validationErrors = errors;
        return false;
    }
    // Load data into appState
    appState.moveInReference = {
        reportId: data.reportId || generateReportId(),
        date: data.header.inspectDate,
        propAddress: data.header.propAddress,
        unitRef: data.header.unitRef,
        tenantName: data.header.tenantName,
        items: data.items,
        photos: data.photos || [],
        fullData: data // Store complete data for reference
    };
    appState.deltaImportStatus.moveInImported = true;
    // Check if both imports complete and addresses match
    checkDeltaImportCompletion();
    // Update UI feedback
    const statusEl = document.getElementById('moveInImportStatus');
    if (statusEl) {
        statusEl.innerHTML = `<i class="fas fa-check-circle text-green-600"></i> Move-In baseline imported: ${data.header.propAddress}`;
        statusEl.classList.remove('hidden');
    }
    // Mark import item as complete
    updateItemStatus('import_movein_baseline', 'pass', `Imported: ${data.header.propAddress}, Date: ${data.header.inspectDate}`);
    alert(`✓ Move-In baseline imported successfully!\n\nProperty: ${data.header.propAddress}\nDate: ${data.header.inspectDate}\nItems:
${Object.keys(data.items).length}\nPhotos: ${(data.photos || []).length}`);
    return true;
}

/**
* Validates and loads Move-Out report data into appState
* Performs comprehensive validation including address matching with Move-In baseline
*/
function validateAndLoadMoveOutReport(data) {
    const errors = [];
    // Validate basic structure
    if (!data || typeof data !== 'object') {
        errors.push('Invalid data format - not a valid JSON object');
    }
    // Validate inspection type
    if (data.header && data.header.inspectionType !== 'moveOut') {
        errors.push(`Wrong inspection type: Expected "moveOut" but got "${data.header.inspectionType}"`);
    }
    // Validate required fields
    if (!data.header || !data.header.propAddress) {
        errors.push('Missing property address in report data');
    }
    if (!data.header || !data.header.inspectDate) {
        errors.push('Missing inspection date in report data');
    }
    if (!data.items || Object.keys(data.items).length === 0) {
        errors.push('No inspection items found in report data');
    }
    // Display errors if any
    if (errors.length > 0) {
        alert(`Cannot import Move-Out report:\n\n${errors.join('\n')}\n\nPlease verify you selected the correct Move-Out inspection export
file.`);
        appState.deltaImportStatus.validationErrors = errors;
        return false;
    }
    // Load data into appState
    appState.moveOutReference = {
        reportId: data.reportId || generateReportId(),
        date: data.header.inspectDate,
        propAddress: data.header.propAddress,
        unitRef: data.header.unitRef,
        tenantName: data.header.tenantName,
        items: data.items,
        photos: data.photos || [],
        fullData: data // Store complete data for reference
    };
    appState.deltaImportStatus.moveOutImported = true;
    // Check if both imports complete and addresses match
    checkDeltaImportCompletion();
    // Update UI feedback
    const statusEl = document.getElementById('moveOutImportStatus');
    if (statusEl) {
        statusEl.innerHTML = `<i class="fas fa-check-circle text-green-600"></i> Move-Out report imported: ${data.header.propAddress}`;
        statusEl.classList.remove('hidden');
    }
    // Mark import item as complete
    updateItemStatus('import_moveout_report', 'pass', `Imported: ${data.header.propAddress}, Date: ${data.header.inspectDate}`);
    alert(`✓ Move-Out report imported successfully!\n\nProperty: ${data.header.propAddress}\nDate: ${data.header.inspectDate}\nItems:
${Object.keys(data.items).length}\nPhotos: ${(data.photos || []).length}`);
    return true;
}

/**
* Checks if both Move-In and Move-Out imports are complete
* Validates that property addresses match
* Updates UI status indicators
*/
function checkDeltaImportCompletion() {
    if (!appState.deltaImportStatus.moveInImported || !appState.deltaImportStatus.moveOutImported) {
        return; // Not both imported yet
    }
    // Check address match
    const moveInAddr = appState.moveInReference.propAddress.toLowerCase().trim();
    const moveOutAddr = appState.moveOutReference.propAddress.toLowerCase().trim();
    appState.deltaImportStatus.addressMatch = (moveInAddr === moveOutAddr);
    if (!appState.deltaImportStatus.addressMatch) {
        const warning = `⚠️ ADDRESS MISMATCH WARNING\n\nMove-In Address: ${appState.moveInReference.propAddress}\nMove-Out
Address: ${appState.moveOutReference.propAddress}\n\nThese appear to be different properties. Please verify you imported the
correct reports.\n\nYou can continue, but comparison results may not be meaningful.`;
        alert(warning);
        // Mark verification item with warning
        updateItemStatus('verify_property_match', 'fail', `ADDRESS MISMATCH: Move-In "${appState.moveInReference.propAddress}" vs
Move-Out "${appState.moveOutReference.propAddress}"`);
    } else {
        // Mark verification as passed
        updateItemStatus('verify_property_match', 'pass', `Addresses match: ${appState.moveInReference.propAddress}`);
    }
    // Update completion status indicator
    const completionEl = document.getElementById('deltaImportCompletion');
    if (completionEl) {
        if (appState.deltaImportStatus.addressMatch) {
            completionEl.innerHTML = `<div class="bg-green-100 border-l-4 border-green-600 p-4 mb-4">
                <p class="text-green-800 font-bold"><i class="fas fa-check-circle mr-2"></i>Both reports imported successfully!</p>
                <p class="text-green-700 text-sm mt-1">You can now proceed with the Delta Report analysis using the imported baseline and
exit data.</p>
            </div>`;
        } else {
            completionEl.innerHTML = `<div class="bg-yellow-100 border-l-4 border-yellow-600 p-4 mb-4">
                <p class="text-yellow-800 font-bold"><i class="fas fa-exclamation-triangle mr-2"></i>Both reports imported with address
mismatch</p>
                <p class="text-yellow-700 text-sm mt-1">Verify you imported reports for the same property before proceeding with analysis.</p>
            </div>`;
        }
        completionEl.classList.remove('hidden');
    }
}

/**
* Opens QR code scanner modal for importing baseline data
* Uses device camera to scan QR codes from printed reports or screens
*/
function openQRScanner(importType) {
    // Show QR scanner modal
    const modal = document.getElementById('qrScannerModal');
    if (!modal) {
        alert('QR Scanner not available. Please use JSON file import instead.');
        return;
    }
    modal.classList.remove('hidden');
    // Initialize QR scanner
    const video = document.getElementById('qrVideo');
    const canvas = document.getElementById('qrCanvas');
    const ctx = canvas.getContext('2d');
    // Request camera access
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
            // Start scanning loop
            scanQRCode(video, canvas, ctx, importType, stream);
        })
        .catch(function(error) {
            alert(`Camera access denied or unavailable:\n\n${error.message}\n\nPlease use JSON file import instead.`);
            console.error('Camera error:', error);
            closeQRScanner();
        });
}

/**
* Scans QR code from video stream
* Decodes QR code data and imports into appropriate reference
*/
function scanQRCode(video, canvas, ctx, importType, stream) {
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
        requestAnimationFrame(() => scanQRCode(video, canvas, ctx, importType, stream));
        return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Use jsQR library to decode (must be included in index.html)
    if (typeof jsQR !== 'undefined') {
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
            // QR code detected - stop scanning
            stream.getTracks().forEach(track => track.stop());
            try {
                const data = JSON.parse(code.data);
                // Import based on type
                if (importType === 'moveIn') {
                    validateAndLoadMoveInBaseline(data);
                } else if (importType === 'moveOut') {
                    validateAndLoadMoveOutReport(data);
                }
                closeQRScanner();
            } catch (error) {
                alert(`QR code detected but data is invalid:\n\n${error.message}\n\nPlease scan a valid inspection report QR code.`);
                // Continue scanning
                requestAnimationFrame(() => scanQRCode(video, canvas, ctx, importType, stream));
            }
        } else {
            // No QR code detected - continue scanning
            requestAnimationFrame(() => scanQRCode(video, canvas, ctx, importType, stream));
        }
    } else {
        alert('QR code scanner library not loaded. Please use JSON file import instead.');
        stream.getTracks().forEach(track => track.stop());
        closeQRScanner();
    }
}

/**
* Closes QR scanner modal and stops camera
*/
function closeQRScanner() {
    const modal = document.getElementById('qrScannerModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    const video = document.getElementById('qrVideo');
    if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
}

/**
* Helper function to update inspection item status
* Used for marking Delta Report checklist items as complete during import
*/
function updateItemStatus(itemId, status, note) {
    if (!appState.items[itemId]) {
        appState.items[itemId] = {
            status: status,
            note: note || '',
            photos: [],
            timestamp: new Date().toISOString()
        };
    } else {
        appState.items[itemId].status = status;
        if (note) {
            appState.items[itemId].note = note;
        }
        appState.items[itemId].timestamp = new Date().toISOString();
    }
    // Update UI if item element exists
    const itemEl = document.querySelector(`[data-item-id="${itemId}"]`);
    if (itemEl) {
        const statusSelect = itemEl.querySelector('select');
        if (statusSelect) {
            statusSelect.value = status;
        }
        const noteTextarea = itemEl.querySelector('textarea');
        if (noteTextarea && note) {
            noteTextarea.value = note;
        }
    }
    // Trigger autosave
    debouncedSave();
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
    // Auto-load Move-In reference when property set for Move-Out
    if (key === 'propAddress' && appState.header.inspectionType === 'moveOut' && value) {
        setTimeout(() => {
            loadMoveInReference();
            updateInspectionHistoryBadge(value);
        }, 300);
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
    // Update inspection history badge
    if (appState.header.propAddress) {
        updateInspectionHistoryBadge(appState.header.propAddress);
    }
}

// ============================================================================
// DELTA REPORT & HISTORY FUNCTIONS
// ============================================================================
/**
 * Sanitize property address for localStorage keys
 */
function sanitizeAddress(address) {
    return address.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
}

/**
 * Update inspection history badge showing count of prior inspections
 */
function updateInspectionHistoryBadge(address) {
    if (!address) return;
    const key = `inspection_history_${sanitizeAddress(address)}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    const count = history.length;
    const badge = document.getElementById('inspectionHistoryBadge');
    const countSpan = document.getElementById('historyCount');
    if (badge && countSpan) {
        if (count > 0) {
            countSpan.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

/**
 * Save COMPLETED inspection to history (called after report generation)
 * Stores ONLY critical metadata - NOT photos - to conserve space
 */
function saveCompletedInspection() {
    const { propAddress, inspectionType, inspectDate } = appState.header;
    if (!propAddress || !inspectionType || !inspectDate) return;
    // Create lean history record (NO PHOTOS to save space)
    const historyRecord = {
        type: inspectionType,
        date: inspectDate,
        reportId: generateReportId(),
        timestamp: new Date().toISOString(),
        // Critical metadata only - no photos
        keyItems: {
            hydro_meter: appState.items['hydro_meter_reading']?.note || appState.items['hydro_meter_final']?.note || '',
            keys_issued: appState.items['keys_issued_count']?.note || '',
            keys_returned: appState.items['keys_returned_count']?.note || ''
        },
        summary: (appState.finalNotes || '').substring(0, 200) // First 200 chars
    };
    // Store in property-specific history (max 3 records to conserve space)
    const key = `inspection_history_${sanitizeAddress(propAddress)}`;
    let history = JSON.parse(localStorage.getItem(key) || '[]');
    history.push(historyRecord);
    // Keep only last 3 inspections to prevent quota errors
    if (history.length > 3) history = history.slice(-3);
    try {
        localStorage.setItem(key, JSON.stringify(history));
        console.log(`Saved ${inspectionType} inspection to history for ${propAddress}`);
        // Update UI badge
        updateInspectionHistoryBadge(propAddress);
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.warn('History storage full. Clearing oldest records.');
            localStorage.setItem(key, JSON.stringify(history.slice(-1)));
        }
    }
}

/**
 * Load most recent Move-In inspection for current property
 */
function loadMoveInReference() {
    const propAddress = appState.header.propAddress;
    if (!propAddress || appState.header.inspectionType !== 'moveOut') {
        appState.moveInReference = null;
        document.getElementById('btnGenerateDelta')?.classList.add('hidden');
        return;
    }
    // ADD DELAY TO ENSURE UI IS READY
    setTimeout(() => {
        const key = `inspection_history_${sanitizeAddress(propAddress)}`;
        const history = JSON.parse(localStorage.getItem(key) || '[]');
        const moveInRecords = history.filter(rec => rec.type === 'moveIn');
        if (moveInRecords.length > 0) {
            // Found in localStorage
            const recentMoveIn = moveInRecords[moveInRecords.length - 1];
            appState.moveInReference = {
                reportId: recentMoveIn.reportId,
                date: recentMoveIn.date,
                propAddress: propAddress,
                keyItems: recentMoveIn.keyItems,
                source: 'localStorage'
            };
            const deltaBtn = document.getElementById('btnGenerateDelta');
            if (deltaBtn) {
                deltaBtn.classList.remove('hidden');
                deltaBtn.title = `Loaded baseline from localStorage: ${recentMoveIn.reportId}`;
            }
            // Hide import button when localStorage data found
            document.getElementById('btnImportBaseline')?.classList.add('hidden');
        } else {
            // No localStorage data - show import button
            appState.moveInReference = null;
            document.getElementById('btnGenerateDelta')?.classList.add('hidden');
            document.getElementById('btnImportBaseline')?.classList.remove('hidden');
            if (document.getElementById('typeDescription')) {
                document.getElementById('typeDescription').innerHTML = 
                `<span class="text-orange-600 font-bold">📁 NO LOCAL STORAGE DATA FOUND</span><br>` +
                `<span class="text-sm">Click "Import Baseline" to upload saved file OR scan QR code from Move-In report.</span>`;
            }
        }
        // Show export button for Move-In inspections
        if (appState.header.inspectionType === 'moveIn') {
            document.getElementById('btnExportBaseline')?.classList.remove('hidden');
        }
    }, 100); // Small delay to ensure UI is ready
}

/**
 * Update visibility of baseline import/export buttons based on context
 */
function updateBaselineButtonVisibility() {
    const inspectionType = appState.header.inspectionType;
    const exportBtn = document.getElementById('btnExportBaseline');
    const importBtn = document.getElementById('btnImportBaseline');
    const actionsRow = document.getElementById('baselineActionsRow');
    
    // Hide all by default
    exportBtn?.classList.add('hidden');
    importBtn?.classList.add('hidden');
    actionsRow?.classList.add('hidden');
    
    if (inspectionType === 'moveIn') {
        // For Move-In: Export button will show after report generation
        // This is handled in generateReport function
    } else if (inspectionType === 'moveOut') {
        // For Move-Out: Show Import button if no baseline found
        if (!appState.moveInReference) {
            importBtn?.classList.remove('hidden');
            actionsRow?.classList.remove('hidden');
        }
    }
}

/**
 * Generate Delta Report comparing Move-Out to Move-In baseline
 */
function generateDeltaReport() {
    if (!appState.moveInReference) {
        alert('No Move-In baseline found. Complete a Move-In inspection first.');
        return null;
    }
    const comparisons = [];
    let totalClaim = 0;
    // 1. Meter Readings Comparison - Handle both schemas
    const moveInHydro = appState.moveInReference.keyItems.hydro_meter || 'Not recorded';
    const moveOutHydroItem = appState.items['hydro_meter_final'] || appState.items['hydro_meter_reading'];
    const moveOutHydro = moveOutHydroItem?.note || 'Not recorded';
    if (moveOutHydro !== 'Not recorded' && moveInHydro !== 'Not recorded') {
        const inVal = parseFloat(moveInHydro);
        const outVal = parseFloat(moveOutHydro);
        if (!isNaN(inVal) && !isNaN(outVal) && outVal > inVal) {
            const consumption = outVal - inVal;
            comparisons.push({
                category: "Vital Services",
                item: "Electricity Consumption",
                moveIn: `Reading: ${moveInHydro} kWh`,
                moveOut: `Reading: ${moveOutHydro} kWh`,
                delta: `Consumption: ${consumption.toFixed(1)} kWh`,
                claimAmount: 0,
                evidence: "Photo of final meter reading required"
            });
        }
    }
    // 2. Key Reconciliation
    const moveInKeys = appState.moveInReference.keyItems.keys_issued || '0';
    const moveOutKeys = appState.items['keys_returned_count']?.note || '0';
    const issued = parseInt(moveInKeys) || 0;
    const returned = parseInt(moveOutKeys) || 0;
    const missing = issued - returned;
    if (missing > 0) {
        const keyCost = missing * 25;
        comparisons.push({
            category: "Access Control",
            item: "Missing Keys/Fobs",
            moveIn: `${issued} items issued (Ref: ${appState.moveInReference.reportId})`,
            moveOut: `${returned} items returned`,
            delta: `${missing} items missing`,
            claimAmount: keyCost,
            evidence: "Key inventory documentation"
        });
        totalClaim += keyCost;
    }
    // 3. Surface Damage Flags (based on inspector notes referencing baseline)
    const damageItems = [
        { id: 'flooring_damage', label: 'Flooring Damage', cost: 350 },
        { id: 'walls_damage', label: 'Wall Damage', cost: 150 },
        { id: 'windows_damage', label: 'Window/Screen Damage', cost: 450 }
    ];
    damageItems.forEach(item => {
        const moveOutState = appState.items[item.id];
        if (moveOutState?.status === 'fail' && 
            (moveOutState.note?.toLowerCase().includes('new') || 
             moveOutState.note?.toLowerCase().includes('not in move-in') ||
             moveOutState.note?.toLowerCase().includes('undue'))) {
            comparisons.push({
                category: "Surface Integrity",
                item: item.label,
                moveIn: `Baseline documented in Report ID: ${appState.moveInReference.reportId}`,
                moveOut: moveOutState.note || "Damage present",
                delta: "NEW DAMAGE - Not in Move-In baseline",
                claimAmount: item.cost,
                evidence: "Photos attached to this inspection"
            });
            totalClaim += item.cost;
        }
    });
    // 4. Life Safety Tampering
    const smokeMoveOut = appState.items['smoke_co_final'];
    if (smokeMoveOut?.status === 'fail') {
        comparisons.push({
            category: "Life Safety",
            item: "Smoke/CO Detector",
            moveIn: `Serials documented in Report ID: ${appState.moveInReference.reportId}`,
            moveOut: smokeMoveOut.note || "Missing/damaged",
            delta: "TAMPERING SUSPECTED - Violation of Fire Code",
            claimAmount: 85,
            evidence: "Photo evidence in current inspection"
        });
        totalClaim += 85;
    }
    // 5. Extraordinary Cleaning
    if (appState.items['refuse_debris']?.status === 'fail' || 
        appState.items['appliance_sanitation']?.status === 'fail') {
        comparisons.push({
            category: "Cleanliness",
            item: "Extraordinary Cleaning Required",
            moveIn: "Unit accepted in clean condition (Ref: Move-In Report)",
            moveOut: "Documented contamination requiring professional service",
            delta: "BEYOND NORMAL WEAR - Tenant responsibility per RTA",
            claimAmount: 250,
            evidence: "Photos of refuse/sanitation issues"
        });
        totalClaim += 250;
    }
    // Generate Delta Report object
    const deltaReport = {
        generated: true,
        timestamp: new Date().toISOString(),
        moveInReportId: appState.moveInReference.reportId,
        moveInDate: appState.moveInReference.date,
        comparisons: comparisons,
        totalClaimAmount: totalClaim,
        ltbReady: totalClaim > 0,
        filingDeadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-CA')
    };
    appState.deltaReport = deltaReport;
    return deltaReport;
}

// ============================================================================
// QR CODE & EXPORT/IMPORT FUNCTIONS
// ============================================================================
/**
 * Generate Move-In Baseline Data Object
 */
function generateMoveInBaselineData() {
    if (appState.header.inspectionType !== 'moveIn') {
        throw new Error('Baseline can only be generated for Move-In inspections');
    }
    const baselineData = {
        type: 'moveInBaseline',
        version: APP_CONFIG.VERSION,
        generatedDate: new Date().toISOString(),
        property: {
            address: appState.header.propAddress,
            unit: appState.header.unitRef,
            city: appState.header.cityRegion
        },
        inspection: {
            date: appState.header.inspectDate,
            assessor: appState.header.assessorName,
            tenant: appState.header.tenantName,
            reportId: generateReportId()
        },
        keyItems: {
            hydro_meter: appState.items['hydro_meter_reading']?.note || '',
            water_gas_meter: appState.items['water_gas_meter']?.note || '',
            keys_issued: appState.items['keys_issued_count']?.note || '',
            thermostat_setting: appState.items['thermostat_baseline']?.note || ''
        },
        criticalItems: {
            smoke_co: appState.items['smoke_co_baseline']?.status || '',
            entry_security: appState.items['entry_security_baseline']?.status || ''
        },
        summary: appState.finalNotes || '',
        photoCount: appState.photos.length
    };
    return baselineData;
}

/**
 * Export Move-In Baseline to JSON file
 */
function exportMoveInBaseline() {
    try {
        const baselineData = generateMoveInBaselineData();
        // Convert to JSON and trigger download - FIXED: Added "data:" prefix
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(baselineData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `MoveIn_Baseline_\( {sanitizeAddress(baselineData.property.address)}_ \){baselineData.inspection.date}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        // Visual feedback
        const btn = document.getElementById('btnExportBaseline');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check mr-1"></i> Exported!';
            btn.classList.replace('bg-green-600', 'bg-blue-600');
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-download mr-1"></i> Export Baseline (.json)';
                btn.classList.replace('bg-blue-600', 'bg-green-600');
            }, 2000);
        }
        console.log('Move-In baseline exported successfully');
    } catch (error) {
        console.error('Export failed:', error);
        alert(`Failed to export baseline: ${error.message}`);
    }
}

/**
 * Import Move-In Baseline from JSON file
 */
function importMoveInBaseline(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const baselineData = JSON.parse(e.target.result);
            // Validate the imported data
            if (baselineData.type !== 'moveInBaseline') {
                throw new Error('Invalid file format. Please select a Move-In Baseline file.');
            }
            // Optional: Warn if property address doesn't match
            if (baselineData.property.address !== appState.header.propAddress) {
                if (!confirm(`This baseline is for ${baselineData.property.address}, but you're inspecting ${appState.header.propAddress}. Continue anyway?`)) {
                    return;
                }
            }
            // Load the baseline data into appState
            appState.moveInReference = {
                reportId: baselineData.inspection.reportId,
                date: baselineData.inspection.date,
                propAddress: baselineData.property.address,
                keyItems: baselineData.keyItems,
                criticalItems: baselineData.criticalItems,
                imported: true,
                importedDate: new Date().toISOString(),
                source: 'imported_file'
            };
            // Show success message
            alert(`✅ Move-In Baseline loaded successfully!\nReport ID: ${baselineData.inspection.reportId}\nDate: ${baselineData.inspection.date}\nAssessor: ${baselineData.inspection.assessor}`);
            // Show Delta Report button
            const deltaBtn = document.getElementById('btnGenerateDelta');
            if (deltaBtn) {
                deltaBtn.classList.remove('hidden');
                deltaBtn.title = `Loaded imported baseline: ${baselineData.inspection.reportId}`;
            }
            // Hide import button, show export button
            document.getElementById('btnImportBaseline')?.classList.add('hidden');
            document.getElementById('btnExportBaseline')?.classList.add('hidden');
            console.log('Move-In baseline imported successfully');
        } catch (error) {
            console.error('Import failed:', error);
            alert(`Failed to import baseline: ${error.message}`);
        }
    };
    reader.onerror = function() {
        alert('Failed to read the file. Please try again.');
    };
    reader.readAsText(file);
}

/**
 * Generate QR Code for Move-In Baseline
 */
function generateBaselineQRCode() {
    try {
        const baselineData = generateMoveInBaselineData();
        const qrData = JSON.stringify(baselineData);
        // Create QR code element
        const qrContainer = document.createElement('div');
        qrContainer.id = 'baselineQRCode';
        qrContainer.className = 'text-center p-4';
        qrContainer.innerHTML = `
            <h3 class="font-bold text-lg mb-2">Move-In Baseline QR Code</h3>
            <p class="text-sm text-gray-600 mb-4">Scan with any QR code scanner or phone camera</p>
            <div id="qrCanvas" class="inline-block bg-white p-4 rounded-lg shadow-md"></div>
            <p class="text-xs text-gray-500 mt-2">Report ID: ${baselineData.inspection.reportId}</p>
            <p class="text-xs text-gray-500">Generated: ${new Date().toLocaleString()}</p>
        `;
        // Generate QR code (will be called after element is in DOM)
        setTimeout(() => {
            new QRCode(document.getElementById("qrCanvas"), {
                text: qrData,
                width: 200,
                height: 200,
                correctLevel: QRCode.CorrectLevel.H // High error correction
            });
        }, 100);
        return qrContainer;
    } catch (error) {
        console.error('QR Code generation failed:', error);
        return null;
    }
}

/**
 * Generate JSON Data Page for Report
 */
function generateJSONDataPage() {
    try {
        const baselineData = generateMoveInBaselineData();
        return `
            <div class="page-break" style="page-break-before: always;">
                <div class="border-b-4 border-purple-600 pb-4 mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 flex items-center">
                        <i class="fas fa-file-code text-purple-700 mr-3"></i>
                        Move-In Baseline Data (JSON)
                    </h2>
                    <p class="text-sm text-gray-600 mt-2">
                        This JSON data can be imported into the Assessor App for Move-Out inspections.
                        Copy the entire content below or scan the QR code on the previous page.
                    </p>
                </div>
                <div class="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-xs overflow-x-auto max-h-[70vh]">
                    <pre id="jsonDataDisplay">${JSON.stringify(baselineData, null, 2)}</pre>
                </div>
                <div class="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
                    <h3 class="font-bold text-yellow-900 mb-2">How to Use This Data:</h3>
                    <ol class="list-decimal list-inside space-y-2 text-sm text-yellow-800">
                        <li><strong>Option 1 (QR Code):</strong> Scan the QR code on the previous page with any phone camera or QR scanner</li>
                        <li><strong>Option 2 (Copy/Paste):</strong> Select all text above (Ctrl+A), copy (Ctrl+C), and paste into a .json file</li>
                        <li><strong>Option 3 (Save File):</strong> Use the "Export Baseline" button in the app to download this data as a .json file</li>
                    </ol>
                    <p class="mt-3 font-bold text-yellow-900">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        Keep this report safe! You'll need this data for Move-Out inspections.</p>
                </div>
                <div class="mt-6 text-center text-xs text-gray-500">
                    <p>Report ID: ${baselineData.inspection.reportId} | Generated: ${new Date().toLocaleString()}</p>
                    <p>Property: ${baselineData.property.address}, ${baselineData.property.unit || 'N/A'}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('JSON page generation failed:', error);
        return '';
    }
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
    // Validate file types
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/heic'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
        alert(`Invalid file types detected. Please upload only image files (PNG, JPG, WEBP).`);
        event.target.value = '';
        return;
    }
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
        counter.textContent = `\( {appState.photos.length}/ \){APP_CONFIG.IMAGE.MAX_PHOTOS}`;
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
                // Merge carefully to preserve new structure
                appState = {
                    ...appState,
                    ...parsed,
                    header: { ...appState.header, ...parsed.header },
                    items: { ...appState.items, ...parsed.items },
                    photos: parsed.photos || [],
                    deficiencyNotes: parsed.deficiencyNotes || '',
                    finalNotes: parsed.finalNotes || '',
                    unitStatus: parsed.unitStatus || '',
                    moveInReference: parsed.moveInReference || null,
                    deltaReport: parsed.deltaReport || null
                };
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

function validateInspectionBeforeReport() {
    const requiredFields = ['propAddress', 'inspectDate', 'assessorName'];
    const missing = requiredFields.filter(field => !appState.header[field]);
    if (missing.length > 0) {
        alert(`Please complete required fields: ${missing.join(', ')}`);
        return false;
    }
    // For Move-In/Move-Out, ensure critical items are completed
    if (appState.header.inspectionType === 'moveIn' || appState.header.inspectionType === 'moveOut') {
        const criticalItems = Object.keys(appState.items).filter(key => 
            document.querySelector(`[data-item-id="${key}"]`)?.dataset.critical === 'true'
        );
        const incompleteCritical = criticalItems.filter(key => !appState.items[key]?.status);
        if (incompleteCritical.length > 0) {
            if (!confirm(`Some critical items are incomplete. Continue anyway?`)) {
                return false;
            }
        }
    }
    return true;
}

function generateReport() {
    try {
        // Validate before generating
        if (!validateInspectionBeforeReport()) {
            return;
        }
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
        let reportHTML = `
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
        `;
        // ADD DELTA REPORT SECTION IF APPLICABLE
        if (appState.header.inspectionType === 'moveOut' && appState.deltaReport) {
            const delta = appState.deltaReport;
            reportHTML += `
                <div class="mt-8 pt-6 border-t-4 border-purple-600">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <i class="fas fa-balance-scale text-purple-700 mr-3"></i>
                        DELTA REPORT: Move-In vs Move-Out Comparison
                    </h2>
                    <div class="bg-purple-50 border-l-4 border-purple-600 p-4 mb-6">
                        <p class="font-bold text-purple-900">Move-In Baseline Reference:</p>
                        <p class="text-purple-800">Report ID: <span class="font-mono">${delta.moveInReportId}</span> | Date: ${delta.moveInDate}</p>
                        <p class="text-sm text-purple-700 mt-1 italic">This Delta Report compares current condition against documented Move-In baseline. 
                        Full Move-In report serves as legal evidence of initial condition per LTB guidelines.</p>
                    </div>
            `;
            if (delta.comparisons.length > 0) {
                reportHTML += `<div class="overflow-x-auto mb-6">
                    <table class="min-w-full bg-white border border-gray-200">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-bold text-gray-600">Category</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-gray-600">Item</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-gray-600">Move-In Baseline</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-gray-600">Move-Out Condition</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-gray-600">Delta</th>
                                <th class="px-4 py-3 text-right text-xs font-bold text-gray-600">Claim Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${delta.comparisons.map((comp, idx) => `
                                <tr class="${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-t border-gray-200">
                                    <td class="px-4 py-3 text-sm font-medium text-gray-900">${comp.category}</td>
                                    <td class="px-4 py-3 text-sm text-gray-700">${comp.item}</td>
                                    <td class="px-4 py-3 text-xs text-gray-600">${comp.moveIn}</td>
                                    <td class="px-4 py-3 text-xs text-gray-600">${comp.moveOut}</td>
                                    <td class="px-4 py-3 text-sm ${comp.delta.includes('NEW') || comp.delta.includes('TAMPERING') || comp.delta.includes('BEYOND') ? 'text-red-700 font-bold' : 'text-gray-700'}">
                                        ${comp.delta}
                                    </td>
                                    <td class="px-4 py-3 text-sm font-bold text-right ${comp.claimAmount > 0 ? 'text-green-700' : 'text-gray-500'}">
                                        ${comp.claimAmount > 0 ? `\[ {comp.claimAmount.toFixed(2)}` : '-'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot class="bg-gray-100 font-bold">
                            <tr>
                                <td colspan="5" class="px-4 py-3 text-right text-gray-900">TOTAL CLAIM AMOUNT:</td>
                                <td class="px-4 py-3 text-right text-green-800 text-lg"> \]{delta.totalClaimAmount.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
                    <h3 class="font-bold text-yellow-900 mb-2">LTB Filing Guidance</h3>
                    <ul class="list-disc list-inside space-y-1 text-sm text-yellow-800">
                        <li><strong>Form Required:</strong> L10 (Application to Collect Money Owed by Former Tenant)</li>
                        <li><strong>Filing Deadline:</strong> ${delta.filingDeadline} (1 year from move-out date)</li>
                        <li><strong>Evidence Package:</strong> 
                            <ul class="list-none mt-1 space-y-1">
                                <li>✓ This Move-Out Report (with Delta section)</li>
                                <li>✓ Move-In Report ID: ${delta.moveInReportId}</li>
                                <li>✓ All photographic evidence from this inspection</li>
                                <li>✓ Vendor quotes for repair costs (attach separately)</li>
                            </ul>
                        </li>
                        <li><strong>Strategic Note:</strong> LTB adjudicators require clear comparison between Move-In and Move-Out conditions. This Delta Report provides the forensic narrative required for successful claims per Doucette-Grasby v. Lacey precedent.</li>
                    </ul>
                </div>
                `;
            } else {
                reportHTML += `
                    <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                        <p class="font-bold text-green-900">No changes detected between Move-In and Move-Out.</p>
                        <p class="text-green-800 mt-1">Unit returned in same condition as documented in Move-In Report ID: ${delta.moveInReportId}</p>
                    </div>
                `;
            }
            reportHTML += `</div>`;
        }
        // === NEW: ADD QR CODE & JSON PAGES FOR MOVE-IN INSPECTIONS ===
        if (appState.header.inspectionType === 'moveIn') {
            // Generate QR Code section
            reportHTML += `
                <div class="page-break" style="page-break-before: always;">
                    <div class="border-b-4 border-green-600 pb-4 mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 flex items-center">
                            <i class="fas fa-qrcode text-green-700 mr-3"></i>
                            Move-In Baseline Backup
                        </h2>
                        <p class="text-sm text-gray-600 mt-2">
                            This QR code contains all baseline data needed for future Move-Out inspections. 
                            Keep this report safe and accessible.
                        </p>
                    </div>
                    <div class="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                        <div id="qrCanvasReport" class="inline-block bg-white p-6 rounded-lg shadow-xl"></div>
                        <p class="mt-4 text-sm text-gray-700 font-bold">
                            Scan this QR code with any phone camera or QR scanner to import baseline data
                        </p>
                        <p class="text-xs text-gray-500 mt-2">
                            Report ID: ${generateReportId()} | Generated: ${new Date().toLocaleString()}
                        </p>
                    </div>
                    <div class="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r">
                        <h3 class="font-bold text-blue-900 mb-2">How to Use This QR Code:</h3>
                        <ol class="list-decimal list-inside space-y-2 text-sm text-blue-800">
                            <li><strong>Save this PDF report</strong> in a secure location (cloud storage, company drive, email)</li>
                            <li><strong>At Move-Out inspection</strong> (6-24 months later), open the Assessor App</li>
                            <li><strong>Scan this QR code</strong> using your phone's camera or any QR scanner app</li>
                            <li><strong>Copy the JSON data</strong> that appears and paste it into the import field</li>
                            <li><strong>OR use the "Import Baseline" button</strong> and upload the .json file you exported</li>
                        </ol>
                        <p class="mt-3 text-xs italic text-blue-700">
                            <i class="fas fa-lightbulb mr-1"></i>
                            Pro Tip: Also click "Export Baseline (.json)" button to download a separate .json file as backup.</p>
                    </div>
                </div>
            `;
            // Generate JSON Data section (separate page)
            reportHTML += generateJSONDataPage();
        }
        reportHTML += `
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
// === JSON DATA PAGE (Final Page of Report) ===
// This page contains the complete machine-readable inspection data
// Can be scanned as QR code or extracted as text for re-import
${APP_CONFIG.REPORT.INCLUDE_JSON_DATA_PAGE ? `
<div class="report-page" style="page-break-before: always;">
    <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800">Machine-Readable Data Export</h2>
        <p class="text-sm text-gray-600 mt-2">This page contains the complete inspection data in JSON format</p>
        <p class="text-xs text-gray-500">Can be used to re-import this inspection or for audit verification</p>
    </div>
    <div class="bg-gray-50 border-2 border-gray-300 rounded p-4 mb-6">
        <h3 class="font-bold text-gray-700 mb-2">How to Use This Data:</h3>
        <ul class="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li><strong>Re-Import:</strong> Use "Import JSON" feature to load this inspection into the app</li>
            <li><strong>Delta Report:</strong> Import this Move-In baseline when conducting Move-Out Delta Report analysis</li>
            <li><strong>Audit Trail:</strong> Provides permanent record of all inspection data for legal proceedings</li>
            <li><strong>Data Portability:</strong> Can be transferred between devices, systems, or archived for long-term storage</li>
        </ul>
    </div>
    <div class="bg-white border border-gray-300 rounded p-4">
        <h3 class="font-bold text-gray-700 mb-3">Complete Inspection Data (JSON Format):</h3>
        <pre class="text-xs font-mono bg-gray-100 p-4 rounded border border-gray-300 overflow-x-auto whitespace-pre-wrap break-
words">${JSON.stringify({
            reportId: generateReportId(),
            exportDate: new Date().toISOString(),
            reportType: appState.header.inspectionType,
            header: appState.header,
            items: appState.items,
            photos: appState.photos,
            deficiencyNotes: appState.deficiencyNotes,
            finalNotes: appState.finalNotes,
            unitStatus: appState.unitStatus,
            moveInReference: appState.moveInReference,
            deltaReport: appState.deltaReport,
            version: APP_CONFIG.VERSION
        }, null, 2)}</pre>
    </div>
    <div class="text-center mt-6 text-xs text-gray-500">
        <p>Generated by \( {APP_CONFIG.BRAND_NAME} v \){APP_CONFIG.VERSION}</p>
        <p class="mt-1">Report ID: ${generateReportId()} | Generated: ${new Date().toLocaleString()}</p>
    </div>
</div>
` : ''}
        </div>
        `;
        reportContent.innerHTML = reportHTML;
        // === Generate QR Code after DOM is ready ===
        if (appState.header.inspectionType === 'moveIn') {
            setTimeout(() => {
                try {
                    const baselineData = generateMoveInBaselineData();
                    const qrData = JSON.stringify(baselineData);
                    // Clear any existing QR code
                    const existingQR = document.getElementById('qrCanvasReport');
                    if (existingQR) {
                        existingQR.innerHTML = '';
                        new QRCode(existingQR, {
                            text: qrData,
                            width: 250,
                            height: 250,
                            correctLevel: QRCode.CorrectLevel.H
                        });
                    }
                } catch (error) {
                    console.error('QR Code generation in report failed:', error);
                }
            }, 100);
        }
        // 4. Show Modal
        showReportModal();
        // 5. AFTER REPORT GENERATION: Save completed inspection to history (for Move-In/Move-Out only)
        if (appState.header.inspectionType === 'moveIn' || appState.header.inspectionType === 'moveOut') {
            saveCompletedInspection();
        }
        // Show export button for Move-In inspections after report is generated
        if (appState.header.inspectionType === 'moveIn') {
            document.getElementById('btnExportBaseline')?.classList.remove('hidden');
            document.getElementById('baselineActionsRow')?.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Report generation failed:', error);
        alert(`Error generating report: ${error.message}. Please try again.`);
    }
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
                <h3 class="font-bold text-gray-800 mb-2 \( {section.colorClass} pl-2"> \){section.title}</h3>
                <div class="space-y-3">
        `;
        sectionItems.forEach(item => {
            const itemState = appState.items[item.id];
            const statusClass = itemState.status === 'pass' ? 'bg-green-100 text-green-800' :
                               itemState.status === 'fail' ? 'bg-red-100 text-red-800' :
                               itemState.status === 'repair' ? 'bg-yellow-100 text-yellow-800' :
                               'bg-gray-100 text-gray-800';
            html += `
                <div class="border rounded p-3 break-inside-avoid">
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-medium">${item.label}</span>
                        <span class="text-xs px-2 py-1 rounded \( {statusClass}"> \){itemState.status.toUpperCase()}</span>
                    </div>
                    \( {itemState.note ? `<p class="text-sm text-gray-600 mt-1"> \){itemState.note}</p>` : ''}
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
    appState.photos.forEach(photo => {
        html += `
            <div class="break-inside-avoid">
                <div class="w-full aspect-square bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                    <img src="\( {photo.data}" class="max-w-full max-h-full object-contain" alt=" \){photo.caption}">
                </div>
                <div class="p-2 text-xs text-gray-600 truncate text-center">${photo.caption}</div>
            </div>
        `;
    });
    return html;
}

function generateReportId() {
    const seed = `\( {appState.header.propAddress}_ \){appState.header.inspectDate}_${Date.now()}`;
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
    if (desc) {
        switch(type) {
            case 'moveIn':
                desc.innerHTML = "Document pristine baseline condition. SAVE PDF REPORT - this is your LTB evidence for future Move-Out comparisons.";
                break;
            case 'moveOut':
                if (appState.moveInReference) {
                    desc.innerHTML = `<span class="text-green-700 font-bold">✓ Move-In baseline loaded: ${appState.moveInReference.reportId}</span><br>Complete inspection then click 'Generate Delta Report' before finalizing.`;
                } else {
                    desc.innerHTML = `<span class="text-red-600 font-bold">⚠️ NO MOVE-IN BASELINE FOUND</span><br>Complete a Move-In inspection first to enable Delta Report capability.`;
                }
                break;
            default:
                desc.textContent = APP_CONFIG.INSPECTION_TYPES[type] || '';
        }
    }
    // Update baseline button visibility when type changes
    updateBaselineButtonVisibility();
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
    // Add Delta Report context if applicable
    if (appState.header.inspectionType === 'moveOut' && appState.deltaReport) {
        summary += `\n\nDELTA REPORT: Comparison against Move-In baseline (Report ID: ${appState.deltaReport.moveInReportId}) shows `;
        if (appState.deltaReport.totalClaimAmount > 0) {
            summary += `potential recoverable costs of $${appState.deltaReport.totalClaimAmount.toFixed(2)}. See detailed Delta Report section.`;
        } else {
            summary += `no significant changes to property condition.`;
        }
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
        version: APP_CONFIG.VERSION,
        moveInReference: null,
        deltaReport: null
    };
    localStorage.removeItem(APP_CONFIG.STORAGE.DRAFT_KEY);
    updateUIFromState();
    renderChecklist();
    renderPhotoGrid();
    window.location.reload();
}

// Start the engine
document.addEventListener('DOMContentLoaded', initApp);

