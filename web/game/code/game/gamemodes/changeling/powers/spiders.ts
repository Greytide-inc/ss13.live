// Based on /tg/station's code/game/gamemodes/changeling/powers/spiders.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11251, "/obj/effect/proc_holder/changeling/spiders", "/obj/effect/proc_holder/changeling", {
	helptext: "The spiders are thoughtless creatures, and may attack their creators when fully grown. Requires at least 5 DNA absorptions.",
	chemical_cost: 45,
	dna_cost: 1,
	req_dna: 5,
	name: "Spread Infestation",
	desc: "Our form divides, creating arachnids which will grow into deadly beasts.",
});

// spiders.dm:11
rt.def("/obj/effect/proc_holder/changeling/spiders/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	yield* spawn_atom_to_turf(T("/obj/structure/spider/spiderling/hunter"), user, 2, 0);
	return 1;
}, true);
