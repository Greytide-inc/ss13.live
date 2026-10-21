// From code/datums/wires/emitter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1064, "/datum/wires/emitter", "/datum/wires", {
	randomize: 1,
	holder_type: rt.typePath("/obj/machinery/power/emitter"),
});

// /datum/wires/emitter/proc/New  (code/datums/wires/emitter.dm:7)
rt.def("/datum/wires/emitter/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("High Voltage Circuit"));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/emitter/proc/on_pulse  (code/datums/wires/emitter.dm:11)  may sleep
rt.def("/datum/wires/emitter/proc/on_pulse", function* on_pulse(f: Frame) {
	let E: Value = null;
	f.vars = () => [E];
	yield* g.callName(f, (E = rt.sv(f, "holder")), "fire_beam_pulse", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["wire"] });
