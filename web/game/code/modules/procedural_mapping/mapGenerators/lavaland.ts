// Based on /tg/station's code/modules/procedural_mapping/mapGenerators/lavaland.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1916, "/datum/mapGeneratorModule/bottomLayer/lavaland_default", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableTurfs: null,
});

// lavaland.dm:3
rt.def("/datum/mapGeneratorModule/bottomLayer/lavaland_default/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = rt.alist(f, [T("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"), 100]);
	return f.dot;
});

rt.type(1917, "/datum/mapGeneratorModule/bottomLayer/lavaland_mineral", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableTurfs: null,
});

// lavaland.dm:6
rt.def("/datum/mapGeneratorModule/bottomLayer/lavaland_mineral/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = rt.alist(f, [T("/turf/closed/mineral/random/volcanic"), 100]);
	return f.dot;
});

rt.type(1918, "/datum/mapGeneratorModule/bottomLayer/lavaland_mineral/dense", "/datum/mapGeneratorModule/bottomLayer/lavaland_mineral", {
	spawnableTurfs: null,
});

// lavaland.dm:9
rt.def("/datum/mapGeneratorModule/bottomLayer/lavaland_mineral/dense/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = rt.alist(f, [T("/turf/closed/mineral/random/high_chance/volcanic"), 100]);
	return f.dot;
});

rt.type(1926, "/datum/mapGeneratorModule/splatterLayer/lavalandMonsters", "/datum/mapGeneratorModule/splatterLayer", {
	spawnableTurfs: null,
	spawnableAtoms: null,
});

// lavaland.dm:12
rt.def("/datum/mapGeneratorModule/splatterLayer/lavalandMonsters/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = list();

	this.spawnableAtoms = rt.alist(f, [T("/mob/living/simple_animal/hostile/asteroid/goliath/beast"), 10, T("/mob/living/simple_animal/hostile/asteroid/hivelord/legion"), 10, T("/mob/living/simple_animal/hostile/asteroid/basilisk/watcher"), 10]);
	return f.dot;
});

rt.type(1927, "/datum/mapGeneratorModule/splatterLayer/lavalandTendrils", "/datum/mapGeneratorModule/splatterLayer", {
	spawnableTurfs: null,
	spawnableAtoms: null,
});

// lavaland.dm:18
rt.def("/datum/mapGeneratorModule/splatterLayer/lavalandTendrils/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = list();

	this.spawnableAtoms = rt.alist(f, [T("/mob/living/simple_animal/hostile/spawner/lavaland"), 5, T("/mob/living/simple_animal/hostile/spawner/lavaland/legion"), 5, T("/mob/living/simple_animal/hostile/spawner/lavaland/goliath"), 5]);
	return f.dot;
});

rt.type(1884, "/datum/mapGenerator/lavaland/ground_only", "/datum/mapGenerator/lavaland", {
	modules: null,
});

// lavaland.dm:24
rt.def("/datum/mapGenerator/lavaland/ground_only/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/lavaland_default"));
	return f.dot;
});

rt.type(1885, "/datum/mapGenerator/lavaland/dense_ores", "/datum/mapGenerator/lavaland", {
	modules: null,
});

// lavaland.dm:27
rt.def("/datum/mapGenerator/lavaland/dense_ores/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/lavaland_mineral/dense"));
	return f.dot;
});

rt.type(1886, "/datum/mapGenerator/lavaland/normal_ores", "/datum/mapGenerator/lavaland", {
	modules: null,
});

// lavaland.dm:30
rt.def("/datum/mapGenerator/lavaland/normal_ores/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/lavaland_mineral"));
	return f.dot;
});
