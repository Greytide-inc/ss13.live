// Based on /tg/station's code/modules/procedural_mapping/mapGenerator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(1867, "/datum/mapGenerator", "/datum", {
	map: null,
	modules: null,
});

// mapGenerator.dm:24
rt.def("/datum/mapGenerator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.map = list();

	this.modules = list();
	return f.dot;
});

// mapGenerator.dm:30
rt.def("/datum/mapGenerator/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.initialiseModules();
	return f.dot;
}, true);

// mapGenerator.dm:36
rt.def("/datum/mapGenerator/proc/defineRegion", function defineRegion(f: Frame, Start: Value, End: Value, replace: Value) {
	replace ??= 0;
	if (!this.checkRegion(Start, End)) {
		return 0;
	}
	if (replace) {
		this.undefineRegion();
	}
	(rt.modSrcVar(f, "map", block(Start, End), rt.bitOr));
	return this.map;
});

// mapGenerator.dm:83
rt.def("/datum/mapGenerator/proc/undefineRegion", function undefineRegion(f: Frame) {
	this.map = list();
	return f.dot;
});

// mapGenerator.dm:91
rt.def("/datum/mapGenerator/proc/checkRegion", function checkRegion(f: Frame, Start: Value, End: Value) {
	f.dot = 1;
	if (!Start || !End) {
		return 0;
	}
	if (Start.x > rt.world().maxx || End.x > rt.world().maxx) {
		f.dot = 0;
	}
	if (Start.y > rt.world().maxy || End.y > rt.world().maxy) {
		f.dot = 0;
	}
	if (!(Start.z > rt.world().maxz || End.z > rt.world().maxz)) return f.dot;
	f.dot = 0;
	return f.dot;
});

// mapGenerator.dm:106
rt.def("/datum/mapGenerator/proc/generate", function* generate(f: Frame) {
	let mod: Value = null;
	this.syncModules();
	if (!this.modules || !rt.len(f, this.modules)) {
		return f.dot;
	}
	for (mod of each(this.modules, T("/datum/mapGeneratorModule"))) {
		yield* ImmediateInvokeAsync(mod, P("/datum/mapGeneratorModule/proc/generate"));
		yield* sleep(-1);
	}
	return f.dot;
}, true);

// mapGenerator.dm:126
rt.def("/datum/mapGenerator/proc/initialiseModules", function* initialiseModules(f: Frame) {
	let path: Value = null;
	for (path of each(this.modules)) {
		if (ispath(path)) {
			yield* this.modules.Remove(path);
			(rt.modSrcVar(f, "modules", (yield* new_(path)), rt.bitOr));
		}
	}
	this.syncModules();
	return f.dot;
}, true);

// mapGenerator.dm:135
rt.def("/datum/mapGenerator/proc/syncModules", function syncModules(f: Frame) {
	let mod: Value = null;
	for (mod of each(this.modules, T("/datum/mapGeneratorModule"))) {
		mod.sync(this);
	}
	return f.dot;
});

// mapGenerator.dm:148
rt.def("/client/proc/debugNatureMapGenerator", function* debugNatureMapGenerator(f: Frame) {
	let M: Value = null;
	let $2: any, $e: any;
	let N: Value = (yield* new_(T("/datum/mapGenerator/nature")));
	let startInput: Value = (yield* g.op(f, "Prompt", [2], ["1;1;1", "Map Gen Settings", "Start turf of Map, (X;Y;Z)", f.usr, null]));
	let $0: any = rt.world().maxx;
	let $1: any = rt.world().maxy;
	if (this.mob) {
		$2 = this.mob.z;
	} else {

		$2 = 1;
	}
	let endInput: Value = (yield* g.op(f, "Prompt", [2], [`${$0};${$1};${$2}`, "Map Gen Settings", "End turf of Map (X;Y;Z)", f.usr, null]));
	if (!startInput || !endInput) {
		to_chat(this, "Missing Input");
		return f.dot;
	}
	let startCoords: Value = splittext(startInput, ";");
	let endCoords: Value = splittext(endInput, ";");
	if (!startCoords || !endCoords) {
		to_chat(this, "Invalid Coords");
		to_chat(this, `Start Input: ${startInput}`);
		to_chat(this, `End Input: ${endInput}`);
		return f.dot;
	}
	let Start: Value = rt.locate(text2num(rt.index(startCoords, 1)), text2num(rt.index(startCoords, 2)), text2num(rt.index(startCoords, 3)));
	let End: Value = rt.locate(text2num(rt.index(endCoords, 1)), text2num(rt.index(endCoords, 2)), text2num(rt.index(endCoords, 3)));
	if (!Start || !End) {
		to_chat(this, "Invalid Turfs");
		to_chat(this, `Start Coords: ${rt.index(startCoords, 1)} - ${rt.index(startCoords, 2)} - ${rt.index(startCoords, 3)}`);
		to_chat(this, `End Coords: ${rt.index(endCoords, 1)} - ${rt.index(endCoords, 2)} - ${rt.index(endCoords, 3)}`);
		return f.dot;
	}
	let clusters: Value = rt.alist(f, ["None", CLUSTER_CHECK_NONE, "All", CLUSTER_CHECK_ALL, "Sames", CLUSTER_CHECK_SAMES, "Differents", CLUSTER_CHECK_DIFFERENTS, "Same turfs", CLUSTER_CHECK_SAME_TURFS, "Same atoms", CLUSTER_CHECK_SAME_ATOMS, "Different turfs", CLUSTER_CHECK_DIFFERENT_TURFS, "Different atoms", CLUSTER_CHECK_DIFFERENT_ATOMS, "All turfs", CLUSTER_CHECK_ALL_TURFS, "All atoms", CLUSTER_CHECK_ALL_ATOMS]);
	let moduleClusters: Value = (yield* g.op(f, "Prompt", [1], [null, null, "Map Gen Settings", "Cluster Flags (Cancel to leave unchanged from defaults)", clusters]));
	let theCluster: Value = CLUSTER_CHECK_NONE;
	if (moduleClusters != "None") {
		if (!rt.index(clusters, moduleClusters)) {
			to_chat(this, "Invalid Cluster Flags");
			return f.dot;
		}
		theCluster = rt.index(clusters, moduleClusters);
	} else {
		theCluster = CLUSTER_CHECK_NONE;
	}
	if (theCluster) {
		for (M of each(N.modules, T("/datum/mapGeneratorModule"))) {
			M.clusterCheckFlags = theCluster;
		}
	}
	to_chat(this, "Defining Region");
	N.defineRegion(Start, End);
	to_chat(this, "Region Defined");
	to_chat(this, "Generating Region");
	yield* N.generate();
	to_chat(this, "Generated Region");
	return f.dot;
}, true, { verb: { name: "Test Nature Map Generator", category: "Debug" } });
