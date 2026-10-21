// From code/datums/wires/airalarm.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1059, "/datum/wires/airalarm", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/airalarm"),
	proper_name: "Air Alarm",
});

// /datum/wires/airalarm/proc/New  (code/datums/wires/airalarm.dm:11)
rt.def("/datum/wires/airalarm/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("Power", "ID Scan", "AI Connection", "Panic Siphon", "Alarm"));
	rt.callSrc(f, "add_duds", [3]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/airalarm/proc/interactable  (code/datums/wires/airalarm.dm:15)
rt.def("/datum/wires/airalarm/proc/interactable", function interactable(f: Frame, user: Value) {
	let A: Value = null;
	f.vars = () => [A];
	if (!(truthy(rt.gv(f, "panel_open", (A = rt.sv(f, "holder")))) && isEqual(rt.fv(f, "buildstage", live(A)), 2))) return f.dot;
	return 1;
});

// /datum/wires/airalarm/proc/get_status  (code/datums/wires/airalarm.dm:20)
rt.def("/datum/wires/airalarm/proc/get_status", function get_status(f: Frame) {
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

// /datum/wires/airalarm/proc/on_pulse  (code/datums/wires/airalarm.dm:28)  may sleep
rt.def("/datum/wires/airalarm/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let A: Value = null, AA: Value = null;
	let $0: any;
	f.vars = () => [wire, A, AA, $0];
	A = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Power") {
		if (!truthy(rt.fv(f, "shorted", live(A)))) {
			rt.setFv(f, "shorted", live(A), 1);
			yield* g.callName(f, live(A), "update_icon", []);
		}
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(A), P("/obj/machinery/airalarm/proc/reset"), live(wire)])), 1200]);
	} else if ($0 === "ID Scan") {
		rt.setFv(f, "locked", live(A), (!truthy(rt.fv(f, "locked", live(A))) ? 1 : 0));
	} else if ($0 === "AI Connection") {
		if (!truthy(rt.fv(f, "aidisabled", live(A)))) {
			rt.setFv(f, "aidisabled", live(A), 1);
		}
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(A), P("/obj/machinery/airalarm/proc/reset"), live(wire)])), 100]);
	} else if ($0 === "Panic Siphon") {
		if (!truthy(rt.fv(f, "shorted", live(A)))) {
			if (isEqual(rt.fv(f, "mode", live(A)), 1)) {
				rt.setFv(f, "mode", live(A), 3);
			} else {
				rt.setFv(f, "mode", live(A), 1);
			}
			yield* g.callName(f, live(A), "apply_mode", []);
		}
	} else if ($0 === "Alarm") {
		if (truthy((yield* g.callName(f, (AA = (yield* g.call(f, P("/proc/get_area"), null, [live(A)]))), "atmosalert", [0, rt.sv(f, "holder")])))) {
			yield* g.callName(f, live(A), "post_alert", [0]);
		}
		yield* g.callName(f, live(A), "update_icon", []);
	}
	return f.dot;
}, true);

// /datum/wires/airalarm/proc/on_cut  (code/datums/wires/airalarm.dm:55)  may sleep
rt.def("/datum/wires/airalarm/proc/on_cut", function* on_cut(f: Frame, wire: Value, mend: Value) {
	let A: Value = null, AA: Value = null;
	let $0: any;
	f.vars = () => [wire, mend, A, AA, $0];
	A = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Power") {
		yield* g.callName(f, live(A), "shock", [live(f.usr), 50]);
		rt.setFv(f, "shorted", live(A), (!truthy(live(mend)) ? 1 : 0));
		yield* g.callName(f, live(A), "update_icon", []);
	} else if ($0 === "ID Scan") {
		if (!truthy(live(mend))) {
			rt.setFv(f, "locked", live(A), 1);
		}
	} else if ($0 === "AI Connection") {
		rt.setFv(f, "aidisabled", live(A), live(mend));
	} else if ($0 === "Panic Siphon") {
		if ((!truthy(live(mend)) && !truthy(rt.fv(f, "shorted", live(A))))) {
			rt.setFv(f, "mode", live(A), 3);
			yield* g.callName(f, live(A), "apply_mode", []);
		}
	} else if ($0 === "Alarm") {
		if (truthy((yield* g.callName(f, (AA = (yield* g.call(f, P("/proc/get_area"), null, [live(A)]))), "atmosalert", [2, rt.sv(f, "holder")])))) {
			yield* g.callName(f, live(A), "post_alert", [2]);
		}
		yield* g.callName(f, live(A), "update_icon", []);
	}
	return f.dot;
}, true);
