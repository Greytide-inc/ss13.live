// From code/datums/diseases/advance/symptoms/voice_change.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1018, "/datum/symptom/voice_change", "/datum/symptom", {
	name: "Voice Change",
	stealth: -2,
	resistance: -3,
	stage_speed: -3,
	transmittable: -1,
	level: 6,
	severity: 2,
});

// /datum/symptom/voice_change/proc/Activate  (code/datums/diseases/advance/symptoms/voice_change.dm:29)
rt.def("/datum/symptom/voice_change/proc/Activate", function Activate(f: Frame) {
	let M: Value = null, H: Value = null;
	let $0: any;
	f.vars = () => [M, H, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 1 || $0 === 2 || $0 === 3 || $0 === 4) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["Your throat hurts.", "You clear your throat."])])]);
		} else {
			if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
				rt.callName(f, (H = live(M)), "SetSpecialVoice", [rt.callName(f, rt.gv(f, "species", rt.fv(f, "dna", live(H))), "random_name", [rt.fv(f, "gender", live(H))])]);
			}
		}
	}
	return live(f.dot);
}, false, { args: ["A"] });

// /datum/symptom/voice_change/proc/End  (code/datums/diseases/advance/symptoms/voice_change.dm:44)
rt.def("/datum/symptom/voice_change/proc/End", function End(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(rt.fv(f, "affected_mob", live(f.args[0])), T("/mob/living/carbon/human")) ? 1 : 0))) {
		rt.callName(f, (H = rt.fv(f, "affected_mob", live(f.args[0]))), "UnsetSpecialVoice", []);
	}
	return live(f.dot);
}, false, { args: ["A"] });
