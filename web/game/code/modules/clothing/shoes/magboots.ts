// Based on /tg/station's code/modules/clothing/shoes/magboots.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8489, "/obj/item/clothing/shoes/magboots", "/obj/item/clothing/shoes", {
	magboot_state: "magboots",
	magpulse: 0,
	slowdown_active: 2,
	desc: "Magnetic boots, often used during extravehicular activity to ensure the user remains safely attached to the vehicle.",
	name: "magboots",
	icon_state: "magboots0",
	actions_types: null,
	strip_delay: 70,
	equip_delay_other: 70,
	resistance_flags: 2,
	origin_tech: "materials=3;magnets=4;engineering=4",
});

// magboots.dm:8
rt.def("/obj/item/clothing/shoes/magboots/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle"));
	return f.dot;
});

// magboots.dm:18
rt.def("/obj/item/clothing/shoes/magboots/verb/toggle", function* toggle(f: Frame) {
	if (!this.can_use(f.usr)) {
		return f.dot;
	}
	yield* this.attack_self(f.usr);
	return f.dot;
}, true, { verb: { name: "Toggle Magboots", category: "Object", src: 11 } });

// magboots.dm:24
rt.def("/obj/item/clothing/shoes/magboots/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	let $e: any;
	if (this.magpulse) {
		(rt.modField(f, this, "flags", 16776191, rt.bitAnd));
		this.slowdown = SHOES_SLOWDOWN;
	} else {
		(rt.modField(f, this, "flags", NOSLIP, rt.bitOr));
		this.slowdown = this.slowdown_active;
	}
	this.magpulse = (!this.magpulse ? 1 : SHOES_SLOWDOWN);
	this.icon_state = `${this.magboot_state}${this.magpulse}`;
	let $0: any = user;
	to_chat($0, `<span class='notice'>You ${this.magpulse ? "enable" : "disable"} the mag-pulse traction system.</span>`);
	user.update_inv_shoes();
	yield* user.update_gravity(user.has_gravity());
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);

// magboots.dm:40
rt.def("/obj/item/clothing/shoes/magboots/proc/negates_gravity", function negates_gravity(f: Frame) {
	return rt.bitAnd(this.flags, NOSLIP);
});

// magboots.dm:43
rt.def("/obj/item/clothing/shoes/magboots/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `Its mag-pulse traction system appears to be ${this.magpulse ? "enabled" : "disabled"}.`);
	return f.dot;
}, false);
