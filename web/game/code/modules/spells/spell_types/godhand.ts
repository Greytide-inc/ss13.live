// Based on /tg/station's code/modules/spells/spell_types/godhand.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5696, "/obj/item/weapon/melee/touch_attack", "/obj/item/weapon/melee", {
	catchphrase: "High Five!",
	on_use_sound: null,
	attached_spell: null,
	flags: 16514,
	throw_range: 0,
	throw_speed: 0,
	name: "１outstretched hand",
	desc: "High Five?",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "syndballoon",
	item_state: null,
	w_class: 5,
	force: 0,
	throwforce: 0,
});

// godhand.dm:18
rt.def("/obj/item/weapon/melee/touch_attack/proc/Initialize", function* Initialize(f: Frame) {
	this.attached_spell = this.loc;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// godhand.dm:22
rt.def("/obj/item/weapon/melee/touch_attack/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	if (!rt.istype(user, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (user.lying || user.handcuffed) {
		to_chat(user, "<span class='warning'>You can't reach out!</span>");
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// godhand.dm:30
rt.def("/obj/item/weapon/melee/touch_attack/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	yield* user.say(this.catchphrase);
	playsound(rt.getStep(f, user, 0), this.on_use_sound, 50, 1);
	if (this.attached_spell) {
		this.attached_spell.attached_hand = null;
	}
	yield* qdel(this);
	return f.dot;
}, true);

// godhand.dm:38
rt.def("/obj/item/weapon/melee/touch_attack/proc/Destroy", function* Destroy(f: Frame) {
	if (this.attached_spell) {
		this.attached_spell.attached_hand = null;
	}
	return (yield* parent_proc());
}, true);

rt.type(5697, "/obj/item/weapon/melee/touch_attack/disintegrate", "/obj/item/weapon/melee/touch_attack", {
	catchphrase: "EI NATH!!",
	on_use_sound: rt.rsc("sound/magic/disintegrate.ogg"),
	name: "１disintegrating touch",
	desc: "This hand of mine glows with an awesome power!",
	icon_state: "disintegrate",
	item_state: "disintegrate",
});

// godhand.dm:50
rt.def("/obj/item/weapon/melee/touch_attack/disintegrate/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	if (!proximity || target == user || !ismob(target) || !rt.istype(user, T("/mob/living/carbon")) || user.lying || user.handcuffed) {
		return f.dot;
	}
	let M: Value = target;
	yield* do_sparks(4, 0, M.loc);
	yield* M.gib();
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(5698, "/obj/item/weapon/melee/touch_attack/fleshtostone", "/obj/item/weapon/melee/touch_attack", {
	catchphrase: "STAUN EI!!",
	on_use_sound: rt.rsc("sound/magic/fleshtostone.ogg"),
	name: "１petrifying touch",
	desc: "That's the bottom line, because flesh to stone said so!",
	icon_state: "fleshtostone",
	item_state: "fleshtostone",
});

// godhand.dm:66
rt.def("/obj/item/weapon/melee/touch_attack/fleshtostone/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let M: Value = null;
	if (!proximity || target == user || !rt.istype(target, T("/mob/living")) || !rt.istype(user, T("/mob/living/carbon")) || user.lying || user.handcuffed) {
		return f.dot;
	}
	if (user.lying || user.handcuffed) {
		to_chat(user, "<span class='warning'>You can't reach out!</span>");
		return f.dot;
	}
	yield* (M = target).Stun(40);
	yield* M.petrify();
	yield* parent_proc();
	return f.dot;
}, true);
