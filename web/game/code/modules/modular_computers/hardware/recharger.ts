// From code/modules/modular_computers/hardware/recharger.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7600, "/obj/item/weapon/computer_hardware/recharger", "/obj/item/weapon/computer_hardware", {
	charge_rate: 100,
	critical: 1,
	enabled: 1,
	device_type: "CHARGE",
});

// /obj/item/weapon/computer_hardware/recharger/proc/process  (code/modules/modular_computers/hardware/recharger.dm:13)  may sleep
rt.def("/obj/item/weapon/computer_hardware/recharger/proc/process", function* process(f: Frame) {
	let battery_module: Value = null, cell: Value = null;
	f.vars = () => [battery_module, cell];
	yield* g.callSuper(f, [], rt.Args.Same);
	battery_module = rt.index(rt.fv(f, "all_components", rt.sv(f, "holder")), "CELL");
	if (((!truthy(rt.sv(f, "holder")) || !truthy(live(battery_module))) || !truthy(rt.fv(f, "battery", live(battery_module))))) {
		return live(f.dot);
	}
	if (rt.ge(rt.gv(f, "charge", (cell = rt.fv(f, "battery", live(battery_module)))), rt.fv(f, "maxcharge", live(cell)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callSrc(f, "use_power", [null, rt.sv(f, "charge_rate"), "charging", 1], rt.Args.Named)))) return f.dot;
	yield* g.callName(f, rt.sv(f, "holder"), "give_power", [multiply(rt.sv(f, "charge_rate"), rt.gl("CELLRATE"))]);
	return f.dot;
}, true, { waitfor: false });

rt.type(7601, "/obj/item/weapon/computer_hardware/recharger/APC", "/obj/item/weapon/computer_hardware/recharger", {
	name: "area power connector",
	desc: "A device that wirelessly recharges connected device from nearby APC.",
	icon_state: "charger_APC",
	w_class: 2,
	origin_tech: "programming=2;engineering=2;powerstorage=3",
});

// /obj/item/weapon/computer_hardware/recharger/APC/proc/use_power  (code/modules/modular_computers/hardware/recharger.dm:34)
rt.def("/obj/item/weapon/computer_hardware/recharger/APC/proc/use_power", function use_power(f: Frame, amount: Value, charging: Value) {
	let M: Value = null, A: Value = null;
	f.vars = () => [charging, M, A];
	if (live(charging) === null) {
		charging = 0;
	}
	if (truthy((rt.istype(rt.fv(f, "physical", rt.sv(f, "holder")), T("/obj/machinery")) ? 1 : 0))) {
		if (truthy(rt.callName(f, (M = rt.fv(f, "physical", rt.sv(f, "holder"))), "powered", []))) {
			rt.callName(f, live(M), "use_power", [live(amount)]);
			return 1;
		}
	} else {
		if (!truthy((rt.istype((A = rt.call(f, P("/proc/get_area"), null, [live(f.src)])), T("/area")) ? 1 : 0))) {
			return 0;
		}
		if (truthy(rt.callName(f, live(A), "powered", [1]))) {
			rt.callName(f, live(A), "use_power", [live(amount), 1]);
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

// /obj/item/weapon/computer_hardware/recharger/wired/proc/can_install  (code/modules/modular_computers/hardware/recharger.dm:58)
rt.def("/obj/item/weapon/computer_hardware/recharger/wired/proc/can_install", function can_install(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = null;
	}
	if ((truthy((rt.istype(rt.fv(f, "physical", live(f.args[0])), T("/obj/machinery")) ? 1 : 0)) && truthy(rt.gv(f, "anchored", rt.fv(f, "physical", live(f.args[0])))))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ is incompatible with portable computers!</span>", [live(f.src)])]);
	return 0;
}, false, { args: ["M", "user"] });

// /obj/item/weapon/computer_hardware/recharger/wired/proc/use_power  (code/modules/modular_computers/hardware/recharger.dm:64)
rt.def("/obj/item/weapon/computer_hardware/recharger/wired/proc/use_power", function use_power(f: Frame, amount: Value, charging: Value) {
	let M: Value = null, _T: Value = null, C: Value = null, power_in_net: Value = null;
	f.vars = () => [charging, M, _T, C, power_in_net];
	if (live(charging) === null) {
		charging = 0;
	}
	if ((truthy((rt.istype(rt.fv(f, "physical", rt.sv(f, "holder")), T("/obj/machinery")) ? 1 : 0)) && truthy(rt.gv(f, "anchored", rt.fv(f, "physical", rt.sv(f, "holder")))))) {
		M = rt.fv(f, "physical", rt.sv(f, "holder"));
		if ((!truthy((_T = rt.fv(f, "loc", live(M)))) || !truthy((rt.istype(live(_T), T("/turf")) ? 1 : 0)))) {
			return 0;
		}
		if ((!truthy((C = rt.callName(f, live(_T), "get_cable_node", []))) || !truthy(rt.fv(f, "powernet", live(C))))) {
			return 0;
		}
		if ((truthy((power_in_net = subtract(rt.gv(f, "avail", rt.fv(f, "powernet", live(C))), rt.gv(f, "load", rt.fv(f, "powernet", live(C)))))) && rt.gt(live(power_in_net), live(amount)))) {
			rt.modField(f, rt.fv(f, "powernet", live(C)), "load", live(amount), add);
			return 1;
		}
	}
	return 0;
});
