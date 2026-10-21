// From code/game/objects/weapons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5109, "/obj/item/weapon", "/obj/item", {
	name: "weapon",
	icon: rt.rsc("icons/obj/weapons.dmi"),
});

// /obj/item/weapon/proc/New  (code/game/objects/weapons.dm:6)  may sleep
rt.def("/obj/item/weapon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "hitsound"))) return f.dot;
	if (isEqual(rt.sv(f, "damtype"), "fire")) {
		rt.setSv(f, "hitsound", rt.rsc("sound/items/welder.ogg"));
	}
	if (!isEqual(rt.sv(f, "damtype"), "brute")) return f.dot;
	rt.setSv(f, "hitsound", "swing_hit");
	return f.dot;
}, true);
