// Based on /tg/station's code/modules/modular_computers/hardware/recharger.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7600, "/obj/item/weapon/computer_hardware/recharger", "/obj/item/weapon/computer_hardware", {
	charge_rate: 100,
	critical: 1,
	enabled: 1,
	device_type: "CHARGE",
});

// recharger.dm:13
rt.def("/obj/item/weapon/computer_hardware/recharger/proc/process", function* process(f: Frame) {
	let cell: Value = null;
	yield* parent_proc();
	let battery_module: Value = rt.index(this.holder.all_components, "CELL");
	if (!this.holder || !battery_module || !battery_module.battery) {
		return f.dot;
	}
	if ((cell = battery_module.battery).charge >= cell.maxcharge) {
		return f.dot;
	}
	if (!(yield* this.use_power(this.charge_rate, { charging: 1 }))) return f.dot;
	yield* this.holder.give_power(this.charge_rate * GLOB.CELLRATE);
	return f.dot;
}, true, { waitfor: false });

rt.type(7601, "/obj/item/weapon/computer_hardware/recharger/APC", "/obj/item/weapon/computer_hardware/recharger", {
	name: "area power connector",
	desc: "A device that wirelessly recharges connected device from nearby APC.",
	icon_state: "charger_APC",
	w_class: 2,
	origin_tech: "programming=2;engineering=2;powerstorage=3",
});

// recharger.dm:34
rt.def("/obj/item/weapon/computer_hardware/recharger/APC/proc/use_power", function use_power(f: Frame, amount: Value, charging: Value) {
	let M: Value = null, A: Value = null;
	charging ??= 0;
	if (rt.istype(this.holder.physical, T("/obj/machinery"))) {
		if ((M = this.holder.physical).powered()) {
			M.use_power(amount);
			return 1;
		}
	} else {
		if (!rt.istype((A = get_area(this)), T("/area"))) {
			return 0;
		}
		if (A.powered(1)) {
			A.use_power(amount, 1);
			return 1;
		}
	}
	return 0;
});

rt.type(7602, "/obj/item/weapon/computer_hardware/recharger/wired", "/obj/item/weapon/computer_hardware/recharger", {
	name: "wired power connector",
	desc: "A power connector that recharges connected device from nearby power wire. Incompatible with portable computers.",
	icon_state: "charger_wire",
	w_class: 3,
	origin_tech: "engineering=2;powerstorage=1",
});

// recharger.dm:58
rt.def("/obj/item/weapon/computer_hardware/recharger/wired/proc/can_install", function can_install(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = null;
	}
	if (rt.istype(f.args[0].physical, T("/obj/machinery")) && f.args[0].physical.anchored) {
		return parent_proc();
	}
	to_chat(f.args[1], fmt("<span class='warning'>＄！ is incompatible with portable computers!</span>", [this]));
	return 0;
}, false, { args: ["M", "user"] });

// recharger.dm:64
rt.def("/obj/item/weapon/computer_hardware/recharger/wired/proc/use_power", function use_power(f: Frame, amount: Value, charging: Value) {
	let M: Value = null, _T: Value = null, C: Value = null, power_in_net: Value = null;
	charging ??= 0;
	if (rt.istype(this.holder.physical, T("/obj/machinery")) && this.holder.physical.anchored) {
		M = this.holder.physical;
		if (!(_T = M.loc) || !rt.istype(_T, T("/turf"))) {
			return 0;
		}
		if (!(C = _T.get_cable_node()) || !C.powernet) {
			return 0;
		}
		if ((power_in_net = C.powernet.avail - C.powernet.load) && power_in_net > amount) {
			C.powernet.load += amount;
			return 1;
		}
	}
	return 0;
});
