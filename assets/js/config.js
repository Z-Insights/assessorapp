// FILE: config.js
// VERSION: 3.2 - Production Release
// DATE: February 3, 2026
// CLASSIFICATION: Application Configuration
// PURPOSE: Centralized configuration for branding, storage, and inspection type definitions

const APP_CONFIG = {
	// Application Identity
	VERSION: "3.2",
	BRAND_NAME: "Leaso Assessor App",
	
	// Inspection Type Definitions
	INSPECTION_TYPES: {
		routine: "Routine Safety Check",
		turnover: "Turnover Inspection",
		moveIn: "Move-In Inspection",
		moveOut: "Move-Out Inspection",
		deltaReport: "Delta Report (Office Analysis)"
	},
	
	// Inspection Type Descriptions
	INSPECTION_DESCRIPTIONS: {
		routine: "Quick safety verification during active tenancy. Focus on life-critical systems and compliance. Duration: 15-20 minutes.",
		turnover: "Comprehensive rent-ready verification between tenancies. Ensures unit meets market standards before advertising. Duration: 30-45 minutes.",
		moveIn: "Baseline documentation before tenant occupancy. Creates exportable reference for future damage assessment. Duration: 45-60 minutes.",
		moveOut: "Exit documentation after tenant vacates. Field observation only - no comparison or calculation required. Duration: 45-60 minutes.",
		deltaReport: "Office-based comparative analysis. Systematically compares Move-In baseline vs Move-Out exit data to identify damage, calculate costs, and prepare evidence for legal proceedings. Requires importing both Move-In and Move-Out reports. Duration: 60-90 minutes. FOR OFFICE STAFF ONLY."
	},
	
	// Storage Configuration
	STORAGE: {
		DRAFT_KEY: "assessor_draft",
		HISTORY_KEY: "assessor_history",
		BASELINE_KEY: "assessor_movein_baseline"
	},
	
	// UI Behavior Configuration
	UI: {
		AUTO_SAVE_INTERVAL: 30000, // 30 seconds
		PHOTO_COMPRESSION_QUALITY: 0.8,
		MAX_PHOTO_DIMENSION: 1920,
		CONFIRM_RESET: true,
		SHOW_BETA_FEATURES: true
	},
	
	// Report Generation Configuration
	REPORT: {
		INCLUDE_TIMESTAMP: true,
		INCLUDE_QR_CODE: true, // For Move-In reports
		INCLUDE_JSON_DATA_PAGE: true, // Embed full JSON data as final page
		QR_CODE_SIZE: 250,
		QR_CODE_CORRECTION_LEVEL: "H" // High error correction
	},
	
	// Delta Report Configuration
	DELTA: {
		REQUIRE_MOVEIN_IMPORT: true,
		REQUIRE_MOVEOUT_IMPORT: true,
		VALIDATE_ADDRESS_MATCH: true,
		SHOW_IMPORT_WARNINGS: true
	},
	
	// Photo Validation Requirements
	PHOTO_VALIDATION: {
		moveIn: {
			minPhotosRequired: 5, // Minimum photos for room documentation
			criticalItems: ["exterior_baseline", "room_wide_shots"]
		},
		moveOut: {
			minPhotosRequired: 5,
			criticalItems: ["room_wide_final", "damage_macro_photos"]
		},
		deltaReport: {
			minPhotosRequired: 0 // Delta Report uses imported photos
		}
	}
};

// Export for modular consumption
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { APP_CONFIG };
}
