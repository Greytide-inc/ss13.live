// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/retaliate/frog.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4937, "/mob/living/simple_animal/hostile/retaliate/frog", "/mob/living/simple_animal/hostile/retaliate", {
	pass_flags: 21,
	name: "frog",
	desc: "It seems a little sad.",
	icon_state: "frog",
	icon_living: "frog",
	icon_dead: "frog_dead",
	speak: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	maxHealth: 15,
	health: 15,
	melee_damage_lower: 5,
	melee_damage_upper: 5,
	attacktext: "bites",
	response_help: "pets",
	response_disarm: "pokes",
	response_harm: "splats",
	density: 0,
	ventcrawler: 2,
	faction: null,
	attack_sound: rt.rsc("sound/effects/reee.ogg"),
	butcher_results: null,
	mob_size: 0,
	gold_core_spawnable: 1,
});

// frog.dm:21
rt.def("/mob/living/simple_animal/hostile/retaliate/frog/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list("ribbit", "croak");
	this.emote_see = list("hops in a circle.", "shakes.");

	this.faction = list("hostile");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/nugget"), 1]);
	return f.dot;
});

// frog.dm:29
rt.def("/mob/living/simple_animal/hostile/retaliate/frog/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!prob(1)) return f.dot;
	this.name = "rare frog";
	this.desc = "It seems a little smug.";
	this.icon_state = "rare_frog";
	this.icon_living = "rare_frog";
	this.icon_dead = "rare_frog_dead";
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/nugget"), 5]);
	return f.dot;
}, true);

// frog.dm:39
rt.def("/mob/living/simple_animal/hostile/retaliate/frog/proc/Crossed", function Crossed(f: Frame, AM: Value) {
	let L: Value = null;
	if (!(!this.stat && rt.istype(AM, T("/mob/living")))) return f.dot;
	if (!((L = AM).mob_size > MOB_SIZE_TINY)) return f.dot;
	playsound(this, rt.rsc("sound/effects/huuu.ogg"), 50, 1);
	return f.dot;
});
