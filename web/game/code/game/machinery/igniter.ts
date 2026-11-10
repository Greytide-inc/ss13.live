// Based on /tg/station's code/game/machinery/igniter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10797, "/obj/machinery/igniter", "/obj/machinery", {
	id: null,
	on: 1,
	anchored: 1,
	name: "igniter",
	desc: "It's useful for igniting plasma.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "igniter1",
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 4,
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
	resistance_flags: 2,
});

// igniter.dm:14
rt.def("/obj/machinery/igniter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 30, "laser", 70, "energy", 50, "bomb", 20, "bio", 0, "rad", 0, "fire", 100, "acid", 70]);
	return f.dot;
});

// igniter.dm:18
rt.def("/obj/machinery/igniter/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// igniter.dm:21
rt.def("/obj/machinery/igniter/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// igniter.dm:24
rt.def("/obj/machinery/igniter/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	yield* this.use_power(50);
	this.on = (!this.on ? 1 : 0);
	this.icon_state = `igniter${this.on}`;
	return f.dot;
}, true);

// igniter.dm:34
rt.def("/obj/machinery/igniter/proc/process", function* process(f: Frame) {
	let location: Value = null;
	if (this.on && !rt.bitAnd(this.stat, 2)) {
		if (isturf((location = this.loc))) {
			yield* location.hotspot_expose(1000, 500, 1);
		}
	}
	return 1;
}, true, { waitfor: false });

// igniter.dm:41
rt.def("/obj/machinery/igniter/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.icon_state = `igniter${this.on}`;
	return f.dot;
}, true);

// igniter.dm:45
rt.def("/obj/machinery/igniter/proc/power_change", function power_change(f: Frame) {
	if (!rt.bitAnd(this.stat, 2)) {
		this.icon_state = `igniter${this.on}`;
	} else {
		this.icon_state = "igniter0";
	}
	return f.dot;
});

rt.type(10798, "/obj/machinery/sparker", "/obj/machinery", {
	id: null,
	disable: 0,
	last_spark: 0,
	base_state: "migniter",
	spark_system: null,
	anchored: 1,
	name: "mounted igniter",
	desc: "A wall-mounted ignition device.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "migniter",
	resistance_flags: 2,
});

// igniter.dm:66
rt.def("/obj/machinery/sparker/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.spark_system = (yield* new_(T("/datum/effect_system/spark_spread")));
	yield* this.spark_system.set_up(2, 1, this);
	yield* this.spark_system.attach(this);
	return f.dot;
}, true);

// igniter.dm:72
rt.def("/obj/machinery/sparker/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.spark_system);
	this.spark_system = null;
	return (yield* parent_proc());
}, true);

// igniter.dm:77
rt.def("/obj/machinery/sparker/proc/power_change", function power_change(f: Frame) {
	if (this.powered() && this.disable == 0) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		this.icon_state = `${this.base_state}`;
	} else {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitOr));
		this.icon_state = `${this.base_state}-p`;
	}
	return f.dot;
});

// igniter.dm:87
rt.def("/obj/machinery/sparker/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		yield* this.add_fingerprint(user);
		this.disable = (!this.disable ? 1 : 0);
		if (this.disable) {
			user.visible_message(fmt("＀ has disabled ％！!", [user, this]), fmt("<span class='notice'>You disable the connection to ％！.</span>", [this]));
			this.icon_state = `${this.base_state}-d`;
		}
		if (!this.disable) {
			user.visible_message(fmt("＀ has reconnected ％！!", [user, this]), fmt("<span class='notice'>You fix the connection to ％！.</span>", [this]));
			if (this.powered()) {
				this.icon_state = `${this.base_state}`;
			} else {
				this.icon_state = `${this.base_state}-p`;
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// igniter.dm:104
rt.def("/obj/machinery/sparker/proc/attack_ai", function* attack_ai(f: Frame) {
	if (this.anchored) {
		return (yield* this.ignite());
	}
	return f.dot;
}, true);

// igniter.dm:109
rt.def("/obj/machinery/sparker/proc/ignite", function* ignite(f: Frame) {
	let location: Value = null;
	if (!this.powered()) {
		return f.dot;
	}
	if (this.disable || this.last_spark && rt.worldTime(f) < this.last_spark + 50) {
		return f.dot;
	}
	flick(`${this.base_state}-spark`, this);
	yield* this.spark_system.start();
	this.last_spark = rt.worldTime(f);
	yield* this.use_power(1000);
	if (isturf((location = this.loc))) {
		yield* location.hotspot_expose(1000, 500, 1);
	}
	return 1;
}, true);

// igniter.dm:126
rt.def("/obj/machinery/sparker/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!rt.bitAnd(this.stat, 3)) {
		yield* this.ignite();
	}
	yield* parent_proc();
	return f.dot;
}, true);
