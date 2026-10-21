// From code/datums/diseases/advance/symptoms/heal.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(997, "/datum/symptom/heal", "/datum/symptom", {
	name: "Toxic Filter",
	stealth: 1,
	resistance: -4,
	stage_speed: -4,
	transmittable: -4,
	level: 6,
});

// /datum/symptom/heal/proc/Activate  (code/datums/diseases/advance/symptoms/heal.dm:28)  may sleep
rt.def("/datum/symptom/heal/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	M = rt.fv(f, "affected_mob", live(f.args[0]));
	$0 = rt.fv(f, "stage", live(f.args[0]));
	if ($0 === 4 || $0 === 5) {
		yield* g.srcCall(f, "Heal", live(M), live(f.args[0]));
	}
	return live(f.dot);
}, true, { args: ["A"] });

// /datum/symptom/heal/proc/Heal  (code/datums/diseases/advance/symptoms/heal.dm:38)  may sleep
rt.def("/datum/symptom/heal/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let heal_amt: Value = null;
	f.vars = () => [M, A, heal_amt];
	heal_amt = 0.5;
	if ((rt.gt(rt.fv(f, "toxloss", live(M)), 0) && truthy(rt.op(f, "Prob", [], [20])))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [rt.getStep(f, live(M), 0), "#66FF99"]);
	}
	yield* g.callName(f, live(M), "adjustToxLoss", [rt.neg(live(heal_amt))]);
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

// /datum/symptom/heal/plus/proc/Heal  (code/datums/diseases/advance/symptoms/heal.dm:69)  may sleep
rt.def("/datum/symptom/heal/plus/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let heal_amt: Value = null;
	f.vars = () => [M, A, heal_amt];
	heal_amt = 1;
	if ((rt.gt(rt.fv(f, "toxloss", live(M)), 0) && truthy(rt.op(f, "Prob", [], [20])))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [rt.getStep(f, live(M), 0), "#00FF00"]);
	}
	yield* g.callName(f, live(M), "adjustToxLoss", [rt.neg(live(heal_amt))]);
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

// /datum/symptom/heal/brute/proc/Heal  (code/datums/diseases/advance/symptoms/heal.dm:103)  may sleep
rt.def("/datum/symptom/heal/brute/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let heal_amt: Value = null, parts: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [M, A, heal_amt, parts, L, $e];
	heal_amt = 1;
	if (!truthy(rt.getLen(f, (parts = (yield* g.callName(f, live(M), "get_damaged_bodyparts", [1, 1])))))) {
		return live(f.dot);
	}
	L = null;
	rt.forList(f, 0, live(parts), T("/obj/item/bodypart"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((yield* g.callName(f, live(L), "heal_damage", [divide(live(heal_amt), rt.len(f, live(parts))), 0])))) {
			yield* g.callName(f, live(M), "update_damage_overlays", []);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [rt.getStep(f, live(M), 0), "#FF3333"]);
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

// /datum/symptom/heal/brute/plus/proc/Heal  (code/datums/diseases/advance/symptoms/heal.dm:146)  may sleep
rt.def("/datum/symptom/heal/brute/plus/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let heal_amt: Value = null, parts: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [M, A, heal_amt, parts, L, $e];
	heal_amt = 2;
	parts = (yield* g.callName(f, live(M), "get_damaged_bodyparts", [1, 1]));
	if (rt.gt((yield* g.callName(f, live(M), "getCloneLoss", [])), 0)) {
		yield* g.callName(f, live(M), "adjustCloneLoss", [-1]);
		yield* g.callName(f, live(M), "take_bodypart_damage", [0, 1]);
		yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [rt.getStep(f, live(M), 0), "#33FFCC"]);
	}
	if (!truthy(rt.len(f, live(parts)))) {
		return live(f.dot);
	}
	L = null;
	rt.forList(f, 0, live(parts), T("/obj/item/bodypart"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((yield* g.callName(f, live(L), "heal_damage", [divide(live(heal_amt), rt.len(f, live(parts))), 0])))) {
			yield* g.callName(f, live(M), "update_damage_overlays", []);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [rt.getStep(f, live(M), 0), "#CC1100"]);
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

// /datum/symptom/heal/burn/proc/Heal  (code/datums/diseases/advance/symptoms/heal.dm:194)  may sleep
rt.def("/datum/symptom/heal/burn/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let heal_amt: Value = null, parts: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [M, A, heal_amt, parts, L, $e];
	heal_amt = 1;
	if (!truthy(rt.getLen(f, (parts = (yield* g.callName(f, live(M), "get_damaged_bodyparts", [1, 1])))))) {
		return live(f.dot);
	}
	L = null;
	rt.forList(f, 0, live(parts), T("/obj/item/bodypart"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((yield* g.callName(f, live(L), "heal_damage", [0, divide(live(heal_amt), rt.len(f, live(parts)))])))) {
			yield* g.callName(f, live(M), "update_damage_overlays", []);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [rt.getStep(f, live(M), 0), "#FF9933"]);
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

// /datum/symptom/heal/burn/plus/proc/Heal  (code/datums/diseases/advance/symptoms/heal.dm:236)  may sleep
rt.def("/datum/symptom/heal/burn/plus/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let heal_amt: Value = null, parts: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [M, A, heal_amt, parts, L, $e];
	heal_amt = 2;
	parts = (yield* g.callName(f, live(M), "get_damaged_bodyparts", [1, 1]));
	if (rt.gt(rt.fv(f, "bodytemperature", live(M)), 310)) {
		rt.setFv(f, "bodytemperature", live(M), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(M)), multiply(multiply(10, live(heal_amt)), 1.5))])));
	} else {
		if (rt.lt(rt.fv(f, "bodytemperature", live(M)), 311)) {
			rt.setFv(f, "bodytemperature", live(M), (yield* g.call(f, P("/proc/min"), null, [310, add(rt.fv(f, "bodytemperature", live(M)), multiply(multiply(10, live(heal_amt)), 1.5))])));
		}
	}
	if (!truthy(rt.len(f, live(parts)))) {
		return live(f.dot);
	}
	L = null;
	rt.forList(f, 0, live(parts), T("/obj/item/bodypart"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((yield* g.callName(f, live(L), "heal_damage", [0, divide(live(heal_amt), rt.len(f, live(parts)))])))) {
			yield* g.callName(f, live(M), "update_damage_overlays", []);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [rt.getStep(f, live(M), 0), "#CC6600"]);
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

// /datum/symptom/heal/dna/proc/Heal  (code/datums/diseases/advance/symptoms/heal.dm:283)  may sleep
rt.def("/datum/symptom/heal/dna/proc/Heal", function* Heal(f: Frame, M: Value, A: Value) {
	let amt_healed: Value = null, unclean_mutations: Value = null;
	f.vars = () => [M, A, amt_healed, unclean_mutations];
	amt_healed = 1;
	yield* g.callName(f, live(M), "adjustBrainLoss", [rt.neg(live(amt_healed))]);
	unclean_mutations = subtract(rt.bitOr(rt.gl("not_good_mutations"), rt.gl("bad_mutations")), rt.at(rt.gl("mutations_list"), "Monkified"));
	yield* g.callName(f, rt.fv(f, "dna", live(M)), "remove_mutation_group", [live(unclean_mutations)]);
	rt.setFv(f, "radiation", live(M), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "radiation", live(M)), multiply(2, live(amt_healed))), 0])));
	return 1;
}, true);
