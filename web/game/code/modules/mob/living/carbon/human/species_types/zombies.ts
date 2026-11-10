// Based on /tg/station's code/modules/mob/living/carbon/human/species_types/zombies.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4111, "/datum/species/zombie", "/datum/species", {
	name: "High Functioning Zombie",
	id: "zombie",
	say_mod: "moans",
	sexes: 0,
	blacklisted: 1,
	species_traits: null,
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/zombie"),
	mutant_organs: null,
}, { global: { spooks: 673 } });

// zombies.dm:10
rt.def("/datum/species/zombie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.species_traits = list(10, 7, 8, 12, 9, 21, 22, 23);

	this.mutant_organs = list(T("/obj/item/organ/tongue/zombie"));
	return f.dot;
});

rt.type(4112, "/datum/species/zombie/infectious", "/datum/species/zombie", {
	name: "Infectious Zombie",
	id: "memezombies",
	limbs_id: "zombie",
	armor: 20,
	speedmod: 2,
	mutanthands: rt.typePath("/obj/item/zombie_hand"),
	mutanteyes: rt.typePath("/obj/item/organ/eyes/night_vision/zombie"),
});

// zombies.dm:23
rt.def("/datum/species/zombie/infectious/proc/spec_stun", function spec_stun(f: Frame, H: Value, amount: Value) {
	f.dot = min(2, amount);
	return f.dot;
});

// zombies.dm:26
rt.def("/datum/species/zombie/infectious/proc/spec_life", function* spec_life(f: Frame, C: Value) {
	f.dot = (yield* parent_proc());
	C.a_intent = "harm";
	yield* C.heal_overall_damage(4, 4);
	if (prob(4)) {
		playsound(C, pick(GLOB.spooks), 50, 1, 10);
	}
	if (!C.InCritical()) return f.dot;
	yield* C.death();
	return f.dot;
}, true);

// zombies.dm:37
rt.def("/datum/species/zombie/infectious/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	let infection: Value = null;
	f.dot = (yield* parent_proc());
	if (infection = C.getorganslot("zombie_infection")) return f.dot;
	yield* (infection = (yield* new_(T("/obj/item/organ/zombie_infection")))).Insert(C);
	return f.dot;
}, true);

rt.type(4113, "/datum/species/krokodil_addict", "/datum/species", {
	name: "Human",
	id: "goofzombies",
	limbs_id: "zombie",
	sexes: 0,
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/zombie"),
	mutant_organs: null,
});

// zombies.dm:56
rt.def("/datum/species/krokodil_addict/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutant_organs = list(T("/obj/item/organ/tongue/zombie"));
	return f.dot;
});
