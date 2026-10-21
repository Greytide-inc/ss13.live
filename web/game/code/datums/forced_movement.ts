// From code/datums/forced_movement.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(546, "/datum/forced_movement", "/datum", {
	victim: null,
	target: null,
	last_processed: null,
	steps_per_tick: null,
	allow_climbing: null,
	on_step: null,
	moved_at_all: 0,
});

// /datum/forced_movement/proc/New  (code/datums/forced_movement.dm:12)  may sleep
rt.def("/datum/forced_movement/proc/New", function* New(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0.5;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = null;
	}
	rt.setSv(f, "victim", live(f.args[0]));
	rt.setSv(f, "target", live(f.args[1]));
	rt.setSv(f, "steps_per_tick", live(f.args[2]));
	rt.setSv(f, "allow_climbing", live(f.args[3]));
	rt.setSv(f, "on_step", live(f.args[4]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if ((((truthy(live(f.args[0])) && truthy(live(f.args[1]))) && truthy(live(f.args[2]))) && !truthy(rt.fv(f, "force_moving", live(f.args[0]))))) {
		rt.setSv(f, "last_processed", rt.worldTime(f));
		rt.setFv(f, "force_moving", live(f.args[0]), live(f.src));
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
		}
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true, { args: ["_victim", "_target", "_steps_per_tick", "_allow_climbing", "_on_step"] });

// /datum/forced_movement/proc/Destroy  (code/datums/forced_movement.dm:28)  may sleep
rt.def("/datum/forced_movement/proc/Destroy", function* Destroy(f: Frame) {
	if (isEqual(rt.fv(f, "force_moving", rt.sv(f, "victim")), live(f.src))) {
		rt.setFv(f, "force_moving", rt.sv(f, "victim"), null);
		if (truthy(rt.sv(f, "moved_at_all"))) {
			yield* g.callName(f, rt.sv(f, "victim"), "forceMove", [rt.fv(f, "loc", rt.sv(f, "victim"))]);
		}
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	}
	rt.setSv(f, "victim", null);
	rt.setSv(f, "target", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/forced_movement/proc/process  (code/datums/forced_movement.dm:38)  may sleep
rt.def("/datum/forced_movement/proc/process", function* process(f: Frame) {
	let steps_to_take: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [steps_to_take, i, $e];
	if (((((!truthy(rt.sv(f, "victim")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "victim")))) || !truthy(rt.fv(f, "loc", rt.sv(f, "victim")))) || (!truthy(rt.sv(f, "target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "target"))))) || !truthy(rt.fv(f, "loc", rt.sv(f, "target"))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (!truthy((steps_to_take = (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "steps_per_tick"), subtract(rt.worldTime(f), rt.sv(f, "last_processed")))]))))) return f.dot;
	i = null;
	rt.forRange(f, 0, 1, live(steps_to_take), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy((yield* g.srcCall(f, "TryMove")))) {
			rt.setSv(f, "moved_at_all", 1);
			if (truthy(rt.sv(f, "on_step"))) {
				yield* g.callName(f, rt.sv(f, "on_step"), "InvokeAsync", []);
			}
		} else {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "last_processed", rt.worldTime(f));
	return f.dot;
}, true, { waitfor: false });

// /datum/forced_movement/proc/TryMove  (code/datums/forced_movement.dm:54)  may sleep
rt.def("/datum/forced_movement/proc/TryMove", function* TryMove(f: Frame, recursive: Value) {
	let vic: Value = null, tar: Value = null;
	f.vars = () => [recursive, vic, tar];
	if (live(recursive) === null) {
		recursive = 0;
	}
	vic = rt.sv(f, "victim");
	tar = rt.sv(f, "target");
	if (!truthy(live(recursive))) {
		f.dot = (yield* g.call(f, P("/proc/step_towards"), null, [live(vic), live(tar)]));
	}
	if (!truthy(live(f.dot))) {
		if (rt.gt(rt.fv(f, "x", live(tar)), rt.fv(f, "x", live(vic)))) {
			if (truthy((yield* g.call(f, P("/proc/step"), null, [live(vic), 4])))) {
				f.dot = 1;
			}
		} else {
			if (rt.lt(rt.fv(f, "x", live(tar)), rt.fv(f, "x", live(vic)))) {
				if (truthy((yield* g.call(f, P("/proc/step"), null, [live(vic), 8])))) {
					f.dot = 1;
				}
			}
		}
		if (!truthy(live(f.dot))) {
			if (rt.gt(rt.fv(f, "y", live(tar)), rt.fv(f, "y", live(vic)))) {
				if (truthy((yield* g.call(f, P("/proc/step"), null, [live(vic), 1])))) {
					f.dot = 1;
				}
			} else {
				if (rt.lt(rt.fv(f, "y", live(tar)), rt.fv(f, "y", live(vic)))) {
					if (truthy((yield* g.call(f, P("/proc/step"), null, [live(vic), 2])))) {
						f.dot = 1;
					}
				}
			}
			if (!truthy(live(f.dot))) {
				if (truthy(live(recursive))) {
					return 0;
				} else {
					f.dot = (yield* g.srcCall(f, "TryMove", 1));
				}
			}
		}
	}
	f.dot = (live(f.dot) && (!isEqual(rt.fv(f, "loc", live(vic)), rt.fv(f, "loc", live(tar))) ? 1 : 0));
	return f.dot;
}, true);

// /mob/proc/Bump  (code/datums/forced_movement.dm:86)  may sleep
rt.def("/mob/proc/Bump", function* Bump(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy(rt.sv(f, "force_moving")) && truthy(rt.fv(f, "allow_climbing", rt.sv(f, "force_moving")))) && truthy((rt.istype(live(f.args[0]), T("/obj/structure")) ? 1 : 0)))) return f.dot;
	if (!truthy(rt.gv(f, "climbable", (S = live(f.args[0]))))) return f.dot;
	yield* g.callName(f, live(S), "do_climb", [live(f.src)]);
	return f.dot;
}, true, { args: ["A"] });
