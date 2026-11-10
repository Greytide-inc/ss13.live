// Based on /tg/station's code/game/machinery/telecomms/machines/broadcaster.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// broadcaster.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalrecentmessages", function InitGlobalrecentmessages(f: Frame) {
	GLOB.recentmessages = list();
	this.gvars_datum_init_order += "recentmessages";
	return f.dot;
});

// broadcaster.dm:9
rt.def("/datum/controller/global_vars/proc/InitGlobalmessage_delay", function InitGlobalmessage_delay(f: Frame) {
	GLOB.message_delay = 0;
	this.gvars_datum_init_order += "message_delay";
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

// broadcaster.dm:25
rt.def("/obj/machinery/telecomms/broadcaster/proc/receive_information", function* receive_information(f: Frame, signal: Value, machine_from: Value) {
	let original: Value = null, signal_message: Value = null;
	if (rt.index(signal.data, "reject")) {
		return f.dot;
	}
	if (!rt.index(signal.data, "message")) return f.dot;
	rt.setAt(signal.data, "done", 1);
	if (original = rt.index(signal.data, "original")) {
		rt.setAt(original.data, "done", 1);
		rt.setAt(original.data, "compression", rt.index(signal.data, "compression"));
		rt.setAt(original.data, "level", rt.index(signal.data, "level"));
	}
	if (rt.isIn(f, (signal_message = `${signal.frequency}:${rt.index(signal.data, "message")}:${rt.index(signal.data, "realname")}`), GLOB.recentmessages)) {
		return f.dot;
	}
	GLOB.recentmessages.Add(signal_message);
	if (rt.index(signal.data, "slow") > 0) {
		yield* sleep(rt.index(signal.data, "slow"));
	}
	(rt.modAt(signal.data, "level", this.listening_level, rt.bitOr));
	if (rt.index(signal.data, "type") == 0) {
		yield* Broadcast_Message(rt.index(signal.data, "mob"), rt.index(signal.data, "vmask"), rt.index(signal.data, "radio"), rt.index(signal.data, "message"), rt.index(signal.data, "name"), rt.index(signal.data, "job"), rt.index(signal.data, "realname"), 0, rt.index(signal.data, "compression"), rt.index(signal.data, "level"), signal.frequency, rt.index(signal.data, "spans"), rt.index(signal.data, "verb_say"), rt.index(signal.data, "verb_ask"), rt.index(signal.data, "verb_exclaim"), rt.index(signal.data, "verb_yell"), rt.index(signal.data, "language"));
	}
	if (rt.index(signal.data, "type") == 2) {
		yield* Broadcast_Message(rt.index(signal.data, "mob"), rt.index(signal.data, "vmask"), rt.index(signal.data, "radio"), rt.index(signal.data, "message"), rt.index(signal.data, "name"), rt.index(signal.data, "job"), rt.index(signal.data, "realname"), 4, rt.index(signal.data, "compression"), rt.index(signal.data, "level"), signal.frequency, rt.index(signal.data, "spans"), rt.index(signal.data, "verb_say"), rt.index(signal.data, "verb_ask"), rt.index(signal.data, "verb_exclaim"), rt.index(signal.data, "verb_yell"), rt.index(signal.data, "language"));
	}
	if (!GLOB.message_delay) {
		GLOB.message_delay = 1;
		rt.spawnTail(f, 10, "/obj/machinery/telecomms/broadcaster/proc/receive_information: spawn at game/machinery/telecomms/machines/broadcaster.dm:78", signal, machine_from, original, signal_message);
	}
	flick("broadcaster_send", this);
	return f.dot;
}, true);

// a spawn(10) body of /obj/machinery/telecomms/broadcaster/proc/receive_information, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/telecomms/broadcaster/proc/receive_information: spawn at game/machinery/telecomms/machines/broadcaster.dm:78", function* (f: Frame, signal: Value, machine_from: Value, original: Value, signal_message: Value) {
	GLOB.message_delay = 0;
	GLOB.recentmessages = list();
	return null;
});

// broadcaster.dm:86
rt.def("/obj/machinery/telecomms/broadcaster/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/telecomms/broadcaster"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6735, "/obj/item/weapon/circuitboard/machine/telecomms/broadcaster", "/obj/item/weapon/circuitboard/machine/telecomms", {
	name: "Subspace Broadcaster (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/broadcaster"),
	origin_tech: "programming=2;engineering=2;bluespace=1",
	req_components: null,
});

// broadcaster.dm:94
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/broadcaster/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/subspace/filter"), 1, T("/obj/item/weapon/stock_parts/subspace/crystal"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 2]);
	return f.dot;
});

// broadcaster.dm:105
rt.def("/obj/machinery/telecomms/broadcaster/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.message_delay) {
		GLOB.message_delay = 0;
	}
	return (yield* parent_proc());
}, true);

rt.type(10722, "/obj/machinery/telecomms/broadcaster/preset_left", "/obj/machinery/telecomms/broadcaster", {
	id: "Broadcaster A",
	network: "tcommsat",
	autolinkers: null,
});

// broadcaster.dm:116
rt.def("/obj/machinery/telecomms/broadcaster/preset_left/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("broadcasterA");
	return f.dot;
});

rt.type(10724, "/obj/machinery/telecomms/broadcaster/preset_right", "/obj/machinery/telecomms/broadcaster", {
	id: "Broadcaster B",
	network: "tcommsat",
	autolinkers: null,
});

// broadcaster.dm:123
rt.def("/obj/machinery/telecomms/broadcaster/preset_right/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("broadcasterB");
	return f.dot;
});
