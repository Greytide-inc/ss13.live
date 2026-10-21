// From code/_onclick/other_mobs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/UnarmedAttack  (code/_onclick/other_mobs.dm:9)  may sleep
rt.def("/mob/living/carbon/human/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value, proximity: Value) {
	let G: Value = null, override: Value = null, HM: Value = null;
	let $e: any;
	f.vars = () => [A, proximity, G, override, HM, $e];
	if (!truthy((yield* g.srcCall(f, "has_active_hand")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You look at your arm and sigh.</span>"]);
		return live(f.dot);
	}
	G = rt.sv(f, "gloves");
	if (((truthy(live(proximity)) && truthy((rt.istype(live(G), T("/obj/item/clothing/gloves")) ? 1 : 0))) && truthy((yield* g.callName(f, live(G), "Touch", [live(A), 1]))))) {
		return live(f.dot);
	}
	override = 0;
	HM = null;
	rt.forList(f, 0, rt.fv(f, "mutations", rt.sv(f, "dna")), T("/datum/mutation/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		HM = $e;
		override = rt.modify(live(override), (yield* g.callName(f, live(HM), "on_attack_hand", [live(f.src), live(A), live(proximity)])), add);
	}
	rt.endFor(f, 0);
	if (truthy(live(override))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(A), "attack_hand", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/RangedAttack  (code/_onclick/other_mobs.dm:46)  may sleep
rt.def("/mob/living/carbon/human/proc/RangedAttack", function* RangedAttack(f: Frame, A: Value) {
	let G: Value = null, HM: Value = null;
	let $e: any;
	f.vars = () => [A, G, HM, $e];
	if (truthy(rt.sv(f, "gloves"))) {
		if ((truthy((rt.istype((G = rt.sv(f, "gloves")), T("/obj/item/clothing/gloves")) ? 1 : 0)) && truthy((yield* g.callName(f, live(G), "Touch", [live(A), 0]))))) {
			return live(f.dot);
		}
	}
	HM = null;
	rt.forList(f, 0, rt.fv(f, "mutations", rt.sv(f, "dna")), T("/datum/mutation/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		HM = $e;
		yield* g.callName(f, live(HM), "on_ranged_attack", [live(f.src), live(A)]);
	}
	rt.endFor(f, 0);
	if (!(truthy((yield* g.call(f, P("/proc/isturf"), null, [live(A)]))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(A)])), 1))) return f.dot;
	yield* g.callName(f, live(f.src), "Move_Pulled", [live(A)]);
	return f.dot;
}, true);

// /mob/living/proc/UnarmedAttack  (code/_onclick/other_mobs.dm:60)  may sleep
rt.def("/mob/living/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "attack_animal", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/UnarmedAttack  (code/_onclick/other_mobs.dm:71)  may sleep
rt.def("/mob/living/carbon/monkey/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "attack_paw", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/RestrainedClickOn  (code/_onclick/other_mobs.dm:83)  may sleep
rt.def("/mob/living/carbon/monkey/proc/RestrainedClickOn", function* RestrainedClickOn(f: Frame) {
	let ML: Value = null, dam_zone: Value = null, affecting: Value = null, H: Value = null, armor: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [ML, dam_zone, affecting, H, armor, D, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if ((!isEqual(rt.sv(f, "a_intent"), "harm") || !truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "is_muzzled")))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((ML = live(f.args[0])), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	dam_zone = rt.op(f, "PickUnweighted", [5], ["chest", "l_hand", "r_hand", "l_leg", "r_leg"]);
	affecting = null;
	if (truthy((rt.istype(live(ML), T("/mob/living/carbon/human")) ? 1 : 0))) {
		affecting = (yield* g.callName(f, (H = live(ML)), "get_bodypart", [(yield* g.call(f, P("/proc/ran_zone"), null, [live(dam_zone)]))]));
	}
	armor = (yield* g.callName(f, live(ML), "run_armor_check", [live(affecting), "melee"]));
	if (truthy(rt.op(f, "Prob", [], [75]))) {
		yield* g.callName(f, live(ML), "apply_damage", [(yield* g.call(f, P("/proc/rand"), null, [1, 3])), "brute", live(affecting), live(armor)]);
		yield* g.callName(f, live(ML), "visible_message", [fmt("<span class='danger'>＀ bites ＀!</span>", [rt.sv(f, "name"), live(ML)]), fmt("<span class='userdanger'>＀ bites ＀!</span>", [rt.sv(f, "name"), live(ML)])]);
		if (rt.ge(live(armor), 2)) {
			return live(f.dot);
		}
		D = null;
		rt.forList(f, 0, rt.sv(f, "viruses"), T("/datum/disease"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			yield* g.callName(f, live(ML), "ForceContractDisease", [live(D)]);
		}
		rt.endFor(f, 0);
	} else {
		yield* g.callName(f, live(ML), "visible_message", [fmt("<span class='danger'>＀ has attempted to bite ＀!</span>", [live(f.src), live(ML)])]);
	}
	return f.dot;
}, true, { args: ["A"] });

// /mob/living/carbon/alien/proc/UnarmedAttack  (code/_onclick/other_mobs.dm:113)  may sleep
rt.def("/mob/living/carbon/alien/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "attack_alien", [live(f.src)]);
	return f.dot;
}, true);

// /atom/proc/attack_alien  (code/_onclick/other_mobs.dm:115)  may sleep
rt.def("/atom/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_paw", live(user));
	return live(f.dot);
}, true);

// /mob/living/carbon/alien/larva/proc/UnarmedAttack  (code/_onclick/other_mobs.dm:122)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "attack_larva", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/proc/UnarmedAttack  (code/_onclick/other_mobs.dm:132)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "attack_slime", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/proc/UnarmedAttack  (code/_onclick/other_mobs.dm:143)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "attack_drone", [live(f.src)]);
	return f.dot;
}, true);

// /atom/proc/attack_drone  (code/_onclick/other_mobs.dm:146)  may sleep
rt.def("/atom/proc/attack_drone", function* attack_drone(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /mob/living/carbon/true_devil/proc/UnarmedAttack  (code/_onclick/other_mobs.dm:157)  may sleep
rt.def("/mob/living/carbon/true_devil/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value, proximity: Value) {
	f.vars = () => [A, proximity];
	yield* g.callName(f, live(A), "attack_hand", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/UnarmedAttack  (code/_onclick/other_mobs.dm:180)  may sleep
rt.def("/mob/living/simple_animal/proc/UnarmedAttack", function* UnarmedAttack(f: Frame) {
	if (!truthy(rt.sv(f, "dextrous"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "attack_hand", [live(f.src)]);
	yield* g.srcCall(f, "update_inv_hands");
	return f.dot;
}, true, { args: ["A", "proximity"] });

// /mob/living/simple_animal/hostile/proc/UnarmedAttack  (code/_onclick/other_mobs.dm:192)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/UnarmedAttack", function* UnarmedAttack(f: Frame) {
	rt.setSv(f, "target", live(f.args[0]));
	if (((truthy(rt.sv(f, "dextrous")) && !truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[0]), rt.sv(f, "environment_target_typecache")])))) && !truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])]))))) {
		yield* g.callSuper(f, [], rt.Args.Same);
	} else {
		yield* g.srcCall(f, "AttackingTarget");
	}
	return f.dot;
}, true, { args: ["A"] });
