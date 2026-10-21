// From code/datums/martial/cqc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(569, "/datum/martial_art/cqc", "/datum/martial_art", {
	name: "CQC",
	block_chance: 75,
	help_verb: rt.procRef("/mob/living/carbon/human/proc/CQC_help"),
});

// /datum/martial_art/cqc/proc/check_streak  (code/datums/martial/cqc.dm:16)  may sleep
rt.def("/datum/martial_art/cqc/proc/check_streak", function* check_streak(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "streak"), "GH"])))) {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "Slam", live(A), live(D));
		return 1;
	}
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "streak"), "HH"])))) {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "Kick", live(A), live(D));
		return 1;
	}
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "streak"), "GG"])))) {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "Restrain", live(A), live(D));
		return 1;
	}
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "streak"), "DG"])))) {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "Pressure", live(A), live(D));
		return 1;
	}
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "streak"), "DDH"])))) {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "Consecutive", live(A), live(D));
	}
	return 0;
}, true);

// /datum/martial_art/cqc/proc/Slam  (code/datums/martial/cqc.dm:38)  may sleep
rt.def("/datum/martial_art/cqc/proc/Slam", function* Slam(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	if ((!truthy(rt.fv(f, "stat", live(D))) || !truthy((yield* g.callName(f, live(D), "IsKnockdown", []))))) {
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ slams ＀ into the ground!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ slams you into the ground!</span>", [live(A)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(A), 0), rt.rsc("sound/weapons/slam.ogg"), 50, 1, -1]);
		yield* g.callName(f, live(D), "apply_damage", [10, "brute"]);
		yield* g.callName(f, live(D), "Knockdown", [120]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "cqc slammed"]);
	}
	return 1;
}, true);

// /datum/martial_art/cqc/proc/Kick  (code/datums/martial/cqc.dm:48)  may sleep
rt.def("/datum/martial_art/cqc/proc/Kick", function* Kick(f: Frame, A: Value, D: Value) {
	let throw_target: Value = null;
	f.vars = () => [A, D, throw_target];
	if ((!truthy(rt.fv(f, "stat", live(D))) || !truthy((yield* g.callName(f, live(D), "IsKnockdown", []))))) {
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ kicks ＀ back!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ kicks you back!</span>", [live(A)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(A), 0), rt.rsc("sound/weapons/cqchit1.ogg"), 50, 1, -1]);
		throw_target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(D), rt.fv(f, "dir", live(A))]));
		yield* g.callName(f, live(D), "throw_at", [live(throw_target), 1, 14, live(A)]);
		yield* g.callName(f, live(D), "apply_damage", [10, "brute"]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "cqc kicked"]);
	}
	if ((truthy((yield* g.callName(f, live(D), "IsKnockdown", []))) && !truthy(rt.fv(f, "stat", live(D))))) {
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ kicks ＀'s head, knocking them out!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ kicks your head, knocking you out!</span>", [live(A)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(A), 0), rt.rsc("sound/weapons/genhit1.ogg"), 50, 1, -1]);
		yield* g.callName(f, live(D), "SetSleeping", [300]);
		yield* g.callName(f, live(D), "adjustBrainLoss", [25]);
	}
	return 1;
}, true);

// /datum/martial_art/cqc/proc/Pressure  (code/datums/martial/cqc.dm:65)  may sleep
rt.def("/datum/martial_art/cqc/proc/Pressure", function* Pressure(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ forces their arm on ＀'s neck!</span>", [live(A), live(D)])]);
	yield* g.callName(f, live(D), "adjustStaminaLoss", [60]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(A), 0), rt.rsc("sound/weapons/cqchit1.ogg"), 50, 1, -1]);
	return 1;
}, true);

// /datum/martial_art/cqc/proc/Restrain  (code/datums/martial/cqc.dm:73)  may sleep
rt.def("/datum/martial_art/cqc/proc/Restrain", function* Restrain(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	if (truthy(rt.sv(f, "restraining"))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "stat", live(D)))) {
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ locks ＀ into a restraining position!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ locks you into a restraining position!</span>", [live(A)])]);
		yield* g.callName(f, live(D), "adjustStaminaLoss", [20]);
		yield* g.callName(f, live(D), "Stun", [100]);
		rt.setSv(f, "restraining", 1);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/martial_art/cqc/proc/drop_restraining")])), 50, 1]);
	}
	return 1;
}, true);

// /datum/martial_art/cqc/proc/Consecutive  (code/datums/martial/cqc.dm:83)  may sleep
rt.def("/datum/martial_art/cqc/proc/Consecutive", function* Consecutive(f: Frame, A: Value, D: Value) {
	let I: Value = null;
	f.vars = () => [A, D, I];
	if (!truthy(rt.fv(f, "stat", live(D)))) {
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ strikes ＀'s abdomen, neck and back consecutively</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ strikes your abdomen, neck and back consecutively!</span>", [live(A)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(D), 0), rt.rsc("sound/weapons/cqchit2.ogg"), 50, 1, -1]);
		if ((truthy((I = (yield* g.callName(f, live(D), "get_active_held_item", [])))) && truthy((yield* g.callName(f, live(D), "drop_item", []))))) {
			yield* g.callName(f, live(A), "put_in_hands", [live(I)]);
		}
		yield* g.callName(f, live(D), "adjustStaminaLoss", [50]);
		yield* g.callName(f, live(D), "apply_damage", [25, "brute"]);
	}
	return 1;
}, true);

// /datum/martial_art/cqc/proc/grab_act  (code/datums/martial/cqc.dm:95)  may sleep
rt.def("/datum/martial_art/cqc/proc/grab_act", function* grab_act(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	yield* g.srcCall(f, "add_to_streak", "G", live(D));
	if (truthy((yield* g.srcCall(f, "check_streak", live(A), live(D))))) {
		return 1;
	}
	if (rt.ge(rt.fv(f, "grab_state", live(A)), 1)) {
		yield* g.callName(f, live(D), "grabbedby", [live(A), 1]);
	} else {
		yield* g.callName(f, live(A), "start_pulling", [live(D), 1]);
		if (truthy(rt.fv(f, "pulling", live(A)))) {
			yield* g.callName(f, live(D), "stop_pulling", []);
			yield* g.call(f, P("/proc/add_logs"), null, [null, live(A), null, live(D), null, "grabbed", "addition", "aggressively"], rt.Args.Named);
			rt.setFv(f, "grab_state", live(A), 1);
		}
	}
	return 1;
}, true);

// /datum/martial_art/cqc/proc/harm_act  (code/datums/martial/cqc.dm:110)  may sleep
rt.def("/datum/martial_art/cqc/proc/harm_act", function* harm_act(f: Frame, A: Value, D: Value) {
	let picked_hit_type: Value = null, bonus_damage: Value = null;
	f.vars = () => [A, D, picked_hit_type, bonus_damage];
	yield* g.srcCall(f, "add_to_streak", "H", live(D));
	if (truthy((yield* g.srcCall(f, "check_streak", live(A), live(D))))) {
		return 1;
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "CQC'd"]);
	yield* g.callName(f, live(A), "do_attack_animation", [live(D)]);
	picked_hit_type = rt.op(f, "PickUnweighted", [2], ["CQC'd", "Big Bossed"]);
	bonus_damage = 13;
	if (((truthy((yield* g.callName(f, live(D), "IsKnockdown", []))) || truthy(rt.fv(f, "resting", live(D)))) || truthy(rt.fv(f, "lying", live(D))))) {
		bonus_damage = rt.modify(live(bonus_damage), 5, add);
		picked_hit_type = "stomps on";
	}
	yield* g.callName(f, live(D), "apply_damage", [live(bonus_damage), "brute"]);
	if ((isEqual(live(picked_hit_type), "kicks") || isEqual(live(picked_hit_type), "stomps on"))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(D), 0), rt.rsc("sound/weapons/cqchit2.ogg"), 50, 1, -1]);
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(D), 0), rt.rsc("sound/weapons/cqchit1.ogg"), 50, 1, -1]);
	}
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ ＀ ＀!</span>", [live(A), live(picked_hit_type), live(D)]), fmt("<span class='userdanger'>＀ ＀ you!</span>", [live(A), live(picked_hit_type)])]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), fmt("＀ with CQC", [live(picked_hit_type)])]);
	if (((truthy(rt.fv(f, "resting", live(A))) && !truthy(rt.fv(f, "stat", live(D)))) && !truthy((yield* g.callName(f, live(D), "IsKnockdown", []))))) {
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ leg sweeps ＀!", [live(A), live(D)]), fmt("<span class='userdanger'>＀ leg sweeps you!</span>", [live(A)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(A), 0), rt.rsc("sound/effects/hit_kick.ogg"), 50, 1, -1]);
		yield* g.callName(f, live(D), "apply_damage", [10, "brute"]);
		yield* g.callName(f, live(D), "Knockdown", [60]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "cqc sweeped"]);
	}
	return 1;
}, true);

// /datum/martial_art/cqc/proc/disarm_act  (code/datums/martial/cqc.dm:138)  may sleep
rt.def("/datum/martial_art/cqc/proc/disarm_act", function* disarm_act(f: Frame, A: Value, D: Value) {
	let I: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [A, D, I, $0, $1, $2, $3];
	yield* g.srcCall(f, "add_to_streak", "D", live(D));
	I = null;
	if (truthy((yield* g.srcCall(f, "check_streak", live(A), live(D))))) {
		return 1;
	}
	if (truthy(rt.op(f, "Prob", [], [65]))) {
		if (((!truthy(rt.fv(f, "stat", live(D))) || !truthy((yield* g.callName(f, live(D), "IsKnockdown", [])))) || !truthy(rt.sv(f, "restraining")))) {
			I = (yield* g.callName(f, live(D), "get_active_held_item", []));
			yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ strikes ＀'s jaw with their hand!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ strikes your jaw, disorienting you!</span>", [live(A)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(D), 0), rt.rsc("sound/weapons/cqchit1.ogg"), 50, 1, -1]);
			if ((truthy(live(I)) && truthy((yield* g.callName(f, live(D), "drop_item", []))))) {
				yield* g.callName(f, live(A), "put_in_hands", [live(I)]);
			}
			yield* g.callName(f, live(D), "Jitter", [2]);
			yield* g.callName(f, live(D), "apply_damage", [5, "brute"]);
		}
	} else {
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ attempted to disarm ＀!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ attempted to disarm ＀!</span>", [live(A), live(D)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(D), rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1]);
	}
	$0 = live(A);
	$1 = live(D);
	$2 = "disarmed with CQC";
	if (truthy(live(I))) {
		$3 = fmt(" grabbing ％！", [live(I)]);
	} else {
		$3 = "";
	}
	yield* g.call(f, P("/proc/add_logs"), null, [$0, $1, $2, fmt("＀", [$3])]);
	if ((truthy(rt.sv(f, "restraining")) && isEqual(rt.fv(f, "pulling", live(A)), live(D)))) {
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ puts ＀ into a chokehold!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ puts you into a chokehold!</span>", [live(A)])]);
		yield* g.callName(f, live(D), "SetSleeping", [400]);
		rt.setSv(f, "restraining", 0);
		if (rt.lt(rt.fv(f, "grab_state", live(A)), 2)) {
			rt.setFv(f, "grab_state", live(A), 2);
		}
	} else {
		rt.setSv(f, "restraining", 0);
		return 0;
	}
	return 1;
}, true);

// /mob/living/carbon/human/proc/CQC_help  (code/datums/martial/cqc.dm:174)
rt.def("/mob/living/carbon/human/proc/CQC_help", function CQC_help(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<b><i>You try to remember some of the basics of CQC.</i></b>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Slam</span>: Grab Harm. Slam opponent into the ground, knocking them down."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>CQC Kick</span>: Harm Disarm Harm. Knocks opponent away. Knocks out stunned or knocked down opponents."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Restrain</span>: Grab Grab. Locks opponents into a restraining position, disarm to knock them out with a choke hold."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Pressure</span>: Disarm Grab. Decent stamina damage."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Consecutive CQC</span>: Disarm Disarm Harm. Mainly offensive move, huge damage and decent stamina damage."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<b><i>In addition, by having your throw mode on when being attacked, you enter an active defense mode where you have a chance to block and sometimes even counter attacks done to you.</i></b>"]);
	return f.dot;
}, false, { verb: { name: "Remember The Basics", category: "CQC", desc: "You try to remember some of the basics of CQC." } });

rt.type(5608, "/obj/item/weapon/cqc_manual", "/obj/item/weapon", {
	name: "old manual",
	desc: "A small, black manual. There are drawn instructions of tactical hand-to-hand combat.",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "cqcmanual",
});

// /obj/item/weapon/cqc_manual/proc/attack_self  (code/datums/martial/cqc.dm:191)  may sleep
rt.def("/obj/item/weapon/cqc_manual/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let D: Value = null;
	f.vars = () => [user, D];
	if ((!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) || !truthy(live(user)))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldannounce'>You remember the basics of CQC.</span>"]);
	yield* g.callName(f, (D = (yield* g.new_(f, T("/datum/martial_art/cqc"), [null]))), "teach", [live(user)]);
	yield* g.callName(f, live(user), "drop_item", []);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ beeps ominously, and a moment later it bursts up in flames.</span>", [live(f.src)]));
	yield* g.new_(f, T("/obj/effect/decal/cleanable/ash"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
