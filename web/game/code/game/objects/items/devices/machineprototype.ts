// Based on /tg/station's code/game/objects/items/devices/machineprototype.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(9262, "/obj/item/device/machineprototype", "/obj/item/device", {
	name: "machine prototype",
	desc: "A complicated machine prototype. You have no idea how it works.",
	icon: rt.rsc("icons/obj/machineprototype.dmi"),
	icon_state: "machineprototype",
	materials: null,
	origin_tech: "engineering=6",
});

// machineprototype.dm:6
rt.def("/obj/item/device/machineprototype/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 1000, "$glass", 500]);
	return f.dot;
});
