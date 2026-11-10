// Based on /tg/station's code/game/objects/items/weapons/melee/transforming.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(5692, "/obj/item/weapon/melee/transforming", "/obj/item/weapon/melee", {
	active: 0,
	force_on: 30,
	throwforce_on: 20,
	icon_state_on: "axe1",
	hitsound_on: rt.rsc("sound/weapons/blade1.ogg"),
	attack_verb_on: null,
	attack_verb_off: null,
	w_class_on: 4,
	w_class: 2,
	sharpness: 1,
});

// transforming.dm:14
rt.def("/obj/item/weapon/melee/transforming/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.active) {
		if (rt.len(f, this.attack_verb_on)) {
			this.attack_verb = this.attack_verb_on;
		}
	} else {
		if (!rt.len(f, this.attack_verb_off)) return f.dot;
		this.attack_verb = this.attack_verb_off;
	}
	return f.dot;
}, true);

// transforming.dm:23
rt.def("/obj/item/weapon/melee/transforming/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!(yield* this.transform_weapon(user))) return f.dot;
	yield* this.clumsy_transform_effect(user);
	return f.dot;
}, true);

// transforming.dm:27
rt.def("/obj/item/weapon/melee/transforming/proc/transform_weapon", function* transform_weapon(f: Frame, user: Value, supress_message_text: Value) {
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		this.force = this.force_on;
		this.throwforce = this.throwforce_on;
		this.hitsound = this.hitsound_on;
		this.throw_speed = 4;
		if (rt.len(f, this.attack_verb_on)) {
			this.attack_verb = this.attack_verb_on;
		}
		this.icon_state = this.icon_state_on;
		this.w_class = this.w_class_on;
	} else {
		this.force = rt.initial(f, this, "force");
		this.throwforce = rt.initial(f, this, "throwforce");
		this.hitsound = rt.initial(f, this, "hitsound");
		this.throw_speed = rt.initial(f, this, "throw_speed");
		if (rt.len(f, this.attack_verb_off)) {
			this.attack_verb = this.attack_verb_off;
		}
		this.icon_state = rt.initial(f, this, "icon_state");
		this.w_class = rt.initial(f, this, "w_class");
	}
	this.transform_messages(user, supress_message_text);
	yield* this.add_fingerprint(user);
	return 1;
}, true);

// transforming.dm:51
rt.def("/obj/item/weapon/melee/transforming/proc/transform_messages", function transform_messages(f: Frame, user: Value, supress_message_text: Value) {
	let $1: any, $2: any;
	let $0: any = user;
	playsound($0, this.active ? rt.rsc("sound/weapons/saberon.ogg") : rt.rsc("sound/weapons/saberoff.ogg"), 35, 1);
	if (supress_message_text) return f.dot;
	$0 = user;
	$1 = this;
	if (this.active) {

		$2 = "is now active";
	} else {
		$2 = "can now be concealed";
	}
	to_chat($0, `<span class='notice'>${$1} ${$2}.</span>`);
	return f.dot;
});

// transforming.dm:56
rt.def("/obj/item/weapon/melee/transforming/proc/clumsy_transform_effect", function* clumsy_transform_effect(f: Frame, user: Value) {
	if (!(rt.bitAnd(user.disabilities, 256) && prob(50))) return f.dot;
	to_chat(user, `<span class='warning'>You accidentally cut yourself with ${this}, like a doofus!</span>`);
	yield* user.take_bodypart_damage(5, 5);
	return f.dot;
}, true);
