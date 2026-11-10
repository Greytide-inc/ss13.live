// Based on /tg/station's code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10586, "/obj/machinery/atmospherics/components/unary/outlet_injector", "/obj/machinery/atmospherics/components/unary", {
	on: 0,
	injecting: 0,
	volume_rate: 50,
	frequency: 0,
	id: null,
	radio_connection: null,
	can_unwrench: 1,
	level: 1,
	name: "air injector",
	desc: "Has a valve and pump attached to it",
	icon_state: "inje_map",
	use_power: 1,
	resistance_flags: 50,
	layer: 2.46,
});

// outlet_injector.dm:23
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	return (yield* parent_proc());
}, true);

// outlet_injector.dm:30
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	this.cut_overlays();
	if (this.showpipe) {
		this.add_overlay(this.getpipeimage(this.icon, "inje_cap", this.initialize_directions));
	}
	if (!rt.index(this.nodes, 1) || !this.on || rt.bitAnd(this.stat, 3)) {
		this.icon_state = "inje_off";
		return f.dot;
	}
	this.icon_state = "inje_on";
	return f.dot;
});

// outlet_injector.dm:41
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/power_change", function power_change(f: Frame) {
	let old_stat: Value = this.stat;
	parent_proc();
	if (old_stat == this.stat) return f.dot;
	this.update_icon();
	return f.dot;
});

// outlet_injector.dm:48
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/process_atmos", function* process_atmos(f: Frame) {
	let air_contents: Value = null, transfer_moles: Value = null, removed: Value = null;
	yield* parent_proc();
	this.injecting = 0;
	if (!this.on || rt.bitAnd(this.stat, 3)) {
		return 0;
	}
	if ((air_contents = rt.index(this.airs, 1)).temperature > 0) {
		transfer_moles = air_contents.return_pressure() * this.volume_rate / (air_contents.temperature * R_IDEAL_GAS_EQUATION);
		removed = (yield* air_contents.remove(transfer_moles));
		yield* this.loc.assume_air(removed);
		this.air_update_turf();
		this.update_parents();
	}
	return 1;
}, true);

// outlet_injector.dm:69
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/inject", function* inject(f: Frame) {
	let transfer_moles: Value = null, removed: Value = null;
	if (this.on || this.injecting || rt.bitAnd(this.stat, 3)) {
		return 0;
	}
	let air_contents: Value = rt.index(this.airs, 1);
	this.injecting = 1;
	if (air_contents.temperature > 0) {
		transfer_moles = air_contents.return_pressure() * this.volume_rate / (air_contents.temperature * R_IDEAL_GAS_EQUATION);
		removed = (yield* air_contents.remove(transfer_moles));
		yield* this.loc.assume_air(removed);
		this.update_parents();
	}
	flick("inje_inject", this);
	return f.dot;
}, true);

// outlet_injector.dm:88
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	if (!this.frequency) return f.dot;
	this.radio_connection = GLOB.SSradio.add_object(this, this.frequency);
	return f.dot;
}, true);

// outlet_injector.dm:94
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/broadcast_status", function* broadcast_status(f: Frame) {
	let signal: Value = null;
	if (!this.radio_connection) {
		return 0;
	}
	(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
	signal.source = this;
	signal.data = rt.alist(f, ["tag", this.id, "device", "AO", "power", this.on, "volume_rate", this.volume_rate, "sigtype", "status"]);
	yield* this.radio_connection.post_signal(this, signal);
	return 1;
}, true);

// outlet_injector.dm:115
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/atmosinit", function* atmosinit(f: Frame) {
	yield* this.set_frequency(this.frequency);
	yield* this.broadcast_status();
	yield* parent_proc();
	return f.dot;
}, true);

// outlet_injector.dm:120
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	let number: Value = null, air_contents: Value = null;
	if (!rt.index(signal.data, "tag") || rt.index(signal.data, "tag") != this.id || rt.index(signal.data, "sigtype") != "command") {
		return 0;
	}
	if (rt.isIn(f, "power", signal.data)) {
		this.on = text2num(rt.index(signal.data, "power"));
	}
	if (rt.isIn(f, "power_toggle", signal.data)) {
		this.on = (!this.on ? 1 : 0);
	}
	if (rt.isIn(f, "inject", signal.data)) {
		rt.spawnTail(f, 0, "/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal: spawn at modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:130", signal, number, air_contents);
		return f.dot;
	}
	if (rt.isIn(f, "set_volume_rate", signal.data)) {
		number = text2num(rt.index(signal.data, "set_volume_rate"));
		air_contents = rt.index(this.airs, 1);
		this.volume_rate = max(0, min(number, air_contents.volume));
	}
	if (rt.isIn(f, "status", signal.data)) {
		rt.spawnTail(f, 2, "/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal: spawn at modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:139", signal, number, air_contents);
		return f.dot;
	}
	rt.spawnTail(f, 2, "/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal: spawn at modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:145", signal, number, air_contents);
	this.update_icon();
	return f.dot;
});

// a spawn(2) body of /obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal: spawn at modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:145", function* (f: Frame, signal: Value, number: Value, air_contents: Value) {
	yield* this.broadcast_status();
	return null;
});

// a spawn(2) body of /obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal: spawn at modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:139", function* (f: Frame, signal: Value, number: Value, air_contents: Value) {
	yield* this.broadcast_status();
	return null;
});

// a spawn(0) body of /obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal: spawn at modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:130", function* (f: Frame, signal: Value, number: Value, air_contents: Value) {
	yield* this.inject();
	return null;
});

// outlet_injector.dm:152
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "atmos_pump", this.name, 310, 115, master_ui, state))).open();
	return f.dot;
}, true);

// outlet_injector.dm:158
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	rt.setAt((data = list()), "on", this.on);
	rt.setAt(data, "rate", round(this.volume_rate));
	rt.setAt(data, "max_rate", round(MAX_TRANSFER_RATE));
	return data;
});

// outlet_injector.dm:165
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
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
			if ((rate = (yield* g.op(f, "Prompt", [33], [null, this.volume_rate, this.name, `New transfer rate (0-${MAX_TRANSFER_RATE} L/s):`, null]))) !== null && !(yield* parent_proc())) {
				f.dot = 1;
			}
		} else if (text2num(rate) !== null) {
			rate = text2num(rate);
			f.dot = 1;
		}
		if (f.dot) {
			this.volume_rate = max(0, min(rate, MAX_TRANSFER_RATE));
			this.investigate_log(`was set to ${this.volume_rate} L/s by ${key_name(f.usr)}`, "atmos");
		}
	}
	yield* this.update_icon();
	yield* this.broadcast_status();
	return f.dot;
}, true);

// outlet_injector.dm:192
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/can_unwrench", function can_unwrench(f: Frame, user: Value) {
	if (!parent_proc()) return f.dot;
	if (!rt.bitOr(rt.bitAnd(this.stat, 2), 1) && this.on) {
		to_chat(user, `<span class='warning'>You cannot unwrench ${this}, turn it off first!</span>`);
	} else {
		return 1;
	}
	return f.dot;
}, false);
