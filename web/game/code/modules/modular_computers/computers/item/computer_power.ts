// From code/modules/modular_computers/computers/item/computer_power.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/device/modular_computer/proc/use_power  (code/modules/modular_computers/computers/item/computer_power.dm:3)  may sleep
rt.def("/obj/item/device/modular_computer/proc/use_power", function* use_power(f: Frame, amount: Value) {
	let recharger: Value = null, battery_module: Value = null, cell: Value = null;
	f.vars = () => [amount, recharger, battery_module, cell];
	if (live(amount) === null) {
		amount = 0;
	}
	if (truthy((yield* g.srcCall(f, "check_power_override")))) {
		return 1;
	}
	if ((truthy((recharger = rt.at(rt.sv(f, "all_components"), "CHARGE"))) && truthy((yield* g.callName(f, live(recharger), "check_functionality", []))))) {
		if (truthy((yield* g.callName(f, live(recharger), "use_power", [live(amount)])))) {
			return 1;
		}
	}
	if (((truthy((battery_module = rt.at(rt.sv(f, "all_components"), "CELL"))) && truthy(rt.fv(f, "battery", live(battery_module)))) && truthy(rt.gv(f, "charge", rt.fv(f, "battery", live(battery_module)))))) {
		if (truthy((yield* g.callName(f, (cell = rt.fv(f, "battery", live(battery_module))), "use", [multiply(live(amount), rt.gl("CELLRATE"))])))) {
			return 1;
		} else {
			yield* g.callName(f, live(cell), "use", [(yield* g.call(f, P("/proc/min"), null, [multiply(live(amount), rt.gl("CELLRATE")), rt.fv(f, "charge", live(cell))]))]);
			return 0;
		}
	}
	return 0;
}, true);

// /obj/item/device/modular_computer/proc/give_power  (code/modules/modular_computers/computers/item/computer_power.dm:25)  may sleep
rt.def("/obj/item/device/modular_computer/proc/give_power", function* give_power(f: Frame, amount: Value) {
	let battery_module: Value = null;
	f.vars = () => [amount, battery_module];
	if ((truthy((battery_module = rt.at(rt.sv(f, "all_components"), "CELL"))) && truthy(rt.fv(f, "battery", live(battery_module))))) {
		return (yield* g.callName(f, rt.fv(f, "battery", live(battery_module)), "give", [live(amount)]));
	}
	return 0;
}, true);

// /obj/item/device/modular_computer/proc/get_cell  (code/modules/modular_computers/computers/item/computer_power.dm:31)
rt.def("/obj/item/device/modular_computer/proc/get_cell", function get_cell(f: Frame) {
	let battery_module: Value = null;
	f.vars = () => [battery_module];
	if (!(truthy((battery_module = rt.at(rt.sv(f, "all_components"), "CELL"))) && truthy(rt.fv(f, "battery", live(battery_module))))) return f.dot;
	return rt.fv(f, "battery", live(battery_module));
});

// /obj/item/device/modular_computer/proc/power_failure  (code/modules/modular_computers/computers/item/computer_power.dm:38)  may sleep
rt.def("/obj/item/device/modular_computer/proc/power_failure", function* power_failure(f: Frame) {
	let I: Value = null, PRG: Value = null;
	let $e: any;
	f.vars = () => [I, PRG, $e];
	if (!truthy(rt.sv(f, "enabled"))) return f.dot;
	if (truthy(rt.sv(f, "active_program"))) {
		yield* g.callName(f, rt.sv(f, "active_program"), "event_powerfailure", [0]);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "idle_threads"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, (PRG = live(I)), "event_powerfailure", [1]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "shutdown_computer", 0);
	return f.dot;
}, true);

// /obj/item/device/modular_computer/proc/handle_power  (code/modules/modular_computers/computers/item/computer_power.dm:47)  may sleep
rt.def("/obj/item/device/modular_computer/proc/handle_power", function* handle_power(f: Frame) {
	let recharger: Value = null, power_usage: Value = null, H: Value = null;
	let $0: any, $e: any;
	f.vars = () => [recharger, power_usage, H, $0, $e];
	if (truthy((recharger = rt.at(rt.sv(f, "all_components"), "CHARGE")))) {
		yield* g.callName(f, live(recharger), "process", []);
	}
	if (truthy(rt.sv(f, "screen_on"))) {
		$0 = rt.sv(f, "base_active_power_usage");
	} else {
		$0 = rt.sv(f, "base_idle_power_usage");
	}
	power_usage = $0;
	H = null;
	rt.forList(f, 0, rt.sv(f, "all_components"), T("/obj/item/weapon/computer_hardware"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (truthy(rt.fv(f, "enabled", live(H)))) {
			power_usage = rt.modify(live(power_usage), rt.fv(f, "power_usage", live(H)), add);
		}
	}
	rt.endFor(f, 0);
	if (truthy((yield* g.srcCall(f, "use_power", live(power_usage))))) {
		rt.setSv(f, "last_power_usage", live(power_usage));
		return 1;
	} else {
		yield* g.srcCall(f, "power_failure");
		return 0;
	}
	return f.dot;
}, true);
