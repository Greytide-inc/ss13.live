// From code/modules/reagents/chemistry/reagents/drug_reagents.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3537, "/datum/reagent/drug/space_drugs", "/datum/reagent/drug", {
	name: "Space drugs",
	id: "space_drugs",
	description: "An illegal chemical compound used as drug.",
	color: "#60A584",
	overdose_threshold: 30,
});

// /datum/reagent/drug/space_drugs/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:15)  may sleep
rt.def("/datum/reagent/drug/space_drugs/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "set_drugginess", [15]);
	if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.args[0]))]))) && !truthy((rt.istype(rt.fv(f, "loc", live(f.args[0])), T("/turf/open/space")) ? 1 : 0)))) {
		if (truthy(rt.fv(f, "canmove", live(f.args[0])))) {
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
			}
		}
	}
	if (truthy(rt.op(f, "Prob", [], [7]))) {
		yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [4], ["twitch", "drool", "moan", "giggle"])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/space_drugs/proc/overdose_start  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:24)
rt.def("/datum/reagent/drug/space_drugs/proc/overdose_start", function overdose_start(f: Frame, M: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>You start tripping hard!</span>"]);
	return f.dot;
});

// /datum/reagent/drug/space_drugs/proc/overdose_process  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:28)
rt.def("/datum/reagent/drug/space_drugs/proc/overdose_process", function overdose_process(f: Frame) {
	if ((rt.lt(rt.fv(f, "hallucination", live(f.args[0])), rt.sv(f, "volume")) && truthy(rt.op(f, "Prob", [], [20])))) {
		rt.modField(f, live(f.args[0]), "hallucination", 5, add);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["M"] });

rt.type(3538, "/datum/reagent/drug/nicotine", "/datum/reagent/drug", {
	name: "Nicotine",
	id: "nicotine",
	description: "Slightly reduces stun times. If overdosed it will deal toxin and oxygen damage.",
	reagent_state: 2,
	color: "#60A584",
	addiction_threshold: 30,
	taste_description: "smoke",
});

// /datum/reagent/drug/nicotine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:42)  may sleep
rt.def("/datum/reagent/drug/nicotine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let smoke_message: Value = null;
	f.vars = () => [smoke_message];
	if (truthy(rt.op(f, "Prob", [], [1]))) {
		smoke_message = rt.op(f, "PickUnweighted", [4], ["You feel relaxed.", "You feel calmed.", "You feel alert.", "You feel rugged."]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀</span>", [live(smoke_message)])]);
	}
	yield* g.callName(f, live(f.args[0]), "AdjustStun", [-20, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustKnockdown", [-20, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustUnconscious", [-20, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [-0.5, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3540, "/datum/reagent/drug/crank", "/datum/reagent/drug", {
	name: "Crank",
	id: "crank",
	description: "Reduces stun times by about 200%. If overdosed or addicted it will deal significant Toxin, Brute and Brain damage.",
	reagent_state: 2,
	color: "#FA00C8",
	overdose_threshold: 20,
	addiction_threshold: 10,
});

// /datum/reagent/drug/crank/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:70)  may sleep
rt.def("/datum/reagent/drug/crank/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let high_message: Value = null;
	f.vars = () => [high_message];
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		high_message = rt.op(f, "PickUnweighted", [3], ["You feel jittery.", "You feel like you gotta go fast.", "You feel like you need to step it up."]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀</span>", [live(high_message)])]);
	}
	yield* g.callName(f, live(f.args[0]), "AdjustStun", [-20, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustKnockdown", [-20, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustUnconscious", [-20, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/crank/proc/overdose_process  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:80)  may sleep
rt.def("/datum/reagent/drug/crank/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [2]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [2, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [2, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/crank/proc/addiction_act_stage1  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:87)  may sleep
rt.def("/datum/reagent/drug/crank/proc/addiction_act_stage1", function* addiction_act_stage1(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [5]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/crank/proc/addiction_act_stage2  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:91)  may sleep
rt.def("/datum/reagent/drug/crank/proc/addiction_act_stage2", function* addiction_act_stage2(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [5, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/crank/proc/addiction_act_stage3  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:96)  may sleep
rt.def("/datum/reagent/drug/crank/proc/addiction_act_stage3", function* addiction_act_stage3(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [5, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/crank/proc/addiction_act_stage4  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:101)  may sleep
rt.def("/datum/reagent/drug/crank/proc/addiction_act_stage4", function* addiction_act_stage4(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [5]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [5, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3541, "/datum/reagent/drug/krokodil", "/datum/reagent/drug", {
	name: "Krokodil",
	id: "krokodil",
	description: "Cools and calms you down. If overdosed it will deal significant Brain and Toxin damage. If addicted it will begin to deal fatal amounts of Brute damage as the subject's skin falls off.",
	reagent_state: 2,
	color: "#0064B4",
	overdose_threshold: 20,
	addiction_threshold: 15,
});

// /datum/reagent/drug/krokodil/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:118)  may sleep
rt.def("/datum/reagent/drug/krokodil/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let high_message: Value = null;
	f.vars = () => [high_message];
	high_message = rt.op(f, "PickUnweighted", [3], ["You feel calm.", "You feel collected.", "You feel like you need to relax."]);
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀</span>", [live(high_message)])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/krokodil/proc/overdose_process  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:124)  may sleep
rt.def("/datum/reagent/drug/krokodil/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [0.25]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [0.25, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/krokodil/proc/addiction_act_stage1  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:130)  may sleep
rt.def("/datum/reagent/drug/krokodil/proc/addiction_act_stage1", function* addiction_act_stage1(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [2]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [2, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3545, "/datum/reagent/krokodil", "/datum/reagent", {});

// /datum/reagent/krokodil/proc/addiction_act_stage2  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:136)
rt.def("/datum/reagent/krokodil/proc/addiction_act_stage2", function addiction_act_stage2(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [25]))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>Your skin feels loose...</span>"]);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["M"] });

// /datum/reagent/drug/krokodil/proc/addiction_act_stage3  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:141)  may sleep
rt.def("/datum/reagent/drug/krokodil/proc/addiction_act_stage3", function* addiction_act_stage3(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [25]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>Your skin starts to peel away...</span>"]);
	}
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [3, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/krokodil/proc/addiction_act_stage4  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:148)  may sleep
rt.def("/datum/reagent/drug/krokodil/proc/addiction_act_stage4", function* addiction_act_stage4(f: Frame) {
	if ((!truthy(rt.fv(f, "dna", live(f.args[0]))) || !truthy(rt.gv(f, "species", rt.fv(f, "dna", live(f.args[0])))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(rt.gv(f, "species", rt.fv(f, "dna", live(f.args[0]))), T("/datum/species/krokodil_addict")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>Your skin falls off easily!</span>"]);
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [50, 0]);
		yield* g.callName(f, live(f.args[0]), "set_species", [T("/datum/species/krokodil_addict")]);
	} else {
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [5, 0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3542, "/datum/reagent/drug/methamphetamine", "/datum/reagent/drug", {
	name: "Methamphetamine",
	id: "methamphetamine",
	description: "Reduces stun times by about 300%, speeds the user up, and allows the user to quickly recover stamina while dealing a small amount of Brain damage. If overdosed the subject will move randomly, laugh randomly, drop items and suffer from Toxin and Brain damage. If addicted the subject will constantly jitter and drool, before becoming dizzy and losing motor control and eventually suffer heavy toxin damage.",
	reagent_state: 2,
	color: "#FAFAFA",
	overdose_threshold: 20,
	addiction_threshold: 10,
	metabolization_rate: 0.3,
});

// /datum/reagent/drug/methamphetamine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:169)  may sleep
rt.def("/datum/reagent/drug/methamphetamine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let high_message: Value = null;
	f.vars = () => [high_message];
	high_message = rt.op(f, "PickUnweighted", [3], ["You feel hyper.", "You feel like you need to go faster.", "You feel like you can run the world."]);
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀</span>", [live(high_message)])]);
	}
	yield* g.callName(f, live(f.args[0]), "AdjustStun", [-40, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustKnockdown", [-40, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustUnconscious", [-40, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [-2, 0]);
	(rt.modField(f, live(f.args[0]), "status_flags", 64, rt.bitOr));
	yield* g.callName(f, live(f.args[0]), "Jitter", [2]);
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [0.25]);
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [2], ["twitch", "shiver"])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/methamphetamine/proc/overdose_process  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:185)  may sleep
rt.def("/datum/reagent/drug/methamphetamine/proc/overdose_process", function* overdose_process(f: Frame) {
	let i: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [i, I, $e];
	if ((truthy(rt.fv(f, "canmove", live(f.args[0]))) && !truthy((rt.istype(rt.fv(f, "loc", live(f.args[0])), T("/atom/movable")) ? 1 : 0)))) {
		i = null;
		rt.forRange(f, 0, 1, 4, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.callName(f, live(f.args[0]), "emote", ["laugh"]);
	}
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀'s hands flip out and flail everywhere!</span>", [live(f.args[0])])]);
		if (truthy((I = (yield* g.callName(f, live(f.args[0]), "get_active_held_item", []))))) {
			yield* g.callName(f, live(f.args[0]), "drop_item", []);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [rt.op(f, "PickUnweighted", [6], [0.5, 0.6000000238418579, 0.699999988079071, 0.800000011920929, 0.8999999761581421, 1])]);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/methamphetamine/proc/addiction_act_stage1  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:201)  may sleep
rt.def("/datum/reagent/drug/methamphetamine/proc/addiction_act_stage1", function* addiction_act_stage1(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "Jitter", [5]);
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [3], ["twitch", "drool", "moan"])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/methamphetamine/proc/addiction_act_stage2  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:207)  may sleep
rt.def("/datum/reagent/drug/methamphetamine/proc/addiction_act_stage2", function* addiction_act_stage2(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "Jitter", [10]);
	yield* g.callName(f, live(f.args[0]), "Dizzy", [10]);
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [3], ["twitch", "drool", "moan"])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/methamphetamine/proc/addiction_act_stage3  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:214)  may sleep
rt.def("/datum/reagent/drug/methamphetamine/proc/addiction_act_stage3", function* addiction_act_stage3(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	if ((truthy(rt.fv(f, "canmove", live(f.args[0]))) && !truthy((rt.istype(rt.fv(f, "loc", live(f.args[0])), T("/atom/movable")) ? 1 : 0)))) {
		i = null;
		i = 0;
		while (rt.lt(live(i), 4)) {
			yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
			i = rt.inc(live(i), 1);
		}
	}
	yield* g.callName(f, live(f.args[0]), "Jitter", [15]);
	yield* g.callName(f, live(f.args[0]), "Dizzy", [15]);
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [3], ["twitch", "drool", "moan"])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/methamphetamine/proc/addiction_act_stage4  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:224)  may sleep
rt.def("/datum/reagent/drug/methamphetamine/proc/addiction_act_stage4", function* addiction_act_stage4(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	if ((truthy(rt.fv(f, "canmove", live(f.args[0]))) && !truthy((rt.istype(rt.fv(f, "loc", live(f.args[0])), T("/atom/movable")) ? 1 : 0)))) {
		i = null;
		i = 0;
		while (rt.lt(live(i), 8)) {
			yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
			i = rt.inc(live(i), 1);
		}
	}
	yield* g.callName(f, live(f.args[0]), "Jitter", [20]);
	yield* g.callName(f, live(f.args[0]), "Dizzy", [20]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [5, 0]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [3], ["twitch", "drool", "moan"])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3543, "/datum/reagent/drug/bath_salts", "/datum/reagent/drug", {
	name: "Bath Salts",
	id: "bath_salts",
	description: "Makes you nearly impervious to stuns and grants a stamina regeneration buff, but you will be a nearly uncontrollable tramp-bearded raving lunatic.",
	reagent_state: 2,
	color: "#FAFAFA",
	overdose_threshold: 20,
	addiction_threshold: 10,
	taste_description: "salt",
});

// /datum/reagent/drug/bath_salts/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:247)  may sleep
rt.def("/datum/reagent/drug/bath_salts/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let high_message: Value = null;
	f.vars = () => [high_message];
	high_message = rt.op(f, "PickUnweighted", [3], ["You feel amped up.", "You feel ready.", "You feel like you can push it to the limit."]);
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀</span>", [live(high_message)])]);
	}
	yield* g.callName(f, live(f.args[0]), "AdjustStun", [-60, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustKnockdown", [-60, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustUnconscious", [-60, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [-5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [0.5]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [0.10000000149011612, 0]);
	rt.modField(f, live(f.args[0]), "hallucination", 10, add);
	if ((truthy(rt.fv(f, "canmove", live(f.args[0]))) && !truthy((rt.istype(rt.fv(f, "loc", live(f.args[0])), T("/atom/movable")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
		yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/bath_salts/proc/overdose_process  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:264)  may sleep
rt.def("/datum/reagent/drug/bath_salts/proc/overdose_process", function* overdose_process(f: Frame) {
	let i: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [i, I, $e];
	rt.modField(f, live(f.args[0]), "hallucination", 10, add);
	if ((truthy(rt.fv(f, "canmove", live(f.args[0]))) && !truthy((rt.istype(rt.fv(f, "loc", live(f.args[0])), T("/atom/movable")) ? 1 : 0)))) {
		i = null;
		rt.forRange(f, 0, 1, 8, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [3], ["twitch", "drool", "moan"])]);
	}
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		if (truthy((I = (yield* g.callName(f, live(f.args[0]), "get_active_held_item", []))))) {
			yield* g.callName(f, live(f.args[0]), "drop_item", []);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/bath_salts/proc/addiction_act_stage1  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:277)  may sleep
rt.def("/datum/reagent/drug/bath_salts/proc/addiction_act_stage1", function* addiction_act_stage1(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	rt.modField(f, live(f.args[0]), "hallucination", 10, add);
	if ((truthy(rt.fv(f, "canmove", live(f.args[0]))) && !truthy((rt.istype(rt.fv(f, "loc", live(f.args[0])), T("/atom/movable")) ? 1 : 0)))) {
		i = null;
		i = 0;
		while (rt.lt(live(i), 8)) {
			yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
			i = rt.inc(live(i), 1);
		}
	}
	yield* g.callName(f, live(f.args[0]), "Jitter", [5]);
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [10]);
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [3], ["twitch", "drool", "moan"])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/bath_salts/proc/addiction_act_stage2  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:288)  may sleep
rt.def("/datum/reagent/drug/bath_salts/proc/addiction_act_stage2", function* addiction_act_stage2(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	rt.modField(f, live(f.args[0]), "hallucination", 20, add);
	if ((truthy(rt.fv(f, "canmove", live(f.args[0]))) && !truthy((rt.istype(rt.fv(f, "loc", live(f.args[0])), T("/atom/movable")) ? 1 : 0)))) {
		i = null;
		i = 0;
		while (rt.lt(live(i), 8)) {
			yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
			i = rt.inc(live(i), 1);
		}
	}
	yield* g.callName(f, live(f.args[0]), "Jitter", [10]);
	yield* g.callName(f, live(f.args[0]), "Dizzy", [10]);
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [10]);
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [3], ["twitch", "drool", "moan"])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/bath_salts/proc/addiction_act_stage3  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:300)  may sleep
rt.def("/datum/reagent/drug/bath_salts/proc/addiction_act_stage3", function* addiction_act_stage3(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	rt.modField(f, live(f.args[0]), "hallucination", 30, add);
	if ((truthy(rt.fv(f, "canmove", live(f.args[0]))) && !truthy((rt.istype(rt.fv(f, "loc", live(f.args[0])), T("/atom/movable")) ? 1 : 0)))) {
		i = null;
		i = 0;
		while (rt.lt(live(i), 12)) {
			yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
			i = rt.inc(live(i), 1);
		}
	}
	yield* g.callName(f, live(f.args[0]), "Jitter", [15]);
	yield* g.callName(f, live(f.args[0]), "Dizzy", [15]);
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [10]);
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [3], ["twitch", "drool", "moan"])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/drug/bath_salts/proc/addiction_act_stage4  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:312)  may sleep
rt.def("/datum/reagent/drug/bath_salts/proc/addiction_act_stage4", function* addiction_act_stage4(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	rt.modField(f, live(f.args[0]), "hallucination", 40, add);
	if ((truthy(rt.fv(f, "canmove", live(f.args[0]))) && !truthy((rt.istype(rt.fv(f, "loc", live(f.args[0])), T("/atom/movable")) ? 1 : 0)))) {
		i = null;
		i = 0;
		while (rt.lt(live(i), 16)) {
			yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
			i = rt.inc(live(i), 1);
		}
	}
	yield* g.callName(f, live(f.args[0]), "Jitter", [50]);
	yield* g.callName(f, live(f.args[0]), "Dizzy", [50]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [10]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [3], ["twitch", "drool", "moan"])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3544, "/datum/reagent/drug/aranesp", "/datum/reagent/drug", {
	name: "Aranesp",
	id: "aranesp",
	description: "Amps you up and gets you going, fixes all stamina damage you might have but can cause toxin and oxygen damage..",
	reagent_state: 2,
	color: "#78FFF0",
});

// /datum/reagent/drug/aranesp/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drug_reagents.dm:333)  may sleep
rt.def("/datum/reagent/drug/aranesp/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let high_message: Value = null;
	f.vars = () => [high_message];
	high_message = rt.op(f, "PickUnweighted", [3], ["You feel amped up.", "You feel ready.", "You feel like you can push it to the limit."]);
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀</span>", [live(high_message)])]);
	}
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [-18, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [0.5, 0]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		rt.incField(f, live(f.args[0]), "losebreath", 1, true);
		yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [1, 0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });
