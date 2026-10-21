// From code/modules/modular_computers/NTNet/NTNet.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalntnet_global  (code/modules/modular_computers/NTNet/NTNet.dm:1)  may sleep
rt.def("/datum/controller/global_vars/proc/InitGlobalntnet_global", function* InitGlobalntnet_global(f: Frame) {
	rt.setGl("ntnet_global", (yield* g.new_(f, T("/datum/ntnet"), [])));
	rt.modSrcVar(f, "gvars_datum_init_order", "ntnet_global", add);
	return f.dot;
}, true);

rt.type(4173, "/datum/ntnet", "/datum", {
	relays: null,
	logs: null,
	available_station_software: null,
	available_antag_software: null,
	chat_channels: null,
	fileservers: null,
	setting_maxlogcount: 100,
	setting_softwaredownload: 1,
	setting_peertopeer: 1,
	setting_communication: 1,
	setting_systemcontrol: 1,
	setting_disabled: 0,
	intrusion_detection_enabled: 1,
	intrusion_detection_alarm: 0,
});

// /datum/ntnet/proc/<init>  (code/modules/modular_computers/NTNet/NTNet.dm:6)
rt.def("/datum/ntnet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "relays", rt.list());
	$0 = $0;
	rt.setSv(f, "logs", rt.list());
	$0 = $0;
	rt.setSv(f, "available_station_software", rt.list());
	$0 = $0;
	rt.setSv(f, "available_antag_software", rt.list());
	$0 = $0;
	rt.setSv(f, "chat_channels", rt.list());
	$0 = $0;
	rt.setSv(f, "fileservers", rt.list());
	return f.dot;
});

// /datum/ntnet/proc/New  (code/modules/modular_computers/NTNet/NTNet.dm:29)  may sleep
rt.def("/datum/ntnet/proc/New", function* New(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	if ((truthy(rt.gl("ntnet_global")) && !isEqual(rt.gl("ntnet_global"), live(f.src)))) {
		rt.setGl("ntnet_global", live(f.src));
	}
	R = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/ntnet_relay"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		yield* g.callName(f, rt.sv(f, "relays"), "Add", [live(R)]);
		rt.setFv(f, "NTNet", live(R), live(f.src));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "build_software_lists");
	yield* g.srcCall(f, "add_log", "NTNet logging system activated.");
	return f.dot;
}, true);

// /datum/ntnet/proc/add_log  (code/modules/modular_computers/NTNet/NTNet.dm:39)
rt.def("/datum/ntnet/proc/add_log", function add_log(f: Frame, log_string: Value, source: Value) {
	let log_text: Value = null;
	f.vars = () => [source, log_text];
	if (live(source) === null) {
		source = null;
	}
	log_text = fmt("＀ - ", [rt.call(f, P("/proc/worldtime2text"), null, [])]);
	if (truthy(live(source))) {
		log_text = rt.modify(live(log_text), fmt("＀ - ", [rt.callName(f, live(source), "get_network_tag", [])]), add);
	} else {
		log_text = rt.modify(live(log_text), "*SYSTEM* - ", add);
	}
	log_text = rt.modify(live(log_text), live(log_string), add);
	rt.callName(f, rt.sv(f, "logs"), "Add", [live(log_text)]);
	if (!rt.gt(rt.len(f, rt.sv(f, "logs")), rt.sv(f, "setting_maxlogcount"))) return f.dot;
	rt.setSv(f, "logs", rt.callName(f, rt.sv(f, "logs"), "Copy", [subtract(rt.len(f, rt.sv(f, "logs")), rt.sv(f, "setting_maxlogcount")), 0]));
	return f.dot;
});

// /datum/ntnet/proc/check_function  (code/modules/modular_computers/NTNet/NTNet.dm:55)
rt.def("/datum/ntnet/proc/check_function", function check_function(f: Frame, specific_action: Value) {
	let operating: Value = null, M: Value = null, R: Value = null;
	let $0: any, $e: any;
	f.vars = () => [specific_action, operating, M, R, $0, $e];
	if (live(specific_action) === null) {
		specific_action = 0;
	}
	if ((!truthy(rt.sv(f, "relays")) || !truthy(rt.len(f, rt.sv(f, "relays"))))) {
		return 0;
	}
	operating = 0;
	M = null;
	rt.forList(f, 0, rt.sv(f, "relays"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.callName(f, (R = live(M)), "is_operational", []))) {
			operating = 1;
			break;
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "setting_disabled"))) {
		return 0;
	}
	$0 = live(specific_action);
	if ($0 === 1) {
		return (live(operating) && rt.sv(f, "setting_softwaredownload"));
	} else if ($0 === 2) {
		return (live(operating) && rt.sv(f, "setting_peertopeer"));
	} else if ($0 === 3) {
		return (live(operating) && rt.sv(f, "setting_communication"));
	} else if ($0 === 4) {
		return (live(operating) && rt.sv(f, "setting_systemcontrol"));
	}
	return live(operating);
});

// /datum/ntnet/proc/build_software_lists  (code/modules/modular_computers/NTNet/NTNet.dm:83)  may sleep
rt.def("/datum/ntnet/proc/build_software_lists", function* build_software_lists(f: Frame) {
	let F: Value = null, prog: Value = null;
	let $e: any;
	f.vars = () => [F, prog, $e];
	rt.setSv(f, "available_station_software", rt.list());
	rt.setSv(f, "available_antag_software", rt.list());
	F = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, [T("/datum/computer_file/program")])));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		if (((!truthy((prog = (yield* g.new_(f, live(F), [])))) || isEqual(rt.fv(f, "filename", live(prog)), "UnknownProgram")) || !isEqual(rt.fv(f, "filetype", live(prog)), "PRG"))) {
			continue;
		}
		if (truthy(rt.fv(f, "available_on_ntnet", live(prog)))) {
			yield* g.callName(f, rt.sv(f, "available_station_software"), "Add", [live(prog)]);
		}
		if (truthy(rt.fv(f, "available_on_syndinet", live(prog)))) {
			yield* g.callName(f, rt.sv(f, "available_antag_software"), "Add", [live(prog)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/ntnet/proc/find_ntnet_file_by_name  (code/modules/modular_computers/NTNet/NTNet.dm:98)
rt.def("/datum/ntnet/proc/find_ntnet_file_by_name", function find_ntnet_file_by_name(f: Frame, filename: Value) {
	let N: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [N, _P, $e];
	N = null;
	rt.forList(f, 0, rt.sv(f, "available_station_software"));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		_P = live(N);
		if (isEqual(live(filename), rt.fv(f, "filename", live(_P)))) {
			return live(_P);
		}
	}
	rt.endFor(f, 0);
	N = null;
	rt.forList(f, 0, rt.sv(f, "available_antag_software"));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		_P = live(N);
		if (isEqual(live(filename), rt.fv(f, "filename", live(_P)))) {
			return live(_P);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/ntnet/proc/toggleIDS  (code/modules/modular_computers/NTNet/NTNet.dm:112)
rt.def("/datum/ntnet/proc/toggleIDS", function toggleIDS(f: Frame) {
	rt.callSrc(f, "resetIDS", []);
	rt.setSv(f, "intrusion_detection_enabled", (!truthy(rt.sv(f, "intrusion_detection_enabled")) ? 1 : 0));
	return f.dot;
});

// /datum/ntnet/proc/purge_logs  (code/modules/modular_computers/NTNet/NTNet.dm:117)
rt.def("/datum/ntnet/proc/purge_logs", function purge_logs(f: Frame) {
	rt.setSv(f, "logs", rt.list());
	rt.callSrc(f, "add_log", ["-!- LOGS DELETED BY SYSTEM OPERATOR -!-"]);
	return f.dot;
});

// /datum/ntnet/proc/update_max_log_count  (code/modules/modular_computers/NTNet/NTNet.dm:122)
rt.def("/datum/ntnet/proc/update_max_log_count", function update_max_log_count(f: Frame, lognumber: Value) {
	f.vars = () => [lognumber];
	if (!truthy(live(lognumber))) {
		return 0;
	}
	rt.setSv(f, "setting_maxlogcount", (lognumber = rt.call(f, P("/proc/max"), null, [10, rt.call(f, P("/proc/min"), null, [live(lognumber), 300])])));
	rt.callSrc(f, "add_log", [fmt("Configuration Updated. Now keeping ＀ logs in system memory.", [rt.sv(f, "setting_maxlogcount")])]);
	return f.dot;
});

// /datum/ntnet/proc/toggle_function  (code/modules/modular_computers/NTNet/NTNet.dm:130)
rt.def("/datum/ntnet/proc/toggle_function", function toggle_function(f: Frame, _function: Value) {
	let $0: any;
	f.vars = () => [_function, $0];
	if (!truthy(live(_function))) {
		return live(f.dot);
	}
	$0 = (_function = rt.call(f, P("/proc/text2num"), null, [live(_function)]));
	if ($0 === 1) {
		rt.setSv(f, "setting_softwaredownload", (!truthy(rt.sv(f, "setting_softwaredownload")) ? 1 : 0));
		if (truthy(rt.sv(f, "setting_softwaredownload"))) {
			$0 = "allows";
		} else {
			$0 = "disallows";
		}
		rt.callSrc(f, "add_log", [fmt("Configuration Updated. Wireless network firewall now ＀ connection to software repositories.", [$0])]);
	} else if ($0 === 2) {
		rt.setSv(f, "setting_peertopeer", (!truthy(rt.sv(f, "setting_peertopeer")) ? 1 : 0));
		if (truthy(rt.sv(f, "setting_peertopeer"))) {
			$0 = "allows";
		} else {
			$0 = "disallows";
		}
		rt.callSrc(f, "add_log", [fmt("Configuration Updated. Wireless network firewall now ＀ peer to peer network traffic.", [$0])]);
	} else if ($0 === 3) {
		rt.setSv(f, "setting_communication", (!truthy(rt.sv(f, "setting_communication")) ? 1 : 0));
		if (truthy(rt.sv(f, "setting_communication"))) {
			$0 = "allows";
		} else {
			$0 = "disallows";
		}
		rt.callSrc(f, "add_log", [fmt("Configuration Updated. Wireless network firewall now ＀ instant messaging and similar communication services.", [$0])]);
	} else if ($0 === 4) {
		rt.setSv(f, "setting_systemcontrol", (!truthy(rt.sv(f, "setting_systemcontrol")) ? 1 : 0));
		if (truthy(rt.sv(f, "setting_systemcontrol"))) {
			$0 = "allows";
		} else {
			$0 = "disallows";
		}
		rt.callSrc(f, "add_log", [fmt("Configuration Updated. Wireless network firewall now ＀ remote control of station's systems.", [$0])]);
	}
	return f.dot;
});
