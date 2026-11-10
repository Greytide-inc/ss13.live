// Based on /tg/station's code/game/gamemodes/clock_cult/clock_effects/general_markers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11417, "/obj/effect/clockwork/general_marker", "/obj/effect/clockwork", {
	clockwork_desc: "One of Ratvar's generals.",
	name: "general marker",
	desc: "Some big guy. For you.",
	alpha: 200,
	layer: 11,
});

// general_markers.dm:10
rt.def("/obj/effect/clockwork/general_marker/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	rt.op(f, "Animate", [2, 6], [null, this, "alpha", 0, "time", 10]);
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 10, 8);
	return f.dot;
}, true);
