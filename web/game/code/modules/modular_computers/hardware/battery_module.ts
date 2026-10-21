// From code/modules/modular_computers/hardware/battery_module.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7580, "/obj/item/weapon/computer_hardware/battery", "/obj/item/weapon/computer_hardware", {
	battery: null,
	critical: 1,
	malfunction_probability: 1,
	device_type: "CELL",
	name: "power cell controller",
	desc: "A charge controller for standard power cells, used in all kinds of modular computers.",
	icon_state: "cell_con",
	origin_tech: "powerstorage=1;engineering=1",
});

// /obj/item/weapon/computer_hardware/battery/proc/New  (code/modules/modular_computers/hardware/battery_module.dm:13)  may sleep
rt.def("/obj/item/weapon/computer_hardware/battery/proc/New", function* New(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = null;
	}
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "battery", (yield* g.new_(f, live(f.args[1]), [live(f.src)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["loc", "battery_type"] });

// /obj/item/weapon/computer_hardware/battery/proc/try_insert  (code/modules/modular_computers/hardware/battery_module.dm:17)  may sleep
rt.def("/obj/item/weapon/computer_hardware/battery/proc/try_insert", function* try_insert(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	if (live(user) === null) {
		user = null;
	}
	if (!truthy(rt.sv(f, "holder"))) {
		return 0;
	}
	if (!truthy((rt.istype(live(I), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(rt.sv(f, "battery"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You try to connect ％！ to ％！, but its connectors are occupied.</span>", [live(I), live(f.src)])]);
		return 0;
	}
	if (rt.gt(rt.fv(f, "w_class", live(I)), rt.fv(f, "max_hardware_size", rt.sv(f, "holder")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>This power cell is too large for ％！!</span>", [rt.sv(f, "holder")])]);
		return 0;
	}
	if ((truthy(live(user)) && !truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(I), live(f.src)]))))) {
		return 0;
	}
	rt.setSv(f, "battery", live(I));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You connect ％！ to ％！.</span>", [live(I), live(f.src)])]);
	return 1;
}, true);

// /obj/item/weapon/computer_hardware/battery/proc/try_eject  (code/modules/modular_computers/hardware/battery_module.dm:41)  may sleep
rt.def("/obj/item/weapon/computer_hardware/battery/proc/try_eject", function* try_eject(f: Frame, slot: Value, user: Value, forced: Value) {
	f.vars = () => [slot, user, forced];
	if (live(slot) === null) {
		slot = 0;
	}
	if (live(user) === null) {
		user = null;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if (!truthy(rt.sv(f, "battery"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>There is no power cell connected to ％！.</span>", [live(f.src)])]);
		return 0;
	} else {
		yield* g.callName(f, rt.sv(f, "battery"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You detach ％！ from ％！.</span>", [rt.sv(f, "battery"), live(f.src)])]);
		rt.setSv(f, "battery", null);
		if (truthy(rt.sv(f, "holder"))) {
			if ((truthy(rt.fv(f, "enabled", rt.sv(f, "holder"))) && !truthy((yield* g.callName(f, rt.sv(f, "holder"), "use_power", []))))) {
				yield* g.callName(f, rt.sv(f, "holder"), "shutdown_computer", []);
			}
		}
		return 1;
	}
	return 0;
}, true);
