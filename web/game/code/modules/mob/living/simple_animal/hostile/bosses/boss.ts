// From code/modules/mob/living/simple_animal/hostile/bosses/boss.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5018, "/mob/living/simple_animal/hostile/boss", "/mob/living/simple_animal/hostile", {
	boss_abilities: null,
	atb: null,
	point_regen_delay: 1,
	robust_searching: 1,
	stat_attack: 1,
	name: "A Perfectly Generic Boss Placeholder",
	desc: "",
	status_flags: 0,
	a_intent: "harm",
	gender: "neuter",
});

// /mob/living/simple_animal/hostile/boss/proc/<init>  (code/modules/mob/living/simple_animal/hostile/bosses/boss.dm:9)
rt.def("/mob/living/simple_animal/hostile/boss/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "boss_abilities", rt.list());
	return f.dot;
});

// /mob/living/simple_animal/hostile/boss/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/bosses/boss.dm:15)  may sleep
rt.def("/mob/living/simple_animal/hostile/boss/proc/Initialize", function* Initialize(f: Frame) {
	let ab: Value = null, AB: Value = null;
	let $e: any;
	f.vars = () => [ab, AB, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "atb", (yield* g.new_(f, T("/datum/boss_active_timed_battle"), [])));
	rt.setFv(f, "point_regen_delay", rt.sv(f, "atb"), rt.sv(f, "point_regen_delay"));
	rt.setFv(f, "boss", rt.sv(f, "atb"), live(f.src));
	ab = null;
	rt.forList(f, 0, rt.sv(f, "boss_abilities"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ab = $e;
		(rt.modSrcVar(f, "boss_abilities", live(ab), subtract));
		rt.setFv(f, "boss", (AB = (yield* g.new_(f, live(ab), []))), live(f.src));
		yield* g.callName(f, live(AB), "Grant", [live(f.src)]);
		rt.modSrcVar(f, "boss_abilities", live(AB), add);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "atb"), "assign_abilities", [rt.sv(f, "boss_abilities")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/boss/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/bosses/boss.dm:32)  may sleep
rt.def("/mob/living/simple_animal/hostile/boss/proc/Destroy", function* Destroy(f: Frame) {
	let ab: Value = null, AB: Value = null;
	let $e: any;
	f.vars = () => [ab, AB, $e];
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "atb")]);
	rt.setSv(f, "atb", null);
	ab = null;
	rt.forList(f, 0, rt.sv(f, "boss_abilities"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ab = $e;
		rt.setFv(f, "boss", (AB = live(ab)), null);
		yield* g.callName(f, live(AB), "Remove", [live(f.src)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(AB)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "boss_abilities"), "Cut", []);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(267, "/datum/action/boss", "/datum/action", {
	boss_cost: 100,
	usage_probability: 100,
	boss: null,
	needs_target: 1,
	say_when_triggered: "",
	boss_type: rt.typePath("/mob/living/simple_animal/hostile/boss"),
	check_flags: 8,
});

// /datum/action/boss/proc/Trigger  (code/modules/mob/living/simple_animal/hostile/bosses/boss.dm:55)  may sleep
rt.def("/datum/action/boss/proc/Trigger", function* Trigger(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (!truthy(rt.op(f, "IsType", [], [rt.sv(f, "boss"), rt.sv(f, "boss_type")]))) {
		return 0;
	}
	if (!truthy(rt.fv(f, "atb", rt.sv(f, "boss")))) {
		return 0;
	}
	if (rt.lt(rt.gv(f, "points", rt.fv(f, "atb", rt.sv(f, "boss"))), rt.sv(f, "boss_cost"))) {
		return 0;
	}
	if (!truthy(rt.fv(f, "client", rt.sv(f, "boss")))) {
		if ((truthy(rt.sv(f, "needs_target")) && !truthy(rt.fv(f, "target", rt.sv(f, "boss"))))) {
			return 0;
		}
	}
	if (!truthy(rt.sv(f, "boss"))) return f.dot;
	if (truthy(rt.sv(f, "say_when_triggered"))) {
		yield* g.callName(f, rt.sv(f, "boss"), "say", [rt.sv(f, "say_when_triggered")]);
	}
	if (truthy((yield* g.callName(f, rt.fv(f, "atb", rt.sv(f, "boss")), "spend", [rt.sv(f, "boss_cost")])))) return f.dot;
	return 0;
}, true);

rt.type(4155, "/datum/boss_active_timed_battle", "/datum", {
	abilities: null,
	point_regen_delay: 5,
	points: 50,
	next_point_time: 0,
	chance_to_hold_onto_points: 50,
	highest_cost: 0,
	boss: null,
});

// /datum/boss_active_timed_battle/proc/New  (code/modules/mob/living/simple_animal/hostile/bosses/boss.dm:92)
rt.def("/datum/boss_active_timed_battle/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
});

// /datum/boss_active_timed_battle/proc/assign_abilities  (code/modules/mob/living/simple_animal/hostile/bosses/boss.dm:97)
rt.def("/datum/boss_active_timed_battle/proc/assign_abilities", function assign_abilities(f: Frame, L: Value) {
	let ab: Value = null, AB: Value = null;
	let $e: any;
	f.vars = () => [ab, AB, $e];
	if (!truthy(live(L))) {
		return 0;
	}
	rt.setSv(f, "abilities", live(L));
	ab = null;
	rt.forList(f, 0, rt.sv(f, "abilities"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ab = $e;
		if (rt.gt(rt.gv(f, "boss_cost", (AB = live(ab))), rt.sv(f, "highest_cost"))) {
			rt.setSv(f, "highest_cost", rt.fv(f, "boss_cost", live(AB)));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/boss_active_timed_battle/proc/spend  (code/modules/mob/living/simple_animal/hostile/bosses/boss.dm:107)
rt.def("/datum/boss_active_timed_battle/proc/spend", function spend(f: Frame, cost: Value) {
	if (rt.le(live(cost), rt.sv(f, "points"))) {
		rt.setSv(f, "points", rt.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "points"), live(cost))]));
		return 1;
	}
	return 0;
});

// /datum/boss_active_timed_battle/proc/refund  (code/modules/mob/living/simple_animal/hostile/bosses/boss.dm:114)
rt.def("/datum/boss_active_timed_battle/proc/refund", function refund(f: Frame, cost: Value) {
	rt.setSv(f, "points", rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "points"), live(cost)), 100]));
	return f.dot;
});

// /datum/boss_active_timed_battle/proc/process  (code/modules/mob/living/simple_animal/hostile/bosses/boss.dm:118)  may sleep
rt.def("/datum/boss_active_timed_battle/proc/process", function* process(f: Frame) {
	let ab: Value = null, AB: Value = null;
	let $e: any;
	f.vars = () => [ab, AB, $e];
	if (rt.ge(rt.worldTime(f), rt.sv(f, "next_point_time"))) {
		rt.setSv(f, "next_point_time", add(rt.worldTime(f), rt.sv(f, "point_regen_delay")));
		rt.setSv(f, "points", (yield* g.call(f, P("/proc/min"), null, [100, rt.incSrcVar(f, "points", 1, false)])));
	}
	if (!truthy(rt.sv(f, "abilities"))) return f.dot;
	rt.setSv(f, "chance_to_hold_onto_points", multiply(rt.sv(f, "highest_cost"), 0.5));
	if ((!isEqual(rt.sv(f, "points"), 100) && truthy(rt.op(f, "Prob", [], [rt.sv(f, "chance_to_hold_onto_points")])))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "client", rt.sv(f, "boss")))) return f.dot;
	rt.setSv(f, "abilities", (yield* g.call(f, P("/proc/shuffle"), null, [rt.sv(f, "abilities")])));
	ab = null;
	rt.forList(f, 0, rt.sv(f, "abilities"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ab = $e;
		if ((truthy(rt.op(f, "Prob", [], [rt.gv(f, "usage_probability", (AB = live(ab)))])) && truthy((yield* g.callName(f, live(AB), "Trigger", []))))) {
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /datum/boss_active_timed_battle/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/bosses/boss.dm:136)  may sleep
rt.def("/datum/boss_active_timed_battle/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "abilities", null);
	yield* g.callName(f, rt.fv(f, "processing", rt.gl("SSobj")), "Remove", [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
