// Based on /tg/station's code/modules/mining/equipment/explorer_gear.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7831, "/obj/item/clothing/suit/hooded/explorer", "/obj/item/clothing/suit/hooded", {
	name: "explorer suit",
	desc: "An armoured suit for exploring harsh environments.",
	icon_state: "explorer",
	item_state: "explorer",
	body_parts_covered: 414,
	min_cold_protection_temperature: 60,
	cold_protection: 414,
	max_heat_protection_temperature: 30000,
	heat_protection: 414,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/explorer"),
	armor: null,
	allowed: null,
	resistance_flags: 2,
});

// explorer_gear.dm:13
rt.def("/obj/item/clothing/suit/hooded/explorer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 20, "laser", 20, "energy", 20, "bomb", 50, "bio", 100, "rad", 50, "fire", 50, "acid", 50]);

	this.allowed = list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/resonator"), T("/obj/item/device/mining_scanner"), T("/obj/item/device/t_scanner/adv_mining_scanner"), T("/obj/item/weapon/gun/energy/kinetic_accelerator"), T("/obj/item/weapon/pickaxe"));
	return f.dot;
});

rt.type(8050, "/obj/item/clothing/head/hooded/explorer", "/obj/item/clothing/head/hooded", {
	name: "explorer hood",
	desc: "An armoured hood for exploring harsh environments.",
	icon_state: "explorer",
	body_parts_covered: 1,
	flags_inv: 416,
	min_cold_protection_temperature: 60,
	max_heat_protection_temperature: 30000,
	armor: null,
	resistance_flags: 2,
});

// explorer_gear.dm:25
rt.def("/obj/item/clothing/head/hooded/explorer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 20, "laser", 20, "energy", 20, "bomb", 50, "bio", 100, "rad", 50, "fire", 50, "acid", 50]);
	return f.dot;
});

rt.type(8561, "/obj/item/clothing/mask/gas/explorer", "/obj/item/clothing/mask/gas", {
	name: "explorer gas mask",
	desc: "A military-grade gas mask that can be connected to an air supply.",
	icon_state: "gas_mining",
	visor_flags: 4104,
	visor_flags_inv: 512,
	visor_flags_cover: 8,
	actions_types: null,
	armor: null,
	resistance_flags: 2,
});

// explorer_gear.dm:35
rt.def("/obj/item/clothing/mask/gas/explorer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/adjust"));
	this.armor = rt.alist(f, ["melee", 10, "bullet", 5, "laser", 5, "energy", 5, "bomb", 0, "bio", 50, "rad", 0, "fire", 20, "acid", 40]);
	return f.dot;
});

// explorer_gear.dm:40
rt.def("/obj/item/clothing/mask/gas/explorer/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.adjustmask(user);
	return f.dot;
}, true);

// explorer_gear.dm:43
rt.def("/obj/item/clothing/mask/gas/explorer/proc/adjustmask", function* adjustmask(f: Frame, user: Value) {
	yield* parent_proc();
	this.w_class = this.mask_adjusted ? WEIGHT_CLASS_NORMAL : WEIGHT_CLASS_SMALL;
	return f.dot;
}, true);

rt.type(8562, "/obj/item/clothing/mask/gas/explorer/folded", "/obj/item/clothing/mask/gas/explorer", {});

// explorer_gear.dm:47
rt.def("/obj/item/clothing/mask/gas/explorer/folded/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.adjustmask();
	return f.dot;
}, true);
