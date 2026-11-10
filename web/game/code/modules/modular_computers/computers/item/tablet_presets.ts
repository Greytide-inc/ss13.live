// Based on /tg/station's code/modules/modular_computers/computers/item/tablet_presets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9417, "/obj/item/device/modular_computer/tablet/preset/cheap", "/obj/item/device/modular_computer/tablet/preset", {
	desc: "A low-end tablet often seen among low ranked station personnel.",
});

// tablet_presets.dm:7
rt.def("/obj/item/device/modular_computer/tablet/preset/cheap/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/processor_unit/small"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/battery"), this, T("/obj/item/weapon/stock_parts/cell/computer/micro"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/hard_drive/small"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/network_card"))));
	return f.dot;
}, true);

rt.type(9418, "/obj/item/device/modular_computer/tablet/preset/advanced", "/obj/item/device/modular_computer/tablet/preset", {});

// tablet_presets.dm:15
rt.def("/obj/item/device/modular_computer/tablet/preset/advanced/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/processor_unit/small"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/battery"), this, T("/obj/item/weapon/stock_parts/cell/computer"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/hard_drive/small"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/network_card"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/card_slot"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/printer/mini"))));
	return f.dot;
}, true);

rt.type(9419, "/obj/item/device/modular_computer/tablet/preset/cargo", "/obj/item/device/modular_computer/tablet/preset", {});

// tablet_presets.dm:24
rt.def("/obj/item/device/modular_computer/tablet/preset/cargo/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/processor_unit/small"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/battery"), this, T("/obj/item/weapon/stock_parts/cell/computer"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/hard_drive/small"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/network_card"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/printer/mini"))));
	return f.dot;
}, true);
