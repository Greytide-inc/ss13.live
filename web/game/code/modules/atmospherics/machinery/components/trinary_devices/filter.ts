// Based on /tg/station's code/modules/atmospherics/machinery/components/trinary_devices/filter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10576, "/obj/machinery/atmospherics/components/trinary/filter", "/obj/machinery/atmospherics/components/trinary", {
	on: 0,
	target_pressure: 101.325,
	filter_type: "",
	frequency: 0,
	radio_connection: null,
	can_unwrench: 1,
	name: "gas filter",
	icon_state: "filter_off",
	density: 0,
});

// filter.dm:25
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	if (!this.frequency) return f.dot;
	this.radio_connection = GLOB.SSradio.add_object(this, this.frequency, GLOB.RADIO_ATMOSIA);
	return f.dot;
}, true);

// filter.dm:32
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	return (yield* parent_proc());
}, true);

// filter.dm:36
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/update_icon", function update_icon(f: Frame) {
	let direction: Value = null, node: Value = null;
	this.cut_overlays();
	for (direction of each(GLOB.cardinal)) {
		if (rt.bitAnd(direction, this.initialize_directions)) {
			if (node = this.findConnecting(direction)) {
				this.add_overlay(this.getpipeimage(rt.rsc("icons/obj/atmospherics/components/trinary_devices.dmi"), "cap", direction, node.pipe_color));
				continue;
			}
			this.add_overlay(this.getpipeimage(rt.rsc("icons/obj/atmospherics/components/trinary_devices.dmi"), "cap", direction));
		}
	}
	parent_proc();
	return f.dot;
});

// filter.dm:48
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	if (!rt.bitAnd(this.stat, 2) && this.on && rt.index(this.nodes, 1) && rt.index(this.nodes, 2) && rt.index(this.nodes, 3)) {
		this.icon_state = `filter_on${this.flipped ? "_f" : ""}`;
		return f.dot;
	}
	this.icon_state = `filter_off${this.flipped ? "_f" : ""}`;
	return f.dot;
});

// filter.dm:55
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/power_change", function power_change(f: Frame) {
	let old_stat: Value = this.stat;
	parent_proc();
	if (rt.bitAnd(this.stat, 2)) {
		this.on = 0;
	}
	if (old_stat == this.stat) return f.dot;
	this.update_icon();
	return f.dot;
});

// filter.dm:63
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/process_atmos", function* process_atmos(f: Frame) {
	let output_starting_pressure: Value = null, transfer_moles: Value = null, removed: Value = null, filtering: Value = null, filtered_out: Value = null;
	yield* parent_proc();
	if (!this.on) {
		return 0;
	}
	if (!(rt.index(this.nodes, 1) && rt.index(this.nodes, 2) && rt.index(this.nodes, 3))) {
		return 0;
	}
	let air1: Value = rt.index(this.airs, 1);
	let air2: Value = rt.index(this.airs, 2);
	let air3: Value = rt.index(this.airs, 3);
	if ((output_starting_pressure = air3.return_pressure()) >= this.target_pressure) {
		return 1;
	}
	let pressure_delta: Value = this.target_pressure - output_starting_pressure;
	if (air1.temperature > 0) {
		transfer_moles = pressure_delta * air3.volume / (air1.temperature * R_IDEAL_GAS_EQUATION);
	}
	if (transfer_moles > 0) {
		if (!(removed = (yield* air1.remove(transfer_moles)))) {
			return f.dot;
		}
		if ((filtering = this.filter_type ? 1 : 0) && !istext(this.filter_type)) {
			warning(`${`Wrong gas ID in ${this}'s filter_type var. filter_type == ${this.filter_type}`} in ${"code/modules/atmospherics/machinery/components/trinary_devices/filter.dm"} at line ${98} src: ${this} usr: ${f.usr}.`);
			filtering = 0;
		}
		if (filtering && rt.index(removed.gases, this.filter_type)) {
			(filtered_out = (yield* new_(T("/datum/gas_mixture")))).temperature = removed.temperature;
			filtered_out.assert_gas(this.filter_type);
			rt.setAt(rt.index(filtered_out.gases, this.filter_type), 1, rt.index(rt.index(removed.gases, this.filter_type), 1));
			rt.setAt(rt.index(removed.gases, this.filter_type), 1, 0);
			removed.garbage_collect();
			yield* air2.merge(filtered_out);
		}
		yield* air3.merge(removed);
	}
	this.update_parents();
	return 1;
}, true);

// filter.dm:120
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/atmosinit", function* atmosinit(f: Frame) {
	yield* this.set_frequency(this.frequency);
	return (yield* parent_proc());
}, true);

// filter.dm:125
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "atmos_filter", this.name, 475, 155, master_ui, state))).open();
	return f.dot;
}, true);

// filter.dm:131
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	rt.setAt((data = list()), "on", this.on);
	rt.setAt(data, "pressure", round(this.target_pressure));
	rt.setAt(data, "max_pressure", round(MAX_OUTPUT_PRESSURE));
	rt.setAt(data, "filter_type", this.filter_type);
	return data;
});

// filter.dm:139
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let pressure: Value = null, filter_name: Value = null, gas: Value = null;
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
	} else if ($0 === "filter") {
		this.filter_type = "";
		filter_name = "nothing";
		if (rt.isIn(f, (gas = rt.at(params, "mode")), GLOB.meta_gas_info)) {
			this.filter_type = gas;
			filter_name = rt.index(rt.index(GLOB.meta_gas_info, gas), 2);
		}
		this.investigate_log(`was set to filter ${filter_name} by ${key_name(f.usr)}`, "atmos");
		f.dot = 1;
	}
	yield* this.update_icon();
	return f.dot;
}, true);
