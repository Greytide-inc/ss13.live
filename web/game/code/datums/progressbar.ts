// Based on /tg/station's code/datums/progressbar.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(737, "/datum/progressbar", "/datum", {
	goal: 1,
	bar: null,
	shown: 0,
	user: null,
	client: null,
	listindex: null,
});

// progressbar.dm:12
rt.def("/datum/progressbar/proc/New", function New(f: Frame, User: Value, goal_number: Value, target: Value) {
	let bars: Value = null;
	f.dot = parent_proc();
	if (!rt.istype(target, T("/atom"))) {
		new_(T("/exception"), "Invalid target given", "code/datums/progressbar.dm", 14);
	}
	if (goal_number) {
		this.goal = goal_number;
	}
	this.bar = image(rt.rsc("icons/effects/progessbar.dmi"), target, "prog_bar_0", HUD_LAYER);
	this.bar.plane = HUD_PLANE;
	this.bar.appearance_flags = 30;
	this.user = User;
	if (this.user) {
		this.client = this.user.client;
	}
	if (!this.user.progressbars) {
		this.user.progressbars = list();
	}
	if (!rt.index(this.user.progressbars, this.bar.loc)) {
		rt.setAt(this.user.progressbars, this.bar.loc, list());
	}
	(bars = rt.index(this.user.progressbars, this.bar.loc)).Add(this);
	this.listindex = rt.len(f, bars);
	this.bar.pixel_y = 32 + PROGRESSBAR_HEIGHT * (this.listindex - 1);
	return f.dot;
}, false);

// progressbar.dm:33
rt.def("/datum/progressbar/proc/update", function update(f: Frame, progress: Value) {
	if (!this.user || !this.user.client) {
		this.shown = 0;
		return f.dot;
	}
	if (this.user.client != this.client) {
		if (this.client) {
			this.client.images -= this.bar;
		}
		if (this.user.client) {
			this.user.client.images += this.bar;
		}
	}
	progress = max(0, min(progress, this.goal));
	this.bar.icon_state = `prog_bar_${round(progress / this.goal * 100, 5)}`;
	if (this.shown) return f.dot;
	this.user.client.images += this.bar;
	this.shown = 1;
	return f.dot;
});

// progressbar.dm:49
rt.def("/datum/progressbar/proc/shiftDown", function shiftDown(f: Frame) {
	--this.listindex;
	this.bar.pixel_y -= PROGRESSBAR_HEIGHT;
	return f.dot;
});

// progressbar.dm:53
rt.def("/datum/progressbar/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null, _P: Value = null, bars: Value = null;
	for (I of each(rt.index(this.user.progressbars, this.bar.loc))) {
		if ((_P = I) != this && _P.listindex > this.listindex) {
			_P.shiftDown();
		}
	}
	yield* (bars = rt.index(this.user.progressbars, this.bar.loc)).Remove(this);
	if (!rt.len(f, bars)) {
		if (this.user.progressbars) {
			this.user.progressbars -= this.bar.loc;
			if (!rt.len(f, this.user.progressbars)) {
				this.user.progressbars = null;
			}
		}
	}
	if (this.client) {
		this.client.images -= this.bar;
	}
	yield* qdel(this.bar);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);
