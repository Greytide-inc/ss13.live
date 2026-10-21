// From code/modules/events/anomaly_pyro.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(290, "/datum/round_event/anomaly/anomaly_pyro", "/datum/round_event/anomaly", {
	startWhen: 3,
	announceWhen: 10,
});

// /datum/round_event/anomaly/anomaly_pyro/proc/announce  (code/modules/events/anomaly_pyro.dm:12)  may sleep
rt.def("/datum/round_event/anomaly/anomaly_pyro/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Pyroclastic anomaly detected on long range scanners. Expected location: ＀.", [rt.fv(f, "name", rt.sv(f, "impact_area"))]), "Anomaly Alert"]);
	return f.dot;
}, true);

// /datum/round_event/anomaly/anomaly_pyro/proc/start  (code/modules/events/anomaly_pyro.dm:15)  may sleep
rt.def("/datum/round_event/anomaly/anomaly_pyro/proc/start", function* start(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy((_T = (yield* g.call(f, P("/proc/safepick"), null, [(yield* g.call(f, P("/proc/get_area_turfs"), null, [rt.sv(f, "impact_area")]))]))))) return f.dot;
	rt.setSv(f, "newAnomaly", (yield* g.new_(f, T("/obj/effect/anomaly/pyro"), [live(_T)])));
	return f.dot;
}, true);
