// From code/modules/modular_computers/file_system/programs/ntmonitor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4166, "/datum/computer_file/program/ntnetmonitor", "/datum/computer_file/program", {
	filename: "ntmonitor",
	filedesc: "NTNet Diagnostics and Monitoring",
	program_icon_state: "comm_monitor",
	extended_desc: "This program monitors stationwide NTNet network, provides access to logging systems, and allows for configuration changes",
	size: 12,
	requires_ntnet: 1,
	available_on_ntnet: 1,
	tgui_id: "ntos_net_monitor",
	required_access: 67,
});

// /datum/computer_file/program/ntnetmonitor/proc/ui_act  (code/modules/modular_computers/file_system/programs/ntmonitor.dm:13)  may sleep
rt.def("/datum/computer_file/program/ntnetmonitor/proc/ui_act", function* ui_act(f: Frame) {
	let user: Value = null, response: Value = null, logcount: Value = null;
	let $0: any;
	f.vars = () => [user, response, logcount, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	$0 = live(f.args[0]);
	if ($0 === "resetIDS") {
		f.dot = 1;
		if (truthy(rt.gl("ntnet_global"))) {
			yield* g.callName(f, rt.gl("ntnet_global"), "resetIDS", []);
		}
		return 1;
	} else if ($0 === "toggleIDS") {
		f.dot = 1;
		if (truthy(rt.gl("ntnet_global"))) {
			yield* g.callName(f, rt.gl("ntnet_global"), "toggleIDS", []);
		}
		return 1;
	} else if ($0 === "toggleWireless") {
		f.dot = 1;
		if (!truthy(rt.gl("ntnet_global"))) {
			return 1;
		}
		if (truthy(rt.fv(f, "setting_disabled", rt.gl("ntnet_global")))) {
			rt.setFv(f, "setting_disabled", rt.gl("ntnet_global"), 0);
			return 1;
		}
		if (!truthy((user = live(f.usr)))) {
			return 1;
		}
		if (isEqual((response = (yield* g.call(f, P("/proc/alert"), null, [live(user), "Really disable NTNet wireless? If your computer is connected wirelessly you won't be able to turn it back on! This will affect all connected wireless devices.", "NTNet shutdown", "Yes", "No"]))), "Yes")) {
			rt.setFv(f, "setting_disabled", rt.gl("ntnet_global"), 1);
		}
		return 1;
	} else if ($0 === "purgelogs") {
		f.dot = 1;
		if (truthy(rt.gl("ntnet_global"))) {
			yield* g.callName(f, rt.gl("ntnet_global"), "purge_logs", []);
		}
	} else if ($0 === "updatemaxlogs") {
		f.dot = 1;
		user = live(f.usr);
		logcount = (yield* g.call(f, P("/proc/text2num"), null, [(yield* g.op(f, "Prompt", [2], [null, null, fmt("Enter amount of logs to keep in memory (＀-＀):", [10, 300]), live(user), null]))]));
		if (truthy(rt.gl("ntnet_global"))) {
			yield* g.callName(f, rt.gl("ntnet_global"), "update_max_log_count", [live(logcount)]);
		}
	} else if ($0 === "toggle_function") {
		f.dot = 1;
		if (!truthy(rt.gl("ntnet_global"))) {
			return 1;
		}
		yield* g.callName(f, rt.gl("ntnet_global"), "toggle_function", [(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "id")]))]);
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /datum/computer_file/program/ntnetmonitor/proc/ui_data  (code/modules/modular_computers/file_system/programs/ntmonitor.dm:61)
rt.def("/datum/computer_file/program/ntnetmonitor/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [data, i, $e];
	if (!truthy(rt.gl("ntnet_global"))) {
		return live(f.dot);
	}
	rt.setAt((data = rt.callSrc(f, "get_header_data", [])), "ntnetstatus", rt.callName(f, rt.gl("ntnet_global"), "check_function", []));
	rt.setAt(live(data), "ntnetrelays", rt.getLen(f, rt.fv(f, "relays", rt.gl("ntnet_global"))));
	rt.setAt(live(data), "idsstatus", rt.fv(f, "intrusion_detection_enabled", rt.gl("ntnet_global")));
	rt.setAt(live(data), "idsalarm", rt.fv(f, "intrusion_detection_alarm", rt.gl("ntnet_global")));
	rt.setAt(live(data), "config_softwaredownload", rt.fv(f, "setting_softwaredownload", rt.gl("ntnet_global")));
	rt.setAt(live(data), "config_peertopeer", rt.fv(f, "setting_peertopeer", rt.gl("ntnet_global")));
	rt.setAt(live(data), "config_communication", rt.fv(f, "setting_communication", rt.gl("ntnet_global")));
	rt.setAt(live(data), "config_systemcontrol", rt.fv(f, "setting_systemcontrol", rt.gl("ntnet_global")));
	rt.setAt(live(data), "ntnetlogs", rt.list());
	i = null;
	rt.forList(f, 0, rt.fv(f, "logs", rt.gl("ntnet_global")));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modAt(live(data), "ntnetlogs", rt.list(rt.alist(f, ["entry", live(i)])), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "ntnetmaxlogs", rt.fv(f, "setting_maxlogcount", rt.gl("ntnet_global")));
	return live(data);
});
