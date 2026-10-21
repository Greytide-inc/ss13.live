// From code/modules/mob/living/carbon/human/species_types/zombies.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/species/zombie/proc/<init>  (code/modules/mob/living/carbon/human/species_types/zombies.dm:10)
rt.def("/datum/species/zombie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(10, 7, 8, 12, 9, 21, 22, 23));
	$0 = $0;
	rt.setSv(f, "mutant_organs", rt.list(T("/obj/item/organ/tongue/zombie")));
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

// /datum/species/zombie/infectious/proc/spec_stun  (code/modules/mob/living/carbon/human/species_types/zombies.dm:23)
rt.def("/datum/species/zombie/infectious/proc/spec_stun", function spec_stun(f: Frame, H: Value, amount: Value) {
	f.dot = rt.call(f, P("/proc/min"), null, [2, live(amount)]);
	return f.dot;
});

// /datum/species/zombie/infectious/proc/spec_life  (code/modules/mob/living/carbon/human/species_types/zombies.dm:26)  may sleep
rt.def("/datum/species/zombie/infectious/proc/spec_life", function* spec_life(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "a_intent", live(f.args[0]), "harm");
	yield* g.callName(f, live(f.args[0]), "heal_overall_damage", [4, 4]);
	if (truthy(rt.op(f, "Prob", [], [4]))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("spooks")]), 50, 1, 10]);
	}
	if (!truthy((yield* g.callName(f, live(f.args[0]), "InCritical", [])))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "death", []);
	return f.dot;
}, true, { args: ["C"] });

// /datum/species/zombie/infectious/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/zombies.dm:37)  may sleep
rt.def("/datum/species/zombie/infectious/proc/on_species_gain", function* on_species_gain(f: Frame) {
	let infection: Value = null;
	f.vars = () => [infection];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	infection = null;
	if (truthy((infection = (yield* g.callName(f, live(f.args[0]), "getorganslot", ["zombie_infection"]))))) return f.dot;
	yield* g.callName(f, (infection = (yield* g.new_(f, T("/obj/item/organ/zombie_infection"), []))), "Insert", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["C", "old_species"] });

rt.type(4113, "/datum/species/krokodil_addict", "/datum/species", {
	name: "Human",
	id: "goofzombies",
	limbs_id: "zombie",
	sexes: 0,
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/zombie"),
	mutant_organs: null,
});

// /datum/species/krokodil_addict/proc/<init>  (code/modules/mob/living/carbon/human/species_types/zombies.dm:56)
rt.def("/datum/species/krokodil_addict/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutant_organs", rt.list(T("/obj/item/organ/tongue/zombie")));
	return f.dot;
});
