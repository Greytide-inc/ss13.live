// From code/game/atoms_movable.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4803, "/atom/movable", "/atom", {
	can_be_unanchored: 0,
	last_move: null,
	anchored: 0,
	throwing: null,
	throw_speed: 2,
	throw_range: 7,
	pulledby: null,
	initial_language_holder: rt.typePath("/datum/language_holder"),
	language_holder: null,
	verb_say: "says",
	verb_ask: "asks",
	verb_exclaim: "exclaims",
	verb_whisper: "whispers",
	verb_yell: "yells",
	inertia_dir: 0,
	inertia_last_loc: null,
	inertia_moving: 0,
	inertia_next_move: 0,
	inertia_move_delay: 5,
	pass_flags: 0,
	moving_diagonally: 0,
	client_mobs_in_contents: null,
	acted_explosions: null,
	force_moving: null,
	floating: 0,
	can_buckle: 0,
	buckle_lying: -1,
	buckle_requires_restraints: 0,
	buckled_mobs: null,
	max_buckled_mobs: 1,
	buckle_prevents_pull: 0,
	pressure_resistance: 10,
	last_high_pressure_movement_air_cycle: 0,
	orbiting: null,
	screen_loc: null,
	animate_movement: 1,
	locs: null,
	glide_size: 8,
	step_size: null,
	bound_x: null,
	bound_y: null,
	bound_width: null,
	bound_height: null,
	bounds: null,
	particles: null,
	layer: 3,
	appearance_flags: 768,
}, { tmp: ["bound_x","bound_y","bound_width","bound_height"] });

// /atom/movable/proc/vv_edit_var  (code/game/atoms_movable.dm:41)  may sleep
rt.def("/atom/movable/proc/vv_edit_var", function* vv_edit_var(f: Frame) {
	let _T: Value = null;
	let $0: any;
	f.vars = () => [_T, $0];
	if (truthy((rt.isIn(f, live(f.args[0]), rt.gl("banned_edits#2")) ? 1 : 0))) {
		return 0;
	}
	if ((truthy((rt.isIn(f, live(f.args[0]), rt.gl("careful_edits")) ? 1 : 0)) && !isEqual(rt.modulus(live(f.args[1]), rt.fv(f, "icon_size", rt.world())), 0))) {
		return 0;
	}
	$0 = live(f.args[0]);
	if ($0 === "x") {
		if (truthy((_T = rt.locate(live(f.args[1]), rt.sv(f, "y"), rt.sv(f, "z"))))) {
			yield* g.srcCall(f, "forceMove", live(_T));
			return 1;
		}
		return 0;
	} else if ($0 === "y") {
		if (truthy((_T = rt.locate(rt.sv(f, "x"), live(f.args[1]), rt.sv(f, "z"))))) {
			yield* g.srcCall(f, "forceMove", live(_T));
			return 1;
		}
		return 0;
	} else if ($0 === "z") {
		if (truthy((_T = rt.locate(rt.sv(f, "x"), rt.sv(f, "y"), live(f.args[1]))))) {
			yield* g.srcCall(f, "forceMove", live(_T));
			return 1;
		}
		return 0;
	} else if ($0 === "loc") {
		if ((live(f.args[1]) === null || truthy((rt.istype(live(f.args[1]), T("/atom")) ? 1 : 0)))) {
			yield* g.srcCall(f, "forceMove", live(f.args[1]));
			return 1;
		}
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["var_name", "var_value"] });

// /atom/movable/proc/Move  (code/game/atoms_movable.dm:72)  may sleep
rt.def("/atom/movable/proc/Move", function* Move(f: Frame) {
	let oldloc: Value = null;
	f.vars = () => [oldloc];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((!truthy(rt.sv(f, "loc")) || !truthy(live(f.args[0])))) {
		return 0;
	}
	oldloc = rt.sv(f, "loc");
	if (!isEqual(rt.sv(f, "loc"), live(f.args[0]))) {
		if (!truthy(rt.bitAnd(live(f.args[1]), subtract(live(f.args[1]), 1)))) {
			f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
		} else {
			rt.setSv(f, "moving_diagonally", 1);
			if (truthy(rt.bitAnd(live(f.args[1]), 1))) {
				if (truthy(rt.bitAnd(live(f.args[1]), 4))) {
					if (truthy((yield* g.call(f, P("/proc/step"), null, [live(f.src), 1])))) {
						rt.setSv(f, "moving_diagonally", 2);
						f.dot = (yield* g.call(f, P("/proc/step"), null, [live(f.src), 4]));
					} else {
						if (truthy((yield* g.call(f, P("/proc/step"), null, [live(f.src), 4])))) {
							rt.setSv(f, "moving_diagonally", 2);
							f.dot = (yield* g.call(f, P("/proc/step"), null, [live(f.src), 1]));
						}
					}
				} else {
					if (truthy(rt.bitAnd(live(f.args[1]), 8))) {
						if (truthy((yield* g.call(f, P("/proc/step"), null, [live(f.src), 1])))) {
							rt.setSv(f, "moving_diagonally", 2);
							f.dot = (yield* g.call(f, P("/proc/step"), null, [live(f.src), 8]));
						} else {
							if (truthy((yield* g.call(f, P("/proc/step"), null, [live(f.src), 8])))) {
								rt.setSv(f, "moving_diagonally", 2);
								f.dot = (yield* g.call(f, P("/proc/step"), null, [live(f.src), 1]));
							}
						}
					}
				}
			} else {
				if (truthy(rt.bitAnd(live(f.args[1]), 2))) {
					if (truthy(rt.bitAnd(live(f.args[1]), 4))) {
						if (truthy((yield* g.call(f, P("/proc/step"), null, [live(f.src), 2])))) {
							rt.setSv(f, "moving_diagonally", 2);
							f.dot = (yield* g.call(f, P("/proc/step"), null, [live(f.src), 4]));
						} else {
							if (truthy((yield* g.call(f, P("/proc/step"), null, [live(f.src), 4])))) {
								rt.setSv(f, "moving_diagonally", 2);
								f.dot = (yield* g.call(f, P("/proc/step"), null, [live(f.src), 2]));
							}
						}
					} else {
						if (truthy(rt.bitAnd(live(f.args[1]), 8))) {
							if (truthy((yield* g.call(f, P("/proc/step"), null, [live(f.src), 2])))) {
								rt.setSv(f, "moving_diagonally", 2);
								f.dot = (yield* g.call(f, P("/proc/step"), null, [live(f.src), 8]));
							} else {
								if (truthy((yield* g.call(f, P("/proc/step"), null, [live(f.src), 8])))) {
									rt.setSv(f, "moving_diagonally", 2);
									f.dot = (yield* g.call(f, P("/proc/step"), null, [live(f.src), 2]));
								}
							}
						}
					}
				}
			}
			rt.setSv(f, "moving_diagonally", 0);
			return live(f.dot);
		}
	}
	if ((!truthy(rt.sv(f, "loc")) || (isEqual(rt.sv(f, "loc"), live(oldloc)) && !isEqual(live(oldloc), live(f.args[0]))))) {
		rt.setSv(f, "last_move", 0);
		return live(f.dot);
	}
	if (truthy(live(f.dot))) {
		yield* g.srcCall(f, "Moved", live(oldloc), live(f.args[1]));
	}
	rt.setSv(f, "last_move", live(f.args[1]));
	yield* g.srcCall(f, "setDir", live(f.args[1]));
	if (!((truthy(live(f.dot)) && truthy((yield* g.srcCall(f, "has_buckled_mobs")))) && !truthy((yield* g.srcCall(f, "handle_buckled_mob_movement", rt.sv(f, "loc"), live(f.args[1])))))) return f.dot;
	f.dot = 0;
	return f.dot;
}, true, { args: ["newloc", "direct"] });

// /atom/movable/proc/Moved  (code/game/atoms_movable.dm:127)  may sleep
rt.def("/atom/movable/proc/Moved", function* Moved(f: Frame, OldLoc: Value, Dir: Value) {
	let thing: Value = null, O: Value = null, proximity_monitor: Value = null;
	let $e: any;
	f.vars = () => [OldLoc, Dir, thing, O, proximity_monitor, $e];
	if (!truthy(rt.sv(f, "inertia_moving"))) {
		rt.setSv(f, "inertia_next_move", add(rt.worldTime(f), rt.sv(f, "inertia_move_delay")));
		yield* g.srcCall(f, "newtonian_move", live(Dir));
	}
	if (truthy(rt.length(rt.sv(f, "client_mobs_in_contents")))) {
		yield* g.srcCall(f, "update_parallax_contents");
	}
	if (truthy(rt.sv(f, "orbiters"))) {
		thing = null;
		rt.forList(f, 0, rt.sv(f, "orbiters"));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			yield* g.callName(f, (O = live(thing)), "Check", []);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "orbiting"))) {
		yield* g.callName(f, rt.sv(f, "orbiting"), "Check", []);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 2048))) {
		yield* g.srcCall(f, "clean_on_move");
	}
	if (truthy((proximity_monitor = rt.fv(f, "proximity_monitor", live(f.src))))) {
		yield* g.callName(f, live(proximity_monitor), "HandleMove", []);
	}
	return 1;
}, true);

// /atom/movable/proc/clean_on_move  (code/game/atoms_movable.dm:150)  may sleep
rt.def("/atom/movable/proc/clean_on_move", function* clean_on_move(f: Frame) {
	let tile: Value = null, A: Value = null, cleaned_item: Value = null, cleaned_human: Value = null;
	let $e: any;
	f.vars = () => [tile, A, cleaned_item, cleaned_human, $e];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(tile = rt.sv(f, "loc"))])))) return f.dot;
	yield* g.callName(f, live(tile), "clean_blood", []);
	A = null;
	rt.forList(f, 0, live(tile));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((truthy((rt.istype(live(A), T("/obj/effect/decal/cleanable")) ? 1 : 0)) || truthy((rt.istype(live(A), T("/obj/effect/rune")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(A)]);
		} else {
			if (truthy((rt.istype(live(A), T("/obj/item")) ? 1 : 0))) {
				yield* g.callName(f, (cleaned_item = live(A)), "clean_blood", []);
			} else {
				if (truthy((rt.istype(live(A), T("/mob/living/carbon/human")) ? 1 : 0))) {
					if (truthy(rt.gv(f, "lying", (cleaned_human = live(A))))) {
						if (truthy(rt.fv(f, "head", live(cleaned_human)))) {
							yield* g.callName(f, rt.fv(f, "head", live(cleaned_human)), "clean_blood", []);
							yield* g.callName(f, live(cleaned_human), "update_inv_head", []);
						}
						if (truthy(rt.fv(f, "wear_suit", live(cleaned_human)))) {
							yield* g.callName(f, rt.fv(f, "wear_suit", live(cleaned_human)), "clean_blood", []);
							yield* g.callName(f, live(cleaned_human), "update_inv_wear_suit", []);
						} else {
							if (truthy(rt.fv(f, "w_uniform", live(cleaned_human)))) {
								yield* g.callName(f, rt.fv(f, "w_uniform", live(cleaned_human)), "clean_blood", []);
								yield* g.callName(f, live(cleaned_human), "update_inv_w_uniform", []);
							}
						}
						if (truthy(rt.fv(f, "shoes", live(cleaned_human)))) {
							yield* g.callName(f, rt.fv(f, "shoes", live(cleaned_human)), "clean_blood", []);
							yield* g.callName(f, live(cleaned_human), "update_inv_shoes", []);
						}
						yield* g.callName(f, live(cleaned_human), "clean_blood", []);
						yield* g.callName(f, live(cleaned_human), "wash_cream", []);
						yield* g.call(f, P("/proc/to_chat"), null, [live(cleaned_human), fmt("<span class='danger'>＀ cleans your face!</span>", [live(f.src)])]);
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /atom/movable/proc/Destroy  (code/game/atoms_movable.dm:179)  may sleep
rt.def("/atom/movable/proc/Destroy", function* Destroy(f: Frame) {
	let inform_admins: Value = null, stationloving: Value = null, _T: Value = null, currentturf: Value = null, targetturf: Value = null, AM: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [inform_admins, stationloving, _T, currentturf, targetturf, AM, $0, $1, $2, $e];
	if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		$0 = rt.index(rt.fv(f, "secondary_flags", live(f.src)), "inform_admins_on_relocate");
	} else {
		$0 = 0;
	}
	inform_admins = $0;
	if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		$0 = rt.index(rt.fv(f, "secondary_flags", live(f.src)), "stationloving");
	} else {
		$0 = 0;
	}
	stationloving = $0;
	if ((truthy(live(inform_admins)) && truthy(live(f.args[0])))) {
		_T = rt.getStep(f, live(f.src), 0);
		$0 = live(f.src);
		if (truthy(live(_T))) {
			$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		} else {
			$1 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been !!force deleted!! in ＀.", [$0, fmt("＀", [$1])])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has been !!force deleted!! in ＀.", [live(f.src), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
	}
	if ((truthy(live(stationloving)) && !truthy(live(f.args[0])))) {
		currentturf = rt.getStep(f, live(f.src), 0);
		targetturf = (yield* g.srcCall(f, "relocate"));
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has been destroyed in ＀. Moving it to ＀.", [live(f.src), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(currentturf)), rt.fv(f, "y", live(currentturf)), rt.fv(f, "z", live(currentturf))]), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(targetturf)), rt.fv(f, "y", live(targetturf)), rt.fv(f, "z", live(targetturf))])])]);
		if (truthy(live(inform_admins))) {
			$0 = live(f.src);
			if (truthy(live(currentturf))) {
				$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(currentturf)), rt.fv(f, "y", live(currentturf)), rt.fv(f, "z", live(currentturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(currentturf)), rt.fv(f, "y", live(currentturf)), rt.fv(f, "z", live(currentturf))])]);
			} else {
				$1 = "nonexistent location";
			}
			$1 = fmt("＀", [$1]);
			if (truthy(live(targetturf))) {
				$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(targetturf)), rt.fv(f, "y", live(targetturf)), rt.fv(f, "z", live(targetturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(targetturf)), rt.fv(f, "y", live(targetturf)), rt.fv(f, "z", live(targetturf))])]);
			} else {
				$2 = "nonexistent location";
			}
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been destroyed in ＀. Moving it to ＀.", [$0, $1, fmt("＀", [$2])])]);
		}
		return 1;
	}
	if ((truthy(live(stationloving)) && truthy(live(f.args[0])))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSinbounds"), "processing", live(f.src), subtract));
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "proximity_monitor")]);
	rt.setSv(f, "proximity_monitor", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "language_holder")]);
	rt.setSv(f, "language_holder", null);
	yield* g.callSrc(f, "unbuckle_all_mobs", ["force", 1], rt.Args.Named);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "loc"))) {
		yield* g.callName(f, rt.sv(f, "loc"), "handle_atom_del", [live(f.src)]);
	}
	AM = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(AM)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "loc", null);
	rt.setSv(f, "invisibility", 101);
	if (!truthy(rt.sv(f, "pulledby"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "pulledby"), "stop_pulling", []);
	return f.dot;
}, true, { args: ["force"] });

// /atom/movable/proc/Bump  built in (BYOND provides it)
rt.def("/atom/movable/proc/Bump", undefined, false, { args: ["Obstacle"] });

// /atom/movable/proc/Bump  (code/game/atoms_movable.dm:221)  may sleep
rt.def("/atom/movable/proc/Bump", function* Bump(f: Frame, A: Value, yes: Value) {
	f.vars = () => [A, yes];
	if (!(truthy(live(A)) && truthy(live(yes)))) return f.dot;
	if (truthy(rt.sv(f, "throwing"))) {
		yield* g.callName(f, rt.sv(f, "throwing"), "hit_atom", [live(A)]);
		f.dot = 1;
		if ((!truthy(live(A)) || (!truthy(live(A)) || truthy(rt.fv(f, "gc_destroyed", live(A)))))) {
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(A), "Bumped", [live(f.src)]);
	return f.dot;
}, true);

// /atom/movable/proc/forceMove  (code/game/atoms_movable.dm:232)  may sleep
rt.def("/atom/movable/proc/forceMove", function* forceMove(f: Frame, destination: Value) {
	let oldloc: Value = null, same_loc: Value = null, old_area: Value = null, destarea: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [destination, oldloc, same_loc, old_area, destarea, AM, $e];
	if (truthy(live(destination))) {
		if (truthy(rt.sv(f, "pulledby"))) {
			yield* g.callName(f, rt.sv(f, "pulledby"), "stop_pulling", []);
		}
		oldloc = rt.sv(f, "loc");
		same_loc = (isEqual(live(oldloc), live(destination)) ? 1 : 0);
		old_area = (yield* g.call(f, P("/proc/get_area"), null, [live(oldloc)]));
		destarea = (yield* g.call(f, P("/proc/get_area"), null, [live(destination)]));
		if ((truthy(live(oldloc)) && !truthy(live(same_loc)))) {
			yield* g.callName(f, live(oldloc), "Exited", [live(f.src), live(destination)]);
			if (truthy(live(old_area))) {
				yield* g.callName(f, live(old_area), "Exited", [live(f.src), live(destination)]);
			}
		}
		rt.setSv(f, "loc", live(destination));
		if (!truthy(live(same_loc))) {
			yield* g.callName(f, live(destination), "Entered", [live(f.src), live(oldloc)]);
			if ((truthy(live(destarea)) && !isEqual(live(old_area), live(destarea)))) {
				yield* g.callName(f, live(destarea), "Entered", [live(f.src), live(oldloc)]);
			}
			AM = null;
			rt.forList(f, 0, live(destination), T("/atom/movable"));
			while (($e = rt.next(f, 0)) !== undefined) {
				AM = $e;
				if (isEqual(live(AM), live(f.src))) {
					continue;
				}
				yield* g.callName(f, live(AM), "Crossed", [live(f.src), live(oldloc)]);
			}
			rt.endFor(f, 0);
		}
		yield* g.srcCall(f, "Moved", live(oldloc), 0);
		return 1;
	}
	return 0;
}, true);

// /mob/living/proc/forceMove  (code/game/atoms_movable.dm:260)  may sleep
rt.def("/mob/living/proc/forceMove", function* forceMove(f: Frame) {
	yield* g.srcCall(f, "stop_pulling");
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.callName(f, rt.sv(f, "buckled"), "unbuckle_mob", [null, live(f.src), "force", 1], rt.Args.Named);
	}
	if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
		yield* g.callSrc(f, "unbuckle_all_mobs", ["force", 1], rt.Args.Named);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "client"))) {
		yield* g.srcCall(f, "reset_perspective", live(f.args[0]));
	}
	yield* g.srcCall(f, "update_canmove");
	return f.dot;
}, true, { args: ["destination"] });

// /mob/living/brain/proc/forceMove  (code/game/atoms_movable.dm:272)  may sleep
rt.def("/mob/living/brain/proc/forceMove", function* forceMove(f: Frame, destination: Value) {
	f.vars = () => [destination];
	if (truthy(rt.sv(f, "container"))) {
		return (yield* g.callName(f, rt.sv(f, "container"), "forceMove", [live(destination)]));
	}
	yield* g.call(f, P("/proc/CRASH"), null, ["Brainmob without container."]);
	return f.dot;
}, true);

// /atom/movable/proc/Process_Spacemove  (code/game/atoms_movable.dm:282)
rt.def("/atom/movable/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	f.vars = () => [movement_dir];
	if (live(movement_dir) === null) {
		movement_dir = 0;
	}
	if (truthy(rt.callSrc(f, "has_gravity", [live(f.src)]))) {
		return 1;
	}
	if (truthy(rt.sv(f, "pulledby"))) {
		return 1;
	}
	if (truthy(rt.sv(f, "throwing"))) {
		return 1;
	}
	if (truthy(rt.locateIn(f, T("/obj/structure/lattice"), rt.call(f, P("/proc/range"), null, [1, rt.getStep(f, live(f.src), 0)])))) {
		return 1;
	}
	return 0;
});

// /atom/movable/proc/newtonian_move  (code/game/atoms_movable.dm:298)  may sleep
rt.def("/atom/movable/proc/newtonian_move", function* newtonian_move(f: Frame, direction: Value) {
	f.vars = () => [direction];
	if ((!truthy(rt.sv(f, "loc")) || truthy((yield* g.srcCall(f, "Process_Spacemove", 0))))) {
		rt.setSv(f, "inertia_dir", 0);
		return 0;
	}
	rt.setSv(f, "inertia_dir", live(direction));
	if (!truthy(live(direction))) {
		return 1;
	}
	rt.setSv(f, "inertia_last_loc", rt.sv(f, "loc"));
	rt.setAt(rt.fv(f, "processing", rt.gl("SSspacedrift")), live(f.src), live(f.src));
	return 1;
}, true);

// /atom/movable/proc/checkpass  (code/game/atoms_movable.dm:310)
rt.def("/atom/movable/proc/checkpass", function checkpass(f: Frame, passflag: Value) {
	return rt.bitAnd(rt.sv(f, "pass_flags"), live(passflag));
});

// /atom/movable/proc/throw_impact  (code/game/atoms_movable.dm:314)  may sleep
rt.def("/atom/movable/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value, throwingdatum: Value) {
	f.vars = () => [hit_atom, throwingdatum];
	return (yield* g.callName(f, live(hit_atom), "hitby", [live(f.src)]));
}, true, { waitfor: false });

// /atom/movable/proc/hitby  (code/game/atoms_movable.dm:317)  may sleep
rt.def("/atom/movable/proc/hitby", function* hitby(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if ((!truthy(rt.sv(f, "anchored")) && truthy(live(f.args[2])))) {
		yield* g.call(f, P("/proc/step"), null, [live(f.src), rt.fv(f, "dir", live(f.args[0]))]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM", "skipcatch", "hitpush", "blocked"] });

// /atom/movable/proc/throw_at  (code/game/atoms_movable.dm:322)  may sleep
rt.def("/atom/movable/proc/throw_at", function* throw_at(f: Frame, target: Value, range: Value, speed: Value, thrower: Value, spin: Value, diagonals_first: Value, callback: Value) {
	let user_momentum: Value = null, TT: Value = null, dist_x: Value = null, dist_y: Value = null, dx: Value = null, dy: Value = null, olddist_x: Value = null, olddx: Value = null;
	let $0: any;
	f.vars = () => [target, range, speed, thrower, spin, diagonals_first, callback, user_momentum, TT, dist_x, dist_y, dx, dy, olddist_x, olddx, $0];
	if (live(spin) === null) {
		spin = 1;
	}
	if (live(diagonals_first) === null) {
		diagonals_first = 0;
	}
	if (((!truthy(live(target)) || truthy(rt.bitAnd(rt.sv(f, "flags"), 2))) || rt.le(live(speed), 0))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "pulledby"))) {
		yield* g.callName(f, rt.sv(f, "pulledby"), "stop_pulling", []);
	}
	if ((((truthy(live(thrower)) && truthy(rt.fv(f, "last_move", live(thrower)))) && truthy(rt.fv(f, "client", live(thrower)))) && rt.ge(rt.gv(f, "move_delay", rt.fv(f, "client", live(thrower))), add(rt.worldTime(f), multiply(rt.fv(f, "tick_lag", rt.world()), 2))))) {
		if (!truthy((user_momentum = (yield* g.callName(f, live(thrower), "movement_delay", []))))) {
			user_momentum = rt.fv(f, "tick_lag", rt.world());
		}
		user_momentum = divide(1, live(user_momentum));
		if (truthy(rt.bitAnd(rt.getDir(f, live(thrower), live(target)), rt.sv(f, "last_move")))) {
			user_momentum = live(user_momentum);
		} else {
			if (truthy(rt.bitAnd(rt.getDir(f, live(target), live(thrower)), rt.sv(f, "last_move")))) {
				user_momentum = rt.neg(live(user_momentum));
			} else {
				user_momentum = 0;
			}
		}
		if (truthy(live(user_momentum))) {
			(range = rt.modify(live(range), add(divide(live(user_momentum), live(speed)), 1), multiply));
			if (rt.le((speed = rt.modify(live(speed), live(user_momentum), add)), 0)) {
				return live(f.dot);
			}
		}
	}
	rt.setFv(f, "thrownthing", (TT = (yield* g.new_(f, T("/datum/thrownthing"), []))), live(f.src));
	rt.setFv(f, "target", live(TT), live(target));
	rt.setFv(f, "target_turf", live(TT), rt.getStep(f, live(target), 0));
	rt.setFv(f, "init_dir", live(TT), rt.getDir(f, live(f.src), live(target)));
	rt.setFv(f, "maxrange", live(TT), live(range));
	rt.setFv(f, "speed", live(TT), live(speed));
	rt.setFv(f, "thrower", live(TT), live(thrower));
	rt.setFv(f, "diagonals_first", live(TT), live(diagonals_first));
	rt.setFv(f, "callback", live(TT), live(callback));
	rt.setFv(f, "start_loc", live(TT), rt.sv(f, "loc"));
	rt.setFv(f, "blast_epi", live(TT), rt.gl("blast_throw_epi"));
	rt.setGl("blast_throw_epi", null);
	dist_x = rt.op(f, "Abs", [], [subtract(rt.fv(f, "x", live(target)), rt.fv(f, "x", live(f.src)))]);
	dist_y = rt.op(f, "Abs", [], [subtract(rt.fv(f, "y", live(target)), rt.fv(f, "y", live(f.src)))]);
	if (rt.gt(rt.fv(f, "x", live(target)), rt.fv(f, "x", live(f.src)))) {
		$0 = 4;
	} else {
		$0 = 8;
	}
	dx = $0;
	if (rt.gt(rt.fv(f, "y", live(target)), rt.fv(f, "y", live(f.src)))) {
		$0 = 1;
	} else {
		$0 = 2;
	}
	dy = $0;
	if (isEqual(live(dist_x), live(dist_y))) {
		rt.setFv(f, "pure_diagonal", live(TT), 1);
	} else {
		if (rt.le(live(dist_x), live(dist_y))) {
			olddist_x = live(dist_x);
			olddx = live(dx);
			dist_x = live(dist_y);
			dist_y = live(olddist_x);
			dx = live(dy);
			dy = live(olddx);
		}
	}
	rt.setFv(f, "dist_x", live(TT), live(dist_x));
	rt.setFv(f, "dist_y", live(TT), live(dist_y));
	rt.setFv(f, "dx", live(TT), live(dx));
	rt.setFv(f, "dy", live(TT), live(dy));
	rt.setFv(f, "diagonal_error", live(TT), subtract(divide(live(dist_x), 2), live(dist_y)));
	rt.setFv(f, "start_time", live(TT), rt.worldTime(f));
	if (truthy(rt.sv(f, "pulledby"))) {
		yield* g.callName(f, rt.sv(f, "pulledby"), "stop_pulling", []);
	}
	rt.setSv(f, "throwing", live(TT));
	rt.setSv(f, "glide_size", (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [divide(32, (yield* g.call(f, P("/proc/max"), null, [divide(divide(1, live(speed)), rt.fv(f, "tick_lag", rt.world())), 1]))), 32]))])));
	if (truthy(live(spin))) {
		yield* g.srcCall(f, "SpinAnimation", 5, 1);
	}
	rt.setAt(rt.fv(f, "processing", rt.gl("SSthrowing")), live(f.src), live(TT));
	if ((isEqual(rt.fv(f, "state", rt.gl("SSthrowing")), 3) && truthy(rt.length(rt.fv(f, "currentrun", rt.gl("SSthrowing")))))) {
		rt.setAt(rt.fv(f, "currentrun", rt.gl("SSthrowing")), live(f.src), live(TT));
	}
	yield* g.callName(f, live(TT), "tick", []);
	return f.dot;
}, true);

// /atom/movable/proc/blast_fling  (new, stress-throw)  may sleep
// An explosion's throw for an item nobody is near enough to see: the same path throw_at + thrownthing.tick would walk (same stepping,
// same range), but each step only asks whether the next tile lets the item in (CheckExit of the tile it leaves, CanPass of the tile's
// dense or CanPass-defining atoms and of the turf itself, like turf/Enter), and the item is moved once, to where the flight ends.
// No thrownthing, callback, spin, per-step Move/Entered/Crossed, and nothing is hit at the end (no throw_impact on the thing that
// stopped it). Space drift (newtonian_move) still happens at the end like in thrownthing/finalize.
rt.def("/atom/movable/proc/blast_fling", function* blast_fling(f: Frame, target: Value, range: Value, epi: Value) {
	let start: Value = null, cur: Value = null, step: Value = null, target_turf: Value = null, L: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [target, range, epi, start, cur, step, target_turf, L, O, $e];
	start = rt.sv(f, "loc");
	if (!target || !truthy(rt.call(f, P("/proc/isturf"), null, [start]))) {
		return 0;
	}
	const counting = truthy(rt.call(f, P("/proc/stress_counts_on"), null, []));
	const tx = rt.fv(f, "x", target), ty = rt.fv(f, "y", target), sx = rt.fv(f, "x", start), sy = rt.fv(f, "y", start);
	let dist_x = Math.abs(tx - sx), dist_y = Math.abs(ty - sy), dx = tx > sx ? 4 : 8, dy = ty > sy ? 1 : 2, pure_diagonal = false;
	if (dist_x === dist_y) {
		pure_diagonal = true;
	} else if (dist_x <= dist_y) {
		const od = dist_x, odx = dx;
		dist_x = dist_y; dist_y = od; dx = dy; dy = odx;
	}
	let err = dist_x / 2 - dist_y;
	const init_dir = rt.getDir(f, start, target), maxd = Math.max(dist_x, dist_y);
	target_turf = rt.getStep(f, target, 0);
	cur = start;
	let travelled = 0;
	while (travelled < range) {
		if (cur === target_turf && truthy(yield* g.callName(f, live(f.src), "has_gravity", [cur]))) break;
		step = rt.getStep(f, cur, travelled <= maxd ? rt.getDir(f, cur, target_turf) : init_dir);
		if (!pure_diagonal) {
			if (err >= 0 && maxd - travelled !== 1) step = rt.getStep(f, cur, dx);
			err += err < 0 ? dist_x / 2 : -dist_y;
		}
		if (!step) break;
		let blocked = false;
		if ((L = rt.call(f, P("/proc/hook_list"), null, [cur, 4])) !== null) {
			rt.forList(f, 0, live(L), T("/obj"));
			while (($e = rt.next(f, 0)) !== undefined) {
				O = $e;
				if (O !== f.src && !truthy(yield* g.callName(f, live(O), "CheckExit", [live(f.src), step]))) blocked = true;
			}
			rt.endFor(f, 0);
		}
		if (!blocked && (L = rt.call(f, P("/proc/hook_list"), null, [step, 5])) !== null) {
			rt.forList(f, 0, live(L), T("/atom/movable"));
			while (($e = rt.next(f, 0)) !== undefined) {
				O = $e;
				if (!truthy(yield* g.callName(f, live(O), "CanPass", [live(f.src), cur, 1]))) blocked = true;
			}
			rt.endFor(f, 0);
		}
		if (!blocked && !truthy(yield* g.callName(f, live(step), "CanPass", [live(f.src), step]))) blocked = true;
		if (blocked) break;
		cur = step;
		travelled++;
	}
	if (cur !== start) yield* g.callName(f, live(f.src), "Move", [cur, rt.getDir(f, start, cur)]);
	if (counting) {
		rt.call(f, P("/proc/stress_count"), null, ["blast_flung", 1]);
		rt.call(f, P("/proc/stress_count"), null, ["blast_flung_range_sum", range]);
		if (rt.sv(f, "loc") !== start) rt.call(f, P("/proc/stress_count"), null, ["blast_flung_moved", 1]);
		rt.call(f, P("/proc/stress_count"), null, ["blast_flung_dist_sum", travelled]);
		if (truthy(rt.le(rt.call(f, P("/proc/get_dist"), null, [rt.sv(f, "loc"), epi]), 28))) rt.call(f, P("/proc/stress_count"), null, ["blast_flung_end_in_area", 1]);
	}
	yield* g.callName(f, live(f.src), "newtonian_move", [init_dir]);
	return f.dot;
}, true);

// /atom/movable/proc/handle_buckled_mob_movement  (code/game/atoms_movable.dm:400)  may sleep
rt.def("/atom/movable/proc/handle_buckled_mob_movement", function* handle_buckled_mob_movement(f: Frame, newloc: Value, direct: Value) {
	let m: Value = null, buckled_mob: Value = null;
	let $e: any;
	f.vars = () => [newloc, direct, m, buckled_mob, $e];
	m = null;
	rt.forList(f, 0, rt.sv(f, "buckled_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		if (!truthy((yield* g.callName(f, (buckled_mob = live(m)), "Move", [live(newloc), live(direct)])))) {
			rt.setSv(f, "loc", rt.fv(f, "loc", live(buckled_mob)));
			rt.setSv(f, "last_move", rt.fv(f, "last_move", live(buckled_mob)));
			rt.setSv(f, "inertia_dir", rt.sv(f, "last_move"));
			rt.setFv(f, "inertia_dir", live(buckled_mob), rt.sv(f, "last_move"));
			return 0;
		}
		rt.setFv(f, "glide_size", live(buckled_mob), rt.sv(f, "glide_size"));
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /atom/movable/proc/CanPass  (code/game/atoms_movable.dm:412)
rt.def("/atom/movable/proc/CanPass", function CanPass(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1.5;
	}
	if (truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "buckled_mobs")) ? 1 : 0))) {
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["mover", "target", "height"] });

// /atom/movable/proc/get_spacemove_backup  (code/game/atoms_movable.dm:419)  may sleep
rt.def("/atom/movable/proc/get_spacemove_backup", function* get_spacemove_backup(f: Frame) {
	let dense_object_backup: Value = null, A: Value = null, turf: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [dense_object_backup, A, turf, AM, $e];
	dense_object_backup = null;
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, rt.getStep(f, live(f.src), 0)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((yield* g.call(f, P("/proc/isarea"), null, [live(A)])))) {
			continue;
		}
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(A)])))) {
			if (!truthy(rt.gv(f, "density", (turf = live(A))))) {
				continue;
			}
			return live(turf);
		} else {
			if ((!truthy((yield* g.callName(f, (AM = live(A)), "CanPass", [live(f.src)]))) || truthy(rt.fv(f, "density", live(AM))))) {
				if (truthy(rt.fv(f, "anchored", live(AM)))) {
					return live(AM);
				}
				dense_object_backup = live(AM);
				break;
			}
		}
	}
	rt.endFor(f, 0);
	f.dot = live(dense_object_backup);
	return f.dot;
}, true);

// /atom/movable/proc/do_attack_animation  (code/game/atoms_movable.dm:442)  may sleep
rt.def("/atom/movable/proc/do_attack_animation", function* do_attack_animation(f: Frame, A: Value, visual_effect_icon: Value, used_item: Value, no_effect: Value, end_pixel_y: Value) {
	let pixel_x_diff: Value = null, pixel_y_diff: Value = null, final_pixel_y: Value = null, direction: Value = null;
	f.vars = () => [A, visual_effect_icon, used_item, no_effect, end_pixel_y, pixel_x_diff, pixel_y_diff, final_pixel_y, direction];
	if ((!truthy(live(no_effect)) && (truthy(live(visual_effect_icon)) || truthy(live(used_item))))) {
		yield* g.srcCall(f, "do_item_attack_animation", live(A), live(visual_effect_icon), live(used_item));
	}
	if (isEqual(live(A), live(f.src))) {
		return live(f.dot);
	}
	pixel_x_diff = 0;
	pixel_y_diff = 0;
	final_pixel_y = rt.initial(f, live(f.src), "pixel_y");
	if (truthy(live(end_pixel_y))) {
		final_pixel_y = live(end_pixel_y);
	}
	if (truthy(rt.bitAnd((direction = rt.getDir(f, live(f.src), live(A))), 1))) {
		pixel_y_diff = 8;
	} else {
		if (truthy(rt.bitAnd(live(direction), 2))) {
			pixel_y_diff = -8;
		}
	}
	if (truthy(rt.bitAnd(live(direction), 4))) {
		pixel_x_diff = 8;
	} else {
		if (truthy(rt.bitAnd(live(direction), 8))) {
			pixel_x_diff = -8;
		}
	}
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_x", add(rt.sv(f, "pixel_x"), live(pixel_x_diff)), "pixel_y", add(rt.sv(f, "pixel_y"), live(pixel_y_diff)), "time", 2]);
	rt.op(f, "Animate", [2, 6], ["pixel_x", rt.initial(f, live(f.src), "pixel_x"), "pixel_y", live(final_pixel_y), "time", 2]);
	return f.dot;
}, true);

// /atom/movable/proc/do_item_attack_animation  (code/game/atoms_movable.dm:470)  may sleep
rt.def("/atom/movable/proc/do_item_attack_animation", function* do_item_attack_animation(f: Frame, A: Value, visual_effect_icon: Value, used_item: Value) {
	let I: Value = null, direction: Value = null;
	f.vars = () => [A, visual_effect_icon, used_item, I, direction];
	I = null;
	if (truthy(live(visual_effect_icon))) {
		I = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/effects/effects.dmi"), live(A), live(visual_effect_icon), add(rt.fv(f, "layer", live(A)), 0.10000000149011612)]));
	} else {
		if (truthy(live(used_item))) {
			(rt.modField(f, (I = (yield* g.call(f, P("/proc/image"), null, [rt.fv(f, "icon", live(used_item)), live(A), rt.fv(f, "icon_state", live(used_item)), add(rt.fv(f, "layer", live(A)), 0.10000000149011612)]))), "transform", 0.75, multiply));
			rt.setFv(f, "appearance_flags", live(I), 30);
			if (truthy(rt.bitAnd((direction = rt.getDir(f, live(f.src), live(A))), 1))) {
				rt.setFv(f, "pixel_y", live(I), -16);
			} else {
				if (truthy(rt.bitAnd(live(direction), 2))) {
					rt.setFv(f, "pixel_y", live(I), 16);
				}
			}
			if (truthy(rt.bitAnd(live(direction), 4))) {
				rt.setFv(f, "pixel_x", live(I), -16);
			} else {
				if (truthy(rt.bitAnd(live(direction), 8))) {
					rt.setFv(f, "pixel_x", live(I), 16);
				}
			}
			if (!truthy(live(direction))) {
				rt.setFv(f, "pixel_z", live(I), 16);
			}
		}
	}
	if (!truthy(live(I))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/flick_overlay"), null, [live(I), rt.gl("clients"), 5]);
	rt.op(f, "Animate", [2, 12], [null, live(I), "alpha", 175, "pixel_x", 0, "pixel_y", 0, "pixel_z", 0, "time", 3]);
	return f.dot;
}, true);

// /atom/movable/proc/vv_get_dropdown  (code/game/atoms_movable.dm:503)
rt.def("/atom/movable/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	(f.dot = rt.modify(live(f.dot), "Jump to", subtract));
	rt.setAt(live(f.dot), "Follow", fmt("?_src_=holder;adminplayerobservefollow=＃", [live(f.src)]));
	return f.dot;
});

// /atom/movable/proc/ex_check  (code/game/atoms_movable.dm:508)
rt.def("/atom/movable/proc/ex_check", function ex_check(f: Frame, ex_id: Value) {
	if (!truthy(live(ex_id))) {
		return 1;
	}
	if (!truthy(rt.sv(f, "acted_explosions"))) {
		rt.setSv(f, "acted_explosions", rt.list());
	}
	if (truthy((rt.isIn(f, live(ex_id), rt.sv(f, "acted_explosions")) ? 1 : 0))) {
		return 0;
	}
	rt.modSrcVar(f, "acted_explosions", live(ex_id), add);
	return 1;
});

// /atom/movable/proc/float  (code/game/atoms_movable.dm:519)  may sleep
rt.def("/atom/movable/proc/float", function* float(f: Frame, on: Value) {
	f.vars = () => [on];
	if (truthy(rt.sv(f, "throwing"))) {
		return live(f.dot);
	}
	if ((truthy(live(on)) && !truthy(rt.sv(f, "floating")))) {
		rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_y", add(rt.sv(f, "pixel_y"), 2), "time", 10, "loop", -1]);
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_y", subtract(rt.sv(f, "pixel_y"), 2), "time", 10, "loop", -1]);
		rt.setSv(f, "floating", 1);
	} else {
		if (!(!truthy(live(on)) && truthy(rt.sv(f, "floating")))) return f.dot;
		rt.op(f, "Animate", [2, 6], [null, live(f.src), "pixel_y", rt.initial(f, live(f.src), "pixel_y"), "time", 10]);
		rt.setSv(f, "floating", 0);
	}
	return f.dot;
}, true);

// /atom/movable/proc/set_stationloving  (code/game/atoms_movable.dm:551)
rt.def("/atom/movable/proc/set_stationloving", function set_stationloving(f: Frame, state: Value, inform_admins: Value) {
	let currently: Value = null;
	let $0: any;
	f.vars = () => [inform_admins, currently, $0];
	if (live(inform_admins) === null) {
		inform_admins = 0;
	}
	if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		$0 = rt.index(rt.fv(f, "secondary_flags", live(f.src)), "stationloving");
	} else {
		$0 = 0;
	}
	currently = $0;
	if (truthy(live(inform_admins))) {
		if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
			rt.setFv(f, "secondary_flags", live(f.src), rt.list());
		}
		rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "inform_admins_on_relocate", 1);
	} else {
		if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
			rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "inform_admins_on_relocate", null);
		}
	}
	if (isEqual(live(state), live(currently))) {
		return live(f.dot);
	} else {
		if (!truthy(live(state))) {
			rt.setFv(f, "isprocessing", live(f.src), 0);
			(rt.modField(f, rt.gl("SSinbounds"), "processing", live(f.src), subtract));
			if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
				rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "stationloving", null);
			}
		} else {
			if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
				rt.setFv(f, "isprocessing", live(f.src), 1);
				rt.modField(f, rt.gl("SSinbounds"), "processing", live(f.src), add);
			}
			if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
				rt.setFv(f, "secondary_flags", live(f.src), rt.list());
			}
			rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "stationloving", 1);
		}
	}
	return f.dot;
});

// /atom/movable/proc/relocate  (code/game/atoms_movable.dm:568)  may sleep
rt.def("/atom/movable/proc/relocate", function* relocate(f: Frame) {
	let targetturf: Value = null, M: Value = null, S: Value = null;
	f.vars = () => [targetturf, M, S];
	if (!truthy((targetturf = (yield* g.call(f, P("/proc/find_safe_turf"), null, [2]))))) {
		if (rt.gt(rt.len(f, rt.gl("blobstart")), 0)) {
			targetturf = rt.getStep(f, rt.op(f, "PickUnweighted", [1], [rt.gl("blobstart")]), 0);
		} else {
			rt.throw_(f, (yield* g.new_(f, T("/exception"), ["Unable to find a blobstart landmark", "code/game/atoms_movable.dm", 573])));
		}
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		yield* g.callName(f, (M = rt.sv(f, "loc")), "transferItemToLoc", [live(f.src), live(targetturf), 1]);
	} else {
		if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/weapon/storage")) ? 1 : 0))) {
			yield* g.callName(f, (S = rt.sv(f, "loc")), "remove_from_storage", [live(f.src), live(targetturf)]);
		} else {
			yield* g.srcCall(f, "forceMove", live(targetturf));
		}
	}
	return live(targetturf);
}, true);

// /atom/movable/proc/check_in_bounds  (code/game/atoms_movable.dm:587)  may sleep
rt.def("/atom/movable/proc/check_in_bounds", function* check_in_bounds(f: Frame) {
	let currentturf: Value = null, targetturf: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [currentturf, targetturf, $0, $1, $2];
	if (truthy((yield* g.srcCall(f, "in_bounds")))) {
		return live(f.dot);
	} else {
		currentturf = rt.getStep(f, live(f.src), 0);
		yield* g.call(f, P("/proc/to_chat"), null, [(yield* g.call(f, P("/proc/get"), null, [live(f.src), T("/mob")])), "<span class='danger'>You can't help but feel that you just lost something back there...</span>"]);
		targetturf = (yield* g.srcCall(f, "relocate"));
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has been moved out of bounds in ＀. Moving it to ＀.", [live(f.src), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(currentturf)), rt.fv(f, "y", live(currentturf)), rt.fv(f, "z", live(currentturf))]), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(targetturf)), rt.fv(f, "y", live(targetturf)), rt.fv(f, "z", live(targetturf))])])]);
		if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
			$0 = rt.index(rt.fv(f, "secondary_flags", live(f.src)), "inform_admins_on_relocate");
		} else {
			$0 = 0;
		}
		if (!truthy($0)) return f.dot;
		$0 = live(f.src);
		if (truthy(live(currentturf))) {
			$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(currentturf)), rt.fv(f, "y", live(currentturf)), rt.fv(f, "z", live(currentturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(currentturf)), rt.fv(f, "y", live(currentturf)), rt.fv(f, "z", live(currentturf))])]);
		} else {
			$1 = "nonexistent location";
		}
		$1 = fmt("＀", [$1]);
		if (truthy(live(targetturf))) {
			$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(targetturf)), rt.fv(f, "y", live(targetturf)), rt.fv(f, "z", live(targetturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(targetturf)), rt.fv(f, "y", live(targetturf)), rt.fv(f, "z", live(targetturf))])]);
		} else {
			$2 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been moved out of bounds in ＀. Moving it to ＀.", [$0, $1, fmt("＀", [$2])])]);
	}
	return f.dot;
}, true);

// /atom/movable/proc/in_bounds  (code/game/atoms_movable.dm:599)
rt.def("/atom/movable/proc/in_bounds", function in_bounds(f: Frame) {
	let currentturf: Value = null;
	f.vars = () => [currentturf];
	f.dot = 0;
	if (!(truthy((currentturf = rt.getStep(f, live(f.src), 0))) && ((isEqual(rt.fv(f, "z", live(currentturf)), 1) || isEqual(rt.fv(f, "z", live(currentturf)), 2)) || isEqual(rt.fv(f, "z", live(currentturf)), 11)))) return f.dot;
	f.dot = 1;
	return f.dot;
});

// /atom/movable/proc/get_language_holder  (code/game/atoms_movable.dm:607)  may sleep
rt.def("/atom/movable/proc/get_language_holder", function* get_language_holder(f: Frame, shadow: Value) {
	f.vars = () => [shadow];
	if (live(shadow) === null) {
		shadow = 1;
	}
	if (truthy(rt.sv(f, "language_holder"))) {
		return rt.sv(f, "language_holder");
	} else {
		rt.setSv(f, "language_holder", (yield* g.new_(f, rt.sv(f, "initial_language_holder"), [live(f.src)])));
		return rt.sv(f, "language_holder");
	}
	return f.dot;
}, true);

// /atom/movable/proc/grant_language  (code/game/atoms_movable.dm:613)  may sleep
rt.def("/atom/movable/proc/grant_language", function* grant_language(f: Frame, dt: Value) {
	let H: Value = null;
	f.vars = () => [dt, H];
	yield* g.callName(f, (H = (yield* g.srcCall(f, "get_language_holder"))), "grant_language", [live(dt)]);
	return f.dot;
}, true);

// /atom/movable/proc/grant_all_languages  (code/game/atoms_movable.dm:617)  may sleep
rt.def("/atom/movable/proc/grant_all_languages", function* grant_all_languages(f: Frame, omnitongue: Value) {
	let H: Value = null;
	f.vars = () => [omnitongue, H];
	if (live(omnitongue) === null) {
		omnitongue = 0;
	}
	yield* g.callName(f, (H = (yield* g.srcCall(f, "get_language_holder"))), "grant_all_languages", [live(omnitongue)]);
	return f.dot;
}, true);

// /atom/movable/proc/get_random_understood_language  (code/game/atoms_movable.dm:621)  may sleep
rt.def("/atom/movable/proc/get_random_understood_language", function* get_random_understood_language(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	f.dot = (yield* g.callName(f, (H = (yield* g.srcCall(f, "get_language_holder"))), "get_random_understood_language", []));
	return f.dot;
}, true);

// /atom/movable/proc/remove_language  (code/game/atoms_movable.dm:625)  may sleep
rt.def("/atom/movable/proc/remove_language", function* remove_language(f: Frame, dt: Value) {
	let H: Value = null;
	f.vars = () => [dt, H];
	yield* g.callName(f, (H = (yield* g.srcCall(f, "get_language_holder"))), "remove_language", [live(dt)]);
	return f.dot;
}, true);

// /atom/movable/proc/remove_all_languages  (code/game/atoms_movable.dm:629)  may sleep
rt.def("/atom/movable/proc/remove_all_languages", function* remove_all_languages(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	yield* g.callName(f, (H = (yield* g.srcCall(f, "get_language_holder"))), "remove_all_languages", []);
	return f.dot;
}, true);

// /atom/movable/proc/has_language  (code/game/atoms_movable.dm:633)  may sleep
rt.def("/atom/movable/proc/has_language", function* has_language(f: Frame, dt: Value) {
	let H: Value = null;
	f.vars = () => [dt, H];
	f.dot = (yield* g.callName(f, (H = (yield* g.srcCall(f, "get_language_holder"))), "has_language", [live(dt)]));
	return f.dot;
}, true);

// /atom/movable/proc/copy_known_languages_from  (code/game/atoms_movable.dm:637)  may sleep
rt.def("/atom/movable/proc/copy_known_languages_from", function* copy_known_languages_from(f: Frame, thing: Value, replace: Value) {
	let H: Value = null;
	f.vars = () => [thing, replace, H];
	if (live(replace) === null) {
		replace = 0;
	}
	f.dot = (yield* g.callName(f, (H = (yield* g.srcCall(f, "get_language_holder"))), "copy_known_languages_from", [live(thing), live(replace)]));
	return f.dot;
}, true);

// /atom/movable/proc/can_speak_in_language  (code/game/atoms_movable.dm:646)  may sleep
rt.def("/atom/movable/proc/can_speak_in_language", function* can_speak_in_language(f: Frame, dt: Value) {
	let H: Value = null;
	f.vars = () => [dt, H];
	if (!truthy((yield* g.callName(f, (H = (yield* g.srcCall(f, "get_language_holder"))), "has_language", [live(dt)])))) {
		return 0;
	} else {
		if (truthy(rt.fv(f, "omnitongue", live(H)))) {
			return 1;
		} else {
			if ((truthy((yield* g.srcCall(f, "could_speak_in_language", live(dt)))) && (!truthy(rt.fv(f, "only_speaks_language", live(H))) || isEqual(rt.fv(f, "only_speaks_language", live(H)), live(dt))))) {
				return 1;
			} else {
				return 0;
			}
		}
	}
	return f.dot;
}, true);

// /atom/movable/proc/get_default_language  (code/game/atoms_movable.dm:660)  may sleep
rt.def("/atom/movable/proc/get_default_language", function* get_default_language(f: Frame) {
	let H: Value = null, chosen_langtype: Value = null, highest_priority: Value = null, lt: Value = null, langtype: Value = null, pri: Value = null;
	let $e: any;
	f.vars = () => [H, chosen_langtype, highest_priority, lt, langtype, pri, $e];
	if (truthy(rt.gv(f, "selected_default_language", (H = (yield* g.srcCall(f, "get_language_holder")))))) {
		if (truthy((yield* g.srcCall(f, "can_speak_in_language", rt.fv(f, "selected_default_language", live(H)))))) {
			return rt.fv(f, "selected_default_language", live(H));
		}
		rt.setFv(f, "selected_default_language", live(H), null);
	}
	chosen_langtype = null;
	highest_priority = null;
	lt = null;
	rt.forList(f, 0, rt.fv(f, "languages", live(H)));
	while (($e = rt.next(f, 0)) !== undefined) {
		lt = $e;
		if (!truthy((yield* g.srcCall(f, "can_speak_in_language", (langtype = live(lt)))))) {
			continue;
		}
		pri = rt.initial(f, live(langtype), "default_priority");
		if ((!truthy(live(highest_priority)) || rt.gt(live(pri), live(highest_priority)))) {
			chosen_langtype = live(langtype);
			highest_priority = live(pri);
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "selected_default_language", live(H), live(f.dot));
	f.dot = live(chosen_langtype);
	return f.dot;
}, true);

// /atom/movable/proc/ConveyorMove  (code/game/atoms_movable.dm:688)  may sleep
rt.def("/atom/movable/proc/ConveyorMove", function* ConveyorMove(f: Frame, movedir: Value) {
	f.vars = () => [movedir];
	if (!(!truthy(rt.sv(f, "anchored")) && truthy((yield* g.srcCall(f, "has_gravity"))))) return f.dot;
	yield* g.call(f, P("/proc/step"), null, [live(f.src), live(movedir)]);
	return f.dot;
}, true, { waitfor: false });

// /atom/movable/proc/can_be_pulled  (code/game/atoms_movable.dm:696)
rt.def("/atom/movable/proc/can_be_pulled", function can_be_pulled(f: Frame, user: Value) {
	if ((isEqual(live(f.src), live(user)) || !truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "anchored")) || truthy(rt.sv(f, "throwing")))) {
		return 0;
	}
	return 1;
});
