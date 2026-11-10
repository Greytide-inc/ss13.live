// Based on /tg/station's code/game/machinery/airlock_control.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// airlock_control.dm:11
rt.def("/obj/machinery/door/airlock/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	if (!signal || signal.encryption) {
		return f.dot;
	}
	if (this.id_tag != rt.index(signal.data, "tag") || !rt.index(signal.data, "command")) {
		return f.dot;
	}
	const command = rt.index(signal.data, "command");
	if (command === "open") {
		yield* this.open(1);
	} else if (command === "close") {
		yield* this.close(1);
	} else if (command === "unlock") {
		this.locked = 0;
		yield* this.update_icon();
	} else if (command === "lock") {
		this.locked = 1;
		yield* this.update_icon();
	} else if (command === "secure_open") {
		this.locked = 0;
		yield* this.update_icon();
		yield* sleep(2);
		yield* this.open(1);
		this.locked = 1;
		yield* this.update_icon();
	} else if (command === "secure_close") {
		this.locked = 0;
		yield* this.close(1);
		this.locked = 1;
		yield* sleep(2);
		yield* this.update_icon();
	}
	yield* this.send_status();
	return f.dot;
}, true);

// airlock_control.dm:53
rt.def("/obj/machinery/door/airlock/proc/send_status", function* send_status(f: Frame) {
	let signal: Value = null;
	if (!this.radio_connection) return f.dot;
	(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
	rt.setAt(signal.data, "tag", this.id_tag);
	rt.setAt(signal.data, "timestamp", rt.worldTime(f));
	let $0: any = signal.data;
	let $1: any = "door_status";
	rt.setAt($0, $1, this.density ? "closed" : "open");
	rt.setAt(signal.data, "lock_status", this.locked ? "locked" : "unlocked");
	yield* this.radio_connection.post_signal(this, signal, { range: 5, filter: GLOB.RADIO_AIRLOCK });
	return f.dot;
}, true);

// airlock_control.dm:65
rt.def("/obj/machinery/door/airlock/proc/open", function* open(f: Frame, surpress_send: Value) {
	f.dot = (yield* parent_proc());
	if (surpress_send) return f.dot;
	yield* this.send_status();
	return f.dot;
}, true);

// airlock_control.dm:70
rt.def("/obj/machinery/door/airlock/proc/close", function* close(f: Frame, surpress_send: Value) {
	f.dot = (yield* parent_proc());
	if (surpress_send) return f.dot;
	yield* this.send_status();
	return f.dot;
}, true);

// airlock_control.dm:75
rt.def("/obj/machinery/door/airlock/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	if (!new_frequency) return f.dot;
	this.frequency = new_frequency;
	this.radio_connection = GLOB.SSradio.add_object(this, this.frequency, GLOB.RADIO_AIRLOCK);
	return f.dot;
}, true);

// airlock_control.dm:81
rt.def("/obj/machinery/door/airlock/proc/Destroy", function* Destroy(f: Frame) {
	if (this.frequency && GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	return (yield* parent_proc());
}, true);

rt.type(10774, "/obj/machinery/airlock_sensor", "/obj/machinery", {
	id_tag: null,
	master_tag: null,
	frequency: 1449,
	radio_connection: null,
	on: 1,
	alert: 0,
	anchored: 1,
	icon: rt.rsc("icons/obj/airlock_machines.dmi"),
	icon_state: "airlock_sensor_off",
	name: "airlock sensor",
	resistance_flags: 115,
	power_channel: 3,
});

// airlock_control.dm:107
rt.def("/obj/machinery/airlock_sensor/proc/update_icon", function update_icon(f: Frame) {
	if (this.on) {
		if (this.alert) {
			this.icon_state = "airlock_sensor_alert";
		} else {
			this.icon_state = "airlock_sensor_standby";
		}
	} else {
		this.icon_state = "airlock_sensor_off";
	}
	return f.dot;
});

// airlock_control.dm:114
rt.def("/obj/machinery/airlock_sensor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let signal: Value = null;
	(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
	rt.setAt(signal.data, "tag", this.master_tag);
	rt.setAt(signal.data, "command", "cycle");
	yield* this.radio_connection.post_signal(this, signal, { range: 5, filter: GLOB.RADIO_AIRLOCK });
	flick("airlock_sensor_cycle", this);
	return f.dot;
}, true);

// airlock_control.dm:124
rt.def("/obj/machinery/airlock_sensor/proc/process", function* process(f: Frame) {
	let signal: Value = null, air_sample: Value = null, pressure: Value = null;
	if (this.on) {
		(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
		rt.setAt(signal.data, "tag", this.id_tag);
		rt.setAt(signal.data, "timestamp", rt.worldTime(f));
		air_sample = this.return_air();
		this.alert = ((pressure = round(air_sample.return_pressure(), 0.1)) < 81.06 ? 1 : 0);
		rt.setAt(signal.data, "pressure", num2text(pressure));
		yield* this.radio_connection.post_signal(this, signal, { range: 5, filter: GLOB.RADIO_AIRLOCK });
	}
	yield* this.update_icon();
	return f.dot;
}, true, { waitfor: false });

// airlock_control.dm:141
rt.def("/obj/machinery/airlock_sensor/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	this.radio_connection = GLOB.SSradio.add_object(this, this.frequency, GLOB.RADIO_AIRLOCK);
	return f.dot;
}, true);

// airlock_control.dm:146
rt.def("/obj/machinery/airlock_sensor/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.set_frequency(this.frequency);
	return f.dot;
}, true);

// airlock_control.dm:151
rt.def("/obj/machinery/airlock_sensor/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	return (yield* parent_proc());
}, true);
