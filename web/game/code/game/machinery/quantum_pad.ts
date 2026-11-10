// Based on /tg/station's code/game/machinery/quantum_pad.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10811, "/obj/machinery/quantumpad", "/obj/machinery", {
	teleport_cooldown: 400,
	teleport_speed: 50,
	last_teleport: null,
	teleporting: 0,
	power_efficiency: 1,
	linked_pad: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 200,
	active_power_usage: 5000,
	name: "quantum pad",
	desc: "A bluespace quantum-linked telepad used for teleporting objects to other quantum pads.",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "qpad-idle",
	unique_rename: 1,
});

// quantum_pad.dm:19
rt.def("/obj/machinery/quantumpad/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/quantumpad"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6725, "/obj/item/weapon/circuitboard/machine/quantumpad", "/obj/item/weapon/circuitboard/machine", {
	name: "Quantum Pad (Machine Board)",
	build_path: rt.typePath("/obj/machinery/quantumpad"),
	origin_tech: "programming=3;engineering=3;plasmatech=3;bluespace=4",
	req_components: null,
	def_components: null,
});

// quantum_pad.dm:27
rt.def("/obj/item/weapon/circuitboard/machine/quantumpad/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), 1, T("/obj/item/weapon/stock_parts/capacitor"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/stack/cable_coil"), 1]);

	this.def_components = rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), T("/obj/item/weapon/ore/bluespace_crystal/artificial")]);
	return f.dot;
});

// quantum_pad.dm:36
rt.def("/obj/machinery/quantumpad/proc/RefreshParts", function RefreshParts(f: Frame) {
	let C: Value = null, M: Value = null;
	let E: Value = 0;
	for (C of each(this.component_parts, T("/obj/item/weapon/stock_parts/capacitor"))) {
		E += C.rating;
	}
	this.power_efficiency = E;
	E = 0;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		E += M.rating;
	}
	this.teleport_speed = rt.initial(f, this, "teleport_speed");
	this.teleport_speed -= E * 10;
	this.teleport_cooldown = rt.initial(f, this, "teleport_cooldown");
	this.teleport_cooldown -= E * 100;
	return f.dot;
});

// quantum_pad.dm:48
rt.def("/obj/machinery/quantumpad/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let M: Value = null;
	if (this.default_deconstruction_screwdriver(user, "pad-idle-o", "qpad-idle", I)) {
		return f.dot;
	}
	if (this.panel_open) {
		if (rt.istype(I, T("/obj/item/device/multitool"))) {
			(M = I).buffer = this;
			to_chat(user, `<span class='notice'>You save the data in the ${I.name}'s buffer.</span>`);
			return 1;
		}
	} else if (rt.istype(I, T("/obj/item/device/multitool"))) {
		if (rt.istype((M = I).buffer, T("/obj/machinery/quantumpad"))) {
			this.linked_pad = M.buffer;
			to_chat(user, `<span class='notice'>You link the ${this} to the one in the ${I.name}'s buffer.</span>`);
			return 1;
		}
	}
	if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// quantum_pad.dm:74
rt.def("/obj/machinery/quantumpad/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.panel_open) {
		to_chat(user, "<span class='warning'>The panel must be closed before operating this machine!</span>");
		return f.dot;
	}
	if (!this.linked_pad || !this.linked_pad || this.linked_pad.gc_destroyed) {
		to_chat(user, "<span class='warning'>There is no linked pad!</span>");
		return f.dot;
	}
	if (rt.worldTime(f) < this.last_teleport + this.teleport_cooldown) {
		to_chat(user, `<span class='warning'>${this} is recharging power. Please wait ${round((this.last_teleport + this.teleport_cooldown - rt.worldTime(f)) / 10)} seconds.</span>`);
		return f.dot;
	}
	if (this.teleporting) {
		to_chat(user, `<span class='warning'>${this} is charging up. Please wait.</span>`);
		return f.dot;
	}
	if (this.linked_pad.teleporting) {
		to_chat(user, "<span class='warning'>Linked pad is busy. Please wait.</span>");
		return f.dot;
	}
	if (rt.bitAnd(this.linked_pad.stat, 2)) {
		to_chat(user, "<span class='warning'>Linked pad is not responding to ping.</span>");
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	yield* this.doteleport(user);
	return f.dot;
}, true);

// quantum_pad.dm:101
rt.def("/obj/machinery/quantumpad/proc/sparks", function sparks(f: Frame) {
	let s: Value = null;
	(s = new_(T("/datum/effect_system/spark_spread"))).set_up(5, 1, rt.getStep(f, this, 0));
	s.start();
	return f.dot;
});

// quantum_pad.dm:107
rt.def("/obj/machinery/quantumpad/proc/attack_ghost", function* attack_ghost(f: Frame, ghost: Value) {
	if (!this.linked_pad) return f.dot;
	yield* ghost.forceMove(rt.getStep(f, this.linked_pad, 0));
	return f.dot;
}, true);

// quantum_pad.dm:111
rt.def("/obj/machinery/quantumpad/proc/doteleport", function doteleport(f: Frame, user: Value) {
	let ROI: Value = null, L: Value = null;
	if (!this.linked_pad) return f.dot;
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/weapons/flash.ogg"), 25, 1);
	this.teleporting = 1;
	rt.spawnTail(f, this.teleport_speed, "/obj/machinery/quantumpad/proc/doteleport: spawn at game/machinery/quantum_pad.dm:114", user, ROI, L);
	return f.dot;
});

// a spawn(rt.srcVarI(f, $ic[36])) body of /obj/machinery/quantumpad/proc/doteleport, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/quantumpad/proc/doteleport: spawn at game/machinery/quantum_pad.dm:114", function* (f: Frame, user: Value, ROI: Value, L: Value) {
	if (!this || !this || this.gc_destroyed) {
		this.teleporting = 0;
		return f.dot;
	}
	if (rt.bitAnd(this.stat, 2)) {
		to_chat(user, `<span class='warning'>${this} is unpowered!</span>`);
		this.teleporting = 0;
		return f.dot;
	}
	if (!this.linked_pad || !this.linked_pad || this.linked_pad.gc_destroyed || rt.bitAnd(this.linked_pad.stat, 2)) {
		to_chat(user, "<span class='warning'>Linked pad is not responding to ping. Teleport aborted.</span>");
		this.teleporting = 0;
		return f.dot;
	}
	this.teleporting = 0;
	this.last_teleport = rt.worldTime(f);
	yield* this.use_power(10000 / this.power_efficiency);
	this.sparks();
	this.linked_pad.sparks();
	flick("qpad-beam", this);
	yield* playsound(rt.getStep(f, this, 0), rt.rsc("sound/weapons/emitter2.ogg"), 25, 1, { extrarange: 3, falloff: 5 });
	flick("qpad-beam", this.linked_pad);
	yield* playsound(rt.getStep(f, this.linked_pad, 0), rt.rsc("sound/weapons/emitter2.ogg"), 25, 1, { extrarange: 3, falloff: 5 });
	ROI = null;
	for (ROI of each(rt.getStep(f, this, 0), T("/atom/movable"))) {
		if (ROI.anchored) {
			if (rt.istype(ROI, T("/mob/living"))) {
				if ((L = ROI).buckled) {
					if (L.buckled.anchored) {
						continue;
					}
				} else {
					continue;
				}
			} else if (!rt.istype(ROI, T("/mob/dead/observer"))) {
				continue;
			}
		}
		yield* do_teleport(ROI, rt.getStep(f, this.linked_pad, 0));
	}
	return null;
});
