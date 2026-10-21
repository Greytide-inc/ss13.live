// From code/modules/research/designs/mecha_designs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2966, "/datum/design/board/ripley_main", "/datum/design/board", {
	name: "APLU \"Ripley\" Central Control module",
	desc: "Allows for the construction of a \"Ripley\" Central Control module.",
	id: "ripley_main",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/ripley/main"),
});

// /datum/design/board/ripley_main/proc/<init>  (code/modules/research/designs/mecha_designs.dm:9)
rt.def("/datum/design/board/ripley_main/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2967, "/datum/design/board/ripley_peri", "/datum/design/board", {
	name: "APLU \"Ripley\" Peripherals Control module",
	desc: "Allows for the construction of a  \"Ripley\" Peripheral Control module.",
	id: "ripley_peri",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/ripley/peripherals"),
});

// /datum/design/board/ripley_peri/proc/<init>  (code/modules/research/designs/mecha_designs.dm:17)
rt.def("/datum/design/board/ripley_peri/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2968, "/datum/design/board/odysseus_main", "/datum/design/board", {
	name: "\"Odysseus\" Central Control module",
	desc: "Allows for the construction of a \"Odysseus\" Central Control module.",
	id: "odysseus_main",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/odysseus/main"),
});

// /datum/design/board/odysseus_main/proc/<init>  (code/modules/research/designs/mecha_designs.dm:26)
rt.def("/datum/design/board/odysseus_main/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "biotech", 3, "engineering", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2969, "/datum/design/board/odysseus_peri", "/datum/design/board", {
	name: "\"Odysseus\" Peripherals Control module",
	desc: "Allows for the construction of a \"Odysseus\" Peripheral Control module.",
	id: "odysseus_peri",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/odysseus/peripherals"),
});

// /datum/design/board/odysseus_peri/proc/<init>  (code/modules/research/designs/mecha_designs.dm:34)
rt.def("/datum/design/board/odysseus_peri/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "biotech", 3, "engineering", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2970, "/datum/design/board/gygax_main", "/datum/design/board", {
	name: "\"Gygax\" Central Control module",
	desc: "Allows for the construction of a \"Gygax\" Central Control module.",
	id: "gygax_main",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/gygax/main"),
});

// /datum/design/board/gygax_main/proc/<init>  (code/modules/research/designs/mecha_designs.dm:43)
rt.def("/datum/design/board/gygax_main/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "combat", 3, "engineering", 4]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2971, "/datum/design/board/gygax_peri", "/datum/design/board", {
	name: "\"Gygax\" Peripherals Control module",
	desc: "Allows for the construction of a \"Gygax\" Peripheral Control module.",
	id: "gygax_peri",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/gygax/peripherals"),
});

// /datum/design/board/gygax_peri/proc/<init>  (code/modules/research/designs/mecha_designs.dm:51)
rt.def("/datum/design/board/gygax_peri/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "combat", 3, "engineering", 4]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2972, "/datum/design/board/gygax_targ", "/datum/design/board", {
	name: "\"Gygax\" Weapons & Targeting Control module",
	desc: "Allows for the construction of a \"Gygax\" Weapons & Targeting Control module.",
	id: "gygax_targ",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/gygax/targeting"),
});

// /datum/design/board/gygax_targ/proc/<init>  (code/modules/research/designs/mecha_designs.dm:59)
rt.def("/datum/design/board/gygax_targ/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "combat", 4, "engineering", 4]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2973, "/datum/design/board/durand_main", "/datum/design/board", {
	name: "\"Durand\" Central Control module",
	desc: "Allows for the construction of a \"Durand\" Central Control module.",
	id: "durand_main",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/durand/main"),
});

// /datum/design/board/durand_main/proc/<init>  (code/modules/research/designs/mecha_designs.dm:68)
rt.def("/datum/design/board/durand_main/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "combat", 4, "engineering", 4]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2974, "/datum/design/board/durand_peri", "/datum/design/board", {
	name: "\"Durand\" Peripherals Control module",
	desc: "Allows for the construction of a \"Durand\" Peripheral Control module.",
	id: "durand_peri",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/durand/peripherals"),
});

// /datum/design/board/durand_peri/proc/<init>  (code/modules/research/designs/mecha_designs.dm:76)
rt.def("/datum/design/board/durand_peri/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "combat", 4, "engineering", 4]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2975, "/datum/design/board/durand_targ", "/datum/design/board", {
	name: "\"Durand\" Weapons & Targeting Control module",
	desc: "Allows for the construction of a \"Durand\" Weapons & Targeting Control module.",
	id: "durand_targ",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/durand/targeting"),
});

// /datum/design/board/durand_targ/proc/<init>  (code/modules/research/designs/mecha_designs.dm:84)
rt.def("/datum/design/board/durand_targ/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "combat", 4, "engineering", 4]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2976, "/datum/design/board/honker_main", "/datum/design/board", {
	name: "\"H.O.N.K\" Central Control module",
	desc: "Allows for the construction of a \"H.O.N.K\" Central Control module.",
	id: "honker_main",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/honker/main"),
});

// /datum/design/board/honker_main/proc/<init>  (code/modules/research/designs/mecha_designs.dm:93)
rt.def("/datum/design/board/honker_main/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "engineering", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2977, "/datum/design/board/honker_peri", "/datum/design/board", {
	name: "\"H.O.N.K\" Peripherals Control module",
	desc: "Allows for the construction of a \"H.O.N.K\" Peripheral Control module.",
	id: "honker_peri",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/honker/peripherals"),
});

// /datum/design/board/honker_peri/proc/<init>  (code/modules/research/designs/mecha_designs.dm:101)
rt.def("/datum/design/board/honker_peri/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "engineering", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2978, "/datum/design/board/honker_targ", "/datum/design/board", {
	name: "\"H.O.N.K\" Weapons & Targeting Control module",
	desc: "Allows for the construction of a \"H.O.N.K\" Weapons & Targeting Control module.",
	id: "honker_targ",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/honker/targeting"),
});

// /datum/design/board/honker_targ/proc/<init>  (code/modules/research/designs/mecha_designs.dm:109)
rt.def("/datum/design/board/honker_targ/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "engineering", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2979, "/datum/design/board/phazon_main", "/datum/design/board", {
	name: "\"Phazon\" Central Control module",
	desc: "Allows for the construction of a \"Phazon\" Central Control module.",
	id: "phazon_main",
	materials: null,
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/phazon/main"),
});

// /datum/design/board/phazon_main/proc/<init>  (code/modules/research/designs/mecha_designs.dm:118)
rt.def("/datum/design/board/phazon_main/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$bluespace", 100]));
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 6, "materials", 6, "plasmatech", 5]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2980, "/datum/design/board/phazon_peri", "/datum/design/board", {
	name: "\"Phazon\" Peripherals Control module",
	desc: "Allows for the construction of a \"Phazon\" Peripheral Control module.",
	id: "phazon_peri",
	materials: null,
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/phazon/peripherals"),
});

// /datum/design/board/phazon_peri/proc/<init>  (code/modules/research/designs/mecha_designs.dm:127)
rt.def("/datum/design/board/phazon_peri/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$bluespace", 100]));
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 6, "bluespace", 5, "plasmatech", 5]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(2981, "/datum/design/board/phazon_targ", "/datum/design/board", {
	name: "\"Phazon\" Weapons & Targeting Control module",
	desc: "Allows for the construction of a \"Phazon\" Weapons & Targeting Control module.",
	id: "phazon_targ",
	materials: null,
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/mecha/phazon/targeting"),
});

// /datum/design/board/phazon_targ/proc/<init>  (code/modules/research/designs/mecha_designs.dm:136)
rt.def("/datum/design/board/phazon_targ/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$bluespace", 100]));
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 6, "magnets", 5, "plasmatech", 5]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Modules"));
	return f.dot;
});

rt.type(3146, "/datum/design/mech_scattershot", "/datum/design", {
	name: "Exosuit Weapon (LBX AC 10 \"Scattershot\")",
	desc: "Allows for the construction of LBX AC 10.",
	id: "mech_scattershot",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/scattershot"),
});

// /datum/design/mech_scattershot/proc/<init>  (code/modules/research/designs/mecha_designs.dm:150)
rt.def("/datum/design/mech_scattershot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3147, "/datum/design/mech_carbine", "/datum/design", {
	name: "Exosuit Weapon (FNX-99 \"Hades\" Carbine)",
	desc: "Allows for the construction of FNX-99 \"Hades\" Carbine.",
	id: "mech_carbine",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/carbine"),
});

// /datum/design/mech_carbine/proc/<init>  (code/modules/research/designs/mecha_designs.dm:161)
rt.def("/datum/design/mech_carbine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 5, "materials", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3148, "/datum/design/mech_ion", "/datum/design", {
	name: "Exosuit Weapon (MKIV Ion Heavy Cannon)",
	desc: "Allows for the construction of MKIV Ion Heavy Cannon.",
	id: "mech_ion",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/energy/ion"),
});

// /datum/design/mech_ion/proc/<init>  (code/modules/research/designs/mecha_designs.dm:172)
rt.def("/datum/design/mech_ion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 6, "magnets", 5, "materials", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$silver", 6000, "$uranium", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3149, "/datum/design/mech_tesla", "/datum/design", {
	name: "Exosuit Weapon (MKI Tesla Cannon)",
	desc: "Allows for the construction of MKI Tesla Cannon.",
	id: "mech_tesla",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/energy/tesla"),
});

// /datum/design/mech_tesla/proc/<init>  (code/modules/research/designs/mecha_designs.dm:183)
rt.def("/datum/design/mech_tesla/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 6, "magnets", 5, "materials", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$silver", 8000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3150, "/datum/design/mech_laser", "/datum/design", {
	name: "Exosuit Weapon (CH-PS \"Immolator\" Laser)",
	desc: "Allows for the construction of CH-PS Laser.",
	id: "mech_laser",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/energy/laser"),
});

// /datum/design/mech_laser/proc/<init>  (code/modules/research/designs/mecha_designs.dm:194)
rt.def("/datum/design/mech_laser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 3, "magnets", 3, "engineering", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3151, "/datum/design/mech_laser_heavy", "/datum/design", {
	name: "Exosuit Weapon (CH-LC \"Solaris\" Laser Cannon)",
	desc: "Allows for the construction of CH-LC Laser Cannon.",
	id: "mech_laser_heavy",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/energy/laser/heavy"),
});

// /datum/design/mech_laser_heavy/proc/<init>  (code/modules/research/designs/mecha_designs.dm:205)
rt.def("/datum/design/mech_laser_heavy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 4, "magnets", 4, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3152, "/datum/design/mech_grenade_launcher", "/datum/design", {
	name: "Exosuit Weapon (SGL-6 Grenade Launcher)",
	desc: "Allows for the construction of SGL-6 Grenade Launcher.",
	id: "mech_grenade_launcher",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/flashbang"),
});

// /datum/design/mech_grenade_launcher/proc/<init>  (code/modules/research/designs/mecha_designs.dm:216)
rt.def("/datum/design/mech_grenade_launcher/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 4, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 22000, "$gold", 6000, "$silver", 8000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3153, "/datum/design/mech_missile_rack", "/datum/design", {
	name: "Exosuit Weapon (SRM-8 Missile Rack)",
	desc: "Allows for the construction of SRM-8 Missile Rack.",
	id: "mech_missile_rack",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/missile_rack"),
});

// /datum/design/mech_missile_rack/proc/<init>  (code/modules/research/designs/mecha_designs.dm:227)
rt.def("/datum/design/mech_missile_rack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 6, "materials", 5, "engineering", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 22000, "$gold", 6000, "$silver", 8000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3154, "/datum/design/clusterbang_launcher", "/datum/design", {
	name: "Exosuit Module (SOB-3 Clusterbang Launcher)",
	desc: "A weapon that violates the Geneva Convention at 3 rounds per minute",
	id: "clusterbang_launcher",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/flashbang/clusterbang"),
});

// /datum/design/clusterbang_launcher/proc/<init>  (code/modules/research/designs/mecha_designs.dm:238)
rt.def("/datum/design/clusterbang_launcher/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 5, "materials", 5, "syndicate", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$gold", 10000, "$uranium", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3155, "/datum/design/mech_wormhole_gen", "/datum/design", {
	name: "Exosuit Module (Localized Wormhole Generator)",
	desc: "An exosuit module that allows generating of small quasi-stable wormholes.",
	id: "mech_wormhole_gen",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/wormhole_generator"),
});

// /datum/design/mech_wormhole_gen/proc/<init>  (code/modules/research/designs/mecha_designs.dm:249)
rt.def("/datum/design/mech_wormhole_gen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["bluespace", 4, "magnets", 4, "plasmatech", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3156, "/datum/design/mech_teleporter", "/datum/design", {
	name: "Exosuit Module (Teleporter Module)",
	desc: "An exosuit module that allows exosuits to teleport to any position in view.",
	id: "mech_teleporter",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/teleporter"),
});

// /datum/design/mech_teleporter/proc/<init>  (code/modules/research/designs/mecha_designs.dm:260)
rt.def("/datum/design/mech_teleporter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["bluespace", 8, "magnets", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$diamond", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3157, "/datum/design/mech_rcd", "/datum/design", {
	name: "Exosuit Module (RCD Module)",
	desc: "An exosuit-mounted Rapid Construction Device.",
	id: "mech_rcd",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 1200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/rcd"),
});

// /datum/design/mech_rcd/proc/<init>  (code/modules/research/designs/mecha_designs.dm:271)
rt.def("/datum/design/mech_rcd/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "bluespace", 3, "magnets", 4, "powerstorage", 4, "engineering", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30000, "$gold", 20000, "$plasma", 25000, "$silver", 20000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3158, "/datum/design/mech_gravcatapult", "/datum/design", {
	name: "Exosuit Module (Gravitational Catapult Module)",
	desc: "An exosuit mounted Gravitational Catapult.",
	id: "mech_gravcatapult",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/gravcatapult"),
});

// /datum/design/mech_gravcatapult/proc/<init>  (code/modules/research/designs/mecha_designs.dm:282)
rt.def("/datum/design/mech_gravcatapult/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["bluespace", 4, "magnets", 3, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3159, "/datum/design/mech_repair_droid", "/datum/design", {
	name: "Exosuit Module (Repair Droid Module)",
	desc: "Automated Repair Droid. BEEP BOOP",
	id: "mech_repair_droid",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/repair_droid"),
});

// /datum/design/mech_repair_droid/proc/<init>  (code/modules/research/designs/mecha_designs.dm:293)
rt.def("/datum/design/mech_repair_droid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 3, "programming", 3, "engineering", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 5000, "$gold", 1000, "$silver", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3160, "/datum/design/mech_energy_relay", "/datum/design", {
	name: "Exosuit Module (Tesla Energy Relay)",
	desc: "Tesla Energy Relay",
	id: "mech_energy_relay",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay"),
});

// /datum/design/mech_energy_relay/proc/<init>  (code/modules/research/designs/mecha_designs.dm:304)
rt.def("/datum/design/mech_energy_relay/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 4, "powerstorage", 5, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 2000, "$gold", 2000, "$silver", 3000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3161, "/datum/design/mech_ccw_armor", "/datum/design", {
	name: "Exosuit Module (Reactive Armor Booster Module)",
	desc: "Exosuit-mounted armor booster.",
	id: "mech_ccw_armor",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/anticcw_armor_booster"),
});

// /datum/design/mech_ccw_armor/proc/<init>  (code/modules/research/designs/mecha_designs.dm:315)
rt.def("/datum/design/mech_ccw_armor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "combat", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$silver", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3162, "/datum/design/mech_proj_armor", "/datum/design", {
	name: "Exosuit Module (Reflective Armor Booster Module)",
	desc: "Exosuit-mounted armor booster.",
	id: "mech_proj_armor",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster"),
});

// /datum/design/mech_proj_armor/proc/<init>  (code/modules/research/designs/mecha_designs.dm:326)
rt.def("/datum/design/mech_proj_armor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "combat", 5, "engineering", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$gold", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3163, "/datum/design/mech_diamond_drill", "/datum/design", {
	name: "Exosuit Module (Diamond Mining Drill)",
	desc: "An upgraded version of the standard drill.",
	id: "mech_diamond_drill",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/drill/diamonddrill"),
});

// /datum/design/mech_diamond_drill/proc/<init>  (code/modules/research/designs/mecha_designs.dm:337)
rt.def("/datum/design/mech_diamond_drill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$diamond", 6500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3164, "/datum/design/mech_generator_nuclear", "/datum/design", {
	name: "Exosuit Module (ExoNuclear Reactor)",
	desc: "Compact nuclear reactor module.",
	id: "mech_generator_nuclear",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/generator/nuclear"),
});

// /datum/design/mech_generator_nuclear/proc/<init>  (code/modules/research/designs/mecha_designs.dm:348)
rt.def("/datum/design/mech_generator_nuclear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 5, "engineering", 4, "materials", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 1000, "$silver", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3165, "/datum/design/mech_plasma_cutter", "/datum/design", {
	name: "Exosuit Module Design (217-D Heavy Plasma Cutter)",
	desc: "A device that shoots resonant plasma bursts at extreme velocity. The blasts are capable of crushing rock and demolishing solid obstacles.",
	id: "mech_plasma_cutter",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/energy/plasma"),
});

// /datum/design/mech_plasma_cutter/proc/<init>  (code/modules/research/designs/mecha_designs.dm:359)
rt.def("/datum/design/mech_plasma_cutter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 3, "materials", 3, "plasmatech", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 8000, "$glass", 1000, "$plasma", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3166, "/datum/design/mech_taser", "/datum/design", {
	name: "Exosuit Weapon (PBT \"Pacifier\" Mounted Taser)",
	desc: "A weapon for combat exosuits. Shoots non-lethal stunning electrodes.",
	id: "mech_taser",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/energy/taser"),
});

// /datum/design/mech_taser/proc/<init>  (code/modules/research/designs/mecha_designs.dm:370)
rt.def("/datum/design/mech_taser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3167, "/datum/design/mech_lmg", "/datum/design", {
	name: "Exosuit Weapon (\"Ultra AC 2\" LMG)",
	desc: "A weapon for combat exosuits. Shoots a rapid, three shot burst.",
	id: "mech_lmg",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/lmg"),
});

// /datum/design/mech_lmg/proc/<init>  (code/modules/research/designs/mecha_designs.dm:381)
rt.def("/datum/design/mech_lmg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3168, "/datum/design/mech_sleeper", "/datum/design", {
	name: "Exosuit Medical Equipment (Mounted Sleeper)",
	desc: "Equipment for medical exosuits. A mounted sleeper that stabilizes patients and can inject reagents in the exosuit's reserves.",
	id: "mech_sleeper",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/medical/sleeper"),
});

// /datum/design/mech_sleeper/proc/<init>  (code/modules/research/designs/mecha_designs.dm:392)
rt.def("/datum/design/mech_sleeper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["biotech", 3, "engineering", 3, "plasmatech", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$glass", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3169, "/datum/design/mech_syringe_gun", "/datum/design", {
	name: "Exosuit Medical Equipment (Syringe Gun)",
	desc: "Equipment for medical exosuits. A chem synthesizer with syringe gun. Reagents inside are held in stasis, so no reactions will occur.",
	id: "mech_syringe_gun",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun"),
});

// /datum/design/mech_syringe_gun/proc/<init>  (code/modules/research/designs/mecha_designs.dm:403)
rt.def("/datum/design/mech_syringe_gun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 4, "biotech", 4, "combat", 3, "materials", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 3000, "$glass", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3170, "/datum/design/mech_medical_beamgun", "/datum/design", {
	name: "Exosuit Medical Equipment (Medical Beamgun)",
	desc: "Equipment for medical exosuits. A mounted medical nanite projector which will treat patients with a focused beam.",
	id: "mech_medi_beam",
	req_tech: null,
	build_type: 16,
	materials: null,
	construction_time: 250,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam"),
});

// /datum/design/mech_medical_beamgun/proc/<init>  (code/modules/research/designs/mecha_designs.dm:413)
rt.def("/datum/design/mech_medical_beamgun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 6, "materials", 7, "powerstorage", 5, "biotech", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$glass", 8000, "$plasma", 3000, "$gold", 8000, "$diamond", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});
