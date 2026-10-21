// From code/controllers/subsystem/processing/obj.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(57, "/datum/controller/subsystem/obj", "/datum/controller/subsystem", {
	processing: null,
	currentrun: null,
	name: "Objects",
	priority: 40,
	flags: 1,
});

// /datum/controller/subsystem/obj/proc/New  (code/controllers/subsystem/processing/obj.dm:1)  may sleep
rt.def("/datum/controller/subsystem/obj/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSobj"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSobj"), T("/datum/controller/subsystem/obj")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSobj")]);
		}
		rt.setGl("SSobj", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/obj/proc/<init>  (code/controllers/subsystem/processing/obj.dm:6)
rt.def("/datum/controller/subsystem/obj/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "processing", rt.list());
	$0 = $0;
	rt.setSv(f, "currentrun", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/obj/proc/stat_entry  (code/controllers/subsystem/processing/obj.dm:10)  may sleep
rt.def("/datum/controller/subsystem/obj/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* g.callSuper(f, [fmt("P:＀", [rt.len(f, rt.sv(f, "processing"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/obj/proc/fire  (code/controllers/subsystem/processing/obj.dm:13)
rt.def("/datum/controller/subsystem/obj/proc/fire", function fire(f: Frame, resumed: Value) {
	let currentrun: Value = null, thing: Value = null;
	let $0: any;
	f.vars = () => [resumed, currentrun, thing, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), rt.callName(f, rt.sv(f, "processing"), "Copy", []));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.len(f, live(currentrun)))) {
		thing = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		if (truthy(live(thing))) {
			rt.callName(f, live(thing), "process", [rt.sv(f, "wait")]);
		} else {
			(rt.modField(f, rt.gl("SSobj"), "processing", live(thing), subtract));
		}
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = rt.callSrc(f, "pause", []);
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	return f.dot;
});
