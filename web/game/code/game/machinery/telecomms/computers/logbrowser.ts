// From code/game/machinery/telecomms/computers/logbrowser.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10415, "/obj/machinery/computer/telecomms/server", "/obj/machinery/computer/telecomms", {
	screen: 0,
	servers: null,
	SelectedServer: null,
	network: "NULL",
	temp: "",
	universal_translate: 0,
	icon_screen: "comm_logs",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/comm_server"),
	name: "telecommunications server monitoring console",
	req_access: null,
});

// /obj/machinery/computer/telecomms/server/proc/<init>  (code/game/machinery/telecomms/computers/logbrowser.dm:8)
rt.def("/obj/machinery/computer/telecomms/server/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servers", rt.list());
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(61));
	return f.dot;
});

// /obj/machinery/computer/telecomms/server/proc/attack_hand  (code/game/machinery/telecomms/computers/logbrowser.dm:20)  may sleep
rt.def("/obj/machinery/computer/telecomms/server/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, _T: Value = null, i: Value = null, C: Value = null, race: Value = null, language: Value = null, mobtype: Value = null, humans: Value = null, monkeys: Value = null, silicons: Value = null, slimes: Value = null, animals: Value = null;
	let $0: any, $e: any;
	f.vars = () => [dat, _T, i, C, race, language, mobtype, humans, monkeys, silicons, slimes, animals, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	dat = "<TITLE>Telecommunication Server Monitor</TITLE><center><b>Telecommunications Server Monitor</b></center>";
	$0 = rt.sv(f, "screen");
	if ($0 === 0) {
		dat = rt.modify(live(dat), fmt("<br>＀<br>", [rt.sv(f, "temp")]), add);
		dat = rt.modify(live(dat), fmt("<br>Current Network: <a href='?src=＃;network=1'>＀</a><br>", [live(f.src), rt.sv(f, "network")]), add);
		if (truthy(rt.len(f, rt.sv(f, "servers")))) {
			dat = rt.modify(live(dat), "<br>Detected Telecommunication Servers:<ul>", add);
			_T = null;
			rt.forList(f, 0, rt.sv(f, "servers"), T("/obj/machinery/telecomms"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				dat = rt.modify(live(dat), fmt("<li><a href='?src=＃;viewserver=＀'>＃ ＀</a> (＀)</li>", [live(f.src), rt.fv(f, "id", live(_T)), live(_T), rt.fv(f, "name", live(_T)), rt.fv(f, "id", live(_T))]), add);
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</ul>", add);
			dat = rt.modify(live(dat), fmt("<br><a href='?src=＃;operation=release'>[Flush Buffer]</a>", [live(f.src)]), add);
		} else {
			dat = rt.modify(live(dat), fmt("<br>No servers detected. Scan for servers: <a href='?src=＃;operation=scan'>[Scan]</a>", [live(f.src)]), add);
		}
	} else if ($0 === 1) {
		dat = rt.modify(live(dat), fmt("<br>＀<br>", [rt.sv(f, "temp")]), add);
		dat = rt.modify(live(dat), fmt("<center><a href='?src=＃;operation=mainmenu'>[Main Menu]</a>     <a href='?src=＃;operation=refresh'>[Refresh]</a></center>", [live(f.src), live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<br>Current Network: ＀", [rt.sv(f, "network")]), add);
		dat = rt.modify(live(dat), fmt("<br>Selected Server: ＀", [rt.fv(f, "id", rt.sv(f, "SelectedServer"))]), add);
		if (rt.ge(rt.fv(f, "totaltraffic", rt.sv(f, "SelectedServer")), 1024)) {
			dat = rt.modify(live(dat), fmt("<br>Total recorded traffic: ＀ Terrabytes<br><br>", [(yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "totaltraffic", rt.sv(f, "SelectedServer")), 1024)]))]), add);
		} else {
			dat = rt.modify(live(dat), fmt("<br>Total recorded traffic: ＀ Gigabytes<br><br>", [rt.fv(f, "totaltraffic", rt.sv(f, "SelectedServer"))]), add);
		}
		dat = rt.modify(live(dat), "Stored Logs: <ol>", add);
		i = 0;
		C = null;
		rt.forList(f, 0, rt.fv(f, "log_entries", rt.sv(f, "SelectedServer")), T("/datum/comm_log_entry"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			i = rt.inc(live(i), 1);
			if (isEqual(rt.fv(f, "input_type", live(C)), "Speech File")) {
				dat = rt.modify(live(dat), fmt("<li><font color = #008F00>＀</font color>  <font color = #FF0000><a href='?src=＃;delete=＀'>[X]</a></font color><br>", [rt.fv(f, "name", live(C)), live(f.src), live(i)]), add);
				race = null;
				language = "Human";
				mobtype = rt.index(rt.fv(f, "parameters", live(C)), "mobtype");
				humans = (yield* g.call(f, P("/proc/typesof"), null, [T("/mob/living/carbon/human"), T("/mob/living/brain")]));
				monkeys = (yield* g.call(f, P("/proc/typesof"), null, [T("/mob/living/carbon/monkey")]));
				silicons = (yield* g.call(f, P("/proc/typesof"), null, [T("/mob/living/silicon")]));
				slimes = (yield* g.call(f, P("/proc/typesof"), null, [T("/mob/living/simple_animal/slime")]));
				animals = (yield* g.call(f, P("/proc/typesof"), null, [T("/mob/living/simple_animal")]));
				if (truthy((rt.isIn(f, live(mobtype), live(humans)) ? 1 : 0))) {
					language = (race = "Humanoid");
				} else {
					if (truthy((rt.isIn(f, live(mobtype), live(slimes)) ? 1 : 0))) {
						language = (race = "Slime");
					} else {
						if (truthy((rt.isIn(f, live(mobtype), live(monkeys)) ? 1 : 0))) {
							language = (race = "Monkey");
						} else {
							if (truthy((rt.isIn(f, live(mobtype), (live(silicons) || (isEqual(rt.index(rt.fv(f, "parameters", live(C)), "job"), "AI") ? 1 : 0))) ? 1 : 0))) {
								race = "Artificial Life";
								language = "Humanoid";
							} else {
								if (truthy((rt.istype(live(mobtype), T("/obj")) ? 1 : 0))) {
									language = (race = "Machinery");
								} else {
									if (truthy((rt.isIn(f, live(mobtype), live(animals)) ? 1 : 0))) {
										language = (race = "Domestic Animal");
									} else {
										language = (race = "<i>Unidentifiable</i>");
									}
								}
							}
						}
					}
				}
				if (((isEqual(live(language), "Humanoid") || truthy(rt.sv(f, "universal_translate"))) || truthy(rt.index(rt.fv(f, "parameters", live(C)), "uspeech")))) {
					dat = rt.modify(live(dat), fmt("<u><font color = #18743E>Data type</font color></u>: ＀<br>", [rt.fv(f, "input_type", live(C))]), add);
					dat = rt.modify(live(dat), fmt("<u><font color = #18743E>Source</font color></u>: ＀ (Job: ＀)<br>", [rt.index(rt.fv(f, "parameters", live(C)), "name"), rt.index(rt.fv(f, "parameters", live(C)), "job")]), add);
					dat = rt.modify(live(dat), fmt("<u><font color = #18743E>Class</font color></u>: ＀<br>", [live(race)]), add);
					dat = rt.modify(live(dat), fmt("<u><font color = #18743E>Contents</font color></u>: \"＀\"<br>", [rt.index(rt.fv(f, "parameters", live(C)), "message")]), add);
				} else {
					dat = rt.modify(live(dat), "<u><font color = #18743E>Data type</font color></u>: Audio File<br>", add);
					dat = rt.modify(live(dat), "<u><font color = #18743E>Source</font color></u>: <i>Unidentifiable</i><br>", add);
					dat = rt.modify(live(dat), fmt("<u><font color = #18743E>Class</font color></u>: ＀<br>", [live(race)]), add);
					dat = rt.modify(live(dat), "<u><font color = #18743E>Contents</font color></u>: <i>Unintelligble</i><br>", add);
				}
				dat = rt.modify(live(dat), "</li><br>", add);
			} else {
				if (isEqual(rt.fv(f, "input_type", live(C)), "Execution Error")) {
					dat = rt.modify(live(dat), fmt("<li><font color = #990000>＀</font color>  <font color = #FF0000><a href='?src=＃;delete=＀'>[X]</a></font color><br>", [rt.fv(f, "name", live(C)), live(f.src), live(i)]), add);
					dat = rt.modify(live(dat), fmt("<u><font color = #787700>Output</font color></u>: \"＀\"<br>", [rt.index(rt.fv(f, "parameters", live(C)), "message")]), add);
					dat = rt.modify(live(dat), "</li><br>", add);
				}
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

// /obj/machinery/computer/telecomms/server/proc/Topic  (code/game/machinery/telecomms/computers/logbrowser.dm:147)  may sleep
rt.def("/obj/machinery/computer/telecomms/server/proc/Topic", function* Topic(f: Frame) {
	let _T: Value = null, D: Value = null, newnet: Value = null;
	let $0: any, $e: any;
	f.vars = () => [_T, D, newnet, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.at(live(f.args[1]), "viewserver"))) {
		rt.setSv(f, "screen", 1);
		_T = null;
		rt.forList(f, 0, rt.sv(f, "servers"), T("/obj/machinery/telecomms"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if (isEqual(rt.fv(f, "id", live(_T)), rt.at(live(f.args[1]), "viewserver"))) {
				rt.setSv(f, "SelectedServer", live(_T));
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.at(live(f.args[1]), "operation"))) {
		$0 = rt.at(live(f.args[1]), "operation");
		if ($0 === "release") {
			rt.setSv(f, "servers", rt.list());
			rt.setSv(f, "screen", 0);
		} else if ($0 === "mainmenu") {
			rt.setSv(f, "screen", 0);
		} else if ($0 === "scan") {
			if (rt.gt(rt.len(f, rt.sv(f, "servers")), 0)) {
				rt.setSv(f, "temp", "<font color = #D70B00>- FAILED: CANNOT PROBE WHEN BUFFER FULL -</font color>");
			} else {
				_T = null;
				rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [25, live(f.src)])), T("/obj/machinery/telecomms/server"));
				while (($e = rt.next(f, 0)) !== undefined) {
					_T = $e;
					if (isEqual(rt.fv(f, "network", live(_T)), rt.sv(f, "network"))) {
						yield* g.callName(f, rt.sv(f, "servers"), "Add", [live(_T)]);
					}
				}
				rt.endFor(f, 0);
				if (!truthy(rt.len(f, rt.sv(f, "servers")))) {
					rt.setSv(f, "temp", fmt("<font color = #D70B00>- FAILED: UNABLE TO LOCATE SERVERS IN [＀] -</font color>", [rt.sv(f, "network")]));
				} else {
					rt.setSv(f, "temp", fmt("<font color = #336699>- ＀ SERVERS PROBED & BUFFERED -</font color>", [rt.len(f, rt.sv(f, "servers"))]));
				}
				rt.setSv(f, "screen", 0);
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "delete"))) {
		if ((!truthy((yield* g.callName(f, live(f.src), "allowed", [live(f.usr)]))) && !truthy(rt.sv(f, "emagged")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>ACCESS DENIED.</span>"]);
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "SelectedServer"))) {
			rt.setSv(f, "temp", fmt("<font color = #336699>- DELETED ENTRY: ＀ -</font color>", [rt.gv(f, "name", (D = rt.index(rt.fv(f, "log_entries", rt.sv(f, "SelectedServer")), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "delete")])))))]));
			yield* g.callName(f, rt.fv(f, "log_entries", rt.sv(f, "SelectedServer")), "Remove", [live(D)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(D)]);
		} else {
			rt.setSv(f, "temp", "<font color = #D70B00>- FAILED: NO SELECTED MACHINE -</font color>");
		}
	}
	if (truthy(rt.at(live(f.args[1]), "network"))) {
		if ((truthy((newnet = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Which network do you want to view?", "Comm Monitor", rt.sv(f, "network")])))) && (truthy((rt.isIn(f, live(f.usr), (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)]))) ? 1 : 0)) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))))) {
			if (rt.gt(rt.length(live(newnet)), 15)) {
				rt.setSv(f, "temp", "<font color = #D70B00>- FAILED: NETWORK TAG STRING TOO LENGHTLY -</font color>");
			} else {
				rt.setSv(f, "network", live(newnet));
				rt.setSv(f, "screen", 0);
				rt.setSv(f, "servers", rt.list());
				rt.setSv(f, "temp", fmt("<font color = #336699>- NEW NETWORK TAG SET IN ADDRESS [＀] -</font color>", [rt.sv(f, "network")]));
			}
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/telecomms/server/proc/attackby  (code/game/machinery/telecomms/computers/logbrowser.dm:224)  may sleep
rt.def("/obj/machinery/computer/telecomms/server/proc/attackby", function* attackby(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);
