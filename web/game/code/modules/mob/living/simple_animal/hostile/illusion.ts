// From code/modules/mob/living/simple_animal/hostile/illusion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4962, "/mob/living/simple_animal/hostile/illusion", "/mob/living/simple_animal/hostile", {
	life_span: 1e+31,
	parent_mob: null,
	multiply_chance: 0,
	name: "illusion",
	desc: "It's a fake!",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "static",
	icon_living: "static",
	icon_dead: "null",
	gender: "neuter",
	melee_damage_lower: 5,
	melee_damage_upper: 5,
	a_intent: "harm",
	attacktext: "gores",
	maxHealth: 100,
	health: 100,
	speed: 0,
	faction: null,
	del_on_death: 1,
	deathmessage: "vanishes into thin air! It was a fake!",
});

// /mob/living/simple_animal/hostile/illusion/proc/<init>  (code/modules/mob/living/simple_animal/hostile/illusion.dm:16)
rt.def("/mob/living/simple_animal/hostile/illusion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("illusion"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/illusion/proc/Life  (code/modules/mob/living/simple_animal/hostile/illusion.dm:25)  may sleep
rt.def("/mob/living/simple_animal/hostile/illusion/proc/Life", function* Life(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!rt.gt(rt.worldTime(f), rt.sv(f, "life_span"))) return f.dot;
	yield* g.srcCall(f, "death");
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/illusion/proc/Copy_Parent  (code/modules/mob/living/simple_animal/hostile/illusion.dm:32)  may sleep
rt.def("/mob/living/simple_animal/hostile/illusion/proc/Copy_Parent", function* Copy_Parent(f: Frame, original: Value, life: Value, health: Value, damage: Value, replicate: Value) {
	f.vars = () => [original, life, health, damage, replicate];
	if (live(life) === null) {
		life = 50;
	}
	if (live(health) === null) {
		health = 100;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(replicate) === null) {
		replicate = 0;
	}
	rt.setSv(f, "appearance", rt.fv(f, "appearance", live(original)));
	rt.setSv(f, "parent_mob", live(original));
	yield* g.srcCall(f, "setDir", rt.fv(f, "dir", live(original)));
	rt.setSv(f, "life_span", add(rt.worldTime(f), live(life)));
	rt.setSv(f, "melee_damage_lower", live(damage));
	rt.setSv(f, "melee_damage_upper", live(damage));
	rt.setSv(f, "multiply_chance", live(replicate));
	(rt.modSrcVar(f, "faction", "neutral", subtract));
	rt.setSv(f, "transform", rt.initial(f, live(f.src), "transform"));
	rt.setSv(f, "pixel_y", rt.initial(f, live(f.src), "pixel_y"));
	rt.setSv(f, "pixel_x", rt.initial(f, live(f.src), "pixel_x"));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/illusion/proc/examine  (code/modules/mob/living/simple_animal/hostile/illusion.dm:45)  may sleep
rt.def("/mob/living/simple_animal/hostile/illusion/proc/examine", function* examine(f: Frame) {
	if (truthy(rt.sv(f, "parent_mob"))) {
		yield* g.callName(f, rt.sv(f, "parent_mob"), "examine", [live(f.args[0])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/simple_animal/hostile/illusion/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/illusion.dm:51)  may sleep
rt.def("/mob/living/simple_animal/hostile/illusion/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null, M: Value = null;
	f.vars = () => [L, M];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy(live(f.dot)) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) && truthy(rt.op(f, "Prob", [], [rt.sv(f, "multiply_chance")])))) return f.dot;
	if (isEqual(rt.gv(f, "stat", (L = rt.sv(f, "target"))), 2)) {
		return live(f.dot);
	}
	rt.setFv(f, "faction", (M = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/illusion"), [rt.sv(f, "loc")]))), (yield* g.callName(f, rt.sv(f, "faction"), "Copy", [])));
	yield* g.callName(f, live(M), "Copy_Parent", [rt.sv(f, "parent_mob"), 80, divide(rt.sv(f, "health"), 2), rt.sv(f, "melee_damage_upper"), divide(rt.sv(f, "multiply_chance"), 2)]);
	yield* g.callName(f, live(M), "GiveTarget", [live(L)]);
	return f.dot;
}, true);
