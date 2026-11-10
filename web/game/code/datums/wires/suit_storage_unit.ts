// Based on /tg/station's code/datums/wires/suit_storage_unit.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1075, "/datum/wires/suit_storage_unit", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/suit_storage_unit"),
	proper_name: "Suit Storage Unit",
});

// suit_storage_unit.dm:10
rt.def("/datum/wires/suit_storage_unit/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("Hack", "Safety", "High Voltage Circuit");
	this.add_duds(2);
	parent_proc();
	return f.dot;
}, false);

// suit_storage_unit.dm:14
rt.def("/datum/wires/suit_storage_unit/proc/interactable", function interactable(f: Frame, user: Value) {
	let SSU: Value = null;
	if (!(SSU = this.holder).panel_open) return f.dot;
	return 1;
});

// suit_storage_unit.dm:19
rt.def("/datum/wires/suit_storage_unit/proc/get_status", function get_status(f: Frame) {
	let SSU: Value = this.holder;
	let status: Value = list();
	status += `The UV bulb is ${SSU.uv_super ? "glowing" : "dim"}.`;
	return (status += `The service light is ${SSU.safeties ? "off" : "on"}.`);
});

// suit_storage_unit.dm:26
rt.def("/datum/wires/suit_storage_unit/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let SSU: Value = this.holder;
	if (wire === "Hack") {
		SSU.uv_super = (!SSU.uv_super ? 1 : 0);
	} else if (wire === "Safety") {
		SSU.safeties = (!SSU.safeties ? 1 : 0);
	} else if (wire === "High Voltage Circuit") {
		if (!f.usr) return f.dot;
		yield* SSU.shock(f.usr);
	}
	return f.dot;
}, true);

// suit_storage_unit.dm:37
rt.def("/datum/wires/suit_storage_unit/proc/on_cut", function* on_cut(f: Frame, wire: Value, mend: Value) {
	let SSU: Value = this.holder;
	if (wire === "Hack") {
		SSU.uv_super = (!mend ? 1 : 0);
	} else if (wire === "Safety") {
		SSU.safeties = mend;
	} else if (wire === "High Voltage Circuit") {
		if (!f.usr) return f.dot;
		yield* SSU.shock(f.usr);
	}
	return f.dot;
}, true);
