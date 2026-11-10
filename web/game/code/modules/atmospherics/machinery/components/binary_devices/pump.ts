// Based on /tg/station's code/modules/atmospherics/machinery/components/binary_devices/pump.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10568, "/obj/machinery/atmospherics/components/binary/pump", "/obj/machinery/atmospherics/components/binary", {
	on: 0,
	target_pressure: 101.325,
	frequency: 0,
	id: null,
	radio_connection: null,
	can_unwrench: 1,
	icon_state: "pump_map",
	name: "gas pump",
	desc: "A pump that moves gas by pressure.",
});

// pump.dm:34
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	if (this.radio_connection) {
		this.radio_connection = null;
	}
	return (yield* parent_proc());
}, true);

// pump.dm:40
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	if (rt.bitAnd(this.stat, 2)) {
		this.icon_state = "pump_off";
		return f.dot;
	}
	this.icon_state = `pump_${this.on ? "on" : "off"}`;
	return f.dot;
});

// pump.dm:48
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/process_atmos", function* process_atmos(f: Frame) {
	let pressure_delta: Value = null, transfer_moles: Value = null, removed: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		return 0;
	}
	if (!this.on) {
		return 0;
	}
	let air1: Value = rt.index(this.airs, 1);
	let air2: Value = rt.index(this.airs, 2);
	let output_starting_pressure: Value = air2.return_pressure();
	if (this.target_pressure - output_starting_pressure < 0.01) {
		return 1;
	}
	if (air1.total_moles() > 0 && air1.temperature > 0) {
		pressure_delta = this.target_pressure - output_starting_pressure;
		transfer_moles = pressure_delta * air2.volume / (air1.temperature * R_IDEAL_GAS_EQUATION);
		removed = (yield* air1.remove(transfer_moles));
		yield* air2.merge(removed);
		this.update_parents();
	}
	return 1;
}, true);

// pump.dm:77
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	if (!this.frequency) return f.dot;
	this.radio_connection = (yield* GLOB.SSradio.add_object(this, this.frequency, { filter: GLOB.RADIO_ATMOSIA }));
	return f.dot;
}, true);

// pump.dm:83
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/broadcast_status", function* broadcast_status(f: Frame) {
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

// pump.dm:104
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "atmos_pump", this.name, 335, 115, master_ui, state))).open();
	return f.dot;
}, true);

// pump.dm:110
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	rt.setAt((data = list()), "on", this.on);
	rt.setAt(data, "pressure", round(this.target_pressure));
	rt.setAt(data, "max_pressure", round(MAX_OUTPUT_PRESSURE));
	return data;
});

// pump.dm:117
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
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
			if ((pressure = (yield* g.op(f, "Prompt", [33], [null, this.target_pressure, this.name, `New output pressure (0-${MAX_OUTPUT_PRESSURE} kPa):`, null]))) !== null && !(yield* parent_proc())) {
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

// pump.dm:142
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/atmosinit", function* atmosinit(f: Frame) {
	yield* parent_proc();
	if (!this.frequency) return f.dot;
	yield* this.set_frequency(this.frequency);
	return f.dot;
}, true);

// pump.dm:147
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
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

// pump.dm:173
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// pump.dm:177
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/can_unwrench", function can_unwrench(f: Frame, user: Value) {
	if (!parent_proc()) return f.dot;
	if (!rt.bitAnd(this.stat, 2) && this.on) {
		to_chat(user, `<span class='warning'>You cannot unwrench ${this}, turn it off first!</span>`);
	} else {
		return 1;
	}
	return f.dot;
}, false);
