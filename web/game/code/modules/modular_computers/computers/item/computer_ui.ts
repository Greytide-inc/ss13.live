// Based on /tg/station's code/modules/modular_computers/computers/item/computer_ui.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add, fmt } = rt;


// computer_ui.dm:3
rt.def("/obj/item/device/modular_computer/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	let hard_drive: Value = null, assets: Value = null;
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (!this.enabled) {
		if (ui) {
			yield* ui.close();
		}
		return 0;
	}
	if (!(yield* this.use_power())) {
		if (ui) {
			yield* ui.close();
		}
		return 0;
	}
	if (!this.screen_on && !rt.istype(user, T("/mob/living/silicon"))) {
		if (ui) {
			yield* ui.close();
		}
		return 0;
	}
	if (this.active_program) {
		if (ui) {
			yield* ui.close();
		}
		yield* this.active_program.ui_interact(user);
		return f.dot;
	}
	if (!(hard_drive = rt.at(this.all_components, "HDD")) || !hard_drive.stored_files || !rt.len(f, hard_drive.stored_files)) {
		to_chat(user, fmt("<span class='danger'>＄！ beeps three times, it's screen displaying a \"DISK ERROR\" warning.</span>", [this]));
		return f.dot;
	}
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (assets = (yield* get_asset_datum(T("/datum/asset/simple/headers")))).send(user);
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "ntos_main", "NTOS Main menu", 400, 500, master_ui, state))).open();
	yield* ui.set_autoupdate({ state: 1 });
	return f.dot;
}, true);

// computer_ui.dm:43
rt.def("/obj/item/device/modular_computer/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, _P: Value = null, running: Value = null;
	rt.setAt((data = this.get_header_data()), "programs", list());
	let hard_drive: Value = rt.at(this.all_components, "HDD");
	for (_P of each(hard_drive.stored_files, T("/datum/computer_file/program"))) {
		running = 0;
		if (rt.isIn(f, _P, this.idle_threads)) {
			running = 1;
		}
		rt.modAt(data, "programs", list(rt.alist(f, ["name", _P.filename, "desc", _P.filedesc, "running", running])), add);
	}
	rt.setAt(data, "has_light", this.has_light);
	rt.setAt(data, "light_on", this.light_on);
	rt.setAt(data, "comp_light_color", this.comp_light_color);
	return data;
});

// computer_ui.dm:61
rt.def("/obj/item/device/modular_computer/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let user: Value = null, prog: Value = null, _P: Value = null, user_3: Value = null, PU: Value = null, new_color: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let hard_drive: Value = rt.at(this.all_components, "HDD");
	if (action === "PC_exit") {
		yield* this.kill_program();
		return 1;
	} else if (action === "PC_shutdown") {
		yield* this.shutdown_computer();
		return 1;
	} else if (action === "PC_minimize") {
		user = f.usr;
		if (!this.active_program || !rt.at(this.all_components, "CPU")) {
			return f.dot;
		}
		this.idle_threads.Add(this.active_program);
		this.active_program.program_state = 1;
		this.active_program = null;
		yield* this.update_icon();
		if (user && rt.istype(user, T("/mob"))) {
			yield* this.ui_interact(user);
		}
	} else if (action === "PC_killprogram") {
		prog = rt.at(params, "name");
		user_3 = f.usr;
		if (hard_drive) {
			_P = hard_drive.find_file_by_name(prog);
		}
		if (!rt.istype(_P, T("/datum/computer_file/program")) || _P.program_state == 0) {
			return f.dot;
		}
		yield* _P.kill_program({ forced: 1 });
		to_chat(user_3, `<span class='notice'>Program ${_P.filename}.${_P.filetype} with PID ${rand(100, 999)} has been killed.</span>`);
	} else if (action === "PC_runprogram") {
		prog = rt.at(params, "name");
		_P = null;
		user_3 = f.usr;
		if (hard_drive) {
			_P = hard_drive.find_file_by_name(prog);
		}
		if (!_P || !rt.istype(_P, T("/datum/computer_file/program"))) {
			to_chat(user_3, fmt("<span class='danger'>＄！'s screen shows \"I/O ERROR - Unable to run program\" warning.</span>", [this]));
			return f.dot;
		}
		_P.computer = this;
		if (!_P.is_supported_by_hardware(this.hardware_flag, 1, user_3)) {
			return f.dot;
		}
		if (rt.isIn(f, _P, this.idle_threads)) {
			_P.program_state = 2;
			this.active_program = _P;
			yield* this.idle_threads.Remove(_P);
			yield* this.update_icon();
			return f.dot;
		}
		PU = rt.at(this.all_components, "CPU");
		if (rt.len(f, this.idle_threads) > PU.max_idle_programs) {
			to_chat(user_3, fmt("<span class='danger'>＄！ displays a \"Maximal CPU load reached. Unable to run another program.\" error.</span>", [this]));
			return f.dot;
		}
		if (_P.requires_ntnet && !this.get_ntnet_status(_P.requires_ntnet_feature)) {
			to_chat(user_3, fmt("<span class='danger'>＄！'s screen shows \"Unable to connect to NTNet. Please retry. If problem persists contact your system administrator.\" warning.</span>", [this]));
			return f.dot;
		}
		if (yield* _P.run_program(user_3)) {
			this.active_program = _P;
			yield* this.update_icon();
		}
		return 1;
	} else if (action === "PC_toggle_light") {
		this.light_on = (!this.light_on ? 1 : 0);
		if (this.light_on) {
			this.set_light(this.comp_light_luminosity, 1, this.comp_light_color);
		} else {
			this.set_light(0);
		}
	} else if (action === "PC_light_color") {
		user = f.usr;
		while (!new_color) {
			if (!(new_color = (yield* g.op(f, "Prompt", [257], [null, "Light Color", `Choose a new color for ${this}'s flashlight.`, user, null])))) {
				return f.dot;
			}
			if (color_hex2num(new_color) < 200) {
				to_chat(user, "<span class='warning'>That color is too dark! Choose a lighter one.</span>");
				new_color = null;
			}
		}
		this.comp_light_color = new_color;
		this.light_color = new_color;
		yield* this.update_light();
	} else {
		return f.dot;
	}
	return f.dot;
}, true);
