// Based on /tg/station's code/game/objects/structures/holosign.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12781, "/obj/structure/holosign", "/obj/structure", {
	projector: null,
	anchored: 1,
	name: "holo sign",
	icon: rt.rsc("icons/effects/effects.dmi"),
	obj_integrity: 1,
	max_integrity: 1,
	armor: null,
});

// holosign.dm:10
rt.def("/obj/structure/holosign/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 50, "laser", 50, "energy", 50, "bomb", 0, "bio", 0, "rad", 0, "fire", 20, "acid", 20]);
	return f.dot;
});

// holosign.dm:15
rt.def("/obj/structure/holosign/proc/New", function* New(f: Frame, loc: Value, source_projector: Value) {
	if (source_projector) {
		this.projector = source_projector;
		this.projector.signs += this;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// holosign.dm:21
rt.def("/obj/structure/holosign/proc/Destroy", function* Destroy(f: Frame) {
	if (this.projector) {
		this.projector.signs -= this;
		this.projector = null;
	}
	return (yield* parent_proc());
}, true);

// holosign.dm:26
rt.def("/obj/structure/holosign/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* user.do_attack_animation(this, "punch");
	user.changeNext_move(8);
	yield* this.take_damage(5, "brute", "melee", 1);
	return f.dot;
}, true);

// holosign.dm:31
rt.def("/obj/structure/holosign/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		playsound(this.loc, rt.rsc("sound/weapons/egloves.ogg"), 80, 1);
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/weapons/egloves.ogg"), 80, 1);
	}
	return f.dot;
});

rt.type(12783, "/obj/structure/holosign/barrier", "/obj/structure/holosign", {
	allow_walk: 1,
	pass_flags: 32,
	name: "holo barrier",
	desc: "A short holographic barrier which can only be passed by walking.",
	icon_state: "holosign_sec",
	density: 1,
	obj_integrity: 20,
	max_integrity: 20,
});

// holosign.dm:54
rt.def("/obj/structure/holosign/barrier/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value, air_group: Value) {
	height ??= 0;
	air_group ??= 0;
	if (!this.density) {
		return 1;
	}
	if (air_group || height == 0) {
		return 1;
	}
	if (rt.bitAnd(mover.pass_flags, 7)) {
		return 1;
	}
	if (!rt.istype(mover, T("/mob/living/carbon"))) return f.dot;
	let C: Value = mover;
	if (!(this.allow_walk && C.m_intent == "walk")) return f.dot;
	return 1;
});

rt.type(12785, "/obj/structure/holosign/barrier/atmos", "/obj/structure/holosign/barrier", {
	anchored: 1,
	CanAtmosPass: 0,
	name: "holo firelock",
	desc: "A holographic barrier resembling a firelock. Though it does not prevent solid objects from passing through, gas is kept out.",
	icon_state: "holo_firelock",
	density: 0,
	layer: 4.1,
	alpha: 150,
});

// holosign.dm:80
rt.def("/obj/structure/holosign/barrier/atmos/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	this.air_update_turf(1);
	return f.dot;
});

// holosign.dm:84
rt.def("/obj/structure/holosign/barrier/atmos/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = rt.getStep(f, this, 0);
	f.dot = (yield* parent_proc());
	_T.air_update_turf(1);
	return f.dot;
}, true);

rt.type(12786, "/obj/structure/holosign/barrier/cyborg", "/obj/structure/holosign/barrier", {
	allow_walk: 0,
	name: "Energy Field",
	desc: "A fragile energy field that blocks movement. Excels at blocking lethal projectiles.",
	density: 1,
	obj_integrity: 10,
	max_integrity: 10,
});

// holosign.dm:97
rt.def("/obj/structure/holosign/barrier/cyborg/proc/bullet_act", function* bullet_act(f: Frame, _P: Value) {
	yield* this.take_damage(_P.damage / 5, "brute", "melee", 1);
	if (rt.istype(_P, T("/obj/item/projectile/energy/electrode"))) {
		yield* this.take_damage(10, "brute", "melee", 1);
	}
	if (!rt.istype(_P, T("/obj/item/projectile/beam/disabler"))) return f.dot;
	yield* this.take_damage(5, "brute", "melee", 1);
	return f.dot;
}, true);

rt.type(12787, "/obj/structure/holosign/barrier/cyborg/hacked", "/obj/structure/holosign/barrier/cyborg", {
	shockcd: 0,
	name: "Charged Energy Field",
	desc: "A powerful energy field that blocks movement. Energy arcs off it",
	obj_integrity: 20,
	max_integrity: 20,
});

// holosign.dm:111
rt.def("/obj/structure/holosign/barrier/cyborg/hacked/proc/bullet_act", function* bullet_act(f: Frame, _P: Value) {
	yield* this.take_damage(_P.damage, "brute", "melee", 1);
	return f.dot;
}, true);

// holosign.dm:117
rt.def("/obj/structure/holosign/barrier/cyborg/hacked/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let M: Value = null;
	if (this.shockcd) return f.dot;
	if (!ismob(user)) return f.dot;
	yield* (M = user).electrocute_act(15, "Energy Barrier", { safety: 1 });
	this.shockcd = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/holosign/barrier/cyborg/hacked/proc/cooldown"))), 5);
	return f.dot;
}, true);

// holosign.dm:125
rt.def("/obj/structure/holosign/barrier/cyborg/hacked/proc/Bumped", function* Bumped(f: Frame, user: Value) {
	let M: Value = null;
	if (this.shockcd) return f.dot;
	if (!ismob(user)) return f.dot;
	yield* (M = user).electrocute_act(15, "Energy Barrier", { safety: 1 });
	this.shockcd = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/holosign/barrier/cyborg/hacked/proc/cooldown"))), 5);
	return f.dot;
}, true);
