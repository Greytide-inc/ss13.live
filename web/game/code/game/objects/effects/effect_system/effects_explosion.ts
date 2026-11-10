// Based on /tg/station's code/game/objects/effects/effect_system/effects_explosion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11918, "/obj/effect/particle_effect/expl_particles", "/obj/effect/particle_effect", {
	anchored: 1,
	name: "fire",
	icon_state: "explosion_particle",
	opacity: 1,
});

// effects_explosion.dm:8
rt.def("/obj/effect/particle_effect/expl_particles/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 15, 8);
	return f.dot;
}, true);

rt.type(1511, "/datum/effect_system/expl_particles", "/datum/effect_system", {
	number: 10,
});

// effects_explosion.dm:15
rt.def("/datum/effect_system/expl_particles/proc/start", function start(f: Frame) {
	let i: Value = null, expl: Value = null, direct: Value = null, steps_amt: Value = null, j: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, this.number, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.spawnTail(f, 0, "/datum/effect_system/expl_particles/proc/start: spawn at game/objects/effects/effect_system/effects_explosion.dm:16", i, expl, direct, steps_amt, j);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// a spawn(0) body of /datum/effect_system/expl_particles/proc/start, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/effect_system/expl_particles/proc/start: spawn at game/objects/effects/effect_system/effects_explosion.dm:16", function* (f: Frame, i: Value, expl: Value, direct: Value, steps_amt: Value, j: Value) {
	let $e: any;
	expl = (yield* new_(T("/obj/effect/particle_effect/expl_particles"), this.location));
	direct = pick(GLOB.alldirs);
	steps_amt = rt.op(f, "PickWeighted", [4], [1, 25, 2, 50, 100, 3, 4, 200]);
	j = null;
	rt.forRange(f, 1, 1, steps_amt, 1);
	while (($e = rt.next(f, 1)) !== undefined) {
		j = $e;
		yield* sleep(1);
		yield* step(expl, direct);
	}
	rt.endFor(f, 1);
	return null;
});

rt.type(11936, "/obj/effect/explosion", "/obj/effect", {
	anchored: 1,
	name: "fire",
	icon: rt.rsc("icons/effects/96x96.dmi"),
	icon_state: "explosion",
	opacity: 1,
	mouse_opacity: 0,
	pixel_x: -32,
	pixel_y: -32,
});

// effects_explosion.dm:35
rt.def("/obj/effect/explosion/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 10, 8);
	return f.dot;
}, true);

rt.type(1512, "/datum/effect_system/explosion", "/datum/effect_system", {});

// effects_explosion.dm:41
rt.def("/datum/effect_system/explosion/proc/set_up", function set_up(f: Frame, loca: Value) {
	if (isturf(loca)) {
		this.location = loca;
	} else {
		this.location = rt.getStep(f, loca, 0);
	}
	return f.dot;
});

// effects_explosion.dm:47
rt.def("/datum/effect_system/explosion/proc/start", function* start(f: Frame) {
	let _P: Value = null;
	yield* new_(T("/obj/effect/explosion"), this.location);
	yield* (_P = (yield* new_(T("/datum/effect_system/expl_particles")))).set_up(10, 0, this.location);
	yield* _P.start();
	return f.dot;
}, true);

rt.type(1513, "/datum/effect_system/explosion/smoke", "/datum/effect_system/explosion", {});

// effects_explosion.dm:55
rt.def("/datum/effect_system/explosion/smoke/proc/start", function* start(f: Frame) {
	let S: Value = null;
	yield* parent_proc();
	rt.spawnTail(f, 5, "/datum/effect_system/explosion/smoke/proc/start: spawn at game/objects/effects/effect_system/effects_explosion.dm:56", S);
	return f.dot;
}, true);

// a spawn(5) body of /datum/effect_system/explosion/smoke/proc/start, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/effect_system/explosion/smoke/proc/start: spawn at game/objects/effects/effect_system/effects_explosion.dm:56", function* (f: Frame, S: Value) {
	yield* (S = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(2, this.location);
	yield* S.start();
	return null;
});
