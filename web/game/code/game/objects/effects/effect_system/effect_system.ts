// From code/game/objects/effects/effect_system/effect_system.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11917, "/obj/effect/particle_effect", "/obj/effect", {
	pass_flags: 5,
	name: "particle effect",
	mouse_opacity: 0,
});

// /obj/effect/particle_effect/proc/New  (code/game/objects/effects/effect_system/effect_system.dm:15)  may sleep
rt.def("/obj/effect/particle_effect/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.gl("SSticker"))) return f.dot;
	yield* g.callName(f, rt.gl("cameranet"), "updateVisibility", [live(f.src)]);
	return f.dot;
}, true);

// /obj/effect/particle_effect/proc/Destroy  (code/game/objects/effects/effect_system/effect_system.dm:21)  may sleep
rt.def("/obj/effect/particle_effect/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSticker"))) {
		yield* g.callName(f, rt.gl("cameranet"), "updateVisibility", [live(f.src)]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
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

// /datum/effect_system/proc/Destroy  (code/game/objects/effects/effect_system/effect_system.dm:35)  may sleep
rt.def("/datum/effect_system/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "holder", null);
	rt.setSv(f, "location", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/effect_system/proc/set_up  (code/game/objects/effects/effect_system/effect_system.dm:38)
rt.def("/datum/effect_system/proc/set_up", function set_up(f: Frame, n: Value, c: Value, loca: Value) {
	f.vars = () => [n, c];
	if (live(n) === null) {
		n = 3;
	}
	if (live(c) === null) {
		c = 0;
	}
	if (rt.gt(live(n), 10)) {
		n = 10;
	}
	rt.setSv(f, "number", live(n));
	rt.setSv(f, "cardinals", live(c));
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(loca)]))) {
		rt.setSv(f, "location", live(loca));
	} else {
		rt.setSv(f, "location", rt.getStep(f, live(loca), 0));
	}
	return f.dot;
});

// /datum/effect_system/proc/attach  (code/game/objects/effects/effect_system/effect_system.dm:48)
rt.def("/datum/effect_system/proc/attach", function attach(f: Frame, atom: Value) {
	rt.setSv(f, "holder", live(atom));
	return f.dot;
});

// /datum/effect_system/proc/start  (code/game/objects/effects/effect_system/effect_system.dm:51)
rt.def("/datum/effect_system/proc/start", function start(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "number"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (rt.gt(rt.sv(f, "total_effects"), 20)) {
			return live(f.dot);
		}
		rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/datum/effect_system/proc/generate_effect")]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/effect_system/proc/generate_effect  (code/game/objects/effects/effect_system/effect_system.dm:58)  may sleep
rt.def("/datum/effect_system/proc/generate_effect", function* generate_effect(f: Frame) {
	let E: Value = null, direction: Value = null, steps_amt: Value = null, j: Value = null;
	let $e: any;
	f.vars = () => [E, direction, steps_amt, j, $e];
	if (truthy(rt.sv(f, "holder"))) {
		rt.setSv(f, "location", rt.getStep(f, rt.sv(f, "holder"), 0));
	}
	E = (yield* g.new_(f, rt.sv(f, "effect_type"), [rt.sv(f, "location")]));
	rt.incSrcVar(f, "total_effects", 1, true);
	direction = null;
	if (truthy(rt.sv(f, "cardinals"))) {
		direction = rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]);
	} else {
		direction = rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")]);
	}
	steps_amt = rt.op(f, "PickUnweighted", [3], [1, 2, 3]);
	j = null;
	rt.forRange(f, 0, 1, live(steps_amt), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		j = $e;
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		yield* g.call(f, P("/proc/step"), null, [live(E), live(direction)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/effect_system/proc/decrement_total_effect")])), 20]);
	return f.dot;
}, true);

// /datum/effect_system/proc/decrement_total_effect  (code/game/objects/effects/effect_system/effect_system.dm:73)
rt.def("/datum/effect_system/proc/decrement_total_effect", function decrement_total_effect(f: Frame) {
	rt.incSrcVar(f, "total_effects", -1, true);
	return f.dot;
});
