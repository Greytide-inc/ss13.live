// Based on /tg/station's code/modules/spells/spell_types/spacetime_distortion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11384, "/obj/effect/proc_holder/spell/spacetime_dist", "/obj/effect/proc_holder/spell", {
	duration: 150,
	effects: null,
	ready: 1,
	charge_max: 300,
	range: 7,
	centcom_cancast: 0,
	sound: rt.rsc("sound/effects/magic.ogg"),
	cooldown_min: 300,
	level_max: 0,
	name: "Spacetime Distortion",
	desc: "Entangle the strings of spacetime to deny easy movement around you. The strings vibrate...",
});

// spacetime_distortion.dm:16
rt.def("/obj/effect/proc_holder/spell/spacetime_dist/proc/can_cast", function can_cast(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = f.usr;
	}
	if (this.ready) {
		return parent_proc();
	}
	return 0;
}, false, { args: ["user"] });

// spacetime_distortion.dm:20
rt.def("/obj/effect/proc_holder/spell/spacetime_dist/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	let turfs: Value = null, i: Value = null, loner: Value = null, A: Value = null;
	let $e: any;
	user ??= f.usr;
	if (!rt.len(f, (turfs = (yield* spiral_range_turfs(this.range, user))))) {
		yield* this.revert_cast();
		return f.dot;
	}
	this.ready = 0;
	let turf_steps: Value = list();
	let length: Value = round(rt.len(f, turfs) * 0.5);
	rt.forRange(f, 0, 1, length, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.setAt(turf_steps, pick_n_take(turfs), pick_n_take(turfs));
	}
	rt.endFor(f, 0);
	if (rt.len(f, turfs) > 0) {
		loner = pick(turfs);
		A = get_area(user);
		rt.setAt(turf_steps, loner, rt.getStep(f, pick(A.contents), 0));
	}
	yield* this.perform(turf_steps, { user: user });
	return f.dot;
}, true);

// spacetime_distortion.dm:38
rt.def("/obj/effect/proc_holder/spell/spacetime_dist/proc/after_cast", function* after_cast(f: Frame, targets: Value) {
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/proc_holder/spell/spacetime_dist/proc/clean_turfs"))), this.duration);
	return f.dot;
}, true);

// spacetime_distortion.dm:41
rt.def("/obj/effect/proc_holder/spell/spacetime_dist/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let V: Value = null, T0: Value = null, T1: Value = null, STD0: Value = null, STD1: Value = null;
	user ??= f.usr;
	this.effects = list();
	for (V of each(targets)) {
		T0 = V;
		T1 = rt.index(targets, V);
		STD0 = (yield* new_(T("/obj/effect/cross_action/spacetime_dist"), T0));
		STD1 = (yield* new_(T("/obj/effect/cross_action/spacetime_dist"), T1));
		STD0.linked_dist = STD1;
		STD0.add_overlay(T1.photograph());
		STD1.linked_dist = STD0;
		STD1.add_overlay(T0.photograph());
		STD1.set_light(4, 30, "#c9fff5");
		this.effects += STD0;
		this.effects += STD1;
	}
	return f.dot;
}, true);

// spacetime_distortion.dm:56
rt.def("/obj/effect/proc_holder/spell/spacetime_dist/proc/clean_turfs", function* clean_turfs(f: Frame) {
	let effect: Value = null;
	for (effect of each(this.effects)) {
		yield* qdel(effect);
	}
	this.effects.Cut();
	this.effects = null;
	this.ready = 1;
	return f.dot;
}, true);

rt.type(12101, "/obj/effect/cross_action/spacetime_dist", "/obj/effect/cross_action", {
	linked_dist: null,
	busy: 0,
	sound: null,
	walks_left: 50,
	name: "spacetime distortion",
	desc: "A distortion in spacetime. You can hear faint music...",
	icon_state: "",
});

// spacetime_distortion.dm:77
rt.def("/obj/effect/cross_action/spacetime_dist/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	f.dot = parent_proc();
	this.sound = `sound/guitar/${safepick(GLOB.guitar_notes)}`;
	this.dir = pick(GLOB.cardinal);
	return f.dot;
}, false);

// spacetime_distortion.dm:82
rt.def("/obj/effect/cross_action/spacetime_dist/proc/walk_link", function* walk_link(f: Frame, AM: Value) {
	if (!(this.linked_dist && this.walks_left > 0)) return f.dot;
	flick("purplesparkles", this);
	yield* this.linked_dist.get_walker(AM);
	this.walks_left--;
	return f.dot;
}, true);

// spacetime_distortion.dm:89
rt.def("/obj/effect/cross_action/spacetime_dist/proc/get_walker", function* get_walker(f: Frame, AM: Value) {
	this.busy = 1;
	flick("purplesparkles", this);
	yield* AM.forceMove(rt.getStep(f, this, 0));
	playsound(rt.getStep(f, this, 0), this.sound, 70, 0);
	this.busy = 0;
	return f.dot;
}, true);

// spacetime_distortion.dm:95
rt.def("/obj/effect/cross_action/spacetime_dist/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	if (this.busy) return f.dot;
	yield* this.walk_link(AM);
	return f.dot;
}, true);

// spacetime_distortion.dm:99
rt.def("/obj/effect/cross_action/spacetime_dist/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (yield* user.temporarilyRemoveItemFromInventory(W)) {
		yield* this.walk_link(W);
	} else {
		yield* this.walk_link(user);
	}
	return f.dot;
}, true);

// spacetime_distortion.dm:105
rt.def("/obj/effect/cross_action/spacetime_dist/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.walk_link(user);
	return f.dot;
}, true);

// spacetime_distortion.dm:108
rt.def("/obj/effect/cross_action/spacetime_dist/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	yield* this.walk_link(user);
	return f.dot;
}, true);

// spacetime_distortion.dm:113
rt.def("/obj/effect/cross_action/spacetime_dist/proc/Destroy", function* Destroy(f: Frame) {
	this.busy = 1;
	this.linked_dist = null;
	return (yield* parent_proc());
}, true);
