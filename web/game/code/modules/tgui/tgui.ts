// Based on /tg/station's code/modules/tgui/tgui.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// tgui.dm:18
rt.def("/datum/tgui/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.window_options = rt.alist(f, ["focus", 0, "titlebar", 1, "can_resize", 1, "can_minimize", 1, "can_maximize", 0, "can_close", 1, "auto_format", 0]);

	this.children = list();
	return f.dot;
});

// tgui.dm:60
rt.def("/datum/tgui/proc/New", function* New(f: Frame, user: Value, src_object: Value, ui_key: Value, _interface: Value, title: Value, width: Value, height: Value, master_ui: Value, state: Value, browser_id: Value) {
	let assets: Value = null;
	width ??= 0;
	height ??= 0;
	state ??= GLOB.default_state;
	this.user = user;
	this.src_object = src_object;
	this.ui_key = ui_key;
	let $0: any = this;
	$0.window_id = browser_id ? browser_id : fmt("＃-＀", [src_object, ui_key]);
	this.custom_browser_id = browser_id ? 1 : 0;
	this.set_interface(_interface);
	if (title) {
		this.title = sanitize(title);
	}
	if (width) {
		this.width = width;
	}
	if (height) {
		this.height = height;
	}
	this.master_ui = master_ui;
	if (master_ui) {
		master_ui.children += this;
	}
	this.state = state;
	yield* (assets = (yield* get_asset_datum(T("/datum/asset/simple/tgui")))).send(user);
	return f.dot;
}, true);

// tgui.dm:86
rt.def("/datum/tgui/proc/open", function* open(f: Frame) {
	if (!this.user.client) {
		return f.dot;
	}
	yield* this.update_status({ push: 0 });
	if (this.status < UI_UPDATE) {
		return f.dot;
	}
	if (!this.initial_data) {
		this.set_initial_data((yield* this.src_object.ui_data(this.user)));
	}
	let window_size: Value = "";
	if (this.width && this.height) {
		window_size = `size=${this.width}x${this.height};`;
	}
	let debugable: Value = check_rights_for(this.user.client, 32);
	rt.op(f, "Browse", [], [this.user, this.get_html(debugable), `window=${this.window_id};${window_size}${list2params(this.window_options)}`], false);
	if (!this.custom_browser_id) {
		winset(this.user, this.window_id, fmt("on-close=\"uiclose ＃\"", [this]));
	}
	GLOB.SStgui.on_open(this);
	return f.dot;
}, true);

// tgui.dm:117
rt.def("/datum/tgui/proc/reinitialize", function* reinitialize(f: Frame, _interface: Value, data: Value) {
	if (_interface) {
		this.set_interface(_interface);
	}
	if (data) {
		this.set_initial_data(data);
	}
	yield* this.open();
	return f.dot;
}, true);

// tgui.dm:128
rt.def("/datum/tgui/proc/close", function* close(f: Frame) {
	let child: Value = null;
	rt.op(f, "Browse", [], [this.user, null, `window=${this.window_id}`], false);
	GLOB.SStgui.on_close(this);
	for (child of each(this.children, T("/datum/tgui"))) {
		yield* child.close();
	}
	this.children.Cut();
	this.state = null;
	this.master_ui = null;
	yield* qdel(this);
	return f.dot;
}, true);

// tgui.dm:155
rt.def("/datum/tgui/proc/set_style", function set_style(f: Frame, style: Value) {
	this.style = lowertext(style);
	return f.dot;
});

// tgui.dm:165
rt.def("/datum/tgui/proc/set_interface", function set_interface(f: Frame, _interface: Value) {
	this.interface = lowertext(_interface);
	return f.dot;
});

// tgui.dm:175
rt.def("/datum/tgui/proc/set_autoupdate", function set_autoupdate(f: Frame, state: Value) {
	state ??= 1;
	this.autoupdate = state;
	return f.dot;
});

// tgui.dm:186
rt.def("/datum/tgui/proc/set_initial_data", function set_initial_data(f: Frame, data: Value) {
	this.initial_data = data;
	return f.dot;
});

// tgui.dm:201
rt.def("/datum/tgui/proc/get_html", function get_html(f: Frame, inline: Value) {
	let html: Value = null;
	if (inline) {
		html = replacetextEx(GLOB.SStgui.basehtml, "{}", this.get_json(this.initial_data));
	} else {
		html = GLOB.SStgui.basehtml;
	}
	return (html = replacetextEx((html = replacetextEx(html, "[ref]", fmt("＃", [this]))), "[style]", this.style));
});

// tgui.dm:216
rt.def("/datum/tgui/proc/get_config_data", function get_config_data(f: Frame) {
	let config_data: Value = null;
	return (config_data = rt.alist(f, ["title", this.title, "status", this.status, "screen", this.src_object.ui_screen, "style", this.style, "interface", this.interface, "fancy", this.user.client.prefs.tgui_fancy, "locked", (this.user.client.prefs.tgui_lock && (!this.custom_browser_id ? 1 : 0)), "window", this.window_id, "ref", fmt("＃", [this]), "user", rt.alist(f, ["name", this.user.name, "ref", fmt("＃", [this.user])]), "srcObject", rt.alist(f, ["name", `${this.src_object}`, "ref", fmt("＃", [this.src_object])]), "titlebar", this.titlebar]));
});

// tgui.dm:247
rt.def("/datum/tgui/proc/get_json", function get_json(f: Frame, data: Value) {
	let json_data: Value = null, json: Value = null;
	rt.setAt((json_data = list()), "config", this.get_config_data());
	if (data !== null) {
		rt.setAt(json_data, "data", data);
	}
	return (json = replacetext((json = replacetext((json = json_encode(json_data)), "ÿ\u0015", "")), "ÿ\u0016", ""));
});

// tgui.dm:268
rt.def("/datum/tgui/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let $0: any, $1: any, $2: any;
	if (this.user != f.usr) {
		return f.dot;
	}
	let action: Value = rt.at(href_list, "action");
	let params: Value = href_list;
	params -= "action";
	if (action === "tgui:initialize") {
		$0 = this.user;
		$1 = url_encode(this.get_json(this.initial_data));
		if (this.custom_browser_id) {
			$2 = this.window_id;
		} else {
			$2 = `${this.window_id}.browser`;
		}
		rt.op(f, "OutputControl", [], [$0, $1, `${$2}:initialize`], false);
		this.initialized = 1;
	} else if (action === "tgui:view") {
		if (rt.at(params, "screen")) {
			this.src_object.ui_screen = rt.at(params, "screen");
		}
		GLOB.SStgui.update_uis(this.src_object);
	} else if (action === "tgui:link") {
		rt.op(f, "Link", [], [this.user, rt.at(params, "url")], false);
	} else if (action === "tgui:fancy") {
		this.user.client.prefs.tgui_fancy = 1;
	} else if (action === "tgui:nofrills") {
		this.user.client.prefs.tgui_fancy = 0;
	} else {
		yield* this.update_status({ push: 0 });
		if (yield* this.src_object.ui_act(action, params, this, this.state)) {
			GLOB.SStgui.update_uis(this.src_object);
		}
	}
	return f.dot;
}, true);

// tgui.dm:302
rt.def("/datum/tgui/proc/process", function* process(f: Frame, force: Value) {
	force ??= 0;
	let host: Value = this.src_object.ui_host();
	if (!this.src_object || !host || !this.user) {
		yield* this.close();
		return f.dot;
	}
	if (this.status && (force || this.autoupdate)) {
		yield* this.update();
	} else {
		yield* this.update_status({ push: 1 });
	}
	return f.dot;
}, true, { waitfor: false });

// tgui.dm:321
rt.def("/datum/tgui/proc/push_data", function* push_data(f: Frame, data: Value, force: Value) {
	let $2: any;
	force ??= 0;
	yield* this.update_status({ push: 0 });
	if (!this.initialized) {
		return f.dot;
	}
	if (this.status <= UI_DISABLED && !force) {
		return f.dot;
	}
	let $0: any = this.user;
	let $1: any = url_encode(this.get_json(data));
	if (this.custom_browser_id) {
		$2 = this.window_id;
	} else {
		$2 = `${this.window_id}.browser`;
	}
	rt.op(f, "OutputControl", [], [$0, $1, `${$2}:update`], false);
	return f.dot;
}, true);

// tgui.dm:339
rt.def("/datum/tgui/proc/update", function* update(f: Frame, force_open: Value) {
	force_open ??= 0;
	yield* this.src_object.ui_interact(this.user, this.ui_key, this, force_open, this.master_ui, this.state);
	return f.dot;
}, true);

// tgui.dm:349
rt.def("/datum/tgui/proc/update_status", function* update_status(f: Frame, push: Value) {
	push ??= 0;
	let status: Value = (yield* this.src_object.ui_status(this.user, this.state));
	if (this.master_ui) {
		status = min(status, this.master_ui.status);
	}
	yield* this.set_status(status, push);
	if (status != UI_CLOSE) return f.dot;
	yield* this.close();
	return f.dot;
}, true);

// tgui.dm:366
rt.def("/datum/tgui/proc/set_status", function* set_status(f: Frame, status: Value, push: Value) {
	push ??= 0;
	if (this.status == status) return f.dot;
	if (this.status == UI_DISABLED) {
		this.status = status;
		if (push) {
			yield* this.update();
		}
	} else {
		this.status = status;
		if (!(status == UI_DISABLED || push)) return f.dot;
		yield* this.push_data(null, { force: 1 });
	}
	return f.dot;
}, true);
