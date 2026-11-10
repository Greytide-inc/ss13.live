// Based on /tg/station's code/modules/atmospherics/machinery/components/binary_devices/passive_gate.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10567, "/obj/machinery/atmospherics/components/binary/passive_gate", "/obj/machinery/atmospherics/components/binary", {
	on: 0,
	target_pressure: 101.325,
	frequency: 0,
	id: null,
	radio_connection: null,
	can_unwrench: 1,
	icon_state: "passgate_map",
	name: "passive gate",
	desc: "A one-way air valve that does not require power.",
});

// passive_gate.dm:26
rt.def("/obj/machinery/atmospherics/components/binary/passive_gate/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	return (yield* parent_proc());
}, true);

// passive_gate.dm:30
rt.def("/obj/machinery/atmospherics/components/binary/passive_gate/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	if (!this.on) {
		this.icon_state = "passgate_off";
		this.cut_overlays();
		return f.dot;
	}
	this.add_overlay(this.getpipeimage(rt.rsc("icons/obj/atmospherics/components/binary_devices.dmi"), "passgate_on"));
	return f.dot;
});

// passive_gate.dm:38
rt.def("/obj/machinery/atmospherics/components/binary/passive_gate/proc/process_atmos", function* process_atmos(f: Frame) {
	yield* parent_proc();
	if (!this.on) {
		return 0;
	}
	let air1: Value = rt.index(this.airs, 1);
	let air2: Value = rt.index(this.airs, 2);
	let output_starting_pressure: Value = air2.return_pressure();
	let input_starting_pressure: Value = air1.return_pressure();
	if (output_starting_pressure >= min(this.target_pressure, input_starting_pressure - 10)) {
		return 1;
	}
	if (!(air1.total_moles() > 0 && air1.temperature > 0)) return f.dot;
	let pressure_delta: Value = min(this.target_pressure - output_starting_pressure, (input_starting_pressure - output_starting_pressure) / 2);
	let transfer_moles: Value = pressure_delta * air2.volume / (air1.temperature * R_IDEAL_GAS_EQUATION);
	let removed: Value = (yield* air1.remove(transfer_moles));
	yield* air2.merge(removed);
	this.update_parents();
	return f.dot;
}, true);

// passive_gate.dm:70
rt.def("/obj/machinery/atmospherics/components/binary/passive_gate/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	if (!this.frequency) return f.dot;
	this.radio_connection = (yield* GLOB.SSradio.add_object(this, this.frequency, { filter: GLOB.RADIO_ATMOSIA }));
	return f.dot;
}, true);

// passive_gate.dm:76
rt.def("/obj/machinery/atmospherics/components/binary/passive_gate/proc/broadcast_status", function* broadcast_status(f: Frame) {
	let signal: Value = null;
	if (!this.radio_connection) {
		return 0;
	}
	(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
	signal.source = this;
	signal.data = rt.alist(f, ["tag", this.id, "device", "AGP", "power", this.on, "target_output", this.target_pressure, "sigtype", "status"]);
	yield* this.radio_connection.post_signal(this, signal, { filter: GLOB.RADIO_ATMOSIA });
	return 1;
}, true);

// passive_gate.dm:97
rt.def("/obj/machinery/atmospherics/components/binary/passive_gate/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "atmos_pump", this.name, 335, 115, master_ui, state))).open();
	return f.dot;
}, true);

// passive_gate.dm:103
rt.def("/obj/machinery/atmospherics/components/binary/passive_gate/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	rt.setAt((data = list()), "on", this.on);
	rt.setAt(data, "pressure", round(this.target_pressure));
	rt.setAt(data, "max_pressure", round(MAX_OUTPUT_PRESSURE));
	return data;
});

// passive_gate.dm:110
rt.def("/obj/machinery/atmospherics/components/binary/passive_gate/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let pressure: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let $0: any = action;
	if ($0 === "power") {
		this.on = (!this.on ? 1 : 0);
		if (this.on) {
			$0 = "on";
		} else {
			$0 = "off";
		}
		this.investigate_log(`was turned ${$0} by ${key_name(f.usr)}`, "atmos");
		f.dot = 1;
	} else if ($0 === "pressure") {
		if ((pressure = rt.at(params, "pressure")) == "max") {
			pressure = MAX_OUTPUT_PRESSURE;
			f.dot = 1;
		} else if (pressure == "input") {
			if ((pressure = (yield* g.op(f, "Prompt", [33], [null, this.target_pressure, this.name, `New output pressure (0-${MAX_OUTPUT_PRESSURE} kPa):`, null]))) !== null || !(yield* parent_proc())) {
				f.dot = 1;
			}
		} else if (text2num(pressure) !== null) {
			pressure = text2num(pressure);
			f.dot = 1;
		}
		if (f.dot) {
			this.target_pressure = max(0, min(pressure, MAX_OUTPUT_PRESSURE));
			this.investigate_log(`was set to ${this.target_pressure} kPa by ${key_name(f.usr)}`, "atmos");
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// passive_gate.dm:135
rt.def("/obj/machinery/atmospherics/components/binary/passive_gate/proc/atmosinit", function* atmosinit(f: Frame) {
	yield* parent_proc();
	if (!this.frequency) return f.dot;
	yield* this.set_frequency(this.frequency);
	return f.dot;
}, true);

// passive_gate.dm:140
rt.def("/obj/machinery/atmospherics/components/binary/passive_gate/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	if (!rt.index(signal.data, "tag") || rt.index(signal.data, "tag") != this.id || rt.index(signal.data, "sigtype") != "command") {
		return 0;
	}
	let old_on: Value = this.on;
	if (rt.isIn(f, "power", signal.data)) {
		this.on = text2num(rt.index(signal.data, "power"));
	}
	if (rt.isIn(f, "power_toggle", signal.data)) {
		this.on = (!this.on ? 1 : 0);
	}
	if (rt.isIn(f, "set_output_pressure", signal.data)) {
		this.target_pressure = max(0, min(text2num(rt.index(signal.data, "set_output_pressure")), 5066.25));
	}
	if (this.on != old_on) {
		this.investigate_log(`was turned ${this.on ? "on" : "off"} by a remote signal`, "atmos");
	}
	if (rt.isIn(f, "status", signal.data)) {
		yield* this.broadcast_status();
		return f.dot;
	}
	yield* this.broadcast_status();
	yield* this.update_icon();
	return f.dot;
}, true);

// passive_gate.dm:166
rt.def("/obj/machinery/atmospherics/components/binary/passive_gate/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// passive_gate.dm:170
rt.def("/obj/machinery/atmospherics/components/binary/passive_gate/proc/can_unwrench", function can_unwrench(f: Frame, user: Value) {
	if (!parent_proc()) return f.dot;
	if (this.on) {
		to_chat(user, `<span class='warning'>You cannot unwrench ${this}, turn it off first!</span>`);
	} else {
		return 1;
	}
	return f.dot;
}, false);
