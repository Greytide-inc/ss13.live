// Based on /tg/station's code/modules/atmospherics/machinery/components/unary_devices/generator_input.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10584, "/obj/machinery/atmospherics/components/unary/generator_input", "/obj/machinery/atmospherics/components/unary", {
	update_cycle: null,
	icon_state: "he_intact",
	density: 1,
	name: "generator input",
	desc: "An input for a generator.",
	layer: 2.5,
});

// generator_input.dm:13
rt.def("/obj/machinery/atmospherics/components/unary/generator_input/proc/update_icon", function update_icon(f: Frame) {
	if (rt.index(this.nodes, 1)) {
		this.icon_state = "intact";
	} else {
		this.icon_state = "exposed";
	}
	return f.dot;
});
