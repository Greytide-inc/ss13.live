// Based on /tg/station's code/datums/wires/vending.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1078, "/datum/wires/vending", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/vending"),
	proper_name: "Vending Unit",
});

// vending.dm:10
rt.def("/datum/wires/vending/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("Throw", "High Voltage Ground", "Speaker", "Contraband", "ID Scan");
	this.add_duds(1);
	parent_proc();
	return f.dot;
}, false);

// vending.dm:14
rt.def("/datum/wires/vending/proc/interactable", function* interactable(f: Frame, user: Value) {
	let V: Value = this.holder;
	if (!rt.istype(user, T("/mob/living/silicon")) && V.seconds_electrified && (yield* V.shock(user, 100))) {
		return 0;
	}
	if (!V.panel_open) return f.dot;
	return 1;
}, true);

// vending.dm:21
rt.def("/datum/wires/vending/proc/get_status", function get_status(f: Frame) {
	let V: Value = this.holder;
	let status: Value = list();
	status += `The orange light is ${V.seconds_electrified ? "on" : "off"}.`;
	status += `The red light is ${V.shoot_inventory ? "off" : "blinking"}.`;
	status += `The green light is ${V.extended_inventory ? "on" : "off"}.`;
	status += `A ${V.scan_id ? "purple" : "yellow"} light is on.`;
	return (status += `The speaker light is ${V.shut_up ? "off" : "on"}.`);
});

// vending.dm:31
rt.def("/datum/wires/vending/proc/on_pulse", function on_pulse(f: Frame, wire: Value) {
	let V: Value = this.holder;
	if (wire === "Throw") {
		V.shoot_inventory = (!V.shoot_inventory ? 1 : 0);
	} else if (wire === "Contraband") {
		V.extended_inventory = (!V.extended_inventory ? 1 : 0);
	} else if (wire === "High Voltage Ground") {
		V.seconds_electrified = 30;
	} else if (wire === "ID Scan") {
		V.scan_id = (!V.scan_id ? 1 : 0);
	} else if (wire === "Speaker") {
		V.shut_up = (!V.shut_up ? 1 : 0);
	}
	return f.dot;
});

// vending.dm:45
rt.def("/datum/wires/vending/proc/on_cut", function on_cut(f: Frame, wire: Value, mend: Value) {
	let V: Value = this.holder;
	if (wire === "Throw") {
		V.shoot_inventory = (!mend ? 1 : 0);
	} else if (wire === "Contraband") {
		V.extended_inventory = 0;
	} else if (wire === "High Voltage Ground") {
		if (mend) {
			V.seconds_electrified = 0;
		} else {
			V.seconds_electrified = -1;
		}
	} else if (wire === "ID Scan") {
		V.scan_id = mend;
	} else if (wire === "Speaker") {
		V.shut_up = mend;
	}
	return f.dot;
});
