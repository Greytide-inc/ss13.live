// From code/datums/diseases/advance/symptoms/vision.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1016, "/datum/symptom/visionloss", "/datum/symptom", {
	name: "Hyphema",
	stealth: -1,
	resistance: -4,
	stage_speed: -4,
	transmittable: -3,
	level: 5,
	severity: 4,
});

// /datum/symptom/visionloss/proc/Activate  (code/datums/diseases/advance/symptoms/vision.dm:29)  may sleep
rt.def("/datum/symptom/visionloss/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null, eyes: Value = null;
	let $0: any;
	f.vars = () => [M, eyes, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) return f.dot;
	M = rt.fv(f, "affected_mob", live(f.args[0]));
	if (!truthy((eyes = (yield* g.callName(f, live(M), "getorganslot", ["eyes_sight"]))))) {
		return live(f.dot);
	}
	$0 = rt.fv(f, "stage", live(f.args[0]));
	if ($0 === 1 || $0 === 2) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>Your eyes itch.</span>"]);
	} else if ($0 === 3 || $0 === 4) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'><b>Your eyes burn!</b></span>"]);
		yield* g.callName(f, live(M), "blur_eyes", [10]);
		yield* g.callName(f, live(M), "adjust_eye_damage", [1]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>Your eyes burn horrificly!</span>"]);
		yield* g.callName(f, live(M), "blur_eyes", [20]);
		yield* g.callName(f, live(M), "adjust_eye_damage", [5]);
		if (rt.ge(rt.fv(f, "eye_damage", live(eyes)), 10)) {
			yield* g.callName(f, live(M), "become_nearsighted", []);
			if (truthy(rt.op(f, "Prob", [], [add(subtract(rt.fv(f, "eye_damage", live(eyes)), 10), 1)]))) {
				if (truthy((yield* g.callName(f, live(M), "become_blind", [])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>You go blind!</span>"]);
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["A"] });

rt.type(1017, "/datum/symptom/visionaid", "/datum/symptom", {
	name: "Ocular Restoration",
	stealth: -1,
	resistance: -3,
	stage_speed: -2,
	transmittable: -4,
	level: 4,
});

// /datum/symptom/visionaid/proc/Activate  (code/datums/diseases/advance/symptoms/vision.dm:80)  may sleep
rt.def("/datum/symptom/visionaid/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null, eyes: Value = null;
	let $0: any;
	f.vars = () => [M, eyes, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	M = rt.fv(f, "affected_mob", live(f.args[0]));
	if (!truthy((eyes = (yield* g.callName(f, live(M), "getorganslot", ["eyes_sight"]))))) {
		return live(f.dot);
	}
	$0 = rt.fv(f, "stage", live(f.args[0]));
	if ($0 === 4 || $0 === 5) {
		if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(M)), 1))) {
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>Your vision slowly returns...</span>"]);
				yield* g.callName(f, live(M), "cure_blind", []);
				yield* g.callName(f, live(M), "cure_nearsighted", []);
				yield* g.callName(f, live(M), "blur_eyes", [35]);
			} else {
				if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(M)), 8))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>The blackness in your peripheral vision fades.</span>"]);
					yield* g.callName(f, live(M), "cure_nearsighted", []);
					yield* g.callName(f, live(M), "blur_eyes", [10]);
				} else {
					if ((truthy(rt.fv(f, "eye_blind", live(M))) || truthy(rt.fv(f, "eye_blurry", live(M))))) {
						yield* g.callName(f, live(M), "set_blindness", [0]);
						yield* g.callName(f, live(M), "set_blurriness", [0]);
					} else {
						if (rt.gt(rt.fv(f, "eye_damage", live(eyes)), 0)) {
							yield* g.callName(f, live(M), "adjust_eye_damage", [-1]);
						}
					}
				}
			}
		}
	} else {
		if (truthy(rt.op(f, "Prob", [], [multiply(rt.gl("SYMPTOM_ACTIVATION_PROB"), 3)]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='notice'>＀</span>", [rt.op(f, "PickUnweighted", [3], ["Your eyes feel great.", "You are now blinking manually.", "You don't feel the need to blink."])])]);
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });
