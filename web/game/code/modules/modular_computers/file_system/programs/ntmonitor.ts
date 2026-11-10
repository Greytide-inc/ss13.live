// Based on /tg/station's code/modules/modular_computers/file_system/programs/ntmonitor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { g, add } = rt;


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

// ntmonitor.dm:13
rt.def("/datum/computer_file/program/ntnetmonitor/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let user: Value = null, response: Value = null, logcount: Value = null;
	if (yield* parent_proc()) {
		return 1;
	}
	if (action === "resetIDS") {
		f.dot = 1;
		if (GLOB.ntnet_global) {
			GLOB.ntnet_global.resetIDS();
		}
		return 1;
	} else if (action === "toggleIDS") {
		f.dot = 1;
		if (GLOB.ntnet_global) {
			GLOB.ntnet_global.toggleIDS();
		}
		return 1;
	} else if (action === "toggleWireless") {
		f.dot = 1;
		if (!GLOB.ntnet_global) {
			return 1;
		}
		if (GLOB.ntnet_global.setting_disabled) {
			GLOB.ntnet_global.setting_disabled = 0;
			return 1;
		}
		if (!(user = f.usr)) {
			return 1;
		}
		if ((response = (yield* alert(user, "Really disable NTNet wireless? If your computer is connected wirelessly you won't be able to turn it back on! This will affect all connected wireless devices.", "NTNet shutdown", "Yes", "No"))) == "Yes") {
			GLOB.ntnet_global.setting_disabled = 1;
		}
		return 1;
	} else if (action === "purgelogs") {
		f.dot = 1;
		if (GLOB.ntnet_global) {
			GLOB.ntnet_global.purge_logs();
		}
	} else if (action === "updatemaxlogs") {
		f.dot = 1;
		user = f.usr;
		logcount = text2num((yield* g.op(f, "Prompt", [2], [null, null, `Enter amount of logs to keep in memory (${10}-${300}):`, user, null])));
		if (GLOB.ntnet_global) {
			GLOB.ntnet_global.update_max_log_count(logcount);
		}
	} else if (action === "toggle_function") {
		f.dot = 1;
		if (!GLOB.ntnet_global) {
			return 1;
		}
		GLOB.ntnet_global.toggle_function(text2num(rt.at(params, "id")));
	}
	return f.dot;
}, true);

// ntmonitor.dm:61
rt.def("/datum/computer_file/program/ntnetmonitor/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, i: Value = null;
	if (!GLOB.ntnet_global) {
		return f.dot;
	}
	rt.setAt((data = this.get_header_data()), "ntnetstatus", GLOB.ntnet_global.check_function());
	rt.setAt(data, "ntnetrelays", rt.len(f, GLOB.ntnet_global.relays));
	rt.setAt(data, "idsstatus", GLOB.ntnet_global.intrusion_detection_enabled);
	rt.setAt(data, "idsalarm", GLOB.ntnet_global.intrusion_detection_alarm);
	rt.setAt(data, "config_softwaredownload", GLOB.ntnet_global.setting_softwaredownload);
	rt.setAt(data, "config_peertopeer", GLOB.ntnet_global.setting_peertopeer);
	rt.setAt(data, "config_communication", GLOB.ntnet_global.setting_communication);
	rt.setAt(data, "config_systemcontrol", GLOB.ntnet_global.setting_systemcontrol);
	rt.setAt(data, "ntnetlogs", list());
	for (i of each(GLOB.ntnet_global.logs)) {
		rt.modAt(data, "ntnetlogs", list(rt.alist(f, ["entry", i])), add);
	}
	rt.setAt(data, "ntnetmaxlogs", GLOB.ntnet_global.setting_maxlogcount);
	return data;
});
