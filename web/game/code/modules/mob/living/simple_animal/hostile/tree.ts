// From code/modules/mob/living/simple_animal/hostile/tree.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4994, "/mob/living/simple_animal/hostile/tree", "/mob/living/simple_animal/hostile", {
	emote_taunt: null,
	taunt_chance: 20,
	name: "pine tree",
	desc: "A pissed off tree-like alien. It seems annoyed with the festivities...",
	icon: rt.rsc("icons/obj/flora/pinetrees.dmi"),
	icon_state: "pine_1",
	icon_living: "pine_1",
	icon_dead: "pine_1",
	icon_gib: "pine_1",
	gender: "neuter",
	speak_chance: 0,
	turns_per_move: 5,
	response_help: "brushes",
	response_disarm: "pushes",
	response_harm: "hits",
	speed: 1,
	maxHealth: 250,
	health: 250,
	mob_size: 3,
	pixel_x: -16,
	harm_intent_damage: 5,
	melee_damage_lower: 8,
	melee_damage_upper: 12,
	attacktext: "bites",
	attack_sound: rt.rsc("sound/weapons/bite.ogg"),
	speak_emote: null,
	atmos_requirements: null,
	unsuitable_atmos_damage: 5,
	minbodytemp: 0,
	maxbodytemp: 1200,
	faction: null,
	deathmessage: "is hacked into pieces!",
	loot: null,
	gold_core_spawnable: 1,
	del_on_death: 1,
});

// /mob/living/simple_animal/hostile/tree/proc/<init>  (code/modules/mob/living/simple_animal/hostile/tree.dm:28)
rt.def("/mob/living/simple_animal/hostile/tree/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emote_taunt", rt.list("growls"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("pines"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 2, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("hostile"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/item/stack/sheet/mineral/wood")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/tree/proc/Life  (code/modules/mob/living/simple_animal/hostile/tree.dm:43)
rt.def("/mob/living/simple_animal/hostile/tree/proc/Life", function Life(f: Frame) {
	let _T: Value = null, co2: Value = null, amt: Value = null;
	f.vars = () => [_T, co2, amt];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open")) ? 1 : 0))) return f.dot;
	if (!(truthy(rt.gv(f, "air", (_T = rt.fv(f, "loc", live(f.src))))) && truthy(rt.index(rt.gv(f, "gases", rt.fv(f, "air", live(_T))), "co2")))) return f.dot;
	if (!rt.gt((co2 = rt.index(rt.index(rt.gv(f, "gases", rt.fv(f, "air", live(_T))), "co2"), 1)), 0)) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [25]))) return f.dot;
	amt = rt.call(f, P("/proc/min"), null, [live(co2), 9]);
	(rt.modAt(rt.index(rt.gv(f, "gases", rt.fv(f, "air", live(_T))), "co2"), 1, live(amt), subtract));
	rt.callName(f, live(_T), "atmos_spawn_air", [fmt("o2=＀", [live(amt)])]);
	return f.dot;
}, false, { waitfor: false });

// /mob/living/simple_animal/hostile/tree/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/tree.dm:55)  may sleep
rt.def("/mob/living/simple_animal/hostile/tree/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	C = rt.sv(f, "target");
	if (!truthy(rt.op(f, "Prob", [], [15]))) return f.dot;
	yield* g.callName(f, live(C), "Knockdown", [60]);
	yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＄！ knocks down ％！!</span>", [live(f.src), live(C)]), fmt("<span class='userdanger'>＄！ knocks you down!</span>", [live(f.src)])]);
	return f.dot;
}, true);

rt.type(4995, "/mob/living/simple_animal/hostile/tree/festivus", "/mob/living/simple_animal/hostile/tree", {
	name: "festivus pole",
	desc: "serenity now... SERENITY NOW!",
	icon_state: "festivus_pole",
	icon_living: "festivus_pole",
	icon_dead: "festivus_pole",
	icon_gib: "festivus_pole",
	loot: null,
	speak_emote: null,
});

// /mob/living/simple_animal/hostile/tree/festivus/proc/<init>  (code/modules/mob/living/simple_animal/hostile/tree.dm:70)
rt.def("/mob/living/simple_animal/hostile/tree/festivus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/item/stack/rods")));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("polls"));
	return f.dot;
});
