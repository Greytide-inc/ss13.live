// From code/modules/procedural_mapping/mapGeneratorObj.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11520, "/obj/effect/landmark/mapGenerator", "/obj/effect/landmark", {
	startTurfX: 0,
	startTurfY: 0,
	startTurfZ: -1,
	endTurfX: 0,
	endTurfY: 0,
	endTurfZ: -1,
	mapGeneratorType: rt.typePath("/datum/mapGenerator/nature"),
	mapGenerator: null,
});

// /obj/effect/landmark/mapGenerator/proc/New  (code/modules/procedural_mapping/mapGeneratorObj.dm:12)  may sleep
rt.def("/obj/effect/landmark/mapGenerator/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (rt.lt(rt.sv(f, "startTurfZ"), 0)) {
		rt.setSv(f, "startTurfZ", rt.sv(f, "z"));
	}
	if (rt.lt(rt.sv(f, "endTurfZ"), 0)) {
		rt.setSv(f, "endTurfZ", rt.sv(f, "z"));
	}
	rt.setSv(f, "mapGenerator", (yield* g.new_(f, rt.sv(f, "mapGeneratorType"), [])));
	yield* g.callName(f, rt.sv(f, "mapGenerator"), "defineRegion", [rt.locate(rt.sv(f, "startTurfX"), rt.sv(f, "startTurfY"), rt.sv(f, "startTurfZ")), rt.locate(rt.sv(f, "endTurfX"), rt.sv(f, "endTurfY"), rt.sv(f, "endTurfZ"))]);
	yield* g.callName(f, rt.sv(f, "mapGenerator"), "generate", []);
	return f.dot;
}, true);
