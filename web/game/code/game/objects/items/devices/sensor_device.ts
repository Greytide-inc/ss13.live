// Based on /tg/station's code/game/objects/items/devices/sensor_device.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(9288, "/obj/item/device/sensor_device", "/obj/item/device", {
	name: "handheld crew monitor",
	desc: "A miniature machine that tracks suit sensors across the station.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "scanner",
	w_class: 2,
	slot_flags: 512,
	origin_tech: "programming=3;materials=3;magnets=3",
});

// sensor_device.dm:11
rt.def("/obj/item/device/sensor_device/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* GLOB.crewmonitor.show(user);
	return f.dot;
}, true);
