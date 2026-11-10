// Based on /tg/station's code/datums/wires/tesla_coil.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1077, "/datum/wires/tesla_coil", "/datum/wires", {
	randomize: 1,
	holder_type: rt.typePath("/obj/machinery/power/tesla_coil"),
});

// tesla_coil.dm:7
rt.def("/datum/wires/tesla_coil/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("High Voltage Circuit");
	parent_proc();
	return f.dot;
}, false);

// tesla_coil.dm:11
rt.def("/datum/wires/tesla_coil/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let C: Value = null;
	yield* (C = this.holder).zap();
	yield* parent_proc();
	return f.dot;
}, true);
