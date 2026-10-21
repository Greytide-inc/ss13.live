// From code/game/objects/effects/effects.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11207, "/obj/effect", "/obj", {
	icon: rt.rsc("icons/effects/effects.dmi"),
	resistance_flags: 115,
});

// /obj/effect/proc/ex_act  (code/game/objects/effects/effects.dm:33)  may sleep
rt.def("/obj/effect/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let $0: any;
	f.vars = () => [severity, target, $0];
	if (isEqual(live(target), live(f.src))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		$0 = live(severity);
		if ($0 === 1) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else if ($0 === 2) {
			if (truthy(rt.op(f, "Prob", [], [60]))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		} else if ($0 === 3) {
			if (!truthy(rt.op(f, "Prob", [], [25]))) return f.dot;
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/proc/singularity_act  (code/game/objects/effects/effects.dm:47)  may sleep
rt.def("/obj/effect/proc/singularity_act", function* singularity_act(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return 0;
}, true);
