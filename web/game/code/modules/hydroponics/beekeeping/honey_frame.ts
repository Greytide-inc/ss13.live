// Based on /tg/station's code/modules/hydroponics/beekeeping/honey_frame.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10088, "/obj/item/honey_frame", "/obj/item", {
	honeycomb_capacity: 10,
	name: "honey frame",
	desc: "A scaffold for bees to build honeycomb on.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "honey_frame",
});

// honey_frame.dm:11
rt.def("/obj/item/honey_frame/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.pixel_x = rand(8, -8);
	this.pixel_y = rand(8, -8);
	return f.dot;
}, true);
