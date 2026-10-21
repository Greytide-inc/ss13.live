// From code/modules/mob/living/carbon/human/species_types/skeletons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/species/skeleton/proc/<init>  (code/modules/mob/living/carbon/human/species_types/skeletons.dm:10)
rt.def("/datum/species/skeleton/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(10, 6, 7, 8, 12, 9, 14, 15, 19, 22, 23));
	$0 = $0;
	rt.setSv(f, "mutant_organs", rt.list(T("/obj/item/organ/tongue/bone")));
	return f.dot;
});
