// From code/modules/atmospherics/gasmixtures/gas_mixture.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalmeta_gas_info  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:10)  may sleep
rt.def("/datum/controller/global_vars/proc/InitGlobalmeta_gas_info", function* InitGlobalmeta_gas_info(f: Frame) {
	rt.setGl("meta_gas_info", (yield* g.call(f, P("/proc/meta_gas_list"), null, [])));
	rt.modSrcVar(f, "gvars_datum_init_order", "meta_gas_info", add);
	return f.dot;
}, true);

// /datum/controller/global_vars/proc/InitGlobalgaslist_cache  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:11)
rt.def("/datum/controller/global_vars/proc/InitGlobalgaslist_cache", function InitGlobalgaslist_cache(f: Frame) {
	rt.setGl("gaslist_cache", rt.call(f, P("/proc/init_gaslist_cache"), null, []));
	rt.modSrcVar(f, "gvars_datum_init_order", "gaslist_cache", add);
	return f.dot;
});

// /proc/init_gaslist_cache  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:14)
rt.def("/proc/init_gaslist_cache", function init_gaslist_cache(f: Frame) {
	let id: Value = null, cached_gas: Value = null;
	let $e: any;
	f.vars = () => [id, cached_gas, $e];
	f.dot = rt.list();
	id = null;
	rt.forList(f, 0, rt.gl("meta_gas_info"));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		cached_gas = rt.new_(f, T("/list"), [3]);
		rt.setAt(live(f.dot), live(id), live(cached_gas));
		rt.setAt(live(cached_gas), 1, 0);
		rt.setAt(live(cached_gas), 2, 0);
		rt.setAt(live(cached_gas), 3, rt.index(rt.gl("meta_gas_info"), live(id)));
	}
	rt.endFor(f, 0);
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

// /datum/gas_mixture/proc/New  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:37)
rt.def("/datum/gas_mixture/proc/New", function New(f: Frame, volume: Value) {
	f.vars = () => [volume];
	if (live(volume) === null) {
		volume = 2500;
	}
	rt.setSv(f, "gases", rt.new_(f, T("/list"), []));
	rt.setSv(f, "temperature", 0);
	rt.setSv(f, "temperature_archived", 0);
	rt.setFv(f, "volume", live(f.src), live(volume));
	rt.setSv(f, "last_share", 0);
	rt.setSv(f, "reaction_results", rt.new_(f, T("/list"), []));
	return f.dot;
});

// /datum/gas_mixture/proc/assert_gas  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:49)
rt.def("/datum/gas_mixture/proc/assert_gas", function assert_gas(f: Frame, gas_id: Value) {
	let cached_gases: Value = null, tmp_gaslist: Value = null;
	f.vars = () => [cached_gases, tmp_gaslist];
	if (truthy(rt.index((cached_gases = rt.sv(f, "gases")), live(gas_id)))) {
		return live(f.dot);
	}
	tmp_gaslist = rt.index(rt.gl("gaslist_cache"), live(gas_id));
	rt.setAt(live(cached_gases), live(gas_id), rt.callName(f, live(tmp_gaslist), "Copy", []));
	return f.dot;
});

// /datum/gas_mixture/proc/assert_gases  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:56)
rt.def("/datum/gas_mixture/proc/assert_gases", function assert_gases(f: Frame) {
	let id: Value = null;
	let $e: any;
	f.vars = () => [id, $e];
	id = null;
	rt.forList(f, 0, f.argsList);
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		rt.callSrc(f, "assert_gas", [live(id)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/gas_mixture/proc/add_gas  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:63)
rt.def("/datum/gas_mixture/proc/add_gas", function add_gas(f: Frame, gas_id: Value) {
	let tmp_gaslist: Value = null;
	f.vars = () => [tmp_gaslist];
	tmp_gaslist = rt.index(rt.gl("gaslist_cache"), live(gas_id));
	rt.setAt(rt.sv(f, "gases"), live(gas_id), rt.callName(f, live(tmp_gaslist), "Copy", []));
	return f.dot;
});

// /datum/gas_mixture/proc/add_gases  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:67)
rt.def("/datum/gas_mixture/proc/add_gases", function add_gases(f: Frame) {
	let cached_gases: Value = null, id: Value = null, tmp_gaslist: Value = null;
	let $e: any;
	f.vars = () => [cached_gases, id, tmp_gaslist, $e];
	cached_gases = rt.sv(f, "gases");
	id = null;
	rt.forList(f, 0, f.argsList);
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		tmp_gaslist = rt.index(rt.gl("gaslist_cache"), live(id));
		rt.setAt(live(cached_gases), live(id), rt.callName(f, live(tmp_gaslist), "Copy", []));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/gas_mixture/proc/garbage_collect  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:77)
rt.def("/datum/gas_mixture/proc/garbage_collect", function garbage_collect(f: Frame, tocheck: Value) {
	let cached_gases: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [cached_gases, id, $e];
	cached_gases = rt.sv(f, "gases");
	id = null;
	rt.forList(f, 0, (live(tocheck) || live(cached_gases)));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		if ((rt.le(rt.index(rt.index(live(cached_gases), live(id)), 1), 0) && rt.le(rt.index(rt.index(live(cached_gases), live(id)), 2), 0))) {
			(cached_gases = rt.modify(live(cached_gases), live(id), subtract));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/gas_mixture/proc/heat_capacity  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:84)
rt.def("/datum/gas_mixture/proc/heat_capacity", function heat_capacity(f: Frame) {
	let cached_gases: Value = null, id: Value = null, gas_data: Value = null;
	let $e: any;
	f.vars = () => [cached_gases, id, gas_data, $e];
	cached_gases = rt.sv(f, "gases");
	f.dot = 0;
	id = null;
	rt.forList(f, 0, live(cached_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		f.dot = rt.modify(live(f.dot), multiply(rt.index((gas_data = rt.index(live(cached_gases), live(id))), 1), rt.index(rt.index(live(gas_data), 3), 1)), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/gas_mixture/proc/heat_capacity_archived  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:91)
rt.def("/datum/gas_mixture/proc/heat_capacity_archived", function heat_capacity_archived(f: Frame) {
	let cached_gases: Value = null, id: Value = null, gas_data: Value = null;
	let $e: any;
	f.vars = () => [cached_gases, id, gas_data, $e];
	cached_gases = rt.sv(f, "gases");
	f.dot = 0;
	id = null;
	rt.forList(f, 0, live(cached_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		f.dot = rt.modify(live(f.dot), multiply(rt.index((gas_data = rt.index(live(cached_gases), live(id))), 2), rt.index(rt.index(live(gas_data), 3), 1)), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/gas_mixture/proc/total_moles  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:105)
rt.def("/datum/gas_mixture/proc/total_moles", function total_moles(f: Frame) {
	let cached_gases: Value = null, total_moles_id: Value = null;
	let $e: any;
	f.vars = () => [cached_gases, total_moles_id, $e];
	cached_gases = rt.sv(f, "gases");
	f.dot = 0;
	total_moles_id = null;
	rt.forList(f, 0, live(cached_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		total_moles_id = $e;
		f.dot = rt.modify(live(f.dot), rt.index(rt.index(live(cached_gases), live(total_moles_id)), 1), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/gas_mixture/proc/return_pressure  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:109)
rt.def("/datum/gas_mixture/proc/return_pressure", function return_pressure(f: Frame) {
	let cached_gases: Value = null, total_moles_id: Value = null;
	let $e: any;
	f.vars = () => [cached_gases, total_moles_id, $e];
	if (rt.gt(rt.sv(f, "volume"), 0)) {
		cached_gases = rt.sv(f, "gases");
		f.dot = 0;
		total_moles_id = null;
		rt.forList(f, 0, live(cached_gases));
		while (($e = rt.next(f, 0)) !== undefined) {
			total_moles_id = $e;
			f.dot = rt.modify(live(f.dot), rt.index(rt.index(live(cached_gases), live(total_moles_id)), 1), add);
		}
		rt.endFor(f, 0);
		(f.dot = rt.modify(live(f.dot), divide(multiply(8.3100004196167, rt.sv(f, "temperature")), rt.sv(f, "volume")), multiply));
		return live(f.dot);
	}
	return 0;
});

// /datum/gas_mixture/proc/return_volume  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:120)
rt.def("/datum/gas_mixture/proc/return_volume", function return_volume(f: Frame) {
	return rt.call(f, P("/proc/max"), null, [0, rt.sv(f, "volume")]);
});

// /datum/gas_mixture/proc/thermal_energy  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:123)
rt.def("/datum/gas_mixture/proc/thermal_energy", function thermal_energy(f: Frame) {
	return multiply(rt.sv(f, "temperature"), rt.callSrc(f, "heat_capacity", []));
});

// /datum/gas_mixture/proc/archive  empty
rt.def("/datum/gas_mixture/proc/archive");

// /datum/gas_mixture/proc/archive  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:177)
rt.def("/datum/gas_mixture/proc/archive", function archive(f: Frame) {
	let cached_gases: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [cached_gases, id, $e];
	cached_gases = rt.sv(f, "gases");
	rt.setSv(f, "temperature_archived", rt.sv(f, "temperature"));
	id = null;
	rt.forList(f, 0, live(cached_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		rt.setAt(rt.index(live(cached_gases), live(id)), 2, rt.index(rt.index(live(cached_gases), live(id)), 1));
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/gas_mixture/proc/merge  empty
rt.def("/datum/gas_mixture/proc/merge", undefined, false, { args: ["giver"] });

// /datum/gas_mixture/proc/merge  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:186)
rt.def("/datum/gas_mixture/proc/merge", function merge(f: Frame, giver: Value) {
	let self_heat_capacity: Value = null, giver_heat_capacity: Value = null, combined_heat_capacity: Value = null, cached_gases: Value = null, giver_gases: Value = null, giver_id: Value = null;
	let $e: any;
	f.vars = () => [self_heat_capacity, giver_heat_capacity, combined_heat_capacity, cached_gases, giver_gases, giver_id, $e];
	if (!truthy(live(giver))) {
		return 0;
	}
	if (rt.gt(rt.op(f, "Abs", [], [subtract(rt.sv(f, "temperature"), rt.fv(f, "temperature", live(giver)))]), 0.5)) {
		self_heat_capacity = rt.callSrc(f, "heat_capacity", []);
		giver_heat_capacity = rt.callName(f, live(giver), "heat_capacity", []);
		if (truthy((combined_heat_capacity = add(live(giver_heat_capacity), live(self_heat_capacity))))) {
			rt.setSv(f, "temperature", divide(add(multiply(rt.fv(f, "temperature", live(giver)), live(giver_heat_capacity)), multiply(rt.sv(f, "temperature"), live(self_heat_capacity))), live(combined_heat_capacity)));
		}
	}
	cached_gases = rt.sv(f, "gases");
	giver_gases = rt.fv(f, "gases", live(giver));
	giver_id = null;
	rt.forList(f, 0, live(giver_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		giver_id = $e;
		rt.callSrc(f, "assert_gas", [live(giver_id)]);
		rt.modAt(rt.index(live(cached_gases), live(giver_id)), 1, rt.index(rt.index(live(giver_gases), live(giver_id)), 1), add);
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/gas_mixture/proc/remove  empty
rt.def("/datum/gas_mixture/proc/remove", undefined, false, { args: ["amount"] });

// /datum/gas_mixture/proc/remove  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:208)
rt.def("/datum/gas_mixture/proc/remove", function remove(f: Frame, amount: Value) {
	let sum: Value = null, cached_gases: Value = null, total_moles_id: Value = null, removed: Value = null, removed_gases: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [amount, sum, cached_gases, total_moles_id, removed, removed_gases, id, $e];
	sum = null;
	cached_gases = rt.sv(f, "gases");
	sum = 0;
	total_moles_id = null;
	rt.forList(f, 0, live(cached_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		total_moles_id = $e;
		sum = rt.modify(live(sum), rt.index(rt.index(live(cached_gases), live(total_moles_id)), 1), add);
	}
	rt.endFor(f, 0);
	if (rt.le((amount = rt.call(f, P("/proc/min"), null, [live(amount), live(sum)])), 0)) {
		return null;
	}
	removed = rt.new_(f, T("/datum/gas_mixture"), []);
	removed_gases = rt.fv(f, "gases", live(removed));
	rt.setFv(f, "temperature", live(removed), rt.sv(f, "temperature"));
	id = null;
	rt.forList(f, 0, live(cached_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		rt.callName(f, live(removed), "add_gas", [live(id)]);
		rt.setAt(rt.index(live(removed_gases), live(id)), 1, rt.call(f, P("/proc/round"), null, [multiply(divide(rt.index(rt.index(live(cached_gases), live(id)), 1), live(sum)), live(amount)), 1.0000000116860974e-7]));
		(rt.modAt(rt.index(live(cached_gases), live(id)), 1, rt.index(rt.index(live(removed_gases), live(id)), 1), subtract));
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "garbage_collect", []);
	return live(removed);
});

// /datum/gas_mixture/proc/remove_ratio  empty
rt.def("/datum/gas_mixture/proc/remove_ratio", undefined, false, { args: ["ratio"] });

// /datum/gas_mixture/proc/remove_ratio  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:226)
rt.def("/datum/gas_mixture/proc/remove_ratio", function remove_ratio(f: Frame, ratio: Value) {
	let cached_gases: Value = null, removed: Value = null, removed_gases: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [ratio, cached_gases, removed, removed_gases, id, $e];
	if (rt.le(live(ratio), 0)) {
		return null;
	}
	ratio = rt.call(f, P("/proc/min"), null, [live(ratio), 1]);
	cached_gases = rt.sv(f, "gases");
	removed = rt.new_(f, T("/datum/gas_mixture"), []);
	removed_gases = rt.fv(f, "gases", live(removed));
	rt.setFv(f, "temperature", live(removed), rt.sv(f, "temperature"));
	id = null;
	rt.forList(f, 0, live(cached_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		rt.callName(f, live(removed), "add_gas", [live(id)]);
		rt.setAt(rt.index(live(removed_gases), live(id)), 1, rt.call(f, P("/proc/round"), null, [multiply(rt.index(rt.index(live(cached_gases), live(id)), 1), live(ratio)), 1.0000000116860974e-7]));
		(rt.modAt(rt.index(live(cached_gases), live(id)), 1, rt.index(rt.index(live(removed_gases), live(id)), 1), subtract));
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "garbage_collect", []);
	return live(removed);
});

// /datum/gas_mixture/proc/copy  empty
rt.def("/datum/gas_mixture/proc/copy");

// /datum/gas_mixture/proc/copy  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:245)
rt.def("/datum/gas_mixture/proc/copy", function copy(f: Frame) {
	let cached_gases: Value = null, copy: Value = null, copy_gases: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [cached_gases, copy, copy_gases, id, $e];
	cached_gases = rt.sv(f, "gases");
	copy = rt.new_(f, T("/datum/gas_mixture"), []);
	copy_gases = rt.fv(f, "gases", live(copy));
	rt.setFv(f, "temperature", live(copy), rt.sv(f, "temperature"));
	id = null;
	rt.forList(f, 0, live(cached_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		rt.callName(f, live(copy), "add_gas", [live(id)]);
		rt.setAt(rt.index(live(copy_gases), live(id)), 1, rt.index(rt.index(live(cached_gases), live(id)), 1));
	}
	rt.endFor(f, 0);
	return live(copy);
});

// /datum/gas_mixture/proc/copy_from  empty
rt.def("/datum/gas_mixture/proc/copy_from", undefined, false, { args: ["sample"] });

// /datum/gas_mixture/proc/copy_from  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:257)
rt.def("/datum/gas_mixture/proc/copy_from", function copy_from(f: Frame, sample: Value) {
	let cached_gases: Value = null, sample_gases: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [cached_gases, sample_gases, id, $e];
	cached_gases = rt.sv(f, "gases");
	sample_gases = rt.fv(f, "gases", live(sample));
	rt.setSv(f, "temperature", rt.fv(f, "temperature", live(sample)));
	id = null;
	rt.forList(f, 0, live(sample_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		rt.callSrc(f, "assert_gas", [live(id)]);
		rt.setAt(rt.index(live(cached_gases), live(id)), 1, rt.index(rt.index(live(sample_gases), live(id)), 1));
	}
	rt.endFor(f, 0);
	(cached_gases = rt.modify(live(cached_gases), live(sample_gases), rt.bitAnd));
	return 1;
});

// /datum/gas_mixture/proc/copy_from_scaled  (speed-gas addition): copy_from(sample), then every gas's moles *= volume / sample.volume.
// This is the second loop of /datum/pipeline/proc/reconcile_air (datum_pipeline.dm:207) as one proc, so src/translate/fast-air.ts can stand in for it.
rt.def("/datum/gas_mixture/proc/copy_from_scaled", function copy_from_scaled(f: Frame, sample: Value) {
	let G_gases: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [G_gases, id, $e];
	rt.callSrc(f, "copy_from", [live(sample)]);
	G_gases = rt.sv(f, "gases");
	id = null;
	rt.forList(f, 1, live(G_gases));
	while (($e = rt.next(f, 1)) !== undefined) {
		id = $e;
		(rt.modAt(rt.index(live(G_gases), live(id)), 1, divide(rt.sv(f, "volume"), rt.fv(f, "volume", live(sample))), multiply));
	}
	rt.endFor(f, 1);
	return f.dot;
});

// /datum/gas_mixture/proc/reconcile_from  (speed-gas addition): the two loops of /datum/pipeline/proc/reconcile_air (datum_pipeline.dm:207) as
// one proc on the pipeline's new total mixture, so src/translate/fast-air.ts can stand in for it. GL = the mixtures to reconcile.
rt.def("/datum/gas_mixture/proc/reconcile_from", function reconcile_from(f: Frame, GL: Value) {
	let total_thermal_energy: Value = null, total_heat_capacity: Value = null, i: Value = null, G: Value = null, $1: any;
	let $e: any;
	f.vars = () => [GL, total_thermal_energy, total_heat_capacity, i, G, $1, $e];
	total_thermal_energy = 0;
	total_heat_capacity = 0;
	i = null;
	rt.forList(f, 0, live(GL));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		G = live(i);
		rt.modSrcVar(f, "volume", rt.fv(f, "volume", live(G)), add);
		rt.callSrc(f, "merge", [live(G)]);
		total_thermal_energy = rt.modify(live(total_thermal_energy), rt.callName(f, live(G), "thermal_energy", []), add);
		total_heat_capacity = rt.modify(live(total_heat_capacity), rt.callName(f, live(G), "heat_capacity", []), add);
	}
	rt.endFor(f, 0);
	if (truthy(live(total_heat_capacity))) {
		$1 = divide(live(total_thermal_energy), live(total_heat_capacity));
	} else {
		$1 = 0;
	}
	rt.setSv(f, "temperature", $1);
	if (!rt.gt(rt.sv(f, "volume"), 0)) return f.dot;
	i = null;
	rt.forList(f, 0, live(GL));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.callName(f, (G = live(i)), "copy_from_scaled", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/gas_mixture/proc/copy_from_turf  empty
rt.def("/datum/gas_mixture/proc/copy_from_turf", undefined, false, { args: ["model"] });

// /datum/gas_mixture/proc/copy_from_turf  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:271)
rt.def("/datum/gas_mixture/proc/copy_from_turf", function copy_from_turf(f: Frame, model: Value) {
	let model_parent: Value = null;
	f.vars = () => [model_parent];
	rt.callSrc(f, "parse_gas_string", [rt.fv(f, "initial_gas_mix", live(model))]);
	model_parent = rt.fv(f, "parent_type", live(model));
	if ((!isEqual(rt.fv(f, "temperature", live(model)), rt.initial(f, live(model), "temperature")) || !isEqual(rt.fv(f, "temperature", live(model)), rt.initial(f, live(model_parent), "temperature")))) {
		rt.setSv(f, "temperature", rt.fv(f, "temperature", live(model)));
	}
	return 1;
});

// /datum/gas_mixture/proc/parse_gas_string  empty
rt.def("/datum/gas_mixture/proc/parse_gas_string", undefined, false, { args: ["gas_string"] });

// /datum/gas_mixture/proc/parse_gas_string  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:282)
rt.def("/datum/gas_mixture/proc/parse_gas_string", function parse_gas_string(f: Frame, gas_string: Value) {
	let gases: Value = null, gas: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [gases, gas, id, $e];
	gases = rt.fv(f, "gases", live(f.src));
	if (truthy(rt.index((gas = rt.call(f, P("/proc/params2list"), null, [live(gas_string)])), "TEMP"))) {
		rt.setSv(f, "temperature", rt.call(f, P("/proc/text2num"), null, [rt.at(live(gas), "TEMP")]));
		(gas = rt.modify(live(gas), "TEMP", subtract));
	}
	rt.callName(f, live(gases), "Cut", []);
	id = null;
	rt.forList(f, 0, live(gas));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		rt.callSrc(f, "add_gas", [live(id)]);
		rt.setAt(rt.index(live(gases), live(id)), 1, rt.call(f, P("/proc/text2num"), null, [rt.index(live(gas), live(id))]));
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/gas_mixture/proc/share  empty
rt.def("/datum/gas_mixture/proc/share", undefined, false, { args: ["sharer"] });

// /datum/gas_mixture/proc/share  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:293)
rt.def("/datum/gas_mixture/proc/share", function share(f: Frame, sharer: Value, atmos_adjacent_turfs: Value) {
	let cached_gases: Value = null, sharer_gases: Value = null, temperature_delta: Value = null, abs_temperature_delta: Value = null, old_self_heat_capacity: Value = null, old_sharer_heat_capacity: Value = null, heat_capacity_self_to_sharer: Value = null, heat_capacity_sharer_to_self: Value = null, moved_moles: Value = null, abs_moved_moles: Value = null, id: Value = null, gas: Value = null, sharergas: Value = null, delta: Value = null, gas_heat_capacity: Value = null, new_self_heat_capacity: Value = null, new_sharer_heat_capacity: Value = null, unique_gases: Value = null, our_moles: Value = null, total_moles_id: Value = null, their_moles: Value = null, total_moles_id_13: Value = null, delta_pressure: Value = null;
	let $e: any;
	f.vars = () => [atmos_adjacent_turfs, cached_gases, sharer_gases, temperature_delta, abs_temperature_delta, old_self_heat_capacity, old_sharer_heat_capacity, heat_capacity_self_to_sharer, heat_capacity_sharer_to_self, moved_moles, abs_moved_moles, id, gas, sharergas, delta, gas_heat_capacity, new_self_heat_capacity, new_sharer_heat_capacity, unique_gases, our_moles, total_moles_id, their_moles, total_moles_id_13, delta_pressure, $e];
	if (live(atmos_adjacent_turfs) === null) {
		atmos_adjacent_turfs = 4;
	}
	if (!truthy(live(sharer))) {
		return 0;
	}
	cached_gases = rt.sv(f, "gases");
	sharer_gases = rt.fv(f, "gases", live(sharer));
	temperature_delta = subtract(rt.sv(f, "temperature_archived"), rt.fv(f, "temperature_archived", live(sharer)));
	abs_temperature_delta = rt.op(f, "Abs", [], [live(temperature_delta)]);
	old_self_heat_capacity = 0;
	old_sharer_heat_capacity = 0;
	if (rt.gt(live(abs_temperature_delta), 0.5)) {
		old_self_heat_capacity = rt.callSrc(f, "heat_capacity", []);
		old_sharer_heat_capacity = rt.callName(f, live(sharer), "heat_capacity", []);
	}
	heat_capacity_self_to_sharer = 0;
	heat_capacity_sharer_to_self = 0;
	moved_moles = 0;
	abs_moved_moles = 0;
	id = null;
	rt.forList(f, 0, subtract(live(sharer_gases), live(cached_gases)));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		rt.callSrc(f, "add_gas", [live(id)]);
	}
	rt.endFor(f, 0);
	id = null;
	rt.forList(f, 0, live(cached_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		if (!truthy(rt.index(live(sharer_gases), live(id)))) {
			rt.callName(f, live(sharer), "add_gas", [live(id)]);
		}
		gas = rt.index(live(cached_gases), live(id));
		sharergas = rt.index(live(sharer_gases), live(id));
		if ((truthy((delta = divide(rt.call(f, P("/proc/round"), null, [subtract(rt.index(live(gas), 2), rt.index(live(sharergas), 2)), 1.0000000116860974e-7]), add(live(atmos_adjacent_turfs), 1)))) && rt.gt(live(abs_temperature_delta), 0.5))) {
			gas_heat_capacity = multiply(live(delta), rt.index(rt.index(live(gas), 3), 1));
			if (rt.gt(live(delta), 0)) {
				heat_capacity_self_to_sharer = rt.modify(live(heat_capacity_self_to_sharer), live(gas_heat_capacity), add);
			} else {
				(heat_capacity_sharer_to_self = rt.modify(live(heat_capacity_sharer_to_self), live(gas_heat_capacity), subtract));
			}
		}
		(rt.modAt(live(gas), 1, live(delta), subtract));
		rt.modAt(live(sharergas), 1, live(delta), add);
		moved_moles = rt.modify(live(moved_moles), live(delta), add);
		abs_moved_moles = rt.modify(live(abs_moved_moles), rt.op(f, "Abs", [], [live(delta)]), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "last_share", live(abs_moved_moles));
	if (rt.gt(live(abs_temperature_delta), 0.5)) {
		new_self_heat_capacity = subtract(add(live(old_self_heat_capacity), live(heat_capacity_sharer_to_self)), live(heat_capacity_self_to_sharer));
		new_sharer_heat_capacity = subtract(add(live(old_sharer_heat_capacity), live(heat_capacity_self_to_sharer)), live(heat_capacity_sharer_to_self));
		if (rt.gt(live(new_self_heat_capacity), 0.0003000000142492354)) {
			rt.setSv(f, "temperature", divide(add(subtract(multiply(live(old_self_heat_capacity), rt.sv(f, "temperature")), multiply(live(heat_capacity_self_to_sharer), rt.sv(f, "temperature_archived"))), multiply(live(heat_capacity_sharer_to_self), rt.fv(f, "temperature_archived", live(sharer)))), live(new_self_heat_capacity)));
		}
		if (rt.gt(live(new_sharer_heat_capacity), 0.0003000000142492354)) {
			rt.setFv(f, "temperature", live(sharer), divide(add(subtract(multiply(live(old_sharer_heat_capacity), rt.fv(f, "temperature", live(sharer))), multiply(live(heat_capacity_sharer_to_self), rt.fv(f, "temperature_archived", live(sharer)))), multiply(live(heat_capacity_self_to_sharer), rt.sv(f, "temperature_archived"))), live(new_sharer_heat_capacity)));
			if (rt.gt(rt.op(f, "Abs", [], [live(old_sharer_heat_capacity)]), 0.0003000000142492354)) {
				if (rt.lt(rt.op(f, "Abs", [], [subtract(divide(live(new_sharer_heat_capacity), live(old_sharer_heat_capacity)), 1)]), 0.10000000149011612)) {
					rt.callSrc(f, "temperature_share", [live(sharer), 0.4000000059604645]);
				}
			}
		}
	}
	if (truthy(rt.getLen(f, (unique_gases = rt.bitXor(live(cached_gases), live(sharer_gases)))))) {
		rt.callSrc(f, "garbage_collect", [subtract(live(cached_gases), live(sharer_gases))]);
		rt.callName(f, live(sharer), "garbage_collect", [subtract(live(sharer_gases), live(cached_gases))]);
	}
	rt.callName(f, live(sharer), "after_share", [live(f.src), live(atmos_adjacent_turfs)]);
	if (!(rt.gt(live(temperature_delta), 393.1499938964844) || rt.gt(rt.op(f, "Abs", [], [live(moved_moles)]), 0.1039837971329689))) return f.dot;
	our_moles = null;
	our_moles = 0;
	total_moles_id = null;
	rt.forList(f, 0, live(cached_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		total_moles_id = $e;
		our_moles = rt.modify(live(our_moles), rt.index(rt.index(live(cached_gases), live(total_moles_id)), 1), add);
	}
	rt.endFor(f, 0);
	their_moles = null;
	their_moles = 0;
	total_moles_id_13 = null;
	rt.forList(f, 0, live(sharer_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		total_moles_id_13 = $e;
		their_moles = rt.modify(live(their_moles), rt.index(rt.index(live(sharer_gases), live(total_moles_id_13)), 1), add);
	}
	rt.endFor(f, 0);
	return divide(multiply((delta_pressure = subtract(multiply(rt.sv(f, "temperature_archived"), add(live(our_moles), live(moved_moles))), multiply(rt.fv(f, "temperature_archived", live(sharer)), subtract(live(their_moles), live(moved_moles))))), 8.3100004196167), rt.sv(f, "volume"));
});

// /datum/gas_mixture/proc/temperature_share  empty
rt.def("/datum/gas_mixture/proc/temperature_share", undefined, false, { args: ["sharer", "conduction_coefficient"] });

// /datum/gas_mixture/proc/temperature_share  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:377)
rt.def("/datum/gas_mixture/proc/temperature_share", function temperature_share(f: Frame, sharer: Value, conduction_coefficient: Value, sharer_temperature: Value, sharer_heat_capacity: Value) {
	let temperature_delta: Value = null, self_heat_capacity: Value = null, heat: Value = null;
	f.vars = () => [sharer_temperature, sharer_heat_capacity, temperature_delta, self_heat_capacity, heat];
	if (truthy(live(sharer))) {
		sharer_temperature = rt.fv(f, "temperature_archived", live(sharer));
	}
	if (rt.gt(rt.op(f, "Abs", [], [(temperature_delta = subtract(rt.sv(f, "temperature_archived"), live(sharer_temperature)))]), 0.5)) {
		self_heat_capacity = rt.callSrc(f, "heat_capacity_archived", []);
		if ((rt.gt((sharer_heat_capacity = (live(sharer_heat_capacity) || rt.callName(f, live(sharer), "heat_capacity_archived", []))), 0.0003000000142492354) && rt.gt(live(self_heat_capacity), 0.0003000000142492354))) {
			heat = multiply(multiply(live(conduction_coefficient), live(temperature_delta)), divide(multiply(live(self_heat_capacity), live(sharer_heat_capacity)), add(live(self_heat_capacity), live(sharer_heat_capacity))));
			rt.setSv(f, "temperature", rt.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "temperature"), divide(live(heat), live(self_heat_capacity))), 2.700000047683716]));
			sharer_temperature = rt.call(f, P("/proc/max"), null, [add(live(sharer_temperature), divide(live(heat), live(sharer_heat_capacity))), 2.700000047683716]);
			if (truthy(live(sharer))) {
				rt.setFv(f, "temperature", live(sharer), live(sharer_temperature));
			}
		}
	}
	return live(sharer_temperature);
});

// /datum/gas_mixture/proc/compare  empty
rt.def("/datum/gas_mixture/proc/compare", undefined, false, { args: ["sample"] });

// /datum/gas_mixture/proc/compare  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:395)
rt.def("/datum/gas_mixture/proc/compare", function compare(f: Frame, sample: Value) {
	let sample_gases: Value = null, cached_gases: Value = null, id: Value = null, gas_moles: Value = null, sample_moles: Value = null, delta: Value = null, our_moles: Value = null, total_moles_id: Value = null, temp: Value = null, sample_temp: Value = null, temperature_delta: Value = null;
	let $0: any, $e: any;
	f.vars = () => [sample_gases, cached_gases, id, gas_moles, sample_moles, delta, our_moles, total_moles_id, temp, sample_temp, temperature_delta, $0, $e];
	sample_gases = rt.fv(f, "gases", live(sample));
	cached_gases = rt.sv(f, "gases");
	id = null;
	rt.forList(f, 0, rt.bitOr(live(cached_gases), live(sample_gases)));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		if (truthy((gas_moles = rt.index(live(cached_gases), live(id))))) {
			$0 = rt.index(live(gas_moles), 1);
		} else {
			$0 = 0;
		}
		gas_moles = $0;
		if (truthy((sample_moles = rt.index(live(sample_gases), live(id))))) {
			$0 = rt.index(live(sample_moles), 1);
		} else {
			$0 = 0;
		}
		sample_moles = $0;
		if ((rt.gt((delta = rt.op(f, "Abs", [], [subtract(live(gas_moles), live(sample_moles))])), 0.1039837971329689) && rt.gt(live(delta), multiply(live(gas_moles), 0.0010000000474974513)))) {
			return live(id);
		}
	}
	rt.endFor(f, 0);
	our_moles = null;
	our_moles = 0;
	total_moles_id = null;
	rt.forList(f, 0, live(cached_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		total_moles_id = $e;
		our_moles = rt.modify(live(our_moles), rt.index(rt.index(live(cached_gases), live(total_moles_id)), 1), add);
	}
	rt.endFor(f, 0);
	if (rt.gt(live(our_moles), 0.1039837971329689)) {
		temp = rt.sv(f, "temperature");
		sample_temp = rt.fv(f, "temperature", live(sample));
		if (rt.gt((temperature_delta = rt.op(f, "Abs", [], [subtract(live(temp), live(sample_temp))])), 4)) {
			return "temp";
		}
	}
	return "";
});

// /datum/gas_mixture/proc/react  empty
rt.def("/datum/gas_mixture/proc/react", undefined, false, { args: ["dump_location"] });

// /datum/gas_mixture/proc/react  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:421)  may sleep
rt.def("/datum/gas_mixture/proc/react", function* react(f: Frame, dump_location: Value) {
	let cached_gases: Value = null, temp: Value = null, ener: Value = null, r: Value = null, reaction: Value = null, min_reqs: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [dump_location, cached_gases, temp, ener, r, reaction, min_reqs, id, $e];
	f.dot = 0;
	if (rt.lt(rt.sv(f, "temperature"), 2.700000047683716)) {
		rt.setSv(f, "temperature", 2.700000047683716);
	}
	rt.setSv(f, "reaction_results", (yield* g.new_(f, T("/list"), [])));
	cached_gases = rt.sv(f, "gases");
	temp = rt.sv(f, "temperature");
	ener = (yield* g.srcCall(f, "thermal_energy"));
	r = null;
	rt.forList(f, 0, rt.fv(f, "gas_reactions", rt.gl("SSair")));
	loop19: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		r = $e;
		reaction = live(r);
		if (((truthy(rt.index((min_reqs = (yield* g.callName(f, rt.fv(f, "min_requirements", live(reaction)), "Copy", []))), "TEMP")) && rt.lt(live(temp), rt.at(live(min_reqs), "TEMP"))) || (truthy(rt.at(live(min_reqs), "ENER")) && rt.lt(live(ener), rt.at(live(min_reqs), "ENER"))))) {
			continue;
		}
		(min_reqs = rt.modify(live(min_reqs), "TEMP", subtract));
		(min_reqs = rt.modify(live(min_reqs), "ENER", subtract));
		id = null;
		rt.forList(f, 1, live(min_reqs));
		while (($e = rt.next(f, 1)) !== undefined) {
			id = $e;
			if ((!truthy(rt.index(live(cached_gases), live(id))) || rt.lt(rt.index(rt.index(live(cached_gases), live(id)), 1), rt.index(live(min_reqs), live(id))))) {
				continue loop19;
			}
		}
		rt.endFor(f, 1);
		(f.dot = rt.modify(live(f.dot), (yield* g.callName(f, live(reaction), "react", [live(f.src), live(dump_location)])), rt.bitOr));
	}
	rt.endFor(f, 0);
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "garbage_collect");
	return f.dot;
}, true);

// /datum/gas_mixture/proc/get_breath_partial_pressure  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:470)
rt.def("/datum/gas_mixture/proc/get_breath_partial_pressure", function get_breath_partial_pressure(f: Frame, gas_pressure: Value) {
	return divide(multiply(multiply(live(gas_pressure), 8.3100004196167), rt.sv(f, "temperature")), 0.5);
});

// /datum/gas_mixture/proc/get_true_breath_pressure  (code/modules/atmospherics/gasmixtures/gas_mixture.dm:473)
rt.def("/datum/gas_mixture/proc/get_true_breath_pressure", function get_true_breath_pressure(f: Frame, partial_pressure: Value) {
	return divide(multiply(live(partial_pressure), 0.5), multiply(8.3100004196167, rt.sv(f, "temperature")));
});
