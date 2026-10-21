// From code/modules/modular_computers/file_system/programs/configurator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/computer_file/program/computerconfig/proc/ui_data  (code/modules/modular_computers/file_system/programs/configurator.dm:21)
rt.def("/datum/computer_file/program/computerconfig/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let hard_drive: Value = null, battery_module: Value = null, data: Value = null, all_entries: Value = null, I: Value = null, H: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [hard_drive, battery_module, data, all_entries, I, H, $0, $1, $2, $e];
	rt.setSv(f, "movable", rt.sv(f, "computer"));
	hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "movable")), "HDD");
	battery_module = rt.index(rt.fv(f, "all_components", rt.sv(f, "movable")), "CELL");
	if (!truthy((rt.istype(rt.sv(f, "movable"), T("/obj/item/device/modular_computer")) ? 1 : 0))) {
		rt.setSv(f, "movable", null);
	}
	if (!truthy(rt.sv(f, "movable"))) {
		return 0;
	}
	rt.setAt((data = rt.callSrc(f, "get_header_data", [])), "disk_size", rt.fv(f, "max_capacity", live(hard_drive)));
	rt.setAt(live(data), "disk_used", rt.fv(f, "used_capacity", live(hard_drive)));
	rt.setAt(live(data), "power_usage", rt.fv(f, "last_power_usage", rt.sv(f, "movable")));
	$0 = live(data);
	$1 = "battery_exists";
	if (truthy(live(battery_module))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	if ((truthy(live(battery_module)) && truthy(rt.fv(f, "battery", live(battery_module))))) {
		rt.setAt(live(data), "battery_rating", rt.gv(f, "maxcharge", rt.fv(f, "battery", live(battery_module))));
		rt.setAt(live(data), "battery_percent", rt.call(f, P("/proc/round"), null, [rt.callName(f, rt.fv(f, "battery", live(battery_module)), "percent", [])]));
	}
	if ((truthy(live(battery_module)) && truthy(rt.fv(f, "battery", live(battery_module))))) {
		rt.setAt(live(data), "battery", rt.alist(f, ["max", rt.gv(f, "maxcharge", rt.fv(f, "battery", live(battery_module))), "charge", rt.call(f, P("/proc/round"), null, [rt.gv(f, "charge", rt.fv(f, "battery", live(battery_module)))])]));
	}
	all_entries = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	I = null;
	rt.forList(f, 0, rt.fv(f, "all_components", rt.sv(f, "movable")));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		H = rt.index(rt.fv(f, "all_components", rt.sv(f, "movable")), live(I));
		rt.callName(f, live(all_entries), "Add", [rt.list(rt.alist(f, ["name", rt.fv(f, "name", live(H)), "desc", rt.fv(f, "desc", live(H)), "enabled", rt.fv(f, "enabled", live(H)), "critical", rt.fv(f, "critical", live(H)), "powerusage", rt.fv(f, "power_usage", live(H))]))]);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "hardware", live(all_entries));
	return live(data);
});

// /datum/computer_file/program/computerconfig/proc/ui_act  (code/modules/modular_computers/file_system/programs/configurator.dm:60)  may sleep
rt.def("/datum/computer_file/program/computerconfig/proc/ui_act", function* ui_act(f: Frame) {
	let H: Value = null;
	let $0: any;
	f.vars = () => [H, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "PC_toggle_component") {
		if ((truthy((H = (yield* g.callName(f, rt.sv(f, "movable"), "find_hardware_by_name", [rt.at(live(f.args[1]), "name")])))) && truthy((rt.istype(live(H), T("/obj/item/weapon/computer_hardware")) ? 1 : 0)))) {
			rt.setFv(f, "enabled", live(H), (!truthy(rt.fv(f, "enabled", live(H))) ? 1 : 0));
		}
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });
