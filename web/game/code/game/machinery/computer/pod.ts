// From code/game/machinery/computer/pod.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10402, "/obj/machinery/computer/pod", "/obj/machinery/computer", {
	connected: null,
	title: "Mass Driver Controls",
	id: 1,
	timing: 0,
	time: 30,
	range: 4,
	name: "mass driver launch control",
	desc: "A combined blastdoor and mass driver control unit.",
});

// /obj/machinery/computer/pod/proc/Initialize  (code/game/machinery/computer/pod.dm:13)  may sleep
rt.def("/obj/machinery/computer/pod/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "range"), live(f.src)])), T("/obj/machinery/mass_driver"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "id", live(M)), rt.sv(f, "id"))) {
			rt.setSv(f, "connected", live(M));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/computer/pod/proc/alarm  (code/game/machinery/computer/pod.dm:20)  may sleep
rt.def("/obj/machinery/computer/pod/proc/alarm", function* alarm(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "connected"))) {
		rt.op(f, "Output", [], [(yield* g.call(f, P("/proc/viewers"), null, [null, null])), "Cannot locate mass driver connector. Cancelling firing sequence!"], false);
		return live(f.dot);
	}
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "range"), live(f.src)])), T("/obj/machinery/door/poddoor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "id", live(M)), rt.sv(f, "id"))) {
			yield* g.callName(f, live(M), "open", []);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "range"), live(f.src)])), T("/obj/machinery/mass_driver"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "id", live(M)), rt.sv(f, "id"))) {
			rt.setFv(f, "power", live(M), rt.fv(f, "power", rt.sv(f, "connected")));
			yield* g.callName(f, live(M), "drive", []);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "range"), live(f.src)])), T("/obj/machinery/door/poddoor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "id", live(M)), rt.sv(f, "id"))) {
			yield* g.callName(f, live(M), "close", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/computer/pod/proc/attack_hand  (code/game/machinery/computer/pod.dm:43)  may sleep
rt.def("/obj/machinery/computer/pod/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, d2: Value = null, second: Value = null, minute: Value = null, temp: Value = null, L: Value = null, t: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [dat, d2, second, minute, temp, L, t, popup, $0, $1, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	dat = "";
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	if (truthy(rt.sv(f, "connected"))) {
		d2 = null;
		if (truthy(rt.sv(f, "timing"))) {
			d2 = fmt("<A href='?src=＃;time=0'>Stop Time Launch</A>", [live(f.src)]);
		} else {
			d2 = fmt("<A href='?src=＃;time=1'>Initiate Time Launch</A>", [live(f.src)]);
		}
		second = rt.modulus(rt.sv(f, "time"), 60);
		minute = divide(subtract(rt.sv(f, "time"), live(second)), 60);
		$0 = live(d2);
		if (truthy(live(minute))) {
			$1 = fmt("＀:", [live(minute)]);
		} else {
			$1 = null;
		}
		dat = rt.modify(live(dat), fmt("<HR>\nTimer System: ＀\nTime Left: ＀＀ <A href='?src=＃;tp=-30'>-</A> <A href='?src=＃;tp=-1'>-</A> <A href='?src=＃;tp=1'>+</A> <A href='?src=＃;tp=30'>+</A>", [$0, $1, live(second), live(f.src), live(f.src), live(f.src), live(f.src)]), add);
		temp = "";
		L = rt.list(0.25, 0.5, 1, 2, 4, 8, 16);
		t = null;
		rt.forList(f, 0, live(L));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			if (isEqual(live(t), rt.fv(f, "power", rt.sv(f, "connected")))) {
				temp = rt.modify(live(temp), fmt("＀ ", [live(t)]), add);
			} else {
				temp = rt.modify(live(temp), fmt("<A href = '?src=＃;power=＀'>＀</A> ", [live(f.src), live(t), live(t)]), add);
			}
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), fmt("<HR>\nPower Level: ＀<BR>\n<A href = '?src=＃;alarm=1'>Firing Sequence</A><BR>\n<A href = '?src=＃;drive=1'>Test Fire Driver</A><BR>\n<A href = '?src=＃;door=1'>Toggle Outer Door</A><BR>", [live(temp), live(f.src), live(f.src), live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), fmt("<BR>\n<A href = '?src=＃;door=1'>Toggle Outer Door</A><BR>", [live(f.src)]), add);
	}
	dat = rt.modify(live(dat), fmt("<BR><BR><A href='?src=＃;mach_close=computer'>Close</A>", [live(f.args[0])]), add);
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "computer", rt.sv(f, "title"), 400, 500]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.sv(f, "icon"), rt.sv(f, "icon_state")]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/pod/proc/process  (code/game/machinery/computer/pod.dm:76)  may sleep
rt.def("/obj/machinery/computer/pod/proc/process", function* process(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "timing"))) return f.dot;
	if (rt.gt(rt.sv(f, "time"), 0)) {
		rt.setSv(f, "time", subtract((yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "time")])), 1));
	} else {
		yield* g.srcCall(f, "alarm");
		rt.setSv(f, "time", 0);
		rt.setSv(f, "timing", 0);
	}
	yield* g.srcCall(f, "updateDialog");
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/computer/pod/proc/Topic  (code/game/machinery/computer/pod.dm:89)  may sleep
rt.def("/obj/machinery/computer/pod/proc/Topic", function* Topic(f: Frame) {
	let t: Value = null, tp: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [t, tp, M, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!((truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)]))) || (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.at(live(f.args[1]), "power"))) {
		t = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "power")]));
		t = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [0.25, live(t)])), 16]));
		if (truthy(rt.sv(f, "connected"))) {
			rt.setFv(f, "power", rt.sv(f, "connected"), live(t));
		}
	}
	if (truthy(rt.at(live(f.args[1]), "alarm"))) {
		yield* g.srcCall(f, "alarm");
	}
	if (truthy(rt.at(live(f.args[1]), "time"))) {
		rt.setSv(f, "timing", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "time")])));
	}
	if (truthy(rt.at(live(f.args[1]), "tp"))) {
		rt.setSv(f, "time", (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [(rt.modSrcVar(f, "time", (tp = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "tp")]))), add))])), 0])), 120])));
	}
	if (truthy(rt.at(live(f.args[1]), "door"))) {
		M = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "range"), live(f.src)])), T("/obj/machinery/door/poddoor"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (isEqual(rt.fv(f, "id", live(M)), rt.sv(f, "id"))) {
				if (truthy(rt.fv(f, "density", live(M)))) {
					yield* g.callName(f, live(M), "open", []);
				} else {
					yield* g.callName(f, live(M), "close", []);
				}
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.at(live(f.args[1]), "drive"))) {
		M = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "range"), live(f.src)])), T("/obj/machinery/mass_driver"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (isEqual(rt.fv(f, "id", live(M)), rt.sv(f, "id"))) {
				rt.setFv(f, "power", live(M), rt.fv(f, "power", rt.sv(f, "connected")));
				yield* g.callName(f, live(M), "drive", []);
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

rt.type(10404, "/obj/machinery/computer/pod/old/syndicate", "/obj/machinery/computer/pod/old", {
	title: "External Airlock Controls",
	name: "１ProComp Executive IIc",
	desc: "The Syndicate operate on a tight budget. Operates external airlocks.",
	req_access: null,
});

// /obj/machinery/computer/pod/old/syndicate/proc/<init>  (code/game/machinery/computer/pod.dm:133)
rt.def("/obj/machinery/computer/pod/old/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(150));
	return f.dot;
});

// /obj/machinery/computer/pod/old/syndicate/proc/attack_hand  (code/game/machinery/computer/pod.dm:136)  may sleep
rt.def("/obj/machinery/computer/pod/old/syndicate/proc/attack_hand", function* attack_hand(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "allowed", live(f.args[0]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Access denied.</span>"]);
		return live(f.dot);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });
