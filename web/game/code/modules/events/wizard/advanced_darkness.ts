// Based on /tg/station's code/modules/events/wizard/advanced_darkness.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(333, "/datum/round_event/wizard/darkness", "/datum/round_event/wizard", {
	started: 0,
	endWhen: 0,
});

// advanced_darkness.dm:14
rt.def("/datum/round_event/wizard/darkness/proc/start", function* start(f: Frame) {
	if (this.started) return f.dot;
	this.started = 1;
	yield* GLOB.SSweather.run_weather("advanced darkness", ZLEVEL_STATION);
	return f.dot;
}, true);
