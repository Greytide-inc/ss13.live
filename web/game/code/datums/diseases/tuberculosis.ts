// From code/datums/diseases/tuberculosis.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(970, "/datum/disease/tuberculosis", "/datum/disease", {
	name: "Fungal tuberculosis",
	max_stages: 5,
	spread_text: "Airborne",
	cure_text: "Spaceacillin & salbutamol",
	cures: null,
	agent: "Fungal Tubercle bacillus Cosmosis",
	cure_chance: 5,
	desc: "A rare highly transmittable virulent virus. Few samples exist, rumoured to be carefully grown and cultured by clandestine bio-weapon specialists. Causes fever, blood vomiting, lung damage, weight loss, and fatigue.",
	severity: "Dangerous!",
	viable_mobtypes: null,
	required_organs: null,
});

// /datum/disease/tuberculosis/proc/<init>  (code/datums/diseases/tuberculosis.dm:8)
rt.def("/datum/disease/tuberculosis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("spaceacillin", "salbutamol"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	$0 = $0;
	rt.setSv(f, "required_organs", rt.list(T("/obj/item/bodypart/head")));
	return f.dot;
});

// /datum/disease/tuberculosis/proc/stage_act  (code/datums/diseases/tuberculosis.dm:15)  may sleep
rt.def("/datum/disease/tuberculosis/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["cough"]);
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your chest hurts.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your stomach violently rumbles!</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel a cold sweat form.</span>"]);
		}
	} else if ($0 === 4) {
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='userdanger'>You see four of everything</span>"]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "Dizzy", [5]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel a sharp pain from your lower chest!</span>"]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustOxyLoss", [5]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["gasp"]);
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel air escape from your lungs painfully.</span>"]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustOxyLoss", [25]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["gasp"]);
		}
	} else if ($0 === 5) {
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), fmt("<span class='userdanger'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You feel your heart slowing...", "You relax and slow your heartbeat."])])]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustStaminaLoss", [70]);
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustStaminaLoss", [100]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "visible_message", [fmt("<span class='warning'>＀ faints!</span>", [rt.sv(f, "affected_mob")]), "<span class='userdanger'>You surrender yourself and feel at peace...</span>"]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "AdjustSleeping", [100]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='userdanger'>You feel your mind relax and your thoughts drift!</span>"]);
			rt.setFv(f, "confused", rt.sv(f, "affected_mob"), (yield* g.call(f, P("/proc/min"), null, [100, add(rt.fv(f, "confused", rt.sv(f, "affected_mob")), 8)])));
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "vomit", [20]);
		}
		if (truthy(rt.op(f, "Prob", [], [3]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), fmt("<span class='warning'><i>＀</i></span>", [rt.op(f, "PickUnweighted", [3], ["Your stomach silently rumbles...", "Your stomach seizes up and falls limp, muscles dead and lifeless.", "You could eat a crayon"])])]);
			rt.setFv(f, "overeatduration", rt.sv(f, "affected_mob"), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "overeatduration", rt.sv(f, "affected_mob")), 100), 0])));
			rt.setFv(f, "nutrition", rt.sv(f, "affected_mob"), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "nutrition", rt.sv(f, "affected_mob")), 100), 0])));
		}
		if (truthy(rt.op(f, "Prob", [], [15]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), fmt("<span class='danger'>＀</span>", [rt.op(f, "PickUnweighted", [3], ["You feel uncomfortably hot...", "You feel like unzipping your jumpsuit", "You feel like taking off some clothes..."])])]);
			rt.modField(f, rt.sv(f, "affected_mob"), "bodytemperature", 40, add);
		}
	}
	return live(f.dot);
}, true);
