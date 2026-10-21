// From code/game/objects/effects/effect_system/effects_other.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1516, "/datum/effect_system/trail_follow", "/datum/effect_system", {
	oldposition: null,
	processing: 1,
	on: 1,
});

// /datum/effect_system/trail_follow/proc/set_up  (code/game/objects/effects/effect_system/effects_other.dm:15)
rt.def("/datum/effect_system/trail_follow/proc/set_up", function set_up(f: Frame, atom: Value) {
	rt.callSrc(f, "attach", [live(atom)]);
	rt.setSv(f, "oldposition", rt.getStep(f, live(atom), 0));
	return f.dot;
});

// /datum/effect_system/trail_follow/proc/Destroy  (code/game/objects/effects/effect_system/effects_other.dm:20)  may sleep
rt.def("/datum/effect_system/trail_follow/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "oldposition", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/effect_system/trail_follow/proc/stop  (code/game/objects/effects/effect_system/effects_other.dm:25)
rt.def("/datum/effect_system/trail_follow/proc/stop", function stop(f: Frame) {
	rt.setSv(f, "processing", 0);
	rt.setSv(f, "on", 0);
	rt.setSv(f, "oldposition", null);
	return f.dot;
});

rt.type(1517, "/datum/effect_system/trail_follow/steam", "/datum/effect_system/trail_follow", {
	effect_type: rt.typePath("/obj/effect/particle_effect/steam"),
});

// /datum/effect_system/trail_follow/steam/proc/start  (code/game/objects/effects/effect_system/effects_other.dm:31)  may sleep
rt.def("/datum/effect_system/trail_follow/steam/proc/start", function* start(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (!truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "on", 1);
		rt.setSv(f, "processing", 1);
		if (!truthy(rt.sv(f, "oldposition"))) {
			rt.setSv(f, "oldposition", rt.getStep(f, rt.sv(f, "holder"), 0));
		}
	}
	if (!truthy(rt.sv(f, "processing"))) return f.dot;
	rt.setSv(f, "processing", 0);
	if (rt.lt(rt.sv(f, "number"), 3)) {
		I = (yield* g.new_(f, T("/obj/effect/particle_effect/steam"), [rt.sv(f, "oldposition")]));
		rt.incSrcVar(f, "number", 1, true);
		yield* g.callName(f, live(I), "setDir", [rt.fv(f, "dir", rt.sv(f, "holder"))]);
		rt.setSv(f, "oldposition", rt.getStep(f, rt.sv(f, "holder"), 0));
		rt.spawnTail(f, 10, "/datum/effect_system/trail_follow/steam/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:43", I);
	}
	rt.spawnTail(f, 2, "/datum/effect_system/trail_follow/steam/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:46", I);
	return f.dot;
}, true);

// a spawn(2) body of /datum/effect_system/trail_follow/steam/proc/start, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/effect_system/trail_follow/steam/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:46", function* (f: Frame, I: Value) {
	f.vars = () => [I];
	if (truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "processing", 1);
		yield* g.srcCall(f, "start");
	}
	return null;
});

// a spawn(10) body of /datum/effect_system/trail_follow/steam/proc/start, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/effect_system/trail_follow/steam/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:43", function* (f: Frame, I: Value) {
	f.vars = () => [I];
	yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	rt.incSrcVar(f, "number", -1, true);
	return null;
});

rt.type(1518, "/datum/effect_system/trail_follow/ion", "/datum/effect_system/trail_follow", {
	fadetype: "ion_fade",
	fade: 1,
	nograv_required: 1,
	effect_type: rt.typePath("/obj/effect/particle_effect/ion_trails"),
});

// /datum/effect_system/trail_follow/ion/proc/start  (code/game/objects/effects/effect_system/effects_other.dm:66)  may sleep
rt.def("/datum/effect_system/trail_follow/ion/proc/start", function* start(f: Frame) {
	let _T: Value = null, I: Value = null;
	f.vars = () => [_T, I];
	if (!truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "on", 1);
		rt.setSv(f, "processing", 1);
		if (!truthy(rt.sv(f, "oldposition"))) {
			rt.setSv(f, "oldposition", rt.getStep(f, rt.sv(f, "holder"), 0));
		}
	}
	if (!truthy(rt.sv(f, "processing"))) return f.dot;
	rt.setSv(f, "processing", 0);
	if (!isEqual((_T = rt.getStep(f, rt.sv(f, "holder"), 0)), rt.sv(f, "oldposition"))) {
		if ((!truthy((yield* g.callName(f, live(_T), "has_gravity", []))) || !truthy(rt.sv(f, "nograv_required")))) {
			yield* g.srcCall(f, "set_dir", (I = (yield* g.new_(f, rt.sv(f, "effect_type"), [rt.sv(f, "oldposition")]))));
			if (truthy(rt.sv(f, "fade"))) {
				yield* g.call(f, P("/proc/flick"), null, [rt.sv(f, "fadetype"), live(I)]);
				rt.setFv(f, "icon_state", live(I), "");
			}
			rt.spawnTail(f, 20, "/datum/effect_system/trail_follow/ion/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:81", _T, I);
		}
		rt.setSv(f, "oldposition", live(_T));
	}
	rt.spawnTail(f, 2, "/datum/effect_system/trail_follow/ion/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:84", _T, I);
	return f.dot;
}, true);

// a spawn(2) body of /datum/effect_system/trail_follow/ion/proc/start, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/effect_system/trail_follow/ion/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:84", function* (f: Frame, _T: Value, I: Value) {
	f.vars = () => [_T, I];
	if (truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "processing", 1);
		yield* g.srcCall(f, "start");
	}
	return null;
});

// a spawn(20) body of /datum/effect_system/trail_follow/ion/proc/start, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/effect_system/trail_follow/ion/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:81", function* (f: Frame, _T: Value, I: Value) {
	f.vars = () => [_T, I];
	yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	return null;
});

// /datum/effect_system/trail_follow/ion/proc/set_dir  (code/game/objects/effects/effect_system/effects_other.dm:90)
rt.def("/datum/effect_system/trail_follow/ion/proc/set_dir", function set_dir(f: Frame, I: Value) {
	rt.callName(f, live(I), "setDir", [rt.fv(f, "dir", rt.sv(f, "holder"))]);
	return f.dot;
});

rt.type(1519, "/datum/effect_system/trail_follow/ion/flight", "/datum/effect_system/trail_follow/ion", {
	fadetype: "ion_fade_flight",
	nograv_required: 0,
	effect_type: rt.typePath("/obj/effect/particle_effect/ion_trails/flight"),
});

// /datum/effect_system/trail_follow/ion/flight/proc/set_dir  (code/game/objects/effects/effect_system/effects_other.dm:98)
rt.def("/datum/effect_system/trail_follow/ion/flight/proc/set_dir", function set_dir(f: Frame, I: Value) {
	let F: Value = null;
	f.vars = () => [F];
	if (!truthy((rt.istype(rt.sv(f, "holder"), T("/obj/item/device/flightpack")) ? 1 : 0))) return f.dot;
	F = rt.sv(f, "holder");
	rt.callName(f, live(I), "setDir", [rt.gv(f, "dir", rt.gv(f, "user", rt.fv(f, "suit", live(F))))]);
	return f.dot;
});

rt.type(1520, "/datum/effect_system/reagents_explosion", "/datum/effect_system", {
	amount: null,
	flashing: 0,
	flashing_factor: 0,
	explosion_message: 1,
});

// /datum/effect_system/reagents_explosion/proc/set_up  (code/game/objects/effects/effect_system/effects_other.dm:112)
rt.def("/datum/effect_system/reagents_explosion/proc/set_up", function set_up(f: Frame, amt: Value, loca: Value, flash: Value, flash_fact: Value, message: Value) {
	f.vars = () => [flash, flash_fact, message];
	if (live(flash) === null) {
		flash = 0;
	}
	if (live(flash_fact) === null) {
		flash_fact = 0;
	}
	if (live(message) === null) {
		message = 1;
	}
	rt.setSv(f, "amount", live(amt));
	rt.setSv(f, "explosion_message", live(message));
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(loca)]))) {
		rt.setSv(f, "location", live(loca));
	} else {
		rt.setSv(f, "location", rt.getStep(f, live(loca), 0));
	}
	rt.setSv(f, "flashing", live(flash));
	rt.setSv(f, "flashing_factor", live(flash_fact));
	return f.dot;
});

// /datum/effect_system/reagents_explosion/proc/start  (code/game/objects/effects/effect_system/effects_other.dm:124)  may sleep
rt.def("/datum/effect_system/reagents_explosion/proc/start", function* start(f: Frame) {
	let s: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [s, L, $e];
	if (truthy(rt.sv(f, "explosion_message"))) {
		yield* g.callName(f, rt.sv(f, "location"), "visible_message", ["<span class='danger'>The solution violently explodes!</span>", "<span class='italics'>You hear an explosion!</span>"]);
	}
	if (rt.lt(rt.sv(f, "amount"), 1)) {
		yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [2, 1, rt.sv(f, "location")]);
		yield* g.callName(f, live(s), "start", []);
		L = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [1, rt.sv(f, "location")])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (truthy(rt.op(f, "Prob", [], [multiply(50, rt.sv(f, "amount"))]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='danger'>The explosion knocks you down.</span>"]);
				yield* g.callName(f, live(L), "Knockdown", [(yield* g.call(f, P("/proc/rand"), null, [20, 100]))]);
			}
		}
		rt.endFor(f, 0);
		return live(f.dot);
	} else {
		yield* g.call(f, P("/proc/dyn_explosion"), null, [rt.sv(f, "location"), rt.sv(f, "amount"), rt.sv(f, "flashing_factor")]);
	}
	return f.dot;
}, true);
