// From code/game/objects/items/devices/sensor_device.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9288, "/obj/item/device/sensor_device", "/obj/item/device", {
	name: "handheld crew monitor",
	desc: "A miniature machine that tracks suit sensors across the station.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "scanner",
	w_class: 2,
	slot_flags: 512,
	origin_tech: "programming=3;materials=3;magnets=3",
});

// /obj/item/device/sensor_device/proc/attack_self  (code/game/objects/items/devices/sensor_device.dm:11)  may sleep
rt.def("/obj/item/device/sensor_device/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, rt.gl("crewmonitor"), "show", [live(user)]);
	return f.dot;
}, true);
