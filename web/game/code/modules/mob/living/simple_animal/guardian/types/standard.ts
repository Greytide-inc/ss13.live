// From code/modules/mob/living/simple_animal/guardian/types/standard.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4881, "/mob/living/simple_animal/hostile/guardian/punch", "/mob/living/simple_animal/hostile/guardian", {
	battlecry: "AT",
	playstyle_string: "<span class='holoparasite'>As a <b>standard</b> type you have no special abilities, but have a high damage resistance and a powerful attack capable of smashing through walls.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Assistant, faceless and generic, but never to be underestimated.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Standard combat modules loaded. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! You caught one! It's really boring and standard. Better punch some walls to ease the tension.</span>",
	melee_damage_lower: 20,
	melee_damage_upper: 20,
	obj_damage: 80,
	next_move_modifier: 0.8,
	environment_smash: 2,
});

// /mob/living/simple_animal/hostile/guardian/punch/verb/Battlecry  (code/modules/mob/living/simple_animal/guardian/types/standard.dm:18)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/punch/verb/Battlecry", function* Battlecry(f: Frame) {
	let input: Value = null;
	f.vars = () => [input];
	if (!truthy((input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.src), "What do you want your battlecry to be? Max length of 6 characters.", null, "", 7]))))) return f.dot;
	rt.setSv(f, "battlecry", live(input));
	return f.dot;
}, true, { verb: { name: "Set Battlecry", category: "Guardian", desc: "Choose what you shout as you punch people." } });

// /mob/living/simple_animal/hostile/guardian/punch/proc/AttackingTarget  (code/modules/mob/living/simple_animal/guardian/types/standard.dm:25)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/punch/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(f.src), "say", [fmt("＀＀＀＀＀＀＀＀＀＀!!", [rt.fv(f, "battlecry", live(f.src)), rt.fv(f, "battlecry", live(f.src)), rt.fv(f, "battlecry", live(f.src)), rt.fv(f, "battlecry", live(f.src)), rt.fv(f, "battlecry", live(f.src)), rt.fv(f, "battlecry", live(f.src)), rt.fv(f, "battlecry", live(f.src)), rt.fv(f, "battlecry", live(f.src)), rt.fv(f, "battlecry", live(f.src)), rt.fv(f, "battlecry", live(f.src))])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "attack_sound", live(f.src)), 50, 1, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "attack_sound", live(f.src)), 50, 1, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "attack_sound", live(f.src)), 50, 1, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "attack_sound", live(f.src)), 50, 1, 1]);
	return f.dot;
}, true);
