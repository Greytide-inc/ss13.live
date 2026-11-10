// Based on /tg/station's code/modules/modular_computers/file_system/program.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4159, "/datum/computer_file/program", "/datum/computer_file", {
	required_access: null,
	transfer_access: null,
	program_state: 0,
	computer: null,
	filedesc: "Unknown Program",
	extended_desc: "N/A",
	program_icon_state: null,
	requires_ntnet: 0,
	requires_ntnet_feature: 0,
	ntnet_status: 1,
	usage_flags: 7,
	network_destination: null,
	available_on_ntnet: 1,
	available_on_syndinet: 0,
	tgui_id: null,
	ui_style: null,
	ui_x: 575,
	ui_y: 700,
	ui_header: null,
	filetype: "PRG",
	filename: "UnknownProgram",
});

// program.dm:26
rt.def("/datum/computer_file/program/proc/New", function New(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = null;
	}
	parent_proc();
	if (!(f.args[0] && rt.istype(f.args[0], T("/obj/item/device/modular_computer")))) return f.dot;
	this.computer = f.args[0];
	return f.dot;
}, false, { args: ["comp"] });

// program.dm:32
rt.def("/datum/computer_file/program/proc/Destroy", function* Destroy(f: Frame) {
	this.computer = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// program.dm:35
rt.def("/datum/computer_file/program/proc/clone", function* clone(f: Frame) {
	let temp: Value = null;
	(temp = (yield* parent_proc())).required_access = this.required_access;
	temp.filedesc = this.filedesc;
	temp.program_icon_state = this.program_icon_state;
	temp.requires_ntnet = this.requires_ntnet;
	temp.requires_ntnet_feature = this.requires_ntnet_feature;
	temp.usage_flags = this.usage_flags;
	return temp;
}, true);

// program.dm:47
rt.def("/datum/computer_file/program/proc/update_computer_icon", function* update_computer_icon(f: Frame) {
	if (!this.computer) return f.dot;
	yield* this.computer.update_icon();
	return f.dot;
}, true);

// program.dm:52
rt.def("/datum/computer_file/program/proc/generate_network_log", function generate_network_log(f: Frame, text: Value) {
	if (this.computer) {
		return this.computer.add_log(text);
	}
	return 0;
});

// program.dm:56
rt.def("/datum/computer_file/program/proc/is_supported_by_hardware", function is_supported_by_hardware(f: Frame, hardware_flag: Value, loud: Value, user: Value) {
	hardware_flag ??= 0;
	loud ??= 0;
	if (!rt.bitAnd(hardware_flag, this.usage_flags)) {
		if (loud && this.computer && user) {
			to_chat(user, fmt("<span class='danger'>＄！ flashes an \"Hardware Error - Incompatible software\" warning.</span>", [this.computer]));
		}
		return 0;
	}
	return 1;
});

// program.dm:64
rt.def("/datum/computer_file/program/proc/get_signal", function get_signal(f: Frame, specific_action: Value) {
	specific_action ??= 0;
	if (this.computer) {
		return this.computer.get_ntnet_status(specific_action);
	}
	return 0;
});

// program.dm:76
rt.def("/datum/computer_file/program/proc/can_run", function can_run(f: Frame, user: Value, loud: Value, access_to_check: Value, transfer: Value) {
	let D: Value = null, card_slot: Value = null, h: Value = null, I: Value = null, C: Value = null;
	loud ??= 0;
	transfer ??= 0;
	if (!access_to_check) {
		if (transfer && this.transfer_access) {
			access_to_check = this.transfer_access;
		} else {
			access_to_check = this.required_access;
		}
	}
	if (!access_to_check) {
		return 1;
	}
	if (!transfer && this.computer && this.computer.emagged) {
		return 1;
	}
	if (IsAdminGhost(user)) {
		return 1;
	}
	if (rt.istype(user, T("/mob/living/silicon"))) {
		return 1;
	}
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if (this.computer && card_slot) {
			D = (card_slot = rt.index(this.computer.all_components, "CARD")).GetID();
		}
		h = user;
		I = h.get_idcard();
		if (C = h.get_active_held_item()) {
			C = C.GetID();
		}
		if (!(C && rt.istype(C, T("/obj/item/weapon/card/id")))) {
			C = null;
		}
		if (!I && !C && !D) {
			if (loud) {
				to_chat(user, fmt("<span class='danger'>＄！ flashes an \"RFID Error - Unable to scan ID\" warning.</span>", [this.computer]));
			}
			return 0;
		}
		if (I) {
			if (rt.isIn(f, access_to_check, I.GetAccess())) {
				return 1;
			}
		} else if (C) {
			if (rt.isIn(f, access_to_check, C.GetAccess())) {
				return 1;
			}
		} else if (D) {
			if (rt.isIn(f, access_to_check, D.GetAccess())) {
				return 1;
			}
		}
		if (loud) {
			to_chat(user, fmt("<span class='danger'>＄！ flashes an \"Access Denied\" warning.</span>", [this.computer]));
		}
	}
	return 0;
});

// program.dm:129
rt.def("/datum/computer_file/program/proc/get_header_data", function get_header_data(f: Frame) {
	if (this.computer) {
		return this.computer.get_header_data();
	}
	return list();
});

// program.dm:135
rt.def("/datum/computer_file/program/proc/run_program", function run_program(f: Frame, user: Value) {
	if (this.can_run(user, 1)) {
		if (this.requires_ntnet && this.network_destination) {
			this.generate_network_log(`Connection opened to ${this.network_destination}.`);
		}
		this.program_state = 2;
		return 1;
	}
	return 0;
});

// program.dm:146
rt.def("/datum/computer_file/program/proc/kill_program", function kill_program(f: Frame, forced: Value) {
	forced ??= 0;
	this.program_state = 0;
	if (this.network_destination) {
		this.generate_network_log(`Connection to ${this.network_destination} closed.`);
	}
	return 1;
});

// program.dm:151
rt.def("/datum/computer_file/program/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	let assets: Value = null;
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (!(!(ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) && this.tgui_id)) return f.dot;
	yield* (assets = (yield* get_asset_datum(T("/datum/asset/simple/headers")))).send(user);
	ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, this.tgui_id, this.filedesc, this.ui_x, this.ui_y, { state: state }));
	if (this.ui_style) {
		ui.set_style(this.ui_style);
	}
	yield* ui.set_autoupdate({ state: 1 });
	yield* ui.open();
	return f.dot;
}, true);

// program.dm:169
rt.def("/datum/computer_file/program/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value) {
	let user: Value = null;
	if (yield* parent_proc()) {
		return 1;
	}
	if (!this.computer) return f.dot;
	if (action === "PC_exit") {
		yield* this.computer.kill_program();
		yield* ui.close();
		return 1;
	} else if (action === "PC_shutdown") {
		yield* this.computer.shutdown_computer();
		yield* ui.close();
		return 1;
	} else if (action === "PC_minimize") {
		user = f.usr;
		if (!this.computer.active_program || !rt.index(this.computer.all_components, "CPU")) {
			return f.dot;
		}
		this.computer.idle_threads.Add(this.computer.active_program);
		this.program_state = 1;
		this.computer.active_program = null;
		yield* this.computer.update_icon();
		yield* ui.close();
		if (!(user && rt.istype(user, T("/mob")))) return f.dot;
		yield* this.computer.ui_interact(user);
	}
	return f.dot;
}, true);

// program.dm:198
rt.def("/datum/computer_file/program/proc/ui_host", function ui_host(f: Frame) {
	if (this.computer.physical) {
		return this.computer.physical;
	}
	return this.computer;
});

// program.dm:204
rt.def("/datum/computer_file/program/proc/ui_status", function ui_status(f: Frame, user: Value) {
	if (this.program_state != 2) {
		return UI_CLOSE;
	}
	return parent_proc();
}, false);
