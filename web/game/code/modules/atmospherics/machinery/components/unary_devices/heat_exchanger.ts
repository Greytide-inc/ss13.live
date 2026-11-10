// Based on /tg/station's code/modules/atmospherics/machinery/components/unary_devices/heat_exchanger.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10585, "/obj/machinery/atmospherics/components/unary/heat_exchanger", "/obj/machinery/atmospherics/components/unary", {
	partner: null,
	update_cycle: null,
	can_unwrench: 1,
	icon_state: "he_intact",
	name: "heat exchanger",
	desc: "Exchanges heat between two input gases. Setup for fast heat transfer",
	layer: 2.5,
});

// heat_exchanger.dm:16
rt.def("/obj/machinery/atmospherics/components/unary/heat_exchanger/proc/update_icon", function update_icon(f: Frame) {
	let node: Value = null;
	if (rt.index(this.nodes, 1)) {
		this.icon_state = "he_intact";
		this.add_atom_colour((node = rt.index(this.nodes, 1)).color, FIXED_COLOUR_PRIORITY);
	} else {
		this.icon_state = "he_exposed";
	}
	return f.dot;
});

// heat_exchanger.dm:26
rt.def("/obj/machinery/atmospherics/components/unary/heat_exchanger/proc/atmosinit", function* atmosinit(f: Frame) {
	let partner_connect: Value = null, target: Value = null;
	if (!this.partner) {
		partner_connect = turn(this.dir, 180);
		for (target of each(rt.getStep(f, this, partner_connect), T("/obj/machinery/atmospherics/components/unary/heat_exchanger"))) {
			if (rt.bitAnd(target.dir, rt.getDir(f, this, target))) {
				this.partner = target;
				this.partner.partner = this;
				break;
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// heat_exchanger.dm:38
rt.def("/obj/machinery/atmospherics/components/unary/heat_exchanger/proc/process_atmos", function process_atmos(f: Frame) {
	let combined_energy: Value = null, new_temperature: Value = null;
	parent_proc();
	if (!this.partner) {
		return 0;
	}
	if (GLOB.SSair.times_fired <= this.update_cycle) {
		return 0;
	}
	this.update_cycle = GLOB.SSair.times_fired;
	this.partner.update_cycle = GLOB.SSair.times_fired;
	let air_contents: Value = rt.index(this.airs, 1);
	let partner_air_contents: Value = rt.index(this.partner.airs, 1);
	let air_heat_capacity: Value = air_contents.heat_capacity();
	let other_air_heat_capacity: Value = partner_air_contents.heat_capacity();
	let combined_heat_capacity: Value = other_air_heat_capacity + air_heat_capacity;
	let old_temperature: Value = air_contents.temperature;
	let other_old_temperature: Value = partner_air_contents.temperature;
	if (combined_heat_capacity > 0) {
		combined_energy = partner_air_contents.temperature * other_air_heat_capacity + air_heat_capacity * air_contents.temperature;
		new_temperature = combined_energy / combined_heat_capacity;
		air_contents.temperature = new_temperature;
		partner_air_contents.temperature = new_temperature;
	}
	if (rt.op(f, "Abs", [], [old_temperature - air_contents.temperature]) > 1) {
		this.update_parents();
	}
	if (rt.op(f, "Abs", [], [other_old_temperature - partner_air_contents.temperature]) > 1) {
		this.partner.update_parents();
	}
	return 1;
});
