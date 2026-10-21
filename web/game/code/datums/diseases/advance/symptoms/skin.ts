// From code/datums/diseases/advance/symptoms/skin.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1010, "/datum/symptom/vitiligo", "/datum/symptom", {
	name: "Vitiligo",
	stealth: -3,
	resistance: -1,
	stage_speed: -1,
	transmittable: -2,
	level: 5,
	severity: 1,
});

// /datum/symptom/vitiligo/proc/Activate  (code/datums/diseases/advance/symptoms/skin.dm:28)  may sleep
rt.def("/datum/symptom/vitiligo/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null, H: Value = null;
	let $0: any;
	f.vars = () => [M, H, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		if (truthy((rt.istype((M = rt.fv(f, "affected_mob", live(f.args[0]))), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (isEqual(rt.gv(f, "skin_tone", (H = live(M))), "albino")) {
				return live(f.dot);
			}
			$0 = rt.fv(f, "stage", live(f.args[0]));
			if ($0 === 5) {
				rt.setFv(f, "skin_tone", live(H), "albino");
				yield* g.callName(f, live(H), "update_body", [0]);
			} else {
				yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀ looks a bit pale...</span>", [live(H)]), "<span class='notice'>Your skin suddenly appears lighter...</span>"]);
			}
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });

rt.type(1011, "/datum/symptom/revitiligo", "/datum/symptom", {
	name: "Revitiligo",
	stealth: -3,
	resistance: -1,
	stage_speed: -1,
	transmittable: -2,
	level: 5,
	severity: 1,
});

// /datum/symptom/revitiligo/proc/Activate  (code/datums/diseases/advance/symptoms/skin.dm:72)  may sleep
rt.def("/datum/symptom/revitiligo/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null, H: Value = null;
	let $0: any;
	f.vars = () => [M, H, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		if (truthy((rt.istype((M = rt.fv(f, "affected_mob", live(f.args[0]))), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (isEqual(rt.gv(f, "skin_tone", (H = live(M))), "african2")) {
				return live(f.dot);
			}
			$0 = rt.fv(f, "stage", live(f.args[0]));
			if ($0 === 5) {
				rt.setFv(f, "skin_tone", live(H), "african2");
				yield* g.callName(f, live(H), "update_body", [0]);
			} else {
				yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀ looks a bit dark...</span>", [live(H)]), "<span class='notice'>Your skin suddenly appears darker...</span>"]);
			}
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });
