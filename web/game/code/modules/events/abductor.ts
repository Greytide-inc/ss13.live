// Based on /tg/station's code/modules/events/abductor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(278, "/datum/round_event/ghost_role/abductor", "/datum/round_event/ghost_role", {
	minimum_required: 2,
	role_name: "abductor team",
});

// abductor.dm:16
rt.def("/datum/round_event/ghost_role/abductor/proc/spawn_role", function* spawn_role(f: Frame) {
	let candidates: Value = null, temp: Value = null;
	if (rt.len(f, (candidates = (yield* this.get_candidates("abductor", null, "abductor")))) < 2) {
		return NOT_ENOUGH_PLAYERS;
	}
	let number: Value = GLOB.SSticker.mode.abductor_teams + 1;
	if (GLOB.SSticker.mode.config_tag == "abduction") {
		temp = GLOB.SSticker.mode;
	} else {
		temp = (yield* new_(T("/datum/game_mode/abduction")));
	}
	let agent_mind: Value = pick_n_take(candidates);
	let scientist_mind: Value = pick_n_take(candidates);
	let agent: Value = (yield* makeBody(agent_mind));
	let scientist: Value = (yield* makeBody(scientist_mind));
	agent_mind = agent.mind;
	scientist_mind = scientist.mind;
	temp.scientists.len = number;
	temp.agents.len = number;
	temp.abductors.len = 2 * number;
	temp.team_objectives.len = number;
	temp.team_names.len = number;
	rt.setAt(temp.scientists, number, scientist_mind);
	rt.setAt(temp.agents, number, agent_mind);
	(rt.modField(f, temp, "abductors", list(agent_mind, scientist_mind), rt.bitOr));
	yield* temp.make_abductor_team(number, { preset_scientist: scientist_mind, preset_agent: agent_mind });
	yield* temp.post_setup_team(number);
	GLOB.SSticker.mode.abductor_teams++;
	if (GLOB.SSticker.mode.config_tag != "abduction") {
		(rt.modField(f, GLOB.SSticker.mode, "abductors", temp.abductors, rt.bitOr));
	}
	this.spawned_mobs += list(agent, scientist);
	return SUCCESSFUL_SPAWN;
}, true);
