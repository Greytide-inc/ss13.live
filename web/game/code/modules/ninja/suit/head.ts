// Based on /tg/station's code/modules/ninja/suit/head.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(7991, "/obj/item/clothing/head/helmet/space/space_ninja", "/obj/item/clothing/head/helmet/space", {
	desc: "What may appear to be a simple black garment is in fact a highly sophisticated nano-weave helmet. Standard issue ninja gear.",
	name: "ninja hood",
	icon_state: "s-ninja",
	item_state: "s-ninja_mask",
	armor: null,
	strip_delay: 12,
	resistance_flags: 35,
	blockTracking: 1,
	flags_inv: 992,
});

// head.dm:8
rt.def("/obj/item/clothing/head/helmet/space/space_ninja/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 60, "bullet", 50, "laser", 30, "energy", 15, "bomb", 30, "bio", 30, "rad", 25, "fire", 100, "acid", 100]);
	return f.dot;
});
