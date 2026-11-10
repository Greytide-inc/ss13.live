// Based on /tg/station's code/modules/modular_computers/file_system/programs/alarm.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


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

// alarm.dm:15
rt.def("/datum/computer_file/program/alarm_monitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.alarms = rt.alist(f, ["Fire", list(), "Atmosphere", list(), "Power", list()]);
	this.alarm_z = list(2, 5);
	return f.dot;
});

// alarm.dm:19
rt.def("/datum/computer_file/program/alarm_monitor/proc/process_tick", function* process_tick(f: Frame) {
	yield* parent_proc();
	if (this.has_alert) {
		this.program_icon_state = "alert-red";
		this.ui_header = "alarm_red.gif";
		yield* this.update_computer_icon();
	} else if (!this.has_alert) {
		this.program_icon_state = "alert-green";
		this.ui_header = "alarm_green.gif";
		yield* this.update_computer_icon();
	}
	return 1;
}, true);

// alarm.dm:33
rt.def("/datum/computer_file/program/alarm_monitor/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, _class: Value = null, area: Value = null;
	rt.setAt((data = this.get_header_data()), "alarms", list());
	for (_class of each(this.alarms)) {
		rt.setAt(rt.at(data, "alarms"), _class, list());
		area = null;
		for (area of each(rt.index(this.alarms, _class))) {
			rt.modAt(rt.at(data, "alarms"), _class, area, add);
		}
	}
	return data;
});

// alarm.dm:44
rt.def("/datum/computer_file/program/alarm_monitor/proc/triggerAlarm", function triggerAlarm(f: Frame, _class: Value, A: Value, O: Value, source: Value) {
	let I: Value = null, alarm: Value = null, sources: Value = null, C: Value = null, CL: Value = null;
	let $e: any;
	if (!rt.isIn(f, source.z, this.alarm_z)) {
		return f.dot;
	}
	let L: Value = rt.index(this.alarms, _class);
	for (I of each(L)) {
		if (I == A.name) {
			alarm = rt.index(L, I);
			sources = rt.index(alarm, 3);
			if (!rt.isIn(f, source, sources)) {
				sources += source;
			}
			return 1;
		}
	}
	if (O && rt.istype(O, T("/list"))) {
		if (rt.len(f, (CL = O)) == 1) {
			C = rt.index(CL, 1);
		}
	} else if (O && rt.istype(O, T("/obj/machinery/camera"))) {
		C = O;
	}
	let $0: any = L;
	let $1: any = A.name;
	let $2: any = A;
	rt.setAt($0, $1, list($2, C ? C : O, list(source)));
	this.update_alarm_display();
	return 1;
});

// alarm.dm:71
rt.def("/datum/computer_file/program/alarm_monitor/proc/cancelAlarm", function cancelAlarm(f: Frame, _class: Value, A: Value, origin: Value) {
	let I: Value = null, alarm: Value = null, srcs: Value = null;
	let L: Value = rt.index(this.alarms, _class);
	let cleared: Value = 0;
	for (I of each(L)) {
		if (I == A.name) {
			alarm = rt.index(L, I);
			srcs = rt.index(alarm, 3);
			if (rt.isIn(f, origin, srcs)) {
				srcs -= origin;
			}
			if (rt.len(f, srcs) == 0) {
				cleared = 1;
				L -= I;
			}
		}
	}
	this.update_alarm_display();
	return (!cleared ? 1 : 0);
});

// alarm.dm:88
rt.def("/datum/computer_file/program/alarm_monitor/proc/update_alarm_display", function update_alarm_display(f: Frame) {
	let cat: Value = null, L: Value = null;
	this.has_alert = 0;
	for (cat of each(this.alarms)) {
		if (rt.len(f, (L = rt.index(this.alarms, cat)))) {
			this.has_alert = 1;
		}
	}
	return f.dot;
});

// alarm.dm:94
rt.def("/datum/computer_file/program/alarm_monitor/proc/run_program", function run_program(f: Frame, user: Value) {
	f.dot = parent_proc(user);
	GLOB.alarmdisplay += this;
	return f.dot;
});

// alarm.dm:98
rt.def("/datum/computer_file/program/alarm_monitor/proc/kill_program", function kill_program(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	GLOB.alarmdisplay -= this;
	parent_proc();
	return f.dot;
}, false, { args: ["forced"] });
