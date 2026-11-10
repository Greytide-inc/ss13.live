// Based on /tg/station's code/modules/modular_computers/NTNet/NTNRC/conversation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4174, "/datum/ntnet_conversation", "/datum", {
	id: null,
	title: "Untitled Conversation",
	operator: null,
	messages: null,
	clients: null,
	password: null,
}, { global: { ntnrc_uid: 676 } });

// conversation.dm:5
rt.def("/datum/ntnet_conversation/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.messages = list();

	this.clients = list();
	return f.dot;
});

// conversation.dm:11
rt.def("/datum/ntnet_conversation/proc/New", function New(f: Frame) {
	this.id = rt.incGl("ntnrc_uid", 1, true);
	if (GLOB.ntnet_global) {
		GLOB.ntnet_global.chat_channels.Add(this);
	}
	parent_proc();
	return f.dot;
});

// conversation.dm:18
rt.def("/datum/ntnet_conversation/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.ntnet_global) {
		yield* GLOB.ntnet_global.chat_channels.Remove(this);
	}
	return (yield* parent_proc());
}, true);

// conversation.dm:22
rt.def("/datum/ntnet_conversation/proc/add_message", function add_message(f: Frame, message: Value, username: Value) {
	message = `${worldtime2text()} ${username}: ${message}`;
	this.messages.Add(message);
	this.trim_message_list();
	return f.dot;
});

// conversation.dm:27
rt.def("/datum/ntnet_conversation/proc/add_status_message", function add_status_message(f: Frame, message: Value) {
	this.messages.Add(`${worldtime2text()} -!- ${message}`);
	this.trim_message_list();
	return f.dot;
});

// conversation.dm:31
rt.def("/datum/ntnet_conversation/proc/trim_message_list", function trim_message_list(f: Frame) {
	if (rt.len(f, this.messages) <= 50) {
		return f.dot;
	}
	this.messages = this.messages.Copy(rt.len(f, this.messages) - 50, 0);
	return f.dot;
});

// conversation.dm:36
rt.def("/datum/ntnet_conversation/proc/add_client", function add_client(f: Frame, C: Value) {
	if (!rt.istype(C, T("/datum/computer_file/program/chatclient"))) {
		return f.dot;
	}
	this.clients.Add(C);
	this.add_status_message(`${C.username} has joined the channel.`);
	if (this.operator) return f.dot;
	this.changeop(C);
	return f.dot;
});

// conversation.dm:45
rt.def("/datum/ntnet_conversation/proc/remove_client", function remove_client(f: Frame, C: Value) {
	let newop: Value = null;
	if (!rt.istype(C, T("/datum/computer_file/program/chatclient")) || !rt.isIn(f, C, this.clients)) {
		return f.dot;
	}
	this.clients.Remove(C);
	this.add_status_message(`${C.username} has left the channel.`);
	if (C != this.operator) return f.dot;
	this.operator = null;
	if (!rt.len(f, this.clients)) return f.dot;
	this.changeop((newop = pick(this.clients)));
	return f.dot;
});

// conversation.dm:59
rt.def("/datum/ntnet_conversation/proc/changeop", function changeop(f: Frame, newop: Value) {
	if (!rt.istype(newop, T("/datum/computer_file/program/chatclient"))) return f.dot;
	this.operator = newop;
	this.add_status_message(`Channel operator status transferred to ${newop.username}.`);
	return f.dot;
});
