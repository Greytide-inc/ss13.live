// Based on /tg/station's code/modules/modular_computers/file_system/programs/ntdownloader.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// ntdownloader.dm:26
rt.def("/datum/computer_file/program/ntnetdownload/proc/begin_file_download", function* begin_file_download(f: Frame, filename: Value) {
	let PRG: Value = null;
	if (this.downloaded_file) {
		return 0;
	}
	if (!(PRG = GLOB.ntnet_global.find_ntnet_file_by_name(filename)) || !rt.istype(PRG, T("/datum/computer_file/program"))) {
		return 0;
	}
	if (PRG.available_on_syndinet && !this.computer.emagged) {
		return 0;
	}
	let hard_drive: Value = rt.index(this.computer.all_components, "HDD");
	if (!this.computer || !hard_drive || !hard_drive.can_store_file(PRG)) {
		return 0;
	}
	this.ui_header = "downloader_running.gif";
	if (rt.isIn(f, PRG, GLOB.ntnet_global.available_station_software)) {
		this.generate_network_log(`Began downloading file ${PRG.filename}.${PRG.filetype} from NTNet Software Repository.`);
		this.hacked_download = 0;
	} else if (rt.isIn(f, PRG, GLOB.ntnet_global.available_antag_software)) {
		this.generate_network_log(`Began downloading file **ENCRYPTED**.${PRG.filetype} from unspecified server.`);
		this.hacked_download = 1;
	} else {
		this.generate_network_log(`Began downloading file ${PRG.filename}.${PRG.filetype} from unspecified server.`);
		this.hacked_download = 0;
	}
	this.downloaded_file = (yield* PRG.clone());
	return f.dot;
}, true);

// ntdownloader.dm:55
rt.def("/datum/computer_file/program/ntnetdownload/proc/abort_file_download", function abort_file_download(f: Frame) {
	let $0: any;
	if (!this.downloaded_file) {
		return f.dot;
	}
	if (this.hacked_download) {
		$0 = "**ENCRYPTED**";
	} else {
		$0 = `${this.downloaded_file.filename}.${this.downloaded_file.filetype}`;
	}
	this.generate_network_log(`Aborted download of file ${$0}.`);
	this.downloaded_file = null;
	this.download_completion = 0;
	this.ui_header = "downloader_finished.gif";
	return f.dot;
});

// ntdownloader.dm:63
rt.def("/datum/computer_file/program/ntnetdownload/proc/complete_file_download", function complete_file_download(f: Frame) {
	let $0: any;
	if (!this.downloaded_file) {
		return f.dot;
	}
	if (this.hacked_download) {
		$0 = "**ENCRYPTED**";
	} else {
		$0 = `${this.downloaded_file.filename}.${this.downloaded_file.filetype}`;
	}
	this.generate_network_log(`Completed download of file ${$0}.`);
	let hard_drive: Value = rt.index(this.computer.all_components, "HDD");
	if (!this.computer || !hard_drive || !hard_drive.store_file(this.downloaded_file)) {
		this.downloaderror = "I/O ERROR - Unable to save file. Check whether you have enough free space on your hard drive and whether your hard drive is properly connected. If the issue persists contact your system administrator for assistance.";
	}
	this.downloaded_file = null;
	this.download_completion = 0;
	this.ui_header = "downloader_finished.gif";
	return f.dot;
});

// ntdownloader.dm:75
rt.def("/datum/computer_file/program/ntnetdownload/proc/process_tick", function process_tick(f: Frame) {
	if (!this.downloaded_file) {
		return f.dot;
	}
	if (this.download_completion >= rt.fv(f, "size", this.downloaded_file)) {
		this.complete_file_download();
	}
	this.download_netspeed = 0;
	if (this.ntnet_status === 1) {
		this.download_netspeed = NTNETSPEED_LOWSIGNAL;
	} else if (this.ntnet_status === 2) {
		this.download_netspeed = NTNETSPEED_HIGHSIGNAL;
	} else if (this.ntnet_status === 3) {
		this.download_netspeed = NTNETSPEED_ETHERNET;
	}
	this.download_completion += this.download_netspeed;
	return f.dot;
});

// ntdownloader.dm:92
rt.def("/datum/computer_file/program/ntnetdownload/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if (yield* parent_proc()) {
		return 1;
	}
	if (action === "PRG_downloadfile") {
		if (!this.downloaded_file) {
			yield* this.begin_file_download(rt.at(params, "filename"));
		}
		return 1;
	} else if (action === "PRG_reseterror") {
		if (this.downloaderror) {
			this.download_completion = 0;
			this.download_netspeed = 0;
			this.downloaded_file = null;
			this.downloaderror = "";
		}
		return 1;
	}
	return 0;
}, true);

// ntdownloader.dm:109
rt.def("/datum/computer_file/program/ntnetdownload/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let hard_drive: Value = null, all_entries: Value = null, A: Value = null, _P: Value = null, hacked_programs: Value = null, S: Value = null, _P_5: Value = null;
	this.my_computer = this.computer;
	if (!rt.istype(this.my_computer, T("/obj/item/device/modular_computer"))) {
		return f.dot;
	}
	let data: Value = this.get_header_data();
	if (this.downloaderror) {
		rt.setAt(data, "error", this.downloaderror);
	} else if (this.downloaded_file) {
		rt.setAt(data, "downloadname", this.downloaded_file.filename);
		rt.setAt(data, "downloaddesc", this.downloaded_file.filedesc);
		rt.setAt(data, "downloadsize", rt.fv(f, "size", this.downloaded_file));
		rt.setAt(data, "downloadspeed", this.download_netspeed);
		rt.setAt(data, "downloadcompletion", round(this.download_completion, 0.1));
	} else {
		hard_drive = rt.index(this.my_computer.all_components, "HDD");
		rt.setAt(data, "disk_size", hard_drive.max_capacity);
		rt.setAt(data, "disk_used", hard_drive.used_capacity);
		all_entries = rt.op(f, "CreateMultidimensionalList", [1], [0]);
		for (A of each(GLOB.ntnet_global.available_station_software)) {
			if (!(_P = A).can_run(user, { transfer: 1 })) {
				continue;
			}
			all_entries.Add(list(rt.alist(f, ["filename", _P.filename, "filedesc", _P.filedesc, "fileinfo", _P.extended_desc, "compatibility", this.check_compatibility(_P), "size", rt.fv(f, "size", _P)])));
		}
		rt.setAt(data, "hackedavailable", 0);
		if (this.computer.emagged) {
			hacked_programs = rt.op(f, "CreateMultidimensionalList", [1], [0]);
			for (S of each(GLOB.ntnet_global.available_antag_software)) {
				_P_5 = S;
				rt.setAt(data, "hackedavailable", 1);
				hacked_programs.Add(list(rt.alist(f, ["filename", _P_5.filename, "filedesc", _P_5.filedesc, "fileinfo", _P_5.extended_desc, "size", rt.fv(f, "size", _P_5)])));
			}
			rt.setAt(data, "hacked_programs", hacked_programs);
		}
		rt.setAt(data, "downloadable_programs", all_entries);
	}
	return data;
});

// ntdownloader.dm:163
rt.def("/datum/computer_file/program/ntnetdownload/proc/check_compatibility", function check_compatibility(f: Frame, _P: Value) {
	let hardflag: Value = this.computer.hardware_flag;
	if (_P && _P.is_supported_by_hardware(hardflag, 0)) {
		return "Compatible";
	}
	return "Incompatible!";
});

// ntdownloader.dm:168
rt.def("/datum/computer_file/program/ntnetdownload/proc/kill_program", function kill_program(f: Frame, forced: Value) {
	this.abort_file_download();
	return parent_proc(forced);
});
