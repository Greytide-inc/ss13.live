// Based on /tg/station's code/modules/modular_computers/file_system/programs/nttransfer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


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

// nttransfer.dm:17
rt.def("/datum/computer_file/program/nttransfer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.connected_clients = list();
	return f.dot;
});

// nttransfer.dm:27
rt.def("/datum/computer_file/program/nttransfer/proc/New", function New(f: Frame) {
	this.unique_token = rt.incGl("nttransfer_uid", 1, true);
	parent_proc();
	return f.dot;
});

// nttransfer.dm:32
rt.def("/datum/computer_file/program/nttransfer/proc/process_tick", function process_tick(f: Frame) {
	let C: Value = null;
	this.update_netspeed();
	if (this.provided_file) {
		for (C of each(this.connected_clients, T("/datum/computer_file/program/nttransfer"))) {
			C.actual_netspeed = min(C.download_netspeed, this.download_netspeed);
			C.download_completion += C.actual_netspeed;
			if (C.download_completion >= rt.fv(f, "size", this.provided_file)) {
				C.finish_download();
			}
		}
	} else {
		if (!this.downloaded_file) return f.dot;
		if (this.remote) return f.dot;
		this.crash_download("Connection to remote server lost");
	}
	return f.dot;
});

// nttransfer.dm:48
rt.def("/datum/computer_file/program/nttransfer/proc/kill_program", function kill_program(f: Frame, forced: Value) {
	let _P: Value = null;
	forced ??= 0;
	if (this.downloaded_file) {
		this.finalize_download();
	}
	if (this.provided_file) {
		for (_P of each(this.connected_clients, T("/datum/computer_file/program/nttransfer"))) {
			_P.crash_download("Connection terminated by remote server");
		}
		this.downloaded_file = null;
	}
	parent_proc(forced);
	return f.dot;
});

// nttransfer.dm:58
rt.def("/datum/computer_file/program/nttransfer/proc/update_netspeed", function update_netspeed(f: Frame) {
	this.download_netspeed = 0;
	if (this.ntnet_status === 1) {
		this.download_netspeed = NTNETSPEED_LOWSIGNAL;
	} else if (this.ntnet_status === 2) {
		this.download_netspeed = NTNETSPEED_HIGHSIGNAL;
	} else if (this.ntnet_status === 3) {
		this.download_netspeed = NTNETSPEED_ETHERNET;
	}
	return f.dot;
});

// nttransfer.dm:68
rt.def("/datum/computer_file/program/nttransfer/proc/finish_download", function finish_download(f: Frame) {
	let hard_drive: Value = rt.index(this.computer.all_components, "HDD");
	if (!this.computer || !hard_drive || !hard_drive.store_file(this.downloaded_file)) {
		this.error = "I/O Error:  Unable to save file. Check your hard drive and try again.";
	}
	this.finalize_download();
	return f.dot;
});

// nttransfer.dm:75
rt.def("/datum/computer_file/program/nttransfer/proc/crash_download", function crash_download(f: Frame, message: Value) {
	this.error = message ? message : "An unknown error has occurred during download";
	this.finalize_download();
	return f.dot;
});

// nttransfer.dm:81
rt.def("/datum/computer_file/program/nttransfer/proc/finalize_download", function finalize_download(f: Frame) {
	if (this.remote) {
		this.remote.connected_clients.Remove(this);
	}
	this.downloaded_file = null;
	this.remote = null;
	this.download_completion = 0;
	return f.dot;
});

// nttransfer.dm:87
rt.def("/datum/computer_file/program/nttransfer/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let _P: Value = null, pass: Value = null, _T: Value = null, hard_drive: Value = null, F: Value = null, _P_2: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return 1;
	}
	if (action === "PRG_downloadfile") {
		for (_P of each(GLOB.ntnet_global.fileservers, T("/datum/computer_file/program/nttransfer"))) {
			if (`${_P.unique_token}` == rt.at(params, "id")) {
				this.remote = _P;
				break;
			}
		}
		if (!this.remote || !this.remote.provided_file) {
			return f.dot;
		}
		if (this.remote.server_password) {
			if ((pass = reject_bad_text((yield* g.op(f, "Prompt", [2], [null, "Password required", "Code 401 Unauthorized. Please enter password:", f.usr, null])))) != this.remote.server_password) {
				this.error = "Incorrect Password";
				return f.dot;
			}
		}
		this.downloaded_file = (yield* this.remote.provided_file.clone());
		this.remote.connected_clients.Add(this);
		return 1;
	} else if (action === "PRG_reset") {
		this.error = "";
		this.upload_menu = 0;
		this.finalize_download();
		if (rt.isIn(f, this, GLOB.ntnet_global.fileservers)) {
			yield* GLOB.ntnet_global.fileservers.Remove(this);
		}
		for (_T of each(this.connected_clients, T("/datum/computer_file/program/nttransfer"))) {
			_T.crash_download("Remote server has forcibly closed the connection");
		}
		this.provided_file = null;
		return 1;
	} else if (action === "PRG_setpassword") {
		if (!(pass = reject_bad_text((yield* g.op(f, "Prompt", [2], ["none", "Server security", "Enter new server password. Leave blank to cancel, input 'none' to disable password.", f.usr, null]))))) {
			return f.dot;
		}
		if (pass == "none") {
			this.server_password = "";
			return f.dot;
		}
		this.server_password = pass;
		return 1;
	} else if (action === "PRG_uploadfile") {
		hard_drive = rt.index(this.computer.all_components, "HDD");
		for (F of each(hard_drive.stored_files, T("/datum/computer_file"))) {
			if (`${F.uid}` == rt.at(params, "id")) {
				if (F.unsendable) {
					this.error = "I/O Error: File locked.";
					return f.dot;
				}
				if (rt.istype(F, T("/datum/computer_file/program"))) {
					if (!(yield* (_P_2 = F).can_run(f.usr, { transfer: 1 }))) {
						this.error = "Access Error: Insufficient rights to upload file.";
					}
				}
				this.provided_file = F;
				GLOB.ntnet_global.fileservers.Add(this);
				return f.dot;
			}
		}
		this.error = "I/O Error: Unable to locate file on hard drive.";
		return 1;
	} else if (action === "PRG_uploadmenu") {
		this.upload_menu = 1;
	}
	return f.dot;
}, true);

// nttransfer.dm:146
rt.def("/datum/computer_file/program/nttransfer/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let all_files: Value = null, hard_drive: Value = null, F: Value = null, all_servers: Value = null, _P: Value = null;
	let $e: any;
	let data: Value = this.get_header_data();
	if (this.error) {
		rt.setAt(data, "error", this.error);
	} else if (this.downloaded_file) {
		rt.setAt(data, "downloading", 1);
		rt.setAt(data, "download_size", rt.fv(f, "size", this.downloaded_file));
		rt.setAt(data, "download_progress", this.download_completion);
		rt.setAt(data, "download_netspeed", this.actual_netspeed);
		rt.setAt(data, "download_name", `${this.downloaded_file.filename}.${this.downloaded_file.filetype}`);
	} else if (this.provided_file) {
		rt.setAt(data, "uploading", 1);
		rt.setAt(data, "upload_uid", this.unique_token);
		rt.setAt(data, "upload_clients", rt.len(f, this.connected_clients));
		rt.setAt(data, "upload_haspassword", this.server_password ? 1 : 0);
		rt.setAt(data, "upload_filename", `${this.provided_file.filename}.${this.provided_file.filetype}`);
	} else if (this.upload_menu) {
		all_files = rt.op(f, "CreateMultidimensionalList", [1], [0]);
		hard_drive = rt.index(this.computer.all_components, "HDD");
		for (F of each(hard_drive.stored_files, T("/datum/computer_file"))) {
			all_files.Add(list(rt.alist(f, ["uid", F.uid, "filename", `${F.filename}.${F.filetype}`, "size", rt.fv(f, "size", F)])));
		}
		rt.setAt(data, "upload_filelist", all_files);
	} else {
		all_servers = rt.op(f, "CreateMultidimensionalList", [1], [0]);
		for (_P of each(GLOB.ntnet_global.fileservers, T("/datum/computer_file/program/nttransfer"))) {
			all_servers.Add(list(rt.alist(f, ["uid", _P.unique_token, "filename", `${_P.provided_file.filename}.${_P.provided_file.filetype}`, "size", rt.fv(f, "size", _P.provided_file), "haspassword", _P.server_password ? 1 : 0])));
		}
		rt.setAt(data, "servers", all_servers);
	}
	return data;
});
