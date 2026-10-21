// From code/modules/procedural_mapping/mapGeneratorModules/helpers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1909, "/datum/mapGeneratorModule/bottomLayer/repressurize", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/bottomLayer/repressurize/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModules/helpers.dm:6)
rt.def("/datum/mapGeneratorModule/bottomLayer/repressurize/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.list());
	$0 = $0;
	rt.setSv(f, "spawnableTurfs", rt.list());
	return f.dot;
});

// /datum/mapGeneratorModule/bottomLayer/repressurize/proc/generate  (code/modules/procedural_mapping/mapGeneratorModules/helpers.dm:10)
rt.def("/datum/mapGeneratorModule/bottomLayer/repressurize/proc/generate", function generate(f: Frame) {
	let map: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [map, _T, $e];
	if (!truthy(rt.sv(f, "mother"))) {
		return live(f.dot);
	}
	map = rt.fv(f, "map", rt.sv(f, "mother"));
	_T = null;
	rt.forList(f, 0, live(map), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.callName(f, rt.gl("SSair"), "remove_from_active", [live(_T)]);
	}
	rt.endFor(f, 0);
	_T = null;
	rt.forList(f, 0, live(map), T("/turf/open"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.fv(f, "air", live(_T)))) {
			rt.callName(f, rt.fv(f, "air", live(_T)), "copy_from_turf", [live(_T)]);
		}
		rt.callName(f, rt.gl("SSair"), "add_to_active", [live(_T)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(1910, "/datum/mapGeneratorModule/bottomLayer/massdelete", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/bottomLayer/massdelete/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModules/helpers.dm:21)
rt.def("/datum/mapGeneratorModule/bottomLayer/massdelete/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.list());
	$0 = $0;
	rt.setSv(f, "spawnableTurfs", rt.list());
	return f.dot;
});

// /datum/mapGeneratorModule/bottomLayer/massdelete/proc/generate  (code/modules/procedural_mapping/mapGeneratorModules/helpers.dm:25)  may sleep
rt.def("/datum/mapGeneratorModule/bottomLayer/massdelete/proc/generate", function* generate(f: Frame) {
	let V: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [V, _T, $e];
	if (!truthy(rt.sv(f, "mother"))) {
		return live(f.dot);
	}
	V = null;
	rt.forList(f, 0, rt.fv(f, "map", rt.sv(f, "mother")));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		yield* g.callName(f, (_T = live(V)), "empty", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(1931, "/datum/mapGeneratorModule/border", "/datum/mapGeneratorModule", {
	clusterCheckFlags: 0,
});

// /datum/mapGeneratorModule/border/proc/generate  (code/modules/procedural_mapping/mapGeneratorModules/helpers.dm:36)  may sleep
rt.def("/datum/mapGeneratorModule/border/proc/generate", function* generate(f: Frame) {
	let map: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [map, _T, $e];
	if (!truthy(rt.sv(f, "mother"))) {
		return live(f.dot);
	}
	map = rt.fv(f, "map", rt.sv(f, "mother"));
	_T = null;
	rt.forList(f, 0, live(map), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy((yield* g.srcCall(f, "is_border", live(_T))))) {
			yield* g.srcCall(f, "place", live(_T));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/mapGeneratorModule/border/proc/is_border  (code/modules/procedural_mapping/mapGeneratorModules/helpers.dm:44)
rt.def("/datum/mapGeneratorModule/border/proc/is_border", function is_border(f: Frame, _T: Value) {
	let direction: Value = null;
	let $e: any;
	f.vars = () => [direction, $e];
	direction = null;
	rt.forList(f, 0, rt.list(2, 4, 8, 1));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (truthy((rt.isIn(f, rt.getStep(f, live(_T), live(direction)), rt.fv(f, "map", rt.sv(f, "mother"))) ? 1 : 0))) {
			continue;
		}
		return 1;
	}
	rt.endFor(f, 0);
	return 0;
});

rt.type(1869, "/datum/mapGenerator/repressurize", "/datum/mapGenerator", {
	modules: null,
});

// /datum/mapGenerator/repressurize/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModules/helpers.dm:51)
rt.def("/datum/mapGenerator/repressurize/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/repressurize")));
	return f.dot;
});

rt.type(1870, "/datum/mapGenerator/massdelete", "/datum/mapGenerator", {
	modules: null,
});

// /datum/mapGenerator/massdelete/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModules/helpers.dm:54)
rt.def("/datum/mapGenerator/massdelete/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/massdelete")));
	return f.dot;
});
