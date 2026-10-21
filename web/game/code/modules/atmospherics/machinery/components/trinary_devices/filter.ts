// From code/modules/atmospherics/machinery/components/trinary_devices/filter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10576, "/obj/machinery/atmospherics/components/trinary/filter", "/obj/machinery/atmospherics/components/trinary", {
	on: 0,
	target_pressure: 101.325,
	filter_type: "",
	frequency: 0,
	radio_connection: null,
	can_unwrench: 1,
	name: "gas filter",
	icon_state: "filter_off",
	density: 0,
});

// /obj/machinery/atmospherics/components/trinary/filter/proc/set_frequency  (code/modules/atmospherics/machinery/components/trinary_devices/filter.dm:25)  may sleep
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	if (!truthy(rt.sv(f, "frequency"))) return f.dot;
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency"), rt.gl("RADIO_ATMOSIA")])));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/trinary/filter/proc/Destroy  (code/modules/atmospherics/machinery/components/trinary_devices/filter.dm:32)  may sleep
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/atmospherics/components/trinary/filter/proc/update_icon  (code/modules/atmospherics/machinery/components/trinary_devices/filter.dm:36)
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/update_icon", function update_icon(f: Frame) {
	let direction: Value = null, node: Value = null;
	let $e: any;
	f.vars = () => [direction, node, $e];
	rt.callSrc(f, "cut_overlays", []);
	direction = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (truthy(rt.bitAnd(live(direction), rt.sv(f, "initialize_directions")))) {
			if (truthy((node = rt.callSrc(f, "findConnecting", [live(direction)])))) {
				rt.callSrc(f, "add_overlay", [rt.callSrc(f, "getpipeimage", [rt.rsc("icons/obj/atmospherics/components/trinary_devices.dmi"), "cap", live(direction), rt.fv(f, "pipe_color", live(node))])]);
				continue;
			}
			rt.callSrc(f, "add_overlay", [rt.callSrc(f, "getpipeimage", [rt.rsc("icons/obj/atmospherics/components/trinary_devices.dmi"), "cap", live(direction)])]);
		}
	}
	rt.endFor(f, 0);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/machinery/atmospherics/components/trinary/filter/proc/update_icon_nopipes  (code/modules/atmospherics/machinery/components/trinary_devices/filter.dm:48)
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (((((!truthy(rt.bitAnd(rt.sv(f, "stat"), 2)) && truthy(rt.sv(f, "on"))) && truthy(rt.index(rt.sv(f, "nodes"), 1))) && truthy(rt.index(rt.sv(f, "nodes"), 2))) && truthy(rt.index(rt.sv(f, "nodes"), 3)))) {
		if (truthy(rt.sv(f, "flipped"))) {
			$0 = "_f";
		} else {
			$0 = "";
		}
		rt.setSv(f, "icon_state", fmt("filter_on＀", [$0]));
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "flipped"))) {
		$0 = "_f";
	} else {
		$0 = "";
	}
	rt.setSv(f, "icon_state", fmt("filter_off＀", [$0]));
	return f.dot;
});

// /obj/machinery/atmospherics/components/trinary/filter/proc/power_change  (code/modules/atmospherics/machinery/components/trinary_devices/filter.dm:55)
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/power_change", function power_change(f: Frame) {
	let old_stat: Value = null;
	f.vars = () => [old_stat];
	old_stat = rt.sv(f, "stat");
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "on", 0);
	}
	if (isEqual(live(old_stat), rt.sv(f, "stat"))) return f.dot;
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/atmospherics/components/trinary/filter/proc/process_atmos  (code/modules/atmospherics/machinery/components/trinary_devices/filter.dm:63)  may sleep
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/process_atmos", function* process_atmos(f: Frame) {
	let air1: Value = null, air2: Value = null, air3: Value = null, output_starting_pressure: Value = null, pressure_delta: Value = null, transfer_moles: Value = null, removed: Value = null, filtering: Value = null, filtered_out: Value = null;
	let $0: any;
	f.vars = () => [air1, air2, air3, output_starting_pressure, pressure_delta, transfer_moles, removed, filtering, filtered_out, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "on"))) {
		return 0;
	}
	if (!((truthy(rt.index(rt.sv(f, "nodes"), 1)) && truthy(rt.index(rt.sv(f, "nodes"), 2))) && truthy(rt.index(rt.sv(f, "nodes"), 3)))) {
		return 0;
	}
	air1 = rt.index(rt.sv(f, "airs"), 1);
	air2 = rt.index(rt.sv(f, "airs"), 2);
	air3 = rt.index(rt.sv(f, "airs"), 3);
	if (rt.ge((output_starting_pressure = (yield* g.callName(f, live(air3), "return_pressure", []))), rt.sv(f, "target_pressure"))) {
		return 1;
	}
	pressure_delta = subtract(rt.sv(f, "target_pressure"), live(output_starting_pressure));
	transfer_moles = null;
	if (rt.gt(rt.fv(f, "temperature", live(air1)), 0)) {
		transfer_moles = divide(multiply(live(pressure_delta), rt.fv(f, "volume", live(air3))), multiply(rt.fv(f, "temperature", live(air1)), 8.3100004196167));
	}
	if (rt.gt(live(transfer_moles), 0)) {
		if (!truthy((removed = (yield* g.callName(f, live(air1), "remove", [live(transfer_moles)]))))) {
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "filter_type"))) {
			$0 = 1;
		} else {
			$0 = 0;
		}
		if ((truthy((filtering = $0)) && !truthy((yield* g.call(f, P("/proc/istext"), null, [rt.sv(f, "filter_type")]))))) {
			yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("Wrong gas ID in ＀'s filter_type var. filter_type == ＀", [live(f.src), rt.sv(f, "filter_type")]), "code/modules/atmospherics/machinery/components/trinary_devices/filter.dm", 98, live(f.src), live(f.usr)])]);
			filtering = 0;
		}
		if ((truthy(live(filtering)) && truthy(rt.index(rt.fv(f, "gases", live(removed)), rt.sv(f, "filter_type"))))) {
			rt.setFv(f, "temperature", (filtered_out = (yield* g.new_(f, T("/datum/gas_mixture"), []))), rt.fv(f, "temperature", live(removed)));
			yield* g.callName(f, live(filtered_out), "assert_gas", [rt.sv(f, "filter_type")]);
			rt.setAt(rt.index(rt.fv(f, "gases", live(filtered_out)), rt.sv(f, "filter_type")), 1, rt.index(rt.index(rt.fv(f, "gases", live(removed)), rt.sv(f, "filter_type")), 1));
			rt.setAt(rt.index(rt.fv(f, "gases", live(removed)), rt.sv(f, "filter_type")), 1, 0);
			yield* g.callName(f, live(removed), "garbage_collect", []);
			yield* g.callName(f, live(air2), "merge", [live(filtered_out)]);
		}
		yield* g.callName(f, live(air3), "merge", [live(removed)]);
	}
	yield* g.srcCall(f, "update_parents");
	return 1;
}, true);

// /obj/machinery/atmospherics/components/trinary/filter/proc/atmosinit  (code/modules/atmospherics/machinery/components/trinary_devices/filter.dm:120)  may sleep
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/atmosinit", function* atmosinit(f: Frame) {
	yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/atmospherics/components/trinary/filter/proc/ui_interact  (code/modules/atmospherics/machinery/components/trinary_devices/filter.dm:125)  may sleep
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "atmos_filter", rt.sv(f, "name"), 475, 155, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/trinary/filter/proc/ui_data  (code/modules/atmospherics/machinery/components/trinary_devices/filter.dm:131)
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	f.vars = () => [data];
	rt.setAt((data = rt.list()), "on", rt.sv(f, "on"));
	rt.setAt(live(data), "pressure", rt.call(f, P("/proc/round"), null, [rt.sv(f, "target_pressure")]));
	rt.setAt(live(data), "max_pressure", rt.call(f, P("/proc/round"), null, [4500]));
	rt.setAt(live(data), "filter_type", rt.sv(f, "filter_type"));
	return live(data);
});

// /obj/machinery/atmospherics/components/trinary/filter/proc/ui_act  (code/modules/atmospherics/machinery/components/trinary_devices/filter.dm:139)  may sleep
rt.def("/obj/machinery/atmospherics/components/trinary/filter/proc/ui_act", function* ui_act(f: Frame) {
	let pressure: Value = null, filter_name: Value = null, gas: Value = null;
	let $0: any;
	f.vars = () => [pressure, filter_name, gas, $0];
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
	} else if ($0 === "filter") {
		rt.setSv(f, "filter_type", "");
		filter_name = "nothing";
		if (truthy((rt.isIn(f, (gas = rt.at(live(f.args[1]), "mode")), rt.gl("meta_gas_info")) ? 1 : 0))) {
			rt.setSv(f, "filter_type", live(gas));
			filter_name = rt.index(rt.index(rt.gl("meta_gas_info"), live(gas)), 2);
		}
		yield* g.srcCall(f, "investigate_log", fmt("was set to filter ＀ by ＀", [live(filter_name), (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "atmos");
		f.dot = 1;
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });
