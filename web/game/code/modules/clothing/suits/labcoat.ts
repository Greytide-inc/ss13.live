// Based on /tg/station's code/modules/clothing/suits/labcoat.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7854, "/obj/item/clothing/suit/toggle/labcoat", "/obj/item/clothing/suit/toggle", {
	blood_overlay_type: "coat",
	togglename: "buttons",
	name: "labcoat",
	desc: "A suit that protects against minor chemical spills.",
	icon_state: "labcoat",
	item_state: "labcoat",
	body_parts_covered: 386,
	allowed: null,
	armor: null,
});

// labcoat.dm:8
rt.def("/obj/item/clothing/suit/toggle/labcoat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/device/analyzer"), T("/obj/item/stack/medical"), T("/obj/item/weapon/dnainjector"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/reagent_containers/hypospray"), T("/obj/item/device/healthanalyzer"), T("/obj/item/device/flashlight/pen"), T("/obj/item/weapon/reagent_containers/glass/bottle"), T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/reagent_containers/pill"), T("/obj/item/weapon/storage/pill_bottle"), T("/obj/item/weapon/paper"), T("/obj/item/weapon/melee/classic_baton/telescopic"), T("/obj/item/weapon/soap"), T("/obj/item/device/sensor_device"), T("/obj/item/weapon/tank/internals/emergency_oxygen"));
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 50, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});
