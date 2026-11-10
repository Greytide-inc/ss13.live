// Based on /tg/station's code/modules/modular_computers/file_system/programs/configurator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4163, "/datum/computer_file/program/computerconfig", "/datum/computer_file/program", {
	movable: null,
	filename: "compconfig",
	filedesc: "Hardware Configuration Tool",
	extended_desc: "This program allows configuration of computer's hardware",
	program_icon_state: "generic",
	unsendable: 1,
	undeletable: 1,
	size: 4,
	available_on_ntnet: 0,
	requires_ntnet: 0,
	tgui_id: "ntos_configuration",
});

// configurator.dm:21
rt.def("/datum/computer_file/program/computerconfig/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, I: Value = null, H: Value = null;
	let $e: any;
	this.movable = this.computer;
	let hard_drive: Value = rt.index(this.movable.all_components, "HDD");
	let battery_module: Value = rt.index(this.movable.all_components, "CELL");
	if (!rt.istype(this.movable, T("/obj/item/device/modular_computer"))) {
		this.movable = null;
	}
	if (!this.movable) {
		return 0;
	}
	rt.setAt((data = this.get_header_data()), "disk_size", hard_drive.max_capacity);
	rt.setAt(data, "disk_used", hard_drive.used_capacity);
	rt.setAt(data, "power_usage", this.movable.last_power_usage);
	let $0: any = data;
	let $1: any = "battery_exists";
	rt.setAt($0, $1, battery_module ? 1 : 0);
	if (battery_module && battery_module.battery) {
		rt.setAt(data, "battery_rating", battery_module.battery.maxcharge);
		rt.setAt(data, "battery_percent", round(battery_module.battery.percent()));
	}
	if (battery_module && battery_module.battery) {
		rt.setAt(data, "battery", rt.alist(f, ["max", battery_module.battery.maxcharge, "charge", round(battery_module.battery.charge)]));
	}
	let all_entries: Value = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	for (I of each(this.movable.all_components)) {
		H = rt.index(this.movable.all_components, I);
		all_entries.Add(list(rt.alist(f, ["name", H.name, "desc", H.desc, "enabled", H.enabled, "critical", H.critical, "powerusage", H.power_usage])));
	}
	rt.setAt(data, "hardware", all_entries);
	return data;
});

// configurator.dm:60
rt.def("/datum/computer_file/program/computerconfig/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let H: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "PC_toggle_component") {
		if ((H = this.movable.find_hardware_by_name(rt.at(params, "name"))) && rt.istype(H, T("/obj/item/weapon/computer_hardware"))) {
			H.enabled = (!H.enabled ? 1 : 0);
		}
		f.dot = 1;
	}
	return f.dot;
}, true);
