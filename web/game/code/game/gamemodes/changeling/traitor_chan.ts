// From code/game/gamemodes/changeling/traitor_chan.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1085, "/datum/game_mode/traitor/changeling", "/datum/game_mode/traitor", {
	possible_changelings: null,
	changeling_amount: 1,
	name: "traitor+changeling",
	config_tag: "traitorchan",
	restricted_jobs: null,
	required_players: 25,
	required_enemies: 1,
	recommended_enemies: 3,
	reroll_friendly: 1,
	traitors_possible: 3,
}, { const: ["changeling_amount"] });

// /datum/game_mode/traitor/changeling/proc/<init>  (code/game/gamemodes/changeling/traitor_chan.dm:11)
rt.def("/datum/game_mode/traitor/changeling/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_jobs", rt.list("AI", "Cyborg"));
	$0 = $0;
	rt.setSv(f, "possible_changelings", rt.list());
	return f.dot;
});

// /datum/game_mode/traitor/changeling/proc/announce  (code/game/gamemodes/changeling/traitor_chan.dm:15)
rt.def("/datum/game_mode/traitor/changeling/proc/announce", function announce(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>The current game mode is - Traitor+Changeling!</B>"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>There are alien creatures on the station along with some syndicate operatives out for their own gain! Do not let the changelings or the traitors succeed!</B>"]);
	return f.dot;
});

// /datum/game_mode/traitor/changeling/proc/can_start  (code/game/gamemodes/changeling/traitor_chan.dm:19)
rt.def("/datum/game_mode/traitor/changeling/proc/can_start", function can_start(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	rt.setSv(f, "possible_changelings", rt.callSrc(f, "get_players_for_role", ["changeling"]));
	if (rt.lt(rt.len(f, rt.sv(f, "possible_changelings")), rt.sv(f, "required_enemies"))) {
		return 0;
	}
	return 1;
});

// /datum/game_mode/traitor/changeling/proc/pre_setup  (code/game/gamemodes/changeling/traitor_chan.dm:27)
rt.def("/datum/game_mode/traitor/changeling/proc/pre_setup", function pre_setup(f: Frame) {
	let possible_changelings: Value = null, num_changelings: Value = null, j: Value = null, changeling: Value = null;
	f.vars = () => [possible_changelings, num_changelings, j, changeling];
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", rt.sv(f, "protected_jobs"), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", "Assistant", add);
	}
	possible_changelings = rt.callSrc(f, "get_players_for_role", ["changeling"]);
	num_changelings = 1;
	if (truthy(rt.fv(f, "changeling_scaling_coeff", rt.gl("config")))) {
		num_changelings = rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [add(rt.call(f, P("/proc/round"), null, [divide(rt.callSrc(f, "num_players", []), multiply(rt.fv(f, "changeling_scaling_coeff", rt.gl("config")), 4))]), 2), rt.call(f, P("/proc/round"), null, [divide(rt.callSrc(f, "num_players", []), multiply(rt.fv(f, "changeling_scaling_coeff", rt.gl("config")), 2))])])]);
	} else {
		num_changelings = rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [rt.callSrc(f, "num_players", []), 0.5])]);
	}
	if (rt.gt(rt.len(f, live(possible_changelings)), 0)) {
		j = null;
		j = 0;
		while (rt.lt(live(j), live(num_changelings))) {
			if (!truthy(rt.len(f, live(possible_changelings)))) {
				break;
			}
			(rt.modSrcVar(f, "antag_candidates", (changeling = rt.op(f, "PickUnweighted", [1], [live(possible_changelings)])), subtract));
			(possible_changelings = rt.modify(live(possible_changelings), live(changeling), subtract));
			rt.setFv(f, "special_role", live(changeling), "Changeling");
			rt.modSrcVar(f, "changelings", live(changeling), add);
			rt.setFv(f, "restricted_roles", live(changeling), rt.sv(f, "restricted_jobs"));
			j = rt.inc(live(j), 1);
		}
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return 0;
});

// /datum/game_mode/traitor/changeling/proc/post_setup  (code/game/gamemodes/changeling/traitor_chan.dm:56)  may sleep
rt.def("/datum/game_mode/traitor/changeling/proc/post_setup", function* post_setup(f: Frame) {
	let changeling: Value = null;
	let $e: any;
	f.vars = () => [changeling, $e];
	rt.modSrcVar(f, "modePlayer", rt.sv(f, "changelings"), add);
	changeling = null;
	rt.forList(f, 0, rt.sv(f, "changelings"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		changeling = $e;
		yield* g.callName(f, rt.fv(f, "current", live(changeling)), "make_changeling", []);
		yield* g.srcCall(f, "forge_changeling_objectives", live(changeling));
		yield* g.srcCall(f, "greet_changeling", live(changeling));
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_changeling_icons_added", [live(changeling)]);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true);

// /datum/game_mode/traitor/changeling/proc/make_antag_chance  (code/game/gamemodes/changeling/traitor_chan.dm:66)  may sleep
rt.def("/datum/game_mode/traitor/changeling/proc/make_antag_chance", function* make_antag_chance(f: Frame) {
	let changelingcap: Value = null;
	f.vars = () => [changelingcap];
	changelingcap = (yield* g.call(f, P("/proc/min"), null, [add((yield* g.call(f, P("/proc/round"), null, [divide(rt.len(f, rt.gl("joined_player_list")), multiply(rt.fv(f, "changeling_scaling_coeff", rt.gl("config")), 4))])), 2), (yield* g.call(f, P("/proc/round"), null, [divide(rt.len(f, rt.gl("joined_player_list")), multiply(rt.fv(f, "changeling_scaling_coeff", rt.gl("config")), 2))]))]));
	if (rt.ge(rt.getLen(f, rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))), live(changelingcap))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if ((rt.le(rt.getLen(f, rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))), subtract(live(changelingcap), 2)) || truthy(rt.op(f, "Prob", [], [divide(100, multiply(rt.fv(f, "changeling_scaling_coeff", rt.gl("config")), 4))])))) {
		if (truthy((rt.isIn(f, "changeling", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(f.args[0]))))) ? 1 : 0))) {
			if ((!truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(f.args[0]), "changeling"]))) && !truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(f.args[0]), "Syndicate"]))))) {
				if (!truthy((rt.isIn(f, rt.fv(f, "job", live(f.args[0])), rt.sv(f, "restricted_jobs")) ? 1 : 0))) {
					yield* g.callName(f, rt.fv(f, "mind", live(f.args[0])), "make_Changling", []);
				}
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["character"] });
