// FILE: config.js
// VERSION: 3.2.1 - Production Release (Fixed)
// DATE: February 3, 2026

const APP_CONFIG = {
    VERSION: "3.2.1",
    BRAND_NAME: "Leaso Assessor App",
    
    // Status options for checklist items
    STATUS_OPTIONS: [
        { value: 'pass', label: 'PASS' },
        { value: 'fail', label: 'FAIL' },
        { value: 'na', label: 'N/A' },
        { value: 'repair', label: 'REPAIR' }
    ],
    
    // Inspection type definitions
    INSPECTION_TYPES: {
        routine: "Routine Safety Check",
        turnover: "Turnover Inspection",
        moveIn: "Move-In Inspection",
        moveOut: "Move-Out Inspection",
        deltaReport: "Delta Report (Office Analysis)"
    },
    
    INSPECTION_DESCRIPTIONS: {
        routine: "Quick safety verification during active tenancy. Focus on life-critical systems and compliance. Duration: 15-20 minutes.",
        turnover: "Comprehensive rent-ready verification between tenancies. Ensures unit meets market standards before advertising. Duration: 30-45 minutes.",
        moveIn: "Baseline documentation before tenant occupancy. Creates exportable reference for future damage assessment. Duration: 45-60 minutes.",
        moveOut: "Exit documentation after tenant vacates. Field observation only - no comparison or calculation required. Duration: 45-60 minutes.",
        deltaReport: "Office-based comparative analysis. Systematically compares Move-In baseline vs Move-Out exit data to identify damage, calculate costs, and prepare evidence for legal proceedings. Requires importing both Move-In and Move-Out reports. Duration: 60-90 minutes. FOR OFFICE STAFF ONLY."
    },
    
    // Storage configuration
    STORAGE: {
        DRAFT_KEY: "assessor_draft",
        HISTORY_KEY: "assessor_history",
        BASELINE_KEY: "assessor_movein_baseline",
        AUTO_SAVE_INTERVAL: 30000 // 30 seconds
    },
    
    // UI and behavior configuration
    UI: {
        AUTO_GENERATE_SUMMARY: true,
        PHOTO_COMPRESSION_QUALITY: 0.8,
        MAX_PHOTO_DIMENSION: 1920,
        MAX_PHOTOS: 25,
        CONFIRM_RESET: true,
        SHOW_BETA_FEATURES: true
    },
    
    // Report generation configuration
    REPORT: {
        INCLUDE_TIMESTAMP: true,
        INCLUDE_QR_CODE: true,
        INCLUDE_JSON_DATA_PAGE: true,
        QR_CODE_SIZE: 250,
        QR_CODE_CORRECTION_LEVEL: "H" // High error correction
    },
    
    // Delta Report configuration
    DELTA: {
        REQUIRE_MOVEIN_IMPORT: true,
        REQUIRE_MOVEOUT_IMPORT: true,
        VALIDATE_ADDRESS_MATCH: true,
        SHOW_IMPORT_WARNINGS: true
    },
    
    // Photo validation requirements by inspection type
    PHOTO_VALIDATION: {
        moveIn: {
            minPhotosRequired: 5,
            criticalItems: ["exterior_baseline", "room_wide_shots"]
        },
        moveOut: {
            minPhotosRequired: 5,
            criticalItems: ["room_wide_final", "damage_macro_photos"]
        },
        deltaReport: {
            minPhotosRequired: 0
        }
    }
};

// Export for Node.js environment (if applicable)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APP_CONFIG };
}
