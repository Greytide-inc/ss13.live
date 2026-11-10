// Based on /tg/station's code/modules/events/processor_overload.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(318, "/datum/round_event/processor_overload", "/datum/round_event", {
	announceWhen: 1,
});

// processor_overload.dm:11
rt.def("/datum/round_event/processor_overload/proc/announce", function* announce(f: Frame) {
	let A: Value = null;
	let alert: Value = pick("Exospheric bubble inbound. Processor overload is likely. Please contact you*%xp25)`6cq-BZZT", "Exospheric bubble inbound. Processor overload is likel*1eta;c5;'1v¬-BZZZT", "Exospheric bubble inbound. Processor ov#MCi46:5.;@63-BZZZZT", "Exospheric bubble inbo'Fz\\k55_@-BZZZZZT", "Exospheri:%£ QCbyj^j</.3-BZZZZZZT", "!!hy%;f3l7e,<$^-BZZZZZZZT");
	for (A of each(GLOB.ai_list, T("/mob/living/silicon/ai"))) {
		to_chat(A, `<br><span class='warning'><b>${alert}</b></span><br>`);
	}
	if (!prob(80)) return f.dot;
	yield* priority_announce(alert);
	return f.dot;
}, true);

// processor_overload.dm:30
rt.def("/datum/round_event/processor_overload/proc/start", function* start(f: Frame) {
	let _T: Value = null, _P: Value = null;
	for (_T of each(GLOB.telecomms_list, T("/obj/machinery/telecomms"))) {
		if (rt.istype(_T, T("/obj/machinery/telecomms/processor"))) {
			_P = _T;
			if (prob(10)) {
				yield* explosion(rt.getStep(f, _P, 0), 0, 0, 2);
				yield* _P.ex_act(1);
			} else {
				yield* _P.emp_act(1);
			}
		}
	}
	return f.dot;
}, true);
