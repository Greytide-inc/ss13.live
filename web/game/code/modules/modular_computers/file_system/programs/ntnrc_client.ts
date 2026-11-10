// Based on /tg/station's code/modules/modular_computers/file_system/programs/ntnrc_client.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(4167, "/datum/computer_file/program/chatclient", "/datum/computer_file/program", {
	last_message: null,
	username: null,
	channel: null,
	operator_mode: 0,
	netadmin_mode: 0,
	filename: "ntnrc_client",
	filedesc: "Chat Client",
	program_icon_state: "command",
	extended_desc: "This program allows communication over NTNRC network",
	size: 8,
	requires_ntnet: 1,
	requires_ntnet_feature: 3,
	network_destination: "NTNRC server",
	ui_header: "ntnrc_idle.gif",
	available_on_ntnet: 1,
	tgui_id: "ntos_net_chat",
});

// ntnrc_client.dm:21
rt.def("/datum/computer_file/program/chatclient/proc/New", function New(f: Frame) {
	this.username = `DefaultUser${rand(100, 999)}`;
	return f.dot;
});

// ntnrc_client.dm:24
rt.def("/datum/computer_file/program/chatclient/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let user: Value = null, message: Value = null, C: Value = null, chan: Value = null, user_1: Value = null, password: Value = null, channel_title: Value = null, C_2: Value = null, response: Value = null, newname: Value = null, logname: Value = null, logfile: Value = null, logstring: Value = null, hard_drive: Value = null, newpassword: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return 1;
	}
	if (action === "PRG_speak") {
		f.dot = 1;
		if (!this.channel) {
			return 1;
		}
		user = f.usr;
		if (!(message = reject_bad_text((yield* g.op(f, "Prompt", [2], [null, null, "Enter message or leave blank to cancel: ", user, null])))) || !this.channel) {
			return f.dot;
		}
		this.channel.add_message(message, this.username);
		log_chat(`${user}/(${user.ckey}) as ${this.username} sent to ${this.channel.title}: ${message}`);
	} else if (action === "PRG_joinchannel") {
		f.dot = 1;
		for (chan of each(GLOB.ntnet_global.chat_channels, T("/datum/ntnet_conversation"))) {
			if (chan.id == text2num(rt.at(params, "id"))) {
				C = chan;
				break;
			}
		}
		if (!C) {
			return 1;
		}
		if (this.netadmin_mode) {
			this.channel = C;
			return 1;
		}
		if (C.password) {
			user_1 = f.usr;
			password = reject_bad_text((yield* g.op(f, "Prompt", [2], [null, null, "Access Denied. Enter password:", user_1, null])));
			if (C && password == C.password) {
				C.add_client(this);
				this.channel = C;
			}
			return 1;
		}
		C.add_client(this);
		this.channel = C;
	} else if (action === "PRG_leavechannel") {
		f.dot = 1;
		if (this.channel) {
			this.channel.remove_client(this);
		}
		this.channel = null;
	} else if (action === "PRG_newchannel") {
		f.dot = 1;
		user = f.usr;
		if (!(channel_title = reject_bad_text((yield* g.op(f, "Prompt", [2], [null, null, "Enter channel name or leave blank to cancel:", user, null]))))) {
			return f.dot;
		}
		(C_2 = (yield* new_(T("/datum/ntnet_conversation")))).add_client(this);
		C_2.operator = this;
		this.channel = C_2;
		C_2.title = channel_title;
	} else if (action === "PRG_toggleadmin") {
		f.dot = 1;
		if (this.netadmin_mode) {
			this.netadmin_mode = 0;
			if (this.channel) {
				this.channel.remove_client(this);
				this.channel = null;
			}
			return 1;
		}
		user = f.usr;
		if (this.can_run(f.usr, 1, 67)) {
			if (this.channel) {
				if ((response = (yield* alert(user, "Really engage admin-mode? You will be disconnected from your current channel!", "NTNRC Admin mode", "Yes", "No"))) == "Yes") {
					if (this.channel) {
						this.channel.remove_client(this);
						this.channel = null;
					}
				} else {
					return f.dot;
				}
			}
			this.netadmin_mode = 1;
		}
	} else if (action === "PRG_changename") {
		f.dot = 1;
		user = f.usr;
		if (!(newname = sanitize((yield* g.op(f, "Prompt", [2], [null, null, "Enter new nickname or leave blank to cancel:", user, null]))))) {
			return 1;
		}
		if (this.channel) {
			this.channel.add_status_message(`${this.username} is now known as ${newname}.`);
		}
		this.username = newname;
	} else if (action === "PRG_savelog") {
		f.dot = 1;
		if (!this.channel) {
			return f.dot;
		}
		user = f.usr;
		if (!(logname = (yield* g.op(f, "Prompt", [2], [null, null, "Enter desired logfile name (.log) or leave blank to cancel:", user, null]))) || !this.channel) {
			return 1;
		}
		(logfile = (yield* new_(T("/datum/computer_file/data/logfile")))).filename = logname;
		logfile.stored_data = `[b]Logfile dump from NTNRC channel ${this.channel.title}[/b][BR]`;
		for (logstring of each(this.channel.messages)) {
			logfile.stored_data += `${logstring}[BR]`;
		}
		logfile.stored_data += "[b]Logfile dump completed.[/b]";
		logfile.calculate_size();
		hard_drive = rt.index(this.computer.all_components, "HDD");
		if (!this.computer || !hard_drive || !hard_drive.store_file(logfile)) {
			if (!this.computer) {
				CRASH("Var computer is null!");
				return 1;
			}
			if (!hard_drive) {
				this.computer.visible_message(fmt("＄！ shows an \"I/O Error - Hard drive connection error\" warning.", [this.computer]));
			} else {
				this.computer.visible_message(fmt("＄！ shows an \"I/O Error - Hard drive may be full. Please free some space and try again. Required space: ＀GQ\" warning.", [this.computer, rt.fv(f, "size", logfile)]));
			}
		}
	} else if (action === "PRG_renamechannel") {
		f.dot = 1;
		if (!this.operator_mode || !this.channel) {
			return 1;
		}
		user = f.usr;
		if (!(newname = reject_bad_text((yield* g.op(f, "Prompt", [2], [null, null, "Enter new channel name or leave blank to cancel:", user, null])))) || !this.channel) {
			return f.dot;
		}
		this.channel.add_status_message(`Channel renamed from ${this.channel.title} to ${newname} by operator.`);
		this.channel.title = newname;
	} else if (action === "PRG_deletechannel") {
		f.dot = 1;
		if (this.channel && (this.channel.operator == this || this.netadmin_mode)) {
			yield* qdel(this.channel);
			this.channel = null;
		}
	} else if (action === "PRG_setpassword") {
		f.dot = 1;
		if (!this.channel || this.channel.operator != this && !this.netadmin_mode) {
			return 1;
		}
		user = f.usr;
		newpassword = sanitize((yield* g.op(f, "Prompt", [2], [null, null, "Enter new password for this channel. Leave blank to cancel, enter 'nopassword' to remove password completely:", user, null])));
		if (!this.channel || !newpassword || this.channel.operator != this && !this.netadmin_mode) {
			return 1;
		}
		if (newpassword == "nopassword") {
			this.channel.password = "";
		} else {
			this.channel.password = newpassword;
		}
	}
	return f.dot;
}, true);

// ntnrc_client.dm:165
rt.def("/datum/computer_file/program/chatclient/proc/process_tick", function process_tick(f: Frame) {
	let $0: any;
	parent_proc();
	if (this.program_state != 0) {
		this.ui_header = "ntnrc_idle.gif";
		if (this.channel) {
			if (rt.len(f, this.channel.messages)) {
				$0 = rt.index(this.channel.messages, rt.len(f, this.channel.messages) - 1);
			} else {
				$0 = null;
			}
			this.last_message = $0;
		} else {
			this.last_message = null;
		}
		return 1;
	}
	if (this.channel && this.channel.messages && rt.len(f, this.channel.messages)) {
		if (this.last_message == rt.index(this.channel.messages, rt.len(f, this.channel.messages) - 1)) {
			$0 = "ntnrc_idle.gif";
		} else {
			$0 = "ntnrc_new.gif";
		}
		this.ui_header = $0;
	} else {
		this.ui_header = "ntnrc_idle.gif";
	}
	return f.dot;
});

// ntnrc_client.dm:181
rt.def("/datum/computer_file/program/chatclient/proc/kill_program", function kill_program(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (this.channel) {
		this.channel.remove_client(this);
		this.channel = null;
	}
	parent_proc();
	return f.dot;
}, false, { args: ["forced"] });

// ntnrc_client.dm:186
rt.def("/datum/computer_file/program/chatclient/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let messages: Value = null, M: Value = null, clients: Value = null, C: Value = null, cl: Value = null, all_channels: Value = null, C_2: Value = null, conv: Value = null;
	let $e: any;
	if (!GLOB.ntnet_global || !GLOB.ntnet_global.chat_channels) {
		return f.dot;
	}
	let data: Value = list();
	rt.setAt((data = this.get_header_data()), "adminmode", this.netadmin_mode);
	if (this.channel) {
		rt.setAt(data, "title", this.channel.title);
		messages = rt.op(f, "CreateMultidimensionalList", [1], [0]);
		for (M of each(this.channel.messages)) {
			messages.Add(list(rt.alist(f, ["msg", M])));
		}
		rt.setAt(data, "messages", messages);
		clients = rt.op(f, "CreateMultidimensionalList", [1], [0]);
		for (C of each(this.channel.clients)) {
			cl = C;
			clients.Add(list(rt.alist(f, ["name", cl.username])));
		}
		rt.setAt(data, "clients", clients);
		this.operator_mode = this.channel.operator == this ? 1 : 0;
		rt.setAt(data, "is_operator", (this.operator_mode || this.netadmin_mode));
	} else {
		all_channels = rt.op(f, "CreateMultidimensionalList", [1], [0]);
		for (C_2 of each(GLOB.ntnet_global.chat_channels)) {
			if ((conv = C_2) && conv.title) {
				all_channels.Add(list(rt.alist(f, ["chan", conv.title, "id", conv.id])));
			}
		}
		rt.setAt(data, "all_channels", all_channels);
	}
	return data;
});
