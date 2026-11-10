// Based on /tg/station's code/modules/events/anomaly_grav.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(289, "/datum/round_event/anomaly/anomaly_grav", "/datum/round_event/anomaly", {
	startWhen: 3,
	announceWhen: 20,
});

// anomaly_grav.dm:12
rt.def("/datum/round_event/anomaly/anomaly_grav/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(`Gravitational anomaly detected on long range scanners. Expected location: ${this.impact_area.name}.`, "Anomaly Alert");
	return f.dot;
}, true);

// anomaly_grav.dm:15
rt.def("/datum/round_event/anomaly/anomaly_grav/proc/start", function* start(f: Frame) {
	let _T: Value = null;
	if (!(_T = safepick(get_area_turfs(this.impact_area)))) return f.dot;
	this.newAnomaly = (yield* new_(T("/obj/effect/anomaly/grav"), _T));
	return f.dot;
}, true);
