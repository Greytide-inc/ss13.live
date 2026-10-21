// From code/modules/mob/living/simple_animal/hostile/faithless.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4956, "/mob/living/simple_animal/hostile/faithless", "/mob/living/simple_animal/hostile", {
	name: "The Faithless",
	desc: "The Wish Granter's faith in humanity, incarnate",
	icon_state: "faithless",
	icon_living: "faithless",
	icon_dead: "faithless_dead",
	gender: "male",
	speak_chance: 0,
	turns_per_move: 5,
	response_help: "passes through",
	response_disarm: "shoves",
	response_harm: "hits",
	emote_taunt: null,
	taunt_chance: 25,
	speed: 0,
	maxHealth: 80,
	health: 80,
	stat_attack: 1,
	robust_searching: 1,
	harm_intent_damage: 10,
	obj_damage: 50,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	attacktext: "grips",
	attack_sound: rt.rsc("sound/hallucinations/growl1.ogg"),
	speak_emote: null,
	atmos_requirements: null,
	minbodytemp: 0,
	faction: null,
	gold_core_spawnable: 1,
});

// /mob/living/simple_animal/hostile/faithless/proc/<init>  (code/modules/mob/living/simple_animal/hostile/faithless.dm:13)
rt.def("/mob/living/simple_animal/hostile/faithless/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emote_taunt", rt.list("wails"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("growls"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("faithless"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/faithless/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/faithless.dm:39)  may sleep
rt.def("/mob/living/simple_animal/hostile/faithless/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy(live(f.dot)) && truthy(rt.op(f, "Prob", [], [12]))) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (C = rt.sv(f, "target")), "Knockdown", [60]);
	yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＄！ knocks down ％！!</span>", [live(f.src), live(C)]), fmt("<span class='userdanger'>＄！ knocks you down!</span>", [live(f.src)])]);
	return f.dot;
}, true);
