// From code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5021, "/mob/living/simple_animal/hostile/megafauna", "/mob/living/simple_animal/hostile", {
	crusher_loot: null,
	medal_type: "Boss",
	score_type: "Bosses Killed",
	elimination: 0,
	anger_modifier: 0,
	internal: null,
	recovery_time: 0,
	light_range: 3,
	robust_searching: 1,
	ranged_ignores_vision: 1,
	stat_attack: 2,
	aggro_vision_range: 18,
	idle_vision_range: 5,
	anchored: 1,
	name: "boss of this gym",
	desc: "Attack the weak point for massive damage.",
	health: 1000,
	maxHealth: 1000,
	a_intent: "harm",
	sentience_type: 5,
	environment_smash: 3,
	obj_damage: 400,
	faction: null,
	weather_immunities: null,
	movement_type: 2,
	atmos_requirements: null,
	damage_coeff: null,
	minbodytemp: 0,
	maxbodytemp: 1e+31,
	environment_target_typecache: null,
	mob_size: 3,
	layer: 4.4,
	mouse_opacity: 2,
});

// /mob/living/simple_animal/hostile/megafauna/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm:20)
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("mining", "boss"));
	rt.setSv(f, "weather_immunities", rt.list("lava", "ash"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 1, "fire", 0.5, "tox", 1, "clone", 1, "stamina", 0, "oxy", 1]));
	$0 = $0;
	rt.setSv(f, "environment_target_typecache", rt.list(T("/obj/machinery/door/window"), T("/obj/structure/window"), T("/obj/structure/closet"), T("/obj/structure/table"), T("/obj/structure/grille"), T("/obj/structure/girder"), T("/obj/structure/rack"), T("/obj/structure/barricade"), T("/obj/machinery/field"), T("/obj/machinery/power/emitter")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm:50)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "apply_status_effect", T("/datum/status_effect/crusher_damage"));
	return f.dot;
}, true, { args: ["mapload"] });

// /mob/living/simple_animal/hostile/megafauna/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm:54)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "internal")]);
	rt.setSv(f, "internal", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/proc/death  (code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm:58)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/death", function* death(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (rt.gt(rt.sv(f, "health"), 0)) {
		return live(f.dot);
	} else {
		if ((truthy((C = (yield* g.srcCall(f, "has_status_effect", T("/datum/status_effect/crusher_damage"))))) && truthy(rt.sv(f, "crusher_loot")))) {
			if (rt.ge(rt.fv(f, "total_damage", live(C)), multiply(rt.sv(f, "maxHealth"), 0.6000000238418579))) {
				yield* g.srcCall(f, "spawn_crusher_loot");
			}
		}
		if (!truthy(rt.sv(f, "admin_spawned"))) {
			if (!truthy(rt.sv(f, "elimination"))) {
				yield* g.srcCall(f, "grant_achievement", rt.sv(f, "medal_type"), rt.sv(f, "score_type"));
			}
		}
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/simple_animal/hostile/megafauna/proc/spawn_crusher_loot  (code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm:72)
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/spawn_crusher_loot", function spawn_crusher_loot(f: Frame) {
	rt.setSv(f, "loot", rt.sv(f, "crusher_loot"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/proc/gib  (code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm:75)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/gib", function* gib(f: Frame) {
	if (rt.gt(rt.sv(f, "health"), 0)) {
		return live(f.dot);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/proc/dust  (code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm:81)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/dust", function* dust(f: Frame) {
	if (rt.gt(rt.sv(f, "health"), 0)) {
		return live(f.dot);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm:87)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (rt.ge(rt.sv(f, "recovery_time"), rt.worldTime(f))) {
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0)))) return f.dot;
	if (!isEqual(rt.gv(f, "stat", (L = rt.sv(f, "target"))), 2)) {
		if (((!truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "ranged"))) && rt.le(rt.sv(f, "ranged_cooldown"), rt.worldTime(f)))) {
			yield* g.srcCall(f, "OpenFire");
		}
	} else {
		yield* g.srcCall(f, "devour", live(L));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/proc/onShuttleMove  (code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm:99)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	let oldloc: Value = null, newloc: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [oldloc, newloc, $0, $1, $2, $3];
	oldloc = rt.sv(f, "loc");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) {
		return live(f.dot);
	}
	newloc = rt.sv(f, "loc");
	$0 = live(f.src);
	$1 = fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.src)]);
	if (truthy(live(oldloc))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(oldloc)), rt.fv(f, "y", live(oldloc)), rt.fv(f, "z", live(oldloc))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(oldloc)), rt.fv(f, "y", live(oldloc)), rt.fv(f, "z", live(oldloc))])]);
	} else {
		$2 = "nonexistent location";
	}
	$2 = fmt("＀", [$2]);
	if (truthy(live(newloc))) {
		$3 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(newloc)), rt.fv(f, "y", live(newloc)), rt.fv(f, "z", live(newloc))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(newloc)), rt.fv(f, "y", live(newloc)), rt.fv(f, "z", live(newloc))])]);
	} else {
		$3 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("Megafauna ＀ ＀ moved via shuttle from ＀ to ＀", [$0, $1, $2, fmt("＀", [$3])])]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/proc/devour  (code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm:107)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/devour", function* devour(f: Frame, L: Value) {
	f.vars = () => [L];
	if (!truthy(live(L))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ devours ＀!</span>", [live(f.src), live(L)]), fmt("<span class='userdanger'>You feast on ＀, restoring your health!</span>", [live(L)]));
	if ((!isEqual(rt.sv(f, "z"), 2) && !truthy(rt.sv(f, "client")))) {
		yield* g.srcCall(f, "adjustBruteLoss", divide(rt.neg(rt.fv(f, "maxHealth", live(L))), 2));
	}
	yield* g.callName(f, live(L), "gib", []);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// /mob/living/simple_animal/hostile/megafauna/proc/ex_act  (code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm:117)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let $0: any;
	f.vars = () => [severity, target, $0];
	$0 = live(severity);
	if ($0 === 1) {
		yield* g.srcCall(f, "adjustBruteLoss", 250);
	} else if ($0 === 2) {
		yield* g.srcCall(f, "adjustBruteLoss", 100);
	} else if ($0 === 3) {
		yield* g.srcCall(f, "adjustBruteLoss", 50);
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/megafauna/proc/SetRecoveryTime  (code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm:128)
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/SetRecoveryTime", function SetRecoveryTime(f: Frame, buffer_time: Value) {
	rt.setSv(f, "recovery_time", add(rt.worldTime(f), live(buffer_time)));
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/proc/grant_achievement  (code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm:131)
// The medals and scores it used to award are gone; the return value (1 = counts as a kill) stays: bubblegum's shuttle unlock needs it.
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/grant_achievement", function grant_achievement(f: Frame, medaltype: Value, scoretype: Value) {
	if (isEqual(rt.sv(f, "medal_type"), "Boss")) {
		return 0;
	}
	if (truthy(rt.sv(f, "admin_spawned"))) {
		return 0;
	}
	return 1;
});
