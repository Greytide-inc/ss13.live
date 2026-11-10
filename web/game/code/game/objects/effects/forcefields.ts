// Based on /tg/station's code/game/objects/effects/forcefields.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11812, "/obj/effect/forcefield/mime", "/obj/effect/forcefield", {
	timeleft: 300,
	icon_state: "empty",
	name: "invisible wall",
	desc: "You have a bad feeling about this.",
});

// forcefields.dm:25
rt.def("/obj/effect/forcefield/mime/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), this.timeleft, 8);
	return f.dot;
}, true);
