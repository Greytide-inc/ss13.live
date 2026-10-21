// From code/game/objects/effects/effect_system/effects_water.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11934, "/obj/effect/particle_effect/water", "/obj/effect/particle_effect", {
	life: 15,
	name: "water",
	icon_state: "extinguish",
	mouse_opacity: 0,
});

// /obj/effect/particle_effect/water/proc/New  (code/game/objects/effects/effect_system/effects_water.dm:11)  may sleep
rt.def("/obj/effect/particle_effect/water/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 70, 8]);
	return f.dot;
}, true);

// /obj/effect/particle_effect/water/proc/Move  (code/game/objects/effects/effect_system/effects_water.dm:15)  may sleep
rt.def("/obj/effect/particle_effect/water/proc/Move", function* Move(f: Frame) {
	if (rt.lt(rt.incField(f, live(f.src), "life", -1, false), 1)) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 0;
	}
	if (truthy(rt.fv(f, "density", live(f.args[0])))) {
		return 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["newloc"] });

// /obj/effect/particle_effect/water/proc/Bump  (code/game/objects/effects/effect_system/effects_water.dm:24)  may sleep
rt.def("/obj/effect/particle_effect/water/proc/Bump", function* Bump(f: Frame) {
	if (truthy(rt.sv(f, "reagents"))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(f.args[0])]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["A"] });

rt.type(11935, "/obj/effect/particle_effect/steam", "/obj/effect/particle_effect", {
	name: "steam",
	icon_state: "extinguish",
	density: 0,
});

// /obj/effect/particle_effect/steam/proc/New  (code/game/objects/effects/effect_system/effects_water.dm:49)  may sleep
rt.def("/obj/effect/particle_effect/steam/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 20, 8]);
	return f.dot;
}, true);
