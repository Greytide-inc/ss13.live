// Based on /tg/station's code/datums/wires/r_n_d.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1072, "/datum/wires/r_n_d", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/r_n_d"),
	randomize: 1,
});

// r_n_d.dm:10
rt.def("/datum/wires/r_n_d/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("Hack", "Disable", "High Voltage Ground");
	this.add_duds(5);
	parent_proc();
	return f.dot;
}, false);

// r_n_d.dm:14
rt.def("/datum/wires/r_n_d/proc/interactable", function interactable(f: Frame, user: Value) {
	let R: Value = null;
	if (!(R = this.holder).panel_open) return f.dot;
	return 1;
});

// r_n_d.dm:19
rt.def("/datum/wires/r_n_d/proc/get_status", function get_status(f: Frame) {
	let R: Value = this.holder;
	let status: Value = list();
	status += `The red light is ${R.disabled ? "off" : "on"}.`;
	status += `The green light is ${R.shocked ? "off" : "on"}.`;
	return (status += `The blue light is ${R.hacked ? "off" : "on"}.`);
});

// r_n_d.dm:28
rt.def("/datum/wires/r_n_d/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let R: Value = this.holder;
	if (wire === "Hack") {
		R.hacked = (!R.hacked ? 1 : 0);
	} else if (wire === "Disable") {
		R.disabled = (!R.disabled ? 1 : 0);
	} else if (wire === "High Voltage Ground") {
		R.shocked = 1;
		yield* sleep(100);
		if (!R) return f.dot;
		R.shocked = 0;
	}
	return f.dot;
}, true, { waitfor: false });

// r_n_d.dm:41
rt.def("/datum/wires/r_n_d/proc/on_cut", function on_cut(f: Frame, wire: Value, mend: Value) {
	let R: Value = this.holder;
	if (wire === "Hack") {
		R.hacked = (!mend ? 1 : 0);
	} else if (wire === "Disable") {
		R.disabled = (!mend ? 1 : 0);
	} else if (wire === "High Voltage Ground") {
		R.shocked = (!mend ? 1 : 0);
	}
	return f.dot;
});
