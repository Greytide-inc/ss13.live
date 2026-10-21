// From code/datums/wires/apc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1062, "/datum/wires/apc", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/power/apc"),
	proper_name: "APC",
});

// /datum/wires/apc/proc/New  (code/datums/wires/apc.dm:10)
rt.def("/datum/wires/apc/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("Main Power 1", "Main Power 2", "ID Scan", "AI Connection"));
	rt.callSrc(f, "add_duds", [6]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/apc/proc/interactable  (code/datums/wires/apc.dm:14)
rt.def("/datum/wires/apc/proc/interactable", function interactable(f: Frame, user: Value) {
	let A: Value = null;
	f.vars = () => [A];
	if (!(truthy(rt.gv(f, "panel_open", (A = rt.sv(f, "holder")))) && !truthy(rt.fv(f, "opened", live(A))))) return f.dot;
	return 1;
});

// /datum/wires/apc/proc/get_status  (code/datums/wires/apc.dm:19)
rt.def("/datum/wires/apc/proc/get_status", function get_status(f: Frame) {
	let A: Value = null, status: Value = null;
	let $0: any;
	f.vars = () => [A, status, $0];
	A = rt.sv(f, "holder");
	status = rt.list();
	if (truthy(rt.fv(f, "locked", live(A)))) {
		$0 = "red";
	} else {
		$0 = "green";
	}
	status = rt.modify(live(status), fmt("The interface light is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "shorted", live(A)))) {
		$0 = "lit";
	} else {
		$0 = "off";
	}
	status = rt.modify(live(status), fmt("The short indicator is ＀.", [$0]), add);
	if (!truthy(rt.fv(f, "aidisabled", live(A)))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	return (status = rt.modify(live(status), fmt("The AI connection light is ＀.", [$0]), add));
});

// /datum/wires/apc/proc/on_pulse  (code/datums/wires/apc.dm:27)  may sleep
rt.def("/datum/wires/apc/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [wire, A, $0];
	A = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Main Power 1" || $0 === "Main Power 2") {
		if (!truthy(rt.fv(f, "shorted", live(A)))) {
			rt.setFv(f, "shorted", live(A), 1);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(A), P("/obj/machinery/power/apc/proc/reset"), live(wire)])), 1200]);
		}
	} else if ($0 === "ID Scan") {
		rt.setFv(f, "locked", live(A), 0);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(A), P("/obj/machinery/power/apc/proc/reset"), live(wire)])), 300]);
	} else if ($0 === "AI Connection") {
		if (truthy(rt.fv(f, "aidisabled", live(A)))) return f.dot;
		rt.setFv(f, "aidisabled", live(A), 1);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(A), P("/obj/machinery/power/apc/proc/reset"), live(wire)])), 10]);
	}
	return f.dot;
}, true);

// /datum/wires/apc/proc/on_cut  (code/datums/wires/apc.dm:42)  may sleep
rt.def("/datum/wires/apc/proc/on_cut", function* on_cut(f: Frame, index: Value, mend: Value) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [index, mend, A, $0];
	A = rt.sv(f, "holder");
	$0 = live(index);
	if ($0 === "Main Power 1" || $0 === "Main Power 2") {
		if (((truthy(live(mend)) && !truthy((yield* g.srcCall(f, "is_cut", "Main Power 1")))) && !truthy((yield* g.srcCall(f, "is_cut", "Main Power 2"))))) {
			rt.setFv(f, "shorted", live(A), 0);
			yield* g.callName(f, live(A), "shock", [live(f.usr), 50]);
		} else {
			rt.setFv(f, "shorted", live(A), 1);
			yield* g.callName(f, live(A), "shock", [live(f.usr), 50]);
		}
	} else if ($0 === "AI Connection") {
		if (truthy(live(mend))) {
			rt.setFv(f, "aidisabled", live(A), 0);
		} else {
			rt.setFv(f, "aidisabled", live(A), 1);
		}
	}
	return f.dot;
}, true);
