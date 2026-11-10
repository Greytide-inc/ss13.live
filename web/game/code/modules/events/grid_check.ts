// Based on /tg/station's code/modules/events/grid_check.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(302, "/datum/round_event/grid_check", "/datum/round_event", {
	announceWhen: 1,
	startWhen: 1,
});

// grid_check.dm:12
rt.def("/datum/round_event/grid_check/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(`Abnormal activity detected in ${station_name()}'s powernet. As a precautionary measure, the station's power will be shut off for an indeterminate duration.`, "Critical Power Failure", rt.rsc("sound/ai/poweroff.ogg"));
	return f.dot;
}, true);

// grid_check.dm:16
rt.def("/datum/round_event/grid_check/proc/start", function start(f: Frame) {
	let _P: Value = null, C: Value = null;
	for (_P of each(GLOB.apcs_list)) {
		if ((C = _P).cell && C.z == ZLEVEL_STATION) {
			C.energy_fail(rand(30, 120));
		}
	}
	return f.dot;
});
