// Based on /tg/station's code/modules/events/communications_blackout.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(296, "/datum/round_event/communications_blackout", "/datum/round_event", {
	announceWhen: 1,
});

// communications_blackout.dm:10
rt.def("/datum/round_event/communications_blackout/proc/announce", function* announce(f: Frame) {
	let A: Value = null;
	let alert: Value = pick("Ionospheric anomalies detected. Temporary telecommunication failure imminent. Please contact you*%fj00)`5vc-BZZT", "Ionospheric anomalies detected. Temporary telecommunication failu*3mga;b4;'1v�-BZZZT", "Ionospheric anomalies detected. Temporary telec#MCi46:5.;@63-BZZZZT", "Ionospheric anomalies dete'fZ\\kg5_0-BZZZZZT", "Ionospheri:%� MCayj^j<.3-BZZZZZZT", "#4nd%;f4y6,>�%-BZZZZZZZT");
	for (A of each(GLOB.ai_list, T("/mob/living/silicon/ai"))) {
		to_chat(A, `<br><span class='warning'><b>${alert}</b></span><br>`);
	}
	if (!prob(30)) return f.dot;
	yield* priority_announce(alert);
	return f.dot;
}, true);

// communications_blackout.dm:25
rt.def("/datum/round_event/communications_blackout/proc/start", function* start(f: Frame) {
	let _T: Value = null;
	for (_T of each(GLOB.telecomms_list, T("/obj/machinery/telecomms"))) {
		yield* _T.emp_act(1);
	}
	return f.dot;
}, true);
