// From code/modules/modular_computers/computers/item/tablet_presets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9417, "/obj/item/device/modular_computer/tablet/preset/cheap", "/obj/item/device/modular_computer/tablet/preset", {
	desc: "A low-end tablet often seen among low ranked station personnel.",
});

// /obj/item/device/modular_computer/tablet/preset/cheap/proc/New  (code/modules/modular_computers/computers/item/tablet_presets.dm:7)  may sleep
rt.def("/obj/item/device/modular_computer/tablet/preset/cheap/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/processor_unit/small"), [])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/battery"), [live(f.src), T("/obj/item/weapon/stock_parts/cell/computer/micro")])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/hard_drive/small"), [])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/network_card"), [])));
	return f.dot;
}, true);

rt.type(9418, "/obj/item/device/modular_computer/tablet/preset/advanced", "/obj/item/device/modular_computer/tablet/preset", {});

// /obj/item/device/modular_computer/tablet/preset/advanced/proc/New  (code/modules/modular_computers/computers/item/tablet_presets.dm:15)  may sleep
rt.def("/obj/item/device/modular_computer/tablet/preset/advanced/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/processor_unit/small"), [])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/battery"), [live(f.src), T("/obj/item/weapon/stock_parts/cell/computer")])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/hard_drive/small"), [])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/network_card"), [])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/card_slot"), [])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/printer/mini"), [])));
	return f.dot;
}, true);

rt.type(9419, "/obj/item/device/modular_computer/tablet/preset/cargo", "/obj/item/device/modular_computer/tablet/preset", {});

// /obj/item/device/modular_computer/tablet/preset/cargo/proc/New  (code/modules/modular_computers/computers/item/tablet_presets.dm:24)  may sleep
rt.def("/obj/item/device/modular_computer/tablet/preset/cargo/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/processor_unit/small"), [])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/battery"), [live(f.src), T("/obj/item/weapon/stock_parts/cell/computer")])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/hard_drive/small"), [])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/network_card"), [])));
	yield* g.srcCall(f, "install_component", (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/printer/mini"), [])));
	return f.dot;
}, true);
