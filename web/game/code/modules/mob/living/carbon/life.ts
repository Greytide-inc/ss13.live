// Based on /tg/station's code/modules/mob/living/carbon/life.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add, subtract } = rt;


// life.dm:10
rt.def("/mob/living/carbon/proc/Life", function* Life(f: Frame) {
	let V: Value = null, O: Value = null;
	if (this.notransform) {
		return f.dot;
	}
	if (this.damageoverlaytemp) {
		this.damageoverlaytemp = 0;
		yield* this.update_damage_hud();
	}
	if (yield* parent_proc()) {
		yield* this.handle_blood();
	}
	if (this.stat != 2) {
		for (V of each(this.internal_organs)) {
			yield* (O = V).on_life();
		}
	}
	if (this.stat == 2) {
		yield* this.stop_sound_channel(1019);
	}
	yield* this.handle_changeling();
	if (this.stat == 2) return f.dot;
	return 1;
}, true, { waitfor: false });

// life.dm:35
rt.def("/mob/living/carbon/proc/handle_breathing", function* handle_breathing(f: Frame, times_fired: Value) {
	let location_as_object: Value = null;
	if (times_fired % 4 == 2 || this.failed_last_breath) {
		yield* this.breathe();
	} else {
		if (!rt.istype(this.loc, T("/obj"))) return f.dot;
		yield* (location_as_object = this.loc).handle_internal_lifeform(f.src, 0);
	}
	return f.dot;
}, true);

// life.dm:44
rt.def("/mob/living/carbon/proc/breathe", function* breathe(f: Frame) {
	let environment: Value = null, breath: Value = null, loc_as_obj: Value = null, breath_moles: Value = null;
	if (this.reagents.has_reagent("lexorin")) {
		return f.dot;
	}
	if (rt.istype(this.loc, T("/obj/machinery/atmospherics/components/unary/cryo_cell"))) {
		return f.dot;
	}
	if (this.loc) {
		environment = this.loc.return_air();
	}
	if (this.health <= 0 || this.pulledby && this.pulledby.grab_state >= 3 && !(yield* this.getorganslot("breathing_tube"))) {
		rt.incSrcVar(f, "losebreath", 1, true);
	}
	if (this.losebreath > 0) {
		rt.incSrcVar(f, "losebreath", -1, true);
		if (prob(10)) {
			yield* this.emote("gasp");
		}
		if (rt.istype(this.loc, T("/obj"))) {
			yield* (loc_as_obj = this.loc).handle_internal_lifeform(f.src, 0);
		}
	} else if (!(breath = (yield* this.get_breath_from_internal(BREATH_VOLUME)))) {
		if (rt.istype(this.loc, T("/obj"))) {
			breath = (yield* (loc_as_obj = this.loc).handle_internal_lifeform(f.src, BREATH_VOLUME));
		} else if (isturf(this.loc)) {
			breath_moles = 0;
			if (environment) {
				breath_moles = environment.total_moles() * 0.0002;
			}
			breath = (yield* this.loc.remove_air(breath_moles));
		}
	} else if (rt.istype(this.loc, T("/obj"))) {
		yield* (loc_as_obj = this.loc).handle_internal_lifeform(f.src, 0);
	}
	yield* this.check_breath(breath);
	if (!breath) return f.dot;
	yield* this.loc.assume_air(breath);
	yield* this.air_update_turf();
	return f.dot;
}, true);

// life.dm:99
rt.def("/mob/living/carbon/proc/check_breath", function* check_breath(f: Frame, breath: Value) {
	let lungs: Value = null, ratio: Value = null, SA_partialpressure: Value = null, bz_partialpressure: Value = null;
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	if (!(lungs = (yield* this.getorganslot("lungs")))) {
		yield* this.adjustOxyLoss(2);
	}
	if (!breath || breath.total_moles() == 0 || !lungs) {
		if (this.reagents.has_reagent("epinephrine") && lungs) {
			return f.dot;
		}
		yield* this.adjustOxyLoss(1);
		this.failed_last_breath = 1;
		yield* this.throw_alert("oxy", T("/obj/screen/alert/oxy"));
		return 0;
	}
	let safe_oxy_min: Value = 16;
	let safe_co2_max: Value = 10;
	let safe_tox_max: Value = 0.05;
	let SA_para_min: Value = 1;
	let SA_sleep_min: Value = 5;
	let oxygen_used: Value = 0;
	let breath_pressure: Value = breath.total_moles() * R_IDEAL_GAS_EQUATION * breath.temperature / BREATH_VOLUME;
	let breath_gases: Value = breath.gases;
	breath.assert_gases("o2", "plasma", "co2", "n2o", "bz");
	let O2_partialpressure: Value = rt.index(rt.at(breath_gases, "o2"), 1) / breath.total_moles() * breath_pressure;
	let Toxins_partialpressure: Value = rt.index(rt.at(breath_gases, "plasma"), 1) / breath.total_moles() * breath_pressure;
	let CO2_partialpressure: Value = rt.index(rt.at(breath_gases, "co2"), 1) / breath.total_moles() * breath_pressure;
	if (O2_partialpressure < safe_oxy_min) {
		if (prob(20)) {
			yield* this.emote("gasp");
		}
		if (O2_partialpressure > 0) {
			ratio = 1 - O2_partialpressure / safe_oxy_min;
			yield* this.adjustOxyLoss(min(5 * ratio, 3));
			this.failed_last_breath = 1;
			oxygen_used = rt.index(rt.at(breath_gases, "o2"), 1) * ratio;
		} else {
			yield* this.adjustOxyLoss(3);
			this.failed_last_breath = 1;
		}
		yield* this.throw_alert("oxy", T("/obj/screen/alert/oxy"));
	} else {
		this.failed_last_breath = 0;
		if (this.oxyloss) {
			yield* this.adjustOxyLoss(-5);
		}
		oxygen_used = rt.index(rt.at(breath_gases, "o2"), 1);
		yield* this.clear_alert("oxy");
	}
	(rt.modAt(rt.at(breath_gases, "o2"), 1, oxygen_used, subtract));
	rt.modAt(rt.at(breath_gases, "co2"), 1, oxygen_used, add);
	if (CO2_partialpressure > safe_co2_max) {
		if (!this.co2overloadtime) {
			this.co2overloadtime = rt.worldTime(f);
		} else if (rt.worldTime(f) - this.co2overloadtime > 120) {
			yield* this.Unconscious(60);
			yield* this.adjustOxyLoss(3);
			if (rt.worldTime(f) - this.co2overloadtime > 300) {
				yield* this.adjustOxyLoss(8);
			}
		}
		if (prob(20)) {
			yield* this.emote("cough");
		}
	} else {
		this.co2overloadtime = 0;
	}
	if (Toxins_partialpressure > safe_tox_max) {
		ratio = rt.index(rt.at(breath_gases, "plasma"), 1) / safe_tox_max * 10;
		if (this.reagents) {
			yield* this.reagents.add_reagent("plasma", max(1, min(ratio, 10)));
		}
		yield* this.throw_alert("tox_in_air", T("/obj/screen/alert/tox_in_air"));
	} else {
		yield* this.clear_alert("tox_in_air");
	}
	if (rt.at(breath_gases, "n2o")) {
		if ((SA_partialpressure = rt.index(rt.at(breath_gases, "n2o"), 1) / breath.total_moles() * breath_pressure) > SA_para_min) {
			yield* this.Unconscious(60);
			if (SA_partialpressure > SA_sleep_min) {
				yield* this.Sleeping(max((yield* this.AmountSleeping()) + 40, 200));
			}
		} else if (SA_partialpressure > 0.01) {
			if (prob(20)) {
				yield* this.emote(pick("giggle", "laugh"));
			}
		}
	}
	if (rt.at(breath_gases, "bz")) {
		if ((bz_partialpressure = rt.index(rt.at(breath_gases, "bz"), 1) / breath.total_moles() * breath_pressure) > 1) {
			rt.modSrcVar(f, "hallucination", 20, add);
		} else if (bz_partialpressure > 0.01) {
			rt.modSrcVar(f, "hallucination", 5, add);
		}
	}
	breath.garbage_collect();
	yield* this.handle_breath_temperature(breath);
	return 1;
}, true);

// life.dm:211
rt.def("/mob/living/carbon/proc/get_breath_from_internal", function* get_breath_from_internal(f: Frame, volume_needed: Value) {
	if (!this.internal) return f.dot;
	if (this.internal.loc != f.src) {
		this.internal = null;
		yield* this.update_internals_hud_icon(0);
	} else if ((!this.wear_mask || !rt.bitAnd(this.wear_mask.flags, MASKINTERNALS)) && !(yield* this.getorganslot("breathing_tube"))) {
		this.internal = null;
		yield* this.update_internals_hud_icon(0);
	} else {
		yield* this.update_internals_hud_icon(1);
		return (yield* this.internal.remove_air_volume(volume_needed));
	}
	return f.dot;
}, true);

// life.dm:225
rt.def("/mob/living/carbon/proc/handle_changeling", function* handle_changeling(f: Frame) {
	if (!(this.mind && this.hud_used && this.hud_used.lingchemdisplay)) return f.dot;
	if (this.mind.changeling) {
		yield* this.mind.changeling.regenerate(f.src);
		this.hud_used.lingchemdisplay.invisibility = 0;
		this.hud_used.lingchemdisplay.maptext = `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#dd66dd'>${round(this.mind.changeling.chem_charges)}</font></div>`;
	} else {
		this.hud_used.lingchemdisplay.invisibility = INVISIBILITY_ABSTRACT;
	}
	return f.dot;
}, true);

// life.dm:235
rt.def("/mob/living/carbon/proc/handle_mutations_and_radiation", function* handle_mutations_and_radiation(f: Frame) {
	let HM: Value = null, mut: Value = null;
	let $e: any;
	if (this.dna && rt.len(f, this.dna.temporary_mutations)) {
		for (mut of each(this.dna.temporary_mutations)) {
			if (rt.index(this.dna.temporary_mutations, mut) < rt.worldTime(f)) {
				if (mut == "ui changed") {
					if (rt.index(this.dna.previous, "UI")) {
						this.dna.uni_identity = merge_text(this.dna.uni_identity, rt.index(this.dna.previous, "UI"));
						yield* this.updateappearance({ mutations_overlay_update: 1 });
						yield* this.dna.previous.Remove("UI");
					}
					yield* this.dna.temporary_mutations.Remove(mut);
					continue;
				}
				if (mut == "ue changed") {
					if (rt.index(this.dna.previous, "name")) {
						this.real_name = rt.index(this.dna.previous, "name");
						this.name = rt.sv(f, "real_name");
						yield* this.dna.previous.Remove("name");
					}
					if (rt.index(this.dna.previous, "UE")) {
						this.dna.unique_enzymes = rt.index(this.dna.previous, "UE");
						yield* this.dna.previous.Remove("UE");
					}
					if (rt.index(this.dna.previous, "blood_type")) {
						this.dna.blood_type = rt.index(this.dna.previous, "blood_type");
						yield* this.dna.previous.Remove("blood_type");
					}
					yield* this.dna.temporary_mutations.Remove(mut);
					continue;
				}
				yield* (HM = rt.index(GLOB.mutations_list, mut)).force_lose(f.src);
				yield* this.dna.temporary_mutations.Remove(mut);
			}
		}
	}
	if (!this.radiation) return f.dot;
	this.radiation = max(0, min(this.radiation, 100));
	if (rt.inRange(this.radiation, 0, 50)) {
		this.radiation = max(this.radiation - 1, 0);
		if (prob(25)) {
			yield* this.adjustToxLoss(1);
		}
	} else if (rt.inRange(this.radiation, 50, 75)) {
		this.radiation = max(this.radiation - 2, 0);
		yield* this.adjustToxLoss(1);
		if (prob(5)) {
			this.radiation = max(this.radiation - 5, 0);
		}
	} else if (rt.inRange(this.radiation, 75, 100)) {
		this.radiation = max(this.radiation - 3, 0);
		yield* this.adjustToxLoss(3);
	}
	return f.dot;
}, true);

// life.dm:283
rt.def("/mob/living/carbon/proc/handle_chemicals_in_body", function* handle_chemicals_in_body(f: Frame) {
	if (!this.reagents) return f.dot;
	yield* this.reagents.metabolize(f.src);
	return f.dot;
}, true);

// life.dm:288
rt.def("/mob/living/carbon/proc/handle_stomach", function* handle_stomach(f: Frame) {
	let M: Value = null;
	for (M of each(this.stomach_contents, T("/mob/living"))) {
		if (M.loc != f.src) {
			yield* this.stomach_contents.Remove(M);
			continue;
		}
		if (rt.istype(M, T("/mob/living/carbon")) && this.stat != 2) {
			if (M.stat == 2) {
				yield* M.death(1);
				yield* this.stomach_contents.Remove(M);
				yield* qdel(M);
				continue;
			}
			if (GLOB.SSmobs.times_fired % 3 == 1) {
				if (!rt.bitAnd(M.status_flags, 4096)) {
					yield* M.adjustBruteLoss(5);
				}
				rt.modSrcVar(f, "nutrition", 10, add);
			}
		}
	}
	return f.dot;
}, true, { waitfor: false });

// life.dm:305
rt.def("/mob/living/carbon/proc/handle_status_effects", function* handle_status_effects(f: Frame) {
	let C: Value = null, pixel_x_diff: Value = null, pixel_y_diff: Value = null, temp: Value = null, saved_dizz: Value = null, oldsrc: Value = null, amplitude: Value = null;
	yield* parent_proc();
	if (rt.sv(f, "staminaloss")) {
		yield* g.srcCall(f, "adjustStaminaLoss", -3);
	}
	let restingpwr: Value = 1 + 4 * rt.sv(f, "resting");
	if (rt.sv(f, "dizziness")) {
		C = rt.sv(f, "client");
		pixel_x_diff = 0;
		pixel_y_diff = 0;
		saved_dizz = rt.sv(f, "dizziness");
		if (C) {
			oldsrc = f.src;
			amplitude = rt.sv(f, "dizziness") * (rt.op(f, "Sin", [], [rt.sv(f, "dizziness") * 0.044 * rt.worldTime(f)]) + 1) / 70;
			f.src = null;
			rt.spawnTail(f, 0, "/mob/living/carbon/proc/handle_status_effects: spawn at modules/mob/living/carbon/life.dm:322", restingpwr, C, pixel_x_diff, pixel_y_diff, temp, saved_dizz, oldsrc, amplitude);
			f.src = oldsrc;
		}
		rt.setSv(f, "dizziness", max(rt.sv(f, "dizziness") - restingpwr, 0));
	}
	if (rt.sv(f, "drowsyness")) {
		rt.setSv(f, "drowsyness", max(rt.sv(f, "drowsyness") - restingpwr, 0));
		yield* g.srcCall(f, "blur_eyes", 2);
		if (prob(5)) {
			yield* g.srcCall(f, "AdjustSleeping", 20);
			yield* g.srcCall(f, "Unconscious", 100);
		}
	}
	if (rt.sv(f, "jitteriness")) {
		yield* g.srcCall(f, "do_jitter_animation", rt.sv(f, "jitteriness"));
		rt.setSv(f, "jitteriness", max(rt.sv(f, "jitteriness") - restingpwr, 0));
	}
	if (rt.sv(f, "stuttering")) {
		rt.setSv(f, "stuttering", max(rt.sv(f, "stuttering") - 1, 0));
	}
	if (rt.sv(f, "slurring")) {
		rt.setSv(f, "slurring", max(rt.sv(f, "slurring") - 1, 0));
	}
	if (rt.sv(f, "cultslurring")) {
		rt.setSv(f, "cultslurring", max(rt.sv(f, "cultslurring") - 1, 0));
	}
	if (rt.sv(f, "silent")) {
		rt.setSv(f, "silent", max(rt.sv(f, "silent") - 1, 0));
	}
	if (rt.sv(f, "druggy")) {
		yield* g.srcCall(f, "adjust_drugginess", -1);
	}
	if (!rt.sv(f, "hallucination")) return f.dot;
	rt.spawnTail(f, 0, "/mob/living/carbon/proc/handle_status_effects: spawn at modules/mob/living/carbon/life.dm:373", restingpwr, C, pixel_x_diff, pixel_y_diff, temp, saved_dizz, oldsrc, amplitude);
	rt.setSv(f, "hallucination", max(rt.sv(f, "hallucination") - 2, 0));
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/carbon/proc/handle_status_effects, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/carbon/proc/handle_status_effects: spawn at modules/mob/living/carbon/life.dm:373", function* (f: Frame, restingpwr: Value, C: Value, pixel_x_diff: Value, pixel_y_diff: Value, temp: Value, saved_dizz: Value, oldsrc: Value, amplitude: Value) {
	yield* g.srcCall(f, "handle_hallucinations");
	return null;
});

// a spawn(0) body of /mob/living/carbon/proc/handle_status_effects, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/carbon/proc/handle_status_effects: spawn at modules/mob/living/carbon/life.dm:322", function* (f: Frame, restingpwr: Value, C: Value, pixel_x_diff: Value, pixel_y_diff: Value, temp: Value, saved_dizz: Value, oldsrc: Value, amplitude: Value) {
	if (C) {
		pixel_x_diff += (temp = amplitude * rt.op(f, "Sin", [], [0.008 * saved_dizz * rt.worldTime(f)]));
		C.pixel_x += temp;
		pixel_y_diff += (temp = amplitude * rt.op(f, "Cos", [], [0.008 * saved_dizz * rt.worldTime(f)]));
		C.pixel_y += temp;
		yield* sleep(3);
		if (C) {
			pixel_x_diff += (temp = amplitude * rt.op(f, "Sin", [], [0.008 * saved_dizz * rt.worldTime(f)]));
			C.pixel_x += temp;
			pixel_y_diff += (temp = amplitude * rt.op(f, "Cos", [], [0.008 * saved_dizz * rt.worldTime(f)]));
			C.pixel_y += temp;
		}
		yield* sleep(3);
		if (C) {
			C.pixel_x -= pixel_x_diff;
			C.pixel_y -= pixel_y_diff;
		}
	}
	return null;
});

// life.dm:378
rt.def("/mob/living/carbon/proc/natural_bodytemperature_stabilization", function natural_bodytemperature_stabilization(f: Frame) {
	let body_temperature_difference: Value = 310.15 - this.bodytemperature;
	if (rt.inRange(this.bodytemperature, -1e+31, 260.15)) {
		rt.modSrcVar(f, "bodytemperature", max(body_temperature_difference * this.metabolism_efficiency / BODYTEMP_AUTORECOVERY_DIVISOR, BODYTEMP_AUTORECOVERY_MINIMUM), add);
	} else if (rt.inRange(this.bodytemperature, 260.15, 310.15)) {
		rt.modSrcVar(f, "bodytemperature", max(body_temperature_difference * this.metabolism_efficiency / BODYTEMP_AUTORECOVERY_DIVISOR, min(body_temperature_difference, 2.5)), add);
	} else if (rt.inRange(this.bodytemperature, 310.15, 360.15)) {
		rt.modSrcVar(f, "bodytemperature", min(body_temperature_difference * this.metabolism_efficiency / BODYTEMP_AUTORECOVERY_DIVISOR, max(body_temperature_difference, -2.5)), add);
	} else if (rt.inRange(this.bodytemperature, 360.15, 1e+31)) {
		rt.modSrcVar(f, "bodytemperature", min(body_temperature_difference / BODYTEMP_AUTORECOVERY_DIVISOR, -10), add);
	}
	return f.dot;
});
