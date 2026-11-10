// Based on /tg/station's code/modules/atmospherics/machinery/components/binary_devices/circulator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// circulator.dm:24
rt.def("/obj/machinery/atmospherics/components/binary/circulator/proc/return_transfer_air", function* return_transfer_air(f: Frame) {
	let pressure_delta: Value = null, transfer_moles: Value = null, removed: Value = null;
	let air1: Value = rt.index(this.airs, 1);
	let air2: Value = rt.index(this.airs, 2);
	let output_starting_pressure: Value = air1.return_pressure();
	let input_starting_pressure: Value = air2.return_pressure();
	if (output_starting_pressure >= input_starting_pressure - 10) {
		this.last_pressure_delta = 0;
		return null;
	}
	if (air2.temperature > 0) {
		pressure_delta = (input_starting_pressure - output_starting_pressure) / 2;
		transfer_moles = pressure_delta * air1.volume / (air2.temperature * R_IDEAL_GAS_EQUATION);
		this.last_pressure_delta = pressure_delta;
		removed = (yield* air2.remove(transfer_moles));
		this.update_parents();
		return removed;
	} else {
		this.last_pressure_delta = 0;
	}
	return f.dot;
}, true);

// circulator.dm:56
rt.def("/obj/machinery/atmospherics/components/binary/circulator/proc/process_atmos", function process_atmos(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// circulator.dm:60
rt.def("/obj/machinery/atmospherics/components/binary/circulator/proc/update_icon", function update_icon(f: Frame) {
	if (rt.bitAnd(this.stat, 3)) {
		this.icon_state = `circ${this.side}-p`;
	} else if (this.last_pressure_delta > 0) {
		if (this.last_pressure_delta > ONE_ATMOSPHERE) {
			this.icon_state = `circ${this.side}-run`;
		} else {
			this.icon_state = `circ${this.side}-slow`;
		}
	} else {
		this.icon_state = `circ${this.side}-off`;
	}
	return 1;
});
