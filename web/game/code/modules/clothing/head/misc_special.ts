// From code/modules/clothing/head/misc_special.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8173, "/obj/item/clothing/head/welding", "/obj/item/clothing/head", {
	name: "welding helmet",
	desc: "A head-mounted face cover designed to protect the wearer completely from space-arc eye.",
	icon_state: "welding",
	flags_cover: 20,
	item_state: "welding",
	materials: null,
	flash_protect: 2,
	tint: 2,
	armor: null,
	flags_inv: 240,
	actions_types: null,
	visor_flags_inv: 240,
	visor_flags_cover: 20,
	resistance_flags: 2,
});

// /obj/item/clothing/head/welding/proc/<init>  (code/modules/clothing/head/misc_special.dm:20)
rt.def("/obj/item/clothing/head/welding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1750, "$glass", 400]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 60]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle")));
	return f.dot;
});

// /obj/item/clothing/head/welding/proc/attack_self  (code/modules/clothing/head/misc_special.dm:32)  may sleep
rt.def("/obj/item/clothing/head/welding/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "weldingvisortoggle", live(user));
	return f.dot;
}, true);

rt.type(8108, "/obj/item/clothing/head/hardhat/cakehat", "/obj/item/clothing/head/hardhat", {
	brightness_on: 2,
	name: "cakehat",
	desc: "You put the cake on your head. Brilliant.",
	icon_state: "hardhat0_cakehat",
	item_state: "hardhat0_cakehat",
	item_color: "cakehat",
	hitsound: rt.rsc("sound/weapons/tap.ogg"),
	flags_inv: 288,
	armor: null,
	flags_cover: 4,
	heat: 1000,
});

// /obj/item/clothing/head/hardhat/cakehat/proc/<init>  (code/modules/clothing/head/misc_special.dm:46)
rt.def("/obj/item/clothing/head/hardhat/cakehat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

// /obj/item/clothing/head/hardhat/cakehat/proc/process  (code/modules/clothing/head/misc_special.dm:53)  may sleep
rt.def("/obj/item/clothing/head/hardhat/cakehat/proc/process", function* process(f: Frame) {
	let location: Value = null, M: Value = null;
	f.vars = () => [location, M];
	if (truthy((rt.istype((location = rt.fv(f, "loc", live(f.src))), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((truthy((yield* g.callName(f, (M = live(location)), "is_holding", [live(f.src)]))) || isEqual(rt.fv(f, "head", live(M)), live(f.src)))) {
			location = rt.fv(f, "loc", live(M));
		}
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(location)])))) return f.dot;
	yield* g.callName(f, live(location), "hotspot_expose", [700, 1]);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/clothing/head/hardhat/cakehat/proc/turn_on  (code/modules/clothing/head/misc_special.dm:62)
rt.def("/obj/item/clothing/head/hardhat/cakehat/proc/turn_on", function turn_on(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "force", 15);
	rt.setSv(f, "throwforce", 15);
	rt.setSv(f, "damtype", "fire");
	rt.setSv(f, "hitsound", rt.rsc("sound/items/welder.ogg"));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
});

// /obj/item/clothing/head/hardhat/cakehat/proc/turn_off  (code/modules/clothing/head/misc_special.dm:70)
rt.def("/obj/item/clothing/head/hardhat/cakehat/proc/turn_off", function turn_off(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "force", 0);
	rt.setSv(f, "throwforce", 0);
	rt.setSv(f, "damtype", "brute");
	rt.setSv(f, "hitsound", rt.rsc("sound/weapons/tap.ogg"));
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
});

// /obj/item/clothing/head/hardhat/cakehat/proc/is_hot  (code/modules/clothing/head/misc_special.dm:78)
rt.def("/obj/item/clothing/head/hardhat/cakehat/proc/is_hot", function is_hot(f: Frame) {
	return multiply(rt.sv(f, "on"), rt.sv(f, "heat"));
});

rt.type(8174, "/obj/item/clothing/head/ushanka", "/obj/item/clothing/head", {
	earflaps: 1,
	name: "ushanka",
	desc: "Perfect for winter in Siberia, da?",
	icon_state: "ushankadown",
	item_state: "ushankadown",
	flags_inv: 288,
	cold_protection: 1,
	min_cold_protection_temperature: 60,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/ushanka"),
});

// /obj/item/clothing/head/ushanka/proc/attack_self  (code/modules/clothing/head/misc_special.dm:96)
rt.def("/obj/item/clothing/head/ushanka/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "earflaps"))) {
		rt.setFv(f, "icon_state", live(f.src), "ushankaup");
		rt.setFv(f, "item_state", live(f.src), "ushankaup");
		rt.setSv(f, "earflaps", 0);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You raise the ear flaps on the ushanka.</span>"]);
	} else {
		rt.setFv(f, "icon_state", live(f.src), "ushankadown");
		rt.setFv(f, "item_state", live(f.src), "ushankadown");
		rt.setSv(f, "earflaps", 1);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You lower the ear flaps on the ushanka.</span>"]);
	}
	return f.dot;
});

rt.type(8109, "/obj/item/clothing/head/hardhat/pumpkinhead", "/obj/item/clothing/head/hardhat", {
	brightness_on: 2,
	name: "carved pumpkin",
	desc: "A jack o' lantern! Believed to ward off evil spirits.",
	icon_state: "hardhat0_pumpkin",
	item_state: "hardhat0_pumpkin",
	item_color: "pumpkin",
	flags_inv: 1008,
	armor: null,
	flags_cover: 4,
});

// /obj/item/clothing/head/hardhat/pumpkinhead/proc/<init>  (code/modules/clothing/head/misc_special.dm:116)
rt.def("/obj/item/clothing/head/hardhat/pumpkinhead/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(8175, "/obj/item/clothing/head/kitty", "/obj/item/clothing/head", {
	name: "kitty ears",
	desc: "A pair of kitty ears. Meow!",
	icon_state: "kitty",
	color: "#999999",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/kitty"),
});

// /obj/item/clothing/head/kitty/proc/equipped  (code/modules/clothing/head/misc_special.dm:132)  may sleep
rt.def("/obj/item/clothing/head/kitty/proc/equipped", function* equipped(f: Frame) {
	if ((truthy(live(f.args[0])) && isEqual(live(f.args[1]), 11))) {
		yield* g.srcCall(f, "update_icon", live(f.args[0]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/head/kitty/proc/update_icon  (code/modules/clothing/head/misc_special.dm:137)
rt.def("/obj/item/clothing/head/kitty/proc/update_icon", function update_icon(f: Frame, user: Value) {
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	rt.callSrc(f, "add_atom_colour", [fmt("#＀", [rt.fv(f, "hair_color", live(user))]), 4]);
	return f.dot;
});

rt.type(8110, "/obj/item/clothing/head/hardhat/reindeer", "/obj/item/clothing/head/hardhat", {
	brightness_on: 1,
	name: "novelty reindeer hat",
	desc: "Some fake antlers and a very fake red nose.",
	icon_state: "hardhat0_reindeer",
	item_state: "hardhat0_reindeer",
	item_color: "reindeer",
	flags_inv: 0,
	armor: null,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/reindeer"),
});

// /obj/item/clothing/head/hardhat/reindeer/proc/<init>  (code/modules/clothing/head/misc_special.dm:151)
rt.def("/obj/item/clothing/head/hardhat/reindeer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(8177, "/obj/item/clothing/head/cardborg", "/obj/item/clothing/head", {
	name: "cardborg helmet",
	desc: "A helmet made out of a box.",
	icon_state: "cardborg_h",
	item_state: "cardborg_h",
	flags_cover: 4,
	flags_inv: 1008,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/cardborg"),
});

// /obj/item/clothing/head/cardborg/proc/equipped  (code/modules/clothing/head/misc_special.dm:167)  may sleep
rt.def("/obj/item/clothing/head/cardborg/proc/equipped", function* equipped(f: Frame) {
	let H: Value = null, CB: Value = null;
	f.vars = () => [H, CB];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) && isEqual(live(f.args[1]), 11))) return f.dot;
	if (!truthy((rt.istype(rt.gv(f, "wear_suit", (H = live(f.args[0]))), T("/obj/item/clothing/suit/cardborg")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (CB = rt.fv(f, "wear_suit", live(H))), "disguise", [live(f.args[0]), live(f.src)]);
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/head/cardborg/proc/dropped  (code/modules/clothing/head/misc_special.dm:175)  may sleep
rt.def("/obj/item/clothing/head/cardborg/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, live(f.args[0]), "remove_alt_appearance", ["standard_borg_disguise"]);
	return f.dot;
}, true, { args: ["user"] });
