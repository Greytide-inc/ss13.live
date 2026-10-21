// From code/modules/events/communications_blackout.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(296, "/datum/round_event/communications_blackout", "/datum/round_event", {
	announceWhen: 1,
});

// /datum/round_event/communications_blackout/proc/announce  (code/modules/events/communications_blackout.dm:10)  may sleep
rt.def("/datum/round_event/communications_blackout/proc/announce", function* announce(f: Frame) {
	let alert: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [alert, A, $e];
	alert = rt.op(f, "PickUnweighted", [6], ["Ionospheric anomalies detected. Temporary telecommunication failure imminent. Please contact you*%fj00)`5vc-BZZT", "Ionospheric anomalies detected. Temporary telecommunication failu*3mga;b4;'1v�-BZZZT", "Ionospheric anomalies detected. Temporary telec#MCi46:5.;@63-BZZZZT", "Ionospheric anomalies dete'fZ\\kg5_0-BZZZZZT", "Ionospheri:%� MCayj^j<.3-BZZZZZZT", "#4nd%;f4y6,>�%-BZZZZZZZT"]);
	A = null;
	rt.forList(f, 0, rt.gl("ai_list"), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("<br><span class='warning'><b>＀</b></span><br>", [live(alert)])]);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.op(f, "Prob", [], [30]))) return f.dot;
	yield* g.call(f, P("/proc/priority_announce"), null, [live(alert)]);
	return f.dot;
}, true);

// /datum/round_event/communications_blackout/proc/start  (code/modules/events/communications_blackout.dm:25)  may sleep
rt.def("/datum/round_event/communications_blackout/proc/start", function* start(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	_T = null;
	rt.forList(f, 0, rt.gl("telecomms_list"), T("/obj/machinery/telecomms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.callName(f, live(_T), "emp_act", [1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
