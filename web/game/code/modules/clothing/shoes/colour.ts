// From code/modules/clothing/shoes/colour.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8481, "/obj/item/clothing/shoes/sneakers/orange", "/obj/item/clothing/shoes/sneakers", {
	name: "orange shoes",
	icon_state: "orange",
	item_color: "orange",
});

// /obj/item/clothing/shoes/sneakers/orange/proc/attack_self  (code/modules/clothing/shoes/colour.dm:90)  may sleep
rt.def("/obj/item/clothing/shoes/sneakers/orange/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.fv(f, "chained", live(f.src)))) {
		rt.setFv(f, "chained", live(f.src), null);
		rt.setFv(f, "slowdown", live(f.src), 0);
		yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs"), [rt.fv(f, "loc", live(user))]);
		rt.setFv(f, "icon_state", live(f.src), "orange");
	}
	return live(f.dot);
}, true);

// /obj/item/clothing/shoes/sneakers/orange/proc/attackby  (code/modules/clothing/shoes/colour.dm:98)  may sleep
rt.def("/obj/item/clothing/shoes/sneakers/orange/proc/attackby", function* attackby(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((isEqual(rt.fv(f, "type", live(f.args[0])), T("/obj/item/weapon/restraints/handcuffs")) && !truthy(rt.sv(f, "chained")))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		rt.setFv(f, "chained", live(f.src), 1);
		rt.setFv(f, "slowdown", live(f.src), 15);
		rt.setFv(f, "icon_state", live(f.src), "orange1");
	}
	return live(f.dot);
}, true, { args: ["H", "loc", "params"] });

// /obj/item/clothing/shoes/sneakers/orange/proc/attack_hand  (code/modules/clothing/shoes/colour.dm:108)  may sleep
rt.def("/obj/item/clothing/shoes/sneakers/orange/proc/attack_hand", function* attack_hand(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((isEqual(rt.gv(f, "shoes", (C = live(f.args[0]))), live(f.src)) && isEqual(rt.fv(f, "chained", live(f.src)), 1))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You need help taking these off!</span>"]);
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });
