// From code/modules/atmospherics/machinery/components/unary_devices/oxygen_generator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10588, "/obj/machinery/atmospherics/components/unary/oxygen_generator", "/obj/machinery/atmospherics/components/unary", {
	on: 0,
	oxygen_content: 10,
	initialize_directions: 2,
	icon_state: "o2gen_map",
	name: "oxygen generator",
	desc: "Generates oxygen",
	dir: 2,
	layer: 2.46,
});

// /obj/machinery/atmospherics/components/unary/oxygen_generator/proc/update_icon_nopipes  (code/modules/atmospherics/machinery/components/unary_devices/oxygen_generator.dm:18)
rt.def("/obj/machinery/atmospherics/components/unary/oxygen_generator/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "showpipe"))) {
		rt.callSrc(f, "add_overlay", [rt.callSrc(f, "getpipeimage", [rt.rsc("icons/obj/atmospherics/components/unary_devices.dmi"), "scrub_cap", rt.sv(f, "initialize_directions")])]);
	}
	if (((!truthy(rt.index(rt.sv(f, "nodes"), 1)) || !truthy(rt.sv(f, "on"))) || truthy(rt.bitAnd(rt.sv(f, "stat"), 1)))) {
		rt.setSv(f, "icon_state", "o2gen_off");
		return live(f.dot);
	} else {
		rt.setSv(f, "icon_state", "o2gen_on");
	}
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/oxygen_generator/proc/New  (code/modules/atmospherics/machinery/components/unary_devices/oxygen_generator.dm:30)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/oxygen_generator/proc/New", function* New(f: Frame) {
	let air_contents: Value = null;
	f.vars = () => [air_contents];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "volume", (air_contents = rt.index(rt.sv(f, "airs"), 1)), 50);
	rt.setAt(rt.sv(f, "airs"), 1, live(air_contents));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/oxygen_generator/proc/process_atmos  (code/modules/atmospherics/machinery/components/unary_devices/oxygen_generator.dm:36)
rt.def("/obj/machinery/atmospherics/components/unary/oxygen_generator/proc/process_atmos", function process_atmos(f: Frame) {
	let air_contents: Value = null, total_moles: Value = null, current_heat_capacity: Value = null, added_oxygen: Value = null;
	f.vars = () => [air_contents, total_moles, current_heat_capacity, added_oxygen];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "on"))) {
		return 0;
	}
	air_contents = rt.index(rt.sv(f, "airs"), 1);
	if (rt.lt((total_moles = rt.callName(f, live(air_contents), "total_moles", [])), rt.sv(f, "oxygen_content"))) {
		current_heat_capacity = rt.callName(f, live(air_contents), "heat_capacity", []);
		added_oxygen = subtract(rt.sv(f, "oxygen_content"), live(total_moles));
		rt.setFv(f, "temperature", live(air_contents), divide(add(multiply(live(current_heat_capacity), rt.fv(f, "temperature", live(air_contents))), multiply(multiply(20, live(added_oxygen)), 273.1499938964844)), add(live(current_heat_capacity), multiply(20, live(added_oxygen)))));
		rt.callName(f, live(air_contents), "assert_gas", ["o2"]);
		rt.modAt(rt.index(rt.fv(f, "gases", live(air_contents)), "o2"), 1, live(added_oxygen), add);
		rt.callSrc(f, "update_parents", []);
	}
	return 1;
});
