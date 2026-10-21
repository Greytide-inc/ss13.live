// From code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4894, "/mob/living/simple_animal/hostile/syndicate/mecha_pilot", "/mob/living/simple_animal/hostile/syndicate", {
	mecha: null,
	required_mecha_charge: 7500,
	mecha_charge_evacuate: 50,
	threat_use_mecha_smoke: 5,
	defence_mode_chance: 35,
	smoke_chance: 20,
	retreat_chance: 40,
	spawn_mecha_type: rt.typePath("/obj/mecha/combat/marauder/mauler/loaded"),
	name: "Syndicate Mecha Pilot",
	desc: "Death to Nanotrasen. This variant comes in MECHA DEATH flavour.",
	wanted_objects: null,
	search_objects: 0,
});

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:24)
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "wanted_objects", rt.list());
	return f.dot;
});

rt.type(4895, "/mob/living/simple_animal/hostile/syndicate/mecha_pilot/no_mech", "/mob/living/simple_animal/hostile/syndicate/mecha_pilot", {
	spawn_mecha_type: null,
	search_objects: 2,
});

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/no_mech/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:43)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/no_mech/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "wanted_objects", (yield* g.call(f, P("/proc/typecacheof"), null, [null, T("/obj/mecha/combat"), "ignore_root_path", 1], rt.Args.Named)));
	return f.dot;
}, true);

rt.type(4897, "/mob/living/simple_animal/hostile/syndicate/mecha_pilot/nanotrasen", "/mob/living/simple_animal/hostile/syndicate/mecha_pilot", {
	name: "Nanotrasen Mecha Pilot",
	desc: "Death to the Syndicate. This variant comes in MECHA DEATH flavour.",
	icon_living: "nanotrasen",
	icon_state: "nanotrasen",
	faction: null,
	spawn_mecha_type: rt.typePath("/obj/mecha/combat/marauder/loaded"),
});

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/nanotrasen/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:51)
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/nanotrasen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("nanotrasen"));
	return f.dot;
});

rt.type(4896, "/mob/living/simple_animal/hostile/syndicate/mecha_pilot/no_mech/nanotrasen", "/mob/living/simple_animal/hostile/syndicate/mecha_pilot/no_mech", {
	name: "Nanotrasen Mecha Pilot",
	desc: "Death to the Syndicate. This variant comes in MECHA DEATH flavour.",
	icon_living: "nanotrasen",
	icon_state: "nanotrasen",
	faction: null,
});

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/no_mech/nanotrasen/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:59)
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/no_mech/nanotrasen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("nanotrasen"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:63)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "spawn_mecha_type"))) return f.dot;
	if (!truthy((rt.istype((M = (yield* g.new_(f, rt.sv(f, "spawn_mecha_type"), [rt.getStep(f, live(f.src), 0)]))), T("/obj/mecha")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "enter_mecha", live(M));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/enter_mecha  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:71)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/enter_mecha", function* enter_mecha(f: Frame, M: Value) {
	let do_ranged: Value = null, equip: Value = null, ME: Value = null;
	let $e: any;
	f.vars = () => [M, do_ranged, equip, ME, $e];
	if (!truthy(live(M))) {
		return 0;
	}
	rt.setSv(f, "target", null);
	yield* g.callName(f, live(M), "aimob_enter_mech", [live(f.src)]);
	rt.setSv(f, "targets_from", live(M));
	rt.setSv(f, "allow_movement_on_non_turfs", 1);
	do_ranged = 0;
	equip = null;
	rt.forList(f, 0, rt.fv(f, "equipment", rt.sv(f, "mecha")));
	while (($e = rt.next(f, 0)) !== undefined) {
		equip = $e;
		if (truthy(rt.bitAnd(rt.gv(f, "range", (ME = live(equip))), 2))) {
			do_ranged = 1;
			break;
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(do_ranged))) {
		rt.setSv(f, "minimum_distance", 5);
		rt.setSv(f, "ranged", 1);
	} else {
		rt.setSv(f, "minimum_distance", 1);
		rt.setSv(f, "ranged", 0);
	}
	rt.setSv(f, "wanted_objects", rt.list());
	rt.setSv(f, "search_objects", 0);
	if (!(truthy(rt.sv(f, "mecha")) && truthy(rt.fv(f, "lights_action", rt.sv(f, "mecha"))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "lights_action", rt.sv(f, "mecha")), "Activate", []);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/exit_mecha  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:96)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/exit_mecha", function* exit_mecha(f: Frame, M: Value) {
	let search_aggressiveness: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [M, search_aggressiveness, C, $e];
	if (!truthy(live(M))) {
		return 0;
	}
	yield* g.callName(f, rt.sv(f, "mecha"), "aimob_exit_mech", [live(f.src)]);
	rt.setSv(f, "allow_movement_on_non_turfs", 0);
	rt.setSv(f, "targets_from", live(f.src));
	rt.setSv(f, "wanted_objects", (yield* g.call(f, P("/proc/typecacheof"), null, [null, T("/obj/mecha/combat"), "ignore_root_path", 1], rt.Args.Named)));
	search_aggressiveness = 2;
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "vision_range"), live(f.src)])), T("/obj/mecha/combat"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy((yield* g.srcCall(f, "is_valid_mecha", live(C))))) {
			rt.setSv(f, "target", live(C));
			search_aggressiveness = 3;
			break;
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "search_objects", live(search_aggressiveness));
	rt.setSv(f, "ranged", 0);
	rt.setSv(f, "minimum_distance", 1);
	yield* g.call(f, P("/proc/walk"), null, [live(M), 0]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/is_valid_mecha  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:119)
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/is_valid_mecha", function is_valid_mecha(f: Frame, M: Value) {
	if (!truthy(live(M))) {
		return 0;
	}
	if (truthy(rt.fv(f, "occupant", live(M)))) {
		return 0;
	}
	if (!truthy(rt.callName(f, live(M), "has_charge", [rt.sv(f, "required_mecha_charge")]))) {
		return 0;
	}
	if (rt.lt(rt.fv(f, "obj_integrity", live(M)), multiply(rt.fv(f, "max_integrity", live(M)), 0.5))) {
		return 0;
	}
	return 1;
});

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/mecha_face_target  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:132)
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/mecha_face_target", function mecha_face_target(f: Frame, A: Value) {
	let dirto: Value = null;
	f.vars = () => [dirto];
	if (!truthy(rt.sv(f, "mecha"))) return f.dot;
	dirto = rt.getDir(f, rt.sv(f, "mecha"), live(A));
	if (isEqual(rt.fv(f, "dir", rt.sv(f, "mecha")), live(dirto))) return f.dot;
	rt.callName(f, rt.sv(f, "mecha"), "mechturn", [live(dirto)]);
	return f.dot;
});

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/mecha_reload  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:140)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/mecha_reload", function* mecha_reload(f: Frame) {
	let equip: Value = null, ME: Value = null;
	let $e: any;
	f.vars = () => [equip, ME, $e];
	if (!truthy(rt.sv(f, "mecha"))) return f.dot;
	equip = null;
	rt.forList(f, 0, rt.fv(f, "equipment", rt.sv(f, "mecha")));
	while (($e = rt.next(f, 0)) !== undefined) {
		equip = $e;
		if (truthy((yield* g.callName(f, (ME = live(equip)), "needs_rearm", [])))) {
			yield* g.callName(f, live(ME), "rearm", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/get_mecha_equip_by_flag  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:147)
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/get_mecha_equip_by_flag", function get_mecha_equip_by_flag(f: Frame, flag: Value) {
	let equip: Value = null, ME: Value = null;
	let $e: any;
	f.vars = () => [flag, equip, ME, $e];
	if (live(flag) === null) {
		flag = 2;
	}
	f.dot = rt.list();
	if (!truthy(rt.sv(f, "mecha"))) return f.dot;
	equip = null;
	rt.forList(f, 0, rt.fv(f, "equipment", rt.sv(f, "mecha")));
	while (($e = rt.next(f, 0)) !== undefined) {
		equip = $e;
		if ((truthy(rt.bitAnd(rt.gv(f, "range", (ME = live(equip))), live(flag))) && truthy(rt.callName(f, live(ME), "action_checks", [live(ME)])))) {
			f.dot = rt.modify(live(f.dot), live(ME), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/OpenFire  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:160)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/OpenFire", function* OpenFire(f: Frame) {
	let possible_weapons: Value = null, ME: Value = null;
	f.vars = () => [possible_weapons, ME];
	if (truthy(rt.sv(f, "mecha"))) {
		yield* g.srcCall(f, "mecha_reload");
		yield* g.srcCall(f, "mecha_face_target", live(f.args[0]));
		if (truthy(rt.getLen(f, (possible_weapons = (yield* g.srcCall(f, "get_mecha_equip_by_flag", 2)))))) {
			if (truthy((yield* g.callName(f, (ME = rt.op(f, "PickUnweighted", [1], [live(possible_weapons)])), "action", [live(f.args[0])])))) {
				yield* g.callName(f, live(ME), "start_cooldown", []);
				return live(f.dot);
			}
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["A"] });

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:175)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let possible_weapons: Value = null, ME: Value = null, M: Value = null;
	f.vars = () => [possible_weapons, ME, M];
	if (truthy(rt.sv(f, "mecha"))) {
		if (truthy(rt.getLen(f, (possible_weapons = (yield* g.srcCall(f, "get_mecha_equip_by_flag", 1)))))) {
			ME = rt.op(f, "PickUnweighted", [1], [live(possible_weapons)]);
			yield* g.srcCall(f, "mecha_face_target", rt.sv(f, "target"));
			if (truthy((yield* g.callName(f, live(ME), "action", [rt.sv(f, "target")])))) {
				yield* g.callName(f, live(ME), "start_cooldown", []);
				return live(f.dot);
			}
		}
		if (truthy(rt.fv(f, "melee_can_hit", rt.sv(f, "mecha")))) {
			yield* g.srcCall(f, "mecha_face_target", rt.sv(f, "target"));
			yield* g.callName(f, rt.sv(f, "target"), "mech_melee_attack", [rt.sv(f, "mecha")]);
		}
	} else {
		if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/mecha")) ? 1 : 0))) {
			if (truthy((yield* g.srcCall(f, "is_valid_mecha", (M = rt.sv(f, "target")))))) {
				yield* g.srcCall(f, "enter_mecha", live(M));
				return live(f.dot);
			} else {
				if (!truthy((yield* g.srcCall(f, "CanAttack", live(M))))) {
					rt.setSv(f, "target", null);
					return live(f.dot);
				}
			}
		}
		return (yield* g.callName(f, rt.sv(f, "target"), "attack_animal", [live(f.src)]));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/handle_automated_action  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:201)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let C: Value = null, L: Value = null, threat_count: Value = null;
	let $e: any;
	f.vars = () => [C, L, threat_count, $e];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (!truthy(rt.sv(f, "mecha"))) {
		C = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [live(f.src), rt.sv(f, "vision_range")])), T("/obj/mecha/combat"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (truthy((yield* g.srcCall(f, "is_valid_mecha", live(C))))) {
				rt.setSv(f, "target", live(C));
				rt.setSv(f, "minimum_distance", 1);
				rt.setSv(f, "ranged", 0);
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "mecha"))) return f.dot;
	L = (yield* g.srcCall(f, "PossibleThreats"));
	threat_count = rt.len(f, live(L));
	if (!truthy((yield* g.callName(f, rt.sv(f, "mecha"), "has_charge", [rt.sv(f, "mecha_charge_evacuate")])))) {
		yield* g.srcCall(f, "exit_mecha", rt.sv(f, "mecha"));
		return live(f.dot);
	}
	if (rt.lt(rt.fv(f, "obj_integrity", rt.sv(f, "mecha")), multiply(rt.fv(f, "max_integrity", rt.sv(f, "mecha")), 0.10000000149011612))) {
		yield* g.srcCall(f, "exit_mecha", rt.sv(f, "mecha"));
		return live(f.dot);
	}
	if ((rt.ge(live(threat_count), rt.sv(f, "threat_use_mecha_smoke")) && truthy(rt.op(f, "Prob", [], [rt.sv(f, "smoke_chance")])))) {
		if (((truthy(rt.fv(f, "smoke_action", rt.sv(f, "mecha"))) && truthy(rt.gv(f, "owner", rt.fv(f, "smoke_action", rt.sv(f, "mecha"))))) && truthy(rt.fv(f, "smoke", rt.sv(f, "mecha"))))) {
			yield* g.callName(f, rt.fv(f, "smoke_action", rt.sv(f, "mecha")), "Activate", []);
		}
	}
	if (!rt.lt(rt.fv(f, "obj_integrity", rt.sv(f, "mecha")), multiply(rt.fv(f, "max_integrity", rt.sv(f, "mecha")), 0.25))) return f.dot;
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "defence_mode_chance")]))) {
		if (((truthy(rt.fv(f, "defense_action", rt.sv(f, "mecha"))) && truthy(rt.gv(f, "owner", rt.fv(f, "defense_action", rt.sv(f, "mecha"))))) && !truthy(rt.fv(f, "defence_mode", rt.sv(f, "mecha"))))) {
			rt.setFv(f, "leg_overload_mode", rt.sv(f, "mecha"), 0);
			yield* g.callName(f, rt.fv(f, "defense_action", rt.sv(f, "mecha")), "Activate", [1]);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.fv(f, "defense_action", rt.sv(f, "mecha")), P("/datum/action/innate/mecha/mech_defence_mode/proc/Activate"), 0])), 100]);
		}
	} else {
		if (!truthy(rt.op(f, "Prob", [], [rt.sv(f, "retreat_chance")]))) return f.dot;
		if (((truthy(rt.fv(f, "overload_action", rt.sv(f, "mecha"))) && truthy(rt.gv(f, "owner", rt.fv(f, "overload_action", rt.sv(f, "mecha"))))) && !truthy(rt.fv(f, "leg_overload_mode", rt.sv(f, "mecha"))))) {
			yield* g.callName(f, rt.fv(f, "overload_action", rt.sv(f, "mecha")), "Activate", [1]);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.fv(f, "overload_action", rt.sv(f, "mecha")), P("/datum/action/innate/mecha/mech_defence_mode/proc/Activate"), 0])), 100]);
		}
		rt.setSv(f, "retreat_distance", 50);
		rt.spawnTail(f, 100, "/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/hostile/mecha_pilot.dm:243", C, L, threat_count);
	}
	return f.dot;
}, true, { waitfor: false });

// a spawn(100) body of /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/handle_automated_action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/hostile/mecha_pilot.dm:243", function* (f: Frame, C: Value, L: Value, threat_count: Value) {
	f.vars = () => [C, L, threat_count];
	rt.setSv(f, "retreat_distance", 0);
	return null;
});

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/death  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:250)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/death", function* death(f: Frame) {
	if (truthy(rt.sv(f, "mecha"))) {
		yield* g.callName(f, rt.sv(f, "mecha"), "aimob_exit_mech", [live(f.src)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/gib  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:255)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/gib", function* gib(f: Frame) {
	if (truthy(rt.sv(f, "mecha"))) {
		yield* g.callName(f, rt.sv(f, "mecha"), "aimob_exit_mech", [live(f.src)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/CanAttack  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:262)
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/CanAttack", function CanAttack(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/mecha")) ? 1 : 0))) {
		M = live(f.args[0]);
		if (truthy(rt.sv(f, "mecha"))) {
			if ((isEqual(live(M), rt.sv(f, "mecha")) || !truthy(rt.callSrc(f, "CanAttack", [rt.fv(f, "occupant", live(M))])))) {
				return 0;
			}
		} else {
			if (truthy(rt.callSrc(f, "is_valid_mecha", [live(M)]))) {
				return 1;
			} else {
				if ((truthy(rt.fv(f, "occupant", live(M))) && truthy(rt.callSrc(f, "CanAttack", [rt.fv(f, "occupant", live(M))])))) {
					return 1;
				} else {
					return 0;
				}
			}
		}
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["the_target"] });

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/EscapeConfinement  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:279)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/EscapeConfinement", function* EscapeConfinement(f: Frame) {
	if ((truthy(rt.sv(f, "mecha")) && isEqual(rt.sv(f, "loc"), rt.sv(f, "mecha")))) {
		return 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/Move  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:285)  may sleep
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/Move", function* Move(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if ((truthy(rt.sv(f, "mecha")) && isEqual(rt.sv(f, "loc"), rt.sv(f, "mecha")))) {
		yield* g.callName(f, rt.sv(f, "mecha"), "relaymove", [live(f.src), live(f.args[1])]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["NewLoc", "Dir", "step_x", "step_y"] });

// /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/Goto  (code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm:293)
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/Goto", function Goto(f: Frame) {
	if (truthy(rt.sv(f, "mecha"))) {
		rt.call(f, P("/proc/walk_to"), null, [rt.sv(f, "mecha"), live(f.args[0]), live(f.args[2]), live(f.args[1])]);
	} else {
		rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["target", "delay", "minimum_distance"] });
