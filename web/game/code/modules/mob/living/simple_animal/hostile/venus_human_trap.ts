// From code/modules/mob/living/simple_animal/hostile/venus_human_trap.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12715, "/obj/structure/alien/resin/flower_bud_enemy", "/obj/structure/alien/resin", {
	growth_time: 1200,
	canSmoothWith: null,
	smooth: 0,
	name: "flower bud",
	desc: "A large pulsating plant...",
	icon: rt.rsc("icons/effects/spacevines.dmi"),
	icon_state: "flower_bud",
	layer: 4.9,
	opacity: 0,
});

// /obj/structure/alien/resin/flower_bud_enemy/proc/<init>  (code/modules/mob/living/simple_animal/hostile/venus_human_trap.dm:10)
rt.def("/obj/structure/alien/resin/flower_bud_enemy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list());
	return f.dot;
});

// /obj/structure/alien/resin/flower_bud_enemy/proc/New  (code/modules/mob/living/simple_animal/hostile/venus_human_trap.dm:16)  may sleep
rt.def("/obj/structure/alien/resin/flower_bud_enemy/proc/New", function* New(f: Frame) {
	let anchors: Value = null, _T: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [anchors, _T, B, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	anchors = rt.list();
	anchors = rt.modify(live(anchors), rt.locate(subtract(rt.sv(f, "x"), 2), add(rt.sv(f, "y"), 2), rt.sv(f, "z")), add);
	anchors = rt.modify(live(anchors), rt.locate(add(rt.sv(f, "x"), 2), add(rt.sv(f, "y"), 2), rt.sv(f, "z")), add);
	anchors = rt.modify(live(anchors), rt.locate(subtract(rt.sv(f, "x"), 2), subtract(rt.sv(f, "y"), 2), rt.sv(f, "z")), add);
	anchors = rt.modify(live(anchors), rt.locate(add(rt.sv(f, "x"), 2), subtract(rt.sv(f, "y"), 2), rt.sv(f, "z")), add);
	_T = null;
	rt.forList(f, 0, live(anchors), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.setFv(f, "sleep_time", (B = (yield* g.callSrc(f, "Beam", [null, live(_T), null, "vine", "time", 9.999999848243207e+30, "maxdistance", 5, "beam_type", T("/obj/effect/ebeam/vine")], rt.Args.Named))), 10);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/alien/resin/flower_bud_enemy/proc/bear_fruit")])), rt.sv(f, "growth_time")]);
	return f.dot;
}, true);

// /obj/structure/alien/resin/flower_bud_enemy/proc/bear_fruit  (code/modules/mob/living/simple_animal/hostile/venus_human_trap.dm:29)  may sleep
rt.def("/obj/structure/alien/resin/flower_bud_enemy/proc/bear_fruit", function* bear_fruit(f: Frame) {
	yield* g.srcCall(f, "visible_message", "<span class='danger'>the plant has borne fruit!</span>");
	yield* g.new_(f, T("/mob/living/simple_animal/hostile/venus_human_trap"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(11219, "/obj/effect/ebeam/vine", "/obj/effect/ebeam", {
	name: "thick vine",
	mouse_opacity: 1,
	desc: "A thick vine, painful to the touch.",
});

// /obj/effect/ebeam/vine/proc/Crossed  (code/modules/mob/living/simple_animal/hostile/venus_human_trap.dm:41)  may sleep
rt.def("/obj/effect/ebeam/vine/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let L: Value = null;
	f.vars = () => [AM, L];
	if (!truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) return f.dot;
	L = live(AM);
	if (truthy((rt.isIn(f, "vines", rt.fv(f, "faction", live(L))) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(L), "adjustBruteLoss", [5]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='alert'>You cut yourself on the thorny vines.</span>"]);
	return f.dot;
}, true);

rt.type(4996, "/mob/living/simple_animal/hostile/venus_human_trap", "/mob/living/simple_animal/hostile", {
	grasping: null,
	max_grasps: 4,
	grasp_chance: 20,
	grasp_pull_chance: 85,
	grasp_range: 4,
	ranged: 1,
	name: "venus human trap",
	desc: "Now you know how the fly feels.",
	icon_state: "venus_human_trap",
	layer: 4.9,
	health: 50,
	maxHealth: 50,
	harm_intent_damage: 5,
	obj_damage: 60,
	melee_damage_lower: 25,
	melee_damage_upper: 25,
	a_intent: "harm",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	atmos_requirements: null,
	unsuitable_atmos_damage: 0,
	faction: null,
	del_on_death: 1,
});

// /mob/living/simple_animal/hostile/venus_human_trap/proc/<init>  (code/modules/mob/living/simple_animal/hostile/venus_human_trap.dm:66)
rt.def("/mob/living/simple_animal/hostile/venus_human_trap/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "grasping", rt.list());
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	rt.setSv(f, "faction", rt.list("hostile", "vines", "plants"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/venus_human_trap/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/venus_human_trap.dm:74)  may sleep
rt.def("/mob/living/simple_animal/hostile/venus_human_trap/proc/Destroy", function* Destroy(f: Frame) {
	let L: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [L, B, $e];
	L = null;
	rt.forList(f, 0, rt.sv(f, "grasping"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((B = rt.index(rt.sv(f, "grasping"), live(L))))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(B)]);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "grasping", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/venus_human_trap/proc/handle_automated_action  (code/modules/mob/living/simple_animal/hostile/venus_human_trap.dm:82)  may sleep
rt.def("/mob/living/simple_animal/hostile/venus_human_trap/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let L: Value = null, B: Value = null, t: Value = null, a: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [L, B, t, a, A, $e];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	L = null;
	rt.forList(f, 0, rt.sv(f, "grasping"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (isEqual(rt.fv(f, "stat", live(L)), 2)) {
			if (truthy((B = rt.index(rt.sv(f, "grasping"), live(L))))) {
				yield* g.callName(f, live(B), "End", []);
			}
			(rt.modSrcVar(f, "grasping", live(L), subtract));
		}
		if (truthy((yield* g.callName(f, live(L), "Adjacent", [live(f.src)])))) {
			yield* g.callName(f, live(L), "attack_animal", [live(f.src)]);
		} else {
			if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "grasp_pull_chance")]))) {
				yield* g.srcCall(f, "setDir", rt.getDir(f, live(f.src), live(L)));
				yield* g.call(f, P("/proc/step"), null, [live(L), rt.getDir(f, live(L), live(f.src))]);
				yield* g.callName(f, live(L), "Knockdown", [60]);
			}
		}
	}
	rt.endFor(f, 0);
	if (!rt.lt(rt.len(f, rt.sv(f, "grasping")), rt.sv(f, "max_grasps"))) return f.dot;
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [rt.sv(f, "grasp_range"), live(f.src)])), T("/mob/living"));
	loop52: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		L = $e;
		if ((((isEqual(live(L), live(f.src)) || truthy((yield* g.srcCall(f, "faction_check_mob", live(L))))) || truthy((rt.isIn(f, live(L), rt.sv(f, "grasping")) ? 1 : 0))) || isEqual(live(L), rt.sv(f, "target")))) {
			continue;
		}
		t = null;
		rt.forList(f, 1, (yield* g.call(f, P("/proc/getline"), null, [live(f.src), live(L)])));
		while (($e = rt.next(f, 1)) !== undefined) {
			t = $e;
			a = null;
			rt.forList(f, 2, live(t));
			while (($e = rt.next(f, 2)) !== undefined) {
				a = $e;
				if ((truthy(rt.gv(f, "density", (A = live(a)))) && !isEqual(live(A), live(L)))) {
					continue loop52;
				}
			}
			rt.endFor(f, 2);
		}
		rt.endFor(f, 1);
		if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "grasp_chance")]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='userdanger'>＄！ has you entangled!</span>", [live(f.src)])]);
			rt.setAt(rt.sv(f, "grasping"), live(L), (yield* g.callSrc(f, "Beam", [null, live(L), null, "vine", "time", 9.999999848243207e+30, "maxdistance", 5, "beam_type", T("/obj/effect/ebeam/vine")], rt.Args.Named)));
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/venus_human_trap/proc/OpenFire  (code/modules/mob/living/simple_animal/hostile/venus_human_trap.dm:117)  may sleep
rt.def("/mob/living/simple_animal/hostile/venus_human_trap/proc/OpenFire", function* OpenFire(f: Frame, the_target: Value) {
	let dist: Value = null;
	f.vars = () => [the_target, dist];
	dist = (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(the_target)]));
	yield* g.callSrc(f, "Beam", [null, live(the_target), null, "vine", "time", multiply(live(dist), 2), "maxdistance", add(live(dist), 2), "beam_type", T("/obj/effect/ebeam/vine")], rt.Args.Named);
	yield* g.callName(f, live(the_target), "attack_animal", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/venus_human_trap/proc/CanAttack  (code/modules/mob/living/simple_animal/hostile/venus_human_trap.dm:123)
rt.def("/mob/living/simple_animal/hostile/venus_human_trap/proc/CanAttack", function CanAttack(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) return f.dot;
	if (!truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "grasping")) ? 1 : 0))) return f.dot;
	return 0;
}, false, { args: ["the_target"] });
