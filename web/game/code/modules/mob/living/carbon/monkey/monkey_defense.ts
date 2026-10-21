// From code/modules/mob/living/carbon/monkey/monkey_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/monkey/proc/help_shake_act  (code/modules/mob/living/carbon/monkey/monkey_defense.dm:2)  may sleep
rt.def("/mob/living/carbon/monkey/proc/help_shake_act", function* help_shake_act(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if ((rt.lt(rt.sv(f, "health"), 0) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		yield* g.callName(f, (H = live(f.args[0])), "do_cpr", [live(f.src)]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/monkey/proc/attack_paw  (code/modules/mob/living/carbon/monkey/monkey_defense.dm:9)  may sleep
rt.def("/mob/living/carbon/monkey/proc/attack_paw", function* attack_paw(f: Frame) {
	let dam_zone: Value = null, affecting: Value = null, dmg: Value = null;
	f.vars = () => [dam_zone, affecting, dmg];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	dam_zone = rt.op(f, "PickUnweighted", [5], ["chest", "l_hand", "r_hand", "l_leg", "r_leg"]);
	if (!truthy((affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [live(dam_zone)]))))))) {
		affecting = (yield* g.srcCall(f, "get_bodypart", "chest"));
	}
	if (truthy(rt.fv(f, "limb_destroyer", live(f.args[0])))) {
		yield* g.srcCall(f, "dismembering_strike", live(f.args[0]), rt.fv(f, "body_zone", live(affecting)));
	}
	if (isEqual(rt.sv(f, "stat"), 2)) return f.dot;
	yield* g.srcCall(f, "apply_damage", (dmg = (yield* g.call(f, P("/proc/rand"), null, [1, 5]))), "brute", live(affecting));
	yield* g.srcCall(f, "damage_clothes", live(dmg), "brute", "melee", rt.fv(f, "body_zone", live(affecting)));
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/monkey/proc/attack_larva  (code/modules/mob/living/carbon/monkey/monkey_defense.dm:24)  may sleep
rt.def("/mob/living/carbon/monkey/proc/attack_larva", function* attack_larva(f: Frame) {
	let damage: Value = null, affecting: Value = null;
	f.vars = () => [damage, affecting];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	damage = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
	if (isEqual(rt.sv(f, "stat"), 2)) return f.dot;
	rt.setFv(f, "amount_grown", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "amount_grown", live(f.args[0])), live(damage)), rt.fv(f, "max_grown", live(f.args[0]))])));
	if (!truthy((affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(f.args[0]))]))))))) {
		affecting = (yield* g.srcCall(f, "get_bodypart", "chest"));
	}
	yield* g.srcCall(f, "apply_damage", live(damage), "brute", live(affecting));
	yield* g.srcCall(f, "damage_clothes", live(damage), "brute", "melee", rt.fv(f, "body_zone", live(affecting)));
	return f.dot;
}, true, { args: ["L"] });

// /mob/living/carbon/monkey/proc/attack_hand  (code/modules/mob/living/carbon/monkey/monkey_defense.dm:35)  may sleep
rt.def("/mob/living/carbon/monkey/proc/attack_hand", function* attack_hand(f: Frame) {
	let damage: Value = null, affecting: Value = null;
	let $0: any;
	f.vars = () => [damage, affecting, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = rt.fv(f, "a_intent", live(f.args[0]));
	if ($0 === "help") {
		yield* g.srcCall(f, "help_shake_act", live(f.args[0]));
	} else if ($0 === "grab") {
		yield* g.srcCall(f, "grabbedby", live(f.args[0]));
	} else if ($0 === "harm") {
		yield* g.callName(f, live(f.args[0]), "do_attack_animation", [live(f.src), "punch"]);
		if (truthy(rt.op(f, "Prob", [], [75]))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has punched ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), fmt("<span class='userdanger'>＀ has punched ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), null, 3);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "punch", 25, 1, -1]);
			damage = (yield* g.call(f, P("/proc/rand"), null, [5, 10]));
			if (truthy(rt.op(f, "Prob", [], [40]))) {
				damage = (yield* g.call(f, P("/proc/rand"), null, [10, 15]));
				if ((rt.lt((yield* g.srcCall(f, "AmountUnconscious")), 100) && rt.gt(rt.sv(f, "health"), 0))) {
					yield* g.srcCall(f, "Unconscious", (yield* g.call(f, P("/proc/rand"), null, [200, 300])));
					yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has knocked out ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), fmt("<span class='userdanger'>＀ has knocked out ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), null, 5);
				}
			}
			if (!truthy((affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(f.args[0]))]))))))) {
				affecting = (yield* g.srcCall(f, "get_bodypart", "chest"));
			}
			yield* g.srcCall(f, "apply_damage", live(damage), "brute", live(affecting));
			yield* g.srcCall(f, "damage_clothes", live(damage), "brute", "melee", rt.fv(f, "body_zone", live(affecting)));
			yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "attacked"]);
		} else {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has attempted to punch ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), fmt("<span class='userdanger'>＀ has attempted to punch ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), null, 3);
		}
	} else if ($0 === "disarm") {
		if (truthy((yield* g.srcCall(f, "IsUnconscious")))) return f.dot;
		yield* g.callName(f, live(f.args[0]), "do_attack_animation", [live(f.src), "disarm"]);
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			yield* g.srcCall(f, "Knockdown", 40);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
			yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "pushed"]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has pushed down ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has pushed down ＀!</span>", [live(f.args[0]), live(f.src)]), null, 3);
		} else {
			if (!truthy((yield* g.srcCall(f, "drop_item")))) return f.dot;
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has disarmed ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has disarmed ＀!</span>", [live(f.args[0]), live(f.src)]), null, 3);
		}
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/monkey/proc/attack_alien  (code/modules/mob/living/carbon/monkey/monkey_defense.dm:84)  may sleep
rt.def("/mob/living/carbon/monkey/proc/attack_alien", function* attack_alien(f: Frame) {
	let damage: Value = null, affecting: Value = null, I: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [damage, affecting, I, $0, $1, $2, $3];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (isEqual(rt.fv(f, "a_intent", live(f.args[0])), "harm")) {
		if ((truthy(rt.op(f, "Prob", [], [95])) && rt.gt(rt.sv(f, "health"), 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/slice.ogg"), 25, 1, -1]);
			if (rt.ge((damage = (yield* g.call(f, P("/proc/rand"), null, [15, 30]))), 25)) {
				damage = (yield* g.call(f, P("/proc/rand"), null, [20, 40]));
				if (rt.lt((yield* g.srcCall(f, "AmountUnconscious")), 300)) {
					yield* g.srcCall(f, "Unconscious", (yield* g.call(f, P("/proc/rand"), null, [200, 300])));
				}
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has wounded ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), fmt("<span class='userdanger'>＀ has wounded ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), null, 3);
			} else {
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has slashed ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), fmt("<span class='userdanger'>＀ has slashed ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), null, 3);
			}
			affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(f.args[0]))]))));
			yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "attacked"]);
			if (!truthy(live(affecting))) {
				affecting = (yield* g.srcCall(f, "get_bodypart", "chest"));
			}
			if (!truthy((yield* g.srcCall(f, "dismembering_strike", live(f.args[0]), rt.fv(f, "body_zone", live(affecting)))))) {
				return 1;
			}
			yield* g.srcCall(f, "apply_damage", live(damage), "brute", live(affecting));
			yield* g.srcCall(f, "damage_clothes", live(damage), "brute", "melee", rt.fv(f, "body_zone", live(affecting)));
		} else {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/slashmiss.ogg"), 25, 1, -1]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has attempted to lunge at ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), fmt("<span class='userdanger'>＀ has attempted to lunge at ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), null, 3);
		}
	}
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[0])), "disarm")) return f.dot;
	I = null;
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/pierce.ogg"), 25, 1, -1]);
	if (truthy(rt.op(f, "Prob", [], [95]))) {
		yield* g.srcCall(f, "Knockdown", 20);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has tackled down ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), fmt("<span class='userdanger'>＀ has tackled down ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), null, 3);
	} else {
		I = (yield* g.srcCall(f, "get_active_held_item"));
		if (truthy((yield* g.srcCall(f, "drop_item")))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has disarmed ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), fmt("<span class='userdanger'>＀ has disarmed ＀!</span>", [live(f.args[0]), rt.sv(f, "name")]), null, 3);
		} else {
			I = null;
		}
	}
	$0 = live(f.args[0]);
	$1 = live(f.src);
	$2 = "disarmed";
	if (truthy(live(I))) {
		$3 = fmt(" removing ％！", [live(I)]);
	} else {
		$3 = "";
	}
	yield* g.call(f, P("/proc/add_logs"), null, [$0, $1, $2, fmt("＀", [$3])]);
	yield* g.srcCall(f, "updatehealth");
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/monkey/proc/attack_animal  (code/modules/mob/living/carbon/monkey/monkey_defense.dm:133)  may sleep
rt.def("/mob/living/carbon/monkey/proc/attack_animal", function* attack_animal(f: Frame) {
	let damage: Value = null, dam_zone: Value = null, affecting: Value = null;
	f.vars = () => [damage, dam_zone, affecting];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	damage = (yield* g.call(f, P("/proc/rand"), null, [rt.fv(f, "melee_damage_lower", live(f.args[0])), rt.fv(f, "melee_damage_upper", live(f.args[0]))]));
	if (!truthy((dam_zone = (yield* g.srcCall(f, "dismembering_strike", live(f.args[0]), rt.op(f, "PickUnweighted", [5], ["chest", "l_hand", "r_hand", "l_leg", "r_leg"])))))) {
		return 1;
	}
	if (!truthy((affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [live(dam_zone)]))))))) {
		affecting = (yield* g.srcCall(f, "get_bodypart", "chest"));
	}
	yield* g.srcCall(f, "apply_damage", live(damage), rt.fv(f, "melee_damage_type", live(f.args[0])), live(affecting));
	yield* g.srcCall(f, "damage_clothes", live(damage), rt.fv(f, "melee_damage_type", live(f.args[0])), "melee", rt.fv(f, "body_zone", live(affecting)));
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/monkey/proc/attack_slime  (code/modules/mob/living/carbon/monkey/monkey_defense.dm:148)  may sleep
rt.def("/mob/living/carbon/monkey/proc/attack_slime", function* attack_slime(f: Frame) {
	let damage: Value = null, dam_zone: Value = null, affecting: Value = null;
	f.vars = () => [damage, dam_zone, affecting];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	damage = (yield* g.call(f, P("/proc/rand"), null, [5, 35]));
	if (truthy(rt.fv(f, "is_adult", live(f.args[0])))) {
		damage = (yield* g.call(f, P("/proc/rand"), null, [20, 40]));
	}
	if (!truthy((dam_zone = (yield* g.srcCall(f, "dismembering_strike", live(f.args[0]), rt.op(f, "PickUnweighted", [6], ["head", "chest", "l_arm", "r_arm", "l_leg", "r_leg"])))))) {
		return 1;
	}
	if (!truthy((affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [live(dam_zone)]))))))) {
		affecting = (yield* g.srcCall(f, "get_bodypart", "chest"));
	}
	yield* g.srcCall(f, "apply_damage", live(damage), "brute", live(affecting));
	yield* g.srcCall(f, "damage_clothes", live(damage), "brute", "melee", rt.fv(f, "body_zone", live(affecting)));
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/monkey/proc/acid_act  (code/modules/mob/living/carbon/monkey/monkey_defense.dm:164)  may sleep
rt.def("/mob/living/carbon/monkey/proc/acid_act", function* acid_act(f: Frame, acidpwr: Value, acid_volume: Value, bodyzone_hit: Value) {
	f.vars = () => [acidpwr, acid_volume, bodyzone_hit];
	f.dot = 1;
	if ((!truthy(live(bodyzone_hit)) || isEqual(live(bodyzone_hit), "head"))) {
		if (truthy(rt.sv(f, "wear_mask"))) {
			if (!truthy(rt.bitAnd(rt.fv(f, "resistance_flags", rt.sv(f, "wear_mask")), 16))) {
				yield* g.callName(f, rt.sv(f, "wear_mask"), "acid_act", [live(acidpwr)]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your mask protects you from the acid.</span>"]);
			}
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "head"))) {
			if (!truthy(rt.bitAnd(rt.fv(f, "resistance_flags", rt.sv(f, "head")), 16))) {
				yield* g.callName(f, rt.sv(f, "head"), "acid_act", [live(acidpwr)]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your hat protects you from the acid.</span>"]);
			}
			return live(f.dot);
		}
	}
	yield* g.srcCall(f, "take_bodypart_damage", multiply(live(acidpwr), (yield* g.call(f, P("/proc/min"), null, [0.6000000238418579, multiply(live(acid_volume), 0.10000000149011612)]))));
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/ex_act  (code/modules/mob/living/carbon/monkey/monkey_defense.dm:181)  may sleep
rt.def("/mob/living/carbon/monkey/proc/ex_act", function* ex_act(f: Frame) {
	let max_limb_loss: Value = null, X: Value = null, BP: Value = null;
	let $0: any, $e: any;
	f.vars = () => [max_limb_loss, X, BP, $0, $e];
	if (((truthy(live(f.args[2])) && truthy((rt.istype(live(f.args[2]), T("/datum/spacevine_mutation")) ? 1 : 0))) && truthy((yield* g.call(f, P("/proc/isvineimmune"), null, [live(f.src)]))))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if ($0 === 1) {
		yield* g.srcCall(f, "gib");
		return live(f.dot);
	} else if ($0 === 2) {
		yield* g.srcCall(f, "take_overall_damage", 60, 60);
		yield* g.srcCall(f, "damage_clothes", 200, "brute", "bomb");
		yield* g.srcCall(f, "adjustEarDamage", 30, 120);
		if (truthy(rt.op(f, "Prob", [], [70]))) {
			yield* g.srcCall(f, "Unconscious", 200);
		}
	} else if ($0 === 3) {
		yield* g.srcCall(f, "take_overall_damage", 30, 0);
		yield* g.srcCall(f, "damage_clothes", 50, "brute", "bomb");
		yield* g.srcCall(f, "adjustEarDamage", 15, 60);
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.srcCall(f, "Unconscious", 160);
		}
	}
	if (!rt.le(live(f.args[0]), 2)) return f.dot;
	max_limb_loss = (yield* g.call(f, P("/proc/round"), null, [divide(4, live(f.args[0]))]));
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		BP = live(X);
		if ((truthy(rt.op(f, "Prob", [], [divide(50, live(f.args[0]))])) && !isEqual(rt.fv(f, "body_zone", live(BP)), "chest"))) {
			rt.setFv(f, "brute_dam", live(BP), rt.fv(f, "max_damage", live(BP)));
			yield* g.callName(f, live(BP), "dismember", []);
			max_limb_loss = rt.inc(live(max_limb_loss), -1);
			if (!truthy(live(max_limb_loss))) {
				break;
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["severity", "target", "origin"], waitfor: false });
