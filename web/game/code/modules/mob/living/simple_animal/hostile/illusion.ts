// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/illusion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// illusion.dm:16
rt.def("/mob/living/simple_animal/hostile/illusion/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("illusion");
	return f.dot;
});

// illusion.dm:25
rt.def("/mob/living/simple_animal/hostile/illusion/proc/Life", function* Life(f: Frame) {
	yield* parent_proc();
	if (!(rt.worldTime(f) > this.life_span)) return f.dot;
	yield* this.death();
	return f.dot;
}, true, { waitfor: false });

// illusion.dm:32
rt.def("/mob/living/simple_animal/hostile/illusion/proc/Copy_Parent", function* Copy_Parent(f: Frame, original: Value, life: Value, health: Value, damage: Value, replicate: Value) {
	life ??= 50;
	health ??= 100;
	damage ??= 0;
	replicate ??= 0;
	this.appearance = original.appearance;
	this.parent_mob = original;
	yield* this.setDir(original.dir);
	this.life_span = rt.worldTime(f) + life;
	this.melee_damage_lower = damage;
	this.melee_damage_upper = damage;
	this.multiply_chance = replicate;
	this.faction -= "neutral";
	this.transform = rt.initial(f, this, "transform");
	this.pixel_y = rt.initial(f, this, "pixel_y");
	this.pixel_x = rt.initial(f, this, "pixel_x");
	return f.dot;
}, true);

// illusion.dm:45
rt.def("/mob/living/simple_animal/hostile/illusion/proc/examine", function* examine(f: Frame, user: Value) {
	if (this.parent_mob) {
		yield* this.parent_mob.examine(user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// illusion.dm:51
rt.def("/mob/living/simple_animal/hostile/illusion/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null, M: Value = null;
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(this.target, T("/mob/living")) && prob(this.multiply_chance))) return f.dot;
	if ((L = this.target).stat == 2) {
		return f.dot;
	}
	(M = (yield* new_(T("/mob/living/simple_animal/hostile/illusion"), this.loc))).faction = (yield* this.faction.Copy());
	yield* M.Copy_Parent(this.parent_mob, 80, this.health / 2, this.melee_damage_upper, this.multiply_chance / 2);
	yield* M.GiveTarget(L);
	return f.dot;
}, true);
