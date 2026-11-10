// Based on /tg/station's code/game/gamemodes/devil/devil agent/devil_agent.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1090, "/datum/game_mode/devil/devil_agents", "/datum/game_mode/devil", {
	devil_target_list: null,
	devil_late_joining_list: null,
	name: "Devil Agents",
	config_tag: "devil_agents",
	required_players: 25,
	required_enemies: 3,
	recommended_enemies: 8,
	reroll_friendly: 0,
	traitors_possible: 10,
	num_modifier: 4,
	objective_count: 2,
	minimum_devils: 3,
	announce_text: "There are devil agents onboard the station, trying to outbid each other!\n+\t<span class='danger'>Devils</span>: Purchase souls and interfere with your rivals!\n+\t<span class='notice'>Crew</span>: Resist the lure of sin and remain pure!",
});

// devil_agent.dm:13
rt.def("/datum/game_mode/devil/devil_agents/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.devil_target_list = list();

	this.devil_late_joining_list = list();
	return f.dot;
});

// devil_agent.dm:23
rt.def("/datum/game_mode/devil/devil_agents/proc/post_setup", function* post_setup(f: Frame) {
	let devil: Value = null;
	let i: Value = 0;
	for (devil of each(this.devils, T("/datum/mind"))) {
		i++;
		if (i + 1 > rt.len(f, this.devils)) {
			i = 0;
		}
		rt.setAt(this.devil_target_list, devil, rt.index(this.devils, i + 1));
	}
	yield* parent_proc();
	return f.dot;
}, true);

// devil_agent.dm:31
rt.def("/datum/game_mode/devil/devil_agents/proc/add_devil_objectives", function* add_devil_objectives(f: Frame, devil_mind: Value, quantity: Value) {
	yield* parent_proc(devil_mind, quantity - this.give_outsell_objective(devil_mind));
	return f.dot;
}, true);

// devil_agent.dm:35
rt.def("/datum/game_mode/devil/devil_agents/proc/give_outsell_objective", function give_outsell_objective(f: Frame, devil: Value) {
	let target_mind: Value = null, outsellobjective: Value = null;
	if (rt.len(f, this.devil_target_list) && rt.index(this.devil_target_list, devil)) {
		target_mind = rt.index(this.devil_target_list, devil);
		(outsellobjective = new_(T("/datum/objective/devil/outsell"))).owner = devil;
		outsellobjective.target = target_mind;
		outsellobjective.update_explanation_text();
		devil.objectives += outsellobjective;
		return 1;
	}
	return 0;
});
