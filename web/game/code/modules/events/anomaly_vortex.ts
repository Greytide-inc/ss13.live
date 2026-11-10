// Based on /tg/station's code/modules/events/anomaly_vortex.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(291, "/datum/round_event/anomaly/anomaly_vortex", "/datum/round_event/anomaly", {
	startWhen: 10,
	announceWhen: 3,
});

// anomaly_vortex.dm:14
rt.def("/datum/round_event/anomaly/anomaly_vortex/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(`Localized high-intensity vortex anomaly detected on long range scanners. Expected location: ${this.impact_area.name}`, "Anomaly Alert");
	return f.dot;
}, true);

// anomaly_vortex.dm:17
rt.def("/datum/round_event/anomaly/anomaly_vortex/proc/start", function* start(f: Frame) {
	let _T: Value = null;
	if (!(_T = safepick(get_area_turfs(this.impact_area)))) return f.dot;
	this.newAnomaly = (yield* new_(T("/obj/effect/anomaly/bhole"), _T));
	return f.dot;
}, true);
