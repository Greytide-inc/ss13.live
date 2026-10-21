// From code/datums/diseases/parrotpossession.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(958, "/datum/disease/parrot_possession", "/datum/disease", {
	parrot: null,
	name: "Parrot Possession",
	max_stages: 1,
	spread_text: "Paranormal",
	spread_flags: 1,
	disease_flags: 1,
	cure_text: "Holy Water.",
	cures: null,
	cure_chance: 20,
	agent: "Avian Vengence",
	desc: "Subject is possesed by the vengeful spirit of a parrot. Call the priest.",
	severity: "Medium",
	viable_mobtypes: null,
});

// /datum/disease/parrot_possession/proc/<init>  (code/datums/diseases/parrotpossession.dm:8)
rt.def("/datum/disease/parrot_possession/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("holywater"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/disease/parrot_possession/proc/stage_act  (code/datums/diseases/parrotpossession.dm:17)  may sleep
rt.def("/datum/disease/parrot_possession/proc/stage_act", function* stage_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((!truthy(rt.sv(f, "parrot")) || !isEqual(rt.fv(f, "loc", rt.sv(f, "parrot")), rt.sv(f, "affected_mob")))) {
		yield* g.srcCall(f, "cure");
	} else {
		if (!truthy(rt.op(f, "Prob", [], [rt.fv(f, "speak_chance", rt.sv(f, "parrot"))]))) return f.dot;
		yield* g.callName(f, rt.sv(f, "affected_mob"), "say", [rt.op(f, "PickUnweighted", [1], [rt.fv(f, "speech_buffer", rt.sv(f, "parrot"))])]);
	}
	return f.dot;
}, true);

// /datum/disease/parrot_possession/proc/cure  (code/datums/diseases/parrotpossession.dm:24)  may sleep
rt.def("/datum/disease/parrot_possession/proc/cure", function* cure(f: Frame) {
	if ((truthy(rt.sv(f, "parrot")) && isEqual(rt.fv(f, "loc", rt.sv(f, "parrot")), rt.sv(f, "affected_mob")))) {
		rt.setFv(f, "loc", rt.sv(f, "parrot"), rt.fv(f, "loc", rt.sv(f, "affected_mob")));
		yield* g.callName(f, rt.sv(f, "affected_mob"), "visible_message", [fmt("<span class='danger'>＀ is violently driven out of ＀!</span>", [rt.sv(f, "parrot"), rt.sv(f, "affected_mob")]), fmt("<span class='userdanger'>＀ bursts out of your chest!</span>", [rt.sv(f, "parrot")])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
