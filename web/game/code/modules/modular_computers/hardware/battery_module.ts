// Based on /tg/station's code/modules/modular_computers/hardware/battery_module.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// battery_module.dm:13
rt.def("/obj/item/weapon/computer_hardware/battery/proc/New", function* New(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = null;
	}
	if (f.args[1]) {
		this.battery = (yield* new_(f.args[1], this));
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["loc", "battery_type"] });

// battery_module.dm:17
rt.def("/obj/item/weapon/computer_hardware/battery/proc/try_insert", function* try_insert(f: Frame, I: Value, user: Value) {
	if (!this.holder) {
		return 0;
	}
	if (!rt.istype(I, T("/obj/item/weapon/stock_parts/cell"))) {
		return 0;
	}
	if (this.battery) {
		to_chat(user, fmt("<span class='warning'>You try to connect ％！ to ％！, but its connectors are occupied.</span>", [I, this]));
		return 0;
	}
	if (I.w_class > this.holder.max_hardware_size) {
		to_chat(user, fmt("<span class='warning'>This power cell is too large for ％！!</span>", [this.holder]));
		return 0;
	}
	if (user && !(yield* user.transferItemToLoc(I, this))) {
		return 0;
	}
	this.battery = I;
	to_chat(user, fmt("<span class='notice'>You connect ％！ to ％！.</span>", [I, this]));
	return 1;
}, true);

// battery_module.dm:41
rt.def("/obj/item/weapon/computer_hardware/battery/proc/try_eject", function* try_eject(f: Frame, slot: Value, user: Value, forced: Value) {
	slot ??= 0;
	forced ??= 0;
	if (!this.battery) {
		to_chat(user, fmt("<span class='warning'>There is no power cell connected to ％！.</span>", [this]));
		return 0;
	} else {
		yield* this.battery.forceMove(rt.getStep(f, this, 0));
		to_chat(user, fmt("<span class='notice'>You detach ％！ from ％！.</span>", [this.battery, this]));
		this.battery = null;
		if (this.holder) {
			if (this.holder.enabled && !(yield* this.holder.use_power())) {
				yield* this.holder.shutdown_computer();
			}
		}
		return 1;
	}
	return 0;
}, true);
