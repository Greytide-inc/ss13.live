// Based on /tg/station's code/controllers/subsystem/radio.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(36, "/datum/controller/subsystem/radio", "/datum/controller/subsystem", {
	frequencies: null,
	name: "Radio",
	flags: 3,
});

// radio.dm:1
rt.def("/datum/controller/subsystem/radio/proc/New", function* New(f: Frame) {
	if (GLOB.SSradio != this) {
		if (rt.istype(GLOB.SSradio, T("/datum/controller/subsystem/radio"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSradio);
		}
		GLOB.SSradio = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// radio.dm:5
rt.def("/datum/controller/subsystem/radio/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.frequencies = list();
	return f.dot;
});

// radio.dm:8
rt.def("/datum/controller/subsystem/radio/proc/add_object", function add_object(f: Frame, device: Value, new_frequency: Value, filter: Value) {
	let frequency: Value = null;
	let f_text: Value = num2text(new_frequency);
	if (!(frequency = rt.index(this.frequencies, f_text))) {
		(frequency = new_(T("/datum/radio_frequency"))).frequency = new_frequency;
		rt.setAt(this.frequencies, f_text, frequency);
	}
	frequency.add_listener(device, filter);
	return frequency;
});

// radio.dm:20
rt.def("/datum/controller/subsystem/radio/proc/remove_object", function* remove_object(f: Frame, device: Value, old_frequency: Value) {
	let frequency: Value = null;
	let f_text: Value = num2text(old_frequency);
	if (frequency = rt.index(this.frequencies, f_text)) {
		frequency.remove_listener(device);
		if (rt.len(f, frequency.devices) == 0) {
			yield* qdel(frequency);
			this.frequencies -= f_text;
		}
	}
	return 1;
}, true);

// radio.dm:33
rt.def("/datum/controller/subsystem/radio/proc/return_frequency", function return_frequency(f: Frame, new_frequency: Value) {
	let frequency: Value = null;
	let f_text: Value = num2text(new_frequency);
	if (!(frequency = rt.index(this.frequencies, f_text))) {
		(frequency = new_(T("/datum/radio_frequency"))).frequency = new_frequency;
		rt.setAt(this.frequencies, f_text, frequency);
	}
	return frequency;
});
