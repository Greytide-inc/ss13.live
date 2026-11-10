// Based on /tg/station's code/modules/html_interface/html_interface.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// html_interface.dm:83
rt.def("/datum/controller/global_vars/proc/InitGlobalhtml_interfaces", function InitGlobalhtml_interfaces(f: Frame) {
	GLOB.html_interfaces = list();
	this.gvars_datum_init_order += "html_interfaces";
	return f.dot;
});

rt.type(2707, "/datum/html_interface", "/datum", {
	ref: null,
	title: null,
	layout: null,
	clients: null,
	head: "",
	width: null,
	height: null,
	content_elements: null,
}, { global: { asset_list: 666 } });

// html_interface.dm:93
rt.def("/datum/html_interface/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.content_elements = new_(T("/list"));
	return f.dot;
});

// html_interface.dm:115
rt.def("/datum/html_interface/proc/New", function New(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 700;
	}
	if (f.args[3] === null) {
		f.args[3] = 480;
	}
	if (f.args[4] === null) {
		f.args[4] = "";
	}
	GLOB.html_interfaces.Add(this);
	f.dot = parent_proc();
	this.ref = f.args[0];
	this.title = f.args[1];
	this.width = f.args[2];
	this.height = f.args[3];
	this.head = f.args[4];
	return f.dot;
}, false, { args: ["ref", "title", "width", "height", "head"] });

// html_interface.dm:126
rt.def("/datum/html_interface/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.closeAll();
	yield* GLOB.html_interfaces.Remove(this);
	return (yield* parent_proc());
}, true);

// html_interface.dm:137
rt.def("/datum/html_interface/proc/registerResources", function registerResources(f: Frame, resources: Value) {
	let R: Value = null;
	resources ??= list();
	rt.setAt(resources, "jquery.min.js", rt.rsc("code/modules/html_interface/js/jquery.min.js"));
	rt.setAt(resources, "bootstrap.min.js", rt.rsc("code/modules/html_interface/js/bootstrap.min.js"));
	rt.setAt(resources, "bootstrap.min.css", rt.rsc("code/modules/html_interface/css/bootstrap.min.css"));
	rt.setAt(resources, "html_interface.css", rt.rsc("code/modules/html_interface/css/html_interface.css"));
	rt.setAt(resources, "html_interface.js", rt.rsc("code/modules/html_interface/js/html_interface.js"));
	let assetlist: Value = list();
	for (R of each(resources)) {
		register_asset(R, rt.index(resources, R));
		assetlist += R;
	}
	if (!GLOB.asset_list) {
		GLOB.asset_list = list();
	}
	rt.setAt(GLOB.asset_list, this.type, assetlist);
	return f.dot;
});

// html_interface.dm:151
rt.def("/datum/html_interface/proc/createWindow", function createWindow(f: Frame, hclient: Value) {
	winclone(hclient.client, "window", fmt("browser_＃", [this]));
	let params: Value = rt.alist(f, ["size", `${this.width}x${this.height}`, "statusbar", "false", "on-close", fmt("byond://?src=＃&html_interface_action=onclose", [this])]);
	if (hclient.client.hi_last_pos) {
		rt.setAt(params, "pos", `${hclient.client.hi_last_pos}`);
	}
	winset(hclient.client, fmt("browser_＃", [this]), list2params(params));
	winset(hclient.client, fmt("browser_＃.browser", [this]), list2params(rt.alist(f, ["parent", fmt("browser_＃", [this]), "type", "browser", "pos", "0,0", "size", `${this.width}x${this.height}`, "anchor1", "0,0", "anchor2", "100,100", "use-title", "true", "auto-format", "false"])));
	return f.dot;
});

// html_interface.dm:166
rt.def("/datum/html_interface/proc/getTitle", function getTitle(f: Frame) {
	return this.title;
});

// html_interface.dm:173
rt.def("/datum/html_interface/proc/setTitle", function* setTitle(f: Frame, title: Value, ignore_cache: Value) {
	let hclient: Value = null, client: Value = null;
	ignore_cache ??= 0;
	this.title = title;
	for (client of each(this.clients)) {
		if ((hclient = (yield* this._getClient(rt.index(this.clients, client)))) && hclient.active) {
			this._renderTitle(rt.index(this.clients, client), ignore_cache);
		}
	}
	return f.dot;
}, true);

// html_interface.dm:180
rt.def("/datum/html_interface/proc/executeJavaScript", function* executeJavaScript(f: Frame, jscript: Value, hclient: Value) {
	let client: Value = null;
	if (hclient) {
		if (rt.istype((hclient = (yield* this.getClient(hclient))), T("/datum/html_interface_client"))) {
			if (hclient.is_loaded) {
				rt.op(f, "OutputControl", [], [hclient.client, list2params(list(jscript)), fmt("browser_＃.browser:eval", [this])], false);
			}
		}
	} else {
		for (client of each(this.clients)) {
			if (rt.index(this.clients, client)) {
				yield* this.executeJavaScript(jscript, rt.index(this.clients, client));
			}
		}
	}
	return f.dot;
}, true);

// html_interface.dm:188
rt.def("/datum/html_interface/proc/callJavaScript", function* callJavaScript(f: Frame, func: Value, _arguments: Value, hclient: Value) {
	let client: Value = null;
	if (!_arguments) {
		_arguments = (yield* new_(T("/list")));
	}
	if (hclient) {
		if (rt.istype((hclient = (yield* this.getClient(hclient))), T("/datum/html_interface_client"))) {
			if (hclient.is_loaded) {
				rt.op(f, "OutputControl", [], [hclient.client, list2params(_arguments), fmt("browser_＃.browser:＀", [this, func])], false);
			}
		}
	} else {
		for (client of each(this.clients)) {
			if (rt.index(this.clients, client)) {
				yield* this.callJavaScript(func, _arguments, rt.index(this.clients, client));
			}
		}
	}
	return f.dot;
}, true);

// html_interface.dm:204
rt.def("/datum/html_interface/proc/updateLayout", function* updateLayout(f: Frame, layout: Value) {
	let hclient: Value = null, client: Value = null;
	this.layout = layout;
	for (client of each(this.clients)) {
		if ((hclient = (yield* this._getClient(rt.index(this.clients, client)))) && hclient.active) {
			this._renderLayout(hclient);
		}
	}
	return f.dot;
}, true);

// html_interface.dm:214
rt.def("/datum/html_interface/proc/updateContent", function* updateContent(f: Frame, id: Value, content: Value, ignore_cache: Value) {
	let hclient: Value = null, client: Value = null;
	ignore_cache ??= 0;
	rt.setAt(this.content_elements, id, content);
	for (client of each(this.clients)) {
		if ((hclient = (yield* this._getClient(rt.index(this.clients, client)))) && hclient.active) {
			rt.spawnTail(f, -1, "/datum/html_interface/proc/updateContent: spawn at modules/html_interface/html_interface.dm:218", id, content, ignore_cache, hclient, client);
		}
	}
	return f.dot;
}, true);

// a spawn(-1) body of /datum/html_interface/proc/updateContent, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/html_interface/proc/updateContent: spawn at modules/html_interface/html_interface.dm:218", function* (f: Frame, id: Value, content: Value, ignore_cache: Value, hclient: Value, client: Value) {
	this._renderContent(id, hclient, ignore_cache);
	return null;
});

// html_interface.dm:221
rt.def("/datum/html_interface/proc/show", function* show(f: Frame, hclient: Value) {
	if (!rt.istype((hclient = (yield* this.getClient(hclient, 1))), T("/datum/html_interface_client"))) return f.dot;
	if (rt.isIn(f, this.type, GLOB.asset_list) && rt.istype(rt.index(GLOB.asset_list, this.type), T("/list"))) {
		yield* send_asset_list(hclient.client, rt.index(GLOB.asset_list, this.type), 1);
	}
	if (!(yield* winexists(hclient.client, fmt("browser_＃", [this])))) {
		this.createWindow(hclient);
	}
	hclient.is_loaded = 0;
	rt.op(f, "OutputControl", [], [hclient.client, replacetextEx(replacetextEx(file2text(rt.rsc("code/modules/html_interface/html_interface.html")), "[hsrc]", fmt("＃", [this])), "</head>", `${this.head}</head>`), fmt("browser_＃.browser", [this])], false);
	winshow(hclient.client, fmt("browser_＃", [this]), 1);
	while (hclient.client && hclient.active && !hclient.is_loaded) {
		yield* sleep(2);
	}
	return f.dot;
}, true);

// html_interface.dm:240
rt.def("/datum/html_interface/proc/hide", function* hide(f: Frame, hclient: Value) {
	if (!rt.istype((hclient = (yield* this.getClient(hclient))), T("/datum/html_interface_client"))) return f.dot;
	if (this.clients) {
		yield* this.clients.Remove(hclient.client);
		if (!rt.len(f, this.clients)) {
			this.clients = null;
		}
	}
	hclient.client.hi_last_pos = (yield* winget(hclient.client, fmt("browser_＃", [this]), "pos"));
	winshow(hclient.client, fmt("browser_＃", [this]), 0);
	winset(hclient.client, fmt("browser_＃", [this]), "parent=none");
	if (!hascall(this.ref, "hiOnHide")) return f.dot;
	yield* g.callDyn(f, this.ref, "hiOnHide", [hclient]);
	return f.dot;
}, true);

// html_interface.dm:257
rt.def("/datum/html_interface/proc/getClient", function* getClient(f: Frame, client: Value, create_if_not_exist: Value) {
	let mob: Value = null;
	create_if_not_exist ??= 0;
	if (rt.istype(client, T("/datum/html_interface_client"))) {
		return (yield* this._getClient(client));
	}
	if (ismob(client)) {
		client = (mob = client).client;
	}
	if (rt.istype(client, T("/client"))) {
		if (create_if_not_exist && (!this.clients || !rt.isIn(f, client, this.clients))) {
			if (!this.clients) {
				this.clients = (yield* new_(T("/list")));
			}
			if (!rt.isIn(f, client, this.clients)) {
				rt.setAt(this.clients, client, (yield* new_(T("/datum/html_interface_client"), client)));
			}
		}
		if (this.clients && rt.isIn(f, client, this.clients)) {
			return (yield* this._getClient(rt.index(this.clients, client)));
		}
		return null;
	} else {
		return null;
	}
}, true);

// html_interface.dm:272
rt.def("/datum/html_interface/proc/enableFor", function* enableFor(f: Frame, hclient: Value) {
	hclient.active = 1;
	yield* this.show(hclient);
	return f.dot;
}, true);

// html_interface.dm:277
rt.def("/datum/html_interface/proc/disableFor", function disableFor(f: Frame, hclient: Value) {
	hclient.active = 0;
	return f.dot;
});

// html_interface.dm:280
rt.def("/datum/html_interface/proc/isUsed", function* isUsed(f: Frame) {
	let hclient: Value = null, key: Value = null;
	if (this.clients && rt.len(f, this.clients) > 0) {
		for (key of each(this.clients)) {
			if (hclient = (yield* this._getClient(rt.index(this.clients, key)))) {
				if (hclient.active) {
					return 1;
				}
			} else {
				yield* this.clients.Remove(key);
			}
		}
	}
	return 0;
}, true);

// html_interface.dm:294
rt.def("/datum/html_interface/proc/closeAll", function* closeAll(f: Frame) {
	let client: Value = null;
	if (!this.clients) return f.dot;
	for (client of each(this.clients)) {
		yield* this.hide(rt.index(this.clients, client));
	}
	return f.dot;
}, true);

// html_interface.dm:302
rt.def("/datum/html_interface/proc/_getClient", function* _getClient(f: Frame, hclient: Value) {
	let res: Value = null;
	let $0: any;
	if (hclient) {
		if (hclient.client) {
			$0 = (hclient.client.inactivity <= 6000 ? 1 : 0);
			if ($0) {
				if (hascall(this.ref, "hiIsValidClient")) {
					$0 = (yield* g.callDyn(f, this.ref, "hiIsValidClient", [hclient, this]));
				} else {
					$0 = 1;
				}
			}
			if (res = $0) {
				if (!hclient.active) {
					yield* this.enableFor(hclient);
				}
			} else if (hclient.active) {
				yield* this.disableFor(hclient);
			}
			return hclient;
		} else {
			return null;
		}
	} else {
		return null;
	}
}, true);

// html_interface.dm:318
rt.def("/datum/html_interface/proc/_renderTitle", function _renderTitle(f: Frame, hclient: Value, ignore_cache: Value, ignore_loaded: Value) {
	ignore_cache ??= 0;
	ignore_loaded ??= 0;
	if (!(hclient && (ignore_loaded || hclient.is_loaded))) return f.dot;
	if (!(ignore_cache || this.title != hclient.title)) return f.dot;
	hclient.title = this.title;
	this.specificRenderTitle(hclient);
	rt.op(f, "OutputControl", [], [hclient.client, list2params(list(this.title)), fmt("browser_＃.browser:setTitle", [this])], false);
	return f.dot;
});

// html_interface.dm:329
rt.def("/datum/html_interface/proc/_renderLayout", function _renderLayout(f: Frame, hclient: Value, ignore_loaded: Value) {
	let html: Value = null, id: Value = null;
	ignore_loaded ??= 0;
	if (!(hclient && (ignore_loaded || hclient.is_loaded))) return f.dot;
	if ((html = this.layout) == hclient.layout) return f.dot;
	hclient.layout = html;
	rt.op(f, "OutputControl", [], [hclient.client, list2params(list(html)), fmt("browser_＃.browser:updateLayout", [this])], false);
	for (id of each(this.content_elements)) {
		this._renderContent(id, hclient, { ignore_loaded: ignore_loaded });
	}
	return f.dot;
});

// html_interface.dm:341
rt.def("/datum/html_interface/proc/_renderContent", function _renderContent(f: Frame, id: Value, hclient: Value, ignore_cache: Value, ignore_loaded: Value) {
	ignore_cache ??= 0;
	ignore_loaded ??= 0;
	if (!(hclient && (ignore_loaded || hclient.is_loaded))) return f.dot;
	let html: Value = rt.index(this.content_elements, id);
	if (!(ignore_cache || !rt.isIn(f, id, hclient.content_elements) || html != rt.index(hclient.content_elements, id))) return f.dot;
	rt.setAt(hclient.content_elements, id, html);
	rt.op(f, "OutputControl", [], [hclient.client, list2params(list(id, html)), fmt("browser_＃.browser:updateContent", [this])], false);
	return f.dot;
});

// html_interface.dm:351
rt.def("/datum/html_interface/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let hclient: Value = null;
	if (!rt.istype((hclient = (yield* this.getClient(f.usr.client))), T("/datum/html_interface_client"))) return f.dot;
	if (rt.isIn(f, "html_interface_action", href_list)) {
		const item = rt.at(href_list, "html_interface_action");
		if (item === "onload") {
			hclient.layout = null;
			hclient.content_elements.len = 0;
			this._renderTitle(hclient, 1, 1);
			this._renderLayout(hclient, 1);
			hclient.is_loaded = 1;
		} else if (item === "onclose") {
			yield* this.hide(hclient);
		}
	} else {
		if (!(this.ref && hclient.active)) return f.dot;
		yield* this.ref.Topic(href, href_list, hclient);
	}
	return f.dot;
}, true);
