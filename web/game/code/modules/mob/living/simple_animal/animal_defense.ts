// From code/modules/mob/living/simple_animal/animal_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/simple_animal/proc/attack_hand  (code/modules/mob/living/simple_animal/animal_defense.dm:4)  may sleep
rt.def("/mob/living/simple_animal/proc/attack_hand", function* attack_hand(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.fv(f, "a_intent", live(f.args[0]));
	if ($0 === "help") {
		if (rt.gt(rt.sv(f, "health"), 0)) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ ＀ ＀.</span>", [live(f.args[0]), rt.sv(f, "response_help"), live(f.src)]));
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
		}
	} else if ($0 === "grab") {
		yield* g.srcCall(f, "grabbedby", live(f.args[0]));
	} else if ($0 === "harm" || $0 === "disarm") {
		yield* g.callName(f, live(f.args[0]), "do_attack_animation", [live(f.src), "punch"]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ ＀ ＀!</span>", [live(f.args[0]), rt.sv(f, "response_harm"), live(f.src)]), fmt("<span class='userdanger'>＀ ＀ ＀!</span>", [live(f.args[0]), rt.sv(f, "response_harm"), live(f.src)]), null, 3);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "attacked_sound"), 25, 1, -1]);
		yield* g.srcCall(f, "attack_threshold_check", rt.sv(f, "harm_intent_damage"));
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "attacked"]);
		yield* g.srcCall(f, "updatehealth");
		return 1;
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/proc/attack_hulk  (code/modules/mob/living/simple_animal/animal_defense.dm:26)  may sleep
rt.def("/mob/living/simple_animal/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	f.vars = () => [user, does_attack_animation];
	if (live(does_attack_animation) === null) {
		does_attack_animation = 0;
	}
	if (!isEqual(rt.fv(f, "a_intent", live(user)), "harm")) return f.dot;
	yield* g.callSuper(f, [live(user), 1]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "punch", 25, 1, -1]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has punched ＀!</span>", [live(user), live(f.src)]), fmt("<span class='userdanger'>＀ has punched ＀!</span>", [live(user), live(f.src)]), null, 3);
	yield* g.srcCall(f, "adjustBruteLoss", 15);
	return 1;
}, true);

// /mob/living/simple_animal/proc/attack_paw  (code/modules/mob/living/simple_animal/animal_defense.dm:35)  may sleep
rt.def("/mob/living/simple_animal/proc/attack_paw", function* attack_paw(f: Frame) {
	let damage: Value = null;
	f.vars = () => [damage];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		if (!isEqual(rt.sv(f, "stat"), 2)) {
			yield* g.srcCall(f, "attack_threshold_check", (damage = (yield* g.call(f, P("/proc/rand"), null, [1, 3]))));
			return 1;
		}
	}
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[0])), "help")) return f.dot;
	if (!rt.gt(rt.sv(f, "health"), 0)) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ ＀ ＀.</span>", [rt.fv(f, "name", live(f.args[0])), rt.sv(f, "response_help"), live(f.src)]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/proc/attack_alien  (code/modules/mob/living/simple_animal/animal_defense.dm:47)  may sleep
rt.def("/mob/living/simple_animal/proc/attack_alien", function* attack_alien(f: Frame) {
	let damage: Value = null;
	f.vars = () => [damage];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (isEqual(rt.fv(f, "a_intent", live(f.args[0])), "disarm")) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/pierce.ogg"), 25, 1, -1]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ ＀ ＀!</span>", [live(f.args[0]), rt.sv(f, "response_disarm"), rt.sv(f, "name")]), fmt("<span class='userdanger'>＀ ＀ ＀!</span>", [live(f.args[0]), rt.sv(f, "response_disarm"), rt.sv(f, "name")]), null, 3);
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "disarmed"]);
	} else {
		damage = (yield* g.call(f, P("/proc/rand"), null, [15, 30]));
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has slashed at ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has slashed at ＀!</span>", [live(f.args[0]), live(f.src)]), null, 3);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/slice.ogg"), 25, 1, -1]);
		yield* g.srcCall(f, "attack_threshold_check", live(damage));
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "attacked"]);
	}
	return 1;
}, true, { args: ["M"] });

// /mob/living/simple_animal/proc/attack_larva  (code/modules/mob/living/simple_animal/animal_defense.dm:63)  may sleep
rt.def("/mob/living/simple_animal/proc/attack_larva", function* attack_larva(f: Frame) {
	let damage: Value = null;
	f.vars = () => [damage];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && !isEqual(rt.sv(f, "stat"), 2))) return f.dot;
	f.dot = (yield* g.srcCall(f, "attack_threshold_check", (damage = (yield* g.call(f, P("/proc/rand"), null, [5, 10])))));
	if (!truthy(live(f.dot))) return f.dot;
	rt.setFv(f, "amount_grown", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "amount_grown", live(f.args[0])), live(damage)), rt.fv(f, "max_grown", live(f.args[0]))])));
	return f.dot;
}, true, { args: ["L"] });

// /mob/living/simple_animal/proc/attack_animal  (code/modules/mob/living/simple_animal/animal_defense.dm:71)  may sleep
rt.def("/mob/living/simple_animal/proc/attack_animal", function* attack_animal(f: Frame) {
	let damage: Value = null;
	f.vars = () => [damage];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	return (yield* g.srcCall(f, "attack_threshold_check", (damage = (yield* g.call(f, P("/proc/rand"), null, [rt.fv(f, "melee_damage_lower", live(f.args[0])), rt.fv(f, "melee_damage_upper", live(f.args[0]))]))), rt.fv(f, "melee_damage_type", live(f.args[0]))));
}, true, { args: ["M"] });

// /mob/living/simple_animal/proc/attack_slime  (code/modules/mob/living/simple_animal/animal_defense.dm:77)  may sleep
rt.def("/mob/living/simple_animal/proc/attack_slime", function* attack_slime(f: Frame) {
	let damage: Value = null;
	f.vars = () => [damage];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	damage = (yield* g.call(f, P("/proc/rand"), null, [15, 25]));
	if (truthy(rt.fv(f, "is_adult", live(f.args[0])))) {
		damage = (yield* g.call(f, P("/proc/rand"), null, [20, 35]));
	}
	return (yield* g.srcCall(f, "attack_threshold_check", live(damage)));
}, true, { args: ["M"] });

// /mob/living/simple_animal/proc/attack_threshold_check  (code/modules/mob/living/simple_animal/animal_defense.dm:84)  may sleep
rt.def("/mob/living/simple_animal/proc/attack_threshold_check", function* attack_threshold_check(f: Frame, damage: Value, damagetype: Value, armorcheck: Value) {
	let temp_damage: Value = null;
	f.vars = () => [damage, damagetype, armorcheck, temp_damage];
	if (live(damagetype) === null) {
		damagetype = "brute";
	}
	if (live(armorcheck) === null) {
		armorcheck = "melee";
	}
	temp_damage = live(damage);
	if (!truthy(rt.index(rt.sv(f, "damage_coeff"), live(damagetype)))) {
		temp_damage = 0;
	} else {
		(temp_damage = rt.modify(live(temp_damage), rt.index(rt.sv(f, "damage_coeff"), live(damagetype)), multiply));
	}
	if ((rt.ge(live(temp_damage), 0) && rt.le(live(temp_damage), rt.sv(f, "force_threshold")))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ looks unharmed.</span>", [live(f.src)]));
		return 0;
	} else {
		yield* g.srcCall(f, "apply_damage", live(damage), live(damagetype), null, (yield* g.srcCall(f, "getarmor", null, live(armorcheck))));
		return 1;
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/bullet_act  (code/modules/mob/living/simple_animal/animal_defense.dm:98)  may sleep
rt.def("/mob/living/simple_animal/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	f.vars = () => [Proj];
	if (!truthy(live(Proj))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "apply_damage", rt.fv(f, "damage", live(Proj)), rt.fv(f, "damage_type", live(Proj)));
	yield* g.callName(f, live(Proj), "on_hit", [live(f.src)]);
	return 0;
}, true);

// /mob/living/simple_animal/proc/ex_act  (code/modules/mob/living/simple_animal/animal_defense.dm:105)  may sleep
rt.def("/mob/living/simple_animal/proc/ex_act", function* ex_act(f: Frame) {
	let bomb_armor: Value = null, bloss: Value = null;
	let $0: any;
	f.vars = () => [bomb_armor, bloss, $0];
	if (((truthy(live(f.args[2])) && truthy((rt.istype(live(f.args[2]), T("/datum/spacevine_mutation")) ? 1 : 0))) && truthy((yield* g.call(f, P("/proc/isvineimmune"), null, [live(f.src)]))))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	bomb_armor = (yield* g.srcCall(f, "getarmor", null, "bomb"));
	$0 = live(f.args[0]);
	if ($0 === 1) {
		if (truthy(rt.op(f, "Prob", [], [live(bomb_armor)]))) {
			yield* g.srcCall(f, "adjustBruteLoss", 500);
		} else {
			yield* g.srcCall(f, "gib");
			return live(f.dot);
		}
	} else if ($0 === 2) {
		bloss = 60;
		if (truthy(rt.op(f, "Prob", [], [live(bomb_armor)]))) {
			bloss = divide(live(bloss), 1.5);
		}
		yield* g.srcCall(f, "adjustBruteLoss", live(bloss));
	} else if ($0 === 3) {
		bloss = 30;
		if (truthy(rt.op(f, "Prob", [], [live(bomb_armor)]))) {
			bloss = divide(live(bloss), 1.5);
		}
		yield* g.srcCall(f, "adjustBruteLoss", live(bloss));
	}
	return f.dot;
}, true, { args: ["severity", "target", "origin"], waitfor: false });

// /mob/living/simple_animal/proc/blob_act  (code/modules/mob/living/simple_animal/animal_defense.dm:129)  may sleep
rt.def("/mob/living/simple_animal/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	yield* g.srcCall(f, "adjustBruteLoss", 20);
	return live(f.dot);
}, true);

// /mob/living/simple_animal/proc/do_attack_animation  (code/modules/mob/living/simple_animal/animal_defense.dm:133)  may sleep
rt.def("/mob/living/simple_animal/proc/do_attack_animation", function* do_attack_animation(f: Frame) {
	if (((!truthy(live(f.args[3])) && !truthy(live(f.args[1]))) && truthy(rt.sv(f, "melee_damage_upper")))) {
		if (rt.lt(rt.sv(f, "melee_damage_upper"), 10)) {
			f.args[1] = "punch";
		} else {
			f.args[1] = "smash";
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A", "visual_effect_icon", "used_item", "no_effect", "end_pixel_y"] });
