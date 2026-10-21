// From code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5022, "/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner", "/mob/living/simple_animal/hostile/megafauna", {
	miner_saw: null,
	time_until_next_transform: null,
	dashing: 0,
	dash_cooldown: 15,
	light_color: "#E4C7C5",
	move_to_delay: 3,
	projectilesound: rt.rsc("sound/weapons/kenetic_accel.ogg"),
	ranged: 1,
	stat_attack: 1,
	name: "blood-drunk miner",
	desc: "A miner destined to wander forever, engaged in an endless hunt.",
	health: 900,
	maxHealth: 900,
	icon_state: "miner",
	icon_living: "miner",
	icon: rt.rsc("icons/mob/broadMobs.dmi"),
	movement_type: 1,
	speak_emote: null,
	speed: 1,
	projectiletype: rt.typePath("/obj/item/projectile/kinetic/miner"),
	pixel_x: -16,
	crusher_loot: null,
	loot: null,
	wander: 0,
	del_on_death: 1,
	blood_volume: 560,
	medal_type: "Blood-drunk Miner",
	deathmessage: "falls to the ground, decaying into glowing particles.",
	death_sound: "bodyfall",
});

// /mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:33)
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("roars"));
	$0 = $0;
	rt.setSv(f, "crusher_loot", rt.list(T("/obj/item/weapon/melee/transforming/cleaving_saw"), T("/obj/item/weapon/gun/energy/kinetic_accelerator"), T("/obj/item/crusher_trophy/miner_eye")));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/item/weapon/melee/transforming/cleaving_saw"), T("/obj/item/weapon/gun/energy/kinetic_accelerator")));
	return f.dot;
});

rt.type(5694, "/obj/item/weapon/melee/transforming/cleaving_saw/miner", "/obj/item/weapon/melee/transforming/cleaving_saw", {
	force_on: 10,
	force: 6,
});

// /obj/item/weapon/melee/transforming/cleaving_saw/miner/proc/attack  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:59)  may sleep
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/miner/proc/attack", function* attack(f: Frame) {
	let target_knockdown_amount: Value = null, new_knockdown: Value = null;
	f.vars = () => [target_knockdown_amount, new_knockdown];
	target_knockdown_amount = (yield* g.callName(f, live(f.args[0]), "AmountKnockdown", []));
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual((new_knockdown = (yield* g.callName(f, live(f.args[0]), "AmountKnockdown", []))), live(target_knockdown_amount))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "SetKnockdown", [null, (yield* g.call(f, P("/proc/max"), null, [live(target_knockdown_amount), 6])), "ignore_canknockdown", 1], rt.Args.Named);
	return f.dot;
}, true, { args: ["target", "user"] });

// /mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:72)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "internal", (yield* g.new_(f, T("/obj/item/device/gps/internal/miner"), [live(f.src)])));
	rt.setSv(f, "miner_saw", (yield* g.new_(f, T("/obj/item/weapon/melee/transforming/cleaving_saw/miner"), [live(f.src)])));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:77)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/adjustHealth", function* adjustHealth(f: Frame) {
	let adjustment_amount: Value = null;
	f.vars = () => [adjustment_amount];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	adjustment_amount = multiply(live(f.args[0]), 0.15000000596046448);
	if (rt.gt(add(rt.worldTime(f), live(adjustment_amount)), rt.sv(f, "next_move"))) {
		yield* g.srcCall(f, "changeNext_move", live(adjustment_amount));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/death  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:83)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/death", function* death(f: Frame) {
	if (rt.gt(rt.sv(f, "health"), 0)) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/miner_death"), [rt.sv(f, "loc"), rt.sv(f, "dir")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/Move  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:89)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/Move", function* Move(f: Frame) {
	if ((truthy(rt.sv(f, "dashing")) || ((truthy(live(f.args[0])) && isEqual(rt.fv(f, "z", live(f.args[0])), rt.sv(f, "z"))) && (truthy((rt.istype(live(f.args[0]), T("/turf/open/floor/plating/lava")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/turf/open/chasm")) ? 1 : 0)))))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["newloc"] });

// /mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/ex_act  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:94)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/ex_act", function* ex_act(f: Frame) {
	if (truthy((yield* g.srcCall(f, "dash")))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["severity", "target"], waitfor: false });

// /mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:99)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if ((!truthy(rt.sv(f, "target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "target"))))) {
		return live(f.dot);
	}
	if ((rt.gt(rt.sv(f, "next_move"), rt.worldTime(f)) || !truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "target")))))) {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/quick_attack_loop")]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "face_atom", rt.sv(f, "target"));
	if (truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "stat", (L = rt.sv(f, "target"))), 2)) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ butchers ＀!</span>", [live(f.src), live(L)]), fmt("<span class='userdanger'>You butcher ＀, restoring your health!</span>", [live(L)]));
			if ((!isEqual(rt.sv(f, "z"), 2) && !truthy(rt.sv(f, "client")))) {
				yield* g.srcCall(f, "adjustBruteLoss", divide(rt.neg(rt.fv(f, "maxHealth", live(L))), 2));
			}
			yield* g.callName(f, live(L), "gib", []);
			return 1;
		}
	}
	yield* g.srcCall(f, "changeNext_move", 8);
	yield* g.callName(f, rt.sv(f, "miner_saw"), "melee_attack_chain", [live(f.src), rt.sv(f, "target")]);
	yield* g.srcCall(f, "transform_weapon");
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/quick_attack_loop")]);
	if (truthy(rt.op(f, "Prob", [], [10]))) {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/dash")]);
	}
	return 1;
}, true);

// /mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/do_attack_animation  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:123)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/do_attack_animation", function* do_attack_animation(f: Frame) {
	if (!truthy(live(f.args[2]))) {
		f.args[2] = rt.sv(f, "miner_saw");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A", "visual_effect_icon", "used_item", "no_effect", "end_pixel_y"] });

// /mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/GiveTarget  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:128)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/GiveTarget", function* GiveTarget(f: Frame) {
	let targets_the_same: Value = null;
	f.vars = () => [targets_the_same];
	targets_the_same = (isEqual(live(f.args[0]), rt.sv(f, "target")) ? 1 : 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy(live(f.dot)) && truthy(rt.sv(f, "target"))) && !truthy(live(targets_the_same)))) return f.dot;
	rt.setSv(f, "wander", 1);
	yield* g.srcCall(f, "transform_weapon");
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/quick_attack_loop")]);
	return f.dot;
}, true, { args: ["new_target"] });

// /mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/OpenFire  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:136)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/OpenFire", function* OpenFire(f: Frame) {
	yield* g.srcCall(f, "Goto", rt.sv(f, "target"), rt.sv(f, "move_to_delay"), rt.sv(f, "minimum_distance"));
	if ((rt.ge((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "target")])), 4) && rt.ge(rt.worldTime(f), rt.sv(f, "dash_cooldown")))) {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/dash"), rt.sv(f, "target")]);
	} else {
		if (rt.le(rt.sv(f, "next_move"), rt.worldTime(f))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ fires the proto-kinetic accelerator!</span>", [live(f.src)]));
			yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/firing_effect"), [rt.sv(f, "loc"), rt.sv(f, "dir")]);
			yield* g.srcCall(f, "face_atom", rt.sv(f, "target"));
			yield* g.srcCall(f, "Shoot", rt.sv(f, "target"));
			yield* g.srcCall(f, "changeNext_move", 4);
		}
	}
	yield* g.srcCall(f, "transform_weapon");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/quick_attack_loop  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:148)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/quick_attack_loop", function* quick_attack_loop(f: Frame) {
	if (rt.le(rt.sv(f, "next_move"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		yield* g.callSelf(f, []);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/sleep"), null, [multiply(subtract(rt.sv(f, "next_move"), rt.worldTime(f)), 1.5)]);
	if ((!truthy(rt.sv(f, "target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "target"))))) {
		return live(f.dot);
	}
	if (((truthy(rt.sv(f, "dashing")) || rt.gt(rt.sv(f, "next_move"), rt.worldTime(f))) || !truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "target")))))) {
		if ((truthy(rt.sv(f, "dashing")) && rt.le(rt.sv(f, "next_move"), rt.worldTime(f)))) {
			rt.setSv(f, "next_move", add(rt.worldTime(f), 1));
		}
		yield* g.callSelf(f, []);
		return live(f.dot);
	}
	yield* g.srcCall(f, "AttackingTarget");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/dash  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:163)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/dash", function* dash(f: Frame, dash_target: Value) {
	let accessable_turfs: Value = null, self_dist_to_target: Value = null, own_turf: Value = null, O: Value = null, turf_dist_to_target: Value = null, valid: Value = null, _T: Value = null, target_turf: Value = null, closest_dist: Value = null, t: Value = null, step_back_turf: Value = null, step_forward_turf: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [dash_target, accessable_turfs, self_dist_to_target, own_turf, O, turf_dist_to_target, valid, _T, target_turf, closest_dist, t, step_back_turf, step_forward_turf, D, $e];
	if (rt.lt(rt.worldTime(f), rt.sv(f, "dash_cooldown"))) {
		return live(f.dot);
	}
	rt.setSv(f, "dash_cooldown", add(rt.worldTime(f), rt.initial(f, live(f.src), "dash_cooldown")));
	accessable_turfs = rt.list();
	self_dist_to_target = 0;
	own_turf = rt.getStep(f, live(f.src), 0);
	if (!(!truthy(rt.sv(f, "target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "target"))))) {
		self_dist_to_target = rt.modify(live(self_dist_to_target), (yield* g.call(f, P("/proc/get_dist"), null, [live(dash_target), live(own_turf)])), add);
	}
	O = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(own_turf)), 4), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(own_turf)), 4), 1])), rt.fv(f, "z", live(own_turf))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(own_turf)), 4), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(own_turf)), 4), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(own_turf)))])), T("/turf/open"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		turf_dist_to_target = 0;
		if (!(!truthy(live(dash_target)) || truthy(rt.fv(f, "gc_destroyed", live(dash_target))))) {
			turf_dist_to_target = rt.modify(live(turf_dist_to_target), (yield* g.call(f, P("/proc/get_dist"), null, [live(dash_target), live(O)])), add);
		}
		if (((((rt.ge((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(O)])), 4) && rt.le(live(turf_dist_to_target), live(self_dist_to_target))) && !truthy((rt.istype(live(O), T("/turf/open/floor/plating/lava")) ? 1 : 0))) && !truthy((rt.istype(live(O), T("/turf/open/chasm")) ? 1 : 0))) && ((!truthy(live(dash_target)) || truthy(rt.fv(f, "gc_destroyed", live(dash_target)))) || !truthy((yield* g.callName(f, live(O), "Adjacent", [live(dash_target)])))))) {
			valid = 1;
			_T = null;
			rt.forList(f, 1, (yield* g.call(f, P("/proc/getline"), null, [live(own_turf), live(O)])), T("/turf"));
			while (($e = rt.next(f, 1)) !== undefined) {
				_T = $e;
				if (truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(_T), 1])))) {
					valid = 0;
					continue;
				}
			}
			rt.endFor(f, 1);
			if (truthy(live(valid))) {
				rt.setAt(live(accessable_turfs), live(O), live(turf_dist_to_target));
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.length(live(accessable_turfs)))) {
		return live(f.dot);
	}
	target_turf = null;
	if (!(!truthy(rt.sv(f, "target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "target"))))) {
		closest_dist = 4;
		t = null;
		rt.forList(f, 0, live(accessable_turfs));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			if (rt.lt(rt.index(live(accessable_turfs), live(t)), live(closest_dist))) {
				closest_dist = rt.index(live(accessable_turfs), live(t));
			}
		}
		rt.endFor(f, 0);
		t = null;
		rt.forList(f, 0, live(accessable_turfs));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			rt.setAt(live(accessable_turfs), live(t), multiply(subtract(rt.index(live(accessable_turfs), live(t)), live(closest_dist)), 10));
		}
		rt.endFor(f, 0);
		target_turf = (yield* g.call(f, P("/proc/pickweight"), null, [live(accessable_turfs)]));
	} else {
		target_turf = rt.op(f, "PickUnweighted", [1], [live(accessable_turfs)]);
	}
	step_back_turf = rt.getStep(f, live(target_turf), (yield* g.call(f, P("/proc/get_cardinal_dir"), null, [live(target_turf), live(own_turf)])));
	step_forward_turf = rt.getStep(f, live(own_turf), (yield* g.call(f, P("/proc/get_cardinal_dir"), null, [live(own_turf), live(target_turf)])));
	yield* g.new_(f, T("/obj/effect/temp_visual/small_smoke/halfsecond"), [live(step_back_turf)]);
	yield* g.new_(f, T("/obj/effect/temp_visual/small_smoke/halfsecond"), [live(step_forward_turf)]);
	D = (yield* g.new_(f, T("/obj/effect/temp_visual/decoy/fading/halfsecond"), [live(own_turf), live(f.src)]));
	yield* g.srcCall(f, "forceMove", live(step_back_turf));
	yield* g.call(f, P("/proc/playsound"), null, [live(own_turf), rt.rsc("sound/weapons/punchmiss.ogg"), 40, 1, -1]);
	rt.setSv(f, "dashing", 1);
	rt.setSv(f, "alpha", 0);
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "alpha", 255, "time", 5]);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	yield* g.callName(f, live(D), "forceMove", [live(step_forward_turf)]);
	yield* g.srcCall(f, "forceMove", live(target_turf));
	yield* g.call(f, P("/proc/playsound"), null, [live(target_turf), rt.rsc("sound/weapons/punchmiss.ogg"), 40, 1, -1]);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	rt.setSv(f, "dashing", 0);
	return 1;
}, true, { argTypes: [{ path: "/atom" }] });

// /mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/transform_weapon  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:216)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/transform_weapon", function* transform_weapon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!rt.le(rt.sv(f, "time_until_next_transform"), rt.worldTime(f))) return f.dot;
	rt.setFv(f, "transform_cooldown", rt.sv(f, "miner_saw"), 0);
	yield* g.callName(f, rt.sv(f, "miner_saw"), "transform_weapon", [live(f.src), 1]);
	if (truthy(rt.fv(f, "active", rt.sv(f, "miner_saw")))) {
		$0 = "_transformed";
	} else {
		$0 = "";
	}
	rt.setSv(f, "icon_state", fmt("miner＀", [$0]));
	if (truthy(rt.fv(f, "active", rt.sv(f, "miner_saw")))) {
		$0 = "_transformed";
	} else {
		$0 = "";
	}
	rt.setSv(f, "icon_living", fmt("miner＀", [$0]));
	rt.setSv(f, "time_until_next_transform", add(rt.worldTime(f), (yield* g.call(f, P("/proc/rand"), null, [50, 100]))));
	return f.dot;
}, true);

rt.type(11618, "/obj/effect/temp_visual/dir_setting/miner_death", "/obj/effect/temp_visual/dir_setting", {
	icon_state: "miner_death",
	duration: 10,
});

// /obj/effect/temp_visual/dir_setting/miner_death/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:228)  may sleep
rt.def("/obj/effect/temp_visual/dir_setting/miner_death/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/temp_visual/dir_setting/miner_death/proc/fade_out")]);
	return f.dot;
}, true, { args: ["mapload", "set_dir"] });

// /obj/effect/temp_visual/dir_setting/miner_death/proc/fade_out  (code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm:232)  may sleep
rt.def("/obj/effect/temp_visual/dir_setting/miner_death/proc/fade_out", function* fade_out(f: Frame) {
	let M: Value = null, final_dir: Value = null;
	f.vars = () => [M, final_dir];
	yield* g.callName(f, (M = (yield* g.new_(f, T("/matrix"), []))), "Turn", [rt.op(f, "PickUnweighted", [2], [90, 270])]);
	final_dir = rt.sv(f, "dir");
	if (truthy(rt.bitAnd(rt.sv(f, "dir"), 12))) {
		final_dir = rt.op(f, "PickUnweighted", [2], [1, 2]);
	}
	rt.op(f, "Animate", [2, 12], [null, live(f.src), "transform", live(M), "pixel_y", -6, "dir", live(final_dir), "time", 2, "easing", 192]);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	rt.op(f, "Animate", [2, 10], [null, live(f.src), "color", rt.list("#A7A19E", "#A7A19E", "#A7A19E", rt.list(0, 0, 0)), "time", 8, "easing", 64, "flags", 4]);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	rt.op(f, "Animate", [2, 10], [null, live(f.src), "alpha", 0, "time", 6, "easing", 128, "flags", 4]);
	return f.dot;
}, true);
