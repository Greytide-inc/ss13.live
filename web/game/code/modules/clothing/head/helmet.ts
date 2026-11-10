// Based on /tg/station's code/modules/clothing/head/helmet.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(7932, "/obj/item/clothing/head/helmet", "/obj/item/clothing/head", {
	name: "helmet",
	desc: "Standard Security gear. Protects the head from impacts.",
	icon_state: "helmet",
	item_state: "helmet",
	armor: null,
	flags_inv: 32,
	cold_protection: 1,
	min_cold_protection_temperature: 160,
	heat_protection: 1,
	max_heat_protection_temperature: 600,
	strip_delay: 60,
	resistance_flags: 0,
	flags_cover: 4,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/helmet"),
});

// helmet.dm:6
rt.def("/obj/item/clothing/head/helmet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 35, "bullet", 30, "laser", 30, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

// helmet.dm:20
rt.def("/obj/item/clothing/head/helmet/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "bang_protect", 1);
	return f.dot;
}, true);

rt.type(8004, "/obj/item/clothing/head/helmet/alt", "/obj/item/clothing/head/helmet", {
	name: "bulletproof helmet",
	desc: "A bulletproof combat helmet that excels in protecting the wearer against traditional projectile weaponry and explosives to a minor extent.",
	icon_state: "helmetalt",
	item_state: "helmetalt",
	armor: null,
	can_flashlight: 1,
	dog_fashion: null,
});

// helmet.dm:31
rt.def("/obj/item/clothing/head/helmet/alt/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 15, "bullet", 60, "laser", 10, "energy", 10, "bomb", 40, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

rt.type(8007, "/obj/item/clothing/head/helmet/riot", "/obj/item/clothing/head/helmet", {
	name: "riot helmet",
	desc: "It's a helmet specifically designed to protect against close range attacks.",
	icon_state: "riot",
	item_state: "helmet",
	toggle_message: "You pull the visor down on",
	alt_toggle_message: "You push the visor up on",
	can_toggle: 1,
	armor: null,
	flags_inv: 160,
	strip_delay: 80,
	actions_types: null,
	visor_flags_inv: 128,
	toggle_cooldown: 0,
	flags_cover: 20,
	visor_flags_cover: 20,
	dog_fashion: null,
});

// helmet.dm:52
rt.def("/obj/item/clothing/head/helmet/riot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 45, "bullet", 15, "laser", 5, "energy", 5, "bomb", 5, "bio", 2, "rad", 0, "fire", 50, "acid", 50]);

	this.actions_types = list(T("/datum/action/item_action/toggle"));
	return f.dot;
});

// helmet.dm:63
rt.def("/obj/item/clothing/head/helmet/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let C: Value = null;
	if (!(this.can_toggle && !user.incapacitated())) return f.dot;
	if (!(rt.worldTime(f) > this.cooldown + this.toggle_cooldown)) return f.dot;
	this.cooldown = rt.worldTime(f);
	this.up = (!this.up ? 1 : 0);
	(rt.modSrcVar(f, "flags", this.visor_flags, rt.bitXor));
	(rt.modSrcVar(f, "flags_inv", this.visor_flags_inv, rt.bitXor));
	(rt.modSrcVar(f, "flags_cover", this.visor_flags_cover, rt.bitXor));
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = `${$0}${this.up ? "up" : ""}`;
	to_chat(user, fmt("＀ ％！", [this.up ? this.alt_toggle_message : this.toggle_message, this]));
	yield* user.update_inv_head();
	if (rt.istype(user, T("/mob/living/carbon"))) {
		yield* (C = user).head_update(this, { forced: 1 });
	}
	if (!this.active_sound) return f.dot;
	while (this.up) {
		playsound(this.loc, `${this.active_sound}`, 100, 0, 4);
		yield* sleep(15);
	}
	return f.dot;
}, true);

rt.type(8008, "/obj/item/clothing/head/helmet/justice", "/obj/item/clothing/head/helmet", {
	name: "helmet of justice",
	desc: "WEEEEOOO. WEEEEEOOO. WEEEEOOOO.",
	icon_state: "justice",
	toggle_message: "You turn off the lights on",
	alt_toggle_message: "You turn on the lights on",
	actions_types: null,
	can_toggle: 1,
	toggle_cooldown: 20,
	active_sound: rt.rsc("sound/items/weeoo1.ogg"),
	dog_fashion: null,
});

// helmet.dm:89
rt.def("/obj/item/clothing/head/helmet/justice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle_helmet_light"));
	return f.dot;
});

rt.type(8010, "/obj/item/clothing/head/helmet/swat", "/obj/item/clothing/head/helmet", {
	flags: 1,
	name: "１SWAT helmet",
	desc: "An extremely robust, space-worthy helmet in a nefarious red and black stripe pattern.",
	icon_state: "swatsyndie",
	item_state: "swatsyndie",
	armor: null,
	cold_protection: 1,
	min_cold_protection_temperature: 2,
	heat_protection: 1,
	max_heat_protection_temperature: 1500,
	strip_delay: 80,
	dog_fashion: null,
});

// helmet.dm:107
rt.def("/obj/item/clothing/head/helmet/swat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 30, "laser", 30, "energy", 30, "bomb", 50, "bio", 90, "rad", 20, "fire", 50, "acid", 50]);
	return f.dot;
});

rt.type(8012, "/obj/item/clothing/head/helmet/thunderdome", "/obj/item/clothing/head/helmet", {
	name: "１Thunderdome helmet",
	desc: "<i>'Let the battle commence!'</i>",
	flags_inv: 288,
	icon_state: "thunderdome",
	item_state: "thunderdome",
	armor: null,
	cold_protection: 1,
	min_cold_protection_temperature: 2,
	heat_protection: 1,
	max_heat_protection_temperature: 1500,
	strip_delay: 80,
	dog_fashion: null,
});

// helmet.dm:128
rt.def("/obj/item/clothing/head/helmet/thunderdome/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 30, "laser", 25, "energy", 10, "bomb", 25, "bio", 10, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

rt.type(8013, "/obj/item/clothing/head/helmet/roman", "/obj/item/clothing/head/helmet", {
	name: "roman helmet",
	desc: "An ancient helmet made of bronze and leather.",
	flags_inv: 288,
	flags_cover: 4,
	armor: null,
	resistance_flags: 2,
	icon_state: "roman",
	item_state: "roman",
	strip_delay: 100,
	dog_fashion: null,
});

// helmet.dm:141
rt.def("/obj/item/clothing/head/helmet/roman/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 25, "bullet", 0, "laser", 25, "energy", 10, "bomb", 10, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

rt.type(8016, "/obj/item/clothing/head/helmet/redtaghelm", "/obj/item/clothing/head/helmet", {
	name: "red laser tag helmet",
	desc: "They have chosen their own end.",
	icon_state: "redtaghelm",
	flags_cover: 4,
	item_state: "redtaghelm",
	armor: null,
	dog_fashion: null,
});

// helmet.dm:169
rt.def("/obj/item/clothing/head/helmet/redtaghelm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 15, "bullet", 10, "laser", 20, "energy", 10, "bomb", 20, "bio", 0, "rad", 0, "fire", 0, "acid", 50]);
	return f.dot;
});

rt.type(8017, "/obj/item/clothing/head/helmet/bluetaghelm", "/obj/item/clothing/head/helmet", {
	name: "blue laser tag helmet",
	desc: "They'll need more men.",
	icon_state: "bluetaghelm",
	flags_cover: 4,
	item_state: "bluetaghelm",
	armor: null,
	dog_fashion: null,
});

// helmet.dm:179
rt.def("/obj/item/clothing/head/helmet/bluetaghelm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 15, "bullet", 10, "laser", 20, "energy", 10, "bomb", 20, "bio", 0, "rad", 0, "fire", 0, "acid", 50]);
	return f.dot;
});

rt.type(8018, "/obj/item/clothing/head/helmet/knight", "/obj/item/clothing/head/helmet", {
	name: "medieval helmet",
	desc: "A classic metal helmet.",
	icon_state: "knight_green",
	item_state: "knight_green",
	armor: null,
	flags_inv: 496,
	flags_cover: 20,
	strip_delay: 80,
	dog_fashion: null,
});

// helmet.dm:188
rt.def("/obj/item/clothing/head/helmet/knight/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 41, "bullet", 15, "laser", 5, "energy", 5, "bomb", 5, "bio", 2, "rad", 0, "fire", 0, "acid", 50]);
	return f.dot;
});

// helmet.dm:195
rt.def("/obj/item/clothing/head/helmet/knight/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	if (!this.secondary_flags) return f.dot;
	rt.setAt(this.secondary_flags, "bang_protect", null);
	return f.dot;
}, true);

rt.type(8023, "/obj/item/clothing/head/helmet/skull", "/obj/item/clothing/head/helmet", {
	name: "skull helmet",
	desc: "An intimidating tribal helmet, it doesn't look very comfortable.",
	flags_inv: 240,
	flags_cover: 4,
	armor: null,
	icon_state: "skull",
	item_state: "skull",
	strip_delay: 100,
});

// helmet.dm:222
rt.def("/obj/item/clothing/head/helmet/skull/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 25, "bullet", 25, "laser", 25, "energy", 10, "bomb", 10, "bio", 5, "rad", 20, "fire", 40, "acid", 20]);
	return f.dot;
});

// helmet.dm:230
rt.def("/obj/item/clothing/head/helmet/proc/update_icon", function* update_icon(f: Frame) {
	let H: Value = null;
	let state: Value = `${rt.initial(f, this, "icon_state")}`;
	if (this.F) {
		if (this.F.on) {
			state += "-flight-on";
		} else {
			state += "-flight";
		}
	}
	this.icon_state = state;
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) return f.dot;
	yield* (H = this.loc).update_inv_head();
	return f.dot;
}, true);

// helmet.dm:244
rt.def("/obj/item/clothing/head/helmet/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	if (rt.istype(action, T("/datum/action/item_action/toggle_helmet_flashlight"))) {
		yield* this.toggle_helmlight();
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// helmet.dm:250
rt.def("/obj/item/clothing/head/helmet/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let S: Value = null, A: Value = null, THL: Value = null;
	if (rt.istype(I, T("/obj/item/device/flashlight/seclite"))) {
		S = I;
		if (this.can_flashlight) {
			if (!this.F) {
				if (!(yield* user.transferItemToLoc(S, this))) {
					return f.dot;
				}
				to_chat(user, `<span class='notice'>You click ${S} into place on ${this}.</span>`);
				if (S.on) {
					this.set_light(0);
				}
				this.F = S;
				yield* this.update_icon();
				yield* this.update_helmlight(user);
				this.verbs += P("/obj/item/clothing/head/helmet/proc/toggle_helmlight");
				A = (yield* new_(T("/datum/action/item_action/toggle_helmet_flashlight"), this));
				if (this.loc == user) {
					yield* A.Grant(user);
				}
			}
		}
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if (this.F) {
			S = null;
			for (S of each(this, T("/obj/item/device/flashlight/seclite"))) {
				to_chat(user, `<span class='notice'>You unscrew the seclite from ${this}.</span>`);
				this.F = null;
				S.loc = rt.getStep(f, user, 0);
				yield* this.update_helmlight(user);
				S.update_brightness(user);
				yield* this.update_icon();
				yield* f.usr.update_inv_head();
				this.verbs -= P("/obj/item/clothing/head/helmet/proc/toggle_helmlight");
			}
			for (THL of each(this.actions, T("/datum/action/item_action/toggle_helmet_flashlight"))) {
				yield* qdel(THL);
			}
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// helmet.dm:290
rt.def("/obj/item/clothing/head/helmet/proc/toggle_helmlight", function* toggle_helmlight(f: Frame) {
	let user: Value = null;
	if (!this.F) {
		return f.dot;
	}
	if ((user = f.usr).incapacitated()) {
		return f.dot;
	}
	this.F.on = (!this.F.on ? 1 : 0);
	let $0: any = user;
	to_chat($0, `<span class='notice'>You toggle the helmetlight ${this.F.on ? "on" : "off"}.</span>`);
	playsound(user, rt.rsc("sound/weapons/empty.ogg"), 100, 1);
	yield* this.update_helmlight(user);
	return f.dot;
}, true, { verb: { name: "Toggle Helmetlight", category: "Object", desc: "Click to toggle your helmet's attached flashlight." } });

// helmet.dm:304
rt.def("/obj/item/clothing/head/helmet/proc/update_helmlight", function* update_helmlight(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	if (this.F) {
		if (this.F.on) {
			this.set_light(this.F.brightness_on);
		} else {
			this.set_light(0);
		}
		yield* this.update_icon();
	} else {
		this.set_light(0);
	}
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);
