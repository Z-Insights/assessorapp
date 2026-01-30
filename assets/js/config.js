// FILE: config.js
// CLASSIFICATION: System Settings & Technical Constraints
// PURPOSE: Control panel for compression tuning, limits, and app behavior

const APP_CONFIG = {
    // Version & Branding
    VERSION: "v2.1.1-PATCHED",
    BRAND_NAME: "Leaso Property Management",
    
    // Image Compression Settings (Optimized for mobile networks)
    IMAGE: {
        MAX_WIDTH: 800,              // px - Balanced quality/size
        QUALITY: 0.5,                // 0.0-1.0 - JPEG compression
        MAX_PHOTOS: 25,              // Prevent browser memory crashes
        THUMBNAIL_SIZE: 120          // px - For grid display
    },
    
    // Storage & Persistence
    STORAGE: {
        AUTO_SAVE_INTERVAL: 5000,    // ms - Save every 5 seconds
        DRAFT_KEY: "leaso_assessor_draft",
        STATE_KEY: "leaso_assessor_state"
    },
    
    // UI & Behavior
    UI: {
        SHOW_PHOTO_COUNTER: true,
        AUTO_GENERATE_SUMMARY: true,
        CONFIRM_RESET: true,
        SMOOTH_SCROLL: true
    },
    
    // Inspection Types Mapping
    INSPECTION_TYPES: {
        routine: "Routine / Periodic (Safety Focus)",
        turnover: "Rent-Ready / Turnover (Forensic)",
        moveIn: "Move-In (Baseline)",
        moveOut: "Move-Out (Damage Assessment)"
    },
    
    // Status Options
    STATUS_OPTIONS: [
        { value: "pass", label: "Pass", color: "green" },
        { value: "fail", label: "Fail", color: "red" },
        { value: "na", label: "N/A", color: "gray" },
        { value: "repair", label: "Needs Repair", color: "yellow" }
    ]
};

// Export for modular consumption
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APP_CONFIG };
}
