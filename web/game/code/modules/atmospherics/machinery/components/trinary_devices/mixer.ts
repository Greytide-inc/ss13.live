// From code/modules/atmospherics/machinery/components/trinary_devices/mixer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10580, "/obj/machinery/atmospherics/components/trinary/mixer", "/obj/machinery/atmospherics/components/trinary", {
	on: 0,
	target_pressure: 101.325,
	node1_concentration: 0.5,
	node2_concentration: 0.5,
	can_unwrench: 1,
	icon_state: "mixer_off",
	density: 0,
	name: "gas mixer",
});

// /obj/machinery/atmospherics/components/trinary/mixer/proc/update_icon  (code/modules/atmospherics/machinery/components/trinary_devices/mixer.dm:21)
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/update_icon", function update_icon(f: Frame) {
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
	return rt.callSuper(f, [], rt.Args.Same);
});

// /obj/machinery/atmospherics/components/trinary/mixer/proc/update_icon_nopipes  (code/modules/atmospherics/machinery/components/trinary_devices/mixer.dm:32)
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (((((!truthy(rt.bitAnd(rt.sv(f, "stat"), 2)) && truthy(rt.sv(f, "on"))) && truthy(rt.index(rt.sv(f, "nodes"), 1))) && truthy(rt.index(rt.sv(f, "nodes"), 2))) && truthy(rt.index(rt.sv(f, "nodes"), 3)))) {
		if (truthy(rt.sv(f, "flipped"))) {
			$0 = "_f";
		} else {
			$0 = "";
		}
		rt.setSv(f, "icon_state", fmt("mixer_on＀", [$0]));
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "flipped"))) {
		$0 = "_f";
	} else {
		$0 = "";
	}
	rt.setSv(f, "icon_state", fmt("mixer_off＀", [$0]));
	return f.dot;
});

// /obj/machinery/atmospherics/components/trinary/mixer/proc/power_change  (code/modules/atmospherics/machinery/components/trinary_devices/mixer.dm:39)
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/power_change", function power_change(f: Frame) {
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

// /obj/machinery/atmospherics/components/trinary/mixer/proc/New  (code/modules/atmospherics/machinery/components/trinary_devices/mixer.dm:47)  may sleep
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/New", function* New(f: Frame) {
	let air3: Value = null;
	f.vars = () => [air3];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "volume", (air3 = rt.index(rt.sv(f, "airs"), 3)), 300);
	rt.setAt(rt.sv(f, "airs"), 3, live(air3));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/trinary/mixer/proc/process_atmos  (code/modules/atmospherics/machinery/components/trinary_devices/mixer.dm:53)  may sleep
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/process_atmos", function* process_atmos(f: Frame) {
	let air1: Value = null, air2: Value = null, air3: Value = null, output_starting_pressure: Value = null, pressure_delta: Value = null, transfer_moles1: Value = null, transfer_moles2: Value = null, air1_moles: Value = null, air2_moles: Value = null, ratio: Value = null, removed1: Value = null, removed2: Value = null, parent1: Value = null, parent2: Value = null, parent3: Value = null;
	f.vars = () => [air1, air2, air3, output_starting_pressure, pressure_delta, transfer_moles1, transfer_moles2, air1_moles, air2_moles, ratio, removed1, removed2, parent1, parent2, parent3];
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
	transfer_moles1 = 0;
	transfer_moles2 = 0;
	if (rt.gt(rt.fv(f, "temperature", live(air1)), 0)) {
		transfer_moles1 = divide(multiply(multiply(rt.sv(f, "node1_concentration"), live(pressure_delta)), rt.fv(f, "volume", live(air3))), multiply(rt.fv(f, "temperature", live(air1)), 8.3100004196167));
	}
	if (rt.gt(rt.fv(f, "temperature", live(air2)), 0)) {
		transfer_moles2 = divide(multiply(multiply(rt.sv(f, "node2_concentration"), live(pressure_delta)), rt.fv(f, "volume", live(air3))), multiply(rt.fv(f, "temperature", live(air2)), 8.3100004196167));
	}
	air1_moles = (yield* g.callName(f, live(air1), "total_moles", []));
	air2_moles = (yield* g.callName(f, live(air2), "total_moles", []));
	if ((rt.lt(live(air1_moles), live(transfer_moles1)) || rt.lt(live(air2_moles), live(transfer_moles2)))) {
		ratio = 0;
		if ((rt.gt(live(transfer_moles1), 0) && rt.gt(live(transfer_moles2), 0))) {
			ratio = (yield* g.call(f, P("/proc/min"), null, [divide(live(air1_moles), live(transfer_moles1)), divide(live(air2_moles), live(transfer_moles2))]));
		}
		if ((isEqual(live(transfer_moles2), 0) && rt.gt(live(transfer_moles1), 0))) {
			ratio = divide(live(air1_moles), live(transfer_moles1));
		}
		if ((isEqual(live(transfer_moles1), 0) && rt.gt(live(transfer_moles2), 0))) {
			ratio = divide(live(air2_moles), live(transfer_moles2));
		}
		(transfer_moles1 = rt.modify(live(transfer_moles1), live(ratio), multiply));
		(transfer_moles2 = rt.modify(live(transfer_moles2), live(ratio), multiply));
	}
	if (rt.gt(live(transfer_moles1), 0)) {
		removed1 = (yield* g.callName(f, live(air1), "remove", [live(transfer_moles1)]));
		yield* g.callName(f, live(air3), "merge", [live(removed1)]);
	}
	if (rt.gt(live(transfer_moles2), 0)) {
		removed2 = (yield* g.callName(f, live(air2), "remove", [live(transfer_moles2)]));
		yield* g.callName(f, live(air3), "merge", [live(removed2)]);
	}
	if (truthy(live(transfer_moles1))) {
		rt.setFv(f, "update", (parent1 = rt.index(rt.sv(f, "parents"), 1)), 1);
	}
	if (truthy(live(transfer_moles2))) {
		rt.setFv(f, "update", (parent2 = rt.index(rt.sv(f, "parents"), 2)), 1);
	}
	rt.setFv(f, "update", (parent3 = rt.index(rt.sv(f, "parents"), 3)), 1);
	return 1;
}, true);

// /obj/machinery/atmospherics/components/trinary/mixer/proc/ui_interact  (code/modules/atmospherics/machinery/components/trinary_devices/mixer.dm:121)  may sleep
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "atmos_mixer", rt.sv(f, "name"), 370, 165, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/trinary/mixer/proc/ui_data  (code/modules/atmospherics/machinery/components/trinary_devices/mixer.dm:127)
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	f.vars = () => [data];
	rt.setAt((data = rt.list()), "on", rt.sv(f, "on"));
	rt.setAt(live(data), "set_pressure", rt.call(f, P("/proc/round"), null, [rt.sv(f, "target_pressure")]));
	rt.setAt(live(data), "max_pressure", rt.call(f, P("/proc/round"), null, [4500]));
	rt.setAt(live(data), "node1_concentration", rt.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "node1_concentration"), 100)]));
	rt.setAt(live(data), "node2_concentration", rt.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "node2_concentration"), 100)]));
	return live(data);
});

// /obj/machinery/atmospherics/components/trinary/mixer/proc/ui_act  (code/modules/atmospherics/machinery/components/trinary_devices/mixer.dm:136)  may sleep
rt.def("/obj/machinery/atmospherics/components/trinary/mixer/proc/ui_act", function* ui_act(f: Frame) {
	let pressure: Value = null, value: Value = null;
	let $0: any;
	f.vars = () => [pressure, value, $0];
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
	} else if ($0 === "node1") {
		value = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "concentration")]));
		rt.setSv(f, "node1_concentration", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [1, add(rt.sv(f, "node1_concentration"), live(value))]))])));
		rt.setSv(f, "node2_concentration", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [1, subtract(rt.sv(f, "node2_concentration"), live(value))]))])));
		yield* g.srcCall(f, "investigate_log", fmt("was set to ＀ % on node 1 by ＀", [rt.sv(f, "node1_concentration"), (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "atmos");
		f.dot = 1;
	} else if ($0 === "node2") {
		value = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "concentration")]));
		rt.setSv(f, "node2_concentration", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [1, add(rt.sv(f, "node2_concentration"), live(value))]))])));
		rt.setSv(f, "node1_concentration", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [1, subtract(rt.sv(f, "node1_concentration"), live(value))]))])));
		yield* g.srcCall(f, "investigate_log", fmt("was set to ＀ % on node 2 by ＀", [rt.sv(f, "node2_concentration"), (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "atmos");
		f.dot = 1;
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });
