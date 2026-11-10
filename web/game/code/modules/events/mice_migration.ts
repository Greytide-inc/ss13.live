// Based on /tg/station's code/modules/events/mice_migration.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(313, "/datum/round_event/mice_migration", "/datum/round_event", {
	minimum_mice: 5,
	maximum_mice: 15,
	announceWhen: 0,
});

// mice_migration.dm:12
rt.def("/datum/round_event/mice_migration/proc/announce", function* announce(f: Frame) {
	let cause: Value = pick("space-winter", "budget-cuts", "Ragnarok", "space being cold", "[REDACTED]", "climate change", "bad luck");
	let plural: Value = pick("a number of", "a horde of", "a pack of", "a swarm of", "a whoop of", `not more than ${this.maximum_mice}`);
	let name: Value = pick("rodents", "mice", "squeaking things", "wire eating mammals", "[REDACTED]", "energy draining parasites");
	let movement: Value = pick("migrated", "swarmed", "stampeded", "descended");
	let location: Value = pick("maintenance tunnels", "maintenance areas", "[REDACTED]", "place with all those juicy wires");
	yield* priority_announce(`Due to ${cause}, ${plural} ${name} have ${movement} into the ${location}.`, "Migration Alert", rt.rsc("sound/effects/mousesqueek.ogg"), 100, 1);
	return f.dot;
}, true);

// mice_migration.dm:28
rt.def("/datum/round_event/mice_migration/proc/start", function* start(f: Frame) {
	yield* GLOB.SSsqueak.trigger_migration(rand(this.minimum_mice, this.maximum_mice));
	return f.dot;
}, true);
