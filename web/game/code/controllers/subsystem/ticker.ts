// From code/controllers/subsystem/ticker.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(46, "/datum/controller/subsystem/ticker", "/datum/controller/subsystem", {
	current_state: 0,
	force_ending: 0,
	start_immediately: 0,
	hide_mode: 0,
	mode: null,
	event_time: null,
	event: 0,
	login_music: null,
	round_end_sound: null,
	round_end_sound_sent: 1,
	minds: null,
	syndicate_coalition: null,
	factions: null,
	availablefactions: null,
	scripture_states: null,
	delay_end: 0,
	triai: 0,
	tipped: 0,
	selected_tip: null,
	timeLeft: null,
	start_at: null,
	gametime_offset: 432000,
	totalPlayers: 0,
	totalPlayersReady: 0,
	queue_delay: 0,
	queued_players: null,
	cinematic: null,
	maprotatechecked: 0,
	news_report: null,
	late_join_disabled: null,
	round_start_time: 0,
	round_start_events: null,
	mode_result: "undefined",
	end_state: "undefined",
	name: "Ticker",
	init_order: 13,
	priority: 200,
	flags: 32,
	runlevels: 7,
});

// /datum/controller/subsystem/ticker/proc/New  (code/controllers/subsystem/ticker.dm:3)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSticker"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSticker"), T("/datum/controller/subsystem/ticker")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSticker")]);
		}
		rt.setGl("SSticker", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/ticker/proc/<init>  (code/controllers/subsystem/ticker.dm:25)
rt.def("/datum/controller/subsystem/ticker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "minds", rt.list());
	$0 = $0;
	rt.setSv(f, "syndicate_coalition", rt.list());
	$0 = $0;
	rt.setSv(f, "factions", rt.list());
	$0 = $0;
	rt.setSv(f, "availablefactions", rt.list());
	rt.setSv(f, "scripture_states", rt.alist(f, ["Driver", 1, "Script", 0, "Application", 0, "Judgement", 0]));
	$0 = $0;
	rt.setSv(f, "queued_players", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/ticker/proc/Initialize  (code/controllers/subsystem/ticker.dm:66)
rt.def("/datum/controller/subsystem/ticker/proc/Initialize", function Initialize(f: Frame) {
	let music: Value = null;
	f.vars = () => [music];
	rt.callSrc(f, "load_mode", []);
	rt.setSv(f, "login_music", rt.op(f, "PickUnweighted", [1], [(music = rt.callName(f, rt.world(), "file2list", ["strings/round_start_sounds.txt", "\n"]))]));
	if (!truthy(rt.gl("syndicate_code_phrase"))) {
		rt.setGl("syndicate_code_phrase", rt.call(f, P("/proc/generate_code_phrase"), null, []));
	}
	if (!truthy(rt.gl("syndicate_code_response"))) {
		rt.setGl("syndicate_code_response", rt.call(f, P("/proc/generate_code_phrase"), null, []));
	}
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "start_at", add(rt.worldTime(f), multiply(rt.fv(f, "lobby_countdown", rt.gl("config")), 10)));
	return f.dot;
}, false, { args: ["timeofday"] });

// /datum/controller/subsystem/ticker/proc/fire  (code/controllers/subsystem/ticker.dm:78)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/fire", function* fire(f: Frame) {
	let C: Value = null, player: Value = null;
	let $0: any, $e: any;
	f.vars = () => [C, player, $0, $e];
	$0 = rt.sv(f, "current_state");
	if ($0 === 0) {
		if (truthy(rt.fv(f, "initializations_finished_with_no_players_logged_in", rt.gl("Master")))) {
			rt.setSv(f, "start_at", add(rt.worldTime(f), multiply(rt.fv(f, "lobby_countdown", rt.gl("config")), 10)));
		}
		C = null;
		rt.forList(f, 0, rt.gl("clients"), T("/client"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			yield* g.call(f, P("/proc/window_flash"), null, [null, live(C), "ignorepref", 1], rt.Args.Named);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldnotice'>Welcome to ＀!</span>", [(yield* g.call(f, P("/proc/station_name"), null, []))])]);
		rt.setSv(f, "current_state", 1);
		yield* g.srcCall(f, "create_observers");
		yield* g.srcCall(f, "fire");
	} else if ($0 === 1) {
		if (rt.sv(f, "timeLeft") === null) {
			rt.setSv(f, "timeLeft", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "start_at"), rt.worldTime(f))])));
		}
		rt.setSv(f, "totalPlayers", 0);
		rt.setSv(f, "totalPlayersReady", 0);
		player = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/new_player"));
		while (($e = rt.next(f, 0)) !== undefined) {
			player = $e;
			rt.incSrcVar(f, "totalPlayers", 1, false);
			if (isEqual(rt.fv(f, "ready", live(player)), 1)) {
				rt.incSrcVar(f, "totalPlayersReady", 1, false);
			}
		}
		rt.endFor(f, 0);
		if (truthy(rt.sv(f, "start_immediately"))) {
			rt.setSv(f, "timeLeft", 0);
		}
		if (rt.lt(rt.sv(f, "timeLeft"), 0)) {
			return live(f.dot);
		}
		(rt.modSrcVar(f, "timeLeft", rt.sv(f, "wait"), subtract));
		if ((rt.le(rt.sv(f, "timeLeft"), 300) && !truthy(rt.sv(f, "tipped")))) {
			yield* g.srcCall(f, "send_tip_of_the_round");
			rt.setSv(f, "tipped", 1);
		}
		if (rt.le(rt.sv(f, "timeLeft"), 0)) {
			rt.setSv(f, "current_state", 2);
			yield* g.callName(f, rt.gl("Master"), "SetRunLevel", [2]);
			if (truthy(rt.sv(f, "start_immediately"))) {
				yield* g.srcCall(f, "fire");
			}
		}
	} else if ($0 === 2) {
		if (!truthy((yield* g.srcCall(f, "setup")))) {
			rt.setSv(f, "current_state", 0);
			yield* g.callName(f, rt.gl("Master"), "SetRunLevel", [1]);
		}
	} else if ($0 === 3) {
		yield* g.callName(f, rt.sv(f, "mode"), "process", [multiply(rt.sv(f, "wait"), 0.10000000149011612)]);
		yield* g.srcCall(f, "check_queue");
		yield* g.srcCall(f, "check_maprotate");
		rt.setSv(f, "scripture_states", (yield* g.call(f, P("/proc/scripture_unlock_alert"), null, [rt.sv(f, "scripture_states")])));
		if (!((!truthy(rt.fv(f, "explosion_in_progress", rt.sv(f, "mode"))) && truthy((yield* g.callName(f, rt.sv(f, "mode"), "check_finished", [rt.sv(f, "force_ending")])))) || truthy(rt.sv(f, "force_ending")))) return f.dot;
		rt.setSv(f, "current_state", 4);
		yield* g.call(f, P("/proc/toggle_ooc"), null, [1]);
		yield* g.srcCall(f, "declare_completion", rt.sv(f, "force_ending"));
		yield* g.callName(f, rt.gl("Master"), "SetRunLevel", [8]);
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/ticker/proc/setup  (code/controllers/subsystem/ticker.dm:138)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/setup", function* setup(f: Frame) {
	let init_start: Value = null, runnable_modes: Value = null, smode: Value = null, can_continue: Value = null, modes: Value = null, M: Value = null, I: Value = null, cb: Value = null, holidayname: Value = null, holiday: Value = null;
	let $e: any;
	f.vars = () => [init_start, runnable_modes, smode, can_continue, modes, M, I, cb, holidayname, holiday, $e];
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>Starting game...</span>"]);
	init_start = rt.fv(f, "timeofday", rt.world());
	runnable_modes = null;
	if ((isEqual(rt.gl("master_mode"), "random") || isEqual(rt.gl("master_mode"), "secret"))) {
		runnable_modes = (yield* g.callName(f, rt.gl("config"), "get_runnable_modes", []));
		if (isEqual(rt.gl("master_mode"), "secret")) {
			rt.setSv(f, "hide_mode", 1);
			if (!isEqual(rt.gl("secret_force_mode"), "secret")) {
				if (!truthy((yield* g.callName(f, (smode = (yield* g.callName(f, rt.gl("config"), "pick_mode", [rt.gl("secret_force_mode")]))), "can_start", [])))) {
					yield* g.call(f, P("/proc/message_admins"), null, [fmt(" Unable to force secret ＀. ＀ players and ＀ eligible antagonists needed.", [rt.gl("secret_force_mode"), rt.fv(f, "required_players", live(smode)), rt.fv(f, "required_enemies", live(smode))])]);
				} else {
					rt.setSv(f, "mode", live(smode));
				}
			}
		}
		if (!truthy(rt.sv(f, "mode"))) {
			if (!truthy(rt.len(f, live(runnable_modes)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>Unable to choose playable game mode.</B> Reverting to pre-game lobby."]);
				return 0;
			}
			rt.setSv(f, "mode", (yield* g.call(f, P("/proc/pickweight"), null, [live(runnable_modes)])));
		}
	} else {
		rt.setSv(f, "mode", (yield* g.callName(f, rt.gl("config"), "pick_mode", [rt.gl("master_mode")])));
		if (!truthy((yield* g.callName(f, rt.sv(f, "mode"), "can_start", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<B>Unable to start ＀.</B> Not enough players, ＀ players and ＀ eligible antagonists needed. Reverting to pre-game lobby.", [rt.fv(f, "name", rt.sv(f, "mode")), rt.fv(f, "required_players", rt.sv(f, "mode")), rt.fv(f, "required_enemies", rt.sv(f, "mode"))])]);
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "mode")]);
			rt.setSv(f, "mode", null);
			yield* g.callName(f, rt.gl("SSjob"), "ResetOccupations", []);
			return 0;
		}
	}
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	can_continue = 0;
	can_continue = (yield* g.callName(f, rt.fv(f, "mode", live(f.src)), "pre_setup", []));
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	yield* g.callName(f, rt.gl("SSjob"), "DivideOccupations", []);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	if (!truthy(rt.gl("Debug2"))) {
		if (!truthy(live(can_continue))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "mode")]);
			rt.setSv(f, "mode", null);
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<B>Error setting up ＀.</B> Reverting to pre-game lobby.", [rt.gl("master_mode")])]);
			yield* g.callName(f, rt.gl("SSjob"), "ResetOccupations", []);
			return 0;
		}
	} else {
		yield* g.call(f, P("/proc/message_admins"), null, ["<span class='notice'>DEBUG: Bypassing prestart checks...</span>"]);
	}
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	if (truthy(rt.sv(f, "hide_mode"))) {
		modes = (yield* g.new_(f, T("/list"), []));
		M = null;
		rt.forList(f, 0, live(runnable_modes), T("/datum/game_mode"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			modes = rt.modify(live(modes), rt.fv(f, "name", live(M)), add);
		}
		rt.endFor(f, 0);
		modes = (yield* g.call(f, P("/proc/sortList"), null, [live(modes)]));
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<b>The gamemode is: secret!\nPossibilities:</B> ＀", [(yield* g.call(f, P("/proc/english_list"), null, [live(modes)]))])]);
	} else {
		yield* g.callName(f, rt.sv(f, "mode"), "announce", []);
	}
	if (!truthy(rt.fv(f, "ooc_during_round", rt.gl("config")))) {
		yield* g.call(f, P("/proc/toggle_ooc"), null, [0]);
	}
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	rt.setGl("start_landmarks_list", (yield* g.call(f, P("/proc/shuffle"), null, [rt.gl("start_landmarks_list")])));
	yield* g.srcCall(f, "create_characters");
	yield* g.srcCall(f, "collect_minds");
	yield* g.srcCall(f, "equip_characters");
	yield* g.callName(f, rt.gl("SSoverlays"), "Flush", []);
	yield* g.callName(f, rt.gl("data_core"), "manifest", []);
	yield* g.srcCall(f, "transfer_characters");
	I = null;
	rt.forList(f, 0, rt.sv(f, "round_start_events"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, (cb = live(I)), "InvokeAsync", []);
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "round_start_events"))) {
		yield* g.callName(f, rt.sv(f, "round_start_events"), "Cut", []);
	}
	yield* g.call(f, P("/proc/log_world"), null, [fmt("Game start took ＀s", [divide(subtract(rt.fv(f, "timeofday", rt.world()), live(init_start)), 10)])]);
	rt.setSv(f, "round_start_time", rt.worldTime(f));
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<FONT color='blue'><B>Welcome to ＀, enjoy your stay!</B></FONT>", [(yield* g.call(f, P("/proc/station_name"), null, []))])]);
	rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/ai/welcome.ogg")]))], false);
	rt.setSv(f, "current_state", 3);
	yield* g.callName(f, rt.gl("Master"), "SetRunLevel", [4]);
	if (truthy(rt.fv(f, "holidays", rt.gl("SSevents")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<font color='blue'>and...</font>"]);
		holidayname = null;
		rt.forList(f, 0, rt.fv(f, "holidays", rt.gl("SSevents")));
		while (($e = rt.next(f, 0)) !== undefined) {
			holidayname = $e;
			holiday = rt.index(rt.fv(f, "holidays", rt.gl("SSevents")), live(holidayname));
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<h4>＀</h4>", [(yield* g.callName(f, live(holiday), "greet", []))])]);
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "PostSetup");
	return 1;
}, true);

// /datum/controller/subsystem/ticker/proc/PostSetup  (code/controllers/subsystem/ticker.dm:238)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/PostSetup", function* PostSetup(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	yield* g.callName(f, rt.sv(f, "mode"), "post_setup", []);
	rt.setGl("start_state", (yield* g.new_(f, T("/datum/station_state"), [])));
	yield* g.callName(f, rt.gl("start_state"), "count", [1]);
	S = null;
	rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark/start"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (!isEqual(rt.fv(f, "name", live(S)), "AI")) {
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /datum/controller/subsystem/ticker/proc/OnRoundstart  (code/controllers/subsystem/ticker.dm:252)
rt.def("/datum/controller/subsystem/ticker/proc/OnRoundstart", function OnRoundstart(f: Frame, cb: Value) {
	if (!truthy(rt.callSrc(f, "HasRoundStarted", []))) {
		if (!truthy(rt.sv(f, "round_start_events"))) {
			rt.setSv(f, "round_start_events", rt.list());
		}
		rt.modSrcVar(f, "round_start_events", live(cb), add);
	} else {
		rt.callName(f, live(cb), "InvokeAsync", []);
	}
	return f.dot;
});

// /datum/controller/subsystem/ticker/proc/station_explosion_detonation  (code/controllers/subsystem/ticker.dm:260)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/station_explosion_detonation", function* station_explosion_detonation(f: Frame, bomb: Value) {
	let epi: Value = null;
	f.vars = () => [bomb, epi];
	if (!truthy(live(bomb))) return f.dot;
	epi = rt.fv(f, "loc", live(bomb));
	yield* g.call(f, P("/proc/qdel"), null, [live(bomb)]);
	if (!truthy(live(epi))) return f.dot;
	yield* g.call(f, P("/proc/explosion"), null, [live(epi), 0, 256, 512, 0, 1, 1, 0, 1]);
	return f.dot;
}, true);

// /datum/controller/subsystem/ticker/proc/station_explosion_cinematic  (code/controllers/subsystem/ticker.dm:269)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/station_explosion_cinematic", function* station_explosion_cinematic(f: Frame, station_missed: Value, override: Value, bomb: Value) {
	let hi: Value = null, M: Value = null, actually_blew_up: Value = null, bombloc: Value = null;
	let $0: any, $e: any;
	f.vars = () => [station_missed, override, bomb, hi, M, actually_blew_up, bombloc, $0, $e];
	if (live(station_missed) === null) {
		station_missed = 0;
	}
	if (live(override) === null) {
		override = null;
	}
	if (live(bomb) === null) {
		bomb = null;
	}
	if (truthy(rt.sv(f, "cinematic"))) {
		return live(f.dot);
	}
	hi = null;
	rt.forList(f, 0, rt.gl("html_interfaces"), T("/datum/html_interface"));
	while (($e = rt.next(f, 0)) !== undefined) {
		hi = $e;
		yield* g.callName(f, live(hi), "closeAll", []);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.gl("SStgui"), "close_all_uis", []);
	if ((!truthy(live(station_missed)) && truthy(live(bomb)))) {
		yield* g.callName(f, rt.gl("SSshuttle"), "registerHostileEnvironment", [live(f.src)]);
		rt.setFv(f, "lockdown", rt.gl("SSshuttle"), 1);
	}
	rt.setSv(f, "cinematic", (yield* g.newOv(f, T("/obj/screen"), "{\"icon\":{\"type\":0,\"resourcePath\":\"icons/effects/station_explosion.dmi\"},\"icon_state\":\"station_intact\",\"layer\":21,\"mouse_opacity\":0,\"screen_loc\":\"CENTER-7,0\"}", [live(f.src)])));
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.setFv(f, "notransform", live(M), 1);
		if (truthy(rt.fv(f, "client", live(M)))) {
			rt.modField(f, rt.fv(f, "client", live(M)), "screen", rt.sv(f, "cinematic"), add);
		}
	}
	rt.endFor(f, 0);
	actually_blew_up = 1;
	$0 = live(station_missed);
	if ($0 === 1) {
		if ((truthy(rt.sv(f, "mode")) && !truthy(live(override)))) {
			override = rt.fv(f, "name", rt.sv(f, "mode"));
		}
		$0 = live(override);
		if ($0 === "nuclear emergency") {
			yield* g.call(f, P("/proc/flick"), null, ["intro_nuke", rt.sv(f, "cinematic")]);
			yield* g.call(f, P("/proc/sleep"), null, [35]);
			rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/explosionfar.ogg")]))], false);
			yield* g.srcCall(f, "station_explosion_detonation", live(bomb));
			yield* g.call(f, P("/proc/flick"), null, ["station_intact_fade_red", rt.sv(f, "cinematic")]);
			rt.setFv(f, "icon_state", rt.sv(f, "cinematic"), "summary_nukefail");
		} else if ($0 === "cult") {
			rt.setFv(f, "icon_state", rt.sv(f, "cinematic"), null);
			yield* g.call(f, P("/proc/flick"), null, ["intro_cult", rt.sv(f, "cinematic")]);
			yield* g.call(f, P("/proc/sleep"), null, [25]);
			rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/magic/enter_blood.ogg")]))], false);
			yield* g.call(f, P("/proc/sleep"), null, [28]);
			rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/machines/terminal_off.ogg")]))], false);
			yield* g.call(f, P("/proc/sleep"), null, [20]);
			yield* g.call(f, P("/proc/flick"), null, ["station_corrupted", rt.sv(f, "cinematic")]);
			rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/ghost.ogg")]))], false);
			actually_blew_up = 0;
		} else if ($0 === "gang war") {
			rt.setFv(f, "icon_state", rt.sv(f, "cinematic"), "intro_malf_still");
			yield* g.call(f, P("/proc/flick"), null, ["intro_malf", rt.sv(f, "cinematic")]);
			actually_blew_up = 0;
			yield* g.call(f, P("/proc/sleep"), null, [70]);
		} else if ($0 === "fake") {
			yield* g.call(f, P("/proc/flick"), null, ["intro_nuke", rt.sv(f, "cinematic")]);
			yield* g.call(f, P("/proc/sleep"), null, [35]);
			rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/items/bikehorn.ogg")]))], false);
			yield* g.call(f, P("/proc/flick"), null, ["summary_selfdes", rt.sv(f, "cinematic")]);
			actually_blew_up = 0;
		} else {
			yield* g.call(f, P("/proc/flick"), null, ["intro_nuke", rt.sv(f, "cinematic")]);
			yield* g.call(f, P("/proc/sleep"), null, [35]);
			rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/explosionfar.ogg")]))], false);
			yield* g.srcCall(f, "station_explosion_detonation", live(bomb));
		}
	} else if ($0 === 2) {
		yield* g.call(f, P("/proc/sleep"), null, [50]);
		rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/explosionfar.ogg")]))], false);
		yield* g.srcCall(f, "station_explosion_detonation", live(bomb));
		actually_blew_up = (isEqual(live(station_missed), 3) ? 1 : 0);
	} else {
		if ((truthy(rt.sv(f, "mode")) && !truthy(live(override)))) {
			override = rt.fv(f, "name", rt.sv(f, "mode"));
		}
		$0 = live(override);
		if ($0 === "nuclear emergency") {
			yield* g.call(f, P("/proc/flick"), null, ["intro_nuke", rt.sv(f, "cinematic")]);
			yield* g.call(f, P("/proc/sleep"), null, [35]);
			yield* g.call(f, P("/proc/flick"), null, ["station_explode_fade_red", rt.sv(f, "cinematic")]);
			rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/explosionfar.ogg")]))], false);
			yield* g.srcCall(f, "station_explosion_detonation", live(bomb));
			rt.setFv(f, "icon_state", rt.sv(f, "cinematic"), "summary_nukewin");
		} else if ($0 === "AI malfunction") {
			yield* g.call(f, P("/proc/flick"), null, ["intro_malf", rt.sv(f, "cinematic")]);
			yield* g.call(f, P("/proc/sleep"), null, [76]);
			yield* g.call(f, P("/proc/flick"), null, ["station_explode_fade_red", rt.sv(f, "cinematic")]);
			rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/explosionfar.ogg")]))], false);
			yield* g.srcCall(f, "station_explosion_detonation", live(bomb));
			rt.setFv(f, "icon_state", rt.sv(f, "cinematic"), "summary_malf");
		} else if ($0 === "blob") {
			yield* g.call(f, P("/proc/flick"), null, ["intro_nuke", rt.sv(f, "cinematic")]);
			yield* g.call(f, P("/proc/sleep"), null, [35]);
			yield* g.call(f, P("/proc/flick"), null, ["station_explode_fade_red", rt.sv(f, "cinematic")]);
			rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/explosionfar.ogg")]))], false);
			yield* g.srcCall(f, "station_explosion_detonation", live(bomb));
			rt.setFv(f, "icon_state", rt.sv(f, "cinematic"), "summary_selfdes");
		} else if ($0 === "cult") {
			yield* g.call(f, P("/proc/flick"), null, ["intro_nuke", rt.sv(f, "cinematic")]);
			yield* g.call(f, P("/proc/sleep"), null, [35]);
			yield* g.call(f, P("/proc/flick"), null, ["station_explode_fade_red", rt.sv(f, "cinematic")]);
			rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/explosionfar.ogg")]))], false);
			yield* g.srcCall(f, "station_explosion_detonation", live(bomb));
			rt.setFv(f, "icon_state", rt.sv(f, "cinematic"), "summary_cult");
		} else if ($0 === "no_core") {
			yield* g.call(f, P("/proc/flick"), null, ["intro_nuke", rt.sv(f, "cinematic")]);
			yield* g.call(f, P("/proc/sleep"), null, [35]);
			yield* g.call(f, P("/proc/flick"), null, ["station_intact", rt.sv(f, "cinematic")]);
			rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/ambience/signal.ogg")]))], false);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/controller/subsystem/ticker/proc/finish_cinematic"), null, 0])), 100]);
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/flick"), null, ["intro_nuke", rt.sv(f, "cinematic")]);
			yield* g.call(f, P("/proc/sleep"), null, [35]);
			yield* g.call(f, P("/proc/flick"), null, ["station_explode_fade_red", rt.sv(f, "cinematic")]);
			rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/explosionfar.ogg")]))], false);
			yield* g.srcCall(f, "station_explosion_detonation", live(bomb));
			rt.setFv(f, "icon_state", rt.sv(f, "cinematic"), "summary_selfdes");
		}
	}
	bombloc = null;
	if (truthy(live(actually_blew_up))) {
		if ((truthy(live(bomb)) && truthy(rt.fv(f, "loc", live(bomb))))) {
			bombloc = rt.fv(f, "z", live(bomb));
		} else {
			if (!truthy(live(station_missed))) {
				bombloc = 2;
			}
		}
		if (truthy(rt.sv(f, "mode"))) {
			rt.setFv(f, "explosion_in_progress", rt.sv(f, "mode"), 0);
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>The station was destoyed by the nuclear blast!</B>"]);
			rt.setFv(f, "station_was_nuked", rt.sv(f, "mode"), (rt.lt(live(station_missed), 2) ? 1 : 0));
		}
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/controller/subsystem/ticker/proc/finish_cinematic"), live(bombloc), live(actually_blew_up)])), 300]);
	return f.dot;
}, true, { argTypes: [{  }, {  }, { path: "/atom" }] });

// /datum/controller/subsystem/ticker/proc/finish_cinematic  (code/controllers/subsystem/ticker.dm:399)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/finish_cinematic", function* finish_cinematic(f: Frame, killz: Value, actually_blew_up: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [killz, actually_blew_up, M, $e];
	if (truthy(rt.sv(f, "cinematic"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cinematic")]);
		rt.setSv(f, "cinematic", null);
	}
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.setFv(f, "notransform", live(M), 0);
		if ((((truthy(live(actually_blew_up)) && live(killz) !== null) && !isEqual(rt.fv(f, "stat", live(M)), 2)) && isEqual(rt.fv(f, "z", live(M)), live(killz)))) {
			yield* g.callName(f, live(M), "gib", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/ticker/proc/create_characters  (code/controllers/subsystem/ticker.dm:407)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/create_characters", function* create_characters(f: Frame) {
	let player: Value = null;
	let $e: any;
	f.vars = () => [player, $e];
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if ((isEqual(rt.fv(f, "ready", live(player)), 1) && truthy(rt.fv(f, "mind", live(player))))) {
			rt.modGl("joined_player_list", rt.fv(f, "ckey", live(player)), add);
			yield* g.callName(f, live(player), "create_character", [0]);
		} else {
			yield* g.callName(f, live(player), "new_player_panel", []);
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/ticker/proc/collect_minds  (code/controllers/subsystem/ticker.dm:416)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/collect_minds", function* collect_minds(f: Frame) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	_P = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if ((truthy(rt.fv(f, "new_character", live(_P))) && truthy(rt.gv(f, "mind", rt.fv(f, "new_character", live(_P)))))) {
			rt.modField(f, rt.gl("SSticker"), "minds", rt.gv(f, "mind", rt.fv(f, "new_character", live(_P))), add);
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/ticker/proc/equip_characters  (code/controllers/subsystem/ticker.dm:424)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/equip_characters", function* equip_characters(f: Frame) {
	let captainless: Value = null, N: Value = null, player: Value = null;
	let $e: any;
	f.vars = () => [captainless, N, player, $e];
	captainless = 1;
	N = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		if (((truthy((rt.istype((player = rt.fv(f, "new_character", live(N))), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy(rt.fv(f, "mind", live(player)))) && truthy(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(player)))))) {
			if (isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(player))), "Captain")) {
				captainless = 0;
			}
			if (!isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(player))), rt.gv(f, "special_role", rt.fv(f, "mind", live(player))))) {
				yield* g.callName(f, rt.gl("SSjob"), "EquipRank", [live(N), rt.gv(f, "assigned_role", rt.fv(f, "mind", live(player))), 0]);
			}
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(captainless))) return f.dot;
	N = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		if (truthy(rt.fv(f, "new_character", live(N)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(N), "Captainship not forced on anyone."]);
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/ticker/proc/transfer_characters  (code/controllers/subsystem/ticker.dm:439)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/transfer_characters", function* transfer_characters(f: Frame) {
	let livings: Value = null, player: Value = null, living: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [livings, player, living, S, $e];
	livings = rt.list();
	player = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if (truthy((living = (yield* g.callName(f, live(player), "transfer_character", []))))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(player)]);
			rt.setFv(f, "notransform", live(living), 1);
			if (truthy(rt.fv(f, "client", live(living)))) {
				yield* g.callName(f, (S = (yield* g.new_(f, T("/obj/screen/splash"), [rt.fv(f, "client", live(living)), 1]))), "Fade", [1]);
			}
			livings = rt.modify(live(livings), live(living), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(livings)))) return f.dot;
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/controller/subsystem/ticker/proc/release_characters"), live(livings)])), 30, 4]);
	return f.dot;
}, true);

// /datum/controller/subsystem/ticker/proc/release_characters  (code/controllers/subsystem/ticker.dm:453)
rt.def("/datum/controller/subsystem/ticker/proc/release_characters", function release_characters(f: Frame, livings: Value) {
	let I: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [I, L, $e];
	I = null;
	rt.forList(f, 0, live(livings));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.setFv(f, "notransform", (L = live(I)), 0);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { argTypes: [{ path: "/list" }] });

// /datum/controller/subsystem/ticker/proc/declare_completion  (code/controllers/subsystem/ticker.dm:459)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/declare_completion", function* declare_completion(f: Frame) {
	let station_evacuated: Value = null, num_survivors: Value = null, num_escapees: Value = null, num_shuttle_escapees: Value = null, Player: Value = null, shuttle_area: Value = null, end_state: Value = null, station_integrity: Value = null, total_players: Value = null, aiPlayer: Value = null, robolist: Value = null, robo: Value = null, robo_7: Value = null, handler: Value = null, total_antagonists: Value = null, Mind: Value = null, temprole: Value = null, i: Value = null, com: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [station_evacuated, num_survivors, num_escapees, num_shuttle_escapees, Player, shuttle_area, end_state, station_integrity, total_players, aiPlayer, robolist, robo, robo_7, handler, total_antagonists, Mind, temprole, i, com, $0, $1, $2, $e];
	station_evacuated = (rt.fv(f, "emergency", rt.gl("SSshuttle")) && ((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "escape") ? 1 : 0) || (isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "endgame: game over") ? 1 : 0)));
	num_survivors = 0;
	num_escapees = 0;
	num_shuttle_escapees = 0;
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<BR><BR><BR><FONT size=3><B>The round has ended.</B></FONT>"]);
	Player = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Player = $e;
		if ((truthy(rt.fv(f, "mind", live(Player))) && !truthy((rt.istype(live(Player), T("/mob/dead/new_player")) ? 1 : 0)))) {
			if ((!isEqual(rt.fv(f, "stat", live(Player)), 2) && !truthy((rt.istype(live(Player), T("/mob/living/brain")) ? 1 : 0)))) {
				num_survivors = rt.inc(live(num_survivors), 1);
				if (truthy(live(station_evacuated))) {
					shuttle_area = null;
					if ((truthy(rt.gl("SSshuttle")) && truthy(rt.fv(f, "emergency", rt.gl("SSshuttle"))))) {
						shuttle_area = rt.gv(f, "areaInstance", rt.fv(f, "emergency", rt.gl("SSshuttle")));
					}
					if ((!truthy((yield* g.callName(f, live(Player), "onCentcom", []))) && !truthy((yield* g.callName(f, live(Player), "onSyndieBase", []))))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(Player), fmt("<font color='blue'><b>You managed to survive, but were marooned on ＀...</b></FONT>", [(yield* g.call(f, P("/proc/station_name"), null, []))])]);
					} else {
						num_escapees = rt.inc(live(num_escapees), 1);
						yield* g.call(f, P("/proc/to_chat"), null, [live(Player), fmt("<font color='green'><b>You managed to survive the events on ＀ as ＀.</b></FONT>", [(yield* g.call(f, P("/proc/station_name"), null, [])), rt.fv(f, "real_name", live(Player))])]);
						if (isEqual((yield* g.call(f, P("/proc/get_area"), null, [live(Player)])), live(shuttle_area))) {
							num_shuttle_escapees = rt.inc(live(num_shuttle_escapees), 1);
						}
					}
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(Player), fmt("<font color='green'><b>You managed to survive the events on ＀ as ＀.</b></FONT>", [(yield* g.call(f, P("/proc/station_name"), null, [])), rt.fv(f, "real_name", live(Player))])]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(Player), fmt("<font color='red'><b>You did not survive the events on ＀...</b></FONT>", [(yield* g.call(f, P("/proc/station_name"), null, []))])]);
			}
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (end_state = (yield* g.new_(f, T("/datum/station_state"), []))), "count", []);
	station_integrity = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, rt.gl("start_state"), "score", [live(end_state)])), 100), 0.10000000149011612])), 100]));
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<BR>＀Shift Duration: <B>＀:＀:＀＀</B>", [rt.gl("TAB"), (yield* g.call(f, P("/proc/round"), null, [divide(rt.worldTime(f), 36000)])), (yield* g.call(f, P("/proc/add_zero"), null, [fmt("＀", [rt.modulus(divide(rt.worldTime(f), 600), 60)]), 2])), rt.modulus(divide(rt.worldTime(f), 100), 6), rt.modulus(divide(rt.worldTime(f), 100), 10)])]);
	$0 = rt.world();
	$1 = rt.gl("TAB");
	if (truthy(rt.fv(f, "station_was_nuked", rt.sv(f, "mode")))) {
		$2 = "<font color='red'>Destroyed</font>";
	} else {
		$2 = fmt("＀%", [live(station_integrity)]);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<BR>＀Station Integrity: <B>＀</B>", [$1, $2])]);
	if (truthy(rt.fv(f, "station_was_nuked", rt.sv(f, "mode")))) {
		rt.setFv(f, "news_report", rt.gl("SSticker"), 4);
	}
	if (truthy((total_players = rt.len(f, rt.gl("joined_player_list"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<BR>＀Total Population: <B>＀</B>", [rt.gl("TAB"), live(total_players)])]);
		if (truthy(live(station_evacuated))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<BR>＀Evacuation Rate: <B>＀ (＀%)</B>", [rt.gl("TAB"), live(num_escapees), (yield* g.call(f, P("/proc/round"), null, [multiply(divide(live(num_escapees), live(total_players)), 100), 0.10000000149011612]))])]);
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<BR>＀(on emergency shuttle): <B>＀ (＀%)</B>", [rt.gl("TAB"), live(num_shuttle_escapees), (yield* g.call(f, P("/proc/round"), null, [multiply(divide(live(num_shuttle_escapees), live(total_players)), 100), 0.10000000149011612]))])]);
			rt.setSv(f, "news_report", 5);
			if (truthy((yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "is_hijacked", [])))) {
				rt.setSv(f, "news_report", 24);
			}
		}
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<BR>＀Survival Rate: <B>＀ (＀%)</B>", [rt.gl("TAB"), live(num_survivors), (yield* g.call(f, P("/proc/round"), null, [multiply(divide(live(num_survivors), live(total_players)), 100), 0.10000000149011612]))])]);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<BR>"]);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	aiPlayer = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		aiPlayer = $e;
		if ((!isEqual(rt.fv(f, "stat", live(aiPlayer)), 2) && truthy(rt.fv(f, "mind", live(aiPlayer))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<b>＀ (Played by: ＀)'s laws at the end of the round were:</b>", [rt.fv(f, "name", live(aiPlayer)), rt.gv(f, "key", rt.fv(f, "mind", live(aiPlayer)))])]);
			yield* g.callName(f, live(aiPlayer), "show_laws", [1]);
		} else {
			if (truthy(rt.fv(f, "mind", live(aiPlayer)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<b>＀ (Played by: ＀)'s laws when it was deactivated were:</b>", [rt.fv(f, "name", live(aiPlayer)), rt.gv(f, "key", rt.fv(f, "mind", live(aiPlayer)))])]);
				yield* g.callName(f, live(aiPlayer), "show_laws", [1]);
			}
		}
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<b>Total law changes: ＀</b>", [rt.fv(f, "law_change_counter", live(aiPlayer))])]);
		if (truthy(rt.getLen(f, rt.fv(f, "connected_robots", live(aiPlayer))))) {
			robolist = fmt("<b>＀'s minions were:</b> ", [rt.fv(f, "real_name", live(aiPlayer))]);
			robo = null;
			rt.forList(f, 1, rt.fv(f, "connected_robots", live(aiPlayer)), T("/mob/living/silicon/robot"));
			while (($e = rt.next(f, 1)) !== undefined) {
				robo = $e;
				if (truthy(rt.fv(f, "mind", live(robo)))) {
					$0 = rt.fv(f, "name", live(robo));
					if (truthy(rt.fv(f, "stat", live(robo)))) {
						$1 = fmt(" (Deactivated) (Played by: ＀), ", [rt.gv(f, "key", rt.fv(f, "mind", live(robo)))]);
					} else {
						$1 = fmt(" (Played by: ＀), ", [rt.gv(f, "key", rt.fv(f, "mind", live(robo)))]);
					}
					robolist = rt.modify(live(robolist), fmt("＀＀", [$0, $1]), add);
				}
			}
			rt.endFor(f, 1);
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("＀", [live(robolist)])]);
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	robo_7 = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/silicon/robot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		robo_7 = $e;
		if ((!truthy(rt.fv(f, "connected_ai", live(robo_7))) && truthy(rt.fv(f, "mind", live(robo_7))))) {
			if (!isEqual(rt.fv(f, "stat", live(robo_7)), 2)) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<b>＀ (Played by: ＀) survived as an AI-less borg! Its laws were:</b>", [rt.fv(f, "name", live(robo_7)), rt.gv(f, "key", rt.fv(f, "mind", live(robo_7)))])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<b>＀ (Played by: ＀) was unable to survive the rigors of being a cyborg without an AI. Its laws were:</b>", [rt.fv(f, "name", live(robo_7)), rt.gv(f, "key", rt.fv(f, "mind", live(robo_7)))])]);
			}
			if (truthy(live(robo_7))) {
				yield* g.callName(f, rt.fv(f, "laws", live(robo_7)), "show_laws", [rt.world()]);
			}
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	yield* g.callName(f, rt.sv(f, "mode"), "declare_completion", []);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	handler = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, ["/datum/game_mode/proc"])));
	while (($e = rt.next(f, 0)) !== undefined) {
		handler = $e;
		if (truthy((yield* g.call(f, P("/proc/findtext"), null, [fmt("＀", [live(handler)]), "auto_declare_completion_"])))) {
			yield* g.callDyn(f, rt.sv(f, "mode"), live(handler), [rt.sv(f, "force_ending")]);
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	total_antagonists = rt.list();
	Mind = null;
	rt.forList(f, 0, rt.sv(f, "minds"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Mind = $e;
		if (truthy((temprole = rt.fv(f, "special_role", live(Mind))))) {
			if (truthy((rt.isIn(f, live(temprole), live(total_antagonists)) ? 1 : 0))) {
				rt.modAt(live(total_antagonists), live(temprole), fmt(", ＀(＀)", [rt.fv(f, "name", live(Mind)), rt.fv(f, "key", live(Mind))]), add);
			} else {
				yield* g.callName(f, live(total_antagonists), "Add", [live(temprole)]);
				rt.modAt(live(total_antagonists), live(temprole), fmt(": ＀(＀)", [rt.fv(f, "name", live(Mind)), rt.fv(f, "key", live(Mind))]), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	yield* g.call(f, P("/proc/log_game"), null, ["Antagonists at round end were..."]);
	i = null;
	rt.forList(f, 0, live(total_antagonists));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀s＀.", [live(i), rt.index(live(total_antagonists), live(i))])]);
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	yield* g.callName(f, rt.sv(f, "mode"), "declare_station_goal_completion", []);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	if (truthy(rt.len(f, rt.gl("commendations")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<b><font size=3>Medal Commendations:</font></b>"]);
		com = null;
		rt.forList(f, 0, rt.gl("commendations"));
		while (($e = rt.next(f, 0)) !== undefined) {
			com = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), live(com)]);
		}
		rt.endFor(f, 0);
	}
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	if (truthy(rt.fv(f, "allow_persistence_save", rt.sv(f, "mode")))) {
		yield* g.callName(f, rt.gl("SSpersistence"), "CollectData", []);
	}
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	if (truthy(rt.fv(f, "station_was_nuked", rt.sv(f, "mode")))) {
		yield* g.srcCall(f, "Reboot", "Station destroyed by Nuclear Device.", "nuke");
	} else {
		yield* g.srcCall(f, "Reboot", "Round ended.", "proper completion");
	}
	return f.dot;
}, true, { waitfor: false });

// /datum/controller/subsystem/ticker/proc/send_tip_of_the_round  (code/controllers/subsystem/ticker.dm:608)
rt.def("/datum/controller/subsystem/ticker/proc/send_tip_of_the_round", function send_tip_of_the_round(f: Frame) {
	let m: Value = null, randomtips: Value = null, memetips: Value = null;
	f.vars = () => [m, randomtips, memetips];
	m = null;
	if (truthy(rt.sv(f, "selected_tip"))) {
		m = rt.sv(f, "selected_tip");
	} else {
		randomtips = rt.callName(f, rt.world(), "file2list", ["strings/tips.txt"]);
		memetips = rt.callName(f, rt.world(), "file2list", ["strings/sillytips.txt"]);
		if ((truthy(rt.len(f, live(randomtips))) && truthy(rt.op(f, "Prob", [], [95])))) {
			m = rt.op(f, "PickUnweighted", [1], [live(randomtips)]);
		} else {
			if (truthy(rt.len(f, live(memetips)))) {
				m = rt.op(f, "PickUnweighted", [1], [live(memetips)]);
			}
		}
	}
	if (!truthy(live(m))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<font color='purple'><b>Tip of the round: </b>＀</font>", [rt.call(f, P("/proc/html_encode"), null, [live(m)])])]);
	return f.dot;
});

// /datum/controller/subsystem/ticker/proc/check_queue  (code/controllers/subsystem/ticker.dm:621)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/check_queue", function* check_queue(f: Frame) {
	let next_in_line: Value = null;
	let $0: any;
	f.vars = () => [next_in_line, $0];
	if ((!truthy(rt.len(f, rt.sv(f, "queued_players"))) || !truthy(rt.fv(f, "hard_popcap", rt.gl("config"))))) {
		return live(f.dot);
	}
	rt.incSrcVar(f, "queue_delay", 1, true);
	next_in_line = rt.index(rt.sv(f, "queued_players"), 1);
	$0 = rt.sv(f, "queue_delay");
	if ($0 === 5) {
		if (rt.lt((yield* g.call(f, P("/proc/living_player_count"), null, [])), rt.fv(f, "hard_popcap", rt.gl("config")))) {
			if ((truthy(live(next_in_line)) && truthy(rt.fv(f, "client", live(next_in_line))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(next_in_line), fmt("<span class='userdanger'>A slot has opened! You have approximately 20 seconds to join. <a href='?src=＃;late_join=override'>>>Join Game<<</a></span>", [live(next_in_line)])]);
				rt.op(f, "Output", [], [live(next_in_line), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/misc/notice1.ogg")]))], false);
				yield* g.callName(f, live(next_in_line), "LateChoices", []);
				return live(f.dot);
			}
			(rt.modSrcVar(f, "queued_players", live(next_in_line), subtract));
		}
		rt.setSv(f, "queue_delay", 0);
	} else if (rt.inRange($0, 25, 9.999999848243207e+30)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(next_in_line), "<span class='danger'>No response recieved. You have been removed from the line.</span>"]);
		(rt.modSrcVar(f, "queued_players", live(next_in_line), subtract));
		rt.setSv(f, "queue_delay", 0);
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/ticker/proc/check_maprotate  (code/controllers/subsystem/ticker.dm:643)
rt.def("/datum/controller/subsystem/ticker/proc/check_maprotate", function check_maprotate(f: Frame) {
	// ss13.live: on a server with the map vote on, the vote replaces tg's random rotation: it starts by itself once the shuttle leaves
	if (rt.onServer() && truthy(rt.fv(f, "allow_vote_map", rt.gl("config")))) {
		if (truthy(rt.sv(f, "maprotatechecked"))) return f.dot;
		if ((truthy(rt.fv(f, "emergency", rt.gl("SSshuttle"))) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "escape")) || truthy(rt.callName(f, rt.gl("SSshuttle"), "canRecall", []))) return f.dot;
		rt.setSv(f, "maprotatechecked", 1);
		rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [rt.gl("SSvote"), P("/datum/controller/subsystem/vote/proc/initiate_vote"), "map", null]);
		return f.dot;
	}
	if (!truthy(rt.fv(f, "maprotation", rt.gl("config")))) {
		return live(f.dot);
	}
	if (((truthy(rt.fv(f, "emergency", rt.gl("SSshuttle"))) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "escape")) || truthy(rt.callName(f, rt.gl("SSshuttle"), "canRecall", [])))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "maprotatechecked"))) {
		return live(f.dot);
	}
	rt.setSv(f, "maprotatechecked", 1);
	if (!truthy(rt.op(f, "Prob", [], [multiply(divide(rt.worldTime(f), 600), rt.fv(f, "maprotatechancedelta", rt.gl("config")))]))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [rt.gl("SSmapping"), P("/datum/controller/subsystem/mapping/proc/maprotate")]);
	return f.dot;
});

// /datum/controller/subsystem/ticker/proc/HasRoundStarted  (code/controllers/subsystem/ticker.dm:658)
rt.def("/datum/controller/subsystem/ticker/proc/HasRoundStarted", function HasRoundStarted(f: Frame) {
	return (rt.ge(rt.sv(f, "current_state"), 3) ? 1 : 0);
});

// /datum/controller/subsystem/ticker/proc/IsRoundInProgress  (code/controllers/subsystem/ticker.dm:661)
rt.def("/datum/controller/subsystem/ticker/proc/IsRoundInProgress", function IsRoundInProgress(f: Frame) {
	return (isEqual(rt.sv(f, "current_state"), 3) ? 1 : 0);
});

// /datum/controller/subsystem/ticker/proc/Recover  (code/controllers/subsystem/ticker.dm:702)
rt.def("/datum/controller/subsystem/ticker/proc/Recover", function Recover(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setSv(f, "current_state", rt.fv(f, "current_state", rt.gl("SSticker")));
	rt.setSv(f, "force_ending", rt.fv(f, "force_ending", rt.gl("SSticker")));
	rt.setSv(f, "hide_mode", rt.fv(f, "hide_mode", rt.gl("SSticker")));
	rt.setSv(f, "mode", rt.fv(f, "mode", rt.gl("SSticker")));
	rt.setSv(f, "event_time", rt.fv(f, "event_time", rt.gl("SSticker")));
	rt.setSv(f, "event", rt.fv(f, "event", rt.gl("SSticker")));
	rt.setSv(f, "login_music", rt.fv(f, "login_music", rt.gl("SSticker")));
	rt.setSv(f, "round_end_sound", rt.fv(f, "round_end_sound", rt.gl("SSticker")));
	rt.setSv(f, "minds", rt.fv(f, "minds", rt.gl("SSticker")));
	rt.setSv(f, "syndicate_coalition", rt.fv(f, "syndicate_coalition", rt.gl("SSticker")));
	rt.setSv(f, "factions", rt.fv(f, "factions", rt.gl("SSticker")));
	rt.setSv(f, "availablefactions", rt.fv(f, "availablefactions", rt.gl("SSticker")));
	rt.setSv(f, "delay_end", rt.fv(f, "delay_end", rt.gl("SSticker")));
	rt.setSv(f, "triai", rt.fv(f, "triai", rt.gl("SSticker")));
	rt.setSv(f, "tipped", rt.fv(f, "tipped", rt.gl("SSticker")));
	rt.setSv(f, "selected_tip", rt.fv(f, "selected_tip", rt.gl("SSticker")));
	rt.setSv(f, "timeLeft", rt.fv(f, "timeLeft", rt.gl("SSticker")));
	rt.setSv(f, "totalPlayers", rt.fv(f, "totalPlayers", rt.gl("SSticker")));
	rt.setSv(f, "totalPlayersReady", rt.fv(f, "totalPlayersReady", rt.gl("SSticker")));
	rt.setSv(f, "queue_delay", rt.fv(f, "queue_delay", rt.gl("SSticker")));
	rt.setSv(f, "queued_players", rt.fv(f, "queued_players", rt.gl("SSticker")));
	rt.setSv(f, "cinematic", rt.fv(f, "cinematic", rt.gl("SSticker")));
	rt.setSv(f, "maprotatechecked", rt.fv(f, "maprotatechecked", rt.gl("SSticker")));
	rt.setSv(f, "round_start_time", rt.fv(f, "round_start_time", rt.gl("SSticker")));
	rt.setSv(f, "queue_delay", rt.fv(f, "queue_delay", rt.gl("SSticker")));
	rt.setSv(f, "queued_players", rt.fv(f, "queued_players", rt.gl("SSticker")));
	rt.setSv(f, "cinematic", rt.fv(f, "cinematic", rt.gl("SSticker")));
	rt.setSv(f, "maprotatechecked", rt.fv(f, "maprotatechecked", rt.gl("SSticker")));
	$0 = rt.sv(f, "current_state");
	if ($0 === 2) {
		rt.callName(f, rt.gl("Master"), "SetRunLevel", [2]);
	} else if ($0 === 3) {
		rt.callName(f, rt.gl("Master"), "SetRunLevel", [4]);
	} else if ($0 === 4) {
		rt.callName(f, rt.gl("Master"), "SetRunLevel", [8]);
	}
	return f.dot;
});

// /datum/controller/subsystem/ticker/proc/GetTimeLeft  (code/controllers/subsystem/ticker.dm:763)
rt.def("/datum/controller/subsystem/ticker/proc/GetTimeLeft", function GetTimeLeft(f: Frame) {
	if (rt.fv(f, "timeLeft", rt.gl("SSticker")) === null) {
		return rt.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "start_at"), rt.worldTime(f))]);
	}
	return rt.sv(f, "timeLeft");
});

// /datum/controller/subsystem/ticker/proc/SetTimeLeft  (code/controllers/subsystem/ticker.dm:768)
rt.def("/datum/controller/subsystem/ticker/proc/SetTimeLeft", function SetTimeLeft(f: Frame, newtime: Value) {
	if ((rt.ge(live(newtime), 0) && rt.sv(f, "timeLeft") === null)) {
		rt.setSv(f, "start_at", add(rt.worldTime(f), live(newtime)));
	} else {
		rt.setSv(f, "timeLeft", live(newtime));
	}
	return f.dot;
});

// /datum/controller/subsystem/ticker/proc/create_observers  (code/controllers/subsystem/ticker.dm:775)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/create_observers", function* create_observers(f: Frame) {
	let player: Value = null;
	let $e: any;
	f.vars = () => [player, $e];
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if ((isEqual(rt.fv(f, "ready", live(player)), 2) && truthy(rt.fv(f, "mind", live(player))))) {
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(player), P("/mob/dead/new_player/proc/make_me_an_observer")])), 1]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/ticker/proc/load_mode  (code/controllers/subsystem/ticker.dm:781)
rt.def("/datum/controller/subsystem/ticker/proc/load_mode", function load_mode(f: Frame) {
	let mode: Value = null;
	f.vars = () => [mode];
	if (truthy((mode = rt.call(f, P("/proc/trim"), null, [rt.call(f, P("/proc/file2text"), null, ["data/mode.txt"])])))) {
		rt.setGl("master_mode", live(mode));
	} else {
		rt.setGl("master_mode", "extended");
	}
	rt.call(f, P("/proc/log_game"), null, [fmt("Saved mode is '＀'", [rt.gl("master_mode")])]);
	return f.dot;
});

// /datum/controller/subsystem/ticker/proc/save_mode  (code/controllers/subsystem/ticker.dm:789)
rt.def("/datum/controller/subsystem/ticker/proc/save_mode", function save_mode(f: Frame, the_mode: Value) {
	let F: Value = null;
	f.vars = () => [F];
	rt.call(f, P("/proc/fdel"), null, [(F = rt.call(f, P("/proc/file"), null, ["data/mode.txt"]))]);
	rt.op(f, "Output", [], [live(F), live(the_mode)], false);
	return f.dot;
});

// /datum/controller/subsystem/ticker/proc/SetRoundEndSound  (code/controllers/subsystem/ticker.dm:796)
rt.def("/datum/controller/subsystem/ticker/proc/SetRoundEndSound", function SetRoundEndSound(f: Frame, the_sound: Value) {
	let thing: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [thing, C, $e];
	rt.setSv(f, "round_end_sound_sent", 0);
	rt.setSv(f, "round_end_sound", rt.call(f, P("/proc/fcopy_rsc"), null, [live(the_sound)]));
	thing = null;
	rt.forList(f, 0, rt.gl("clients"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (!truthy((C = live(thing)))) {
			continue;
		}
		rt.callName(f, live(C), "Export", ["##action=load_rsc", rt.sv(f, "round_end_sound")]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "round_end_sound_sent", 1);
	return f.dot;
}, false, { waitfor: false });

// /datum/controller/subsystem/ticker/proc/Reboot  (code/controllers/subsystem/ticker.dm:806)  may sleep
rt.def("/datum/controller/subsystem/ticker/proc/Reboot", function* Reboot(f: Frame, reason: Value, end_string: Value, delay: Value) {
	let skip_delay: Value = null, start_wait: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [reason, end_string, delay, skip_delay, start_wait, $0, $1, $2];
	if ((truthy(live(f.usr)) && !truthy((yield* g.call(f, P("/proc/check_rights"), null, [16, 1]))))) {
		return live(f.dot);
	}
	if (!truthy(live(delay))) {
		delay = multiply(rt.fv(f, "round_end_countdown", rt.gl("config")), 10);
	}
	skip_delay = (yield* g.call(f, P("/proc/check_rights"), null, []));
	if ((truthy(rt.sv(f, "delay_end")) && !truthy(live(skip_delay)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>An admin has delayed the round end.</span>"]);
		return live(f.dot);
	}
	$0 = rt.world();
	$1 = divide(live(delay), 10);
	if ((rt.ge(live(delay), 10) && rt.lt(live(delay), 20))) {
		$2 = "second";
	} else {
		$2 = "seconds";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='boldannounce'>Rebooting World in ＀ ＀. ＀</span>", [$1, $2, live(reason)])]);
	start_wait = rt.worldTime(f);
	while (!(truthy(rt.sv(f, "round_end_sound_sent")) || rt.gt(subtract(rt.worldTime(f), live(start_wait)), multiply(live(delay), 2)))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	yield* g.call(f, P("/proc/sleep"), null, [subtract(live(delay), subtract(rt.worldTime(f), live(start_wait)))]);
	if ((truthy(rt.sv(f, "delay_end")) && !truthy(live(skip_delay)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>Reboot was cancelled by an admin.</span>"]);
		return live(f.dot);
	}
	if (truthy(live(end_string))) {
		rt.setSv(f, "end_state", live(end_string));
	}
	yield* g.call(f, P("/proc/log_game"), null, [fmt("<span class='boldannounce'>Rebooting World. ＀</span>", [live(reason)])]);
	yield* g.callName(f, rt.world(), "Reboot", []);
	return f.dot;
}, true, { waitfor: false });

// /datum/controller/subsystem/ticker/proc/Shutdown  (code/controllers/subsystem/ticker.dm:834)
rt.def("/datum/controller/subsystem/ticker/proc/Shutdown", function Shutdown(f: Frame) {
	if (!truthy(rt.sv(f, "round_end_sound"))) {
		rt.setSv(f, "round_end_sound", rt.op(f, "PickUnweighted", [7], [rt.rsc("sound/roundend/newroundsexy.ogg"), rt.rsc("sound/roundend/apcdestroyed.ogg"), rt.rsc("sound/roundend/bangindonk.ogg"), rt.rsc("sound/roundend/leavingtg.ogg"), rt.rsc("sound/roundend/its_only_game.ogg"), rt.rsc("sound/roundend/yeehaw.ogg"), rt.rsc("sound/roundend/disappointed.ogg")]));
	}
	rt.op(f, "OutputReference", [rt.R.world], [rt.call(f, P("/proc/sound"), null, [rt.sv(f, "round_end_sound")])], false);
	return f.dot;
});
