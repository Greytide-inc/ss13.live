// From code/game/machinery/newscaster.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalnews_network  (code/game/machinery/newscaster.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalnews_network", function InitGlobalnews_network(f: Frame) {
	rt.setGl("news_network", rt.new_(f, T("/datum/newscaster/feed_network"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "news_network", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalallCasters  (code/game/machinery/newscaster.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalallCasters", function InitGlobalallCasters(f: Frame) {
	rt.setGl("allCasters", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "allCasters", add);
	return f.dot;
});

rt.type(1494, "/datum/newscaster/feed_message", "/datum/newscaster", {
	author: "",
	body: "",
	authorCensorTime: null,
	bodyCensorTime: null,
	is_admin_message: 0,
	img: null,
	time_stamp: "",
	comments: null,
	locked: 0,
	caption: "",
	creationTime: null,
	authorCensor: null,
	bodyCensor: null,
});

// /datum/newscaster/feed_message/proc/<init>  (code/game/machinery/newscaster.dm:14)
rt.def("/datum/newscaster/feed_message/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "authorCensorTime", rt.list());
	$0 = $0;
	rt.setSv(f, "bodyCensorTime", rt.list());
	$0 = $0;
	rt.setSv(f, "comments", rt.list());
	return f.dot;
});

// /datum/newscaster/feed_message/proc/returnAuthor  (code/game/machinery/newscaster.dm:27)
rt.def("/datum/newscaster/feed_message/proc/returnAuthor", function returnAuthor(f: Frame, censor: Value) {
	let txt: Value = null;
	f.vars = () => [censor, txt];
	if (isEqual(live(censor), -1)) {
		censor = rt.sv(f, "authorCensor");
	}
	txt = fmt("＀", [rt.fv(f, "redactedText", rt.gl("news_network"))]);
	if (!truthy(live(censor))) {
		txt = rt.sv(f, "author");
	}
	return live(txt);
});

// /datum/newscaster/feed_message/proc/returnBody  (code/game/machinery/newscaster.dm:35)
rt.def("/datum/newscaster/feed_message/proc/returnBody", function returnBody(f: Frame, censor: Value) {
	let txt: Value = null;
	f.vars = () => [censor, txt];
	if (isEqual(live(censor), -1)) {
		censor = rt.sv(f, "bodyCensor");
	}
	txt = fmt("＀", [rt.fv(f, "redactedText", rt.gl("news_network"))]);
	if (!truthy(live(censor))) {
		txt = rt.sv(f, "body");
	}
	return live(txt);
});

// /datum/newscaster/feed_message/proc/toggleCensorAuthor  (code/game/machinery/newscaster.dm:44)
rt.def("/datum/newscaster/feed_message/proc/toggleCensorAuthor", function toggleCensorAuthor(f: Frame) {
	if (truthy(rt.sv(f, "authorCensor"))) {
		rt.callName(f, rt.sv(f, "authorCensorTime"), "Add", [multiply(rt.fv(f, "lastAction", rt.gl("news_network")), -1)]);
	} else {
		rt.callName(f, rt.sv(f, "authorCensorTime"), "Add", [rt.fv(f, "lastAction", rt.gl("news_network"))]);
	}
	rt.setSv(f, "authorCensor", (!truthy(rt.sv(f, "authorCensor")) ? 1 : 0));
	rt.incField(f, rt.gl("news_network"), "lastAction", 1, true);
	return f.dot;
});

// /datum/newscaster/feed_message/proc/toggleCensorBody  (code/game/machinery/newscaster.dm:52)
rt.def("/datum/newscaster/feed_message/proc/toggleCensorBody", function toggleCensorBody(f: Frame) {
	if (truthy(rt.sv(f, "bodyCensor"))) {
		rt.callName(f, rt.sv(f, "bodyCensorTime"), "Add", [multiply(rt.fv(f, "lastAction", rt.gl("news_network")), -1)]);
	} else {
		rt.callName(f, rt.sv(f, "bodyCensorTime"), "Add", [rt.fv(f, "lastAction", rt.gl("news_network"))]);
	}
	rt.setSv(f, "bodyCensor", (!truthy(rt.sv(f, "bodyCensor")) ? 1 : 0));
	rt.incField(f, rt.gl("news_network"), "lastAction", 1, true);
	return f.dot;
});

rt.type(1495, "/datum/newscaster/feed_channel", "/datum/newscaster", {
	channel_name: "",
	messages: null,
	locked: 0,
	author: "",
	censored: 0,
	authorCensorTime: null,
	DclassCensorTime: null,
	authorCensor: null,
	is_admin_channel: 0,
});

// /datum/newscaster/feed_channel/proc/<init>  (code/game/machinery/newscaster.dm:60)
rt.def("/datum/newscaster/feed_channel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "messages", rt.list());
	$0 = $0;
	rt.setSv(f, "authorCensorTime", rt.list());
	$0 = $0;
	rt.setSv(f, "DclassCensorTime", rt.list());
	return f.dot;
});

// /datum/newscaster/feed_channel/proc/returnAuthor  (code/game/machinery/newscaster.dm:70)
rt.def("/datum/newscaster/feed_channel/proc/returnAuthor", function returnAuthor(f: Frame, censor: Value) {
	let txt: Value = null;
	f.vars = () => [censor, txt];
	if (isEqual(live(censor), -1)) {
		censor = rt.sv(f, "authorCensor");
	}
	txt = fmt("＀", [rt.fv(f, "redactedText", rt.gl("news_network"))]);
	if (!truthy(live(censor))) {
		txt = rt.sv(f, "author");
	}
	return live(txt);
});

// /datum/newscaster/feed_channel/proc/toggleCensorDclass  (code/game/machinery/newscaster.dm:79)
rt.def("/datum/newscaster/feed_channel/proc/toggleCensorDclass", function toggleCensorDclass(f: Frame) {
	if (truthy(rt.sv(f, "censored"))) {
		rt.callName(f, rt.sv(f, "DclassCensorTime"), "Add", [multiply(rt.fv(f, "lastAction", rt.gl("news_network")), -1)]);
	} else {
		rt.callName(f, rt.sv(f, "DclassCensorTime"), "Add", [rt.fv(f, "lastAction", rt.gl("news_network"))]);
	}
	rt.setSv(f, "censored", (!truthy(rt.sv(f, "censored")) ? 1 : 0));
	rt.incField(f, rt.gl("news_network"), "lastAction", 1, true);
	return f.dot;
});

// /datum/newscaster/feed_channel/proc/toggleCensorAuthor  (code/game/machinery/newscaster.dm:87)
rt.def("/datum/newscaster/feed_channel/proc/toggleCensorAuthor", function toggleCensorAuthor(f: Frame) {
	if (truthy(rt.sv(f, "authorCensor"))) {
		rt.callName(f, rt.sv(f, "authorCensorTime"), "Add", [multiply(rt.fv(f, "lastAction", rt.gl("news_network")), -1)]);
	} else {
		rt.callName(f, rt.sv(f, "authorCensorTime"), "Add", [rt.fv(f, "lastAction", rt.gl("news_network"))]);
	}
	rt.setSv(f, "authorCensor", (!truthy(rt.sv(f, "authorCensor")) ? 1 : 0));
	rt.incField(f, rt.gl("news_network"), "lastAction", 1, true);
	return f.dot;
});

rt.type(1497, "/datum/newscaster/feed_network", "/datum/newscaster", {
	network_channels: null,
	wanted_issue: null,
	lastAction: null,
	redactedText: "[REDACTED]",
});

// /datum/newscaster/feed_network/proc/<init>  (code/game/machinery/newscaster.dm:102)
rt.def("/datum/newscaster/feed_network/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "network_channels", rt.list());
	return f.dot;
});

// /datum/newscaster/feed_network/proc/New  (code/game/machinery/newscaster.dm:108)
rt.def("/datum/newscaster/feed_network/proc/New", function New(f: Frame) {
	rt.callSrc(f, "CreateFeedChannel", ["Station Announcements", "SS13", 1]);
	rt.setSv(f, "wanted_issue", rt.new_(f, T("/datum/newscaster/wanted_message"), []));
	return f.dot;
});

// /datum/newscaster/feed_network/proc/CreateFeedChannel  (code/game/machinery/newscaster.dm:112)
rt.def("/datum/newscaster/feed_network/proc/CreateFeedChannel", function CreateFeedChannel(f: Frame, channel_name: Value, author: Value, locked: Value, adminChannel: Value) {
	let newChannel: Value = null;
	f.vars = () => [adminChannel, newChannel];
	if (live(adminChannel) === null) {
		adminChannel = 0;
	}
	rt.setFv(f, "channel_name", (newChannel = rt.new_(f, T("/datum/newscaster/feed_channel"), [])), live(channel_name));
	rt.setFv(f, "author", live(newChannel), live(author));
	rt.setFv(f, "locked", live(newChannel), live(locked));
	rt.setFv(f, "is_admin_channel", live(newChannel), live(adminChannel));
	rt.modSrcVar(f, "network_channels", live(newChannel), add);
	return f.dot;
});

// /datum/newscaster/feed_network/proc/SubmitArticle  (code/game/machinery/newscaster.dm:120)  may sleep
rt.def("/datum/newscaster/feed_network/proc/SubmitArticle", function* SubmitArticle(f: Frame, msg: Value, author: Value, channel_name: Value, photo: Value, adminMessage: Value, allow_comments: Value) {
	let newMsg: Value = null, FC: Value = null, NEWSCASTER: Value = null;
	let $e: any;
	f.vars = () => [msg, author, channel_name, photo, adminMessage, allow_comments, newMsg, FC, NEWSCASTER, $e];
	if (live(adminMessage) === null) {
		adminMessage = 0;
	}
	if (live(allow_comments) === null) {
		allow_comments = 1;
	}
	rt.setFv(f, "author", (newMsg = (yield* g.new_(f, T("/datum/newscaster/feed_message"), []))), live(author));
	rt.setFv(f, "body", live(newMsg), live(msg));
	rt.setFv(f, "time_stamp", live(newMsg), fmt("＀", [(yield* g.call(f, P("/proc/worldtime2text"), null, []))]));
	rt.setFv(f, "is_admin_message", live(newMsg), live(adminMessage));
	rt.setFv(f, "locked", live(newMsg), (!truthy(live(allow_comments)) ? 1 : 0));
	if (truthy(live(photo))) {
		rt.setFv(f, "img", live(newMsg), rt.fv(f, "img", live(photo)));
		rt.setFv(f, "caption", live(newMsg), rt.fv(f, "scribble", live(photo)));
	}
	FC = null;
	rt.forList(f, 0, rt.sv(f, "network_channels"), T("/datum/newscaster/feed_channel"));
	while (($e = rt.next(f, 0)) !== undefined) {
		FC = $e;
		if (isEqual(rt.fv(f, "channel_name", live(FC)), live(channel_name))) {
			rt.modField(f, live(FC), "messages", live(newMsg), add);
			break;
		}
	}
	rt.endFor(f, 0);
	NEWSCASTER = null;
	rt.forList(f, 0, rt.gl("allCasters"), T("/obj/machinery/newscaster"));
	while (($e = rt.next(f, 0)) !== undefined) {
		NEWSCASTER = $e;
		yield* g.callName(f, live(NEWSCASTER), "newsAlert", [live(channel_name)]);
	}
	rt.endFor(f, 0);
	rt.incSrcVar(f, "lastAction", 1, true);
	rt.setFv(f, "creationTime", live(newMsg), rt.sv(f, "lastAction"));
	return f.dot;
}, true);

// /datum/newscaster/feed_network/proc/submitWanted  (code/game/machinery/newscaster.dm:139)  may sleep
rt.def("/datum/newscaster/feed_network/proc/submitWanted", function* submitWanted(f: Frame, criminal: Value, body: Value, scanned_user: Value, photo: Value, adminMsg: Value, newMessage: Value) {
	let N: Value = null;
	let $e: any;
	f.vars = () => [criminal, body, scanned_user, photo, adminMsg, newMessage, N, $e];
	if (live(adminMsg) === null) {
		adminMsg = 0;
	}
	if (live(newMessage) === null) {
		newMessage = 0;
	}
	rt.setFv(f, "active", rt.sv(f, "wanted_issue"), 1);
	rt.setFv(f, "criminal", rt.sv(f, "wanted_issue"), live(criminal));
	rt.setFv(f, "body", rt.sv(f, "wanted_issue"), live(body));
	rt.setFv(f, "scannedUser", rt.sv(f, "wanted_issue"), live(scanned_user));
	rt.setFv(f, "isAdminMsg", rt.sv(f, "wanted_issue"), live(adminMsg));
	if (truthy(live(photo))) {
		rt.setFv(f, "img", rt.sv(f, "wanted_issue"), rt.fv(f, "img", live(photo)));
	}
	if (!truthy(live(newMessage))) return f.dot;
	N = null;
	rt.forList(f, 0, rt.gl("allCasters"), T("/obj/machinery/newscaster"));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		yield* g.callName(f, live(N), "newsAlert", []);
		yield* g.callName(f, live(N), "update_icon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/newscaster/feed_network/proc/deleteWanted  (code/game/machinery/newscaster.dm:152)
rt.def("/datum/newscaster/feed_network/proc/deleteWanted", function deleteWanted(f: Frame) {
	let NEWSCASTER: Value = null;
	let $e: any;
	f.vars = () => [NEWSCASTER, $e];
	rt.setFv(f, "active", rt.sv(f, "wanted_issue"), 0);
	rt.setFv(f, "criminal", rt.sv(f, "wanted_issue"), null);
	rt.setFv(f, "body", rt.sv(f, "wanted_issue"), null);
	rt.setFv(f, "scannedUser", rt.sv(f, "wanted_issue"), null);
	rt.setFv(f, "img", rt.sv(f, "wanted_issue"), null);
	NEWSCASTER = null;
	rt.forList(f, 0, rt.gl("allCasters"), T("/obj/machinery/newscaster"));
	while (($e = rt.next(f, 0)) !== undefined) {
		NEWSCASTER = $e;
		rt.callName(f, live(NEWSCASTER), "update_icon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(9543, "/obj/item/wallframe/newscaster", "/obj/item/wallframe", {
	name: "newscaster frame",
	desc: "Used to build newscasters, just secure to the wall.",
	icon_state: "newscaster",
	materials: null,
	result_path: rt.typePath("/obj/machinery/newscaster"),
});

// /obj/item/wallframe/newscaster/proc/<init>  (code/game/machinery/newscaster.dm:166)
rt.def("/obj/item/wallframe/newscaster/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 14000, "$glass", 8000]));
	return f.dot;
});

rt.type(10808, "/obj/machinery/newscaster", "/obj/machinery", {
	screen: 0,
	paper_remaining: 15,
	securityCaster: 0,
	unit_no: 0,
	alert_delay: 500,
	alert: 0,
	scanned_user: "Unknown",
	msg: "",
	photo: null,
	channel_name: "",
	c_locked: 0,
	viewing_channel: null,
	allow_comments: 1,
	verb_say: "beeps",
	verb_ask: "beeps",
	verb_exclaim: "beeps",
	anchored: 1,
	name: "newscaster",
	desc: "A standard Nanotrasen-licensed newsfeed handler for use in commercial space stations. All the news you absolutely have no use for, in one place!",
	icon: rt.rsc("icons/obj/terminals.dmi"),
	icon_state: "newscaster_normal",
	armor: null,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 50,
});

// /obj/machinery/newscaster/proc/<init>  (code/game/machinery/newscaster.dm:178)
rt.def("/obj/machinery/newscaster/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]));
	return f.dot;
});

// /obj/machinery/newscaster/proc/New  (code/game/machinery/newscaster.dm:202)  may sleep
rt.def("/obj/machinery/newscaster/proc/New", function* New(f: Frame) {
	let NEWSCASTER: Value = null;
	let $0: any, $e: any;
	f.vars = () => [NEWSCASTER, $0, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[2]))) {
		yield* g.srcCall(f, "setDir", live(f.args[1]));
		if (truthy(rt.bitAnd(rt.sv(f, "dir"), 3))) {
			$0 = 0;
		} else {
			if (isEqual(rt.sv(f, "dir"), 4)) {
				$0 = -32;
			} else {
				$0 = 32;
			}
		}
		rt.setSv(f, "pixel_x", $0);
		if (truthy(rt.bitAnd(rt.sv(f, "dir"), 3))) {
			if (isEqual(rt.sv(f, "dir"), 1)) {
				$0 = -32;
			} else {
				$0 = 32;
			}
		} else {
			$0 = 0;
		}
		rt.setSv(f, "pixel_y", $0);
	}
	rt.modGl("allCasters", live(f.src), add);
	NEWSCASTER = null;
	rt.forList(f, 0, rt.gl("allCasters"), T("/obj/machinery/newscaster"));
	while (($e = rt.next(f, 0)) !== undefined) {
		NEWSCASTER = $e;
		rt.incSrcVar(f, "unit_no", 1, true);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["loc", "ndir", "building"] });

// /obj/machinery/newscaster/proc/Destroy  (code/game/machinery/newscaster.dm:214)  may sleep
rt.def("/obj/machinery/newscaster/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("allCasters", live(f.src), subtract));
	rt.setSv(f, "viewing_channel", null);
	rt.setSv(f, "photo", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/newscaster/proc/update_icon  (code/game/machinery/newscaster.dm:220)
rt.def("/obj/machinery/newscaster/proc/update_icon", function update_icon(f: Frame) {
	let hp_percent: Value = null;
	let $0: any;
	f.vars = () => [hp_percent, $0];
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		rt.setSv(f, "icon_state", "newscaster_off");
	} else {
		if (truthy(rt.gv(f, "active", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
			rt.setSv(f, "icon_state", "newscaster_wanted");
		} else {
			rt.setSv(f, "icon_state", "newscaster_normal");
			if (truthy(rt.sv(f, "alert"))) {
				rt.callSrc(f, "add_overlay", ["newscaster_alert"]);
			}
		}
	}
	$0 = (hp_percent = divide(multiply(rt.sv(f, "obj_integrity"), 100), rt.sv(f, "max_integrity")));
	if (rt.inRange($0, 75, 100)) {
		return live(f.dot);
	} else if (rt.inRange($0, 50, 75)) {
		rt.callSrc(f, "add_overlay", ["crack1"]);
	} else if (rt.inRange($0, 25, 50)) {
		rt.callSrc(f, "add_overlay", ["crack2"]);
	} else {
		rt.callSrc(f, "add_overlay", ["crack3"]);
	}
	return f.dot;
});

// /obj/machinery/newscaster/proc/power_change  (code/game/machinery/newscaster.dm:243)
rt.def("/obj/machinery/newscaster/proc/power_change", function power_change(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	if (truthy(rt.callSrc(f, "powered", []))) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		rt.callSrc(f, "update_icon", []);
	} else {
		rt.spawnTail(f, rt.call(f, P("/proc/rand"), null, [0, 15]), "/obj/machinery/newscaster/proc/power_change: spawn at game/machinery/newscaster.dm:247");
	}
	return f.dot;
});

// a spawn(rt.call(f, P("/proc/rand"), null, [0, 15])) body of /obj/machinery/newscaster/proc/power_change, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/newscaster/proc/power_change: spawn at game/machinery/newscaster.dm:247", function* (f: Frame) {
	(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	yield* g.srcCall(f, "update_icon");
	return null;
});

// /obj/machinery/newscaster/proc/take_damage  (code/game/machinery/newscaster.dm:254)  may sleep
rt.def("/obj/machinery/newscaster/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// /obj/machinery/newscaster/proc/attack_ai  (code/game/machinery/newscaster.dm:258)  may sleep
rt.def("/obj/machinery/newscaster/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/newscaster/proc/attack_hand  (code/game/machinery/newscaster.dm:261)  may sleep
rt.def("/obj/machinery/newscaster/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let human_or_robot_user: Value = null, dat: Value = null, wanted_already: Value = null, CHANNEL: Value = null, existing_authors: Value = null, FC: Value = null, check: Value = null, FC_4: Value = null, total_num: Value = null, active_num: Value = null, message_num: Value = null, FC_5: Value = null, i: Value = null, MESSAGE: Value = null, comment: Value = null, MESSAGE_2: Value = null, comment_3: Value = null, end_param: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	f.vars = () => [user, human_or_robot_user, dat, wanted_already, CHANNEL, existing_authors, FC, check, FC_4, total_num, active_num, message_num, FC_5, i, MESSAGE, comment, MESSAGE_2, comment_3, end_param, popup, $0, $1, $2, $3, $4, $5, $e];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!(truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)))) return f.dot;
	human_or_robot_user = live(user);
	dat = null;
	yield* g.srcCall(f, "scan_user", live(human_or_robot_user));
	$0 = rt.sv(f, "screen");
	if ($0 === 0) {
		dat = rt.modify(live(dat), fmt("Welcome to Newscasting Unit #＀.<BR> Interface & News networks Operational.", [rt.sv(f, "unit_no")]), add);
		dat = rt.modify(live(dat), "<BR><FONT SIZE=1>Property of Nanotrasen Inc</FONT>", add);
		if (truthy(rt.gv(f, "active", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
			dat = rt.modify(live(dat), fmt("<HR><A href='?src=＃;view_wanted=1'>Read Wanted Issue</A>", [live(f.src)]), add);
		}
		dat = rt.modify(live(dat), fmt("<HR><BR><A href='?src=＃;create_channel=1'>Create Feed Channel</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;view=1'>View Feed Channels</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;create_feed_story=1'>Submit new Feed story</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;menu_paper=1'>Print newspaper</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;refresh=1'>Re-scan User</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><BR><A href='?src=＃;mach_close=newscaster_main'>Exit</A>", [live(human_or_robot_user)]), add);
		if (truthy(rt.sv(f, "securityCaster"))) {
			wanted_already = 0;
			if (truthy(rt.gv(f, "active", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
				wanted_already = 1;
			}
			dat = rt.modify(live(dat), "<HR><B>Feed Security functions:</B><BR>", add);
			$0 = live(f.src);
			if (truthy(live(wanted_already))) {
				$1 = "Manage";
			} else {
				$1 = "Publish";
			}
			dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;menu_wanted=1'>＀ \"Wanted\" Issue</A>", [$0, $1]), add);
			dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;menu_censor_story=1'>Censor Feed Stories</A>", [live(f.src)]), add);
			dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;menu_censor_channel=1'>Mark Feed Channel with Nanotrasen D-Notice</A>", [live(f.src)]), add);
		}
		dat = rt.modify(live(dat), fmt("<BR><HR>The newscaster recognises you as: <FONT COLOR='green'>＀</FONT>", [rt.sv(f, "scanned_user")]), add);
	} else if ($0 === 1) {
		dat = rt.modify(live(dat), "Station Feed Channels<HR>", add);
		if (truthy((yield* g.call(f, P("/proc/isemptylist"), null, [rt.fv(f, "network_channels", rt.gl("news_network"))])))) {
			dat = rt.modify(live(dat), "<I>No active channels found...</I>", add);
		} else {
			CHANNEL = null;
			rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
			while (($e = rt.next(f, 0)) !== undefined) {
				CHANNEL = $e;
				if (truthy(rt.fv(f, "is_admin_channel", live(CHANNEL)))) {
					dat = rt.modify(live(dat), fmt("<B><FONT style='BACKGROUND-COLOR: LightGreen '><A href='?src=＃;show_channel=＃'>＀</A></FONT></B><BR>", [live(f.src), live(CHANNEL), rt.fv(f, "channel_name", live(CHANNEL))]), add);
				} else {
					$0 = live(f.src);
					$1 = live(CHANNEL);
					$2 = rt.fv(f, "channel_name", live(CHANNEL));
					if (truthy(rt.fv(f, "censored", live(CHANNEL)))) {
						$3 = "<FONT COLOR='red'>***</FONT>";
					} else {
						$3 = null;
					}
					dat = rt.modify(live(dat), fmt("<B><A href='?src=＃;show_channel=＃'>＀</A> ＀<BR></B>", [$0, $1, $2, $3]), add);
				}
			}
			rt.endFor(f, 0);
		}
		dat = rt.modify(live(dat), fmt("<BR><HR><A href='?src=＃;refresh=1'>Refresh</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Back</A>", [live(f.src), 0]), add);
	} else if ($0 === 2) {
		dat = rt.modify(live(dat), "Creating new Feed Channel...", add);
		dat = rt.modify(live(dat), fmt("<HR><B><A href='?src=＃;set_channel_name=1'>Channel Name</A>:</B> ＀<BR>", [live(f.src), rt.sv(f, "channel_name")]), add);
		dat = rt.modify(live(dat), fmt("<B>Channel Author:</B> <FONT COLOR='green'>＀</FONT><BR>", [rt.sv(f, "scanned_user")]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "c_locked"))) {
			$1 = "NO";
		} else {
			$1 = "YES";
		}
		dat = rt.modify(live(dat), fmt("<B><A href='?src=＃;set_channel_lock=1'>Will Accept Public Feeds</A>:</B> ＀<BR><BR>", [$0, $1]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;submit_new_channel=1'>Submit</A><BR><BR><A href='?src=＃;setScreen=＀'>Cancel</A><BR>", [live(f.src), live(f.src), 0]), add);
	} else if ($0 === 3) {
		dat = rt.modify(live(dat), "Creating new Feed Message...", add);
		dat = rt.modify(live(dat), fmt("<HR><B><A href='?src=＃;set_channel_receiving=1'>Receiving Channel</A>:</B> ＀<BR>", [live(f.src), rt.sv(f, "channel_name")]), add);
		dat = rt.modify(live(dat), fmt("<B>Message Author:</B> <FONT COLOR='green'>＀</FONT><BR>", [rt.sv(f, "scanned_user")]), add);
		dat = rt.modify(live(dat), fmt("<B><A href='?src=＃;set_new_message=1'>Message Body</A>:</B> <BR><font face=\"＀\">＀</font><BR>", [live(f.src), "Verdana", (yield* g.call(f, P("/proc/parsepencode"), null, [rt.sv(f, "msg"), live(user), "Times New Roman"]))]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "photo"))) {
			$1 = "Photo Attached";
		} else {
			$1 = "No Photo";
		}
		dat = rt.modify(live(dat), fmt("<B><A href='?src=＃;set_attachment=1'>Attach Photo</A>:</B>  ＀</BR>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "allow_comments"))) {
			$1 = "Enabled";
		} else {
			$1 = "Disabled";
		}
		dat = rt.modify(live(dat), fmt("<B><A href='?src=＃;set_comment=1'>Comments ＀</A></B><BR>", [$0, $1]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;submit_new_message=1'>Submit</A><BR><BR><A href='?src=＃;setScreen=＀'>Cancel</A><BR>", [live(f.src), live(f.src), 0]), add);
	} else if ($0 === 4) {
		dat = rt.modify(live(dat), fmt("Feed story successfully submitted to ＀.<BR><BR>", [rt.sv(f, "channel_name")]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [live(f.src), 0]), add);
	} else if ($0 === 5) {
		dat = rt.modify(live(dat), fmt("Feed Channel ＀ created successfully.<BR><BR>", [rt.sv(f, "channel_name")]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [live(f.src), 0]), add);
	} else if ($0 === 6) {
		dat = rt.modify(live(dat), "<B><FONT COLOR='maroon'>ERROR: Could not submit Feed story to Network.</B></FONT><HR><BR>", add);
		if (isEqual(rt.sv(f, "channel_name"), "")) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Invalid receiving channel name.</FONT><BR>", add);
		}
		if (isEqual(rt.sv(f, "scanned_user"), "Unknown")) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Channel author unverified.</FONT><BR>", add);
		}
		if ((isEqual(rt.sv(f, "msg"), "") || isEqual(rt.sv(f, "msg"), "[REDACTED]"))) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Invalid message body.</FONT><BR>", add);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [live(f.src), 3]), add);
	} else if ($0 === 7) {
		dat = rt.modify(live(dat), "<B><FONT COLOR='maroon'>ERROR: Could not submit Feed Channel to Network.</B></FONT><HR><BR>", add);
		existing_authors = rt.list();
		FC = null;
		rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
		while (($e = rt.next(f, 0)) !== undefined) {
			FC = $e;
			if (truthy(rt.fv(f, "authorCensor", live(FC)))) {
				existing_authors = rt.modify(live(existing_authors), rt.fv(f, "redactedText", rt.gl("news_network")), add);
			} else {
				existing_authors = rt.modify(live(existing_authors), rt.fv(f, "author", live(FC)), add);
			}
		}
		rt.endFor(f, 0);
		if (truthy((rt.isIn(f, rt.sv(f, "scanned_user"), live(existing_authors)) ? 1 : 0))) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>There is already a Feed channel under your name.</FONT><BR>", add);
		}
		if ((isEqual(rt.sv(f, "channel_name"), "") || isEqual(rt.sv(f, "channel_name"), "[REDACTED]"))) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Invalid channel name.</FONT><BR>", add);
		}
		check = 0;
		FC_4 = null;
		rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
		while (($e = rt.next(f, 0)) !== undefined) {
			FC_4 = $e;
			if (isEqual(rt.fv(f, "channel_name", live(FC_4)), rt.sv(f, "channel_name"))) {
				check = 1;
				break;
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(check))) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Channel name already in use.</FONT><BR>", add);
		}
		if (isEqual(rt.sv(f, "scanned_user"), "Unknown")) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Channel author unverified.</FONT><BR>", add);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [live(f.src), 2]), add);
	} else if ($0 === 8) {
		total_num = rt.length(rt.fv(f, "network_channels", rt.gl("news_network")));
		active_num = live(total_num);
		message_num = 0;
		FC_5 = null;
		rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
		while (($e = rt.next(f, 0)) !== undefined) {
			FC_5 = $e;
			if (!truthy(rt.fv(f, "censored", live(FC_5)))) {
				message_num = rt.modify(live(message_num), rt.length(rt.fv(f, "messages", live(FC_5))), add);
			} else {
				active_num = rt.inc(live(active_num), -1);
			}
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), fmt("Network currently serves a total of ＀ Feed channels, ＀ of which are active, and a total of ＀ Feed Stories.", [live(total_num), live(active_num), live(message_num)]), add);
		dat = rt.modify(live(dat), fmt("<BR><BR><B>Liquid Paper remaining:</B> ＀ cm^3", [multiply(rt.sv(f, "paper_remaining"), 100)]), add);
		dat = rt.modify(live(dat), fmt("<BR><BR><A href='?src=＃;print_paper=＀'>Print Paper</A>", [live(f.src), 0]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Cancel</A>", [live(f.src), 0]), add);
	} else if ($0 === 9) {
		dat = rt.modify(live(dat), fmt("<B>＀: </B><FONT SIZE=1>[created by: <FONT COLOR='maroon'>＀</FONT>]</FONT><HR>", [rt.fv(f, "channel_name", rt.sv(f, "viewing_channel")), (yield* g.callName(f, rt.sv(f, "viewing_channel"), "returnAuthor", [-1]))]), add);
		if (truthy(rt.fv(f, "censored", rt.sv(f, "viewing_channel")))) {
			dat = rt.modify(live(dat), "<FONT COLOR='red'><B>ATTENTION: </B></FONT>This channel has been deemed as threatening to the welfare of the station, and marked with a Nanotrasen D-Notice.<BR>", add);
			dat = rt.modify(live(dat), "No further feed story additions are allowed while the D-Notice is in effect.</FONT><BR><BR>", add);
		} else {
			if (truthy((yield* g.call(f, P("/proc/isemptylist"), null, [rt.fv(f, "messages", rt.sv(f, "viewing_channel"))])))) {
				dat = rt.modify(live(dat), "<I>No feed messages found in channel...</I><BR>", add);
			} else {
				i = 0;
				MESSAGE = null;
				rt.forList(f, 0, rt.fv(f, "messages", rt.sv(f, "viewing_channel")), T("/datum/newscaster/feed_message"));
				while (($e = rt.next(f, 0)) !== undefined) {
					MESSAGE = $e;
					i = rt.inc(live(i), 1);
					dat = rt.modify(live(dat), fmt("-＀ <BR>", [(yield* g.callName(f, live(MESSAGE), "returnBody", [-1]))]), add);
					if (truthy(rt.fv(f, "img", live(MESSAGE)))) {
						rt.op(f, "BrowseResource", [], [live(f.usr), rt.fv(f, "img", live(MESSAGE)), fmt("tmp_photo＀.png", [live(i)])], false);
						dat = rt.modify(live(dat), fmt("<img src='tmp_photo＀.png' width = '180'><BR>", [live(i)]), add);
						if (truthy(rt.fv(f, "caption", live(MESSAGE)))) {
							dat = rt.modify(live(dat), fmt("＀<BR>", [rt.fv(f, "caption", live(MESSAGE))]), add);
						}
						dat = rt.modify(live(dat), "<BR>", add);
					}
					dat = rt.modify(live(dat), fmt("<FONT SIZE=1>[Story by <FONT COLOR='maroon'>＀ </FONT>] - (＀)</FONT><BR>", [(yield* g.callName(f, live(MESSAGE), "returnAuthor", [-1])), rt.fv(f, "time_stamp", live(MESSAGE))]), add);
					$0 = rt.getLen(f, rt.fv(f, "comments", live(MESSAGE)));
					if (rt.gt(rt.getLen(f, rt.fv(f, "comments", live(MESSAGE))), 1)) {
						$1 = "s";
					} else {
						$1 = "";
					}
					dat = rt.modify(live(dat), fmt("<b><font size=1>＀ comment＀</font></b><br>", [$0, $1]), add);
					comment = null;
					rt.forList(f, 1, rt.fv(f, "comments", live(MESSAGE)), T("/datum/newscaster/feed_comment"));
					while (($e = rt.next(f, 1)) !== undefined) {
						comment = $e;
						dat = rt.modify(live(dat), fmt("<font size=1><small>＀</font><br><font size=1><small><small><small>＀ ＀</small></small></small></small></font><br>", [rt.fv(f, "body", live(comment)), rt.fv(f, "author", live(comment)), rt.fv(f, "time_stamp", live(comment))]), add);
					}
					rt.endFor(f, 1);
					if (truthy(rt.fv(f, "locked", live(MESSAGE)))) {
						dat = rt.modify(live(dat), "<b>Comments locked</b><br>", add);
					} else {
						dat = rt.modify(live(dat), fmt("<a href='?src=＃;new_comment=＃'>Comment</a><br>", [live(f.src), live(MESSAGE)]), add);
					}
				}
				rt.endFor(f, 0);
			}
		}
		dat = rt.modify(live(dat), fmt("<BR><HR><A href='?src=＃;refresh=1'>Refresh</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Back</A>", [live(f.src), 1]), add);
	} else if ($0 === 10) {
		dat = rt.modify(live(dat), "<B>Nanotrasen Feed Censorship Tool</B><BR>", add);
		dat = rt.modify(live(dat), "<FONT SIZE=1>NOTE: Due to the nature of news Feeds, total deletion of a Feed Story is not possible.<BR>", add);
		dat = rt.modify(live(dat), "Keep in mind that users attempting to view a censored feed will instead see the [REDACTED] tag above it.</FONT>", add);
		dat = rt.modify(live(dat), "<HR>Select Feed channel to get Stories from:<BR>", add);
		if (truthy((yield* g.call(f, P("/proc/isemptylist"), null, [rt.fv(f, "network_channels", rt.gl("news_network"))])))) {
			dat = rt.modify(live(dat), "<I>No feed channels found active...</I><BR>", add);
		} else {
			CHANNEL = null;
			rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
			while (($e = rt.next(f, 0)) !== undefined) {
				CHANNEL = $e;
				$0 = live(f.src);
				$1 = live(CHANNEL);
				$2 = rt.fv(f, "channel_name", live(CHANNEL));
				if (truthy(rt.fv(f, "censored", live(CHANNEL)))) {
					$3 = "<FONT COLOR='red'>***</FONT>";
				} else {
					$3 = null;
				}
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;pick_censor_channel=＃'>＀</A> ＀<BR>", [$0, $1, $2, $3]), add);
			}
			rt.endFor(f, 0);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Cancel</A>", [live(f.src), 0]), add);
	} else if ($0 === 11) {
		dat = rt.modify(live(dat), "<B>Nanotrasen D-Notice Handler</B><HR>", add);
		dat = rt.modify(live(dat), "<FONT SIZE=1>A D-Notice is to be bestowed upon the channel if the handling Authority deems it as harmful for the station's", add);
		dat = rt.modify(live(dat), "morale, integrity or disciplinary behaviour. A D-Notice will render a channel unable to be updated by anyone, without deleting any feed", add);
		dat = rt.modify(live(dat), "stories it might contain at the time. You can lift a D-Notice if you have the required access at any time.</FONT><HR>", add);
		if (truthy((yield* g.call(f, P("/proc/isemptylist"), null, [rt.fv(f, "network_channels", rt.gl("news_network"))])))) {
			dat = rt.modify(live(dat), "<I>No feed channels found active...</I><BR>", add);
		} else {
			CHANNEL = null;
			rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
			while (($e = rt.next(f, 0)) !== undefined) {
				CHANNEL = $e;
				$0 = live(f.src);
				$1 = live(CHANNEL);
				$2 = rt.fv(f, "channel_name", live(CHANNEL));
				if (truthy(rt.fv(f, "censored", live(CHANNEL)))) {
					$3 = "<FONT COLOR='red'>***</FONT>";
				} else {
					$3 = null;
				}
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;pick_d_notice=＃'>＀</A> ＀<BR>", [$0, $1, $2, $3]), add);
			}
			rt.endFor(f, 0);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Back</A>", [live(f.src), 0]), add);
	} else if ($0 === 12) {
		dat = rt.modify(live(dat), fmt("<B>＀: </B><FONT SIZE=1>[ created by: <FONT COLOR='maroon'>＀</FONT> ]</FONT><BR>", [rt.fv(f, "channel_name", rt.sv(f, "viewing_channel")), (yield* g.callName(f, rt.sv(f, "viewing_channel"), "returnAuthor", [-1]))]), add);
		$0 = live(f.src);
		$1 = rt.sv(f, "viewing_channel");
		if (truthy(rt.fv(f, "authorCensor", rt.sv(f, "viewing_channel")))) {
			$2 = "Undo Author censorship";
		} else {
			$2 = "Censor channel Author";
		}
		dat = rt.modify(live(dat), fmt("<FONT SIZE=2><A href='?src=＃;censor_channel_author=＃'>＀</A></FONT><HR>", [$0, $1, $2]), add);
		if (truthy((yield* g.call(f, P("/proc/isemptylist"), null, [rt.fv(f, "messages", rt.sv(f, "viewing_channel"))])))) {
			dat = rt.modify(live(dat), "<I>No feed messages found in channel...</I><BR>", add);
		} else {
			MESSAGE_2 = null;
			rt.forList(f, 0, rt.fv(f, "messages", rt.sv(f, "viewing_channel")), T("/datum/newscaster/feed_message"));
			while (($e = rt.next(f, 0)) !== undefined) {
				MESSAGE_2 = $e;
				dat = rt.modify(live(dat), fmt("-＀ <BR><FONT SIZE=1>[Story by <FONT COLOR='maroon'>＀</FONT>]</FONT><BR>", [(yield* g.callName(f, live(MESSAGE_2), "returnBody", [-1])), (yield* g.callName(f, live(MESSAGE_2), "returnAuthor", [-1]))]), add);
				$0 = live(f.src);
				$1 = live(MESSAGE_2);
				if (truthy(rt.fv(f, "bodyCensor", live(MESSAGE_2)))) {
					$2 = "Undo story censorship";
				} else {
					$2 = "Censor story";
				}
				$3 = live(f.src);
				$4 = live(MESSAGE_2);
				if (truthy(rt.fv(f, "authorCensor", live(MESSAGE_2)))) {
					$5 = "Undo Author Censorship";
				} else {
					$5 = "Censor message Author";
				}
				dat = rt.modify(live(dat), fmt("<FONT SIZE=2><A href='?src=＃;censor_channel_story_body=＃'>＀</A>  -  <A href='?src=＃;censor_channel_story_author=＃'>＀</A></FONT><BR>", [$0, $1, $2, $3, $4, $5]), add);
				$0 = rt.getLen(f, rt.fv(f, "comments", live(MESSAGE_2)));
				if (rt.gt(rt.getLen(f, rt.fv(f, "comments", live(MESSAGE_2))), 1)) {
					$1 = "s";
				} else {
					$1 = "";
				}
				$2 = live(f.src);
				$3 = live(MESSAGE_2);
				if (truthy(rt.fv(f, "locked", live(MESSAGE_2)))) {
					$4 = "Unlock";
				} else {
					$4 = "Lock";
				}
				dat = rt.modify(live(dat), fmt("＀ comment＀: <a href='?src=＃;lock_comment=＃'>＀</a><br>", [$0, $1, $2, $3, $4]), add);
				comment_3 = null;
				rt.forList(f, 1, rt.fv(f, "comments", live(MESSAGE_2)), T("/datum/newscaster/feed_comment"));
				while (($e = rt.next(f, 1)) !== undefined) {
					comment_3 = $e;
					dat = rt.modify(live(dat), fmt("＀ <a href='?src=＃;del_comment=＃;del_comment_msg=＃'>X</a><br><font size=1>＀ ＀</font><br>", [rt.fv(f, "body", live(comment_3)), live(f.src), live(comment_3), live(MESSAGE_2), rt.fv(f, "author", live(comment_3)), rt.fv(f, "time_stamp", live(comment_3))]), add);
				}
				rt.endFor(f, 1);
			}
			rt.endFor(f, 0);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Back</A>", [live(f.src), 10]), add);
	} else if ($0 === 13) {
		dat = rt.modify(live(dat), fmt("<B>＀: </B><FONT SIZE=1>[ created by: <FONT COLOR='maroon'>＀</FONT> ]</FONT><BR>", [rt.fv(f, "channel_name", rt.sv(f, "viewing_channel")), (yield* g.callName(f, rt.sv(f, "viewing_channel"), "returnAuthor", [-1]))]), add);
		dat = rt.modify(live(dat), fmt("Channel messages listed below. If you deem them dangerous to the station, you can <A href='?src=＃;toggle_d_notice=＃'>Bestow a D-Notice upon the channel</A>.<HR>", [live(f.src), rt.sv(f, "viewing_channel")]), add);
		if (truthy(rt.fv(f, "censored", rt.sv(f, "viewing_channel")))) {
			dat = rt.modify(live(dat), "<FONT COLOR='red'><B>ATTENTION: </B></FONT>This channel has been deemed as threatening to the welfare of the station, and marked with a Nanotrasen D-Notice.<BR>", add);
			dat = rt.modify(live(dat), "No further feed story additions are allowed while the D-Notice is in effect.</FONT><BR><BR>", add);
		} else {
			if (truthy((yield* g.call(f, P("/proc/isemptylist"), null, [rt.fv(f, "messages", rt.sv(f, "viewing_channel"))])))) {
				dat = rt.modify(live(dat), "<I>No feed messages found in channel...</I><BR>", add);
			} else {
				MESSAGE_2 = null;
				rt.forList(f, 0, rt.fv(f, "messages", rt.sv(f, "viewing_channel")), T("/datum/newscaster/feed_message"));
				while (($e = rt.next(f, 0)) !== undefined) {
					MESSAGE_2 = $e;
					dat = rt.modify(live(dat), fmt("-＀ <BR><FONT SIZE=1>[Story by <FONT COLOR='maroon'>＀</FONT>]</FONT><BR>", [(yield* g.callName(f, live(MESSAGE_2), "returnBody", [-1])), (yield* g.callName(f, live(MESSAGE_2), "returnAuthor", [-1]))]), add);
				}
				rt.endFor(f, 0);
			}
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Back</A>", [live(f.src), 11]), add);
	} else if ($0 === 14) {
		dat = rt.modify(live(dat), "<B>Wanted Issue Handler:</B>", add);
		wanted_already = 0;
		end_param = 1;
		if (truthy(rt.gv(f, "active", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
			wanted_already = 1;
			end_param = 2;
		}
		if (truthy(live(wanted_already))) {
			dat = rt.modify(live(dat), "<FONT SIZE=2><BR><I>A wanted issue is already in Feed Circulation. You can edit or cancel it below.</FONT></I>", add);
		}
		dat = rt.modify(live(dat), "<HR>", add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;set_wanted_name=1'>Criminal Name</A>: ＀ <BR>", [live(f.src), rt.sv(f, "channel_name")]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;set_wanted_desc=1'>Description</A>: ＀ <BR>", [live(f.src), rt.sv(f, "msg")]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "photo"))) {
			$1 = "Photo Attached";
		} else {
			$1 = "No Photo";
		}
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;set_attachment=1'>Attach Photo</A>: ＀</BR>", [$0, $1]), add);
		if (truthy(live(wanted_already))) {
			dat = rt.modify(live(dat), fmt("<B>Wanted Issue created by:</B><FONT COLOR='green'>＀</FONT><BR>", [rt.gv(f, "scannedUser", rt.fv(f, "wanted_issue", rt.gl("news_network")))]), add);
		} else {
			dat = rt.modify(live(dat), fmt("<B>Wanted Issue will be created under prosecutor:</B><FONT COLOR='green'>＀</FONT><BR>", [rt.sv(f, "scanned_user")]), add);
		}
		$0 = live(f.src);
		$1 = live(end_param);
		if (truthy(live(wanted_already))) {
			$1 = $1;
			$2 = "Edit Issue";
		} else {
			$2 = "Submit";
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;submit_wanted=＀'>＀</A>", [$0, $1, $2]), add);
		if (truthy(live(wanted_already))) {
			dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;cancel_wanted=1'>Take down Issue</A>", [live(f.src)]), add);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Cancel</A>", [live(f.src), 0]), add);
	} else if ($0 === 15) {
		dat = rt.modify(live(dat), fmt("<FONT COLOR='green'>Wanted issue for ＀ is now in Network Circulation.</FONT><BR><BR>", [rt.sv(f, "channel_name")]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [live(f.src), 0]), add);
	} else if ($0 === 16) {
		dat = rt.modify(live(dat), "<B><FONT COLOR='maroon'>ERROR: Wanted Issue rejected by Network.</B></FONT><HR><BR>", add);
		if ((isEqual(rt.sv(f, "channel_name"), "") || isEqual(rt.sv(f, "channel_name"), "[REDACTED]"))) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Invalid name for person wanted.</FONT><BR>", add);
		}
		if (isEqual(rt.sv(f, "scanned_user"), "Unknown")) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Issue author unverified.</FONT><BR>", add);
		}
		if ((isEqual(rt.sv(f, "msg"), "") || isEqual(rt.sv(f, "msg"), "[REDACTED]"))) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Invalid description.</FONT><BR>", add);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [live(f.src), 0]), add);
	} else if ($0 === 17) {
		dat = rt.modify(live(dat), "<B>Wanted Issue successfully deleted from Circulation</B><BR>", add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [live(f.src), 0]), add);
	} else if ($0 === 18) {
		if (truthy(rt.gv(f, "active", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
			dat = rt.modify(live(dat), fmt("<B><FONT COLOR ='maroon'>-- STATIONWIDE WANTED ISSUE --</B></FONT><BR><FONT SIZE=2>[Submitted by: <FONT COLOR='green'>＀</FONT>]</FONT><HR>", [rt.gv(f, "scannedUser", rt.fv(f, "wanted_issue", rt.gl("news_network")))]), add);
			dat = rt.modify(live(dat), fmt("<B>Criminal</B>: ＀<BR>", [rt.gv(f, "criminal", rt.fv(f, "wanted_issue", rt.gl("news_network")))]), add);
			dat = rt.modify(live(dat), fmt("<B>Description</B>: ＀<BR>", [rt.gv(f, "body", rt.fv(f, "wanted_issue", rt.gl("news_network")))]), add);
			dat = rt.modify(live(dat), "<B>Photo:</B>: ", add);
			if (truthy(rt.gv(f, "img", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
				rt.op(f, "BrowseResource", [], [live(f.usr), rt.gv(f, "img", rt.fv(f, "wanted_issue", rt.gl("news_network"))), "tmp_photow.png"], false);
				dat = rt.modify(live(dat), "<BR><img src='tmp_photow.png' width = '180'>", add);
			} else {
				dat = rt.modify(live(dat), "None", add);
			}
		} else {
			dat = rt.modify(live(dat), "No current wanted issue found.<BR><BR>", add);
		}
		dat = rt.modify(live(dat), fmt("<BR><BR><A href='?src=＃;setScreen=＀'>Back</A><BR>", [live(f.src), 0]), add);
	} else if ($0 === 19) {
		dat = rt.modify(live(dat), fmt("<FONT COLOR='green'>Wanted issue for ＀ successfully edited.</FONT><BR><BR>", [rt.sv(f, "channel_name")]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [live(f.src), 0]), add);
	} else if ($0 === 20) {
		dat = rt.modify(live(dat), "<FONT COLOR='green'>Printing successful. Please receive your newspaper from the bottom of the machine.</FONT><BR><BR>", add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;setScreen=＀'>Return</A>", [live(f.src), 0]), add);
	} else if ($0 === 21) {
		dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Unable to print newspaper. Insufficient paper. Please notify maintenance personnel to refill machine storage.</FONT><BR><BR>", add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;setScreen=＀'>Return</A>", [live(f.src), 0]), add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(human_or_robot_user), "newscaster_main", fmt("Newscaster Unit #＀", [rt.sv(f, "unit_no")]), 400, 600]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(human_or_robot_user), "browse_rsc_icon", [rt.sv(f, "icon"), rt.sv(f, "icon_state")]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/newscaster/proc/Topic  (code/game/machinery/newscaster.dm:506)  may sleep
rt.def("/obj/machinery/newscaster/proc/Topic", function* Topic(f: Frame) {
	let existing_authors: Value = null, FC: Value = null, check: Value = null, FC_2: Value = null, choice: Value = null, available_channels: Value = null, F: Value = null, temp_message: Value = null, already_wanted: Value = null, input_param: Value = null, choice_1: Value = null, choice_0: Value = null, FC_0: Value = null, MSG: Value = null, FM: Value = null, cominput: Value = null, FM_1: Value = null;
	let $0: any, $e: any;
	f.vars = () => [existing_authors, FC, check, FC_2, choice, available_channels, F, temp_message, already_wanted, input_param, choice_1, choice_0, FC_0, MSG, FM, cominput, FM_1, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!((truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)]))) || (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "scan_user", live(f.usr));
	if (truthy(rt.at(live(f.args[1]), "set_channel_name"))) {
		rt.setSv(f, "channel_name", (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Provide a Feed Channel Name", "Network Channel Handler", "", 42])));
		while (isEqual((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "channel_name"), " "])), 1)) {
			rt.setSv(f, "channel_name", (yield* g.call(f, P("/proc/copytext"), null, [rt.sv(f, "channel_name"), 2, add((yield* g.call(f, P("/proc/lentext"), null, [rt.sv(f, "channel_name")])), 1)])));
		}
		yield* g.srcCall(f, "updateUsrDialog");
	} else {
		if (truthy(rt.at(live(f.args[1]), "set_channel_lock"))) {
			rt.setSv(f, "c_locked", (!truthy(rt.sv(f, "c_locked")) ? 1 : 0));
			yield* g.srcCall(f, "updateUsrDialog");
		} else {
			if (truthy(rt.at(live(f.args[1]), "submit_new_channel"))) {
				existing_authors = rt.list();
				FC = null;
				rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
				while (($e = rt.next(f, 0)) !== undefined) {
					FC = $e;
					if (truthy(rt.fv(f, "authorCensor", live(FC)))) {
						existing_authors = rt.modify(live(existing_authors), rt.fv(f, "redactedText", rt.gl("news_network")), add);
					} else {
						existing_authors = rt.modify(live(existing_authors), rt.fv(f, "author", live(FC)), add);
					}
				}
				rt.endFor(f, 0);
				check = 0;
				FC_2 = null;
				rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
				while (($e = rt.next(f, 0)) !== undefined) {
					FC_2 = $e;
					if (isEqual(rt.fv(f, "channel_name", live(FC_2)), rt.sv(f, "channel_name"))) {
						check = 1;
						break;
					}
				}
				rt.endFor(f, 0);
				if (((((isEqual(rt.sv(f, "channel_name"), "") || isEqual(rt.sv(f, "channel_name"), "[REDACTED]")) || isEqual(rt.sv(f, "scanned_user"), "Unknown")) || truthy(live(check))) || truthy((rt.isIn(f, rt.sv(f, "scanned_user"), live(existing_authors)) ? 1 : 0)))) {
					rt.setSv(f, "screen", 7);
				} else {
					if (isEqual((choice = (yield* g.call(f, P("/proc/alert"), null, ["Please confirm Feed channel creation", "Network Channel Handler", "Confirm", "Cancel"]))), "Confirm")) {
						yield* g.srcCall(f, "scan_user", live(f.usr));
						yield* g.callName(f, rt.gl("news_network"), "CreateFeedChannel", [rt.sv(f, "channel_name"), rt.sv(f, "scanned_user"), rt.sv(f, "c_locked")]);
						rt.setSv(f, "screen", 5);
					}
				}
				yield* g.srcCall(f, "updateUsrDialog");
			} else {
				if (truthy(rt.at(live(f.args[1]), "set_channel_receiving"))) {
					available_channels = rt.list();
					F = null;
					rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
					while (($e = rt.next(f, 0)) !== undefined) {
						F = $e;
						if (((!truthy(rt.fv(f, "locked", live(F))) || isEqual(rt.fv(f, "author", live(F)), rt.sv(f, "scanned_user"))) && !truthy(rt.fv(f, "censored", live(F))))) {
							available_channels = rt.modify(live(available_channels), rt.fv(f, "channel_name", live(F)), add);
						}
					}
					rt.endFor(f, 0);
					rt.setSv(f, "channel_name", (yield* g.op(f, "Prompt", [0], [null, "Network Channel Handler", "Choose receiving Feed Channel", live(f.usr), live(available_channels)])));
					yield* g.srcCall(f, "updateUsrDialog");
				} else {
					if (truthy(rt.at(live(f.args[1]), "set_new_message"))) {
						if (truthy((temp_message = (yield* g.call(f, P("/proc/trim"), null, [(yield* g.call(f, P("/proc/stripped_multiline_input"), null, [live(f.usr), "Write your Feed story", "Network Channel Handler", rt.sv(f, "msg")]))]))))) {
							rt.setSv(f, "msg", live(temp_message));
							yield* g.srcCall(f, "updateUsrDialog");
						}
					} else {
						if (truthy(rt.at(live(f.args[1]), "set_attachment"))) {
							yield* g.srcCall(f, "AttachPhoto", live(f.usr));
							yield* g.srcCall(f, "updateUsrDialog");
						} else {
							if (truthy(rt.at(live(f.args[1]), "submit_new_message"))) {
								if ((((isEqual(rt.sv(f, "msg"), "") || isEqual(rt.sv(f, "msg"), "[REDACTED]")) || isEqual(rt.sv(f, "scanned_user"), "Unknown")) || isEqual(rt.sv(f, "channel_name"), ""))) {
									rt.setSv(f, "screen", 6);
								} else {
									yield* g.callName(f, rt.gl("news_network"), "SubmitArticle", [fmt("<font face=\"＀\">＀</font>", ["Verdana", (yield* g.call(f, P("/proc/parsepencode"), null, [rt.sv(f, "msg"), live(f.usr), "Times New Roman"]))]), rt.sv(f, "scanned_user"), rt.sv(f, "channel_name"), rt.sv(f, "photo"), 0, rt.sv(f, "allow_comments")]);
									rt.setSv(f, "screen", 4);
									rt.setSv(f, "msg", "");
								}
								yield* g.srcCall(f, "updateUsrDialog");
							} else {
								if (truthy(rt.at(live(f.args[1]), "create_channel"))) {
									rt.setSv(f, "screen", 2);
									yield* g.srcCall(f, "updateUsrDialog");
								} else {
									if (truthy(rt.at(live(f.args[1]), "create_feed_story"))) {
										rt.setSv(f, "screen", 3);
										yield* g.srcCall(f, "updateUsrDialog");
									} else {
										if (truthy(rt.at(live(f.args[1]), "menu_paper"))) {
											rt.setSv(f, "screen", 8);
											yield* g.srcCall(f, "updateUsrDialog");
										} else {
											if (truthy(rt.at(live(f.args[1]), "print_paper"))) {
												if (!truthy(rt.sv(f, "paper_remaining"))) {
													rt.setSv(f, "screen", 21);
												} else {
													yield* g.srcCall(f, "print_paper");
													rt.setSv(f, "screen", 20);
												}
												yield* g.srcCall(f, "updateUsrDialog");
											} else {
												if (truthy(rt.at(live(f.args[1]), "menu_censor_story"))) {
													rt.setSv(f, "screen", 10);
													yield* g.srcCall(f, "updateUsrDialog");
												} else {
													if (truthy(rt.at(live(f.args[1]), "menu_censor_channel"))) {
														rt.setSv(f, "screen", 11);
														yield* g.srcCall(f, "updateUsrDialog");
													} else {
														if (truthy(rt.at(live(f.args[1]), "menu_wanted"))) {
															already_wanted = 0;
															if (truthy(rt.gv(f, "active", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
																already_wanted = 1;
															}
															if (truthy(live(already_wanted))) {
																rt.setSv(f, "channel_name", rt.gv(f, "criminal", rt.fv(f, "wanted_issue", rt.gl("news_network"))));
																rt.setSv(f, "msg", rt.gv(f, "body", rt.fv(f, "wanted_issue", rt.gl("news_network"))));
															}
															rt.setSv(f, "screen", 14);
															yield* g.srcCall(f, "updateUsrDialog");
														} else {
															if (truthy(rt.at(live(f.args[1]), "set_wanted_name"))) {
																rt.setSv(f, "channel_name", (yield* g.call(f, P("/proc/trim"), null, [(yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Provide the name of the Wanted person", "Network Security Handler"]))])));
																yield* g.srcCall(f, "updateUsrDialog");
															} else {
																if (truthy(rt.at(live(f.args[1]), "set_wanted_desc"))) {
																	rt.setSv(f, "msg", (yield* g.call(f, P("/proc/trim"), null, [(yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Provide a description of the Wanted person and any other details you deem important", "Network Security Handler"]))])));
																	yield* g.srcCall(f, "updateUsrDialog");
																} else {
																	if (truthy(rt.at(live(f.args[1]), "submit_wanted"))) {
																		input_param = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "submit_wanted")]));
																		if (((isEqual(rt.sv(f, "msg"), "") || isEqual(rt.sv(f, "channel_name"), "")) || isEqual(rt.sv(f, "scanned_user"), "Unknown"))) {
																			rt.setSv(f, "screen", 16);
																		} else {
																			if (isEqual(live(input_param), 1)) {
																				$0 = "creation.";
																			} else {
																				$0 = "edit.";
																			}
																			if (isEqual((choice_1 = (yield* g.call(f, P("/proc/alert"), null, [fmt("Please confirm Wanted Issue ＀", [$0]), "Network Security Handler", "Confirm", "Cancel"]))), "Confirm")) {
																				yield* g.srcCall(f, "scan_user", live(f.usr));
																				if (isEqual(live(input_param), 1)) {
																					yield* g.callName(f, rt.gl("news_network"), "submitWanted", [rt.sv(f, "channel_name"), rt.sv(f, "msg"), rt.sv(f, "scanned_user"), rt.sv(f, "photo"), 0, 1]);
																					rt.setSv(f, "screen", 15);
																				} else {
																					if (truthy(rt.gv(f, "isAdminMsg", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
																						yield* g.call(f, P("/proc/alert"), null, ["The wanted issue has been distributed by a Nanotrasen higherup. You cannot edit it.", "Ok"]);
																						return live(f.dot);
																					}
																					yield* g.callName(f, rt.gl("news_network"), "submitWanted", [rt.sv(f, "channel_name"), rt.sv(f, "msg"), rt.sv(f, "scanned_user"), rt.sv(f, "photo")]);
																					rt.setSv(f, "screen", 19);
																				}
																			}
																		}
																		yield* g.srcCall(f, "updateUsrDialog");
																	} else {
																		if (truthy(rt.at(live(f.args[1]), "cancel_wanted"))) {
																			if (truthy(rt.gv(f, "isAdminMsg", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
																				yield* g.call(f, P("/proc/alert"), null, ["The wanted issue has been distributed by a Nanotrasen higherup. You cannot take it down.", "Ok"]);
																				return live(f.dot);
																			}
																			if (isEqual((choice_0 = (yield* g.call(f, P("/proc/alert"), null, ["Please confirm Wanted Issue removal", "Network Security Handler", "Confirm", "Cancel"]))), "Confirm")) {
																				yield* g.callName(f, rt.gl("news_network"), "deleteWanted", []);
																				rt.setSv(f, "screen", 17);
																			}
																			yield* g.srcCall(f, "updateUsrDialog");
																		} else {
																			if (truthy(rt.at(live(f.args[1]), "view_wanted"))) {
																				rt.setSv(f, "screen", 18);
																				yield* g.srcCall(f, "updateUsrDialog");
																			} else {
																				if (truthy(rt.at(live(f.args[1]), "censor_channel_author"))) {
																					if (truthy(rt.gv(f, "is_admin_channel", (FC_0 = rt.locateIn(f, rt.at(live(f.args[1]), "censor_channel_author"), rt.world()))))) {
																						yield* g.call(f, P("/proc/alert"), null, ["This channel was created by a Nanotrasen Officer. You cannot censor it.", "Ok"]);
																						return live(f.dot);
																					}
																					yield* g.callName(f, live(FC_0), "toggleCensorAuthor", []);
																					yield* g.srcCall(f, "updateUsrDialog");
																				} else {
																					if (truthy(rt.at(live(f.args[1]), "censor_channel_story_author"))) {
																						if (truthy(rt.gv(f, "is_admin_message", (MSG = rt.locateIn(f, rt.at(live(f.args[1]), "censor_channel_story_author"), rt.world()))))) {
																							yield* g.call(f, P("/proc/alert"), null, ["This message was created by a Nanotrasen Officer. You cannot censor its author.", "Ok"]);
																							return live(f.dot);
																						}
																						yield* g.callName(f, live(MSG), "toggleCensorAuthor", []);
																						yield* g.srcCall(f, "updateUsrDialog");
																					} else {
																						if (truthy(rt.at(live(f.args[1]), "censor_channel_story_body"))) {
																							if (truthy(rt.gv(f, "is_admin_message", (MSG = rt.locateIn(f, rt.at(live(f.args[1]), "censor_channel_story_body"), rt.world()))))) {
																								yield* g.call(f, P("/proc/alert"), null, ["This channel was created by a Nanotrasen Officer. You cannot censor it.", "Ok"]);
																								return live(f.dot);
																							}
																							yield* g.callName(f, live(MSG), "toggleCensorBody", []);
																							yield* g.srcCall(f, "updateUsrDialog");
																						} else {
																							if (truthy(rt.at(live(f.args[1]), "pick_d_notice"))) {
																								rt.setSv(f, "viewing_channel", (FC_0 = rt.locateIn(f, rt.at(live(f.args[1]), "pick_d_notice"), rt.world())));
																								rt.setSv(f, "screen", 13);
																								yield* g.srcCall(f, "updateUsrDialog");
																							} else {
																								if (truthy(rt.at(live(f.args[1]), "toggle_d_notice"))) {
																									if (truthy(rt.gv(f, "is_admin_channel", (FC_0 = rt.locateIn(f, rt.at(live(f.args[1]), "toggle_d_notice"), rt.world()))))) {
																										yield* g.call(f, P("/proc/alert"), null, ["This channel was created by a Nanotrasen Officer. You cannot place a D-Notice upon it.", "Ok"]);
																										return live(f.dot);
																									}
																									yield* g.callName(f, live(FC_0), "toggleCensorDclass", []);
																									yield* g.srcCall(f, "updateUsrDialog");
																								} else {
																									if (truthy(rt.at(live(f.args[1]), "view"))) {
																										rt.setSv(f, "screen", 1);
																										yield* g.srcCall(f, "updateUsrDialog");
																									} else {
																										if (truthy(rt.at(live(f.args[1]), "setScreen"))) {
																											rt.setSv(f, "screen", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "setScreen")])));
																											if (isEqual(rt.sv(f, "screen"), 0)) {
																												rt.setSv(f, "scanned_user", "Unknown");
																												rt.setSv(f, "msg", "");
																												rt.setSv(f, "c_locked", 0);
																												rt.setSv(f, "channel_name", "");
																												rt.setSv(f, "viewing_channel", null);
																											}
																											yield* g.srcCall(f, "updateUsrDialog");
																										} else {
																											if (truthy(rt.at(live(f.args[1]), "show_channel"))) {
																												rt.setSv(f, "viewing_channel", (FC_0 = rt.locateIn(f, rt.at(live(f.args[1]), "show_channel"), rt.world())));
																												rt.setSv(f, "screen", 9);
																												yield* g.srcCall(f, "updateUsrDialog");
																											} else {
																												if (truthy(rt.at(live(f.args[1]), "pick_censor_channel"))) {
																													rt.setSv(f, "viewing_channel", (FC_0 = rt.locateIn(f, rt.at(live(f.args[1]), "pick_censor_channel"), rt.world())));
																													rt.setSv(f, "screen", 12);
																													yield* g.srcCall(f, "updateUsrDialog");
																												} else {
																													if (truthy(rt.at(live(f.args[1]), "new_comment"))) {
																														FM = rt.locateIn(f, rt.at(live(f.args[1]), "new_comment"), rt.world());
																														if (truthy((cominput = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Write your message:", "New comment", null])), 1, 141]))))) {
																															yield* g.srcCall(f, "scan_user", live(f.usr));
																															rt.setFv(f, "author", (FC_2 = (yield* g.new_(f, T("/datum/newscaster/feed_comment"), []))), rt.sv(f, "scanned_user"));
																															rt.setFv(f, "body", live(FC_2), live(cominput));
																															rt.setFv(f, "time_stamp", live(FC_2), (yield* g.call(f, P("/proc/worldtime2text"), null, [])));
																															rt.modField(f, live(FM), "comments", live(FC_2), add);
																															yield* g.call(f, P("/proc/log_comment"), null, [fmt("＀/(＀) as ＀ commented on message ＀ -- ＀", [live(f.usr), rt.fv(f, "ckey", live(f.usr)), rt.sv(f, "scanned_user"), (yield* g.callName(f, live(FM), "returnBody", [-1])), rt.fv(f, "body", live(FC_2))])]);
																														}
																														yield* g.srcCall(f, "updateUsrDialog");
																													} else {
																														if (truthy(rt.at(live(f.args[1]), "del_comment"))) {
																															FC_0 = rt.locateIn(f, rt.at(live(f.args[1]), "del_comment"), rt.world());
																															(rt.modField(f, (FM_1 = rt.locateIn(f, rt.at(live(f.args[1]), "del_comment_msg"), rt.world())), "comments", live(FC_0), subtract));
																															yield* g.call(f, P("/proc/qdel"), null, [live(FC_0)]);
																															yield* g.srcCall(f, "updateUsrDialog");
																														} else {
																															if (truthy(rt.at(live(f.args[1]), "lock_comment"))) {
																																(rt.modField(f, (FM = rt.locateIn(f, rt.at(live(f.args[1]), "lock_comment"), rt.world())), "locked", 1, rt.bitXor));
																																yield* g.srcCall(f, "updateUsrDialog");
																															} else {
																																if (truthy(rt.at(live(f.args[1]), "set_comment"))) {
																																	(rt.modSrcVar(f, "allow_comments", 1, rt.bitXor));
																																	yield* g.srcCall(f, "updateUsrDialog");
																																} else {
																																	if (!truthy(rt.at(live(f.args[1]), "refresh"))) return f.dot;
																																	yield* g.srcCall(f, "updateUsrDialog");
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/newscaster/proc/attackby  (code/game/machinery/newscaster.dm:716)  may sleep
rt.def("/obj/machinery/newscaster/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	let $0: any, $1: any;
	f.vars = () => [WT, $0, $1];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		$0 = live(f.args[1]);
		if (truthy(rt.sv(f, "anchored"))) {
			$1 = "un";
		} else {
			$1 = "";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You start ＀securing ＀...</span>", [$1, rt.sv(f, "name")])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(60, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The broken remains of ＀ fall on the ground.</span>", [live(f.src)])]);
				yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 5]);
				yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.sv(f, "loc")]);
				yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.sv(f, "loc")]);
			} else {
				$0 = live(f.args[1]);
				if (truthy(rt.sv(f, "anchored"))) {
					$1 = "un";
				} else {
					$1 = "";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀secure ＀.</span>", [$1, rt.sv(f, "name")])]);
				yield* g.new_(f, T("/obj/item/wallframe/newscaster"), [rt.sv(f, "loc")]);
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && !isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm"))) {
			WT = live(f.args[0]);
			if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
				if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ is repairing ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin repairing ＀...</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 40, 1]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(WT))), null, 1, "target", live(f.src)], rt.Args.Named)))) {
						if ((!truthy((yield* g.callName(f, live(WT), "isOn", []))) || !truthy(rt.bitAnd(rt.sv(f, "stat"), 1)))) {
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You repair ＀.</span>", [live(f.src)])]);
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
						rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
						(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
						yield* g.srcCall(f, "update_icon");
					}
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ does not need repairs.</span>", [live(f.src)])]);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/newscaster/proc/play_attack_sound  (code/game/machinery/newscaster.dm:752)
rt.def("/obj/machinery/newscaster/proc/play_attack_sound", function play_attack_sound(f: Frame, damage: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 100, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/glasshit.ogg"), 90, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/machinery/newscaster/proc/deconstruct  (code/game/machinery/newscaster.dm:763)  may sleep
rt.def("/obj/machinery/newscaster/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]);
		yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.sv(f, "loc")]);
		yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.sv(f, "loc")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/newscaster/proc/obj_break  (code/game/machinery/newscaster.dm:770)
rt.def("/obj/machinery/newscaster/proc/obj_break", function obj_break(f: Frame) {
	if (!(!truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/glassbr3.ogg"), 100, 1]);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/newscaster/proc/attack_paw  (code/game/machinery/newscaster.dm:777)  may sleep
rt.def("/obj/machinery/newscaster/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!isEqual(rt.fv(f, "a_intent", live(user)), "harm")) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The newscaster controls are far too complicated for your tiny brain!</span>"]);
	} else {
		yield* g.srcCall(f, "take_damage", 5, "brute", "melee");
	}
	return f.dot;
}, true);

// /obj/machinery/newscaster/proc/AttachPhoto  (code/game/machinery/newscaster.dm:784)  may sleep
rt.def("/obj/machinery/newscaster/proc/AttachPhoto", function* AttachPhoto(f: Frame, user: Value) {
	let nametemp: Value = null, find: Value = null, selection: Value = null, targetcam: Value = null, R: Value = null, t: Value = null, _P: Value = null, q: Value = null;
	let $e: any;
	f.vars = () => [user, nametemp, find, selection, targetcam, R, t, _P, q, $e];
	if (truthy(rt.sv(f, "photo"))) {
		if (!truthy(rt.fv(f, "sillynewscastervar", rt.sv(f, "photo")))) {
			rt.setFv(f, "loc", rt.sv(f, "photo"), rt.sv(f, "loc"));
			if (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
				yield* g.callName(f, live(user), "put_in_inactive_hand", [rt.sv(f, "photo")]);
			}
		} else {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "photo")]);
		}
		rt.setSv(f, "photo", null);
	}
	if (truthy((rt.istype((yield* g.callName(f, live(user), "get_active_held_item", [])), T("/obj/item/weapon/photo")) ? 1 : 0))) {
		rt.setSv(f, "photo", (yield* g.callName(f, live(user), "get_active_held_item", [])));
		if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setFv(f, "loc", rt.sv(f, "photo"), live(f.src));
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) return f.dot;
	nametemp = rt.list();
	find = null;
	selection = null;
	targetcam = null;
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		targetcam = rt.gv(f, "aicamera", (R = live(user)));
	} else {
		if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "connected_ai", (R = live(user))))) {
				targetcam = rt.gv(f, "aicamera", rt.fv(f, "connected_ai", live(R)));
			} else {
				targetcam = rt.fv(f, "aicamera", live(R));
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You cannot interface with silicon photo uploading!</span>"]);
		}
	}
	if (isEqual(rt.getLen(f, rt.fv(f, "aipictures", live(targetcam))), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='boldannounce'>No images saved</span>"]);
		return live(f.dot);
	}
	t = null;
	rt.forList(f, 0, rt.fv(f, "aipictures", live(targetcam)), T("/datum/picture"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		nametemp = rt.modify(live(nametemp), rt.index(rt.fv(f, "fields", live(t)), "name"), add);
	}
	rt.endFor(f, 0);
	find = (yield* g.op(f, "Prompt", [0], [null, null, null, "Select image (numbered in order taken)", live(nametemp)]));
	_P = (yield* g.new_(f, T("/obj/item/weapon/photo"), []));
	q = null;
	rt.forList(f, 0, rt.fv(f, "aipictures", live(targetcam)), T("/datum/picture"));
	while (($e = rt.next(f, 0)) !== undefined) {
		q = $e;
		if (isEqual(rt.index(rt.fv(f, "fields", live(q)), "name"), live(find))) {
			selection = live(q);
			break;
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(_P), "photocreate", [rt.index(rt.fv(f, "fields", live(selection)), "icon"), rt.index(rt.fv(f, "fields", live(selection)), "img"), rt.index(rt.fv(f, "fields", live(selection)), "desc")]);
	rt.setFv(f, "sillynewscastervar", live(_P), 1);
	rt.setSv(f, "photo", live(_P));
	yield* g.call(f, P("/proc/qdel"), null, [live(_P)]);
	return f.dot;
}, true);

// /obj/machinery/newscaster/proc/scan_user  (code/game/machinery/newscaster.dm:829)
rt.def("/obj/machinery/newscaster/proc/scan_user", function scan_user(f: Frame, user: Value) {
	let human_user: Value = null, _P: Value = null, ID: Value = null, ai_user: Value = null;
	f.vars = () => [human_user, _P, ID, ai_user];
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "wear_id", (human_user = live(user))))) {
			if (truthy((rt.istype(rt.fv(f, "wear_id", live(human_user)), T("/obj/item/device/pda")) ? 1 : 0))) {
				if (truthy(rt.gv(f, "id", (_P = rt.fv(f, "wear_id", live(human_user)))))) {
					rt.setSv(f, "scanned_user", fmt("＀ (＀)", [rt.gv(f, "registered_name", rt.fv(f, "id", live(_P))), rt.gv(f, "assignment", rt.fv(f, "id", live(_P)))]));
				} else {
					rt.setSv(f, "scanned_user", "Unknown");
				}
			} else {
				if (truthy((rt.istype(rt.fv(f, "wear_id", live(human_user)), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
					rt.setSv(f, "scanned_user", fmt("＀ (＀)", [rt.gv(f, "registered_name", (ID = rt.fv(f, "wear_id", live(human_user)))), rt.fv(f, "assignment", live(ID))]));
				} else {
					rt.setSv(f, "scanned_user", "Unknown");
				}
			}
		} else {
			rt.setSv(f, "scanned_user", "Unknown");
		}
	} else {
		if (truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
			rt.setSv(f, "scanned_user", fmt("＀ (＀)", [rt.gv(f, "name", (ai_user = live(user))), rt.fv(f, "job", live(ai_user))]));
		} else {
			rt.throw_(f, rt.new_(f, T("/exception"), ["Invalid user for this proc", "code/game/machinery/newscaster.dm", 849]));
			return live(f.dot);
		}
	}
	return f.dot;
});

// /obj/machinery/newscaster/proc/print_paper  (code/game/machinery/newscaster.dm:853)  may sleep
rt.def("/obj/machinery/newscaster/proc/print_paper", function* print_paper(f: Frame) {
	let NEWSPAPER: Value = null, FC: Value = null;
	let $e: any;
	f.vars = () => [NEWSPAPER, FC, $e];
	NEWSPAPER = (yield* g.new_(f, T("/obj/item/weapon/newspaper"), []));
	FC = null;
	rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
	while (($e = rt.next(f, 0)) !== undefined) {
		FC = $e;
		rt.modField(f, live(NEWSPAPER), "news_content", live(FC), add);
	}
	rt.endFor(f, 0);
	if (truthy(rt.gv(f, "active", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
		rt.setFv(f, "wantedAuthor", live(NEWSPAPER), rt.gv(f, "scannedUser", rt.fv(f, "wanted_issue", rt.gl("news_network"))));
		rt.setFv(f, "wantedCriminal", live(NEWSPAPER), rt.gv(f, "criminal", rt.fv(f, "wanted_issue", rt.gl("news_network"))));
		rt.setFv(f, "wantedBody", live(NEWSPAPER), rt.gv(f, "body", rt.fv(f, "wanted_issue", rt.gl("news_network"))));
		if (truthy(rt.gv(f, "img", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
			rt.setFv(f, "wantedPhoto", live(NEWSPAPER), rt.gv(f, "img", rt.fv(f, "wanted_issue", rt.gl("news_network"))));
		}
	}
	rt.setFv(f, "loc", live(NEWSPAPER), rt.getStep(f, live(f.src), 0));
	rt.setFv(f, "creationTime", live(NEWSPAPER), rt.fv(f, "lastAction", rt.gl("news_network")));
	rt.incSrcVar(f, "paper_remaining", -1, true);
	return f.dot;
}, true);

// /obj/machinery/newscaster/proc/newsAlert  (code/game/machinery/newscaster.dm:869)  may sleep
rt.def("/obj/machinery/newscaster/proc/newsAlert", function* newsAlert(f: Frame, channel: Value) {
	f.vars = () => [channel];
	if (truthy(live(channel))) {
		yield* g.srcCall(f, "say", fmt("Breaking news from ＀!", [live(channel)]));
		rt.incSrcVar(f, "alert", 1, true);
		yield* g.srcCall(f, "update_icon");
		rt.spawnTail(f, rt.sv(f, "alert_delay"), "/obj/machinery/newscaster/proc/newsAlert: spawn at game/machinery/newscaster.dm:872", channel);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/twobeep.ogg"), 75, 1]);
	} else {
		yield* g.srcCall(f, "say", "Attention! Wanted issue distributed!");
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/warning-buzzer.ogg"), 75, 1]);
	}
	return f.dot;
}, true);

// a spawn(rt.srcVarI(f, $ic[454])) body of /obj/machinery/newscaster/proc/newsAlert, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/newscaster/proc/newsAlert: spawn at game/machinery/newscaster.dm:872", function* (f: Frame, channel: Value) {
	f.vars = () => [channel];
	rt.incSrcVar(f, "alert", -1, true);
	yield* g.srcCall(f, "update_icon");
	return null;
});

rt.type(6940, "/obj/item/weapon/newspaper", "/obj/item/weapon", {
	screen: 0,
	pages: 0,
	curr_page: 0,
	news_content: null,
	scribble: "",
	scribble_page: null,
	wantedAuthor: null,
	wantedCriminal: null,
	wantedBody: null,
	wantedPhoto: null,
	creationTime: null,
	name: "newspaper",
	desc: "An issue of The Griffon, the newspaper circulating aboard Nanotrasen Space Stations.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "newspaper",
	w_class: 2,
	attack_verb: null,
});

// /obj/item/weapon/newspaper/proc/<init>  (code/game/machinery/newscaster.dm:891)
rt.def("/obj/item/weapon/newspaper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "news_content", rt.list());
	$0 = $0;
	rt.setSv(f, "attack_verb", rt.list("bapped"));
	return f.dot;
});

// /obj/item/weapon/newspaper/proc/suicide_act  (code/game/machinery/newscaster.dm:901)  may sleep
rt.def("/obj/item/weapon/newspaper/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let H: Value = null, W: Value = null;
	f.vars = () => [user, H, W];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is focusing intently on ＀! It looks like ＀ trying to commit sudoku... until ＀ eyes light up with realization!</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_theyre", [])), (yield* g.callName(f, live(user), "p_their", []))])]);
	yield* g.callName(f, live(user), "say", [";JOURNALISM IS MY CALLING! EVERYBODY APPRECIATES UNBIASED REPORTI-GLORF"]);
	H = live(user);
	W = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey"), [rt.fv(f, "loc", live(H))]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(H)), rt.rsc("sound/items/drink.ogg"), (yield* g.call(f, P("/proc/rand"), null, [10, 50])), 1]);
	yield* g.callName(f, rt.fv(f, "reagents", live(W)), "trans_to", [live(H), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(W)))]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ downs the contents of ＀ in one gulp! Shoulda stuck to sudoku!</span>", [live(user), rt.fv(f, "name", live(W))])]);
	return 4;
}, true);

// /obj/item/weapon/newspaper/proc/attack_self  (code/game/machinery/newscaster.dm:912)
rt.def("/obj/item/weapon/newspaper/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let human_user: Value = null, dat: Value = null, NP: Value = null, temp_page: Value = null, NP_3: Value = null, C: Value = null, i: Value = null, MESSAGE: Value = null;
	let $0: any, $e: any;
	f.vars = () => [human_user, dat, NP, temp_page, NP_3, C, i, MESSAGE, $0, $e];
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		human_user = live(user);
		dat = null;
		rt.setSv(f, "pages", 0);
		$0 = rt.sv(f, "screen");
		if ($0 === 0) {
			dat = rt.modify(live(dat), "<DIV ALIGN='center'><B><FONT SIZE=6>The Griffon</FONT></B></div>", add);
			dat = rt.modify(live(dat), "<DIV ALIGN='center'><FONT SIZE=2>Nanotrasen-standard newspaper, for use on Nanotrasen? Space Facilities</FONT></div><HR>", add);
			if (truthy(rt.call(f, P("/proc/isemptylist"), null, [rt.sv(f, "news_content")]))) {
				if (truthy(rt.sv(f, "wantedAuthor"))) {
					dat = rt.modify(live(dat), fmt("Contents:<BR><ul><B><FONT COLOR='red'>**</FONT>Important Security Announcement<FONT COLOR='red'>**</FONT></B> <FONT SIZE=2>[page ＀]</FONT><BR></ul>", [add(rt.sv(f, "pages"), 2)]), add);
				} else {
					dat = rt.modify(live(dat), "<I>Other than the title, the rest of the newspaper is unprinted...</I>", add);
				}
			} else {
				dat = rt.modify(live(dat), "Contents:<BR><ul>", add);
				NP = null;
				rt.forList(f, 0, rt.sv(f, "news_content"), T("/datum/newscaster/feed_channel"));
				while (($e = rt.next(f, 0)) !== undefined) {
					NP = $e;
					rt.incSrcVar(f, "pages", 1, true);
				}
				rt.endFor(f, 0);
				if (truthy(rt.sv(f, "wantedAuthor"))) {
					dat = rt.modify(live(dat), fmt("<B><FONT COLOR='red'>**</FONT>Important Security Announcement<FONT COLOR='red'>**</FONT></B> <FONT SIZE=2>[page ＀]</FONT><BR>", [add(rt.sv(f, "pages"), 2)]), add);
				}
				temp_page = 0;
				NP_3 = null;
				rt.forList(f, 0, rt.sv(f, "news_content"), T("/datum/newscaster/feed_channel"));
				while (($e = rt.next(f, 0)) !== undefined) {
					NP_3 = $e;
					temp_page = rt.inc(live(temp_page), 1);
					dat = rt.modify(live(dat), fmt("<B>＀</B> <FONT SIZE=2>[page ＀]</FONT><BR>", [rt.fv(f, "channel_name", live(NP_3)), add(live(temp_page), 1)]), add);
				}
				rt.endFor(f, 0);
				dat = rt.modify(live(dat), "</ul>", add);
			}
			if (isEqual(rt.sv(f, "scribble_page"), rt.sv(f, "curr_page"))) {
				dat = rt.modify(live(dat), fmt("<BR><I>There is a small scribble near the end of this page... It reads: \"＀\"</I>", [rt.sv(f, "scribble")]), add);
			}
			dat = rt.modify(live(dat), fmt("<HR><DIV STYLE='float:right;'><A href='?src=＃;next_page=1'>Next Page</A></DIV> <div style='float:left;'><A href='?src=＃;mach_close=newspaper_main'>Done reading</A></DIV>", [live(f.src), live(human_user)]), add);
		} else if ($0 === 1) {
			NP = null;
			rt.forList(f, 0, rt.sv(f, "news_content"), T("/datum/newscaster/feed_channel"));
			while (($e = rt.next(f, 0)) !== undefined) {
				NP = $e;
				rt.incSrcVar(f, "pages", 1, true);
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), fmt("<FONT SIZE=4><B>＀</B></FONT><FONT SIZE=1> [created by: <FONT COLOR='maroon'>＀</FONT>]</FONT><BR><BR>", [rt.gv(f, "channel_name", (C = rt.index(rt.sv(f, "news_content"), rt.sv(f, "curr_page")))), rt.callName(f, live(C), "returnAuthor", [rt.callSrc(f, "notContent", [rt.fv(f, "authorCensorTime", live(C))])])]), add);
			if (truthy(rt.callSrc(f, "notContent", [rt.fv(f, "DclassCensorTime", live(C))]))) {
				dat = rt.modify(live(dat), "This channel was deemed dangerous to the general welfare of the station and therefore marked with a <B><FONT COLOR='red'>D-Notice</B></FONT>. Its contents were not transferred to the newspaper at the time of printing.", add);
			} else {
				if (truthy(rt.call(f, P("/proc/isemptylist"), null, [rt.fv(f, "messages", live(C))]))) {
					dat = rt.modify(live(dat), "No Feed stories stem from this channel...", add);
				} else {
					i = 0;
					MESSAGE = null;
					rt.forList(f, 0, rt.fv(f, "messages", live(C)), T("/datum/newscaster/feed_message"));
					while (($e = rt.next(f, 0)) !== undefined) {
						MESSAGE = $e;
						if (rt.gt(rt.fv(f, "creationTime", live(MESSAGE)), rt.sv(f, "creationTime"))) {
							if (isEqual(live(i), 0)) {
								dat = rt.modify(live(dat), "No Feed stories stem from this channel...", add);
							}
							break;
						}
						if (isEqual(live(i), 0)) {
							dat = rt.modify(live(dat), "<ul>", add);
						}
						i = rt.inc(live(i), 1);
						dat = rt.modify(live(dat), fmt("-＀ <BR>", [rt.callName(f, live(MESSAGE), "returnBody", [rt.callSrc(f, "notContent", [rt.fv(f, "bodyCensorTime", live(MESSAGE))])])]), add);
						if (truthy(rt.fv(f, "img", live(MESSAGE)))) {
							rt.op(f, "BrowseResource", [], [live(user), rt.fv(f, "img", live(MESSAGE)), fmt("tmp_photo＀.png", [live(i)])], false);
							dat = rt.modify(live(dat), fmt("<img src='tmp_photo＀.png' width = '180'><BR>", [live(i)]), add);
						}
						dat = rt.modify(live(dat), fmt("<FONT SIZE=1>[Story by <FONT COLOR='maroon'>＀</FONT>]</FONT><BR><BR>", [rt.callName(f, live(MESSAGE), "returnAuthor", [rt.callSrc(f, "notContent", [rt.fv(f, "authorCensorTime", live(MESSAGE))])])]), add);
					}
					rt.endFor(f, 0);
					dat = rt.modify(live(dat), "</ul>", add);
				}
			}
			if (isEqual(rt.sv(f, "scribble_page"), rt.sv(f, "curr_page"))) {
				dat = rt.modify(live(dat), fmt("<BR><I>There is a small scribble near the end of this page... It reads: \"＀\"</I>", [rt.sv(f, "scribble")]), add);
			}
			dat = rt.modify(live(dat), fmt("<BR><HR><DIV STYLE='float:left;'><A href='?src=＃;prev_page=1'>Previous Page</A></DIV> <DIV STYLE='float:right;'><A href='?src=＃;next_page=1'>Next Page</A></DIV>", [live(f.src), live(f.src)]), add);
		} else if ($0 === 2) {
			NP = null;
			rt.forList(f, 0, rt.sv(f, "news_content"), T("/datum/newscaster/feed_channel"));
			while (($e = rt.next(f, 0)) !== undefined) {
				NP = $e;
				rt.incSrcVar(f, "pages", 1, true);
			}
			rt.endFor(f, 0);
			if (rt.sv(f, "wantedAuthor") !== null) {
				dat = rt.modify(live(dat), "<DIV STYLE='float:center;'><FONT SIZE=4><B>Wanted Issue:</B></FONT SIZE></DIV><BR><BR>", add);
				dat = rt.modify(live(dat), fmt("<B>Criminal name</B>: <FONT COLOR='maroon'>＀</FONT><BR>", [rt.sv(f, "wantedCriminal")]), add);
				dat = rt.modify(live(dat), fmt("<B>Description</B>: ＀<BR>", [rt.sv(f, "wantedBody")]), add);
				dat = rt.modify(live(dat), "<B>Photo:</B>: ", add);
				if (truthy(rt.sv(f, "wantedPhoto"))) {
					rt.op(f, "BrowseResource", [], [live(user), rt.sv(f, "wantedPhoto"), "tmp_photow.png"], false);
					dat = rt.modify(live(dat), "<BR><img src='tmp_photow.png' width = '180'>", add);
				} else {
					dat = rt.modify(live(dat), "None", add);
				}
			} else {
				dat = rt.modify(live(dat), "<I>Apart from some uninteresting classified ads, there's nothing on this page...</I>", add);
			}
			if (isEqual(rt.sv(f, "scribble_page"), rt.sv(f, "curr_page"))) {
				dat = rt.modify(live(dat), fmt("<BR><I>There is a small scribble near the end of this page... It reads: \"＀\"</I>", [rt.sv(f, "scribble")]), add);
			}
			dat = rt.modify(live(dat), fmt("<HR><DIV STYLE='float:left;'><A href='?src=＃;prev_page=1'>Previous Page</A></DIV>", [live(f.src)]), add);
		}
		dat = rt.modify(live(dat), fmt("<BR><HR><div align='center'>＀</div>", [add(rt.sv(f, "curr_page"), 1)]), add);
		rt.op(f, "Browse", [], [live(human_user), live(dat), "window=newspaper_main;size=300x400"], false);
		rt.call(f, P("/proc/onclose"), null, [live(human_user), "newspaper_main"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "The paper is full of unintelligible symbols!"]);
	}
	return f.dot;
});

// /obj/item/weapon/newspaper/proc/notContent  (code/game/machinery/newscaster.dm:993)
rt.def("/obj/item/weapon/newspaper/proc/notContent", function notContent(f: Frame, L: Value) {
	let i: Value = null, num: Value = null;
	f.vars = () => [i, num];
	if (!truthy(rt.len(f, live(L)))) {
		return 0;
	}
	i = null;
	i = rt.len(f, live(L));
	while (rt.gt(live(i), 0)) {
		num = rt.op(f, "Abs", [], [rt.index(live(L), live(i))]);
		if (!rt.le(rt.sv(f, "creationTime"), live(num))) {
			if (rt.gt(rt.index(live(L), live(i)), 0)) {
				return 1;
			} else {
				return 0;
			}
		}
		i = rt.inc(live(i), -1);
	}
	return 0;
});

// /obj/item/weapon/newspaper/proc/Topic  (code/game/machinery/newscaster.dm:1007)  may sleep
rt.def("/obj/item/weapon/newspaper/proc/Topic", function* Topic(f: Frame) {
	let U: Value = null;
	f.vars = () => [U];
	U = live(f.usr);
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy((rt.isIn(f, live(f.src), rt.fv(f, "contents", live(U))) ? 1 : 0)) || (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(U)])), 1)))) return f.dot;
	yield* g.callName(f, live(U), "set_machine", [live(f.src)]);
	if (truthy(rt.at(live(f.args[1]), "next_page"))) {
		if (isEqual(rt.sv(f, "curr_page"), add(rt.sv(f, "pages"), 1))) {
			return live(f.dot);
		}
		if (isEqual(rt.sv(f, "curr_page"), rt.sv(f, "pages"))) {
			rt.setSv(f, "screen", 2);
		} else {
			if (isEqual(rt.sv(f, "curr_page"), 0)) {
				rt.setSv(f, "screen", 1);
			}
		}
		rt.incSrcVar(f, "curr_page", 1, true);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "pageturn", 50, 1]);
	} else {
		if (truthy(rt.at(live(f.args[1]), "prev_page"))) {
			if (isEqual(rt.sv(f, "curr_page"), 0)) {
				return live(f.dot);
			}
			if (isEqual(rt.sv(f, "curr_page"), 1)) {
				rt.setSv(f, "screen", 0);
			} else {
				if (isEqual(rt.sv(f, "curr_page"), add(rt.sv(f, "pages"), 1))) {
					rt.setSv(f, "screen", 1);
				}
			}
			rt.incSrcVar(f, "curr_page", -1, true);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "pageturn", 50, 1]);
		}
	}
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.srcCall(f, "attack_self", rt.sv(f, "loc"));
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/item/weapon/newspaper/proc/attackby  (code/game/machinery/newscaster.dm:1035)  may sleep
rt.def("/obj/item/weapon/newspaper/proc/attackby", function* attackby(f: Frame) {
	let s: Value = null;
	f.vars = () => [s];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "scribble_page"), rt.sv(f, "curr_page"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>There's already a scribble in this page... You wouldn't want to make things too cluttered, would you?</span>"]);
		} else {
			if (!truthy((s = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Write something", "Newspaper"]))))) {
				return live(f.dot);
			}
			if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.sv(f, "loc"), live(f.usr)))) {
				return live(f.dot);
			}
			rt.setSv(f, "scribble_page", rt.sv(f, "curr_page"));
			rt.setSv(f, "scribble", live(s));
			yield* g.srcCall(f, "attack_self", live(f.args[1]));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });
