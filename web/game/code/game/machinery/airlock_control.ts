// From code/game/machinery/airlock_control.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/machinery/door/airlock/proc/receive_signal  (code/game/machinery/airlock_control.dm:11)  may sleep
rt.def("/obj/machinery/door/airlock/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	let $0: any;
	f.vars = () => [signal, $0];
	if ((!truthy(live(signal)) || truthy(rt.fv(f, "encryption", live(signal))))) {
		return live(f.dot);
	}
	if ((!isEqual(rt.sv(f, "id_tag"), rt.index(rt.fv(f, "data", live(signal)), "tag")) || !truthy(rt.index(rt.fv(f, "data", live(signal)), "command")))) {
		return live(f.dot);
	}
	$0 = rt.index(rt.fv(f, "data", live(signal)), "command");
	if ($0 === "open") {
		yield* g.srcCall(f, "open", 1);
	} else if ($0 === "close") {
		yield* g.srcCall(f, "close", 1);
	} else if ($0 === "unlock") {
		rt.setSv(f, "locked", 0);
		yield* g.srcCall(f, "update_icon");
	} else if ($0 === "lock") {
		rt.setSv(f, "locked", 1);
		yield* g.srcCall(f, "update_icon");
	} else if ($0 === "secure_open") {
		rt.setSv(f, "locked", 0);
		yield* g.srcCall(f, "update_icon");
		yield* g.call(f, P("/proc/sleep"), null, [2]);
		yield* g.srcCall(f, "open", 1);
		rt.setSv(f, "locked", 1);
		yield* g.srcCall(f, "update_icon");
	} else if ($0 === "secure_close") {
		rt.setSv(f, "locked", 0);
		yield* g.srcCall(f, "close", 1);
		rt.setSv(f, "locked", 1);
		yield* g.call(f, P("/proc/sleep"), null, [2]);
		yield* g.srcCall(f, "update_icon");
	}
	yield* g.srcCall(f, "send_status");
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/send_status  (code/game/machinery/airlock_control.dm:53)  may sleep
rt.def("/obj/machinery/door/airlock/proc/send_status", function* send_status(f: Frame) {
	let signal: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [signal, $0, $1, $2];
	if (!truthy(rt.sv(f, "radio_connection"))) return f.dot;
	rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
	rt.setAt(rt.fv(f, "data", live(signal)), "tag", rt.sv(f, "id_tag"));
	rt.setAt(rt.fv(f, "data", live(signal)), "timestamp", rt.worldTime(f));
	$0 = rt.fv(f, "data", live(signal));
	$1 = "door_status";
	if (truthy(rt.sv(f, "density"))) {
		$2 = "closed";
	} else {
		$2 = "open";
	}
	rt.setAt($0, $1, $2);
	$0 = rt.fv(f, "data", live(signal));
	$1 = "lock_status";
	if (truthy(rt.sv(f, "locked"))) {
		$2 = "locked";
	} else {
		$2 = "unlocked";
	}
	rt.setAt($0, $1, $2);
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [null, live(f.src), null, live(signal), "range", 5, "filter", rt.gl("RADIO_AIRLOCK")], rt.Args.Named);
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/open  (code/game/machinery/airlock_control.dm:65)  may sleep
rt.def("/obj/machinery/door/airlock/proc/open", function* open(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.args[0]))) return f.dot;
	yield* g.srcCall(f, "send_status");
	return f.dot;
}, true, { args: ["surpress_send"] });

// /obj/machinery/door/airlock/proc/close  (code/game/machinery/airlock_control.dm:70)  may sleep
rt.def("/obj/machinery/door/airlock/proc/close", function* close(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.args[0]))) return f.dot;
	yield* g.srcCall(f, "send_status");
	return f.dot;
}, true, { args: ["surpress_send"] });

// /obj/machinery/door/airlock/proc/set_frequency  (code/game/machinery/airlock_control.dm:75)  may sleep
rt.def("/obj/machinery/door/airlock/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	if (!truthy(live(new_frequency))) return f.dot;
	rt.setSv(f, "frequency", live(new_frequency));
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency"), rt.gl("RADIO_AIRLOCK")])));
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/Destroy  (code/game/machinery/airlock_control.dm:81)  may sleep
rt.def("/obj/machinery/door/airlock/proc/Destroy", function* Destroy(f: Frame) {
	if ((truthy(rt.sv(f, "frequency")) && truthy(rt.gl("SSradio")))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(10774, "/obj/machinery/airlock_sensor", "/obj/machinery", {
	id_tag: null,
	master_tag: null,
	frequency: 1449,
	radio_connection: null,
	on: 1,
	alert: 0,
	anchored: 1,
	icon: rt.rsc("icons/obj/airlock_machines.dmi"),
	icon_state: "airlock_sensor_off",
	name: "airlock sensor",
	resistance_flags: 115,
	power_channel: 3,
});

// /obj/machinery/airlock_sensor/proc/update_icon  (code/game/machinery/airlock_control.dm:107)
rt.def("/obj/machinery/airlock_sensor/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "on"))) {
		if (truthy(rt.sv(f, "alert"))) {
			rt.setSv(f, "icon_state", "airlock_sensor_alert");
		} else {
			rt.setSv(f, "icon_state", "airlock_sensor_standby");
		}
	} else {
		rt.setSv(f, "icon_state", "airlock_sensor_off");
	}
	return f.dot;
});

// /obj/machinery/airlock_sensor/proc/attack_hand  (code/game/machinery/airlock_control.dm:114)  may sleep
rt.def("/obj/machinery/airlock_sensor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let signal: Value = null;
	f.vars = () => [user, signal];
	rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
	rt.setAt(rt.fv(f, "data", live(signal)), "tag", rt.sv(f, "master_tag"));
	rt.setAt(rt.fv(f, "data", live(signal)), "command", "cycle");
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [null, live(f.src), null, live(signal), "range", 5, "filter", rt.gl("RADIO_AIRLOCK")], rt.Args.Named);
	yield* g.call(f, P("/proc/flick"), null, ["airlock_sensor_cycle", live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/airlock_sensor/proc/process  (code/game/machinery/airlock_control.dm:124)  may sleep
rt.def("/obj/machinery/airlock_sensor/proc/process", function* process(f: Frame) {
	let signal: Value = null, air_sample: Value = null, pressure: Value = null;
	f.vars = () => [signal, air_sample, pressure];
	if (truthy(rt.sv(f, "on"))) {
		rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
		rt.setAt(rt.fv(f, "data", live(signal)), "tag", rt.sv(f, "id_tag"));
		rt.setAt(rt.fv(f, "data", live(signal)), "timestamp", rt.worldTime(f));
		air_sample = (yield* g.srcCall(f, "return_air"));
		rt.setSv(f, "alert", (rt.lt((pressure = (yield* g.call(f, P("/proc/round"), null, [(yield* g.callName(f, live(air_sample), "return_pressure", [])), 0.10000000149011612]))), 81.05999755859375) ? 1 : 0));
		rt.setAt(rt.fv(f, "data", live(signal)), "pressure", (yield* g.call(f, P("/proc/num2text"), null, [live(pressure)])));
		yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [null, live(f.src), null, live(signal), "range", 5, "filter", rt.gl("RADIO_AIRLOCK")], rt.Args.Named);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/airlock_sensor/proc/set_frequency  (code/game/machinery/airlock_control.dm:141)  may sleep
rt.def("/obj/machinery/airlock_sensor/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency"), rt.gl("RADIO_AIRLOCK")])));
	return f.dot;
}, true);

// /obj/machinery/airlock_sensor/proc/Initialize  (code/game/machinery/airlock_control.dm:146)  may sleep
rt.def("/obj/machinery/airlock_sensor/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	return f.dot;
}, true);

// /obj/machinery/airlock_sensor/proc/Destroy  (code/game/machinery/airlock_control.dm:151)  may sleep
rt.def("/obj/machinery/airlock_sensor/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
