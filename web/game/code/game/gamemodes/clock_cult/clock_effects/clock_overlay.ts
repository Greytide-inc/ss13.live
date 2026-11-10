// Based on /tg/station's code/game/gamemodes/clock_cult/clock_effects/clock_overlay.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11406, "/obj/effect/clockwork/overlay", "/obj/effect/clockwork", {
	linked: null,
	mouse_opacity: 0,
});

// clock_overlay.dm:8
rt.def("/obj/effect/clockwork/overlay/proc/examine", function* examine(f: Frame, user: Value) {
	if (!this.linked) return f.dot;
	yield* this.linked.examine(user);
	return f.dot;
}, true);

// clock_overlay.dm:19
rt.def("/obj/effect/clockwork/overlay/proc/Destroy", function* Destroy(f: Frame) {
	if (this.linked) {
		this.linked = null;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(11407, "/obj/effect/clockwork/overlay/wall", "/obj/effect/clockwork/overlay", {
	smooth: 1,
	name: "clockwork wall",
	icon: rt.rsc("icons/turf/walls/clockwork_wall.dmi"),
	icon_state: "clockwork_wall",
	canSmoothWith: null,
	layer: 2.05,
});

// clock_overlay.dm:25
rt.def("/obj/effect/clockwork/overlay/wall/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/effect/clockwork/overlay/wall"), T("/obj/structure/falsewall/brass"));
	return f.dot;
});

// clock_overlay.dm:30
rt.def("/obj/effect/clockwork/overlay/wall/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	queue_smooth_neighbors(this);
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/queue_smooth"), this)), 1);
	return f.dot;
}, true);

// clock_overlay.dm:35
rt.def("/obj/effect/clockwork/overlay/wall/proc/Destroy", function* Destroy(f: Frame) {
	queue_smooth_neighbors(this);
	return (yield* parent_proc());
}, true);
