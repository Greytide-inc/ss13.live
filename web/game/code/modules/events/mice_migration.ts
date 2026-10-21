// From code/modules/events/mice_migration.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(313, "/datum/round_event/mice_migration", "/datum/round_event", {
	minimum_mice: 5,
	maximum_mice: 15,
	announceWhen: 0,
});

// /datum/round_event/mice_migration/proc/announce  (code/modules/events/mice_migration.dm:12)  may sleep
rt.def("/datum/round_event/mice_migration/proc/announce", function* announce(f: Frame) {
	let cause: Value = null, plural: Value = null, name: Value = null, movement: Value = null, location: Value = null;
	f.vars = () => [cause, plural, name, movement, location];
	cause = rt.op(f, "PickUnweighted", [7], ["space-winter", "budget-cuts", "Ragnarok", "space being cold", "[REDACTED]", "climate change", "bad luck"]);
	plural = rt.op(f, "PickUnweighted", [6], ["a number of", "a horde of", "a pack of", "a swarm of", "a whoop of", fmt("not more than ＀", [rt.sv(f, "maximum_mice")])]);
	name = rt.op(f, "PickUnweighted", [6], ["rodents", "mice", "squeaking things", "wire eating mammals", "[REDACTED]", "energy draining parasites"]);
	movement = rt.op(f, "PickUnweighted", [4], ["migrated", "swarmed", "stampeded", "descended"]);
	location = rt.op(f, "PickUnweighted", [4], ["maintenance tunnels", "maintenance areas", "[REDACTED]", "place with all those juicy wires"]);
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Due to ＀, ＀ ＀ have ＀ into the ＀.", [live(cause), live(plural), live(name), live(movement), live(location)]), "Migration Alert", rt.rsc("sound/effects/mousesqueek.ogg"), 100, 1]);
	return f.dot;
}, true);

// /datum/round_event/mice_migration/proc/start  (code/modules/events/mice_migration.dm:28)  may sleep
rt.def("/datum/round_event/mice_migration/proc/start", function* start(f: Frame) {
	yield* g.callName(f, rt.gl("SSsqueak"), "trigger_migration", [(yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "minimum_mice"), rt.sv(f, "maximum_mice")]))]);
	return f.dot;
}, true);
