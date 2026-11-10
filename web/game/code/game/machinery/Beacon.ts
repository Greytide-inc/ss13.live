// Based on /tg/station's code/game/machinery/Beacon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10777, "/obj/machinery/bluespace_beacon", "/obj/machinery", {
	Beacon: null,
	level: 1,
	anchored: 1,
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "floor_beaconf",
	name: "bluespace gigabeacon",
	desc: "A device that draws power from bluespace and creates a permanent tracking beacon.",
	layer: 2.5,
	use_power: 1,
	idle_power_usage: 0,
});

// Beacon.dm:15
rt.def("/obj/machinery/bluespace_beacon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	let _T: Value = this.loc;
	this.Beacon = (yield* new_(T("/obj/item/device/radio/beacon")));
	this.Beacon.invisibility = INVISIBILITY_MAXIMUM;
	this.Beacon.loc = _T;
	yield* this.hide(_T.intact);
	return f.dot;
}, true);

// Beacon.dm:25
rt.def("/obj/machinery/bluespace_beacon/proc/Destroy", function* Destroy(f: Frame) {
	if (this.Beacon) {
		yield* qdel(this.Beacon);
	}
	this.Beacon = null;
	return (yield* parent_proc());
}, true);

// Beacon.dm:31
rt.def("/obj/machinery/bluespace_beacon/proc/hide", function hide(f: Frame, intact: Value) {
	this.invisibility = intact ? INVISIBILITY_MAXIMUM : 0;
	this.updateicon();
	return f.dot;
});

// Beacon.dm:36
rt.def("/obj/machinery/bluespace_beacon/proc/updateicon", function updateicon(f: Frame) {
	let state: Value = "floor_beacon";
	if (this.invisibility) {
		this.icon_state = `${state}f`;
	} else {
		this.icon_state = `${state}`;
	}
	return f.dot;
});

// Beacon.dm:45
rt.def("/obj/machinery/bluespace_beacon/proc/process", function* process(f: Frame) {
	let _T: Value = null;
	if (!this.Beacon) {
		_T = this.loc;
		this.Beacon = (yield* new_(T("/obj/item/device/radio/beacon")));
		this.Beacon.invisibility = INVISIBILITY_MAXIMUM;
		this.Beacon.loc = _T;
	}
	if (this.Beacon) {
		if (this.Beacon.loc != this.loc) {
			this.Beacon.loc = this.loc;
		}
	}
	this.updateicon();
	return f.dot;
}, true, { waitfor: false });
