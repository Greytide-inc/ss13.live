// Types declared in code/modules/procedural_mapping that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(1871, "/datum/mapGenerator/asteroid", "/datum/mapGenerator", {});
rt.type(1891, "/datum/mapGenerator/shuttle", "/datum/mapGenerator", {});
rt.type(1894, "/datum/mapGenerator/syndicate", "/datum/mapGenerator", {});
rt.type(1906, "/datum/mapGeneratorModule/bottomlayer", "/datum/mapGeneratorModule", {});
rt.type(11521, "/obj/effect/landmark/mapGenerator/snowy", "/obj/effect/landmark/mapGenerator", {
	mapGeneratorType: rt.typePath("/datum/mapGenerator/snowy"),
	endTurfX: 159,
	endTurfY: 157,
	startTurfX: 37,
	startTurfY: 35,
});
