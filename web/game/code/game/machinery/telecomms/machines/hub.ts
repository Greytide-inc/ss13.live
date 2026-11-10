// Based on /tg/station's code/game/machinery/telecomms/machines/hub.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10725, "/obj/machinery/telecomms/hub", "/obj/machinery/telecomms", {
	anchored: 1,
	machinetype: 7,
	long_range_link: 1,
	netspeed: 40,
	name: "telecommunication hub",
	icon_state: "hub",
	desc: "A mighty piece of hardware used to send/receive massive amounts of data.",
	density: 1,
	use_power: 1,
	idle_power_usage: 80,
});

// hub.dm:27
rt.def("/obj/machinery/telecomms/hub/proc/receive_information", function* receive_information(f: Frame, signal: Value, machine_from: Value) {
	if (!this.is_freq_listening(signal)) return f.dot;
	if (rt.istype(machine_from, T("/obj/machinery/telecomms/receiver"))) {
		yield* this.relay_information(signal, "/obj/machinery/telecomms/bus", 1);
	} else {
		yield* this.relay_information(signal, "/obj/machinery/telecomms/relay", 1);
		yield* this.relay_information(signal, "/obj/machinery/telecomms/broadcaster", 1);
	}
	return f.dot;
}, true);

// hub.dm:37
rt.def("/obj/machinery/telecomms/hub/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/telecomms/hub"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6737, "/obj/item/weapon/circuitboard/machine/telecomms/hub", "/obj/item/weapon/circuitboard/machine/telecomms", {
	name: "Hub Mainframe (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/hub"),
	origin_tech: "programming=2;engineering=2",
	req_components: null,
});

// hub.dm:45
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/hub/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/subspace/filter"), 2]);
	return f.dot;
});
