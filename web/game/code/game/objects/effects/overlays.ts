// From code/game/objects/effects/overlays.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11776, "/obj/effect/overlay/beam", "/obj/effect/overlay", {
	BeamSource: null,
	name: "beam",
	icon: rt.rsc("icons/effects/beam.dmi"),
	icon_state: "b_beam",
});

// /obj/effect/overlay/beam/proc/New  (code/game/objects/effects/overlays.dm:18)  may sleep
rt.def("/obj/effect/overlay/beam/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 10, 8]);
	return f.dot;
}, true);
