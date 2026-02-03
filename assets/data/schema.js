// FILE: schema.js
// VERSION: 3.2.1 - Production Release (Fixed)
// DATE: February 3, 2026
// CLASSIFICATION: Inspection Protocol Definitions - Field-Optimized + Office Analysis
//
// INSPECTION TYPE WORKFLOW:
// 1. ROUTINE: Quick safety checks during active tenancies
// 2. TURNOVER: Pre-listing rent-ready verification between tenancies
// 3. MOVE-IN: Baseline documentation before tenant occupancy (creates baseline .json)
// 4. MOVE-OUT: Exit documentation after tenant vacates (field observation only)
// 5. DELTA REPORT: Office analysis comparing Move-In vs Move-Out

const CHECKLIST_SCHEMAS = {
    
    // ============================================================================
    // ROUTINE INSPECTION: Quick Safety Check
    // ============================================================================
    routine: [
        {
            id: "arrival_protocol",
            title: "Arrival & Entry Protocol",
            badge: "Entry Checklist",
            colorClass: "border-l-4 border-l-blue-600",
            items: [
                {
                    id: "notice24",
                    label: "24-Hour Notice Confirmed",
                    sub: "Verify proper written notice was given before entering.",
                    type: "status",
                    critical: false
                },
                {
                    id: "knockAnnounce",
                    label: "Knock & Announce Entry",
                    sub: "Always knock and announce 'Property Management' before entering, even if unit appears vacant.",
                    type: "status",
                    critical: false
                },
                {
                    id: "exteriorPhoto",
                    label: "Exterior Photos Taken",
                    sub: "Photograph building front and unit door.",
                    type: "status",
                    critical: true
                }
            ]
        },
        {
            id: "life_safety_routine",
            title: "Life Safety Systems",
            badge: "Critical - Must Pass",
            colorClass: "border-l-4 border-l-red-600",
            items: [
                {
                    id: "smokeAlarms_routine",
                    label: "Smoke Alarms - Test & Document",
                    sub: "Press test button on each detector. Should produce loud beep. Check for low battery chirping.",
                    type: "status",
                    critical: true
                },
                {
                    id: "coAlarms_routine",
                    label: "CO Alarms - Test & Document (if applicable)",
                    sub: "Test if unit has gas appliances or attached garage. Press test button to verify alarm sounds.",
                    type: "status",
                    critical: true
                },
                {
                    id: "detector_tampering",
                    label: "Detector Condition Check",
                    sub: "Look for missing batteries, removed detectors, or damaged mounts. Document any issues.",
                    type: "status",
                    critical: true
                },
                {
                    id: "electricalPanel_routine",
                    label: "Electrical Panel - Visual Check",
                    sub: "Look for scorch marks, exposed wires, or safety hazards. Note any tripped breakers.",
                    type: "status",
                    critical: true
                }
            ]
        },
        {
            id: "vital_services_routine",
            title: "Heating & Temperature",
            badge: "Winter Season Check",
            colorClass: "border-l-4 border-l-orange-600",
            items: [
                {
                    id: "thermostat_routine",
                    label: "Thermostat Setting (Sept 15 - Jun 15)",
                    sub: "During heating season: Check thermostat is set to at least 20°C. Take photo of current setting.",
                    type: "status",
                    critical: true
                },
                {
                    id: "heating_response",
                    label: "Heating System Test",
                    sub: "Adjust thermostat up to test if heat turns on. Listen for furnace activation.",
                    type: "status",
                    critical: true
                }
            ]
        }
    ],
    
    // ============================================================================
    // TURNOVER INSPECTION: Pre-Listing Ready Check
    // ============================================================================
    turnover: [
        {
            id: "safety_core",
            title: "1. Safety & Security",
            badge: "Must Pass",
            colorClass: "border-l-4 border-l-red-600",
            items: [
                {
                    id: "smoke_co_combo",
                    label: "Smoke & CO Alarms",
                    sub: "Test all detectors. Verify loud beep on each level. Check batteries.",
                    type: "status",
                    critical: true
                },
                {
                    id: "detector_lens_clean",
                    label: "Detector Cleanliness",
                    sub: "Vacuum any dust from detector vents to ensure proper function.",
                    type: "status",
                    critical: false
                },
                {
                    id: "elec_panel_gfci",
                    label: "Electrical & GFCI Outlets",
                    sub: "Check panel for damage. Test GFCI outlets in kitchen and bathrooms (press test button, then reset).",
                    type: "status",
                    critical: true
                },
                {
                    id: "entry_security",
                    label: "Door Locks & Deadbolts",
                    sub: "Test all entry door locks for smooth operation.",
                    type: "status",
                    critical: false
                },
                {
                    id: "window_egress",
                    label: "Window Operation & Locks",
                    sub: "Verify bedroom windows open properly. Check ground floor window locks work.",
                    type: "status",
                    critical: true
                }
            ]
        },
        {
            id: "systems_utils",
            title: "2. Plumbing & Mechanical",
            badge: "Function Check",
            colorClass: "border-l-4 border-l-yellow-500",
            items: [
                {
                    id: "heat_water_val",
                    label: "Heat & Hot Water",
                    sub: "Test thermostat. Verify hot water at taps within 2 minutes.",
                    type: "status",
                    critical: true
                },
                {
                    id: "plumbing_dry",
                    label: "Under-Sink Inspection",
                    sub: "Run water for 2 minutes at each sink. Check underneath for leaks.",
                    type: "status",
                    critical: false
                },
                {
                    id: "toilet_mech",
                    label: "Toilet Function",
                    sub: "Test flush. Verify no running water after tank refills. Check for leaks at base.",
                    type: "status",
                    critical: false
                },
                {
                    id: "vent_fans",
                    label: "Exhaust Fans",
                    sub: "Test bathroom fan (should hold tissue paper to grille). Test range hood fan.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "kitchen_deep",
            title: "3. Kitchen & Appliances",
            badge: "Market Ready",
            colorClass: "border-l-4 border-l-blue-600",
            items: [
                {
                    id: "appliance_fridge",
                    label: "Refrigerator",
                    sub: "Verify cooling works. Check interior light and door seals. Ensure shelves are clean.",
                    type: "status",
                    critical: false
                },
                {
                    id: "appliance_stove",
                    label: "Stove/Oven",
                    sub: "Test all burners heat properly. Test oven (should heat up).",
                    type: "status",
                    critical: false
                },
                {
                    id: "appliance_clean",
                    label: "Appliance Cleaning",
                    sub: "Verify behind/under fridge and stove are clean. Check oven interior is clean.",
                    type: "status",
                    critical: false
                },
                {
                    id: "appliance_serials",
                    label: "Appliance Photos (if new)",
                    sub: "If appliances are new or unrecorded, photograph serial number plates.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "finishes_cosmetic",
            title: "4. Interior Condition",
            badge: "Show Ready",
            colorClass: "border-l-4 border-l-green-600",
            items: [
                {
                    id: "walls_trim",
                    label: "Walls & Paint",
                    sub: "Check for large holes or damage. Minor nail holes are acceptable.",
                    type: "status",
                    critical: false
                },
                {
                    id: "flooring_trans",
                    label: "Floors & Transitions",
                    sub: "Look for trip hazards. Verify carpets are clean. Check floor transitions are secure.",
                    type: "status",
                    critical: false
                },
                {
                    id: "pest_forensic",
                    label: "Pest Check",
                    sub: "Look for droppings in cupboards, under sinks, and behind appliances.",
                    type: "status",
                    critical: false
                },
                {
                    id: "deep_clean_gen",
                    label: "General Cleanliness",
                    sub: "Check window tracks, baseboards, and switch plates are clean.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "exterior_appeal",
            title: "5. Exterior",
            badge: "Curb Appeal",
            colorClass: "border-l-4 border-l-gray-600",
            items: [
                {
                    id: "curb_garbage",
                    label: "Yard & Porch",
                    sub: "Clear of trash, flyers, and old furniture.",
                    type: "status",
                    critical: false
                },
                {
                    id: "access_clearance",
                    label: "Access & Safety",
                    sub: "Walkways clear (snow/ice removed if applicable). House numbers visible.",
                    type: "status",
                    critical: false
                }
            ]
        }
    ],
    
    // ============================================================================
    // MOVE-IN INSPECTION: Baseline Documentation (Field-Optimized)
    // ============================================================================
    moveIn: [
        {
            id: "baseline_vital_services",
            title: "1. Meter Readings (If Applicable)",
            badge: "Take Photos",
            colorClass: "border-l-4 border-l-blue-600",
            items: [
                {
                    id: "hydro_meter_reading",
                    label: "⚡ Electricity Meter (PHOTO if submetered)",
                    sub: "IF unit has separate electric meter: Take clear photo showing meter reading and meter serial number. Write down the number in notes. If no separate meter, mark N/A.",
                    type: "status",
                    critical: false
                },
                {
                    id: "water_meter_reading",
                    label: "💧 Water Meter (if applicable)",
                    sub: "IF unit has separate water meter: Take photo of meter reading. Write down number in notes. If no separate meter, mark N/A.",
                    type: "status",
                    critical: false
                },
                {
                    id: "gas_meter_reading",
                    label: "🔥 Gas Meter (if applicable)",
                    sub: "IF unit has separate gas meter: Take photo of meter reading. Write down number in notes. If no separate meter, mark N/A.",
                    type: "status",
                    critical: false
                },
                {
                    id: "thermostat_baseline",
                    label: "🌡️ Thermostat Photo",
                    sub: "Take photo showing current thermostat setting. Test that heating system responds when you adjust temperature up.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "baseline_surface_integrity",
            title: "2. Floors, Walls, Windows - BEFORE Photos",
            badge: "Document Existing Condition",
            colorClass: "border-l-4 border-l-green-600",
            items: [
                {
                    id: "flooring_hardwood_baseline",
                    label: "Hardwood/Laminate Floors",
                    sub: "Take photos of any existing scratches, gouges, or worn areas. Note location in each room (e.g., 'bedroom - by closet').",
                    type: "status",
                    critical: false
                },
                {
                    id: "flooring_carpet_baseline",
                    label: "Carpet Condition",
                    sub: "Photo any existing stains or wear patterns. Note locations in notes field.",
                    type: "status",
                    critical: false
                },
                {
                    id: "flooring_tile_baseline",
                    label: "Tile Floors (if applicable)",
                    sub: "Photo any cracked tiles or damaged grout. Note locations.",
                    type: "status",
                    critical: false
                },
                {
                    id: "walls_baseline",
                    label: "Wall Condition",
                    sub: "Photo any existing holes, cracks, or marks. Measure and note size of larger holes (e.g., '2-inch hole in bedroom wall').",
                    type: "status",
                    critical: false
                },
                {
                    id: "ceilings_baseline",
                    label: "Ceiling Condition",
                    sub: "Photo any cracks or water stains on ceilings. Note locations.",
                    type: "status",
                    critical: false
                },
                {
                    id: "windows_glass_baseline",
                    label: "Window Glass",
                    sub: "Photo any existing cracks or chips in windows. Note which window.",
                    type: "status",
                    critical: false
                },
                {
                    id: "window_screens_baseline",
                    label: "Window Screens",
                    sub: "Photo any torn or damaged screens. Note which window.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "baseline_fixtures_finishes",
            title: "3. Kitchen & Bathroom Fixtures - BEFORE Photos",
            badge: "Document Condition",
            colorClass: "border-l-4 border-l-purple-600",
            items: [
                {
                    id: "kitchen_cabinets_baseline",
                    label: "Kitchen Cabinets",
                    sub: "Photo any damaged cabinet doors, broken hinges, or damaged countertops.",
                    type: "status",
                    critical: false
                },
                {
                    id: "kitchen_sink_baseline",
                    label: "Kitchen Sink",
                    sub: "Photo any existing scratches, chips, or stains in sink.",
                    type: "status",
                    critical: false
                },
                {
                    id: "bathroom_fixtures_baseline",
                    label: "Bathroom (Sink/Toilet/Tub)",
                    sub: "Photo any existing chips, cracks, or stains in bathroom fixtures.",
                    type: "status",
                    critical: false
                },
                {
                    id: "bathroom_tile_grout_baseline",
                    label: "Bathroom Tile & Grout",
                    sub: "Photo any cracked tiles or damaged grout.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "baseline_life_safety",
            title: "4. Safety Equipment - Document What's Installed",
            badge: "Count & Photo",
            colorClass: "border-l-4 border-l-red-600",
            items: [
                {
                    id: "smoke_detectors_baseline",
                    label: "🔴 Smoke Detectors",
                    sub: "COUNT how many smoke detectors are in the unit. Take photo of each one. Test each detector (press test button - should beep loudly). Note locations (e.g., 'hallway, bedroom 1, bedroom 2').",
                    type: "status",
                    critical: true
                },
                {
                    id: "co_detectors_baseline",
                    label: "⚠️ CO Detectors (if applicable)",
                    sub: "IF unit has gas appliances: COUNT and photo CO detectors. Test each one. Note locations. If no gas, mark N/A.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "baseline_appliances",
            title: "5. Appliances - Record Serial Numbers",
            badge: "Photo Serial Plates",
            colorClass: "border-l-4 border-l-teal-600",
            items: [
                {
                    id: "appliance_fridge_baseline",
                    label: "Refrigerator",
                    sub: "Photo the serial number plate (usually inside fridge). Test that it cools. Note any existing dents or damage.",
                    type: "status",
                    critical: false
                },
                {
                    id: "appliance_stove_baseline",
                    label: "Stove/Oven",
                    sub: "Photo serial number plate. Test all burners and oven. Note any existing damage.",
                    type: "status",
                    critical: false
                },
                {
                    id: "appliance_dishwasher_baseline",
                    label: "Dishwasher (if applicable)",
                    sub: "IF unit has dishwasher: Photo serial number. Test if it runs. Note condition. If none, mark N/A.",
                    type: "status",
                    critical: false
                },
                {
                    id: "appliance_washer_dryer_baseline",
                    label: "Washer/Dryer (if provided)",
                    sub: "IF provided: Photo serial numbers on both. Test basic functions. Note condition. If not provided, mark N/A.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "baseline_access_control",
            title: "6. Keys Given to Tenant",
            badge: "Count & Record",
            colorClass: "border-l-4 border-l-yellow-500",
            items: [
                {
                    id: "keys_issued_count",
                    label: "🔑 Keys & Fobs Given to Tenant",
                    sub: "COUNT and write down: How many building keys? How many unit keys? Mailbox key? Garage fob? Example in notes: '2 building keys, 1 unit key, 1 mailbox key, 1 fob'.",
                    type: "status",
                    critical: true
                }
            ]
        },
        {
            id: "baseline_photo_inventory",
            title: "7. Overall Unit Photos",
            badge: "Wide-Angle Shots",
            colorClass: "border-l-4 border-l-indigo-600",
            items: [
                {
                    id: "exterior_baseline",
                    label: "📸 Building & Entry",
                    sub: "REQUIRED: Photo of building front, unit door, mailbox area, parking space (if applicable).",
                    type: "status",
                    critical: true
                },
                {
                    id: "room_wide_shots",
                    label: "📸 Room Photos (EVERY ROOM)",
                    sub: "REQUIRED: Take one wide photo of each room (living room, kitchen, bedrooms, bathrooms) showing overall condition.",
                    type: "status",
                    critical: true
                },
                {
                    id: "closet_storage_baseline",
                    label: "📸 Closets & Storage",
                    sub: "Photo inside all closets showing condition.",
                    type: "status",
                    critical: false
                }
            ]
        }
    ],
    
    // ============================================================================
    // MOVE-OUT INSPECTION: Exit Documentation (Field-Optimized)
    // ============================================================================
    moveOut: [
        {
            id: "delta_vital_services",
            title: "1. Final Meter Readings (If Applicable)",
            badge: "Take Photos",
            colorClass: "border-l-4 border-l-blue-600",
            items: [
                {
                    id: "hydro_meter_final",
                    label: "⚡ Final Electricity Meter Reading (if submetered)",
                    sub: "IF unit has separate electric meter: Take clear photo showing final meter reading and meter number. Write down number in notes. If no separate meter, mark N/A.",
                    type: "status",
                    critical: false
                },
                {
                    id: "water_meter_final",
                    label: "💧 Final Water Meter Reading (if applicable)",
                    sub: "IF unit has separate water meter: Take photo of final reading. Write down number in notes. If no separate meter, mark N/A.",
                    type: "status",
                    critical: false
                },
                {
                    id: "gas_meter_final",
                    label: "🔥 Final Gas Meter Reading (if applicable)",
                    sub: "IF unit has separate gas meter: Take photo of final reading. Write down number in notes. If no separate meter, mark N/A.",
                    type: "status",
                    critical: false
                },
                {
                    id: "thermostat_final",
                    label: "🌡️ Thermostat Photo",
                    sub: "Take photo of current thermostat setting. Note if heat is still working.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "delta_surface_damage",
            title: "2. Floors, Walls, Windows - AFTER Photos",
            badge: "Document Current Condition",
            colorClass: "border-l-4 border-l-red-600",
            items: [
                {
                    id: "flooring_hardwood_damage",
                    label: "Hardwood/Laminate Floors",
                    sub: "Photo any NEW damage: deep scratches, gouges, burns. MEASURE larger damage (e.g., '6-inch gouge in hallway'). Note if these issues were NOT there at move-in.",
                    type: "status",
                    critical: false
                },
                {
                    id: "flooring_carpet_damage",
                    label: "Carpet Condition",
                    sub: "Photo any NEW stains, burns, or tears. Note size and location. Sniff for persistent odors (pet urine, smoke).",
                    type: "status",
                    critical: false
                },
                {
                    id: "flooring_tile_damage",
                    label: "Tile Floors (if applicable)",
                    sub: "Photo any NEW cracked tiles or damaged grout. Note locations.",
                    type: "status",
                    critical: false
                },
                {
                    id: "walls_holes_damage",
                    label: "Wall Holes & Damage",
                    sub: "Photo any holes in walls. MEASURE holes larger than nail holes (e.g., '3-inch hole in bedroom'). Small nail holes are normal - only note larger holes.",
                    type: "status",
                    critical: false
                },
                {
                    id: "walls_unauthorized_paint",
                    label: "Unauthorized Paint (if applicable)",
                    sub: "IF tenant painted walls: Photo showing new color. Note original color if known.",
                    type: "status",
                    critical: false
                },
                {
                    id: "walls_markings_damage",
                    label: "Wall Marks & Stains",
                    sub: "Photo any crayon marks, marker, grease stains, or adhesive marks that won't wipe off.",
                    type: "status",
                    critical: false
                },
                {
                    id: "windows_glass_damage",
                    label: "Window Damage",
                    sub: "Photo any NEW cracks or broken windows. Note which window.",
                    type: "status",
                    critical: false
                },
                {
                    id: "window_screens_damage",
                    label: "Screen Damage",
                    sub: "Photo any NEW torn or damaged screens. Note which window.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "delta_fixtures_damage",
            title: "3. Kitchen & Bathroom - Document Damage",
            badge: "Photo Any Issues",
            colorClass: "border-l-4 border-l-orange-600",
            items: [
                {
                    id: "kitchen_cabinets_damage",
                    label: "Kitchen Cabinets",
                    sub: "Photo any NEW broken doors, hinges, or damaged countertops.",
                    type: "status",
                    critical: false
                },
                {
                    id: "sink_faucet_damage",
                    label: "Sinks & Faucets",
                    sub: "Photo any NEW cracks, chips, or broken faucets.",
                    type: "status",
                    critical: false
                },
                {
                    id: "bathroom_fixtures_damage",
                    label: "Bathroom Fixtures",
                    sub: "Photo any NEW cracks in toilet, sink, or tub.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "delta_life_safety",
            title: "4. Safety Equipment - Final Check",
            badge: "Count & Test",
            colorClass: "border-l-4 border-l-red-600",
            items: [
                {
                    id: "smoke_detectors_final",
                    label: "🔴 Smoke Detectors",
                    sub: "COUNT how many smoke detectors are present. Test each one (press test button). IF any are missing: Take photo of empty bracket and note location. Office will compare count to move-in.",
                    type: "status",
                    critical: true
                },
                {
                    id: "co_detectors_final",
                    label: "⚠️ CO Detectors (if applicable)",
                    sub: "IF unit had CO detectors at move-in: Count and test. Note if any are missing. If no gas appliances, mark N/A.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "delta_appliance_damage",
            title: "5. Appliance Condition",
            badge: "Test & Photo",
            colorClass: "border-l-4 border-l-teal-600",
            items: [
                {
                    id: "appliance_fridge_final",
                    label: "Refrigerator",
                    sub: "Test if it still cools. Photo any NEW damage (broken shelves, cracked doors, dents beyond normal wear).",
                    type: "status",
                    critical: false
                },
                {
                    id: "appliance_stove_final",
                    label: "Stove/Oven",
                    sub: "Test burners and oven. Photo any NEW damage (broken knobs, cracked glass, broken elements).",
                    type: "status",
                    critical: false
                },
                {
                    id: "appliance_missing",
                    label: "Missing Appliances",
                    sub: "IF any appliance is MISSING that was there at move-in: Photo the empty space and note what's missing.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "delta_cleanliness",
            title: "6. Cleanliness & Trash",
            badge: "Document Condition",
            colorClass: "border-l-4 border-l-brown-600",
            items: [
                {
                    id: "refuse_volume",
                    label: "📦 Trash & Items Left Behind",
                    sub: "IF tenant left trash or belongings: Photo showing amount. COUNT bags of trash if multiple. Note any furniture or large items left.",
                    type: "status",
                    critical: false
                },
                {
                    id: "appliance_fridge_sanitation",
                    label: "🧊 Refrigerator Cleanliness",
                    sub: "Open fridge. Photo interior if very dirty or has rotting food. Note smell if bad. If just normal cleaning needed, mark PASS.",
                    type: "status",
                    critical: false
                },
                {
                    id: "appliance_oven_sanitation",
                    label: "🔥 Oven Cleanliness",
                    sub: "Check inside oven. Photo if extremely dirty (heavy grease/carbon buildup). If just normal cleaning needed, mark PASS.",
                    type: "status",
                    critical: false
                },
                {
                    id: "bathroom_sanitation",
                    label: "🚽 Bathroom Cleanliness",
                    sub: "Photo if bathroom is very dirty or has mold. Note smell if bad. If just normal cleaning needed, mark PASS.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "moveout_keys_returned",
            title: "7. Keys Returned by Tenant",
            badge: "Count Keys",
            colorClass: "border-l-4 border-l-yellow-500",
            items: [
                {
                    id: "keys_returned_count",
                    label: "🔑 Count Keys Returned",
                    sub: "COUNT each item tenant returns: Building keys? Unit keys? Mailbox key? Fob? Write in notes (e.g., '2 building keys, 1 unit key, 1 mailbox key, 1 fob'). Office will compare to move-in count.",
                    type: "status",
                    critical: true
                }
            ]
        },
        {
            id: "delta_final_photos",
            title: "8. Overall Unit Photos",
            badge: "Wide-Angle Shots",
            colorClass: "border-l-4 border-l-indigo-600",
            items: [
                {
                    id: "room_wide_final",
                    label: "📸 Room Photos (EVERY ROOM)",
                    sub: "REQUIRED: Take one wide photo of each room (living room, kitchen, bedrooms, bathrooms) showing condition after tenant moved out.",
                    type: "status",
                    critical: true
                },
                {
                    id: "damage_macro_photos",
                    label: "📸 Close-Up Photos of ALL Damage",
                    sub: "REQUIRED: Take close-up photo of EVERY damage item you noted above. Include a measuring tape or reference object to show size.",
                    type: "status",
                    critical: true
                },
                {
                    id: "empty_unit_confirmation",
                    label: "📸 Unit Empty Confirmation",
                    sub: "Photo all rooms completely empty (no tenant belongings left). Photo all closets empty.",
                    type: "status",
                    critical: false
                }
            ]
        }
    ],
    
    // ============================================================================
    // DELTA REPORT: Office Comparative Analysis
    // ============================================================================
    deltaReport: [
        {
            id: "delta_data_import",
            title: "1. Import Baseline & Exit Data",
            badge: "REQUIRED - Import Both Reports",
            colorClass: "border-l-4 border-l-purple-700",
            items: [
                {
                    id: "import_movein_baseline",
                    label: "📥 Import Move-In Baseline Report",
                    sub: "REQUIRED: Click 'Import Move-In Baseline' button OR scan QR code from Move-In report. This loads the pristine condition photos and notes for comparison.",
                    type: "status",
                    critical: true
                },
                {
                    id: "import_moveout_report",
                    label: "📥 Import Move-Out Report",
                    sub: "REQUIRED: Click 'Import Move-Out Report' button OR scan QR code from Move-Out report. This loads the exit condition photos and notes for comparison.",
                    type: "status",
                    critical: true
                },
                {
                    id: "verify_property_match",
                    label: "✅ Verify Property Address Match",
                    sub: "Confirm both reports are for the same property address. System will alert if addresses don't match.",
                    type: "status",
                    critical: true
                }
            ]
        },
        {
            id: "delta_meter_reconciliation",
            title: "2. Utility Meter Reconciliation & Calculation",
            badge: "Calculate Consumption",
            colorClass: "border-l-4 border-l-blue-700",
            items: [
                {
                    id: "hydro_consumption_calc",
                    label: "⚡ Electricity Consumption Calculation (if applicable)",
                    sub: "IF unit is submetered: Calculate kWh used = (Move-Out reading - Move-In reading). Multiply by your rate per kWh. Enter total amount owed in notes. Example: '5000 kWh used × $0.12 = $600'.",
                    type: "status",
                    critical: false
                },
                {
                    id: "water_consumption_calc",
                    label: "💧 Water Consumption Calculation (if applicable)",
                    sub: "IF unit is submetered: Calculate volume used = (Move-Out reading - Move-In reading). Multiply by your rate. Enter total in notes.",
                    type: "status",
                    critical: false
                },
                {
                    id: "gas_consumption_calc",
                    label: "🔥 Gas Consumption Calculation (if applicable)",
                    sub: "IF unit is submetered: Calculate volume used = (Move-Out reading - Move-In reading). Multiply by your rate. Enter total in notes.",
                    type: "status",
                    critical: false
                },
                {
                    id: "utility_total",
                    label: "💰 Total Utility Costs Recoverable",
                    sub: "Sum all utility charges calculated above. Enter total amount. This will be included in final claim calculation.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "delta_surface_comparison",
            title: "3. Surface Damage Comparison & Assessment",
            badge: "Side-by-Side Analysis",
            colorClass: "border-l-4 border-l-red-700",
            items: [
                {
                    id: "flooring_delta_analysis",
                    label: "Floor Damage Assessment",
                    sub: "Compare Move-In vs Move-Out floor photos. Identify NEW damage (gouges, burns, stains). For each damage item: Measure size, note location, estimate repair cost. Example: '6-inch gouge in hallway hardwood, repair estimate $250'.",
                    type: "status",
                    critical: false
                },
                {
                    id: "walls_delta_analysis",
                    label: "Wall Damage Assessment",
                    sub: "Compare Move-In vs Move-Out wall photos. Identify NEW holes, cracks, unauthorized paint. For each: Measure hole diameter, note if requires patch/paint/full repair, estimate cost.",
                    type: "status",
                    critical: false
                },
                {
                    id: "windows_delta_analysis",
                    label: "Window/Screen Damage Assessment",
                    sub: "Compare Move-In vs Move-Out window photos. Identify NEW cracks, broken glass, torn screens. Get glazing or screen replacement quotes.",
                    type: "status",
                    critical: false
                },
                {
                    id: "surface_repair_quotes",
                    label: "📋 Collect Vendor Quotes for Surface Repairs",
                    sub: "Upload or attach quotes from contractors for floor repair, wall patching/painting, window/screen replacement. Enter total estimated cost in notes.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "delta_fixtures_comparison",
            title: "4. Fixture & Appliance Damage Assessment",
            badge: "Compare Condition",
            colorClass: "border-l-4 border-l-orange-700",
            items: [
                {
                    id: "kitchen_fixtures_delta",
                    label: "Kitchen Cabinets & Counters Assessment",
                    sub: "Compare Move-In vs Move-Out photos. Identify NEW damage to cabinets, countertops, sinks. Get repair/replacement quotes.",
                    type: "status",
                    critical: false
                },
                {
                    id: "bathroom_fixtures_delta",
                    label: "Bathroom Fixtures Assessment",
                    sub: "Compare Move-In vs Move-Out photos. Identify NEW cracks, chips, damage to toilet, tub, sink. Get replacement quotes if needed.",
                    type: "status",
                    critical: false
                },
                {
                    id: "appliance_delta_analysis",
                    label: "Appliance Damage/Missing Assessment",
                    sub: "Compare appliances at Move-In vs Move-Out. Note any missing appliances (include serial numbers from Move-In photos). Note damaged appliances. Get repair/replacement quotes.",
                    type: "status",
                    critical: false
                },
                {
                    id: "fixture_repair_quotes",
                    label: "📋 Collect Vendor Quotes for Fixtures/Appliances",
                    sub: "Upload quotes for cabinet repair, fixture replacement, appliance replacement. Enter total estimated cost in notes.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "delta_safety_reconciliation",
            title: "5. Safety Equipment Reconciliation",
            badge: "Count Comparison",
            colorClass: "border-l-4 border-l-red-700",
            items: [
                {
                    id: "smoke_detector_count_delta",
                    label: "🔴 Smoke Detector Count Comparison",
                    sub: "Compare detector count: Move-In vs Move-Out. IF any are missing: Note quantity missing and locations (refer to empty bracket photos from Move-Out). Calculate replacement cost = (# missing × unit cost).",
                    type: "status",
                    critical: true
                },
                {
                    id: "co_detector_count_delta",
                    label: "⚠️ CO Detector Count Comparison (if applicable)",
                    sub: "IF unit has gas: Compare CO detector count. Calculate replacement cost for any missing units.",
                    type: "status",
                    critical: false
                },
                {
                    id: "safety_equipment_cost",
                    label: "💰 Total Safety Equipment Replacement Cost",
                    sub: "Sum cost of all missing or damaged detectors. Enter total. Include labor for installation if applicable.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "delta_cleanliness_assessment",
            title: "6. Cleanliness & Extraordinary Cleaning",
            badge: "Assess Cleaning Requirements",
            colorClass: "border-l-4 border-l-brown-700",
            items: [
                {
                    id: "refuse_disposal_cost",
                    label: "📦 Junk Removal Cost (if applicable)",
                    sub: "IF tenant left significant trash/furniture: Get quote from junk removal service. Ordinary trash disposal (1-2 bags) is NOT recoverable. Only charge for extraordinary amounts requiring special service.",
                    type: "status",
                    critical: false
                },
                {
                    id: "extraordinary_cleaning_cost",
                    label: "🧹 Extraordinary Cleaning Cost (if applicable)",
                    sub: "IF Move-Out photos show extreme contamination (rotting food in fridge, heavy grease in oven, mold in bathroom): Get quote for professional deep cleaning. Ordinary turnover cleaning is NOT recoverable.",
                    type: "status",
                    critical: false
                },
                {
                    id: "cleaning_total_cost",
                    label: "💰 Total Cleaning & Disposal Costs",
                    sub: "Sum junk removal and extraordinary cleaning costs. Enter total. Include receipts/quotes.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "delta_keys_reconciliation",
            title: "7. Key Deposit Settlement",
            badge: "Calculate Deposit Refund",
            colorClass: "border-l-4 border-l-yellow-700",
            items: [
                {
                    id: "keys_count_comparison",
                    label: "🔑 Key Count Comparison",
                    sub: "Compare keys issued at Move-In vs keys returned at Move-Out. Identify any missing items. Example: 'Issued: 2 building keys, 1 unit key, 1 fob. Returned: 2 building keys, 1 unit key. MISSING: 1 fob'.",
                    type: "status",
                    critical: true
                },
                {
                    id: "missing_keys_cost",
                    label: "💰 Missing Keys/Fobs Replacement Cost",
                    sub: "Calculate: (# missing keys × replacement cost per key) + (# missing fobs × fob cost). Enter total deduction from key deposit.",
                    type: "status",
                    critical: false
                },
                {
                    id: "key_deposit_refund",
                    label: "💵 Key Deposit Refund Calculation",
                    sub: "Original deposit amount - replacement costs = refund due. Enter calculation in notes. Example: '$150 deposit - $75 missing fob = $75 refund due'.",
                    type: "status",
                    critical: false
                }
            ]
        },
        {
            id: "delta_final_calculation",
            title: "8. Total Claim Calculation & Evidence Package",
            badge: "Final Summary",
            colorClass: "border-l-4 border-l-purple-700",
            items: [
                {
                    id: "total_claim_amount",
                    label: "💰 TOTAL CLAIM AMOUNT CALCULATION",
                    sub: "Sum ALL costs: Utility charges + Surface repairs + Fixture/appliance repairs + Safety equipment + Cleaning/disposal. Enter TOTAL amount recoverable. This is your claim amount for legal proceedings.",
                    type: "status",
                    critical: true
                },
                {
                    id: "vendor_quote_compilation",
                    label: "📋 Vendor Quote Documentation Complete",
                    sub: "Verify you have attached or uploaded quotes for ALL repair items included in claim calculation. Missing quotes will weaken your case.",
                    type: "status",
                    critical: true
                },
                {
                    id: "photo_comparison_complete",
                    label: "📸 Side-by-Side Photo Comparison Complete",
                    sub: "Verify you have side-by-side Move-In vs Move-Out photos for every damage item claimed. These comparisons are your primary evidence.",
                    type: "status",
                    critical: true
                },
                {
                    id: "evidence_package_ready",
                    label: "✅ Evidence Package Ready for Legal Filing",
                    sub: "Confirm you have: (1) Move-In baseline report, (2) Move-Out report, (3) This Delta Report with calculations, (4) All vendor quotes, (5) All comparison photos. Package is now ready for legal proceedings.",
                    type: "status",
                    critical: true
                }
            ]
        }
    ]
};

// Export for modular consumption
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHECKLIST_SCHEMAS };
}
