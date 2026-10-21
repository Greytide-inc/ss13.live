// From code/modules/procedural_mapping/mapGenerators/cult.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1914, "/datum/mapGeneratorModule/bottomLayer/cultFloor", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/bottomLayer/cultFloor/proc/<init>  (code/modules/procedural_mapping/mapGenerators/cult.dm:2)
rt.def("/datum/mapGeneratorModule/bottomLayer/cultFloor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf/open/floor/engine/cult"), 100]));
	return f.dot;
});

rt.type(1933, "/datum/mapGeneratorModule/border/cultWalls", "/datum/mapGeneratorModule/border", {
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/border/cultWalls/proc/<init>  (code/modules/procedural_mapping/mapGenerators/cult.dm:5)
rt.def("/datum/mapGeneratorModule/border/cultWalls/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf/closed/wall/mineral/cult"), 100]));
	return f.dot;
});

rt.type(1915, "/datum/mapGeneratorModule/bottomLayer/clockFloor", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/bottomLayer/clockFloor/proc/<init>  (code/modules/procedural_mapping/mapGenerators/cult.dm:9)
rt.def("/datum/mapGeneratorModule/bottomLayer/clockFloor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf/open/floor/clockwork"), 100]));
	return f.dot;
});

rt.type(1934, "/datum/mapGeneratorModule/border/clockWalls", "/datum/mapGeneratorModule/border", {
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/border/clockWalls/proc/<init>  (code/modules/procedural_mapping/mapGenerators/cult.dm:12)
rt.def("/datum/mapGeneratorModule/border/clockWalls/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf/closed/wall/clockwork"), 100]));
	return f.dot;
});

rt.type(1879, "/datum/mapGenerator/cult", "/datum/mapGenerator", {
	modules: null,
});

// /datum/mapGenerator/cult/proc/<init>  (code/modules/procedural_mapping/mapGenerators/cult.dm:16)
rt.def("/datum/mapGenerator/cult/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/cultFloor"), T("/datum/mapGeneratorModule/border/cultWalls"), T("/datum/mapGeneratorModule/bottomLayer/repressurize")));
	return f.dot;
});

rt.type(1881, "/datum/mapGenerator/clock", "/datum/mapGenerator", {
	modules: null,
});

// /datum/mapGenerator/clock/proc/<init>  (code/modules/procedural_mapping/mapGenerators/cult.dm:21)
rt.def("/datum/mapGenerator/clock/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/clockFloor"), T("/datum/mapGeneratorModule/border/clockWalls"), T("/datum/mapGeneratorModule/bottomLayer/repressurize")));
	return f.dot;
});

rt.type(1880, "/datum/mapGenerator/cult/floor", "/datum/mapGenerator/cult", {
	modules: null,
});

// /datum/mapGenerator/cult/floor/proc/<init>  (code/modules/procedural_mapping/mapGenerators/cult.dm:26)
rt.def("/datum/mapGenerator/cult/floor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/cultFloor"), T("/datum/mapGeneratorModule/bottomLayer/repressurize")));
	return f.dot;
});

rt.type(1882, "/datum/mapGenerator/clock/floor", "/datum/mapGenerator/clock", {
	modules: null,
});

// /datum/mapGenerator/clock/floor/proc/<init>  (code/modules/procedural_mapping/mapGenerators/cult.dm:30)
rt.def("/datum/mapGenerator/clock/floor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/clockFloor"), T("/datum/mapGeneratorModule/bottomLayer/repressurize")));
	return f.dot;
});
