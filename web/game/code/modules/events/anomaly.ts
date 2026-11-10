// Based on /tg/station's code/modules/events/anomaly.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(286, "/datum/round_event/anomaly", "/datum/round_event", {
	impact_area: null,
	newAnomaly: null,
	announceWhen: 1,
});

// anomaly.dm:16
rt.def("/datum/round_event/anomaly/proc/setup", function setup(f: Frame, loop: Value) {
	let safety_loop: Value = null, turf_test: Value = null;
	loop ??= 0;
	if ((safety_loop = loop + 1) > 50) {
		this.kill();
		this.end();
	}
	this.impact_area = this.findEventArea();
	if (!this.impact_area) {
		this.setup(safety_loop);
	}
	if (rt.len(f, (turf_test = get_area_turfs(this.impact_area)))) return f.dot;
	this.setup(safety_loop);
	return f.dot;
});

// anomaly.dm:28
rt.def("/datum/round_event/anomaly/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(`Localized energetic flux wave detected on long range scanners. Expected location of impact: ${this.impact_area.name}.`, "Anomaly Alert");
	return f.dot;
}, true);

// anomaly.dm:31
rt.def("/datum/round_event/anomaly/proc/start", function* start(f: Frame) {
	let _T: Value = null;
	if (!(_T = safepick(get_area_turfs(this.impact_area)))) return f.dot;
	this.newAnomaly = (yield* new_(T("/obj/effect/anomaly/flux"), _T));
	return f.dot;
}, true);
