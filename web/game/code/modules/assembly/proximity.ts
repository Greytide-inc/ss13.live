// From code/modules/assembly/proximity.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9379, "/obj/item/device/assembly/prox_sensor", "/obj/item/device/assembly", {
	scanning: 0,
	timing: 0,
	time: 10,
	sensitivity: 1,
	attachable: 1,
	name: "proximity sensor",
	desc: "Used for scanning and alerting when someone enters a certain proximity.",
	icon_state: "prox",
	materials: null,
	origin_tech: "magnets=1;engineering=1",
});

// /obj/item/device/assembly/prox_sensor/proc/<init>  (code/modules/assembly/proximity.dm:5)
rt.def("/obj/item/device/assembly/prox_sensor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 800, "$glass", 200]));
	return f.dot;
});

// /obj/item/device/assembly/prox_sensor/proc/Initialize  (code/modules/assembly/proximity.dm:21)  may sleep
rt.def("/obj/item/device/assembly/prox_sensor/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "proximity_monitor", (yield* g.new_(f, T("/datum/proximity_monitor"), [live(f.src), 0])));
	return f.dot;
}, true);

// /obj/item/device/assembly/prox_sensor/proc/describe  (code/modules/assembly/proximity.dm:26)
rt.def("/obj/item/device/assembly/prox_sensor/proc/describe", function describe(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "timing"))) {
		return "<span class='notice'>The proximity sensor is arming.</span>";
	}
	if (truthy(rt.sv(f, "scanning"))) {
		$0 = "armed";
	} else {
		$0 = "disarmed";
	}
	return fmt("The proximity sensor is ＀.", [$0]);
});

// /obj/item/device/assembly/prox_sensor/proc/activate  (code/modules/assembly/proximity.dm:30)  may sleep
rt.def("/obj/item/device/assembly/prox_sensor/proc/activate", function* activate(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	rt.setSv(f, "timing", (!truthy(rt.sv(f, "timing")) ? 1 : 0));
	yield* g.srcCall(f, "update_icon");
	return 1;
}, true);

// /obj/item/device/assembly/prox_sensor/proc/toggle_secure  (code/modules/assembly/proximity.dm:37)  may sleep
rt.def("/obj/item/device/assembly/prox_sensor/proc/toggle_secure", function* toggle_secure(f: Frame) {
	rt.setSv(f, "secured", (!truthy(rt.sv(f, "secured")) ? 1 : 0));
	if (!truthy(rt.sv(f, "secured"))) {
		if (truthy(rt.sv(f, "scanning"))) {
			yield* g.srcCall(f, "toggle_scan");
			rt.setFv(f, "host", rt.sv(f, "proximity_monitor"), live(f.src));
		}
		rt.setSv(f, "timing", 0);
	} else {
		rt.setFv(f, "host", rt.sv(f, "proximity_monitor"), rt.sv(f, "loc"));
	}
	yield* g.srcCall(f, "update_icon");
	return rt.sv(f, "secured");
}, true);

// /obj/item/device/assembly/prox_sensor/proc/HasProximity  (code/modules/assembly/proximity.dm:50)  may sleep
rt.def("/obj/item/device/assembly/prox_sensor/proc/HasProximity", function* HasProximity(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (truthy((rt.istype(live(AM), T("/obj/effect/beam")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "sense");
	return f.dot;
}, true);

// /obj/item/device/assembly/prox_sensor/proc/sense  empty
rt.def("/obj/item/device/assembly/prox_sensor/proc/sense");

// /obj/item/device/assembly/prox_sensor/proc/sense  (code/modules/assembly/proximity.dm:56)  may sleep
rt.def("/obj/item/device/assembly/prox_sensor/proc/sense", function* sense(f: Frame) {
	if ((!truthy(rt.sv(f, "secured")) || rt.gt(rt.sv(f, "next_activate"), rt.worldTime(f)))) {
		return 0;
	}
	yield* g.srcCall(f, "pulse", 0);
	yield* g.srcCall(f, "audible_message", fmt("＀ *beep* *beep*", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))]), null, 3);
	rt.setSv(f, "next_activate", add(rt.worldTime(f), 30));
	return f.dot;
}, true);

// /obj/item/device/assembly/prox_sensor/proc/process  (code/modules/assembly/proximity.dm:65)  may sleep
rt.def("/obj/item/device/assembly/prox_sensor/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "timing"))) return f.dot;
	rt.incSrcVar(f, "time", -1, true);
	if (!rt.le(rt.sv(f, "time"), 0)) return f.dot;
	rt.setSv(f, "timing", 0);
	yield* g.srcCall(f, "toggle_scan", 1);
	rt.setSv(f, "time", rt.initial(f, live(f.src), "time"));
	return f.dot;
}, true, { waitfor: false });

// /obj/item/device/assembly/prox_sensor/proc/toggle_scan  empty
rt.def("/obj/item/device/assembly/prox_sensor/proc/toggle_scan");

// /obj/item/device/assembly/prox_sensor/proc/toggle_scan  (code/modules/assembly/proximity.dm:72)  may sleep
rt.def("/obj/item/device/assembly/prox_sensor/proc/toggle_scan", function* toggle_scan(f: Frame, scan: Value) {
	let $0: any, $1: any;
	f.vars = () => [scan, $0, $1];
	if (!truthy(rt.sv(f, "secured"))) {
		return 0;
	}
	rt.setSv(f, "scanning", live(scan));
	$0 = rt.sv(f, "proximity_monitor");
	if (truthy(rt.sv(f, "scanning"))) {
		$1 = rt.sv(f, "sensitivity");
	} else {
		$1 = 0;
	}
	yield* g.callName(f, $0, "SetRange", [$1]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/assembly/prox_sensor/proc/sensitivity_change  (code/modules/assembly/proximity.dm:79)  may sleep
rt.def("/obj/item/device/assembly/prox_sensor/proc/sensitivity_change", function* sensitivity_change(f: Frame, value: Value) {
	let sense: Value = null;
	f.vars = () => [value, sense];
	rt.setSv(f, "sensitivity", (sense = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [add(rt.sv(f, "sensitivity"), live(value)), 0])), 5]))));
	if (!(truthy(rt.sv(f, "scanning")) && truthy((yield* g.callName(f, rt.sv(f, "proximity_monitor"), "SetRange", [live(sense)]))))) return f.dot;
	yield* g.srcCall(f, "sense");
	return f.dot;
}, true);

// /obj/item/device/assembly/prox_sensor/proc/update_icon  (code/modules/assembly/proximity.dm:85)  may sleep
rt.def("/obj/item/device/assembly/prox_sensor/proc/update_icon", function* update_icon(f: Frame) {
	yield* g.srcCall(f, "cut_overlays");
	rt.setSv(f, "attached_overlays", rt.list());
	if (truthy(rt.sv(f, "timing"))) {
		yield* g.srcCall(f, "add_overlay", "prox_timing");
		rt.modSrcVar(f, "attached_overlays", "prox_timing", add);
	}
	if (truthy(rt.sv(f, "scanning"))) {
		yield* g.srcCall(f, "add_overlay", "prox_scanning");
		rt.modSrcVar(f, "attached_overlays", "prox_scanning", add);
	}
	if (truthy(rt.sv(f, "holder"))) {
		yield* g.callName(f, rt.sv(f, "holder"), "update_icon", []);
	}
	return live(f.dot);
}, true);

// /obj/item/device/assembly/prox_sensor/proc/interact  (code/modules/assembly/proximity.dm:98)
rt.def("/obj/item/device/assembly/prox_sensor/proc/interact", function interact(f: Frame, user: Value) {
	let second: Value = null, minute: Value = null, dat: Value = null;
	let $0: any, $1: any;
	f.vars = () => [second, minute, dat, $0, $1];
	if (!truthy(rt.callSrc(f, "is_secured", [live(user)]))) return f.dot;
	second = rt.modulus(rt.sv(f, "time"), 60);
	minute = divide(subtract(rt.sv(f, "time"), live(second)), 60);
	if (truthy(rt.sv(f, "timing"))) {
		$0 = fmt("<A href='?src=＃;time=0'>Arming</A>", [live(f.src)]);
	} else {
		$0 = fmt("<A href='?src=＃;time=1'>Not Arming</A>", [live(f.src)]);
	}
	dat = fmt("<TT><B>Proximity Sensor</B>\n＀ ＀:＀\n<A href='?src=＃;tp=-30'>-</A> <A href='?src=＃;tp=-1'>-</A> <A href='?src=＃;tp=1'>+</A> <A href='?src=＃;tp=30'>+</A>\n</TT>", [$0, live(minute), live(second), live(f.src), live(f.src), live(f.src), live(f.src)]);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "scanning"))) {
		$1 = "0'>Armed";
	} else {
		$1 = "1'>Unarmed";
	}
	dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;scanning=＀</A> (Movement sensor active when armed!)", [$0, $1]), add);
	dat = rt.modify(live(dat), fmt("<BR>Detection range: <A href='?src=＃;sense=down'>-</A> ＀ <A href='?src=＃;sense=up'>+</A>", [live(f.src), rt.sv(f, "sensitivity"), live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<BR><BR><A href='?src=＃;refresh=1'>Refresh</A>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<BR><BR><A href='?src=＃;close=1'>Close</A>", [live(f.src)]), add);
	rt.op(f, "Browse", [], [live(user), live(dat), "window=prox"], false);
	rt.call(f, P("/proc/onclose"), null, [live(user), "prox"]);
	return live(f.dot);
});

// /obj/item/device/assembly/prox_sensor/proc/Topic  (code/modules/assembly/proximity.dm:112)  may sleep
rt.def("/obj/item/device/assembly/prox_sensor/proc/Topic", function* Topic(f: Frame) {
	let tp: Value = null;
	let $0: any;
	f.vars = () => [tp, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy((yield* g.callName(f, live(f.usr), "incapacitated", []))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "loc"), live(f.usr)])), 1))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=prox"], false);
		yield* g.call(f, P("/proc/onclose"), null, [live(f.usr), "prox"]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "sense"))) {
		if (isEqual(rt.at(live(f.args[1]), "sense"), "up")) {
			$0 = 1;
		} else {
			$0 = -1;
		}
		yield* g.srcCall(f, "sensitivity_change", $0);
	}
	if (truthy(rt.at(live(f.args[1]), "scanning"))) {
		yield* g.srcCall(f, "toggle_scan", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "scanning")])));
	}
	if (truthy(rt.at(live(f.args[1]), "time"))) {
		rt.setSv(f, "timing", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "time")])));
		yield* g.srcCall(f, "update_icon");
	}
	if (truthy(rt.at(live(f.args[1]), "tp"))) {
		rt.setSv(f, "time", (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [(rt.modSrcVar(f, "time", (tp = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "tp")]))), add))])), 0])), 600])));
	}
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=prox"], false);
		return live(f.dot);
	}
	if (!truthy(live(f.usr))) return f.dot;
	yield* g.srcCall(f, "attack_self", live(f.usr));
	return f.dot;
}, true, { args: ["href", "href_list"] });
