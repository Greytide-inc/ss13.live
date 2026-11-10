// Based on /tg/station's code/controllers/configuration.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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
	newcomer_wait: 0,
	announce_removals: 0,
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

// configuration.dm:10
rt.def("/datum/configuration/proc/can_vv_get", function can_vv_get(f: Frame, var_name: Value) {
	if (rt.isIn(f, var_name, GLOB.banned_gets)) {
		return 0;
	}
	return parent_proc();
}, false);

// configuration.dm:16
rt.def("/datum/configuration/proc/vv_edit_var", function vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	if (rt.isIn(f, var_name, GLOB.banned_edits)) {
		return 0;
	}
	return parent_proc();
}, false);

// configuration.dm:120
rt.def("/datum/configuration/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mode_names = list();

	this.modes = list();

	this.votable_modes = list();

	this.probabilities = list();

	this.min_pop = list();

	this.max_pop = list();

	this.continuous = list();

	this.midround_antag = list();

	this.roundstart_races = list();

	this.lawids = list();

	this.law_weights = list();

	this.maplist = list();

	this.policies = list();
	return f.dot;
});

// configuration.dm:274
rt.def("/datum/configuration/proc/New", function* New(f: Frame) {
	let _T: Value = null, M: Value = null;
	this.gamemode_cache = typecacheof(T("/datum/game_mode"), 1);
	for (_T of each(this.gamemode_cache)) {
		if ((M = (yield* new_(_T))).config_tag) {
			if (!rt.isIn(f, M.config_tag, this.modes)) {
				rt.op(f, "OutputReference", [rt.R.glob(112)], [`Adding game mode ${M.name} (${M.config_tag}) to configuration.`], false);
				this.modes += M.config_tag;
				rt.setAt(this.mode_names, M.config_tag, M.name);
				rt.setAt(this.probabilities, M.config_tag, M.probability);
				if (M.votable) {
					this.votable_modes += M.config_tag;
				}
			}
		}
		yield* qdel(M);
	}
	this.votable_modes += "secret";
	this.Reload();
	return f.dot;
}, true);

// configuration.dm:294
rt.def("/datum/configuration/proc/Reload", function Reload(f: Frame) {
	this.load("config/config.txt");
	this.load("config/game_options.txt", "game_options");
	this.load("config/policies.txt", "policies");
	if (this.maprotation || this.allow_vote_map) { // ss13.live: the map vote needs the list too
		this.loadmaplist("config/maps.txt");
	}
	GLOB.abandon_allowed = this.respawn;
	return f.dot;
});

// configuration.dm:305
rt.def("/datum/configuration/proc/load", function load(f: Frame, filename: Value, type: Value) {
	let t: Value = null, pos: Value = null, name: Value = null, value: Value = null, ticklag: Value = null, mode_name: Value = null, pop_pos: Value = null, mode_name_6: Value = null, mode_value: Value = null, prob_pos: Value = null, prob_name: Value = null, prob_value: Value = null, law_id: Value = null, L: Value = null, lawid: Value = null, weight: Value = null, race_id: Value = null, species_id: Value = null, BombCap: Value = null;
	let $e: any;
	type ??= "config";
	let Lines: Value = rt.world().file2list(filename);
	for (t of each(Lines)) {
		if (!t) {
			continue;
		}
		if (rt.length((t = trim(t))) == 0) {
			continue;
		}
		if (copytext(t, 1, 2) == "#") {
			continue;
		}
		pos = findtext(t, " ");
		name = null;
		value = null;
		if (pos) {
			name = lowertext(copytext(t, 1, pos));
			value = copytext(t, pos + 1);
		} else {
			name = lowertext(t);
		}
		if (!name) {
			continue;
		}
		if (type == "config") {
			if (name === "lobby_countdown") {
				this.lobby_countdown = text2num(value);
			} else if (name === "round_end_countdown") {
				this.round_end_countdown = text2num(value);
			} else if (name === "log_ooc") {
				this.log_ooc = 1;
			} else if (name === "log_access") {
				this.log_access = 1;
			} else if (name === "log_say") {
				this.log_say = 1;
			} else if (name === "log_admin") {
				this.log_admin = 1;
			} else if (name === "log_prayer") {
				this.log_prayer = 1;
			} else if (name === "log_law") {
				this.log_law = 1;
			} else if (name === "log_game") {
				this.log_game = 1;
			} else if (name === "log_vote") {
				this.log_vote = 1;
			} else if (name === "log_whisper") {
				this.log_whisper = 1;
			} else if (name === "log_attack") {
				this.log_attack = 1;
			} else if (name === "log_emote") {
				this.log_emote = 1;
			} else if (name === "log_adminchat") {
				this.log_adminchat = 1;
			} else if (name === "log_pda") {
				this.log_pda = 1;
			} else if (name === "log_twitter") {
				this.log_twitter = 1;
			} else if (name === "allow_admin_ooccolor") {
				this.allow_admin_ooccolor = 1;
			} else if (name === "allow_vote_restart") {
				this.allow_vote_restart = 1;
			} else if (name === "allow_vote_mode") {
				this.allow_vote_mode = 1;
			} else if (name === "allow_vote_shuttle") {
				this.allow_vote_shuttle = 1;
			} else if (name === "allow_vote_boot") {
				this.allow_vote_boot = 1;
			} else if (name === "allow_vote_map") {
				this.allow_vote_map = 1;
			} else if (name === "no_dead_vote") {
				this.vote_no_dead = 1;
			} else if (name === "default_no_vote") {
				this.vote_no_default = 1;
			} else if (name === "announce_removals") {
				this.announce_removals = 1;
			} else if (name === "newcomer_wait") {
				this.newcomer_wait = text2num(value);
			} else if (name === "vote_delay") {
				this.vote_delay = text2num(value);
			} else if (name === "vote_period") {
				this.vote_period = text2num(value);
			} else if (name === "norespawn") {
				this.respawn = 0;
			} else if (name === "servername") {
				this.server_name = value;
			} else if (name === "stationname") {
				this.station_name = value;
			} else if (name === "server") {
				this.server = value;
			} else if (name === "banappeals") {
				this.banappeals = value;
			} else if (name === "wikiurl") {
				this.wikiurl = value;
			} else if (name === "forumurl") {
				this.forumurl = value;
			} else if (name === "rulesurl") {
				this.rulesurl = value;
			} else if (name === "githuburl") {
				this.githuburl = value;
			} else if (name === "guest_jobban") {
				this.guest_jobban = 1;
			} else if (name === "guest_ban") {
				GLOB.guests_allowed = 0;
			} else if (name === "allow_metadata") {
				this.allow_Metadata = 1;
			} else if (name === "id_console_jobslot_delay") {
				this.id_console_jobslot_delay = text2num(value);
			} else if (name === "inactivity_period") {
				this.inactivity_period = text2num(value) * 10;
			} else if (name === "afk_period") {
				this.afk_period = text2num(value) * 10;
			} else if (name === "kick_inactive") {
				this.kick_inactive = 1;
			} else if (name === "load_jobs_from_txt") {
				this.load_jobs_from_txt = 1;
			} else if (name === "forbid_singulo_possession") {
				this.forbid_singulo_possession = 1;
			} else if (name === "popup_admin_pm") {
				this.popup_admin_pm = 1;
			} else if (name === "allow_holidays") {
				this.allow_holidays = 1;
			} else if (name === "useircbot") {
				this.useircbot = 1;
			} else if (name === "ticklag") {
				if ((ticklag = text2num(value)) > 0) {
					this.fps = 10 / ticklag;
				}
			} else if (name === "tick_limit_mc_init") {
				this.tick_limit_mc_init = text2num(value);
			} else if (name === "fps") {
				this.fps = text2num(value);
			} else if (name === "automute_on") {
				this.automute_on = 1;
			} else if (name === "soft_popcap") {
				this.soft_popcap = text2num(value);
			} else if (name === "hard_popcap") {
				this.hard_popcap = text2num(value);
			} else if (name === "extreme_popcap") {
				this.extreme_popcap = text2num(value);
			} else if (name === "soft_popcap_message") {
				this.soft_popcap_message = value;
			} else if (name === "hard_popcap_message") {
				this.hard_popcap_message = value;
			} else if (name === "extreme_popcap_message") {
				this.extreme_popcap_message = value;
			} else if (name === "check_randomizer") {
				this.check_randomizer = 1;
			} else if (name === "aggressive_changelog") {
				this.aggressive_changelog = 1;
			} else if (name === "allow_webclient") {
				this.allowwebclient = 1;
			} else if (name === "webclient_only_byond_members") {
				this.webclientmembersonly = 1;
			} else if (name === "announce_admin_logout") {
				this.announce_admin_logout = 1;
			} else if (name === "announce_admin_login") {
				this.announce_admin_login = 1;
			} else if (name === "maprotation") {
				this.maprotation = 1;
			} else if (name === "allow_map_voting") {
				this.allow_map_voting = text2num(value);
			} else if (name === "maprotationchancedelta") {
				this.maprotatechancedelta = text2num(value);
			} else if (name === "autoadmin") {
				this.autoadmin = 1;
				if (value) {
					this.autoadmin_rank = ckeyEx(value);
				}
			} else if (name === "generate_minimaps") {
				this.generate_minimaps = 1;
			} else if (name === "client_warn_version") {
				this.client_warn_version = text2num(value);
			} else if (name === "client_warn_message") {
				this.client_warn_message = value;
			} else if (name === "client_error_version") {
				this.client_error_version = text2num(value);
			} else if (name === "client_error_message") {
				this.client_error_message = value;
			} else if (name === "minute_topic_limit") {
				this.minutetopiclimit = text2num(value);
			} else if (name === "second_topic_limit") {
				this.secondtopiclimit = text2num(value);
			} else if (name === "error_cooldown") {
				this.error_cooldown = text2num(value);
			} else if (name === "error_limit") {
				this.error_limit = text2num(value);
			} else if (name === "error_silence_time") {
				this.error_silence_time = text2num(value);
			} else if (name === "error_msg_delay") {
				this.error_msg_delay = text2num(value);
			} else if (name === "default_view") {
				this.default_view = value;
			} else if (name === "default_view_square") {
				this.default_view_square = value;
			} else {
				rt.op(f, "OutputReference", [rt.R.glob(112)], [`Unknown setting in configuration: '${name}'`], false);
			}
		} else if (type == "game_options") {
			if (name === "damage_multiplier") {
				this.damage_multiplier = text2num(value);
			} else if (name === "revival_pod_plants") {
				this.revival_pod_plants = 1;
			} else if (name === "revival_cloning") {
				this.revival_cloning = 1;
			} else if (name === "revival_brain_life") {
				this.revival_brain_life = text2num(value);
			} else if (name === "rename_cyborg") {
				this.rename_cyborg = 1;
			} else if (name === "ooc_during_round") {
				this.ooc_during_round = 1;
			} else if (name === "emojis") {
				this.emojis = 1;
			} else if (name === "run_delay") {
				this.run_speed = text2num(value);
			} else if (name === "walk_delay") {
				this.walk_speed = text2num(value);
			} else if (name === "human_delay") {
				this.human_delay = text2num(value);
			} else if (name === "robot_delay") {
				this.robot_delay = text2num(value);
			} else if (name === "monkey_delay") {
				this.monkey_delay = text2num(value);
			} else if (name === "alien_delay") {
				this.alien_delay = text2num(value);
			} else if (name === "slime_delay") {
				this.slime_delay = text2num(value);
			} else if (name === "animal_delay") {
				this.animal_delay = text2num(value);
			} else if (name === "alert_red_upto") {
				this.alert_desc_red_upto = value;
			} else if (name === "alert_red_downto") {
				this.alert_desc_red_downto = value;
			} else if (name === "alert_blue_downto") {
				this.alert_desc_blue_downto = value;
			} else if (name === "alert_blue_upto") {
				this.alert_desc_blue_upto = value;
			} else if (name === "alert_green") {
				this.alert_desc_green = value;
			} else if (name === "alert_delta") {
				this.alert_desc_delta = value;
			} else if (name === "no_intercept_report") {
				this.intercept = 0;
			} else if (name === "assistants_have_maint_access") {
				(rt.modSrcVar(f, "jobs_have_maint_access", 1, rt.bitOr));
			} else if (name === "security_has_maint_access") {
				(rt.modSrcVar(f, "jobs_have_maint_access", 2, rt.bitOr));
			} else if (name === "everyone_has_maint_access") {
				(rt.modSrcVar(f, "jobs_have_maint_access", 4, rt.bitOr));
			} else if (name === "sec_start_brig") {
				this.sec_start_brig = 1;
			} else if (name === "gateway_delay") {
				this.gateway_delay = text2num(value);
			} else if (name === "continuous") {
				if (rt.isIn(f, (mode_name = lowertext(value)), this.modes)) {
					rt.setAt(this.continuous, mode_name, 1);
				} else {
					rt.op(f, "OutputReference", [rt.R.glob(112)], [`Unknown continuous configuration definition: ${mode_name}.`], false);
				}
			} else if (name === "midround_antag") {
				if (rt.isIn(f, (mode_name = lowertext(value)), this.modes)) {
					rt.setAt(this.midround_antag, mode_name, 1);
				} else {
					rt.op(f, "OutputReference", [rt.R.glob(112)], [`Unknown midround antagonist configuration definition: ${mode_name}.`], false);
				}
			} else if (name === "midround_antag_time_check") {
				this.midround_antag_time_check = text2num(value);
			} else if (name === "midround_antag_life_check") {
				this.midround_antag_life_check = text2num(value);
			} else if (name === "min_pop") {
				pop_pos = findtext(value, " ");
				mode_name_6 = null;
				mode_value = null;
				if (pop_pos) {
					mode_name_6 = lowertext(copytext(value, 1, pop_pos));
					mode_value = copytext(value, pop_pos + 1);
					if (rt.isIn(f, mode_name_6, this.modes)) {
						rt.setAt(this.min_pop, mode_name_6, text2num(mode_value));
					} else {
						rt.op(f, "OutputReference", [rt.R.glob(112)], [`Unknown minimum population configuration definition: ${mode_name_6}.`], false);
					}
				} else {
					rt.op(f, "OutputReference", [rt.R.glob(112)], [`Incorrect minimum population configuration definition: ${mode_name_6}  ${mode_value}.`], false);
				}
			} else if (name === "max_pop") {
				pop_pos = findtext(value, " ");
				mode_name_6 = null;
				mode_value = null;
				if (pop_pos) {
					mode_name_6 = lowertext(copytext(value, 1, pop_pos));
					mode_value = copytext(value, pop_pos + 1);
					if (rt.isIn(f, mode_name_6, this.modes)) {
						rt.setAt(this.max_pop, mode_name_6, text2num(mode_value));
					} else {
						rt.op(f, "OutputReference", [rt.R.glob(112)], [`Unknown maximum population configuration definition: ${mode_name_6}.`], false);
					}
				} else {
					rt.op(f, "OutputReference", [rt.R.glob(112)], [`Incorrect maximum population configuration definition: ${mode_name_6}  ${mode_value}.`], false);
				}
			} else if (name === "shuttle_refuel_delay") {
				this.shuttle_refuel_delay = text2num(value);
			} else if (name === "show_game_type_odds") {
				this.show_game_type_odds = 1;
			} else if (name === "ghost_interaction") {
				this.ghost_interaction = 1;
			} else if (name === "traitor_scaling_coeff") {
				this.traitor_scaling_coeff = text2num(value);
			} else if (name === "changeling_scaling_coeff") {
				this.changeling_scaling_coeff = text2num(value);
			} else if (name === "security_scaling_coeff") {
				this.security_scaling_coeff = text2num(value);
			} else if (name === "abductor_scaling_coeff") {
				this.abductor_scaling_coeff = text2num(value);
			} else if (name === "traitor_objectives_amount") {
				this.traitor_objectives_amount = text2num(value);
			} else if (name === "probability") {
				prob_pos = findtext(value, " ");
				prob_name = null;
				prob_value = null;
				if (prob_pos) {
					prob_name = lowertext(copytext(value, 1, prob_pos));
					prob_value = copytext(value, prob_pos + 1);
					if (rt.isIn(f, prob_name, this.modes)) {
						rt.setAt(this.probabilities, prob_name, text2num(prob_value));
					} else {
						rt.op(f, "OutputReference", [rt.R.glob(112)], [`Unknown game mode probability configuration definition: ${prob_name}.`], false);
					}
				} else {
					rt.op(f, "OutputReference", [rt.R.glob(112)], [`Incorrect probability configuration definition: ${prob_name}  ${prob_value}.`], false);
				}
			} else if (name === "protect_roles_from_antagonist") {
				this.protect_roles_from_antagonist = 1;
			} else if (name === "protect_assistant_from_antagonist") {
				this.protect_assistant_from_antagonist = 1;
			} else if (name === "enforce_human_authority") {
				this.enforce_human_authority = 1;
			} else if (name === "allow_latejoin_antagonists") {
				this.allow_latejoin_antagonists = 1;
			} else if (name === "allow_random_events") {
				this.allow_random_events = 1;
			} else if (name === "events_min_time_mul") {
				this.events_min_time_mul = text2num(value);
			} else if (name === "events_min_players_mul") {
				this.events_min_players_mul = text2num(value);
			} else if (name === "minimal_access_threshold") {
				this.minimal_access_threshold = text2num(value);
			} else if (name === "jobs_have_minimal_access") {
				this.jobs_have_minimal_access = 1;
			} else if (name === "humans_need_surnames") {
				this.humans_need_surnames = 1;
			} else if (name === "force_random_names") {
				this.force_random_names = 1;
			} else if (name === "allow_ai") {
				this.allow_ai = 1;
			} else if (name === "disable_secborg") {
				this.forbid_secborg = 1;
			} else if (name === "disable_peaceborg") {
				this.forbid_peaceborg = 1;
			} else if (name === "silent_ai") {
				this.silent_ai = 1;
			} else if (name === "silent_borg") {
				this.silent_borg = 1;
			} else if (name === "sandbox_autoclose") {
				this.sandbox_autoclose = 1;
			} else if (name === "default_laws") {
				this.default_laws = text2num(value);
			} else if (name === "random_laws") {
				this.lawids += (law_id = lowertext(value));
			} else if (name === "law_weight") {
				if (rt.len(f, (L = splittext(value, ","))) != 2) {
					rt.op(f, "OutputReference", [rt.R.glob(112)], ["Invalid LAW_WEIGHT: " + t], false);
					continue;
				}
				lawid = rt.index(L, 1);
				weight = text2num(rt.index(L, 2));
				rt.setAt(this.law_weights, lawid, weight);
			} else if (name === "silicon_max_law_amount") {
				this.silicon_max_law_amount = text2num(value);
			} else if (name === "join_with_mutant_race") {
				this.mutant_races = 1;
			} else if (name === "roundstart_races") {
				race_id = lowertext(value);
				species_id = null;
				for (species_id of each(GLOB.species_list)) {
					if (species_id == race_id) {
						this.roundstart_races += rt.index(GLOB.species_list, species_id);
						rt.setAt(GLOB.roundstart_species, species_id, rt.index(GLOB.species_list, species_id));
					}
				}
			} else if (name === "join_with_mutant_humans") {
				this.mutant_humans = 1;
			} else if (name === "assistant_cap") {
				this.assistant_cap = text2num(value);
			} else if (name === "starlight") {
				this.starlight = 1;
			} else if (name === "grey_assistants") {
				this.grey_assistants = 1;
			} else if (name === "lavaland_budget") {
				this.lavaland_budget = text2num(value);
			} else if (name === "space_budget") {
				this.space_budget = text2num(value);
			} else if (name === "no_summon_guns") {
				this.no_summon_guns = 1;
			} else if (name === "no_summon_magic") {
				this.no_summon_magic = 1;
			} else if (name === "no_summon_events") {
				this.no_summon_events = 1;
			} else if (name === "reactionary_explosions") {
				this.reactionary_explosions = 1;
			} else if (name === "bombcap") {
				if (!(BombCap = text2num(value))) {
					continue;
				}
				if (BombCap < 4) {
					BombCap = 4;
				}
				GLOB.MAX_EX_DEVESTATION_RANGE = round(BombCap / 4);
				GLOB.MAX_EX_HEAVY_RANGE = round(BombCap / 2);
				GLOB.MAX_EX_LIGHT_RANGE = BombCap;
				GLOB.MAX_EX_FLASH_RANGE = BombCap;
				GLOB.MAX_EX_FLAME_RANGE = BombCap;
			} else if (name === "arrivals_shuttle_dock_window") {
				this.arrivals_shuttle_dock_window = max(25, text2num(value));
			} else if (name === "arrivals_shuttle_require_safe_latejoin") {
				this.arrivals_shuttle_require_safe_latejoin = 1;
			} else if (name === "mice_roundstart") {
				this.mice_roundstart = text2num(value);
			} else {
				rt.op(f, "OutputReference", [rt.R.glob(112)], [`Unknown setting in configuration: '${name}'`], false);
			}
		} else if (type == "policies") {
			rt.setAt(this.policies, name, value);
		}
	}
	this.fps = round(this.fps);
	if (!(this.fps <= 0)) return f.dot;
	this.fps = rt.initial(f, this, "fps");
	return f.dot;
});

// configuration.dm:801
rt.def("/datum/configuration/proc/loadmaplist", function loadmaplist(f: Frame, filename: Value) {
	let currentmap: Value = null, t: Value = null, pos: Value = null, command: Value = null, data: Value = null;
	let $e: any;
	let Lines: Value = rt.world().file2list(filename);
	for (t of each(Lines)) {
		if (!t) {
			continue;
		}
		if (rt.length((t = trim(t))) == 0) {
			continue;
		}
		if (copytext(t, 1, 2) == "#") {
			continue;
		}
		pos = findtext(t, " ");
		command = null;
		data = null;
		if (pos) {
			command = lowertext(copytext(t, 1, pos));
			data = copytext(t, pos + 1);
		} else {
			command = lowertext(t);
		}
		if (!command) {
			continue;
		}
		if (!currentmap && command != "map") {
			continue;
		}
		if (command === "map") {
			if ((currentmap = new_(T("/datum/map_config"), `_maps/${data}.json`)).defaulted) {
				log_world(`Failed to load map config for ${data}!`);
			}
		} else if (command === "minplayers" || command === "minplayer") {
			currentmap.config_min_users = text2num(data);
		} else if (command === "maxplayers" || command === "maxplayer") {
			currentmap.config_max_users = text2num(data);
		} else if (command === "weight" || command === "voteweight") {
			currentmap.voteweight = text2num(data);
		} else if (command === "default" || command === "defaultmap") {
			this.defaultmap = currentmap;
		} else if (command === "endmap") {
			rt.setAt(this.maplist, currentmap.map_name, currentmap);
			currentmap = null;
		} else if (command === "disabled") {
			currentmap = null;
		} else {
			rt.op(f, "OutputReference", [rt.R.glob(112)], [`Unknown command in map vote config: '${command}'`], false);
		}
	}
	return f.dot;
});

// configuration.dm:898
rt.def("/datum/configuration/proc/pick_mode", function* pick_mode(f: Frame, mode_name: Value) {
	let _T: Value = null, M: Value = null;
	for (_T of each(this.gamemode_cache)) {
		if ((M = (yield* new_(_T))).config_tag && M.config_tag == mode_name) {
			return M;
		}
		yield* qdel(M);
	}
	return (yield* new_(T("/datum/game_mode/extended")));
}, true);

// configuration.dm:906
rt.def("/datum/configuration/proc/get_runnable_modes", function* get_runnable_modes(f: Frame) {
	let _T: Value = null, M: Value = null;
	let runnable_modes: Value = (yield* new_(T("/list")));
	for (_T of each(this.gamemode_cache)) {
		if (!rt.isIn(f, (M = (yield* new_(_T))).config_tag, this.modes)) {
			yield* qdel(M);
			continue;
		}
		if (rt.index(this.probabilities, M.config_tag) <= 0) {
			yield* qdel(M);
			continue;
		}
		if (rt.index(this.min_pop, M.config_tag)) {
			M.required_players = rt.index(this.min_pop, M.config_tag);
		}
		if (rt.index(this.max_pop, M.config_tag)) {
			M.maximum_players = rt.index(this.max_pop, M.config_tag);
		}
		if (M.can_start()) {
			rt.setAt(runnable_modes, M, rt.index(this.probabilities, M.config_tag));
		}
	}
	return runnable_modes;
}, true);

// configuration.dm:926
rt.def("/datum/configuration/proc/get_runnable_midround_modes", function* get_runnable_midround_modes(f: Frame, crew: Value) {
	let _T: Value = null, M: Value = null;
	let runnable_modes: Value = (yield* new_(T("/list")));
	for (_T of each(this.gamemode_cache - GLOB.SSticker.mode.type)) {
		if (!rt.isIn(f, (M = (yield* new_(_T))).config_tag, this.modes)) {
			yield* qdel(M);
			continue;
		}
		if (rt.index(this.probabilities, M.config_tag) <= 0) {
			yield* qdel(M);
			continue;
		}
		if (rt.index(this.min_pop, M.config_tag)) {
			M.required_players = rt.index(this.min_pop, M.config_tag);
		}
		if (rt.index(this.max_pop, M.config_tag)) {
			M.maximum_players = rt.index(this.max_pop, M.config_tag);
		}
		if (M.required_players <= crew) {
			if (M.maximum_players >= 0 && M.maximum_players < crew) {
				continue;
			}
			rt.setAt(runnable_modes, M, rt.index(this.probabilities, M.config_tag));
		}
	}
	return runnable_modes;
}, true);

// configuration.dm:946
rt.def("/datum/configuration/proc/stat_entry", function* stat_entry(f: Frame) {
	if (!this.statclick) {
		this.statclick = (yield* new_(T("/obj/effect/statclick/debug"), null, "Edit", this));
	}
	stat(`${this.name}:`, this.statclick);
	return f.dot;
}, true);
