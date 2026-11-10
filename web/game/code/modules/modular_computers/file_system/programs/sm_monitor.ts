// Based on /tg/station's code/modules/modular_computers/file_system/programs/sm_monitor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4170, "/datum/computer_file/program/supermatter_monitor", "/datum/computer_file/program", {
	last_status: 0,
	supermatters: null,
	active: null,
	filename: "smmonitor",
	filedesc: "Supermatter Monitoring",
	ui_header: "smmon_0.gif",
	program_icon_state: "smmon_0",
	extended_desc: "This program connects to specially calibrated supermatter sensors to provide information on the status of supermatter-based engines.",
	requires_ntnet: 1,
	network_destination: "supermatter monitoring system",
	size: 5,
	tgui_id: "ntos_supermatter_monitor",
	ui_x: 600,
	ui_y: 400,
	transfer_access: 10,
});

// sm_monitor.dm:20
rt.def("/datum/computer_file/program/supermatter_monitor/proc/process_tick", function* process_tick(f: Frame) {
	yield* parent_proc();
	let new_status: Value = this.get_status();
	if (this.last_status == new_status) return f.dot;
	this.last_status = new_status;
	this.ui_header = `smmon_${this.last_status}.gif`;
	if (!(rt.istype(this.computer, T("/obj/item/device/modular_computer")) && this.computer.hardware_flag != 2)) return f.dot;
	this.program_icon_state = `smmon_${this.last_status}`;
	if (!rt.istype(this.computer, T("/obj/item/device/modular_computer"))) return f.dot;
	yield* this.computer.update_icon();
	return f.dot;
}, true);

// sm_monitor.dm:31
rt.def("/datum/computer_file/program/supermatter_monitor/proc/run_program", function* run_program(f: Frame, user: Value) {
	f.dot = (yield* parent_proc(user));
	if (rt.istype(this.computer, T("/obj/item/device/modular_computer")) && this.computer.hardware_flag == 2) {
		this.program_icon_state = "engine";
		yield* this.computer.update_icon();
	}
	this.refresh();
	return f.dot;
}, true);

// sm_monitor.dm:40
rt.def("/datum/computer_file/program/supermatter_monitor/proc/kill_program", function kill_program(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	this.active = null;
	this.supermatters = null;
	parent_proc();
	return f.dot;
}, false, { args: ["forced"] });

// sm_monitor.dm:44
rt.def("/datum/computer_file/program/supermatter_monitor/proc/refresh", function refresh(f: Frame) {
	let _T: Value = null, S: Value = null;
	this.supermatters = list();
	if (!(_T = rt.getStep(f, this.ui_host(), 0))) {
		return f.dot;
	}
	for (S of each(GLOB.machines, T("/obj/machinery/power/supermatter_shard"))) {
		if (!(S.z == ZLEVEL_STATION || S.z == ZLEVEL_MINING || S.z == _T.z) || !rt.istype(S.loc, T("/turf"))) {
			continue;
		}
		this.supermatters.Add(S);
	}
	if (rt.isIn(f, this.active, this.supermatters)) return f.dot;
	this.active = null;
	return f.dot;
});

// sm_monitor.dm:60
rt.def("/datum/computer_file/program/supermatter_monitor/proc/get_status", function get_status(f: Frame) {
	let S: Value = null;
	f.dot = SUPERMATTER_INACTIVE;
	for (S of each(this.supermatters, T("/obj/machinery/power/supermatter_shard"))) {
		f.dot = max(f.dot, S.get_status());
	}
	return f.dot;
});

// sm_monitor.dm:64
rt.def("/datum/computer_file/program/supermatter_monitor/proc/ui_data", function ui_data(f: Frame) {
	let _T: Value = null, air: Value = null, gasdata: Value = null, gasid: Value = null, SMS: Value = null, S: Value = null, A: Value = null;
	let data: Value = this.get_header_data();
	if (rt.istype(this.active, T("/obj/machinery/power/supermatter_shard"))) {
		if (!(_T = rt.getStep(f, this.active, 0))) {
			this.active = null;
			this.refresh();
			return f.dot;
		}
		if (!(air = _T.return_air())) {
			this.active = null;
			return f.dot;
		}
		rt.setAt(data, "active", 1);
		rt.setAt(data, "SM_integrity", this.active.get_integrity());
		rt.setAt(data, "SM_power", this.active.power);
		rt.setAt(data, "SM_ambienttemp", air.temperature);
		rt.setAt(data, "SM_ambientpressure", air.return_pressure());
		gasdata = list();
		if (air.total_moles()) {
			for (gasid of each(air.gases)) {
				gasdata.Add(list(rt.alist(f, ["name", rt.index(rt.index(rt.index(air.gases, gasid), 3), 2), "amount", round(100 * rt.index(rt.index(air.gases, gasid), 1) / air.total_moles(), 0.01)])));
			}
		} else {
			gasid = null;
			for (gasid of each(air.gases)) {
				gasdata.Add(list(rt.alist(f, ["name", rt.index(rt.index(rt.index(air.gases, gasid), 3), 2), "amount", 0])));
			}
		}
		rt.setAt(data, "gases", gasdata);
	} else {
		SMS = list();
		for (S of each(this.supermatters, T("/obj/machinery/power/supermatter_shard"))) {
			if (A = get_area(S)) {
				SMS.Add(list(rt.alist(f, ["area_name", A.name, "integrity", S.get_integrity(), "uid", S.uid])));
			}
		}
		rt.setAt(data, "active", 0);
		rt.setAt(data, "supermatters", SMS);
	}
	return data;
});

// sm_monitor.dm:116
rt.def("/datum/computer_file/program/supermatter_monitor/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let newuid: Value = null, S: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return 1;
	}
	if (action === "PRG_clear") {
		this.active = null;
		return 1;
	} else if (action === "PRG_refresh") {
		this.refresh();
		return 1;
	} else if (action === "PRG_set") {
		newuid = text2num(rt.at(params, "set"));
		for (S of each(this.supermatters, T("/obj/machinery/power/supermatter_shard"))) {
			if (S.uid == newuid) {
				this.active = S;
			}
		}
		return 1;
	}
	return f.dot;
}, true);
