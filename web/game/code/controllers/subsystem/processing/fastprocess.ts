// From code/controllers/subsystem/processing/fastprocess.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(53, "/datum/controller/subsystem/processing/fastprocess", "/datum/controller/subsystem/processing", {
	name: "Fast Processing",
	wait: 2,
	stat_tag: "FP",
});

// /datum/controller/subsystem/processing/fastprocess/proc/New  (code/controllers/subsystem/processing/fastprocess.dm:3)  may sleep
rt.def("/datum/controller/subsystem/processing/fastprocess/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSfastprocess"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSfastprocess"), T("/datum/controller/subsystem/processing/fastprocess")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSfastprocess")]);
		}
		rt.setGl("SSfastprocess", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);
