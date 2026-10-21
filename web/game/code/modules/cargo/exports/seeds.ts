// From code/modules/cargo/exports/seeds.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2046, "/datum/export/seed", "/datum/export", {
	needs_discovery: 0,
	cost: 100,
	k_elasticity: 1,
	unit_name: "new plant species sample",
	export_types: null,
}, { global: { discoveredPlants: 659 } });

// /datum/export/seed/proc/<init>  (code/modules/cargo/exports/seeds.dm:5)
rt.def("/datum/export/seed/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/seeds")));
	return f.dot;
});

// /datum/export/seed/proc/get_cost  (code/modules/cargo/exports/seeds.dm:10)
rt.def("/datum/export/seed/proc/get_cost", function get_cost(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	S = live(f.args[0]);
	if ((!truthy(rt.sv(f, "needs_discovery")) && truthy((rt.isIn(f, rt.fv(f, "type", live(S)), rt.gl("discoveredPlants")) ? 1 : 0)))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "needs_discovery")) && !truthy((rt.isIn(f, rt.fv(f, "type", live(S)), rt.gl("discoveredPlants")) ? 1 : 0)))) {
		return 0;
	}
	return multiply(rt.callSuper(f, [], rt.Args.Same), rt.fv(f, "rarity", live(S)));
}, false, { args: ["O"] });

// /datum/export/seed/proc/sell_object  (code/modules/cargo/exports/seeds.dm:18)
rt.def("/datum/export/seed/proc/sell_object", function sell_object(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	rt.callSuper(f, [], rt.Args.Same);
	S = live(f.args[0]);
	rt.setAt(rt.gl("discoveredPlants"), rt.fv(f, "type", live(S)), rt.fv(f, "potency", live(S)));
	return f.dot;
}, false, { args: ["O"] });

rt.type(2047, "/datum/export/seed/potency", "/datum/export/seed", {
	cost: 2.5,
	unit_name: "improved plant sample",
	needs_discovery: 1,
	export_types: null,
});

// /datum/export/seed/potency/proc/<init>  (code/modules/cargo/exports/seeds.dm:26)
rt.def("/datum/export/seed/potency/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/seeds")));
	return f.dot;
});

// /datum/export/seed/potency/proc/get_cost  (code/modules/cargo/exports/seeds.dm:30)
rt.def("/datum/export/seed/potency/proc/get_cost", function get_cost(f: Frame) {
	let S: Value = null, cost: Value = null, potDiff: Value = null;
	f.vars = () => [S, cost, potDiff];
	S = live(f.args[0]);
	if (!truthy((cost = rt.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	potDiff = subtract(rt.fv(f, "potency", live(S)), rt.index(rt.gl("discoveredPlants"), rt.fv(f, "type", live(S))));
	return rt.call(f, P("/proc/round"), null, [multiply(rt.callSuper(f, [], rt.Args.Same), live(potDiff))]);
}, false, { args: ["O"] });
