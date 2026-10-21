// From code/modules/mob/living/carbon/monkey/combat.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4819, "/mob/living/carbon/monkey", "/mob/living/carbon", {
	aggressive: 0,
	frustration: 0,
	pickupTimer: 0,
	enemies: null,
	target: null,
	pickupTarget: null,
	mode: 0,
	myPath: null,
	blacklistItems: null,
	maxStepsTick: 6,
	best_force: 0,
	martial_art: null,
	resisting: 0,
	pickpocketing: 0,
	disposing_body: 0,
	bodyDisposal: null,
	next_battle_screech: 0,
	battle_screech_cooldown: 50,
	verb_say: "chimpers",
	initial_language_holder: rt.typePath("/datum/language_holder/monkey"),
	pass_flags: 1,
	name: "monkey",
	voice_name: "monkey",
	icon: rt.rsc("icons/mob/monkey.dmi"),
	icon_state: "",
	gender: "neuter",
	ventcrawler: 1,
	butcher_results: null,
	unique_name: 1,
	type_of_meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/monkey"),
	gib_type: rt.typePath("/obj/effect/decal/cleanable/blood/gibs"),
	bodyparts: null,
});

// /mob/living/carbon/monkey/proc/<init>  (code/modules/mob/living/carbon/monkey/combat.dm:6)
rt.def("/mob/living/carbon/monkey/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "enemies", rt.list());
	$0 = $0;
	rt.setSv(f, "myPath", rt.list());
	$0 = $0;
	rt.setSv(f, "blacklistItems", rt.list());
	$0 = $0;
	rt.setSv(f, "martial_art", rt.new_(f, T("/datum/martial_art"), []));
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/monkey"), 5, T("/obj/item/stack/sheet/animalhide/monkey"), 1]));
	$0 = $0;
	rt.setSv(f, "bodyparts", rt.list(T("/obj/item/bodypart/chest/monkey"), T("/obj/item/bodypart/head/monkey"), T("/obj/item/bodypart/l_arm/monkey"), T("/obj/item/bodypart/r_arm/monkey"), T("/obj/item/bodypart/r_leg/monkey"), T("/obj/item/bodypart/l_leg/monkey")));
	return f.dot;
});

// /mob/living/carbon/monkey/proc/IsStandingStill  (code/modules/mob/living/carbon/monkey/combat.dm:23)
rt.def("/mob/living/carbon/monkey/proc/IsStandingStill", function IsStandingStill(f: Frame) {
	return ((rt.sv(f, "resisting") || rt.sv(f, "pickpocketing")) || rt.sv(f, "disposing_body"));
});

// /mob/living/carbon/monkey/proc/walk2derpless  (code/modules/mob/living/carbon/monkey/combat.dm:28)  may sleep
rt.def("/mob/living/carbon/monkey/proc/walk2derpless", function* walk2derpless(f: Frame, target: Value) {
	let i: Value = null;
	f.vars = () => [target, i];
	if ((!truthy(live(target)) || truthy((yield* g.srcCall(f, "IsStandingStill"))))) {
		return 0;
	}
	if (rt.le(rt.len(f, rt.sv(f, "myPath")), 0)) {
		rt.setSv(f, "myPath", (yield* g.call(f, P("/proc/get_path_to"), null, [live(f.src), rt.getStep(f, live(target), 0), P("/turf/proc/Distance"), 33, 250, 1])));
	}
	if (truthy(rt.sv(f, "myPath"))) {
		if (rt.gt(rt.len(f, rt.sv(f, "myPath")), 0)) {
			i = null;
			i = 0;
			while (rt.lt(live(i), rt.sv(f, "maxStepsTick"))) {
				if (!truthy((yield* g.srcCall(f, "IsDeadOrIncap")))) {
					if (rt.ge(rt.len(f, rt.sv(f, "myPath")), 1)) {
						yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), rt.index(rt.sv(f, "myPath"), 1), 0, 5]);
						(rt.modSrcVar(f, "myPath", rt.index(rt.sv(f, "myPath"), 1), subtract));
					}
				}
				i = rt.inc(live(i), 1);
			}
			return 1;
		}
	}
	yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), rt.getStep(f, live(target), 0), 0, 5]);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
	return 0;
}, true);

// /mob/living/carbon/monkey/proc/IsDeadOrIncap  (code/modules/mob/living/carbon/monkey/combat.dm:52)
rt.def("/mob/living/carbon/monkey/proc/IsDeadOrIncap", function IsDeadOrIncap(f: Frame, checkDead: Value) {
	f.vars = () => [checkDead];
	if (live(checkDead) === null) {
		checkDead = 1;
	}
	if (!truthy(rt.sv(f, "canmove"))) {
		return 1;
	}
	if ((rt.le(rt.sv(f, "health"), 0) && truthy(live(checkDead)))) {
		return 1;
	}
	if (truthy(rt.callSrc(f, "IsUnconscious", []))) {
		return 1;
	}
	if (truthy(rt.callSrc(f, "IsStun", []))) {
		return 1;
	}
	if (truthy(rt.sv(f, "stat"))) {
		return 1;
	}
	return 0;
});

// /mob/living/carbon/monkey/proc/battle_screech  (code/modules/mob/living/carbon/monkey/combat.dm:65)  may sleep
rt.def("/mob/living/carbon/monkey/proc/battle_screech", function* battle_screech(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if (!rt.lt(rt.sv(f, "next_battle_screech"), rt.worldTime(f))) return f.dot;
	yield* g.srcCall(f, "emote", rt.op(f, "PickUnweighted", [2], ["roar", "screech"]));
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [7, live(f.src)])), T("/mob/living/carbon/monkey"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.setFv(f, "next_battle_screech", live(M), add(rt.worldTime(f), rt.sv(f, "battle_screech_cooldown")));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/equip_item  (code/modules/mob/living/carbon/monkey/combat.dm:72)  may sleep
rt.def("/mob/living/carbon/monkey/proc/equip_item", function* equip_item(f: Frame, I: Value) {
	let W: Value = null, C: Value = null;
	f.vars = () => [I, W, C];
	if (isEqual(rt.fv(f, "loc", live(I)), live(f.src))) {
		return 1;
	}
	if (truthy(rt.fv(f, "anchored", live(I)))) {
		rt.incAt(rt.sv(f, "blacklistItems"), live(I), 1, true);
		return 0;
	}
	if (truthy((rt.istype(live(I), T("/obj/item/weapon")) ? 1 : 0))) {
		if (rt.ge(rt.gv(f, "force", (W = live(I))), rt.sv(f, "best_force"))) {
			yield* g.srcCall(f, "put_in_hands", live(W));
			rt.setSv(f, "best_force", rt.fv(f, "force", live(W)));
			return 1;
		}
	} else {
		if (truthy((rt.istype(live(I), T("/obj/item/clothing")) ? 1 : 0))) {
			yield* g.srcCall(f, "monkeyDrop", (C = live(I)));
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/carbon/monkey/proc/pickup_and_wear"), live(C)])), 5]);
			return 1;
		} else {
			if ((!truthy((yield* g.srcCall(f, "get_item_for_held_index", 1))) || !truthy((yield* g.srcCall(f, "get_item_for_held_index", 2))))) {
				yield* g.srcCall(f, "put_in_hands", live(I));
				return 1;
			}
		}
	}
	rt.incAt(rt.sv(f, "blacklistItems"), live(I), 1, true);
	return 0;
}, true);

// /mob/living/carbon/monkey/proc/pickup_and_wear  (code/modules/mob/living/carbon/monkey/combat.dm:104)  may sleep
rt.def("/mob/living/carbon/monkey/proc/pickup_and_wear", function* pickup_and_wear(f: Frame, C: Value) {
	f.vars = () => [C];
	if (truthy((yield* g.srcCall(f, "equip_to_appropriate_slot", live(C))))) return f.dot;
	yield* g.srcCall(f, "monkeyDrop", (yield* g.srcCall(f, "get_item_by_slot", live(C))));
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	yield* g.srcCall(f, "equip_to_appropriate_slot", live(C));
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/item/clothing" }] });

// /mob/living/carbon/monkey/proc/resist_restraints  (code/modules/mob/living/carbon/monkey/combat.dm:112)  may sleep
rt.def("/mob/living/carbon/monkey/proc/resist_restraints", function* resist_restraints(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	I = null;
	if (truthy(rt.sv(f, "handcuffed"))) {
		I = rt.sv(f, "handcuffed");
	} else {
		if (truthy(rt.sv(f, "legcuffed"))) {
			I = rt.sv(f, "legcuffed");
		}
	}
	if (!truthy(live(I))) return f.dot;
	yield* g.srcCall(f, "changeNext_move", 100);
	rt.setSv(f, "last_special", add(rt.worldTime(f), 100));
	yield* g.srcCall(f, "cuff_resist", live(I));
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/should_target  (code/modules/mob/living/carbon/monkey/combat.dm:122)
rt.def("/mob/living/carbon/monkey/proc/should_target", function should_target(f: Frame, L: Value) {
	if (isEqual(live(L), live(f.src))) {
		return 0;
	}
	if (truthy(rt.index(rt.sv(f, "enemies"), live(L)))) {
		return 1;
	}
	if ((truthy(rt.sv(f, "aggressive")) && (!truthy((rt.istype(live(L), T("/mob/living/carbon/monkey")) ? 1 : 0)) || truthy(rt.op(f, "Prob", [], [0]))))) {
		return 1;
	}
	return 0;
});

// /mob/living/carbon/monkey/proc/handle_combat  (code/modules/mob/living/carbon/monkey/combat.dm:136)  may sleep
rt.def("/mob/living/carbon/monkey/proc/handle_combat", function* handle_combat(f: Frame) {
	let M: Value = null, around: Value = null, L: Value = null, I: Value = null, H: Value = null, W: Value = null, M_1: Value = null, W_1: Value = null, olddist: Value = null, olddist_0: Value = null;
	let $0: any, $e: any;
	f.vars = () => [M, around, L, I, H, W, M_1, W_1, olddist, olddist_0, $0, $e];
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		return 1;
	}
	if (((truthy(rt.sv(f, "on_fire")) || truthy(rt.sv(f, "buckled"))) || truthy((yield* g.srcCall(f, "restrained"))))) {
		if ((!truthy(rt.sv(f, "resisting")) && truthy(rt.op(f, "Prob", [], [50])))) {
			rt.setSv(f, "resisting", 1);
			yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
			yield* g.srcCall(f, "resist");
		}
	} else {
		rt.setSv(f, "resisting", 0);
	}
	if (truthy((yield* g.srcCall(f, "IsDeadOrIncap")))) {
		return 1;
	}
	if (!truthy(rt.locateIn(f, T("/obj/item/weapon"), rt.sv(f, "held_items")))) {
		rt.setSv(f, "best_force", 0);
	}
	if (((truthy((yield* g.srcCall(f, "restrained"))) || truthy(rt.index(rt.sv(f, "blacklistItems"), rt.sv(f, "pickupTarget")))) || (truthy(rt.sv(f, "pickupTarget")) && truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "pickupTarget")), 2))))) {
		rt.setSv(f, "pickupTarget", null);
	}
	if ((!truthy(rt.sv(f, "resisting")) && truthy(rt.sv(f, "pickupTarget")))) {
		rt.incSrcVar(f, "pickupTimer", 1, true);
		if ((truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "pickupTarget")))) || truthy((yield* g.srcCall(f, "Adjacent", rt.fv(f, "loc", rt.sv(f, "pickupTarget"))))))) {
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/carbon/monkey/proc/walk2derpless"), rt.fv(f, "loc", rt.sv(f, "pickupTarget"))]);
			yield* g.srcCall(f, "drop_all_held_items");
			if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "pickupTarget"))])))) {
				yield* g.srcCall(f, "equip_item", rt.sv(f, "pickupTarget"));
				rt.setSv(f, "pickupTarget", null);
				rt.setSv(f, "pickupTimer", 0);
			} else {
				if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", rt.sv(f, "pickupTarget"))])))) {
					M = rt.fv(f, "loc", rt.sv(f, "pickupTarget"));
					if (!truthy(rt.sv(f, "pickpocketing"))) {
						rt.setSv(f, "pickpocketing", 1);
						yield* g.callName(f, live(M), "visible_message", [fmt("＀ starts trying to take ＀ from ＀", [live(f.src), rt.sv(f, "pickupTarget"), live(M)]), fmt("＀ tries to take ＀!", [live(f.src), rt.sv(f, "pickupTarget")])]);
						yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/carbon/monkey/proc/pickpocket"), live(M)]);
					}
				}
			}
		} else {
			if (rt.ge(rt.sv(f, "pickupTimer"), 8)) {
				rt.incAt(rt.sv(f, "blacklistItems"), rt.sv(f, "pickupTarget"), 1, true);
				rt.setSv(f, "pickupTarget", null);
				rt.setSv(f, "pickupTimer", 0);
			} else {
				yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/carbon/monkey/proc/walk2derpless"), rt.fv(f, "loc", rt.sv(f, "pickupTarget"))]);
			}
		}
		return 1;
	}
	if ((truthy(rt.sv(f, "pulledby")) && (!isEqual(rt.sv(f, "mode"), 0) || truthy(rt.op(f, "Prob", [], [5]))))) {
		if (truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "pulledby"))))) {
			rt.setSv(f, "a_intent", "disarm");
			yield* g.srcCall(f, "monkey_attack", rt.sv(f, "pulledby"));
			yield* g.srcCall(f, "retaliate", rt.sv(f, "pulledby"));
			return 1;
		}
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		around = (yield* g.call(f, P("/proc/view"), null, [live(f.src), 9]));
		rt.setSv(f, "bodyDisposal", rt.locateIn(f, T("/obj/machinery/disposal"), live(around)));
		L = null;
		rt.forList(f, 0, live(around), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (truthy((yield* g.srcCall(f, "should_target", live(L))))) {
				if (isEqual(rt.fv(f, "stat", live(L)), 0)) {
					yield* g.srcCall(f, "battle_screech");
					yield* g.srcCall(f, "retaliate", live(L));
					return 1;
				} else {
					if (truthy(rt.sv(f, "bodyDisposal"))) {
						rt.setSv(f, "target", live(L));
						rt.setSv(f, "mode", 3);
						return 1;
					}
				}
			}
		}
		rt.endFor(f, 0);
		if ((!truthy(rt.sv(f, "pickupTarget")) && truthy(rt.op(f, "Prob", [], [5])))) {
			if ((truthy((I = rt.locateIn(f, T("/obj/item"), (yield* g.call(f, P("/proc/oview"), null, [5, live(f.src)]))))) && !truthy(rt.index(rt.sv(f, "blacklistItems"), live(I))))) {
				rt.setSv(f, "pickupTarget", live(I));
			}
		}
		if ((!truthy(rt.sv(f, "pickupTarget")) && truthy(rt.op(f, "Prob", [], [5])))) {
			if (truthy((H = rt.locateIn(f, T("/mob/living/carbon/human"), (yield* g.call(f, P("/proc/oview"), null, [5, live(f.src)])))))) {
				rt.setSv(f, "pickupTarget", rt.op(f, "PickUnweighted", [1], [rt.fv(f, "held_items", live(H))]));
			}
		}
		if (!truthy(rt.sv(f, "resisting"))) {
			yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
		}
		return (yield* g.srcCall(f, "IsStandingStill"));
	} else if ($0 === 1) {
		if (rt.lt(rt.sv(f, "health"), 50)) {
			rt.setSv(f, "mode", 2);
			return 1;
		}
		if (rt.sv(f, "target") !== null) {
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/carbon/monkey/proc/walk2derpless"), rt.sv(f, "target")]);
		}
		if ((!truthy(rt.sv(f, "pickupTarget")) && truthy(rt.op(f, "Prob", [], [20])))) {
			if (((truthy((W = rt.locateIn(f, T("/obj/item/weapon"), (yield* g.call(f, P("/proc/oview"), null, [2, live(f.src)]))))) && !truthy(rt.index(rt.sv(f, "blacklistItems"), live(W)))) && rt.gt(rt.fv(f, "force", live(W)), rt.sv(f, "best_force")))) {
				rt.setSv(f, "pickupTarget", live(W));
			}
		}
		around = (yield* g.call(f, P("/proc/view"), null, [live(f.src), 9]));
		M_1 = null;
		rt.forList(f, 0, live(around), T("/mob/living/carbon/monkey"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M_1 = $e;
			if ((isEqual(rt.fv(f, "mode", live(M_1)), 0) && truthy(rt.op(f, "Prob", [], [25])))) {
				yield* g.callName(f, live(M_1), "battle_screech", []);
				rt.setFv(f, "target", live(M_1), rt.sv(f, "target"));
				rt.setFv(f, "mode", live(M_1), 1);
			}
		}
		rt.endFor(f, 0);
		L = null;
		rt.forList(f, 0, live(around), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if ((((!isEqual(live(L), rt.sv(f, "target")) && truthy((yield* g.srcCall(f, "should_target", live(L))))) && isEqual(rt.fv(f, "stat", live(L)), 0)) && truthy(rt.op(f, "Prob", [], [25])))) {
				rt.setSv(f, "target", live(L));
				return 1;
			}
		}
		rt.endFor(f, 0);
		if (rt.ge(rt.sv(f, "frustration"), 8)) {
			yield* g.srcCall(f, "back_to_idle");
			return 1;
		}
		if ((truthy(rt.sv(f, "target")) && isEqual(rt.fv(f, "stat", rt.sv(f, "target")), 0))) {
			if ((truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "target")))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "target"))]))))) {
				if ((truthy((W_1 = rt.locateIn(f, T("/obj/item/weapon"), rt.fv(f, "held_items", rt.sv(f, "target"))))) && truthy(rt.op(f, "Prob", [], [50])))) {
					rt.setSv(f, "pickupTarget", live(W_1));
					rt.setSv(f, "a_intent", "disarm");
					yield* g.srcCall(f, "monkey_attack", rt.sv(f, "target"));
				} else {
					rt.setSv(f, "a_intent", "harm");
					yield* g.srcCall(f, "monkey_attack", rt.sv(f, "target"));
				}
				return 1;
			} else {
				olddist = (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "target")]));
				if (rt.ge((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "target")])), live(olddist))) {
					rt.incSrcVar(f, "frustration", 1, true);
				} else {
					rt.setSv(f, "frustration", 0);
				}
			}
		} else {
			yield* g.srcCall(f, "back_to_idle");
		}
	} else if ($0 === 2) {
		around = (yield* g.call(f, P("/proc/view"), null, [live(f.src), 4]));
		rt.setSv(f, "target", null);
		L = null;
		rt.forList(f, 0, live(around), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if ((truthy(rt.index(rt.sv(f, "enemies"), live(L))) && isEqual(rt.fv(f, "stat", live(L)), 0))) {
				rt.setSv(f, "target", live(L));
			}
		}
		rt.endFor(f, 0);
		if (rt.sv(f, "target") !== null) {
			yield* g.call(f, P("/proc/walk_away"), null, [live(f.src), rt.sv(f, "target"), 9, 5]);
		} else {
			yield* g.srcCall(f, "back_to_idle");
		}
		return 1;
	} else if ($0 === 3) {
		if (((!truthy(rt.sv(f, "target")) || !truthy(rt.sv(f, "bodyDisposal"))) || rt.ge(rt.sv(f, "frustration"), 16))) {
			yield* g.srcCall(f, "back_to_idle");
			return 1;
		}
		if ((!isEqual(rt.fv(f, "pulledby", rt.sv(f, "target")), live(f.src)) && !truthy((rt.istype(rt.fv(f, "pulledby", rt.sv(f, "target")), T("/mob/living/carbon/monkey")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/carbon/monkey/proc/walk2derpless"), rt.fv(f, "loc", rt.sv(f, "target"))]);
			if ((truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "target")))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "target"))]))))) {
				rt.setSv(f, "a_intent", "grab");
				yield* g.callName(f, rt.sv(f, "target"), "grabbedby", [live(f.src)]);
			} else {
				olddist_0 = (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "target")]));
				if (rt.ge((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "target")])), live(olddist_0))) {
					rt.incSrcVar(f, "frustration", 1, true);
				} else {
					rt.setSv(f, "frustration", 0);
				}
			}
		} else {
			if (!truthy(rt.sv(f, "disposing_body"))) {
				yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/carbon/monkey/proc/walk2derpless"), rt.fv(f, "loc", rt.sv(f, "bodyDisposal"))]);
				if (truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "bodyDisposal"))))) {
					rt.setSv(f, "disposing_body", 1);
					yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/carbon/monkey/proc/stuff_mob_in")])), 5]);
				} else {
					olddist_0 = (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "bodyDisposal")]));
					if (rt.ge((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "bodyDisposal")])), live(olddist_0))) {
						rt.incSrcVar(f, "frustration", 1, true);
					} else {
						rt.setSv(f, "frustration", 0);
					}
				}
			}
		}
		return 1;
	}
	return (yield* g.srcCall(f, "IsStandingStill"));
}, true);

// /mob/living/carbon/monkey/proc/pickpocket  (code/modules/mob/living/carbon/monkey/combat.dm:356)  may sleep
rt.def("/mob/living/carbon/monkey/proc/pickpocket", function* pickpocket(f: Frame, M: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [M, I, $e];
	if ((truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.src), live(M), 25]))) && truthy(rt.sv(f, "pickupTarget")))) {
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(M)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (isEqual(live(I), rt.sv(f, "pickupTarget"))) {
				yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ snatches ＀ from ＀.</span>", [live(f.src), rt.sv(f, "pickupTarget"), live(M)]), fmt("<span class='userdanger'>＀ snatched ＀!</span>", [live(f.src), rt.sv(f, "pickupTarget")])]);
				if ((truthy((yield* g.callName(f, live(M), "temporarilyRemoveItemFromInventory", [rt.sv(f, "pickupTarget")]))) && !(!truthy(rt.sv(f, "pickupTarget")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "pickupTarget")))))) {
					yield* g.srcCall(f, "equip_item", rt.sv(f, "pickupTarget"));
				} else {
					yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ tried to snatch ＀ from ＀, but failed!</span>", [live(f.src), rt.sv(f, "pickupTarget"), live(M)]), fmt("<span class='userdanger'>＀ tried to grab ＀!</span>", [live(f.src), rt.sv(f, "pickupTarget")])]);
				}
			}
		}
		rt.endFor(f, 0);
	}
	rt.setSv(f, "pickpocketing", 0);
	rt.setSv(f, "pickupTarget", null);
	rt.setSv(f, "pickupTimer", 0);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// /mob/living/carbon/monkey/proc/stuff_mob_in  (code/modules/mob/living/carbon/monkey/combat.dm:369)  may sleep
rt.def("/mob/living/carbon/monkey/proc/stuff_mob_in", function* stuff_mob_in(f: Frame) {
	if (((truthy(rt.sv(f, "bodyDisposal")) && truthy(rt.sv(f, "target"))) && truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "bodyDisposal")))))) {
		yield* g.callName(f, rt.sv(f, "bodyDisposal"), "stuff_mob_in", [rt.sv(f, "target"), live(f.src)]);
	}
	rt.setSv(f, "disposing_body", 0);
	yield* g.srcCall(f, "back_to_idle");
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/back_to_idle  (code/modules/mob/living/carbon/monkey/combat.dm:377)  may sleep
rt.def("/mob/living/carbon/monkey/proc/back_to_idle", function* back_to_idle(f: Frame) {
	if (truthy(rt.sv(f, "pulling"))) {
		yield* g.srcCall(f, "stop_pulling");
	}
	rt.setSv(f, "mode", 0);
	rt.setSv(f, "target", null);
	rt.setSv(f, "a_intent", "help");
	rt.setSv(f, "frustration", 0);
	yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/monkey_attack  (code/modules/mob/living/carbon/monkey/combat.dm:387)  may sleep
rt.def("/mob/living/carbon/monkey/proc/monkey_attack", function* monkey_attack(f: Frame, L: Value) {
	let Weapon: Value = null;
	f.vars = () => [L, Weapon];
	if (truthy((Weapon = rt.locateIn(f, T("/obj/item/weapon"), rt.sv(f, "held_items"))))) {
		yield* g.callName(f, live(L), "attackby", [live(Weapon), live(f.src)]);
	} else {
		yield* g.callName(f, live(L), "attack_paw", [live(f.src)]);
	}
	if (truthy(rt.sv(f, "aggressive"))) {
		return live(f.dot);
	}
	if (!truthy(rt.index(rt.sv(f, "enemies"), live(L)))) {
		if ((isEqual(rt.sv(f, "target"), live(L)) && truthy(rt.op(f, "Prob", [], [25])))) {
			yield* g.srcCall(f, "back_to_idle");
		}
		return live(f.dot);
	}
	if (truthy(rt.op(f, "Prob", [], [25]))) {
		rt.incAt(rt.sv(f, "enemies"), live(L), -1, true);
	}
	if (!rt.le(rt.index(rt.sv(f, "enemies"), live(L)), 0)) return f.dot;
	yield* g.callName(f, rt.sv(f, "enemies"), "Remove", [live(L)]);
	if (!isEqual(rt.sv(f, "target"), live(L))) return f.dot;
	yield* g.srcCall(f, "back_to_idle");
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/retaliate  (code/modules/mob/living/carbon/monkey/combat.dm:417)  may sleep
rt.def("/mob/living/carbon/monkey/proc/retaliate", function* retaliate(f: Frame, L: Value) {
	f.vars = () => [L];
	rt.setSv(f, "mode", 1);
	rt.setSv(f, "target", live(L));
	rt.modAt(rt.sv(f, "enemies"), live(L), 4, add);
	if (isEqual(rt.sv(f, "a_intent"), "harm")) return f.dot;
	yield* g.srcCall(f, "battle_screech");
	rt.setSv(f, "a_intent", "harm");
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/attack_hand  (code/modules/mob/living/carbon/monkey/combat.dm:425)  may sleep
rt.def("/mob/living/carbon/monkey/proc/attack_hand", function* attack_hand(f: Frame) {
	if ((isEqual(rt.fv(f, "a_intent", live(f.args[0])), "harm") && truthy(rt.op(f, "Prob", [], [95])))) {
		yield* g.srcCall(f, "retaliate", live(f.args[0]));
	} else {
		if ((isEqual(rt.fv(f, "a_intent", live(f.args[0])), "disarm") && truthy(rt.op(f, "Prob", [], [20])))) {
			yield* g.srcCall(f, "retaliate", live(f.args[0]));
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["L"] });

// /mob/living/carbon/monkey/proc/attack_paw  (code/modules/mob/living/carbon/monkey/combat.dm:432)  may sleep
rt.def("/mob/living/carbon/monkey/proc/attack_paw", function* attack_paw(f: Frame) {
	if ((isEqual(rt.fv(f, "a_intent", live(f.args[0])), "harm") && truthy(rt.op(f, "Prob", [], [95])))) {
		yield* g.srcCall(f, "retaliate", live(f.args[0]));
	} else {
		if ((isEqual(rt.fv(f, "a_intent", live(f.args[0])), "disarm") && truthy(rt.op(f, "Prob", [], [20])))) {
			yield* g.srcCall(f, "retaliate", live(f.args[0]));
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["L"] });

// /mob/living/carbon/monkey/proc/attackby  (code/modules/mob/living/carbon/monkey/combat.dm:439)  may sleep
rt.def("/mob/living/carbon/monkey/proc/attackby", function* attackby(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((truthy(rt.fv(f, "force", live(f.args[0]))) && !truthy(rt.sv(f, "target"))) && !isEqual(rt.fv(f, "damtype", live(f.args[0])), "stamina"))) return f.dot;
	yield* g.srcCall(f, "retaliate", live(f.args[1]));
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /mob/living/carbon/monkey/proc/bullet_act  (code/modules/mob/living/carbon/monkey/combat.dm:444)  may sleep
rt.def("/mob/living/carbon/monkey/proc/bullet_act", function* bullet_act(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/beam")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/bullet")) ? 1 : 0)))) {
		if ((isEqual(rt.fv(f, "damage_type", live(f.args[0])), "fire") || isEqual(rt.fv(f, "damage_type", live(f.args[0])), "brute"))) {
			if ((!truthy(rt.fv(f, "nodamage", live(f.args[0]))) && rt.lt(rt.fv(f, "damage", live(f.args[0])), rt.fv(f, "health", live(f.src))))) {
				yield* g.srcCall(f, "retaliate", rt.fv(f, "firer", live(f.args[0])));
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["Proj"] });

// /mob/living/carbon/monkey/proc/hitby  (code/modules/mob/living/carbon/monkey/combat.dm:451)  may sleep
rt.def("/mob/living/carbon/monkey/proc/hitby", function* hitby(f: Frame) {
	let I: Value = null, H: Value = null;
	f.vars = () => [I, H];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) {
		if (((rt.lt(rt.gv(f, "throwforce", (I = live(f.args[0]))), rt.fv(f, "health", live(f.src))) && truthy(rt.fv(f, "thrownby", live(I)))) && truthy((rt.istype(rt.fv(f, "thrownby", live(I)), T("/mob/living/carbon/human")) ? 1 : 0)))) {
			yield* g.srcCall(f, "retaliate", (H = rt.fv(f, "thrownby", live(I))));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM", "skipcatch", "hitpush", "blocked"] });

// /mob/living/carbon/monkey/proc/Crossed  (code/modules/mob/living/carbon/monkey/combat.dm:459)  may sleep
rt.def("/mob/living/carbon/monkey/proc/Crossed", function* Crossed(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (((!truthy((yield* g.srcCall(f, "IsDeadOrIncap"))) && truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) && truthy(rt.sv(f, "target")))) {
		if ((!truthy((rt.istype((M = live(f.args[0])), T("/mob/living/carbon/monkey")) ? 1 : 0)) || !truthy(live(M)))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "knockOver", live(M));
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM"] });

// /mob/living/carbon/monkey/proc/monkeyDrop  (code/modules/mob/living/carbon/monkey/combat.dm:469)  may sleep
rt.def("/mob/living/carbon/monkey/proc/monkeyDrop", function* monkeyDrop(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy(live(A))) return f.dot;
	yield* g.srcCall(f, "dropItemToGround", live(A), 1);
	yield* g.srcCall(f, "update_icons");
	return f.dot;
}, true);
