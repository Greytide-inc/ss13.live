// From code/game/objects/items/weapons/grenades/smokebomb.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/weapon/grenade/smokebomb/proc/New  (code/game/objects/items/weapons/grenades/smokebomb.dm:12)  may sleep
rt.def("/obj/item/weapon/grenade/smokebomb/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "smoke", live(f.src), (yield* g.new_(f, T("/datum/effect_system/smoke_spread/bad"), [])));
	yield* g.callName(f, rt.fv(f, "smoke", live(f.src)), "attach", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/smokebomb/proc/Destroy  (code/game/objects/items/weapons/grenades/smokebomb.dm:17)  may sleep
rt.def("/obj/item/weapon/grenade/smokebomb/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "smoke")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/grenade/smokebomb/proc/prime  (code/game/objects/items/weapons/grenades/smokebomb.dm:21)  may sleep
rt.def("/obj/item/weapon/grenade/smokebomb/proc/prime", function* prime(f: Frame) {
	let B: Value = null, damage: Value = null;
	let $e: any;
	f.vars = () => [B, damage, $e];
	yield* g.srcCall(f, "update_mob");
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3]);
	yield* g.callName(f, rt.sv(f, "smoke"), "set_up", [4, live(f.src)]);
	yield* g.callName(f, rt.sv(f, "smoke"), "start", []);
	B = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [8, live(f.src)])), T("/obj/structure/blob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		damage = (yield* g.call(f, P("/proc/round"), null, [divide(30, add((yield* g.call(f, P("/proc/get_dist"), null, [live(B), live(f.src)])), 1))]));
		yield* g.callName(f, live(B), "take_damage", [live(damage), "fire", "melee", 0]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [80]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
