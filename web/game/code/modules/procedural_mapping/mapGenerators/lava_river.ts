// Based on /tg/station's code/modules/procedural_mapping/mapGenerators/lava_river.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1883, "/datum/mapGenerator/lavaland", "/datum/mapGenerator", {
	start_z: 5,
	min_x: 0,
	min_y: 0,
	max_x: 0,
	max_y: 0,
	modules: null,
});

// lava_river.dm:7
rt.def("/datum/mapGenerator/lavaland/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/river"));
	return f.dot;
});

// lava_river.dm:11
rt.def("/datum/mapGenerator/lavaland/proc/defineRegion", function defineRegion(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	this.start_z = f.args[0].z;
	this.min_x = min(f.args[0].x, f.args[1].x);
	this.min_y = min(f.args[0].y, f.args[1].y);
	this.max_x = max(f.args[0].x, f.args[1].x);
	this.max_y = max(f.args[0].y, f.args[1].y);
	parent_proc();
	return f.dot;
}, false, { args: ["Start", "End", "replace"] });

rt.type(1942, "/datum/mapGeneratorModule/river", "/datum/mapGeneratorModule", {
	river_nodes: 4,
	start_z: 5,
	river_type: rt.typePath("/turf/open/floor/plating/lava/smooth"),
});

// lava_river.dm:23
rt.def("/datum/mapGeneratorModule/river/proc/generate", function* generate(f: Frame) {
	let L: Value = null;
	if (!rt.istype((L = this.mother), T("/datum/mapGenerator/lavaland"))) {
		return f.dot;
	}
	this.start_z = L.start_z;
	yield* spawn_rivers(this.start_z, this.river_nodes, this.river_type, { min_x: L.min_x, min_y: L.min_y, max_x: L.max_x, max_y: L.max_y });
	return f.dot;
}, true);
