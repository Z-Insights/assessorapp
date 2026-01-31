// FILE: schema.js
// CLASSIFICATION: Operational Logic - Inspection Protocol Definitions
// SYNTHESIS: Combines Forensic Safety (GG 2.0) + Rent-Ready Granular (Lite App) + Move-In/Move-Out Delta
// PURPOSE: Dynamic checklist generation with forensic rigor for all inspection types
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
{id: "coAlarms",
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
sub: "Bedroom windows open/stay open. Ground floor locks functional.",type: "status",
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
{id: "appliance_fridge",
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
},{
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
],
// --- MOVE-IN: Forensic Baseline Documentation ---
moveIn: [
{
id: "baseline_vital_services",
title: "1. Vital Services Baseline (Financial Criticality)",
badge: "Meter Readings Required",
colorClass: "border-l-4 border-l-blue-600",
items: [
{
id: "hydro_meter_reading",label: "Electricity Meter Reading (Photo Mandatory)",
sub: "Capture exact kWh reading. Time-stamped photo required for LTB evidence. Note serial number.",
type: "status",
critical: true
},
{
id: "water_gas_meter",
label: "Water/Gas Sub-Meter Reading",
sub: "Capture volume readings if applicable. Critical for preventing 'Meter Gaps'.",
type: "status",
critical: false
},
{
id: "thermostat_baseline",
label: "Thermostat Setting & Function",
sub: "Document current setting. Verify heating system responds. Minimum 20°C required Sept 15-Jun 15.",
type: "status",
critical: true
}
]
},
{
id: "baseline_surface_integrity",
title: "2. Surface Integrity Baseline (Wear vs Damage Reference)",
badge: "Forensic Documentation",
colorClass: "border-l-4 border-l-green-600",
items: [
{
id: "flooring_baseline",
label: "Flooring Condition (All Rooms)",
sub: "Document existing wear patterns, scratches, stains. Note locations in notes field.",
type: "status",
critical: false
},
{
id: "walls_ceilings_baseline",
label: "Walls & Ceilings Condition",
sub: "Note existing holes, cracks, paint condition. Reference room/location in notes.",
type: "status",
critical: false
},
{
id: "windows_screens_baseline",
label: "Windows & Screens Condition",
sub: "Check for existing cracks, tears, functionality. Document screen integrity.",
type: "status",
critical: false
}
]
},{
id: "baseline_life_safety",
title: "3. Life Safety Systems Baseline",
badge: "Zero Tolerance Items",
colorClass: "border-l-4 border-l-red-600",
items: [
{
id: "smoke_co_baseline",
label: "Smoke & CO Detectors (Photo + Test)",
sub: "Test functionality. Note serial numbers and mounting locations in notes field.",
type: "status",
critical: true
},
{
id: "entry_security_baseline",
label: "Door Locks & Deadbolts",
sub: "Document condition of all entry points. Note any existing damage.",
type: "status",
critical: false
}
]
},
{
id: "baseline_access_control",
title: "4. Access Control Inventory",
badge: "Key Deposit Tracking",
colorClass: "border-l-4 border-l-yellow-500",
items: [
{
id: "keys_issued_count",
label: "Keys/Fobs/Mailbox Keys Issued",
sub: "Count and document each access device provided to tenant. Example: '2 main keys, 1 fob, 1 mailbox key'",
type: "status",
critical: false
}
]
},
{
id: "baseline_photo_inventory",
title: "5. Comprehensive Photo Inventory",
badge: "Room-by-Room Documentation",
colorClass: "border-l-4 border-l-purple-600",
items: [
{
id: "exterior_baseline",
label: "Exterior & Entry Photos",
sub: "Front of building, unit door, mailbox, parking space.",
type: "status",
critical: true
},{
id: "room_wide_shots",
label: "Wide Shots - Every Room",
sub: "One wide-angle photo per room showing overall condition.",
type: "status",
critical: true
},
{
id: "appliance_serials_baseline",
label: "Appliance Serial Numbers",
sub: "Photograph serial tags on fridge, stove, dishwasher, etc.",
type: "status",
critical: false
}
]
}
],
// --- MOVE-OUT: Damage Assessment Against Baseline ---
moveOut: [
{
id: "delta_vital_services",
title: "1. Vital Services Final Audit",
badge: "Meter Gap Prevention",
colorClass: "border-l-4 border-l-blue-600",
items: [
{
id: "hydro_meter_final",
label: "Final Electricity Meter Reading",
sub: "Compare to Move-In reading. Calculate consumption. Photo required for L10 claim.",
type: "status",
critical: true
},
{
id: "water_gas_final",
label: "Final Water/Gas Meter Reading",
sub: "Document final readings. Flag discrepancies vs Move-In baseline.",
type: "status",
critical: false
},
{
id: "thermostat_final",
label: "Thermostat Final Setting",
sub: "Verify minimum 20°C maintained. Document for LTB compliance.",
type: "status",
critical: true
}
]
},
{
id: "delta_surface_damage",title: "2. Surface Damage Assessment",
badge: "Undue Damage Identification",
colorClass: "border-l-4 border-l-red-600",
items: [
{
id: "flooring_damage",
label: "Flooring - New Damage Assessment",
sub: "Identify gouges, burns, stains NOT documented at Move-In. Take macro photos. Reference Move-In report ID.",
type: "status",
critical: false
},
{
id: "walls_damage",
label: "Walls & Ceilings - New Damage",
sub: "Document holes, cracks, unauthorized paint. Explicitly reference Move-In baseline condition.",
type: "status",
critical: false
},
{
id: "windows_damage",
label: "Windows & Screens - Damage Assessment",
sub: "Identify new cracks, tears, broken seals. Compare to Move-In condition notes.",
type: "status",
critical: false
}
]
},
{
id: "delta_life_safety",
title: "3. Life Safety Systems Final Check",
badge: "Tampering Assessment",
colorClass: "border-l-4 border-l-red-600",
items: [
{
id: "smoke_co_final",
label: "Smoke & CO Detectors - Final Status",
sub: "Verify presence and function. Document missing/damaged units. Reference Move-In serial numbers.",
type: "status",
critical: true
}
]
},
{
id: "delta_cleanliness",
title: "4. Cleanliness & Refuse Assessment",
badge: "Extraordinary Cleaning",
colorClass: "border-l-4 border-l-orange-600",
items: [
{
id: "refuse_debris",label: "Refuse/Debris Left Behind",
sub: "Document volume of trash. Photograph for junk removal invoice support.",
type: "status",
critical: false
},
{
id: "appliance_sanitation",
label: "Kitchen/Bath Sanitation",
sub: "Check inside oven, fridge, toilet. Document contamination requiring professional cleaning.",
type: "status",
critical: false
}
]
},
{
id: "delta_access_control",
title: "5. Access Control Reconciliation",
badge: "Key Deposit Resolution",
colorClass: "border-l-4 border-l-yellow-500",
items: [
{
id: "keys_returned_count",
label: "Keys/Fobs/Mailbox Keys Returned",
sub: "Count returned items. Compare to Move-In inventory. Calculate replacement costs.",
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
