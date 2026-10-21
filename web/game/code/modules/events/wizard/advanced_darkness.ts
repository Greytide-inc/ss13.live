// From code/modules/events/wizard/advanced_darkness.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(333, "/datum/round_event/wizard/darkness", "/datum/round_event/wizard", {
	started: 0,
	endWhen: 0,
});

// /datum/round_event/wizard/darkness/proc/start  (code/modules/events/wizard/advanced_darkness.dm:14)  may sleep
rt.def("/datum/round_event/wizard/darkness/proc/start", function* start(f: Frame) {
	if (truthy(rt.sv(f, "started"))) return f.dot;
	rt.setSv(f, "started", 1);
	yield* g.callName(f, rt.gl("SSweather"), "run_weather", ["advanced darkness", 2]);
	return f.dot;
}, true);
