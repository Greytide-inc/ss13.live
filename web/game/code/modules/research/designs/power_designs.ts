// From code/modules/research/designs/power_designs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3291, "/datum/design/basic_cell", "/datum/design", {
	name: "Basic Power Cell",
	desc: "A basic power cell that holds 1000 units of energy.",
	id: "basic_cell",
	req_tech: null,
	build_type: 22,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/cell"),
});

// /datum/design/basic_cell/proc/<init>  (code/modules/research/designs/power_designs.dm:9)
rt.def("/datum/design/basic_cell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 700, "$glass", 50]));
	rt.setSv(f, "category", rt.list("Misc", "Power Designs", "Machinery", "initial"));
	return f.dot;
});

rt.type(3292, "/datum/design/high_cell", "/datum/design", {
	name: "High-Capacity Power Cell",
	desc: "A power cell that holds 10000 units of energy.",
	id: "high_cell",
	req_tech: null,
	build_type: 22,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/cell/high"),
});

// /datum/design/high_cell/proc/<init>  (code/modules/research/designs/power_designs.dm:20)
rt.def("/datum/design/high_cell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 700, "$glass", 60]));
	rt.setSv(f, "category", rt.list("Misc", "Power Designs"));
	return f.dot;
});

rt.type(3293, "/datum/design/super_cell", "/datum/design", {
	name: "Super-Capacity Power Cell",
	desc: "A power cell that holds 20000 units of energy.",
	id: "super_cell",
	req_tech: null,
	build_type: 18,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/cell/super"),
});

// /datum/design/super_cell/proc/<init>  (code/modules/research/designs/power_designs.dm:31)
rt.def("/datum/design/super_cell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 3, "materials", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 700, "$glass", 70]));
	rt.setSv(f, "category", rt.list("Misc", "Power Designs"));
	return f.dot;
});

rt.type(3294, "/datum/design/hyper_cell", "/datum/design", {
	name: "Hyper-Capacity Power Cell",
	desc: "A power cell that holds 30000 units of energy.",
	id: "hyper_cell",
	req_tech: null,
	build_type: 18,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/cell/hyper"),
});

// /datum/design/hyper_cell/proc/<init>  (code/modules/research/designs/power_designs.dm:42)
rt.def("/datum/design/hyper_cell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 5, "materials", 5, "engineering", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 700, "$gold", 150, "$silver", 150, "$glass", 80]));
	rt.setSv(f, "category", rt.list("Misc", "Power Designs"));
	return f.dot;
});

rt.type(3295, "/datum/design/bluespace_cell", "/datum/design", {
	name: "Bluespace Power Cell",
	desc: "A power cell that holds 40000 units of energy.",
	id: "bluespace_cell",
	req_tech: null,
	build_type: 18,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/stock_parts/cell/bluespace"),
});

// /datum/design/bluespace_cell/proc/<init>  (code/modules/research/designs/power_designs.dm:53)
rt.def("/datum/design/bluespace_cell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 6, "materials", 5, "engineering", 5, "bluespace", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 800, "$gold", 120, "$glass", 160, "$diamond", 160, "$titanium", 300, "$bluespace", 100]));
	rt.setSv(f, "category", rt.list("Misc", "Power Designs"));
	return f.dot;
});

rt.type(3296, "/datum/design/light_replacer", "/datum/design", {
	name: "Light Replacer",
	desc: "A device to automatically replace lights. Refill with working lightbulbs.",
	id: "light_replacer",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/lightreplacer"),
});

// /datum/design/light_replacer/proc/<init>  (code/modules/research/designs/power_designs.dm:65)
rt.def("/datum/design/light_replacer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 3, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1500, "$silver", 150, "$glass", 3000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Power Designs"));
	return f.dot;
});

rt.type(3297, "/datum/design/inducer", "/datum/design", {
	name: "Inducer",
	desc: "The NT-75 Electromagnetic Power Inducer can wirelessly induce electric charge in an object, allowing you to recharge power cells without having to remove them.",
	id: "inducer",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/inducer/sci"),
});

// /datum/design/inducer/proc/<init>  (code/modules/research/designs/power_designs.dm:75)
rt.def("/datum/design/inducer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["powerstorage", 4, "engineering", 4, "magnets", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 3000, "$glass", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Power Designs"));
	return f.dot;
});

rt.type(2982, "/datum/design/board/pacman", "/datum/design/board", {
	name: "Machine Design (PACMAN-type Generator Board)",
	desc: "The circuit board that for a PACMAN-type portable generator.",
	id: "pacman",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/pacman"),
});

// /datum/design/board/pacman/proc/<init>  (code/modules/research/designs/power_designs.dm:85)
rt.def("/datum/design/board/pacman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "plasmatech", 3, "powerstorage", 3, "engineering", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Engineering Machinery"));
	return f.dot;
});

rt.type(2983, "/datum/design/board/pacman/super", "/datum/design/board/pacman", {
	name: "Machine Design (SUPERPACMAN-type Generator Board)",
	desc: "The circuit board that for a SUPERPACMAN-type portable generator.",
	id: "superpacman",
	req_tech: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/pacman/super"),
});

// /datum/design/board/pacman/super/proc/<init>  (code/modules/research/designs/power_designs.dm:93)
rt.def("/datum/design/board/pacman/super/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "powerstorage", 4, "engineering", 4]));
	return f.dot;
});

rt.type(2984, "/datum/design/board/pacman/mrs", "/datum/design/board/pacman", {
	name: "Machine Design (MRSPACMAN-type Generator Board)",
	desc: "The circuit board that for a MRSPACMAN-type portable generator.",
	id: "mrspacman",
	req_tech: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/pacman/mrs"),
});

// /datum/design/board/pacman/mrs/proc/<init>  (code/modules/research/designs/power_designs.dm:100)
rt.def("/datum/design/board/pacman/mrs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "powerstorage", 5, "engineering", 5, "plasmatech", 4]));
	return f.dot;
});
