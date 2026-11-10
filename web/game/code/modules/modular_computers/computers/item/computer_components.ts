// Based on /tg/station's code/modules/modular_computers/computers/item/computer_components.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { fmt } = rt;


// computer_components.dm:2
rt.def("/obj/item/device/modular_computer/proc/can_install_component", function can_install_component(f: Frame, H: Value, user: Value) {
	if (!H.can_install(this, user)) {
		return 0;
	}
	if (H.w_class > this.max_hardware_size) {
		to_chat(user, fmt("<span class='warning'>This component is too large for ％！!</span>", [this]));
		return 0;
	}
	if (rt.index(this.all_components, H.device_type)) {
		to_chat(user, fmt("<span class='warning'>This computer's hardware slot is already occupied by ％！.</span>", [rt.index(this.all_components, H.device_type)]));
		return 0;
	}
	return 1;
});

// computer_components.dm:17
rt.def("/obj/item/device/modular_computer/proc/install_component", function* install_component(f: Frame, H: Value, user: Value) {
	if (!this.can_install_component(H, user)) {
		return 0;
	}
	if (user && !(yield* user.transferItemToLoc(H, this))) {
		return 0;
	}
	rt.setAt(this.all_components, H.device_type, H);
	to_chat(user, fmt("<span class='notice'>You install ％！ into ％！.</span>", [H, this]));
	H.holder = this;
	yield* H.forceMove(this);
	H.on_install(this, user);
	return f.dot;
}, true);

// computer_components.dm:33
rt.def("/obj/item/device/modular_computer/proc/uninstall_component", function* uninstall_component(f: Frame, H: Value, user: Value) {
	if (H.holder != this) {
		return 0;
	}
	yield* this.all_components.Remove(H.device_type);
	to_chat(user, fmt("<span class='notice'>You remove ％！ from ％！.</span>", [H, this]));
	yield* H.forceMove(rt.getStep(f, this, 0));
	H.holder = null;
	yield* H.on_remove(this, user);
	if (this.enabled && !(yield* this.use_power())) {
		yield* this.shutdown_computer();
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// computer_components.dm:50
rt.def("/obj/item/device/modular_computer/proc/find_hardware_by_name", function find_hardware_by_name(f: Frame, name: Value) {
	let i: Value = null, O: Value = null;
	for (i of each(this.all_components)) {
		if ((O = rt.index(this.all_components, i)).name == name) {
			return O;
		}
	}
	return null;
});
