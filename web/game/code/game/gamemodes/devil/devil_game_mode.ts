// From code/game/gamemodes/devil/devil_game_mode.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1089, "/datum/game_mode/devil", "/datum/game_mode", {
	traitors_possible: 4,
	num_modifier: 0,
	objective_count: 2,
	minimum_devils: 1,
	name: "devil",
	config_tag: "devil",
	antag_flag: "devil",
	protected_jobs: null,
	required_players: 0,
	required_enemies: 1,
	recommended_enemies: 4,
	reroll_friendly: 1,
	announce_text: "There are devils onboard the station!\n+\t<span class='danger'>Devils</span>: Purchase souls and tempt the crew to sin!\n+\t<span class='notice'>Crew</span>: Resist the lure of sin and remain pure!",
});

// /datum/game_mode/devil/proc/pre_setup  (code/game/gamemodes/devil/devil_game_mode.dm:22)
rt.def("/datum/game_mode/devil/proc/pre_setup", function pre_setup(f: Frame) {
	let num_devils: Value = null, j: Value = null, devil: Value = null;
	f.vars = () => [num_devils, j, devil];
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", rt.sv(f, "protected_jobs"), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", "Assistant", add);
	}
	num_devils = 1;
	if (truthy(rt.fv(f, "traitor_scaling_coeff", rt.gl("config")))) {
		num_devils = rt.call(f, P("/proc/max"), null, [rt.sv(f, "minimum_devils"), rt.call(f, P("/proc/min"), null, [add(add(rt.call(f, P("/proc/round"), null, [divide(rt.callSrc(f, "num_players", []), multiply(rt.fv(f, "traitor_scaling_coeff", rt.gl("config")), 3))]), 2), rt.sv(f, "num_modifier")), add(rt.call(f, P("/proc/round"), null, [divide(rt.callSrc(f, "num_players", []), multiply(rt.fv(f, "traitor_scaling_coeff", rt.gl("config")), 1.5))]), rt.sv(f, "num_modifier"))])]);
	} else {
		num_devils = rt.call(f, P("/proc/max"), null, [rt.sv(f, "minimum_devils"), rt.call(f, P("/proc/min"), null, [rt.callSrc(f, "num_players", []), rt.sv(f, "traitors_possible")])]);
	}
	j = null;
	j = 0;
	while (rt.lt(live(j), live(num_devils))) {
		if (!truthy(rt.len(f, rt.sv(f, "antag_candidates")))) {
			break;
		}
		rt.modSrcVar(f, "devils", (devil = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "antag_candidates")])), add);
		rt.setFv(f, "special_role", live(devil), rt.sv(f, "traitor_name"));
		rt.setFv(f, "restricted_roles", live(devil), rt.sv(f, "restricted_jobs"));
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ (ckey) has been selected as a ＀", [rt.fv(f, "key", live(devil)), rt.sv(f, "traitor_name")])]);
		rt.callName(f, rt.sv(f, "antag_candidates"), "Remove", [live(devil)]);
		j = rt.inc(live(j), 1);
	}
	if (rt.lt(rt.len(f, rt.sv(f, "devils")), rt.sv(f, "required_enemies"))) {
		return 0;
	}
	return 1;
});

// /datum/game_mode/devil/proc/post_setup  (code/game/gamemodes/devil/devil_game_mode.dm:51)  may sleep
rt.def("/datum/game_mode/devil/proc/post_setup", function* post_setup(f: Frame) {
	let devil: Value = null;
	let $e: any;
	f.vars = () => [devil, $e];
	devil = null;
	rt.forList(f, 0, rt.sv(f, "devils"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		devil = $e;
		yield* g.srcCall(f, "post_setup_finalize", live(devil));
	}
	rt.endFor(f, 0);
	rt.modSrcVar(f, "modePlayer", rt.sv(f, "devils"), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return 1;
}, true);

// /datum/game_mode/devil/proc/post_setup_finalize  (code/game/gamemodes/devil/devil_game_mode.dm:58)  may sleep
rt.def("/datum/game_mode/devil/proc/post_setup_finalize", function* post_setup_finalize(f: Frame, devil: Value) {
	f.vars = () => [devil];
	yield* g.call(f, P("/proc/add_devil"), null, [null, rt.fv(f, "current", live(devil)), "ascendable", 1], rt.Args.Named);
	yield* g.srcCall(f, "add_devil_objectives", live(devil), 2);
	return f.dot;
}, true);

// /proc/is_devil  (code/game/gamemodes/devil/devil_game_mode.dm:62)
rt.def("/proc/is_devil", function is_devil(f: Frame, M: Value) {
	return ((live(M) && rt.fv(f, "mind", live(M))) && rt.callName(f, rt.fv(f, "mind", live(M)), "has_antag_datum", [T("/datum/antagonist/devil")]));
});

// /proc/add_devil  (code/game/gamemodes/devil/devil_game_mode.dm:65)  may sleep
rt.def("/proc/add_devil", function* add_devil(f: Frame, L: Value, ascendable: Value) {
	let devil_datum: Value = null;
	f.vars = () => [L, ascendable, devil_datum];
	if (live(ascendable) === null) {
		ascendable = 0;
	}
	if ((!truthy(live(L)) || !truthy(rt.fv(f, "mind", live(L))))) {
		return 0;
	}
	rt.setFv(f, "ascendable", (devil_datum = (yield* g.callName(f, rt.fv(f, "mind", live(L)), "add_antag_datum", [T("/datum/antagonist/devil")]))), live(ascendable));
	return live(devil_datum);
}, true);

// /proc/remove_devil  (code/game/gamemodes/devil/devil_game_mode.dm:72)  may sleep
rt.def("/proc/remove_devil", function* remove_devil(f: Frame, L: Value) {
	let devil_datum: Value = null;
	f.vars = () => [L, devil_datum];
	if ((!truthy(live(L)) || !truthy(rt.fv(f, "mind", live(L))))) {
		return 0;
	}
	yield* g.callName(f, (devil_datum = (yield* g.callName(f, rt.fv(f, "mind", live(L)), "has_antag_datum", [T("/datum/antagonist/devil")]))), "on_removal", []);
	return 1;
}, true);
