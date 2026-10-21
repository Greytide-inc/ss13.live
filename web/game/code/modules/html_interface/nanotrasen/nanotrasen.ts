// From code/modules/html_interface/nanotrasen/nanotrasen.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2709, "/datum/html_interface/nanotrasen", "/datum/html_interface", {});

// /datum/html_interface/nanotrasen/proc/New  (code/modules/html_interface/nanotrasen/nanotrasen.dm:18)  may sleep
rt.def("/datum/html_interface/nanotrasen/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "head", live(f.src), add(rt.fv(f, "head", live(f.src)), "<link rel=\"stylesheet\" type=\"text/css\" href=\"hi-nanotrasen.css\" />"));
	yield* g.callName(f, live(f.src), "updateLayout", [""]);
	return f.dot;
}, true);

// /datum/html_interface/nanotrasen/proc/updateLayout  (code/modules/html_interface/nanotrasen/nanotrasen.dm:26)  may sleep
rt.def("/datum/html_interface/nanotrasen/proc/updateLayout", function* updateLayout(f: Frame, layout: Value) {
	f.vars = () => [layout];
	return (yield* g.callSuper(f, [fmt("<div id=\"ntbgcenter\"></div><div id=\"content\">＀</div>", [live(layout)])]));
}, true);

// /datum/html_interface/proc/specificRenderTitle  empty
rt.def("/datum/html_interface/proc/specificRenderTitle", undefined, false, { args: ["hclient", "ignore_cache"] });

// /datum/html_interface/proc/specificRenderTitle  (code/modules/html_interface/nanotrasen/nanotrasen.dm:30)
rt.def("/datum/html_interface/proc/specificRenderTitle", function specificRenderTitle(f: Frame, hclient: Value, ignore_cache: Value) {
	f.vars = () => [ignore_cache];
	if (live(ignore_cache) === null) {
		ignore_cache = 0;
	}
	rt.call(f, P("/proc/winset"), null, [rt.fv(f, "client", live(hclient)), fmt("browser_＃.uiTitle", [live(f.src)]), rt.call(f, P("/proc/list2params"), null, [rt.alist(f, ["text", fmt("＀", [rt.fv(f, "title", live(f.src))])])])]);
	return f.dot;
});

// /datum/html_interface/nanotrasen/proc/registerResources  (code/modules/html_interface/nanotrasen/nanotrasen.dm:33)
rt.def("/datum/html_interface/nanotrasen/proc/registerResources", function registerResources(f: Frame, resources: Value) {
	f.vars = () => [resources];
	if (live(resources) === null) {
		resources = rt.list();
	}
	rt.setAt(live(resources), "uiBg.png", rt.rsc("code/modules/html_interface/nanotrasen/uiBg.png"));
	rt.setAt(live(resources), "uiBgcenter.png", rt.rsc("code/modules/html_interface/nanotrasen/uiBgcenter.png"));
	rt.setAt(live(resources), "hi-nanotrasen.css", rt.rsc("code/modules/html_interface/nanotrasen/hi-nanotrasen.css"));
	rt.callSuper(f, [live(resources)]);
	return f.dot;
});

// /datum/html_interface/nanotrasen/proc/createWindow  (code/modules/html_interface/nanotrasen/nanotrasen.dm:39)
rt.def("/datum/html_interface/nanotrasen/proc/createWindow", function createWindow(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/winset"), null, [rt.fv(f, "client", live(f.args[0])), fmt("browser_＃", [live(f.src)]), rt.call(f, P("/proc/list2params"), null, [rt.alist(f, ["titlebar", "false"])])]);
	rt.call(f, P("/proc/winset"), null, [rt.fv(f, "client", live(f.args[0])), fmt("browser_＃.browser", [live(f.src)]), rt.call(f, P("/proc/list2params"), null, [rt.alist(f, ["pos", "0,35", "size", fmt("＀x＀", [rt.sv(f, "width"), subtract(rt.sv(f, "height"), 35)])])])]);
	rt.call(f, P("/proc/winset"), null, [rt.fv(f, "client", live(f.args[0])), fmt("browser_＃.topbg", [live(f.src)]), rt.call(f, P("/proc/list2params"), null, [rt.alist(f, ["parent", fmt("browser_＃", [live(f.src)]), "type", "label", "pos", "0,0", "size", fmt("＀x35", [rt.sv(f, "width")]), "anchor1", "0,0", "anchor2", "100,0", "image", fmt("＀", [rt.rsc("code/modules/html_interface/nanotrasen/uiBgtop.png")]), "image-mode", "tile", "is-disabled", "true"])])]);
	rt.call(f, P("/proc/winset"), null, [rt.fv(f, "client", live(f.args[0])), fmt("browser_＃.uiTitleFluff", [live(f.src)]), rt.call(f, P("/proc/list2params"), null, [rt.alist(f, ["parent", fmt("browser_＃", [live(f.src)]), "type", "label", "pos", fmt("＀,5", [subtract(subtract(subtract(subtract(subtract(subtract(rt.sv(f, "width"), 42), 4), 24), 4), 24), 4)]), "size", "42x24", "anchor1", "100,0", "anchor2", "100,0", "image", fmt("＀", [rt.rsc("code/modules/html_interface/nanotrasen/uiTitleFluff.png")]), "image-mode", "tile", "is-disabled", "true"])])]);
	rt.call(f, P("/proc/winset"), null, [rt.fv(f, "client", live(f.args[0])), fmt("browser_＃.uiTitleEye", [live(f.src)]), rt.call(f, P("/proc/list2params"), null, [rt.alist(f, ["parent", fmt("browser_＃", [live(f.src)]), "type", "label", "pos", "8,5", "size", "42x24", "anchor1", "0,0", "anchor2", "0,0", "image", fmt("＀", [rt.rsc("code/modules/html_interface/nanotrasen/uiEyeGreen.png")]), "image-mode", "tile", "is-disabled", "true"])])]);
	rt.call(f, P("/proc/winset"), null, [rt.fv(f, "client", live(f.args[0])), fmt("browser_＃.uiTitle", [live(f.src)]), rt.call(f, P("/proc/list2params"), null, [rt.alist(f, ["parent", fmt("browser_＃", [live(f.src)]), "type", "label", "is-transparent", "true", "pos", "64,0", "size", "580x35", "anchor1", "0,0", "anchor2", "100,0", "is-disabled", "true", "text", fmt("＀", [rt.fv(f, "title", live(f.src))]), "align", "left", "font-family", "verdana,Geneva,sans-serif", "font-size", "12", "text-color", "#E9C183"])])]);
	rt.call(f, P("/proc/winset"), null, [rt.fv(f, "client", live(f.args[0])), fmt("browser_＃.uiTitleMinimize", [live(f.src)]), rt.call(f, P("/proc/list2params"), null, [rt.alist(f, ["parent", fmt("browser_＃", [live(f.src)]), "type", "button", "is-flat", "true", "background-color", "#383838", "text-color", "#FFFFFF", "is-transparent", "true", "pos", fmt("＀,5", [subtract(subtract(subtract(subtract(rt.sv(f, "width"), 24), 4), 24), 4)]), "size", "24x24", "anchor1", "100,0", "anchor2", "100,0", "text", "-", "font-family", "verdana,Geneva,sans-serif", "font-size", "12", "command", fmt(".winset \"browser_＃.can-resize=false;browser_＃.is-minimized=true;browser_＃.on-size=\".swinset \\\"browser_＃.can-resize=true;browser_＃.on-size=\\\"\"\"", [live(f.src), live(f.src), live(f.src), live(f.src), live(f.src)])])])]);
	rt.call(f, P("/proc/winset"), null, [rt.fv(f, "client", live(f.args[0])), fmt("browser_＃.uiTitleClose", [live(f.src)]), rt.call(f, P("/proc/list2params"), null, [rt.alist(f, ["parent", fmt("browser_＃", [live(f.src)]), "type", "button", "is-flat", "true", "background-color", "#383838", "text-color", "#FFFFFF", "command", fmt("byond://?src=＃;html_interface_action=onclose", [live(f.src)]), "is-transparent", "true", "pos", fmt("＀,5", [subtract(subtract(rt.sv(f, "width"), 24), 4)]), "size", "24x24", "anchor1", "100,0", "anchor2", "100,0", "text", "X", "font-family", "verdana,Geneva,sans-serif", "font-size", "12"])])]);
	return f.dot;
}, false, { args: ["hclient"] });

// /datum/html_interface/nanotrasen/proc/enableFor  (code/modules/html_interface/nanotrasen/nanotrasen.dm:149)  may sleep
rt.def("/datum/html_interface/nanotrasen/proc/enableFor", function* enableFor(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(f.src), "setEyeColor", ["green", live(f.args[0])]);
	return f.dot;
}, true, { args: ["hclient"] });

// /datum/html_interface/nanotrasen/proc/disableFor  (code/modules/html_interface/nanotrasen/nanotrasen.dm:154)  may sleep
rt.def("/datum/html_interface/nanotrasen/proc/disableFor", function* disableFor(f: Frame, hclient: Value) {
	f.vars = () => [hclient];
	rt.setFv(f, "active", live(hclient), 0);
	yield* g.callName(f, live(f.src), "setEyeColor", ["red", live(hclient)]);
	return f.dot;
}, true);

// /datum/html_interface/nanotrasen/proc/setEyeColor  (code/modules/html_interface/nanotrasen/nanotrasen.dm:159)  may sleep
rt.def("/datum/html_interface/nanotrasen/proc/setEyeColor", function* setEyeColor(f: Frame, color: Value, hclient: Value) {
	let resource: Value = null;
	let $0: any;
	f.vars = () => [color, hclient, resource, $0];
	if (truthy((rt.istype((hclient = (yield* g.srcCall(f, "getClient", live(hclient)))), T("/datum/html_interface_client")) ? 1 : 0))) {
		resource = null;
		$0 = live(color);
		if ($0 === "green") {
			resource = rt.rsc("code/modules/html_interface/nanotrasen/uiEyeGreen.png");
		} else if ($0 === "orange") {
			resource = rt.rsc("code/modules/html_interface/nanotrasen/uiEyeOrange.png");
		} else if ($0 === "red") {
			resource = rt.rsc("code/modules/html_interface/nanotrasen/uiEyeRed.png");
		} else {
			yield* g.call(f, P("/proc/CRASH"), null, [fmt("Invalid color: ＀", [live(color)])]);
		}
		if (!isEqual((yield* g.callName(f, live(hclient), "getExtraVar", ["eye_color"])), live(color))) {
			yield* g.callName(f, live(hclient), "putExtraVar", ["eye_color", live(color)]);
			yield* g.call(f, P("/proc/winset"), null, [rt.fv(f, "client", live(hclient)), fmt("browser_＃.uiTitleEye", [live(f.src)]), (yield* g.call(f, P("/proc/list2params"), null, [rt.alist(f, ["image", fmt("＀", [live(resource)])])]))]);
		}
	} else {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["Invalid object passed to /datum/html_interface/nanotrasen/proc/setEyeColor", "code/modules/html_interface/nanotrasen/nanotrasen.dm", 174, live(f.src), live(f.usr)])]);
	}
	return f.dot;
}, true);
