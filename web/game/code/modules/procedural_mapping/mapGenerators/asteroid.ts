// Based on /tg/station's code/modules/procedural_mapping/mapGenerators/asteroid.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1912, "/datum/mapGeneratorModule/bottomLayer/asteroidTurfs", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableTurfs: null,
});

// asteroid.dm:3
rt.def("/datum/mapGeneratorModule/bottomLayer/asteroidTurfs/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = rt.alist(f, [T("/turf/open/floor/plating/asteroid"), 100]);
	return f.dot;
});

rt.type(1913, "/datum/mapGeneratorModule/bottomLayer/asteroidWalls", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableTurfs: null,
});

// asteroid.dm:6
rt.def("/datum/mapGeneratorModule/bottomLayer/asteroidWalls/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = rt.alist(f, [T("/turf/closed/mineral"), 100]);
	return f.dot;
});

rt.type(1932, "/datum/mapGeneratorModule/border/asteroidWalls", "/datum/mapGeneratorModule/border", {
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// asteroid.dm:10
rt.def("/datum/mapGeneratorModule/border/asteroidWalls/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = list();

	this.spawnableTurfs = rt.alist(f, [T("/turf/closed/mineral"), 100]);
	return f.dot;
});

rt.type(1924, "/datum/mapGeneratorModule/splatterLayer/asteroidWalls", "/datum/mapGeneratorModule/splatterLayer", {
	clusterCheckFlags: 0,
	spawnableAtoms: null,
	spawnableTurfs: null,
});

// asteroid.dm:16
rt.def("/datum/mapGeneratorModule/splatterLayer/asteroidWalls/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = list();

	this.spawnableTurfs = rt.alist(f, [T("/turf/closed/mineral"), 30]);
	return f.dot;
});

rt.type(1925, "/datum/mapGeneratorModule/splatterLayer/asteroidMonsters", "/datum/mapGeneratorModule/splatterLayer", {
	spawnableTurfs: null,
	spawnableAtoms: null,
});

// asteroid.dm:21
rt.def("/datum/mapGeneratorModule/splatterLayer/asteroidMonsters/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = list();

	this.spawnableAtoms = rt.alist(f, [T("/mob/living/simple_animal/hostile/asteroid/basilisk"), 10, T("/mob/living/simple_animal/hostile/asteroid/hivelord"), 10, T("/mob/living/simple_animal/hostile/asteroid/goliath"), 10]);
	return f.dot;
});

rt.type(1872, "/datum/mapGenerator/asteroid/hollow", "/datum/mapGenerator/asteroid", {
	modules: null,
});

// asteroid.dm:30
rt.def("/datum/mapGenerator/asteroid/hollow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/asteroidTurfs"), T("/datum/mapGeneratorModule/border/asteroidWalls"));
	return f.dot;
});

rt.type(1873, "/datum/mapGenerator/asteroid/hollow/random", "/datum/mapGenerator/asteroid/hollow", {
	modules: null,
});

// asteroid.dm:34
rt.def("/datum/mapGenerator/asteroid/hollow/random/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/asteroidTurfs"), T("/datum/mapGeneratorModule/border/asteroidWalls"), T("/datum/mapGeneratorModule/splatterLayer/asteroidWalls"));
	return f.dot;
});

rt.type(1874, "/datum/mapGenerator/asteroid/hollow/random/monsters", "/datum/mapGenerator/asteroid/hollow/random", {
	modules: null,
});

// asteroid.dm:39
rt.def("/datum/mapGenerator/asteroid/hollow/random/monsters/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/asteroidTurfs"), T("/datum/mapGeneratorModule/border/asteroidWalls"), T("/datum/mapGeneratorModule/splatterLayer/asteroidWalls"), T("/datum/mapGeneratorModule/splatterLayer/asteroidMonsters"));
	return f.dot;
});

rt.type(1875, "/datum/mapGenerator/asteroid/filled", "/datum/mapGenerator/asteroid", {
	modules: null,
});

// asteroid.dm:45
rt.def("/datum/mapGenerator/asteroid/filled/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/asteroidWalls"));
	return f.dot;
});
