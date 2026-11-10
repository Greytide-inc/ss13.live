// Based on /tg/station's code/game/machinery/telecomms/machines/receiver.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10733, "/obj/machinery/telecomms/receiver", "/obj/machinery/telecomms", {
	anchored: 1,
	machinetype: 1,
	name: "subspace receiver",
	icon_state: "broadcast receiver",
	desc: "This machine has a dish-like shape and green lights. It is designed to detect and process subspace radio activity.",
	density: 1,
	use_power: 1,
	idle_power_usage: 30,
});

// receiver.dm:23
rt.def("/obj/machinery/telecomms/receiver/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	let can_send: Value = null;
	if (!this.on) {
		return f.dot;
	}
	if (!signal) {
		return f.dot;
	}
	if (!this.check_receive_level(signal)) {
		return f.dot;
	}
	if (signal.transmission_method != 2) return f.dot;
	if (!this.is_freq_listening(signal)) return f.dot;
	rt.setAt(signal.data, "level", list());
	if (can_send = (yield* this.relay_information(signal, "/obj/machinery/telecomms/hub"))) return f.dot;
	yield* this.relay_information(signal, "/obj/machinery/telecomms/bus");
	return f.dot;
}, true);

// receiver.dm:42
rt.def("/obj/machinery/telecomms/receiver/proc/check_receive_level", function check_receive_level(f: Frame, signal: Value) {
	let H: Value = null, connected_levels: Value = null, R: Value = null;
	if (rt.index(signal.data, "level") != this.listening_level) {
		for (H of each(this.links, T("/obj/machinery/telecomms/hub"))) {
			connected_levels = list();
			R = null;
			for (R of each(H.links, T("/obj/machinery/telecomms/relay"))) {
				if (R.can_receive(signal)) {
					(connected_levels = rt.modify(connected_levels, R.listening_level, rt.bitOr));
				}
			}
			if (rt.isIn(f, rt.index(signal.data, "level"), connected_levels)) {
				return 1;
			}
		}
		return 0;
	}
	return 1;
});

// receiver.dm:55
rt.def("/obj/machinery/telecomms/receiver/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/telecomms/receiver"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6739, "/obj/item/weapon/circuitboard/machine/telecomms/receiver", "/obj/item/weapon/circuitboard/machine/telecomms", {
	req_components: null,
	name: "Subspace Receiver (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/receiver"),
	origin_tech: "programming=2;engineering=2;bluespace=1",
});

// receiver.dm:63
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/receiver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/subspace/ansible"), 1, T("/obj/item/weapon/stock_parts/subspace/filter"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/weapon/stock_parts/micro_laser"), 1]);
	return f.dot;
});

rt.type(10734, "/obj/machinery/telecomms/receiver/preset_left", "/obj/machinery/telecomms/receiver", {
	id: "Receiver A",
	network: "tcommsat",
	autolinkers: null,
	freq_listening: null,
});

// receiver.dm:79
rt.def("/obj/machinery/telecomms/receiver/preset_left/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("receiverA");
	this.freq_listening = list(1351, 1355, 1347, 1349);
	return f.dot;
});

rt.type(10736, "/obj/machinery/telecomms/receiver/preset_right", "/obj/machinery/telecomms/receiver", {
	id: "Receiver B",
	network: "tcommsat",
	autolinkers: null,
	freq_listening: null,
});

// receiver.dm:88
rt.def("/obj/machinery/telecomms/receiver/preset_right/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("receiverB");
	this.freq_listening = list(1353, 1357, 1359);
	return f.dot;
});

// receiver.dm:93
rt.def("/obj/machinery/telecomms/receiver/preset_right/proc/New", function* New(f: Frame) {
	let i: Value = 1441;
	while (i < 1489) {
		(rt.modSrcVar(f, "freq_listening", i, rt.bitOr));
		i += 2;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10735, "/obj/machinery/telecomms/receiver/preset_left/birdstation", "/obj/machinery/telecomms/receiver/preset_left", {
	freq_listening: null,
	name: "Receiver",
});

// receiver.dm:99
rt.def("/obj/machinery/telecomms/receiver/preset_left/birdstation/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.freq_listening = list();
	return f.dot;
});
