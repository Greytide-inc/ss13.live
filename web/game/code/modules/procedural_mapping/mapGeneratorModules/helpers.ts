// Based on /tg/station's code/modules/procedural_mapping/mapGeneratorModules/helpers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1909, "/datum/mapGeneratorModule/bottomLayer/repressurize", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// helpers.dm:6
rt.def("/datum/mapGeneratorModule/bottomLayer/repressurize/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = list();

	this.spawnableTurfs = list();
	return f.dot;
});

// helpers.dm:10
rt.def("/datum/mapGeneratorModule/bottomLayer/repressurize/proc/generate", function generate(f: Frame) {
	let _T: Value = null;
	if (!this.mother) {
		return f.dot;
	}
	let map: Value = this.mother.map;
	for (_T of each(map, T("/turf"))) {
		GLOB.SSair.remove_from_active(_T);
	}
	_T = null;
	for (_T of each(map, T("/turf/open"))) {
		if (_T.air) {
			_T.air.copy_from_turf(_T);
		}
		GLOB.SSair.add_to_active(_T);
	}
	return f.dot;
});

rt.type(1910, "/datum/mapGeneratorModule/bottomLayer/massdelete", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// helpers.dm:21
rt.def("/datum/mapGeneratorModule/bottomLayer/massdelete/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = list();

	this.spawnableTurfs = list();
	return f.dot;
});

// helpers.dm:25
rt.def("/datum/mapGeneratorModule/bottomLayer/massdelete/proc/generate", function* generate(f: Frame) {
	let V: Value = null, _T: Value = null;
	if (!this.mother) {
		return f.dot;
	}
	for (V of each(this.mother.map)) {
		yield* (_T = V).empty();
	}
	return f.dot;
}, true);

rt.type(1931, "/datum/mapGeneratorModule/border", "/datum/mapGeneratorModule", {
	clusterCheckFlags: 0,
});

// helpers.dm:36
rt.def("/datum/mapGeneratorModule/border/proc/generate", function* generate(f: Frame) {
	let _T: Value = null;
	if (!this.mother) {
		return f.dot;
	}
	let map: Value = this.mother.map;
	for (_T of each(map, T("/turf"))) {
		if (this.is_border(_T)) {
			yield* this.place(_T);
		}
	}
	return f.dot;
}, true);

// helpers.dm:44
rt.def("/datum/mapGeneratorModule/border/proc/is_border", function is_border(f: Frame, _T: Value) {
	let direction: Value = null;
	for (direction of each(list(2, 4, 8, 1))) {
		if (rt.isIn(f, rt.getStep(f, _T, direction), this.mother.map)) {
			continue;
		}
		return 1;
	}
	return 0;
});

rt.type(1869, "/datum/mapGenerator/repressurize", "/datum/mapGenerator", {
	modules: null,
});

// helpers.dm:51
rt.def("/datum/mapGenerator/repressurize/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/repressurize"));
	return f.dot;
});

rt.type(1870, "/datum/mapGenerator/massdelete", "/datum/mapGenerator", {
	modules: null,
});

// helpers.dm:54
rt.def("/datum/mapGenerator/massdelete/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/massdelete"));
	return f.dot;
});
