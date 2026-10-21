// From code/game/gamemodes/miniantags/abduction/abduction.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1095, "/datum/game_mode/abduction", "/datum/game_mode", {
	max_teams: 4,
	scientists: null,
	agents: null,
	team_objectives: null,
	team_names: null,
	finished: 0,
	name: "abduction",
	config_tag: "abduction",
	antag_flag: "abductor",
	recommended_enemies: 2,
	required_players: 15,
	maximum_players: 50,
	abductor_teams: 1,
});

// /datum/game_mode/abduction/proc/<init>  (code/game/gamemodes/miniantags/abduction/abduction.dm:15)
rt.def("/datum/game_mode/abduction/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "scientists", rt.list());
	$0 = $0;
	rt.setSv(f, "agents", rt.list());
	$0 = $0;
	rt.setSv(f, "team_objectives", rt.list());
	$0 = $0;
	rt.setSv(f, "team_names", rt.list());
	return f.dot;
});

// /datum/game_mode/abduction/proc/announce  (code/game/gamemodes/miniantags/abduction/abduction.dm:22)
rt.def("/datum/game_mode/abduction/proc/announce", function announce(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>The current game mode is - Abduction!</B>"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("There are alien <b>abductors</b> sent to ＀ to perform nefarious experiments!", [rt.call(f, P("/proc/station_name"), null, [])])]);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<b>Abductors</b> - kidnap the crew and replace their organs with experimental ones."]);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<b>Crew</b> - don't get abducted and stop the abductors."]);
	return f.dot;
});

// /datum/game_mode/abduction/proc/pre_setup  (code/game/gamemodes/miniantags/abduction/abduction.dm:28)
rt.def("/datum/game_mode/abduction/proc/pre_setup", function pre_setup(f: Frame) {
	let possible_teams: Value = null, i: Value = null;
	f.vars = () => [possible_teams, i];
	rt.setSv(f, "abductor_teams", rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [rt.sv(f, "max_teams"), rt.call(f, P("/proc/round"), null, [divide(rt.callSrc(f, "num_players", []), rt.fv(f, "abductor_scaling_coeff", rt.gl("config")))])])]));
	possible_teams = rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/round"), null, [divide(rt.len(f, rt.sv(f, "antag_candidates")), 2)])]);
	rt.setSv(f, "abductor_teams", rt.call(f, P("/proc/min"), null, [rt.sv(f, "abductor_teams"), live(possible_teams)]));
	rt.setFv(f, "len", rt.sv(f, "abductors"), multiply(2, rt.sv(f, "abductor_teams")));
	rt.setFv(f, "len", rt.sv(f, "scientists"), rt.sv(f, "abductor_teams"));
	rt.setFv(f, "len", rt.sv(f, "agents"), rt.sv(f, "abductor_teams"));
	rt.setFv(f, "len", rt.sv(f, "team_objectives"), rt.sv(f, "abductor_teams"));
	rt.setFv(f, "len", rt.sv(f, "team_names"), rt.sv(f, "abductor_teams"));
	i = null;
	i = 1;
	while (rt.le(live(i), rt.sv(f, "abductor_teams"))) {
		if (!truthy(rt.callSrc(f, "make_abductor_team", [live(i)]))) {
			return 0;
		}
		i = rt.inc(live(i), 1);
	}
	return 1;
});

// /datum/game_mode/abduction/proc/make_abductor_team  (code/game/gamemodes/miniantags/abduction/abduction.dm:46)
rt.def("/datum/game_mode/abduction/proc/make_abductor_team", function make_abductor_team(f: Frame, team_number: Value, preset_agent: Value, preset_scientist: Value) {
	let team_objective: Value = null, scientist: Value = null, agent: Value = null;
	f.vars = () => [preset_agent, preset_scientist, team_objective, scientist, agent];
	if (live(preset_agent) === null) {
		preset_agent = null;
	}
	if (live(preset_scientist) === null) {
		preset_scientist = null;
	}
	rt.setAt(rt.sv(f, "team_names"), live(team_number), fmt("Mothership ＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("possible_changeling_IDs")])]));
	rt.setFv(f, "team", (team_objective = rt.new_(f, T("/datum/objective/experiment"), [])), live(team_number));
	rt.setAt(rt.sv(f, "team_objectives"), live(team_number), live(team_objective));
	if ((!truthy(live(preset_agent)) || !truthy(live(preset_scientist)))) {
		if (rt.le(rt.len(f, rt.sv(f, "antag_candidates")), 2)) {
			return 0;
		}
	}
	scientist = null;
	agent = null;
	if (!truthy(live(preset_scientist))) {
		(rt.modSrcVar(f, "antag_candidates", (scientist = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "antag_candidates")])), subtract));
	} else {
		scientist = live(preset_scientist);
	}
	if (!truthy(live(preset_agent))) {
		(rt.modSrcVar(f, "antag_candidates", (agent = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "antag_candidates")])), subtract));
	} else {
		agent = live(preset_agent);
	}
	rt.setFv(f, "assigned_role", live(scientist), "abductor scientist");
	rt.setFv(f, "special_role", live(scientist), "abductor scientist");
	rt.call(f, P("/proc/log_game"), null, [fmt("＀ (ckey) has been selected as an abductor team ＀ scientist.", [rt.fv(f, "key", live(scientist)), live(team_number)])]);
	rt.setFv(f, "assigned_role", live(agent), "abductor agent");
	rt.setFv(f, "special_role", live(agent), "abductor agent");
	rt.call(f, P("/proc/log_game"), null, [fmt("＀ (ckey) has been selected as an abductor team ＀ agent.", [rt.fv(f, "key", live(agent)), live(team_number)])]);
	(rt.modSrcVar(f, "abductors", live(agent), rt.bitOr));
	(rt.modSrcVar(f, "abductors", live(scientist), rt.bitOr));
	rt.setAt(rt.sv(f, "scientists"), live(team_number), live(scientist));
	rt.setAt(rt.sv(f, "agents"), live(team_number), live(agent));
	return 1;
});

// /datum/game_mode/abduction/proc/post_setup  (code/game/gamemodes/miniantags/abduction/abduction.dm:88)  may sleep
rt.def("/datum/game_mode/abduction/proc/post_setup", function* post_setup(f: Frame) {
	let team_number: Value = null;
	f.vars = () => [team_number];
	team_number = null;
	team_number = 1;
	while (rt.le(live(team_number), rt.sv(f, "abductor_teams"))) {
		yield* g.srcCall(f, "post_setup_team", live(team_number));
		team_number = rt.inc(live(team_number), 1);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/game_mode/abduction/proc/post_setup_team  (code/game/gamemodes/miniantags/abduction/abduction.dm:94)  may sleep
rt.def("/datum/game_mode/abduction/proc/post_setup_team", function* post_setup_team(f: Frame, team_number: Value) {
	let agent_landmarks: Value = null, scientist_landmarks: Value = null, A: Value = null, team_name: Value = null, agent: Value = null, L: Value = null, scientist: Value = null, H: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [team_number, agent_landmarks, scientist_landmarks, A, team_name, agent, L, scientist, H, S, $e];
	agent_landmarks = rt.list();
	scientist_landmarks = rt.list();
	rt.setFv(f, "len", live(agent_landmarks), rt.sv(f, "max_teams"));
	rt.setFv(f, "len", live(scientist_landmarks), rt.sv(f, "max_teams"));
	A = null;
	rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark/abductor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((rt.istype(live(A), T("/obj/effect/landmark/abductor/agent")) ? 1 : 0))) {
			rt.setAt(live(agent_landmarks), (yield* g.call(f, P("/proc/text2num"), null, [rt.fv(f, "team", live(A))])), live(A));
		} else {
			if (truthy((rt.istype(live(A), T("/obj/effect/landmark/abductor/scientist")) ? 1 : 0))) {
				rt.setAt(live(scientist_landmarks), (yield* g.call(f, P("/proc/text2num"), null, [rt.fv(f, "team", live(A))])), live(A));
			}
		}
	}
	rt.endFor(f, 0);
	team_name = rt.index(rt.sv(f, "team_names"), live(team_number));
	agent = null;
	L = null;
	scientist = null;
	H = null;
	S = null;
	H = rt.gv(f, "current", (agent = rt.index(rt.sv(f, "agents"), live(team_number))));
	L = rt.index(live(agent_landmarks), live(team_number));
	yield* g.callName(f, live(H), "forceMove", [rt.fv(f, "loc", live(L))]);
	yield* g.callName(f, live(H), "set_species", [T("/datum/species/abductor")]);
	rt.setFv(f, "team", (S = rt.gv(f, "species", rt.fv(f, "dna", live(H)))), live(team_number));
	rt.setFv(f, "real_name", live(H), add(live(team_name), " Agent"));
	yield* g.callName(f, live(H), "equipOutfit", [T("/datum/outfit/abductor/agent")]);
	yield* g.srcCall(f, "greet_agent", live(agent), live(team_number));
	H = rt.gv(f, "current", (scientist = rt.index(rt.sv(f, "scientists"), live(team_number))));
	L = rt.index(live(scientist_landmarks), live(team_number));
	yield* g.callName(f, live(H), "forceMove", [rt.fv(f, "loc", live(L))]);
	yield* g.callName(f, live(H), "set_species", [T("/datum/species/abductor")]);
	rt.setFv(f, "scientist", (S = rt.gv(f, "species", rt.fv(f, "dna", live(H)))), 1);
	rt.setFv(f, "team", live(S), live(team_number));
	rt.setFv(f, "real_name", live(H), add(live(team_name), " Scientist"));
	yield* g.callName(f, live(H), "equipOutfit", [T("/datum/outfit/abductor/scientist")]);
	yield* g.srcCall(f, "greet_scientist", live(scientist), live(team_number));
	return f.dot;
}, true);

// /datum/game_mode/abduction/proc/greet_agent  (code/game/gamemodes/miniantags/abduction/abduction.dm:139)
rt.def("/datum/game_mode/abduction/proc/greet_agent", function greet_agent(f: Frame, abductor: Value, team_number: Value) {
	let team_name: Value = null;
	f.vars = () => [team_name];
	rt.modField(f, live(abductor), "objectives", rt.index(rt.sv(f, "team_objectives"), live(team_number)), add);
	team_name = rt.index(rt.sv(f, "team_names"), live(team_number));
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(abductor)), fmt("<span class='notice'>You are an agent of ＀!</span>", [live(team_name)])]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(abductor)), "<span class='notice'>With the help of your teammate, kidnap and experiment on station crew members!</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(abductor)), "<span class='notice'>Use your stealth technology and equipment to incapacitate humans for your scientist to retrieve.</span>"]);
	rt.callName(f, live(abductor), "announce_objectives", []);
	return f.dot;
});

// /datum/game_mode/abduction/proc/greet_scientist  (code/game/gamemodes/miniantags/abduction/abduction.dm:149)
rt.def("/datum/game_mode/abduction/proc/greet_scientist", function greet_scientist(f: Frame, abductor: Value, team_number: Value) {
	let team_name: Value = null;
	f.vars = () => [team_name];
	rt.modField(f, live(abductor), "objectives", rt.index(rt.sv(f, "team_objectives"), live(team_number)), add);
	team_name = rt.index(rt.sv(f, "team_names"), live(team_number));
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(abductor)), fmt("<span class='notice'>You are a scientist of ＀!</span>", [live(team_name)])]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(abductor)), "<span class='notice'>With the help of your teammate, kidnap and experiment on station crew members!</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(abductor)), "<span class='notice'>Use your tool and ship consoles to support the agent and retrieve human specimens.</span>"]);
	rt.callName(f, live(abductor), "announce_objectives", []);
	return f.dot;
});

// /datum/game_mode/abduction/proc/get_team_console  (code/game/gamemodes/miniantags/abduction/abduction.dm:159)
rt.def("/datum/game_mode/abduction/proc/get_team_console", function get_team_console(f: Frame, team_number: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/abductor/console"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(rt.fv(f, "team", live(C)), live(team_number))) {
			return live(C);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/game_mode/abduction/proc/check_finished  (code/game/gamemodes/miniantags/abduction/abduction.dm:164)  may sleep
rt.def("/datum/game_mode/abduction/proc/check_finished", function* check_finished(f: Frame) {
	let team_number: Value = null, con: Value = null, objective: Value = null;
	f.vars = () => [team_number, con, objective];
	if (!truthy(rt.sv(f, "finished"))) {
		team_number = null;
		team_number = 1;
		while (rt.le(live(team_number), rt.sv(f, "abductor_teams"))) {
			con = (yield* g.srcCall(f, "get_team_console", live(team_number)));
			objective = rt.index(rt.sv(f, "team_objectives"), live(team_number));
			if (rt.ge(rt.gv(f, "points", rt.fv(f, "experiment", live(con))), rt.fv(f, "target_amount", live(objective)))) {
				yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "request", [null, null, "set_coefficient", 0.5], rt.Args.Named);
				rt.setSv(f, "finished", 1);
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
			team_number = rt.inc(live(team_number), 1);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/game_mode/abduction/proc/declare_completion  (code/game/gamemodes/miniantags/abduction/abduction.dm:175)
rt.def("/datum/game_mode/abduction/proc/declare_completion", function declare_completion(f: Frame) {
	let team_number: Value = null, console: Value = null, objective: Value = null, team_name: Value = null;
	f.vars = () => [team_number, console, objective, team_name];
	team_number = null;
	team_number = 1;
	while (rt.le(live(team_number), rt.sv(f, "abductor_teams"))) {
		console = rt.callSrc(f, "get_team_console", [live(team_number)]);
		objective = rt.index(rt.sv(f, "team_objectives"), live(team_number));
		team_name = rt.index(rt.sv(f, "team_names"), live(team_number));
		if (rt.ge(rt.gv(f, "points", rt.fv(f, "experiment", live(console))), rt.fv(f, "target_amount", live(objective)))) {
			rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='greenannounce'>＀ team fulfilled its mission!</span>", [live(team_name)])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldannounce'>＀ team failed its mission.</span>", [live(team_name)])]);
		}
		team_number = rt.inc(live(team_number), 1);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return 1;
});

// /datum/game_mode/proc/auto_declare_completion_abduction  (code/game/gamemodes/miniantags/abduction/abduction.dm:187)
rt.def("/datum/game_mode/proc/auto_declare_completion_abduction", function auto_declare_completion_abduction(f: Frame) {
	let text: Value = null, abductor_mind: Value = null, abductee_mind: Value = null;
	let $e: any;
	f.vars = () => [text, abductor_mind, abductee_mind, $e];
	text = "";
	if (truthy(rt.len(f, rt.sv(f, "abductors")))) {
		text = rt.modify(live(text), "<br><span class='big'><b>The abductors were:</b></span>", add);
		abductor_mind = null;
		rt.forList(f, 0, rt.sv(f, "abductors"), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			abductor_mind = $e;
			text = rt.modify(live(text), rt.callSrc(f, "printplayer", [live(abductor_mind)]), add);
			text = rt.modify(live(text), rt.callSrc(f, "printobjectives", [live(abductor_mind)]), add);
		}
		rt.endFor(f, 0);
		text = rt.modify(live(text), "<br>", add);
		if (truthy(rt.len(f, rt.sv(f, "abductees")))) {
			text = rt.modify(live(text), "<br><span class='big'><b>The abductees were:</b></span>", add);
			abductee_mind = null;
			rt.forList(f, 0, rt.sv(f, "abductees"), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				abductee_mind = $e;
				text = rt.modify(live(text), rt.callSrc(f, "printplayer", [live(abductee_mind)]), add);
				text = rt.modify(live(text), rt.callSrc(f, "printobjectives", [live(abductee_mind)]), add);
			}
			rt.endFor(f, 0);
		}
	}
	text = rt.modify(live(text), "<br>", add);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text)]);
	return f.dot;
});

rt.type(1148, "/datum/objective/experiment", "/datum/objective", {
	team: null,
	dangerrating: 10,
	target_amount: 6,
});

// /datum/objective/experiment/proc/New  (code/game/gamemodes/miniantags/abduction/abduction.dm:218)
rt.def("/datum/objective/experiment/proc/New", function New(f: Frame) {
	rt.setSv(f, "explanation_text", fmt("Experiment on ＀ humans.", [rt.sv(f, "target_amount")]));
	return f.dot;
});

// /datum/objective/experiment/proc/check_completion  (code/game/gamemodes/miniantags/abduction/abduction.dm:221)
rt.def("/datum/objective/experiment/proc/check_completion", function check_completion(f: Frame) {
	let ab_team: Value = null, H: Value = null, S: Value = null, E: Value = null;
	let $e: any;
	f.vars = () => [ab_team, H, S, E, $e];
	ab_team = rt.sv(f, "team");
	if (truthy(rt.sv(f, "owner"))) {
		if ((!truthy(rt.fv(f, "current", rt.sv(f, "owner"))) || !truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/carbon/human")) ? 1 : 0)))) {
			return 0;
		}
		if (!isEqual(rt.gv(f, "id", rt.gv(f, "species", rt.gv(f, "dna", (H = rt.fv(f, "current", rt.sv(f, "owner")))))), "abductor")) {
			return 0;
		}
		ab_team = rt.gv(f, "team", (S = rt.gv(f, "species", rt.fv(f, "dna", live(H)))));
	}
	E = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/abductor/experiment"));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		if (isEqual(rt.fv(f, "team", live(E)), live(ab_team))) {
			if (rt.ge(rt.fv(f, "points", live(E)), rt.sv(f, "target_amount"))) {
				return 1;
			} else {
				return 0;
			}
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /datum/game_mode/proc/update_abductor_icons_added  (code/game/gamemodes/miniantags/abduction/abduction.dm:239)
rt.def("/datum/game_mode/proc/update_abductor_icons_added", function update_abductor_icons_added(f: Frame, alien_mind: Value) {
	let hud: Value = null;
	let $0: any, $1: any;
	f.vars = () => [hud, $0, $1];
	rt.callName(f, (hud = rt.index(rt.gl("huds"), 14)), "join_hud", [rt.fv(f, "current", live(alien_mind))]);
	$0 = rt.fv(f, "current", live(alien_mind));
	if (truthy((rt.isIn(f, live(alien_mind), rt.sv(f, "abductors")) ? 1 : 0))) {
		$1 = "abductor";
	} else {
		$1 = "abductee";
	}
	rt.callSrc(f, "set_antag_hud", [$0, $1]);
	return f.dot;
});

// /datum/game_mode/proc/update_abductor_icons_removed  (code/game/gamemodes/miniantags/abduction/abduction.dm:244)
rt.def("/datum/game_mode/proc/update_abductor_icons_removed", function update_abductor_icons_removed(f: Frame, alien_mind: Value) {
	let hud: Value = null;
	f.vars = () => [hud];
	rt.callName(f, (hud = rt.index(rt.gl("huds"), 14)), "leave_hud", [rt.fv(f, "current", live(alien_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(alien_mind)), null]);
	return f.dot;
});
