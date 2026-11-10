// Based on /tg/station's code/modules/procedural_mapping/mapGenerators/nature.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1887, "/datum/mapGenerator/nature", "/datum/mapGenerator", {
	modules: null,
});

// nature.dm:5
rt.def("/datum/mapGenerator/nature/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomLayer/grassTurfs"), T("/datum/mapGeneratorModule/pineTrees"), T("/datum/mapGeneratorModule/deadTrees"), T("/datum/mapGeneratorModule/randBushes"), T("/datum/mapGeneratorModule/randRocks"), T("/datum/mapGeneratorModule/denseLayer/grassTufts"));
	return f.dot;
});
