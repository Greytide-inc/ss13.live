// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/mining_mobs/goldgrub.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(5007, "/mob/living/simple_animal/hostile/asteroid/goldgrub", "/mob/living/simple_animal/hostile/asteroid", {
	chase_time: 100,
	will_burrow: 1,
	vision_range: 2,
	aggro_vision_range: 9,
	idle_vision_range: 2,
	move_to_delay: 5,
	search_objects: 1,
	name: "goldgrub",
	desc: "A worm that grows fat from eating everything in its sight. Seems to enjoy precious metals and other shiny things, hence the name.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "Goldgrub",
	icon_living: "Goldgrub",
	icon_aggro: "Goldgrub_alert",
	icon_dead: "Goldgrub_dead",
	icon_gib: "syndicate_gib",
	friendly: "harmlessly rolls into",
	maxHealth: 45,
	health: 45,
	harm_intent_damage: 5,
	melee_damage_lower: 0,
	melee_damage_upper: 0,
	attacktext: "barrels into",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	a_intent: "help",
	speak_emote: null,
	throw_message: "sinks in slowly, before being pushed out of ",
	deathmessage: "spits up the contents of its stomach before dying!",
	status_flags: 8,
	wanted_objects: null,
});

// goldgrub.dm:24
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("screeches");

	this.wanted_objects = list(T("/obj/item/weapon/ore/diamond"), T("/obj/item/weapon/ore/gold"), T("/obj/item/weapon/ore/silver"), T("/obj/item/weapon/ore/uranium"));
	return f.dot;
});

// goldgrub.dm:36
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	let i: Value = rand(1, 3);
	while (i) {
		this.loot += pick(T("/obj/item/weapon/ore/silver"), T("/obj/item/weapon/ore/gold"), T("/obj/item/weapon/ore/uranium"), T("/obj/item/weapon/ore/diamond"));
		i--;
	}
	return f.dot;
}, true);

// goldgrub.dm:43
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/GiveTarget", function* GiveTarget(f: Frame, new_target: Value) {
	this.target = new_target;
	if (this.target === null) return f.dot;
	if (rt.istype(this.target, T("/obj/item/weapon/ore")) && rt.len(f, this.loot) < 10) {
		this.visible_message(`<span class='notice'>The ${this.name} looks at ${this.target.name} with hungry eyes.</span>`);
	} else {
		if (!rt.istype(this.target, T("/mob/living"))) return f.dot;
		yield* this.Aggro();
		this.visible_message(`<span class='danger'>The ${this.name} tries to flee from ${this.target.name}!</span>`);
		this.retreat_distance = 10;
		this.minimum_distance = 10;
		if (!this.will_burrow) return f.dot;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/Burrow"))), this.chase_time);
	}
	return f.dot;
}, true);

// goldgrub.dm:56
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (rt.istype(this.target, T("/obj/item/weapon/ore"))) {
		yield* this.EatOre(this.target);
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// goldgrub.dm:62
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/EatOre", function* EatOre(f: Frame, targeted_ore: Value) {
	let O: Value = null;
	for (O of each(targeted_ore.loc, T("/obj/item/weapon/ore"))) {
		if (rt.len(f, this.loot) < 10) {
			this.loot += O.type;
			yield* qdel(O);
		}
	}
	this.visible_message("<span class='notice'>The ore was swallowed whole!</span>");
	return f.dot;
}, true);

// goldgrub.dm:69
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/Burrow", function* Burrow(f: Frame) {
	if (this.stat) return f.dot;
	this.visible_message(`<span class='danger'>The ${this.name} buries into the ground, vanishing from sight!</span>`);
	yield* qdel(this);
	return f.dot;
}, true);

// goldgrub.dm:74
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/bullet_act", function bullet_act(f: Frame, _P: Value) {
	this.visible_message(`<span class='danger'>The ${_P.name} was repelled by ${this.name}'s girth!</span>`);
	return f.dot;
});

// goldgrub.dm:79
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	this.idle_vision_range = 9;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });
