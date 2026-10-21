// From code/modules/tgui/tgui.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4242, "/datum/tgui", "/datum", {
	user: null,
	src_object: null,
	title: null,
	ui_key: null,
	window_id: null,
	width: 0,
	height: 0,
	window_options: null,
	style: "nanotrasen",
	interface: null,
	autoupdate: 1,
	initialized: 0,
	initial_data: null,
	status: 2,
	state: null,
	master_ui: null,
	children: null,
	titlebar: 1,
	custom_browser_id: 0,
});

// /datum/tgui/proc/<init>  (code/modules/tgui/tgui.dm:18)
rt.def("/datum/tgui/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "window_options", rt.alist(f, ["focus", 0, "titlebar", 1, "can_resize", 1, "can_minimize", 1, "can_maximize", 0, "can_close", 1, "auto_format", 0]));
	$0 = $0;
	rt.setSv(f, "children", rt.list());
	return f.dot;
});

// /datum/tgui/proc/New  (code/modules/tgui/tgui.dm:60)  may sleep
rt.def("/datum/tgui/proc/New", function* New(f: Frame, user: Value, src_object: Value, ui_key: Value, _interface: Value, title: Value, width: Value, height: Value, master_ui: Value, state: Value, browser_id: Value) {
	let assets: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, src_object, ui_key, _interface, title, width, height, master_ui, state, browser_id, assets, $0, $1];
	if (live(width) === null) {
		width = 0;
	}
	if (live(height) === null) {
		height = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (live(browser_id) === null) {
		browser_id = null;
	}
	rt.setFv(f, "user", live(f.src), live(user));
	rt.setFv(f, "src_object", live(f.src), live(src_object));
	rt.setFv(f, "ui_key", live(f.src), live(ui_key));
	$0 = live(f.src);
	if (truthy(live(browser_id))) {
		$1 = live(browser_id);
	} else {
		$1 = fmt("＃-＀", [live(src_object), live(ui_key)]);
	}
	rt.setFv(f, "window_id", $0, $1);
	$0 = live(f.src);
	if (truthy(live(browser_id))) {
		$1 = 1;
	} else {
		$1 = 0;
	}
	rt.setFv(f, "custom_browser_id", $0, $1);
	yield* g.srcCall(f, "set_interface", live(_interface));
	if (truthy(live(title))) {
		rt.setFv(f, "title", live(f.src), (yield* g.call(f, P("/proc/sanitize"), null, [live(title)])));
	}
	if (truthy(live(width))) {
		rt.setFv(f, "width", live(f.src), live(width));
	}
	if (truthy(live(height))) {
		rt.setFv(f, "height", live(f.src), live(height));
	}
	rt.setFv(f, "master_ui", live(f.src), live(master_ui));
	if (truthy(live(master_ui))) {
		rt.modField(f, live(master_ui), "children", live(f.src), add);
	}
	rt.setFv(f, "state", live(f.src), live(state));
	yield* g.callName(f, (assets = (yield* g.call(f, P("/proc/get_asset_datum"), null, [T("/datum/asset/simple/tgui")]))), "send", [live(user)]);
	return f.dot;
}, true);

// /datum/tgui/proc/open  (code/modules/tgui/tgui.dm:86)  may sleep
rt.def("/datum/tgui/proc/open", function* open(f: Frame) {
	let window_size: Value = null, debugable: Value = null;
	f.vars = () => [window_size, debugable];
	if (!truthy(rt.fv(f, "client", rt.sv(f, "user")))) {
		return live(f.dot);
	}
	yield* g.callSrc(f, "update_status", ["push", 0], rt.Args.Named);
	if (rt.lt(rt.sv(f, "status"), 1)) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "initial_data"))) {
		yield* g.srcCall(f, "set_initial_data", (yield* g.callName(f, rt.sv(f, "src_object"), "ui_data", [rt.sv(f, "user")])));
	}
	window_size = "";
	if ((truthy(rt.sv(f, "width")) && truthy(rt.sv(f, "height")))) {
		window_size = fmt("size=＀x＀;", [rt.sv(f, "width"), rt.sv(f, "height")]);
	}
	debugable = (yield* g.call(f, P("/proc/check_rights_for"), null, [rt.fv(f, "client", rt.sv(f, "user")), 32]));
	rt.op(f, "Browse", [], [rt.sv(f, "user"), (yield* g.srcCall(f, "get_html", live(debugable))), fmt("window=＀;＀＀", [rt.sv(f, "window_id"), live(window_size), (yield* g.call(f, P("/proc/list2params"), null, [rt.sv(f, "window_options")]))])], false);
	if (!truthy(rt.sv(f, "custom_browser_id"))) {
		yield* g.call(f, P("/proc/winset"), null, [rt.sv(f, "user"), rt.sv(f, "window_id"), fmt("on-close=\"uiclose ＃\"", [live(f.src)])]);
	}
	yield* g.callName(f, rt.gl("SStgui"), "on_open", [live(f.src)]);
	return f.dot;
}, true);

// /datum/tgui/proc/reinitialize  (code/modules/tgui/tgui.dm:117)  may sleep
rt.def("/datum/tgui/proc/reinitialize", function* reinitialize(f: Frame, _interface: Value, data: Value) {
	f.vars = () => [_interface, data];
	if (truthy(live(_interface))) {
		yield* g.srcCall(f, "set_interface", live(_interface));
	}
	if (truthy(live(data))) {
		yield* g.srcCall(f, "set_initial_data", live(data));
	}
	yield* g.srcCall(f, "open");
	return f.dot;
}, true);

// /datum/tgui/proc/close  (code/modules/tgui/tgui.dm:128)  may sleep
rt.def("/datum/tgui/proc/close", function* close(f: Frame) {
	let child: Value = null;
	let $e: any;
	f.vars = () => [child, $e];
	rt.op(f, "Browse", [], [rt.sv(f, "user"), null, fmt("window=＀", [rt.sv(f, "window_id")])], false);
	yield* g.callName(f, rt.gl("SStgui"), "on_close", [live(f.src)]);
	child = null;
	rt.forList(f, 0, rt.sv(f, "children"), T("/datum/tgui"));
	while (($e = rt.next(f, 0)) !== undefined) {
		child = $e;
		yield* g.callName(f, live(child), "close", []);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "children"), "Cut", []);
	rt.setSv(f, "state", null);
	rt.setSv(f, "master_ui", null);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /datum/tgui/proc/set_style  (code/modules/tgui/tgui.dm:155)
rt.def("/datum/tgui/proc/set_style", function set_style(f: Frame, style: Value) {
	rt.setFv(f, "style", live(f.src), rt.call(f, P("/proc/lowertext"), null, [live(style)]));
	return f.dot;
});

// /datum/tgui/proc/set_interface  (code/modules/tgui/tgui.dm:165)
rt.def("/datum/tgui/proc/set_interface", function set_interface(f: Frame, _interface: Value) {
	rt.setFv(f, "interface", live(f.src), rt.call(f, P("/proc/lowertext"), null, [live(_interface)]));
	return f.dot;
});

// /datum/tgui/proc/set_autoupdate  (code/modules/tgui/tgui.dm:175)
rt.def("/datum/tgui/proc/set_autoupdate", function set_autoupdate(f: Frame, state: Value) {
	f.vars = () => [state];
	if (live(state) === null) {
		state = 1;
	}
	rt.setSv(f, "autoupdate", live(state));
	return f.dot;
});

// /datum/tgui/proc/set_initial_data  (code/modules/tgui/tgui.dm:186)
rt.def("/datum/tgui/proc/set_initial_data", function set_initial_data(f: Frame, data: Value) {
	rt.setSv(f, "initial_data", live(data));
	return f.dot;
});

// /datum/tgui/proc/get_html  (code/modules/tgui/tgui.dm:201)
rt.def("/datum/tgui/proc/get_html", function get_html(f: Frame, inline: Value) {
	let html: Value = null;
	f.vars = () => [html];
	html = null;
	if (truthy(live(inline))) {
		html = rt.call(f, P("/proc/replacetextEx"), null, [rt.fv(f, "basehtml", rt.gl("SStgui")), "{}", rt.callSrc(f, "get_json", [rt.sv(f, "initial_data")])]);
	} else {
		html = rt.fv(f, "basehtml", rt.gl("SStgui"));
	}
	return (html = rt.call(f, P("/proc/replacetextEx"), null, [(html = rt.call(f, P("/proc/replacetextEx"), null, [live(html), "[ref]", fmt("＃", [live(f.src)])])), "[style]", rt.sv(f, "style")]));
});

// /datum/tgui/proc/get_config_data  (code/modules/tgui/tgui.dm:216)
rt.def("/datum/tgui/proc/get_config_data", function get_config_data(f: Frame) {
	let config_data: Value = null;
	f.vars = () => [config_data];
	return (config_data = rt.alist(f, ["title", rt.sv(f, "title"), "status", rt.sv(f, "status"), "screen", rt.fv(f, "ui_screen", rt.sv(f, "src_object")), "style", rt.sv(f, "style"), "interface", rt.sv(f, "interface"), "fancy", rt.gv(f, "tgui_fancy", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "user")))), "locked", (rt.gv(f, "tgui_lock", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "user")))) && (!truthy(rt.sv(f, "custom_browser_id")) ? 1 : 0)), "window", rt.sv(f, "window_id"), "ref", fmt("＃", [live(f.src)]), "user", rt.alist(f, ["name", rt.fv(f, "name", rt.sv(f, "user")), "ref", fmt("＃", [rt.sv(f, "user")])]), "srcObject", rt.alist(f, ["name", fmt("＀", [rt.sv(f, "src_object")]), "ref", fmt("＃", [rt.sv(f, "src_object")])]), "titlebar", rt.sv(f, "titlebar")]));
});

// /datum/tgui/proc/get_json  (code/modules/tgui/tgui.dm:247)
rt.def("/datum/tgui/proc/get_json", function get_json(f: Frame, data: Value) {
	let json_data: Value = null, json: Value = null;
	f.vars = () => [json_data, json];
	rt.setAt((json_data = rt.list()), "config", rt.callSrc(f, "get_config_data", []));
	if (live(data) !== null) {
		rt.setAt(live(json_data), "data", live(data));
	}
	return (json = rt.call(f, P("/proc/replacetext"), null, [(json = rt.call(f, P("/proc/replacetext"), null, [(json = rt.call(f, P("/proc/json_encode"), null, [live(json_data)])), "ÿ\u0015", ""])), "ÿ\u0016", ""]));
});

// /datum/tgui/proc/Topic  (code/modules/tgui/tgui.dm:268)  may sleep
rt.def("/datum/tgui/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let action: Value = null, params: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [href, href_list, action, params, $0, $1, $2];
	if (!isEqual(rt.sv(f, "user"), live(f.usr))) {
		return live(f.dot);
	}
	action = rt.at(live(href_list), "action");
	params = live(href_list);
	(params = rt.modify(live(params), "action", subtract));
	$0 = live(action);
	if ($0 === "tgui:initialize") {
		$0 = rt.sv(f, "user");
		$1 = (yield* g.call(f, P("/proc/url_encode"), null, [(yield* g.srcCall(f, "get_json", rt.sv(f, "initial_data")))]));
		if (truthy(rt.sv(f, "custom_browser_id"))) {
			$2 = rt.sv(f, "window_id");
		} else {
			$2 = fmt("＀.browser", [rt.sv(f, "window_id")]);
		}
		rt.op(f, "OutputControl", [], [$0, $1, fmt("＀:initialize", [$2])], false);
		rt.setSv(f, "initialized", 1);
	} else if ($0 === "tgui:view") {
		if (truthy(rt.at(live(params), "screen"))) {
			rt.setFv(f, "ui_screen", rt.sv(f, "src_object"), rt.at(live(params), "screen"));
		}
		yield* g.callName(f, rt.gl("SStgui"), "update_uis", [rt.sv(f, "src_object")]);
	} else if ($0 === "tgui:link") {
		rt.op(f, "Link", [], [rt.sv(f, "user"), rt.at(live(params), "url")], false);
	} else if ($0 === "tgui:fancy") {
		rt.setFv(f, "tgui_fancy", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "user"))), 1);
	} else if ($0 === "tgui:nofrills") {
		rt.setFv(f, "tgui_fancy", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "user"))), 0);
	} else {
		yield* g.callSrc(f, "update_status", ["push", 0], rt.Args.Named);
		if (truthy((yield* g.callName(f, rt.sv(f, "src_object"), "ui_act", [live(action), live(params), live(f.src), rt.sv(f, "state")])))) {
			yield* g.callName(f, rt.gl("SStgui"), "update_uis", [rt.sv(f, "src_object")]);
		}
	}
	return f.dot;
}, true);

// /datum/tgui/proc/process  (code/modules/tgui/tgui.dm:302)  may sleep
rt.def("/datum/tgui/proc/process", function* process(f: Frame, force: Value) {
	let host: Value = null;
	f.vars = () => [force, host];
	if (live(force) === null) {
		force = 0;
	}
	host = (yield* g.callName(f, rt.sv(f, "src_object"), "ui_host", []));
	if (((!truthy(rt.sv(f, "src_object")) || !truthy(live(host))) || !truthy(rt.sv(f, "user")))) {
		yield* g.srcCall(f, "close");
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "status")) && (truthy(live(force)) || truthy(rt.sv(f, "autoupdate"))))) {
		yield* g.srcCall(f, "update");
	} else {
		yield* g.callSrc(f, "update_status", ["push", 1], rt.Args.Named);
	}
	return f.dot;
}, true, { waitfor: false });

// /datum/tgui/proc/push_data  (code/modules/tgui/tgui.dm:321)  may sleep
rt.def("/datum/tgui/proc/push_data", function* push_data(f: Frame, data: Value, force: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [data, force, $0, $1, $2];
	if (live(force) === null) {
		force = 0;
	}
	yield* g.callSrc(f, "update_status", ["push", 0], rt.Args.Named);
	if (!truthy(rt.sv(f, "initialized"))) {
		return live(f.dot);
	}
	if ((rt.le(rt.sv(f, "status"), 0) && !truthy(live(force)))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "user");
	$1 = (yield* g.call(f, P("/proc/url_encode"), null, [(yield* g.srcCall(f, "get_json", live(data)))]));
	if (truthy(rt.sv(f, "custom_browser_id"))) {
		$2 = rt.sv(f, "window_id");
	} else {
		$2 = fmt("＀.browser", [rt.sv(f, "window_id")]);
	}
	rt.op(f, "OutputControl", [], [$0, $1, fmt("＀:update", [$2])], false);
	return f.dot;
}, true);

// /datum/tgui/proc/update  (code/modules/tgui/tgui.dm:339)  may sleep
rt.def("/datum/tgui/proc/update", function* update(f: Frame, force_open: Value) {
	f.vars = () => [force_open];
	if (live(force_open) === null) {
		force_open = 0;
	}
	yield* g.callName(f, rt.sv(f, "src_object"), "ui_interact", [rt.sv(f, "user"), rt.sv(f, "ui_key"), live(f.src), live(force_open), rt.sv(f, "master_ui"), rt.sv(f, "state")]);
	return f.dot;
}, true);

// /datum/tgui/proc/update_status  (code/modules/tgui/tgui.dm:349)  may sleep
rt.def("/datum/tgui/proc/update_status", function* update_status(f: Frame, push: Value) {
	let status: Value = null;
	f.vars = () => [push, status];
	if (live(push) === null) {
		push = 0;
	}
	status = (yield* g.callName(f, rt.sv(f, "src_object"), "ui_status", [rt.sv(f, "user"), rt.sv(f, "state")]));
	if (truthy(rt.sv(f, "master_ui"))) {
		status = (yield* g.call(f, P("/proc/min"), null, [live(status), rt.fv(f, "status", rt.sv(f, "master_ui"))]));
	}
	yield* g.srcCall(f, "set_status", live(status), live(push));
	if (!isEqual(live(status), -1)) return f.dot;
	yield* g.srcCall(f, "close");
	return f.dot;
}, true);

// /datum/tgui/proc/set_status  (code/modules/tgui/tgui.dm:366)  may sleep
rt.def("/datum/tgui/proc/set_status", function* set_status(f: Frame, status: Value, push: Value) {
	f.vars = () => [status, push];
	if (live(push) === null) {
		push = 0;
	}
	if (isEqual(rt.fv(f, "status", live(f.src)), live(status))) return f.dot;
	if (isEqual(rt.fv(f, "status", live(f.src)), 0)) {
		rt.setFv(f, "status", live(f.src), live(status));
		if (truthy(live(push))) {
			yield* g.srcCall(f, "update");
		}
	} else {
		rt.setFv(f, "status", live(f.src), live(status));
		if (!(isEqual(live(status), 0) || truthy(live(push)))) return f.dot;
		yield* g.callSrc(f, "push_data", [null, null, "force", 1], rt.Args.Named);
	}
	return f.dot;
}, true);

// /datum/tgui/proc/set_titlebar  (code/modules/tgui/tgui.dm:377)
rt.def("/datum/tgui/proc/set_titlebar", function set_titlebar(f: Frame, value: Value) {
	rt.setSv(f, "titlebar", live(value));
	return f.dot;
});
