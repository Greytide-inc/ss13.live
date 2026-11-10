// Based on /tg/station's code/modules/tooltip/tooltip.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4243, "/datum/tooltip", "/datum", {
	owner: null,
	control: "mainwindow.tooltip",
	showing: 0,
	queueHide: 0,
	init: 0,
});

// tooltip.dm:45
rt.def("/datum/tooltip/proc/New", function New(f: Frame, C: Value) {
	if (C) {
		this.owner = C;
		rt.op(f, "Browse", [], [this.owner, file2text(rt.rsc("code/modules/tooltip/tooltip.html")), `window=${this.control}`], false);
	}
	parent_proc();
	return f.dot;
}, false);

// tooltip.dm:51
rt.def("/datum/tooltip/proc/show", function show(f: Frame, thing: Value, params: Value, title: Value, content: Value, theme: Value, special: Value) {
	theme ??= "default";
	special ??= "none";
	if (!thing || !params || !title && !content || !this.owner || !isnum(rt.world().icon_size)) {
		return 0;
	}
	if (!this.init) {
		this.init = 1;
		rt.op(f, "OutputControl", [], [this.owner, list2params(list(rt.world().icon_size, this.control)), `${this.control}:tooltip.init`], false);
	}
	this.showing = 1;
	if (title && content) {
		title = `<h1>${title}</h1>`;
		content = `<p>${content}</p>`;
	} else if (title && !content) {
		title = `<p>${title}</p>`;
	} else if (!title && content) {
		content = `<p>${content}</p>`;
	}
	params = `{ "cursor": "${params}", "screenLoc": "${thing.screen_loc}" }`;
	rt.op(f, "OutputControl", [], [this.owner, list2params(list(params, this.owner.view, `${title}${content}`, theme, special)), `${this.control}:tooltip.update`], false);
	this.showing = 0;
	if (this.queueHide) {
		this.hide();
	}
	return 1;
});

// tooltip.dm:83
rt.def("/datum/tooltip/proc/hide", function hide(f: Frame) {
	if (this.queueHide) {
		rt.spawnTail(f, 1, "/datum/tooltip/proc/hide: spawn at modules/tooltip/tooltip.dm:84");
	} else {
		winshow(this.owner, this.control, 0);
	}
	let $0: any = this;
	$0.queueHide = this.showing ? 1 : 0;
	return 1;
});

// a spawn(1) body of /datum/tooltip/proc/hide, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/tooltip/proc/hide: spawn at modules/tooltip/tooltip.dm:84", function* (f: Frame) {
	winshow(this.owner, this.control, 0);
	return null;
});

// tooltip.dm:101
rt.def("/proc/openToolTip", function openToolTip(f: Frame, user: Value, tip_src: Value, params: Value, title: Value, content: Value, theme: Value) {
	title ??= "";
	content ??= "";
	theme ??= "";
	if (!rt.istype(user, T("/mob"))) return f.dot;
	if (!(user.client && user.client.tooltips)) return f.dot;
	if (!theme && user.client.prefs && user.client.prefs.UI_style) {
		theme = lowertext(user.client.prefs.UI_style);
	}
	if (!theme) {
		theme = "default";
	}
	user.client.tooltips.show(tip_src, params, title, content, theme);
	return f.dot;
});

// tooltip.dm:113
rt.def("/proc/closeToolTip", function closeToolTip(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob"))) return f.dot;
	if (!(user.client && user.client.tooltips)) return f.dot;
	user.client.tooltips.hide();
	return f.dot;
});
