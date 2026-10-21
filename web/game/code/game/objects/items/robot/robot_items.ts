// From code/game/objects/items/robot/robot_items.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9807, "/obj/item/borg/stun", "/obj/item/borg", {
	charge_cost: 30,
	name: "electrically-charged arm",
	icon_state: "elecarm",
});

// /obj/item/borg/stun/proc/attack  (code/game/objects/items/robot/robot_items.dm:14)  may sleep
rt.def("/obj/item/borg/stun/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let H: Value = null, R: Value = null;
	f.vars = () => [M, user, H, R];
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (H = live(M)), "check_shields", [live(f.src), 0, fmt("＀'s ＀", [live(M), rt.sv(f, "name")]), 1])))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(M), rt.rsc("sound/weapons/genhit.ogg"), 50, 1]);
			return 0;
		}
	}
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, rt.gv(f, "cell", (R = live(user))), "use", [rt.sv(f, "charge_cost")])))) {
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(user), "do_attack_animation", [live(M)]);
	yield* g.callName(f, live(M), "Knockdown", [100]);
	yield* g.callName(f, live(M), "apply_effect", ["stutter", 5]);
	yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ has prodded ＀ with ＀!</span>", [live(user), live(M), live(f.src)]), fmt("<span class='userdanger'>＀ has prodded you with ＀!</span>", [live(user), live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/egloves.ogg"), 50, 1, -1]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "stunned", live(f.src), fmt("(INTENT: ＀)", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "a_intent", live(user))]))])]);
	return f.dot;
}, true);

rt.type(9808, "/obj/item/borg/cyborghug", "/obj/item/borg", {
	mode: 0,
	ccooldown: 0,
	scooldown: 0,
	shockallowed: 0,
	boop: 0,
	name: "Hugging Module",
	icon_state: "hugmodule",
	desc: "For when a someone really needs a hug.",
});

// /obj/item/borg/cyborghug/proc/attack_self  (code/game/objects/items/robot/robot_items.dm:46)
rt.def("/obj/item/borg/cyborghug/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let _P: Value = null;
	let $0: any;
	f.vars = () => [_P, $0];
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "emagged", (_P = live(user)))) && isEqual(rt.sv(f, "shockallowed"), 1))) {
			if (rt.lt(rt.sv(f, "mode"), 3)) {
				rt.incSrcVar(f, "mode", 1, true);
			} else {
				rt.setSv(f, "mode", 0);
			}
		} else {
			if (rt.lt(rt.sv(f, "mode"), 1)) {
				rt.incSrcVar(f, "mode", 1, true);
			} else {
				rt.setSv(f, "mode", 0);
			}
		}
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Power reset. Hugs!"]);
	} else if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Power increased!"]);
	} else if ($0 === 2) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "BZZT. Electrifying arms..."]);
	} else if ($0 === 3) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "ERROR: ARM ACTUATORS OVERLOADED."]);
	}
	return f.dot;
});

// /obj/item/borg/cyborghug/proc/attack  (code/game/objects/items/robot/robot_items.dm:68)  may sleep
rt.def("/obj/item/borg/cyborghug/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let $0: any;
	f.vars = () => [M, user, $0];
	if (isEqual(live(M), live(user))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		if (rt.ge(rt.fv(f, "health", live(M)), 0)) {
			if (isEqual(rt.fv(f, "zone_selected", live(user)), "head")) {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ playfully boops ＀ on the head!</span>", [live(user), live(M)]), fmt("<span class='notice'>You playfully boop ＀ on the head!</span>", [live(M)])]);
				yield* g.callName(f, live(user), "do_attack_animation", [live(M), "boop"]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/tap.ogg"), 50, 1, -1]);
			} else {
				if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
					if (truthy(rt.fv(f, "lying", live(M)))) {
						yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ shakes ＀ trying to get ＀ up!</span>", [live(user), live(M), (yield* g.callName(f, live(M), "p_them", []))]), fmt("<span class='notice'>You shake ＀ trying to get ＀ up!</span>", [live(M), (yield* g.callName(f, live(M), "p_them", []))])]);
					} else {
						yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ hugs ＀ to make ＀ feel better!</span>", [live(user), live(M), (yield* g.callName(f, live(M), "p_them", []))]), fmt("<span class='notice'>You hug ＀ to make ＀ feel better!</span>", [live(M), (yield* g.callName(f, live(M), "p_them", []))])]);
					}
					if (truthy(rt.fv(f, "resting", live(M)))) {
						rt.setFv(f, "resting", live(M), 0);
						yield* g.callName(f, live(M), "update_canmove", []);
					}
				} else {
					yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ pets ＀!</span>", [live(user), live(M)]), fmt("<span class='notice'>You pet ＀!</span>", [live(M)])]);
				}
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
		}
	} else if ($0 === 1) {
		if (rt.ge(rt.fv(f, "health", live(M)), 0)) {
			if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
				if (truthy(rt.fv(f, "lying", live(M)))) {
					yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ shakes ＀ trying to get ＀ up!</span>", [live(user), live(M), (yield* g.callName(f, live(M), "p_them", []))]), fmt("<span class='notice'>You shake ＀ trying to get ＀ up!</span>", [live(M), (yield* g.callName(f, live(M), "p_them", []))])]);
				} else {
					if (isEqual(rt.fv(f, "zone_selected", live(user)), "head")) {
						yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ bops ＀ on the head!</span>", [live(user), live(M)]), fmt("<span class='warning'>You bop ＀ on the head!</span>", [live(M)])]);
						yield* g.callName(f, live(user), "do_attack_animation", [live(M), "punch"]);
					} else {
						yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ hugs ＀ in a firm bear-hug! ＀ looks uncomfortable...</span>", [live(user), live(M), live(M)]), fmt("<span class='warning'>You hug ＀ firmly to make ＀ feel better! ＀ looks uncomfortable...</span>", [live(M), (yield* g.callName(f, live(M), "p_them", [])), live(M)])]);
					}
				}
				if (truthy(rt.fv(f, "resting", live(M)))) {
					rt.setFv(f, "resting", live(M), 0);
					yield* g.callName(f, live(M), "update_canmove", []);
				}
			} else {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ bops ＀ on the head!</span>", [live(user), live(M)]), fmt("<span class='warning'>You bop ＀ on the head!</span>", [live(M)])]);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/tap.ogg"), 50, 1, -1]);
		}
	} else if ($0 === 2) {
		if (rt.lt(rt.sv(f, "scooldown"), rt.worldTime(f))) {
			if (rt.ge(rt.fv(f, "health", live(M)), 0)) {
				if ((truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/carbon/monkey")) ? 1 : 0)))) {
					yield* g.callName(f, live(M), "electrocute_act", [null, 5, null, fmt("＀", [live(user)]), "safety", 1], rt.Args.Named);
					yield* g.callName(f, live(user), "visible_message", [fmt("<span class='userdanger'>＀ electrocutes ＀ with their touch!</span>", [live(user), live(M)]), fmt("<span class='danger'>You electrocute ＀ with your touch!</span>", [live(M)])]);
					yield* g.callName(f, live(M), "update_canmove", []);
				} else {
					if (!truthy((rt.istype(live(M), T("/mob/living/silicon/robot")) ? 1 : 0))) {
						yield* g.callName(f, live(M), "adjustFireLoss", [10]);
						yield* g.callName(f, live(user), "visible_message", [fmt("<span class='userdanger'>＀ shocks ＀!</span>", [live(user), live(M)]), fmt("<span class='danger'>You shock ＀!</span>", [live(M)])]);
					} else {
						yield* g.callName(f, live(user), "visible_message", [fmt("<span class='userdanger'>＀ shocks ＀. It does not seem to have an effect</span>", [live(user), live(M)]), fmt("<span class='danger'>You shock ＀ to no effect.</span>", [live(M)])]);
					}
				}
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/sparks2.ogg"), 50, 1, -1]);
				(rt.modField(f, rt.fv(f, "cell", live(user)), "charge", 500, subtract));
				rt.setSv(f, "scooldown", add(rt.worldTime(f), 20));
			}
		}
	} else if ($0 === 3) {
		if (!rt.lt(rt.sv(f, "ccooldown"), rt.worldTime(f))) return f.dot;
		if (!rt.ge(rt.fv(f, "health", live(M)), 0)) return f.dot;
		if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='userdanger'>＀ crushes ＀ in their grip!</span>", [live(user), live(M)]), fmt("<span class='danger'>You crush ＀ in your grip!</span>", [live(M)])]);
		} else {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='userdanger'>＀ crushes ＀!</span>", [live(user), live(M)]), fmt("<span class='danger'>You crush ＀!</span>", [live(M)])]);
		}
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/smash.ogg"), 50, 1, -1]);
		yield* g.callName(f, live(M), "adjustBruteLoss", [15]);
		(rt.modField(f, rt.fv(f, "cell", live(user)), "charge", 300, subtract));
		rt.setSv(f, "ccooldown", add(rt.worldTime(f), 10));
	}
	return f.dot;
}, true);

rt.type(9811, "/obj/item/borg/charger", "/obj/item/borg", {
	mode: "draw",
	flags: 4,
	name: "power connector",
	icon_state: "charger_draw",
}, { global: { charge_items: 741, charge_machines: 1054 } });

// /obj/item/borg/charger/proc/Initialize  (code/game/objects/items/robot/robot_items.dm:160)  may sleep
rt.def("/obj/item/borg/charger/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/borg/charger/proc/update_icon  (code/game/objects/items/robot/robot_items.dm:163)
rt.def("/obj/item/borg/charger/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("charger_＀", [rt.sv(f, "mode")]));
	return f.dot;
});

// /obj/item/borg/charger/proc/attack_self  (code/game/objects/items/robot/robot_items.dm:167)
rt.def("/obj/item/borg/charger/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (isEqual(rt.sv(f, "mode"), "draw")) {
		rt.setSv(f, "mode", "charge");
	} else {
		rt.setSv(f, "mode", "draw");
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You toggle ＀ to \"＀\" mode.</span>", [live(f.src), rt.sv(f, "mode")])]);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/borg/charger/proc/afterattack  (code/game/objects/items/robot/robot_items.dm:175)  may sleep
rt.def("/obj/item/borg/charger/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let M: Value = null, cell: Value = null, E: Value = null, draw: Value = null;
	f.vars = () => [target, user, proximity_flag, M, cell, E, draw];
	if ((!truthy(live(proximity_flag)) || !truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "mode"), "draw")) {
		if (truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(target), rt.gl("charge_machines")])))) {
			if ((truthy(rt.bitAnd(rt.gv(f, "stat", (M = live(target))), 3)) || !truthy(rt.fv(f, "anchored", live(M))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is unpowered!</span>", [live(M)])]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You connect to ＀'s power line...</span>", [live(M)])]);
			while (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 15, "target", live(M), "progress", 0], rt.Args.Named)))) {
				if (((!truthy(live(user)) || !truthy(rt.fv(f, "cell", live(user)))) || !isEqual(rt.sv(f, "mode"), "draw"))) {
					return live(f.dot);
				}
				if ((truthy(rt.bitAnd(rt.fv(f, "stat", live(M)), 3)) || !truthy(rt.fv(f, "anchored", live(M))))) {
					break;
				}
				if (!truthy((yield* g.callName(f, rt.fv(f, "cell", live(user)), "give", [150])))) {
					break;
				}
				yield* g.callName(f, live(M), "use_power", [200]);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You stop charging youself.</span>"]);
		} else {
			if (truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(target), rt.gl("charge_items")])))) {
				if (!truthy((rt.istype((cell = live(target)), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
					cell = rt.locateIn(f, T("/obj/item/weapon/stock_parts/cell"), live(target));
				}
				if (!truthy(live(cell))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ has no power cell!</span>", [live(target)])]);
					return live(f.dot);
				}
				if (truthy((rt.istype(live(target), T("/obj/item/weapon/gun/energy")) ? 1 : 0))) {
					if (!truthy(rt.gv(f, "can_charge", (E = live(target))))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ has no power port!</span>", [live(target)])]);
						return live(f.dot);
					}
				}
				if (!truthy(rt.fv(f, "charge", live(cell)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ has no power!</span>", [live(target)])]);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You connect to ＀'s power port...</span>", [live(target)])]);
				while (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 15, "target", live(target), "progress", 0], rt.Args.Named)))) {
					if (((!truthy(live(user)) || !truthy(rt.fv(f, "cell", live(user)))) || !isEqual(rt.sv(f, "mode"), "draw"))) {
						return live(f.dot);
					}
					if ((!truthy(live(cell)) || !truthy(live(target)))) {
						return live(f.dot);
					}
					if ((!isEqual(live(cell), live(target)) && !isEqual(rt.fv(f, "loc", live(cell)), live(target)))) {
						return live(f.dot);
					}
					draw = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "charge", live(cell)), multiply(rt.fv(f, "chargerate", live(cell)), 0.5), subtract(rt.gv(f, "maxcharge", rt.fv(f, "cell", live(user))), rt.gv(f, "charge", rt.fv(f, "cell", live(user))))]));
					if (!truthy((yield* g.callName(f, live(cell), "use", [live(draw)])))) {
						break;
					}
					if (!truthy((yield* g.callName(f, rt.fv(f, "cell", live(user)), "give", [live(draw)])))) {
						break;
					}
					yield* g.callName(f, live(target), "update_icon", []);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You stop charging youself.</span>"]);
			}
		}
	} else {
		if (!truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(target), rt.gl("charge_items")])))) return f.dot;
		if (!truthy((rt.istype((cell = live(target)), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
			cell = rt.locateIn(f, T("/obj/item/weapon/stock_parts/cell"), live(target));
		}
		if (!truthy(live(cell))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ has no power cell!</span>", [live(target)])]);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(target), T("/obj/item/weapon/gun/energy")) ? 1 : 0))) {
			if (!truthy(rt.gv(f, "can_charge", (E = live(target))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ has no power port!</span>", [live(target)])]);
				return live(f.dot);
			}
		}
		if (rt.ge(rt.fv(f, "charge", live(cell)), rt.fv(f, "maxcharge", live(cell)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is already charged!</span>", [live(target)])]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You connect to ＀'s power port...</span>", [live(target)])]);
		while (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 15, "target", live(target), "progress", 0], rt.Args.Named)))) {
			if (((!truthy(live(user)) || !truthy(rt.fv(f, "cell", live(user)))) || !isEqual(rt.sv(f, "mode"), "charge"))) {
				return live(f.dot);
			}
			if ((!truthy(live(cell)) || !truthy(live(target)))) {
				return live(f.dot);
			}
			if ((!isEqual(live(cell), live(target)) && !isEqual(rt.fv(f, "loc", live(cell)), live(target)))) {
				return live(f.dot);
			}
			draw = (yield* g.call(f, P("/proc/min"), null, [rt.gv(f, "charge", rt.fv(f, "cell", live(user))), multiply(rt.fv(f, "chargerate", live(cell)), 0.5), subtract(rt.fv(f, "maxcharge", live(cell)), rt.fv(f, "charge", live(cell)))]));
			if (!truthy((yield* g.callName(f, rt.fv(f, "cell", live(user)), "use", [live(draw)])))) {
				break;
			}
			if (!truthy((yield* g.callName(f, live(cell), "give", [live(draw)])))) {
				break;
			}
			yield* g.callName(f, live(target), "update_icon", []);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You stop charging ＀.</span>", [live(target)])]);
	}
	return f.dot;
}, true);

rt.type(9359, "/obj/item/device/harmalarm", "/obj/item/device", {
	cooldown: 0,
	emagged: 0,
	name: "Sonic Harm Prevention Tool",
	desc: "Releases a harmless blast that confuses most organics. For when the harm is JUST TOO MUCH",
	icon_state: "megaphone",
});

// /obj/item/device/harmalarm/proc/emag_act  (code/game/objects/items/robot/robot_items.dm:284)
rt.def("/obj/item/device/harmalarm/proc/emag_act", function emag_act(f: Frame, user: Value) {
	rt.setSv(f, "emagged", (!truthy(rt.sv(f, "emagged")) ? 1 : 0));
	if (truthy(rt.sv(f, "emagged"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<font color='red'>You short out the safeties on the ＀!</font>", [live(f.src)])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<font color='red'>You reset the safeties on the ＀!</font>", [live(f.src)])]);
	}
	return f.dot;
});

// /obj/item/device/harmalarm/proc/attack_self  (code/game/objects/items/robot/robot_items.dm:291)  may sleep
rt.def("/obj/item/device/harmalarm/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let safety: Value = null, R: Value = null, M: Value = null, C: Value = null, bang_effect: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, safety, R, M, C, bang_effect, $0, $e];
	safety = (!truthy(rt.sv(f, "emagged")) ? 1 : 0);
	if (rt.gt(rt.sv(f, "cooldown"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<font color='red'>The device is still recharging!</font>"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if (rt.lt(rt.gv(f, "charge", rt.gv(f, "cell", (R = live(user)))), 1200)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<font color='red'>You don't have enough charge to do this!</font>"]);
			return live(f.dot);
		}
		(rt.modField(f, rt.fv(f, "cell", live(R)), "charge", 1000, subtract));
		if (truthy(rt.fv(f, "emagged", live(R)))) {
			safety = 0;
		}
	}
	if (isEqual(live(safety), 1)) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<font color='red' size='2'>＀ blares out a near-deafening siren from its speakers!</font>", [live(user)]), "<span class='userdanger'>The siren pierces your hearing and confuses you!</span>", "<span class='danger'>The siren pierces your hearing!</span>"]);
		M = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [9, live(user)])), T("/mob/living/carbon"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (isEqual((yield* g.callName(f, live(M), "get_ear_protection", [])), 0)) {
				rt.modField(f, live(M), "confused", 6, add);
			}
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "audible_message", "<font color='red' size='7'>HUMAN HARM</font>");
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/ai/harmalarm.ogg"), 70, 3]);
		rt.setSv(f, "cooldown", add(rt.worldTime(f), 200));
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀(＀) used a Cyborg Harm Alarm in (＀,＀,＀)", [rt.fv(f, "ckey", live(user)), live(user), rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))])]);
		if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.gv(f, "connected_ai", (R = live(user))), fmt("<br><span class='notice'>NOTICE - Peacekeeping 'HARM ALARM' used by: ＀</span><br>", [live(user)])]);
		}
		return live(f.dot);
	}
	if (!isEqual(live(safety), 0)) return f.dot;
	yield* g.callName(f, live(user), "audible_message", ["<font color='red' size='7'>BZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZT</font>"]);
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [9, live(user)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		$0 = (bang_effect = (yield* g.callName(f, live(C), "soundbang_act", [2, 0, 0, 5])));
		if ($0 === 1) {
			rt.modField(f, live(C), "confused", 5, add);
			rt.modField(f, live(C), "stuttering", 10, add);
			yield* g.callName(f, live(C), "Jitter", [10]);
		} else if ($0 === 2) {
			yield* g.callName(f, live(C), "Knockdown", [40]);
			rt.modField(f, live(C), "confused", 10, add);
			rt.modField(f, live(C), "stuttering", 15, add);
			yield* g.callName(f, live(C), "Jitter", [25]);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/warning-buzzer.ogg"), 130, 3]);
	rt.setSv(f, "cooldown", add(rt.worldTime(f), 600));
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀(＀) used an emagged Cyborg Harm Alarm in (＀,＀,＀)", [rt.fv(f, "ckey", live(user)), live(user), rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))])]);
	return f.dot;
}, true);

rt.type(9812, "/obj/item/borg/lollipop", "/obj/item/borg", {
	candy: 30,
	candymax: 30,
	charge_delay: 10,
	charging: 0,
	mode: 1,
	firedelay: 0,
	hitspeed: 2,
	hitdamage: 0,
	emaggedhitdamage: 3,
	name: "lollipop fabricator",
	desc: "Reward good humans with this. Toggle in-module to switch between dispensing and high velocity ejection modes.",
	icon_state: "lollipop",
});

// /obj/item/borg/lollipop/proc/equipped  (code/game/objects/items/robot/robot_items.dm:355)  may sleep
rt.def("/obj/item/borg/lollipop/proc/equipped", function* equipped(f: Frame) {
	yield* g.srcCall(f, "check_amount");
	return f.dot;
}, true);

// /obj/item/borg/lollipop/proc/dropped  (code/game/objects/items/robot/robot_items.dm:358)  may sleep
rt.def("/obj/item/borg/lollipop/proc/dropped", function* dropped(f: Frame) {
	yield* g.srcCall(f, "check_amount");
	return f.dot;
}, true);

// /obj/item/borg/lollipop/proc/check_amount  (code/game/objects/items/robot/robot_items.dm:363)  may sleep
rt.def("/obj/item/borg/lollipop/proc/check_amount", function* check_amount(f: Frame) {
	if (truthy(rt.sv(f, "charging"))) {
		return live(f.dot);
	}
	if (!rt.lt(rt.sv(f, "candy"), rt.sv(f, "candymax"))) return f.dot;
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/borg/lollipop/proc/charge_lollipops")])), rt.sv(f, "charge_delay")]);
	rt.setSv(f, "charging", 1);
	return f.dot;
}, true);

// /obj/item/borg/lollipop/proc/charge_lollipops  (code/game/objects/items/robot/robot_items.dm:368)  may sleep
rt.def("/obj/item/borg/lollipop/proc/charge_lollipops", function* charge_lollipops(f: Frame) {
	rt.incSrcVar(f, "candy", 1, true);
	rt.setSv(f, "charging", 0);
	yield* g.srcCall(f, "check_amount");
	return f.dot;
}, true);

// /obj/item/borg/lollipop/proc/dispense  (code/game/objects/items/robot/robot_items.dm:373)  may sleep
rt.def("/obj/item/borg/lollipop/proc/dispense", function* dispense(f: Frame, A: Value, user: Value) {
	let _T: Value = null, O: Value = null;
	f.vars = () => [A, user, _T, O];
	if (rt.le(rt.sv(f, "candy"), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>No lollipops left in storage!</span>"]);
		return 0;
	}
	if (((!truthy((_T = rt.getStep(f, live(A), 0))) || !truthy((rt.istype(live(_T), T("/turf")) ? 1 : 0))) || !truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0)))) {
		return 0;
	}
	if (truthy((rt.istype(live(A), T("/obj")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "density", (O = live(A))))) {
			return 0;
		}
	}
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/lollipop"), [live(_T)]);
	rt.incSrcVar(f, "candy", -1, true);
	yield* g.srcCall(f, "check_amount");
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Dispensing lollipop...</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	return 1;
}, true);

// /obj/item/borg/lollipop/proc/shootL  (code/game/objects/items/robot/robot_items.dm:391)  may sleep
rt.def("/obj/item/borg/lollipop/proc/shootL", function* shootL(f: Frame, target: Value, user: Value, params: Value) {
	let A: Value = null;
	f.vars = () => [target, user, params, A];
	if (rt.le(rt.sv(f, "candy"), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Not enough lollipops left!</span>"]);
		return 0;
	}
	rt.incSrcVar(f, "candy", -1, true);
	rt.setFv(f, "damage", rt.gv(f, "BB", (A = (yield* g.new_(f, T("/obj/item/ammo_casing/caseless/lollipop"), [live(f.src)])))), rt.sv(f, "hitdamage"));
	if (truthy(rt.sv(f, "hitdamage"))) {
		rt.setFv(f, "nodamage", rt.fv(f, "BB", live(A)), 0);
	}
	rt.setFv(f, "speed", rt.fv(f, "BB", live(A)), 0.5);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	yield* g.callName(f, live(A), "fire_casing", [live(target), live(user), live(params), 0, 0, null, 0]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ blasts a flying lollipop at ＀!</span>", [live(user), live(target)])]);
	yield* g.srcCall(f, "check_amount");
	return f.dot;
}, true);

// /obj/item/borg/lollipop/proc/shootG  (code/game/objects/items/robot/robot_items.dm:406)  may sleep
rt.def("/obj/item/borg/lollipop/proc/shootG", function* shootG(f: Frame, target: Value, user: Value, params: Value) {
	let A: Value = null;
	f.vars = () => [target, user, params, A];
	if (rt.le(rt.sv(f, "candy"), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Not enough gumballs left!</span>"]);
		return 0;
	}
	rt.incSrcVar(f, "candy", -1, true);
	rt.setFv(f, "damage", rt.gv(f, "BB", (A = (yield* g.new_(f, T("/obj/item/ammo_casing/caseless/gumball"), [live(f.src)])))), rt.sv(f, "hitdamage"));
	if (truthy(rt.sv(f, "hitdamage"))) {
		rt.setFv(f, "nodamage", rt.fv(f, "BB", live(A)), 0);
	}
	rt.setFv(f, "speed", rt.fv(f, "BB", live(A)), 0.5);
	rt.setFv(f, "color", rt.fv(f, "BB", live(A)), rt.op(f, "Rgb", [1, 3], [(yield* g.call(f, P("/proc/rand"), null, [0, 255])), (yield* g.call(f, P("/proc/rand"), null, [0, 255])), (yield* g.call(f, P("/proc/rand"), null, [0, 255]))]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/bulletflyby3.ogg"), 50, 1]);
	yield* g.callName(f, live(A), "fire_casing", [live(target), live(user), live(params), 0, 0, null, 0]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ shoots a high-velocity gumball at ＀!</span>", [live(user), live(target)])]);
	yield* g.srcCall(f, "check_amount");
	return f.dot;
}, true);

// /obj/item/borg/lollipop/proc/afterattack  (code/game/objects/items/robot/robot_items.dm:422)  may sleep
rt.def("/obj/item/borg/lollipop/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value, click_params: Value) {
	let R: Value = null;
	let $0: any;
	f.vars = () => [target, user, proximity, click_params, R, $0];
	yield* g.srcCall(f, "check_amount");
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, rt.gv(f, "cell", (R = live(user))), "use", [12])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Not enough power.</span>"]);
			return 0;
		}
		if (truthy(rt.fv(f, "emagged", live(R)))) {
			rt.setSv(f, "hitdamage", rt.sv(f, "emaggedhitdamage"));
		}
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		if (!truthy(live(proximity))) {
			return 0;
		}
		yield* g.srcCall(f, "dispense", live(target), live(user));
	} else if ($0 === 2) {
		yield* g.srcCall(f, "shootL", live(target), live(user), live(click_params));
	} else if ($0 === 3) {
		yield* g.srcCall(f, "shootG", live(target), live(user), live(click_params));
	}
	rt.setSv(f, "hitdamage", rt.initial(f, live(f.src), "hitdamage"));
	return f.dot;
}, true);

// /obj/item/borg/lollipop/proc/attack_self  (code/game/objects/items/robot/robot_items.dm:442)  may sleep
rt.def("/obj/item/borg/lollipop/proc/attack_self", function* attack_self(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		rt.incSrcVar(f, "mode", 1, true);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Module is now throwing lollipops.</span>"]);
	} else if ($0 === 2) {
		rt.incSrcVar(f, "mode", 1, true);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Module is now blasting gumballs.</span>"]);
	} else if ($0 === 3) {
		rt.setSv(f, "mode", 1);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Module is now dispensing lollipops.</span>"]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(8792, "/obj/item/projectile/bullet/reusable/gumball", "/obj/item/projectile/bullet/reusable", {
	name: "gumball",
	desc: "Oh noes! A fast-moving gumball!",
	icon_state: "gumball",
	ammo_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/gumball/cyborg"),
	nodamage: 1,
});

// /obj/item/projectile/bullet/reusable/gumball/proc/handle_drop  (code/game/objects/items/robot/robot_items.dm:469)  may sleep
rt.def("/obj/item/projectile/bullet/reusable/gumball/proc/handle_drop", function* handle_drop(f: Frame) {
	let _T: Value = null, S: Value = null;
	f.vars = () => [_T, S];
	if (truthy(rt.sv(f, "dropped"))) return f.dot;
	_T = rt.getStep(f, live(f.src), 0);
	rt.setFv(f, "color", (S = (yield* g.new_(f, rt.sv(f, "ammo_type"), [live(_T)]))), rt.sv(f, "color"));
	rt.setSv(f, "dropped", 1);
	return f.dot;
}, true);

rt.type(8793, "/obj/item/projectile/bullet/reusable/lollipop", "/obj/item/projectile/bullet/reusable", {
	color2: "#000000",
	name: "lollipop",
	desc: "Oh noes! A fast-moving lollipop!",
	icon_state: "lollipop_1",
	ammo_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/lollipop/cyborg"),
	nodamage: 1,
});

// /obj/item/projectile/bullet/reusable/lollipop/proc/New  (code/game/objects/items/robot/robot_items.dm:490)  may sleep
rt.def("/obj/item/projectile/bullet/reusable/lollipop/proc/New", function* New(f: Frame) {
	let S: Value = null, head: Value = null;
	f.vars = () => [S, head];
	rt.setSv(f, "color2", rt.gv(f, "headcolor", (S = (yield* g.new_(f, rt.sv(f, "ammo_type"), [live(f.src)])))));
	rt.setFv(f, "color", (head = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/projectiles.dmi"), "lollipop_2"]))), rt.sv(f, "color2"));
	yield* g.srcCall(f, "add_overlay", live(head));
	return f.dot;
}, true);

// /obj/item/projectile/bullet/reusable/lollipop/proc/handle_drop  (code/game/objects/items/robot/robot_items.dm:497)  may sleep
rt.def("/obj/item/projectile/bullet/reusable/lollipop/proc/handle_drop", function* handle_drop(f: Frame) {
	let _T: Value = null, S: Value = null;
	f.vars = () => [_T, S];
	if (truthy(rt.sv(f, "dropped"))) return f.dot;
	_T = rt.getStep(f, live(f.src), 0);
	yield* g.callName(f, (S = (yield* g.new_(f, rt.sv(f, "ammo_type"), [live(_T)]))), "change_head_color", [rt.sv(f, "color2")]);
	rt.setSv(f, "dropped", 1);
	return f.dot;
}, true);

rt.type(9813, "/obj/item/borg/projectile_dampen", "/obj/item/borg", {
	maxenergy: 1500,
	energy: 1500,
	energy_recharge: 7.5,
	energy_recharge_cyborg_drain_coefficient: 0.4,
	cyborg_cell_critical_percentage: 0.05,
	host: null,
	dampening_field: null,
	projectile_damage_coefficient: 0.5,
	projectile_damage_tick_ecost_coefficient: 2,
	projectile_speed_coefficient: 1.5,
	projectile_tick_speed_ecost: 15,
	tracked: null,
	projectile_effect: null,
	field_radius: 3,
	active: 0,
	cycle_delay: 0,
	name: "Hyperkinetic Dampening projector",
	desc: "A device that projects a dampening field that weakenss kinetic energy above a certain threshold. <span class='boldnotice'>Projects a field that drains power per second while active, that will weaken and slow damaging projectiles inside its field.</span> Still being a prototype, it tends to induce a charge on ungrounded metallic surfaces.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "shield",
});

// /obj/item/borg/projectile_dampen/proc/Initialize  (code/game/objects/items/robot/robot_items.dm:535)  may sleep
rt.def("/obj/item/borg/projectile_dampen/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "projectile_effect", (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/effects/fields.dmi"), "projectile_dampen_effect"])));
	rt.setSv(f, "tracked", rt.list());
	rt.setSv(f, "icon_state", "shield0");
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	}
	rt.setSv(f, "host", rt.sv(f, "loc"));
	return f.dot;
}, true);

// /obj/item/borg/projectile_dampen/proc/Destroy  (code/game/objects/items/robot/robot_items.dm:543)  may sleep
rt.def("/obj/item/borg/projectile_dampen/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/borg/projectile_dampen/proc/attack_self  (code/game/objects/items/robot/robot_items.dm:547)  may sleep
rt.def("/obj/item/borg/projectile_dampen/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [user, $0, $1];
	if (rt.gt(rt.sv(f, "cycle_delay"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='boldwarning'>％！ is still recycling its projectors!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	rt.setSv(f, "cycle_delay", add(rt.worldTime(f), 20));
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		yield* g.srcCall(f, "activate_field", live(user));
	} else {
		yield* g.srcCall(f, "deactivate_field");
	}
	yield* g.srcCall(f, "update_icon");
	$0 = live(user);
	if (truthy(rt.sv(f, "active"))) {
		$1 = "activate";
	} else {
		$1 = "deactivate";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='boldnotice'>You ＀ the ＀.</span>", [$1, live(f.src)])]);
	return f.dot;
}, true);

// /obj/item/borg/projectile_dampen/proc/update_icon  (code/game/objects/items/robot/robot_items.dm:560)
rt.def("/obj/item/borg/projectile_dampen/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.initial(f, live(f.src), "icon_state"), rt.sv(f, "active")]));
	return f.dot;
});

// /obj/item/borg/projectile_dampen/proc/activate_field  (code/game/objects/items/robot/robot_items.dm:563)  may sleep
rt.def("/obj/item/borg/projectile_dampen/proc/activate_field", function* activate_field(f: Frame) {
	if (truthy((rt.istype(rt.sv(f, "dampening_field"), T("/datum/proximity_monitor/advanced")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "dampening_field")]);
		rt.setSv(f, "dampening_field", null);
	}
	rt.setSv(f, "dampening_field", (yield* g.call(f, P("/proc/make_field"), null, [T("/datum/proximity_monitor/advanced/peaceborg_dampener"), rt.alist(f, ["current_range", rt.sv(f, "field_radius"), "host", live(f.src), "projector", live(f.src)])])));
	return f.dot;
}, true);

// /obj/item/borg/projectile_dampen/proc/deactivate_field  (code/game/objects/items/robot/robot_items.dm:568)  may sleep
rt.def("/obj/item/borg/projectile_dampen/proc/deactivate_field", function* deactivate_field(f: Frame) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "dampening_field")]);
	rt.setSv(f, "dampening_field", null);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＄！ shuts off!</span>", [live(f.src)]));
	_P = null;
	rt.forList(f, 0, rt.sv(f, "tracked"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		yield* g.srcCall(f, "restore_projectile", live(_P));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/borg/projectile_dampen/proc/dropped  (code/game/objects/items/robot/robot_items.dm:574)  may sleep
rt.def("/obj/item/borg/projectile_dampen/proc/dropped", function* dropped(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "host", rt.sv(f, "loc"));
	return f.dot;
}, true);

// /obj/item/borg/projectile_dampen/proc/equipped  (code/game/objects/items/robot/robot_items.dm:578)  may sleep
rt.def("/obj/item/borg/projectile_dampen/proc/equipped", function* equipped(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "host", rt.sv(f, "loc"));
	return f.dot;
}, true);

// /obj/item/borg/projectile_dampen/proc/on_mob_death  (code/game/objects/items/robot/robot_items.dm:582)  may sleep
rt.def("/obj/item/borg/projectile_dampen/proc/on_mob_death", function* on_mob_death(f: Frame) {
	yield* g.srcCall(f, "deactivate_field");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/borg/projectile_dampen/proc/process  (code/game/objects/items/robot/robot_items.dm:586)  may sleep
rt.def("/obj/item/borg/projectile_dampen/proc/process", function* process(f: Frame) {
	yield* g.srcCall(f, "process_recharge");
	yield* g.srcCall(f, "process_usage");
	yield* g.srcCall(f, "update_location");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/borg/projectile_dampen/proc/update_location  (code/game/objects/items/robot/robot_items.dm:592)  may sleep
rt.def("/obj/item/borg/projectile_dampen/proc/update_location", function* update_location(f: Frame) {
	if (!truthy(rt.sv(f, "dampening_field"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "dampening_field"), "HandleMove", []);
	return f.dot;
}, true);

// /obj/item/borg/projectile_dampen/proc/process_usage  (code/game/objects/items/robot/robot_items.dm:596)  may sleep
rt.def("/obj/item/borg/projectile_dampen/proc/process_usage", function* process_usage(f: Frame) {
	let usage: Value = null, I: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [usage, I, _P, $e];
	usage = 0;
	I = null;
	rt.forList(f, 0, rt.sv(f, "tracked"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if ((!truthy(rt.gv(f, "stun", (_P = live(I)))) && truthy(rt.fv(f, "nodamage", live(_P))))) {
			continue;
		}
		usage = rt.modify(live(usage), rt.sv(f, "projectile_tick_speed_ecost"), add);
		usage = rt.modify(live(usage), multiply(rt.index(rt.sv(f, "tracked"), live(I)), rt.sv(f, "projectile_damage_tick_ecost_coefficient")), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "energy", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "energy"), live(usage)), rt.sv(f, "maxenergy")]))])));
	if (!rt.le(rt.sv(f, "energy"), 0)) return f.dot;
	yield* g.srcCall(f, "deactivate_field");
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>The ＀ blinks \"ENERGY DEPLETED\"</span>", [live(f.src)]));
	return f.dot;
}, true);

// /obj/item/borg/projectile_dampen/proc/process_recharge  (code/game/objects/items/robot/robot_items.dm:608)  may sleep
rt.def("/obj/item/borg/projectile_dampen/proc/process_recharge", function* process_recharge(f: Frame) {
	if (!truthy((rt.istype(rt.sv(f, "host"), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if (truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "host")), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			rt.setSv(f, "host", rt.fv(f, "loc", rt.sv(f, "host")));
		} else {
			rt.setSv(f, "energy", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "energy"), rt.sv(f, "energy_recharge")), rt.sv(f, "maxenergy")]))])));
			return live(f.dot);
		}
	}
	if (!(rt.ge(rt.gv(f, "charge", rt.fv(f, "cell", rt.sv(f, "host"))), multiply(rt.gv(f, "maxcharge", rt.fv(f, "cell", rt.sv(f, "host"))), rt.sv(f, "cyborg_cell_critical_percentage"))) && rt.lt(rt.sv(f, "energy"), rt.sv(f, "maxenergy")))) return f.dot;
	yield* g.callName(f, rt.fv(f, "cell", rt.sv(f, "host")), "use", [multiply(rt.sv(f, "energy_recharge"), rt.sv(f, "energy_recharge_cyborg_drain_coefficient"))]);
	rt.modSrcVar(f, "energy", rt.sv(f, "energy_recharge"), add);
	return f.dot;
}, true);

// /obj/item/borg/projectile_dampen/proc/dampen_projectile  (code/game/objects/items/robot/robot_items.dm:619)
rt.def("/obj/item/borg/projectile_dampen/proc/dampen_projectile", function dampen_projectile(f: Frame, _P: Value, track_projectile: Value) {
	f.vars = () => [track_projectile];
	if (live(track_projectile) === null) {
		track_projectile = 1;
	}
	if (truthy(rt.index(rt.sv(f, "tracked"), live(_P)))) {
		return live(f.dot);
	}
	if (truthy(live(track_projectile))) {
		rt.setAt(rt.sv(f, "tracked"), live(_P), rt.fv(f, "damage", live(_P)));
	}
	(rt.modField(f, live(_P), "damage", rt.sv(f, "projectile_damage_coefficient"), multiply));
	(rt.modField(f, live(_P), "speed", rt.sv(f, "projectile_speed_coefficient"), multiply));
	rt.callName(f, live(_P), "add_overlay", [rt.sv(f, "projectile_effect")]);
	return f.dot;
});

// /obj/item/borg/projectile_dampen/proc/restore_projectile  (code/game/objects/items/robot/robot_items.dm:628)
rt.def("/obj/item/borg/projectile_dampen/proc/restore_projectile", function restore_projectile(f: Frame, _P: Value) {
	(rt.modSrcVar(f, "tracked", live(_P), subtract));
	(rt.modField(f, live(_P), "damage", divide(1, rt.sv(f, "projectile_damage_coefficient")), multiply));
	(rt.modField(f, live(_P), "speed", divide(1, rt.sv(f, "projectile_speed_coefficient")), multiply));
	rt.callName(f, live(_P), "cut_overlay", [rt.sv(f, "projectile_effect")]);
	return f.dot;
});

rt.type(9822, "/obj/item/borg/sight/hud/med", "/obj/item/borg/sight/hud", {
	name: "medical hud",
	icon_state: "healthhud",
});

// /obj/item/borg/sight/hud/med/proc/New  (code/game/objects/items/robot/robot_items.dm:677)  may sleep
rt.def("/obj/item/borg/sight/hud/med/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "hud", (yield* g.new_(f, T("/obj/item/clothing/glasses/hud/health"), [live(f.src)])));
	return live(f.dot);
}, true);

rt.type(9823, "/obj/item/borg/sight/hud/sec", "/obj/item/borg/sight/hud", {
	name: "security hud",
	icon_state: "securityhud",
});

// /obj/item/borg/sight/hud/sec/proc/New  (code/game/objects/items/robot/robot_items.dm:687)  may sleep
rt.def("/obj/item/borg/sight/hud/sec/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "hud", (yield* g.new_(f, T("/obj/item/clothing/glasses/hud/security"), [live(f.src)])));
	return live(f.dot);
}, true);
