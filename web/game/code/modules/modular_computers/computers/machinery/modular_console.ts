// From code/modules/modular_computers/computers/machinery/modular_console.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10963, "/obj/machinery/modular_computer/console/buildable", "/obj/machinery/modular_computer/console", {});

// /obj/machinery/modular_computer/console/buildable/proc/Initialize  (code/modules/modular_computers/computers/machinery/modular_console.dm:24)  may sleep
rt.def("/obj/machinery/modular_computer/console/buildable/proc/Initialize", function* Initialize(f: Frame) {
	let hard_drive: Value = null, network_card: Value = null, recharger: Value = null;
	f.vars = () => [hard_drive, network_card, recharger];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "cpu")), "HDD");
	network_card = rt.index(rt.fv(f, "all_components", rt.sv(f, "cpu")), "NET");
	yield* g.call(f, P("/proc/qdel"), null, [(recharger = rt.index(rt.fv(f, "all_components", rt.sv(f, "cpu")), "CHARGE"))]);
	yield* g.call(f, P("/proc/qdel"), null, [live(network_card)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(hard_drive)]);
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

// /obj/machinery/modular_computer/console/proc/Initialize  (code/modules/modular_computers/computers/machinery/modular_console.dm:34)  may sleep
rt.def("/obj/machinery/modular_computer/console/proc/Initialize", function* Initialize(f: Frame) {
	let battery_module: Value = null, network_card: Value = null, A: Value = null;
	f.vars = () => [battery_module, network_card, A];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((battery_module = rt.index(rt.fv(f, "all_components", rt.sv(f, "cpu")), "CELL")))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(battery_module)]);
	}
	network_card = (yield* g.new_(f, T("/obj/item/weapon/computer_hardware/network_card/wired"), []));
	yield* g.callName(f, rt.sv(f, "cpu"), "install_component", [live(network_card)]);
	yield* g.callName(f, rt.sv(f, "cpu"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/recharger/APC"), []))]);
	yield* g.callName(f, rt.sv(f, "cpu"), "install_component", [(yield* g.new_(f, T("/obj/item/weapon/computer_hardware/hard_drive/super"), []))]);
	if ((truthy((A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])))) && truthy(rt.sv(f, "console_department")))) {
		rt.setFv(f, "identification_string", live(network_card), (yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/replacetext"), null, [fmt("＀ ＀ Console", [rt.fv(f, "name", live(A)), rt.sv(f, "console_department")]), " ", "_"])), "-", ""])), "__", "_"])));
	} else {
		if (truthy(live(A))) {
			rt.setFv(f, "identification_string", live(network_card), (yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/replacetext"), null, [fmt("＀ Console", [rt.fv(f, "name", live(A))]), " ", "_"])), "-", ""])), "__", "_"])));
		} else {
			if (truthy(rt.sv(f, "console_department"))) {
				rt.setFv(f, "identification_string", live(network_card), (yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/replacetext"), null, [fmt("＀ Console", [rt.sv(f, "console_department")]), " ", "_"])), "-", ""])), "__", "_"])));
			} else {
				rt.setFv(f, "identification_string", live(network_card), "Unknown Console");
			}
		}
	}
	if (truthy(rt.sv(f, "cpu"))) {
		rt.setFv(f, "screen_on", rt.sv(f, "cpu"), 1);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);
