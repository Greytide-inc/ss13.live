// Based on /tg/station's code/game/gamemodes/miniantags/abduction/abduction.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1095, "/datum/game_mode/abduction", "/datum/game_mode", {
	max_teams: 4,
	scientists: null,
	agents: null,
	team_objectives: null,
	team_names: null,
	finished: 0,
	name: "abduction",
	config_tag: "abduction",
	antag_flag: "abductor",
	recommended_enemies: 2,
	required_players: 15,
	maximum_players: 50,
	abductor_teams: 1,
});

// abduction.dm:15
rt.def("/datum/game_mode/abduction/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.scientists = list();

	this.agents = list();

	this.team_objectives = list();

	this.team_names = list();
	return f.dot;
});

// abduction.dm:22
rt.def("/datum/game_mode/abduction/proc/announce", function announce(f: Frame) {
	to_chat(rt.world(), "<B>The current game mode is - Abduction!</B>");
	to_chat(rt.world(), `There are alien <b>abductors</b> sent to ${station_name()} to perform nefarious experiments!`);
	to_chat(rt.world(), "<b>Abductors</b> - kidnap the crew and replace their organs with experimental ones.");
	to_chat(rt.world(), "<b>Crew</b> - don't get abducted and stop the abductors.");
	return f.dot;
});

// abduction.dm:28
rt.def("/datum/game_mode/abduction/proc/pre_setup", function pre_setup(f: Frame) {
	this.abductor_teams = max(1, min(this.max_teams, round(this.num_players() / GLOB.config.abductor_scaling_coeff)));
	let possible_teams: Value = max(1, round(rt.len(f, this.antag_candidates) / 2));
	this.abductor_teams = min(this.abductor_teams, possible_teams);
	this.abductors.len = 2 * this.abductor_teams;
	this.scientists.len = this.abductor_teams;
	this.agents.len = this.abductor_teams;
	this.team_objectives.len = this.abductor_teams;
	this.team_names.len = this.abductor_teams;
	let i: Value = 1;
	while (i <= this.abductor_teams) {
		if (!this.make_abductor_team(i)) {
			return 0;
		}
		i++;
	}
	return 1;
});

// abduction.dm:46
rt.def("/datum/game_mode/abduction/proc/make_abductor_team", function make_abductor_team(f: Frame, team_number: Value, preset_agent: Value, preset_scientist: Value) {
	let team_objective: Value = null, scientist: Value = null, agent: Value = null;
	rt.setAt(this.team_names, team_number, `Mothership ${pick(GLOB.possible_changeling_IDs)}`);
	(team_objective = new_(T("/datum/objective/experiment"))).team = team_number;
	rt.setAt(this.team_objectives, team_number, team_objective);
	if (!preset_agent || !preset_scientist) {
		if (rt.len(f, this.antag_candidates) <= 2) {
			return 0;
		}
	}
	if (!preset_scientist) {
		this.antag_candidates -= (scientist = pick(this.antag_candidates));
	} else {
		scientist = preset_scientist;
	}
	if (!preset_agent) {
		this.antag_candidates -= (agent = pick(this.antag_candidates));
	} else {
		agent = preset_agent;
	}
	scientist.assigned_role = "abductor scientist";
	scientist.special_role = "abductor scientist";
	log_game(`${scientist.key} (ckey) has been selected as an abductor team ${team_number} scientist.`);
	agent.assigned_role = "abductor agent";
	agent.special_role = "abductor agent";
	log_game(`${agent.key} (ckey) has been selected as an abductor team ${team_number} agent.`);
	(rt.modSrcVar(f, "abductors", agent, rt.bitOr));
	(rt.modSrcVar(f, "abductors", scientist, rt.bitOr));
	rt.setAt(this.scientists, team_number, scientist);
	rt.setAt(this.agents, team_number, agent);
	return 1;
});

// abduction.dm:88
rt.def("/datum/game_mode/abduction/proc/post_setup", function* post_setup(f: Frame) {
	let team_number: Value = 1;
	while (team_number <= this.abductor_teams) {
		yield* this.post_setup_team(team_number);
		team_number++;
	}
	return (yield* parent_proc());
}, true);

// abduction.dm:94
rt.def("/datum/game_mode/abduction/proc/post_setup_team", function* post_setup_team(f: Frame, team_number: Value) {
	let A: Value = null, agent: Value = null, scientist: Value = null, S: Value = null;
	let agent_landmarks: Value = list();
	let scientist_landmarks: Value = list();
	agent_landmarks.len = this.max_teams;
	scientist_landmarks.len = this.max_teams;
	for (A of each(GLOB.landmarks_list, T("/obj/effect/landmark/abductor"))) {
		if (rt.istype(A, T("/obj/effect/landmark/abductor/agent"))) {
			rt.setAt(agent_landmarks, text2num(A.team), A);
		} else if (rt.istype(A, T("/obj/effect/landmark/abductor/scientist"))) {
			rt.setAt(scientist_landmarks, text2num(A.team), A);
		}
	}
	let team_name: Value = rt.index(this.team_names, team_number);
	let H: Value = (agent = rt.index(this.agents, team_number)).current;
	let L: Value = rt.index(agent_landmarks, team_number);
	yield* H.forceMove(L.loc);
	yield* H.set_species(T("/datum/species/abductor"));
	(S = H.dna.species).team = team_number;
	H.real_name = team_name + " Agent";
	yield* H.equipOutfit(T("/datum/outfit/abductor/agent"));
	this.greet_agent(agent, team_number);
	H = (scientist = rt.index(this.scientists, team_number)).current;
	L = rt.index(scientist_landmarks, team_number);
	yield* H.forceMove(L.loc);
	yield* H.set_species(T("/datum/species/abductor"));
	(S = H.dna.species).scientist = 1;
	S.team = team_number;
	H.real_name = team_name + " Scientist";
	yield* H.equipOutfit(T("/datum/outfit/abductor/scientist"));
	this.greet_scientist(scientist, team_number);
	return f.dot;
}, true);

// abduction.dm:139
rt.def("/datum/game_mode/abduction/proc/greet_agent", function greet_agent(f: Frame, abductor: Value, team_number: Value) {
	abductor.objectives += rt.index(this.team_objectives, team_number);
	let team_name: Value = rt.index(this.team_names, team_number);
	to_chat(abductor.current, `<span class='notice'>You are an agent of ${team_name}!</span>`);
	to_chat(abductor.current, "<span class='notice'>With the help of your teammate, kidnap and experiment on station crew members!</span>");
	to_chat(abductor.current, "<span class='notice'>Use your stealth technology and equipment to incapacitate humans for your scientist to retrieve.</span>");
	abductor.announce_objectives();
	return f.dot;
});

// abduction.dm:149
rt.def("/datum/game_mode/abduction/proc/greet_scientist", function greet_scientist(f: Frame, abductor: Value, team_number: Value) {
	abductor.objectives += rt.index(this.team_objectives, team_number);
	let team_name: Value = rt.index(this.team_names, team_number);
	to_chat(abductor.current, `<span class='notice'>You are a scientist of ${team_name}!</span>`);
	to_chat(abductor.current, "<span class='notice'>With the help of your teammate, kidnap and experiment on station crew members!</span>");
	to_chat(abductor.current, "<span class='notice'>Use your tool and ship consoles to support the agent and retrieve human specimens.</span>");
	abductor.announce_objectives();
	return f.dot;
});

// abduction.dm:159
rt.def("/datum/game_mode/abduction/proc/get_team_console", function get_team_console(f: Frame, team_number: Value) {
	let C: Value = null;
	for (C of each(GLOB.machines, T("/obj/machinery/abductor/console"))) {
		if (C.team == team_number) {
			return C;
		}
	}
	return f.dot;
});

// abduction.dm:164
rt.def("/datum/game_mode/abduction/proc/check_finished", function* check_finished(f: Frame) {
	let team_number: Value = null, con: Value = null, objective: Value = null;
	if (!this.finished) {
		team_number = 1;
		while (team_number <= this.abductor_teams) {
			con = this.get_team_console(team_number);
			objective = rt.index(this.team_objectives, team_number);
			if (con.experiment.points >= objective.target_amount) {
				yield* GLOB.SSshuttle.emergency.request(null, { set_coefficient: 0.5 });
				this.finished = 1;
				return (yield* parent_proc());
			}
			team_number++;
		}
	}
	return (yield* parent_proc());
}, true);

// abduction.dm:175
rt.def("/datum/game_mode/abduction/proc/declare_completion", function declare_completion(f: Frame) {
	let console: Value = null, objective: Value = null, team_name: Value = null;
	let team_number: Value = 1;
	while (team_number <= this.abductor_teams) {
		console = this.get_team_console(team_number);
		objective = rt.index(this.team_objectives, team_number);
		team_name = rt.index(this.team_names, team_number);
		if (console.experiment.points >= objective.target_amount) {
			to_chat(rt.world(), `<span class='greenannounce'>${team_name} team fulfilled its mission!</span>`);
		} else {
			to_chat(rt.world(), `<span class='boldannounce'>${team_name} team failed its mission.</span>`);
		}
		team_number++;
	}
	parent_proc();
	return 1;
});

// abduction.dm:187
rt.def("/datum/game_mode/proc/auto_declare_completion_abduction", function auto_declare_completion_abduction(f: Frame) {
	let abductor_mind: Value = null, abductee_mind: Value = null;
	let text: Value = "";
	if (rt.len(f, this.abductors)) {
		text += "<br><span class='big'><b>The abductors were:</b></span>";
		for (abductor_mind of each(this.abductors, T("/datum/mind"))) {
			text += this.printplayer(abductor_mind);
			text += this.printobjectives(abductor_mind);
		}
		text += "<br>";
		if (rt.len(f, this.abductees)) {
			text += "<br><span class='big'><b>The abductees were:</b></span>";
			for (abductee_mind of each(this.abductees, T("/datum/mind"))) {
				text += this.printplayer(abductee_mind);
				text += this.printobjectives(abductee_mind);
			}
		}
	}
	text += "<br>";
	to_chat(rt.world(), text);
	return f.dot;
});

rt.type(1148, "/datum/objective/experiment", "/datum/objective", {
	team: null,
	dangerrating: 10,
	target_amount: 6,
});

// abduction.dm:218
rt.def("/datum/objective/experiment/proc/New", function New(f: Frame) {
	this.explanation_text = `Experiment on ${this.target_amount} humans.`;
	return f.dot;
});

// abduction.dm:221
rt.def("/datum/objective/experiment/proc/check_completion", function check_completion(f: Frame) {
	let H: Value = null, S: Value = null, E: Value = null;
	let ab_team: Value = this.team;
	if (this.owner) {
		if (!this.owner.current || !rt.istype(this.owner.current, T("/mob/living/carbon/human"))) {
			return 0;
		}
		if ((H = this.owner.current).dna.species.id != "abductor") {
			return 0;
		}
		ab_team = (S = H.dna.species).team;
	}
	for (E of each(GLOB.machines, T("/obj/machinery/abductor/experiment"))) {
		if (E.team == ab_team) {
			if (E.points >= this.target_amount) {
				return 1;
			} else {
				return 0;
			}
		}
	}
	return 0;
});

// abduction.dm:239
rt.def("/datum/game_mode/proc/update_abductor_icons_added", function update_abductor_icons_added(f: Frame, alien_mind: Value) {
	let hud: Value = null;
	(hud = rt.index(GLOB.huds, ANTAG_HUD_ABDUCTOR)).join_hud(alien_mind.current);
	let $0: any = alien_mind.current;
	this.set_antag_hud($0, rt.isIn(f, alien_mind, this.abductors) ? "abductor" : "abductee");
	return f.dot;
});
