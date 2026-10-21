// Types declared in code/modules/modular_computers/hardware that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(7583, "/obj/item/weapon/computer_hardware/processor_unit/small", "/obj/item/weapon/computer_hardware/processor_unit", {
	power_usage: 25,
	max_idle_programs: 1,
	name: "microprocessor",
	desc: "A miniaturised CPU used in portable devices. It can run up to two programs simultaneously.",
	icon_state: "cpu",
	w_class: 1,
	origin_tech: "programming=2;engineering=2",
});
rt.type(7584, "/obj/item/weapon/computer_hardware/processor_unit/photonic", "/obj/item/weapon/computer_hardware/processor_unit", {
	power_usage: 250,
	max_idle_programs: 4,
	name: "photonic processor board",
	desc: "An advanced experimental CPU board that uses photonic core instead of regular circuitry. It can run up to five programs simultaneously, but uses a lot of power.",
	icon_state: "cpuboard_super",
	w_class: 2,
	origin_tech: "programming=5;engineering=4",
});
rt.type(7585, "/obj/item/weapon/computer_hardware/processor_unit/photonic/small", "/obj/item/weapon/computer_hardware/processor_unit/photonic", {
	power_usage: 75,
	max_idle_programs: 2,
	name: "photonic microprocessor",
	desc: "An advanced miniaturised CPU for use in portable devices. It uses photonic core instead of regular circuitry. It can run up to three programs simultaneously.",
	icon_state: "cpu_super",
	w_class: 1,
	origin_tech: "programming=4;engineering=3",
});
rt.type(7587, "/obj/item/weapon/computer_hardware/hard_drive/advanced", "/obj/item/weapon/computer_hardware/hard_drive", {
	max_capacity: 256,
	power_usage: 50,
	name: "advanced hard disk drive",
	desc: "A hybrid HDD, for use in higher grade computers where balance between power efficiency and capacity is desired.",
	origin_tech: "programming=2;engineering=2",
	icon_state: "harddisk_mini",
	w_class: 2,
});
rt.type(7588, "/obj/item/weapon/computer_hardware/hard_drive/super", "/obj/item/weapon/computer_hardware/hard_drive", {
	max_capacity: 512,
	power_usage: 100,
	name: "super hard disk drive",
	desc: "A high capacity HDD, for use in cluster storage solutions where capacity is more important than power efficiency.",
	origin_tech: "programming=3;engineering=3",
	icon_state: "harddisk_mini",
	w_class: 2,
});
rt.type(7589, "/obj/item/weapon/computer_hardware/hard_drive/cluster", "/obj/item/weapon/computer_hardware/hard_drive", {
	power_usage: 500,
	max_capacity: 2048,
	name: "cluster hard disk drive",
	desc: "A large storage cluster consisting of multiple HDDs for usage in dedicated storage systems.",
	origin_tech: "programming=4;engineering=4",
	icon_state: "harddisk",
	w_class: 3,
});
rt.type(7590, "/obj/item/weapon/computer_hardware/hard_drive/small", "/obj/item/weapon/computer_hardware/hard_drive", {
	power_usage: 10,
	max_capacity: 64,
	name: "solid state drive",
	desc: "An efficient SSD for portable devices.",
	origin_tech: "programming=2;engineering=2",
	icon_state: "ssd_mini",
	w_class: 1,
});
rt.type(7591, "/obj/item/weapon/computer_hardware/hard_drive/micro", "/obj/item/weapon/computer_hardware/hard_drive", {
	power_usage: 2,
	max_capacity: 32,
	name: "micro solid state drive",
	desc: "A highly efficient SSD chip for portable devices.",
	origin_tech: "programming=1;engineering=1",
	icon_state: "ssd_micro",
	w_class: 1,
});
rt.type(7593, "/obj/item/weapon/computer_hardware/hard_drive/portable/advanced", "/obj/item/weapon/computer_hardware/hard_drive/portable", {
	power_usage: 20,
	max_capacity: 64,
	name: "advanced data disk",
	icon_state: "datadisk5",
	origin_tech: "programming=2",
});
rt.type(7594, "/obj/item/weapon/computer_hardware/hard_drive/portable/super", "/obj/item/weapon/computer_hardware/hard_drive/portable", {
	power_usage: 40,
	max_capacity: 256,
	name: "super data disk",
	desc: "Removable disk used to store large amounts of data.",
	icon_state: "datadisk3",
	origin_tech: "programming=4",
});
rt.type(7596, "/obj/item/weapon/computer_hardware/network_card/advanced", "/obj/item/weapon/computer_hardware/network_card", {
	long_range: 1,
	power_usage: 100,
	name: "advanced network card",
	desc: "An advanced network card for usage with standard NTNet frequencies. Its transmitter is strong enough to connect even off-station.",
	origin_tech: "programming=4;engineering=2",
	icon_state: "radio",
	w_class: 1,
});
rt.type(7597, "/obj/item/weapon/computer_hardware/network_card/wired", "/obj/item/weapon/computer_hardware/network_card", {
	ethernet: 1,
	power_usage: 100,
	name: "wired network card",
	desc: "An advanced network card for usage with standard NTNet frequencies. This one also supports wired connection.",
	origin_tech: "programming=5;engineering=3",
	icon_state: "net_wired",
	w_class: 3,
});
rt.type(7599, "/obj/item/weapon/computer_hardware/printer/mini", "/obj/item/weapon/computer_hardware/printer", {
	power_usage: 50,
	stored_paper: 5,
	max_paper: 15,
	name: "miniprinter",
	desc: "A small printer with paper recycling module.",
	icon_state: "printer_mini",
	w_class: 1,
});
rt.type(7603, "/obj/item/weapon/computer_hardware/recharger/lambda", "/obj/item/weapon/computer_hardware/recharger", {
	charge_rate: 100000,
	name: "lambda coil",
	desc: "A very complex device that draws power from its own bluespace dimension.",
	icon_state: "charger_lambda",
	w_class: 1,
});
