// From code/modules/html_interface/html_interface.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalhtml_interfaces  (code/modules/html_interface/html_interface.dm:83)
rt.def("/datum/controller/global_vars/proc/InitGlobalhtml_interfaces", function InitGlobalhtml_interfaces(f: Frame) {
	rt.setGl("html_interfaces", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "html_interfaces", add);
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

// /datum/html_interface/proc/<init>  (code/modules/html_interface/html_interface.dm:93)
rt.def("/datum/html_interface/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "content_elements", rt.new_(f, T("/list"), []));
	return f.dot;
});

// /datum/html_interface/proc/New  (code/modules/html_interface/html_interface.dm:115)
rt.def("/datum/html_interface/proc/New", function New(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 700;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 480;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = "";
	}
	rt.callName(f, rt.gl("html_interfaces"), "Add", [live(f.src)]);
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "ref", live(f.src), live(f.args[0]));
	rt.setFv(f, "title", live(f.src), live(f.args[1]));
	rt.setFv(f, "width", live(f.src), live(f.args[2]));
	rt.setFv(f, "height", live(f.src), live(f.args[3]));
	rt.setFv(f, "head", live(f.src), live(f.args[4]));
	return f.dot;
}, false, { args: ["ref", "title", "width", "height", "head"] });

// /datum/html_interface/proc/Destroy  (code/modules/html_interface/html_interface.dm:126)  may sleep
rt.def("/datum/html_interface/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, live(f.src), "closeAll", []);
	yield* g.callName(f, rt.gl("html_interfaces"), "Remove", [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/html_interface/proc/registerResources  (code/modules/html_interface/html_interface.dm:137)
rt.def("/datum/html_interface/proc/registerResources", function registerResources(f: Frame, resources: Value) {
	let assetlist: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [resources, assetlist, R, $e];
	if (live(resources) === null) {
		resources = rt.list();
	}
	rt.setAt(live(resources), "jquery.min.js", rt.rsc("code/modules/html_interface/js/jquery.min.js"));
	rt.setAt(live(resources), "bootstrap.min.js", rt.rsc("code/modules/html_interface/js/bootstrap.min.js"));
	rt.setAt(live(resources), "bootstrap.min.css", rt.rsc("code/modules/html_interface/css/bootstrap.min.css"));
	rt.setAt(live(resources), "html_interface.css", rt.rsc("code/modules/html_interface/css/html_interface.css"));
	rt.setAt(live(resources), "html_interface.js", rt.rsc("code/modules/html_interface/js/html_interface.js"));
	assetlist = rt.list();
	R = null;
	rt.forList(f, 0, live(resources));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		rt.call(f, P("/proc/register_asset"), null, [live(R), rt.index(live(resources), live(R))]);
		assetlist = rt.modify(live(assetlist), live(R), add);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.gl("asset_list"))) {
		rt.setGl("asset_list", rt.list());
	}
	rt.setAt(rt.gl("asset_list"), rt.sv(f, "type"), live(assetlist));
	return f.dot;
});

// /datum/html_interface/proc/createWindow  (code/modules/html_interface/html_interface.dm:151)
rt.def("/datum/html_interface/proc/createWindow", function createWindow(f: Frame, hclient: Value) {
	let params: Value = null;
	f.vars = () => [params];
	rt.call(f, P("/proc/winclone"), null, [rt.fv(f, "client", live(hclient)), "window", fmt("browser_＃", [live(f.src)])]);
	params = rt.alist(f, ["size", fmt("＀x＀", [rt.sv(f, "width"), rt.sv(f, "height")]), "statusbar", "false", "on-close", fmt("byond://?src=＃&html_interface_action=onclose", [live(f.src)])]);
	if (truthy(rt.gv(f, "hi_last_pos", rt.fv(f, "client", live(hclient))))) {
		rt.setAt(live(params), "pos", fmt("＀", [rt.gv(f, "hi_last_pos", rt.fv(f, "client", live(hclient)))]));
	}
	rt.call(f, P("/proc/winset"), null, [rt.fv(f, "client", live(hclient)), fmt("browser_＃", [live(f.src)]), rt.call(f, P("/proc/list2params"), null, [live(params)])]);
	rt.call(f, P("/proc/winset"), null, [rt.fv(f, "client", live(hclient)), fmt("browser_＃.browser", [live(f.src)]), rt.call(f, P("/proc/list2params"), null, [rt.alist(f, ["parent", fmt("browser_＃", [live(f.src)]), "type", "browser", "pos", "0,0", "size", fmt("＀x＀", [rt.sv(f, "width"), rt.sv(f, "height")]), "anchor1", "0,0", "anchor2", "100,100", "use-title", "true", "auto-format", "false"])])]);
	return f.dot;
});

// /datum/html_interface/proc/getTitle  (code/modules/html_interface/html_interface.dm:166)
rt.def("/datum/html_interface/proc/getTitle", function getTitle(f: Frame) {
	return rt.fv(f, "title", live(f.src));
});

// /datum/html_interface/proc/setTitle  (code/modules/html_interface/html_interface.dm:173)  may sleep
rt.def("/datum/html_interface/proc/setTitle", function* setTitle(f: Frame, title: Value, ignore_cache: Value) {
	let hclient: Value = null, client: Value = null;
	let $e: any;
	f.vars = () => [title, ignore_cache, hclient, client, $e];
	if (live(ignore_cache) === null) {
		ignore_cache = 0;
	}
	rt.setFv(f, "title", live(f.src), live(title));
	hclient = null;
	client = null;
	rt.forList(f, 0, rt.fv(f, "clients", live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		client = $e;
		if ((truthy((hclient = (yield* g.callName(f, live(f.src), "_getClient", [rt.index(rt.fv(f, "clients", live(f.src)), live(client))])))) && truthy(rt.fv(f, "active", live(hclient))))) {
			yield* g.callName(f, live(f.src), "_renderTitle", [rt.index(rt.fv(f, "clients", live(f.src)), live(client)), live(ignore_cache)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/html_interface/proc/executeJavaScript  (code/modules/html_interface/html_interface.dm:180)  may sleep
rt.def("/datum/html_interface/proc/executeJavaScript", function* executeJavaScript(f: Frame, jscript: Value, hclient: Value) {
	let client: Value = null;
	let $e: any;
	f.vars = () => [jscript, hclient, client, $e];
	if (live(hclient) === null) {
		hclient = null;
	}
	if (truthy(live(hclient))) {
		if (truthy((rt.istype((hclient = (yield* g.srcCall(f, "getClient", live(hclient)))), T("/datum/html_interface_client")) ? 1 : 0))) {
			if (truthy(rt.fv(f, "is_loaded", live(hclient)))) {
				rt.op(f, "OutputControl", [], [rt.fv(f, "client", live(hclient)), (yield* g.call(f, P("/proc/list2params"), null, [rt.list(live(jscript))])), fmt("browser_＃.browser:eval", [live(f.src)])], false);
			}
		}
	} else {
		client = null;
		rt.forList(f, 0, rt.fv(f, "clients", live(f.src)));
		while (($e = rt.next(f, 0)) !== undefined) {
			client = $e;
			if (truthy(rt.index(rt.fv(f, "clients", live(f.src)), live(client)))) {
				yield* g.callName(f, live(f.src), "executeJavaScript", [live(jscript), rt.index(rt.fv(f, "clients", live(f.src)), live(client))]);
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /datum/html_interface/proc/callJavaScript  (code/modules/html_interface/html_interface.dm:188)  may sleep
rt.def("/datum/html_interface/proc/callJavaScript", function* callJavaScript(f: Frame, func: Value, _arguments: Value, hclient: Value) {
	let client: Value = null;
	let $e: any;
	f.vars = () => [func, _arguments, hclient, client, $e];
	if (live(hclient) === null) {
		hclient = null;
	}
	if (!truthy(live(_arguments))) {
		_arguments = (yield* g.new_(f, T("/list"), []));
	}
	if (truthy(live(hclient))) {
		if (truthy((rt.istype((hclient = (yield* g.srcCall(f, "getClient", live(hclient)))), T("/datum/html_interface_client")) ? 1 : 0))) {
			if (truthy(rt.fv(f, "is_loaded", live(hclient)))) {
				rt.op(f, "OutputControl", [], [rt.fv(f, "client", live(hclient)), (yield* g.call(f, P("/proc/list2params"), null, [live(_arguments)])), fmt("browser_＃.browser:＀", [live(f.src), live(func)])], false);
			}
		}
	} else {
		client = null;
		rt.forList(f, 0, rt.fv(f, "clients", live(f.src)));
		while (($e = rt.next(f, 0)) !== undefined) {
			client = $e;
			if (truthy(rt.index(rt.fv(f, "clients", live(f.src)), live(client)))) {
				yield* g.callName(f, live(f.src), "callJavaScript", [live(func), live(_arguments), rt.index(rt.fv(f, "clients", live(f.src)), live(client))]);
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /datum/html_interface/proc/updateLayout  (code/modules/html_interface/html_interface.dm:204)  may sleep
rt.def("/datum/html_interface/proc/updateLayout", function* updateLayout(f: Frame, layout: Value) {
	let hclient: Value = null, client: Value = null;
	let $e: any;
	f.vars = () => [layout, hclient, client, $e];
	rt.setFv(f, "layout", live(f.src), live(layout));
	hclient = null;
	client = null;
	rt.forList(f, 0, rt.fv(f, "clients", live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		client = $e;
		if ((truthy((hclient = (yield* g.callName(f, live(f.src), "_getClient", [rt.index(rt.fv(f, "clients", live(f.src)), live(client))])))) && truthy(rt.fv(f, "active", live(hclient))))) {
			yield* g.callName(f, live(f.src), "_renderLayout", [live(hclient)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/html_interface/proc/updateContent  (code/modules/html_interface/html_interface.dm:214)  may sleep
rt.def("/datum/html_interface/proc/updateContent", function* updateContent(f: Frame, id: Value, content: Value, ignore_cache: Value) {
	let hclient: Value = null, client: Value = null;
	let $e: any;
	f.vars = () => [id, content, ignore_cache, hclient, client, $e];
	if (live(ignore_cache) === null) {
		ignore_cache = 0;
	}
	rt.setAt(rt.fv(f, "content_elements", live(f.src)), live(id), live(content));
	hclient = null;
	client = null;
	rt.forList(f, 0, rt.fv(f, "clients", live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		client = $e;
		if ((truthy((hclient = (yield* g.callName(f, live(f.src), "_getClient", [rt.index(rt.fv(f, "clients", live(f.src)), live(client))])))) && truthy(rt.fv(f, "active", live(hclient))))) {
			rt.spawnTail(f, -1, "/datum/html_interface/proc/updateContent: spawn at modules/html_interface/html_interface.dm:218", id, content, ignore_cache, hclient, client);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// a spawn(-1) body of /datum/html_interface/proc/updateContent, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/html_interface/proc/updateContent: spawn at modules/html_interface/html_interface.dm:218", function* (f: Frame, id: Value, content: Value, ignore_cache: Value, hclient: Value, client: Value) {
	f.vars = () => [id, content, ignore_cache, hclient, client];
	yield* g.callName(f, live(f.src), "_renderContent", [live(id), live(hclient), live(ignore_cache)]);
	return null;
});

// /datum/html_interface/proc/show  (code/modules/html_interface/html_interface.dm:221)  may sleep
rt.def("/datum/html_interface/proc/show", function* show(f: Frame, hclient: Value) {
	f.vars = () => [hclient];
	if (!truthy((rt.istype((hclient = (yield* g.srcCall(f, "getClient", live(hclient), 1))), T("/datum/html_interface_client")) ? 1 : 0))) return f.dot;
	if ((truthy((rt.isIn(f, rt.sv(f, "type"), rt.gl("asset_list")) ? 1 : 0)) && truthy((rt.istype(rt.index(rt.gl("asset_list"), rt.sv(f, "type")), T("/list")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/send_asset_list"), null, [rt.fv(f, "client", live(hclient)), rt.index(rt.gl("asset_list"), rt.sv(f, "type")), 1]);
	}
	if (!truthy((yield* g.call(f, P("/proc/winexists"), null, [rt.fv(f, "client", live(hclient)), fmt("browser_＃", [live(f.src)])])))) {
		yield* g.callName(f, live(f.src), "createWindow", [live(hclient)]);
	}
	rt.setFv(f, "is_loaded", live(hclient), 0);
	rt.op(f, "OutputControl", [], [rt.fv(f, "client", live(hclient)), (yield* g.call(f, P("/proc/replacetextEx"), null, [(yield* g.call(f, P("/proc/replacetextEx"), null, [(yield* g.call(f, P("/proc/file2text"), null, [rt.rsc("code/modules/html_interface/html_interface.html")])), "[hsrc]", fmt("＃", [live(f.src)])])), "</head>", fmt("＀</head>", [rt.sv(f, "head")])])), fmt("browser_＃.browser", [live(f.src)])], false);
	yield* g.call(f, P("/proc/winshow"), null, [rt.fv(f, "client", live(hclient)), fmt("browser_＃", [live(f.src)]), 1]);
	while ((truthy(rt.fv(f, "client", live(hclient))) && truthy(rt.fv(f, "active", live(hclient)))) && !truthy(rt.fv(f, "is_loaded", live(hclient)))) {
		yield* g.call(f, P("/proc/sleep"), null, [2]);
	}
	return f.dot;
}, true);

// /datum/html_interface/proc/hide  (code/modules/html_interface/html_interface.dm:240)  may sleep
rt.def("/datum/html_interface/proc/hide", function* hide(f: Frame, hclient: Value) {
	f.vars = () => [hclient];
	if (!truthy((rt.istype((hclient = (yield* g.srcCall(f, "getClient", live(hclient)))), T("/datum/html_interface_client")) ? 1 : 0))) return f.dot;
	if (truthy(rt.fv(f, "clients", live(f.src)))) {
		yield* g.callName(f, rt.fv(f, "clients", live(f.src)), "Remove", [rt.fv(f, "client", live(hclient))]);
		if (!truthy(rt.getLen(f, rt.fv(f, "clients", live(f.src))))) {
			rt.setFv(f, "clients", live(f.src), null);
		}
	}
	rt.setFv(f, "hi_last_pos", rt.fv(f, "client", live(hclient)), (yield* g.call(f, P("/proc/winget"), null, [rt.fv(f, "client", live(hclient)), fmt("browser_＃", [live(f.src)]), "pos"])));
	yield* g.call(f, P("/proc/winshow"), null, [rt.fv(f, "client", live(hclient)), fmt("browser_＃", [live(f.src)]), 0]);
	yield* g.call(f, P("/proc/winset"), null, [rt.fv(f, "client", live(hclient)), fmt("browser_＃", [live(f.src)]), "parent=none"]);
	if (!truthy((yield* g.call(f, P("/proc/hascall"), null, [rt.fv(f, "ref", live(f.src)), "hiOnHide"])))) return f.dot;
	yield* g.callDyn(f, rt.fv(f, "ref", live(f.src)), "hiOnHide", [live(hclient)]);
	return f.dot;
}, true);

// /datum/html_interface/proc/getClient  (code/modules/html_interface/html_interface.dm:257)  may sleep
rt.def("/datum/html_interface/proc/getClient", function* getClient(f: Frame, client: Value, create_if_not_exist: Value) {
	let mob: Value = null;
	f.vars = () => [client, create_if_not_exist, mob];
	if (live(create_if_not_exist) === null) {
		create_if_not_exist = 0;
	}
	if (truthy((rt.istype(live(client), T("/datum/html_interface_client")) ? 1 : 0))) {
		return (yield* g.callName(f, live(f.src), "_getClient", [live(client)]));
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(client)])))) {
		client = rt.gv(f, "client", (mob = live(client)));
	}
	if (truthy((rt.istype(live(client), T("/client")) ? 1 : 0))) {
		if ((truthy(live(create_if_not_exist)) && (!truthy(rt.fv(f, "clients", live(f.src))) || !truthy((rt.isIn(f, live(client), rt.fv(f, "clients", live(f.src))) ? 1 : 0))))) {
			if (!truthy(rt.fv(f, "clients", live(f.src)))) {
				rt.setFv(f, "clients", live(f.src), (yield* g.new_(f, T("/list"), [])));
			}
			if (!truthy((rt.isIn(f, live(client), rt.fv(f, "clients", live(f.src))) ? 1 : 0))) {
				rt.setAt(rt.fv(f, "clients", live(f.src)), live(client), (yield* g.new_(f, T("/datum/html_interface_client"), [live(client)])));
			}
		}
		if ((truthy(rt.fv(f, "clients", live(f.src))) && truthy((rt.isIn(f, live(client), rt.fv(f, "clients", live(f.src))) ? 1 : 0)))) {
			return (yield* g.callName(f, live(f.src), "_getClient", [rt.index(rt.fv(f, "clients", live(f.src)), live(client))]));
		}
		return null;
	} else {
		return null;
	}
	return f.dot;
}, true);

// /datum/html_interface/proc/enableFor  (code/modules/html_interface/html_interface.dm:272)  may sleep
rt.def("/datum/html_interface/proc/enableFor", function* enableFor(f: Frame, hclient: Value) {
	f.vars = () => [hclient];
	rt.setFv(f, "active", live(hclient), 1);
	yield* g.callName(f, live(f.src), "show", [live(hclient)]);
	return f.dot;
}, true);

// /datum/html_interface/proc/disableFor  (code/modules/html_interface/html_interface.dm:277)
rt.def("/datum/html_interface/proc/disableFor", function disableFor(f: Frame, hclient: Value) {
	rt.setFv(f, "active", live(hclient), 0);
	return f.dot;
});

// /datum/html_interface/proc/isUsed  (code/modules/html_interface/html_interface.dm:280)  may sleep
rt.def("/datum/html_interface/proc/isUsed", function* isUsed(f: Frame) {
	let hclient: Value = null, key: Value = null;
	let $e: any;
	f.vars = () => [hclient, key, $e];
	if ((truthy(rt.fv(f, "clients", live(f.src))) && rt.gt(rt.getLen(f, rt.fv(f, "clients", live(f.src))), 0))) {
		hclient = null;
		key = null;
		rt.forList(f, 0, rt.sv(f, "clients"));
		while (($e = rt.next(f, 0)) !== undefined) {
			key = $e;
			if (truthy((hclient = (yield* g.srcCall(f, "_getClient", rt.index(rt.sv(f, "clients"), live(key))))))) {
				if (truthy(rt.fv(f, "active", live(hclient)))) {
					return 1;
				}
			} else {
				yield* g.callName(f, rt.sv(f, "clients"), "Remove", [live(key)]);
			}
		}
		rt.endFor(f, 0);
	}
	return 0;
}, true);

// /datum/html_interface/proc/closeAll  (code/modules/html_interface/html_interface.dm:294)  may sleep
rt.def("/datum/html_interface/proc/closeAll", function* closeAll(f: Frame) {
	let client: Value = null;
	let $e: any;
	f.vars = () => [client, $e];
	if (!truthy(rt.fv(f, "clients", live(f.src)))) return f.dot;
	client = null;
	rt.forList(f, 0, rt.fv(f, "clients", live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		client = $e;
		yield* g.callName(f, live(f.src), "hide", [rt.index(rt.fv(f, "clients", live(f.src)), live(client))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/html_interface/proc/_getClient  (code/modules/html_interface/html_interface.dm:302)  may sleep
rt.def("/datum/html_interface/proc/_getClient", function* _getClient(f: Frame, hclient: Value) {
	let res: Value = null;
	let $0: any;
	f.vars = () => [hclient, res, $0];
	if (truthy(live(hclient))) {
		if (truthy(rt.fv(f, "client", live(hclient)))) {
			$0 = (rt.le(rt.gv(f, "inactivity", rt.fv(f, "client", live(hclient))), 6000) ? 1 : 0);
			if (truthy($0)) {
				if (truthy((yield* g.call(f, P("/proc/hascall"), null, [rt.fv(f, "ref", live(f.src)), "hiIsValidClient"])))) {
					$0 = (yield* g.callDyn(f, rt.fv(f, "ref", live(f.src)), "hiIsValidClient", [live(hclient), live(f.src)]));
				} else {
					$0 = 1;
				}
			}
			if (truthy((res = $0))) {
				if (!truthy(rt.fv(f, "active", live(hclient)))) {
					yield* g.callName(f, live(f.src), "enableFor", [live(hclient)]);
				}
			} else {
				if (truthy(rt.fv(f, "active", live(hclient)))) {
					yield* g.callName(f, live(f.src), "disableFor", [live(hclient)]);
				}
			}
			return live(hclient);
		} else {
			return null;
		}
	} else {
		return null;
	}
	return f.dot;
}, true);

// /datum/html_interface/proc/_renderTitle  (code/modules/html_interface/html_interface.dm:318)
rt.def("/datum/html_interface/proc/_renderTitle", function _renderTitle(f: Frame, hclient: Value, ignore_cache: Value, ignore_loaded: Value) {
	f.vars = () => [ignore_cache, ignore_loaded];
	if (live(ignore_cache) === null) {
		ignore_cache = 0;
	}
	if (live(ignore_loaded) === null) {
		ignore_loaded = 0;
	}
	if (!(truthy(live(hclient)) && (truthy(live(ignore_loaded)) || truthy(rt.fv(f, "is_loaded", live(hclient)))))) return f.dot;
	if (!(truthy(live(ignore_cache)) || !isEqual(rt.fv(f, "title", live(f.src)), rt.fv(f, "title", live(hclient))))) return f.dot;
	rt.setFv(f, "title", live(hclient), rt.sv(f, "title"));
	rt.callName(f, live(f.src), "specificRenderTitle", [live(hclient)]);
	rt.op(f, "OutputControl", [], [rt.fv(f, "client", live(hclient)), rt.call(f, P("/proc/list2params"), null, [rt.list(rt.sv(f, "title"))]), fmt("browser_＃.browser:setTitle", [live(f.src)])], false);
	return f.dot;
});

// /datum/html_interface/proc/_renderLayout  (code/modules/html_interface/html_interface.dm:329)
rt.def("/datum/html_interface/proc/_renderLayout", function _renderLayout(f: Frame, hclient: Value, ignore_loaded: Value) {
	let html: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [ignore_loaded, html, id, $e];
	if (live(ignore_loaded) === null) {
		ignore_loaded = 0;
	}
	if (!(truthy(live(hclient)) && (truthy(live(ignore_loaded)) || truthy(rt.fv(f, "is_loaded", live(hclient)))))) return f.dot;
	if (isEqual((html = rt.fv(f, "layout", live(f.src))), rt.fv(f, "layout", live(hclient)))) return f.dot;
	rt.setFv(f, "layout", live(hclient), live(html));
	rt.op(f, "OutputControl", [], [rt.fv(f, "client", live(hclient)), rt.call(f, P("/proc/list2params"), null, [rt.list(live(html))]), fmt("browser_＃.browser:updateLayout", [live(f.src)])], false);
	id = null;
	rt.forList(f, 0, rt.fv(f, "content_elements", live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		rt.callName(f, live(f.src), "_renderContent", [null, live(id), null, live(hclient), "ignore_loaded", live(ignore_loaded)], rt.Args.Named);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/html_interface/proc/_renderContent  (code/modules/html_interface/html_interface.dm:341)
rt.def("/datum/html_interface/proc/_renderContent", function _renderContent(f: Frame, id: Value, hclient: Value, ignore_cache: Value, ignore_loaded: Value) {
	let html: Value = null;
	f.vars = () => [ignore_cache, ignore_loaded, html];
	if (live(ignore_cache) === null) {
		ignore_cache = 0;
	}
	if (live(ignore_loaded) === null) {
		ignore_loaded = 0;
	}
	if (!(truthy(live(hclient)) && (truthy(live(ignore_loaded)) || truthy(rt.fv(f, "is_loaded", live(hclient)))))) return f.dot;
	html = rt.index(rt.fv(f, "content_elements", live(f.src)), live(id));
	if (!((truthy(live(ignore_cache)) || !truthy((rt.isIn(f, live(id), rt.fv(f, "content_elements", live(hclient))) ? 1 : 0))) || !isEqual(live(html), rt.index(rt.fv(f, "content_elements", live(hclient)), live(id))))) return f.dot;
	rt.setAt(rt.fv(f, "content_elements", live(hclient)), live(id), live(html));
	rt.op(f, "OutputControl", [], [rt.fv(f, "client", live(hclient)), rt.call(f, P("/proc/list2params"), null, [rt.list(live(id), live(html))]), fmt("browser_＃.browser:updateContent", [live(f.src)])], false);
	return f.dot;
});

// /datum/html_interface/proc/Topic  (code/modules/html_interface/html_interface.dm:351)  may sleep
rt.def("/datum/html_interface/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let hclient: Value = null;
	let $0: any;
	f.vars = () => [href, href_list, hclient, $0];
	if (!truthy((rt.istype((hclient = (yield* g.srcCall(f, "getClient", rt.fv(f, "client", live(f.usr))))), T("/datum/html_interface_client")) ? 1 : 0))) return f.dot;
	if (truthy((rt.isIn(f, "html_interface_action", live(href_list)) ? 1 : 0))) {
		$0 = rt.at(live(href_list), "html_interface_action");
		if ($0 === "onload") {
			rt.setFv(f, "layout", live(hclient), null);
			rt.setFv(f, "len", rt.fv(f, "content_elements", live(hclient)), 0);
			yield* g.callName(f, live(f.src), "_renderTitle", [live(hclient), 1, 1]);
			yield* g.callName(f, live(f.src), "_renderLayout", [live(hclient), 1]);
			rt.setFv(f, "is_loaded", live(hclient), 1);
		} else if ($0 === "onclose") {
			yield* g.callName(f, live(f.src), "hide", [live(hclient)]);
		}
	} else {
		if (!(truthy(rt.fv(f, "ref", live(f.src))) && truthy(rt.fv(f, "active", live(hclient))))) return f.dot;
		yield* g.callName(f, rt.fv(f, "ref", live(f.src)), "Topic", [live(href), live(href_list), live(hclient)]);
	}
	return f.dot;
}, true);
