// From code/modules/mob/living/simple_animal/hostile/mimic.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4967, "/mob/living/simple_animal/hostile/mimic", "/mob/living/simple_animal/hostile", {
	emote_taunt: null,
	taunt_chance: 30,
	move_to_delay: 9,
	name: "crate",
	desc: "A rectangular steel crate.",
	icon: rt.rsc("icons/obj/crates.dmi"),
	icon_state: "crate",
	icon_living: "crate",
	response_help: "touches",
	response_disarm: "pushes",
	response_harm: "hits",
	speed: 0,
	maxHealth: 250,
	health: 250,
	gender: "neuter",
	harm_intent_damage: 5,
	melee_damage_lower: 8,
	melee_damage_upper: 12,
	attacktext: "attacks",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	speak_emote: null,
	atmos_requirements: null,
	minbodytemp: 0,
	faction: null,
	gold_core_spawnable: 1,
	del_on_death: 1,
});

// /mob/living/simple_animal/hostile/mimic/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mimic.dm:21)
rt.def("/mob/living/simple_animal/hostile/mimic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emote_taunt", rt.list("growls"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("creaks"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("mimic"));
	return f.dot;
});

rt.type(4968, "/mob/living/simple_animal/hostile/mimic/crate", "/mob/living/simple_animal/hostile/mimic", {
	attempt_open: 0,
	attacktext: "bites",
	speak_emote: null,
	stop_automated_movement: 1,
	wander: 0,
});

// /mob/living/simple_animal/hostile/mimic/crate/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mimic.dm:36)
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("clatters"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/mimic/crate/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mimic.dm:43)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) return f.dot;
	I = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.setFv(f, "loc", live(I), live(f.src));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["mapload"] });

// /mob/living/simple_animal/hostile/mimic/crate/proc/DestroySurroundings  (code/modules/mob/living/simple_animal/hostile/mimic.dm:49)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/DestroySurroundings", function* DestroySurroundings(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [90]))) {
		rt.setSv(f, "icon_state", fmt("＀open", [rt.initial(f, live(f.src), "icon_state")]));
	} else {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/mimic/crate/proc/ListTargets  (code/modules/mob/living/simple_animal/hostile/mimic.dm:57)
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/ListTargets", function ListTargets(f: Frame) {
	if (truthy(rt.sv(f, "attempt_open"))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return rt.callSuper(f, [1]);
});

// /mob/living/simple_animal/hostile/mimic/crate/proc/FindTarget  (code/modules/mob/living/simple_animal/hostile/mimic.dm:61)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/FindTarget", function* FindTarget(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "trigger");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/mimic/crate/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/mimic.dm:66)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	if (!(truthy(rt.op(f, "Prob", [], [15])) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (C = rt.sv(f, "target")), "Knockdown", [40]);
	yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＄！ knocks down ％！!</span>", [live(f.src), live(C)]), fmt("<span class='userdanger'>＄！ knocks you down!</span>", [live(f.src)])]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/mimic/crate/proc/trigger  (code/modules/mob/living/simple_animal/hostile/mimic.dm:76)
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/trigger", function trigger(f: Frame) {
	if (truthy(rt.sv(f, "attempt_open"))) return f.dot;
	rt.callSrc(f, "visible_message", [fmt("<b>＀</b> starts to move!", [live(f.src)])]);
	rt.setSv(f, "attempt_open", 1);
	return f.dot;
});

// /mob/living/simple_animal/hostile/mimic/crate/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/mimic.dm:81)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	yield* g.srcCall(f, "trigger");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/mimic/crate/proc/LoseTarget  (code/modules/mob/living/simple_animal/hostile/mimic.dm:85)
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/LoseTarget", function LoseTarget(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/mimic/crate/proc/death  (code/modules/mob/living/simple_animal/hostile/mimic.dm:89)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/death", function* death(f: Frame) {
	let C: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [C, O, $e];
	C = (yield* g.new_(f, T("/obj/structure/closet/crate"), [rt.getStep(f, live(f.src), 0)]));
	O = null;
	rt.forList(f, 0, live(f.src), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setFv(f, "loc", live(O), live(C));
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/controller/global_vars/proc/InitGlobalprotected_objects  (code/modules/mob/living/simple_animal/hostile/mimic.dm:95)
rt.def("/datum/controller/global_vars/proc/InitGlobalprotected_objects", function InitGlobalprotected_objects(f: Frame) {
	rt.setGl("protected_objects", rt.list(T("/obj/structure/table"), T("/obj/structure/cable"), T("/obj/structure/window")));
	rt.modSrcVar(f, "gvars_datum_init_order", "protected_objects", add);
	return f.dot;
});

rt.type(4969, "/mob/living/simple_animal/hostile/mimic/copy", "/mob/living/simple_animal/hostile/mimic", {
	creator: null,
	destroy_objects: 0,
	knockdown_people: 0,
	health: 100,
	maxHealth: 100,
	gold_core_spawnable: 0,
}, { global: { googly_eyes: 720 } });

// /mob/living/simple_animal/hostile/mimic/copy/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mimic.dm:107)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "CopyObject", live(f.args[1]), live(f.args[2]), live(f.args[3]));
	return f.dot;
}, true, { args: ["mapload", "copy", "creator", "destroy_original"] });

// /mob/living/simple_animal/hostile/mimic/copy/proc/Life  (code/modules/mob/living/simple_animal/hostile/mimic.dm:111)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/Life", function* Life(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((!truthy(rt.sv(f, "target")) && !truthy(rt.sv(f, "ckey")))) {
		yield* g.srcCall(f, "adjustBruteLoss", 1);
	}
	M = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.srcCall(f, "death");
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/mimic/copy/proc/death  (code/modules/mob/living/simple_animal/hostile/mimic.dm:118)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/death", function* death(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.setFv(f, "loc", live(M), rt.getStep(f, live(f.src), 0));
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/mimic/copy/proc/ListTargets  (code/modules/mob/living/simple_animal/hostile/mimic.dm:123)
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/ListTargets", function ListTargets(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return subtract(live(f.dot), rt.sv(f, "creator"));
});

// /mob/living/simple_animal/hostile/mimic/copy/proc/ChangeOwner  (code/modules/mob/living/simple_animal/hostile/mimic.dm:127)
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/ChangeOwner", function ChangeOwner(f: Frame, owner: Value) {
	if (isEqual(live(owner), rt.sv(f, "creator"))) return f.dot;
	rt.callSrc(f, "LoseTarget", []);
	rt.setSv(f, "creator", live(owner));
	(rt.modSrcVar(f, "faction", fmt("＃", [live(owner)]), rt.bitOr));
	return f.dot;
});

// /mob/living/simple_animal/hostile/mimic/copy/proc/CheckObject  (code/modules/mob/living/simple_animal/hostile/mimic.dm:133)
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/CheckObject", function CheckObject(f: Frame, O: Value) {
	if (((truthy((rt.istype(live(O), T("/obj/item")) ? 1 : 0)) || truthy((rt.istype(live(O), T("/obj/structure")) ? 1 : 0))) && !truthy(rt.call(f, P("/proc/is_type_in_list"), null, [live(O), rt.gl("protected_objects")])))) {
		return 1;
	}
	return 0;
});

// /mob/living/simple_animal/hostile/mimic/copy/proc/CopyObject  (code/modules/mob/living/simple_animal/hostile/mimic.dm:138)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/CopyObject", function* CopyObject(f: Frame, O: Value, user: Value, destroy_original: Value) {
	let I: Value = null;
	f.vars = () => [O, user, destroy_original, I];
	if (live(destroy_original) === null) {
		destroy_original = 0;
	}
	if (!(truthy(live(destroy_original)) || truthy((yield* g.srcCall(f, "CheckObject", live(O)))))) return f.dot;
	rt.setFv(f, "loc", live(O), live(f.src));
	rt.setSv(f, "name", rt.fv(f, "name", live(O)));
	rt.setSv(f, "desc", rt.fv(f, "desc", live(O)));
	rt.setSv(f, "icon", rt.fv(f, "icon", live(O)));
	rt.setSv(f, "icon_state", rt.fv(f, "icon_state", live(O)));
	rt.setSv(f, "icon_living", rt.sv(f, "icon_state"));
	yield* g.srcCall(f, "copy_overlays", live(O));
	yield* g.srcCall(f, "add_overlay", rt.gl("googly_eyes"));
	if ((truthy((rt.istype(live(O), T("/obj/structure")) ? 1 : 0)) || truthy((rt.istype(live(O), T("/obj/machinery")) ? 1 : 0)))) {
		rt.setSv(f, "health", add(multiply(rt.sv(f, "anchored"), 50), 50));
		rt.setSv(f, "destroy_objects", 1);
		if ((truthy(rt.fv(f, "density", live(O))) && truthy(rt.fv(f, "anchored", live(O))))) {
			rt.setSv(f, "knockdown_people", 1);
			(rt.modSrcVar(f, "melee_damage_lower", 2, multiply));
			(rt.modSrcVar(f, "melee_damage_upper", 2, multiply));
		}
	} else {
		if (truthy((rt.istype(live(O), T("/obj/item")) ? 1 : 0))) {
			I = live(O);
			rt.setSv(f, "health", multiply(15, rt.fv(f, "w_class", live(I))));
			rt.setSv(f, "melee_damage_lower", add(2, rt.fv(f, "force", live(I))));
			rt.setSv(f, "melee_damage_upper", add(2, rt.fv(f, "force", live(I))));
			rt.setSv(f, "move_to_delay", add(multiply(2, rt.fv(f, "w_class", live(I))), 1));
		}
	}
	rt.setSv(f, "maxHealth", rt.sv(f, "health"));
	if (truthy(live(user))) {
		rt.setSv(f, "creator", live(user));
		rt.modSrcVar(f, "faction", fmt("＃", [rt.sv(f, "creator")]), add);
	}
	if (truthy(live(destroy_original))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
	}
	return 1;
}, true);

// /mob/living/simple_animal/hostile/mimic/copy/proc/DestroySurroundings  (code/modules/mob/living/simple_animal/hostile/mimic.dm:170)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/DestroySurroundings", function* DestroySurroundings(f: Frame) {
	if (!truthy(rt.sv(f, "destroy_objects"))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/mimic/copy/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/mimic.dm:173)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(((truthy(rt.sv(f, "knockdown_people")) && truthy(live(f.dot))) && truthy(rt.op(f, "Prob", [], [15]))) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (C = rt.sv(f, "target")), "Knockdown", [40]);
	yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＄！ knocks down ％！!</span>", [live(f.src), live(C)]), fmt("<span class='userdanger'>＄！ knocks you down!</span>", [live(f.src)])]);
	return f.dot;
}, true);

rt.type(4970, "/mob/living/simple_animal/hostile/mimic/copy/machine", "/mob/living/simple_animal/hostile/mimic/copy", {
	speak: null,
	speak_chance: 7,
});

// /mob/living/simple_animal/hostile/mimic/copy/machine/proc/CanAttack  (code/modules/mob/living/simple_animal/hostile/mimic.dm:186)
rt.def("/mob/living/simple_animal/hostile/mimic/copy/machine/proc/CanAttack", function CanAttack(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (isEqual(live(f.args[0]), rt.sv(f, "creator"))) {
		return 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "connected_ai", (R = live(f.args[0]))), rt.sv(f, "creator"))) {
			return 0;
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["the_target"] });

rt.type(4971, "/mob/living/simple_animal/hostile/mimic/copy/ranged", "/mob/living/simple_animal/hostile/mimic/copy", {
	TrueGun: null,
	Zapstick: null,
	Pewgun: null,
	Zapgun: null,
});

// /mob/living/simple_animal/hostile/mimic/copy/ranged/proc/CopyObject  (code/modules/mob/living/simple_animal/hostile/mimic.dm:203)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/copy/ranged/proc/CopyObject", function* CopyObject(f: Frame) {
	let G: Value = null, M: Value = null, selectfiresetting: Value = null, E: Value = null;
	f.vars = () => [G, M, selectfiresetting, E];
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	rt.setSv(f, "emote_see", rt.list("aims menacingly"));
	rt.setSv(f, "obj_damage", 0);
	rt.setSv(f, "environment_smash", 0);
	rt.setSv(f, "ranged", 1);
	rt.setSv(f, "retreat_distance", 1);
	rt.setSv(f, "minimum_distance", 6);
	rt.setSv(f, "melee_damage_upper", rt.gv(f, "force", (G = live(f.args[0]))));
	rt.setSv(f, "melee_damage_lower", subtract(rt.fv(f, "force", live(G)), (yield* g.call(f, P("/proc/max"), null, [0, divide(rt.fv(f, "force", live(G)), 2)]))));
	rt.setSv(f, "move_to_delay", add(multiply(2, rt.fv(f, "w_class", live(G))), 1));
	rt.setSv(f, "projectilesound", rt.fv(f, "fire_sound", live(G)));
	rt.setSv(f, "TrueGun", live(G));
	if (truthy((rt.istype(live(G), T("/obj/item/weapon/gun/magic")) ? 1 : 0))) {
		rt.setSv(f, "Zapstick", live(G));
		rt.setSv(f, "projectiletype", rt.initial(f, (M = rt.fv(f, "ammo_type", rt.sv(f, "Zapstick"))), "projectile_type"));
	}
	if (truthy((rt.istype(live(G), T("/obj/item/weapon/gun/ballistic")) ? 1 : 0))) {
		rt.setSv(f, "Pewgun", live(G));
		rt.setSv(f, "casingtype", rt.initial(f, (M = rt.fv(f, "mag_type", rt.sv(f, "Pewgun"))), "ammo_type"));
	}
	if (!truthy((rt.istype(live(G), T("/obj/item/weapon/gun/energy")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "Zapgun", live(G));
	selectfiresetting = rt.fv(f, "select", rt.sv(f, "Zapgun"));
	rt.setSv(f, "projectiletype", rt.initial(f, (E = rt.index(rt.fv(f, "ammo_type", rt.sv(f, "Zapgun")), live(selectfiresetting))), "projectile_type"));
	return f.dot;
}, true, { args: ["O", "creator", "destroy_original"] });

// /mob/living/simple_animal/hostile/mimic/copy/ranged/proc/OpenFire  (code/modules/mob/living/simple_animal/hostile/mimic.dm:232)  may sleep
rt.def("/mob/living/simple_animal/hostile/mimic/copy/ranged/proc/OpenFire", function* OpenFire(f: Frame) {
	let shot: Value = null;
	f.vars = () => [shot];
	if (truthy(rt.sv(f, "Zapgun"))) {
		if (truthy(rt.fv(f, "cell", rt.sv(f, "Zapgun")))) {
			shot = rt.index(rt.fv(f, "ammo_type", rt.sv(f, "Zapgun")), rt.fv(f, "select", rt.sv(f, "Zapgun")));
			if (rt.ge(rt.gv(f, "charge", rt.fv(f, "cell", rt.sv(f, "Zapgun"))), rt.fv(f, "e_cost", live(shot)))) {
				yield* g.callName(f, rt.fv(f, "cell", rt.sv(f, "Zapgun")), "use", [rt.fv(f, "e_cost", live(shot))]);
				yield* g.callName(f, rt.sv(f, "Zapgun"), "update_icon", []);
				yield* g.callSuper(f, [], rt.Args.Same);
			}
		}
	} else {
		if (truthy(rt.sv(f, "Zapstick"))) {
			if (truthy(rt.fv(f, "charges", rt.sv(f, "Zapstick")))) {
				rt.incField(f, rt.sv(f, "Zapstick"), "charges", -1, true);
				yield* g.callName(f, rt.sv(f, "Zapstick"), "update_icon", []);
				yield* g.callSuper(f, [], rt.Args.Same);
			}
		} else {
			if (truthy(rt.sv(f, "Pewgun"))) {
				if (truthy(rt.fv(f, "chambered", rt.sv(f, "Pewgun")))) {
					if (truthy(rt.gv(f, "BB", rt.fv(f, "chambered", rt.sv(f, "Pewgun"))))) {
						yield* g.call(f, P("/proc/qdel"), null, [rt.gv(f, "BB", rt.fv(f, "chambered", rt.sv(f, "Pewgun")))]);
						rt.setFv(f, "BB", rt.fv(f, "chambered", rt.sv(f, "Pewgun")), null);
						yield* g.callName(f, rt.fv(f, "chambered", rt.sv(f, "Pewgun")), "update_icon", []);
						yield* g.callSuper(f, [], rt.Args.Same);
					} else {
						yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The <b>＀</b> clears a jam!</span>", [live(f.src)]));
					}
					rt.setFv(f, "loc", rt.fv(f, "chambered", rt.sv(f, "Pewgun")), rt.sv(f, "loc"));
					rt.setFv(f, "chambered", rt.sv(f, "Pewgun"), null);
					if ((truthy(rt.fv(f, "magazine", rt.sv(f, "Pewgun"))) && truthy(rt.getLen(f, rt.gv(f, "stored_ammo", rt.fv(f, "magazine", rt.sv(f, "Pewgun"))))))) {
						rt.setFv(f, "chambered", rt.sv(f, "Pewgun"), (yield* g.callName(f, rt.fv(f, "magazine", rt.sv(f, "Pewgun")), "get_round", [0])));
						rt.setFv(f, "loc", rt.fv(f, "chambered", rt.sv(f, "Pewgun")), rt.sv(f, "Pewgun"));
					}
					yield* g.callName(f, rt.sv(f, "Pewgun"), "update_icon", []);
				} else {
					if ((truthy(rt.fv(f, "magazine", rt.sv(f, "Pewgun"))) && truthy(rt.getLen(f, rt.gv(f, "stored_ammo", rt.fv(f, "magazine", rt.sv(f, "Pewgun"))))))) {
						rt.setFv(f, "chambered", rt.sv(f, "Pewgun"), (yield* g.callName(f, rt.fv(f, "magazine", rt.sv(f, "Pewgun")), "get_round", [0])));
						rt.setFv(f, "loc", rt.fv(f, "chambered", rt.sv(f, "Pewgun")), rt.sv(f, "Pewgun"));
						yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The <b>＀</b> cocks itself!</span>", [live(f.src)]));
					}
				}
			} else {
				rt.setSv(f, "ranged", 0);
				rt.setSv(f, "retreat_distance", 0);
				rt.setSv(f, "minimum_distance", 1);
				return live(f.dot);
			}
		}
	}
	rt.setSv(f, "icon_state", rt.fv(f, "icon_state", rt.sv(f, "TrueGun")));
	rt.setSv(f, "icon_living", rt.fv(f, "icon_state", rt.sv(f, "TrueGun")));
	return f.dot;
}, true, { args: ["the_target"] });
