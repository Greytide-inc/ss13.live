// From code/game/machinery/telecomms/machines/broadcaster.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalrecentmessages  (code/game/machinery/telecomms/machines/broadcaster.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalrecentmessages", function InitGlobalrecentmessages(f: Frame) {
	rt.setGl("recentmessages", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "recentmessages", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmessage_delay  (code/game/machinery/telecomms/machines/broadcaster.dm:9)
rt.def("/datum/controller/global_vars/proc/InitGlobalmessage_delay", function InitGlobalmessage_delay(f: Frame) {
	rt.setGl("message_delay", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "message_delay", add);
	return f.dot;
});

rt.type(10721, "/obj/machinery/telecomms/broadcaster", "/obj/machinery/telecomms", {
	anchored: 1,
	machinetype: 5,
	name: "subspace broadcaster",
	icon_state: "broadcaster",
	desc: "A dish-shaped machine used to broadcast processed subspace signals.",
	density: 1,
	use_power: 1,
	idle_power_usage: 25,
});

// /obj/machinery/telecomms/broadcaster/proc/receive_information  (code/game/machinery/telecomms/machines/broadcaster.dm:25)  may sleep
rt.def("/obj/machinery/telecomms/broadcaster/proc/receive_information", function* receive_information(f: Frame, signal: Value, machine_from: Value) {
	let original: Value = null, signal_message: Value = null;
	f.vars = () => [signal, machine_from, original, signal_message];
	if (truthy(rt.index(rt.fv(f, "data", live(signal)), "reject"))) {
		return live(f.dot);
	}
	if (!truthy(rt.index(rt.fv(f, "data", live(signal)), "message"))) return f.dot;
	rt.setAt(rt.fv(f, "data", live(signal)), "done", 1);
	if (truthy((original = rt.index(rt.fv(f, "data", live(signal)), "original")))) {
		rt.setAt(rt.fv(f, "data", live(original)), "done", 1);
		rt.setAt(rt.fv(f, "data", live(original)), "compression", rt.index(rt.fv(f, "data", live(signal)), "compression"));
		rt.setAt(rt.fv(f, "data", live(original)), "level", rt.index(rt.fv(f, "data", live(signal)), "level"));
	}
	if (truthy((rt.isIn(f, (signal_message = fmt("＀:＀:＀", [rt.fv(f, "frequency", live(signal)), rt.index(rt.fv(f, "data", live(signal)), "message"), rt.index(rt.fv(f, "data", live(signal)), "realname")])), rt.gl("recentmessages")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.gl("recentmessages"), "Add", [live(signal_message)]);
	if (rt.gt(rt.index(rt.fv(f, "data", live(signal)), "slow"), 0)) {
		yield* g.call(f, P("/proc/sleep"), null, [rt.index(rt.fv(f, "data", live(signal)), "slow")]);
	}
	(rt.modAt(rt.fv(f, "data", live(signal)), "level", rt.sv(f, "listening_level"), rt.bitOr));
	if (isEqual(rt.index(rt.fv(f, "data", live(signal)), "type"), 0)) {
		yield* g.call(f, P("/proc/Broadcast_Message"), null, [rt.index(rt.fv(f, "data", live(signal)), "mob"), rt.index(rt.fv(f, "data", live(signal)), "vmask"), rt.index(rt.fv(f, "data", live(signal)), "radio"), rt.index(rt.fv(f, "data", live(signal)), "message"), rt.index(rt.fv(f, "data", live(signal)), "name"), rt.index(rt.fv(f, "data", live(signal)), "job"), rt.index(rt.fv(f, "data", live(signal)), "realname"), 0, rt.index(rt.fv(f, "data", live(signal)), "compression"), rt.index(rt.fv(f, "data", live(signal)), "level"), rt.fv(f, "frequency", live(signal)), rt.index(rt.fv(f, "data", live(signal)), "spans"), rt.index(rt.fv(f, "data", live(signal)), "verb_say"), rt.index(rt.fv(f, "data", live(signal)), "verb_ask"), rt.index(rt.fv(f, "data", live(signal)), "verb_exclaim"), rt.index(rt.fv(f, "data", live(signal)), "verb_yell"), rt.index(rt.fv(f, "data", live(signal)), "language")]);
	}
	if (isEqual(rt.index(rt.fv(f, "data", live(signal)), "type"), 2)) {
		yield* g.call(f, P("/proc/Broadcast_Message"), null, [rt.index(rt.fv(f, "data", live(signal)), "mob"), rt.index(rt.fv(f, "data", live(signal)), "vmask"), rt.index(rt.fv(f, "data", live(signal)), "radio"), rt.index(rt.fv(f, "data", live(signal)), "message"), rt.index(rt.fv(f, "data", live(signal)), "name"), rt.index(rt.fv(f, "data", live(signal)), "job"), rt.index(rt.fv(f, "data", live(signal)), "realname"), 4, rt.index(rt.fv(f, "data", live(signal)), "compression"), rt.index(rt.fv(f, "data", live(signal)), "level"), rt.fv(f, "frequency", live(signal)), rt.index(rt.fv(f, "data", live(signal)), "spans"), rt.index(rt.fv(f, "data", live(signal)), "verb_say"), rt.index(rt.fv(f, "data", live(signal)), "verb_ask"), rt.index(rt.fv(f, "data", live(signal)), "verb_exclaim"), rt.index(rt.fv(f, "data", live(signal)), "verb_yell"), rt.index(rt.fv(f, "data", live(signal)), "language")]);
	}
	if (!truthy(rt.gl("message_delay"))) {
		rt.setGl("message_delay", 1);
		rt.spawnTail(f, 10, "/obj/machinery/telecomms/broadcaster/proc/receive_information: spawn at game/machinery/telecomms/machines/broadcaster.dm:78", signal, machine_from, original, signal_message);
	}
	yield* g.call(f, P("/proc/flick"), null, ["broadcaster_send", live(f.src)]);
	return f.dot;
}, true);

// a spawn(10) body of /obj/machinery/telecomms/broadcaster/proc/receive_information, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/telecomms/broadcaster/proc/receive_information: spawn at game/machinery/telecomms/machines/broadcaster.dm:78", function* (f: Frame, signal: Value, machine_from: Value, original: Value, signal_message: Value) {
	f.vars = () => [signal, machine_from, original, signal_message];
	rt.setGl("message_delay", 0);
	rt.setGl("recentmessages", rt.list());
	return null;
});

// /obj/machinery/telecomms/broadcaster/proc/New  (code/game/machinery/telecomms/machines/broadcaster.dm:86)  may sleep
rt.def("/obj/machinery/telecomms/broadcaster/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/telecomms/broadcaster"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6735, "/obj/item/weapon/circuitboard/machine/telecomms/broadcaster", "/obj/item/weapon/circuitboard/machine/telecomms", {
	name: "Subspace Broadcaster (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/broadcaster"),
	origin_tech: "programming=2;engineering=2;bluespace=1",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/telecomms/broadcaster/proc/<init>  (code/game/machinery/telecomms/machines/broadcaster.dm:94)
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/broadcaster/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/subspace/filter"), 1, T("/obj/item/weapon/stock_parts/subspace/crystal"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 2]));
	return f.dot;
});

// /obj/machinery/telecomms/broadcaster/proc/Destroy  (code/game/machinery/telecomms/machines/broadcaster.dm:105)  may sleep
rt.def("/obj/machinery/telecomms/broadcaster/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("message_delay"))) {
		rt.setGl("message_delay", 0);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(10722, "/obj/machinery/telecomms/broadcaster/preset_left", "/obj/machinery/telecomms/broadcaster", {
	id: "Broadcaster A",
	network: "tcommsat",
	autolinkers: null,
});

// /obj/machinery/telecomms/broadcaster/preset_left/proc/<init>  (code/game/machinery/telecomms/machines/broadcaster.dm:116)
rt.def("/obj/machinery/telecomms/broadcaster/preset_left/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("broadcasterA"));
	return f.dot;
});

rt.type(10724, "/obj/machinery/telecomms/broadcaster/preset_right", "/obj/machinery/telecomms/broadcaster", {
	id: "Broadcaster B",
	network: "tcommsat",
	autolinkers: null,
});

// /obj/machinery/telecomms/broadcaster/preset_right/proc/<init>  (code/game/machinery/telecomms/machines/broadcaster.dm:123)
rt.def("/obj/machinery/telecomms/broadcaster/preset_right/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("broadcasterB"));
	return f.dot;
});
