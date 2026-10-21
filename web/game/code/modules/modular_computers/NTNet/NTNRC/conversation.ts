// From code/modules/modular_computers/NTNet/NTNRC/conversation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4174, "/datum/ntnet_conversation", "/datum", {
	id: null,
	title: "Untitled Conversation",
	operator: null,
	messages: null,
	clients: null,
	password: null,
}, { global: { ntnrc_uid: 676 } });

// /datum/ntnet_conversation/proc/<init>  (code/modules/modular_computers/NTNet/NTNRC/conversation.dm:5)
rt.def("/datum/ntnet_conversation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "messages", rt.list());
	$0 = $0;
	rt.setSv(f, "clients", rt.list());
	return f.dot;
});

// /datum/ntnet_conversation/proc/New  (code/modules/modular_computers/NTNet/NTNRC/conversation.dm:11)
rt.def("/datum/ntnet_conversation/proc/New", function New(f: Frame) {
	rt.setSv(f, "id", rt.incGl("ntnrc_uid", 1, true));
	if (truthy(rt.gl("ntnet_global"))) {
		rt.callName(f, rt.fv(f, "chat_channels", rt.gl("ntnet_global")), "Add", [live(f.src)]);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /datum/ntnet_conversation/proc/Destroy  (code/modules/modular_computers/NTNet/NTNRC/conversation.dm:18)  may sleep
rt.def("/datum/ntnet_conversation/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("ntnet_global"))) {
		yield* g.callName(f, rt.fv(f, "chat_channels", rt.gl("ntnet_global")), "Remove", [live(f.src)]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/ntnet_conversation/proc/add_message  (code/modules/modular_computers/NTNet/NTNRC/conversation.dm:22)
rt.def("/datum/ntnet_conversation/proc/add_message", function add_message(f: Frame, message: Value, username: Value) {
	f.vars = () => [message];
	message = fmt("＀ ＀: ＀", [rt.call(f, P("/proc/worldtime2text"), null, []), live(username), live(message)]);
	rt.callName(f, rt.sv(f, "messages"), "Add", [live(message)]);
	rt.callSrc(f, "trim_message_list", []);
	return f.dot;
});

// /datum/ntnet_conversation/proc/add_status_message  (code/modules/modular_computers/NTNet/NTNRC/conversation.dm:27)
rt.def("/datum/ntnet_conversation/proc/add_status_message", function add_status_message(f: Frame, message: Value) {
	rt.callName(f, rt.sv(f, "messages"), "Add", [fmt("＀ -!- ＀", [rt.call(f, P("/proc/worldtime2text"), null, []), live(message)])]);
	rt.callSrc(f, "trim_message_list", []);
	return f.dot;
});

// /datum/ntnet_conversation/proc/trim_message_list  (code/modules/modular_computers/NTNet/NTNRC/conversation.dm:31)
rt.def("/datum/ntnet_conversation/proc/trim_message_list", function trim_message_list(f: Frame) {
	if (rt.le(rt.len(f, rt.sv(f, "messages")), 50)) {
		return live(f.dot);
	}
	rt.setSv(f, "messages", rt.callName(f, rt.sv(f, "messages"), "Copy", [subtract(rt.len(f, rt.sv(f, "messages")), 50), 0]));
	return f.dot;
});

// /datum/ntnet_conversation/proc/add_client  (code/modules/modular_computers/NTNet/NTNRC/conversation.dm:36)
rt.def("/datum/ntnet_conversation/proc/add_client", function add_client(f: Frame, C: Value) {
	if (!truthy((rt.istype(live(C), T("/datum/computer_file/program/chatclient")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.callName(f, rt.sv(f, "clients"), "Add", [live(C)]);
	rt.callSrc(f, "add_status_message", [fmt("＀ has joined the channel.", [rt.fv(f, "username", live(C))])]);
	if (truthy(rt.sv(f, "operator"))) return f.dot;
	rt.callSrc(f, "changeop", [live(C)]);
	return f.dot;
});

// /datum/ntnet_conversation/proc/remove_client  (code/modules/modular_computers/NTNet/NTNRC/conversation.dm:45)
rt.def("/datum/ntnet_conversation/proc/remove_client", function remove_client(f: Frame, C: Value) {
	let newop: Value = null;
	f.vars = () => [newop];
	if ((!truthy((rt.istype(live(C), T("/datum/computer_file/program/chatclient")) ? 1 : 0)) || !truthy((rt.isIn(f, live(C), rt.sv(f, "clients")) ? 1 : 0)))) {
		return live(f.dot);
	}
	rt.callName(f, rt.sv(f, "clients"), "Remove", [live(C)]);
	rt.callSrc(f, "add_status_message", [fmt("＀ has left the channel.", [rt.fv(f, "username", live(C))])]);
	if (!isEqual(live(C), rt.sv(f, "operator"))) return f.dot;
	rt.setSv(f, "operator", null);
	if (!truthy(rt.len(f, rt.sv(f, "clients")))) return f.dot;
	rt.callSrc(f, "changeop", [(newop = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "clients")]))]);
	return f.dot;
});

// /datum/ntnet_conversation/proc/changeop  (code/modules/modular_computers/NTNet/NTNRC/conversation.dm:59)
rt.def("/datum/ntnet_conversation/proc/changeop", function changeop(f: Frame, newop: Value) {
	if (!truthy((rt.istype(live(newop), T("/datum/computer_file/program/chatclient")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "operator", live(newop));
	rt.callSrc(f, "add_status_message", [fmt("Channel operator status transferred to ＀.", [rt.fv(f, "username", live(newop))])]);
	return f.dot;
});

// /datum/ntnet_conversation/proc/change_title  (code/modules/modular_computers/NTNet/NTNRC/conversation.dm:64)
rt.def("/datum/ntnet_conversation/proc/change_title", function change_title(f: Frame, newtitle: Value, client: Value) {
	if (!isEqual(rt.sv(f, "operator"), live(client))) {
		return 0;
	}
	rt.callSrc(f, "add_status_message", [fmt("＀ has changed channel title from ＀ to ＀", [rt.fv(f, "username", live(client)), rt.sv(f, "title"), live(newtitle)])]);
	rt.setSv(f, "title", live(newtitle));
	return f.dot;
});
