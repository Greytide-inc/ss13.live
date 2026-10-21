// From code/modules/modular_computers/hardware/portable_disk.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7592, "/obj/item/weapon/computer_hardware/hard_drive/portable", "/obj/item/weapon/computer_hardware/hard_drive", {
	power_usage: 10,
	critical: 0,
	max_capacity: 16,
	device_type: "SDD",
	name: "data disk",
	desc: "Removable disk used to store data.",
	icon_state: "datadisk6",
	w_class: 1,
	origin_tech: "programming=1",
});

// /obj/item/weapon/computer_hardware/hard_drive/portable/proc/on_install  (code/modules/modular_computers/hardware/portable_disk.dm:13)
rt.def("/obj/item/weapon/computer_hardware/hard_drive/portable/proc/on_install", function on_install(f: Frame, M: Value, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = null;
	}
	rt.callName(f, live(M), "add_verb", [rt.sv(f, "device_type")]);
	return f.dot;
});

// /obj/item/weapon/computer_hardware/hard_drive/portable/proc/on_remove  (code/modules/modular_computers/hardware/portable_disk.dm:16)  may sleep
rt.def("/obj/item/weapon/computer_hardware/hard_drive/portable/proc/on_remove", function* on_remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = null;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, live(f.args[0]), "remove_verb", [rt.sv(f, "device_type")]);
	return f.dot;
}, true, { args: ["M", "user"] });
