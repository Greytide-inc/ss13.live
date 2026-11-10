// Based on /tg/station's code/datums/wires/autolathe.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(1063, "/datum/wires/autolathe", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/autolathe"),
	proper_name: "Autolathe",
});

// autolathe.dm:10
rt.def("/datum/wires/autolathe/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("Hack", "Disable", "High Voltage Ground", "High Voltage Circuit");
	this.add_duds(6);
	parent_proc();
	return f.dot;
}, false);

// autolathe.dm:14
rt.def("/datum/wires/autolathe/proc/interactable", function interactable(f: Frame, user: Value) {
	let A: Value = null;
	if (!(A = this.holder).panel_open) return f.dot;
	return 1;
});

// autolathe.dm:19
rt.def("/datum/wires/autolathe/proc/get_status", function get_status(f: Frame) {
	let A: Value = this.holder;
	let status: Value = list();
	status += `The red light is ${A.disabled ? "on" : "off"}.`;
	return (status += `The blue light is ${A.hacked ? "on" : "off"}.`);
});

// autolathe.dm:26
rt.def("/datum/wires/autolathe/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let A: Value = this.holder;
	if (wire === "Hack") {
		A.adjust_hacked((!A.hacked ? 1 : 0));
		yield* addtimer((yield* new_(T("/datum/callback"), A, P("/obj/machinery/autolathe/proc/reset"), wire)), 60);
	} else if (wire === "High Voltage Ground") {
		A.shocked = (!A.shocked ? 1 : 0);
		yield* addtimer((yield* new_(T("/datum/callback"), A, P("/obj/machinery/autolathe/proc/reset"), wire)), 60);
	} else if (wire === "Disable") {
		A.disabled = (!A.disabled ? 1 : 0);
		yield* addtimer((yield* new_(T("/datum/callback"), A, P("/obj/machinery/autolathe/proc/reset"), wire)), 60);
	}
	return f.dot;
}, true);

// autolathe.dm:39
rt.def("/datum/wires/autolathe/proc/on_cut", function* on_cut(f: Frame, wire: Value, mend: Value) {
	let A: Value = this.holder;
	if (wire === "Hack") {
		A.adjust_hacked((!mend ? 1 : 0));
	} else if (wire === "High Voltage Ground") { // tg bug: tested WIRE_HACK twice, so cutting the shock wire did nothing (modern tg: WIRE_SHOCK)
		A.shocked = (!mend ? 1 : 0);
	} else if (wire === "Disable") {
		A.disabled = (!mend ? 1 : 0);
	} else if (wire === "High Voltage Circuit") {
		yield* A.shock(f.usr, 50);
	}
	return f.dot;
}, true);
