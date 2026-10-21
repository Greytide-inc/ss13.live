// From code/datums/diseases/advance/symptoms/choking.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(983, "/datum/symptom/choking", "/datum/symptom", {
	name: "Choking",
	stealth: -3,
	resistance: -2,
	stage_speed: -2,
	transmittable: -4,
	level: 3,
	severity: 3,
});

// /datum/symptom/choking/proc/Activate  (code/datums/diseases/advance/symptoms/choking.dm:29)  may sleep
rt.def("/datum/symptom/choking/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 1 || $0 === 2) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You're having difficulty breathing.", "Your breathing becomes heavy."])])]);
		} else if ($0 === 3 || $0 === 4) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'><b>＀</span>", [rt.op(f, "PickUnweighted", [2], ["Your windpipe feels like a straw.", "Your breathing becomes tremendously difficult."])])]);
			yield* g.srcCall(f, "Choke_stage_3_4", live(M), live(f.args[0]));
			yield* g.callName(f, live(M), "emote", ["gasp"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You're choking!", "You can't breathe!"])])]);
			yield* g.srcCall(f, "Choke", live(M), live(f.args[0]));
			yield* g.callName(f, live(M), "emote", ["gasp"]);
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });

// /datum/symptom/choking/proc/Choke_stage_3_4  (code/datums/diseases/advance/symptoms/choking.dm:46)  may sleep
rt.def("/datum/symptom/choking/proc/Choke_stage_3_4", function* Choke_stage_3_4(f: Frame, M: Value, A: Value) {
	let get_damage: Value = null;
	f.vars = () => [M, A, get_damage];
	get_damage = add(rt.op(f, "Sqrt", [], [add(21, multiply((yield* g.callName(f, live(A), "totalStageSpeed", [])), 0.5))]), rt.op(f, "Sqrt", [], [(yield* g.call(f, P("/proc/max"), null, [add(16, (yield* g.callName(f, live(A), "totalStealth", []))), 0]))]));
	yield* g.callName(f, live(M), "adjustOxyLoss", [live(get_damage)]);
	return 1;
}, true);

// /datum/symptom/choking/proc/Choke  (code/datums/diseases/advance/symptoms/choking.dm:51)  may sleep
rt.def("/datum/symptom/choking/proc/Choke", function* Choke(f: Frame, M: Value, A: Value) {
	let get_damage: Value = null;
	f.vars = () => [M, A, get_damage];
	get_damage = add(rt.op(f, "Sqrt", [], [add(21, multiply((yield* g.callName(f, live(A), "totalStageSpeed", [])), 0.5))]), rt.op(f, "Sqrt", [], [(yield* g.call(f, P("/proc/max"), null, [add(16, multiply((yield* g.callName(f, live(A), "totalStealth", [])), 5)), 0]))]));
	yield* g.callName(f, live(M), "adjustOxyLoss", [live(get_damage)]);
	return 1;
}, true);

rt.type(984, "/datum/symptom/asphyxiation", "/datum/symptom", {
	name: "Acute respiratory distress syndrome",
	stealth: -2,
	resistance: 0,
	stage_speed: -1,
	transmittable: -2,
	level: 7,
	severity: 3,
});

// /datum/symptom/asphyxiation/proc/Activate  (code/datums/diseases/advance/symptoms/choking.dm:83)  may sleep
rt.def("/datum/symptom/asphyxiation/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 3 || $0 === 4) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'><b>＀</span>", [rt.op(f, "PickUnweighted", [2], ["Your windpipe feels thin.", "Your lungs feel small."])])]);
			yield* g.srcCall(f, "Asphyxiate_stage_3_4", live(M), live(f.args[0]));
			yield* g.callName(f, live(M), "emote", ["gasp"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["Your lungs hurt!", "It hurts to breathe!"])])]);
			yield* g.srcCall(f, "Asphyxiate", live(M), live(f.args[0]));
			yield* g.callName(f, live(M), "emote", ["gasp"]);
			if (rt.ge((yield* g.callName(f, live(M), "getOxyLoss", [])), 120)) {
				yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ stops breathing, as if their lungs have totally collapsed!</span>", [live(M)])]);
				yield* g.srcCall(f, "Asphyxiate_death", live(M), live(f.args[0]));
			}
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });

// /datum/symptom/asphyxiation/proc/Asphyxiate_stage_3_4  (code/datums/diseases/advance/symptoms/choking.dm:101)  may sleep
rt.def("/datum/symptom/asphyxiation/proc/Asphyxiate_stage_3_4", function* Asphyxiate_stage_3_4(f: Frame, M: Value, A: Value) {
	let get_damage: Value = null;
	f.vars = () => [M, A, get_damage];
	get_damage = add(rt.op(f, "Sqrt", [], [rt.op(f, "Abs", [], [add(21, multiply((yield* g.callName(f, live(A), "totalStageSpeed", [])), 0.699999988079071))])]), rt.op(f, "Sqrt", [], [rt.op(f, "Abs", [], [add(16, (yield* g.callName(f, live(A), "totalStealth", [])))])]));
	yield* g.callName(f, live(M), "adjustOxyLoss", [live(get_damage)]);
	return 1;
}, true);

// /datum/symptom/asphyxiation/proc/Asphyxiate  (code/datums/diseases/advance/symptoms/choking.dm:106)  may sleep
rt.def("/datum/symptom/asphyxiation/proc/Asphyxiate", function* Asphyxiate(f: Frame, M: Value, A: Value) {
	let get_damage: Value = null;
	f.vars = () => [M, A, get_damage];
	get_damage = add(rt.op(f, "Sqrt", [], [rt.op(f, "Abs", [], [add(21, (yield* g.callName(f, live(A), "totalStageSpeed", [])))])]), rt.op(f, "Sqrt", [], [rt.op(f, "Abs", [], [add(16, multiply((yield* g.callName(f, live(A), "totalStealth", [])), 5))])]));
	yield* g.callName(f, live(M), "adjustOxyLoss", [live(get_damage)]);
	yield* g.callName(f, rt.fv(f, "reagents", live(M)), "add_reagent_list", [rt.alist(f, ["pancuronium", 2, "sodium_thiopental", 2])]);
	return 1;
}, true);

// /datum/symptom/asphyxiation/proc/Asphyxiate_death  (code/datums/diseases/advance/symptoms/choking.dm:112)  may sleep
rt.def("/datum/symptom/asphyxiation/proc/Asphyxiate_death", function* Asphyxiate_death(f: Frame, M: Value, A: Value) {
	let get_damage: Value = null;
	f.vars = () => [M, A, get_damage];
	get_damage = add(rt.op(f, "Sqrt", [], [rt.op(f, "Abs", [], [add(21, multiply((yield* g.callName(f, live(A), "totalStageSpeed", [])), 1.5))])]), rt.op(f, "Sqrt", [], [rt.op(f, "Abs", [], [add(16, multiply((yield* g.callName(f, live(A), "totalStealth", [])), 7))])]));
	yield* g.callName(f, live(M), "adjustOxyLoss", [live(get_damage)]);
	yield* g.callName(f, live(M), "adjustBrainLoss", [divide(live(get_damage), 2)]);
	return 1;
}, true);
