// Based on /tg/station's code/modules/research/designs/machine_designs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(2914, "/datum/design/board/smes", "/datum/design/board", {
	name: "Machine Design (SMES Board)",
	desc: "The circuit board for a SMES.",
	id: "smes",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/smes"),
});

// machine_designs.dm:9
rt.def("/datum/design/board/smes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 4, "powerstorage", 5, "engineering", 4]);

	this.category = list("Engineering Machinery");
	return f.dot;
});

rt.type(2915, "/datum/design/board/announcement_system", "/datum/design/board", {
	name: "Machine Design (Automated Announcement System Board)",
	desc: "The circuit board for an automated announcement system.",
	id: "automated_announcement",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/announcement_system"),
});

// machine_designs.dm:17
rt.def("/datum/design/board/announcement_system/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3, "bluespace", 3, "magnets", 2]);

	this.category = list("Subspace Telecomms");
	return f.dot;
});

rt.type(2916, "/datum/design/board/turbine_computer", "/datum/design/board", {
	name: "Computer Design (Power Turbine Console Board)",
	desc: "The circuit board for a power turbine console.",
	id: "power_turbine_console",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/turbine_computer"),
});

// machine_designs.dm:25
rt.def("/datum/design/board/turbine_computer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 4, "powerstorage", 5, "engineering", 4]);

	this.category = list("Engineering Machinery");
	return f.dot;
});

rt.type(2917, "/datum/design/board/emitter", "/datum/design/board", {
	name: "Machine Design (Emitter Board)",
	desc: "The circuit board for an emitter.",
	id: "emitter",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/emitter"),
});

// machine_designs.dm:33
rt.def("/datum/design/board/emitter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3, "powerstorage", 5, "engineering", 4]);

	this.category = list("Engineering Machinery");
	return f.dot;
});

rt.type(2918, "/datum/design/board/power_compressor", "/datum/design/board", {
	name: "Machine Design (Power Compressor Board)",
	desc: "The circuit board for a power compressor.",
	id: "power_compressor",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/power_compressor"),
});

// machine_designs.dm:41
rt.def("/datum/design/board/power_compressor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 4, "powerstorage", 5, "engineering", 4]);

	this.category = list("Engineering Machinery");
	return f.dot;
});

rt.type(2919, "/datum/design/board/power_turbine", "/datum/design/board", {
	name: "Machine Design (Power Turbine Board)",
	desc: "The circuit board for a power turbine.",
	id: "power_turbine",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/power_turbine"),
});

// machine_designs.dm:49
rt.def("/datum/design/board/power_turbine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 4, "powerstorage", 4, "engineering", 5]);

	this.category = list("Engineering Machinery");
	return f.dot;
});

rt.type(2920, "/datum/design/board/thermomachine", "/datum/design/board", {
	name: "Machine Design (Freezer/Heater Board)",
	desc: "The circuit board for a freezer/heater.",
	id: "thermomachine",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/thermomachine"),
});

// machine_designs.dm:57
rt.def("/datum/design/board/thermomachine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3, "plasmatech", 3]);

	this.category = list("Engineering Machinery");
	return f.dot;
});

rt.type(2921, "/datum/design/board/space_heater", "/datum/design/board", {
	name: "Machine Design (Space Heater Board)",
	desc: "The circuit board for a space heater.",
	id: "space_heater",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/space_heater"),
});

// machine_designs.dm:65
rt.def("/datum/design/board/space_heater/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2, "plasmatech", 2]);

	this.category = list("Engineering Machinery");
	return f.dot;
});

rt.type(2922, "/datum/design/board/teleport_station", "/datum/design/board", {
	name: "Machine Design (Teleportation Station Board)",
	desc: "The circuit board for a teleportation station.",
	id: "tele_station",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/teleporter_station"),
});

// machine_designs.dm:73
rt.def("/datum/design/board/teleport_station/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 5, "bluespace", 4, "engineering", 4, "plasmatech", 4]);

	this.category = list("Teleportation Machinery");
	return f.dot;
});

rt.type(2923, "/datum/design/board/teleport_hub", "/datum/design/board", {
	name: "Machine Design (Teleportation Hub Board)",
	desc: "The circuit board for a teleportation hub.",
	id: "tele_hub",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/teleporter_hub"),
});

// machine_designs.dm:81
rt.def("/datum/design/board/teleport_hub/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3, "bluespace", 5, "materials", 4, "engineering", 5]);

	this.category = list("Teleportation Machinery");
	return f.dot;
});

rt.type(2924, "/datum/design/board/quantumpad", "/datum/design/board", {
	name: "Machine Design (Quantum Pad Board)",
	desc: "The circuit board for a quantum telepad.",
	id: "quantumpad",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/quantumpad"),
});

// machine_designs.dm:89
rt.def("/datum/design/board/quantumpad/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 4, "bluespace", 4, "plasmatech", 3, "engineering", 4]);

	this.category = list("Teleportation Machinery");
	return f.dot;
});

rt.type(2925, "/datum/design/board/launchpad", "/datum/design/board", {
	name: "Machine Design (Bluespace Launchpad Board)",
	desc: "The circuit board for a bluespace Launchpad.",
	id: "launchpad",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/launchpad"),
});

// machine_designs.dm:97
rt.def("/datum/design/board/launchpad/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3, "bluespace", 3, "plasmatech", 2, "engineering", 3]);

	this.category = list("Teleportation Machinery");
	return f.dot;
});

rt.type(2926, "/datum/design/board/launchpad_console", "/datum/design/board", {
	name: "Machine Design (Bluespace Launchpad Console Board)",
	desc: "The circuit board for a bluespace launchpad Console.",
	id: "launchpad_console",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/launchpad_console"),
});

// machine_designs.dm:105
rt.def("/datum/design/board/launchpad_console/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 4, "bluespace", 3, "plasmatech", 3]);

	this.category = list("Teleportation Machinery");
	return f.dot;
});

rt.type(2927, "/datum/design/board/teleconsole", "/datum/design/board", {
	name: "Computer Design (Teleporter Console)",
	desc: "Allows for the construction of circuit boards used to build a teleporter control console.",
	id: "teleconsole",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/teleporter"),
});

// machine_designs.dm:113
rt.def("/datum/design/board/teleconsole/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3, "bluespace", 3, "plasmatech", 4]);

	this.category = list("Teleportation Machinery");
	return f.dot;
});

rt.type(2928, "/datum/design/board/sleeper", "/datum/design/board", {
	name: "Machine Design (Sleeper Board)",
	desc: "The circuit board for a sleeper.",
	id: "sleeper",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/sleeper"),
});

// machine_designs.dm:121
rt.def("/datum/design/board/sleeper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3, "biotech", 2, "engineering", 3]);

	this.category = list("Medical Machinery");
	return f.dot;
});

rt.type(2929, "/datum/design/board/cryotube", "/datum/design/board", {
	name: "Machine Design (Cryotube Board)",
	desc: "The circuit board for a cryotube.",
	id: "cryotube",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/cryo_tube"),
});

// machine_designs.dm:129
rt.def("/datum/design/board/cryotube/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 5, "biotech", 3, "engineering", 4, "plasmatech", 3]);

	this.category = list("Medical Machinery");
	return f.dot;
});

rt.type(2930, "/datum/design/board/chem_dispenser", "/datum/design/board", {
	name: "Machine Design (Portable Chem Dispenser Board)",
	desc: "The circuit board for a portable chem dispenser.",
	id: "chem_dispenser",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/chem_dispenser"),
});

// machine_designs.dm:137
rt.def("/datum/design/board/chem_dispenser/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 5, "biotech", 3, "materials", 4, "plasmatech", 4]);

	this.category = list("Medical Machinery");
	return f.dot;
});

rt.type(2931, "/datum/design/board/chem_master", "/datum/design/board", {
	name: "Machine Design (Chem Master Board)",
	desc: "The circuit board for a Chem Master 3000.",
	id: "chem_master",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/chem_master"),
});

// machine_designs.dm:145
rt.def("/datum/design/board/chem_master/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["biotech", 3, "materials", 3, "programming", 2]);

	this.category = list("Medical Machinery");
	return f.dot;
});

rt.type(2932, "/datum/design/board/chem_heater", "/datum/design/board", {
	name: "Machine Design (Chemical Heater Board)",
	desc: "The circuit board for a chemical heater.",
	id: "chem_heater",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/chem_heater"),
});

// machine_designs.dm:153
rt.def("/datum/design/board/chem_heater/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["engineering", 2, "biotech", 2, "programming", 2]);

	this.category = list("Medical Machinery");
	return f.dot;
});

rt.type(2933, "/datum/design/board/clonecontrol", "/datum/design/board", {
	name: "Computer Design (Cloning Machine Console)",
	desc: "Allows for the construction of circuit boards used to build a new Cloning Machine console.",
	id: "clonecontrol",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/cloning"),
});

// machine_designs.dm:161
rt.def("/datum/design/board/clonecontrol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 4, "biotech", 3]);

	this.category = list("Medical Machinery");
	return f.dot;
});

rt.type(2934, "/datum/design/board/clonepod", "/datum/design/board", {
	name: "Machine Design (Clone Pod)",
	desc: "Allows for the construction of circuit boards used to build a Cloning Pod.",
	id: "clonepod",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/clonepod"),
});

// machine_designs.dm:169
rt.def("/datum/design/board/clonepod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 4, "biotech", 3]);

	this.category = list("Medical Machinery");
	return f.dot;
});

rt.type(2935, "/datum/design/board/clonescanner", "/datum/design/board", {
	name: "Machine Design (Cloning Scanner)",
	desc: "Allows for the construction of circuit boards used to build a Cloning Scanner.",
	id: "clonescanner",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/clonescanner"),
});

// machine_designs.dm:177
rt.def("/datum/design/board/clonescanner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 4, "biotech", 3]);

	this.category = list("Medical Machinery");
	return f.dot;
});

rt.type(2936, "/datum/design/board/biogenerator", "/datum/design/board", {
	name: "Machine Design (Biogenerator Board)",
	desc: "The circuit board for a biogenerator.",
	id: "biogenerator",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/biogenerator"),
});

// machine_designs.dm:185
rt.def("/datum/design/board/biogenerator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "biotech", 3, "materials", 3]);

	this.category = list("Hydroponics Machinery");
	return f.dot;
});

rt.type(2937, "/datum/design/board/hydroponics", "/datum/design/board", {
	name: "Machine Design (Hydroponics Tray Board)",
	desc: "The circuit board for a hydroponics tray.",
	id: "hydro_tray",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/hydroponics"),
});

// machine_designs.dm:193
rt.def("/datum/design/board/hydroponics/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["biotech", 2]);

	this.category = list("Hydroponics Machinery");
	return f.dot;
});

rt.type(2938, "/datum/design/board/destructive_analyzer", "/datum/design/board", {
	name: "Machine Design (Destructive Analyzer Board)",
	desc: "The circuit board for a destructive analyzer.",
	id: "destructive_analyzer",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/destructive_analyzer"),
});

// machine_designs.dm:201
rt.def("/datum/design/board/destructive_analyzer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "magnets", 2, "engineering", 2]);

	this.category = list("Research Machinery");
	return f.dot;
});

rt.type(2939, "/datum/design/board/experimentor", "/datum/design/board", {
	name: "Machine Design (E.X.P.E.R.I-MENTOR Board)",
	desc: "The circuit board for an E.X.P.E.R.I-MENTOR.",
	id: "experimentor",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/experimentor"),
});

// machine_designs.dm:209
rt.def("/datum/design/board/experimentor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "magnets", 2, "engineering", 2, "bluespace", 2]);

	this.category = list("Research Machinery");
	return f.dot;
});

rt.type(2940, "/datum/design/board/protolathe", "/datum/design/board", {
	name: "Machine Design (Protolathe Board)",
	desc: "The circuit board for a protolathe.",
	id: "protolathe",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/protolathe"),
});

// machine_designs.dm:217
rt.def("/datum/design/board/protolathe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2]);

	this.category = list("Research Machinery");
	return f.dot;
});

rt.type(2941, "/datum/design/board/circuit_imprinter", "/datum/design/board", {
	name: "Machine Design (Circuit Imprinter Board)",
	desc: "The circuit board for a circuit imprinter.",
	id: "circuit_imprinter",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/circuit_imprinter"),
});

// machine_designs.dm:225
rt.def("/datum/design/board/circuit_imprinter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2]);

	this.category = list("Research Machinery");
	return f.dot;
});

rt.type(2942, "/datum/design/board/rdservercontrol", "/datum/design/board", {
	name: "Computer Design (R&D Server Control Console Board)",
	desc: "The circuit board for an R&D Server Control Console.",
	id: "rdservercontrol",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/rdservercontrol"),
});

// machine_designs.dm:233
rt.def("/datum/design/board/rdservercontrol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3]);

	this.category = list("Research Machinery");
	return f.dot;
});

rt.type(2943, "/datum/design/board/rdserver", "/datum/design/board", {
	name: "Machine Design (R&D Server Board)",
	desc: "The circuit board for an R&D Server.",
	id: "rdserver",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/rdserver"),
});

// machine_designs.dm:241
rt.def("/datum/design/board/rdserver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3]);

	this.category = list("Research Machinery");
	return f.dot;
});

rt.type(2944, "/datum/design/board/mechfab", "/datum/design/board", {
	name: "Machine Design (Exosuit Fabricator Board)",
	desc: "The circuit board for an Exosuit Fabricator.",
	id: "mechfab",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/mechfab"),
});

// machine_designs.dm:249
rt.def("/datum/design/board/mechfab/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3, "engineering", 3]);

	this.category = list("Research Machinery");
	return f.dot;
});

rt.type(2945, "/datum/design/board/cyborgrecharger", "/datum/design/board", {
	name: "Machine Design (Cyborg Recharger Board)",
	desc: "The circuit board for a Cyborg Recharger.",
	id: "cyborgrecharger",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/cyborgrecharger"),
});

// machine_designs.dm:257
rt.def("/datum/design/board/cyborgrecharger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["powerstorage", 3, "engineering", 3]);

	this.category = list("Research Machinery");
	return f.dot;
});

rt.type(2946, "/datum/design/board/mech_recharger", "/datum/design/board", {
	name: "Machine Design (Mechbay Recharger Board)",
	desc: "The circuit board for a Mechbay Recharger.",
	id: "mech_recharger",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/mech_recharger"),
});

// machine_designs.dm:265
rt.def("/datum/design/board/mech_recharger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3, "powerstorage", 4, "engineering", 3]);

	this.category = list("Research Machinery");
	return f.dot;
});

rt.type(2947, "/datum/design/board/microwave", "/datum/design/board", {
	name: "Machine Design (Microwave Board)",
	desc: "The circuit board for a microwave.",
	id: "microwave",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/microwave"),
});

// machine_designs.dm:273
rt.def("/datum/design/board/microwave/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "magnets", 2]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2948, "/datum/design/board/gibber", "/datum/design/board", {
	name: "Machine Design (Gibber Board)",
	desc: "The circuit board for a gibber.",
	id: "gibber",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/gibber"),
});

// machine_designs.dm:281
rt.def("/datum/design/board/gibber/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2949, "/datum/design/board/smartfridge", "/datum/design/board", {
	name: "Machine Design (Smartfridge Board)",
	desc: "The circuit board for a smartfridge.",
	id: "smartfridge",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/smartfridge"),
});

// machine_designs.dm:289
rt.def("/datum/design/board/smartfridge/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 1]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2950, "/datum/design/board/monkey_recycler", "/datum/design/board", {
	name: "Machine Design (Monkey Recycler Board)",
	desc: "The circuit board for a monkey recycler.",
	id: "monkey_recycler",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/monkey_recycler"),
});

// machine_designs.dm:297
rt.def("/datum/design/board/monkey_recycler/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 1]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2951, "/datum/design/board/seed_extractor", "/datum/design/board", {
	name: "Machine Design (Seed Extractor Board)",
	desc: "The circuit board for a seed extractor.",
	id: "seed_extractor",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/seed_extractor"),
});

// machine_designs.dm:305
rt.def("/datum/design/board/seed_extractor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 1]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2952, "/datum/design/board/processor", "/datum/design/board", {
	name: "Machine Design (Processor Board)",
	desc: "The circuit board for a processor.",
	id: "processor",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/processor"),
});

// machine_designs.dm:313
rt.def("/datum/design/board/processor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 1]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2953, "/datum/design/board/recycler", "/datum/design/board", {
	name: "Machine Design (Recycler Board)",
	desc: "The circuit board for a recycler.",
	id: "recycler",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/recycler"),
});

// machine_designs.dm:321
rt.def("/datum/design/board/recycler/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2954, "/datum/design/board/holopad", "/datum/design/board", {
	name: "Machine Design (AI Holopad Board)",
	desc: "The circuit board for a holopad.",
	id: "holopad",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/holopad"),
});

// machine_designs.dm:329
rt.def("/datum/design/board/holopad/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 1]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2955, "/datum/design/board/autolathe", "/datum/design/board", {
	name: "Machine Design (Autolathe Board)",
	desc: "The circuit board for an autolathe.",
	id: "autolathe",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/autolathe"),
});

// machine_designs.dm:337
rt.def("/datum/design/board/autolathe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3, "engineering", 3]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2956, "/datum/design/board/recharger", "/datum/design/board", {
	name: "Machine Design (Weapon Recharger Board)",
	desc: "The circuit board for a Weapon Recharger.",
	id: "recharger",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/recharger"),
});

// machine_designs.dm:345
rt.def("/datum/design/board/recharger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["powerstorage", 4, "engineering", 3, "materials", 4]);
	this.materials = rt.alist(f, ["$glass", 1000, "$gold", 100]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2957, "/datum/design/board/vendor", "/datum/design/board", {
	name: "Machine Design (Vendor Board)",
	desc: "The circuit board for a Vendor.",
	id: "vendor",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/vendor"),
});

// machine_designs.dm:354
rt.def("/datum/design/board/vendor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 1]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2958, "/datum/design/board/ore_redemption", "/datum/design/board", {
	name: "Machine Design (Ore Redemption Board)",
	desc: "The circuit board for an Ore Redemption machine.",
	id: "ore_redemption",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/ore_redemption"),
});

// machine_designs.dm:362
rt.def("/datum/design/board/ore_redemption/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2, "plasmatech", 3]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2959, "/datum/design/board/mining_equipment_vendor", "/datum/design/board", {
	name: "Machine Design (Mining Rewards Vender Board)",
	desc: "The circuit board for a Mining Rewards Vender.",
	id: "mining_equipment_vendor",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/mining_equipment_vendor"),
});

// machine_designs.dm:370
rt.def("/datum/design/board/mining_equipment_vendor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["engineering", 3]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2960, "/datum/design/board/tesla_coil", "/datum/design/board", {
	name: "Machine Design (Tesla Coil Board)",
	desc: "The circuit board for a tesla coil.",
	id: "tesla_coil",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/tesla_coil"),
});

// machine_designs.dm:378
rt.def("/datum/design/board/tesla_coil/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3, "powerstorage", 3, "magnets", 3]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2961, "/datum/design/board/grounding_rod", "/datum/design/board", {
	name: "Machine Design (Grounding Rod Board)",
	desc: "The circuit board for a grounding rod.",
	id: "grounding_rod",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/grounding_rod"),
});

// machine_designs.dm:386
rt.def("/datum/design/board/grounding_rod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3, "powerstorage", 3, "magnets", 3, "plasmatech", 2]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2962, "/datum/design/board/plantgenes", "/datum/design/board", {
	name: "Machine Design (Plant DNA Manipulator Board)",
	desc: "The circuit board for a plant DNA manipulator.",
	id: "plantgenes",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/plantgenes"),
});

// machine_designs.dm:394
rt.def("/datum/design/board/plantgenes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 4, "biotech", 3]);

	this.category = list("Misc. Machinery");
	return f.dot;
});

rt.type(2963, "/datum/design/board/ntnet_relay", "/datum/design/board", {
	name: "Machine Design (NTNet Relay Board)",
	desc: "The circuit board for a wireless network relay.",
	id: "ntnet_relay",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/ntnet_relay"),
});

// machine_designs.dm:402
rt.def("/datum/design/board/ntnet_relay/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2, "bluespace", 2]);

	this.category = list("Subspace Telecomms");
	return f.dot;
});

rt.type(2964, "/datum/design/board/limbgrower", "/datum/design/board", {
	name: "Machine Design (Limb Grower Board)",
	desc: "The circuit board for a limb grower.",
	id: "limbgrower",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/limbgrower"),
});

// machine_designs.dm:410
rt.def("/datum/design/board/limbgrower/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 3, "biotech", 2]);

	this.category = list("Medical Machinery");
	return f.dot;
});

rt.type(2965, "/datum/design/board/deepfryer", "/datum/design/board", {
	name: "Machine Design (Deep Fryer)",
	desc: "The circuit board for a Deep Fryer.",
	id: "deepfryer",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/deep_fryer"),
});

// machine_designs.dm:418
rt.def("/datum/design/board/deepfryer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 1]);

	this.category = list("Misc. Machinery");
	return f.dot;
});
