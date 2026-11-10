// Based on /tg/station's code/modules/modular_computers/hardware/CPU.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// CPU.dm:17
rt.def("/obj/item/weapon/computer_hardware/processor_unit/proc/on_remove", function* on_remove(f: Frame, MC: Value, user: Value) {
	yield* MC.shutdown_computer();
	return f.dot;
}, true);
