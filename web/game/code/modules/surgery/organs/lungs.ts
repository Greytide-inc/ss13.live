// From code/modules/surgery/organs/lungs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/organ/lungs/proc/<init>  (code/modules/surgery/organs/lungs.dm:18)
rt.def("/obj/item/organ/lungs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "breathlevels", rt.alist(f, ["safe_oxygen_min", 16, "safe_oxygen_max", 0, "safe_co2_min", 0, "safe_co2_max", 10, "safe_toxins_min", 0, "safe_toxins_max", 0.05000000074505806, "SA_para_min", 1, "SA_sleep_min", 5, "BZ_trip_balls_min", 1]));
	return f.dot;
});

// /obj/item/organ/lungs/proc/check_breath  (code/modules/surgery/organs/lungs.dm:43)  may sleep
rt.def("/obj/item/organ/lungs/proc/check_breath", function* check_breath(f: Frame, breath: Value, H: Value) {
	let species_traits: Value = null, gas_breathed: Value = null, breath_gases: Value = null, O2_pp: Value = null, Toxins_pp: Value = null, CO2_pp: Value = null, ratio: Value = null, SA_pp: Value = null, bz_pp: Value = null;
	f.vars = () => [breath, H, species_traits, gas_breathed, breath_gases, O2_pp, Toxins_pp, CO2_pp, ratio, SA_pp, bz_pp];
	if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(H)), 4096))) {
		return live(f.dot);
	}
	species_traits = rt.list();
	if ((((truthy(live(H)) && truthy(rt.fv(f, "dna", live(H)))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H))))) && truthy(rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))))) {
		species_traits = rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))));
	}
	if ((!truthy(live(breath)) || isEqual((yield* g.callName(f, live(breath), "total_moles", [])), 0))) {
		if (truthy((yield* g.callName(f, rt.fv(f, "reagents", live(H)), "has_reagent", ["epinephrine"])))) {
			return live(f.dot);
		}
		if (rt.ge(rt.fv(f, "health", live(H)), 0)) {
			yield* g.callName(f, live(H), "adjustOxyLoss", [3]);
		} else {
			if (!truthy((rt.isIn(f, 20, live(species_traits)) ? 1 : 0))) {
				yield* g.callName(f, live(H), "adjustOxyLoss", [divide(rt.fv(f, "wait", rt.gl("SSmobs")), 30)]);
			}
		}
		rt.setFv(f, "failed_last_breath", live(H), 1);
		if (truthy(rt.sv(f, "safe_oxygen_min"))) {
			yield* g.callName(f, live(H), "throw_alert", ["oxy", T("/obj/screen/alert/oxy")]);
		} else {
			if (truthy(rt.sv(f, "safe_toxins_min"))) {
				yield* g.callName(f, live(H), "throw_alert", ["not_enough_tox", T("/obj/screen/alert/not_enough_tox")]);
			} else {
				if (truthy(rt.sv(f, "safe_co2_min"))) {
					yield* g.callName(f, live(H), "throw_alert", ["not_enough_co2", T("/obj/screen/alert/not_enough_co2")]);
				}
			}
		}
		return 0;
	}
	gas_breathed = 0;
	breath_gases = rt.fv(f, "gases", live(breath));
	yield* g.callName(f, live(breath), "assert_gases", ["o2", "plasma", "co2", "n2o", "bz"]);
	O2_pp = (yield* g.callName(f, live(breath), "get_breath_partial_pressure", [rt.index(rt.at(live(breath_gases), "o2"), 1)]));
	Toxins_pp = (yield* g.callName(f, live(breath), "get_breath_partial_pressure", [rt.index(rt.at(live(breath_gases), "plasma"), 1)]));
	CO2_pp = (yield* g.callName(f, live(breath), "get_breath_partial_pressure", [rt.index(rt.at(live(breath_gases), "co2"), 1)]));
	if (truthy(rt.sv(f, "safe_oxygen_max"))) {
		if (rt.gt(live(O2_pp), rt.sv(f, "safe_oxygen_max"))) {
			ratio = multiply(divide(rt.index(rt.at(live(breath_gases), "o2"), 1), rt.sv(f, "safe_oxygen_max")), 10);
			yield* g.callName(f, live(H), "adjustOxyLoss", [(yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "oxy_breath_dam_min"), (yield* g.call(f, P("/proc/min"), null, [live(ratio), rt.sv(f, "oxy_breath_dam_max")]))]))]);
			yield* g.callName(f, live(H), "throw_alert", ["too_much_oxy", T("/obj/screen/alert/too_much_oxy")]);
		} else {
			yield* g.callName(f, live(H), "clear_alert", ["too_much_oxy"]);
		}
	}
	if (truthy(rt.sv(f, "safe_oxygen_min"))) {
		if (rt.lt(live(O2_pp), rt.sv(f, "safe_oxygen_min"))) {
			gas_breathed = (yield* g.srcCall(f, "handle_too_little_breath", live(H), live(O2_pp), rt.sv(f, "safe_oxygen_min"), rt.index(rt.at(live(breath_gases), "o2"), 1)));
			yield* g.callName(f, live(H), "throw_alert", ["oxy", T("/obj/screen/alert/oxy")]);
		} else {
			rt.setFv(f, "failed_last_breath", live(H), 0);
			if (truthy((yield* g.callName(f, live(H), "getOxyLoss", [])))) {
				yield* g.callName(f, live(H), "adjustOxyLoss", [-5]);
			}
			gas_breathed = rt.index(rt.at(live(breath_gases), "o2"), 1);
			yield* g.callName(f, live(H), "clear_alert", ["oxy"]);
		}
	}
	(rt.modAt(rt.at(live(breath_gases), "o2"), 1, live(gas_breathed), subtract));
	rt.modAt(rt.at(live(breath_gases), "co2"), 1, live(gas_breathed), add);
	gas_breathed = 0;
	if (truthy(rt.sv(f, "safe_co2_max"))) {
		if (rt.gt(live(CO2_pp), rt.sv(f, "safe_co2_max"))) {
			if (!truthy(rt.fv(f, "co2overloadtime", live(H)))) {
				rt.setFv(f, "co2overloadtime", live(H), rt.worldTime(f));
			} else {
				if (rt.gt(subtract(rt.worldTime(f), rt.fv(f, "co2overloadtime", live(H))), 120)) {
					yield* g.callName(f, live(H), "Unconscious", [60]);
					yield* g.callName(f, live(H), "adjustOxyLoss", [3]);
					if (rt.gt(subtract(rt.worldTime(f), rt.fv(f, "co2overloadtime", live(H))), 300)) {
						yield* g.callName(f, live(H), "adjustOxyLoss", [8]);
					}
					yield* g.callName(f, live(H), "throw_alert", ["too_much_co2", T("/obj/screen/alert/too_much_co2")]);
				}
			}
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				yield* g.callName(f, live(H), "emote", ["cough"]);
			}
		} else {
			rt.setFv(f, "co2overloadtime", live(H), 0);
			yield* g.callName(f, live(H), "clear_alert", ["too_much_co2"]);
		}
	}
	if (truthy(rt.at(rt.sv(f, "breathlevels"), "safe_co2_min"))) {
		if (rt.lt(live(CO2_pp), rt.sv(f, "safe_co2_min"))) {
			gas_breathed = (yield* g.srcCall(f, "handle_too_little_breath", live(H), live(CO2_pp), rt.sv(f, "safe_co2_min"), rt.index(rt.at(live(breath_gases), "co2"), 1)));
			yield* g.callName(f, live(H), "throw_alert", ["not_enough_co2", T("/obj/screen/alert/not_enough_co2")]);
		} else {
			rt.setFv(f, "failed_last_breath", live(H), 0);
			yield* g.callName(f, live(H), "adjustOxyLoss", [-5]);
			gas_breathed = rt.index(rt.at(live(breath_gases), "co2"), 1);
			yield* g.callName(f, live(H), "clear_alert", ["not_enough_co2"]);
		}
	}
	(rt.modAt(rt.at(live(breath_gases), "co2"), 1, live(gas_breathed), subtract));
	rt.modAt(rt.at(live(breath_gases), "o2"), 1, live(gas_breathed), add);
	gas_breathed = 0;
	if (truthy(rt.sv(f, "safe_toxins_max"))) {
		if (rt.gt(live(Toxins_pp), rt.sv(f, "safe_toxins_max"))) {
			ratio = multiply(divide(rt.index(rt.at(live(breath_gases), "plasma"), 1), rt.sv(f, "safe_toxins_max")), 10);
			if (truthy(rt.fv(f, "reagents", live(H)))) {
				yield* g.callName(f, rt.fv(f, "reagents", live(H)), "add_reagent", ["plasma", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "tox_breath_dam_min"), (yield* g.call(f, P("/proc/min"), null, [live(ratio), rt.sv(f, "tox_breath_dam_max")]))]))]);
			}
			yield* g.callName(f, live(H), "throw_alert", ["tox_in_air", T("/obj/screen/alert/tox_in_air")]);
		} else {
			yield* g.callName(f, live(H), "clear_alert", ["tox_in_air"]);
		}
	}
	if (truthy(rt.sv(f, "safe_toxins_min"))) {
		if (rt.lt(live(Toxins_pp), rt.sv(f, "safe_toxins_min"))) {
			gas_breathed = (yield* g.srcCall(f, "handle_too_little_breath", live(H), live(Toxins_pp), rt.sv(f, "safe_toxins_min"), rt.index(rt.at(live(breath_gases), "plasma"), 1)));
			yield* g.callName(f, live(H), "throw_alert", ["not_enough_tox", T("/obj/screen/alert/not_enough_tox")]);
		} else {
			rt.setFv(f, "failed_last_breath", live(H), 0);
			yield* g.callName(f, live(H), "adjustOxyLoss", [-5]);
			gas_breathed = rt.index(rt.at(live(breath_gases), "plasma"), 1);
			yield* g.callName(f, live(H), "clear_alert", ["not_enough_tox"]);
		}
	}
	(rt.modAt(rt.at(live(breath_gases), "plasma"), 1, live(gas_breathed), subtract));
	rt.modAt(rt.at(live(breath_gases), "co2"), 1, live(gas_breathed), add);
	gas_breathed = 0;
	if (truthy(live(breath))) {
		if (rt.gt((SA_pp = (yield* g.callName(f, live(breath), "get_breath_partial_pressure", [rt.index(rt.at(live(breath_gases), "n2o"), 1)]))), rt.sv(f, "SA_para_min"))) {
			yield* g.callName(f, live(H), "Unconscious", [60]);
			if (rt.gt(live(SA_pp), rt.sv(f, "SA_sleep_min"))) {
				yield* g.callName(f, live(H), "Sleeping", [(yield* g.call(f, P("/proc/max"), null, [add((yield* g.callName(f, live(H), "AmountSleeping", [])), 40), 200]))]);
			}
		} else {
			if (rt.gt(live(SA_pp), 0.009999999776482582)) {
				if (truthy(rt.op(f, "Prob", [], [20]))) {
					yield* g.callName(f, live(H), "emote", [rt.op(f, "PickUnweighted", [2], ["giggle", "laugh"])]);
				}
			}
		}
		if (rt.gt((bz_pp = (yield* g.callName(f, live(breath), "get_breath_partial_pressure", [rt.index(rt.at(live(breath_gases), "bz"), 1)]))), rt.sv(f, "BZ_trip_balls_min"))) {
			rt.modField(f, live(H), "hallucination", 20, add);
			if (truthy(rt.op(f, "Prob", [], [33]))) {
				yield* g.callName(f, live(H), "adjustBrainLoss", [3]);
			}
		} else {
			if (rt.gt(live(bz_pp), 0.009999999776482582)) {
				rt.modField(f, live(H), "hallucination", 5, add);
			}
		}
		yield* g.srcCall(f, "handle_breath_temperature", live(breath), live(H));
		yield* g.callName(f, live(breath), "garbage_collect", []);
	}
	return 1;
}, true);

// /obj/item/organ/lungs/proc/handle_too_little_breath  (code/modules/surgery/organs/lungs.dm:207)  may sleep
rt.def("/obj/item/organ/lungs/proc/handle_too_little_breath", function* handle_too_little_breath(f: Frame, H: Value, breath_pp: Value, safe_breath_min: Value, true_pp: Value) {
	let ratio: Value = null;
	f.vars = () => [H, breath_pp, safe_breath_min, true_pp, ratio];
	if (live(H) === null) {
		H = null;
	}
	if (live(breath_pp) === null) {
		breath_pp = 0;
	}
	if (live(safe_breath_min) === null) {
		safe_breath_min = 0;
	}
	if (live(true_pp) === null) {
		true_pp = 0;
	}
	f.dot = 0;
	if ((!truthy(live(H)) || !truthy(live(safe_breath_min)))) {
		return 0;
	}
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.callName(f, live(H), "emote", ["gasp"]);
	}
	if (rt.gt(live(breath_pp), 0)) {
		ratio = divide(live(safe_breath_min), live(breath_pp));
		yield* g.callName(f, live(H), "adjustOxyLoss", [(yield* g.call(f, P("/proc/min"), null, [multiply(5, live(ratio)), 3]))]);
		rt.setFv(f, "failed_last_breath", live(H), 1);
		f.dot = divide(multiply(live(true_pp), live(ratio)), 6);
	} else {
		yield* g.callName(f, live(H), "adjustOxyLoss", [3]);
		rt.setFv(f, "failed_last_breath", live(H), 1);
	}
	return f.dot;
}, true);

// /obj/item/organ/lungs/proc/handle_breath_temperature  (code/modules/surgery/organs/lungs.dm:223)  may sleep
rt.def("/obj/item/organ/lungs/proc/handle_breath_temperature", function* handle_breath_temperature(f: Frame, breath: Value, H: Value) {
	let species_traits: Value = null;
	let $0: any;
	f.vars = () => [breath, H, species_traits, $0];
	if (!rt.gt(rt.op(f, "Abs", [], [subtract(310.1499938964844, rt.fv(f, "temperature", live(breath)))]), 50)) return f.dot;
	species_traits = rt.list();
	if ((((truthy(live(H)) && truthy(rt.fv(f, "dna", live(H)))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H))))) && truthy(rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))))) {
		species_traits = rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))));
	}
	if ((!truthy((rt.isIn(f, rt.at(rt.gl("mutations_list"), "Cold Resistance"), rt.gv(f, "mutations", rt.fv(f, "dna", live(H)))) ? 1 : 0)) && !truthy((rt.isIn(f, 7, live(species_traits)) ? 1 : 0)))) {
		$0 = rt.fv(f, "temperature", live(breath));
		if (rt.inRange($0, -9.999999848243207e+30, 120)) {
			yield* g.callName(f, live(H), "apply_damage", [3, "fire", "head"]);
		} else if (rt.inRange($0, 120, 200)) {
			yield* g.callName(f, live(H), "apply_damage", [1.5, "fire", "head"]);
		} else if (rt.inRange($0, 200, 260)) {
			yield* g.callName(f, live(H), "apply_damage", [0.5, "fire", "head"]);
		}
	}
	if (truthy((rt.isIn(f, 6, live(species_traits)) ? 1 : 0))) return f.dot;
	$0 = rt.fv(f, "temperature", live(breath));
	if (rt.inRange($0, 360, 400)) {
		yield* g.callName(f, live(H), "apply_damage", [2, "fire", "head"]);
	} else if (rt.inRange($0, 400, 1000)) {
		yield* g.callName(f, live(H), "apply_damage", [4, "fire", "head"]);
	} else if (rt.inRange($0, 1000, 9.999999848243207e+30)) {
		yield* g.callName(f, live(H), "apply_damage", [8, "fire", "head"]);
	}
	return f.dot;
}, true);

// /obj/item/organ/lungs/proc/prepare_eat  (code/modules/surgery/organs/lungs.dm:248)  may sleep
rt.def("/obj/item/organ/lungs/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callName(f, rt.gv(f, "reagents", (S = (yield* g.callSuper(f, [], rt.Args.Same)))), "add_reagent", ["salbutamol", 5]);
	return live(S);
}, true);
