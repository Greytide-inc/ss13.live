// Based on /tg/station's code/modules/procedural_mapping/mapGeneratorObj.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// mapGeneratorObj.dm:12
rt.def("/obj/effect/landmark/mapGenerator/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.startTurfZ < 0) {
		this.startTurfZ = this.z;
	}
	if (this.endTurfZ < 0) {
		this.endTurfZ = this.z;
	}
	this.mapGenerator = (yield* new_(this.mapGeneratorType));
	this.mapGenerator.defineRegion(rt.locate(this.startTurfX, this.startTurfY, this.startTurfZ), rt.locate(this.endTurfX, this.endTurfY, this.endTurfZ));
	yield* this.mapGenerator.generate();
	return f.dot;
}, true);
