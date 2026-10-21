// From code/controllers/subsystem/spacedrift.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(40, "/datum/controller/subsystem/spacedrift", "/datum/controller/subsystem", {
	currentrun: null,
	processing: null,
	name: "Space Drift",
	priority: 30,
	wait: 5,
	flags: 33,
	runlevels: 12,
});

// /datum/controller/subsystem/spacedrift/proc/New  (code/controllers/subsystem/spacedrift.dm:1)  may sleep
rt.def("/datum/controller/subsystem/spacedrift/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSspacedrift"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSspacedrift"), T("/datum/controller/subsystem/spacedrift")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSspacedrift")]);
		}
		rt.setGl("SSspacedrift", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/spacedrift/proc/<init>  (code/controllers/subsystem/spacedrift.dm:8)
rt.def("/datum/controller/subsystem/spacedrift/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "currentrun", rt.list());
	$0 = $0;
	rt.setSv(f, "processing", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/spacedrift/proc/stat_entry  (code/controllers/subsystem/spacedrift.dm:12)  may sleep
rt.def("/datum/controller/subsystem/spacedrift/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* g.callSuper(f, [fmt("P:＀", [rt.len(f, rt.sv(f, "processing"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/spacedrift/proc/fire  (code/controllers/subsystem/spacedrift.dm:16)  may sleep
rt.def("/datum/controller/subsystem/spacedrift/proc/fire", function* fire(f: Frame, resumed: Value) {
	let currentrun: Value = null, AM: Value = null, old_dir: Value = null, old_loc: Value = null;
	let $0: any;
	f.vars = () => [resumed, currentrun, AM, old_dir, old_loc, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), (yield* g.callName(f, rt.sv(f, "processing"), "Copy", [])));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.len(f, live(currentrun)))) {
		AM = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		if (!truthy(live(AM))) {
			(rt.modSrcVar(f, "processing", live(AM), subtract));
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = (yield* g.srcCall(f, "pause"));
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				return live(f.dot);
			}
			continue;
		}
		if (rt.gt(rt.fv(f, "inertia_next_move", live(AM)), rt.worldTime(f))) {
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = (yield* g.srcCall(f, "pause"));
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				return live(f.dot);
			}
			continue;
		}
		if (((!truthy(rt.fv(f, "loc", live(AM))) || !isEqual(rt.fv(f, "loc", live(AM)), rt.fv(f, "inertia_last_loc", live(AM)))) || truthy((yield* g.callName(f, live(AM), "Process_Spacemove", [0]))))) {
			rt.setFv(f, "inertia_dir", live(AM), 0);
		}
		if (!truthy(rt.fv(f, "inertia_dir", live(AM)))) {
			rt.setFv(f, "inertia_last_loc", live(AM), null);
			(rt.modSrcVar(f, "processing", live(AM), subtract));
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = (yield* g.srcCall(f, "pause"));
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				return live(f.dot);
			}
			continue;
		}
		old_dir = rt.fv(f, "dir", live(AM));
		old_loc = rt.fv(f, "loc", live(AM));
		rt.setFv(f, "glide_size", live(AM), (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [divide(32, (yield* g.call(f, P("/proc/max"), null, [divide(rt.fv(f, "inertia_move_delay", live(AM)), rt.fv(f, "tick_lag", rt.world())), 1]))), 32]))])));
		rt.setFv(f, "inertia_moving", live(AM), 1);
		yield* g.call(f, P("/proc/step"), null, [live(AM), rt.fv(f, "inertia_dir", live(AM))]);
		rt.setFv(f, "inertia_moving", live(AM), 0);
		rt.setFv(f, "inertia_next_move", live(AM), add(rt.worldTime(f), rt.fv(f, "inertia_move_delay", live(AM))));
		if (isEqual(rt.fv(f, "loc", live(AM)), live(old_loc))) {
			rt.setFv(f, "inertia_dir", live(AM), 0);
		}
		yield* g.callName(f, live(AM), "setDir", [live(old_dir)]);
		rt.setFv(f, "inertia_last_loc", live(AM), rt.fv(f, "loc", live(AM)));
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = (yield* g.srcCall(f, "pause"));
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	return f.dot;
}, true);
