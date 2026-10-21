// From code/modules/mob/mob_movement.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/proc/CanPass  (code/modules/mob/mob_movement.dm:2)
rt.def("/mob/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(height), 0)) {
		return 1;
	}
	if ((truthy((rt.istype(live(mover), T("/obj/item/projectile")) ? 1 : 0)) || truthy(rt.fv(f, "throwing", live(mover))))) {
		return ((!truthy(rt.sv(f, "density")) ? 1 : 0) || rt.sv(f, "lying"));
	}
	if (truthy(rt.callName(f, live(mover), "checkpass", [16]))) {
		return 1;
	}
	if (isEqual(rt.sv(f, "buckled"), live(mover))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/ismob"), null, [live(mover)]))) {
		if (truthy((rt.isIn(f, live(mover), rt.sv(f, "buckled_mobs")) ? 1 : 0))) {
			return 1;
		}
	}
	return (((!truthy(rt.fv(f, "density", live(mover))) ? 1 : 0) || (!truthy(rt.sv(f, "density")) ? 1 : 0)) || rt.sv(f, "lying"));
});

// /client/verb/moveup  (code/modules/mob/mob_movement.dm:21)  may sleep
rt.def("/client/verb/moveup", function* moveup(f: Frame) {
	yield* g.srcCall(f, "Move", rt.getStep(f, rt.sv(f, "mob"), 1), 1);
	return f.dot;
}, true, { verb: { name: ".moveup" } });

// /client/verb/movedown  (code/modules/mob/mob_movement.dm:26)  may sleep
rt.def("/client/verb/movedown", function* movedown(f: Frame) {
	yield* g.srcCall(f, "Move", rt.getStep(f, rt.sv(f, "mob"), 2), 2);
	return f.dot;
}, true, { verb: { name: ".movedown" } });

// /client/verb/moveright  (code/modules/mob/mob_movement.dm:31)  may sleep
rt.def("/client/verb/moveright", function* moveright(f: Frame) {
	yield* g.srcCall(f, "Move", rt.getStep(f, rt.sv(f, "mob"), 4), 4);
	return f.dot;
}, true, { verb: { name: ".moveright" } });

// /client/verb/moveleft  (code/modules/mob/mob_movement.dm:36)  may sleep
rt.def("/client/verb/moveleft", function* moveleft(f: Frame) {
	yield* g.srcCall(f, "Move", rt.getStep(f, rt.sv(f, "mob"), 8), 8);
	return f.dot;
}, true, { verb: { name: ".moveleft" } });

// /client/proc/Northeast  (code/modules/mob/mob_movement.dm:39)
rt.def("/client/proc/Northeast", function Northeast(f: Frame) {
	rt.callSrc(f, "swap_hand", []);
	return live(f.dot);
});

// /client/proc/Southeast  (code/modules/mob/mob_movement.dm:44)  may sleep
rt.def("/client/proc/Southeast", function* Southeast(f: Frame) {
	yield* g.srcCall(f, "attack_self");
	return live(f.dot);
}, true);

// /client/proc/Southwest  (code/modules/mob/mob_movement.dm:49)
rt.def("/client/proc/Southwest", function Southwest(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.usr), T("/mob/living/carbon")) ? 1 : 0))) {
		rt.callName(f, (C = live(f.usr)), "toggle_throw_mode", []);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>This mob type cannot throw items.</span>"]);
	}
	return live(f.dot);
});

// /client/proc/Northwest  (code/modules/mob/mob_movement.dm:58)  may sleep
rt.def("/client/proc/Northwest", function* Northwest(f: Frame) {
	if (!truthy((yield* g.callName(f, live(f.usr), "get_active_held_item", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You have nothing to drop in your hand!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "drop_item", []);
	return f.dot;
}, true);

// /client/verb/delete_key_pressed  (code/modules/mob/mob_movement.dm:67)  may sleep
rt.def("/client/verb/delete_key_pressed", function* delete_key_pressed(f: Frame) {
	if (!truthy(rt.fv(f, "pulling", live(f.usr)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You are not pulling anything.</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "stop_pulling", []);
	return f.dot;
}, true, { hidden: true });

// /client/verb/swap_hand  (code/modules/mob/mob_movement.dm:77)
rt.def("/client/verb/swap_hand", function swap_hand(f: Frame) {
	if (!truthy(rt.sv(f, "mob"))) return f.dot;
	rt.callName(f, rt.sv(f, "mob"), "swap_hand", []);
	return f.dot;
}, false, { verb: { name: "Swap hands", category: "IC" } });

// /client/verb/attack_self  (code/modules/mob/mob_movement.dm:82)  may sleep
rt.def("/client/verb/attack_self", function* attack_self(f: Frame) {
	if (truthy(rt.sv(f, "mob"))) {
		yield* g.callName(f, rt.sv(f, "mob"), "mode", []);
	}
	return live(f.dot);
}, true, { hidden: true });

// /client/verb/drop_item  (code/modules/mob/mob_movement.dm:88)  may sleep
rt.def("/client/verb/drop_item", function* drop_item(f: Frame) {
	if (!truthy((rt.istype(rt.sv(f, "mob"), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		yield* g.callName(f, rt.sv(f, "mob"), "drop_item_v", []);
	}
	return live(f.dot);
}, true, { hidden: true });

// /client/verb/Center  empty
rt.def("/client/verb/Center", undefined, false, { verb: { name: ".center" } });

// /client/proc/Center  (code/modules/mob/mob_movement.dm:94)  may sleep
rt.def("/client/proc/Center", function* Center(f: Frame) {
	let O: Value = null;
	f.vars = () => [O];
	if (truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "mob")), T("/obj")) ? 1 : 0))) {
		O = rt.fv(f, "loc", rt.sv(f, "mob"));
		if (truthy(rt.fv(f, "canmove", rt.sv(f, "mob")))) {
			return (yield* g.callName(f, live(O), "relaymove", [rt.sv(f, "mob"), 0]));
		}
	}
	return live(f.dot);
}, true);

// /client/proc/Move_object  (code/modules/mob/mob_movement.dm:102)  may sleep
rt.def("/client/proc/Move_object", function* Move_object(f: Frame, direct: Value) {
	f.vars = () => [direct];
	if ((truthy(rt.sv(f, "mob")) && truthy(rt.fv(f, "control_object", rt.sv(f, "mob"))))) {
		if (truthy(rt.gv(f, "density", rt.fv(f, "control_object", rt.sv(f, "mob"))))) {
			yield* g.call(f, P("/proc/step"), null, [rt.fv(f, "control_object", rt.sv(f, "mob")), live(direct)]);
			if (!truthy(rt.fv(f, "control_object", rt.sv(f, "mob")))) {
				return live(f.dot);
			}
			yield* g.callName(f, rt.fv(f, "control_object", rt.sv(f, "mob")), "setDir", [live(direct)]);
		} else {
			rt.setFv(f, "loc", rt.fv(f, "control_object", rt.sv(f, "mob")), rt.getStep(f, rt.fv(f, "control_object", rt.sv(f, "mob")), live(direct)));
		}
	}
	return live(f.dot);
}, true);

// /client/proc/Move  (code/modules/mob/mob_movement.dm:115)  may sleep
rt.def("/client/proc/Move", function* Move(f: Frame) {
	let old_move_delay: Value = null, L: Value = null, O: Value = null, delay: Value = null;
	f.vars = () => [old_move_delay, L, O, delay];
	if (rt.lt(rt.worldTime(f), rt.sv(f, "move_delay"))) {
		return 0;
	}
	old_move_delay = rt.sv(f, "move_delay");
	rt.setSv(f, "move_delay", add(rt.worldTime(f), rt.fv(f, "tick_lag", rt.world())));
	if ((!truthy(rt.sv(f, "mob")) || !truthy(rt.fv(f, "loc", rt.sv(f, "mob"))))) {
		return 0;
	}
	if (truthy(rt.fv(f, "notransform", rt.sv(f, "mob")))) {
		return 0;
	}
	if (truthy(rt.fv(f, "control_object", rt.sv(f, "mob")))) {
		return (yield* g.srcCall(f, "Move_object", live(f.args[1])));
	}
	if (!truthy((rt.istype(rt.sv(f, "mob"), T("/mob/living")) ? 1 : 0))) {
		rt.setFv(f, "glide_size", rt.sv(f, "mob"), (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [divide(32, (yield* g.call(f, P("/proc/max"), null, [divide((yield* g.callName(f, rt.sv(f, "mob"), "movement_delay", [])), rt.fv(f, "tick_lag", rt.world())), 1]))), 32]))])));
		return (yield* g.callName(f, rt.sv(f, "mob"), "Move", [live(f.args[0]), live(f.args[1])]));
	}
	if (isEqual(rt.fv(f, "stat", rt.sv(f, "mob")), 2)) {
		yield* g.callName(f, rt.sv(f, "mob"), "ghostize", []);
		return 0;
	}
	if (truthy(rt.sv(f, "moving"))) {
		return 0;
	}
	if (truthy(rt.fv(f, "force_moving", rt.sv(f, "mob")))) {
		return 0;
	}
	if (truthy((rt.istype(rt.sv(f, "mob"), T("/mob/living")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "incorporeal_move", (L = rt.sv(f, "mob"))))) {
			yield* g.srcCall(f, "Process_Incorpmove", live(f.args[1]));
			return 0;
		}
	}
	if (truthy(rt.fv(f, "remote_control", rt.sv(f, "mob")))) {
		return (yield* g.callName(f, rt.fv(f, "remote_control", rt.sv(f, "mob")), "relaymove", [rt.sv(f, "mob"), live(f.args[1])]));
	}
	if (truthy((rt.istype(rt.sv(f, "mob"), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		return (yield* g.srcCall(f, "AIMove", live(f.args[0]), live(f.args[1]), rt.sv(f, "mob")));
	}
	if (truthy((yield* g.srcCall(f, "Process_Grab")))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "buckled", rt.sv(f, "mob")))) {
		return (yield* g.callName(f, rt.fv(f, "buckled", rt.sv(f, "mob")), "relaymove", [rt.sv(f, "mob"), live(f.args[1])]));
	}
	if (!truthy(rt.fv(f, "canmove", rt.sv(f, "mob")))) {
		return 0;
	}
	if ((truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "mob")), T("/obj")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", rt.sv(f, "mob"))]))))) {
		return (yield* g.callName(f, (O = rt.fv(f, "loc", rt.sv(f, "mob"))), "relaymove", [rt.sv(f, "mob"), live(f.args[1])]));
	}
	if (!truthy((yield* g.callName(f, rt.sv(f, "mob"), "Process_Spacemove", [live(f.args[1])])))) {
		return 0;
	}
	rt.setSv(f, "moving", 1);
	delay = (yield* g.callName(f, rt.sv(f, "mob"), "movement_delay", []));
	rt.setFv(f, "glide_size", rt.sv(f, "mob"), (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [divide(32, (yield* g.call(f, P("/proc/max"), null, [divide(live(delay), rt.fv(f, "tick_lag", rt.world())), 1]))), 32]))])));
	if (rt.gt(add(add(live(old_move_delay), multiply(live(delay), 1.25)), 0.75), rt.worldTime(f))) {
		rt.setSv(f, "move_delay", add(live(old_move_delay), live(delay)));
	} else {
		rt.setSv(f, "move_delay", add(live(delay), rt.worldTime(f)));
	}
	if (truthy(rt.fv(f, "confused", rt.sv(f, "mob")))) {
		if (rt.gt(rt.fv(f, "confused", rt.sv(f, "mob")), 40)) {
			yield* g.call(f, P("/proc/step"), null, [rt.sv(f, "mob"), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
		} else {
			if (truthy(rt.op(f, "Prob", [], [multiply(rt.fv(f, "confused", rt.sv(f, "mob")), 1.5)]))) {
				yield* g.call(f, P("/proc/step"), null, [rt.sv(f, "mob"), (yield* g.call(f, P("/proc/angle2dir"), null, [add((yield* g.call(f, P("/proc/dir2angle"), null, [live(f.args[1])])), rt.op(f, "PickUnweighted", [2], [90, -90]))]))]);
			} else {
				if (truthy(rt.op(f, "Prob", [], [multiply(rt.fv(f, "confused", rt.sv(f, "mob")), 3)]))) {
					yield* g.call(f, P("/proc/step"), null, [rt.sv(f, "mob"), (yield* g.call(f, P("/proc/angle2dir"), null, [add((yield* g.call(f, P("/proc/dir2angle"), null, [live(f.args[1])])), rt.op(f, "PickUnweighted", [2], [45, -45]))]))]);
				} else {
					yield* g.call(f, P("/proc/step"), null, [rt.sv(f, "mob"), live(f.args[1])]);
				}
			}
		}
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	rt.setSv(f, "moving", 0);
	if ((truthy(rt.sv(f, "mob")) && truthy(live(f.dot)))) {
		if (truthy(rt.fv(f, "throwing", rt.sv(f, "mob")))) {
			yield* g.callName(f, rt.fv(f, "throwing", rt.sv(f, "mob")), "finalize", [0]);
		}
	}
	return live(f.dot);
}, true, { args: ["n", "direct"] });

// /mob/proc/Moved  (code/modules/mob/mob_movement.dm:192)  may sleep
rt.def("/mob/proc/Moved", function* Moved(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "on_mob_move", [live(f.args[1]), live(f.src), live(f.args[0])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["oldLoc", "dir"] });

// /mob/proc/setDir  (code/modules/mob/mob_movement.dm:197)  may sleep
rt.def("/mob/proc/setDir", function* setDir(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "on_mob_turn", [live(f.args[0]), live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["newDir"] });

// /client/proc/Process_Grab  (code/modules/mob/mob_movement.dm:206)  may sleep
rt.def("/client/proc/Process_Grab", function* Process_Grab(f: Frame) {
	if (!truthy(rt.fv(f, "pulledby", rt.sv(f, "mob")))) return f.dot;
	if (truthy((yield* g.callName(f, rt.sv(f, "mob"), "incapacitated", ["ignore_restraints", 1], rt.Args.Named)))) {
		rt.setSv(f, "move_delay", add(rt.worldTime(f), 10));
		return 1;
	} else {
		if (truthy((yield* g.callName(f, rt.sv(f, "mob"), "restrained", ["ignore_grab", 1], rt.Args.Named)))) {
			rt.setSv(f, "move_delay", add(rt.worldTime(f), 10));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You're restrained! You can't move!</span>"]);
			return 1;
		} else {
			return (yield* g.callName(f, rt.sv(f, "mob"), "resist_grab", [1]));
		}
	}
	return f.dot;
}, true);

// /client/proc/Process_Incorpmove  (code/modules/mob/mob_movement.dm:222)  may sleep
rt.def("/client/proc/Process_Incorpmove", function* Process_Incorpmove(f: Frame, direct: Value) {
	let mobloc: Value = null, L: Value = null, locx: Value = null, locy: Value = null, limit: Value = null, _T: Value = null, stepTurf: Value = null, S: Value = null, R: Value = null;
	let $0: any, $e: any;
	f.vars = () => [direct, mobloc, L, locx, locy, limit, _T, stepTurf, S, R, $0, $e];
	mobloc = rt.getStep(f, rt.sv(f, "mob"), 0);
	if (!truthy((rt.istype(rt.sv(f, "mob"), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	$0 = rt.gv(f, "incorporeal_move", (L = rt.sv(f, "mob")));
	if ($0 === 1) {
		rt.setFv(f, "loc", live(L), rt.getStep(f, live(L), live(direct)));
		yield* g.callName(f, live(L), "setDir", [live(direct)]);
	} else if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			locx = null;
			locy = null;
			$0 = live(direct);
			if ($0 === 1) {
				locx = rt.fv(f, "x", live(mobloc));
				if (rt.gt((locy = add(rt.fv(f, "y", live(mobloc)), 2)), rt.fv(f, "maxy", rt.world()))) {
					return live(f.dot);
				}
			} else if ($0 === 2) {
				locx = rt.fv(f, "x", live(mobloc));
				if (rt.lt((locy = subtract(rt.fv(f, "y", live(mobloc)), 2)), 1)) {
					return live(f.dot);
				}
			} else if ($0 === 4) {
				locy = rt.fv(f, "y", live(mobloc));
				if (rt.gt((locx = add(rt.fv(f, "x", live(mobloc)), 2)), rt.fv(f, "maxx", rt.world()))) {
					return live(f.dot);
				}
			} else if ($0 === 8) {
				locy = rt.fv(f, "y", live(mobloc));
				if (rt.lt((locx = subtract(rt.fv(f, "x", live(mobloc)), 2)), 1)) {
					return live(f.dot);
				}
			} else {
				return live(f.dot);
			}
			rt.setFv(f, "loc", live(L), rt.locate(live(locx), live(locy), rt.fv(f, "z", live(mobloc))));
			limit = 2;
			_T = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/getline"), null, [live(mobloc), rt.fv(f, "loc", live(L))])), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/ninja/shadow"), [live(_T), rt.fv(f, "dir", live(L))]);
				limit = rt.inc(live(limit), -1);
				if (rt.le(live(limit), 0)) {
					break;
				}
			}
			rt.endFor(f, 0);
		} else {
			yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/ninja/shadow"), [live(mobloc), rt.fv(f, "dir", live(L))]);
			rt.setFv(f, "loc", live(L), rt.getStep(f, live(L), live(direct)));
		}
		yield* g.callName(f, live(L), "setDir", [live(direct)]);
	} else if ($0 === 3) {
		stepTurf = rt.getStep(f, live(L), live(direct));
		S = null;
		rt.forList(f, 0, live(stepTurf), T("/obj/effect/decal/cleanable/salt"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='warning'>＀ bars your passage!</span>", [live(S)])]);
			if (truthy((rt.istype(live(L), T("/mob/living/simple_animal/revenant")) ? 1 : 0))) {
				yield* g.callName(f, (R = live(L)), "reveal", [20]);
				yield* g.callName(f, live(R), "stun", [20]);
			}
			return live(f.dot);
		}
		rt.endFor(f, 0);
		if (truthy(rt.bitAnd(rt.fv(f, "flags", live(stepTurf)), 1))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='warning'>Holy energies block your path.</span>"]);
		} else {
			rt.setFv(f, "loc", live(L), rt.getStep(f, live(L), live(direct)));
			yield* g.callName(f, live(L), "setDir", [live(direct)]);
		}
	}
	return 1;
}, true);

// /mob/proc/Process_Spacemove  (code/modules/mob/mob_movement.dm:290)  may sleep
rt.def("/mob/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	let backup: Value = null;
	f.vars = () => [backup];
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if (truthy((backup = (yield* g.srcCall(f, "get_spacemove_backup"))))) {
		if (((truthy((rt.istype(live(backup), T("/atom/movable")) ? 1 : 0)) && truthy(live(f.args[0]))) && !truthy(rt.fv(f, "anchored", live(backup))))) {
			if (truthy((yield* g.callName(f, live(backup), "newtonian_move", [(yield* g.call(f, P("/proc/turn"), null, [live(f.args[0]), 180]))])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='info'>You push off of ＀ to propel yourself.</span>", [live(backup)])]);
			}
		}
		return 1;
	}
	return 0;
}, true, { args: ["movement_dir"] });

// /mob/proc/get_spacemove_backup  (code/modules/mob/mob_movement.dm:301)  may sleep
rt.def("/mob/proc/get_spacemove_backup", function* get_spacemove_backup(f: Frame) {
	let A: Value = null, turf: Value = null, AM: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [A, turf, AM, M, $e];
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, rt.getStep(f, live(f.src), 0)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((yield* g.call(f, P("/proc/isarea"), null, [live(A)])))) {
			continue;
		}
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(A)])))) {
			if (truthy((rt.istype((turf = live(A)), T("/turf/open/space")) ? 1 : 0))) {
				continue;
			}
			if ((!truthy(rt.fv(f, "density", live(turf))) && !truthy((yield* g.srcCall(f, "mob_negates_gravity"))))) {
				continue;
			}
			return live(A);
		} else {
			if (isEqual((AM = live(A)), rt.sv(f, "buckled"))) {
				continue;
			}
			if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
				if (truthy(rt.gv(f, "buckled", (M = live(AM))))) {
					continue;
				}
			}
			if ((!truthy((yield* g.callName(f, live(AM), "CanPass", [live(f.src)]))) || truthy(rt.fv(f, "density", live(AM))))) {
				if (truthy(rt.fv(f, "anchored", live(AM)))) {
					return live(AM);
				}
				if (isEqual(rt.sv(f, "pulling"), live(AM))) {
					continue;
				}
				f.dot = live(AM);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/proc/mob_has_gravity  (code/modules/mob/mob_movement.dm:327)
rt.def("/mob/proc/mob_has_gravity", function mob_has_gravity(f: Frame) {
	return rt.callSrc(f, "has_gravity", []);
});

// /mob/proc/Move_Pulled  (code/modules/mob/mob_movement.dm:334)  may sleep
rt.def("/mob/proc/Move_Pulled", function* Move_Pulled(f: Frame, A: Value) {
	let L: Value = null;
	f.vars = () => [A, L];
	if (!truthy(rt.sv(f, "pulling"))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "anchored", rt.sv(f, "pulling"))) || !truthy((yield* g.callName(f, rt.sv(f, "pulling"), "Adjacent", [live(f.src)]))))) {
		yield* g.srcCall(f, "stop_pulling");
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.sv(f, "pulling"), T("/mob/living")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "buckled", (L = rt.sv(f, "pulling")))) && truthy(rt.gv(f, "buckle_prevents_pull", rt.fv(f, "buckled", live(L)))))) {
			yield* g.srcCall(f, "stop_pulling");
			return live(f.dot);
		}
	}
	if ((isEqual(live(A), rt.sv(f, "loc")) && truthy(rt.fv(f, "density", rt.sv(f, "pulling"))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "Process_Spacemove", rt.getDir(f, rt.fv(f, "loc", rt.sv(f, "pulling")), live(A)))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/step"), null, [rt.sv(f, "pulling"), rt.getDir(f, rt.fv(f, "loc", rt.sv(f, "pulling")), live(A))]);
	return f.dot;
}, true);

// /client/proc/check_has_body_select  (code/modules/mob/mob_movement.dm:363)
rt.def("/client/proc/check_has_body_select", function check_has_body_select(f: Frame) {
	return (((rt.sv(f, "mob") && rt.fv(f, "hud_used", rt.sv(f, "mob"))) && rt.gv(f, "zone_select", rt.fv(f, "hud_used", rt.sv(f, "mob")))) && (rt.istype(rt.gv(f, "zone_select", rt.fv(f, "hud_used", rt.sv(f, "mob"))), T("/obj/screen/zone_sel")) ? 1 : 0));
});

// /client/verb/body_toggle_head  (code/modules/mob/mob_movement.dm:369)
rt.def("/client/verb/body_toggle_head", function body_toggle_head(f: Frame) {
	let next_in_line: Value = null, selector: Value = null;
	let $0: any;
	f.vars = () => [next_in_line, selector, $0];
	if (!truthy(rt.callSrc(f, "check_has_body_select", []))) {
		return live(f.dot);
	}
	next_in_line = null;
	$0 = rt.fv(f, "zone_selected", rt.sv(f, "mob"));
	if ($0 === "head") {
		next_in_line = "eyes";
	} else if ($0 === "eyes") {
		next_in_line = "mouth";
	} else {
		next_in_line = "head";
	}
	rt.callName(f, (selector = rt.gv(f, "zone_select", rt.fv(f, "hud_used", rt.sv(f, "mob")))), "set_selected_zone", [live(next_in_line), rt.sv(f, "mob")]);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-toggle-head" } });

// /client/verb/body_r_arm  (code/modules/mob/mob_movement.dm:388)
rt.def("/client/verb/body_r_arm", function body_r_arm(f: Frame) {
	let selector: Value = null;
	f.vars = () => [selector];
	if (!truthy(rt.callSrc(f, "check_has_body_select", []))) {
		return live(f.dot);
	}
	rt.callName(f, (selector = rt.gv(f, "zone_select", rt.fv(f, "hud_used", rt.sv(f, "mob")))), "set_selected_zone", ["r_arm", rt.sv(f, "mob")]);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-r-arm" } });

// /client/verb/body_chest  (code/modules/mob/mob_movement.dm:398)
rt.def("/client/verb/body_chest", function body_chest(f: Frame) {
	let selector: Value = null;
	f.vars = () => [selector];
	if (!truthy(rt.callSrc(f, "check_has_body_select", []))) {
		return live(f.dot);
	}
	rt.callName(f, (selector = rt.gv(f, "zone_select", rt.fv(f, "hud_used", rt.sv(f, "mob")))), "set_selected_zone", ["chest", rt.sv(f, "mob")]);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-chest" } });

// /client/verb/body_l_arm  (code/modules/mob/mob_movement.dm:408)
rt.def("/client/verb/body_l_arm", function body_l_arm(f: Frame) {
	let selector: Value = null;
	f.vars = () => [selector];
	if (!truthy(rt.callSrc(f, "check_has_body_select", []))) {
		return live(f.dot);
	}
	rt.callName(f, (selector = rt.gv(f, "zone_select", rt.fv(f, "hud_used", rt.sv(f, "mob")))), "set_selected_zone", ["l_arm", rt.sv(f, "mob")]);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-l-arm" } });

// /client/verb/body_r_leg  (code/modules/mob/mob_movement.dm:418)
rt.def("/client/verb/body_r_leg", function body_r_leg(f: Frame) {
	let selector: Value = null;
	f.vars = () => [selector];
	if (!truthy(rt.callSrc(f, "check_has_body_select", []))) {
		return live(f.dot);
	}
	rt.callName(f, (selector = rt.gv(f, "zone_select", rt.fv(f, "hud_used", rt.sv(f, "mob")))), "set_selected_zone", ["r_leg", rt.sv(f, "mob")]);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-r-leg" } });

// /client/verb/body_groin  (code/modules/mob/mob_movement.dm:428)
rt.def("/client/verb/body_groin", function body_groin(f: Frame) {
	let selector: Value = null;
	f.vars = () => [selector];
	if (!truthy(rt.callSrc(f, "check_has_body_select", []))) {
		return live(f.dot);
	}
	rt.callName(f, (selector = rt.gv(f, "zone_select", rt.fv(f, "hud_used", rt.sv(f, "mob")))), "set_selected_zone", ["groin", rt.sv(f, "mob")]);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-groin" } });

// /client/verb/body_l_leg  (code/modules/mob/mob_movement.dm:438)
rt.def("/client/verb/body_l_leg", function body_l_leg(f: Frame) {
	let selector: Value = null;
	f.vars = () => [selector];
	if (!truthy(rt.callSrc(f, "check_has_body_select", []))) {
		return live(f.dot);
	}
	rt.callName(f, (selector = rt.gv(f, "zone_select", rt.fv(f, "hud_used", rt.sv(f, "mob")))), "set_selected_zone", ["l_leg", rt.sv(f, "mob")]);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-l-leg" } });

// /client/verb/toggle_walk_run  (code/modules/mob/mob_movement.dm:449)  may sleep
rt.def("/client/verb/toggle_walk_run", function* toggle_walk_run(f: Frame) {
	if (!truthy(rt.sv(f, "mob"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "mob"), "toggle_move_intent", []);
	return f.dot;
}, true, { hidden: true, verb: { name: "toggle-walk-run" } });

// /mob/proc/toggle_move_intent  (code/modules/mob/mob_movement.dm:452)  may sleep
rt.def("/mob/proc/toggle_move_intent", function* toggle_move_intent(f: Frame) {
	let selector: Value = null;
	let $e: any;
	f.vars = () => [selector, $e];
	if (!(truthy(rt.sv(f, "hud_used")) && truthy(rt.fv(f, "static_inventory", rt.sv(f, "hud_used"))))) return f.dot;
	selector = null;
	rt.forList(f, 0, rt.fv(f, "static_inventory", rt.sv(f, "hud_used")), T("/obj/screen/mov_intent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		selector = $e;
		yield* g.callName(f, live(selector), "toggle", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
