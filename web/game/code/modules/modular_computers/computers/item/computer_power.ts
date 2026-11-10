// Based on /tg/station's code/modules/modular_computers/computers/item/computer_power.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// computer_power.dm:3
rt.def("/obj/item/device/modular_computer/proc/use_power", function* use_power(f: Frame, amount: Value) {
	let recharger: Value = null, battery_module: Value = null, cell: Value = null;
	amount ??= 0;
	if (this.check_power_override()) {
		return 1;
	}
	if ((recharger = rt.at(this.all_components, "CHARGE")) && recharger.check_functionality()) {
		if (yield* recharger.use_power(amount)) {
			return 1;
		}
	}
	if ((battery_module = rt.at(this.all_components, "CELL")) && battery_module.battery && battery_module.battery.charge) {
		if (yield* (cell = battery_module.battery).use(amount * GLOB.CELLRATE)) {
			return 1;
		} else {
			yield* cell.use(min(amount * GLOB.CELLRATE, cell.charge));
			return 0;
		}
	}
	return 0;
}, true);

// computer_power.dm:25
rt.def("/obj/item/device/modular_computer/proc/give_power", function* give_power(f: Frame, amount: Value) {
	let battery_module: Value = null;
	if ((battery_module = rt.at(this.all_components, "CELL")) && battery_module.battery) {
		return (yield* battery_module.battery.give(amount));
	}
	return 0;
}, true);

// computer_power.dm:31
rt.def("/obj/item/device/modular_computer/proc/get_cell", function get_cell(f: Frame) {
	let battery_module: Value = null;
	if (!((battery_module = rt.at(this.all_components, "CELL")) && battery_module.battery)) return f.dot;
	return battery_module.battery;
});

// computer_power.dm:38
rt.def("/obj/item/device/modular_computer/proc/power_failure", function* power_failure(f: Frame) {
	let I: Value = null, PRG: Value = null;
	if (!this.enabled) return f.dot;
	if (this.active_program) {
		this.active_program.event_powerfailure(0);
	}
	for (I of each(this.idle_threads)) {
		(PRG = I).event_powerfailure(1);
	}
	yield* this.shutdown_computer(0);
	return f.dot;
}, true);

// computer_power.dm:47
rt.def("/obj/item/device/modular_computer/proc/handle_power", function* handle_power(f: Frame) {
	let recharger: Value = null, H: Value = null;
	let $e: any;
	if (recharger = rt.at(this.all_components, "CHARGE")) {
		yield* recharger.process();
	}
	let power_usage: Value = this.screen_on ? this.base_active_power_usage : this.base_idle_power_usage;
	for (H of each(this.all_components, T("/obj/item/weapon/computer_hardware"))) {
		if (H.enabled) {
			power_usage += H.power_usage;
		}
	}
	if (yield* this.use_power(power_usage)) {
		this.last_power_usage = power_usage;
		return 1;
	} else {
		yield* this.power_failure();
		return 0;
	}
}, true);
