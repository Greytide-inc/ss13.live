// Based on /tg/station's code/modules/mob/living/carbon/human/species_types/skeletons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4108, "/datum/species/skeleton", "/datum/species", {
	name: "Spooky Scary Skeleton",
	id: "skeleton",
	say_mod: "rattles",
	blacklisted: 1,
	sexes: 0,
	species_traits: null,
	damage_overlay_type: "",
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/skeleton"),
	mutant_organs: null,
});

// skeletons.dm:10
rt.def("/datum/species/skeleton/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.species_traits = list(10, 6, 7, 8, 12, 9, 14, 15, 19, 22, 23);

	this.mutant_organs = list(T("/obj/item/organ/tongue/bone"));
	return f.dot;
});
