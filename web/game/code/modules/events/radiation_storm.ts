// Based on /tg/station's code/modules/events/radiation_storm.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(319, "/datum/round_event/radiation_storm", "/datum/round_event", {});

// radiation_storm.dm:11
rt.def("/datum/round_event/radiation_storm/proc/setup", function setup(f: Frame) {
	this.startWhen = 3;
	this.endWhen = this.startWhen + 1;
	this.announceWhen = 1;
	return f.dot;
});

// radiation_storm.dm:15
rt.def("/datum/round_event/radiation_storm/proc/announce", function* announce(f: Frame) {
	yield* priority_announce("High levels of radiation detected near the station. Maintenance is best shielded from radiation.", "Anomaly Alert", rt.rsc("sound/ai/radiation.ogg"));
	return f.dot;
}, true);

// radiation_storm.dm:19
rt.def("/datum/round_event/radiation_storm/proc/start", function* start(f: Frame) {
	yield* GLOB.SSweather.run_weather("radiation storm", ZLEVEL_STATION);
	return f.dot;
}, true);
