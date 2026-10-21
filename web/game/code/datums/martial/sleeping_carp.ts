// From code/datums/martial/sleeping_carp.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(572, "/datum/martial_art/the_sleeping_carp", "/datum/martial_art", {
	name: "The Sleeping Carp",
	deflection_chance: 100,
	no_guns: 1,
	allow_temp_override: 0,
	help_verb: rt.procRef("/mob/living/carbon/human/proc/sleeping_carp_help"),
});

// /datum/martial_art/the_sleeping_carp/proc/check_streak  (code/datums/martial/sleeping_carp.dm:15)  may sleep
rt.def("/datum/martial_art/the_sleeping_carp/proc/check_streak", function* check_streak(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "streak"), "DD"])))) {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "wristWrench", live(A), live(D));
		return 1;
	}
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "streak"), "HG"])))) {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "backKick", live(A), live(D));
		return 1;
	}
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "streak"), "GH"])))) {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "kneeStomach", live(A), live(D));
		return 1;
	}
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "streak"), "DHH"])))) {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "headKick", live(A), live(D));
		return 1;
	}
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "streak"), "HDHDH"])))) {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "elbowDrop", live(A), live(D));
		return 1;
	}
	return 0;
}, true);

// /datum/martial_art/the_sleeping_carp/proc/wristWrench  (code/datums/martial/sleeping_carp.dm:38)  may sleep
rt.def("/datum/martial_art/the_sleeping_carp/proc/wristWrench", function* wristWrench(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	if (((!truthy(rt.fv(f, "stat", live(D))) && !truthy((yield* g.callName(f, live(D), "IsStun", [])))) && !truthy((yield* g.callName(f, live(D), "IsKnockdown", []))))) {
		yield* g.callName(f, live(A), "do_attack_animation", [live(D), "punch"]);
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ grabs ＀'s wrist and wrenches it sideways!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ grabs your wrist and violently wrenches it to the side!</span>", [live(A)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(A), 0), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
		yield* g.callName(f, live(D), "emote", ["scream"]);
		yield* g.callName(f, live(D), "drop_item", []);
		yield* g.callName(f, live(D), "apply_damage", [5, "brute", rt.op(f, "PickUnweighted", [2], ["l_arm", "r_arm"])]);
		yield* g.callName(f, live(D), "Stun", [60]);
		return 1;
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "wrist wrenched (Sleeping Carp)"]);
	return (yield* g.srcCall(f, "basic_hit", live(A), live(D)));
}, true);

// /datum/martial_art/the_sleeping_carp/proc/backKick  (code/datums/martial/sleeping_carp.dm:52)  may sleep
rt.def("/datum/martial_art/the_sleeping_carp/proc/backKick", function* backKick(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	if (((isEqual(rt.fv(f, "dir", live(A)), rt.fv(f, "dir", live(D))) && !truthy(rt.fv(f, "stat", live(D)))) && !truthy((yield* g.callName(f, live(D), "IsKnockdown", []))))) {
		yield* g.callName(f, live(A), "do_attack_animation", [live(D), "punch"]);
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ kicks ＀ in the back!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ kicks you in the back, making you stumble and fall!</span>", [live(A)])]);
		yield* g.call(f, P("/proc/step_to"), null, [live(D), rt.getStep(f, live(D), rt.fv(f, "dir", live(D))), 1]);
		yield* g.callName(f, live(D), "Knockdown", [80]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(D), 0), rt.rsc("sound/weapons/punch1.ogg"), 50, 1, -1]);
		return 1;
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "back-kicked (Sleeping Carp)"]);
	return (yield* g.srcCall(f, "basic_hit", live(A), live(D)));
}, true);

// /datum/martial_art/the_sleeping_carp/proc/kneeStomach  (code/datums/martial/sleeping_carp.dm:64)  may sleep
rt.def("/datum/martial_art/the_sleeping_carp/proc/kneeStomach", function* kneeStomach(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	if ((!truthy(rt.fv(f, "stat", live(D))) && !truthy((yield* g.callName(f, live(D), "IsKnockdown", []))))) {
		yield* g.callName(f, live(A), "do_attack_animation", [live(D), "kick"]);
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ knees ＀ in the stomach!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ winds you with a knee in the stomach!</span>", [live(A)])]);
		yield* g.callName(f, live(D), "audible_message", [fmt("<b>＀</b> gags!", [live(D)])]);
		rt.modField(f, live(D), "losebreath", 3, add);
		yield* g.callName(f, live(D), "Stun", [40]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(D), 0), rt.rsc("sound/weapons/punch1.ogg"), 50, 1, -1]);
		return 1;
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "stomach kneed (Sleeping Carp)"]);
	return (yield* g.srcCall(f, "basic_hit", live(A), live(D)));
}, true);

// /datum/martial_art/the_sleeping_carp/proc/headKick  (code/datums/martial/sleeping_carp.dm:77)  may sleep
rt.def("/datum/martial_art/the_sleeping_carp/proc/headKick", function* headKick(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	if ((!truthy(rt.fv(f, "stat", live(D))) && !truthy((yield* g.callName(f, live(D), "IsKnockdown", []))))) {
		yield* g.callName(f, live(A), "do_attack_animation", [live(D), "kick"]);
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ kicks ＀ in the head!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ kicks you in the jaw!</span>", [live(A)])]);
		yield* g.callName(f, live(D), "apply_damage", [20, "brute", "head"]);
		yield* g.callName(f, live(D), "drop_item", []);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(D), 0), rt.rsc("sound/weapons/punch1.ogg"), 50, 1, -1]);
		yield* g.callName(f, live(D), "Stun", [80]);
		return 1;
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "head kicked (Sleeping Carp)"]);
	return (yield* g.srcCall(f, "basic_hit", live(A), live(D)));
}, true);

// /datum/martial_art/the_sleeping_carp/proc/elbowDrop  (code/datums/martial/sleeping_carp.dm:90)  may sleep
rt.def("/datum/martial_art/the_sleeping_carp/proc/elbowDrop", function* elbowDrop(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	if (((truthy((yield* g.callName(f, live(D), "IsKnockdown", []))) || truthy(rt.fv(f, "resting", live(D)))) || truthy(rt.fv(f, "stat", live(D))))) {
		yield* g.callName(f, live(A), "do_attack_animation", [live(D), "punch"]);
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ elbow drops ＀!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ piledrives you with their elbow!</span>", [live(A)])]);
		if (truthy(rt.fv(f, "stat", live(D)))) {
			yield* g.callName(f, live(D), "death", []);
		}
		yield* g.callName(f, live(D), "apply_damage", [50, "brute", "chest"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(D), 0), rt.rsc("sound/weapons/punch1.ogg"), 75, 1, -1]);
		return 1;
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "elbow dropped (Sleeping Carp)"]);
	return (yield* g.srcCall(f, "basic_hit", live(A), live(D)));
}, true);

// /datum/martial_art/the_sleeping_carp/proc/grab_act  (code/datums/martial/sleeping_carp.dm:103)  may sleep
rt.def("/datum/martial_art/the_sleeping_carp/proc/grab_act", function* grab_act(f: Frame, A: Value, D: Value) {
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
			yield* g.callName(f, live(D), "drop_all_held_items", []);
			yield* g.callName(f, live(D), "stop_pulling", []);
			if (isEqual(rt.fv(f, "a_intent", live(A)), "grab")) {
				yield* g.call(f, P("/proc/add_logs"), null, [null, live(A), null, live(D), null, "grabbed", "addition", "aggressively"], rt.Args.Named);
				rt.setFv(f, "grab_state", live(A), 1);
			} else {
				yield* g.call(f, P("/proc/add_logs"), null, [null, live(A), null, live(D), null, "grabbed", "addition", "passively"], rt.Args.Named);
				rt.setFv(f, "grab_state", live(A), 0);
			}
		}
	}
	return 1;
}, true);

// /datum/martial_art/the_sleeping_carp/proc/harm_act  (code/datums/martial/sleeping_carp.dm:122)  may sleep
rt.def("/datum/martial_art/the_sleeping_carp/proc/harm_act", function* harm_act(f: Frame, A: Value, D: Value) {
	let atk_verb: Value = null;
	f.vars = () => [A, D, atk_verb];
	yield* g.srcCall(f, "add_to_streak", "H", live(D));
	if (truthy((yield* g.srcCall(f, "check_streak", live(A), live(D))))) {
		return 1;
	}
	yield* g.callName(f, live(A), "do_attack_animation", [live(D), "punch"]);
	atk_verb = rt.op(f, "PickUnweighted", [5], ["punches", "kicks", "chops", "hits", "slams"]);
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ ＀ ＀!</span>", [live(A), live(atk_verb), live(D)]), fmt("<span class='userdanger'>＀ ＀ you!</span>", [live(A), live(atk_verb)])]);
	yield* g.callName(f, live(D), "apply_damage", [(yield* g.call(f, P("/proc/rand"), null, [10, 15])), "brute"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(D), 0), rt.rsc("sound/weapons/punch1.ogg"), 25, 1, -1]);
	if ((truthy(rt.op(f, "Prob", [], [(yield* g.callName(f, live(D), "getBruteLoss", []))])) && !truthy(rt.fv(f, "lying", live(D))))) {
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ stumbles and falls!</span>", [live(D)]), "<span class='userdanger'>The blow sends you to the ground!</span>"]);
		yield* g.callName(f, live(D), "Knockdown", [80]);
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), fmt("＀ (Sleeping Carp)", [live(atk_verb)])]);
	return 1;
}, true);

// /datum/martial_art/the_sleeping_carp/proc/disarm_act  (code/datums/martial/sleeping_carp.dm:139)  may sleep
rt.def("/datum/martial_art/the_sleeping_carp/proc/disarm_act", function* disarm_act(f: Frame) {
	yield* g.srcCall(f, "add_to_streak", "D", live(f.args[1]));
	if (truthy((yield* g.srcCall(f, "check_streak", live(f.args[0]), live(f.args[1]))))) {
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["A", "D"] });

// /mob/living/carbon/human/proc/sleeping_carp_help  (code/datums/martial/sleeping_carp.dm:149)
rt.def("/mob/living/carbon/human/proc/sleeping_carp_help", function sleeping_carp_help(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<b><i>You retreat inward and recall the teachings of the Sleeping Carp...</i></b>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Wrist Wrench</span>: Disarm Disarm. Forces opponent to drop item in hand."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Back Kick</span>: Harm Grab. Opponent must be facing away. Knocks down."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Stomach Knee</span>: Grab Harm. Knocks the wind out of opponent and stuns."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Head Kick</span>: Disarm Harm Harm. Decent damage, forces opponent to drop item in hand."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Elbow Drop</span>: Harm Disarm Harm Disarm Harm. Opponent must be on the ground. Deals huge damage, instantly kills anyone in critical condition."]);
	return f.dot;
}, false, { verb: { name: "Recall Teachings", category: "Sleeping Carp", desc: "Remember the martial techniques of the Sleeping Carp clan." } });

rt.type(5610, "/obj/item/weapon/sleeping_carp_scroll", "/obj/item/weapon", {
	name: "mysterious scroll",
	desc: "A scroll filled with strange markings. It seems to be drawings of some sort of martial art.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll2",
});

// /obj/item/weapon/sleeping_carp_scroll/proc/attack_self  (code/datums/martial/sleeping_carp.dm:164)  may sleep
rt.def("/obj/item/weapon/sleeping_carp_scroll/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let message: Value = null, theSleepingCarp: Value = null;
	f.vars = () => [user, message, theSleepingCarp];
	if ((!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) || !truthy(live(user)))) {
		return live(f.dot);
	}
	message = "<span class='sciradio'>You have learned the ancient martial art of the Sleeping Carp! Your hand-to-hand combat has become much more effective, and you are now able to deflect any projectiles directed toward you. However, you are also unable to use any ranged weaponry. You can learn more about your newfound art by using the Recall Teachings verb in the Sleeping Carp tab.</span>";
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), live(message)]);
	yield* g.callName(f, (theSleepingCarp = (yield* g.new_(f, T("/datum/martial_art/the_sleeping_carp"), [null]))), "teach", [live(user)]);
	yield* g.callName(f, live(user), "drop_item", []);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ lights up in fire and quickly burns to ash.</span>", [live(f.src)]));
	yield* g.new_(f, T("/obj/effect/decal/cleanable/ash"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(5612, "/obj/item/weapon/twohanded/bostaff", "/obj/item/weapon/twohanded", {
	throw_speed: 2,
	name: "bo staff",
	desc: "A long, tall staff made of polished wood. Traditionally used in ancient old-Earth martial arts. Can be wielded to both kill and incapacitate.",
	force: 10,
	w_class: 4,
	slot_flags: 1024,
	force_unwielded: 10,
	force_wielded: 24,
	throwforce: 20,
	attack_verb: null,
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "bostaff0",
	block_chance: 50,
});

// /obj/item/weapon/twohanded/bostaff/proc/update_icon  (code/datums/martial/sleeping_carp.dm:192)
rt.def("/obj/item/weapon/twohanded/bostaff/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("bostaff＀", [rt.sv(f, "wielded")]));
	return live(f.dot);
});

// /obj/item/weapon/twohanded/bostaff/proc/attack  (code/datums/martial/sleeping_carp.dm:196)  may sleep
rt.def("/obj/item/weapon/twohanded/bostaff/proc/attack", function* attack(f: Frame) {
	let H: Value = null, C: Value = null, H_1: Value = null, fluffmessages: Value = null, total_health: Value = null;
	f.vars = () => [H, C, H_1, fluffmessages, total_health];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if ((truthy((rt.isIn(f, 256, rt.fv(f, "disabilities", live(f.args[1]))) ? 1 : 0)) && truthy(rt.op(f, "Prob", [], [50])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class ='warning'>You club yourself over the head with ＀.</span>", [live(f.src)])]);
		yield* g.callName(f, live(f.args[1]), "Knockdown", [60]);
		if (truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.callName(f, (H = live(f.args[1])), "apply_damage", [multiply(2, rt.sv(f, "force")), "brute", "head"]);
		} else {
			yield* g.callName(f, live(f.args[1]), "take_bodypart_damage", [multiply(2, rt.sv(f, "force"))]);
		}
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(rt.gv(f, "stat", (C = live(f.args[0]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>It would be dishonorable to attack a foe while they cannot retaliate.</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "disarm")) {
		if (!truthy(rt.sv(f, "wielded"))) {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
		if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
		H_1 = live(f.args[0]);
		fluffmessages = rt.list(fmt("＀ clubs ＀ with ＀!", [live(f.args[1]), live(H_1), live(f.src)]), fmt("＀ smacks ＀ with the butt of ＀!", [live(f.args[1]), live(H_1), live(f.src)]), fmt("＀ broadsides ＀ with ＀!", [live(f.args[1]), live(H_1), live(f.src)]), fmt("＀ smashes ＀'s head with ＀!", [live(f.args[1]), live(H_1), live(f.src)]), fmt("＀ beats ＀ with front of ＀!", [live(f.args[1]), live(H_1), live(f.src)]), fmt("＀ twirls and slams ＀ with ＀!", [live(f.args[1]), live(H_1), live(f.src)]));
		yield* g.callName(f, live(H_1), "visible_message", [fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [1], [live(fluffmessages)])]), fmt("<span class='userdanger'>＀</span>", [rt.op(f, "PickUnweighted", [1], [live(fluffmessages)])])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.args[1]), 0), rt.rsc("sound/effects/woodhit.ogg"), 75, 1, -1]);
		yield* g.callName(f, live(H_1), "adjustStaminaLoss", [(yield* g.call(f, P("/proc/rand"), null, [13, 20]))]);
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.callName(f, live(H_1), "visible_message", [fmt("<span class='warning'>＀ collapses!</span>", [live(H_1)]), "<span class='userdanger'>Your legs give out!</span>"]);
			yield* g.callName(f, live(H_1), "Knockdown", [80]);
		}
		if ((truthy(rt.fv(f, "staminaloss", live(H_1))) && !truthy((yield* g.callName(f, live(H_1), "IsSleeping", []))))) {
			if ((rt.le((total_health = subtract(rt.fv(f, "health", live(H_1)), rt.fv(f, "staminaloss", live(H_1)))), 0) && !truthy(rt.fv(f, "stat", live(H_1))))) {
				yield* g.callName(f, live(H_1), "visible_message", [fmt("<span class='warning'>＀ delivers a heavy hit to ＀'s head, knocking them out cold!</span>", [live(f.args[1]), live(H_1)]), fmt("<span class='userdanger'>＀ knocks you unconscious!</span>", [live(f.args[1])])]);
				yield* g.callName(f, live(H_1), "SetSleeping", [600]);
				yield* g.callName(f, live(H_1), "adjustBrainLoss", [25]);
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/twohanded/bostaff/proc/hit_reaction  (code/datums/martial/sleeping_carp.dm:246)
rt.def("/obj/item/weapon/twohanded/bostaff/proc/hit_reaction", function hit_reaction(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = "the attack";
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 0;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 1;
	}
	if (truthy(rt.sv(f, "wielded"))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return 0;
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });
