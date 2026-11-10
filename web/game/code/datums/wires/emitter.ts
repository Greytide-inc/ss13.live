// Based on /tg/station's code/datums/wires/emitter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1064, "/datum/wires/emitter", "/datum/wires", {
	randomize: 1,
	holder_type: rt.typePath("/obj/machinery/power/emitter"),
});

// emitter.dm:7
rt.def("/datum/wires/emitter/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("High Voltage Circuit");
	parent_proc();
	return f.dot;
}, false);

// emitter.dm:11
rt.def("/datum/wires/emitter/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let E: Value = null;
	yield* (E = this.holder).fire_beam_pulse();
	yield* parent_proc();
	return f.dot;
}, true);
