// Based on /tg/station's code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10573, "/obj/machinery/atmospherics/components/binary/volume_pump", "/obj/machinery/atmospherics/components/binary", {
	on: 0,
	transfer_rate: 200,
	frequency: 0,
	id: null,
	radio_connection: null,
	can_unwrench: 1,
	icon_state: "volpump_map",
	name: "volumetric gas pump",
	desc: "A pump that moves gas by volume.",
});

// volume_pump.dm:31
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	return (yield* parent_proc());
}, true);

// volume_pump.dm:38
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	if (rt.bitAnd(this.stat, 2)) {
		this.icon_state = "volpump_off";
		return f.dot;
	}
	this.icon_state = `volpump_${this.on ? "on" : "off"}`;
	return f.dot;
});

// volume_pump.dm:46
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/process_atmos", function* process_atmos(f: Frame) {
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!this.on) {
		return 0;
	}
	let air1: Value = rt.index(this.airs, 1);
	let air2: Value = rt.index(this.airs, 2);
	let input_starting_pressure: Value = air1.return_pressure();
	let output_starting_pressure: Value = air2.return_pressure();
	if (input_starting_pressure < 0.01 || output_starting_pressure > 9000) {
		return 1;
	}
	let transfer_ratio: Value = min(1, this.transfer_rate / air1.volume);
	let removed: Value = (yield* air1.remove_ratio(transfer_ratio));
	yield* air2.merge(removed);
	this.update_parents();
	return 1;
}, true);

// volume_pump.dm:73
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	if (!this.frequency) return f.dot;
	this.radio_connection = GLOB.SSradio.add_object(this, this.frequency);
	return f.dot;
}, true);

// volume_pump.dm:79
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/broadcast_status", function* broadcast_status(f: Frame) {
	let signal: Value = null;
	if (!this.radio_connection) {
		return 0;
	}
	(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
	signal.source = this;
	signal.data = rt.alist(f, ["tag", this.id, "device", "APV", "power", this.on, "transfer_rate", this.transfer_rate, "sigtype", "status"]);
	yield* this.radio_connection.post_signal(this, signal);
	return 1;
}, true);

// volume_pump.dm:99
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "atmos_pump", this.name, 310, 115, master_ui, state))).open();
	return f.dot;
}, true);

// volume_pump.dm:105
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	rt.setAt((data = list()), "on", this.on);
	rt.setAt(data, "rate", round(this.transfer_rate));
	rt.setAt(data, "max_rate", round(MAX_TRANSFER_RATE));
	return data;
});

// volume_pump.dm:112
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/atmosinit", function* atmosinit(f: Frame) {
	yield* parent_proc();
	yield* this.set_frequency(this.frequency);
	return f.dot;
}, true);

// volume_pump.dm:117
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let rate: Value = null;
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
	} else if ($0 === "rate") {
		if ((rate = rt.at(params, "rate")) == "max") {
			rate = MAX_TRANSFER_RATE;
			f.dot = 1;
		} else if (rate == "input") {
			if ((rate = (yield* g.op(f, "Prompt", [33], [null, this.transfer_rate, this.name, `New transfer rate (0-${MAX_TRANSFER_RATE} L/s):`, null]))) !== null && !(yield* parent_proc())) {
				f.dot = 1;
			}
		} else if (text2num(rate) !== null) {
			rate = text2num(rate);
			f.dot = 1;
		}
		if (f.dot) {
			this.transfer_rate = max(0, min(rate, MAX_TRANSFER_RATE));
			this.investigate_log(`was set to ${this.transfer_rate} L/s by ${key_name(f.usr)}`, "atmos");
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// volume_pump.dm:142
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	let air1: Value = null;
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
	if (rt.isIn(f, "set_transfer_rate", signal.data)) {
		air1 = rt.index(this.airs, 1);
		this.transfer_rate = max(0, min(text2num(rt.index(signal.data, "set_transfer_rate")), air1.volume));
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

// volume_pump.dm:169
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// volume_pump.dm:173
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/can_unwrench", function can_unwrench(f: Frame, user: Value) {
	if (!parent_proc()) return f.dot;
	if (!rt.bitAnd(this.stat, 2) && this.on) {
		to_chat(user, `<span class='warning'>You cannot unwrench ${this}, turn it off first!</span>`);
	} else {
		return 1;
	}
	return f.dot;
}, false);
