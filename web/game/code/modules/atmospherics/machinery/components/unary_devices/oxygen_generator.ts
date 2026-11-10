// Based on /tg/station's code/modules/atmospherics/machinery/components/unary_devices/oxygen_generator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { add } = rt;


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

// oxygen_generator.dm:18
rt.def("/obj/machinery/atmospherics/components/unary/oxygen_generator/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	this.cut_overlays();
	if (this.showpipe) {
		this.add_overlay(this.getpipeimage(rt.rsc("icons/obj/atmospherics/components/unary_devices.dmi"), "scrub_cap", this.initialize_directions));
	}
	if (!rt.index(this.nodes, 1) || !this.on || rt.bitAnd(this.stat, 1)) {
		this.icon_state = "o2gen_off";
		return f.dot;
	} else {
		this.icon_state = "o2gen_on";
	}
	return f.dot;
});

// oxygen_generator.dm:30
rt.def("/obj/machinery/atmospherics/components/unary/oxygen_generator/proc/New", function* New(f: Frame) {
	let air_contents: Value = null;
	yield* parent_proc();
	(air_contents = rt.index(this.airs, 1)).volume = 50;
	rt.setAt(this.airs, 1, air_contents);
	return f.dot;
}, true);

// oxygen_generator.dm:36
rt.def("/obj/machinery/atmospherics/components/unary/oxygen_generator/proc/process_atmos", function process_atmos(f: Frame) {
	let total_moles: Value = null, current_heat_capacity: Value = null, added_oxygen: Value = null;
	parent_proc();
	if (!this.on) {
		return 0;
	}
	let air_contents: Value = rt.index(this.airs, 1);
	if ((total_moles = air_contents.total_moles()) < this.oxygen_content) {
		current_heat_capacity = air_contents.heat_capacity();
		added_oxygen = this.oxygen_content - total_moles;
		air_contents.temperature = (current_heat_capacity * air_contents.temperature + 20 * added_oxygen * T0C) / (current_heat_capacity + 20 * added_oxygen);
		air_contents.assert_gas("o2");
		rt.modAt(rt.index(air_contents.gases, "o2"), 1, added_oxygen, add);
		this.update_parents();
	}
	return 1;
});
