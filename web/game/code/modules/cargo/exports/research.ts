// From code/modules/cargo/exports/research.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2045, "/datum/export/tech", "/datum/export", {
	techLevels: null,
	cost: 500,
	unit_name: "technology data disk",
	export_types: null,
});

// /datum/export/tech/proc/<init>  (code/modules/cargo/exports/research.dm:6)
rt.def("/datum/export/tech/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "techLevels", rt.list());
	$0 = $0;
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/disk/tech_disk")));
	return f.dot;
});

// /datum/export/tech/proc/get_cost  (code/modules/cargo/exports/research.dm:9)
rt.def("/datum/export/tech/proc/get_cost", function get_cost(f: Frame) {
	let D: Value = null, cost: Value = null, V: Value = null, tech: Value = null;
	let $e: any;
	f.vars = () => [D, cost, V, tech, $e];
	D = live(f.args[0]);
	cost = 0;
	V = null;
	rt.forList(f, 0, rt.fv(f, "tech_stored", live(D)));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (!truthy(live(V))) {
			continue;
		}
		cost = rt.modify(live(cost), rt.callName(f, (tech = live(V)), "getCost", [rt.index(rt.sv(f, "techLevels"), rt.fv(f, "id", live(tech)))]), add);
	}
	rt.endFor(f, 0);
	return multiply(rt.callSuper(f, [], rt.Args.Same), live(cost));
}, false, { args: ["O"] });

// /datum/export/tech/proc/sell_object  (code/modules/cargo/exports/research.dm:19)
rt.def("/datum/export/tech/proc/sell_object", function sell_object(f: Frame) {
	let D: Value = null, V: Value = null, tech: Value = null;
	let $e: any;
	f.vars = () => [D, V, tech, $e];
	rt.callSuper(f, [], rt.Args.Same);
	D = live(f.args[0]);
	V = null;
	rt.forList(f, 0, rt.fv(f, "tech_stored", live(D)));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (!truthy(live(V))) {
			continue;
		}
		tech = live(V);
		rt.setAt(rt.sv(f, "techLevels"), rt.fv(f, "id", live(tech)), rt.call(f, P("/proc/max"), null, [rt.index(rt.sv(f, "techLevels"), rt.fv(f, "id", live(tech))), rt.fv(f, "level", live(tech))]));
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["O"] });
