// From code/modules/modular_computers/file_system/programs/ntdownloader.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4165, "/datum/computer_file/program/ntnetdownload", "/datum/computer_file/program", {
	downloaded_file: null,
	hacked_download: 0,
	download_completion: 0,
	download_netspeed: 0,
	downloaderror: "",
	my_computer: null,
	filename: "ntndownloader",
	filedesc: "Software Download Tool",
	program_icon_state: "generic",
	extended_desc: "This program allows downloads of software from official NT repositories",
	unsendable: 1,
	undeletable: 1,
	size: 4,
	requires_ntnet: 1,
	requires_ntnet_feature: 1,
	available_on_ntnet: 0,
	ui_header: "downloader_finished.gif",
	tgui_id: "ntos_net_downloader",
});

// /datum/computer_file/program/ntnetdownload/proc/begin_file_download  (code/modules/modular_computers/file_system/programs/ntdownloader.dm:26)  may sleep
rt.def("/datum/computer_file/program/ntnetdownload/proc/begin_file_download", function* begin_file_download(f: Frame, filename: Value) {
	let PRG: Value = null, hard_drive: Value = null;
	f.vars = () => [filename, PRG, hard_drive];
	if (truthy(rt.sv(f, "downloaded_file"))) {
		return 0;
	}
	if ((!truthy((PRG = (yield* g.callName(f, rt.gl("ntnet_global"), "find_ntnet_file_by_name", [live(filename)])))) || !truthy((rt.istype(live(PRG), T("/datum/computer_file/program")) ? 1 : 0)))) {
		return 0;
	}
	if ((truthy(rt.fv(f, "available_on_syndinet", live(PRG))) && !truthy(rt.fv(f, "emagged", rt.sv(f, "computer"))))) {
		return 0;
	}
	hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "HDD");
	if (((!truthy(rt.sv(f, "computer")) || !truthy(live(hard_drive))) || !truthy((yield* g.callName(f, live(hard_drive), "can_store_file", [live(PRG)]))))) {
		return 0;
	}
	rt.setSv(f, "ui_header", "downloader_running.gif");
	if (truthy((rt.isIn(f, live(PRG), rt.fv(f, "available_station_software", rt.gl("ntnet_global"))) ? 1 : 0))) {
		yield* g.srcCall(f, "generate_network_log", fmt("Began downloading file ＀.＀ from NTNet Software Repository.", [rt.fv(f, "filename", live(PRG)), rt.fv(f, "filetype", live(PRG))]));
		rt.setSv(f, "hacked_download", 0);
	} else {
		if (truthy((rt.isIn(f, live(PRG), rt.fv(f, "available_antag_software", rt.gl("ntnet_global"))) ? 1 : 0))) {
			yield* g.srcCall(f, "generate_network_log", fmt("Began downloading file **ENCRYPTED**.＀ from unspecified server.", [rt.fv(f, "filetype", live(PRG))]));
			rt.setSv(f, "hacked_download", 1);
		} else {
			yield* g.srcCall(f, "generate_network_log", fmt("Began downloading file ＀.＀ from unspecified server.", [rt.fv(f, "filename", live(PRG)), rt.fv(f, "filetype", live(PRG))]));
			rt.setSv(f, "hacked_download", 0);
		}
	}
	rt.setSv(f, "downloaded_file", (yield* g.callName(f, live(PRG), "clone", [])));
	return f.dot;
}, true);

// /datum/computer_file/program/ntnetdownload/proc/abort_file_download  (code/modules/modular_computers/file_system/programs/ntdownloader.dm:55)
rt.def("/datum/computer_file/program/ntnetdownload/proc/abort_file_download", function abort_file_download(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "downloaded_file"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "hacked_download"))) {
		$0 = "**ENCRYPTED**";
	} else {
		$0 = fmt("＀.＀", [rt.fv(f, "filename", rt.sv(f, "downloaded_file")), rt.fv(f, "filetype", rt.sv(f, "downloaded_file"))]);
	}
	rt.callSrc(f, "generate_network_log", [fmt("Aborted download of file ＀.", [$0])]);
	rt.setSv(f, "downloaded_file", null);
	rt.setSv(f, "download_completion", 0);
	rt.setSv(f, "ui_header", "downloader_finished.gif");
	return f.dot;
});

// /datum/computer_file/program/ntnetdownload/proc/complete_file_download  (code/modules/modular_computers/file_system/programs/ntdownloader.dm:63)
rt.def("/datum/computer_file/program/ntnetdownload/proc/complete_file_download", function complete_file_download(f: Frame) {
	let hard_drive: Value = null;
	let $0: any;
	f.vars = () => [hard_drive, $0];
	if (!truthy(rt.sv(f, "downloaded_file"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "hacked_download"))) {
		$0 = "**ENCRYPTED**";
	} else {
		$0 = fmt("＀.＀", [rt.fv(f, "filename", rt.sv(f, "downloaded_file")), rt.fv(f, "filetype", rt.sv(f, "downloaded_file"))]);
	}
	rt.callSrc(f, "generate_network_log", [fmt("Completed download of file ＀.", [$0])]);
	hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "HDD");
	if (((!truthy(rt.sv(f, "computer")) || !truthy(live(hard_drive))) || !truthy(rt.callName(f, live(hard_drive), "store_file", [rt.sv(f, "downloaded_file")])))) {
		rt.setSv(f, "downloaderror", "I/O ERROR - Unable to save file. Check whether you have enough free space on your hard drive and whether your hard drive is properly connected. If the issue persists contact your system administrator for assistance.");
	}
	rt.setSv(f, "downloaded_file", null);
	rt.setSv(f, "download_completion", 0);
	rt.setSv(f, "ui_header", "downloader_finished.gif");
	return f.dot;
});

// /datum/computer_file/program/ntnetdownload/proc/process_tick  (code/modules/modular_computers/file_system/programs/ntdownloader.dm:75)
rt.def("/datum/computer_file/program/ntnetdownload/proc/process_tick", function process_tick(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "downloaded_file"))) {
		return live(f.dot);
	}
	if (rt.ge(rt.sv(f, "download_completion"), rt.fv(f, "size", rt.sv(f, "downloaded_file")))) {
		rt.callSrc(f, "complete_file_download", []);
	}
	rt.setSv(f, "download_netspeed", 0);
	$0 = rt.sv(f, "ntnet_status");
	if ($0 === 1) {
		rt.setSv(f, "download_netspeed", 0.5);
	} else if ($0 === 2) {
		rt.setSv(f, "download_netspeed", 1);
	} else if ($0 === 3) {
		rt.setSv(f, "download_netspeed", 2);
	}
	rt.modSrcVar(f, "download_completion", rt.sv(f, "download_netspeed"), add);
	return f.dot;
});

// /datum/computer_file/program/ntnetdownload/proc/ui_act  (code/modules/modular_computers/file_system/programs/ntdownloader.dm:92)  may sleep
rt.def("/datum/computer_file/program/ntnetdownload/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	$0 = live(f.args[0]);
	if ($0 === "PRG_downloadfile") {
		if (!truthy(rt.sv(f, "downloaded_file"))) {
			yield* g.srcCall(f, "begin_file_download", rt.at(live(f.args[1]), "filename"));
		}
		return 1;
	} else if ($0 === "PRG_reseterror") {
		if (truthy(rt.sv(f, "downloaderror"))) {
			rt.setSv(f, "download_completion", 0);
			rt.setSv(f, "download_netspeed", 0);
			rt.setSv(f, "downloaded_file", null);
			rt.setSv(f, "downloaderror", "");
		}
		return 1;
	}
	return 0;
}, true, { args: ["action", "params"] });

// /datum/computer_file/program/ntnetdownload/proc/ui_data  (code/modules/modular_computers/file_system/programs/ntdownloader.dm:109)
rt.def("/datum/computer_file/program/ntnetdownload/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, hard_drive: Value = null, all_entries: Value = null, A: Value = null, _P: Value = null, hacked_programs: Value = null, S: Value = null, _P_5: Value = null;
	let $e: any;
	f.vars = () => [data, hard_drive, all_entries, A, _P, hacked_programs, S, _P_5, $e];
	rt.setSv(f, "my_computer", rt.sv(f, "computer"));
	if (!truthy((rt.istype(rt.sv(f, "my_computer"), T("/obj/item/device/modular_computer")) ? 1 : 0))) {
		return live(f.dot);
	}
	data = rt.callSrc(f, "get_header_data", []);
	if (truthy(rt.sv(f, "downloaderror"))) {
		rt.setAt(live(data), "error", rt.sv(f, "downloaderror"));
	} else {
		if (truthy(rt.sv(f, "downloaded_file"))) {
			rt.setAt(live(data), "downloadname", rt.fv(f, "filename", rt.sv(f, "downloaded_file")));
			rt.setAt(live(data), "downloaddesc", rt.fv(f, "filedesc", rt.sv(f, "downloaded_file")));
			rt.setAt(live(data), "downloadsize", rt.fv(f, "size", rt.sv(f, "downloaded_file")));
			rt.setAt(live(data), "downloadspeed", rt.sv(f, "download_netspeed"));
			rt.setAt(live(data), "downloadcompletion", rt.call(f, P("/proc/round"), null, [rt.sv(f, "download_completion"), 0.10000000149011612]));
		} else {
			hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "my_computer")), "HDD");
			rt.setAt(live(data), "disk_size", rt.fv(f, "max_capacity", live(hard_drive)));
			rt.setAt(live(data), "disk_used", rt.fv(f, "used_capacity", live(hard_drive)));
			all_entries = rt.op(f, "CreateMultidimensionalList", [1], [0]);
			A = null;
			rt.forList(f, 0, rt.fv(f, "available_station_software", rt.gl("ntnet_global")));
			while (($e = rt.next(f, 0)) !== undefined) {
				A = $e;
				if (!truthy(rt.callName(f, (_P = live(A)), "can_run", [null, live(user), "transfer", 1], rt.Args.Named))) {
					continue;
				}
				rt.callName(f, live(all_entries), "Add", [rt.list(rt.alist(f, ["filename", rt.fv(f, "filename", live(_P)), "filedesc", rt.fv(f, "filedesc", live(_P)), "fileinfo", rt.fv(f, "extended_desc", live(_P)), "compatibility", rt.callSrc(f, "check_compatibility", [live(_P)]), "size", rt.fv(f, "size", live(_P))]))]);
			}
			rt.endFor(f, 0);
			rt.setAt(live(data), "hackedavailable", 0);
			if (truthy(rt.fv(f, "emagged", rt.sv(f, "computer")))) {
				hacked_programs = rt.op(f, "CreateMultidimensionalList", [1], [0]);
				S = null;
				rt.forList(f, 0, rt.fv(f, "available_antag_software", rt.gl("ntnet_global")));
				while (($e = rt.next(f, 0)) !== undefined) {
					S = $e;
					_P_5 = live(S);
					rt.setAt(live(data), "hackedavailable", 1);
					rt.callName(f, live(hacked_programs), "Add", [rt.list(rt.alist(f, ["filename", rt.fv(f, "filename", live(_P_5)), "filedesc", rt.fv(f, "filedesc", live(_P_5)), "fileinfo", rt.fv(f, "extended_desc", live(_P_5)), "size", rt.fv(f, "size", live(_P_5))]))]);
				}
				rt.endFor(f, 0);
				rt.setAt(live(data), "hacked_programs", live(hacked_programs));
			}
			rt.setAt(live(data), "downloadable_programs", live(all_entries));
		}
	}
	return live(data);
});

// /datum/computer_file/program/ntnetdownload/proc/check_compatibility  (code/modules/modular_computers/file_system/programs/ntdownloader.dm:163)
rt.def("/datum/computer_file/program/ntnetdownload/proc/check_compatibility", function check_compatibility(f: Frame, _P: Value) {
	let hardflag: Value = null;
	f.vars = () => [hardflag];
	hardflag = rt.fv(f, "hardware_flag", rt.sv(f, "computer"));
	if ((truthy(live(_P)) && truthy(rt.callName(f, live(_P), "is_supported_by_hardware", [live(hardflag), 0])))) {
		return "Compatible";
	}
	return "Incompatible!";
});

// /datum/computer_file/program/ntnetdownload/proc/kill_program  (code/modules/modular_computers/file_system/programs/ntdownloader.dm:168)
rt.def("/datum/computer_file/program/ntnetdownload/proc/kill_program", function kill_program(f: Frame, forced: Value) {
	rt.callSrc(f, "abort_file_download", []);
	return rt.callSuper(f, [live(forced)]);
});
