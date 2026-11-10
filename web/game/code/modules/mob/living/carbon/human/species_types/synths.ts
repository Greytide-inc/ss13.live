// Based on /tg/station's code/modules/mob/living/carbon/human/species_types/synths.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(4109, "/datum/species/synth", "/datum/species", {
	initial_species_traits: null,
	disguise_fail_health: 75,
	fake_species: null,
	name: "Synth",
	id: "synth",
	say_mod: "beep boops",
	sexes: 0,
	species_traits: null,
	dangerous_existence: 1,
	blacklisted: 1,
	damage_overlay_type: "synth",
	limbs_id: "synth",
	meat: null,
});

// synths.dm:26
rt.def("/datum/species/synth/proc/on_species_gain", function* on_species_gain(f: Frame, H: Value, old_species: Value) {
	yield* parent_proc();
	yield* this.assume_disguise(old_species, H);
	return f.dot;
}, true);

// synths.dm:30
rt.def("/datum/species/synth/proc/handle_chemicals", function* handle_chemicals(f: Frame, chem: Value, H: Value) {
	if (chem.id == "synthflesh") {
		yield* chem.reaction_mob(H, TOUCH, 2, 0);
		yield* H.reagents.remove_reagent(chem.id, REAGENTS_METABOLISM);
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// synths.dm:39
rt.def("/datum/species/synth/proc/assume_disguise", function* assume_disguise(f: Frame, S: Value, H: Value) {
	let X: Value = null, BP: Value = null;
	if (S && !rt.op(f, "IsType", [], [S, this.type])) {
		this.name = S.name;
		this.say_mod = S.say_mod;
		this.sexes = S.sexes;
		this.species_traits = (yield* this.initial_species_traits.Copy());
		this.species_traits.Add(S.species_traits);
		this.attack_verb = S.attack_verb;
		this.attack_sound = S.attack_sound;
		this.miss_sound = S.miss_sound;
		this.meat = S.meat;
		this.mutant_bodyparts = (yield* S.mutant_bodyparts.Copy());
		this.mutant_organs = (yield* S.mutant_organs.Copy());
		this.default_features = (yield* S.default_features.Copy());
		this.nojumpsuit = S.nojumpsuit;
		this.no_equip = (yield* S.no_equip.Copy());
		this.limbs_id = S.limbs_id;
		this.use_skintones = S.use_skintones;
		this.fixed_mut_color = S.fixed_mut_color;
		this.hair_color = S.hair_color;
		this.fake_species = (yield* new_(S.type));
	} else {
		this.name = rt.initial(f, this, "name");
		this.say_mod = rt.initial(f, this, "say_mod");
		this.species_traits = (yield* this.initial_species_traits.Copy());
		this.attack_verb = rt.initial(f, this, "attack_verb");
		this.attack_sound = rt.initial(f, this, "attack_sound");
		this.miss_sound = rt.initial(f, this, "miss_sound");
		this.mutant_bodyparts = list();
		this.default_features = list();
		this.nojumpsuit = rt.initial(f, this, "nojumpsuit");
		this.no_equip = list();
		yield* qdel(this.fake_species);
		this.fake_species = null;
		this.meat = rt.initial(f, this, "meat");
		this.limbs_id = "synth";
		this.use_skintones = 0;
		this.sexes = 0;
		this.fixed_mut_color = "";
		this.hair_color = "";
	}
	for (X of each(H.bodyparts)) {
		(BP = X).update_limb();
	}
	yield* H.update_body_parts();
	return f.dot;
}, true);

// synths.dm:89
rt.def("/datum/species/synth/proc/handle_hair", function* handle_hair(f: Frame, H: Value, forced_colour: Value) {
	if (this.fake_species) {
		yield* this.fake_species.handle_hair(H, forced_colour);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// synths.dm:96
rt.def("/datum/species/synth/proc/handle_body", function* handle_body(f: Frame, H: Value) {
	if (this.fake_species) {
		yield* this.fake_species.handle_body(H);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// synths.dm:103
rt.def("/datum/species/synth/proc/handle_mutant_bodyparts", function* handle_mutant_bodyparts(f: Frame, H: Value, forced_colour: Value) {
	if (this.fake_species) {
		yield* this.fake_species.handle_body(H, forced_colour);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// synths.dm:110
rt.def("/datum/species/synth/proc/get_spans", function get_spans(f: Frame) {
	if (this.fake_species) {
		return this.fake_species.get_spans();
	}
	return list();
});

// synths.dm:115
rt.def("/datum/species/synth/proc/handle_speech", function handle_speech(f: Frame, message: Value, H: Value) {
	if (H.health > this.disguise_fail_health) {
		if (this.fake_species) {
			return this.fake_species.handle_speech(message, H);
		}
		return parent_proc();
	} else {
		return parent_proc();
	}
}, false);
