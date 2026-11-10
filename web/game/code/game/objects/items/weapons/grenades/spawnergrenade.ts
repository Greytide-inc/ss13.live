// Based on /tg/station's code/game/objects/items/weapons/grenades/spawnergrenade.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6925, "/obj/item/weapon/grenade/spawnergrenade", "/obj/item/weapon/grenade", {
	spawner_type: null,
	deliveryamt: 1,
	desc: "It will unleash an unspecified anomaly into the vicinity.",
	name: "delivery grenade",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "delivery",
	item_state: "flashbang",
	origin_tech: "materials=3;magnets=4",
});

// spawnergrenade.dm:12
rt.def("/obj/item/weapon/grenade/spawnergrenade/proc/prime", function* prime(f: Frame) {
	let _T: Value = null, C: Value = null;
	yield* this.update_mob();
	if (this.spawner_type && this.deliveryamt) {
		playsound((_T = rt.getStep(f, this, 0)), rt.rsc("sound/effects/phasein.ogg"), 100, 1);
		for (C of each(viewers(_T, null), T("/mob/living/carbon"))) {
			yield* C.flash_act();
		}
		yield* spawn_and_random_walk(this.spawner_type, _T, this.deliveryamt, { walk_chance: 50, admin_spawn: this.admin_spawned });
	}
	yield* qdel(this);
	return f.dot;
}, true);
