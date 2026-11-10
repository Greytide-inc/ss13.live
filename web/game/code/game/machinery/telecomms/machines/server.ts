// Based on /tg/station's code/game/machinery/telecomms/machines/server.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10737, "/obj/machinery/telecomms/server", "/obj/machinery/telecomms", {
	log_entries: null,
	stored_names: null,
	TrafficActions: null,
	logs: 0,
	totaltraffic: 0,
	memory: null,
	encryption: "null",
	salt: "null",
	language: "human",
	server_radio: null,
	last_signal: 0,
	anchored: 1,
	machinetype: 4,
	name: "telecommunication server",
	icon_state: "comm_server",
	desc: "A machine used to store data and network statistics.",
	density: 1,
	use_power: 1,
	idle_power_usage: 15,
});

// server.dm:20
rt.def("/obj/machinery/telecomms/server/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.log_entries = list();

	this.stored_names = list();

	this.TrafficActions = list();

	this.memory = list();
	return f.dot;
});

// server.dm:36
rt.def("/obj/machinery/telecomms/server/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/telecomms/server"), null))).apply_default_parts(this);
	this.server_radio = (yield* new_(T("/obj/item/device/radio/headset")));
	return f.dot;
}, true);

rt.type(6741, "/obj/item/weapon/circuitboard/machine/telecomms/server", "/obj/item/weapon/circuitboard/machine/telecomms", {
	name: "Telecommunication Server (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/server"),
	origin_tech: "programming=2;engineering=2",
	req_components: null,
});

// server.dm:45
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/server/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/subspace/filter"), 1]);
	return f.dot;
});

// server.dm:51
rt.def("/obj/machinery/telecomms/server/proc/receive_information", function* receive_information(f: Frame, signal: Value, machine_from: Value) {
	let log: Value = null, identifier: Value = null, can_send: Value = null;
	if (!rt.index(signal.data, "message")) return f.dot;
	if (!this.is_freq_listening(signal)) return f.dot;
	if (this.traffic > 0) {
		this.totaltraffic += this.traffic;
	}
	if (rt.index(signal.data, "type") != 4) {
		this.update_logs();
		rt.setAt((log = (yield* new_(T("/datum/comm_log_entry")))).parameters, "mobtype", rt.index(signal.data, "mobtype"));
		rt.setAt(log.parameters, "job", rt.index(signal.data, "job"));
		rt.setAt(log.parameters, "key", rt.index(signal.data, "key"));
		rt.setAt(log.parameters, "message", rt.index(signal.data, "message"));
		rt.setAt(log.parameters, "name", rt.index(signal.data, "name"));
		rt.setAt(log.parameters, "realname", rt.index(signal.data, "realname"));
		if (rt.index(signal.data, "compression") > 0) {
			rt.setAt(log.parameters, "message", Gibberish(rt.index(signal.data, "message"), rt.index(signal.data, "compression") + 50));
			rt.setAt(log.parameters, "job", Gibberish(rt.index(signal.data, "job"), rt.index(signal.data, "compression") + 50));
			rt.setAt(log.parameters, "name", Gibberish(rt.index(signal.data, "name"), rt.index(signal.data, "compression") + 50));
			rt.setAt(log.parameters, "realname", Gibberish(rt.index(signal.data, "realname"), rt.index(signal.data, "compression") + 50));
			log.input_type = "Corrupt File";
		}
		this.log_entries.Add(log);
		if (!rt.isIn(f, rt.index(signal.data, "name"), this.stored_names)) {
			this.stored_names.Add(rt.index(signal.data, "name"));
		}
		this.logs++;
		rt.setAt(signal.data, "server", this);
		identifier = num2text(rand(-1000, 1000) + rt.worldTime(f));
		log.name = `data packet (${md5(identifier)})`;
	}
	if (can_send = (yield* this.relay_information(signal, "/obj/machinery/telecomms/hub"))) return f.dot;
	yield* this.relay_information(signal, "/obj/machinery/telecomms/broadcaster");
	return f.dot;
}, true);

// server.dm:103
rt.def("/obj/machinery/telecomms/server/proc/update_logs", function update_logs(f: Frame) {
	let L: Value = null;
	if (!(this.logs >= 400)) return f.dot;
	let i: Value = 1;
	while (i <= this.logs) {
		if ((L = rt.index(this.log_entries, i)).garbage_collector) {
			this.log_entries.Remove(L);
			this.logs--;
			break;
		}
		i++;
	}
	return f.dot;
});

rt.type(1505, "/datum/comm_log_entry", "/datum", {
	parameters: null,
	name: "data packet (#)",
	garbage_collector: 1,
	input_type: "Speech File",
});

// server.dm:125
rt.def("/datum/comm_log_entry/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.parameters = list();
	return f.dot;
});

rt.type(10738, "/obj/machinery/telecomms/server/presets", "/obj/machinery/telecomms/server", {
	network: "tcommsat",
});

// server.dm:139
rt.def("/obj/machinery/telecomms/server/presets/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.name = this.id;
	return f.dot;
}, true);

rt.type(10739, "/obj/machinery/telecomms/server/presets/science", "/obj/machinery/telecomms/server/presets", {
	id: "Science Server",
	autolinkers: null,
	freq_listening: null,
});

// server.dm:146
rt.def("/obj/machinery/telecomms/server/presets/science/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("science");

	this.freq_listening = list(1351);
	return f.dot;
});

rt.type(10740, "/obj/machinery/telecomms/server/presets/medical", "/obj/machinery/telecomms/server/presets", {
	id: "Medical Server",
	autolinkers: null,
	freq_listening: null,
});

// server.dm:151
rt.def("/obj/machinery/telecomms/server/presets/medical/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("medical");

	this.freq_listening = list(1355);
	return f.dot;
});

rt.type(10741, "/obj/machinery/telecomms/server/presets/supply", "/obj/machinery/telecomms/server/presets", {
	id: "Supply Server",
	autolinkers: null,
	freq_listening: null,
});

// server.dm:156
rt.def("/obj/machinery/telecomms/server/presets/supply/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("supply");

	this.freq_listening = list(1347);
	return f.dot;
});

rt.type(10742, "/obj/machinery/telecomms/server/presets/service", "/obj/machinery/telecomms/server/presets", {
	id: "Service Server",
	autolinkers: null,
	freq_listening: null,
});

// server.dm:161
rt.def("/obj/machinery/telecomms/server/presets/service/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("service");

	this.freq_listening = list(1349);
	return f.dot;
});

rt.type(10743, "/obj/machinery/telecomms/server/presets/common", "/obj/machinery/telecomms/server/presets", {
	id: "Common Server",
	freq_listening: null,
	autolinkers: null,
});

// server.dm:165
rt.def("/obj/machinery/telecomms/server/presets/common/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.freq_listening = list();

	this.autolinkers = list("common");
	return f.dot;
});

// server.dm:171
rt.def("/obj/machinery/telecomms/server/presets/common/proc/New", function* New(f: Frame) {
	let i: Value = 1441;
	while (i < 1489) {
		(rt.modSrcVar(f, "freq_listening", i, rt.bitOr));
		i += 2;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10745, "/obj/machinery/telecomms/server/presets/command", "/obj/machinery/telecomms/server/presets", {
	id: "Command Server",
	autolinkers: null,
	freq_listening: null,
});

// server.dm:178
rt.def("/obj/machinery/telecomms/server/presets/command/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("command");

	this.freq_listening = list(1353);
	return f.dot;
});

rt.type(10746, "/obj/machinery/telecomms/server/presets/engineering", "/obj/machinery/telecomms/server/presets", {
	id: "Engineering Server",
	autolinkers: null,
	freq_listening: null,
});

// server.dm:183
rt.def("/obj/machinery/telecomms/server/presets/engineering/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("engineering");

	this.freq_listening = list(1357);
	return f.dot;
});

rt.type(10747, "/obj/machinery/telecomms/server/presets/security", "/obj/machinery/telecomms/server/presets", {
	id: "Security Server",
	autolinkers: null,
	freq_listening: null,
});

// server.dm:188
rt.def("/obj/machinery/telecomms/server/presets/security/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.autolinkers = list("security");

	this.freq_listening = list(1359);
	return f.dot;
});

rt.type(10744, "/obj/machinery/telecomms/server/presets/common/birdstation", "/obj/machinery/telecomms/server/presets/common", {});

// server.dm:191
rt.def("/obj/machinery/telecomms/server/presets/common/birdstation/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.freq_listening = list();
	return f.dot;
}, true);
