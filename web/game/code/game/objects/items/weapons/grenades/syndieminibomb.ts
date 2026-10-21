// From code/game/objects/items/weapons/grenades/syndieminibomb.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6929, "/obj/item/weapon/grenade/syndieminibomb", "/obj/item/weapon/grenade", {
	desc: "A syndicate manufactured explosive used to sow destruction and chaos",
	name: "syndicate minibomb",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "syndicate",
	item_state: "flashbang",
	origin_tech: "materials=3;magnets=4;syndicate=3",
});

// /obj/item/weapon/grenade/syndieminibomb/proc/prime  (code/game/objects/items/weapons/grenades/syndieminibomb.dm:11)  may sleep
rt.def("/obj/item/weapon/grenade/syndieminibomb/proc/prime", function* prime(f: Frame) {
	yield* g.srcCall(f, "update_mob");
	yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, 1, null, 2, null, 4, "flame_range", 2], rt.Args.Named);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(6930, "/obj/item/weapon/grenade/syndieminibomb/concussion", "/obj/item/weapon/grenade/syndieminibomb", {
	name: "HE Grenade",
	desc: "A compact shrapnel grenade meant to devestate nearby organisms and cause some damage in the process. Pull pin and throw opposite direction.",
	icon_state: "concussion",
	origin_tech: "materials=3;magnets=4;syndicate=2",
});

// /obj/item/weapon/grenade/syndieminibomb/concussion/proc/prime  (code/game/objects/items/weapons/grenades/syndieminibomb.dm:22)  may sleep
rt.def("/obj/item/weapon/grenade/syndieminibomb/concussion/proc/prime", function* prime(f: Frame) {
	yield* g.srcCall(f, "update_mob");
	yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, 0, null, 2, null, 3, "flame_range", 3], rt.Args.Named);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
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

// /obj/item/weapon/grenade/gluon/proc/prime  (code/game/objects/items/weapons/grenades/syndieminibomb.dm:42)  may sleep
rt.def("/obj/item/weapon/grenade/gluon/proc/prime", function* prime(f: Frame) {
	let _T: Value = null, F: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [_T, F, L, $e];
	yield* g.srcCall(f, "update_mob");
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/empulse.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.sv(f, "loc"), rt.sv(f, "freeze_range"), add(rt.sv(f, "freeze_range"), 1), rt.sv(f, "rad_damage")]);
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [rt.sv(f, "freeze_range"), rt.sv(f, "loc")])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0))) {
			rt.setFv(f, "wet", (F = live(_T)), 4);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(F), P("/turf/open/proc/MakeDry"), 4])), (yield* g.call(f, P("/proc/rand"), null, [3000, 3100]))]);
			L = null;
			rt.forList(f, 1, live(_T), T("/mob/living/carbon"));
			while (($e = rt.next(f, 1)) !== undefined) {
				L = $e;
				yield* g.callName(f, live(L), "adjustStaminaLoss", [rt.sv(f, "stamina_damage")]);
				(rt.modField(f, live(L), "bodytemperature", 230, subtract));
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
