// From code/game/machinery/telecomms/machines/bus.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/machinery/telecomms/bus/proc/receive_information  (code/game/machinery/telecomms/machines/bus.dm:26)  may sleep
rt.def("/obj/machinery/telecomms/bus/proc/receive_information", function* receive_information(f: Frame, signal: Value, machine_from: Value) {
	let send_to_processor: Value = null, try_send: Value = null, i: Value = null, send: Value = null, can_send: Value = null;
	let $e: any;
	f.vars = () => [signal, machine_from, send_to_processor, try_send, i, send, can_send, $e];
	if (!truthy((yield* g.srcCall(f, "is_freq_listening", live(signal))))) return f.dot;
	if (truthy(rt.sv(f, "change_frequency"))) {
		if (!isEqual(rt.fv(f, "frequency", live(signal)), 1213)) {
			rt.setFv(f, "frequency", live(signal), rt.sv(f, "change_frequency"));
		}
	}
	if ((!truthy((rt.istype(live(machine_from), T("/obj/machinery/telecomms/processor")) ? 1 : 0)) && !isEqual(live(machine_from), live(f.src)))) {
		if (truthy((send_to_processor = (yield* g.srcCall(f, "relay_information", live(signal), "/obj/machinery/telecomms/processor"))))) {
			return live(f.dot);
		}
		rt.modAt(rt.fv(f, "data", live(signal)), "slow", (yield* g.call(f, P("/proc/rand"), null, [1, 5])), add);
		yield* g.callName(f, live(f.src), "receive_information", [live(signal), live(f.src)]);
	}
	try_send = rt.list("/obj/machinery/telecomms/server", "/obj/machinery/telecomms/hub", "/obj/machinery/telecomms/broadcaster", "/obj/machinery/telecomms/bus");
	i = 0;
	send = null;
	rt.forList(f, 0, live(try_send));
	while (($e = rt.next(f, 0)) !== undefined) {
		send = $e;
		if (truthy(live(i))) {
			rt.modAt(rt.fv(f, "data", live(signal)), "slow", (yield* g.call(f, P("/proc/rand"), null, [0, 1])), add);
		}
		i = rt.inc(live(i), 1);
		if (truthy((can_send = (yield* g.srcCall(f, "relay_information", live(signal), live(send)))))) {
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/telecomms/bus/proc/New  (code/game/machinery/telecomms/machines/bus.dm:53)  may sleep
rt.def("/obj/machinery/telecomms/bus/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/telecomms/bus"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6736, "/obj/item/weapon/circuitboard/machine/telecomms/bus", "/obj/item/weapon/circuitboard/machine/telecomms", {
	name: "Bus Mainframe (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/bus"),
	origin_tech: "programming=2;engineering=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/telecomms/bus/proc/<init>  (code/game/machinery/telecomms/machines/bus.dm:61)
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/bus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/subspace/filter"), 1]));
	return f.dot;
});

rt.type(10719, "/obj/machinery/telecomms/bus/preset_four", "/obj/machinery/telecomms/bus", {
	id: "Bus 4",
	network: "tcommsat",
	freq_listening: null,
	autolinkers: null,
});

// /obj/machinery/telecomms/bus/preset_four/proc/<init>  (code/game/machinery/telecomms/machines/bus.dm:93)
rt.def("/obj/machinery/telecomms/bus/preset_four/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "freq_listening", rt.list(1357));
	rt.setSv(f, "autolinkers", rt.list("processor4", "engineering", "common"));
	return f.dot;
});

// /obj/machinery/telecomms/bus/preset_four/proc/New  (code/game/machinery/telecomms/machines/bus.dm:97)  may sleep
rt.def("/obj/machinery/telecomms/bus/preset_four/proc/New", function* New(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	i = null;
	i = 1441;
	while (rt.lt(live(i), 1489)) {
		(rt.modSrcVar(f, "freq_listening", live(i), rt.bitOr));
		i = rt.modify(live(i), 2, add);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(10716, "/obj/machinery/telecomms/bus/preset_one/birdstation", "/obj/machinery/telecomms/bus/preset_one", {
	name: "Bus",
	autolinkers: null,
	freq_listening: null,
});

// /obj/machinery/telecomms/bus/preset_one/birdstation/proc/<init>  (code/game/machinery/telecomms/machines/bus.dm:104)
rt.def("/obj/machinery/telecomms/bus/preset_one/birdstation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("processor1", "common"));
	$0 = $0;
	rt.setSv(f, "freq_listening", rt.list());
	return f.dot;
});
