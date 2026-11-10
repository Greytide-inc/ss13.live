// Based on /tg/station's code/game/gamemodes/traitor/traitor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1084, "/datum/game_mode/traitor", "/datum/game_mode", {
	pre_traitors: null,
	traitors_possible: 4,
	num_modifier: 0,
	antag_datum: rt.typePath("/datum/antagonist/traitor"),
	name: "traitor",
	config_tag: "traitor",
	antag_flag: "traitor",
	restricted_jobs: null,
	protected_jobs: null,
	required_players: 0,
	required_enemies: 1,
	recommended_enemies: 4,
	reroll_friendly: 1,
	announce_span: "danger",
	announce_text: "There are Syndicate agents on the station!\n<span class='danger'>Traitors</span>: Accomplish your objectives.\n<span class='notice'>Crew</span>: Do not let the traitors succeed!",
});

// traitor.dm:12
rt.def("/datum/game_mode/traitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_jobs = list("Cyborg");
	this.protected_jobs = list("Security Officer", "Warden", "Detective", "Head of Security", "Captain");

	this.pre_traitors = list();
	return f.dot;
});

// traitor.dm:33
rt.def("/datum/game_mode/traitor/proc/pre_setup", function pre_setup(f: Frame) {
	let traitor: Value = null;
	if (GLOB.config.protect_roles_from_antagonist) {
		this.restricted_jobs += this.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		this.restricted_jobs += "Assistant";
	}
	let num_traitors: Value = 1;
	if (GLOB.config.traitor_scaling_coeff) {
		num_traitors = max(1, min(round(this.num_players() / (GLOB.config.traitor_scaling_coeff * 2)) + 2 + this.num_modifier, round(this.num_players() / GLOB.config.traitor_scaling_coeff) + this.num_modifier));
	} else {
		num_traitors = max(1, min(this.num_players(), this.traitors_possible));
	}
	let j: Value = 0;
	while (j < num_traitors) {
		if (!rt.len(f, this.antag_candidates)) {
			break;
		}
		this.pre_traitors += (traitor = pick(this.antag_candidates));
		traitor.special_role = this.traitor_name;
		traitor.restricted_roles = this.restricted_jobs;
		log_game(`${traitor.key} (ckey) has been selected as a ${this.traitor_name}`);
		this.antag_candidates.Remove(traitor);
		j++;
	}
	if (rt.len(f, this.pre_traitors) < this.required_enemies) {
		return 0;
	}
	return 1;
});

// traitor.dm:63
rt.def("/datum/game_mode/traitor/proc/post_setup", function* post_setup(f: Frame) {
	let traitor: Value = null;
	for (traitor of each(this.pre_traitors, T("/datum/mind"))) {
		rt.spawnTail(f, rand(10, 100), "/datum/game_mode/traitor/proc/post_setup: spawn at game/gamemodes/traitor/traitor.dm:63", traitor);
	}
	if (!this.exchange_blue) {
		this.exchange_blue = -1;
	}
	this.modePlayer += this.traitors;
	yield* parent_proc();
	return 1;
}, true);

// a spawn((yield* g.call(f, P("/proc/rand"), null, [10, 100]))) body of /datum/game_mode/traitor/proc/post_setup, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/game_mode/traitor/proc/post_setup: spawn at game/gamemodes/traitor/traitor.dm:63", function* (f: Frame, traitor: Value) {
	yield* traitor.add_antag_datum(this.antag_datum);
	return null;
});

// traitor.dm:73
rt.def("/datum/game_mode/traitor/proc/make_antag_chance", function* make_antag_chance(f: Frame, character: Value) {
	let traitorcap: Value = min(round(rt.len(f, GLOB.joined_player_list) / (GLOB.config.traitor_scaling_coeff * 2)) + 2 + this.num_modifier, round(rt.len(f, GLOB.joined_player_list) / GLOB.config.traitor_scaling_coeff) + this.num_modifier);
	if (rt.len(f, GLOB.SSticker.mode.traitors) >= traitorcap) {
		return f.dot;
	}
	if (!(rt.len(f, GLOB.SSticker.mode.traitors) <= traitorcap - 2 || prob(100 / (GLOB.config.traitor_scaling_coeff * 2)))) return f.dot;
	if (!rt.isIn(f, "traitor", character.client.prefs.be_special)) return f.dot;
	if (!(!jobban_isbanned(character, "traitor") && !jobban_isbanned(character, "Syndicate"))) return f.dot;
	if (rt.isIn(f, character.job, this.restricted_jobs)) return f.dot;
	yield* this.add_latejoin_traitor(character.mind);
	return f.dot;
}, true);

// traitor.dm:84
rt.def("/datum/game_mode/traitor/proc/add_latejoin_traitor", function* add_latejoin_traitor(f: Frame, character: Value) {
	yield* character.add_antag_datum(this.antag_datum);
	return f.dot;
}, true);

// traitor.dm:89
rt.def("/datum/game_mode/traitor/proc/declare_completion", function declare_completion(f: Frame) {
	parent_proc();
	return f.dot;
});

// traitor.dm:94
rt.def("/datum/game_mode/proc/auto_declare_completion_traitor", function auto_declare_completion_traitor(f: Frame) {
	let text: Value = null, traitor: Value = null, traitorwin: Value = null, TC_uses: Value = null, uplink_true: Value = null, purchases: Value = null, H: Value = null, objectives: Value = null, count: Value = null, objective: Value = null, special_role_text: Value = null;
	if (rt.len(f, this.traitors)) {
		text = `<br><font size=3><b>The ${this.traitor_name}s were:</b></font>`;
		for (traitor of each(this.traitors, T("/datum/mind"))) {
			traitorwin = 1;
			text += this.printplayer(traitor);
			TC_uses = 0;
			uplink_true = 0;
			purchases = "";
			H = null;
			for (H of each(GLOB.uplinks, T("/obj/item/device/uplink"))) {
				if (H && H.owner && H.owner == traitor.key) {
					TC_uses += H.spent_telecrystals;
					uplink_true = 1;
					purchases += H.purchase_log;
				}
			}
			objectives = "";
			if (rt.len(f, traitor.objectives)) {
				count = 1;
				objective = null;
				for (objective of each(traitor.objectives, T("/datum/objective"))) {
					if (objective.check_completion()) {
						objectives += `<br><B>Objective #${count}</B>: ${objective.explanation_text} <font color='green'><B>Success!</B></font>`;
					} else {
						objectives += `<br><B>Objective #${count}</B>: ${objective.explanation_text} <font color='red'>Fail.</font>`;
						traitorwin = 0;
					}
					count++;
				}
			}
			if (uplink_true) {
				text += ` (used ${TC_uses} TC) ${purchases}`;
				if (TC_uses == 0 && traitorwin) {
					text += `<BIG>${bicon(GLOB.badass)}</BIG>`;
				}
			}
			text += objectives;
			special_role_text = null;
			if (traitor.special_role) {
				special_role_text = lowertext(traitor.special_role);
			} else {
				special_role_text = "antagonist";
			}
			if (traitorwin) {
				text += `<br><font color='green'><B>The ${special_role_text} was successful!</B></font>`;
			} else {
				text += `<br><font color='red'><B>The ${special_role_text} has failed!</B></font>`;
			}
			text += "<br>";
		}
		text += `<br><b>The code phrases were:</b> <font color='red'>${GLOB.syndicate_code_phrase}</font><br><b>The code responses were:</b> <font color='red'>${GLOB.syndicate_code_response}</font><br>`;
		to_chat(rt.world(), text);
	}
	return 1;
});

// traitor.dm:157
rt.def("/datum/game_mode/proc/update_traitor_icons_added", function update_traitor_icons_added(f: Frame, traitor_mind: Value) {
	let traitorhud: Value = null;
	(traitorhud = rt.index(GLOB.huds, ANTAG_HUD_TRAITOR)).join_hud(traitor_mind.current);
	this.set_antag_hud(traitor_mind.current, "traitor");
	return f.dot;
});

// traitor.dm:162
rt.def("/datum/game_mode/proc/update_traitor_icons_removed", function update_traitor_icons_removed(f: Frame, traitor_mind: Value) {
	let traitorhud: Value = null;
	(traitorhud = rt.index(GLOB.huds, ANTAG_HUD_TRAITOR)).leave_hud(traitor_mind.current);
	this.set_antag_hud(traitor_mind.current, null);
	return f.dot;
});
