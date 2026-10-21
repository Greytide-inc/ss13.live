// From code/game/machinery/computer/atmos_alert.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10367, "/obj/machinery/computer/atmos_alert", "/obj/machinery/computer", {
	priority_alarms: null,
	minor_alarms: null,
	receive_frequency: 1437,
	radio_connection: null,
	light_color: "#7DE1E1",
	name: "atmospheric alert console",
	desc: "Used to monitor the station's air alarms.",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/atmos_alert"),
	icon_screen: "alert:0",
	icon_keyboard: "atmos_key",
});

// /obj/machinery/computer/atmos_alert/proc/<init>  (code/game/machinery/computer/atmos_alert.dm:7)
rt.def("/obj/machinery/computer/atmos_alert/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "priority_alarms", rt.list());
	$0 = $0;
	rt.setSv(f, "minor_alarms", rt.list());
	return f.dot;
});

// /obj/machinery/computer/atmos_alert/proc/Initialize  (code/game/machinery/computer/atmos_alert.dm:15)  may sleep
rt.def("/obj/machinery/computer/atmos_alert/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_frequency", rt.sv(f, "receive_frequency"));
	return f.dot;
}, true);

// /obj/machinery/computer/atmos_alert/proc/Destroy  (code/game/machinery/computer/atmos_alert.dm:20)  may sleep
rt.def("/obj/machinery/computer/atmos_alert/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "receive_frequency")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/atmos_alert/proc/ui_interact  (code/game/machinery/computer/atmos_alert.dm:25)  may sleep
rt.def("/obj/machinery/computer/atmos_alert/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "atmos_alert", rt.sv(f, "name"), 350, 300, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/atmos_alert/proc/ui_data  (code/game/machinery/computer/atmos_alert.dm:31)
rt.def("/obj/machinery/computer/atmos_alert/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, zone: Value = null;
	let $e: any;
	f.vars = () => [data, zone, $e];
	rt.setAt((data = rt.list()), "priority", rt.list());
	zone = null;
	rt.forList(f, 0, rt.sv(f, "priority_alarms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		zone = $e;
		rt.modAt(live(data), "priority", live(zone), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "minor", rt.list());
	zone = null;
	rt.forList(f, 0, rt.sv(f, "minor_alarms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		zone = $e;
		rt.modAt(live(data), "minor", live(zone), add);
	}
	rt.endFor(f, 0);
	return live(data);
});

// /obj/machinery/computer/atmos_alert/proc/ui_act  (code/game/machinery/computer/atmos_alert.dm:43)  may sleep
rt.def("/obj/machinery/computer/atmos_alert/proc/ui_act", function* ui_act(f: Frame) {
	let zone: Value = null;
	let $0: any;
	f.vars = () => [zone, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "clear") {
		if (truthy((rt.isIn(f, (zone = rt.at(live(f.args[1]), "zone")), rt.sv(f, "priority_alarms")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Priority alarm for ＀ cleared.", [live(zone)])]);
			(rt.modSrcVar(f, "priority_alarms", live(zone), subtract));
			f.dot = 1;
		}
		if (truthy((rt.isIn(f, live(zone), rt.sv(f, "minor_alarms")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Minor alarm for ＀ cleared.", [live(zone)])]);
			(rt.modSrcVar(f, "minor_alarms", live(zone), subtract));
			f.dot = 1;
		}
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/computer/atmos_alert/proc/set_frequency  (code/game/machinery/computer/atmos_alert.dm:59)  may sleep
rt.def("/obj/machinery/computer/atmos_alert/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "receive_frequency")]);
	rt.setSv(f, "receive_frequency", live(new_frequency));
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "receive_frequency"), rt.gl("RADIO_ATMOSIA")])));
	return f.dot;
}, true);

// /obj/machinery/computer/atmos_alert/proc/receive_signal  (code/game/machinery/computer/atmos_alert.dm:64)
rt.def("/obj/machinery/computer/atmos_alert/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	let zone: Value = null, severity: Value = null;
	f.vars = () => [zone, severity];
	if ((!truthy(live(signal)) || truthy(rt.fv(f, "encryption", live(signal))))) {
		return live(f.dot);
	}
	zone = rt.index(rt.fv(f, "data", live(signal)), "zone");
	severity = rt.index(rt.fv(f, "data", live(signal)), "alert");
	if ((!truthy(live(zone)) || !truthy(live(severity)))) {
		return live(f.dot);
	}
	(rt.modSrcVar(f, "minor_alarms", live(zone), subtract));
	(rt.modSrcVar(f, "priority_alarms", live(zone), subtract));
	if (isEqual(live(severity), "severe")) {
		rt.modSrcVar(f, "priority_alarms", live(zone), add);
	} else {
		if (isEqual(live(severity), "minor")) {
			rt.modSrcVar(f, "minor_alarms", live(zone), add);
		}
	}
	rt.callSrc(f, "update_icon", []);
	return live(f.dot);
});

// /obj/machinery/computer/atmos_alert/proc/update_icon  (code/game/machinery/computer/atmos_alert.dm:81)
rt.def("/obj/machinery/computer/atmos_alert/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (truthy(rt.len(f, rt.sv(f, "priority_alarms")))) {
		rt.callSrc(f, "add_overlay", ["alert:2"]);
	} else {
		if (!truthy(rt.len(f, rt.sv(f, "minor_alarms")))) return f.dot;
		rt.callSrc(f, "add_overlay", ["alert:1"]);
	}
	return f.dot;
});
