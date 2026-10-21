// From code/modules/events/camerafailure.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(293, "/datum/round_event/camera_failure", "/datum/round_event", {
	startWhen: 1,
	endWhen: 2,
	announceWhen: 0,
});

// /datum/round_event/camera_failure/proc/tick  (code/modules/events/camerafailure.dm:15)  may sleep
rt.def("/datum/round_event/camera_failure/proc/tick", function* tick(f: Frame) {
	let iterations: Value = null, C: Value = null;
	f.vars = () => [iterations, C];
	iterations = 1;
	C = rt.op(f, "PickUnweighted", [1], [rt.fv(f, "cameras", rt.gl("cameranet"))]);
	while (truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/round"), null, [divide(100, live(iterations))]))]))) {
		while (!truthy((rt.isIn(f, "SS13", rt.fv(f, "network", live(C))) ? 1 : 0))) {
			C = rt.op(f, "PickUnweighted", [1], [rt.fv(f, "cameras", rt.gl("cameranet"))]);
		}
		if (truthy(rt.fv(f, "status", live(C)))) {
			yield* g.callName(f, live(C), "toggle_cam", [null, 0]);
		}
		(iterations = rt.modify(live(iterations), 2.5, multiply));
	}
	return f.dot;
}, true);
