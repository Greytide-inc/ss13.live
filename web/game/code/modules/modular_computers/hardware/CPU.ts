// From code/modules/modular_computers/hardware/CPU.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7582, "/obj/item/weapon/computer_hardware/processor_unit", "/obj/item/weapon/computer_hardware", {
	max_idle_programs: 2,
	power_usage: 50,
	critical: 1,
	malfunction_probability: 1,
	device_type: "CPU",
	name: "processor board",
	desc: "A standard CPU board used in most computers. It can run up to three programs simultaneously.",
	icon_state: "cpuboard",
	w_class: 2,
	origin_tech: "programming=3;engineering=2",
});

// /obj/item/weapon/computer_hardware/processor_unit/proc/on_remove  (code/modules/modular_computers/hardware/CPU.dm:17)  may sleep
rt.def("/obj/item/weapon/computer_hardware/processor_unit/proc/on_remove", function* on_remove(f: Frame, MC: Value, user: Value) {
	f.vars = () => [MC, user];
	yield* g.callName(f, live(MC), "shutdown_computer", []);
	return f.dot;
}, true);
