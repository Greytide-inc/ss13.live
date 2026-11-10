// Based on /tg/station's code/modules/assembly/timer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9384, "/obj/item/device/assembly/timer", "/obj/item/device/assembly", {
	timing: 0,
	time: 5,
	saved_time: 5,
	loop: 0,
	attachable: 1,
	name: "timer",
	desc: "Used to time things. Works well with contraptions which has to count down. Tick tock.",
	icon_state: "timer",
	materials: null,
	origin_tech: "magnets=1;engineering=1",
});

// timer.dm:5
rt.def("/obj/item/device/assembly/timer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 500, "$glass", 50]);
	return f.dot;
});

// timer.dm:16
rt.def("/obj/item/device/assembly/timer/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// timer.dm:21
rt.def("/obj/item/device/assembly/timer/proc/describe", function describe(f: Frame) {
	if (this.timing) {
		return `The timer is counting down from ${this.time}!`;
	}
	return `The timer is set for ${this.time} seconds.`;
});

// timer.dm:26
rt.def("/obj/item/device/assembly/timer/proc/activate", function* activate(f: Frame) {
	if (!(yield* parent_proc())) {
		return 0;
	}
	this.timing = (!this.timing ? 1 : 0);
	yield* this.update_icon();
	return 1;
}, true);

// timer.dm:34
rt.def("/obj/item/device/assembly/timer/proc/toggle_secure", function* toggle_secure(f: Frame) {
	this.secured = (!this.secured ? 1 : 0);
	if (this.secured) {
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	} else {
		this.timing = 0;
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	yield* this.update_icon();
	return this.secured;
}, true);

// timer.dm:45
rt.def("/obj/item/device/assembly/timer/proc/timer_end", function* timer_end(f: Frame) {
	if (!this.secured || this.next_activate > rt.worldTime(f)) {
		return 0;
	}
	yield* this.pulse(0);
	this.audible_message(`${bicon(this)} *beep* *beep*`, null, 3);
	if (this.loop) {
		this.timing = 1;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// timer.dm:56
rt.def("/obj/item/device/assembly/timer/proc/process", function* process(f: Frame) {
	if (!this.timing) return f.dot;
	this.time--;
	if (!(this.time <= 0)) return f.dot;
	this.timing = 0;
	yield* this.timer_end();
	this.time = this.saved_time;
	return f.dot;
}, true, { waitfor: false });

// timer.dm:64
rt.def("/obj/item/device/assembly/timer/proc/update_icon", function* update_icon(f: Frame) {
	this.cut_overlays();
	this.attached_overlays = list();
	if (this.timing) {
		this.add_overlay("timer_timing");
		this.attached_overlays += "timer_timing";
	}
	if (!this.holder) return f.dot;
	yield* this.holder.update_icon();
	return f.dot;
}, true);

// timer.dm:74
rt.def("/obj/item/device/assembly/timer/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	let $0: any;
	if (!this.is_secured(user)) return f.dot;
	let second: Value = this.time % 60;
	let minute: Value = (this.time - second) / 60;
	if (this.timing) {
		$0 = fmt("<A href='?src=＃;time=0'>Timing</A>", [this]);
	} else {
		$0 = fmt("<A href='?src=＃;time=1'>Not Timing</A>", [this]);
	}
	let dat: Value = fmt("<TT><B>Timing Unit</B>\n＀ ＀:＀\n<A href='?src=＃;tp=-30'>-</A> <A href='?src=＃;tp=-1'>-</A> <A href='?src=＃;tp=1'>+</A> <A href='?src=＃;tp=30'>+</A>\n</TT>", [$0, minute, second, this, this, this, this]);
	dat += fmt("<BR><BR><A href='?src=＃;repeat=＀</A>", [this, this.loop ? "0'>Stop repeating" : "1'>Set to repeat"]);
	dat += fmt("<BR><BR><A href='?src=＃;refresh=1'>Refresh</A>", [this]);
	dat += fmt("<BR><BR><A href='?src=＃;close=1'>Close</A>", [this]);
	(popup = (yield* new_(T("/datum/browser"), user, "timer", this.name))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// timer.dm:87
rt.def("/obj/item/device/assembly/timer/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let timer_message: Value = null, tp: Value = null;
	yield* parent_proc();
	if (f.usr.incapacitated() || !(get_dist(this.loc, f.usr) <= 1)) {
		rt.op(f, "Browse", [], [f.usr, null, "window=timer"], false);
		onclose(f.usr, "timer");
		return f.dot;
	}
	if (rt.at(href_list, "time")) {
		this.timing = text2num(rt.at(href_list, "time"));
		if (this.timing && rt.istype(this.holder, T("/obj/item/device/transfer_valve"))) {
			message_admins((timer_message = `${`${key_name_admin(f.usr)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])}`} activated ${this} attachment on ${this.holder}.`));
			GLOB.bombers += timer_message;
			log_game(`${key_name(f.usr)} activated ${this} attachment on ${this.holder}`);
		}
		yield* this.update_icon();
	}
	if (rt.at(href_list, "repeat")) {
		this.loop = text2num(rt.at(href_list, "repeat"));
	}
	if (rt.at(href_list, "tp")) {
		this.time = min(max(round((this.time += (tp = text2num(rt.at(href_list, "tp"))))), 1), 600);
		this.saved_time = this.time;
	}
	if (rt.at(href_list, "close")) {
		rt.op(f, "Browse", [], [f.usr, null, "window=timer"], false);
		return f.dot;
	}
	if (!f.usr) return f.dot;
	yield* this.attack_self(f.usr);
	return f.dot;
}, true);
