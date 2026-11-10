// Based on /tg/station's code/game/objects/effects/effect_system/effect_system.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11917, "/obj/effect/particle_effect", "/obj/effect", {
	pass_flags: 5,
	name: "particle effect",
	mouse_opacity: 0,
});

// effect_system.dm:15
rt.def("/obj/effect/particle_effect/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (!GLOB.SSticker) return f.dot;
	GLOB.cameranet.updateVisibility(this);
	return f.dot;
}, true);

// effect_system.dm:21
rt.def("/obj/effect/particle_effect/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSticker) {
		GLOB.cameranet.updateVisibility(this);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(1510, "/datum/effect_system", "/datum", {
	number: 3,
	cardinals: 0,
	location: null,
	holder: null,
	effect_type: null,
	total_effects: 0,
});

// effect_system.dm:35
rt.def("/datum/effect_system/proc/Destroy", function* Destroy(f: Frame) {
	this.holder = null;
	this.location = null;
	return (yield* parent_proc());
}, true);

// effect_system.dm:38
rt.def("/datum/effect_system/proc/set_up", function set_up(f: Frame, n: Value, c: Value, loca: Value) {
	n ??= 3;
	c ??= 0;
	if (n > 10) {
		n = 10;
	}
	this.number = n;
	this.cardinals = c;
	if (isturf(loca)) {
		this.location = loca;
	} else {
		this.location = rt.getStep(f, loca, 0);
	}
	return f.dot;
});

// effect_system.dm:48
rt.def("/datum/effect_system/proc/attach", function attach(f: Frame, atom: Value) {
	this.holder = atom;
	return f.dot;
});

// effect_system.dm:51
rt.def("/datum/effect_system/proc/start", function start(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, this.number, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (this.total_effects > 20) {
			return f.dot;
		}
		ImmediateInvokeAsync(this, P("/datum/effect_system/proc/generate_effect"));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// effect_system.dm:58
rt.def("/datum/effect_system/proc/generate_effect", function* generate_effect(f: Frame) {
	let direction: Value = null, j: Value = null;
	let $e: any;
	if (this.holder) {
		this.location = rt.getStep(f, this.holder, 0);
	}
	let E: Value = (yield* new_(this.effect_type, this.location));
	this.total_effects++;
	if (this.cardinals) {
		direction = pick(GLOB.cardinal);
	} else {
		direction = pick(GLOB.alldirs);
	}
	let steps_amt: Value = pick(1, 2, 3);
	rt.forRange(f, 0, 1, steps_amt, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		j = $e;
		yield* sleep(5);
		yield* step(E, direction);
	}
	rt.endFor(f, 0);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/effect_system/proc/decrement_total_effect"))), 20);
	return f.dot;
}, true);

// effect_system.dm:73
rt.def("/datum/effect_system/proc/decrement_total_effect", function decrement_total_effect(f: Frame) {
	this.total_effects--;
	return f.dot;
});
