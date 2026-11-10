// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/bear.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4950, "/mob/living/simple_animal/hostile/bear", "/mob/living/simple_animal/hostile", {
	armored: 0,
	name: "space bear",
	desc: "You don't need to be faster than a space bear, you just need to outrun your crewmates.",
	icon_state: "bear",
	icon_living: "bear",
	icon_dead: "bear_dead",
	icon_gib: "bear_gib",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_taunt: null,
	speak_chance: 1,
	taunt_chance: 25,
	turns_per_move: 5,
	see_in_dark: 6,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "hits",
	maxHealth: 60,
	health: 60,
	obj_damage: 60,
	melee_damage_lower: 20,
	melee_damage_upper: 30,
	attacktext: "claws",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	friendly: "bear hugs",
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1500,
	faction: null,
	gold_core_spawnable: 1,
});

// bear.dm:17
rt.def("/mob/living/simple_animal/hostile/bear/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list("RAWR!", "Rawr!", "GRR!", "Growl!");
	this.speak_emote = list("growls", "roars");
	this.emote_hear = list("rawrs.", "grumbles.", "grawls.");
	this.emote_taunt = list("stares ferociously", "stomps");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/bear"), 5, T("/obj/item/clothing/head/bearpelt"), 1]);
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("russian");
	return f.dot;
});

rt.type(4953, "/mob/living/simple_animal/hostile/bear/russian", "/mob/living/simple_animal/hostile/bear", {
	armored: 1,
	name: "combat bear",
	desc: "A ferocious brown bear decked out in armor plating, a red star with yellow outlining details the shoulder plating.",
	icon_state: "combatbear",
	icon_living: "combatbear",
	icon_dead: "combatbear_dead",
	faction: null,
	butcher_results: null,
	melee_damage_lower: 25,
	melee_damage_upper: 35,
	armour_penetration: 20,
	health: 120,
	maxHealth: 120,
});

// bear.dm:59
rt.def("/mob/living/simple_animal/hostile/bear/russian/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("russian");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/bear"), 5, T("/obj/item/clothing/head/bearpelt"), 1, T("/obj/item/bear_armor"), 1]);
	return f.dot;
});

// bear.dm:72
rt.def("/mob/living/simple_animal/hostile/bear/proc/update_icons", function update_icons(f: Frame) {
	parent_proc();
	if (!this.armored) return f.dot;
	this.add_overlay("armor_bear");
	return f.dot;
});

rt.type(10128, "/obj/item/bear_armor", "/obj/item", {
	name: "pile of bear armor",
	desc: "A scattered pile of various shaped armor pieces fitted for a bear, some duct tape, and a nail filer. Crude instructions are written on the back of one of the plates in russian. This seems like an awful idea.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "bear_armor_upgrade",
});

// bear.dm:84
rt.def("/obj/item/bear_armor/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let A: Value = null;
	if (!(rt.istype(target, T("/mob/living/simple_animal/hostile/bear")) && proximity_flag)) return f.dot;
	if ((A = target).armored) {
		to_chat(user, `<span class='warning'>${A} has already been armored up!</span>`);
		return f.dot;
	}
	A.armored = 1;
	A.maxHealth += 60;
	A.health += 60;
	A.armour_penetration += 20;
	A.melee_damage_lower += 5;
	A.melee_damage_upper += 5;
	yield* A.update_icons();
	to_chat(user, `<span class='info'>You strap the armor plating to ${A} and sharpen ${A.p_their()} claws with the nail filer. This was a great idea.</span>`);
	yield* qdel(this);
	return f.dot;
}, true);
