// From code/datums/diseases/advance/symptoms/fire.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(990, "/datum/symptom/fire", "/datum/symptom", {
	name: "Spontaneous Combustion",
	stealth: 1,
	resistance: -4,
	stage_speed: -4,
	transmittable: -4,
	level: 6,
	severity: 5,
});

// /datum/symptom/fire/proc/Activate  (code/datums/diseases/advance/symptoms/fire.dm:29)  may sleep
rt.def("/datum/symptom/fire/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 3) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [3], ["You feel hot.", "You hear a crackling noise.", "You smell smoke."])])]);
		} else if ($0 === 4) {
			yield* g.srcCall(f, "Firestacks_stage_4", live(M), live(f.args[0]));
			yield* g.callName(f, live(M), "IgniteMob", []);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>Your skin bursts into flames!</span>"]);
			yield* g.callName(f, live(M), "emote", ["scream"]);
		} else if ($0 === 5) {
			yield* g.srcCall(f, "Firestacks_stage_5", live(M), live(f.args[0]));
			yield* g.callName(f, live(M), "IgniteMob", []);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>Your skin erupts into an inferno!</span>"]);
			yield* g.callName(f, live(M), "emote", ["scream"]);
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });

// /datum/symptom/fire/proc/Firestacks_stage_4  (code/datums/diseases/advance/symptoms/fire.dm:48)  may sleep
rt.def("/datum/symptom/fire/proc/Firestacks_stage_4", function* Firestacks_stage_4(f: Frame, M: Value, A: Value) {
	let get_stacks: Value = null;
	f.vars = () => [M, A, get_stacks];
	get_stacks = subtract(rt.op(f, "Sqrt", [], [add(20, multiply((yield* g.callName(f, live(A), "totalStageSpeed", [])), 2))]), rt.op(f, "Sqrt", [], [(yield* g.call(f, P("/proc/max"), null, [0, add(16, (yield* g.callName(f, live(A), "totalStealth", [])))]))]));
	yield* g.callName(f, live(M), "adjust_fire_stacks", [live(get_stacks)]);
	yield* g.callName(f, live(M), "adjustFireLoss", [divide(live(get_stacks), 2)]);
	return 1;
}, true);

// /datum/symptom/fire/proc/Firestacks_stage_5  (code/datums/diseases/advance/symptoms/fire.dm:54)  may sleep
rt.def("/datum/symptom/fire/proc/Firestacks_stage_5", function* Firestacks_stage_5(f: Frame, M: Value, A: Value) {
	let get_stacks: Value = null;
	f.vars = () => [M, A, get_stacks];
	get_stacks = subtract(rt.op(f, "Sqrt", [], [(yield* g.call(f, P("/proc/max"), null, [0, add(20, multiply((yield* g.callName(f, live(A), "totalStageSpeed", [])), 3))]))]), rt.op(f, "Sqrt", [], [(yield* g.call(f, P("/proc/max"), null, [0, add(16, (yield* g.callName(f, live(A), "totalStealth", [])))]))]));
	yield* g.callName(f, live(M), "adjust_fire_stacks", [live(get_stacks)]);
	yield* g.callName(f, live(M), "adjustFireLoss", [live(get_stacks)]);
	return 1;
}, true);

rt.type(991, "/datum/symptom/alkali", "/datum/symptom", {
	name: "Alkali perspiration",
	stealth: 2,
	resistance: -2,
	stage_speed: -2,
	transmittable: -2,
	level: 7,
	severity: 6,
});

// /datum/symptom/alkali/proc/Activate  (code/datums/diseases/advance/symptoms/fire.dm:88)  may sleep
rt.def("/datum/symptom/alkali/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 3) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [3], ["Your veins boil.", "You feel hot.", "You smell meat cooking."])])]);
		} else if ($0 === 4) {
			yield* g.srcCall(f, "Alkali_fire_stage_4", live(M), live(f.args[0]));
			yield* g.callName(f, live(M), "IgniteMob", []);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>Your sweat bursts into flames!</span>"]);
			yield* g.callName(f, live(M), "emote", ["scream"]);
		} else if ($0 === 5) {
			yield* g.srcCall(f, "Alkali_fire_stage_5", live(M), live(f.args[0]));
			yield* g.callName(f, live(M), "IgniteMob", []);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>Your skin erupts into an inferno!</span>"]);
			yield* g.callName(f, live(M), "emote", ["scream"]);
			if (rt.lt(rt.fv(f, "fire_stacks", live(M)), 0)) {
				yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀'s sweat sizzles and pops on contact with water!</span>", [live(M)])]);
				yield* g.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(M)), 0, 0, 2]);
				yield* g.srcCall(f, "Alkali_fire_stage_5", live(M), live(f.args[0]));
			}
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });

// /datum/symptom/alkali/proc/Alkali_fire_stage_4  (code/datums/diseases/advance/symptoms/fire.dm:111)  may sleep
rt.def("/datum/symptom/alkali/proc/Alkali_fire_stage_4", function* Alkali_fire_stage_4(f: Frame, M: Value, A: Value) {
	let get_stacks: Value = null;
	f.vars = () => [M, A, get_stacks];
	get_stacks = rt.op(f, "Sqrt", [], [add(20, multiply((yield* g.callName(f, live(A), "totalStageSpeed", [])), 5))]);
	yield* g.callName(f, live(M), "adjust_fire_stacks", [live(get_stacks)]);
	yield* g.callName(f, live(M), "adjustFireLoss", [divide(live(get_stacks), 2)]);
	yield* g.callName(f, rt.fv(f, "reagents", live(M)), "add_reagent", ["clf3", 1]);
	return 1;
}, true);

// /datum/symptom/alkali/proc/Alkali_fire_stage_5  (code/datums/diseases/advance/symptoms/fire.dm:118)  may sleep
rt.def("/datum/symptom/alkali/proc/Alkali_fire_stage_5", function* Alkali_fire_stage_5(f: Frame, M: Value, A: Value) {
	let get_stacks: Value = null;
	f.vars = () => [M, A, get_stacks];
	get_stacks = rt.op(f, "Sqrt", [], [add(20, multiply((yield* g.callName(f, live(A), "totalStageSpeed", [])), 8))]);
	yield* g.callName(f, live(M), "adjust_fire_stacks", [live(get_stacks)]);
	yield* g.callName(f, live(M), "adjustFireLoss", [live(get_stacks)]);
	yield* g.callName(f, rt.fv(f, "reagents", live(M)), "add_reagent_list", [rt.alist(f, ["napalm", 3, "clf3", 3])]);
	return 1;
}, true);
