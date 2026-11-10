// Based on /tg/station's code/modules/assembly/assembly.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9360, "/obj/item/device/assembly", "/obj/item/device", {
	secured: 1,
	attached_overlays: null,
	holder: null,
	attachable: 0,
	connected: null,
	WIRE_RECEIVE: 1,
	WIRE_PULSE: 2,
	WIRE_PULSE_SPECIAL: 4,
	WIRE_RADIO_RECEIVE: 8,
	WIRE_RADIO_PULSE: 16,
	next_activate: 0,
	wire_type: 3,
	flags: 64,
	throw_speed: 3,
	throw_range: 7,
	name: "assembly",
	desc: "A small electronic device that should never exist.",
	icon: rt.rsc("icons/obj/assemblies/new_assemblies.dmi"),
	icon_state: "",
	w_class: 2,
	materials: null,
	throwforce: 2,
	origin_tech: "magnets=1;engineering=1",
}, { const: ["WIRE_RECEIVE","WIRE_PULSE","WIRE_PULSE_SPECIAL","WIRE_RADIO_RECEIVE","WIRE_RADIO_PULSE"] });

// assembly.dm:8
rt.def("/obj/item/device/assembly/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 100]);
	return f.dot;
});

// assembly.dm:37
rt.def("/obj/item/device/assembly/proc/describe", function describe(f: Frame) {
	return "The trigger assembly looks broken!";
});

// assembly.dm:41
rt.def("/obj/item/device/assembly/proc/is_secured", function is_secured(f: Frame, user: Value) {
	if (!this.secured) {
		to_chat(user, `<span class='warning'>The ${this.name} is unsecured!</span>`);
		return 0;
	}
	return 1;
});

// assembly.dm:49
rt.def("/obj/item/device/assembly/proc/pulsed", function pulsed(f: Frame, radio: Value) {
	radio ??= 0;
	if (rt.bitAnd(this.wire_type, 1)) {
		rt.spawnTail(f, 0, "/obj/item/device/assembly/proc/pulsed: spawn at modules/assembly/assembly.dm:50", radio);
	}
	if (radio && rt.bitAnd(this.wire_type, 8)) {
		rt.spawnTail(f, 0, "/obj/item/device/assembly/proc/pulsed: spawn at modules/assembly/assembly.dm:53", radio);
	}
	return 1;
});

// a spawn(0) body of /obj/item/device/assembly/proc/pulsed, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/proc/pulsed: spawn at modules/assembly/assembly.dm:53", function* (f: Frame, radio: Value) {
	yield* this.activate();
	return null;
});

// a spawn(0) body of /obj/item/device/assembly/proc/pulsed, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/proc/pulsed: spawn at modules/assembly/assembly.dm:50", function* (f: Frame, radio: Value) {
	yield* this.activate();
	return null;
});

// assembly.dm:60
rt.def("/obj/item/device/assembly/proc/pulse", function* pulse(f: Frame, radio: Value) {
	radio ??= 0;
	if (this.connected && this.wire_type) {
		yield* this.connected.pulse_assembly(this);
		return 1;
	}
	if (this.holder && rt.bitAnd(this.wire_type, 2)) {
		yield* this.holder.process_activation(this, 1, 0);
	}
	if (this.holder && rt.bitAnd(this.wire_type, 4)) {
		yield* this.holder.process_activation(this, 0, 1);
	}
	return 1;
}, true);

// assembly.dm:72
rt.def("/obj/item/device/assembly/proc/activate", function activate(f: Frame) {
	if (!this || this.gc_destroyed || !this.secured || this.next_activate > rt.worldTime(f)) {
		return 0;
	}
	this.next_activate = rt.worldTime(f) + 30;
	return 1;
});

// assembly.dm:79
rt.def("/obj/item/device/assembly/proc/toggle_secure", function* toggle_secure(f: Frame) {
	this.secured = (!this.secured ? 1 : 0);
	yield* this.update_icon();
	return this.secured;
}, true);

// assembly.dm:85
rt.def("/obj/item/device/assembly/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let A: Value = null;
	if (rt.istype(W, T("/obj/item/device/assembly"))) {
		if (!(A = W).secured && !this.secured) {
			this.holder = (yield* new_(T("/obj/item/device/assembly_holder"), rt.getStep(f, this, 0)));
			yield* this.holder.assemble(this, A, user);
			to_chat(user, fmt("<span class='notice'>You attach and secure ％！ to ％！!</span>", [A, this]));
		} else {
			to_chat(user, "<span class='warning'>Both devices must be in attachable mode to be attached together.</span>");
		}
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (yield* this.toggle_secure()) {
			to_chat(user, fmt("<span class='notice'>＄！ is ready!</span>", [this]));
		} else {
			to_chat(user, fmt("<span class='notice'>＄！ can now be attached!</span>", [this]));
		}
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// assembly.dm:104
rt.def("/obj/item/device/assembly/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.secured) {
		to_chat(user, fmt("＄！ is secured and ready to be used.", [this]));
	} else {
		to_chat(user, fmt("＄！ can be attached to other things.", [this]));
	}
	return f.dot;
}, false);

// assembly.dm:112
rt.def("/obj/item/device/assembly/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!user) {
		return 0;
	}
	yield* user.set_machine(this);
	yield* this.interact(user);
	return 1;
}, true);
