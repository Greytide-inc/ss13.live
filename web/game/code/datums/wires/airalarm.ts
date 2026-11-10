// Based on /tg/station's code/datums/wires/airalarm.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(1059, "/datum/wires/airalarm", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/airalarm"),
	proper_name: "Air Alarm",
});

// airalarm.dm:11
rt.def("/datum/wires/airalarm/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("Power", "ID Scan", "AI Connection", "Panic Siphon", "Alarm");
	this.add_duds(3);
	parent_proc();
	return f.dot;
}, false);

// airalarm.dm:15
rt.def("/datum/wires/airalarm/proc/interactable", function interactable(f: Frame, user: Value) {
	let A: Value = null;
	if (!((A = this.holder).panel_open && A.buildstage == 2)) return f.dot;
	return 1;
});

// airalarm.dm:20
rt.def("/datum/wires/airalarm/proc/get_status", function get_status(f: Frame) {
	let A: Value = this.holder;
	let status: Value = list();
	status += `The interface light is ${A.locked ? "red" : "green"}.`;
	status += `The short indicator is ${A.shorted ? "lit" : "off"}.`;
	return (status += `The AI connection light is ${!A.aidisabled ? "on" : "off"}.`);
});

// airalarm.dm:28
rt.def("/datum/wires/airalarm/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let AA: Value = null;
	let A: Value = this.holder;
	if (wire === "Power") {
		if (!A.shorted) {
			A.shorted = 1;
			yield* A.update_icon();
		}
		yield* addtimer((yield* new_(T("/datum/callback"), A, P("/obj/machinery/airalarm/proc/reset"), wire)), 1200);
	} else if (wire === "ID Scan") {
		A.locked = (!A.locked ? 1 : 0);
	} else if (wire === "AI Connection") {
		if (!A.aidisabled) {
			A.aidisabled = 1;
		}
		yield* addtimer((yield* new_(T("/datum/callback"), A, P("/obj/machinery/airalarm/proc/reset"), wire)), 100);
	} else if (wire === "Panic Siphon") {
		if (!A.shorted) {
			if (A.mode == 1) {
				A.mode = 3;
			} else {
				A.mode = 1;
			}
			yield* A.apply_mode();
		}
	} else if (wire === "Alarm") {
		if ((AA = get_area(A)).atmosalert(0, this.holder)) {
			yield* A.post_alert(0);
		}
		yield* A.update_icon();
	}
	return f.dot;
}, true);

// airalarm.dm:55
rt.def("/datum/wires/airalarm/proc/on_cut", function* on_cut(f: Frame, wire: Value, mend: Value) {
	let AA: Value = null;
	let A: Value = this.holder;
	if (wire === "Power") {
		yield* A.shock(f.usr, 50);
		A.shorted = (!mend ? 1 : 0);
		yield* A.update_icon();
	} else if (wire === "ID Scan") {
		if (!mend) {
			A.locked = 1;
		}
	} else if (wire === "AI Connection") {
		A.aidisabled = mend;
	} else if (wire === "Panic Siphon") {
		if (!mend && !A.shorted) {
			A.mode = 3;
			yield* A.apply_mode();
		}
	} else if (wire === "Alarm") {
		if ((AA = get_area(A)).atmosalert(2, this.holder)) {
			yield* A.post_alert(2);
		}
		yield* A.update_icon();
	}
	return f.dot;
}, true);
