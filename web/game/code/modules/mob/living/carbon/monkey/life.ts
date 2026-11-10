// Based on /tg/station's code/modules/mob/living/carbon/monkey/life.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// life.dm:13
rt.def("/mob/living/carbon/monkey/proc/Life", function* Life(f: Frame) {
	if (this.notransform) {
		return f.dot;
	}
	if (!(yield* parent_proc())) return f.dot;
	if (this.client) return f.dot;
	if (this.stat == 0) {
		if (!(yield* this.handle_combat())) {
			if (prob(33) && this.canmove && isturf(this.loc) && !this.pulledby) {
				yield* step(this, pick(GLOB.cardinal));
			}
			if (prob(1)) {
				yield* this.emote(pick("scratch", "jump", "roll", "tail"));
			}
		}
	} else {
		walk_to(this, 0);
	}
	return f.dot;
}, true, { waitfor: false });

// life.dm:28
rt.def("/mob/living/carbon/monkey/proc/handle_mutations_and_radiation", function* handle_mutations_and_radiation(f: Frame) {
	if (!this.radiation) return f.dot;
	if (this.radiation > 100) {
		if (!this.IsKnockdown()) {
			yield* this.emote("collapse");
		}
		yield* this.Knockdown(200);
		to_chat(this, "<span class='danger'>You feel weak.</span>");
	}
	if (rt.inRange(this.radiation, 50, 75)) {
		if (prob(5)) {
			if (!this.IsKnockdown()) {
				yield* this.emote("collapse");
			}
			yield* this.Knockdown(60);
			to_chat(this, "<span class='danger'>You feel weak.</span>");
		}
	} else if (rt.inRange(this.radiation, 75, 100)) {
		if (prob(1)) {
			to_chat(this, "<span class='danger'>You mutate!</span>");
			yield* this.randmutb();
			yield* this.emote("gasp");
			yield* this.domutcheck();
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// life.dm:53
rt.def("/mob/living/carbon/monkey/proc/handle_chemicals_in_body", function* handle_chemicals_in_body(f: Frame) {
	if (!this.reagents) return f.dot;
	yield* this.reagents.metabolize(this, { can_overdose: 1 });
	return f.dot;
}, true);

// life.dm:56
rt.def("/mob/living/carbon/monkey/proc/handle_breath_temperature", function* handle_breath_temperature(f: Frame, breath: Value) {
	if (!(rt.op(f, "Abs", [], [310.15 - breath.temperature]) > 50)) return f.dot;
	if (rt.inRange(breath.temperature, -1e+31, 120)) {
		yield* this.adjustFireLoss(3);
	} else if (rt.inRange(breath.temperature, 120, 200)) {
		yield* this.adjustFireLoss(1.5);
	} else if (rt.inRange(breath.temperature, 200, 260)) {
		yield* this.adjustFireLoss(0.5);
	} else if (rt.inRange(breath.temperature, 360, 400)) {
		yield* this.adjustFireLoss(2);
	} else if (rt.inRange(breath.temperature, 400, 1000)) {
		yield* this.adjustFireLoss(3);
	} else if (rt.inRange(breath.temperature, 1000, 1e+31)) {
		yield* this.adjustFireLoss(8);
	}
	return f.dot;
}, true);

// life.dm:72
rt.def("/mob/living/carbon/monkey/proc/handle_environment", function* handle_environment(f: Frame, environment: Value) {
	let adjusted_pressure: Value = null;
	if (!environment) {
		return f.dot;
	}
	let loc_temp: Value = this.get_temperature(environment);
	if (this.stat != 2) {
		this.natural_bodytemperature_stabilization();
	}
	if (!this.on_fire) {
		if (loc_temp < this.bodytemperature) {
			this.bodytemperature += min((loc_temp - this.bodytemperature) / BODYTEMP_COLD_DIVISOR, BODYTEMP_COOLING_MAX);
		} else {
			this.bodytemperature += min((loc_temp - this.bodytemperature) / BODYTEMP_HEAT_DIVISOR, BODYTEMP_HEATING_MAX);
		}
	}
	if (this.bodytemperature > BODYTEMP_HEAT_DAMAGE_LIMIT) {
		if (rt.inRange(this.bodytemperature, 360, 400)) {
			yield* this.throw_alert("temp", T("/obj/screen/alert/hot"), 1);
			yield* this.apply_damage(HEAT_DAMAGE_LEVEL_1, "fire");
		} else if (rt.inRange(this.bodytemperature, 400, 460)) {
			yield* this.throw_alert("temp", T("/obj/screen/alert/hot"), 2);
			yield* this.apply_damage(HEAT_DAMAGE_LEVEL_2, "fire");
		} else if (rt.inRange(this.bodytemperature, 460, 1e+31)) {
			yield* this.throw_alert("temp", T("/obj/screen/alert/hot"), 3);
			if (this.on_fire) {
				yield* this.apply_damage(10, "fire");
			} else {
				yield* this.apply_damage(HEAT_DAMAGE_LEVEL_2, "fire");
			}
		}
	} else if (this.bodytemperature < BODYTEMP_COLD_DAMAGE_LIMIT) {
		if (!rt.istype(this.loc, T("/obj/machinery/atmospherics/components/unary/cryo_cell"))) {
			if (rt.inRange(this.bodytemperature, 200, 260)) {
				yield* this.throw_alert("temp", T("/obj/screen/alert/cold"), 1);
				yield* this.apply_damage(COLD_DAMAGE_LEVEL_1, "fire");
			} else if (rt.inRange(this.bodytemperature, 120, 200)) {
				yield* this.throw_alert("temp", T("/obj/screen/alert/cold"), 2);
				yield* this.apply_damage(COLD_DAMAGE_LEVEL_2, "fire");
			} else if (rt.inRange(this.bodytemperature, -1e+31, 120)) {
				yield* this.throw_alert("temp", T("/obj/screen/alert/cold"), 3);
				yield* this.apply_damage(COLD_DAMAGE_LEVEL_3, "fire");
			}
		} else {
			yield* this.clear_alert("temp");
		}
	} else {
		yield* this.clear_alert("temp");
	}
	let pressure: Value = environment.return_pressure();
	const subject = (adjusted_pressure = this.calculate_affecting_pressure(pressure));
	if (rt.inRange(subject, HAZARD_HIGH_PRESSURE, 1e+31)) {
		yield* this.adjustBruteLoss(min((adjusted_pressure / HAZARD_HIGH_PRESSURE - 1) * PRESSURE_DAMAGE_COEFFICIENT, MAX_HIGH_PRESSURE_DAMAGE));
		yield* this.throw_alert("pressure", T("/obj/screen/alert/highpressure"), 2);
	} else if (rt.inRange(subject, WARNING_HIGH_PRESSURE, HAZARD_HIGH_PRESSURE)) {
		yield* this.throw_alert("pressure", T("/obj/screen/alert/highpressure"), 1);
	} else if (rt.inRange(subject, WARNING_LOW_PRESSURE, WARNING_HIGH_PRESSURE)) {
		yield* this.clear_alert("pressure");
	} else if (rt.inRange(subject, HAZARD_LOW_PRESSURE, WARNING_LOW_PRESSURE)) {
		yield* this.throw_alert("pressure", T("/obj/screen/alert/lowpressure"), 1);
	} else {
		yield* this.adjustBruteLoss(LOW_PRESSURE_DAMAGE);
		yield* this.throw_alert("pressure", T("/obj/screen/alert/lowpressure"), 2);
	}
	return f.dot;
}, true);

// life.dm:140
rt.def("/mob/living/carbon/monkey/proc/handle_random_events", function* handle_random_events(f: Frame) {
	if (!(prob(1) && prob(2))) return f.dot;
	yield* this.emote("scratch");
	return f.dot;
}, true);

// life.dm:145
rt.def("/mob/living/carbon/monkey/proc/has_smoke_protection", function has_smoke_protection(f: Frame) {
	if (!this.wear_mask) return f.dot;
	if (!rt.bitAnd(this.wear_mask.flags, BLOCK_GAS_SMOKE_EFFECT)) return f.dot;
	return 1;
});

// life.dm:149
rt.def("/mob/living/carbon/monkey/proc/handle_fire", function* handle_fire(f: Frame) {
	let head_clothes: Value = null, X: Value = null, I: Value = null;
	f.dot = (yield* parent_proc());
	if (!this.on_fire) return f.dot;
	let burning_items: Value = list();
	if (this.wear_mask) {
		head_clothes = this.wear_mask;
	}
	if (this.wear_neck) {
		head_clothes = this.wear_neck;
	}
	if (this.head) {
		head_clothes = this.head;
	}
	if (head_clothes) {
		burning_items += head_clothes;
	}
	if (this.back) {
		burning_items += this.back;
	}
	for (X of each(burning_items)) {
		if (!rt.bitAnd((I = X).resistance_flags, FIRE_PROOF)) {
			yield* I.take_damage(this.fire_stacks, "fire", "fire", 0);
		}
	}
	this.bodytemperature += BODYTEMP_HEATING_MAX;
	return f.dot;
}, true);
