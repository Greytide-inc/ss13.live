// Based on /tg/station's code/modules/mob/living/carbon/human/species_types/lizardpeople.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// lizardpeople.dm:12
rt.def("/datum/species/lizard/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.species_traits = list(1, 4, 5);
	this.mutant_bodyparts = list("tail_lizard", "snout", "spines", "horns", "frills", "body_markings", "legs");
	this.default_features = rt.alist(f, ["mcolor", "0F0", "tail", "Smooth", "snout", "Round", "horns", "None", "frills", "None", "spines", "None", "body_markings", "None", "legs", "Normal Legs"]);
	return f.dot;
});

// lizardpeople.dm:21
rt.def("/datum/species/lizard/proc/after_equip_job", function* after_equip_job(f: Frame, J: Value, H: Value) {
	yield* H.grant_language(T("/datum/language/draconic"));
	return f.dot;
}, true);

// lizardpeople.dm:25
rt.def("/datum/species/lizard/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	if (unique) {
		return random_unique_lizard_name(gender);
	}
	let randname: Value = lizard_name(gender);
	if (lastname) {
		randname += ` ${lastname}`;
	}
	return randname;
});

// lizardpeople.dm:37
rt.def("/datum/species/lizard/proc/spec_death", function* spec_death(f: Frame, gibbed: Value, H: Value) {
	if (!H) return f.dot;
	yield* H.endTailWag();
	return f.dot;
}, true);
