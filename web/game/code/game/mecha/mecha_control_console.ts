// From code/game/mecha/mecha_control_console.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10418, "/obj/machinery/computer/mecha", "/obj/machinery/computer", {
	located: null,
	screen: 0,
	stored_data: null,
	icon_screen: "mecha",
	icon_keyboard: "tech_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/mecha_control"),
	name: "exosuit control console",
	desc: "Used to remotely locate or lockdown exosuits.",
	req_access: null,
});

// /obj/machinery/computer/mecha/proc/<init>  (code/game/mecha/mecha_control_console.dm:8)
rt.def("/obj/machinery/computer/mecha/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "located", rt.list());
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(29));
	return f.dot;
});

// /obj/machinery/computer/mecha/proc/attack_hand  (code/game/mecha/mecha_control_console.dm:13)  may sleep
rt.def("/obj/machinery/computer/mecha/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, trackerlist: Value = null, MC: Value = null, TR: Value = null, answer: Value = null;
	let $e: any;
	f.vars = () => [dat, trackerlist, MC, TR, answer, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	dat = fmt("<html><head><title>＀</title><style>h3 {margin: 0px; padding: 0px;}</style></head><body>", [rt.fv(f, "name", live(f.src))]);
	if (isEqual(rt.sv(f, "screen"), 0)) {
		dat = rt.modify(live(dat), "<h3>Tracking beacons data</h3>", add);
		trackerlist = rt.list();
		MC = null;
		rt.forList(f, 0, rt.gl("mechas_list"), T("/obj/mecha"));
		while (($e = rt.next(f, 0)) !== undefined) {
			MC = $e;
			trackerlist = rt.modify(live(trackerlist), rt.fv(f, "trackers", live(MC)), add);
		}
		rt.endFor(f, 0);
		TR = null;
		rt.forList(f, 0, live(trackerlist), T("/obj/item/mecha_parts/mecha_tracking"));
		while (($e = rt.next(f, 0)) !== undefined) {
			TR = $e;
			if (truthy((answer = (yield* g.callName(f, live(TR), "get_mecha_info", []))))) {
				dat = rt.modify(live(dat), fmt("<hr>＀<br/>\n\t\t\t\t\t\t  <a href='?src=＃;send_message=＃'>Send message</a><br/>\n\t\t\t\t\t\t  <a href='?src=＃;get_log=＃'>Show exosuit log</a> | <a style='color: #f00;' href='?src=＃;shock=＃'>(EMP pulse)</a><br>", [live(answer), live(f.src), live(TR), live(f.src), live(TR), live(f.src), live(TR)]), add);
			}
		}
		rt.endFor(f, 0);
	}
	if (isEqual(rt.sv(f, "screen"), 1)) {
		dat = rt.modify(live(dat), "<h3>Log contents</h3>", add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;return=1'>Return</a><hr>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("＀", [rt.sv(f, "stored_data")]), add);
	}
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;refresh=1'>(Refresh)</A><BR>", [live(f.src)]), add);
	dat = rt.modify(live(dat), "</body></html>", add);
	rt.op(f, "Browse", [], [live(f.args[0]), live(dat), "window=computer;size=400x500"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(f.args[0]), "computer"]);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/computer/mecha/proc/Topic  (code/game/mecha/mecha_control_console.dm:42)  may sleep
rt.def("/obj/machinery/computer/mecha/proc/Topic", function* Topic(f: Frame) {
	let filter: Value = null, MT: Value = null, message: Value = null, M: Value = null;
	f.vars = () => [filter, MT, message, M];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	filter = (yield* g.new_(f, T("/datum/topic_input"), [live(f.args[0]), live(f.args[1])]));
	if (truthy(rt.at(live(f.args[1]), "send_message"))) {
		MT = (yield* g.callName(f, live(filter), "getObj", ["send_message"]));
		message = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Input message", "Transmit message"]));
		M = (yield* g.callName(f, live(MT), "in_mecha", []));
		if ((truthy((yield* g.call(f, P("/proc/trim"), null, [live(message)]))) && truthy(live(M)))) {
			yield* g.callName(f, live(M), "occupant_message", [live(message)]);
		}
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "shock"))) {
		yield* g.callName(f, (MT = (yield* g.callName(f, live(filter), "getObj", ["shock"]))), "shock", []);
	}
	if (truthy(rt.at(live(f.args[1]), "get_log"))) {
		rt.setSv(f, "stored_data", (yield* g.callName(f, (MT = (yield* g.callName(f, live(filter), "getObj", ["get_log"]))), "get_mecha_log", [])));
		rt.setSv(f, "screen", 1);
	}
	if (truthy(rt.at(live(f.args[1]), "return"))) {
		rt.setSv(f, "screen", 0);
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

rt.type(9557, "/obj/item/mecha_parts/mecha_tracking", "/obj/item/mecha_parts", {
	ai_beacon: 0,
	name: "exosuit tracking beacon",
	desc: "Device used to transmit exosuit data.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "motion2",
	w_class: 2,
	origin_tech: "programming=2;magnets=2",
});

// /obj/item/mecha_parts/mecha_tracking/proc/get_mecha_info  (code/game/mecha/mecha_control_console.dm:74)
rt.def("/obj/item/mecha_parts/mecha_tracking/proc/get_mecha_info", function get_mecha_info(f: Frame) {
	let M: Value = null, cell_charge: Value = null, answer: Value = null, RM: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [M, cell_charge, answer, RM, $0, $1, $2];
	if (!truthy(rt.callSrc(f, "in_mecha", []))) {
		return 0;
	}
	M = rt.fv(f, "loc", live(f.src));
	cell_charge = rt.callName(f, live(M), "get_charge", []);
	$0 = rt.fv(f, "name", live(M));
	$1 = multiply(divide(rt.fv(f, "obj_integrity", live(M)), rt.fv(f, "max_integrity", live(M))), 100);
	if (live(cell_charge) === null) {
		$2 = "Not found";
	} else {
		$2 = fmt("＀%", [rt.callName(f, rt.fv(f, "cell", live(M)), "percent", [])]);
	}
	answer = fmt("<b>Name:</b> ＀\n<b>Integrity:</b> ＀%\n<b>Cell charge:</b> ＀\n<b>Airtank:</b> ＀kPa\n<b>Pilot:</b> ＀\n<b>Location:</b> ＀\n<b>Active equipment:</b> ＀ ", [$0, $1, $2, rt.callName(f, live(M), "return_pressure", []), (rt.fv(f, "occupant", live(M)) || "None"), (rt.call(f, P("/proc/get_area"), null, [live(M)]) || "Unknown"), (rt.fv(f, "selected", live(M)) || "None")]);
	if (truthy((rt.istype(live(M), T("/obj/mecha/working/ripley")) ? 1 : 0))) {
		answer = rt.modify(live(answer), fmt("<b>Used cargo space:</b> ＀%<br>", [multiply(divide(rt.getLen(f, rt.gv(f, "cargo", (RM = live(M)))), rt.fv(f, "cargo_capacity", live(RM))), 100)]), add);
	}
	return live(answer);
});

// /obj/item/mecha_parts/mecha_tracking/proc/emp_act  (code/game/mecha/mecha_control_console.dm:92)  may sleep
rt.def("/obj/item/mecha_parts/mecha_tracking/proc/emp_act", function* emp_act(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_tracking/proc/Destroy  (code/game/mecha/mecha_control_console.dm:95)  may sleep
rt.def("/obj/item/mecha_parts/mecha_tracking/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/mecha")) ? 1 : 0))) {
		M = rt.sv(f, "loc");
		if (truthy((rt.isIn(f, live(f.src), rt.fv(f, "trackers", live(M))) ? 1 : 0))) {
			(rt.modField(f, live(M), "trackers", live(f.src), subtract));
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_tracking/proc/in_mecha  (code/game/mecha/mecha_control_console.dm:102)
rt.def("/obj/item/mecha_parts/mecha_tracking/proc/in_mecha", function in_mecha(f: Frame) {
	if (truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/obj/mecha")) ? 1 : 0))) {
		return rt.fv(f, "loc", live(f.src));
	}
	return 0;
});

// /obj/item/mecha_parts/mecha_tracking/proc/shock  (code/game/mecha/mecha_control_console.dm:107)  may sleep
rt.def("/obj/item/mecha_parts/mecha_tracking/proc/shock", function* shock(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((M = (yield* g.srcCall(f, "in_mecha"))))) {
		yield* g.callName(f, live(M), "emp_act", [2]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_tracking/proc/get_mecha_log  (code/game/mecha/mecha_control_console.dm:113)
rt.def("/obj/item/mecha_parts/mecha_tracking/proc/get_mecha_log", function get_mecha_log(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/obj/mecha")) ? 1 : 0))) {
		return 0;
	}
	return rt.callName(f, (M = rt.fv(f, "loc", live(f.src))), "get_log_html", []);
});

rt.type(5333, "/obj/item/weapon/storage/box/mechabeacons", "/obj/item/weapon/storage/box", {
	name: "exosuit tracking beacons",
});

// /obj/item/weapon/storage/box/mechabeacons/proc/New  (code/game/mecha/mecha_control_console.dm:130)  may sleep
rt.def("/obj/item/weapon/storage/box/mechabeacons/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/mecha_parts/mecha_tracking"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/mecha_parts/mecha_tracking"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/mecha_parts/mecha_tracking"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/mecha_parts/mecha_tracking"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/mecha_parts/mecha_tracking"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/mecha_parts/mecha_tracking"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/mecha_parts/mecha_tracking"), [live(f.src)]);
	return f.dot;
}, true);
