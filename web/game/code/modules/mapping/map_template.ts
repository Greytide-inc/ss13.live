// From code/modules/mapping/map_template.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(755, "/datum/map_template", "/datum", {
	name: "Default Template Name",
	width: 0,
	height: 0,
	mappath: null,
	loaded: 0,
}, { global: { maploader: 948 } });

// /datum/map_template/proc/New  (code/modules/mapping/map_template.dm:11)  may sleep
rt.def("/datum/map_template/proc/New", function* New(f: Frame, path: Value, rename: Value) {
	f.vars = () => [path, rename];
	if (live(path) === null) {
		path = null;
	}
	if (live(rename) === null) {
		rename = null;
	}
	if (truthy(live(path))) {
		rt.setSv(f, "mappath", live(path));
	}
	if (truthy(rt.sv(f, "mappath"))) {
		yield* g.srcCall(f, "preload_size", rt.sv(f, "mappath"));
	}
	if (!truthy(live(rename))) return f.dot;
	rt.setSv(f, "name", live(rename));
	return f.dot;
}, true);

// /datum/map_template/proc/preload_size  (code/modules/mapping/map_template.dm:18)  may sleep
rt.def("/datum/map_template/proc/preload_size", function* preload_size(f: Frame, path: Value) {
	let bounds: Value = null;
	f.vars = () => [path, bounds];
	if (truthy((bounds = (yield* g.callName(f, rt.gl("maploader"), "load_map", [null, (yield* g.call(f, P("/proc/file"), null, [live(path)])), null, 1, null, 1, null, 1, "cropMap", 0, "measureOnly", 1], rt.Args.Named))))) {
		rt.setSv(f, "width", rt.index(live(bounds), 4));
		rt.setSv(f, "height", rt.index(live(bounds), 5));
	}
	return live(bounds);
}, true);

// /datum/map_template/proc/initTemplateBounds  (code/modules/mapping/map_template.dm:25)  may sleep
rt.def("/datum/map_template/proc/initTemplateBounds", function* initTemplateBounds(f: Frame, bounds: Value) {
	let atmos_machines: Value = null, cables: Value = null, atoms: Value = null, L: Value = null, B: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [bounds, atmos_machines, cables, atoms, L, B, A, $e];
	atmos_machines = rt.list();
	cables = rt.list();
	atoms = rt.list();
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate(rt.index(live(bounds), 1), rt.index(live(bounds), 2), rt.index(live(bounds), 3)), rt.locate(rt.index(live(bounds), 4), rt.index(live(bounds), 5), rt.index(live(bounds), 6))])));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		atoms = rt.modify(live(atoms), (B = live(L)), add);
		A = null;
		rt.forList(f, 1, live(B));
		while (($e = rt.next(f, 1)) !== undefined) {
			A = $e;
			atoms = rt.modify(live(atoms), live(A), add);
			if (truthy((rt.istype(live(A), T("/obj/structure/cable")) ? 1 : 0))) {
				cables = rt.modify(live(cables), live(A), add);
				continue;
			}
			if (truthy((rt.istype(live(A), T("/obj/machinery/atmospherics")) ? 1 : 0))) {
				atmos_machines = rt.modify(live(atmos_machines), live(A), add);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.gl("SSatoms"), "InitializeAtoms", [live(atoms)]);
	yield* g.callName(f, rt.gl("SSmachines"), "setup_template_powernets", [live(cables)]);
	yield* g.callName(f, rt.gl("SSair"), "setup_template_machinery", [live(atmos_machines)]);
	return f.dot;
}, true);

// /datum/map_template/proc/load_new_z  (code/modules/mapping/map_template.dm:46)  may sleep
rt.def("/datum/map_template/proc/load_new_z", function* load_new_z(f: Frame) {
	let x: Value = null, y: Value = null, bounds: Value = null;
	f.vars = () => [x, y, bounds];
	x = (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "maxx", rt.world()), 2)]));
	y = (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "maxy", rt.world()), 2)]));
	if (!truthy((bounds = (yield* g.callName(f, rt.gl("maploader"), "load_map", [(yield* g.call(f, P("/proc/file"), null, [rt.sv(f, "mappath")])), live(x), live(y)]))))) {
		return 0;
	}
	yield* g.call(f, P("/proc/smooth_zlevel"), null, [rt.fv(f, "maxz", rt.world())]);
	yield* g.call(f, P("/proc/repopulate_sorted_areas"), null, []);
	yield* g.srcCall(f, "initTemplateBounds", live(bounds));
	yield* g.call(f, P("/proc/log_game"), null, [fmt("Z-level ＀ loaded at at ＀,＀,＀", [rt.sv(f, "name"), live(x), live(y), rt.fv(f, "maxz", rt.world())])]);
	return f.dot;
}, true);

// /datum/map_template/proc/load  (code/modules/mapping/map_template.dm:62)  may sleep
rt.def("/datum/map_template/proc/load", function* load(f: Frame, _T: Value, centered: Value) {
	let bounds: Value = null;
	f.vars = () => [_T, centered, bounds];
	if (live(centered) === null) {
		centered = 0;
	}
	if (truthy(live(centered))) {
		_T = rt.locate(subtract(rt.fv(f, "x", live(_T)), (yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "width"), 2)]))), subtract(rt.fv(f, "y", live(_T)), (yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "height"), 2)]))), rt.fv(f, "z", live(_T)));
	}
	if (!truthy(live(_T))) {
		return live(f.dot);
	}
	if (rt.gt(add(rt.fv(f, "x", live(_T)), rt.sv(f, "width")), rt.fv(f, "maxx", rt.world()))) {
		return live(f.dot);
	}
	if (rt.gt(add(rt.fv(f, "y", live(_T)), rt.sv(f, "height")), rt.fv(f, "maxy", rt.world()))) {
		return live(f.dot);
	}
	if (!truthy((bounds = (yield* g.callName(f, rt.gl("maploader"), "load_map", [null, (yield* g.call(f, P("/proc/file"), null, [rt.sv(f, "mappath")])), null, rt.fv(f, "x", live(_T)), null, rt.fv(f, "y", live(_T)), null, rt.fv(f, "z", live(_T)), "cropMap", 1], rt.Args.Named))))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "loading_ruins", rt.gl("SSmapping")))) {
		yield* g.call(f, P("/proc/repopulate_sorted_areas"), null, []);
	}
	yield* g.srcCall(f, "initTemplateBounds", live(bounds));
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ loaded at at ＀,＀,＀", [rt.sv(f, "name"), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
	return 1;
}, true);

// /datum/map_template/proc/get_affected_turfs  (code/modules/mapping/map_template.dm:84)
rt.def("/datum/map_template/proc/get_affected_turfs", function get_affected_turfs(f: Frame, _T: Value, centered: Value) {
	let placement: Value = null, corner: Value = null;
	f.vars = () => [centered, placement, corner];
	if (live(centered) === null) {
		centered = 0;
	}
	placement = live(_T);
	if (truthy(live(centered))) {
		if (truthy((corner = rt.locate(subtract(rt.fv(f, "x", live(placement)), rt.call(f, P("/proc/round"), null, [divide(rt.sv(f, "width"), 2)])), subtract(rt.fv(f, "y", live(placement)), rt.call(f, P("/proc/round"), null, [divide(rt.sv(f, "height"), 2)])), rt.fv(f, "z", live(placement)))))) {
			placement = live(corner);
		}
	}
	return rt.call(f, P("/proc/block"), null, [live(placement), rt.locate(subtract(add(rt.fv(f, "x", live(placement)), rt.sv(f, "width")), 1), subtract(add(rt.fv(f, "y", live(placement)), rt.sv(f, "height")), 1), rt.fv(f, "z", live(placement)))]);
});

// /proc/load_new_z_level  (code/modules/mapping/map_template.dm:95)  may sleep
rt.def("/proc/load_new_z_level", function* load_new_z_level(f: Frame, file: Value, name: Value) {
	let template: Value = null;
	f.vars = () => [file, name, template];
	yield* g.callName(f, (template = (yield* g.new_(f, T("/datum/map_template"), [live(file), live(name)]))), "load_new_z", []);
	return f.dot;
}, true);
