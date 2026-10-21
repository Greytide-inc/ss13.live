// From code/game/gamemodes/miniantags/revenant/revenant_abilities.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/simple_animal/revenant/proc/ClickOn  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:4)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	f.vars = () => [A, params];
	yield* g.callName(f, live(A), "examine", [live(f.src)]);
	if (!truthy((rt.istype(live(A), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (truthy((rt.isIn(f, live(A), rt.sv(f, "drained_mobs")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revenwarning'>＀'s soul is dead and empty.</span>", [live(A)])]);
	} else {
		if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(A)])), 1)) return f.dot;
		yield* g.srcCall(f, "Harvest", live(A));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/revenant/proc/Harvest  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:12)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/Harvest", function* Harvest(f: Frame, target: Value) {
	let B: Value = null;
	let $0: any, $1: any;
	f.vars = () => [target, B, $0, $1];
	if (!truthy((yield* g.srcCall(f, "castcheck", 0)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "draining"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='revenwarning'>You are already siphoning the essence of a soul!</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "stat", live(target)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revennotice'>＀ soul is too strong to harvest.</span>", [(yield* g.callName(f, live(target), "p_their", [1]))])]);
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(target), "You feel as if you are being watched."]);
		}
		return live(f.dot);
	}
	rt.setSv(f, "draining", 1);
	rt.modSrcVar(f, "essence_drained", (yield* g.call(f, P("/proc/rand"), null, [15, 20])), add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revennotice'>You search for the soul of ＀.</span>", [live(target)])]);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(f.src), (yield* g.call(f, P("/proc/rand"), null, [10, 20])), 0, live(target)])))) {
		if (truthy(rt.fv(f, "ckey", live(target)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revennotice'>＀ soul burns with intelligence.</span>", [(yield* g.callName(f, live(target), "p_their", [1]))])]);
			rt.modSrcVar(f, "essence_drained", (yield* g.call(f, P("/proc/rand"), null, [20, 30])), add);
		}
		if (!isEqual(rt.fv(f, "stat", live(target)), 2)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revennotice'>＀ soul blazes with life!</span>", [(yield* g.callName(f, live(target), "p_their", [1]))])]);
			rt.modSrcVar(f, "essence_drained", (yield* g.call(f, P("/proc/rand"), null, [40, 50])), add);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revennotice'>＀ soul is weak and faltering.</span>", [(yield* g.callName(f, live(target), "p_their", [1]))])]);
		}
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(f.src), (yield* g.call(f, P("/proc/rand"), null, [15, 20])), 0, live(target)])))) {
			$0 = rt.sv(f, "essence_drained");
			if (rt.inRange($0, 1, 30)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revennotice'>＀ will not yield much essence. Still, every bit counts.</span>", [live(target)])]);
			} else if (rt.inRange($0, 30, 70)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revennotice'>＀ will yield an average amount of essence.</span>", [live(target)])]);
			} else if (rt.inRange($0, 70, 90)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revenboldnotice'>Such a feast! ＀ will yield much essence to you.</span>", [live(target)])]);
			} else if (rt.inRange($0, 90, 9.999999848243207e+30)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revenbignotice'>Ah, the perfect soul. ＀ will yield massive amounts of essence to you.</span>", [live(target)])]);
			}
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(f.src), (yield* g.call(f, P("/proc/rand"), null, [15, 25])), 0, live(target)])))) {
				if (!truthy(rt.fv(f, "stat", live(target)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revenwarning'>＀ ＀ now powerful enough to fight off your draining.</span>", [(yield* g.callName(f, live(target), "p_they", [1])), (yield* g.callName(f, live(target), "p_are", []))])]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<span class='boldannounce'>You feel something tugging across your body before subsiding.</span>"]);
					rt.setSv(f, "draining", 0);
					rt.setSv(f, "essence_drained", 0);
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revenminor'>You begin siphoning essence from ＀'s soul.</span>", [live(target)])]);
				if (!isEqual(rt.fv(f, "stat", live(target)), 2)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<span class='warning'>You feel a horribly unpleasant draining sensation as your grip on life weakens...</span>"]);
				}
				yield* g.srcCall(f, "reveal", 46);
				yield* g.srcCall(f, "stun", 46);
				yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>＀ suddenly rises slightly into the air, ＀ skin turning an ashy gray.</span>", [live(target), (yield* g.callName(f, live(target), "p_their", []))])]);
				B = (yield* g.callSrc(f, "Beam", [null, live(target), "icon_state", "drain_life", "time", 9.999999848243207e+30], rt.Args.Named));
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(f.src), 46, 0, live(target)])))) {
					yield* g.srcCall(f, "change_essence_amount", rt.sv(f, "essence_drained"), 0, live(target));
					if ((rt.le(rt.sv(f, "essence_drained"), 90) && !isEqual(rt.fv(f, "stat", live(target)), 2))) {
						rt.modSrcVar(f, "essence_regen_cap", 5, add);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revenboldnotice'>The absorption of ＀'s living soul has increased your maximum essence level. Your new maximum essence is ＀.</span>", [live(target), rt.sv(f, "essence_regen_cap")])]);
					}
					if (rt.gt(rt.sv(f, "essence_drained"), 90)) {
						rt.modSrcVar(f, "essence_regen_cap", 15, add);
						rt.incSrcVar(f, "perfectsouls", 1, true);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revenboldnotice'>The perfection of ＀'s soul has increased your maximum essence level. Your new maximum essence is ＀.</span>", [live(target), rt.sv(f, "essence_regen_cap")])]);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='revennotice'>＀'s soul has been considerably weakened and will yield no more essence for the time being.</span>", [live(target)])]);
					yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>＀ slumps onto the ground.</span>", [live(target)]), "<span class='revenwarning'>Violets lights, dancing in your vision, getting clo--</span>"]);
					yield* g.callName(f, rt.sv(f, "drained_mobs"), "Add", [live(target)]);
					yield* g.callName(f, live(target), "death", [0]);
				} else {
					$0 = live(f.src);
					if (truthy(live(target))) {
						$1 = fmt("＀ has", [live(target)]);
					} else {
						$1 = "They have";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='revenwarning'>＀ been drawn out of your grasp. The link has been broken.</span>", [$1])]);
					if (truthy(live(target))) {
						yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>＀ slumps onto the ground.</span>", [live(target)]), "<span class='revenwarning'>Violets lights, dancing in your vision, receding--</span>"]);
					}
				}
				yield* g.call(f, P("/proc/qdel"), null, [live(B)]);
			} else {
				$0 = live(f.src);
				if (truthy(live(target))) {
					$1 = fmt("＀'s", [live(target)]);
				} else {
					$1 = "their";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='revenwarning'>You are not close enough to siphon ＀ soul. The link has been broken.</span>", [$1])]);
			}
		}
	}
	rt.setSv(f, "draining", 0);
	rt.setSv(f, "essence_drained", 0);
	return f.dot;
}, true);

rt.type(11278, "/obj/effect/proc_holder/spell/targeted/revenant_transmit", "/obj/effect/proc_holder/spell/targeted", {
	name: "Transmit",
	desc: "Telepathically transmits a message to the target.",
	panel: "Revenant Abilities",
	charge_max: 0,
	clothes_req: 0,
	range: 7,
	include_user: 0,
	action_icon_state: "r_transmit",
	action_background_icon_state: "bg_revenant",
});

// /obj/effect/proc_holder/spell/targeted/revenant_transmit/proc/cast  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:104)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/revenant_transmit/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let M: Value = null, msg: Value = null, ded: Value = null, follow_rev: Value = null, follow_whispee: Value = null;
	let $e: any;
	f.vars = () => [targets, user, M, msg, ded, follow_rev, follow_whispee, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	M = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!truthy((msg = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), fmt("What do you wish to tell ＀?", [live(M)]), null, ""]))))) {
			rt.setSv(f, "charge_counter", rt.sv(f, "charge_max"));
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/log_say"), null, [fmt("RevenantTransmit: ＀->＀ : ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)])), live(msg)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='revenboldnotice'>You transmit to ＀:</span> <span class='revennotice'>＀</span>", [live(M), live(msg)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='revenboldnotice'>You hear something behind you talking...</span> <span class='revennotice'>＀</span>", [live(msg)])]);
		ded = null;
		rt.forList(f, 1, rt.gl("dead_mob_list"));
		while (($e = rt.next(f, 1)) !== undefined) {
			ded = $e;
			if (!truthy((rt.istype(live(ded), T("/mob/dead/observer")) ? 1 : 0))) {
				continue;
			}
			follow_rev = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(ded), live(user)]);
			follow_whispee = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(ded), live(M)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(ded), fmt("＀ <span class='revenboldnotice'>＀ Revenant Transmit:</span> <span class='revennotice'>\"＀\" to</span> ＀ <span class='name'>＀</span>", [live(follow_rev), live(user), live(msg), live(follow_whispee), live(M)])]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(11345, "/obj/effect/proc_holder/spell/aoe_turf/revenant", "/obj/effect/proc_holder/spell/aoe_turf", {
	reveal: 80,
	stun: 20,
	locked: 1,
	unlock_amount: 100,
	cast_amount: 50,
	clothes_req: 0,
	action_background_icon_state: "bg_revenant",
	panel: "Revenant Abilities (Locked)",
	name: "Report this to a coder",
});

// /obj/effect/proc_holder/spell/aoe_turf/revenant/proc/New  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:133)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "locked"))) {
		rt.setSv(f, "name", fmt("＀ (＀E)", [rt.initial(f, live(f.src), "name"), rt.sv(f, "unlock_amount")]));
	} else {
		rt.setSv(f, "name", fmt("＀ (＀E)", [rt.initial(f, live(f.src), "name"), rt.sv(f, "cast_amount")]));
	}
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/aoe_turf/revenant/proc/can_cast  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:140)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/proc/can_cast", function can_cast(f: Frame, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (rt.lt(rt.sv(f, "charge_counter"), rt.sv(f, "charge_max"))) {
		return 0;
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/simple_animal/revenant")) ? 1 : 0))) {
		return 1;
	}
	if (truthy(rt.fv(f, "inhibited", live(user)))) {
		return 0;
	}
	if (truthy(rt.sv(f, "locked"))) {
		if (rt.le(rt.fv(f, "essence", live(user)), rt.sv(f, "unlock_amount"))) {
			return 0;
		}
	}
	if (rt.le(rt.fv(f, "essence", live(user)), rt.sv(f, "cast_amount"))) {
		return 0;
	}
	return 1;
});

// /obj/effect/proc_holder/spell/aoe_turf/revenant/proc/attempt_cast  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:154)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/proc/attempt_cast", function* attempt_cast(f: Frame, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/simple_animal/revenant")) ? 1 : 0))) {
		rt.setSv(f, "name", fmt("＀", [rt.initial(f, live(f.src), "name")]));
		if (truthy(rt.sv(f, "locked"))) {
			rt.setSv(f, "panel", "Revenant Abilities");
			rt.setSv(f, "locked", 0);
		}
		return 1;
	}
	if (truthy(rt.sv(f, "locked"))) {
		if (!truthy((yield* g.callName(f, live(user), "castcheck", [rt.neg(rt.sv(f, "unlock_amount"))])))) {
			rt.setSv(f, "charge_counter", rt.sv(f, "charge_max"));
			return 0;
		}
		rt.setSv(f, "name", fmt("＀ (＀E)", [rt.initial(f, live(f.src), "name"), rt.sv(f, "cast_amount")]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='revennotice'>You have unlocked ＀!</span>", [rt.initial(f, live(f.src), "name")])]);
		rt.setSv(f, "panel", "Revenant Abilities");
		rt.setSv(f, "locked", 0);
		rt.setSv(f, "charge_counter", rt.sv(f, "charge_max"));
		return 0;
	}
	if (!truthy((yield* g.callName(f, live(user), "castcheck", [rt.neg(rt.sv(f, "cast_amount"))])))) {
		rt.setSv(f, "charge_counter", rt.sv(f, "charge_max"));
		return 0;
	}
	rt.setSv(f, "name", fmt("＀ (＀E)", [rt.initial(f, live(f.src), "name"), rt.sv(f, "cast_amount")]));
	yield* g.callName(f, live(user), "reveal", [rt.sv(f, "reveal")]);
	yield* g.callName(f, live(user), "stun", [rt.sv(f, "stun")]);
	if (truthy(rt.sv(f, "action"))) {
		yield* g.callName(f, rt.sv(f, "action"), "UpdateButtonIcon", []);
	}
	return 1;
}, true);

rt.type(11346, "/obj/effect/proc_holder/spell/aoe_turf/revenant/overload", "/obj/effect/proc_holder/spell/aoe_turf/revenant", {
	shock_range: 2,
	shock_damage: 15,
	stun: 30,
	cast_amount: 40,
	name: "Overload Lights",
	desc: "Directs a large amount of essence into nearby electrical lights, causing lights to shock those nearby.",
	charge_max: 200,
	range: 5,
	action_icon_state: "overload_lights",
});

// /obj/effect/proc_holder/spell/aoe_turf/revenant/overload/proc/cast  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:193)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/overload/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [targets, user, _T, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy((yield* g.srcCall(f, "attempt_cast", live(user))))) return f.dot;
	_T = null;
	rt.forList(f, 0, live(targets), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/proc_holder/spell/aoe_turf/revenant/overload/proc/overload"), live(_T), live(user)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/aoe_turf/revenant/overload/proc/overload  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:198)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/overload/proc/overload", function* overload(f: Frame, _T: Value, user: Value) {
	let L: Value = null, s: Value = null, M: Value = null, z: Value = null;
	let $e: any;
	f.vars = () => [_T, user, L, s, M, z, $e];
	L = null;
	rt.forList(f, 0, live(_T), T("/obj/machinery/light"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (!truthy(rt.fv(f, "on", live(L)))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'><b>＄！ suddenly flares brightly and begins to spark!</span>", [live(L)])]);
		yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [4, 0, live(L)]);
		yield* g.callName(f, live(s), "start", []);
		yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [rt.fv(f, "loc", live(L))]);
		yield* g.call(f, P("/proc/sleep"), null, [20]);
		if (!truthy(rt.fv(f, "on", live(L)))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/flick"), null, [fmt("＀2", [rt.fv(f, "base_state", live(L))]), live(L)]);
		M = null;
		rt.forList(f, 1, (yield* g.call(f, P("/proc/view"), null, [rt.sv(f, "shock_range"), live(L)])), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 1)) !== undefined) {
			M = $e;
			if (isEqual(live(M), live(user))) {
				continue;
			}
			yield* g.callName(f, live(L), "Beam", [null, live(M), "icon_state", "purple_lightning", "time", 5], rt.Args.Named);
			yield* g.callName(f, live(M), "electrocute_act", [null, rt.sv(f, "shock_damage"), null, live(L), "safety", 1], rt.Args.Named);
			yield* g.callName(f, (z = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [4, 0, live(M)]);
			yield* g.callName(f, live(z), "start", []);
			yield* g.call(f, P("/proc/playsound"), null, [live(M), rt.rsc("sound/machines/defib_zap.ogg"), 50, 1, -1]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, { type: 8, path: "/mob" }] });

rt.type(11347, "/obj/effect/proc_holder/spell/aoe_turf/revenant/defile", "/obj/effect/proc_holder/spell/aoe_turf/revenant", {
	stun: 20,
	reveal: 40,
	unlock_amount: 75,
	cast_amount: 30,
	name: "Defile",
	desc: "Twists and corrupts the nearby area as well as dispelling holy auras on floors.",
	charge_max: 150,
	range: 4,
	action_icon_state: "defile",
});

// /obj/effect/proc_holder/spell/aoe_turf/revenant/defile/proc/cast  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:233)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/defile/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [targets, user, _T, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy((yield* g.srcCall(f, "attempt_cast", live(user))))) return f.dot;
	_T = null;
	rt.forList(f, 0, live(targets), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/proc_holder/spell/aoe_turf/revenant/defile/proc/defile"), live(_T)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/aoe_turf/revenant/defile/proc/defile  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:238)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/defile/proc/defile", function* defile(f: Frame, _T: Value) {
	let floor: Value = null, closet: Value = null, corpseholder: Value = null, dna: Value = null, window: Value = null, light: Value = null;
	let $e: any;
	f.vars = () => [_T, floor, closet, corpseholder, dna, window, light, $e];
	if (truthy(rt.bitAnd(rt.fv(f, "flags", live(_T)), 1))) {
		(rt.modField(f, live(_T), "flags", 1, subtract));
		yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [live(_T)]);
	}
	if ((((!truthy((rt.istype(live(_T), T("/turf/open/floor/plating")) ? 1 : 0)) && !truthy((rt.istype(live(_T), T("/turf/open/floor/engine/cult")) ? 1 : 0))) && truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0))) && truthy(rt.op(f, "Prob", [], [15])))) {
		if ((truthy(rt.gv(f, "intact", (floor = live(_T)))) && truthy(rt.fv(f, "floor_tile", live(floor))))) {
			yield* g.new_(f, rt.fv(f, "floor_tile", live(floor)), [live(floor)]);
		}
		rt.setFv(f, "broken", live(floor), 0);
		rt.setFv(f, "burnt", live(floor), 0);
		yield* g.callName(f, live(floor), "make_plating", [1]);
	}
	if ((isEqual(rt.fv(f, "type", live(_T)), T("/turf/closed/wall")) && truthy(rt.op(f, "Prob", [], [15])))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [live(_T)]);
		yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/closed/wall/rust")]);
	}
	if ((isEqual(rt.fv(f, "type", live(_T)), T("/turf/closed/wall/r_wall")) && truthy(rt.op(f, "Prob", [], [10])))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [live(_T)]);
		yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/closed/wall/r_wall/rust")]);
	}
	closet = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(_T)), T("/obj/structure/closet"));
	while (($e = rt.next(f, 0)) !== undefined) {
		closet = $e;
		yield* g.callName(f, live(closet), "open", []);
	}
	rt.endFor(f, 0);
	corpseholder = null;
	rt.forList(f, 0, live(_T), T("/obj/structure/bodycontainer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		corpseholder = $e;
		if (isEqual(rt.gv(f, "loc", rt.fv(f, "connected", live(corpseholder))), live(corpseholder))) {
			yield* g.callName(f, live(corpseholder), "open", []);
		}
	}
	rt.endFor(f, 0);
	dna = null;
	rt.forList(f, 0, live(_T), T("/obj/machinery/dna_scannernew"));
	while (($e = rt.next(f, 0)) !== undefined) {
		dna = $e;
		yield* g.callName(f, live(dna), "open_machine", []);
	}
	rt.endFor(f, 0);
	window = null;
	rt.forList(f, 0, live(_T), T("/obj/structure/window"));
	while (($e = rt.next(f, 0)) !== undefined) {
		window = $e;
		yield* g.callName(f, live(window), "take_damage", [(yield* g.call(f, P("/proc/rand"), null, [30, 80]))]);
		if ((truthy(live(window)) && truthy(rt.fv(f, "fulltile", live(window))))) {
			yield* g.new_(f, T("/obj/effect/temp_visual/revenant/cracks"), [rt.fv(f, "loc", live(window))]);
		}
	}
	rt.endFor(f, 0);
	light = null;
	rt.forList(f, 0, live(_T), T("/obj/machinery/light"));
	while (($e = rt.next(f, 0)) !== undefined) {
		light = $e;
		yield* g.callName(f, live(light), "flicker", [20]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });

rt.type(11348, "/obj/effect/proc_holder/spell/aoe_turf/revenant/malfunction", "/obj/effect/proc_holder/spell/aoe_turf/revenant", {
	cast_amount: 60,
	unlock_amount: 200,
	name: "Malfunction",
	desc: "Corrupts and damages nearby machines and mechanical objects.",
	charge_max: 200,
	range: 4,
	action_icon_state: "malfunction",
});

// /obj/effect/proc_holder/spell/aoe_turf/revenant/malfunction/proc/cast  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:280)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/malfunction/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [targets, user, _T, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy((yield* g.srcCall(f, "attempt_cast", live(user))))) return f.dot;
	_T = null;
	rt.forList(f, 0, live(targets), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/proc_holder/spell/aoe_turf/revenant/malfunction/proc/malfunction"), live(_T), live(user)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/aoe_turf/revenant/malfunction/proc/malfunction  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:285)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/malfunction/proc/malfunction", function* malfunction(f: Frame, _T: Value, user: Value) {
	let bot: Value = null, human: Value = null, thing: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [_T, user, bot, human, thing, S, $e];
	bot = null;
	rt.forList(f, 0, live(_T), T("/mob/living/simple_animal/bot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		bot = $e;
		if (!truthy(rt.fv(f, "emagged", live(bot)))) {
			yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [rt.fv(f, "loc", live(bot))]);
			rt.setFv(f, "locked", live(bot), 0);
			rt.setFv(f, "open", live(bot), 1);
			yield* g.callName(f, live(bot), "emag_act", []);
		}
	}
	rt.endFor(f, 0);
	human = null;
	rt.forList(f, 0, live(_T), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		human = $e;
		if (isEqual(live(human), live(user))) {
			continue;
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(human), fmt("<span class='revenwarning'>You feel ＀.</span>", [rt.op(f, "PickUnweighted", [3], ["your sense of direction flicker out", "a stabbing pain in your head", "your mind fill with static"])])]);
		yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [rt.fv(f, "loc", live(human))]);
		yield* g.callName(f, live(human), "emp_act", [1]);
	}
	rt.endFor(f, 0);
	thing = null;
	rt.forList(f, 0, live(_T), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (((truthy((rt.istype(live(thing), T("/obj/machinery/dominator")) ? 1 : 0)) || truthy((rt.istype(live(thing), T("/obj/machinery/power/apc")) ? 1 : 0))) || truthy((rt.istype(live(thing), T("/obj/machinery/power/smes")) ? 1 : 0)))) {
			continue;
		}
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [rt.fv(f, "loc", live(thing))]);
			}
			yield* g.callName(f, live(thing), "emag_act", [null]);
		} else {
			if (!truthy((rt.istype(live(thing), T("/obj/machinery/clonepod")) ? 1 : 0))) {
				yield* g.callName(f, live(thing), "emp_act", [1]);
			}
		}
	}
	rt.endFor(f, 0);
	S = null;
	rt.forList(f, 0, live(_T), T("/mob/living/silicon/robot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		yield* g.call(f, P("/proc/playsound"), null, [live(S), rt.rsc("sound/machines/warning-buzzer.ogg"), 50, 1]);
		yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [rt.fv(f, "loc", live(S))]);
		yield* g.callName(f, rt.fv(f, "spark_system", live(S)), "start", []);
		yield* g.callName(f, live(S), "emp_act", [1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, { type: 8, path: "/mob" }] });

rt.type(11349, "/obj/effect/proc_holder/spell/aoe_turf/revenant/blight", "/obj/effect/proc_holder/spell/aoe_turf/revenant", {
	cast_amount: 50,
	unlock_amount: 200,
	name: "Blight",
	desc: "Causes nearby living things to waste away.",
	charge_max: 200,
	range: 3,
	action_icon_state: "blight",
});

// /obj/effect/proc_holder/spell/aoe_turf/revenant/blight/proc/cast  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:324)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/blight/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [targets, user, _T, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy((yield* g.srcCall(f, "attempt_cast", live(user))))) return f.dot;
	_T = null;
	rt.forList(f, 0, live(targets), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/proc_holder/spell/aoe_turf/revenant/blight/proc/blight"), live(_T), live(user)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/aoe_turf/revenant/blight/proc/blight  (code/game/gamemodes/miniantags/revenant/revenant_abilities.dm:329)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/blight/proc/blight", function* blight(f: Frame, _T: Value, user: Value) {
	let mob: Value = null, H: Value = null, blightfound: Value = null, blight: Value = null, vine: Value = null, shroom: Value = null, tray: Value = null;
	let $e: any;
	f.vars = () => [_T, user, mob, H, blightfound, blight, vine, shroom, tray, $e];
	mob = null;
	rt.forList(f, 0, live(_T), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		mob = $e;
		if (isEqual(live(mob), live(user))) {
			continue;
		}
		yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [rt.fv(f, "loc", live(mob))]);
		if (truthy((rt.istype(live(mob), T("/mob/living/carbon")) ? 1 : 0))) {
			if (truthy((rt.istype(live(mob), T("/mob/living/carbon/human")) ? 1 : 0))) {
				if ((truthy(rt.gv(f, "dna", (H = live(mob)))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H)))))) {
					yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", live(H))), "handle_hair", [live(H), "#1d2953"]);
				}
				blightfound = 0;
				blight = null;
				rt.forList(f, 1, rt.fv(f, "viruses", live(H)), T("/datum/disease/revblight"));
				while (($e = rt.next(f, 1)) !== undefined) {
					blight = $e;
					blightfound = 1;
					if (rt.lt(rt.fv(f, "stage", live(blight)), 5)) {
						rt.incField(f, live(blight), "stage", 1, true);
					}
				}
				rt.endFor(f, 1);
				if (!truthy(live(blightfound))) {
					yield* g.callName(f, live(H), "AddDisease", [(yield* g.new_(f, T("/datum/disease/revblight"), []))]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='revenminor'>You feel ＀.</span>", [rt.op(f, "PickUnweighted", [3], ["suddenly sick", "a surge of nausea", "like your skin is <i>wrong</i>"])])]);
				}
			} else {
				if (truthy(rt.fv(f, "reagents", live(mob)))) {
					yield* g.callName(f, rt.fv(f, "reagents", live(mob)), "add_reagent", ["plasma", 5]);
				}
			}
		} else {
			yield* g.callName(f, live(mob), "adjustToxLoss", [5]);
		}
	}
	rt.endFor(f, 0);
	vine = null;
	rt.forList(f, 0, live(_T), T("/obj/structure/spacevine"));
	while (($e = rt.next(f, 0)) !== undefined) {
		vine = $e;
		yield* g.callName(f, live(vine), "add_atom_colour", ["#823abb", 2]);
		yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [rt.fv(f, "loc", live(vine))]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(vine)])), 10, 8]);
	}
	rt.endFor(f, 0);
	shroom = null;
	rt.forList(f, 0, live(_T), T("/obj/structure/glowshroom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		shroom = $e;
		yield* g.callName(f, live(shroom), "add_atom_colour", ["#823abb", 2]);
		yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [rt.fv(f, "loc", live(shroom))]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(shroom)])), 10, 8]);
	}
	rt.endFor(f, 0);
	tray = null;
	rt.forList(f, 0, live(_T), T("/obj/machinery/hydroponics"));
	while (($e = rt.next(f, 0)) !== undefined) {
		tray = $e;
		yield* g.new_(f, T("/obj/effect/temp_visual/revenant"), [rt.fv(f, "loc", live(tray))]);
		rt.setFv(f, "pestlevel", live(tray), (yield* g.call(f, P("/proc/rand"), null, [8, 10])));
		rt.setFv(f, "weedlevel", live(tray), (yield* g.call(f, P("/proc/rand"), null, [8, 10])));
		rt.setFv(f, "toxic", live(tray), (yield* g.call(f, P("/proc/rand"), null, [45, 55])));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, { type: 8, path: "/mob" }] });
