// From code/modules/events/meteor_wave.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(306, "/datum/round_event/meteor_wave", "/datum/round_event", {
	wave_type: null,
	wave_name: "normal",
	startWhen: 6,
	endWhen: 66,
	announceWhen: 1,
});

// /datum/round_event/meteor_wave/proc/New  (code/modules/events/meteor_wave.dm:18)
rt.def("/datum/round_event/meteor_wave/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "wave_type"))) return f.dot;
	rt.callSrc(f, "determine_wave_type", []);
	return f.dot;
});

// /datum/round_event/meteor_wave/proc/determine_wave_type  (code/modules/events/meteor_wave.dm:23)
rt.def("/datum/round_event/meteor_wave/proc/determine_wave_type", function determine_wave_type(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "wave_name"))) {
		rt.setSv(f, "wave_name", rt.call(f, P("/proc/pickweight"), null, [rt.alist(f, ["normal", 50, "threatening", 40, "catastrophic", 10])]));
	}
	$0 = rt.sv(f, "wave_name");
	if ($0 === "normal") {
		rt.setSv(f, "wave_type", rt.gl("meteors_normal"));
	} else if ($0 === "threatening") {
		rt.setSv(f, "wave_type", rt.gl("meteors_threatening"));
	} else if ($0 === "catastrophic") {
		rt.setSv(f, "wave_type", rt.gl("meteors_catastrophic"));
	} else if ($0 === "meaty") {
		rt.setSv(f, "wave_type", rt.gl("meteorsB"));
	} else if ($0 === "space dust") {
		rt.setSv(f, "wave_type", rt.gl("meteorsC"));
	} else {
		rt.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("Wave name of ＀ not recognised.", [rt.sv(f, "wave_name")]), "code/modules/events/meteor_wave.dm", 40, live(f.src), live(f.usr)])]);
		rt.callSrc(f, "kill", []);
	}
	return f.dot;
});

// /datum/round_event/meteor_wave/proc/announce  (code/modules/events/meteor_wave.dm:44)  may sleep
rt.def("/datum/round_event/meteor_wave/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, ["Meteors have been detected on collision course with the station.", "Meteor Alert", rt.rsc("sound/ai/meteors.ogg")]);
	return f.dot;
}, true);

// /datum/round_event/meteor_wave/proc/tick  (code/modules/events/meteor_wave.dm:47)  may sleep
rt.def("/datum/round_event/meteor_wave/proc/tick", function* tick(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/IsMultiple"), null, [rt.sv(f, "activeFor"), 3])))) return f.dot;
	yield* g.call(f, P("/proc/spawn_meteors"), null, [5, rt.sv(f, "wave_type")]);
	return f.dot;
}, true);
