// Based on /tg/station's code/game/gamemodes/game_mode.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


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

// game_mode.dm:24
rt.def("/datum/game_mode/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.antag_candidates = list();

	this.restricted_jobs = list();

	this.protected_jobs = list();

	this.station_goals = list();

	this.changelings = list();

	this.servants_of_ratvar = list();

	this.cult = list();

	this.cult_objectives = list();
	this.sintouched = list();
	this.devils = list();

	this.gangs = list();
	this.abductors = list();

	this.abductees = list();
	this.ape_infectees = list();
	this.syndicates = list();

	this.head_revolutionaries = list();

	this.revolutionaries = list();
	this.target_list = list();
	this.late_joining_list = list();
	this.traitors = list();
	this.wizards = list();
	this.apprentices = list();

	this.modePlayer = new_(T("/list"));
	return f.dot;
});

// game_mode.dm:50
rt.def("/datum/game_mode/proc/announce", function announce(f: Frame) {
	if (is_creative()) return f.dot; // tg_js: Creative starts quietly
	to_chat(rt.world(), `<b>The gamemode is: <span class='${this.announce_span}'>${this.name}</span>!</b>`);
	to_chat(rt.world(), `<b>${this.announce_text}</b>`);
	return f.dot;
});

// game_mode.dm:57
rt.def("/datum/game_mode/proc/can_start", function can_start(f: Frame) {
	let player: Value = null;
	let playerC: Value = 0;
	for (player of each(GLOB.player_list, T("/mob/dead/new_player"))) {
		if (player.client && player.ready == PLAYER_READY_TO_PLAY) {
			playerC++;
		}
	}
	if (!GLOB.Debug2) {
		if (playerC < this.required_players || this.maximum_players >= 0 && playerC > this.maximum_players) {
			return 0;
		}
	}
	this.antag_candidates = this.get_players_for_role(this.antag_flag);
	if (!GLOB.Debug2) {
		if (rt.len(f, this.antag_candidates) < this.required_enemies) {
			return 0;
		}
		return 1;
	} else {
		message_admins("<span class='notice'>DEBUG: GAME STARTING WITHOUT PLAYER NUMBER CHECKS, THIS WILL PROBABLY BREAK SHIT.</span>");
		return 1;
	}
});

// game_mode.dm:80
rt.def("/datum/game_mode/proc/post_setup", function* post_setup(f: Frame, report: Value) {
	if (!report) {
		report = GLOB.config.intercept;
	}
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/display_roundstart_logout_report"))), 6000);
	if (report && !is_creative()) { // tg_js: creative mode: no CentCom report (nor its blue alert)
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/game_mode/proc/send_intercept"), 0)), rand(600, 1800));
	}
	yield* this.generate_station_goals();
	return 1;
}, true);

// game_mode.dm:103
rt.def("/datum/game_mode/proc/make_antag_chance", function* make_antag_chance(f: Frame, character: Value) {
	if (this.replacementmode && this.round_converted == 2) {
		yield* this.replacementmode.make_antag_chance(character);
	}
	return f.dot;
}, true);

// game_mode.dm:111
rt.def("/datum/game_mode/proc/convert_roundtype", function* convert_roundtype(f: Frame) {
	let Player: Value = null, G: Value = null, H: Value = null;
	let $e: any;
	let living_crew: Value = list();
	for (Player of each(GLOB.mob_list, T("/mob"))) {
		if (Player.mind && Player.stat != 2 && !rt.istype(Player, T("/mob/dead/new_player")) && !rt.istype(Player, T("/mob/living/brain"))) {
			living_crew += Player;
		}
	}
	if (rt.len(f, living_crew) / rt.len(f, GLOB.joined_player_list) <= GLOB.config.midround_antag_life_check) {
		message_admins(`Convert_roundtype failed due to too many dead people. Limit is ${GLOB.config.midround_antag_life_check * 100}% living crew`);
		return null;
	}
	let runnable_modes: Value = (yield* GLOB.config.get_runnable_midround_modes(rt.len(f, living_crew)));
	let usable_modes: Value = list();
	for (G of each(runnable_modes, T("/datum/game_mode"))) {
		if (G.reroll_friendly) {
			usable_modes += G;
		} else {
			yield* qdel(G);
		}
	}
	if (!usable_modes) {
		message_admins("Convert_roundtype failed due to no valid modes to convert to. Please report this error to the Coders.");
		return null;
	}
	this.replacementmode = pickweight(usable_modes);
	if (GLOB.SSshuttle.emergency.mode === "stranded" || GLOB.SSshuttle.emergency.mode === "escape") {
		return 1;
	} else if (GLOB.SSshuttle.emergency.mode === "call") {
		if (GLOB.SSshuttle.emergency.timeLeft(1) < rt.initial(f, GLOB.SSshuttle, "emergencyCallTime") * 0.5) {
			return 1;
		}
	}
	if (rt.worldTime(f) >= GLOB.config.midround_antag_time_check * 600) {
		message_admins(`Convert_roundtype failed due to round length. Limit is ${GLOB.config.midround_antag_time_check} minutes.`);
		return null;
	}
	let antag_candidates: Value = list();
	for (H of each(living_crew, T("/mob/living/carbon/human"))) {
		if (H.client && H.client.prefs.allow_midround_antag) {
			antag_candidates += H;
		}
	}
	if (!antag_candidates) {
		message_admins("Convert_roundtype failed due to no antag candidates.");
		return null;
	}
	antag_candidates = shuffle(antag_candidates);
	if (GLOB.config.protect_roles_from_antagonist) {
		this.replacementmode.restricted_jobs += this.replacementmode.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		this.replacementmode.restricted_jobs += "Assistant";
	}
	message_admins(fmt("The roundtype will be converted. If you have other plans for the station or feel the station is too messed up to inhabit <A HREF='?_src_=holder;toggle_midround_antag=＃'>stop the creation of antags</A> or <A HREF='?_src_=holder;end_round=＃'>end the round now</A>.", [f.usr, f.usr]));
	f.dot = 1;
	yield* sleep(rand(600, 1800));
	if (!GLOB.SSticker.IsRoundInProgress()) {
		message_admins("Roundtype conversion cancelled, the game appears to have finished!");
		this.round_converted = 0;
		return f.dot;
	}
	if (!rt.index(GLOB.config.midround_antag, GLOB.SSticker.mode.config_tag)) {
		this.round_converted = 0;
		return 1;
	}
	H = null;
	for (H of each(antag_candidates, T("/mob/living/carbon/human"))) {
		yield* this.replacementmode.make_antag_chance(H);
	}
	this.round_converted = 2;
	message_admins(`-- IMPORTANT: The roundtype has been converted to ${this.replacementmode.name}, antagonists may have been created! --`);
	return f.dot;
}, true, { waitfor: false });

// game_mode.dm:186
rt.def("/datum/game_mode/proc/check_finished", function* check_finished(f: Frame, force_ending: Value) {
	let Player: Value = null;
	if (this.replacementmode && this.round_converted == 2) {
		return (yield* this.replacementmode.check_finished());
	}
	if (GLOB.SSshuttle.emergency && GLOB.SSshuttle.emergency.mode == "endgame: game over") {
		return 1;
	}
	if (this.station_was_nuked) {
		return 1;
	}
	if (!this.round_converted && (!rt.index(GLOB.config.continuous, this.config_tag) || rt.index(GLOB.config.continuous, this.config_tag) && rt.index(GLOB.config.midround_antag, this.config_tag))) {
		if (!this.continuous_sanity_checked) {
			for (Player of each(GLOB.mob_list, T("/mob"))) {
				if (Player.mind) {
					if (Player.mind.special_role) {
						this.continuous_sanity_checked = 1;
						return 0;
					}
				}
			}
			if (!this.continuous_sanity_checked) {
				message_admins(`The roundtype (${this.config_tag}) has no antagonists, continuous round has been defaulted to on and midround_antag has been defaulted to off.`);
				rt.setAt(GLOB.config.continuous, this.config_tag, 1);
				rt.setAt(GLOB.config.midround_antag, this.config_tag, 0);
				yield* GLOB.SSshuttle.clearHostileEnvironment(this);
				return 0;
			}
		}
		if (this.living_antag_player && this.living_antag_player.mind && rt.istype(this.living_antag_player, T("/mob/living")) && this.living_antag_player.stat != 2 && !rt.istype(this.living_antag_player, T("/mob/dead/new_player")) && !rt.istype(this.living_antag_player, T("/mob/living/brain"))) {
			return 0;
		}
		Player = null;
		for (Player of each(GLOB.living_mob_list, T("/mob"))) {
			if (Player.mind && Player.stat != 2 && !rt.istype(Player, T("/mob/dead/new_player")) && !rt.istype(Player, T("/mob/living/brain"))) {
				if (Player.mind.special_role) {
					this.living_antag_player = Player;
					return 0;
				}
			}
		}
		if (!rt.index(GLOB.config.continuous, this.config_tag) || force_ending) {
			return 1;
		} else {
			this.round_converted = (yield* this.convert_roundtype());
			if (!this.round_converted) {
				if (this.round_ends_with_antag_death) {
					return 1;
				} else {
					rt.setAt(GLOB.config.midround_antag, this.config_tag, 0);
					return 0;
				}
			}
		}
	}
	return 0;
}, true);

// game_mode.dm:239
rt.def("/datum/game_mode/proc/declare_completion", function declare_completion(f: Frame) {
	let M: Value = null;
	let clients: Value = 0;
	let surviving_humans: Value = 0;
	let surviving_total: Value = 0;
	let ghosts: Value = 0;
	let escaped_humans: Value = 0;
	let escaped_total: Value = 0;
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (M.client) {
			clients++;
			if (rt.istype(M, T("/mob/living/carbon/human"))) {
				if (!M.stat) {
					surviving_humans++;
					if (M.z == 1) {
						escaped_humans++;
					}
				}
			}
			if (!M.stat) {
				surviving_total++;
				if (M.z == 1) {
					escaped_total++;
				}
			}
			if (rt.istype(M, T("/mob/dead/observer"))) {
				ghosts++;
			}
		}
	}
	if (rt.len(f, this.cult) && !rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/cult"))) {
		this.datum_cult_completion();
	}
	return 0;
});

// game_mode.dm:280
rt.def("/datum/game_mode/proc/send_intercept", function* send_intercept(f: Frame) {
	let possible_modes: Value = null, i: Value = null, V: Value = null, G: Value = null;
	let $e: any;
	let intercepttext: Value = "<b><i>Central Command Status Summary</i></b><hr>";
	intercepttext += "<b>Central Command has intercepted and partially decoded a Syndicate transmission with vital information regarding their movements. The following report outlines the most likely threats to appear in your sector.</b>";
	(possible_modes = list()).Add("blob", "changeling", "clock_cult", "cult", "extended", "gang", "malf", "nuclear", "revolution", "traitor", "wizard");
	possible_modes -= this.name;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		possible_modes -= pick(possible_modes);
	}
	rt.endFor(f, 0);
	(possible_modes = rt.modify(possible_modes, this.name, rt.bitOr));
	possible_modes = shuffle(possible_modes);
	let i_text: Value = (yield* new_(T("/datum/intercept_text")));
	for (V of each(possible_modes)) {
		intercepttext += i_text.build(V);
	}
	if (rt.len(f, this.station_goals)) {
		intercepttext += `<hr><b>Special Orders for ${station_name()}:</b>`;
		for (G of each(this.station_goals, T("/datum/station_goal"))) {
			G.on_report();
			intercepttext += G.get_report();
		}
	}
	yield* print_command_report(intercepttext, "Central Command Status Summary", { announce: 0 });
	yield* priority_announce("A summary has been copied and printed to all communications consoles.", "Enemy communication intercepted. Security level elevated.", rt.rsc("sound/ai/intercept.ogg"));
	if (!(GLOB.security_level < 1)) return f.dot;
	set_security_level(1);
	return f.dot;
}, true);

// game_mode.dm:310
rt.def("/datum/game_mode/proc/get_players_for_role", function get_players_for_role(f: Frame, role: Value) {
	let applicant: Value = null, player: Value = null, job: Value = null;
	let players: Value = list();
	let candidates: Value = list();
	let drafted: Value = list();
	for (player of each(GLOB.player_list, T("/mob/dead/new_player"))) {
		if (player.client && player.ready == 1) {
			players += player;
		}
	}
	players = shuffle(players);
	player = null;
	for (player of each(players, T("/mob/dead/new_player"))) {
		if (player.client && player.ready == 1) {
			if (rt.isIn(f, role, player.client.prefs.be_special)) {
				if (!jobban_isbanned(player, "Syndicate") && !jobban_isbanned(player, role)) {
					candidates += player.mind;
				}
			}
		}
	}
	if (this.restricted_jobs) {
		player = null;
		for (player of each(candidates, T("/datum/mind"))) {
			job = null;
			for (job of each(this.restricted_jobs)) {
				if (player.assigned_role == job) {
					candidates -= player;
				}
			}
		}
	}
	if (rt.len(f, candidates) < this.recommended_enemies) {
		player = null;
		for (player of each(players, T("/mob/dead/new_player"))) {
			if (player.client && player.ready == 1) {
				if (!rt.isIn(f, role, player.client.prefs.be_special)) {
					if (!jobban_isbanned(player, "Syndicate") && !jobban_isbanned(player, role)) {
						drafted += player.mind;
					}
				}
			}
		}
	}
	if (this.restricted_jobs) {
		player = null;
		for (player of each(drafted, T("/datum/mind"))) {
			job = null;
			for (job of each(this.restricted_jobs)) {
				if (player.assigned_role == job) {
					drafted -= player;
				}
			}
		}
	}
	drafted = shuffle(drafted);
	while (rt.len(f, candidates) < this.recommended_enemies) {
		if (rt.len(f, drafted) > 0) {
			if (applicant = pick(drafted)) {
				candidates += applicant;
				drafted.Remove(applicant);
			}
		} else {
			break;
		}
	}
	if (this.restricted_jobs) {
		player = null;
		for (player of each(drafted, T("/datum/mind"))) {
			job = null;
			for (job of each(this.restricted_jobs)) {
				if (player.assigned_role == job) {
					drafted -= player;
				}
			}
		}
	}
	drafted = shuffle(drafted);
	while (rt.len(f, candidates) < this.recommended_enemies) {
		if (rt.len(f, drafted) > 0) {
			if (applicant = pick(drafted)) {
				candidates += applicant;
				drafted.Remove(applicant);
			}
		} else {
			break;
		}
	}
	return candidates;
});

// game_mode.dm:388
rt.def("/datum/game_mode/proc/num_players", function num_players(f: Frame) {
	let _P: Value = null;
	f.dot = 0;
	for (_P of each(GLOB.player_list, T("/mob/dead/new_player"))) {
		if (_P.client && _P.ready == PLAYER_READY_TO_PLAY) {
			f.dot++;
		}
	}
	return f.dot;
});

// game_mode.dm:396
rt.def("/datum/game_mode/proc/get_living_heads", function get_living_heads(f: Frame) {
	let player: Value = null;
	f.dot = list();
	for (player of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
		if (player.stat != 2 && player.mind && rt.isIn(f, player.mind.assigned_role, GLOB.command_positions)) {
			(f.dot = rt.modify(f.dot, player.mind, rt.bitOr));
		}
	}
	return f.dot;
});

// game_mode.dm:406
rt.def("/datum/game_mode/proc/get_all_heads", function get_all_heads(f: Frame) {
	let player: Value = null;
	f.dot = list();
	for (player of each(GLOB.mob_list, T("/mob"))) {
		if (player.mind && rt.isIn(f, player.mind.assigned_role, GLOB.command_positions)) {
			(f.dot = rt.modify(f.dot, player.mind, rt.bitOr));
		}
	}
	return f.dot;
});

// game_mode.dm:415
rt.def("/datum/game_mode/proc/get_living_sec", function get_living_sec(f: Frame) {
	let player: Value = null;
	f.dot = list();
	for (player of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
		if (player.stat != 2 && player.mind && rt.isIn(f, player.mind.assigned_role, GLOB.security_positions)) {
			(f.dot = rt.modify(f.dot, player.mind, rt.bitOr));
		}
	}
	return f.dot;
});

// game_mode.dm:424
rt.def("/datum/game_mode/proc/get_all_sec", function get_all_sec(f: Frame) {
	let player: Value = null;
	f.dot = list();
	for (player of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
		if (player.mind && rt.isIn(f, player.mind.assigned_role, GLOB.security_positions)) {
			(f.dot = rt.modify(f.dot, player.mind, rt.bitOr));
		}
	}
	return f.dot;
});

// game_mode.dm:433
rt.def("/proc/display_roundstart_logout_report", function display_roundstart_logout_report(f: Frame) {
	let L: Value = null, found: Value = null, C: Value = null, D: Value = null, M: Value = null;
	if (is_creative()) return null; // tg_js: Creative has no crew to report on
	let msg: Value = "<span class='boldnotice'>Roundstart logout report\n\n</span>";
	for (L of each(GLOB.mob_list, T("/mob/living"))) {
		if (L.ckey) {
			found = 0;
			C = null;
			for (C of each(GLOB.clients, T("/client"))) {
				if (C.ckey == L.ckey) {
					found = 1;
					break;
				}
			}
			if (!found) {
				msg += `<b>${L.name}</b> (${L.ckey}), the ${L.job} (<font color='#ffcc00'><b>Disconnected</b></font>)\n`;
			}
		}
		if (L.ckey && L.client) {
			if (L.client.inactivity >= 3000) {
				msg += `<b>${L.name}</b> (${L.ckey}), the ${L.job} (<font color='#ffcc00'><b>Connected, Inactive</b></font>)\n`;
				continue;
			}
			if (L.stat) {
				if (L.suiciding) {
					msg += `<b>${L.name}</b> (${L.ckey}), the ${L.job} (<span class='boldannounce'>Suicide</span>)\n`;
					continue;
				}
				if (L.stat == 1) {
					msg += `<b>${L.name}</b> (${L.ckey}), the ${L.job} (Dying)\n`;
					continue;
				}
				if (L.stat == 2) {
					msg += `<b>${L.name}</b> (${L.ckey}), the ${L.job} (Dead)\n`;
					continue;
				}
			}
			continue;
		}
		D = null;
		for (D of each(GLOB.mob_list, T("/mob/dead/observer"))) {
			if (D.mind && D.mind.current == L) {
				if (L.stat == 2) {
					if (L.suiciding) {
						msg += `<b>${L.name}</b> (${ckey(D.mind.key)}), the ${L.job} (<span class='boldannounce'>Suicide</span>)\n`;
						continue;
					}
					msg += `<b>${L.name}</b> (${ckey(D.mind.key)}), the ${L.job} (Dead)\n`;
					continue;
				} else {
					if (D.can_reenter_corpse) {
						continue;
					}
					msg += `<b>${L.name}</b> (${ckey(D.mind.key)}), the ${L.job} (<span class='boldannounce'>Ghosted</span>)\n`;
					continue;
				}
			}
		}
	}
	for (M of each(GLOB.mob_list, T("/mob"))) {
		if (M.client && M.client.holder) {
			to_chat(M, msg);
		}
	}
	return f.dot;
});

// game_mode.dm:485
rt.def("/datum/game_mode/proc/printplayer", function printplayer(f: Frame, ply: Value, fleecheck: Value) {
	let text: Value = `<br><b>${ply.key}</b> was <b>${ply.name}</b> the <b>${ply.assigned_role}</b> and`;
	if (ply.current) {
		if (ply.current.stat == 2) {
			text += " <span class='boldannounce'>died</span>";
		} else {
			text += " <span class='greenannounce'>survived</span>";
		}
		if (fleecheck && ply.current.z > 2) {
			text += " while <span class='boldannounce'>fleeing the station</span>";
		}
		if (ply.current.real_name != ply.name) {
			text += ` as <b>${ply.current.real_name}</b>`;
		}
	} else {
		text += " <span class='boldannounce'>had their body destroyed</span>";
	}
	return text;
});

// game_mode.dm:500
rt.def("/datum/game_mode/proc/printobjectives", function printobjectives(f: Frame, ply: Value) {
	let objective: Value = null;
	let text: Value = "";
	let count: Value = 1;
	for (objective of each(ply.objectives, T("/datum/objective"))) {
		if (objective.check_completion()) {
			text += `<br><b>Objective #${count}</b>: ${objective.explanation_text} <span class='greenannounce'>Success!</span>`;
		} else {
			text += `<br><b>Objective #${count}</b>: ${objective.explanation_text} <span class='boldannounce'>Fail.</span>`;
		}
		count++;
	}
	return text;
});

// game_mode.dm:530
rt.def("/datum/game_mode/proc/replace_jobbaned_player", function* replace_jobbaned_player(f: Frame, M: Value, role_type: Value, pref: Value) {
	let candidates: Value = (yield* pollCandidatesForMob(`Do you want to play as a ${role_type}?`, `${role_type}`, null, pref, 50, M));
	if (!rt.len(f, candidates)) return f.dot;
	let theghost: Value = pick(candidates);
	to_chat(M, "Your mob has been taken over by a ghost! Appeal your job ban if you want to avoid this in the future!");
	message_admins(`${key_name_admin(theghost)} has taken control of (${key_name_admin(M)}) to replace a jobbaned player.`);
	yield* M.ghostize(0);
	M.key = theghost.key;
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }, {  }, {  }] });

// game_mode.dm:540
rt.def("/datum/game_mode/proc/remove_antag_for_borging", function* remove_antag_for_borging(f: Frame, newborgie: Value) {
	yield* GLOB.SSticker.mode.remove_cultist(newborgie, 0, 0);
	yield* GLOB.SSticker.mode.remove_revolutionary(newborgie, 0);
	yield* GLOB.SSticker.mode.remove_gangster(newborgie, 0, { remove_bosses: 1 });
	return f.dot;
}, true);

// game_mode.dm:545
rt.def("/datum/game_mode/proc/generate_station_goals", function* generate_station_goals(f: Frame) {
	let _T: Value = null, G: Value = null, picked: Value = null;
	let possible: Value = list();
	for (_T of each(typesof(T("/datum/station_goal")) - T("/datum/station_goal"))) {
		G = _T;
		if (rt.isIn(f, this.config_tag, rt.initial(f, G, "gamemode_blacklist"))) {
			continue;
		}
		possible += _T;
	}
	let goal_weights: Value = 0;
	while (rt.len(f, possible) && goal_weights < STATION_GOAL_BUDGET) {
		goal_weights += rt.initial(f, (picked = pick_n_take(possible)), "weight");
		this.station_goals += (yield* new_(picked));
	}
	return f.dot;
}, true);

// game_mode.dm:559
rt.def("/datum/game_mode/proc/declare_station_goal_completion", function declare_station_goal_completion(f: Frame) {
	let V: Value = null, G: Value = null;
	for (V of each(this.station_goals)) {
		(G = V).print_result();
	}
	return f.dot;
});
