// Based on /tg/station's code/modules/clothing/suits/cloaks.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8618, "/obj/item/clothing/neck/cloak", "/obj/item/clothing/neck", {
	name: "brown cloak",
	desc: "It's a cape that can be worn around your neck.",
	icon: rt.rsc("icons/obj/clothing/cloaks.dmi"),
	icon_state: "qmcloak",
	item_state: "qmcloak",
	w_class: 2,
	body_parts_covered: 414,
});

// cloaks.dm:22
rt.def("/obj/item/clothing/neck/cloak/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is strangling ${user.p_them()}self with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 8;
});

rt.type(7815, "/obj/item/clothing/suit/hooded/cloak/goliath", "/obj/item/clothing/suit/hooded/cloak", {
	name: "goliath cloak",
	icon_state: "goliath_cloak",
	desc: "A staunch, practical cape made out of numerous monster materials, it is coveted amongst exiles & hermits.",
	allowed: null,
	armor: null,
	body_parts_covered: 390,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/cloakhood/goliath"),
});

// cloaks.dm:63
rt.def("/obj/item/clothing/suit/hooded/cloak/goliath/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/pickaxe"), T("/obj/item/weapon/twohanded/spear"), T("/obj/item/weapon/twohanded/bonespear"), T("/obj/item/organ/regenerative_core/legion"), T("/obj/item/weapon/kitchen/knife/combat/bone"), T("/obj/item/weapon/kitchen/knife/combat/survival"));
	this.armor = rt.alist(f, ["melee", 35, "bullet", 10, "laser", 25, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 60, "acid", 60]);
	return f.dot;
});

rt.type(8033, "/obj/item/clothing/head/hooded/cloakhood/goliath", "/obj/item/clothing/head/hooded/cloakhood", {
	name: "goliath cloak hood",
	icon_state: "golhood",
	desc: "A protective & concealing hood.",
	armor: null,
	flags_inv: 864,
});

// cloaks.dm:72
rt.def("/obj/item/clothing/head/hooded/cloakhood/goliath/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 35, "bullet", 10, "laser", 25, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 60, "acid", 60]);
	return f.dot;
});

rt.type(7816, "/obj/item/clothing/suit/hooded/cloak/drake", "/obj/item/clothing/suit/hooded/cloak", {
	name: "drake armour",
	icon_state: "dragon",
	desc: "A suit of armour fashioned from the remains of an ash drake. ",
	allowed: null,
	armor: null,
	heat_protection: 2046,
	body_parts_covered: 2046,
	max_heat_protection_temperature: 35000,
	resistance_flags: 34,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/cloakhood/drake"),
});

// cloaks.dm:79
rt.def("/obj/item/clothing/suit/hooded/cloak/drake/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/resonator"), T("/obj/item/device/mining_scanner"), T("/obj/item/device/t_scanner/adv_mining_scanner"), T("/obj/item/weapon/gun/energy/kinetic_accelerator"), T("/obj/item/weapon/pickaxe"), T("/obj/item/weapon/twohanded/spear"));
	this.armor = rt.alist(f, ["melee", 70, "bullet", 30, "laser", 50, "energy", 40, "bomb", 70, "bio", 60, "rad", 50, "fire", 100, "acid", 100]);
	return f.dot;
});

rt.type(8034, "/obj/item/clothing/head/hooded/cloakhood/drake", "/obj/item/clothing/head/hooded/cloakhood", {
	name: "drake helm",
	icon_state: "dragon",
	desc: "The skull of a dragon.",
	armor: null,
	heat_protection: 1,
	max_heat_protection_temperature: 35000,
	resistance_flags: 34,
});

// cloaks.dm:91
rt.def("/obj/item/clothing/head/hooded/cloakhood/drake/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 70, "bullet", 30, "laser", 50, "energy", 40, "bomb", 70, "bio", 60, "rad", 50, "fire", 100, "acid", 100]);
	return f.dot;
});
