// Based on /tg/station's code/game/objects/effects/effect_system/effects_sparks.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// effects_sparks.dm:13
rt.def("/proc/do_sparks", function* do_sparks(f: Frame, n: Value, c: Value, source: Value) {
	let sparks: Value = null;
	yield* (sparks = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(n, c, source);
	yield* sparks.start();
	yield* qdel(sparks);
	return f.dot;
}, true);

rt.type(11932, "/obj/effect/particle_effect/sparks", "/obj/effect/particle_effect", {
	anchored: 1,
	light_range: 1,
	name: "sparks",
	icon_state: "sparks",
});

// effects_sparks.dm:26
rt.def("/obj/effect/particle_effect/sparks/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	yield* parent_proc();
	flick("sparks", this);
	playsound(this.loc, "sparks", 100, 1);
	if (isturf((_T = this.loc))) {
		yield* _T.hotspot_expose(1000, 100);
	}
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 20, 8);
	return f.dot;
}, true);

// effects_sparks.dm:35
rt.def("/obj/effect/particle_effect/sparks/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	if (isturf((_T = this.loc))) {
		yield* _T.hotspot_expose(1000, 100);
	}
	return (yield* parent_proc());
}, true);

// effects_sparks.dm:41
rt.def("/obj/effect/particle_effect/sparks/proc/Move", function* Move(f: Frame) {
	let _T: Value = null;
	yield* parent_proc();
	if (!isturf((_T = this.loc))) return f.dot;
	yield* _T.hotspot_expose(1000, 100);
	return f.dot;
}, true);
