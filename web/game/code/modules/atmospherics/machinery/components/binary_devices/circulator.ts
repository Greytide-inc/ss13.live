// From code/modules/atmospherics/machinery/components/binary_devices/circulator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10562, "/obj/machinery/atmospherics/components/binary/circulator", "/obj/machinery/atmospherics/components/binary", {
	status: 0,
	last_pressure_delta: 0,
	side: 1,
	anchored: 1,
	name: "circulator/heat exchanger",
	desc: "A gas circulator pump and heat exchanger.",
	icon_state: "circ1-off",
	density: 1,
}, { global: { CIRC_LEFT: 749, CIRC_RIGHT: 750 }, const: ["CIRC_LEFT","CIRC_RIGHT"] });

// /obj/machinery/atmospherics/components/binary/circulator/proc/return_transfer_air  (code/modules/atmospherics/machinery/components/binary_devices/circulator.dm:24)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/circulator/proc/return_transfer_air", function* return_transfer_air(f: Frame) {
	let air1: Value = null, air2: Value = null, output_starting_pressure: Value = null, input_starting_pressure: Value = null, pressure_delta: Value = null, transfer_moles: Value = null, removed: Value = null;
	f.vars = () => [air1, air2, output_starting_pressure, input_starting_pressure, pressure_delta, transfer_moles, removed];
	air1 = rt.index(rt.sv(f, "airs"), 1);
	air2 = rt.index(rt.sv(f, "airs"), 2);
	output_starting_pressure = (yield* g.callName(f, live(air1), "return_pressure", []));
	input_starting_pressure = (yield* g.callName(f, live(air2), "return_pressure", []));
	if (rt.ge(live(output_starting_pressure), subtract(live(input_starting_pressure), 10))) {
		rt.setSv(f, "last_pressure_delta", 0);
		return null;
	}
	if (rt.gt(rt.fv(f, "temperature", live(air2)), 0)) {
		pressure_delta = divide(subtract(live(input_starting_pressure), live(output_starting_pressure)), 2);
		transfer_moles = divide(multiply(live(pressure_delta), rt.fv(f, "volume", live(air1))), multiply(rt.fv(f, "temperature", live(air2)), 8.3100004196167));
		rt.setSv(f, "last_pressure_delta", live(pressure_delta));
		removed = (yield* g.callName(f, live(air2), "remove", [live(transfer_moles)]));
		yield* g.srcCall(f, "update_parents");
		return live(removed);
	} else {
		rt.setSv(f, "last_pressure_delta", 0);
	}
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/binary/circulator/proc/process_atmos  (code/modules/atmospherics/machinery/components/binary_devices/circulator.dm:56)
rt.def("/obj/machinery/atmospherics/components/binary/circulator/proc/process_atmos", function process_atmos(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/atmospherics/components/binary/circulator/proc/update_icon  (code/modules/atmospherics/machinery/components/binary_devices/circulator.dm:60)
rt.def("/obj/machinery/atmospherics/components/binary/circulator/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		rt.setSv(f, "icon_state", fmt("circ＀-p", [rt.sv(f, "side")]));
	} else {
		if (rt.gt(rt.sv(f, "last_pressure_delta"), 0)) {
			if (rt.gt(rt.sv(f, "last_pressure_delta"), 101.32499694824219)) {
				rt.setSv(f, "icon_state", fmt("circ＀-run", [rt.sv(f, "side")]));
			} else {
				rt.setSv(f, "icon_state", fmt("circ＀-slow", [rt.sv(f, "side")]));
			}
		} else {
			rt.setSv(f, "icon_state", fmt("circ＀-off", [rt.sv(f, "side")]));
		}
	}
	return 1;
});
