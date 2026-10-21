// From code/controllers/subsystem/processing/fields.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(54, "/datum/controller/subsystem/processing/fields", "/datum/controller/subsystem/processing", {
	name: "Fields",
	wait: 2,
	priority: 40,
	flags: 33,
	runlevels: 12,
});

// /datum/controller/subsystem/processing/fields/proc/New  (code/controllers/subsystem/processing/fields.dm:1)  may sleep
rt.def("/datum/controller/subsystem/processing/fields/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSfields"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSfields"), T("/datum/controller/subsystem/processing/fields")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSfields")]);
		}
		rt.setGl("SSfields", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);
