// From code/modules/events/major_dust.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(307, "/datum/round_event/meteor_wave/major_dust", "/datum/round_event/meteor_wave", {
	wave_name: "space dust",
});

// /datum/round_event/meteor_wave/major_dust/proc/announce  (code/modules/events/major_dust.dm:10)  may sleep
rt.def("/datum/round_event/meteor_wave/major_dust/proc/announce", function* announce(f: Frame) {
	let reason: Value = null;
	f.vars = () => [reason];
	yield* g.call(f, P("/proc/priority_announce"), null, [rt.op(f, "PickUnweighted", [1], [(reason = rt.op(f, "PickUnweighted", [3], ["The station is passing through a debris cloud, expect minor damage to external fittings and fixtures.", fmt("Nanotrasen Superweapons Division is testing a new prototype ＀ ＀, some mild debris is expected.", [rt.op(f, "PickUnweighted", [5], ["field", "projection", "nova", "super-colliding", "reactive"]), rt.op(f, "PickUnweighted", [5], ["cannon", "artillery", "tank", "cruiser", "[REDACTED]"])]), "A neighbouring station is throwing rocks at you. (Perhaps they've grown tired of your messages.)"]))]), "Collision Alert"]);
	return f.dot;
}, true);
