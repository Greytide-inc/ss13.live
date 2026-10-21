// From code/modules/orbit/orbit.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4175, "/datum/orbit", "/datum", {
	orbiter: null,
	orbiting: null,
	lock: 1,
	lastloc: null,
	lastprocess: null,
});

// /datum/orbit/proc/New  (code/modules/orbit/orbit.dm:9)  may sleep
rt.def("/datum/orbit/proc/New", function* New(f: Frame, _orbiter: Value, _orbiting: Value, _lock: Value) {
	f.vars = () => [_orbiter, _orbiting, _lock];
	rt.setSv(f, "orbiter", live(_orbiter));
	rt.setSv(f, "orbiting", live(_orbiting));
	rt.modField(f, rt.gl("SSorbit"), "processing", live(f.src), add);
	if (!truthy(rt.fv(f, "orbiters", rt.sv(f, "orbiting")))) {
		rt.setFv(f, "orbiters", rt.sv(f, "orbiting"), rt.list());
	}
	rt.modField(f, rt.sv(f, "orbiting"), "orbiters", live(f.src), add);
	if (truthy(rt.fv(f, "orbiting", rt.sv(f, "orbiter")))) {
		yield* g.callName(f, rt.sv(f, "orbiter"), "stop_orbit", []);
	}
	rt.setFv(f, "orbiting", rt.sv(f, "orbiter"), live(f.src));
	yield* g.srcCall(f, "Check");
	rt.setSv(f, "lock", live(_lock));
	return f.dot;
}, true);

// /datum/orbit/proc/Destroy  (code/modules/orbit/orbit.dm:26)  may sleep
rt.def("/datum/orbit/proc/Destroy", function* Destroy(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	(rt.modField(f, rt.gl("SSorbit"), "processing", live(f.src), subtract));
	if (truthy(rt.sv(f, "orbiter"))) {
		rt.setFv(f, "orbiting", rt.sv(f, "orbiter"), null);
		rt.setSv(f, "orbiter", null);
	}
	if (truthy(rt.sv(f, "orbiting"))) {
		if (truthy(rt.fv(f, "orbiters", rt.sv(f, "orbiting")))) {
			(rt.modField(f, rt.sv(f, "orbiting"), "orbiters", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "orbiters", rt.sv(f, "orbiting"))))) {
				rt.setFv(f, "orbiters", rt.sv(f, "orbiting"), null);
			}
		}
		rt.setSv(f, "orbiting", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["force"] });

// /datum/orbit/proc/Check  (code/modules/orbit/orbit.dm:39)  may sleep
rt.def("/datum/orbit/proc/Check", function* Check(f: Frame, targetloc: Value) {
	f.vars = () => [targetloc];
	if (!truthy(rt.sv(f, "orbiter"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "orbiting"))) {
		yield* g.callName(f, rt.sv(f, "orbiter"), "stop_orbit", []);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "orbiting", rt.sv(f, "orbiter")))) {
		rt.setFv(f, "orbiting", rt.sv(f, "orbiter"), live(f.src));
		yield* g.callName(f, rt.sv(f, "orbiter"), "stop_orbit", []);
	}
	rt.setSv(f, "lastprocess", rt.worldTime(f));
	if (!truthy(live(targetloc))) {
		targetloc = rt.getStep(f, rt.sv(f, "orbiting"), 0);
	}
	if ((!truthy(live(targetloc)) || ((!truthy(rt.sv(f, "lock")) && !isEqual(rt.fv(f, "loc", rt.sv(f, "orbiter")), rt.sv(f, "lastloc"))) && !isEqual(rt.fv(f, "loc", rt.sv(f, "orbiter")), live(targetloc))))) {
		yield* g.callName(f, rt.sv(f, "orbiter"), "stop_orbit", []);
		return live(f.dot);
	}
	rt.setFv(f, "loc", rt.sv(f, "orbiter"), live(targetloc));
	yield* g.callName(f, rt.sv(f, "orbiter"), "update_parallax_contents", []);
	rt.setSv(f, "lastloc", rt.fv(f, "loc", rt.sv(f, "orbiter")));
	return f.dot;
}, true);

// /atom/movable/proc/orbit  (code/modules/orbit/orbit.dm:71)  may sleep
rt.def("/atom/movable/proc/orbit", function* orbit(f: Frame, A: Value, radius: Value, clockwise: Value, rotation_speed: Value, rotation_segments: Value, pre_rotation: Value, lockinorbit: Value) {
	let initial_transform: Value = null, M: Value = null, pre_rot: Value = null, shift: Value = null;
	f.vars = () => [A, radius, clockwise, rotation_speed, rotation_segments, pre_rotation, lockinorbit, initial_transform, M, pre_rot, shift];
	if (live(radius) === null) {
		radius = 10;
	}
	if (live(clockwise) === null) {
		clockwise = 0;
	}
	if (live(rotation_speed) === null) {
		rotation_speed = 20;
	}
	if (live(rotation_segments) === null) {
		rotation_segments = 36;
	}
	if (live(pre_rotation) === null) {
		pre_rotation = 1;
	}
	if (live(lockinorbit) === null) {
		lockinorbit = 0;
	}
	if (!truthy((rt.istype(live(A), T("/atom")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/datum/orbit"), [live(f.src), live(A), live(lockinorbit)]);
	if (!truthy(rt.sv(f, "orbiting"))) {
		return live(f.dot);
	}
	initial_transform = (yield* g.call(f, P("/proc/matrix"), null, [rt.sv(f, "transform")]));
	if (truthy(live(pre_rotation))) {
		M = (yield* g.call(f, P("/proc/matrix"), null, [rt.sv(f, "transform")]));
		pre_rot = 90;
		if (!truthy(live(clockwise)) || rt.istype(live(f.src), T("/mob/dead/observer"))) { // tg_js: ghosts keep tg's -90 lean while orbiting clockwise
			pre_rot = -90;
		}
		yield* g.callName(f, live(M), "Turn", [live(pre_rot)]);
		rt.setSv(f, "transform", live(M));
	}
	yield* g.callName(f, (shift = (yield* g.call(f, P("/proc/matrix"), null, [rt.sv(f, "transform")]))), "Translate", [0, live(radius)]);
	rt.setSv(f, "transform", live(shift));
	yield* g.srcCall(f, "SpinAnimation", live(rotation_speed), -1, live(clockwise), live(rotation_segments));
	rt.setSv(f, "transform", live(initial_transform));
	return f.dot;
}, true, { argTypes: [{ path: "/atom" }, {  }, {  }, {  }, {  }, {  }, {  }] });

// /atom/movable/proc/stop_orbit  (code/modules/orbit/orbit.dm:98)  may sleep
rt.def("/atom/movable/proc/stop_orbit", function* stop_orbit(f: Frame) {
	yield* g.srcCall(f, "SpinAnimation", 0, 0);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "orbiting")]);
	return f.dot;
}, true);

// /atom/proc/Destroy  (code/modules/orbit/orbit.dm:102)  may sleep
rt.def("/atom/proc/Destroy", function* Destroy(f: Frame) {
	let thing: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [thing, O, $e];
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "orbiters"))) return f.dot;
	thing = null;
	rt.forList(f, 0, rt.sv(f, "orbiters"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (truthy(rt.gv(f, "orbiter", (O = live(thing))))) {
			yield* g.callName(f, rt.fv(f, "orbiter", live(O)), "stop_orbit", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["force"] });

// /atom/movable/proc/Destroy  (code/modules/orbit/orbit.dm:110)  may sleep
rt.def("/atom/movable/proc/Destroy", function* Destroy(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "orbiting"))) return f.dot;
	yield* g.srcCall(f, "stop_orbit");
	return f.dot;
}, true, { args: ["force"] });
