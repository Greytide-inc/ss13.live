// From code/game/gamemodes/traitor/traitor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1084, "/datum/game_mode/traitor", "/datum/game_mode", {
	pre_traitors: null,
	traitors_possible: 4,
	num_modifier: 0,
	antag_datum: rt.typePath("/datum/antagonist/traitor"),
	name: "traitor",
	config_tag: "traitor",
	antag_flag: "traitor",
	restricted_jobs: null,
	protected_jobs: null,
	required_players: 0,
	required_enemies: 1,
	recommended_enemies: 4,
	reroll_friendly: 1,
	announce_span: "danger",
	announce_text: "There are Syndicate agents on the station!\n<span class='danger'>Traitors</span>: Accomplish your objectives.\n<span class='notice'>Crew</span>: Do not let the traitors succeed!",
});

// /datum/game_mode/traitor/proc/<init>  (code/game/gamemodes/traitor/traitor.dm:12)
rt.def("/datum/game_mode/traitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_jobs", rt.list("Cyborg"));
	rt.setSv(f, "protected_jobs", rt.list("Security Officer", "Warden", "Detective", "Head of Security", "Captain"));
	$0 = $0;
	rt.setSv(f, "pre_traitors", rt.list());
	return f.dot;
});

// /datum/game_mode/traitor/proc/pre_setup  (code/game/gamemodes/traitor/traitor.dm:33)
rt.def("/datum/game_mode/traitor/proc/pre_setup", function pre_setup(f: Frame) {
	let num_traitors: Value = null, j: Value = null, traitor: Value = null;
	f.vars = () => [num_traitors, j, traitor];
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", rt.sv(f, "protected_jobs"), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", "Assistant", add);
	}
	num_traitors = 1;
	if (truthy(rt.fv(f, "traitor_scaling_coeff", rt.gl("config")))) {
		num_traitors = rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [add(add(rt.call(f, P("/proc/round"), null, [divide(rt.callSrc(f, "num_players", []), multiply(rt.fv(f, "traitor_scaling_coeff", rt.gl("config")), 2))]), 2), rt.sv(f, "num_modifier")), add(rt.call(f, P("/proc/round"), null, [divide(rt.callSrc(f, "num_players", []), rt.fv(f, "traitor_scaling_coeff", rt.gl("config")))]), rt.sv(f, "num_modifier"))])]);
	} else {
		num_traitors = rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [rt.callSrc(f, "num_players", []), rt.sv(f, "traitors_possible")])]);
	}
	j = null;
	j = 0;
	while (rt.lt(live(j), live(num_traitors))) {
		if (!truthy(rt.len(f, rt.sv(f, "antag_candidates")))) {
			break;
		}
		rt.modSrcVar(f, "pre_traitors", (traitor = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "antag_candidates")])), add);
		rt.setFv(f, "special_role", live(traitor), rt.sv(f, "traitor_name"));
		rt.setFv(f, "restricted_roles", live(traitor), rt.sv(f, "restricted_jobs"));
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ (ckey) has been selected as a ＀", [rt.fv(f, "key", live(traitor)), rt.sv(f, "traitor_name")])]);
		rt.callName(f, rt.sv(f, "antag_candidates"), "Remove", [live(traitor)]);
		j = rt.inc(live(j), 1);
	}
	if (rt.lt(rt.len(f, rt.sv(f, "pre_traitors")), rt.sv(f, "required_enemies"))) {
		return 0;
	}
	return 1;
});

// /datum/game_mode/traitor/proc/post_setup  (code/game/gamemodes/traitor/traitor.dm:63)  may sleep
rt.def("/datum/game_mode/traitor/proc/post_setup", function* post_setup(f: Frame) {
	let traitor: Value = null;
	let $e: any;
	f.vars = () => [traitor, $e];
	traitor = null;
	rt.forList(f, 0, rt.sv(f, "pre_traitors"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		traitor = $e;
		rt.spawnTail(f, (yield* g.call(f, P("/proc/rand"), null, [10, 100])), "/datum/game_mode/traitor/proc/post_setup: spawn at game/gamemodes/traitor/traitor.dm:63", traitor);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "exchange_blue"))) {
		rt.setSv(f, "exchange_blue", -1);
	}
	rt.modSrcVar(f, "modePlayer", rt.sv(f, "traitors"), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return 1;
}, true);

// a spawn((yield* g.call(f, P("/proc/rand"), null, [10, 100]))) body of /datum/game_mode/traitor/proc/post_setup, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/game_mode/traitor/proc/post_setup: spawn at game/gamemodes/traitor/traitor.dm:63", function* (f: Frame, traitor: Value) {
	f.vars = () => [traitor];
	yield* g.callName(f, live(traitor), "add_antag_datum", [rt.sv(f, "antag_datum")]);
	return null;
});

// /datum/game_mode/traitor/proc/make_antag_chance  (code/game/gamemodes/traitor/traitor.dm:73)  may sleep
rt.def("/datum/game_mode/traitor/proc/make_antag_chance", function* make_antag_chance(f: Frame, character: Value) {
	let traitorcap: Value = null;
	f.vars = () => [character, traitorcap];
	traitorcap = (yield* g.call(f, P("/proc/min"), null, [add(add((yield* g.call(f, P("/proc/round"), null, [divide(rt.len(f, rt.gl("joined_player_list")), multiply(rt.fv(f, "traitor_scaling_coeff", rt.gl("config")), 2))])), 2), rt.sv(f, "num_modifier")), add((yield* g.call(f, P("/proc/round"), null, [divide(rt.len(f, rt.gl("joined_player_list")), rt.fv(f, "traitor_scaling_coeff", rt.gl("config")))])), rt.sv(f, "num_modifier"))]));
	if (rt.ge(rt.getLen(f, rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker")))), live(traitorcap))) {
		return live(f.dot);
	}
	if (!(rt.le(rt.getLen(f, rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker")))), subtract(live(traitorcap), 2)) || truthy(rt.op(f, "Prob", [], [divide(100, multiply(rt.fv(f, "traitor_scaling_coeff", rt.gl("config")), 2))])))) return f.dot;
	if (!truthy((rt.isIn(f, "traitor", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(character))))) ? 1 : 0))) return f.dot;
	if (!(!truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(character), "traitor"]))) && !truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(character), "Syndicate"]))))) return f.dot;
	if (truthy((rt.isIn(f, rt.fv(f, "job", live(character)), rt.sv(f, "restricted_jobs")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "add_latejoin_traitor", rt.fv(f, "mind", live(character)));
	return f.dot;
}, true);

// /datum/game_mode/traitor/proc/add_latejoin_traitor  (code/game/gamemodes/traitor/traitor.dm:84)  may sleep
rt.def("/datum/game_mode/traitor/proc/add_latejoin_traitor", function* add_latejoin_traitor(f: Frame, character: Value) {
	f.vars = () => [character];
	yield* g.callName(f, live(character), "add_antag_datum", [rt.sv(f, "antag_datum")]);
	return f.dot;
}, true);

// /datum/game_mode/traitor/proc/declare_completion  (code/game/gamemodes/traitor/traitor.dm:89)
rt.def("/datum/game_mode/traitor/proc/declare_completion", function declare_completion(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
});

// /datum/game_mode/proc/auto_declare_completion_traitor  (code/game/gamemodes/traitor/traitor.dm:94)
rt.def("/datum/game_mode/proc/auto_declare_completion_traitor", function auto_declare_completion_traitor(f: Frame) {
	let text: Value = null, traitor: Value = null, traitorwin: Value = null, TC_uses: Value = null, uplink_true: Value = null, purchases: Value = null, H: Value = null, objectives: Value = null, count: Value = null, objective: Value = null, special_role_text: Value = null;
	let $e: any;
	f.vars = () => [text, traitor, traitorwin, TC_uses, uplink_true, purchases, H, objectives, count, objective, special_role_text, $e];
	if (truthy(rt.len(f, rt.sv(f, "traitors")))) {
		text = fmt("<br><font size=3><b>The ＀s were:</b></font>", [rt.sv(f, "traitor_name")]);
		traitor = null;
		rt.forList(f, 0, rt.sv(f, "traitors"), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			traitor = $e;
			traitorwin = 1;
			text = rt.modify(live(text), rt.callSrc(f, "printplayer", [live(traitor)]), add);
			TC_uses = 0;
			uplink_true = 0;
			purchases = "";
			H = null;
			rt.forList(f, 1, rt.gl("uplinks"), T("/obj/item/device/uplink"));
			while (($e = rt.next(f, 1)) !== undefined) {
				H = $e;
				if (((truthy(live(H)) && truthy(rt.fv(f, "owner", live(H)))) && isEqual(rt.fv(f, "owner", live(H)), rt.fv(f, "key", live(traitor))))) {
					TC_uses = rt.modify(live(TC_uses), rt.fv(f, "spent_telecrystals", live(H)), add);
					uplink_true = 1;
					purchases = rt.modify(live(purchases), rt.fv(f, "purchase_log", live(H)), add);
				}
			}
			rt.endFor(f, 1);
			objectives = "";
			if (truthy(rt.getLen(f, rt.fv(f, "objectives", live(traitor))))) {
				count = 1;
				objective = null;
				rt.forList(f, 1, rt.fv(f, "objectives", live(traitor)), T("/datum/objective"));
				while (($e = rt.next(f, 1)) !== undefined) {
					objective = $e;
					if (truthy(rt.callName(f, live(objective), "check_completion", []))) {
						objectives = rt.modify(live(objectives), fmt("<br><B>Objective #＀</B>: ＀ <font color='green'><B>Success!</B></font>", [live(count), rt.fv(f, "explanation_text", live(objective))]), add);
					} else {
						objectives = rt.modify(live(objectives), fmt("<br><B>Objective #＀</B>: ＀ <font color='red'>Fail.</font>", [live(count), rt.fv(f, "explanation_text", live(objective))]), add);
						traitorwin = 0;
					}
					count = rt.inc(live(count), 1);
				}
				rt.endFor(f, 1);
			}
			if (truthy(live(uplink_true))) {
				text = rt.modify(live(text), fmt(" (used ＀ TC) ＀", [live(TC_uses), live(purchases)]), add);
				if ((isEqual(live(TC_uses), 0) && truthy(live(traitorwin)))) {
					text = rt.modify(live(text), fmt("<BIG>＀</BIG>", [rt.call(f, P("/proc/bicon"), null, [rt.gl("badass")])]), add);
				}
			}
			text = rt.modify(live(text), live(objectives), add);
			special_role_text = null;
			if (truthy(rt.fv(f, "special_role", live(traitor)))) {
				special_role_text = rt.call(f, P("/proc/lowertext"), null, [rt.fv(f, "special_role", live(traitor))]);
			} else {
				special_role_text = "antagonist";
			}
			if (truthy(live(traitorwin))) {
				text = rt.modify(live(text), fmt("<br><font color='green'><B>The ＀ was successful!</B></font>", [live(special_role_text)]), add);
			} else {
				text = rt.modify(live(text), fmt("<br><font color='red'><B>The ＀ has failed!</B></font>", [live(special_role_text)]), add);
			}
			text = rt.modify(live(text), "<br>", add);
		}
		rt.endFor(f, 0);
		text = rt.modify(live(text), fmt("<br><b>The code phrases were:</b> <font color='red'>＀</font><br><b>The code responses were:</b> <font color='red'>＀</font><br>", [rt.gl("syndicate_code_phrase"), rt.gl("syndicate_code_response")]), add);
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text)]);
	}
	return 1;
});

// /datum/game_mode/proc/update_traitor_icons_added  (code/game/gamemodes/traitor/traitor.dm:157)
rt.def("/datum/game_mode/proc/update_traitor_icons_added", function update_traitor_icons_added(f: Frame, traitor_mind: Value) {
	let traitorhud: Value = null;
	f.vars = () => [traitorhud];
	rt.callName(f, (traitorhud = rt.index(rt.gl("huds"), 11)), "join_hud", [rt.fv(f, "current", live(traitor_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(traitor_mind)), "traitor"]);
	return f.dot;
});

// /datum/game_mode/proc/update_traitor_icons_removed  (code/game/gamemodes/traitor/traitor.dm:162)
rt.def("/datum/game_mode/proc/update_traitor_icons_removed", function update_traitor_icons_removed(f: Frame, traitor_mind: Value) {
	let traitorhud: Value = null;
	f.vars = () => [traitorhud];
	rt.callName(f, (traitorhud = rt.index(rt.gl("huds"), 11)), "leave_hud", [rt.fv(f, "current", live(traitor_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(traitor_mind)), null]);
	return f.dot;
});
