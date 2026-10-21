// From code/modules/atmospherics/machinery/components/binary_devices/pump.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10568, "/obj/machinery/atmospherics/components/binary/pump", "/obj/machinery/atmospherics/components/binary", {
	on: 0,
	target_pressure: 101.325,
	frequency: 0,
	id: null,
	radio_connection: null,
	can_unwrench: 1,
	icon_state: "pump_map",
	name: "gas pump",
	desc: "A pump that moves gas by pressure.",
});

// /obj/machinery/atmospherics/components/binary/pump/proc/Destroy  (code/modules/atmospherics/machinery/components/binary_devices/pump.dm:34)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	if (truthy(rt.sv(f, "radio_connection"))) {
		rt.setSv(f, "radio_connection", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/atmospherics/components/binary/pump/proc/update_icon_nopipes  (code/modules/atmospherics/machinery/components/binary_devices/pump.dm:40)
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "icon_state", "pump_off");
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "on"))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	rt.setSv(f, "icon_state", fmt("pump_＀", [$0]));
	return f.dot;
});

// /obj/machinery/atmospherics/components/binary/pump/proc/process_atmos  (code/modules/atmospherics/machinery/components/binary_devices/pump.dm:48)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/process_atmos", function* process_atmos(f: Frame) {
	let air1: Value = null, air2: Value = null, output_starting_pressure: Value = null, pressure_delta: Value = null, transfer_moles: Value = null, removed: Value = null;
	f.vars = () => [air1, air2, output_starting_pressure, pressure_delta, transfer_moles, removed];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "on"))) {
		return 0;
	}
	air1 = rt.index(rt.sv(f, "airs"), 1);
	air2 = rt.index(rt.sv(f, "airs"), 2);
	output_starting_pressure = (yield* g.callName(f, live(air2), "return_pressure", []));
	if (rt.lt(subtract(rt.sv(f, "target_pressure"), live(output_starting_pressure)), 0.009999999776482582)) {
		return 1;
	}
	if ((rt.gt((yield* g.callName(f, live(air1), "total_moles", [])), 0) && rt.gt(rt.fv(f, "temperature", live(air1)), 0))) {
		pressure_delta = subtract(rt.sv(f, "target_pressure"), live(output_starting_pressure));
		transfer_moles = divide(multiply(live(pressure_delta), rt.fv(f, "volume", live(air2))), multiply(rt.fv(f, "temperature", live(air1)), 8.3100004196167));
		removed = (yield* g.callName(f, live(air1), "remove", [live(transfer_moles)]));
		yield* g.callName(f, live(air2), "merge", [live(removed)]);
		yield* g.srcCall(f, "update_parents");
	}
	return 1;
}, true);

// /obj/machinery/atmospherics/components/binary/pump/proc/set_frequency  (code/modules/atmospherics/machinery/components/binary_devices/pump.dm:77)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	if (!truthy(rt.sv(f, "frequency"))) return f.dot;
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [null, live(f.src), null, rt.sv(f, "frequency"), "filter", rt.gl("RADIO_ATMOSIA")], rt.Args.Named)));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/binary/pump/proc/broadcast_status  (code/modules/atmospherics/machinery/components/binary_devices/pump.dm:83)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/broadcast_status", function* broadcast_status(f: Frame) {
	let signal: Value = null;
	f.vars = () => [signal];
	if (!truthy(rt.sv(f, "radio_connection"))) {
		return 0;
	}
	rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
	rt.setFv(f, "source", live(signal), live(f.src));
	rt.setFv(f, "data", live(signal), rt.alist(f, ["tag", rt.sv(f, "id"), "device", "AGP", "power", rt.sv(f, "on"), "target_output", rt.sv(f, "target_pressure"), "sigtype", "status"]));
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [null, live(f.src), null, live(signal), "filter", rt.gl("RADIO_ATMOSIA")], rt.Args.Named);
	return 1;
}, true);

// /obj/machinery/atmospherics/components/binary/pump/proc/ui_interact  (code/modules/atmospherics/machinery/components/binary_devices/pump.dm:104)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "atmos_pump", rt.sv(f, "name"), 335, 115, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/binary/pump/proc/ui_data  (code/modules/atmospherics/machinery/components/binary_devices/pump.dm:110)
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	f.vars = () => [data];
	rt.setAt((data = rt.list()), "on", rt.sv(f, "on"));
	rt.setAt(live(data), "pressure", rt.call(f, P("/proc/round"), null, [rt.sv(f, "target_pressure")]));
	rt.setAt(live(data), "max_pressure", rt.call(f, P("/proc/round"), null, [4500]));
	return live(data);
});

// /obj/machinery/atmospherics/components/binary/pump/proc/ui_act  (code/modules/atmospherics/machinery/components/binary_devices/pump.dm:117)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/ui_act", function* ui_act(f: Frame) {
	let pressure: Value = null;
	let $0: any;
	f.vars = () => [pressure, $0];
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
	} else if ($0 === "pressure") {
		if (isEqual((pressure = rt.at(live(f.args[1]), "pressure")), "max")) {
			pressure = 4500;
			f.dot = 1;
		} else {
			if (isEqual(live(pressure), "input")) {
				if (((pressure = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "target_pressure"), rt.sv(f, "name"), fmt("New output pressure (0-＀ kPa):", [4500]), null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
					f.dot = 1;
				}
			} else {
				if ((yield* g.call(f, P("/proc/text2num"), null, [live(pressure)])) !== null) {
					pressure = (yield* g.call(f, P("/proc/text2num"), null, [live(pressure)]));
					f.dot = 1;
				}
			}
		}
		if (truthy(live(f.dot))) {
			rt.setSv(f, "target_pressure", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [live(pressure), 4500]))])));
			yield* g.srcCall(f, "investigate_log", fmt("was set to ＀ kPa by ＀", [rt.sv(f, "target_pressure"), (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "atmos");
		}
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/atmospherics/components/binary/pump/proc/atmosinit  (code/modules/atmospherics/machinery/components/binary_devices/pump.dm:142)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/atmosinit", function* atmosinit(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "frequency"))) return f.dot;
	yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/binary/pump/proc/receive_signal  (code/modules/atmospherics/machinery/components/binary_devices/pump.dm:147)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	let old_on: Value = null;
	let $0: any;
	f.vars = () => [signal, old_on, $0];
	if (((!truthy(rt.index(rt.fv(f, "data", live(signal)), "tag")) || !isEqual(rt.index(rt.fv(f, "data", live(signal)), "tag"), rt.sv(f, "id"))) || !isEqual(rt.index(rt.fv(f, "data", live(signal)), "sigtype"), "command"))) {
		return 0;
	}
	old_on = rt.sv(f, "on");
	if (truthy((rt.isIn(f, "power", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "on", (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "power")])));
	}
	if (truthy((rt.isIn(f, "power_toggle", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "set_output_pressure", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "target_pressure", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "set_output_pressure")])), 5066.25]))])));
	}
	if (!isEqual(rt.sv(f, "on"), live(old_on))) {
		if (truthy(rt.sv(f, "on"))) {
			$0 = "on";
		} else {
			$0 = "off";
		}
		yield* g.srcCall(f, "investigate_log", fmt("was turned ＀ by a remote signal", [$0]), "atmos");
	}
	if (truthy((rt.isIn(f, "status", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		yield* g.srcCall(f, "broadcast_status");
		return live(f.dot);
	}
	yield* g.srcCall(f, "broadcast_status");
	yield* g.srcCall(f, "update_icon");
	return live(f.dot);
}, true);

// /obj/machinery/atmospherics/components/binary/pump/proc/power_change  (code/modules/atmospherics/machinery/components/binary_devices/pump.dm:173)
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/atmospherics/components/binary/pump/proc/can_unwrench  (code/modules/atmospherics/machinery/components/binary_devices/pump.dm:177)
rt.def("/obj/machinery/atmospherics/components/binary/pump/proc/can_unwrench", function can_unwrench(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) return f.dot;
	if ((!truthy(rt.bitAnd(rt.sv(f, "stat"), 2)) && truthy(rt.sv(f, "on")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You cannot unwrench ＀, turn it off first!</span>", [live(f.src)])]);
	} else {
		return 1;
	}
	return f.dot;
}, false, { args: ["user"] });
