// From code/datums/diseases/advance/symptoms/flesh_eating.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(992, "/datum/symptom/flesh_eating", "/datum/symptom", {
	name: "Necrotizing Fasciitis",
	stealth: -3,
	resistance: -4,
	stage_speed: 0,
	transmittable: -4,
	level: 6,
	severity: 5,
});

// /datum/symptom/flesh_eating/proc/Activate  (code/datums/diseases/advance/symptoms/flesh_eating.dm:29)  may sleep
rt.def("/datum/symptom/flesh_eating/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 2 || $0 === 3) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You feel a sudden pain across your body.", "Drops of blood appear suddenly on your skin."])])]);
		} else if ($0 === 4 || $0 === 5) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>＀</span>", [rt.op(f, "PickUnweighted", [3], ["You cringe as a violent pain takes over your body.", "It feels like your body is eating itself inside out.", "IT HURTS."])])]);
			yield* g.srcCall(f, "Flesheat", live(M), live(f.args[0]));
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });

// /datum/symptom/flesh_eating/proc/Flesheat  (code/datums/diseases/advance/symptoms/flesh_eating.dm:41)  may sleep
rt.def("/datum/symptom/flesh_eating/proc/Flesheat", function* Flesheat(f: Frame, M: Value, A: Value) {
	let get_damage: Value = null;
	f.vars = () => [M, A, get_damage];
	get_damage = multiply(rt.op(f, "Sqrt", [], [subtract(16, (yield* g.callName(f, live(A), "totalStealth", [])))]), 5);
	yield* g.callName(f, live(M), "adjustBruteLoss", [live(get_damage)]);
	return 1;
}, true);

rt.type(993, "/datum/symptom/flesh_death", "/datum/symptom", {
	name: "Autophagocytosis Necrosis",
	stealth: -2,
	resistance: -2,
	stage_speed: 1,
	transmittable: -2,
	level: 7,
	severity: 6,
});

// /datum/symptom/flesh_death/proc/Activate  (code/datums/diseases/advance/symptoms/flesh_eating.dm:73)  may sleep
rt.def("/datum/symptom/flesh_death/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 2 || $0 === 3) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You feel your body break apart.", "Your skin rubs off like dust."])])]);
		} else if ($0 === 4 || $0 === 5) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>＀</span>", [rt.op(f, "PickUnweighted", [3], ["You feel your muscles weakening.", "Your skin begins detaching itself.", "You feel sandy."])])]);
			yield* g.srcCall(f, "Flesh_death", live(M), live(f.args[0]));
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });

// /datum/symptom/flesh_death/proc/Flesh_death  (code/datums/diseases/advance/symptoms/flesh_eating.dm:85)  may sleep
rt.def("/datum/symptom/flesh_death/proc/Flesh_death", function* Flesh_death(f: Frame, M: Value, A: Value) {
	let get_damage: Value = null;
	f.vars = () => [M, A, get_damage];
	get_damage = multiply(rt.op(f, "Sqrt", [], [subtract(16, (yield* g.callName(f, live(A), "totalStealth", [])))]), 6);
	yield* g.callName(f, live(M), "adjustBruteLoss", [live(get_damage)]);
	yield* g.callName(f, rt.fv(f, "reagents", live(M)), "add_reagent_list", [rt.alist(f, ["heparin", 5, "lipolicide", 5])]);
	return 1;
}, true);
