// From code/game/objects/items/devices/machineprototype.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9262, "/obj/item/device/machineprototype", "/obj/item/device", {
	name: "machine prototype",
	desc: "A complicated machine prototype. You have no idea how it works.",
	icon: rt.rsc("icons/obj/machineprototype.dmi"),
	icon_state: "machineprototype",
	materials: null,
	origin_tech: "engineering=6",
});

// /obj/item/device/machineprototype/proc/<init>  (code/game/objects/items/devices/machineprototype.dm:6)
rt.def("/obj/item/device/machineprototype/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000, "$glass", 500]));
	return f.dot;
});
