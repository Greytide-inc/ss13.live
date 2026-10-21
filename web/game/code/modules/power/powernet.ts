// From code/modules/power/powernet.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4177, "/datum/powernet", "/datum", {
	number: null,
	cables: null,
	nodes: null,
	load: 0,
	newavail: 0,
	avail: 0,
	viewavail: 0,
	viewload: 0,
	netexcess: 0,
});

// /datum/powernet/proc/<init>  (code/modules/power/powernet.dm:7)
rt.def("/datum/powernet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cables", rt.list());
	$0 = $0;
	rt.setSv(f, "nodes", rt.list());
	return f.dot;
});

// /datum/powernet/proc/Destroy  (code/modules/power/powernet.dm:22)  may sleep
rt.def("/datum/powernet/proc/Destroy", function* Destroy(f: Frame) {
	let C: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [C, M, $e];
	C = null;
	rt.forList(f, 0, rt.sv(f, "cables"), T("/obj/structure/cable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		(rt.modSrcVar(f, "cables", live(C), subtract));
		rt.setFv(f, "powernet", live(C), null);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "nodes"), T("/obj/machinery/power"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		(rt.modSrcVar(f, "nodes", live(M), subtract));
		rt.setFv(f, "powernet", live(M), null);
	}
	rt.endFor(f, 0);
	(rt.modField(f, rt.gl("SSmachines"), "powernets", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/powernet/proc/is_empty  (code/modules/power/powernet.dm:33)
rt.def("/datum/powernet/proc/is_empty", function is_empty(f: Frame) {
	return ((!truthy(rt.len(f, rt.sv(f, "cables"))) ? 1 : 0) && (!truthy(rt.len(f, rt.sv(f, "nodes"))) ? 1 : 0));
});

// /datum/powernet/proc/remove_cable  (code/modules/power/powernet.dm:39)  may sleep
rt.def("/datum/powernet/proc/remove_cable", function* remove_cable(f: Frame, C: Value) {
	f.vars = () => [C];
	(rt.modSrcVar(f, "cables", live(C), subtract));
	rt.setFv(f, "powernet", live(C), null);
	if (!truthy((yield* g.srcCall(f, "is_empty")))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /datum/powernet/proc/add_cable  (code/modules/power/powernet.dm:47)  may sleep
rt.def("/datum/powernet/proc/add_cable", function* add_cable(f: Frame, C: Value) {
	f.vars = () => [C];
	if (truthy(rt.fv(f, "powernet", live(C)))) {
		if (isEqual(rt.fv(f, "powernet", live(C)), live(f.src))) {
			return live(f.dot);
		} else {
			yield* g.callName(f, rt.fv(f, "powernet", live(C)), "remove_cable", [live(C)]);
		}
	}
	rt.setFv(f, "powernet", live(C), live(f.src));
	rt.modSrcVar(f, "cables", live(C), add);
	return f.dot;
}, true);

// /datum/powernet/proc/remove_machine  (code/modules/power/powernet.dm:59)  may sleep
rt.def("/datum/powernet/proc/remove_machine", function* remove_machine(f: Frame, M: Value) {
	f.vars = () => [M];
	(rt.modSrcVar(f, "nodes", live(M), subtract));
	rt.setFv(f, "powernet", live(M), null);
	if (!truthy((yield* g.srcCall(f, "is_empty")))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /datum/powernet/proc/add_machine  (code/modules/power/powernet.dm:68)  may sleep
rt.def("/datum/powernet/proc/add_machine", function* add_machine(f: Frame, M: Value) {
	f.vars = () => [M];
	if (truthy(rt.fv(f, "powernet", live(M)))) {
		if (isEqual(rt.fv(f, "powernet", live(M)), live(f.src))) {
			return live(f.dot);
		} else {
			yield* g.callName(f, live(M), "disconnect_from_network", []);
		}
	}
	rt.setFv(f, "powernet", live(M), live(f.src));
	rt.setAt(rt.sv(f, "nodes"), live(M), live(M));
	return f.dot;
}, true);

// /datum/powernet/proc/reset  (code/modules/power/powernet.dm:80)
rt.def("/datum/powernet/proc/reset", function reset(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	rt.setSv(f, "netexcess", subtract(rt.sv(f, "avail"), rt.sv(f, "load")));
	if (((rt.gt(rt.sv(f, "netexcess"), 100) && truthy(rt.sv(f, "nodes"))) && truthy(rt.len(f, rt.sv(f, "nodes"))))) {
		S = null;
		rt.forList(f, 0, rt.sv(f, "nodes"), T("/obj/machinery/power/smes"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			rt.callName(f, live(S), "restore", []);
		}
		rt.endFor(f, 0);
	}
	rt.setSv(f, "viewavail", rt.call(f, P("/proc/round"), null, [add(multiply(0.800000011920929, rt.sv(f, "viewavail")), multiply(0.20000000298023224, rt.sv(f, "avail")))]));
	rt.setSv(f, "viewload", rt.call(f, P("/proc/round"), null, [add(multiply(0.800000011920929, rt.sv(f, "viewload")), multiply(0.20000000298023224, rt.sv(f, "load")))]));
	rt.setSv(f, "load", 0);
	rt.setSv(f, "avail", rt.sv(f, "newavail"));
	rt.setSv(f, "newavail", 0);
	return f.dot;
});

// /datum/powernet/proc/get_electrocute_damage  (code/modules/power/powernet.dm:96)
rt.def("/datum/powernet/proc/get_electrocute_damage", function get_electrocute_damage(f: Frame) {
	if (rt.ge(rt.sv(f, "avail"), 1000)) {
		return add(rt.call(f, P("/proc/max"), null, [10, rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/round"), null, [divide(rt.sv(f, "avail"), 10000)]), 90])]), rt.call(f, P("/proc/rand"), null, [-5, 5]));
	}
	return 0;
});
