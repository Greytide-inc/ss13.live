// Types declared in code/game/machinery/computer that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(121, "/datum/action/innate/camera_off/base_construction", "/datum/action/innate/camera_off", {
	name: "Log out",
});
rt.type(6791, "/obj/item/weapon/circuitboard/computer", "/obj/item/weapon/circuitboard", {});
rt.type(6792, "/obj/item/weapon/circuitboard/computer/turbine_computer", "/obj/item/weapon/circuitboard/computer", {
	name: "Turbine Computer (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/turbine_computer"),
	origin_tech: "programming=4;engineering=4;powerstorage=4",
});
rt.type(6793, "/obj/item/weapon/circuitboard/computer/launchpad_console", "/obj/item/weapon/circuitboard/computer", {
	name: "Launchpad Control Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/launchpad"),
	origin_tech: "programming=3;bluespace=3;plasmatech=2",
});
rt.type(6794, "/obj/item/weapon/circuitboard/computer/message_monitor", "/obj/item/weapon/circuitboard/computer", {
	name: "Message Monitor (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/message_monitor"),
	origin_tech: "programming=2",
});
rt.type(6795, "/obj/item/weapon/circuitboard/computer/security", "/obj/item/weapon/circuitboard/computer", {
	name: "Security Cameras (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/security"),
	origin_tech: "programming=2;combat=2",
});
rt.type(6796, "/obj/item/weapon/circuitboard/computer/xenobiology", "/obj/item/weapon/circuitboard/computer", {
	name: "circuit board (Xenobiology Console)",
	build_path: rt.typePath("/obj/machinery/computer/camera_advanced/xenobio"),
	origin_tech: "programming=3;biotech=3",
});
rt.type(6797, "/obj/item/weapon/circuitboard/computer/base_construction", "/obj/item/weapon/circuitboard/computer", {
	name: "circuit board (Aux Mining Base Construction Console)",
	build_path: rt.typePath("/obj/machinery/computer/camera_advanced/base_construction"),
	origin_tech: "programming=3;engineering=3",
});
rt.type(6798, "/obj/item/weapon/circuitboard/computer/aiupload", "/obj/item/weapon/circuitboard/computer", {
	name: "AI Upload (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/upload/ai"),
	origin_tech: "programming=4;engineering=4",
});
rt.type(6799, "/obj/item/weapon/circuitboard/computer/borgupload", "/obj/item/weapon/circuitboard/computer", {
	name: "Cyborg Upload (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/upload/borg"),
	origin_tech: "programming=4;engineering=4",
});
rt.type(6800, "/obj/item/weapon/circuitboard/computer/med_data", "/obj/item/weapon/circuitboard/computer", {
	name: "Medical Records Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/med_data"),
	origin_tech: "programming=2;biotech=2",
});
rt.type(6801, "/obj/item/weapon/circuitboard/computer/pandemic", "/obj/item/weapon/circuitboard/computer", {
	name: "PanD.E.M.I.C. 2200 (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/pandemic"),
	origin_tech: "programming=2;biotech=2",
});
rt.type(6802, "/obj/item/weapon/circuitboard/computer/scan_consolenew", "/obj/item/weapon/circuitboard/computer", {
	name: "DNA Machine (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/scan_consolenew"),
	origin_tech: "programming=2;biotech=2",
});
rt.type(6803, "/obj/item/weapon/circuitboard/computer/communications", "/obj/item/weapon/circuitboard/computer", {
	lastTimeUsed: 0,
	name: "Communications (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/communications"),
	origin_tech: "programming=3;magnets=3",
});
rt.type(6804, "/obj/item/weapon/circuitboard/computer/card", "/obj/item/weapon/circuitboard/computer", {
	name: "ID Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/card"),
	origin_tech: "programming=3",
});
rt.type(6805, "/obj/item/weapon/circuitboard/computer/card/centcom", "/obj/item/weapon/circuitboard/computer/card", {
	name: "Centcom ID Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/card/centcom"),
});
rt.type(6807, "/obj/item/weapon/circuitboard/computer/teleporter", "/obj/item/weapon/circuitboard/computer", {
	name: "Teleporter (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/teleporter"),
	origin_tech: "programming=3;bluespace=3;plasmatech=3",
});
rt.type(6808, "/obj/item/weapon/circuitboard/computer/secure_data", "/obj/item/weapon/circuitboard/computer", {
	name: "Security Records Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/secure_data"),
	origin_tech: "programming=2;combat=2",
});
rt.type(6809, "/obj/item/weapon/circuitboard/computer/stationalert", "/obj/item/weapon/circuitboard/computer", {
	name: "Station Alerts (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/station_alert"),
});
rt.type(6810, "/obj/item/weapon/circuitboard/computer/atmos_control", "/obj/item/weapon/circuitboard/computer", {
	name: "Atmospheric Monitor (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/atmos_control"),
});
rt.type(6811, "/obj/item/weapon/circuitboard/computer/atmos_control/tank", "/obj/item/weapon/circuitboard/computer/atmos_control", {
	name: "Tank Control (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/atmos_control/tank"),
	origin_tech: "programming=2;engineering=3;materials=2",
});
rt.type(6812, "/obj/item/weapon/circuitboard/computer/atmos_alert", "/obj/item/weapon/circuitboard/computer", {
	name: "Atmospheric Alert (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/atmos_alert"),
});
rt.type(6813, "/obj/item/weapon/circuitboard/computer/pod", "/obj/item/weapon/circuitboard/computer", {
	name: "Massdriver control (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/pod"),
});
rt.type(6814, "/obj/item/weapon/circuitboard/computer/robotics", "/obj/item/weapon/circuitboard/computer", {
	name: "Robotics Control (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/robotics"),
	origin_tech: "programming=3",
});
rt.type(6815, "/obj/item/weapon/circuitboard/computer/cloning", "/obj/item/weapon/circuitboard/computer", {
	name: "Cloning (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/cloning"),
	origin_tech: "programming=2;biotech=2",
});
rt.type(6816, "/obj/item/weapon/circuitboard/computer/arcade", "/obj/item/weapon/circuitboard/computer", {});
rt.type(6817, "/obj/item/weapon/circuitboard/computer/arcade/battle", "/obj/item/weapon/circuitboard/computer/arcade", {
	name: "Arcade Battle (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/arcade/battle"),
	origin_tech: "programming=1",
});
rt.type(6818, "/obj/item/weapon/circuitboard/computer/arcade/orion_trail", "/obj/item/weapon/circuitboard/computer/arcade", {
	name: "Orion Trail (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/arcade/orion_trail"),
	origin_tech: "programming=1",
});
rt.type(6819, "/obj/item/weapon/circuitboard/computer/turbine_control", "/obj/item/weapon/circuitboard/computer", {
	name: "Turbine control (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/turbine_computer"),
});
rt.type(6820, "/obj/item/weapon/circuitboard/computer/solar_control", "/obj/item/weapon/circuitboard/computer", {
	name: "Solar Control (Computer Board)",
	build_path: rt.typePath("/obj/machinery/power/solar_control"),
	origin_tech: "programming=2;powerstorage=2",
});
rt.type(6821, "/obj/item/weapon/circuitboard/computer/powermonitor", "/obj/item/weapon/circuitboard/computer", {
	name: "Power Monitor (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/monitor"),
	origin_tech: "programming=2;powerstorage=2",
});
rt.type(6822, "/obj/item/weapon/circuitboard/computer/olddoor", "/obj/item/weapon/circuitboard/computer", {
	name: "DoorMex (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/pod/old"),
});
rt.type(6823, "/obj/item/weapon/circuitboard/computer/syndicatedoor", "/obj/item/weapon/circuitboard/computer", {
	name: "ProComp Executive (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/pod/old/syndicate"),
});
rt.type(6824, "/obj/item/weapon/circuitboard/computer/swfdoor", "/obj/item/weapon/circuitboard/computer", {
	name: "Magix (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/pod/old/swf"),
});
rt.type(6825, "/obj/item/weapon/circuitboard/computer/prisoner", "/obj/item/weapon/circuitboard/computer", {
	name: "Prisoner Management Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/prisoner"),
});
rt.type(6826, "/obj/item/weapon/circuitboard/computer/gulag_teleporter_console", "/obj/item/weapon/circuitboard/computer", {
	name: "Labor Camp teleporter console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/gulag_teleporter_computer"),
});
rt.type(6828, "/obj/item/weapon/circuitboard/computer/mecha_control", "/obj/item/weapon/circuitboard/computer", {
	name: "Exosuit Control Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/mecha"),
});
rt.type(6829, "/obj/item/weapon/circuitboard/computer/rdservercontrol", "/obj/item/weapon/circuitboard/computer", {
	name: "R&D Server Control (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/rdservercontrol"),
});
rt.type(6830, "/obj/item/weapon/circuitboard/computer/crew", "/obj/item/weapon/circuitboard/computer", {
	name: "Crew Monitoring Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/crew"),
	origin_tech: "programming=2;biotech=2",
});
rt.type(6831, "/obj/item/weapon/circuitboard/computer/mech_bay_power_console", "/obj/item/weapon/circuitboard/computer", {
	name: "Mech Bay Power Control Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/mech_bay_power_console"),
	origin_tech: "programming=3;powerstorage=3",
});
rt.type(6833, "/obj/item/weapon/circuitboard/computer/cargo/request", "/obj/item/weapon/circuitboard/computer/cargo", {
	name: "Supply Request Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/cargo/request"),
});
rt.type(6834, "/obj/item/weapon/circuitboard/computer/stockexchange", "/obj/item/weapon/circuitboard/computer", {
	name: "circuit board (Stock Exchange Console)",
	build_path: rt.typePath("/obj/machinery/computer/stockexchange"),
	origin_tech: "programming=3",
});
rt.type(6835, "/obj/item/weapon/circuitboard/computer/operating", "/obj/item/weapon/circuitboard/computer", {
	name: "Operating Computer (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/operating"),
	origin_tech: "programming=2;biotech=3",
});
rt.type(6836, "/obj/item/weapon/circuitboard/computer/mining", "/obj/item/weapon/circuitboard/computer", {
	name: "Outpost Status Display (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/security/mining"),
});
rt.type(6837, "/obj/item/weapon/circuitboard/computer/comm_monitor", "/obj/item/weapon/circuitboard/computer", {
	name: "Telecommunications Monitor (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/telecomms/monitor"),
	origin_tech: "programming=3;magnets=3;bluespace=2",
});
rt.type(6838, "/obj/item/weapon/circuitboard/computer/comm_server", "/obj/item/weapon/circuitboard/computer", {
	name: "Telecommunications Server Monitor (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/telecomms/server"),
	origin_tech: "programming=3;magnets=3;bluespace=2",
});
rt.type(6840, "/obj/item/weapon/circuitboard/computer/shuttle/monastery_shuttle", "/obj/item/weapon/circuitboard/computer/shuttle", {
	name: "Monastery Shuttle (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/shuttle/monastery_shuttle"),
});
rt.type(6841, "/obj/item/weapon/circuitboard/computer/labor_shuttle", "/obj/item/weapon/circuitboard/computer", {
	name: "Labor Shuttle (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/shuttle/labor"),
});
rt.type(6842, "/obj/item/weapon/circuitboard/computer/labor_shuttle/one_way", "/obj/item/weapon/circuitboard/computer/labor_shuttle", {
	name: "Prisoner Shuttle Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/shuttle/labor/one_way"),
});
rt.type(6843, "/obj/item/weapon/circuitboard/computer/ferry", "/obj/item/weapon/circuitboard/computer", {
	name: "Transport Ferry (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/shuttle/ferry"),
});
rt.type(6844, "/obj/item/weapon/circuitboard/computer/ferry/request", "/obj/item/weapon/circuitboard/computer/ferry", {
	name: "Transport Ferry Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/shuttle/ferry/request"),
});
rt.type(6845, "/obj/item/weapon/circuitboard/computer/mining_shuttle", "/obj/item/weapon/circuitboard/computer", {
	name: "Mining Shuttle (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/shuttle/mining"),
});
rt.type(6846, "/obj/item/weapon/circuitboard/computer/white_ship", "/obj/item/weapon/circuitboard/computer", {
	name: "White Ship (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/shuttle/white_ship"),
});
rt.type(6847, "/obj/item/weapon/circuitboard/computer/auxillary_base", "/obj/item/weapon/circuitboard/computer", {
	name: "Auxillary Base Management Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/auxillary_base"),
});
rt.type(6848, "/obj/item/weapon/circuitboard/computer/holodeck", "/obj/item/weapon/circuitboard/computer", {
	name: "Holodeck Control (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/holodeck"),
	origin_tech: "programming=4",
});
rt.type(6849, "/obj/item/weapon/circuitboard/computer/aifixer", "/obj/item/weapon/circuitboard/computer", {
	name: "AI Integrity Restorer (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/aifixer"),
	origin_tech: "programming=2;biotech=2",
});
rt.type(6850, "/obj/item/weapon/circuitboard/computer/slot_machine", "/obj/item/weapon/circuitboard/computer", {
	name: "Slot Machine (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/slot_machine"),
	origin_tech: "programming=1",
});
rt.type(6852, "/obj/item/weapon/circuitboard/computer/apc_control", "/obj/item/weapon/circuitboard/computer", {
	name: "１Power Flow Control Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/apc_control"),
	origin_tech: "programming=3;engineering=3;powerstorage=2",
});
rt.type(6854, "/obj/item/weapon/circuitboard/computer/bsa_control", "/obj/item/weapon/circuitboard/computer", {
	name: "Bluespace Artillery Controls (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/bsa_control"),
	origin_tech: "engineering=2;combat=2;bluespace=2",
});
rt.type(6855, "/obj/item/weapon/circuitboard/mecha", "/obj/item/weapon/circuitboard", {
	flags: 64,
	throw_speed: 3,
	throw_range: 7,
	name: "exosuit circuit board",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "std_mod",
	item_state: "electronic",
	force: 5,
	w_class: 2,
	throwforce: 0,
});
rt.type(6856, "/obj/item/weapon/circuitboard/mecha/ripley", "/obj/item/weapon/circuitboard/mecha", {
	origin_tech: "programming=2",
});
rt.type(6857, "/obj/item/weapon/circuitboard/mecha/ripley/peripherals", "/obj/item/weapon/circuitboard/mecha/ripley", {
	name: "Ripley Peripherals Control module (Exosuit Board)",
	icon_state: "mcontroller",
});
rt.type(6858, "/obj/item/weapon/circuitboard/mecha/ripley/main", "/obj/item/weapon/circuitboard/mecha/ripley", {
	name: "Ripley Central Control module (Exosuit Board)",
	icon_state: "mainboard",
});
rt.type(6859, "/obj/item/weapon/circuitboard/mecha/gygax", "/obj/item/weapon/circuitboard/mecha", {
	origin_tech: "programming=4;combat=3;engineering=3",
});
rt.type(6860, "/obj/item/weapon/circuitboard/mecha/gygax/peripherals", "/obj/item/weapon/circuitboard/mecha/gygax", {
	name: "Gygax Peripherals Control module (Exosuit Board)",
	icon_state: "mcontroller",
});
rt.type(6861, "/obj/item/weapon/circuitboard/mecha/gygax/targeting", "/obj/item/weapon/circuitboard/mecha/gygax", {
	name: "Gygax Weapon Control and Targeting module (Exosuit Board)",
	icon_state: "mcontroller",
	origin_tech: "programming=4;combat=4",
});
rt.type(6862, "/obj/item/weapon/circuitboard/mecha/gygax/main", "/obj/item/weapon/circuitboard/mecha/gygax", {
	name: "Gygax Central Control module (Exosuit Board)",
	icon_state: "mainboard",
});
rt.type(6863, "/obj/item/weapon/circuitboard/mecha/durand", "/obj/item/weapon/circuitboard/mecha", {
	origin_tech: "programming=4;combat=3;engineering=3",
});
rt.type(6864, "/obj/item/weapon/circuitboard/mecha/durand/peripherals", "/obj/item/weapon/circuitboard/mecha/durand", {
	name: "Durand Peripherals Control module (Exosuit Board)",
	icon_state: "mcontroller",
});
rt.type(6865, "/obj/item/weapon/circuitboard/mecha/durand/targeting", "/obj/item/weapon/circuitboard/mecha/durand", {
	name: "Durand Weapon Control and Targeting module (Exosuit Board)",
	icon_state: "mcontroller",
	origin_tech: "programming=4;combat=4;engineering=3",
});
rt.type(6866, "/obj/item/weapon/circuitboard/mecha/durand/main", "/obj/item/weapon/circuitboard/mecha/durand", {
	name: "Durand Central Control module (Exosuit Board)",
	icon_state: "mainboard",
});
rt.type(6867, "/obj/item/weapon/circuitboard/mecha/honker", "/obj/item/weapon/circuitboard/mecha", {
	origin_tech: "programming=3;engineering=3",
});
rt.type(6868, "/obj/item/weapon/circuitboard/mecha/honker/peripherals", "/obj/item/weapon/circuitboard/mecha/honker", {
	name: "H.O.N.K Peripherals Control module (Exosuit Board)",
	icon_state: "mcontroller",
});
rt.type(6869, "/obj/item/weapon/circuitboard/mecha/honker/targeting", "/obj/item/weapon/circuitboard/mecha/honker", {
	name: "H.O.N.K Weapon Control and Targeting module (Exosuit Board)",
	icon_state: "mcontroller",
});
rt.type(6870, "/obj/item/weapon/circuitboard/mecha/honker/main", "/obj/item/weapon/circuitboard/mecha/honker", {
	name: "H.O.N.K Central Control module (Exosuit Board)",
	icon_state: "mainboard",
});
rt.type(6871, "/obj/item/weapon/circuitboard/mecha/odysseus", "/obj/item/weapon/circuitboard/mecha", {
	origin_tech: "programming=3;biotech=3",
});
rt.type(6872, "/obj/item/weapon/circuitboard/mecha/odysseus/peripherals", "/obj/item/weapon/circuitboard/mecha/odysseus", {
	name: "Odysseus Peripherals Control module (Exosuit Board)",
	icon_state: "mcontroller",
});
rt.type(6873, "/obj/item/weapon/circuitboard/mecha/odysseus/main", "/obj/item/weapon/circuitboard/mecha/odysseus", {
	name: "Odysseus Central Control module (Exosuit Board)",
	icon_state: "mainboard",
});
rt.type(6874, "/obj/item/weapon/circuitboard/mecha/phazon", "/obj/item/weapon/circuitboard/mecha", {
	origin_tech: "programming=5;plasmatech=4",
});
rt.type(6875, "/obj/item/weapon/circuitboard/mecha/phazon/peripherals", "/obj/item/weapon/circuitboard/mecha/phazon", {
	name: "Phazon Peripherals Control module (Exosuit Board)",
	icon_state: "mcontroller",
});
rt.type(6876, "/obj/item/weapon/circuitboard/mecha/phazon/targeting", "/obj/item/weapon/circuitboard/mecha/phazon", {
	name: "Phazon Weapon Control and Targeting module (Exosuit Board)",
	icon_state: "mcontroller",
});
rt.type(6877, "/obj/item/weapon/circuitboard/mecha/phazon/main", "/obj/item/weapon/circuitboard/mecha/phazon", {
	name: "Phazon Central Control module (Exosuit Board)",
});
rt.type(6878, "/obj/item/weapon/circuitboard/aicore", "/obj/item/weapon/circuitboard", {
	name: "AI core (AI Core Board)",
	origin_tech: "programming=3",
});
rt.type(10358, "/obj/machinery/computer/security/wooden_tv", "/obj/machinery/computer/security", {
	name: "security camera monitor",
	desc: "An old TV hooked into the stations camera network.",
	icon_state: "television",
	icon_keyboard: null,
	icon_screen: "detective_tv",
	clockwork: 1,
});
rt.type(10373, "/obj/machinery/computer/card/minor/hos", "/obj/machinery/computer/card/minor", {
	target_dept: 2,
	light_color: "#FA8282",
	icon_screen: "idhos",
});
rt.type(10374, "/obj/machinery/computer/card/minor/cmo", "/obj/machinery/computer/card/minor", {
	target_dept: 3,
	icon_screen: "idcmo",
});
rt.type(10375, "/obj/machinery/computer/card/minor/rd", "/obj/machinery/computer/card/minor", {
	target_dept: 4,
	light_color: "#E17DE1",
	icon_screen: "idrd",
});
rt.type(10376, "/obj/machinery/computer/card/minor/ce", "/obj/machinery/computer/card/minor", {
	target_dept: 5,
	light_color: "#E1E17D",
	icon_screen: "idce",
});
rt.type(10387, "/obj/machinery/computer/med_data/laptop", "/obj/machinery/computer/med_data", {
	icon_screen: "medlaptop",
	icon_keyboard: "laptop_key",
	clockwork: 1,
	name: "medical laptop",
	desc: "A cheap Nanotrasen medical laptop, it functions as a medical records computer. It's bolted to the table.",
	icon_state: "laptop",
});
rt.type(10403, "/obj/machinery/computer/pod/old", "/obj/machinery/computer/pod", {
	title: "Door Controls",
	icon_screen: "library",
	icon_keyboard: null,
	name: "１DoorMex control console",
	icon_state: "oldcomp",
});
rt.type(10405, "/obj/machinery/computer/pod/old/swf", "/obj/machinery/computer/pod/old", {
	name: "１Magix System IV",
	desc: "An arcane artifact that holds much magic. Running E-Knock 2.2: Sorceror's Edition",
});
rt.type(10409, "/obj/machinery/computer/secure_data/laptop", "/obj/machinery/computer/secure_data", {
	icon_screen: "seclaptop",
	icon_keyboard: "laptop_key",
	clockwork: 1,
	name: "security laptop",
	desc: "A cheap Nanotrasen security laptop, it functions as a security records console. It's bolted to the table.",
	icon_state: "laptop",
});
rt.type(10411, "/obj/machinery/computer/telecrystals", "/obj/machinery/computer", {
	icon_keyboard: "tcstation_key",
	icon_screen: "syndie",
	clockwork: 1,
	light_color: "#FA8282",
	name: "１Telecrystal assignment station",
	desc: "A device used to manage telecrystals during group operations. You shouldn't be looking at this particular one...",
	icon_state: "tcstation",
	resistance_flags: 99,
});
rt.type(10414, "/obj/machinery/computer/telecomms", "/obj/machinery/computer", {});
