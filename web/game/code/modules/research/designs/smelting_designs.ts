// Based on /tg/station's code/modules/research/designs/smelting_designs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(3298, "/datum/design/plasteel_alloy", "/datum/design", {
	name: "Plasma + Iron alloy",
	id: "plasteel",
	build_type: 128,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/stack/sheet/plasteel"),
});

// smelting_designs.dm:7
rt.def("/datum/design/plasteel_alloy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 2000, "$plasma", 2000]);

	this.category = list("initial");
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

// smelting_designs.dm:16
rt.def("/datum/design/plastitanium_alloy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$titanium", 2000, "$plasma", 2000]);

	this.category = list("initial");
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

// smelting_designs.dm:24
rt.def("/datum/design/alienalloy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["abductor", 1, "materials", 7, "plasmatech", 2]);
	this.materials = rt.alist(f, ["$metal", 4000, "$plasma", 4000]);

	this.category = list("Stock Parts");
	return f.dot;
});
