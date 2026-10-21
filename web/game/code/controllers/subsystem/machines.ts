// From code/controllers/subsystem/machines.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(27, "/datum/controller/subsystem/machines", "/datum/controller/subsystem", {
	processing: null,
	currentrun: null,
	powernets: null,
	name: "Machines",
	init_order: 9,
	flags: 32,
});

// /datum/controller/subsystem/machines/proc/New  (code/controllers/subsystem/machines.dm:1)  may sleep
rt.def("/datum/controller/subsystem/machines/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSmachines"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSmachines"), T("/datum/controller/subsystem/machines")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSmachines")]);
		}
		rt.setGl("SSmachines", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/machines/proc/<init>  (code/controllers/subsystem/machines.dm:5)
rt.def("/datum/controller/subsystem/machines/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "processing", rt.list());
	$0 = $0;
	rt.setSv(f, "currentrun", rt.list());
	$0 = $0;
	rt.setSv(f, "powernets", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/machines/proc/Initialize  (code/controllers/subsystem/machines.dm:10)  may sleep
rt.def("/datum/controller/subsystem/machines/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.srcCall(f, "makepowernets");
	yield* g.srcCall(f, "fire");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/controller/subsystem/machines/proc/makepowernets  (code/controllers/subsystem/machines.dm:15)  may sleep
rt.def("/datum/controller/subsystem/machines/proc/makepowernets", function* makepowernets(f: Frame) {
	let PN: Value = null, PC: Value = null, NewPN: Value = null;
	let $e: any;
	f.vars = () => [PN, PC, NewPN, $e];
	PN = null;
	rt.forList(f, 0, rt.sv(f, "powernets"), T("/datum/powernet"));
	while (($e = rt.next(f, 0)) !== undefined) {
		PN = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(PN)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "powernets"), "Cut", []);
	PC = null;
	rt.forList(f, 0, rt.gl("cable_list"), T("/obj/structure/cable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		PC = $e;
		if (!truthy(rt.fv(f, "powernet", live(PC)))) {
			yield* g.callName(f, (NewPN = (yield* g.new_(f, T("/datum/powernet"), []))), "add_cable", [live(PC)]);
			yield* g.call(f, P("/proc/propagate_network"), null, [live(PC), rt.fv(f, "powernet", live(PC))]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/machines/proc/stat_entry  (code/controllers/subsystem/machines.dm:26)  may sleep
rt.def("/datum/controller/subsystem/machines/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* g.callSuper(f, [fmt("M:＀|PN:＀", [rt.len(f, rt.sv(f, "processing")), rt.len(f, rt.sv(f, "powernets"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/machines/proc/fire  (code/controllers/subsystem/machines.dm:30)
rt.def("/datum/controller/subsystem/machines/proc/fire", function fire(f: Frame, resumed: Value) {
	let Powernet: Value = null, currentrun: Value = null, seconds: Value = null, thing: Value = null;
	let $0: any, $e: any;
	f.vars = () => [resumed, Powernet, currentrun, seconds, thing, $0, $e];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		Powernet = null;
		rt.forList(f, 0, rt.sv(f, "powernets"), T("/datum/powernet"));
		while (($e = rt.next(f, 0)) !== undefined) {
			Powernet = $e;
			rt.callName(f, live(Powernet), "reset", []);
		}
		rt.endFor(f, 0);
		rt.setFv(f, "currentrun", live(f.src), rt.callName(f, rt.sv(f, "processing"), "Copy", []));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	seconds = multiply(rt.sv(f, "wait"), 0.10000000149011612);
	while (truthy(rt.len(f, live(currentrun)))) {
		thing = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		if ((truthy(live(thing)) && !isEqual(rt.callName(f, live(thing), "process", [live(seconds)]), 26))) {
			if (truthy(rt.fv(f, "use_power", live(thing)))) {
				rt.callName(f, live(thing), "auto_use_power", []);
			}
		} else {
			(rt.modSrcVar(f, "processing", live(thing), subtract));
			if (truthy(live(thing))) {
				rt.setFv(f, "isprocessing", live(thing), 0);
			}
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

// /datum/controller/subsystem/machines/proc/setup_template_powernets  (code/controllers/subsystem/machines.dm:53)  may sleep
rt.def("/datum/controller/subsystem/machines/proc/setup_template_powernets", function* setup_template_powernets(f: Frame, cables: Value) {
	let A: Value = null, PC: Value = null, NewPN: Value = null;
	let $e: any;
	f.vars = () => [cables, A, PC, NewPN, $e];
	A = null;
	rt.forList(f, 0, live(cables));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (!truthy(rt.gv(f, "powernet", (PC = live(A))))) {
			yield* g.callName(f, (NewPN = (yield* g.new_(f, T("/datum/powernet"), []))), "add_cable", [live(PC)]);
			yield* g.call(f, P("/proc/propagate_network"), null, [live(PC), rt.fv(f, "powernet", live(PC))]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/machines/proc/Recover  (code/controllers/subsystem/machines.dm:61)
rt.def("/datum/controller/subsystem/machines/proc/Recover", function Recover(f: Frame) {
	if (truthy((rt.istype(rt.fv(f, "processing", rt.gl("SSmachines")), T("/list")) ? 1 : 0))) {
		rt.setSv(f, "processing", rt.fv(f, "processing", rt.gl("SSmachines")));
	}
	if (!truthy((rt.istype(rt.fv(f, "powernets", rt.gl("SSmachines")), T("/list")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "powernets", rt.fv(f, "powernets", rt.gl("SSmachines")));
	return f.dot;
});
