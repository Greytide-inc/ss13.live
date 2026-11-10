// Based on /tg/station's code/modules/atmospherics/machinery/components/binary_devices/valve.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10570, "/obj/machinery/atmospherics/components/binary/valve", "/obj/machinery/atmospherics/components/binary", {
	frequency: 0,
	id: null,
	open: 0,
	valve_type: "m",
	can_unwrench: 1,
	icon_state: "mvalve_map",
	name: "manual valve",
	desc: "A pipe valve",
});

// valve.dm:22
rt.def("/obj/machinery/atmospherics/components/binary/valve/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame, animation: Value) {
	animation ??= 0;
	this.normalize_dir();
	if (animation) {
		flick(`${this.valve_type}valve_${this.open}${(!this.open ? 1 : 0)}`, this);
	}
	let $0: any = this.valve_type;
	this.icon_state = `${$0}valve_${this.open ? "on" : "off"}`;
	return f.dot;
});

// valve.dm:29
rt.def("/obj/machinery/atmospherics/components/binary/valve/proc/open", function open(f: Frame) {
	let parent1: Value = null;
	this.open = 1;
	this.update_icon_nopipes();
	this.update_parents();
	(parent1 = rt.index(this.parents, 1)).reconcile_air();
	this.investigate_log(`was opened by ${f.usr ? key_name(f.usr) : "a remote signal"}`, "atmos");
	return f.dot;
});

// valve.dm:37
rt.def("/obj/machinery/atmospherics/components/binary/valve/proc/close", function close(f: Frame) {
	this.open = 0;
	this.update_icon_nopipes();
	this.investigate_log(`was closed by ${f.usr ? key_name(f.usr) : "a remote signal"}`, "atmos");
	return f.dot;
});

// valve.dm:41
rt.def("/obj/machinery/atmospherics/components/binary/valve/proc/normalize_dir", function normalize_dir(f: Frame) {
	if (this.dir == 2) {
		this.setDir(1);
	} else {
		if (this.dir != 8) return f.dot;
		this.setDir(4);
	}
	return f.dot;
});

// valve.dm:50
rt.def("/obj/machinery/atmospherics/components/binary/valve/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.add_fingerprint(f.usr);
	this.update_icon_nopipes(1);
	yield* sleep(10);
	if (this.open) {
		yield* this.close();
		return f.dot;
	}
	yield* this.open();
	return f.dot;
}, true);

rt.type(10572, "/obj/machinery/atmospherics/components/binary/valve/digital", "/obj/machinery/atmospherics/components/binary/valve", {
	valve_type: "d",
	name: "digital valve",
	desc: "A digitally controlled valve.",
	icon_state: "dvalve_map",
});

// valve.dm:65
rt.def("/obj/machinery/atmospherics/components/binary/valve/digital/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// valve.dm:68
rt.def("/obj/machinery/atmospherics/components/binary/valve/digital/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame, animation: Value) {
	if (rt.bitAnd(this.stat, 2)) {
		this.normalize_dir();
		this.icon_state = "dvalve_nopower";
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false);
