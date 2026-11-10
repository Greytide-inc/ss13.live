// Based on /tg/station's code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(7994, "/obj/item/clothing/head/helmet/clockwork", "/obj/item/clothing/head/helmet", {
	name: "clockwork helmet",
	desc: "A heavy helmet made of brass.",
	icon: rt.rsc("icons/obj/clothing/clockwork_garb.dmi"),
	icon_state: "clockwork_helmet",
	w_class: 3,
	resistance_flags: 34,
	armor: null,
});

// clockwork_armor.dm:9
rt.def("/obj/item/clothing/head/helmet/clockwork/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 80, "bullet", 70, "laser", -25, "energy", 0, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
	return f.dot;
});

// clockwork_armor.dm:12
rt.def("/obj/item/clothing/head/helmet/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.ratvar_act();
	GLOB.all_clockwork_objects += this;
	return f.dot;
}, true);

// clockwork_armor.dm:17
rt.def("/obj/item/clothing/head/helmet/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.all_clockwork_objects -= this;
	return (yield* parent_proc());
}, true);

// clockwork_armor.dm:22
rt.def("/obj/item/clothing/head/helmet/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (GLOB.ratvar_awakens) {
		this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]);
		(rt.modSrcVar(f, "flags", STOPSPRESSUREDMAGE, rt.bitOr));
		this.max_heat_protection_temperature = FIRE_IMMUNITY_SUIT_MAX_TEMP_PROTECT;
		this.min_cold_protection_temperature = SPACE_HELM_MIN_TEMP_PROTECT;
	} else {
		this.armor = rt.alist(f, ["melee", 80, "bullet", 70, "laser", -25, "energy", 0, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
		(rt.modSrcVar(f, "flags", 16777214, rt.bitAnd));
		this.max_heat_protection_temperature = rt.initial(f, this, "max_heat_protection_temperature");
		this.min_cold_protection_temperature = rt.initial(f, this, "min_cold_protection_temperature");
	}
	return f.dot;
});

// clockwork_armor.dm:33
rt.def("/obj/item/clothing/head/helmet/clockwork/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let C: Value = null;
	yield* parent_proc();
	if (!(slot == slot_head && !is_servant_of_ratvar(user))) return f.dot;
	if (!iscultist(user)) {
		to_chat(user, "<span class='heavy_brass'>\"Now now, this is for my servants, not you.\"</span>");
		user.visible_message(`<span class='warning'>As ${user} puts ${this} on, it flickers off their head!</span>`, "<span class='warning'>The helmet flickers off your head, leaving only nausea!</span>");
		if (rt.istype(user, T("/mob/living/carbon"))) {
			yield* (C = user).vomit(20);
		}
	} else {
		to_chat(user, "<span class='heavy_brass'>\"Do you have a hole in your head? You're about to.\"</span>");
		to_chat(user, "<span class='userdanger'>The helmet tries to drive a spike through your head as you scramble to remove it!</span>");
		yield* user.emote("scream");
		yield* user.apply_damage(30, "brute", "head");
		yield* user.adjustBrainLoss(30);
	}
	yield* addtimer((yield* new_(T("/datum/callback"), user, P("/mob/proc/dropItemToGround"))), this, 1);
	return f.dot;
}, true);

// clockwork_armor.dm:50
rt.def("/obj/item/clothing/head/helmet/clockwork/proc/mob_can_equip", function* mob_can_equip(f: Frame) {
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[1] && !is_servant_of_ratvar(f.args[1])) {
		return 0;
	}
	return (yield* parent_proc());
}, true, { args: ["M", "equipper", "slot", "disable_warning"] });

rt.type(7764, "/obj/item/clothing/suit/armor/clockwork", "/obj/item/clothing/suit/armor", {
	name: "clockwork cuirass",
	desc: "A bulky cuirass made of brass.",
	icon: rt.rsc("icons/obj/clothing/clockwork_garb.dmi"),
	icon_state: "clockwork_cuirass",
	w_class: 4,
	body_parts_covered: 30,
	cold_protection: 30,
	heat_protection: 30,
	resistance_flags: 34,
	armor: null,
	allowed: null,
});

// clockwork_armor.dm:64
rt.def("/obj/item/clothing/suit/armor/clockwork/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 80, "bullet", 70, "laser", -25, "energy", 0, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);

	this.allowed = list(T("/obj/item/clockwork"), T("/obj/item/clothing/glasses/wraith_spectacles"), T("/obj/item/clothing/glasses/judicial_visor"), T("/obj/item/device/mmi/posibrain/soul_vessel"));
	return f.dot;
});

// clockwork_armor.dm:68
rt.def("/obj/item/clothing/suit/armor/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.ratvar_act();
	GLOB.all_clockwork_objects += this;
	return f.dot;
}, true);

// clockwork_armor.dm:73
rt.def("/obj/item/clothing/suit/armor/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.all_clockwork_objects -= this;
	return (yield* parent_proc());
}, true);

// clockwork_armor.dm:78
rt.def("/obj/item/clothing/suit/armor/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (GLOB.ratvar_awakens) {
		this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]);
		(rt.modSrcVar(f, "flags", STOPSPRESSUREDMAGE, rt.bitOr));
		this.max_heat_protection_temperature = FIRE_IMMUNITY_SUIT_MAX_TEMP_PROTECT;
		this.min_cold_protection_temperature = SPACE_HELM_MIN_TEMP_PROTECT;
	} else {
		this.armor = rt.alist(f, ["melee", 80, "bullet", 70, "laser", -25, "energy", 0, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
		(rt.modSrcVar(f, "flags", 16777214, rt.bitAnd));
		this.max_heat_protection_temperature = rt.initial(f, this, "max_heat_protection_temperature");
		this.min_cold_protection_temperature = rt.initial(f, this, "min_cold_protection_temperature");
	}
	return f.dot;
});

// clockwork_armor.dm:89
rt.def("/obj/item/clothing/suit/armor/clockwork/proc/mob_can_equip", function* mob_can_equip(f: Frame) {
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[1] && !is_servant_of_ratvar(f.args[1])) {
		return 0;
	}
	return (yield* parent_proc());
}, true, { args: ["M", "equipper", "slot", "disable_warning"] });

// clockwork_armor.dm:94
rt.def("/obj/item/clothing/suit/armor/clockwork/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let C: Value = null;
	yield* parent_proc();
	if (!(slot == slot_wear_suit && !is_servant_of_ratvar(user))) return f.dot;
	if (!iscultist(user)) {
		to_chat(user, "<span class='heavy_brass'>\"Now now, this is for my servants, not you.\"</span>");
		user.visible_message(`<span class='warning'>As ${user} puts ${this} on, it flickers off their body!</span>`, "<span class='warning'>The curiass flickers off your body, leaving only nausea!</span>");
		if (rt.istype(user, T("/mob/living/carbon"))) {
			yield* (C = user).vomit(20);
		}
	} else {
		to_chat(user, "<span class='heavy_brass'>\"I think this armor is too hot for you to handle.\"</span>");
		to_chat(user, "<span class='userdanger'>The curiass emits a burst of flame as you scramble to get it off!</span>");
		yield* user.emote("scream");
		yield* user.apply_damage(15, "fire", "chest");
		yield* user.adjust_fire_stacks(2);
		yield* user.IgniteMob();
	}
	yield* addtimer((yield* new_(T("/datum/callback"), user, P("/mob/proc/dropItemToGround"), this, 1)), 1);
	return f.dot;
}, true);

rt.type(7661, "/obj/item/clothing/gloves/clockwork", "/obj/item/clothing/gloves", {
	name: "clockwork gauntlets",
	desc: "Heavy, shock-resistant gauntlets with brass reinforcement.",
	icon: rt.rsc("icons/obj/clothing/clockwork_garb.dmi"),
	icon_state: "clockwork_gauntlets",
	item_state: "clockwork_gauntlets",
	item_color: null,
	strip_delay: 50,
	equip_delay_other: 30,
	body_parts_covered: 384,
	cold_protection: 384,
	heat_protection: 384,
	siemens_coefficient: 0,
	permeability_coefficient: 0.05,
	resistance_flags: 34,
	armor: null,
});

// clockwork_armor.dm:126
rt.def("/obj/item/clothing/gloves/clockwork/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 80, "bullet", 70, "laser", -25, "energy", 0, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
	return f.dot;
});

// clockwork_armor.dm:129
rt.def("/obj/item/clothing/gloves/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.ratvar_act();
	GLOB.all_clockwork_objects += this;
	return f.dot;
}, true);

// clockwork_armor.dm:134
rt.def("/obj/item/clothing/gloves/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.all_clockwork_objects -= this;
	return (yield* parent_proc());
}, true);

// clockwork_armor.dm:139
rt.def("/obj/item/clothing/gloves/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (GLOB.ratvar_awakens) {
		this.armor = rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]);
		(rt.modSrcVar(f, "flags", STOPSPRESSUREDMAGE, rt.bitOr));
		this.max_heat_protection_temperature = FIRE_IMMUNITY_SUIT_MAX_TEMP_PROTECT;
		this.min_cold_protection_temperature = SPACE_HELM_MIN_TEMP_PROTECT;
	} else {
		this.armor = rt.alist(f, ["melee", 80, "bullet", 70, "laser", -25, "energy", 0, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
		(rt.modSrcVar(f, "flags", 16777214, rt.bitAnd));
		this.max_heat_protection_temperature = rt.initial(f, this, "max_heat_protection_temperature");
		this.min_cold_protection_temperature = rt.initial(f, this, "min_cold_protection_temperature");
	}
	return f.dot;
});

// clockwork_armor.dm:150
rt.def("/obj/item/clothing/gloves/clockwork/proc/mob_can_equip", function* mob_can_equip(f: Frame) {
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[1] && !is_servant_of_ratvar(f.args[1])) {
		return 0;
	}
	return (yield* parent_proc());
}, true, { args: ["M", "equipper", "slot", "disable_warning"] });

// clockwork_armor.dm:155
rt.def("/obj/item/clothing/gloves/clockwork/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let C: Value = null;
	yield* parent_proc();
	if (!(slot == slot_gloves && !is_servant_of_ratvar(user))) return f.dot;
	if (!iscultist(user)) {
		to_chat(user, "<span class='heavy_brass'>\"Now now, this is for my servants, not you.\"</span>");
		user.visible_message(`<span class='warning'>As ${user} puts ${this} on, it flickers off their arms!</span>`, "<span class='warning'>The gauntlets flicker off your arms, leaving only nausea!</span>");
		if (rt.istype(user, T("/mob/living/carbon"))) {
			yield* (C = user).vomit();
		}
	} else {
		to_chat(user, "<span class='heavy_brass'>\"Did you like having arms?\"</span>");
		to_chat(user, "<span class='userdanger'>The gauntlets suddenly squeeze tight, crushing your arms before you manage to get them off!</span>");
		yield* user.emote("scream");
		yield* user.apply_damage(7, "brute", "l_arm");
		yield* user.apply_damage(7, "brute", "r_arm");
	}
	yield* addtimer((yield* new_(T("/datum/callback"), user, P("/mob/proc/dropItemToGround"), this, 1)), 1);
	return f.dot;
}, true);

rt.type(8458, "/obj/item/clothing/shoes/clockwork", "/obj/item/clothing/shoes", {
	name: "clockwork treads",
	desc: "Industrial boots made of brass. They're very heavy.",
	icon: rt.rsc("icons/obj/clothing/clockwork_garb.dmi"),
	icon_state: "clockwork_treads",
	w_class: 3,
	strip_delay: 50,
	equip_delay_other: 30,
	resistance_flags: 34,
});

// clockwork_armor.dm:182
rt.def("/obj/item/clothing/shoes/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.ratvar_act();
	GLOB.all_clockwork_objects += this;
	return f.dot;
}, true);

// clockwork_armor.dm:187
rt.def("/obj/item/clothing/shoes/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.all_clockwork_objects -= this;
	return (yield* parent_proc());
}, true);

// clockwork_armor.dm:195
rt.def("/obj/item/clothing/shoes/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (GLOB.ratvar_awakens) {
		(rt.modSrcVar(f, "flags", NOSLIP, rt.bitOr));
	} else {
		(rt.modSrcVar(f, "flags", 16776191, rt.bitAnd));
	}
	return f.dot;
});

// clockwork_armor.dm:200
rt.def("/obj/item/clothing/shoes/clockwork/proc/mob_can_equip", function* mob_can_equip(f: Frame) {
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[1] && !is_servant_of_ratvar(f.args[1])) {
		return 0;
	}
	return (yield* parent_proc());
}, true, { args: ["M", "equipper", "slot", "disable_warning"] });

// clockwork_armor.dm:205
rt.def("/obj/item/clothing/shoes/clockwork/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let C: Value = null;
	yield* parent_proc();
	if (!(slot == slot_shoes && !is_servant_of_ratvar(user))) return f.dot;
	if (!iscultist(user)) {
		to_chat(user, "<span class='heavy_brass'>\"Now now, this is for my servants, not you.\"</span>");
		user.visible_message(`<span class='warning'>As ${user} puts ${this} on, it flickers off their feet!</span>`, "<span class='warning'>The treads flicker off your feet, leaving only nausea!</span>");
		if (rt.istype(user, T("/mob/living/carbon"))) {
			yield* (C = user).vomit();
		}
	} else {
		to_chat(user, "<span class='heavy_brass'>\"Let's see if you can dance with these.\"</span>");
		to_chat(user, "<span class='userdanger'>The treads turn searing hot as you scramble to get them off!</span>");
		yield* user.emote("scream");
		yield* user.apply_damage(7, "fire", "l_leg");
		yield* user.apply_damage(7, "fire", "r_leg");
	}
	yield* addtimer((yield* new_(T("/datum/callback"), user, P("/mob/proc/dropItemToGround"), this, 1)), 1);
	return f.dot;
}, true);
