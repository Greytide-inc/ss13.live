// From code/modules/clothing/suits/miscellaneous.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7874, "/obj/item/clothing/suit/bluetag", "/obj/item/clothing/suit", {
	blood_overlay_type: "armor",
	name: "blue laser tag armor",
	desc: "A piece of plastic armor. It has sensors that react to red light.",
	icon_state: "bluetag",
	item_state: "bluetag",
	body_parts_covered: 2,
	allowed: null,
	resistance_flags: 0,
});

// /obj/item/clothing/suit/bluetag/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:18)
rt.def("/obj/item/clothing/suit/bluetag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun/energy/laser/bluetag")));
	return f.dot;
});

rt.type(7875, "/obj/item/clothing/suit/redtag", "/obj/item/clothing/suit", {
	blood_overlay_type: "armor",
	name: "red laser tag armor",
	desc: "A piece of plastic armor. It has sensors that react to blue light.",
	icon_state: "redtag",
	item_state: "redtag",
	body_parts_covered: 2,
	allowed: null,
	resistance_flags: 0,
});

// /obj/item/clothing/suit/redtag/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:28)
rt.def("/obj/item/clothing/suit/redtag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun/energy/laser/redtag")));
	return f.dot;
});

rt.type(7876, "/obj/item/clothing/suit/pirate", "/obj/item/clothing/suit", {
	name: "pirate coat",
	desc: "Yarr.",
	icon_state: "pirate",
	item_state: "pirate",
	allowed: null,
});

// /obj/item/clothing/suit/pirate/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:39)
rt.def("/obj/item/clothing/suit/pirate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/melee/energy/sword/pirate"), T("/obj/item/clothing/glasses/eyepatch"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/rum")));
	return f.dot;
});

rt.type(7880, "/obj/item/clothing/suit/judgerobe", "/obj/item/clothing/suit", {
	name: "judge's robe",
	desc: "This robe commands authority.",
	icon_state: "judge",
	item_state: "judge",
	body_parts_covered: 414,
	allowed: null,
	flags_inv: 4,
});

// /obj/item/clothing/suit/judgerobe/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:72)
rt.def("/obj/item/clothing/suit/judgerobe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/stack/spacecash")));
	return f.dot;
});

rt.type(7881, "/obj/item/clothing/suit/syndicatefake", "/obj/item/clothing/suit", {
	name: "black and red space suit replica",
	icon_state: "syndicate-black-red",
	item_state: "syndicate-black-red",
	desc: "A plastic replica of the Syndicate space suit. You'll look just like a real murderous Syndicate agent in this! This is a toy, it is not made for use in space!",
	w_class: 3,
	allowed: null,
	flags_inv: 13,
	resistance_flags: 0,
});

// /obj/item/clothing/suit/syndicatefake/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:90)
rt.def("/obj/item/clothing/suit/syndicatefake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/toy")));
	return f.dot;
});

rt.type(7883, "/obj/item/clothing/suit/imperium_monk", "/obj/item/clothing/suit", {
	name: "１Imperium monk suit",
	desc: "Have YOU killed a xeno today?",
	icon_state: "imperium_monk",
	item_state: "imperium_monk",
	body_parts_covered: 414,
	flags_inv: 12,
	allowed: null,
});

// /obj/item/clothing/suit/imperium_monk/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:110)
rt.def("/obj/item/clothing/suit/imperium_monk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/storage/book/bible"), T("/obj/item/weapon/nullrod"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater"), T("/obj/item/weapon/storage/fancy/candle_box"), T("/obj/item/candle"), T("/obj/item/weapon/tank/internals/emergency_oxygen")));
	return f.dot;
});

rt.type(7862, "/obj/item/clothing/suit/toggle/owlwings", "/obj/item/clothing/suit/toggle", {
	togglename: "wings",
	name: "owl cloak",
	desc: "A soft brown cloak made of synthetic feathers. Soft to the touch, stylish, and a 2 meter wing span that will drive the ladies mad.",
	icon_state: "owl_wings",
	item_state: "owl_wings",
	body_parts_covered: 386,
	allowed: null,
	actions_types: null,
});

// /obj/item/clothing/suit/toggle/owlwings/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:137)
rt.def("/obj/item/clothing/suit/toggle/owlwings/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/weapon/gun/ballistic"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/device/flashlight/seclite"), T("/obj/item/weapon/melee/classic_baton/telescopic")));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_wings")));
	return f.dot;
});

rt.type(7886, "/obj/item/clothing/suit/holidaypriest", "/obj/item/clothing/suit", {
	name: "holiday priest",
	desc: "This is a nice holiday, my son.",
	icon_state: "holidaypriest",
	item_state: "w_suit",
	body_parts_covered: 414,
	flags_inv: 4,
	allowed: null,
});

// /obj/item/clothing/suit/holidaypriest/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:154)
rt.def("/obj/item/clothing/suit/holidaypriest/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/storage/book/bible"), T("/obj/item/weapon/nullrod"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater"), T("/obj/item/weapon/storage/fancy/candle_box"), T("/obj/item/candle"), T("/obj/item/weapon/tank/internals/emergency_oxygen")));
	return f.dot;
});

rt.type(7887, "/obj/item/clothing/suit/cardborg", "/obj/item/clothing/suit", {
	name: "cardborg suit",
	desc: "An ordinary cardboard box with holes cut in the sides.",
	icon_state: "cardborg",
	item_state: "cardborg",
	body_parts_covered: 6,
	flags_inv: 4,
	dog_fashion: rt.typePath("/datum/dog_fashion/back"),
});

// /obj/item/clothing/suit/cardborg/proc/equipped  (code/modules/clothing/suits/miscellaneous.dm:166)  may sleep
rt.def("/obj/item/clothing/suit/cardborg/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(live(f.args[1]), 13)) return f.dot;
	yield* g.srcCall(f, "disguise", live(f.args[0]));
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/suit/cardborg/proc/dropped  (code/modules/clothing/suits/miscellaneous.dm:171)  may sleep
rt.def("/obj/item/clothing/suit/cardborg/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, live(f.args[0]), "remove_alt_appearance", ["standard_borg_disguise"]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/suit/cardborg/proc/disguise  (code/modules/clothing/suits/miscellaneous.dm:175)  may sleep
rt.def("/obj/item/clothing/suit/cardborg/proc/disguise", function* disguise(f: Frame, H: Value, borghead: Value) {
	let I: Value = null;
	f.vars = () => [H, borghead, I];
	if (!truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!truthy(live(borghead))) {
		borghead = rt.fv(f, "head", live(H));
	}
	if (!truthy((rt.istype(live(borghead), T("/obj/item/clothing/head/cardborg")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "override", (I = (yield* g.call(f, P("/proc/image"), null, ["icon", rt.rsc("icons/mob/robots.dmi"), "icon_state", "robot", "loc", live(H)], rt.Args.Named))), 1);
	yield* g.callName(f, live(I), "add_overlay", [(yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/robots.dmi"), "robot_e"]))]);
	yield* g.srcCall(f, "add_alt_appearance", T("/datum/atom_hud/alternate_appearance/basic/silicons"), "standard_borg_disguise", live(I));
	return f.dot;
}, true);

rt.type(7818, "/obj/item/clothing/suit/hooded/carp_costume", "/obj/item/clothing/suit/hooded", {
	name: "carp costume",
	desc: "A costume made from 'synthetic' carp scales, it smells.",
	icon_state: "carp_casual",
	item_state: "labcoat",
	body_parts_covered: 390,
	cold_protection: 390,
	min_cold_protection_temperature: 60,
	allowed: null,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/carp_hood"),
});

// /obj/item/clothing/suit/hooded/carp_costume/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:234)
rt.def("/obj/item/clothing/suit/hooded/carp_costume/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/weapon/gun/ballistic/automatic/speargun")));
	return f.dot;
});

rt.type(7813, "/obj/item/clothing/suit/hooded/ian_costume", "/obj/item/clothing/suit/hooded", {
	name: "corgi costume",
	desc: "A costume that looks like someone made a human-like corgi, it won't guarantee belly rubs.",
	icon_state: "ian",
	item_state: "labcoat",
	body_parts_covered: 390,
	allowed: null,
	dog_fashion: rt.typePath("/datum/dog_fashion/back"),
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/ian_hood"),
});

// /obj/item/clothing/suit/hooded/ian_costume/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:254)
rt.def("/obj/item/clothing/suit/hooded/ian_costume/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list());
	return f.dot;
});

rt.type(7820, "/obj/item/clothing/suit/hooded/bloated_human", "/obj/item/clothing/suit/hooded", {
	name: "bloated human suit",
	desc: "A horribly bloated suit made from human skins.",
	icon_state: "lingspacesuit",
	item_state: "labcoat",
	body_parts_covered: 390,
	allowed: null,
	actions_types: null,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/human_head"),
});

// /obj/item/clothing/suit/hooded/bloated_human/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:290)
rt.def("/obj/item/clothing/suit/hooded/bloated_human/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list());
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_human_head")));
	return f.dot;
});

rt.type(7898, "/obj/item/clothing/suit/jacket", "/obj/item/clothing/suit", {
	name: "bomber jacket",
	desc: "Aviators not included.",
	icon_state: "bomberjacket",
	item_state: "brownjsuit",
	allowed: null,
	body_parts_covered: 390,
	cold_protection: 390,
	min_cold_protection_temperature: 60,
});

// /obj/item/clothing/suit/jacket/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:348)
rt.def("/obj/item/clothing/suit/jacket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/toy"), T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/weapon/lighter"), T("/obj/item/device/radio")));
	return f.dot;
});

rt.type(7899, "/obj/item/clothing/suit/jacket/leather", "/obj/item/clothing/suit/jacket", {
	name: "leather jacket",
	desc: "Pompadour not included.",
	icon_state: "leatherjacket",
	item_state: "hostrench",
	resistance_flags: 0,
	max_heat_protection_temperature: 600,
	allowed: null,
});

// /obj/item/clothing/suit/jacket/leather/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:360)
rt.def("/obj/item/clothing/suit/jacket/leather/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/toy"), T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/weapon/lighter"), T("/obj/item/weapon/gun/ballistic/automatic/pistol"), T("/obj/item/weapon/gun/ballistic/revolver"), T("/obj/item/weapon/gun/ballistic/revolver/detective"), T("/obj/item/device/radio")));
	return f.dot;
});

rt.type(7901, "/obj/item/clothing/suit/jacket/puffer", "/obj/item/clothing/suit/jacket", {
	name: "puffer jacket",
	desc: "A thick jacket with a rubbery, water-resistant shell.",
	icon_state: "pufferjacket",
	item_state: "hostrench",
	armor: null,
});

// /obj/item/clothing/suit/jacket/puffer/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:374)
rt.def("/obj/item/clothing/suit/jacket/puffer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 50, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(7902, "/obj/item/clothing/suit/jacket/puffer/vest", "/obj/item/clothing/suit/jacket/puffer", {
	name: "puffer vest",
	desc: "A thick vest with a rubbery, water-resistant shell.",
	icon_state: "puffervest",
	item_state: "armor",
	body_parts_covered: 6,
	cold_protection: 6,
	armor: null,
});

// /obj/item/clothing/suit/jacket/puffer/vest/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:383)
rt.def("/obj/item/clothing/suit/jacket/puffer/vest/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 30, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(7903, "/obj/item/clothing/suit/jacket/miljacket", "/obj/item/clothing/suit/jacket", {
	name: "military jacket",
	desc: "A canvas jacket styled after classical American military garb. Feels sturdy, yet comfortable.",
	icon_state: "militaryjacket",
	item_state: "militaryjacket",
	allowed: null,
});

// /obj/item/clothing/suit/jacket/miljacket/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:390)
rt.def("/obj/item/clothing/suit/jacket/miljacket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/toy"), T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/weapon/lighter"), T("/obj/item/weapon/gun/ballistic/automatic/pistol"), T("/obj/item/weapon/gun/ballistic/revolver"), T("/obj/item/weapon/gun/ballistic/revolver/detective"), T("/obj/item/device/radio")));
	return f.dot;
});

rt.type(7908, "/obj/item/clothing/suit/xenos", "/obj/item/clothing/suit", {
	name: "xenos suit",
	desc: "A suit made out of chitinous alien hide.",
	icon_state: "xenos",
	item_state: "xenos_helm",
	body_parts_covered: 1950,
	flags_inv: 13,
	allowed: null,
});

// /obj/item/clothing/suit/xenos/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:423)
rt.def("/obj/item/clothing/suit/xenos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/clothing/mask/facehugger/toy")));
	return f.dot;
});

rt.type(7821, "/obj/item/clothing/suit/hooded/wintercoat", "/obj/item/clothing/suit/hooded", {
	name: "winter coat",
	desc: "A heavy jacket made from 'synthetic' animal furs.",
	icon_state: "coatwinter",
	item_state: "coatwinter",
	body_parts_covered: 390,
	cold_protection: 390,
	min_cold_protection_temperature: 60,
	armor: null,
	allowed: null,
});

// /obj/item/clothing/suit/hooded/wintercoat/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:436)
rt.def("/obj/item/clothing/suit/hooded/wintercoat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 10, "rad", 0, "fire", 0, "acid", 0]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/toy"), T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/weapon/lighter")));
	return f.dot;
});

rt.type(7822, "/obj/item/clothing/suit/hooded/wintercoat/captain", "/obj/item/clothing/suit/hooded/wintercoat", {
	name: "captain's winter coat",
	icon_state: "coatcaptain",
	item_state: "coatcaptain",
	armor: null,
	allowed: null,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/winterhood/captain"),
});

// /obj/item/clothing/suit/hooded/wintercoat/captain/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:452)
rt.def("/obj/item/clothing/suit/hooded/wintercoat/captain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 30, "laser", 30, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 0, "acid", 50]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/weapon/gun/ballistic"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/device/flashlight/seclite"), T("/obj/item/weapon/melee/classic_baton/telescopic")));
	return f.dot;
});

rt.type(7823, "/obj/item/clothing/suit/hooded/wintercoat/security", "/obj/item/clothing/suit/hooded/wintercoat", {
	name: "security winter coat",
	icon_state: "coatsecurity",
	item_state: "coatsecurity",
	armor: null,
	allowed: null,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/winterhood/security"),
});

// /obj/item/clothing/suit/hooded/wintercoat/security/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:463)
rt.def("/obj/item/clothing/suit/hooded/wintercoat/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 15, "laser", 30, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 0, "acid", 45]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/weapon/gun/ballistic"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/device/flashlight/seclite"), T("/obj/item/weapon/melee/classic_baton/telescopic")));
	return f.dot;
});

rt.type(7824, "/obj/item/clothing/suit/hooded/wintercoat/medical", "/obj/item/clothing/suit/hooded/wintercoat", {
	name: "medical winter coat",
	icon_state: "coatmedical",
	item_state: "coatmedical",
	allowed: null,
	armor: null,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/winterhood/medical"),
});

// /obj/item/clothing/suit/hooded/wintercoat/medical/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:474)
rt.def("/obj/item/clothing/suit/hooded/wintercoat/medical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/analyzer"), T("/obj/item/stack/medical"), T("/obj/item/weapon/dnainjector"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/reagent_containers/hypospray"), T("/obj/item/device/healthanalyzer"), T("/obj/item/device/flashlight/pen"), T("/obj/item/weapon/reagent_containers/glass/bottle"), T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/reagent_containers/pill"), T("/obj/item/weapon/storage/pill_bottle"), T("/obj/item/weapon/paper"), T("/obj/item/weapon/melee/classic_baton/telescopic")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 50, "rad", 0, "fire", 0, "acid", 45]));
	return f.dot;
});

rt.type(7825, "/obj/item/clothing/suit/hooded/wintercoat/science", "/obj/item/clothing/suit/hooded/wintercoat", {
	name: "science winter coat",
	icon_state: "coatscience",
	item_state: "coatscience",
	allowed: null,
	armor: null,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/winterhood/science"),
});

// /obj/item/clothing/suit/hooded/wintercoat/science/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:485)
rt.def("/obj/item/clothing/suit/hooded/wintercoat/science/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/analyzer"), T("/obj/item/stack/medical"), T("/obj/item/weapon/dnainjector"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/reagent_containers/hypospray"), T("/obj/item/device/healthanalyzer"), T("/obj/item/device/flashlight/pen"), T("/obj/item/weapon/reagent_containers/glass/bottle"), T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/reagent_containers/pill"), T("/obj/item/weapon/storage/pill_bottle"), T("/obj/item/weapon/paper"), T("/obj/item/weapon/melee/classic_baton/telescopic")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 10, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(7826, "/obj/item/clothing/suit/hooded/wintercoat/engineering", "/obj/item/clothing/suit/hooded/wintercoat", {
	name: "engineering winter coat",
	icon_state: "coatengineer",
	item_state: "coatengineer",
	armor: null,
	allowed: null,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/winterhood/engineering"),
});

// /obj/item/clothing/suit/hooded/wintercoat/engineering/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:496)
rt.def("/obj/item/clothing/suit/hooded/wintercoat/engineering/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 20, "fire", 30, "acid", 45]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/device/t_scanner"), T("/obj/item/weapon/construction/rcd"), T("/obj/item/weapon/pipe_dispenser")));
	return f.dot;
});

rt.type(7828, "/obj/item/clothing/suit/hooded/wintercoat/hydro", "/obj/item/clothing/suit/hooded/wintercoat", {
	name: "hydroponics winter coat",
	icon_state: "coathydro",
	item_state: "coathydro",
	allowed: null,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/winterhood/hydro"),
});

// /obj/item/clothing/suit/hooded/wintercoat/hydro/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:516)
rt.def("/obj/item/clothing/suit/hooded/wintercoat/hydro/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/reagent_containers/spray/plantbgone"), T("/obj/item/device/plant_analyzer"), T("/obj/item/seeds"), T("/obj/item/weapon/reagent_containers/glass/bottle"), T("/obj/item/weapon/cultivator"), T("/obj/item/weapon/reagent_containers/spray/pestspray"), T("/obj/item/weapon/hatchet"), T("/obj/item/weapon/storage/bag/plants")));
	return f.dot;
});

rt.type(7830, "/obj/item/clothing/suit/hooded/wintercoat/miner", "/obj/item/clothing/suit/hooded/wintercoat", {
	name: "mining winter coat",
	icon_state: "coatminer",
	item_state: "coatminer",
	allowed: null,
	armor: null,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/winterhood/miner"),
});

// /obj/item/clothing/suit/hooded/wintercoat/miner/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:535)
rt.def("/obj/item/clothing/suit/hooded/wintercoat/miner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/pickaxe"), T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/toy"), T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/weapon/lighter")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(7909, "/obj/item/clothing/suit/spookyghost", "/obj/item/clothing/suit", {
	name: "spooky ghost",
	desc: "this is obviously just a bedsheet, but maybe try it on?",
	icon_state: "bedsheet",
	user_vars_to_edit: null,
	alternate_worn_layer: 1,
});

// /obj/item/clothing/suit/spookyghost/proc/<init>  (code/modules/clothing/suits/miscellaneous.dm:546)
rt.def("/obj/item/clothing/suit/spookyghost/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "user_vars_to_edit", rt.alist(f, ["name", "Spooky Ghost", "real_name", "Spooky Ghost", "incorporeal_move", 1, "appearance_flags", 288, "alpha", 150]));
	return f.dot;
});
