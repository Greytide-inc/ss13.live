// Based on /tg/station's code/controllers/subsystem/ticker.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, add, fmt } = rt;


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

// ticker.dm:3
rt.def("/datum/controller/subsystem/ticker/proc/New", function* New(f: Frame) {
	if (GLOB.SSticker != this) {
		if (rt.istype(GLOB.SSticker, T("/datum/controller/subsystem/ticker"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSticker);
		}
		GLOB.SSticker = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// ticker.dm:25
rt.def("/datum/controller/subsystem/ticker/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.minds = list();

	this.syndicate_coalition = list();

	this.factions = list();

	this.availablefactions = list();
	this.scripture_states = rt.alist(f, ["Driver", 1, "Script", 0, "Application", 0, "Judgement", 0]);

	this.queued_players = list();
	return f.dot;
});

// ticker.dm:66
rt.def("/datum/controller/subsystem/ticker/proc/Initialize", function Initialize(f: Frame, timeofday: Value) {
	let music: Value = null;
	this.load_mode();
	this.login_music = pick((music = rt.world().file2list("strings/round_start_sounds.txt", "\n")));
	if (!GLOB.syndicate_code_phrase) {
		GLOB.syndicate_code_phrase = generate_code_phrase();
	}
	if (!GLOB.syndicate_code_response) {
		GLOB.syndicate_code_response = generate_code_phrase();
	}
	parent_proc();
	this.start_at = rt.worldTime(f) + GLOB.config.lobby_countdown * 10;
	return f.dot;
}, false);

// ticker.dm:78
rt.def("/datum/controller/subsystem/ticker/proc/fire", function* fire(f: Frame) {
	let C: Value = null, player: Value = null;
	let $e: any;
	if (this.current_state === GAME_STATE_STARTUP) {
		if (GLOB.Master.initializations_finished_with_no_players_logged_in) {
			this.start_at = rt.worldTime(f) + GLOB.config.lobby_countdown * 10;
		}
		for (C of each(GLOB.clients, T("/client"))) {
			yield* window_flash(C, { ignorepref: 1 });
		}
		if (!is_creative()) to_chat(rt.world(), `<span class='boldnotice'>Welcome to ${station_name()}!</span>`);
		this.current_state = 1;
		yield* this.create_observers();
		yield* this.fire();
	} else if (this.current_state === 1) {
		if (this.timeLeft === null) {
			this.timeLeft = max(0, this.start_at - rt.worldTime(f));
		}
		this.totalPlayers = 0;
		this.totalPlayersReady = 0;
		for (player of each(GLOB.player_list, T("/mob/dead/new_player"))) {
			++this.totalPlayers;
			if (player.ready == PLAYER_READY_TO_PLAY) {
				++this.totalPlayersReady;
			}
		}
		if (this.start_immediately) {
			this.timeLeft = 0;
		}
		if (this.timeLeft < 0) {
			return f.dot;
		}
		this.timeLeft -= this.wait;
		if (this.timeLeft <= 300 && !this.tipped) {
			this.send_tip_of_the_round();
			this.tipped = RUNLEVEL_LOBBY;
		}
		if (this.timeLeft <= 0) {
			this.current_state = GAME_STATE_SETTING_UP;
			GLOB.Master.SetRunLevel(RUNLEVEL_SETUP);
			if (this.start_immediately) {
				yield* this.fire();
			}
		}
	} else if (this.current_state === GAME_STATE_SETTING_UP) {
		if (!(yield* this.setup())) {
			this.current_state = GAME_STATE_STARTUP;
			GLOB.Master.SetRunLevel(RUNLEVEL_LOBBY);
		}
	} else if (this.current_state === GAME_STATE_PLAYING) {
		yield* this.mode.process(this.wait * 0.1);
		yield* this.check_queue();
		this.check_maprotate();
		this.scripture_states = (yield* scripture_unlock_alert(this.scripture_states));
		if (!(!this.mode.explosion_in_progress && (yield* this.mode.check_finished(this.force_ending)) || this.force_ending)) return f.dot;
		this.current_state = GAME_STATE_FINISHED;
		toggle_ooc(1);
		yield* this.declare_completion(this.force_ending);
		GLOB.Master.SetRunLevel(RUNLEVEL_POSTGAME);
	}
	return f.dot;
}, true);

// ticker.dm:138
rt.def("/datum/controller/subsystem/ticker/proc/setup", function* setup(f: Frame) {
	let runnable_modes: Value = null, smode: Value = null, modes: Value = null, M: Value = null, I: Value = null, cb: Value = null, holidayname: Value = null, holiday: Value = null;
	if (!is_creative()) to_chat(rt.world(), "<span class='boldannounce'>Starting game...</span>"); // tg_js: Creative starts quietly
	let init_start: Value = rt.world().timeofday;
	if (GLOB.master_mode == "random" || GLOB.master_mode == "secret") {
		runnable_modes = (yield* GLOB.config.get_runnable_modes());
		if (GLOB.master_mode == "secret") {
			this.hide_mode = 1;
			if (GLOB.secret_force_mode != "secret") {
				if (!(smode = (yield* GLOB.config.pick_mode(GLOB.secret_force_mode))).can_start()) {
					message_admins(` Unable to force secret ${GLOB.secret_force_mode}. ${smode.required_players} players and ${smode.required_enemies} eligible antagonists needed.`);
				} else {
					this.mode = smode;
				}
			}
		}
		if (!this.mode) {
			if (!rt.len(f, runnable_modes)) {
				to_chat(rt.world(), "<B>Unable to choose playable game mode.</B> Reverting to pre-game lobby.");
				return 0;
			}
			this.mode = pickweight(runnable_modes);
		}
	} else {
		this.mode = (yield* GLOB.config.pick_mode(GLOB.master_mode));
		if (!this.mode.can_start()) {
			to_chat(rt.world(), `<B>Unable to start ${this.mode.name}.</B> Not enough players, ${this.mode.required_players} players and ${this.mode.required_enemies} eligible antagonists needed. Reverting to pre-game lobby.`);
			yield* qdel(this.mode);
			this.mode = null;
			yield* GLOB.SSjob.ResetOccupations();
			return 0;
		}
	}
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	let can_continue: Value = 0;
	can_continue = (yield* this.mode.pre_setup());
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	yield* GLOB.SSjob.DivideOccupations();
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	if (!GLOB.Debug2) {
		if (!can_continue) {
			yield* qdel(this.mode);
			this.mode = null;
			to_chat(rt.world(), `<B>Error setting up ${GLOB.master_mode}.</B> Reverting to pre-game lobby.`);
			yield* GLOB.SSjob.ResetOccupations();
			return 0;
		}
	} else {
		message_admins("<span class='notice'>DEBUG: Bypassing prestart checks...</span>");
	}
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	if (this.hide_mode) {
		modes = (yield* new_(T("/list")));
		for (M of each(runnable_modes, T("/datum/game_mode"))) {
			modes += M.name;
		}
		modes = (yield* sortList(modes));
		to_chat(rt.world(), `<b>The gamemode is: secret!\nPossibilities:</B> ${english_list(modes)}`);
	} else {
		yield* this.mode.announce();
	}
	if (!GLOB.config.ooc_during_round) {
		toggle_ooc(0);
	}
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	GLOB.start_landmarks_list = shuffle(GLOB.start_landmarks_list);
	yield* this.create_characters();
	yield* this.collect_minds();
	yield* this.equip_characters();
	yield* GLOB.SSoverlays.Flush();
	yield* GLOB.data_core.manifest();
	yield* this.transfer_characters();
	for (I of each(this.round_start_events)) {
		yield* (cb = I).InvokeAsync();
	}
	if (this.round_start_events) {
		this.round_start_events.Cut();
	}
	log_world(`Game start took ${(rt.world().timeofday - init_start) / 10}s`);
	this.round_start_time = rt.worldTime(f);
	if (is_creative()) yield* creative_clear_off_floor(); // tg_js: Creative's lists show only the floor
	if (!is_creative()) { // tg_js: Creative starts quietly (and no welcome voice)
		to_chat(rt.world(), `<FONT color='blue'><B>Welcome to ${station_name()}, enjoy your stay!</B></FONT>`);
		rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/ai/welcome.ogg"))], false);
	}
	this.current_state = GAME_STATE_PLAYING;
	GLOB.Master.SetRunLevel(RUNLEVEL_GAME);
	if (GLOB.SSevents.holidays) {
		to_chat(rt.world(), "<font color='blue'>and...</font>");
		for (holidayname of each(GLOB.SSevents.holidays)) {
			holiday = rt.index(GLOB.SSevents.holidays, holidayname);
			to_chat(rt.world(), `<h4>${holiday.greet()}</h4>`);
		}
	}
	yield* this.PostSetup();
	return 1;
}, true);

// ticker.dm:238
rt.def("/datum/controller/subsystem/ticker/proc/PostSetup", function* PostSetup(f: Frame) {
	let S: Value = null;
	yield* this.mode.post_setup();
	GLOB.start_state = (yield* new_(T("/datum/station_state")));
	GLOB.start_state.count(1);
	for (S of each(GLOB.landmarks_list, T("/obj/effect/landmark/start"))) {
		if (S.name != "AI") {
			yield* qdel(S);
		}
	}
	return f.dot;
}, true, { waitfor: false });

// ticker.dm:252
rt.def("/datum/controller/subsystem/ticker/proc/OnRoundstart", function OnRoundstart(f: Frame, cb: Value) {
	if (!this.HasRoundStarted()) {
		if (!this.round_start_events) {
			this.round_start_events = list();
		}
		this.round_start_events += cb;
	} else {
		cb.InvokeAsync();
	}
	return f.dot;
});

// ticker.dm:260
rt.def("/datum/controller/subsystem/ticker/proc/station_explosion_detonation", function* station_explosion_detonation(f: Frame, bomb: Value) {
	if (!bomb) return f.dot;
	let epi: Value = bomb.loc;
	yield* qdel(bomb);
	if (!epi) return f.dot;
	yield* explosion(epi, 0, 256, 512, 0, 1, 1, 0, 1);
	return f.dot;
}, true);

// ticker.dm:269
rt.def("/datum/controller/subsystem/ticker/proc/station_explosion_cinematic", function* station_explosion_cinematic(f: Frame, station_missed: Value, override: Value, bomb: Value) {
	let hi: Value = null, M: Value = null, bombloc: Value = null;
	let $e: any;
	station_missed ??= 0;
	if (this.cinematic) {
		return f.dot;
	}
	for (hi of each(GLOB.html_interfaces, T("/datum/html_interface"))) {
		yield* hi.closeAll();
	}
	yield* GLOB.SStgui.close_all_uis();
	if (!station_missed && bomb) {
		yield* GLOB.SSshuttle.registerHostileEnvironment(this);
		GLOB.SSshuttle.lockdown = 1;
	}
	this.cinematic = (yield* g.newOv(f, T("/obj/screen"), "{\"icon\":{\"type\":0,\"resourcePath\":\"icons/effects/station_explosion.dmi\"},\"icon_state\":\"station_intact\",\"layer\":21,\"mouse_opacity\":0,\"screen_loc\":\"CENTER-7,0\"}", [this]));
	for (M of each(GLOB.mob_list, T("/mob"))) {
		M.notransform = 1;
		if (M.client) {
			M.client.screen += this.cinematic;
		}
	}
	let actually_blew_up: Value = 1;
	if (station_missed === 1) {
		if (this.mode && !override) {
			override = this.mode.name;
		}
		if (override === "nuclear emergency") {
			flick("intro_nuke", this.cinematic);
			yield* sleep(35);
			rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/effects/explosionfar.ogg"))], false);
			yield* this.station_explosion_detonation(bomb);
			flick("station_intact_fade_red", this.cinematic);
			this.cinematic.icon_state = "summary_nukefail";
		} else if (override === "cult") {
			this.cinematic.icon_state = null;
			flick("intro_cult", this.cinematic);
			yield* sleep(25);
			rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/magic/enter_blood.ogg"))], false);
			yield* sleep(28);
			rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/machines/terminal_off.ogg"))], false);
			yield* sleep(20);
			flick("station_corrupted", this.cinematic);
			rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/effects/ghost.ogg"))], false);
			actually_blew_up = 0;
		} else if (override === "gang war") {
			this.cinematic.icon_state = "intro_malf_still";
			flick("intro_malf", this.cinematic);
			actually_blew_up = 0;
			yield* sleep(70);
		} else if (override === "fake") {
			flick("intro_nuke", this.cinematic);
			yield* sleep(35);
			rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/items/bikehorn.ogg"))], false);
			flick("summary_selfdes", this.cinematic);
			actually_blew_up = 0;
		} else {
			flick("intro_nuke", this.cinematic);
			yield* sleep(35);
			rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/effects/explosionfar.ogg"))], false);
			yield* this.station_explosion_detonation(bomb);
		}
	} else if (station_missed === NUKE_MISS_STATION) {
		yield* sleep(50);
		rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/effects/explosionfar.ogg"))], false);
		yield* this.station_explosion_detonation(bomb);
		actually_blew_up = (station_missed == NUKE_SYNDICATE_BASE ? 1 : 0);
	} else {
		if (this.mode && !override) {
			override = this.mode.name;
		}
		if (override === "nuclear emergency") {
			flick("intro_nuke", this.cinematic);
			yield* sleep(35);
			flick("station_explode_fade_red", this.cinematic);
			rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/effects/explosionfar.ogg"))], false);
			yield* this.station_explosion_detonation(bomb);
			this.cinematic.icon_state = "summary_nukewin";
		} else if (override === "AI malfunction") {
			flick("intro_malf", this.cinematic);
			yield* sleep(76);
			flick("station_explode_fade_red", this.cinematic);
			rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/effects/explosionfar.ogg"))], false);
			yield* this.station_explosion_detonation(bomb);
			this.cinematic.icon_state = "summary_malf";
		} else if (override === "blob") {
			flick("intro_nuke", this.cinematic);
			yield* sleep(35);
			flick("station_explode_fade_red", this.cinematic);
			rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/effects/explosionfar.ogg"))], false);
			yield* this.station_explosion_detonation(bomb);
			this.cinematic.icon_state = "summary_selfdes";
		} else if (override === "cult") {
			flick("intro_nuke", this.cinematic);
			yield* sleep(35);
			flick("station_explode_fade_red", this.cinematic);
			rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/effects/explosionfar.ogg"))], false);
			yield* this.station_explosion_detonation(bomb);
			this.cinematic.icon_state = "summary_cult";
		} else if (override === "no_core") {
			flick("intro_nuke", this.cinematic);
			yield* sleep(35);
			flick("station_intact", this.cinematic);
			rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/ambience/signal.ogg"))], false);
			yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/controller/subsystem/ticker/proc/finish_cinematic"), null, 0)), 100);
			return f.dot;
		} else {
			flick("intro_nuke", this.cinematic);
			yield* sleep(35);
			flick("station_explode_fade_red", this.cinematic);
			rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/effects/explosionfar.ogg"))], false);
			yield* this.station_explosion_detonation(bomb);
			this.cinematic.icon_state = "summary_selfdes";
		}
	}
	if (actually_blew_up) {
		if (bomb && bomb.loc) {
			bombloc = bomb.z;
		} else if (!station_missed) {
			bombloc = ZLEVEL_STATION;
		}
		if (this.mode) {
			this.mode.explosion_in_progress = 0;
			to_chat(rt.world(), "<B>The station was destoyed by the nuclear blast!</B>");
			this.mode.station_was_nuked = (station_missed < 2 ? 1 : 0);
		}
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/controller/subsystem/ticker/proc/finish_cinematic"), bombloc, actually_blew_up)), 300);
	return f.dot;
}, true, { argTypes: [{  }, {  }, { path: "/atom" }] });

// ticker.dm:399
rt.def("/datum/controller/subsystem/ticker/proc/finish_cinematic", function* finish_cinematic(f: Frame, killz: Value, actually_blew_up: Value) {
	let M: Value = null;
	if (this.cinematic) {
		yield* qdel(this.cinematic);
		this.cinematic = null;
	}
	for (M of each(GLOB.mob_list, T("/mob"))) {
		M.notransform = 0;
		if (actually_blew_up && killz !== null && M.stat != 2 && M.z == killz) {
			yield* M.gib();
		}
	}
	return f.dot;
}, true);

// ticker.dm:407
rt.def("/datum/controller/subsystem/ticker/proc/create_characters", function* create_characters(f: Frame) {
	let player: Value = null;
	for (player of each(GLOB.player_list, T("/mob/dead/new_player"))) {
		if (player.ready == PLAYER_READY_TO_PLAY && player.mind) {
			GLOB.joined_player_list += player.ckey;
			if (is_creative()) yield* player.make_me_an_observer(); // tg_js: creative starts you as a ghost
			else yield* player.create_character(0);
		} else {
			yield* player.new_player_panel();
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// ticker.dm:416
rt.def("/datum/controller/subsystem/ticker/proc/collect_minds", function* collect_minds(f: Frame) {
	let _P: Value = null;
	for (_P of each(GLOB.player_list, T("/mob/dead/new_player"))) {
		if (_P.new_character && _P.new_character.mind) {
			GLOB.SSticker.minds += _P.new_character.mind;
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// ticker.dm:424
rt.def("/datum/controller/subsystem/ticker/proc/equip_characters", function* equip_characters(f: Frame) {
	let N: Value = null, player: Value = null;
	let captainless: Value = 1;
	for (N of each(GLOB.player_list, T("/mob/dead/new_player"))) {
		if (rt.istype((player = N.new_character), T("/mob/living/carbon/human")) && player.mind && player.mind.assigned_role) {
			if (player.mind.assigned_role == "Captain") {
				captainless = 0;
			}
			if (player.mind.assigned_role != player.mind.special_role) {
				yield* GLOB.SSjob.EquipRank(N, player.mind.assigned_role, 0);
			}
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	if (!captainless) return f.dot;
	N = null;
	for (N of each(GLOB.player_list, T("/mob/dead/new_player"))) {
		if (N.new_character) {
			to_chat(N, "Captainship not forced on anyone.");
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// ticker.dm:439
rt.def("/datum/controller/subsystem/ticker/proc/transfer_characters", function* transfer_characters(f: Frame) {
	let player: Value = null, living: Value = null, S: Value = null;
	let livings: Value = list();
	for (player of each(GLOB.mob_list, T("/mob/dead/new_player"))) {
		if (living = (yield* player.transfer_character())) {
			yield* qdel(player);
			living.notransform = 1;
			if (living.client) {
				yield* (S = (yield* new_(T("/obj/screen/splash"), living.client, 1))).Fade(1);
			}
			livings += living;
		}
	}
	if (!rt.len(f, livings)) return f.dot;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/controller/subsystem/ticker/proc/release_characters"), livings)), 30, 4);
	return f.dot;
}, true);

// ticker.dm:453
rt.def("/datum/controller/subsystem/ticker/proc/release_characters", function release_characters(f: Frame, livings: Value) {
	let I: Value = null, L: Value = null;
	for (I of each(livings)) {
		(L = I).notransform = 0;
	}
	return f.dot;
}, false, { argTypes: [{ path: "/list" }] });

// ticker.dm:459
rt.def("/datum/controller/subsystem/ticker/proc/declare_completion", function* declare_completion(f: Frame) {
	let Player: Value = null, shuttle_area: Value = null, end_state: Value = null, total_players: Value = null, aiPlayer: Value = null, robolist: Value = null, robo: Value = null, robo_7: Value = null, handler: Value = null, Mind: Value = null, temprole: Value = null, i: Value = null, com: Value = null;
	let $2: any, $e: any;
	let station_evacuated: Value = (GLOB.SSshuttle.emergency && ((GLOB.SSshuttle.emergency.mode == "escape" ? 1 : 0) || (GLOB.SSshuttle.emergency.mode == "endgame: game over" ? 1 : 0)));
	let num_survivors: Value = 0;
	let num_escapees: Value = 0;
	let num_shuttle_escapees: Value = 0;
	to_chat(rt.world(), "<BR><BR><BR><FONT size=3><B>The round has ended.</B></FONT>");
	for (Player of each(GLOB.mob_list, T("/mob"))) {
		if (Player.mind && !rt.istype(Player, T("/mob/dead/new_player"))) {
			if (Player.stat != 2 && !rt.istype(Player, T("/mob/living/brain"))) {
				num_survivors++;
				if (station_evacuated) {
					shuttle_area = null;
					if (GLOB.SSshuttle && GLOB.SSshuttle.emergency) {
						shuttle_area = GLOB.SSshuttle.emergency.areaInstance;
					}
					if (!Player.onCentcom() && !Player.onSyndieBase()) {
						to_chat(Player, `<font color='blue'><b>You managed to survive, but were marooned on ${station_name()}...</b></FONT>`);
					} else {
						num_escapees++;
						to_chat(Player, `<font color='green'><b>You managed to survive the events on ${station_name()} as ${Player.real_name}.</b></FONT>`);
						if (get_area(Player) == shuttle_area) {
							num_shuttle_escapees++;
						}
					}
				} else {
					to_chat(Player, `<font color='green'><b>You managed to survive the events on ${station_name()} as ${Player.real_name}.</b></FONT>`);
				}
			} else {
				to_chat(Player, `<font color='red'><b>You did not survive the events on ${station_name()}...</b></FONT>`);
			}
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	(end_state = (yield* new_(T("/datum/station_state")))).count();
	let station_integrity: Value = min(round(GLOB.start_state.score(end_state) * 100, 0.1), 100);
	to_chat(rt.world(), `<BR>${GLOB.TAB}Shift Duration: <B>${round(rt.worldTime(f) / 36000)}:${add_zero(`${rt.worldTime(f) / 600 % 60}`, 2)}:${rt.worldTime(f) / 100 % 6}${rt.worldTime(f) / 100 % 10}</B>`);
	let $0: any = rt.world();
	let $1: any = GLOB.TAB;
	if (this.mode.station_was_nuked) {
		$2 = "<font color='red'>Destroyed</font>";
	} else {
		$2 = `${station_integrity}%`;
	}
	to_chat($0, `<BR>${$1}Station Integrity: <B>${$2}</B>`);
	if (this.mode.station_was_nuked) {
		GLOB.SSticker.news_report = 4;
	}
	if (total_players = rt.len(f, GLOB.joined_player_list)) {
		to_chat(rt.world(), `<BR>${GLOB.TAB}Total Population: <B>${total_players}</B>`);
		if (station_evacuated) {
			to_chat(rt.world(), `<BR>${GLOB.TAB}Evacuation Rate: <B>${num_escapees} (${round(num_escapees / total_players * 100, 0.1)}%)</B>`);
			to_chat(rt.world(), `<BR>${GLOB.TAB}(on emergency shuttle): <B>${num_shuttle_escapees} (${round(num_shuttle_escapees / total_players * 100, 0.1)}%)</B>`);
			this.news_report = 5;
			if (GLOB.SSshuttle.emergency.is_hijacked()) {
				this.news_report = 24;
			}
		}
		to_chat(rt.world(), `<BR>${GLOB.TAB}Survival Rate: <B>${num_survivors} (${round(num_survivors / total_players * 100, 0.1)}%)</B>`);
	}
	to_chat(rt.world(), "<BR>");
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	for (aiPlayer of each(GLOB.mob_list, T("/mob/living/silicon/ai"))) {
		if (aiPlayer.stat != 2 && aiPlayer.mind) {
			to_chat(rt.world(), `<b>${aiPlayer.name} (Played by: ${aiPlayer.mind.key})'s laws at the end of the round were:</b>`);
			yield* aiPlayer.show_laws(1);
		} else if (aiPlayer.mind) {
			to_chat(rt.world(), `<b>${aiPlayer.name} (Played by: ${aiPlayer.mind.key})'s laws when it was deactivated were:</b>`);
			yield* aiPlayer.show_laws(1);
		}
		to_chat(rt.world(), `<b>Total law changes: ${aiPlayer.law_change_counter}</b>`);
		if (rt.len(f, aiPlayer.connected_robots)) {
			robolist = `<b>${aiPlayer.real_name}'s minions were:</b> `;
			robo = null;
			for (robo of each(aiPlayer.connected_robots, T("/mob/living/silicon/robot"))) {
				if (robo.mind) {
					$0 = robo.name;
					if (robo.stat) {
						$1 = ` (Deactivated) (Played by: ${robo.mind.key}), `;
					} else {
						$1 = ` (Played by: ${robo.mind.key}), `;
					}
					robolist += `${$0}${$1}`;
				}
			}
			to_chat(rt.world(), `${robolist}`);
		}
	}
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	for (robo_7 of each(GLOB.mob_list, T("/mob/living/silicon/robot"))) {
		if (!robo_7.connected_ai && robo_7.mind) {
			if (robo_7.stat != 2) {
				to_chat(rt.world(), `<b>${robo_7.name} (Played by: ${robo_7.mind.key}) survived as an AI-less borg! Its laws were:</b>`);
			} else {
				to_chat(rt.world(), `<b>${robo_7.name} (Played by: ${robo_7.mind.key}) was unable to survive the rigors of being a cyborg without an AI. Its laws were:</b>`);
			}
			if (robo_7) {
				yield* robo_7.laws.show_laws(rt.world());
			}
		}
	}
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	yield* this.mode.declare_completion();
	yield* GLOB.SSvote.removals_report(); // ss13.live: kicks, bans and boot votes this round (plans/server-rules.md step 5)
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	for (handler of each(typesof("/datum/game_mode/proc"))) {
		if (findtext(`${handler}`, "auto_declare_completion_")) {
			yield* g.callDyn(f, this.mode, handler, [this.force_ending]);
		}
	}
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	let total_antagonists: Value = list();
	for (Mind of each(this.minds, T("/datum/mind"))) {
		if (temprole = Mind.special_role) {
			if (rt.isIn(f, temprole, total_antagonists)) {
				rt.modAt(total_antagonists, temprole, `, ${Mind.name}(${Mind.key})`, add);
			} else {
				total_antagonists.Add(temprole);
				rt.modAt(total_antagonists, temprole, `: ${Mind.name}(${Mind.key})`, add);
			}
		}
	}
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	log_game("Antagonists at round end were...");
	for (i of each(total_antagonists)) {
		log_game(`${i}s${rt.index(total_antagonists, i)}.`);
	}
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	this.mode.declare_station_goal_completion();
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	if (rt.len(f, GLOB.commendations)) {
		to_chat(rt.world(), "<b><font size=3>Medal Commendations:</font></b>");
		for (com of each(GLOB.commendations)) {
			to_chat(rt.world(), com);
		}
	}
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	if (this.mode.allow_persistence_save) {
		GLOB.SSpersistence.CollectData();
	}
	yield* sleep(50);
	if (this.mode.station_was_nuked) {
		yield* this.Reboot("Station destroyed by Nuclear Device.", "nuke");
	} else {
		yield* this.Reboot("Round ended.", "proper completion");
	}
	return f.dot;
}, true, { waitfor: false });

// ticker.dm:608
rt.def("/datum/controller/subsystem/ticker/proc/send_tip_of_the_round", function send_tip_of_the_round(f: Frame) {
	let m: Value = null, randomtips: Value = null, memetips: Value = null;
	if (this.selected_tip) {
		m = this.selected_tip;
	} else {
		randomtips = rt.world().file2list("strings/tips.txt");
		memetips = rt.world().file2list("strings/sillytips.txt");
		if (rt.len(f, randomtips) && prob(95)) {
			m = pick(randomtips);
		} else if (rt.len(f, memetips)) {
			m = pick(memetips);
		}
	}
	if (!m || is_creative()) return f.dot; // tg_js: Creative starts quietly
	to_chat(rt.world(), `<font color='purple'><b>Tip of the round: </b>${html_encode(m)}</font>`);
	return f.dot;
});

// ticker.dm:621
rt.def("/datum/controller/subsystem/ticker/proc/check_queue", function* check_queue(f: Frame) {
	if (!rt.len(f, this.queued_players) || !GLOB.config.hard_popcap) {
		return f.dot;
	}
	this.queue_delay++;
	let next_in_line: Value = rt.index(this.queued_players, 1);
	if (this.queue_delay === 5) {
		if (living_player_count() < GLOB.config.hard_popcap) {
			if (next_in_line && next_in_line.client) {
				to_chat(next_in_line, fmt("<span class='userdanger'>A slot has opened! You have approximately 20 seconds to join. <a href='?src=＃;late_join=override'>>>Join Game<<</a></span>", [next_in_line]));
				rt.op(f, "Output", [], [next_in_line, sound(rt.rsc("sound/misc/notice1.ogg"))], false);
				yield* next_in_line.LateChoices();
				return f.dot;
			}
			this.queued_players -= next_in_line;
		}
		this.queue_delay = 0;
	} else if (rt.inRange(this.queue_delay, 25, 1e+31)) {
		to_chat(next_in_line, "<span class='danger'>No response recieved. You have been removed from the line.</span>");
		this.queued_players -= next_in_line;
		this.queue_delay = 0;
	}
	return f.dot;
}, true);

// ticker.dm:643
rt.def("/datum/controller/subsystem/ticker/proc/check_maprotate", function check_maprotate(f: Frame) {
	// ss13.live: on a server with the map vote on, the vote replaces tg's random rotation: it starts by itself once the shuttle leaves
	if (rt.onServer() && GLOB.config.allow_vote_map) {
		if (this.maprotatechecked) return f.dot;
		if (GLOB.SSshuttle.emergency && GLOB.SSshuttle.emergency.mode != "escape" || GLOB.SSshuttle.canRecall()) return f.dot;
		this.maprotatechecked = 1;
		ImmediateInvokeAsync(GLOB.SSvote, P("/datum/controller/subsystem/vote/proc/initiate_vote"), "map", null);
		return f.dot;
	}
	if (!GLOB.config.maprotation) {
		return f.dot;
	}
	if (GLOB.SSshuttle.emergency && GLOB.SSshuttle.emergency.mode != "escape" || GLOB.SSshuttle.canRecall()) {
		return f.dot;
	}
	if (this.maprotatechecked) {
		return f.dot;
	}
	this.maprotatechecked = 1;
	if (!prob(rt.worldTime(f) / 600 * GLOB.config.maprotatechancedelta)) {
		return f.dot;
	}
	ImmediateInvokeAsync(GLOB.SSmapping, P("/datum/controller/subsystem/mapping/proc/maprotate"));
	return f.dot;
});

// ticker.dm:658
rt.def("/datum/controller/subsystem/ticker/proc/HasRoundStarted", function HasRoundStarted(f: Frame) {
	return (this.current_state >= GAME_STATE_PLAYING ? 1 : 0);
});

// ticker.dm:661
rt.def("/datum/controller/subsystem/ticker/proc/IsRoundInProgress", function IsRoundInProgress(f: Frame) {
	return (this.current_state == GAME_STATE_PLAYING ? 1 : 0);
});

// ticker.dm:702
rt.def("/datum/controller/subsystem/ticker/proc/Recover", function Recover(f: Frame) {
	this.current_state = GLOB.SSticker.current_state;
	this.force_ending = GLOB.SSticker.force_ending;
	this.hide_mode = GLOB.SSticker.hide_mode;
	this.mode = GLOB.SSticker.mode;
	this.event_time = GLOB.SSticker.event_time;
	this.event = GLOB.SSticker.event;
	this.login_music = GLOB.SSticker.login_music;
	this.round_end_sound = GLOB.SSticker.round_end_sound;
	this.minds = GLOB.SSticker.minds;
	this.syndicate_coalition = GLOB.SSticker.syndicate_coalition;
	this.factions = GLOB.SSticker.factions;
	this.availablefactions = GLOB.SSticker.availablefactions;
	this.delay_end = GLOB.SSticker.delay_end;
	this.triai = GLOB.SSticker.triai;
	this.tipped = GLOB.SSticker.tipped;
	this.selected_tip = GLOB.SSticker.selected_tip;
	this.timeLeft = GLOB.SSticker.timeLeft;
	this.totalPlayers = GLOB.SSticker.totalPlayers;
	this.totalPlayersReady = GLOB.SSticker.totalPlayersReady;
	this.queue_delay = GLOB.SSticker.queue_delay;
	this.queued_players = GLOB.SSticker.queued_players;
	this.cinematic = GLOB.SSticker.cinematic;
	this.maprotatechecked = GLOB.SSticker.maprotatechecked;
	this.round_start_time = GLOB.SSticker.round_start_time;
	this.queue_delay = GLOB.SSticker.queue_delay;
	this.queued_players = GLOB.SSticker.queued_players;
	this.cinematic = GLOB.SSticker.cinematic;
	this.maprotatechecked = GLOB.SSticker.maprotatechecked;
	if (this.current_state === GAME_STATE_SETTING_UP) {
		GLOB.Master.SetRunLevel(RUNLEVEL_SETUP);
	} else if (this.current_state === GAME_STATE_PLAYING) {
		GLOB.Master.SetRunLevel(RUNLEVEL_GAME);
	} else if (this.current_state === GAME_STATE_FINISHED) {
		GLOB.Master.SetRunLevel(RUNLEVEL_POSTGAME);
	}
	return f.dot;
});

// ticker.dm:763
rt.def("/datum/controller/subsystem/ticker/proc/GetTimeLeft", function GetTimeLeft(f: Frame) {
	if (GLOB.SSticker.timeLeft === null) {
		return max(0, this.start_at - rt.worldTime(f));
	}
	return this.timeLeft;
});

// ticker.dm:768
rt.def("/datum/controller/subsystem/ticker/proc/SetTimeLeft", function SetTimeLeft(f: Frame, newtime: Value) {
	if (newtime >= 0 && this.timeLeft === null) {
		this.start_at = rt.worldTime(f) + newtime;
	} else {
		this.timeLeft = newtime;
	}
	return f.dot;
});

// ticker.dm:775
rt.def("/datum/controller/subsystem/ticker/proc/create_observers", function* create_observers(f: Frame) {
	let player: Value = null;
	for (player of each(GLOB.player_list, T("/mob/dead/new_player"))) {
		if (player.ready == PLAYER_READY_TO_OBSERVE && player.mind) {
			yield* addtimer((yield* new_(T("/datum/callback"), player, P("/mob/dead/new_player/proc/make_me_an_observer"))), 1);
		}
	}
	return f.dot;
}, true);

// ticker.dm:781
rt.def("/datum/controller/subsystem/ticker/proc/load_mode", function load_mode(f: Frame) {
	let mode: Value = null;
	if (mode = trim(file2text("data/mode.txt"))) {
		GLOB.master_mode = mode;
	} else {
		GLOB.master_mode = "extended";
	}
	log_game(`Saved mode is '${GLOB.master_mode}'`);
	return f.dot;
});

// ticker.dm:789
rt.def("/datum/controller/subsystem/ticker/proc/save_mode", function save_mode(f: Frame, the_mode: Value) {
	let F: Value = null;
	fdel((F = file("data/mode.txt")));
	rt.op(f, "Output", [], [F, the_mode], false);
	return f.dot;
});

// ticker.dm:796
rt.def("/datum/controller/subsystem/ticker/proc/SetRoundEndSound", function SetRoundEndSound(f: Frame, the_sound: Value) {
	let thing: Value = null, C: Value = null;
	this.round_end_sound_sent = 0;
	this.round_end_sound = fcopy_rsc(the_sound);
	for (thing of each(GLOB.clients)) {
		if (!(C = thing)) {
			continue;
		}
		C.Export("##action=load_rsc", this.round_end_sound);
	}
	this.round_end_sound_sent = 1;
	return f.dot;
}, false, { waitfor: false });

// ticker.dm:806
rt.def("/datum/controller/subsystem/ticker/proc/Reboot", function* Reboot(f: Frame, reason: Value, end_string: Value, delay: Value) {
	let $2: any;
	if (f.usr && !check_rights(16, 1)) {
		return f.dot;
	}
	if (!delay) {
		delay = GLOB.config.round_end_countdown * 10;
	}
	let skip_delay: Value = check_rights();
	if (this.delay_end && !skip_delay) {
		to_chat(rt.world(), "<span class='boldannounce'>An admin has delayed the round end.</span>");
		return f.dot;
	}
	let $0: any = rt.world();
	let $1: any = delay / 10;
	if (delay >= 10 && delay < 20) {
		$2 = "second";
	} else {
		$2 = "seconds";
	}
	to_chat($0, `<span class='boldannounce'>Rebooting World in ${$1} ${$2}. ${reason}</span>`);
	let start_wait: Value = rt.worldTime(f);
	while (!(this.round_end_sound_sent || rt.worldTime(f) - start_wait > delay * 2)) {
		yield* stoplag();
	}
	yield* sleep(delay - (rt.worldTime(f) - start_wait));
	if (this.delay_end && !skip_delay) {
		to_chat(rt.world(), "<span class='boldannounce'>Reboot was cancelled by an admin.</span>");
		return f.dot;
	}
	if (end_string) {
		this.end_state = end_string;
	}
	log_game(`<span class='boldannounce'>Rebooting World. ${reason}</span>`);
	yield* rt.world().Reboot();
	return f.dot;
}, true, { waitfor: false });

// ticker.dm:834
rt.def("/datum/controller/subsystem/ticker/proc/Shutdown", function Shutdown(f: Frame) {
	if (!this.round_end_sound) {
		this.round_end_sound = pick(rt.rsc("sound/roundend/newroundsexy.ogg"), rt.rsc("sound/roundend/apcdestroyed.ogg"), rt.rsc("sound/roundend/bangindonk.ogg"), rt.rsc("sound/roundend/leavingtg.ogg"), rt.rsc("sound/roundend/its_only_game.ogg"), rt.rsc("sound/roundend/yeehaw.ogg"), rt.rsc("sound/roundend/disappointed.ogg"));
	}
	rt.op(f, "OutputReference", [rt.R.world], [sound(this.round_end_sound)], false);
	return f.dot;
});
