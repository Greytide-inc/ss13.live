// From code/game/gamemodes/devil/devil agent/devil_agent.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/game_mode/devil/devil_agents/proc/<init>  (code/game/gamemodes/devil/devil agent/devil_agent.dm:13)
rt.def("/datum/game_mode/devil/devil_agents/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "devil_target_list", rt.list());
	$0 = $0;
	rt.setSv(f, "devil_late_joining_list", rt.list());
	return f.dot;
});

// /datum/game_mode/devil/devil_agents/proc/post_setup  (code/game/gamemodes/devil/devil agent/devil_agent.dm:23)  may sleep
rt.def("/datum/game_mode/devil/devil_agents/proc/post_setup", function* post_setup(f: Frame) {
	let i: Value = null, devil: Value = null;
	let $e: any;
	f.vars = () => [i, devil, $e];
	i = 0;
	devil = null;
	rt.forList(f, 0, rt.sv(f, "devils"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		devil = $e;
		i = rt.inc(live(i), 1);
		if (rt.gt(add(live(i), 1), rt.len(f, rt.sv(f, "devils")))) {
			i = 0;
		}
		rt.setAt(rt.sv(f, "devil_target_list"), live(devil), rt.index(rt.sv(f, "devils"), add(live(i), 1)));
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/game_mode/devil/devil_agents/proc/add_devil_objectives  (code/game/gamemodes/devil/devil agent/devil_agent.dm:31)  may sleep
rt.def("/datum/game_mode/devil/devil_agents/proc/add_devil_objectives", function* add_devil_objectives(f: Frame, devil_mind: Value, quantity: Value) {
	f.vars = () => [devil_mind, quantity];
	yield* g.callSuper(f, [live(devil_mind), subtract(live(quantity), (yield* g.srcCall(f, "give_outsell_objective", live(devil_mind))))]);
	return f.dot;
}, true);

// /datum/game_mode/devil/devil_agents/proc/give_outsell_objective  (code/game/gamemodes/devil/devil agent/devil_agent.dm:35)
rt.def("/datum/game_mode/devil/devil_agents/proc/give_outsell_objective", function give_outsell_objective(f: Frame, devil: Value) {
	let target_mind: Value = null, outsellobjective: Value = null;
	f.vars = () => [target_mind, outsellobjective];
	if ((truthy(rt.len(f, rt.sv(f, "devil_target_list"))) && truthy(rt.index(rt.sv(f, "devil_target_list"), live(devil))))) {
		target_mind = rt.index(rt.sv(f, "devil_target_list"), live(devil));
		rt.setFv(f, "owner", (outsellobjective = rt.new_(f, T("/datum/objective/devil/outsell"), [])), live(devil));
		rt.setFv(f, "target", live(outsellobjective), live(target_mind));
		rt.callName(f, live(outsellobjective), "update_explanation_text", []);
		rt.modField(f, live(devil), "objectives", live(outsellobjective), add);
		return 1;
	}
	return 0;
});
