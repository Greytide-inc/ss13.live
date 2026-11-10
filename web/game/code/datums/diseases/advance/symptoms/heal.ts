// Based on /tg/station's code/datums/diseases/advance/symptoms/heal.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(997, "/datum/symptom/heal", "/datum/symptom", {
	name: "Toxic Filter",
	stealth: 1,
	resistance: -4,
	stage_speed: -4,
	transmittable: -4,
	level: 6,
});

// heal.dm:28
rt.def("/datum/symptom/heal/proc/Activate", function* Activate(f: Frame, A: Value) {
	yield* parent_proc();
	let M: Value = A.affected_mob;
	if (A.stage === 4 || A.stage === 5) {
		yield* this.Heal(M, A);
	}
	return f.dot;
}, true);

// heal.dm:38
rt.def("/datum/symptom/heal/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let heal_amt: Value = 0.5;
	if (M.toxloss > 0 && prob(20)) {
		yield* new_(T("/obj/effect/temp_visual/heal"), rt.getStep(f, M, 0), "#66FF99");
	}
	yield* M.adjustToxLoss(-heal_amt);
	return 1;
}, true);

rt.type(998, "/datum/symptom/heal/plus", "/datum/symptom/heal", {
	name: "Apoptoxin filter",
	stealth: 0,
	resistance: -2,
	stage_speed: -2,
	transmittable: -2,
	level: 8,
});

// heal.dm:69
rt.def("/datum/symptom/heal/plus/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let heal_amt: Value = 1;
	if (M.toxloss > 0 && prob(20)) {
		yield* new_(T("/obj/effect/temp_visual/heal"), rt.getStep(f, M, 0), "#00FF00");
	}
	yield* M.adjustToxLoss(-heal_amt);
	return 1;
}, true);

rt.type(999, "/datum/symptom/heal/brute", "/datum/symptom/heal", {
	name: "Regeneration",
	stealth: 1,
	resistance: -4,
	stage_speed: -4,
	transmittable: -4,
	level: 6,
});

// heal.dm:103
rt.def("/datum/symptom/heal/brute/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let parts: Value = null, L: Value = null;
	let heal_amt: Value = 1;
	if (!rt.len(f, (parts = M.get_damaged_bodyparts(1, 1)))) {
		return f.dot;
	}
	for (L of each(parts, T("/obj/item/bodypart"))) {
		if (yield* L.heal_damage(heal_amt / rt.len(f, parts), 0)) {
			M.update_damage_overlays();
		}
	}
	if (prob(20)) {
		yield* new_(T("/obj/effect/temp_visual/heal"), rt.getStep(f, M, 0), "#FF3333");
	}
	return 1;
}, true);

rt.type(1000, "/datum/symptom/heal/brute/plus", "/datum/symptom/heal/brute", {
	name: "Flesh Mending",
	stealth: 0,
	resistance: 0,
	stage_speed: -2,
	transmittable: -2,
	level: 8,
});

// heal.dm:146
rt.def("/datum/symptom/heal/brute/plus/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let L: Value = null;
	let heal_amt: Value = 2;
	let parts: Value = M.get_damaged_bodyparts(1, 1);
	if (M.getCloneLoss() > 0) {
		yield* M.adjustCloneLoss(-1);
		yield* M.take_bodypart_damage(0, 1);
		yield* new_(T("/obj/effect/temp_visual/heal"), rt.getStep(f, M, 0), "#33FFCC");
	}
	if (!rt.len(f, parts)) {
		return f.dot;
	}
	for (L of each(parts, T("/obj/item/bodypart"))) {
		if (yield* L.heal_damage(heal_amt / rt.len(f, parts), 0)) {
			M.update_damage_overlays();
		}
	}
	if (prob(20)) {
		yield* new_(T("/obj/effect/temp_visual/heal"), rt.getStep(f, M, 0), "#CC1100");
	}
	return 1;
}, true);

rt.type(1001, "/datum/symptom/heal/burn", "/datum/symptom/heal", {
	name: "Tissue Regrowth",
	stealth: 1,
	resistance: -4,
	stage_speed: -4,
	transmittable: -4,
	level: 6,
});

// heal.dm:194
rt.def("/datum/symptom/heal/burn/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let parts: Value = null, L: Value = null;
	let heal_amt: Value = 1;
	if (!rt.len(f, (parts = M.get_damaged_bodyparts(1, 1)))) {
		return f.dot;
	}
	for (L of each(parts, T("/obj/item/bodypart"))) {
		if (yield* L.heal_damage(0, heal_amt / rt.len(f, parts))) {
			M.update_damage_overlays();
		}
	}
	if (prob(20)) {
		yield* new_(T("/obj/effect/temp_visual/heal"), rt.getStep(f, M, 0), "#FF9933");
	}
	return 1;
}, true);

rt.type(1002, "/datum/symptom/heal/burn/plus", "/datum/symptom/heal/burn", {
	name: "Heat Resistance",
	stealth: 0,
	resistance: 0,
	stage_speed: -2,
	transmittable: -2,
	level: 8,
});

// heal.dm:236
rt.def("/datum/symptom/heal/burn/plus/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let L: Value = null;
	let heal_amt: Value = 2;
	let parts: Value = M.get_damaged_bodyparts(1, 1);
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 10 * heal_amt * TEMPERATURE_DAMAGE_COEFFICIENT);
	} else if (M.bodytemperature < 311) {
		M.bodytemperature = min(310, M.bodytemperature + 10 * heal_amt * TEMPERATURE_DAMAGE_COEFFICIENT);
	}
	if (!rt.len(f, parts)) {
		return f.dot;
	}
	for (L of each(parts, T("/obj/item/bodypart"))) {
		if (yield* L.heal_damage(0, heal_amt / rt.len(f, parts))) {
			M.update_damage_overlays();
		}
	}
	if (prob(20)) {
		yield* new_(T("/obj/effect/temp_visual/heal"), rt.getStep(f, M, 0), "#CC6600");
	}
	return 1;
}, true);

rt.type(1003, "/datum/symptom/heal/dna", "/datum/symptom/heal", {
	name: "Deoxyribonucleic Acid Restoration",
	stealth: -1,
	resistance: -1,
	stage_speed: 0,
	transmittable: -3,
	level: 5,
});

// heal.dm:283
rt.def("/datum/symptom/heal/dna/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let amt_healed: Value = 1;
	yield* M.adjustBrainLoss(-amt_healed);
	let unclean_mutations: Value = rt.bitOr(GLOB.not_good_mutations, GLOB.bad_mutations) - rt.at(GLOB.mutations_list, "Monkified");
	yield* M.dna.remove_mutation_group(unclean_mutations);
	M.radiation = max(M.radiation - 2 * amt_healed, 0);
	return 1;
}, true);
