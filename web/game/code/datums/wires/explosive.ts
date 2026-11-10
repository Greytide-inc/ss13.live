// Based on /tg/station's code/datums/wires/explosive.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1065, "/datum/wires/explosive", "/datum/wires", {});

// explosive.dm:2
rt.def("/datum/wires/explosive/proc/New", function New(f: Frame, holder: Value) {
	this.add_duds(2);
	parent_proc();
	return f.dot;
}, false);

// explosive.dm:6
rt.def("/datum/wires/explosive/proc/on_pulse", function* on_pulse(f: Frame, index: Value) {
	yield* this.explode();
	return f.dot;
}, true);

// explosive.dm:9
rt.def("/datum/wires/explosive/proc/on_cut", function* on_cut(f: Frame, index: Value, mend: Value) {
	yield* this.explode();
	return f.dot;
}, true);

rt.type(1066, "/datum/wires/explosive/c4", "/datum/wires/explosive", {
	holder_type: rt.typePath("/obj/item/weapon/grenade/plastic/c4"),
	randomize: 1,
});

// explosive.dm:20
rt.def("/datum/wires/explosive/c4/proc/interactable", function interactable(f: Frame, user: Value) {
	let _P: Value = null;
	if (!(_P = this.holder).open_panel) return f.dot;
	return 1;
});

// explosive.dm:25
rt.def("/datum/wires/explosive/c4/proc/explode", function* explode(f: Frame) {
	let _P: Value = null;
	yield* (_P = this.holder).explode();
	return f.dot;
}, true);

rt.type(1067, "/datum/wires/explosive/pizza", "/datum/wires/explosive", {
	holder_type: rt.typePath("/obj/item/pizzabox"),
	randomize: 1,
});

// explosive.dm:34
rt.def("/datum/wires/explosive/pizza/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("Disarm");
	this.add_duds(3);
	parent_proc();
	return f.dot;
}, false);

// explosive.dm:41
rt.def("/datum/wires/explosive/pizza/proc/interactable", function interactable(f: Frame, user: Value) {
	let _P: Value = null;
	if (!((_P = this.holder).open && _P.bomb)) return f.dot;
	return 1;
});

// explosive.dm:46
rt.def("/datum/wires/explosive/pizza/proc/get_status", function get_status(f: Frame) {
	let _P: Value = this.holder;
	let status: Value = list();
	status += `The red light is ${_P.bomb_active ? "on" : "off"}.`;
	return (status += `The green light is ${_P.bomb_defused ? "on" : "off"}.`);
});

// explosive.dm:53
rt.def("/datum/wires/explosive/pizza/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let _P: Value = this.holder;
	if (wire === "Disarm") {
		_P.bomb_defused = (!_P.bomb_defused ? 1 : 0);
	} else {
		yield* this.explode();
	}
	return f.dot;
}, true);

// explosive.dm:61
rt.def("/datum/wires/explosive/pizza/proc/on_cut", function* on_cut(f: Frame, wire: Value, mend: Value) {
	let _P: Value = this.holder;
	if (wire === "Disarm") {
		if (mend) return f.dot;
		_P.bomb_defused = 1;
	} else if (!mend && !_P.bomb_defused) {
		yield* this.explode();
	}
	return f.dot;
}, true);

// explosive.dm:71
rt.def("/datum/wires/explosive/pizza/proc/explode", function* explode(f: Frame) {
	let _P: Value = null;
	yield* (_P = this.holder).bomb.detonate();
	return f.dot;
}, true);

rt.type(1068, "/datum/wires/explosive/gibtonite", "/datum/wires/explosive", {
	holder_type: rt.typePath("/obj/item/weapon/twohanded/required/gibtonite"),
});

// explosive.dm:79
rt.def("/datum/wires/explosive/gibtonite/proc/explode", function* explode(f: Frame) {
	let _P: Value = null;
	yield* (_P = this.holder).GibtoniteReaction(null, 2);
	return f.dot;
}, true);
