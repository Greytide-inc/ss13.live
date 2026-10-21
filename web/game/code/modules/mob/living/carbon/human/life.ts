// From code/modules/mob/living/carbon/human/life.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/Life  (code/modules/mob/living/carbon/human/life.dm:32)  may sleep
rt.def("/mob/living/carbon/human/proc/Life", function* Life(f: Frame) {
	let HM: Value = null;
	let $e: any;
	f.vars = () => [HM, $e];
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		HM = null;
		rt.forList(f, 0, rt.fv(f, "mutations", rt.sv(f, "dna")), T("/datum/mutation/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			HM = $e;
			yield* g.callName(f, live(HM), "on_life", [live(f.src)]);
		}
		rt.endFor(f, 0);
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "handle_heart");
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "handle_embedded_objects");
	}
	rt.setSv(f, "name", (yield* g.srcCall(f, "get_visible_name")));
	yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "spec_life", [live(f.src)]);
	if (isEqual(rt.sv(f, "stat"), 2)) return f.dot;
	return 1;
}, true, { waitfor: false });

// /mob/living/carbon/human/proc/calculate_affecting_pressure  (code/modules/mob/living/carbon/human/life.dm:54)
rt.def("/mob/living/carbon/human/proc/calculate_affecting_pressure", function calculate_affecting_pressure(f: Frame, pressure: Value) {
	if (((truthy(rt.sv(f, "wear_suit")) && truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "wear_suit")), 1))) && (truthy(rt.sv(f, "head")) && truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "head")), 1))))) {
		return 101.32499694824219;
	} else {
		return live(pressure);
	}
	return f.dot;
});

// /mob/living/carbon/human/proc/handle_disabilities  (code/modules/mob/living/carbon/human/life.dm:62)  may sleep
rt.def("/mob/living/carbon/human/proc/handle_disabilities", function* handle_disabilities(f: Frame) {
	if (truthy(rt.sv(f, "eye_blind"))) {
		if (rt.ge(rt.sv(f, "tinttotal"), 3)) {
			yield* g.srcCall(f, "adjust_blindness", -3);
		} else {
			yield* g.srcCall(f, "adjust_blindness", -1);
		}
	} else {
		if (truthy(rt.sv(f, "eye_blurry"))) {
			yield* g.srcCall(f, "adjust_blurriness", -1);
		}
	}
	if (!(rt.ge((yield* g.srcCall(f, "getBrainLoss")), 60) && !isEqual(rt.sv(f, "stat"), 2))) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [3]))) return f.dot;
	if (truthy(rt.op(f, "Prob", [], [25]))) {
		yield* g.srcCall(f, "emote", "drool");
	} else {
		yield* g.srcCall(f, "say", (yield* g.call(f, P("/proc/strings_replacement"), null, ["brain_damage_lines.json", "brain_damage"])));
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/handle_mutations_and_radiation  (code/modules/mob/living/carbon/human/life.dm:78)  may sleep
rt.def("/mob/living/carbon/human/proc/handle_mutations_and_radiation", function* handle_mutations_and_radiation(f: Frame) {
	if (!(!truthy(rt.sv(f, "dna")) || !truthy((yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "handle_mutations_and_radiation", [live(f.src)]))))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/breathe  (code/modules/mob/living/carbon/human/life.dm:82)  may sleep
rt.def("/mob/living/carbon/human/proc/breathe", function* breathe(f: Frame) {
	if (truthy((yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "breathe", [live(f.src)])))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/check_breath  (code/modules/mob/living/carbon/human/life.dm:88)  may sleep
rt.def("/mob/living/carbon/human/proc/check_breath", function* check_breath(f: Frame, breath: Value) {
	let L: Value = null, S: Value = null, lun: Value = null;
	f.vars = () => [breath, L, S, lun];
	if (!truthy((L = (yield* g.srcCall(f, "getorganslot", "lungs"))))) {
		if (rt.ge(rt.sv(f, "health"), 0)) {
			yield* g.srcCall(f, "adjustOxyLoss", 4);
		} else {
			if (!truthy((rt.isIn(f, 20, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
				yield* g.srcCall(f, "adjustOxyLoss", divide(rt.fv(f, "wait", rt.gl("SSmobs")), 30));
			}
		}
		rt.setSv(f, "failed_last_breath", 1);
		if ((truthy(rt.sv(f, "dna")) && truthy(rt.fv(f, "species", rt.sv(f, "dna"))))) {
			if (isEqual(rt.gv(f, "breathid", (S = rt.fv(f, "species", rt.sv(f, "dna")))), "o2")) {
				yield* g.srcCall(f, "throw_alert", "oxy", T("/obj/screen/alert/oxy"));
			} else {
				if (isEqual(rt.fv(f, "breathid", live(S)), "tox")) {
					yield* g.srcCall(f, "throw_alert", "not_enough_tox", T("/obj/screen/alert/not_enough_tox"));
				} else {
					if (isEqual(rt.fv(f, "breathid", live(S)), "co2")) {
						yield* g.srcCall(f, "throw_alert", "not_enough_co2", T("/obj/screen/alert/not_enough_co2"));
					}
				}
			}
		}
		return 0;
	} else {
		if (!truthy((rt.istype(live(L), T("/obj/item/organ/lungs")) ? 1 : 0))) return f.dot;
		yield* g.callName(f, (lun = live(L)), "check_breath", [live(breath), live(f.src)]);
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/handle_environment  (code/modules/mob/living/carbon/human/life.dm:118)  may sleep
rt.def("/mob/living/carbon/human/proc/handle_environment", function* handle_environment(f: Frame, environment: Value) {
	f.vars = () => [environment];
	yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "handle_environment", [live(environment), live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/handle_fire  (code/modules/mob/living/carbon/human/life.dm:122)  may sleep
rt.def("/mob/living/carbon/human/proc/handle_fire", function* handle_fire(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "dna"))) return f.dot;
	yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "handle_fire", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/get_thermal_protection  (code/modules/mob/living/carbon/human/life.dm:129)
rt.def("/mob/living/carbon/human/proc/get_thermal_protection", function get_thermal_protection(f: Frame) {
	let thermal_protection: Value = null;
	f.vars = () => [thermal_protection];
	thermal_protection = 0;
	if (truthy(rt.sv(f, "wear_suit"))) {
		if (rt.ge(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "wear_suit")), 30000)) {
			thermal_protection = rt.modify(live(thermal_protection), multiply(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "wear_suit")), 0.699999988079071), add);
		}
	}
	if (truthy(rt.sv(f, "head"))) {
		if (rt.ge(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "head")), 30000)) {
			thermal_protection = rt.modify(live(thermal_protection), multiply(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "head")), 0.30000001192092896), add);
		}
	}
	return (thermal_protection = rt.call(f, P("/proc/round"), null, [live(thermal_protection)]));
});

// /mob/living/carbon/human/proc/IgniteMob  (code/modules/mob/living/carbon/human/life.dm:140)  may sleep
rt.def("/mob/living/carbon/human/proc/IgniteMob", function* IgniteMob(f: Frame) {
	if ((!truthy(rt.sv(f, "dna")) || truthy((yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "CanIgniteMob", [live(f.src)]))))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	f.dot = 0;
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/ExtinguishMob  (code/modules/mob/living/carbon/human/life.dm:145)  may sleep
rt.def("/mob/living/carbon/human/proc/ExtinguishMob", function* ExtinguishMob(f: Frame) {
	if (!(!truthy(rt.sv(f, "dna")) || !truthy((yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "ExtinguishMob", [live(f.src)]))))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/get_heat_protection_flags  (code/modules/mob/living/carbon/human/life.dm:155)
rt.def("/mob/living/carbon/human/proc/get_heat_protection_flags", function get_heat_protection_flags(f: Frame, temperature: Value) {
	let thermal_protection_flags: Value = null;
	f.vars = () => [thermal_protection_flags];
	thermal_protection_flags = 0;
	if (truthy(rt.sv(f, "head"))) {
		if ((truthy(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "head"))) && rt.ge(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "head")), live(temperature)))) {
			(thermal_protection_flags = rt.modify(live(thermal_protection_flags), rt.fv(f, "heat_protection", rt.sv(f, "head")), rt.bitOr));
		}
	}
	if (truthy(rt.sv(f, "wear_suit"))) {
		if ((truthy(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "wear_suit"))) && rt.ge(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "wear_suit")), live(temperature)))) {
			(thermal_protection_flags = rt.modify(live(thermal_protection_flags), rt.fv(f, "heat_protection", rt.sv(f, "wear_suit")), rt.bitOr));
		}
	}
	if (truthy(rt.sv(f, "w_uniform"))) {
		if ((truthy(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "w_uniform"))) && rt.ge(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "w_uniform")), live(temperature)))) {
			(thermal_protection_flags = rt.modify(live(thermal_protection_flags), rt.fv(f, "heat_protection", rt.sv(f, "w_uniform")), rt.bitOr));
		}
	}
	if (truthy(rt.sv(f, "shoes"))) {
		if ((truthy(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "shoes"))) && rt.ge(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "shoes")), live(temperature)))) {
			(thermal_protection_flags = rt.modify(live(thermal_protection_flags), rt.fv(f, "heat_protection", rt.sv(f, "shoes")), rt.bitOr));
		}
	}
	if (truthy(rt.sv(f, "gloves"))) {
		if ((truthy(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "gloves"))) && rt.ge(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "gloves")), live(temperature)))) {
			(thermal_protection_flags = rt.modify(live(thermal_protection_flags), rt.fv(f, "heat_protection", rt.sv(f, "gloves")), rt.bitOr));
		}
	}
	if (truthy(rt.sv(f, "wear_mask"))) {
		if ((truthy(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "wear_mask"))) && rt.ge(rt.fv(f, "max_heat_protection_temperature", rt.sv(f, "wear_mask")), live(temperature)))) {
			(thermal_protection_flags = rt.modify(live(thermal_protection_flags), rt.fv(f, "heat_protection", rt.sv(f, "wear_mask")), rt.bitOr));
		}
	}
	return live(thermal_protection_flags);
});

// /mob/living/carbon/human/proc/get_heat_protection  (code/modules/mob/living/carbon/human/life.dm:176)
rt.def("/mob/living/carbon/human/proc/get_heat_protection", function get_heat_protection(f: Frame, temperature: Value) {
	let thermal_protection_flags: Value = null, thermal_protection: Value = null;
	f.vars = () => [thermal_protection_flags, thermal_protection];
	thermal_protection_flags = rt.callSrc(f, "get_heat_protection_flags", [live(temperature)]);
	thermal_protection = 0;
	if (truthy(live(thermal_protection_flags))) {
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 1))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.30000001192092896, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 2))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.15000000596046448, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 4))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.15000000596046448, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 8))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.07500000298023224, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 16))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.07500000298023224, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 32))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.02500000037252903, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 64))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.02500000037252903, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 128))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.07500000298023224, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 256))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.07500000298023224, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 512))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.02500000037252903, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 1024))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.02500000037252903, add);
		}
	}
	return rt.call(f, P("/proc/min"), null, [1, live(thermal_protection)]);
});

// /mob/living/carbon/human/proc/get_cold_protection_flags  (code/modules/mob/living/carbon/human/life.dm:212)
rt.def("/mob/living/carbon/human/proc/get_cold_protection_flags", function get_cold_protection_flags(f: Frame, temperature: Value) {
	let thermal_protection_flags: Value = null;
	f.vars = () => [thermal_protection_flags];
	thermal_protection_flags = 0;
	if (truthy(rt.sv(f, "head"))) {
		if ((truthy(rt.fv(f, "min_cold_protection_temperature", rt.sv(f, "head"))) && rt.le(rt.fv(f, "min_cold_protection_temperature", rt.sv(f, "head")), live(temperature)))) {
			(thermal_protection_flags = rt.modify(live(thermal_protection_flags), rt.fv(f, "cold_protection", rt.sv(f, "head")), rt.bitOr));
		}
	}
	if (truthy(rt.sv(f, "wear_suit"))) {
		if ((truthy(rt.fv(f, "min_cold_protection_temperature", rt.sv(f, "wear_suit"))) && rt.le(rt.fv(f, "min_cold_protection_temperature", rt.sv(f, "wear_suit")), live(temperature)))) {
			(thermal_protection_flags = rt.modify(live(thermal_protection_flags), rt.fv(f, "cold_protection", rt.sv(f, "wear_suit")), rt.bitOr));
		}
	}
	if (truthy(rt.sv(f, "w_uniform"))) {
		if ((truthy(rt.fv(f, "min_cold_protection_temperature", rt.sv(f, "w_uniform"))) && rt.le(rt.fv(f, "min_cold_protection_temperature", rt.sv(f, "w_uniform")), live(temperature)))) {
			(thermal_protection_flags = rt.modify(live(thermal_protection_flags), rt.fv(f, "cold_protection", rt.sv(f, "w_uniform")), rt.bitOr));
		}
	}
	if (truthy(rt.sv(f, "shoes"))) {
		if ((truthy(rt.fv(f, "min_cold_protection_temperature", rt.sv(f, "shoes"))) && rt.le(rt.fv(f, "min_cold_protection_temperature", rt.sv(f, "shoes")), live(temperature)))) {
			(thermal_protection_flags = rt.modify(live(thermal_protection_flags), rt.fv(f, "cold_protection", rt.sv(f, "shoes")), rt.bitOr));
		}
	}
	if (truthy(rt.sv(f, "gloves"))) {
		if ((truthy(rt.fv(f, "min_cold_protection_temperature", rt.sv(f, "gloves"))) && rt.le(rt.fv(f, "min_cold_protection_temperature", rt.sv(f, "gloves")), live(temperature)))) {
			(thermal_protection_flags = rt.modify(live(thermal_protection_flags), rt.fv(f, "cold_protection", rt.sv(f, "gloves")), rt.bitOr));
		}
	}
	if (truthy(rt.sv(f, "wear_mask"))) {
		if ((truthy(rt.fv(f, "min_cold_protection_temperature", rt.sv(f, "wear_mask"))) && rt.le(rt.fv(f, "min_cold_protection_temperature", rt.sv(f, "wear_mask")), live(temperature)))) {
			(thermal_protection_flags = rt.modify(live(thermal_protection_flags), rt.fv(f, "cold_protection", rt.sv(f, "wear_mask")), rt.bitOr));
		}
	}
	return live(thermal_protection_flags);
});

// /mob/living/carbon/human/proc/get_cold_protection  (code/modules/mob/living/carbon/human/life.dm:234)
rt.def("/mob/living/carbon/human/proc/get_cold_protection", function get_cold_protection(f: Frame, temperature: Value) {
	let thermal_protection_flags: Value = null, thermal_protection: Value = null;
	f.vars = () => [temperature, thermal_protection_flags, thermal_protection];
	if (truthy(rt.callName(f, rt.sv(f, "dna"), "check_mutation", ["Cold Resistance"]))) {
		return 1;
	}
	if ((truthy(rt.sv(f, "dna")) && truthy((rt.isIn(f, 7, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0)))) {
		return 1;
	}
	temperature = rt.call(f, P("/proc/max"), null, [live(temperature), 2.700000047683716]);
	thermal_protection_flags = rt.callSrc(f, "get_cold_protection_flags", [live(temperature)]);
	thermal_protection = 0;
	if (truthy(live(thermal_protection_flags))) {
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 1))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.30000001192092896, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 2))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.15000000596046448, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 4))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.15000000596046448, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 8))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.07500000298023224, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 16))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.07500000298023224, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 32))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.02500000037252903, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 64))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.02500000037252903, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 128))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.07500000298023224, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 256))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.07500000298023224, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 512))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.02500000037252903, add);
		}
		if (truthy(rt.bitAnd(live(thermal_protection_flags), 1024))) {
			thermal_protection = rt.modify(live(thermal_protection), 0.02500000037252903, add);
		}
	}
	return rt.call(f, P("/proc/min"), null, [1, live(thermal_protection)]);
});

// /mob/living/carbon/human/proc/handle_chemicals_in_body  (code/modules/mob/living/carbon/human/life.dm:273)  may sleep
rt.def("/mob/living/carbon/human/proc/handle_chemicals_in_body", function* handle_chemicals_in_body(f: Frame) {
	if (truthy(rt.sv(f, "reagents"))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "metabolize", [null, live(f.src), "can_overdose", 1], rt.Args.Named);
	}
	yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "handle_chemicals_in_body", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/handle_random_events  (code/modules/mob/living/carbon/human/life.dm:279)  may sleep
rt.def("/mob/living/carbon/human/proc/handle_random_events", function* handle_random_events(f: Frame) {
	if (truthy(rt.sv(f, "stat"))) return f.dot;
	if (!(rt.ge((yield* g.srcCall(f, "getToxLoss")), 45) && rt.gt(rt.sv(f, "nutrition"), 20))) return f.dot;
	if (!rt.ge((rt.modSrcVar(f, "lastpuke", rt.op(f, "Prob", [], [50]), add)), 50)) return f.dot;
	yield* g.callSrc(f, "vomit", [null, 20, "toxic", 1], rt.Args.Named);
	rt.setSv(f, "lastpuke", 0);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/has_smoke_protection  (code/modules/mob/living/carbon/human/life.dm:289)
rt.def("/mob/living/carbon/human/proc/has_smoke_protection", function has_smoke_protection(f: Frame) {
	if (truthy(rt.sv(f, "wear_mask"))) {
		if (truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "wear_mask")), 4096))) {
			f.dot = 1;
		}
	}
	if (truthy(rt.sv(f, "glasses"))) {
		if (truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "glasses")), 4096))) {
			f.dot = 1;
		}
	}
	if (truthy(rt.sv(f, "head"))) {
		if (truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "head")), 4096))) {
			f.dot = 1;
		}
	}
	if (truthy((rt.isIn(f, 10, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		f.dot = 1;
	}
	return live(f.dot);
});

// /mob/living/carbon/human/proc/handle_embedded_objects  (code/modules/mob/living/carbon/human/life.dm:303)  may sleep
rt.def("/mob/living/carbon/human/proc/handle_embedded_objects", function* handle_embedded_objects(f: Frame) {
	let X: Value = null, BP: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [X, BP, I, $e];
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		BP = live(X);
		I = null;
		rt.forList(f, 1, rt.fv(f, "embedded_objects", live(BP)), T("/obj/item"));
		while (($e = rt.next(f, 1)) !== undefined) {
			I = $e;
			if (truthy(rt.op(f, "Prob", [], [rt.fv(f, "embedded_pain_chance", live(I))]))) {
				yield* g.callName(f, live(BP), "receive_damage", [multiply(rt.fv(f, "w_class", live(I)), rt.fv(f, "embedded_pain_multiplier", live(I)))]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='userdanger'>＀ embedded in your ＀ hurts!</span>", [live(I), rt.fv(f, "name", live(BP))])]);
			}
			if (truthy(rt.op(f, "Prob", [], [rt.fv(f, "embedded_fall_chance", live(I))]))) {
				yield* g.callName(f, live(BP), "receive_damage", [multiply(rt.fv(f, "w_class", live(I)), rt.fv(f, "embedded_fall_pain_multiplier", live(I)))]);
				(rt.modField(f, live(BP), "embedded_objects", live(I), subtract));
				rt.setFv(f, "loc", live(I), rt.getStep(f, live(f.src), 0));
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ falls out of ＀'s ＀!</span>", [live(I), rt.sv(f, "name"), rt.fv(f, "name", live(BP))]), fmt("<span class='userdanger'>＀ falls out of your ＀!</span>", [live(I), rt.fv(f, "name", live(BP))]));
				if (!truthy((yield* g.srcCall(f, "has_embedded_objects")))) {
					yield* g.srcCall(f, "clear_alert", "embeddedobject");
				}
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/can_heartattack  (code/modules/mob/living/carbon/human/life.dm:319)
rt.def("/mob/living/carbon/human/proc/can_heartattack", function can_heartattack(f: Frame) {
	if ((!truthy(rt.fv(f, "dna", live(f.src))) || !truthy(rt.gv(f, "species", rt.fv(f, "dna", live(f.src)))))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, 12, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		return 0;
	}
	return 1;
});

// /mob/living/carbon/human/proc/undergoing_cardiac_arrest  (code/modules/mob/living/carbon/human/life.dm:325)
rt.def("/mob/living/carbon/human/proc/undergoing_cardiac_arrest", function undergoing_cardiac_arrest(f: Frame) {
	let heart: Value = null;
	f.vars = () => [heart];
	if (!truthy(rt.callSrc(f, "can_heartattack", []))) {
		return 0;
	}
	if ((truthy((rt.istype((heart = rt.callSrc(f, "getorganslot", ["heart"])), T("/obj/item/organ/heart")) ? 1 : 0)) && truthy(rt.fv(f, "beating", live(heart))))) {
		return 0;
	}
	return 1;
});

// /mob/living/carbon/human/proc/set_heartattack  (code/modules/mob/living/carbon/human/life.dm:333)
rt.def("/mob/living/carbon/human/proc/set_heartattack", function set_heartattack(f: Frame, status: Value) {
	let heart: Value = null;
	f.vars = () => [heart];
	if (!truthy(rt.callSrc(f, "can_heartattack", []))) {
		return 0;
	}
	if (!truthy((rt.istype((heart = rt.callSrc(f, "getorganslot", ["heart"])), T("/obj/item/organ/heart")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setFv(f, "beating", live(heart), (!truthy(live(status)) ? 1 : 0));
	return f.dot;
});

// /mob/living/carbon/human/proc/handle_heart  (code/modules/mob/living/carbon/human/life.dm:344)  may sleep
rt.def("/mob/living/carbon/human/proc/handle_heart", function* handle_heart(f: Frame) {
	let we_breath: Value = null;
	f.vars = () => [we_breath];
	if (!truthy((yield* g.srcCall(f, "can_heartattack")))) {
		return live(f.dot);
	}
	we_breath = (!truthy((rt.isIn(f, 10, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0)) ? 1 : 0);
	if (!truthy((yield* g.srcCall(f, "undergoing_cardiac_arrest")))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "get_reagent_amount", ["corazone"])))) {
		return live(f.dot);
	}
	if (truthy(live(we_breath))) {
		yield* g.srcCall(f, "adjustOxyLoss", 8);
		yield* g.srcCall(f, "Unconscious", 80);
	}
	yield* g.srcCall(f, "adjustBruteLoss", 2);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/handle_status_effects  (code/modules/mob/living/carbon/human/life.dm:383)  may sleep
rt.def("/mob/living/carbon/human/proc/handle_status_effects", function* handle_status_effects(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "drunkenness"))) return f.dot;
	rt.setSv(f, "drunkenness", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "drunkenness"), multiply(rt.sv(f, "drunkenness"), 0.03999999910593033)), 0])));
	if (rt.ge(rt.sv(f, "drunkenness"), 6)) {
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			rt.modSrcVar(f, "slurring", 2, add);
		}
		rt.setSv(f, "jitteriness", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "jitteriness"), 3), 0])));
	}
	if ((rt.ge(rt.sv(f, "drunkenness"), 11) && rt.lt(rt.sv(f, "slurring"), 5))) {
		rt.modSrcVar(f, "slurring", 1.2000000476837158, add);
	}
	if (rt.ge(rt.sv(f, "drunkenness"), 41)) {
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			rt.modSrcVar(f, "confused", 2, add);
		}
		yield* g.srcCall(f, "Dizzy", 10);
	}
	if (rt.ge(rt.sv(f, "drunkenness"), 51)) {
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			rt.modSrcVar(f, "confused", 10, add);
			yield* g.srcCall(f, "vomit");
		}
		yield* g.srcCall(f, "Dizzy", 25);
	}
	if (rt.ge(rt.sv(f, "drunkenness"), 61)) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.srcCall(f, "blur_eyes", 5);
		}
	}
	if (rt.ge(rt.sv(f, "drunkenness"), 71)) {
		yield* g.srcCall(f, "blur_eyes", 5);
	}
	if (rt.ge(rt.sv(f, "drunkenness"), 81)) {
		yield* g.srcCall(f, "adjustToxLoss", 0.20000000298023224);
		if ((truthy(rt.op(f, "Prob", [], [5])) && !truthy(rt.sv(f, "stat")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Maybe you should lie down for a bit...</span>"]);
		}
	}
	if (rt.ge(rt.sv(f, "drunkenness"), 91)) {
		yield* g.srcCall(f, "adjustBrainLoss", 0.4000000059604645);
		if ((truthy(rt.op(f, "Prob", [], [20])) && !truthy(rt.sv(f, "stat")))) {
			if ((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "docked") && isEqual(rt.sv(f, "z"), 2))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You're so tired... but you can't miss that shuttle...</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Just a quick nap...</span>"]);
				yield* g.srcCall(f, "Sleeping", 900);
			}
		}
	}
	if (!rt.ge(rt.sv(f, "drunkenness"), 101)) return f.dot;
	yield* g.srcCall(f, "adjustToxLoss", 4);
	return f.dot;
}, true);
