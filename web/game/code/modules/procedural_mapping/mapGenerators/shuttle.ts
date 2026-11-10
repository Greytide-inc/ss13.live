// Based on /tg/station's code/modules/procedural_mapping/mapGenerators/shuttle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1921, "/datum/mapGeneratorModule/bottomLayer/shuttleFloor", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableTurfs: null,
});

// shuttle.dm:2
rt.def("/datum/mapGeneratorModule/bottomLayer/shuttleFloor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = rt.alist(f, [T("/turf/open/floor/plasteel/shuttle"), 100]);
	return f.dot;
});

rt.type(1936, "/datum/mapGeneratorModule/border/shuttleWalls", "/datum/mapGeneratorModule/border", {
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// shuttle.dm:5
rt.def("/datum/mapGeneratorModule/border/shuttleWalls/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = list();

	this.spawnableTurfs = rt.alist(f, [T("/turf/closed/wall/shuttle"), 100]);
	return f.dot;
});

rt.type(1892, "/datum/mapGenerator/shuttle/full", "/datum/mapGenerator/shuttle", {
	modules: null,
});

// shuttle.dm:10
rt.def("/datum/mapGenerator/shuttle/full/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/shuttleFloor"), T("/datum/mapGeneratorModule/border/shuttleWalls"), T("/datum/mapGeneratorModule/bottomLayer/repressurize"));
	return f.dot;
});

rt.type(1893, "/datum/mapGenerator/shuttle/floor", "/datum/mapGenerator/shuttle", {
	modules: null,
});

// shuttle.dm:15
rt.def("/datum/mapGenerator/shuttle/floor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/shuttleFloor"));
	return f.dot;
});
