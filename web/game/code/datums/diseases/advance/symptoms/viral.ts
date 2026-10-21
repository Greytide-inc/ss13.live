// From code/datums/diseases/advance/symptoms/viral.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1013, "/datum/symptom/viraladaptation", "/datum/symptom", {
	name: "Viral self-adaptation",
	stealth: 3,
	resistance: 5,
	stage_speed: -3,
	transmittable: 0,
	level: 3,
});

// /datum/symptom/viraladaptation/proc/Activate  (code/datums/diseases/advance/symptoms/viral.dm:25)
rt.def("/datum/symptom/viraladaptation/proc/Activate", function Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) return f.dot;
	M = rt.fv(f, "affected_mob", live(f.args[0]));
	$0 = rt.fv(f, "stage", live(f.args[0]));
	if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>You feel off, but no different from before.</span>"]);
	} else if ($0 === 5) {
		rt.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>You feel better, but nothing interesting happens.</span>"]);
	}
	return f.dot;
}, false, { args: ["A"] });

// /datum/symptom/viraladaptation/proc/Activate  (code/datums/diseases/advance/symptoms/viral.dm:58)
rt.def("/datum/symptom/viraladaptation/proc/Activate", function Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) return f.dot;
	M = rt.fv(f, "affected_mob", live(f.args[0]));
	$0 = rt.fv(f, "stage", live(f.args[0]));
	if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>You feel better, but no different from before.</span>"]);
	} else if ($0 === 5) {
		rt.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>You feel off, but nothing interesting happens.</span>"]);
	}
	return f.dot;
}, false, { args: ["A"] });

rt.type(1015, "/datum/symptom/viralreverse", "/datum/symptom", {
	name: "Viral aggressive metabolism",
	stealth: 0,
	resistance: 1,
	stage_speed: -2,
	transmittable: 3,
	level: 3,
});

// /datum/symptom/viralreverse/proc/Activate  (code/datums/diseases/advance/symptoms/viral.dm:95)  may sleep
rt.def("/datum/symptom/viralreverse/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		yield* g.srcCall(f, "Heal", (M = rt.fv(f, "affected_mob", live(f.args[0]))), live(f.args[0]));
	}
	return live(f.dot);
}, true, { args: ["A"] });

// /datum/symptom/viralreverse/proc/Heal  (code/datums/diseases/advance/symptoms/viral.dm:102)  may sleep
rt.def("/datum/symptom/viralreverse/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	f.vars = () => [M, A];
	(rt.modField(f, live(A), "stage", 1, subtract));
	if (!rt.lt(rt.fv(f, "stage", live(A)), 2)) return f.dot;
	yield* g.callName(f, live(A), "cure", []);
	return f.dot;
}, true);

// /datum/symptom/viralreverse/proc/Start  (code/datums/diseases/advance/symptoms/viral.dm:107)
rt.def("/datum/symptom/viralreverse/proc/Start", function Start(f: Frame, A: Value) {
	rt.setFv(f, "stage", live(A), 5);
	return f.dot;
});
