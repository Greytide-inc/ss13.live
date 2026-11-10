// Based on /tg/station's code/modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10563, "/obj/machinery/atmospherics/components/binary/dp_vent_pump", "/obj/machinery/atmospherics/components/binary", {
	frequency: 0,
	id: null,
	radio_connection: null,
	on: 0,
	pump_direction: 1,
	external_pressure_bound: 101.325,
	input_pressure_min: 0,
	output_pressure_max: 0,
	pressure_checks: 1,
	level: 1,
	icon: rt.rsc("icons/obj/atmospherics/components/unary_devices.dmi"),
	icon_state: "dpvent_map",
	name: "dual-port air vent",
	desc: "Has a valve and pump attached to it. There are two ports.",
});

// dp_vent_pump.dm:41
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	return (yield* parent_proc());
}, true);

rt.type(10565, "/obj/machinery/atmospherics/components/binary/dp_vent_pump/high_volume", "/obj/machinery/atmospherics/components/binary/dp_vent_pump", {
	name: "large dual-port air vent",
});

// dp_vent_pump.dm:52
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/high_volume/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	let air1: Value = rt.index(this.airs, 1);
	let air2: Value = rt.index(this.airs, 2);
	air1.volume = 1000;
	air2.volume = 1000;
	return f.dot;
}, true);

// dp_vent_pump.dm:59
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	this.cut_overlays();
	if (this.showpipe) {
		this.add_overlay(this.getpipeimage(rt.rsc("icons/obj/atmospherics/components/unary_devices.dmi"), "dpvent_cap"));
	}
	if (!this.on || rt.bitAnd(this.stat, 3)) {
		this.icon_state = "vent_off";
		return f.dot;
	}
	if (this.pump_direction) {
		this.icon_state = "vent_out";
	} else {
		this.icon_state = "vent_in";
	}
	return f.dot;
});

// dp_vent_pump.dm:73
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/process_atmos", function* process_atmos(f: Frame) {
	let pressure_delta: Value = null, transfer_moles: Value = null, removed: Value = null, parent1: Value = null, parent2: Value = null;
	yield* parent_proc();
	if (!this.on) {
		return 0;
	}
	let air1: Value = rt.index(this.airs, EXT_BOUND);
	let air2: Value = rt.index(this.airs, 2);
	let environment: Value = this.loc.return_air();
	let environment_pressure: Value = environment.return_pressure();
	if (this.pump_direction) {
		pressure_delta = 10000;
		if (rt.bitAnd(this.pressure_checks, EXT_BOUND)) {
			pressure_delta = min(pressure_delta, this.external_pressure_bound - environment_pressure);
		}
		if (rt.bitAnd(this.pressure_checks, 2)) {
			pressure_delta = min(pressure_delta, air1.return_pressure() - this.input_pressure_min);
		}
		if (pressure_delta > 0) {
			if (air1.temperature > 0) {
				transfer_moles = pressure_delta * environment.volume / (air1.temperature * R_IDEAL_GAS_EQUATION);
				if (!(removed = (yield* air1.remove(transfer_moles)))) {
					return 0;
				}
				yield* this.loc.assume_air(removed);
				this.air_update_turf();
				(parent1 = rt.index(this.parents, 1)).update = 1;
			}
		}
	} else {
		pressure_delta = 10000;
		if (rt.bitAnd(this.pressure_checks, EXT_BOUND)) {
			pressure_delta = min(pressure_delta, environment_pressure - this.external_pressure_bound);
		}
		if (rt.bitAnd(this.pressure_checks, 2)) {
			pressure_delta = min(pressure_delta, this.output_pressure_max - air2.return_pressure());
		}
		if (pressure_delta > 0) {
			if (environment.temperature > 0) {
				transfer_moles = pressure_delta * air2.volume / (environment.temperature * R_IDEAL_GAS_EQUATION);
				if (!(removed = (yield* this.loc.remove_air(transfer_moles)))) {
					return 0;
				}
				yield* air2.merge(removed);
				this.air_update_turf();
				(parent2 = rt.index(this.parents, 2)).update = 1;
			}
		}
	}
	return 1;
}, true);

// dp_vent_pump.dm:134
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	if (!this.frequency) return f.dot;
	this.radio_connection = (yield* GLOB.SSradio.add_object(this, this.frequency, { filter: GLOB.RADIO_ATMOSIA }));
	return f.dot;
}, true);

// dp_vent_pump.dm:140
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/broadcast_status", function* broadcast_status(f: Frame) {
	let signal: Value = null;
	let $8: any;
	if (!this.radio_connection) {
		return 0;
	}
	(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
	signal.source = this;
	let $0: any = signal;
	let $1: any = "tag";
	let $2: any = this.id;
	let $3: any = "device";
	let $4: any = "ADVP";
	let $5: any = "power";
	let $6: any = this.on;
	let $7: any = "direction";
	if (this.pump_direction) {
		$8 = "release";
	} else {
		$8 = "siphon";
	}
	$0.data = rt.alist(f, [$1, $2, $3, $4, $5, $6, $7, $8, "checks", this.pressure_checks, "input", this.input_pressure_min, "output", this.output_pressure_max, "external", this.external_pressure_bound, "sigtype", "status"]);
	yield* this.radio_connection.post_signal(this, signal, { filter: GLOB.RADIO_ATMOSIA });
	return 1;
}, true);

// dp_vent_pump.dm:163
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/atmosinit", function* atmosinit(f: Frame) {
	yield* parent_proc();
	if (this.frequency) {
		yield* this.set_frequency(this.frequency);
	}
	yield* this.broadcast_status();
	return f.dot;
}, true);

// dp_vent_pump.dm:170
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	if (!rt.index(signal.data, "tag") || rt.index(signal.data, "tag") != this.id || rt.index(signal.data, "sigtype") != "command") {
		return 0;
	}
	if (rt.isIn(f, "power", signal.data)) {
		this.on = text2num(rt.index(signal.data, "power"));
	}
	if (rt.isIn(f, "power_toggle", signal.data)) {
		this.on = (!this.on ? 1 : 0);
	}
	if (rt.isIn(f, "set_direction", signal.data)) {
		this.pump_direction = text2num(rt.index(signal.data, "set_direction"));
	}
	if (rt.isIn(f, "checks", signal.data)) {
		this.pressure_checks = text2num(rt.index(signal.data, "checks"));
	}
	if (rt.isIn(f, "purge", signal.data)) {
		(rt.modSrcVar(f, "pressure_checks", 16777214, rt.bitAnd));
		this.pump_direction = 0;
	}
	if (rt.isIn(f, "stabalize", signal.data)) {
		(rt.modSrcVar(f, "pressure_checks", 1, rt.bitOr));
		this.pump_direction = 1;
	}
	if (rt.isIn(f, "set_input_pressure", signal.data)) {
		this.input_pressure_min = max(0, min(text2num(rt.index(signal.data, "set_input_pressure")), 5066.25));
	}
	if (rt.isIn(f, "set_output_pressure", signal.data)) {
		this.output_pressure_max = max(0, min(text2num(rt.index(signal.data, "set_output_pressure")), 5066.25));
	}
	if (rt.isIn(f, "set_external_pressure", signal.data)) {
		this.external_pressure_bound = max(0, min(text2num(rt.index(signal.data, "set_external_pressure")), 5066.25));
	}
	if (rt.isIn(f, "status", signal.data)) {
		rt.spawnTail(f, 2, "/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal: spawn at modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:202", signal);
		return f.dot;
	}
	rt.spawnTail(f, 2, "/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal: spawn at modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:206", signal);
	this.update_icon();
	return f.dot;
});

// a spawn(2) body of /obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal: spawn at modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:206", function* (f: Frame, signal: Value) {
	yield* this.broadcast_status();
	return null;
});

// a spawn(2) body of /obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal: spawn at modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:202", function* (f: Frame, signal: Value) {
	yield* this.broadcast_status();
	return null;
});
