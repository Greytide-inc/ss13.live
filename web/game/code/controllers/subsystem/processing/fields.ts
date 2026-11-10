// Based on /tg/station's code/controllers/subsystem/processing/fields.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(54, "/datum/controller/subsystem/processing/fields", "/datum/controller/subsystem/processing", {
	name: "Fields",
	wait: 2,
	priority: 40,
	flags: 33,
	runlevels: 12,
});

// fields.dm:1
rt.def("/datum/controller/subsystem/processing/fields/proc/New", function* New(f: Frame) {
	if (GLOB.SSfields != this) {
		if (rt.istype(GLOB.SSfields, T("/datum/controller/subsystem/processing/fields"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSfields);
		}
		GLOB.SSfields = this;
	}
	this.PreInit();
	return f.dot;
}, true);
