// From code/game/machinery/telecomms/machines/server.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/telecomms/server/proc/<init>  (code/game/machinery/telecomms/machines/server.dm:20)
rt.def("/obj/machinery/telecomms/server/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "log_entries", rt.list());
	$0 = $0;
	rt.setSv(f, "stored_names", rt.list());
	$0 = $0;
	rt.setSv(f, "TrafficActions", rt.list());
	$0 = $0;
	rt.setSv(f, "memory", rt.list());
	return f.dot;
});

// /obj/machinery/telecomms/server/proc/New  (code/game/machinery/telecomms/machines/server.dm:36)  may sleep
rt.def("/obj/machinery/telecomms/server/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/telecomms/server"), [null]))), "apply_default_parts", [live(f.src)]);
	rt.setSv(f, "server_radio", (yield* g.new_(f, T("/obj/item/device/radio/headset"), [])));
	return f.dot;
}, true);

rt.type(6741, "/obj/item/weapon/circuitboard/machine/telecomms/server", "/obj/item/weapon/circuitboard/machine/telecomms", {
	name: "Telecommunication Server (Machine Board)",
	build_path: rt.typePath("/obj/machinery/telecomms/server"),
	origin_tech: "programming=2;engineering=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/telecomms/server/proc/<init>  (code/game/machinery/telecomms/machines/server.dm:45)
rt.def("/obj/item/weapon/circuitboard/machine/telecomms/server/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/subspace/filter"), 1]));
	return f.dot;
});

// /obj/machinery/telecomms/server/proc/receive_information  (code/game/machinery/telecomms/machines/server.dm:51)  may sleep
rt.def("/obj/machinery/telecomms/server/proc/receive_information", function* receive_information(f: Frame, signal: Value, machine_from: Value) {
	let log: Value = null, identifier: Value = null, can_send: Value = null;
	f.vars = () => [signal, machine_from, log, identifier, can_send];
	if (!truthy(rt.index(rt.fv(f, "data", live(signal)), "message"))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "is_freq_listening", live(signal))))) return f.dot;
	if (rt.gt(rt.sv(f, "traffic"), 0)) {
		rt.modSrcVar(f, "totaltraffic", rt.sv(f, "traffic"), add);
	}
	if (!isEqual(rt.index(rt.fv(f, "data", live(signal)), "type"), 4)) {
		yield* g.srcCall(f, "update_logs");
		rt.setAt(rt.gv(f, "parameters", (log = (yield* g.new_(f, T("/datum/comm_log_entry"), [])))), "mobtype", rt.index(rt.fv(f, "data", live(signal)), "mobtype"));
		rt.setAt(rt.fv(f, "parameters", live(log)), "job", rt.index(rt.fv(f, "data", live(signal)), "job"));
		rt.setAt(rt.fv(f, "parameters", live(log)), "key", rt.index(rt.fv(f, "data", live(signal)), "key"));
		rt.setAt(rt.fv(f, "parameters", live(log)), "message", rt.index(rt.fv(f, "data", live(signal)), "message"));
		rt.setAt(rt.fv(f, "parameters", live(log)), "name", rt.index(rt.fv(f, "data", live(signal)), "name"));
		rt.setAt(rt.fv(f, "parameters", live(log)), "realname", rt.index(rt.fv(f, "data", live(signal)), "realname"));
		if (rt.gt(rt.index(rt.fv(f, "data", live(signal)), "compression"), 0)) {
			rt.setAt(rt.fv(f, "parameters", live(log)), "message", (yield* g.call(f, P("/proc/Gibberish"), null, [rt.index(rt.fv(f, "data", live(signal)), "message"), add(rt.index(rt.fv(f, "data", live(signal)), "compression"), 50)])));
			rt.setAt(rt.fv(f, "parameters", live(log)), "job", (yield* g.call(f, P("/proc/Gibberish"), null, [rt.index(rt.fv(f, "data", live(signal)), "job"), add(rt.index(rt.fv(f, "data", live(signal)), "compression"), 50)])));
			rt.setAt(rt.fv(f, "parameters", live(log)), "name", (yield* g.call(f, P("/proc/Gibberish"), null, [rt.index(rt.fv(f, "data", live(signal)), "name"), add(rt.index(rt.fv(f, "data", live(signal)), "compression"), 50)])));
			rt.setAt(rt.fv(f, "parameters", live(log)), "realname", (yield* g.call(f, P("/proc/Gibberish"), null, [rt.index(rt.fv(f, "data", live(signal)), "realname"), add(rt.index(rt.fv(f, "data", live(signal)), "compression"), 50)])));
			rt.setFv(f, "input_type", live(log), "Corrupt File");
		}
		yield* g.callName(f, rt.sv(f, "log_entries"), "Add", [live(log)]);
		if (!truthy((rt.isIn(f, rt.index(rt.fv(f, "data", live(signal)), "name"), rt.sv(f, "stored_names")) ? 1 : 0))) {
			yield* g.callName(f, rt.sv(f, "stored_names"), "Add", [rt.index(rt.fv(f, "data", live(signal)), "name")]);
		}
		rt.incSrcVar(f, "logs", 1, true);
		rt.setAt(rt.fv(f, "data", live(signal)), "server", live(f.src));
		identifier = (yield* g.call(f, P("/proc/num2text"), null, [add((yield* g.call(f, P("/proc/rand"), null, [-1000, 1000])), rt.worldTime(f))]));
		rt.setFv(f, "name", live(log), fmt("data packet (＀)", [(yield* g.call(f, P("/proc/md5"), null, [live(identifier)]))]));
	}
	if (truthy((can_send = (yield* g.srcCall(f, "relay_information", live(signal), "/obj/machinery/telecomms/hub"))))) return f.dot;
	yield* g.srcCall(f, "relay_information", live(signal), "/obj/machinery/telecomms/broadcaster");
	return f.dot;
}, true);

// /obj/machinery/telecomms/server/proc/update_logs  (code/game/machinery/telecomms/machines/server.dm:103)
rt.def("/obj/machinery/telecomms/server/proc/update_logs", function update_logs(f: Frame) {
	let i: Value = null, L: Value = null;
	f.vars = () => [i, L];
	if (!rt.ge(rt.sv(f, "logs"), 400)) return f.dot;
	i = null;
	i = 1;
	while (rt.le(live(i), rt.sv(f, "logs"))) {
		if (truthy(rt.gv(f, "garbage_collector", (L = rt.index(rt.sv(f, "log_entries"), live(i)))))) {
			rt.callName(f, rt.sv(f, "log_entries"), "Remove", [live(L)]);
			rt.incSrcVar(f, "logs", -1, true);
			break;
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
});

// /obj/machinery/telecomms/server/proc/add_entry  (code/game/machinery/telecomms/machines/server.dm:112)
rt.def("/obj/machinery/telecomms/server/proc/add_entry", function add_entry(f: Frame, content: Value, input: Value) {
	let log: Value = null, identifier: Value = null;
	f.vars = () => [log, identifier];
	log = rt.new_(f, T("/datum/comm_log_entry"), []);
	identifier = rt.call(f, P("/proc/num2text"), null, [add(rt.call(f, P("/proc/rand"), null, [-1000, 1000]), rt.worldTime(f))]);
	rt.setFv(f, "name", live(log), fmt("＀ (＀)", [live(input), rt.call(f, P("/proc/md5"), null, [live(identifier)])]));
	rt.setFv(f, "input_type", live(log), live(input));
	rt.setAt(rt.fv(f, "parameters", live(log)), "message", live(content));
	rt.callName(f, rt.sv(f, "log_entries"), "Add", [live(log)]);
	rt.callSrc(f, "update_logs", []);
	return f.dot;
});

rt.type(1505, "/datum/comm_log_entry", "/datum", {
	parameters: null,
	name: "data packet (#)",
	garbage_collector: 1,
	input_type: "Speech File",
});

// /datum/comm_log_entry/proc/<init>  (code/game/machinery/telecomms/machines/server.dm:125)
rt.def("/datum/comm_log_entry/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "parameters", rt.list());
	return f.dot;
});

rt.type(10738, "/obj/machinery/telecomms/server/presets", "/obj/machinery/telecomms/server", {
	network: "tcommsat",
});

// /obj/machinery/telecomms/server/presets/proc/New  (code/game/machinery/telecomms/machines/server.dm:139)  may sleep
rt.def("/obj/machinery/telecomms/server/presets/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", rt.sv(f, "id"));
	return f.dot;
}, true);

rt.type(10739, "/obj/machinery/telecomms/server/presets/science", "/obj/machinery/telecomms/server/presets", {
	id: "Science Server",
	autolinkers: null,
	freq_listening: null,
});

// /obj/machinery/telecomms/server/presets/science/proc/<init>  (code/game/machinery/telecomms/machines/server.dm:146)
rt.def("/obj/machinery/telecomms/server/presets/science/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("science"));
	$0 = $0;
	rt.setSv(f, "freq_listening", rt.list(1351));
	return f.dot;
});

rt.type(10740, "/obj/machinery/telecomms/server/presets/medical", "/obj/machinery/telecomms/server/presets", {
	id: "Medical Server",
	autolinkers: null,
	freq_listening: null,
});

// /obj/machinery/telecomms/server/presets/medical/proc/<init>  (code/game/machinery/telecomms/machines/server.dm:151)
rt.def("/obj/machinery/telecomms/server/presets/medical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("medical"));
	$0 = $0;
	rt.setSv(f, "freq_listening", rt.list(1355));
	return f.dot;
});

rt.type(10741, "/obj/machinery/telecomms/server/presets/supply", "/obj/machinery/telecomms/server/presets", {
	id: "Supply Server",
	autolinkers: null,
	freq_listening: null,
});

// /obj/machinery/telecomms/server/presets/supply/proc/<init>  (code/game/machinery/telecomms/machines/server.dm:156)
rt.def("/obj/machinery/telecomms/server/presets/supply/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("supply"));
	$0 = $0;
	rt.setSv(f, "freq_listening", rt.list(1347));
	return f.dot;
});

rt.type(10742, "/obj/machinery/telecomms/server/presets/service", "/obj/machinery/telecomms/server/presets", {
	id: "Service Server",
	autolinkers: null,
	freq_listening: null,
});

// /obj/machinery/telecomms/server/presets/service/proc/<init>  (code/game/machinery/telecomms/machines/server.dm:161)
rt.def("/obj/machinery/telecomms/server/presets/service/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("service"));
	$0 = $0;
	rt.setSv(f, "freq_listening", rt.list(1349));
	return f.dot;
});

rt.type(10743, "/obj/machinery/telecomms/server/presets/common", "/obj/machinery/telecomms/server/presets", {
	id: "Common Server",
	freq_listening: null,
	autolinkers: null,
});

// /obj/machinery/telecomms/server/presets/common/proc/<init>  (code/game/machinery/telecomms/machines/server.dm:165)
rt.def("/obj/machinery/telecomms/server/presets/common/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "freq_listening", rt.list());
	$0 = $0;
	rt.setSv(f, "autolinkers", rt.list("common"));
	return f.dot;
});

// /obj/machinery/telecomms/server/presets/common/proc/New  (code/game/machinery/telecomms/machines/server.dm:171)  may sleep
rt.def("/obj/machinery/telecomms/server/presets/common/proc/New", function* New(f: Frame) {
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

rt.type(10745, "/obj/machinery/telecomms/server/presets/command", "/obj/machinery/telecomms/server/presets", {
	id: "Command Server",
	autolinkers: null,
	freq_listening: null,
});

// /obj/machinery/telecomms/server/presets/command/proc/<init>  (code/game/machinery/telecomms/machines/server.dm:178)
rt.def("/obj/machinery/telecomms/server/presets/command/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("command"));
	$0 = $0;
	rt.setSv(f, "freq_listening", rt.list(1353));
	return f.dot;
});

rt.type(10746, "/obj/machinery/telecomms/server/presets/engineering", "/obj/machinery/telecomms/server/presets", {
	id: "Engineering Server",
	autolinkers: null,
	freq_listening: null,
});

// /obj/machinery/telecomms/server/presets/engineering/proc/<init>  (code/game/machinery/telecomms/machines/server.dm:183)
rt.def("/obj/machinery/telecomms/server/presets/engineering/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("engineering"));
	$0 = $0;
	rt.setSv(f, "freq_listening", rt.list(1357));
	return f.dot;
});

rt.type(10747, "/obj/machinery/telecomms/server/presets/security", "/obj/machinery/telecomms/server/presets", {
	id: "Security Server",
	autolinkers: null,
	freq_listening: null,
});

// /obj/machinery/telecomms/server/presets/security/proc/<init>  (code/game/machinery/telecomms/machines/server.dm:188)
rt.def("/obj/machinery/telecomms/server/presets/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "autolinkers", rt.list("security"));
	$0 = $0;
	rt.setSv(f, "freq_listening", rt.list(1359));
	return f.dot;
});

rt.type(10744, "/obj/machinery/telecomms/server/presets/common/birdstation", "/obj/machinery/telecomms/server/presets/common", {});

// /obj/machinery/telecomms/server/presets/common/birdstation/proc/New  (code/game/machinery/telecomms/machines/server.dm:191)  may sleep
rt.def("/obj/machinery/telecomms/server/presets/common/birdstation/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "freq_listening", rt.list());
	return f.dot;
}, true);
