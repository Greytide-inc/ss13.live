// From code/game/gamemodes/miniantags/monkey/monkey.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1096, "/datum/game_mode/monkey", "/datum/game_mode", {
	carriers_to_make: 1,
	carriers: null,
	monkeys_to_win: 1,
	escaped_monkeys: 0,
	players_per_carrier: 30,
	name: "monkey",
	config_tag: "monkey",
	antag_flag: "monkey",
	required_players: 20,
	required_enemies: 1,
	recommended_enemies: 1,
	restricted_jobs: null,
});

// /datum/game_mode/monkey/proc/<init>  (code/game/gamemodes/miniantags/monkey/monkey.dm:16)
rt.def("/datum/game_mode/monkey/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_jobs", rt.list("Cyborg", "AI"));
	$0 = $0;
	rt.setSv(f, "carriers", rt.list());
	return f.dot;
});

// /datum/game_mode/monkey/proc/pre_setup  (code/game/gamemodes/miniantags/monkey/monkey.dm:25)
rt.def("/datum/game_mode/monkey/proc/pre_setup", function pre_setup(f: Frame) {
	let j: Value = null, carrier: Value = null;
	f.vars = () => [j, carrier];
	rt.setSv(f, "carriers_to_make", rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/round"), null, [divide(rt.callSrc(f, "num_players", []), rt.sv(f, "players_per_carrier")), 1]), 1]));
	j = null;
	j = 0;
	while (rt.lt(live(j), rt.sv(f, "carriers_to_make"))) {
		if (!truthy(rt.len(f, rt.sv(f, "antag_candidates")))) {
			break;
		}
		rt.modSrcVar(f, "carriers", (carrier = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "antag_candidates")])), add);
		rt.setFv(f, "special_role", live(carrier), "monkey");
		rt.setFv(f, "restricted_roles", live(carrier), rt.sv(f, "restricted_jobs"));
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ (ckey) has been selected as a Jungle Fever carrier", [rt.fv(f, "key", live(carrier))])]);
		(rt.modSrcVar(f, "antag_candidates", live(carrier), subtract));
		j = rt.inc(live(j), 1);
	}
	if (!truthy(rt.len(f, rt.sv(f, "carriers")))) {
		return 0;
	}
	return 1;
});

// /datum/game_mode/monkey/proc/announce  (code/game/gamemodes/miniantags/monkey/monkey.dm:43)
rt.def("/datum/game_mode/monkey/proc/announce", function announce(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>The current game mode is - Monkey!</B>"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>One or more crewmembers have been infected with Jungle Fever! Crew: Contain the outbreak. None of the infected monkeys may escape alive to Centcom. Monkeys: Ensure that your kind lives on! Rise up against your captors!</B>"]);
	return f.dot;
});

// /datum/game_mode/monkey/proc/greet_carrier  (code/game/gamemodes/miniantags/monkey/monkey.dm:49)
rt.def("/datum/game_mode/monkey/proc/greet_carrier", function greet_carrier(f: Frame, carrier: Value) {
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(carrier)), "<B><span class='notice'>You are the Jungle Fever patient zero!!</B>"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(carrier)), "<b>You have been planted onto this station by the Animal Rights Consortium.</b>"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(carrier)), "<b>Soon the disease will transform you into an ape. Afterwards, you will be able spread the infection to others with a bite.</b>"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(carrier)), "<b>While your infection strain is undetectable by scanners, any other infectees will show up on medical equipment.</b>"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(carrier)), "<b>Your mission will be deemed a success if any of the live infected monkeys reach Centcom.</b>"]);
	return live(f.dot);
});

// /datum/game_mode/monkey/proc/post_setup  (code/game/gamemodes/miniantags/monkey/monkey.dm:57)  may sleep
rt.def("/datum/game_mode/monkey/proc/post_setup", function* post_setup(f: Frame) {
	let carriermind: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [carriermind, D, $e];
	carriermind = null;
	rt.forList(f, 0, rt.sv(f, "carriers"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		carriermind = $e;
		yield* g.srcCall(f, "greet_carrier", live(carriermind));
		rt.modSrcVar(f, "ape_infectees", live(carriermind), add);
		rt.setFv(f, "visibility_flags", (D = (yield* g.new_(f, T("/datum/disease/transformation/jungle_fever"), []))), 3);
		rt.setFv(f, "holder", live(D), rt.fv(f, "current", live(carriermind)));
		rt.setFv(f, "affected_mob", live(D), rt.fv(f, "current", live(carriermind)));
		rt.modField(f, rt.fv(f, "current", live(carriermind)), "viruses", live(D), add);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/game_mode/monkey/proc/check_finished  (code/game/gamemodes/miniantags/monkey/monkey.dm:69)  may sleep
rt.def("/datum/game_mode/monkey/proc/check_finished", function* check_finished(f: Frame) {
	let monkey_mind: Value = null, D: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [monkey_mind, D, H, $e];
	if ((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "endgame: game over") || truthy(rt.sv(f, "station_was_nuked")))) {
		return 1;
	}
	if (!truthy(rt.sv(f, "round_converted"))) {
		monkey_mind = null;
		rt.forList(f, 0, rt.sv(f, "ape_infectees"), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			monkey_mind = $e;
			rt.setSv(f, "continuous_sanity_checked", 1);
			if ((truthy(rt.fv(f, "current", live(monkey_mind))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(monkey_mind))), 2))) {
				return 0;
			}
		}
		rt.endFor(f, 0);
		D = (yield* g.new_(f, T("/datum/disease/transformation/jungle_fever"), []));
		H = null;
		rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			if ((truthy(rt.fv(f, "mind", live(H))) && !isEqual(rt.fv(f, "stat", live(H)), 2))) {
				if (truthy((yield* g.callName(f, live(H), "HasDisease", [live(D)])))) {
					return 0;
				}
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/game_mode/monkey/proc/check_monkey_victory  (code/game/gamemodes/miniantags/monkey/monkey.dm:87)  may sleep
rt.def("/datum/game_mode/monkey/proc/check_monkey_victory", function* check_monkey_victory(f: Frame) {
	let D: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [D, M, $e];
	if (!isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "endgame: game over")) {
		return 0;
	}
	D = (yield* g.new_(f, T("/datum/disease/transformation/jungle_fever"), []));
	M = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/monkey"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((yield* g.callName(f, live(M), "HasDisease", [live(D)])))) {
			if ((truthy((yield* g.callName(f, live(M), "onCentcom", []))) || truthy((yield* g.callName(f, live(M), "onSyndieBase", []))))) {
				rt.incSrcVar(f, "escaped_monkeys", 1, true);
			}
		}
	}
	rt.endFor(f, 0);
	if (rt.ge(rt.sv(f, "escaped_monkeys"), rt.sv(f, "monkeys_to_win"))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

// /datum/game_mode/proc/add_monkey  (code/game/gamemodes/miniantags/monkey/monkey.dm:100)
rt.def("/datum/game_mode/proc/add_monkey", function add_monkey(f: Frame, monkey_mind: Value) {
	(rt.modSrcVar(f, "ape_infectees", live(monkey_mind), rt.bitOr));
	rt.setFv(f, "special_role", live(monkey_mind), "Infected Monkey");
	return f.dot;
});

// /datum/game_mode/proc/remove_monkey  (code/game/gamemodes/miniantags/monkey/monkey.dm:104)
rt.def("/datum/game_mode/proc/remove_monkey", function remove_monkey(f: Frame, monkey_mind: Value) {
	rt.callName(f, rt.sv(f, "ape_infectees"), "Remove", [live(monkey_mind)]);
	rt.setFv(f, "special_role", live(monkey_mind), null);
	return f.dot;
});

// /datum/game_mode/monkey/proc/declare_completion  (code/game/gamemodes/miniantags/monkey/monkey.dm:109)  may sleep
rt.def("/datum/game_mode/monkey/proc/declare_completion", function* declare_completion(f: Frame) {
	if (truthy((yield* g.srcCall(f, "check_monkey_victory")))) {
		rt.setFv(f, "mode_result", rt.gl("SSticker"), "win - monkey win");
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='userdanger'>The monkeys have overthrown their captors! Eeek eeeek!!</span>"]);
	} else {
		rt.setFv(f, "mode_result", rt.gl("SSticker"), "loss - staff stopped the monkeys");
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='userdanger'>The staff managed to contain the monkey infestation!</span>"]);
	}
	return f.dot;
}, true);
