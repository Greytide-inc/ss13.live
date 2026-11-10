// Based on /tg/station's code/modules/events/anomaly_flux.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(288, "/datum/round_event/anomaly/anomaly_flux", "/datum/round_event/anomaly", {
	startWhen: 10,
	announceWhen: 3,
});

// anomaly_flux.dm:14
rt.def("/datum/round_event/anomaly/anomaly_flux/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(`Localized hyper-energetic flux wave detected on long range scanners. Expected location: ${this.impact_area.name}.`, "Anomaly Alert");
	return f.dot;
}, true);

// anomaly_flux.dm:18
rt.def("/datum/round_event/anomaly/anomaly_flux/proc/start", function* start(f: Frame) {
	let _T: Value = null;
	if (!(_T = safepick(get_area_turfs(this.impact_area)))) return f.dot;
	this.newAnomaly = (yield* new_(T("/obj/effect/anomaly/flux"), _T));
	return f.dot;
}, true);
