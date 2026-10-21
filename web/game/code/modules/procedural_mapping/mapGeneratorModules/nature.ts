// From code/modules/procedural_mapping/mapGeneratorModules/nature.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1938, "/datum/mapGeneratorModule/pineTrees", "/datum/mapGeneratorModule", {
	spawnableAtoms: null,
});

// /datum/mapGeneratorModule/pineTrees/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModules/nature.dm:7)
rt.def("/datum/mapGeneratorModule/pineTrees/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.alist(f, [T("/obj/structure/flora/tree/pine"), 30]));
	return f.dot;
});

rt.type(1939, "/datum/mapGeneratorModule/deadTrees", "/datum/mapGeneratorModule", {
	spawnableAtoms: null,
});

// /datum/mapGeneratorModule/deadTrees/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModules/nature.dm:11)
rt.def("/datum/mapGeneratorModule/deadTrees/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.alist(f, [T("/obj/structure/flora/tree/dead"), 10]));
	return f.dot;
});

rt.type(1940, "/datum/mapGeneratorModule/randBushes", "/datum/mapGeneratorModule", {
	spawnableAtoms: null,
});

// /datum/mapGeneratorModule/randBushes/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModules/nature.dm:15)
rt.def("/datum/mapGeneratorModule/randBushes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.list());
	return f.dot;
});

// /datum/mapGeneratorModule/randBushes/proc/New  (code/modules/procedural_mapping/mapGeneratorModules/nature.dm:18)
rt.def("/datum/mapGeneratorModule/randBushes/proc/New", function New(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "spawnableAtoms", rt.call(f, P("/proc/typesof"), null, [T("/obj/structure/flora/ausbushes")]));
	i = null;
	rt.forList(f, 0, rt.sv(f, "spawnableAtoms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.setAt(rt.sv(f, "spawnableAtoms"), live(i), 20);
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(1941, "/datum/mapGeneratorModule/randRocks", "/datum/mapGeneratorModule", {
	spawnableAtoms: null,
});

// /datum/mapGeneratorModule/randRocks/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModules/nature.dm:26)
rt.def("/datum/mapGeneratorModule/randRocks/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.alist(f, [T("/obj/structure/flora/rock"), 40, T("/obj/structure/flora/rock/pile"), 20]));
	return f.dot;
});

rt.type(1911, "/datum/mapGeneratorModule/bottomLayer/grassTurfs", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/bottomLayer/grassTurfs/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModules/nature.dm:31)
rt.def("/datum/mapGeneratorModule/bottomLayer/grassTurfs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf/open/floor/grass"), 100]));
	return f.dot;
});

rt.type(1930, "/datum/mapGeneratorModule/denseLayer/grassTufts", "/datum/mapGeneratorModule/denseLayer", {
	spawnableTurfs: null,
	spawnableAtoms: null,
});

// /datum/mapGeneratorModule/denseLayer/grassTufts/proc/<init>  (code/modules/procedural_mapping/mapGeneratorModules/nature.dm:36)
rt.def("/datum/mapGeneratorModule/denseLayer/grassTufts/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableTurfs", rt.list());
	$0 = $0;
	rt.setSv(f, "spawnableAtoms", rt.alist(f, [T("/obj/structure/flora/ausbushes/grassybush"), 75]));
	return f.dot;
});
