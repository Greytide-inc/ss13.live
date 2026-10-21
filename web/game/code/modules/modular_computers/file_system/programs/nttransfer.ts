// From code/modules/modular_computers/file_system/programs/nttransfer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4168, "/datum/computer_file/program/nttransfer", "/datum/computer_file/program", {
	error: "",
	server_password: "",
	provided_file: null,
	downloaded_file: null,
	connected_clients: null,
	remote: null,
	download_completion: 0,
	download_netspeed: 0,
	actual_netspeed: 0,
	unique_token: null,
	upload_menu: 0,
	filename: "nttransfer",
	filedesc: "P2P Transfer Client",
	extended_desc: "This program allows for simple file transfer via direct peer to peer connection.",
	program_icon_state: "comm_logs",
	size: 7,
	requires_ntnet: 1,
	requires_ntnet_feature: 2,
	network_destination: "other device via P2P tunnel",
	available_on_ntnet: 1,
	tgui_id: "ntos_net_transfer",
}, { global: { nttransfer_uid: 675 } });

// /datum/computer_file/program/nttransfer/proc/<init>  (code/modules/modular_computers/file_system/programs/nttransfer.dm:17)
rt.def("/datum/computer_file/program/nttransfer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "connected_clients", rt.list());
	return f.dot;
});

// /datum/computer_file/program/nttransfer/proc/New  (code/modules/modular_computers/file_system/programs/nttransfer.dm:27)
rt.def("/datum/computer_file/program/nttransfer/proc/New", function New(f: Frame) {
	rt.setSv(f, "unique_token", rt.incGl("nttransfer_uid", 1, true));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /datum/computer_file/program/nttransfer/proc/process_tick  (code/modules/modular_computers/file_system/programs/nttransfer.dm:32)
rt.def("/datum/computer_file/program/nttransfer/proc/process_tick", function process_tick(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	rt.callSrc(f, "update_netspeed", []);
	if (truthy(rt.sv(f, "provided_file"))) {
		C = null;
		rt.forList(f, 0, rt.sv(f, "connected_clients"), T("/datum/computer_file/program/nttransfer"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			rt.setFv(f, "actual_netspeed", live(C), rt.call(f, P("/proc/min"), null, [rt.fv(f, "download_netspeed", live(C)), rt.sv(f, "download_netspeed")]));
			rt.modField(f, live(C), "download_completion", rt.fv(f, "actual_netspeed", live(C)), add);
			if (rt.ge(rt.fv(f, "download_completion", live(C)), rt.fv(f, "size", rt.sv(f, "provided_file")))) {
				rt.callName(f, live(C), "finish_download", []);
			}
		}
		rt.endFor(f, 0);
	} else {
		if (!truthy(rt.sv(f, "downloaded_file"))) return f.dot;
		if (truthy(rt.sv(f, "remote"))) return f.dot;
		rt.callSrc(f, "crash_download", ["Connection to remote server lost"]);
	}
	return f.dot;
});

// /datum/computer_file/program/nttransfer/proc/kill_program  (code/modules/modular_computers/file_system/programs/nttransfer.dm:48)
rt.def("/datum/computer_file/program/nttransfer/proc/kill_program", function kill_program(f: Frame, forced: Value) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [forced, _P, $e];
	if (live(forced) === null) {
		forced = 0;
	}
	if (truthy(rt.sv(f, "downloaded_file"))) {
		rt.callSrc(f, "finalize_download", []);
	}
	if (truthy(rt.sv(f, "provided_file"))) {
		_P = null;
		rt.forList(f, 0, rt.sv(f, "connected_clients"), T("/datum/computer_file/program/nttransfer"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_P = $e;
			rt.callName(f, live(_P), "crash_download", ["Connection terminated by remote server"]);
		}
		rt.endFor(f, 0);
		rt.setSv(f, "downloaded_file", null);
	}
	rt.callSuper(f, [live(forced)]);
	return f.dot;
});

// /datum/computer_file/program/nttransfer/proc/update_netspeed  (code/modules/modular_computers/file_system/programs/nttransfer.dm:58)
rt.def("/datum/computer_file/program/nttransfer/proc/update_netspeed", function update_netspeed(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setSv(f, "download_netspeed", 0);
	$0 = rt.sv(f, "ntnet_status");
	if ($0 === 1) {
		rt.setSv(f, "download_netspeed", 0.5);
	} else if ($0 === 2) {
		rt.setSv(f, "download_netspeed", 1);
	} else if ($0 === 3) {
		rt.setSv(f, "download_netspeed", 2);
	}
	return f.dot;
});

// /datum/computer_file/program/nttransfer/proc/finish_download  (code/modules/modular_computers/file_system/programs/nttransfer.dm:68)
rt.def("/datum/computer_file/program/nttransfer/proc/finish_download", function finish_download(f: Frame) {
	let hard_drive: Value = null;
	f.vars = () => [hard_drive];
	hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "HDD");
	if (((!truthy(rt.sv(f, "computer")) || !truthy(live(hard_drive))) || !truthy(rt.callName(f, live(hard_drive), "store_file", [rt.sv(f, "downloaded_file")])))) {
		rt.setSv(f, "error", "I/O Error:  Unable to save file. Check your hard drive and try again.");
	}
	rt.callSrc(f, "finalize_download", []);
	return f.dot;
});

// /datum/computer_file/program/nttransfer/proc/crash_download  (code/modules/modular_computers/file_system/programs/nttransfer.dm:75)
rt.def("/datum/computer_file/program/nttransfer/proc/crash_download", function crash_download(f: Frame, message: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(live(message))) {
		$0 = live(message);
	} else {
		$0 = "An unknown error has occurred during download";
	}
	rt.setSv(f, "error", $0);
	rt.callSrc(f, "finalize_download", []);
	return f.dot;
});

// /datum/computer_file/program/nttransfer/proc/finalize_download  (code/modules/modular_computers/file_system/programs/nttransfer.dm:81)
rt.def("/datum/computer_file/program/nttransfer/proc/finalize_download", function finalize_download(f: Frame) {
	if (truthy(rt.sv(f, "remote"))) {
		rt.callName(f, rt.fv(f, "connected_clients", rt.sv(f, "remote")), "Remove", [live(f.src)]);
	}
	rt.setSv(f, "downloaded_file", null);
	rt.setSv(f, "remote", null);
	rt.setSv(f, "download_completion", 0);
	return f.dot;
});

// /datum/computer_file/program/nttransfer/proc/ui_act  (code/modules/modular_computers/file_system/programs/nttransfer.dm:87)  may sleep
rt.def("/datum/computer_file/program/nttransfer/proc/ui_act", function* ui_act(f: Frame) {
	let _P: Value = null, pass: Value = null, _T: Value = null, hard_drive: Value = null, F: Value = null, _P_2: Value = null;
	let $0: any, $e: any;
	f.vars = () => [_P, pass, _T, hard_drive, F, _P_2, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	$0 = live(f.args[0]);
	if ($0 === "PRG_downloadfile") {
		_P = null;
		rt.forList(f, 0, rt.fv(f, "fileservers", rt.gl("ntnet_global")), T("/datum/computer_file/program/nttransfer"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_P = $e;
			if (isEqual(fmt("＀", [rt.fv(f, "unique_token", live(_P))]), rt.at(live(f.args[1]), "id"))) {
				rt.setSv(f, "remote", live(_P));
				break;
			}
		}
		rt.endFor(f, 0);
		if ((!truthy(rt.sv(f, "remote")) || !truthy(rt.fv(f, "provided_file", rt.sv(f, "remote"))))) {
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "server_password", rt.sv(f, "remote")))) {
			if (!isEqual((pass = (yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [2], [null, "Password required", "Code 401 Unauthorized. Please enter password:", live(f.usr), null]))]))), rt.fv(f, "server_password", rt.sv(f, "remote")))) {
				rt.setSv(f, "error", "Incorrect Password");
				return live(f.dot);
			}
		}
		rt.setSv(f, "downloaded_file", (yield* g.callName(f, rt.fv(f, "provided_file", rt.sv(f, "remote")), "clone", [])));
		yield* g.callName(f, rt.fv(f, "connected_clients", rt.sv(f, "remote")), "Add", [live(f.src)]);
		return 1;
	} else if ($0 === "PRG_reset") {
		rt.setSv(f, "error", "");
		rt.setSv(f, "upload_menu", 0);
		yield* g.srcCall(f, "finalize_download");
		if (truthy((rt.isIn(f, live(f.src), rt.fv(f, "fileservers", rt.gl("ntnet_global"))) ? 1 : 0))) {
			yield* g.callName(f, rt.fv(f, "fileservers", rt.gl("ntnet_global")), "Remove", [live(f.src)]);
		}
		_T = null;
		rt.forList(f, 0, rt.sv(f, "connected_clients"), T("/datum/computer_file/program/nttransfer"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			yield* g.callName(f, live(_T), "crash_download", ["Remote server has forcibly closed the connection"]);
		}
		rt.endFor(f, 0);
		rt.setSv(f, "provided_file", null);
		return 1;
	} else if ($0 === "PRG_setpassword") {
		if (!truthy((pass = (yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [2], ["none", "Server security", "Enter new server password. Leave blank to cancel, input 'none' to disable password.", live(f.usr), null]))]))))) {
			return live(f.dot);
		}
		if (isEqual(live(pass), "none")) {
			rt.setSv(f, "server_password", "");
			return live(f.dot);
		}
		rt.setSv(f, "server_password", live(pass));
		return 1;
	} else if ($0 === "PRG_uploadfile") {
		hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "HDD");
		F = null;
		rt.forList(f, 0, rt.fv(f, "stored_files", live(hard_drive)), T("/datum/computer_file"));
		while (($e = rt.next(f, 0)) !== undefined) {
			F = $e;
			if (isEqual(fmt("＀", [rt.fv(f, "uid", live(F))]), rt.at(live(f.args[1]), "id"))) {
				if (truthy(rt.fv(f, "unsendable", live(F)))) {
					rt.setSv(f, "error", "I/O Error: File locked.");
					return live(f.dot);
				}
				if (truthy((rt.istype(live(F), T("/datum/computer_file/program")) ? 1 : 0))) {
					if (!truthy((yield* g.callName(f, (_P_2 = live(F)), "can_run", [null, live(f.usr), "transfer", 1], rt.Args.Named)))) {
						rt.setSv(f, "error", "Access Error: Insufficient rights to upload file.");
					}
				}
				rt.setSv(f, "provided_file", live(F));
				yield* g.callName(f, rt.fv(f, "fileservers", rt.gl("ntnet_global")), "Add", [live(f.src)]);
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
		rt.setSv(f, "error", "I/O Error: Unable to locate file on hard drive.");
		return 1;
	} else if ($0 === "PRG_uploadmenu") {
		rt.setSv(f, "upload_menu", 1);
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /datum/computer_file/program/nttransfer/proc/ui_data  (code/modules/modular_computers/file_system/programs/nttransfer.dm:146)
rt.def("/datum/computer_file/program/nttransfer/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, all_files: Value = null, hard_drive: Value = null, F: Value = null, all_servers: Value = null, _P: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $e: any;
	f.vars = () => [data, all_files, hard_drive, F, all_servers, _P, $0, $1, $2, $3, $4, $5, $6, $7, $8, $e];
	data = rt.callSrc(f, "get_header_data", []);
	if (truthy(rt.sv(f, "error"))) {
		rt.setAt(live(data), "error", rt.sv(f, "error"));
	} else {
		if (truthy(rt.sv(f, "downloaded_file"))) {
			rt.setAt(live(data), "downloading", 1);
			rt.setAt(live(data), "download_size", rt.fv(f, "size", rt.sv(f, "downloaded_file")));
			rt.setAt(live(data), "download_progress", rt.sv(f, "download_completion"));
			rt.setAt(live(data), "download_netspeed", rt.sv(f, "actual_netspeed"));
			rt.setAt(live(data), "download_name", fmt("＀.＀", [rt.fv(f, "filename", rt.sv(f, "downloaded_file")), rt.fv(f, "filetype", rt.sv(f, "downloaded_file"))]));
		} else {
			if (truthy(rt.sv(f, "provided_file"))) {
				rt.setAt(live(data), "uploading", 1);
				rt.setAt(live(data), "upload_uid", rt.sv(f, "unique_token"));
				rt.setAt(live(data), "upload_clients", rt.len(f, rt.sv(f, "connected_clients")));
				$0 = live(data);
				$1 = "upload_haspassword";
				if (truthy(rt.sv(f, "server_password"))) {
					$2 = 1;
				} else {
					$2 = 0;
				}
				rt.setAt($0, $1, $2);
				rt.setAt(live(data), "upload_filename", fmt("＀.＀", [rt.fv(f, "filename", rt.sv(f, "provided_file")), rt.fv(f, "filetype", rt.sv(f, "provided_file"))]));
			} else {
				if (truthy(rt.sv(f, "upload_menu"))) {
					all_files = rt.op(f, "CreateMultidimensionalList", [1], [0]);
					hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "HDD");
					F = null;
					rt.forList(f, 0, rt.fv(f, "stored_files", live(hard_drive)), T("/datum/computer_file"));
					while (($e = rt.next(f, 0)) !== undefined) {
						F = $e;
						rt.callName(f, live(all_files), "Add", [rt.list(rt.alist(f, ["uid", rt.fv(f, "uid", live(F)), "filename", fmt("＀.＀", [rt.fv(f, "filename", live(F)), rt.fv(f, "filetype", live(F))]), "size", rt.fv(f, "size", live(F))]))]);
					}
					rt.endFor(f, 0);
					rt.setAt(live(data), "upload_filelist", live(all_files));
				} else {
					all_servers = rt.op(f, "CreateMultidimensionalList", [1], [0]);
					_P = null;
					rt.forList(f, 0, rt.fv(f, "fileservers", rt.gl("ntnet_global")), T("/datum/computer_file/program/nttransfer"));
					while (($e = rt.next(f, 0)) !== undefined) {
						_P = $e;
						$0 = live(all_servers);
						$1 = "uid";
						$2 = rt.fv(f, "unique_token", live(_P));
						$3 = "filename";
						$4 = fmt("＀.＀", [rt.gv(f, "filename", rt.fv(f, "provided_file", live(_P))), rt.gv(f, "filetype", rt.fv(f, "provided_file", live(_P)))]);
						$5 = "size";
						$6 = rt.gv(f, "size", rt.fv(f, "provided_file", live(_P)));
						$7 = "haspassword";
						if (truthy(rt.fv(f, "server_password", live(_P)))) {
							$8 = 1;
						} else {
							$8 = 0;
						}
						rt.callName(f, $0, "Add", [rt.list(rt.alist(f, [$1, $2, $3, $4, $5, $6, $7, $8]))]);
					}
					rt.endFor(f, 0);
					rt.setAt(live(data), "servers", live(all_servers));
				}
			}
		}
	}
	return live(data);
});
