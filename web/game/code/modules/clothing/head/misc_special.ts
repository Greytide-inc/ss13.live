// Based on /tg/station's code/modules/clothing/head/misc_special.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// misc_special.dm:20
rt.def("/obj/item/clothing/head/welding/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 1750, "$glass", 400]);
	this.armor = rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 60]);

	this.actions_types = list(T("/datum/action/item_action/toggle"));
	return f.dot;
});

// misc_special.dm:32
rt.def("/obj/item/clothing/head/welding/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.weldingvisortoggle(user);
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

// misc_special.dm:46
rt.def("/obj/item/clothing/head/hardhat/cakehat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]);
	return f.dot;
});

// misc_special.dm:53
rt.def("/obj/item/clothing/head/hardhat/cakehat/proc/process", function* process(f: Frame) {
	let location: Value = null, M: Value = null;
	if (rt.istype((location = this.loc), T("/mob/living/carbon/human"))) {
		if ((M = location).is_holding(this) || M.head == this) {
			location = M.loc;
		}
	}
	if (!isturf(location)) return f.dot;
	yield* location.hotspot_expose(700, 1);
	return f.dot;
}, true, { waitfor: false });

// misc_special.dm:62
rt.def("/obj/item/clothing/head/hardhat/cakehat/proc/turn_on", function turn_on(f: Frame) {
	parent_proc();
	this.force = 15;
	this.throwforce = 15;
	this.damtype = "fire";
	this.hitsound = rt.rsc("sound/items/welder.ogg");
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
});

// misc_special.dm:70
rt.def("/obj/item/clothing/head/hardhat/cakehat/proc/turn_off", function turn_off(f: Frame) {
	parent_proc();
	this.force = 0;
	this.throwforce = 0;
	this.damtype = "brute";
	this.hitsound = rt.rsc("sound/weapons/tap.ogg");
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
});

// misc_special.dm:78
rt.def("/obj/item/clothing/head/hardhat/cakehat/proc/is_hot", function is_hot(f: Frame) {
	return this.on * this.heat;
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

// misc_special.dm:96
rt.def("/obj/item/clothing/head/ushanka/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (this.earflaps) {
		this.icon_state = "ushankaup";
		this.item_state = "ushankaup";
		this.earflaps = 0;
		to_chat(user, "<span class='notice'>You raise the ear flaps on the ushanka.</span>");
	} else {
		this.icon_state = "ushankadown";
		this.item_state = "ushankadown";
		this.earflaps = 1;
		to_chat(user, "<span class='notice'>You lower the ear flaps on the ushanka.</span>");
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

// misc_special.dm:116
rt.def("/obj/item/clothing/head/hardhat/pumpkinhead/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]);
	return f.dot;
});

rt.type(8175, "/obj/item/clothing/head/kitty", "/obj/item/clothing/head", {
	name: "kitty ears",
	desc: "A pair of kitty ears. Meow!",
	icon_state: "kitty",
	color: "#999999",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/kitty"),
});

// misc_special.dm:132
rt.def("/obj/item/clothing/head/kitty/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	if (user && slot == slot_head) {
		yield* this.update_icon(user);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// misc_special.dm:137
rt.def("/obj/item/clothing/head/kitty/proc/update_icon", function update_icon(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living/carbon/human"))) return f.dot;
	this.add_atom_colour(`#${user.hair_color}`, FIXED_COLOUR_PRIORITY);
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

// misc_special.dm:151
rt.def("/obj/item/clothing/head/hardhat/reindeer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]);
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

// misc_special.dm:167
rt.def("/obj/item/clothing/head/cardborg/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let H: Value = null, CB: Value = null;
	yield* parent_proc();
	if (!(rt.istype(user, T("/mob/living/carbon/human")) && slot == slot_head)) return f.dot;
	if (!rt.istype((H = user).wear_suit, T("/obj/item/clothing/suit/cardborg"))) return f.dot;
	yield* (CB = H.wear_suit).disguise(user, this);
	return f.dot;
}, true);

// misc_special.dm:175
rt.def("/obj/item/clothing/head/cardborg/proc/dropped", function* dropped(f: Frame, user: Value) {
	yield* parent_proc();
	yield* user.remove_alt_appearance("standard_borg_disguise");
	return f.dot;
}, true);
