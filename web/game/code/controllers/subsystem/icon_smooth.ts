// From code/controllers/subsystem/icon_smooth.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(22, "/datum/controller/subsystem/icon_smooth", "/datum/controller/subsystem", {
	smooth_queue: null,
	name: "Icon Smoothing",
	init_order: -5,
	wait: 1,
	priority: 35,
	flags: 16,
});

// /datum/controller/subsystem/icon_smooth/proc/New  (code/controllers/subsystem/icon_smooth.dm:1)  may sleep
rt.def("/datum/controller/subsystem/icon_smooth/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSicon_smooth"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSicon_smooth"), T("/datum/controller/subsystem/icon_smooth")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSicon_smooth")]);
		}
		rt.setGl("SSicon_smooth", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/icon_smooth/proc/<init>  (code/controllers/subsystem/icon_smooth.dm:8)
rt.def("/datum/controller/subsystem/icon_smooth/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "smooth_queue", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/icon_smooth/proc/fire  (code/controllers/subsystem/icon_smooth.dm:11)
rt.def("/datum/controller/subsystem/icon_smooth/proc/fire", function fire(f: Frame) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [A, $0];
	while (truthy(rt.len(f, rt.sv(f, "smooth_queue")))) {
		A = rt.index(rt.sv(f, "smooth_queue"), rt.len(f, rt.sv(f, "smooth_queue")));
		rt.incField(f, rt.sv(f, "smooth_queue"), "len", -1, true);
		rt.call(f, P("/proc/smooth_icon"), null, [live(A)]);
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = rt.callSrc(f, "pause", []);
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	if (truthy(rt.len(f, rt.sv(f, "smooth_queue")))) return f.dot;
	rt.setSv(f, "can_fire", 0);
	return f.dot;
});

// /datum/controller/subsystem/icon_smooth/proc/Initialize  (code/controllers/subsystem/icon_smooth.dm:21)  may sleep
rt.def("/datum/controller/subsystem/icon_smooth/proc/Initialize", function* Initialize(f: Frame) {
	let queue: Value = null, V: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [queue, V, A, $e];
	yield* g.call(f, P("/proc/smooth_zlevel"), null, [1, 1]);
	yield* g.call(f, P("/proc/smooth_zlevel"), null, [2, 1]);
	queue = rt.sv(f, "smooth_queue");
	rt.setSv(f, "smooth_queue", rt.list());
	V = null;
	rt.forList(f, 0, live(queue));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if ((!truthy((A = live(V))) || rt.le(rt.fv(f, "z", live(A)), 2))) {
			continue;
		}
		yield* g.call(f, P("/proc/smooth_icon"), null, [live(A)]);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
