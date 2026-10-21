// From code/game/machinery/telecomms/machines/hub.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/telecomms/hub/proc/receive_information  (code/game/machinery/telecomms/machines/hub.dm:27)  may sleep
rt.def("/obj/machinery/telecomms/hub/proc/receive_information", function* receive_information(f: Frame, signal: Value, machine_from: Value) {
	f.vars = () => [signal, machine_from];
	if (!truthy((yield* g.srcCall(f, "is_freq_listening", live(signal))))) return f.dot;
	if (truthy((rt.istype(live(machine_from), T("/obj/machinery/telecomms/receiver")) ? 1 : 0))) {
		yield* g.srcCall(f, "relay_information", live(signal), "/obj/machinery/telecomms/bus", 1);
	} else {
		yield* g.srcCall(f, "relay_information", live(signal), "/obj/machinery/telecomms/relay", 1);
		yield* g.srcCall(f, "relay_information", live(signal), "/obj/machinery/telecomms/broadcaster", 1);
	}
	return f.dot;
}, true);

// /obj/machinery/telecomms/hub/proc/New  (code/game/machinery/telecomms/machines/hub.dm:37)  may sleep
rt.def("/obj/machinery/telecomms/hub/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/telecomms/hub"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6737, "/obj/item/weapon/circuitboard/machine/telecomms/hub", "/obj/item/weapon/circuitboard/machine/telecomms", {
	name: "Hub Mainframe (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/hub"),
	origin_tech: "programming=2;engineering=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/telecomms/hub/proc/<init>  (code/game/machinery/telecomms/machines/hub.dm:45)
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/hub/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/subspace/filter"), 2]));
	return f.dot;
});
