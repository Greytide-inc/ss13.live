// From code/modules/atmospherics/machinery/components/unary_devices/generator_input.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10584, "/obj/machinery/atmospherics/components/unary/generator_input", "/obj/machinery/atmospherics/components/unary", {
	update_cycle: null,
	icon_state: "he_intact",
	density: 1,
	name: "generator input",
	desc: "An input for a generator.",
	layer: 2.5,
});

// /obj/machinery/atmospherics/components/unary/generator_input/proc/update_icon  (code/modules/atmospherics/machinery/components/unary_devices/generator_input.dm:13)
rt.def("/obj/machinery/atmospherics/components/unary/generator_input/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.index(rt.sv(f, "nodes"), 1))) {
		rt.setSv(f, "icon_state", "intact");
	} else {
		rt.setSv(f, "icon_state", "exposed");
	}
	return live(f.dot);
});

// /obj/machinery/atmospherics/components/unary/generator_input/proc/return_exchange_air  (code/modules/atmospherics/machinery/components/unary_devices/generator_input.dm:21)
rt.def("/obj/machinery/atmospherics/components/unary/generator_input/proc/return_exchange_air", function return_exchange_air(f: Frame) {
	return rt.index(rt.sv(f, "airs"), 1);
});
