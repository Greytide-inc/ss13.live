// Based on /tg/station's code/game/objects/items/weapons/grenades/syndieminibomb.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(6929, "/obj/item/weapon/grenade/syndieminibomb", "/obj/item/weapon/grenade", {
	desc: "A syndicate manufactured explosive used to sow destruction and chaos",
	name: "syndicate minibomb",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "syndicate",
	item_state: "flashbang",
	origin_tech: "materials=3;magnets=4;syndicate=3",
});

// syndieminibomb.dm:11
rt.def("/obj/item/weapon/grenade/syndieminibomb/proc/prime", function* prime(f: Frame) {
	yield* this.update_mob();
	yield* explosion(this.loc, 1, 2, 4, { flame_range: 2 });
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(6930, "/obj/item/weapon/grenade/syndieminibomb/concussion", "/obj/item/weapon/grenade/syndieminibomb", {
	name: "HE Grenade",
	desc: "A compact shrapnel grenade meant to devestate nearby organisms and cause some damage in the process. Pull pin and throw opposite direction.",
	icon_state: "concussion",
	origin_tech: "materials=3;magnets=4;syndicate=2",
});

// syndieminibomb.dm:22
rt.def("/obj/item/weapon/grenade/syndieminibomb/concussion/proc/prime", function* prime(f: Frame) {
	yield* this.update_mob();
	yield* explosion(this.loc, 0, 2, 3, { flame_range: 3 });
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(6932, "/obj/item/weapon/grenade/gluon", "/obj/item/weapon/grenade", {
	freeze_range: 4,
	rad_damage: 35,
	stamina_damage: 30,
	desc: "An advanced grenade that releases a harmful stream of gluons inducing radiation in those nearby. These gluon streams will also make victims feel exhausted, and induce shivering. This extreme coldness will also likely wet any nearby floors.",
	name: "gluon frag grenade",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "bluefrag",
	item_state: "flashbang",
});

// syndieminibomb.dm:42
rt.def("/obj/item/weapon/grenade/gluon/proc/prime", function* prime(f: Frame) {
	let _T: Value = null, F: Value = null, L: Value = null;
	yield* this.update_mob();
	playsound(this.loc, rt.rsc("sound/effects/empulse.ogg"), 50, 1);
	yield* radiation_pulse(this.loc, this.freeze_range, this.freeze_range + 1, this.rad_damage);
	for (_T of each(view(this.freeze_range, this.loc), T("/turf"))) {
		if (rt.istype(_T, T("/turf/open/floor"))) {
			(F = _T).wet = TURF_WET_PERMAFROST;
			yield* addtimer((yield* new_(T("/datum/callback"), F, P("/turf/open/proc/MakeDry"), TURF_WET_PERMAFROST)), rand(3000, 3100));
			L = null;
			for (L of each(_T, T("/mob/living/carbon"))) {
				yield* L.adjustStaminaLoss(this.stamina_damage);
				L.bodytemperature -= 230;
			}
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);
