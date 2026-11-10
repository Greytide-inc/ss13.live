// Based on /tg/station's code/game/objects/effects/overlays.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11776, "/obj/effect/overlay/beam", "/obj/effect/overlay", {
	BeamSource: null,
	name: "beam",
	icon: rt.rsc("icons/effects/beam.dmi"),
	icon_state: "b_beam",
});

// overlays.dm:18
rt.def("/obj/effect/overlay/beam/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 10, 8);
	return f.dot;
}, true);
