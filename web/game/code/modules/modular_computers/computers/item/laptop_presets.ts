// From code/modules/modular_computers/computers/item/laptop_presets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9412, "/obj/item/device/modular_computer/laptop/preset", "/obj/item/device/modular_computer/laptop", {});

// /obj/item/device/modular_computer/laptop/preset/proc/New  (code/modules/modular_computers/computers/item/laptop_presets.dm:2)  may sleep
rt.def("/obj/item/device/modular_computer/laptop/preset/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/processor_unit/small"), [])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/battery"), [live(f.src), T("/obj/item/weapon/stock_parts/cell/computer")])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/hard_drive"), [])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/network_card"), [])));
	yield* g.srcCall(f, "install_programs");
	return f.dot;
}, true);

rt.type(9413, "/obj/item/device/modular_computer/laptop/preset/civillian", "/obj/item/device/modular_computer/laptop/preset", {
	desc: "A low-end laptop often used for personal recreation.",
});

// /obj/item/device/modular_computer/laptop/preset/civillian/proc/install_programs  (code/modules/modular_computers/computers/item/laptop_presets.dm:22)
rt.def("/obj/item/device/modular_computer/laptop/preset/civillian/proc/install_programs", function install_programs(f: Frame) {
	let hard_drive: Value = null;
	f.vars = () => [hard_drive];
	rt.callName(f, (hard_drive = rt.at(rt.sv(f, "all_components"), "HDD")), "store_file", [rt.new_(f, T("/datum/computer_file/program/chatclient"), [])]);
	rt.callName(f, live(hard_drive), "store_file", [rt.new_(f, T("/datum/computer_file/program/nttransfer"), [])]);
	return f.dot;
});
