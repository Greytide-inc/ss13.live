// Based on /tg/station's code/modules/modular_computers/NTNet/NTNet.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// NTNet.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalntnet_global", function* InitGlobalntnet_global(f: Frame) {
	GLOB.ntnet_global = (yield* new_(T("/datum/ntnet")));
	this.gvars_datum_init_order += "ntnet_global";
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

// NTNet.dm:6
rt.def("/datum/ntnet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.relays = list();

	this.logs = list();

	this.available_station_software = list();

	this.available_antag_software = list();

	this.chat_channels = list();

	this.fileservers = list();
	return f.dot;
});

// NTNet.dm:29
rt.def("/datum/ntnet/proc/New", function* New(f: Frame) {
	let R: Value = null;
	if (GLOB.ntnet_global && GLOB.ntnet_global != this) {
		GLOB.ntnet_global = this;
	}
	for (R of each(GLOB.machines, T("/obj/machinery/ntnet_relay"))) {
		this.relays.Add(R);
		R.NTNet = this;
	}
	yield* this.build_software_lists();
	yield* this.add_log("NTNet logging system activated.");
	return f.dot;
}, true);

// NTNet.dm:39
rt.def("/datum/ntnet/proc/add_log", function add_log(f: Frame, log_string: Value, source: Value) {
	let log_text: Value = `${worldtime2text()} - `;
	if (source) {
		log_text += `${source.get_network_tag()} - `;
	} else {
		log_text += "*SYSTEM* - ";
	}
	log_text += log_string;
	this.logs.Add(log_text);
	if (!(rt.len(f, this.logs) > this.setting_maxlogcount)) return f.dot;
	this.logs = this.logs.Copy(rt.len(f, this.logs) - this.setting_maxlogcount, 0);
	return f.dot;
});

// NTNet.dm:55
rt.def("/datum/ntnet/proc/check_function", function check_function(f: Frame, specific_action: Value) {
	let M: Value = null, R: Value = null;
	let $e: any;
	specific_action ??= 0;
	if (!this.relays || !rt.len(f, this.relays)) {
		return 0;
	}
	let operating: Value = 0;
	for (M of each(this.relays)) {
		if ((R = M).is_operational()) {
			operating = NTNET_SOFTWAREDOWNLOAD;
			break;
		}
	}
	if (this.setting_disabled) {
		return 0;
	}
	if (specific_action === NTNET_SOFTWAREDOWNLOAD) {
		return (operating && this.setting_softwaredownload);
	} else if (specific_action === NTNET_PEERTOPEER) {
		return (operating && this.setting_peertopeer);
	} else if (specific_action === NTNET_COMMUNICATION) {
		return (operating && this.setting_communication);
	} else if (specific_action === NTNET_SYSTEMCONTROL) {
		return (operating && this.setting_systemcontrol);
	}
	return operating;
});

// NTNet.dm:83
rt.def("/datum/ntnet/proc/build_software_lists", function* build_software_lists(f: Frame) {
	let F: Value = null, prog: Value = null;
	this.available_station_software = list();
	this.available_antag_software = list();
	for (F of each(typesof(T("/datum/computer_file/program")))) {
		if (!(prog = (yield* new_(F))) || prog.filename == "UnknownProgram" || prog.filetype != "PRG") {
			continue;
		}
		if (prog.available_on_ntnet) {
			this.available_station_software.Add(prog);
		}
		if (prog.available_on_syndinet) {
			this.available_antag_software.Add(prog);
		}
	}
	return f.dot;
}, true);

// NTNet.dm:98
rt.def("/datum/ntnet/proc/find_ntnet_file_by_name", function find_ntnet_file_by_name(f: Frame, filename: Value) {
	let N: Value = null, _P: Value = null;
	for (N of each(this.available_station_software)) {
		_P = N;
		if (filename == _P.filename) {
			return _P;
		}
	}
	N = null;
	for (N of each(this.available_antag_software)) {
		_P = N;
		if (filename == _P.filename) {
			return _P;
		}
	}
	return f.dot;
});

// NTNet.dm:112
rt.def("/datum/ntnet/proc/toggleIDS", function toggleIDS(f: Frame) {
	this.resetIDS();
	this.intrusion_detection_enabled = (!this.intrusion_detection_enabled ? 1 : 0);
	return f.dot;
});

// NTNet.dm:117
rt.def("/datum/ntnet/proc/purge_logs", function purge_logs(f: Frame) {
	this.logs = list();
	this.add_log("-!- LOGS DELETED BY SYSTEM OPERATOR -!-");
	return f.dot;
});

// NTNet.dm:122
rt.def("/datum/ntnet/proc/update_max_log_count", function update_max_log_count(f: Frame, lognumber: Value) {
	if (!lognumber) {
		return 0;
	}
	this.setting_maxlogcount = (lognumber = max(10, min(lognumber, 300)));
	this.add_log(`Configuration Updated. Now keeping ${this.setting_maxlogcount} logs in system memory.`);
	return f.dot;
});

// NTNet.dm:130
rt.def("/datum/ntnet/proc/toggle_function", function toggle_function(f: Frame, _function: Value) {
	if (!_function) {
		return f.dot;
	}
	let $0: any = (_function = text2num(_function));
	if ($0 === 1) {
		this.setting_softwaredownload = (!this.setting_softwaredownload ? 1 : 0);
		if (this.setting_softwaredownload) {
			$0 = "allows";
		} else {
			$0 = "disallows";
		}
		this.add_log(`Configuration Updated. Wireless network firewall now ${$0} connection to software repositories.`);
	} else if ($0 === NTNET_PEERTOPEER) {
		this.setting_peertopeer = (!this.setting_peertopeer ? 1 : 0);
		if (this.setting_peertopeer) {
			$0 = "allows";
		} else {
			$0 = "disallows";
		}
		this.add_log(`Configuration Updated. Wireless network firewall now ${$0} peer to peer network traffic.`);
	} else if ($0 === NTNET_COMMUNICATION) {
		this.setting_communication = (!this.setting_communication ? 1 : 0);
		if (this.setting_communication) {
			$0 = "allows";
		} else {
			$0 = "disallows";
		}
		this.add_log(`Configuration Updated. Wireless network firewall now ${$0} instant messaging and similar communication services.`);
	} else if ($0 === NTNET_SYSTEMCONTROL) {
		this.setting_systemcontrol = (!this.setting_systemcontrol ? 1 : 0);
		if (this.setting_systemcontrol) {
			$0 = "allows";
		} else {
			$0 = "disallows";
		}
		this.add_log(`Configuration Updated. Wireless network firewall now ${$0} remote control of station's systems.`);
	}
	return f.dot;
});
