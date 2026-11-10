// Based on /tg/station's code/modules/events/major_dust.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(307, "/datum/round_event/meteor_wave/major_dust", "/datum/round_event/meteor_wave", {
	wave_name: "space dust",
});

// major_dust.dm:10
rt.def("/datum/round_event/meteor_wave/major_dust/proc/announce", function* announce(f: Frame) {
	let reason: Value = null;
	yield* priority_announce(pick((reason = pick("The station is passing through a debris cloud, expect minor damage to external fittings and fixtures.", `Nanotrasen Superweapons Division is testing a new prototype ${pick("field", "projection", "nova", "super-colliding", "reactive")} ${pick("cannon", "artillery", "tank", "cruiser", "[REDACTED]")}, some mild debris is expected.`, "A neighbouring station is throwing rocks at you. (Perhaps they've grown tired of your messages.)"))), "Collision Alert");
	return f.dot;
}, true);
