// From code/modules/atmospherics/gasmixtures/reactions.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/init_gas_reactions  (code/modules/atmospherics/gasmixtures/reactions.dm:7)  may sleep
rt.def("/proc/init_gas_reactions", function* init_gas_reactions(f: Frame) {
	let reaction_types: Value = null, r: Value = null, reaction: Value = null, path: Value = null;
	let $e: any;
	f.vars = () => [reaction_types, r, reaction, path, $e];
	reaction_types = rt.list();
	r = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/gas_reaction")])), T("/datum/gas_reaction")));
	while (($e = rt.next(f, 0)) !== undefined) {
		r = $e;
		if (!truthy(rt.initial(f, (reaction = live(r)), "exclude"))) {
			reaction_types = rt.modify(live(reaction_types), live(reaction), add);
		}
	}
	rt.endFor(f, 0);
	reaction_types = (yield* g.call(f, P("/proc/sortList"), null, [live(reaction_types), P("/proc/cmp_gas_reactions")]));
	f.dot = rt.list();
	path = null;
	rt.forList(f, 0, live(reaction_types));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		f.dot = rt.modify(live(f.dot), (yield* g.new_(f, live(path), [])), add);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/cmp_gas_reactions  (code/modules/atmospherics/gasmixtures/reactions.dm:19)
rt.def("/proc/cmp_gas_reactions", function cmp_gas_reactions(f: Frame, a: Value, b: Value) {
	return subtract(rt.initial(f, live(b), "priority"), rt.initial(f, live(a), "priority"));
}, false, { argTypes: [{ path: "/datum/gas_reaction" }, { path: "/datum/gas_reaction" }] });

rt.type(1859, "/datum/gas_reaction", "/datum", {
	min_requirements: null,
	max_requirements: null,
	exclude: 0,
	priority: 100,
	name: "reaction",
	id: "r",
});

// /datum/gas_reaction/proc/New  (code/modules/atmospherics/gasmixtures/reactions.dm:32)
rt.def("/datum/gas_reaction/proc/New", function New(f: Frame) {
	rt.callSrc(f, "init_reqs", []);
	return f.dot;
});

rt.type(1860, "/datum/gas_reaction/agent_b", "/datum/gas_reaction", {
	priority: 2,
	name: "Agent B",
	id: "agent_b",
});

// /datum/gas_reaction/agent_b/proc/init_reqs  (code/modules/atmospherics/gasmixtures/reactions.dm:45)
rt.def("/datum/gas_reaction/agent_b/proc/init_reqs", function init_reqs(f: Frame) {
	rt.setSv(f, "min_requirements", rt.alist(f, ["TEMP", 900, "agent_b", 0.0003000000142492354, "plasma", 0.0003000000142492354, "co2", 0.0003000000142492354]));
	return f.dot;
});

// /datum/gas_reaction/agent_b/proc/react  (code/modules/atmospherics/gasmixtures/reactions.dm:55)
rt.def("/datum/gas_reaction/agent_b/proc/react", function react(f: Frame, air: Value) {
	let cached_gases: Value = null, reaction_rate: Value = null;
	f.vars = () => [cached_gases, reaction_rate];
	cached_gases = rt.fv(f, "gases", live(air));
	reaction_rate = rt.call(f, P("/proc/min"), null, [multiply(rt.index(rt.at(live(cached_gases), "co2"), 1), 0.75), multiply(rt.index(rt.at(live(cached_gases), "plasma"), 1), 0.25), multiply(rt.index(rt.at(live(cached_gases), "agent_b"), 1), 0.05000000074505806)]);
	(rt.modAt(rt.at(live(cached_gases), "co2"), 1, live(reaction_rate), subtract));
	(rt.modAt(rt.at(live(cached_gases), "agent_b"), 1, multiply(live(reaction_rate), 0.05000000074505806), subtract));
	rt.callName(f, live(air), "assert_gas", ["o2"]);
	rt.modAt(rt.at(live(cached_gases), "o2"), 1, live(reaction_rate), add);
	(rt.modField(f, live(air), "temperature", divide(multiply(live(reaction_rate), 20000), rt.callName(f, live(air), "heat_capacity", [])), subtract));
	return 1;
});

rt.type(1861, "/datum/gas_reaction/freon", "/datum/gas_reaction", {
	priority: 1,
	name: "Freon",
	id: "freon",
});

// /datum/gas_reaction/freon/proc/init_reqs  (code/modules/atmospherics/gasmixtures/reactions.dm:74)
rt.def("/datum/gas_reaction/freon/proc/init_reqs", function init_reqs(f: Frame) {
	rt.setSv(f, "min_requirements", rt.alist(f, ["freon", 0.5]));
	return f.dot;
});

// /datum/gas_reaction/freon/proc/react  (code/modules/atmospherics/gasmixtures/reactions.dm:78)  may sleep
rt.def("/datum/gas_reaction/freon/proc/react", function* react(f: Frame, air: Value, location: Value) {
	f.vars = () => [air, location];
	f.dot = 0;
	if (!(truthy(live(location)) && truthy((yield* g.callName(f, live(location), "freon_gas_act", []))))) return f.dot;
	f.dot = 1;
	return f.dot;
}, true);

rt.type(1862, "/datum/gas_reaction/water_vapor", "/datum/gas_reaction", {
	priority: 1,
	name: "Water Vapor",
	id: "vapor",
});

// /datum/gas_reaction/water_vapor/proc/init_reqs  (code/modules/atmospherics/gasmixtures/reactions.dm:88)
rt.def("/datum/gas_reaction/water_vapor/proc/init_reqs", function init_reqs(f: Frame) {
	rt.setSv(f, "min_requirements", rt.alist(f, ["water_vapor", 0.5]));
	return f.dot;
});

// /datum/gas_reaction/water_vapor/proc/react  (code/modules/atmospherics/gasmixtures/reactions.dm:92)  may sleep
rt.def("/datum/gas_reaction/water_vapor/proc/react", function* react(f: Frame, air: Value, location: Value) {
	f.vars = () => [air, location];
	f.dot = 0;
	if (!(truthy(live(location)) && truthy((yield* g.callName(f, live(location), "water_vapor_gas_act", []))))) return f.dot;
	(rt.modAt(rt.index(rt.fv(f, "gases", live(air)), "water_vapor"), 1, 0.5, subtract));
	f.dot = 1;
	return f.dot;
}, true);

rt.type(1863, "/datum/gas_reaction/fire", "/datum/gas_reaction", {
	priority: -1,
	name: "Hydrocarbon Combustion",
	id: "fire",
});

// /datum/gas_reaction/fire/proc/init_reqs  (code/modules/atmospherics/gasmixtures/reactions.dm:103)
rt.def("/datum/gas_reaction/fire/proc/init_reqs", function init_reqs(f: Frame) {
	rt.setSv(f, "min_requirements", rt.alist(f, ["TEMP", 373.1499938964844]));
	return f.dot;
});

// /datum/gas_reaction/fire/proc/react  (code/modules/atmospherics/gasmixtures/reactions.dm:107)  may sleep
rt.def("/datum/gas_reaction/fire/proc/react", function* react(f: Frame, air: Value, location: Value) {
	let energy_released: Value = null, old_heat_capacity: Value = null, cached_gases: Value = null, temperature: Value = null, cached_results: Value = null, burned_fuel: Value = null, plasma_burn_rate: Value = null, oxygen_burn_rate: Value = null, temperature_scale: Value = null, new_heat_capacity: Value = null, I: Value = null, item: Value = null;
	let $0: any, $e: any;
	f.vars = () => [air, location, energy_released, old_heat_capacity, cached_gases, temperature, cached_results, burned_fuel, plasma_burn_rate, oxygen_burn_rate, temperature_scale, new_heat_capacity, I, item, $0, $e];
	energy_released = 0;
	old_heat_capacity = (yield* g.callName(f, live(air), "heat_capacity", []));
	cached_gases = rt.fv(f, "gases", live(air));
	temperature = rt.fv(f, "temperature", live(air));
	rt.setAt((cached_results = rt.fv(f, "reaction_results", live(air))), rt.sv(f, "id"), 0);
	if ((truthy(rt.at(live(cached_gases), "v_fuel")) && truthy(rt.index(rt.at(live(cached_gases), "v_fuel"), 1)))) {
		burned_fuel = null;
		if (!truthy(rt.at(live(cached_gases), "o2"))) {
			burned_fuel = 0;
		} else {
			if (rt.lt(rt.index(rt.at(live(cached_gases), "o2"), 1), rt.index(rt.at(live(cached_gases), "v_fuel"), 1))) {
				burned_fuel = rt.index(rt.at(live(cached_gases), "o2"), 1);
				(rt.modAt(rt.at(live(cached_gases), "v_fuel"), 1, live(burned_fuel), subtract));
				rt.setAt(rt.at(live(cached_gases), "o2"), 1, 0);
			} else {
				burned_fuel = rt.index(rt.at(live(cached_gases), "v_fuel"), 1);
				(rt.modAt(rt.at(live(cached_gases), "o2"), 1, rt.index(rt.at(live(cached_gases), "v_fuel"), 1), subtract));
			}
		}
		if (truthy(live(burned_fuel))) {
			energy_released = rt.modify(live(energy_released), multiply(500000, live(burned_fuel)), add);
			yield* g.callName(f, live(air), "assert_gas", ["co2"]);
			rt.modAt(rt.at(live(cached_gases), "co2"), 1, live(burned_fuel), add);
			rt.modAt(live(cached_results), rt.sv(f, "id"), live(burned_fuel), add);
		}
	}
	if ((truthy(rt.at(live(cached_gases), "plasma")) && rt.gt(rt.index(rt.at(live(cached_gases), "plasma"), 1), 0.0003000000142492354))) {
		plasma_burn_rate = 0;
		oxygen_burn_rate = 0;
		temperature_scale = null;
		if (rt.gt(live(temperature), 1643.1500244140625)) {
			temperature_scale = 1;
		} else {
			temperature_scale = divide(add(subtract(live(temperature), 100), 273.1499938964844), 1816.300048828125);
		}
		if (rt.gt(live(temperature_scale), 0)) {
			yield* g.callName(f, live(air), "assert_gas", ["o2"]);
			oxygen_burn_rate = subtract(1.399999976158142, live(temperature_scale));
			if (rt.gt(rt.index(rt.at(live(cached_gases), "o2"), 1), multiply(rt.index(rt.at(live(cached_gases), "plasma"), 1), 10))) {
				plasma_burn_rate = divide(multiply(rt.index(rt.at(live(cached_gases), "plasma"), 1), live(temperature_scale)), 9);
			} else {
				plasma_burn_rate = divide(multiply(live(temperature_scale), divide(rt.index(rt.at(live(cached_gases), "o2"), 1), 10)), 9);
			}
			if (rt.gt(live(plasma_burn_rate), 0.0003000000142492354)) {
				yield* g.callName(f, live(air), "assert_gas", ["co2"]);
				rt.setAt(rt.at(live(cached_gases), "plasma"), 1, (yield* g.call(f, P("/proc/round"), null, [subtract(rt.index(rt.at(live(cached_gases), "plasma"), 1), live(plasma_burn_rate)), 1.0000000116860974e-7])));
				rt.setAt(rt.at(live(cached_gases), "o2"), 1, (yield* g.call(f, P("/proc/round"), null, [subtract(rt.index(rt.at(live(cached_gases), "o2"), 1), multiply(live(plasma_burn_rate), live(oxygen_burn_rate))), 1.0000000116860974e-7])));
				rt.modAt(rt.at(live(cached_gases), "co2"), 1, live(plasma_burn_rate), add);
				energy_released = rt.modify(live(energy_released), multiply(3000000, live(plasma_burn_rate)), add);
				rt.modAt(live(cached_results), rt.sv(f, "id"), multiply(live(plasma_burn_rate), add(1, live(oxygen_burn_rate))), add);
			}
		}
	}
	if (rt.gt(live(energy_released), 0)) {
		if (rt.gt((new_heat_capacity = (yield* g.callName(f, live(air), "heat_capacity", []))), 0.0003000000142492354)) {
			rt.setFv(f, "temperature", live(air), divide(add(multiply(live(temperature), live(old_heat_capacity)), live(energy_released)), live(new_heat_capacity)));
		}
	}
	if (truthy((rt.istype(live(location), T("/turf/open")) ? 1 : 0))) {
		if (rt.gt((temperature = rt.fv(f, "temperature", live(air))), 373.1499938964844)) {
			yield* g.callName(f, live(location), "hotspot_expose", [live(temperature), 2500]);
			I = null;
			rt.forList(f, 0, live(location));
			while (($e = rt.next(f, 0)) !== undefined) {
				I = $e;
				yield* g.callName(f, (item = live(I)), "temperature_expose", [live(air), live(temperature), 2500]);
			}
			rt.endFor(f, 0);
			yield* g.callName(f, live(location), "temperature_expose", [live(air), live(temperature), 2500]);
		}
	}
	if (truthy(rt.index(live(cached_results), rt.sv(f, "id")))) {
		$0 = 1;
	} else {
		$0 = 0;
	}
	return $0;
}, true);

rt.type(1864, "/datum/gas_reaction/fusion", "/datum/gas_reaction", {
	exclude: 1,
	priority: 2,
	name: "Plasmic Fusion",
	id: "fusion",
});

// /datum/gas_reaction/fusion/proc/init_reqs  (code/modules/atmospherics/gasmixtures/reactions.dm:190)
rt.def("/datum/gas_reaction/fusion/proc/init_reqs", function init_reqs(f: Frame) {
	rt.setSv(f, "min_requirements", rt.alist(f, ["ENER", 30000000, "plasma", 0.0003000000142492354, "co2", 0.0003000000142492354]));
	return f.dot;
});

// /datum/gas_reaction/fusion/proc/react  (code/modules/atmospherics/gasmixtures/reactions.dm:200)
rt.def("/datum/gas_reaction/fusion/proc/react", function react(f: Frame, air: Value) {
	let cached_gases: Value = null, temperature: Value = null, old_heat_capacity: Value = null, carbon_efficency: Value = null, reaction_energy: Value = null, moles_impurities: Value = null, plasma_fused: Value = null, carbon_catalyzed: Value = null, oxygen_added: Value = null, nitrogen_added: Value = null, new_heat_capacity: Value = null;
	f.vars = () => [cached_gases, temperature, old_heat_capacity, carbon_efficency, reaction_energy, moles_impurities, plasma_fused, carbon_catalyzed, oxygen_added, nitrogen_added, new_heat_capacity];
	cached_gases = rt.fv(f, "gases", live(air));
	temperature = rt.fv(f, "temperature", live(air));
	if (rt.lt(divide(add(rt.index(rt.at(live(cached_gases), "plasma"), 1), rt.index(rt.at(live(cached_gases), "co2"), 1)), rt.callName(f, live(air), "total_moles", [])), 0.8999999761581421)) {
		return 0;
	}
	old_heat_capacity = rt.callName(f, live(air), "heat_capacity", []);
	carbon_efficency = rt.call(f, P("/proc/min"), null, [divide(rt.index(rt.at(live(cached_gases), "plasma"), 1), rt.index(rt.at(live(cached_gases), "co2"), 1)), 9]);
	reaction_energy = rt.callName(f, live(air), "thermal_energy", []);
	moles_impurities = subtract(rt.callName(f, live(air), "total_moles", []), add(rt.index(rt.at(live(cached_gases), "plasma"), 1), rt.index(rt.at(live(cached_gases), "co2"), 1)));
	plasma_fused = multiply(multiply(0.07999999821186066, live(carbon_efficency)), divide(live(temperature), 3000000));
	carbon_catalyzed = multiply(multiply(0.009999999776482582, live(carbon_efficency)), divide(live(temperature), 3000000));
	oxygen_added = live(carbon_catalyzed);
	nitrogen_added = subtract(subtract(live(plasma_fused), live(oxygen_added)), divide(rt.callName(f, live(air), "thermal_energy", []), 3000000));
	reaction_energy = rt.call(f, P("/proc/max"), null, [add(add(live(reaction_energy), multiply(divide(multiply(live(carbon_efficency), rt.index(rt.at(live(cached_gases), "plasma"), 1)), add(divide(live(moles_impurities), live(carbon_efficency)), 2)), 10)), multiply(divide(live(plasma_fused), divide(live(moles_impurities), live(carbon_efficency))), 3000000)), 0]);
	rt.callName(f, live(air), "assert_gases", ["o2", "n2"]);
	(rt.modAt(rt.at(live(cached_gases), "plasma"), 1, live(plasma_fused), subtract));
	(rt.modAt(rt.at(live(cached_gases), "co2"), 1, live(carbon_catalyzed), subtract));
	rt.modAt(rt.at(live(cached_gases), "o2"), 1, live(oxygen_added), add);
	rt.modAt(rt.at(live(cached_gases), "n2"), 1, live(nitrogen_added), add);
	if (!rt.gt(live(reaction_energy), 0)) return f.dot;
	if (rt.gt((new_heat_capacity = rt.callName(f, live(air), "heat_capacity", [])), 0.0003000000142492354)) {
		rt.setFv(f, "temperature", live(air), rt.call(f, P("/proc/max"), null, [divide(add(multiply(live(temperature), live(old_heat_capacity)), live(reaction_energy)), live(new_heat_capacity)), 2.700000047683716]));
	}
	return 1;
});
