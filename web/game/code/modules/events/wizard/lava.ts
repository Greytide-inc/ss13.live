// Based on /tg/station's code/modules/events/wizard/lava.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(345, "/datum/round_event/wizard/lava", "/datum/round_event/wizard", {
	started: 0,
	endWhen: 0,
});

// lava.dm:13
rt.def("/datum/round_event/wizard/lava/proc/start", function* start(f: Frame) {
	if (this.started) return f.dot;
	this.started = 1;
	yield* GLOB.SSweather.run_weather("the floor is lava", ZLEVEL_STATION);
	return f.dot;
}, true);
