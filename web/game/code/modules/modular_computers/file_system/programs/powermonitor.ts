// Based on /tg/station's code/modules/modular_computers/file_system/programs/powermonitor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


rt.type(4169, "/datum/computer_file/program/power_monitor", "/datum/computer_file/program", {
	has_alert: 0,
	attached: null,
	history: null,
	record_size: 60,
	record_interval: 50,
	next_record: 0,
	filename: "powermonitor",
	filedesc: "Power Monitor",
	program_icon_state: "power_monitor",
	extended_desc: "This program connects to sensors around the station to provide information about electrical systems",
	ui_header: "power_norm.gif",
	usage_flags: 1,
	requires_ntnet: 0,
	network_destination: "power monitoring system",
	size: 9,
	tgui_id: "ntos_power_monitor",
	ui_x: 1200,
	ui_y: 1000,
	transfer_access: 10,
});

// powermonitor.dm:18
rt.def("/datum/computer_file/program/power_monitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.history = list();
	return f.dot;
});

// powermonitor.dm:25
rt.def("/datum/computer_file/program/power_monitor/proc/run_program", function run_program(f: Frame, user: Value) {
	f.dot = parent_proc(user);
	rt.callSrc(f, "search", []);
	rt.setAt(this.history, "supply", list());
	rt.setAt(this.history, "demand", list());
	return f.dot;
});

// powermonitor.dm:32
rt.def("/datum/computer_file/program/power_monitor/proc/process_tick", function process_tick(f: Frame) {
	if (!this.attached) {
		rt.callSrc(f, "search", []);
	} else {
		this.record();
	}
	return f.dot;
});

// powermonitor.dm:38
rt.def("/datum/computer_file/program/power_monitor/proc/search", function search(f: Frame) {
	let _T: Value = rt.getStep(f, this.computer, 0);
	this.attached = rt.locateIn(f, T("/obj/structure/cable"), _T);
	return f.dot;
});

// powermonitor.dm:42
rt.def("/datum/computer_file/program/power_monitor/proc/record", function record(f: Frame) {
	if (!(rt.worldTime(f) >= this.next_record)) return f.dot;
	this.next_record = rt.worldTime(f) + this.record_interval;
	let supply: Value = rt.at(this.history, "supply");
	if (rt.len(f, (supply += this.attached.powernet.viewavail)) > this.record_size) {
		supply.Cut(1, 2);
	}
	let demand: Value = rt.at(this.history, "demand");
	if (!(rt.len(f, (demand += this.attached.powernet.viewload)) > this.record_size)) return f.dot;
	demand.Cut(1, 2);
	return f.dot;
});

// powermonitor.dm:56
rt.def("/datum/computer_file/program/power_monitor/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, term: Value = null, A: Value = null;
	let $2: any, $3: any, $4: any, $5: any, $e: any;
	rt.setAt((data = this.get_header_data()), "stored", this.record_size);
	rt.setAt(data, "interval", this.record_interval / 10);
	let $0: any = data;
	let $1: any = "attached";
	rt.setAt($0, $1, this.attached ? 1 : 0);
	if (this.attached) {
		rt.setAt(data, "supply", this.attached.powernet.viewavail);
		rt.setAt(data, "demand", this.attached.powernet.viewload);
	}
	rt.setAt(data, "history", this.history);
	rt.setAt(data, "areas", list());
	if (this.attached) {
		for (term of each(this.attached.powernet.nodes, T("/obj/machinery/power/terminal"))) {
			if (rt.istype((A = term.master), T("/obj/machinery/power/apc"))) {
				$0 = data;
				$1 = "areas";
				$2 = "name";
				$3 = A.area.name;
				$4 = "charge";
				if (A.cell) {
					$5 = A.cell.percent();
				} else {
					$5 = 0;
				}
				rt.modAt($0, $1, list(rt.alist(f, [$2, $3, $4, $5, "load", A.lastused_total, "charging", A.charging, "eqp", A.equipment, "lgt", A.lighting, "env", A.environ])), add);
			}
		}
	}
	return data;
});
