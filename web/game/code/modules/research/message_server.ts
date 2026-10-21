// From code/modules/research/message_server.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalmessage_servers  (code/modules/research/message_server.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalmessage_servers", function InitGlobalmessage_servers(f: Frame) {
	rt.setGl("message_servers", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "message_servers", add);
	return f.dot;
});

rt.type(4179, "/datum/data_pda_msg", "/datum", {
	recipient: "Unspecified",
	sender: "Unspecified",
	message: "Blank",
	photo: null,
});

// /datum/data_pda_msg/proc/New  (code/modules/research/message_server.dm:12)
rt.def("/datum/data_pda_msg/proc/New", function New(f: Frame, param_rec: Value, param_sender: Value, param_message: Value, param_photo: Value) {
	f.vars = () => [param_rec, param_sender, param_message, param_photo];
	if (live(param_rec) === null) {
		param_rec = "";
	}
	if (live(param_sender) === null) {
		param_sender = "";
	}
	if (live(param_message) === null) {
		param_message = "";
	}
	if (live(param_photo) === null) {
		param_photo = null;
	}
	if (truthy(live(param_rec))) {
		rt.setSv(f, "recipient", live(param_rec));
	}
	if (truthy(live(param_sender))) {
		rt.setSv(f, "sender", live(param_sender));
	}
	if (truthy(live(param_message))) {
		rt.setSv(f, "message", live(param_message));
	}
	if (!truthy(live(param_photo))) return f.dot;
	rt.setSv(f, "photo", live(param_photo));
	return f.dot;
});

// /datum/data_pda_msg/proc/get_photo_ref  (code/modules/research/message_server.dm:22)
rt.def("/datum/data_pda_msg/proc/get_photo_ref", function get_photo_ref(f: Frame) {
	if (truthy(rt.sv(f, "photo"))) {
		return fmt("<a href='byond://?src=＃;photo=1'>(Photo)</a>", [live(f.src)]);
	}
	return "";
});

// /datum/data_pda_msg/proc/Topic  (code/modules/research/message_server.dm:26)
rt.def("/datum/data_pda_msg/proc/Topic", function Topic(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.at(live(f.args[1]), "photo"))) return f.dot;
	rt.op(f, "BrowseResource", [], [(M = live(f.usr)), rt.sv(f, "photo"), "pda_photo.png"], false);
	rt.op(f, "Browse", [], [live(M), "<html><head><title>PDA Photo</title></head><body style='overflow:hidden;margin:0;text-align:center'><img src='pda_photo.png' width='192' style='-ms-interpolation-mode:nearest-neighbor' /></body></html>", "window=book;size=192x192"], false);
	rt.call(f, P("/proc/onclose"), null, [live(M), "PDA Photo"]);
	return f.dot;
}, false, { args: ["href", "href_list"] });

rt.type(4180, "/datum/data_rc_msg", "/datum", {
	rec_dpt: "Unspecified",
	send_dpt: "Unspecified",
	message: "Blank",
	stamp: "Unstamped",
	id_auth: "Unauthenticated",
	priority: "Normal",
});

// /datum/data_rc_msg/proc/New  (code/modules/research/message_server.dm:46)
rt.def("/datum/data_rc_msg/proc/New", function New(f: Frame, param_rec: Value, param_sender: Value, param_message: Value, param_stamp: Value, param_id_auth: Value, param_priority: Value) {
	let $0: any;
	f.vars = () => [param_rec, param_sender, param_message, param_stamp, param_id_auth, $0];
	if (live(param_rec) === null) {
		param_rec = "";
	}
	if (live(param_sender) === null) {
		param_sender = "";
	}
	if (live(param_message) === null) {
		param_message = "";
	}
	if (live(param_stamp) === null) {
		param_stamp = "";
	}
	if (live(param_id_auth) === null) {
		param_id_auth = "";
	}
	if (truthy(live(param_rec))) {
		rt.setSv(f, "rec_dpt", live(param_rec));
	}
	if (truthy(live(param_sender))) {
		rt.setSv(f, "send_dpt", live(param_sender));
	}
	if (truthy(live(param_message))) {
		rt.setSv(f, "message", live(param_message));
	}
	if (truthy(live(param_stamp))) {
		rt.setSv(f, "stamp", live(param_stamp));
	}
	if (truthy(live(param_id_auth))) {
		rt.setSv(f, "id_auth", live(param_id_auth));
	}
	if (!truthy(live(param_priority))) return f.dot;
	$0 = live(param_priority);
	if ($0 === 1) {
		rt.setSv(f, "priority", "Normal");
	} else if ($0 === 2) {
		rt.setSv(f, "priority", "High");
	} else if ($0 === 3) {
		rt.setSv(f, "priority", "Extreme");
	} else {
		rt.setSv(f, "priority", "Undetermined");
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

// /obj/machinery/message_server/proc/<init>  (code/modules/research/message_server.dm:76)
rt.def("/obj/machinery/message_server/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "pda_msgs", rt.list());
	$0 = $0;
	rt.setSv(f, "rc_msgs", rt.list());
	return f.dot;
});

// /obj/machinery/message_server/proc/Initialize  (code/modules/research/message_server.dm:82)  may sleep
rt.def("/obj/machinery/message_server/proc/Initialize", function* Initialize(f: Frame) {
	rt.modGl("message_servers", live(f.src), add);
	rt.setSv(f, "decryptkey", (yield* g.srcCall(f, "GenerateKey")));
	yield* g.srcCall(f, "send_pda_message", "System Administrator", "system", "This is an automated message. The messaging system is functioning correctly.");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/message_server/proc/Destroy  (code/modules/research/message_server.dm:88)  may sleep
rt.def("/obj/machinery/message_server/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("message_servers", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/message_server/proc/GenerateKey  (code/modules/research/message_server.dm:94)
rt.def("/obj/machinery/message_server/proc/GenerateKey", function GenerateKey(f: Frame) {
	let newKey: Value = null;
	f.vars = () => [newKey];
	newKey = null;
	newKey = rt.modify(live(newKey), rt.op(f, "PickUnweighted", [19], ["the", "if", "of", "as", "in", "a", "you", "from", "to", "an", "too", "little", "snow", "dead", "drunk", "rosebud", "duck", "al", "le"]), add);
	newKey = rt.modify(live(newKey), rt.op(f, "PickUnweighted", [18], ["diamond", "beer", "mushroom", "assistant", "clown", "captain", "twinkie", "security", "nuke", "small", "big", "escape", "yellow", "gloves", "monkey", "engine", "nuclear", "ai"]), add);
	return (newKey = rt.modify(live(newKey), rt.op(f, "PickUnweighted", [10], ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]), add));
});

// /obj/machinery/message_server/proc/process  (code/modules/research/message_server.dm:102)
rt.def("/obj/machinery/message_server/proc/process", function process(f: Frame) {
	if ((truthy(rt.sv(f, "active")) && truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		rt.setSv(f, "active", 0);
		return live(f.dot);
	}
	rt.callSrc(f, "update_icon", []);
	return live(f.dot);
}, false, { waitfor: false });

// /obj/machinery/message_server/proc/send_pda_message  (code/modules/research/message_server.dm:109)
rt.def("/obj/machinery/message_server/proc/send_pda_message", function send_pda_message(f: Frame, recipient: Value, sender: Value, message: Value, photo: Value) {
	f.vars = () => [recipient, sender, message, photo];
	if (live(recipient) === null) {
		recipient = "";
	}
	if (live(sender) === null) {
		sender = "";
	}
	if (live(message) === null) {
		message = "";
	}
	if (live(photo) === null) {
		photo = null;
	}
	f.dot = rt.new_(f, T("/datum/data_pda_msg"), [live(recipient), live(sender), live(message), live(photo)]);
	rt.modSrcVar(f, "pda_msgs", live(f.dot), add);
	return f.dot;
});

// /obj/machinery/message_server/proc/send_rc_message  (code/modules/research/message_server.dm:113)
rt.def("/obj/machinery/message_server/proc/send_rc_message", function send_rc_message(f: Frame, recipient: Value, sender: Value, message: Value, stamp: Value, id_auth: Value, priority: Value) {
	f.vars = () => [recipient, sender, message, stamp, id_auth, priority];
	if (live(recipient) === null) {
		recipient = "";
	}
	if (live(sender) === null) {
		sender = "";
	}
	if (live(message) === null) {
		message = "";
	}
	if (live(stamp) === null) {
		stamp = "";
	}
	if (live(id_auth) === null) {
		id_auth = "";
	}
	if (live(priority) === null) {
		priority = 1;
	}
	rt.modSrcVar(f, "rc_msgs", rt.new_(f, T("/datum/data_rc_msg"), [live(recipient), live(sender), live(message), live(stamp), live(id_auth)]), add);
	return f.dot;
});

// /obj/machinery/message_server/proc/attack_hand  (code/modules/research/message_server.dm:116)
rt.def("/obj/machinery/message_server/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	$0 = live(user);
	if (truthy(rt.sv(f, "active"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	if (truthy(rt.sv(f, "active"))) {
		$2 = "Off";
	} else {
		$2 = "On";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You toggle PDA message passing from ＀ to ＀", [$1, $2])]);
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	rt.callSrc(f, "update_icon", []);
	return live(f.dot);
});

// /obj/machinery/message_server/proc/update_icon  (code/modules/research/message_server.dm:123)
rt.def("/obj/machinery/message_server/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		rt.setSv(f, "icon_state", "server-nopower");
	} else {
		if (!truthy(rt.sv(f, "active"))) {
			rt.setSv(f, "icon_state", "server-off");
		} else {
			rt.setSv(f, "icon_state", "server-on");
		}
	}
	return live(f.dot);
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

// /obj/machinery/blackbox_recorder/proc/<init>  (code/modules/research/message_server.dm:141)
rt.def("/obj/machinery/blackbox_recorder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 70]));
	return f.dot;
});
