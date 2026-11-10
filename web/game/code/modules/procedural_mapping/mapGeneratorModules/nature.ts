// Based on /tg/station's code/modules/procedural_mapping/mapGeneratorModules/nature.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1938, "/datum/mapGeneratorModule/pineTrees", "/datum/mapGeneratorModule", {
	spawnableAtoms: null,
});

// nature.dm:7
rt.def("/datum/mapGeneratorModule/pineTrees/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = rt.alist(f, [T("/obj/structure/flora/tree/pine"), 30]);
	return f.dot;
});

rt.type(1939, "/datum/mapGeneratorModule/deadTrees", "/datum/mapGeneratorModule", {
	spawnableAtoms: null,
});

// nature.dm:11
rt.def("/datum/mapGeneratorModule/deadTrees/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = rt.alist(f, [T("/obj/structure/flora/tree/dead"), 10]);
	return f.dot;
});

rt.type(1940, "/datum/mapGeneratorModule/randBushes", "/datum/mapGeneratorModule", {
	spawnableAtoms: null,
});

// nature.dm:15
rt.def("/datum/mapGeneratorModule/randBushes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = list();
	return f.dot;
});

// nature.dm:18
rt.def("/datum/mapGeneratorModule/randBushes/proc/New", function New(f: Frame) {
	let i: Value = null;
	parent_proc();
	this.spawnableAtoms = typesof(T("/obj/structure/flora/ausbushes"));
	for (i of each(this.spawnableAtoms)) {
		rt.setAt(this.spawnableAtoms, i, 20);
	}
	return f.dot;
});

rt.type(1941, "/datum/mapGeneratorModule/randRocks", "/datum/mapGeneratorModule", {
	spawnableAtoms: null,
});

// nature.dm:26
rt.def("/datum/mapGeneratorModule/randRocks/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = rt.alist(f, [T("/obj/structure/flora/rock"), 40, T("/obj/structure/flora/rock/pile"), 20]);
	return f.dot;
});

rt.type(1911, "/datum/mapGeneratorModule/bottomLayer/grassTurfs", "/datum/mapGeneratorModule/bottomLayer", {
	spawnableTurfs: null,
});

// nature.dm:31
rt.def("/datum/mapGeneratorModule/bottomLayer/grassTurfs/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = rt.alist(f, [T("/turf/open/floor/grass"), 100]);
	return f.dot;
});

rt.type(1930, "/datum/mapGeneratorModule/denseLayer/grassTufts", "/datum/mapGeneratorModule/denseLayer", {
	spawnableTurfs: null,
	spawnableAtoms: null,
});

// nature.dm:36
rt.def("/datum/mapGeneratorModule/denseLayer/grassTufts/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = list();

	this.spawnableAtoms = rt.alist(f, [T("/obj/structure/flora/ausbushes/grassybush"), 75]);
	return f.dot;
});
