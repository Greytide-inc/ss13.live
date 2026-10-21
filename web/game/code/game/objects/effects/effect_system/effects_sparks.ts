// From code/game/objects/effects/effect_system/effects_sparks.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/do_sparks  (code/game/objects/effects/effect_system/effects_sparks.dm:13)  may sleep
rt.def("/proc/do_sparks", function* do_sparks(f: Frame, n: Value, c: Value, source: Value) {
	let sparks: Value = null;
	f.vars = () => [n, c, source, sparks];
	yield* g.callName(f, (sparks = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [live(n), live(c), live(source)]);
	yield* g.callName(f, live(sparks), "start", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(sparks)]);
	return f.dot;
}, true);

rt.type(11932, "/obj/effect/particle_effect/sparks", "/obj/effect/particle_effect", {
	anchored: 1,
	light_range: 1,
	name: "sparks",
	icon_state: "sparks",
});

// /obj/effect/particle_effect/sparks/proc/New  (code/game/objects/effects/effect_system/effects_sparks.dm:26)  may sleep
rt.def("/obj/effect/particle_effect/sparks/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/flick"), null, ["sparks", live(f.src)]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "sparks", 100, 1]);
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.sv(f, "loc"))])))) {
		yield* g.callName(f, live(_T), "hotspot_expose", [1000, 100]);
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 20, 8]);
	return f.dot;
}, true);

// /obj/effect/particle_effect/sparks/proc/Destroy  (code/game/objects/effects/effect_system/effects_sparks.dm:35)  may sleep
rt.def("/obj/effect/particle_effect/sparks/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.sv(f, "loc"))])))) {
		yield* g.callName(f, live(_T), "hotspot_expose", [1000, 100]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/particle_effect/sparks/proc/Move  (code/game/objects/effects/effect_system/effects_sparks.dm:41)  may sleep
rt.def("/obj/effect/particle_effect/sparks/proc/Move", function* Move(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.sv(f, "loc"))])))) return f.dot;
	yield* g.callName(f, live(_T), "hotspot_expose", [1000, 100]);
	return f.dot;
}, true);
