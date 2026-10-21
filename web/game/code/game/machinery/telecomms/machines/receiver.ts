// From code/game/machinery/telecomms/machines/receiver.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/telecomms/receiver/proc/receive_signal  (code/game/machinery/telecomms/machines/receiver.dm:23)  may sleep
rt.def("/obj/machinery/telecomms/receiver/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	let can_send: Value = null;
	f.vars = () => [signal, can_send];
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	if (!truthy(live(signal))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "check_receive_level", live(signal))))) {
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "transmission_method", live(signal)), 2)) return f.dot;
	if (!truthy((yield* g.srcCall(f, "is_freq_listening", live(signal))))) return f.dot;
	rt.setAt(rt.fv(f, "data", live(signal)), "level", rt.list());
	if (truthy((can_send = (yield* g.srcCall(f, "relay_information", live(signal), "/obj/machinery/telecomms/hub"))))) return f.dot;
	yield* g.srcCall(f, "relay_information", live(signal), "/obj/machinery/telecomms/bus");
	return f.dot;
}, true);

// /obj/machinery/telecomms/receiver/proc/check_receive_level  (code/game/machinery/telecomms/machines/receiver.dm:42)
rt.def("/obj/machinery/telecomms/receiver/proc/check_receive_level", function check_receive_level(f: Frame, signal: Value) {
	let H: Value = null, connected_levels: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [H, connected_levels, R, $e];
	if (!isEqual(rt.index(rt.fv(f, "data", live(signal)), "level"), rt.sv(f, "listening_level"))) {
		H = null;
		rt.forList(f, 0, rt.sv(f, "links"), T("/obj/machinery/telecomms/hub"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			connected_levels = rt.list();
			R = null;
			rt.forList(f, 1, rt.fv(f, "links", live(H)), T("/obj/machinery/telecomms/relay"));
			while (($e = rt.next(f, 1)) !== undefined) {
				R = $e;
				if (truthy(rt.callName(f, live(R), "can_receive", [live(signal)]))) {
					(connected_levels = rt.modify(live(connected_levels), rt.fv(f, "listening_level", live(R)), rt.bitOr));
				}
			}
			rt.endFor(f, 1);
			if (truthy((rt.isIn(f, rt.index(rt.fv(f, "data", live(signal)), "level"), live(connected_levels)) ? 1 : 0))) {
				return 1;
			}
		}
		rt.endFor(f, 0);
		return 0;
	}
	return 1;
});

// /obj/machinery/telecomms/receiver/proc/New  (code/game/machinery/telecomms/machines/receiver.dm:55)  may sleep
rt.def("/obj/machinery/telecomms/receiver/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/telecomms/receiver"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6739, "/obj/item/weapon/circuitboard/machine/telecomms/receiver", "/obj/item/weapon/circuitboard/machine/telecomms", {
	req_components: null,
	name: "Subspace Receiver (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/receiver"),
	origin_tech: "programming=2;engineering=2;bluespace=1",
});

// /obj/item/weapon/circuitboard/machine/telecomms/receiver/proc/<init>  (code/game/machinery/telecomms/machines/receiver.dm:63)
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/receiver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/subspace/ansible"), 1, T("/obj/item/weapon/stock_parts/subspace/filter"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/weapon/stock_parts/micro_laser"), 1]));
	return f.dot;
});

rt.type(10734, "/obj/machinery/telecomms/receiver/preset_left", "/obj/machinery/telecomms/receiver", {
	id: "Receiver A",
	network: "tcommsat",
	autolinkers: null,
	freq_listening: null,
});

// /obj/machinery/telecomms/receiver/preset_left/proc/<init>  (code/game/machinery/telecomms/machines/receiver.dm:79)
rt.def("/obj/machinery/telecomms/receiver/preset_left/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("receiverA"));
	rt.setSv(f, "freq_listening", rt.list(1351, 1355, 1347, 1349));
	return f.dot;
});

rt.type(10736, "/obj/machinery/telecomms/receiver/preset_right", "/obj/machinery/telecomms/receiver", {
	id: "Receiver B",
	network: "tcommsat",
	autolinkers: null,
	freq_listening: null,
});

// /obj/machinery/telecomms/receiver/preset_right/proc/<init>  (code/game/machinery/telecomms/machines/receiver.dm:88)
rt.def("/obj/machinery/telecomms/receiver/preset_right/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("receiverB"));
	rt.setSv(f, "freq_listening", rt.list(1353, 1357, 1359));
	return f.dot;
});

// /obj/machinery/telecomms/receiver/preset_right/proc/New  (code/game/machinery/telecomms/machines/receiver.dm:93)  may sleep
rt.def("/obj/machinery/telecomms/receiver/preset_right/proc/New", function* New(f: Frame) {
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

rt.type(10735, "/obj/machinery/telecomms/receiver/preset_left/birdstation", "/obj/machinery/telecomms/receiver/preset_left", {
	freq_listening: null,
	name: "Receiver",
});

// /obj/machinery/telecomms/receiver/preset_left/birdstation/proc/<init>  (code/game/machinery/telecomms/machines/receiver.dm:99)
rt.def("/obj/machinery/telecomms/receiver/preset_left/birdstation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "freq_listening", rt.list());
	return f.dot;
});
