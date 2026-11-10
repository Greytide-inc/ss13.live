// Based on /tg/station's code/game/objects/items/religion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6995, "/obj/item/weapon/banner", "/obj/item/weapon", {
	moralecooldown: 0,
	moralewait: 600,
	name: "banner",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "banner",
	item_state: "banner",
	desc: "A banner with Nanotrasen's logo on it.",
});

// religion.dm:11
rt.def("/obj/item/weapon/banner/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let H: Value = null;
	if (this.moralecooldown + this.moralewait > rt.worldTime(f)) {
		return f.dot;
	}
	to_chat(user, "<span class='notice'>You increase the morale of your fellows!</span>");
	this.moralecooldown = rt.worldTime(f);
	for (H of each(range(4, rt.getStep(f, this, 0)), T("/mob/living/carbon/human"))) {
		to_chat(H, `<span class='notice'>Your morale is increased by ${user}'s banner!</span>`);
		yield* H.adjustBruteLoss(-15);
		yield* H.adjustFireLoss(-15);
		yield* H.AdjustStun(-40);
		yield* H.AdjustKnockdown(-40);
		yield* H.AdjustUnconscious(-40);
	}
	return f.dot;
}, true);

rt.type(7768, "/obj/item/clothing/suit/armor/plate/crusader", "/obj/item/clothing/suit/armor/plate", {
	name: "Crusader's Armour",
	desc: "Armour that's comprised of metal and cloth.",
	icon_state: "crusader",
	w_class: 4,
	slowdown: 2,
	body_parts_covered: 2046,
	armor: null,
});

// religion.dm:60
rt.def("/obj/item/clothing/suit/armor/plate/crusader/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 40, "bomb", 60, "bio", 0, "rad", 0, "fire", 60, "acid", 60]);
	return f.dot;
});

rt.type(7997, "/obj/item/clothing/head/helmet/plate/crusader", "/obj/item/clothing/head/helmet/plate", {
	name: "Crusader's Hood",
	desc: "A brownish hood.",
	icon_state: "crusader",
	w_class: 3,
	flags_inv: 416,
	armor: null,
});

// religion.dm:74
rt.def("/obj/item/clothing/head/helmet/plate/crusader/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 40, "bomb", 60, "bio", 0, "rad", 0, "fire", 60, "acid", 60]);
	return f.dot;
});

rt.type(8000, "/obj/item/clothing/head/helmet/plate/crusader/prophet", "/obj/item/clothing/head/helmet/plate/crusader", {
	flags: 0,
	name: "Prophet's Hat",
	desc: "A religious-looking hat.",
	alternate_worn_icon: rt.rsc("icons/mob/large-worn-icons/64x64/head.dmi"),
	armor: null,
	worn_x_dimension: 64,
	worn_y_dimension: 64,
});

// religion.dm:88
rt.def("/obj/item/clothing/head/helmet/plate/crusader/prophet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 60, "bullet", 60, "laser", 60, "energy", 50, "bomb", 70, "bio", 50, "rad", 50, "fire", 60, "acid", 60]);
	return f.dot;
});

rt.type(6998, "/obj/item/weapon/godstaff", "/obj/item/weapon", {
	conversion_color: "#ffffff",
	staffcooldown: 0,
	staffwait: 30,
	name: "godstaff",
	desc: "It's a stick..?",
	icon_state: "godstaff-red",
});

// religion.dm:109
rt.def("/obj/item/weapon/godstaff/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value, click_parameters: Value) {
	if (this.staffcooldown + this.staffwait > rt.worldTime(f)) {
		return f.dot;
	}
	user.visible_message(`${user} chants deeply and waves their staff!`);
	if (yield* do_after(user, 20, 1, this)) {
		target.add_atom_colour(this.conversion_color, WASHABLE_COLOUR_PRIORITY);
	}
	this.staffcooldown = rt.worldTime(f);
	return f.dot;
}, true);

rt.type(8483, "/obj/item/clothing/shoes/plate", "/obj/item/clothing/shoes", {
	flags: 1024,
	name: "Plate Boots",
	desc: "Metal boots, they look heavy.",
	icon_state: "crusader",
	w_class: 3,
	armor: null,
	cold_protection: 96,
	min_cold_protection_temperature: 2,
	heat_protection: 96,
	max_heat_protection_temperature: 1500,
});

// religion.dm:145
rt.def("/obj/item/clothing/shoes/plate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 40, "bomb", 60, "bio", 0, "rad", 0, "fire", 60, "acid", 60]);
	return f.dot;
});

rt.type(5336, "/obj/item/weapon/storage/box/itemset/crusader/blue", "/obj/item/weapon/storage/box/itemset/crusader", {});

// religion.dm:166
rt.def("/obj/item/weapon/storage/box/itemset/crusader/blue/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.contents = list();
	yield* sleep(1);
	yield* new_(T("/obj/item/clothing/suit/armor/plate/crusader/blue"), this);
	yield* new_(T("/obj/item/clothing/head/helmet/plate/crusader/blue"), this);
	yield* new_(T("/obj/item/clothing/gloves/plate/blue"), this);
	yield* new_(T("/obj/item/clothing/shoes/plate/blue"), this);
	return f.dot;
}, true);

rt.type(5337, "/obj/item/weapon/storage/box/itemset/crusader/red", "/obj/item/weapon/storage/box/itemset/crusader", {});

// religion.dm:176
rt.def("/obj/item/weapon/storage/box/itemset/crusader/red/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.contents = list();
	yield* sleep(1);
	yield* new_(T("/obj/item/clothing/suit/armor/plate/crusader/red"), this);
	yield* new_(T("/obj/item/clothing/head/helmet/plate/crusader/red"), this);
	yield* new_(T("/obj/item/clothing/gloves/plate/red"), this);
	yield* new_(T("/obj/item/clothing/shoes/plate/red"), this);
	return f.dot;
}, true);
