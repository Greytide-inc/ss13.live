// From code/controllers/subsystem/mobs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(30, "/datum/controller/subsystem/mobs", "/datum/controller/subsystem", {
	currentrun: null,
	name: "Mobs",
	priority: 100,
	flags: 33,
	runlevels: 12,
});

// /datum/controller/subsystem/mobs/proc/New  (code/controllers/subsystem/mobs.dm:1)  may sleep
rt.def("/datum/controller/subsystem/mobs/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSmobs"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSmobs"), T("/datum/controller/subsystem/mobs")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSmobs")]);
		}
		rt.setGl("SSmobs", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/mobs/proc/<init>  (code/controllers/subsystem/mobs.dm:7)
rt.def("/datum/controller/subsystem/mobs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "currentrun", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/mobs/proc/stat_entry  (code/controllers/subsystem/mobs.dm:10)  may sleep
rt.def("/datum/controller/subsystem/mobs/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* g.callSuper(f, [fmt("P:＀", [rt.len(f, rt.gl("mob_list"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/mobs/proc/fire  (code/controllers/subsystem/mobs.dm:14)
rt.def("/datum/controller/subsystem/mobs/proc/fire", function fire(f: Frame, resumed: Value) {
	let seconds: Value = null, currentrun: Value = null, times_fired: Value = null, M: Value = null;
	let $0: any;
	f.vars = () => [resumed, seconds, currentrun, times_fired, M, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	seconds = multiply(rt.sv(f, "wait"), 0.10000000149011612);
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), rt.callName(f, rt.gl("mob_list"), "Copy", []));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	times_fired = rt.fv(f, "times_fired", live(f.src));
	while (truthy(rt.len(f, live(currentrun)))) {
		M = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		if (truthy(live(M))) {
			rt.callName(f, live(M), "Life", [live(seconds), live(times_fired)]);
		} else {
			rt.callName(f, rt.gl("mob_list"), "Remove", [live(M)]);
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
