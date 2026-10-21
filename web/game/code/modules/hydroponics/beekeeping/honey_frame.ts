// From code/modules/hydroponics/beekeeping/honey_frame.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10088, "/obj/item/honey_frame", "/obj/item", {
	honeycomb_capacity: 10,
	name: "honey frame",
	desc: "A scaffold for bees to build honeycomb on.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "honey_frame",
});

// /obj/item/honey_frame/proc/Initialize  (code/modules/hydroponics/beekeeping/honey_frame.dm:11)  may sleep
rt.def("/obj/item/honey_frame/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [8, -8])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [8, -8])));
	return f.dot;
}, true);
