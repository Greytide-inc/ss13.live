// Based on /tg/station's code/game/objects/items/weapons/grenades/smokebomb.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6924, "/obj/item/weapon/grenade/smokebomb", "/obj/item/weapon/grenade", {
	smoke: null,
	det_time: 20,
	name: "smoke grenade",
	desc: "The word 'Dank' is scribbled on it in crayon.",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "smokewhite",
	item_state: "flashbang",
	slot_flags: 512,
});

// smokebomb.dm:12
rt.def("/obj/item/weapon/grenade/smokebomb/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.smoke = (yield* new_(T("/datum/effect_system/smoke_spread/bad")));
	yield* this.smoke.attach(this);
	return f.dot;
}, true);

// smokebomb.dm:17
rt.def("/obj/item/weapon/grenade/smokebomb/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.smoke);
	return (yield* parent_proc());
}, true);

// smokebomb.dm:21
rt.def("/obj/item/weapon/grenade/smokebomb/proc/prime", function* prime(f: Frame) {
	let B: Value = null, damage: Value = null;
	yield* this.update_mob();
	playsound(this.loc, rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3);
	yield* this.smoke.set_up(4, this);
	yield* this.smoke.start();
	for (B of each(view(8, this), T("/obj/structure/blob"))) {
		damage = round(30 / (get_dist(B, this) + 1));
		yield* B.take_damage(damage, "fire", "melee", 0);
	}
	yield* sleep(80);
	yield* qdel(this);
	return f.dot;
}, true);
