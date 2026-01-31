// FILE: schema.js
// CLASSIFICATION: Operational Logic - Inspection Protocol Definitions
// VERSION: 3.0 - Enhanced with Ontario LTB Forensic Documentation Standards
// SYNTHESIS: Forensic Safety + Rent-Ready + Move-In/Move-Out Delta + Vital Services Audit
// PURPOSE: Comprehensive checklist generation with legally defensible documentation for RTA compliance
// UPDATES: Added vital services metering, enhanced surface integrity documentation, expanded life safety verification,
//          cleanliness categorization, and access control reconciliation per Ontario Rental Inspections framework

const CHECKLIST_SCHEMAS = {
	
	// ============================================================================
	// ROUTINE INSPECTION: Quick Safety-Focused Compliance Check
	// ============================================================================
	// Purpose: Periodic safety verification emphasizing life-critical systems
	// Legal Basis: RTA Section 27 (landlord duty to maintain), Ontario Fire Code
	// Frequency: Recommended quarterly or semi-annually for occupied units
	
	routine: [
		{
			id: "arrival_protocol",
			title: "Arrival & Entry Protocol",
			badge: "RTA s.27 Compliance",
			colorClass: "border-l-4 border-l-blue-600",
			items: [
				{
					id: "notice24",
					label: "24-Hour Written Notice Served",
					sub: "Confirm legal entry basis before unlocking. Document notice method and date.",
					type: "status",
					critical: false
				},
				{
					id: "knockAnnounce",
					label: "Knock & Announce 'Property Management'",
					sub: "Even if vacant, announce before entry. Document time of entry.",
					type: "status",
					critical: false
				},
				{
					id: "exteriorPhoto",
					label: "Exterior Documentation",
					sub: "Building front & unit door photos captured with timestamp.",
					type: "status",
					critical: true
				}
			]
		},
		{
			id: "life_safety_routine",
			title: "Life Safety Systems (Red Line Critical)",
			badge: "DO NOT LIST IF FAILED",
			colorClass: "border-l-4 border-l-red-600",
			items: [
				{
					id: "smokeAlarms_routine",
					label: "Smoke Alarms - Presence & Functionality",
					sub: "Test button on all levels. Confirm loud beep. Check battery indicator. Note any chirping.",
					type: "status",
					critical: true
				},
				{
					id: "coAlarms_routine",
					label: "CO Alarms - Presence & Functionality",
					sub: "Required if gas appliances or attached garage. Test button. Verify audible alarm.",
					type: "status",
					critical: true
				},
				{
					id: "detector_tampering",
					label: "Detector Physical Integrity",
					sub: "Check for missing batteries, removed units, or damaged mounting brackets. Document any tampering.",
					type: "status",
					critical: true
				},
				{
					id: "electricalPanel_routine",
					label: "Electrical Panel - Visual Safety",
					sub: "No scorch marks, exposed wires, or hazards. Panel door closes properly. Note any tripped breakers.",
					type: "status",
					critical: true
				}
			]
		},
		{
			id: "vital_services_routine",
			title: "Vital Services Verification",
			badge: "Heating Season Compliance",
			colorClass: "border-l-4 border-l-orange-600",
			items: [
				{
					id: "thermostat_routine",
					label: "Thermostat Setting & Compliance",
					sub: "Sept 15-Jun 15: Verify minimum 20°C (7am-11pm) or 18°C (other times). Document current setting with photo.",
					type: "status",
					critical: true
				},
				{
					id: "heating_response",
					label: "Heating System Response",
					sub: "Test thermostat engagement. Listen for furnace/boiler activation. Verify heat delivery to vents.",
					type: "status",
					critical: true
				}
			]
		}
	],
	
	// ============================================================================
	// TURNOVER INSPECTION: Forensic Rent-Ready Documentation
	// ============================================================================
	// Purpose: Comprehensive pre-listing verification ensuring unit meets market standards
	// Legal Basis: RTA habitability requirements, industry best practices
	// Trigger: Between tenancies, before marketing unit for rent
	
	turnover: [
		{
			id: "safety_core",
			title: "1. Safety & Vital Services (Red Line)",
			badge: "Mandatory Pass",
			colorClass: "border-l-4 border-l-red-600",
			items: [
				{
					id: "smoke_co_combo",
					label: "Smoke & CO Alarms - Complete Test",
					sub: "Test button produces loud beep. Present on all sleeping levels. Check battery indicators and end-of-life dates.",
					type: "status",
					critical: true
				},
				{
					id: "detector_lens_clean",
					label: "Detector Lens Cleanliness",
					sub: "Vacuum dust from sensor openings. Clean lenses to ensure proper function. Document condition.",
					type: "status",
					critical: false
				},
				{
					id: "elec_panel_gfci",
					label: "Electrical Panel & GFCI",
					sub: "No scorch marks. Kitchen/Bath GFCIs trip & reset properly. Test all GFCI outlets.",
					type: "status",
					critical: true
				},
				{
					id: "entry_security",
					label: "Deadbolts & Strikers",
					sub: "Locks operate smoothly. Striker plates secured with 3-inch screws. Verify all entry points.",
					type: "status",
					critical: false
				},
				{
					id: "window_egress",
					label: "Window Security & Egress",
					sub: "Bedroom windows open and stay open for egress. Ground floor locks functional. No obstructions.",
					type: "status",
					critical: true
				}
			]
		},
		{
			id: "systems_utils",
			title: "2. Mechanical Systems & Plumbing",
			badge: "Functional Verification",
			colorClass: "border-l-4 border-l-yellow-500",
			items: [
				{
					id: "heat_water_val",
					label: "Heat & Hot Water",
					sub: "Thermostat engages furnace/boiler. Hot water reaches 120°F at all taps within 2 minutes.",
					type: "status",
					critical: true
				},
				{
					id: "plumbing_dry",
					label: "P-Traps & Drains",
					sub: "Run water 2 minutes at each fixture. Check under all sinks for active drips. Document any leaks.",
					type: "status",
					critical: false
				},
				{
					id: "toilet_mech",
					label: "Toilet Mechanics",
					sub: "Strong flush. No running water after tank refills. Check for leaks at base. Verify flush handle.",
					type: "status",
					critical: false
				},
				{
					id: "vent_fans",
					label: "Exhaust Fans (Bath/Range)",
					sub: "Bath fan passes tissue test (holds paper to grille). Range hood draws air visibly. Clean filters.",
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
					label: "Refrigerator / Freezer",
					sub: "Cooling confirmed (thermometer test). Interior light working. Door seals intact. Shelves clean.",
					type: "status",
					critical: false
				},
				{
					id: "appliance_stove",
					label: "Stove / Oven",
					sub: "All burners ignite/heat properly. Oven bake element glows red. Test thermostat accuracy if possible.",
					type: "status",
					critical: false
				},
				{
					id: "appliance_clean",
					label: "Appliance Deep Clean Status",
					sub: "Behind/under fridge & stove cleaned. No grease buildup in oven or range hood. Drip pans clean.",
					type: "status",
					critical: false
				},
				{
					id: "appliance_serials",
					label: "Appliance Serial Number Documentation",
					sub: "Photograph serial tags for asset management records (if new/previously unlogged).",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "finishes_cosmetic",
			title: "4. Interior Finishes & Hygiene",
			badge: "Show Ready",
			colorClass: "border-l-4 border-l-green-600",
			items: [
				{
					id: "walls_trim",
					label: "Paint & Trim Condition",
					sub: "No holes larger than nail holes. Minimal scuffs. Touch-ups match existing paint. Trim secure.",
					type: "status",
					critical: false
				},
				{
					id: "flooring_trans",
					label: "Flooring & Transitions",
					sub: "No trip hazards. Carpets steam cleaned or replaced. Transitions secure and flush. Check for loose tiles.",
					type: "status",
					critical: false
				},
				{
					id: "pest_forensic",
					label: "Pest Evidence Assessment",
					sub: "Check cupboard corners, under sink, behind stove, and baseboards for droppings or activity signs.",
					type: "status",
					critical: false
				},
				{
					id: "deep_clean_gen",
					label: "General Deep Clean Verification",
					sub: "Window tracks vacuumed. Baseboards wiped. Switch plates and outlet covers cleaned. Light fixtures dusted.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "exterior_appeal",
			title: "5. Exterior & Curb Appeal",
			badge: "First Impression",
			colorClass: "border-l-4 border-l-gray-600",
			items: [
				{
					id: "curb_garbage",
					label: "Yard & Porch Cleanliness",
					sub: "Clear of flyers, trash, old furniture, and debris. Presentable for showings.",
					type: "status",
					critical: false
				},
				{
					id: "access_clearance",
					label: "Walkways & Access Points",
					sub: "Snow/ice cleared if applicable. House numbers visible. Mailbox accessible. Path to door safe.",
					type: "status",
					critical: false
				}
			]
		}
	],
	
	// ============================================================================
	// MOVE-IN INSPECTION: Forensic Baseline Documentation
	// ============================================================================
	// Purpose: Establish pristine baseline condition for future damage assessment
	// Legal Basis: Foundation for L10 applications, Doucette-Grasby precedent
	// Critical: This document is landlord's primary legal instrument for proving undue damage
	// Requirements: Time-stamped photos, precise measurements, detailed condition notes
	
	moveIn: [
		{
			id: "baseline_vital_services",
			title: "1. Vital Services Baseline (Revenue Protection)",
			badge: "METER READINGS MANDATORY",
			colorClass: "border-l-4 border-l-blue-600",
			items: [
				{
					id: "hydro_meter_reading",
					label: "⚡ Electricity Meter Reading (PHOTO REQUIRED)",
					sub: "Record exact kWh reading with time-stamped photo. Note meter serial number, type (digital/analog), and whether sub-meter or master. Document any obstructions. This is PRIMARY evidence for utility cost recovery.",
					type: "status",
					critical: true
				},
				{
					id: "water_meter_reading",
					label: "💧 Water Sub-Meter Reading (if applicable)",
					sub: "Record cubic meters (m³) or volume reading. Time-stamped photo required. Note meter serial number. Document meter location and accessibility.",
					type: "status",
					critical: false
				},
				{
					id: "gas_meter_reading",
					label: "🔥 Gas Sub-Meter Reading (if applicable)",
					sub: "Record gigajoules (GJ) or cubic meters reading. Time-stamped photo required. Note meter serial and any safety observations.",
					type: "status",
					critical: false
				},
				{
					id: "thermostat_baseline",
					label: "🌡️ Thermostat Setting & Verification",
					sub: "Document current temperature setting with photo. Test heating system response (furnace/boiler engages). Verify minimum 20°C maintained during heating season (Sept 15 - Jun 15). Note thermostat type (digital/programmable/manual).",
					type: "status",
					critical: true
				},
				{
					id: "utility_account_status",
					label: "📋 Utility Account Transfer Confirmation",
					sub: "Confirm tenant has set up utility accounts in their name. Document transfer date if known. Note any special billing arrangements.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "baseline_surface_integrity",
			title: "2. Surface Integrity Baseline (Wear vs Damage Evidence)",
			badge: "FORENSIC DOCUMENTATION",
			colorClass: "border-l-4 border-l-green-600",
			items: [
				{
					id: "flooring_hardwood_baseline",
					label: "Hardwood/Laminate Flooring Condition",
					sub: "Document existing scratches, gouges (measure depth with fingernail test), wear patterns in traffic areas, finish condition. Note room locations. Take wide shots and close-ups of any existing defects. This establishes 'normal wear' baseline.",
					type: "status",
					critical: false
				},
				{
					id: "flooring_carpet_baseline",
					label: "Carpet/Soft Flooring Condition",
					sub: "Document existing stains (note color, location, size), wear patterns, seam integrity, padding condition. Sniff test for odors. Note traffic paths and high-wear areas. Photo all pre-existing issues.",
					type: "status",
					critical: false
				},
				{
					id: "flooring_tile_baseline",
					label: "Tile/Vinyl Flooring Condition",
					sub: "Check for cracked tiles, grout condition, loose sections, staining. Document transition strips. Note any existing damage with measurements.",
					type: "status",
					critical: false
				},
				{
					id: "walls_baseline",
					label: "Wall Surfaces & Paint Condition",
					sub: "Document existing holes (measure diameter - note if <1/4 inch nail holes vs larger), cracks, paint chips, scuff marks, fading. Note wall color per room. Photo any imperfections with reference to room location (e.g., 'North wall, 3 feet from door').",
					type: "status",
					critical: false
				},
				{
					id: "ceilings_baseline",
					label: "Ceiling Condition & Water Stains",
					sub: "Check for cracks, water stains (note size, color, location), texture damage, paint condition. Document any existing issues that could be confused with future damage.",
					type: "status",
					critical: false
				},
				{
					id: "doors_baseline",
					label: "Interior Doors & Hardware",
					sub: "Check operation of all doors. Document existing scratches, dents, hardware condition. Note any doors that stick or don't latch properly.",
					type: "status",
					critical: false
				},
				{
					id: "windows_glass_baseline",
					label: "Window Glass & Seals",
					sub: "Inspect for existing cracks (note if stress fracture vs impact crack), chips, fogging between panes (seal failure). Document with photos showing full window and close-ups of defects.",
					type: "status",
					critical: false
				},
				{
					id: "window_screens_baseline",
					label: "Window & Door Screens",
					sub: "Check for existing tears, holes, bent frames. Test screen removal and replacement. Document frame integrity and mounting condition.",
					type: "status",
					critical: false
				},
				{
					id: "window_tracks_baseline",
					label: "Window Tracks & Operation",
					sub: "Test all windows for smooth operation. Check track condition, lock function, weather stripping. Note any existing damage or operation issues.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "baseline_fixtures_finishes",
			title: "3. Fixtures & Finishes Baseline",
			badge: "DETAILED CONDITION",
			colorClass: "border-l-4 border-l-purple-600",
			items: [
				{
					id: "kitchen_cabinets_baseline",
					label: "Kitchen Cabinets & Counters",
					sub: "Document cabinet door condition, hardware functionality, countertop scratches/chips/stains, backsplash condition. Photo inside cabinets for existing damage.",
					type: "status",
					critical: false
				},
				{
					id: "kitchen_sink_baseline",
					label: "Kitchen Sink & Faucet",
					sub: "Check for existing scratches, stains, chips in sink. Test faucet for leaks, spray function. Document condition with photos.",
					type: "status",
					critical: false
				},
				{
					id: "bathroom_fixtures_baseline",
					label: "Bathroom Fixtures (Sink/Toilet/Tub)",
					sub: "Document existing chips, cracks, stains, discoloration. Check caulking condition. Note any rust or mineral deposits. Photo all fixtures.",
					type: "status",
					critical: false
				},
				{
					id: "bathroom_tile_grout_baseline",
					label: "Bathroom Tile & Grout",
					sub: "Check grout condition (cracking, missing, discolored). Document any cracked tiles. Note mildew staining. Photo problem areas.",
					type: "status",
					critical: false
				},
				{
					id: "light_fixtures_baseline",
					label: "Light Fixtures & Switches",
					sub: "Test all switches and fixtures. Document any non-functioning bulbs or fixtures. Note fixture condition and cleanliness.",
					type: "status",
					critical: false
				},
				{
					id: "outlets_covers_baseline",
					label: "Electrical Outlets & Covers",
					sub: "Check all outlet covers for cracks or missing pieces. Test outlets. Note any loose covers or damaged outlets.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "baseline_life_safety",
			title: "4. Life Safety Systems Baseline",
			badge: "ZERO TOLERANCE DOCUMENTATION",
			colorClass: "border-l-4 border-l-red-600",
			items: [
				{
					id: "smoke_detectors_baseline",
					label: "🔴 Smoke Detectors - Complete Documentation",
					sub: "Test each detector (button test produces loud beep). Note location of each detector (e.g., 'Hallway outside bedroom 1'). Record serial numbers visible on units. Photo each detector showing placement and serial number. Check battery indicator lights. Document installation date if visible. Note any end-of-life indicators.",
					type: "status",
					critical: true
				},
				{
					id: "co_detectors_baseline",
					label: "⚠️ Carbon Monoxide Detectors - Complete Documentation",
					sub: "Test each CO detector. Note locations and serial numbers. Photo each unit. Required if gas appliances or attached garage present. Document expiry dates.",
					type: "status",
					critical: true
				},
				{
					id: "detector_mounting_baseline",
					label: "Detector Mounting & Hardware",
					sub: "Check mounting bracket security. Document any loose or damaged brackets. Verify tamper-resistant hardware where required. Photo mounting condition.",
					type: "status",
					critical: false
				},
				{
					id: "fire_extinguisher_baseline",
					label: "Fire Extinguisher (if provided)",
					sub: "Document location, type, pressure gauge reading, last inspection date. Photo unit and gauge. Note if not provided.",
					type: "status",
					critical: false
				},
				{
					id: "entry_doors_baseline",
					label: "Entry Door Security Systems",
					sub: "Test all deadbolts and locks. Document lock types and brands. Check door frame integrity and striker plate installation. Photo lock hardware.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "baseline_appliances",
			title: "5. Appliance Baseline & Inventory",
			badge: "ASSET DOCUMENTATION",
			colorClass: "border-l-4 border-l-teal-600",
			items: [
				{
					id: "appliance_fridge_baseline",
					label: "Refrigerator Condition & Serial",
					sub: "Photo serial number plate. Test cooling function. Document interior condition, shelf condition, door seal integrity, exterior finish condition.",
					type: "status",
					critical: false
				},
				{
					id: "appliance_stove_baseline",
					label: "Stove/Range Condition & Serial",
					sub: "Photo serial number plate. Test all burners and oven. Document knob condition, door operation, window cleanliness, exterior finish.",
					type: "status",
					critical: false
				},
				{
					id: "appliance_dishwasher_baseline",
					label: "Dishwasher Condition & Serial (if applicable)",
					sub: "Photo serial number. Test run cycle if possible. Check door seal, rack condition, filter cleanliness. Document any existing issues.",
					type: "status",
					critical: false
				},
				{
					id: "appliance_washer_dryer_baseline",
					label: "Washer/Dryer Condition & Serials (if provided)",
					sub: "Photo serial numbers on both units. Test basic functions. Document any existing wear, dents, or operational issues. Check vent connection for dryer.",
					type: "status",
					critical: false
				},
				{
					id: "appliance_microwave_baseline",
					label: "Microwave Condition (if provided)",
					sub: "Test operation. Check door seal, turntable, interior condition. Document model if built-in. Note any existing damage.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "baseline_access_control",
			title: "6. Access Control Inventory",
			badge: "KEY DEPOSIT DOCUMENTATION",
			colorClass: "border-l-4 border-l-yellow-500",
			items: [
				{
					id: "keys_issued_count",
					label: "🔑 Keys/Fobs/Access Devices Issued",
					sub: "COUNT AND DOCUMENT PRECISELY: Main door keys (quantity), unit door keys (quantity), mailbox keys (quantity), garage/parking fobs (quantity), storage locker keys (quantity). Example in notes: '2 main building keys, 1 unit key, 1 mailbox key, 1 garage fob'. This count MUST match exactly at move-out for deposit refund.",
					type: "status",
					critical: true
				},
				{
					id: "key_deposit_amount",
					label: "💰 Key Deposit Amount Collected",
					sub: "Document exact dollar amount of refundable key deposit collected. Note per-item replacement costs (e.g., key $25, fob $75). This establishes deduction calculations for missing items.",
					type: "status",
					critical: false
				},
				{
					id: "locks_rekeyed",
					label: "Lock Rekey Status",
					sub: "Document if locks were rekeyed for this tenancy. Note date and locksmith if applicable. Verify key operation.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "baseline_photo_inventory",
			title: "7. Comprehensive Photo Documentation",
			badge: "ROOM-BY-ROOM EVIDENCE",
			colorClass: "border-l-4 border-l-indigo-600",
			items: [
				{
					id: "exterior_baseline",
					label: "📸 Exterior & Entry Photos (MANDATORY)",
					sub: "Front of building (wide shot), unit entry door (close-up), mailbox location, assigned parking space/number, storage locker if applicable. These photos establish unit identification for LTB proceedings.",
					type: "status",
					critical: true
				},
				{
					id: "room_wide_shots",
					label: "📸 Wide-Angle Room Photos (MANDATORY - EVERY ROOM)",
					sub: "One wide-angle photo per room showing overall condition. Include living room, dining room, kitchen, all bedrooms, all bathrooms, hallways, closets. Stand in doorway or corner to capture maximum room view. These photos are your primary defense against 'pre-existing damage' claims.",
					type: "status",
					critical: true
				},
				{
					id: "room_corner_shots",
					label: "📸 Corner-to-Corner Documentation",
					sub: "Photo each corner of major rooms showing wall/floor/ceiling junctions. These detail shots capture baseline condition of high-damage areas.",
					type: "status",
					critical: false
				},
				{
					id: "closet_storage_baseline",
					label: "📸 Closets & Storage Areas",
					sub: "Photo inside all closets showing floor, walls, ceiling, shelving, and rods. Document storage locker if applicable. Check for existing odors or damage.",
					type: "status",
					critical: false
				},
				{
					id: "utility_areas_baseline",
					label: "📸 Utility & Mechanical Areas",
					sub: "Photo furnace/water heater area, electrical panel (door open showing breakers), under-sink areas (all sinks), laundry connections. These areas often hide pre-existing issues.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "baseline_tenant_acknowledgment",
			title: "8. Tenant Acknowledgment & Signatures",
			badge: "LEGAL COMPLIANCE",
			colorClass: "border-l-4 border-l-gray-700",
			items: [
				{
					id: "walkthrough_completed",
					label: "✅ Joint Walkthrough Completed with Tenant",
					sub: "Document that tenant was present for inspection OR note if tenant declined to participate. Record date and time of walkthrough.",
					type: "status",
					critical: true
				},
				{
					id: "condition_acknowledged",
					label: "✅ Tenant Acknowledges Condition Report Accuracy",
					sub: "Obtain tenant signature on move-in condition report. If tenant disagrees with any items, note their specific concerns in detail. Provide tenant with copy of signed report.",
					type: "status",
					critical: true
				},
				{
					id: "keys_receipt_acknowledged",
					label: "✅ Tenant Acknowledges Key/Access Device Receipt",
					sub: "Tenant signs acknowledgment of receiving all keys/fobs listed. This signature is critical for key deposit recovery at move-out.",
					type: "status",
					critical: true
				}
			]
		}
	],
	
	// ============================================================================
	// MOVE-OUT INSPECTION: Damage Assessment & Delta Analysis
	// ============================================================================
	// Purpose: Forensic comparison against move-in baseline to quantify tenant-caused damage
	// Legal Basis: Foundation for L10 applications at LTB
	// Critical: Every finding must reference move-in baseline. Delta Report is mandatory.
	// Evidence Standard: Landlord bears burden of proof that damage exceeds normal wear and tear
	
	moveOut: [
		{
			id: "delta_vital_services",
			title: "1. Vital Services Final Audit (Financial Settlement)",
			badge: "METER GAP PREVENTION - PHOTOS MANDATORY",
			colorClass: "border-l-4 border-l-blue-600",
			items: [
				{
					id: "hydro_meter_final",
					label: "⚡ FINAL Electricity Meter Reading (PHOTO REQUIRED)",
					sub: "Record exact kWh reading with time-stamped photo. COMPARE to move-in reading and CALCULATE total consumption. Note meter serial number matches move-in records. Document any discrepancies. This reading determines utility cost recovery through L10 application. Formula: (Final Reading - Move-In Reading) × Rate per kWh = Recoverable Amount.",
					type: "status",
					critical: true
				},
				{
					id: "water_meter_final",
					label: "💧 FINAL Water Sub-Meter Reading (if applicable)",
					sub: "Record final cubic meters with time-stamped photo. Calculate consumption vs move-in baseline. Document any unusual consumption patterns. Note if tenant reported any leaks during tenancy.",
					type: "status",
					critical: false
				},
				{
					id: "gas_meter_final",
					label: "🔥 FINAL Gas Sub-Meter Reading (if applicable)",
					sub: "Record final GJ or m³ reading with photo. Compare to move-in baseline. Calculate consumption for billing. Document meter condition.",
					type: "status",
					critical: false
				},
				{
					id: "thermostat_final",
					label: "🌡️ Thermostat Final Setting Verification",
					sub: "Photo current thermostat setting. Verify minimum 20°C maintained (heating season). Document if tenant lowered temperature to unsafe levels (potential pipe freeze risk = landlord liability vs tenant negligence). Note any thermostat damage or tampering.",
					type: "status",
					critical: true
				},
				{
					id: "utility_account_closure",
					label: "📋 Utility Account Closure Status",
					sub: "Verify tenant has closed utility accounts. Document if accounts remain open (creates Meter Gap liability). Note any outstanding utility bills forwarded to landlord.",
					type: "status",
					critical: false
				},
				{
					id: "meter_consumption_summary",
					label: "📊 Consumption Summary & L10 Calculation",
					sub: "Document total kWh/water/gas consumed during tenancy. Calculate dollar amounts owed based on rates. This summary feeds directly into L10 application. Include calculation showing: Starting Reading + Ending Reading = Total Consumed × Rate = Amount Owed.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "delta_surface_damage",
			title: "2. Surface Damage Assessment (Wear vs Damage Determination)",
			badge: "UNDUE DAMAGE IDENTIFICATION - REFERENCE MOVE-IN REPORT",
			colorClass: "border-l-4 border-l-red-600",
			items: [
				{
					id: "flooring_hardwood_damage",
					label: "Hardwood/Laminate - NEW Damage Assessment",
					sub: "IDENTIFY AND DOCUMENT: Deep gouges (furniture dragging), burn marks (discoloration through finish), water damage (warping, discoloration), scratches deeper than finish layer. MEASURE: Length, width, depth of each gouge. PHOTOGRAPH: Wide shot showing location + macro shot showing depth/texture. COMPARE: Explicitly reference move-in photos and note this damage was NOT present. Distinguish from normal wear (uniform traffic pattern dulling).",
					type: "status",
					critical: false
				},
				{
					id: "flooring_carpet_damage",
					label: "Carpet - NEW Damage Assessment",
					sub: "IDENTIFY: Burn holes (cigarette/ember damage through padding), large stains (pet urine, food, liquids), tears or rips, excessive wear beyond normal traffic patterns. TEST: Sniff for persistent odors indicating padding contamination. MEASURE: Diameter of burns, dimensions of stains. PHOTOGRAPH: Context shot + close-up with measuring tape. COMPARE: Reference move-in photos proving carpet was intact/clean. Note if professional cleaning is insufficient (replacement required).",
					type: "status",
					critical: false
				},
				{
					id: "flooring_tile_damage",
					label: "Tile/Vinyl - NEW Damage Assessment",
					sub: "IDENTIFY: Cracked tiles, large gouges in vinyl, missing grout, broken transitions. DOCUMENT: Photo showing extent of damage with measurements. COMPARE: Prove tiles/vinyl were intact at move-in. Distinguish from normal grout deterioration.",
					type: "status",
					critical: false
				},
				{
					id: "walls_holes_damage",
					label: "Walls - Holes & Impact Damage",
					sub: "IDENTIFY: Holes larger than 1/4 inch diameter (picture nail holes are wear, fist holes are damage), impact cracks (irregular pattern indicating force), punctures. MEASURE: Diameter of each hole in inches. CLASSIFY: 'Small hole (1/4-1 inch)', 'Medium hole (1-3 inches)', 'Large hole (3+ inches, requiring drywall patch)'. PHOTOGRAPH: Wide shot showing wall location + close-up with measuring tape + move-in comparison photo. REPAIR SCOPE: Note if requires spackling only vs patch & paint vs full drywall section replacement.",
					type: "status",
					critical: false
				},
				{
					id: "walls_unauthorized_paint",
					label: "Walls - Unauthorized Paint/Alterations",
					sub: "DOCUMENT: Any rooms painted without approval. Note original color vs new color. Photograph color difference. Cost recovery: Full cost to repaint to original color. Compare to move-in photos proving original color.",
					type: "status",
					critical: false
				},
				{
					id: "walls_markings_damage",
					label: "Walls - Stains, Marks, & Surface Damage",
					sub: "IDENTIFY: Crayon/marker (children's drawings), grease splatters, mystery stains, adhesive residue from removed items, scuff marks beyond normal wear. PHOTOGRAPH: Each marking with location reference. TEST: Attempt to wipe clean with damp cloth (if persists, may require repainting). COMPARE: Prove walls were clean at move-in.",
					type: "status",
					critical: false
				},
				{
					id: "ceilings_damage",
					label: "Ceilings - NEW Damage Assessment",
					sub: "IDENTIFY: New cracks (not present at move-in), water stains (tenant-caused leaks, not building issues), holes, texture damage. DOCUMENT: Location, size, apparent cause. PHOTOGRAPH: Include reference point for scale. DISTINGUISH: Building maintenance issues vs tenant-caused damage.",
					type: "status",
					critical: false
				},
				{
					id: "doors_damage",
					label: "Interior Doors - NEW Damage",
					sub: "IDENTIFY: Holes punched through doors, cracks, broken hardware, removed hinges/knobs, damaged door frames, kicked-in damage. DOCUMENT: Photo damage from multiple angles. Note if door is functional or requires replacement. COMPARE: Prove doors were intact at move-in.",
					type: "status",
					critical: false
				},
				{
					id: "windows_glass_damage",
					label: "Window Glass - NEW Cracks/Breaks",
					sub: "IDENTIFY: Impact cracks (jagged, irregular), shattered panes, large chips. DISTINGUISH: From stress fractures (straight lines) which may be thermal/structural. PHOTOGRAPH: Full window showing crack pattern + close-up. MEASURE: Length of cracks. COMPARE: Prove glass was intact at move-in. GET QUOTE: Glazing specialist quote for replacement (required for L10).",
					type: "status",
					critical: false
				},
				{
					id: "window_screens_damage",
					label: "Window Screens - NEW Tears/Damage",
					sub: "IDENTIFY: Tears, holes (pet claws vs hand-torn), bent frames, missing screens entirely. MEASURE: Length of tears. PHOTOGRAPH: Each damaged screen. COMPARE: Prove screens were intact at move-in. NOTE: Small holes may be wear, large rips are damage.",
					type: "status",
					critical: false
				},
				{
					id: "window_mechanisms_damage",
					label: "Window Operation - NEW Damage",
					sub: "TEST: All windows for operation. IDENTIFY: Broken locks, damaged cranks, cracked frames, damaged tracks preventing operation. DOCUMENT: What specifically is broken. Compare to move-in condition showing functional windows.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "delta_fixtures_damage",
			title: "3. Fixtures & Finishes - NEW Damage Assessment",
			badge: "DISTINGUISH FROM NORMAL WEAR",
			colorClass: "border-l-4 border-l-orange-600",
			items: [
				{
					id: "kitchen_cabinets_damage",
					label: "Kitchen Cabinets - NEW Damage",
					sub: "IDENTIFY: Broken hinges, cracked/missing doors, damaged drawer slides, water damage to cabinet boxes, missing hardware. PHOTOGRAPH: Each issue. COMPARE: Prove cabinets were functional at move-in. DISTINGUISH: Normal wear (slight loosening) vs damage (completely broken).",
					type: "status",
					critical: false
				},
				{
					id: "countertop_damage",
					label: "Countertops - NEW Damage",
					sub: "IDENTIFY: Deep scratches, burn marks, large chips, cracks, delamination. DISTINGUISH: From normal wear (light scratches, minor staining). PHOTOGRAPH: Wide shot + close-up with measuring tape. COMPARE: Prove counters were in good condition at move-in.",
					type: "status",
					critical: false
				},
				{
					id: "sink_faucet_damage",
					label: "Sinks & Faucets - NEW Damage",
					sub: "IDENTIFY: Cracked/chipped sinks, broken faucets, damaged spray nozzles, cracked caulking (beyond normal deterioration). TEST: Faucets for leaks. PHOTOGRAPH: Damage areas. COMPARE: Move-in condition photos.",
					type: "status",
					critical: false
				},
				{
					id: "bathroom_fixtures_damage",
					label: "Bathroom Fixtures - NEW Damage",
					sub: "IDENTIFY: Cracked toilet tanks/bowls, chipped porcelain on sinks/tubs, broken toilet seats, damaged faucets, cracked shower surrounds. PHOTOGRAPH: All damage. DISTINGUISH: Existing wear vs new cracks. COMPARE: Move-in photos proving fixtures were intact.",
					type: "status",
					critical: false
				},
				{
					id: "bathroom_tile_damage",
					label: "Bathroom Tile - NEW Damage",
					sub: "IDENTIFY: Cracked/broken tiles, large sections of missing grout, damaged caulking requiring full replacement. DISTINGUISH: From normal grout deterioration. PHOTOGRAPH: Extent of damage. COMPARE: Move-in tile condition.",
					type: "status",
					critical: false
				},
				{
					id: "light_fixtures_damage",
					label: "Light Fixtures - NEW Damage",
					sub: "IDENTIFY: Broken fixtures, missing covers, damaged switches, cracked shades. TEST: Functionality. DOCUMENT: What needs replacement vs simple bulb. COMPARE: Move-in condition.",
					type: "status",
					critical: false
				},
				{
					id: "blinds_treatments_damage",
					label: "Window Treatments - NEW Damage (if provided)",
					sub: "IDENTIFY: Broken blinds, torn curtains, damaged rods, missing pieces. PHOTOGRAPH: Damage. COMPARE: Move-in condition if provided by landlord. NOTE: If tenant-installed, not recoverable.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "delta_life_safety",
			title: "4. Life Safety Systems - Final Verification & Tampering Assessment",
			badge: "ZERO TOLERANCE - DOCUMENT ALL CHANGES",
			colorClass: "border-l-4 border-l-red-600",
			items: [
				{
					id: "smoke_detectors_final",
					label: "🔴 Smoke Detectors - FINAL Status Check",
					sub: "CRITICAL VERIFICATION: Count detectors and compare to move-in inventory. TEST each detector (button test). IDENTIFY missing detectors (photograph empty mounting bracket, note exact location). IDENTIFY damaged detectors (broken housing, removed batteries, disconnected wiring). COMPARE serial numbers to move-in records if visible. DOCUMENT: Any detector missing or non-functional is RECOVERABLE COST through L10. Photograph empty brackets as primary evidence. Section 87 RTA prohibits tenant interference with smoke alarms.",
					type: "status",
					critical: true
				},
				{
					id: "co_detectors_final",
					label: "⚠️ CO Detectors - FINAL Status Check",
					sub: "Count and compare to move-in inventory. Test each detector. Document any missing or damaged units. Photograph empty brackets if missing. This is recoverable cost through L10 if tenant removed.",
					type: "status",
					critical: true
				},
				{
					id: "detector_batteries_final",
					label: "Detector Batteries & Maintenance",
					sub: "Note if batteries were removed by tenant (chirping units with missing batteries = tenant tampering). Document if batteries are dead (landlord maintenance issue). Distinguish between tenant interference vs normal battery life end.",
					type: "status",
					critical: false
				},
				{
					id: "fire_extinguisher_final",
					label: "Fire Extinguisher Status (if provided)",
					sub: "Verify presence if provided at move-in. Check pressure gauge. Document if missing or discharged. Compare to move-in photo.",
					type: "status",
					critical: false
				},
				{
					id: "entry_security_final",
					label: "Entry Door Security - Final Check",
					sub: "Test all deadbolts and locks. Document any broken locks, damaged frames, forced entry evidence. Compare to move-in condition. Note if tenant changed locks without permission.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "delta_appliance_damage",
			title: "5. Appliance Damage Assessment",
			badge: "ASSET CONDITION VERIFICATION",
			colorClass: "border-l-4 border-l-teal-600",
			items: [
				{
					id: "appliance_fridge_final",
					label: "Refrigerator - Damage Assessment",
					sub: "IDENTIFY: Broken shelves, cracked door, damaged seals, non-functioning cooling, exterior dents/scratches beyond normal wear. TEST: Cooling function. COMPARE: Move-in condition and serial number. DOCUMENT: If appliance requires repair vs replacement.",
					type: "status",
					critical: false
				},
				{
					id: "appliance_stove_final",
					label: "Stove/Range - Damage Assessment",
					sub: "TEST: All burners and oven. IDENTIFY: Broken knobs, cracked glass cooktop, damaged oven door, broken heating elements, non-functioning burners. COMPARE: Move-in condition. DOCUMENT: Repair vs replacement needs.",
					type: "status",
					critical: false
				},
				{
					id: "appliance_dishwasher_final",
					label: "Dishwasher - Damage Assessment (if applicable)",
					sub: "TEST: Run cycle if possible. IDENTIFY: Broken racks, damaged door seal, cracked interior, non-functioning unit. COMPARE: Move-in condition. DOCUMENT: If repairable or requires replacement.",
					type: "status",
					critical: false
				},
				{
					id: "appliance_washer_dryer_final",
					label: "Washer/Dryer - Damage Assessment (if provided)",
					sub: "TEST: Basic functions. IDENTIFY: Damaged drums, broken doors, non-functioning units, missing parts. COMPARE: Move-in serial numbers and condition. DOCUMENT: Replacement needs and costs.",
					type: "status",
					critical: false
				},
				{
					id: "appliance_missing",
					label: "Missing Appliances",
					sub: "VERIFY: All appliances present at move-in are accounted for. DOCUMENT: Any missing appliances with photo of empty space and reference to move-in photos showing appliance. This is theft and fully recoverable through L10.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "delta_cleanliness",
			title: "6. Cleanliness & Sanitation Assessment (Ordinary vs Extraordinary)",
			badge: "DISTINGUISH NORMAL CLEANING FROM EXTRAORDINARY",
			colorClass: "border-l-4 border-l-brown-600",
			items: [
				{
					id: "refuse_volume",
					label: "📦 Refuse/Debris Volume Assessment",
					sub: "QUANTIFY: Count garbage bags, estimate cubic feet of furniture/debris. CLASSIFY: 'Minimal' (1-2 bags, ordinary disposal), 'Moderate' (3-5 bags or small furniture pieces), 'Extraordinary' (6+ bags, bulky furniture requiring junk removal service). PHOTOGRAPH: Wide shots showing volume, include measuring reference. DOCUMENT: If junk removal service required, this cost is RECOVERABLE. Ordinary trash disposal is landlord responsibility.",
					type: "status",
					critical: false
				},
				{
					id: "refuse_hazardous",
					label: "☢️ Hazardous Materials Present",
					sub: "IDENTIFY: Chemicals, paint cans, needles, biohazards, medical waste. DO NOT TOUCH. PHOTOGRAPH: From safe distance. DOCUMENT: Specialized disposal required. These costs are fully recoverable. Note health and safety concern for inspector.",
					type: "status",
					critical: false
				},
				{
					id: "appliance_fridge_sanitation",
					label: "🧊 Refrigerator Sanitation Level",
					sub: "OPEN AND INSPECT: Interior condition. CLASSIFY: 'Clean' (wiped, no residue), 'Light Soiling' (minor spills, wipe-clean), 'Moderate Contamination' (dried spills, odors), 'Heavy Contamination' (rotting food, liquid everywhere, requires professional biohazard cleaning). PHOTOGRAPH: Interior showing contamination level. SMELL TEST: Note if odors persist. Heavy contamination = RECOVERABLE professional cleaning cost.",
					type: "status",
					critical: false
				},
				{
					id: "appliance_oven_sanitation",
					label: "🔥 Oven/Stove Sanitation Level",
					sub: "OPEN AND INSPECT: Oven interior, stovetop, drip pans. CLASSIFY: 'Clean', 'Light Grease' (normal cooking residue), 'Heavy Grease' (caked carbon, requires professional degreasing). PHOTOGRAPH: Interior and stovetop. Heavy grease beyond normal cooking = RECOVERABLE cleaning cost.",
					type: "status",
					critical: false
				},
				{
					id: "bathroom_sanitation",
					label: "🚽 Bathroom Sanitation Level",
					sub: "INSPECT: Toilet (inside bowl and tank), shower/tub, sink. CLASSIFY: 'Clean', 'Light Residue', 'Moderate Soiling' (soap scum, light mildew), 'Heavy Contamination' (extensive mold, extreme filth requiring professional cleaning). PHOTOGRAPH: Problem areas. Black mold or biohazard levels = RECOVERABLE professional remediation cost.",
					type: "status",
					critical: false
				},
				{
					id: "general_cleanliness",
					label: "🧹 General Unit Cleanliness",
					sub: "ASSESS: Floors (swept/vacuumed?), windows (clean?), baseboards (dusted?), counters (wiped?). DISTINGUISH: 'Broom swept' (tenant responsibility, basic cleaning completed) vs 'Requires ordinary landlord turnover cleaning' vs 'Requires extraordinary deep cleaning'. Only extraordinary cleaning beyond normal turnover is recoverable. PHOTOGRAPH: Areas requiring more than ordinary cleaning.",
					type: "status",
					critical: false
				},
				{
					id: "odor_assessment",
					label: "👃 Odor Assessment & Source",
					sub: "SMELL TEST: Unit upon entry. IDENTIFY source: pet odors, smoke/cigarette smell, mold/mildew, garbage, other. DOCUMENT: Severity and source. Strong persistent odors requiring specialized cleaning = RECOVERABLE cost. Note in Delta Report if smoking occurred in no-smoking unit.",
					type: "status",
					critical: false
				},
				{
					id: "pest_evidence",
					label: "🐛 Pest Evidence or Infestation",
					sub: "INSPECT: Under sinks, in cabinets, behind appliances, closets. IDENTIFY: Droppings, nesting materials, live insects, rodent evidence. PHOTOGRAPH: Evidence found. DOCUMENT: Severity. Tenant-caused infestations may be partially recoverable. Get pest control quote.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "delta_access_control",
			title: "7. Access Control Reconciliation (Key Deposit Settlement)",
			badge: "MANDATORY COUNT - AFFECTS DEPOSIT REFUND",
			colorClass: "border-l-4 border-l-yellow-500",
			items: [
				{
					id: "keys_returned_count",
					label: "🔑 Keys/Fobs/Access Devices RETURNED - Count & Verify",
					sub: "RETRIEVE move-in key inventory list. COUNT each item returned: Main building keys (count), unit keys (count), mailbox keys (count), garage/parking fobs (count), storage locker keys (count). VERIFY: Keys work in respective locks. DOCUMENT in notes: 'Received: 2 main keys, 1 unit key, 1 mailbox key, 1 garage fob' (example). COMPARE to move-in count. CALCULATE discrepancy.",
					type: "status",
					critical: true
				},
				{
					id: "keys_missing_cost",
					label: "💰 Missing Keys/Fobs - Replacement Cost Calculation",
					sub: "IDENTIFY: Which specific items are missing. CALCULATE: Number missing × replacement cost per item = Total deduction from key deposit. DOCUMENT: 'Missing: 1 main building key ($25), 1 garage fob ($75) = Total $100 deducted from $150 key deposit. Refund due: $50.' GET locksmith quote for key cutting if not already established. This deduction is automatic from key deposit.",
					type: "status",
					critical: false
				},
				{
					id: "locks_change_required",
					label: "🔒 Lock Change Required (keys not returned)",
					sub: "IF KEYS NOT RETURNED: Landlord must change locks for security. Document which keys are missing. Get locksmith quote for rekeying or lock replacement. This cost may exceed key deposit and become part of L10 claim. PHOTOGRAPH: Current locks to document what needs changing.",
					type: "status",
					critical: false
				},
				{
					id: "key_deposit_refund",
					label: "💵 Key Deposit Refund Calculation & Payment",
					sub: "CALCULATE: Original key deposit amount - missing item replacement costs = refund due to tenant. DOCUMENT calculation in notes. Prepare refund cheque. Have tenant sign receipt acknowledging return of deposit (minus deductions if any). Provide itemized statement if deductions made.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "delta_comparison_summary",
			title: "8. Delta Report Summary & L10 Preparation",
			badge: "EVIDENCE COMPILATION FOR LTB",
			colorClass: "border-l-4 border-l-purple-700",
			items: [
				{
					id: "delta_comparison_complete",
					label: "📊 Delta Report: Move-In vs Move-Out Comparison",
					sub: "COMPILE comprehensive comparison document: Side-by-side photos of each damaged item (move-in pristine vs move-out damaged). Written description of each damage item with measurements. Explicit statement: 'This damage was NOT present in move-in report dated [DATE], Report ID [ID]. Damage occurred during tenant's occupancy [START DATE] to [END DATE].' This Delta Report is REQUIRED for L10 application success.",
					type: "status",
					critical: true
				},
				{
					id: "vendor_quotes_collected",
					label: "💼 Vendor Quotes for Repairs",
					sub: "OBTAIN written quotes for all damage repairs: Flooring repairs, wall patching/painting, window replacement, appliance repair/replacement, professional cleaning. Each quote should itemize labor and materials. Quotes are REQUIRED evidence for L10 application. Attach all quotes to tenant file.",
					type: "status",
					critical: false
				},
				{
					id: "total_claim_calculation",
					label: "💰 Total Claim Amount Calculation",
					sub: "SUM all recoverable costs: Utility consumption charges, damage repairs (per vendor quotes), extraordinary cleaning costs, missing appliances, lock replacement if keys not returned. DOCUMENT calculation: 'Hydro consumption: $XXX + Floor gouge repair: $XXX + Professional fridge cleaning: $XXX + Missing smoke detector: $XXX = TOTAL CLAIM: $XXX'. This total becomes the L10 application amount.",
					type: "status",
					critical: false
				},
				{
					id: "l10_filing_deadline",
					label: "⏰ L10 Filing Deadline Tracking",
					sub: "CALCULATE deadline: Move-out date + 1 year = L10 filing deadline. DOCUMENT: 'Tenant moved out [DATE]. L10 application must be filed by [DATE] or claim is forever barred by limitation period.' Set calendar reminder for 11 months to ensure timely filing.",
					type: "status",
					critical: false
				},
				{
					id: "evidence_package_complete",
					label: "📁 Complete Evidence Package Assembly",
					sub: "COMPILE for L10 filing: Signed move-in condition report with photos, signed move-out condition report with photos, Delta Report with side-by-side comparisons, all vendor quotes/invoices, utility bill calculations, key inventory reconciliation, tenant correspondence, lease agreement. This package is submitted with Form L10 to LTB.",
					type: "status",
					critical: false
				}
			]
		},
		{
			id: "delta_final_photos",
			title: "9. Final Photo Documentation (Mirror Move-In Protocol)",
			badge: "COMPLETE VISUAL RECORD",
			colorClass: "border-l-4 border-l-indigo-600",
			items: [
				{
					id: "exterior_final",
					label: "📸 Exterior & Entry - Final Photos",
					sub: "REPLICATE move-in exterior photos: Same angles of building front, unit door, mailbox, parking space. These confirm unit identification and show external condition at vacating.",
					type: "status",
					critical: true
				},
				{
					id: "room_wide_final",
					label: "📸 Wide-Angle Room Photos - Final (EVERY ROOM)",
					sub: "REPLICATE move-in room photos: Same angles and positions for every room. These side-by-side comparisons form the visual foundation of Delta Report. Stand in same spots as move-in photos for accurate comparison.",
					type: "status",
					critical: true
				},
				{
					id: "damage_macro_photos",
					label: "📸 Macro Photos - All Identified Damage",
					sub: "CLOSE-UP photos of EVERY damage item identified: Include measuring tape in photo showing size. Multiple angles of each damage item. Clear, well-lit, high-resolution images. These detail shots prove extent and severity of damage.",
					type: "status",
					critical: true
				},
				{
					id: "empty_unit_confirmation",
					label: "📸 Empty Unit Confirmation Photos",
					sub: "AFTER tenant removes belongings: Photo all rooms completely empty showing tenant has vacated. Photo all closets empty. Photo storage areas empty. This proves full possession returned to landlord.",
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
