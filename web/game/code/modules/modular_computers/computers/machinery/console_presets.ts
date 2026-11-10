// Based on /tg/station's code/modules/modular_computers/computers/machinery/console_presets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10958, "/obj/machinery/modular_computer/console/preset", "/obj/machinery/modular_computer/console", {
	_has_id_slot: 0,
	_has_printer: 0,
	_has_battery: 0,
	_has_ai: 0,
});

// console_presets.dm:9
rt.def("/obj/machinery/modular_computer/console/preset/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.cpu) {
		return f.dot;
	}
	yield* this.cpu.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/processor_unit"))));
	if (this._has_id_slot) {
		yield* this.cpu.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/card_slot"))));
	}
	if (this._has_printer) {
		yield* this.cpu.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/printer"))));
	}
	if (this._has_battery) {
		yield* this.cpu.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/battery"), this.cpu, T("/obj/item/weapon/stock_parts/cell/computer/super"))));
	}
	if (this._has_ai) {
		yield* this.cpu.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/ai_slot"))));
	}
	yield* this.install_programs();
	return f.dot;
}, true);

rt.type(10959, "/obj/machinery/modular_computer/console/preset/engineering", "/obj/machinery/modular_computer/console/preset", {
	console_department: "Engineering",
	desc: "A stationary computer. This one comes preloaded with engineering programs.",
});

// console_presets.dm:36
rt.def("/obj/machinery/modular_computer/console/preset/engineering/proc/install_programs", function install_programs(f: Frame) {
	let hard_drive: Value = null;
	(hard_drive = rt.index(this.cpu.all_components, "HDD")).store_file(new_(T("/datum/computer_file/program/power_monitor")));
	hard_drive.store_file(new_(T("/datum/computer_file/program/alarm_monitor")));
	hard_drive.store_file(new_(T("/datum/computer_file/program/supermatter_monitor")));
	return f.dot;
});

rt.type(10960, "/obj/machinery/modular_computer/console/preset/research", "/obj/machinery/modular_computer/console/preset", {
	_has_ai: 1,
	console_department: "Research",
	desc: "A stationary computer. This one comes preloaded with research programs.",
});

// console_presets.dm:48
rt.def("/obj/machinery/modular_computer/console/preset/research/proc/install_programs", function install_programs(f: Frame) {
	let hard_drive: Value = null;
	(hard_drive = rt.index(this.cpu.all_components, "HDD")).store_file(new_(T("/datum/computer_file/program/ntnetmonitor")));
	hard_drive.store_file(new_(T("/datum/computer_file/program/nttransfer")));
	hard_drive.store_file(new_(T("/datum/computer_file/program/chatclient")));
	hard_drive.store_file(new_(T("/datum/computer_file/program/aidiag")));
	return f.dot;
});

rt.type(10961, "/obj/machinery/modular_computer/console/preset/command", "/obj/machinery/modular_computer/console/preset", {
	_has_id_slot: 1,
	_has_printer: 1,
	console_department: "Command",
	desc: "A stationary computer. This one comes preloaded with command programs.",
});

// console_presets.dm:63
rt.def("/obj/machinery/modular_computer/console/preset/command/proc/install_programs", function* install_programs(f: Frame) {
	let hard_drive: Value = null;
	(hard_drive = rt.index(this.cpu.all_components, "HDD")).store_file((yield* new_(T("/datum/computer_file/program/chatclient"))));
	hard_drive.store_file((yield* new_(T("/datum/computer_file/program/card_mod"))));
	return f.dot;
}, true);

rt.type(10962, "/obj/machinery/modular_computer/console/preset/civilian", "/obj/machinery/modular_computer/console/preset", {
	console_department: "Civilian",
	desc: "A stationary computer. This one comes preloaded with generic programs.",
});

// console_presets.dm:73
rt.def("/obj/machinery/modular_computer/console/preset/civilian/proc/install_programs", function install_programs(f: Frame) {
	let hard_drive: Value = null;
	(hard_drive = rt.index(this.cpu.all_components, "HDD")).store_file(new_(T("/datum/computer_file/program/chatclient")));
	hard_drive.store_file(new_(T("/datum/computer_file/program/nttransfer")));
	return f.dot;
});
