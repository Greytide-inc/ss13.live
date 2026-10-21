// From code/game/objects/effects/effect_system/effects_explosion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11918, "/obj/effect/particle_effect/expl_particles", "/obj/effect/particle_effect", {
	anchored: 1,
	name: "fire",
	icon_state: "explosion_particle",
	opacity: 1,
});

// /obj/effect/particle_effect/expl_particles/proc/New  (code/game/objects/effects/effect_system/effects_explosion.dm:8)  may sleep
rt.def("/obj/effect/particle_effect/expl_particles/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 15, 8]);
	return f.dot;
}, true);

rt.type(1511, "/datum/effect_system/expl_particles", "/datum/effect_system", {
	number: 10,
});

// /datum/effect_system/expl_particles/proc/start  (code/game/objects/effects/effect_system/effects_explosion.dm:15)
rt.def("/datum/effect_system/expl_particles/proc/start", function start(f: Frame) {
	let i: Value = null, expl: Value = null, direct: Value = null, steps_amt: Value = null, j: Value = null;
	let $e: any;
	f.vars = () => [i, expl, direct, steps_amt, j, $e];
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "number"), 1);
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
	f.vars = () => [i, expl, direct, steps_amt, j, $e];
	expl = (yield* g.new_(f, T("/obj/effect/particle_effect/expl_particles"), [rt.sv(f, "location")]));
	direct = rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")]);
	steps_amt = rt.op(f, "PickWeighted", [4], [1, 25, 2, 50, 100, 3, 4, 200]);
	j = null;
	rt.forRange(f, 1, 1, live(steps_amt), 1);
	while (($e = rt.next(f, 1)) !== undefined) {
		j = $e;
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		yield* g.call(f, P("/proc/step"), null, [live(expl), live(direct)]);
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

// /obj/effect/explosion/proc/New  (code/game/objects/effects/effect_system/effects_explosion.dm:35)  may sleep
rt.def("/obj/effect/explosion/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 10, 8]);
	return f.dot;
}, true);

rt.type(1512, "/datum/effect_system/explosion", "/datum/effect_system", {});

// /datum/effect_system/explosion/proc/set_up  (code/game/objects/effects/effect_system/effects_explosion.dm:41)
rt.def("/datum/effect_system/explosion/proc/set_up", function set_up(f: Frame, loca: Value) {
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(loca)]))) {
		rt.setSv(f, "location", live(loca));
	} else {
		rt.setSv(f, "location", rt.getStep(f, live(loca), 0));
	}
	return f.dot;
});

// /datum/effect_system/explosion/proc/start  (code/game/objects/effects/effect_system/effects_explosion.dm:47)  may sleep
rt.def("/datum/effect_system/explosion/proc/start", function* start(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	yield* g.new_(f, T("/obj/effect/explosion"), [rt.sv(f, "location")]);
	yield* g.callName(f, (_P = (yield* g.new_(f, T("/datum/effect_system/expl_particles"), []))), "set_up", [10, 0, rt.sv(f, "location")]);
	yield* g.callName(f, live(_P), "start", []);
	return f.dot;
}, true);

rt.type(1513, "/datum/effect_system/explosion/smoke", "/datum/effect_system/explosion", {});

// /datum/effect_system/explosion/smoke/proc/start  (code/game/objects/effects/effect_system/effects_explosion.dm:55)  may sleep
rt.def("/datum/effect_system/explosion/smoke/proc/start", function* start(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.spawnTail(f, 5, "/datum/effect_system/explosion/smoke/proc/start: spawn at game/objects/effects/effect_system/effects_explosion.dm:56", S);
	return f.dot;
}, true);

// a spawn(5) body of /datum/effect_system/explosion/smoke/proc/start, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/effect_system/explosion/smoke/proc/start: spawn at game/objects/effects/effect_system/effects_explosion.dm:56", function* (f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.callName(f, (S = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [2, rt.sv(f, "location")]);
	yield* g.callName(f, live(S), "start", []);
	return null;
});
