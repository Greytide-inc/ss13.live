// From code/game/gamemodes/traitor/double_agents.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/game_mode/traitor/internal_affairs/proc/post_setup  (code/game/gamemodes/traitor/double_agents.dm:26)  may sleep
rt.def("/datum/game_mode/traitor/internal_affairs/proc/post_setup", function* post_setup(f: Frame) {
	let i: Value = null, traitor: Value = null;
	let $e: any;
	f.vars = () => [i, traitor, $e];
	i = 0;
	traitor = null;
	rt.forList(f, 0, rt.sv(f, "pre_traitors"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		traitor = $e;
		i = rt.inc(live(i), 1);
		if (rt.gt(add(live(i), 1), rt.len(f, rt.sv(f, "pre_traitors")))) {
			i = 0;
		}
		rt.setAt(rt.sv(f, "target_list"), live(traitor), rt.index(rt.sv(f, "pre_traitors"), add(live(i), 1)));
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/game_mode/traitor/internal_affairs/proc/add_latejoin_traitor  (code/game/gamemodes/traitor/double_agents.dm:36)  may sleep
rt.def("/datum/game_mode/traitor/internal_affairs/proc/add_latejoin_traitor", function* add_latejoin_traitor(f: Frame, character: Value) {
	let i: Value = null, traitor: Value = null;
	let $e: any;
	f.vars = () => [character, i, traitor, $e];
	yield* g.srcCall(f, "check_potential_agents");
	if (rt.ge(rt.len(f, rt.sv(f, "late_joining_list")), (yield* g.call(f, P("/proc/rand"), null, [3, 4])))) {
		yield* g.call(f, P("/proc/shuffle_inplace"), null, [rt.sv(f, "late_joining_list")]);
		rt.setSv(f, "target_list", rt.list());
		i = 0;
		traitor = null;
		rt.forList(f, 0, rt.sv(f, "late_joining_list"), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			traitor = $e;
			i = rt.inc(live(i), 1);
			if (rt.gt(add(live(i), 1), rt.len(f, rt.sv(f, "late_joining_list")))) {
				i = 0;
			}
			rt.setAt(rt.sv(f, "target_list"), live(traitor), rt.index(rt.sv(f, "late_joining_list"), add(live(i), 1)));
			rt.setFv(f, "special_role", live(traitor), rt.sv(f, "traitor_name"));
		}
		rt.endFor(f, 0);
		traitor = null;
		rt.forList(f, 0, rt.sv(f, "target_list"), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			traitor = $e;
			yield* g.callSuper(f, [live(traitor)]);
		}
		rt.endFor(f, 0);
		rt.setSv(f, "late_joining_list", rt.list());
	} else {
		rt.modSrcVar(f, "late_joining_list", live(character), add);
	}
	return live(f.dot);
}, true);

// /datum/game_mode/traitor/internal_affairs/proc/check_potential_agents  (code/game/gamemodes/traitor/double_agents.dm:65)
rt.def("/datum/game_mode/traitor/internal_affairs/proc/check_potential_agents", function check_potential_agents(f: Frame) {
	let M: Value = null, agent_mind: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [M, agent_mind, H, $e];
	M = null;
	rt.forList(f, 0, rt.sv(f, "late_joining_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/datum/mind")) ? 1 : 0))) {
			if (truthy((rt.istype(rt.gv(f, "current", (agent_mind = live(M))), T("/mob/living/carbon/human")) ? 1 : 0))) {
				if (!isEqual(rt.gv(f, "stat", (H = rt.fv(f, "current", live(agent_mind)))), 2)) {
					if (truthy(rt.fv(f, "client", live(H)))) {
						continue;
					}
				}
			}
		}
		(rt.modSrcVar(f, "late_joining_list", live(M), subtract));
	}
	rt.endFor(f, 0);
	return f.dot;
});
