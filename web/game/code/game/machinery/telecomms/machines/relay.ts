// Based on /tg/station's code/game/machinery/telecomms/machines/relay.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10708, "/obj/machinery/telecomms/relay", "/obj/machinery/telecomms", {
	broadcasting: 1,
	receiving: 1,
	anchored: 1,
	name: "telecommunication relay",
	icon_state: "relay",
	desc: "A mighty piece of hardware used to send massive amounts of data far away.",
	density: 1,
	use_power: 1,
	idle_power_usage: 30,
	machinetype: 8,
	netspeed: 5,
	long_range_link: 1,
});

// relay.dm:26
rt.def("/obj/machinery/telecomms/relay/proc/receive_information", function receive_information(f: Frame, signal: Value, machine_from: Value) {
	if (!this.can_send(signal)) return f.dot;
	(rt.modAt(signal.data, "level", this.listening_level, rt.bitOr));
	return f.dot;
});

// relay.dm:32
rt.def("/obj/machinery/telecomms/relay/proc/can", function can(f: Frame, signal: Value) {
	if (!this.on) {
		return 0;
	}
	if (!this.is_freq_listening(signal)) {
		return 0;
	}
	return 1;
});

// relay.dm:39
rt.def("/obj/machinery/telecomms/relay/proc/can_send", function can_send(f: Frame, signal: Value) {
	if (!this.can(signal)) {
		return 0;
	}
	return this.broadcasting;
});

// relay.dm:44
rt.def("/obj/machinery/telecomms/relay/proc/can_receive", function can_receive(f: Frame, signal: Value) {
	if (!this.can(signal)) {
		return 0;
	}
	return this.receiving;
});

// relay.dm:49
rt.def("/obj/machinery/telecomms/relay/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/telecomms/relay"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6740, "/obj/item/weapon/circuitboard/machine/telecomms/relay", "/obj/item/weapon/circuitboard/machine/telecomms", {
	name: "Relay Mainframe (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/relay"),
	origin_tech: "programming=2;engineering=2;bluespace=2",
	req_components: null,
});

// relay.dm:57
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/relay/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/subspace/filter"), 2]);
	return f.dot;
});

rt.type(10710, "/obj/machinery/telecomms/relay/preset/station", "/obj/machinery/telecomms/relay/preset", {
	id: "Station Relay",
	listening_level: 1,
	autolinkers: null,
});

// relay.dm:72
rt.def("/obj/machinery/telecomms/relay/preset/station/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("s_relay");
	return f.dot;
});

rt.type(10711, "/obj/machinery/telecomms/relay/preset/telecomms", "/obj/machinery/telecomms/relay/preset", {
	id: "Telecomms Relay",
	autolinkers: null,
});

// relay.dm:76
rt.def("/obj/machinery/telecomms/relay/preset/telecomms/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("relay");
	return f.dot;
});

rt.type(10712, "/obj/machinery/telecomms/relay/preset/mining", "/obj/machinery/telecomms/relay/preset", {
	id: "Mining Relay",
	autolinkers: null,
});

// relay.dm:80
rt.def("/obj/machinery/telecomms/relay/preset/mining/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("m_relay");
	return f.dot;
});

rt.type(10713, "/obj/machinery/telecomms/relay/preset/ruskie", "/obj/machinery/telecomms/relay/preset", {
	id: "Ruskie Relay",
	hide: 1,
	toggled: 0,
	autolinkers: null,
});

// relay.dm:86
rt.def("/obj/machinery/telecomms/relay/preset/ruskie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("r_relay");
	return f.dot;
});
