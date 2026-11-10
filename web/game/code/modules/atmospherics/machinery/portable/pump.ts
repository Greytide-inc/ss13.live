// Based on /tg/station's code/modules/atmospherics/machinery/portable/pump.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10703, "/obj/machinery/portable_atmospherics/pump", "/obj/machinery/portable_atmospherics", {
	on: 0,
	direction: "out",
	pump: null,
	volume: 1000,
	name: "portable air pump",
	icon_state: "psiphon:0",
	density: 1,
});

// pump.dm:19
rt.def("/obj/machinery/portable_atmospherics/pump/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.pump = (yield* new_(T("/obj/machinery/atmospherics/components/binary/pump"), this, 0));
	this.pump.on = 1;
	this.pump.stat = 0;
	this.pump.build_network();
	return f.dot;
}, true);

// pump.dm:26
rt.def("/obj/machinery/portable_atmospherics/pump/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	yield* (_T = rt.getStep(f, this, 0)).assume_air(this.air_contents);
	this.air_update_turf();
	yield* qdel(this.pump);
	this.pump = null;
	return (yield* parent_proc());
}, true);

// pump.dm:34
rt.def("/obj/machinery/portable_atmospherics/pump/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `psiphon:${this.on}`;
	this.cut_overlays();
	if (this.holding) {
		this.add_overlay("siphon-open");
	}
	if (!this.connected_port) return f.dot;
	this.add_overlay("siphon-connector");
	return f.dot;
});

// pump.dm:43
rt.def("/obj/machinery/portable_atmospherics/pump/proc/process_atmos", function* process_atmos(f: Frame) {
	yield* parent_proc();
	if (!this.on) {
		rt.setAt(this.pump.airs, 1, null);
		rt.setAt(this.pump.airs, 2, null);
		return f.dot;
	}
	let _T: Value = rt.getStep(f, this, 0);
	if (this.direction == "out") {
		rt.setAt(this.pump.airs, 1, this.holding ? this.holding.air_contents : this.air_contents);
		rt.setAt(this.pump.airs, 2, this.holding ? this.air_contents : _T.return_air());
	} else {
		rt.setAt(this.pump.airs, 1, this.holding ? this.air_contents : _T.return_air());
		rt.setAt(this.pump.airs, 2, this.holding ? this.holding.air_contents : this.air_contents);
	}
	yield* this.pump.process_atmos();
	if (this.holding) return f.dot;
	this.air_update_turf();
	return f.dot;
}, true);

// pump.dm:62
rt.def("/obj/machinery/portable_atmospherics/pump/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (this.is_operational()) {
		if (prob(50 / severity)) {
			this.on = (!this.on ? 1 : 0);
		}
		if (prob(100 / severity)) {
			this.direction = "out";
		}
		this.pump.target_pressure = rand(0, 10132.5);
		yield* this.update_icon();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// pump.dm:74
rt.def("/obj/machinery/portable_atmospherics/pump/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.physical_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "portable_pump", this.name, 420, 415, master_ui, state))).open();
	return f.dot;
}, true);

// pump.dm:80
rt.def("/obj/machinery/portable_atmospherics/pump/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	rt.setAt((data = list()), "on", this.on);
	rt.setAt(data, "direction", this.direction);
	let $0: any = data;
	let $1: any = "connected";
	rt.setAt($0, $1, this.connected_port ? 1 : 0);
	rt.setAt(data, "pressure", round(this.air_contents.return_pressure() ? this.air_contents.return_pressure() : 0));
	rt.setAt(data, "target_pressure", round(this.pump.target_pressure ? this.pump.target_pressure : 0));
	rt.setAt(data, "default_pressure", round(101.325));
	rt.setAt(data, "min_pressure", round(10.1325));
	rt.setAt(data, "max_pressure", round(1013.25));
	if (this.holding) {
		rt.setAt(data, "holding", list());
		rt.setAt(rt.at(data, "holding"), "name", this.holding.name);
		rt.setAt(rt.at(data, "holding"), "pressure", round(this.holding.air_contents.return_pressure()));
	}
	return data;
});

// pump.dm:97
rt.def("/obj/machinery/portable_atmospherics/pump/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let plasma: Value = null, n2o: Value = null, A: Value = null, pressure: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "power") {
		this.on = (!this.on ? 1 : 0);
		if (this.on && !this.holding) {
			plasma = rt.index(this.air_contents.gases, "plasma");
			if ((n2o = rt.index(this.air_contents.gases, "n2o")) || plasma) {
				A = get_area(this);
				$0 = `${key_name_admin(f.usr)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])}`;
				if (n2o) {
					$1 = "N2O";
				} else {
					$1 = "";
				}
				if (n2o && plasma) {
					$2 = " & ";
				} else {
					$2 = "";
				}
				if (plasma) {
					$3 = "Plasma";
				} else {
					$3 = "";
				}
				message_admins(`${$0} turned on a pump that contains ${$1}${$2}${$3} at ${A}${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`);
				$0 = key_name(f.usr);
				if (n2o) {
					$1 = "N2O";
				} else {
					$1 = "";
				}
				if (n2o && plasma) {
					$2 = " & ";
				} else {
					$2 = "";
				}
				if (plasma) {
					$3 = "Plasma";
				} else {
					$3 = "";
				}
				log_admin(`${$0} turned on a pump that contains ${$1}${$2}${$3} at ${A}${`(${this.x},${this.y},${this.z})`}`);
			}
		}
		f.dot = 1;
	} else if (action === "direction") {
		if (this.direction == "out") {
			this.direction = "in";
		} else {
			this.direction = "out";
		}
		f.dot = 1;
	} else if (action === "pressure") {
		if ((pressure = rt.at(params, "pressure")) == "reset") {
			pressure = 101.325;
			f.dot = 1;
		} else if (pressure == "min") {
			pressure = 10.1325;
			f.dot = 1;
		} else if (pressure == "max") {
			pressure = 1013.25;
			f.dot = 1;
		} else if (pressure == "input") {
			if ((pressure = (yield* g.op(f, "Prompt", [33], [null, this.pump.target_pressure, this.name, `New release pressure (${10.1325}-${1013.25} kPa):`, null]))) !== null && !(yield* parent_proc())) {
				f.dot = 1;
			}
		} else if (text2num(pressure) !== null) {
			pressure = text2num(pressure);
			f.dot = 1;
		}
		if (f.dot) {
			this.pump.target_pressure = max(10.1325, min(round(pressure), 1013.25));
			this.investigate_log(`was set to ${this.pump.target_pressure} kPa by ${key_name(f.usr)}.`, "atmos");
		}
	} else if (action === "eject") {
		if (this.holding) {
			this.holding.loc = rt.getStep(f, this, 0);
			this.holding = null;
			f.dot = 1;
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);
