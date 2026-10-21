// From code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5027, "/mob/living/simple_animal/hostile/megafauna/hierophant", "/mob/living/simple_animal/hostile/megafauna", {
	burst_range: 3,
	beam_range: 5,
	chaser_speed: 3,
	chaser_cooldown: 101,
	major_attack_cooldown: 60,
	arena_cooldown: 200,
	blinking: 0,
	spawned_beacon: null,
	timeout_time: 15,
	did_reset: 1,
	kill_phrases: null,
	target_phrases: null,
	move_to_delay: 10,
	ranged: 1,
	ranged_cooldown_time: 40,
	aggro_vision_range: 21,
	name: "hierophant",
	desc: "A massive metal club that hangs in the air as though waiting. It'll make you dance to its beat.",
	health: 2500,
	maxHealth: 2500,
	attacktext: "clubs",
	attack_sound: rt.rsc("sound/weapons/sonic_jackhammer.ogg"),
	icon_state: "hierophant",
	icon_living: "hierophant",
	friendly: "stares down",
	icon: rt.rsc("icons/mob/lavaland/hierophant_new.dmi"),
	faction: null,
	speak_emote: null,
	armour_penetration: 50,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	speed: 1,
	loot: null,
	wander: 0,
	medal_type: "Hierophant",
	score_type: "Hierophants Killed",
	del_on_death: 1,
	death_sound: rt.rsc("sound/magic/repulse.ogg"),
});

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:49)
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "kill_phrases", rt.list("Wsyvgi sj irivkc xettih. Vitemvmrk...", "Irivkc wsyvgi jsyrh. Vitemvmrk...", "Jyip jsyrh. Egxmzexmrk vitemv gcgpiw...", "Kix fiex. Liepmrk..."));
	rt.setSv(f, "target_phrases", rt.list("Xevkix psgexih.", "Iriqc jsyrh.", "Eguymvih xevkix."));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("boss"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("preaches"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/item/weapon/hierophant_club")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:79)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "internal", (yield* g.new_(f, T("/obj/item/device/gps/internal/hierophant"), [live(f.src)])));
	rt.setSv(f, "spawned_beacon", (yield* g.new_(f, T("/obj/effect/hierophant"), [rt.sv(f, "loc")])));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/spawn_crusher_loot  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:84)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/spawn_crusher_loot", function* spawn_crusher_loot(f: Frame) {
	yield* g.new_(f, T("/obj/item/crusher_trophy/vortex_talisman"), [rt.getStep(f, rt.sv(f, "spawned_beacon"), 0)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/Life  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:87)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/Life", function* Life(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(((truthy(live(f.dot)) && truthy(rt.sv(f, "spawned_beacon"))) && !(!truthy(rt.sv(f, "spawned_beacon")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "spawned_beacon"))))) && !truthy(rt.sv(f, "client")))) return f.dot;
	if ((truthy(rt.sv(f, "target")) || isEqual(rt.sv(f, "loc"), rt.fv(f, "loc", rt.sv(f, "spawned_beacon"))))) {
		rt.setSv(f, "timeout_time", rt.initial(f, live(f.src), "timeout_time"));
	} else {
		rt.incSrcVar(f, "timeout_time", -1, true);
	}
	if (!(rt.le(rt.sv(f, "timeout_time"), 0) && !truthy(rt.sv(f, "did_reset")))) return f.dot;
	rt.setSv(f, "did_reset", 1);
	yield* g.srcCall(f, "visible_message", "<span class='hierophant_warning'>\"Vixyvrmrk xs fewi...\"</span>");
	yield* g.srcCall(f, "blink", rt.sv(f, "spawned_beacon"));
	yield* g.srcCall(f, "adjustHealth", (yield* g.call(f, P("/proc/min"), null, [multiply(subtract(rt.sv(f, "health"), rt.sv(f, "maxHealth")), 0.5), -250])));
	rt.setSv(f, "wander", 0);
	if (rt.gt(rt.sv(f, "health"), multiply(rt.sv(f, "maxHealth"), 0.8999999761581421))) {
		yield* g.srcCall(f, "visible_message", "<span class='hierophant'>\"Vitemvw gsqtpixi. Stivexmrk ex qebmqyq ijjmgmirgc.\"</span>");
	} else {
		yield* g.srcCall(f, "visible_message", "<span class='hierophant'>\"Vitemvw gsqtpixi. Stivexmsrep ijjmgmirgc gsqtvsqmwih.\"</span>");
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/death  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:105)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/death", function* death(f: Frame) {
	if ((rt.gt(rt.sv(f, "health"), 0) || isEqual(rt.sv(f, "stat"), 2))) {
		return live(f.dot);
	} else {
		rt.setSv(f, "stat", 2);
		rt.setSv(f, "blinking", 1);
		rt.setSv(f, "burst_range", 10);
		yield* g.srcCall(f, "visible_message", "<span class='hierophant'>\"Mrmxmexmrk wipj-hiwxvygx wiuyirgi...\"</span>");
		yield* g.srcCall(f, "visible_message", fmt("<span class='hierophant_warning'>＀ shrinks, releasing a massive burst of energy!</span>", [live(f.src)]));
		yield* g.srcCall(f, "burst", rt.getStep(f, live(f.src), 0));
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:117)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "spawned_beacon")]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/devour  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:121)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/devour", function* devour(f: Frame, L: Value) {
	let W: Value = null;
	let $e: any;
	f.vars = () => [L, W, $e];
	W = null;
	rt.forList(f, 0, live(L), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		if (!truthy((yield* g.callName(f, live(L), "dropItemToGround", [live(W)])))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(W)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "visible_message", fmt("<span class='hierophant_warning'>\"＀\"</span>", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "kill_phrases")])]));
	yield* g.srcCall(f, "visible_message", fmt("<span class='hierophant_warning'>＀ annihilates ＀!</span>", [live(f.src), live(L)]), fmt("<span class='userdanger'>You annihilate ＀, restoring your health!</span>", [live(L)]));
	yield* g.srcCall(f, "adjustHealth", multiply(rt.neg(rt.fv(f, "maxHealth", live(L))), 0.5));
	yield* g.callName(f, live(L), "dust", []);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/CanAttack  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:130)
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/CanAttack", function CanAttack(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/hostile/asteroid/hivelordbrood")) ? 1 : 0))) return f.dot;
	return 0;
}, false, { args: ["the_target"] });

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/GiveTarget  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:135)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/GiveTarget", function* GiveTarget(f: Frame) {
	let targets_the_same: Value = null;
	f.vars = () => [targets_the_same];
	targets_the_same = (isEqual(live(f.args[0]), rt.sv(f, "target")) ? 1 : 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy(live(f.dot)) && truthy(rt.sv(f, "target"))) && !truthy(live(targets_the_same)))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='hierophant_warning'>\"＀\"</span>", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "target_phrases")])]));
	if (!((truthy(rt.sv(f, "spawned_beacon")) && isEqual(rt.sv(f, "loc"), rt.fv(f, "loc", rt.sv(f, "spawned_beacon")))) && truthy(rt.sv(f, "did_reset")))) return f.dot;
	yield* g.srcCall(f, "arena_trap", live(f.src));
	return f.dot;
}, true, { args: ["new_target"] });

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:143)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy(live(f.src)) && rt.gt(live(f.dot), 0)) && !truthy(rt.sv(f, "blinking")))) return f.dot;
	rt.setSv(f, "wander", 1);
	rt.setSv(f, "did_reset", 0);
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:149)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (truthy(rt.sv(f, "blinking"))) return f.dot;
	if ((truthy(rt.sv(f, "target")) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/melee_blast"), rt.getStep(f, rt.sv(f, "target"), 0)]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/DestroySurroundings  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:155)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/DestroySurroundings", function* DestroySurroundings(f: Frame) {
	if (truthy(rt.sv(f, "blinking"))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/Move  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:159)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/Move", function* Move(f: Frame) {
	let prevloc: Value = null, HS: Value = null;
	f.vars = () => [prevloc, HS];
	if (truthy(rt.sv(f, "blinking"))) return f.dot;
	prevloc = rt.sv(f, "loc");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(!truthy(rt.sv(f, "stat")) && truthy(live(f.dot)))) return f.dot;
	rt.setFv(f, "dir", (HS = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/squares"), [live(prevloc)]))), rt.sv(f, "dir"));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/mecha/mechmove04.ogg"), 150, 1, -4]);
	if (!truthy(rt.sv(f, "target"))) return f.dot;
	yield* g.srcCall(f, "arena_trap", rt.sv(f, "target"));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/Goto  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:171)
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/Goto", function Goto(f: Frame) {
	rt.setSv(f, "wander", 1);
	if (truthy(rt.sv(f, "blinking"))) return f.dot;
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["target", "delay", "minimum_distance"] });

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/calculate_rage  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:176)
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/calculate_rage", function calculate_rage(f: Frame) {
	rt.setSv(f, "did_reset", 0);
	rt.setSv(f, "anger_modifier", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [divide(subtract(rt.sv(f, "maxHealth"), rt.sv(f, "health")), 42), 50])]));
	rt.setSv(f, "burst_range", add(rt.initial(f, live(f.src), "burst_range"), rt.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "anger_modifier"), 0.07999999821186066)])));
	rt.setSv(f, "beam_range", add(rt.initial(f, live(f.src), "beam_range"), rt.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "anger_modifier"), 0.11999999731779099)])));
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/OpenFire  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:181)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/OpenFire", function* OpenFire(f: Frame) {
	let target_slowness: Value = null, L: Value = null, possibilities: Value = null, cross_counter: Value = null, blink_counter: Value = null, oldcolor: Value = null, targets: Value = null, cardinal_copy: Value = null, pickedtarget: Value = null, C: Value = null, C_1: Value = null, OC: Value = null;
	let $0: any;
	f.vars = () => [target_slowness, L, possibilities, cross_counter, blink_counter, oldcolor, targets, cardinal_copy, pickedtarget, C, C_1, OC, $0];
	yield* g.srcCall(f, "calculate_rage");
	if (truthy(rt.sv(f, "blinking"))) {
		return live(f.dot);
	}
	target_slowness = 0;
	if (truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) {
		L = rt.sv(f, "target");
		if (((!truthy(rt.sv(f, "blinking")) && isEqual(rt.fv(f, "stat", live(L)), 2)) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)])), 2))) {
			yield* g.srcCall(f, "blink", live(L));
			return live(f.dot);
		}
		target_slowness = rt.modify(live(target_slowness), (yield* g.callName(f, live(L), "movement_delay", [])), add);
	}
	target_slowness = (yield* g.call(f, P("/proc/max"), null, [live(target_slowness), 1]));
	rt.setSv(f, "chaser_speed", (yield* g.call(f, P("/proc/max"), null, [1, add(subtract(3, multiply(rt.sv(f, "anger_modifier"), 0.03999999910593033)), multiply(subtract(live(target_slowness), 1), 0.5))])));
	yield* g.srcCall(f, "arena_trap", rt.sv(f, "target"));
	rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), (yield* g.call(f, P("/proc/max"), null, [5, subtract(rt.sv(f, "ranged_cooldown_time"), multiply(rt.sv(f, "anger_modifier"), 0.75))]))));
	if (truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "anger_modifier"), 0.75)]))) {
		possibilities = rt.list();
		if (rt.gt((cross_counter = add(1, (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "anger_modifier"), 0.11999999731779099)])))), 1)) {
			possibilities = rt.modify(live(possibilities), "cross_blast_spam", add);
		}
		if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "target")])), 2)) {
			possibilities = rt.modify(live(possibilities), "blink_spam", add);
		}
		if (rt.lt(rt.sv(f, "chaser_cooldown"), rt.worldTime(f))) {
			if (truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "anger_modifier"), 2)]))) {
				possibilities = rt.list("chaser_swarm");
			} else {
				possibilities = rt.modify(live(possibilities), "chaser_swarm", add);
			}
		}
		if (truthy(rt.len(f, live(possibilities)))) {
			rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), (yield* g.call(f, P("/proc/max"), null, [5, subtract(rt.sv(f, "major_attack_cooldown"), multiply(rt.sv(f, "anger_modifier"), 0.75))]))));
			blink_counter = add(1, (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "anger_modifier"), 0.07999999821186066)])));
			$0 = rt.op(f, "PickUnweighted", [1], [live(possibilities)]);
			if ($0 === "blink_spam") {
				if ((rt.lt(rt.sv(f, "health"), multiply(rt.sv(f, "maxHealth"), 0.5)) && rt.gt(live(blink_counter), 1))) {
					yield* g.srcCall(f, "visible_message", "<span class='hierophant'>\"Mx ampp rsx iwgeti.\"</span>");
					oldcolor = rt.sv(f, "color");
					rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", "#660099", "time", 6]);
					yield* g.call(f, P("/proc/sleep"), null, [6]);
					while ((truthy(rt.sv(f, "health")) && !(!truthy(rt.sv(f, "target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "target"))))) && truthy(live(blink_counter))) {
						if ((isEqual(rt.sv(f, "loc"), rt.fv(f, "loc", rt.sv(f, "target"))) || isEqual(rt.sv(f, "loc"), rt.sv(f, "target")))) {
							break;
						}
						blink_counter = rt.inc(live(blink_counter), -1);
						rt.setSv(f, "blinking", 0);
						yield* g.srcCall(f, "blink", rt.sv(f, "target"));
						rt.setSv(f, "blinking", 1);
						yield* g.call(f, P("/proc/sleep"), null, [add(4, live(target_slowness))]);
					}
					rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(oldcolor), "time", 8]);
					yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
					yield* g.call(f, P("/proc/sleep"), null, [8]);
					rt.setSv(f, "blinking", 0);
				} else {
					yield* g.srcCall(f, "blink", rt.sv(f, "target"));
				}
			} else if ($0 === "cross_blast_spam") {
				yield* g.srcCall(f, "visible_message", "<span class='hierophant'>\"Piezi mx rsalivi xs vyr.\"</span>");
				rt.setSv(f, "blinking", 1);
				oldcolor = rt.sv(f, "color");
				rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", "#660099", "time", 6]);
				yield* g.call(f, P("/proc/sleep"), null, [6]);
				while ((truthy(rt.sv(f, "health")) && !(!truthy(rt.sv(f, "target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "target"))))) && truthy(live(cross_counter))) {
					cross_counter = rt.inc(live(cross_counter), -1);
					if (truthy(rt.op(f, "Prob", [], [60]))) {
						yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/cardinal_blasts"), rt.sv(f, "target")]);
					} else {
						yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/diagonal_blasts"), rt.sv(f, "target")]);
					}
					yield* g.call(f, P("/proc/sleep"), null, [add(6, live(target_slowness))]);
				}
				rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(oldcolor), "time", 8]);
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
				yield* g.call(f, P("/proc/sleep"), null, [8]);
				rt.setSv(f, "blinking", 0);
			} else if ($0 === "chaser_swarm") {
				yield* g.srcCall(f, "visible_message", "<span class='hierophant'>\"Mx gerrsx lmhi.\"</span>");
				rt.setSv(f, "blinking", 1);
				oldcolor = rt.sv(f, "color");
				rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", "#660099", "time", 6]);
				yield* g.call(f, P("/proc/sleep"), null, [6]);
				targets = (yield* g.srcCall(f, "ListTargets"));
				cardinal_copy = (yield* g.callName(f, rt.gl("cardinal"), "Copy", []));
				while ((truthy(rt.sv(f, "health")) && truthy(rt.len(f, live(targets)))) && truthy(rt.len(f, live(cardinal_copy)))) {
					pickedtarget = rt.op(f, "PickUnweighted", [1], [live(targets)]);
					if (rt.ge(rt.len(f, live(targets)), rt.len(f, live(cardinal_copy)))) {
						pickedtarget = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(targets)]));
					}
					if ((!truthy((rt.istype(live(pickedtarget), T("/mob/living")) ? 1 : 0)) || isEqual(rt.fv(f, "stat", live(pickedtarget)), 2))) {
						if (((!truthy((pickedtarget = rt.sv(f, "target"))) || truthy(rt.fv(f, "gc_destroyed", live(pickedtarget)))) || (truthy((rt.istype(live(pickedtarget), T("/mob/living")) ? 1 : 0)) && isEqual(rt.fv(f, "stat", live(pickedtarget)), 2)))) {
							break;
						}
					}
					rt.setFv(f, "moving", (C = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/chaser"), [rt.sv(f, "loc"), live(f.src), live(pickedtarget), rt.sv(f, "chaser_speed"), 0]))), 3);
					rt.setFv(f, "moving_dir", live(C), (yield* g.call(f, P("/proc/pick_n_take"), null, [live(cardinal_copy)])));
					yield* g.call(f, P("/proc/sleep"), null, [add(8, live(target_slowness))]);
				}
				rt.setSv(f, "chaser_cooldown", add(rt.worldTime(f), rt.initial(f, live(f.src), "chaser_cooldown")));
				rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(oldcolor), "time", 8]);
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
				yield* g.call(f, P("/proc/sleep"), null, [8]);
				rt.setSv(f, "blinking", 0);
			}
			return live(f.dot);
		}
	}
	if (rt.lt(rt.sv(f, "chaser_cooldown"), rt.worldTime(f))) {
		C_1 = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/chaser"), [rt.sv(f, "loc"), live(f.src), rt.sv(f, "target"), rt.sv(f, "chaser_speed"), 0]));
		rt.setSv(f, "chaser_cooldown", add(rt.worldTime(f), rt.initial(f, live(f.src), "chaser_cooldown")));
		if (((truthy(rt.op(f, "Prob", [], [rt.sv(f, "anger_modifier")])) || truthy((yield* g.callName(f, rt.sv(f, "target"), "Adjacent", [live(f.src)])))) && !isEqual(rt.sv(f, "target"), live(f.src)))) {
			rt.setFv(f, "moving", (OC = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/chaser"), [rt.sv(f, "loc"), live(f.src), rt.sv(f, "target"), multiply(rt.sv(f, "chaser_speed"), 1.5), 0]))), 4);
			rt.setFv(f, "moving_dir", live(OC), rt.op(f, "PickUnweighted", [1], [subtract(rt.gl("cardinal"), rt.fv(f, "moving_dir", live(C_1)))]));
		}
	} else {
		if ((truthy(rt.op(f, "Prob", [], [add(10, multiply(rt.sv(f, "anger_modifier"), 0.5))])) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "target")])), 2))) {
			yield* g.srcCall(f, "blink", rt.sv(f, "target"));
		} else {
			if (truthy(rt.op(f, "Prob", [], [subtract(70, rt.sv(f, "anger_modifier"))]))) {
				if ((truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "anger_modifier"), divide(2, live(target_slowness)))])) && rt.lt(rt.sv(f, "health"), multiply(rt.sv(f, "maxHealth"), 0.5)))) {
					yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/alldir_blasts"), rt.sv(f, "target")]);
				} else {
					if (truthy(rt.op(f, "Prob", [], [60]))) {
						yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/cardinal_blasts"), rt.sv(f, "target")]);
					} else {
						yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/diagonal_blasts"), rt.sv(f, "target")]);
					}
				}
			} else {
				yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/burst"), rt.getStep(f, live(f.src), 0)]);
			}
		}
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/diagonal_blasts  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:300)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/diagonal_blasts", function* diagonal_blasts(f: Frame, victim: Value) {
	let _T: Value = null, d: Value = null;
	let $e: any;
	f.vars = () => [victim, _T, d, $e];
	if (!truthy((_T = rt.getStep(f, live(victim), 0)))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph/diagonal"), [live(_T), live(f.src)]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/effects/bin_close.ogg"), 200, 1]);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(_T), live(f.src), 0]);
	d = null;
	rt.forList(f, 0, rt.gl("diagonals"));
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/blast_wall"), live(_T), live(d)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/cardinal_blasts  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:311)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/cardinal_blasts", function* cardinal_blasts(f: Frame, victim: Value) {
	let _T: Value = null, d: Value = null;
	let $e: any;
	f.vars = () => [victim, _T, d, $e];
	if (!truthy((_T = rt.getStep(f, live(victim), 0)))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph/cardinal"), [live(_T), live(f.src)]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/effects/bin_close.ogg"), 200, 1]);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(_T), live(f.src), 0]);
	d = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/blast_wall"), live(_T), live(d)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/alldir_blasts  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:322)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/alldir_blasts", function* alldir_blasts(f: Frame, victim: Value) {
	let _T: Value = null, d: Value = null;
	let $e: any;
	f.vars = () => [victim, _T, d, $e];
	if (!truthy((_T = rt.getStep(f, live(victim), 0)))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph"), [live(_T), live(f.src)]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/effects/bin_close.ogg"), 200, 1]);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(_T), live(f.src), 0]);
	d = null;
	rt.forList(f, 0, rt.gl("alldirs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/blast_wall"), live(_T), live(d)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/blast_wall  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:333)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/blast_wall", function* blast_wall(f: Frame, _T: Value, set_dir: Value) {
	let range: Value = null, previousturf: Value = null, J: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [_T, set_dir, range, previousturf, J, i, $e];
	range = rt.sv(f, "beam_range");
	previousturf = live(_T);
	J = rt.getStep(f, live(previousturf), live(set_dir));
	i = null;
	rt.forRange(f, 0, 1, live(range), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(J), live(f.src), 0]);
		J = rt.getStep(f, (previousturf = live(J)), live(set_dir));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, {  }] });

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/arena_trap  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:342)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/arena_trap", function* arena_trap(f: Frame, victim: Value) {
	let _T: Value = null, d: Value = null, t: Value = null;
	let $e: any;
	f.vars = () => [victim, _T, d, t, $e];
	_T = rt.getStep(f, live(victim), 0);
	if ((((!truthy((rt.istype(live(victim), T("/mob")) ? 1 : 0)) || isEqual(rt.fv(f, "stat", live(victim)), 2)) || !truthy(live(_T))) || rt.gt(rt.sv(f, "arena_cooldown"), rt.worldTime(f)))) {
		return live(f.dot);
	}
	if (((truthy((rt.istype((yield* g.call(f, P("/proc/get_area"), null, [live(_T)])), T("/area/ruin/unpowered/hierophant")) ? 1 : 0)) || truthy((rt.istype((yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), T("/area/ruin/unpowered/hierophant")) ? 1 : 0))) && !isEqual(live(victim), live(f.src)))) {
		return live(f.dot);
	}
	rt.setSv(f, "arena_cooldown", add(rt.worldTime(f), rt.initial(f, live(f.src), "arena_cooldown")));
	d = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/arena_squares"), live(_T), live(d)]);
	}
	rt.endFor(f, 0);
	t = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(_T)), 11), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(_T)), 11), 1])), rt.fv(f, "z", live(_T))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(_T)), 11), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(_T)), 11), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(_T)))])));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if ((truthy(live(t)) && isEqual((yield* g.call(f, P("/proc/get_dist"), null, [live(t), live(_T)])), 11))) {
			yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/wall"), [live(t), live(f.src)]);
			yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(t), live(f.src), 0]);
		}
	}
	rt.endFor(f, 0);
	if (!rt.ge((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(_T)])), 11)) return f.dot;
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/blink"), live(_T)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/arena_squares  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:358)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/arena_squares", function* arena_squares(f: Frame, _T: Value, set_dir: Value) {
	let previousturf: Value = null, J: Value = null, i: Value = null, HS: Value = null;
	let $e: any;
	f.vars = () => [_T, set_dir, previousturf, J, i, HS, $e];
	previousturf = live(_T);
	J = rt.getStep(f, live(previousturf), live(set_dir));
	i = null;
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.setFv(f, "dir", (HS = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/squares"), [live(J)]))), live(set_dir));
		J = rt.getStep(f, (previousturf = live(J)), live(set_dir));
		yield* g.call(f, P("/proc/sleep"), null, [0.5]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, {  }] });

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/blink  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:368)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/blink", function* blink(f: Frame, victim: Value) {
	let _T: Value = null, source: Value = null, t: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [victim, _T, source, t, B, $e];
	if ((truthy(rt.sv(f, "blinking")) || !truthy(live(victim)))) {
		return live(f.dot);
	}
	_T = rt.getStep(f, live(victim), 0);
	source = rt.getStep(f, live(f.src), 0);
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph"), [live(_T), live(f.src)]);
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph"), [live(source), live(f.src)]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/magic/wand_teleport.ogg"), 200, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [live(source), rt.rsc("sound/machines/airlockopen.ogg"), 200, 1]);
	rt.setSv(f, "blinking", 1);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph/teleport"), [live(_T), live(f.src)]);
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph/teleport"), [live(source), live(f.src)]);
	t = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(_T)), 1), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(_T)), 1), 1])), rt.fv(f, "z", live(_T))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(_T)), 1), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(_T)), 1), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(_T)))])));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		rt.setFv(f, "damage", (B = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(t), live(f.src), 0]))), 30);
	}
	rt.endFor(f, 0);
	t = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(source)), 1), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(source)), 1), 1])), rt.fv(f, "z", live(source))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(source)), 1), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(source)), 1), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(source)))])));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		rt.setFv(f, "damage", (B = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(t), live(f.src), 0]))), 30);
	}
	rt.endFor(f, 0);
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "alpha", 0, "time", 2, "easing", 128]);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='hierophant_warning'>＀ fades out!</span>", [live(f.src)]));
	rt.setSv(f, "density", 0);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	yield* g.srcCall(f, "forceMove", live(_T));
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "alpha", 255, "time", 2, "easing", 64]);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	rt.setSv(f, "density", 1);
	yield* g.srcCall(f, "visible_message", fmt("<span class='hierophant_warning'>＀ fades in!</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	rt.setSv(f, "blinking", 0);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/melee_blast  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:401)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/melee_blast", function* melee_blast(f: Frame, victim: Value) {
	let _T: Value = null, t: Value = null;
	let $e: any;
	f.vars = () => [victim, _T, t, $e];
	if (!truthy(live(victim))) {
		return live(f.dot);
	}
	if (!truthy((_T = rt.getStep(f, live(victim), 0)))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph"), [live(_T), live(f.src)]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/effects/bin_close.ogg"), 200, 1]);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	t = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(_T)), 1), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(_T)), 1), 1])), rt.fv(f, "z", live(_T))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(_T)), 1), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(_T)), 1), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(_T)))])));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(t), live(f.src), 0]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/burst  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:413)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/burst", function* burst(f: Frame, original: Value) {
	let last_dist: Value = null, t: Value = null, _T: Value = null, dist: Value = null;
	let $e: any;
	f.vars = () => [original, last_dist, t, _T, dist, $e];
	yield* g.call(f, P("/proc/playsound"), null, [live(original), rt.rsc("sound/machines/airlockopen.ogg"), 200, 1]);
	last_dist = 0;
	t = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/spiral_range_turfs"), null, [rt.sv(f, "burst_range"), live(original)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if (!truthy((_T = live(t)))) {
			continue;
		}
		if (rt.gt((dist = (yield* g.call(f, P("/proc/get_dist"), null, [live(original), live(_T)]))), live(last_dist))) {
			last_dist = live(dist);
			yield* g.call(f, P("/proc/sleep"), null, [add(1, multiply((yield* g.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "burst_range"), live(last_dist)), 12])), 0.5))]);
		}
		yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(_T), live(f.src), 0]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });

// /mob/living/simple_animal/hostile/megafauna/hierophant/proc/AltClickOn  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:426)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	if ((!truthy((rt.istype(live(A), T("/atom")) ? 1 : 0)) || rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(A), live(f.src)])), 2))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "blink", live(A));
	return f.dot;
}, true);

rt.type(11660, "/obj/effect/temp_visual/hierophant", "/obj/effect/temp_visual", {
	caster: null,
	name: "vortex energy",
	layer: 3.7,
});

// /obj/effect/temp_visual/hierophant/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:437)  may sleep
rt.def("/obj/effect/temp_visual/hierophant/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.args[1]))) return f.dot;
	rt.setSv(f, "caster", live(f.args[1]));
	return f.dot;
}, true, { args: ["mapload", "new_caster"] });

rt.type(11663, "/obj/effect/temp_visual/hierophant/squares", "/obj/effect/temp_visual/hierophant", {
	duration: 3,
	light_range: 1,
	randomdir: 0,
	icon_state: "hierophant_squares",
});

// /obj/effect/temp_visual/hierophant/squares/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:448)  may sleep
rt.def("/obj/effect/temp_visual/hierophant/squares/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/turf/closed/mineral")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (M = rt.sv(f, "loc")), "gets_drilled", [rt.sv(f, "caster")]);
	return f.dot;
}, true, { args: ["mapload", "new_caster"] });

rt.type(11661, "/obj/effect/temp_visual/hierophant/wall", "/obj/effect/temp_visual/hierophant", {
	light_range: 1,
	duration: 100,
	smooth: 1,
	name: "vortex wall",
	icon: rt.rsc("icons/turf/walls/hierophant_wall_temp.dmi"),
	icon_state: "wall",
});

// /obj/effect/temp_visual/hierophant/wall/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:462)  may sleep
rt.def("/obj/effect/temp_visual/hierophant/wall/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/queue_smooth_neighbors"), null, [live(f.src)]);
	yield* g.call(f, P("/proc/queue_smooth"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload", "new_caster"] });

// /obj/effect/temp_visual/hierophant/wall/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:467)  may sleep
rt.def("/obj/effect/temp_visual/hierophant/wall/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/queue_smooth_neighbors"), null, [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/temp_visual/hierophant/wall/proc/CanPass  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:471)
rt.def("/obj/effect/temp_visual/hierophant/wall/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let _P: Value = null;
	f.vars = () => [height, _P];
	if (live(height) === null) {
		height = 0;
	}
	if ((!truthy(rt.sv(f, "caster")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "caster"))))) {
		return 0;
	}
	if (isEqual(live(mover), rt.fv(f, "pulledby", rt.sv(f, "caster")))) {
		return 1;
	}
	if (truthy((rt.istype(live(mover), T("/obj/item/projectile")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "firer", (_P = live(mover))), rt.sv(f, "caster"))) {
			return 1;
		}
	}
	if (isEqual(live(mover), rt.sv(f, "caster"))) {
		return 1;
	}
	return 0;
});

rt.type(11664, "/obj/effect/temp_visual/hierophant/chaser", "/obj/effect/temp_visual/hierophant", {
	target: null,
	targetturf: null,
	moving_dir: null,
	previous_moving_dir: null,
	more_previouser_moving_dir: null,
	moving: 0,
	standard_moving_before_recalc: 4,
	tiles_per_step: 1,
	speed: 3,
	currently_seeking: 0,
	friendly_fire_check: 0,
	monster_damage_boost: 1,
	damage: 10,
	duration: 98,
});

// /obj/effect/temp_visual/hierophant/chaser/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:500)  may sleep
rt.def("/obj/effect/temp_visual/hierophant/chaser/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "target", live(f.args[2]));
	rt.setSv(f, "friendly_fire_check", live(f.args[4]));
	if (truthy(live(f.args[3]))) {
		rt.setSv(f, "speed", live(f.args[3]));
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/temp_visual/hierophant/chaser/proc/seek_target")])), 1]);
	return f.dot;
}, true, { args: ["mapload", "new_caster", "new_target", "new_speed", "is_friendly_fire"] });

// /obj/effect/temp_visual/hierophant/chaser/proc/get_target_dir  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:508)
rt.def("/obj/effect/temp_visual/hierophant/chaser/proc/get_target_dir", function get_target_dir(f: Frame) {
	let cardinal_copy: Value = null;
	f.vars = () => [cardinal_copy];
	f.dot = rt.call(f, P("/proc/get_cardinal_dir"), null, [live(f.src), rt.sv(f, "targetturf")]);
	if (!((!isEqual(live(f.dot), rt.sv(f, "previous_moving_dir")) && isEqual(live(f.dot), rt.sv(f, "more_previouser_moving_dir"))) || isEqual(live(f.dot), 0))) return f.dot;
	cardinal_copy = rt.callName(f, rt.gl("cardinal"), "Copy", []);
	(cardinal_copy = rt.modify(live(cardinal_copy), rt.sv(f, "more_previouser_moving_dir"), subtract));
	f.dot = rt.op(f, "PickUnweighted", [1], [live(cardinal_copy)]);
	return f.dot;
});

// /obj/effect/temp_visual/hierophant/chaser/proc/seek_target  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:515)  may sleep
rt.def("/obj/effect/temp_visual/hierophant/chaser/proc/seek_target", function* seek_target(f: Frame) {
	let standard_target_dir: Value = null, _T: Value = null, i: Value = null, maybe_new_turf: Value = null;
	let $e: any;
	f.vars = () => [standard_target_dir, _T, i, maybe_new_turf, $e];
	if (truthy(rt.sv(f, "currently_seeking"))) return f.dot;
	rt.setSv(f, "currently_seeking", 1);
	rt.setSv(f, "targetturf", rt.getStep(f, rt.sv(f, "target"), 0));
	while ((((((truthy(rt.sv(f, "target")) && truthy(live(f.src))) && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) && truthy(rt.sv(f, "currently_seeking"))) && truthy(rt.sv(f, "x"))) && truthy(rt.sv(f, "y"))) && truthy(rt.sv(f, "targetturf"))) {
		if (!truthy(rt.sv(f, "moving"))) {
			rt.setSv(f, "more_previouser_moving_dir", rt.sv(f, "previous_moving_dir"));
			rt.setSv(f, "previous_moving_dir", rt.sv(f, "moving_dir"));
			rt.setSv(f, "moving_dir", (yield* g.srcCall(f, "get_target_dir")));
			if (((!isEqual((standard_target_dir = (yield* g.call(f, P("/proc/get_cardinal_dir"), null, [live(f.src), rt.sv(f, "targetturf")]))), rt.sv(f, "previous_moving_dir")) && isEqual(live(standard_target_dir), rt.sv(f, "more_previouser_moving_dir"))) || isEqual(live(standard_target_dir), 0))) {
				rt.setSv(f, "moving", 1);
			} else {
				rt.setSv(f, "moving", rt.sv(f, "standard_moving_before_recalc"));
			}
		}
		if (truthy(rt.sv(f, "moving"))) {
			_T = rt.getStep(f, live(f.src), 0);
			i = null;
			rt.forRange(f, 0, 1, rt.sv(f, "tiles_per_step"), 1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				if (truthy((maybe_new_turf = rt.getStep(f, live(_T), rt.sv(f, "moving_dir"))))) {
					_T = live(maybe_new_turf);
				} else {
					break;
				}
			}
			rt.endFor(f, 0);
			yield* g.srcCall(f, "forceMove", live(_T));
			yield* g.srcCall(f, "make_blast");
			rt.incSrcVar(f, "moving", -1, true);
			yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "speed")]);
		}
		rt.setSv(f, "targetturf", rt.getStep(f, rt.sv(f, "target"), 0));
	}
	return f.dot;
}, true);

// /obj/effect/temp_visual/hierophant/chaser/proc/make_blast  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:542)  may sleep
rt.def("/obj/effect/temp_visual/hierophant/chaser/proc/make_blast", function* make_blast(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	rt.setFv(f, "damage", (B = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [rt.sv(f, "loc"), rt.sv(f, "caster"), rt.sv(f, "friendly_fire_check")]))), rt.sv(f, "damage"));
	rt.setFv(f, "monster_damage_boost", live(B), rt.sv(f, "monster_damage_boost"));
	return f.dot;
}, true);

rt.type(11670, "/obj/effect/temp_visual/hierophant/blast", "/obj/effect/temp_visual/hierophant", {
	damage: 10,
	monster_damage_boost: 1,
	hit_things: null,
	friendly_fire_check: 0,
	bursting: 0,
	light_range: 1,
	duration: 9,
	icon_state: "hierophant_blast",
	name: "vortex blast",
	desc: "Get out of the way!",
});

// /obj/effect/temp_visual/hierophant/blast/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:575)
rt.def("/obj/effect/temp_visual/hierophant/blast/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hit_things", rt.list());
	return f.dot;
});

// /obj/effect/temp_visual/hierophant/blast/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:580)  may sleep
rt.def("/obj/effect/temp_visual/hierophant/blast/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "friendly_fire_check", live(f.args[2]));
	if (truthy(live(f.args[1]))) {
		rt.modSrcVar(f, "hit_things", live(f.args[1]), add);
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/turf/closed/mineral")) ? 1 : 0))) {
		yield* g.callName(f, (M = rt.sv(f, "loc")), "gets_drilled", [rt.sv(f, "caster")]);
	}
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/temp_visual/hierophant/blast/proc/blast")]);
	return f.dot;
}, true, { args: ["mapload", "new_caster", "friendly_fire"] });

// /obj/effect/temp_visual/hierophant/blast/proc/blast  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:590)  may sleep
rt.def("/obj/effect/temp_visual/hierophant/blast/proc/blast", function* blast(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/magic/blind.ogg"), 125, 1, -5]);
	yield* g.call(f, P("/proc/sleep"), null, [6]);
	rt.setSv(f, "bursting", 1);
	yield* g.srcCall(f, "do_damage", live(_T));
	yield* g.call(f, P("/proc/sleep"), null, [1.2999999523162842]);
	rt.setSv(f, "bursting", 0);
	return f.dot;
}, true);

// /obj/effect/temp_visual/hierophant/blast/proc/Crossed  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:601)  may sleep
rt.def("/obj/effect/temp_visual/hierophant/blast/proc/Crossed", function* Crossed(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "bursting"))) return f.dot;
	yield* g.srcCall(f, "do_damage", rt.getStep(f, live(f.src), 0));
	return f.dot;
}, true, { args: ["AM"] });

// /obj/effect/temp_visual/hierophant/blast/proc/do_damage  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:606)  may sleep
rt.def("/obj/effect/temp_visual/hierophant/blast/proc/do_damage", function* do_damage(f: Frame, _T: Value) {
	let L: Value = null, limb_to_hit: Value = null, armor: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [_T, L, limb_to_hit, armor, M, $e];
	if (!truthy(rt.sv(f, "damage"))) {
		return live(f.dot);
	}
	L = null;
	rt.forList(f, 0, subtract(rt.fv(f, "contents", live(_T)), rt.sv(f, "hit_things")), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		rt.modSrcVar(f, "hit_things", live(L), add);
		if ((((truthy(rt.sv(f, "friendly_fire_check")) && truthy(rt.sv(f, "caster"))) && truthy((yield* g.callName(f, rt.sv(f, "caster"), "faction_check_mob", [live(L)])))) || isEqual(rt.fv(f, "stat", live(L)), 2))) {
			continue;
		}
		if (truthy(rt.fv(f, "client", live(L)))) {
			yield* g.call(f, P("/proc/flash_color"), null, [rt.fv(f, "client", live(L)), "#660099", 1]);
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(L), rt.rsc("sound/weapons/sear.ogg"), 50, 1, -4]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='userdanger'>You're struck by a ＀!</span>", [rt.sv(f, "name")])]);
		limb_to_hit = (yield* g.callName(f, live(L), "get_bodypart", [rt.op(f, "PickUnweighted", [6], ["head", "chest", "r_arm", "l_arm", "r_leg", "l_leg"])]));
		armor = (yield* g.callName(f, live(L), "run_armor_check", [live(limb_to_hit), "melee", fmt("Your armor absorbs ＀!", [live(f.src)]), fmt("Your armor blocks part of ＀!", [live(f.src)]), 50, fmt("Your armor was penetrated by ＀!", [live(f.src)])]));
		yield* g.callName(f, live(L), "apply_damage", [rt.sv(f, "damage"), "fire", live(limb_to_hit), live(armor)]);
		if ((truthy(rt.sv(f, "monster_damage_boost")) && (truthy((rt.istype(live(L), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0)) || truthy((rt.istype(live(L), T("/mob/living/simple_animal/hostile/asteroid")) ? 1 : 0))))) {
			yield* g.callName(f, live(L), "adjustBruteLoss", [rt.sv(f, "damage")]);
		}
		yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "caster"), live(L), fmt("struck with a ＀", [rt.sv(f, "name")])]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, subtract(rt.fv(f, "contents", live(_T)), rt.sv(f, "hit_things")), T("/obj/mecha"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.modSrcVar(f, "hit_things", live(M), add);
		if (truthy(rt.fv(f, "occupant", live(M)))) {
			if (((truthy(rt.sv(f, "friendly_fire_check")) && truthy(rt.sv(f, "caster"))) && truthy((yield* g.callName(f, rt.sv(f, "caster"), "faction_check_mob", [rt.fv(f, "occupant", live(M))]))))) {
				continue;
			}
			yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "occupant", live(M)), fmt("<span class='userdanger'>Your ＀ is struck by a ＀!</span>", [rt.fv(f, "name", live(M)), rt.sv(f, "name")])]);
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(M), rt.rsc("sound/weapons/sear.ogg"), 50, 1, -4]);
		yield* g.callName(f, live(M), "take_damage", [rt.sv(f, "damage"), "fire", 0, 0]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12086, "/obj/effect/hierophant", "/obj/effect", {
	light_range: 2,
	anchored: 1,
	name: "hierophant beacon",
	desc: "A strange beacon, allowing mass teleportation for those able to use it.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "hierophant_tele_off",
	layer: 2.5,
});

// /obj/effect/hierophant/proc/attackby  (code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm:644)  may sleep
rt.def("/obj/effect/hierophant/proc/attackby", function* attackby(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/hierophant_club")) ? 1 : 0))) {
		if (rt.gt(rt.gv(f, "timer", (H = live(f.args[0]))), rt.worldTime(f))) {
			return live(f.dot);
		}
		if (isEqual(rt.fv(f, "beacon", live(H)), live(f.src))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start removing your hierophant beacon...</span>"]);
			rt.setFv(f, "timer", live(H), add(rt.worldTime(f), 51));
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(H), P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update")]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(f.src)], rt.Args.Named)))) {
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/magic/blind.ogg"), 200, 1, -4]);
				yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph/teleport"), [rt.getStep(f, live(f.src), 0), live(f.args[1])]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='hierophant_warning'>You collect ＀, reattaching it to the club!</span>", [live(f.src)])]);
				rt.setFv(f, "beacon", live(H), null);
				yield* g.callName(f, live(f.args[1]), "update_action_buttons_icon", []);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			} else {
				rt.setFv(f, "timer", live(H), rt.worldTime(f));
				yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(H), P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update")]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='hierophant_warning'>You touch the beacon with the club, but nothing happens.</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
