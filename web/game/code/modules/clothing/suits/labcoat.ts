// From code/modules/clothing/suits/labcoat.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/clothing/suit/toggle/labcoat/proc/<init>  (code/modules/clothing/suits/labcoat.dm:8)
rt.def("/obj/item/clothing/suit/toggle/labcoat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/analyzer"), T("/obj/item/stack/medical"), T("/obj/item/weapon/dnainjector"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/reagent_containers/hypospray"), T("/obj/item/device/healthanalyzer"), T("/obj/item/device/flashlight/pen"), T("/obj/item/weapon/reagent_containers/glass/bottle"), T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/reagent_containers/pill"), T("/obj/item/weapon/storage/pill_bottle"), T("/obj/item/weapon/paper"), T("/obj/item/weapon/melee/classic_baton/telescopic"), T("/obj/item/weapon/soap"), T("/obj/item/device/sensor_device"), T("/obj/item/weapon/tank/internals/emergency_oxygen")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 50, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});
