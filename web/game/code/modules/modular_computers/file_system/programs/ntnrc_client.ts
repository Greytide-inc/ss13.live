// From code/modules/modular_computers/file_system/programs/ntnrc_client.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/computer_file/program/chatclient/proc/New  (code/modules/modular_computers/file_system/programs/ntnrc_client.dm:21)
rt.def("/datum/computer_file/program/chatclient/proc/New", function New(f: Frame) {
	rt.setSv(f, "username", fmt("DefaultUser＀", [rt.call(f, P("/proc/rand"), null, [100, 999])]));
	return f.dot;
});

// /datum/computer_file/program/chatclient/proc/ui_act  (code/modules/modular_computers/file_system/programs/ntnrc_client.dm:24)  may sleep
rt.def("/datum/computer_file/program/chatclient/proc/ui_act", function* ui_act(f: Frame) {
	let user: Value = null, message: Value = null, C: Value = null, chan: Value = null, user_1: Value = null, password: Value = null, channel_title: Value = null, C_2: Value = null, response: Value = null, newname: Value = null, logname: Value = null, logfile: Value = null, logstring: Value = null, hard_drive: Value = null, newpassword: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, message, C, chan, user_1, password, channel_title, C_2, response, newname, logname, logfile, logstring, hard_drive, newpassword, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	$0 = live(f.args[0]);
	if ($0 === "PRG_speak") {
		f.dot = 1;
		if (!truthy(rt.sv(f, "channel"))) {
			return 1;
		}
		user = live(f.usr);
		if ((!truthy((message = (yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [2], [null, null, "Enter message or leave blank to cancel: ", live(user), null]))])))) || !truthy(rt.sv(f, "channel")))) {
			return live(f.dot);
		}
		yield* g.callName(f, rt.sv(f, "channel"), "add_message", [live(message), rt.sv(f, "username")]);
		yield* g.call(f, P("/proc/log_chat"), null, [fmt("＀/(＀) as ＀ sent to ＀: ＀", [live(user), rt.fv(f, "ckey", live(user)), rt.sv(f, "username"), rt.fv(f, "title", rt.sv(f, "channel")), live(message)])]);
	} else if ($0 === "PRG_joinchannel") {
		f.dot = 1;
		C = null;
		chan = null;
		rt.forList(f, 0, rt.fv(f, "chat_channels", rt.gl("ntnet_global")), T("/datum/ntnet_conversation"));
		while (($e = rt.next(f, 0)) !== undefined) {
			chan = $e;
			if (isEqual(rt.fv(f, "id", live(chan)), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "id")])))) {
				C = live(chan);
				break;
			}
		}
		rt.endFor(f, 0);
		if (!truthy(live(C))) {
			return 1;
		}
		if (truthy(rt.sv(f, "netadmin_mode"))) {
			rt.setSv(f, "channel", live(C));
			return 1;
		}
		if (truthy(rt.fv(f, "password", live(C)))) {
			user_1 = live(f.usr);
			password = (yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [2], [null, null, "Access Denied. Enter password:", live(user_1), null]))]));
			if ((truthy(live(C)) && isEqual(live(password), rt.fv(f, "password", live(C))))) {
				yield* g.callName(f, live(C), "add_client", [live(f.src)]);
				rt.setSv(f, "channel", live(C));
			}
			return 1;
		}
		yield* g.callName(f, live(C), "add_client", [live(f.src)]);
		rt.setSv(f, "channel", live(C));
	} else if ($0 === "PRG_leavechannel") {
		f.dot = 1;
		if (truthy(rt.sv(f, "channel"))) {
			yield* g.callName(f, rt.sv(f, "channel"), "remove_client", [live(f.src)]);
		}
		rt.setSv(f, "channel", null);
	} else if ($0 === "PRG_newchannel") {
		f.dot = 1;
		user = live(f.usr);
		if (!truthy((channel_title = (yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [2], [null, null, "Enter channel name or leave blank to cancel:", live(user), null]))]))))) {
			return live(f.dot);
		}
		yield* g.callName(f, (C_2 = (yield* g.new_(f, T("/datum/ntnet_conversation"), []))), "add_client", [live(f.src)]);
		rt.setFv(f, "operator", live(C_2), live(f.src));
		rt.setSv(f, "channel", live(C_2));
		rt.setFv(f, "title", live(C_2), live(channel_title));
	} else if ($0 === "PRG_toggleadmin") {
		f.dot = 1;
		if (truthy(rt.sv(f, "netadmin_mode"))) {
			rt.setSv(f, "netadmin_mode", 0);
			if (truthy(rt.sv(f, "channel"))) {
				yield* g.callName(f, rt.sv(f, "channel"), "remove_client", [live(f.src)]);
				rt.setSv(f, "channel", null);
			}
			return 1;
		}
		user = live(f.usr);
		if (truthy((yield* g.srcCall(f, "can_run", live(f.usr), 1, 67)))) {
			if (truthy(rt.sv(f, "channel"))) {
				if (isEqual((response = (yield* g.call(f, P("/proc/alert"), null, [live(user), "Really engage admin-mode? You will be disconnected from your current channel!", "NTNRC Admin mode", "Yes", "No"]))), "Yes")) {
					if (truthy(rt.sv(f, "channel"))) {
						yield* g.callName(f, rt.sv(f, "channel"), "remove_client", [live(f.src)]);
						rt.setSv(f, "channel", null);
					}
				} else {
					return live(f.dot);
				}
			}
			rt.setSv(f, "netadmin_mode", 1);
		}
	} else if ($0 === "PRG_changename") {
		f.dot = 1;
		user = live(f.usr);
		if (!truthy((newname = (yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [2], [null, null, "Enter new nickname or leave blank to cancel:", live(user), null]))]))))) {
			return 1;
		}
		if (truthy(rt.sv(f, "channel"))) {
			yield* g.callName(f, rt.sv(f, "channel"), "add_status_message", [fmt("＀ is now known as ＀.", [rt.sv(f, "username"), live(newname)])]);
		}
		rt.setSv(f, "username", live(newname));
	} else if ($0 === "PRG_savelog") {
		f.dot = 1;
		if (!truthy(rt.sv(f, "channel"))) {
			return live(f.dot);
		}
		user = live(f.usr);
		if ((!truthy((logname = (yield* g.op(f, "Prompt", [2], [null, null, "Enter desired logfile name (.log) or leave blank to cancel:", live(user), null])))) || !truthy(rt.sv(f, "channel")))) {
			return 1;
		}
		rt.setFv(f, "filename", (logfile = (yield* g.new_(f, T("/datum/computer_file/data/logfile"), []))), live(logname));
		rt.setFv(f, "stored_data", live(logfile), fmt("[b]Logfile dump from NTNRC channel ＀[/b][BR]", [rt.fv(f, "title", rt.sv(f, "channel"))]));
		logstring = null;
		rt.forList(f, 0, rt.fv(f, "messages", rt.sv(f, "channel")));
		while (($e = rt.next(f, 0)) !== undefined) {
			logstring = $e;
			rt.modField(f, live(logfile), "stored_data", fmt("＀[BR]", [live(logstring)]), add);
		}
		rt.endFor(f, 0);
		rt.modField(f, live(logfile), "stored_data", "[b]Logfile dump completed.[/b]", add);
		yield* g.callName(f, live(logfile), "calculate_size", []);
		hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "HDD");
		if (((!truthy(rt.sv(f, "computer")) || !truthy(live(hard_drive))) || !truthy((yield* g.callName(f, live(hard_drive), "store_file", [live(logfile)]))))) {
			if (!truthy(rt.sv(f, "computer"))) {
				yield* g.call(f, P("/proc/CRASH"), null, ["Var computer is null!"]);
				return 1;
			}
			if (!truthy(live(hard_drive))) {
				yield* g.callName(f, rt.sv(f, "computer"), "visible_message", [fmt("＄！ shows an \"I/O Error - Hard drive connection error\" warning.", [rt.sv(f, "computer")])]);
			} else {
				yield* g.callName(f, rt.sv(f, "computer"), "visible_message", [fmt("＄！ shows an \"I/O Error - Hard drive may be full. Please free some space and try again. Required space: ＀GQ\" warning.", [rt.sv(f, "computer"), rt.fv(f, "size", live(logfile))])]);
			}
		}
	} else if ($0 === "PRG_renamechannel") {
		f.dot = 1;
		if ((!truthy(rt.sv(f, "operator_mode")) || !truthy(rt.sv(f, "channel")))) {
			return 1;
		}
		user = live(f.usr);
		if ((!truthy((newname = (yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [2], [null, null, "Enter new channel name or leave blank to cancel:", live(user), null]))])))) || !truthy(rt.sv(f, "channel")))) {
			return live(f.dot);
		}
		yield* g.callName(f, rt.sv(f, "channel"), "add_status_message", [fmt("Channel renamed from ＀ to ＀ by operator.", [rt.fv(f, "title", rt.sv(f, "channel")), live(newname)])]);
		rt.setFv(f, "title", rt.sv(f, "channel"), live(newname));
	} else if ($0 === "PRG_deletechannel") {
		f.dot = 1;
		if ((truthy(rt.sv(f, "channel")) && (isEqual(rt.fv(f, "operator", rt.sv(f, "channel")), live(f.src)) || truthy(rt.sv(f, "netadmin_mode"))))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "channel")]);
			rt.setSv(f, "channel", null);
		}
	} else if ($0 === "PRG_setpassword") {
		f.dot = 1;
		if ((!truthy(rt.sv(f, "channel")) || (!isEqual(rt.fv(f, "operator", rt.sv(f, "channel")), live(f.src)) && !truthy(rt.sv(f, "netadmin_mode"))))) {
			return 1;
		}
		user = live(f.usr);
		newpassword = (yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [2], [null, null, "Enter new password for this channel. Leave blank to cancel, enter 'nopassword' to remove password completely:", live(user), null]))]));
		if (((!truthy(rt.sv(f, "channel")) || !truthy(live(newpassword))) || (!isEqual(rt.fv(f, "operator", rt.sv(f, "channel")), live(f.src)) && !truthy(rt.sv(f, "netadmin_mode"))))) {
			return 1;
		}
		if (isEqual(live(newpassword), "nopassword")) {
			rt.setFv(f, "password", rt.sv(f, "channel"), "");
		} else {
			rt.setFv(f, "password", rt.sv(f, "channel"), live(newpassword));
		}
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /datum/computer_file/program/chatclient/proc/process_tick  (code/modules/modular_computers/file_system/programs/ntnrc_client.dm:165)
rt.def("/datum/computer_file/program/chatclient/proc/process_tick", function process_tick(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.sv(f, "program_state"), 0)) {
		rt.setSv(f, "ui_header", "ntnrc_idle.gif");
		if (truthy(rt.sv(f, "channel"))) {
			if (truthy(rt.getLen(f, rt.fv(f, "messages", rt.sv(f, "channel"))))) {
				$0 = rt.index(rt.fv(f, "messages", rt.sv(f, "channel")), subtract(rt.getLen(f, rt.fv(f, "messages", rt.sv(f, "channel"))), 1));
			} else {
				$0 = null;
			}
			rt.setSv(f, "last_message", $0);
		} else {
			rt.setSv(f, "last_message", null);
		}
		return 1;
	}
	if (((truthy(rt.sv(f, "channel")) && truthy(rt.fv(f, "messages", rt.sv(f, "channel")))) && truthy(rt.getLen(f, rt.fv(f, "messages", rt.sv(f, "channel")))))) {
		if (isEqual(rt.sv(f, "last_message"), rt.index(rt.fv(f, "messages", rt.sv(f, "channel")), subtract(rt.getLen(f, rt.fv(f, "messages", rt.sv(f, "channel"))), 1)))) {
			$0 = "ntnrc_idle.gif";
		} else {
			$0 = "ntnrc_new.gif";
		}
		rt.setSv(f, "ui_header", $0);
	} else {
		rt.setSv(f, "ui_header", "ntnrc_idle.gif");
	}
	return f.dot;
});

// /datum/computer_file/program/chatclient/proc/kill_program  (code/modules/modular_computers/file_system/programs/ntnrc_client.dm:181)
rt.def("/datum/computer_file/program/chatclient/proc/kill_program", function kill_program(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (truthy(rt.sv(f, "channel"))) {
		rt.callName(f, rt.sv(f, "channel"), "remove_client", [live(f.src)]);
		rt.setSv(f, "channel", null);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["forced"] });

// /datum/computer_file/program/chatclient/proc/ui_data  (code/modules/modular_computers/file_system/programs/ntnrc_client.dm:186)
rt.def("/datum/computer_file/program/chatclient/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, messages: Value = null, M: Value = null, clients: Value = null, C: Value = null, cl: Value = null, all_channels: Value = null, C_2: Value = null, conv: Value = null;
	let $0: any, $e: any;
	f.vars = () => [data, messages, M, clients, C, cl, all_channels, C_2, conv, $0, $e];
	if ((!truthy(rt.gl("ntnet_global")) || !truthy(rt.fv(f, "chat_channels", rt.gl("ntnet_global"))))) {
		return live(f.dot);
	}
	data = rt.list();
	rt.setAt((data = rt.callSrc(f, "get_header_data", [])), "adminmode", rt.sv(f, "netadmin_mode"));
	if (truthy(rt.sv(f, "channel"))) {
		rt.setAt(live(data), "title", rt.fv(f, "title", rt.sv(f, "channel")));
		messages = rt.op(f, "CreateMultidimensionalList", [1], [0]);
		M = null;
		rt.forList(f, 0, rt.fv(f, "messages", rt.sv(f, "channel")));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			rt.callName(f, live(messages), "Add", [rt.list(rt.alist(f, ["msg", live(M)]))]);
		}
		rt.endFor(f, 0);
		rt.setAt(live(data), "messages", live(messages));
		clients = rt.op(f, "CreateMultidimensionalList", [1], [0]);
		C = null;
		rt.forList(f, 0, rt.fv(f, "clients", rt.sv(f, "channel")));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			cl = live(C);
			rt.callName(f, live(clients), "Add", [rt.list(rt.alist(f, ["name", rt.fv(f, "username", live(cl))]))]);
		}
		rt.endFor(f, 0);
		rt.setAt(live(data), "clients", live(clients));
		if (isEqual(rt.fv(f, "operator", rt.sv(f, "channel")), live(f.src))) {
			$0 = 1;
		} else {
			$0 = 0;
		}
		rt.setSv(f, "operator_mode", $0);
		rt.setAt(live(data), "is_operator", (rt.sv(f, "operator_mode") || rt.sv(f, "netadmin_mode")));
	} else {
		all_channels = rt.op(f, "CreateMultidimensionalList", [1], [0]);
		C_2 = null;
		rt.forList(f, 0, rt.fv(f, "chat_channels", rt.gl("ntnet_global")));
		while (($e = rt.next(f, 0)) !== undefined) {
			C_2 = $e;
			if ((truthy((conv = live(C_2))) && truthy(rt.fv(f, "title", live(conv))))) {
				rt.callName(f, live(all_channels), "Add", [rt.list(rt.alist(f, ["chan", rt.fv(f, "title", live(conv)), "id", rt.fv(f, "id", live(conv))]))]);
			}
		}
		rt.endFor(f, 0);
		rt.setAt(live(data), "all_channels", live(all_channels));
	}
	return live(data);
});
