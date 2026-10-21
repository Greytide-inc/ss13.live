// From code/modules/mob/living/simple_animal/hostile/hostile.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4854, "/mob/living/simple_animal/hostile", "/mob/living/simple_animal", {
	target: null,
	ranged: 0,
	rapid: 0,
	projectiletype: null,
	projectilesound: null,
	casingtype: null,
	move_to_delay: 3,
	friends: null,
	emote_taunt: null,
	taunt_chance: 0,
	ranged_message: "fires",
	ranged_cooldown: 0,
	ranged_cooldown_time: 30,
	ranged_ignores_vision: 0,
	check_friendly_fire: 0,
	retreat_distance: null,
	minimum_distance: 1,
	robust_searching: 0,
	vision_range: 9,
	aggro_vision_range: 9,
	idle_vision_range: 9,
	search_objects: 0,
	search_objects_timer_id: null,
	search_objects_regain_time: 30,
	wanted_objects: null,
	stat_attack: 0,
	stat_exclusive: 0,
	attack_same: 0,
	AIStatus: 1,
	targets_from: null,
	attack_all_objects: 0,
	lose_patience_timer_id: null,
	lose_patience_timeout: 300,
	environment_target_typecache: null,
	faction: null,
	stop_automated_movement_when_pulled: 0,
	obj_damage: 40,
	environment_smash: 1,
});

// /mob/living/simple_animal/hostile/proc/<init>  (code/modules/mob/living/simple_animal/hostile/hostile.dm:13)
rt.def("/mob/living/simple_animal/hostile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "friends", rt.list());
	$0 = $0;
	rt.setSv(f, "emote_taunt", rt.list());
	$0 = $0;
	rt.setSv(f, "wanted_objects", rt.list());
	$0 = $0;
	rt.setSv(f, "faction", rt.list("hostile"));
	$0 = $0;
	rt.setSv(f, "environment_target_typecache", rt.list(T("/obj/machinery/door/window"), T("/obj/structure/window"), T("/obj/structure/closet"), T("/obj/structure/table"), T("/obj/structure/grille"), T("/obj/structure/girder"), T("/obj/structure/rack"), T("/obj/structure/barricade")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/hostile.dm:58)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "targets_from"))) {
		rt.setSv(f, "targets_from", live(f.src));
	}
	rt.setSv(f, "environment_target_typecache", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "environment_target_typecache")])));
	rt.setSv(f, "wanted_objects", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "wanted_objects")])));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/hostile.dm:68)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "targets_from", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/proc/Life  (code/modules/mob/living/simple_animal/hostile/hostile.dm:71)
rt.def("/mob/living/simple_animal/hostile/proc/Life", function Life(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.dot))) return f.dot;
	rt.call(f, P("/proc/walk"), null, [live(f.src), 0]);
	return 0;
}, false, { waitfor: false });

// /mob/living/simple_animal/hostile/proc/handle_automated_action  (code/modules/mob/living/simple_animal/hostile/hostile.dm:77)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let possible_targets: Value = null;
	f.vars = () => [possible_targets];
	if (isEqual(rt.sv(f, "AIStatus"), 3)) {
		return 0;
	}
	possible_targets = (yield* g.srcCall(f, "ListTargets"));
	if (truthy(rt.sv(f, "environment_smash"))) {
		yield* g.srcCall(f, "EscapeConfinement");
	}
	if (truthy((yield* g.srcCall(f, "AICanContinue", live(possible_targets))))) {
		yield* g.srcCall(f, "DestroySurroundings");
		if (!truthy((yield* g.srcCall(f, "MoveToTarget", live(possible_targets))))) {
			if (truthy((yield* g.srcCall(f, "AIShouldSleep", live(possible_targets))))) {
				rt.setSv(f, "AIStatus", 2);
			}
		}
	}
	return 1;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/proc/attacked_by  (code/modules/mob/living/simple_animal/hostile/hostile.dm:92)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/attacked_by", function* attacked_by(f: Frame) {
	if (((((isEqual(rt.sv(f, "stat"), 0) && !truthy(rt.sv(f, "target"))) && !isEqual(rt.sv(f, "AIStatus"), 3)) && !truthy(rt.sv(f, "client"))) && truthy(live(f.args[1])))) {
		yield* g.srcCall(f, "FindTarget", rt.list(live(f.args[1])), 1);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user"] });

// /mob/living/simple_animal/hostile/proc/bullet_act  (code/modules/mob/living/simple_animal/hostile/hostile.dm:97)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/bullet_act", function* bullet_act(f: Frame) {
	if ((((isEqual(rt.sv(f, "stat"), 0) && !truthy(rt.sv(f, "target"))) && !isEqual(rt.sv(f, "AIStatus"), 3)) && !truthy(rt.sv(f, "client")))) {
		if ((truthy(rt.fv(f, "firer", live(f.args[0]))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.fv(f, "firer", live(f.args[0]))])), rt.sv(f, "aggro_vision_range")))) {
			yield* g.srcCall(f, "FindTarget", rt.list(rt.fv(f, "firer", live(f.args[0]))), 1);
		}
		yield* g.srcCall(f, "Goto", rt.fv(f, "starting", live(f.args[0])), rt.sv(f, "move_to_delay"), 3);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["P"] });

// /mob/living/simple_animal/hostile/proc/ListTargets  (code/modules/mob/living/simple_animal/hostile/hostile.dm:106)
rt.def("/mob/living/simple_animal/hostile/proc/ListTargets", function ListTargets(f: Frame) {
	let HM: Value = null;
	let $e: any;
	f.vars = () => [HM, $e];
	if (!truthy(rt.sv(f, "search_objects"))) {
		f.dot = subtract(rt.call(f, P("/proc/hearers"), null, [rt.sv(f, "vision_range"), rt.sv(f, "targets_from")]), live(f.src));
		HM = null;
		rt.forList(f, 0, rt.call(f, P("/proc/typecache_filter_range"), null, [rt.sv(f, "vision_range"), rt.sv(f, "targets_from"), rt.gl("hostile_machines")]));
		while (($e = rt.next(f, 0)) !== undefined) {
			HM = $e;
			if (truthy(rt.call(f, P("/proc/can_see"), null, [rt.sv(f, "targets_from"), live(HM), rt.sv(f, "vision_range")]))) {
				f.dot = rt.modify(live(f.dot), live(HM), add);
			}
		}
		rt.endFor(f, 0);
	} else {
		f.dot = rt.call(f, P("/proc/oview"), null, [rt.sv(f, "vision_range"), rt.sv(f, "targets_from")]);
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/proc/FindTarget  (code/modules/mob/living/simple_animal/hostile/hostile.dm:118)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/FindTarget", function* FindTarget(f: Frame, possible_targets: Value, HasTargetsList: Value) {
	let pos_targ: Value = null, A: Value = null, Target: Value = null;
	let $e: any;
	f.vars = () => [possible_targets, HasTargetsList, pos_targ, A, Target, $e];
	if (live(HasTargetsList) === null) {
		HasTargetsList = 0;
	}
	f.dot = rt.list();
	if (!truthy(live(HasTargetsList))) {
		possible_targets = (yield* g.srcCall(f, "ListTargets"));
	}
	pos_targ = null;
	rt.forList(f, 0, live(possible_targets));
	while (($e = rt.next(f, 0)) !== undefined) {
		pos_targ = $e;
		if (truthy((yield* g.srcCall(f, "Found", (A = live(pos_targ)))))) {
			f.dot = rt.list(live(A));
			break;
		}
		if (truthy((yield* g.srcCall(f, "CanAttack", live(A))))) {
			f.dot = rt.modify(live(f.dot), live(A), add);
			continue;
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "GiveTarget", (Target = (yield* g.srcCall(f, "PickTarget", live(f.dot)))));
	return live(Target);
}, true);

// /mob/living/simple_animal/hostile/proc/PossibleThreats  (code/modules/mob/living/simple_animal/hostile/hostile.dm:136)
rt.def("/mob/living/simple_animal/hostile/proc/PossibleThreats", function PossibleThreats(f: Frame) {
	let pos_targ: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [pos_targ, A, $e];
	f.dot = rt.list();
	pos_targ = null;
	rt.forList(f, 0, rt.callSrc(f, "ListTargets", []));
	while (($e = rt.next(f, 0)) !== undefined) {
		pos_targ = $e;
		if (truthy(rt.callSrc(f, "Found", [(A = live(pos_targ))]))) {
			f.dot = rt.list(live(A));
			break;
		}
		if (truthy(rt.callSrc(f, "CanAttack", [live(A)]))) {
			f.dot = rt.modify(live(f.dot), live(A), add);
			continue;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/simple_animal/hostile/proc/PickTarget  (code/modules/mob/living/simple_animal/hostile/hostile.dm:152)
rt.def("/mob/living/simple_animal/hostile/proc/PickTarget", function PickTarget(f: Frame, Targets: Value) {
	let pos_targ: Value = null, A: Value = null, target_dist: Value = null, possible_target_distance: Value = null, chosen_target: Value = null;
	let $e: any;
	f.vars = () => [Targets, pos_targ, A, target_dist, possible_target_distance, chosen_target, $e];
	if (rt.sv(f, "target") !== null) {
		pos_targ = null;
		rt.forList(f, 0, live(Targets));
		while (($e = rt.next(f, 0)) !== undefined) {
			pos_targ = $e;
			A = live(pos_targ);
			target_dist = rt.call(f, P("/proc/get_dist"), null, [rt.sv(f, "targets_from"), rt.sv(f, "target")]);
			possible_target_distance = rt.call(f, P("/proc/get_dist"), null, [rt.sv(f, "targets_from"), live(A)]);
			if (rt.lt(live(target_dist), live(possible_target_distance))) {
				(Targets = rt.modify(live(Targets), live(A), subtract));
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.len(f, live(Targets)))) {
		return live(f.dot);
	}
	return (chosen_target = rt.op(f, "PickUnweighted", [1], [live(Targets)]));
});

// /mob/living/simple_animal/hostile/proc/CanAttack  (code/modules/mob/living/simple_animal/hostile/hostile.dm:165)
rt.def("/mob/living/simple_animal/hostile/proc/CanAttack", function CanAttack(f: Frame, the_target: Value) {
	let L: Value = null, faction_check: Value = null, M: Value = null, _P: Value = null, OW: Value = null;
	f.vars = () => [L, faction_check, M, _P, OW];
	if (!truthy(live(the_target))) {
		return 0;
	}
	if (rt.lt(rt.sv(f, "see_invisible"), rt.fv(f, "invisibility", live(the_target)))) {
		return 0;
	}
	if (rt.lt(rt.sv(f, "search_objects"), 2)) {
		if (truthy((rt.istype(live(the_target), T("/mob/living")) ? 1 : 0))) {
			L = live(the_target);
			faction_check = rt.callSrc(f, "faction_check_mob", [live(L)]);
			if (truthy(rt.sv(f, "robust_searching"))) {
				if ((rt.gt(rt.fv(f, "stat", live(L)), rt.sv(f, "stat_attack")) || (!isEqual(rt.fv(f, "stat", live(L)), rt.sv(f, "stat_attack")) && isEqual(rt.sv(f, "stat_exclusive"), 1)))) {
					return 0;
				}
				if (((truthy(live(faction_check)) && !truthy(rt.sv(f, "attack_same"))) || (!truthy(live(faction_check)) && isEqual(rt.sv(f, "attack_same"), 2)))) {
					return 0;
				}
				if (truthy((rt.isIn(f, live(L), rt.sv(f, "friends")) ? 1 : 0))) {
					return 0;
				}
			} else {
				if (truthy(rt.fv(f, "stat", live(L)))) {
					return 0;
				}
				if ((truthy(live(faction_check)) && !truthy(rt.sv(f, "attack_same")))) {
					return 0;
				}
			}
			return 1;
		}
		if (truthy((rt.istype(live(the_target), T("/obj/mecha")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "occupant", (M = live(the_target))))) {
				if (truthy(rt.callSrc(f, "CanAttack", [rt.fv(f, "occupant", live(M))]))) {
					return 1;
				}
			}
		}
		if (truthy((rt.istype(live(the_target), T("/obj/machinery/porta_turret")) ? 1 : 0))) {
			if (truthy((rt.isIn(f, rt.gv(f, "faction", (_P = live(the_target))), rt.sv(f, "faction")) ? 1 : 0))) {
				return 0;
			}
			if ((truthy(rt.fv(f, "has_cover", live(_P))) && !truthy(rt.fv(f, "raised", live(_P))))) {
				return 0;
			}
			if (truthy(rt.bitAnd(rt.fv(f, "stat", live(_P)), 1))) {
				return 0;
			}
			return 1;
		}
		if (truthy((rt.istype(live(the_target), T("/obj/structure/destructible/clockwork/ocular_warden")) ? 1 : 0))) {
			if (!isEqual(rt.gv(f, "target", (OW = live(the_target))), live(f.src))) {
				return 0;
			}
			return 1;
		}
	}
	if (truthy((rt.istype(live(the_target), T("/obj")) ? 1 : 0))) {
		if ((truthy(rt.sv(f, "attack_all_objects")) || truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(the_target), rt.sv(f, "wanted_objects")])))) {
			return 1;
		}
	}
	return 0;
});

// /mob/living/simple_animal/hostile/proc/GiveTarget  (code/modules/mob/living/simple_animal/hostile/hostile.dm:216)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/GiveTarget", function* GiveTarget(f: Frame, new_target: Value) {
	f.vars = () => [new_target];
	rt.setSv(f, "target", live(new_target));
	yield* g.srcCall(f, "LosePatience");
	if (rt.sv(f, "target") === null) return f.dot;
	yield* g.srcCall(f, "GainPatience");
	yield* g.srcCall(f, "Aggro");
	return 1;
}, true);

// /mob/living/simple_animal/hostile/proc/MoveToTarget  (code/modules/mob/living/simple_animal/hostile/hostile.dm:225)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/MoveToTarget", function* MoveToTarget(f: Frame, possible_targets: Value) {
	let target_distance: Value = null;
	f.vars = () => [possible_targets, target_distance];
	rt.setSv(f, "stop_automated_movement", 1);
	if ((!truthy(rt.sv(f, "target")) || !truthy((yield* g.srcCall(f, "CanAttack", rt.sv(f, "target")))))) {
		yield* g.srcCall(f, "LoseTarget");
		return 0;
	}
	if (truthy((rt.isIn(f, rt.sv(f, "target"), live(possible_targets)) ? 1 : 0))) {
		if (!isEqual(rt.fv(f, "z", rt.sv(f, "target")), rt.sv(f, "z"))) {
			yield* g.srcCall(f, "LoseTarget");
			return 0;
		}
		target_distance = (yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "targets_from"), rt.sv(f, "target")]));
		if (truthy(rt.sv(f, "ranged"))) {
			if ((!truthy((yield* g.callName(f, rt.sv(f, "target"), "Adjacent", [rt.sv(f, "targets_from")]))) && rt.le(rt.sv(f, "ranged_cooldown"), rt.worldTime(f)))) {
				yield* g.srcCall(f, "OpenFire", rt.sv(f, "target"));
			}
		}
		if (!truthy((yield* g.srcCall(f, "Process_Spacemove")))) {
			yield* g.call(f, P("/proc/walk"), null, [live(f.src), 0]);
			return 1;
		}
		if (rt.sv(f, "retreat_distance") !== null) {
			if (rt.le(live(target_distance), rt.sv(f, "retreat_distance"))) {
				yield* g.call(f, P("/proc/walk_away"), null, [live(f.src), rt.sv(f, "target"), rt.sv(f, "retreat_distance"), rt.sv(f, "move_to_delay")]);
			} else {
				yield* g.srcCall(f, "Goto", rt.sv(f, "target"), rt.sv(f, "move_to_delay"), rt.sv(f, "minimum_distance"));
			}
		} else {
			yield* g.srcCall(f, "Goto", rt.sv(f, "target"), rt.sv(f, "move_to_delay"), rt.sv(f, "minimum_distance"));
		}
		if (truthy(rt.sv(f, "target"))) {
			if (((truthy(rt.sv(f, "targets_from")) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "targets_from"))])))) && truthy((yield* g.callName(f, rt.sv(f, "target"), "Adjacent", [rt.sv(f, "targets_from")]))))) {
				yield* g.srcCall(f, "AttackingTarget");
				yield* g.srcCall(f, "GainPatience");
			}
			return 1;
		}
		return 0;
	}
	if (truthy(rt.sv(f, "environment_smash"))) {
		if ((rt.fv(f, "loc", rt.sv(f, "target")) !== null && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "targets_from"), rt.fv(f, "loc", rt.sv(f, "target"))])), rt.sv(f, "vision_range")))) {
			if ((truthy(rt.sv(f, "ranged_ignores_vision")) && rt.le(rt.sv(f, "ranged_cooldown"), rt.worldTime(f)))) {
				yield* g.srcCall(f, "OpenFire", rt.sv(f, "target"));
			}
			if (rt.ge(rt.sv(f, "environment_smash"), 2)) {
				yield* g.srcCall(f, "Goto", rt.sv(f, "target"), rt.sv(f, "move_to_delay"), rt.sv(f, "minimum_distance"));
				yield* g.srcCall(f, "FindHidden");
				return 1;
			} else {
				if (truthy((yield* g.srcCall(f, "FindHidden")))) {
					return 1;
				}
			}
		}
	}
	yield* g.srcCall(f, "LoseTarget");
	return 0;
}, true);

// /mob/living/simple_animal/hostile/proc/Goto  (code/modules/mob/living/simple_animal/hostile/hostile.dm:267)
rt.def("/mob/living/simple_animal/hostile/proc/Goto", function Goto(f: Frame, target: Value, delay: Value, minimum_distance: Value) {
	rt.call(f, P("/proc/walk_to"), null, [live(f.src), live(target), live(minimum_distance), live(delay)]);
	return f.dot;
});

// /mob/living/simple_animal/hostile/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/hostile.dm:270)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(((!truthy(rt.sv(f, "ckey")) && !truthy(rt.sv(f, "stat"))) && rt.lt(rt.sv(f, "search_objects"), 3)) && rt.gt(live(f.dot), 0))) return f.dot;
	if (truthy(rt.sv(f, "search_objects"))) {
		rt.setSv(f, "target", null);
		yield* g.srcCall(f, "LoseSearchObjects");
	}
	if (isEqual(rt.sv(f, "AIStatus"), 2)) {
		rt.setSv(f, "AIStatus", 1);
		yield* g.srcCall(f, "FindTarget");
	} else {
		if (!(rt.sv(f, "target") !== null && truthy(rt.op(f, "Prob", [], [40])))) return f.dot;
		yield* g.srcCall(f, "FindTarget");
	}
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/hostile.dm:283)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	return (yield* g.callName(f, rt.sv(f, "target"), "attack_animal", [live(f.src)]));
}, true);

// /mob/living/simple_animal/hostile/proc/Aggro  (code/modules/mob/living/simple_animal/hostile/hostile.dm:286)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/Aggro", function* Aggro(f: Frame) {
	rt.setSv(f, "vision_range", rt.sv(f, "aggro_vision_range"));
	if (!((truthy(rt.sv(f, "target")) && truthy(rt.len(f, rt.sv(f, "emote_taunt")))) && truthy(rt.op(f, "Prob", [], [rt.sv(f, "taunt_chance")])))) return f.dot;
	yield* g.srcCall(f, "emote", "me", 1, fmt("＀ at ＀.", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "emote_taunt")]), rt.sv(f, "target")]));
	rt.setSv(f, "taunt_chance", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "taunt_chance"), 7), 2])));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/proc/LoseAggro  (code/modules/mob/living/simple_animal/hostile/hostile.dm:294)
rt.def("/mob/living/simple_animal/hostile/proc/LoseAggro", function LoseAggro(f: Frame) {
	rt.setSv(f, "stop_automated_movement", 0);
	rt.setSv(f, "vision_range", rt.sv(f, "idle_vision_range"));
	rt.setSv(f, "taunt_chance", rt.initial(f, live(f.src), "taunt_chance"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/proc/LoseTarget  (code/modules/mob/living/simple_animal/hostile/hostile.dm:299)
rt.def("/mob/living/simple_animal/hostile/proc/LoseTarget", function LoseTarget(f: Frame) {
	rt.setSv(f, "target", null);
	rt.call(f, P("/proc/walk"), null, [live(f.src), 0]);
	rt.callSrc(f, "LoseAggro", []);
	return f.dot;
});

// /mob/living/simple_animal/hostile/proc/death  (code/modules/mob/living/simple_animal/hostile/hostile.dm:305)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/death", function* death(f: Frame, gibbed: Value) {
	f.vars = () => [gibbed];
	yield* g.srcCall(f, "LoseTarget");
	yield* g.callSuper(f, [live(gibbed)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/proc/summon_backup  (code/modules/mob/living/simple_animal/hostile/hostile.dm:309)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/summon_backup", function* summon_backup(f: Frame, distance: Value, exact_faction_match: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [distance, exact_faction_match, M, $e];
	yield* g.srcCall(f, "do_alert_animation", live(f.src));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/chime.ogg"), 50, 1, -1]);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [live(distance), rt.sv(f, "targets_from")])), T("/mob/living/simple_animal/hostile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((yield* g.srcCall(f, "faction_check_mob", live(M), 1)))) {
			if (isEqual(rt.fv(f, "AIStatus", live(M)), 3)) {
				return live(f.dot);
			} else {
				yield* g.callName(f, live(M), "Goto", [live(f.src), rt.fv(f, "move_to_delay", live(M)), rt.fv(f, "minimum_distance", live(M))]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/proc/OpenFire  (code/modules/mob/living/simple_animal/hostile/hostile.dm:320)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/OpenFire", function* OpenFire(f: Frame, A: Value) {
	let _T: Value = null, L: Value = null, cb: Value = null;
	let $e: any;
	f.vars = () => [A, _T, L, cb, $e];
	if (truthy(rt.sv(f, "check_friendly_fire"))) {
		_T = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/getline"), null, [live(f.src), live(A)])), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			L = null;
			rt.forList(f, 1, live(_T), T("/mob/living"));
			while (($e = rt.next(f, 1)) !== undefined) {
				L = $e;
				if ((isEqual(live(L), live(f.src)) || isEqual(live(L), live(A)))) {
					continue;
				}
				if ((truthy((yield* g.srcCall(f, "faction_check_mob", live(L)))) && !truthy(rt.sv(f, "attack_same")))) {
					return live(f.dot);
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'><b>＀</b> ＀ at ＀!</span>", [live(f.src), rt.sv(f, "ranged_message"), live(A)]));
	if (truthy(rt.sv(f, "rapid"))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(cb = (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/proc/Shoot"), live(A)]))), 1]);
		yield* g.call(f, P("/proc/addtimer"), null, [live(cb), 4]);
		yield* g.call(f, P("/proc/addtimer"), null, [live(cb), 6]);
	} else {
		yield* g.srcCall(f, "Shoot", live(A));
	}
	rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), rt.sv(f, "ranged_cooldown_time")));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/proc/Shoot  (code/modules/mob/living/simple_animal/hostile/hostile.dm:339)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/Shoot", function* Shoot(f: Frame, targeted_atom: Value) {
	let startloc: Value = null, casing: Value = null, _P: Value = null;
	f.vars = () => [targeted_atom, startloc, casing, _P];
	if ((((!truthy(live(targeted_atom)) || truthy(rt.fv(f, "gc_destroyed", live(targeted_atom)))) || isEqual(live(targeted_atom), rt.fv(f, "loc", rt.sv(f, "targets_from")))) || isEqual(live(targeted_atom), rt.sv(f, "targets_from")))) {
		return live(f.dot);
	}
	startloc = rt.getStep(f, rt.sv(f, "targets_from"), 0);
	if (truthy(rt.sv(f, "casingtype"))) {
		casing = (yield* g.new_(f, rt.sv(f, "casingtype"), [live(startloc)]));
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "projectilesound"), 100, 1]);
		yield* g.callName(f, live(casing), "fire_casing", [null, live(targeted_atom), null, live(f.src), null, null, null, null, null, null, "zone_override", (yield* g.call(f, P("/proc/ran_zone"), null, []))], rt.Args.Named);
	} else {
		if (!truthy(rt.sv(f, "projectiletype"))) return f.dot;
		_P = (yield* g.new_(f, rt.sv(f, "projectiletype"), [live(startloc)]));
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "projectilesound"), 100, 1]);
		rt.setFv(f, "current", live(_P), live(startloc));
		rt.setFv(f, "starting", live(_P), live(startloc));
		rt.setFv(f, "firer", live(_P), live(f.src));
		rt.setFv(f, "yo", live(_P), subtract(rt.fv(f, "y", live(targeted_atom)), rt.fv(f, "y", live(startloc))));
		rt.setFv(f, "xo", live(_P), subtract(rt.fv(f, "x", live(targeted_atom)), rt.fv(f, "x", live(startloc))));
		if (!isEqual(rt.sv(f, "AIStatus"), 1)) {
			yield* g.srcCall(f, "newtonian_move", rt.getDir(f, live(targeted_atom), rt.sv(f, "targets_from")));
		}
		rt.setFv(f, "original", live(_P), live(targeted_atom));
		yield* g.callName(f, live(_P), "fire", []);
		return live(_P);
	}
	return f.dot;
}, true, { argTypes: [{ path: "/atom" }] });

// /mob/living/simple_animal/hostile/proc/DestroySurroundings  (code/modules/mob/living/simple_animal/hostile/hostile.dm:363)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/DestroySurroundings", function* DestroySurroundings(f: Frame) {
	let dir: Value = null, _T: Value = null, a: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [dir, _T, a, A, $e];
	if (!truthy(rt.sv(f, "environment_smash"))) return f.dot;
	yield* g.srcCall(f, "EscapeConfinement");
	dir = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		dir = $e;
		if ((truthy((rt.istype((_T = rt.getStep(f, rt.sv(f, "targets_from"), live(dir))), T("/turf/closed/wall")) ? 1 : 0)) || truthy((rt.istype(live(_T), T("/turf/closed/mineral")) ? 1 : 0)))) {
			if (truthy((yield* g.callName(f, live(_T), "Adjacent", [rt.sv(f, "targets_from")])))) {
				yield* g.callName(f, live(_T), "attack_animal", [live(f.src)]);
			}
		}
		a = null;
		rt.forList(f, 1, live(_T));
		while (($e = rt.next(f, 1)) !== undefined) {
			a = $e;
			if (!truthy((yield* g.callName(f, (A = live(a)), "Adjacent", [rt.sv(f, "targets_from")])))) {
				continue;
			}
			if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(A), rt.sv(f, "environment_target_typecache")])))) {
				yield* g.callName(f, live(A), "attack_animal", [live(f.src)]);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/proc/EscapeConfinement  (code/modules/mob/living/simple_animal/hostile/hostile.dm:378)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/EscapeConfinement", function* EscapeConfinement(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.callName(f, rt.sv(f, "buckled"), "attack_animal", [live(f.src)]);
	}
	if (!(!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "targets_from"))]))) && rt.fv(f, "loc", rt.sv(f, "targets_from")) !== null)) return f.dot;
	yield* g.callName(f, (A = rt.getStep(f, rt.sv(f, "targets_from"), 0)), "attack_animal", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/proc/FindHidden  (code/modules/mob/living/simple_animal/hostile/hostile.dm:385)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/FindHidden", function* FindHidden(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (!((truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "target")), T("/obj/structure/closet")) ? 1 : 0)) || truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "target")), T("/obj/machinery/disposal")) ? 1 : 0))) || truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "target")), T("/obj/machinery/sleeper")) ? 1 : 0)))) return f.dot;
	yield* g.srcCall(f, "Goto", (A = rt.fv(f, "loc", rt.sv(f, "target"))), rt.sv(f, "move_to_delay"), rt.sv(f, "minimum_distance"));
	if (truthy((yield* g.callName(f, live(A), "Adjacent", [rt.sv(f, "targets_from")])))) {
		yield* g.callName(f, live(A), "attack_animal", [live(f.src)]);
	}
	return 1;
}, true);

// /mob/living/simple_animal/hostile/proc/RangedAttack  (code/modules/mob/living/simple_animal/hostile/hostile.dm:393)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/RangedAttack", function* RangedAttack(f: Frame) {
	if ((truthy(rt.sv(f, "ranged")) && rt.le(rt.sv(f, "ranged_cooldown"), rt.worldTime(f)))) {
		rt.setSv(f, "target", live(f.args[0]));
		yield* g.srcCall(f, "OpenFire", live(f.args[0]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A", "params"] });

// /mob/living/simple_animal/hostile/proc/AICanContinue  (code/modules/mob/living/simple_animal/hostile/hostile.dm:402)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/AICanContinue", function* AICanContinue(f: Frame, possible_targets: Value) {
	let $0: any;
	f.vars = () => [possible_targets, $0];
	$0 = rt.sv(f, "AIStatus");
	if ($0 === 1) {
		f.dot = 1;
	} else if ($0 === 2) {
		if (truthy((yield* g.srcCall(f, "FindTarget", live(possible_targets), 1)))) {
			f.dot = 1;
			rt.setSv(f, "AIStatus", 1);
		} else {
			f.dot = 0;
		}
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/proc/AIShouldSleep  (code/modules/mob/living/simple_animal/hostile/hostile.dm:413)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/AIShouldSleep", function* AIShouldSleep(f: Frame, possible_targets: Value) {
	f.vars = () => [possible_targets];
	return (!truthy((yield* g.srcCall(f, "FindTarget", live(possible_targets), 1))) ? 1 : 0);
}, true);

// /mob/living/simple_animal/hostile/proc/GainPatience  (code/modules/mob/living/simple_animal/hostile/hostile.dm:420)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/GainPatience", function* GainPatience(f: Frame) {
	if (!truthy(rt.sv(f, "lose_patience_timeout"))) return f.dot;
	yield* g.srcCall(f, "LosePatience");
	rt.setSv(f, "lose_patience_timer_id", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/proc/LoseTarget")])), rt.sv(f, "lose_patience_timeout"), 8])));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/proc/LosePatience  (code/modules/mob/living/simple_animal/hostile/hostile.dm:425)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/LosePatience", function* LosePatience(f: Frame) {
	yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "lose_patience_timer_id")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/proc/LoseSearchObjects  (code/modules/mob/living/simple_animal/hostile/hostile.dm:431)  may sleep
rt.def("/mob/living/simple_animal/hostile/proc/LoseSearchObjects", function* LoseSearchObjects(f: Frame) {
	rt.setSv(f, "search_objects", 0);
	yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "search_objects_timer_id")]);
	rt.setSv(f, "search_objects_timer_id", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/proc/RegainSearchObjects")])), rt.sv(f, "search_objects_regain_time"), 8])));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/proc/RegainSearchObjects  (code/modules/mob/living/simple_animal/hostile/hostile.dm:436)
rt.def("/mob/living/simple_animal/hostile/proc/RegainSearchObjects", function RegainSearchObjects(f: Frame, value: Value) {
	f.vars = () => [value];
	if (!truthy(live(value))) {
		value = rt.initial(f, live(f.src), "search_objects");
	}
	rt.setSv(f, "search_objects", live(value));
	return f.dot;
});
