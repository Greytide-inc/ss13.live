// From code/datums/martial/krav_maga.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(570, "/datum/martial_art/krav_maga", "/datum/martial_art", {
	neckchop: null,
	legsweep: null,
	lungpunch: null,
	name: "Krav Maga",
});

// /datum/martial_art/krav_maga/proc/<init>  (code/datums/martial/krav_maga.dm:3)  may sleep
rt.def("/datum/martial_art/krav_maga/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "neckchop", (yield* g.new_(f, T("/datum/action/neck_chop"), [])));
	$0 = $0;
	rt.setSv(f, "legsweep", (yield* g.new_(f, T("/datum/action/leg_sweep"), [])));
	$0 = $0;
	rt.setSv(f, "lungpunch", (yield* g.new_(f, T("/datum/action/lung_punch"), [])));
	return f.dot;
}, true);

rt.type(258, "/datum/action/neck_chop", "/datum/action", {
	name: "Neck Chop - Injures the neck, stopping the victim from speaking for a while.",
	button_icon_state: "neckchop",
});

// /datum/action/neck_chop/proc/Trigger  (code/datums/martial/krav_maga.dm:12)
rt.def("/datum/action/neck_chop/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy(rt.callName(f, rt.sv(f, "owner"), "incapacitated", []))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You can't use Krav Maga while you're incapacitated.</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.gv(f, "streak", rt.gv(f, "martial_art", rt.gv(f, "mind", (H = rt.sv(f, "owner"))))), "neck_chop")) {
		rt.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='danger'>＀ assumes a neutral stance.</span>", [rt.sv(f, "owner")]), "<b><i>Your next attack is cleared.</i></b>"]);
		rt.setFv(f, "streak", rt.gv(f, "martial_art", rt.fv(f, "mind", live(H))), "");
	} else {
		rt.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='danger'>＀ assumes the Neck Chop stance!</span>", [rt.sv(f, "owner")]), "<b><i>Your next attack will be a Neck Chop.</i></b>"]);
		rt.setFv(f, "streak", rt.gv(f, "martial_art", rt.fv(f, "mind", live(H))), "neck_chop");
	}
	return f.dot;
});

rt.type(259, "/datum/action/leg_sweep", "/datum/action", {
	name: "Leg Sweep - Trips the victim, knocking them down for a brief moment.",
	button_icon_state: "legsweep",
});

// /datum/action/leg_sweep/proc/Trigger  (code/datums/martial/krav_maga.dm:28)
rt.def("/datum/action/leg_sweep/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy(rt.callName(f, rt.sv(f, "owner"), "incapacitated", []))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You can't use Krav Maga while you're incapacitated.</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.gv(f, "streak", rt.gv(f, "martial_art", rt.gv(f, "mind", (H = rt.sv(f, "owner"))))), "leg_sweep")) {
		rt.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='danger'>＀ assumes a neutral stance.</span>", [rt.sv(f, "owner")]), "<b><i>Your next attack is cleared.</i></b>"]);
		rt.setFv(f, "streak", rt.gv(f, "martial_art", rt.fv(f, "mind", live(H))), "");
	} else {
		rt.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='danger'>＀ assumes the Leg Sweep stance!</span>", [rt.sv(f, "owner")]), "<b><i>Your next attack will be a Leg Sweep.</i></b>"]);
		rt.setFv(f, "streak", rt.gv(f, "martial_art", rt.fv(f, "mind", live(H))), "leg_sweep");
	}
	return f.dot;
});

rt.type(260, "/datum/action/lung_punch", "/datum/action", {
	name: "Lung Punch - Delivers a strong punch just above the victim's abdomen, constraining the lungs. The victim will be unable to breathe for a short time.",
	button_icon_state: "lungpunch",
});

// /datum/action/lung_punch/proc/Trigger  (code/datums/martial/krav_maga.dm:44)
rt.def("/datum/action/lung_punch/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy(rt.callName(f, rt.sv(f, "owner"), "incapacitated", []))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You can't use Krav Maga while you're incapacitated.</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.gv(f, "streak", rt.gv(f, "martial_art", rt.gv(f, "mind", (H = rt.sv(f, "owner"))))), "quick_choke")) {
		rt.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='danger'>＀ assumes a neutral stance.</span>", [rt.sv(f, "owner")]), "<b><i>Your next attack is cleared.</i></b>"]);
		rt.setFv(f, "streak", rt.gv(f, "martial_art", rt.fv(f, "mind", live(H))), "");
	} else {
		rt.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='danger'>＀ assumes the Lung Punch stance!</span>", [rt.sv(f, "owner")]), "<b><i>Your next attack will be a Lung Punch.</i></b>"]);
		rt.setFv(f, "streak", rt.gv(f, "martial_art", rt.fv(f, "mind", live(H))), "quick_choke");
	}
	return f.dot;
});

// /datum/martial_art/krav_maga/proc/teach  (code/datums/martial/krav_maga.dm:56)  may sleep
rt.def("/datum/martial_art/krav_maga/proc/teach", function* teach(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class = 'userdanger'>You know the arts of Krav Maga!</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class = 'danger'>Place your cursor over a move at the top of the screen to see what it does.</span>"]);
	yield* g.callName(f, rt.sv(f, "neckchop"), "Grant", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "legsweep"), "Grant", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "lungpunch"), "Grant", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["H", "make_temporary"] });

// /datum/martial_art/krav_maga/proc/remove  (code/datums/martial/krav_maga.dm:64)  may sleep
rt.def("/datum/martial_art/krav_maga/proc/remove", function* remove(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class = 'userdanger'>You suddenly forget the arts of Krav Maga...</span>"]);
	yield* g.callName(f, rt.sv(f, "neckchop"), "Remove", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "legsweep"), "Remove", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "lungpunch"), "Remove", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["H"] });

// /datum/martial_art/krav_maga/proc/check_streak  (code/datums/martial/krav_maga.dm:71)  may sleep
rt.def("/datum/martial_art/krav_maga/proc/check_streak", function* check_streak(f: Frame, A: Value, D: Value) {
	let $0: any;
	f.vars = () => [A, D, $0];
	$0 = rt.sv(f, "streak");
	if ($0 === "neck_chop") {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "neck_chop", live(A), live(D));
		return 1;
	} else if ($0 === "leg_sweep") {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "leg_sweep", live(A), live(D));
		return 1;
	} else if ($0 === "quick_choke") {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "quick_choke", live(A), live(D));
		return 1;
	}
	return 0;
}, true);

// /datum/martial_art/krav_maga/proc/leg_sweep  (code/datums/martial/krav_maga.dm:87)  may sleep
rt.def("/datum/martial_art/krav_maga/proc/leg_sweep", function* leg_sweep(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	if ((truthy(rt.fv(f, "stat", live(D))) || truthy((yield* g.callName(f, live(D), "IsKnockdown", []))))) {
		return 0;
	}
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ leg sweeps ＀!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ leg sweeps you!</span>", [live(A)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(A), 0), rt.rsc("sound/effects/hit_kick.ogg"), 50, 1, -1]);
	yield* g.callName(f, live(D), "apply_damage", [5, "brute"]);
	yield* g.callName(f, live(D), "Knockdown", [40]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "leg sweeped"]);
	return 1;
}, true);

// /datum/martial_art/krav_maga/proc/quick_choke  (code/datums/martial/krav_maga.dm:98)  may sleep
rt.def("/datum/martial_art/krav_maga/proc/quick_choke", function* quick_choke(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ pounds ＀ on the chest!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ slams your chest! You can't breathe!</span>", [live(A)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(A), 0), rt.rsc("sound/effects/hit_punch.ogg"), 50, 1, -1]);
	if (rt.le(rt.fv(f, "losebreath", live(D)), 10)) {
		rt.setFv(f, "losebreath", live(D), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "losebreath", live(D)), 5), 10]))])));
	}
	yield* g.callName(f, live(D), "adjustOxyLoss", [10]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "quickchoked"]);
	return 1;
}, true);

// /datum/martial_art/krav_maga/proc/neck_chop  (code/datums/martial/krav_maga.dm:108)  may sleep
rt.def("/datum/martial_art/krav_maga/proc/neck_chop", function* neck_chop(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ karate chops ＀'s neck!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ karate chops your neck, rendering you unable to speak!</span>", [live(A)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(A), 0), rt.rsc("sound/effects/hit_punch.ogg"), 50, 1, -1]);
	yield* g.callName(f, live(D), "apply_damage", [5, "brute"]);
	if (rt.le(rt.fv(f, "silent", live(D)), 10)) {
		rt.setFv(f, "silent", live(D), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "silent", live(D)), 10), 10]))])));
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "neck chopped"]);
	return 1;
}, true);

// /datum/martial_art/krav_maga/proc/grab_act  (code/datums/martial/krav_maga.dm:118)  may sleep
rt.def("/datum/martial_art/krav_maga/proc/grab_act", function* grab_act(f: Frame) {
	if (truthy((yield* g.srcCall(f, "check_streak", live(f.args[0]), live(f.args[1]))))) {
		return 1;
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.args[1]), "grabbed with krav maga"]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A", "D"] });

// /datum/martial_art/krav_maga/proc/harm_act  (code/datums/martial/krav_maga.dm:124)  may sleep
rt.def("/datum/martial_art/krav_maga/proc/harm_act", function* harm_act(f: Frame, A: Value, D: Value) {
	let picked_hit_type: Value = null, bonus_damage: Value = null;
	f.vars = () => [A, D, picked_hit_type, bonus_damage];
	if (truthy((yield* g.srcCall(f, "check_streak", live(A), live(D))))) {
		return 1;
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "punched"]);
	picked_hit_type = rt.op(f, "PickUnweighted", [2], ["punches", "kicks"]);
	bonus_damage = 10;
	if (((truthy((yield* g.callName(f, live(D), "IsKnockdown", []))) || truthy(rt.fv(f, "resting", live(D)))) || truthy(rt.fv(f, "lying", live(D))))) {
		bonus_damage = rt.modify(live(bonus_damage), 5, add);
		picked_hit_type = "stomps on";
	}
	yield* g.callName(f, live(D), "apply_damage", [live(bonus_damage), "brute"]);
	if ((isEqual(live(picked_hit_type), "kicks") || isEqual(live(picked_hit_type), "stomps on"))) {
		yield* g.callName(f, live(A), "do_attack_animation", [live(D), "kick"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(D), 0), rt.rsc("sound/effects/hit_kick.ogg"), 50, 1, -1]);
	} else {
		yield* g.callName(f, live(A), "do_attack_animation", [live(D), "punch"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(D), 0), rt.rsc("sound/effects/hit_punch.ogg"), 50, 1, -1]);
	}
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ ＀ ＀!</span>", [live(A), live(picked_hit_type), live(D)]), fmt("<span class='userdanger'>＀ ＀ you!</span>", [live(A), live(picked_hit_type)])]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), fmt("＀ with Krav Maga", [live(picked_hit_type)])]);
	return 1;
}, true);

// /datum/martial_art/krav_maga/proc/disarm_act  (code/datums/martial/krav_maga.dm:145)  may sleep
rt.def("/datum/martial_art/krav_maga/proc/disarm_act", function* disarm_act(f: Frame, A: Value, D: Value) {
	let I: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [A, D, I, $0, $1, $2, $3];
	if (truthy((yield* g.srcCall(f, "check_streak", live(A), live(D))))) {
		return 1;
	}
	I = null;
	if (truthy(rt.op(f, "Prob", [], [60]))) {
		if (truthy((I = (yield* g.callName(f, live(D), "get_active_held_item", []))))) {
			if (truthy((yield* g.callName(f, live(D), "drop_item", [])))) {
				yield* g.callName(f, live(A), "put_in_hands", [live(I)]);
			}
		}
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ has disarmed ＀!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ has disarmed ＀!</span>", [live(A), live(D)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(D), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
	} else {
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ attempted to disarm ＀!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ attempted to disarm ＀!</span>", [live(A), live(D)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(D), rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1]);
	}
	$0 = live(A);
	$1 = live(D);
	$2 = "disarmed with krav maga";
	if (truthy(live(I))) {
		$3 = fmt(" removing ％！", [live(I)]);
	} else {
		$3 = "";
	}
	yield* g.call(f, P("/proc/add_logs"), null, [$0, $1, $2, fmt("＀", [$3])]);
	return 1;
}, true);

rt.type(7658, "/obj/item/clothing/gloves/krav_maga", "/obj/item/clothing/gloves", {
	style: null,
});

// /obj/item/clothing/gloves/krav_maga/proc/<init>  (code/datums/martial/krav_maga.dm:166)  may sleep
rt.def("/obj/item/clothing/gloves/krav_maga/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "style", (yield* g.new_(f, T("/datum/martial_art/krav_maga"), [])));
	return f.dot;
}, true);

// /obj/item/clothing/gloves/krav_maga/proc/equipped  (code/datums/martial/krav_maga.dm:169)  may sleep
rt.def("/obj/item/clothing/gloves/krav_maga/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let H: Value = null;
	f.vars = () => [user, slot, H];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!isEqual(live(slot), 9)) return f.dot;
	H = live(user);
	yield* g.callName(f, rt.sv(f, "style"), "teach", [live(H), 1]);
	return f.dot;
}, true);

// /obj/item/clothing/gloves/krav_maga/proc/dropped  (code/datums/martial/krav_maga.dm:176)  may sleep
rt.def("/obj/item/clothing/gloves/krav_maga/proc/dropped", function* dropped(f: Frame, user: Value) {
	let H: Value = null;
	f.vars = () => [user, H];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!isEqual((yield* g.callName(f, (H = live(user)), "get_item_by_slot", [9])), live(f.src))) return f.dot;
	yield* g.callName(f, rt.sv(f, "style"), "remove", [live(H)]);
	return f.dot;
}, true);
