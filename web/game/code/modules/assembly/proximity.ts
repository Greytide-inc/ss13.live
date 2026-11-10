// Based on /tg/station's code/modules/assembly/proximity.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9379, "/obj/item/device/assembly/prox_sensor", "/obj/item/device/assembly", {
	scanning: 0,
	timing: 0,
	time: 10,
	sensitivity: 1,
	attachable: 1,
	name: "proximity sensor",
	desc: "Used for scanning and alerting when someone enters a certain proximity.",
	icon_state: "prox",
	materials: null,
	origin_tech: "magnets=1;engineering=1",
});

// proximity.dm:5
rt.def("/obj/item/device/assembly/prox_sensor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 800, "$glass", 200]);
	return f.dot;
});

// proximity.dm:21
rt.def("/obj/item/device/assembly/prox_sensor/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.proximity_monitor = (yield* new_(T("/datum/proximity_monitor"), this, 0));
	return f.dot;
}, true);

// proximity.dm:26
rt.def("/obj/item/device/assembly/prox_sensor/proc/describe", function describe(f: Frame) {
	if (this.timing) {
		return "<span class='notice'>The proximity sensor is arming.</span>";
	}
	return `The proximity sensor is ${this.scanning ? "armed" : "disarmed"}.`;
});

// proximity.dm:30
rt.def("/obj/item/device/assembly/prox_sensor/proc/activate", function* activate(f: Frame) {
	if (!(yield* parent_proc())) {
		return 0;
	}
	this.timing = (!this.timing ? 1 : 0);
	yield* this.update_icon();
	return 1;
}, true);

// proximity.dm:37
rt.def("/obj/item/device/assembly/prox_sensor/proc/toggle_secure", function* toggle_secure(f: Frame) {
	this.secured = (!this.secured ? 1 : 0);
	if (!this.secured) {
		if (this.scanning) {
			yield* this.toggle_scan();
			this.proximity_monitor.host = this;
		}
		this.timing = 0;
	} else {
		this.proximity_monitor.host = this.loc;
	}
	yield* this.update_icon();
	return this.secured;
}, true);

// proximity.dm:50
rt.def("/obj/item/device/assembly/prox_sensor/proc/HasProximity", function* HasProximity(f: Frame, AM: Value) {
	if (rt.istype(AM, T("/obj/effect/beam"))) {
		return f.dot;
	}
	yield* this.sense();
	return f.dot;
}, true);

// Empty in tg.
rt.def("/obj/item/device/assembly/prox_sensor/proc/sense");

// proximity.dm:56
rt.def("/obj/item/device/assembly/prox_sensor/proc/sense", function* sense(f: Frame) {
	if (!this.secured || this.next_activate > rt.worldTime(f)) {
		return 0;
	}
	yield* this.pulse(0);
	this.audible_message(`${bicon(this)} *beep* *beep*`, null, 3);
	this.next_activate = rt.worldTime(f) + 30;
	return f.dot;
}, true);

// proximity.dm:65
rt.def("/obj/item/device/assembly/prox_sensor/proc/process", function* process(f: Frame) {
	if (!this.timing) return f.dot;
	this.time--;
	if (!(this.time <= 0)) return f.dot;
	this.timing = 0;
	yield* this.toggle_scan(1);
	this.time = rt.initial(f, this, "time");
	return f.dot;
}, true, { waitfor: false });

// Empty in tg.
rt.def("/obj/item/device/assembly/prox_sensor/proc/toggle_scan");

// proximity.dm:72
rt.def("/obj/item/device/assembly/prox_sensor/proc/toggle_scan", function* toggle_scan(f: Frame, scan: Value) {
	let $1: any;
	if (!this.secured) {
		return 0;
	}
	this.scanning = scan;
	let $0: any = this.proximity_monitor;
	if (this.scanning) {
		$1 = this.sensitivity;
	} else {
		$1 = 0;
	}
	yield* $0.SetRange($1);
	yield* this.update_icon();
	return f.dot;
}, true);

// proximity.dm:79
rt.def("/obj/item/device/assembly/prox_sensor/proc/sensitivity_change", function* sensitivity_change(f: Frame, value: Value) {
	let sense: Value = null;
	this.sensitivity = (sense = min(max(this.sensitivity + value, 0), 5));
	if (!(this.scanning && (yield* this.proximity_monitor.SetRange(sense)))) return f.dot;
	yield* this.sense();
	return f.dot;
}, true);

// proximity.dm:85
rt.def("/obj/item/device/assembly/prox_sensor/proc/update_icon", function* update_icon(f: Frame) {
	this.cut_overlays();
	this.attached_overlays = list();
	if (this.timing) {
		this.add_overlay("prox_timing");
		this.attached_overlays += "prox_timing";
	}
	if (this.scanning) {
		this.add_overlay("prox_scanning");
		this.attached_overlays += "prox_scanning";
	}
	if (this.holder) {
		yield* this.holder.update_icon();
	}
	return f.dot;
}, true);

// proximity.dm:98
rt.def("/obj/item/device/assembly/prox_sensor/proc/interact", function interact(f: Frame, user: Value) {
	let $0: any, $1: any;
	if (!this.is_secured(user)) return f.dot;
	let second: Value = this.time % 60;
	let minute: Value = (this.time - second) / 60;
	if (this.timing) {
		$0 = fmt("<A href='?src=＃;time=0'>Arming</A>", [this]);
	} else {
		$0 = fmt("<A href='?src=＃;time=1'>Not Arming</A>", [this]);
	}
	let dat: Value = fmt("<TT><B>Proximity Sensor</B>\n＀ ＀:＀\n<A href='?src=＃;tp=-30'>-</A> <A href='?src=＃;tp=-1'>-</A> <A href='?src=＃;tp=1'>+</A> <A href='?src=＃;tp=30'>+</A>\n</TT>", [$0, minute, second, this, this, this, this]);
	$0 = this;
	if (this.scanning) {
		$1 = "0'>Armed";
	} else {
		$1 = "1'>Unarmed";
	}
	dat += fmt("<BR><A href='?src=＃;scanning=＀</A> (Movement sensor active when armed!)", [$0, $1]);
	dat += fmt("<BR>Detection range: <A href='?src=＃;sense=down'>-</A> ＀ <A href='?src=＃;sense=up'>+</A>", [this, this.sensitivity, this]);
	dat += fmt("<BR><BR><A href='?src=＃;refresh=1'>Refresh</A>", [this]);
	dat += fmt("<BR><BR><A href='?src=＃;close=1'>Close</A>", [this]);
	rt.op(f, "Browse", [], [user, dat, "window=prox"], false);
	onclose(user, "prox");
	return f.dot;
});

// proximity.dm:112
rt.def("/obj/item/device/assembly/prox_sensor/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let tp: Value = null;
	let $0: any;
	yield* parent_proc();
	if (f.usr.incapacitated() || !(get_dist(this.loc, f.usr) <= 1)) {
		rt.op(f, "Browse", [], [f.usr, null, "window=prox"], false);
		onclose(f.usr, "prox");
		return f.dot;
	}
	if (rt.at(href_list, "sense")) {
		if (rt.at(href_list, "sense") == "up") {
			$0 = 1;
		} else {
			$0 = -1;
		}
		yield* this.sensitivity_change($0);
	}
	if (rt.at(href_list, "scanning")) {
		yield* this.toggle_scan(text2num(rt.at(href_list, "scanning")));
	}
	if (rt.at(href_list, "time")) {
		this.timing = text2num(rt.at(href_list, "time"));
		yield* this.update_icon();
	}
	if (rt.at(href_list, "tp")) {
		this.time = min(max(round((this.time += (tp = text2num(rt.at(href_list, "tp"))))), 0), 600);
	}
	if (rt.at(href_list, "close")) {
		rt.op(f, "Browse", [], [f.usr, null, "window=prox"], false);
		return f.dot;
	}
	if (!f.usr) return f.dot;
	yield* this.attack_self(f.usr);
	return f.dot;
}, true);
