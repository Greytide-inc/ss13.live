// From code/datums/status_effects/debuffs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(928, "/datum/status_effect/incapacitating", "/datum/status_effect", {
	needs_update_stat: 0,
	tick_interval: 0,
	status_type: 2,
	alert_type: null,
});

// /datum/status_effect/incapacitating/proc/on_creation  (code/datums/status_effects/debuffs.dm:10)  may sleep
rt.def("/datum/status_effect/incapacitating/proc/on_creation", function* on_creation(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/isnum"), null, [live(f.args[1])])))) {
		rt.setSv(f, "duration", live(f.args[1]));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (!truthy(live(f.args[2]))) return f.dot;
	yield* g.callName(f, rt.sv(f, "owner"), "update_canmove", []);
	if (!(truthy(rt.sv(f, "needs_update_stat")) || truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/silicon")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, rt.sv(f, "owner"), "update_stat", []);
	return f.dot;
}, true, { args: ["new_owner", "set_duration", "updating_canmove"] });

// /datum/status_effect/incapacitating/proc/on_remove  (code/datums/status_effects/debuffs.dm:20)  may sleep
rt.def("/datum/status_effect/incapacitating/proc/on_remove", function* on_remove(f: Frame) {
	yield* g.callName(f, rt.sv(f, "owner"), "update_canmove", []);
	if (!(truthy(rt.sv(f, "needs_update_stat")) || truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/silicon")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, rt.sv(f, "owner"), "update_stat", []);
	return f.dot;
}, true);

rt.type(932, "/datum/status_effect/incapacitating/sleeping", "/datum/status_effect/incapacitating", {
	carbon_owner: null,
	human_owner: null,
	needs_update_stat: 1,
	id: "sleeping",
	alert_type: rt.typePath("/obj/screen/alert/status_effect/asleep"),
});

// /datum/status_effect/incapacitating/sleeping/proc/on_creation  (code/datums/status_effects/debuffs.dm:46)  may sleep
rt.def("/datum/status_effect/incapacitating/sleeping/proc/on_creation", function* on_creation(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon")) ? 1 : 0))) {
		rt.setSv(f, "carbon_owner", rt.sv(f, "owner"));
	}
	if (!truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "human_owner", rt.sv(f, "owner"));
	return f.dot;
}, true, { args: ["new_owner", "updating_canmove"] });

// /datum/status_effect/incapacitating/sleeping/proc/Destroy  (code/datums/status_effects/debuffs.dm:56)  may sleep
rt.def("/datum/status_effect/incapacitating/sleeping/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "carbon_owner", null);
	rt.setSv(f, "human_owner", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/status_effect/incapacitating/sleeping/proc/tick  (code/datums/status_effects/debuffs.dm:59)  may sleep
rt.def("/datum/status_effect/incapacitating/sleeping/proc/tick", function* tick(f: Frame) {
	if (truthy(rt.fv(f, "staminaloss", rt.sv(f, "owner")))) {
		yield* g.callName(f, rt.sv(f, "owner"), "adjustStaminaLoss", [-0.3499999940395355]);
	}
	if ((truthy(rt.sv(f, "human_owner")) && truthy(rt.fv(f, "drunkenness", rt.sv(f, "human_owner"))))) {
		(rt.modField(f, rt.sv(f, "human_owner"), "drunkenness", 0.996999979019165, multiply));
	}
	if (!truthy(rt.op(f, "Prob", [], [20]))) return f.dot;
	if (truthy(rt.sv(f, "carbon_owner"))) {
		yield* g.callName(f, rt.sv(f, "carbon_owner"), "handle_dreams", []);
	}
	if (!(truthy(rt.op(f, "Prob", [], [10])) && rt.gt(rt.fv(f, "health", rt.sv(f, "owner")), 0))) return f.dot;
	yield* g.callName(f, rt.sv(f, "owner"), "emote", ["snore"]);
	return f.dot;
}, true);

rt.type(933, "/datum/status_effect/his_wrath", "/datum/status_effect", {
	id: "his_wrath",
	duration: -1,
	tick_interval: 4,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/his_wrath"),
});

// /datum/status_effect/his_wrath/proc/tick  (code/datums/status_effects/debuffs.dm:88)  may sleep
rt.def("/datum/status_effect/his_wrath/proc/tick", function* tick(f: Frame) {
	let HG: Value = null;
	let $e: any;
	f.vars = () => [HG, $e];
	HG = null;
	rt.forList(f, 0, rt.fv(f, "held_items", rt.sv(f, "owner")), T("/obj/item/weapon/his_grace"));
	while (($e = rt.next(f, 0)) !== undefined) {
		HG = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "owner"), "adjustBruteLoss", [0.10000000149011612]);
	yield* g.callName(f, rt.sv(f, "owner"), "adjustFireLoss", [0.10000000149011612]);
	yield* g.callName(f, rt.sv(f, "owner"), "adjustToxLoss", [0.20000000298023224, 1, 1]);
	return f.dot;
}, true);

rt.type(934, "/datum/status_effect/belligerent", "/datum/status_effect", {
	leg_damage_on_toggle: 2,
	cultist_damage_on_toggle: 10,
	id: "belligerent",
	duration: 70,
	tick_interval: 0,
	status_type: 2,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/belligerent"),
});

// /datum/status_effect/belligerent/proc/on_apply  (code/datums/status_effects/debuffs.dm:111)  may sleep
rt.def("/datum/status_effect/belligerent/proc/on_apply", function* on_apply(f: Frame) {
	return (yield* g.srcCall(f, "do_movement_toggle", 1));
}, true);

// /datum/status_effect/belligerent/proc/tick  (code/datums/status_effects/debuffs.dm:114)  may sleep
rt.def("/datum/status_effect/belligerent/proc/tick", function* tick(f: Frame) {
	if (truthy((yield* g.srcCall(f, "do_movement_toggle")))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /datum/status_effect/belligerent/proc/do_movement_toggle  (code/datums/status_effects/debuffs.dm:118)  may sleep
rt.def("/datum/status_effect/belligerent/proc/do_movement_toggle", function* do_movement_toggle(f: Frame, force_damage: Value) {
	let number_legs: Value = null;
	let $0: any, $1: any;
	f.vars = () => [force_damage, number_legs, $0, $1];
	number_legs = (yield* g.callName(f, rt.sv(f, "owner"), "get_num_legs", []));
	if ((((truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "owner")])))) && !truthy((yield* g.callName(f, rt.sv(f, "owner"), "null_rod_check", [])))) && truthy(live(number_legs)))) {
		if ((truthy(live(force_damage)) || !isEqual(rt.fv(f, "m_intent", rt.sv(f, "owner")), "walk"))) {
			if (truthy(rt.gl("ratvar_awakens"))) {
				yield* g.callName(f, rt.sv(f, "owner"), "Knockdown", [20]);
			}
			if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [rt.sv(f, "owner")])))) {
				yield* g.callName(f, rt.sv(f, "owner"), "apply_damage", [multiply(rt.sv(f, "cultist_damage_on_toggle"), 0.5), "fire", "l_leg"]);
				yield* g.callName(f, rt.sv(f, "owner"), "apply_damage", [multiply(rt.sv(f, "cultist_damage_on_toggle"), 0.5), "fire", "r_leg"]);
			} else {
				yield* g.callName(f, rt.sv(f, "owner"), "apply_damage", [multiply(rt.sv(f, "leg_damage_on_toggle"), 0.5), "fire", "l_leg"]);
				yield* g.callName(f, rt.sv(f, "owner"), "apply_damage", [multiply(rt.sv(f, "leg_damage_on_toggle"), 0.5), "fire", "r_leg"]);
			}
		}
		if (!isEqual(rt.fv(f, "m_intent", rt.sv(f, "owner")), "walk")) {
			if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [rt.sv(f, "owner")])))) {
				$0 = rt.sv(f, "owner");
				if (rt.gt(live(number_legs), 1)) {
					$1 = "s shiver";
				} else {
					$1 = " shivers";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>Your leg＀ with pain!</span>", [$1])]);
			} else {
				$0 = rt.sv(f, "owner");
				if (rt.gt(live(number_legs), 1)) {
					$1 = "s burn";
				} else {
					$1 = " burns";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>Your leg＀ with pain!</span>", [$1])]);
			}
			yield* g.callName(f, rt.sv(f, "owner"), "toggle_move_intent", []);
		}
		return 1;
	}
	return 0;
}, true);

// /datum/status_effect/belligerent/proc/on_remove  (code/datums/status_effects/debuffs.dm:139)  may sleep
rt.def("/datum/status_effect/belligerent/proc/on_remove", function* on_remove(f: Frame) {
	if (!isEqual(rt.fv(f, "m_intent", rt.sv(f, "owner")), "walk")) return f.dot;
	yield* g.callName(f, rt.sv(f, "owner"), "toggle_move_intent", []);
	return f.dot;
}, true);

rt.type(935, "/datum/status_effect/maniamotor", "/datum/status_effect", {
	motor: null,
	severity: 0,
	warned_turnoff: 0,
	warned_outofsight: 0,
	id: "maniamotor",
	duration: -1,
	tick_interval: 10,
	status_type: 0,
	alert_type: null,
}, { global: { mania_messages: 637, flee_messages: 638, turnoff_messages: 639, powerloss_messages: 640 } });

// /datum/status_effect/maniamotor/proc/on_creation  (code/datums/status_effects/debuffs.dm:162)  may sleep
rt.def("/datum/status_effect/maniamotor/proc/on_creation", function* on_creation(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	rt.setSv(f, "motor", live(f.args[1]));
	return f.dot;
}, true, { args: ["new_owner", "new_motor"] });

// /datum/status_effect/maniamotor/proc/Destroy  (code/datums/status_effects/debuffs.dm:168)  may sleep
rt.def("/datum/status_effect/maniamotor/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "motor", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/status_effect/maniamotor/proc/tick  (code/datums/status_effects/debuffs.dm:171)  may sleep
rt.def("/datum/status_effect/maniamotor/proc/tick", function* tick(f: Frame) {
	let is_servant: Value = null, span_part: Value = null, pickedmessage: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [is_servant, span_part, pickedmessage, $0, $1, $2];
	is_servant = (yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "owner")]));
	if (rt.gt(rt.sv(f, "severity"), 50)) {
		$0 = "";
	} else {
		$0 = "_small";
	}
	span_part = $0;
	if ((!truthy(rt.sv(f, "motor")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "motor"))))) {
		if (!truthy(live(is_servant))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='sevtug＀'>You feel a frustrated voice quietly fade from your mind...</span>", [live(span_part)])]);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "active", rt.sv(f, "motor")))) {
		if ((!truthy(live(is_servant)) && !truthy(rt.sv(f, "warned_turnoff")))) {
			if (rt.gt((yield* g.callName(f, rt.sv(f, "motor"), "total_accessable_power", [])), rt.fv(f, "mania_cost", rt.sv(f, "motor")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='sevtug＀'>\"＀\"</span>", [live(span_part), (yield* g.call(f, P("/proc/text2ratvar"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("turnoff_messages")])]))])]);
			} else {
				pickedmessage = rt.op(f, "PickUnweighted", [1], [rt.gl("powerloss_messages")]);
				$0 = rt.sv(f, "owner");
				$1 = live(span_part);
				if (truthy(rt.index(rt.gl("powerloss_messages"), live(pickedmessage)))) {
					$2 = fmt("＀", [(yield* g.call(f, P("/proc/text2ratvar"), null, [live(pickedmessage)]))]);
				} else {
					$2 = live(pickedmessage);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='sevtug＀'>＀</span>", [$1, $2])]);
			}
			rt.setSv(f, "warned_turnoff", 1);
		}
		rt.setSv(f, "severity", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "severity"), 2), 0])));
		if (!truthy(rt.sv(f, "severity"))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
	} else {
		if (truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "severity"), 2)]))) {
			rt.setSv(f, "warned_turnoff", 0);
		}
		if (!truthy((rt.isIn(f, rt.sv(f, "owner"), (yield* g.call(f, P("/proc/viewers"), null, [7, rt.sv(f, "motor")]))) ? 1 : 0))) {
			if ((!truthy(live(is_servant)) && !truthy(rt.sv(f, "warned_outofsight")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='sevtug＀'>\"＀\"</span>", [live(span_part), (yield* g.call(f, P("/proc/text2ratvar"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("flee_messages")])]))])]);
				rt.setSv(f, "warned_outofsight", 1);
			}
			rt.setSv(f, "severity", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "severity"), 1), 0])));
			if (!truthy(rt.sv(f, "severity"))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				return live(f.dot);
			}
		} else {
			if (truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "severity"), 2)]))) {
				rt.setSv(f, "warned_outofsight", 0);
			}
		}
	}
	if (truthy(live(is_servant))) {
		if (truthy(rt.fv(f, "hallucination", rt.sv(f, "owner")))) {
			rt.setFv(f, "hallucination", rt.sv(f, "owner"), 0);
		}
		if (truthy(rt.fv(f, "druggy", rt.sv(f, "owner")))) {
			yield* g.callName(f, rt.sv(f, "owner"), "adjust_drugginess", [rt.neg(rt.fv(f, "druggy", rt.sv(f, "owner")))]);
		}
		if (truthy(rt.fv(f, "dizziness", rt.sv(f, "owner")))) {
			rt.setFv(f, "dizziness", rt.sv(f, "owner"), 0);
		}
		if (truthy(rt.fv(f, "confused", rt.sv(f, "owner")))) {
			rt.setFv(f, "confused", rt.sv(f, "owner"), 0);
		}
		rt.setSv(f, "severity", 0);
	} else {
		if (!((!truthy((yield* g.callName(f, rt.sv(f, "owner"), "null_rod_check", []))) && !isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 2)) && truthy(rt.sv(f, "severity")))) return f.dot;
		if (rt.gt((yield* g.callName(f, rt.sv(f, "owner"), "getToxLoss", [])), 90)) {
			if (truthy((yield* g.call(f, P("/proc/is_eligible_servant"), null, [rt.sv(f, "owner")])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='sevtug＀'>\"＀\"</span>", [live(span_part), (yield* g.call(f, P("/proc/text2ratvar"), null, ["You are mine and his, now."]))])]);
				yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [rt.sv(f, "owner")]);
			}
			yield* g.callName(f, rt.sv(f, "owner"), "Unconscious", [100]);
		} else {
			if (truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "severity"), 0.15000000596046448)]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='sevtug＀'>\"＀\"</span>", [live(span_part), (yield* g.call(f, P("/proc/text2ratvar"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("mania_messages")])]))])]);
			}
			yield* g.callName(f, rt.sv(f, "owner"), "playsound_local", [rt.getStep(f, rt.sv(f, "motor"), 0), rt.gl("hum"), rt.sv(f, "severity"), 1]);
			yield* g.callName(f, rt.sv(f, "owner"), "adjust_drugginess", [(yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [multiply(rt.sv(f, "severity"), 0.07500000298023224), 1])), (yield* g.call(f, P("/proc/max"), null, [0, subtract(50, rt.fv(f, "druggy", rt.sv(f, "owner")))]))]))]))]);
			if (rt.lt(rt.fv(f, "hallucination", rt.sv(f, "owner")), 50)) {
				rt.setFv(f, "hallucination", rt.sv(f, "owner"), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "hallucination", rt.sv(f, "owner")), (yield* g.call(f, P("/proc/max"), null, [multiply(rt.sv(f, "severity"), 0.07500000298023224), 1]))), 50])));
			}
			if (rt.lt(rt.fv(f, "dizziness", rt.sv(f, "owner")), 50)) {
				rt.setFv(f, "dizziness", rt.sv(f, "owner"), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "dizziness", rt.sv(f, "owner")), (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "severity"), 0.05000000074505806), 1]))), 50])));
			}
			if (rt.lt(rt.fv(f, "confused", rt.sv(f, "owner")), 25)) {
				rt.setFv(f, "confused", rt.sv(f, "owner"), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "confused", rt.sv(f, "owner")), (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "severity"), 0.02500000037252903), 1]))), 25])));
			}
			yield* g.callName(f, rt.sv(f, "owner"), "adjustToxLoss", [multiply(rt.sv(f, "severity"), 0.019999999552965164), 1, 1]);
		}
		rt.incSrcVar(f, "severity", -1, true);
	}
	return f.dot;
}, true);

rt.type(937, "/datum/status_effect/crusher_mark", "/datum/status_effect", {
	marked_underlay: null,
	hammer_synced: null,
	id: "crusher_mark",
	duration: 300,
	status_type: 2,
	alert_type: null,
});

// /datum/status_effect/crusher_mark/proc/on_creation  (code/datums/status_effects/debuffs.dm:248)  may sleep
rt.def("/datum/status_effect/crusher_mark/proc/on_creation", function* on_creation(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	rt.setSv(f, "hammer_synced", live(f.args[1]));
	return f.dot;
}, true, { args: ["new_owner", "new_hammer_synced"] });

// /datum/status_effect/crusher_mark/proc/on_apply  (code/datums/status_effects/debuffs.dm:253)
rt.def("/datum/status_effect/crusher_mark/proc/on_apply", function on_apply(f: Frame) {
	if (rt.ge(rt.fv(f, "mob_size", rt.sv(f, "owner")), 3)) {
		rt.setSv(f, "marked_underlay", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/effects.dmi"), "shield2"]));
		rt.setFv(f, "pixel_x", rt.sv(f, "marked_underlay"), rt.neg(rt.fv(f, "pixel_x", rt.sv(f, "owner"))));
		rt.setFv(f, "pixel_y", rt.sv(f, "marked_underlay"), rt.neg(rt.fv(f, "pixel_y", rt.sv(f, "owner"))));
		rt.modField(f, rt.sv(f, "owner"), "underlays", rt.sv(f, "marked_underlay"), add);
		return 1;
	}
	return 0;
});

// /datum/status_effect/crusher_mark/proc/Destroy  (code/datums/status_effects/debuffs.dm:264)  may sleep
rt.def("/datum/status_effect/crusher_mark/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "hammer_synced", null);
	if (truthy(rt.sv(f, "owner"))) {
		(rt.modField(f, rt.sv(f, "owner"), "underlays", rt.sv(f, "marked_underlay"), subtract));
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "marked_underlay")]);
	rt.setSv(f, "marked_underlay", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/status_effect/crusher_mark/proc/be_replaced  (code/datums/status_effects/debuffs.dm:269)  may sleep
rt.def("/datum/status_effect/crusher_mark/proc/be_replaced", function* be_replaced(f: Frame) {
	(rt.modField(f, rt.sv(f, "owner"), "underlays", rt.sv(f, "marked_underlay"), subtract));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(938, "/datum/status_effect/saw_bleed", "/datum/status_effect", {
	bleed_overlay: null,
	bleed_underlay: null,
	bleed_amount: 3,
	bleed_buildup: 3,
	delay_before_decay: 5,
	bleed_damage: 200,
	needs_to_bleed: 0,
	id: "saw_bleed",
	duration: -1,
	tick_interval: 6,
	alert_type: null,
});

// /datum/status_effect/saw_bleed/proc/Destroy  (code/datums/status_effects/debuffs.dm:287)  may sleep
rt.def("/datum/status_effect/saw_bleed/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "owner"))) {
		yield* g.callName(f, rt.sv(f, "owner"), "cut_overlay", [rt.sv(f, "bleed_overlay")]);
		(rt.modField(f, rt.sv(f, "owner"), "underlays", rt.sv(f, "bleed_underlay"), subtract));
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "bleed_overlay")]);
	rt.setSv(f, "bleed_overlay", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/status_effect/saw_bleed/proc/on_apply  (code/datums/status_effects/debuffs.dm:293)
rt.def("/datum/status_effect/saw_bleed/proc/on_apply", function on_apply(f: Frame) {
	let I: Value = null, icon_height: Value = null;
	f.vars = () => [I, icon_height];
	if (isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 2)) {
		return 0;
	}
	rt.setSv(f, "bleed_overlay", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/bleed.dmi"), fmt("bleed＀", [rt.sv(f, "bleed_amount")])]));
	rt.setSv(f, "bleed_underlay", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/bleed.dmi"), fmt("bleed＀", [rt.sv(f, "bleed_amount")])]));
	I = rt.call(f, P("/proc/icon"), null, [rt.fv(f, "icon", rt.sv(f, "owner")), rt.fv(f, "icon_state", rt.sv(f, "owner")), rt.fv(f, "dir", rt.sv(f, "owner"))]);
	icon_height = rt.callName(f, live(I), "Height", []);
	rt.setFv(f, "pixel_x", rt.sv(f, "bleed_overlay"), rt.neg(rt.fv(f, "pixel_x", rt.sv(f, "owner"))));
	rt.setFv(f, "pixel_y", rt.sv(f, "bleed_overlay"), rt.call(f, P("/proc/Floor"), null, [multiply(live(icon_height), 0.25)]));
	rt.setFv(f, "transform", rt.sv(f, "bleed_overlay"), multiply(rt.call(f, P("/proc/matrix"), null, []), divide(live(icon_height), rt.fv(f, "icon_size", rt.world()))));
	rt.setFv(f, "pixel_x", rt.sv(f, "bleed_underlay"), rt.neg(rt.fv(f, "pixel_x", rt.sv(f, "owner"))));
	rt.setFv(f, "transform", rt.sv(f, "bleed_underlay"), multiply(multiply(rt.call(f, P("/proc/matrix"), null, []), divide(live(icon_height), rt.fv(f, "icon_size", rt.world()))), 3));
	rt.setFv(f, "alpha", rt.sv(f, "bleed_underlay"), 40);
	rt.callName(f, rt.sv(f, "owner"), "add_overlay", [rt.sv(f, "bleed_overlay")]);
	rt.modField(f, rt.sv(f, "owner"), "underlays", rt.sv(f, "bleed_underlay"), add);
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/status_effect/saw_bleed/proc/tick  (code/datums/status_effects/debuffs.dm:310)  may sleep
rt.def("/datum/status_effect/saw_bleed/proc/tick", function* tick(f: Frame) {
	if (isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 2)) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.srcCall(f, "add_bleed", -1);
	}
	return f.dot;
}, true);

// /datum/status_effect/saw_bleed/proc/add_bleed  (code/datums/status_effects/debuffs.dm:316)  may sleep
rt.def("/datum/status_effect/saw_bleed/proc/add_bleed", function* add_bleed(f: Frame, amount: Value) {
	f.vars = () => [amount];
	yield* g.callName(f, rt.sv(f, "owner"), "cut_overlay", [rt.sv(f, "bleed_overlay")]);
	(rt.modField(f, rt.sv(f, "owner"), "underlays", rt.sv(f, "bleed_underlay"), subtract));
	if (truthy((rt.modSrcVar(f, "bleed_amount", live(amount), add)))) {
		if (rt.ge(rt.sv(f, "bleed_amount"), 10)) {
			rt.setSv(f, "needs_to_bleed", 1);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else {
			if (rt.gt(live(amount), 0)) {
				rt.modSrcVar(f, "tick_interval", rt.sv(f, "delay_before_decay"), add);
			}
			rt.setFv(f, "icon_state", rt.sv(f, "bleed_overlay"), fmt("bleed＀", [rt.sv(f, "bleed_amount")]));
			rt.setFv(f, "icon_state", rt.sv(f, "bleed_underlay"), fmt("bleed＀", [rt.sv(f, "bleed_amount")]));
			yield* g.callName(f, rt.sv(f, "owner"), "add_overlay", [rt.sv(f, "bleed_overlay")]);
			rt.modField(f, rt.sv(f, "owner"), "underlays", rt.sv(f, "bleed_underlay"), add);
		}
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /datum/status_effect/saw_bleed/proc/on_remove  (code/datums/status_effects/debuffs.dm:335)  may sleep
rt.def("/datum/status_effect/saw_bleed/proc/on_remove", function* on_remove(f: Frame) {
	let _T: Value = null, d: Value = null;
	let $e: any;
	f.vars = () => [_T, d, $e];
	if (truthy(rt.sv(f, "needs_to_bleed"))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/bleed/explode"), [(_T = rt.getStep(f, rt.sv(f, "owner"), 0))]);
		d = null;
		rt.forList(f, 0, rt.gl("alldirs"));
		while (($e = rt.next(f, 0)) !== undefined) {
			d = $e;
			yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/bloodsplatter"), [live(_T), live(d)]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/playsound"), null, [live(_T), "desceration", 200, 1, -1]);
		yield* g.callName(f, rt.sv(f, "owner"), "adjustBruteLoss", [rt.sv(f, "bleed_damage")]);
	} else {
		yield* g.new_(f, T("/obj/effect/temp_visual/bleed"), [rt.getStep(f, rt.sv(f, "owner"), 0)]);
	}
	return f.dot;
}, true);
