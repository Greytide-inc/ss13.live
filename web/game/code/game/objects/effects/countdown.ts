// Based on /tg/station's code/game/objects/effects/countdown.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11791, "/obj/effect/countdown", "/obj/effect", {
	displayed_text: null,
	attached_to: null,
	text_size: 4,
	started: 0,
	anchored: 1,
	name: "countdown",
	desc: "We're leaving together\nBut still it's farewell\nAnd maybe we'll come back\nTo earth, who can tell?",
	color: "#ff0000",
	invisibility: 60,
	layer: 6,
});

// countdown.dm:18
rt.def("/obj/effect/countdown/proc/New", function* New(f: Frame, A: Value) {
	f.dot = (yield* parent_proc());
	yield* this.attach(A);
	return f.dot;
}, true);

// countdown.dm:22
rt.def("/obj/effect/countdown/proc/examine", function examine(f: Frame, user: Value) {
	f.dot = parent_proc();
	to_chat(user, `This countdown is displaying: ${this.displayed_text}`);
	return f.dot;
}, false);

// countdown.dm:26
rt.def("/obj/effect/countdown/proc/attach", function attach(f: Frame, A: Value) {
	this.attached_to = A;
	this.loc = rt.getStep(f, A, 0);
	return f.dot;
});

// countdown.dm:30
rt.def("/obj/effect/countdown/proc/start", function start(f: Frame) {
	if (this.started) return f.dot;
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSfastprocess.processing += this;
	}
	this.started = 1;
	return f.dot;
});

// countdown.dm:37
rt.def("/obj/effect/countdown/proc/stop", function stop(f: Frame) {
	if (!this.started) return f.dot;
	this.maptext = null;
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	this.started = 0;
	return f.dot;
});

// countdown.dm:45
rt.def("/obj/effect/countdown/proc/process", function* process(f: Frame) {
	let new_val: Value = null;
	if (!this.attached_to || !this.attached_to || this.attached_to.gc_destroyed) {
		yield* qdel(this);
	}
	yield* this.forceMove(rt.getStep(f, this.attached_to, 0));
	if ((new_val = this.get_value()) == this.displayed_text) {
		return f.dot;
	}
	this.displayed_text = new_val;
	if (this.displayed_text) {
		this.maptext = `<font size = ${this.text_size}>${this.displayed_text}</font>`;
	} else {
		this.maptext = null;
	}
	return f.dot;
}, true, { waitfor: false });

// countdown.dm:60
rt.def("/obj/effect/countdown/proc/Destroy", function* Destroy(f: Frame) {
	this.attached_to = null;
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(11792, "/obj/effect/countdown/syndicatebomb", "/obj/effect/countdown", {
	name: "syndicate bomb countdown",
});

// countdown.dm:70
rt.def("/obj/effect/countdown/syndicatebomb/proc/get_value", function get_value(f: Frame) {
	let S: Value = null;
	if (!rt.istype((S = this.attached_to), T("/obj/machinery/syndicatebomb"))) {
		return f.dot;
	} else {
		if (!S.active) return f.dot;
		return S.seconds_remaining();
	}
});

rt.type(11793, "/obj/effect/countdown/nuclearbomb", "/obj/effect/countdown", {
	name: "nuclear bomb countdown",
	color: "#81FF14",
});

// countdown.dm:81
rt.def("/obj/effect/countdown/nuclearbomb/proc/get_value", function get_value(f: Frame) {
	let N: Value = null;
	if (!rt.istype((N = this.attached_to), T("/obj/machinery/nuclearbomb"))) {
		return f.dot;
	} else {
		if (!N.timing) return f.dot;
		return round(N.get_time_left(), 1);
	}
});

rt.type(11794, "/obj/effect/countdown/clonepod", "/obj/effect/countdown", {
	text_size: 1,
	name: "cloning pod countdown",
	color: "#0C479D",
});

// countdown.dm:93
rt.def("/obj/effect/countdown/clonepod/proc/get_value", function get_value(f: Frame) {
	let C: Value = null, completion: Value = null;
	if (!rt.istype((C = this.attached_to), T("/obj/machinery/clonepod"))) {
		return f.dot;
	} else {
		if (!C.occupant) return f.dot;
		return (completion = round(C.get_completion()));
	}
});

rt.type(11795, "/obj/effect/countdown/dominator", "/obj/effect/countdown", {
	text_size: 1,
	name: "dominator countdown",
	color: "#ff00ff",
});

// countdown.dm:106
rt.def("/obj/effect/countdown/dominator/proc/get_value", function get_value(f: Frame) {
	let D: Value = null, timer: Value = null;
	if (!rt.istype((D = this.attached_to), T("/obj/machinery/dominator"))) {
		return f.dot;
	} else if (D.gang && D.gang.is_dominating) {
		return (timer = D.gang.domination_time_remaining());
	} else {
		return "OFFLINE";
	}
});

rt.type(11796, "/obj/effect/countdown/clockworkgate", "/obj/effect/countdown", {
	text_size: 1,
	name: "gateway countdown",
	color: "#BE8700",
	layer: 12,
});

// countdown.dm:122
rt.def("/obj/effect/countdown/clockworkgate/proc/get_value", function get_value(f: Frame) {
	let G: Value = null;
	if (!rt.istype((G = this.attached_to), T("/obj/structure/destructible/clockwork/massive/celestial_gateway"))) {
		return f.dot;
	} else {
		if (!(G.obj_integrity && !G.purpose_fulfilled)) return f.dot;
		return `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'>${G.get_arrival_text(0)}</div>`;
	}
});

rt.type(11797, "/obj/effect/countdown/supermatter", "/obj/effect/countdown", {
	text_size: 1,
	name: "supermatter damage",
	color: "#ED84F4",
});

// countdown.dm:134
rt.def("/obj/effect/countdown/supermatter/proc/get_value", function get_value(f: Frame) {
	let S: Value = null;
	if (!rt.istype((S = this.attached_to), T("/obj/machinery/power/supermatter_shard"))) {
		return f.dot;
	}
	return `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'>${round(S.damage / S.explosion_point * 100)}</div>`;
});

rt.type(11798, "/obj/effect/countdown/transformer", "/obj/effect/countdown", {
	name: "transformer countdown",
	color: "#4C5866",
});

// countdown.dm:144
rt.def("/obj/effect/countdown/transformer/proc/get_value", function get_value(f: Frame) {
	let _T: Value = null, seconds_left: Value = null;
	if (!rt.istype((_T = this.attached_to), T("/obj/machinery/transformer"))) {
		return f.dot;
	} else {
		if (!_T.cooldown) return f.dot;
		return `${round((seconds_left = max(0, (_T.cooldown_timer - rt.worldTime(f)) / 10)))}`;
	}
});

rt.type(11799, "/obj/effect/countdown/doomsday", "/obj/effect/countdown", {
	text_size: 3,
	name: "doomsday countdown",
});

// countdown.dm:156
rt.def("/obj/effect/countdown/doomsday/proc/get_value", function get_value(f: Frame) {
	let DD: Value = null;
	if (!rt.istype((DD = this.attached_to), T("/obj/machinery/doomsday_device"))) {
		return f.dot;
	} else {
		if (!DD.timing) return f.dot;
		return `<div align='center' valign='middle' style='position:relative; top:0px; left:0px'>${DD.seconds_remaining()}</div>`;
	}
});

rt.type(11800, "/obj/effect/countdown/anomaly", "/obj/effect/countdown", {
	name: "anomaly countdown",
});

// countdown.dm:166
rt.def("/obj/effect/countdown/anomaly/proc/get_value", function get_value(f: Frame) {
	let A: Value = null, time_left: Value = null;
	if (!rt.istype((A = this.attached_to), T("/obj/effect/anomaly"))) {
		return f.dot;
	} else {
		return round((time_left = max(0, (A.death_time - rt.worldTime(f)) / 10)));
	}
});
