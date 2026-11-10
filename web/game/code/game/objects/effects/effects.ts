// Based on /tg/station's code/game/objects/effects/effects.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(11207, "/obj/effect", "/obj", {
	icon: rt.rsc("icons/effects/effects.dmi"),
	resistance_flags: 115,
});

// effects.dm:33
rt.def("/obj/effect/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (target == this) {
		yield* qdel(this);
	} else if (severity === 1) {
		yield* qdel(this);
	} else if (severity === 2) {
		if (prob(60)) {
			yield* qdel(this);
		}
	} else if (severity === 3) {
		if (!prob(25)) return f.dot;
		yield* qdel(this);
	}
	return f.dot;
}, true, { waitfor: false });

// effects.dm:47
rt.def("/obj/effect/proc/singularity_act", function* singularity_act(f: Frame) {
	yield* qdel(this);
	return 0;
}, true);
