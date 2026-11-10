// Based on /tg/station's code/modules/modular_computers/computers/machinery/modular_console.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10963, "/obj/machinery/modular_computer/console/buildable", "/obj/machinery/modular_computer/console", {});

// modular_console.dm:24
rt.def("/obj/machinery/modular_computer/console/buildable/proc/Initialize", function* Initialize(f: Frame) {
	let recharger: Value = null;
	f.dot = (yield* parent_proc());
	let hard_drive: Value = rt.index(this.cpu.all_components, "HDD");
	let network_card: Value = rt.index(this.cpu.all_components, "NET");
	yield* qdel((recharger = rt.index(this.cpu.all_components, "CHARGE")));
	yield* qdel(network_card);
	yield* qdel(hard_drive);
	return f.dot;
}, true);

rt.type(10957, "/obj/machinery/modular_computer/console", "/obj/machinery/modular_computer", {
	console_department: "",
	anchored: 1,
	name: "console",
	desc: "A stationary computer.",
	icon: rt.rsc("icons/obj/modular_console.dmi"),
	icon_state: "console",
	icon_state_powered: "console",
	icon_state_unpowered: "console-off",
	screen_icon_state_menu: "menu",
	hardware_flag: 1,
	density: 1,
	base_idle_power_usage: 100,
	base_active_power_usage: 500,
	max_hardware_size: 4,
	steel_sheet_cost: 10,
	light_strength: 2,
	obj_integrity: 300,
	max_integrity: 300,
	integrity_failure: 150,
});

// modular_console.dm:34
rt.def("/obj/machinery/modular_computer/console/proc/Initialize", function* Initialize(f: Frame) {
	let battery_module: Value = null, A: Value = null;
	f.dot = (yield* parent_proc());
	if (battery_module = rt.index(this.cpu.all_components, "CELL")) {
		yield* qdel(battery_module);
	}
	let network_card: Value = (yield* new_(T("/obj/item/weapon/computer_hardware/network_card/wired")));
	yield* this.cpu.install_component(network_card);
	yield* this.cpu.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/recharger/APC"))));
	yield* this.cpu.install_component((yield* new_(T("/obj/item/weapon/computer_hardware/hard_drive/super"))));
	if ((A = get_area(this)) && this.console_department) {
		network_card.identification_string = replacetext(replacetext(replacetext(`${A.name} ${this.console_department} Console`, " ", "_"), "-", ""), "__", "_");
	} else if (A) {
		network_card.identification_string = replacetext(replacetext(replacetext(`${A.name} Console`, " ", "_"), "-", ""), "__", "_");
	} else if (this.console_department) {
		network_card.identification_string = replacetext(replacetext(replacetext(`${this.console_department} Console`, " ", "_"), "-", ""), "__", "_");
	} else {
		network_card.identification_string = "Unknown Console";
	}
	if (this.cpu) {
		this.cpu.screen_on = 1;
	}
	yield* this.update_icon();
	return f.dot;
}, true);
