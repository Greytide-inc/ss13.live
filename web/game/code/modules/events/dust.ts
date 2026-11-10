// Based on /tg/station's code/modules/events/dust.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(298, "/datum/round_event/space_dust", "/datum/round_event", {
	startWhen: 1,
	endWhen: 2,
	announceWhen: 0,
});

// dust.dm:15
rt.def("/datum/round_event/space_dust/proc/start", function* start(f: Frame) {
	yield* spawn_meteors(1, GLOB.meteorsC);
	return f.dot;
}, true);

rt.type(299, "/datum/round_event/sandstorm", "/datum/round_event", {
	startWhen: 1,
	endWhen: 150,
	announceWhen: 0,
});

// dust.dm:30
rt.def("/datum/round_event/sandstorm/proc/tick", function* tick(f: Frame) {
	yield* spawn_meteors(10, GLOB.meteorsC);
	return f.dot;
}, true);
