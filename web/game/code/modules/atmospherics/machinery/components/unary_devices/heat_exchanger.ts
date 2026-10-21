// From code/modules/atmospherics/machinery/components/unary_devices/heat_exchanger.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10585, "/obj/machinery/atmospherics/components/unary/heat_exchanger", "/obj/machinery/atmospherics/components/unary", {
	partner: null,
	update_cycle: null,
	can_unwrench: 1,
	icon_state: "he_intact",
	name: "heat exchanger",
	desc: "Exchanges heat between two input gases. Setup for fast heat transfer",
	layer: 2.5,
});

// /obj/machinery/atmospherics/components/unary/heat_exchanger/proc/update_icon  (code/modules/atmospherics/machinery/components/unary_devices/heat_exchanger.dm:16)
rt.def("/obj/machinery/atmospherics/components/unary/heat_exchanger/proc/update_icon", function update_icon(f: Frame) {
	let node: Value = null;
	f.vars = () => [node];
	if (truthy(rt.index(rt.sv(f, "nodes"), 1))) {
		rt.setSv(f, "icon_state", "he_intact");
		rt.callSrc(f, "add_atom_colour", [rt.gv(f, "color", (node = rt.index(rt.sv(f, "nodes"), 1))), 4]);
	} else {
		rt.setSv(f, "icon_state", "he_exposed");
	}
	return live(f.dot);
});

// /obj/machinery/atmospherics/components/unary/heat_exchanger/proc/atmosinit  (code/modules/atmospherics/machinery/components/unary_devices/heat_exchanger.dm:26)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/heat_exchanger/proc/atmosinit", function* atmosinit(f: Frame) {
	let partner_connect: Value = null, target: Value = null;
	let $e: any;
	f.vars = () => [partner_connect, target, $e];
	if (!truthy(rt.sv(f, "partner"))) {
		partner_connect = (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180]));
		target = null;
		rt.forList(f, 0, rt.getStep(f, live(f.src), live(partner_connect)), T("/obj/machinery/atmospherics/components/unary/heat_exchanger"));
		while (($e = rt.next(f, 0)) !== undefined) {
			target = $e;
			if (truthy(rt.bitAnd(rt.fv(f, "dir", live(target)), rt.getDir(f, live(f.src), live(target))))) {
				rt.setSv(f, "partner", live(target));
				rt.setFv(f, "partner", rt.sv(f, "partner"), live(f.src));
				break;
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/heat_exchanger/proc/process_atmos  (code/modules/atmospherics/machinery/components/unary_devices/heat_exchanger.dm:38)
rt.def("/obj/machinery/atmospherics/components/unary/heat_exchanger/proc/process_atmos", function process_atmos(f: Frame) {
	let air_contents: Value = null, partner_air_contents: Value = null, air_heat_capacity: Value = null, other_air_heat_capacity: Value = null, combined_heat_capacity: Value = null, old_temperature: Value = null, other_old_temperature: Value = null, combined_energy: Value = null, new_temperature: Value = null;
	f.vars = () => [air_contents, partner_air_contents, air_heat_capacity, other_air_heat_capacity, combined_heat_capacity, old_temperature, other_old_temperature, combined_energy, new_temperature];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "partner"))) {
		return 0;
	}
	if (rt.le(rt.fv(f, "times_fired", rt.gl("SSair")), rt.sv(f, "update_cycle"))) {
		return 0;
	}
	rt.setSv(f, "update_cycle", rt.fv(f, "times_fired", rt.gl("SSair")));
	rt.setFv(f, "update_cycle", rt.sv(f, "partner"), rt.fv(f, "times_fired", rt.gl("SSair")));
	air_contents = rt.index(rt.sv(f, "airs"), 1);
	partner_air_contents = rt.index(rt.fv(f, "airs", rt.sv(f, "partner")), 1);
	air_heat_capacity = rt.callName(f, live(air_contents), "heat_capacity", []);
	other_air_heat_capacity = rt.callName(f, live(partner_air_contents), "heat_capacity", []);
	combined_heat_capacity = add(live(other_air_heat_capacity), live(air_heat_capacity));
	old_temperature = rt.fv(f, "temperature", live(air_contents));
	other_old_temperature = rt.fv(f, "temperature", live(partner_air_contents));
	if (rt.gt(live(combined_heat_capacity), 0)) {
		combined_energy = add(multiply(rt.fv(f, "temperature", live(partner_air_contents)), live(other_air_heat_capacity)), multiply(live(air_heat_capacity), rt.fv(f, "temperature", live(air_contents))));
		new_temperature = divide(live(combined_energy), live(combined_heat_capacity));
		rt.setFv(f, "temperature", live(air_contents), live(new_temperature));
		rt.setFv(f, "temperature", live(partner_air_contents), live(new_temperature));
	}
	if (rt.gt(rt.op(f, "Abs", [], [subtract(live(old_temperature), rt.fv(f, "temperature", live(air_contents)))]), 1)) {
		rt.callSrc(f, "update_parents", []);
	}
	if (rt.gt(rt.op(f, "Abs", [], [subtract(live(other_old_temperature), rt.fv(f, "temperature", live(partner_air_contents)))]), 1)) {
		rt.callName(f, rt.sv(f, "partner"), "update_parents", []);
	}
	return 1;
});
