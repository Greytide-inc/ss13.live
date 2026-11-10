// Based on /tg/station's code/game/machinery/computer/station_alert.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


rt.type(10410, "/obj/machinery/computer/station_alert", "/obj/machinery/computer", {
	alarms: null,
	icon_screen: "alert:0",
	icon_keyboard: "atmos_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/stationalert"),
	light_color: "#7DE1E1",
	name: "station alert console",
	desc: "Used to access the station's automated alert system.",
});

// station_alert.dm:7
rt.def("/obj/machinery/computer/station_alert/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.alarms = rt.alist(f, ["Fire", list(), "Atmosphere", list(), "Power", list()]);
	return f.dot;
});

// station_alert.dm:13
rt.def("/obj/machinery/computer/station_alert/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "station_alert", this.name, 300, 500, master_ui, state))).open();
	return f.dot;
}, true);

// station_alert.dm:19
rt.def("/obj/machinery/computer/station_alert/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, _class: Value = null, area: Value = null;
	rt.setAt((data = list()), "alarms", list());
	for (_class of each(this.alarms)) {
		rt.setAt(rt.at(data, "alarms"), _class, list());
		area = null;
		for (area of each(rt.index(this.alarms, _class))) {
			rt.modAt(rt.at(data, "alarms"), _class, area, add);
		}
	}
	return data;
});

// station_alert.dm:30
rt.def("/obj/machinery/computer/station_alert/proc/triggerAlarm", function triggerAlarm(f: Frame, _class: Value, A: Value, O: Value, source: Value) {
	let I: Value = null, alarm: Value = null, sources: Value = null, C: Value = null, CL: Value = null;
	let $e: any;
	if (source.z != this.z) {
		return f.dot;
	}
	if (rt.bitAnd(this.stat, 1)) {
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
	return 1;
});

// station_alert.dm:56
rt.def("/obj/machinery/computer/station_alert/proc/cancelAlarm", function cancelAlarm(f: Frame, _class: Value, A: Value, origin: Value) {
	let I: Value = null, alarm: Value = null, srcs: Value = null;
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
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
	return (!cleared ? 1 : 0);
});

// station_alert.dm:73
rt.def("/obj/machinery/computer/station_alert/proc/process", function process(f: Frame) {
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// station_alert.dm:76
rt.def("/obj/machinery/computer/station_alert/proc/update_icon", function update_icon(f: Frame) {
	let cat: Value = null, L: Value = null;
	parent_proc();
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	let active_alarms: Value = 0;
	for (cat of each(this.alarms)) {
		if (rt.len(f, (L = rt.index(this.alarms, cat)))) {
			active_alarms = 1;
		}
	}
	if (!active_alarms) return f.dot;
	this.add_overlay("alert:2");
	return f.dot;
});
