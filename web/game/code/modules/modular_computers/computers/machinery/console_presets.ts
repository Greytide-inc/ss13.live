// From code/modules/modular_computers/computers/machinery/console_presets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10958, "/obj/machinery/modular_computer/console/preset", "/obj/machinery/modular_computer/console", {
	_has_id_slot: 0,
	_has_printer: 0,
	_has_battery: 0,
	_has_ai: 0,
});

// /obj/machinery/modular_computer/console/preset/proc/Initialize  (code/modules/modular_computers/computers/machinery/console_presets.dm:9)  may sleep
rt.def("/obj/machinery/modular_computer/console/preset/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "cpu"))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "cpu"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/processor_unit"), []))]);
	if (truthy(rt.sv(f, "_has_id_slot"))) {
		yield* g.callName(f, rt.sv(f, "cpu"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/card_slot"), []))]);
	}
	if (truthy(rt.sv(f, "_has_printer"))) {
		yield* g.callName(f, rt.sv(f, "cpu"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/printer"), []))]);
	}
	if (truthy(rt.sv(f, "_has_battery"))) {
		yield* g.callName(f, rt.sv(f, "cpu"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/battery"), [rt.sv(f, "cpu"), T("/obj/item/weapon/stock_parts/cell/computer/super")]))]);
	}
	if (truthy(rt.sv(f, "_has_ai"))) {
		yield* g.callName(f, rt.sv(f, "cpu"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/ai_slot"), []))]);
	}
	yield* g.srcCall(f, "install_programs");
	return f.dot;
}, true);

rt.type(10959, "/obj/machinery/modular_computer/console/preset/engineering", "/obj/machinery/modular_computer/console/preset", {
	console_department: "Engineering",
	desc: "A stationary computer. This one comes preloaded with engineering programs.",
});

// /obj/machinery/modular_computer/console/preset/engineering/proc/install_programs  (code/modules/modular_computers/computers/machinery/console_presets.dm:36)
rt.def("/obj/machinery/modular_computer/console/preset/engineering/proc/install_programs", function install_programs(f: Frame) {
	let hard_drive: Value = null;
	f.vars = () => [hard_drive];
	rt.callName(f, (hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "cpu")), "HDD")), "store_file", [rt.new_(f, T("/datum/computer_file/program/power_monitor"), [])]);
	rt.callName(f, live(hard_drive), "store_file", [rt.new_(f, T("/datum/computer_file/program/alarm_monitor"), [])]);
	rt.callName(f, live(hard_drive), "store_file", [rt.new_(f, T("/datum/computer_file/program/supermatter_monitor"), [])]);
	return f.dot;
});

rt.type(10960, "/obj/machinery/modular_computer/console/preset/research", "/obj/machinery/modular_computer/console/preset", {
	_has_ai: 1,
	console_department: "Research",
	desc: "A stationary computer. This one comes preloaded with research programs.",
});

// /obj/machinery/modular_computer/console/preset/research/proc/install_programs  (code/modules/modular_computers/computers/machinery/console_presets.dm:48)
rt.def("/obj/machinery/modular_computer/console/preset/research/proc/install_programs", function install_programs(f: Frame) {
	let hard_drive: Value = null;
	f.vars = () => [hard_drive];
	rt.callName(f, (hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "cpu")), "HDD")), "store_file", [rt.new_(f, T("/datum/computer_file/program/ntnetmonitor"), [])]);
	rt.callName(f, live(hard_drive), "store_file", [rt.new_(f, T("/datum/computer_file/program/nttransfer"), [])]);
	rt.callName(f, live(hard_drive), "store_file", [rt.new_(f, T("/datum/computer_file/program/chatclient"), [])]);
	rt.callName(f, live(hard_drive), "store_file", [rt.new_(f, T("/datum/computer_file/program/aidiag"), [])]);
	return f.dot;
});

rt.type(10961, "/obj/machinery/modular_computer/console/preset/command", "/obj/machinery/modular_computer/console/preset", {
	_has_id_slot: 1,
	_has_printer: 1,
	console_department: "Command",
	desc: "A stationary computer. This one comes preloaded with command programs.",
});

// /obj/machinery/modular_computer/console/preset/command/proc/install_programs  (code/modules/modular_computers/computers/machinery/console_presets.dm:63)  may sleep
rt.def("/obj/machinery/modular_computer/console/preset/command/proc/install_programs", function* install_programs(f: Frame) {
	let hard_drive: Value = null;
	f.vars = () => [hard_drive];
	yield* g.callName(f, (hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "cpu")), "HDD")), "store_file", [(yield* g.new_(f, T("/datum/computer_file/program/chatclient"), []))]);
	yield* g.callName(f, live(hard_drive), "store_file", [(yield* g.new_(f, T("/datum/computer_file/program/card_mod"), []))]);
	return f.dot;
}, true);

rt.type(10962, "/obj/machinery/modular_computer/console/preset/civilian", "/obj/machinery/modular_computer/console/preset", {
	console_department: "Civilian",
	desc: "A stationary computer. This one comes preloaded with generic programs.",
});

// /obj/machinery/modular_computer/console/preset/civilian/proc/install_programs  (code/modules/modular_computers/computers/machinery/console_presets.dm:73)
rt.def("/obj/machinery/modular_computer/console/preset/civilian/proc/install_programs", function install_programs(f: Frame) {
	let hard_drive: Value = null;
	f.vars = () => [hard_drive];
	rt.callName(f, (hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "cpu")), "HDD")), "store_file", [rt.new_(f, T("/datum/computer_file/program/chatclient"), [])]);
	rt.callName(f, live(hard_drive), "store_file", [rt.new_(f, T("/datum/computer_file/program/nttransfer"), [])]);
	return f.dot;
});
