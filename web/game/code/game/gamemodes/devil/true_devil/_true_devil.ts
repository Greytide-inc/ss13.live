// From code/game/gamemodes/devil/true_devil/_true_devil.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4831, "/mob/living/carbon/true_devil", "/mob/living/carbon", {
	ascended: 0,
	oldform: null,
	devil_overlays: null,
	pass_flags: 0,
	name: "True Devil",
	desc: "A pile of infernal energy, taking a vaguely humanoid form.",
	icon: rt.rsc("icons/mob/32x64.dmi"),
	icon_state: "true_devil",
	gender: "neuter",
	health: 350,
	maxHealth: 350,
	ventcrawler: 0,
	density: 1,
	sight: 24,
	status_flags: 8,
	mob_size: 3,
	bodyparts: null,
});

// /mob/living/carbon/true_devil/proc/<init>  (code/game/gamemodes/devil/true_devil/_true_devil.dm:22)
rt.def("/mob/living/carbon/true_devil/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "devil_overlays", rt.op(f, "CreateMultidimensionalList", [1], [2]));
	$0 = $0;
	rt.setSv(f, "bodyparts", rt.list(T("/obj/item/bodypart/chest/devil"), T("/obj/item/bodypart/head/devil"), T("/obj/item/bodypart/l_arm/devil"), T("/obj/item/bodypart/r_arm/devil"), T("/obj/item/bodypart/r_leg/devil"), T("/obj/item/bodypart/l_leg/devil")));
	return f.dot;
});

// /mob/living/carbon/true_devil/proc/Initialize  (code/game/gamemodes/devil/true_devil/_true_devil.dm:27)  may sleep
rt.def("/mob/living/carbon/true_devil/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.srcCall(f, "create_bodyparts");
	yield* g.srcCall(f, "create_internal_organs");
	yield* g.callSrc(f, "grant_all_languages", ["omnitongue", 1], rt.Args.Named);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/true_devil/proc/create_internal_organs  (code/game/gamemodes/devil/true_devil/_true_devil.dm:33)  may sleep
rt.def("/mob/living/carbon/true_devil/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/brain"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/tongue"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/eyes"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/ears/invincible"), [])), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/true_devil/proc/convert_to_archdevil  (code/game/gamemodes/devil/true_devil/_true_devil.dm:42)
rt.def("/mob/living/carbon/true_devil/proc/convert_to_archdevil", function convert_to_archdevil(f: Frame) {
	rt.setSv(f, "maxHealth", 500);
	rt.setSv(f, "ascended", 1);
	rt.setSv(f, "health", rt.sv(f, "maxHealth"));
	rt.setSv(f, "icon_state", "arch_devil");
	return f.dot;
});

// /mob/living/carbon/true_devil/proc/set_name  (code/game/gamemodes/devil/true_devil/_true_devil.dm:46)
rt.def("/mob/living/carbon/true_devil/proc/set_name", function set_name(f: Frame) {
	let devilinfo: Value = null;
	f.vars = () => [devilinfo];
	rt.setSv(f, "name", rt.gv(f, "truename", (devilinfo = rt.callName(f, rt.sv(f, "mind"), "has_antag_datum", [T("/datum/antagonist/devil")]))));
	rt.setSv(f, "real_name", rt.sv(f, "name"));
	return f.dot;
});

// /mob/living/carbon/true_devil/proc/Login  (code/game/gamemodes/devil/true_devil/_true_devil.dm:51)  may sleep
rt.def("/mob/living/carbon/true_devil/proc/Login", function* Login(f: Frame) {
	let devilinfo: Value = null;
	f.vars = () => [devilinfo];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (devilinfo = (yield* g.callName(f, rt.sv(f, "mind"), "has_antag_datum", [T("/datum/antagonist/devil")]))), "greet", []);
	yield* g.callName(f, rt.sv(f, "mind"), "announce_objectives", []);
	return f.dot;
}, true);

// /mob/living/carbon/true_devil/proc/death  (code/game/gamemodes/devil/true_devil/_true_devil.dm:58)  may sleep
rt.def("/mob/living/carbon/true_devil/proc/death", function* death(f: Frame, gibbed: Value) {
	f.vars = () => [gibbed];
	rt.setSv(f, "stat", 2);
	yield* g.callSuper(f, [live(gibbed)]);
	yield* g.srcCall(f, "drop_all_held_items");
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [(yield* g.callName(f, rt.sv(f, "mind"), "has_antag_datum", [T("/datum/antagonist/devil")])), P("/datum/antagonist/devil/proc/beginResurrectionCheck"), live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/true_devil/proc/examine  (code/game/gamemodes/devil/true_devil/_true_devil.dm:64)
rt.def("/mob/living/carbon/true_devil/proc/examine", function examine(f: Frame, user: Value) {
	let msg: Value = null, I: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [msg, I, $0, $1, $e];
	msg = fmt("<span class='info'>*---------*\nThis is ＀ <b>＀</b>!\n", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(f.src)]);
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 128))) {
			if (truthy(rt.fv(f, "blood_DNA", live(I)))) {
				$0 = rt.call(f, P("/proc/bicon"), null, [live(I)]);
				if (isEqual(rt.fv(f, "gender", live(I)), "plural")) {
					$1 = "some";
				} else {
					$1 = "a";
				}
				msg = rt.modify(live(msg), fmt("<span class='warning'>It is holding ＀ ＀ blood-stained ＀ in its ＀!</span>\n", [$0, $1, rt.fv(f, "name", live(I)), rt.callSrc(f, "get_held_index_name", [rt.callSrc(f, "get_held_index_of_item", [live(I)])])]), add);
			} else {
				msg = rt.modify(live(msg), fmt("It is holding ＀ ＇！ in its ＀.\n", [rt.call(f, P("/proc/bicon"), null, [live(I)]), live(I), rt.callSrc(f, "get_held_index_name", [rt.callSrc(f, "get_held_index_of_item", [live(I)])])]), add);
			}
		}
	}
	rt.endFor(f, 0);
	if ((!truthy(rt.sv(f, "client")) && !isEqual(rt.sv(f, "stat"), 2))) {
		msg = rt.modify(live(msg), "The devil seems to be in deep contemplation.\n", add);
	}
	if (isEqual(rt.sv(f, "stat"), 2)) {
		msg = rt.modify(live(msg), "<span class='deadsay'>The hellfire seems to have been extinguished, for now at least.</span>\n", add);
	} else {
		if (rt.lt(rt.sv(f, "health"), divide(rt.sv(f, "maxHealth"), 10))) {
			msg = rt.modify(live(msg), "<span class='warning'>You can see hellfire inside its gaping wounds.</span>\n", add);
		} else {
			if (rt.lt(rt.sv(f, "health"), divide(rt.sv(f, "maxHealth"), 2))) {
				msg = rt.modify(live(msg), "<span class='warning'>You can see hellfire inside its wounds.</span>\n", add);
			}
		}
	}
	msg = rt.modify(live(msg), "*---------*</span>", add);
	rt.call(f, P("/proc/to_chat"), null, [live(user), live(msg)]);
	return f.dot;
});

// /mob/living/carbon/true_devil/proc/resist_buckle  (code/game/gamemodes/devil/true_devil/_true_devil.dm:93)  may sleep
rt.def("/mob/living/carbon/true_devil/proc/resist_buckle", function* resist_buckle(f: Frame) {
	if (!truthy(rt.sv(f, "buckled"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "buckled"), "user_unbuckle_mob", [live(f.src), live(f.src)]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ easily breaks out of their handcuffs!</span>", [live(f.src)]), "<span class='notice'>With just a thought your handcuffs fall off.</span>");
	return f.dot;
}, true);

// /mob/living/carbon/true_devil/proc/canUseTopic  (code/game/gamemodes/devil/true_devil/_true_devil.dm:98)
rt.def("/mob/living/carbon/true_devil/proc/canUseTopic", function canUseTopic(f: Frame, M: Value, be_close: Value) {
	f.vars = () => [be_close];
	if (live(be_close) === null) {
		be_close = 0;
	}
	if (truthy(rt.callSrc(f, "incapacitated", []))) {
		return 0;
	}
	if ((truthy(live(be_close)) && !rt.le(rt.call(f, P("/proc/get_dist"), null, [live(M), live(f.src)]), 1))) {
		return 0;
	}
	return 1;
});

// /mob/living/carbon/true_devil/proc/flash_act  (code/game/gamemodes/devil/true_devil/_true_devil.dm:108)  may sleep
rt.def("/mob/living/carbon/true_devil/proc/flash_act", function* flash_act(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!(truthy(rt.sv(f, "mind")) && truthy((yield* g.srcCall(f, "has_bane", "light"))))) return f.dot;
	yield* g.callName(f, rt.sv(f, "mind"), "disrupt_spells", [-500]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["intensity", "override_blindness_check", "affect_silicon"] });

// /mob/living/carbon/true_devil/proc/attacked_by  (code/game/gamemodes/devil/true_devil/_true_devil.dm:120)  may sleep
rt.def("/mob/living/carbon/true_devil/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value, def_zone: Value) {
	let weakness: Value = null, message_verb: Value = null, attack_message: Value = null;
	f.vars = () => [I, user, def_zone, weakness, message_verb, attack_message];
	weakness = (yield* g.srcCall(f, "check_weakness", live(I), live(user)));
	yield* g.srcCall(f, "apply_damage", multiply(rt.fv(f, "force", live(I)), live(weakness)), rt.fv(f, "damtype", live(I)), live(def_zone));
	message_verb = "";
	if ((truthy(rt.fv(f, "attack_verb", live(I))) && truthy(rt.getLen(f, rt.fv(f, "attack_verb", live(I)))))) {
		message_verb = fmt("＀", [rt.op(f, "PickUnweighted", [1], [rt.fv(f, "attack_verb", live(I))])]);
	} else {
		if (truthy(rt.fv(f, "force", live(I)))) {
			message_verb = "attacked";
		}
	}
	attack_message = fmt("＀ has been ＀ with ＀.", [live(f.src), live(message_verb), live(I)]);
	if (truthy(live(user))) {
		yield* g.callName(f, live(user), "do_attack_animation", [live(f.src)]);
		if (truthy((rt.isIn(f, live(user), (yield* g.call(f, P("/proc/viewers"), null, [live(f.src), null]))) ? 1 : 0))) {
			attack_message = fmt("＀ has ＀ ＀ with ＀!", [live(user), live(message_verb), live(f.src), live(I)]);
		}
	}
	if (truthy(live(message_verb))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀</span>", [live(attack_message)]), fmt("<span class='userdanger'>＀</span>", [live(attack_message)]), null, 3);
	}
	return 1;
}, true);

// /mob/living/carbon/true_devil/proc/singularity_act  (code/game/gamemodes/devil/true_devil/_true_devil.dm:144)  may sleep
rt.def("/mob/living/carbon/true_devil/proc/singularity_act", function* singularity_act(f: Frame) {
	if (truthy(rt.sv(f, "ascended"))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/carbon/true_devil/proc/attack_ghost  (code/game/gamemodes/devil/true_devil/_true_devil.dm:147)  may sleep
rt.def("/mob/living/carbon/true_devil/proc/attack_ghost", function* attack_ghost(f: Frame) {
	let S: Value = null, newobjective: Value = null;
	f.vars = () => [S, newobjective];
	if ((truthy(rt.sv(f, "ascended")) || isEqual(rt.gv(f, "soulOwner", rt.fv(f, "mind", live(f.args[0]))), rt.fv(f, "mind", live(f.src))))) {
		rt.setFv(f, "key", (S = (yield* g.new_(f, T("/mob/living/simple_animal/imp"), [rt.getStep(f, rt.sv(f, "loc"), 0)]))), rt.fv(f, "key", live(f.args[0])));
		rt.setFv(f, "assigned_role", rt.fv(f, "mind", live(S)), "Imp");
		rt.setFv(f, "special_role", rt.fv(f, "mind", live(S)), "Imp");
		rt.setFv(f, "explanation_text", (newobjective = (yield* g.new_(f, T("/datum/objective"), []))), "Try to get a promotion to a higher devilic rank.");
		rt.modField(f, rt.fv(f, "mind", live(S)), "objectives", live(newobjective), add);
		yield* g.call(f, P("/proc/to_chat"), null, [live(S), rt.fv(f, "playstyle_string", live(S))]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(S), fmt("<B>Objective #＀</B>: ＀", [1, rt.fv(f, "explanation_text", live(newobjective))])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/carbon/true_devil/proc/attack_hand  (code/game/gamemodes/devil/true_devil/_true_devil.dm:167)  may sleep
rt.def("/mob/living/carbon/true_devil/proc/attack_hand", function* attack_hand(f: Frame) {
	let damage: Value = null;
	let $0: any;
	f.vars = () => [damage, $0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	$0 = rt.fv(f, "a_intent", live(f.args[0]));
	if ($0 === "harm") {
		damage = (yield* g.call(f, P("/proc/rand"), null, [1, 5]));
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "punch", 25, 1, -1]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has punched ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has punched ＀!</span>", [live(f.args[0]), live(f.src)]));
		yield* g.srcCall(f, "adjustBruteLoss", live(damage));
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "attacked"]);
		yield* g.srcCall(f, "updatehealth");
	} else if ($0 === "disarm") {
		if (!(!truthy(rt.sv(f, "lying")) && !truthy(rt.sv(f, "ascended")))) return f.dot;
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.srcCall(f, "Unconscious", 40);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
			yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "pushed"]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has pushed down ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has pushed down ＀!</span>", [live(f.args[0]), live(f.src)]));
		} else {
			if (truthy(rt.op(f, "Prob", [], [25]))) {
				yield* g.srcCall(f, "drop_item");
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has disarmed ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has disarmed ＀!</span>", [live(f.args[0]), live(f.src)]));
			} else {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1]);
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has attempted to disarm ＀!</span>", [live(f.args[0]), live(f.src)]));
			}
		}
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/true_devil/proc/ex_act  (code/game/gamemodes/devil/true_devil/_true_devil.dm:202)  may sleep
rt.def("/mob/living/carbon/true_devil/proc/ex_act", function* ex_act(f: Frame) {
	let b_loss: Value = null;
	let $0: any;
	f.vars = () => [b_loss, $0];
	if (!truthy(rt.sv(f, "ascended"))) {
		b_loss = null;
		$0 = live(f.args[0]);
		if ($0 === 1) {
			b_loss = 500;
		} else if ($0 === 2) {
			b_loss = 150;
		} else if ($0 === 3) {
			b_loss = 30;
		}
		if (truthy((yield* g.srcCall(f, "has_bane", "light")))) {
			(b_loss = rt.modify(live(b_loss), 2, multiply));
		}
		yield* g.srcCall(f, "adjustBruteLoss", live(b_loss));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["severity", "ex_target"], waitfor: false });
