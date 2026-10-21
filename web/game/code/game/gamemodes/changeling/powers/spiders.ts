// From code/game/gamemodes/changeling/powers/spiders.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11251, "/obj/effect/proc_holder/changeling/spiders", "/obj/effect/proc_holder/changeling", {
	helptext: "The spiders are thoughtless creatures, and may attack their creators when fully grown. Requires at least 5 DNA absorptions.",
	chemical_cost: 45,
	dna_cost: 1,
	req_dna: 5,
	name: "Spread Infestation",
	desc: "Our form divides, creating arachnids which will grow into deadly beasts.",
});

// /obj/effect/proc_holder/changeling/spiders/proc/sting_action  (code/game/gamemodes/changeling/powers/spiders.dm:11)  may sleep
rt.def("/obj/effect/proc_holder/changeling/spiders/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/spawn_atom_to_turf"), null, [T("/obj/structure/spider/spiderling/hunter"), live(user), 2, 0]);
	return 1;
}, true);
