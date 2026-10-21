// From code/modules/procedural_mapping/mapGenerator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1867, "/datum/mapGenerator", "/datum", {
	map: null,
	modules: null,
});

// /datum/mapGenerator/proc/<init>  (code/modules/procedural_mapping/mapGenerator.dm:24)
rt.def("/datum/mapGenerator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "map", rt.list());
	$0 = $0;
	rt.setSv(f, "modules", rt.list());
	return f.dot;
});

// /datum/mapGenerator/proc/New  (code/modules/procedural_mapping/mapGenerator.dm:30)  may sleep
rt.def("/datum/mapGenerator/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "initialiseModules");
	return f.dot;
}, true);

// /datum/mapGenerator/proc/defineRegion  (code/modules/procedural_mapping/mapGenerator.dm:36)
rt.def("/datum/mapGenerator/proc/defineRegion", function defineRegion(f: Frame, Start: Value, End: Value, replace: Value) {
	f.vars = () => [replace];
	if (live(replace) === null) {
		replace = 0;
	}
	if (!truthy(rt.callSrc(f, "checkRegion", [live(Start), live(End)]))) {
		return 0;
	}
	if (truthy(live(replace))) {
		rt.callSrc(f, "undefineRegion", []);
	}
	(rt.modSrcVar(f, "map", rt.call(f, P("/proc/block"), null, [live(Start), live(End)]), rt.bitOr));
	return rt.sv(f, "map");
});

// /datum/mapGenerator/proc/defineCircularRegion  (code/modules/procedural_mapping/mapGenerator.dm:48)
rt.def("/datum/mapGenerator/proc/defineCircularRegion", function defineCircularRegion(f: Frame, Start: Value, End: Value, replace: Value) {
	let centerX: Value = null, centerY: Value = null, lilZ: Value = null, bigZ: Value = null, sphereMagic: Value = null, radius: Value = null, offByOneOffset: Value = null, i: Value = null, theRadius: Value = null;
	f.vars = () => [replace, centerX, centerY, lilZ, bigZ, sphereMagic, radius, offByOneOffset, i, theRadius];
	if (live(replace) === null) {
		replace = 0;
	}
	if (!truthy(rt.callSrc(f, "checkRegion", [live(Start), live(End)]))) {
		return 0;
	}
	centerX = rt.call(f, P("/proc/max"), null, [rt.op(f, "Abs", [], [divide(add(rt.fv(f, "x", live(End)), rt.fv(f, "x", live(Start))), 2)]), 1]);
	centerY = rt.call(f, P("/proc/max"), null, [rt.op(f, "Abs", [], [divide(add(rt.fv(f, "y", live(End)), rt.fv(f, "y", live(Start))), 2)]), 1]);
	lilZ = rt.call(f, P("/proc/min"), null, [rt.fv(f, "z", live(Start)), rt.fv(f, "z", live(End))]);
	bigZ = rt.call(f, P("/proc/max"), null, [rt.fv(f, "z", live(Start)), rt.fv(f, "z", live(End))]);
	sphereMagic = rt.call(f, P("/proc/max"), null, [rt.op(f, "Abs", [], [subtract(live(bigZ), divide(live(lilZ), 2))]), 1]);
	radius = rt.op(f, "Abs", [], [rt.call(f, P("/proc/max"), null, [live(centerX), live(centerY)])]);
	if (truthy(live(replace))) {
		rt.callSrc(f, "undefineRegion", []);
	}
	offByOneOffset = 1;
	if (isEqual(rt.modulus(live(bigZ), 2), 0)) {
		offByOneOffset = 0;
	}
	i = null;
	i = live(lilZ);
	while (rt.le(live(i), add(live(bigZ), live(offByOneOffset)))) {
		theRadius = live(radius);
		if (!isEqual(live(i), live(sphereMagic))) {
			theRadius = rt.call(f, P("/proc/max"), null, [divide(live(radius), rt.call(f, P("/proc/max"), null, [multiply(2, rt.op(f, "Abs", [], [subtract(live(sphereMagic), live(i))])), 1])), 1]);
		}
		(rt.modSrcVar(f, "map", rt.call(f, P("/proc/circlerange"), null, [rt.locate(live(centerX), live(centerY), live(i)), live(theRadius)]), rt.bitOr));
		i = rt.inc(live(i), 1);
	}
	return rt.sv(f, "map");
});

// /datum/mapGenerator/proc/undefineRegion  (code/modules/procedural_mapping/mapGenerator.dm:83)
rt.def("/datum/mapGenerator/proc/undefineRegion", function undefineRegion(f: Frame) {
	rt.setSv(f, "map", rt.list());
	return f.dot;
});

// /datum/mapGenerator/proc/checkRegion  (code/modules/procedural_mapping/mapGenerator.dm:91)
rt.def("/datum/mapGenerator/proc/checkRegion", function checkRegion(f: Frame, Start: Value, End: Value) {
	f.dot = 1;
	if ((!truthy(live(Start)) || !truthy(live(End)))) {
		return 0;
	}
	if ((rt.gt(rt.fv(f, "x", live(Start)), rt.fv(f, "maxx", rt.world())) || rt.gt(rt.fv(f, "x", live(End)), rt.fv(f, "maxx", rt.world())))) {
		f.dot = 0;
	}
	if ((rt.gt(rt.fv(f, "y", live(Start)), rt.fv(f, "maxy", rt.world())) || rt.gt(rt.fv(f, "y", live(End)), rt.fv(f, "maxy", rt.world())))) {
		f.dot = 0;
	}
	if (!(rt.gt(rt.fv(f, "z", live(Start)), rt.fv(f, "maxz", rt.world())) || rt.gt(rt.fv(f, "z", live(End)), rt.fv(f, "maxz", rt.world())))) return f.dot;
	f.dot = 0;
	return f.dot;
});

// /datum/mapGenerator/proc/generate  (code/modules/procedural_mapping/mapGenerator.dm:106)  may sleep
rt.def("/datum/mapGenerator/proc/generate", function* generate(f: Frame) {
	let mod: Value = null;
	let $e: any;
	f.vars = () => [mod, $e];
	yield* g.srcCall(f, "syncModules");
	if ((!truthy(rt.sv(f, "modules")) || !truthy(rt.len(f, rt.sv(f, "modules"))))) {
		return live(f.dot);
	}
	mod = null;
	rt.forList(f, 0, rt.sv(f, "modules"), T("/datum/mapGeneratorModule"));
	while (($e = rt.next(f, 0)) !== undefined) {
		mod = $e;
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(mod), P("/datum/mapGeneratorModule/proc/generate")]);
		yield* g.call(f, P("/proc/sleep"), null, [-1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/mapGenerator/proc/generateOneTurf  (code/modules/procedural_mapping/mapGenerator.dm:115)
rt.def("/datum/mapGenerator/proc/generateOneTurf", function generateOneTurf(f: Frame, _T: Value) {
	let mod: Value = null;
	let $e: any;
	f.vars = () => [mod, $e];
	if (!truthy(live(_T))) {
		return live(f.dot);
	}
	rt.callSrc(f, "syncModules", []);
	if ((!truthy(rt.sv(f, "modules")) || !truthy(rt.len(f, rt.sv(f, "modules"))))) {
		return live(f.dot);
	}
	mod = null;
	rt.forList(f, 0, rt.sv(f, "modules"), T("/datum/mapGeneratorModule"));
	while (($e = rt.next(f, 0)) !== undefined) {
		mod = $e;
		rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(mod), P("/datum/mapGeneratorModule/proc/place"), live(_T)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/mapGenerator/proc/initialiseModules  (code/modules/procedural_mapping/mapGenerator.dm:126)  may sleep
rt.def("/datum/mapGenerator/proc/initialiseModules", function* initialiseModules(f: Frame) {
	let path: Value = null;
	let $e: any;
	f.vars = () => [path, $e];
	path = null;
	rt.forList(f, 0, rt.sv(f, "modules"));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(path)])))) {
			yield* g.callName(f, rt.sv(f, "modules"), "Remove", [live(path)]);
			(rt.modSrcVar(f, "modules", (yield* g.new_(f, live(path), [])), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "syncModules");
	return f.dot;
}, true);

// /datum/mapGenerator/proc/syncModules  (code/modules/procedural_mapping/mapGenerator.dm:135)
rt.def("/datum/mapGenerator/proc/syncModules", function syncModules(f: Frame) {
	let mod: Value = null;
	let $e: any;
	f.vars = () => [mod, $e];
	mod = null;
	rt.forList(f, 0, rt.sv(f, "modules"), T("/datum/mapGeneratorModule"));
	while (($e = rt.next(f, 0)) !== undefined) {
		mod = $e;
		rt.callName(f, live(mod), "sync", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /client/proc/debugNatureMapGenerator  (code/modules/procedural_mapping/mapGenerator.dm:148)  may sleep
rt.def("/client/proc/debugNatureMapGenerator", function* debugNatureMapGenerator(f: Frame) {
	let N: Value = null, startInput: Value = null, endInput: Value = null, startCoords: Value = null, endCoords: Value = null, Start: Value = null, End: Value = null, clusters: Value = null, moduleClusters: Value = null, theCluster: Value = null, M: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [N, startInput, endInput, startCoords, endCoords, Start, End, clusters, moduleClusters, theCluster, M, $0, $1, $2, $e];
	N = (yield* g.new_(f, T("/datum/mapGenerator/nature"), []));
	startInput = (yield* g.op(f, "Prompt", [2], ["1;1;1", "Map Gen Settings", "Start turf of Map, (X;Y;Z)", live(f.usr), null]));
	$0 = rt.fv(f, "maxx", rt.world());
	$1 = rt.fv(f, "maxy", rt.world());
	if (truthy(rt.sv(f, "mob"))) {
		$2 = rt.fv(f, "z", rt.sv(f, "mob"));
	} else {
		$1 = $1;
		$2 = 1;
	}
	endInput = (yield* g.op(f, "Prompt", [2], [fmt("＀;＀;＀", [$0, $1, $2]), "Map Gen Settings", "End turf of Map (X;Y;Z)", live(f.usr), null]));
	if ((!truthy(live(startInput)) || !truthy(live(endInput)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Missing Input"]);
		return live(f.dot);
	}
	startCoords = (yield* g.call(f, P("/proc/splittext"), null, [live(startInput), ";"]));
	endCoords = (yield* g.call(f, P("/proc/splittext"), null, [live(endInput), ";"]));
	if ((!truthy(live(startCoords)) || !truthy(live(endCoords)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Invalid Coords"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Start Input: ＀", [live(startInput)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("End Input: ＀", [live(endInput)])]);
		return live(f.dot);
	}
	Start = rt.locate((yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(startCoords), 1)])), (yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(startCoords), 2)])), (yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(startCoords), 3)])));
	End = rt.locate((yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(endCoords), 1)])), (yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(endCoords), 2)])), (yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(endCoords), 3)])));
	if ((!truthy(live(Start)) || !truthy(live(End)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Invalid Turfs"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Start Coords: ＀ - ＀ - ＀", [rt.index(live(startCoords), 1), rt.index(live(startCoords), 2), rt.index(live(startCoords), 3)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("End Coords: ＀ - ＀ - ＀", [rt.index(live(endCoords), 1), rt.index(live(endCoords), 2), rt.index(live(endCoords), 3)])]);
		return live(f.dot);
	}
	clusters = rt.alist(f, ["None", 0, "All", 30, "Sames", 24, "Differents", 6, "Same turfs", 8, "Same atoms", 16, "Different turfs", 2, "Different atoms", 4, "All turfs", 10, "All atoms", 20]);
	moduleClusters = (yield* g.op(f, "Prompt", [1], [null, null, "Map Gen Settings", "Cluster Flags (Cancel to leave unchanged from defaults)", live(clusters)]));
	theCluster = 0;
	if (!isEqual(live(moduleClusters), "None")) {
		if (!truthy(rt.index(live(clusters), live(moduleClusters)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Invalid Cluster Flags"]);
			return live(f.dot);
		}
		theCluster = rt.index(live(clusters), live(moduleClusters));
	} else {
		theCluster = 0;
	}
	if (truthy(live(theCluster))) {
		M = null;
		rt.forList(f, 0, rt.fv(f, "modules", live(N)), T("/datum/mapGeneratorModule"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			rt.setFv(f, "clusterCheckFlags", live(M), live(theCluster));
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Defining Region"]);
	yield* g.callName(f, live(N), "defineRegion", [live(Start), live(End)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Region Defined"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Generating Region"]);
	yield* g.callName(f, live(N), "generate", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Generated Region"]);
	return f.dot;
}, true, { verb: { name: "Test Nature Map Generator", category: "Debug" } });
