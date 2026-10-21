// From code/modules/reagents/reagent_containers/dropper.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6516, "/obj/item/weapon/reagent_containers/dropper", "/obj/item/weapon/reagent_containers", {
	amount_per_transfer_from_this: 5,
	possible_transfer_amounts: null,
	volume: 5,
	container_type: 8192,
	name: "dropper",
	desc: "A dropper. Holds up to 5 units.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "dropper0",
});

// /obj/item/weapon/reagent_containers/dropper/proc/afterattack  (code/modules/reagents/reagent_containers/dropper.dm:12)  may sleep
rt.def("/obj/item/weapon/reagent_containers/dropper/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let trans: Value = null, fraction: Value = null, victim: Value = null, safe_thing: Value = null, M: Value = null, R: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [target, user, proximity, trans, fraction, victim, safe_thing, M, R, A, $e];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "reagents", live(target)))) {
		return live(f.dot);
	}
	if (rt.gt(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 0)) {
		if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(target))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(target))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is full.</span>", [live(target)])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(target), "is_injectable", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You cannot directly fill ＀!</span>", [live(target)])]);
			return live(f.dot);
		}
		trans = 0;
		fraction = (yield* g.call(f, P("/proc/min"), null, [divide(rt.sv(f, "amount_per_transfer_from_this"), rt.fv(f, "total_volume", rt.sv(f, "reagents"))), 1]));
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(target)])))) {
			if (truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0))) {
				victim = live(target);
				safe_thing = null;
				if (truthy(rt.fv(f, "wear_mask", live(victim)))) {
					if (truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "wear_mask", live(victim))), 2))) {
						safe_thing = rt.fv(f, "wear_mask", live(victim));
					}
				}
				if (truthy(rt.fv(f, "head", live(victim)))) {
					if (truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "head", live(victim))), 2))) {
						safe_thing = rt.fv(f, "head", live(victim));
					}
				}
				if (truthy(rt.fv(f, "glasses", live(victim)))) {
					if (!truthy(live(safe_thing))) {
						safe_thing = rt.fv(f, "glasses", live(victim));
					}
				}
				if (truthy(live(safe_thing))) {
					if (!truthy(rt.fv(f, "reagents", live(safe_thing)))) {
						yield* g.callName(f, live(safe_thing), "create_reagents", [100]);
					}
					yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(safe_thing), 1, live(fraction)]);
					trans = (yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(safe_thing), rt.sv(f, "amount_per_transfer_from_this")]));
					yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ tries to squirt something into ＀'s eyes, but fails!</span>", [live(user), live(target)]), fmt("<span class='userdanger'>＀ tries to squirt something into ＀'s eyes, but fails!</span>", [live(user), live(target)])]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You transfer ＀ unit５ of the solution.</span>", [live(trans)])]);
					yield* g.srcCall(f, "update_icon");
					return live(f.dot);
				}
			} else {
				if (truthy((rt.istype(live(target), T("/mob/living/carbon/alien")) ? 1 : 0))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(target), fmt("<span class='danger'>＀ does not seem to have any eyes!</span>", [live(target)])]);
					return live(f.dot);
				}
			}
			yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ squirts something into ＀'s eyes!</span>", [live(user), live(target)]), fmt("<span class='userdanger'>＀ squirts something into ＀'s eyes!</span>", [live(user), live(target)])]);
			yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(target), 1, live(fraction)]);
			M = live(target);
			R = null;
			if (truthy(rt.sv(f, "reagents"))) {
				A = null;
				rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(f.src))), T("/datum/reagent"));
				while (($e = rt.next(f, 0)) !== undefined) {
					A = $e;
					R = rt.modify(live(R), add(rt.fv(f, "id", live(A)), " ("), add);
					R = rt.modify(live(R), add((yield* g.call(f, P("/proc/num2text"), null, [rt.fv(f, "volume", live(A))])), "),"), add);
				}
				rt.endFor(f, 0);
			}
			yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "squirted", live(R)]);
		}
		trans = (yield* g.callName(f, rt.fv(f, "reagents", live(f.src)), "trans_to", [live(target), rt.sv(f, "amount_per_transfer_from_this")]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You transfer ＀ unit５ of the solution.</span>", [live(trans)])]);
		yield* g.srcCall(f, "update_icon");
	} else {
		if (!truthy((yield* g.callName(f, live(target), "is_drawable", [0])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You cannot directly remove reagents from ＀.</span>", [live(target)])]);
			return live(f.dot);
		}
		if (!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(target))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty!</span>", [live(target)])]);
			return live(f.dot);
		}
		trans = (yield* g.callName(f, rt.fv(f, "reagents", live(target)), "trans_to", [live(f.src), rt.sv(f, "amount_per_transfer_from_this")]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You fill ＀ with ＀ unit５ of the solution.</span>", [live(f.src), live(trans)])]);
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/dropper/proc/update_icon  (code/modules/reagents/reagent_containers/dropper.dm:92)
rt.def("/obj/item/weapon/reagent_containers/dropper/proc/update_icon", function update_icon(f: Frame) {
	let filling: Value = null;
	f.vars = () => [filling];
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) return f.dot;
	rt.setFv(f, "color", (filling = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/reagentfillings.dmi"), "dropper"])), rt.call(f, P("/proc/mix_color_from_reagents"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]));
	rt.callSrc(f, "add_overlay", [live(filling)]);
	return f.dot;
});
