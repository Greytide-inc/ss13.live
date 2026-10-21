// From code/datums/wires/tesla_coil.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1077, "/datum/wires/tesla_coil", "/datum/wires", {
	randomize: 1,
	holder_type: rt.typePath("/obj/machinery/power/tesla_coil"),
});

// /datum/wires/tesla_coil/proc/New  (code/datums/wires/tesla_coil.dm:7)
rt.def("/datum/wires/tesla_coil/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("High Voltage Circuit"));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/tesla_coil/proc/on_pulse  (code/datums/wires/tesla_coil.dm:11)  may sleep
rt.def("/datum/wires/tesla_coil/proc/on_pulse", function* on_pulse(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	yield* g.callName(f, (C = rt.sv(f, "holder")), "zap", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["wire"] });
