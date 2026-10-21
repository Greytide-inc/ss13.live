// From code/modules/events/dust.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(298, "/datum/round_event/space_dust", "/datum/round_event", {
	startWhen: 1,
	endWhen: 2,
	announceWhen: 0,
});

// /datum/round_event/space_dust/proc/start  (code/modules/events/dust.dm:15)  may sleep
rt.def("/datum/round_event/space_dust/proc/start", function* start(f: Frame) {
	yield* g.call(f, P("/proc/spawn_meteors"), null, [1, rt.gl("meteorsC")]);
	return f.dot;
}, true);

rt.type(299, "/datum/round_event/sandstorm", "/datum/round_event", {
	startWhen: 1,
	endWhen: 150,
	announceWhen: 0,
});

// /datum/round_event/sandstorm/proc/tick  (code/modules/events/dust.dm:30)  may sleep
rt.def("/datum/round_event/sandstorm/proc/tick", function* tick(f: Frame) {
	yield* g.call(f, P("/proc/spawn_meteors"), null, [10, rt.gl("meteorsC")]);
	return f.dot;
}, true);
