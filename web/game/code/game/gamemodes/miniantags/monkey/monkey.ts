// Based on /tg/station's code/game/gamemodes/miniantags/monkey/monkey.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1096, "/datum/game_mode/monkey", "/datum/game_mode", {
	carriers_to_make: 1,
	carriers: null,
	monkeys_to_win: 1,
	escaped_monkeys: 0,
	players_per_carrier: 30,
	name: "monkey",
	config_tag: "monkey",
	antag_flag: "monkey",
	required_players: 20,
	required_enemies: 1,
	recommended_enemies: 1,
	restricted_jobs: null,
});

// monkey.dm:16
rt.def("/datum/game_mode/monkey/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_jobs = list("Cyborg", "AI");

	this.carriers = list();
	return f.dot;
});

// monkey.dm:25
rt.def("/datum/game_mode/monkey/proc/pre_setup", function pre_setup(f: Frame) {
	let carrier: Value = null;
	this.carriers_to_make = max(round(this.num_players() / this.players_per_carrier, 1), 1);
	let j: Value = 0;
	while (j < this.carriers_to_make) {
		if (!rt.len(f, this.antag_candidates)) {
			break;
		}
		this.carriers += (carrier = pick(this.antag_candidates));
		carrier.special_role = "monkey";
		carrier.restricted_roles = this.restricted_jobs;
		log_game(`${carrier.key} (ckey) has been selected as a Jungle Fever carrier`);
		this.antag_candidates -= carrier;
		j++;
	}
	if (!rt.len(f, this.carriers)) {
		return 0;
	}
	return 1;
});

// monkey.dm:43
rt.def("/datum/game_mode/monkey/proc/announce", function announce(f: Frame) {
	to_chat(rt.world(), "<B>The current game mode is - Monkey!</B>");
	to_chat(rt.world(), "<B>One or more crewmembers have been infected with Jungle Fever! Crew: Contain the outbreak. None of the infected monkeys may escape alive to Centcom. Monkeys: Ensure that your kind lives on! Rise up against your captors!</B>");
	return f.dot;
});

// monkey.dm:49
rt.def("/datum/game_mode/monkey/proc/greet_carrier", function greet_carrier(f: Frame, carrier: Value) {
	to_chat(carrier.current, "<B><span class='notice'>You are the Jungle Fever patient zero!!</B>");
	to_chat(carrier.current, "<b>You have been planted onto this station by the Animal Rights Consortium.</b>");
	to_chat(carrier.current, "<b>Soon the disease will transform you into an ape. Afterwards, you will be able spread the infection to others with a bite.</b>");
	to_chat(carrier.current, "<b>While your infection strain is undetectable by scanners, any other infectees will show up on medical equipment.</b>");
	to_chat(carrier.current, "<b>Your mission will be deemed a success if any of the live infected monkeys reach Centcom.</b>");
	return f.dot;
});

// monkey.dm:57
rt.def("/datum/game_mode/monkey/proc/post_setup", function* post_setup(f: Frame) {
	let carriermind: Value = null, D: Value = null;
	for (carriermind of each(this.carriers, T("/datum/mind"))) {
		this.greet_carrier(carriermind);
		this.ape_infectees += carriermind;
		(D = (yield* new_(T("/datum/disease/transformation/jungle_fever")))).visibility_flags = 3;
		D.holder = carriermind.current;
		D.affected_mob = carriermind.current;
		carriermind.current.viruses += D;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// monkey.dm:69
rt.def("/datum/game_mode/monkey/proc/check_finished", function* check_finished(f: Frame) {
	let monkey_mind: Value = null, D: Value = null, H: Value = null;
	if (GLOB.SSshuttle.emergency.mode == "endgame: game over" || this.station_was_nuked) {
		return 1;
	}
	if (!this.round_converted) {
		for (monkey_mind of each(this.ape_infectees, T("/datum/mind"))) {
			this.continuous_sanity_checked = 1;
			if (monkey_mind.current && monkey_mind.current.stat != 2) {
				return 0;
			}
		}
		D = (yield* new_(T("/datum/disease/transformation/jungle_fever")));
		for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
			if (H.mind && H.stat != 2) {
				if (yield* H.HasDisease(D)) {
					return 0;
				}
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// monkey.dm:87
rt.def("/datum/game_mode/monkey/proc/check_monkey_victory", function* check_monkey_victory(f: Frame) {
	let M: Value = null;
	if (GLOB.SSshuttle.emergency.mode != "endgame: game over") {
		return 0;
	}
	let D: Value = (yield* new_(T("/datum/disease/transformation/jungle_fever")));
	for (M of each(GLOB.living_mob_list, T("/mob/living/carbon/monkey"))) {
		if (yield* M.HasDisease(D)) {
			if (M.onCentcom() || M.onSyndieBase()) {
				this.escaped_monkeys++;
			}
		}
	}
	if (this.escaped_monkeys >= this.monkeys_to_win) {
		return 1;
	} else {
		return 0;
	}
}, true);

// monkey.dm:100
rt.def("/datum/game_mode/proc/add_monkey", function add_monkey(f: Frame, monkey_mind: Value) {
	(rt.modSrcVar(f, "ape_infectees", monkey_mind, rt.bitOr));
	monkey_mind.special_role = "Infected Monkey";
	return f.dot;
});

// monkey.dm:104
rt.def("/datum/game_mode/proc/remove_monkey", function remove_monkey(f: Frame, monkey_mind: Value) {
	this.ape_infectees.Remove(monkey_mind);
	monkey_mind.special_role = null;
	return f.dot;
});

// monkey.dm:109
rt.def("/datum/game_mode/monkey/proc/declare_completion", function* declare_completion(f: Frame) {
	if (yield* this.check_monkey_victory()) {
		GLOB.SSticker.mode_result = "win - monkey win";
		to_chat(rt.world(), "<span class='userdanger'>The monkeys have overthrown their captors! Eeek eeeek!!</span>");
	} else {
		GLOB.SSticker.mode_result = "loss - staff stopped the monkeys";
		to_chat(rt.world(), "<span class='userdanger'>The staff managed to contain the monkey infestation!</span>");
	}
	return f.dot;
}, true);
