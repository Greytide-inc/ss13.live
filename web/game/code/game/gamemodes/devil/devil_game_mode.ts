// Based on /tg/station's code/game/gamemodes/devil/devil_game_mode.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// devil_game_mode.dm:22
rt.def("/datum/game_mode/devil/proc/pre_setup", function pre_setup(f: Frame) {
	let devil: Value = null;
	if (GLOB.config.protect_roles_from_antagonist) {
		this.restricted_jobs += this.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		this.restricted_jobs += "Assistant";
	}
	let num_devils: Value = 1;
	if (GLOB.config.traitor_scaling_coeff) {
		num_devils = max(this.minimum_devils, min(round(this.num_players() / (GLOB.config.traitor_scaling_coeff * 3)) + 2 + this.num_modifier, round(this.num_players() / (GLOB.config.traitor_scaling_coeff * 1.5)) + this.num_modifier));
	} else {
		num_devils = max(this.minimum_devils, min(this.num_players(), this.traitors_possible));
	}
	let j: Value = 0;
	while (j < num_devils) {
		if (!rt.len(f, this.antag_candidates)) {
			break;
		}
		this.devils += (devil = pick(this.antag_candidates));
		devil.special_role = this.traitor_name;
		devil.restricted_roles = this.restricted_jobs;
		log_game(`${devil.key} (ckey) has been selected as a ${this.traitor_name}`);
		this.antag_candidates.Remove(devil);
		j++;
	}
	if (rt.len(f, this.devils) < this.required_enemies) {
		return 0;
	}
	return 1;
});

// devil_game_mode.dm:51
rt.def("/datum/game_mode/devil/proc/post_setup", function* post_setup(f: Frame) {
	let devil: Value = null;
	for (devil of each(this.devils, T("/datum/mind"))) {
		yield* this.post_setup_finalize(devil);
	}
	this.modePlayer += this.devils;
	yield* parent_proc();
	return 1;
}, true);

// devil_game_mode.dm:58
rt.def("/datum/game_mode/devil/proc/post_setup_finalize", function* post_setup_finalize(f: Frame, devil: Value) {
	yield* add_devil(devil.current, { ascendable: 1 });
	yield* this.add_devil_objectives(devil, 2);
	return f.dot;
}, true);

// devil_game_mode.dm:62
rt.def("/proc/is_devil", function is_devil(f: Frame, M: Value) {
	return ((M && M.mind) && M.mind.has_antag_datum(T("/datum/antagonist/devil")));
});

// devil_game_mode.dm:65
rt.def("/proc/add_devil", function* add_devil(f: Frame, L: Value, ascendable: Value) {
	let devil_datum: Value = null;
	ascendable ??= 0;
	if (!L || !L.mind) {
		return 0;
	}
	(devil_datum = (yield* L.mind.add_antag_datum(T("/datum/antagonist/devil")))).ascendable = ascendable;
	return devil_datum;
}, true);

// devil_game_mode.dm:72
rt.def("/proc/remove_devil", function* remove_devil(f: Frame, L: Value) {
	let devil_datum: Value = null;
	if (!L || !L.mind) {
		return 0;
	}
	yield* (devil_datum = L.mind.has_antag_datum(T("/datum/antagonist/devil"))).on_removal();
	return 1;
}, true);
