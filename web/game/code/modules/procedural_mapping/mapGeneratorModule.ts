// Based on /tg/station's code/modules/procedural_mapping/mapGeneratorModule.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1899, "/datum/mapGeneratorModule", "/datum", {
	mother: null,
	spawnableAtoms: null,
	spawnableTurfs: null,
	clusterMax: 5,
	clusterMin: 1,
	clusterCheckFlags: 16,
	allowAtomsOnSpace: 0,
});

// mapGeneratorModule.dm:4
rt.def("/datum/mapGeneratorModule/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = list();

	this.spawnableTurfs = list();
	return f.dot;
});

// mapGeneratorModule.dm:16
rt.def("/datum/mapGeneratorModule/proc/sync", function sync(f: Frame, mum: Value) {
	this.mother = null;
	if (!mum) return f.dot;
	this.mother = mum;
	return f.dot;
});

// mapGeneratorModule.dm:21
rt.def("/datum/mapGeneratorModule/proc/generate", function* generate(f: Frame) {
	let _T: Value = null;
	if (!this.mother) {
		return f.dot;
	}
	let map: Value = this.mother.map;
	for (_T of each(map, T("/turf"))) {
		yield* this.place(_T);
	}
	return f.dot;
}, true);

// mapGeneratorModule.dm:30
rt.def("/datum/mapGeneratorModule/proc/place", function* place(f: Frame, _T: Value) {
	let turfPath: Value = null, F: Value = null, atomPath: Value = null, M: Value = null;
	if (!_T) {
		return 0;
	}
	let clustering: Value = 0;
	let skipLoopIteration: Value = 0;
	for (turfPath of each(this.spawnableTurfs)) {
		if (this.clusterMax && this.clusterMin) {
			if (rt.bitAnd(this.clusterCheckFlags, CLUSTER_CHECK_SAME_TURFS)) {
				clustering = rand(this.clusterMin, this.clusterMax);
				F = null;
				for (F of each(block(rt.locate(max(_T.x - clustering, 1), max(_T.y - clustering, 1), _T.z), rt.locate(min(_T.x + clustering, rt.world().maxx), min(_T.y + clustering, rt.world().maxy), _T.z)), T("/turf"))) {
					if (rt.op(f, "IsType", [], [F, turfPath])) {
						skipLoopIteration = 1;
						break;
					}
				}
				if (skipLoopIteration) {
					skipLoopIteration = 0;
					continue;
				}
			}
			if (rt.bitAnd(this.clusterCheckFlags, CLUSTER_CHECK_DIFFERENT_TURFS)) {
				clustering = rand(this.clusterMin, this.clusterMax);
				F = null;
				for (F of each(block(rt.locate(max(_T.x - clustering, 1), max(_T.y - clustering, 1), _T.z), rt.locate(min(_T.x + clustering, rt.world().maxx), min(_T.y + clustering, rt.world().maxy), _T.z)), T("/turf"))) {
					if (!rt.op(f, "IsType", [], [F, turfPath])) {
						skipLoopIteration = 1;
						break;
					}
				}
				if (skipLoopIteration) {
					skipLoopIteration = 0;
					continue;
				}
			}
		}
		if (prob(rt.index(this.spawnableTurfs, turfPath))) {
			yield* _T.ChangeTurf(turfPath);
		}
	}
	if (this.checkPlaceAtom(_T)) {
		for (atomPath of each(this.spawnableAtoms)) {
			if (this.clusterMax && this.clusterMin) {
				if (rt.bitAnd(this.clusterCheckFlags, CLUSTER_CHECK_SAME_ATOMS)) {
					clustering = rand(this.clusterMin, this.clusterMax);
					M = null;
					for (M of each(range(clustering, _T), T("/atom/movable"))) {
						if (rt.op(f, "IsType", [], [M, atomPath])) {
							skipLoopIteration = 1;
							break;
						}
					}
					if (skipLoopIteration) {
						skipLoopIteration = 0;
						continue;
					}
				}
				if (rt.bitAnd(this.clusterCheckFlags, CLUSTER_CHECK_DIFFERENT_ATOMS)) {
					clustering = rand(this.clusterMin, this.clusterMax);
					M = null;
					for (M of each(range(clustering, _T), T("/atom/movable"))) {
						if (!rt.op(f, "IsType", [], [M, atomPath])) {
							skipLoopIteration = 1;
							break;
						}
					}
					if (skipLoopIteration) {
						skipLoopIteration = 0;
						continue;
					}
				}
			}
			if (prob(rt.index(this.spawnableAtoms, atomPath))) {
				yield* new_(atomPath, _T);
			}
		}
	}
	f.dot = 1;
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });

// mapGeneratorModule.dm:109
rt.def("/datum/mapGeneratorModule/proc/checkPlaceAtom", function checkPlaceAtom(f: Frame, _T: Value) {
	let A: Value = null;
	f.dot = 1;
	if (!_T) {
		return 0;
	}
	if (_T.density) {
		f.dot = 0;
	}
	for (A of each(_T, T("/atom"))) {
		if (A.density) {
			f.dot = 0;
			break;
		}
	}
	if (!(!this.allowAtomsOnSpace && rt.istype(_T, T("/turf/open/space")))) return f.dot;
	f.dot = 0;
	return f.dot;
});

rt.type(1908, "/datum/mapGeneratorModule/bottomLayer", "/datum/mapGeneratorModule", {
	clusterCheckFlags: 0,
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// mapGeneratorModule.dm:133
rt.def("/datum/mapGeneratorModule/bottomLayer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = list();

	this.spawnableTurfs = rt.alist(f, [T("/turf"), 100]);
	return f.dot;
});

rt.type(1923, "/datum/mapGeneratorModule/splatterLayer", "/datum/mapGeneratorModule", {
	clusterCheckFlags: 30,
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// mapGeneratorModule.dm:139
rt.def("/datum/mapGeneratorModule/splatterLayer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = rt.alist(f, [T("/atom"), 30]);

	this.spawnableTurfs = rt.alist(f, [T("/turf"), 30]);
	return f.dot;
});

rt.type(1929, "/datum/mapGeneratorModule/denseLayer", "/datum/mapGeneratorModule", {
	clusterCheckFlags: 0,
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// mapGeneratorModule.dm:145
rt.def("/datum/mapGeneratorModule/denseLayer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = rt.alist(f, [T("/atom"), 75]);

	this.spawnableTurfs = rt.alist(f, [T("/turf"), 75]);
	return f.dot;
});
