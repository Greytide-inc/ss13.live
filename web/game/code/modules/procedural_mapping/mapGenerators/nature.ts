// From code/modules/procedural_mapping/mapGenerators/nature.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1887, "/datum/mapGenerator/nature", "/datum/mapGenerator", {
	modules: null,
});

// /datum/mapGenerator/nature/proc/<init>  (code/modules/procedural_mapping/mapGenerators/nature.dm:5)
rt.def("/datum/mapGenerator/nature/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modules", rt.list(T("/datum/mapGeneratorModule/bottomLayer/grassTurfs"), T("/datum/mapGeneratorModule/pineTrees"), T("/datum/mapGeneratorModule/deadTrees"), T("/datum/mapGeneratorModule/randBushes"), T("/datum/mapGeneratorModule/randRocks"), T("/datum/mapGeneratorModule/denseLayer/grassTufts")));
	return f.dot;
});
