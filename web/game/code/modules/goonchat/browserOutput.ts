// Based on /tg/station's code/modules/goonchat/browserOutput.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// browserOutput.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobaliconCache", function InitGlobaliconCache(f: Frame) {
	GLOB.iconCache = new_(T("/savefile"), "data/iconCache.sav");
	this.gvars_datum_init_order += "iconCache";
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

// browserOutput.dm:18
rt.def("/datum/chatOutput/proc/New", function New(f: Frame, C: Value) {
	this.owner = C;
	this.messageQueue = list();
	this.connectionHistory = list();
	return f.dot;
});

// browserOutput.dm:24
rt.def("/datum/chatOutput/proc/start", function* start(f: Frame) {
	if (!this.owner) {
		return 0;
	}
	if (!(yield* winexists(this.owner, "browseroutput"))) {
		this.broken = 1;
		message_admins(`Couldn't start chat for ${key_name_admin(this.owner)}!`);
		f.dot = 0;
		yield* alert(this.owner.mob, "Updated chat window does not exist. If you are using a custom skin file please allow the game to update.");
		return f.dot;
	}
	if ((yield* winget(this.owner, "browseroutput", "is-visible")) == "true") {
		this.doneLoading();
	} else {
		yield* this.load();
	}
	return 1;
}, true, { waitfor: false });

// browserOutput.dm:45
rt.def("/datum/chatOutput/proc/load", function* load(f: Frame) {
	let stuff: Value = null;
	if (!this.owner) {
		return f.dot;
	}
	yield* (stuff = (yield* get_asset_datum(T("/datum/asset/simple/goonchat")))).register();
	yield* stuff.send(this.owner);
	// tg_js: browserOutput.html is not browsed: the page's output pane stands in for the goonchat window, so it never loads (doneLoading never runs).
	return f.dot;
}, true, { waitfor: false });

// browserOutput.dm:55
rt.def("/datum/chatOutput/proc/Topic", function Topic(f: Frame, href: Value, href_list: Value) {
	let key: Value = null, param_name: Value = null, item: Value = null, data: Value = null;
	let $e: any;
	if (f.usr.client != this.owner) {
		return 1;
	}
	let params: Value = list();
	for (key of each(href_list)) {
		if (rt.length(key) > 7 && findtext(key, "param")) {
			param_name = copytext(key, 7, -1);
			item = rt.index(href_list, key);
			rt.setAt(params, param_name, item);
		}
	}
	const item_2 = rt.at(href_list, "proc");
	if (item_2 === "doneLoading") {
		data = rt.callSrc(f, "doneLoading", [params], rt.Args.List);
	} else if (item_2 === "debug") {
		data = rt.callSrc(f, "debug", [params], rt.Args.List);
	} else if (item_2 === "ping") {
		data = rt.callSrc(f, "ping", [params], rt.Args.List);
	} else if (item_2 === "analyzeClientData") {
		data = rt.callSrc(f, "analyzeClientData", [params], rt.Args.List);
	}
	if (!data) return f.dot;
	this.ehjax_send({ data: data });
	return f.dot;
});

// browserOutput.dm:93
rt.def("/datum/chatOutput/proc/doneLoading", function doneLoading(f: Frame) {
	let message: Value = null;
	if (this.loaded) {
		return f.dot;
	}
	this.loaded = 1;
	this.showChat();
	for (message of each(this.messageQueue)) {
		to_chat(this.owner, message);
	}
	this.messageQueue = null;
	this.sendClientData();
	rt.op(f, "OutputReference", [rt.R.srcVar("owner")], ["<span class=\"userdanger\">If you can see this, update byond.</span>"], false);
	this.pingLoop();
	return f.dot;
});

// browserOutput.dm:108
rt.def("/datum/chatOutput/proc/showChat", function showChat(f: Frame) {
	winset(this.owner, "output", "is-visible=false");
	winset(this.owner, "browseroutput", "is-disabled=false;is-visible=true");
	return f.dot;
});

// browserOutput.dm:115
rt.def("/datum/chatOutput/proc/pingLoop", function* pingLoop(f: Frame) {
	let $0: any, $1: any;
	while (this.owner) {
		$0 = "data";
		if (this.owner.is_afk(29)) {
			$1 = "softPang";
		} else {
			$1 = "pang";
		}
		yield* g.callSrc(f, "ehjax_send", [$0, $1], rt.Args.Named);
		yield* sleep(30);
	}
	return f.dot;
}, true, { waitfor: false });

// browserOutput.dm:119
rt.def("/datum/chatOutput/proc/ehjax_send", function ehjax_send(f: Frame, C: Value, window: Value, data: Value) {
	C ??= this.owner;
	window ??= "browseroutput";
	if (rt.istype(data, T("/list"))) {
		data = json_encode(data);
	}
	rt.op(f, "OutputControl", [], [C, `${data}`, `${window}:ehjaxCallback`], false);
	return f.dot;
});

// browserOutput.dm:126
rt.def("/datum/chatOutput/proc/sendClientData", function sendClientData(f: Frame) {
	let deets: Value = null;
	rt.setAt(rt.index((deets = rt.alist(f, ["clientData", list()])), "clientData"), "ckey", this.owner.ckey);
	rt.setAt(rt.at(deets, "clientData"), "ip", this.owner.address);
	rt.setAt(rt.at(deets, "clientData"), "compid", this.owner.computer_id);
	let data: Value = json_encode(deets);
	this.ehjax_send({ data: data });
	return f.dot;
});

// browserOutput.dm:135
rt.def("/datum/chatOutput/proc/analyzeClientData", function analyzeClientData(f: Frame, cookie: Value) {
	let connData: Value = null, found: Value = null, i: Value = null, row: Value = null;
	let $e: any;
	cookie ??= "";
	if (!cookie) {
		return f.dot;
	}
	if (cookie != "none") {
		if ((connData = json_decode(cookie)) && rt.istype(connData, T("/list")) && rt.len(f, connData) > 0 && rt.at(connData, "connData")) {
			this.connectionHistory = rt.at(connData, "connData");
			found = new_(T("/list"));
			rt.forRange(f, 0, rt.len(f, this.connectionHistory), 1, -1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				if (!(row = rt.index(this.connectionHistory, i)) || rt.len(f, row) < 3 || !rt.at(row, "ckey") && !rt.at(row, "compid") && !rt.at(row, "ip")) {
					return f.dot;
				}
				if (rt.world().IsBanned(rt.at(row, "ckey"), rt.at(row, "compid"), rt.at(row, "ip"))) {
					found = row;
					break;
				}
			}
			rt.endFor(f, 0);
			if (rt.len(f, found) > 0) {
				message_admins(`${key_name(this.owner)} has a cookie from a banned account! (Matched: ${rt.at(found, "ckey")}, ${rt.at(found, "ip")}, ${rt.at(found, "compid")})`);
				log_admin(`${key_name(this.owner)} has a cookie from a banned account! (Matched: ${rt.at(found, "ckey")}, ${rt.at(found, "ip")}, ${rt.at(found, "compid")})`);
			}
		}
	}
	this.cookieSent = 1;
	return f.dot;
});

// browserOutput.dm:161
rt.def("/datum/chatOutput/proc/ping", function ping(f: Frame) {
	return "pong";
});

// browserOutput.dm:165
rt.def("/datum/chatOutput/proc/debug", function debug(f: Frame, error: Value) {
	let $0: any = time2text(rt.world().realtime, "YYYY-MM-DD hh:mm:ss");
	log_world(`[${$0}] Client: ${this.owner.key ? this.owner.key : this.owner} triggered JS error: ${error}`);
	return f.dot;
});

// browserOutput.dm:173
rt.def("/proc/icon2base64", function icon2base64(f: Frame, icon: Value, iconKey: Value) {
	let partial: Value = null;
	iconKey ??= "misc";
	if (!isicon(icon)) {
		return 0;
	}
	rt.op(f, "OutputReference", [rt.R.index], [GLOB.iconCache, iconKey, icon], false);
	let iconData: Value = GLOB.iconCache.ExportText(iconKey);
	return replacetext(copytext(rt.index((partial = splittext(iconData, "{")), 2), 3, -5), "\n", "");
});

// browserOutput.dm:181
rt.def("/proc/bicon", function bicon(f: Frame, thing: Value) {
	let I: Value = null, temp: Value = null;
	if (!thing) {
		return f.dot;
	}
	if (isicon(thing)) {
		return `<img class='icon misc' src='data:image/png;base64,${icon2base64(thing)}'>`;
	}
	let A: Value = thing;
	let key: Value = `${rt.istype(A.icon, T("/icon")) ? fmt("＃", [A.icon]) : A.icon}:${A.icon_state}`;
	if (!rt.index(GLOB.bicon_cache, key)) {
		I = icon(A.icon, A.icon_state, 2, 1);
		if (rt.istype(thing, T("/mob/living/carbon/human"))) {
			temp = I;
			(I = icon()).Insert(temp, { dir: 2 });
		}
		rt.setAt(GLOB.bicon_cache, key, icon2base64(I, key));
	}
	return `<img class='icon ${A.icon_state}' src='data:image/png;base64,${rt.index(GLOB.bicon_cache, key)}'>`;
});

// browserOutput.dm:218
rt.def("/proc/to_chat", function to_chat(f: Frame, target: Value, message: Value) {
	let targets: Value = null, I: Value = null, C: Value = null;
	if (!target) {
		return f.dot;
	}
	if (rt.istype(message, T("/image")) || rt.istype(message, T("/sound")) || rt.istype(target, T("/savefile"))) {
		rt.op(f, "Output", [], [target, message], false);
		CRASH(`Invalid message! ${message}`);
	}
	if (!istext(message)) {
		return f.dot;
	}
	if (target == rt.world()) {
		target = GLOB.clients;
	}
	if (!rt.istype(target, T("/list"))) {
		targets = list(target);
	} else if (!rt.len(f, (targets = target))) {
		return f.dot;
	}
	let original_message: Value = message;
	message = replacetext((message = replacetext((message = replacetext((message = replacetext(message, "ÿ\u0016", "")), "ÿ\u0015", "")), "\n", "<br>")), "\t", `${GLOB.TAB}${GLOB.TAB}`);
	for (I of each(targets)) {
		if (!(C = grab_client(I))) {
			continue;
		}
		rt.op(f, "Output", [], [C, original_message], false);
		if (!C.chatOutput || C.chatOutput.broken) {
			continue;
		}
		if (!C.chatOutput.loaded) {
			continue; // tg_js: not queued for goonchat, which never loads here (see load): the queue only grew, one entry per message
		}
		rt.op(f, "OutputControl", [], [C, url_encode(url_encode(message)), "browseroutput:output"], false);
	}
	return f.dot;
});

// browserOutput.dm:269
rt.def("/proc/grab_client", function grab_client(f: Frame, target: Value) {
	let M: Value = null;
	if (rt.istype(target, T("/client"))) {
		return target;
	} else if (ismob(target)) {
		if ((M = target).client) {
			return M.client;
		}
	} else {
		if (!rt.istype(target, T("/datum/mind"))) return f.dot;
		if (!((M = target).current && M.current.client)) return f.dot;
		return M.current.client;
	}
	return f.dot;
});
