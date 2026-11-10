// Based on /tg/station's code/modules/atmospherics/gasmixtures/reactions.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add, subtract } = rt;


// reactions.dm:7
rt.def("/proc/init_gas_reactions", function* init_gas_reactions(f: Frame) {
	let r: Value = null, reaction: Value = null, path: Value = null;
	let reaction_types: Value = list();
	for (r of each(typesof(T("/datum/gas_reaction")) - T("/datum/gas_reaction"))) {
		if (!rt.initial(f, (reaction = r), "exclude")) {
			reaction_types += reaction;
		}
	}
	reaction_types = (yield* sortList(reaction_types, P("/proc/cmp_gas_reactions")));
	f.dot = list();
	for (path of each(reaction_types)) {
		f.dot += (yield* new_(path));
	}
	return f.dot;
}, true);

// reactions.dm:19
rt.def("/proc/cmp_gas_reactions", function cmp_gas_reactions(f: Frame, a: Value, b: Value) {
	return rt.initial(f, b, "priority") - rt.initial(f, a, "priority");
}, false, { argTypes: [{ path: "/datum/gas_reaction" }, { path: "/datum/gas_reaction" }] });

rt.type(1859, "/datum/gas_reaction", "/datum", {
	min_requirements: null,
	max_requirements: null,
	exclude: 0,
	priority: 100,
	name: "reaction",
	id: "r",
});

// reactions.dm:32
rt.def("/datum/gas_reaction/proc/New", function New(f: Frame) {
	this.init_reqs();
	return f.dot;
});

rt.type(1860, "/datum/gas_reaction/agent_b", "/datum/gas_reaction", {
	priority: 2,
	name: "Agent B",
	id: "agent_b",
});

// reactions.dm:45
rt.def("/datum/gas_reaction/agent_b/proc/init_reqs", function init_reqs(f: Frame) {
	this.min_requirements = rt.alist(f, ["TEMP", 900, "agent_b", 0.0003, "plasma", 0.0003, "co2", 0.0003]);
	return f.dot;
});

// reactions.dm:55
rt.def("/datum/gas_reaction/agent_b/proc/react", function react(f: Frame, air: Value) {
	let cached_gases: Value = air.gases;
	let reaction_rate: Value = min(rt.index(rt.at(cached_gases, "co2"), 1) * 0.75, rt.index(rt.at(cached_gases, "plasma"), 1) * 0.25, rt.index(rt.at(cached_gases, "agent_b"), 1) * 0.05);
	(rt.modAt(rt.at(cached_gases, "co2"), 1, reaction_rate, subtract));
	(rt.modAt(rt.at(cached_gases, "agent_b"), 1, reaction_rate * 0.05, subtract));
	air.assert_gas("o2");
	rt.modAt(rt.at(cached_gases, "o2"), REACTING, reaction_rate, add);
	air.temperature -= reaction_rate * 20000 / air.heat_capacity();
	return REACTING;
});

rt.type(1861, "/datum/gas_reaction/freon", "/datum/gas_reaction", {
	priority: 1,
	name: "Freon",
	id: "freon",
});

// reactions.dm:74
rt.def("/datum/gas_reaction/freon/proc/init_reqs", function init_reqs(f: Frame) {
	this.min_requirements = rt.alist(f, ["freon", MOLES_PLASMA_VISIBLE]);
	return f.dot;
});

// reactions.dm:78
rt.def("/datum/gas_reaction/freon/proc/react", function* react(f: Frame, air: Value, location: Value) {
	f.dot = NO_REACTION;
	if (!(location && (yield* location.freon_gas_act()))) return f.dot;
	f.dot = REACTING;
	return f.dot;
}, true);

rt.type(1862, "/datum/gas_reaction/water_vapor", "/datum/gas_reaction", {
	priority: 1,
	name: "Water Vapor",
	id: "vapor",
});

// reactions.dm:88
rt.def("/datum/gas_reaction/water_vapor/proc/init_reqs", function init_reqs(f: Frame) {
	this.min_requirements = rt.alist(f, ["water_vapor", MOLES_PLASMA_VISIBLE]);
	return f.dot;
});

// reactions.dm:92
rt.def("/datum/gas_reaction/water_vapor/proc/react", function* react(f: Frame, air: Value, location: Value) {
	f.dot = NO_REACTION;
	if (!(location && (yield* location.water_vapor_gas_act()))) return f.dot;
	(rt.modAt(rt.index(air.gases, "water_vapor"), REACTING, MOLES_PLASMA_VISIBLE, subtract));
	f.dot = REACTING;
	return f.dot;
}, true);

rt.type(1863, "/datum/gas_reaction/fire", "/datum/gas_reaction", {
	priority: -1,
	name: "Hydrocarbon Combustion",
	id: "fire",
});

// reactions.dm:103
rt.def("/datum/gas_reaction/fire/proc/init_reqs", function init_reqs(f: Frame) {
	this.min_requirements = rt.alist(f, ["TEMP", 373.15]);
	return f.dot;
});

// reactions.dm:107
rt.def("/datum/gas_reaction/fire/proc/react", function* react(f: Frame, air: Value, location: Value) {
	let cached_results: Value = null, burned_fuel: Value = null, plasma_burn_rate: Value = null, oxygen_burn_rate: Value = null, temperature_scale: Value = null, new_heat_capacity: Value = null, I: Value = null, item: Value = null;
	let $e: any;
	let energy_released: Value = 0;
	let old_heat_capacity: Value = air.heat_capacity();
	let cached_gases: Value = air.gases;
	let temperature: Value = air.temperature;
	rt.setAt((cached_results = air.reaction_results), this.id, 0);
	if (rt.at(cached_gases, "v_fuel") && rt.index(rt.at(cached_gases, "v_fuel"), 1)) {
		if (!rt.at(cached_gases, "o2")) {
			burned_fuel = 0;
		} else if (rt.index(rt.at(cached_gases, "o2"), 1) < rt.index(rt.at(cached_gases, "v_fuel"), 1)) {
			burned_fuel = rt.index(rt.at(cached_gases, "o2"), 1);
			(rt.modAt(rt.at(cached_gases, "v_fuel"), 1, burned_fuel, subtract));
			rt.setAt(rt.at(cached_gases, "o2"), 1, 0);
		} else {
			burned_fuel = rt.index(rt.at(cached_gases, "v_fuel"), 1);
			(rt.modAt(rt.at(cached_gases, "o2"), 1, rt.index(rt.at(cached_gases, "v_fuel"), 1), subtract));
		}
		if (burned_fuel) {
			energy_released += FIRE_CARBON_ENERGY_RELEASED * burned_fuel;
			air.assert_gas("co2");
			rt.modAt(rt.at(cached_gases, "co2"), 1, burned_fuel, add);
			rt.modAt(cached_results, this.id, burned_fuel, add);
		}
	}
	if (rt.at(cached_gases, "plasma") && rt.index(rt.at(cached_gases, "plasma"), 1) > 0.0003) {
		plasma_burn_rate = 0;
		oxygen_burn_rate = 0;
		if (temperature > 1643.15) {
			temperature_scale = 1;
		} else {
			temperature_scale = (temperature - 100 + 273.15) / 1816.3;
		}
		if (temperature_scale > 0) {
			air.assert_gas("o2");
			oxygen_burn_rate = 1.4 - temperature_scale;
			if (rt.index(rt.at(cached_gases, "o2"), 1) > rt.index(rt.at(cached_gases, "plasma"), 1) * 10) {
				plasma_burn_rate = rt.index(rt.at(cached_gases, "plasma"), 1) * temperature_scale / 9;
			} else {
				plasma_burn_rate = temperature_scale * (rt.index(rt.at(cached_gases, "o2"), 1) / 10) / 9;
			}
			if (plasma_burn_rate > 0.0003) {
				air.assert_gas("co2");
				rt.setAt(rt.at(cached_gases, "plasma"), 1, round(rt.index(rt.at(cached_gases, "plasma"), 1) - plasma_burn_rate, 1e-7));
				rt.setAt(rt.at(cached_gases, "o2"), 1, round(rt.index(rt.at(cached_gases, "o2"), 1) - plasma_burn_rate * oxygen_burn_rate, 1e-7));
				rt.modAt(rt.at(cached_gases, "co2"), 1, plasma_burn_rate, add);
				energy_released += FIRE_PLASMA_ENERGY_RELEASED * plasma_burn_rate;
				rt.modAt(cached_results, this.id, plasma_burn_rate * (REACTING + oxygen_burn_rate), add);
			}
		}
	}
	if (energy_released > NO_REACTION) {
		if ((new_heat_capacity = air.heat_capacity()) > 0.0003) {
			air.temperature = (temperature * old_heat_capacity + energy_released) / new_heat_capacity;
		}
	}
	if (rt.istype(location, T("/turf/open"))) {
		if ((temperature = air.temperature) > 373.15) {
			yield* location.hotspot_expose(temperature, CELL_VOLUME);
			for (I of each(location)) {
				yield* (item = I).temperature_expose(air, temperature, CELL_VOLUME);
			}
			yield* location.temperature_expose(air, temperature, CELL_VOLUME);
		}
	}
	return rt.index(cached_results, this.id) ? REACTING : NO_REACTION;
}, true);

rt.type(1864, "/datum/gas_reaction/fusion", "/datum/gas_reaction", {
	exclude: 1,
	priority: 2,
	name: "Plasmic Fusion",
	id: "fusion",
});

// reactions.dm:190
rt.def("/datum/gas_reaction/fusion/proc/init_reqs", function init_reqs(f: Frame) {
	this.min_requirements = rt.alist(f, ["ENER", 30000000, "plasma", 0.0003, "co2", 0.0003]);
	return f.dot;
});

// reactions.dm:200
rt.def("/datum/gas_reaction/fusion/proc/react", function react(f: Frame, air: Value) {
	let new_heat_capacity: Value = null;
	let cached_gases: Value = air.gases;
	let temperature: Value = air.temperature;
	if ((rt.index(rt.at(cached_gases, "plasma"), 1) + rt.index(rt.at(cached_gases, "co2"), 1)) / air.total_moles() < 0.9) {
		return NO_REACTION;
	}
	let old_heat_capacity: Value = air.heat_capacity();
	let carbon_efficency: Value = min(rt.index(rt.at(cached_gases, "plasma"), 1) / rt.index(rt.at(cached_gases, "co2"), 1), 9);
	let reaction_energy: Value = air.thermal_energy();
	let moles_impurities: Value = air.total_moles() - (rt.index(rt.at(cached_gases, "plasma"), 1) + rt.index(rt.at(cached_gases, "co2"), 1));
	let plasma_fused: Value = 0.08 * carbon_efficency * (temperature / 3000000);
	let carbon_catalyzed: Value = 0.01 * carbon_efficency * (temperature / 3000000);
	let oxygen_added: Value = carbon_catalyzed;
	let nitrogen_added: Value = plasma_fused - oxygen_added - air.thermal_energy() / 3000000;
	reaction_energy = max(reaction_energy + carbon_efficency * rt.index(rt.at(cached_gases, "plasma"), 1) / (moles_impurities / carbon_efficency + 2) * 10 + plasma_fused / (moles_impurities / carbon_efficency) * 3000000, 0);
	air.assert_gases("o2", "n2");
	(rt.modAt(rt.at(cached_gases, "plasma"), 1, plasma_fused, subtract));
	(rt.modAt(rt.at(cached_gases, "co2"), 1, carbon_catalyzed, subtract));
	rt.modAt(rt.at(cached_gases, "o2"), 1, oxygen_added, add);
	rt.modAt(rt.at(cached_gases, "n2"), 1, nitrogen_added, add);
	if (!(reaction_energy > NO_REACTION)) return f.dot;
	if ((new_heat_capacity = air.heat_capacity()) > 0.0003) {
		air.temperature = max((temperature * old_heat_capacity + reaction_energy) / new_heat_capacity, 2.7);
	}
	return 1;
});
