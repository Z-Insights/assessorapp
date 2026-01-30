// FILE: config.js (Enhanced Version)
// CLASSIFICATION: System Settings & Technical Constraints
// PURPOSE: Control panel for compression tuning, limits, and app behavior

const APP_CONFIG = {
    // Version & Branding
    VERSION: "v2.2.0-PRODUCTION",  // Updated version
    BRAND_NAME: "Leaso Property Management",
    REPORT_PREFIX: "LPM",           // Added for report IDs
    
    // Image Compression Settings (Optimized for mobile networks)
    IMAGE: {
        MAX_WIDTH: 800,              // px - Balanced quality/size
        QUALITY: 0.5,                // 0.0-1.0 - JPEG compression
        MAX_PHOTOS: 25,              // Prevent browser memory crashes
        THUMBNAIL_SIZE: 120,         // px - For grid display
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB max file size (NEW)
        SUPPORTED_FORMATS: ["image/jpeg", "image/png", "image/gif", "image/heic", "image/heif"] // NEW
    },
    
    // Storage & Persistence
    STORAGE: {
        AUTO_SAVE_INTERVAL: 5000,    // ms - Save every 5 seconds
        DRAFT_KEY: "leaso_assessor_draft_v2", // Updated key for new version
        STATE_KEY: "leaso_assessor_state_v2",  // Updated key
        SESSION_KEY: "leaso_session_id"        // NEW
    },
    
    // UI & Behavior
    UI: {
        SHOW_PHOTO_COUNTER: true,
        AUTO_GENERATE_SUMMARY: true,
        CONFIRM_RESET: true,
        SMOOTH_SCROLL: true,
        SHOW_PROGRESS_BAR: true,               // NEW
        SHOW_CONNECTION_STATUS: true,          // NEW
        SHOW_CRITICAL_ALERTS: true,            // NEW
        ENABLE_SEARCH: true,                   // NEW
        ENABLE_NOTIFICATIONS: true,            // NEW
        AUTO_GENERATE_REPORT_ID: true          // NEW
    },
    
    // Text Limits & Validation
    VALIDATION: {
        ITEM_NOTE_MAX_LENGTH: 500,             // NEW
        DEFICIENCY_NOTES_MAX_LENGTH: 2000,     // NEW
        FINAL_NOTES_MAX_LENGTH: 2000,          // NEW
        MIN_ASSESSOR_NAME_LENGTH: 2,           // NEW
        MIN_PROPERTY_ADDRESS_LENGTH: 5         // NEW
    },
    
    // Inspection Types Mapping
    INSPECTION_TYPES: {
        routine: "Routine / Periodic (Safety Focus)",
        turnover: "Rent-Ready / Turnover (Forensic)",
        moveIn: "Move-In (Baseline)",
        moveOut: "Move-Out (Damage Assessment)"
    },
    
    // Status Options (Enhanced with icons)
    STATUS_OPTIONS: [
        { value: "pass", label: "✓ Pass", color: "green", icon: "fa-check-circle" },
        { value: "fail", label: "✗ Fail", color: "red", icon: "fa-times-circle" },
        { value: "na", label: "– N/A", color: "gray", icon: "fa-minus-circle" },
        { value: "repair", label: "🔧 Repair", color: "yellow", icon: "fa-tools" }
    ],
    
    // Progress Bar Thresholds (NEW)
    PROGRESS: {
        LOW_THRESHOLD: 0.3,    // Below 30% - red zone
        MEDIUM_THRESHOLD: 0.7, // Below 70% - yellow zone
        HIGH_THRESHOLD: 0.9    // Above 90% - green zone
    },
    
    // Notification Settings (NEW)
    NOTIFICATIONS: {
        AUTO_HIDE_DELAY: 5000, // ms
        SUCCESS_DURATION: 3000,
        ERROR_DURATION: 5000,
        WARNING_DURATION: 4000
    },
    
    // Performance & Analytics (NEW)
    PERFORMANCE: {
        ENABLE_TIME_TRACKING: true,
        MAX_UNDO_STEPS: 10,
        DEBOUNCE_DELAY: 1000,
        LAZY_LOAD_THRESHOLD: 100 // Items before enabling lazy load
    },
    
    // Export & Report Settings (NEW)
    EXPORT: {
        DEFAULT_FILENAME_PREFIX: "Leaso_Inspection_",
        PDF_OPTIONS: {
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        },
        JSON_PRETTY_PRINT: true
    },
    
    // Mobile-Specific Settings (NEW)
    MOBILE: {
        ENABLE_TOUCH_GESTURES: true,
        LONG_PRESS_DELAY: 500,
        SWIPE_THRESHOLD: 50
    }
};

// Export for modular consumption
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APP_CONFIG };
}
