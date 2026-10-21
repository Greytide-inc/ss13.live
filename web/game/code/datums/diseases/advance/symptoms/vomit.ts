// From code/datums/diseases/advance/symptoms/vomit.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1019, "/datum/symptom/vomit", "/datum/symptom", {
	name: "Vomiting",
	stealth: -2,
	resistance: -1,
	stage_speed: 0,
	transmittable: 1,
	level: 3,
	severity: 4,
});

// /datum/symptom/vomit/proc/Activate  (code/datums/diseases/advance/symptoms/vomit.dm:33)  may sleep
rt.def("/datum/symptom/vomit/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [divide(rt.gl("SYMPTOM_ACTIVATION_PROB"), 2)]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 1 || $0 === 2 || $0 === 3 || $0 === 4) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You feel nauseous.", "You feel like you're going to throw up!"])])]);
		} else {
			yield* g.srcCall(f, "Vomit", live(M));
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });

// /datum/symptom/vomit/proc/Vomit  (code/datums/diseases/advance/symptoms/vomit.dm:45)  may sleep
rt.def("/datum/symptom/vomit/proc/Vomit", function* Vomit(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "vomit", [20]);
	return f.dot;
}, true);

rt.type(1020, "/datum/symptom/vomit/blood", "/datum/symptom/vomit", {
	name: "Blood Vomiting",
	stealth: -2,
	resistance: -1,
	stage_speed: -1,
	transmittable: 1,
	level: 4,
	severity: 5,
});

// /datum/symptom/vomit/blood/proc/Vomit  (code/datums/diseases/advance/symptoms/vomit.dm:78)  may sleep
rt.def("/datum/symptom/vomit/blood/proc/Vomit", function* Vomit(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "vomit", [0, 1]);
	return f.dot;
}, true);

rt.type(1021, "/datum/symptom/vomit/projectile", "/datum/symptom/vomit", {
	name: "Projectile Vomiting",
	stealth: -2,
	level: 4,
});

// /datum/symptom/vomit/projectile/proc/Vomit  (code/datums/diseases/advance/symptoms/vomit.dm:106)  may sleep
rt.def("/datum/symptom/vomit/projectile/proc/Vomit", function* Vomit(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "vomit", [null, 6, "distance", 5], rt.Args.Named);
	return f.dot;
}, true);
