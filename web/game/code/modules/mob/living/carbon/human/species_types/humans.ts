// From code/modules/mob/living/carbon/human/species_types/humans.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/species/human/proc/<init>  (code/modules/mob/living/carbon/human/species_types/humans.dm:7)
rt.def("/datum/species/human/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(4, 2, 3, 5));
	rt.setSv(f, "mutant_bodyparts", rt.list("tail_human", "ears", "wings"));
	rt.setSv(f, "default_features", rt.alist(f, ["mcolor", "FFF", "tail_human", "None", "ears", "None", "wings", "None"]));
	return f.dot;
});

// /datum/species/human/proc/spec_death  (code/modules/mob/living/carbon/human/species_types/humans.dm:18)  may sleep
rt.def("/datum/species/human/proc/spec_death", function* spec_death(f: Frame, gibbed: Value, H: Value) {
	f.vars = () => [gibbed, H];
	if (!truthy(live(H))) return f.dot;
	yield* g.callName(f, live(H), "endTailWag", []);
	return f.dot;
}, true);

// /datum/species/human/proc/space_move  (code/modules/mob/living/carbon/human/species_types/humans.dm:21)
rt.def("/datum/species/human/proc/space_move", function space_move(f: Frame, H: Value) {
	let F: Value = null;
	f.vars = () => [F];
	if (!((truthy((rt.istype((F = rt.callName(f, live(H), "get_flightpack", [])), T("/obj/item/device/flightpack")) ? 1 : 0)) && truthy(rt.fv(f, "flight", live(F)))) && truthy(rt.callName(f, live(F), "allow_thrust", [0.009999999776482582, live(f.src)])))) return f.dot;
	return 1;
});

// /datum/species/human/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/humans.dm:26)  may sleep
rt.def("/datum/species/human/proc/on_species_gain", function* on_species_gain(f: Frame) {
	let tail: Value = null;
	f.vars = () => [tail];
	if (isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(f.args[0]))), "ears"), "Cat")) {
		rt.setSv(f, "mutantears", T("/obj/item/organ/ears/cat"));
	}
	if (isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(f.args[0]))), "tail_human"), "Cat")) {
		rt.modSrcVar(f, "mutant_organs", (tail = T("/obj/item/organ/tail/cat")), add);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["H", "old_species"] });
