// Based on /tg/station's code/modules/html_interface/nanotrasen/nanotrasen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(2709, "/datum/html_interface/nanotrasen", "/datum/html_interface", {});

// nanotrasen.dm:18
rt.def("/datum/html_interface/nanotrasen/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	this.head = this.head + "<link rel=\"stylesheet\" type=\"text/css\" href=\"hi-nanotrasen.css\" />";
	yield* this.updateLayout("");
	return f.dot;
}, true);

// nanotrasen.dm:26
rt.def("/datum/html_interface/nanotrasen/proc/updateLayout", function* updateLayout(f: Frame, layout: Value) {
	return (yield* parent_proc(`<div id="ntbgcenter"></div><div id="content">${layout}</div>`));
}, true);

// Empty in tg.
rt.def("/datum/html_interface/proc/specificRenderTitle", undefined, false, { args: ["hclient", "ignore_cache"] });

// nanotrasen.dm:30
rt.def("/datum/html_interface/proc/specificRenderTitle", function specificRenderTitle(f: Frame, hclient: Value, ignore_cache: Value) {
	ignore_cache ??= 0;
	winset(hclient.client, fmt("browser_＃.uiTitle", [this]), list2params(rt.alist(f, ["text", `${this.title}`])));
	return f.dot;
});

// nanotrasen.dm:33
rt.def("/datum/html_interface/nanotrasen/proc/registerResources", function registerResources(f: Frame, resources: Value) {
	resources ??= list();
	rt.setAt(resources, "uiBg.png", rt.rsc("code/modules/html_interface/nanotrasen/uiBg.png"));
	rt.setAt(resources, "uiBgcenter.png", rt.rsc("code/modules/html_interface/nanotrasen/uiBgcenter.png"));
	rt.setAt(resources, "hi-nanotrasen.css", rt.rsc("code/modules/html_interface/nanotrasen/hi-nanotrasen.css"));
	parent_proc(resources);
	return f.dot;
});

// nanotrasen.dm:39
rt.def("/datum/html_interface/nanotrasen/proc/createWindow", function createWindow(f: Frame, hclient: Value) {
	f.dot = parent_proc();
	winset(hclient.client, fmt("browser_＃", [this]), list2params(rt.alist(f, ["titlebar", "false"])));
	winset(hclient.client, fmt("browser_＃.browser", [this]), list2params(rt.alist(f, ["pos", "0,35", "size", `${this.width}x${this.height - 35}`])));
	winset(hclient.client, fmt("browser_＃.topbg", [this]), list2params(rt.alist(f, ["parent", fmt("browser_＃", [this]), "type", "label", "pos", "0,0", "size", `${this.width}x35`, "anchor1", "0,0", "anchor2", "100,0", "image", `${rt.rsc("code/modules/html_interface/nanotrasen/uiBgtop.png")}`, "image-mode", "tile", "is-disabled", "true"])));
	winset(hclient.client, fmt("browser_＃.uiTitleFluff", [this]), list2params(rt.alist(f, ["parent", fmt("browser_＃", [this]), "type", "label", "pos", `${this.width - 42 - 4 - 24 - 4 - 24 - 4},5`, "size", "42x24", "anchor1", "100,0", "anchor2", "100,0", "image", `${rt.rsc("code/modules/html_interface/nanotrasen/uiTitleFluff.png")}`, "image-mode", "tile", "is-disabled", "true"])));
	winset(hclient.client, fmt("browser_＃.uiTitleEye", [this]), list2params(rt.alist(f, ["parent", fmt("browser_＃", [this]), "type", "label", "pos", "8,5", "size", "42x24", "anchor1", "0,0", "anchor2", "0,0", "image", `${rt.rsc("code/modules/html_interface/nanotrasen/uiEyeGreen.png")}`, "image-mode", "tile", "is-disabled", "true"])));
	winset(hclient.client, fmt("browser_＃.uiTitle", [this]), list2params(rt.alist(f, ["parent", fmt("browser_＃", [this]), "type", "label", "is-transparent", "true", "pos", "64,0", "size", "580x35", "anchor1", "0,0", "anchor2", "100,0", "is-disabled", "true", "text", `${this.title}`, "align", "left", "font-family", "verdana,Geneva,sans-serif", "font-size", "12", "text-color", "#E9C183"])));
	winset(hclient.client, fmt("browser_＃.uiTitleMinimize", [this]), list2params(rt.alist(f, ["parent", fmt("browser_＃", [this]), "type", "button", "is-flat", "true", "background-color", "#383838", "text-color", "#FFFFFF", "is-transparent", "true", "pos", `${this.width - 24 - 4 - 24 - 4},5`, "size", "24x24", "anchor1", "100,0", "anchor2", "100,0", "text", "-", "font-family", "verdana,Geneva,sans-serif", "font-size", "12", "command", fmt(".winset \"browser_＃.can-resize=false;browser_＃.is-minimized=true;browser_＃.on-size=\".swinset \\\"browser_＃.can-resize=true;browser_＃.on-size=\\\"\"\"", [this, this, this, this, this])])));
	winset(hclient.client, fmt("browser_＃.uiTitleClose", [this]), list2params(rt.alist(f, ["parent", fmt("browser_＃", [this]), "type", "button", "is-flat", "true", "background-color", "#383838", "text-color", "#FFFFFF", "command", fmt("byond://?src=＃;html_interface_action=onclose", [this]), "is-transparent", "true", "pos", `${this.width - 24 - 4},5`, "size", "24x24", "anchor1", "100,0", "anchor2", "100,0", "text", "X", "font-family", "verdana,Geneva,sans-serif", "font-size", "12"])));
	return f.dot;
}, false);

// nanotrasen.dm:149
rt.def("/datum/html_interface/nanotrasen/proc/enableFor", function* enableFor(f: Frame, hclient: Value) {
	f.dot = (yield* parent_proc());
	yield* this.setEyeColor("green", hclient);
	return f.dot;
}, true);

// nanotrasen.dm:154
rt.def("/datum/html_interface/nanotrasen/proc/disableFor", function* disableFor(f: Frame, hclient: Value) {
	hclient.active = 0;
	yield* this.setEyeColor("red", hclient);
	return f.dot;
}, true);

// nanotrasen.dm:159
rt.def("/datum/html_interface/nanotrasen/proc/setEyeColor", function* setEyeColor(f: Frame, color: Value, hclient: Value) {
	let resource: Value = null;
	if (rt.istype((hclient = (yield* this.getClient(hclient))), T("/datum/html_interface_client"))) {
		if (color === "green") {
			resource = rt.rsc("code/modules/html_interface/nanotrasen/uiEyeGreen.png");
		} else if (color === "orange") {
			resource = rt.rsc("code/modules/html_interface/nanotrasen/uiEyeOrange.png");
		} else if (color === "red") {
			resource = rt.rsc("code/modules/html_interface/nanotrasen/uiEyeRed.png");
		} else {
			CRASH(`Invalid color: ${color}`);
		}
		if (hclient.getExtraVar("eye_color") != color) {
			hclient.putExtraVar("eye_color", color);
			winset(hclient.client, fmt("browser_＃.uiTitleEye", [this]), list2params(rt.alist(f, ["image", `${resource}`])));
		}
	} else {
		warning(`${"Invalid object passed to /datum/html_interface/nanotrasen/proc/setEyeColor"} in ${"code/modules/html_interface/nanotrasen/nanotrasen.dm"} at line ${174} src: ${this} usr: ${f.usr}.`);
	}
	return f.dot;
}, true);
