// Based on /tg/station's code/modules/events/anomaly_bluespace.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(287, "/datum/round_event/anomaly/anomaly_bluespace", "/datum/round_event/anomaly", {
	startWhen: 3,
	announceWhen: 10,
});

// anomaly_bluespace.dm:13
rt.def("/datum/round_event/anomaly/anomaly_bluespace/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(`Unstable bluespace anomaly detected on long range scanners. Expected location: ${this.impact_area.name}.`, "Anomaly Alert");
	return f.dot;
}, true);

// anomaly_bluespace.dm:17
rt.def("/datum/round_event/anomaly/anomaly_bluespace/proc/start", function* start(f: Frame) {
	let _T: Value = null;
	if (!(_T = safepick(get_area_turfs(this.impact_area)))) return f.dot;
	this.newAnomaly = (yield* new_(T("/obj/effect/anomaly/bluespace"), _T));
	return f.dot;
}, true);
