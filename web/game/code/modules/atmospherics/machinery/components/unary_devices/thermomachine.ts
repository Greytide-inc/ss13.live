// Based on /tg/station's code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10598, "/obj/machinery/atmospherics/components/unary/thermomachine", "/obj/machinery/atmospherics/components/unary", {
	icon_state_on: "cold_on",
	icon_state_open: "cold_off",
	on: 0,
	min_temperature: 0,
	max_temperature: 0,
	target_temperature: 293.15,
	heat_capacity: 0,
	interactive: 1,
	anchored: 1,
	name: "thermomachine",
	desc: "Heats or cools gas in connected pipes.",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "freezer",
	density: 1,
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
	layer: 3,
});

// thermomachine.dm:12
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 80, "acid", 30]);
	return f.dot;
});

// thermomachine.dm:23
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	this.initialize_directions = this.dir;
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/thermomachine"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6745, "/obj/item/weapon/circuitboard/machine/thermomachine", "/obj/item/weapon/circuitboard/machine", {
	name: "Thermomachine (Machine Board)",
	desc: "You can use a screwdriver to switch between heater and freezer.",
	origin_tech: "programming=3;plasmatech=3",
	req_components: null,
});

// thermomachine.dm:32
rt.def("/obj/item/weapon/circuitboard/machine/thermomachine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 2, T("/obj/item/weapon/stock_parts/micro_laser"), 2, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]);
	return f.dot;
});

// thermomachine.dm:39
rt.def("/obj/item/weapon/circuitboard/machine/thermomachine/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (prob(50)) {
		this.name = "Freezer (Machine Board)";
		this.build_path = T("/obj/machinery/atmospherics/components/unary/thermomachine/freezer");
	} else {
		this.name = "Heater (Machine Board)";
		this.build_path = T("/obj/machinery/atmospherics/components/unary/thermomachine/heater");
	}
	return f.dot;
}, true);

// thermomachine.dm:48
rt.def("/obj/item/weapon/circuitboard/machine/thermomachine/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let newtype: Value = null, new_setting: Value = null;
	let freezer: Value = T("/obj/item/weapon/circuitboard/machine/thermomachine/freezer");
	let heater: Value = T("/obj/item/weapon/circuitboard/machine/thermomachine/heater");
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		new_setting = "Heater";
		playsound(this.loc, I.usesound, 50, 1);
		if (this.build_path == rt.initial(f, heater, "build_path")) {
			newtype = freezer;
			new_setting = "Freezer";
		} else {
			newtype = heater;
		}
		this.name = rt.initial(f, newtype, "name");
		this.build_path = rt.initial(f, newtype, "build_path");
		to_chat(user, `<span class='notice'>You change the circuitboard setting to "${new_setting}".</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// thermomachine.dm:67
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/on_construction", function* on_construction(f: Frame) {
	yield* parent_proc(this.dir, this.dir);
	return f.dot;
}, true);

// thermomachine.dm:71
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null, M: Value = null;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		B += M.rating;
	}
	this.heat_capacity = 5000 * (B - 1) ** 2;
	return f.dot;
});

// thermomachine.dm:77
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/update_icon", function update_icon(f: Frame) {
	if (this.panel_open) {
		this.icon_state = this.icon_state_open;
	} else if (this.on && this.is_operational()) {
		this.icon_state = this.icon_state_on;
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
	}
	return f.dot;
});

// thermomachine.dm:85
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	this.cut_overlays();
	if (!this.showpipe) return f.dot;
	this.add_overlay(this.getpipeimage(this.icon, "scrub_cap", this.initialize_directions));
	return f.dot;
});

// thermomachine.dm:90
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/process_atmos", function process_atmos(f: Frame) {
	let combined_energy: Value = null, temperature_delta: Value = null;
	parent_proc();
	if (!this.on || !rt.index(this.nodes, 1)) {
		return f.dot;
	}
	let air_contents: Value = rt.index(this.airs, 1);
	let air_heat_capacity: Value = air_contents.heat_capacity();
	let combined_heat_capacity: Value = this.heat_capacity + air_heat_capacity;
	let old_temperature: Value = air_contents.temperature;
	if (combined_heat_capacity > 0) {
		combined_energy = this.heat_capacity * this.target_temperature + air_heat_capacity * air_contents.temperature;
		air_contents.temperature = combined_energy / combined_heat_capacity;
	}
	if ((temperature_delta = rt.op(f, "Abs", [], [old_temperature - air_contents.temperature])) > 1) {
		this.active_power_usage = this.heat_capacity * temperature_delta / 10 + this.idle_power_usage;
		this.update_parents();
	} else {
		this.active_power_usage = this.idle_power_usage;
	}
	return 1;
});

// thermomachine.dm:112
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// thermomachine.dm:116
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (!(this.on || this.state_open)) {
		if (this.default_deconstruction_screwdriver(user, this.icon_state_open, rt.initial(f, this, "icon_state"), I)) {
			return f.dot;
		}
		if (yield* this.exchange_parts(user, I)) {
			return f.dot;
		}
	}
	if (yield* this.default_change_direction_wrench(user, I)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// thermomachine.dm:128
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/default_change_direction_wrench", function* default_change_direction_wrench(f: Frame, user: Value, W: Value) {
	let node: Value = null;
	if (!(yield* parent_proc())) {
		return 0;
	}
	this.SetInitDirections();
	if (node = rt.index(this.nodes, 1)) {
		yield* node.disconnect(this);
		rt.setAt(this.nodes, 1, null);
	}
	this.nullifyPipenet(rt.index(this.parents, 1));
	yield* this.atmosinit();
	if (node = rt.index(this.nodes, 1)) {
		yield* node.atmosinit();
		yield* node.addMember(this);
	}
	this.build_network();
	return 1;
}, true);

// thermomachine.dm:147
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/ui_status", function ui_status(f: Frame, user: Value) {
	if (this.interactive) {
		return parent_proc();
	}
	return -1;
}, false);

// thermomachine.dm:152
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "thermomachine", this.name, 400, 240, master_ui, state))).open();
	return f.dot;
}, true);

// thermomachine.dm:158
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	rt.setAt((data = list()), "on", this.on);
	rt.setAt(data, "min", this.min_temperature);
	rt.setAt(data, "max", this.max_temperature);
	rt.setAt(data, "target", this.target_temperature);
	rt.setAt(data, "initial", rt.initial(f, this, "target_temperature"));
	let air1: Value = rt.index(this.airs, 1);
	rt.setAt(data, "temperature", air1.temperature);
	rt.setAt(data, "pressure", air1.return_pressure());
	return data;
});

// thermomachine.dm:172
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let target: Value = null, adjust: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let $0: any = action;
	if ($0 === "power") {
		this.on = (!this.on ? 1 : 0);
		if (this.on) {
			$0 = 2;
		} else {
			$0 = 1;
		}
		this.use_power = $0;
		if (this.on) {
			$0 = "on";
		} else {
			$0 = "off";
		}
		this.investigate_log(`was turned ${$0} by ${key_name(f.usr)}`, "atmos");
		f.dot = 1;
	} else if ($0 === "target") {
		target = rt.at(params, "target");
		adjust = text2num(rt.at(params, "adjust"));
		if (target == "input") {
			if ((target = (yield* g.op(f, "Prompt", [33], [null, this.target_temperature, this.name, `Set new target (${this.min_temperature}-${this.max_temperature} K):`, null]))) !== null && !(yield* parent_proc())) {
				f.dot = 1;
			}
		} else if (adjust) {
			target = this.target_temperature + adjust;
			f.dot = 1;
		} else if (text2num(target) !== null) {
			target = text2num(target);
			f.dot = 1;
		}
		if (f.dot) {
			this.target_temperature = max(this.min_temperature, min(target, this.max_temperature));
			this.investigate_log(`was set to ${this.target_temperature} K by ${key_name(f.usr)}`, "atmos");
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(10599, "/obj/machinery/atmospherics/components/unary/thermomachine/freezer", "/obj/machinery/atmospherics/components/unary/thermomachine", {
	icon_state_on: "freezer_1",
	icon_state_open: "freezer-o",
	max_temperature: 293.15,
	min_temperature: 170,
	name: "freezer",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "freezer",
});

// thermomachine.dm:208
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/freezer/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/thermomachine/freezer"), null))).apply_default_parts(this);
	return f.dot;
}, true);

// thermomachine.dm:217
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/freezer/proc/RefreshParts", function RefreshParts(f: Frame) {
	let L: Value = null, M: Value = null;
	parent_proc();
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/micro_laser"))) {
		L += M.rating;
	}
	this.min_temperature = max(T0C - (rt.initial(f, this, "min_temperature") + L * 15), TCMB);
	return f.dot;
});

rt.type(10600, "/obj/machinery/atmospherics/components/unary/thermomachine/heater", "/obj/machinery/atmospherics/components/unary/thermomachine", {
	icon_state_on: "heater_1",
	icon_state_open: "heater-o",
	max_temperature: 140,
	min_temperature: 293.15,
	name: "heater",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "heater",
});

// thermomachine.dm:233
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/heater/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/thermomachine/heater"), null))).apply_default_parts(this);
	return f.dot;
}, true);

// thermomachine.dm:242
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/heater/proc/RefreshParts", function RefreshParts(f: Frame) {
	let L: Value = null, M: Value = null;
	parent_proc();
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/micro_laser"))) {
		L += M.rating;
	}
	this.max_temperature = T20C + rt.initial(f, this, "max_temperature") * L;
	return f.dot;
});
