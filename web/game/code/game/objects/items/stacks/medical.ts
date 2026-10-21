// From code/game/objects/items/stacks/medical.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9099, "/obj/item/stack/medical", "/obj/item/stack", {
	heal_brute: 0,
	heal_burn: 0,
	stop_bleeding: 0,
	self_delay: 50,
	throw_speed: 3,
	throw_range: 7,
	name: "medical pack",
	singular_name: "medical pack",
	icon: rt.rsc("icons/obj/items.dmi"),
	amount: 6,
	max_amount: 6,
	w_class: 1,
	full_w_class: 1,
	resistance_flags: 4,
	obj_integrity: 40,
	max_integrity: 40,
	novariants: 0,
});

// /obj/item/stack/medical/proc/attack  (code/game/objects/items/stacks/medical.dm:22)  may sleep
rt.def("/obj/item/stack/medical/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let t_him: Value = null, affecting: Value = null, C: Value = null, H: Value = null, critter: Value = null, t_himself: Value = null;
	f.vars = () => [M, user, t_him, affecting, C, H, critter, t_himself];
	if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
		t_him = "it";
		if (isEqual(rt.fv(f, "gender", live(M)), "male")) {
			t_him = "him";
		} else {
			if (isEqual(rt.fv(f, "gender", live(M)), "female")) {
				t_him = "her";
			}
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＄！ is dead, you cannot help ＀!</span>", [live(M), live(t_him)])]);
		return live(f.dot);
	}
	if ((!truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0)) && !truthy((rt.istype(live(M), T("/mob/living/simple_animal")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>You don't know how to apply ％！ to ＀!</span>", [live(f.src), live(M)])]);
		return 1;
	}
	affecting = null;
	if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		if (!truthy((affecting = (yield* g.callName(f, (C = live(M)), "get_bodypart", [(yield* g.call(f, P("/proc/check_zone"), null, [rt.fv(f, "zone_selected", live(user))]))]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ doesn't have ＇！!</span>", [live(C), (yield* g.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))]))])]);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0))) {
			H = live(C);
			if (truthy(rt.sv(f, "stop_bleeding"))) {
				if (truthy(rt.fv(f, "bleedsuppress", live(H)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀'s bleeding is already bandaged!</span>", [live(H)])]);
					return live(f.dot);
				} else {
					if (!truthy(rt.fv(f, "bleed_rate", live(H)))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ isn't bleeding!</span>", [live(H)])]);
						return live(f.dot);
					}
				}
			}
		}
	}
	if (truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, live(M), "can_inject", [live(user), 1])))) {
			return live(f.dot);
		}
	}
	if (truthy(live(user))) {
		if (!isEqual(live(M), live(user))) {
			if (truthy((rt.istype(live(M), T("/mob/living/simple_animal")) ? 1 : 0))) {
				if (!truthy(rt.gv(f, "healable", (critter = live(M))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'> You cannot use ＀ on ＀!</span>", [live(f.src), live(M)])]);
					return live(f.dot);
				} else {
					if (isEqual(rt.fv(f, "health", live(critter)), rt.fv(f, "maxHealth", live(critter)))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'> ＀ is at full health.</span>", [live(M)])]);
						return live(f.dot);
					} else {
						if (rt.lt(rt.fv(f, "heal_brute", live(f.src)), 1)) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'> ＀ won't help ＀ at all.</span>", [live(f.src), live(M)])]);
							return live(f.dot);
						}
					}
				}
			}
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='green'>＀ applies ＀ on ＀.</span>", [live(user), live(f.src), live(M)]), fmt("<span class='green'>You apply ＀ on ＀.</span>", [live(f.src), live(M)])]);
		} else {
			t_himself = "itself";
			if (isEqual(rt.fv(f, "gender", live(user)), "male")) {
				t_himself = "himself";
			} else {
				if (isEqual(rt.fv(f, "gender", live(user)), "female")) {
					t_himself = "herself";
				}
			}
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ starts to apply ＀ on ＀...</span>", [live(user), live(f.src), live(t_himself)]), fmt("<span class='notice'>You begin applying ＀ on yourself...</span>", [live(f.src)])]);
			if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [null, live(user), null, live(M), null, rt.sv(f, "self_delay"), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(M), P("/mob/living/proc/can_inject"), live(user), 1]))], rt.Args.Named)))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='green'>＀ applies ＀ on ＀.</span>", [live(user), live(f.src), live(t_himself)]), fmt("<span class='green'>You apply ＀ on yourself.</span>", [live(f.src)])]);
		}
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		if (!truthy((affecting = (yield* g.callName(f, (C = live(M)), "get_bodypart", [(yield* g.call(f, P("/proc/check_zone"), null, [rt.fv(f, "zone_selected", live(user))]))]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ doesn't have ＇！!</span>", [live(C), (yield* g.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))]))])]);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0))) {
			H = live(C);
			if (truthy(rt.sv(f, "stop_bleeding"))) {
				if (!truthy(rt.fv(f, "bleedsuppress", live(H)))) {
					yield* g.callName(f, live(H), "suppress_bloodloss", [rt.sv(f, "stop_bleeding")]);
				}
			}
		}
		if (isEqual(rt.fv(f, "status", live(affecting)), 1)) {
			if (truthy((yield* g.callName(f, live(affecting), "heal_damage", [rt.sv(f, "heal_brute"), rt.sv(f, "heal_burn")])))) {
				yield* g.callName(f, live(C), "update_damage_overlays", []);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Medicine won't work on a robotic limb!</span>"]);
		}
	} else {
		yield* g.callName(f, live(M), "heal_bodypart_damage", [divide(rt.fv(f, "heal_brute", live(f.src)), 2), divide(rt.fv(f, "heal_burn", live(f.src)), 2)]);
	}
	yield* g.srcCall(f, "use", 1);
	return f.dot;
}, true);

rt.type(9103, "/obj/item/stack/medical/gauze/cyborg", "/obj/item/stack/medical/gauze", {
	materials: null,
	is_cyborg: 1,
	cost: 250,
});

// /obj/item/stack/medical/gauze/cyborg/proc/<init>  (code/game/objects/items/stacks/medical.dm:132)
rt.def("/obj/item/stack/medical/gauze/cyborg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});
