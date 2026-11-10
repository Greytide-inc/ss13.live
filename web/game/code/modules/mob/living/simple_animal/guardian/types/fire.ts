// Based on /tg/station's code/modules/mob/living/simple_animal/guardian/types/fire.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4877, "/mob/living/simple_animal/hostile/guardian/fire", "/mob/living/simple_animal/hostile/guardian", {
	range: 7,
	playstyle_string: "<span class='holoparasite'>As a <b>chaos</b> type, you have only light damage resistance, but will ignite any enemy you bump into. In addition, your melee attacks will cause human targets to see everyone as you.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Wizard, bringer of endless chaos!</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Crowd control modules activated. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! You caught one! OH GOD, EVERYTHING'S ON FIRE. Except you and the fish.</span>",
	a_intent: "help",
	melee_damage_lower: 7,
	melee_damage_upper: 7,
	attack_sound: rt.rsc("sound/items/welder.ogg"),
	attacktext: "ignites",
	damage_coeff: null,
});

// fire.dm:8
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.damage_coeff = rt.alist(f, ["brute", 0.7, "fire", 0.7, "tox", 0.7, "clone", 0.7, "stamina", 0, "oxy", 0.7]);
	return f.dot;
});

// fire.dm:16
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/Life", function* Life(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.summoner) return f.dot;
	yield* this.summoner.ExtinguishMob();
	yield* this.summoner.adjust_fire_stacks(-20);
	return f.dot;
}, true, { waitfor: false });

// fire.dm:22
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(this.target, T("/mob/living/carbon/human")) && this.target != this.summoner)) return f.dot;
	yield* new_(T("/obj/effect/hallucination/delusion"), this.target.loc, this.target, "custom", 200, 0, this.icon_state, this.icon);
	return f.dot;
}, true);

// fire.dm:27
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	yield* parent_proc();
	yield* this.collision_ignite(AM);
	return f.dot;
}, true);

// fire.dm:31
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	yield* parent_proc();
	yield* this.collision_ignite(AM);
	return f.dot;
}, true);

// fire.dm:35
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/Bump", function* Bump(f: Frame, AM: Value) {
	yield* parent_proc();
	yield* this.collision_ignite(AM);
	return f.dot;
}, true);

// fire.dm:39
rt.def("/mob/living/simple_animal/hostile/guardian/fire/proc/collision_ignite", function* collision_ignite(f: Frame, AM: Value) {
	let M: Value = null;
	if (!rt.istype(AM, T("/mob/living"))) return f.dot;
	if (!(!this.hasmatchingsummoner((M = AM)) && M != this.summoner && M.fire_stacks < 7)) return f.dot;
	M.fire_stacks = 7;
	yield* M.IgniteMob();
	return f.dot;
}, true);
