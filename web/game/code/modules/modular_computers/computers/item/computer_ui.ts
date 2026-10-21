// From code/modules/modular_computers/computers/item/computer_ui.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/device/modular_computer/proc/ui_interact  (code/modules/modular_computers/computers/item/computer_ui.dm:3)  may sleep
rt.def("/obj/item/device/modular_computer/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	let hard_drive: Value = null, assets: Value = null;
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state, hard_drive, assets];
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
	if (!truthy(rt.sv(f, "enabled"))) {
		if (truthy(live(ui))) {
			yield* g.callName(f, live(ui), "close", []);
		}
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "use_power")))) {
		if (truthy(live(ui))) {
			yield* g.callName(f, live(ui), "close", []);
		}
		return 0;
	}
	if ((!truthy(rt.sv(f, "screen_on")) && !truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)))) {
		if (truthy(live(ui))) {
			yield* g.callName(f, live(ui), "close", []);
		}
		return 0;
	}
	if (truthy(rt.sv(f, "active_program"))) {
		if (truthy(live(ui))) {
			yield* g.callName(f, live(ui), "close", []);
		}
		yield* g.callName(f, rt.sv(f, "active_program"), "ui_interact", [live(user)]);
		return live(f.dot);
	}
	if (((!truthy((hard_drive = rt.at(rt.sv(f, "all_components"), "HDD"))) || !truthy(rt.fv(f, "stored_files", live(hard_drive)))) || !truthy(rt.getLen(f, rt.fv(f, "stored_files", live(hard_drive)))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＄！ beeps three times, it's screen displaying a \"DISK ERROR\" warning.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (assets = (yield* g.call(f, P("/proc/get_asset_datum"), null, [T("/datum/asset/simple/headers")]))), "send", [live(user)]);
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "ntos_main", "NTOS Main menu", 400, 500, live(master_ui), live(state)]))), "open", []);
	yield* g.callName(f, live(ui), "set_autoupdate", ["state", 1], rt.Args.Named);
	return f.dot;
}, true);

// /obj/item/device/modular_computer/proc/ui_data  (code/modules/modular_computers/computers/item/computer_ui.dm:43)
rt.def("/obj/item/device/modular_computer/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, hard_drive: Value = null, _P: Value = null, running: Value = null;
	let $e: any;
	f.vars = () => [data, hard_drive, _P, running, $e];
	rt.setAt((data = rt.callSrc(f, "get_header_data", [])), "programs", rt.list());
	hard_drive = rt.at(rt.sv(f, "all_components"), "HDD");
	_P = null;
	rt.forList(f, 0, rt.fv(f, "stored_files", live(hard_drive)), T("/datum/computer_file/program"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		running = 0;
		if (truthy((rt.isIn(f, live(_P), rt.sv(f, "idle_threads")) ? 1 : 0))) {
			running = 1;
		}
		rt.modAt(live(data), "programs", rt.list(rt.alist(f, ["name", rt.fv(f, "filename", live(_P)), "desc", rt.fv(f, "filedesc", live(_P)), "running", live(running)])), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "has_light", rt.sv(f, "has_light"));
	rt.setAt(live(data), "light_on", rt.sv(f, "light_on"));
	rt.setAt(live(data), "comp_light_color", rt.sv(f, "comp_light_color"));
	return live(data);
});

// /obj/item/device/modular_computer/proc/ui_act  (code/modules/modular_computers/computers/item/computer_ui.dm:61)  may sleep
rt.def("/obj/item/device/modular_computer/proc/ui_act", function* ui_act(f: Frame) {
	let hard_drive: Value = null, user: Value = null, prog: Value = null, _P: Value = null, user_3: Value = null, PU: Value = null, new_color: Value = null;
	let $0: any;
	f.vars = () => [hard_drive, user, prog, _P, user_3, PU, new_color, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	hard_drive = rt.at(rt.sv(f, "all_components"), "HDD");
	$0 = live(f.args[0]);
	if ($0 === "PC_exit") {
		yield* g.srcCall(f, "kill_program");
		return 1;
	} else if ($0 === "PC_shutdown") {
		yield* g.srcCall(f, "shutdown_computer");
		return 1;
	} else if ($0 === "PC_minimize") {
		user = live(f.usr);
		if ((!truthy(rt.sv(f, "active_program")) || !truthy(rt.at(rt.sv(f, "all_components"), "CPU")))) {
			return live(f.dot);
		}
		yield* g.callName(f, rt.sv(f, "idle_threads"), "Add", [rt.sv(f, "active_program")]);
		rt.setFv(f, "program_state", rt.sv(f, "active_program"), 1);
		rt.setSv(f, "active_program", null);
		yield* g.srcCall(f, "update_icon");
		if ((truthy(live(user)) && truthy((rt.istype(live(user), T("/mob")) ? 1 : 0)))) {
			yield* g.srcCall(f, "ui_interact", live(user));
		}
	} else if ($0 === "PC_killprogram") {
		prog = rt.at(live(f.args[1]), "name");
		_P = null;
		user_3 = live(f.usr);
		if (truthy(live(hard_drive))) {
			_P = (yield* g.callName(f, live(hard_drive), "find_file_by_name", [live(prog)]));
		}
		if ((!truthy((rt.istype(live(_P), T("/datum/computer_file/program")) ? 1 : 0)) || isEqual(rt.fv(f, "program_state", live(_P)), 0))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(_P), "kill_program", ["forced", 1], rt.Args.Named);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user_3), fmt("<span class='notice'>Program ＀.＀ with PID ＀ has been killed.</span>", [rt.fv(f, "filename", live(_P)), rt.fv(f, "filetype", live(_P)), (yield* g.call(f, P("/proc/rand"), null, [100, 999]))])]);
	} else if ($0 === "PC_runprogram") {
		prog = rt.at(live(f.args[1]), "name");
		_P = null;
		user_3 = live(f.usr);
		if (truthy(live(hard_drive))) {
			_P = (yield* g.callName(f, live(hard_drive), "find_file_by_name", [live(prog)]));
		}
		if ((!truthy(live(_P)) || !truthy((rt.istype(live(_P), T("/datum/computer_file/program")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user_3), fmt("<span class='danger'>＄！'s screen shows \"I/O ERROR - Unable to run program\" warning.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		rt.setFv(f, "computer", live(_P), live(f.src));
		if (!truthy((yield* g.callName(f, live(_P), "is_supported_by_hardware", [rt.sv(f, "hardware_flag"), 1, live(user_3)])))) {
			return live(f.dot);
		}
		if (truthy((rt.isIn(f, live(_P), rt.sv(f, "idle_threads")) ? 1 : 0))) {
			rt.setFv(f, "program_state", live(_P), 2);
			rt.setSv(f, "active_program", live(_P));
			yield* g.callName(f, rt.sv(f, "idle_threads"), "Remove", [live(_P)]);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		}
		PU = rt.at(rt.sv(f, "all_components"), "CPU");
		if (rt.gt(rt.len(f, rt.sv(f, "idle_threads")), rt.fv(f, "max_idle_programs", live(PU)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user_3), fmt("<span class='danger'>＄！ displays a \"Maximal CPU load reached. Unable to run another program.\" error.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if ((truthy(rt.fv(f, "requires_ntnet", live(_P))) && !truthy((yield* g.srcCall(f, "get_ntnet_status", rt.fv(f, "requires_ntnet_feature", live(_P))))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user_3), fmt("<span class='danger'>＄！'s screen shows \"Unable to connect to NTNet. Please retry. If problem persists contact your system administrator.\" warning.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (truthy((yield* g.callName(f, live(_P), "run_program", [live(user_3)])))) {
			rt.setSv(f, "active_program", live(_P));
			yield* g.srcCall(f, "update_icon");
		}
		return 1;
	} else if ($0 === "PC_toggle_light") {
		rt.setSv(f, "light_on", (!truthy(rt.sv(f, "light_on")) ? 1 : 0));
		if (truthy(rt.sv(f, "light_on"))) {
			yield* g.srcCall(f, "set_light", rt.sv(f, "comp_light_luminosity"), 1, rt.sv(f, "comp_light_color"));
		} else {
			yield* g.srcCall(f, "set_light", 0);
		}
	} else if ($0 === "PC_light_color") {
		user = live(f.usr);
		new_color = null;
		while (!truthy(live(new_color))) {
			if (!truthy((new_color = (yield* g.op(f, "Prompt", [257], [null, "Light Color", fmt("Choose a new color for ＀'s flashlight.", [live(f.src)]), live(user), null]))))) {
				return live(f.dot);
			}
			if (rt.lt((yield* g.call(f, P("/proc/color_hex2num"), null, [live(new_color)])), 200)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>That color is too dark! Choose a lighter one.</span>"]);
				new_color = null;
			}
		}
		rt.setSv(f, "comp_light_color", live(new_color));
		rt.setSv(f, "light_color", live(new_color));
		yield* g.srcCall(f, "update_light");
	} else {
		return live(f.dot);
	}
	return f.dot;
}, true, { args: ["action", "params"] });
