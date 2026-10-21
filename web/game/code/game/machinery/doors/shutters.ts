// From code/game/machinery/doors/shutters.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10296, "/obj/machinery/door/poddoor/shutters", "/obj/machinery/door/poddoor", {
	damage_deflection: 20,
	gender: "plural",
	name: "shutters",
	desc: "Heavy duty metal shutters that opens mechanically.",
	icon: rt.rsc("icons/obj/doors/shutters.dmi"),
	layer: 3.1,
});

// /obj/machinery/door/poddoor/shutters/proc/New  (code/game/machinery/doors/shutters.dm:18)  may sleep
rt.def("/obj/machinery/door/poddoor/shutters/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "layer", 3.0999999046325684);
	return f.dot;
}, true);

// /obj/machinery/door/poddoor/shutters/proc/open  (code/game/machinery/doors/shutters.dm:23)  may sleep
rt.def("/obj/machinery/door/poddoor/shutters/proc/open", function* open(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "layer", 3.0999999046325684);
	return f.dot;
}, true, { args: ["ignorepower"] });

// /obj/machinery/door/poddoor/shutters/proc/close  (code/game/machinery/doors/shutters.dm:28)  may sleep
rt.def("/obj/machinery/door/poddoor/shutters/proc/close", function* close(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "layer", 3.0999999046325684);
	return f.dot;
}, true, { args: ["ignorepower"] });
