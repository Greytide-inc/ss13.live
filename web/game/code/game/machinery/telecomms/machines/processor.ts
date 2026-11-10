// Based on /tg/station's code/game/machinery/telecomms/machines/processor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


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

// processor.dm:25
rt.def("/obj/machinery/telecomms/processor/proc/receive_information", function* receive_information(f: Frame, signal: Value, machine_from: Value) {
	if (!this.is_freq_listening(signal)) return f.dot;
	if (this.process_mode) {
		rt.setAt(signal.data, "compression", 0);
	} else {
		rt.setAt(signal.data, "compression", 100);
	}
	if (rt.istype(machine_from, T("/obj/machinery/telecomms/bus"))) {
		yield* this.relay_direct_information(signal, machine_from);
	} else {
		rt.modAt(signal.data, "slow", rand(5, 10), add);
		yield* this.relay_information(signal, "/obj/machinery/telecomms/server");
	}
	return f.dot;
}, true);

// processor.dm:39
rt.def("/obj/machinery/telecomms/processor/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/telecomms/processor"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6738, "/obj/item/weapon/circuitboard/machine/telecomms/processor", "/obj/item/weapon/circuitboard/machine/telecomms", {
	name: "Processor Unit (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/processor"),
	origin_tech: "programming=2;engineering=2",
	req_components: null,
});

// processor.dm:47
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/processor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 3, T("/obj/item/weapon/stock_parts/subspace/filter"), 1, T("/obj/item/weapon/stock_parts/subspace/treatment"), 2, T("/obj/item/weapon/stock_parts/subspace/analyzer"), 1, T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/subspace/amplifier"), 1]);
	return f.dot;
});

rt.type(10728, "/obj/machinery/telecomms/processor/preset_one", "/obj/machinery/telecomms/processor", {
	id: "Processor 1",
	network: "tcommsat",
	autolinkers: null,
});

// processor.dm:61
rt.def("/obj/machinery/telecomms/processor/preset_one/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("processor1");
	return f.dot;
});

rt.type(10730, "/obj/machinery/telecomms/processor/preset_two", "/obj/machinery/telecomms/processor", {
	id: "Processor 2",
	network: "tcommsat",
	autolinkers: null,
});

// processor.dm:66
rt.def("/obj/machinery/telecomms/processor/preset_two/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("processor2");
	return f.dot;
});

rt.type(10731, "/obj/machinery/telecomms/processor/preset_three", "/obj/machinery/telecomms/processor", {
	id: "Processor 3",
	network: "tcommsat",
	autolinkers: null,
});

// processor.dm:71
rt.def("/obj/machinery/telecomms/processor/preset_three/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("processor3");
	return f.dot;
});

rt.type(10732, "/obj/machinery/telecomms/processor/preset_four", "/obj/machinery/telecomms/processor", {
	id: "Processor 4",
	network: "tcommsat",
	autolinkers: null,
});

// processor.dm:76
rt.def("/obj/machinery/telecomms/processor/preset_four/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("processor4");
	return f.dot;
});
