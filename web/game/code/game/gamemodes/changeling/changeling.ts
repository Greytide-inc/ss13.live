// From code/game/gamemodes/changeling/changeling.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalpossible_changeling_IDs  (code/game/gamemodes/changeling/changeling.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobalpossible_changeling_IDs", function InitGlobalpossible_changeling_IDs(f: Frame) {
	rt.setGl("possible_changeling_IDs", rt.list("Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega"));
	rt.modSrcVar(f, "gvars_datum_init_order", "possible_changeling_IDs", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalslots  (code/game/gamemodes/changeling/changeling.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalslots", function InitGlobalslots(f: Frame) {
	rt.setGl("slots", rt.list("head", "wear_mask", "back", "wear_suit", "w_uniform", "shoes", "belt", "gloves", "glasses", "ears", "wear_id", "s_store"));
	rt.modSrcVar(f, "gvars_datum_init_order", "slots", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalslot2slot  (code/game/gamemodes/changeling/changeling.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalslot2slot", function InitGlobalslot2slot(f: Frame) {
	rt.setGl("slot2slot", rt.alist(f, ["head", 11, "wear_mask", 2, "neck", 10, "back", 1, "wear_suit", 13, "w_uniform", 14, "shoes", 12, "belt", 5, "gloves", 9, "glasses", 8, "ears", 7, "wear_id", 6, "s_store", 17]));
	rt.modSrcVar(f, "gvars_datum_init_order", "slot2slot", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalslot2type  (code/game/gamemodes/changeling/changeling.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalslot2type", function InitGlobalslot2type(f: Frame) {
	rt.setGl("slot2type", rt.alist(f, ["head", T("/obj/item/clothing/head/changeling"), "wear_mask", T("/obj/item/clothing/mask/changeling"), "back", T("/obj/item/changeling"), "wear_suit", T("/obj/item/clothing/suit/changeling"), "w_uniform", T("/obj/item/clothing/under/changeling"), "shoes", T("/obj/item/clothing/shoes/changeling"), "belt", T("/obj/item/changeling"), "gloves", T("/obj/item/clothing/gloves/changeling"), "glasses", T("/obj/item/clothing/glasses/changeling"), "ears", T("/obj/item/changeling"), "wear_id", T("/obj/item/changeling"), "s_store", T("/obj/item/changeling")]));
	rt.modSrcVar(f, "gvars_datum_init_order", "slot2type", add);
	return f.dot;
});

rt.type(1083, "/datum/game_mode/changeling", "/datum/game_mode", {
	prob_int_murder_target: 50,
	prob_right_murder_target_l: 25,
	prob_right_murder_target_h: 50,
	prob_int_item: 50,
	prob_right_item_l: 25,
	prob_right_item_h: 50,
	prob_int_sab_target: 50,
	prob_right_sab_target_l: 25,
	prob_right_sab_target_h: 50,
	prob_right_killer_l: 25,
	prob_right_killer_h: 50,
	prob_right_objective_l: 25,
	prob_right_objective_h: 50,
	changeling_amount: 4,
	changeling_team_objective_type: null,
	name: "changeling",
	config_tag: "changeling",
	antag_flag: "changeling",
	restricted_jobs: null,
	protected_jobs: null,
	required_players: 15,
	required_enemies: 1,
	recommended_enemies: 4,
	reroll_friendly: 1,
	announce_span: "green",
	announce_text: "Alien changelings have infiltrated the crew!\n<span class='green'>Changelings</span>: Accomplish the objectives assigned to you.\n<span class='notice'>Crew</span>: Root out and eliminate the changeling menace.",
}, { const: ["prob_int_murder_target","prob_right_murder_target_l","prob_right_murder_target_h","prob_int_item","prob_right_item_l","prob_right_item_h","prob_int_sab_target","prob_right_sab_target_l","prob_right_sab_target_h","prob_right_killer_l","prob_right_killer_h","prob_right_objective_l","prob_right_objective_h","changeling_amount"] });

// /datum/game_mode/changeling/proc/pre_setup  (code/game/gamemodes/changeling/changeling.dm:54)
rt.def("/datum/game_mode/changeling/proc/pre_setup", function pre_setup(f: Frame) {
	let num_changelings: Value = null, i: Value = null, changeling: Value = null;
	f.vars = () => [num_changelings, i, changeling];
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", rt.sv(f, "protected_jobs"), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", "Assistant", add);
	}
	num_changelings = 1;
	if (truthy(rt.fv(f, "changeling_scaling_coeff", rt.gl("config")))) {
		num_changelings = rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [add(rt.call(f, P("/proc/round"), null, [divide(rt.callSrc(f, "num_players", []), multiply(rt.fv(f, "changeling_scaling_coeff", rt.gl("config")), 2))]), 2), rt.call(f, P("/proc/round"), null, [divide(rt.callSrc(f, "num_players", []), rt.fv(f, "changeling_scaling_coeff", rt.gl("config")))])])]);
	} else {
		num_changelings = rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [rt.callSrc(f, "num_players", []), 4])]);
	}
	if (rt.gt(rt.len(f, rt.sv(f, "antag_candidates")), 0)) {
		i = null;
		i = 0;
		while (rt.lt(live(i), live(num_changelings))) {
			if (!truthy(rt.len(f, rt.sv(f, "antag_candidates")))) {
				break;
			}
			(rt.modSrcVar(f, "antag_candidates", (changeling = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "antag_candidates")])), subtract));
			rt.modSrcVar(f, "changelings", live(changeling), add);
			rt.setFv(f, "special_role", live(changeling), "Changeling");
			rt.setFv(f, "restricted_roles", live(changeling), rt.sv(f, "restricted_jobs"));
			i = rt.inc(live(i), 1);
		}
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /datum/game_mode/changeling/proc/post_setup  (code/game/gamemodes/changeling/changeling.dm:83)  may sleep
rt.def("/datum/game_mode/changeling/proc/post_setup", function* post_setup(f: Frame) {
	let team_objectives: Value = null, possible_team_objectives: Value = null, _T: Value = null, CTO: Value = null, changeling: Value = null;
	let $e: any;
	f.vars = () => [team_objectives, possible_team_objectives, _T, CTO, changeling, $e];
	team_objectives = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/objective/changeling_team_objective")])), T("/datum/objective/changeling_team_objective"));
	possible_team_objectives = rt.list();
	_T = null;
	rt.forList(f, 0, live(team_objectives));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		CTO = live(_T);
		if (rt.ge(rt.len(f, rt.sv(f, "changelings")), rt.initial(f, live(CTO), "min_lings"))) {
			possible_team_objectives = rt.modify(live(possible_team_objectives), live(_T), add);
		}
	}
	rt.endFor(f, 0);
	if ((truthy(rt.len(f, live(possible_team_objectives))) && truthy(rt.op(f, "Prob", [], [multiply(20, rt.len(f, rt.sv(f, "changelings")))])))) {
		rt.setSv(f, "changeling_team_objective_type", rt.op(f, "PickUnweighted", [1], [live(possible_team_objectives)]));
	}
	changeling = null;
	rt.forList(f, 0, rt.sv(f, "changelings"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		changeling = $e;
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ (ckey) has been selected as a changeling", [rt.fv(f, "key", live(changeling))])]);
		yield* g.callName(f, rt.fv(f, "current", live(changeling)), "make_changeling", []);
		yield* g.srcCall(f, "forge_changeling_objectives", live(changeling));
		yield* g.srcCall(f, "greet_changeling", live(changeling));
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_changeling_icons_added", [live(changeling)]);
	}
	rt.endFor(f, 0);
	rt.modSrcVar(f, "modePlayer", rt.sv(f, "changelings"), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/game_mode/changeling/proc/make_antag_chance  (code/game/gamemodes/changeling/changeling.dm:104)  may sleep
rt.def("/datum/game_mode/changeling/proc/make_antag_chance", function* make_antag_chance(f: Frame, character: Value) {
	let changelingcap: Value = null;
	f.vars = () => [character, changelingcap];
	changelingcap = (yield* g.call(f, P("/proc/min"), null, [add((yield* g.call(f, P("/proc/round"), null, [divide(rt.len(f, rt.gl("joined_player_list")), multiply(rt.fv(f, "changeling_scaling_coeff", rt.gl("config")), 2))])), 2), (yield* g.call(f, P("/proc/round"), null, [divide(rt.len(f, rt.gl("joined_player_list")), rt.fv(f, "changeling_scaling_coeff", rt.gl("config")))]))]));
	if (rt.ge(rt.getLen(f, rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))), live(changelingcap))) {
		return live(f.dot);
	}
	if (!(rt.le(rt.getLen(f, rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))), subtract(live(changelingcap), 2)) || truthy(rt.op(f, "Prob", [], [subtract(100, multiply(rt.fv(f, "changeling_scaling_coeff", rt.gl("config")), 2))])))) return f.dot;
	if (!truthy((rt.isIn(f, "changeling", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(character))))) ? 1 : 0))) return f.dot;
	if (!(!truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(character), "changeling"]))) && !truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(character), "Syndicate"]))))) return f.dot;
	if (truthy((rt.isIn(f, rt.fv(f, "job", live(character)), rt.sv(f, "restricted_jobs")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, rt.fv(f, "mind", live(character)), "make_Changling", []);
	return f.dot;
}, true);

// /datum/game_mode/proc/forge_changeling_objectives  (code/game/gamemodes/changeling/changeling.dm:122)  may sleep
rt.def("/datum/game_mode/proc/forge_changeling_objectives", function* forge_changeling_objectives(f: Frame, changeling: Value, team_mode: Value) {
	let escape_objective_possible: Value = null, CTO: Value = null, absorb_objective: Value = null, steal_objective: Value = null, active_ais: Value = null, destroy_objective: Value = null, kill_objective: Value = null, maroon_objective: Value = null, identity_theft: Value = null, escape_objective: Value = null, identity_theft_3: Value = null;
	let $e: any;
	f.vars = () => [changeling, team_mode, escape_objective_possible, CTO, absorb_objective, steal_objective, active_ais, destroy_objective, kill_objective, maroon_objective, identity_theft, escape_objective, identity_theft_3, $e];
	if (live(team_mode) === null) {
		team_mode = 0;
	}
	escape_objective_possible = 1;
	CTO = null;
	rt.forList(f, 0, rt.fv(f, "objectives", live(changeling)), T("/datum/objective/changeling_team_objective"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CTO = $e;
		if (!truthy(rt.fv(f, "escape_objective_compatible", live(CTO)))) {
			escape_objective_possible = 0;
			break;
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "owner", (absorb_objective = (yield* g.new_(f, T("/datum/objective/absorb"), []))), live(changeling));
	yield* g.callName(f, live(absorb_objective), "gen_amount_goal", [6, 8]);
	rt.modField(f, live(changeling), "objectives", live(absorb_objective), add);
	if (truthy(rt.op(f, "Prob", [], [60]))) {
		rt.setFv(f, "owner", (steal_objective = (yield* g.new_(f, T("/datum/objective/steal"), []))), live(changeling));
		yield* g.callName(f, live(steal_objective), "find_target", []);
		rt.modField(f, live(changeling), "objectives", live(steal_objective), add);
	}
	if ((truthy(rt.getLen(f, (active_ais = (yield* g.call(f, P("/proc/active_ais"), null, []))))) && truthy(rt.op(f, "Prob", [], [divide(100, rt.len(f, rt.gl("joined_player_list")))])))) {
		rt.setFv(f, "owner", (destroy_objective = (yield* g.new_(f, T("/datum/objective/destroy"), []))), live(changeling));
		yield* g.callName(f, live(destroy_objective), "find_target", []);
		rt.modField(f, live(changeling), "objectives", live(destroy_objective), add);
	} else {
		if (truthy(rt.op(f, "Prob", [], [70]))) {
			rt.setFv(f, "owner", (kill_objective = (yield* g.new_(f, T("/datum/objective/assassinate"), []))), live(changeling));
			if (truthy(live(team_mode))) {
				yield* g.callName(f, live(kill_objective), "find_target_by_role", ["role", "Changeling", "role_type", 1, "invert", 1], rt.Args.Named);
			} else {
				yield* g.callName(f, live(kill_objective), "find_target", []);
			}
			rt.modField(f, live(changeling), "objectives", live(kill_objective), add);
		} else {
			rt.setFv(f, "owner", (maroon_objective = (yield* g.new_(f, T("/datum/objective/maroon"), []))), live(changeling));
			if (truthy(live(team_mode))) {
				yield* g.callName(f, live(maroon_objective), "find_target_by_role", ["role", "Changeling", "role_type", 1, "invert", 1], rt.Args.Named);
			} else {
				yield* g.callName(f, live(maroon_objective), "find_target", []);
			}
			rt.modField(f, live(changeling), "objectives", live(maroon_objective), add);
			if ((!truthy(rt.locateIn(f, T("/datum/objective/escape"), rt.fv(f, "objectives", live(changeling)))) && truthy(live(escape_objective_possible)))) {
				rt.setFv(f, "owner", (identity_theft = (yield* g.new_(f, T("/datum/objective/escape/escape_with_identity"), []))), live(changeling));
				rt.setFv(f, "target", live(identity_theft), rt.fv(f, "target", live(maroon_objective)));
				yield* g.callName(f, live(identity_theft), "update_explanation_text", []);
				rt.modField(f, live(changeling), "objectives", live(identity_theft), add);
				escape_objective_possible = 0;
			}
		}
	}
	if (!(!truthy(rt.locateIn(f, T("/datum/objective/escape"), rt.fv(f, "objectives", live(changeling)))) && truthy(live(escape_objective_possible)))) return f.dot;
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		rt.setFv(f, "owner", (escape_objective = (yield* g.new_(f, T("/datum/objective/escape"), []))), live(changeling));
		rt.modField(f, live(changeling), "objectives", live(escape_objective), add);
	} else {
		rt.setFv(f, "owner", (identity_theft_3 = (yield* g.new_(f, T("/datum/objective/escape/escape_with_identity"), []))), live(changeling));
		if (truthy(live(team_mode))) {
			yield* g.callName(f, live(identity_theft_3), "find_target_by_role", ["role", "Changeling", "role_type", 1, "invert", 1], rt.Args.Named);
		} else {
			yield* g.callName(f, live(identity_theft_3), "find_target", []);
		}
		rt.modField(f, live(changeling), "objectives", live(identity_theft_3), add);
	}
	escape_objective_possible = 0;
	return f.dot;
}, true);

// /datum/game_mode/changeling/proc/forge_changeling_objectives  (code/game/gamemodes/changeling/changeling.dm:189)  may sleep
rt.def("/datum/game_mode/changeling/proc/forge_changeling_objectives", function* forge_changeling_objectives(f: Frame, changeling: Value) {
	let team_objective: Value = null;
	f.vars = () => [changeling, team_objective];
	if (truthy(rt.sv(f, "changeling_team_objective_type"))) {
		rt.setFv(f, "owner", (team_objective = (yield* g.new_(f, rt.sv(f, "changeling_team_objective_type"), []))), live(changeling));
		rt.modField(f, live(changeling), "objectives", live(team_objective), add);
		yield* g.callSuper(f, [live(changeling), 1]);
	} else {
		yield* g.callSuper(f, [live(changeling), 0]);
	}
	return f.dot;
}, true);

// /datum/game_mode/proc/greet_changeling  (code/game/gamemodes/changeling/changeling.dm:200)  may sleep
rt.def("/datum/game_mode/proc/greet_changeling", function* greet_changeling(f: Frame, changeling: Value, you_are: Value) {
	let H: Value = null, obj_count: Value = null, objective: Value = null;
	let $e: any;
	f.vars = () => [changeling, you_are, H, obj_count, objective, $e];
	if (live(you_are) === null) {
		you_are = 1;
	}
	if (truthy(live(you_are))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(changeling)), fmt("<span class='boldannounce'>You are ＀, a changeling! You have absorbed and taken the form of a human.</span>", [rt.gv(f, "changelingID", rt.fv(f, "changeling", live(changeling)))])]);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(changeling)), "<span class='boldannounce'>Use say \":g message\" to communicate with your fellow changelings.</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(changeling)), "<b>You must complete the following tasks:</b>"]);
	yield* g.callName(f, rt.fv(f, "current", live(changeling)), "playsound_local", [null, rt.getStep(f, rt.fv(f, "current", live(changeling)), 0), null, rt.rsc("sound/ambience/antag/ling_aler.ogg"), null, 100, null, 0, "pressure_affected", 0], rt.Args.Named);
	if (truthy(rt.gv(f, "mind", rt.fv(f, "current", live(changeling))))) {
		if (isEqual(rt.gv(f, "assigned_role", rt.gv(f, "mind", (H = rt.fv(f, "current", live(changeling))))), "Clown")) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "You have evolved beyond your clownish nature, allowing you to wield weapons without harming yourself."]);
			yield* g.callName(f, rt.fv(f, "dna", live(H)), "remove_mutation", ["Clumsiness"]);
		}
	}
	obj_count = 1;
	objective = null;
	rt.forList(f, 0, rt.fv(f, "objectives", live(changeling)), T("/datum/objective"));
	while (($e = rt.next(f, 0)) !== undefined) {
		objective = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(changeling)), fmt("<b>Objective #＀</b>: ＀", [live(obj_count), rt.fv(f, "explanation_text", live(objective))])]);
		obj_count = rt.inc(live(obj_count), 1);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

// /datum/game_mode/proc/auto_declare_completion_changeling  (code/game/gamemodes/changeling/changeling.dm:240)
rt.def("/datum/game_mode/proc/auto_declare_completion_changeling", function auto_declare_completion_changeling(f: Frame) {
	let text: Value = null, changeling: Value = null, changelingwin: Value = null, count: Value = null, objective: Value = null;
	let $e: any;
	f.vars = () => [text, changeling, changelingwin, count, objective, $e];
	if (truthy(rt.len(f, rt.sv(f, "changelings")))) {
		text = "<br><font size=3><b>The changelings were:</b></font>";
		changeling = null;
		rt.forList(f, 0, rt.sv(f, "changelings"), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			changeling = $e;
			changelingwin = 1;
			if (!truthy(rt.fv(f, "current", live(changeling)))) {
				changelingwin = 0;
			}
			text = rt.modify(live(text), rt.callSrc(f, "printplayer", [live(changeling)]), add);
			text = rt.modify(live(text), fmt("<br><b>Changeling ID:</b> ＀.", [rt.gv(f, "changelingID", rt.fv(f, "changeling", live(changeling)))]), add);
			text = rt.modify(live(text), fmt("<br><b>Genomes Extracted:</b> ＀", [rt.gv(f, "absorbedcount", rt.fv(f, "changeling", live(changeling)))]), add);
			if (truthy(rt.getLen(f, rt.fv(f, "objectives", live(changeling))))) {
				count = 1;
				objective = null;
				rt.forList(f, 1, rt.fv(f, "objectives", live(changeling)), T("/datum/objective"));
				while (($e = rt.next(f, 1)) !== undefined) {
					objective = $e;
					if (truthy(rt.callName(f, live(objective), "check_completion", []))) {
						text = rt.modify(live(text), fmt("<br><b>Objective #＀</b>: ＀ <font color='green'><b>Success!</b></font>", [live(count), rt.fv(f, "explanation_text", live(objective))]), add);
					} else {
						text = rt.modify(live(text), fmt("<br><b>Objective #＀</b>: ＀ <span class='danger'>Fail.</span>", [live(count), rt.fv(f, "explanation_text", live(objective))]), add);
						changelingwin = 0;
					}
					count = rt.inc(live(count), 1);
				}
				rt.endFor(f, 1);
			}
			if (truthy(live(changelingwin))) {
				text = rt.modify(live(text), "<br><font color='green'><b>The changeling was successful!</b></font>", add);
			} else {
				text = rt.modify(live(text), "<br><span class='boldannounce'>The changeling has failed.</span>", add);
			}
			text = rt.modify(live(text), "<br>", add);
		}
		rt.endFor(f, 0);
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text)]);
	}
	return 1;
});

rt.type(1195, "/datum/changeling", "/datum", {
	stored_profiles: null,
	first_prof: null,
	dna_max: 6,
	absorbedcount: 0,
	chem_charges: 20,
	chem_storage: 75,
	chem_recharge_rate: 1,
	chem_recharge_slowdown: 0,
	sting_range: 2,
	changelingID: "Changeling",
	geneticdamage: 0,
	isabsorbing: 0,
	islinking: 0,
	geneticpoints: 10,
	purchasedpowers: null,
	mimicing: "",
	canrespec: 0,
	changeling_speak: 0,
	chosen_dna: null,
	chosen_sting: null,
	cellular_emporium: null,
	emporium_action: null,
});

// /datum/changeling/proc/<init>  (code/game/gamemodes/changeling/changeling.dm:279)
rt.def("/datum/changeling/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stored_profiles", rt.list());
	$0 = $0;
	rt.setSv(f, "purchasedpowers", rt.list());
	return f.dot;
});

// /datum/changeling/proc/New  (code/game/gamemodes/changeling/changeling.dm:305)  may sleep
rt.def("/datum/changeling/proc/New", function* New(f: Frame) {
	let honorific: Value = null;
	f.vars = () => [honorific];
	if (live(f.args[0]) === null) {
		f.args[0] = "female";
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	honorific = null;
	if (isEqual(live(f.args[0]), "female")) {
		honorific = "Ms.";
	} else {
		honorific = "Mr.";
	}
	if (truthy(rt.len(f, rt.gl("possible_changeling_IDs")))) {
		rt.setSv(f, "changelingID", rt.op(f, "PickUnweighted", [1], [rt.gl("possible_changeling_IDs")]));
		(rt.modGl("possible_changeling_IDs", rt.sv(f, "changelingID"), subtract));
		rt.setSv(f, "changelingID", fmt("＀ ＀", [live(honorific), rt.sv(f, "changelingID")]));
	} else {
		rt.setSv(f, "changelingID", fmt("＀ ＀", [live(honorific), (yield* g.call(f, P("/proc/rand"), null, [1, 999]))]));
	}
	rt.setSv(f, "cellular_emporium", (yield* g.new_(f, T("/datum/cellular_emporium"), [live(f.src)])));
	rt.setSv(f, "emporium_action", (yield* g.new_(f, T("/datum/action/innate/cellular_emporium"), [rt.sv(f, "cellular_emporium")])));
	return f.dot;
}, true, { args: ["gender"] });

// /datum/changeling/proc/Destroy  (code/game/gamemodes/changeling/changeling.dm:322)  may sleep
rt.def("/datum/changeling/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cellular_emporium")]);
	rt.setSv(f, "cellular_emporium", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "emporium_action")]);
	rt.setSv(f, "emporium_action", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /datum/changeling/proc/regenerate  (code/game/gamemodes/changeling/changeling.dm:329)  may sleep
rt.def("/datum/changeling/proc/regenerate", function* regenerate(f: Frame, the_ling: Value) {
	f.vars = () => [the_ling];
	if (!truthy((rt.istype(live(the_ling), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, rt.sv(f, "emporium_action"), "Grant", [live(the_ling)]);
	if (isEqual(rt.fv(f, "stat", live(the_ling)), 2)) {
		rt.setSv(f, "chem_charges", (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [0, subtract(add(rt.sv(f, "chem_charges"), rt.sv(f, "chem_recharge_rate")), rt.sv(f, "chem_recharge_slowdown"))])), multiply(rt.sv(f, "chem_storage"), 0.5)])));
		rt.setSv(f, "geneticdamage", (yield* g.call(f, P("/proc/max"), null, [50, subtract(rt.sv(f, "geneticdamage"), 1)])));
	} else {
		rt.setSv(f, "chem_charges", (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [0, subtract(add(rt.sv(f, "chem_charges"), rt.sv(f, "chem_recharge_rate")), rt.sv(f, "chem_recharge_slowdown"))])), rt.sv(f, "chem_storage")])));
		rt.setSv(f, "geneticdamage", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "geneticdamage"), 1)])));
	}
	return f.dot;
}, true);

// /datum/changeling/proc/get_dna  (code/game/gamemodes/changeling/changeling.dm:340)
rt.def("/datum/changeling/proc/get_dna", function get_dna(f: Frame, dna_owner: Value) {
	let prof: Value = null;
	let $e: any;
	f.vars = () => [prof, $e];
	prof = null;
	rt.forList(f, 0, rt.sv(f, "stored_profiles"), T("/datum/changelingprofile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		prof = $e;
		if (isEqual(live(dna_owner), rt.fv(f, "name", live(prof)))) {
			return live(prof);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/changeling/proc/has_dna  (code/game/gamemodes/changeling/changeling.dm:345)
rt.def("/datum/changeling/proc/has_dna", function has_dna(f: Frame, tDNA: Value) {
	let prof: Value = null;
	let $e: any;
	f.vars = () => [prof, $e];
	prof = null;
	rt.forList(f, 0, rt.sv(f, "stored_profiles"), T("/datum/changelingprofile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		prof = $e;
		if (truthy(rt.callName(f, live(tDNA), "is_same_as", [rt.fv(f, "dna", live(prof))]))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /datum/changeling/proc/can_absorb_dna  (code/game/gamemodes/changeling/changeling.dm:351)
rt.def("/datum/changeling/proc/can_absorb_dna", function can_absorb_dna(f: Frame, user: Value, target: Value, verbose: Value) {
	let prof: Value = null;
	f.vars = () => [verbose, prof];
	if (live(verbose) === null) {
		verbose = 1;
	}
	if (truthy(rt.len(f, rt.sv(f, "stored_profiles")))) {
		if ((isEqual(rt.gv(f, "dna", (prof = rt.index(rt.sv(f, "stored_profiles"), 1))), rt.fv(f, "dna", live(user))) && rt.ge(rt.len(f, rt.sv(f, "stored_profiles")), rt.sv(f, "dna_max")))) {
			if (truthy(live(verbose))) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>We have reached our capacity to store genetic information! We must transform before absorbing more.</span>"]);
			}
			return live(f.dot);
		}
	}
	if (!truthy(live(target))) {
		return live(f.dot);
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(target)), 128)) || truthy(rt.bitAnd(rt.fv(f, "disabilities", live(target)), 64)))) {
		if (truthy(live(verbose))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>DNA of ＀ is ruined beyond usability!</span>", [live(target)])]);
		}
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy(live(verbose))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>We could gain no benefit from absorbing a lesser creature.</span>"]);
		}
		return live(f.dot);
	}
	if (truthy(rt.callSrc(f, "has_dna", [rt.fv(f, "dna", live(target))]))) {
		if (truthy(live(verbose))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>We already have this DNA in storage!</span>"]);
		}
		return live(f.dot);
	}
	if (!truthy(rt.callName(f, live(target), "has_dna", []))) {
		if (truthy(live(verbose))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is not compatible with our biology.</span>", [live(target)])]);
		}
		return live(f.dot);
	}
	return 1;
});

// /datum/changeling/proc/create_profile  (code/game/gamemodes/changeling/changeling.dm:378)  may sleep
rt.def("/datum/changeling/proc/create_profile", function* create_profile(f: Frame, H: Value, user: Value, protect: Value) {
	let prof: Value = null, new_dna: Value = null, slots: Value = null, slot: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [H, user, protect, prof, new_dna, slots, slot, I, $e];
	if (live(protect) === null) {
		protect = 0;
	}
	prof = (yield* g.new_(f, T("/datum/changelingprofile"), []));
	rt.setFv(f, "real_name", rt.fv(f, "dna", live(H)), rt.fv(f, "real_name", live(H)));
	new_dna = (yield* g.new_(f, rt.gv(f, "type", rt.fv(f, "dna", live(H))), []));
	yield* g.callName(f, rt.fv(f, "dna", live(H)), "copy_dna", [live(new_dna)]);
	rt.setFv(f, "dna", live(prof), live(new_dna));
	rt.setFv(f, "name", live(prof), rt.fv(f, "real_name", live(H)));
	rt.setFv(f, "protected", live(prof), live(protect));
	rt.setFv(f, "underwear", live(prof), rt.fv(f, "underwear", live(H)));
	rt.setFv(f, "undershirt", live(prof), rt.fv(f, "undershirt", live(H)));
	rt.setFv(f, "socks", live(prof), rt.fv(f, "socks", live(H)));
	slots = rt.list("head", "wear_mask", "back", "wear_suit", "w_uniform", "shoes", "belt", "gloves", "glasses", "ears", "wear_id", "s_store");
	slot = null;
	rt.forList(f, 0, live(slots));
	while (($e = rt.next(f, 0)) !== undefined) {
		slot = $e;
		if (truthy((rt.isIn(f, live(slot), rt.fv(f, "vars", live(H))) ? 1 : 0))) {
			if (!truthy((I = rt.index(rt.fv(f, "vars", live(H)), live(slot))))) {
				continue;
			}
			rt.setAt(rt.fv(f, "name_list", live(prof)), live(slot), rt.fv(f, "name", live(I)));
			rt.setAt(rt.fv(f, "appearance_list", live(prof)), live(slot), rt.fv(f, "appearance", live(I)));
			rt.setAt(rt.fv(f, "flags_cover_list", live(prof)), live(slot), rt.fv(f, "flags_cover", live(I)));
			rt.setAt(rt.fv(f, "item_color_list", live(prof)), live(slot), rt.fv(f, "item_color", live(I)));
			rt.setAt(rt.fv(f, "item_state_list", live(prof)), live(slot), rt.fv(f, "item_state", live(I)));
			rt.setAt(rt.fv(f, "exists_list", live(prof)), live(slot), 1);
		} else {
			continue;
		}
	}
	rt.endFor(f, 0);
	return live(prof);
}, true);

// /datum/changeling/proc/add_profile  (code/game/gamemodes/changeling/changeling.dm:409)
rt.def("/datum/changeling/proc/add_profile", function add_profile(f: Frame, prof: Value) {
	if (rt.gt(rt.len(f, rt.sv(f, "stored_profiles")), rt.sv(f, "dna_max"))) {
		if (!truthy(rt.callSrc(f, "push_out_profile", []))) {
			return live(f.dot);
		}
	}
	rt.modSrcVar(f, "stored_profiles", live(prof), add);
	rt.incSrcVar(f, "absorbedcount", 1, true);
	return f.dot;
});

// /datum/changeling/proc/add_new_profile  (code/game/gamemodes/changeling/changeling.dm:417)  may sleep
rt.def("/datum/changeling/proc/add_new_profile", function* add_new_profile(f: Frame, H: Value, user: Value, protect: Value) {
	let prof: Value = null;
	f.vars = () => [H, user, protect, prof];
	if (live(protect) === null) {
		protect = 0;
	}
	yield* g.srcCall(f, "add_profile", (prof = (yield* g.srcCall(f, "create_profile", live(H), live(protect)))));
	return live(prof);
}, true);

// /datum/changeling/proc/remove_profile  (code/game/gamemodes/changeling/changeling.dm:422)  may sleep
rt.def("/datum/changeling/proc/remove_profile", function* remove_profile(f: Frame, H: Value, force: Value) {
	let prof: Value = null;
	let $e: any;
	f.vars = () => [H, force, prof, $e];
	if (live(force) === null) {
		force = 0;
	}
	prof = null;
	rt.forList(f, 0, rt.sv(f, "stored_profiles"), T("/datum/changelingprofile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		prof = $e;
		if (isEqual(rt.fv(f, "real_name", live(H)), rt.fv(f, "name", live(prof)))) {
			if ((truthy(rt.fv(f, "protected", live(prof))) && !truthy(live(force)))) {
				continue;
			}
			(rt.modSrcVar(f, "stored_profiles", live(prof), subtract));
			yield* g.call(f, P("/proc/qdel"), null, [live(prof)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/changeling/proc/get_profile_to_remove  (code/game/gamemodes/changeling/changeling.dm:430)
rt.def("/datum/changeling/proc/get_profile_to_remove", function get_profile_to_remove(f: Frame) {
	let prof: Value = null;
	let $e: any;
	f.vars = () => [prof, $e];
	prof = null;
	rt.forList(f, 0, rt.sv(f, "stored_profiles"), T("/datum/changelingprofile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		prof = $e;
		if (!truthy(rt.fv(f, "protected", live(prof)))) {
			return live(prof);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/changeling/proc/push_out_profile  (code/game/gamemodes/changeling/changeling.dm:435)
rt.def("/datum/changeling/proc/push_out_profile", function push_out_profile(f: Frame) {
	let removeprofile: Value = null;
	f.vars = () => [removeprofile];
	if (truthy((removeprofile = rt.callSrc(f, "get_profile_to_remove", [])))) {
		(rt.modSrcVar(f, "stored_profiles", live(removeprofile), subtract));
		return 1;
	}
	return 0;
});

// /proc/changeling_transform  (code/game/gamemodes/changeling/changeling.dm:443)  may sleep
rt.def("/proc/changeling_transform", function* changeling_transform(f: Frame, user: Value, chosen_prof: Value) {
	let chosen_dna: Value = null, slot: Value = null, C: Value = null, equip: Value = null, thetype: Value = null;
	let $e: any;
	f.vars = () => [user, chosen_prof, chosen_dna, slot, C, equip, thetype, $e];
	chosen_dna = rt.fv(f, "dna", live(chosen_prof));
	rt.setFv(f, "real_name", live(user), rt.fv(f, "name", live(chosen_prof)));
	rt.setFv(f, "underwear", live(user), rt.fv(f, "underwear", live(chosen_prof)));
	rt.setFv(f, "undershirt", live(user), rt.fv(f, "undershirt", live(chosen_prof)));
	rt.setFv(f, "socks", live(user), rt.fv(f, "socks", live(chosen_prof)));
	yield* g.callName(f, live(chosen_dna), "transfer_identity", [live(user), 1]);
	yield* g.callName(f, live(user), "updateappearance", ["mutcolor_update", 1], rt.Args.Named);
	yield* g.callName(f, live(user), "update_body", []);
	yield* g.callName(f, live(user), "domutcheck", []);
	slot = null;
	rt.forList(f, 0, rt.gl("slots"));
	while (($e = rt.next(f, 0)) !== undefined) {
		slot = $e;
		if ((truthy(rt.op(f, "IsType", [], [rt.index(rt.fv(f, "vars", live(user)), live(slot)), rt.index(rt.gl("slot2type"), live(slot))])) && !truthy(rt.index(rt.fv(f, "exists_list", live(chosen_prof)), live(slot))))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.index(rt.fv(f, "vars", live(user)), live(slot))]);
			continue;
		}
		if (((truthy(rt.index(rt.fv(f, "vars", live(user)), live(slot))) && !truthy(rt.op(f, "IsType", [], [rt.index(rt.fv(f, "vars", live(user)), live(slot)), rt.index(rt.gl("slot2type"), live(slot))]))) || !truthy(rt.index(rt.fv(f, "exists_list", live(chosen_prof)), live(slot))))) {
			continue;
		}
		C = null;
		equip = 0;
		if (!truthy(rt.index(rt.fv(f, "vars", live(user)), live(slot)))) {
			thetype = rt.index(rt.gl("slot2type"), live(slot));
			equip = 1;
			C = (yield* g.new_(f, live(thetype), [live(user)]));
		} else {
			if (truthy(rt.op(f, "IsType", [], [rt.index(rt.fv(f, "vars", live(user)), live(slot)), rt.index(rt.gl("slot2type"), live(slot))]))) {
				C = rt.index(rt.fv(f, "vars", live(user)), live(slot));
			}
		}
		rt.setFv(f, "appearance", live(C), rt.index(rt.fv(f, "appearance_list", live(chosen_prof)), live(slot)));
		rt.setFv(f, "name", live(C), rt.index(rt.fv(f, "name_list", live(chosen_prof)), live(slot)));
		rt.setFv(f, "flags_cover", live(C), rt.index(rt.fv(f, "flags_cover_list", live(chosen_prof)), live(slot)));
		rt.setFv(f, "item_color", live(C), rt.index(rt.fv(f, "item_color_list", live(chosen_prof)), live(slot)));
		rt.setFv(f, "item_state", live(C), rt.index(rt.fv(f, "item_state_list", live(chosen_prof)), live(slot)));
		if (truthy(live(equip))) {
			yield* g.callName(f, live(user), "equip_to_slot_or_del", [live(C), rt.index(rt.gl("slot2slot"), live(slot))]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(user), "regenerate_icons", []);
	return f.dot;
}, true);

rt.type(1196, "/datum/changelingprofile", "/datum", {
	name: "a bug",
	protected: 0,
	dna: null,
	name_list: null,
	appearance_list: null,
	flags_cover_list: null,
	exists_list: null,
	item_color_list: null,
	item_state_list: null,
	underwear: null,
	undershirt: null,
	socks: null,
});

// /datum/changelingprofile/proc/<init>  (code/game/gamemodes/changeling/changeling.dm:488)
rt.def("/datum/changelingprofile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "name_list", rt.list());
	$0 = $0;
	rt.setSv(f, "appearance_list", rt.list());
	$0 = $0;
	rt.setSv(f, "flags_cover_list", rt.list());
	$0 = $0;
	rt.setSv(f, "exists_list", rt.list());
	$0 = $0;
	rt.setSv(f, "item_color_list", rt.list());
	$0 = $0;
	rt.setSv(f, "item_state_list", rt.list());
	return f.dot;
});

// /datum/changelingprofile/proc/Destroy  (code/game/gamemodes/changeling/changeling.dm:500)  may sleep
rt.def("/datum/changelingprofile/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "dna")]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /datum/changelingprofile/proc/copy_profile  (code/game/gamemodes/changeling/changeling.dm:506)  may sleep
rt.def("/datum/changelingprofile/proc/copy_profile", function* copy_profile(f: Frame, newprofile: Value) {
	f.vars = () => [newprofile];
	rt.setFv(f, "name", live(newprofile), rt.sv(f, "name"));
	rt.setFv(f, "protected", live(newprofile), rt.sv(f, "protected"));
	rt.setFv(f, "dna", live(newprofile), (yield* g.new_(f, rt.fv(f, "type", rt.sv(f, "dna")), [])));
	yield* g.callName(f, rt.sv(f, "dna"), "copy_dna", [rt.fv(f, "dna", live(newprofile))]);
	rt.setFv(f, "name_list", live(newprofile), (yield* g.callName(f, rt.sv(f, "name_list"), "Copy", [])));
	rt.setFv(f, "appearance_list", live(newprofile), (yield* g.callName(f, rt.sv(f, "appearance_list"), "Copy", [])));
	rt.setFv(f, "flags_cover_list", live(newprofile), (yield* g.callName(f, rt.sv(f, "flags_cover_list"), "Copy", [])));
	rt.setFv(f, "exists_list", live(newprofile), (yield* g.callName(f, rt.sv(f, "exists_list"), "Copy", [])));
	rt.setFv(f, "item_color_list", live(newprofile), (yield* g.callName(f, rt.sv(f, "item_color_list"), "Copy", [])));
	rt.setFv(f, "item_state_list", live(newprofile), (yield* g.callName(f, rt.sv(f, "item_state_list"), "Copy", [])));
	rt.setFv(f, "underwear", live(newprofile), rt.sv(f, "underwear"));
	rt.setFv(f, "undershirt", live(newprofile), rt.sv(f, "undershirt"));
	rt.setFv(f, "socks", live(newprofile), rt.sv(f, "socks"));
	return f.dot;
}, true);

// /datum/game_mode/proc/update_changeling_icons_added  (code/game/gamemodes/changeling/changeling.dm:519)
rt.def("/datum/game_mode/proc/update_changeling_icons_added", function update_changeling_icons_added(f: Frame, changling_mind: Value) {
	let hud: Value = null;
	f.vars = () => [hud];
	rt.callName(f, (hud = rt.index(rt.gl("huds"), 13)), "join_hud", [rt.fv(f, "current", live(changling_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(changling_mind)), "changling"]);
	return f.dot;
});

// /datum/game_mode/proc/update_changeling_icons_removed  (code/game/gamemodes/changeling/changeling.dm:524)
rt.def("/datum/game_mode/proc/update_changeling_icons_removed", function update_changeling_icons_removed(f: Frame, changling_mind: Value) {
	let hud: Value = null;
	f.vars = () => [hud];
	rt.callName(f, (hud = rt.index(rt.gl("huds"), 13)), "leave_hud", [rt.fv(f, "current", live(changling_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(changling_mind)), null]);
	return f.dot;
});
