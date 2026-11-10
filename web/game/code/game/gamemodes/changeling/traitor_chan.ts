// Based on /tg/station's code/game/gamemodes/changeling/traitor_chan.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1085, "/datum/game_mode/traitor/changeling", "/datum/game_mode/traitor", {
	possible_changelings: null,
	changeling_amount: 1,
	name: "traitor+changeling",
	config_tag: "traitorchan",
	restricted_jobs: null,
	required_players: 25,
	required_enemies: 1,
	recommended_enemies: 3,
	reroll_friendly: 1,
	traitors_possible: 3,
}, { const: ["changeling_amount"] });

// traitor_chan.dm:11
rt.def("/datum/game_mode/traitor/changeling/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_jobs = list("AI", "Cyborg");

	this.possible_changelings = list();
	return f.dot;
});

// traitor_chan.dm:15
rt.def("/datum/game_mode/traitor/changeling/proc/announce", function announce(f: Frame) {
	to_chat(rt.world(), "<B>The current game mode is - Traitor+Changeling!</B>");
	to_chat(rt.world(), "<B>There are alien creatures on the station along with some syndicate operatives out for their own gain! Do not let the changelings or the traitors succeed!</B>");
	return f.dot;
});

// traitor_chan.dm:19
rt.def("/datum/game_mode/traitor/changeling/proc/can_start", function can_start(f: Frame) {
	if (!parent_proc()) {
		return 0;
	}
	this.possible_changelings = this.get_players_for_role("changeling");
	if (rt.len(f, this.possible_changelings) < this.required_enemies) {
		return 0;
	}
	return 1;
});

// traitor_chan.dm:27
rt.def("/datum/game_mode/traitor/changeling/proc/pre_setup", function pre_setup(f: Frame) {
	let j: Value = null, changeling: Value = null;
	if (GLOB.config.protect_roles_from_antagonist) {
		this.restricted_jobs += this.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		this.restricted_jobs += "Assistant";
	}
	let possible_changelings: Value = this.get_players_for_role("changeling");
	let num_changelings: Value = 1;
	if (GLOB.config.changeling_scaling_coeff) {
		num_changelings = max(1, min(round(this.num_players() / (GLOB.config.changeling_scaling_coeff * 4)) + 2, round(this.num_players() / (GLOB.config.changeling_scaling_coeff * 2))));
	} else {
		num_changelings = max(1, min(this.num_players(), 0.5));
	}
	if (rt.len(f, possible_changelings) > 0) {
		j = 0;
		while (j < num_changelings) {
			if (!rt.len(f, possible_changelings)) {
				break;
			}
			this.antag_candidates -= (changeling = pick(possible_changelings));
			possible_changelings -= changeling;
			changeling.special_role = "Changeling";
			this.changelings += changeling;
			changeling.restricted_roles = this.restricted_jobs;
			j++;
		}
		return parent_proc();
	}
	return 0;
});

// traitor_chan.dm:56
rt.def("/datum/game_mode/traitor/changeling/proc/post_setup", function* post_setup(f: Frame) {
	let changeling: Value = null;
	this.modePlayer += this.changelings;
	for (changeling of each(this.changelings, T("/datum/mind"))) {
		yield* changeling.current.make_changeling();
		yield* this.forge_changeling_objectives(changeling);
		yield* this.greet_changeling(changeling);
		GLOB.SSticker.mode.update_changeling_icons_added(changeling);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// traitor_chan.dm:66
rt.def("/datum/game_mode/traitor/changeling/proc/make_antag_chance", function* make_antag_chance(f: Frame, character: Value) {
	let changelingcap: Value = min(round(rt.len(f, GLOB.joined_player_list) / (GLOB.config.changeling_scaling_coeff * 4)) + 2, round(rt.len(f, GLOB.joined_player_list) / (GLOB.config.changeling_scaling_coeff * 2)));
	if (rt.len(f, GLOB.SSticker.mode.changelings) >= changelingcap) {
		yield* parent_proc();
		return f.dot;
	}
	if (rt.len(f, GLOB.SSticker.mode.changelings) <= changelingcap - 2 || prob(100 / (GLOB.config.changeling_scaling_coeff * 4))) {
		if (rt.isIn(f, "changeling", character.client.prefs.be_special)) {
			if (!jobban_isbanned(character, "changeling") && !jobban_isbanned(character, "Syndicate")) {
				if (!rt.isIn(f, character.job, this.restricted_jobs)) {
					yield* character.mind.make_Changling();
				}
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);
