// From code/modules/research/designs/comp_board_designs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2864, "/datum/design/board", "/datum/design", {
	name: "Computer Design (Battle Arcade Machine)",
	desc: "Allows for the construction of circuit boards used to build a new arcade machine.",
	id: "arcade_battle",
	req_tech: null,
	build_type: 1,
	materials: null,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/arcade/battle"),
});

// /datum/design/board/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:7)
rt.def("/datum/design/board/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000]));
	rt.setSv(f, "reagents_list", rt.alist(f, ["sacid", 20]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2881, "/datum/design/board/orion_trail", "/datum/design/board", {
	name: "Computer Design (Orion Trail Arcade Machine)",
	desc: "Allows for the construction of circuit boards used to build a new Orion Trail machine.",
	id: "arcade_orion",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/arcade/orion_trail"),
});

// /datum/design/board/orion_trail/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:18)
rt.def("/datum/design/board/orion_trail/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 1]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2882, "/datum/design/board/seccamera", "/datum/design/board", {
	name: "Computer Design (Security Camera)",
	desc: "Allows for the construction of circuit boards used to build security camera computers.",
	id: "seccamera",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/security"),
});

// /datum/design/board/seccamera/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:27)
rt.def("/datum/design/board/seccamera/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "combat", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2883, "/datum/design/board/xenobiocamera", "/datum/design/board", {
	name: "Computer Design (Xenobiology Console)",
	desc: "Allows for the construction of circuit boards used to build xenobiology camera computers.",
	id: "xenobioconsole",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/xenobiology"),
});

// /datum/design/board/xenobiocamera/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:35)
rt.def("/datum/design/board/xenobiocamera/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "biotech", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2884, "/datum/design/board/aiupload", "/datum/design/board", {
	name: "Computer Design (AI Upload)",
	desc: "Allows for the construction of circuit boards used to build an AI Upload Console.",
	id: "aiupload",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/aiupload"),
});

// /datum/design/board/aiupload/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:43)
rt.def("/datum/design/board/aiupload/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "engineering", 4]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2885, "/datum/design/board/borgupload", "/datum/design/board", {
	name: "Computer Design (Cyborg Upload)",
	desc: "Allows for the construction of circuit boards used to build a Cyborg Upload Console.",
	id: "borgupload",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/borgupload"),
});

// /datum/design/board/borgupload/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:51)
rt.def("/datum/design/board/borgupload/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "engineering", 4]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2886, "/datum/design/board/med_data", "/datum/design/board", {
	name: "Computer Design (Medical Records)",
	desc: "Allows for the construction of circuit boards used to build a medical records console.",
	id: "med_data",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/med_data"),
});

// /datum/design/board/med_data/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:59)
rt.def("/datum/design/board/med_data/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "biotech", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2887, "/datum/design/board/operating", "/datum/design/board", {
	name: "Computer Design (Operating Computer)",
	desc: "Allows for the construction of circuit boards used to build an operating computer console.",
	id: "operating",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/operating"),
});

// /datum/design/board/operating/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:67)
rt.def("/datum/design/board/operating/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "biotech", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2888, "/datum/design/board/pandemic", "/datum/design/board", {
	name: "Computer Design (PanD.E.M.I.C. 2200)",
	desc: "Allows for the construction of circuit boards used to build a PanD.E.M.I.C. 2200 console.",
	id: "pandemic",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/pandemic"),
});

// /datum/design/board/pandemic/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:75)
rt.def("/datum/design/board/pandemic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "biotech", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2889, "/datum/design/board/scan_console", "/datum/design/board", {
	name: "Computer Design (DNA Machine)",
	desc: "Allows for the construction of circuit boards used to build a new DNA scanning console.",
	id: "scan_console",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/scan_consolenew"),
});

// /datum/design/board/scan_console/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:83)
rt.def("/datum/design/board/scan_console/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "biotech", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2890, "/datum/design/board/comconsole", "/datum/design/board", {
	name: "Computer Design (Communications)",
	desc: "Allows for the construction of circuit boards used to build a communications console.",
	id: "comconsole",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/communications"),
});

// /datum/design/board/comconsole/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:91)
rt.def("/datum/design/board/comconsole/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "magnets", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2891, "/datum/design/board/idcardconsole", "/datum/design/board", {
	name: "Computer Design (ID Console)",
	desc: "Allows for the construction of circuit boards used to build an ID computer.",
	id: "idcardconsole",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/card"),
});

// /datum/design/board/idcardconsole/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:99)
rt.def("/datum/design/board/idcardconsole/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2892, "/datum/design/board/crewconsole", "/datum/design/board", {
	name: "Computer Design (Crew monitoring computer)",
	desc: "Allows for the construction of circuit boards used to build a Crew monitoring computer.",
	id: "crewconsole",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/crew"),
});

// /datum/design/board/crewconsole/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:107)
rt.def("/datum/design/board/crewconsole/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "magnets", 2, "biotech", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2893, "/datum/design/board/secdata", "/datum/design/board", {
	name: "Computer Design (Security Records Console)",
	desc: "Allows for the construction of circuit boards used to build a security records console.",
	id: "secdata",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/secure_data"),
});

// /datum/design/board/secdata/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:115)
rt.def("/datum/design/board/secdata/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "combat", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2894, "/datum/design/board/atmosalerts", "/datum/design/board", {
	name: "Computer Design (Atmosphere Alert)",
	desc: "Allows for the construction of circuit boards used to build an atmosphere alert console.",
	id: "atmosalerts",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/atmos_alert"),
});

// /datum/design/board/atmosalerts/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:123)
rt.def("/datum/design/board/atmosalerts/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2895, "/datum/design/board/atmos_control", "/datum/design/board", {
	name: "Computer Design (Atmospheric Monitor)",
	desc: "Allows for the construction of circuit boards used to build an Atmospheric Monitor.",
	id: "atmos_control",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/atmos_control"),
});

// /datum/design/board/atmos_control/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:131)
rt.def("/datum/design/board/atmos_control/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2896, "/datum/design/board/robocontrol", "/datum/design/board", {
	name: "Computer Design (Robotics Control Console)",
	desc: "Allows for the construction of circuit boards used to build a Robotics Control console.",
	id: "robocontrol",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/robotics"),
});

// /datum/design/board/robocontrol/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:139)
rt.def("/datum/design/board/robocontrol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2897, "/datum/design/board/slot_machine", "/datum/design/board", {
	name: "Computer Design (Slot Machine)",
	desc: "Allows for the construction of circuit boards used to build a new slot machine.",
	id: "slotmachine",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/slot_machine"),
});

// /datum/design/board/slot_machine/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:147)
rt.def("/datum/design/board/slot_machine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 1]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2898, "/datum/design/board/powermonitor", "/datum/design/board", {
	name: "Computer Design (Power Monitor)",
	desc: "Allows for the construction of circuit boards used to build a new power monitor.",
	id: "powermonitor",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/powermonitor"),
});

// /datum/design/board/powermonitor/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:155)
rt.def("/datum/design/board/powermonitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "powerstorage", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2899, "/datum/design/board/solarcontrol", "/datum/design/board", {
	name: "Computer Design (Solar Control)",
	desc: "Allows for the construction of circuit boards used to build a solar control console.",
	id: "solarcontrol",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/solar_control"),
});

// /datum/design/board/solarcontrol/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:163)
rt.def("/datum/design/board/solarcontrol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "powerstorage", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2900, "/datum/design/board/prisonmanage", "/datum/design/board", {
	name: "Computer Design (Prisoner Management Console)",
	desc: "Allows for the construction of circuit boards used to build a prisoner management console.",
	id: "prisonmanage",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/prisoner"),
});

// /datum/design/board/prisonmanage/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:171)
rt.def("/datum/design/board/prisonmanage/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2901, "/datum/design/board/mechacontrol", "/datum/design/board", {
	name: "Computer Design (Exosuit Control Console)",
	desc: "Allows for the construction of circuit boards used to build an exosuit control console.",
	id: "mechacontrol",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/mecha_control"),
});

// /datum/design/board/mechacontrol/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:179)
rt.def("/datum/design/board/mechacontrol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2902, "/datum/design/board/mechapower", "/datum/design/board", {
	name: "Computer Design (Mech Bay Power Control Console)",
	desc: "Allows for the construction of circuit boards used to build a mech bay power control console.",
	id: "mechapower",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/mech_bay_power_console"),
});

// /datum/design/board/mechapower/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:187)
rt.def("/datum/design/board/mechapower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "powerstorage", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2903, "/datum/design/board/rdconsole", "/datum/design/board", {
	name: "Computer Design (R&D Console)",
	desc: "Allows for the construction of circuit boards used to build a new R&D console.",
	id: "rdconsole",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/rdconsole"),
});

// /datum/design/board/rdconsole/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:195)
rt.def("/datum/design/board/rdconsole/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2904, "/datum/design/board/cargo", "/datum/design/board", {
	name: "Computer Design (Supply Console)",
	desc: "Allows for the construction of circuit boards used to build a Supply Console.",
	id: "cargo",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/cargo"),
});

// /datum/design/board/cargo/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:203)
rt.def("/datum/design/board/cargo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2905, "/datum/design/board/cargorequest", "/datum/design/board", {
	name: "Computer Design (Supply Request Console)",
	desc: "Allows for the construction of circuit boards used to build a Supply Request Console.",
	id: "cargorequest",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/cargo/request"),
});

// /datum/design/board/cargorequest/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:211)
rt.def("/datum/design/board/cargorequest/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2906, "/datum/design/board/stockexchange", "/datum/design/board", {
	name: "Computer Design (Stock Exchange Console)",
	desc: "Allows for the construction of circuit boards used to build a Stock Exchange Console.",
	id: "stockexchange",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/stockexchange"),
});

// /datum/design/board/stockexchange/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:219)
rt.def("/datum/design/board/stockexchange/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2907, "/datum/design/board/mining", "/datum/design/board", {
	name: "Computer Design (Outpost Status Display)",
	desc: "Allows for the construction of circuit boards used to build an outpost status display console.",
	id: "mining",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/mining"),
});

// /datum/design/board/mining/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:227)
rt.def("/datum/design/board/mining/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2908, "/datum/design/board/comm_monitor", "/datum/design/board", {
	name: "Computer Design (Telecommunications Monitoring Console)",
	desc: "Allows for the construction of circuit boards used to build a telecommunications monitor.",
	id: "comm_monitor",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/comm_monitor"),
});

// /datum/design/board/comm_monitor/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:235)
rt.def("/datum/design/board/comm_monitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "magnets", 3, "bluespace", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2909, "/datum/design/board/comm_server", "/datum/design/board", {
	name: "Computer Design (Telecommunications Server Monitoring Console)",
	desc: "Allows for the construction of circuit boards used to build a telecommunication server browser and monitor.",
	id: "comm_server",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/comm_server"),
});

// /datum/design/board/comm_server/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:243)
rt.def("/datum/design/board/comm_server/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "magnets", 3, "bluespace", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2910, "/datum/design/board/message_monitor", "/datum/design/board", {
	name: "Computer Design (Messaging Monitor Console)",
	desc: "Allows for the construction of circuit boards used to build a messaging monitor console.",
	id: "message_monitor",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/message_monitor"),
});

// /datum/design/board/message_monitor/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:251)
rt.def("/datum/design/board/message_monitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2911, "/datum/design/board/aifixer", "/datum/design/board", {
	name: "Computer Design (AI Integrity Restorer)",
	desc: "Allows for the construction of circuit boards used to build an AI Integrity Restorer.",
	id: "aifixer",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/aifixer"),
});

// /datum/design/board/aifixer/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:259)
rt.def("/datum/design/board/aifixer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "magnets", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2912, "/datum/design/board/libraryconsole", "/datum/design/board", {
	name: "Computer Design (Library Console)",
	desc: "Allows for the construction of circuit boards used to build a new library console.",
	id: "libraryconsole",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/libraryconsole"),
});

// /datum/design/board/libraryconsole/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:267)
rt.def("/datum/design/board/libraryconsole/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 1]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});

rt.type(2913, "/datum/design/board/apc_control", "/datum/design/board", {
	name: "Computer Design (APC Control)",
	desc: "Allows for the construction of circuit boards used to build a new APC control console.",
	id: "apc_control",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/computer/apc_control"),
});

// /datum/design/board/apc_control/proc/<init>  (code/modules/research/designs/comp_board_designs.dm:275)
rt.def("/datum/design/board/apc_control/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "engineering", 4, "powerstorage", 5]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Computer Boards"));
	return f.dot;
});
