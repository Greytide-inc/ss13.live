// From code/controllers/subsystem/fire_burning.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(20, "/datum/controller/subsystem/fire_burning", "/datum/controller/subsystem", {
	currentrun: null,
	processing: null,
	name: "Fire Burning",
	priority: 40,
	flags: 5,
	runlevels: 12,
});

// /datum/controller/subsystem/fire_burning/proc/New  (code/controllers/subsystem/fire_burning.dm:1)  may sleep
rt.def("/datum/controller/subsystem/fire_burning/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSfire_burning"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSfire_burning"), T("/datum/controller/subsystem/fire_burning")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSfire_burning")]);
		}
		rt.setGl("SSfire_burning", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/fire_burning/proc/<init>  (code/controllers/subsystem/fire_burning.dm:7)
rt.def("/datum/controller/subsystem/fire_burning/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "currentrun", rt.list());
	$0 = $0;
	rt.setSv(f, "processing", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/fire_burning/proc/stat_entry  (code/controllers/subsystem/fire_burning.dm:11)  may sleep
rt.def("/datum/controller/subsystem/fire_burning/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* g.callSuper(f, [fmt("P:＀", [rt.len(f, rt.sv(f, "processing"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/fire_burning/proc/fire  (code/controllers/subsystem/fire_burning.dm:15)  may sleep
rt.def("/datum/controller/subsystem/fire_burning/proc/fire", function* fire(f: Frame, resumed: Value) {
	let currentrun: Value = null, O: Value = null;
	let $0: any;
	f.vars = () => [resumed, currentrun, O, $0];
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
		if ((!truthy(live(O)) || (!truthy(live(O)) || truthy(rt.fv(f, "gc_destroyed", live(O)))))) {
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
		if (truthy(rt.bitAnd(rt.fv(f, "resistance_flags", live(O)), 8))) {
			yield* g.callName(f, live(O), "take_damage", [20, "fire", "fire", 0]);
		} else {
			(rt.modSrcVar(f, "processing", live(O), subtract));
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
