// Based on /tg/station's code/game/machinery/telecomms/machines/bus.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


// bus.dm:26
rt.def("/obj/machinery/telecomms/bus/proc/receive_information", function* receive_information(f: Frame, signal: Value, machine_from: Value) {
	let send_to_processor: Value = null, send: Value = null, can_send: Value = null;
	if (!this.is_freq_listening(signal)) return f.dot;
	if (this.change_frequency) {
		if (signal.frequency != 1213) {
			signal.frequency = this.change_frequency;
		}
	}
	if (!rt.istype(machine_from, T("/obj/machinery/telecomms/processor")) && machine_from != this) {
		if (send_to_processor = (yield* this.relay_information(signal, "/obj/machinery/telecomms/processor"))) {
			return f.dot;
		}
		rt.modAt(signal.data, "slow", rand(1, 5), add);
		yield* this.receive_information(signal, this);
	}
	let try_send: Value = list("/obj/machinery/telecomms/server", "/obj/machinery/telecomms/hub", "/obj/machinery/telecomms/broadcaster", "/obj/machinery/telecomms/bus");
	let i: Value = 0;
	for (send of each(try_send)) {
		if (i) {
			rt.modAt(signal.data, "slow", rand(0, 1), add);
		}
		i++;
		if (can_send = (yield* this.relay_information(signal, send))) {
			break;
		}
	}
	return f.dot;
}, true);

// bus.dm:53
rt.def("/obj/machinery/telecomms/bus/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/telecomms/bus"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6736, "/obj/item/weapon/circuitboard/machine/telecomms/bus", "/obj/item/weapon/circuitboard/machine/telecomms", {
	name: "Bus Mainframe (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/bus"),
	origin_tech: "programming=2;engineering=2",
	req_components: null,
});

// bus.dm:61
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/bus/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/subspace/filter"), 1]);
	return f.dot;
});

rt.type(10719, "/obj/machinery/telecomms/bus/preset_four", "/obj/machinery/telecomms/bus", {
	id: "Bus 4",
	network: "tcommsat",
	freq_listening: null,
	autolinkers: null,
});

// bus.dm:93
rt.def("/obj/machinery/telecomms/bus/preset_four/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.freq_listening = list(1357);
	this.autolinkers = list("processor4", "engineering", "common");
	return f.dot;
});

// bus.dm:97
rt.def("/obj/machinery/telecomms/bus/preset_four/proc/New", function* New(f: Frame) {
	let i: Value = 1441;
	while (i < 1489) {
		(rt.modSrcVar(f, "freq_listening", i, rt.bitOr));
		i += 2;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10716, "/obj/machinery/telecomms/bus/preset_one/birdstation", "/obj/machinery/telecomms/bus/preset_one", {
	name: "Bus",
	autolinkers: null,
	freq_listening: null,
});

// bus.dm:104
rt.def("/obj/machinery/telecomms/bus/preset_one/birdstation/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("processor1", "common");

	this.freq_listening = list();
	return f.dot;
});
