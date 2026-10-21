// From code/controllers/subsystem/processing/processing.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(52, "/datum/controller/subsystem/processing", "/datum/controller/subsystem", {
	stat_tag: "P",
	processing: null,
	currentrun: null,
	name: "Processing",
	priority: 25,
	flags: 69,
	wait: 10,
});

// /datum/controller/subsystem/processing/proc/New  (code/controllers/subsystem/processing/processing.dm:3)  may sleep
rt.def("/datum/controller/subsystem/processing/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSprocessing"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSprocessing"), T("/datum/controller/subsystem/processing")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSprocessing")]);
		}
		rt.setGl("SSprocessing", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/processing/proc/<init>  (code/controllers/subsystem/processing/processing.dm:10)
rt.def("/datum/controller/subsystem/processing/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "processing", rt.list());
	$0 = $0;
	rt.setSv(f, "currentrun", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/processing/proc/stat_entry  (code/controllers/subsystem/processing/processing.dm:14)  may sleep
rt.def("/datum/controller/subsystem/processing/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* g.callSuper(f, [fmt("＀:＀", [rt.sv(f, "stat_tag"), rt.len(f, rt.sv(f, "processing"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/processing/proc/fire  (code/controllers/subsystem/processing/processing.dm:17)
rt.def("/datum/controller/subsystem/processing/proc/fire", function fire(f: Frame, resumed: Value) {
	let current_run: Value = null, thing: Value = null;
	let $0: any;
	f.vars = () => [resumed, current_run, thing, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setSv(f, "currentrun", rt.callName(f, rt.sv(f, "processing"), "Copy", []));
	}
	current_run = rt.sv(f, "currentrun");
	while (truthy(rt.len(f, live(current_run)))) {
		thing = rt.index(live(current_run), rt.len(f, live(current_run)));
		rt.incField(f, live(current_run), "len", -1, true);
		if (((!truthy(live(thing)) || truthy(rt.fv(f, "gc_destroyed", live(thing)))) || isEqual(rt.callName(f, live(thing), "process", [rt.sv(f, "wait")]), 26))) {
			(rt.modSrcVar(f, "processing", live(thing), subtract));
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

// /datum/proc/process  (code/controllers/subsystem/processing/processing.dm:33)
rt.def("/datum/proc/process", function process(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return 0;
}, false, { waitfor: false });
