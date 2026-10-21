// From code/modules/procedural_mapping/mapGenerators/repair.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1919, "/datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel", "/datum/mapGeneratorModule/bottomLayer", {
	ignore_wall: 0,
	allowAtomsOnSpace: 1,
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel/proc/<init>  (code/modules/procedural_mapping/mapGenerators/repair.dm:2)
rt.def("/datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf/open/floor/plasteel"), 100]));
	return f.dot;
});

// /datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel/proc/place  (code/modules/procedural_mapping/mapGenerators/repair.dm:7)  may sleep
rt.def("/datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel/proc/place", function* place(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/turf/closed")) ? 1 : 0)) && !truthy(rt.sv(f, "ignore_wall")))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["T"] });

rt.type(1935, "/datum/mapGeneratorModule/border/normalWalls", "/datum/mapGeneratorModule/border", {
	spawnableAtoms: null,
	allowAtomsOnSpace: 1,
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/border/normalWalls/proc/<init>  (code/modules/procedural_mapping/mapGenerators/repair.dm:15)
rt.def("/datum/mapGeneratorModule/border/normalWalls/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.list());
	$0 = $0;
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf/closed/wall"), 100]));
	return f.dot;
});

rt.type(1888, "/datum/mapGenerator/repair", "/datum/mapGenerator", {
	modules: null,
});

// /datum/mapGenerator/repair/proc/<init>  (code/modules/procedural_mapping/mapGenerators/repair.dm:20)
rt.def("/datum/mapGenerator/repair/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel"), T("/datum/mapGeneratorModule/bottomLayer/repressurize")));
	return f.dot;
});

rt.type(1889, "/datum/mapGenerator/repair/delete_walls", "/datum/mapGenerator/repair", {
	modules: null,
});

// /datum/mapGenerator/repair/delete_walls/proc/<init>  (code/modules/procedural_mapping/mapGenerators/repair.dm:24)
rt.def("/datum/mapGenerator/repair/delete_walls/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel/flatten"), T("/datum/mapGeneratorModule/bottomLayer/repressurize")));
	return f.dot;
});

rt.type(1890, "/datum/mapGenerator/repair/enclose_room", "/datum/mapGenerator/repair", {
	modules: null,
});

// /datum/mapGenerator/repair/enclose_room/proc/<init>  (code/modules/procedural_mapping/mapGenerators/repair.dm:28)
rt.def("/datum/mapGenerator/repair/enclose_room/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/repairFloorPlasteel/flatten"), T("/datum/mapGeneratorModule/border/normalWalls"), T("/datum/mapGeneratorModule/bottomLayer/repressurize")));
	return f.dot;
});
