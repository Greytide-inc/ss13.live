// From code/modules/modular_computers/computers/item/computer_components.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/device/modular_computer/proc/can_install_component  (code/modules/modular_computers/computers/item/computer_components.dm:2)
rt.def("/obj/item/device/modular_computer/proc/can_install_component", function can_install_component(f: Frame, H: Value, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = null;
	}
	if (!truthy(rt.callName(f, live(H), "can_install", [live(f.src), live(user)]))) {
		return 0;
	}
	if (rt.gt(rt.fv(f, "w_class", live(H)), rt.sv(f, "max_hardware_size"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>This component is too large for ％！!</span>", [live(f.src)])]);
		return 0;
	}
	if (truthy(rt.index(rt.sv(f, "all_components"), rt.fv(f, "device_type", live(H))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>This computer's hardware slot is already occupied by ％！.</span>", [rt.index(rt.sv(f, "all_components"), rt.fv(f, "device_type", live(H)))])]);
		return 0;
	}
	return 1;
});

// /obj/item/device/modular_computer/proc/install_component  (code/modules/modular_computers/computers/item/computer_components.dm:17)  may sleep
rt.def("/obj/item/device/modular_computer/proc/install_component", function* install_component(f: Frame, H: Value, user: Value) {
	f.vars = () => [H, user];
	if (live(user) === null) {
		user = null;
	}
	if (!truthy((yield* g.srcCall(f, "can_install_component", live(H), live(user))))) {
		return 0;
	}
	if ((truthy(live(user)) && !truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(H), live(f.src)]))))) {
		return 0;
	}
	rt.setAt(rt.sv(f, "all_components"), rt.fv(f, "device_type", live(H)), live(H));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You install ％！ into ％！.</span>", [live(H), live(f.src)])]);
	rt.setFv(f, "holder", live(H), live(f.src));
	yield* g.callName(f, live(H), "forceMove", [live(f.src)]);
	yield* g.callName(f, live(H), "on_install", [live(f.src), live(user)]);
	return f.dot;
}, true);

// /obj/item/device/modular_computer/proc/uninstall_component  (code/modules/modular_computers/computers/item/computer_components.dm:33)  may sleep
rt.def("/obj/item/device/modular_computer/proc/uninstall_component", function* uninstall_component(f: Frame, H: Value, user: Value) {
	f.vars = () => [H, user];
	if (live(user) === null) {
		user = null;
	}
	if (!isEqual(rt.fv(f, "holder", live(H)), live(f.src))) {
		return 0;
	}
	yield* g.callName(f, rt.sv(f, "all_components"), "Remove", [rt.fv(f, "device_type", live(H))]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove ％！ from ％！.</span>", [live(H), live(f.src)])]);
	yield* g.callName(f, live(H), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	rt.setFv(f, "holder", live(H), null);
	yield* g.callName(f, live(H), "on_remove", [live(f.src), live(user)]);
	if ((truthy(rt.sv(f, "enabled")) && !truthy((yield* g.srcCall(f, "use_power"))))) {
		yield* g.srcCall(f, "shutdown_computer");
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/modular_computer/proc/find_hardware_by_name  (code/modules/modular_computers/computers/item/computer_components.dm:50)
rt.def("/obj/item/device/modular_computer/proc/find_hardware_by_name", function find_hardware_by_name(f: Frame, name: Value) {
	let i: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [i, O, $e];
	i = null;
	rt.forList(f, 0, rt.sv(f, "all_components"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (isEqual(rt.gv(f, "name", (O = rt.index(rt.sv(f, "all_components"), live(i)))), live(name))) {
			return live(O);
		}
	}
	rt.endFor(f, 0);
	return null;
});
