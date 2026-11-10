// Based on /tg/station's code/game/objects/radiation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// radiation.dm:2
rt.def("/proc/radiation_pulse", function* radiation_pulse(f: Frame, epicenter: Value, heavy_range: Value, light_range: Value, severity: Value, log: Value) {
	let _T: Value = null, distance: Value = null;
	log ??= 0;
	if (!epicenter || !severity) {
		return f.dot;
	}
	if (!isturf(epicenter)) {
		epicenter = rt.getStep(f, epicenter.loc, 0);
	}
	if (heavy_range > light_range) {
		light_range = heavy_range;
	}
	let light_severity: Value = severity * 0.5;
	for (_T of each(range(light_range, epicenter), T("/atom"))) {
		if ((distance = get_dist(epicenter, _T)) < 0) {
			distance = 0;
		}
		if (distance < heavy_range) {
			yield* _T.rad_act(severity);
		} else if (distance == heavy_range) {
			if (prob(50)) {
				yield* _T.rad_act(severity);
			} else {
				yield* _T.rad_act(light_severity);
			}
		} else if (distance <= light_range) {
			yield* _T.rad_act(light_severity);
		}
	}
	if (log) {
		log_game(`Radiation pulse with size (${heavy_range}, ${light_range}) and severity ${severity} in area ${epicenter.loc.name} `);
	}
	return 1;
}, true);

// radiation.dm:34
rt.def("/mob/living/proc/rad_act", function* rad_act(f: Frame, amount: Value, silent: Value) {
	let I: Value = null;
	silent ??= 0;
	if (!amount) return f.dot;
	let blocked: Value = this.getarmor(null, "rad");
	if (!silent) {
		to_chat(this, "Your skin feels warm.");
	}
	yield* this.apply_effect(amount, "irradiate", blocked);
	for (I of each(this, T("/obj"))) {
		yield* I.rad_act(amount);
	}
	return f.dot;
}, true);

// radiation.dm:44
rt.def("/mob/living/carbon/proc/rad_act", function* rad_act(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (this.dna && rt.isIn(f, RADIMMUNE, this.dna.species.species_traits)) {
		f.args[1] = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["amount", "silent"] });

// radiation.dm:50
rt.def("/mob/living/silicon/proc/rad_act", function* rad_act(f: Frame, amount: Value) {
	f.dot = (yield* parent_proc(amount, 1));
	return f.dot;
}, true);

// radiation.dm:53
rt.def("/mob/living/simple_animal/bot/proc/rad_act", function* rad_act(f: Frame, amount: Value) {
	f.dot = (yield* parent_proc(amount, 1));
	return f.dot;
}, true);

// radiation.dm:56
rt.def("/mob/living/simple_animal/drone/proc/rad_act", function* rad_act(f: Frame, amount: Value) {
	f.dot = (yield* parent_proc(amount, 1));
	return f.dot;
}, true);

// radiation.dm:59
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/rad_act", function* rad_act(f: Frame, amount: Value) {
	f.dot = (yield* parent_proc(amount, 1));
	return f.dot;
}, true);
