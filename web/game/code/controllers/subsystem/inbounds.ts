// From code/controllers/subsystem/inbounds.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(23, "/datum/controller/subsystem/inbounds", "/datum/controller/subsystem", {
	processing: null,
	currentrun: null,
	name: "Inbounds",
	priority: 40,
	flags: 1,
	runlevels: 4,
});

// /datum/controller/subsystem/inbounds/proc/New  (code/controllers/subsystem/inbounds.dm:1)  may sleep
rt.def("/datum/controller/subsystem/inbounds/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSinbounds"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSinbounds"), T("/datum/controller/subsystem/inbounds")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSinbounds")]);
		}
		rt.setGl("SSinbounds", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/inbounds/proc/<init>  (code/controllers/subsystem/inbounds.dm:7)
rt.def("/datum/controller/subsystem/inbounds/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "processing", rt.list());
	$0 = $0;
	rt.setSv(f, "currentrun", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/inbounds/proc/stat_entry  (code/controllers/subsystem/inbounds.dm:11)  may sleep
rt.def("/datum/controller/subsystem/inbounds/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* g.callSuper(f, [fmt("P:＀", [rt.len(f, rt.sv(f, "processing"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/inbounds/proc/fire  (code/controllers/subsystem/inbounds.dm:14)  may sleep
rt.def("/datum/controller/subsystem/inbounds/proc/fire", function* fire(f: Frame, resumed: Value) {
	let currentrun: Value = null, thing: Value = null;
	let $0: any;
	f.vars = () => [resumed, currentrun, thing, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), (yield* g.callName(f, rt.sv(f, "processing"), "Copy", [])));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.len(f, live(currentrun)))) {
		thing = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		if (truthy(live(thing))) {
			yield* g.callName(f, live(thing), "check_in_bounds", [rt.sv(f, "wait")]);
		} else {
			(rt.modField(f, rt.gl("SSinbounds"), "processing", live(thing), subtract));
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
