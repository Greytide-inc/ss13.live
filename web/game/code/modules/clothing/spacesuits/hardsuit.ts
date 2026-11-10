// Based on /tg/station's code/modules/clothing/spacesuits/hardsuit.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7935, "/obj/item/clothing/head/helmet/space/hardsuit", "/obj/item/clothing/head/helmet/space", {
	basestate: "hardsuit",
	brightness_on: 4,
	on: 0,
	suit: null,
	name: "hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low-pressure environment. Has radiation shielding.",
	icon_state: "hardsuit0-engineering",
	item_state: "eng_helm",
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
	item_color: "engineering",
	actions_types: null,
});

// hardsuit.dm:9
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 10, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 75, "fire", 50, "acid", 75]);

	this.actions_types = list(T("/datum/action/item_action/toggle_helmet_light"));
	return f.dot;
});

// hardsuit.dm:19
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	this.on = (!this.on ? 1 : 0);
	this.icon_state = `${this.basestate}${this.on}-${this.item_color}`;
	yield* user.update_inv_head();
	if (this.on) {
		this.set_light(this.brightness_on);
	} else {
		this.set_light(0);
	}
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);

// hardsuit.dm:32
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/dropped", function* dropped(f: Frame, user: Value) {
	yield* parent_proc();
	if (!this.suit) return f.dot;
	yield* this.suit.RemoveHelmet();
	return f.dot;
}, true);

// hardsuit.dm:37
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value) {
	if (slot != slot_head) return f.dot;
	return 1;
});

// hardsuit.dm:41
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	yield* parent_proc();
	if (slot == slot_head) return f.dot;
	if (this.suit) {
		yield* this.suit.RemoveHelmet();
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true);

// hardsuit.dm:49
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/display_visor_message", function display_visor_message(f: Frame, msg: Value) {
	let wearer: Value = this.loc;
	if (!(msg && rt.istype(wearer, T("/mob/living/carbon/human")))) return f.dot;
	wearer.show_message(`${bicon(this)}<b><span class='robot'>${msg}</span></b>`, 1);
	return f.dot;
});

// hardsuit.dm:54
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/rad_act", function rad_act(f: Frame, severity: Value) {
	parent_proc();
	this.display_visor_message(`Radiation pulse detected! Magnitude: <span class='green'>${severity}</span> RADs.`);
	return f.dot;
}, false);

// hardsuit.dm:58
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* parent_proc();
	this.display_visor_message(`${severity > 1 ? "Light" : "Strong"} electromagnetic pulse detected!`);
	return f.dot;
}, true);

rt.type(7702, "/obj/item/clothing/suit/space/hardsuit", "/obj/item/clothing/suit/space", {
	helmet: null,
	jetpack: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit"),
	name: "hardsuit",
	desc: "A special suit that protects against hazardous, low pressure environments. Has radiation shielding.",
	icon_state: "hardsuit-engineering",
	item_state: "eng_hardsuit",
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
	allowed: null,
	siemens_coefficient: 0,
	actions_types: null,
});

// hardsuit.dm:69
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 10, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 75, "fire", 50, "acid", 75]);

	this.allowed = list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/device/t_scanner"), T("/obj/item/weapon/construction/rcd"), T("/obj/item/weapon/pipe_dispenser"));

	this.actions_types = list(T("/datum/action/item_action/toggle_helmet"));
	return f.dot;
});

// hardsuit.dm:79
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/New", function* New(f: Frame) {
	if (this.jetpack && ispath(this.jetpack)) {
		this.jetpack = (yield* new_(this.jetpack, this));
	}
	yield* parent_proc();
	return f.dot;
}, true);

// hardsuit.dm:84
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	user.changeNext_move(8);
	yield* parent_proc();
	return f.dot;
}, true);

// hardsuit.dm:88
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/tank/jetpack/suit"))) {
		if (this.jetpack) {
			to_chat(user, `<span class='warning'>${this} already has a jetpack installed.</span>`);
			return f.dot;
		}
		if (this == user.get_item_by_slot(slot_wear_suit)) {
			to_chat(user, `<span class='warning'>You cannot install the upgrade to ${this} while wearing it.</span>`);
			return f.dot;
		}
		if (yield* user.transferItemToLoc(I, this)) {
			this.jetpack = I;
			to_chat(user, `<span class='notice'>You successfully install the jetpack into ${this}.</span>`);
		}
	} else {
		if (!rt.istype(I, T("/obj/item/weapon/screwdriver"))) return f.dot;
		if (!this.jetpack) {
			to_chat(user, `<span class='warning'>${this} has no jetpack installed.</span>`);
			return f.dot;
		}
		if (this == user.get_item_by_slot(slot_wear_suit)) {
			to_chat(user, `<span class='warning'>You cannot remove the jetpack from ${this} while wearing it.</span>`);
			return f.dot;
		}
		yield* this.jetpack.turn_off();
		this.jetpack.loc = rt.getStep(f, this, 0);
		this.jetpack = null;
		to_chat(user, `<span class='notice'>You successfully remove the jetpack from ${this}.</span>`);
	}
	return f.dot;
}, true);

// hardsuit.dm:115
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let X: Value = null, A: Value = null;
	yield* parent_proc();
	if (!this.jetpack) return f.dot;
	if (slot != slot_wear_suit) return f.dot;
	for (X of each(this.jetpack.actions)) {
		yield* (A = X).Grant(user);
	}
	return f.dot;
}, true);

// hardsuit.dm:123
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/dropped", function* dropped(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	yield* parent_proc();
	if (!this.jetpack) return f.dot;
	for (X of each(this.jetpack.actions)) {
		yield* (A = X).Remove(user);
	}
	return f.dot;
}, true);

// hardsuit.dm:130
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value) {
	if (slot != slot_wear_suit) return f.dot;
	return 1;
});

rt.type(7938, "/obj/item/clothing/head/helmet/space/hardsuit/engine", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "engineering hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low-pressure environment. Has radiation shielding.",
	icon_state: "hardsuit0-engineering",
	item_state: "eng_helm",
	armor: null,
	item_color: "engineering",
	resistance_flags: 2,
});

// hardsuit.dm:139
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/engine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 75, "fire", 100, "acid", 75]);
	return f.dot;
});

rt.type(7706, "/obj/item/clothing/suit/space/hardsuit/engine", "/obj/item/clothing/suit/space/hardsuit", {
	name: "engineering hardsuit",
	desc: "A special suit that protects against hazardous, low pressure environments. Has radiation shielding.",
	icon_state: "hardsuit-engineering",
	item_state: "eng_hardsuit",
	armor: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/engine"),
	resistance_flags: 2,
});

// hardsuit.dm:148
rt.def("/obj/item/clothing/suit/space/hardsuit/engine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 75, "fire", 100, "acid", 75]);
	return f.dot;
});

rt.type(7939, "/obj/item/clothing/head/helmet/space/hardsuit/engine/atmos", "/obj/item/clothing/head/helmet/space/hardsuit/engine", {
	name: "atmospherics hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low-pressure environment. Has thermal shielding.",
	icon_state: "hardsuit0-atmospherics",
	item_state: "atmo_helm",
	item_color: "atmospherics",
	armor: null,
	heat_protection: 1,
	max_heat_protection_temperature: 35000,
});

// hardsuit.dm:159
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/engine/atmos/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 0, "fire", 100, "acid", 75]);
	return f.dot;
});

rt.type(7707, "/obj/item/clothing/suit/space/hardsuit/engine/atmos", "/obj/item/clothing/suit/space/hardsuit/engine", {
	name: "atmospherics hardsuit",
	desc: "A special suit that protects against hazardous, low pressure environments. Has thermal shielding.",
	icon_state: "hardsuit-atmospherics",
	item_state: "atmo_hardsuit",
	armor: null,
	heat_protection: 2046,
	max_heat_protection_temperature: 35000,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/engine/atmos"),
});

// hardsuit.dm:168
rt.def("/obj/item/clothing/suit/space/hardsuit/engine/atmos/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 0, "fire", 100, "acid", 75]);
	return f.dot;
});

rt.type(7940, "/obj/item/clothing/head/helmet/space/hardsuit/engine/elite", "/obj/item/clothing/head/helmet/space/hardsuit/engine", {
	name: "advanced hardsuit helmet",
	desc: "An advanced helmet designed for work in a hazardous, low pressure environment. Shines with a high polish.",
	icon_state: "hardsuit0-white",
	item_state: "ce_helm",
	item_color: "white",
	armor: null,
	heat_protection: 1,
	max_heat_protection_temperature: 35000,
});

// hardsuit.dm:181
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/engine/elite/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 5, "laser", 10, "energy", 5, "bomb", 50, "bio", 100, "rad", 90, "fire", 100, "acid", 90]);
	return f.dot;
});

rt.type(7708, "/obj/item/clothing/suit/space/hardsuit/engine/elite", "/obj/item/clothing/suit/space/hardsuit/engine", {
	jetpack: rt.typePath("/obj/item/weapon/tank/jetpack/suit"),
	icon_state: "hardsuit-white",
	name: "advanced hardsuit",
	desc: "An advanced suit that protects against hazardous, low pressure environments. Shines with a high polish.",
	item_state: "ce_hardsuit",
	armor: null,
	heat_protection: 2046,
	max_heat_protection_temperature: 35000,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/engine/elite"),
});

// hardsuit.dm:190
rt.def("/obj/item/clothing/suit/space/hardsuit/engine/elite/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 5, "laser", 10, "energy", 5, "bomb", 50, "bio", 100, "rad", 90, "fire", 100, "acid", 90]);
	return f.dot;
});

rt.type(7941, "/obj/item/clothing/head/helmet/space/hardsuit/mining", "/obj/item/clothing/head/helmet/space/hardsuit", {
	brightness_on: 7,
	name: "mining hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low pressure environment. Has reinforced plating for wildlife encounters and dual floodlights.",
	icon_state: "hardsuit0-mining",
	item_state: "mining_helm",
	item_color: "mining",
	max_heat_protection_temperature: 30000,
	resistance_flags: 2,
	heat_protection: 414,
	armor: null,
	allowed: null,
});

// hardsuit.dm:206
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/mining/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 50, "bio", 100, "rad", 50, "fire", 50, "acid", 75]);

	this.allowed = list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/resonator"), T("/obj/item/device/mining_scanner"), T("/obj/item/device/t_scanner/adv_mining_scanner"), T("/obj/item/weapon/gun/energy/kinetic_accelerator"));
	return f.dot;
});

rt.type(7709, "/obj/item/clothing/suit/space/hardsuit/mining", "/obj/item/clothing/suit/space/hardsuit", {
	icon_state: "hardsuit-mining",
	name: "mining hardsuit",
	desc: "A special suit that protects against hazardous, low pressure environments. Has reinforced plating for wildlife encounters.",
	item_state: "mining_hardsuit",
	max_heat_protection_temperature: 30000,
	resistance_flags: 2,
	armor: null,
	allowed: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/mining"),
});

// hardsuit.dm:218
rt.def("/obj/item/clothing/suit/space/hardsuit/mining/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 50, "bio", 100, "rad", 50, "fire", 50, "acid", 75]);

	this.allowed = list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/storage/bag/ore"), T("/obj/item/weapon/pickaxe"));
	return f.dot;
});

rt.type(7942, "/obj/item/clothing/head/helmet/space/hardsuit/syndi", "/obj/item/clothing/head/helmet/space/hardsuit", {
	linkedsuit: null,
	on: 1,
	name: "blood-red hardsuit helmet",
	desc: "A dual-mode advanced helmet designed for work in special operations. It is in EVA mode. Property of Gorlex Marauders.",
	alt_desc: "A dual-mode advanced helmet designed for work in special operations. It is in combat mode. Property of Gorlex Marauders.",
	icon_state: "hardsuit1-syndi",
	item_state: "syndie_helm",
	item_color: "syndi",
	armor: null,
	actions_types: null,
	visor_flags_inv: 720,
	visor_flags: 1,
});

// hardsuit.dm:230
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 50, "laser", 30, "energy", 15, "bomb", 35, "bio", 100, "rad", 50, "fire", 50, "acid", 90]);

	this.actions_types = list(T("/datum/action/item_action/toggle_helmet_mode"));
	return f.dot;
});

// hardsuit.dm:238
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `hardsuit${this.on}-${this.item_color}`;
	return f.dot;
});

// hardsuit.dm:241
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (!rt.istype(this.loc, T("/obj/item/clothing/suit/space/hardsuit/syndi"))) return f.dot;
	this.linkedsuit = this.loc;
	return f.dot;
}, true);

// hardsuit.dm:246
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let C: Value = null, X: Value = null, A: Value = null;
	if (!isturf(user.loc)) {
		to_chat(user, `<span class='warning'>You cannot toggle your helmet while in this ${user.loc}!</span>`);
		return f.dot;
	}
	this.on = (!this.on ? HEAD : 0);
	if (this.on || this.force) {
		to_chat(user, "<span class='notice'>You switch your hardsuit to EVA mode, sacrificing speed for space protection.</span>");
		this.name = rt.initial(f, this, "name");
		this.desc = rt.initial(f, this, "desc");
		this.set_light(this.brightness_on);
		(rt.modSrcVar(f, "flags", this.visor_flags, rt.bitOr));
		(rt.modSrcVar(f, "flags_cover", 20, rt.bitOr));
		(rt.modSrcVar(f, "flags_inv", this.visor_flags_inv, rt.bitOr));
		(rt.modSrcVar(f, "cold_protection", HEAD, rt.bitOr));
	} else {
		to_chat(user, "<span class='notice'>You switch your hardsuit to combat mode and can now run at full speed.</span>");
		this.name += " (combat)";
		this.desc = this.alt_desc;
		this.set_light(0);
		(rt.modSrcVar(f, "flags", rt.op(f, "BitNot", [], [this.visor_flags]), rt.bitAnd));
		(rt.modSrcVar(f, "flags_cover", 16777195, rt.bitAnd));
		(rt.modSrcVar(f, "flags_inv", rt.op(f, "BitNot", [], [this.visor_flags_inv]), rt.bitAnd));
		(rt.modSrcVar(f, "cold_protection", 16777214, rt.bitAnd));
	}
	yield* this.update_icon();
	playsound(this.loc, rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1);
	yield* this.toggle_hardsuit_mode(user);
	yield* user.update_inv_head();
	if (rt.istype(user, T("/mob/living/carbon"))) {
		yield* (C = user).head_update(this, { forced: 1 });
	}
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);

// hardsuit.dm:282
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/toggle_hardsuit_mode", function* toggle_hardsuit_mode(f: Frame, user: Value) {
	if (!this.linkedsuit) return f.dot;
	if (this.on) {
		this.linkedsuit.name = rt.initial(f, this.linkedsuit, "name");
		this.linkedsuit.desc = rt.initial(f, this.linkedsuit, "desc");
		this.linkedsuit.slowdown = 1;
		(rt.modField(f, this.linkedsuit, "flags", STOPSPRESSUREDMAGE, rt.bitOr));
		(rt.modField(f, this.linkedsuit, "cold_protection", 2046, rt.bitOr));
	} else {
		this.linkedsuit.name += " (combat)";
		this.linkedsuit.desc = this.linkedsuit.alt_desc;
		this.linkedsuit.slowdown = 0;
		(rt.modField(f, this.linkedsuit, "flags", 16777214, rt.bitAnd));
		(rt.modField(f, this.linkedsuit, "cold_protection", 16775169, rt.bitAnd));
	}
	this.linkedsuit.icon_state = `hardsuit${this.on}-${this.item_color}`;
	yield* this.linkedsuit.update_icon();
	yield* user.update_inv_wear_suit();
	yield* user.update_inv_w_uniform();
	return f.dot;
}, true);

rt.type(7710, "/obj/item/clothing/suit/space/hardsuit/syndi", "/obj/item/clothing/suit/space/hardsuit", {
	jetpack: rt.typePath("/obj/item/weapon/tank/jetpack/suit"),
	name: "blood-red hardsuit",
	desc: "A dual-mode advanced hardsuit designed for work in special operations. It is in EVA mode. Property of Gorlex Marauders.",
	alt_desc: "A dual-mode advanced hardsuit designed for work in special operations. It is in combat mode. Property of Gorlex Marauders.",
	icon_state: "hardsuit1-syndi",
	item_state: "syndie_hardsuit",
	item_color: "syndi",
	w_class: 3,
	armor: null,
	allowed: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/syndi"),
});

// hardsuit.dm:308
rt.def("/obj/item/clothing/suit/space/hardsuit/syndi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 50, "laser", 30, "energy", 15, "bomb", 35, "bio", 100, "rad", 50, "fire", 50, "acid", 90]);

	this.allowed = list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/melee/energy/sword/saber"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals"));
	return f.dot;
});

rt.type(7943, "/obj/item/clothing/head/helmet/space/hardsuit/syndi/elite", "/obj/item/clothing/head/helmet/space/hardsuit/syndi", {
	on: 0,
	name: "elite syndicate hardsuit helmet",
	desc: "An elite version of the syndicate helmet, with improved armour and fireproofing. It is in EVA mode. Property of Gorlex Marauders.",
	alt_desc: "An elite version of the syndicate helmet, with improved armour and fireproofing. It is in combat mode. Property of Gorlex Marauders.",
	icon_state: "hardsuit0-syndielite",
	item_color: "syndielite",
	armor: null,
	heat_protection: 1,
	max_heat_protection_temperature: 35000,
	visor_flags_inv: 0,
	visor_flags: 0,
	resistance_flags: 34,
});

// hardsuit.dm:320
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/syndi/elite/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 60, "bullet", 60, "laser", 50, "energy", 25, "bomb", 55, "bio", 100, "rad", 70, "fire", 100, "acid", 100]);
	return f.dot;
});

rt.type(7711, "/obj/item/clothing/suit/space/hardsuit/syndi/elite", "/obj/item/clothing/suit/space/hardsuit/syndi", {
	name: "elite syndicate hardsuit",
	desc: "An elite version of the syndicate hardsuit, with improved armour and fireproofing. It is in travel mode.",
	alt_desc: "An elite version of the syndicate hardsuit, with improved armour and fireproofing. It is in combat mode.",
	icon_state: "hardsuit0-syndielite",
	item_color: "syndielite",
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/syndi/elite"),
	armor: null,
	heat_protection: 2046,
	max_heat_protection_temperature: 35000,
	resistance_flags: 34,
});

// hardsuit.dm:336
rt.def("/obj/item/clothing/suit/space/hardsuit/syndi/elite/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 60, "bullet", 60, "laser", 50, "energy", 25, "bomb", 55, "bio", 100, "rad", 70, "fire", 100, "acid", 100]);
	return f.dot;
});

rt.type(7945, "/obj/item/clothing/head/helmet/space/hardsuit/wizard", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "gem-encrusted hardsuit helmet",
	desc: "A bizarre gem-encrusted helmet that radiates magical energies.",
	icon_state: "hardsuit0-wiz",
	item_state: "wiz_helm",
	item_color: "wiz",
	resistance_flags: 34,
	armor: null,
	heat_protection: 1,
	max_heat_protection_temperature: 35000,
});

// hardsuit.dm:371
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/wizard/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 40, "laser", 40, "energy", 20, "bomb", 35, "bio", 100, "rad", 50, "fire", 100, "acid", 100]);
	return f.dot;
});

rt.type(7713, "/obj/item/clothing/suit/space/hardsuit/wizard", "/obj/item/clothing/suit/space/hardsuit", {
	icon_state: "hardsuit-wiz",
	name: "gem-encrusted hardsuit",
	desc: "A bizarre gem-encrusted suit that radiates magical energies.",
	item_state: "wiz_hardsuit",
	w_class: 3,
	resistance_flags: 34,
	armor: null,
	allowed: null,
	heat_protection: 2046,
	max_heat_protection_temperature: 35000,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/wizard"),
});

// hardsuit.dm:382
rt.def("/obj/item/clothing/suit/space/hardsuit/wizard/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 40, "laser", 40, "energy", 20, "bomb", 35, "bio", 100, "rad", 50, "fire", 100, "acid", 100]);

	this.allowed = list(T("/obj/item/weapon/teleportation_scroll"), T("/obj/item/weapon/tank/internals"));
	return f.dot;
});

rt.type(7946, "/obj/item/clothing/head/helmet/space/hardsuit/medical", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "medical hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low pressure environment. Built with lightweight materials for extra comfort, but does not protect the eyes from intense light.",
	icon_state: "hardsuit0-medical",
	item_state: "medical_helm",
	item_color: "medical",
	flash_protect: 0,
	armor: null,
	scan_reagents: 1,
});

// hardsuit.dm:397
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/medical/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 50, "fire", 75, "acid", 75]);
	return f.dot;
});

rt.type(7714, "/obj/item/clothing/suit/space/hardsuit/medical", "/obj/item/clothing/suit/space/hardsuit", {
	icon_state: "hardsuit-medical",
	name: "medical hardsuit",
	desc: "A special suit that protects against hazardous, low pressure environments. Built with lightweight materials for easier movement.",
	item_state: "medical_hardsuit",
	allowed: null,
	armor: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/medical"),
});

// hardsuit.dm:405
rt.def("/obj/item/clothing/suit/space/hardsuit/medical/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/storage/firstaid"), T("/obj/item/device/healthanalyzer"), T("/obj/item/stack/medical"));
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 50, "fire", 75, "acid", 75]);
	return f.dot;
});

rt.type(7947, "/obj/item/clothing/head/helmet/space/hardsuit/rd", "/obj/item/clothing/head/helmet/space/hardsuit", {
	onboard_hud_enabled: 0,
	bomb_radar: null,
	name: "prototype hardsuit helmet",
	desc: "A prototype helmet designed for research in a hazardous, low pressure environment. Scientific data flashes across the visor.",
	icon_state: "hardsuit0-rd",
	item_color: "rd",
	resistance_flags: 34,
	max_heat_protection_temperature: 30000,
	armor: null,
	scan_reagents: 1,
	actions_types: null,
});

// hardsuit.dm:418
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/rd/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 100, "bio", 100, "rad", 60, "fire", 60, "acid", 80]);

	this.actions_types = list(T("/datum/action/item_action/toggle_helmet_light"), T("/datum/action/item_action/toggle_research_scanner"));
	return f.dot;
});

// hardsuit.dm:424
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/rd/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.bomb_radar = (yield* new_(T("/obj/machinery/doppler_array/integrated"), this));
	return f.dot;
}, true);

// hardsuit.dm:428
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/rd/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let DHUD: Value = null;
	yield* parent_proc();
	if (user.glasses && rt.istype(user.glasses, T("/obj/item/clothing/glasses/hud/diagnostic"))) {
		to_chat(user, `<span class='warning'>Your ${user.glasses} prevents you using ${this}'s diagnostic visor HUD.</span>`);
	} else {
		this.onboard_hud_enabled = 1;
		(DHUD = rt.index(GLOB.huds, DATA_HUD_DIAGNOSTIC)).add_hud_to(user);
	}
	return f.dot;
}, true);

// hardsuit.dm:437
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/rd/proc/dropped", function* dropped(f: Frame, user: Value) {
	let DHUD: Value = null;
	yield* parent_proc();
	if (!(this.onboard_hud_enabled && !(user.glasses && rt.istype(user.glasses, T("/obj/item/clothing/glasses/hud/diagnostic"))))) return f.dot;
	(DHUD = rt.index(GLOB.huds, DATA_HUD_DIAGNOSTIC)).remove_hud_from(user);
	return f.dot;
}, true);

rt.type(7715, "/obj/item/clothing/suit/space/hardsuit/rd", "/obj/item/clothing/suit/space/hardsuit", {
	icon_state: "hardsuit-rd",
	name: "prototype hardsuit",
	desc: "A prototype suit that protects against hazardous, low pressure environments. Fitted with extensive plating for handling explosives and dangerous research materials.",
	item_state: "hardsuit-rd",
	resistance_flags: 34,
	max_heat_protection_temperature: 30000,
	allowed: null,
	armor: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/rd"),
});

// hardsuit.dm:449
rt.def("/obj/item/clothing/suit/space/hardsuit/rd/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/gun/energy/wormhole_projector"), T("/obj/item/weapon/hand_tele"), T("/obj/item/device/aicard"));
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 100, "bio", 100, "rad", 60, "fire", 60, "acid", 80]);
	return f.dot;
});

rt.type(7948, "/obj/item/clothing/head/helmet/space/hardsuit/security", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "security hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low pressure environment. Has an additional layer of armor.",
	icon_state: "hardsuit0-sec",
	item_state: "sec_helm",
	item_color: "sec",
	armor: null,
});

// hardsuit.dm:463
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/security/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 15, "laser", 30, "energy", 10, "bomb", 10, "bio", 100, "rad", 50, "fire", 75, "acid", 75]);
	return f.dot;
});

rt.type(7716, "/obj/item/clothing/suit/space/hardsuit/security", "/obj/item/clothing/suit/space/hardsuit", {
	icon_state: "hardsuit-sec",
	name: "security hardsuit",
	desc: "A special suit that protects against hazardous, low pressure environments. Has an additional layer of armor.",
	item_state: "sec_hardsuit",
	allowed: null,
	armor: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/security"),
});

// hardsuit.dm:471
rt.def("/obj/item/clothing/suit/space/hardsuit/security/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/weapon/gun/ballistic"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"));
	this.armor = rt.alist(f, ["melee", 30, "bullet", 15, "laser", 30, "energy", 10, "bomb", 10, "bio", 100, "rad", 50, "fire", 75, "acid", 75]);
	return f.dot;
});

rt.type(7949, "/obj/item/clothing/head/helmet/space/hardsuit/security/hos", "/obj/item/clothing/head/helmet/space/hardsuit/security", {
	name: "head of security's hardsuit helmet",
	desc: "a special bulky helmet designed for work in a hazardous, low pressure environment. Has an additional layer of armor.",
	icon_state: "hardsuit0-hos",
	item_color: "hos",
	armor: null,
});

// hardsuit.dm:481
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/security/hos/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 45, "bullet", 25, "laser", 30, "energy", 10, "bomb", 25, "bio", 100, "rad", 50, "fire", 95, "acid", 95]);
	return f.dot;
});

rt.type(7717, "/obj/item/clothing/suit/space/hardsuit/security/hos", "/obj/item/clothing/suit/space/hardsuit/security", {
	jetpack: rt.typePath("/obj/item/weapon/tank/jetpack/suit"),
	icon_state: "hardsuit-hos",
	name: "head of security's hardsuit",
	desc: "A special bulky suit that protects against hazardous, low pressure environments. Has an additional layer of armor.",
	armor: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/security/hos"),
});

// hardsuit.dm:488
rt.def("/obj/item/clothing/suit/space/hardsuit/security/hos/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 45, "bullet", 25, "laser", 30, "energy", 10, "bomb", 25, "bio", 100, "rad", 50, "fire", 95, "acid", 95]);
	return f.dot;
});

rt.type(7950, "/obj/item/clothing/head/helmet/space/hardsuit/captain", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "captain's hardsuit helmet",
	icon_state: "capspace",
	item_state: "capspacehelmet",
	desc: "A tactical SWAT helmet MK.II boasting better protection and a horrible fashion sense.",
	armor: null,
	resistance_flags: 34,
	flags_inv: 480,
	heat_protection: 1,
	max_heat_protection_temperature: 35000,
	actions_types: null,
});

// hardsuit.dm:498
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/captain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 50, "laser", 50, "energy", 25, "bomb", 50, "bio", 100, "rad", 50, "fire", 100, "acid", 100]);

	this.actions_types = list();
	return f.dot;
});

rt.type(7718, "/obj/item/clothing/suit/space/hardsuit/captain", "/obj/item/clothing/suit/space/hardsuit", {
	name: "captain's SWAT suit",
	desc: "A MK.II SWAT suit with streamlined joints and armor made out of superior materials, insulated against intense heat. The most advanced tactical armor available Usually reserved for heavy hitter corporate security, this one has a regal finish in Nanotrasen company colors. Better not let the assistants get a hold of it.",
	icon_state: "caparmor",
	item_state: "capspacesuit",
	allowed: null,
	armor: null,
	resistance_flags: 34,
	heat_protection: 2046,
	max_heat_protection_temperature: 35000,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/captain"),
});

// hardsuit.dm:513
rt.def("/obj/item/clothing/suit/space/hardsuit/captain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/weapon/tank/internals"), T("/obj/item/device/flashlight"), T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/gun/ballistic"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"));
	this.armor = rt.alist(f, ["melee", 40, "bullet", 50, "laser", 50, "energy", 25, "bomb", 50, "bio", 100, "rad", 50, "fire", 100, "acid", 100]);
	return f.dot;
});

rt.type(7951, "/obj/item/clothing/head/helmet/space/hardsuit/clown", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "cosmohonk hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low-humor environment. Has radiation shielding.",
	icon_state: "hardsuit0-clown",
	item_state: "hardsuit0-clown",
	armor: null,
	item_color: "clown",
});

// hardsuit.dm:526
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/clown/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 75, "fire", 60, "acid", 30]);
	return f.dot;
});

rt.type(7719, "/obj/item/clothing/suit/space/hardsuit/clown", "/obj/item/clothing/suit/space/hardsuit", {
	name: "cosmohonk hardsuit",
	desc: "A special suit that protects against hazardous, low humor environments. Has radiation shielding. Only a true clown can wear it.",
	icon_state: "hardsuit-clown",
	item_state: "clown_hardsuit",
	armor: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/clown"),
});

// hardsuit.dm:534
rt.def("/obj/item/clothing/suit/space/hardsuit/clown/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 75, "fire", 60, "acid", 30]);
	return f.dot;
});

// hardsuit.dm:538
rt.def("/obj/item/clothing/suit/space/hardsuit/clown/proc/mob_can_equip", function* mob_can_equip(f: Frame, M: Value, slot: Value) {
	let H: Value = null;
	if (!(yield* parent_proc()) || !rt.istype(M, T("/mob/living/carbon/human"))) {
		return 0;
	}
	if ((H = M).mind.assigned_role == "Clown") {
		return 1;
	} else {
		return 0;
	}
}, true);

rt.type(7952, "/obj/item/clothing/head/helmet/space/hardsuit/ancient", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "prototype RIG hardsuit helmet",
	desc: "Early prototype RIG hardsuit helmet, designed to quickly shift over a user's head. Design constraints of the helmet mean it has no inbuilt cameras, thus it restricts the users visability.",
	icon_state: "hardsuit0-ancient",
	item_state: "anc_helm",
	armor: null,
	tint: 2,
	item_color: "ancient",
	resistance_flags: 2,
});

// hardsuit.dm:552
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/ancient/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 5, "energy", 0, "bomb", 50, "bio", 100, "rad", 100, "fire", 100, "acid", 75]);
	return f.dot;
});

rt.type(7720, "/obj/item/clothing/suit/space/hardsuit/ancient", "/obj/item/clothing/suit/space/hardsuit", {
	footstep: 1,
	name: "prototype RIG hardsuit",
	desc: "Prototype powered RIG hardsuit. Provides excellent protection from the elements of space while being comfortable to move around in, thanks to the powered locomotives. Remains very bulky however.",
	icon_state: "hardsuit-ancient",
	item_state: "anc_hardsuit",
	armor: null,
	slowdown: 3,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/ancient"),
	resistance_flags: 2,
});

// hardsuit.dm:562
rt.def("/obj/item/clothing/suit/space/hardsuit/ancient/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 5, "laser", 5, "energy", 0, "bomb", 50, "bio", 100, "rad", 100, "fire", 100, "acid", 75]);
	return f.dot;
});

// hardsuit.dm:569
rt.def("/obj/item/clothing/suit/space/hardsuit/ancient/proc/on_mob_move", function on_mob_move(f: Frame) {
	let H: Value = null;
	if (!rt.istype((H = this.loc), T("/mob/living/carbon/human")) || H.wear_suit != this) {
		return f.dot;
	}
	if (this.footstep > 1) {
		playsound(this, "suitstep", 50, 1);
		this.footstep = 0;
	} else {
		this.footstep++;
	}
	return f.dot;
});

rt.type(7721, "/obj/item/clothing/suit/space/hardsuit/shielded", "/obj/item/clothing/suit/space/hardsuit", {
	current_charges: 3,
	max_charges: 3,
	recharge_delay: 200,
	recharge_cooldown: 0,
	recharge_rate: 1,
	shield_state: "shield-old",
	shield_on: "shield-old",
	name: "shielded hardsuit",
	desc: "A hardsuit with built in energy shielding. Will rapidly recharge when not under fire.",
	icon_state: "hardsuit-hos",
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/security/hos"),
	allowed: null,
	armor: null,
	resistance_flags: 34,
});

// hardsuit.dm:585
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/gun"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"));
	this.armor = rt.alist(f, ["melee", 30, "bullet", 15, "laser", 30, "energy", 10, "bomb", 10, "bio", 100, "rad", 50, "fire", 100, "acid", 100]);
	return f.dot;
});

// hardsuit.dm:597
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let s: Value = null;
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	this.recharge_cooldown = rt.worldTime(f) + this.recharge_delay;
	if (this.current_charges > 0) {
		yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(2, 1, this);
		yield* s.start();
		owner.visible_message(`<span class='danger'>${owner}'s shields deflect ${attack_text} in a shower of sparks!</span>`);
		this.current_charges--;
		if (this.recharge_rate) {
			if (!this.isprocessing) {
				this.isprocessing = 1;
				GLOB.SSobj.processing += this;
			}
		}
		if (this.current_charges <= 0) {
			owner.visible_message(`${owner}'s shield overloads!`);
			this.shield_state = "broken";
			yield* owner.update_inv_wear_suit();
		}
		return 1;
	}
	return 0;
}, true);

// hardsuit.dm:615
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// hardsuit.dm:619
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/proc/process", function* process(f: Frame) {
	let C: Value = null;
	if (!(rt.worldTime(f) > this.recharge_cooldown && this.current_charges < this.max_charges)) return f.dot;
	this.current_charges = max(0, min(this.current_charges + this.recharge_rate, this.max_charges));
	playsound(this.loc, rt.rsc("sound/magic/charge.ogg"), 50, 1);
	if (this.current_charges == this.max_charges) {
		playsound(this.loc, rt.rsc("sound/machines/ding.ogg"), 50, 1);
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	this.shield_state = `${this.shield_on}`;
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) return f.dot;
	yield* (C = this.loc).update_inv_wear_suit();
	return f.dot;
}, true, { waitfor: false });

// hardsuit.dm:631
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	f.dot = list();
	if (isinhands) return f.dot;
	f.dot += mutable_appearance(rt.rsc("icons/effects/effects.dmi"), this.shield_state, 4.01);
	return f.dot;
});

rt.type(7722, "/obj/item/clothing/suit/space/hardsuit/shielded/ctf", "/obj/item/clothing/suit/space/hardsuit/shielded", {
	flags: 8195,
	max_charges: 5,
	name: "white shielded hardsuit",
	desc: "Standard issue hardsuit for playing capture the flag.",
	icon_state: "ert_medical",
	item_state: "ert_medical",
	item_color: "ert_medical",
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/shielded/ctf"),
	armor: null,
	slowdown: 0,
});

// hardsuit.dm:648
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/ctf/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 30, "laser", 30, "energy", 30, "bomb", 50, "bio", 100, "rad", 100, "fire", 95, "acid", 95]);
	return f.dot;
});

rt.type(7954, "/obj/item/clothing/head/helmet/space/hardsuit/shielded/ctf", "/obj/item/clothing/head/helmet/space/hardsuit/shielded", {
	name: "shielded hardsuit helmet",
	desc: "Standard issue hardsuit helmet for playing capture the flag.",
	icon_state: "hardsuit0-ert_medical",
	item_state: "hardsuit0-ert_medical",
	item_color: "ert_medical",
	armor: null,
});

// hardsuit.dm:676
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/shielded/ctf/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 30, "laser", 30, "energy", 30, "bomb", 50, "bio", 100, "rad", 100, "fire", 95, "acid", 95]);
	return f.dot;
});

rt.type(7725, "/obj/item/clothing/suit/space/hardsuit/shielded/syndi", "/obj/item/clothing/suit/space/hardsuit/shielded", {
	name: "blood-red hardsuit",
	desc: "An advanced hardsuit with built in energy shielding.",
	icon_state: "hardsuit1-syndi",
	item_state: "syndie_hardsuit",
	item_color: "syndi",
	armor: null,
	allowed: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/shielded/syndi"),
	slowdown: 0,
});

// hardsuit.dm:703
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/syndi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 50, "laser", 30, "energy", 15, "bomb", 35, "bio", 100, "rad", 50, "fire", 100, "acid", 100]);

	this.allowed = list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/melee/energy/sword/saber"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals"));
	return f.dot;
});

// hardsuit.dm:710
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/syndi/proc/New", function* New(f: Frame) {
	this.jetpack = (yield* new_(T("/obj/item/weapon/tank/jetpack/suit"), this));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7957, "/obj/item/clothing/head/helmet/space/hardsuit/shielded/syndi", "/obj/item/clothing/head/helmet/space/hardsuit/shielded", {
	name: "blood-red hardsuit helmet",
	desc: "An advanced hardsuit helmet with built in energy shielding.",
	icon_state: "hardsuit1-syndi",
	item_state: "syndie_helm",
	item_color: "syndi",
	armor: null,
});

// hardsuit.dm:719
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/shielded/syndi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 50, "laser", 30, "energy", 15, "bomb", 35, "bio", 100, "rad", 50, "fire", 100, "acid", 100]);
	return f.dot;
});

rt.type(7726, "/obj/item/clothing/suit/space/hardsuit/shielded/swat", "/obj/item/clothing/suit/space/hardsuit/shielded", {
	max_charges: 4,
	current_charges: 4,
	recharge_delay: 15,
	name: "death commando spacesuit",
	desc: "an advanced hardsuit favored by commandos for use in special operations.",
	icon_state: "deathsquad",
	item_state: "swat_suit",
	item_color: "syndi",
	armor: null,
	strip_delay: 130,
	max_heat_protection_temperature: 35000,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/shielded/swat"),
	dog_fashion: rt.typePath("/datum/dog_fashion/back/deathsquad"),
});

// hardsuit.dm:731
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/swat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]);
	return f.dot;
});

rt.type(7958, "/obj/item/clothing/head/helmet/space/hardsuit/shielded/swat", "/obj/item/clothing/head/helmet/space/hardsuit/shielded", {
	name: "death commando helmet",
	desc: "A tactical helmet with built in energy shielding.",
	icon_state: "deathsquad",
	item_state: "deathsquad",
	item_color: "syndi",
	armor: null,
	strip_delay: 130,
	max_heat_protection_temperature: 35000,
	actions_types: null,
});

// hardsuit.dm:743
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/shielded/swat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]);

	this.actions_types = list();
	return f.dot;
});
