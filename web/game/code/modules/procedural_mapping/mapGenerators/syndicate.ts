// Based on /tg/station's code/modules/procedural_mapping/mapGenerators/syndicate.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1922, "/datum/mapGeneratorModule/bottomLayer/syndieFloor", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableTurfs: null,
});

// syndicate.dm:7
rt.def("/datum/mapGeneratorModule/bottomLayer/syndieFloor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = rt.alist(f, [T("/turf/open/floor/plasteel/shuttle/red/syndicate"), 100]);
	return f.dot;
});

rt.type(1937, "/datum/mapGeneratorModule/border/syndieWalls", "/datum/mapGeneratorModule/border", {
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// syndicate.dm:10
rt.def("/datum/mapGeneratorModule/border/syndieWalls/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = list();

	this.spawnableTurfs = rt.alist(f, [T("/turf/closed/wall/r_wall"), 100]);
	return f.dot;
});

rt.type(1943, "/datum/mapGeneratorModule/syndieFurniture", "/datum/mapGeneratorModule", {
	clusterCheckFlags: 30,
	spawnableTurfs: null,
	spawnableAtoms: null,
});

// syndicate.dm:16
rt.def("/datum/mapGeneratorModule/syndieFurniture/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = list();

	this.spawnableAtoms = rt.alist(f, [T("/obj/structure/table"), 20, T("/obj/structure/chair"), 15, T("/obj/structure/chair/stool"), 10, T("/obj/structure/frame/computer"), 15, T("/obj/item/weapon/storage/toolbox/syndicate"), 15, T("/obj/structure/closet/syndicate"), 25, T("/obj/machinery/suit_storage_unit/syndicate"), 15]);
	return f.dot;
});

rt.type(1928, "/datum/mapGeneratorModule/splatterLayer/syndieMobs", "/datum/mapGeneratorModule/splatterLayer", {
	spawnableTurfs: null,
	spawnableAtoms: null,
});

// syndicate.dm:26
rt.def("/datum/mapGeneratorModule/splatterLayer/syndieMobs/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = list();

	this.spawnableAtoms = rt.alist(f, [T("/mob/living/simple_animal/hostile/syndicate"), 30, T("/mob/living/simple_animal/hostile/syndicate/melee"), 20, T("/mob/living/simple_animal/hostile/syndicate/ranged"), 20, T("/mob/living/simple_animal/hostile/viscerator"), 30]);
	return f.dot;
});

rt.type(1895, "/datum/mapGenerator/syndicate/empty", "/datum/mapGenerator/syndicate", {
	modules: null,
});

// syndicate.dm:31
rt.def("/datum/mapGenerator/syndicate/empty/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/syndieFloor"), T("/datum/mapGeneratorModule/border/syndieWalls"), T("/datum/mapGeneratorModule/bottomLayer/repressurize"));
	return f.dot;
});

rt.type(1896, "/datum/mapGenerator/syndicate/mobsonly", "/datum/mapGenerator/syndicate", {
	modules: null,
});

// syndicate.dm:36
rt.def("/datum/mapGenerator/syndicate/mobsonly/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/syndieFloor"), T("/datum/mapGeneratorModule/border/syndieWalls"), T("/datum/mapGeneratorModule/splatterLayer/syndieMobs"), T("/datum/mapGeneratorModule/bottomLayer/repressurize"));
	return f.dot;
});

rt.type(1897, "/datum/mapGenerator/syndicate/furniture", "/datum/mapGenerator/syndicate", {
	modules: null,
});

// syndicate.dm:42
rt.def("/datum/mapGenerator/syndicate/furniture/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/syndieFloor"), T("/datum/mapGeneratorModule/border/syndieWalls"), T("/datum/mapGeneratorModule/syndieFurniture"), T("/datum/mapGeneratorModule/bottomLayer/repressurize"));
	return f.dot;
});

rt.type(1898, "/datum/mapGenerator/syndicate/full", "/datum/mapGenerator/syndicate", {
	modules: null,
});

// syndicate.dm:48
rt.def("/datum/mapGenerator/syndicate/full/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/syndieFloor"), T("/datum/mapGeneratorModule/border/syndieWalls"), T("/datum/mapGeneratorModule/syndieFurniture"), T("/datum/mapGeneratorModule/splatterLayer/syndieMobs"), T("/datum/mapGeneratorModule/bottomLayer/repressurize"));
	return f.dot;
});
