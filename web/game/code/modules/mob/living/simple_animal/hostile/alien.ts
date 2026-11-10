// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/alien.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4943, "/mob/living/simple_animal/hostile/alien", "/mob/living/simple_animal/hostile", {
	name: "alien hunter",
	desc: "Hiss!",
	icon: rt.rsc("icons/mob/alien.dmi"),
	icon_state: "alienh",
	icon_living: "alienh",
	icon_dead: "alienh_dead",
	icon_gib: "syndicate_gib",
	gender: "female",
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "hits",
	speed: 0,
	butcher_results: null,
	maxHealth: 125,
	health: 125,
	harm_intent_damage: 5,
	obj_damage: 60,
	melee_damage_lower: 25,
	melee_damage_upper: 25,
	attacktext: "slashes",
	speak_emote: null,
	bubble_icon: "alien",
	a_intent: "harm",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	atmos_requirements: null,
	unsuitable_atmos_damage: 15,
	faction: null,
	status_flags: 8,
	minbodytemp: 0,
	see_in_dark: 8,
	lighting_alpha: 128,
	unique_name: 1,
	gold_core_spawnable: 0,
	death_sound: rt.rsc("sound/voice/hiss6.ogg"),
	deathmessage: "lets out a waning guttural screech, green blood bubbling from its maw...",
});

// alien.dm:14
rt.def("/mob/living/simple_animal/hostile/alien/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), 4, T("/obj/item/stack/sheet/animalhide/xeno"), 1]);

	this.speak_emote = list("hisses");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("alien");
	return f.dot;
});

rt.type(4944, "/mob/living/simple_animal/hostile/alien/drone", "/mob/living/simple_animal/hostile/alien", {
	plant_cooldown: 30,
	plants_off: 0,
	name: "alien drone",
	icon_state: "aliend",
	icon_living: "aliend",
	icon_dead: "aliend_dead",
	melee_damage_lower: 15,
	melee_damage_upper: 15,
});

// alien.dm:50
rt.def("/mob/living/simple_animal/hostile/alien/drone/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	this.plant_cooldown--;
	if (this.AIStatus != AI_IDLE) return f.dot;
	if (!(!this.plants_off && prob(10) && this.plant_cooldown <= 0)) return f.dot;
	this.plant_cooldown = rt.initial(f, this, "plant_cooldown");
	yield* this.SpreadPlants();
	return f.dot;
}, true, { waitfor: false });

rt.type(4946, "/mob/living/simple_animal/hostile/alien/queen", "/mob/living/simple_animal/hostile/alien", {
	sterile: 1,
	plants_off: 0,
	egg_cooldown: 30,
	plant_cooldown: 30,
	name: "alien queen",
	icon_state: "alienq",
	icon_living: "alienq",
	icon_dead: "alienq_dead",
	health: 250,
	maxHealth: 250,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	ranged: 1,
	retreat_distance: 5,
	minimum_distance: 5,
	move_to_delay: 4,
	butcher_results: null,
	projectiletype: rt.typePath("/obj/item/projectile/neurotox"),
	projectilesound: rt.rsc("sound/weapons/pierce.ogg"),
	status_flags: 0,
	unique_name: 0,
});

// alien.dm:87
rt.def("/mob/living/simple_animal/hostile/alien/queen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), 4, T("/obj/item/stack/sheet/animalhide/xeno"), 1]);
	return f.dot;
});

// alien.dm:99
rt.def("/mob/living/simple_animal/hostile/alien/queen/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	this.egg_cooldown--;
	this.plant_cooldown--;
	if (this.AIStatus != AI_IDLE) return f.dot;
	if (!this.plants_off && prob(10) && this.plant_cooldown <= 0) {
		this.plant_cooldown = rt.initial(f, this, "plant_cooldown");
		yield* this.SpreadPlants();
	}
	if (!(!this.sterile && prob(10) && this.egg_cooldown <= 0)) return f.dot;
	this.egg_cooldown = rt.initial(f, this, "egg_cooldown");
	yield* this.LayEggs();
	return f.dot;
}, true, { waitfor: false });

// alien.dm:112
rt.def("/mob/living/simple_animal/hostile/alien/proc/SpreadPlants", function* SpreadPlants(f: Frame) {
	if (!isturf(this.loc) || rt.istype(this.loc, T("/turf/open/space"))) {
		return f.dot;
	}
	if (rt.locateIn(f, T("/obj/structure/alien/weeds/node"), rt.getStep(f, this, 0))) {
		return f.dot;
	}
	this.visible_message(`<span class='alertalien'>${this} has planted some alien weeds!</span>`);
	yield* new_(T("/obj/structure/alien/weeds/node"), this.loc);
	return f.dot;
}, true);

// alien.dm:120
rt.def("/mob/living/simple_animal/hostile/alien/proc/LayEggs", function* LayEggs(f: Frame) {
	if (!isturf(this.loc) || rt.istype(this.loc, T("/turf/open/space"))) {
		return f.dot;
	}
	if (rt.locateIn(f, T("/obj/structure/alien/egg"), rt.getStep(f, this, 0))) {
		return f.dot;
	}
	this.visible_message(`<span class='alertalien'>${this} has laid an egg!</span>`);
	yield* new_(T("/obj/structure/alien/egg"), this.loc);
	return f.dot;
}, true);

rt.type(4947, "/mob/living/simple_animal/hostile/alien/queen/large", "/mob/living/simple_animal/hostile/alien/queen", {
	name: "alien empress",
	icon: rt.rsc("icons/mob/alienqueen.dmi"),
	icon_state: "alienq",
	icon_living: "alienq",
	icon_dead: "alienq_dead",
	bubble_icon: "alienroyal",
	move_to_delay: 4,
	maxHealth: 400,
	health: 400,
	butcher_results: null,
	mob_size: 3,
	gold_core_spawnable: 0,
});

// alien.dm:137
rt.def("/mob/living/simple_animal/hostile/alien/queen/large/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), 10, T("/obj/item/stack/sheet/animalhide/xeno"), 2]);
	return f.dot;
});

// alien.dm:148
rt.def("/mob/living/simple_animal/hostile/alien/proc/handle_temperature_damage", function* handle_temperature_damage(f: Frame) {
	if (this.bodytemperature < this.minbodytemp) {
		yield* this.adjustBruteLoss(2);
	} else {
		if (!(this.bodytemperature > this.maxbodytemp)) return f.dot;
		yield* this.adjustBruteLoss(20);
	}
	return f.dot;
}, true);

rt.type(4948, "/mob/living/simple_animal/hostile/alien/maid", "/mob/living/simple_animal/hostile/alien", {
	name: "lusty xenomorph maid",
	melee_damage_lower: 0,
	melee_damage_upper: 0,
	a_intent: "help",
	friendly: "caresses",
	obj_damage: 0,
	environment_smash: 0,
	gold_core_spawnable: 1,
	icon_state: "maid",
	icon_living: "maid",
	icon_dead: "maid_dead",
});

// alien.dm:168
rt.def("/mob/living/simple_animal/hostile/alien/maid/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let M: Value = null;
	if (!rt.istype(this.target, T("/atom/movable"))) return f.dot;
	if (rt.istype(this.target, T("/obj/effect/decal/cleanable"))) {
		this.visible_message(fmt("＀ cleans up ％！.", [this, this.target]));
		yield* qdel(this.target);
		return 1;
	}
	(M = this.target).clean_blood();
	this.visible_message(fmt("＀ polishes ％！.", [this, this.target]));
	return 1;
}, true);
