// From code/game/objects/items/weapons/sharpener.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5796, "/obj/item/weapon/sharpener", "/obj/item/weapon", {
	used: 0,
	increment: 4,
	max: 30,
	prefix: "sharpened",
	requires_sharpness: 1,
	name: "whetstone",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "sharpener",
	desc: "A block that makes things sharp.",
});

// /obj/item/weapon/sharpener/proc/attackby  (code/game/objects/items/weapons/sharpener.dm:15)
rt.def("/obj/item/weapon/sharpener/proc/attackby", function attackby(f: Frame, I: Value, user: Value, params: Value) {
	let TH: Value = null;
	f.vars = () => [TH];
	if (truthy(rt.sv(f, "used"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The sharpening block is too worn to use again.</span>"]);
		return live(f.dot);
	}
	if ((rt.ge(rt.fv(f, "force", live(I)), rt.sv(f, "max")) || rt.ge(rt.fv(f, "throwforce", live(I)), rt.sv(f, "max")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is much too powerful to sharpen further.</span>", [live(I)])]);
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "requires_sharpness")) && !truthy(rt.fv(f, "sharpness", live(I))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You can only sharpen items that are already sharp, such as knives.</span>"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/melee/energy")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You don't think ％！ will be the thing getting modified if you use it on ％！.</span>", [live(I), live(f.src)])]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/twohanded")) ? 1 : 0))) {
		if (rt.ge(rt.gv(f, "force_wielded", (TH = live(I))), rt.sv(f, "max"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is much too powerful to sharpen further.</span>", [live(TH)])]);
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "wielded", live(TH)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ must be unwielded before it can be sharpened.</span>", [live(TH)])]);
			return live(f.dot);
		}
		if (rt.gt(rt.fv(f, "force_wielded", live(TH)), rt.initial(f, live(TH), "force_wielded"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ has already been refined before. It cannot be sharpened further.</span>", [live(TH)])]);
			return live(f.dot);
		}
		rt.setFv(f, "force_wielded", live(TH), rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "force_wielded", live(TH)), rt.sv(f, "increment")), rt.sv(f, "max")])]));
	}
	if (rt.gt(rt.fv(f, "force", live(I)), rt.initial(f, live(I), "force"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ has already been refined before. It cannot be sharpened further.</span>", [live(I)])]);
		return live(f.dot);
	}
	rt.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ sharpens ＀ with ＀!</span>", [live(user), live(I), live(f.src)]), fmt("<span class='notice'>You sharpen ＀, making it much more deadly than before.</span>", [live(I)])]);
	rt.setFv(f, "sharpness", live(I), 2);
	rt.setFv(f, "force", live(I), rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "force", live(I)), rt.sv(f, "increment")), rt.sv(f, "max")])]));
	rt.setFv(f, "throwforce", live(I), rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "throwforce", live(I)), rt.sv(f, "increment")), rt.sv(f, "max")])]));
	rt.setFv(f, "name", live(I), fmt("＀ ＀", [rt.sv(f, "prefix"), rt.fv(f, "name", live(I))]));
	rt.setSv(f, "name", fmt("worn out ＀", [rt.sv(f, "name")]));
	rt.setSv(f, "desc", fmt("＀ At least, it used to.", [rt.sv(f, "desc")]));
	rt.setSv(f, "used", 1);
	return f.dot;
});
