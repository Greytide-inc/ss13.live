// From code/game/objects/effects/forcefields.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11812, "/obj/effect/forcefield/mime", "/obj/effect/forcefield", {
	timeleft: 300,
	icon_state: "empty",
	name: "invisible wall",
	desc: "You have a bad feeling about this.",
});

// /obj/effect/forcefield/mime/proc/New  (code/game/objects/effects/forcefields.dm:25)  may sleep
rt.def("/obj/effect/forcefield/mime/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), rt.sv(f, "timeleft"), 8]);
	return f.dot;
}, true);
