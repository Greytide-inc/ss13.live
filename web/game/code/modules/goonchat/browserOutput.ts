// From code/modules/goonchat/browserOutput.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaliconCache  (code/modules/goonchat/browserOutput.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobaliconCache", function InitGlobaliconCache(f: Frame) {
	rt.setGl("iconCache", rt.new_(f, T("/savefile"), ["data/iconCache.sav"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "iconCache", add);
	return f.dot;
});

rt.type(2659, "/datum/chatOutput", "/datum", {
	owner: null,
	loaded: 0,
	messageQueue: null,
	cookieSent: 0,
	broken: 0,
	connectionHistory: null,
});

// /datum/chatOutput/proc/New  (code/modules/goonchat/browserOutput.dm:18)
rt.def("/datum/chatOutput/proc/New", function New(f: Frame, C: Value) {
	rt.setSv(f, "owner", live(C));
	rt.setSv(f, "messageQueue", rt.list());
	rt.setSv(f, "connectionHistory", rt.list());
	return f.dot;
});

// /datum/chatOutput/proc/start  (code/modules/goonchat/browserOutput.dm:24)  may sleep
rt.def("/datum/chatOutput/proc/start", function* start(f: Frame) {
	if (!truthy(rt.sv(f, "owner"))) {
		return 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/winexists"), null, [rt.sv(f, "owner"), "browseroutput"])))) {
		rt.setSv(f, "broken", 1);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Couldn't start chat for ＀!", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.sv(f, "owner")]))])]);
		f.dot = 0;
		yield* g.call(f, P("/proc/alert"), null, [rt.fv(f, "mob", rt.sv(f, "owner")), "Updated chat window does not exist. If you are using a custom skin file please allow the game to update."]);
		return live(f.dot);
	}
	if (isEqual((yield* g.call(f, P("/proc/winget"), null, [rt.sv(f, "owner"), "browseroutput", "is-visible"])), "true")) {
		yield* g.srcCall(f, "doneLoading");
	} else {
		yield* g.srcCall(f, "load");
	}
	return 1;
}, true, { waitfor: false });

// /datum/chatOutput/proc/load  (code/modules/goonchat/browserOutput.dm:45)  may sleep
rt.def("/datum/chatOutput/proc/load", function* load(f: Frame) {
	let stuff: Value = null;
	f.vars = () => [stuff];
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	yield* g.callName(f, (stuff = (yield* g.call(f, P("/proc/get_asset_datum"), null, [T("/datum/asset/simple/goonchat")]))), "register", []);
	yield* g.callName(f, live(stuff), "send", [rt.sv(f, "owner")]);
	// tg_js: browserOutput.html is not browsed: the page's output pane stands in for the goonchat window, so it never loads (doneLoading never runs).
	return f.dot;
}, true, { waitfor: false });

// /datum/chatOutput/proc/Topic  (code/modules/goonchat/browserOutput.dm:55)
rt.def("/datum/chatOutput/proc/Topic", function Topic(f: Frame, href: Value, href_list: Value) {
	let params: Value = null, key: Value = null, param_name: Value = null, item: Value = null, data: Value = null;
	let $0: any, $e: any;
	f.vars = () => [params, key, param_name, item, data, $0, $e];
	if (!isEqual(rt.fv(f, "client", live(f.usr)), rt.sv(f, "owner"))) {
		return 1;
	}
	params = rt.list();
	key = null;
	rt.forList(f, 0, live(href_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		if ((rt.gt(rt.length(live(key)), 7) && truthy(rt.call(f, P("/proc/findtext"), null, [live(key), "param"])))) {
			param_name = rt.call(f, P("/proc/copytext"), null, [live(key), 7, -1]);
			item = rt.index(live(href_list), live(key));
			rt.setAt(live(params), live(param_name), live(item));
		}
	}
	rt.endFor(f, 0);
	data = null;
	$0 = rt.at(live(href_list), "proc");
	if ($0 === "doneLoading") {
		data = rt.callSrc(f, "doneLoading", [live(params)], rt.Args.List);
	} else if ($0 === "debug") {
		data = rt.callSrc(f, "debug", [live(params)], rt.Args.List);
	} else if ($0 === "ping") {
		data = rt.callSrc(f, "ping", [live(params)], rt.Args.List);
	} else if ($0 === "analyzeClientData") {
		data = rt.callSrc(f, "analyzeClientData", [live(params)], rt.Args.List);
	}
	if (!truthy(live(data))) return f.dot;
	rt.callSrc(f, "ehjax_send", ["data", live(data)], rt.Args.Named);
	return f.dot;
});

// /datum/chatOutput/proc/doneLoading  (code/modules/goonchat/browserOutput.dm:93)
rt.def("/datum/chatOutput/proc/doneLoading", function doneLoading(f: Frame) {
	let message: Value = null;
	let $e: any;
	f.vars = () => [message, $e];
	if (truthy(rt.sv(f, "loaded"))) {
		return live(f.dot);
	}
	rt.setSv(f, "loaded", 1);
	rt.callSrc(f, "showChat", []);
	message = null;
	rt.forList(f, 0, rt.sv(f, "messageQueue"));
	while (($e = rt.next(f, 0)) !== undefined) {
		message = $e;
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), live(message)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "messageQueue", null);
	rt.callSrc(f, "sendClientData", []);
	rt.op(f, "OutputReference", [rt.R.srcVar("owner")], ["<span class=\"userdanger\">If you can see this, update byond.</span>"], false);
	rt.callSrc(f, "pingLoop", []);
	return f.dot;
});

// /datum/chatOutput/proc/showChat  (code/modules/goonchat/browserOutput.dm:108)
rt.def("/datum/chatOutput/proc/showChat", function showChat(f: Frame) {
	rt.call(f, P("/proc/winset"), null, [rt.sv(f, "owner"), "output", "is-visible=false"]);
	rt.call(f, P("/proc/winset"), null, [rt.sv(f, "owner"), "browseroutput", "is-disabled=false;is-visible=true"]);
	return f.dot;
});

// /datum/chatOutput/proc/pingLoop  (code/modules/goonchat/browserOutput.dm:115)  may sleep
rt.def("/datum/chatOutput/proc/pingLoop", function* pingLoop(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	while (truthy(rt.sv(f, "owner"))) {
		$0 = "data";
		if (truthy((yield* g.callName(f, rt.sv(f, "owner"), "is_afk", [29])))) {
			$1 = "softPang";
		} else {
			$1 = "pang";
		}
		yield* g.callSrc(f, "ehjax_send", [$0, $1], rt.Args.Named);
		yield* g.call(f, P("/proc/sleep"), null, [30]);
	}
	return f.dot;
}, true, { waitfor: false });

// /datum/chatOutput/proc/ehjax_send  (code/modules/goonchat/browserOutput.dm:119)
rt.def("/datum/chatOutput/proc/ehjax_send", function ehjax_send(f: Frame, C: Value, window: Value, data: Value) {
	f.vars = () => [C, window, data];
	if (live(C) === null) {
		C = rt.sv(f, "owner");
	}
	if (live(window) === null) {
		window = "browseroutput";
	}
	if (truthy((rt.istype(live(data), T("/list")) ? 1 : 0))) {
		data = rt.call(f, P("/proc/json_encode"), null, [live(data)]);
	}
	rt.op(f, "OutputControl", [], [live(C), fmt("＀", [live(data)]), fmt("＀:ehjaxCallback", [live(window)])], false);
	return f.dot;
});

// /datum/chatOutput/proc/sendClientData  (code/modules/goonchat/browserOutput.dm:126)
rt.def("/datum/chatOutput/proc/sendClientData", function sendClientData(f: Frame) {
	let deets: Value = null, data: Value = null;
	f.vars = () => [deets, data];
	rt.setAt(rt.index((deets = rt.alist(f, ["clientData", rt.list()])), "clientData"), "ckey", rt.fv(f, "ckey", rt.sv(f, "owner")));
	rt.setAt(rt.at(live(deets), "clientData"), "ip", rt.fv(f, "address", rt.sv(f, "owner")));
	rt.setAt(rt.at(live(deets), "clientData"), "compid", rt.fv(f, "computer_id", rt.sv(f, "owner")));
	data = rt.call(f, P("/proc/json_encode"), null, [live(deets)]);
	rt.callSrc(f, "ehjax_send", ["data", live(data)], rt.Args.Named);
	return f.dot;
});

// /datum/chatOutput/proc/analyzeClientData  (code/modules/goonchat/browserOutput.dm:135)
rt.def("/datum/chatOutput/proc/analyzeClientData", function analyzeClientData(f: Frame, cookie: Value) {
	let connData: Value = null, found: Value = null, i: Value = null, row: Value = null;
	let $e: any;
	f.vars = () => [cookie, connData, found, i, row, $e];
	if (live(cookie) === null) {
		cookie = "";
	}
	if (!truthy(live(cookie))) {
		return live(f.dot);
	}
	if (!isEqual(live(cookie), "none")) {
		if ((((truthy((connData = rt.call(f, P("/proc/json_decode"), null, [live(cookie)]))) && truthy((rt.istype(live(connData), T("/list")) ? 1 : 0))) && rt.gt(rt.len(f, live(connData)), 0)) && truthy(rt.at(live(connData), "connData")))) {
			rt.setSv(f, "connectionHistory", rt.at(live(connData), "connData"));
			found = rt.new_(f, T("/list"), []);
			i = null;
			rt.forRange(f, 0, rt.len(f, rt.sv(f, "connectionHistory")), 1, -1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				if (((!truthy((row = rt.index(rt.fv(f, "connectionHistory", live(f.src)), live(i)))) || rt.lt(rt.len(f, live(row)), 3)) || ((!truthy(rt.at(live(row), "ckey")) && !truthy(rt.at(live(row), "compid"))) && !truthy(rt.at(live(row), "ip"))))) {
					return live(f.dot);
				}
				if (truthy(rt.callName(f, rt.world(), "IsBanned", [rt.at(live(row), "ckey"), rt.at(live(row), "compid"), rt.at(live(row), "ip")]))) {
					found = live(row);
					break;
				}
			}
			rt.endFor(f, 0);
			if (rt.gt(rt.len(f, live(found)), 0)) {
				rt.call(f, P("/proc/message_admins"), null, [fmt("＀ has a cookie from a banned account! (Matched: ＀, ＀, ＀)", [rt.call(f, P("/proc/key_name"), null, [rt.fv(f, "owner", live(f.src))]), rt.at(live(found), "ckey"), rt.at(live(found), "ip"), rt.at(live(found), "compid")])]);
				rt.call(f, P("/proc/log_admin"), null, [fmt("＀ has a cookie from a banned account! (Matched: ＀, ＀, ＀)", [rt.call(f, P("/proc/key_name"), null, [rt.fv(f, "owner", live(f.src))]), rt.at(live(found), "ckey"), rt.at(live(found), "ip"), rt.at(live(found), "compid")])]);
			}
		}
	}
	rt.setSv(f, "cookieSent", 1);
	return f.dot;
});

// /datum/chatOutput/proc/ping  (code/modules/goonchat/browserOutput.dm:161)
rt.def("/datum/chatOutput/proc/ping", function ping(f: Frame) {
	return "pong";
});

// /datum/chatOutput/proc/debug  (code/modules/goonchat/browserOutput.dm:165)
rt.def("/datum/chatOutput/proc/debug", function debug(f: Frame, error: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = rt.call(f, P("/proc/time2text"), null, [rt.fv(f, "realtime", rt.world()), "YYYY-MM-DD hh:mm:ss"]);
	if (truthy(rt.gv(f, "key", rt.fv(f, "owner", live(f.src))))) {
		$1 = rt.gv(f, "key", rt.fv(f, "owner", live(f.src)));
	} else {
		$1 = rt.fv(f, "owner", live(f.src));
	}
	rt.call(f, P("/proc/log_world"), null, [fmt("[＀] Client: ＀ triggered JS error: ＀", [$0, $1, live(error)])]);
	return f.dot;
});

// /proc/icon2base64  (code/modules/goonchat/browserOutput.dm:173)
rt.def("/proc/icon2base64", function icon2base64(f: Frame, icon: Value, iconKey: Value) {
	let iconData: Value = null, partial: Value = null;
	f.vars = () => [iconKey, iconData, partial];
	if (live(iconKey) === null) {
		iconKey = "misc";
	}
	if (!truthy(rt.call(f, P("/proc/isicon"), null, [live(icon)]))) {
		return 0;
	}
	rt.op(f, "OutputReference", [rt.R.index], [rt.gl("iconCache"), live(iconKey), live(icon)], false);
	iconData = rt.callName(f, rt.gl("iconCache"), "ExportText", [live(iconKey)]);
	return rt.call(f, P("/proc/replacetext"), null, [rt.call(f, P("/proc/copytext"), null, [rt.index((partial = rt.call(f, P("/proc/splittext"), null, [live(iconData), "{"])), 2), 3, -5]), "\n", ""]);
});

// /proc/bicon  (code/modules/goonchat/browserOutput.dm:181)
rt.def("/proc/bicon", function bicon(f: Frame, thing: Value) {
	let A: Value = null, key: Value = null, I: Value = null, temp: Value = null;
	let $0: any;
	f.vars = () => [A, key, I, temp, $0];
	if (!truthy(live(thing))) {
		return live(f.dot);
	}
	if (truthy(rt.call(f, P("/proc/isicon"), null, [live(thing)]))) {
		return fmt("<img class='icon misc' src='data:image/png;base64,＀'>", [rt.call(f, P("/proc/icon2base64"), null, [live(thing)])]);
	}
	A = live(thing);
	if (truthy((rt.istype(rt.fv(f, "icon", live(A)), T("/icon")) ? 1 : 0))) {
		$0 = fmt("＃", [rt.fv(f, "icon", live(A))]);
	} else {
		$0 = rt.fv(f, "icon", live(A));
	}
	key = fmt("＀:＀", [$0, rt.fv(f, "icon_state", live(A))]);
	if (!truthy(rt.index(rt.gl("bicon_cache"), live(key)))) {
		I = rt.call(f, P("/proc/icon"), null, [rt.fv(f, "icon", live(A)), rt.fv(f, "icon_state", live(A)), 2, 1]);
		if (truthy((rt.istype(live(thing), T("/mob/living/carbon/human")) ? 1 : 0))) {
			temp = live(I);
			rt.callName(f, (I = rt.call(f, P("/proc/icon"), null, [])), "Insert", [null, live(temp), "dir", 2], rt.Args.Named);
		}
		rt.setAt(rt.gl("bicon_cache"), live(key), rt.call(f, P("/proc/icon2base64"), null, [live(I), live(key)]));
	}
	return fmt("<img class='icon ＀' src='data:image/png;base64,＀'>", [rt.fv(f, "icon_state", live(A)), rt.index(rt.gl("bicon_cache"), live(key))]);
	return f.dot;
});

// /proc/to_chat  (code/modules/goonchat/browserOutput.dm:218)
rt.def("/proc/to_chat", function to_chat(f: Frame, target: Value, message: Value) {
	let targets: Value = null, original_message: Value = null, I: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [target, message, targets, original_message, I, C, $e];
	if (!truthy(live(target))) {
		return live(f.dot);
	}
	if (((truthy((rt.istype(live(message), T("/image")) ? 1 : 0)) || truthy((rt.istype(live(message), T("/sound")) ? 1 : 0))) || truthy((rt.istype(live(target), T("/savefile")) ? 1 : 0)))) {
		rt.op(f, "Output", [], [live(target), live(message)], false);
		rt.call(f, P("/proc/CRASH"), null, [fmt("Invalid message! ＀", [live(message)])]);
	}
	if (!truthy(rt.call(f, P("/proc/istext"), null, [live(message)]))) {
		return live(f.dot);
	}
	if (isEqual(live(target), rt.world())) {
		target = rt.gl("clients");
	}
	targets = null;
	if (!truthy((rt.istype(live(target), T("/list")) ? 1 : 0))) {
		targets = rt.list(live(target));
	} else {
		if (!truthy(rt.getLen(f, (targets = live(target))))) {
			return live(f.dot);
		}
	}
	original_message = live(message);
	message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [live(message), "ÿ\u0016", ""])), "ÿ\u0015", ""])), "\n", "<br>"])), "\t", fmt("＀＀", [rt.gl("TAB"), rt.gl("TAB")])]);
	I = null;
	rt.forList(f, 0, live(targets));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy((C = rt.call(f, P("/proc/grab_client"), null, [live(I)])))) {
			continue;
		}
		rt.op(f, "Output", [], [live(C), live(original_message)], false);
		if ((!truthy(rt.fv(f, "chatOutput", live(C))) || truthy(rt.gv(f, "broken", rt.fv(f, "chatOutput", live(C)))))) {
			continue;
		}
		if (!truthy(rt.gv(f, "loaded", rt.fv(f, "chatOutput", live(C))))) {
			continue; // tg_js: not queued for goonchat, which never loads here (see load): the queue only grew, one entry per message
		}
		rt.op(f, "OutputControl", [], [live(C), rt.call(f, P("/proc/url_encode"), null, [rt.call(f, P("/proc/url_encode"), null, [live(message)])]), "browseroutput:output"], false);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/grab_client  (code/modules/goonchat/browserOutput.dm:269)
rt.def("/proc/grab_client", function grab_client(f: Frame, target: Value) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((rt.istype(live(target), T("/client")) ? 1 : 0))) {
		return live(target);
	} else {
		if (truthy(rt.call(f, P("/proc/ismob"), null, [live(target)]))) {
			if (truthy(rt.gv(f, "client", (M = live(target))))) {
				return rt.fv(f, "client", live(M));
			}
		} else {
			if (!truthy((rt.istype(live(target), T("/datum/mind")) ? 1 : 0))) return f.dot;
			if (!(truthy(rt.gv(f, "current", (M = live(target)))) && truthy(rt.gv(f, "client", rt.fv(f, "current", live(M)))))) return f.dot;
			return rt.gv(f, "client", rt.fv(f, "current", live(M)));
		}
	}
	return f.dot;
});
