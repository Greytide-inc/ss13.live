// From code/datums/diseases/advance/symptoms/beard.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(982, "/datum/symptom/beard", "/datum/symptom", {
	name: "Facial Hypertrichosis",
	stealth: -3,
	resistance: -1,
	stage_speed: -3,
	transmittable: -1,
	level: 4,
	severity: 1,
});

// /datum/symptom/beard/proc/Activate  (code/datums/diseases/advance/symptoms/beard.dm:28)  may sleep
rt.def("/datum/symptom/beard/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null, H: Value = null;
	let $0: any;
	f.vars = () => [M, H, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		if (truthy((rt.istype((M = rt.fv(f, "affected_mob", live(f.args[0]))), T("/mob/living/carbon/human")) ? 1 : 0))) {
			H = live(M);
			$0 = rt.fv(f, "stage", live(f.args[0]));
			if ($0 === 1 || $0 === 2) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>Your chin itches.</span>"]);
				if (isEqual(rt.fv(f, "facial_hair_style", live(H)), "Shaved")) {
					rt.setFv(f, "facial_hair_style", live(H), "Jensen Beard");
					yield* g.callName(f, live(H), "update_hair", []);
				}
			} else if ($0 === 3 || $0 === 4) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>You feel tough.</span>"]);
				if (((!isEqual(rt.fv(f, "facial_hair_style", live(H)), "Dwarf Beard") && !isEqual(rt.fv(f, "facial_hair_style", live(H)), "Very Long Beard")) && !isEqual(rt.fv(f, "facial_hair_style", live(H)), "Full Beard"))) {
					rt.setFv(f, "facial_hair_style", live(H), "Full Beard");
					yield* g.callName(f, live(H), "update_hair", []);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>You feel manly!</span>"]);
				if ((!isEqual(rt.fv(f, "facial_hair_style", live(H)), "Dwarf Beard") && !isEqual(rt.fv(f, "facial_hair_style", live(H)), "Very Long Beard"))) {
					rt.setFv(f, "facial_hair_style", live(H), rt.op(f, "PickUnweighted", [2], ["Dwarf Beard", "Very Long Beard"]));
					yield* g.callName(f, live(H), "update_hair", []);
				}
			}
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });
