// From code/modules/mob/living/carbon/life.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/Life  (code/modules/mob/living/carbon/life.dm:10)  may sleep
rt.def("/mob/living/carbon/proc/Life", function* Life(f: Frame) {
	let V: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [V, O, $e];
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "damageoverlaytemp"))) {
		rt.setSv(f, "damageoverlaytemp", 0);
		yield* g.srcCall(f, "update_damage_hud");
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		yield* g.srcCall(f, "handle_blood");
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		V = null;
		rt.forList(f, 0, rt.sv(f, "internal_organs"));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			yield* g.callName(f, (O = live(V)), "on_life", []);
		}
		rt.endFor(f, 0);
	}
	if (isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "stop_sound_channel", 1019);
	}
	yield* g.srcCall(f, "handle_changeling");
	if (isEqual(rt.sv(f, "stat"), 2)) return f.dot;
	return 1;
}, true, { waitfor: false });

// /mob/living/carbon/proc/handle_breathing  (code/modules/mob/living/carbon/life.dm:35)  may sleep
rt.def("/mob/living/carbon/proc/handle_breathing", function* handle_breathing(f: Frame, times_fired: Value) {
	let location_as_object: Value = null;
	f.vars = () => [times_fired, location_as_object];
	if ((isEqual(rt.modulus(live(times_fired), 4), 2) || truthy(rt.sv(f, "failed_last_breath")))) {
		yield* g.srcCall(f, "breathe");
	} else {
		if (!truthy((rt.istype(rt.sv(f, "loc"), T("/obj")) ? 1 : 0))) return f.dot;
		yield* g.callName(f, (location_as_object = rt.sv(f, "loc")), "handle_internal_lifeform", [live(f.src), 0]);
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/breathe  (code/modules/mob/living/carbon/life.dm:44)  may sleep
rt.def("/mob/living/carbon/proc/breathe", function* breathe(f: Frame) {
	let environment: Value = null, breath: Value = null, loc_as_obj: Value = null, breath_moles: Value = null;
	f.vars = () => [environment, breath, loc_as_obj, breath_moles];
	if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["lexorin"])))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/machinery/atmospherics/components/unary/cryo_cell")) ? 1 : 0))) {
		return live(f.dot);
	}
	environment = null;
	if (truthy(rt.sv(f, "loc"))) {
		environment = (yield* g.callName(f, rt.sv(f, "loc"), "return_air", []));
	}
	breath = null;
	if ((rt.le(rt.sv(f, "health"), 0) || ((truthy(rt.sv(f, "pulledby")) && rt.ge(rt.fv(f, "grab_state", rt.sv(f, "pulledby")), 3)) && !truthy((yield* g.srcCall(f, "getorganslot", "breathing_tube")))))) {
		rt.incSrcVar(f, "losebreath", 1, true);
	}
	if (rt.gt(rt.sv(f, "losebreath"), 0)) {
		rt.incSrcVar(f, "losebreath", -1, true);
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.srcCall(f, "emote", "gasp");
		}
		if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj")) ? 1 : 0))) {
			yield* g.callName(f, (loc_as_obj = rt.sv(f, "loc")), "handle_internal_lifeform", [live(f.src), 0]);
		}
	} else {
		if (!truthy((breath = (yield* g.srcCall(f, "get_breath_from_internal", 0.5))))) {
			if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj")) ? 1 : 0))) {
				breath = (yield* g.callName(f, (loc_as_obj = rt.sv(f, "loc")), "handle_internal_lifeform", [live(f.src), 0.5]));
			} else {
				if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
					breath_moles = 0;
					if (truthy(live(environment))) {
						breath_moles = multiply((yield* g.callName(f, live(environment), "total_moles", [])), 0.00019999999494757503);
					}
					breath = (yield* g.callName(f, rt.sv(f, "loc"), "remove_air", [live(breath_moles)]));
				}
			}
		} else {
			if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj")) ? 1 : 0))) {
				yield* g.callName(f, (loc_as_obj = rt.sv(f, "loc")), "handle_internal_lifeform", [live(f.src), 0]);
			}
		}
	}
	yield* g.srcCall(f, "check_breath", live(breath));
	if (!truthy(live(breath))) return f.dot;
	yield* g.callName(f, rt.sv(f, "loc"), "assume_air", [live(breath)]);
	yield* g.srcCall(f, "air_update_turf");
	return f.dot;
}, true);

// /mob/living/carbon/proc/check_breath  (code/modules/mob/living/carbon/life.dm:99)  may sleep
rt.def("/mob/living/carbon/proc/check_breath", function* check_breath(f: Frame, breath: Value) {
	let lungs: Value = null, safe_oxy_min: Value = null, safe_co2_max: Value = null, safe_tox_max: Value = null, SA_para_min: Value = null, SA_sleep_min: Value = null, oxygen_used: Value = null, breath_pressure: Value = null, breath_gases: Value = null, O2_partialpressure: Value = null, Toxins_partialpressure: Value = null, CO2_partialpressure: Value = null, ratio: Value = null, SA_partialpressure: Value = null, bz_partialpressure: Value = null;
	f.vars = () => [breath, lungs, safe_oxy_min, safe_co2_max, safe_tox_max, SA_para_min, SA_sleep_min, oxygen_used, breath_pressure, breath_gases, O2_partialpressure, Toxins_partialpressure, CO2_partialpressure, ratio, SA_partialpressure, bz_partialpressure];
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	if (!truthy((lungs = (yield* g.srcCall(f, "getorganslot", "lungs"))))) {
		yield* g.srcCall(f, "adjustOxyLoss", 2);
	}
	if (((!truthy(live(breath)) || isEqual((yield* g.callName(f, live(breath), "total_moles", [])), 0)) || !truthy(live(lungs)))) {
		if ((truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["epinephrine"]))) && truthy(live(lungs)))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "adjustOxyLoss", 1);
		rt.setSv(f, "failed_last_breath", 1);
		yield* g.srcCall(f, "throw_alert", "oxy", T("/obj/screen/alert/oxy"));
		return 0;
	}
	safe_oxy_min = 16;
	safe_co2_max = 10;
	safe_tox_max = 0.05000000074505806;
	SA_para_min = 1;
	SA_sleep_min = 5;
	oxygen_used = 0;
	breath_pressure = divide(multiply(multiply((yield* g.callName(f, live(breath), "total_moles", [])), 8.3100004196167), rt.fv(f, "temperature", live(breath))), 0.5);
	breath_gases = rt.fv(f, "gases", live(breath));
	yield* g.callName(f, live(breath), "assert_gases", ["o2", "plasma", "co2", "n2o", "bz"]);
	O2_partialpressure = multiply(divide(rt.index(rt.at(live(breath_gases), "o2"), 1), (yield* g.callName(f, live(breath), "total_moles", []))), live(breath_pressure));
	Toxins_partialpressure = multiply(divide(rt.index(rt.at(live(breath_gases), "plasma"), 1), (yield* g.callName(f, live(breath), "total_moles", []))), live(breath_pressure));
	CO2_partialpressure = multiply(divide(rt.index(rt.at(live(breath_gases), "co2"), 1), (yield* g.callName(f, live(breath), "total_moles", []))), live(breath_pressure));
	if (rt.lt(live(O2_partialpressure), live(safe_oxy_min))) {
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			yield* g.srcCall(f, "emote", "gasp");
		}
		if (rt.gt(live(O2_partialpressure), 0)) {
			ratio = subtract(1, divide(live(O2_partialpressure), live(safe_oxy_min)));
			yield* g.srcCall(f, "adjustOxyLoss", (yield* g.call(f, P("/proc/min"), null, [multiply(5, live(ratio)), 3])));
			rt.setSv(f, "failed_last_breath", 1);
			oxygen_used = multiply(rt.index(rt.at(live(breath_gases), "o2"), 1), live(ratio));
		} else {
			yield* g.srcCall(f, "adjustOxyLoss", 3);
			rt.setSv(f, "failed_last_breath", 1);
		}
		yield* g.srcCall(f, "throw_alert", "oxy", T("/obj/screen/alert/oxy"));
	} else {
		rt.setSv(f, "failed_last_breath", 0);
		if (truthy(rt.sv(f, "oxyloss"))) {
			yield* g.srcCall(f, "adjustOxyLoss", -5);
		}
		oxygen_used = rt.index(rt.at(live(breath_gases), "o2"), 1);
		yield* g.srcCall(f, "clear_alert", "oxy");
	}
	(rt.modAt(rt.at(live(breath_gases), "o2"), 1, live(oxygen_used), subtract));
	rt.modAt(rt.at(live(breath_gases), "co2"), 1, live(oxygen_used), add);
	if (rt.gt(live(CO2_partialpressure), live(safe_co2_max))) {
		if (!truthy(rt.sv(f, "co2overloadtime"))) {
			rt.setSv(f, "co2overloadtime", rt.worldTime(f));
		} else {
			if (rt.gt(subtract(rt.worldTime(f), rt.sv(f, "co2overloadtime")), 120)) {
				yield* g.srcCall(f, "Unconscious", 60);
				yield* g.srcCall(f, "adjustOxyLoss", 3);
				if (rt.gt(subtract(rt.worldTime(f), rt.sv(f, "co2overloadtime")), 300)) {
					yield* g.srcCall(f, "adjustOxyLoss", 8);
				}
			}
		}
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			yield* g.srcCall(f, "emote", "cough");
		}
	} else {
		rt.setSv(f, "co2overloadtime", 0);
	}
	if (rt.gt(live(Toxins_partialpressure), live(safe_tox_max))) {
		ratio = multiply(divide(rt.index(rt.at(live(breath_gases), "plasma"), 1), live(safe_tox_max)), 10);
		if (truthy(rt.sv(f, "reagents"))) {
			yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["plasma", (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [live(ratio), 10]))]))]);
		}
		yield* g.srcCall(f, "throw_alert", "tox_in_air", T("/obj/screen/alert/tox_in_air"));
	} else {
		yield* g.srcCall(f, "clear_alert", "tox_in_air");
	}
	if (truthy(rt.at(live(breath_gases), "n2o"))) {
		if (rt.gt((SA_partialpressure = multiply(divide(rt.index(rt.at(live(breath_gases), "n2o"), 1), (yield* g.callName(f, live(breath), "total_moles", []))), live(breath_pressure))), live(SA_para_min))) {
			yield* g.srcCall(f, "Unconscious", 60);
			if (rt.gt(live(SA_partialpressure), live(SA_sleep_min))) {
				yield* g.srcCall(f, "Sleeping", (yield* g.call(f, P("/proc/max"), null, [add((yield* g.srcCall(f, "AmountSleeping")), 40), 200])));
			}
		} else {
			if (rt.gt(live(SA_partialpressure), 0.009999999776482582)) {
				if (truthy(rt.op(f, "Prob", [], [20]))) {
					yield* g.srcCall(f, "emote", rt.op(f, "PickUnweighted", [2], ["giggle", "laugh"]));
				}
			}
		}
	}
	if (truthy(rt.at(live(breath_gases), "bz"))) {
		if (rt.gt((bz_partialpressure = multiply(divide(rt.index(rt.at(live(breath_gases), "bz"), 1), (yield* g.callName(f, live(breath), "total_moles", []))), live(breath_pressure))), 1)) {
			rt.modSrcVar(f, "hallucination", 20, add);
		} else {
			if (rt.gt(live(bz_partialpressure), 0.009999999776482582)) {
				rt.modSrcVar(f, "hallucination", 5, add);
			}
		}
	}
	yield* g.callName(f, live(breath), "garbage_collect", []);
	yield* g.srcCall(f, "handle_breath_temperature", live(breath));
	return 1;
}, true);

// /mob/living/carbon/proc/get_breath_from_internal  (code/modules/mob/living/carbon/life.dm:211)  may sleep
rt.def("/mob/living/carbon/proc/get_breath_from_internal", function* get_breath_from_internal(f: Frame, volume_needed: Value) {
	f.vars = () => [volume_needed];
	if (!truthy(rt.sv(f, "internal"))) return f.dot;
	if (!isEqual(rt.fv(f, "loc", rt.sv(f, "internal")), live(f.src))) {
		rt.setSv(f, "internal", null);
		yield* g.srcCall(f, "update_internals_hud_icon", 0);
	} else {
		if (((!truthy(rt.sv(f, "wear_mask")) || !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "wear_mask")), 8))) && !truthy((yield* g.srcCall(f, "getorganslot", "breathing_tube"))))) {
			rt.setSv(f, "internal", null);
			yield* g.srcCall(f, "update_internals_hud_icon", 0);
		} else {
			yield* g.srcCall(f, "update_internals_hud_icon", 1);
			return (yield* g.callName(f, rt.sv(f, "internal"), "remove_air_volume", [live(volume_needed)]));
		}
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/handle_changeling  (code/modules/mob/living/carbon/life.dm:225)  may sleep
rt.def("/mob/living/carbon/proc/handle_changeling", function* handle_changeling(f: Frame) {
	if (!((truthy(rt.sv(f, "mind")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "lingchemdisplay", rt.sv(f, "hud_used"))))) return f.dot;
	if (truthy(rt.fv(f, "changeling", rt.sv(f, "mind")))) {
		yield* g.callName(f, rt.fv(f, "changeling", rt.sv(f, "mind")), "regenerate", [live(f.src)]);
		rt.setFv(f, "invisibility", rt.fv(f, "lingchemdisplay", rt.sv(f, "hud_used")), 0);
		rt.setFv(f, "maptext", rt.fv(f, "lingchemdisplay", rt.sv(f, "hud_used")), fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#dd66dd'>＀</font></div>", [(yield* g.call(f, P("/proc/round"), null, [rt.gv(f, "chem_charges", rt.fv(f, "changeling", rt.sv(f, "mind")))]))]));
	} else {
		rt.setFv(f, "invisibility", rt.fv(f, "lingchemdisplay", rt.sv(f, "hud_used")), 101);
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/handle_mutations_and_radiation  (code/modules/mob/living/carbon/life.dm:235)  may sleep
rt.def("/mob/living/carbon/proc/handle_mutations_and_radiation", function* handle_mutations_and_radiation(f: Frame) {
	let HM: Value = null, mut: Value = null;
	let $0: any, $e: any;
	f.vars = () => [HM, mut, $0, $e];
	if ((truthy(rt.sv(f, "dna")) && truthy(rt.getLen(f, rt.fv(f, "temporary_mutations", rt.sv(f, "dna")))))) {
		HM = null;
		mut = null;
		rt.forList(f, 0, rt.fv(f, "temporary_mutations", rt.sv(f, "dna")));
		while (($e = rt.next(f, 0)) !== undefined) {
			mut = $e;
			if (rt.lt(rt.index(rt.fv(f, "temporary_mutations", rt.sv(f, "dna")), live(mut)), rt.worldTime(f))) {
				if (isEqual(live(mut), "ui changed")) {
					if (truthy(rt.index(rt.fv(f, "previous", rt.sv(f, "dna")), "UI"))) {
						rt.setFv(f, "uni_identity", rt.sv(f, "dna"), (yield* g.call(f, P("/proc/merge_text"), null, [rt.fv(f, "uni_identity", rt.sv(f, "dna")), rt.index(rt.fv(f, "previous", rt.sv(f, "dna")), "UI")])));
						yield* g.callSrc(f, "updateappearance", ["mutations_overlay_update", 1], rt.Args.Named);
						yield* g.callName(f, rt.fv(f, "previous", rt.sv(f, "dna")), "Remove", ["UI"]);
					}
					yield* g.callName(f, rt.fv(f, "temporary_mutations", rt.sv(f, "dna")), "Remove", [live(mut)]);
					continue;
				}
				if (isEqual(live(mut), "ue changed")) {
					if (truthy(rt.index(rt.fv(f, "previous", rt.sv(f, "dna")), "name"))) {
						rt.setSv(f, "real_name", rt.index(rt.fv(f, "previous", rt.sv(f, "dna")), "name"));
						rt.setSv(f, "name", rt.sv(f, "real_name"));
						yield* g.callName(f, rt.fv(f, "previous", rt.sv(f, "dna")), "Remove", ["name"]);
					}
					if (truthy(rt.index(rt.fv(f, "previous", rt.sv(f, "dna")), "UE"))) {
						rt.setFv(f, "unique_enzymes", rt.sv(f, "dna"), rt.index(rt.fv(f, "previous", rt.sv(f, "dna")), "UE"));
						yield* g.callName(f, rt.fv(f, "previous", rt.sv(f, "dna")), "Remove", ["UE"]);
					}
					if (truthy(rt.index(rt.fv(f, "previous", rt.sv(f, "dna")), "blood_type"))) {
						rt.setFv(f, "blood_type", rt.sv(f, "dna"), rt.index(rt.fv(f, "previous", rt.sv(f, "dna")), "blood_type"));
						yield* g.callName(f, rt.fv(f, "previous", rt.sv(f, "dna")), "Remove", ["blood_type"]);
					}
					yield* g.callName(f, rt.fv(f, "temporary_mutations", rt.sv(f, "dna")), "Remove", [live(mut)]);
					continue;
				}
				yield* g.callName(f, (HM = rt.index(rt.gl("mutations_list"), live(mut))), "force_lose", [live(f.src)]);
				yield* g.callName(f, rt.fv(f, "temporary_mutations", rt.sv(f, "dna")), "Remove", [live(mut)]);
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "radiation"))) return f.dot;
	rt.setSv(f, "radiation", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "radiation"), 100]))])));
	$0 = rt.sv(f, "radiation");
	if (rt.inRange($0, 0, 50)) {
		rt.setSv(f, "radiation", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "radiation"), 1), 0])));
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			yield* g.srcCall(f, "adjustToxLoss", 1);
		}
	} else if (rt.inRange($0, 50, 75)) {
		rt.setSv(f, "radiation", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "radiation"), 2), 0])));
		yield* g.srcCall(f, "adjustToxLoss", 1);
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			rt.setSv(f, "radiation", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "radiation"), 5), 0])));
		}
	} else if (rt.inRange($0, 75, 100)) {
		rt.setSv(f, "radiation", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "radiation"), 3), 0])));
		yield* g.srcCall(f, "adjustToxLoss", 3);
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/handle_chemicals_in_body  (code/modules/mob/living/carbon/life.dm:283)  may sleep
rt.def("/mob/living/carbon/proc/handle_chemicals_in_body", function* handle_chemicals_in_body(f: Frame) {
	if (!truthy(rt.sv(f, "reagents"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "reagents"), "metabolize", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/proc/handle_stomach  (code/modules/mob/living/carbon/life.dm:288)  may sleep
rt.def("/mob/living/carbon/proc/handle_stomach", function* handle_stomach(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.sv(f, "stomach_contents"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!isEqual(rt.fv(f, "loc", live(M)), live(f.src))) {
			yield* g.callName(f, rt.sv(f, "stomach_contents"), "Remove", [live(M)]);
			continue;
		}
		if ((truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0)) && !isEqual(rt.sv(f, "stat"), 2))) {
			if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
				yield* g.callName(f, live(M), "death", [1]);
				yield* g.callName(f, rt.sv(f, "stomach_contents"), "Remove", [live(M)]);
				yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
				continue;
			}
			if (isEqual(rt.modulus(rt.fv(f, "times_fired", rt.gl("SSmobs")), 3), 1)) {
				if (!truthy(rt.bitAnd(rt.fv(f, "status_flags", live(M)), 4096))) {
					yield* g.callName(f, live(M), "adjustBruteLoss", [5]);
				}
				rt.modSrcVar(f, "nutrition", 10, add);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/carbon/proc/handle_status_effects  (code/modules/mob/living/carbon/life.dm:305)  may sleep
rt.def("/mob/living/carbon/proc/handle_status_effects", function* handle_status_effects(f: Frame) {
	let restingpwr: Value = null, C: Value = null, pixel_x_diff: Value = null, pixel_y_diff: Value = null, temp: Value = null, saved_dizz: Value = null, oldsrc: Value = null, amplitude: Value = null;
	f.vars = () => [restingpwr, C, pixel_x_diff, pixel_y_diff, temp, saved_dizz, oldsrc, amplitude];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "staminaloss"))) {
		yield* g.srcCall(f, "adjustStaminaLoss", -3);
	}
	restingpwr = add(1, multiply(4, rt.sv(f, "resting")));
	if (truthy(rt.sv(f, "dizziness"))) {
		C = rt.sv(f, "client");
		pixel_x_diff = 0;
		pixel_y_diff = 0;
		temp = null;
		saved_dizz = rt.sv(f, "dizziness");
		if (truthy(live(C))) {
			oldsrc = live(f.src);
			amplitude = divide(multiply(rt.sv(f, "dizziness"), add(rt.op(f, "Sin", [], [multiply(multiply(rt.sv(f, "dizziness"), 0.04399999976158142), rt.worldTime(f))]), 1)), 70);
			f.src = null;
			rt.spawnTail(f, 0, "/mob/living/carbon/proc/handle_status_effects: spawn at modules/mob/living/carbon/life.dm:322", restingpwr, C, pixel_x_diff, pixel_y_diff, temp, saved_dizz, oldsrc, amplitude);
			f.src = live(oldsrc);
		}
		rt.setSv(f, "dizziness", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "dizziness"), live(restingpwr)), 0])));
	}
	if (truthy(rt.sv(f, "drowsyness"))) {
		rt.setSv(f, "drowsyness", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "drowsyness"), live(restingpwr)), 0])));
		yield* g.srcCall(f, "blur_eyes", 2);
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.srcCall(f, "AdjustSleeping", 20);
			yield* g.srcCall(f, "Unconscious", 100);
		}
	}
	if (truthy(rt.sv(f, "jitteriness"))) {
		yield* g.srcCall(f, "do_jitter_animation", rt.sv(f, "jitteriness"));
		rt.setSv(f, "jitteriness", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "jitteriness"), live(restingpwr)), 0])));
	}
	if (truthy(rt.sv(f, "stuttering"))) {
		rt.setSv(f, "stuttering", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "stuttering"), 1), 0])));
	}
	if (truthy(rt.sv(f, "slurring"))) {
		rt.setSv(f, "slurring", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "slurring"), 1), 0])));
	}
	if (truthy(rt.sv(f, "cultslurring"))) {
		rt.setSv(f, "cultslurring", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "cultslurring"), 1), 0])));
	}
	if (truthy(rt.sv(f, "silent"))) {
		rt.setSv(f, "silent", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "silent"), 1), 0])));
	}
	if (truthy(rt.sv(f, "druggy"))) {
		yield* g.srcCall(f, "adjust_drugginess", -1);
	}
	if (!truthy(rt.sv(f, "hallucination"))) return f.dot;
	rt.spawnTail(f, 0, "/mob/living/carbon/proc/handle_status_effects: spawn at modules/mob/living/carbon/life.dm:373", restingpwr, C, pixel_x_diff, pixel_y_diff, temp, saved_dizz, oldsrc, amplitude);
	rt.setSv(f, "hallucination", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "hallucination"), 2), 0])));
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/carbon/proc/handle_status_effects, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/carbon/proc/handle_status_effects: spawn at modules/mob/living/carbon/life.dm:373", function* (f: Frame, restingpwr: Value, C: Value, pixel_x_diff: Value, pixel_y_diff: Value, temp: Value, saved_dizz: Value, oldsrc: Value, amplitude: Value) {
	f.vars = () => [restingpwr, C, pixel_x_diff, pixel_y_diff, temp, saved_dizz, oldsrc, amplitude];
	yield* g.srcCall(f, "handle_hallucinations");
	return null;
});

// a spawn(0) body of /mob/living/carbon/proc/handle_status_effects, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/carbon/proc/handle_status_effects: spawn at modules/mob/living/carbon/life.dm:322", function* (f: Frame, restingpwr: Value, C: Value, pixel_x_diff: Value, pixel_y_diff: Value, temp: Value, saved_dizz: Value, oldsrc: Value, amplitude: Value) {
	f.vars = () => [restingpwr, C, pixel_x_diff, pixel_y_diff, temp, saved_dizz, oldsrc, amplitude];
	if (truthy(live(C))) {
		pixel_x_diff = rt.modify(live(pixel_x_diff), (temp = multiply(live(amplitude), rt.op(f, "Sin", [], [multiply(multiply(0.00800000037997961, live(saved_dizz)), rt.worldTime(f))]))), add);
		rt.modField(f, live(C), "pixel_x", live(temp), add);
		pixel_y_diff = rt.modify(live(pixel_y_diff), (temp = multiply(live(amplitude), rt.op(f, "Cos", [], [multiply(multiply(0.00800000037997961, live(saved_dizz)), rt.worldTime(f))]))), add);
		rt.modField(f, live(C), "pixel_y", live(temp), add);
		yield* g.call(f, P("/proc/sleep"), null, [3]);
		if (truthy(live(C))) {
			pixel_x_diff = rt.modify(live(pixel_x_diff), (temp = multiply(live(amplitude), rt.op(f, "Sin", [], [multiply(multiply(0.00800000037997961, live(saved_dizz)), rt.worldTime(f))]))), add);
			rt.modField(f, live(C), "pixel_x", live(temp), add);
			pixel_y_diff = rt.modify(live(pixel_y_diff), (temp = multiply(live(amplitude), rt.op(f, "Cos", [], [multiply(multiply(0.00800000037997961, live(saved_dizz)), rt.worldTime(f))]))), add);
			rt.modField(f, live(C), "pixel_y", live(temp), add);
		}
		yield* g.call(f, P("/proc/sleep"), null, [3]);
		if (truthy(live(C))) {
			(rt.modField(f, live(C), "pixel_x", live(pixel_x_diff), subtract));
			(rt.modField(f, live(C), "pixel_y", live(pixel_y_diff), subtract));
		}
	}
	return null;
});

// /mob/living/carbon/proc/natural_bodytemperature_stabilization  (code/modules/mob/living/carbon/life.dm:378)
rt.def("/mob/living/carbon/proc/natural_bodytemperature_stabilization", function natural_bodytemperature_stabilization(f: Frame) {
	let body_temperature_difference: Value = null;
	let $0: any;
	f.vars = () => [body_temperature_difference, $0];
	body_temperature_difference = subtract(310.1499938964844, rt.sv(f, "bodytemperature"));
	$0 = rt.sv(f, "bodytemperature");
	if (rt.inRange($0, -9.999999848243207e+30, 260.1499938964844)) {
		rt.modSrcVar(f, "bodytemperature", rt.call(f, P("/proc/max"), null, [divide(multiply(live(body_temperature_difference), rt.sv(f, "metabolism_efficiency")), 12), 10]), add);
	} else if (rt.inRange($0, 260.1499938964844, 310.1499938964844)) {
		rt.modSrcVar(f, "bodytemperature", rt.call(f, P("/proc/max"), null, [divide(multiply(live(body_temperature_difference), rt.sv(f, "metabolism_efficiency")), 12), rt.call(f, P("/proc/min"), null, [live(body_temperature_difference), 2.5])]), add);
	} else if (rt.inRange($0, 310.1499938964844, 360.1499938964844)) {
		rt.modSrcVar(f, "bodytemperature", rt.call(f, P("/proc/min"), null, [divide(multiply(live(body_temperature_difference), rt.sv(f, "metabolism_efficiency")), 12), rt.call(f, P("/proc/max"), null, [live(body_temperature_difference), -2.5])]), add);
	} else if (rt.inRange($0, 360.1499938964844, 9.999999848243207e+30)) {
		rt.modSrcVar(f, "bodytemperature", rt.call(f, P("/proc/min"), null, [divide(live(body_temperature_difference), 12), -10]), add);
	}
	return f.dot;
});
