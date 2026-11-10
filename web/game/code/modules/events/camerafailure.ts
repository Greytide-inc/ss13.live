// Based on /tg/station's code/modules/events/camerafailure.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(293, "/datum/round_event/camera_failure", "/datum/round_event", {
	startWhen: 1,
	endWhen: 2,
	announceWhen: 0,
});

// camerafailure.dm:15
rt.def("/datum/round_event/camera_failure/proc/tick", function* tick(f: Frame) {
	let iterations: Value = 1;
	let C: Value = pick(GLOB.cameranet.cameras);
	while (prob(round(100 / iterations))) {
		while (!rt.isIn(f, "SS13", C.network)) {
			C = pick(GLOB.cameranet.cameras);
		}
		if (C.status) {
			yield* C.toggle_cam(null, 0);
		}
		iterations *= 2.5;
	}
	return f.dot;
}, true);
