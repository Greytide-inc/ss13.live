// From code/game/machinery/telecomms/machines/processor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10727, "/obj/machinery/telecomms/processor", "/obj/machinery/telecomms", {
	process_mode: 1,
	anchored: 1,
	machinetype: 3,
	name: "processor unit",
	icon_state: "processor",
	desc: "This machine is used to process large quantities of information.",
	density: 1,
	use_power: 1,
	idle_power_usage: 30,
});

// /obj/machinery/telecomms/processor/proc/receive_information  (code/game/machinery/telecomms/machines/processor.dm:25)  may sleep
rt.def("/obj/machinery/telecomms/processor/proc/receive_information", function* receive_information(f: Frame, signal: Value, machine_from: Value) {
	f.vars = () => [signal, machine_from];
	if (!truthy((yield* g.srcCall(f, "is_freq_listening", live(signal))))) return f.dot;
	if (truthy(rt.sv(f, "process_mode"))) {
		rt.setAt(rt.fv(f, "data", live(signal)), "compression", 0);
	} else {
		rt.setAt(rt.fv(f, "data", live(signal)), "compression", 100);
	}
	if (truthy((rt.istype(live(machine_from), T("/obj/machinery/telecomms/bus")) ? 1 : 0))) {
		yield* g.srcCall(f, "relay_direct_information", live(signal), live(machine_from));
	} else {
		rt.modAt(rt.fv(f, "data", live(signal)), "slow", (yield* g.call(f, P("/proc/rand"), null, [5, 10])), add);
		yield* g.srcCall(f, "relay_information", live(signal), "/obj/machinery/telecomms/server");
	}
	return f.dot;
}, true);

// /obj/machinery/telecomms/processor/proc/New  (code/game/machinery/telecomms/machines/processor.dm:39)  may sleep
rt.def("/obj/machinery/telecomms/processor/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/telecomms/processor"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6738, "/obj/item/weapon/circuitboard/machine/telecomms/processor", "/obj/item/weapon/circuitboard/machine/telecomms", {
	name: "Processor Unit (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/processor"),
	origin_tech: "programming=2;engineering=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/telecomms/processor/proc/<init>  (code/game/machinery/telecomms/machines/processor.dm:47)
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/processor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 3, T("/obj/item/weapon/stock_parts/subspace/filter"), 1, T("/obj/item/weapon/stock_parts/subspace/treatment"), 2, T("/obj/item/weapon/stock_parts/subspace/analyzer"), 1, T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/subspace/amplifier"), 1]));
	return f.dot;
});

rt.type(10728, "/obj/machinery/telecomms/processor/preset_one", "/obj/machinery/telecomms/processor", {
	id: "Processor 1",
	network: "tcommsat",
	autolinkers: null,
});

// /obj/machinery/telecomms/processor/preset_one/proc/<init>  (code/game/machinery/telecomms/machines/processor.dm:61)
rt.def("/obj/machinery/telecomms/processor/preset_one/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("processor1"));
	return f.dot;
});

rt.type(10730, "/obj/machinery/telecomms/processor/preset_two", "/obj/machinery/telecomms/processor", {
	id: "Processor 2",
	network: "tcommsat",
	autolinkers: null,
});

// /obj/machinery/telecomms/processor/preset_two/proc/<init>  (code/game/machinery/telecomms/machines/processor.dm:66)
rt.def("/obj/machinery/telecomms/processor/preset_two/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("processor2"));
	return f.dot;
});

rt.type(10731, "/obj/machinery/telecomms/processor/preset_three", "/obj/machinery/telecomms/processor", {
	id: "Processor 3",
	network: "tcommsat",
	autolinkers: null,
});

// /obj/machinery/telecomms/processor/preset_three/proc/<init>  (code/game/machinery/telecomms/machines/processor.dm:71)
rt.def("/obj/machinery/telecomms/processor/preset_three/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("processor3"));
	return f.dot;
});

rt.type(10732, "/obj/machinery/telecomms/processor/preset_four", "/obj/machinery/telecomms/processor", {
	id: "Processor 4",
	network: "tcommsat",
	autolinkers: null,
});

// /obj/machinery/telecomms/processor/preset_four/proc/<init>  (code/game/machinery/telecomms/machines/processor.dm:76)
rt.def("/obj/machinery/telecomms/processor/preset_four/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("processor4"));
	return f.dot;
});
