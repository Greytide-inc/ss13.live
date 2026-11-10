// Based on /tg/station's code/modules/atmospherics/gasmixtures/immutable_mixtures.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1845, "/datum/gas_mixture/immutable", "/datum/gas_mixture", {
	initial_temperature: null,
});

// immutable_mixtures.dm:8
rt.def("/datum/gas_mixture/immutable/proc/New", function New(f: Frame) {
	parent_proc();
	this.garbage_collect();
	return f.dot;
});

// immutable_mixtures.dm:12
rt.def("/datum/gas_mixture/immutable/proc/garbage_collect", function garbage_collect(f: Frame) {
	this.temperature = this.initial_temperature;
	this.temperature_archived = this.initial_temperature;
	this.gases.Cut();
	return f.dot;
});

// immutable_mixtures.dm:23
rt.def("/datum/gas_mixture/immutable/proc/heat_capacity_archived", function heat_capacity_archived(f: Frame) {
	return this.heat_capacity();
});

// immutable_mixtures.dm:26
rt.def("/datum/gas_mixture/immutable/proc/share", function share(f: Frame, sharer: Value, atmos_adjacent_turfs: Value) {
	atmos_adjacent_turfs ??= 4;
	f.dot = parent_proc(sharer, 0);
	this.garbage_collect();
	return f.dot;
});

// immutable_mixtures.dm:30
rt.def("/datum/gas_mixture/immutable/proc/after_share", function after_share(f: Frame) {
	this.garbage_collect();
	return f.dot;
});

// immutable_mixtures.dm:36
rt.def("/datum/gas_mixture/immutable/proc/copy", function* copy(f: Frame) {
	return (yield* new_(this.type));
}, true);

// immutable_mixtures.dm:48
rt.def("/datum/gas_mixture/immutable/proc/temperature_share", function temperature_share(f: Frame, sharer: Value, conduction_coefficient: Value, sharer_temperature: Value, sharer_heat_capacity: Value) {
	f.dot = parent_proc();
	this.temperature = this.initial_temperature;
	return f.dot;
}, false);

rt.type(1846, "/datum/gas_mixture/immutable/space", "/datum/gas_mixture/immutable", {
	initial_temperature: 2.7,
});

// immutable_mixtures.dm:60
rt.def("/datum/gas_mixture/immutable/space/proc/remove", function* remove(f: Frame) {
	return (yield* this.copy());
}, true);

// immutable_mixtures.dm:63
rt.def("/datum/gas_mixture/immutable/space/proc/remove_ratio", function* remove_ratio(f: Frame) {
	return (yield* this.copy());
}, true);

rt.type(1847, "/datum/gas_mixture/immutable/cloner", "/datum/gas_mixture/immutable", {
	initial_temperature: 293.15,
});

// immutable_mixtures.dm:71
rt.def("/datum/gas_mixture/immutable/cloner/proc/garbage_collect", function garbage_collect(f: Frame) {
	parent_proc();
	this.add_gas("n2");
	rt.setAt(rt.at(this.gases, "n2"), 1, 103.983795);
	return f.dot;
});
