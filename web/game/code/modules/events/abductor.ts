// From code/modules/events/abductor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(278, "/datum/round_event/ghost_role/abductor", "/datum/round_event/ghost_role", {
	minimum_required: 2,
	role_name: "abductor team",
});

// /datum/round_event/ghost_role/abductor/proc/spawn_role  (code/modules/events/abductor.dm:16)  may sleep
rt.def("/datum/round_event/ghost_role/abductor/proc/spawn_role", function* spawn_role(f: Frame) {
	let candidates: Value = null, number: Value = null, temp: Value = null, agent_mind: Value = null, scientist_mind: Value = null, agent: Value = null, scientist: Value = null;
	f.vars = () => [candidates, number, temp, agent_mind, scientist_mind, agent, scientist];
	if (rt.lt(rt.getLen(f, (candidates = (yield* g.srcCall(f, "get_candidates", "abductor", null, "abductor")))), 2)) {
		return 3;
	}
	number = add(rt.gv(f, "abductor_teams", rt.fv(f, "mode", rt.gl("SSticker"))), 1);
	temp = null;
	if (isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "abduction")) {
		temp = rt.fv(f, "mode", rt.gl("SSticker"));
	} else {
		temp = (yield* g.new_(f, T("/datum/game_mode/abduction"), []));
	}
	agent_mind = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(candidates)]));
	scientist_mind = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(candidates)]));
	agent = (yield* g.call(f, P("/proc/makeBody"), null, [live(agent_mind)]));
	scientist = (yield* g.call(f, P("/proc/makeBody"), null, [live(scientist_mind)]));
	agent_mind = rt.fv(f, "mind", live(agent));
	scientist_mind = rt.fv(f, "mind", live(scientist));
	rt.setFv(f, "len", rt.fv(f, "scientists", live(temp)), live(number));
	rt.setFv(f, "len", rt.fv(f, "agents", live(temp)), live(number));
	rt.setFv(f, "len", rt.fv(f, "abductors", live(temp)), multiply(2, live(number)));
	rt.setFv(f, "len", rt.fv(f, "team_objectives", live(temp)), live(number));
	rt.setFv(f, "len", rt.fv(f, "team_names", live(temp)), live(number));
	rt.setAt(rt.fv(f, "scientists", live(temp)), live(number), live(scientist_mind));
	rt.setAt(rt.fv(f, "agents", live(temp)), live(number), live(agent_mind));
	(rt.modField(f, live(temp), "abductors", rt.list(live(agent_mind), live(scientist_mind)), rt.bitOr));
	yield* g.callName(f, live(temp), "make_abductor_team", [null, live(number), "preset_scientist", live(scientist_mind), "preset_agent", live(agent_mind)], rt.Args.Named);
	yield* g.callName(f, live(temp), "post_setup_team", [live(number)]);
	rt.incField(f, rt.fv(f, "mode", rt.gl("SSticker")), "abductor_teams", 1, true);
	if (!isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "abduction")) {
		(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "abductors", rt.fv(f, "abductors", live(temp)), rt.bitOr));
	}
	rt.modSrcVar(f, "spawned_mobs", rt.list(live(agent), live(scientist)), add);
	return 2;
}, true);
