// From code/game/machinery/telecomms/machines/relay.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/telecomms/relay/proc/receive_information  (code/game/machinery/telecomms/machines/relay.dm:26)
rt.def("/obj/machinery/telecomms/relay/proc/receive_information", function receive_information(f: Frame, signal: Value, machine_from: Value) {
	if (!truthy(rt.callSrc(f, "can_send", [live(signal)]))) return f.dot;
	(rt.modAt(rt.fv(f, "data", live(signal)), "level", rt.sv(f, "listening_level"), rt.bitOr));
	return f.dot;
});

// /obj/machinery/telecomms/relay/proc/can  (code/game/machinery/telecomms/machines/relay.dm:32)
rt.def("/obj/machinery/telecomms/relay/proc/can", function can(f: Frame, signal: Value) {
	if (!truthy(rt.sv(f, "on"))) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "is_freq_listening", [live(signal)]))) {
		return 0;
	}
	return 1;
});

// /obj/machinery/telecomms/relay/proc/can_send  (code/game/machinery/telecomms/machines/relay.dm:39)
rt.def("/obj/machinery/telecomms/relay/proc/can_send", function can_send(f: Frame, signal: Value) {
	if (!truthy(rt.callSrc(f, "can", [live(signal)]))) {
		return 0;
	}
	return rt.sv(f, "broadcasting");
});

// /obj/machinery/telecomms/relay/proc/can_receive  (code/game/machinery/telecomms/machines/relay.dm:44)
rt.def("/obj/machinery/telecomms/relay/proc/can_receive", function can_receive(f: Frame, signal: Value) {
	if (!truthy(rt.callSrc(f, "can", [live(signal)]))) {
		return 0;
	}
	return rt.sv(f, "receiving");
});

// /obj/machinery/telecomms/relay/proc/New  (code/game/machinery/telecomms/machines/relay.dm:49)  may sleep
rt.def("/obj/machinery/telecomms/relay/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/telecomms/relay"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6740, "/obj/item/weapon/circuitboard/machine/telecomms/relay", "/obj/item/weapon/circuitboard/machine/telecomms", {
	name: "Relay Mainframe (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/relay"),
	origin_tech: "programming=2;engineering=2;bluespace=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/telecomms/relay/proc/<init>  (code/game/machinery/telecomms/machines/relay.dm:57)
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/relay/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/subspace/filter"), 2]));
	return f.dot;
});

rt.type(10710, "/obj/machinery/telecomms/relay/preset/station", "/obj/machinery/telecomms/relay/preset", {
	id: "Station Relay",
	listening_level: 1,
	autolinkers: null,
});

// /obj/machinery/telecomms/relay/preset/station/proc/<init>  (code/game/machinery/telecomms/machines/relay.dm:72)
rt.def("/obj/machinery/telecomms/relay/preset/station/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("s_relay"));
	return f.dot;
});

rt.type(10711, "/obj/machinery/telecomms/relay/preset/telecomms", "/obj/machinery/telecomms/relay/preset", {
	id: "Telecomms Relay",
	autolinkers: null,
});

// /obj/machinery/telecomms/relay/preset/telecomms/proc/<init>  (code/game/machinery/telecomms/machines/relay.dm:76)
rt.def("/obj/machinery/telecomms/relay/preset/telecomms/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("relay"));
	return f.dot;
});

rt.type(10712, "/obj/machinery/telecomms/relay/preset/mining", "/obj/machinery/telecomms/relay/preset", {
	id: "Mining Relay",
	autolinkers: null,
});

// /obj/machinery/telecomms/relay/preset/mining/proc/<init>  (code/game/machinery/telecomms/machines/relay.dm:80)
rt.def("/obj/machinery/telecomms/relay/preset/mining/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("m_relay"));
	return f.dot;
});

rt.type(10713, "/obj/machinery/telecomms/relay/preset/ruskie", "/obj/machinery/telecomms/relay/preset", {
	id: "Ruskie Relay",
	hide: 1,
	toggled: 0,
	autolinkers: null,
});

// /obj/machinery/telecomms/relay/preset/ruskie/proc/<init>  (code/game/machinery/telecomms/machines/relay.dm:86)
rt.def("/obj/machinery/telecomms/relay/preset/ruskie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("r_relay"));
	return f.dot;
});
