// Based on /tg/station's code/modules/cargo/exports/seeds.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2046, "/datum/export/seed", "/datum/export", {
	needs_discovery: 0,
	cost: 100,
	k_elasticity: 1,
	unit_name: "new plant species sample",
	export_types: null,
}, { global: { discoveredPlants: 659 } });

// seeds.dm:5
rt.def("/datum/export/seed/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/seeds"));
	return f.dot;
});

// seeds.dm:10
rt.def("/datum/export/seed/proc/get_cost", function get_cost(f: Frame, O: Value) {
	let S: Value = O;
	if (!this.needs_discovery && rt.isIn(f, S.type, GLOB.discoveredPlants)) {
		return 0;
	}
	if (this.needs_discovery && !rt.isIn(f, S.type, GLOB.discoveredPlants)) {
		return 0;
	}
	return parent_proc() * S.rarity;
}, false);

// seeds.dm:18
rt.def("/datum/export/seed/proc/sell_object", function sell_object(f: Frame, O: Value) {
	parent_proc();
	let S: Value = O;
	rt.setAt(GLOB.discoveredPlants, S.type, S.potency);
	return f.dot;
}, false);

rt.type(2047, "/datum/export/seed/potency", "/datum/export/seed", {
	cost: 2.5,
	unit_name: "improved plant sample",
	needs_discovery: 1,
	export_types: null,
});

// seeds.dm:26
rt.def("/datum/export/seed/potency/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list(T("/obj/item/seeds"));
	return f.dot;
});

// seeds.dm:30
rt.def("/datum/export/seed/potency/proc/get_cost", function get_cost(f: Frame, O: Value) {
	let cost: Value = null;
	let S: Value = O;
	if (!(cost = parent_proc())) {
		return 0;
	}
	let potDiff: Value = S.potency - rt.index(GLOB.discoveredPlants, S.type);
	return round(parent_proc() * potDiff);
}, false);
