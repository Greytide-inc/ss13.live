// From code/modules/events/wizard/lava.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(345, "/datum/round_event/wizard/lava", "/datum/round_event/wizard", {
	started: 0,
	endWhen: 0,
});

// /datum/round_event/wizard/lava/proc/start  (code/modules/events/wizard/lava.dm:13)  may sleep
rt.def("/datum/round_event/wizard/lava/proc/start", function* start(f: Frame) {
	if (truthy(rt.sv(f, "started"))) return f.dot;
	rt.setSv(f, "started", 1);
	yield* g.callName(f, rt.gl("SSweather"), "run_weather", ["the floor is lava", 2]);
	return f.dot;
}, true);
