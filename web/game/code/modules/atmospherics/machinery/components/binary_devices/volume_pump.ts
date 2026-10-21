// From code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10573, "/obj/machinery/atmospherics/components/binary/volume_pump", "/obj/machinery/atmospherics/components/binary", {
	on: 0,
	transfer_rate: 200,
	frequency: 0,
	id: null,
	radio_connection: null,
	can_unwrench: 1,
	icon_state: "volpump_map",
	name: "volumetric gas pump",
	desc: "A pump that moves gas by volume.",
});

// /obj/machinery/atmospherics/components/binary/volume_pump/proc/Destroy  (code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm:31)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/atmospherics/components/binary/volume_pump/proc/update_icon_nopipes  (code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm:38)
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "icon_state", "volpump_off");
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "on"))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	rt.setSv(f, "icon_state", fmt("volpump_＀", [$0]));
	return f.dot;
});

// /obj/machinery/atmospherics/components/binary/volume_pump/proc/process_atmos  (code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm:46)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/process_atmos", function* process_atmos(f: Frame) {
	let air1: Value = null, air2: Value = null, input_starting_pressure: Value = null, output_starting_pressure: Value = null, transfer_ratio: Value = null, removed: Value = null;
	f.vars = () => [air1, air2, input_starting_pressure, output_starting_pressure, transfer_ratio, removed];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "on"))) {
		return 0;
	}
	air1 = rt.index(rt.sv(f, "airs"), 1);
	air2 = rt.index(rt.sv(f, "airs"), 2);
	input_starting_pressure = (yield* g.callName(f, live(air1), "return_pressure", []));
	output_starting_pressure = (yield* g.callName(f, live(air2), "return_pressure", []));
	if ((rt.lt(live(input_starting_pressure), 0.009999999776482582) || rt.gt(live(output_starting_pressure), 9000))) {
		return 1;
	}
	transfer_ratio = (yield* g.call(f, P("/proc/min"), null, [1, divide(rt.sv(f, "transfer_rate"), rt.fv(f, "volume", live(air1)))]));
	removed = (yield* g.callName(f, live(air1), "remove_ratio", [live(transfer_ratio)]));
	yield* g.callName(f, live(air2), "merge", [live(removed)]);
	yield* g.srcCall(f, "update_parents");
	return 1;
}, true);

// /obj/machinery/atmospherics/components/binary/volume_pump/proc/set_frequency  (code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm:73)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	if (!truthy(rt.sv(f, "frequency"))) return f.dot;
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency")])));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/binary/volume_pump/proc/broadcast_status  (code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm:79)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/broadcast_status", function* broadcast_status(f: Frame) {
	let signal: Value = null;
	f.vars = () => [signal];
	if (!truthy(rt.sv(f, "radio_connection"))) {
		return 0;
	}
	rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
	rt.setFv(f, "source", live(signal), live(f.src));
	rt.setFv(f, "data", live(signal), rt.alist(f, ["tag", rt.sv(f, "id"), "device", "APV", "power", rt.sv(f, "on"), "transfer_rate", rt.sv(f, "transfer_rate"), "sigtype", "status"]));
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [live(f.src), live(signal)]);
	return 1;
}, true);

// /obj/machinery/atmospherics/components/binary/volume_pump/proc/ui_interact  (code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm:99)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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

// /obj/machinery/atmospherics/components/binary/volume_pump/proc/ui_data  (code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm:105)
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	f.vars = () => [data];
	rt.setAt((data = rt.list()), "on", rt.sv(f, "on"));
	rt.setAt(live(data), "rate", rt.call(f, P("/proc/round"), null, [rt.sv(f, "transfer_rate")]));
	rt.setAt(live(data), "max_rate", rt.call(f, P("/proc/round"), null, [200]));
	return live(data);
});

// /obj/machinery/atmospherics/components/binary/volume_pump/proc/atmosinit  (code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm:112)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/atmosinit", function* atmosinit(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/binary/volume_pump/proc/ui_act  (code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm:117)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/ui_act", function* ui_act(f: Frame) {
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
				if (((rate = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "transfer_rate"), rt.sv(f, "name"), fmt("New transfer rate (0-＀ L/s):", [200]), null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
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
			rt.setSv(f, "transfer_rate", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [live(rate), 200]))])));
			yield* g.srcCall(f, "investigate_log", fmt("was set to ＀ L/s by ＀", [rt.sv(f, "transfer_rate"), (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "atmos");
		}
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/atmospherics/components/binary/volume_pump/proc/receive_signal  (code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm:142)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	let old_on: Value = null, air1: Value = null;
	let $0: any;
	f.vars = () => [signal, old_on, air1, $0];
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
	if (truthy((rt.isIn(f, "set_transfer_rate", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		air1 = rt.index(rt.sv(f, "airs"), 1);
		rt.setSv(f, "transfer_rate", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "set_transfer_rate")])), rt.fv(f, "volume", live(air1))]))])));
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

// /obj/machinery/atmospherics/components/binary/volume_pump/proc/power_change  (code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm:169)
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/atmospherics/components/binary/volume_pump/proc/can_unwrench  (code/modules/atmospherics/machinery/components/binary_devices/volume_pump.dm:173)
rt.def("/obj/machinery/atmospherics/components/binary/volume_pump/proc/can_unwrench", function can_unwrench(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) return f.dot;
	if ((!truthy(rt.bitAnd(rt.sv(f, "stat"), 2)) && truthy(rt.sv(f, "on")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You cannot unwrench ＀, turn it off first!</span>", [live(f.src)])]);
	} else {
		return 1;
	}
	return f.dot;
}, false, { args: ["user"] });
