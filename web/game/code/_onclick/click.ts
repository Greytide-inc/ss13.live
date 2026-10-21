// From code/_onclick/click.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/proc/changeNext_move  (code/_onclick/click.dm:21)
rt.def("/mob/proc/changeNext_move", function changeNext_move(f: Frame, num: Value) {
	rt.setSv(f, "next_move", add(rt.worldTime(f), multiply(add(live(num), rt.sv(f, "next_move_adjust")), rt.sv(f, "next_move_modifier"))));
	return f.dot;
});

// /atom/proc/Click  built in (BYOND provides it)
rt.def("/atom/proc/Click", undefined, false, { args: ["location", "control", "params"] });

// /atom/proc/Click  (code/_onclick/click.dm:35)  may sleep
rt.def("/atom/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	f.vars = () => [location, control, params];
	if (!truthy(rt.sv(f, "initialized"))) return f.dot;
	yield* g.callName(f, live(f.usr), "ClickOn", [live(f.src), live(params)]);
	return f.dot;
}, true);

// /atom/proc/DblClick  built in (BYOND provides it)
rt.def("/atom/proc/DblClick", undefined, false, { args: ["location", "control", "params"] });

// /atom/proc/DblClick  (code/_onclick/click.dm:39)  may sleep
rt.def("/atom/proc/DblClick", function* DblClick(f: Frame, location: Value, control: Value, params: Value) {
	f.vars = () => [location, control, params];
	if (!truthy(rt.sv(f, "initialized"))) return f.dot;
	yield* g.callName(f, live(f.usr), "DblClickOn", [live(f.src), live(params)]);
	return f.dot;
}, true);

// /atom/proc/MouseWheel  built in (BYOND provides it)
rt.def("/atom/proc/MouseWheel", undefined, false, { args: ["delta_x", "delta_y", "location", "control", "params"] });

// /atom/proc/MouseWheel  (code/_onclick/click.dm:43)  may sleep
rt.def("/atom/proc/MouseWheel", function* MouseWheel(f: Frame, delta_x: Value, delta_y: Value, location: Value, control: Value, params: Value) {
	f.vars = () => [delta_x, delta_y, location, control, params];
	if (!truthy(rt.sv(f, "initialized"))) return f.dot;
	yield* g.callName(f, live(f.usr), "MouseWheelOn", [live(f.src), live(delta_x), live(delta_y), live(params)]);
	return f.dot;
}, true);

// /mob/proc/ClickOn  (code/_onclick/click.dm:59)  may sleep
rt.def("/mob/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	let modifiers: Value = null, M: Value = null, W: Value = null;
	f.vars = () => [A, params, modifiers, M, W];
	if (rt.le(rt.worldTime(f), rt.sv(f, "next_click"))) {
		return live(f.dot);
	}
	rt.setSv(f, "next_click", add(rt.worldTime(f), 1));
	if ((truthy(rt.sv(f, "client")) && truthy(rt.fv(f, "click_intercept", rt.sv(f, "client"))))) {
		if (truthy((yield* g.callDyn(f, rt.fv(f, "click_intercept", rt.sv(f, "client")), "InterceptClickOn", [live(f.src), live(params), live(A)])))) {
			return live(f.dot);
		}
	}
	if ((truthy(rt.index((modifiers = (yield* g.call(f, P("/proc/params2list"), null, [live(params)]))), "shift")) && truthy(rt.at(live(modifiers), "middle")))) {
		yield* g.srcCall(f, "ShiftMiddleClickOn", live(A));
		return live(f.dot);
	}
	if ((truthy(rt.at(live(modifiers), "shift")) && truthy(rt.at(live(modifiers), "ctrl")))) {
		yield* g.srcCall(f, "CtrlShiftClickOn", live(A));
		return live(f.dot);
	}
	if (truthy(rt.at(live(modifiers), "middle"))) {
		yield* g.srcCall(f, "MiddleClickOn", live(A));
		return live(f.dot);
	}
	if (truthy(rt.at(live(modifiers), "shift"))) {
		yield* g.srcCall(f, "ShiftClickOn", live(A));
		return live(f.dot);
	}
	if (truthy(rt.at(live(modifiers), "alt"))) {
		yield* g.srcCall(f, "AltClickOn", live(A));
		return live(f.dot);
	}
	if (truthy(rt.at(live(modifiers), "ctrl"))) {
		yield* g.srcCall(f, "CtrlClickOn", live(A));
		return live(f.dot);
	}
	if (truthy((yield* g.callSrc(f, "incapacitated", ["ignore_restraints", 1], rt.Args.Named)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "face_atom", live(A));
	if (rt.gt(rt.sv(f, "next_move"), rt.worldTime(f))) {
		return live(f.dot);
	}
	if ((!truthy(rt.at(live(modifiers), "catcher")) && truthy((yield* g.callName(f, live(A), "IsObscured", []))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/mecha")) ? 1 : 0))) {
		return (yield* g.callName(f, (M = rt.sv(f, "loc")), "click_action", [live(A), live(f.src), live(params)]));
	}
	if (truthy((yield* g.srcCall(f, "restrained")))) {
		yield* g.srcCall(f, "changeNext_move", 10);
		yield* g.srcCall(f, "RestrainedClickOn", live(A));
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "in_throw_mode"))) {
		yield* g.srcCall(f, "throw_item", live(A));
		return live(f.dot);
	}
	if (isEqual((W = (yield* g.srcCall(f, "get_active_held_item"))), live(A))) {
		yield* g.callName(f, live(W), "attack_self", [live(f.src)]);
		yield* g.srcCall(f, "update_inv_hands");
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "DirectAccess", live(A))))) {
		if (truthy(live(W))) {
			yield* g.callName(f, live(W), "melee_attack_chain", [live(f.src), live(A), live(params)]);
		} else {
			if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)])))) {
				yield* g.srcCall(f, "changeNext_move", 8);
			}
			yield* g.srcCall(f, "UnarmedAttack", live(A));
		}
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, rt.sv(f, "loc"), "AllowClick", [])))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "CanReach", live(A), live(W))))) {
		if (truthy(live(W))) {
			yield* g.callName(f, live(W), "melee_attack_chain", [live(f.src), live(A), live(params)]);
		} else {
			if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)])))) {
				yield* g.srcCall(f, "changeNext_move", 8);
			}
			yield* g.srcCall(f, "UnarmedAttack", live(A), 1);
		}
	} else {
		if (truthy(live(W))) {
			yield* g.callName(f, live(W), "afterattack", [live(A), live(f.src), 0, live(params)]);
		} else {
			yield* g.srcCall(f, "RangedAttack", live(A), live(params));
		}
	}
	return f.dot;
}, true);

// /atom/proc/IsObscured  (code/_onclick/click.dm:149)
rt.def("/atom/proc/IsObscured", function IsObscured(f: Frame) {
	let _T: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [_T, AM, $e];
	if (!truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) {
		return 0;
	}
	if (!truthy((_T = rt.call(f, P("/proc/get_turf_pixel"), null, [live(f.src)])))) {
		return 0;
	}
	AM = null;
	rt.forList(f, 0, live(_T), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if (((truthy(rt.bitAnd(rt.fv(f, "flags", live(AM)), 32768)) && truthy(rt.fv(f, "density", live(AM)))) && rt.gt(rt.fv(f, "layer", live(AM)), rt.sv(f, "layer")))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /turf/proc/IsObscured  (code/_onclick/click.dm:160)
rt.def("/turf/proc/IsObscured", function IsObscured(f: Frame) {
	let AM: Value = null;
	let $e: any;
	f.vars = () => [AM, $e];
	AM = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if ((truthy(rt.bitAnd(rt.fv(f, "flags", live(AM)), 32768)) && truthy(rt.fv(f, "density", live(AM))))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /atom/movable/proc/CanReach  (code/_onclick/click.dm:166)  may sleep
rt.def("/atom/movable/proc/CanReach", function* CanReach(f: Frame, target: Value, tool: Value, view_only: Value) {
	let outer_storage: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [target, tool, view_only, outer_storage, $0, $1, $2, $3];
	if (live(view_only) === null) {
		view_only = 0;
	}
	if (((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(target)]))) || truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(target))])))) || truthy((yield* g.srcCall(f, "DirectAccess", live(target)))))) {
		if ((truthy((yield* g.srcCall(f, "Adjacent", live(target)))) || (truthy(live(tool)) && truthy((yield* g.call(f, P("/proc/CheckToolReach"), null, [live(f.src), live(target), rt.fv(f, "reach", live(tool))])))))) {
			return 1;
		}
	} else {
		if (isEqual((outer_storage = (yield* g.call(f, P("/proc/get_atom_on_turf"), null, [live(target)]))), live(target))) {
			return 0;
		}
		$0 = (live(outer_storage) && (yield* g.srcCall(f, "CanReach", live(outer_storage), live(tool))));
		if (truthy($0)) {
			$0 = live(outer_storage);
			$1 = live(target);
			$2 = live(f.src);
			if (truthy(live(view_only))) {
				$3 = 2;
			} else {
				$3 = 3;
			}
			$0 = (yield* g.callName(f, $0, "CanReachStorage", [$1, $2, $3]));
		}
		if (truthy($0)) {
			return 1;
		}
	}
	return 0;
}, true);

// /obj/item/weapon/storage/proc/CanReachStorage  (code/_onclick/click.dm:184)
rt.def("/obj/item/weapon/storage/proc/CanReachStorage", function CanReachStorage(f: Frame, target: Value, user: Value, depth: Value) {
	f.vars = () => [target, depth];
	while (truthy(live(target)) && rt.gt(live(depth), 0)) {
		target = rt.fv(f, "loc", live(target));
		depth = rt.inc(live(depth), -1);
		if (isEqual(live(target), live(f.src))) {
			return 1;
		}
	}
	return 0;
});

// /atom/movable/proc/DirectAccess  (code/_onclick/click.dm:192)
rt.def("/atom/movable/proc/DirectAccess", function DirectAccess(f: Frame, target: Value) {
	if (isEqual(live(target), live(f.src))) {
		return 1;
	}
	if (!isEqual(live(target), rt.sv(f, "loc"))) return f.dot;
	return 1;
});

// /mob/proc/DirectAccess  (code/_onclick/click.dm:198)
rt.def("/mob/proc/DirectAccess", function DirectAccess(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 1;
	}
	if (truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "contents")) ? 1 : 0))) {
		return 1;
	}
	return 0;
}, false, { args: ["target"] });

// /mob/living/proc/DirectAccess  (code/_onclick/click.dm:205)
rt.def("/mob/living/proc/DirectAccess", function DirectAccess(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 1;
	}
	if (!truthy((rt.isIn(f, live(f.args[0]), rt.callSrc(f, "GetAllContents", [])) ? 1 : 0))) return f.dot;
	return 1;
}, false, { args: ["target"] });

// /proc/CheckToolReach  (code/_onclick/click.dm:217)  may sleep
rt.def("/proc/CheckToolReach", function* CheckToolReach(f: Frame, here: Value, there: Value, reach: Value) {
	let dummy: Value = null, i: Value = null, _T: Value = null;
	let $0: any, $e: any;
	f.vars = () => [here, there, reach, dummy, i, _T, $0, $e];
	if ((!truthy(live(here)) || !truthy(live(there)))) {
		return live(f.dot);
	}
	$0 = live(reach);
	if ($0 === 0) {
		return 0;
	} else if ($0 === 1) {
		return 0;
	} else if (rt.inRange($0, 2, 9.999999848243207e+30)) {
		(rt.modField(f, (dummy = (yield* g.new_(f, T("/obj"), [rt.getStep(f, live(here), 0)]))), "pass_flags", 1, rt.bitOr));
		rt.setFv(f, "invisibility", live(dummy), 101);
		i = null;
		rt.forRange(f, 0, 1, live(reach), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			_T = rt.getStep(f, live(dummy), rt.getDir(f, live(dummy), live(there)));
			if (truthy((yield* g.callName(f, live(dummy), "CanReach", [live(there)])))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(dummy)]);
				return 1;
			}
			if (!truthy((yield* g.callName(f, live(dummy), "Move", [live(_T)])))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(dummy)]);
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/qdel"), null, [live(dummy)]);
	}
	return f.dot;
}, true);

// /mob/proc/UnarmedAttack  (code/_onclick/click.dm:254)
rt.def("/mob/proc/UnarmedAttack", function UnarmedAttack(f: Frame, A: Value, proximity_flag: Value) {
	if (truthy(rt.call(f, P("/proc/ismob"), null, [live(A)]))) {
		rt.callSrc(f, "changeNext_move", [8]);
	}
	return live(f.dot);
});

// /mob/living/carbon/proc/MiddleClickOn  (code/_onclick/click.dm:284)  may sleep
rt.def("/mob/living/carbon/proc/MiddleClickOn", function* MiddleClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	if ((((((!truthy(rt.fv(f, "stat", live(f.src))) && truthy(rt.fv(f, "mind", live(f.src)))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(f.src))))) && truthy(rt.gv(f, "chosen_sting", rt.gv(f, "changeling", rt.fv(f, "mind", live(f.src)))))) && truthy((rt.istype(live(A), T("/mob/living/carbon")) ? 1 : 0))) && !isEqual(live(A), live(f.src)))) {
		rt.setSv(f, "next_click", add(rt.worldTime(f), 5));
		yield* g.callName(f, rt.gv(f, "chosen_sting", rt.fv(f, "changeling", rt.sv(f, "mind"))), "try_to_sting", [live(f.src), live(A)]);
	} else {
		yield* g.srcCall(f, "swap_hand");
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/proc/MiddleClickOn  (code/_onclick/click.dm:291)
rt.def("/mob/living/simple_animal/drone/proc/MiddleClickOn", function MiddleClickOn(f: Frame, A: Value) {
	rt.callSrc(f, "swap_hand", []);
	return f.dot;
});

// /mob/proc/ShiftClickOn  (code/_onclick/click.dm:305)  may sleep
rt.def("/mob/proc/ShiftClickOn", function* ShiftClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "ShiftClick", [live(f.src)]);
	return live(f.dot);
}, true);

// /atom/proc/ShiftClick  (code/_onclick/click.dm:308)  may sleep
rt.def("/atom/proc/ShiftClick", function* ShiftClick(f: Frame, user: Value) {
	f.vars = () => [user];
	if (((truthy(rt.fv(f, "client", live(user))) && isEqual(rt.gv(f, "eye", rt.fv(f, "client", live(user))), live(user))) || isEqual(rt.gv(f, "eye", rt.fv(f, "client", live(user))), rt.fv(f, "loc", live(user))))) {
		yield* g.callName(f, live(user), "examinate", [live(f.src)]);
	}
	return live(f.dot);
}, true);

// /mob/proc/CtrlClickOn  (code/_onclick/click.dm:318)  may sleep
rt.def("/mob/proc/CtrlClickOn", function* CtrlClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "CtrlClick", [live(f.src)]);
	return live(f.dot);
}, true);

// /atom/proc/CtrlClick  (code/_onclick/click.dm:322)  may sleep
rt.def("/atom/proc/CtrlClick", function* CtrlClick(f: Frame, user: Value) {
	let ML: Value = null;
	f.vars = () => [user, ML];
	if (!truthy((rt.istype((ML = live(user)), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(ML), "pulled", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/CtrlClick  (code/_onclick/click.dm:327)  may sleep
rt.def("/mob/living/carbon/human/proc/CtrlClick", function* CtrlClick(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy((yield* g.srcCall(f, "Adjacent", live(f.args[0])))))) {
		if (rt.lt(rt.worldTime(f), rt.fv(f, "next_move", live(f.args[0])))) {
			return 0;
		}
		yield* g.callName(f, rt.gv(f, "species", rt.gv(f, "dna", (H = live(f.args[0])))), "grab", [live(H), live(f.src), rt.gv(f, "martial_art", rt.fv(f, "mind", live(H)))]);
		yield* g.callName(f, live(H), "changeNext_move", [8]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /mob/proc/AltClickOn  (code/_onclick/click.dm:340)  may sleep
rt.def("/mob/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "AltClick", [live(f.src)]);
	return live(f.dot);
}, true);

// /mob/living/carbon/proc/AltClickOn  (code/_onclick/click.dm:344)  may sleep
rt.def("/mob/living/carbon/proc/AltClickOn", function* AltClickOn(f: Frame) {
	if ((((((!truthy(rt.fv(f, "stat", live(f.src))) && truthy(rt.fv(f, "mind", live(f.src)))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(f.src))))) && truthy(rt.gv(f, "chosen_sting", rt.gv(f, "changeling", rt.fv(f, "mind", live(f.src)))))) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) && !isEqual(live(f.args[0]), live(f.src)))) {
		rt.setSv(f, "next_click", add(rt.worldTime(f), 5));
		yield* g.callName(f, rt.gv(f, "chosen_sting", rt.fv(f, "changeling", rt.sv(f, "mind"))), "try_to_sting", [live(f.src), live(f.args[0])]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["A"] });

// /atom/proc/AltClick  (code/_onclick/click.dm:351)
rt.def("/atom/proc/AltClick", function AltClick(f: Frame, user: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if ((truthy((_T = rt.getStep(f, live(f.src), 0))) && truthy(rt.callName(f, live(user), "TurfAdjacent", [live(_T)])))) {
		if (isEqual(rt.fv(f, "listed_turf", live(user)), live(_T))) {
			rt.setFv(f, "listed_turf", live(user), null);
		} else {
			rt.setFv(f, "listed_turf", live(user), live(_T));
			rt.setFv(f, "statpanel", rt.fv(f, "client", live(user)), rt.fv(f, "name", live(_T)));
		}
	}
	return live(f.dot);
});

// /mob/proc/TurfAdjacent  (code/_onclick/click.dm:361)
rt.def("/mob/proc/TurfAdjacent", function TurfAdjacent(f: Frame, _T: Value) {
	return rt.callName(f, live(_T), "Adjacent", [live(f.src)]);
});

// /mob/proc/CtrlShiftClickOn  (code/_onclick/click.dm:368)  may sleep
rt.def("/mob/proc/CtrlShiftClickOn", function* CtrlShiftClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "CtrlShiftClick", [live(f.src)]);
	return live(f.dot);
}, true);

// /mob/proc/ShiftMiddleClickOn  (code/_onclick/click.dm:372)  may sleep
rt.def("/mob/proc/ShiftMiddleClickOn", function* ShiftMiddleClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(f.src), "pointed", [live(A)]);
	return live(f.dot);
}, true);

// /mob/living/proc/LaserEyes  (code/_onclick/click.dm:388)  may sleep
rt.def("/mob/living/proc/LaserEyes", function* LaserEyes(f: Frame, A: Value) {
	let _T: Value = null, U: Value = null, LE: Value = null;
	f.vars = () => [A, _T, U, LE];
	yield* g.srcCall(f, "changeNext_move", 4);
	_T = rt.getStep(f, live(f.src), 0);
	U = rt.getStep(f, live(A), 0);
	rt.setFv(f, "icon", (LE = (yield* g.new_(f, T("/obj/item/projectile/beam"), [rt.sv(f, "loc")]))), rt.rsc("icons/effects/genetics.dmi"));
	rt.setFv(f, "icon_state", live(LE), "eyelasers");
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.usr)), rt.rsc("sound/weapons/taser2.ogg"), 75, 1]);
	rt.setFv(f, "firer", live(LE), live(f.src));
	rt.setFv(f, "def_zone", live(LE), (yield* g.srcCall(f, "get_organ_target")));
	rt.setFv(f, "original", live(LE), live(A));
	rt.setFv(f, "current", live(LE), live(_T));
	rt.setFv(f, "yo", live(LE), subtract(rt.fv(f, "y", live(U)), rt.fv(f, "y", live(_T))));
	rt.setFv(f, "xo", live(LE), subtract(rt.fv(f, "x", live(U)), rt.fv(f, "x", live(_T))));
	yield* g.callName(f, live(LE), "fire", []);
	return f.dot;
}, true);

// /mob/proc/face_atom  (code/_onclick/click.dm:407)  may sleep
rt.def("/mob/proc/face_atom", function* face_atom(f: Frame, A: Value) {
	let dx: Value = null, dy: Value = null;
	f.vars = () => [A, dx, dy];
	if (((((((truthy(rt.sv(f, "buckled")) || !isEqual(rt.sv(f, "stat"), 0)) || !truthy(live(A))) || !truthy(rt.sv(f, "x"))) || !truthy(rt.sv(f, "y"))) || !truthy(rt.fv(f, "x", live(A)))) || !truthy(rt.fv(f, "y", live(A))))) {
		return live(f.dot);
	}
	dx = subtract(rt.fv(f, "x", live(A)), rt.sv(f, "x"));
	dy = subtract(rt.fv(f, "y", live(A)), rt.sv(f, "y"));
	if ((!truthy(live(dx)) && !truthy(live(dy)))) {
		if (rt.gt(rt.fv(f, "pixel_y", live(A)), 16)) {
			yield* g.srcCall(f, "setDir", 1);
		} else {
			if (rt.lt(rt.fv(f, "pixel_y", live(A)), -16)) {
				yield* g.srcCall(f, "setDir", 2);
			} else {
				if (rt.gt(rt.fv(f, "pixel_x", live(A)), 16)) {
					yield* g.srcCall(f, "setDir", 4);
				} else {
					if (rt.lt(rt.fv(f, "pixel_x", live(A)), -16)) {
						yield* g.srcCall(f, "setDir", 8);
					}
				}
			}
		}
		return live(f.dot);
	}
	if (rt.lt(rt.op(f, "Abs", [], [live(dx)]), rt.op(f, "Abs", [], [live(dy)]))) {
		if (rt.gt(live(dy), 0)) {
			yield* g.srcCall(f, "setDir", 1);
		} else {
			yield* g.srcCall(f, "setDir", 2);
		}
	} else {
		if (rt.gt(live(dx), 0)) {
			yield* g.srcCall(f, "setDir", 4);
		} else {
			yield* g.srcCall(f, "setDir", 8);
		}
	}
	return f.dot;
}, true);

rt.type(11000, "/obj/screen/click_catcher", "/obj/screen", {
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "click_catcher",
	plane: -99,
	mouse_opacity: 2,
	screen_loc: "CENTER",
});

// /obj/screen/click_catcher/proc/New  (code/_onclick/click.dm:441)  may sleep
rt.def("/obj/screen/click_catcher/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "transform", (yield* g.call(f, P("/proc/matrix"), null, [200, 0, 0, 0, 200, 0])));
	return f.dot;
}, true);

// /obj/screen/click_catcher/proc/Click  (code/_onclick/click.dm:445)  may sleep
rt.def("/obj/screen/click_catcher/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let modifiers: Value = null, C: Value = null, _T: Value = null;
	f.vars = () => [location, control, params, modifiers, C, _T];
	if ((truthy(rt.index((modifiers = (yield* g.call(f, P("/proc/params2list"), null, [live(params)]))), "middle")) && truthy((rt.istype(live(f.usr), T("/mob/living/carbon")) ? 1 : 0)))) {
		yield* g.callName(f, (C = live(f.usr)), "swap_hand", []);
	} else {
		_T = (yield* g.call(f, P("/proc/params2turf"), null, [rt.at(live(modifiers), "screen-loc"), rt.getStep(f, live(f.usr), 0), rt.fv(f, "client", live(f.usr))]));
		params = rt.modify(live(params), "&catcher=1", add);
		if (truthy(live(_T))) {
			yield* g.callName(f, live(_T), "Click", [live(location), live(control), live(params)]);
		}
	}
	f.dot = 1;
	return f.dot;
}, true);

// /mob/dead/observer/proc/MouseWheelOn  (code/_onclick/click.dm:463)  may sleep
rt.def("/mob/dead/observer/proc/MouseWheelOn", function* MouseWheelOn(f: Frame, A: Value, delta_x: Value, delta_y: Value, params: Value) {
	let modifier: Value = null, view: Value = null;
	f.vars = () => [A, delta_x, delta_y, params, modifier, view];
	if (!truthy(rt.index((modifier = (yield* g.call(f, P("/proc/params2list"), null, [live(params)]))), "shift"))) return f.dot;
	view = 0;
	if (rt.gt(live(delta_y), 0)) {
		view = -1;
	} else {
		view = 1;
	}
	yield* g.srcCall(f, "add_view_range", live(view));
	return f.dot;
}, true);
