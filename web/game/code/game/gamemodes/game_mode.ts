// From code/game/gamemodes/game_mode.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1081, "/datum/game_mode", "/datum", {
	name: "invalid",
	config_tag: null,
	votable: 1,
	probability: 0,
	station_was_nuked: 0,
	explosion_in_progress: 0,
	round_ends_with_antag_death: 0,
	antag_candidates: null,
	restricted_jobs: null,
	protected_jobs: null,
	required_players: 0,
	maximum_players: -1,
	required_enemies: 0,
	recommended_enemies: 0,
	antag_flag: null,
	living_antag_player: null,
	replacementmode: null,
	round_converted: 0,
	reroll_friendly: null,
	continuous_sanity_checked: null,
	announce_span: "warning",
	announce_text: "This gamemode forgot to set a descriptive text! Uh oh!",
	waittime_l: 600,
	waittime_h: 1800,
	station_goals: null,
	allow_persistence_save: 1,
	changelings: null,
	servants_of_ratvar: null,
	clockwork_explanation: "Construct a Gateway to the Celestial Derelict and free Ratvar.",
	cult: null,
	cult_objectives: null,
	eldergod: 1,
	sintouched: null,
	devils: null,
	devil_ascended: 0,
	gangs: null,
	gang_points: null,
	abductor_teams: 0,
	abductors: null,
	abductees: null,
	ape_infectees: null,
	syndicates: null,
	nukeops_lastname: "",
	head_revolutionaries: null,
	revolutionaries: null,
	target_list: null,
	late_joining_list: null,
	traitor_name: "traitor",
	traitors: null,
	exchange_red: null,
	exchange_blue: null,
	wizards: null,
	apprentices: null,
	modePlayer: null,
}, { const: ["waittime_l","waittime_h"] });

// /datum/game_mode/proc/<init>  (code/game/gamemodes/game_mode.dm:24)
rt.def("/datum/game_mode/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "antag_candidates", rt.list());
	$0 = $0;
	rt.setSv(f, "restricted_jobs", rt.list());
	$0 = $0;
	rt.setSv(f, "protected_jobs", rt.list());
	$0 = $0;
	rt.setSv(f, "station_goals", rt.list());
	$0 = $0;
	rt.setSv(f, "changelings", rt.list());
	$0 = $0;
	rt.setSv(f, "servants_of_ratvar", rt.list());
	$0 = $0;
	rt.setSv(f, "cult", rt.list());
	$0 = $0;
	rt.setSv(f, "cult_objectives", rt.list());
	rt.setSv(f, "sintouched", rt.list());
	rt.setSv(f, "devils", rt.list());
	$0 = $0;
	rt.setSv(f, "gangs", rt.list());
	rt.setSv(f, "abductors", rt.list());
	$0 = $0;
	rt.setSv(f, "abductees", rt.list());
	rt.setSv(f, "ape_infectees", rt.list());
	rt.setSv(f, "syndicates", rt.list());
	$0 = $0;
	rt.setSv(f, "head_revolutionaries", rt.list());
	$0 = $0;
	rt.setSv(f, "revolutionaries", rt.list());
	rt.setSv(f, "target_list", rt.list());
	rt.setSv(f, "late_joining_list", rt.list());
	rt.setSv(f, "traitors", rt.list());
	rt.setSv(f, "wizards", rt.list());
	rt.setSv(f, "apprentices", rt.list());
	$0 = $0;
	rt.setSv(f, "modePlayer", rt.new_(f, T("/list"), []));
	return f.dot;
});

// /datum/game_mode/proc/announce  (code/game/gamemodes/game_mode.dm:50)
rt.def("/datum/game_mode/proc/announce", function announce(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<b>The gamemode is: <span class='＀'>＀</span>!</b>", [rt.sv(f, "announce_span"), rt.sv(f, "name")])]);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<b>＀</b>", [rt.sv(f, "announce_text")])]);
	return f.dot;
});

// /datum/game_mode/proc/can_start  (code/game/gamemodes/game_mode.dm:57)
rt.def("/datum/game_mode/proc/can_start", function can_start(f: Frame) {
	let playerC: Value = null, player: Value = null;
	let $e: any;
	f.vars = () => [playerC, player, $e];
	playerC = 0;
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if ((truthy(rt.fv(f, "client", live(player))) && isEqual(rt.fv(f, "ready", live(player)), 1))) {
			playerC = rt.inc(live(playerC), 1);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.gl("Debug2"))) {
		if ((rt.lt(live(playerC), rt.sv(f, "required_players")) || (rt.ge(rt.sv(f, "maximum_players"), 0) && rt.gt(live(playerC), rt.sv(f, "maximum_players"))))) {
			return 0;
		}
	}
	rt.setSv(f, "antag_candidates", rt.callSrc(f, "get_players_for_role", [rt.sv(f, "antag_flag")]));
	if (!truthy(rt.gl("Debug2"))) {
		if (rt.lt(rt.len(f, rt.sv(f, "antag_candidates")), rt.sv(f, "required_enemies"))) {
			return 0;
		}
		return 1;
	} else {
		rt.call(f, P("/proc/message_admins"), null, ["<span class='notice'>DEBUG: GAME STARTING WITHOUT PLAYER NUMBER CHECKS, THIS WILL PROBABLY BREAK SHIT.</span>"]);
		return 1;
	}
	return f.dot;
});

// /datum/game_mode/proc/post_setup  (code/game/gamemodes/game_mode.dm:80)  may sleep
rt.def("/datum/game_mode/proc/post_setup", function* post_setup(f: Frame, report: Value) {
	let sql: Value = null, query_round_game_mode: Value = null;
	f.vars = () => [report, sql, query_round_game_mode];
	if (!truthy(live(report))) {
		report = rt.fv(f, "intercept", rt.gl("config"));
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/display_roundstart_logout_report")])), 6000]);
	if (truthy(live(report))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/game_mode/proc/send_intercept"), 0])), (yield* g.call(f, P("/proc/rand"), null, [600, 1800]))]);
	}
	yield* g.srcCall(f, "generate_station_goals");
	return 1;
}, true);

// /datum/game_mode/proc/make_antag_chance  (code/game/gamemodes/game_mode.dm:103)  may sleep
rt.def("/datum/game_mode/proc/make_antag_chance", function* make_antag_chance(f: Frame, character: Value) {
	f.vars = () => [character];
	if ((truthy(rt.sv(f, "replacementmode")) && isEqual(rt.sv(f, "round_converted"), 2))) {
		yield* g.callName(f, rt.sv(f, "replacementmode"), "make_antag_chance", [live(character)]);
	}
	return live(f.dot);
}, true);

// /datum/game_mode/proc/convert_roundtype  (code/game/gamemodes/game_mode.dm:111)  may sleep
rt.def("/datum/game_mode/proc/convert_roundtype", function* convert_roundtype(f: Frame) {
	let living_crew: Value = null, Player: Value = null, runnable_modes: Value = null, usable_modes: Value = null, G: Value = null, antag_candidates: Value = null, H: Value = null;
	let $0: any, $e: any;
	f.vars = () => [living_crew, Player, runnable_modes, usable_modes, G, antag_candidates, H, $0, $e];
	living_crew = rt.list();
	Player = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Player = $e;
		if ((((truthy(rt.fv(f, "mind", live(Player))) && !isEqual(rt.fv(f, "stat", live(Player)), 2)) && !truthy((rt.istype(live(Player), T("/mob/dead/new_player")) ? 1 : 0))) && !truthy((rt.istype(live(Player), T("/mob/living/brain")) ? 1 : 0)))) {
			living_crew = rt.modify(live(living_crew), live(Player), add);
		}
	}
	rt.endFor(f, 0);
	if (rt.le(divide(rt.len(f, live(living_crew)), rt.len(f, rt.gl("joined_player_list"))), rt.fv(f, "midround_antag_life_check", rt.gl("config")))) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Convert_roundtype failed due to too many dead people. Limit is ＀% living crew", [multiply(rt.fv(f, "midround_antag_life_check", rt.gl("config")), 100)])]);
		return null;
	}
	runnable_modes = (yield* g.callName(f, rt.gl("config"), "get_runnable_midround_modes", [rt.len(f, live(living_crew))]));
	usable_modes = rt.list();
	G = null;
	rt.forList(f, 0, live(runnable_modes), T("/datum/game_mode"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (truthy(rt.fv(f, "reroll_friendly", live(G)))) {
			usable_modes = rt.modify(live(usable_modes), live(G), add);
		} else {
			yield* g.call(f, P("/proc/qdel"), null, [live(G)]);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(usable_modes))) {
		yield* g.call(f, P("/proc/message_admins"), null, ["Convert_roundtype failed due to no valid modes to convert to. Please report this error to the Coders."]);
		return null;
	}
	rt.setSv(f, "replacementmode", (yield* g.call(f, P("/proc/pickweight"), null, [live(usable_modes)])));
	$0 = rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle")));
	if ($0 === "stranded" || $0 === "escape") {
		return 1;
	} else if ($0 === "call") {
		if (rt.lt((yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "timeLeft", [1])), multiply(rt.initial(f, rt.gl("SSshuttle"), "emergencyCallTime"), 0.5))) {
			return 1;
		}
	}
	if (rt.ge(rt.worldTime(f), multiply(rt.fv(f, "midround_antag_time_check", rt.gl("config")), 600))) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Convert_roundtype failed due to round length. Limit is ＀ minutes.", [rt.fv(f, "midround_antag_time_check", rt.gl("config"))])]);
		return null;
	}
	antag_candidates = rt.list();
	H = null;
	rt.forList(f, 0, live(living_crew), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if ((truthy(rt.fv(f, "client", live(H))) && truthy(rt.gv(f, "allow_midround_antag", rt.gv(f, "prefs", rt.fv(f, "client", live(H))))))) {
			antag_candidates = rt.modify(live(antag_candidates), live(H), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(antag_candidates))) {
		yield* g.call(f, P("/proc/message_admins"), null, ["Convert_roundtype failed due to no antag candidates."]);
		return null;
	}
	antag_candidates = (yield* g.call(f, P("/proc/shuffle"), null, [live(antag_candidates)]));
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modField(f, rt.sv(f, "replacementmode"), "restricted_jobs", rt.fv(f, "protected_jobs", rt.sv(f, "replacementmode")), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modField(f, rt.sv(f, "replacementmode"), "restricted_jobs", "Assistant", add);
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("The roundtype will be converted. If you have other plans for the station or feel the station is too messed up to inhabit <A HREF='?_src_=holder;toggle_midround_antag=＃'>stop the creation of antags</A> or <A HREF='?_src_=holder;end_round=＃'>end the round now</A>.", [live(f.usr), live(f.usr)])]);
	f.dot = 1;
	yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [600, 1800]))]);
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "IsRoundInProgress", [])))) {
		yield* g.call(f, P("/proc/message_admins"), null, ["Roundtype conversion cancelled, the game appears to have finished!"]);
		rt.setSv(f, "round_converted", 0);
		return live(f.dot);
	}
	if (!truthy(rt.index(rt.fv(f, "midround_antag", rt.gl("config")), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")))))) {
		rt.setSv(f, "round_converted", 0);
		return 1;
	}
	H = null;
	rt.forList(f, 0, live(antag_candidates), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.callName(f, rt.sv(f, "replacementmode"), "make_antag_chance", [live(H)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "round_converted", 2);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("-- IMPORTANT: The roundtype has been converted to ＀, antagonists may have been created! --", [rt.fv(f, "name", rt.sv(f, "replacementmode"))])]);
	return f.dot;
}, true, { waitfor: false });

// /datum/game_mode/proc/check_finished  (code/game/gamemodes/game_mode.dm:186)  may sleep
rt.def("/datum/game_mode/proc/check_finished", function* check_finished(f: Frame, force_ending: Value) {
	let Player: Value = null;
	let $e: any;
	f.vars = () => [force_ending, Player, $e];
	if ((truthy(rt.sv(f, "replacementmode")) && isEqual(rt.sv(f, "round_converted"), 2))) {
		return (yield* g.callName(f, rt.sv(f, "replacementmode"), "check_finished", []));
	}
	if ((truthy(rt.fv(f, "emergency", rt.gl("SSshuttle"))) && isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "endgame: game over"))) {
		return 1;
	}
	if (truthy(rt.sv(f, "station_was_nuked"))) {
		return 1;
	}
	if ((!truthy(rt.sv(f, "round_converted")) && (!truthy(rt.index(rt.fv(f, "continuous", rt.gl("config")), rt.sv(f, "config_tag"))) || (truthy(rt.index(rt.fv(f, "continuous", rt.gl("config")), rt.sv(f, "config_tag"))) && truthy(rt.index(rt.fv(f, "midround_antag", rt.gl("config")), rt.sv(f, "config_tag"))))))) {
		if (!truthy(rt.sv(f, "continuous_sanity_checked"))) {
			Player = null;
			rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
			while (($e = rt.next(f, 0)) !== undefined) {
				Player = $e;
				if (truthy(rt.fv(f, "mind", live(Player)))) {
					if (truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(Player))))) {
						rt.setSv(f, "continuous_sanity_checked", 1);
						return 0;
					}
				}
			}
			rt.endFor(f, 0);
			if (!truthy(rt.sv(f, "continuous_sanity_checked"))) {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("The roundtype (＀) has no antagonists, continuous round has been defaulted to on and midround_antag has been defaulted to off.", [rt.sv(f, "config_tag")])]);
				rt.setAt(rt.fv(f, "continuous", rt.gl("config")), rt.sv(f, "config_tag"), 1);
				rt.setAt(rt.fv(f, "midround_antag", rt.gl("config")), rt.sv(f, "config_tag"), 0);
				yield* g.callName(f, rt.gl("SSshuttle"), "clearHostileEnvironment", [live(f.src)]);
				return 0;
			}
		}
		if ((((((truthy(rt.sv(f, "living_antag_player")) && truthy(rt.fv(f, "mind", rt.sv(f, "living_antag_player")))) && truthy((rt.istype(rt.sv(f, "living_antag_player"), T("/mob/living")) ? 1 : 0))) && !isEqual(rt.fv(f, "stat", rt.sv(f, "living_antag_player")), 2)) && !truthy((rt.istype(rt.sv(f, "living_antag_player"), T("/mob/dead/new_player")) ? 1 : 0))) && !truthy((rt.istype(rt.sv(f, "living_antag_player"), T("/mob/living/brain")) ? 1 : 0)))) {
			return 0;
		}
		Player = null;
		rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			Player = $e;
			if ((((truthy(rt.fv(f, "mind", live(Player))) && !isEqual(rt.fv(f, "stat", live(Player)), 2)) && !truthy((rt.istype(live(Player), T("/mob/dead/new_player")) ? 1 : 0))) && !truthy((rt.istype(live(Player), T("/mob/living/brain")) ? 1 : 0)))) {
				if (truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(Player))))) {
					rt.setSv(f, "living_antag_player", live(Player));
					return 0;
				}
			}
		}
		rt.endFor(f, 0);
		if ((!truthy(rt.index(rt.fv(f, "continuous", rt.gl("config")), rt.sv(f, "config_tag"))) || truthy(live(force_ending)))) {
			return 1;
		} else {
			rt.setSv(f, "round_converted", (yield* g.srcCall(f, "convert_roundtype")));
			if (!truthy(rt.sv(f, "round_converted"))) {
				if (truthy(rt.sv(f, "round_ends_with_antag_death"))) {
					return 1;
				} else {
					rt.setAt(rt.fv(f, "midround_antag", rt.gl("config")), rt.sv(f, "config_tag"), 0);
					return 0;
				}
			}
		}
	}
	return 0;
}, true);

// /datum/game_mode/proc/declare_completion  (code/game/gamemodes/game_mode.dm:239)
rt.def("/datum/game_mode/proc/declare_completion", function declare_completion(f: Frame) {
	let clients: Value = null, surviving_humans: Value = null, surviving_total: Value = null, ghosts: Value = null, escaped_humans: Value = null, escaped_total: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [clients, surviving_humans, surviving_total, ghosts, escaped_humans, escaped_total, M, $e];
	clients = 0;
	surviving_humans = 0;
	surviving_total = 0;
	ghosts = 0;
	escaped_humans = 0;
	escaped_total = 0;
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.fv(f, "client", live(M)))) {
			clients = rt.inc(live(clients), 1);
			if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
				if (!truthy(rt.fv(f, "stat", live(M)))) {
					surviving_humans = rt.inc(live(surviving_humans), 1);
					if (isEqual(rt.fv(f, "z", live(M)), 1)) {
						escaped_humans = rt.inc(live(escaped_humans), 1);
					}
				}
			}
			if (!truthy(rt.fv(f, "stat", live(M)))) {
				surviving_total = rt.inc(live(surviving_total), 1);
				if (isEqual(rt.fv(f, "z", live(M)), 1)) {
					escaped_total = rt.inc(live(escaped_total), 1);
				}
			}
			if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
				ghosts = rt.inc(live(ghosts), 1);
			}
		}
	}
	rt.endFor(f, 0);
	if ((truthy(rt.len(f, rt.sv(f, "cult"))) && !truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/cult")) ? 1 : 0)))) {
		rt.callSrc(f, "datum_cult_completion", []);
	}
	return 0;
});

// /datum/game_mode/proc/send_intercept  (code/game/gamemodes/game_mode.dm:280)  may sleep
rt.def("/datum/game_mode/proc/send_intercept", function* send_intercept(f: Frame) {
	let intercepttext: Value = null, possible_modes: Value = null, i: Value = null, i_text: Value = null, V: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [intercepttext, possible_modes, i, i_text, V, G, $e];
	intercepttext = "<b><i>Central Command Status Summary</i></b><hr>";
	intercepttext = rt.modify(live(intercepttext), "<b>Central Command has intercepted and partially decoded a Syndicate transmission with vital information regarding their movements. The following report outlines the most likely threats to appear in your sector.</b>", add);
	yield* g.callName(f, (possible_modes = rt.list()), "Add", ["blob", "changeling", "clock_cult", "cult", "extended", "gang", "malf", "nuclear", "revolution", "traitor", "wizard"]);
	(possible_modes = rt.modify(live(possible_modes), rt.sv(f, "name"), subtract));
	i = null;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		(possible_modes = rt.modify(live(possible_modes), rt.op(f, "PickUnweighted", [1], [live(possible_modes)]), subtract));
	}
	rt.endFor(f, 0);
	(possible_modes = rt.modify(live(possible_modes), rt.sv(f, "name"), rt.bitOr));
	possible_modes = (yield* g.call(f, P("/proc/shuffle"), null, [live(possible_modes)]));
	i_text = (yield* g.new_(f, T("/datum/intercept_text"), []));
	V = null;
	rt.forList(f, 0, live(possible_modes));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		intercepttext = rt.modify(live(intercepttext), (yield* g.callName(f, live(i_text), "build", [live(V)])), add);
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, rt.sv(f, "station_goals")))) {
		intercepttext = rt.modify(live(intercepttext), fmt("<hr><b>Special Orders for ＀:</b>", [(yield* g.call(f, P("/proc/station_name"), null, []))]), add);
		G = null;
		rt.forList(f, 0, rt.sv(f, "station_goals"), T("/datum/station_goal"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			yield* g.callName(f, live(G), "on_report", []);
			intercepttext = rt.modify(live(intercepttext), (yield* g.callName(f, live(G), "get_report", [])), add);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/print_command_report"), null, [null, live(intercepttext), null, "Central Command Status Summary", "announce", 0], rt.Args.Named);
	yield* g.call(f, P("/proc/priority_announce"), null, ["A summary has been copied and printed to all communications consoles.", "Enemy communication intercepted. Security level elevated.", rt.rsc("sound/ai/intercept.ogg")]);
	if (!rt.lt(rt.gl("security_level"), 1)) return f.dot;
	yield* g.call(f, P("/proc/set_security_level"), null, [1]);
	return f.dot;
}, true);

// /datum/game_mode/proc/get_players_for_role  (code/game/gamemodes/game_mode.dm:310)
rt.def("/datum/game_mode/proc/get_players_for_role", function get_players_for_role(f: Frame, role: Value) {
	let players: Value = null, candidates: Value = null, drafted: Value = null, applicant: Value = null, player: Value = null, job: Value = null;
	let $e: any;
	f.vars = () => [players, candidates, drafted, applicant, player, job, $e];
	players = rt.list();
	candidates = rt.list();
	drafted = rt.list();
	applicant = null;
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if ((truthy(rt.fv(f, "client", live(player))) && isEqual(rt.fv(f, "ready", live(player)), 1))) {
			players = rt.modify(live(players), live(player), add);
		}
	}
	rt.endFor(f, 0);
	players = rt.call(f, P("/proc/shuffle"), null, [live(players)]);
	player = null;
	rt.forList(f, 0, live(players), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if ((truthy(rt.fv(f, "client", live(player))) && isEqual(rt.fv(f, "ready", live(player)), 1))) {
			if (truthy((rt.isIn(f, live(role), rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(player))))) ? 1 : 0))) {
				if ((!truthy(rt.call(f, P("/proc/jobban_isbanned"), null, [live(player), "Syndicate"])) && !truthy(rt.call(f, P("/proc/jobban_isbanned"), null, [live(player), live(role)])))) {
					candidates = rt.modify(live(candidates), rt.fv(f, "mind", live(player)), add);
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "restricted_jobs"))) {
		player = null;
		rt.forList(f, 0, live(candidates), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			player = $e;
			job = null;
			rt.forList(f, 1, rt.sv(f, "restricted_jobs"));
			while (($e = rt.next(f, 1)) !== undefined) {
				job = $e;
				if (isEqual(rt.fv(f, "assigned_role", live(player)), live(job))) {
					(candidates = rt.modify(live(candidates), live(player), subtract));
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	if (rt.lt(rt.len(f, live(candidates)), rt.sv(f, "recommended_enemies"))) {
		player = null;
		rt.forList(f, 0, live(players), T("/mob/dead/new_player"));
		while (($e = rt.next(f, 0)) !== undefined) {
			player = $e;
			if ((truthy(rt.fv(f, "client", live(player))) && isEqual(rt.fv(f, "ready", live(player)), 1))) {
				if (!truthy((rt.isIn(f, live(role), rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(player))))) ? 1 : 0))) {
					if ((!truthy(rt.call(f, P("/proc/jobban_isbanned"), null, [live(player), "Syndicate"])) && !truthy(rt.call(f, P("/proc/jobban_isbanned"), null, [live(player), live(role)])))) {
						drafted = rt.modify(live(drafted), rt.fv(f, "mind", live(player)), add);
					}
				}
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "restricted_jobs"))) {
		player = null;
		rt.forList(f, 0, live(drafted), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			player = $e;
			job = null;
			rt.forList(f, 1, rt.sv(f, "restricted_jobs"));
			while (($e = rt.next(f, 1)) !== undefined) {
				job = $e;
				if (isEqual(rt.fv(f, "assigned_role", live(player)), live(job))) {
					(drafted = rt.modify(live(drafted), live(player), subtract));
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	drafted = rt.call(f, P("/proc/shuffle"), null, [live(drafted)]);
	while (rt.lt(rt.len(f, live(candidates)), rt.sv(f, "recommended_enemies"))) {
		if (rt.gt(rt.len(f, live(drafted)), 0)) {
			if (truthy((applicant = rt.op(f, "PickUnweighted", [1], [live(drafted)])))) {
				candidates = rt.modify(live(candidates), live(applicant), add);
				rt.callName(f, live(drafted), "Remove", [live(applicant)]);
			}
		} else {
			break;
		}
	}
	if (truthy(rt.sv(f, "restricted_jobs"))) {
		player = null;
		rt.forList(f, 0, live(drafted), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			player = $e;
			job = null;
			rt.forList(f, 1, rt.sv(f, "restricted_jobs"));
			while (($e = rt.next(f, 1)) !== undefined) {
				job = $e;
				if (isEqual(rt.fv(f, "assigned_role", live(player)), live(job))) {
					(drafted = rt.modify(live(drafted), live(player), subtract));
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	drafted = rt.call(f, P("/proc/shuffle"), null, [live(drafted)]);
	while (rt.lt(rt.len(f, live(candidates)), rt.sv(f, "recommended_enemies"))) {
		if (rt.gt(rt.len(f, live(drafted)), 0)) {
			if (truthy((applicant = rt.op(f, "PickUnweighted", [1], [live(drafted)])))) {
				candidates = rt.modify(live(candidates), live(applicant), add);
				rt.callName(f, live(drafted), "Remove", [live(applicant)]);
			}
		} else {
			break;
		}
	}
	return live(candidates);
});

// /datum/game_mode/proc/num_players  (code/game/gamemodes/game_mode.dm:388)
rt.def("/datum/game_mode/proc/num_players", function num_players(f: Frame) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	f.dot = 0;
	_P = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if ((truthy(rt.fv(f, "client", live(_P))) && isEqual(rt.fv(f, "ready", live(_P)), 1))) {
			f.dot = rt.inc(live(f.dot), 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/game_mode/proc/get_living_heads  (code/game/gamemodes/game_mode.dm:396)
rt.def("/datum/game_mode/proc/get_living_heads", function get_living_heads(f: Frame) {
	let player: Value = null;
	let $e: any;
	f.vars = () => [player, $e];
	f.dot = rt.list();
	player = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if (((!isEqual(rt.fv(f, "stat", live(player)), 2) && truthy(rt.fv(f, "mind", live(player)))) && truthy((rt.isIn(f, rt.gv(f, "assigned_role", rt.fv(f, "mind", live(player))), rt.gl("command_positions")) ? 1 : 0)))) {
			(f.dot = rt.modify(live(f.dot), rt.fv(f, "mind", live(player)), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/game_mode/proc/get_all_heads  (code/game/gamemodes/game_mode.dm:406)
rt.def("/datum/game_mode/proc/get_all_heads", function get_all_heads(f: Frame) {
	let player: Value = null;
	let $e: any;
	f.vars = () => [player, $e];
	f.dot = rt.list();
	player = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if ((truthy(rt.fv(f, "mind", live(player))) && truthy((rt.isIn(f, rt.gv(f, "assigned_role", rt.fv(f, "mind", live(player))), rt.gl("command_positions")) ? 1 : 0)))) {
			(f.dot = rt.modify(live(f.dot), rt.fv(f, "mind", live(player)), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/game_mode/proc/get_living_sec  (code/game/gamemodes/game_mode.dm:415)
rt.def("/datum/game_mode/proc/get_living_sec", function get_living_sec(f: Frame) {
	let player: Value = null;
	let $e: any;
	f.vars = () => [player, $e];
	f.dot = rt.list();
	player = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if (((!isEqual(rt.fv(f, "stat", live(player)), 2) && truthy(rt.fv(f, "mind", live(player)))) && truthy((rt.isIn(f, rt.gv(f, "assigned_role", rt.fv(f, "mind", live(player))), rt.gl("security_positions")) ? 1 : 0)))) {
			(f.dot = rt.modify(live(f.dot), rt.fv(f, "mind", live(player)), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/game_mode/proc/get_all_sec  (code/game/gamemodes/game_mode.dm:424)
rt.def("/datum/game_mode/proc/get_all_sec", function get_all_sec(f: Frame) {
	let player: Value = null;
	let $e: any;
	f.vars = () => [player, $e];
	f.dot = rt.list();
	player = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if ((truthy(rt.fv(f, "mind", live(player))) && truthy((rt.isIn(f, rt.gv(f, "assigned_role", rt.fv(f, "mind", live(player))), rt.gl("security_positions")) ? 1 : 0)))) {
			(f.dot = rt.modify(live(f.dot), rt.fv(f, "mind", live(player)), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/display_roundstart_logout_report  (code/game/gamemodes/game_mode.dm:433)
rt.def("/proc/display_roundstart_logout_report", function display_roundstart_logout_report(f: Frame) {
	let msg: Value = null, L: Value = null, found: Value = null, C: Value = null, D: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [msg, L, found, C, D, M, $e];
	msg = "<span class='boldnotice'>Roundstart logout report\n\n</span>";
	L = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy(rt.fv(f, "ckey", live(L)))) {
			found = 0;
			C = null;
			rt.forList(f, 1, rt.gl("clients"), T("/client"));
			while (($e = rt.next(f, 1)) !== undefined) {
				C = $e;
				if (isEqual(rt.fv(f, "ckey", live(C)), rt.fv(f, "ckey", live(L)))) {
					found = 1;
					break;
				}
			}
			rt.endFor(f, 1);
			if (!truthy(live(found))) {
				msg = rt.modify(live(msg), fmt("<b>＀</b> (＀), the ＀ (<font color='#ffcc00'><b>Disconnected</b></font>)\n", [rt.fv(f, "name", live(L)), rt.fv(f, "ckey", live(L)), rt.fv(f, "job", live(L))]), add);
			}
		}
		if ((truthy(rt.fv(f, "ckey", live(L))) && truthy(rt.fv(f, "client", live(L))))) {
			if (rt.ge(rt.gv(f, "inactivity", rt.fv(f, "client", live(L))), 3000)) {
				msg = rt.modify(live(msg), fmt("<b>＀</b> (＀), the ＀ (<font color='#ffcc00'><b>Connected, Inactive</b></font>)\n", [rt.fv(f, "name", live(L)), rt.fv(f, "ckey", live(L)), rt.fv(f, "job", live(L))]), add);
				continue;
			}
			if (truthy(rt.fv(f, "stat", live(L)))) {
				if (truthy(rt.fv(f, "suiciding", live(L)))) {
					msg = rt.modify(live(msg), fmt("<b>＀</b> (＀), the ＀ (<span class='boldannounce'>Suicide</span>)\n", [rt.fv(f, "name", live(L)), rt.fv(f, "ckey", live(L)), rt.fv(f, "job", live(L))]), add);
					continue;
				}
				if (isEqual(rt.fv(f, "stat", live(L)), 1)) {
					msg = rt.modify(live(msg), fmt("<b>＀</b> (＀), the ＀ (Dying)\n", [rt.fv(f, "name", live(L)), rt.fv(f, "ckey", live(L)), rt.fv(f, "job", live(L))]), add);
					continue;
				}
				if (isEqual(rt.fv(f, "stat", live(L)), 2)) {
					msg = rt.modify(live(msg), fmt("<b>＀</b> (＀), the ＀ (Dead)\n", [rt.fv(f, "name", live(L)), rt.fv(f, "ckey", live(L)), rt.fv(f, "job", live(L))]), add);
					continue;
				}
			}
			continue;
		}
		D = null;
		rt.forList(f, 1, rt.gl("mob_list"), T("/mob/dead/observer"));
		while (($e = rt.next(f, 1)) !== undefined) {
			D = $e;
			if ((truthy(rt.fv(f, "mind", live(D))) && isEqual(rt.gv(f, "current", rt.fv(f, "mind", live(D))), live(L)))) {
				if (isEqual(rt.fv(f, "stat", live(L)), 2)) {
					if (truthy(rt.fv(f, "suiciding", live(L)))) {
						msg = rt.modify(live(msg), fmt("<b>＀</b> (＀), the ＀ (<span class='boldannounce'>Suicide</span>)\n", [rt.fv(f, "name", live(L)), rt.call(f, P("/proc/ckey"), null, [rt.gv(f, "key", rt.fv(f, "mind", live(D)))]), rt.fv(f, "job", live(L))]), add);
						continue;
					}
					msg = rt.modify(live(msg), fmt("<b>＀</b> (＀), the ＀ (Dead)\n", [rt.fv(f, "name", live(L)), rt.call(f, P("/proc/ckey"), null, [rt.gv(f, "key", rt.fv(f, "mind", live(D)))]), rt.fv(f, "job", live(L))]), add);
					continue;
				} else {
					if (truthy(rt.fv(f, "can_reenter_corpse", live(D)))) {
						continue;
					}
					msg = rt.modify(live(msg), fmt("<b>＀</b> (＀), the ＀ (<span class='boldannounce'>Ghosted</span>)\n", [rt.fv(f, "name", live(L)), rt.call(f, P("/proc/ckey"), null, [rt.gv(f, "key", rt.fv(f, "mind", live(D)))]), rt.fv(f, "job", live(L))]), add);
					continue;
				}
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy(rt.fv(f, "client", live(M))) && truthy(rt.gv(f, "holder", rt.fv(f, "client", live(M)))))) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), live(msg)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/game_mode/proc/printplayer  (code/game/gamemodes/game_mode.dm:485)
rt.def("/datum/game_mode/proc/printplayer", function printplayer(f: Frame, ply: Value, fleecheck: Value) {
	let text: Value = null;
	f.vars = () => [text];
	text = fmt("<br><b>＀</b> was <b>＀</b> the <b>＀</b> and", [rt.fv(f, "key", live(ply)), rt.fv(f, "name", live(ply)), rt.fv(f, "assigned_role", live(ply))]);
	if (truthy(rt.fv(f, "current", live(ply)))) {
		if (isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(ply))), 2)) {
			text = rt.modify(live(text), " <span class='boldannounce'>died</span>", add);
		} else {
			text = rt.modify(live(text), " <span class='greenannounce'>survived</span>", add);
		}
		if ((truthy(live(fleecheck)) && rt.gt(rt.gv(f, "z", rt.fv(f, "current", live(ply))), 2))) {
			text = rt.modify(live(text), " while <span class='boldannounce'>fleeing the station</span>", add);
		}
		if (!isEqual(rt.gv(f, "real_name", rt.fv(f, "current", live(ply))), rt.fv(f, "name", live(ply)))) {
			text = rt.modify(live(text), fmt(" as <b>＀</b>", [rt.gv(f, "real_name", rt.fv(f, "current", live(ply)))]), add);
		}
	} else {
		text = rt.modify(live(text), " <span class='boldannounce'>had their body destroyed</span>", add);
	}
	return live(text);
});

// /datum/game_mode/proc/printobjectives  (code/game/gamemodes/game_mode.dm:500)
rt.def("/datum/game_mode/proc/printobjectives", function printobjectives(f: Frame, ply: Value) {
	let text: Value = null, count: Value = null, objective: Value = null;
	let $e: any;
	f.vars = () => [text, count, objective, $e];
	text = "";
	count = 1;
	objective = null;
	rt.forList(f, 0, rt.fv(f, "objectives", live(ply)), T("/datum/objective"));
	while (($e = rt.next(f, 0)) !== undefined) {
		objective = $e;
		if (truthy(rt.callName(f, live(objective), "check_completion", []))) {
			text = rt.modify(live(text), fmt("<br><b>Objective #＀</b>: ＀ <span class='greenannounce'>Success!</span>", [live(count), rt.fv(f, "explanation_text", live(objective))]), add);
		} else {
			text = rt.modify(live(text), fmt("<br><b>Objective #＀</b>: ＀ <span class='boldannounce'>Fail.</span>", [live(count), rt.fv(f, "explanation_text", live(objective))]), add);
		}
		count = rt.inc(live(count), 1);
	}
	rt.endFor(f, 0);
	return live(text);
});

// /datum/game_mode/proc/replace_jobbaned_player  (code/game/gamemodes/game_mode.dm:530)  may sleep
rt.def("/datum/game_mode/proc/replace_jobbaned_player", function* replace_jobbaned_player(f: Frame, M: Value, role_type: Value, pref: Value) {
	let candidates: Value = null, theghost: Value = null;
	f.vars = () => [M, role_type, pref, candidates, theghost];
	candidates = (yield* g.call(f, P("/proc/pollCandidatesForMob"), null, [fmt("Do you want to play as a ＀?", [live(role_type)]), fmt("＀", [live(role_type)]), null, live(pref), 50, live(M)]));
	theghost = null;
	if (!truthy(rt.len(f, live(candidates)))) return f.dot;
	theghost = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), "Your mob has been taken over by a ghost! Appeal your job ban if you want to avoid this in the future!"]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has taken control of (＀) to replace a jobbaned player.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(theghost)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)]))])]);
	yield* g.callName(f, live(M), "ghostize", [0]);
	rt.setFv(f, "key", live(M), rt.fv(f, "key", live(theghost)));
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }, {  }, {  }] });

// /datum/game_mode/proc/remove_antag_for_borging  (code/game/gamemodes/game_mode.dm:540)  may sleep
rt.def("/datum/game_mode/proc/remove_antag_for_borging", function* remove_antag_for_borging(f: Frame, newborgie: Value) {
	f.vars = () => [newborgie];
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_cultist", [live(newborgie), 0, 0]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_revolutionary", [live(newborgie), 0]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_gangster", [null, live(newborgie), null, 0, "remove_bosses", 1], rt.Args.Named);
	return f.dot;
}, true);

// /datum/game_mode/proc/generate_station_goals  (code/game/gamemodes/game_mode.dm:545)  may sleep
rt.def("/datum/game_mode/proc/generate_station_goals", function* generate_station_goals(f: Frame) {
	let possible: Value = null, _T: Value = null, G: Value = null, goal_weights: Value = null, picked: Value = null;
	let $e: any;
	f.vars = () => [possible, _T, G, goal_weights, picked, $e];
	possible = rt.list();
	_T = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/station_goal")])), T("/datum/station_goal")));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		G = live(_T);
		if (truthy((rt.isIn(f, rt.sv(f, "config_tag"), rt.initial(f, live(G), "gamemode_blacklist")) ? 1 : 0))) {
			continue;
		}
		possible = rt.modify(live(possible), live(_T), add);
	}
	rt.endFor(f, 0);
	goal_weights = 0;
	while (truthy(rt.len(f, live(possible))) && rt.lt(live(goal_weights), 1)) {
		goal_weights = rt.modify(live(goal_weights), rt.initial(f, (picked = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(possible)]))), "weight"), add);
		rt.modSrcVar(f, "station_goals", (yield* g.new_(f, live(picked), [])), add);
	}
	return f.dot;
}, true);

// /datum/game_mode/proc/declare_station_goal_completion  (code/game/gamemodes/game_mode.dm:559)
rt.def("/datum/game_mode/proc/declare_station_goal_completion", function declare_station_goal_completion(f: Frame) {
	let V: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [V, G, $e];
	V = null;
	rt.forList(f, 0, rt.sv(f, "station_goals"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		rt.callName(f, (G = live(V)), "print_result", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});
