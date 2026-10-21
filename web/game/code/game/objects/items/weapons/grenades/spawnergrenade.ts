// From code/game/objects/items/weapons/grenades/spawnergrenade.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/weapon/grenade/spawnergrenade/proc/prime  (code/game/objects/items/weapons/grenades/spawnergrenade.dm:12)  may sleep
rt.def("/obj/item/weapon/grenade/spawnergrenade/proc/prime", function* prime(f: Frame) {
	let _T: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [_T, C, $e];
	yield* g.srcCall(f, "update_mob");
	if ((truthy(rt.sv(f, "spawner_type")) && truthy(rt.sv(f, "deliveryamt")))) {
		yield* g.call(f, P("/proc/playsound"), null, [(_T = rt.getStep(f, live(f.src), 0)), rt.rsc("sound/effects/phasein.ogg"), 100, 1]);
		C = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [live(_T), null])), T("/mob/living/carbon"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			yield* g.callName(f, live(C), "flash_act", []);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/spawn_and_random_walk"), null, [null, rt.sv(f, "spawner_type"), null, live(_T), null, rt.sv(f, "deliveryamt"), "walk_chance", 50, "admin_spawn", rt.sv(f, "admin_spawned")], rt.Args.Named);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
