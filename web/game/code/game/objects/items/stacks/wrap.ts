// From code/game/objects/items/stacks/wrap.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9108, "/obj/item/stack/wrapping_paper", "/obj/item/stack", {
	flags: 4,
	amount: 25,
	max_amount: 25,
	name: "wrapping paper",
	desc: "Wrap packages with this festive paper to make gifts.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "wrap_paper",
	resistance_flags: 4,
});

// /obj/item/stack/wrapping_paper/proc/Destroy  (code/game/objects/items/stacks/wrap.dm:18)  may sleep
rt.def("/obj/item/stack/wrapping_paper/proc/Destroy", function* Destroy(f: Frame) {
	if (!truthy(rt.sv(f, "amount"))) {
		yield* g.new_(f, T("/obj/item/weapon/c_tube"), [rt.getStep(f, live(f.src), 0)]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(9109, "/obj/item/stack/packageWrap", "/obj/item/stack", {
	flags: 4,
	amount: 25,
	max_amount: 25,
	name: "package wrapper",
	desc: "You can use this to wrap items in.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "deliveryPaper",
	resistance_flags: 4,
});

// /obj/item/stack/packageWrap/proc/afterattack  (code/game/objects/items/stacks/wrap.dm:50)  may sleep
rt.def("/obj/item/stack/packageWrap/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let I: Value = null, _P: Value = null, size: Value = null, O: Value = null;
	f.vars = () => [target, user, proximity, I, _P, size, O];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(target), T("/obj")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "anchored", live(target)))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/obj/item")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, (I = live(target)), "can_be_package_wrapped", [])))) {
			return live(f.dot);
		}
		if (truthy((yield* g.callName(f, live(user), "is_holding", [live(I)])))) {
			if (!truthy((yield* g.callName(f, live(user), "dropItemToGround", [live(I)])))) {
				return live(f.dot);
			}
		} else {
			if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(I))])))) {
				return live(f.dot);
			}
		}
		if (truthy((yield* g.srcCall(f, "use", 1)))) {
			_P = (yield* g.new_(f, T("/obj/item/smallDelivery"), [rt.getStep(f, rt.fv(f, "loc", live(I)), 0)]));
			if (truthy((yield* g.callName(f, live(user), "Adjacent", [live(I)])))) {
				yield* g.callName(f, live(_P), "add_fingerprint", [live(user)]);
				yield* g.callName(f, live(I), "add_fingerprint", [live(user)]);
				yield* g.callName(f, live(user), "put_in_hands", [live(_P)]);
			}
			yield* g.callName(f, live(I), "forceMove", [live(_P)]);
			size = (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "w_class", live(I))]));
			rt.setFv(f, "name", live(_P), fmt("＀ parcel", [(yield* g.call(f, P("/proc/weightclass2text"), null, [live(size)]))]));
			rt.setFv(f, "w_class", live(_P), live(size));
			size = (yield* g.call(f, P("/proc/min"), null, [live(size), 5]));
			rt.setFv(f, "icon_state", live(_P), fmt("deliverypackage＀", [live(size)]));
		}
	} else {
		if (truthy((rt.istype(live(target), T("/obj/structure/closet")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "opened", (O = live(target))))) {
				return live(f.dot);
			}
			if (!truthy(rt.fv(f, "delivery_icon", live(O)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't wrap this!</span>"]);
				return live(f.dot);
			}
			if (truthy((yield* g.srcCall(f, "use", 3)))) {
				rt.setFv(f, "icon_state", (_P = (yield* g.new_(f, T("/obj/structure/bigDelivery"), [rt.getStep(f, rt.fv(f, "loc", live(O)), 0)]))), rt.fv(f, "delivery_icon", live(O)));
				yield* g.callName(f, live(O), "forceMove", [live(_P)]);
				yield* g.callName(f, live(_P), "add_fingerprint", [live(user)]);
				yield* g.callName(f, live(O), "add_fingerprint", [live(user)]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need more paper!</span>"]);
				return live(f.dot);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The object you are trying to wrap is unsuitable for the sorting machinery!</span>"]);
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ wraps ＀.</span>", [live(user), live(target)])]);
	yield* g.callName(f, live(user), "log_message", [fmt("<font color='blue'>Has used ＀ on ＀</font>", [rt.sv(f, "name"), live(target)]), "Attack log"]);
	return f.dot;
}, true);

// /obj/item/stack/packageWrap/proc/Destroy  (code/game/objects/items/stacks/wrap.dm:103)  may sleep
rt.def("/obj/item/stack/packageWrap/proc/Destroy", function* Destroy(f: Frame) {
	if (!truthy(rt.sv(f, "amount"))) {
		yield* g.new_(f, T("/obj/item/weapon/c_tube"), [rt.getStep(f, live(f.src), 0)]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
