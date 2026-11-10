// Based on /tg/station's code/modules/procedural_mapping/mapGenerators/repair.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1919, "/datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel", "/datum/mapGeneratorModule/bottomLayer", {
	ignore_wall: 0,
	allowAtomsOnSpace: 1,
	spawnableTurfs: null,
});

// repair.dm:2
rt.def("/datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = rt.alist(f, [T("/turf/open/floor/plasteel"), 100]);
	return f.dot;
});

// repair.dm:7
rt.def("/datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel/proc/place", function* place(f: Frame) {
	if (rt.istype(f.args[0], T("/turf/closed")) && !this.ignore_wall) {
		return 0;
	}
	return (yield* parent_proc());
}, true, { args: ["T"] });

rt.type(1935, "/datum/mapGeneratorModule/border/normalWalls", "/datum/mapGeneratorModule/border", {
	spawnableAtoms: null,
	allowAtomsOnSpace: 1,
	spawnableTurfs: null,
});

// repair.dm:15
rt.def("/datum/mapGeneratorModule/border/normalWalls/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = list();

	this.spawnableTurfs = rt.alist(f, [T("/turf/closed/wall"), 100]);
	return f.dot;
});

rt.type(1888, "/datum/mapGenerator/repair", "/datum/mapGenerator", {
	modules: null,
});

// repair.dm:20
rt.def("/datum/mapGenerator/repair/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel"), T("/datum/mapGeneratorModule/bottomLayer/repressurize"));
	return f.dot;
});

rt.type(1889, "/datum/mapGenerator/repair/delete_walls", "/datum/mapGenerator/repair", {
	modules: null,
});

// repair.dm:24
rt.def("/datum/mapGenerator/repair/delete_walls/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel/flatten"), T("/datum/mapGeneratorModule/bottomLayer/repressurize"));
	return f.dot;
});

rt.type(1890, "/datum/mapGenerator/repair/enclose_room", "/datum/mapGenerator/repair", {
	modules: null,
});

// repair.dm:28
rt.def("/datum/mapGenerator/repair/enclose_room/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel/flatten"), T("/datum/mapGeneratorModule/border/normalWalls"), T("/datum/mapGeneratorModule/bottomLayer/repressurize"));
	return f.dot;
});
