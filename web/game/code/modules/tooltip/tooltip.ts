// From code/modules/tooltip/tooltip.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4243, "/datum/tooltip", "/datum", {
	owner: null,
	control: "mainwindow.tooltip",
	showing: 0,
	queueHide: 0,
	init: 0,
});

// /datum/tooltip/proc/New  (code/modules/tooltip/tooltip.dm:45)
rt.def("/datum/tooltip/proc/New", function New(f: Frame) {
	if (truthy(live(f.args[0]))) {
		rt.setFv(f, "owner", live(f.src), live(f.args[0]));
		rt.op(f, "Browse", [], [rt.fv(f, "owner", live(f.src)), rt.call(f, P("/proc/file2text"), null, [rt.rsc("code/modules/tooltip/tooltip.html")]), fmt("window=＀", [rt.fv(f, "control", live(f.src))])], false);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["C"] });

// /datum/tooltip/proc/show  (code/modules/tooltip/tooltip.dm:51)
rt.def("/datum/tooltip/proc/show", function show(f: Frame, thing: Value, params: Value, title: Value, content: Value, theme: Value, special: Value) {
	f.vars = () => [params, title, content, theme, special];
	if (live(params) === null) {
		params = null;
	}
	if (live(title) === null) {
		title = null;
	}
	if (live(content) === null) {
		content = null;
	}
	if (live(theme) === null) {
		theme = "default";
	}
	if (live(special) === null) {
		special = "none";
	}
	if (((((!truthy(live(thing)) || !truthy(live(params))) || (!truthy(live(title)) && !truthy(live(content)))) || !truthy(rt.fv(f, "owner", live(f.src)))) || !truthy(rt.call(f, P("/proc/isnum"), null, [rt.fv(f, "icon_size", rt.world())])))) {
		return 0;
	}
	if (!truthy(rt.fv(f, "init", live(f.src)))) {
		rt.setFv(f, "init", live(f.src), 1);
		rt.op(f, "OutputControl", [], [rt.fv(f, "owner", live(f.src)), rt.call(f, P("/proc/list2params"), null, [rt.list(rt.fv(f, "icon_size", rt.world()), rt.fv(f, "control", live(f.src)))]), fmt("＀:tooltip.init", [rt.fv(f, "control", live(f.src))])], false);
	}
	rt.setFv(f, "showing", live(f.src), 1);
	if ((truthy(live(title)) && truthy(live(content)))) {
		title = fmt("<h1>＀</h1>", [live(title)]);
		content = fmt("<p>＀</p>", [live(content)]);
	} else {
		if ((truthy(live(title)) && !truthy(live(content)))) {
			title = fmt("<p>＀</p>", [live(title)]);
		} else {
			if ((!truthy(live(title)) && truthy(live(content)))) {
				content = fmt("<p>＀</p>", [live(content)]);
			}
		}
	}
	params = fmt("{ \"cursor\": \"＀\", \"screenLoc\": \"＀\" }", [live(params), rt.fv(f, "screen_loc", live(thing))]);
	rt.op(f, "OutputControl", [], [rt.fv(f, "owner", live(f.src)), rt.call(f, P("/proc/list2params"), null, [rt.list(live(params), rt.gv(f, "view", rt.fv(f, "owner", live(f.src))), fmt("＀＀", [live(title), live(content)]), live(theme), live(special))]), fmt("＀:tooltip.update", [rt.fv(f, "control", live(f.src))])], false);
	rt.setFv(f, "showing", live(f.src), 0);
	if (truthy(rt.fv(f, "queueHide", live(f.src)))) {
		rt.callName(f, live(f.src), "hide", []);
	}
	return 1;
});

// /datum/tooltip/proc/hide  (code/modules/tooltip/tooltip.dm:83)
rt.def("/datum/tooltip/proc/hide", function hide(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy(rt.fv(f, "queueHide", live(f.src)))) {
		rt.spawnTail(f, 1, "/datum/tooltip/proc/hide: spawn at modules/tooltip/tooltip.dm:84");
	} else {
		rt.call(f, P("/proc/winshow"), null, [rt.fv(f, "owner", live(f.src)), rt.fv(f, "control", live(f.src)), 0]);
	}
	$0 = live(f.src);
	if (truthy(rt.fv(f, "showing", live(f.src)))) {
		$1 = 1;
	} else {
		$1 = 0;
	}
	rt.setFv(f, "queueHide", $0, $1);
	return 1;
});

// a spawn(1) body of /datum/tooltip/proc/hide, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/tooltip/proc/hide: spawn at modules/tooltip/tooltip.dm:84", function* (f: Frame) {
	yield* g.call(f, P("/proc/winshow"), null, [rt.fv(f, "owner", live(f.src)), rt.fv(f, "control", live(f.src)), 0]);
	return null;
});

// /proc/openToolTip  (code/modules/tooltip/tooltip.dm:101)
rt.def("/proc/openToolTip", function openToolTip(f: Frame, user: Value, tip_src: Value, params: Value, title: Value, content: Value, theme: Value) {
	f.vars = () => [user, tip_src, params, title, content, theme];
	if (live(user) === null) {
		user = null;
	}
	if (live(tip_src) === null) {
		tip_src = null;
	}
	if (live(params) === null) {
		params = null;
	}
	if (live(title) === null) {
		title = "";
	}
	if (live(content) === null) {
		content = "";
	}
	if (live(theme) === null) {
		theme = "";
	}
	if (!truthy((rt.istype(live(user), T("/mob")) ? 1 : 0))) return f.dot;
	if (!(truthy(rt.fv(f, "client", live(user))) && truthy(rt.gv(f, "tooltips", rt.fv(f, "client", live(user)))))) return f.dot;
	if (((!truthy(live(theme)) && truthy(rt.gv(f, "prefs", rt.fv(f, "client", live(user))))) && truthy(rt.gv(f, "UI_style", rt.gv(f, "prefs", rt.fv(f, "client", live(user))))))) {
		theme = rt.call(f, P("/proc/lowertext"), null, [rt.gv(f, "UI_style", rt.gv(f, "prefs", rt.fv(f, "client", live(user))))]);
	}
	if (!truthy(live(theme))) {
		theme = "default";
	}
	rt.callName(f, rt.gv(f, "tooltips", rt.fv(f, "client", live(user))), "show", [live(tip_src), live(params), live(title), live(content), live(theme)]);
	return f.dot;
});

// /proc/closeToolTip  (code/modules/tooltip/tooltip.dm:113)
rt.def("/proc/closeToolTip", function closeToolTip(f: Frame, user: Value) {
	if (!truthy((rt.istype(live(user), T("/mob")) ? 1 : 0))) return f.dot;
	if (!(truthy(rt.fv(f, "client", live(user))) && truthy(rt.gv(f, "tooltips", rt.fv(f, "client", live(user)))))) return f.dot;
	rt.callName(f, rt.gv(f, "tooltips", rt.fv(f, "client", live(user))), "hide", []);
	return f.dot;
});
