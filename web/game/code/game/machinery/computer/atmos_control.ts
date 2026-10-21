// From code/game/machinery/computer/atmos_control.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10858, "/obj/machinery/air_sensor", "/obj/machinery", {
	on: 1,
	id_tag: null,
	frequency: 1441,
	radio_connection: null,
	anchored: 1,
	name: "gas sensor",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "gsensor1",
});

// /obj/machinery/air_sensor/proc/update_icon  (code/game/machinery/computer/atmos_control.dm:18)
rt.def("/obj/machinery/air_sensor/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("gsensor＀", [rt.sv(f, "on")]));
	return f.dot;
});

// /obj/machinery/air_sensor/proc/process_atmos  (code/game/machinery/computer/atmos_control.dm:22)  may sleep
rt.def("/obj/machinery/air_sensor/proc/process_atmos", function* process_atmos(f: Frame) {
	let signal: Value = null, air_sample: Value = null, total_moles: Value = null, gas_id: Value = null, gas_name: Value = null;
	let $e: any;
	f.vars = () => [signal, air_sample, total_moles, gas_id, gas_name, $e];
	if (!truthy(rt.sv(f, "on"))) return f.dot;
	signal = (yield* g.new_(f, T("/datum/signal"), []));
	air_sample = (yield* g.srcCall(f, "return_air"));
	rt.setFv(f, "transmission_method", live(signal), 1);
	rt.setFv(f, "data", live(signal), rt.alist(f, ["sigtype", "status", "id_tag", rt.sv(f, "id_tag"), "timestamp", rt.worldTime(f), "pressure", (yield* g.callName(f, live(air_sample), "return_pressure", [])), "temperature", rt.fv(f, "temperature", live(air_sample)), "gases", rt.list()]));
	if (truthy((total_moles = (yield* g.callName(f, live(air_sample), "total_moles", []))))) {
		gas_id = null;
		rt.forList(f, 0, rt.fv(f, "gases", live(air_sample)));
		while (($e = rt.next(f, 0)) !== undefined) {
			gas_id = $e;
			gas_name = rt.index(rt.index(rt.index(rt.fv(f, "gases", live(air_sample)), live(gas_id)), 3), 2);
			rt.setAt(rt.index(rt.fv(f, "data", live(signal)), "gases"), live(gas_name), multiply(divide(rt.index(rt.index(rt.fv(f, "gases", live(air_sample)), live(gas_id)), 1), live(total_moles)), 100));
		}
		rt.endFor(f, 0);
	}
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [null, live(f.src), null, live(signal), "filter", rt.gl("RADIO_ATMOSIA")], rt.Args.Named);
	return f.dot;
}, true);

// /obj/machinery/air_sensor/proc/set_frequency  (code/game/machinery/computer/atmos_control.dm:44)  may sleep
rt.def("/obj/machinery/air_sensor/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency"), rt.gl("RADIO_ATMOSIA")])));
	return f.dot;
}, true);

// /obj/machinery/air_sensor/proc/Initialize  (code/game/machinery/computer/atmos_control.dm:49)  may sleep
rt.def("/obj/machinery/air_sensor/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), add);
	yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	return f.dot;
}, true);

// /obj/machinery/air_sensor/proc/Destroy  (code/game/machinery/computer/atmos_control.dm:54)  may sleep
rt.def("/obj/machinery/air_sensor/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), subtract));
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(10368, "/obj/machinery/computer/atmos_control", "/obj/machinery/computer", {
	frequency: 1441,
	sensors: null,
	sensor_information: null,
	radio_connection: null,
	light_color: "#7DE1E1",
	name: "Atmospherics Monitoring",
	desc: "Used to monitor the station's atmospherics sensors.",
	icon_screen: "tank",
	icon_keyboard: "atmos_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/atmos_control"),
});

// /obj/machinery/computer/atmos_control/proc/<init>  (code/game/machinery/computer/atmos_control.dm:71)
rt.def("/obj/machinery/computer/atmos_control/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "sensors", rt.alist(f, ["n2_sensor", "Nitrogen Tank", "o2_sensor", "Oxygen Tank", "co2_sensor", "Carbon Dioxide Tank", "tox_sensor", "Plasma Tank", "n2o_sensor", "Nitrous Oxide Tank", "air_sensor", "Mixed Air Tank", "mix_sensor", "Mix Tank", "distro_meter", "Distribution Loop", "waste_meter", "Waste Loop"]));
	$0 = $0;
	rt.setSv(f, "sensor_information", rt.list());
	return f.dot;
});

// /obj/machinery/computer/atmos_control/proc/Initialize  (code/game/machinery/computer/atmos_control.dm:88)  may sleep
rt.def("/obj/machinery/computer/atmos_control/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	return f.dot;
}, true);

// /obj/machinery/computer/atmos_control/proc/Destroy  (code/game/machinery/computer/atmos_control.dm:93)  may sleep
rt.def("/obj/machinery/computer/atmos_control/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/atmos_control/proc/ui_interact  (code/game/machinery/computer/atmos_control.dm:98)  may sleep
rt.def("/obj/machinery/computer/atmos_control/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "atmos_control", rt.sv(f, "name"), 400, 925, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/atmos_control/proc/ui_data  (code/game/machinery/computer/atmos_control.dm:104)
rt.def("/obj/machinery/computer/atmos_control/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, id_tag: Value = null, long_name: Value = null, info: Value = null;
	let $e: any;
	f.vars = () => [data, id_tag, long_name, info, $e];
	rt.setAt((data = rt.list()), "sensors", rt.list());
	id_tag = null;
	rt.forList(f, 0, rt.sv(f, "sensors"));
	while (($e = rt.next(f, 0)) !== undefined) {
		id_tag = $e;
		long_name = rt.index(rt.sv(f, "sensors"), live(id_tag));
		if (!truthy((info = rt.index(rt.sv(f, "sensor_information"), live(id_tag))))) {
			continue;
		}
		rt.modAt(live(data), "sensors", rt.list(rt.alist(f, ["id_tag", live(id_tag), "long_name", rt.call(f, P("/proc/sanitize"), null, [live(long_name)]), "pressure", rt.at(live(info), "pressure"), "temperature", rt.at(live(info), "temperature"), "gases", rt.at(live(info), "gases")])), add);
	}
	rt.endFor(f, 0);
	return live(data);
});

// /obj/machinery/computer/atmos_control/proc/receive_signal  (code/game/machinery/computer/atmos_control.dm:122)
rt.def("/obj/machinery/computer/atmos_control/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	let id_tag: Value = null;
	f.vars = () => [id_tag];
	if ((!truthy(live(signal)) || truthy(rt.fv(f, "encryption", live(signal))))) {
		return live(f.dot);
	}
	if ((!truthy((id_tag = rt.index(rt.fv(f, "data", live(signal)), "id_tag"))) || !truthy(rt.callName(f, rt.sv(f, "sensors"), "Find", [live(id_tag)])))) {
		return live(f.dot);
	}
	rt.setAt(rt.sv(f, "sensor_information"), live(id_tag), rt.fv(f, "data", live(signal)));
	return f.dot;
});

// /obj/machinery/computer/atmos_control/proc/set_frequency  (code/game/machinery/computer/atmos_control.dm:132)  may sleep
rt.def("/obj/machinery/computer/atmos_control/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency"), rt.gl("RADIO_ATMOSIA")])));
	return f.dot;
}, true);

rt.type(10369, "/obj/machinery/computer/atmos_control/tank", "/obj/machinery/computer/atmos_control", {
	input_tag: null,
	output_tag: null,
	input_info: null,
	output_info: null,
	frequency: 1441,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/atmos_control/tank"),
});

// /obj/machinery/computer/atmos_control/tank/proc/reconnect  (code/game/machinery/computer/atmos_control.dm:151)  may sleep
rt.def("/obj/machinery/computer/atmos_control/tank/proc/reconnect", function* reconnect(f: Frame, user: Value) {
	let IO: Value = null, freq: Value = null, devices: Value = null, U: Value = null, text: Value = null, S: Value = null, new_devices: Value = null, U_5: Value = null, text_6: Value = null, U_4: Value = null;
	let $e: any;
	f.vars = () => [user, IO, freq, devices, U, text, S, new_devices, U_5, text_6, U_4, $e];
	IO = rt.list();
	freq = (yield* g.callName(f, rt.gl("SSradio"), "return_frequency", [1441]));
	devices = rt.index(rt.fv(f, "devices", live(freq)), "_default");
	U = null;
	rt.forList(f, 0, live(devices), T("/obj/machinery/atmospherics/components/unary/vent_pump"));
	while (($e = rt.next(f, 0)) !== undefined) {
		U = $e;
		(IO = rt.modify(live(IO), rt.index((text = (yield* g.call(f, P("/proc/splittext"), null, [rt.fv(f, "id_tag", live(U)), "_"]))), 1), rt.bitOr));
	}
	rt.endFor(f, 0);
	U = null;
	rt.forList(f, 0, live(devices), T("/obj/machinery/atmospherics/components/unary/outlet_injector"));
	while (($e = rt.next(f, 0)) !== undefined) {
		U = $e;
		(IO = rt.modify(live(IO), rt.index((text = (yield* g.call(f, P("/proc/splittext"), null, [rt.fv(f, "id", live(U)), "_"]))), 1), rt.bitOr));
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(IO)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='alert'>No machinery detected.</span>"]);
	}
	S = (yield* g.op(f, "Prompt", [0], [null, rt.index(live(IO), 1), "Selection", "Select the device set: ", live(IO)]));
	if (truthy(live(f.src))) {
		rt.setFv(f, "input_tag", live(f.src), fmt("＀_in", [live(S)]));
		rt.setFv(f, "output_tag", live(f.src), fmt("＀_out", [live(S)]));
		rt.setSv(f, "name", fmt("＀ Supply Control", [(yield* g.call(f, P("/proc/uppertext"), null, [live(S)]))]));
		new_devices = rt.index(rt.fv(f, "devices", live(freq)), "4");
		U_5 = null;
		rt.forList(f, 0, live(new_devices), T("/obj/machinery/air_sensor"));
		while (($e = rt.next(f, 0)) !== undefined) {
			U_5 = $e;
			if (isEqual(rt.index((text_6 = (yield* g.call(f, P("/proc/splittext"), null, [rt.fv(f, "id_tag", live(U_5)), "_"]))), 1), live(S))) {
				rt.setSv(f, "sensors", rt.alist(f, [fmt("＀_sensor", [live(S)]), "Tank"]));
				break;
			}
		}
		rt.endFor(f, 0);
	}
	U_4 = null;
	rt.forList(f, 0, live(devices), T("/obj/machinery/atmospherics/components/unary/outlet_injector"));
	while (($e = rt.next(f, 0)) !== undefined) {
		U_4 = $e;
		yield* g.callName(f, live(U_4), "broadcast_status", []);
	}
	rt.endFor(f, 0);
	U_4 = null;
	rt.forList(f, 0, live(devices), T("/obj/machinery/atmospherics/components/unary/vent_pump"));
	while (($e = rt.next(f, 0)) !== undefined) {
		U_4 = $e;
		yield* g.callName(f, live(U_4), "broadcast_status", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/computer/atmos_control/tank/proc/ui_interact  (code/game/machinery/computer/atmos_control.dm:181)  may sleep
rt.def("/obj/machinery/computer/atmos_control/tank/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "atmos_control", rt.sv(f, "name"), 500, 305, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/atmos_control/tank/proc/ui_data  (code/game/machinery/computer/atmos_control.dm:187)
rt.def("/obj/machinery/computer/atmos_control/tank/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [data, $0, $1, $2];
	rt.setAt((data = rt.callSuper(f, [], rt.Args.Same)), "tank", 1);
	$0 = live(data);
	$1 = "inputting";
	if (truthy(rt.sv(f, "input_info"))) {
		$2 = rt.at(rt.sv(f, "input_info"), "power");
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "inputRate";
	if (truthy(rt.sv(f, "input_info"))) {
		$2 = rt.at(rt.sv(f, "input_info"), "volume_rate");
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "outputting";
	if (truthy(rt.sv(f, "output_info"))) {
		$2 = rt.at(rt.sv(f, "output_info"), "power");
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "outputPressure";
	if (truthy(rt.sv(f, "output_info"))) {
		$2 = rt.at(rt.sv(f, "output_info"), "internal");
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	return live(data);
}, false, { args: ["user"] });

// /obj/machinery/computer/atmos_control/tank/proc/ui_act  (code/game/machinery/computer/atmos_control.dm:197)  may sleep
rt.def("/obj/machinery/computer/atmos_control/tank/proc/ui_act", function* ui_act(f: Frame) {
	let signal: Value = null, target: Value = null;
	let $0: any, $1: any;
	f.vars = () => [signal, target, $0, $1];
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || !truthy(rt.sv(f, "radio_connection")))) {
		return live(f.dot);
	}
	rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
	rt.setFv(f, "source", live(signal), live(f.src));
	rt.setFv(f, "data", live(signal), rt.alist(f, ["sigtype", "command"]));
	$0 = live(f.args[0]);
	if ($0 === "reconnect") {
		yield* g.srcCall(f, "reconnect", live(f.usr));
		f.dot = 1;
	} else if ($0 === "input") {
		rt.modField(f, live(signal), "data", rt.alist(f, ["tag", rt.sv(f, "input_tag"), "power_toggle", 1]), add);
		f.dot = 1;
	} else if ($0 === "output") {
		rt.modField(f, live(signal), "data", rt.alist(f, ["tag", rt.sv(f, "output_tag"), "power_toggle", 1]), add);
		f.dot = 1;
	} else if ($0 === "pressure") {
		$0 = null;
		if (truthy(rt.sv(f, "output_info"))) {
			$1 = rt.at(rt.sv(f, "output_info"), "internal");
		} else {
			$1 = 0;
		}
		if (((target = (yield* g.op(f, "Prompt", [33], [$0, $1, rt.sv(f, "name"), "New target pressure:", null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
			target = (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [live(target), 5066.25]))]));
			rt.modField(f, live(signal), "data", rt.alist(f, ["tag", rt.sv(f, "output_tag"), "set_internal_pressure", live(target)]), add);
			f.dot = 1;
		}
	}
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [null, live(f.src), null, live(signal), "filter", rt.gl("RADIO_ATMOSIA")], rt.Args.Named);
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/computer/atmos_control/tank/proc/receive_signal  (code/game/machinery/computer/atmos_control.dm:222)
rt.def("/obj/machinery/computer/atmos_control/tank/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	let id_tag: Value = null;
	f.vars = () => [id_tag];
	if ((!truthy(live(signal)) || truthy(rt.fv(f, "encryption", live(signal))))) {
		return live(f.dot);
	}
	id_tag = rt.index(rt.fv(f, "data", live(signal)), "tag");
	if (isEqual(rt.sv(f, "input_tag"), live(id_tag))) {
		rt.setSv(f, "input_info", rt.fv(f, "data", live(signal)));
	} else {
		if (isEqual(rt.sv(f, "output_tag"), live(id_tag))) {
			rt.setSv(f, "output_info", rt.fv(f, "data", live(signal)));
		} else {
			rt.callSuper(f, [live(signal)]);
		}
	}
	return f.dot;
});
