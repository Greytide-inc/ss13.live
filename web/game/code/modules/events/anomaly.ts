// From code/modules/events/anomaly.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(286, "/datum/round_event/anomaly", "/datum/round_event", {
	impact_area: null,
	newAnomaly: null,
	announceWhen: 1,
});

// /datum/round_event/anomaly/proc/setup  (code/modules/events/anomaly.dm:16)
rt.def("/datum/round_event/anomaly/proc/setup", function setup(f: Frame, loop: Value) {
	let safety_loop: Value = null, turf_test: Value = null;
	f.vars = () => [loop, safety_loop, turf_test];
	if (live(loop) === null) {
		loop = 0;
	}
	if (rt.gt((safety_loop = add(live(loop), 1)), 50)) {
		rt.callSrc(f, "kill", []);
		rt.callSrc(f, "end", []);
	}
	rt.setSv(f, "impact_area", rt.callSrc(f, "findEventArea", []));
	if (!truthy(rt.sv(f, "impact_area"))) {
		rt.callSrc(f, "setup", [live(safety_loop)]);
	}
	if (truthy(rt.getLen(f, (turf_test = rt.call(f, P("/proc/get_area_turfs"), null, [rt.sv(f, "impact_area")]))))) return f.dot;
	rt.callSrc(f, "setup", [live(safety_loop)]);
	return f.dot;
});

// /datum/round_event/anomaly/proc/announce  (code/modules/events/anomaly.dm:28)  may sleep
rt.def("/datum/round_event/anomaly/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Localized energetic flux wave detected on long range scanners. Expected location of impact: ＀.", [rt.fv(f, "name", rt.sv(f, "impact_area"))]), "Anomaly Alert"]);
	return f.dot;
}, true);

// /datum/round_event/anomaly/proc/start  (code/modules/events/anomaly.dm:31)  may sleep
rt.def("/datum/round_event/anomaly/proc/start", function* start(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy((_T = (yield* g.call(f, P("/proc/safepick"), null, [(yield* g.call(f, P("/proc/get_area_turfs"), null, [rt.sv(f, "impact_area")]))]))))) return f.dot;
	rt.setSv(f, "newAnomaly", (yield* g.new_(f, T("/obj/effect/anomaly/flux"), [live(_T)])));
	return f.dot;
}, true);
