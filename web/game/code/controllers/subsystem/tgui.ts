// From code/controllers/subsystem/tgui.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(44, "/datum/controller/subsystem/tgui", "/datum/controller/subsystem", {
	currentrun: null,
	open_uis: null,
	processing_uis: null,
	basehtml: null,
	name: "tgui",
	wait: 9,
	flags: 1,
	priority: 110,
	runlevels: 15,
});

// /datum/controller/subsystem/tgui/proc/New  (code/controllers/subsystem/tgui.dm:1)  may sleep
rt.def("/datum/controller/subsystem/tgui/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SStgui"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SStgui"), T("/datum/controller/subsystem/tgui")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SStgui")]);
		}
		rt.setGl("SStgui", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/tgui/proc/<init>  (code/controllers/subsystem/tgui.dm:8)
rt.def("/datum/controller/subsystem/tgui/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "currentrun", rt.list());
	$0 = $0;
	rt.setSv(f, "open_uis", rt.list());
	$0 = $0;
	rt.setSv(f, "processing_uis", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/tgui/proc/PreInit  (code/controllers/subsystem/tgui.dm:14)
rt.def("/datum/controller/subsystem/tgui/proc/PreInit", function PreInit(f: Frame) {
	rt.setSv(f, "basehtml", rt.call(f, P("/proc/file2text"), null, [rt.rsc("tgui/tgui.html")]));
	return f.dot;
});

// /datum/controller/subsystem/tgui/proc/Shutdown  (code/controllers/subsystem/tgui.dm:17)  may sleep
rt.def("/datum/controller/subsystem/tgui/proc/Shutdown", function* Shutdown(f: Frame) {
	yield* g.srcCall(f, "close_all_uis");
	return f.dot;
}, true);

// /datum/controller/subsystem/tgui/proc/stat_entry  (code/controllers/subsystem/tgui.dm:20)  may sleep
rt.def("/datum/controller/subsystem/tgui/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* g.callSuper(f, [fmt("P:＀", [rt.len(f, rt.sv(f, "processing_uis"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/tgui/proc/fire  (code/controllers/subsystem/tgui.dm:23)
rt.def("/datum/controller/subsystem/tgui/proc/fire", function fire(f: Frame, resumed: Value) {
	let currentrun: Value = null, ui: Value = null;
	let $0: any;
	f.vars = () => [resumed, currentrun, ui, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), rt.callName(f, rt.sv(f, "processing_uis"), "Copy", []));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.len(f, live(currentrun)))) {
		ui = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		if (((truthy(live(ui)) && truthy(rt.fv(f, "user", live(ui)))) && truthy(rt.fv(f, "src_object", live(ui))))) {
			rt.callName(f, live(ui), "process", []);
		} else {
			rt.callName(f, rt.sv(f, "processing_uis"), "Remove", [live(ui)]);
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
