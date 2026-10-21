// From code/modules/modular_computers/file_system/programs/alarm.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4161, "/datum/computer_file/program/alarm_monitor", "/datum/computer_file/program", {
	has_alert: 0,
	alarms: null,
	alarm_z: null,
	filename: "alarmmonitor",
	filedesc: "Alarm Monitor",
	ui_header: "alarm_green.gif",
	program_icon_state: "alert-green",
	extended_desc: "This program provides visual interface for station's alarm system.",
	requires_ntnet: 1,
	network_destination: "alarm monitoring network",
	size: 5,
	tgui_id: "ntos_station_alert",
	ui_x: 315,
	ui_y: 500,
});

// /datum/computer_file/program/alarm_monitor/proc/<init>  (code/modules/modular_computers/file_system/programs/alarm.dm:15)
rt.def("/datum/computer_file/program/alarm_monitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "alarms", rt.alist(f, ["Fire", rt.list(), "Atmosphere", rt.list(), "Power", rt.list()]));
	rt.setSv(f, "alarm_z", rt.list(2, 5));
	return f.dot;
});

// /datum/computer_file/program/alarm_monitor/proc/process_tick  (code/modules/modular_computers/file_system/programs/alarm.dm:19)  may sleep
rt.def("/datum/computer_file/program/alarm_monitor/proc/process_tick", function* process_tick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "has_alert"))) {
		rt.setSv(f, "program_icon_state", "alert-red");
		rt.setSv(f, "ui_header", "alarm_red.gif");
		yield* g.srcCall(f, "update_computer_icon");
	} else {
		if (!truthy(rt.sv(f, "has_alert"))) {
			rt.setSv(f, "program_icon_state", "alert-green");
			rt.setSv(f, "ui_header", "alarm_green.gif");
			yield* g.srcCall(f, "update_computer_icon");
		}
	}
	return 1;
}, true);

// /datum/computer_file/program/alarm_monitor/proc/ui_data  (code/modules/modular_computers/file_system/programs/alarm.dm:33)
rt.def("/datum/computer_file/program/alarm_monitor/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, _class: Value = null, area: Value = null;
	let $e: any;
	f.vars = () => [data, _class, area, $e];
	rt.setAt((data = rt.callSrc(f, "get_header_data", [])), "alarms", rt.list());
	_class = null;
	rt.forList(f, 0, rt.sv(f, "alarms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_class = $e;
		rt.setAt(rt.at(live(data), "alarms"), live(_class), rt.list());
		area = null;
		rt.forList(f, 1, rt.index(rt.sv(f, "alarms"), live(_class)));
		while (($e = rt.next(f, 1)) !== undefined) {
			area = $e;
			rt.modAt(rt.at(live(data), "alarms"), live(_class), live(area), add);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return live(data);
});

// /datum/computer_file/program/alarm_monitor/proc/triggerAlarm  (code/modules/modular_computers/file_system/programs/alarm.dm:44)
rt.def("/datum/computer_file/program/alarm_monitor/proc/triggerAlarm", function triggerAlarm(f: Frame, _class: Value, A: Value, O: Value, source: Value) {
	let L: Value = null, I: Value = null, alarm: Value = null, sources: Value = null, C: Value = null, CL: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [L, I, alarm, sources, C, CL, $0, $1, $2, $3, $e];
	if (!truthy((rt.isIn(f, rt.fv(f, "z", live(source)), rt.sv(f, "alarm_z")) ? 1 : 0))) {
		return live(f.dot);
	}
	L = rt.index(rt.sv(f, "alarms"), live(_class));
	I = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual(live(I), rt.fv(f, "name", live(A)))) {
			alarm = rt.index(live(L), live(I));
			sources = rt.index(live(alarm), 3);
			if (!truthy((rt.isIn(f, live(source), live(sources)) ? 1 : 0))) {
				sources = rt.modify(live(sources), live(source), add);
			}
			return 1;
		}
	}
	rt.endFor(f, 0);
	C = null;
	CL = null;
	if ((truthy(live(O)) && truthy((rt.istype(live(O), T("/list")) ? 1 : 0)))) {
		if (isEqual(rt.getLen(f, (CL = live(O))), 1)) {
			C = rt.index(live(CL), 1);
		}
	} else {
		if ((truthy(live(O)) && truthy((rt.istype(live(O), T("/obj/machinery/camera")) ? 1 : 0)))) {
			C = live(O);
		}
	}
	$0 = live(L);
	$1 = rt.fv(f, "name", live(A));
	$2 = live(A);
	if (truthy(live(C))) {
		$3 = live(C);
	} else {
		$3 = live(O);
	}
	rt.setAt($0, $1, rt.list($2, $3, rt.list(live(source))));
	rt.callSrc(f, "update_alarm_display", []);
	return 1;
});

// /datum/computer_file/program/alarm_monitor/proc/cancelAlarm  (code/modules/modular_computers/file_system/programs/alarm.dm:71)
rt.def("/datum/computer_file/program/alarm_monitor/proc/cancelAlarm", function cancelAlarm(f: Frame, _class: Value, A: Value, origin: Value) {
	let L: Value = null, cleared: Value = null, I: Value = null, alarm: Value = null, srcs: Value = null;
	let $e: any;
	f.vars = () => [L, cleared, I, alarm, srcs, $e];
	L = rt.index(rt.sv(f, "alarms"), live(_class));
	cleared = 0;
	I = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual(live(I), rt.fv(f, "name", live(A)))) {
			alarm = rt.index(live(L), live(I));
			srcs = rt.index(live(alarm), 3);
			if (truthy((rt.isIn(f, live(origin), live(srcs)) ? 1 : 0))) {
				(srcs = rt.modify(live(srcs), live(origin), subtract));
			}
			if (isEqual(rt.len(f, live(srcs)), 0)) {
				cleared = 1;
				(L = rt.modify(live(L), live(I), subtract));
			}
		}
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "update_alarm_display", []);
	return (!truthy(live(cleared)) ? 1 : 0);
});

// /datum/computer_file/program/alarm_monitor/proc/update_alarm_display  (code/modules/modular_computers/file_system/programs/alarm.dm:88)
rt.def("/datum/computer_file/program/alarm_monitor/proc/update_alarm_display", function update_alarm_display(f: Frame) {
	let cat: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [cat, L, $e];
	rt.setSv(f, "has_alert", 0);
	cat = null;
	rt.forList(f, 0, rt.sv(f, "alarms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		cat = $e;
		if (truthy(rt.getLen(f, (L = rt.index(rt.sv(f, "alarms"), live(cat)))))) {
			rt.setSv(f, "has_alert", 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/computer_file/program/alarm_monitor/proc/run_program  (code/modules/modular_computers/file_system/programs/alarm.dm:94)
rt.def("/datum/computer_file/program/alarm_monitor/proc/run_program", function run_program(f: Frame, user: Value) {
	f.dot = rt.callSuper(f, [live(user)]);
	rt.modGl("alarmdisplay", live(f.src), add);
	return f.dot;
});

// /datum/computer_file/program/alarm_monitor/proc/kill_program  (code/modules/modular_computers/file_system/programs/alarm.dm:98)
rt.def("/datum/computer_file/program/alarm_monitor/proc/kill_program", function kill_program(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	(rt.modGl("alarmdisplay", live(f.src), subtract));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["forced"] });
