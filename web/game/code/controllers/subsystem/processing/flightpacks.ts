// From code/controllers/subsystem/processing/flightpacks.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(55, "/datum/controller/subsystem/processing/flightpacks", "/datum/controller/subsystem/processing", {
	flightsuit_processing: 1,
	name: "Flightpack Movement",
	priority: 30,
	wait: 2,
	flags: 49,
	stat_tag: "FM",
});

// /datum/controller/subsystem/processing/flightpacks/proc/New  (code/controllers/subsystem/processing/flightpacks.dm:1)  may sleep
rt.def("/datum/controller/subsystem/processing/flightpacks/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSflightpacks"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSflightpacks"), T("/datum/controller/subsystem/processing/flightpacks")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSflightpacks")]);
		}
		rt.setGl("SSflightpacks", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/processing/flightpacks/proc/Initialize  (code/controllers/subsystem/processing/flightpacks.dm:11)
rt.def("/datum/controller/subsystem/processing/flightpacks/proc/Initialize", function Initialize(f: Frame) {
	rt.callSrc(f, "sync_flightsuit_processing", []);
	return f.dot;
});

// /datum/controller/subsystem/processing/flightpacks/proc/vv_edit_var  (code/controllers/subsystem/processing/flightpacks.dm:14)
rt.def("/datum/controller/subsystem/processing/flightpacks/proc/vv_edit_var", function vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if ($0 === "flightsuit_processing") {
		rt.callSrc(f, "sync_flightsuit_processing", []);
	}
	return f.dot;
}, false, { args: ["var_name", "var_value"] });

// /datum/controller/subsystem/processing/flightpacks/proc/sync_flightsuit_processing  (code/controllers/subsystem/processing/flightpacks.dm:20)
rt.def("/datum/controller/subsystem/processing/flightpacks/proc/sync_flightsuit_processing", function sync_flightsuit_processing(f: Frame) {
	let FP: Value = null;
	let $e: any;
	f.vars = () => [FP, $e];
	FP = null;
	rt.forList(f, 0, rt.sv(f, "processing"), T("/obj/item/device/flightpack"));
	while (($e = rt.next(f, 0)) !== undefined) {
		FP = $e;
		rt.callName(f, live(FP), "sync_processing", [live(f.src)]);
	}
	rt.endFor(f, 0);
	if (isEqual(rt.sv(f, "flightsuit_processing"), 0)) {
		rt.setSv(f, "can_fire", 0);
	} else {
		rt.setSv(f, "can_fire", 1);
	}
	return f.dot;
});
