// Based on /tg/station's code/modules/modular_computers/computers/item/laptop.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9410, "/obj/item/device/modular_computer/laptop", "/obj/item/device/modular_computer", {
	start_open: 1,
	icon_state_closed: "laptop-closed",
	w_class_open: 4,
	slowdown_open: 1,
	icon_state_powered: "laptop",
	icon_state_unpowered: "laptop-off",
	icon_state_menu: "menu",
	hardware_flag: 2,
	max_hardware_size: 2,
	screen_on: 0,
	name: "laptop",
	desc: "A portable laptop computer.",
	icon: rt.rsc("icons/obj/modular_laptop.dmi"),
	icon_state: "laptop-closed",
	w_class: 3,
});

// laptop.dm:22
rt.def("/obj/item/device/modular_computer/laptop/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "slows_while_in_hand", 1);
	if (!(this.start_open && !this.screen_on)) return f.dot;
	yield* this.toggle_open();
	return f.dot;
}, true);

// laptop.dm:32
rt.def("/obj/item/device/modular_computer/laptop/proc/update_icon", function update_icon(f: Frame) {
	if (this.screen_on) {
		parent_proc();
	} else {
		this.cut_overlays();
		this.icon_state = this.icon_state_closed;
	}
	return f.dot;
});

// laptop.dm:38
rt.def("/obj/item/device/modular_computer/laptop/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.screen_on) {
		this.try_toggle_open(user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// laptop.dm:48
rt.def("/obj/item/device/modular_computer/laptop/verb/open_computer", function open_computer(f: Frame) {
	this.try_toggle_open(f.usr);
	return f.dot;
}, false, { verb: { name: "Toggle Open", category: "Object", src: 1, range: 1 } });

// laptop.dm:51
rt.def("/obj/item/device/modular_computer/laptop/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	let H: Value = null, M: Value = null;
	if (over_object == f.usr || over_object == this) {
		this.try_toggle_open(f.usr);
	} else {
		if (!rt.istype(over_object, T("/obj/screen/inventory/hand"))) return f.dot;
		H = over_object;
		if (!(!(M = f.usr).restrained() && !M.stat)) return f.dot;
		if (!isturf(this.loc) || !this.Adjacent(M)) {
			return f.dot;
		}
		yield* M.put_in_hand(this, H.held_index);
	}
	return f.dot;
}, true);

// laptop.dm:63
rt.def("/obj/item/device/modular_computer/laptop/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.screen_on && isturf(this.loc)) {
		return (yield* this.attack_self(user));
	}
	return (yield* parent_proc());
}, true);

// laptop.dm:70
rt.def("/obj/item/device/modular_computer/laptop/proc/try_toggle_open", function try_toggle_open(f: Frame, user: Value) {
	if (rt.istype(user, T("/mob/living/silicon"))) {
		return f.dot;
	}
	if (!isturf(this.loc) && !ismob(this.loc)) {
		return f.dot;
	}
	if (!user.canUseTopic(this)) {
		return f.dot;
	}
	this.toggle_open(user);
	return f.dot;
});

// laptop.dm:82
rt.def("/obj/item/device/modular_computer/laptop/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	if (this.screen_on) {
		this.try_toggle_open(user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// laptop.dm:88
rt.def("/obj/item/device/modular_computer/laptop/proc/toggle_open", function toggle_open(f: Frame, user: Value) {
	if (this.screen_on) {
		to_chat(user, fmt("<span class='notice'>You close ％！.</span>", [this]));
		this.slowdown = rt.initial(f, this, "slowdown");
		this.w_class = rt.initial(f, this, "w_class");
	} else {
		to_chat(user, fmt("<span class='notice'>You open ％！.</span>", [this]));
		this.slowdown = this.slowdown_open;
		this.w_class = this.w_class_open;
	}
	this.screen_on = (!this.screen_on ? 1 : 0);
	this.update_icon();
	return f.dot;
});
