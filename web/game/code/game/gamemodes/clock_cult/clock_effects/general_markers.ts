// From code/game/gamemodes/clock_cult/clock_effects/general_markers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11417, "/obj/effect/clockwork/general_marker", "/obj/effect/clockwork", {
	clockwork_desc: "One of Ratvar's generals.",
	name: "general marker",
	desc: "Some big guy. For you.",
	alpha: 200,
	layer: 11,
});

// /obj/effect/clockwork/general_marker/proc/New  (code/game/gamemodes/clock_cult/clock_effects/general_markers.dm:10)  may sleep
rt.def("/obj/effect/clockwork/general_marker/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "alpha", 0, "time", 10]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 10, 8]);
	return f.dot;
}, true);
