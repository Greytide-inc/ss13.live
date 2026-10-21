// From code/modules/mining/equipment/goliath_hide.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9035, "/obj/item/stack/sheet/animalhide/goliath_hide", "/obj/item/stack/sheet/animalhide", {
	flags: 4,
	name: "goliath hide plates",
	desc: "Pieces of a goliath's rocky hide, these might be able to make your suit a bit more durable to attack from the local fauna.",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "goliath_hide",
	singular_name: "hide plate",
	max_amount: 6,
	novariants: 0,
	w_class: 3,
	layer: 4,
});

// /obj/item/stack/sheet/animalhide/goliath_hide/proc/afterattack  (code/modules/mining/equipment/goliath_hide.dm:16)  may sleep
rt.def("/obj/item/stack/sheet/animalhide/goliath_hide/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let C: Value = null, current_armor: Value = null, D: Value = null;
	f.vars = () => [target, user, proximity_flag, C, current_armor, D];
	if (!truthy(live(proximity_flag))) return f.dot;
	if ((((truthy((rt.istype(live(target), T("/obj/item/clothing/suit/space/hardsuit/mining")) ? 1 : 0)) || truthy((rt.istype(live(target), T("/obj/item/clothing/head/helmet/space/hardsuit/mining")) ? 1 : 0))) || truthy((rt.istype(live(target), T("/obj/item/clothing/suit/hooded/explorer")) ? 1 : 0))) || truthy((rt.istype(live(target), T("/obj/item/clothing/head/hooded/explorer")) ? 1 : 0)))) {
		C = live(target);
		if (rt.lt(rt.index((current_armor = rt.fv(f, "armor", live(C))), "melee"), 60)) {
			rt.setAt(live(current_armor), "melee", (yield* g.call(f, P("/proc/min"), null, [add(rt.at(live(current_armor), "melee"), 10), 60])));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>You strengthen ＀, improving its resistance against melee attacks.</span>", [live(target)])]);
			yield* g.srcCall(f, "use", 1);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't improve ＀ any further!</span>", [live(C)])]);
			return live(f.dot);
		}
	}
	if (!truthy((rt.istype(live(target), T("/obj/mecha/working/ripley")) ? 1 : 0))) return f.dot;
	if (rt.lt(rt.gv(f, "hides", (D = live(target))), 3)) {
		rt.incField(f, live(D), "hides", 1, true);
		rt.setAt(rt.fv(f, "armor", live(D)), "melee", (yield* g.call(f, P("/proc/min"), null, [add(rt.index(rt.fv(f, "armor", live(D)), "melee"), 10), 70])));
		rt.setAt(rt.fv(f, "armor", live(D)), "bullet", (yield* g.call(f, P("/proc/min"), null, [add(rt.index(rt.fv(f, "armor", live(D)), "bullet"), 5), 50])));
		rt.setAt(rt.fv(f, "armor", live(D)), "laser", (yield* g.call(f, P("/proc/min"), null, [add(rt.index(rt.fv(f, "armor", live(D)), "laser"), 5), 50])));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>You strengthen ＀, improving its resistance against melee attacks.</span>", [live(target)])]);
		yield* g.callName(f, live(D), "update_icon", []);
		if (isEqual(rt.fv(f, "hides", live(D)), 3)) {
			rt.setFv(f, "desc", live(D), "Autonomous Power Loader Unit. It's wearing a fearsome carapace entirely composed of goliath hide plates - its pilot must be an experienced monster hunter.");
		} else {
			rt.setFv(f, "desc", live(D), "Autonomous Power Loader Unit. Its armour is enhanced with some goliath hide plates.");
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't improve ＀ any further!</span>", [live(D)])]);
		return live(f.dot);
	}
	return f.dot;
}, true);
