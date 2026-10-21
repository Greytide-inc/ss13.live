// From code/modules/modular_computers/file_system/programs/powermonitor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/computer_file/program/power_monitor/proc/<init>  (code/modules/modular_computers/file_system/programs/powermonitor.dm:18)
rt.def("/datum/computer_file/program/power_monitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "history", rt.list());
	return f.dot;
});

// /datum/computer_file/program/power_monitor/proc/run_program  (code/modules/modular_computers/file_system/programs/powermonitor.dm:25)
rt.def("/datum/computer_file/program/power_monitor/proc/run_program", function run_program(f: Frame, user: Value) {
	f.dot = rt.callSuper(f, [live(user)]);
	rt.callSrc(f, "search", []);
	rt.setAt(rt.sv(f, "history"), "supply", rt.list());
	rt.setAt(rt.sv(f, "history"), "demand", rt.list());
	return f.dot;
});

// /datum/computer_file/program/power_monitor/proc/process_tick  (code/modules/modular_computers/file_system/programs/powermonitor.dm:32)
rt.def("/datum/computer_file/program/power_monitor/proc/process_tick", function process_tick(f: Frame) {
	if (!truthy(rt.sv(f, "attached"))) {
		rt.callSrc(f, "search", []);
	} else {
		rt.callSrc(f, "record", []);
	}
	return f.dot;
});

// /datum/computer_file/program/power_monitor/proc/search  (code/modules/modular_computers/file_system/programs/powermonitor.dm:38)
rt.def("/datum/computer_file/program/power_monitor/proc/search", function search(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.getStep(f, rt.sv(f, "computer"), 0);
	rt.setSv(f, "attached", rt.locateIn(f, T("/obj/structure/cable"), live(_T)));
	return f.dot;
});

// /datum/computer_file/program/power_monitor/proc/record  (code/modules/modular_computers/file_system/programs/powermonitor.dm:42)
rt.def("/datum/computer_file/program/power_monitor/proc/record", function record(f: Frame) {
	let supply: Value = null, demand: Value = null;
	f.vars = () => [supply, demand];
	if (!rt.ge(rt.worldTime(f), rt.sv(f, "next_record"))) return f.dot;
	rt.setSv(f, "next_record", add(rt.worldTime(f), rt.sv(f, "record_interval")));
	supply = rt.at(rt.sv(f, "history"), "supply");
	if (rt.gt(rt.getLen(f, (supply = rt.modify(live(supply), rt.gv(f, "viewavail", rt.fv(f, "powernet", rt.sv(f, "attached"))), add))), rt.sv(f, "record_size"))) {
		rt.callName(f, live(supply), "Cut", [1, 2]);
	}
	demand = rt.at(rt.sv(f, "history"), "demand");
	if (!rt.gt(rt.getLen(f, (demand = rt.modify(live(demand), rt.gv(f, "viewload", rt.fv(f, "powernet", rt.sv(f, "attached"))), add))), rt.sv(f, "record_size"))) return f.dot;
	rt.callName(f, live(demand), "Cut", [1, 2]);
	return f.dot;
});

// /datum/computer_file/program/power_monitor/proc/ui_data  (code/modules/modular_computers/file_system/programs/powermonitor.dm:56)
rt.def("/datum/computer_file/program/power_monitor/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, term: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	f.vars = () => [data, term, A, $0, $1, $2, $3, $4, $5, $e];
	rt.setAt((data = rt.callSrc(f, "get_header_data", [])), "stored", rt.sv(f, "record_size"));
	rt.setAt(live(data), "interval", divide(rt.sv(f, "record_interval"), 10));
	$0 = live(data);
	$1 = "attached";
	if (truthy(rt.sv(f, "attached"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	if (truthy(rt.sv(f, "attached"))) {
		rt.setAt(live(data), "supply", rt.gv(f, "viewavail", rt.fv(f, "powernet", rt.sv(f, "attached"))));
		rt.setAt(live(data), "demand", rt.gv(f, "viewload", rt.fv(f, "powernet", rt.sv(f, "attached"))));
	}
	rt.setAt(live(data), "history", rt.sv(f, "history"));
	rt.setAt(live(data), "areas", rt.list());
	if (truthy(rt.sv(f, "attached"))) {
		term = null;
		rt.forList(f, 0, rt.gv(f, "nodes", rt.fv(f, "powernet", rt.sv(f, "attached"))), T("/obj/machinery/power/terminal"));
		while (($e = rt.next(f, 0)) !== undefined) {
			term = $e;
			if (truthy((rt.istype((A = rt.fv(f, "master", live(term))), T("/obj/machinery/power/apc")) ? 1 : 0))) {
				$0 = live(data);
				$1 = "areas";
				$2 = "name";
				$3 = rt.gv(f, "name", rt.fv(f, "area", live(A)));
				$4 = "charge";
				if (truthy(rt.fv(f, "cell", live(A)))) {
					$5 = rt.callName(f, rt.fv(f, "cell", live(A)), "percent", []);
				} else {
					$5 = 0;
				}
				rt.modAt($0, $1, rt.list(rt.alist(f, [$2, $3, $4, $5, "load", rt.fv(f, "lastused_total", live(A)), "charging", rt.fv(f, "charging", live(A)), "eqp", rt.fv(f, "equipment", live(A)), "lgt", rt.fv(f, "lighting", live(A)), "env", rt.fv(f, "environ", live(A))])), add);
			}
		}
		rt.endFor(f, 0);
	}
	return live(data);
});
