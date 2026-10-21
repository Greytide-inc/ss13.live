// From code/modules/mob/living/carbon/human/species_types/synths.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/species/synth/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/synths.dm:26)  may sleep
rt.def("/datum/species/synth/proc/on_species_gain", function* on_species_gain(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "assume_disguise", live(f.args[1]), live(f.args[0]));
	return f.dot;
}, true, { args: ["H", "old_species"] });

// /datum/species/synth/proc/handle_chemicals  (code/modules/mob/living/carbon/human/species_types/synths.dm:30)  may sleep
rt.def("/datum/species/synth/proc/handle_chemicals", function* handle_chemicals(f: Frame) {
	if (isEqual(rt.fv(f, "id", live(f.args[0])), "synthflesh")) {
		yield* g.callName(f, live(f.args[0]), "reaction_mob", [live(f.args[1]), 1, 2, 0]);
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[1])), "remove_reagent", [rt.fv(f, "id", live(f.args[0])), 0.4000000059604645]);
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["chem", "H"] });

// /datum/species/synth/proc/assume_disguise  (code/modules/mob/living/carbon/human/species_types/synths.dm:39)  may sleep
rt.def("/datum/species/synth/proc/assume_disguise", function* assume_disguise(f: Frame, S: Value, H: Value) {
	let X: Value = null, BP: Value = null;
	let $e: any;
	f.vars = () => [S, H, X, BP, $e];
	if ((truthy(live(S)) && !truthy(rt.op(f, "IsType", [], [live(S), rt.sv(f, "type")])))) {
		rt.setSv(f, "name", rt.fv(f, "name", live(S)));
		rt.setSv(f, "say_mod", rt.fv(f, "say_mod", live(S)));
		rt.setSv(f, "sexes", rt.fv(f, "sexes", live(S)));
		rt.setSv(f, "species_traits", (yield* g.callName(f, rt.sv(f, "initial_species_traits"), "Copy", [])));
		yield* g.callName(f, rt.sv(f, "species_traits"), "Add", [rt.fv(f, "species_traits", live(S))]);
		rt.setSv(f, "attack_verb", rt.fv(f, "attack_verb", live(S)));
		rt.setSv(f, "attack_sound", rt.fv(f, "attack_sound", live(S)));
		rt.setSv(f, "miss_sound", rt.fv(f, "miss_sound", live(S)));
		rt.setSv(f, "meat", rt.fv(f, "meat", live(S)));
		rt.setSv(f, "mutant_bodyparts", (yield* g.callName(f, rt.fv(f, "mutant_bodyparts", live(S)), "Copy", [])));
		rt.setSv(f, "mutant_organs", (yield* g.callName(f, rt.fv(f, "mutant_organs", live(S)), "Copy", [])));
		rt.setSv(f, "default_features", (yield* g.callName(f, rt.fv(f, "default_features", live(S)), "Copy", [])));
		rt.setSv(f, "nojumpsuit", rt.fv(f, "nojumpsuit", live(S)));
		rt.setSv(f, "no_equip", (yield* g.callName(f, rt.fv(f, "no_equip", live(S)), "Copy", [])));
		rt.setSv(f, "limbs_id", rt.fv(f, "limbs_id", live(S)));
		rt.setSv(f, "use_skintones", rt.fv(f, "use_skintones", live(S)));
		rt.setSv(f, "fixed_mut_color", rt.fv(f, "fixed_mut_color", live(S)));
		rt.setSv(f, "hair_color", rt.fv(f, "hair_color", live(S)));
		rt.setSv(f, "fake_species", (yield* g.new_(f, rt.fv(f, "type", live(S)), [])));
	} else {
		rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
		rt.setSv(f, "say_mod", rt.initial(f, live(f.src), "say_mod"));
		rt.setSv(f, "species_traits", (yield* g.callName(f, rt.sv(f, "initial_species_traits"), "Copy", [])));
		rt.setSv(f, "attack_verb", rt.initial(f, live(f.src), "attack_verb"));
		rt.setSv(f, "attack_sound", rt.initial(f, live(f.src), "attack_sound"));
		rt.setSv(f, "miss_sound", rt.initial(f, live(f.src), "miss_sound"));
		rt.setSv(f, "mutant_bodyparts", rt.list());
		rt.setSv(f, "default_features", rt.list());
		rt.setSv(f, "nojumpsuit", rt.initial(f, live(f.src), "nojumpsuit"));
		rt.setSv(f, "no_equip", rt.list());
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "fake_species")]);
		rt.setSv(f, "fake_species", null);
		rt.setSv(f, "meat", rt.initial(f, live(f.src), "meat"));
		rt.setSv(f, "limbs_id", "synth");
		rt.setSv(f, "use_skintones", 0);
		rt.setSv(f, "sexes", 0);
		rt.setSv(f, "fixed_mut_color", "");
		rt.setSv(f, "hair_color", "");
	}
	X = null;
	rt.forList(f, 0, rt.fv(f, "bodyparts", live(H)));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (BP = live(X)), "update_limb", []);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(H), "update_body_parts", []);
	return f.dot;
}, true);

// /datum/species/synth/proc/handle_hair  (code/modules/mob/living/carbon/human/species_types/synths.dm:89)  may sleep
rt.def("/datum/species/synth/proc/handle_hair", function* handle_hair(f: Frame) {
	if (truthy(rt.sv(f, "fake_species"))) {
		yield* g.callName(f, rt.sv(f, "fake_species"), "handle_hair", [live(f.args[0]), live(f.args[1])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["H", "forced_colour"] });

// /datum/species/synth/proc/handle_body  (code/modules/mob/living/carbon/human/species_types/synths.dm:96)  may sleep
rt.def("/datum/species/synth/proc/handle_body", function* handle_body(f: Frame) {
	if (truthy(rt.sv(f, "fake_species"))) {
		yield* g.callName(f, rt.sv(f, "fake_species"), "handle_body", [live(f.args[0])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["H"] });

// /datum/species/synth/proc/handle_mutant_bodyparts  (code/modules/mob/living/carbon/human/species_types/synths.dm:103)  may sleep
rt.def("/datum/species/synth/proc/handle_mutant_bodyparts", function* handle_mutant_bodyparts(f: Frame) {
	if (truthy(rt.sv(f, "fake_species"))) {
		yield* g.callName(f, rt.sv(f, "fake_species"), "handle_body", [live(f.args[0]), live(f.args[1])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["H", "forced_colour"] });

// /datum/species/synth/proc/get_spans  (code/modules/mob/living/carbon/human/species_types/synths.dm:110)
rt.def("/datum/species/synth/proc/get_spans", function get_spans(f: Frame) {
	if (truthy(rt.sv(f, "fake_species"))) {
		return rt.callName(f, rt.sv(f, "fake_species"), "get_spans", []);
	}
	return rt.list();
});

// /datum/species/synth/proc/handle_speech  (code/modules/mob/living/carbon/human/species_types/synths.dm:115)
rt.def("/datum/species/synth/proc/handle_speech", function handle_speech(f: Frame) {
	if (rt.gt(rt.fv(f, "health", live(f.args[1])), rt.sv(f, "disguise_fail_health"))) {
		if (truthy(rt.sv(f, "fake_species"))) {
			return rt.callName(f, rt.sv(f, "fake_species"), "handle_speech", [live(f.args[0]), live(f.args[1])]);
		}
		return rt.callSuper(f, [], rt.Args.Same);
	} else {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["message", "H"] });
