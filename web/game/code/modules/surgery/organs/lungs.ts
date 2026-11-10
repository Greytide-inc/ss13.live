// Based on /tg/station's code/modules/surgery/organs/lungs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, subtract } = rt;


rt.type(9519, "/obj/item/organ/lungs", "/obj/item/organ", {
	breathlevels: null,
	safe_oxygen_min: 16,
	safe_oxygen_max: 0,
	safe_co2_min: 0,
	safe_co2_max: 10,
	safe_toxins_min: 0,
	safe_toxins_max: 0.05,
	SA_para_min: 1,
	SA_sleep_min: 5,
	BZ_trip_balls_min: 1,
	oxy_breath_dam_min: 1,
	oxy_breath_dam_max: 10,
	co2_breath_dam_min: 1,
	co2_breath_dam_max: 10,
	tox_breath_dam_min: 1,
	tox_breath_dam_max: 10,
	name: "lungs",
	icon_state: "lungs",
	zone: "chest",
	slot: "lungs",
	gender: "plural",
	w_class: 3,
});

// lungs.dm:18
rt.def("/obj/item/organ/lungs/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.breathlevels = rt.alist(f, ["safe_oxygen_min", 16, "safe_oxygen_max", 0, "safe_co2_min", 0, "safe_co2_max", 10, "safe_toxins_min", 0, "safe_toxins_max", 0.05, "SA_para_min", 1, "SA_sleep_min", 5, "BZ_trip_balls_min", 1]);
	return f.dot;
});

// lungs.dm:43
rt.def("/obj/item/organ/lungs/proc/check_breath", function* check_breath(f: Frame, breath: Value, H: Value) {
	let ratio: Value = null, SA_pp: Value = null, bz_pp: Value = null;
	if (rt.bitAnd(H.status_flags, 4096)) {
		return f.dot;
	}
	let species_traits: Value = list();
	if (H && H.dna && H.dna.species && H.dna.species.species_traits) {
		species_traits = H.dna.species.species_traits;
	}
	if (!breath || breath.total_moles() == 0) {
		if (H.reagents.has_reagent("epinephrine")) {
			return f.dot;
		}
		if (H.health >= 0) {
			yield* H.adjustOxyLoss(HUMAN_MAX_OXYLOSS);
		} else if (!rt.isIn(f, NOCRITDAMAGE, species_traits)) {
			yield* H.adjustOxyLoss(GLOB.SSmobs.wait / 30);
		}
		H.failed_last_breath = 1;
		if (this.safe_oxygen_min) {
			yield* H.throw_alert("oxy", T("/obj/screen/alert/oxy"));
		} else if (this.safe_toxins_min) {
			yield* H.throw_alert("not_enough_tox", T("/obj/screen/alert/not_enough_tox"));
		} else if (this.safe_co2_min) {
			yield* H.throw_alert("not_enough_co2", T("/obj/screen/alert/not_enough_co2"));
		}
		return 0;
	}
	let gas_breathed: Value = 0;
	let breath_gases: Value = breath.gases;
	breath.assert_gases("o2", "plasma", "co2", "n2o", "bz");
	let O2_pp: Value = breath.get_breath_partial_pressure(rt.index(rt.at(breath_gases, "o2"), 1));
	let Toxins_pp: Value = breath.get_breath_partial_pressure(rt.index(rt.at(breath_gases, "plasma"), 1));
	let CO2_pp: Value = breath.get_breath_partial_pressure(rt.index(rt.at(breath_gases, "co2"), 1));
	if (this.safe_oxygen_max) {
		if (O2_pp > this.safe_oxygen_max) {
			ratio = rt.index(rt.at(breath_gases, "o2"), 1) / this.safe_oxygen_max * 10;
			yield* H.adjustOxyLoss(max(this.oxy_breath_dam_min, min(ratio, this.oxy_breath_dam_max)));
			yield* H.throw_alert("too_much_oxy", T("/obj/screen/alert/too_much_oxy"));
		} else {
			yield* H.clear_alert("too_much_oxy");
		}
	}
	if (this.safe_oxygen_min) {
		if (O2_pp < this.safe_oxygen_min) {
			gas_breathed = (yield* this.handle_too_little_breath(H, O2_pp, this.safe_oxygen_min, rt.index(rt.at(breath_gases, "o2"), 1)));
			yield* H.throw_alert("oxy", T("/obj/screen/alert/oxy"));
		} else {
			H.failed_last_breath = 0;
			if (H.getOxyLoss()) {
				yield* H.adjustOxyLoss(-5);
			}
			gas_breathed = rt.index(rt.at(breath_gases, "o2"), 1);
			yield* H.clear_alert("oxy");
		}
	}
	(rt.modAt(rt.at(breath_gases, "o2"), 1, gas_breathed, subtract));
	rt.modAt(rt.at(breath_gases, "co2"), 1, gas_breathed, add);
	gas_breathed = 0;
	if (this.safe_co2_max) {
		if (CO2_pp > this.safe_co2_max) {
			if (!H.co2overloadtime) {
				H.co2overloadtime = rt.worldTime(f);
			} else if (rt.worldTime(f) - H.co2overloadtime > 120) {
				yield* H.Unconscious(60);
				yield* H.adjustOxyLoss(3);
				if (rt.worldTime(f) - H.co2overloadtime > 300) {
					yield* H.adjustOxyLoss(8);
				}
				yield* H.throw_alert("too_much_co2", T("/obj/screen/alert/too_much_co2"));
			}
			if (prob(20)) {
				yield* H.emote("cough");
			}
		} else {
			H.co2overloadtime = 0;
			yield* H.clear_alert("too_much_co2");
		}
	}
	if (rt.at(this.breathlevels, "safe_co2_min")) {
		if (CO2_pp < this.safe_co2_min) {
			gas_breathed = (yield* this.handle_too_little_breath(H, CO2_pp, this.safe_co2_min, rt.index(rt.at(breath_gases, "co2"), 1)));
			yield* H.throw_alert("not_enough_co2", T("/obj/screen/alert/not_enough_co2"));
		} else {
			H.failed_last_breath = 0;
			yield* H.adjustOxyLoss(-5);
			gas_breathed = rt.index(rt.at(breath_gases, "co2"), 1);
			yield* H.clear_alert("not_enough_co2");
		}
	}
	(rt.modAt(rt.at(breath_gases, "co2"), 1, gas_breathed, subtract));
	rt.modAt(rt.at(breath_gases, "o2"), 1, gas_breathed, add);
	gas_breathed = 0;
	if (this.safe_toxins_max) {
		if (Toxins_pp > this.safe_toxins_max) {
			ratio = rt.index(rt.at(breath_gases, "plasma"), 1) / this.safe_toxins_max * 10;
			if (H.reagents) {
				yield* H.reagents.add_reagent("plasma", max(this.tox_breath_dam_min, min(ratio, this.tox_breath_dam_max)));
			}
			yield* H.throw_alert("tox_in_air", T("/obj/screen/alert/tox_in_air"));
		} else {
			yield* H.clear_alert("tox_in_air");
		}
	}
	if (this.safe_toxins_min) {
		if (Toxins_pp < this.safe_toxins_min) {
			gas_breathed = (yield* this.handle_too_little_breath(H, Toxins_pp, this.safe_toxins_min, rt.index(rt.at(breath_gases, "plasma"), 1)));
			yield* H.throw_alert("not_enough_tox", T("/obj/screen/alert/not_enough_tox"));
		} else {
			H.failed_last_breath = 0;
			yield* H.adjustOxyLoss(-5);
			gas_breathed = rt.index(rt.at(breath_gases, "plasma"), 1);
			yield* H.clear_alert("not_enough_tox");
		}
	}
	(rt.modAt(rt.at(breath_gases, "plasma"), 1, gas_breathed, subtract));
	rt.modAt(rt.at(breath_gases, "co2"), 1, gas_breathed, add);
	gas_breathed = 0;
	if (breath) {
		if ((SA_pp = breath.get_breath_partial_pressure(rt.index(rt.at(breath_gases, "n2o"), 1))) > this.SA_para_min) {
			yield* H.Unconscious(60);
			if (SA_pp > this.SA_sleep_min) {
				yield* H.Sleeping(max(H.AmountSleeping() + 40, 200));
			}
		} else if (SA_pp > 0.01) {
			if (prob(20)) {
				yield* H.emote(pick("giggle", "laugh"));
			}
		}
		if ((bz_pp = breath.get_breath_partial_pressure(rt.index(rt.at(breath_gases, "bz"), 1))) > this.BZ_trip_balls_min) {
			H.hallucination += 20;
			if (prob(33)) {
				yield* H.adjustBrainLoss(3);
			}
		} else if (bz_pp > 0.01) {
			H.hallucination += 5;
		}
		yield* this.handle_breath_temperature(breath, H);
		breath.garbage_collect();
	}
	return 1;
}, true);

// lungs.dm:207
rt.def("/obj/item/organ/lungs/proc/handle_too_little_breath", function* handle_too_little_breath(f: Frame, H: Value, breath_pp: Value, safe_breath_min: Value, true_pp: Value) {
	let ratio: Value = null;
	breath_pp ??= 0;
	safe_breath_min ??= 0;
	true_pp ??= 0;
	f.dot = 0;
	if (!H || !safe_breath_min) {
		return 0;
	}
	if (prob(20)) {
		yield* H.emote("gasp");
	}
	if (breath_pp > 0) {
		ratio = safe_breath_min / breath_pp;
		yield* H.adjustOxyLoss(min(5 * ratio, HUMAN_MAX_OXYLOSS));
		H.failed_last_breath = 1;
		f.dot = true_pp * ratio / 6;
	} else {
		yield* H.adjustOxyLoss(HUMAN_MAX_OXYLOSS);
		H.failed_last_breath = 1;
	}
	return f.dot;
}, true);

// lungs.dm:223
rt.def("/obj/item/organ/lungs/proc/handle_breath_temperature", function* handle_breath_temperature(f: Frame, breath: Value, H: Value) {
	if (!(rt.op(f, "Abs", [], [310.15 - breath.temperature]) > 50)) return f.dot;
	let species_traits: Value = list();
	if (H && H.dna && H.dna.species && H.dna.species.species_traits) {
		species_traits = H.dna.species.species_traits;
	}
	if (!rt.isIn(f, rt.at(GLOB.mutations_list, "Cold Resistance"), H.dna.mutations) && !rt.isIn(f, RESISTCOLD, species_traits)) {
		if (rt.inRange(breath.temperature, -1e+31, 120)) {
			yield* H.apply_damage(COLD_GAS_DAMAGE_LEVEL_3, "fire", "head");
		} else if (rt.inRange(breath.temperature, 120, 200)) {
			yield* H.apply_damage(COLD_GAS_DAMAGE_LEVEL_2, "fire", "head");
		} else if (rt.inRange(breath.temperature, 200, 260)) {
			yield* H.apply_damage(COLD_GAS_DAMAGE_LEVEL_1, "fire", "head");
		}
	}
	if (rt.isIn(f, RESISTHOT, species_traits)) return f.dot;
	if (rt.inRange(breath.temperature, 360, 400)) {
		yield* H.apply_damage(HEAT_GAS_DAMAGE_LEVEL_1, "fire", "head");
	} else if (rt.inRange(breath.temperature, 400, 1000)) {
		yield* H.apply_damage(HEAT_GAS_DAMAGE_LEVEL_2, "fire", "head");
	} else if (rt.inRange(breath.temperature, 1000, 1e+31)) {
		yield* H.apply_damage(HEAT_GAS_DAMAGE_LEVEL_3, "fire", "head");
	}
	return f.dot;
}, true);

// lungs.dm:248
rt.def("/obj/item/organ/lungs/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = null;
	yield* (S = (yield* parent_proc())).reagents.add_reagent("salbutamol", 5);
	return S;
}, true);
