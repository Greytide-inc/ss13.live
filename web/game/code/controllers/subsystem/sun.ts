// From code/controllers/subsystem/sun.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(43, "/datum/controller/subsystem/sun", "/datum/controller/subsystem", {
	angle: null,
	dx: null,
	dy: null,
	rate: null,
	solars: null,
	name: "Sun",
	wait: 600,
	flags: 9,
});

// /datum/controller/subsystem/sun/proc/New  (code/controllers/subsystem/sun.dm:1)  may sleep
rt.def("/datum/controller/subsystem/sun/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSsun"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSsun"), T("/datum/controller/subsystem/sun")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSsun")]);
		}
		rt.setGl("SSsun", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/sun/proc/<init>  (code/controllers/subsystem/sun.dm:9)
rt.def("/datum/controller/subsystem/sun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "solars", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/sun/proc/PreInit  (code/controllers/subsystem/sun.dm:12)
rt.def("/datum/controller/subsystem/sun/proc/PreInit", function PreInit(f: Frame) {
	rt.setSv(f, "angle", rt.call(f, P("/proc/rand"), null, [0, 360]));
	rt.setSv(f, "rate", divide(rt.call(f, P("/proc/rand"), null, [50, 200]), 100));
	if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
	rt.setSv(f, "rate", rt.neg(rt.sv(f, "rate")));
	return f.dot;
});

// /datum/controller/subsystem/sun/proc/stat_entry  (code/controllers/subsystem/sun.dm:18)  may sleep
rt.def("/datum/controller/subsystem/sun/proc/stat_entry", function* stat_entry(f: Frame, msg: Value) {
	f.vars = () => [msg];
	yield* g.callSuper(f, [fmt("P:＀", [rt.len(f, rt.sv(f, "solars"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/sun/proc/fire  (code/controllers/subsystem/sun.dm:21)  may sleep
rt.def("/datum/controller/subsystem/sun/proc/fire", function* fire(f: Frame) {
	let s: Value = null, c: Value = null, SC: Value = null;
	let $e: any;
	f.vars = () => [s, c, SC, $e];
	rt.setSv(f, "angle", rt.modulus(add(add(360, rt.sv(f, "angle")), multiply(rt.sv(f, "rate"), 6)), 360));
	s = rt.op(f, "Sin", [], [rt.sv(f, "angle")]);
	c = rt.op(f, "Cos", [], [rt.sv(f, "angle")]);
	if (rt.lt(rt.op(f, "Abs", [], [live(s)]), rt.op(f, "Abs", [], [live(c)]))) {
		rt.setSv(f, "dx", divide(live(s), rt.op(f, "Abs", [], [live(c)])));
		rt.setSv(f, "dy", divide(live(c), rt.op(f, "Abs", [], [live(c)])));
	} else {
		rt.setSv(f, "dx", divide(live(s), rt.op(f, "Abs", [], [live(s)])));
		rt.setSv(f, "dy", divide(live(c), rt.op(f, "Abs", [], [live(s)])));
	}
	SC = null;
	rt.forList(f, 0, rt.sv(f, "solars"), T("/obj/machinery/power/solar_control"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SC = $e;
		if (!truthy(rt.fv(f, "powernet", live(SC)))) {
			yield* g.callName(f, rt.sv(f, "solars"), "Remove", [live(SC)]);
			continue;
		}
		yield* g.callName(f, live(SC), "update", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
