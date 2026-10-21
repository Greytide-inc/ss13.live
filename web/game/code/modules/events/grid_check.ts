// From code/modules/events/grid_check.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(302, "/datum/round_event/grid_check", "/datum/round_event", {
	announceWhen: 1,
	startWhen: 1,
});

// /datum/round_event/grid_check/proc/announce  (code/modules/events/grid_check.dm:12)  may sleep
rt.def("/datum/round_event/grid_check/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Abnormal activity detected in ＀'s powernet. As a precautionary measure, the station's power will be shut off for an indeterminate duration.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Critical Power Failure", rt.rsc("sound/ai/poweroff.ogg")]);
	return f.dot;
}, true);

// /datum/round_event/grid_check/proc/start  (code/modules/events/grid_check.dm:16)
rt.def("/datum/round_event/grid_check/proc/start", function start(f: Frame) {
	let _P: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [_P, C, $e];
	_P = null;
	rt.forList(f, 0, rt.gl("apcs_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if ((truthy(rt.gv(f, "cell", (C = live(_P)))) && isEqual(rt.fv(f, "z", live(C)), 2))) {
			rt.callName(f, live(C), "energy_fail", [rt.call(f, P("/proc/rand"), null, [30, 120])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
