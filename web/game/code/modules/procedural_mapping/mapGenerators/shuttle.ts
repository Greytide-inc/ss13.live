// From code/modules/procedural_mapping/mapGenerators/shuttle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1921, "/datum/mapGeneratorModule/bottomLayer/shuttleFloor", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/bottomLayer/shuttleFloor/proc/<init>  (code/modules/procedural_mapping/mapGenerators/shuttle.dm:2)
rt.def("/datum/mapGeneratorModule/bottomLayer/shuttleFloor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf/open/floor/plasteel/shuttle"), 100]));
	return f.dot;
});

rt.type(1936, "/datum/mapGeneratorModule/border/shuttleWalls", "/datum/mapGeneratorModule/border", {
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/border/shuttleWalls/proc/<init>  (code/modules/procedural_mapping/mapGenerators/shuttle.dm:5)
rt.def("/datum/mapGeneratorModule/border/shuttleWalls/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.list());
	$0 = $0;
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf/closed/wall/shuttle"), 100]));
	return f.dot;
});

rt.type(1892, "/datum/mapGenerator/shuttle/full", "/datum/mapGenerator/shuttle", {
	modules: null,
});

// /datum/mapGenerator/shuttle/full/proc/<init>  (code/modules/procedural_mapping/mapGenerators/shuttle.dm:10)
rt.def("/datum/mapGenerator/shuttle/full/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/shuttleFloor"), T("/datum/mapGeneratorModule/border/shuttleWalls"), T("/datum/mapGeneratorModule/bottomLayer/repressurize")));
	return f.dot;
});

rt.type(1893, "/datum/mapGenerator/shuttle/floor", "/datum/mapGenerator/shuttle", {
	modules: null,
});

// /datum/mapGenerator/shuttle/floor/proc/<init>  (code/modules/procedural_mapping/mapGenerators/shuttle.dm:15)
rt.def("/datum/mapGenerator/shuttle/floor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/shuttleFloor")));
	return f.dot;
});
