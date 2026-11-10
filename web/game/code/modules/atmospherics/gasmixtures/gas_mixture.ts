// Based on /tg/station's code/modules/atmospherics/gasmixtures/gas_mixture.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, subtract, multiply } = rt;


// gas_mixture.dm:10
rt.def("/datum/controller/global_vars/proc/InitGlobalmeta_gas_info", function* InitGlobalmeta_gas_info(f: Frame) {
	GLOB.meta_gas_info = (yield* meta_gas_list());
	this.gvars_datum_init_order += "meta_gas_info";
	return f.dot;
}, true);

// gas_mixture.dm:11
rt.def("/datum/controller/global_vars/proc/InitGlobalgaslist_cache", function InitGlobalgaslist_cache(f: Frame) {
	GLOB.gaslist_cache = init_gaslist_cache();
	this.gvars_datum_init_order += "gaslist_cache";
	return f.dot;
});

// gas_mixture.dm:14
rt.def("/proc/init_gaslist_cache", function init_gaslist_cache(f: Frame) {
	let id: Value = null, cached_gas: Value = null;
	f.dot = list();
	for (id of each(GLOB.meta_gas_info)) {
		cached_gas = new_(T("/list"), 3);
		rt.setAt(f.dot, id, cached_gas);
		rt.setAt(cached_gas, 1, 0);
		rt.setAt(cached_gas, 2, 0);
		rt.setAt(cached_gas, 3, rt.index(GLOB.meta_gas_info, id));
	}
	return f.dot;
});

rt.type(1844, "/datum/gas_mixture", "/datum", {
	gases: null,
	temperature: null,
	temperature_archived: null,
	volume: null,
	last_share: null,
	reaction_results: null,
}, { tmp: ["temperature_archived"] });

// gas_mixture.dm:37
rt.def("/datum/gas_mixture/proc/New", function New(f: Frame, volume: Value) {
	volume ??= CELL_VOLUME;
	this.gases = new_(T("/list"));
	this.temperature = 0;
	this.temperature_archived = 0;
	this.volume = volume;
	this.last_share = 0;
	this.reaction_results = new_(T("/list"));
	return f.dot;
});

// gas_mixture.dm:49
rt.def("/datum/gas_mixture/proc/assert_gas", function assert_gas(f: Frame, gas_id: Value) {
	let cached_gases: Value = null;
	if (rt.index((cached_gases = this.gases), gas_id)) {
		return f.dot;
	}
	let tmp_gaslist: Value = rt.index(GLOB.gaslist_cache, gas_id);
	rt.setAt(cached_gases, gas_id, tmp_gaslist.Copy());
	return f.dot;
});

// gas_mixture.dm:56
rt.def("/datum/gas_mixture/proc/assert_gases", function assert_gases(f: Frame) {
	let id: Value = null;
	for (id of each(f.argsList)) {
		this.assert_gas(id);
	}
	return f.dot;
});

// gas_mixture.dm:63
rt.def("/datum/gas_mixture/proc/add_gas", function add_gas(f: Frame, gas_id: Value) {
	let tmp_gaslist: Value = rt.index(GLOB.gaslist_cache, gas_id);
	rt.setAt(this.gases, gas_id, tmp_gaslist.Copy());
	return f.dot;
});

// gas_mixture.dm:67
rt.def("/datum/gas_mixture/proc/add_gases", function add_gases(f: Frame) {
	let id: Value = null, tmp_gaslist: Value = null;
	let cached_gases: Value = this.gases;
	for (id of each(f.argsList)) {
		tmp_gaslist = rt.index(GLOB.gaslist_cache, id);
		rt.setAt(cached_gases, id, tmp_gaslist.Copy());
	}
	return f.dot;
});

// gas_mixture.dm:77
rt.def("/datum/gas_mixture/proc/garbage_collect", function garbage_collect(f: Frame, tocheck: Value) {
	let id: Value = null;
	let cached_gases: Value = this.gases;
	for (id of each((tocheck || cached_gases))) {
		if (rt.index(rt.index(cached_gases, id), 1) <= 0 && rt.index(rt.index(cached_gases, id), 2) <= 0) {
			cached_gases -= id;
		}
	}
	return f.dot;
});

// gas_mixture.dm:84
rt.def("/datum/gas_mixture/proc/heat_capacity", function heat_capacity(f: Frame) {
	let id: Value = null, gas_data: Value = null;
	let cached_gases: Value = this.gases;
	f.dot = 0;
	for (id of each(cached_gases)) {
		f.dot += rt.index((gas_data = rt.index(cached_gases, id)), 1) * rt.index(rt.index(gas_data, 3), 1);
	}
	return f.dot;
});

// gas_mixture.dm:91
rt.def("/datum/gas_mixture/proc/heat_capacity_archived", function heat_capacity_archived(f: Frame) {
	let id: Value = null, gas_data: Value = null;
	let cached_gases: Value = this.gases;
	f.dot = 0;
	for (id of each(cached_gases)) {
		f.dot += rt.index((gas_data = rt.index(cached_gases, id)), 2) * rt.index(rt.index(gas_data, 3), 1);
	}
	return f.dot;
});

// gas_mixture.dm:105
rt.def("/datum/gas_mixture/proc/total_moles", function total_moles(f: Frame) {
	let total_moles_id: Value = null;
	let cached_gases: Value = this.gases;
	f.dot = 0;
	for (total_moles_id of each(cached_gases)) {
		f.dot += rt.index(rt.index(cached_gases, total_moles_id), 1);
	}
	return f.dot;
});

// gas_mixture.dm:109
rt.def("/datum/gas_mixture/proc/return_pressure", function return_pressure(f: Frame) {
	let cached_gases: Value = null, total_moles_id: Value = null;
	if (this.volume > 0) {
		cached_gases = this.gases;
		f.dot = 0;
		for (total_moles_id of each(cached_gases)) {
			f.dot += rt.index(rt.index(cached_gases, total_moles_id), 1);
		}
		f.dot *= R_IDEAL_GAS_EQUATION * this.temperature / this.volume;
		return f.dot;
	}
	return 0;
});

// gas_mixture.dm:120
rt.def("/datum/gas_mixture/proc/return_volume", function return_volume(f: Frame) {
	return max(0, this.volume);
});

// gas_mixture.dm:123
rt.def("/datum/gas_mixture/proc/thermal_energy", function thermal_energy(f: Frame) {
	return this.temperature * this.heat_capacity();
});

// Empty in tg.
rt.def("/datum/gas_mixture/proc/archive");

// gas_mixture.dm:177
rt.def("/datum/gas_mixture/proc/archive", function archive(f: Frame) {
	let id: Value = null;
	let cached_gases: Value = this.gases;
	this.temperature_archived = this.temperature;
	for (id of each(cached_gases)) {
		rt.setAt(rt.index(cached_gases, id), 2, rt.index(rt.index(cached_gases, id), 1));
	}
	return 1;
});

// Empty in tg.
rt.def("/datum/gas_mixture/proc/merge", undefined, false, { args: ["giver"] });

// gas_mixture.dm:186
rt.def("/datum/gas_mixture/proc/merge", function merge(f: Frame, giver: Value) {
	let self_heat_capacity: Value = null, giver_heat_capacity: Value = null, combined_heat_capacity: Value = null, giver_id: Value = null;
	if (!giver) {
		return 0;
	}
	if (rt.op(f, "Abs", [], [this.temperature - giver.temperature]) > 0.5) {
		self_heat_capacity = this.heat_capacity();
		giver_heat_capacity = giver.heat_capacity();
		if (combined_heat_capacity = giver_heat_capacity + self_heat_capacity) {
			this.temperature = (giver.temperature * giver_heat_capacity + this.temperature * self_heat_capacity) / combined_heat_capacity;
		}
	}
	let cached_gases: Value = this.gases;
	let giver_gases: Value = giver.gases;
	for (giver_id of each(giver_gases)) {
		this.assert_gas(giver_id);
		rt.modAt(rt.index(cached_gases, giver_id), 1, rt.index(rt.index(giver_gases, giver_id), 1), add);
	}
	return 1;
});

// Empty in tg.
rt.def("/datum/gas_mixture/proc/remove", undefined, false, { args: ["amount"] });

// gas_mixture.dm:208
rt.def("/datum/gas_mixture/proc/remove", function remove(f: Frame, amount: Value) {
	let total_moles_id: Value = null, id: Value = null;
	let cached_gases: Value = this.gases;
	let sum: Value = 0;
	for (total_moles_id of each(cached_gases)) {
		sum += rt.index(rt.index(cached_gases, total_moles_id), 1);
	}
	if ((amount = min(amount, sum)) <= 0) {
		return null;
	}
	let removed: Value = new_(T("/datum/gas_mixture"));
	let removed_gases: Value = removed.gases;
	removed.temperature = this.temperature;
	for (id of each(cached_gases)) {
		removed.add_gas(id);
		rt.setAt(rt.index(removed_gases, id), 1, round(rt.index(rt.index(cached_gases, id), 1) / sum * amount, 1e-7));
		(rt.modAt(rt.index(cached_gases, id), 1, rt.index(rt.index(removed_gases, id), 1), subtract));
	}
	this.garbage_collect();
	return removed;
});

// Empty in tg.
rt.def("/datum/gas_mixture/proc/remove_ratio", undefined, false, { args: ["ratio"] });

// gas_mixture.dm:226
rt.def("/datum/gas_mixture/proc/remove_ratio", function remove_ratio(f: Frame, ratio: Value) {
	let id: Value = null;
	if (ratio <= 0) {
		return null;
	}
	ratio = min(ratio, 1);
	let cached_gases: Value = this.gases;
	let removed: Value = new_(T("/datum/gas_mixture"));
	let removed_gases: Value = removed.gases;
	removed.temperature = this.temperature;
	for (id of each(cached_gases)) {
		removed.add_gas(id);
		rt.setAt(rt.index(removed_gases, id), 1, round(rt.index(rt.index(cached_gases, id), 1) * ratio, 1e-7));
		(rt.modAt(rt.index(cached_gases, id), 1, rt.index(rt.index(removed_gases, id), 1), subtract));
	}
	this.garbage_collect();
	return removed;
});

// Empty in tg.
rt.def("/datum/gas_mixture/proc/copy");

// gas_mixture.dm:245
rt.def("/datum/gas_mixture/proc/copy", function copy(f: Frame) {
	let id: Value = null;
	let cached_gases: Value = this.gases;
	let copy: Value = new_(T("/datum/gas_mixture"));
	let copy_gases: Value = copy.gases;
	copy.temperature = this.temperature;
	for (id of each(cached_gases)) {
		copy.add_gas(id);
		rt.setAt(rt.index(copy_gases, id), 1, rt.index(rt.index(cached_gases, id), 1));
	}
	return copy;
});

// Empty in tg.
rt.def("/datum/gas_mixture/proc/copy_from", undefined, false, { args: ["sample"] });

// gas_mixture.dm:257
rt.def("/datum/gas_mixture/proc/copy_from", function copy_from(f: Frame, sample: Value) {
	let id: Value = null;
	let cached_gases: Value = this.gases;
	let sample_gases: Value = sample.gases;
	this.temperature = sample.temperature;
	for (id of each(sample_gases)) {
		this.assert_gas(id);
		rt.setAt(rt.index(cached_gases, id), 1, rt.index(rt.index(sample_gases, id), 1));
	}
	(cached_gases = rt.modify(cached_gases, sample_gases, rt.bitAnd));
	return 1;
});

// /datum/gas_mixture/proc/copy_from_scaled  (speed-gas addition): copy_from(sample), then every gas's moles *= volume / sample.volume.
// This is the second loop of /datum/pipeline/proc/reconcile_air (datum_pipeline.dm:207) as one proc, so src/translate/fast-air.ts can stand in for it.
rt.def("/datum/gas_mixture/proc/copy_from_scaled", function copy_from_scaled(f: Frame, sample: Value) {
	let id: Value = null;
	let $e: any;
	this.copy_from(sample);
	let G_gases: Value = this.gases;
	rt.forList(f, 1, G_gases);
	while (($e = rt.next(f, 1)) !== undefined) {
		id = $e;
		(rt.modAt(rt.index(G_gases, id), 1, this.volume / sample.volume, multiply));
	}
	rt.endFor(f, 1);
	return f.dot;
});

// /datum/gas_mixture/proc/reconcile_from  (speed-gas addition): the two loops of /datum/pipeline/proc/reconcile_air (datum_pipeline.dm:207) as
// one proc on the pipeline's new total mixture, so src/translate/fast-air.ts can stand in for it. GL = the mixtures to reconcile.
rt.def("/datum/gas_mixture/proc/reconcile_from", function reconcile_from(f: Frame, GL: Value) {
	let i: Value = null, G: Value = null;
	let total_thermal_energy: Value = 0;
	let total_heat_capacity: Value = 0;
	for (i of each(GL)) {
		G = i;
		this.volume += G.volume;
		this.merge(G);
		total_thermal_energy += G.thermal_energy();
		total_heat_capacity += G.heat_capacity();
	}
	this.temperature = total_heat_capacity ? total_thermal_energy / total_heat_capacity : 0;
	if (!(this.volume > 0)) return f.dot;
	i = null;
	for (i of each(GL)) {
		(G = i).copy_from_scaled(this);
	}
	return f.dot;
});

// Empty in tg.
rt.def("/datum/gas_mixture/proc/copy_from_turf", undefined, false, { args: ["model"] });

// gas_mixture.dm:271
rt.def("/datum/gas_mixture/proc/copy_from_turf", function copy_from_turf(f: Frame, model: Value) {
	this.parse_gas_string(model.initial_gas_mix);
	let model_parent: Value = model.parent_type;
	if (model.temperature != rt.initial(f, model, "temperature") || model.temperature != rt.initial(f, model_parent, "temperature")) {
		this.temperature = model.temperature;
	}
	return 1;
});

// Empty in tg.
rt.def("/datum/gas_mixture/proc/parse_gas_string", undefined, false, { args: ["gas_string"] });

// gas_mixture.dm:282
rt.def("/datum/gas_mixture/proc/parse_gas_string", function parse_gas_string(f: Frame, gas_string: Value) {
	let gas: Value = null, id: Value = null;
	let gases: Value = this.gases;
	if (rt.index((gas = params2list(gas_string)), "TEMP")) {
		this.temperature = text2num(rt.at(gas, "TEMP"));
		gas -= "TEMP";
	}
	gases.Cut();
	for (id of each(gas)) {
		this.add_gas(id);
		rt.setAt(rt.index(gases, id), 1, text2num(rt.index(gas, id)));
	}
	return 1;
});

// Empty in tg.
rt.def("/datum/gas_mixture/proc/share", undefined, false, { args: ["sharer"] });

// gas_mixture.dm:293
rt.def("/datum/gas_mixture/proc/share", function share(f: Frame, sharer: Value, atmos_adjacent_turfs: Value) {
	let id: Value = null, gas: Value = null, sharergas: Value = null, delta: Value = null, gas_heat_capacity: Value = null, new_self_heat_capacity: Value = null, new_sharer_heat_capacity: Value = null, unique_gases: Value = null, total_moles_id: Value = null, total_moles_id_13: Value = null, delta_pressure: Value = null;
	atmos_adjacent_turfs ??= 4;
	if (!sharer) {
		return 0;
	}
	let cached_gases: Value = this.gases;
	let sharer_gases: Value = sharer.gases;
	let temperature_delta: Value = this.temperature_archived - sharer.temperature_archived;
	let abs_temperature_delta: Value = rt.op(f, "Abs", [], [temperature_delta]);
	let old_self_heat_capacity: Value = 0;
	let old_sharer_heat_capacity: Value = 0;
	if (abs_temperature_delta > 0.5) {
		old_self_heat_capacity = this.heat_capacity();
		old_sharer_heat_capacity = sharer.heat_capacity();
	}
	let heat_capacity_self_to_sharer: Value = 0;
	let heat_capacity_sharer_to_self: Value = 0;
	let moved_moles: Value = 0;
	let abs_moved_moles: Value = 0;
	for (id of each(sharer_gases - cached_gases)) {
		this.add_gas(id);
	}
	id = null;
	for (id of each(cached_gases)) {
		if (!rt.index(sharer_gases, id)) {
			sharer.add_gas(id);
		}
		gas = rt.index(cached_gases, id);
		sharergas = rt.index(sharer_gases, id);
		if ((delta = round(rt.index(gas, 2) - rt.index(sharergas, 2), 1e-7) / (atmos_adjacent_turfs + 1)) && abs_temperature_delta > 0.5) {
			gas_heat_capacity = delta * rt.index(rt.index(gas, 3), 1);
			if (delta > 0) {
				heat_capacity_self_to_sharer += gas_heat_capacity;
			} else {
				heat_capacity_sharer_to_self -= gas_heat_capacity;
			}
		}
		(rt.modAt(gas, 1, delta, subtract));
		rt.modAt(sharergas, 1, delta, add);
		moved_moles += delta;
		abs_moved_moles += rt.op(f, "Abs", [], [delta]);
	}
	this.last_share = abs_moved_moles;
	if (abs_temperature_delta > 0.5) {
		new_self_heat_capacity = old_self_heat_capacity + heat_capacity_sharer_to_self - heat_capacity_self_to_sharer;
		new_sharer_heat_capacity = old_sharer_heat_capacity + heat_capacity_self_to_sharer - heat_capacity_sharer_to_self;
		if (new_self_heat_capacity > 0.0003) {
			this.temperature = (old_self_heat_capacity * this.temperature - heat_capacity_self_to_sharer * this.temperature_archived + heat_capacity_sharer_to_self * sharer.temperature_archived) / new_self_heat_capacity;
		}
		if (new_sharer_heat_capacity > 0.0003) {
			sharer.temperature = (old_sharer_heat_capacity * sharer.temperature - heat_capacity_sharer_to_self * sharer.temperature_archived + heat_capacity_self_to_sharer * this.temperature_archived) / new_sharer_heat_capacity;
			if (rt.op(f, "Abs", [], [old_sharer_heat_capacity]) > 0.0003) {
				if (rt.op(f, "Abs", [], [new_sharer_heat_capacity / old_sharer_heat_capacity - 1]) < 0.1) {
					this.temperature_share(sharer, 0.4);
				}
			}
		}
	}
	if (rt.len(f, (unique_gases = rt.bitXor(cached_gases, sharer_gases)))) {
		this.garbage_collect(cached_gases - sharer_gases);
		sharer.garbage_collect(sharer_gases - cached_gases);
	}
	sharer.after_share(this, atmos_adjacent_turfs);
	if (!(temperature_delta > 393.15 || rt.op(f, "Abs", [], [moved_moles]) > 0.1039838)) return f.dot;
	let our_moles: Value = 0;
	for (total_moles_id of each(cached_gases)) {
		our_moles += rt.index(rt.index(cached_gases, total_moles_id), 1);
	}
	let their_moles: Value = 0;
	for (total_moles_id_13 of each(sharer_gases)) {
		their_moles += rt.index(rt.index(sharer_gases, total_moles_id_13), 1);
	}
	return (delta_pressure = this.temperature_archived * (our_moles + moved_moles) - sharer.temperature_archived * (their_moles - moved_moles)) * 8.31 / this.volume;
});

// Empty in tg.
rt.def("/datum/gas_mixture/proc/temperature_share", undefined, false, { args: ["sharer", "conduction_coefficient"] });

// gas_mixture.dm:377
rt.def("/datum/gas_mixture/proc/temperature_share", function temperature_share(f: Frame, sharer: Value, conduction_coefficient: Value, sharer_temperature: Value, sharer_heat_capacity: Value) {
	let temperature_delta: Value = null, self_heat_capacity: Value = null, heat: Value = null;
	if (sharer) {
		sharer_temperature = sharer.temperature_archived;
	}
	if (rt.op(f, "Abs", [], [(temperature_delta = this.temperature_archived - sharer_temperature)]) > 0.5) {
		self_heat_capacity = this.heat_capacity_archived();
		if ((sharer_heat_capacity = (sharer_heat_capacity || sharer.heat_capacity_archived())) > 0.0003 && self_heat_capacity > 0.0003) {
			heat = conduction_coefficient * temperature_delta * (self_heat_capacity * sharer_heat_capacity / (self_heat_capacity + sharer_heat_capacity));
			this.temperature = max(this.temperature - heat / self_heat_capacity, 2.7);
			sharer_temperature = max(sharer_temperature + heat / sharer_heat_capacity, 2.7);
			if (sharer) {
				sharer.temperature = sharer_temperature;
			}
		}
	}
	return sharer_temperature;
});

// Empty in tg.
rt.def("/datum/gas_mixture/proc/compare", undefined, false, { args: ["sample"] });

// gas_mixture.dm:395
rt.def("/datum/gas_mixture/proc/compare", function compare(f: Frame, sample: Value) {
	let id: Value = null, gas_moles: Value = null, sample_moles: Value = null, delta: Value = null, total_moles_id: Value = null, temp: Value = null, sample_temp: Value = null, temperature_delta: Value = null;
	let $0: any, $e: any;
	let sample_gases: Value = sample.gases;
	let cached_gases: Value = this.gases;
	for (id of each(rt.bitOr(cached_gases, sample_gases))) {
		if (gas_moles = rt.index(cached_gases, id)) {
			$0 = rt.index(gas_moles, 1);
		} else {
			$0 = 0;
		}
		gas_moles = $0;
		if (sample_moles = rt.index(sample_gases, id)) {
			$0 = rt.index(sample_moles, 1);
		} else {
			$0 = 0;
		}
		sample_moles = $0;
		if ((delta = rt.op(f, "Abs", [], [gas_moles - sample_moles])) > 0.1039838 && delta > gas_moles * 0.001) {
			return id;
		}
	}
	let our_moles: Value = 0;
	for (total_moles_id of each(cached_gases)) {
		our_moles += rt.index(rt.index(cached_gases, total_moles_id), 1);
	}
	if (our_moles > 0.1039838) {
		temp = this.temperature;
		sample_temp = sample.temperature;
		if ((temperature_delta = rt.op(f, "Abs", [], [temp - sample_temp])) > 4) {
			return "temp";
		}
	}
	return "";
});

// Empty in tg.
rt.def("/datum/gas_mixture/proc/react", undefined, false, { args: ["dump_location"] });

// gas_mixture.dm:421
rt.def("/datum/gas_mixture/proc/react", function* react(f: Frame, dump_location: Value) {
	let r: Value = null, reaction: Value = null, min_reqs: Value = null, id: Value = null;
	let $e: any;
	f.dot = 0;
	if (this.temperature < 2.7) {
		this.temperature = 2.7;
	}
	this.reaction_results = (yield* new_(T("/list")));
	let cached_gases: Value = this.gases;
	let temp: Value = this.temperature;
	let ener: Value = this.thermal_energy();
	rt.forList(f, 0, GLOB.SSair.gas_reactions);
	loop19: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		r = $e;
		reaction = r;
		if (rt.index((min_reqs = (yield* reaction.min_requirements.Copy())), "TEMP") && temp < rt.at(min_reqs, "TEMP") || rt.at(min_reqs, "ENER") && ener < rt.at(min_reqs, "ENER")) {
			continue;
		}
		min_reqs -= "TEMP";
		min_reqs -= "ENER";
		id = null;
		for (id of each(min_reqs)) {
			if (!rt.index(cached_gases, id) || rt.index(rt.index(cached_gases, id), 1) < rt.index(min_reqs, id)) {
				continue loop19;
			}
		}
		(f.dot = rt.modify(f.dot, (yield* reaction.react(this, dump_location)), rt.bitOr));
	}
	rt.endFor(f, 0);
	if (!f.dot) return f.dot;
	this.garbage_collect();
	return f.dot;
}, true);

// gas_mixture.dm:470
rt.def("/datum/gas_mixture/proc/get_breath_partial_pressure", function get_breath_partial_pressure(f: Frame, gas_pressure: Value) {
	return gas_pressure * R_IDEAL_GAS_EQUATION * this.temperature / BREATH_VOLUME;
});
