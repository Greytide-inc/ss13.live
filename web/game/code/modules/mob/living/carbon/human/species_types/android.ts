// Based on /tg/station's code/modules/mob/living/carbon/human/species_types/android.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(4076, "/datum/species/android", "/datum/species", {
	name: "Android",
	id: "android",
	say_mod: "states",
	species_traits: null,
	damage_overlay_type: "synth",
	limbs_id: "synth",
	meat: null,
	mutanttongue: rt.typePath("/obj/item/organ/tongue/robot"),
});

// android.dm:12
rt.def("/datum/species/android/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value) {
	let X: Value = null, O: Value = null;
	f.dot = (yield* parent_proc());
	for (X of each(C.bodyparts)) {
		yield* (O = X).change_bodypart_status(BODYPART_ROBOTIC, 0, 1);
	}
	return f.dot;
}, true);

// android.dm:18
rt.def("/datum/species/android/proc/on_species_loss", function* on_species_loss(f: Frame, C: Value) {
	let X: Value = null, O: Value = null;
	f.dot = (yield* parent_proc());
	for (X of each(C.bodyparts)) {
		yield* (O = X).change_bodypart_status(1, 0, 1);
	}
	return f.dot;
}, true);
