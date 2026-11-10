// Based on /tg/station's code/modules/assembly/holder.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9387, "/obj/item/device/assembly_holder", "/obj/item/device", {
	a_left: null,
	a_right: null,
	flags: 64,
	throw_speed: 2,
	throw_range: 7,
	name: "Assembly",
	icon: rt.rsc("icons/obj/assemblies/new_assemblies.dmi"),
	icon_state: "holder",
	item_state: "assembly",
	throwforce: 5,
	w_class: 2,
});

// holder.dm:20
rt.def("/obj/item/device/assembly_holder/proc/assemble", function* assemble(f: Frame, A: Value, A2: Value, user: Value) {
	yield* this.attach(A, user);
	yield* this.attach(A2, user);
	this.name = `${A.name}-${A2.name} assembly`;
	yield* this.update_icon();
	return f.dot;
}, true);

// holder.dm:27
rt.def("/obj/item/device/assembly_holder/proc/attach", function* attach(f: Frame, A: Value, user: Value) {
	if (!(yield* A.remove_item_from_storage(this))) {
		if (user) {
			yield* user.transferItemToLoc(A, this);
		} else {
			yield* A.forceMove(this);
		}
	}
	A.holder = this;
	yield* A.toggle_secure();
	if (!this.a_left) {
		this.a_left = A;
	} else {
		this.a_right = A;
	}
	return f.dot;
}, true);

// holder.dm:40
rt.def("/obj/item/device/assembly_holder/proc/update_icon", function* update_icon(f: Frame) {
	let O: Value = null, right: Value = null, O_1: Value = null;
	this.cut_overlays();
	if (this.a_left) {
		this.add_overlay(`${this.a_left.icon_state}_left`);
		for (O of each(this.a_left.attached_overlays)) {
			this.add_overlay(`${O}_l`);
		}
	}
	if (this.a_right) {
		(right = mutable_appearance(this.icon, `${this.a_right.icon_state}_left`)).transform = matrix(-1, 0, 0, 0, 1, 0);
		for (O_1 of each(this.a_right.attached_overlays)) {
			right.add_overlay(`${O_1}_l`);
		}
		this.add_overlay(right);
	}
	if (!this.master) return f.dot;
	yield* this.master.update_icon();
	return f.dot;
}, true);

// holder.dm:58
rt.def("/obj/item/device/assembly_holder/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	if (this.a_left) {
		yield* this.a_left.Crossed(AM);
	}
	if (!this.a_right) return f.dot;
	yield* this.a_right.Crossed(AM);
	return f.dot;
}, true);

// holder.dm:64
rt.def("/obj/item/device/assembly_holder/proc/on_found", function* on_found(f: Frame, finder: Value) {
	if (this.a_left) {
		yield* this.a_left.on_found(finder);
	}
	if (!this.a_right) return f.dot;
	yield* this.a_right.on_found(finder);
	return f.dot;
}, true);

// holder.dm:69
rt.def("/obj/item/device/assembly_holder/proc/Move", function* Move(f: Frame) {
	yield* parent_proc();
	if (this.a_left && this.a_right) {
		yield* this.a_left.holder_movement();
		yield* this.a_right.holder_movement();
	}
	return f.dot;
}, true);

// holder.dm:76
rt.def("/obj/item/device/assembly_holder/proc/attack_hand", function* attack_hand(f: Frame) {
	if (this.a_left && this.a_right) {
		yield* this.a_left.holder_movement();
		yield* this.a_right.holder_movement();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// holder.dm:83
rt.def("/obj/item/device/assembly_holder/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (!(_T = rt.getStep(f, this, 0))) {
			return 0;
		}
		if (this.a_left) {
			this.a_left.holder = null;
			this.a_left.loc = _T;
		}
		if (this.a_right) {
			this.a_right.holder = null;
			this.a_right.loc = _T;
		}
		yield* qdel(this);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// holder.dm:98
rt.def("/obj/item/device/assembly_holder/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	if (!this.a_left || !this.a_right) {
		to_chat(user, "<span class='danger'>Assembly part missing!</span>");
		return f.dot;
	}
	if (rt.op(f, "IsType", [], [this.a_left, this.a_right.type])) {
		const subject = (yield* alert("Which side would you like to use?", null, "Left", "Right"));
		if (subject === "Left") {
			yield* this.a_left.attack_self(user);
		} else if (subject === "Right") {
			yield* this.a_right.attack_self(user);
		}
		return f.dot;
	} else {
		yield* this.a_left.attack_self(user);
		yield* this.a_right.attack_self(user);
	}
	return f.dot;
}, true);

// holder.dm:115
rt.def("/obj/item/device/assembly_holder/proc/process_activation", function* process_activation(f: Frame, D: Value, normal: Value, special: Value) {
	normal ??= 1;
	special ??= 1;
	if (!D) {
		return 0;
	}
	if (normal && this.a_right && this.a_left) {
		if (this.a_right != D) {
			this.a_right.pulsed(0);
		}
		if (this.a_left != D) {
			this.a_left.pulsed(0);
		}
	}
	if (this.master) {
		yield* this.master.receive_signal();
	}
	return 1;
}, true);
