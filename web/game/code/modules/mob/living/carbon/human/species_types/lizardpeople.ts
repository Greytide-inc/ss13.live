// From code/modules/mob/living/carbon/human/species_types/lizardpeople.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4103, "/datum/species/lizard", "/datum/species", {
	name: "Lizardperson",
	id: "lizard",
	say_mod: "hisses",
	default_color: "00FF00",
	species_traits: null,
	mutant_bodyparts: null,
	coldmod: 1.5,
	heatmod: 0.67,
	default_features: null,
	attack_verb: "slash",
	attack_sound: rt.rsc("sound/weapons/slash.ogg"),
	miss_sound: rt.rsc("sound/weapons/slashmiss.ogg"),
	exotic_bloodtype: "L",
	mutanttongue: rt.typePath("/obj/item/organ/tongue/lizard"),
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/lizard"),
	skinned_type: rt.typePath("/obj/item/stack/sheet/animalhide/lizard"),
});

// /datum/species/lizard/proc/<init>  (code/modules/mob/living/carbon/human/species_types/lizardpeople.dm:12)
rt.def("/datum/species/lizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(1, 4, 5));
	rt.setSv(f, "mutant_bodyparts", rt.list("tail_lizard", "snout", "spines", "horns", "frills", "body_markings", "legs"));
	rt.setSv(f, "default_features", rt.alist(f, ["mcolor", "0F0", "tail", "Smooth", "snout", "Round", "horns", "None", "frills", "None", "spines", "None", "body_markings", "None", "legs", "Normal Legs"]));
	return f.dot;
});

// /datum/species/lizard/proc/after_equip_job  (code/modules/mob/living/carbon/human/species_types/lizardpeople.dm:21)  may sleep
rt.def("/datum/species/lizard/proc/after_equip_job", function* after_equip_job(f: Frame, J: Value, H: Value) {
	f.vars = () => [J, H];
	yield* g.callName(f, live(H), "grant_language", [T("/datum/language/draconic")]);
	return f.dot;
}, true);

// /datum/species/lizard/proc/random_name  (code/modules/mob/living/carbon/human/species_types/lizardpeople.dm:25)
rt.def("/datum/species/lizard/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	let randname: Value = null;
	f.vars = () => [randname];
	if (truthy(live(unique))) {
		return rt.call(f, P("/proc/random_unique_lizard_name"), null, [live(gender)]);
	}
	randname = rt.call(f, P("/proc/lizard_name"), null, [live(gender)]);
	if (truthy(live(lastname))) {
		randname = rt.modify(live(randname), fmt(" ＀", [live(lastname)]), add);
	}
	return live(randname);
});

// /datum/species/lizard/proc/spec_death  (code/modules/mob/living/carbon/human/species_types/lizardpeople.dm:37)  may sleep
rt.def("/datum/species/lizard/proc/spec_death", function* spec_death(f: Frame, gibbed: Value, H: Value) {
	f.vars = () => [gibbed, H];
	if (!truthy(live(H))) return f.dot;
	yield* g.callName(f, live(H), "endTailWag", []);
	return f.dot;
}, true);
