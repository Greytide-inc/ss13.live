// From code/modules/mob/living/simple_animal/friendly/lizard.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4942, "/mob/living/simple_animal/hostile/lizard", "/mob/living/simple_animal/hostile", {
	pass_flags: 17,
	name: "Lizard",
	desc: "A cute tiny lizard.",
	icon_state: "lizard",
	icon_living: "lizard",
	icon_dead: "lizard_dead",
	speak_emote: null,
	health: 5,
	maxHealth: 5,
	faction: null,
	attacktext: "bites",
	melee_damage_lower: 1,
	melee_damage_upper: 2,
	response_help: "pets",
	response_disarm: "shoos",
	response_harm: "stomps on",
	ventcrawler: 2,
	density: 0,
	mob_size: 1,
	gold_core_spawnable: 2,
	obj_damage: 0,
	environment_smash: 0,
}, { global: { edibles: 1046 } });

// /mob/living/simple_animal/hostile/lizard/proc/<init>  (code/modules/mob/living/simple_animal/friendly/lizard.dm:7)
rt.def("/mob/living/simple_animal/hostile/lizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("hisses"));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("Lizard"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/lizard/proc/CanAttack  (code/modules/mob/living/simple_animal/friendly/lizard.dm:27)
rt.def("/mob/living/simple_animal/hostile/lizard/proc/CanAttack", function CanAttack(f: Frame, the_target: Value) {
	if (rt.lt(rt.sv(f, "see_invisible"), rt.fv(f, "invisibility", live(the_target)))) {
		return 0;
	}
	if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(the_target), rt.gl("edibles")]))) {
		return 1;
	}
	return 0;
});

// /mob/living/simple_animal/hostile/lizard/proc/AttackingTarget  (code/modules/mob/living/simple_animal/friendly/lizard.dm:34)  may sleep
rt.def("/mob/living/simple_animal/hostile/lizard/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [rt.sv(f, "target"), rt.gl("edibles")])))) {
		yield* g.srcCall(f, "visible_message", fmt("＀ consumes ＀ in a single gulp", [rt.sv(f, "name"), rt.sv(f, "target")]), fmt("<span class='notice'>You consume ＀ in a single gulp</span>", [rt.sv(f, "target")]));
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "target")]);
		rt.setSv(f, "target", null);
		yield* g.srcCall(f, "adjustBruteLoss", -2);
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true);
