// Based on /tg/station's code/game/gamemodes/traitor/double_agents.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1086, "/datum/game_mode/traitor/internal_affairs", "/datum/game_mode/traitor", {
	name: "Internal Affairs",
	config_tag: "internal_affairs",
	required_players: 25,
	required_enemies: 5,
	recommended_enemies: 8,
	reroll_friendly: 0,
	announce_text: "There are Nanotrasen Internal Affairs Agents trying to kill each other!\n<span class='danger'>IAA</span>: Eliminate your targets and protect yourself!\n<span class='notice'>Crew</span>: Stop the IAA agents before they can cause too much mayhem.",
	traitor_name: "Nanotrasen Internal Affairs Agent",
	traitors_possible: 10,
	num_modifier: 4,
	antag_datum: rt.typePath("/datum/antagonist/traitor/internal_affairs"),
});

// double_agents.dm:26
rt.def("/datum/game_mode/traitor/internal_affairs/proc/post_setup", function* post_setup(f: Frame) {
	let traitor: Value = null;
	let i: Value = 0;
	for (traitor of each(this.pre_traitors, T("/datum/mind"))) {
		i++;
		if (i + 1 > rt.len(f, this.pre_traitors)) {
			i = 0;
		}
		rt.setAt(this.target_list, traitor, rt.index(this.pre_traitors, i + 1));
	}
	yield* parent_proc();
	return f.dot;
}, true);

// double_agents.dm:36
rt.def("/datum/game_mode/traitor/internal_affairs/proc/add_latejoin_traitor", function* add_latejoin_traitor(f: Frame, character: Value) {
	let i: Value = null, traitor: Value = null;
	this.check_potential_agents();
	if (rt.len(f, this.late_joining_list) >= rand(3, 4)) {
		shuffle_inplace(this.late_joining_list);
		this.target_list = list();
		i = 0;
		for (traitor of each(this.late_joining_list, T("/datum/mind"))) {
			i++;
			if (i + 1 > rt.len(f, this.late_joining_list)) {
				i = 0;
			}
			rt.setAt(this.target_list, traitor, rt.index(this.late_joining_list, i + 1));
			traitor.special_role = this.traitor_name;
		}
		traitor = null;
		for (traitor of each(this.target_list, T("/datum/mind"))) {
			yield* parent_proc(traitor);
		}
		this.late_joining_list = list();
	} else {
		this.late_joining_list += character;
	}
	return f.dot;
}, true);

// double_agents.dm:65
rt.def("/datum/game_mode/traitor/internal_affairs/proc/check_potential_agents", function check_potential_agents(f: Frame) {
	let M: Value = null, agent_mind: Value = null, H: Value = null;
	for (M of each(this.late_joining_list)) {
		if (rt.istype(M, T("/datum/mind"))) {
			if (rt.istype((agent_mind = M).current, T("/mob/living/carbon/human"))) {
				if ((H = agent_mind.current).stat != 2) {
					if (H.client) {
						continue;
					}
				}
			}
		}
		this.late_joining_list -= M;
	}
	return f.dot;
});
