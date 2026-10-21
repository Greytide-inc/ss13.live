// From code/modules/procedural_mapping/mapGenerators/lava_river.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1883, "/datum/mapGenerator/lavaland", "/datum/mapGenerator", {
	start_z: 5,
	min_x: 0,
	min_y: 0,
	max_x: 0,
	max_y: 0,
	modules: null,
});

// /datum/mapGenerator/lavaland/proc/<init>  (code/modules/procedural_mapping/mapGenerators/lava_river.dm:7)
rt.def("/datum/mapGenerator/lavaland/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/river")));
	return f.dot;
});

// /datum/mapGenerator/lavaland/proc/defineRegion  (code/modules/procedural_mapping/mapGenerators/lava_river.dm:11)
rt.def("/datum/mapGenerator/lavaland/proc/defineRegion", function defineRegion(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	rt.setSv(f, "start_z", rt.fv(f, "z", live(f.args[0])));
	rt.setSv(f, "min_x", rt.call(f, P("/proc/min"), null, [rt.fv(f, "x", live(f.args[0])), rt.fv(f, "x", live(f.args[1]))]));
	rt.setSv(f, "min_y", rt.call(f, P("/proc/min"), null, [rt.fv(f, "y", live(f.args[0])), rt.fv(f, "y", live(f.args[1]))]));
	rt.setSv(f, "max_x", rt.call(f, P("/proc/max"), null, [rt.fv(f, "x", live(f.args[0])), rt.fv(f, "x", live(f.args[1]))]));
	rt.setSv(f, "max_y", rt.call(f, P("/proc/max"), null, [rt.fv(f, "y", live(f.args[0])), rt.fv(f, "y", live(f.args[1]))]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["Start", "End", "replace"] });

rt.type(1942, "/datum/mapGeneratorModule/river", "/datum/mapGeneratorModule", {
	river_nodes: 4,
	start_z: 5,
	river_type: rt.typePath("/turf/open/floor/plating/lava/smooth"),
});

// /datum/mapGeneratorModule/river/proc/generate  (code/modules/procedural_mapping/mapGenerators/lava_river.dm:23)  may sleep
rt.def("/datum/mapGeneratorModule/river/proc/generate", function* generate(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy((rt.istype((L = rt.sv(f, "mother")), T("/datum/mapGenerator/lavaland")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setSv(f, "start_z", rt.fv(f, "start_z", live(L)));
	yield* g.call(f, P("/proc/spawn_rivers"), null, [null, rt.sv(f, "start_z"), null, rt.sv(f, "river_nodes"), null, rt.sv(f, "river_type"), "min_x", rt.fv(f, "min_x", live(L)), "min_y", rt.fv(f, "min_y", live(L)), "max_x", rt.fv(f, "max_x", live(L)), "max_y", rt.fv(f, "max_y", live(L))], rt.Args.Named);
	return f.dot;
}, true);
