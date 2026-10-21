// From code/game/machinery/doors/door.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10209, "/obj/machinery/door", "/obj/machinery", {
	secondsElectrified: 0,
	shockedby: null,
	visible: 1,
	operating: 0,
	glass: 0,
	welded: 0,
	normalspeed: 1,
	heat_proof: 0,
	emergency: 0,
	sub_door: 0,
	closingLayer: 3.1,
	autoclose: 0,
	safe: 1,
	locked: 0,
	assemblytype: null,
	auto_close: null,
	spark_system: null,
	damage_deflection: 10,
	real_explosion_block: null,
	anchored: 1,
	CanAtmosPass: -2,
	flags: 32768,
	name: "door",
	desc: "It opens and closes.",
	icon: rt.rsc("icons/obj/doors/doorint.dmi"),
	icon_state: "door1",
	opacity: 1,
	density: 1,
	layer: 2.7,
	power_channel: 3,
	obj_integrity: 350,
	max_integrity: 350,
	armor: null,
});

// /obj/machinery/door/proc/<init>  (code/game/machinery/doors/door.dm:18)
rt.def("/obj/machinery/door/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "shockedby", rt.list());
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 30, "laser", 20, "energy", 20, "bomb", 10, "bio", 100, "rad", 100, "fire", 80, "acid", 70]));
	return f.dot;
});

// /obj/machinery/door/proc/New  (code/game/machinery/doors/door.dm:38)  may sleep
rt.def("/obj/machinery/door/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "density"))) {
		rt.setSv(f, "layer", 3.0999999046325684);
	} else {
		rt.setSv(f, "layer", 2.700000047683716);
	}
	yield* g.srcCall(f, "update_freelook_sight");
	yield* g.srcCall(f, "air_update_turf", 1);
	rt.modGl("airlocks", live(f.src), add);
	rt.setSv(f, "spark_system", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	yield* g.callName(f, rt.sv(f, "spark_system"), "set_up", [2, 1, live(f.src)]);
	rt.setSv(f, "real_explosion_block", rt.sv(f, "explosion_block"));
	rt.setSv(f, "explosion_block", -1);
	return f.dot;
}, true);

// /obj/machinery/door/proc/Destroy  (code/game/machinery/doors/door.dm:55)  may sleep
rt.def("/obj/machinery/door/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "density", 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	yield* g.srcCall(f, "update_freelook_sight");
	(rt.modGl("airlocks", live(f.src), subtract));
	if (truthy(rt.sv(f, "spark_system"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "spark_system")]);
		rt.setSv(f, "spark_system", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/door/proc/Bumped  (code/game/machinery/doors/door.dm:67)  may sleep
rt.def("/obj/machinery/door/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let B: Value = null, M: Value = null, mecha: Value = null;
	f.vars = () => [AM, B, M, mecha];
	if ((truthy(rt.sv(f, "operating")) || truthy(rt.sv(f, "emagged")))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
		if (((truthy((rt.istype((B = live(AM)), T("/mob/living/simple_animal/drone")) ? 1 : 0)) || truthy((rt.istype(live(B), T("/mob/living/silicon/robot")) ? 1 : 0))) && truthy(rt.fv(f, "stat", live(B))))) {
			return live(f.dot);
		}
		if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
			M = live(AM);
			if (rt.le(subtract(rt.worldTime(f), rt.fv(f, "last_bumped", live(M))), 10)) {
				return live(f.dot);
			}
			rt.setFv(f, "last_bumped", live(M), rt.worldTime(f));
			if ((truthy((yield* g.callName(f, live(M), "restrained", []))) && !truthy((yield* g.srcCall(f, "check_access", null))))) {
				return live(f.dot);
			}
			yield* g.srcCall(f, "bumpopen", live(M));
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(AM), T("/obj/mecha")) ? 1 : 0))) {
		mecha = live(AM);
		if (truthy(rt.sv(f, "density"))) {
			if (truthy(rt.fv(f, "occupant", live(mecha)))) {
				if (rt.le(subtract(rt.worldTime(f), rt.gv(f, "last_bumped", rt.fv(f, "occupant", live(mecha)))), 10)) {
					return live(f.dot);
				}
				rt.setFv(f, "last_bumped", rt.fv(f, "occupant", live(mecha)), rt.worldTime(f));
			}
			if ((truthy(rt.fv(f, "occupant", live(mecha))) && (truthy((yield* g.callName(f, live(f.src), "allowed", [rt.fv(f, "occupant", live(mecha))]))) || truthy((yield* g.callName(f, live(f.src), "check_access_list", [rt.fv(f, "operation_req_access", live(mecha))])))))) {
				yield* g.srcCall(f, "open");
			} else {
				yield* g.srcCall(f, "do_animate", "deny");
			}
		}
		return live(f.dot);
	}
	return live(f.dot);
}, true);

// /obj/machinery/door/proc/Move  (code/game/machinery/doors/door.dm:98)  may sleep
rt.def("/obj/machinery/door/proc/Move", function* Move(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.sv(f, "loc");
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "move_update_air", live(_T));
	return f.dot;
}, true);

// /obj/machinery/door/proc/CanPass  (code/game/machinery/doors/door.dm:103)
rt.def("/obj/machinery/door/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [2])))) {
		return (!truthy(rt.sv(f, "opacity")) ? 1 : 0);
	}
	return (!truthy(rt.sv(f, "density")) ? 1 : 0);
});

// /obj/machinery/door/proc/bumpopen  (code/game/machinery/doors/door.dm:110)  may sleep
rt.def("/obj/machinery/door/proc/bumpopen", function* bumpopen(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "operating"))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	if (!truthy((yield* g.callName(f, live(f.src), "requiresID", [])))) {
		user = null;
	}
	if ((truthy(rt.sv(f, "density")) && !truthy(rt.sv(f, "emagged")))) {
		if (truthy((yield* g.srcCall(f, "allowed", live(user))))) {
			yield* g.srcCall(f, "open");
		} else {
			yield* g.srcCall(f, "do_animate", "deny");
		}
	}
	return live(f.dot);
}, true);

// /obj/machinery/door/proc/attack_ai  (code/game/machinery/doors/door.dm:123)  may sleep
rt.def("/obj/machinery/door/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/door/proc/attack_hand  (code/game/machinery/doors/door.dm:126)  may sleep
rt.def("/obj/machinery/door/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "try_to_activate_door", live(user)));
}, true);

// /obj/machinery/door/proc/attack_tk  (code/game/machinery/doors/door.dm:130)  may sleep
rt.def("/obj/machinery/door/proc/attack_tk", function* attack_tk(f: Frame) {
	if ((truthy((yield* g.srcCall(f, "requiresID"))) && !truthy((yield* g.srcCall(f, "allowed", null))))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/door/proc/try_to_activate_door  (code/game/machinery/doors/door.dm:135)  may sleep
rt.def("/obj/machinery/door/proc/try_to_activate_door", function* try_to_activate_door(f: Frame, user: Value) {
	let alert_user: Value = null, deny_reason: Value = null;
	f.vars = () => [user, alert_user, deny_reason];
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if ((truthy(rt.sv(f, "operating")) || truthy(rt.sv(f, "emagged")))) {
		return live(f.dot);
	}
	alert_user = live(user);
	if (!truthy((yield* g.srcCall(f, "requiresID")))) {
		user = null;
	}
	if (truthy((yield* g.srcCall(f, "allowed", live(user))))) {
		if (truthy(rt.sv(f, "density"))) {
			if (truthy((deny_reason = (yield* g.srcCall(f, "open_failure_reason"))))) {
				yield* g.srcCall(f, "balloon_alert", live(alert_user), live(deny_reason));
			}
			yield* g.srcCall(f, "open");
		} else {
			yield* g.srcCall(f, "close");
		}
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "density"))) return f.dot;
	yield* g.srcCall(f, "do_animate", "deny");
	return f.dot;
}, true);

// /obj/machinery/door/proc/open_failure_reason  (code/game/machinery/doors/door.dm:154)
rt.def("/obj/machinery/door/proc/open_failure_reason", function open_failure_reason(f: Frame) {
	return null;
});

// /obj/machinery/door/proc/allowed  (code/game/machinery/doors/door.dm:159)
rt.def("/obj/machinery/door/proc/allowed", function allowed(f: Frame) {
	if (truthy(rt.sv(f, "emergency"))) {
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["M"] });

// /obj/machinery/door/proc/attackby  (code/game/machinery/doors/door.dm:168)  may sleep
rt.def("/obj/machinery/door/proc/attackby", function* attackby(f: Frame) {
	if ((!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm") && (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/twohanded/fireaxe")) ? 1 : 0))))) {
		yield* g.srcCall(f, "try_to_crowbar", live(f.args[0]), live(f.args[1]));
		return 1;
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			yield* g.srcCall(f, "try_to_weld", live(f.args[0]), live(f.args[1]));
			return 1;
		} else {
			if ((!truthy(rt.bitAnd(rt.fv(f, "flags", live(f.args[0])), 4)) && !isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm"))) {
				yield* g.srcCall(f, "try_to_activate_door", live(f.args[1]));
				return 1;
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/door/proc/run_obj_armor  (code/game/machinery/doors/door.dm:180)
rt.def("/obj/machinery/door/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if ((isEqual(live(f.args[2]), "melee") && rt.lt(live(f.args[0]), rt.sv(f, "damage_deflection")))) {
		return 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// /obj/machinery/door/proc/take_damage  (code/game/machinery/doors/door.dm:185)  may sleep
rt.def("/obj/machinery/door/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && rt.gt(rt.sv(f, "obj_integrity"), 0))) return f.dot;
	if (!(rt.ge(live(f.args[0]), 10) && truthy(rt.op(f, "Prob", [], [30])))) return f.dot;
	if (!truthy(rt.sv(f, "spark_system"))) return f.dot; // tg bug: a door hit while being deleted has no spark system left (Destroy nulls it)
	yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// /obj/machinery/door/proc/play_attack_sound  (code/game/machinery/doors/door.dm:191)
rt.def("/obj/machinery/door/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(rt.sv(f, "glass"))) {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/glasshit.ogg"), 90, 1]);
		} else {
			if (truthy(live(damage_amount))) {
				rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/smash.ogg"), 50, 1]);
			} else {
				rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/tap.ogg"), 50, 1]);
			}
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/machinery/door/proc/emp_act  (code/game/machinery/doors/door.dm:203)  may sleep
rt.def("/obj/machinery/door/proc/emp_act", function* emp_act(f: Frame) {
	if ((truthy(rt.op(f, "Prob", [], [divide(20, live(f.args[0]))])) && (truthy((rt.istype(live(f.src), T("/obj/machinery/door/airlock")) ? 1 : 0)) || truthy((rt.istype(live(f.src), T("/obj/machinery/door/window")) ? 1 : 0))))) {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/machinery/door/proc/open")]);
	}
	if (truthy(rt.op(f, "Prob", [], [divide(40, live(f.args[0]))]))) {
		if (isEqual(rt.sv(f, "secondsElectrified"), 0)) {
			rt.setSv(f, "secondsElectrified", -1);
			rt.modSrcVar(f, "shockedby", fmt("[＀]EM Pulse", [(yield* g.call(f, P("/proc/time_stamp"), null, []))]), add);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/door/proc/unelectrify")])), 300]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/door/proc/update_icon  (code/game/machinery/doors/door.dm:217)
rt.def("/obj/machinery/door/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "density"))) {
		rt.setSv(f, "icon_state", "door1");
	} else {
		rt.setSv(f, "icon_state", "door0");
	}
	return f.dot;
});

// /obj/machinery/door/proc/do_animate  (code/game/machinery/doors/door.dm:222)
rt.def("/obj/machinery/door/proc/do_animate", function do_animate(f: Frame, animation: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(animation);
	if ($0 === "opening") {
		if (truthy(rt.sv(f, "panel_open"))) {
			rt.call(f, P("/proc/flick"), null, ["o_doorc0", live(f.src)]);
		} else {
			rt.call(f, P("/proc/flick"), null, ["doorc0", live(f.src)]);
		}
	} else if ($0 === "closing") {
		if (truthy(rt.sv(f, "panel_open"))) {
			rt.call(f, P("/proc/flick"), null, ["o_doorc1", live(f.src)]);
		} else {
			rt.call(f, P("/proc/flick"), null, ["doorc1", live(f.src)]);
		}
	} else if ($0 === "deny") {
		if (truthy(rt.sv(f, "stat"))) return f.dot;
		rt.call(f, P("/proc/flick"), null, ["door_deny", live(f.src)]);
	}
	return f.dot;
});

// /obj/machinery/door/proc/open  (code/game/machinery/doors/door.dm:239)  may sleep
rt.def("/obj/machinery/door/proc/open", function* open(f: Frame) {
	if (!truthy(rt.sv(f, "density"))) {
		return 1;
	}
	if (truthy(rt.sv(f, "operating"))) {
		return live(f.dot);
	}
	rt.setSv(f, "operating", 1);
	yield* g.srcCall(f, "do_animate", "opening");
	yield* g.srcCall(f, "set_opacity", 0);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	rt.setSv(f, "density", 0);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	rt.setSv(f, "layer", 2.700000047683716);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "set_opacity", 0);
	rt.setSv(f, "operating", 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	yield* g.srcCall(f, "update_freelook_sight");
	if (truthy(rt.sv(f, "autoclose"))) {
		rt.spawnTail(f, rt.sv(f, "autoclose"), "/obj/machinery/door/proc/open: spawn at game/machinery/doors/door.dm:256");
	}
	return 1;
}, true);

// a spawn(rt.srcVarI(f, $ic[68])) body of /obj/machinery/door/proc/open, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/door/proc/open: spawn at game/machinery/doors/door.dm:256", function* (f: Frame) {
	yield* g.srcCall(f, "close");
	return null;
});

// /obj/machinery/door/proc/close  (code/game/machinery/doors/door.dm:266)  may sleep
rt.def("/obj/machinery/door/proc/close", function* close(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if (truthy(rt.sv(f, "density"))) {
		return 1;
	}
	if (truthy(rt.sv(f, "operating"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "safe"))) {
		M = null;
		rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if ((truthy(rt.fv(f, "density", live(M))) && !isEqual(live(M), live(f.src)))) {
				if (truthy(rt.sv(f, "autoclose"))) {
					yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/door/proc/autoclose")])), 60]);
				}
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
	}
	rt.setSv(f, "operating", 1);
	yield* g.srcCall(f, "do_animate", "closing");
	rt.setSv(f, "layer", rt.sv(f, "closingLayer"));
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	rt.setSv(f, "density", 1);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	yield* g.srcCall(f, "update_icon");
	if ((truthy(rt.sv(f, "visible")) && !truthy(rt.sv(f, "glass")))) {
		yield* g.srcCall(f, "set_opacity", 1);
	}
	rt.setSv(f, "operating", 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	yield* g.srcCall(f, "update_freelook_sight");
	if (truthy(rt.sv(f, "safe"))) {
		yield* g.srcCall(f, "CheckForMobs");
	} else {
		yield* g.srcCall(f, "crush");
	}
	return 1;
}, true);

// /obj/machinery/door/proc/CheckForMobs  (code/game/machinery/doors/door.dm:291)  may sleep
rt.def("/obj/machinery/door/proc/CheckForMobs", function* CheckForMobs(f: Frame) {
	if (!truthy(rt.locateIn(f, T("/mob/living"), rt.getStep(f, live(f.src), 0)))) return f.dot;
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	yield* g.srcCall(f, "open");
	return f.dot;
}, true);

// /obj/machinery/door/proc/crush  (code/game/machinery/doors/door.dm:296)  may sleep
rt.def("/obj/machinery/door/proc/crush", function* crush(f: Frame) {
	let L: Value = null, location: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [L, location, M, $e];
	L = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>＀ closes on ＀, crushing them!</span>", [live(f.src), live(L)]), fmt("<span class='userdanger'>＀ closes on you and crushes you!</span>", [live(f.src)])]);
		if (truthy((rt.istype(live(L), T("/mob/living/carbon/alien")) ? 1 : 0))) {
			yield* g.callName(f, live(L), "adjustBruteLoss", [22.5]);
			yield* g.callName(f, live(L), "emote", ["roar"]);
		} else {
			if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
				yield* g.callName(f, live(L), "adjustBruteLoss", [15]);
				yield* g.callName(f, live(L), "emote", ["scream"]);
				yield* g.callName(f, live(L), "Knockdown", [100]);
			} else {
				if (truthy((rt.istype(live(L), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
					yield* g.callName(f, live(L), "adjustBruteLoss", [15]);
					yield* g.callName(f, live(L), "Knockdown", [100]);
				} else {
					yield* g.callName(f, live(L), "adjustBruteLoss", [15]);
				}
			}
		}
		location = rt.getStep(f, live(f.src), 0);
		yield* g.callName(f, live(L), "add_splatter_floor", [live(location)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/obj/mecha"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "take_damage", [15]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/door/proc/autoclose  (code/game/machinery/doors/door.dm:317)  may sleep
rt.def("/obj/machinery/door/proc/autoclose", function* autoclose(f: Frame) {
	if (!(((((!(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) && !truthy(rt.sv(f, "density"))) && !truthy(rt.sv(f, "operating"))) && !truthy(rt.sv(f, "locked"))) && !truthy(rt.sv(f, "welded"))) && truthy(rt.sv(f, "autoclose")))) return f.dot;
	yield* g.srcCall(f, "close");
	return f.dot;
}, true);

// /obj/machinery/door/proc/hasPower  (code/game/machinery/doors/door.dm:324)
rt.def("/obj/machinery/door/proc/hasPower", function hasPower(f: Frame) {
	return (!truthy(rt.bitAnd(rt.sv(f, "stat"), 2)) ? 1 : 0);
});

// /obj/machinery/door/proc/update_freelook_sight  (code/game/machinery/doors/door.dm:327)
rt.def("/obj/machinery/door/proc/update_freelook_sight", function update_freelook_sight(f: Frame) {
	if (!(!truthy(rt.sv(f, "glass")) && truthy(rt.gl("cameranet")))) return f.dot;
	rt.callName(f, rt.gl("cameranet"), "updateVisibility", [live(f.src), 0]);
	return f.dot;
});

// /obj/machinery/door/proc/BlockSuperconductivity  (code/game/machinery/doors/door.dm:331)
rt.def("/obj/machinery/door/proc/BlockSuperconductivity", function BlockSuperconductivity(f: Frame) {
	if ((truthy(rt.sv(f, "opacity")) || truthy(rt.sv(f, "heat_proof")))) {
		return 1;
	}
	return 0;
});

// /obj/machinery/door/proc/hostile_lockdown  (code/game/machinery/doors/door.dm:348)  may sleep
rt.def("/obj/machinery/door/proc/hostile_lockdown", function* hostile_lockdown(f: Frame, origin: Value) {
	f.vars = () => [origin];
	if (truthy(rt.sv(f, "stat"))) return f.dot;
	yield* g.srcCall(f, "close");
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// /obj/machinery/door/proc/disable_lockdown  (code/game/machinery/doors/door.dm:352)  may sleep
rt.def("/obj/machinery/door/proc/disable_lockdown", function* disable_lockdown(f: Frame) {
	if (truthy(rt.sv(f, "stat"))) return f.dot;
	yield* g.srcCall(f, "open");
	return f.dot;
}, true);

// /obj/machinery/door/proc/ex_act  (code/game/machinery/doors/door.dm:357)
rt.def("/obj/machinery/door/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(live(severity))) {
		$0 = rt.call(f, P("/proc/max"), null, [1, subtract(live(severity), 1)]);
	} else {
		$0 = 0;
	}
	rt.callSuper(f, [$0, live(target)]);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/door/proc/GetExplosionBlock  (code/game/machinery/doors/door.dm:360)
rt.def("/obj/machinery/door/proc/GetExplosionBlock", function GetExplosionBlock(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "density"))) {
		$0 = rt.sv(f, "real_explosion_block");
	} else {
		$0 = 0;
	}
	return $0;
});
