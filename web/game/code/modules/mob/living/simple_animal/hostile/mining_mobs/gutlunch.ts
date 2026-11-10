// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/mining_mobs/gutlunch.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5011, "/mob/living/simple_animal/hostile/asteroid/gutlunch", "/mob/living/simple_animal/hostile/asteroid", {
	udder: null,
	move_to_delay: 15,
	stat_attack: 1,
	stat_exclusive: 1,
	robust_searching: 1,
	search_objects: 1,
	name: "gutlunch",
	desc: "A scavenger that eats raw meat, often found alongside ash walkers. Produces a thick, nutritious milk.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "gutlunch",
	icon_living: "gutlunch",
	icon_dead: "gutlunch",
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	weather_immunities: null,
	faction: null,
	density: 0,
	speak_chance: 1,
	turns_per_move: 8,
	obj_damage: 0,
	environment_smash: 0,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "squishes",
	friendly: "pinches",
	a_intent: "help",
	ventcrawler: 2,
	gold_core_spawnable: 2,
	gender: "neuter",
	stop_automated_movement: 0,
	stop_automated_movement_when_pulled: 1,
	del_on_death: 1,
	loot: null,
	deathmessage: "is pulped into bugmash.",
	animal_species: rt.typePath("/mob/living/simple_animal/hostile/asteroid/gutlunch"),
	childtype: null,
	wanted_objects: null,
});

// gutlunch.dm:10
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("warbles", "quavers");

	this.emote_hear = list("trills.");
	this.emote_see = list("sniffs.", "burps.");
	this.weather_immunities = list("lava", "ash");
	this.faction = list("mining", "ashwalker");

	this.loot = list(T("/obj/effect/decal/cleanable/blood/gibs"));

	this.childtype = rt.alist(f, [T("/mob/living/simple_animal/hostile/asteroid/gutlunch/gubbuck"), 45, T("/mob/living/simple_animal/hostile/asteroid/gutlunch/guthen"), 55]);

	this.wanted_objects = list(T("/obj/effect/decal/cleanable/xenoblood/xgibs"), T("/obj/effect/decal/cleanable/blood/gibs"));
	return f.dot;
});

// gutlunch.dm:45
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/proc/Initialize", function* Initialize(f: Frame) {
	this.udder = (yield* new_(T("/obj/item/udder/gutlunch")));
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// gutlunch.dm:49
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.udder);
	this.udder = null;
	return (yield* parent_proc());
}, true);

// gutlunch.dm:53
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	this.cut_overlays();
	if (this.udder.reagents.total_volume == this.udder.reagents.maximum_volume) {
		this.add_overlay("gl_full");
	}
	parent_proc();
	return f.dot;
});

// gutlunch.dm:59
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (this.stat == 0 && rt.istype(O, T("/obj/item/weapon/reagent_containers/glass"))) {
		yield* this.udder.milkAnimal(O, user);
		yield* this.regenerate_icons();
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// gutlunch.dm:66
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (is_type_in_typecache(this.target, this.wanted_objects)) {
		yield* this.udder.generateMilk();
		yield* this.regenerate_icons();
		this.visible_message(`<span class='notice'>${this} slurps up ${this.target}.</span>`);
		yield* qdel(this.target);
	}
	return (yield* parent_proc());
}, true);

rt.type(5012, "/mob/living/simple_animal/hostile/asteroid/gutlunch/gubbuck", "/mob/living/simple_animal/hostile/asteroid/gutlunch", {
	name: "gubbuck",
	gender: "male",
});

// gutlunch.dm:79
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/gubbuck/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.add_atom_colour(pick("#E39FBB", "#D97D64", "#CF8C4A"), FIXED_COLOUR_PRIORITY);
	this.resize = 0.85;
	yield* this.update_transform();
	return f.dot;
}, true);

rt.type(5013, "/mob/living/simple_animal/hostile/asteroid/gutlunch/guthen", "/mob/living/simple_animal/hostile/asteroid/gutlunch", {
	name: "guthen",
	gender: "female",
});

// gutlunch.dm:90
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/guthen/proc/Life", function* Life(f: Frame) {
	yield* parent_proc();
	if (this.udder.reagents.total_volume != this.udder.reagents.maximum_volume) return f.dot;
	yield* this.make_babies();
	return f.dot;
}, true, { waitfor: false });

// gutlunch.dm:95
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/guthen/proc/make_babies", function* make_babies(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.udder.reagents.clear_reagents();
	yield* this.regenerate_icons();
	return f.dot;
}, true);

rt.type(10122, "/obj/item/udder/gutlunch", "/obj/item/udder", {
	name: "nutrient sac",
});

// gutlunch.dm:105
rt.def("/obj/item/udder/gutlunch/proc/New", function* New(f: Frame) {
	this.reagents = (yield* new_(T("/datum/reagents"), 50));
	this.reagents.my_atom = this;
	return f.dot;
}, true);

// gutlunch.dm:109
rt.def("/obj/item/udder/gutlunch/proc/generateMilk", function* generateMilk(f: Frame) {
	if (prob(60)) {
		yield* this.reagents.add_reagent("cream", rand(2, 5));
	}
	if (!prob(45)) return f.dot;
	yield* this.reagents.add_reagent("salglu_solution", rand(2, 5));
	return f.dot;
}, true);
