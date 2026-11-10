// Based on /tg/station's code/modules/modular_computers/hardware/portable_disk.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// portable_disk.dm:13
rt.def("/obj/item/weapon/computer_hardware/hard_drive/portable/proc/on_install", function on_install(f: Frame, M: Value, user: Value) {
	M.add_verb(this.device_type);
	return f.dot;
});

// portable_disk.dm:16
rt.def("/obj/item/weapon/computer_hardware/hard_drive/portable/proc/on_remove", function* on_remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = null;
	}
	yield* parent_proc();
	f.args[0].remove_verb(this.device_type);
	return f.dot;
}, true, { args: ["M", "user"] });
