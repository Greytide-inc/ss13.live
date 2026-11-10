// Based on /tg/station's code/datums/wires/radio.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1073, "/datum/wires/radio", "/datum/wires", {
	holder_type: rt.typePath("/obj/item/device/radio"),
	proper_name: "Radio",
});

// radio.dm:10
rt.def("/datum/wires/radio/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("Signal", "Recieve", "Transmit");
	parent_proc();
	return f.dot;
}, false);

// radio.dm:13
rt.def("/datum/wires/radio/proc/interactable", function interactable(f: Frame, user: Value) {
	let R: Value = null;
	if (!(R = this.holder).b_stat) return f.dot;
	return 1;
});

// radio.dm:18
rt.def("/datum/wires/radio/proc/on_pulse", function on_pulse(f: Frame, index: Value) {
	let R: Value = this.holder;
	if (index === "Signal") {
		R.listening = (!R.listening ? 1 : 0);
		R.broadcasting = R.listening;
	} else if (index === "Recieve") {
		R.listening = (!R.listening ? 1 : 0);
	} else if (index === "Transmit") {
		R.broadcasting = (!R.broadcasting ? 1 : 0);
	}
	return f.dot;
});
