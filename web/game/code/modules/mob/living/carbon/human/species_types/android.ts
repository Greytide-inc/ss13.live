// From code/modules/mob/living/carbon/human/species_types/android.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/species/android/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/android.dm:12)  may sleep
rt.def("/datum/species/android/proc/on_species_gain", function* on_species_gain(f: Frame) {
	let X: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [X, O, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	X = null;
	rt.forList(f, 0, rt.fv(f, "bodyparts", live(f.args[0])));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (O = live(X)), "change_bodypart_status", [2, 0, 1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["C"] });

// /datum/species/android/proc/on_species_loss  (code/modules/mob/living/carbon/human/species_types/android.dm:18)  may sleep
rt.def("/datum/species/android/proc/on_species_loss", function* on_species_loss(f: Frame) {
	let X: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [X, O, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	X = null;
	rt.forList(f, 0, rt.fv(f, "bodyparts", live(f.args[0])));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (O = live(X)), "change_bodypart_status", [1, 0, 1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["C"] });
