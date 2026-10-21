// From code/datums/diseases/advance/symptoms/youth.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1026, "/datum/symptom/youth", "/datum/symptom", {
	name: "Eternal Youth",
	stealth: 3,
	resistance: 4,
	stage_speed: 4,
	transmittable: -4,
	level: 5,
});

// /datum/symptom/youth/proc/Activate  (code/datums/diseases/advance/symptoms/youth.dm:28)
rt.def("/datum/symptom/youth/proc/Activate", function Activate(f: Frame) {
	let M: Value = null, H: Value = null;
	let $0: any;
	f.vars = () => [M, H, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [multiply(rt.gl("SYMPTOM_ACTIVATION_PROB"), 2)]))) {
		if (truthy((rt.istype((M = rt.fv(f, "affected_mob", live(f.args[0]))), T("/mob/living/carbon/human")) ? 1 : 0))) {
			H = live(M);
			$0 = rt.fv(f, "stage", live(f.args[0]));
			if ($0 === 1) {
				if (rt.gt(rt.fv(f, "age", live(H)), 41)) {
					rt.setFv(f, "age", live(H), 41);
					rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You haven't had this much energy in years!</span>"]);
				}
			} else if ($0 === 2) {
				if (rt.gt(rt.fv(f, "age", live(H)), 36)) {
					rt.setFv(f, "age", live(H), 36);
					rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You're suddenly in a good mood.</span>"]);
				}
			} else if ($0 === 3) {
				if (rt.gt(rt.fv(f, "age", live(H)), 31)) {
					rt.setFv(f, "age", live(H), 31);
					rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You begin to feel more lithe.</span>"]);
				}
			} else if ($0 === 4) {
				if (rt.gt(rt.fv(f, "age", live(H)), 26)) {
					rt.setFv(f, "age", live(H), 26);
					rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You feel reinvigorated.</span>"]);
				}
			} else if ($0 === 5) {
				if (rt.gt(rt.fv(f, "age", live(H)), 21)) {
					rt.setFv(f, "age", live(H), 21);
					rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You feel like you can take on the world!</span>"]);
				}
			}
		}
	}
	return live(f.dot);
}, false, { args: ["A"] });
