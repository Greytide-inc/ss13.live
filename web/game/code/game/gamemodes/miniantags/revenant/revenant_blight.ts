// From code/game/gamemodes/miniantags/revenant/revenant_blight.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(980, "/datum/disease/revblight", "/datum/disease", {
	stagedamage: 0,
	finalstage: 0,
	name: "Unnatural Wasting",
	max_stages: 5,
	stage_prob: 10,
	spread_flags: 2,
	cure_text: "Holy water or extensive rest.",
	spread_text: "A burst of unholy energy",
	cures: null,
	cure_chance: 50,
	agent: "Unholy Forces",
	disease_flags: 1,
	permeability_mod: 1,
	severity: "BIOHAZARD THREAT!",
	viable_mobtypes: null,
});

// /datum/disease/revblight/proc/<init>  (code/game/gamemodes/miniantags/revenant/revenant_blight.dm:8)
rt.def("/datum/disease/revblight/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("holywater"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/disease/revblight/proc/cure  (code/game/gamemodes/miniantags/revenant/revenant_blight.dm:20)  may sleep
rt.def("/datum/disease/revblight/proc/cure", function* cure(f: Frame) {
	if (truthy(rt.sv(f, "affected_mob"))) {
		yield* g.callName(f, rt.sv(f, "affected_mob"), "remove_atom_colour", [2, "#1d2953"]);
		if ((truthy(rt.fv(f, "dna", rt.sv(f, "affected_mob"))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", rt.sv(f, "affected_mob")))))) {
			yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", rt.sv(f, "affected_mob"))), "handle_mutant_bodyparts", [rt.sv(f, "affected_mob")]);
			yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", rt.sv(f, "affected_mob"))), "handle_hair", [rt.sv(f, "affected_mob")]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You feel better.</span>"]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/disease/revblight/proc/stage_act  (code/game/gamemodes/miniantags/revenant/revenant_blight.dm:28)  may sleep
rt.def("/datum/disease/revblight/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "finalstage"))) {
		if ((truthy(rt.fv(f, "lying", rt.sv(f, "affected_mob"))) && truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "stage"), 6)])))) {
			yield* g.srcCall(f, "cure");
			return live(f.dot);
		}
		if (truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "stage"), 3)]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), fmt("<span class='revennotice'>You suddenly feel ＀...</span>", [rt.op(f, "PickUnweighted", [6], ["sick and tired", "disoriented", "tired and confused", "nauseated", "faint", "dizzy"])])]);
			rt.modField(f, rt.sv(f, "affected_mob"), "confused", 8, add);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustStaminaLoss", [8]);
			yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [rt.fv(f, "loc", rt.sv(f, "affected_mob"))]);
		}
		if (rt.lt(rt.sv(f, "stagedamage"), rt.sv(f, "stage"))) {
			rt.incSrcVar(f, "stagedamage", 1, true);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustToxLoss", [multiply(rt.sv(f, "stage"), 2)]);
			yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [rt.fv(f, "loc", rt.sv(f, "affected_mob"))]);
		}
		if (truthy(rt.op(f, "Prob", [], [45]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustStaminaLoss", [rt.sv(f, "stage")]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["pale"]);
		}
	} else if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", [rt.op(f, "PickUnweighted", [2], ["pale", "shiver"])]);
		}
	} else if ($0 === 4) {
		if (truthy(rt.op(f, "Prob", [], [15]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", [rt.op(f, "PickUnweighted", [3], ["pale", "shiver", "cries"])]);
		}
	} else if ($0 === 5) {
		if (truthy(rt.sv(f, "finalstage"))) return f.dot;
		rt.setSv(f, "finalstage", 1);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), fmt("<span class='revenbignotice'>You feel like ＀.</span>", [rt.op(f, "PickUnweighted", [4], ["nothing's worth it anymore", "nobody ever needed your help", "nothing you did mattered", "everything you tried to do was worthless"])])]);
		yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustStaminaLoss", [45]);
		yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [rt.fv(f, "loc", rt.sv(f, "affected_mob"))]);
		if ((truthy(rt.fv(f, "dna", rt.sv(f, "affected_mob"))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", rt.sv(f, "affected_mob")))))) {
			yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", rt.sv(f, "affected_mob"))), "handle_mutant_bodyparts", [rt.sv(f, "affected_mob"), "#1d2953"]);
			yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", rt.sv(f, "affected_mob"))), "handle_hair", [rt.sv(f, "affected_mob"), "#1d2953"]);
		}
		yield* g.callName(f, rt.sv(f, "affected_mob"), "visible_message", [fmt("<span class='warning'>＀ looks terrifyingly gaunt...</span>", [rt.sv(f, "affected_mob")]), "<span class='revennotice'>You suddenly feel like your skin is <i>wrong</i>...</span>"]);
		yield* g.callName(f, rt.sv(f, "affected_mob"), "add_atom_colour", ["#1d2953", 2]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/disease/revblight/proc/cure")])), 100]);
	} else {
		return live(f.dot);
	}
	return f.dot;
}, true);
