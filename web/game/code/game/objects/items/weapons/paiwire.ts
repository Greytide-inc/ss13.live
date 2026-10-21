// From code/game/objects/items/weapons/paiwire.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7322, "/obj/item/weapon/pai_cable", "/obj/item/weapon", {
	machine: null,
	flags: 4,
	desc: "A flexible coated cable with a universal jack on one end.",
	name: "data cable",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "wire1",
});

// /obj/item/weapon/pai_cable/proc/plugin  (code/game/objects/items/weapons/paiwire.dm:10)  may sleep
rt.def("/obj/item/weapon/pai_cable/proc/plugin", function* plugin(f: Frame, M: Value, user: Value) {
	f.vars = () => [M, user];
	if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ inserts ＀ into a data port on ＀.", [live(user), live(f.src), live(M)]), fmt("<span class='notice'>You insert ＀ into a data port on ＀.</span>", [live(f.src), live(M)]), "<span class='italics'>You hear the satisfying click of a wire jack fastening into place.</span>"]);
	rt.setFv(f, "loc", live(f.src), live(M));
	rt.setSv(f, "machine", live(M));
	return f.dot;
}, true);
