// From code/modules/atmospherics/machinery/components/unary_devices/tank.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10591, "/obj/machinery/atmospherics/components/unary/tank", "/obj/machinery/atmospherics/components/unary", {
	volume: 10000,
	gas_type: 0,
	icon: rt.rsc("icons/obj/atmospherics/pipes/pressure_tank.dmi"),
	icon_state: "generic",
	name: "pressure tank",
	desc: "A large vessel containing pressurized gas.",
	obj_integrity: 800,
	max_integrity: 800,
	density: 1,
	layer: 3.3,
});

// /obj/machinery/atmospherics/components/unary/tank/proc/New  (code/modules/atmospherics/machinery/components/unary_devices/tank.dm:15)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/tank/proc/New", function* New(f: Frame) {
	let air_contents: Value = null;
	f.vars = () => [air_contents];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "volume", (air_contents = rt.index(rt.sv(f, "airs"), 1)), rt.sv(f, "volume"));
	rt.setFv(f, "temperature", live(air_contents), 293.1499938964844);
	if (!truthy(rt.sv(f, "gas_type"))) return f.dot;
	yield* g.callName(f, live(air_contents), "assert_gas", [rt.sv(f, "gas_type")]);
	rt.setAt(rt.index(rt.fv(f, "gases", live(air_contents)), rt.sv(f, "gas_type")), 1, divide(multiply(2533.125, rt.fv(f, "volume", live(air_contents))), multiply(8.3100004196167, rt.fv(f, "temperature", live(air_contents)))));
	rt.setSv(f, "name", fmt("＀ (＀)", [rt.sv(f, "name"), rt.index(rt.index(rt.index(rt.fv(f, "gases", live(air_contents)), rt.sv(f, "gas_type")), 3), 2)]));
	return f.dot;
}, true);

rt.type(10597, "/obj/machinery/atmospherics/components/unary/tank/air", "/obj/machinery/atmospherics/components/unary/tank", {
	icon_state: "grey",
	name: "pressure tank (Air)",
});

// /obj/machinery/atmospherics/components/unary/tank/air/proc/New  (code/modules/atmospherics/machinery/components/unary_devices/tank.dm:48)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/tank/air/proc/New", function* New(f: Frame) {
	let air_contents: Value = null;
	f.vars = () => [air_contents];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (air_contents = rt.index(rt.sv(f, "airs"), 1)), "assert_gases", ["o2", "n2"]);
	rt.setAt(rt.index(rt.fv(f, "gases", live(air_contents)), "o2"), 1, multiply(divide(multiply(2533.125, rt.fv(f, "volume", live(air_contents))), multiply(8.3100004196167, rt.fv(f, "temperature", live(air_contents)))), 0.20000000298023224));
	rt.setAt(rt.index(rt.fv(f, "gases", live(air_contents)), "n2"), 1, multiply(divide(multiply(2533.125, rt.fv(f, "volume", live(air_contents))), multiply(8.3100004196167, rt.fv(f, "temperature", live(air_contents)))), 0.800000011920929));
	return f.dot;
}, true);
