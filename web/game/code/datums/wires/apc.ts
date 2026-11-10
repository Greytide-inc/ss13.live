// Based on /tg/station's code/datums/wires/apc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(1062, "/datum/wires/apc", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/power/apc"),
	proper_name: "APC",
});

// apc.dm:10
rt.def("/datum/wires/apc/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("Main Power 1", "Main Power 2", "ID Scan", "AI Connection");
	this.add_duds(6);
	parent_proc();
	return f.dot;
}, false);

// apc.dm:14
rt.def("/datum/wires/apc/proc/interactable", function interactable(f: Frame, user: Value) {
	let A: Value = null;
	if (!((A = this.holder).panel_open && !A.opened)) return f.dot;
	return 1;
});

// apc.dm:19
rt.def("/datum/wires/apc/proc/get_status", function get_status(f: Frame) {
	let A: Value = this.holder;
	let status: Value = list();
	status += `The interface light is ${A.locked ? "red" : "green"}.`;
	status += `The short indicator is ${A.shorted ? "lit" : "off"}.`;
	return (status += `The AI connection light is ${!A.aidisabled ? "on" : "off"}.`);
});

// apc.dm:27
rt.def("/datum/wires/apc/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let A: Value = this.holder;
	if (wire === "Main Power 1" || wire === "Main Power 2") {
		if (!A.shorted) {
			A.shorted = 1;
			yield* addtimer((yield* new_(T("/datum/callback"), A, P("/obj/machinery/power/apc/proc/reset"), wire)), 1200);
		}
	} else if (wire === "ID Scan") {
		A.locked = 0;
		yield* addtimer((yield* new_(T("/datum/callback"), A, P("/obj/machinery/power/apc/proc/reset"), wire)), 300);
	} else if (wire === "AI Connection") {
		if (A.aidisabled) return f.dot;
		A.aidisabled = 1;
		yield* addtimer((yield* new_(T("/datum/callback"), A, P("/obj/machinery/power/apc/proc/reset"), wire)), 10);
	}
	return f.dot;
}, true);

// apc.dm:42
rt.def("/datum/wires/apc/proc/on_cut", function* on_cut(f: Frame, index: Value, mend: Value) {
	let A: Value = this.holder;
	if (index === "Main Power 1" || index === "Main Power 2") {
		if (mend && !this.is_cut("Main Power 1") && !this.is_cut("Main Power 2")) {
			A.shorted = 0;
			yield* A.shock(f.usr, 50);
		} else {
			A.shorted = 1;
			yield* A.shock(f.usr, 50);
		}
	} else if (index === "AI Connection") {
		if (mend) {
			A.aidisabled = 0;
		} else {
			A.aidisabled = 1;
		}
	}
	return f.dot;
}, true);
