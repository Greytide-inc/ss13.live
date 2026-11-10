// Based on /tg/station's code/modules/events/anomaly_pyro.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(290, "/datum/round_event/anomaly/anomaly_pyro", "/datum/round_event/anomaly", {
	startWhen: 3,
	announceWhen: 10,
});

// anomaly_pyro.dm:12
rt.def("/datum/round_event/anomaly/anomaly_pyro/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(`Pyroclastic anomaly detected on long range scanners. Expected location: ${this.impact_area.name}.`, "Anomaly Alert");
	return f.dot;
}, true);

// anomaly_pyro.dm:15
rt.def("/datum/round_event/anomaly/anomaly_pyro/proc/start", function* start(f: Frame) {
	let _T: Value = null;
	if (!(_T = safepick(get_area_turfs(this.impact_area)))) return f.dot;
	this.newAnomaly = (yield* new_(T("/obj/effect/anomaly/pyro"), _T));
	return f.dot;
}, true);
