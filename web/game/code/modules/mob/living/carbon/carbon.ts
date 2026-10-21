// From code/modules/mob/living/carbon/carbon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/Initialize  (code/modules/mob/living/carbon/carbon.dm:5)  may sleep
rt.def("/mob/living/carbon/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.srcCall(f, "create_reagents", 1000);
	yield* g.srcCall(f, "update_body_parts");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/proc/Destroy  (code/modules/mob/living/carbon/carbon.dm:10)  may sleep
rt.def("/mob/living/carbon/proc/Destroy", function* Destroy(f: Frame) {
	let guts: Value = null, food: Value = null, BP: Value = null, imp: Value = null;
	let $e: any;
	f.vars = () => [guts, food, BP, imp, $e];
	guts = null;
	rt.forList(f, 0, rt.sv(f, "internal_organs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		guts = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(guts)]);
	}
	rt.endFor(f, 0);
	food = null;
	rt.forList(f, 0, rt.sv(f, "stomach_contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		food = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(food)]);
	}
	rt.endFor(f, 0);
	BP = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		BP = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(BP)]);
	}
	rt.endFor(f, 0);
	imp = null;
	rt.forList(f, 0, rt.sv(f, "implants"));
	while (($e = rt.next(f, 0)) !== undefined) {
		imp = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(imp)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "bodyparts", rt.list());
	yield* g.srcCall(f, "remove_from_all_data_huds");
	if (truthy(rt.sv(f, "dna"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "dna")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/carbon/proc/relaymove  (code/modules/mob/living/carbon/carbon.dm:25)  may sleep
rt.def("/mob/living/carbon/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	let I: Value = null, d: Value = null, BP: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, direction, I, d, BP, A, $e];
	if (!truthy((rt.isIn(f, live(user), rt.fv(f, "stomach_contents", live(f.src))) ? 1 : 0))) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [40]))) return f.dot;
	if (truthy(rt.op(f, "Prob", [], [25]))) {
		yield* g.srcCall(f, "audible_message", fmt("<span class='warning'>You hear something rumbling inside ＀'s stomach...</span>", [live(f.src)]), "<span class='warning'>You hear something rumbling.</span>", 4, "<span class='userdanger'>Something is rumbling inside your stomach!</span>");
	}
	if (!(truthy((I = (yield* g.callName(f, live(user), "get_active_held_item", [])))) && truthy(rt.fv(f, "force", live(I))))) return f.dot;
	d = (yield* g.call(f, P("/proc/rand"), null, [(yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "force", live(I)), 4)])), rt.fv(f, "force", live(I))]));
	if (truthy((yield* g.callName(f, (BP = (yield* g.srcCall(f, "get_bodypart", "chest"))), "receive_damage", [live(d), 0])))) {
		yield* g.srcCall(f, "update_damage_overlays");
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ attacks ＀'s stomach wall with the ＀!</span>", [live(user), live(f.src), rt.fv(f, "name", live(I))]), fmt("<span class='userdanger'>＀ attacks your stomach wall with the ＀!</span>", [live(user), rt.fv(f, "name", live(I))]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/effects/attackblob.ogg"), 50, 1]);
	if (!truthy(rt.op(f, "Prob", [], [subtract((yield* g.callName(f, live(f.src), "getBruteLoss", [])), 50)]))) return f.dot;
	A = null;
	rt.forList(f, 0, rt.sv(f, "stomach_contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.setFv(f, "loc", live(A), rt.sv(f, "loc"));
		yield* g.callName(f, rt.sv(f, "stomach_contents"), "Remove", [live(A)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(f.src), "gib", []);
	return f.dot;
}, true);

// /mob/living/carbon/proc/swap_hand  (code/modules/mob/living/carbon/carbon.dm:49)
rt.def("/mob/living/carbon/proc/swap_hand", function swap_hand(f: Frame, held_index: Value) {
	let item_in_hand: Value = null, oindex: Value = null, H: Value = null;
	f.vars = () => [held_index, item_in_hand, oindex, H];
	if (!truthy(live(held_index))) {
		held_index = add(rt.modulus(rt.sv(f, "active_hand_index"), rt.len(f, rt.sv(f, "held_items"))), 1);
	}
	if (truthy((item_in_hand = rt.callName(f, live(f.src), "get_active_held_item", [])))) {
		if (truthy((rt.istype(live(item_in_hand), T("/obj/item/weapon/twohanded")) ? 1 : 0))) {
			if (isEqual(rt.fv(f, "wielded", live(item_in_hand)), 1)) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>Your other hand is too busy holding the ＀</span>", [rt.fv(f, "name", live(item_in_hand))])]);
				return live(f.dot);
			}
		}
	}
	oindex = rt.sv(f, "active_hand_index");
	rt.setSv(f, "active_hand_index", live(held_index));
	if (!truthy(rt.sv(f, "hud_used"))) return f.dot;
	H = null;
	if (truthy((H = rt.index(rt.fv(f, "hand_slots", rt.sv(f, "hud_used")), fmt("＀", [live(oindex)]))))) {
		rt.callName(f, live(H), "update_icon", []);
	}
	if (!truthy((H = rt.index(rt.fv(f, "hand_slots", rt.sv(f, "hud_used")), fmt("＀", [live(held_index)]))))) return f.dot;
	rt.callName(f, live(H), "update_icon", []);
	return f.dot;
});

// /mob/living/carbon/proc/activate_hand  (code/modules/mob/living/carbon/carbon.dm:71)  may sleep
rt.def("/mob/living/carbon/proc/activate_hand", function* activate_hand(f: Frame, selhand: Value) {
	f.vars = () => [selhand];
	if (!truthy(live(selhand))) {
		selhand = add(rt.modulus(rt.sv(f, "active_hand_index"), rt.len(f, rt.sv(f, "held_items"))), 1);
	}
	if (truthy((yield* g.call(f, P("/proc/istext"), null, [live(selhand)])))) {
		if ((isEqual((selhand = (yield* g.call(f, P("/proc/lowertext"), null, [live(selhand)]))), "right") || isEqual(live(selhand), "r"))) {
			selhand = 2;
		}
		if ((isEqual(live(selhand), "left") || isEqual(live(selhand), "l"))) {
			selhand = 1;
		}
	}
	if (!isEqual(live(selhand), rt.sv(f, "active_hand_index"))) {
		yield* g.srcCall(f, "swap_hand", live(selhand));
	} else {
		yield* g.srcCall(f, "mode");
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/attackby  (code/modules/mob/living/carbon/carbon.dm:87)  may sleep
rt.def("/mob/living/carbon/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	if ((truthy(rt.sv(f, "lying")) && truthy(rt.len(f, rt.sv(f, "surgeries"))))) {
		if ((!isEqual(live(f.args[1]), live(f.src)) && isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help"))) {
			S = null;
			rt.forList(f, 0, rt.sv(f, "surgeries"), T("/datum/surgery"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				if (truthy((yield* g.callName(f, live(S), "next_step", [live(f.args[1])])))) {
					return 1;
				}
			}
			rt.endFor(f, 0);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /mob/living/carbon/proc/throw_impact  (code/modules/mob/living/carbon/carbon.dm:95)  may sleep
rt.def("/mob/living/carbon/proc/throw_impact", function* throw_impact(f: Frame) {
	let hurt: Value = null, D: Value = null, R: Value = null, victim: Value = null;
	f.vars = () => [hurt, D, R, victim];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	hurt = 1;
	if (truthy((rt.istype(live(f.args[1]), T("/datum/thrownthing")) ? 1 : 0))) {
		if (truthy((rt.istype(rt.gv(f, "thrower", (D = live(f.args[1]))), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			if (!truthy(rt.gv(f, "emagged", (R = rt.fv(f, "thrower", live(D)))))) {
				hurt = 0;
			}
		}
	}
	if ((truthy(rt.fv(f, "density", live(f.args[0]))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.args[0])]))))) {
		if (truthy(live(hurt))) {
			yield* g.srcCall(f, "Knockdown", 20);
			yield* g.srcCall(f, "take_bodypart_damage", 10);
		}
	}
	if (!(truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)) && !isEqual(live(f.args[0]), live(f.src)))) return f.dot;
	if (truthy(rt.bitAnd(rt.gv(f, "movement_type", (victim = live(f.args[0]))), 2))) {
		return live(f.dot);
	}
	if (truthy(live(hurt))) {
		yield* g.callName(f, live(victim), "take_bodypart_damage", [10]);
		yield* g.srcCall(f, "take_bodypart_damage", 10);
		yield* g.callName(f, live(victim), "Knockdown", [20]);
		yield* g.srcCall(f, "Knockdown", 20);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ crashes into ＀, knocking them both over!</span>", [live(f.src), live(victim)]), fmt("<span class='userdanger'>You violently crash into ＀!</span>", [live(victim)]));
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/punch1.ogg"), 50, 1]);
	return f.dot;
}, true, { args: ["hit_atom", "throwingdatum"], waitfor: false });

// /mob/living/carbon/proc/toggle_throw_mode  (code/modules/mob/living/carbon/carbon.dm:125)
rt.def("/mob/living/carbon/proc/toggle_throw_mode", function toggle_throw_mode(f: Frame) {
	if (truthy(rt.sv(f, "stat"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "in_throw_mode"))) {
		rt.callSrc(f, "throw_mode_off", []);
	} else {
		rt.callSrc(f, "throw_mode_on", []);
	}
	return f.dot;
});

// /mob/living/carbon/proc/throw_mode_off  (code/modules/mob/living/carbon/carbon.dm:132)
rt.def("/mob/living/carbon/proc/throw_mode_off", function throw_mode_off(f: Frame) {
	rt.setSv(f, "in_throw_mode", 0);
	if (!(truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setFv(f, "icon_state", rt.fv(f, "throw_icon", rt.sv(f, "hud_used")), "act_throw_off");
	return f.dot;
});

// /mob/living/carbon/proc/throw_mode_on  (code/modules/mob/living/carbon/carbon.dm:138)
rt.def("/mob/living/carbon/proc/throw_mode_on", function throw_mode_on(f: Frame) {
	rt.setSv(f, "in_throw_mode", 1);
	if (!(truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setFv(f, "icon_state", rt.fv(f, "throw_icon", rt.sv(f, "hud_used")), "act_throw_on");
	return f.dot;
});

// /mob/living/carbon/proc/throw_item  (code/modules/mob/living/carbon/carbon.dm:145)  may sleep
rt.def("/mob/living/carbon/proc/throw_item", function* throw_item(f: Frame, target: Value) {
	let thrown_thing: Value = null, I: Value = null, throwable_mob: Value = null, start_T: Value = null, end_T: Value = null, start_T_descriptor: Value = null, end_T_descriptor: Value = null;
	f.vars = () => [target, thrown_thing, I, throwable_mob, start_T, end_T, start_T_descriptor, end_T_descriptor];
	yield* g.srcCall(f, "throw_mode_off");
	if ((!truthy(live(target)) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/obj/screen")) ? 1 : 0))) {
		return live(f.dot);
	}
	thrown_thing = null;
	if (!truthy((I = (yield* g.callName(f, live(f.src), "get_active_held_item", []))))) {
		if (((truthy(rt.sv(f, "pulling")) && truthy((rt.istype(rt.sv(f, "pulling"), T("/mob/living")) ? 1 : 0))) && rt.ge(rt.sv(f, "grab_state"), 1))) {
			if (!truthy(rt.gv(f, "buckled", (throwable_mob = rt.sv(f, "pulling"))))) {
				thrown_thing = live(throwable_mob);
				yield* g.srcCall(f, "stop_pulling");
				start_T = rt.getStep(f, rt.sv(f, "loc"), 0);
				end_T = rt.getStep(f, live(target), 0);
				if ((truthy(live(start_T)) && truthy(live(end_T)))) {
					start_T_descriptor = fmt("<font color='#6b5d00'>tile at ＀, ＀, ＀ in area ＀</font>", [rt.fv(f, "x", live(start_T)), rt.fv(f, "y", live(start_T)), rt.fv(f, "z", live(start_T)), (yield* g.call(f, P("/proc/get_area"), null, [live(start_T)]))]);
					end_T_descriptor = fmt("<font color='#6b4400'>tile at ＀, ＀, ＀ in area ＀</font>", [rt.fv(f, "x", live(end_T)), rt.fv(f, "y", live(end_T)), rt.fv(f, "z", live(end_T)), (yield* g.call(f, P("/proc/get_area"), null, [live(end_T)]))]);
					yield* g.call(f, P("/proc/add_logs"), null, [null, live(f.src), null, live(throwable_mob), null, "thrown", "addition", fmt("from ＀ with the target ＀", [live(start_T_descriptor), live(end_T_descriptor)])], rt.Args.Named);
				}
			}
		}
	} else {
		if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 130))) {
			thrown_thing = live(I);
			yield* g.srcCall(f, "dropItemToGround", live(I));
		}
	}
	if (!truthy(live(thrown_thing))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has thrown ＀.</span>", [live(f.src), live(thrown_thing)]));
	yield* g.srcCall(f, "newtonian_move", rt.getDir(f, live(target), live(f.src)));
	yield* g.callName(f, live(thrown_thing), "throw_at", [live(target), rt.fv(f, "throw_range", live(thrown_thing)), rt.fv(f, "throw_speed", live(thrown_thing)), live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/proc/restrained  (code/modules/mob/living/carbon/carbon.dm:177)
rt.def("/mob/living/carbon/proc/restrained", function restrained(f: Frame, ignore_grab: Value) {
	f.dot = (rt.sv(f, "handcuffed") || (((!truthy(live(ignore_grab)) ? 1 : 0) && rt.sv(f, "pulledby")) && (rt.ge(rt.fv(f, "grab_state", rt.sv(f, "pulledby")), 1) ? 1 : 0)));
	return f.dot;
});

// /mob/living/carbon/proc/show_inv  (code/modules/mob/living/carbon/carbon.dm:184)  may sleep
rt.def("/mob/living/carbon/proc/show_inv", function* show_inv(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	// tg_js: one `strip` tgui window instead of the HTML popup (modules/mob/strip.ts)
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /mob/living/carbon/proc/Topic  (code/modules/mob/living/carbon/carbon.dm:215)  may sleep
rt.def("/mob/living/carbon/proc/Topic", function* Topic(f: Frame) {
	let slot: Value = null, ITEM: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [slot, ITEM, $0, $1, $2];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src), 1, 1])))) return f.dot;
	if (!truthy(rt.at(live(f.args[1]), "internal"))) return f.dot;
	slot = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "internal")]));
	if (!(((truthy((ITEM = (yield* g.srcCall(f, "get_item_by_slot", live(slot))))) && truthy((rt.istype(live(ITEM), T("/obj/item/weapon/tank")) ? 1 : 0))) && truthy(rt.sv(f, "wear_mask"))) && truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "wear_mask")), 8)))) return f.dot;
	$0 = live(f.usr);
	if (truthy(rt.sv(f, "internal"))) {
		$1 = "close";
	} else {
		$1 = "open";
	}
	$0 = fmt("<span class='danger'>＀ tries to ＀ the valve on ＀'s ＀.</span>", [$0, $1, live(f.src), rt.fv(f, "name", live(ITEM))]);
	$1 = live(f.usr);
	if (truthy(rt.sv(f, "internal"))) {
		$2 = "close";
	} else {
		$2 = "open";
	}
	yield* g.srcCall(f, "visible_message", $0, fmt("<span class='userdanger'>＀ tries to ＀ the valve on ＀'s ＀.</span>", [$1, $2, live(f.src), rt.fv(f, "name", live(ITEM))]));
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.usr), live(f.src), 40])))) return f.dot;
	if (truthy(rt.sv(f, "internal"))) {
		rt.setSv(f, "internal", null);
		yield* g.srcCall(f, "update_internals_hud_icon", 0);
	} else {
		if ((truthy(live(ITEM)) && truthy((rt.istype(live(ITEM), T("/obj/item/weapon/tank")) ? 1 : 0)))) {
			if (((truthy(rt.sv(f, "wear_mask")) && truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "wear_mask")), 8))) || truthy((yield* g.srcCall(f, "getorganslot", "breathing_tube"))))) {
				rt.setSv(f, "internal", live(ITEM));
				yield* g.srcCall(f, "update_internals_hud_icon", 1);
			}
		}
	}
	$0 = live(f.usr);
	if (truthy(rt.sv(f, "internal"))) {
		$1 = "opens";
	} else {
		$1 = "closes";
	}
	$0 = fmt("<span class='danger'>＀ ＀ the valve on ＀'s ＀.</span>", [$0, $1, live(f.src), rt.fv(f, "name", live(ITEM))]);
	$1 = live(f.usr);
	if (truthy(rt.sv(f, "internal"))) {
		$2 = "opens";
	} else {
		$2 = "closes";
	}
	yield* g.srcCall(f, "visible_message", $0, fmt("<span class='userdanger'>＀ ＀ the valve on ＀'s ＀.</span>", [$1, $2, live(f.src), rt.fv(f, "name", live(ITEM))]));
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /mob/living/carbon/proc/fall  (code/modules/mob/living/carbon/carbon.dm:238)
rt.def("/mob/living/carbon/proc/fall", function fall(f: Frame, forced: Value) {
	rt.callName(f, rt.sv(f, "loc"), "handle_fall", [live(f.src), live(forced)]);
	return f.dot;
});

// /mob/living/carbon/proc/is_muzzled  (code/modules/mob/living/carbon/carbon.dm:241)
rt.def("/mob/living/carbon/proc/is_muzzled", function is_muzzled(f: Frame) {
	return (rt.istype(rt.fv(f, "wear_mask", live(f.src)), T("/obj/item/clothing/mask/muzzle")) ? 1 : 0);
});

// /mob/living/carbon/proc/resist_buckle  (code/modules/mob/living/carbon/carbon.dm:244)  may sleep
rt.def("/mob/living/carbon/proc/resist_buckle", function* resist_buckle(f: Frame) {
	if (truthy((yield* g.srcCall(f, "restrained")))) {
		yield* g.srcCall(f, "changeNext_move", 100);
		rt.setSv(f, "last_special", add(rt.worldTime(f), 100));
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ attempts to unbuckle themself!</span>", [live(f.src)]), "<span class='notice'>You attempt to unbuckle yourself... (This will take around one minute and you need to stay still.)</span>");
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.src), null, 600, null, 0, "target", live(f.src)], rt.Args.Named)))) {
			if (!truthy(rt.sv(f, "buckled"))) {
				return live(f.dot);
			}
			yield* g.callName(f, rt.sv(f, "buckled"), "user_unbuckle_mob", [live(f.src), live(f.src)]);
		} else {
			if ((truthy(live(f.src)) && truthy(rt.sv(f, "buckled")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You fail to unbuckle yourself!</span>"]);
			}
		}
	} else {
		yield* g.callName(f, rt.sv(f, "buckled"), "user_unbuckle_mob", [live(f.src), live(f.src)]);
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/resist_fire  (code/modules/mob/living/carbon/carbon.dm:260)  may sleep
rt.def("/mob/living/carbon/proc/resist_fire", function* resist_fire(f: Frame) {
	(rt.modSrcVar(f, "fire_stacks", 5, subtract));
	yield* g.srcCall(f, "Knockdown", 60, 1, 1);
	yield* g.srcCall(f, "spin", 32, 2);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ rolls on the floor, trying to put themselves out!</span>", [live(f.src)]), "<span class='notice'>You stop, drop, and roll!</span>");
	yield* g.call(f, P("/proc/sleep"), null, [30]);
	if (rt.le(rt.sv(f, "fire_stacks"), 0)) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has successfully extinguished themselves!</span>", [live(f.src)]), "<span class='notice'>You extinguish yourself.</span>");
		yield* g.srcCall(f, "ExtinguishMob");
	}
	return live(f.dot);
}, true);

// /mob/living/carbon/proc/resist_restraints  (code/modules/mob/living/carbon/carbon.dm:276)  may sleep
rt.def("/mob/living/carbon/proc/resist_restraints", function* resist_restraints(f: Frame) {
	let I: Value = null, type: Value = null;
	f.vars = () => [I, type];
	I = null;
	type = 0;
	if (truthy(rt.sv(f, "handcuffed"))) {
		I = rt.sv(f, "handcuffed");
		type = 1;
	} else {
		if (truthy(rt.sv(f, "legcuffed"))) {
			I = rt.sv(f, "legcuffed");
			type = 2;
		}
	}
	if (!truthy(live(I))) return f.dot;
	if (isEqual(live(type), 1)) {
		yield* g.srcCall(f, "changeNext_move", 100);
		rt.setSv(f, "last_special", add(rt.worldTime(f), 100));
	}
	if (isEqual(live(type), 2)) {
		yield* g.srcCall(f, "changeNext_move", 4);
		rt.setSv(f, "last_special", add(rt.worldTime(f), 4));
	}
	yield* g.srcCall(f, "cuff_resist", live(I));
	return f.dot;
}, true);

// /mob/living/carbon/proc/cuff_resist  (code/modules/mob/living/carbon/carbon.dm:293)  may sleep
rt.def("/mob/living/carbon/proc/cuff_resist", function* cuff_resist(f: Frame, I: Value, breakouttime: Value, cuff_break: Value) {
	let displaytime: Value = null;
	f.vars = () => [I, breakouttime, cuff_break, displaytime];
	if (live(breakouttime) === null) {
		breakouttime = 600;
	}
	if (live(cuff_break) === null) {
		cuff_break = 0;
	}
	breakouttime = rt.fv(f, "breakouttime", live(I));
	displaytime = divide(live(breakouttime), 600);
	if (!truthy(live(cuff_break))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ attempts to remove ＀!</span>", [live(f.src), live(I)]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>You attempt to remove ＀... (This will take around ＀ minutes and you need to stand still.)</span>", [live(I), live(displaytime)])]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.src), null, live(breakouttime), null, 0, "target", live(f.src)], rt.Args.Named)))) {
			yield* g.srcCall(f, "clear_cuffs", live(I), live(cuff_break));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>You fail to remove ＀!</span>", [live(I)])]);
		}
	} else {
		if (isEqual(live(cuff_break), 1)) {
			breakouttime = 50;
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ is trying to break ＀!</span>", [live(f.src), live(I)]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>You attempt to break ＀... (This will take around 5 seconds and you need to stand still.)</span>", [live(I)])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.src), null, live(breakouttime), null, 0, "target", live(f.src)], rt.Args.Named)))) {
				yield* g.srcCall(f, "clear_cuffs", live(I), live(cuff_break));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>You fail to break ＀!</span>", [live(I)])]);
			}
		} else {
			if (!isEqual(live(cuff_break), 2)) return f.dot;
			yield* g.srcCall(f, "clear_cuffs", live(I), live(cuff_break));
		}
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/uncuff  (code/modules/mob/living/carbon/carbon.dm:316)  may sleep
rt.def("/mob/living/carbon/proc/uncuff", function* uncuff(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	if (truthy(rt.sv(f, "handcuffed"))) {
		W = rt.sv(f, "handcuffed");
		rt.setSv(f, "handcuffed", null);
		if ((truthy(rt.sv(f, "buckled")) && truthy(rt.fv(f, "buckle_requires_restraints", rt.sv(f, "buckled"))))) {
			yield* g.callName(f, rt.sv(f, "buckled"), "unbuckle_mob", [live(f.src)]);
		}
		yield* g.srcCall(f, "update_handcuffed");
		if (truthy(rt.sv(f, "client"))) {
			(rt.modField(f, rt.sv(f, "client"), "screen", live(W), subtract));
		}
		if (truthy(live(W))) {
			rt.setFv(f, "loc", live(W), rt.sv(f, "loc"));
			yield* g.callName(f, live(W), "dropped", [live(f.src)]);
			if (truthy(live(W))) {
				rt.setFv(f, "layer", live(W), rt.initial(f, live(W), "layer"));
				rt.setFv(f, "plane", live(W), rt.initial(f, live(W), "plane"));
			}
		}
		yield* g.srcCall(f, "changeNext_move", 0);
	}
	if (!truthy(rt.sv(f, "legcuffed"))) return f.dot;
	W = rt.sv(f, "legcuffed");
	rt.setSv(f, "legcuffed", null);
	yield* g.srcCall(f, "update_inv_legcuffed");
	if (truthy(rt.sv(f, "client"))) {
		(rt.modField(f, rt.sv(f, "client"), "screen", live(W), subtract));
	}
	if (truthy(live(W))) {
		rt.setFv(f, "loc", live(W), rt.sv(f, "loc"));
		yield* g.callName(f, live(W), "dropped", [live(f.src)]);
		if (truthy(live(W))) {
			rt.setFv(f, "layer", live(W), rt.initial(f, live(W), "layer"));
			rt.setFv(f, "plane", live(W), rt.initial(f, live(W), "plane"));
		}
	}
	yield* g.srcCall(f, "changeNext_move", 0);
	return f.dot;
}, true);

// /mob/living/carbon/proc/clear_cuffs  (code/modules/mob/living/carbon/carbon.dm:345)  may sleep
rt.def("/mob/living/carbon/proc/clear_cuffs", function* clear_cuffs(f: Frame, I: Value, cuff_break: Value) {
	let $0: any, $1: any;
	f.vars = () => [I, cuff_break, $0, $1];
	if ((!truthy(rt.fv(f, "loc", live(I))) || truthy(rt.sv(f, "buckled")))) {
		return live(f.dot);
	}
	$0 = live(f.src);
	if (truthy(live(cuff_break))) {
		$1 = "break";
	} else {
		$1 = "remove";
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ manages to ＀ ＀!</span>", [$0, $1, live(I)]));
	$0 = live(f.src);
	if (truthy(live(cuff_break))) {
		$1 = "break";
	} else {
		$1 = "remove";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You successfully ＀ ＀.</span>", [$1, live(I)])]);
	if (truthy(live(cuff_break))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		if (isEqual(live(I), rt.sv(f, "handcuffed"))) {
			rt.setSv(f, "handcuffed", null);
			yield* g.srcCall(f, "update_handcuffed");
			return live(f.dot);
		} else {
			if (isEqual(live(I), rt.sv(f, "legcuffed"))) {
				rt.setSv(f, "legcuffed", null);
				yield* g.srcCall(f, "update_inv_legcuffed");
				return live(f.dot);
			}
		}
		return 1;
	} else {
		if (isEqual(live(I), rt.sv(f, "handcuffed"))) {
			rt.setFv(f, "loc", rt.sv(f, "handcuffed"), rt.sv(f, "loc"));
			yield* g.callName(f, rt.sv(f, "handcuffed"), "dropped", [live(f.src)]);
			rt.setSv(f, "handcuffed", null);
			if ((truthy(rt.sv(f, "buckled")) && truthy(rt.fv(f, "buckle_requires_restraints", rt.sv(f, "buckled"))))) {
				yield* g.callName(f, rt.sv(f, "buckled"), "unbuckle_mob", [live(f.src)]);
			}
			yield* g.srcCall(f, "update_handcuffed");
			return live(f.dot);
		}
		if (isEqual(live(I), rt.sv(f, "legcuffed"))) {
			rt.setFv(f, "loc", rt.sv(f, "legcuffed"), rt.sv(f, "loc"));
			yield* g.callName(f, rt.sv(f, "legcuffed"), "dropped", []);
			rt.setSv(f, "legcuffed", null);
			yield* g.srcCall(f, "update_inv_legcuffed");
			return live(f.dot);
		} else {
			yield* g.srcCall(f, "dropItemToGround", live(I));
			return live(f.dot);
		}
		return 1;
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/get_standard_pixel_y_offset  (code/modules/mob/living/carbon/carbon.dm:384)
rt.def("/mob/living/carbon/proc/get_standard_pixel_y_offset", function get_standard_pixel_y_offset(f: Frame, lying: Value) {
	f.vars = () => [lying];
	if (live(lying) === null) {
		lying = 0;
	}
	if (truthy(live(lying))) {
		return -6;
	} else {
		return rt.initial(f, live(f.src), "pixel_y");
	}
	return f.dot;
});

// /mob/living/carbon/proc/accident  (code/modules/mob/living/carbon/carbon.dm:389)  may sleep
rt.def("/mob/living/carbon/proc/accident", function* accident(f: Frame, I: Value) {
	let modifier: Value = null, target: Value = null, range: Value = null, i: Value = null, new_turf: Value = null;
	let $0: any;
	f.vars = () => [I, modifier, target, range, i, new_turf, $0];
	if ((!truthy(live(I)) || truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 130)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "dropItemToGround", live(I));
	modifier = 0;
	if (truthy(rt.bitAnd(rt.sv(f, "disabilities"), 256))) {
		(modifier = rt.modify(live(modifier), 40, subtract));
	}
	$0 = add((yield* g.call(f, P("/proc/rand"), null, [1, 100])), live(modifier));
	if (rt.inRange($0, -9.999999848243207e+30, 0)) {
		yield* g.callName(f, live(I), "attack", [live(f.src), live(f.src)]);
	} else if (rt.inRange($0, 1, 30)) {
		yield* g.callName(f, live(I), "throw_impact", [live(f.src)]);
	} else if (rt.inRange($0, 31, 60)) {
		target = rt.getStep(f, rt.sv(f, "loc"), 0);
		range = (yield* g.call(f, P("/proc/rand"), null, [2, rt.fv(f, "throw_range", live(I))]));
		i = null;
		i = 1;
		while (rt.lt(live(i), live(range))) {
			target = (new_turf = rt.getStep(f, live(target), rt.sv(f, "dir")));
			if (truthy(rt.fv(f, "density", live(new_turf)))) {
				break;
			}
			i = rt.inc(live(i), 1);
		}
		yield* g.callName(f, live(I), "throw_at", [live(target), rt.fv(f, "throw_range", live(I)), rt.fv(f, "throw_speed", live(I)), live(f.src)]);
	} else if (rt.inRange($0, 61, 90)) {
		target = rt.getStep(f, rt.sv(f, "loc"), 0);
		yield* g.callName(f, live(I), "throw_at", [live(target), rt.fv(f, "throw_range", live(I)), rt.fv(f, "throw_speed", live(I)), live(f.src)]);
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/AddAbility  (code/modules/mob/living/carbon/carbon.dm:417)  may sleep
rt.def("/mob/living/carbon/proc/AddAbility", function* AddAbility(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, rt.sv(f, "abilities"), "Add", [live(A)]);
	yield* g.callName(f, live(A), "on_gain", [live(f.src)]);
	if (truthy(rt.fv(f, "has_action", live(A)))) {
		yield* g.callName(f, rt.fv(f, "action", live(A)), "Grant", [live(f.src)]);
	}
	yield* g.call(f, P("/proc/sortInsert"), null, [rt.sv(f, "abilities"), P("/proc/cmp_abilities_cost"), 0]);
	return f.dot;
}, true);

// /mob/living/carbon/proc/RemoveAbility  (code/modules/mob/living/carbon/carbon.dm:424)  may sleep
rt.def("/mob/living/carbon/proc/RemoveAbility", function* RemoveAbility(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, rt.sv(f, "abilities"), "Remove", [live(A)]);
	yield* g.callName(f, live(A), "on_lose", [live(f.src)]);
	if (!truthy(rt.fv(f, "action", live(A)))) return f.dot;
	yield* g.callName(f, rt.fv(f, "action", live(A)), "Remove", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/proc/add_abilities_to_panel  (code/modules/mob/living/carbon/carbon.dm:430)
rt.def("/mob/living/carbon/proc/add_abilities_to_panel", function add_abilities_to_panel(f: Frame) {
	let A: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [A, $0, $1, $e];
	A = null;
	rt.forList(f, 0, rt.sv(f, "abilities"), T("/obj/effect/proc_holder/alien"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		$0 = fmt("＀", [rt.fv(f, "panel", live(A))]);
		if (rt.gt(rt.fv(f, "plasma_cost", live(A)), 0)) {
			$1 = fmt("(＀)", [rt.fv(f, "plasma_cost", live(A))]);
		} else {
			$1 = "";
		}
		rt.call(f, P("/proc/statpanel"), null, [$0, $1, live(A)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/carbon/proc/Stat  (code/modules/mob/living/carbon/carbon.dm:434)  may sleep
rt.def("/mob/living/carbon/proc/Stat", function* Stat(f: Frame) {
	let vessel: Value = null;
	f.vars = () => [vessel];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) {
		if (truthy((vessel = (yield* g.srcCall(f, "getorgan", T("/obj/item/organ/alien/plasmavessel")))))) {
			yield* g.call(f, P("/proc/stat"), null, [null, fmt("Plasma Stored: ＀/＀", [rt.fv(f, "storedPlasma", live(vessel)), rt.fv(f, "max_plasma", live(vessel))])]);
		}
		if (truthy(rt.locateIn(f, T("/obj/item/device/assembly/health"), live(f.src)))) {
			yield* g.call(f, P("/proc/stat"), null, [null, fmt("Health: ＀", [rt.sv(f, "health")])]);
		}
	}
	yield* g.srcCall(f, "add_abilities_to_panel");
	return f.dot;
}, true);

// /mob/living/carbon/proc/attack_ui  (code/modules/mob/living/carbon/carbon.dm:445)  may sleep
rt.def("/mob/living/carbon/proc/attack_ui", function* attack_ui(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "has_hand_for_held_index", rt.sv(f, "active_hand_index"))))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["slot"] });

// /mob/living/carbon/proc/vomit  (code/modules/mob/living/carbon/carbon.dm:450)  may sleep
rt.def("/mob/living/carbon/proc/vomit", function* vomit(f: Frame, lost_nutrition: Value, blood: Value, stun: Value, distance: Value, message: Value, toxic: Value) {
	let _T: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [lost_nutrition, blood, stun, distance, message, toxic, _T, i, $e];
	if (live(lost_nutrition) === null) {
		lost_nutrition = 10;
	}
	if (live(blood) === null) {
		blood = 0;
	}
	if (live(stun) === null) {
		stun = 1;
	}
	if (live(distance) === null) {
		distance = 1;
	}
	if (live(message) === null) {
		message = 1;
	}
	if (live(toxic) === null) {
		toxic = 0;
	}
	if (truthy((rt.isIn(f, ((rt.sv(f, "dna") && rt.fv(f, "species", rt.sv(f, "dna"))) && 19), rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		return 1;
	}
	if ((rt.lt(rt.sv(f, "nutrition"), 100) && !truthy(live(blood)))) {
		if (truthy(live(message))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ dry heaves!</span>", [live(f.src)]), "<span class='userdanger'>You try to throw up, but there's nothing in your stomach!</span>");
		}
		if (truthy(live(stun))) {
			yield* g.srcCall(f, "Knockdown", 200);
		}
		return 1;
	}
	if (truthy((yield* g.srcCall(f, "is_mouth_covered")))) {
		if (truthy(live(message))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ throws up all over themself!</span>", [live(f.src)]), "<span class='userdanger'>You throw up all over yourself!</span>");
		}
		distance = 0;
	} else {
		if (truthy(live(message))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ throws up!</span>", [live(f.src)]), "<span class='userdanger'>You throw up!</span>");
		}
	}
	if (truthy(live(stun))) {
		yield* g.srcCall(f, "Stun", 80);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/splat.ogg"), 50, 1]);
	_T = rt.getStep(f, live(f.src), 0);
	if (!truthy(live(blood))) {
		(rt.modSrcVar(f, "nutrition", live(lost_nutrition), subtract));
		yield* g.srcCall(f, "adjustToxLoss", -3);
	}
	i = null;
	rt.forRange(f, 0, 0, live(distance), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(live(blood))) {
			if (truthy(live(_T))) {
				yield* g.srcCall(f, "add_splatter_floor", live(_T));
			}
			if (truthy(live(stun))) {
				yield* g.srcCall(f, "adjustBruteLoss", 3);
			}
		} else {
			if (truthy(live(_T))) {
				yield* g.callName(f, live(_T), "add_vomit_floor", [live(f.src), live(toxic)]);
			}
		}
		if (truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [(_T = rt.getStep(f, live(_T), rt.sv(f, "dir")))])))) {
			break;
		}
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /mob/living/carbon/proc/spew_organ  (code/modules/mob/living/carbon/carbon.dm:493)  may sleep
rt.def("/mob/living/carbon/proc/spew_organ", function* spew_organ(f: Frame, power: Value) {
	let guts: Value = null, _T: Value = null, throw_target: Value = null;
	f.vars = () => [power, guts, _T, throw_target];
	if (live(power) === null) {
		power = 5;
	}
	if (!truthy(rt.len(f, rt.sv(f, "internal_organs")))) {
		return live(f.dot);
	}
	guts = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "internal_organs")]);
	_T = rt.getStep(f, live(f.src), 0);
	yield* g.callName(f, live(guts), "Remove", [live(f.src)]);
	yield* g.callName(f, live(guts), "forceMove", [live(_T)]);
	throw_target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(guts), rt.sv(f, "dir")]));
	yield* g.callName(f, live(guts), "throw_at", [live(throw_target), live(power), 4, live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/proc/fully_replace_character_name  (code/modules/mob/living/carbon/carbon.dm:504)
rt.def("/mob/living/carbon/proc/fully_replace_character_name", function fully_replace_character_name(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "dna"))) return f.dot;
	rt.setFv(f, "real_name", rt.sv(f, "dna"), rt.sv(f, "real_name"));
	return f.dot;
}, false, { args: ["oldname", "newname"] });

// /mob/living/carbon/proc/updatehealth  (code/modules/mob/living/carbon/carbon.dm:510)  may sleep
rt.def("/mob/living/carbon/proc/updatehealth", function* updatehealth(f: Frame) {
	let total_burn: Value = null, total_brute: Value = null, X: Value = null, BP: Value = null;
	let $e: any;
	f.vars = () => [total_burn, total_brute, X, BP, $e];
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	total_burn = 0;
	total_brute = 0;
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		total_brute = rt.modify(live(total_brute), rt.gv(f, "brute_dam", (BP = live(X))), add);
		total_burn = rt.modify(live(total_burn), rt.fv(f, "burn_dam", live(BP)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "health", subtract(subtract(subtract(subtract(subtract(rt.sv(f, "maxHealth"), (yield* g.srcCall(f, "getOxyLoss"))), (yield* g.srcCall(f, "getToxLoss"))), (yield* g.srcCall(f, "getCloneLoss"))), live(total_burn)), live(total_brute)));
	yield* g.srcCall(f, "update_stat");
	if ((rt.lt(subtract(rt.sv(f, "maxHealth"), live(total_burn)), -100) && isEqual(rt.sv(f, "stat"), 2))) {
		yield* g.srcCall(f, "become_husk");
	}
	yield* g.srcCall(f, "med_hud_set_health");
	return f.dot;
}, true);

// /mob/living/carbon/proc/update_sight  (code/modules/mob/living/carbon/carbon.dm:525)  may sleep
rt.def("/mob/living/carbon/proc/update_sight", function* update_sight(f: Frame) {
	let E: Value = null, A: Value = null, G: Value = null, X: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [E, A, G, X, M, $e];
	if (!truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "stat"), 2)) {
		rt.setSv(f, "sight", 28);
		rt.setSv(f, "see_in_dark", 8);
		rt.setSv(f, "see_invisible", 60);
		return live(f.dot);
	}
	rt.setSv(f, "sight", rt.initial(f, live(f.src), "sight"));
	rt.setSv(f, "lighting_alpha", rt.initial(f, live(f.src), "lighting_alpha"));
	if (!truthy((E = (yield* g.srcCall(f, "getorganslot", "eye_sight"))))) {
		yield* g.srcCall(f, "update_tint");
	} else {
		rt.setSv(f, "see_invisible", rt.fv(f, "see_invisible", live(E)));
		rt.setSv(f, "see_in_dark", rt.fv(f, "see_in_dark", live(E)));
		(rt.modSrcVar(f, "sight", rt.fv(f, "sight_flags", live(E)), rt.bitOr));
		if (rt.fv(f, "lighting_alpha", live(E)) !== null) {
			rt.setSv(f, "lighting_alpha", rt.fv(f, "lighting_alpha", live(E)));
		}
	}
	if (!isEqual(rt.fv(f, "eye", rt.sv(f, "client")), live(f.src))) {
		if (truthy((yield* g.callName(f, (A = rt.fv(f, "eye", rt.sv(f, "client"))), "update_remote_sight", [live(f.src)])))) {
			return live(f.dot);
		}
	}
	if (truthy(rt.sv(f, "glasses"))) {
		(rt.modSrcVar(f, "sight", rt.gv(f, "vision_flags", (G = rt.sv(f, "glasses"))), rt.bitOr));
		rt.setSv(f, "see_in_dark", (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "darkness_view", live(G)), rt.sv(f, "see_in_dark")])));
		if (truthy(rt.fv(f, "invis_override", live(G)))) {
			rt.setSv(f, "see_invisible", rt.fv(f, "invis_override", live(G)));
		} else {
			rt.setSv(f, "see_invisible", (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "invis_view", live(G)), rt.sv(f, "see_invisible")])));
		}
		if (rt.fv(f, "lighting_alpha", live(G)) !== null) {
			rt.setSv(f, "lighting_alpha", (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "lighting_alpha"), rt.fv(f, "lighting_alpha", live(G))])));
		}
	}
	if (truthy(rt.sv(f, "dna"))) {
		X = null;
		rt.forList(f, 0, rt.fv(f, "mutations", rt.sv(f, "dna")));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			if (isEqual(rt.gv(f, "name", (M = live(X))), "X Ray Vision")) {
				(rt.modSrcVar(f, "sight", 28, rt.bitOr));
				rt.setSv(f, "see_in_dark", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "see_in_dark"), 8])));
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "see_override"))) {
		rt.setSv(f, "see_invisible", rt.sv(f, "see_override"));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/living/carbon/proc/update_tint  (code/modules/mob/living/carbon/carbon.dm:574)  may sleep
rt.def("/mob/living/carbon/proc/update_tint", function* update_tint(f: Frame) {
	if (!truthy(rt.gl("tinted_weldhelh"))) {
		return live(f.dot);
	}
	rt.setSv(f, "tinttotal", (yield* g.srcCall(f, "get_total_tint")));
	if (rt.ge(rt.sv(f, "tinttotal"), 3)) {
		yield* g.srcCall(f, "overlay_fullscreen", "tint", T("/obj/screen/fullscreen/blind"));
	} else {
		if (rt.ge(rt.sv(f, "tinttotal"), 2)) {
			yield* g.srcCall(f, "overlay_fullscreen", "tint", T("/obj/screen/fullscreen/impaired"), 2);
		} else {
			yield* g.srcCall(f, "clear_fullscreen", "tint", 0);
		}
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/get_total_tint  (code/modules/mob/living/carbon/carbon.dm:586)
rt.def("/mob/living/carbon/proc/get_total_tint", function get_total_tint(f: Frame) {
	let HT: Value = null, E: Value = null;
	f.vars = () => [HT, E];
	f.dot = 0;
	if (truthy((rt.istype(rt.sv(f, "head"), T("/obj/item/clothing/head")) ? 1 : 0))) {
		f.dot = rt.modify(live(f.dot), rt.gv(f, "tint", (HT = rt.sv(f, "head"))), add);
	}
	if (truthy(rt.sv(f, "wear_mask"))) {
		f.dot = rt.modify(live(f.dot), rt.fv(f, "tint", rt.sv(f, "wear_mask")), add);
	}
	if (truthy((E = rt.callSrc(f, "getorganslot", ["eye_sight"])))) {
		f.dot = rt.modify(live(f.dot), rt.fv(f, "tint", live(E)), add);
	} else {
		f.dot = rt.modify(live(f.dot), 9.999999848243207e+30, add);
	}
	return f.dot;
});

// /mob/living/carbon/proc/update_damage_hud  (code/modules/mob/living/carbon/carbon.dm:602)  may sleep
rt.def("/mob/living/carbon/proc/update_damage_hud", function* update_damage_hud(f: Frame) {
	let severity: Value = null, hurtdamage: Value = null, severity_1: Value = null;
	let $0: any;
	f.vars = () => [severity, hurtdamage, severity_1, $0];
	if (!truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	if ((isEqual(rt.sv(f, "stat"), 1) && rt.le(rt.sv(f, "health"), 0))) {
		severity = 0;
		$0 = rt.sv(f, "health");
		if (rt.inRange($0, -20, -10)) {
			severity = 1;
		} else if (rt.inRange($0, -30, -20)) {
			severity = 2;
		} else if (rt.inRange($0, -40, -30)) {
			severity = 3;
		} else if (rt.inRange($0, -50, -40)) {
			severity = 4;
		} else if (rt.inRange($0, -60, -50)) {
			severity = 5;
		} else if (rt.inRange($0, -70, -60)) {
			severity = 6;
		} else if (rt.inRange($0, -80, -70)) {
			severity = 7;
		} else if (rt.inRange($0, -90, -80)) {
			severity = 8;
		} else if (rt.inRange($0, -95, -90)) {
			severity = 9;
		} else if (rt.inRange($0, -9.999999848243207e+30, -95)) {
			severity = 10;
		}
		yield* g.srcCall(f, "overlay_fullscreen", "crit", T("/obj/screen/fullscreen/crit"), live(severity));
	} else {
		yield* g.srcCall(f, "clear_fullscreen", "crit");
		if (truthy(rt.sv(f, "oxyloss"))) {
			severity = 0;
			$0 = rt.sv(f, "oxyloss");
			if (rt.inRange($0, 10, 20)) {
				severity = 1;
			} else if (rt.inRange($0, 20, 25)) {
				severity = 2;
			} else if (rt.inRange($0, 25, 30)) {
				severity = 3;
			} else if (rt.inRange($0, 30, 35)) {
				severity = 4;
			} else if (rt.inRange($0, 35, 40)) {
				severity = 5;
			} else if (rt.inRange($0, 40, 45)) {
				severity = 6;
			} else if (rt.inRange($0, 45, 9.999999848243207e+30)) {
				severity = 7;
			}
			yield* g.srcCall(f, "overlay_fullscreen", "oxy", T("/obj/screen/fullscreen/oxy"), live(severity));
		} else {
			yield* g.srcCall(f, "clear_fullscreen", "oxy");
		}
		if (truthy((hurtdamage = add(add((yield* g.srcCall(f, "getBruteLoss")), (yield* g.srcCall(f, "getFireLoss"))), rt.sv(f, "damageoverlaytemp"))))) {
			severity_1 = 0;
			$0 = live(hurtdamage);
			if (rt.inRange($0, 5, 15)) {
				severity_1 = 1;
			} else if (rt.inRange($0, 15, 30)) {
				severity_1 = 2;
			} else if (rt.inRange($0, 30, 45)) {
				severity_1 = 3;
			} else if (rt.inRange($0, 45, 70)) {
				severity_1 = 4;
			} else if (rt.inRange($0, 70, 85)) {
				severity_1 = 5;
			} else if (rt.inRange($0, 85, 9.999999848243207e+30)) {
				severity_1 = 6;
			}
			yield* g.srcCall(f, "overlay_fullscreen", "brute", T("/obj/screen/fullscreen/brute"), live(severity_1));
		} else {
			yield* g.srcCall(f, "clear_fullscreen", "brute");
		}
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/update_health_hud  (code/modules/mob/living/carbon/carbon.dm:651)
rt.def("/mob/living/carbon/proc/update_health_hud", function update_health_hud(f: Frame, shown_health_amount: Value) {
	f.vars = () => [shown_health_amount];
	if ((!truthy(rt.sv(f, "client")) || !truthy(rt.sv(f, "hud_used")))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "healths", rt.sv(f, "hud_used")))) return f.dot;
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		f.dot = 1;
		if (!truthy(live(shown_health_amount))) {
			shown_health_amount = rt.sv(f, "health");
		}
		if (rt.ge(live(shown_health_amount), rt.sv(f, "maxHealth"))) {
			rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health0");
		} else {
			if (rt.gt(live(shown_health_amount), multiply(rt.sv(f, "maxHealth"), 0.800000011920929))) {
				rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health1");
			} else {
				if (rt.gt(live(shown_health_amount), multiply(rt.sv(f, "maxHealth"), 0.6000000238418579))) {
					rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health2");
				} else {
					if (rt.gt(live(shown_health_amount), multiply(rt.sv(f, "maxHealth"), 0.4000000059604645))) {
						rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health3");
					} else {
						if (rt.gt(live(shown_health_amount), multiply(rt.sv(f, "maxHealth"), 0.20000000298023224))) {
							rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health4");
						} else {
							if (rt.gt(live(shown_health_amount), 0)) {
								rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health5");
							} else {
								rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health6");
							}
						}
					}
				}
			}
		}
	} else {
		rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health7");
	}
	return f.dot;
});

// /mob/living/carbon/proc/update_internals_hud_icon  (code/modules/mob/living/carbon/carbon.dm:676)
rt.def("/mob/living/carbon/proc/update_internals_hud_icon", function update_internals_hud_icon(f: Frame, internal_state: Value) {
	f.vars = () => [internal_state];
	if (live(internal_state) === null) {
		internal_state = 0;
	}
	if (!(truthy(rt.sv(f, "hud_used")) && truthy(rt.fv(f, "internals", rt.sv(f, "hud_used"))))) return f.dot;
	rt.setFv(f, "icon_state", rt.fv(f, "internals", rt.sv(f, "hud_used")), fmt("internal＀", [live(internal_state)]));
	return f.dot;
});

// /mob/living/carbon/proc/update_stat  (code/modules/mob/living/carbon/carbon.dm:680)  may sleep
rt.def("/mob/living/carbon/proc/update_stat", function* update_stat(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		if (rt.le(rt.sv(f, "health"), -100)) {
			yield* g.srcCall(f, "death");
			return live(f.dot);
		}
		if (((((truthy((yield* g.srcCall(f, "IsUnconscious"))) || truthy((yield* g.srcCall(f, "IsSleeping")))) || rt.gt((yield* g.srcCall(f, "getOxyLoss")), 50)) || truthy(rt.bitAnd(rt.sv(f, "status_flags"), 8192))) || rt.le(rt.sv(f, "health"), 0))) {
			if (isEqual(rt.sv(f, "stat"), 0)) {
				rt.setSv(f, "stat", 1);
				yield* g.srcCall(f, "blind_eyes", 1);
				yield* g.srcCall(f, "update_canmove");
			}
		} else {
			if (isEqual(rt.sv(f, "stat"), 1)) {
				rt.setSv(f, "stat", 0);
				rt.setSv(f, "resting", 0);
				yield* g.srcCall(f, "adjust_blindness", -1);
				yield* g.srcCall(f, "update_canmove");
			}
		}
	}
	yield* g.srcCall(f, "update_damage_hud");
	yield* g.srcCall(f, "update_health_hud");
	yield* g.srcCall(f, "med_hud_set_status");
	return f.dot;
}, true);

// /mob/living/carbon/proc/update_handcuffed  (code/modules/mob/living/carbon/carbon.dm:704)  may sleep
rt.def("/mob/living/carbon/proc/update_handcuffed", function* update_handcuffed(f: Frame) {
	if (truthy(rt.sv(f, "handcuffed"))) {
		yield* g.srcCall(f, "drop_all_held_items");
		yield* g.srcCall(f, "stop_pulling");
		yield* g.callSrc(f, "throw_alert", [null, "handcuffed", null, T("/obj/screen/alert/restrained/handcuffed"), "new_master", rt.fv(f, "handcuffed", live(f.src))], rt.Args.Named);
	} else {
		yield* g.srcCall(f, "clear_alert", "handcuffed");
	}
	yield* g.srcCall(f, "update_action_buttons_icon");
	yield* g.srcCall(f, "update_inv_handcuffed");
	yield* g.srcCall(f, "update_hud_handcuffed");
	return f.dot;
}, true);

// /mob/living/carbon/proc/fully_heal  (code/modules/mob/living/carbon/carbon.dm:715)  may sleep
rt.def("/mob/living/carbon/proc/fully_heal", function* fully_heal(f: Frame) {
	let B: Value = null, D: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [B, D, R, $e];
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (truthy(rt.sv(f, "reagents"))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
	}
	if (truthy((B = (yield* g.srcCall(f, "getorgan", T("/obj/item/organ/brain")))))) {
		rt.setFv(f, "damaged_brain", live(B), 0);
	}
	D = null;
	rt.forList(f, 0, rt.sv(f, "viruses"), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (!isEqual(rt.fv(f, "severity", live(D)), "No threat")) {
			yield* g.callName(f, live(D), "cure", [0]);
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(f.args[0]))) {
		yield* g.srcCall(f, "regenerate_limbs");
		yield* g.srcCall(f, "regenerate_organs");
		rt.setSv(f, "handcuffed", rt.initial(f, live(f.src), "handcuffed"));
		R = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/restraints"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "update_handcuffed");
		if (truthy(rt.sv(f, "reagents"))) {
			rt.setFv(f, "addiction_list", rt.sv(f, "reagents"), rt.list());
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "restoreEars");
	return f.dot;
}, true, { args: ["admin_revive"] });

// /mob/living/carbon/proc/can_be_revived  (code/modules/mob/living/carbon/carbon.dm:737)
rt.def("/mob/living/carbon/proc/can_be_revived", function can_be_revived(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!(!truthy(rt.callSrc(f, "getorgan", [T("/obj/item/organ/brain")])) && (!truthy(rt.sv(f, "mind")) || !truthy(rt.fv(f, "changeling", rt.sv(f, "mind")))))) return f.dot;
	return 0;
});

// /mob/living/carbon/proc/harvest  (code/modules/mob/living/carbon/carbon.dm:742)  may sleep
rt.def("/mob/living/carbon/proc/harvest", function* harvest(f: Frame) {
	let organs_amt: Value = null, X: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [organs_amt, X, O, $e];
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	organs_amt = 0;
	X = null;
	rt.forList(f, 0, rt.sv(f, "internal_organs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		O = live(X);
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			organs_amt = rt.inc(live(organs_amt), 1);
			yield* g.callName(f, live(O), "Remove", [live(f.src)]);
			rt.setFv(f, "loc", live(O), rt.getStep(f, live(f.src), 0));
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(organs_amt))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You retrieve some of ＀'s internal organs!</span>", [live(f.src)])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/carbon/proc/ExtinguishMob  (code/modules/mob/living/carbon/carbon.dm:757)  may sleep
rt.def("/mob/living/carbon/proc/ExtinguishMob", function* ExtinguishMob(f: Frame) {
	let X: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [X, I, $e];
	X = null;
	rt.forList(f, 0, (yield* g.srcCall(f, "get_equipped_items")));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		rt.setFv(f, "acid_level", (I = live(X)), 0);
		yield* g.callName(f, live(I), "extinguish", []);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/proc/fakefire  (code/modules/mob/living/carbon/carbon.dm:764)
rt.def("/mob/living/carbon/proc/fakefire", function fakefire(f: Frame, fire_icon: Value) {
	let new_fire_overlay: Value = null;
	f.vars = () => [fire_icon, new_fire_overlay];
	if (live(fire_icon) === null) {
		fire_icon = "Generic_mob_burning";
	}
	rt.setFv(f, "appearance_flags", (new_fire_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/onfire.dmi"), live(fire_icon), -1])), 2);
	rt.setAt(rt.sv(f, "overlays_standing"), 1, live(new_fire_overlay));
	rt.callSrc(f, "apply_overlay", [1]);
	return f.dot;
});

// /mob/living/carbon/proc/fakefireextinguish  (code/modules/mob/living/carbon/carbon.dm:770)
rt.def("/mob/living/carbon/proc/fakefireextinguish", function fakefireextinguish(f: Frame) {
	rt.callSrc(f, "remove_overlay", [1]);
	return f.dot;
});

// /mob/living/carbon/proc/devour_mob  (code/modules/mob/living/carbon/carbon.dm:774)  may sleep
rt.def("/mob/living/carbon/proc/devour_mob", function* devour_mob(f: Frame, C: Value, devour_time: Value) {
	f.vars = () => [C, devour_time];
	if (live(devour_time) === null) {
		devour_time = 130;
	}
	yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ is attempting to devour ＀!</span>", [live(f.src), live(C)]), fmt("<span class='userdanger'>＀ is attempting to devour you!</span>", [live(f.src)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.src), live(C), live(devour_time)])))) {
		return live(f.dot);
	}
	if (!(((truthy(rt.sv(f, "pulling")) && isEqual(rt.sv(f, "pulling"), live(C))) && rt.ge(rt.sv(f, "grab_state"), 1)) && isEqual(rt.sv(f, "a_intent"), "grab"))) return f.dot;
	yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ devours ＀!</span>", [live(f.src), live(C)]), fmt("<span class='userdanger'>＀ devours you!</span>", [live(f.src)])]);
	yield* g.callName(f, live(C), "forceMove", [live(f.src)]);
	yield* g.callName(f, rt.sv(f, "stomach_contents"), "Add", [live(C)]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(f.src), live(C), "devoured"]);
	return f.dot;
}, true);

// /mob/living/carbon/proc/create_bodyparts  (code/modules/mob/living/carbon/carbon.dm:788)  may sleep
rt.def("/mob/living/carbon/proc/create_bodyparts", function* create_bodyparts(f: Frame) {
	let l_arm_index_next: Value = null, r_arm_index_next: Value = null, X: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [l_arm_index_next, r_arm_index_next, X, O, $e];
	l_arm_index_next = -1;
	r_arm_index_next = 0;
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		rt.setFv(f, "owner", (O = (yield* g.new_(f, live(X), []))), live(f.src));
		yield* g.callName(f, rt.sv(f, "bodyparts"), "Remove", [live(X)]);
		yield* g.callName(f, rt.sv(f, "bodyparts"), "Add", [live(O)]);
		if (isEqual(rt.fv(f, "body_part", live(O)), 128)) {
			l_arm_index_next = rt.modify(live(l_arm_index_next), 2, add);
			rt.setFv(f, "held_index", live(O), live(l_arm_index_next));
			rt.modSrcVar(f, "hand_bodyparts", live(O), add);
		} else {
			if (isEqual(rt.fv(f, "body_part", live(O)), 256)) {
				r_arm_index_next = rt.modify(live(r_arm_index_next), 2, add);
				rt.setFv(f, "held_index", live(O), live(r_arm_index_next));
				rt.modSrcVar(f, "hand_bodyparts", live(O), add);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/carbon/proc/create_internal_organs  (code/modules/mob/living/carbon/carbon.dm:804)  may sleep
rt.def("/mob/living/carbon/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	let X: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [X, I, $e];
	X = null;
	rt.forList(f, 0, rt.sv(f, "internal_organs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (I = live(X)), "Insert", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/carbon/proc/vv_get_dropdown  (code/modules/mob/living/carbon/carbon.dm:809)
rt.def("/mob/living/carbon/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setAt((f.dot = rt.modify(live(f.dot), "---", add)), "Make AI", fmt("?_src_=vars;makeai=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Modify bodypart", fmt("?_src_=vars;editbodypart=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Modify organs", fmt("?_src_=vars;editorgans=＃", [live(f.src)]));
	return f.dot;
});
