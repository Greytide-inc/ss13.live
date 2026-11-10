// Based on /tg/station's code/game/machinery/computer/computer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10349, "/obj/machinery/computer", "/obj/machinery", {
	circuit: null,
	processing: 0,
	brightness_on: 2,
	icon_keyboard: "generic_key",
	icon_screen: "generic",
	clockwork: 0,
	anchored: 1,
	name: "computer",
	icon: rt.rsc("icons/obj/computer.dmi"),
	icon_state: "computer",
	density: 1,
	use_power: 1,
	idle_power_usage: 300,
	active_power_usage: 300,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 100,
	armor: null,
});

// computer.dm:13
rt.def("/obj/machinery/computer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 40, "acid", 20]);
	return f.dot;
});

// computer.dm:22
rt.def("/obj/machinery/computer/proc/New", function* New(f: Frame, location: Value, C: Value) {
	yield* parent_proc(location);
	if (C && rt.istype(C, T("/obj/item/weapon/circuitboard"))) {
		this.circuit = C;
	} else {
		if (!ispath(this.circuit)) return f.dot;
		this.circuit = (yield* new_(this.circuit, null));
	}
	return f.dot;
}, true);

// computer.dm:33
rt.def("/obj/machinery/computer/proc/Destroy", function* Destroy(f: Frame) {
	if (this.circuit) {
		yield* qdel(this.circuit);
		this.circuit = null;
	}
	return (yield* parent_proc());
}, true);

// computer.dm:38
rt.def("/obj/machinery/computer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.power_change();
	return f.dot;
}, true);

// computer.dm:42
rt.def("/obj/machinery/computer/proc/process", function process(f: Frame) {
	if (rt.bitAnd(this.stat, 3)) {
		return 0;
	}
	return 1;
}, false, { waitfor: false });

// computer.dm:47
rt.def("/obj/machinery/computer/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (this.clockwork) return f.dot;
	this.clockwork = 1;
	this.icon_screen = `ratvar${rand(1, 4)}`;
	this.icon_keyboard = `ratvar_key${rand(1, 6)}`;
	this.icon_state = `ratvarcomputer${rand(1, 4)}`;
	this.update_icon();
	return f.dot;
});

// computer.dm:55
rt.def("/obj/machinery/computer/proc/narsie_act", function narsie_act(f: Frame) {
	if (!(this.clockwork && this.clockwork != rt.initial(f, this, "clockwork"))) return f.dot;
	this.clockwork = 0;
	this.icon_screen = rt.initial(f, this, "icon_screen");
	this.icon_keyboard = rt.initial(f, this, "icon_keyboard");
	this.icon_state = rt.initial(f, this, "icon_state");
	this.update_icon();
	return f.dot;
});

// computer.dm:63
rt.def("/obj/machinery/computer/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (rt.bitAnd(this.stat, 2)) {
		this.add_overlay(`${this.icon_keyboard}_off`);
		return f.dot;
	}
	this.add_overlay(this.icon_keyboard);
	if (rt.bitAnd(this.stat, 1)) {
		this.add_overlay(`${this.icon_state}_broken`);
	} else {
		this.add_overlay(this.icon_screen);
	}
	return f.dot;
});

// computer.dm:74
rt.def("/obj/machinery/computer/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	if (rt.bitAnd(this.stat, 2)) {
		this.set_light(0);
	} else {
		this.set_light(this.brightness_on);
	}
	this.update_icon();
	return f.dot;
});

// computer.dm:83
rt.def("/obj/machinery/computer/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/screwdriver")) && this.circuit && !rt.bitAnd(this.flags, NODECONSTRUCT)) {
		playsound(this.loc, I.usesound, 50, 1);
		to_chat(user, "<span class='notice'> You start to disconnect the monitor...</span>");
		if (yield* do_after(user, 20 * I.toolspeed, { target: this })) {
			yield* this.deconstruct(1, user);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// computer.dm:92
rt.def("/obj/machinery/computer/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (rt.bitAnd(this.stat, 1)) {
			playsound(this.loc, rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 70, 1);
		} else {
			playsound(this.loc, rt.rsc("sound/effects/glasshit.ogg"), 75, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// computer.dm:102
rt.def("/obj/machinery/computer/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(this.circuit && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	if (rt.bitAnd(this.stat, 1)) return f.dot;
	playsound(this.loc, rt.rsc("sound/effects/glassbr3.ogg"), 100, 1);
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.update_icon();
	return f.dot;
});

// computer.dm:109
rt.def("/obj/machinery/computer/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (severity === 1) {
		if (prob(50)) {
			yield* this.obj_break("energy");
		}
	} else if (severity === 2) {
		if (prob(10)) {
			yield* this.obj_break("energy");
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// computer.dm:119
rt.def("/obj/machinery/computer/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value, user: Value) {
	let A: Value = null, C: Value = null;
	disassembled ??= 1;
	yield* this.on_deconstruction();
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (this.circuit) {
			(A = (yield* new_(T("/obj/structure/frame/computer"), this.loc))).circuit = this.circuit;
			A.anchored = 1;
			if (rt.bitAnd(this.stat, 1)) {
				if (user) {
					to_chat(user, "<span class='notice'>The broken glass falls out.</span>");
				} else {
					playsound(this.loc, rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 70, 1);
				}
				yield* new_(T("/obj/item/weapon/shard"), this.loc);
				yield* new_(T("/obj/item/weapon/shard"), this.loc);
				A.state = 3;
				A.icon_state = "3";
			} else {
				if (user) {
					to_chat(user, "<span class='notice'>You disconnect the monitor.</span>");
				}
				A.state = 4;
				A.icon_state = "4";
			}
			this.circuit = null;
		}
		for (C of each(this, T("/obj"))) {
			yield* C.forceMove(this.loc);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);
