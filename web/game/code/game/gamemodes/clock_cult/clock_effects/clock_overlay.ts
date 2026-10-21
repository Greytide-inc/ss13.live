// From code/game/gamemodes/clock_cult/clock_effects/clock_overlay.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11406, "/obj/effect/clockwork/overlay", "/obj/effect/clockwork", {
	linked: null,
	mouse_opacity: 0,
});

// /obj/effect/clockwork/overlay/proc/examine  (code/game/gamemodes/clock_cult/clock_effects/clock_overlay.dm:8)  may sleep
rt.def("/obj/effect/clockwork/overlay/proc/examine", function* examine(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "linked"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "linked"), "examine", [live(user)]);
	return f.dot;
}, true);

// /obj/effect/clockwork/overlay/proc/Destroy  (code/game/gamemodes/clock_cult/clock_effects/clock_overlay.dm:19)  may sleep
rt.def("/obj/effect/clockwork/overlay/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "linked"))) {
		rt.setSv(f, "linked", null);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/effect/clockwork/overlay/wall/proc/<init>  (code/game/gamemodes/clock_cult/clock_effects/clock_overlay.dm:25)
rt.def("/obj/effect/clockwork/overlay/wall/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/effect/clockwork/overlay/wall"), T("/obj/structure/falsewall/brass")));
	return f.dot;
});

// /obj/effect/clockwork/overlay/wall/proc/Initialize  (code/game/gamemodes/clock_cult/clock_effects/clock_overlay.dm:30)  may sleep
rt.def("/obj/effect/clockwork/overlay/wall/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/queue_smooth_neighbors"), null, [live(f.src)]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/queue_smooth"), live(f.src)])), 1]);
	return f.dot;
}, true);

// /obj/effect/clockwork/overlay/wall/proc/Destroy  (code/game/gamemodes/clock_cult/clock_effects/clock_overlay.dm:35)  may sleep
rt.def("/obj/effect/clockwork/overlay/wall/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/queue_smooth_neighbors"), null, [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
