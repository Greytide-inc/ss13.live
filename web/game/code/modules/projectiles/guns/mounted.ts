// From code/modules/projectiles/guns/mounted.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5154, "/obj/item/weapon/gun/energy/e_gun/advtaser/mounted", "/obj/item/weapon/gun/energy/e_gun/advtaser", {
	name: "mounted taser",
	desc: "An arm mounted dual-mode weapon that fires electrodes and disabler shots.",
	icon: rt.rsc("icons/obj/items_cyborg.dmi"),
	icon_state: "taser",
	item_state: "armcannonstun4",
	force: 5,
	selfcharge: 1,
	can_flashlight: 0,
	trigger_guard: -1,
});

// /obj/item/weapon/gun/energy/e_gun/advtaser/mounted/proc/dropped  (code/modules/projectiles/guns/mounted.dm:13)  may sleep
rt.def("/obj/item/weapon/gun/energy/e_gun/advtaser/mounted/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(5142, "/obj/item/weapon/gun/energy/laser/mounted", "/obj/item/weapon/gun/energy/laser", {
	name: "mounted laser",
	desc: "An arm mounted cannon that fires lethal lasers.",
	icon: rt.rsc("icons/obj/items_cyborg.dmi"),
	icon_state: "laser",
	item_state: "armcannonlase",
	force: 5,
	selfcharge: 1,
	trigger_guard: -1,
});

// /obj/item/weapon/gun/energy/laser/mounted/proc/dropped  (code/modules/projectiles/guns/mounted.dm:26)  may sleep
rt.def("/obj/item/weapon/gun/energy/laser/mounted/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
