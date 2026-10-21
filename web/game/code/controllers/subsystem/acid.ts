// From code/controllers/subsystem/acid.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12, "/datum/controller/subsystem/acid", "/datum/controller/subsystem", {
	currentrun: null,
	processing: null,
	name: "Acid",
	priority: 40,
	flags: 5,
	runlevels: 12,
});

// /datum/controller/subsystem/acid/proc/New  (code/controllers/subsystem/acid.dm:1)  may sleep
rt.def("/datum/controller/subsystem/acid/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSacid"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSacid"), T("/datum/controller/subsystem/acid")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSacid")]);
		}
		rt.setGl("SSacid", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/acid/proc/<init>  (code/controllers/subsystem/acid.dm:7)
rt.def("/datum/controller/subsystem/acid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "currentrun", rt.list());
	$0 = $0;
	rt.setSv(f, "processing", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/acid/proc/stat_entry  (code/controllers/subsystem/acid.dm:11)  may sleep
rt.def("/datum/controller/subsystem/acid/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* g.callSuper(f, [fmt("P:＀", [rt.len(f, rt.sv(f, "processing"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/acid/proc/fire  (code/controllers/subsystem/acid.dm:15)  may sleep
rt.def("/datum/controller/subsystem/acid/proc/fire", function* fire(f: Frame, resumed: Value) {
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
		if (!(truthy(rt.fv(f, "acid_level", live(O))) && truthy((yield* g.callName(f, live(O), "acid_processing", []))))) {
			yield* g.callName(f, live(O), "cut_overlay", [rt.gl("acid_overlay"), 1]);
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
