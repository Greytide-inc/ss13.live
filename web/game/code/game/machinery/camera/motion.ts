// From code/game/machinery/camera/motion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/machinery/camera/proc/process  (code/game/machinery/camera/motion.dm:10)
rt.def("/obj/machinery/camera/proc/process", function process(f: Frame) {
	let elapsed: Value = null, target: Value = null;
	let $e: any;
	f.vars = () => [elapsed, target, $e];
	if (!truthy(rt.callSrc(f, "isMotion", []))) {
		f.dot = 26;
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "detectTime"), 0)) {
		if (rt.gt((elapsed = subtract(rt.worldTime(f), rt.sv(f, "detectTime"))), rt.sv(f, "alarm_delay"))) {
			rt.callSrc(f, "triggerAlarm", []);
		}
	} else {
		if (!isEqual(rt.sv(f, "detectTime"), -1)) return f.dot;
		target = null;
		rt.forList(f, 0, rt.callSrc(f, "getTargetList", []), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			target = $e;
			if ((isEqual(rt.fv(f, "stat", live(target)), 2) || (!truthy(rt.sv(f, "area_motion")) && !rt.le(rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(target)]), 1)))) {
				rt.callSrc(f, "lostTarget", [live(target)]);
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/camera/proc/getTargetList  (code/game/machinery/camera/motion.dm:25)
rt.def("/obj/machinery/camera/proc/getTargetList", function getTargetList(f: Frame) {
	if (truthy(rt.sv(f, "area_motion"))) {
		return rt.fv(f, "motionTargets", rt.sv(f, "area_motion"));
	}
	return rt.sv(f, "localMotionTargets");
});

// /obj/machinery/camera/proc/newTarget  (code/game/machinery/camera/motion.dm:29)
rt.def("/obj/machinery/camera/proc/newTarget", function newTarget(f: Frame, target: Value) {
	let targets: Value = null;
	f.vars = () => [targets];
	if (truthy((rt.istype(live(target), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		return 0;
	}
	if (isEqual(rt.sv(f, "detectTime"), 0)) {
		rt.setSv(f, "detectTime", rt.worldTime(f));
	}
	targets = rt.callSrc(f, "getTargetList", []);
	if (!truthy((rt.isIn(f, live(target), live(targets)) ? 1 : 0))) {
		targets = rt.modify(live(targets), live(target), add);
	}
	return 1;
});

// /obj/machinery/camera/proc/Destroy  (code/game/machinery/camera/motion.dm:39)  may sleep
rt.def("/obj/machinery/camera/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (truthy((rt.istype((A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))), T("/area/ai_monitored")) ? 1 : 0))) {
		(rt.modField(f, live(A), "motioncameras", live(f.src), subtract));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/camera/proc/lostTarget  (code/game/machinery/camera/motion.dm:45)
rt.def("/obj/machinery/camera/proc/lostTarget", function lostTarget(f: Frame, target: Value) {
	let targets: Value = null;
	f.vars = () => [targets];
	targets = rt.callSrc(f, "getTargetList", []);
	if (truthy((rt.isIn(f, live(target), live(targets)) ? 1 : 0))) {
		(targets = rt.modify(live(targets), live(target), subtract));
	}
	if (!isEqual(rt.len(f, live(targets)), 0)) return f.dot;
	rt.callSrc(f, "cancelAlarm", []);
	return f.dot;
});

// /obj/machinery/camera/proc/cancelAlarm  (code/game/machinery/camera/motion.dm:52)
rt.def("/obj/machinery/camera/proc/cancelAlarm", function cancelAlarm(f: Frame) {
	let aiPlayer: Value = null;
	let $e: any;
	f.vars = () => [aiPlayer, $e];
	if (isEqual(rt.sv(f, "detectTime"), -1)) {
		aiPlayer = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/silicon"));
		while (($e = rt.next(f, 0)) !== undefined) {
			aiPlayer = $e;
			if (truthy(rt.sv(f, "status"))) {
				rt.callName(f, live(aiPlayer), "cancelAlarm", ["Motion", rt.call(f, P("/proc/get_area"), null, [live(f.src)]), live(f.src)]);
			}
		}
		rt.endFor(f, 0);
	}
	rt.setSv(f, "detectTime", 0);
	return 1;
});

// /obj/machinery/camera/proc/triggerAlarm  (code/game/machinery/camera/motion.dm:60)
rt.def("/obj/machinery/camera/proc/triggerAlarm", function triggerAlarm(f: Frame) {
	let aiPlayer: Value = null;
	let $e: any;
	f.vars = () => [aiPlayer, $e];
	if (!truthy(rt.sv(f, "detectTime"))) {
		return 0;
	}
	aiPlayer = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/silicon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		aiPlayer = $e;
		if (truthy(rt.sv(f, "status"))) {
			rt.callName(f, live(aiPlayer), "triggerAlarm", ["Motion", rt.call(f, P("/proc/get_area"), null, [live(f.src)]), rt.list(live(f.src)), live(f.src)]);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "detectTime", -1);
	return 1;
});

// /obj/machinery/camera/proc/HasProximity  (code/game/machinery/camera/motion.dm:69)
rt.def("/obj/machinery/camera/proc/HasProximity", function HasProximity(f: Frame, AM: Value) {
	if (truthy(rt.sv(f, "area_motion"))) return f.dot;
	if (!truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) return f.dot;
	rt.callSrc(f, "newTarget", [live(AM)]);
	return f.dot;
});
