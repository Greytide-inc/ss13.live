// Based on /tg/station's code/game/objects/items/weapons/miscellaneous.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(7308, "/obj/item/weapon/skub", "/obj/item/weapon", {
	desc: "It's skub.",
	name: "skub",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "skub",
	w_class: 4,
	attack_verb: null,
});

// miscellaneous.dm:19
rt.def("/obj/item/weapon/skub/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("skubbed");
	return f.dot;
});
