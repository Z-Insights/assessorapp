// FILE: schema.js
// CLASSIFICATION: Operational Logic - Inspection Protocol Definitions
// SYNTHESIS: Combines Forensic Safety (GG 2.0) + Rent-Ready Granular (Lite App)
// PURPOSE: Dynamic checklist generation with forensic rigor

const CHECKLIST_SCHEMAS = {
    // --- ROUTINE: Quick Safety-Focused Inspection ---
    routine: [
        {
            id: "arrival_protocol",
            title: "Arrival & Entry Protocol",
            badge: "RTA s.27",
            colorClass: "border-l-4 border-l-blue-600",
            items: [
                { 
                    id: "notice24", 
                    label: "24-Hour Written Notice Served", 
                    sub: "Confirm legal entry basis before unlocking.",
                    type: "status",
                    critical: false
                },
                { 
                    id: "knockAnnounce", 
                    label: "Knock & Announce 'Property Management'", 
                    sub: "Even if vacant, announce before entry.",
                    type: "status",
                    critical: false
                },
                { 
                    id: "exteriorPhoto", 
                    label: "Exterior Documentation", 
                    sub: "Building front & unit door photos captured.",
                    type: "status",
                    critical: true
                }
            ]
        },
        {
            id: "life_safety",
            title: "Life Safety (Red Line Critical)",
            badge: "DO NOT LIST IF FAILED",
            colorClass: "border-l-4 border-l-red-600",
            items: [
                { 
                    id: "smokeAlarms", 
                    label: "Smoke Alarms - Present & Tested", 
                    sub: "Test button on all levels. Confirm loud beep.",
                    type: "status",
                    critical: true
                },
                { 
                    id: "coAlarms", 
                    label: "CO Alarms - Present & Tested", 
                    sub: "Required if gas appliances or attached garage.",
                    type: "status",
                    critical: true
                },
                { 
                    id: "electricalPanel", 
                    label: "Electrical Panel - Visual Safety", 
                    sub: "No scorch marks, exposed wires, or hazards.",
                    type: "status",
                    critical: true
                }
            ]
        }
    ],

    // --- TURNOVER: Forensic Rent-Ready Inspection ---
    turnover: [
        // --- SECTION 1: SAFETY & SECURITY (THE RED LINE) ---
        {
            id: "safety_core",
            title: "1. Safety & Vital Services (Red Line)",
            badge: "Mandatory Pass",
            colorClass: "border-l-4 border-l-red-600",
            items: [
                { 
                    id: "smoke_co_combo", 
                    label: "Smoke & CO Alarms", 
                    sub: "Tested with audible beep. Present on all sleeping levels.",
                    type: "status",
                    critical: true
                },
                { 
                    id: "elec_panel_gfci", 
                    label: "Electrical Panel & GFCI", 
                    sub: "No scorch marks. Kitchen/Bath GFCIs trip & reset.",
                    type: "status",
                    critical: true
                },
                { 
                    id: "entry_security", 
                    label: "Deadbolts & Strikers", 
                    sub: "Locks operate smoothly. Striker plates secured with long screws.",
                    type: "status",
                    critical: false
                },
                { 
                    id: "window_egress", 
                    label: "Window Security & Egress", 
                    sub: "Bedroom windows open/stay open. Ground floor locks functional.",
                    type: "status",
                    critical: true
                }
            ]
        },

        // --- SECTION 2: SYSTEMS & UTILITIES ---
        {
            id: "systems_utils",
            title: "2. Mechanical Systems & Plumbing",
            badge: "Functional Check",
            colorClass: "border-l-4 border-l-yellow-500",
            items: [
                { 
                    id: "heat_water_val", 
                    label: "Heat & Hot Water", 
                    sub: "Thermostat engages furnace. Hot water at all taps.",
                    type: "status",
                    critical: true
                },
                { 
                    id: "plumbing_dry", 
                    label: "P-Traps & Drains", 
                    sub: "Run water 2 mins. Check under sinks for active drips.",
                    type: "status",
                    critical: false
                },
                { 
                    id: "toilet_mech", 
                    label: "Toilet Mechanics", 
                    sub: "Strong flush. No running water hiss after fill.",
                    type: "status",
                    critical: false
                },
                { 
                    id: "vent_fans", 
                    label: "Exhaust Fans (Bath/Range)", 
                    sub: "Bath fan passes tissue test. Range hood fan draws air.",
                    type: "status",
                    critical: false
                }
            ]
        },

        // --- SECTION 3: KITCHEN & APPLIANCES (THE MONEY ROOM) ---
        {
            id: "kitchen_deep",
            title: "3. Kitchen & Appliances",
            badge: "Market Ready",
            colorClass: "border-l-4 border-l-blue-600",
            items: [
                { 
                    id: "appliance_fridge", 
                    label: "Fridge / Freezer", 
                    sub: "Cooling confirmed. Interior light working. Seals intact.",
                    type: "status",
                    critical: false
                },
                { 
                    id: "appliance_stove", 
                    label: "Stove / Oven", 
                    sub: "All burners ignite/heat. Oven bake element glows.",
                    type: "status",
                    critical: false
                },
                { 
                    id: "appliance_clean", 
                    label: "Appliance Deep Clean", 
                    sub: "Behind/Under fridge & stove. No grease in oven or hood.",
                    type: "status",
                    critical: false
                },
                { 
                    id: "appliance_serials", 
                    label: "Inventory / Serial Tags", 
                    sub: "Photo of serial tags for Asset Management (if new/unlogged).",
                    type: "status",
                    critical: false
                }
            ]
        },

        // --- SECTION 4: INTERIOR FINISHES (COSMETIC APPEAL) ---
        {
            id: "finishes_cosmetic",
            title: "4. Interior Finishes & Hygiene",
            badge: "Show Ready",
            colorClass: "border-l-4 border-l-green-600",
            items: [
                { 
                    id: "walls_trim", 
                    label: "Paint & Trim Condition", 
                    sub: "No large holes (dime-sized), scuffs, or unmatched patches.",
                    type: "status",
                    critical: false
                },
                { 
                    id: "flooring_trans", 
                    label: "Flooring & Transitions", 
                    sub: "No trip hazards. Carpets steam cleaned. Transitions secure.",
                    type: "status",
                    critical: false
                },
                { 
                    id: "pest_forensic", 
                    label: "Pest Evidence (Forensic)", 
                    sub: "Check cupboard corners, under sink, and behind stove.",
                    type: "status",
                    critical: false
                },
                { 
                    id: "deep_clean_gen", 
                    label: "General Deep Clean", 
                    sub: "Windows tracks, baseboards, switch plates wiped down.",
                    type: "status",
                    critical: false
                }
            ]
        },

        // --- SECTION 5: EXTERIOR & CURB APPEAL ---
        {
            id: "exterior_appeal",
            title: "5. Exterior & Curb Appeal",
            badge: "First Impression",
            colorClass: "border-l-4 border-l-gray-600",
            items: [
                { 
                    id: "curb_garbage", 
                    label: "Garbage & Debris", 
                    sub: "Yard/Porch clear of flyers, trash, and old furniture.",
                    type: "status",
                    critical: false
                },
                { 
                    id: "access_clearance", 
                    label: "Walkways & Access", 
                    sub: "Snow/Ice cleared. House numbers visible. Mailbox accessible.",
                    type: "status",
                    critical: false
                }
            ]
        }
    ]
};

// Export for modular consumption
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHECKLIST_SCHEMAS };
}
