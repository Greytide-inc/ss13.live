// From code/modules/mob/living/carbon/alien/special/facehugger.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8587, "/obj/item/clothing/mask/facehugger", "/obj/item/clothing/mask", {
	stat: 0,
	sterile: 0,
	real: 1,
	strength: 5,
	attached: 0,
	flags: 8,
	throw_range: 5,
	name: "alien",
	desc: "It has some sort of a tube at the end of its tail.",
	icon: rt.rsc("icons/mob/alien.dmi"),
	icon_state: "facehugger",
	item_state: "facehugger",
	w_class: 1,
	tint: 3,
	flags_cover: 10,
	layer: 4,
	obj_integrity: 100,
	max_integrity: 100,
});

// /obj/item/clothing/mask/facehugger/proc/take_damage  (code/modules/mob/living/carbon/alien/special/facehugger.dm:49)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!rt.lt(rt.sv(f, "obj_integrity"), 90)) return f.dot;
	yield* g.srcCall(f, "Die");
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// /obj/item/clothing/mask/facehugger/proc/attackby  (code/modules/mob/living/carbon/alien/special/facehugger.dm:54)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	f.vars = () => [O, user, params];
	return (yield* g.callName(f, live(O), "attack_obj", [live(f.src), live(user)]));
}, true);

// /obj/item/clothing/mask/facehugger/proc/attack_alien  (code/modules/mob/living/carbon/alien/special/facehugger.dm:57)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_hand", live(user));
	return live(f.dot);
}, true);

// /obj/item/clothing/mask/facehugger/proc/attack_hand  (code/modules/mob/living/carbon/alien/special/facehugger.dm:61)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/attack_hand", function* attack_hand(f: Frame) {
	if (((isEqual(rt.sv(f, "stat"), 0) && !truthy(rt.sv(f, "sterile"))) && !truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/alien")) ? 1 : 0)))) {
		if (truthy((yield* g.srcCall(f, "Leap", live(f.args[0]))))) {
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/mask/facehugger/proc/attack  (code/modules/mob/living/carbon/alien/special/facehugger.dm:67)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/attack", function* attack(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.src), rt.getStep(f, live(f.args[0]), 0)])))) return f.dot;
	yield* g.srcCall(f, "Leap", live(f.args[0]));
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/clothing/mask/facehugger/proc/examine  (code/modules/mob/living/carbon/alien/special/facehugger.dm:72)
rt.def("/obj/item/clothing/mask/facehugger/proc/examine", function examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "real"))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "stat");
	if ($0 === 2 || $0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='boldannounce'>＀ is not moving.</span>", [live(f.src)])]);
	} else if ($0 === 0) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='boldannounce'>＀ seems to be active!</span>", [live(f.src)])]);
	}
	if (!truthy(rt.sv(f, "sterile"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='boldannounce'>It looks like the proboscis has been removed.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/clothing/mask/facehugger/proc/temperature_expose  (code/modules/mob/living/carbon/alien/special/facehugger.dm:85)
rt.def("/obj/item/clothing/mask/facehugger/proc/temperature_expose", function temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	rt.callSrc(f, "Die", []);
	return f.dot;
});

// /obj/item/clothing/mask/facehugger/proc/equipped  (code/modules/mob/living/carbon/alien/special/facehugger.dm:89)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/equipped", function* equipped(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.srcCall(f, "Attach", live(M));
	return f.dot;
}, true);

// /obj/item/clothing/mask/facehugger/proc/Crossed  (code/modules/mob/living/carbon/alien/special/facehugger.dm:92)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/Crossed", function* Crossed(f: Frame, target: Value) {
	f.vars = () => [target];
	yield* g.srcCall(f, "HasProximity", live(target));
	return live(f.dot);
}, true);

// /obj/item/clothing/mask/facehugger/proc/on_found  (code/modules/mob/living/carbon/alien/special/facehugger.dm:96)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/on_found", function* on_found(f: Frame, finder: Value) {
	f.vars = () => [finder];
	if (isEqual(rt.sv(f, "stat"), 0)) {
		return (yield* g.srcCall(f, "HasProximity", live(finder)));
	}
	return 0;
}, true);

// /obj/item/clothing/mask/facehugger/proc/HasProximity  (code/modules/mob/living/carbon/alien/special/facehugger.dm:101)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/HasProximity", function* HasProximity(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if ((truthy((yield* g.call(f, P("/proc/CanHug"), null, [live(AM)]))) && truthy((yield* g.srcCall(f, "Adjacent", live(AM)))))) {
		return (yield* g.srcCall(f, "Leap", live(AM)));
	}
	return 0;
}, true);

// /obj/item/clothing/mask/facehugger/proc/throw_at  (code/modules/mob/living/carbon/alien/special/facehugger.dm:106)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/throw_at", function* throw_at(f: Frame) {
	if (live(f.args[4]) === null) {
		f.args[4] = 1;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "stat"), 0)) return f.dot;
	rt.setSv(f, "icon_state", fmt("＀_thrown", [rt.initial(f, live(f.src), "icon_state")]));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/mask/facehugger/proc/clear_throw_icon_state")])), 15]);
	return f.dot;
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// /obj/item/clothing/mask/facehugger/proc/clear_throw_icon_state  (code/modules/mob/living/carbon/alien/special/facehugger.dm:113)
rt.def("/obj/item/clothing/mask/facehugger/proc/clear_throw_icon_state", function clear_throw_icon_state(f: Frame) {
	if (!isEqual(rt.sv(f, "icon_state"), fmt("＀_thrown", [rt.initial(f, live(f.src), "icon_state")]))) return f.dot;
	rt.setSv(f, "icon_state", fmt("＀", [rt.initial(f, live(f.src), "icon_state")]));
	return f.dot;
});

// /obj/item/clothing/mask/facehugger/proc/throw_impact  (code/modules/mob/living/carbon/alien/special/facehugger.dm:117)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/throw_impact", function* throw_impact(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.sv(f, "stat"), 0)) return f.dot;
	rt.setSv(f, "icon_state", fmt("＀", [rt.initial(f, live(f.src), "icon_state")]));
	yield* g.srcCall(f, "Leap", live(f.args[0]));
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

// /obj/item/clothing/mask/facehugger/proc/valid_to_attach  (code/modules/mob/living/carbon/alien/special/facehugger.dm:125)
rt.def("/obj/item/clothing/mask/facehugger/proc/valid_to_attach", function valid_to_attach(f: Frame, M: Value) {
	let target: Value = null;
	f.vars = () => [target];
	if (!isEqual(rt.sv(f, "stat"), 0)) {
		return 0;
	}
	if (truthy(rt.sv(f, "attached"))) {
		return 0;
	}
	if ((!truthy((rt.istype(live(M), T("/mob/living/simple_animal/pet/dog/corgi")) ? 1 : 0)) && !truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0)))) {
		return 0;
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		if ((truthy((rt.istype(live(M), T("/mob/living/carbon/alien")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/carbon/true_devil")) ? 1 : 0)))) {
			return 0;
		}
		if (!truthy(rt.callName(f, (target = live(M)), "get_bodypart", ["head"]))) {
			return 0;
		}
		if ((truthy(rt.callName(f, live(target), "getorgan", [T("/obj/item/organ/alien/hivenode")])) || truthy(rt.callName(f, live(target), "getorgan", [T("/obj/item/organ/body_egg/alien_embryo")])))) {
			return 0;
		}
		return 1;
	} else {
		if (!truthy((rt.istype(live(M), T("/mob/living/simple_animal/pet/dog/corgi")) ? 1 : 0))) return f.dot;
		return 1;
	}
	return f.dot;
});

// /obj/item/clothing/mask/facehugger/proc/Leap  (code/modules/mob/living/carbon/alien/special/facehugger.dm:149)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/Leap", function* Leap(f: Frame, M: Value) {
	let target: Value = null, H: Value = null, W: Value = null;
	f.vars = () => [M, target, H, W];
	if (!truthy((yield* g.srcCall(f, "valid_to_attach", live(M))))) {
		return 0;
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "wear_mask", (target = live(M)))) && truthy((rt.istype(rt.fv(f, "wear_mask", live(target)), T("/obj/item/clothing/mask/facehugger")) ? 1 : 0)))) {
			return 0;
		}
	}
	yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ leaps at ＀'s face!</span>", [live(f.src), live(M)]), fmt("<span class='userdanger'>＀ leaps at ＀'s face!</span>", [live(f.src), live(M)])]);
	if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		target = live(M);
		if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (H = live(M)), "is_mouth_covered", ["head_only", 1], rt.Args.Named)))) {
				yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀ smashes against ＀'s ＀!</span>", [live(f.src), live(H), rt.fv(f, "head", live(H))]), fmt("<span class='userdanger'>＀ smashes against ＀'s ＀!</span>", [live(f.src), live(H), rt.fv(f, "head", live(H))])]);
				yield* g.srcCall(f, "Die");
				return 0;
			}
		}
		if (truthy(rt.fv(f, "wear_mask", live(target)))) {
			W = rt.fv(f, "wear_mask", live(target));
			if (truthy((yield* g.callName(f, live(target), "dropItemToGround", [live(W)])))) {
				yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ tears ＀ off of ＀'s face!</span>", [live(f.src), live(W), live(target)]), fmt("<span class='userdanger'>＀ tears ＀ off of ＀'s face!</span>", [live(f.src), live(W), live(target)])]);
			}
		}
		yield* g.callName(f, live(target), "equip_to_slot_if_possible", [live(f.src), 2, 0, 1, 1]);
	}
	return 1;
}, true);

// /obj/item/clothing/mask/facehugger/proc/Attach  (code/modules/mob/living/carbon/alien/special/facehugger.dm:180)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/Attach", function* Attach(f: Frame, M: Value) {
	let C: Value = null;
	f.vars = () => [M, C];
	if (!truthy((yield* g.srcCall(f, "valid_to_attach", live(M))))) {
		return live(f.dot);
	}
	rt.incSrcVar(f, "attached", 1, true);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/mask/facehugger/proc/detach")])), 150]);
	if (truthy((rt.istype(live(M), T("/mob/living/simple_animal/pet/dog/corgi")) ? 1 : 0))) {
		rt.setSv(f, "loc", (C = live(M)));
		rt.setFv(f, "facehugger", live(C), live(f.src));
		yield* g.callName(f, live(C), "regenerate_icons", []);
	}
	if (!truthy(rt.sv(f, "sterile"))) {
		yield* g.callName(f, live(M), "take_bodypart_damage", [rt.sv(f, "strength"), 0]);
		yield* g.callName(f, live(M), "Unconscious", [499.9999694824219]);
	}
	yield* g.srcCall(f, "GoIdle");
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/mask/facehugger/proc/Impregnate"), live(M)])), (yield* g.call(f, P("/proc/rand"), null, [100, 150]))]);
	return f.dot;
}, true);

// /obj/item/clothing/mask/facehugger/proc/Impregnate  (code/modules/mob/living/carbon/alien/special/facehugger.dm:205)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/Impregnate", function* Impregnate(f: Frame, target: Value) {
	let C: Value = null, LC: Value = null, C_1: Value = null;
	f.vars = () => [target, C, LC, C_1];
	if ((!truthy(live(target)) || isEqual(rt.fv(f, "stat", live(target)), 2))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/mob/living/carbon")) ? 1 : 0))) {
		if (!isEqual(rt.gv(f, "wear_mask", (C = live(target))), live(f.src))) {
			return live(f.dot);
		}
	}
	if (!truthy(rt.sv(f, "sterile"))) {
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ falls limp after violating ＀'s face!</span>", [live(f.src), live(target)]), fmt("<span class='userdanger'>＀ falls limp after violating ＀'s face!</span>", [live(f.src), live(target)])]);
		yield* g.srcCall(f, "Die");
		rt.setSv(f, "icon_state", fmt("＀_impregnated", [rt.initial(f, live(f.src), "icon_state")]));
		if (((!truthy((LC = (yield* g.callName(f, live(target), "get_bodypart", ["chest"])))) || !isEqual(rt.fv(f, "status", live(LC)), 2)) && !truthy((yield* g.callName(f, live(target), "getorgan", [T("/obj/item/organ/body_egg/alien_embryo")]))))) {
			yield* g.new_(f, T("/obj/item/organ/body_egg/alien_embryo"), [live(target)]);
		}
		if (truthy((rt.istype(live(target), T("/mob/living/simple_animal/pet/dog/corgi")) ? 1 : 0))) {
			C_1 = live(target);
			rt.setFv(f, "loc", live(f.src), rt.getStep(f, live(C_1), 0));
			rt.setFv(f, "facehugger", live(C_1), null);
		}
	} else {
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ violates ＀'s face!</span>", [live(f.src), live(target)]), fmt("<span class='userdanger'>＀ violates ＀'s face!</span>", [live(f.src), live(target)])]);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// /obj/item/clothing/mask/facehugger/proc/GoActive  (code/modules/mob/living/carbon/alien/special/facehugger.dm:234)
rt.def("/obj/item/clothing/mask/facehugger/proc/GoActive", function GoActive(f: Frame) {
	if ((isEqual(rt.sv(f, "stat"), 2) || isEqual(rt.sv(f, "stat"), 0))) {
		return live(f.dot);
	}
	rt.setSv(f, "stat", 0);
	rt.setSv(f, "icon_state", fmt("＀", [rt.initial(f, live(f.src), "icon_state")]));
	return f.dot;
});

// /obj/item/clothing/mask/facehugger/proc/GoIdle  (code/modules/mob/living/carbon/alien/special/facehugger.dm:241)  may sleep
rt.def("/obj/item/clothing/mask/facehugger/proc/GoIdle", function* GoIdle(f: Frame) {
	if ((isEqual(rt.sv(f, "stat"), 2) || isEqual(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	rt.setSv(f, "stat", 1);
	rt.setSv(f, "icon_state", fmt("＀_inactive", [rt.initial(f, live(f.src), "icon_state")]));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/mask/facehugger/proc/GoActive")])), (yield* g.call(f, P("/proc/rand"), null, [200, 400]))]);
	return f.dot;
}, true);

// /obj/item/clothing/mask/facehugger/proc/Die  (code/modules/mob/living/carbon/alien/special/facehugger.dm:250)
rt.def("/obj/item/clothing/mask/facehugger/proc/Die", function Die(f: Frame) {
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", fmt("＀_dead", [rt.initial(f, live(f.src), "icon_state")]));
	rt.setSv(f, "item_state", "facehugger_inactive");
	rt.setSv(f, "stat", 2);
	rt.callSrc(f, "visible_message", [fmt("<span class='danger'>＀ curls up into a ball!</span>", [live(f.src)])]);
	return f.dot;
});

// /proc/CanHug  (code/modules/mob/living/carbon/alien/special/facehugger.dm:260)
rt.def("/proc/CanHug", function CanHug(f: Frame, M: Value) {
	let C: Value = null, H: Value = null;
	f.vars = () => [C, H];
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		return 0;
	}
	if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
		return 0;
	}
	if (truthy(rt.callName(f, live(M), "getorgan", [T("/obj/item/organ/alien/hivenode")]))) {
		return 0;
	}
	if ((truthy((rt.istype(live(M), T("/mob/living/simple_animal/pet/dog/corgi")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/carbon/monkey")) ? 1 : 0)))) {
		return 1;
	}
	if ((truthy((rt.istype((C = live(M)), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy((rt.isIn(f, 2, rt.gv(f, "no_equip", rt.gv(f, "species", rt.fv(f, "dna", live(C))))) ? 1 : 0)))) {
		if (truthy(rt.callName(f, (H = live(C)), "is_mouth_covered", ["head_only", 1], rt.Args.Named))) {
			return 0;
		}
		return 1;
	}
	return 0;
});
