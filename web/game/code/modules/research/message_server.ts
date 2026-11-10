// Based on /tg/station's code/modules/research/message_server.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// message_server.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalmessage_servers", function InitGlobalmessage_servers(f: Frame) {
	GLOB.message_servers = list();
	this.gvars_datum_init_order += "message_servers";
	return f.dot;
});

rt.type(4179, "/datum/data_pda_msg", "/datum", {
	recipient: "Unspecified",
	sender: "Unspecified",
	message: "Blank",
	photo: null,
});

// message_server.dm:12
rt.def("/datum/data_pda_msg/proc/New", function New(f: Frame, param_rec: Value, param_sender: Value, param_message: Value, param_photo: Value) {
	param_rec ??= "";
	param_sender ??= "";
	param_message ??= "";
	if (param_rec) {
		this.recipient = param_rec;
	}
	if (param_sender) {
		this.sender = param_sender;
	}
	if (param_message) {
		rt.setSv(f, "message", param_message);
	}
	if (!param_photo) return f.dot;
	this.photo = param_photo;
	return f.dot;
});

// message_server.dm:22
rt.def("/datum/data_pda_msg/proc/get_photo_ref", function get_photo_ref(f: Frame) {
	if (this.photo) {
		return fmt("<a href='byond://?src=＃;photo=1'>(Photo)</a>", [this]);
	}
	return "";
});

// message_server.dm:26
rt.def("/datum/data_pda_msg/proc/Topic", function Topic(f: Frame, href: Value, href_list: Value) {
	let M: Value = null;
	parent_proc();
	if (!rt.at(href_list, "photo")) return f.dot;
	rt.op(f, "BrowseResource", [], [(M = f.usr), this.photo, "pda_photo.png"], false);
	rt.op(f, "Browse", [], [M, "<html><head><title>PDA Photo</title></head><body style='overflow:hidden;margin:0;text-align:center'><img src='pda_photo.png' width='192' style='-ms-interpolation-mode:nearest-neighbor' /></body></html>", "window=book;size=192x192"], false);
	onclose(M, "PDA Photo");
	return f.dot;
}, false);

rt.type(4180, "/datum/data_rc_msg", "/datum", {
	rec_dpt: "Unspecified",
	send_dpt: "Unspecified",
	message: "Blank",
	stamp: "Unstamped",
	id_auth: "Unauthenticated",
	priority: "Normal",
});

// message_server.dm:46
rt.def("/datum/data_rc_msg/proc/New", function New(f: Frame, param_rec: Value, param_sender: Value, param_message: Value, param_stamp: Value, param_id_auth: Value, param_priority: Value) {
	param_rec ??= "";
	param_sender ??= "";
	param_message ??= "";
	param_stamp ??= "";
	param_id_auth ??= "";
	if (param_rec) {
		this.rec_dpt = param_rec;
	}
	if (param_sender) {
		this.send_dpt = param_sender;
	}
	if (param_message) {
		rt.setSv(f, "message", param_message);
	}
	if (param_stamp) {
		this.stamp = param_stamp;
	}
	if (param_id_auth) {
		this.id_auth = param_id_auth;
	}
	if (!param_priority) return f.dot;
	if (param_priority === 1) {
		this.priority = "Normal";
	} else if (param_priority === 2) {
		this.priority = "High";
	} else if (param_priority === 3) {
		this.priority = "Extreme";
	} else {
		this.priority = "Undetermined";
	}
	return f.dot;
});

rt.type(10748, "/obj/machinery/message_server", "/obj/machinery", {
	pda_msgs: null,
	rc_msgs: null,
	active: 1,
	decryptkey: "password",
	anchored: 1,
	icon: rt.rsc("icons/obj/machines/research.dmi"),
	icon_state: "server",
	name: "Messaging Server",
	density: 1,
	use_power: 1,
	idle_power_usage: 10,
	active_power_usage: 100,
});

// message_server.dm:76
rt.def("/obj/machinery/message_server/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.pda_msgs = list();

	this.rc_msgs = list();
	return f.dot;
});

// message_server.dm:82
rt.def("/obj/machinery/message_server/proc/Initialize", function* Initialize(f: Frame) {
	GLOB.message_servers += this;
	this.decryptkey = this.GenerateKey();
	this.send_pda_message("System Administrator", "system", "This is an automated message. The messaging system is functioning correctly.");
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// message_server.dm:88
rt.def("/obj/machinery/message_server/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.message_servers -= this;
	return (yield* parent_proc());
}, true);

// message_server.dm:94
rt.def("/obj/machinery/message_server/proc/GenerateKey", function GenerateKey(f: Frame) {
	let newKey: Value = null;
	newKey += pick("the", "if", "of", "as", "in", "a", "you", "from", "to", "an", "too", "little", "snow", "dead", "drunk", "rosebud", "duck", "al", "le");
	newKey += pick("diamond", "beer", "mushroom", "assistant", "clown", "captain", "twinkie", "security", "nuke", "small", "big", "escape", "yellow", "gloves", "monkey", "engine", "nuclear", "ai");
	return (newKey += pick("1", "2", "3", "4", "5", "6", "7", "8", "9", "0"));
});

// message_server.dm:102
rt.def("/obj/machinery/message_server/proc/process", function process(f: Frame) {
	if (this.active && rt.bitAnd(this.stat, 3)) {
		this.active = 0;
		return f.dot;
	}
	this.update_icon();
	return f.dot;
}, false, { waitfor: false });

// message_server.dm:109
rt.def("/obj/machinery/message_server/proc/send_pda_message", function send_pda_message(f: Frame, recipient: Value, sender: Value, message: Value, photo: Value) {
	recipient ??= "";
	sender ??= "";
	message ??= "";
	f.dot = new_(T("/datum/data_pda_msg"), recipient, sender, message, photo);
	this.pda_msgs += f.dot;
	return f.dot;
});

// message_server.dm:113
rt.def("/obj/machinery/message_server/proc/send_rc_message", function send_rc_message(f: Frame, recipient: Value, sender: Value, message: Value, stamp: Value, id_auth: Value, priority: Value) {
	recipient ??= "";
	sender ??= "";
	message ??= "";
	stamp ??= "";
	id_auth ??= "";
	priority ??= 1;
	this.rc_msgs += new_(T("/datum/data_rc_msg"), recipient, sender, message, stamp, id_auth);
	return f.dot;
});

// message_server.dm:116
rt.def("/obj/machinery/message_server/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	let $0: any = user;
	to_chat($0, `You toggle PDA message passing from ${this.active ? "On" : "Off"} to ${this.active ? "Off" : "On"}`);
	this.active = (!this.active ? 1 : 0);
	this.update_icon();
	return f.dot;
});

// message_server.dm:123
rt.def("/obj/machinery/message_server/proc/update_icon", function update_icon(f: Frame) {
	if (rt.bitAnd(this.stat, 3)) {
		this.icon_state = "server-nopower";
	} else if (!this.active) {
		this.icon_state = "server-off";
	} else {
		this.icon_state = "server-on";
	}
	return f.dot;
});

rt.type(10987, "/obj/machinery/blackbox_recorder", "/obj/machinery", {
	anchored: 1,
	use_power: 1,
	idle_power_usage: 10,
	active_power_usage: 100,
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "blackbox",
	name: "Blackbox Recorder",
	density: 1,
	armor: null,
});

// message_server.dm:141
rt.def("/obj/machinery/blackbox_recorder/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 25, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 70]);
	return f.dot;
});
