// Based on /tg/station's code/modules/mob/living/carbon/alien/life.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, subtract } = rt;


// life.dm:2
rt.def("/mob/living/carbon/alien/proc/Life", function Life(f: Frame) {
	this.findQueen();
	return parent_proc();
}, false, { waitfor: false });

// life.dm:6
rt.def("/mob/living/carbon/alien/proc/check_breath", function* check_breath(f: Frame, breath: Value) {
	let Toxins_pp: Value = null;
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	if (!breath || breath.total_moles() == 0) {
		return 0;
	}
	let toxins_used: Value = 0;
	let tox_detect_threshold: Value = 0.02;
	let breath_pressure: Value = breath.total_moles() * R_IDEAL_GAS_EQUATION * breath.temperature / BREATH_VOLUME;
	let breath_gases: Value = breath.gases;
	breath.assert_gases("plasma", "o2");
	if ((Toxins_pp = rt.index(rt.at(breath_gases, "plasma"), 1) / breath.total_moles() * breath_pressure) > tox_detect_threshold) {
		yield* this.adjustPlasma(rt.index(rt.at(breath_gases, "plasma"), 1) * 250);
		yield* this.throw_alert("alien_tox", T("/obj/screen/alert/alien_tox"));
		toxins_used = rt.index(rt.at(breath_gases, "plasma"), 1);
	} else {
		yield* this.clear_alert("alien_tox");
	}
	(rt.modAt(rt.at(breath_gases, "plasma"), 1, toxins_used, subtract));
	rt.modAt(rt.at(breath_gases, "o2"), 1, toxins_used, add);
	breath.garbage_collect();
	yield* this.handle_breath_temperature(breath);
	return f.dot;
}, true);

// life.dm:42
rt.def("/mob/living/carbon/alien/proc/handle_status_effects", function* handle_status_effects(f: Frame) {
	yield* parent_proc();
	if (!(this.move_delay_add > 0)) return f.dot;
	this.move_delay_add = max(0, this.move_delay_add - rand(1, 2));
	return f.dot;
}, true);

// life.dm:51
rt.def("/mob/living/carbon/alien/proc/handle_fire", function* handle_fire(f: Frame) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	this.bodytemperature += BODYTEMP_HEATING_MAX;
	return f.dot;
}, true);
