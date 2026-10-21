// From code/modules/procedural_mapping/mapGeneratorModule.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1899, "/datum/mapGeneratorModule", "/datum", {
	mother: null,
	spawnableAtoms: null,
	spawnableTurfs: null,
	clusterMax: 5,
	clusterMin: 1,
	clusterCheckFlags: 16,
	allowAtomsOnSpace: 0,
});

// /datum/mapGeneratorModule/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModule.dm:4)
rt.def("/datum/mapGeneratorModule/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.list());
	$0 = $0;
	rt.setSv(f, "spawnableTurfs", rt.list());
	return f.dot;
});

// /datum/mapGeneratorModule/proc/sync  (code/modules/procedural_mapping/mapGeneratorModule.dm:16)
rt.def("/datum/mapGeneratorModule/proc/sync", function sync(f: Frame, mum: Value) {
	rt.setSv(f, "mother", null);
	if (!truthy(live(mum))) return f.dot;
	rt.setSv(f, "mother", live(mum));
	return f.dot;
});

// /datum/mapGeneratorModule/proc/generate  (code/modules/procedural_mapping/mapGeneratorModule.dm:21)  may sleep
rt.def("/datum/mapGeneratorModule/proc/generate", function* generate(f: Frame) {
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
		yield* g.srcCall(f, "place", live(_T));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/mapGeneratorModule/proc/place  (code/modules/procedural_mapping/mapGeneratorModule.dm:30)  may sleep
rt.def("/datum/mapGeneratorModule/proc/place", function* place(f: Frame, _T: Value) {
	let clustering: Value = null, skipLoopIteration: Value = null, turfPath: Value = null, F: Value = null, atomPath: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [_T, clustering, skipLoopIteration, turfPath, F, atomPath, M, $e];
	if (!truthy(live(_T))) {
		return 0;
	}
	clustering = 0;
	skipLoopIteration = 0;
	turfPath = null;
	rt.forList(f, 0, rt.sv(f, "spawnableTurfs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		turfPath = $e;
		if ((truthy(rt.sv(f, "clusterMax")) && truthy(rt.sv(f, "clusterMin")))) {
			if (truthy(rt.bitAnd(rt.sv(f, "clusterCheckFlags"), 8))) {
				clustering = (yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "clusterMin"), rt.sv(f, "clusterMax")]));
				F = null;
				rt.forList(f, 1, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(_T)), live(clustering)), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(_T)), live(clustering)), 1])), rt.fv(f, "z", live(_T))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(_T)), live(clustering)), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(_T)), live(clustering)), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(_T)))])), T("/turf"));
				while (($e = rt.next(f, 1)) !== undefined) {
					F = $e;
					if (truthy(rt.op(f, "IsType", [], [live(F), live(turfPath)]))) {
						skipLoopIteration = 1;
						break;
					}
				}
				rt.endFor(f, 1);
				if (truthy(live(skipLoopIteration))) {
					skipLoopIteration = 0;
					continue;
				}
			}
			if (truthy(rt.bitAnd(rt.sv(f, "clusterCheckFlags"), 2))) {
				clustering = (yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "clusterMin"), rt.sv(f, "clusterMax")]));
				F = null;
				rt.forList(f, 1, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(_T)), live(clustering)), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(_T)), live(clustering)), 1])), rt.fv(f, "z", live(_T))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(_T)), live(clustering)), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(_T)), live(clustering)), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(_T)))])), T("/turf"));
				while (($e = rt.next(f, 1)) !== undefined) {
					F = $e;
					if (!truthy(rt.op(f, "IsType", [], [live(F), live(turfPath)]))) {
						skipLoopIteration = 1;
						break;
					}
				}
				rt.endFor(f, 1);
				if (truthy(live(skipLoopIteration))) {
					skipLoopIteration = 0;
					continue;
				}
			}
		}
		if (truthy(rt.op(f, "Prob", [], [rt.index(rt.sv(f, "spawnableTurfs"), live(turfPath))]))) {
			yield* g.callName(f, live(_T), "ChangeTurf", [live(turfPath)]);
		}
	}
	rt.endFor(f, 0);
	if (truthy((yield* g.srcCall(f, "checkPlaceAtom", live(_T))))) {
		atomPath = null;
		rt.forList(f, 0, rt.sv(f, "spawnableAtoms"));
		while (($e = rt.next(f, 0)) !== undefined) {
			atomPath = $e;
			if ((truthy(rt.sv(f, "clusterMax")) && truthy(rt.sv(f, "clusterMin")))) {
				if (truthy(rt.bitAnd(rt.sv(f, "clusterCheckFlags"), 16))) {
					clustering = (yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "clusterMin"), rt.sv(f, "clusterMax")]));
					M = null;
					rt.forList(f, 1, (yield* g.call(f, P("/proc/range"), null, [live(clustering), live(_T)])), T("/atom/movable"));
					while (($e = rt.next(f, 1)) !== undefined) {
						M = $e;
						if (truthy(rt.op(f, "IsType", [], [live(M), live(atomPath)]))) {
							skipLoopIteration = 1;
							break;
						}
					}
					rt.endFor(f, 1);
					if (truthy(live(skipLoopIteration))) {
						skipLoopIteration = 0;
						continue;
					}
				}
				if (truthy(rt.bitAnd(rt.sv(f, "clusterCheckFlags"), 4))) {
					clustering = (yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "clusterMin"), rt.sv(f, "clusterMax")]));
					M = null;
					rt.forList(f, 1, (yield* g.call(f, P("/proc/range"), null, [live(clustering), live(_T)])), T("/atom/movable"));
					while (($e = rt.next(f, 1)) !== undefined) {
						M = $e;
						if (!truthy(rt.op(f, "IsType", [], [live(M), live(atomPath)]))) {
							skipLoopIteration = 1;
							break;
						}
					}
					rt.endFor(f, 1);
					if (truthy(live(skipLoopIteration))) {
						skipLoopIteration = 0;
						continue;
					}
				}
			}
			if (truthy(rt.op(f, "Prob", [], [rt.index(rt.sv(f, "spawnableAtoms"), live(atomPath))]))) {
				yield* g.new_(f, live(atomPath), [live(_T)]);
			}
		}
		rt.endFor(f, 0);
	}
	f.dot = 1;
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });

// /datum/mapGeneratorModule/proc/checkPlaceAtom  (code/modules/procedural_mapping/mapGeneratorModule.dm:109)
rt.def("/datum/mapGeneratorModule/proc/checkPlaceAtom", function checkPlaceAtom(f: Frame, _T: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	f.dot = 1;
	if (!truthy(live(_T))) {
		return 0;
	}
	if (truthy(rt.fv(f, "density", live(_T)))) {
		f.dot = 0;
	}
	A = null;
	rt.forList(f, 0, live(_T), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy(rt.fv(f, "density", live(A)))) {
			f.dot = 0;
			break;
		}
	}
	rt.endFor(f, 0);
	if (!(!truthy(rt.sv(f, "allowAtomsOnSpace")) && truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)))) return f.dot;
	f.dot = 0;
	return f.dot;
});

rt.type(1908, "/datum/mapGeneratorModule/bottomLayer", "/datum/mapGeneratorModule", {
	clusterCheckFlags: 0,
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/bottomLayer/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModule.dm:133)
rt.def("/datum/mapGeneratorModule/bottomLayer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.list());
	$0 = $0;
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf"), 100]));
	return f.dot;
});

rt.type(1923, "/datum/mapGeneratorModule/splatterLayer", "/datum/mapGeneratorModule", {
	clusterCheckFlags: 30,
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/splatterLayer/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModule.dm:139)
rt.def("/datum/mapGeneratorModule/splatterLayer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.alist(f, [T("/atom"), 30]));
	$0 = $0;
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf"), 30]));
	return f.dot;
});

rt.type(1929, "/datum/mapGeneratorModule/denseLayer", "/datum/mapGeneratorModule", {
	clusterCheckFlags: 0,
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/denseLayer/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModule.dm:145)
rt.def("/datum/mapGeneratorModule/denseLayer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.alist(f, [T("/atom"), 75]));
	$0 = $0;
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf"), 75]));
	return f.dot;
});
