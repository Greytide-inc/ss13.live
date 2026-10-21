// From code/modules/spells/spell_types/charge.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11284, "/obj/effect/proc_holder/spell/targeted/charge", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 1,
	name: "Charge",
	desc: "This spell can be used to recharge a variety of things in your hands, from magical artifacts to electrical components. A creative wizard can even use it to grant magical power to a fellow magic user.",
	school: "transmutation",
	charge_max: 600,
	clothes_req: 0,
	invocation: "DIRI CEL",
	invocation_type: "whisper",
	range: -1,
	cooldown_min: 400,
});

// /obj/effect/proc_holder/spell/targeted/charge/proc/cast  (code/modules/spells/spell_types/charge.dm:16)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/charge/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let L: Value = null, hand_items: Value = null, charged_item: Value = null, burnt_out: Value = null, M: Value = null, S: Value = null, item: Value = null, I: Value = null, W: Value = null, C: Value = null, C_6: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [targets, user, L, hand_items, charged_item, burnt_out, M, S, item, I, W, C, C_6, G, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	L = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		hand_items = rt.list((yield* g.callName(f, live(L), "get_active_held_item", [])), (yield* g.callName(f, live(L), "get_inactive_held_item", [])));
		charged_item = null;
		burnt_out = 0;
		if ((truthy(rt.fv(f, "pulling", live(L))) && truthy((rt.istype(rt.fv(f, "pulling", live(L)), T("/mob/living")) ? 1 : 0)))) {
			if ((!isEqual(rt.getLen(f, rt.gv(f, "mob_spell_list", (M = rt.fv(f, "pulling", live(L))))), 0) || (truthy(rt.fv(f, "mind", live(M))) && !isEqual(rt.getLen(f, rt.gv(f, "spell_list", rt.fv(f, "mind", live(M)))), 0)))) {
				S = null;
				rt.forList(f, 1, rt.fv(f, "mob_spell_list", live(M)), T("/obj/effect/proc_holder/spell"));
				while (($e = rt.next(f, 1)) !== undefined) {
					S = $e;
					rt.setFv(f, "charge_counter", live(S), rt.fv(f, "charge_max", live(S)));
				}
				rt.endFor(f, 1);
				if (truthy(rt.fv(f, "mind", live(M)))) {
					S = null;
					rt.forList(f, 1, rt.gv(f, "spell_list", rt.fv(f, "mind", live(M))), T("/obj/effect/proc_holder/spell"));
					while (($e = rt.next(f, 1)) !== undefined) {
						S = $e;
						rt.setFv(f, "charge_counter", live(S), rt.fv(f, "charge_max", live(S)));
					}
					rt.endFor(f, 1);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>You feel raw magic flowing through you. It feels good!</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>You feel very strange for a moment, but then it passes.</span>"]);
				burnt_out = 1;
			}
			charged_item = live(M);
			break;
		}
		item = null;
		rt.forList(f, 1, live(hand_items), T("/obj"));
		while (($e = rt.next(f, 1)) !== undefined) {
			item = $e;
			if (truthy((rt.istype(live(item), T("/obj/item/weapon/spellbook")) ? 1 : 0))) {
				if (truthy((rt.istype(live(item), T("/obj/item/weapon/spellbook/oneuse")) ? 1 : 0))) {
					I = live(item);
					if (truthy(rt.op(f, "Prob", [], [80]))) {
						yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>＀ catches fire!</span>", [live(I)])]);
						yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
					} else {
						rt.setFv(f, "used", live(I), 0);
						charged_item = live(I);
						break;
					}
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='danger'>Glowing red letters appear on the front cover...</span>"]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [5], ["NICE TRY BUT NO!", "CLEVER BUT NOT CLEVER ENOUGH!", "SUCH FLAGRANT CHEESING IS WHY WE ACCEPTED YOUR APPLICATION!", "CUTE! VERY CUTE!", "YOU DIDN'T THINK IT'D BE THAT EASY, DID YOU?"])])]);
					burnt_out = 1;
				}
			} else {
				if (truthy((rt.istype(live(item), T("/obj/item/weapon/gun/magic")) ? 1 : 0))) {
					I = live(item);
					if ((truthy(rt.op(f, "Prob", [], [80])) && !truthy(rt.fv(f, "can_charge", live(I))))) {
						rt.incField(f, live(I), "max_charges", -1, true);
					}
					if (rt.le(rt.fv(f, "max_charges", live(I)), 0)) {
						rt.setFv(f, "max_charges", live(I), 0);
						burnt_out = 1;
					}
					rt.setFv(f, "charges", live(I), rt.fv(f, "max_charges", live(I)));
					if ((truthy((rt.istype(live(item), T("/obj/item/weapon/gun/magic/wand")) ? 1 : 0)) && !isEqual(rt.fv(f, "max_charges", live(I)), 0))) {
						rt.setFv(f, "icon_state", (W = live(item)), rt.initial(f, live(W), "icon_state"));
					}
					yield* g.callName(f, live(I), "recharge_newshot", []);
					charged_item = live(I);
					break;
				} else {
					if (truthy((rt.istype(live(item), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
						if (!truthy(rt.gv(f, "self_recharge", (C = live(item))))) {
							if (truthy(rt.op(f, "Prob", [], [80]))) {
								(rt.modField(f, live(C), "maxcharge", 200, subtract));
							}
							if (rt.le(rt.fv(f, "maxcharge", live(C)), 1)) {
								rt.setFv(f, "maxcharge", live(C), 1);
								burnt_out = 1;
							}
						}
						rt.setFv(f, "charge", live(C), rt.fv(f, "maxcharge", live(C)));
						charged_item = live(C);
						break;
					} else {
						if (truthy(rt.fv(f, "contents", live(item)))) {
							I = null;
							rt.forList(f, 2, rt.fv(f, "contents", live(item)), T("/obj"));
							while (($e = rt.next(f, 2)) !== undefined) {
								I = $e;
								if (truthy((rt.istype(live(I), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
									if (!truthy(rt.gv(f, "self_recharge", (C_6 = live(I))))) {
										if (truthy(rt.op(f, "Prob", [], [80]))) {
											(rt.modField(f, live(C_6), "maxcharge", 200, subtract));
										}
										if (rt.le(rt.fv(f, "maxcharge", live(C_6)), 1)) {
											rt.setFv(f, "maxcharge", live(C_6), 1);
											burnt_out = 1;
										}
									}
									rt.setFv(f, "charge", live(C_6), rt.fv(f, "maxcharge", live(C_6)));
									if (truthy((rt.istype(rt.fv(f, "loc", live(C_6)), T("/obj/item/weapon/gun")) ? 1 : 0))) {
										yield* g.callName(f, (G = rt.fv(f, "loc", live(C_6))), "process_chamber", []);
									}
									yield* g.callName(f, live(item), "update_icon", []);
									charged_item = live(item);
									break;
								}
							}
							rt.endFor(f, 2);
						}
					}
				}
			}
		}
		rt.endFor(f, 1);
		if (!truthy(live(charged_item))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='notice'>You feel magical power surging through your hands, but the feeling rapidly fades...</span>"]);
		} else {
			if (truthy(live(burnt_out))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='caution'>＀ doesn't seem to be reacting to the spell...</span>", [live(charged_item)])]);
			} else {
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(L), 0), rt.rsc("sound/magic/charge.ogg"), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='notice'>＀ suddenly feels very warm!</span>", [live(charged_item)])]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
