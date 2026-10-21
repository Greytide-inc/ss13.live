// From code/modules/modular_computers/file_system/programs/sm_monitor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/computer_file/program/supermatter_monitor/proc/process_tick  (code/modules/modular_computers/file_system/programs/sm_monitor.dm:20)  may sleep
rt.def("/datum/computer_file/program/supermatter_monitor/proc/process_tick", function* process_tick(f: Frame) {
	let new_status: Value = null;
	f.vars = () => [new_status];
	yield* g.callSuper(f, [], rt.Args.Same);
	new_status = (yield* g.srcCall(f, "get_status"));
	if (isEqual(rt.sv(f, "last_status"), live(new_status))) return f.dot;
	rt.setSv(f, "last_status", live(new_status));
	rt.setSv(f, "ui_header", fmt("smmon_＀.gif", [rt.sv(f, "last_status")]));
	if (!(truthy((rt.istype(rt.sv(f, "computer"), T("/obj/item/device/modular_computer")) ? 1 : 0)) && !isEqual(rt.fv(f, "hardware_flag", rt.sv(f, "computer")), 2))) return f.dot;
	rt.setSv(f, "program_icon_state", fmt("smmon_＀", [rt.sv(f, "last_status")]));
	if (!truthy((rt.istype(rt.sv(f, "computer"), T("/obj/item/device/modular_computer")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, rt.sv(f, "computer"), "update_icon", []);
	return f.dot;
}, true);

// /datum/computer_file/program/supermatter_monitor/proc/run_program  (code/modules/modular_computers/file_system/programs/sm_monitor.dm:31)  may sleep
rt.def("/datum/computer_file/program/supermatter_monitor/proc/run_program", function* run_program(f: Frame, user: Value) {
	f.vars = () => [user];
	f.dot = (yield* g.callSuper(f, [live(user)]));
	if ((truthy((rt.istype(rt.sv(f, "computer"), T("/obj/item/device/modular_computer")) ? 1 : 0)) && isEqual(rt.fv(f, "hardware_flag", rt.sv(f, "computer")), 2))) {
		rt.setSv(f, "program_icon_state", "engine");
		yield* g.callName(f, rt.sv(f, "computer"), "update_icon", []);
	}
	yield* g.srcCall(f, "refresh");
	return f.dot;
}, true);

// /datum/computer_file/program/supermatter_monitor/proc/kill_program  (code/modules/modular_computers/file_system/programs/sm_monitor.dm:40)
rt.def("/datum/computer_file/program/supermatter_monitor/proc/kill_program", function kill_program(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	rt.setSv(f, "active", null);
	rt.setSv(f, "supermatters", null);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["forced"] });

// /datum/computer_file/program/supermatter_monitor/proc/refresh  (code/modules/modular_computers/file_system/programs/sm_monitor.dm:44)
rt.def("/datum/computer_file/program/supermatter_monitor/proc/refresh", function refresh(f: Frame) {
	let _T: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [_T, S, $e];
	rt.setSv(f, "supermatters", rt.list());
	if (!truthy((_T = rt.getStep(f, rt.callSrc(f, "ui_host", []), 0)))) {
		return live(f.dot);
	}
	S = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/power/supermatter_shard"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if ((!((isEqual(rt.fv(f, "z", live(S)), 2) || isEqual(rt.fv(f, "z", live(S)), 5)) || isEqual(rt.fv(f, "z", live(S)), rt.fv(f, "z", live(_T)))) || !truthy((rt.istype(rt.fv(f, "loc", live(S)), T("/turf")) ? 1 : 0)))) {
			continue;
		}
		rt.callName(f, rt.sv(f, "supermatters"), "Add", [live(S)]);
	}
	rt.endFor(f, 0);
	if (truthy((rt.isIn(f, rt.sv(f, "active"), rt.sv(f, "supermatters")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "active", null);
	return f.dot;
});

// /datum/computer_file/program/supermatter_monitor/proc/get_status  (code/modules/modular_computers/file_system/programs/sm_monitor.dm:60)
rt.def("/datum/computer_file/program/supermatter_monitor/proc/get_status", function get_status(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	f.dot = 0;
	S = null;
	rt.forList(f, 0, rt.sv(f, "supermatters"), T("/obj/machinery/power/supermatter_shard"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		f.dot = rt.call(f, P("/proc/max"), null, [live(f.dot), rt.callName(f, live(S), "get_status", [])]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/computer_file/program/supermatter_monitor/proc/ui_data  (code/modules/modular_computers/file_system/programs/sm_monitor.dm:64)
rt.def("/datum/computer_file/program/supermatter_monitor/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, _T: Value = null, air: Value = null, gasdata: Value = null, gasid: Value = null, SMS: Value = null, S: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [data, _T, air, gasdata, gasid, SMS, S, A, $e];
	data = rt.callSrc(f, "get_header_data", []);
	if (truthy((rt.istype(rt.sv(f, "active"), T("/obj/machinery/power/supermatter_shard")) ? 1 : 0))) {
		if (!truthy((_T = rt.getStep(f, rt.sv(f, "active"), 0)))) {
			rt.setSv(f, "active", null);
			rt.callSrc(f, "refresh", []);
			return live(f.dot);
		}
		if (!truthy((air = rt.callName(f, live(_T), "return_air", [])))) {
			rt.setSv(f, "active", null);
			return live(f.dot);
		}
		rt.setAt(live(data), "active", 1);
		rt.setAt(live(data), "SM_integrity", rt.callName(f, rt.sv(f, "active"), "get_integrity", []));
		rt.setAt(live(data), "SM_power", rt.fv(f, "power", rt.sv(f, "active")));
		rt.setAt(live(data), "SM_ambienttemp", rt.fv(f, "temperature", live(air)));
		rt.setAt(live(data), "SM_ambientpressure", rt.callName(f, live(air), "return_pressure", []));
		gasdata = rt.list();
		if (truthy(rt.callName(f, live(air), "total_moles", []))) {
			gasid = null;
			rt.forList(f, 0, rt.fv(f, "gases", live(air)));
			while (($e = rt.next(f, 0)) !== undefined) {
				gasid = $e;
				rt.callName(f, live(gasdata), "Add", [rt.list(rt.alist(f, ["name", rt.index(rt.index(rt.index(rt.fv(f, "gases", live(air)), live(gasid)), 3), 2), "amount", rt.call(f, P("/proc/round"), null, [divide(multiply(100, rt.index(rt.index(rt.fv(f, "gases", live(air)), live(gasid)), 1)), rt.callName(f, live(air), "total_moles", [])), 0.009999999776482582])]))]);
			}
			rt.endFor(f, 0);
		} else {
			gasid = null;
			rt.forList(f, 0, rt.fv(f, "gases", live(air)));
			while (($e = rt.next(f, 0)) !== undefined) {
				gasid = $e;
				rt.callName(f, live(gasdata), "Add", [rt.list(rt.alist(f, ["name", rt.index(rt.index(rt.index(rt.fv(f, "gases", live(air)), live(gasid)), 3), 2), "amount", 0]))]);
			}
			rt.endFor(f, 0);
		}
		rt.setAt(live(data), "gases", live(gasdata));
	} else {
		SMS = rt.list();
		S = null;
		rt.forList(f, 0, rt.sv(f, "supermatters"), T("/obj/machinery/power/supermatter_shard"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			if (truthy((A = rt.call(f, P("/proc/get_area"), null, [live(S)])))) {
				rt.callName(f, live(SMS), "Add", [rt.list(rt.alist(f, ["area_name", rt.fv(f, "name", live(A)), "integrity", rt.callName(f, live(S), "get_integrity", []), "uid", rt.fv(f, "uid", live(S))]))]);
			}
		}
		rt.endFor(f, 0);
		rt.setAt(live(data), "active", 0);
		rt.setAt(live(data), "supermatters", live(SMS));
	}
	return live(data);
});

// /datum/computer_file/program/supermatter_monitor/proc/ui_act  (code/modules/modular_computers/file_system/programs/sm_monitor.dm:116)  may sleep
rt.def("/datum/computer_file/program/supermatter_monitor/proc/ui_act", function* ui_act(f: Frame) {
	let newuid: Value = null, S: Value = null;
	let $0: any, $e: any;
	f.vars = () => [newuid, S, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	$0 = live(f.args[0]);
	if ($0 === "PRG_clear") {
		rt.setSv(f, "active", null);
		return 1;
	} else if ($0 === "PRG_refresh") {
		yield* g.srcCall(f, "refresh");
		return 1;
	} else if ($0 === "PRG_set") {
		newuid = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "set")]));
		S = null;
		rt.forList(f, 0, rt.sv(f, "supermatters"), T("/obj/machinery/power/supermatter_shard"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			if (isEqual(rt.fv(f, "uid", live(S)), live(newuid))) {
				rt.setSv(f, "active", live(S));
			}
		}
		rt.endFor(f, 0);
		return 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });
