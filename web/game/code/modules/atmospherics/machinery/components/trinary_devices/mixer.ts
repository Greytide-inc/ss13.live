// Based on /tg/station's code/modules/atmospherics/machinery/components/trinary_devices/mixer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10580, "/obj/machinery/atmospherics/components/trinary/mixer", "/obj/machinery/atmospherics/components/trinary", {
	on: 0,
	target_pressure: 101.325,
	node1_concentration: 0.5,
	node2_concentration: 0.5,
	can_unwrench: 1,
	icon_state: "mixer_off",
	density: 0,
	name: "gas mixer",
});

// mixer.dm:21
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/update_icon", function update_icon(f: Frame) {
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
	return parent_proc();
});

// mixer.dm:32
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	if (!rt.bitAnd(this.stat, 2) && this.on && rt.index(this.nodes, 1) && rt.index(this.nodes, 2) && rt.index(this.nodes, 3)) {
		this.icon_state = `mixer_on${this.flipped ? "_f" : ""}`;
		return f.dot;
	}
	this.icon_state = `mixer_off${this.flipped ? "_f" : ""}`;
	return f.dot;
});

// mixer.dm:39
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/power_change", function power_change(f: Frame) {
	let old_stat: Value = this.stat;
	parent_proc();
	if (rt.bitAnd(this.stat, 2)) {
		this.on = 0;
	}
	if (old_stat == this.stat) return f.dot;
	this.update_icon();
	return f.dot;
});

// mixer.dm:47
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/New", function* New(f: Frame) {
	let air3: Value = null;
	yield* parent_proc();
	(air3 = rt.index(this.airs, 3)).volume = 300;
	rt.setAt(this.airs, 3, air3);
	return f.dot;
}, true);

// mixer.dm:53
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/process_atmos", function* process_atmos(f: Frame) {
	let output_starting_pressure: Value = null, ratio: Value = null, removed1: Value = null, removed2: Value = null, parent1: Value = null, parent2: Value = null, parent3: Value = null;
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
	let transfer_moles1: Value = 0;
	let transfer_moles2: Value = 0;
	if (air1.temperature > 0) {
		transfer_moles1 = this.node1_concentration * pressure_delta * air3.volume / (air1.temperature * R_IDEAL_GAS_EQUATION);
	}
	if (air2.temperature > 0) {
		transfer_moles2 = this.node2_concentration * pressure_delta * air3.volume / (air2.temperature * R_IDEAL_GAS_EQUATION);
	}
	let air1_moles: Value = air1.total_moles();
	let air2_moles: Value = air2.total_moles();
	if (air1_moles < transfer_moles1 || air2_moles < transfer_moles2) {
		ratio = 0;
		if (transfer_moles1 > 0 && transfer_moles2 > 0) {
			ratio = min(air1_moles / transfer_moles1, air2_moles / transfer_moles2);
		}
		if (transfer_moles2 == 0 && transfer_moles1 > 0) {
			ratio = air1_moles / transfer_moles1;
		}
		if (transfer_moles1 == 0 && transfer_moles2 > 0) {
			ratio = air2_moles / transfer_moles2;
		}
		transfer_moles1 *= ratio;
		transfer_moles2 *= ratio;
	}
	if (transfer_moles1 > 0) {
		removed1 = (yield* air1.remove(transfer_moles1));
		yield* air3.merge(removed1);
	}
	if (transfer_moles2 > 0) {
		removed2 = (yield* air2.remove(transfer_moles2));
		yield* air3.merge(removed2);
	}
	if (transfer_moles1) {
		(parent1 = rt.index(this.parents, 1)).update = 1;
	}
	if (transfer_moles2) {
		(parent2 = rt.index(this.parents, 2)).update = 1;
	}
	(parent3 = rt.index(this.parents, 3)).update = 1;
	return 1;
}, true);

// mixer.dm:121
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "atmos_mixer", this.name, 370, 165, master_ui, state))).open();
	return f.dot;
}, true);

// mixer.dm:127
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	rt.setAt((data = list()), "on", this.on);
	rt.setAt(data, "set_pressure", round(this.target_pressure));
	rt.setAt(data, "max_pressure", round(MAX_OUTPUT_PRESSURE));
	rt.setAt(data, "node1_concentration", round(this.node1_concentration * 100));
	rt.setAt(data, "node2_concentration", round(this.node2_concentration * 100));
	return data;
});

// mixer.dm:136
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let pressure: Value = null, value: Value = null;
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
	} else if ($0 === "node1") {
		value = text2num(rt.at(params, "concentration"));
		this.node1_concentration = max(0, min(1, this.node1_concentration + value));
		this.node2_concentration = max(0, min(1, this.node2_concentration - value));
		this.investigate_log(`was set to ${this.node1_concentration} % on node 1 by ${key_name(f.usr)}`, "atmos");
		f.dot = 1;
	} else if ($0 === "node2") {
		value = text2num(rt.at(params, "concentration"));
		this.node2_concentration = max(0, min(1, this.node2_concentration + value));
		this.node1_concentration = max(0, min(1, this.node1_concentration - value));
		this.investigate_log(`was set to ${this.node2_concentration} % on node 2 by ${key_name(f.usr)}`, "atmos");
		f.dot = 1;
	}
	yield* this.update_icon();
	return f.dot;
}, true);
