// From code/game/objects/items/weapons/grenades/emgrenade.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6919, "/obj/item/weapon/grenade/empgrenade", "/obj/item/weapon/grenade", {
	name: "classic EMP grenade",
	desc: "It is designed to wreak havoc on electronic systems.",
	icon_state: "emp",
	item_state: "emp",
	origin_tech: "magnets=3;combat=2",
});

// /obj/item/weapon/grenade/empgrenade/proc/prime  (code/game/objects/items/weapons/grenades/emgrenade.dm:9)  may sleep
rt.def("/obj/item/weapon/grenade/empgrenade/proc/prime", function* prime(f: Frame) {
	yield* g.srcCall(f, "update_mob");
	yield* g.call(f, P("/proc/empulse"), null, [live(f.src), 4, 10]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
