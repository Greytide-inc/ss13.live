// Based on /tg/station's code/modules/clothing/under/trek.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(8440, "/obj/item/clothing/under/trek/engsec", "/obj/item/clothing/under/trek", {
	name: "engsec uniform",
	desc: "The uniform worn by engineering/security officers",
	icon_state: "trek_engsec",
	item_color: "trek_engsec",
	item_state: "r_suit",
	armor: null,
	strip_delay: 50,
});

// trek.dm:22
rt.def("/obj/item/clothing/under/trek/engsec/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]);
	return f.dot;
});
