// Based on /tg/station's code/game/machinery/lightswitch.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10802, "/obj/machinery/light_switch", "/obj/machinery", {
	on: 1,
	area: null,
	otherarea: null,
	anchored: 1,
	name: "light switch",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "light1",
});

// lightswitch.dm:15
rt.def("/obj/machinery/light_switch/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.area = get_area(this);
	if (this.otherarea) {
		this.area = rt.locateIn(f, text2path(`/area/${this.otherarea}`), rt.world());
	}
	if (!this.name) {
		this.name = `light switch (${this.area.name})`;
	}
	this.on = this.area.lightswitch;
	this.updateicon();
	return f.dot;
}, true);

// lightswitch.dm:28
rt.def("/obj/machinery/light_switch/proc/updateicon", function updateicon(f: Frame) {
	if (rt.bitAnd(this.stat, 2)) {
		this.icon_state = "light-p";
	} else if (this.on) {
		this.icon_state = "light1";
	} else {
		this.icon_state = "light0";
	}
	return f.dot;
});

// lightswitch.dm:37
rt.def("/obj/machinery/light_switch/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `It is ${this.on ? "on" : "off"}.`);
	return f.dot;
}, false);

// lightswitch.dm:42
rt.def("/obj/machinery/light_switch/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// lightswitch.dm:46
rt.def("/obj/machinery/light_switch/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let A: Value = null, L: Value = null;
	this.on = (!this.on ? 1 : 0);
	for (A of each(this.area.related, T("/area"))) {
		A.lightswitch = this.on;
		A.updateicon();
		L = null;
		for (L of each(A, T("/obj/machinery/light_switch"))) {
			L.on = this.on;
			L.updateicon();
		}
	}
	yield* this.area.power_change();
	return f.dot;
}, true);

// lightswitch.dm:60
rt.def("/obj/machinery/light_switch/proc/power_change", function power_change(f: Frame) {
	if (this.otherarea) return f.dot;
	if (this.powered(2)) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	}
	this.updateicon();
	return f.dot;
});

// lightswitch.dm:69
rt.def("/obj/machinery/light_switch/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!rt.bitAnd(this.stat, 3)) {
		yield* this.power_change();
	}
	yield* parent_proc();
	return f.dot;
}, true);
