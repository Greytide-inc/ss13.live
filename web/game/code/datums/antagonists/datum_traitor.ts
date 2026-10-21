// From code/datums/antagonists/datum_traitor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(900, "/datum/antagonist/traitor", "/datum/antagonist", {
	should_specialise: 1,
	ai_datum: rt.typePath("/datum/antagonist/traitor/AI"),
	human_datum: rt.typePath("/datum/antagonist/traitor/human"),
	special_role: "traitor",
	employer: "The Syndicate",
	give_objectives: 1,
	should_give_codewords: 1,
	objectives_given: null,
	base_datum_custom: rt.typePath("/datum/antagonist/traitor/custom"),
	name: "Traitor",
});

// /datum/antagonist/traitor/proc/<init>  (code/datums/antagonists/datum_traitor.dm:11)
rt.def("/datum/antagonist/traitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "objectives_given", rt.list());
	return f.dot;
});

// /datum/antagonist/traitor/proc/on_body_transfer  (code/datums/antagonists/datum_traitor.dm:41)  may sleep
rt.def("/datum/antagonist/traitor/proc/on_body_transfer", function* on_body_transfer(f: Frame) {
	let new_datum: Value = null;
	let $e: any;
	f.vars = () => [new_datum, $e];
	if ((truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon")) ? 1 : 0)) && truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon")) ? 1 : 0)))) {
		yield* g.callSuper(f, [], rt.Args.Same);
	} else {
		rt.setSv(f, "silent", 1);
		yield* g.callName(f, rt.sv(f, "owner"), "add_antag_datum", [rt.sv(f, "base_datum_custom")]);
		new_datum = null;
		rt.forList(f, 0, rt.fv(f, "antag_datums", rt.sv(f, "owner")), T("/datum/antagonist/traitor"));
		while (($e = rt.next(f, 0)) !== undefined) {
			new_datum = $e;
			if (isEqual(live(new_datum), live(f.src))) {
				continue;
			}
			yield* g.srcCall(f, "transfer_important_variables", live(new_datum));
			break;
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "on_removal");
	}
	return f.dot;
}, true, { args: ["old_body", "new_body"] });

// /datum/antagonist/traitor/proc/specialise  (code/datums/antagonists/datum_traitor.dm:66)  may sleep
rt.def("/datum/antagonist/traitor/proc/specialise", function* specialise(f: Frame) {
	rt.setSv(f, "silent", 1);
	if ((truthy(rt.fv(f, "current", rt.sv(f, "owner"))) && truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
		yield* g.callName(f, rt.sv(f, "owner"), "add_antag_datum", [rt.sv(f, "ai_datum")]);
	} else {
		yield* g.callName(f, rt.sv(f, "owner"), "add_antag_datum", [rt.sv(f, "human_datum")]);
	}
	yield* g.srcCall(f, "on_removal");
	return f.dot;
}, true);

// /datum/antagonist/traitor/proc/on_gain  (code/datums/antagonists/datum_traitor.dm:73)  may sleep
rt.def("/datum/antagonist/traitor/proc/on_gain", function* on_gain(f: Frame) {
	if (truthy(rt.sv(f, "should_specialise"))) {
		yield* g.srcCall(f, "specialise");
		return live(f.dot);
	}
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.sv(f, "owner"), add);
	rt.setFv(f, "special_role", rt.sv(f, "owner"), rt.sv(f, "special_role"));
	if (truthy(rt.sv(f, "give_objectives"))) {
		yield* g.srcCall(f, "forge_traitor_objectives");
	}
	yield* g.srcCall(f, "finalize_traitor");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/antagonist/traitor/proc/apply_innate_effects  (code/datums/antagonists/datum_traitor.dm:83)  may sleep
rt.def("/datum/antagonist/traitor/proc/apply_innate_effects", function* apply_innate_effects(f: Frame) {
	let traitor_mob: Value = null;
	f.vars = () => [traitor_mob];
	if (!isEqual(rt.fv(f, "assigned_role", rt.sv(f, "owner")), "Clown")) return f.dot;
	if (!(truthy((traitor_mob = rt.fv(f, "current", rt.sv(f, "owner")))) && truthy((rt.istype(live(traitor_mob), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	if (!truthy(rt.sv(f, "silent"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(traitor_mob), "Your training has allowed you to overcome your clownish nature, allowing you to wield weapons without harming yourself."]);
	}
	yield* g.callName(f, rt.fv(f, "dna", live(traitor_mob)), "remove_mutation", ["Clumsiness"]);
	return f.dot;
}, true);

// /datum/antagonist/traitor/proc/remove_innate_effects  (code/datums/antagonists/datum_traitor.dm:90)  may sleep
rt.def("/datum/antagonist/traitor/proc/remove_innate_effects", function* remove_innate_effects(f: Frame) {
	let traitor_mob: Value = null;
	f.vars = () => [traitor_mob];
	if (!isEqual(rt.fv(f, "assigned_role", rt.sv(f, "owner")), "Clown")) return f.dot;
	if (!(truthy((traitor_mob = rt.fv(f, "current", rt.sv(f, "owner")))) && truthy((rt.istype(live(traitor_mob), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, rt.fv(f, "dna", live(traitor_mob)), "add_mutation", ["Clumsiness"]);
	return f.dot;
}, true);

// /datum/antagonist/traitor/proc/on_removal  (code/datums/antagonists/datum_traitor.dm:97)  may sleep
rt.def("/datum/antagonist/traitor/proc/on_removal", function* on_removal(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	if (truthy(rt.sv(f, "should_specialise"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.sv(f, "owner"), subtract));
	O = null;
	rt.forList(f, 0, rt.sv(f, "objectives_given"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		(rt.modField(f, rt.sv(f, "owner"), "objectives", live(O), subtract));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "objectives_given", rt.list());
	if ((!truthy(rt.sv(f, "silent")) && truthy(rt.fv(f, "current", rt.sv(f, "owner"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), fmt("<span class='userdanger'> You are no longer the ＀! </span>", [rt.sv(f, "special_role")])]);
	}
	rt.setFv(f, "special_role", rt.sv(f, "owner"), null);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(903, "/datum/antagonist/traitor/AI", "/datum/antagonist/traitor", {
	should_specialise: 0,
});

// /datum/antagonist/traitor/AI/proc/on_removal  (code/datums/antagonists/datum_traitor.dm:108)  may sleep
rt.def("/datum/antagonist/traitor/AI/proc/on_removal", function* on_removal(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if ((truthy(rt.fv(f, "current", rt.sv(f, "owner"))) && truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
		yield* g.callName(f, (A = rt.fv(f, "current", rt.sv(f, "owner"))), "set_zeroth_law", [""]);
		(rt.modField(f, live(A), "verbs", P("/mob/living/silicon/ai/proc/choose_modules"), subtract));
		yield* g.callName(f, rt.fv(f, "malf_picker", live(A)), "remove_malf_verbs", [live(A)]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "malf_picker", live(A))]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/antagonist/traitor/proc/add_objective  (code/datums/antagonists/datum_traitor.dm:118)
rt.def("/datum/antagonist/traitor/proc/add_objective", function add_objective(f: Frame, O: Value) {
	rt.modField(f, rt.sv(f, "owner"), "objectives", live(O), add);
	rt.modSrcVar(f, "objectives_given", live(O), add);
	return f.dot;
});

// /datum/antagonist/traitor/proc/remove_objective  (code/datums/antagonists/datum_traitor.dm:121)
rt.def("/datum/antagonist/traitor/proc/remove_objective", function remove_objective(f: Frame, O: Value) {
	(rt.modField(f, rt.sv(f, "owner"), "objectives", live(O), subtract));
	(rt.modSrcVar(f, "objectives_given", live(O), subtract));
	return f.dot;
});

rt.type(907, "/datum/antagonist/traitor/human", "/datum/antagonist/traitor", {
	should_equip: 1,
	should_specialise: 0,
});

// /datum/antagonist/traitor/human/proc/forge_traitor_objectives  (code/datums/antagonists/datum_traitor.dm:127)  may sleep
rt.def("/datum/antagonist/traitor/human/proc/forge_traitor_objectives", function* forge_traitor_objectives(f: Frame) {
	let is_hijacker: Value = null, martyr_chance: Value = null, objective_count: Value = null, i: Value = null, hijack_objective: Value = null, martyr_compatibility: Value = null, O: Value = null, martyr_objective: Value = null, escape_objective: Value = null;
	let $e: any;
	f.vars = () => [is_hijacker, martyr_chance, objective_count, i, hijack_objective, martyr_compatibility, O, martyr_objective, escape_objective, $e];
	is_hijacker = rt.op(f, "Prob", [], [10]);
	martyr_chance = rt.op(f, "Prob", [], [20]);
	objective_count = live(is_hijacker);
	if ((!truthy(rt.gv(f, "exchange_blue", rt.fv(f, "mode", rt.gl("SSticker")))) && rt.ge(rt.getLen(f, rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker")))), 8))) {
		if (!truthy(rt.gv(f, "exchange_red", rt.fv(f, "mode", rt.gl("SSticker"))))) {
			rt.setFv(f, "exchange_red", rt.fv(f, "mode", rt.gl("SSticker")), rt.sv(f, "owner"));
		} else {
			rt.setFv(f, "exchange_blue", rt.fv(f, "mode", rt.gl("SSticker")), rt.sv(f, "owner"));
			yield* g.srcCall(f, "assign_exchange_role", rt.gv(f, "exchange_red", rt.fv(f, "mode", rt.gl("SSticker"))));
			yield* g.srcCall(f, "assign_exchange_role", rt.gv(f, "exchange_blue", rt.fv(f, "mode", rt.gl("SSticker"))));
		}
		objective_count = rt.modify(live(objective_count), 1, add);
	}
	i = null;
	i = live(objective_count);
	while (rt.lt(live(i), rt.fv(f, "traitor_objectives_amount", rt.gl("config")))) {
		yield* g.srcCall(f, "forge_single_objective");
		i = rt.inc(live(i), 1);
	}
	if ((truthy(live(is_hijacker)) && rt.le(live(objective_count), rt.fv(f, "traitor_objectives_amount", rt.gl("config"))))) {
		if (!truthy(rt.locateIn(f, T("/datum/objective/hijack"), rt.fv(f, "objectives", rt.sv(f, "owner"))))) {
			rt.setFv(f, "owner", (hijack_objective = (yield* g.new_(f, T("/datum/objective/hijack"), []))), rt.sv(f, "owner"));
			yield* g.srcCall(f, "add_objective", live(hijack_objective));
			return live(f.dot);
		}
	}
	martyr_compatibility = 1;
	O = null;
	rt.forList(f, 0, rt.fv(f, "objectives", rt.sv(f, "owner")), T("/datum/objective"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (!truthy(rt.fv(f, "martyr_compatible", live(O)))) {
			martyr_compatibility = 0;
			break;
		}
	}
	rt.endFor(f, 0);
	if ((truthy(live(martyr_compatibility)) && truthy(live(martyr_chance)))) {
		rt.setFv(f, "owner", (martyr_objective = (yield* g.new_(f, T("/datum/objective/martyr"), []))), rt.sv(f, "owner"));
		yield* g.srcCall(f, "add_objective", live(martyr_objective));
		return live(f.dot);
	} else {
		if (truthy(rt.locateIn(f, T("/datum/objective/escape"), rt.fv(f, "objectives", rt.sv(f, "owner"))))) return f.dot;
		rt.setFv(f, "owner", (escape_objective = (yield* g.new_(f, T("/datum/objective/escape"), []))), rt.sv(f, "owner"));
		yield* g.srcCall(f, "add_objective", live(escape_objective));
		return live(f.dot);
	}
	return f.dot;
}, true);

// /datum/antagonist/traitor/AI/proc/forge_traitor_objectives  (code/datums/antagonists/datum_traitor.dm:171)
rt.def("/datum/antagonist/traitor/AI/proc/forge_traitor_objectives", function forge_traitor_objectives(f: Frame) {
	let objective_count: Value = null, i: Value = null, kill_objective: Value = null, survive_objective: Value = null;
	f.vars = () => [objective_count, i, kill_objective, survive_objective];
	objective_count = 0;
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		objective_count = rt.modify(live(objective_count), rt.callSrc(f, "forge_single_objective", []), add);
	}
	i = null;
	i = live(objective_count);
	while (rt.lt(live(i), rt.fv(f, "traitor_objectives_amount", rt.gl("config")))) {
		rt.setFv(f, "owner", (kill_objective = rt.new_(f, T("/datum/objective/assassinate"), [])), rt.sv(f, "owner"));
		rt.callName(f, live(kill_objective), "find_target", []);
		rt.callSrc(f, "add_objective", [live(kill_objective)]);
		i = rt.inc(live(i), 1);
	}
	rt.setFv(f, "owner", (survive_objective = rt.new_(f, T("/datum/objective/survive"), [])), rt.sv(f, "owner"));
	rt.callSrc(f, "add_objective", [live(survive_objective)]);
	return f.dot;
});

// /datum/antagonist/traitor/human/proc/forge_single_objective  (code/datums/antagonists/datum_traitor.dm:187)  may sleep
rt.def("/datum/antagonist/traitor/human/proc/forge_single_objective", function* forge_single_objective(f: Frame) {
	let active_ais: Value = null, destroy_objective: Value = null, maroon_objective: Value = null, kill_objective: Value = null, steal_objective: Value = null;
	f.vars = () => [active_ais, destroy_objective, maroon_objective, kill_objective, steal_objective];
	f.dot = 1;
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		if ((truthy(rt.getLen(f, (active_ais = (yield* g.call(f, P("/proc/active_ais"), null, []))))) && truthy(rt.op(f, "Prob", [], [divide(100, rt.len(f, rt.gl("joined_player_list")))])))) {
			rt.setFv(f, "owner", (destroy_objective = (yield* g.new_(f, T("/datum/objective/destroy"), []))), rt.sv(f, "owner"));
			yield* g.callName(f, live(destroy_objective), "find_target", []);
			yield* g.srcCall(f, "add_objective", live(destroy_objective));
		} else {
			if (truthy(rt.op(f, "Prob", [], [30]))) {
				rt.setFv(f, "owner", (maroon_objective = (yield* g.new_(f, T("/datum/objective/maroon"), []))), rt.sv(f, "owner"));
				yield* g.callName(f, live(maroon_objective), "find_target", []);
				yield* g.srcCall(f, "add_objective", live(maroon_objective));
			} else {
				rt.setFv(f, "owner", (kill_objective = (yield* g.new_(f, T("/datum/objective/assassinate"), []))), rt.sv(f, "owner"));
				yield* g.callName(f, live(kill_objective), "find_target", []);
				yield* g.srcCall(f, "add_objective", live(kill_objective));
			}
		}
	} else {
		rt.setFv(f, "owner", (steal_objective = (yield* g.new_(f, T("/datum/objective/steal"), []))), rt.sv(f, "owner"));
		yield* g.callName(f, live(steal_objective), "find_target", []);
		yield* g.srcCall(f, "add_objective", live(steal_objective));
	}
	return f.dot;
}, true);

// /datum/antagonist/traitor/AI/proc/forge_single_objective  (code/datums/antagonists/datum_traitor.dm:212)
rt.def("/datum/antagonist/traitor/AI/proc/forge_single_objective", function forge_single_objective(f: Frame) {
	let special_pick: Value = null, block_objective: Value = null, purge_objective: Value = null, robot_objective: Value = null, yandere_one: Value = null, yandere_two: Value = null;
	let $0: any;
	f.vars = () => [special_pick, block_objective, purge_objective, robot_objective, yandere_one, yandere_two, $0];
	f.dot = 1;
	$0 = (special_pick = rt.call(f, P("/proc/rand"), null, [1, 4]));
	if ($0 === 1) {
		rt.setFv(f, "owner", (block_objective = rt.new_(f, T("/datum/objective/block"), [])), rt.sv(f, "owner"));
		rt.callSrc(f, "add_objective", [live(block_objective)]);
	} else if ($0 === 2) {
		rt.setFv(f, "owner", (purge_objective = rt.new_(f, T("/datum/objective/purge"), [])), rt.sv(f, "owner"));
		rt.callSrc(f, "add_objective", [live(purge_objective)]);
	} else if ($0 === 3) {
		rt.setFv(f, "owner", (robot_objective = rt.new_(f, T("/datum/objective/robot_army"), [])), rt.sv(f, "owner"));
		rt.callSrc(f, "add_objective", [live(robot_objective)]);
	} else if ($0 === 4) {
		rt.setFv(f, "owner", (yandere_one = rt.new_(f, T("/datum/objective/protect"), [])), rt.sv(f, "owner"));
		rt.callSrc(f, "add_objective", [live(yandere_one)]);
		rt.callName(f, live(yandere_one), "find_target", []);
		rt.setFv(f, "owner", (yandere_two = rt.new_(f, T("/datum/objective/maroon"), [])), rt.sv(f, "owner"));
		rt.setFv(f, "target", live(yandere_two), rt.fv(f, "target", live(yandere_one)));
		rt.callName(f, live(yandere_two), "update_explanation_text", []);
		rt.callSrc(f, "add_objective", [live(yandere_two)]);
		f.dot = 2;
	}
	return f.dot;
});

// /datum/antagonist/traitor/proc/greet  (code/datums/antagonists/datum_traitor.dm:238)
rt.def("/datum/antagonist/traitor/proc/greet", function greet(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), fmt("<B><font size=3 color=red>You are the ＀.</font></B>", [rt.fv(f, "special_role", rt.sv(f, "owner"))])]);
	rt.callName(f, rt.sv(f, "owner"), "announce_objectives", []);
	if (!truthy(rt.sv(f, "should_give_codewords"))) return f.dot;
	rt.callSrc(f, "give_codewords", []);
	return f.dot;
});

// /datum/antagonist/traitor/proc/finalize_traitor  (code/datums/antagonists/datum_traitor.dm:244)
rt.def("/datum/antagonist/traitor/proc/finalize_traitor", function finalize_traitor(f: Frame) {
	rt.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_traitor_icons_added", [rt.sv(f, "owner")]);
	return live(f.dot);
});

// /datum/antagonist/traitor/AI/proc/finalize_traitor  (code/datums/antagonists/datum_traitor.dm:248)  may sleep
rt.def("/datum/antagonist/traitor/AI/proc/finalize_traitor", function* finalize_traitor(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "add_law_zero");
	yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "playsound_local", [null, rt.getStep(f, rt.fv(f, "current", rt.sv(f, "owner")), 0), null, rt.rsc("sound/ambience/antag/malf.ogg"), null, 100, null, 0, "pressure_affected", 0], rt.Args.Named);
	yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "grant_language", [T("/datum/language/codespeak")]);
	return f.dot;
}, true);

// /datum/antagonist/traitor/human/proc/finalize_traitor  (code/datums/antagonists/datum_traitor.dm:254)  may sleep
rt.def("/datum/antagonist/traitor/human/proc/finalize_traitor", function* finalize_traitor(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "should_equip"))) {
		yield* g.srcCall(f, "equip", rt.sv(f, "silent"));
	}
	yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "playsound_local", [null, rt.getStep(f, rt.fv(f, "current", rt.sv(f, "owner")), 0), null, rt.rsc("sound/ambience/antag/tatoralert.ogg"), null, 100, null, 0, "pressure_affected", 0], rt.Args.Named);
	return f.dot;
}, true);

// /datum/antagonist/traitor/proc/give_codewords  (code/datums/antagonists/datum_traitor.dm:260)
rt.def("/datum/antagonist/traitor/proc/give_codewords", function give_codewords(f: Frame) {
	let traitor_mob: Value = null;
	f.vars = () => [traitor_mob];
	if (!truthy(rt.fv(f, "current", rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/to_chat"), null, [(traitor_mob = rt.fv(f, "current", rt.sv(f, "owner"))), "<U><B>The Syndicate provided you with the following information on how to identify their agents:</B></U>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(traitor_mob), fmt("<B>Code Phrase</B>: <span class='danger'>＀</span>", [rt.gl("syndicate_code_phrase")])]);
	rt.call(f, P("/proc/to_chat"), null, [live(traitor_mob), fmt("<B>Code Response</B>: <span class='danger'>＀</span>", [rt.gl("syndicate_code_response")])]);
	rt.callName(f, rt.fv(f, "mind", live(traitor_mob)), "store_memory", [fmt("<b>Code Phrase</b>: ＀", [rt.gl("syndicate_code_phrase")])]);
	rt.callName(f, rt.fv(f, "mind", live(traitor_mob)), "store_memory", [fmt("<b>Code Response</b>: ＀", [rt.gl("syndicate_code_response")])]);
	rt.call(f, P("/proc/to_chat"), null, [live(traitor_mob), "Use the code words in the order provided, during regular conversation, to identify other agents. Proceed with caution, however, as everyone is a potential foe."]);
	return f.dot;
});

// /datum/antagonist/traitor/AI/proc/add_law_zero  (code/datums/antagonists/datum_traitor.dm:275)  may sleep
rt.def("/datum/antagonist/traitor/AI/proc/add_law_zero", function* add_law_zero(f: Frame) {
	let killer: Value = null, law: Value = null, law_borg: Value = null;
	f.vars = () => [killer, law, law_borg];
	if ((!truthy((killer = rt.fv(f, "current", rt.sv(f, "owner")))) || !truthy((rt.istype(live(killer), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
		return live(f.dot);
	}
	law = "Accomplish your objectives at all costs.";
	law_borg = "Accomplish your AI's objectives at all costs.";
	yield* g.callName(f, live(killer), "set_zeroth_law", [live(law), live(law_borg)]);
	yield* g.callName(f, live(killer), "set_syndie_radio", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(killer), "Your radio has been upgraded! Use :t to speak on an encrypted channel with Syndicate Agents!"]);
	yield* g.callName(f, live(killer), "add_malf_picker", []);
	return f.dot;
}, true);

// /datum/antagonist/traitor/human/proc/equip  (code/datums/antagonists/datum_traitor.dm:286)  may sleep
rt.def("/datum/antagonist/traitor/human/proc/equip", function* equip(f: Frame, silent: Value) {
	f.vars = () => [silent];
	if (live(silent) === null) {
		silent = 0;
	}
	yield* g.callName(f, rt.sv(f, "owner"), "equip_traitor", [rt.sv(f, "employer"), live(silent)]);
	return f.dot;
}, true);

// /datum/antagonist/traitor/human/proc/assign_exchange_role  (code/datums/antagonists/datum_traitor.dm:290)  may sleep
rt.def("/datum/antagonist/traitor/human/proc/assign_exchange_role", function* assign_exchange_role(f: Frame) {
	let faction: Value = null, exchange_objective: Value = null, backstab_objective: Value = null, mob: Value = null, folder: Value = null, slots: Value = null, where: Value = null, equipped_slot: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [faction, exchange_objective, backstab_objective, mob, folder, slots, where, equipped_slot, $0, $1, $2];
	faction = "red";
	if (isEqual(rt.sv(f, "owner"), rt.gv(f, "exchange_blue", rt.fv(f, "mode", rt.gl("SSticker"))))) {
		faction = "blue";
	}
	$0 = (exchange_objective = (yield* g.new_(f, T("/datum/objective/steal/exchange"), [])));
	$1 = live(faction);
	if (isEqual(live(faction), "red")) {
		$2 = rt.gv(f, "exchange_blue", rt.fv(f, "mode", rt.gl("SSticker")));
	} else {
		$2 = rt.gv(f, "exchange_red", rt.fv(f, "mode", rt.gl("SSticker")));
	}
	yield* g.callName(f, $0, "set_faction", [$1, $2]);
	rt.setFv(f, "owner", live(exchange_objective), rt.sv(f, "owner"));
	yield* g.srcCall(f, "add_objective", live(exchange_objective));
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.callName(f, (backstab_objective = (yield* g.new_(f, T("/datum/objective/steal/exchange/backstab"), []))), "set_faction", [live(faction)]);
		rt.setFv(f, "owner", live(backstab_objective), rt.sv(f, "owner"));
		yield* g.srcCall(f, "add_objective", live(backstab_objective));
	}
	mob = rt.fv(f, "current", rt.sv(f, "owner"));
	folder = null;
	if (isEqual(rt.sv(f, "owner"), rt.gv(f, "exchange_red", rt.fv(f, "mode", rt.gl("SSticker"))))) {
		folder = (yield* g.new_(f, T("/obj/item/weapon/folder/syndicate/red"), [rt.fv(f, "loc", live(mob))]));
	} else {
		folder = (yield* g.new_(f, T("/obj/item/weapon/folder/syndicate/blue"), [rt.fv(f, "loc", live(mob))]));
	}
	slots = rt.alist(f, ["backpack", 18, "left pocket", 15, "right pocket", 16]);
	where = "At your feet";
	if (truthy((equipped_slot = (yield* g.callName(f, live(mob), "equip_in_one_of_slots", [live(folder), live(slots)]))))) {
		where = fmt("In your ＀", [live(equipped_slot)]);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(mob), fmt("<BR><BR><span class='info'>＀ is a folder containing <b>secret documents</b> that another Syndicate group wants. We have set up a meeting with one of their agents on station to make an exchange. Exercise extreme caution as they cannot be trusted and may be hostile.</span><BR>", [live(where)])]);
	return f.dot;
}, true);
