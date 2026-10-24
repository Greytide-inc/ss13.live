// From code/controllers/configuration.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(81, "/datum/configuration", "/datum", {
	name: "Configuration",
	autoadmin: 0,
	autoadmin_rank: "Game Admin",
	default_view: "19x15",
	default_view_square: "15x15",
	server_name: null,
	station_name: null,
	lobby_countdown: 120,
	round_end_countdown: 25,
	log_ooc: 0,
	log_access: 0,
	log_say: 0,
	log_admin: 0,
	log_game: 0,
	log_vote: 0,
	log_whisper: 0,
	log_prayer: 0,
	log_law: 0,
	log_emote: 0,
	log_attack: 0,
	log_adminchat: 0,
	log_pda: 0,
	log_twitter: 0,
	allow_admin_ooccolor: 0,
	allow_vote_restart: 0,
	allow_vote_mode: 0,
	allow_vote_shuttle: 0,
	allow_vote_boot: 0,
	allow_vote_map: 0,
	vote_delay: 6000,
	vote_period: 600,
	vote_no_default: 0,
	vote_no_dead: 0,
	del_new_on_log: 1,
	allow_Metadata: 0,
	popup_admin_pm: 0,
	fps: 20,
	allow_holidays: 0,
	tick_limit_mc_init: 98,
	respawn: 1,
	guest_jobban: 1,
	inactivity_period: 3000,
	afk_period: 6000,
	kick_inactive: 0,
	load_jobs_from_txt: 0,
	automute_on: 0,
	minimal_access_threshold: 0,
	jobs_have_minimal_access: 0,
	jobs_have_maint_access: 0,
	sec_start_brig: 0,
	server: null,
	banappeals: null,
	wikiurl: "http://www.tgstation13.org/wiki",
	forumurl: "http://tgstation13.org/phpBB/index.php",
	rulesurl: "http://www.tgstation13.org/wiki/Rules",
	githuburl: "https://www.github.com/tgstation/-tg-station",
	forbid_singulo_possession: 0,
	useircbot: 0,
	check_randomizer: 0,
	soft_popcap: 0,
	hard_popcap: 0,
	extreme_popcap: 0,
	soft_popcap_message: "Be warned that the server is currently serving a high number of users, consider using alternative game servers.",
	hard_popcap_message: "The server is currently serving a high number of users, You cannot currently join. You may wait for the number of living crew to decline, observe, or find alternative servers.",
	extreme_popcap_message: "The server is currently serving a high number of users, find alternative servers.",
	force_random_names: 0,
	mode_names: null,
	modes: null,
	votable_modes: null,
	probabilities: null,
	min_pop: null,
	max_pop: null,
	humans_need_surnames: 0,
	allow_ai: 0,
	forbid_secborg: 0,
	forbid_peaceborg: 0,
	traitor_scaling_coeff: 6,
	changeling_scaling_coeff: 6,
	security_scaling_coeff: 8,
	abductor_scaling_coeff: 15,
	traitor_objectives_amount: 2,
	protect_roles_from_antagonist: 0,
	protect_assistant_from_antagonist: 0,
	enforce_human_authority: 0,
	allow_latejoin_antagonists: 0,
	continuous: null,
	midround_antag: null,
	midround_antag_time_check: 60,
	midround_antag_life_check: 0.7,
	shuttle_refuel_delay: 12000,
	show_game_type_odds: 0,
	mutant_races: 0,
	roundstart_races: null,
	mutant_humans: 0,
	no_summon_guns: null,
	no_summon_magic: null,
	no_summon_events: null,
	intercept: 1,
	alert_desc_green: "All threats to the station have passed. Security may not have weapons visible, privacy laws are once again fully enforced.",
	alert_desc_blue_upto: "The station has received reliable information about possible hostile activity on the station. Security staff may have weapons visible, random searches are permitted.",
	alert_desc_blue_downto: "The immediate threat has passed. Security may no longer have weapons drawn at all times, but may continue to have them visible. Random searches are still allowed.",
	alert_desc_red_upto: "There is an immediate serious threat to the station. Security may have weapons unholstered at all times. Random searches are allowed and advised.",
	alert_desc_red_downto: "The station's destruction has been averted. There is still however an immediate serious threat to the station. Security may have weapons unholstered at all times, random searches are allowed and advised.",
	alert_desc_delta: "Destruction of the station is imminent. All crew are instructed to obey all instructions given by heads of staff. Any violations of these orders can be punished by death. This is not a drill.",
	revival_pod_plants: 0,
	revival_cloning: 0,
	revival_brain_life: -1,
	rename_cyborg: 0,
	ooc_during_round: 0,
	emojis: 0,
	run_speed: 0,
	walk_speed: 0,
	human_delay: 0,
	robot_delay: 0,
	monkey_delay: 0,
	alien_delay: 0,
	slime_delay: 0,
	animal_delay: 0,
	gateway_delay: 18000,
	ghost_interaction: 0,
	silent_ai: 0,
	silent_borg: 0,
	damage_multiplier: 1,
	allowwebclient: 0,
	webclientmembersonly: 0,
	sandbox_autoclose: 0,
	default_laws: 0,
	silicon_max_law_amount: 12,
	lawids: null,
	law_weights: null,
	assistant_cap: -1,
	starlight: 0,
	generate_minimaps: 0,
	grey_assistants: 0,
	id_console_jobslot_delay: 30,
	lavaland_budget: 60,
	space_budget: 16,
	aggressive_changelog: 0,
	reactionary_explosions: 0,
	announce_admin_logout: 0,
	announce_admin_login: 0,
	maplist: null,
	defaultmap: null,
	maprotation: 1,
	maprotatechancedelta: 0.75,
	allow_map_voting: 1,
	allow_random_events: 0,
	events_min_time_mul: 1,
	events_min_players_mul: 1,
	statclick: null,
	client_warn_version: 0,
	client_warn_message: "Your version of byond may have issues or be blocked from accessing this server in the future.",
	client_error_version: 0,
	client_error_message: "Your version of byond is too old, may have issues, and is blocked from accessing this server.",
	gamemode_cache: null,
	minutetopiclimit: null,
	secondtopiclimit: null,
	error_cooldown: 600,
	error_limit: 50,
	error_silence_time: 6000,
	error_msg_delay: 50,
	arrivals_shuttle_dock_window: 55,
	arrivals_shuttle_require_safe_latejoin: 0,
	mice_roundstart: 10,
	policies: null,
});

// /datum/configuration/proc/can_vv_get  (code/controllers/configuration.dm:10)
rt.def("/datum/configuration/proc/can_vv_get", function can_vv_get(f: Frame) {
	if (truthy((rt.isIn(f, live(f.args[0]), rt.gl("banned_gets")) ? 1 : 0))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["var_name"] });

// /datum/configuration/proc/vv_edit_var  (code/controllers/configuration.dm:16)
rt.def("/datum/configuration/proc/vv_edit_var", function vv_edit_var(f: Frame) {
	if (truthy((rt.isIn(f, live(f.args[0]), rt.gl("banned_edits")) ? 1 : 0))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["var_name", "var_value"] });

// /datum/configuration/proc/<init>  (code/controllers/configuration.dm:120)
rt.def("/datum/configuration/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mode_names", rt.list());
	$0 = $0;
	rt.setSv(f, "modes", rt.list());
	$0 = $0;
	rt.setSv(f, "votable_modes", rt.list());
	$0 = $0;
	rt.setSv(f, "probabilities", rt.list());
	$0 = $0;
	rt.setSv(f, "min_pop", rt.list());
	$0 = $0;
	rt.setSv(f, "max_pop", rt.list());
	$0 = $0;
	rt.setSv(f, "continuous", rt.list());
	$0 = $0;
	rt.setSv(f, "midround_antag", rt.list());
	$0 = $0;
	rt.setSv(f, "roundstart_races", rt.list());
	$0 = $0;
	rt.setSv(f, "lawids", rt.list());
	$0 = $0;
	rt.setSv(f, "law_weights", rt.list());
	$0 = $0;
	rt.setSv(f, "maplist", rt.list());
	$0 = $0;
	rt.setSv(f, "policies", rt.list());
	return f.dot;
});

// /datum/configuration/proc/New  (code/controllers/configuration.dm:274)  may sleep
rt.def("/datum/configuration/proc/New", function* New(f: Frame) {
	let _T: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [_T, M, $e];
	rt.setSv(f, "gamemode_cache", (yield* g.call(f, P("/proc/typecacheof"), null, [T("/datum/game_mode"), 1])));
	_T = null;
	rt.forList(f, 0, rt.sv(f, "gamemode_cache"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.gv(f, "config_tag", (M = (yield* g.new_(f, live(_T), [])))))) {
			if (!truthy((rt.isIn(f, rt.fv(f, "config_tag", live(M)), rt.sv(f, "modes")) ? 1 : 0))) {
				rt.op(f, "OutputReference", [rt.R.glob(112)], [fmt("Adding game mode ＀ (＀) to configuration.", [rt.fv(f, "name", live(M)), rt.fv(f, "config_tag", live(M))])], false);
				rt.modSrcVar(f, "modes", rt.fv(f, "config_tag", live(M)), add);
				rt.setAt(rt.sv(f, "mode_names"), rt.fv(f, "config_tag", live(M)), rt.fv(f, "name", live(M)));
				rt.setAt(rt.sv(f, "probabilities"), rt.fv(f, "config_tag", live(M)), rt.fv(f, "probability", live(M)));
				if (truthy(rt.fv(f, "votable", live(M)))) {
					rt.modSrcVar(f, "votable_modes", rt.fv(f, "config_tag", live(M)), add);
				}
			}
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
	}
	rt.endFor(f, 0);
	rt.modSrcVar(f, "votable_modes", "secret", add);
	yield* g.srcCall(f, "Reload");
	return f.dot;
}, true);

// /datum/configuration/proc/Reload  (code/controllers/configuration.dm:294)
rt.def("/datum/configuration/proc/Reload", function Reload(f: Frame) {
	rt.callSrc(f, "load", ["config/config.txt"]);
	rt.callSrc(f, "load", ["config/game_options.txt", "game_options"]);
	rt.callSrc(f, "load", ["config/policies.txt", "policies"]);
	if (truthy(rt.sv(f, "maprotation")) || truthy(rt.sv(f, "allow_vote_map"))) { // ss13.live: the map vote needs the list too
		rt.callSrc(f, "loadmaplist", ["config/maps.txt"]);
	}
	rt.setGl("abandon_allowed", rt.sv(f, "respawn"));
	return f.dot;
});

// /datum/configuration/proc/load  (code/controllers/configuration.dm:305)
rt.def("/datum/configuration/proc/load", function load(f: Frame, filename: Value, type: Value) {
	let Lines: Value = null, t: Value = null, pos: Value = null, name: Value = null, value: Value = null, ticklag: Value = null, mode_name: Value = null, pop_pos: Value = null, mode_name_6: Value = null, mode_value: Value = null, prob_pos: Value = null, prob_name: Value = null, prob_value: Value = null, law_id: Value = null, L: Value = null, lawid: Value = null, weight: Value = null, race_id: Value = null, species_id: Value = null, BombCap: Value = null;
	let $0: any, $e: any;
	f.vars = () => [type, Lines, t, pos, name, value, ticklag, mode_name, pop_pos, mode_name_6, mode_value, prob_pos, prob_name, prob_value, law_id, L, lawid, weight, race_id, species_id, BombCap, $0, $e];
	if (live(type) === null) {
		type = "config";
	}
	Lines = rt.callName(f, rt.world(), "file2list", [live(filename)]);
	t = null;
	rt.forList(f, 0, live(Lines));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if (!truthy(live(t))) {
			continue;
		}
		if (isEqual(rt.length((t = rt.call(f, P("/proc/trim"), null, [live(t)]))), 0)) {
			continue;
		}
		if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(t), 1, 2]), "#")) {
			continue;
		}
		pos = rt.call(f, P("/proc/findtext"), null, [live(t), " "]);
		name = null;
		value = null;
		if (truthy(live(pos))) {
			name = rt.call(f, P("/proc/lowertext"), null, [rt.call(f, P("/proc/copytext"), null, [live(t), 1, live(pos)])]);
			value = rt.call(f, P("/proc/copytext"), null, [live(t), add(live(pos), 1)]);
		} else {
			name = rt.call(f, P("/proc/lowertext"), null, [live(t)]);
		}
		if (!truthy(live(name))) {
			continue;
		}
		if (isEqual(live(type), "config")) {
			$0 = live(name);
			if ($0 === "lobby_countdown") {
				rt.setSv(f, "lobby_countdown", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "round_end_countdown") {
				rt.setSv(f, "round_end_countdown", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "log_ooc") {
				rt.setSv(f, "log_ooc", 1);
			} else if ($0 === "log_access") {
				rt.setSv(f, "log_access", 1);
			} else if ($0 === "log_say") {
				rt.setSv(f, "log_say", 1);
			} else if ($0 === "log_admin") {
				rt.setSv(f, "log_admin", 1);
			} else if ($0 === "log_prayer") {
				rt.setSv(f, "log_prayer", 1);
			} else if ($0 === "log_law") {
				rt.setSv(f, "log_law", 1);
			} else if ($0 === "log_game") {
				rt.setSv(f, "log_game", 1);
			} else if ($0 === "log_vote") {
				rt.setSv(f, "log_vote", 1);
			} else if ($0 === "log_whisper") {
				rt.setSv(f, "log_whisper", 1);
			} else if ($0 === "log_attack") {
				rt.setSv(f, "log_attack", 1);
			} else if ($0 === "log_emote") {
				rt.setSv(f, "log_emote", 1);
			} else if ($0 === "log_adminchat") {
				rt.setSv(f, "log_adminchat", 1);
			} else if ($0 === "log_pda") {
				rt.setSv(f, "log_pda", 1);
			} else if ($0 === "log_twitter") {
				rt.setSv(f, "log_twitter", 1);
			} else if ($0 === "allow_admin_ooccolor") {
				rt.setSv(f, "allow_admin_ooccolor", 1);
			} else if ($0 === "allow_vote_restart") {
				rt.setSv(f, "allow_vote_restart", 1);
			} else if ($0 === "allow_vote_mode") {
				rt.setSv(f, "allow_vote_mode", 1);
			} else if ($0 === "allow_vote_shuttle") {
				rt.setSv(f, "allow_vote_shuttle", 1);
			} else if ($0 === "allow_vote_boot") {
				rt.setSv(f, "allow_vote_boot", 1);
			} else if ($0 === "allow_vote_map") {
				rt.setSv(f, "allow_vote_map", 1);
			} else if ($0 === "no_dead_vote") {
				rt.setSv(f, "vote_no_dead", 1);
			} else if ($0 === "default_no_vote") {
				rt.setSv(f, "vote_no_default", 1);
			} else if ($0 === "vote_delay") {
				rt.setSv(f, "vote_delay", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "vote_period") {
				rt.setSv(f, "vote_period", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "norespawn") {
				rt.setSv(f, "respawn", 0);
			} else if ($0 === "servername") {
				rt.setSv(f, "server_name", live(value));
			} else if ($0 === "stationname") {
				rt.setSv(f, "station_name", live(value));
			} else if ($0 === "server") {
				rt.setSv(f, "server", live(value));
			} else if ($0 === "banappeals") {
				rt.setSv(f, "banappeals", live(value));
			} else if ($0 === "wikiurl") {
				rt.setSv(f, "wikiurl", live(value));
			} else if ($0 === "forumurl") {
				rt.setSv(f, "forumurl", live(value));
			} else if ($0 === "rulesurl") {
				rt.setSv(f, "rulesurl", live(value));
			} else if ($0 === "githuburl") {
				rt.setSv(f, "githuburl", live(value));
			} else if ($0 === "guest_jobban") {
				rt.setSv(f, "guest_jobban", 1);
			} else if ($0 === "guest_ban") {
				rt.setGl("guests_allowed", 0);
			} else if ($0 === "allow_metadata") {
				rt.setSv(f, "allow_Metadata", 1);
			} else if ($0 === "id_console_jobslot_delay") {
				rt.setSv(f, "id_console_jobslot_delay", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "inactivity_period") {
				rt.setSv(f, "inactivity_period", multiply(rt.call(f, P("/proc/text2num"), null, [live(value)]), 10));
			} else if ($0 === "afk_period") {
				rt.setSv(f, "afk_period", multiply(rt.call(f, P("/proc/text2num"), null, [live(value)]), 10));
			} else if ($0 === "kick_inactive") {
				rt.setSv(f, "kick_inactive", 1);
			} else if ($0 === "load_jobs_from_txt") {
				rt.setSv(f, "load_jobs_from_txt", 1);
			} else if ($0 === "forbid_singulo_possession") {
				rt.setSv(f, "forbid_singulo_possession", 1);
			} else if ($0 === "popup_admin_pm") {
				rt.setSv(f, "popup_admin_pm", 1);
			} else if ($0 === "allow_holidays") {
				rt.setSv(f, "allow_holidays", 1);
			} else if ($0 === "useircbot") {
				rt.setSv(f, "useircbot", 1);
			} else if ($0 === "ticklag") {
				if (rt.gt((ticklag = rt.call(f, P("/proc/text2num"), null, [live(value)])), 0)) {
					rt.setSv(f, "fps", divide(10, live(ticklag)));
				}
			} else if ($0 === "tick_limit_mc_init") {
				rt.setSv(f, "tick_limit_mc_init", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "fps") {
				rt.setSv(f, "fps", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "automute_on") {
				rt.setSv(f, "automute_on", 1);
			} else if ($0 === "soft_popcap") {
				rt.setSv(f, "soft_popcap", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "hard_popcap") {
				rt.setSv(f, "hard_popcap", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "extreme_popcap") {
				rt.setSv(f, "extreme_popcap", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "soft_popcap_message") {
				rt.setSv(f, "soft_popcap_message", live(value));
			} else if ($0 === "hard_popcap_message") {
				rt.setSv(f, "hard_popcap_message", live(value));
			} else if ($0 === "extreme_popcap_message") {
				rt.setSv(f, "extreme_popcap_message", live(value));
			} else if ($0 === "check_randomizer") {
				rt.setSv(f, "check_randomizer", 1);
			} else if ($0 === "aggressive_changelog") {
				rt.setSv(f, "aggressive_changelog", 1);
			} else if ($0 === "allow_webclient") {
				rt.setSv(f, "allowwebclient", 1);
			} else if ($0 === "webclient_only_byond_members") {
				rt.setSv(f, "webclientmembersonly", 1);
			} else if ($0 === "announce_admin_logout") {
				rt.setSv(f, "announce_admin_logout", 1);
			} else if ($0 === "announce_admin_login") {
				rt.setSv(f, "announce_admin_login", 1);
			} else if ($0 === "maprotation") {
				rt.setSv(f, "maprotation", 1);
			} else if ($0 === "allow_map_voting") {
				rt.setSv(f, "allow_map_voting", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "maprotationchancedelta") {
				rt.setSv(f, "maprotatechancedelta", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "autoadmin") {
				rt.setSv(f, "autoadmin", 1);
				if (truthy(live(value))) {
					rt.setSv(f, "autoadmin_rank", rt.call(f, P("/proc/ckeyEx"), null, [live(value)]));
				}
			} else if ($0 === "generate_minimaps") {
				rt.setSv(f, "generate_minimaps", 1);
			} else if ($0 === "client_warn_version") {
				rt.setSv(f, "client_warn_version", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "client_warn_message") {
				rt.setSv(f, "client_warn_message", live(value));
			} else if ($0 === "client_error_version") {
				rt.setSv(f, "client_error_version", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "client_error_message") {
				rt.setSv(f, "client_error_message", live(value));
			} else if ($0 === "minute_topic_limit") {
				rt.setSv(f, "minutetopiclimit", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "second_topic_limit") {
				rt.setSv(f, "secondtopiclimit", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "error_cooldown") {
				rt.setSv(f, "error_cooldown", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "error_limit") {
				rt.setSv(f, "error_limit", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "error_silence_time") {
				rt.setSv(f, "error_silence_time", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "error_msg_delay") {
				rt.setSv(f, "error_msg_delay", rt.call(f, P("/proc/text2num"), null, [live(value)]));
			} else if ($0 === "default_view") {
				rt.setSv(f, "default_view", live(value));
			} else if ($0 === "default_view_square") {
				rt.setSv(f, "default_view_square", live(value));
			} else {
				rt.op(f, "OutputReference", [rt.R.glob(112)], [fmt("Unknown setting in configuration: '＀'", [live(name)])], false);
			}
		} else {
			if (isEqual(live(type), "game_options")) {
				$0 = live(name);
				if ($0 === "damage_multiplier") {
					rt.setSv(f, "damage_multiplier", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "revival_pod_plants") {
					rt.setSv(f, "revival_pod_plants", 1);
				} else if ($0 === "revival_cloning") {
					rt.setSv(f, "revival_cloning", 1);
				} else if ($0 === "revival_brain_life") {
					rt.setSv(f, "revival_brain_life", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "rename_cyborg") {
					rt.setSv(f, "rename_cyborg", 1);
				} else if ($0 === "ooc_during_round") {
					rt.setSv(f, "ooc_during_round", 1);
				} else if ($0 === "emojis") {
					rt.setSv(f, "emojis", 1);
				} else if ($0 === "run_delay") {
					rt.setSv(f, "run_speed", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "walk_delay") {
					rt.setSv(f, "walk_speed", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "human_delay") {
					rt.setSv(f, "human_delay", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "robot_delay") {
					rt.setSv(f, "robot_delay", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "monkey_delay") {
					rt.setSv(f, "monkey_delay", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "alien_delay") {
					rt.setSv(f, "alien_delay", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "slime_delay") {
					rt.setSv(f, "slime_delay", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "animal_delay") {
					rt.setSv(f, "animal_delay", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "alert_red_upto") {
					rt.setSv(f, "alert_desc_red_upto", live(value));
				} else if ($0 === "alert_red_downto") {
					rt.setSv(f, "alert_desc_red_downto", live(value));
				} else if ($0 === "alert_blue_downto") {
					rt.setSv(f, "alert_desc_blue_downto", live(value));
				} else if ($0 === "alert_blue_upto") {
					rt.setSv(f, "alert_desc_blue_upto", live(value));
				} else if ($0 === "alert_green") {
					rt.setSv(f, "alert_desc_green", live(value));
				} else if ($0 === "alert_delta") {
					rt.setSv(f, "alert_desc_delta", live(value));
				} else if ($0 === "no_intercept_report") {
					rt.setSv(f, "intercept", 0);
				} else if ($0 === "assistants_have_maint_access") {
					(rt.modSrcVar(f, "jobs_have_maint_access", 1, rt.bitOr));
				} else if ($0 === "security_has_maint_access") {
					(rt.modSrcVar(f, "jobs_have_maint_access", 2, rt.bitOr));
				} else if ($0 === "everyone_has_maint_access") {
					(rt.modSrcVar(f, "jobs_have_maint_access", 4, rt.bitOr));
				} else if ($0 === "sec_start_brig") {
					rt.setSv(f, "sec_start_brig", 1);
				} else if ($0 === "gateway_delay") {
					rt.setSv(f, "gateway_delay", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "continuous") {
					if (truthy((rt.isIn(f, (mode_name = rt.call(f, P("/proc/lowertext"), null, [live(value)])), rt.sv(f, "modes")) ? 1 : 0))) {
						rt.setAt(rt.sv(f, "continuous"), live(mode_name), 1);
					} else {
						rt.op(f, "OutputReference", [rt.R.glob(112)], [fmt("Unknown continuous configuration definition: ＀.", [live(mode_name)])], false);
					}
				} else if ($0 === "midround_antag") {
					if (truthy((rt.isIn(f, (mode_name = rt.call(f, P("/proc/lowertext"), null, [live(value)])), rt.sv(f, "modes")) ? 1 : 0))) {
						rt.setAt(rt.sv(f, "midround_antag"), live(mode_name), 1);
					} else {
						rt.op(f, "OutputReference", [rt.R.glob(112)], [fmt("Unknown midround antagonist configuration definition: ＀.", [live(mode_name)])], false);
					}
				} else if ($0 === "midround_antag_time_check") {
					rt.setSv(f, "midround_antag_time_check", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "midround_antag_life_check") {
					rt.setSv(f, "midround_antag_life_check", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "min_pop") {
					pop_pos = rt.call(f, P("/proc/findtext"), null, [live(value), " "]);
					mode_name_6 = null;
					mode_value = null;
					if (truthy(live(pop_pos))) {
						mode_name_6 = rt.call(f, P("/proc/lowertext"), null, [rt.call(f, P("/proc/copytext"), null, [live(value), 1, live(pop_pos)])]);
						mode_value = rt.call(f, P("/proc/copytext"), null, [live(value), add(live(pop_pos), 1)]);
						if (truthy((rt.isIn(f, live(mode_name_6), rt.sv(f, "modes")) ? 1 : 0))) {
							rt.setAt(rt.sv(f, "min_pop"), live(mode_name_6), rt.call(f, P("/proc/text2num"), null, [live(mode_value)]));
						} else {
							rt.op(f, "OutputReference", [rt.R.glob(112)], [fmt("Unknown minimum population configuration definition: ＀.", [live(mode_name_6)])], false);
						}
					} else {
						rt.op(f, "OutputReference", [rt.R.glob(112)], [fmt("Incorrect minimum population configuration definition: ＀  ＀.", [live(mode_name_6), live(mode_value)])], false);
					}
				} else if ($0 === "max_pop") {
					pop_pos = rt.call(f, P("/proc/findtext"), null, [live(value), " "]);
					mode_name_6 = null;
					mode_value = null;
					if (truthy(live(pop_pos))) {
						mode_name_6 = rt.call(f, P("/proc/lowertext"), null, [rt.call(f, P("/proc/copytext"), null, [live(value), 1, live(pop_pos)])]);
						mode_value = rt.call(f, P("/proc/copytext"), null, [live(value), add(live(pop_pos), 1)]);
						if (truthy((rt.isIn(f, live(mode_name_6), rt.sv(f, "modes")) ? 1 : 0))) {
							rt.setAt(rt.sv(f, "max_pop"), live(mode_name_6), rt.call(f, P("/proc/text2num"), null, [live(mode_value)]));
						} else {
							rt.op(f, "OutputReference", [rt.R.glob(112)], [fmt("Unknown maximum population configuration definition: ＀.", [live(mode_name_6)])], false);
						}
					} else {
						rt.op(f, "OutputReference", [rt.R.glob(112)], [fmt("Incorrect maximum population configuration definition: ＀  ＀.", [live(mode_name_6), live(mode_value)])], false);
					}
				} else if ($0 === "shuttle_refuel_delay") {
					rt.setSv(f, "shuttle_refuel_delay", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "show_game_type_odds") {
					rt.setSv(f, "show_game_type_odds", 1);
				} else if ($0 === "ghost_interaction") {
					rt.setSv(f, "ghost_interaction", 1);
				} else if ($0 === "traitor_scaling_coeff") {
					rt.setSv(f, "traitor_scaling_coeff", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "changeling_scaling_coeff") {
					rt.setSv(f, "changeling_scaling_coeff", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "security_scaling_coeff") {
					rt.setSv(f, "security_scaling_coeff", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "abductor_scaling_coeff") {
					rt.setSv(f, "abductor_scaling_coeff", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "traitor_objectives_amount") {
					rt.setSv(f, "traitor_objectives_amount", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "probability") {
					prob_pos = rt.call(f, P("/proc/findtext"), null, [live(value), " "]);
					prob_name = null;
					prob_value = null;
					if (truthy(live(prob_pos))) {
						prob_name = rt.call(f, P("/proc/lowertext"), null, [rt.call(f, P("/proc/copytext"), null, [live(value), 1, live(prob_pos)])]);
						prob_value = rt.call(f, P("/proc/copytext"), null, [live(value), add(live(prob_pos), 1)]);
						if (truthy((rt.isIn(f, live(prob_name), rt.sv(f, "modes")) ? 1 : 0))) {
							rt.setAt(rt.sv(f, "probabilities"), live(prob_name), rt.call(f, P("/proc/text2num"), null, [live(prob_value)]));
						} else {
							rt.op(f, "OutputReference", [rt.R.glob(112)], [fmt("Unknown game mode probability configuration definition: ＀.", [live(prob_name)])], false);
						}
					} else {
						rt.op(f, "OutputReference", [rt.R.glob(112)], [fmt("Incorrect probability configuration definition: ＀  ＀.", [live(prob_name), live(prob_value)])], false);
					}
				} else if ($0 === "protect_roles_from_antagonist") {
					rt.setSv(f, "protect_roles_from_antagonist", 1);
				} else if ($0 === "protect_assistant_from_antagonist") {
					rt.setSv(f, "protect_assistant_from_antagonist", 1);
				} else if ($0 === "enforce_human_authority") {
					rt.setSv(f, "enforce_human_authority", 1);
				} else if ($0 === "allow_latejoin_antagonists") {
					rt.setSv(f, "allow_latejoin_antagonists", 1);
				} else if ($0 === "allow_random_events") {
					rt.setSv(f, "allow_random_events", 1);
				} else if ($0 === "events_min_time_mul") {
					rt.setSv(f, "events_min_time_mul", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "events_min_players_mul") {
					rt.setSv(f, "events_min_players_mul", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "minimal_access_threshold") {
					rt.setSv(f, "minimal_access_threshold", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "jobs_have_minimal_access") {
					rt.setSv(f, "jobs_have_minimal_access", 1);
				} else if ($0 === "humans_need_surnames") {
					rt.setSv(f, "humans_need_surnames", 1);
				} else if ($0 === "force_random_names") {
					rt.setSv(f, "force_random_names", 1);
				} else if ($0 === "allow_ai") {
					rt.setSv(f, "allow_ai", 1);
				} else if ($0 === "disable_secborg") {
					rt.setSv(f, "forbid_secborg", 1);
				} else if ($0 === "disable_peaceborg") {
					rt.setSv(f, "forbid_peaceborg", 1);
				} else if ($0 === "silent_ai") {
					rt.setSv(f, "silent_ai", 1);
				} else if ($0 === "silent_borg") {
					rt.setSv(f, "silent_borg", 1);
				} else if ($0 === "sandbox_autoclose") {
					rt.setSv(f, "sandbox_autoclose", 1);
				} else if ($0 === "default_laws") {
					rt.setSv(f, "default_laws", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "random_laws") {
					rt.modSrcVar(f, "lawids", (law_id = rt.call(f, P("/proc/lowertext"), null, [live(value)])), add);
				} else if ($0 === "law_weight") {
					if (!isEqual(rt.getLen(f, (L = rt.call(f, P("/proc/splittext"), null, [live(value), ","]))), 2)) {
						rt.op(f, "OutputReference", [rt.R.glob(112)], [add("Invalid LAW_WEIGHT: ", live(t))], false);
						continue;
					}
					lawid = rt.index(live(L), 1);
					weight = rt.call(f, P("/proc/text2num"), null, [rt.index(live(L), 2)]);
					rt.setAt(rt.sv(f, "law_weights"), live(lawid), live(weight));
				} else if ($0 === "silicon_max_law_amount") {
					rt.setSv(f, "silicon_max_law_amount", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "join_with_mutant_race") {
					rt.setSv(f, "mutant_races", 1);
				} else if ($0 === "roundstart_races") {
					race_id = rt.call(f, P("/proc/lowertext"), null, [live(value)]);
					species_id = null;
					rt.forList(f, 1, rt.gl("species_list"));
					while (($e = rt.next(f, 1)) !== undefined) {
						species_id = $e;
						if (isEqual(live(species_id), live(race_id))) {
							rt.modSrcVar(f, "roundstart_races", rt.index(rt.gl("species_list"), live(species_id)), add);
							rt.setAt(rt.gl("roundstart_species"), live(species_id), rt.index(rt.gl("species_list"), live(species_id)));
						}
					}
					rt.endFor(f, 1);
				} else if ($0 === "join_with_mutant_humans") {
					rt.setSv(f, "mutant_humans", 1);
				} else if ($0 === "assistant_cap") {
					rt.setSv(f, "assistant_cap", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "starlight") {
					rt.setSv(f, "starlight", 1);
				} else if ($0 === "grey_assistants") {
					rt.setSv(f, "grey_assistants", 1);
				} else if ($0 === "lavaland_budget") {
					rt.setSv(f, "lavaland_budget", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "space_budget") {
					rt.setSv(f, "space_budget", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else if ($0 === "no_summon_guns") {
					rt.setSv(f, "no_summon_guns", 1);
				} else if ($0 === "no_summon_magic") {
					rt.setSv(f, "no_summon_magic", 1);
				} else if ($0 === "no_summon_events") {
					rt.setSv(f, "no_summon_events", 1);
				} else if ($0 === "reactionary_explosions") {
					rt.setSv(f, "reactionary_explosions", 1);
				} else if ($0 === "bombcap") {
					if (!truthy((BombCap = rt.call(f, P("/proc/text2num"), null, [live(value)])))) {
						continue;
					}
					if (rt.lt(live(BombCap), 4)) {
						BombCap = 4;
					}
					rt.setGl("MAX_EX_DEVESTATION_RANGE", rt.call(f, P("/proc/round"), null, [divide(live(BombCap), 4)]));
					rt.setGl("MAX_EX_HEAVY_RANGE", rt.call(f, P("/proc/round"), null, [divide(live(BombCap), 2)]));
					rt.setGl("MAX_EX_LIGHT_RANGE", live(BombCap));
					rt.setGl("MAX_EX_FLASH_RANGE", live(BombCap));
					rt.setGl("MAX_EX_FLAME_RANGE", live(BombCap));
				} else if ($0 === "arrivals_shuttle_dock_window") {
					rt.setSv(f, "arrivals_shuttle_dock_window", rt.call(f, P("/proc/max"), null, [25, rt.call(f, P("/proc/text2num"), null, [live(value)])]));
				} else if ($0 === "arrivals_shuttle_require_safe_latejoin") {
					rt.setSv(f, "arrivals_shuttle_require_safe_latejoin", 1);
				} else if ($0 === "mice_roundstart") {
					rt.setSv(f, "mice_roundstart", rt.call(f, P("/proc/text2num"), null, [live(value)]));
				} else {
					rt.op(f, "OutputReference", [rt.R.glob(112)], [fmt("Unknown setting in configuration: '＀'", [live(name)])], false);
				}
			} else {
				if (isEqual(live(type), "policies")) {
					rt.setAt(rt.sv(f, "policies"), live(name), live(value));
				}
			}
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "fps", rt.call(f, P("/proc/round"), null, [rt.sv(f, "fps")]));
	if (!rt.le(rt.sv(f, "fps"), 0)) return f.dot;
	rt.setSv(f, "fps", rt.initial(f, live(f.src), "fps"));
	return f.dot;
});

// /datum/configuration/proc/loadmaplist  (code/controllers/configuration.dm:801)
rt.def("/datum/configuration/proc/loadmaplist", function loadmaplist(f: Frame, filename: Value) {
	let Lines: Value = null, currentmap: Value = null, t: Value = null, pos: Value = null, command: Value = null, data: Value = null;
	let $0: any, $e: any;
	f.vars = () => [Lines, currentmap, t, pos, command, data, $0, $e];
	Lines = rt.callName(f, rt.world(), "file2list", [live(filename)]);
	currentmap = null;
	t = null;
	rt.forList(f, 0, live(Lines));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if (!truthy(live(t))) {
			continue;
		}
		if (isEqual(rt.length((t = rt.call(f, P("/proc/trim"), null, [live(t)]))), 0)) {
			continue;
		}
		if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(t), 1, 2]), "#")) {
			continue;
		}
		pos = rt.call(f, P("/proc/findtext"), null, [live(t), " "]);
		command = null;
		data = null;
		if (truthy(live(pos))) {
			command = rt.call(f, P("/proc/lowertext"), null, [rt.call(f, P("/proc/copytext"), null, [live(t), 1, live(pos)])]);
			data = rt.call(f, P("/proc/copytext"), null, [live(t), add(live(pos), 1)]);
		} else {
			command = rt.call(f, P("/proc/lowertext"), null, [live(t)]);
		}
		if (!truthy(live(command))) {
			continue;
		}
		if ((!truthy(live(currentmap)) && !isEqual(live(command), "map"))) {
			continue;
		}
		$0 = live(command);
		if ($0 === "map") {
			if (truthy(rt.gv(f, "defaulted", (currentmap = rt.new_(f, T("/datum/map_config"), [fmt("_maps/＀.json", [live(data)])]))))) {
				rt.call(f, P("/proc/log_world"), null, [fmt("Failed to load map config for ＀!", [live(data)])]);
			}
		} else if ($0 === "minplayers" || $0 === "minplayer") {
			rt.setFv(f, "config_min_users", live(currentmap), rt.call(f, P("/proc/text2num"), null, [live(data)]));
		} else if ($0 === "maxplayers" || $0 === "maxplayer") {
			rt.setFv(f, "config_max_users", live(currentmap), rt.call(f, P("/proc/text2num"), null, [live(data)]));
		} else if ($0 === "weight" || $0 === "voteweight") {
			rt.setFv(f, "voteweight", live(currentmap), rt.call(f, P("/proc/text2num"), null, [live(data)]));
		} else if ($0 === "default" || $0 === "defaultmap") {
			rt.setSv(f, "defaultmap", live(currentmap));
		} else if ($0 === "endmap") {
			rt.setAt(rt.sv(f, "maplist"), rt.fv(f, "map_name", live(currentmap)), live(currentmap));
			currentmap = null;
		} else if ($0 === "disabled") {
			currentmap = null;
		} else {
			rt.op(f, "OutputReference", [rt.R.glob(112)], [fmt("Unknown command in map vote config: '＀'", [live(command)])], false);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/configuration/proc/pick_mode  (code/controllers/configuration.dm:898)  may sleep
rt.def("/datum/configuration/proc/pick_mode", function* pick_mode(f: Frame, mode_name: Value) {
	let _T: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [mode_name, _T, M, $e];
	_T = null;
	rt.forList(f, 0, rt.sv(f, "gamemode_cache"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if ((truthy(rt.gv(f, "config_tag", (M = (yield* g.new_(f, live(_T), []))))) && isEqual(rt.fv(f, "config_tag", live(M)), live(mode_name)))) {
			return live(M);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
	}
	rt.endFor(f, 0);
	return (yield* g.new_(f, T("/datum/game_mode/extended"), []));
}, true);

// /datum/configuration/proc/get_runnable_modes  (code/controllers/configuration.dm:906)  may sleep
rt.def("/datum/configuration/proc/get_runnable_modes", function* get_runnable_modes(f: Frame) {
	let runnable_modes: Value = null, _T: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [runnable_modes, _T, M, $e];
	runnable_modes = (yield* g.new_(f, T("/list"), []));
	_T = null;
	rt.forList(f, 0, rt.sv(f, "gamemode_cache"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (!truthy((rt.isIn(f, rt.gv(f, "config_tag", (M = (yield* g.new_(f, live(_T), [])))), rt.sv(f, "modes")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
			continue;
		}
		if (rt.le(rt.index(rt.sv(f, "probabilities"), rt.fv(f, "config_tag", live(M))), 0)) {
			yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
			continue;
		}
		if (truthy(rt.index(rt.sv(f, "min_pop"), rt.fv(f, "config_tag", live(M))))) {
			rt.setFv(f, "required_players", live(M), rt.index(rt.sv(f, "min_pop"), rt.fv(f, "config_tag", live(M))));
		}
		if (truthy(rt.index(rt.sv(f, "max_pop"), rt.fv(f, "config_tag", live(M))))) {
			rt.setFv(f, "maximum_players", live(M), rt.index(rt.sv(f, "max_pop"), rt.fv(f, "config_tag", live(M))));
		}
		if (truthy((yield* g.callName(f, live(M), "can_start", [])))) {
			rt.setAt(live(runnable_modes), live(M), rt.index(rt.sv(f, "probabilities"), rt.fv(f, "config_tag", live(M))));
		}
	}
	rt.endFor(f, 0);
	return live(runnable_modes);
}, true);

// /datum/configuration/proc/get_runnable_midround_modes  (code/controllers/configuration.dm:926)  may sleep
rt.def("/datum/configuration/proc/get_runnable_midround_modes", function* get_runnable_midround_modes(f: Frame, crew: Value) {
	let runnable_modes: Value = null, _T: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [crew, runnable_modes, _T, M, $e];
	runnable_modes = (yield* g.new_(f, T("/list"), []));
	_T = null;
	rt.forList(f, 0, subtract(rt.sv(f, "gamemode_cache"), rt.gv(f, "type", rt.fv(f, "mode", rt.gl("SSticker")))));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (!truthy((rt.isIn(f, rt.gv(f, "config_tag", (M = (yield* g.new_(f, live(_T), [])))), rt.sv(f, "modes")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
			continue;
		}
		if (rt.le(rt.index(rt.sv(f, "probabilities"), rt.fv(f, "config_tag", live(M))), 0)) {
			yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
			continue;
		}
		if (truthy(rt.index(rt.sv(f, "min_pop"), rt.fv(f, "config_tag", live(M))))) {
			rt.setFv(f, "required_players", live(M), rt.index(rt.sv(f, "min_pop"), rt.fv(f, "config_tag", live(M))));
		}
		if (truthy(rt.index(rt.sv(f, "max_pop"), rt.fv(f, "config_tag", live(M))))) {
			rt.setFv(f, "maximum_players", live(M), rt.index(rt.sv(f, "max_pop"), rt.fv(f, "config_tag", live(M))));
		}
		if (rt.le(rt.fv(f, "required_players", live(M)), live(crew))) {
			if ((rt.ge(rt.fv(f, "maximum_players", live(M)), 0) && rt.lt(rt.fv(f, "maximum_players", live(M)), live(crew)))) {
				continue;
			}
			rt.setAt(live(runnable_modes), live(M), rt.index(rt.sv(f, "probabilities"), rt.fv(f, "config_tag", live(M))));
		}
	}
	rt.endFor(f, 0);
	return live(runnable_modes);
}, true);

// /datum/configuration/proc/stat_entry  (code/controllers/configuration.dm:946)  may sleep
rt.def("/datum/configuration/proc/stat_entry", function* stat_entry(f: Frame) {
	if (!truthy(rt.sv(f, "statclick"))) {
		rt.setSv(f, "statclick", (yield* g.new_(f, T("/obj/effect/statclick/debug"), [null, "Edit", live(f.src)])));
	}
	yield* g.call(f, P("/proc/stat"), null, [fmt("＀:", [rt.sv(f, "name")]), rt.sv(f, "statclick")]);
	return f.dot;
}, true);
