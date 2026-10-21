// From code/modules/atmospherics/gasmixtures/immutable_mixtures.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1845, "/datum/gas_mixture/immutable", "/datum/gas_mixture", {
	initial_temperature: null,
});

// /datum/gas_mixture/immutable/proc/New  (code/modules/atmospherics/gasmixtures/immutable_mixtures.dm:8)
rt.def("/datum/gas_mixture/immutable/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "garbage_collect", []);
	return f.dot;
});

// /datum/gas_mixture/immutable/proc/garbage_collect  (code/modules/atmospherics/gasmixtures/immutable_mixtures.dm:12)
rt.def("/datum/gas_mixture/immutable/proc/garbage_collect", function garbage_collect(f: Frame) {
	rt.setSv(f, "temperature", rt.sv(f, "initial_temperature"));
	rt.setSv(f, "temperature_archived", rt.sv(f, "initial_temperature"));
	rt.callName(f, rt.sv(f, "gases"), "Cut", []);
	return f.dot;
});

// /datum/gas_mixture/immutable/proc/heat_capacity_archived  (code/modules/atmospherics/gasmixtures/immutable_mixtures.dm:23)
rt.def("/datum/gas_mixture/immutable/proc/heat_capacity_archived", function heat_capacity_archived(f: Frame) {
	return rt.callSrc(f, "heat_capacity", []);
});

// /datum/gas_mixture/immutable/proc/share  (code/modules/atmospherics/gasmixtures/immutable_mixtures.dm:26)
rt.def("/datum/gas_mixture/immutable/proc/share", function share(f: Frame, sharer: Value, atmos_adjacent_turfs: Value) {
	f.vars = () => [atmos_adjacent_turfs];
	if (live(atmos_adjacent_turfs) === null) {
		atmos_adjacent_turfs = 4;
	}
	f.dot = rt.callSuper(f, [live(sharer), 0]);
	rt.callSrc(f, "garbage_collect", []);
	return f.dot;
});

// /datum/gas_mixture/immutable/proc/after_share  (code/modules/atmospherics/gasmixtures/immutable_mixtures.dm:30)
rt.def("/datum/gas_mixture/immutable/proc/after_share", function after_share(f: Frame) {
	rt.callSrc(f, "garbage_collect", []);
	return f.dot;
});

// /datum/gas_mixture/immutable/proc/copy  (code/modules/atmospherics/gasmixtures/immutable_mixtures.dm:36)  may sleep
rt.def("/datum/gas_mixture/immutable/proc/copy", function* copy(f: Frame) {
	return (yield* g.new_(f, rt.sv(f, "type"), []));
}, true);

// /datum/gas_mixture/immutable/proc/temperature_share  (code/modules/atmospherics/gasmixtures/immutable_mixtures.dm:48)
rt.def("/datum/gas_mixture/immutable/proc/temperature_share", function temperature_share(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "temperature", rt.sv(f, "initial_temperature"));
	return f.dot;
}, false, { args: ["sharer", "conduction_coefficient", "sharer_temperature", "sharer_heat_capacity"] });

rt.type(1846, "/datum/gas_mixture/immutable/space", "/datum/gas_mixture/immutable", {
	initial_temperature: 2.7,
});

// /datum/gas_mixture/immutable/space/proc/remove  (code/modules/atmospherics/gasmixtures/immutable_mixtures.dm:60)  may sleep
rt.def("/datum/gas_mixture/immutable/space/proc/remove", function* remove(f: Frame) {
	return (yield* g.srcCall(f, "copy"));
}, true);

// /datum/gas_mixture/immutable/space/proc/remove_ratio  (code/modules/atmospherics/gasmixtures/immutable_mixtures.dm:63)  may sleep
rt.def("/datum/gas_mixture/immutable/space/proc/remove_ratio", function* remove_ratio(f: Frame) {
	return (yield* g.srcCall(f, "copy"));
}, true);

rt.type(1847, "/datum/gas_mixture/immutable/cloner", "/datum/gas_mixture/immutable", {
	initial_temperature: 293.15,
});

// /datum/gas_mixture/immutable/cloner/proc/garbage_collect  (code/modules/atmospherics/gasmixtures/immutable_mixtures.dm:71)
rt.def("/datum/gas_mixture/immutable/cloner/proc/garbage_collect", function garbage_collect(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "add_gas", ["n2"]);
	rt.setAt(rt.at(rt.sv(f, "gases"), "n2"), 1, 103.98379516601562);
	return f.dot;
});
