// From code/game/machinery/computer/station_alert.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10410, "/obj/machinery/computer/station_alert", "/obj/machinery/computer", {
	alarms: null,
	icon_screen: "alert:0",
	icon_keyboard: "atmos_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/stationalert"),
	light_color: "#7DE1E1",
	name: "station alert console",
	desc: "Used to access the station's automated alert system.",
});

// /obj/machinery/computer/station_alert/proc/<init>  (code/game/machinery/computer/station_alert.dm:7)
rt.def("/obj/machinery/computer/station_alert/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "alarms", rt.alist(f, ["Fire", rt.list(), "Atmosphere", rt.list(), "Power", rt.list()]));
	return f.dot;
});

// /obj/machinery/computer/station_alert/proc/ui_interact  (code/game/machinery/computer/station_alert.dm:13)  may sleep
rt.def("/obj/machinery/computer/station_alert/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "station_alert", rt.sv(f, "name"), 300, 500, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/station_alert/proc/ui_data  (code/game/machinery/computer/station_alert.dm:19)
rt.def("/obj/machinery/computer/station_alert/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, _class: Value = null, area: Value = null;
	let $e: any;
	f.vars = () => [data, _class, area, $e];
	rt.setAt((data = rt.list()), "alarms", rt.list());
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

// /obj/machinery/computer/station_alert/proc/triggerAlarm  (code/game/machinery/computer/station_alert.dm:30)
rt.def("/obj/machinery/computer/station_alert/proc/triggerAlarm", function triggerAlarm(f: Frame, _class: Value, A: Value, O: Value, source: Value) {
	let L: Value = null, I: Value = null, alarm: Value = null, sources: Value = null, C: Value = null, CL: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [L, I, alarm, sources, C, CL, $0, $1, $2, $3, $e];
	if (!isEqual(rt.fv(f, "z", live(source)), rt.sv(f, "z"))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
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
	return 1;
});

// /obj/machinery/computer/station_alert/proc/cancelAlarm  (code/game/machinery/computer/station_alert.dm:56)
rt.def("/obj/machinery/computer/station_alert/proc/cancelAlarm", function cancelAlarm(f: Frame, _class: Value, A: Value, origin: Value) {
	let L: Value = null, cleared: Value = null, I: Value = null, alarm: Value = null, srcs: Value = null;
	let $e: any;
	f.vars = () => [L, cleared, I, alarm, srcs, $e];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
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
	return (!truthy(live(cleared)) ? 1 : 0);
});

// /obj/machinery/computer/station_alert/proc/process  (code/game/machinery/computer/station_alert.dm:73)
rt.def("/obj/machinery/computer/station_alert/proc/process", function process(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/computer/station_alert/proc/update_icon  (code/game/machinery/computer/station_alert.dm:76)
rt.def("/obj/machinery/computer/station_alert/proc/update_icon", function update_icon(f: Frame) {
	let active_alarms: Value = null, cat: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [active_alarms, cat, L, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	active_alarms = 0;
	cat = null;
	rt.forList(f, 0, rt.sv(f, "alarms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		cat = $e;
		if (truthy(rt.getLen(f, (L = rt.index(rt.sv(f, "alarms"), live(cat)))))) {
			active_alarms = 1;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(active_alarms))) return f.dot;
	rt.callSrc(f, "add_overlay", ["alert:2"]);
	return f.dot;
});
