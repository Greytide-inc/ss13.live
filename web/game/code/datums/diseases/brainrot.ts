// From code/datums/diseases/brainrot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(949, "/datum/disease/brainrot", "/datum/disease", {
	name: "Brainrot",
	max_stages: 4,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Mannitol",
	cures: null,
	agent: "Cryptococcus Cosmosis",
	cure_chance: 15,
	desc: "This disease destroys the braincells, causing brain fever, brain necrosis and general intoxication.",
	severity: "Dangerous!",
	viable_mobtypes: null,
	required_organs: null,
});

// /datum/disease/brainrot/proc/<init>  (code/datums/diseases/brainrot.dm:7)
rt.def("/datum/disease/brainrot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("mannitol"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	$0 = $0;
	rt.setSv(f, "required_organs", rt.list(T("/obj/item/bodypart/head")));
	return f.dot;
});

// /datum/disease/brainrot/proc/stage_act  (code/datums/diseases/brainrot.dm:16)  may sleep
rt.def("/datum/disease/brainrot/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["blink"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["yawn"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You don't feel like yourself.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustBrainLoss", [1]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "updatehealth", []);
		}
	} else if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["stare"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["drool"]);
		}
		if ((truthy(rt.op(f, "Prob", [], [10])) && rt.le((yield* g.callName(f, rt.sv(f, "affected_mob"), "getBrainLoss", [])), 98))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustBrainLoss", [2]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "updatehealth", []);
			if (truthy(rt.op(f, "Prob", [], [2]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your try to remember something important...but can't.</span>"]);
			}
		}
	} else if ($0 === 4) {
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["stare"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["drool"]);
		}
		if ((truthy(rt.op(f, "Prob", [], [15])) && rt.le((yield* g.callName(f, rt.sv(f, "affected_mob"), "getBrainLoss", [])), 98))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustBrainLoss", [3]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "updatehealth", []);
			if (truthy(rt.op(f, "Prob", [], [2]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Strange buzzing fills your head, removing all thoughts.</span>"]);
			}
		}
		if (truthy(rt.op(f, "Prob", [], [3]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You lose consciousness...</span>"]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "visible_message", [fmt("<span class='warning'>＀ suddenly collapses</span>", [rt.sv(f, "affected_mob")])]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "Unconscious", [(yield* g.call(f, P("/proc/rand"), null, [100, 200]))]);
			if (truthy(rt.op(f, "Prob", [], [1]))) {
				yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["snore"]);
			}
		}
		if (truthy(rt.op(f, "Prob", [], [15]))) {
			rt.modField(f, rt.sv(f, "affected_mob"), "stuttering", 3, add);
		}
	}
	return live(f.dot);
}, true);
