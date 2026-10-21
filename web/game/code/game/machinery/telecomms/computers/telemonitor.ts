// From code/game/machinery/telecomms/computers/telemonitor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10416, "/obj/machinery/computer/telecomms/monitor", "/obj/machinery/computer/telecomms", {
	screen: 0,
	machinelist: null,
	SelectedMachine: null,
	network: "NULL",
	temp: "",
	icon_screen: "comm_monitor",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/comm_monitor"),
	name: "telecommunications monitoring console",
});

// /obj/machinery/computer/telecomms/monitor/proc/<init>  (code/game/machinery/telecomms/computers/telemonitor.dm:13)
rt.def("/obj/machinery/computer/telecomms/monitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "machinelist", rt.list());
	return f.dot;
});

// /obj/machinery/computer/telecomms/monitor/proc/attack_hand  (code/game/machinery/telecomms/computers/telemonitor.dm:22)  may sleep
rt.def("/obj/machinery/computer/telecomms/monitor/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, _T: Value = null;
	let $0: any, $e: any;
	f.vars = () => [dat, _T, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	dat = "<TITLE>Telecommunications Monitor</TITLE><center><b>Telecommunications Monitor</b></center>";
	$0 = rt.sv(f, "screen");
	if ($0 === 0) {
		dat = rt.modify(live(dat), fmt("<br>＀<br><br>", [rt.sv(f, "temp")]), add);
		dat = rt.modify(live(dat), fmt("<br>Current Network: <a href='?src=＃;network=1'>＀</a><br>", [live(f.src), rt.sv(f, "network")]), add);
		if (truthy(rt.len(f, rt.sv(f, "machinelist")))) {
			dat = rt.modify(live(dat), "<br>Detected Network Entities:<ul>", add);
			_T = null;
			rt.forList(f, 0, rt.sv(f, "machinelist"), T("/obj/machinery/telecomms"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				dat = rt.modify(live(dat), fmt("<li><a href='?src=＃;viewmachine=＀'>＃ ＀</a> (＀)</li>", [live(f.src), rt.fv(f, "id", live(_T)), live(_T), rt.fv(f, "name", live(_T)), rt.fv(f, "id", live(_T))]), add);
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</ul>", add);
			dat = rt.modify(live(dat), fmt("<br><a href='?src=＃;operation=release'>[Flush Buffer]</a>", [live(f.src)]), add);
		} else {
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;operation=probe'>[Probe Network]</a>", [live(f.src)]), add);
		}
	} else if ($0 === 1) {
		dat = rt.modify(live(dat), fmt("<br>＀<br>", [rt.sv(f, "temp")]), add);
		dat = rt.modify(live(dat), fmt("<center><a href='?src=＃;operation=mainmenu'>[Main Menu]</a></center>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<br>Current Network: ＀<br>", [rt.sv(f, "network")]), add);
		dat = rt.modify(live(dat), fmt("Selected Network Entity: ＀ (＀)<br>", [rt.fv(f, "name", rt.sv(f, "SelectedMachine")), rt.fv(f, "id", rt.sv(f, "SelectedMachine"))]), add);
		dat = rt.modify(live(dat), "Linked Entities: <ol>", add);
		_T = null;
		rt.forList(f, 0, rt.fv(f, "links", rt.sv(f, "SelectedMachine")), T("/obj/machinery/telecomms"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if (!truthy(rt.fv(f, "hide", live(_T)))) {
				dat = rt.modify(live(dat), fmt("<li><a href='?src=＃;viewmachine=＀'>＃ ＀</a> (＀)</li>", [live(f.src), rt.fv(f, "id", live(_T)), rt.fv(f, "id", live(_T)), rt.fv(f, "name", live(_T)), rt.fv(f, "id", live(_T))]), add);
			}
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</ol>", add);
	}
	rt.op(f, "Browse", [], [live(f.args[0]), live(dat), "window=comm_monitor;size=575x400"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(f.args[0]), "server_control"]);
	rt.setSv(f, "temp", "");
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/computer/telecomms/monitor/proc/Topic  (code/game/machinery/telecomms/computers/telemonitor.dm:68)  may sleep
rt.def("/obj/machinery/computer/telecomms/monitor/proc/Topic", function* Topic(f: Frame) {
	let _T: Value = null, newnet: Value = null;
	let $0: any, $e: any;
	f.vars = () => [_T, newnet, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.at(live(f.args[1]), "viewmachine"))) {
		rt.setSv(f, "screen", 1);
		_T = null;
		rt.forList(f, 0, rt.sv(f, "machinelist"), T("/obj/machinery/telecomms"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if (isEqual(rt.fv(f, "id", live(_T)), rt.at(live(f.args[1]), "viewmachine"))) {
				rt.setSv(f, "SelectedMachine", live(_T));
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.at(live(f.args[1]), "operation"))) {
		$0 = rt.at(live(f.args[1]), "operation");
		if ($0 === "release") {
			rt.setSv(f, "machinelist", rt.list());
			rt.setSv(f, "screen", 0);
		} else if ($0 === "mainmenu") {
			rt.setSv(f, "screen", 0);
		} else if ($0 === "probe") {
			if (rt.gt(rt.len(f, rt.sv(f, "machinelist")), 0)) {
				rt.setSv(f, "temp", "<font color = #D70B00>- FAILED: CANNOT PROBE WHEN BUFFER FULL -</font color>");
			} else {
				_T = null;
				rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [25, live(f.src)])), T("/obj/machinery/telecomms"));
				while (($e = rt.next(f, 0)) !== undefined) {
					_T = $e;
					if (isEqual(rt.fv(f, "network", live(_T)), rt.sv(f, "network"))) {
						yield* g.callName(f, rt.sv(f, "machinelist"), "Add", [live(_T)]);
					}
				}
				rt.endFor(f, 0);
				if (!truthy(rt.len(f, rt.sv(f, "machinelist")))) {
					rt.setSv(f, "temp", fmt("<font color = #D70B00>- FAILED: UNABLE TO LOCATE NETWORK ENTITIES IN [＀] -</font color>", [rt.sv(f, "network")]));
				} else {
					rt.setSv(f, "temp", fmt("<font color = #336699>- ＀ ENTITIES LOCATED & BUFFERED -</font color>", [rt.len(f, rt.sv(f, "machinelist"))]));
				}
				rt.setSv(f, "screen", 0);
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "network"))) {
		if ((truthy((newnet = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Which network do you want to view?", "Comm Monitor", rt.sv(f, "network")])))) && (truthy((rt.isIn(f, live(f.usr), (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)]))) ? 1 : 0)) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))))) {
			if (rt.gt(rt.length(live(newnet)), 15)) {
				rt.setSv(f, "temp", "<font color = #D70B00>- FAILED: NETWORK TAG STRING TOO LENGHTLY -</font color>");
			} else {
				rt.setSv(f, "network", live(newnet));
				rt.setSv(f, "screen", 0);
				rt.setSv(f, "machinelist", rt.list());
				rt.setSv(f, "temp", fmt("<font color = #336699>- NEW NETWORK TAG SET IN ADDRESS [＀] -</font color>", [rt.sv(f, "network")]));
			}
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/telecomms/monitor/proc/attackby  (code/game/machinery/telecomms/computers/telemonitor.dm:126)  may sleep
rt.def("/obj/machinery/computer/telecomms/monitor/proc/attackby", function* attackby(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);
