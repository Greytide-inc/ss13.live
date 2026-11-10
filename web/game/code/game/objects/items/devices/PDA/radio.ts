// Based on /tg/station's code/game/objects/items/devices/PDA/radio.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9804, "/obj/item/radio/integrated", "/obj/item/radio", {
	on: 0,
	menu_message: "",
	name: "１PDA radio module",
	desc: "An electronic radio system of nanotrasen origin.",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "power_mod",
});

// radio.dm:11
rt.def("/obj/item/radio/integrated/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// radio.dm:14
rt.def("/obj/item/radio/integrated/proc/Destroy", function* Destroy(f: Frame) {
	return (yield* parent_proc());
}, true);

rt.type(9805, "/obj/item/radio/integrated/signal", "/obj/item/radio/integrated", {
	frequency: 1457,
	code: 30,
	last_transmission: null,
	radio_connection: null,
});

// radio.dm:29
rt.def("/obj/item/radio/integrated/signal/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	this.radio_connection = null;
	return (yield* parent_proc());
}, true);

// radio.dm:34
rt.def("/obj/item/radio/integrated/signal/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (this.frequency < 1200 || this.frequency > 1600) {
		this.frequency = sanitize_frequency(this.frequency);
	}
	yield* this.set_frequency(this.frequency);
	return f.dot;
}, true);

// radio.dm:41
rt.def("/obj/item/radio/integrated/signal/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	this.radio_connection = GLOB.SSradio.add_object(this, this.frequency);
	return f.dot;
}, true);

// radio.dm:47
rt.def("/obj/item/radio/integrated/signal/proc/send_signal", function* send_signal(f: Frame, message: Value) {
	let signal: Value = null;
	message ??= "ACTIVATE";
	if (this.last_transmission && rt.worldTime(f) < this.last_transmission + 5) {
		return f.dot;
	}
	this.last_transmission = rt.worldTime(f);
	let time: Value = time2text(rt.world().realtime, "hh:mm:ss");
	let _T: Value = rt.getStep(f, this, 0);
	GLOB.lastsignalers.Add(`${time} <B>:</B> ${f.usr.key} used ${this} @ location (${_T.x},${_T.y},${_T.z}) <B>:</B> ${format_frequency(this.frequency)}/${this.code}`);
	(signal = (yield* new_(T("/datum/signal")))).source = this;
	signal.encryption = this.code;
	rt.setAt(signal.data, "message", message);
	yield* this.radio_connection.post_signal(this, signal);
	return f.dot;
}, true);
