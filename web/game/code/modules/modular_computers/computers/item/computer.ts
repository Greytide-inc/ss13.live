// Based on /tg/station's code/modules/modular_computers/computers/item/computer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(9409, "/obj/item/device/modular_computer", "/obj/item/device", {
	enabled: 0,
	screen_on: 1,
	active_program: null,
	hardware_flag: 0,
	last_power_usage: 0,
	last_battery_percent: 0,
	last_world_time: "00:00",
	last_header_icons: null,
	emagged: 0,
	base_active_power_usage: 50,
	base_idle_power_usage: 5,
	icon_state_unpowered: null,
	icon_state_powered: null,
	icon_state_menu: "menu",
	max_hardware_size: 0,
	steel_sheet_cost: 5,
	all_components: null,
	idle_threads: null,
	physical: null,
	has_light: 0,
	light_on: 0,
	comp_light_luminosity: 3,
	comp_light_color: null,
	name: "modular microcomputer",
	desc: "A small portable microcomputer.",
	icon: rt.rsc("icons/obj/computer.dmi"),
	icon_state: "laptop-open",
	obj_integrity: 100,
	integrity_failure: 50,
	max_integrity: 100,
	armor: null,
});

// computer.dm:42
rt.def("/obj/item/device/modular_computer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.all_components = list();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 20, "laser", 20, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 0, "acid", 0]);
	return f.dot;
});

// computer.dm:53
rt.def("/obj/item/device/modular_computer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	if (!this.physical) {
		this.physical = f.src;
	}
	this.comp_light_color = "#FFFFFF";
	this.idle_threads = list();
	yield* this.update_icon();
	return f.dot;
}, true);

// computer.dm:62
rt.def("/obj/item/device/modular_computer/proc/Destroy", function* Destroy(f: Frame) {
	let H: Value = null, CH: Value = null;
	yield* this.kill_program({ forced: 1 });
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	for (H of each(this.all_components)) {
		if ((CH = rt.index(this.all_components, H)).holder == this) {
			yield* CH.on_remove(this);
			CH.holder = null;
			yield* this.all_components.Remove(CH.device_type);
			yield* qdel(CH);
		}
	}
	this.physical = null;
	return (yield* parent_proc());
}, true);

// computer.dm:76
rt.def("/obj/item/device/modular_computer/proc/add_verb", function add_verb(f: Frame, path: Value) {
	if (path === "CARD") {
		this.verbs += P("/obj/item/device/modular_computer/proc/eject_id");
	} else if (path === "SDD") {
		this.verbs += P("/obj/item/device/modular_computer/proc/eject_disk");
	} else if (path === "AI") {
		this.verbs += P("/obj/item/device/modular_computer/proc/eject_card");
	}
	return f.dot;
});

// computer.dm:85
rt.def("/obj/item/device/modular_computer/proc/remove_verb", function remove_verb(f: Frame, path: Value) {
	if (path === "CARD") {
		this.verbs -= P("/obj/item/device/modular_computer/proc/eject_id");
	} else if (path === "SDD") {
		this.verbs -= P("/obj/item/device/modular_computer/proc/eject_disk");
	} else if (path === "AI") {
		this.verbs -= P("/obj/item/device/modular_computer/proc/eject_card");
	}
	return f.dot;
});

// computer.dm:99
rt.def("/obj/item/device/modular_computer/proc/eject_id", function* eject_id(f: Frame) {
	if (rt.istype(f.usr, T("/mob/living/silicon"))) {
		return f.dot;
	}
	let card_slot: Value = rt.at(this.all_components, "CARD");
	if (!f.usr.canUseTopic(this)) return f.dot;
	yield* card_slot.try_eject(null, f.usr);
	return f.dot;
}, true, { verb: { name: "Eject ID", category: "Object", src: 1, range: 1 } });

// computer.dm:110
rt.def("/obj/item/device/modular_computer/proc/eject_card", function* eject_card(f: Frame) {
	if (rt.istype(f.usr, T("/mob/living/silicon"))) {
		return f.dot;
	}
	let ai_slot: Value = rt.at(this.all_components, "AI");
	if (!f.usr.canUseTopic(this)) return f.dot;
	yield* ai_slot.try_eject(null, f.usr, 1);
	return f.dot;
}, true, { verb: { name: "Eject Intellicard", category: "Object" } });

// computer.dm:122
rt.def("/obj/item/device/modular_computer/proc/eject_disk", function* eject_disk(f: Frame) {
	let portable_drive: Value = null;
	if (rt.istype(f.usr, T("/mob/living/silicon"))) {
		return f.dot;
	}
	if (!f.usr.canUseTopic(this)) return f.dot;
	if (!(yield* this.uninstall_component((portable_drive = rt.at(this.all_components, "SDD")), f.usr))) return f.dot;
	yield* portable_drive.verb_pickup();
	return f.dot;
}, true, { verb: { name: "Eject Data Disk", category: "Object" } });

// computer.dm:131
rt.def("/obj/item/device/modular_computer/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	let portable_drive: Value = null;
	yield* parent_proc();
	if (rt.istype(user, T("/mob/living/silicon"))) {
		return f.dot;
	}
	if (!user.canUseTopic(this)) return f.dot;
	let card_slot: Value = rt.at(this.all_components, "CARD");
	let ai_slot: Value = rt.at(this.all_components, "AI");
	if (portable_drive = rt.at(this.all_components, "SDD")) {
		if (yield* this.uninstall_component(portable_drive, user)) {
			yield* portable_drive.verb_pickup();
		}
	} else {
		if (card_slot && (yield* card_slot.try_eject(null, user))) {
			return f.dot;
		}
		if (!ai_slot) return f.dot;
		yield* ai_slot.try_eject(null, user);
	}
	return f.dot;
}, true);

// computer.dm:152
rt.def("/obj/item/device/modular_computer/proc/GetAccess", function GetAccess(f: Frame) {
	let card_slot: Value = null;
	if (card_slot = rt.at(this.all_components, "CARD")) {
		return card_slot.GetAccess();
	}
	return parent_proc();
});

// computer.dm:158
rt.def("/obj/item/device/modular_computer/proc/GetID", function GetID(f: Frame) {
	let card_slot: Value = null;
	if (card_slot = rt.at(this.all_components, "CARD")) {
		return card_slot.GetID();
	}
	return parent_proc();
});

// computer.dm:163
rt.def("/obj/item/device/modular_computer/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	let M: Value = f.usr;
	if (!rt.istype(over_object, T("/obj/screen")) && f.usr.canUseTopic(this)) {
		return (yield* this.attack_self(M));
	}
	return f.dot;
}, true);

// computer.dm:169
rt.def("/obj/item/device/modular_computer/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_self(user));
}, true);

// computer.dm:173
rt.def("/obj/item/device/modular_computer/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let response: Value = null;
	if (this.enabled) {
		yield* this.ui_interact(user);
	} else {
		if (!IsAdminGhost(user)) return f.dot;
		if ((response = (yield* alert(user, "This computer is turned off. Would you like to turn it on?", "Admin Override", "Yes", "No"))) != "Yes") return f.dot;
		yield* this.turn_on(user);
	}
	return f.dot;
}, true);

// computer.dm:181
rt.def("/obj/item/device/modular_computer/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) {
		to_chat(user, fmt("<span class='warning'>＄！ was already emagged.</span>", [this]));
		return 0;
	} else {
		this.emagged = 1;
		to_chat(user, fmt("<span class='notice'>You emag ％！. It's screen briefly shows a \"OVERRIDE ACCEPTED: New software downloads available.\" message.</span>", [this]));
		return 1;
	}
});

// computer.dm:189
rt.def("/obj/item/device/modular_computer/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.obj_integrity <= this.integrity_failure) {
		to_chat(user, "<span class='danger'>It is heavily damaged!</span>");
	} else {
		if (!(this.obj_integrity < this.max_integrity)) return f.dot;
		to_chat(user, "<span class='warning'>It is damaged.</span>");
	}
	return f.dot;
}, false);

// computer.dm:196
rt.def("/obj/item/device/modular_computer/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	this.cut_overlays();
	if (!this.enabled) {
		this.icon_state = this.icon_state_unpowered;
	} else {
		this.icon_state = this.icon_state_powered;
		if (this.active_program) {
			if (this.active_program.program_icon_state) {
				$0 = this.active_program.program_icon_state;
			} else {
				$0 = this.icon_state_menu;
			}
			this.add_overlay($0);
		} else {
			this.add_overlay(this.icon_state_menu);
		}
	}
	if (!(this.obj_integrity <= this.integrity_failure)) return f.dot;
	this.add_overlay("bsod");
	this.add_overlay("broken");
	return f.dot;
});

// computer.dm:214
rt.def("/obj/item/device/modular_computer/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.enabled) {
		yield* this.ui_interact(user);
	} else {
		yield* this.turn_on(user);
	}
	return f.dot;
}, true);

// computer.dm:219
rt.def("/obj/item/device/modular_computer/proc/turn_on", function* turn_on(f: Frame, user: Value) {
	let recharger: Value = null;
	let issynth: Value = (rt.istype(user, T("/mob/living/silicon")) ? 1 : 0);
	if (this.obj_integrity <= this.integrity_failure) {
		if (issynth) {
			to_chat(user, fmt("<span class='warning'>You send an activation signal to ％！, but it responds with an error code. It must be damaged.</span>", [this]));
		} else {
			to_chat(user, "<span class='warning'>You press the power button, but the computer fails to boot up, displaying variety of errors before shutting down again.</span>");
		}
		return f.dot;
	}
	if (recharger = rt.at(this.all_components, "CHARGE")) {
		recharger.enabled = 1;
	}
	if (rt.at(this.all_components, "CPU") && (yield* this.use_power())) {
		if (issynth) {
			to_chat(user, fmt("<span class='notice'>You send an activation signal to ％！, turning it on.</span>", [this]));
		} else {
			to_chat(user, fmt("<span class='notice'>You press the power button and start up ％！.</span>", [this]));
		}
		this.enabled = 1;
		yield* this.update_icon();
		yield* this.ui_interact(user);
	} else if (issynth) {
		to_chat(user, fmt("<span class='warning'>You send an activation signal to ％！ but it does not respond.</span>", [this]));
	} else {
		to_chat(user, fmt("<span class='warning'>You press the power button but ％！ does not respond.</span>", [this]));
	}
	return f.dot;
}, true);

// computer.dm:248
rt.def("/obj/item/device/modular_computer/proc/process", function* process(f: Frame) {
	let I: Value = null, _P: Value = null;
	if (!this.enabled) {
		this.last_power_usage = 0;
		return 0;
	}
	if (this.obj_integrity <= this.integrity_failure) {
		yield* this.shutdown_computer();
		return 0;
	}
	if (this.active_program && this.active_program.requires_ntnet && !this.get_ntnet_status(this.active_program.requires_ntnet_feature)) {
		this.active_program.event_networkfailure(0);
	}
	for (I of each(this.idle_threads)) {
		if ((_P = I).requires_ntnet && !this.get_ntnet_status(_P.requires_ntnet_feature)) {
			_P.event_networkfailure(1);
		}
	}
	if (this.active_program) {
		if (this.active_program.program_state != 0) {
			yield* this.active_program.process_tick();
			this.active_program.ntnet_status = this.get_ntnet_status();
		} else {
			this.active_program = null;
		}
	}
	I = null;
	for (I of each(this.idle_threads)) {
		if ((_P = I).program_state != 0) {
			yield* _P.process_tick();
			_P.ntnet_status = this.get_ntnet_status();
		} else {
			yield* this.idle_threads.Remove(_P);
		}
	}
	yield* this.handle_power();
	return f.dot;
}, true, { waitfor: false });

// computer.dm:284
rt.def("/obj/item/device/modular_computer/proc/get_header_data", function get_header_data(f: Frame) {
	let program_headers: Value = null, I: Value = null, _P: Value = null;
	let $e: any;
	let data: Value = list();
	let battery_module: Value = rt.at(this.all_components, "CELL");
	let recharger: Value = rt.at(this.all_components, "CHARGE");
	if (battery_module && battery_module.battery) {
		const percent = battery_module.battery.percent();
		if (rt.inRange(percent, 80, 200)) {
			rt.setAt(data, "PC_batteryicon", "batt_100.gif");
		} else if (rt.inRange(percent, 60, 80)) {
			rt.setAt(data, "PC_batteryicon", "batt_80.gif");
		} else if (rt.inRange(percent, 40, 60)) {
			rt.setAt(data, "PC_batteryicon", "batt_60.gif");
		} else if (rt.inRange(percent, 20, 40)) {
			rt.setAt(data, "PC_batteryicon", "batt_40.gif");
		} else if (rt.inRange(percent, 5, 20)) {
			rt.setAt(data, "PC_batteryicon", "batt_20.gif");
		} else {
			rt.setAt(data, "PC_batteryicon", "batt_5.gif");
		}
		rt.setAt(data, "PC_batterypercent", `${round(battery_module.battery.percent())} %`);
		rt.setAt(data, "PC_showbatteryicon", 1);
	} else {
		rt.setAt(data, "PC_batteryicon", "batt_5.gif");
		rt.setAt(data, "PC_batterypercent", "N/C");
		rt.setAt(data, "PC_showbatteryicon", battery_module ? 1 : 0);
	}
	if (recharger && recharger.enabled && recharger.check_functionality() && recharger.use_power(0)) {
		rt.setAt(data, "PC_apclinkicon", "charging.gif");
	}
	const ntnet_status = this.get_ntnet_status();
	if (ntnet_status === 0) {
		rt.setAt(data, "PC_ntneticon", "sig_none.gif");
	} else if (ntnet_status === 1) {
		rt.setAt(data, "PC_ntneticon", "sig_low.gif");
	} else if (ntnet_status === 2) {
		rt.setAt(data, "PC_ntneticon", "sig_high.gif");
	} else if (ntnet_status === 3) {
		rt.setAt(data, "PC_ntneticon", "sig_lan.gif");
	}
	if (rt.len(f, this.idle_threads)) {
		program_headers = list();
		for (I of each(this.idle_threads)) {
			if (!(_P = I).ui_header) {
				continue;
			}
			program_headers.Add(list(rt.alist(f, ["icon", _P.ui_header])));
		}
		rt.setAt(data, "PC_programheaders", program_headers);
	}
	rt.setAt(data, "PC_stationtime", worldtime2text());
	rt.setAt(data, "PC_hasheader", 1);
	rt.setAt(data, "PC_showexitprogram", this.active_program ? 1 : 0);
	return data;
});

// computer.dm:343
rt.def("/obj/item/device/modular_computer/proc/kill_program", function* kill_program(f: Frame, forced: Value) {
	let user: Value = null;
	forced ??= 0;
	if (this.active_program) {
		yield* this.active_program.kill_program(forced);
		this.active_program = null;
	}
	if ((user = f.usr) && rt.istype(user, T("/mob"))) {
		yield* this.ui_interact(user);
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// computer.dm:353
rt.def("/obj/item/device/modular_computer/proc/get_ntnet_status", function get_ntnet_status(f: Frame, specific_action: Value) {
	let network_card: Value = null;
	specific_action ??= 0;
	if (network_card = rt.at(this.all_components, "NET")) {
		return network_card.get_signal(specific_action);
	}
	return 0;
});

// computer.dm:359
rt.def("/obj/item/device/modular_computer/proc/add_log", function add_log(f: Frame, text: Value) {
	if (!this.get_ntnet_status()) {
		return 0;
	}
	let network_card: Value = rt.at(this.all_components, "NET");
	return GLOB.ntnet_global.add_log(text, network_card);
});

// computer.dm:365
rt.def("/obj/item/device/modular_computer/proc/shutdown_computer", function* shutdown_computer(f: Frame, loud: Value) {
	let _P: Value = null;
	loud ??= 1;
	yield* this.kill_program({ forced: 1 });
	for (_P of each(this.idle_threads, T("/datum/computer_file/program"))) {
		yield* _P.kill_program({ forced: 1 });
		yield* this.idle_threads.Remove(_P);
	}
	if (loud) {
		this.physical.visible_message(fmt("<span class='notice'>＄！ shuts down.</span>", [this]));
	}
	this.enabled = 0;
	yield* this.update_icon();
	return f.dot;
}, true);

// computer.dm:377
rt.def("/obj/item/device/modular_computer/proc/attackby", function* attackby(f: Frame, W: Value, user: Value) {
	let h: Value = null, H: Value = null, WT: Value = null, dmg: Value = null, component_names: Value = null, h_1: Value = null, H_2: Value = null, choice: Value = null;
	for (h of each(this.all_components)) {
		if (yield* (H = rt.index(this.all_components, h)).try_insert(W, user)) {
			return f.dot;
		}
	}
	if (rt.istype(W, T("/obj/item/weapon/computer_hardware"))) {
		if (yield* this.install_component(W, user)) {
			return f.dot;
		}
	}
	if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (rt.len(f, this.all_components)) {
			to_chat(user, fmt("<span class='warning'>Remove all components from ％！ before disassembling it.</span>", [this]));
			return f.dot;
		}
		yield* new_(T("/obj/item/stack/sheet/metal"), rt.getStep(f, this.loc, 0), this.steel_sheet_cost);
		this.physical.visible_message(fmt("＄！ has been disassembled by ＀.", [this, user]));
		yield* this.relay_qdel();
		yield* qdel(this);
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		if (!(WT = W).isOn()) {
			to_chat(user, fmt("<span class='warning'>＄！ is off.</span>", [W]));
			return f.dot;
		}
		if (this.obj_integrity == this.max_integrity) {
			to_chat(user, fmt("<span class='warning'>＄！ does not require repairs.</span>", [this]));
			return f.dot;
		}
		to_chat(user, fmt("<span class='notice'>You begin repairing damage to ％！...</span>", [this]));
		dmg = round(this.max_integrity - this.obj_integrity);
		if ((yield* WT.remove_fuel(round(dmg / 75))) && (yield* do_after(f.usr, dmg / 10))) {
			this.obj_integrity = this.max_integrity;
			to_chat(user, fmt("<span class='notice'>You repair ％！.</span>", [this]));
		}
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (!rt.len(f, this.all_components)) {
			to_chat(user, "<span class='warning'>This device doesn't have any components installed.</span>");
			return f.dot;
		}
		component_names = list();
		for (h_1 of each(this.all_components)) {
			H_2 = rt.index(this.all_components, h_1);
			component_names.Add(H_2.name);
		}
		if (!(choice = (yield* g.op(f, "Prompt", [1], [null, "Computer maintenance", "Which component do you want to uninstall?", user, component_names])))) {
			return f.dot;
		}
		if (!this.Adjacent(user)) {
			return f.dot;
		}
		if (!(H_2 = this.find_hardware_by_name(choice))) {
			return f.dot;
		}
		yield* this.uninstall_component(H_2, user);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// computer.dm:447
rt.def("/obj/item/device/modular_computer/proc/Adjacent", function Adjacent(f: Frame, neighbor: Value) {
	if (this.physical && this.physical != this) {
		return this.physical.Adjacent(neighbor);
	}
	return parent_proc();
}, false);
