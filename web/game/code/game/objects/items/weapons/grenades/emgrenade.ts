// Based on /tg/station's code/game/objects/items/weapons/grenades/emgrenade.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(6919, "/obj/item/weapon/grenade/empgrenade", "/obj/item/weapon/grenade", {
	name: "classic EMP grenade",
	desc: "It is designed to wreak havoc on electronic systems.",
	icon_state: "emp",
	item_state: "emp",
	origin_tech: "magnets=3;combat=2",
});

// emgrenade.dm:9
rt.def("/obj/item/weapon/grenade/empgrenade/proc/prime", function* prime(f: Frame) {
	yield* this.update_mob();
	yield* empulse(this, 4, 10);
	yield* qdel(this);
	return f.dot;
}, true);
