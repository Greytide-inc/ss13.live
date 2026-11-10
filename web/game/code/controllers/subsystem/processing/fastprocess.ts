// Based on /tg/station's code/controllers/subsystem/processing/fastprocess.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(53, "/datum/controller/subsystem/processing/fastprocess", "/datum/controller/subsystem/processing", {
	name: "Fast Processing",
	wait: 2,
	stat_tag: "FP",
});

// fastprocess.dm:3
rt.def("/datum/controller/subsystem/processing/fastprocess/proc/New", function* New(f: Frame) {
	if (GLOB.SSfastprocess != this) {
		if (rt.istype(GLOB.SSfastprocess, T("/datum/controller/subsystem/processing/fastprocess"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSfastprocess);
		}
		GLOB.SSfastprocess = this;
	}
	this.PreInit();
	return f.dot;
}, true);
