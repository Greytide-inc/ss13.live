// From code/modules/procedural_mapping/mapGenerators/syndicate.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1922, "/datum/mapGeneratorModule/bottomLayer/syndieFloor", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/bottomLayer/syndieFloor/proc/<init>  (code/modules/procedural_mapping/mapGenerators/syndicate.dm:7)
rt.def("/datum/mapGeneratorModule/bottomLayer/syndieFloor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf/open/floor/plasteel/shuttle/red/syndicate"), 100]));
	return f.dot;
});

rt.type(1937, "/datum/mapGeneratorModule/border/syndieWalls", "/datum/mapGeneratorModule/border", {
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// /datum/mapGeneratorModule/border/syndieWalls/proc/<init>  (code/modules/procedural_mapping/mapGenerators/syndicate.dm:10)
rt.def("/datum/mapGeneratorModule/border/syndieWalls/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableAtoms", rt.list());
	$0 = $0;
	rt.setSv(f, "spawnableTurfs", rt.alist(f, [T("/turf/closed/wall/r_wall"), 100]));
	return f.dot;
});

rt.type(1943, "/datum/mapGeneratorModule/syndieFurniture", "/datum/mapGeneratorModule", {
	clusterCheckFlags: 30,
	spawnableTurfs: null,
	spawnableAtoms: null,
});

// /datum/mapGeneratorModule/syndieFurniture/proc/<init>  (code/modules/procedural_mapping/mapGenerators/syndicate.dm:16)
rt.def("/datum/mapGeneratorModule/syndieFurniture/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableTurfs", rt.list());
	$0 = $0;
	rt.setSv(f, "spawnableAtoms", rt.alist(f, [T("/obj/structure/table"), 20, T("/obj/structure/chair"), 15, T("/obj/structure/chair/stool"), 10, T("/obj/structure/frame/computer"), 15, T("/obj/item/weapon/storage/toolbox/syndicate"), 15, T("/obj/structure/closet/syndicate"), 25, T("/obj/machinery/suit_storage_unit/syndicate"), 15]));
	return f.dot;
});

rt.type(1928, "/datum/mapGeneratorModule/splatterLayer/syndieMobs", "/datum/mapGeneratorModule/splatterLayer", {
	spawnableTurfs: null,
	spawnableAtoms: null,
});

// /datum/mapGeneratorModule/splatterLayer/syndieMobs/proc/<init>  (code/modules/procedural_mapping/mapGenerators/syndicate.dm:26)
rt.def("/datum/mapGeneratorModule/splatterLayer/syndieMobs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawnableTurfs", rt.list());
	$0 = $0;
	rt.setSv(f, "spawnableAtoms", rt.alist(f, [T("/mob/living/simple_animal/hostile/syndicate"), 30, T("/mob/living/simple_animal/hostile/syndicate/melee"), 20, T("/mob/living/simple_animal/hostile/syndicate/ranged"), 20, T("/mob/living/simple_animal/hostile/viscerator"), 30]));
	return f.dot;
});

rt.type(1895, "/datum/mapGenerator/syndicate/empty", "/datum/mapGenerator/syndicate", {
	modules: null,
});

// /datum/mapGenerator/syndicate/empty/proc/<init>  (code/modules/procedural_mapping/mapGenerators/syndicate.dm:31)
rt.def("/datum/mapGenerator/syndicate/empty/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/syndieFloor"), T("/datum/mapGeneratorModule/border/syndieWalls"), T("/datum/mapGeneratorModule/bottomLayer/repressurize")));
	return f.dot;
});

rt.type(1896, "/datum/mapGenerator/syndicate/mobsonly", "/datum/mapGenerator/syndicate", {
	modules: null,
});

// /datum/mapGenerator/syndicate/mobsonly/proc/<init>  (code/modules/procedural_mapping/mapGenerators/syndicate.dm:36)
rt.def("/datum/mapGenerator/syndicate/mobsonly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/syndieFloor"), T("/datum/mapGeneratorModule/border/syndieWalls"), T("/datum/mapGeneratorModule/splatterLayer/syndieMobs"), T("/datum/mapGeneratorModule/bottomLayer/repressurize")));
	return f.dot;
});

rt.type(1897, "/datum/mapGenerator/syndicate/furniture", "/datum/mapGenerator/syndicate", {
	modules: null,
});

// /datum/mapGenerator/syndicate/furniture/proc/<init>  (code/modules/procedural_mapping/mapGenerators/syndicate.dm:42)
rt.def("/datum/mapGenerator/syndicate/furniture/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/syndieFloor"), T("/datum/mapGeneratorModule/border/syndieWalls"), T("/datum/mapGeneratorModule/syndieFurniture"), T("/datum/mapGeneratorModule/bottomLayer/repressurize")));
	return f.dot;
});

rt.type(1898, "/datum/mapGenerator/syndicate/full", "/datum/mapGenerator/syndicate", {
	modules: null,
});

// /datum/mapGenerator/syndicate/full/proc/<init>  (code/modules/procedural_mapping/mapGenerators/syndicate.dm:48)
rt.def("/datum/mapGenerator/syndicate/full/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/syndieFloor"), T("/datum/mapGeneratorModule/border/syndieWalls"), T("/datum/mapGeneratorModule/syndieFurniture"), T("/datum/mapGeneratorModule/splatterLayer/syndieMobs"), T("/datum/mapGeneratorModule/bottomLayer/repressurize")));
	return f.dot;
});
