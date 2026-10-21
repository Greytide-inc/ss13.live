// From code/modules/events/radiation_storm.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(319, "/datum/round_event/radiation_storm", "/datum/round_event", {});

// /datum/round_event/radiation_storm/proc/setup  (code/modules/events/radiation_storm.dm:11)
rt.def("/datum/round_event/radiation_storm/proc/setup", function setup(f: Frame) {
	rt.setSv(f, "startWhen", 3);
	rt.setSv(f, "endWhen", add(rt.sv(f, "startWhen"), 1));
	rt.setSv(f, "announceWhen", 1);
	return f.dot;
});

// /datum/round_event/radiation_storm/proc/announce  (code/modules/events/radiation_storm.dm:15)  may sleep
rt.def("/datum/round_event/radiation_storm/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, ["High levels of radiation detected near the station. Maintenance is best shielded from radiation.", "Anomaly Alert", rt.rsc("sound/ai/radiation.ogg")]);
	return f.dot;
}, true);

// /datum/round_event/radiation_storm/proc/start  (code/modules/events/radiation_storm.dm:19)  may sleep
rt.def("/datum/round_event/radiation_storm/proc/start", function* start(f: Frame) {
	yield* g.callName(f, rt.gl("SSweather"), "run_weather", ["radiation storm", 2]);
	return f.dot;
}, true);
