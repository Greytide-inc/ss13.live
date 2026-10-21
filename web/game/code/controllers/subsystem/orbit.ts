// From code/controllers/subsystem/orbit.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(32, "/datum/controller/subsystem/orbit", "/datum/controller/subsystem", {
	currentrun: null,
	processing: null,
	name: "Orbits",
	priority: 35,
	wait: 2,
	flags: 17,
});

// /datum/controller/subsystem/orbit/proc/New  (code/controllers/subsystem/orbit.dm:1)  may sleep
rt.def("/datum/controller/subsystem/orbit/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSorbit"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSorbit"), T("/datum/controller/subsystem/orbit")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSorbit")]);
		}
		rt.setGl("SSorbit", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/orbit/proc/<init>  (code/controllers/subsystem/orbit.dm:7)
rt.def("/datum/controller/subsystem/orbit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "currentrun", rt.list());
	$0 = $0;
	rt.setSv(f, "processing", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/orbit/proc/stat_entry  (code/controllers/subsystem/orbit.dm:11)  may sleep
rt.def("/datum/controller/subsystem/orbit/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* g.callSuper(f, [fmt("P:＀", [rt.len(f, rt.sv(f, "processing"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/orbit/proc/fire  (code/controllers/subsystem/orbit.dm:15)  may sleep
rt.def("/datum/controller/subsystem/orbit/proc/fire", function* fire(f: Frame, resumed: Value) {
	let currentrun: Value = null, O: Value = null, targetloc: Value = null;
	let $0: any;
	f.vars = () => [resumed, currentrun, O, targetloc, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), (yield* g.callName(f, rt.sv(f, "processing"), "Copy", [])));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.len(f, live(currentrun)))) {
		O = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		if (!truthy(live(O))) {
			(rt.modSrcVar(f, "processing", live(O), subtract));
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
		if (!truthy(rt.fv(f, "orbiter", live(O)))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
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
		if (rt.ge(rt.fv(f, "lastprocess", live(O)), rt.worldTime(f))) {
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
		if ((!isEqual((targetloc = rt.getStep(f, rt.fv(f, "orbiting", live(O)), 0)), rt.fv(f, "lastloc", live(O))) || !isEqual(rt.gv(f, "loc", rt.fv(f, "orbiter", live(O))), live(targetloc)))) {
			yield* g.callName(f, live(O), "Check", [live(targetloc)]);
		}
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
