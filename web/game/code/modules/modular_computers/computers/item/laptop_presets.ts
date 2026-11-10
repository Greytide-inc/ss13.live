// Based on /tg/station's code/modules/modular_computers/computers/item/laptop_presets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9412, "/obj/item/device/modular_computer/laptop/preset", "/obj/item/device/modular_computer/laptop", {});

// laptop_presets.dm:2
rt.def("/obj/item/device/modular_computer/laptop/preset/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/processor_unit/small"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/battery"), this, T("/obj/item/weapon/stock_parts/cell/computer"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/hard_drive"))));
	yield* this.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/network_card"))));
	yield* this.install_programs();
	return f.dot;
}, true);

rt.type(9413, "/obj/item/device/modular_computer/laptop/preset/civillian", "/obj/item/device/modular_computer/laptop/preset", {
	desc: "A low-end laptop often used for personal recreation.",
});

// laptop_presets.dm:22
rt.def("/obj/item/device/modular_computer/laptop/preset/civillian/proc/install_programs", function install_programs(f: Frame) {
	let hard_drive: Value = null;
	(hard_drive = rt.at(this.all_components, "HDD")).store_file(new_(T("/datum/computer_file/program/chatclient")));
	hard_drive.store_file(new_(T("/datum/computer_file/program/nttransfer")));
	return f.dot;
});
