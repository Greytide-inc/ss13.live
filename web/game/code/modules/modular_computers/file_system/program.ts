// From code/modules/modular_computers/file_system/program.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/computer_file/program/proc/New  (code/modules/modular_computers/file_system/program.dm:26)
rt.def("/datum/computer_file/program/proc/New", function New(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = null;
	}
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(live(f.args[0])) && truthy((rt.istype(live(f.args[0]), T("/obj/item/device/modular_computer")) ? 1 : 0)))) return f.dot;
	rt.setSv(f, "computer", live(f.args[0]));
	return f.dot;
}, false, { args: ["comp"] });

// /datum/computer_file/program/proc/Destroy  (code/modules/modular_computers/file_system/program.dm:32)  may sleep
rt.def("/datum/computer_file/program/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "computer", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /datum/computer_file/program/proc/clone  (code/modules/modular_computers/file_system/program.dm:35)  may sleep
rt.def("/datum/computer_file/program/proc/clone", function* clone(f: Frame) {
	let temp: Value = null;
	f.vars = () => [temp];
	rt.setFv(f, "required_access", (temp = (yield* g.callSuper(f, [], rt.Args.Same))), rt.sv(f, "required_access"));
	rt.setFv(f, "filedesc", live(temp), rt.sv(f, "filedesc"));
	rt.setFv(f, "program_icon_state", live(temp), rt.sv(f, "program_icon_state"));
	rt.setFv(f, "requires_ntnet", live(temp), rt.sv(f, "requires_ntnet"));
	rt.setFv(f, "requires_ntnet_feature", live(temp), rt.sv(f, "requires_ntnet_feature"));
	rt.setFv(f, "usage_flags", live(temp), rt.sv(f, "usage_flags"));
	return live(temp);
}, true);

// /datum/computer_file/program/proc/update_computer_icon  (code/modules/modular_computers/file_system/program.dm:47)  may sleep
rt.def("/datum/computer_file/program/proc/update_computer_icon", function* update_computer_icon(f: Frame) {
	if (!truthy(rt.sv(f, "computer"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "computer"), "update_icon", []);
	return f.dot;
}, true);

// /datum/computer_file/program/proc/generate_network_log  (code/modules/modular_computers/file_system/program.dm:52)
rt.def("/datum/computer_file/program/proc/generate_network_log", function generate_network_log(f: Frame, text: Value) {
	if (truthy(rt.sv(f, "computer"))) {
		return rt.callName(f, rt.sv(f, "computer"), "add_log", [live(text)]);
	}
	return 0;
});

// /datum/computer_file/program/proc/is_supported_by_hardware  (code/modules/modular_computers/file_system/program.dm:56)
rt.def("/datum/computer_file/program/proc/is_supported_by_hardware", function is_supported_by_hardware(f: Frame, hardware_flag: Value, loud: Value, user: Value) {
	f.vars = () => [hardware_flag, loud, user];
	if (live(hardware_flag) === null) {
		hardware_flag = 0;
	}
	if (live(loud) === null) {
		loud = 0;
	}
	if (live(user) === null) {
		user = null;
	}
	if (!truthy(rt.bitAnd(live(hardware_flag), rt.sv(f, "usage_flags")))) {
		if (((truthy(live(loud)) && truthy(rt.sv(f, "computer"))) && truthy(live(user)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＄！ flashes an \"Hardware Error - Incompatible software\" warning.</span>", [rt.sv(f, "computer")])]);
		}
		return 0;
	}
	return 1;
});

// /datum/computer_file/program/proc/get_signal  (code/modules/modular_computers/file_system/program.dm:64)
rt.def("/datum/computer_file/program/proc/get_signal", function get_signal(f: Frame, specific_action: Value) {
	f.vars = () => [specific_action];
	if (live(specific_action) === null) {
		specific_action = 0;
	}
	if (truthy(rt.sv(f, "computer"))) {
		return rt.callName(f, rt.sv(f, "computer"), "get_ntnet_status", [live(specific_action)]);
	}
	return 0;
});

// /datum/computer_file/program/proc/can_run  (code/modules/modular_computers/file_system/program.dm:76)
rt.def("/datum/computer_file/program/proc/can_run", function can_run(f: Frame, user: Value, loud: Value, access_to_check: Value, transfer: Value) {
	let D: Value = null, card_slot: Value = null, h: Value = null, I: Value = null, C: Value = null;
	f.vars = () => [loud, access_to_check, transfer, D, card_slot, h, I, C];
	if (live(loud) === null) {
		loud = 0;
	}
	if (live(transfer) === null) {
		transfer = 0;
	}
	if (!truthy(live(access_to_check))) {
		if ((truthy(live(transfer)) && truthy(rt.sv(f, "transfer_access")))) {
			access_to_check = rt.sv(f, "transfer_access");
		} else {
			access_to_check = rt.sv(f, "required_access");
		}
	}
	if (!truthy(live(access_to_check))) {
		return 1;
	}
	if (((!truthy(live(transfer)) && truthy(rt.sv(f, "computer"))) && truthy(rt.fv(f, "emagged", rt.sv(f, "computer"))))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(user)]))) {
		return 1;
	}
	if (truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
		return 1;
	}
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		D = null;
		card_slot = null;
		if ((truthy(rt.sv(f, "computer")) && truthy(live(card_slot)))) {
			D = rt.callName(f, (card_slot = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "CARD")), "GetID", []);
		}
		h = live(user);
		I = rt.callName(f, live(h), "get_idcard", []);
		if (truthy((C = rt.callName(f, live(h), "get_active_held_item", [])))) {
			C = rt.callName(f, live(C), "GetID", []);
		}
		if (!(truthy(live(C)) && truthy((rt.istype(live(C), T("/obj/item/weapon/card/id")) ? 1 : 0)))) {
			C = null;
		}
		if (((!truthy(live(I)) && !truthy(live(C))) && !truthy(live(D)))) {
			if (truthy(live(loud))) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＄！ flashes an \"RFID Error - Unable to scan ID\" warning.</span>", [rt.sv(f, "computer")])]);
			}
			return 0;
		}
		if (truthy(live(I))) {
			if (truthy((rt.isIn(f, live(access_to_check), rt.callName(f, live(I), "GetAccess", [])) ? 1 : 0))) {
				return 1;
			}
		} else {
			if (truthy(live(C))) {
				if (truthy((rt.isIn(f, live(access_to_check), rt.callName(f, live(C), "GetAccess", [])) ? 1 : 0))) {
					return 1;
				}
			} else {
				if (truthy(live(D))) {
					if (truthy((rt.isIn(f, live(access_to_check), rt.callName(f, live(D), "GetAccess", [])) ? 1 : 0))) {
						return 1;
					}
				}
			}
		}
		if (truthy(live(loud))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＄！ flashes an \"Access Denied\" warning.</span>", [rt.sv(f, "computer")])]);
		}
	}
	return 0;
});

// /datum/computer_file/program/proc/get_header_data  (code/modules/modular_computers/file_system/program.dm:129)
rt.def("/datum/computer_file/program/proc/get_header_data", function get_header_data(f: Frame) {
	if (truthy(rt.sv(f, "computer"))) {
		return rt.callName(f, rt.sv(f, "computer"), "get_header_data", []);
	}
	return rt.list();
});

// /datum/computer_file/program/proc/run_program  (code/modules/modular_computers/file_system/program.dm:135)
rt.def("/datum/computer_file/program/proc/run_program", function run_program(f: Frame, user: Value) {
	if (truthy(rt.callSrc(f, "can_run", [live(user), 1]))) {
		if ((truthy(rt.sv(f, "requires_ntnet")) && truthy(rt.sv(f, "network_destination")))) {
			rt.callSrc(f, "generate_network_log", [fmt("Connection opened to ＀.", [rt.sv(f, "network_destination")])]);
		}
		rt.setSv(f, "program_state", 2);
		return 1;
	}
	return 0;
});

// /datum/computer_file/program/proc/kill_program  (code/modules/modular_computers/file_system/program.dm:146)
rt.def("/datum/computer_file/program/proc/kill_program", function kill_program(f: Frame, forced: Value) {
	f.vars = () => [forced];
	if (live(forced) === null) {
		forced = 0;
	}
	rt.setSv(f, "program_state", 0);
	if (truthy(rt.sv(f, "network_destination"))) {
		rt.callSrc(f, "generate_network_log", [fmt("Connection to ＀ closed.", [rt.sv(f, "network_destination")])]);
	}
	return 1;
});

// /datum/computer_file/program/proc/ui_interact  (code/modules/modular_computers/file_system/program.dm:151)  may sleep
rt.def("/datum/computer_file/program/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	let assets: Value = null;
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state, assets];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (!(!truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)])))) && truthy(rt.sv(f, "tgui_id")))) return f.dot;
	yield* g.callName(f, (assets = (yield* g.call(f, P("/proc/get_asset_datum"), null, [T("/datum/asset/simple/headers")]))), "send", [live(user)]);
	ui = (yield* g.new_(f, T("/datum/tgui"), [null, live(user), null, live(f.src), null, live(ui_key), null, rt.sv(f, "tgui_id"), null, rt.sv(f, "filedesc"), null, rt.sv(f, "ui_x"), null, rt.sv(f, "ui_y"), "state", live(state)], rt.Args.Named));
	if (truthy(rt.sv(f, "ui_style"))) {
		yield* g.callName(f, live(ui), "set_style", [rt.sv(f, "ui_style")]);
	}
	yield* g.callName(f, live(ui), "set_autoupdate", ["state", 1], rt.Args.Named);
	yield* g.callName(f, live(ui), "open", []);
	return f.dot;
}, true);

// /datum/computer_file/program/proc/ui_act  (code/modules/modular_computers/file_system/program.dm:169)  may sleep
rt.def("/datum/computer_file/program/proc/ui_act", function* ui_act(f: Frame) {
	let user: Value = null;
	let $0: any;
	f.vars = () => [user, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if (!truthy(rt.sv(f, "computer"))) return f.dot;
	$0 = live(f.args[0]);
	if ($0 === "PC_exit") {
		yield* g.callName(f, rt.sv(f, "computer"), "kill_program", []);
		yield* g.callName(f, live(f.args[2]), "close", []);
		return 1;
	} else if ($0 === "PC_shutdown") {
		yield* g.callName(f, rt.sv(f, "computer"), "shutdown_computer", []);
		yield* g.callName(f, live(f.args[2]), "close", []);
		return 1;
	} else if ($0 === "PC_minimize") {
		user = live(f.usr);
		if ((!truthy(rt.fv(f, "active_program", rt.sv(f, "computer"))) || !truthy(rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "CPU")))) {
			return live(f.dot);
		}
		yield* g.callName(f, rt.fv(f, "idle_threads", rt.sv(f, "computer")), "Add", [rt.fv(f, "active_program", rt.sv(f, "computer"))]);
		rt.setSv(f, "program_state", 1);
		rt.setFv(f, "active_program", rt.sv(f, "computer"), null);
		yield* g.callName(f, rt.sv(f, "computer"), "update_icon", []);
		yield* g.callName(f, live(f.args[2]), "close", []);
		if (!(truthy(live(user)) && truthy((rt.istype(live(user), T("/mob")) ? 1 : 0)))) return f.dot;
		yield* g.callName(f, rt.sv(f, "computer"), "ui_interact", [live(user)]);
	}
	return f.dot;
}, true, { args: ["action", "params", "ui"] });

// /datum/computer_file/program/proc/ui_host  (code/modules/modular_computers/file_system/program.dm:198)
rt.def("/datum/computer_file/program/proc/ui_host", function ui_host(f: Frame) {
	if (truthy(rt.fv(f, "physical", rt.sv(f, "computer")))) {
		return rt.fv(f, "physical", rt.sv(f, "computer"));
	}
	return rt.sv(f, "computer");
});

// /datum/computer_file/program/proc/ui_status  (code/modules/modular_computers/file_system/program.dm:204)
rt.def("/datum/computer_file/program/proc/ui_status", function ui_status(f: Frame) {
	if (!isEqual(rt.sv(f, "program_state"), 2)) {
		return -1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user"] });
