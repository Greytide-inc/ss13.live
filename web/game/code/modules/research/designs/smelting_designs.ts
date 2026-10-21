// From code/modules/research/designs/smelting_designs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3298, "/datum/design/plasteel_alloy", "/datum/design", {
	name: "Plasma + Iron alloy",
	id: "plasteel",
	build_type: 128,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/stack/sheet/plasteel"),
});

// /datum/design/plasteel_alloy/proc/<init>  (code/modules/research/designs/smelting_designs.dm:7)
rt.def("/datum/design/plasteel_alloy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000, "$plasma", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("initial"));
	return f.dot;
});

rt.type(3299, "/datum/design/plastitanium_alloy", "/datum/design", {
	name: "Plasma + Titanium alloy",
	id: "plastitanium",
	build_type: 128,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/stack/sheet/mineral/plastitanium"),
});

// /datum/design/plastitanium_alloy/proc/<init>  (code/modules/research/designs/smelting_designs.dm:16)
rt.def("/datum/design/plastitanium_alloy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$titanium", 2000, "$plasma", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("initial"));
	return f.dot;
});

rt.type(3300, "/datum/design/alienalloy", "/datum/design", {
	name: "Alien Alloy",
	desc: "A sheet of reverse-engineered alien alloy.",
	id: "alienalloy",
	req_tech: null,
	build_type: 130,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
});

// /datum/design/alienalloy/proc/<init>  (code/modules/research/designs/smelting_designs.dm:24)
rt.def("/datum/design/alienalloy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["abductor", 1, "materials", 7, "plasmatech", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000, "$plasma", 4000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Stock Parts"));
	return f.dot;
});
