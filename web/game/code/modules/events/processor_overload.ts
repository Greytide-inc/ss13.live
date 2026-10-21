// From code/modules/events/processor_overload.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(318, "/datum/round_event/processor_overload", "/datum/round_event", {
	announceWhen: 1,
});

// /datum/round_event/processor_overload/proc/announce  (code/modules/events/processor_overload.dm:11)  may sleep
rt.def("/datum/round_event/processor_overload/proc/announce", function* announce(f: Frame) {
	let alert: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [alert, A, $e];
	alert = rt.op(f, "PickUnweighted", [6], ["Exospheric bubble inbound. Processor overload is likely. Please contact you*%xp25)`6cq-BZZT", "Exospheric bubble inbound. Processor overload is likel*1eta;c5;'1v¬-BZZZT", "Exospheric bubble inbound. Processor ov#MCi46:5.;@63-BZZZZT", "Exospheric bubble inbo'Fz\\k55_@-BZZZZZT", "Exospheri:%£ QCbyj^j</.3-BZZZZZZT", "!!hy%;f3l7e,<$^-BZZZZZZZT"]);
	A = null;
	rt.forList(f, 0, rt.gl("ai_list"), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("<br><span class='warning'><b>＀</b></span><br>", [live(alert)])]);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.op(f, "Prob", [], [80]))) return f.dot;
	yield* g.call(f, P("/proc/priority_announce"), null, [live(alert)]);
	return f.dot;
}, true);

// /datum/round_event/processor_overload/proc/start  (code/modules/events/processor_overload.dm:30)  may sleep
rt.def("/datum/round_event/processor_overload/proc/start", function* start(f: Frame) {
	let _T: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [_T, _P, $e];
	_T = null;
	rt.forList(f, 0, rt.gl("telecomms_list"), T("/obj/machinery/telecomms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy((rt.istype(live(_T), T("/obj/machinery/telecomms/processor")) ? 1 : 0))) {
			_P = live(_T);
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				yield* g.call(f, P("/proc/explosion"), null, [rt.getStep(f, live(_P), 0), 0, 0, 2]);
				yield* g.callName(f, live(_P), "ex_act", [1]);
			} else {
				yield* g.callName(f, live(_P), "emp_act", [1]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
