// From code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5023, "/mob/living/simple_animal/hostile/megafauna/bubblegum", "/mob/living/simple_animal/hostile/megafauna", {
	charging: 0,
	move_to_delay: 10,
	ranged: 1,
	name: "bubblegum",
	desc: "In what passes for a heirarchy among slaughter demons, this one is king.",
	health: 2500,
	maxHealth: 2500,
	attacktext: "rends",
	attack_sound: rt.rsc("sound/magic/demon_attack1.ogg"),
	icon_state: "bubblegum",
	icon_living: "bubblegum",
	icon_dead: "",
	friendly: "stares down",
	icon: rt.rsc("icons/mob/lavaland/96x96megafauna.dmi"),
	speak_emote: null,
	armour_penetration: 40,
	melee_damage_lower: 40,
	melee_damage_upper: 40,
	speed: 1,
	pixel_x: -32,
	del_on_death: 1,
	crusher_loot: null,
	loot: null,
	blood_volume: 2000,
	medal_type: "Bubblegum",
	score_type: "Bubblegum Killed",
	deathmessage: "sinks into a pool of blood, fleeing the battle. You've won, for now... ",
	death_sound: rt.rsc("sound/magic/enter_blood.ogg"),
});

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:38)
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("gurgles"));
	$0 = $0;
	rt.setSv(f, "crusher_loot", rt.list(T("/obj/structure/closet/crate/necropolis/bubblegum/crusher")));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/structure/closet/crate/necropolis/bubblegum")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/adjustBruteLoss  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:63)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/adjustBruteLoss", function* adjustBruteLoss(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(rt.gt(live(f.dot), 0) && truthy(rt.op(f, "Prob", [], [25])))) return f.dot;
	B = (yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/gibs/bubblegum"), [rt.sv(f, "loc")]));
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		yield* g.call(f, P("/proc/step"), null, [live(B), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
	} else {
		yield* g.callName(f, live(B), "setDir", [rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
	}
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Life  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:81)
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Life", function Life(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "move_to_delay", rt.call(f, P("/proc/max"), null, [5, rt.call(f, P("/proc/min"), null, [multiply(divide(rt.sv(f, "health"), rt.sv(f, "maxHealth")), 10), 10])]));
	return f.dot;
}, false, { waitfor: false });

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/OpenFire  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:85)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/OpenFire", function* OpenFire(f: Frame) {
	let warped: Value = null;
	f.vars = () => [warped];
	rt.setSv(f, "anger_modifier", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [divide(subtract(rt.sv(f, "maxHealth"), rt.sv(f, "health")), 60), 20]))])));
	if (truthy(rt.sv(f, "charging"))) {
		return live(f.dot);
	}
	rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), rt.sv(f, "ranged_cooldown_time")));
	warped = 0;
	if (!truthy((yield* g.srcCall(f, "try_bloodattack")))) {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/blood_spray")]);
		if ((truthy((warped = (yield* g.srcCall(f, "blood_warp")))) && truthy(rt.op(f, "Prob", [], [subtract(100, rt.sv(f, "anger_modifier"))])))) {
			return live(f.dot);
		}
	}
	if (!(truthy(rt.op(f, "Prob", [], [subtract(90, rt.sv(f, "anger_modifier"))])) || truthy((yield* g.srcCall(f, "slaughterlings"))))) return f.dot;
	if (rt.gt(rt.sv(f, "health"), multiply(rt.sv(f, "maxHealth"), 0.5))) {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/charge")]);
	} else {
		if ((truthy(rt.op(f, "Prob", [], [70])) || truthy(live(warped)))) {
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/charge"), 2]);
		} else {
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/warp_charge")]);
		}
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:108)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null, bloodspell: Value = null;
	let $e: any;
	f.vars = () => [B, bloodspell, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	B = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/simple_animal/hostile/megafauna/bubblegum"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		if (!isEqual(live(B), live(f.src))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "AddSpell", (bloodspell = (yield* g.new_(f, T("/obj/effect/proc_holder/spell/bloodcrawl"), []))));
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/effect/dummy/slaughter")) ? 1 : 0))) {
		rt.setFv(f, "phased", live(bloodspell), 1);
	}
	rt.setSv(f, "internal", (yield* g.new_(f, T("/obj/item/device/gps/internal/bubblegum"), [live(f.src)])));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/grant_achievement  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:120)
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/grant_achievement", function grant_achievement(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) return f.dot;
	(rt.modField(f, rt.gl("SSshuttle"), "shuttle_purchase_requirements_met", "bubblegum", rt.bitOr));
	return f.dot;
}, false, { args: ["medaltype", "scoretype"] });

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/do_attack_animation  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:125)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/do_attack_animation", function* do_attack_animation(f: Frame) {
	if (truthy(rt.sv(f, "charging"))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A", "visual_effect_icon"] });

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:129)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (truthy(rt.sv(f, "charging"))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Goto  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:133)
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Goto", function Goto(f: Frame) {
	if (truthy(rt.sv(f, "charging"))) return f.dot;
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["target", "delay", "minimum_distance"] });

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Move  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:138)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Move", function* Move(f: Frame) {
	if (truthy(rt.sv(f, "charging"))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/decoy/fading"), [rt.sv(f, "loc"), live(f.src)]);
		yield* g.srcCall(f, "DestroySurroundings");
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if ((!truthy(rt.sv(f, "stat")) && truthy(live(f.dot)))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/meteorimpact.ogg"), 200, 1, 2, 1]);
	}
	if (!truthy(rt.sv(f, "charging"))) return f.dot;
	yield* g.srcCall(f, "DestroySurroundings");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/warp_charge  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:147)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/warp_charge", function* warp_charge(f: Frame) {
	yield* g.srcCall(f, "blood_warp");
	yield* g.srcCall(f, "charge");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/charge  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:151)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/charge", function* charge(f: Frame, bonus_charges: Value) {
	let _T: Value = null, D: Value = null;
	f.vars = () => [bonus_charges, _T, D];
	if ((!truthy((_T = rt.getStep(f, rt.sv(f, "target"), 0))) || isEqual(live(_T), rt.sv(f, "loc")))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/dragon_swoop/bubblegum"), [live(_T)]);
	rt.setSv(f, "charging", 1);
	yield* g.srcCall(f, "DestroySurroundings");
	yield* g.call(f, P("/proc/walk"), null, [live(f.src), 0]);
	yield* g.srcCall(f, "setDir", rt.getDir(f, live(f.src), live(_T)));
	D = (yield* g.new_(f, T("/obj/effect/temp_visual/decoy"), [rt.sv(f, "loc"), live(f.src)]));
	rt.op(f, "Animate", [2, 10], [null, live(D), "alpha", 0, "color", "#FF0000", "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 2), "time", 3]);
	yield* g.call(f, P("/proc/sleep"), null, [3]);
	yield* g.callSrc(f, "throw_at", [null, live(_T), null, (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(_T)])), null, 1, null, live(f.src), null, 0, "callback", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/charge_end"), live(bonus_charges)]))], rt.Args.Named);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/charge_end  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:166)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/charge_end", function* charge_end(f: Frame, bonus_charges: Value, effects_to_destroy: Value) {
	f.vars = () => [bonus_charges, effects_to_destroy];
	rt.setSv(f, "charging", 0);
	yield* g.srcCall(f, "try_bloodattack");
	if (!truthy(rt.sv(f, "target"))) return f.dot;
	if (truthy(live(bonus_charges))) {
		bonus_charges = rt.inc(live(bonus_charges), -1);
		yield* g.srcCall(f, "charge", live(bonus_charges));
	} else {
		yield* g.srcCall(f, "Goto", rt.sv(f, "target"), rt.sv(f, "move_to_delay"), rt.sv(f, "minimum_distance"));
		yield* g.srcCall(f, "SetRecoveryTime", 5);
	}
	return f.dot;
}, true, { argTypes: [{  }, { path: "/list" }] });

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Bump  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:178)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Bump", function* Bump(f: Frame) {
	if (truthy(rt.sv(f, "charging"))) {
		if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.args[0])]))) || (truthy((rt.istype(live(f.args[0]), T("/obj")) ? 1 : 0)) && truthy(rt.fv(f, "density", live(f.args[0])))))) {
			yield* g.callName(f, live(f.args[0]), "ex_act", [2]);
		}
		yield* g.srcCall(f, "DestroySurroundings");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A"] });

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/throw_impact  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:184)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/throw_impact", function* throw_impact(f: Frame) {
	let L: Value = null, throwtarget: Value = null;
	f.vars = () => [L, throwtarget];
	if (!truthy(rt.sv(f, "charging"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		yield* g.callName(f, (L = live(f.args[0])), "visible_message", [fmt("<span class='danger'>＀ slams into ＀!</span>", [live(f.src), live(L)]), fmt("<span class='userdanger'>＀ slams into you!</span>", [live(f.src)])]);
		yield* g.callName(f, live(L), "apply_damage", [40, "brute"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(L), 0), rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1]);
		yield* g.call(f, P("/proc/shake_camera"), null, [live(L), 4, 3]);
		yield* g.call(f, P("/proc/shake_camera"), null, [live(f.src), 2, 3]);
		throwtarget = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.src), rt.getDir(f, live(f.src), (yield* g.call(f, P("/proc/get_step_away"), null, [live(L), live(f.src)])))]));
		yield* g.callName(f, live(L), "throw_at", [live(throwtarget), 3]);
	}
	rt.setSv(f, "charging", 0);
	return f.dot;
}, true, { args: ["A"], waitfor: false });

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/get_mobs_on_blood  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:201)
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/get_mobs_on_blood", function get_mobs_on_blood(f: Frame) {
	let targets: Value = null, L: Value = null, bloodpool: Value = null;
	let $e: any;
	f.vars = () => [targets, L, bloodpool, $e];
	targets = rt.callSrc(f, "ListTargets", []);
	f.dot = rt.list();
	L = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((truthy(rt.getLen(f, (bloodpool = rt.callSrc(f, "get_pools", [rt.getStep(f, live(L), 0), 0])))) && (!truthy(rt.callSrc(f, "faction_check_mob", [live(L)])) || isEqual(rt.fv(f, "stat", live(L)), 2)))) {
			f.dot = rt.modify(live(f.dot), live(L), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/try_bloodattack  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:209)
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/try_bloodattack", function try_bloodattack(f: Frame) {
	let targets: Value = null;
	f.vars = () => [targets];
	if (truthy(rt.getLen(f, (targets = rt.callSrc(f, "get_mobs_on_blood", []))))) {
		rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/bloodattack"), live(targets), rt.op(f, "Prob", [], [50])]);
		return 1;
	}
	return 0;
});

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/bloodattack  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:217)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/bloodattack", function* bloodattack(f: Frame, targets: Value, handedness: Value) {
	let target_one: Value = null, target_one_turf: Value = null, target_two: Value = null, target_two_turf: Value = null, pools: Value = null, poolstwo: Value = null;
	f.vars = () => [targets, handedness, target_one, target_one_turf, target_two, target_two_turf, pools, poolstwo];
	target_one = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(targets)]));
	target_one_turf = rt.getStep(f, live(target_one), 0);
	target_two = null;
	if (truthy(rt.len(f, live(targets)))) {
		target_two = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(targets)]));
		target_two_turf = rt.getStep(f, live(target_two), 0);
		if ((!isEqual(rt.fv(f, "stat", live(target_two)), 0) || truthy(rt.op(f, "Prob", [], [10])))) {
			yield* g.srcCall(f, "bloodgrab", live(target_two_turf), live(handedness));
		} else {
			yield* g.srcCall(f, "bloodsmack", live(target_two_turf), live(handedness));
		}
	}
	if (truthy(live(target_one))) {
		if (truthy(rt.getLen(f, (pools = (yield* g.srcCall(f, "get_pools", rt.getStep(f, live(target_one), 0), 0)))))) {
			if (truthy((target_one_turf = rt.getStep(f, live(target_one), 0)))) {
				if ((!isEqual(rt.fv(f, "stat", live(target_one)), 0) || truthy(rt.op(f, "Prob", [], [10])))) {
					yield* g.srcCall(f, "bloodgrab", live(target_one_turf), (!truthy(live(handedness)) ? 1 : 0));
				} else {
					yield* g.srcCall(f, "bloodsmack", live(target_one_turf), (!truthy(live(handedness)) ? 1 : 0));
				}
			}
		}
	}
	if (!(!truthy(live(target_two)) && truthy(live(target_one)))) return f.dot;
	if (!truthy(rt.getLen(f, (poolstwo = (yield* g.srcCall(f, "get_pools", rt.getStep(f, live(target_one), 0), 0)))))) return f.dot;
	if (!truthy((target_one_turf = rt.getStep(f, live(target_one), 0)))) return f.dot;
	if ((!isEqual(rt.fv(f, "stat", live(target_one)), 0) || truthy(rt.op(f, "Prob", [], [10])))) {
		yield* g.srcCall(f, "bloodgrab", live(target_one_turf), live(handedness));
	} else {
		yield* g.srcCall(f, "bloodsmack", live(target_one_turf), live(handedness));
	}
	return f.dot;
}, true, { argTypes: [{ path: "/list" }, {  }] });

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/bloodsmack  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:250)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/bloodsmack", function* bloodsmack(f: Frame, _T: Value, handedness: Value) {
	let L: Value = null, limb_to_hit: Value = null;
	let $e: any;
	f.vars = () => [_T, handedness, L, limb_to_hit, $e];
	if (truthy(live(handedness))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/bubblegum_hands/rightsmack"), [live(_T)]);
	} else {
		yield* g.new_(f, T("/obj/effect/temp_visual/bubblegum_hands/leftsmack"), [live(_T)]);
	}
	yield* g.call(f, P("/proc/sleep"), null, [2.5]);
	L = null;
	rt.forList(f, 0, live(_T), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (!truthy((yield* g.srcCall(f, "faction_check_mob", live(L))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='userdanger'>＀ rends you!</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.sv(f, "attack_sound"), 100, 1, -1]);
			limb_to_hit = (yield* g.callName(f, live(L), "get_bodypart", [rt.op(f, "PickUnweighted", [6], ["head", "chest", "r_arm", "l_arm", "r_leg", "l_leg"])]));
			yield* g.callName(f, live(L), "apply_damage", [25, "brute", live(limb_to_hit), (yield* g.callName(f, live(L), "run_armor_check", [live(limb_to_hit), "melee", null, null, rt.sv(f, "armour_penetration")]))]);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [3]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/bloodgrab  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:264)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/bloodgrab", function* bloodgrab(f: Frame, _T: Value, handedness: Value) {
	let L: Value = null, targetturf: Value = null;
	let $e: any;
	f.vars = () => [_T, handedness, L, targetturf, $e];
	if (truthy(live(handedness))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/bubblegum_hands/rightpaw"), [live(_T)]);
		yield* g.new_(f, T("/obj/effect/temp_visual/bubblegum_hands/rightthumb"), [live(_T)]);
	} else {
		yield* g.new_(f, T("/obj/effect/temp_visual/bubblegum_hands/leftpaw"), [live(_T)]);
		yield* g.new_(f, T("/obj/effect/temp_visual/bubblegum_hands/leftthumb"), [live(_T)]);
	}
	yield* g.call(f, P("/proc/sleep"), null, [6]);
	L = null;
	rt.forList(f, 0, live(_T), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (!truthy((yield* g.srcCall(f, "faction_check_mob", live(L))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='userdanger'>＀ drags you through the blood!</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/magic/enter_blood.ogg"), 100, 1, -1]);
			targetturf = rt.getStep(f, live(f.src), rt.sv(f, "dir"));
			yield* g.callName(f, live(L), "forceMove", [live(targetturf)]);
			yield* g.call(f, P("/proc/playsound"), null, [live(targetturf), rt.rsc("sound/magic/exit_blood.ogg"), 100, 1, -1]);
			if (!isEqual(rt.fv(f, "stat", live(L)), 0)) {
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/proc/devour"), live(L)])), 2]);
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/blood_warp  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:309)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/blood_warp", function* blood_warp(f: Frame) {
	let can_jaunt: Value = null, pools: Value = null, pools_to_remove: Value = null, DA: Value = null, oldtransform: Value = null, found_bloodpool: Value = null;
	f.vars = () => [can_jaunt, pools, pools_to_remove, DA, oldtransform, found_bloodpool];
	if (truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "target"))))) {
		return 0;
	}
	if (!truthy(rt.getLen(f, (can_jaunt = (yield* g.srcCall(f, "get_pools", rt.getStep(f, live(f.src), 0), 1)))))) {
		return 0;
	}
	pools = (yield* g.srcCall(f, "get_pools", rt.getStep(f, rt.sv(f, "target"), 0), 2));
	(pools = rt.modify(live(pools), (pools_to_remove = (yield* g.srcCall(f, "get_pools", rt.getStep(f, rt.sv(f, "target"), 0), 1))), subtract));
	if (!truthy(rt.len(f, live(pools)))) {
		return 0;
	}
	rt.setFv(f, "color", (DA = (yield* g.new_(f, T("/obj/effect/temp_visual/decoy"), [rt.sv(f, "loc"), live(f.src)]))), "#FF0000");
	oldtransform = rt.fv(f, "transform", live(DA));
	rt.setFv(f, "transform", live(DA), multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 2));
	rt.op(f, "Animate", [2, 10], [null, live(DA), "alpha", 255, "color", rt.initial(f, live(DA), "color"), "transform", live(oldtransform), "time", 3]);
	yield* g.call(f, P("/proc/sleep"), null, [3]);
	yield* g.call(f, P("/proc/qdel"), null, [live(DA)]);
	found_bloodpool = null;
	pools = (yield* g.srcCall(f, "get_pools", rt.getStep(f, rt.sv(f, "target"), 0), 2));
	(pools = rt.modify(live(pools), (pools_to_remove = (yield* g.srcCall(f, "get_pools", rt.getStep(f, rt.sv(f, "target"), 0), 1))), subtract));
	if (truthy(rt.len(f, live(pools)))) {
		yield* g.call(f, P("/proc/shuffle_inplace"), null, [live(pools)]);
		found_bloodpool = rt.op(f, "PickUnweighted", [1], [live(pools)]);
	}
	if (truthy(live(found_bloodpool))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ sinks into the blood...</span>", [live(f.src)]));
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/enter_blood.ogg"), 100, 1, -1]);
		yield* g.srcCall(f, "forceMove", rt.getStep(f, live(found_bloodpool), 0));
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/exit_blood.ogg"), 100, 1, -1]);
		yield* g.srcCall(f, "visible_message", "<span class='danger'>And springs back out!</span>");
		return 1;
	}
	return 0;
}, true);

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/get_pools  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:346)
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/get_pools", function get_pools(f: Frame, _T: Value, range: Value) {
	let nearby: Value = null;
	let $e: any;
	f.vars = () => [nearby, $e];
	f.dot = rt.list();
	nearby = null;
	rt.forList(f, 0, rt.call(f, P("/proc/view"), null, [live(_T), live(range)]), T("/obj/effect/decal/cleanable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		nearby = $e;
		if (truthy(rt.callName(f, live(nearby), "can_bloodcrawl_in", []))) {
			f.dot = rt.modify(live(f.dot), live(nearby), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/blood_spray  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:352)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/blood_spray", function* blood_spray(f: Frame) {
	let range: Value = null, previousturf: Value = null, J: Value = null, targetdir: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [range, previousturf, J, targetdir, i, $e];
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ sprays a stream of gore!</span>", [live(f.src)]));
	range = add(6, (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "anger_modifier"), 0.4000000059604645)])));
	previousturf = rt.getStep(f, live(f.src), 0);
	J = live(previousturf);
	targetdir = rt.getDir(f, live(f.src), rt.sv(f, "target"));
	if (isEqual(rt.fv(f, "loc", rt.sv(f, "target")), rt.sv(f, "loc"))) {
		targetdir = rt.sv(f, "dir");
	}
	yield* g.srcCall(f, "face_atom", rt.sv(f, "target"));
	yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/bubblegum"), [live(J)]);
	i = null;
	rt.forRange(f, 0, 1, live(range), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		J = rt.getStep(f, live(previousturf), live(targetdir));
		yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/bloodsplatter"), [live(previousturf), rt.getDir(f, live(previousturf), live(J))]);
		yield* g.call(f, P("/proc/playsound"), null, [live(previousturf), rt.rsc("sound/effects/splat.ogg"), 100, 1, -1]);
		if (((!truthy(live(J)) || !truthy(rt.fv(f, "atmos_adjacent_turfs", live(previousturf)))) || !truthy(rt.index(rt.fv(f, "atmos_adjacent_turfs", live(previousturf)), live(J))))) {
			break;
		}
		yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/bubblegum"), [live(J)]);
		previousturf = live(J);
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/bubblegum/proc/slaughterlings  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:378)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/slaughterlings", function* slaughterlings(f: Frame) {
	let max_amount: Value = null, H: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [max_amount, H, B, $e];
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ summons a shoal of slaughterlings!</span>", [live(f.src)]));
	max_amount = 6;
	H = null;
	rt.forList(f, 0, (yield* g.srcCall(f, "get_pools", rt.getStep(f, live(f.src), 0), 1)));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (!truthy(live(max_amount))) {
			break;
		}
		max_amount = rt.inc(live(max_amount), -1);
		yield* g.new_(f, T("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/slaughter"), [rt.gv(f, "loc", (B = live(H)))]);
	}
	rt.endFor(f, 0);
	return live(max_amount);
}, true);

rt.type(5001, "/mob/living/simple_animal/hostile/asteroid/hivelordbrood/slaughter", "/mob/living/simple_animal/hostile/asteroid/hivelordbrood", {
	name: "slaughterling",
	desc: "Though not yet strong enough to create a true physical form, it's nonetheless determined to murder you.",
	icon_state: "bloodbrood",
	icon_living: "bloodbrood",
	icon_aggro: "bloodbrood",
	attacktext: "pierces",
	color: "#C80000",
	density: 0,
	faction: null,
	weather_immunities: null,
});

// /mob/living/simple_animal/hostile/asteroid/hivelordbrood/slaughter/proc/CanPass  (code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm:401)
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/slaughter/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if (truthy((rt.istype(live(mover), T("/mob/living/simple_animal/hostile/megafauna/bubblegum")) ? 1 : 0))) {
		return 1;
	}
	return 0;
});
