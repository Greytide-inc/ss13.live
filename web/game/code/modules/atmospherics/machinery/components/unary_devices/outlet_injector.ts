// From code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10586, "/obj/machinery/atmospherics/components/unary/outlet_injector", "/obj/machinery/atmospherics/components/unary", {
	on: 0,
	injecting: 0,
	volume_rate: 50,
	frequency: 0,
	id: null,
	radio_connection: null,
	can_unwrench: 1,
	level: 1,
	name: "air injector",
	desc: "Has a valve and pump attached to it",
	icon_state: "inje_map",
	use_power: 1,
	resistance_flags: 50,
	layer: 2.46,
});

// /obj/machinery/atmospherics/components/unary/outlet_injector/proc/Destroy  (code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:23)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/atmospherics/components/unary/outlet_injector/proc/update_icon_nopipes  (code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:30)
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "showpipe"))) {
		rt.callSrc(f, "add_overlay", [rt.callSrc(f, "getpipeimage", [rt.sv(f, "icon"), "inje_cap", rt.sv(f, "initialize_directions")])]);
	}
	if (((!truthy(rt.index(rt.sv(f, "nodes"), 1)) || !truthy(rt.sv(f, "on"))) || truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		rt.setSv(f, "icon_state", "inje_off");
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", "inje_on");
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/outlet_injector/proc/power_change  (code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:41)
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/power_change", function power_change(f: Frame) {
	let old_stat: Value = null;
	f.vars = () => [old_stat];
	old_stat = rt.sv(f, "stat");
	rt.callSuper(f, [], rt.Args.Same);
	if (isEqual(live(old_stat), rt.sv(f, "stat"))) return f.dot;
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/outlet_injector/proc/process_atmos  (code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:48)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/process_atmos", function* process_atmos(f: Frame) {
	let air_contents: Value = null, transfer_moles: Value = null, removed: Value = null;
	f.vars = () => [air_contents, transfer_moles, removed];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "injecting", 0);
	if ((!truthy(rt.sv(f, "on")) || truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		return 0;
	}
	if (rt.gt(rt.gv(f, "temperature", (air_contents = rt.index(rt.sv(f, "airs"), 1))), 0)) {
		transfer_moles = divide(multiply((yield* g.callName(f, live(air_contents), "return_pressure", [])), rt.sv(f, "volume_rate")), multiply(rt.fv(f, "temperature", live(air_contents)), 8.3100004196167));
		removed = (yield* g.callName(f, live(air_contents), "remove", [live(transfer_moles)]));
		yield* g.callName(f, rt.sv(f, "loc"), "assume_air", [live(removed)]);
		yield* g.srcCall(f, "air_update_turf");
		yield* g.srcCall(f, "update_parents");
	}
	return 1;
}, true);

// /obj/machinery/atmospherics/components/unary/outlet_injector/proc/inject  (code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:69)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/inject", function* inject(f: Frame) {
	let air_contents: Value = null, transfer_moles: Value = null, removed: Value = null;
	f.vars = () => [air_contents, transfer_moles, removed];
	if (((truthy(rt.sv(f, "on")) || truthy(rt.sv(f, "injecting"))) || truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		return 0;
	}
	air_contents = rt.index(rt.sv(f, "airs"), 1);
	rt.setSv(f, "injecting", 1);
	if (rt.gt(rt.fv(f, "temperature", live(air_contents)), 0)) {
		transfer_moles = divide(multiply((yield* g.callName(f, live(air_contents), "return_pressure", [])), rt.sv(f, "volume_rate")), multiply(rt.fv(f, "temperature", live(air_contents)), 8.3100004196167));
		removed = (yield* g.callName(f, live(air_contents), "remove", [live(transfer_moles)]));
		yield* g.callName(f, rt.sv(f, "loc"), "assume_air", [live(removed)]);
		yield* g.srcCall(f, "update_parents");
	}
	yield* g.call(f, P("/proc/flick"), null, ["inje_inject", live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/outlet_injector/proc/set_frequency  (code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:88)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	if (!truthy(rt.sv(f, "frequency"))) return f.dot;
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency")])));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/outlet_injector/proc/broadcast_status  (code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:94)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/broadcast_status", function* broadcast_status(f: Frame) {
	let signal: Value = null;
	f.vars = () => [signal];
	if (!truthy(rt.sv(f, "radio_connection"))) {
		return 0;
	}
	rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
	rt.setFv(f, "source", live(signal), live(f.src));
	rt.setFv(f, "data", live(signal), rt.alist(f, ["tag", rt.sv(f, "id"), "device", "AO", "power", rt.sv(f, "on"), "volume_rate", rt.sv(f, "volume_rate"), "sigtype", "status"]));
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [live(f.src), live(signal)]);
	return 1;
}, true);

// /obj/machinery/atmospherics/components/unary/outlet_injector/proc/atmosinit  (code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:115)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/atmosinit", function* atmosinit(f: Frame) {
	yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	yield* g.srcCall(f, "broadcast_status");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal  (code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:120)
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	let number: Value = null, air_contents: Value = null;
	f.vars = () => [number, air_contents];
	if (((!truthy(rt.index(rt.fv(f, "data", live(signal)), "tag")) || !isEqual(rt.index(rt.fv(f, "data", live(signal)), "tag"), rt.sv(f, "id"))) || !isEqual(rt.index(rt.fv(f, "data", live(signal)), "sigtype"), "command"))) {
		return 0;
	}
	if (truthy((rt.isIn(f, "power", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "on", rt.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "power")]));
	}
	if (truthy((rt.isIn(f, "power_toggle", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "inject", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.spawnTail(f, 0, "/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal: spawn at modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:130", signal, number, air_contents);
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, "set_volume_rate", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		number = rt.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "set_volume_rate")]);
		air_contents = rt.index(rt.sv(f, "airs"), 1);
		rt.setSv(f, "volume_rate", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [live(number), rt.fv(f, "volume", live(air_contents))])]));
	}
	if (truthy((rt.isIn(f, "status", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.spawnTail(f, 2, "/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal: spawn at modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:139", signal, number, air_contents);
		return live(f.dot);
	}
	rt.spawnTail(f, 2, "/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal: spawn at modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:145", signal, number, air_contents);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// a spawn(2) body of /obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal: spawn at modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:145", function* (f: Frame, signal: Value, number: Value, air_contents: Value) {
	f.vars = () => [signal, number, air_contents];
	yield* g.srcCall(f, "broadcast_status");
	return null;
});

// a spawn(2) body of /obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal: spawn at modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:139", function* (f: Frame, signal: Value, number: Value, air_contents: Value) {
	f.vars = () => [signal, number, air_contents];
	yield* g.srcCall(f, "broadcast_status");
	return null;
});

// a spawn(0) body of /obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/receive_signal: spawn at modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:130", function* (f: Frame, signal: Value, number: Value, air_contents: Value) {
	f.vars = () => [signal, number, air_contents];
	yield* g.srcCall(f, "inject");
	return null;
});

// /obj/machinery/atmospherics/components/unary/outlet_injector/proc/ui_interact  (code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:152)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "atmos_pump", rt.sv(f, "name"), 310, 115, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/outlet_injector/proc/ui_data  (code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:158)
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	f.vars = () => [data];
	rt.setAt((data = rt.list()), "on", rt.sv(f, "on"));
	rt.setAt(live(data), "rate", rt.call(f, P("/proc/round"), null, [rt.sv(f, "volume_rate")]));
	rt.setAt(live(data), "max_rate", rt.call(f, P("/proc/round"), null, [200]));
	return live(data);
});

// /obj/machinery/atmospherics/components/unary/outlet_injector/proc/ui_act  (code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:165)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/ui_act", function* ui_act(f: Frame) {
	let rate: Value = null;
	let $0: any;
	f.vars = () => [rate, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "power") {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
		if (truthy(rt.sv(f, "on"))) {
			$0 = "on";
		} else {
			$0 = "off";
		}
		yield* g.srcCall(f, "investigate_log", fmt("was turned ＀ by ＀", [$0, (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "atmos");
		f.dot = 1;
	} else if ($0 === "rate") {
		if (isEqual((rate = rt.at(live(f.args[1]), "rate")), "max")) {
			rate = 200;
			f.dot = 1;
		} else {
			if (isEqual(live(rate), "input")) {
				if (((rate = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "volume_rate"), rt.sv(f, "name"), fmt("New transfer rate (0-＀ L/s):", [200]), null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
					f.dot = 1;
				}
			} else {
				if ((yield* g.call(f, P("/proc/text2num"), null, [live(rate)])) !== null) {
					rate = (yield* g.call(f, P("/proc/text2num"), null, [live(rate)]));
					f.dot = 1;
				}
			}
		}
		if (truthy(live(f.dot))) {
			rt.setSv(f, "volume_rate", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [live(rate), 200]))])));
			yield* g.srcCall(f, "investigate_log", fmt("was set to ＀ L/s by ＀", [rt.sv(f, "volume_rate"), (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "atmos");
		}
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "broadcast_status");
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/atmospherics/components/unary/outlet_injector/proc/can_unwrench  (code/modules/atmospherics/machinery/components/unary_devices/outlet_injector.dm:192)
rt.def("/obj/machinery/atmospherics/components/unary/outlet_injector/proc/can_unwrench", function can_unwrench(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) return f.dot;
	if ((!truthy(rt.bitOr(rt.bitAnd(rt.sv(f, "stat"), 2), 1)) && truthy(rt.sv(f, "on")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You cannot unwrench ＀, turn it off first!</span>", [live(f.src)])]);
	} else {
		return 1;
	}
	return f.dot;
}, false, { args: ["user"] });
