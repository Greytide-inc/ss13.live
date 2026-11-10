// Based on /tg/station's code/game/objects/effects/effect_system/effects_water.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11934, "/obj/effect/particle_effect/water", "/obj/effect/particle_effect", {
	life: 15,
	name: "water",
	icon_state: "extinguish",
	mouse_opacity: 0,
});

// effects_water.dm:11
rt.def("/obj/effect/particle_effect/water/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 70, 8);
	return f.dot;
}, true);

// effects_water.dm:15
rt.def("/obj/effect/particle_effect/water/proc/Move", function* Move(f: Frame, newloc: Value) {
	if (rt.incField(f, this, "life", -1, false) < 1) {
		yield* qdel(this);
		return 0;
	}
	if (newloc.density) {
		return 0;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// effects_water.dm:24
rt.def("/obj/effect/particle_effect/water/proc/Bump", function* Bump(f: Frame, A: Value) {
	if (this.reagents) {
		yield* this.reagents.reaction(A);
	}
	return (yield* parent_proc());
}, true);

rt.type(11935, "/obj/effect/particle_effect/steam", "/obj/effect/particle_effect", {
	name: "steam",
	icon_state: "extinguish",
	density: 0,
});

// effects_water.dm:49
rt.def("/obj/effect/particle_effect/steam/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 20, 8);
	return f.dot;
}, true);
