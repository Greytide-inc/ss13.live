// Based on /tg/station's code/datums/diseases/advance/symptoms/sneeze.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1012, "/datum/symptom/sneeze", "/datum/symptom", {
	name: "Sneezing",
	stealth: -2,
	resistance: 3,
	stage_speed: 0,
	transmittable: 4,
	level: 1,
	severity: 1,
});

// sneeze.dm:30
rt.def("/datum/symptom/sneeze/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 1 || A.stage === 2 || A.stage === 3) {
			yield* M.emote("sniff");
		} else {
			yield* M.emote("sneeze");
			yield* A.spread(A.holder, 5);
		}
	}
	return f.dot;
}, true);
