// Based on /tg/station's code/game/machinery/spaceheater.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10828, "/obj/machinery/space_heater", "/obj/machinery", {
	cell: null,
	on: 0,
	mode: "standby",
	setMode: "auto",
	targetTemperature: 293.15,
	heatingPower: 40000,
	efficiency: 20000,
	temperatureTolerance: 1,
	settableTemperatureMedian: 303.15,
	settableTemperatureRange: 30,
	anchored: 0,
	interact_open: 1,
	density: 1,
	icon: rt.rsc("icons/obj/atmos.dmi"),
	icon_state: "sheater-off",
	name: "space heater",
	desc: "Made by Space Amish using traditional space techniques, this heater/cooler is guaranteed not to set the station on fire.",
	obj_integrity: 250,
	max_integrity: 250,
	armor: null,
});

// spaceheater.dm:15
rt.def("/obj/machinery/space_heater/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 100, "fire", 80, "acid", 10]);
	return f.dot;
});

// spaceheater.dm:31
rt.def("/obj/machinery/space_heater/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	this.cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell"), this));
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/space_heater"), null))).apply_default_parts(this);
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(6730, "/obj/item/weapon/circuitboard/machine/space_heater", "/obj/item/weapon/circuitboard/machine", {
	name: "Space Heater (Machine Board)",
	build_path: rt.typePath("/obj/machinery/space_heater"),
	origin_tech: "programming=2;engineering=2;plasmatech=2",
	req_components: null,
});

// spaceheater.dm:41
rt.def("/obj/item/weapon/circuitboard/machine/space_heater/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/capacitor"), 1, T("/obj/item/stack/cable_coil"), 3]);
	return f.dot;
});

// spaceheater.dm:47
rt.def("/obj/machinery/space_heater/proc/on_construction", function* on_construction(f: Frame) {
	yield* qdel(this.cell);
	this.cell = null;
	this.panel_open = 1;
	yield* this.update_icon();
	return (yield* parent_proc());
}, true);

// spaceheater.dm:55
rt.def("/obj/machinery/space_heater/proc/on_deconstruction", function on_deconstruction(f: Frame) {
	if (this.cell) {
		this.component_parts += this.cell;
		this.cell = null;
	}
	return parent_proc();
});

// spaceheater.dm:60
rt.def("/obj/machinery/space_heater/proc/examine", function examine(f: Frame, user: Value) {
	let $2: any;
	parent_proc();
	let $0: any = user;
	let $1: any = this;
	if (this.on) {

		$2 = "on";
	} else {
		$2 = "off";
	}
	to_chat($0, fmt("＄！ is ＀, and the hatch is ＀.", [$1, $2, this.panel_open ? "open" : "closed"]));
	if (this.cell) {
		to_chat(user, `The charge meter reads ${this.cell ? round(this.cell.percent(), 1) : 0}%.`);
	} else {
		to_chat(user, "There is no power cell installed.");
	}
	return f.dot;
}, false);

// spaceheater.dm:69
rt.def("/obj/machinery/space_heater/proc/update_icon", function update_icon(f: Frame) {
	if (this.on) {
		this.icon_state = `sheater-${this.mode}`;
	} else {
		this.icon_state = "sheater-off";
	}
	this.cut_overlays();
	if (!this.panel_open) return f.dot;
	this.add_overlay("sheater-open");
	return f.dot;
});

// spaceheater.dm:78
rt.def("/obj/machinery/space_heater/proc/process", function* process(f: Frame) {
	let L: Value = null, env: Value = null, newMode: Value = null, heat_capacity: Value = null, requiredPower: Value = null, deltaTemperature: Value = null;
	if (!this.on || !this.is_operational()) {
		return f.dot;
	}
	if (this.cell && this.cell.charge > 0) {
		if (!rt.istype((L = this.loc), T("/turf"))) {
			if (this.mode != "standby") {
				this.mode = "standby";
				yield* this.update_icon();
			}
			return f.dot;
		}
		env = L.return_air();
		newMode = "standby";
		if (this.setMode != "cool" && env.temperature < this.targetTemperature - this.temperatureTolerance) {
			newMode = "heat";
		} else if (this.setMode != "heat" && env.temperature > this.targetTemperature + this.temperatureTolerance) {
			newMode = "cool";
		}
		if (this.mode != newMode) {
			this.mode = newMode;
			yield* this.update_icon();
		}
		if (this.mode == "standby") {
			return f.dot;
		}
		heat_capacity = env.heat_capacity();
		if ((requiredPower = min((requiredPower = rt.op(f, "Abs", [], [env.temperature - this.targetTemperature]) * heat_capacity), this.heatingPower)) < 1) {
			return f.dot;
		}
		deltaTemperature = requiredPower / heat_capacity;
		if (this.mode == "cool") {
			deltaTemperature *= -1;
		}
		if (deltaTemperature) {
			env.temperature += deltaTemperature;
			this.air_update_turf();
		}
		yield* this.cell.use(requiredPower / this.efficiency);
	} else {
		this.on = 0;
		yield* this.update_icon();
	}
	return f.dot;
}, true, { waitfor: false });

// spaceheater.dm:125
rt.def("/obj/machinery/space_heater/proc/RefreshParts", function RefreshParts(f: Frame) {
	let M: Value = null;
	let laser: Value = 0;
	let cap: Value = 0;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/micro_laser"))) {
		laser += M.rating;
	}
	M = null;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/capacitor"))) {
		cap += M.rating;
	}
	this.heatingPower = laser * 40000;
	this.settableTemperatureRange = cap * 30;
	this.efficiency = (cap + 1) * 10000;
	this.targetTemperature = max(max(this.settableTemperatureMedian - this.settableTemperatureRange, TCMB), min(this.targetTemperature, this.settableTemperatureMedian + this.settableTemperatureRange));
	return f.dot;
});

// spaceheater.dm:140
rt.def("/obj/machinery/space_heater/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		yield* parent_proc(severity);
		return f.dot;
	}
	if (this.cell) {
		yield* this.cell.emp_act(severity);
	}
	yield* parent_proc(severity);
	return f.dot;
}, true);

// spaceheater.dm:148
rt.def("/obj/machinery/space_heater/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null;
	let $0: any, $1: any, $2: any;
	yield* this.add_fingerprint(user);
	if (rt.istype(I, T("/obj/item/weapon/stock_parts/cell"))) {
		if (this.panel_open) {
			if (this.cell) {
				to_chat(user, "<span class='warning'>There is already a power cell inside!</span>");
				return f.dot;
			} else if (rt.istype((C = f.usr.get_active_held_item()), T("/obj/item/weapon/stock_parts/cell"))) {
				if (!(yield* user.drop_item())) {
					return f.dot;
				}
				this.cell = C;
				C.loc = this;
				yield* C.add_fingerprint(f.usr);
				user.visible_message(fmt("＄！ inserts a power cell into ％！.", [user, this]), fmt("<span class='notice'>You insert the power cell into ％！.</span>", [this]));
				GLOB.SStgui.update_uis(this);
			}
		} else {
			to_chat(user, "<span class='warning'>The hatch must be open to insert a power cell!</span>");
			return f.dot;
		}
	} else if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		this.panel_open = (!this.panel_open ? 1 : 0);
		$0 = user;
		$1 = user;
		if (this.panel_open) {

			$2 = "opens";
		} else {
			$2 = "closes";
		}
		$1 = fmt("＄！ ＀ the hatch on ％！.", [$1, $2, this]);
		if (this.panel_open) {
			$2 = "open";
		} else {
			$2 = "close";
		}
		$0.visible_message($1, fmt("<span class='notice'>You ＀ the hatch on ％！.</span>", [$2, this]));
		yield* this.update_icon();
		if (this.panel_open) {
			yield* this.interact(user);
		}
	} else if ((yield* this.exchange_parts(user, I)) || (yield* this.default_deconstruction_crowbar(I))) {
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// spaceheater.dm:182
rt.def("/obj/machinery/space_heater/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.physical_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "space_heater", this.name, 400, 305, master_ui, state))).open();
	return f.dot;
}, true);

// spaceheater.dm:188
rt.def("/obj/machinery/space_heater/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, curTemp: Value = null, env: Value = null;
	rt.setAt((data = list()), "open", this.panel_open);
	rt.setAt(data, "on", this.on);
	rt.setAt(data, "mode", this.setMode);
	rt.setAt(data, "hasPowercell", (this.cell ? 1 : 0));
	if (this.cell) {
		rt.setAt(data, "powerLevel", round(this.cell.percent(), 1));
	}
	rt.setAt(data, "targetTemp", round(this.targetTemperature - T0C, 1));
	rt.setAt(data, "minTemp", max(this.settableTemperatureMedian - this.settableTemperatureRange - T0C, TCMB));
	rt.setAt(data, "maxTemp", this.settableTemperatureMedian + this.settableTemperatureRange - T0C);
	let L: Value = rt.getStep(f, this.loc, 0);
	if (rt.istype(L, T("/turf"))) {
		curTemp = (env = L.return_air()).temperature;
	} else if (isturf(L)) {
		curTemp = L.temperature;
	}
	if (curTemp === null) {
		rt.setAt(data, "currentTemp", "N/A");
	} else {
		rt.setAt(data, "currentTemp", round(curTemp - T0C, 1));
	}
	return data;
});

// spaceheater.dm:213
rt.def("/obj/machinery/space_heater/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let target: Value = null, adjust: Value = null;
	let $0: any, $1: any, $2: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "power") {
		this.on = (!this.on ? 1 : 0);
		this.mode = "standby";
		$0 = f.usr;
		$1 = f.usr;
		if (this.on) {

			$2 = "on";
		} else {
			$2 = "off";
		}
		$1 = fmt("＀ switches ＀ ％！.", [$1, $2, this]);
		$0.visible_message($1, fmt("<span class='notice'>You switch ＀ ％！.</span>", [this.on ? "on" : "off", this]));
		yield* this.update_icon();
		f.dot = 1;
	} else if (action === "mode") {
		this.setMode = rt.at(params, "mode");
		f.dot = 1;
	} else if (action === "target") {
		if (!this.panel_open) {
			return f.dot;
		}
		target = rt.at(params, "target");
		adjust = text2num(rt.at(params, "adjust"));
		if (target == "input") {
			if ((target = (yield* g.op(f, "Prompt", [33], [null, round(this.targetTemperature - T0C, 1), this.name, "New target temperature:", null]))) !== null && !(yield* parent_proc())) {
				target += T0C;
				f.dot = 1;
			}
		} else if (adjust) {
			target = this.targetTemperature + adjust;
			f.dot = 1;
		} else if (text2num(target) !== null) {
			target = text2num(target) + T0C;
			f.dot = 1;
		}
		if (f.dot) {
			this.targetTemperature = max(max(this.settableTemperatureMedian - this.settableTemperatureRange, TCMB), min(round(target), this.settableTemperatureMedian + this.settableTemperatureRange));
		}
	} else if (action === "eject") {
		if (!(this.panel_open && this.cell)) return f.dot;
		this.cell.loc = rt.getStep(f, this, 0);
		this.cell = null;
		f.dot = 1;
	}
	return f.dot;
}, true);
