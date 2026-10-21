// From code/modules/spells/spell_types/summonitem.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11334, "/obj/effect/proc_holder/spell/targeted/summonitem", "/obj/effect/proc_holder/spell/targeted", {
	marked_item: null,
	include_user: 1,
	name: "Instant Summons",
	desc: "This spell can be used to recall a previously marked item to your hand from anywhere in the universe.",
	school: "transmutation",
	charge_max: 100,
	clothes_req: 0,
	invocation: "GAR YOK",
	invocation_type: "whisper",
	range: -1,
	level_max: 0,
	cooldown_min: 100,
	action_icon_state: "summons",
});

// /obj/effect/proc_holder/spell/targeted/summonitem/proc/cast  (code/modules/spells/spell_types/summonitem.dm:19)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/summonitem/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let L: Value = null, hand_items: Value = null, message: Value = null, item: Value = null, item_to_retrieve: Value = null, infinite_recursion: Value = null, organ: Value = null, M: Value = null, C: Value = null, X: Value = null, part: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [targets, user, L, hand_items, message, item, item_to_retrieve, infinite_recursion, organ, M, C, X, part, _P, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	L = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		hand_items = rt.list((yield* g.callName(f, live(L), "get_active_held_item", [])), (yield* g.callName(f, live(L), "get_inactive_held_item", [])));
		message = null;
		if (!truthy(rt.sv(f, "marked_item"))) {
			message = "<span class='notice'>";
			item = null;
			rt.forList(f, 1, live(hand_items), T("/obj"));
			while (($e = rt.next(f, 1)) !== undefined) {
				item = $e;
				if (truthy((rt.isIn(f, 128, rt.fv(f, "flags", live(item))) ? 1 : 0))) {
					continue;
				}
				if (truthy((rt.isIn(f, 2, rt.fv(f, "flags", live(item))) ? 1 : 0))) {
					message = rt.modify(live(message), "Though it feels redundant, ", add);
				}
				rt.setSv(f, "marked_item", live(item));
				message = rt.modify(live(message), fmt("You mark ＀ for recall.</span>", [live(item)]), add);
				rt.setSv(f, "name", fmt("Recall ＀", [live(item)]));
				break;
			}
			rt.endFor(f, 1);
			if (!truthy(rt.sv(f, "marked_item"))) {
				if (truthy(live(hand_items))) {
					message = "<span class='caution'>You aren't holding anything that can be marked for recall.</span>";
				} else {
					message = "<span class='notice'>You must hold the desired item in your hands to mark it for recall.</span>";
				}
			}
		} else {
			if (truthy((rt.isIn(f, (rt.sv(f, "marked_item") && rt.sv(f, "marked_item")), live(hand_items)) ? 1 : 0))) {
				message = fmt("<span class='notice'>You remove the mark on ＀ to use elsewhere.</span>", [rt.sv(f, "marked_item")]);
				rt.setSv(f, "name", "Instant Summons");
				rt.setSv(f, "marked_item", null);
			} else {
				if ((truthy(rt.sv(f, "marked_item")) && (!truthy(rt.sv(f, "marked_item")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "marked_item")))))) {
					message = "<span class='warning'>You sense your marked item has been destroyed!</span>";
					rt.setSv(f, "name", "Instant Summons");
					rt.setSv(f, "marked_item", null);
				} else {
					item_to_retrieve = rt.sv(f, "marked_item");
					infinite_recursion = 0;
					if (!truthy(rt.fv(f, "loc", live(item_to_retrieve)))) {
						if (truthy((rt.istype(live(item_to_retrieve), T("/obj/item/organ")) ? 1 : 0))) {
							if (truthy(rt.gv(f, "owner", (organ = live(item_to_retrieve))))) {
								yield* g.call(f, P("/proc/add_logs"), null, [null, live(L), null, rt.fv(f, "owner", live(organ)), null, fmt("magically removed ＀ from", [rt.fv(f, "name", live(organ))]), "addition", fmt("INTENT: ＀", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "a_intent", live(L))]))])], rt.Args.Named);
								yield* g.callName(f, live(organ), "Remove", [rt.fv(f, "owner", live(organ))]);
							}
						}
					} else {
						while (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(item_to_retrieve))]))) && rt.lt(live(infinite_recursion), 10)) {
							if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", live(item_to_retrieve))])))) {
								if (truthy((rt.istype((M = rt.fv(f, "loc", live(item_to_retrieve))), T("/mob/living/silicon")) ? 1 : 0))) {
									yield* g.callName(f, rt.fv(f, "loc", live(M)), "visible_message", [fmt("<span class='warning'>＀ suddenly disappears!</span>", [live(M)])]);
									rt.setFv(f, "loc", live(M), rt.fv(f, "loc", live(L)));
									yield* g.callName(f, rt.fv(f, "loc", live(M)), "visible_message", [fmt("<span class='caution'>＀ suddenly appears!</span>", [live(M)])]);
									item_to_retrieve = null;
									break;
								}
								yield* g.callName(f, live(M), "dropItemToGround", [live(item_to_retrieve)]);
								if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
									if (truthy((rt.isIn(f, (rt.gv(f, "stomach_contents", (C = live(M))) && live(item_to_retrieve)), rt.fv(f, "stomach_contents", live(C))) ? 1 : 0))) {
										(rt.modField(f, live(C), "stomach_contents", live(item_to_retrieve), subtract));
									}
									X = null;
									rt.forList(f, 1, rt.fv(f, "bodyparts", live(C)));
									while (($e = rt.next(f, 1)) !== undefined) {
										X = $e;
										part = live(X);
										if (truthy((rt.isIn(f, live(item_to_retrieve), rt.fv(f, "embedded_objects", live(part))) ? 1 : 0))) {
											(rt.modField(f, live(part), "embedded_objects", live(item_to_retrieve), subtract));
											yield* g.call(f, P("/proc/to_chat"), null, [live(C), fmt("<span class='warning'>The ＀ that was embedded in your ＀ has myseriously vanished. How fortunate!</span>", [live(item_to_retrieve), live(L)])]);
											if (!truthy((yield* g.callName(f, live(C), "has_embedded_objects", [])))) {
												yield* g.callName(f, live(C), "clear_alert", ["embeddedobject"]);
											}
											break;
										}
									}
									rt.endFor(f, 1);
								}
							} else {
								if (truthy((rt.istype(rt.fv(f, "loc", live(item_to_retrieve)), T("/obj/machinery/portable_atmospherics")) ? 1 : 0))) {
									yield* g.callName(f, (_P = rt.fv(f, "loc", live(item_to_retrieve))), "disconnect", []);
									yield* g.callName(f, live(_P), "update_icon", []);
								}
								item_to_retrieve = rt.fv(f, "loc", live(item_to_retrieve));
							}
							infinite_recursion = rt.modify(live(infinite_recursion), 1, add);
						}
					}
					if (!truthy(live(item_to_retrieve))) {
						return live(f.dot);
					}
					if (truthy(rt.fv(f, "loc", live(item_to_retrieve)))) {
						yield* g.callName(f, rt.fv(f, "loc", live(item_to_retrieve)), "visible_message", [fmt("<span class='warning'>The ＀ suddenly disappears!</span>", [rt.fv(f, "name", live(item_to_retrieve))])]);
					}
					if (!truthy((yield* g.callName(f, live(L), "put_in_hands", [live(item_to_retrieve)])))) {
						rt.setFv(f, "loc", live(item_to_retrieve), rt.fv(f, "loc", live(L)));
						yield* g.callName(f, rt.fv(f, "loc", live(item_to_retrieve)), "visible_message", [fmt("<span class='caution'>The ＀ suddenly appears!</span>", [rt.fv(f, "name", live(item_to_retrieve))])]);
						yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(L), 0), rt.rsc("sound/magic/summonitems_generic.ogg"), 50, 1]);
					} else {
						yield* g.callName(f, rt.fv(f, "loc", live(item_to_retrieve)), "visible_message", [fmt("<span class='caution'>The ＀ suddenly appears in ＀'s hand!</span>", [rt.fv(f, "name", live(item_to_retrieve)), live(L)])]);
						yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(L), 0), rt.rsc("sound/magic/summonitems_generic.ogg"), 50, 1]);
					}
				}
			}
		}
		if (truthy(live(message))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), live(message)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
