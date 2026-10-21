// Types declared in code/modules/atmospherics/machinery that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(13105, "/area/arrival", "/area", {
	requires_power: 0,
});
rt.type(13106, "/area/arrival/start", "/area/arrival", {
	name: "Arrival Area",
	icon_state: "start",
});
rt.type(13107, "/area/admin", "/area", {
	name: "Admin room",
	icon_state: "start",
});
rt.type(13108, "/area/start", "/area", {
	requires_power: 0,
	has_gravity: 1,
	name: "start area",
	icon_state: "start",
	dynamic_lighting: 0,
});
rt.type(13109, "/area/asteroid", "/area", {
	requires_power: 0,
	has_gravity: 1,
	blob_allowed: 0,
	valid_territory: 0,
	name: "Asteroid",
	icon_state: "asteroid",
});
rt.type(13110, "/area/asteroid/cave", "/area/asteroid", {
	requires_power: 0,
	outdoors: 1,
	name: "Asteroid - Underground",
	icon_state: "cave",
});
rt.type(13112, "/area/planet", "/area", {});
rt.type(13113, "/area/planet/clown", "/area/planet", {
	requires_power: 0,
	name: "Clown Planet",
	icon_state: "honk",
});
rt.type(13114, "/area/telesciareas", "/area", {
	requires_power: 0,
	name: "Cosmic Anomaly",
	icon_state: "telesci",
});
rt.type(13115, "/area/maintenance", "/area", {
	ambientsounds: null,
	valid_territory: 0,
});
rt.type(13116, "/area/maintenance/department", "/area/maintenance", {});
rt.type(13117, "/area/maintenance/department/chapel", "/area/maintenance/department", {
	name: "Chapel Maintenance",
	icon_state: "fpmaint",
});
rt.type(13118, "/area/maintenance/department/chapel/monastery", "/area/maintenance/department/chapel", {
	name: "Monastery Maintenance",
	icon_state: "fpmaint",
});
rt.type(13119, "/area/maintenance/department/crew_quarters", "/area/maintenance/department", {});
rt.type(13120, "/area/maintenance/department/crew_quarters/bar", "/area/maintenance/department/crew_quarters", {
	name: "Bar Maintenance",
	icon_state: "fsmaint",
});
rt.type(13121, "/area/maintenance/department/crew_quarters/dorms", "/area/maintenance/department/crew_quarters", {
	name: "Dormitory Maintenance",
	icon_state: "fsmaint",
});
rt.type(13122, "/area/maintenance/department/crew_quarters/locker", "/area/maintenance/department/crew_quarters", {
	name: "Locker Room Maintenance",
	icon_state: "pmaint",
});
rt.type(13123, "/area/maintenance/department/eva", "/area/maintenance/department", {
	name: "EVA Maintenance",
	icon_state: "fpmaint",
});
rt.type(13124, "/area/maintenance/department/electrical", "/area/maintenance/department", {
	name: "Electrical Maintenance",
	icon_state: "yellow",
});
rt.type(13125, "/area/maintenance/department/engine", "/area/maintenance/department", {
	name: "Engineering Maintenance",
	icon_state: "amaint",
});
rt.type(13126, "/area/maintenance/department/engine/atmos", "/area/maintenance/department/engine", {
	name: "Atmospherics Maintenance",
	icon_state: "fpmaint",
});
rt.type(13127, "/area/maintenance/department/security", "/area/maintenance/department", {
	name: "Security Maintenance",
	icon_state: "fpmaint",
});
rt.type(13128, "/area/maintenance/department/security/brig", "/area/maintenance/department/security", {
	name: "Brig Maintenance",
	icon_state: "fpmaint",
});
rt.type(13129, "/area/maintenance/department/medical", "/area/maintenance/department", {
	name: "Medbay Maintenance",
	icon_state: "asmaint",
});
rt.type(13130, "/area/maintenance/department/science", "/area/maintenance/department", {
	name: "Science Maintenance",
	icon_state: "asmaint",
});
rt.type(13131, "/area/maintenance/department/science/xenobiology", "/area/maintenance/department/science", {
	name: "Xenobiology Maintenance",
	icon_state: "xenomaint",
});
rt.type(13132, "/area/maintenance/department/cargo", "/area/maintenance/department", {
	name: "Cargo Maintenance",
	icon_state: "apmaint",
});
rt.type(13133, "/area/maintenance/department/bridge", "/area/maintenance/department", {
	name: "Bridge Maintenance",
	icon_state: "maintcentral",
});
rt.type(13134, "/area/maintenance/arrivals", "/area/maintenance", {});
rt.type(13135, "/area/maintenance/arrivals/north", "/area/maintenance/arrivals", {
	name: "Arrivals North Maintenance",
	icon_state: "fpmaint",
});
rt.type(13136, "/area/maintenance/arrivals/north_2", "/area/maintenance/arrivals", {
	name: "Arrivals North Maintenance",
	icon_state: "fpmaint",
});
rt.type(13137, "/area/maintenance/aft", "/area/maintenance", {
	name: "Aft Maintenance",
	icon_state: "amaint",
});
rt.type(13138, "/area/maintenance/aft/secondary", "/area/maintenance/aft", {
	name: "Aft Maintenance",
	icon_state: "amaint_2",
});
rt.type(13139, "/area/maintenance/central", "/area/maintenance", {
	name: "Central Maintenance",
	icon_state: "maintcentral",
});
rt.type(13140, "/area/maintenance/central/secondary", "/area/maintenance/central", {
	name: "Central Maintenance",
	icon_state: "maintcentral",
});
rt.type(13141, "/area/maintenance/fore", "/area/maintenance", {
	name: "Fore Maintenance",
	icon_state: "fmaint",
});
rt.type(13142, "/area/maintenance/fore/secondary", "/area/maintenance/fore", {
	name: "Fore Maintenance",
	icon_state: "fmaint_2",
});
rt.type(13143, "/area/maintenance/starboard", "/area/maintenance", {
	name: "Starboard Maintenance",
	icon_state: "smaint",
});
rt.type(13144, "/area/maintenance/starboard/central", "/area/maintenance/starboard", {
	name: "Central Starboard Maintenance",
	icon_state: "smaint",
});
rt.type(13145, "/area/maintenance/starboard/aft", "/area/maintenance/starboard", {
	name: "Starboard Quarter Maintenance",
	icon_state: "asmaint",
});
rt.type(13146, "/area/maintenance/starboard/fore", "/area/maintenance/starboard", {
	name: "Starboard Bow Maintenance",
	icon_state: "fsmaint",
});
rt.type(13147, "/area/maintenance/port", "/area/maintenance", {
	name: "Port Maintenance",
	icon_state: "pmaint",
});
rt.type(13148, "/area/maintenance/port/central", "/area/maintenance/port", {
	name: "Central Port Maintenance",
	icon_state: "maintcentral",
});
rt.type(13149, "/area/maintenance/port/aft", "/area/maintenance/port", {
	name: "Port Quarter Maintenance",
	icon_state: "apmaint",
});
rt.type(13150, "/area/maintenance/port/fore", "/area/maintenance/port", {
	name: "Port Bow Maintenance",
	icon_state: "fpmaint",
});
rt.type(13151, "/area/maintenance/disposal", "/area/maintenance", {
	name: "Waste Disposal",
	icon_state: "disposal",
});
rt.type(13152, "/area/maintenance/disposal/incinerator", "/area/maintenance/disposal", {
	name: "Incinerator",
	icon_state: "disposal",
});
rt.type(13153, "/area/maintenance/asteroid", "/area/maintenance", {});
rt.type(13154, "/area/maintenance/asteroid/aft", "/area/maintenance/asteroid", {});
rt.type(13155, "/area/maintenance/asteroid/aft/science", "/area/maintenance/asteroid/aft", {
	name: "Aft Maintenance",
	icon_state: "amaint",
});
rt.type(13156, "/area/maintenance/asteroid/aft/arrivals", "/area/maintenance/asteroid/aft", {
	name: "Aft Maintenance",
	icon_state: "amaint",
});
rt.type(13157, "/area/maintenance/asteroid/central", "/area/maintenance/asteroid", {
	name: "Central Asteroid Maintenance",
	icon_state: "maintcentral",
});
rt.type(13158, "/area/maintenance/asteroid/disposal", "/area/maintenance/asteroid", {});
rt.type(13159, "/area/maintenance/asteroid/disposal/east", "/area/maintenance/asteroid/disposal", {
	name: "Eastern External Waste Belt",
	icon_state: "disposal",
});
rt.type(13160, "/area/maintenance/asteroid/disposal/north", "/area/maintenance/asteroid/disposal", {
	name: "Northern External Waste Belt",
	icon_state: "disposal",
});
rt.type(13161, "/area/maintenance/asteroid/disposal/southeast", "/area/maintenance/asteroid/disposal", {
	name: "South-Eastern Disposal",
	icon_state: "disposal",
});
rt.type(13162, "/area/maintenance/asteroid/disposal/southwest", "/area/maintenance/asteroid/disposal", {
	name: "South-Western Disposal",
	icon_state: "disposal",
});
rt.type(13163, "/area/maintenance/asteroid/fore", "/area/maintenance/asteroid", {});
rt.type(13164, "/area/maintenance/asteroid/fore/cargo_west", "/area/maintenance/asteroid/fore", {
	name: "Fore Asteroid Maintenance",
	icon_state: "fmaint",
});
rt.type(13165, "/area/maintenance/asteroid/fore/cargo_south", "/area/maintenance/asteroid/fore", {
	name: "Fore Asteroid Maintenance",
	icon_state: "fmaint",
});
rt.type(13166, "/area/maintenance/asteroid/fore/com_west", "/area/maintenance/asteroid/fore", {
	name: "Fore Asteroid Maintenance",
	icon_state: "fmaint",
});
rt.type(13167, "/area/maintenance/asteroid/fore/com_north", "/area/maintenance/asteroid/fore", {
	name: "Fore Asteroid Maintenance",
	icon_state: "fmaint",
});
rt.type(13168, "/area/maintenance/asteroid/fore/com_east", "/area/maintenance/asteroid/fore", {
	name: "Fore Asteroid Maintenance",
	icon_state: "fmaint",
});
rt.type(13169, "/area/maintenance/asteroid/fore/com_south", "/area/maintenance/asteroid/fore", {
	name: "Fore Asteroid Maintenance",
	icon_state: "fmaint",
});
rt.type(13170, "/area/maintenance/asteroid/port", "/area/maintenance/asteroid", {});
rt.type(13171, "/area/maintenance/asteroid/port/neast", "/area/maintenance/asteroid/port", {
	name: "Port Asteroid Maintenance",
	icon_state: "pmaint",
});
rt.type(13172, "/area/maintenance/asteroid/port/east", "/area/maintenance/asteroid/port", {
	name: "Port Asteroid Maintenance",
	icon_state: "pmaint",
});
rt.type(13173, "/area/maintenance/asteroid/port/west", "/area/maintenance/asteroid/port", {
	name: "Port Asteroid Maintenance",
	icon_state: "pmaint",
});
rt.type(13174, "/area/maintenance/asteroid/starboard", "/area/maintenance/asteroid", {
	name: "Starboard Asteroid Maintenance",
	icon_state: "smaint",
});
rt.type(13175, "/area/maintenance/solars", "/area/maintenance", {
	name: "Solar Maintenance",
	icon_state: "yellow",
});
rt.type(13176, "/area/maintenance/solars/asteroid", "/area/maintenance/solars", {});
rt.type(13177, "/area/maintenance/solars/asteroid/aft", "/area/maintenance/solars/asteroid", {
	name: "Aft Asteroid Solar Maintenance",
	icon_state: "SolarcontrolA",
});
rt.type(13178, "/area/maintenance/solars/asteroid/command", "/area/maintenance/solars/asteroid", {
	name: "Command Asteroid Solar Maintenance",
	icon_state: "SolarcontrolP",
});
rt.type(13179, "/area/maintenance/solars/asteroid/fore", "/area/maintenance/solars/asteroid", {
	name: "Fore Asteroid Solar Maintenance",
	icon_state: "SolarcontrolP",
});
rt.type(13180, "/area/maintenance/solars/port", "/area/maintenance/solars", {
	name: "Port Solar Maintenance",
	icon_state: "SolarcontrolP",
});
rt.type(13181, "/area/maintenance/solars/port/aft", "/area/maintenance/solars/port", {
	name: "Port Quarter Solar Maintenance",
	icon_state: "SolarcontrolAP",
});
rt.type(13182, "/area/maintenance/solars/port/fore", "/area/maintenance/solars/port", {
	name: "Port Bow Solar Maintenance",
	icon_state: "SolarcontrolFP",
});
rt.type(13183, "/area/maintenance/solars/starboard", "/area/maintenance/solars", {
	name: "Starboard Solar Maintenance",
	icon_state: "SolarcontrolS",
});
rt.type(13184, "/area/maintenance/solars/starboard/aft", "/area/maintenance/solars/starboard", {
	name: "Starboard Quarter Solar Maintenance",
	icon_state: "SolarcontrolAS",
});
rt.type(13185, "/area/maintenance/solars/starboard/fore", "/area/maintenance/solars/starboard", {
	name: "Starboard Bow Solar Maintenance",
	icon_state: "SolarcontrolFS",
});
rt.type(13186, "/area/maintenance/solars/aux", "/area/maintenance/solars", {});
rt.type(13187, "/area/maintenance/solars/aux/port", "/area/maintenance/solars/aux", {
	name: "Port Auxiliary Solar Maintenance",
	icon_state: "SolarcontrolA",
});
rt.type(13188, "/area/maintenance/solars/aux/port/aft", "/area/maintenance/solars/aux/port", {
	name: "Port Quarter Auxiliary Solar Maintenance",
	icon_state: "SolarcontrolAP",
});
rt.type(13189, "/area/maintenance/solars/aux/port/fore", "/area/maintenance/solars/aux/port", {
	name: "Port Bow Auxiliary Solar Maintenance",
	icon_state: "SolarcontrolA",
});
rt.type(13190, "/area/maintenance/solars/aux/starboard", "/area/maintenance/solars/aux", {
	name: "Starboard Auxiliary Solar Maintenance",
	icon_state: "SolarcontrolA",
});
rt.type(13191, "/area/maintenance/solars/aux/starboard/aft", "/area/maintenance/solars/aux/starboard", {
	name: "Starboard Quarter Auxiliary Solar Maintenance",
	icon_state: "SolarcontrolA",
});
rt.type(13192, "/area/maintenance/solars/aux/starboard/fore", "/area/maintenance/solars/aux/starboard", {
	name: "Starboard Bow Auxiliary Solar Maintenance",
	icon_state: "SolarcontrolA",
});
rt.type(13193, "/area/hallway", "/area", {});
rt.type(13194, "/area/hallway/primary", "/area/hallway", {});
rt.type(13195, "/area/hallway/primary/aft", "/area/hallway/primary", {
	name: "Aft Primary Hallway",
	icon_state: "hallA",
});
rt.type(13196, "/area/hallway/primary/fore", "/area/hallway/primary", {
	name: "Fore Primary Hallway",
	icon_state: "hallF",
});
rt.type(13197, "/area/hallway/primary/starboard", "/area/hallway/primary", {
	name: "Starboard Primary Hallway",
	icon_state: "hallS",
});
rt.type(13198, "/area/hallway/primary/starboard/aft", "/area/hallway/primary/starboard", {
	name: "Starboard Quarter Primary Hallway",
	icon_state: "hallAS",
});
rt.type(13199, "/area/hallway/primary/starboard/fore", "/area/hallway/primary/starboard", {
	name: "Starboard Bow Primary Hallway",
	icon_state: "hallFS",
});
rt.type(13200, "/area/hallway/primary/port", "/area/hallway/primary", {
	name: "Port Primary Hallway",
	icon_state: "hallP",
});
rt.type(13201, "/area/hallway/primary/port/aft", "/area/hallway/primary/port", {
	name: "Port Quarter Primary Hallway",
	icon_state: "hallAP",
});
rt.type(13202, "/area/hallway/primary/port/fore", "/area/hallway/primary/port", {
	name: "Port Bow Primary Hallway",
	icon_state: "hallFP",
});
rt.type(13203, "/area/hallway/primary/central", "/area/hallway/primary", {
	name: "Central Primary Hallway",
	icon_state: "hallC",
});
rt.type(13204, "/area/hallway/secondary", "/area/hallway", {});
rt.type(13205, "/area/hallway/secondary/command", "/area/hallway/secondary", {
	name: "Command Hallway",
	icon_state: "bridge_hallway",
});
rt.type(13206, "/area/hallway/secondary/construction", "/area/hallway/secondary", {
	name: "Construction Area",
	icon_state: "construction",
});
rt.type(13207, "/area/hallway/secondary/exit", "/area/hallway/secondary", {
	name: "Escape Shuttle Hallway",
	icon_state: "escape",
});
rt.type(13208, "/area/hallway/secondary/exit/departure_lounge", "/area/hallway/secondary/exit", {
	name: "Departure Lounge",
	icon_state: "escape_lounge",
});
rt.type(13209, "/area/hallway/secondary/entry", "/area/hallway/secondary", {
	name: "Arrival Shuttle Hallway",
	icon_state: "entry",
});
rt.type(13210, "/area/hallway/secondary/service", "/area/hallway/secondary", {
	name: "Service Hallway",
	icon_state: "hall_service",
});
rt.type(13211, "/area/hallway/secondary/bridges", "/area/hallway/secondary", {});
rt.type(13212, "/area/hallway/secondary/bridges/cargo_ai", "/area/hallway/secondary/bridges", {
	name: "Cargo-AI-Command Bridge",
	icon_state: "yellow",
});
rt.type(13213, "/area/hallway/secondary/bridges/com_engi", "/area/hallway/secondary/bridges", {
	name: "Command-Engineering Bridge",
	icon_state: "yellow",
});
rt.type(13214, "/area/hallway/secondary/bridges/com_serv", "/area/hallway/secondary/bridges", {
	name: "Command-Service Bridge",
	icon_state: "yellow",
});
rt.type(13215, "/area/hallway/secondary/bridges/dock_med", "/area/hallway/secondary/bridges", {
	name: "Docking-Medical Bridge",
	icon_state: "yellow",
});
rt.type(13216, "/area/hallway/secondary/bridges/engi_med", "/area/hallway/secondary/bridges", {
	name: "Engineering-Medical Bridge",
	icon_state: "yellow",
});
rt.type(13217, "/area/hallway/secondary/bridges/med_cargo", "/area/hallway/secondary/bridges", {
	name: "Medical-Cargo Bridge",
	icon_state: "yellow",
});
rt.type(13218, "/area/hallway/secondary/bridges/sci_dock", "/area/hallway/secondary/bridges", {
	name: "Science-Docking Bridge",
	icon_state: "yellow",
});
rt.type(13219, "/area/hallway/secondary/bridges/serv_engi", "/area/hallway/secondary/bridges", {
	name: "Service-Engineering Bridge",
	icon_state: "yellow",
});
rt.type(13220, "/area/hallway/secondary/bridges/serv_sci", "/area/hallway/secondary/bridges", {
	name: "Service-Science Bridge",
	icon_state: "yellow",
});
rt.type(13221, "/area/bridge", "/area", {
	music: "signal",
	name: "Bridge",
	icon_state: "bridge",
});
rt.type(13222, "/area/bridge/meeting_room", "/area/bridge", {
	music: null,
	name: "Heads of Staff Meeting Room",
	icon_state: "meeting",
});
rt.type(13223, "/area/bridge/meeting_room/council", "/area/bridge/meeting_room", {
	music: null,
	name: "Council Chamber",
	icon_state: "meeting",
});
rt.type(13224, "/area/bridge/showroom", "/area/bridge", {});
rt.type(13225, "/area/bridge/showroom/corporate", "/area/bridge/showroom", {
	music: null,
	name: "Corporate Showroom",
	icon_state: "showroom",
});
rt.type(13226, "/area/crew_quarters", "/area", {});
rt.type(13227, "/area/crew_quarters/heads", "/area/crew_quarters", {});
rt.type(13228, "/area/crew_quarters/heads/captain", "/area/crew_quarters/heads", {
	name: "Captain's Office",
	icon_state: "captain",
});
rt.type(13229, "/area/crew_quarters/heads/captain/private", "/area/crew_quarters/heads/captain", {
	name: "Captain's Quarters",
	icon_state: "captain",
});
rt.type(13230, "/area/crew_quarters/heads/chief", "/area/crew_quarters/heads", {
	name: "Chief Engineer's Office",
	icon_state: "ce_office",
});
rt.type(13231, "/area/crew_quarters/heads/chief/private", "/area/crew_quarters/heads/chief", {
	name: "Chief Engineer's Private Quarters",
	icon_state: "ce_private",
});
rt.type(13232, "/area/crew_quarters/heads/cmo", "/area/crew_quarters/heads", {
	name: "Chief Medical Officer's Office",
	icon_state: "cmo_office",
});
rt.type(13233, "/area/crew_quarters/heads/cmo/private", "/area/crew_quarters/heads/cmo", {
	name: "Chief Medical Officer's Private Quarters",
	icon_state: "cmo_private",
});
rt.type(13234, "/area/crew_quarters/heads/hop", "/area/crew_quarters/heads", {
	name: "Head of Personnel's Office",
	icon_state: "hop_office",
});
rt.type(13235, "/area/crew_quarters/heads/hop/private", "/area/crew_quarters/heads/hop", {
	name: "Head of Personnel's Private Quarters",
	icon_state: "hop_private",
});
rt.type(13236, "/area/crew_quarters/heads/hos", "/area/crew_quarters/heads", {
	name: "Head of Security's Office",
	icon_state: "hos_office",
});
rt.type(13237, "/area/crew_quarters/heads/hos/private", "/area/crew_quarters/heads/hos", {
	name: "Head of Security's Private Quarters",
	icon_state: "hos_private",
});
rt.type(13238, "/area/crew_quarters/heads/hor", "/area/crew_quarters/heads", {
	name: "Research Director's Office",
	icon_state: "rd_office",
});
rt.type(13239, "/area/crew_quarters/heads/hor/private", "/area/crew_quarters/heads/hor", {
	name: "Research Director's Private Quarters",
	icon_state: "rd_private",
});
rt.type(13240, "/area/crew_quarters/dorms", "/area/crew_quarters", {
	safe: 1,
	name: "Dormitories",
	icon_state: "Sleep",
});
rt.type(13241, "/area/crew_quarters/dorms/male", "/area/crew_quarters/dorms", {
	name: "Male Dorm",
	icon_state: "Sleep",
});
rt.type(13242, "/area/crew_quarters/dorms/female", "/area/crew_quarters/dorms", {
	name: "Female Dorm",
	icon_state: "Sleep",
});
rt.type(13243, "/area/crew_quarters/rehab_dome", "/area/crew_quarters", {
	name: "Rehabilitation Dome",
	icon_state: "Sleep",
});
rt.type(13244, "/area/crew_quarters/toilet", "/area/crew_quarters", {
	name: "Dormitory Toilets",
	icon_state: "toilet",
});
rt.type(13245, "/area/crew_quarters/toilet/auxiliary", "/area/crew_quarters/toilet", {
	name: "Auxiliary Restrooms",
	icon_state: "toilet",
});
rt.type(13246, "/area/crew_quarters/toilet/locker", "/area/crew_quarters/toilet", {
	name: "Locker Toilets",
	icon_state: "toilet",
});
rt.type(13247, "/area/crew_quarters/toilet/female", "/area/crew_quarters/toilet", {
	name: "Female Toilets",
	icon_state: "toilet",
});
rt.type(13248, "/area/crew_quarters/toilet/male", "/area/crew_quarters/toilet", {
	name: "Male Toilets",
	icon_state: "toilet",
});
rt.type(13249, "/area/crew_quarters/toilet/restrooms", "/area/crew_quarters/toilet", {
	name: "Restrooms",
	icon_state: "toilet",
});
rt.type(13250, "/area/crew_quarters/locker", "/area/crew_quarters", {
	name: "Locker Room",
	icon_state: "locker",
});
rt.type(13251, "/area/crew_quarters/lounge", "/area/crew_quarters", {
	name: "Lounge",
	icon_state: "yellow",
});
rt.type(13252, "/area/crew_quarters/fitness", "/area/crew_quarters", {
	name: "Fitness Room",
	icon_state: "fitness",
});
rt.type(13253, "/area/crew_quarters/fitness/recreation", "/area/crew_quarters/fitness", {
	name: "Recreation Area",
	icon_state: "fitness",
});
rt.type(13254, "/area/crew_quarters/cafeteria", "/area/crew_quarters", {
	name: "Cafeteria",
	icon_state: "cafeteria",
});
rt.type(13255, "/area/crew_quarters/cafeteria/lunchroom", "/area/crew_quarters/cafeteria", {
	name: "Lunchroom",
	icon_state: "cafeteria",
});
rt.type(13256, "/area/crew_quarters/kitchen", "/area/crew_quarters", {
	name: "Kitchen",
	icon_state: "kitchen",
});
rt.type(13257, "/area/crew_quarters/kitchen/backroom", "/area/crew_quarters/kitchen", {
	name: "Kitchen Coldroom",
	icon_state: "kitchen",
});
rt.type(13258, "/area/crew_quarters/bar", "/area/crew_quarters", {
	name: "Bar",
	icon_state: "bar",
});
rt.type(13259, "/area/crew_quarters/bar/atrium", "/area/crew_quarters/bar", {
	name: "Atrium",
	icon_state: "bar",
});
rt.type(13260, "/area/crew_quarters/electronic_marketing_den", "/area/crew_quarters", {
	name: "Electronic Marketing Den",
	icon_state: "bar",
});
rt.type(13261, "/area/crew_quarters/abandoned_gambling_den", "/area/crew_quarters", {
	name: "Abandoned Gambling Den",
	icon_state: "bar",
});
rt.type(13262, "/area/crew_quarters/theatre", "/area/crew_quarters", {
	name: "Theatre",
	icon_state: "Theatre",
});
rt.type(13263, "/area/crew_quarters/theatre/abandoned", "/area/crew_quarters/theatre", {
	name: "Abandoned Theatre",
	icon_state: "Theatre",
});
rt.type(13264, "/area/mint", "/area", {
	name: "Mint",
	icon_state: "green",
});
rt.type(13265, "/area/comms", "/area", {
	name: "Communications Relay",
	icon_state: "tcomsatcham",
});
rt.type(13266, "/area/server", "/area", {
	name: "Messaging Server Room",
	icon_state: "server",
});
rt.type(13267, "/area/library", "/area", {
	flags: 0,
	name: "Library",
	icon_state: "library",
});
rt.type(13268, "/area/library/lounge", "/area/library", {
	name: "Library Lounge",
	icon_state: "library",
});
rt.type(13269, "/area/library/abandoned", "/area/library", {
	flags: 0,
	name: "Abandoned Library",
	icon_state: "library",
});
rt.type(13270, "/area/chapel", "/area", {
	ambientsounds: null,
	flags: 0,
	icon_state: "chapel",
});
rt.type(13271, "/area/chapel/main", "/area/chapel", {
	name: "Chapel",
});
rt.type(13272, "/area/chapel/main/monastery", "/area/chapel/main", {
	name: "Monastery",
});
rt.type(13273, "/area/chapel/office", "/area/chapel", {
	name: "Chapel Office",
	icon_state: "chapeloffice",
});
rt.type(13274, "/area/chapel/asteroid", "/area/chapel", {
	name: "Chapel Asteroid",
	icon_state: "explored",
});
rt.type(13275, "/area/chapel/dock", "/area/chapel", {
	name: "Chapel Dock",
	icon_state: "construction",
});
rt.type(13276, "/area/lawoffice", "/area", {
	name: "Law Office",
	icon_state: "law",
});
rt.type(13277, "/area/engine", "/area", {
	ambientsounds: null,
});
rt.type(13278, "/area/engine/engine_smes", "/area/engine", {
	name: "Engineering SMES",
	icon_state: "engine_smes",
});
rt.type(13280, "/area/engine/atmos", "/area/engine", {
	flags: 0,
	name: "Atmospherics",
	icon_state: "atmos",
});
rt.type(13281, "/area/engine/atmospherics_engine", "/area/engine", {
	name: "Atmospherics Engine",
	icon_state: "atmos_engine",
});
rt.type(13282, "/area/engine/supermatter", "/area/engine", {
	name: "Supermatter Engine",
	icon_state: "engine_sm",
});
rt.type(13283, "/area/engine/break_room", "/area/engine", {
	name: "Engineering Foyer",
	icon_state: "engine_foyer",
});
rt.type(13284, "/area/engine/gravity_generator", "/area/engine", {
	name: "Gravity Generator Room",
	icon_state: "grav_gen",
});
rt.type(13285, "/area/engine/secure_construction", "/area/engine", {
	name: "Secure Construction Area",
	icon_state: "engine",
});
rt.type(13286, "/area/engine/storage", "/area/engine", {
	name: "Engineering Storage",
	icon_state: "engi_storage",
});
rt.type(13287, "/area/engine/transit_tube", "/area/engine", {
	name: "Transit Tube",
	icon_state: "transit_tube",
});
rt.type(13288, "/area/solar", "/area", {
	requires_power: 0,
	valid_territory: 0,
	blob_allowed: 0,
	flags: 0,
	dynamic_lighting: 3,
});
rt.type(13289, "/area/solar/asteroid", "/area/solar", {});
rt.type(13290, "/area/solar/asteroid/aft", "/area/solar/asteroid", {
	name: "Aft Asteroid Solar",
	icon_state: "panelsA",
});
rt.type(13291, "/area/solar/asteroid/command", "/area/solar/asteroid", {
	name: "Command Asteroid Solar",
	icon_state: "panelsA",
});
rt.type(13292, "/area/solar/asteroid/fore", "/area/solar/asteroid", {
	name: "Fore Asteroid Solar",
	icon_state: "panelsA",
});
rt.type(13293, "/area/solar/fore", "/area/solar", {
	name: "Fore Solar Array",
	icon_state: "yellow",
});
rt.type(13294, "/area/solar/aft", "/area/solar", {
	name: "Aft Solar Array",
	icon_state: "yellow",
});
rt.type(13295, "/area/solar/aux", "/area/solar", {});
rt.type(13296, "/area/solar/aux/port", "/area/solar/aux", {
	name: "Port Bow Auxiliary Solar Array",
	icon_state: "panelsA",
});
rt.type(13297, "/area/solar/aux/starboard", "/area/solar/aux", {
	name: "Starboard Bow Auxiliary Solar Array",
	icon_state: "panelsA",
});
rt.type(13298, "/area/solar/starboard", "/area/solar", {
	name: "Starboard Solar Array",
	icon_state: "panelsS",
});
rt.type(13299, "/area/solar/starboard/aft", "/area/solar/starboard", {
	name: "Starboard Quarter Solar Array",
	icon_state: "panelsAS",
});
rt.type(13300, "/area/solar/starboard/fore", "/area/solar/starboard", {
	name: "Starboard Bow Solar Array",
	icon_state: "panelsFS",
});
rt.type(13301, "/area/solar/port", "/area/solar", {
	name: "Port Solar Array",
	icon_state: "panelsP",
});
rt.type(13302, "/area/solar/port/aft", "/area/solar/port", {
	name: "Port Quarter Solar Array",
	icon_state: "panelsAP",
});
rt.type(13303, "/area/solar/port/fore", "/area/solar/port", {
	name: "Port Bow Solar Array",
	icon_state: "panelsFP",
});
rt.type(13304, "/area/solar/derelict_starboard", "/area/solar", {
	name: "Derelict Starboard Solar Array",
	icon_state: "panelsS",
});
rt.type(13305, "/area/solar/derelict_aft", "/area/solar", {
	name: "Derelict Aft Solar Array",
	icon_state: "yellow",
});
rt.type(13306, "/area/assembly", "/area", {});
rt.type(13307, "/area/assembly/assembly_line", "/area/assembly", {
	power_equip: 0,
	power_light: 0,
	power_environ: 0,
	name: "Assembly Line",
	icon_state: "ass_line",
});
rt.type(13308, "/area/teleporter", "/area", {
	music: "signal",
	name: "Teleporter Room",
	icon_state: "teleporter",
});
rt.type(13309, "/area/teleporter/quantum", "/area/teleporter", {});
rt.type(13310, "/area/teleporter/quantum/cargo", "/area/teleporter/quantum", {
	music: "signal",
	name: "Cargo Quantum Pad",
	icon_state: "teleporter",
});
rt.type(13311, "/area/teleporter/quantum/docking", "/area/teleporter/quantum", {
	music: "signal",
	name: "Docking Quantum Pad",
	icon_state: "teleporter",
});
rt.type(13312, "/area/teleporter/quantum/research", "/area/teleporter/quantum", {
	music: "signal",
	name: "Research Quantum Pad",
	icon_state: "teleporter",
});
rt.type(13313, "/area/teleporter/quantum/security", "/area/teleporter/quantum", {
	music: "signal",
	name: "Security Quantum Pad",
	icon_state: "teleporter",
});
rt.type(13314, "/area/gateway", "/area", {
	music: "signal",
	name: "Gateway",
	icon_state: "teleporter",
});
rt.type(13315, "/area/medical", "/area", {
	name: "Medical",
	icon_state: "medbay3",
});
rt.type(13316, "/area/medical/abandoned", "/area/medical", {
	music: rt.rsc("sound/ambience/signal.ogg"),
	name: "Abandoned Medbay",
	icon_state: "medbay3",
});
rt.type(13317, "/area/medical/medbay", "/area/medical", {});
rt.type(13318, "/area/medical/medbay/central", "/area/medical/medbay", {
	music: rt.rsc("sound/ambience/signal.ogg"),
	name: "Medbay Central",
	icon_state: "medbay",
});
rt.type(13319, "/area/medical/medbay/front_office", "/area/medical/medbay", {
	music: rt.rsc("sound/ambience/signal.ogg"),
	name: "Medbay Front Office",
	icon_state: "medbay",
});
rt.type(13320, "/area/medical/medbay/lobby", "/area/medical/medbay", {
	music: rt.rsc("sound/ambience/signal.ogg"),
	name: "Medbay Lobby",
	icon_state: "medbay",
});
rt.type(13321, "/area/medical/medbay/zone2", "/area/medical/medbay", {
	music: rt.rsc("sound/ambience/signal.ogg"),
	name: "Medbay",
	icon_state: "medbay2",
});
rt.type(13322, "/area/medical/medbay/zone3", "/area/medical/medbay", {
	music: rt.rsc("sound/ambience/signal.ogg"),
	name: "Medbay",
	icon_state: "medbay3",
});
rt.type(13323, "/area/medical/medbay/aft", "/area/medical/medbay", {
	music: rt.rsc("sound/ambience/signal.ogg"),
	name: "Medbay Aft",
	icon_state: "medbay3",
});
rt.type(13324, "/area/medical/storage", "/area/medical", {
	music: rt.rsc("sound/ambience/signal.ogg"),
	name: "Medbay Storage",
	icon_state: "medbay2",
});
rt.type(13325, "/area/medical/patients_rooms", "/area/medical", {
	name: "Patients' Rooms",
	icon_state: "patients",
});
rt.type(13326, "/area/medical/patients_rooms/room_a", "/area/medical/patients_rooms", {
	name: "Patient Room A",
	icon_state: "patients",
});
rt.type(13327, "/area/medical/patients_rooms/room_b", "/area/medical/patients_rooms", {
	name: "Patient Room B",
	icon_state: "patients",
});
rt.type(13328, "/area/medical/virology", "/area/medical", {
	flags: 0,
	name: "Virology",
	icon_state: "virology",
});
rt.type(13329, "/area/medical/morgue", "/area/medical", {
	ambientsounds: null,
	name: "Morgue",
	icon_state: "morgue",
});
rt.type(13330, "/area/medical/chemistry", "/area/medical", {
	name: "Chemistry",
	icon_state: "chem",
});
rt.type(13331, "/area/medical/surgery", "/area/medical", {
	name: "Surgery",
	icon_state: "surgery",
});
rt.type(13332, "/area/medical/cryo", "/area/medical", {
	name: "Cryogenics",
	icon_state: "cryo",
});
rt.type(13333, "/area/medical/exam_room", "/area/medical", {
	name: "Exam Room",
	icon_state: "exam_room",
});
rt.type(13334, "/area/medical/genetics", "/area/medical", {
	name: "Genetics Lab",
	icon_state: "genetics",
});
rt.type(13335, "/area/medical/genetics/cloning", "/area/medical/genetics", {
	name: "Cloning Lab",
	icon_state: "cloning",
});
rt.type(13336, "/area/medical/sleeper", "/area/medical", {
	name: "Medbay Treatment Center",
	icon_state: "exam_room",
});
rt.type(13337, "/area/security", "/area", {
	name: "Security",
	icon_state: "security",
});
rt.type(13338, "/area/security/main", "/area/security", {
	name: "Security Office",
	icon_state: "security",
});
rt.type(13339, "/area/security/brig", "/area/security", {
	name: "Brig",
	icon_state: "brig",
});
rt.type(13340, "/area/security/courtroom", "/area/security", {
	name: "Courtroom",
	icon_state: "courtroom",
});
rt.type(13341, "/area/security/prison", "/area/security", {
	name: "Prison Wing",
	icon_state: "sec_prison",
});
rt.type(13342, "/area/security/processing", "/area/security", {
	name: "Labor Shuttle Dock",
	icon_state: "sec_prison",
});
rt.type(13343, "/area/security/processing/cremation", "/area/security/processing", {
	name: "Security Crematorium",
	icon_state: "sec_prison",
});
rt.type(13344, "/area/security/warden", "/area/security", {
	name: "Brig Control",
	icon_state: "Warden",
});
rt.type(13345, "/area/security/armory", "/area/security", {
	name: "Armory",
	icon_state: "armory",
});
rt.type(13346, "/area/security/detectives_office", "/area/security", {
	ambientsounds: null,
	name: "Detective's Office",
	icon_state: "detective",
});
rt.type(13347, "/area/security/detectives_office/private_investigators_office", "/area/security/detectives_office", {
	ambientsounds: null,
	name: "Private Investigator's Office",
	icon_state: "detective",
});
rt.type(13348, "/area/security/range", "/area/security", {
	name: "Firing Range",
	icon_state: "firingrange",
});
rt.type(13349, "/area/security/transfer", "/area/security", {
	name: "Transfer Centre",
	icon_state: "execution_room",
});
rt.type(13350, "/area/security/nuke_storage", "/area/security", {
	name: "Vault",
	icon_state: "nuke_storage",
});
rt.type(13351, "/area/security/checkpoint", "/area/security", {
	name: "Security Checkpoint",
	icon_state: "checkpoint1",
});
rt.type(13352, "/area/security/checkpoint/checkpoint2", "/area/security/checkpoint", {
	name: "Security Checkpoint",
	icon_state: "security",
});
rt.type(13353, "/area/security/checkpoint/supply", "/area/security/checkpoint", {
	name: "Security Post - Cargo Bay",
	icon_state: "checkpoint1",
});
rt.type(13354, "/area/security/checkpoint/engineering", "/area/security/checkpoint", {
	name: "Security Post - Engineering",
	icon_state: "checkpoint1",
});
rt.type(13355, "/area/security/checkpoint/medical", "/area/security/checkpoint", {
	name: "Security Post - Medbay",
	icon_state: "checkpoint1",
});
rt.type(13356, "/area/security/checkpoint/science", "/area/security/checkpoint", {
	name: "Security Post - Science",
	icon_state: "checkpoint1",
});
rt.type(13357, "/area/security/checkpoint/science/research", "/area/security/checkpoint/science", {
	name: "Security Post - Research Division",
	icon_state: "checkpoint1",
});
rt.type(13358, "/area/security/checkpoint/customs", "/area/security/checkpoint", {
	name: "Customs",
	icon_state: "bridge",
});
rt.type(13359, "/area/security/vacantoffice", "/area/security", {
	name: "Vacant Office",
	icon_state: "security",
});
rt.type(13360, "/area/security/vacantoffice/a", "/area/security/vacantoffice", {
	name: "Vacant Office A",
	icon_state: "security",
});
rt.type(13361, "/area/security/vacantoffice/b", "/area/security/vacantoffice", {
	name: "Vacant Office B",
	icon_state: "security",
});
rt.type(13362, "/area/quartermaster", "/area", {
	name: "Quartermasters",
	icon_state: "quart",
});
rt.type(13363, "/area/quartermaster/sorting", "/area/quartermaster", {
	name: "Delivery Office",
	icon_state: "cargo_delivery",
});
rt.type(13364, "/area/quartermaster/warehouse", "/area/quartermaster", {
	name: "Warehouse",
	icon_state: "cargo_warehouse",
});
rt.type(13365, "/area/quartermaster/office", "/area/quartermaster", {
	name: "Cargo Office",
	icon_state: "quartoffice",
});
rt.type(13366, "/area/quartermaster/storage", "/area/quartermaster", {
	name: "Cargo Bay",
	icon_state: "cargo_bay",
});
rt.type(13367, "/area/quartermaster/qm", "/area/quartermaster", {
	name: "Quartermaster's Office",
	icon_state: "quart",
});
rt.type(13368, "/area/quartermaster/qm/private", "/area/quartermaster/qm", {
	name: "Quartermaster's Private Quarters",
	icon_state: "quart",
});
rt.type(13369, "/area/quartermaster/miningdock", "/area/quartermaster", {
	name: "Mining Dock",
	icon_state: "mining",
});
rt.type(13370, "/area/quartermaster/miningdock/abandoned", "/area/quartermaster/miningdock", {
	name: "Abandoned Mining Dock",
	icon_state: "mining",
});
rt.type(13371, "/area/quartermaster/miningoffice", "/area/quartermaster", {
	name: "Mining Office",
	icon_state: "mining",
});
rt.type(13372, "/area/quartermaster/miningstorage", "/area/quartermaster", {
	name: "Mining Storage",
	icon_state: "mining",
});
rt.type(13373, "/area/janitor", "/area", {
	flags: 0,
	name: "Custodial Closet",
	icon_state: "janitor",
});
rt.type(13374, "/area/hydroponics", "/area", {
	name: "Hydroponics",
	icon_state: "hydro",
});
rt.type(13375, "/area/hydroponics/garden", "/area/hydroponics", {
	name: "Garden",
	icon_state: "garden",
});
rt.type(13376, "/area/hydroponics/garden/abandoned", "/area/hydroponics/garden", {
	name: "Abandoned Garden",
	icon_state: "abandoned_garden",
});
rt.type(13377, "/area/hydroponics/garden/monastery", "/area/hydroponics/garden", {
	name: "Monastery Garden",
	icon_state: "hydro",
});
rt.type(13378, "/area/science", "/area", {
	name: "Science Division",
	icon_state: "toxlab",
});
rt.type(13379, "/area/science/lab", "/area/science", {
	name: "Research and Development",
	icon_state: "toxlab",
});
rt.type(13380, "/area/science/xenobiology", "/area/science", {
	name: "Xenobiology Lab",
	icon_state: "toxlab",
});
rt.type(13381, "/area/science/storage", "/area/science", {
	name: "Toxins Storage",
	icon_state: "toxstorage",
});
rt.type(13382, "/area/science/mineral_storeroom", "/area/science", {
	name: "Mineral Storeroom",
	icon_state: "toxmisc",
});
rt.type(13383, "/area/science/test_area", "/area/science", {
	valid_territory: 0,
	name: "Toxins Test Area",
	icon_state: "toxtest",
});
rt.type(13384, "/area/science/mixing", "/area/science", {
	name: "Toxins Mixing Lab",
	icon_state: "toxmix",
});
rt.type(13385, "/area/science/misc_lab", "/area/science", {
	name: "Testing Lab",
	icon_state: "toxmisc",
});
rt.type(13386, "/area/science/misc_lab/range", "/area/science/misc_lab", {
	name: "Research Testing Range",
	icon_state: "toxmisc",
});
rt.type(13387, "/area/science/server", "/area/science", {
	name: "Research Division Server Room",
	icon_state: "server",
});
rt.type(13388, "/area/science/explab", "/area/science", {
	name: "Experimentation Lab",
	icon_state: "toxmisc",
});
rt.type(13389, "/area/science/robotics", "/area/science", {
	name: "Robotics",
	icon_state: "medresearch",
});
rt.type(13390, "/area/science/robotics/mechbay", "/area/science/robotics", {
	name: "Mech Bay",
	icon_state: "mechbay",
});
rt.type(13391, "/area/science/robotics/mechbay_cargo", "/area/science/robotics", {
	name: "Mech Bay",
	icon_state: "yellow",
});
rt.type(13392, "/area/science/robotics/showroom", "/area/science/robotics", {
	name: "Robotics Showroom",
	icon_state: "showroom",
});
rt.type(13393, "/area/science/robotics/lab", "/area/science/robotics", {
	name: "Robotics Lab",
	icon_state: "ass_line",
});
rt.type(13394, "/area/science/research", "/area/science", {
	name: "Research Division",
	icon_state: "medresearch",
});
rt.type(13395, "/area/science/research/lobby", "/area/science/research", {
	name: "Research Division Lobby",
	icon_state: "medresearch",
});
rt.type(13396, "/area/science/research/abandoned", "/area/science/research", {
	name: "Abandoned Research Lab",
	icon_state: "medresearch",
});
rt.type(13397, "/area/storage", "/area", {});
rt.type(13398, "/area/storage/tools", "/area/storage", {
	name: "Auxiliary Tool Storage",
	icon_state: "storage",
});
rt.type(13399, "/area/storage/primary", "/area/storage", {
	name: "Primary Tool Storage",
	icon_state: "primarystorage",
});
rt.type(13400, "/area/storage/autolathe", "/area/storage", {
	name: "Autolathe Storage",
	icon_state: "storage",
});
rt.type(13401, "/area/storage/art", "/area/storage", {
	name: "Art Supply Storage",
	icon_state: "storage",
});
rt.type(13402, "/area/storage/auxiliary", "/area/storage", {
	name: "Auxiliary Storage",
	icon_state: "auxstorage",
});
rt.type(13403, "/area/storage/atmos", "/area/storage", {
	valid_territory: 0,
	name: "Atmospherics Storage",
	icon_state: "atmos",
});
rt.type(13404, "/area/storage/tcom", "/area/storage", {
	valid_territory: 0,
	name: "Telecoms Storage",
	icon_state: "green",
});
rt.type(13405, "/area/storage/eva", "/area/storage", {
	name: "EVA Storage",
	icon_state: "eva",
});
rt.type(13406, "/area/storage/secure", "/area/storage", {
	name: "Secure Storage",
	icon_state: "storage",
});
rt.type(13407, "/area/storage/emergency", "/area/storage", {});
rt.type(13408, "/area/storage/emergency/starboard", "/area/storage/emergency", {
	name: "Starboard Emergency Storage",
	icon_state: "emergencystorage",
});
rt.type(13409, "/area/storage/emergency/port", "/area/storage/emergency", {
	name: "Port Emergency Storage",
	icon_state: "emergencystorage",
});
rt.type(13410, "/area/storage/tech", "/area/storage", {
	name: "Technical Storage",
	icon_state: "auxstorage",
});
rt.type(13411, "/area/storage/testroom", "/area/storage", {
	requires_power: 0,
	name: "Test Room",
	icon_state: "storage",
});
rt.type(13412, "/area/construction", "/area", {
	name: "Construction Area",
	icon_state: "yellow",
});
rt.type(13413, "/area/construction/minisat_exterior", "/area/construction", {
	name: "Minisat Exterior",
	icon_state: "yellow",
});
rt.type(13414, "/area/construction/mining", "/area/construction", {});
rt.type(13415, "/area/construction/mining/aux_base", "/area/construction/mining", {
	name: "Auxiliary Base Construction",
	icon_state: "yellow",
});
rt.type(13416, "/area/construction/mining/aux_base/closet", "/area/construction/mining/aux_base", {
	name: "Auxiliary Closet Construction",
	icon_state: "yellow",
});
rt.type(13417, "/area/construction/supplyshuttle", "/area/construction", {
	name: "Supply Shuttle",
	icon_state: "yellow",
});
rt.type(13418, "/area/construction/quarters", "/area/construction", {
	name: "Engineers' Quarters",
	icon_state: "yellow",
});
rt.type(13419, "/area/construction/qmaint", "/area/construction", {
	name: "Maintenance",
	icon_state: "yellow",
});
rt.type(13420, "/area/construction/hallway", "/area/construction", {
	name: "Hallway",
	icon_state: "yellow",
});
rt.type(13421, "/area/construction/solars", "/area/construction", {
	name: "Solar Panels",
	icon_state: "yellow",
});
rt.type(13422, "/area/construction/solarscontrol", "/area/construction", {
	name: "Solar Panel Control",
	icon_state: "yellow",
});
rt.type(13423, "/area/construction/storage", "/area/construction", {
	name: "Construction Site Storage",
	icon_state: "yellow",
});
rt.type(13424, "/area/construction/storage/wing", "/area/construction/storage", {
	name: "Storage Wing",
	icon_state: "storage_wing",
});
rt.type(13425, "/area/aisat", "/area", {
	name: "AI Satellite Exterior",
	icon_state: "yellow",
});
rt.type(13426, "/area/tcommsat", "/area", {
	ambientsounds: null,
});
rt.type(13427, "/area/tcommsat/entrance", "/area/tcommsat", {
	name: "Telecoms Teleporter",
	icon_state: "tcomsatentrance",
});
rt.type(13428, "/area/tcommsat/chamber", "/area/tcommsat", {
	name: "Abandoned Satellite",
	icon_state: "tcomsatcham",
});
rt.type(13429, "/area/tcommsat/computer", "/area/tcommsat", {
	name: "Telecoms Control Room",
	icon_state: "tcomsatcomp",
});
rt.type(13430, "/area/tcommsat/server", "/area/tcommsat", {
	name: "Telecoms Server Room",
	icon_state: "tcomsatcham",
});
rt.type(13431, "/area/tcommsat/lounge", "/area/tcommsat", {
	name: "Telecommunications Satellite Lounge",
	icon_state: "tcomsatlounge",
});
rt.type(13432, "/area/awaymission", "/area", {
	has_gravity: 1,
	name: "Strange Location",
	icon_state: "away",
});
rt.type(13433, "/area/awaymission/example", "/area/awaymission", {
	name: "Strange Station",
	icon_state: "away",
});
rt.type(13434, "/area/awaymission/desert", "/area/awaymission", {
	name: "Mars",
	icon_state: "away",
});
rt.type(13435, "/area/awaymission/listeningpost", "/area/awaymission", {
	requires_power: 0,
	name: "Listening Post",
	icon_state: "away",
});
rt.type(13436, "/area/awaymission/beach", "/area/awaymission", {
	requires_power: 0,
	has_gravity: 1,
	ambientsounds: null,
	name: "Beach",
	icon_state: "away",
	dynamic_lighting: 0,
});
rt.type(13437, "/area/awaymission/errorroom", "/area/awaymission", {
	has_gravity: 1,
	name: "Super Secret Room",
	dynamic_lighting: 0,
});
rt.type(13438, "/area/awaymission/research", "/area/awaymission", {
	name: "Research Outpost",
	icon_state: "away",
	dynamic_lighting: 1,
});
rt.type(13439, "/area/awaymission/research/interior", "/area/awaymission/research", {
	requires_power: 1,
	name: "Research Inside",
	icon_state: "away2",
});
rt.type(13440, "/area/awaymission/research/interior/cryo", "/area/awaymission/research/interior", {
	name: "Research Cryostasis Room",
	icon_state: "medbay",
});
rt.type(13441, "/area/awaymission/research/interior/clonestorage", "/area/awaymission/research/interior", {
	name: "Research Clone Storage",
	icon_state: "cloning",
});
rt.type(13442, "/area/awaymission/research/interior/genetics", "/area/awaymission/research/interior", {
	name: "Research Genetics Research",
	icon_state: "genetics",
});
rt.type(13443, "/area/awaymission/research/interior/engineering", "/area/awaymission/research/interior", {
	name: "Research Engineering",
	icon_state: "engine",
});
rt.type(13444, "/area/awaymission/research/interior/security", "/area/awaymission/research/interior", {
	name: "Research Security",
	icon_state: "security",
});
rt.type(13445, "/area/awaymission/research/interior/secure", "/area/awaymission/research/interior", {
	name: "Research Secure Vault",
});
rt.type(13446, "/area/awaymission/research/interior/maint", "/area/awaymission/research/interior", {
	name: "Research Maintenance",
	icon_state: "maintcentral",
});
rt.type(13447, "/area/awaymission/research/interior/dorm", "/area/awaymission/research/interior", {
	name: "Research Dorms",
	icon_state: "Sleep",
});
rt.type(13448, "/area/awaymission/research/interior/escapepods", "/area/awaymission/research/interior", {
	name: "Research Escape Wing",
	icon_state: "exit",
});
rt.type(13449, "/area/awaymission/research/interior/gateway", "/area/awaymission/research/interior", {
	name: "Research Gateway",
	icon_state: "start",
});
rt.type(13450, "/area/awaymission/research/interior/bathroom", "/area/awaymission/research/interior", {
	name: "Research Bathrooms",
	icon_state: "restrooms",
});
rt.type(13451, "/area/awaymission/research/interior/medbay", "/area/awaymission/research/interior", {
	name: "Research Medbay",
	icon_state: "medbay",
});
rt.type(13452, "/area/awaymission/research/exterior", "/area/awaymission/research", {
	name: "Research Exterior",
	icon_state: "unknown",
});
rt.type(13453, "/area/awaymission/challenge", "/area/awaymission", {});
rt.type(13454, "/area/awaymission/challenge/start", "/area/awaymission/challenge", {
	name: "Where Am I?",
	icon_state: "away",
});
rt.type(13455, "/area/awaymission/challenge/main", "/area/awaymission/challenge", {
	requires_power: 0,
	name: "Danger Room",
	icon_state: "away1",
});
rt.type(13456, "/area/awaymission/challenge/end", "/area/awaymission/challenge", {
	requires_power: 0,
	name: "Administration",
	icon_state: "away2",
});
rt.type(13457, "/area/awaymission/centcomAway", "/area/awaymission", {
	requires_power: 0,
	name: "XCC-P5831",
	icon_state: "away",
});
rt.type(13458, "/area/awaymission/centcomAway/general", "/area/awaymission/centcomAway", {
	music: rt.rsc("sound/ambience/ambigen3.ogg"),
	name: "XCC-P5831",
});
rt.type(13459, "/area/awaymission/centcomAway/maint", "/area/awaymission/centcomAway", {
	music: rt.rsc("sound/ambience/ambisin1.ogg"),
	name: "XCC-P5831 Maintenance",
	icon_state: "away1",
});
rt.type(13460, "/area/awaymission/centcomAway/thunderdome", "/area/awaymission/centcomAway", {
	music: rt.rsc("sound/ambience/ambisin2.ogg"),
	name: "XCC-P5831 Thunderdome",
	icon_state: "away2",
});
rt.type(13461, "/area/awaymission/centcomAway/cafe", "/area/awaymission/centcomAway", {
	music: rt.rsc("sound/ambience/ambisin3.ogg"),
	name: "XCC-P5831 Kitchen Arena",
	icon_state: "away3",
});
rt.type(13462, "/area/awaymission/centcomAway/courtroom", "/area/awaymission/centcomAway", {
	music: rt.rsc("sound/ambience/ambisin4.ogg"),
	name: "XCC-P5831 Courtroom",
	icon_state: "away4",
});
rt.type(13463, "/area/awaymission/centcomAway/hangar", "/area/awaymission/centcomAway", {
	music: rt.rsc("sound/ambience/ambigen5.ogg"),
	name: "XCC-P5831 Hangars",
	icon_state: "away4",
});
rt.type(13464, "/area/awaymission/snowforest", "/area/awaymission", {
	requires_power: 0,
	name: "Snow Forest",
	icon_state: "away",
	dynamic_lighting: 1,
});
rt.type(13465, "/area/awaymission/snowforest/lumbermill", "/area/awaymission/snowforest", {
	name: "Lumbermill",
	icon_state: "away3",
});
rt.type(13466, "/area/awaymission/cabin", "/area/awaymission", {
	requires_power: 1,
	name: "Cabin",
	icon_state: "away2",
	dynamic_lighting: 1,
});
rt.type(13467, "/area/awaymission/BMPship", "/area/awaymission", {
	name: "BMP Asteroids",
	icon_state: "away",
});
rt.type(13468, "/area/awaymission/BMPship/Aft", "/area/awaymission/BMPship", {
	requires_power: 1,
	name: "Aft Block",
	icon_state: "away1",
});
rt.type(13469, "/area/awaymission/BMPship/Midship", "/area/awaymission/BMPship", {
	requires_power: 1,
	name: "Midship Block",
	icon_state: "away2",
});
rt.type(13470, "/area/awaymission/BMPship/Fore", "/area/awaymission/BMPship", {
	requires_power: 1,
	name: "Fore Block",
	icon_state: "away3",
});
rt.type(13471, "/area/awaymission/academy", "/area/awaymission", {
	name: "Academy Asteroids",
	icon_state: "away",
});
rt.type(13472, "/area/awaymission/academy/headmaster", "/area/awaymission/academy", {
	name: "Academy Fore Block",
	icon_state: "away1",
});
rt.type(13473, "/area/awaymission/academy/classrooms", "/area/awaymission/academy", {
	name: "Academy Classroom Block",
	icon_state: "away2",
});
rt.type(13474, "/area/awaymission/academy/academyaft", "/area/awaymission/academy", {
	name: "Academy Ship Aft Block",
	icon_state: "away3",
});
rt.type(13475, "/area/awaymission/academy/academygate", "/area/awaymission/academy", {
	name: "Academy Gateway",
	icon_state: "away4",
});
rt.type(13476, "/area/awaymission/academy/academycellar", "/area/awaymission/academy", {
	name: "Academy Cellar",
	icon_state: "away4",
});
rt.type(13477, "/area/awaymission/academy/academyengine", "/area/awaymission/academy", {
	name: "Academy Engine",
	icon_state: "away4",
});
rt.type(13478, "/area/awaymission/wwmines", "/area/awaymission", {
	requires_power: 0,
	name: "Wild West Mines",
	icon_state: "away1",
});
rt.type(13479, "/area/awaymission/wwgov", "/area/awaymission", {
	requires_power: 0,
	name: "Wild West Mansion",
	icon_state: "away2",
});
rt.type(13480, "/area/awaymission/wwrefine", "/area/awaymission", {
	requires_power: 0,
	name: "Wild West Refinery",
	icon_state: "away3",
});
rt.type(13481, "/area/awaymission/wwvault", "/area/awaymission", {
	name: "Wild West Vault",
	icon_state: "away3",
});
rt.type(13482, "/area/awaymission/wwvaultdoors", "/area/awaymission", {
	requires_power: 0,
	name: "Wild West Vault Doors",
	icon_state: "away2",
});
rt.type(13483, "/area/awaymission/gateroom", "/area/awaymission", {});
rt.type(13484, "/area/awaymission/southblock", "/area/awaymission", {});
rt.type(13485, "/area/awaymission/arrivalblock", "/area/awaymission", {});
rt.type(13486, "/area/awaymission/midblock", "/area/awaymission", {});
rt.type(13487, "/area/awaymission/northblock", "/area/awaymission", {});
rt.type(13488, "/area/awaymission/syndishuttle", "/area/awaymission", {});
rt.type(13489, "/area/awaymission/spacebattle", "/area/awaymission", {
	requires_power: 0,
	name: "Space Battle",
	icon_state: "away",
});
rt.type(13490, "/area/awaymission/spacebattle/cruiser", "/area/awaymission/spacebattle", {
	name: "Nanotrasen Cruiser",
});
rt.type(13491, "/area/awaymission/spacebattle/syndicate1", "/area/awaymission/spacebattle", {
	name: "Syndicate Assault Ship 1",
});
rt.type(13492, "/area/awaymission/spacebattle/syndicate2", "/area/awaymission/spacebattle", {
	name: "Syndicate Assault Ship 2",
});
rt.type(13493, "/area/awaymission/spacebattle/syndicate3", "/area/awaymission/spacebattle", {
	name: "Syndicate Assault Ship 3",
});
rt.type(13494, "/area/awaymission/spacebattle/syndicate4", "/area/awaymission/spacebattle", {
	name: "Syndicate War Sphere 1",
});
rt.type(13495, "/area/awaymission/spacebattle/syndicate5", "/area/awaymission/spacebattle", {
	name: "Syndicate War Sphere 2",
});
rt.type(13496, "/area/awaymission/spacebattle/syndicate6", "/area/awaymission/spacebattle", {
	name: "Syndicate War Sphere 3",
});
rt.type(13497, "/area/awaymission/spacebattle/syndicate7", "/area/awaymission/spacebattle", {
	name: "Syndicate Fighter",
});
rt.type(13498, "/area/awaymission/spacebattle/secret", "/area/awaymission/spacebattle", {
	name: "Hidden Chamber",
});
rt.type(13499, "/area/awaymission/snowdin", "/area/awaymission", {
	requires_power: 0,
	name: "Snowdin Tundra Plains",
	icon_state: "away",
	dynamic_lighting: 1,
});
rt.type(13500, "/area/awaymission/snowdin/post", "/area/awaymission/snowdin", {
	requires_power: 1,
	name: "Snowdin Outpost",
});
rt.type(13501, "/area/awaymission/snowdin/igloo", "/area/awaymission/snowdin", {
	name: "Snowdin Igloos",
	icon_state: "away2",
});
rt.type(13502, "/area/awaymission/snowdin/cave", "/area/awaymission/snowdin", {
	name: "Snowdin Caves",
	icon_state: "away2",
});
rt.type(13503, "/area/awaymission/snowdin/base", "/area/awaymission/snowdin", {
	requires_power: 1,
	name: "Snowdin Main Base",
	icon_state: "away3",
});
rt.type(13504, "/area/awaymission/snowdin/dungeon1", "/area/awaymission/snowdin", {
	name: "Snowdin Depths",
	icon_state: "away2",
});
rt.type(13505, "/area/awaymission/snowdin/sekret", "/area/awaymission/snowdin", {
	requires_power: 1,
	name: "Snowdin Operations",
	icon_state: "away3",
});
rt.type(13506, "/area/awaycontent", "/area", {
	name: "space",
});
rt.type(13507, "/area/awaycontent/a1", "/area/awaycontent", {
	icon_state: "awaycontent1",
});
rt.type(13508, "/area/awaycontent/a2", "/area/awaycontent", {
	icon_state: "awaycontent2",
});
rt.type(13509, "/area/awaycontent/a3", "/area/awaycontent", {
	icon_state: "awaycontent3",
});
rt.type(13510, "/area/awaycontent/a4", "/area/awaycontent", {
	icon_state: "awaycontent4",
});
rt.type(13511, "/area/awaycontent/a5", "/area/awaycontent", {
	icon_state: "awaycontent5",
});
rt.type(13512, "/area/awaycontent/a6", "/area/awaycontent", {
	icon_state: "awaycontent6",
});
rt.type(13513, "/area/awaycontent/a7", "/area/awaycontent", {
	icon_state: "awaycontent7",
});
rt.type(13514, "/area/awaycontent/a8", "/area/awaycontent", {
	icon_state: "awaycontent8",
});
rt.type(13515, "/area/awaycontent/a9", "/area/awaycontent", {
	icon_state: "awaycontent9",
});
rt.type(13516, "/area/awaycontent/a10", "/area/awaycontent", {
	icon_state: "awaycontent10",
});
rt.type(13517, "/area/awaycontent/a11", "/area/awaycontent", {
	icon_state: "awaycontent12",
});
rt.type(13518, "/area/awaycontent/a12", "/area/awaycontent", {
	icon_state: "awaycontent13",
});
rt.type(13519, "/area/awaycontent/a13", "/area/awaycontent", {
	icon_state: "awaycontent14",
});
rt.type(13520, "/area/awaycontent/a14", "/area/awaycontent", {
	icon_state: "awaycontent14",
});
rt.type(13521, "/area/awaycontent/a15", "/area/awaycontent", {
	icon_state: "awaycontent15",
});
rt.type(13522, "/area/awaycontent/a16", "/area/awaycontent", {
	icon_state: "awaycontent16",
});
rt.type(13523, "/area/awaycontent/a17", "/area/awaycontent", {
	icon_state: "awaycontent17",
});
rt.type(13524, "/area/awaycontent/a18", "/area/awaycontent", {
	icon_state: "awaycontent18",
});
rt.type(13525, "/area/awaycontent/a19", "/area/awaycontent", {
	icon_state: "awaycontent19",
});
rt.type(13526, "/area/awaycontent/a20", "/area/awaycontent", {
	icon_state: "awaycontent20",
});
rt.type(13527, "/area/awaycontent/a21", "/area/awaycontent", {
	icon_state: "awaycontent21",
});
rt.type(13528, "/area/awaycontent/a22", "/area/awaycontent", {
	icon_state: "awaycontent22",
});
rt.type(13529, "/area/awaycontent/a23", "/area/awaycontent", {
	icon_state: "awaycontent23",
});
rt.type(13530, "/area/awaycontent/a24", "/area/awaycontent", {
	icon_state: "awaycontent24",
});
rt.type(13531, "/area/awaycontent/a25", "/area/awaycontent", {
	icon_state: "awaycontent25",
});
rt.type(13532, "/area/awaycontent/a26", "/area/awaycontent", {
	icon_state: "awaycontent26",
});
rt.type(13533, "/area/awaycontent/a27", "/area/awaycontent", {
	icon_state: "awaycontent27",
});
rt.type(13534, "/area/awaycontent/a28", "/area/awaycontent", {
	icon_state: "awaycontent28",
});
rt.type(13535, "/area/awaycontent/a29", "/area/awaycontent", {
	icon_state: "awaycontent29",
});
rt.type(13536, "/area/awaycontent/a30", "/area/awaycontent", {
	icon_state: "awaycontent30",
});
rt.type(13537, "/area/centcom", "/area", {
	requires_power: 0,
	has_gravity: 1,
	noteleport: 1,
	blob_allowed: 0,
	flags: 0,
	name: "Centcom",
	icon_state: "centcom",
	dynamic_lighting: 2,
});
rt.type(13538, "/area/centcom/control", "/area/centcom", {
	name: "Centcom Docks",
});
rt.type(13539, "/area/centcom/evac", "/area/centcom", {
	name: "Centcom Recovery Ship",
});
rt.type(13540, "/area/centcom/supply", "/area/centcom", {
	name: "Centcom Supply Shuttle Dock",
});
rt.type(13541, "/area/centcom/ferry", "/area/centcom", {
	name: "Centcom Transport Shuttle Dock",
});
rt.type(13542, "/area/centcom/prison", "/area/centcom", {
	name: "Admin Prison",
});
rt.type(13543, "/area/centcom/holding", "/area/centcom", {
	name: "Holding Facility",
});
rt.type(13544, "/area/tdome", "/area", {
	requires_power: 0,
	has_gravity: 1,
	flags: 0,
	name: "Thunderdome",
	icon_state: "yellow",
	dynamic_lighting: 2,
});
rt.type(13545, "/area/tdome/arena", "/area/tdome", {
	name: "Thunderdome Arena",
	icon_state: "thunder",
	dynamic_lighting: 0,
});
rt.type(13546, "/area/tdome/arena_source", "/area/tdome", {
	name: "Thunderdome Arena Template",
	icon_state: "thunder",
	dynamic_lighting: 0,
});
rt.type(13547, "/area/tdome/tdome1", "/area/tdome", {
	name: "Thunderdome (Team 1)",
	icon_state: "green",
});
rt.type(13548, "/area/tdome/tdome2", "/area/tdome", {
	name: "Thunderdome (Team 2)",
	icon_state: "green",
});
rt.type(13549, "/area/tdome/tdomeadmin", "/area/tdome", {
	name: "Thunderdome (Admin.)",
	icon_state: "purple",
});
rt.type(13550, "/area/tdome/tdomeobserve", "/area/tdome", {
	name: "Thunderdome (Observer.)",
	icon_state: "purple",
});
rt.type(13551, "/area/wizard_station", "/area", {
	requires_power: 0,
	has_gravity: 1,
	noteleport: 1,
	flags: 0,
	name: "Wizard's Den",
	icon_state: "yellow",
	dynamic_lighting: 2,
});
rt.type(13552, "/area/abductor_ship", "/area", {
	requires_power: 0,
	noteleport: 1,
	has_gravity: 1,
	flags: 0,
	name: "Abductor Ship",
	icon_state: "yellow",
});
rt.type(13553, "/area/syndicate_mothership", "/area", {
	requires_power: 0,
	has_gravity: 1,
	noteleport: 1,
	blob_allowed: 0,
	flags: 0,
	name: "Syndicate Mothership",
	icon_state: "syndie-ship",
});
rt.type(13554, "/area/syndicate_mothership/control", "/area/syndicate_mothership", {
	name: "Syndicate Control Room",
	icon_state: "syndie-control",
	dynamic_lighting: 2,
});
rt.type(13555, "/area/syndicate_mothership/elite_squad", "/area/syndicate_mothership", {
	name: "Syndicate Elite Squad",
	icon_state: "syndie-elite",
});
rt.type(13556, "/area/ctf", "/area", {
	requires_power: 0,
	has_gravity: 1,
	flags: 16,
	name: "Capture the Flag",
	icon_state: "yellow",
});
rt.type(13557, "/area/ctf/control_room", "/area/ctf", {
	name: "Control Room A",
});
rt.type(13558, "/area/ctf/control_room2", "/area/ctf", {
	name: "Control Room B",
});
rt.type(13559, "/area/ctf/central", "/area/ctf", {
	name: "Central",
});
rt.type(13560, "/area/ctf/main_hall", "/area/ctf", {
	name: "Main Hall A",
});
rt.type(13561, "/area/ctf/main_hall2", "/area/ctf", {
	name: "Main Hall B",
});
rt.type(13562, "/area/ctf/corridor", "/area/ctf", {
	name: "Corridor A",
});
rt.type(13563, "/area/ctf/corridor2", "/area/ctf", {
	name: "Corridor B",
});
rt.type(13564, "/area/ctf/flag_room", "/area/ctf", {
	name: "Flag Room A",
});
rt.type(13565, "/area/ctf/flag_room2", "/area/ctf", {
	name: "Flag Room B",
});
rt.type(13566, "/area/derelict", "/area", {
	blob_allowed: 0,
	name: "Derelict Station",
	icon_state: "storage",
});
rt.type(13567, "/area/derelict/hallway", "/area/derelict", {});
rt.type(13568, "/area/derelict/hallway/primary", "/area/derelict/hallway", {
	name: "Derelict Primary Hallway",
	icon_state: "hallP",
});
rt.type(13569, "/area/derelict/hallway/secondary", "/area/derelict/hallway", {
	name: "Derelict Secondary Hallway",
	icon_state: "hallS",
});
rt.type(13570, "/area/derelict/arrival", "/area/derelict", {
	name: "Derelict Arrival Centre",
	icon_state: "yellow",
});
rt.type(13571, "/area/derelict/storage", "/area/derelict", {});
rt.type(13572, "/area/derelict/storage/equipment", "/area/derelict/storage", {
	name: "Derelict Equipment Storage",
});
rt.type(13573, "/area/derelict/storage/storage_access", "/area/derelict/storage", {
	name: "Derelict Storage Access",
});
rt.type(13574, "/area/derelict/storage/engine_storage", "/area/derelict/storage", {
	name: "Derelict Engine Storage",
	icon_state: "green",
});
rt.type(13575, "/area/derelict/bridge", "/area/derelict", {
	name: "Derelict Control Room",
	icon_state: "bridge",
});
rt.type(13576, "/area/derelict/bridge/access", "/area/derelict/bridge", {
	name: "Derelict Control Room Access",
	icon_state: "auxstorage",
});
rt.type(13577, "/area/derelict/bridge/ai_upload", "/area/derelict/bridge", {
	name: "Derelict Computer Core",
	icon_state: "ai",
});
rt.type(13578, "/area/derelict/secret", "/area/derelict", {
	name: "Derelict Secret Room",
	icon_state: "library",
});
rt.type(13579, "/area/derelict/solar_control", "/area/derelict", {
	name: "Derelict Solar Control",
	icon_state: "engine",
});
rt.type(13580, "/area/derelict/se_solar", "/area/derelict", {
	name: "South East Solars",
	icon_state: "engine",
});
rt.type(13581, "/area/derelict/crew_quarters", "/area/derelict", {
	name: "Derelict Crew Quarters",
	icon_state: "fitness",
});
rt.type(13582, "/area/derelict/medical", "/area/derelict", {
	name: "Derelict Medbay",
	icon_state: "medbay",
});
rt.type(13583, "/area/derelict/medical/morgue", "/area/derelict/medical", {
	name: "Derelict Morgue",
	icon_state: "morgue",
});
rt.type(13584, "/area/derelict/medical/chapel", "/area/derelict/medical", {
	name: "Derelict Chapel",
	icon_state: "chapel",
});
rt.type(13585, "/area/derelict/teleporter", "/area/derelict", {
	name: "Derelict Teleporter",
	icon_state: "teleporter",
});
rt.type(13586, "/area/derelict/eva", "/area/derelict", {
	name: "Derelict EVA Storage",
	icon_state: "eva",
});
rt.type(13587, "/area/derelict/ship", "/area/derelict", {
	name: "Abandoned Ship",
	icon_state: "yellow",
});
rt.type(13588, "/area/derelict/singularity_engine", "/area/derelict", {
	name: "Derelict Singularity Engine",
	icon_state: "engine",
});
rt.type(13589, "/area/derelict/gravity_generator", "/area/derelict", {
	name: "Derelict Gravity Generator Room",
	icon_state: "red",
});
rt.type(13590, "/area/derelict/atmospherics", "/area/derelict", {
	name: "Derelict Atmospherics",
	icon_state: "red",
});
rt.type(13591, "/area/djstation", "/area", {
	has_gravity: 1,
	blob_allowed: 0,
	name: "Ruskie DJ Station",
	icon_state: "DJ",
});
rt.type(13592, "/area/djstation/solars", "/area/djstation", {
	has_gravity: 1,
	name: "DJ Station Solars",
	icon_state: "DJ",
});
rt.type(13617, "/area/mine", "/area", {
	has_gravity: 1,
	icon_state: "mining",
});
rt.type(13620, "/area/mine/lobby", "/area/mine", {
	name: "Mining Station",
});
rt.type(13621, "/area/mine/storage", "/area/mine", {
	name: "Mining Station Storage",
});
rt.type(13622, "/area/mine/production", "/area/mine", {
	name: "Mining Station Starboard Wing",
	icon_state: "mining_production",
});
rt.type(13623, "/area/mine/abandoned", "/area/mine", {
	name: "Abandoned Mining Station",
});
rt.type(13624, "/area/mine/living_quarters", "/area/mine", {
	name: "Mining Station Port Wing",
	icon_state: "mining_living",
});
rt.type(13625, "/area/mine/eva", "/area/mine", {
	name: "Mining Station EVA",
	icon_state: "mining_eva",
});
rt.type(13626, "/area/mine/maintenance", "/area/mine", {
	name: "Mining Station Communications",
});
rt.type(13627, "/area/mine/cafeteria", "/area/mine", {
	name: "Mining Station Cafeteria",
});
rt.type(13628, "/area/mine/hydroponics", "/area/mine", {
	name: "Mining Station Hydroponics",
});
rt.type(13629, "/area/mine/sleeper", "/area/mine", {
	name: "Mining Station Emergency Sleeper",
});
rt.type(13630, "/area/mine/north_outpost", "/area/mine", {
	name: "North Mining Outpost",
});
rt.type(13631, "/area/mine/west_outpost", "/area/mine", {
	name: "West Mining Outpost",
});
rt.type(13632, "/area/mine/laborcamp", "/area/mine", {
	name: "Labor Camp",
});
rt.type(13633, "/area/mine/laborcamp/security", "/area/mine/laborcamp", {
	name: "Labor Camp Security",
	icon_state: "security",
});
rt.type(13634, "/area/lavaland", "/area", {
	has_gravity: 1,
	flags: 0,
	icon_state: "mining",
});
rt.type(13641, "/area/hell", "/area", {
	requires_power: 0,
	name: "Hell Lobby",
});
rt.type(13642, "/area/hell/trial1", "/area/hell", {
	name: "Hell Trial3",
});
rt.type(13643, "/area/wreck", "/area", {});
rt.type(13644, "/area/wreck/ai", "/area/wreck", {
	name: "AI Chamber",
	icon_state: "ai",
});
rt.type(13645, "/area/wreck/main", "/area/wreck", {
	name: "Wreck",
	icon_state: "storage",
});
rt.type(13646, "/area/wreck/engineering", "/area/wreck", {
	name: "Power Room",
	icon_state: "engine",
});
rt.type(13647, "/area/wreck/bridge", "/area/wreck", {
	name: "Bridge",
	icon_state: "bridge",
});
rt.type(13648, "/area/generic", "/area", {
	name: "Unknown",
	icon_state: "storage",
});
rt.type(13649, "/area/prison", "/area", {
	name: "Prison Station",
	icon_state: "brig",
});
rt.type(13650, "/area/prison/arrival_airlock", "/area/prison", {
	requires_power: 0,
	name: "Prison Station Airlock",
	icon_state: "green",
});
rt.type(13651, "/area/prison/control", "/area/prison", {
	name: "Prison Security Checkpoint",
	icon_state: "security",
});
rt.type(13652, "/area/prison/crew_quarters", "/area/prison", {
	name: "Prison Security Quarters",
	icon_state: "security",
});
rt.type(13653, "/area/prison/rec_room", "/area/prison", {
	name: "Prison Rec Room",
	icon_state: "green",
});
rt.type(13654, "/area/prison/closet", "/area/prison", {
	name: "Prison Supply Closet",
	icon_state: "dk_yellow",
});
rt.type(13655, "/area/prison/hallway", "/area/prison", {});
rt.type(13656, "/area/prison/hallway/fore", "/area/prison/hallway", {
	name: "Prison Fore Hallway",
	icon_state: "yellow",
});
rt.type(13657, "/area/prison/hallway/aft", "/area/prison/hallway", {
	name: "Prison Aft Hallway",
	icon_state: "yellow",
});
rt.type(13658, "/area/prison/hallway/port", "/area/prison/hallway", {
	name: "Prison Port Hallway",
	icon_state: "yellow",
});
rt.type(13659, "/area/prison/hallway/starboard", "/area/prison/hallway", {
	name: "Prison Starboard Hallway",
	icon_state: "yellow",
});
rt.type(13660, "/area/prison/morgue", "/area/prison", {
	ambientsounds: null,
	name: "Prison Morgue",
	icon_state: "morgue",
});
rt.type(13661, "/area/prison/medical_research", "/area/prison", {
	name: "Prison Genetic Research",
	icon_state: "medresearch",
});
rt.type(13662, "/area/prison/medical", "/area/prison", {
	name: "Prison Medbay",
	icon_state: "medbay",
});
rt.type(13663, "/area/prison/solar", "/area/prison", {
	requires_power: 0,
	name: "Prison Solar Array",
	icon_state: "storage",
});
rt.type(13664, "/area/prison/podbay", "/area/prison", {
	name: "Prison Podbay",
	icon_state: "dk_yellow",
});
rt.type(13665, "/area/prison/solar_control", "/area/prison", {
	name: "Prison Solar Array Control",
	icon_state: "dk_yellow",
});
rt.type(13666, "/area/prison/solitary", "/area/prison", {
	name: "Solitary Confinement",
	icon_state: "brig",
});
rt.type(13667, "/area/prison/execution_room", "/area/prison", {
	name: "Prisoner Education Chamber",
	icon_state: "execution_room",
});
rt.type(13668, "/area/prison/cell_block", "/area/prison", {});
rt.type(13669, "/area/prison/cell_block/a", "/area/prison/cell_block", {
	name: "Prison Cell Block A",
	icon_state: "brig",
});
rt.type(13670, "/area/prison/cell_block/b", "/area/prison/cell_block", {
	name: "Prison Cell Block B",
	icon_state: "brig",
});
rt.type(13671, "/area/prison/cell_block/c", "/area/prison/cell_block", {
	name: "Prison Cell Block C",
	icon_state: "brig",
});
rt.type(13672, "/area/ruin", "/area", {
	has_gravity: 1,
	hidden: 1,
	name: "１Unexplored Location",
	icon_state: "away",
	dynamic_lighting: 2,
});
rt.type(13673, "/area/ruin/unpowered", "/area/ruin", {
	always_unpowered: 0,
});
rt.type(13674, "/area/ruin/unpowered/no_grav", "/area/ruin/unpowered", {
	has_gravity: 0,
});
rt.type(13675, "/area/ruin/unpowered/no_grav/way_home", "/area/ruin/unpowered/no_grav", {
	name: "１Salvation",
	icon_state: "away",
});
rt.type(13676, "/area/ruin/unpowered/hierophant", "/area/ruin/unpowered", {
	name: "Hierophant's Arena",
	icon_state: "dk_yellow",
});
rt.type(13677, "/area/ruin/powered", "/area/ruin", {
	requires_power: 0,
});
rt.type(13678, "/area/ruin/powered/beach", "/area/ruin/powered", {
	icon_state: "dk_yellow",
});
rt.type(13679, "/area/ruin/powered/clownplanet", "/area/ruin/powered", {
	icon_state: "dk_yellow",
});
rt.type(13680, "/area/ruin/powered/animal_hospital", "/area/ruin/powered", {
	icon_state: "dk_yellow",
});
rt.type(13681, "/area/ruin/powered/snow_biodome", "/area/ruin/powered", {
	icon_state: "dk_yellow",
});
rt.type(13682, "/area/ruin/powered/gluttony", "/area/ruin/powered", {
	icon_state: "dk_yellow",
});
rt.type(13683, "/area/ruin/powered/golem_ship", "/area/ruin/powered", {
	name: "Free Golem Ship",
	icon_state: "dk_yellow",
});
rt.type(13684, "/area/ruin/powered/greed", "/area/ruin/powered", {
	icon_state: "dk_yellow",
});
rt.type(13685, "/area/ruin/powered/pride", "/area/ruin/powered", {
	icon_state: "dk_yellow",
});
rt.type(13686, "/area/ruin/powered/seedvault", "/area/ruin/powered", {
	icon_state: "dk_yellow",
});
rt.type(13687, "/area/ruin/powered/syndicate_lava_base", "/area/ruin/powered", {
	name: "Secret Base",
	icon_state: "dk_yellow",
});
rt.type(13688, "/area/ruin/powered/dinner_for_two", "/area/ruin/powered", {
	name: "Dinner for Two",
});
rt.type(13689, "/area/ruin/powered/authorship", "/area/ruin/powered", {
	name: "Authorship",
});
rt.type(13691, "/area/ruin/powered/spacebar", "/area/ruin/powered", {
	name: "Space Bar",
	icon_state: "yellow",
});
rt.type(13692, "/area/ruin/powered/spacebar/bar", "/area/ruin/powered/spacebar", {
	icon_state: "bar",
});
rt.type(13693, "/area/ruin/powered/mechtransport", "/area/ruin/powered", {
	name: "Mech Transport",
	icon_state: "green",
});
rt.type(13694, "/area/ruin/onehalf", "/area/ruin", {});
rt.type(13695, "/area/ruin/onehalf/hallway", "/area/ruin/onehalf", {
	name: "Hallway",
	icon_state: "hallC",
});
rt.type(13696, "/area/ruin/onehalf/drone_bay", "/area/ruin/onehalf", {
	name: "Mining Drone Bay",
	icon_state: "engine",
});
rt.type(13697, "/area/ruin/onehalf/dorms_med", "/area/ruin/onehalf", {
	name: "Crew Quarters",
	icon_state: "Sleep",
});
rt.type(13698, "/area/ruin/onehalf/bridge", "/area/ruin/onehalf", {
	name: "Bridge",
	icon_state: "bridge",
});
rt.type(13699, "/area/ruin/hotel", "/area/ruin", {
	name: "Hotel",
});
rt.type(13700, "/area/ruin/hotel/guestroom", "/area/ruin/hotel", {
	name: "Hotel Guest Room",
	icon_state: "Sleep",
});
rt.type(13701, "/area/ruin/hotel/security", "/area/ruin/hotel", {
	name: "Hotel Security Post",
	icon_state: "security",
});
rt.type(13702, "/area/ruin/hotel/pool", "/area/ruin/hotel", {
	name: "Hotel Pool Room",
	icon_state: "fitness",
});
rt.type(13703, "/area/ruin/hotel/bar", "/area/ruin/hotel", {
	name: "Hotel Bar",
	icon_state: "cafeteria",
});
rt.type(13704, "/area/ruin/hotel/power", "/area/ruin/hotel", {
	name: "Hotel Power Room",
	icon_state: "engine_smes",
});
rt.type(13705, "/area/ruin/hotel/custodial", "/area/ruin/hotel", {
	name: "Hotel Custodial Closet",
	icon_state: "janitor",
});
rt.type(13706, "/area/ruin/hotel/shuttle", "/area/ruin/hotel", {
	requires_power: 0,
	name: "Hotel Shuttle",
	icon_state: "shuttle",
});
rt.type(13707, "/area/ruin/hotel/dock", "/area/ruin/hotel", {
	name: "Hotel Shuttle Dock",
	icon_state: "start",
});
rt.type(13708, "/area/ruin/hotel/workroom", "/area/ruin/hotel", {
	name: "Hotel Staff Room",
	icon_state: "crew_quarters",
});
rt.type(13709, "/area/ruin/fakespace", "/area/ruin", {
	requires_power: 1,
	always_unpowered: 1,
	has_gravity: 0,
	power_light: 0,
	power_equip: 0,
	power_environ: 0,
	valid_territory: 0,
	outdoors: 1,
	ambientsounds: null,
	blob_allowed: 0,
	icon_state: "space",
	dynamic_lighting: 0,
});
rt.type(13710, "/area/ruin/derelictoutpost", "/area/ruin", {
	name: "Derelict Outpost",
	icon_state: "green",
});
rt.type(13711, "/area/ruin/derelictoutpost/cargostorage", "/area/ruin/derelictoutpost", {
	name: "Derelict Outpost Cargo Storage",
	icon_state: "storage",
});
rt.type(13712, "/area/ruin/derelictoutpost/cargobay", "/area/ruin/derelictoutpost", {
	name: "Derelict Outpost Cargo Bay",
	icon_state: "quartstorage",
});
rt.type(13713, "/area/ruin/derelictoutpost/powerstorage", "/area/ruin/derelictoutpost", {
	name: "Derelict Outpost Power Storage",
	icon_state: "engine_smes",
});
rt.type(13714, "/area/ruin/derelictoutpost/dockedship", "/area/ruin/derelictoutpost", {
	name: "Derelict Outpost Docked Ship",
	icon_state: "red",
});
rt.type(13715, "/area/ruin/turretedoutpost", "/area/ruin", {
	name: "Turreted Outpost",
	icon_state: "red",
});
rt.type(13716, "/area/ruin/oldteleporter", "/area/ruin", {
	has_gravity: 0,
	name: "Old teleporter",
	icon_state: "teleporter",
});
rt.type(13717, "/area/ruin/gasthelizard", "/area/ruin", {
	name: "Gas the lizard",
});
rt.type(13718, "/area/ruin/deepstorage", "/area/ruin", {
	name: "Deep Storage",
	icon_state: "storage",
});
rt.type(13719, "/area/ruin/deepstorage/airlock", "/area/ruin/deepstorage", {
	name: "Deep Storage Airlock",
	icon_state: "quart",
});
rt.type(13720, "/area/ruin/deepstorage/power", "/area/ruin/deepstorage", {
	name: "Deep Storage Power and Atmospherics Room",
	icon_state: "engi_storage",
});
rt.type(13721, "/area/ruin/deepstorage/hydroponics", "/area/ruin/deepstorage", {
	name: "Deep Storage Hydroponics",
	icon_state: "garden",
});
rt.type(13722, "/area/ruin/deepstorage/armory", "/area/ruin/deepstorage", {
	name: "Deep Storage Secure Storage",
	icon_state: "armory",
});
rt.type(13723, "/area/ruin/deepstorage/storage", "/area/ruin/deepstorage", {
	name: "Deep Storage Storage",
	icon_state: "storage_wing",
});
rt.type(13724, "/area/ruin/deepstorage/dorm", "/area/ruin/deepstorage", {
	name: "Deep Storage Dormory",
	icon_state: "crew_quarters",
});
rt.type(13725, "/area/ruin/deepstorage/kitchen", "/area/ruin/deepstorage", {
	name: "Deep Storage Kitchen",
	icon_state: "kitchen",
});
rt.type(13726, "/area/ruin/deepstorage/crusher", "/area/ruin/deepstorage", {
	name: "Deep Storage Recycler",
	icon_state: "storage",
});
rt.type(13727, "/area/ruin/abandonedzoo", "/area/ruin", {
	name: "Abandoned Zoo",
	icon_state: "green",
});
rt.type(13728, "/area/ruin/xenonest", "/area/ruin", {
	always_unpowered: 1,
	power_environ: 0,
	power_equip: 0,
	power_light: 0,
	poweralm: 0,
	name: "The Hive",
});
rt.type(13729, "/area/ruin/ancientstation", "/area/ruin", {
	name: "Charlie Station Main Corridor",
	icon_state: "green",
});
rt.type(13730, "/area/ruin/ancientstation/powered", "/area/ruin/ancientstation", {
	requires_power: 0,
	name: "Powered Tile",
	icon_state: "teleporter",
});
rt.type(13731, "/area/ruin/ancientstation/space", "/area/ruin/ancientstation", {
	has_gravity: 0,
	name: "Exposed To Space",
	icon_state: "teleporter",
});
rt.type(13732, "/area/ruin/ancientstation/atmo", "/area/ruin/ancientstation", {
	has_gravity: 0,
	name: "Beta Station Atmospherics",
	icon_state: "red",
});
rt.type(13733, "/area/ruin/ancientstation/betanorth", "/area/ruin/ancientstation", {
	name: "Beta Station North Corridor",
	icon_state: "blue",
});
rt.type(13734, "/area/ruin/ancientstation/solar", "/area/ruin/ancientstation", {
	name: "Station Solar Array",
	icon_state: "panelsAP",
});
rt.type(13735, "/area/ruin/ancientstation/engi", "/area/ruin/ancientstation", {
	name: "Charlie Station Engineering",
	icon_state: "engine",
});
rt.type(13736, "/area/ruin/ancientstation/comm", "/area/ruin/ancientstation", {
	name: "Charlie Station Command",
	icon_state: "captain",
});
rt.type(13737, "/area/ruin/ancientstation/hydroponics", "/area/ruin/ancientstation", {
	name: "Charlie Station Hydroponics",
	icon_state: "garden",
});
rt.type(13738, "/area/ruin/ancientstation/kitchen", "/area/ruin/ancientstation", {
	name: "Charlie Station Kitchen",
	icon_state: "kitchen",
});
rt.type(13739, "/area/ruin/ancientstation/sec", "/area/ruin/ancientstation", {
	name: "Charlie Station Security",
	icon_state: "red",
});
rt.type(13740, "/area/ruin/ancientstation/deltacorridor", "/area/ruin/ancientstation", {
	name: "Delta Station Main Corridor",
	icon_state: "green",
});
rt.type(13741, "/area/ruin/ancientstation/proto", "/area/ruin/ancientstation", {
	name: "Delta Station Prototype Lab",
	icon_state: "toxlab",
});
rt.type(13742, "/area/ruin/ancientstation/rnd", "/area/ruin/ancientstation", {
	name: "Delta Station Research and Development",
	icon_state: "toxlab",
});
rt.type(13743, "/area/ruin/ancientstation/hivebot", "/area/ruin/ancientstation", {
	name: "Hivebot Mothership",
	icon_state: "teleporter",
});
rt.type(13744, "/area/shuttle", "/area", {
	requires_power: 0,
	has_gravity: 1,
	always_unpowered: 0,
	valid_territory: 0,
	name: "Shuttle",
	dynamic_lighting: 2,
	icon_state: "shuttle",
});
rt.type(13745, "/area/shuttle/transit", "/area/shuttle", {
	name: "Hyperspace",
	desc: "Weeeeee",
});
rt.type(13746, "/area/shuttle/arrival", "/area/shuttle", {
	name: "Arrival Shuttle",
});
rt.type(13747, "/area/shuttle/pod_1", "/area/shuttle", {
	name: "Escape Pod One",
});
rt.type(13748, "/area/shuttle/pod_2", "/area/shuttle", {
	name: "Escape Pod Two",
});
rt.type(13749, "/area/shuttle/pod_3", "/area/shuttle", {
	name: "Escape Pod Three",
});
rt.type(13750, "/area/shuttle/pod_4", "/area/shuttle", {
	name: "Escape Pod Four",
});
rt.type(13751, "/area/shuttle/mining", "/area/shuttle", {
	blob_allowed: 0,
	name: "Mining Shuttle",
});
rt.type(13752, "/area/shuttle/labor", "/area/shuttle", {
	blob_allowed: 0,
	name: "Labor Camp Shuttle",
});
rt.type(13753, "/area/shuttle/supply", "/area/shuttle", {
	blob_allowed: 0,
	name: "Supply Shuttle",
});
rt.type(13754, "/area/shuttle/escape", "/area/shuttle", {
	name: "Emergency Shuttle",
});
rt.type(13755, "/area/shuttle/transport", "/area/shuttle", {
	blob_allowed: 0,
	name: "Transport Shuttle",
});
rt.type(13756, "/area/shuttle/syndicate", "/area/shuttle", {
	blob_allowed: 0,
	name: "Syndicate Infiltrator",
});
rt.type(13757, "/area/shuttle/assault_pod", "/area/shuttle", {
	blob_allowed: 0,
	name: "Steel Rain",
});
rt.type(13758, "/area/shuttle/abandoned", "/area/shuttle", {
	blob_allowed: 0,
	name: "Abandoned Ship",
});
rt.type(13759, "/area/shuttle/sbc_starfury", "/area/shuttle", {
	blob_allowed: 0,
	name: "SBC Starfury",
});
rt.type(13760, "/area/shuttle/sbc_fighter1", "/area/shuttle", {
	blob_allowed: 0,
	name: "SBC Fighter 1",
});
rt.type(13761, "/area/shuttle/sbc_fighter2", "/area/shuttle", {
	blob_allowed: 0,
	name: "SBC Fighter 2",
});
rt.type(13762, "/area/shuttle/sbc_corvette", "/area/shuttle", {
	blob_allowed: 0,
	name: "SBC corvette",
});
rt.type(13763, "/area/shuttle/syndicate_scout", "/area/shuttle", {
	blob_allowed: 0,
	name: "Syndicate Scout",
});
rt.type(13764, "/area/shuttle/auxillary_base", "/area/shuttle", {
	name: "Auxillary Base",
	luminosity: 0,
});
rt.type(13765, "/area/spacecontent", "/area", {
	name: "space",
});
rt.type(13766, "/area/spacecontent/a1", "/area/spacecontent", {
	icon_state: "spacecontent1",
});
rt.type(13767, "/area/spacecontent/a2", "/area/spacecontent", {
	icon_state: "spacecontent2",
});
rt.type(13768, "/area/spacecontent/a3", "/area/spacecontent", {
	icon_state: "spacecontent3",
});
rt.type(13769, "/area/spacecontent/a4", "/area/spacecontent", {
	icon_state: "spacecontent4",
});
rt.type(13770, "/area/spacecontent/a5", "/area/spacecontent", {
	icon_state: "spacecontent5",
});
rt.type(13771, "/area/spacecontent/a6", "/area/spacecontent", {
	icon_state: "spacecontent6",
});
rt.type(13772, "/area/spacecontent/a7", "/area/spacecontent", {
	icon_state: "spacecontent7",
});
rt.type(13773, "/area/spacecontent/a8", "/area/spacecontent", {
	icon_state: "spacecontent8",
});
rt.type(13774, "/area/spacecontent/a9", "/area/spacecontent", {
	icon_state: "spacecontent9",
});
rt.type(13775, "/area/spacecontent/a10", "/area/spacecontent", {
	icon_state: "spacecontent10",
});
rt.type(13776, "/area/spacecontent/a11", "/area/spacecontent", {
	icon_state: "spacecontent12",
});
rt.type(13777, "/area/spacecontent/a12", "/area/spacecontent", {
	icon_state: "spacecontent13",
});
rt.type(13778, "/area/spacecontent/a13", "/area/spacecontent", {
	icon_state: "spacecontent14",
});
rt.type(13779, "/area/spacecontent/a14", "/area/spacecontent", {
	icon_state: "spacecontent14",
});
rt.type(13780, "/area/spacecontent/a15", "/area/spacecontent", {
	icon_state: "spacecontent15",
});
rt.type(13781, "/area/spacecontent/a16", "/area/spacecontent", {
	icon_state: "spacecontent16",
});
rt.type(13782, "/area/spacecontent/a17", "/area/spacecontent", {
	icon_state: "spacecontent17",
});
rt.type(13783, "/area/spacecontent/a18", "/area/spacecontent", {
	icon_state: "spacecontent18",
});
rt.type(13784, "/area/spacecontent/a19", "/area/spacecontent", {
	icon_state: "spacecontent19",
});
rt.type(13785, "/area/spacecontent/a20", "/area/spacecontent", {
	icon_state: "spacecontent20",
});
rt.type(13786, "/area/spacecontent/a21", "/area/spacecontent", {
	icon_state: "spacecontent21",
});
rt.type(13787, "/area/spacecontent/a22", "/area/spacecontent", {
	icon_state: "spacecontent22",
});
rt.type(13788, "/area/spacecontent/a23", "/area/spacecontent", {
	icon_state: "spacecontent23",
});
rt.type(13789, "/area/spacecontent/a24", "/area/spacecontent", {
	icon_state: "spacecontent24",
});
rt.type(13790, "/area/spacecontent/a25", "/area/spacecontent", {
	icon_state: "spacecontent25",
});
rt.type(13791, "/area/spacecontent/a26", "/area/spacecontent", {
	icon_state: "spacecontent26",
});
rt.type(13792, "/area/spacecontent/a27", "/area/spacecontent", {
	icon_state: "spacecontent27",
});
rt.type(13793, "/area/spacecontent/a28", "/area/spacecontent", {
	icon_state: "spacecontent28",
});
rt.type(13794, "/area/spacecontent/a29", "/area/spacecontent", {
	icon_state: "spacecontent29",
});
rt.type(13795, "/area/spacecontent/a30", "/area/spacecontent", {
	icon_state: "spacecontent30",
});
rt.type(13796, "/area/shuttle_arena", "/area", {
	has_gravity: 1,
	requires_power: 0,
	name: "arena",
});
rt.type(13797, "/area/template_noop", "/area", {
	name: "Area Passthrough",
});
rt.type(13798, "/area/survivalpod", "/area", {
	dynamic_lighting: 2,
	requires_power: 0,
	has_gravity: 1,
	name: "１Emergency Shelter",
	icon_state: "away",
});
