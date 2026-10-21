// From code/modules/mob/living/carbon/human/human_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/getarmor  (code/modules/mob/living/carbon/human/human_defense.dm:6)
rt.def("/mob/living/carbon/human/proc/getarmor", function getarmor(f: Frame, def_zone: Value, type: Value) {
	let armorval: Value = null, organnum: Value = null, affecting: Value = null, X: Value = null, BP: Value = null;
	let $e: any;
	f.vars = () => [armorval, organnum, affecting, X, BP, $e];
	armorval = 0;
	organnum = 0;
	if (truthy(live(def_zone))) {
		if (truthy((rt.istype(live(def_zone), T("/obj/item/bodypart")) ? 1 : 0))) {
			return rt.callSrc(f, "checkarmor", [live(def_zone), live(type)]);
		}
		return rt.callSrc(f, "checkarmor", [(affecting = rt.callSrc(f, "get_bodypart", [rt.call(f, P("/proc/ran_zone"), null, [live(def_zone)])])), live(type)]);
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		armorval = rt.modify(live(armorval), rt.callSrc(f, "checkarmor", [(BP = live(X)), live(type)]), add);
		organnum = rt.inc(live(organnum), 1);
	}
	rt.endFor(f, 0);
	return divide(live(armorval), rt.call(f, P("/proc/max"), null, [live(organnum), 1]));
});

// /mob/living/carbon/human/proc/checkarmor  (code/modules/mob/living/carbon/human/human_defense.dm:21)
rt.def("/mob/living/carbon/human/proc/checkarmor", function checkarmor(f: Frame, def_zone: Value, d_type: Value) {
	let protection: Value = null, body_parts: Value = null, bp: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [protection, body_parts, bp, C, $e];
	if (!truthy(live(d_type))) {
		return 0;
	}
	protection = 0;
	body_parts = rt.list(rt.sv(f, "head"), rt.sv(f, "wear_mask"), rt.sv(f, "wear_suit"), rt.sv(f, "w_uniform"), rt.sv(f, "back"), rt.sv(f, "gloves"), rt.sv(f, "shoes"), rt.sv(f, "belt"), rt.sv(f, "s_store"), rt.sv(f, "glasses"), rt.sv(f, "ears"), rt.sv(f, "wear_id"));
	bp = null;
	rt.forList(f, 0, live(body_parts));
	while (($e = rt.next(f, 0)) !== undefined) {
		bp = $e;
		if (!truthy(live(bp))) {
			continue;
		}
		if ((truthy(live(bp)) && truthy((rt.istype(live(bp), T("/obj/item/clothing")) ? 1 : 0)))) {
			if (truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", (C = live(bp))), rt.fv(f, "body_part", live(def_zone))))) {
				protection = rt.modify(live(protection), rt.index(rt.fv(f, "armor", live(C)), live(d_type)), add);
			}
		}
	}
	rt.endFor(f, 0);
	return live(protection);
});

// /mob/living/carbon/human/proc/on_hit  (code/modules/mob/living/carbon/human/human_defense.dm:35)  may sleep
rt.def("/mob/living/carbon/human/proc/on_hit", function* on_hit(f: Frame, _P: Value) {
	f.vars = () => [_P];
	yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "on_hit", [live(_P), live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/bullet_act  (code/modules/mob/living/carbon/human/human_defense.dm:39)  may sleep
rt.def("/mob/living/carbon/human/proc/bullet_act", function* bullet_act(f: Frame, _P: Value, def_zone: Value) {
	let spec_return: Value = null, new_x: Value = null, new_y: Value = null, curloc: Value = null;
	f.vars = () => [_P, def_zone, spec_return, new_x, new_y, curloc];
	if (truthy((spec_return = (yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "bullet_act", [live(_P), live(f.src)]))))) {
		return live(spec_return);
	}
	if (truthy(rt.sv(f, "mind"))) {
		if ((truthy(rt.fv(f, "martial_art", rt.sv(f, "mind"))) && truthy(rt.gv(f, "deflection_chance", rt.fv(f, "martial_art", rt.sv(f, "mind")))))) {
			if (truthy(rt.op(f, "Prob", [], [rt.gv(f, "deflection_chance", rt.fv(f, "martial_art", rt.sv(f, "mind")))]))) {
				if (((!truthy(rt.sv(f, "lying")) && truthy(rt.sv(f, "dna"))) && !truthy((yield* g.callName(f, rt.sv(f, "dna"), "check_mutation", ["Hulk"]))))) {
					yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ deflects the projectile; ＀ can't be hit with ranged weapons!</span>", [live(f.src), (yield* g.srcCall(f, "p_they"))]), "<span class='userdanger'>You deflect the projectile!</span>");
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/weapons/bulletflyby.ogg"), rt.rsc("sound/weapons/bulletflyby2.ogg"), rt.rsc("sound/weapons/bulletflyby3.ogg")]), 75, 1]);
					return 0;
				}
			}
		}
	}
	if (!(isEqual(rt.fv(f, "original", live(_P)), live(f.src)) && isEqual(rt.fv(f, "firer", live(_P)), live(f.src)))) {
		if ((truthy((rt.istype(live(_P), T("/obj/item/projectile/energy")) ? 1 : 0)) || truthy((rt.istype(live(_P), T("/obj/item/projectile/beam")) ? 1 : 0)))) {
			if (truthy((yield* g.srcCall(f, "check_reflect", live(def_zone))))) {
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The ＀ gets reflected by ＀!</span>", [rt.fv(f, "name", live(_P)), live(f.src)]), fmt("<span class='userdanger'>The ＀ gets reflected by ＀!</span>", [rt.fv(f, "name", live(_P)), live(f.src)]));
				if (truthy(rt.fv(f, "starting", live(_P)))) {
					new_x = add(rt.gv(f, "x", rt.fv(f, "starting", live(_P))), rt.op(f, "PickUnweighted", [9], [0, 0, 0, 0, 0, -1, 1, -2, 2]));
					new_y = add(rt.gv(f, "y", rt.fv(f, "starting", live(_P))), rt.op(f, "PickUnweighted", [9], [0, 0, 0, 0, 0, -1, 1, -2, 2]));
					curloc = rt.getStep(f, live(f.src), 0);
					rt.setFv(f, "original", live(_P), rt.locate(live(new_x), live(new_y), rt.fv(f, "z", live(_P))));
					rt.setFv(f, "starting", live(_P), live(curloc));
					rt.setFv(f, "current", live(_P), live(curloc));
					rt.setFv(f, "firer", live(_P), live(f.src));
					rt.setFv(f, "yo", live(_P), subtract(live(new_y), rt.fv(f, "y", live(curloc))));
					rt.setFv(f, "xo", live(_P), subtract(live(new_x), rt.fv(f, "x", live(curloc))));
					rt.setFv(f, "Angle", live(_P), null);
				}
				return -1;
			}
		}
		if (truthy((yield* g.srcCall(f, "check_shields", live(_P), rt.fv(f, "damage", live(_P)), fmt("the ＀", [rt.fv(f, "name", live(_P))]), 3, rt.fv(f, "armour_penetration", live(_P)))))) {
			yield* g.callName(f, live(_P), "on_hit", [live(f.src), 100, live(def_zone)]);
			return 2;
		}
	}
	return (yield* g.callSuper(f, [live(_P), live(def_zone)]));
}, true);

// /mob/living/carbon/human/proc/check_reflect  (code/modules/mob/living/carbon/human/human_defense.dm:81)  may sleep
rt.def("/mob/living/carbon/human/proc/check_reflect", function* check_reflect(f: Frame, def_zone: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [def_zone, I, $e];
	if (truthy(rt.sv(f, "wear_suit"))) {
		if (isEqual((yield* g.callName(f, rt.sv(f, "wear_suit"), "IsReflect", [live(def_zone)])), 1)) {
			return 1;
		}
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual((yield* g.callName(f, live(I), "IsReflect", [live(def_zone)])), 1)) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
}, true);

// /mob/living/carbon/human/proc/check_shields  (code/modules/mob/living/carbon/human/human_defense.dm:89)  may sleep
rt.def("/mob/living/carbon/human/proc/check_shields", function* check_shields(f: Frame, AM: Value, damage: Value, attack_text: Value, attack_type: Value, armour_penetration: Value) {
	let block_chance_modifier: Value = null, I: Value = null, final_block_chance: Value = null, final_block_chance_1: Value = null;
	let $e: any;
	f.vars = () => [AM, damage, attack_text, attack_type, armour_penetration, block_chance_modifier, I, final_block_chance, final_block_chance_1, $e];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	if (live(armour_penetration) === null) {
		armour_penetration = 0;
	}
	block_chance_modifier = (yield* g.call(f, P("/proc/round"), null, [divide(live(damage), -3)]));
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy((rt.istype(live(I), T("/obj/item/clothing")) ? 1 : 0))) {
			final_block_chance = add(subtract(rt.fv(f, "block_chance", live(I)), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [divide(subtract(live(armour_penetration), rt.fv(f, "armour_penetration", live(I))), 2), 100]))]))), live(block_chance_modifier));
			if (truthy((yield* g.callName(f, live(I), "hit_reaction", [live(f.src), live(AM), live(attack_text), live(final_block_chance), live(damage), live(attack_type)])))) {
				return 1;
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "wear_suit"))) {
		final_block_chance_1 = add(subtract(rt.fv(f, "block_chance", rt.sv(f, "wear_suit")), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [divide(subtract(live(armour_penetration), rt.fv(f, "armour_penetration", rt.sv(f, "wear_suit"))), 2), 100]))]))), live(block_chance_modifier));
		if (truthy((yield* g.callName(f, rt.sv(f, "wear_suit"), "hit_reaction", [live(f.src), live(AM), live(attack_text), live(final_block_chance_1), live(damage), live(attack_type)])))) {
			return 1;
		}
	}
	if (truthy(rt.sv(f, "w_uniform"))) {
		final_block_chance_1 = add(subtract(rt.fv(f, "block_chance", rt.sv(f, "w_uniform")), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [divide(subtract(live(armour_penetration), rt.fv(f, "armour_penetration", rt.sv(f, "w_uniform"))), 2), 100]))]))), live(block_chance_modifier));
		if (truthy((yield* g.callName(f, rt.sv(f, "w_uniform"), "hit_reaction", [live(f.src), live(AM), live(attack_text), live(final_block_chance_1), live(damage), live(attack_type)])))) {
			return 1;
		}
	}
	return 0;
}, true);

// /mob/living/carbon/human/proc/check_block  (code/modules/mob/living/carbon/human/human_defense.dm:108)
rt.def("/mob/living/carbon/human/proc/check_block", function check_block(f: Frame) {
	if (truthy(rt.sv(f, "mind"))) {
		if ((((((truthy(rt.fv(f, "martial_art", rt.sv(f, "mind"))) && truthy(rt.op(f, "Prob", [], [rt.gv(f, "block_chance", rt.fv(f, "martial_art", rt.sv(f, "mind")))]))) && truthy(rt.sv(f, "in_throw_mode"))) && !truthy(rt.sv(f, "stat"))) && !truthy(rt.callSrc(f, "IsKnockdown", []))) && !truthy(rt.callSrc(f, "IsStun", [])))) {
			return 1;
		}
	}
	return 0;
});

// /mob/living/carbon/human/proc/hitby  (code/modules/mob/living/carbon/human/human_defense.dm:113)  may sleep
rt.def("/mob/living/carbon/human/proc/hitby", function* hitby(f: Frame) {
	let spec_return: Value = null, I: Value = null, throwpower: Value = null, L: Value = null;
	f.vars = () => [spec_return, I, throwpower, L];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (truthy((spec_return = (yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "spec_hitby", [live(f.args[0]), live(f.src)]))))) {
		return live(spec_return);
	}
	I = null;
	throwpower = 30;
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) {
		throwpower = rt.gv(f, "throwforce", (I = live(f.args[0])));
		if (isEqual(rt.fv(f, "thrownby", live(I)), live(f.src))) {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	if (truthy((yield* g.srcCall(f, "check_shields", live(f.args[0]), live(throwpower), fmt("％！", [rt.fv(f, "name", live(f.args[0]))]), 4)))) {
		f.args[2] = 0;
		f.args[1] = 1;
		f.args[3] = 1;
	} else {
		if (truthy(live(I))) {
			if (rt.ge(rt.fv(f, "throw_speed", live(I)), 4)) {
				if (truthy((yield* g.call(f, P("/proc/can_embed"), null, [live(I)])))) {
					if ((truthy(rt.op(f, "Prob", [], [rt.fv(f, "embed_chance", live(I))])) && !(truthy(rt.sv(f, "dna")) && truthy((rt.isIn(f, 15, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))))) {
						yield* g.srcCall(f, "throw_alert", "embeddedobject", T("/obj/screen/alert/embeddedobject"));
						(rt.modField(f, (L = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "bodyparts")])), "embedded_objects", live(I), rt.bitOr));
						yield* g.callName(f, live(I), "add_mob_blood", [live(f.src)]);
						rt.setFv(f, "loc", live(I), live(f.src));
						yield* g.callName(f, live(L), "receive_damage", [multiply(rt.fv(f, "w_class", live(I)), rt.fv(f, "embedded_impact_pain_multiplier", live(I)))]);
						yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ embeds itself in ＀'s ＀!</span>", [live(I), live(f.src), rt.fv(f, "name", live(L))]), fmt("<span class='userdanger'>＀ embeds itself in your ＀!</span>", [live(I), rt.fv(f, "name", live(L))]));
						f.args[2] = 0;
						f.args[1] = 1;
					}
				}
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["AM", "skipcatch", "hitpush", "blocked"] });

// /mob/living/carbon/human/proc/grabbedby  (code/modules/mob/living/carbon/human/human_defense.dm:144)  may sleep
rt.def("/mob/living/carbon/human/proc/grabbedby", function* grabbedby(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((((((isEqual(live(f.args[0]), live(f.src)) && truthy(rt.sv(f, "pulling"))) && !truthy(rt.fv(f, "anchored", rt.sv(f, "pulling")))) && rt.ge(rt.sv(f, "grab_state"), 1)) && truthy(rt.bitAnd(rt.sv(f, "disabilities"), 32))) && truthy((rt.istype(rt.sv(f, "pulling"), T("/mob/living/carbon/monkey")) ? 1 : 0)))) {
		yield* g.srcCall(f, "devour_mob", rt.sv(f, "pulling"));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user", "supress_message"] });

// /mob/living/carbon/human/proc/grippedby  (code/modules/mob/living/carbon/human/human_defense.dm:151)  may sleep
rt.def("/mob/living/carbon/human/proc/grippedby", function* grippedby(f: Frame) {
	if (truthy(rt.sv(f, "w_uniform"))) {
		yield* g.callName(f, rt.sv(f, "w_uniform"), "add_fingerprint", [live(f.args[0])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/carbon/human/proc/attacked_by  (code/modules/mob/living/carbon/human/human_defense.dm:156)  may sleep
rt.def("/mob/living/carbon/human/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	let affecting: Value = null, target_area: Value = null;
	f.vars = () => [I, user, affecting, target_area];
	if ((!truthy(live(I)) || !truthy(live(user)))) {
		return 0;
	}
	affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(user))]))));
	target_area = (yield* g.call(f, P("/proc/parse_zone"), null, [(yield* g.call(f, P("/proc/check_zone"), null, [rt.fv(f, "zone_selected", live(user))]))]));
	return (yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "spec_attacked_by", [live(I), live(user), live(affecting), rt.sv(f, "a_intent"), live(f.src)]));
}, true);

// /mob/living/carbon/human/proc/attack_hulk  (code/modules/mob/living/carbon/human/human_defense.dm:169)  may sleep
rt.def("/mob/living/carbon/human/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	let hulk_verb: Value = null, message: Value = null;
	f.vars = () => [user, does_attack_animation, hulk_verb, message];
	if (live(does_attack_animation) === null) {
		does_attack_animation = 0;
	}
	if (!isEqual(rt.fv(f, "a_intent", live(user)), "harm")) return f.dot;
	hulk_verb = rt.op(f, "PickUnweighted", [2], ["smash", "pummel"]);
	if (truthy((yield* g.srcCall(f, "check_shields", live(user), 15, fmt("the ＀ing", [live(hulk_verb)]))))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [live(user), 1]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.gv(f, "attack_sound", rt.gv(f, "species", rt.fv(f, "dna", live(user)))), 25, 1, -1]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀</span>", [(message = fmt("＀ has ＀ed ＀!", [live(user), live(hulk_verb), live(f.src)]))]), fmt("<span class='userdanger'>＀</span>", [live(message)]));
	yield* g.srcCall(f, "adjustBruteLoss", 15);
	yield* g.srcCall(f, "damage_clothes", 15, "brute", "melee");
	return 1;
}, true);

// /mob/living/carbon/human/proc/attack_hand  (code/modules/mob/living/carbon/human/human_defense.dm:183)  may sleep
rt.def("/mob/living/carbon/human/proc/attack_hand", function* attack_hand(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (isEqual(rt.gv(f, "a_intent", (H = live(f.args[0]))), "disarm")) {
		if (((truthy(rt.fv(f, "buckled_mobs", live(H))) && truthy((rt.isIn(f, live(f.src), rt.fv(f, "buckled_mobs", live(H))) ? 1 : 0))) && truthy(rt.fv(f, "riding_datum", live(H))))) {
			yield* g.callName(f, rt.fv(f, "riding_datum", live(H)), "force_dismount", [live(f.src)]);
		}
	}
	yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "spec_attack_hand", [live(H), live(f.src)]);
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/carbon/human/proc/attack_paw  (code/modules/mob/living/carbon/human/human_defense.dm:194)  may sleep
rt.def("/mob/living/carbon/human/proc/attack_paw", function* attack_paw(f: Frame) {
	let dam_zone: Value = null, affecting: Value = null, damage: Value = null;
	f.vars = () => [dam_zone, affecting, damage];
	dam_zone = rt.op(f, "PickUnweighted", [5], ["chest", "l_hand", "r_hand", "l_leg", "r_leg"]);
	if (!truthy((affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [live(dam_zone)]))))))) {
		affecting = (yield* g.srcCall(f, "get_bodypart", "chest"));
	}
	if (isEqual(rt.fv(f, "a_intent", live(f.args[0])), "help")) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return 0;
	}
	if (isEqual(rt.fv(f, "a_intent", live(f.args[0])), "disarm")) {
		if ((truthy((yield* g.srcCall(f, "get_active_held_item"))) && truthy((yield* g.srcCall(f, "drop_item"))))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/slash.ogg"), 25, 1, -1]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ disarmed ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ disarmed ＀!</span>", [live(f.args[0]), live(f.src)]));
		} else {
			if ((!truthy(rt.fv(f, "client", live(f.args[0]))) || truthy(rt.op(f, "Prob", [], [5])))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/pierce.ogg"), 25, 1, -1]);
				yield* g.srcCall(f, "Knockdown", 100);
				yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "tackled"]);
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has tackled down ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has tackled down ＀!</span>", [live(f.args[0]), live(f.src)]));
			}
		}
	}
	if (truthy(rt.fv(f, "limb_destroyer", live(f.args[0])))) {
		yield* g.srcCall(f, "dismembering_strike", live(f.args[0]), rt.fv(f, "body_zone", live(affecting)));
	}
	if (!truthy((yield* g.srcCall(f, "can_inject", live(f.args[0]), 1, live(affecting))))) return f.dot;
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		damage = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
		if (truthy((yield* g.srcCall(f, "check_shields", live(f.args[0]), live(damage), fmt("the ＀", [rt.fv(f, "name", live(f.args[0]))]))))) {
			return 0;
		}
		if (!isEqual(rt.sv(f, "stat"), 2)) {
			yield* g.srcCall(f, "apply_damage", live(damage), "brute", live(affecting), (yield* g.srcCall(f, "run_armor_check", live(affecting), "melee")));
			yield* g.srcCall(f, "damage_clothes", live(damage), "brute", "melee", rt.fv(f, "body_zone", live(affecting)));
		}
	}
	return 1;
}, true, { args: ["M"] });

// /mob/living/carbon/human/proc/attack_alien  (code/modules/mob/living/carbon/human/human_defense.dm:228)  may sleep
rt.def("/mob/living/carbon/human/proc/attack_alien", function* attack_alien(f: Frame) {
	let damage: Value = null, affecting: Value = null, armor_block: Value = null;
	let $0: any;
	f.vars = () => [damage, affecting, armor_block, $0];
	if (truthy((yield* g.srcCall(f, "check_shields", live(f.args[0]), 0, "the M.name")))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ attempted to touch ＀!</span>", [live(f.args[0]), live(f.src)]));
		return 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (isEqual(rt.fv(f, "a_intent", live(f.args[0])), "harm")) {
		if (truthy(rt.sv(f, "w_uniform"))) {
			yield* g.callName(f, rt.sv(f, "w_uniform"), "add_fingerprint", [live(f.args[0])]);
		}
		if (truthy(rt.op(f, "Prob", [], [90]))) {
			$0 = 20;
		} else {
			$0 = 0;
		}
		if (!truthy((damage = $0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/slashmiss.ogg"), 50, 1, -1]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has lunged at ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has lunged at ＀!</span>", [live(f.args[0]), live(f.src)]));
			return 0;
		}
		if (!truthy((affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(f.args[0]))]))))))) {
			affecting = (yield* g.srcCall(f, "get_bodypart", "chest"));
		}
		armor_block = (yield* g.srcCall(f, "run_armor_check", live(affecting), "melee", "", "", 10));
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/slice.ogg"), 25, 1, -1]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has slashed at ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has slashed at ＀!</span>", [live(f.args[0]), live(f.src)]));
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "attacked"]);
		if (!truthy((yield* g.srcCall(f, "dismembering_strike", live(f.args[0]), rt.fv(f, "zone_selected", live(f.args[0])))))) {
			return 1;
		}
		yield* g.srcCall(f, "apply_damage", live(damage), "brute", live(affecting), live(armor_block));
		yield* g.srcCall(f, "damage_clothes", live(damage), "brute", "melee", rt.fv(f, "body_zone", live(affecting)));
	}
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[0])), "disarm")) return f.dot;
	if ((truthy((yield* g.srcCall(f, "get_active_held_item"))) && truthy((yield* g.srcCall(f, "drop_item"))))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/slash.ogg"), 25, 1, -1]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ disarmed ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ disarmed ＀!</span>", [live(f.args[0]), live(f.src)]));
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/pierce.ogg"), 25, 1, -1]);
		yield* g.srcCall(f, "Knockdown", 100);
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "tackled"]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has tackled down ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has tackled down ＀!</span>", [live(f.args[0]), live(f.src)]));
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/human/proc/attack_larva  (code/modules/mob/living/carbon/human/human_defense.dm:271)  may sleep
rt.def("/mob/living/carbon/human/proc/attack_larva", function* attack_larva(f: Frame) {
	let damage: Value = null, affecting: Value = null, armor_block: Value = null;
	f.vars = () => [damage, affecting, armor_block];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	damage = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
	if (truthy((yield* g.srcCall(f, "check_shields", live(f.args[0]), live(damage), fmt("the ＀", [rt.fv(f, "name", live(f.args[0]))]))))) {
		return 0;
	}
	if (isEqual(rt.sv(f, "stat"), 2)) return f.dot;
	rt.setFv(f, "amount_grown", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "amount_grown", live(f.args[0])), live(damage)), rt.fv(f, "max_grown", live(f.args[0]))])));
	if (!truthy((affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(f.args[0]))]))))))) {
		affecting = (yield* g.srcCall(f, "get_bodypart", "chest"));
	}
	armor_block = (yield* g.srcCall(f, "run_armor_check", live(affecting), "melee"));
	yield* g.srcCall(f, "apply_damage", live(damage), "brute", live(affecting), live(armor_block));
	yield* g.srcCall(f, "damage_clothes", live(damage), "brute", "melee", rt.fv(f, "body_zone", live(affecting)));
	return f.dot;
}, true, { args: ["L"] });

// /mob/living/carbon/human/proc/attack_animal  (code/modules/mob/living/carbon/human/human_defense.dm:286)  may sleep
rt.def("/mob/living/carbon/human/proc/attack_animal", function* attack_animal(f: Frame) {
	let damage: Value = null, dam_zone: Value = null, affecting: Value = null, armor: Value = null;
	f.vars = () => [damage, dam_zone, affecting, armor];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	damage = (yield* g.call(f, P("/proc/rand"), null, [rt.fv(f, "melee_damage_lower", live(f.args[0])), rt.fv(f, "melee_damage_upper", live(f.args[0]))]));
	if (truthy((yield* g.srcCall(f, "check_shields", live(f.args[0]), live(damage), fmt("the ＀", [rt.fv(f, "name", live(f.args[0]))]), 1, rt.fv(f, "armour_penetration", live(f.args[0])))))) {
		return 0;
	}
	if (!truthy((dam_zone = (yield* g.srcCall(f, "dismembering_strike", live(f.args[0]), rt.op(f, "PickUnweighted", [5], ["chest", "l_hand", "r_hand", "l_leg", "r_leg"])))))) {
		return 1;
	}
	if (!truthy((affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [live(dam_zone)]))))))) {
		affecting = (yield* g.srcCall(f, "get_bodypart", "chest"));
	}
	armor = (yield* g.callSrc(f, "run_armor_check", [null, live(affecting), null, "melee", "armour_penetration", rt.fv(f, "armour_penetration", live(f.args[0]))], rt.Args.Named));
	yield* g.srcCall(f, "apply_damage", live(damage), rt.fv(f, "melee_damage_type", live(f.args[0])), live(affecting), live(armor));
	yield* g.srcCall(f, "damage_clothes", live(damage), rt.fv(f, "melee_damage_type", live(f.args[0])), "melee", rt.fv(f, "body_zone", live(affecting)));
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/human/proc/attack_slime  (code/modules/mob/living/carbon/human/human_defense.dm:303)  may sleep
rt.def("/mob/living/carbon/human/proc/attack_slime", function* attack_slime(f: Frame) {
	let damage: Value = null, dam_zone: Value = null, affecting: Value = null, armor_block: Value = null;
	f.vars = () => [damage, dam_zone, affecting, armor_block];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	damage = (yield* g.call(f, P("/proc/rand"), null, [5, 25]));
	if (truthy(rt.fv(f, "is_adult", live(f.args[0])))) {
		damage = (yield* g.call(f, P("/proc/rand"), null, [10, 35]));
	}
	if (truthy((yield* g.srcCall(f, "check_shields", live(f.args[0]), live(damage), fmt("the ＀", [rt.fv(f, "name", live(f.args[0]))]))))) {
		return 0;
	}
	if (!truthy((dam_zone = (yield* g.srcCall(f, "dismembering_strike", live(f.args[0]), rt.op(f, "PickUnweighted", [6], ["head", "chest", "l_arm", "r_arm", "l_leg", "r_leg"])))))) {
		return 1;
	}
	if (!truthy((affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [live(dam_zone)]))))))) {
		affecting = (yield* g.srcCall(f, "get_bodypart", "chest"));
	}
	armor_block = (yield* g.srcCall(f, "run_armor_check", live(affecting), "melee"));
	yield* g.srcCall(f, "apply_damage", live(damage), "brute", live(affecting), live(armor_block));
	yield* g.srcCall(f, "damage_clothes", live(damage), "brute", "melee", rt.fv(f, "body_zone", live(affecting)));
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/human/proc/mech_melee_attack  (code/modules/mob/living/carbon/human/human_defense.dm:324)  may sleep
rt.def("/mob/living/carbon/human/proc/mech_melee_attack", function* mech_melee_attack(f: Frame) {
	let temp: Value = null, update: Value = null, dmg: Value = null;
	let $0: any;
	f.vars = () => [temp, update, dmg, $0];
	if (isEqual(rt.gv(f, "a_intent", rt.fv(f, "occupant", live(f.args[0]))), "harm")) {
		yield* g.callName(f, live(f.args[0]), "do_attack_animation", [live(f.src)]);
		if (isEqual(rt.fv(f, "damtype", live(f.args[0])), "brute")) {
			yield* g.call(f, P("/proc/step_away"), null, [live(f.src), live(f.args[0]), 15]);
		}
		if (truthy((temp = (yield* g.srcCall(f, "get_bodypart", rt.op(f, "PickUnweighted", [4], ["chest", "chest", "chest", "head"])))))) {
			update = 0;
			dmg = (yield* g.call(f, P("/proc/rand"), null, [divide(rt.fv(f, "force", live(f.args[0])), 2), rt.fv(f, "force", live(f.args[0]))]));
			$0 = rt.fv(f, "damtype", live(f.args[0]));
			if ($0 === "brute") {
				if (rt.gt(rt.fv(f, "force", live(f.args[0])), 20)) {
					yield* g.srcCall(f, "Unconscious", 20);
				}
				(update = rt.modify(live(update), (yield* g.callName(f, live(temp), "receive_damage", [live(dmg), 0])), rt.bitOr));
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/punch4.ogg"), 50, 1]);
				yield* g.srcCall(f, "damage_clothes", live(dmg), "brute", "melee", rt.fv(f, "body_zone", live(temp)));
			} else if ($0 === "fire") {
				(update = rt.modify(live(update), (yield* g.callName(f, live(temp), "receive_damage", [0, live(dmg)])), rt.bitOr));
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 50, 1]);
				yield* g.srcCall(f, "damage_clothes", live(dmg), "fire", "melee", rt.fv(f, "body_zone", live(temp)));
			} else if ($0 === "tox") {
				yield* g.callName(f, live(f.args[0]), "mech_toxin_damage", [live(f.src)]);
			} else {
				return live(f.dot);
			}
			if (truthy(live(update))) {
				yield* g.srcCall(f, "update_damage_overlays");
			}
			yield* g.srcCall(f, "updatehealth");
		}
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has hit ＀!</span>", [rt.fv(f, "name", live(f.args[0])), live(f.src)]), fmt("<span class='userdanger'>＀ has hit ＀!</span>", [rt.fv(f, "name", live(f.args[0])), live(f.src)]), null, 3);
		yield* g.call(f, P("/proc/add_logs"), null, [rt.fv(f, "occupant", live(f.args[0])), live(f.src), "attacked", live(f.args[0]), fmt("(INTENT: ＀) (DAMTYPE: ＀)", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.gv(f, "a_intent", rt.fv(f, "occupant", live(f.args[0])))])), (yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "damtype", live(f.args[0]))]))])]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/human/proc/ex_act  (code/modules/mob/living/carbon/human/human_defense.dm:361)  may sleep
rt.def("/mob/living/carbon/human/proc/ex_act", function* ex_act(f: Frame) {
	let b_loss: Value = null, f_loss: Value = null, bomb_armor: Value = null, throw_target: Value = null, max_limb_loss: Value = null, X: Value = null, BP: Value = null;
	let $0: any, $e: any;
	f.vars = () => [b_loss, f_loss, bomb_armor, throw_target, max_limb_loss, X, BP, $0, $e];
	if (((truthy(live(f.args[2])) && truthy((rt.istype(live(f.args[2]), T("/datum/spacevine_mutation")) ? 1 : 0))) && truthy((yield* g.call(f, P("/proc/isvineimmune"), null, [live(f.src)]))))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	b_loss = 0;
	f_loss = 0;
	bomb_armor = (yield* g.srcCall(f, "getarmor", null, "bomb"));
	$0 = live(f.args[0]);
	if ($0 === 1) {
		if (truthy(rt.op(f, "Prob", [], [live(bomb_armor)]))) {
			b_loss = 500;
			yield* g.srcCall(f, "throw_at", (throw_target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.src), rt.getDir(f, live(f.src), (yield* g.call(f, P("/proc/get_step_away"), null, [live(f.src), live(f.src)])))]))), 200, 4);
			yield* g.srcCall(f, "damage_clothes", subtract(400, live(bomb_armor)), "brute", "bomb");
		} else {
			yield* g.srcCall(f, "gib");
			return live(f.dot);
		}
	} else if ($0 === 2) {
		b_loss = 60;
		f_loss = 60;
		if (truthy(live(bomb_armor))) {
			f_loss = (b_loss = multiply(30, subtract(2, (yield* g.call(f, P("/proc/round"), null, [multiply(live(bomb_armor), 0.009999999776482582), 0.05000000074505806])))));
		}
		yield* g.srcCall(f, "damage_clothes", subtract(200, live(bomb_armor)), "brute", "bomb");
		if (!truthy((rt.istype(rt.sv(f, "ears"), T("/obj/item/clothing/ears/earmuffs")) ? 1 : 0))) {
			yield* g.srcCall(f, "adjustEarDamage", 30, 120);
		}
		if (truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/max"), null, [subtract(70, multiply(live(bomb_armor), 0.5)), 0]))]))) {
			yield* g.srcCall(f, "Unconscious", 200);
		}
	} else if ($0 === 3) {
		b_loss = 30;
		if (truthy(live(bomb_armor))) {
			b_loss = multiply(15, subtract(2, (yield* g.call(f, P("/proc/round"), null, [multiply(live(bomb_armor), 0.009999999776482582), 0.05000000074505806]))));
		}
		yield* g.srcCall(f, "damage_clothes", (yield* g.call(f, P("/proc/max"), null, [subtract(50, live(bomb_armor)), 0])), "brute", "bomb");
		if (!truthy((rt.istype(rt.sv(f, "ears"), T("/obj/item/clothing/ears/earmuffs")) ? 1 : 0))) {
			yield* g.srcCall(f, "adjustEarDamage", 15, 60);
		}
		if (truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/max"), null, [subtract(50, multiply(live(bomb_armor), 0.5)), 0]))]))) {
			yield* g.srcCall(f, "Unconscious", 160);
		}
	}
	yield* g.srcCall(f, "take_overall_damage", live(b_loss), live(f_loss));
	if (!(rt.le(live(f.args[0]), 2) || !truthy(live(bomb_armor)))) return f.dot;
	max_limb_loss = (yield* g.call(f, P("/proc/round"), null, [divide(4, live(f.args[0]))]));
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		BP = live(X);
		if ((((truthy(rt.op(f, "Prob", [], [divide(50, live(f.args[0]))])) && !truthy(rt.op(f, "Prob", [], [(yield* g.srcCall(f, "getarmor", live(BP), "bomb"))]))) && !isEqual(rt.fv(f, "body_zone", live(BP)), "head")) && !isEqual(rt.fv(f, "body_zone", live(BP)), "chest"))) {
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

// /mob/living/carbon/human/proc/blob_act  (code/modules/mob/living/carbon/human/human_defense.dm:417)  may sleep
rt.def("/mob/living/carbon/human/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	let dam_zone: Value = null, affecting: Value = null;
	f.vars = () => [B, dam_zone, affecting];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "show_message", "<span class='userdanger'>The blob attacks you!</span>");
	dam_zone = rt.op(f, "PickUnweighted", [5], ["chest", "l_hand", "r_hand", "l_leg", "r_leg"]);
	affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [live(dam_zone)]))));
	yield* g.srcCall(f, "apply_damage", 5, "brute", live(affecting), (yield* g.srcCall(f, "run_armor_check", live(affecting), "melee")));
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/electrocute_act  (code/modules/mob/living/carbon/human/human_defense.dm:430)  may sleep
rt.def("/mob/living/carbon/human/proc/electrocute_act", function* electrocute_act(f: Frame, shock_damage: Value, source: Value, siemens_coeff: Value, safety: Value, override: Value, tesla_shock: Value, illusion: Value, stun: Value) {
	let total_coeff: Value = null, G: Value = null, S: Value = null, gloves_siemens_coeff: Value = null, heart: Value = null;
	let $0: any;
	f.vars = () => [shock_damage, source, siemens_coeff, safety, override, tesla_shock, illusion, stun, total_coeff, G, S, gloves_siemens_coeff, heart, $0];
	if (live(siemens_coeff) === null) {
		siemens_coeff = 1;
	}
	if (live(safety) === null) {
		safety = 0;
	}
	if (live(override) === null) {
		override = 0;
	}
	if (live(tesla_shock) === null) {
		tesla_shock = 0;
	}
	if (live(illusion) === null) {
		illusion = 0;
	}
	if (live(stun) === null) {
		stun = 1;
	}
	if (truthy(live(tesla_shock))) {
		total_coeff = 1;
		if (truthy(rt.sv(f, "gloves"))) {
			if (rt.le(rt.gv(f, "siemens_coefficient", (G = rt.sv(f, "gloves"))), 0)) {
				(total_coeff = rt.modify(live(total_coeff), 0.5, subtract));
			}
		}
		if (truthy(rt.sv(f, "wear_suit"))) {
			if (rt.le(rt.gv(f, "siemens_coefficient", (S = rt.sv(f, "wear_suit"))), 0)) {
				(total_coeff = rt.modify(live(total_coeff), 0.949999988079071, subtract));
			} else {
				if (isEqual(rt.fv(f, "siemens_coefficient", live(S)), -1)) {
					(total_coeff = rt.modify(live(total_coeff), 1, subtract));
				}
			}
		}
		siemens_coeff = live(total_coeff);
		if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
			$0 = rt.index(rt.fv(f, "secondary_flags", live(f.src)), "tesla_ignore");
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			siemens_coeff = 0;
		}
	} else {
		if (!truthy(live(safety))) {
			gloves_siemens_coeff = 1;
			if (truthy(rt.sv(f, "gloves"))) {
				gloves_siemens_coeff = rt.gv(f, "siemens_coefficient", (G = rt.sv(f, "gloves")));
			}
			siemens_coeff = live(gloves_siemens_coeff);
		}
	}
	if ((truthy((yield* g.srcCall(f, "undergoing_cardiac_arrest"))) && !truthy(live(illusion)))) {
		if ((rt.ge(multiply(live(shock_damage), live(siemens_coeff)), 1) && truthy(rt.op(f, "Prob", [], [25])))) {
			rt.setFv(f, "beating", (heart = (yield* g.srcCall(f, "getorganslot", "heart"))), 1);
			if (isEqual(rt.sv(f, "stat"), 0)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You feel your heart beating again!</span>"]);
			}
		}
	}
	f.dot = (yield* g.callSuper(f, [live(shock_damage), live(source), live(siemens_coeff), live(safety), live(override), live(tesla_shock), live(illusion), live(stun)]));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "electrocution_animation", 40);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/emp_act  (code/modules/mob/living/carbon/human/human_defense.dm:461)  may sleep
rt.def("/mob/living/carbon/human/proc/emp_act", function* emp_act(f: Frame) {
	let informed: Value = null, L: Value = null;
	let $0: any, $e: any;
	f.vars = () => [informed, L, $0, $e];
	informed = 0;
	L = null;
	rt.forList(f, 0, rt.fv(f, "bodyparts", live(f.src)), T("/obj/item/bodypart"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (isEqual(rt.fv(f, "status", live(L)), 2)) {
			if (!truthy(live(informed))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>You feel a sharp pain as your robotic limbs overload.</span>"]);
				informed = 1;
			}
			$0 = live(f.args[0]);
			if ($0 === 1) {
				yield* g.callName(f, live(L), "receive_damage", [0, 10]);
				yield* g.srcCall(f, "Stun", 200);
			} else if ($0 === 2) {
				yield* g.callName(f, live(L), "receive_damage", [0, 5]);
				yield* g.srcCall(f, "Stun", 100);
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /mob/living/carbon/human/proc/acid_act  (code/modules/mob/living/carbon/human/human_defense.dm:476)  may sleep
rt.def("/mob/living/carbon/human/proc/acid_act", function* acid_act(f: Frame, acidpwr: Value, acid_volume: Value, bodyzone_hit: Value) {
	let damaged: Value = null, inventory_items_to_kill: Value = null, acidity: Value = null, head_clothes: Value = null, chest_clothes: Value = null, arm_clothes: Value = null, leg_clothes: Value = null, affecting: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [acidpwr, acid_volume, bodyzone_hit, damaged, inventory_items_to_kill, acidity, head_clothes, chest_clothes, arm_clothes, leg_clothes, affecting, I, $e];
	damaged = rt.list();
	inventory_items_to_kill = rt.list();
	acidity = multiply(live(acidpwr), (yield* g.call(f, P("/proc/min"), null, [multiply(live(acid_volume), 0.004999999888241291), 0.10000000149011612])));
	if ((!truthy(live(bodyzone_hit)) || isEqual(live(bodyzone_hit), "head"))) {
		head_clothes = null;
		if (truthy(rt.sv(f, "glasses"))) {
			head_clothes = rt.sv(f, "glasses");
		}
		if (truthy(rt.sv(f, "wear_mask"))) {
			head_clothes = rt.sv(f, "wear_mask");
		}
		if (truthy(rt.sv(f, "wear_neck"))) {
			head_clothes = rt.sv(f, "wear_neck");
		}
		if (truthy(rt.sv(f, "head"))) {
			head_clothes = rt.sv(f, "head");
		}
		if (truthy(live(head_clothes))) {
			if (!truthy(rt.bitAnd(rt.fv(f, "resistance_flags", live(head_clothes)), 16))) {
				yield* g.callName(f, live(head_clothes), "acid_act", [live(acidpwr), live(acid_volume)]);
				yield* g.srcCall(f, "update_inv_glasses");
				yield* g.srcCall(f, "update_inv_wear_mask");
				yield* g.srcCall(f, "update_inv_neck");
				yield* g.srcCall(f, "update_inv_head");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>Your ＀ protects your head and face from the acid!</span>", [rt.fv(f, "name", live(head_clothes))])]);
			}
		} else {
			f.dot = (yield* g.srcCall(f, "get_bodypart", "head"));
			if (truthy(live(f.dot))) {
				damaged = rt.modify(live(damaged), live(f.dot), add);
			}
			if (truthy(rt.sv(f, "ears"))) {
				inventory_items_to_kill = rt.modify(live(inventory_items_to_kill), rt.sv(f, "ears"), add);
			}
		}
	}
	if ((!truthy(live(bodyzone_hit)) || isEqual(live(bodyzone_hit), "chest"))) {
		chest_clothes = null;
		if (truthy(rt.sv(f, "w_uniform"))) {
			chest_clothes = rt.sv(f, "w_uniform");
		}
		if (truthy(rt.sv(f, "wear_suit"))) {
			chest_clothes = rt.sv(f, "wear_suit");
		}
		if (truthy(live(chest_clothes))) {
			if (!truthy(rt.bitAnd(rt.fv(f, "resistance_flags", live(chest_clothes)), 16))) {
				yield* g.callName(f, live(chest_clothes), "acid_act", [live(acidpwr), live(acid_volume)]);
				yield* g.srcCall(f, "update_inv_w_uniform");
				yield* g.srcCall(f, "update_inv_wear_suit");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>Your ＀ protects your body from the acid!</span>", [rt.fv(f, "name", live(chest_clothes))])]);
			}
		} else {
			f.dot = (yield* g.srcCall(f, "get_bodypart", "chest"));
			if (truthy(live(f.dot))) {
				damaged = rt.modify(live(damaged), live(f.dot), add);
			}
			if (truthy(rt.sv(f, "wear_id"))) {
				inventory_items_to_kill = rt.modify(live(inventory_items_to_kill), rt.sv(f, "wear_id"), add);
			}
			if (truthy(rt.sv(f, "r_store"))) {
				inventory_items_to_kill = rt.modify(live(inventory_items_to_kill), rt.sv(f, "r_store"), add);
			}
			if (truthy(rt.sv(f, "l_store"))) {
				inventory_items_to_kill = rt.modify(live(inventory_items_to_kill), rt.sv(f, "l_store"), add);
			}
			if (truthy(rt.sv(f, "s_store"))) {
				inventory_items_to_kill = rt.modify(live(inventory_items_to_kill), rt.sv(f, "s_store"), add);
			}
		}
	}
	if (((!truthy(live(bodyzone_hit)) || isEqual(live(bodyzone_hit), "l_arm")) || isEqual(live(bodyzone_hit), "r_arm"))) {
		arm_clothes = null;
		if (truthy(rt.sv(f, "gloves"))) {
			arm_clothes = rt.sv(f, "gloves");
		}
		if ((truthy(rt.sv(f, "w_uniform")) && (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "w_uniform")), 1536)) || truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "w_uniform")), 384))))) {
			arm_clothes = rt.sv(f, "w_uniform");
		}
		if ((truthy(rt.sv(f, "wear_suit")) && (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "wear_suit")), 1536)) || truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "wear_suit")), 384))))) {
			arm_clothes = rt.sv(f, "wear_suit");
		}
		if (truthy(live(arm_clothes))) {
			if (!truthy(rt.bitAnd(rt.fv(f, "resistance_flags", live(arm_clothes)), 16))) {
				yield* g.callName(f, live(arm_clothes), "acid_act", [live(acidpwr), live(acid_volume)]);
				yield* g.srcCall(f, "update_inv_gloves");
				yield* g.srcCall(f, "update_inv_w_uniform");
				yield* g.srcCall(f, "update_inv_wear_suit");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>Your ＀ protects your arms and hands from the acid!</span>", [rt.fv(f, "name", live(arm_clothes))])]);
			}
		} else {
			f.dot = (yield* g.srcCall(f, "get_bodypart", "r_arm"));
			if (truthy(live(f.dot))) {
				damaged = rt.modify(live(damaged), live(f.dot), add);
			}
			f.dot = (yield* g.srcCall(f, "get_bodypart", "l_arm"));
			if (truthy(live(f.dot))) {
				damaged = rt.modify(live(damaged), live(f.dot), add);
			}
		}
	}
	if ((((!truthy(live(bodyzone_hit)) || isEqual(live(bodyzone_hit), "l_leg")) || isEqual(live(bodyzone_hit), "r_leg")) || isEqual(live(bodyzone_hit), "feet"))) {
		leg_clothes = null;
		if (truthy(rt.sv(f, "shoes"))) {
			leg_clothes = rt.sv(f, "shoes");
		}
		if ((truthy(rt.sv(f, "w_uniform")) && (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "w_uniform")), 96)) || (!isEqual(live(bodyzone_hit), "feet") && truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "w_uniform")), 24)))))) {
			leg_clothes = rt.sv(f, "w_uniform");
		}
		if ((truthy(rt.sv(f, "wear_suit")) && (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "wear_suit")), 96)) || (!isEqual(live(bodyzone_hit), "feet") && truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "wear_suit")), 24)))))) {
			leg_clothes = rt.sv(f, "wear_suit");
		}
		if (truthy(live(leg_clothes))) {
			if (!truthy(rt.bitAnd(rt.fv(f, "resistance_flags", live(leg_clothes)), 16))) {
				yield* g.callName(f, live(leg_clothes), "acid_act", [live(acidpwr), live(acid_volume)]);
				yield* g.srcCall(f, "update_inv_shoes");
				yield* g.srcCall(f, "update_inv_w_uniform");
				yield* g.srcCall(f, "update_inv_wear_suit");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>Your ＀ protects your legs and feet from the acid!</span>", [rt.fv(f, "name", live(leg_clothes))])]);
			}
		} else {
			f.dot = (yield* g.srcCall(f, "get_bodypart", "r_leg"));
			if (truthy(live(f.dot))) {
				damaged = rt.modify(live(damaged), live(f.dot), add);
			}
			f.dot = (yield* g.srcCall(f, "get_bodypart", "l_leg"));
			if (truthy(live(f.dot))) {
				damaged = rt.modify(live(damaged), live(f.dot), add);
			}
		}
	}
	affecting = null;
	rt.forList(f, 0, live(damaged), T("/obj/item/bodypart"));
	while (($e = rt.next(f, 0)) !== undefined) {
		affecting = $e;
		yield* g.callName(f, live(affecting), "receive_damage", [live(acidity), multiply(2, live(acidity))]);
		if (isEqual(rt.fv(f, "name", live(affecting)), "head")) {
			if (truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/min"), null, [divide(multiply(live(acidpwr), live(acid_volume)), 10), 90]))]))) {
				yield* g.callName(f, live(affecting), "receive_damage", [live(acidity), multiply(2, live(acidity))]);
				yield* g.srcCall(f, "emote", "scream");
				rt.setSv(f, "facial_hair_style", "Shaved");
				rt.setSv(f, "hair_style", "Bald");
				yield* g.srcCall(f, "update_hair");
				(rt.modSrcVar(f, "status_flags", 16384, rt.bitOr));
			}
		}
		yield* g.srcCall(f, "update_damage_overlays");
	}
	rt.endFor(f, 0);
	if (!truthy(live(bodyzone_hit))) {
		if (truthy(rt.sv(f, "back"))) {
			inventory_items_to_kill = rt.modify(live(inventory_items_to_kill), rt.sv(f, "back"), add);
		}
		if (truthy(rt.sv(f, "belt"))) {
			inventory_items_to_kill = rt.modify(live(inventory_items_to_kill), rt.sv(f, "belt"), add);
		}
		inventory_items_to_kill = rt.modify(live(inventory_items_to_kill), rt.sv(f, "held_items"), add);
	}
	I = null;
	rt.forList(f, 0, live(inventory_items_to_kill), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(I), "acid_act", [live(acidpwr), live(acid_volume)]);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /mob/living/carbon/human/proc/singularity_act  (code/modules/mob/living/carbon/human/human_defense.dm:619)  may sleep
rt.def("/mob/living/carbon/human/proc/singularity_act", function* singularity_act(f: Frame) {
	let gain: Value = null;
	f.vars = () => [gain];
	gain = 20;
	if (truthy(rt.sv(f, "mind"))) {
		if ((isEqual(rt.fv(f, "assigned_role", rt.sv(f, "mind")), "Station Engineer") || isEqual(rt.fv(f, "assigned_role", rt.sv(f, "mind")), "Chief Engineer"))) {
			gain = 100;
		}
		if (isEqual(rt.fv(f, "assigned_role", rt.sv(f, "mind")), "Clown")) {
			gain = (yield* g.call(f, P("/proc/rand"), null, [-300, 300]));
		}
	}
	yield* g.srcCall(f, "investigate_log", fmt("(＀) has been consumed by the singularity.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))]), "singulo");
	yield* g.srcCall(f, "gib");
	return live(gain);
}, true);

// /mob/living/carbon/human/proc/help_shake_act  (code/modules/mob/living/carbon/human/human_defense.dm:628)  may sleep
rt.def("/mob/living/carbon/human/proc/help_shake_act", function* help_shake_act(f: Frame) {
	let missing: Value = null, X: Value = null, LB: Value = null, status: Value = null, brutedamage: Value = null, burndamage: Value = null, I: Value = null, t: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [missing, X, LB, status, brutedamage, burndamage, I, t, $0, $1, $e];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!rt.ge(rt.sv(f, "health"), 0)) return f.dot;
	if (isEqual(live(f.src), live(f.args[0]))) {
		yield* g.srcCall(f, "visible_message", fmt("＀ examines ＀self.", [live(f.src), (yield* g.srcCall(f, "p_them"))]), "<span class='notice'>You check yourself for injuries.</span>");
		missing = rt.list("head", "chest", "l_arm", "r_arm", "l_leg", "r_leg");
		X = null;
		rt.forList(f, 0, rt.sv(f, "bodyparts"));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			(missing = rt.modify(live(missing), rt.gv(f, "body_zone", (LB = live(X))), subtract));
			status = "";
			brutedamage = rt.fv(f, "brute_dam", live(LB));
			burndamage = rt.fv(f, "burn_dam", live(LB));
			if (truthy(rt.sv(f, "hallucination"))) {
				if (truthy(rt.op(f, "Prob", [], [30]))) {
					brutedamage = rt.modify(live(brutedamage), (yield* g.call(f, P("/proc/rand"), null, [30, 40])), add);
				}
				if (truthy(rt.op(f, "Prob", [], [30]))) {
					burndamage = rt.modify(live(burndamage), (yield* g.call(f, P("/proc/rand"), null, [30, 40])), add);
				}
			}
			if (rt.gt(live(brutedamage), 0)) {
				status = "bruised";
			}
			if (rt.gt(live(brutedamage), 20)) {
				status = "battered";
			}
			if (rt.gt(live(brutedamage), 40)) {
				status = "mangled";
			}
			if ((rt.gt(live(brutedamage), 0) && rt.gt(live(burndamage), 0))) {
				status = rt.modify(live(status), " and ", add);
			}
			if (rt.gt(live(burndamage), 40)) {
				status = rt.modify(live(status), "peeling away", add);
			} else {
				if (rt.gt(live(burndamage), 10)) {
					status = rt.modify(live(status), "blistered", add);
				} else {
					if (rt.gt(live(burndamage), 0)) {
						status = rt.modify(live(status), "numb", add);
					}
				}
			}
			if (isEqual(live(status), "")) {
				status = "OK";
			}
			$0 = live(f.src);
			if (isEqual(live(status), "OK")) {
				$1 = "notice";
			} else {
				$1 = "warning";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("\t <span class='＀'>Your ＀ is ＀.</span>", [$1, rt.fv(f, "name", live(LB)), live(status)])]);
			I = null;
			rt.forList(f, 1, rt.fv(f, "embedded_objects", live(LB)), T("/obj/item"));
			while (($e = rt.next(f, 1)) !== undefined) {
				I = $e;
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("\t <a href='?src=＃;embedded_object=＃;embedded_limb=＃' class='warning'>There is ＇！ embedded in your ＀!</a>", [live(f.src), live(I), live(LB), live(I), rt.fv(f, "name", live(LB))])]);
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
		t = null;
		rt.forList(f, 0, live(missing));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='boldannounce'>Your ＀ is missing!</span>", [(yield* g.call(f, P("/proc/parse_zone"), null, [live(t)]))])]);
		}
		rt.endFor(f, 0);
		if (truthy(rt.sv(f, "bleed_rate"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You are bleeding!</span>"]);
		}
		if (truthy(rt.sv(f, "staminaloss"))) {
			if (rt.gt(rt.sv(f, "staminaloss"), 30)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='info'>You're completely exhausted.</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='info'>You feel fatigued.</span>"]);
			}
		}
	} else {
		if (truthy(rt.sv(f, "wear_suit"))) {
			yield* g.callName(f, rt.sv(f, "wear_suit"), "add_fingerprint", [live(f.args[0])]);
		} else {
			if (truthy(rt.sv(f, "w_uniform"))) {
				yield* g.callName(f, rt.sv(f, "w_uniform"), "add_fingerprint", [live(f.args[0])]);
			}
		}
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/human/proc/damage_clothes  (code/modules/mob/living/carbon/human/human_defense.dm:691)  may sleep
rt.def("/mob/living/carbon/human/proc/damage_clothes", function* damage_clothes(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, def_zone: Value) {
	let torn_items: Value = null, head_clothes: Value = null, chest_clothes: Value = null, arm_clothes: Value = null, leg_clothes: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [damage_amount, damage_type, damage_flag, def_zone, torn_items, head_clothes, chest_clothes, arm_clothes, leg_clothes, I, $e];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	if ((!isEqual(live(damage_type), "brute") && !isEqual(live(damage_type), "fire"))) {
		return live(f.dot);
	}
	(damage_amount = rt.modify(live(damage_amount), 0.5, multiply));
	torn_items = rt.list();
	if ((!truthy(live(def_zone)) || isEqual(live(def_zone), "head"))) {
		head_clothes = null;
		if (truthy(rt.sv(f, "glasses"))) {
			head_clothes = rt.sv(f, "glasses");
		}
		if (truthy(rt.sv(f, "wear_mask"))) {
			head_clothes = rt.sv(f, "wear_mask");
		}
		if (truthy(rt.sv(f, "wear_neck"))) {
			head_clothes = rt.sv(f, "wear_neck");
		}
		if (truthy(rt.sv(f, "head"))) {
			head_clothes = rt.sv(f, "head");
		}
		if (truthy(live(head_clothes))) {
			torn_items = rt.modify(live(torn_items), live(head_clothes), add);
		} else {
			if (truthy(rt.sv(f, "ears"))) {
				torn_items = rt.modify(live(torn_items), rt.sv(f, "ears"), add);
			}
		}
	}
	if ((!truthy(live(def_zone)) || isEqual(live(def_zone), "chest"))) {
		chest_clothes = null;
		if (truthy(rt.sv(f, "w_uniform"))) {
			chest_clothes = rt.sv(f, "w_uniform");
		}
		if (truthy(rt.sv(f, "wear_suit"))) {
			chest_clothes = rt.sv(f, "wear_suit");
		}
		if (truthy(live(chest_clothes))) {
			torn_items = rt.modify(live(torn_items), live(chest_clothes), add);
		}
	}
	if (((!truthy(live(def_zone)) || isEqual(live(def_zone), "l_arm")) || isEqual(live(def_zone), "r_arm"))) {
		arm_clothes = null;
		if (truthy(rt.sv(f, "gloves"))) {
			arm_clothes = rt.sv(f, "gloves");
		}
		if ((truthy(rt.sv(f, "w_uniform")) && (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "w_uniform")), 1536)) || truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "w_uniform")), 384))))) {
			arm_clothes = rt.sv(f, "w_uniform");
		}
		if ((truthy(rt.sv(f, "wear_suit")) && (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "wear_suit")), 1536)) || truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "wear_suit")), 384))))) {
			arm_clothes = rt.sv(f, "wear_suit");
		}
		if (truthy(live(arm_clothes))) {
			torn_items = rt.modify(live(torn_items), live(arm_clothes), add);
		}
	}
	if (((!truthy(live(def_zone)) || isEqual(live(def_zone), "l_leg")) || isEqual(live(def_zone), "r_leg"))) {
		leg_clothes = null;
		if (truthy(rt.sv(f, "shoes"))) {
			leg_clothes = rt.sv(f, "shoes");
		}
		if ((truthy(rt.sv(f, "w_uniform")) && (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "w_uniform")), 96)) || truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "w_uniform")), 24))))) {
			leg_clothes = rt.sv(f, "w_uniform");
		}
		if ((truthy(rt.sv(f, "wear_suit")) && (truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "wear_suit")), 96)) || truthy(rt.bitAnd(rt.fv(f, "body_parts_covered", rt.sv(f, "wear_suit")), 24))))) {
			leg_clothes = rt.sv(f, "wear_suit");
		}
		if (truthy(live(leg_clothes))) {
			torn_items = rt.modify(live(torn_items), live(leg_clothes), add);
		}
	}
	I = null;
	rt.forList(f, 0, live(torn_items), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(I), "take_damage", [live(damage_amount), live(damage_type), live(damage_flag), 0]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
