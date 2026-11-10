// Based on /tg/station's code/modules/mob/living/carbon/human/species_types/humans.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4100, "/datum/species/human", "/datum/species", {
	name: "Human",
	id: "human",
	default_color: "FFFFFF",
	species_traits: null,
	mutant_bodyparts: null,
	default_features: null,
	use_skintones: 1,
	skinned_type: rt.typePath("/obj/item/stack/sheet/animalhide/human"),
});

// humans.dm:7
rt.def("/datum/species/human/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.species_traits = list(4, 2, 3, 5);
	this.mutant_bodyparts = list("tail_human", "ears", "wings");
	this.default_features = rt.alist(f, ["mcolor", "FFF", "tail_human", "None", "ears", "None", "wings", "None"]);
	return f.dot;
});

// humans.dm:18
rt.def("/datum/species/human/proc/spec_death", function* spec_death(f: Frame, gibbed: Value, H: Value) {
	if (!H) return f.dot;
	yield* H.endTailWag();
	return f.dot;
}, true);

// humans.dm:21
rt.def("/datum/species/human/proc/space_move", function space_move(f: Frame, H: Value) {
	let F: Value = null;
	if (!(rt.istype((F = H.get_flightpack()), T("/obj/item/device/flightpack")) && F.flight && F.allow_thrust(0.01, this))) return f.dot;
	return 1;
});

// humans.dm:26
rt.def("/datum/species/human/proc/on_species_gain", function* on_species_gain(f: Frame, H: Value, old_species: Value) {
	let tail: Value = null;
	if (rt.index(H.dna.features, "ears") == "Cat") {
		this.mutantears = T("/obj/item/organ/ears/cat");
	}
	if (rt.index(H.dna.features, "tail_human") == "Cat") {
		this.mutant_organs += (tail = T("/obj/item/organ/tail/cat"));
	}
	yield* parent_proc();
	return f.dot;
}, true);
