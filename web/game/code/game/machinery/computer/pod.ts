// Based on /tg/station's code/game/machinery/computer/pod.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10402, "/obj/machinery/computer/pod", "/obj/machinery/computer", {
	connected: null,
	title: "Mass Driver Controls",
	id: 1,
	timing: 0,
	time: 30,
	range: 4,
	name: "mass driver launch control",
	desc: "A combined blastdoor and mass driver control unit.",
});

// pod.dm:13
rt.def("/obj/machinery/computer/pod/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null;
	yield* parent_proc();
	for (M of each(range(this.range, this), T("/obj/machinery/mass_driver"))) {
		if (M.id == this.id) {
			this.connected = M;
		}
	}
	return f.dot;
}, true);

// pod.dm:20
rt.def("/obj/machinery/computer/pod/proc/alarm", function* alarm(f: Frame) {
	let M: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!this.connected) {
		rt.op(f, "Output", [], [viewers(null, null), "Cannot locate mass driver connector. Cancelling firing sequence!"], false);
		return f.dot;
	}
	for (M of each(range(this.range, this), T("/obj/machinery/door/poddoor"))) {
		if (M.id == this.id) {
			yield* M.open();
		}
	}
	yield* sleep(20);
	M = null;
	for (M of each(range(this.range, this), T("/obj/machinery/mass_driver"))) {
		if (M.id == this.id) {
			M.power = this.connected.power;
			yield* M.drive();
		}
	}
	yield* sleep(50);
	M = null;
	for (M of each(range(this.range, this), T("/obj/machinery/door/poddoor"))) {
		if (M.id == this.id) {
			yield* M.close();
		}
	}
	return f.dot;
}, true);

// pod.dm:43
rt.def("/obj/machinery/computer/pod/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let d2: Value = null, second: Value = null, minute: Value = null, temp: Value = null, L: Value = null, t: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let dat: Value = "";
	yield* user.set_machine(this);
	if (this.connected) {
		if (this.timing) {
			d2 = fmt("<A href='?src=＃;time=0'>Stop Time Launch</A>", [this]);
		} else {
			d2 = fmt("<A href='?src=＃;time=1'>Initiate Time Launch</A>", [this]);
		}
		second = this.time % 60;
		minute = (this.time - second) / 60;
		$0 = d2;
		if (minute) {
			$1 = `${minute}:`;
		} else {
			$1 = null;
		}
		dat += fmt("<HR>\nTimer System: ＀\nTime Left: ＀＀ <A href='?src=＃;tp=-30'>-</A> <A href='?src=＃;tp=-1'>-</A> <A href='?src=＃;tp=1'>+</A> <A href='?src=＃;tp=30'>+</A>", [$0, $1, second, this, this, this, this]);
		temp = "";
		L = list(0.25, 0.5, 1, 2, 4, 8, 16);
		for (t of each(L)) {
			if (t == this.connected.power) {
				temp += `${t} `;
			} else {
				temp += fmt("<A href = '?src=＃;power=＀'>＀</A> ", [this, t, t]);
			}
		}
		dat += fmt("<HR>\nPower Level: ＀<BR>\n<A href = '?src=＃;alarm=1'>Firing Sequence</A><BR>\n<A href = '?src=＃;drive=1'>Test Fire Driver</A><BR>\n<A href = '?src=＃;door=1'>Toggle Outer Door</A><BR>", [temp, this, this, this]);
	} else {
		dat += fmt("<BR>\n<A href = '?src=＃;door=1'>Toggle Outer Door</A><BR>", [this]);
	}
	dat += fmt("<BR><BR><A href='?src=＃;mach_close=computer'>Close</A>", [user]);
	yield* this.add_fingerprint(f.usr);
	(popup = (yield* new_(T("/datum/browser"), user, "computer", this.title, 400, 500))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// pod.dm:76
rt.def("/obj/machinery/computer/pod/proc/process", function* process(f: Frame) {
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (!this.timing) return f.dot;
	if (this.time > 0) {
		this.time = round(this.time) - 1;
	} else {
		yield* this.alarm();
		this.time = 0;
		this.timing = 0;
	}
	yield* this.updateDialog();
	return f.dot;
}, true, { waitfor: false });

// pod.dm:89
rt.def("/obj/machinery/computer/pod/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let t: Value = null, tp: Value = null, M: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!(f.usr.contents.Find(this) || get_dist(this, f.usr) <= 1 && isturf(this.loc) || rt.istype(f.usr, T("/mob/living/silicon")))) return f.dot;
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "power")) {
		t = text2num(rt.at(href_list, "power"));
		t = min(max(0.25, t), 16);
		if (this.connected) {
			this.connected.power = t;
		}
	}
	if (rt.at(href_list, "alarm")) {
		yield* this.alarm();
	}
	if (rt.at(href_list, "time")) {
		this.timing = text2num(rt.at(href_list, "time"));
	}
	if (rt.at(href_list, "tp")) {
		this.time = min(max(round((this.time += (tp = text2num(rt.at(href_list, "tp"))))), 0), 120);
	}
	if (rt.at(href_list, "door")) {
		for (M of each(range(this.range, this), T("/obj/machinery/door/poddoor"))) {
			if (M.id == this.id) {
				if (M.density) {
					yield* M.open();
				} else {
					yield* M.close();
				}
			}
		}
	}
	if (rt.at(href_list, "drive")) {
		M = null;
		for (M of each(range(this.range, this), T("/obj/machinery/mass_driver"))) {
			if (M.id == this.id) {
				M.power = this.connected.power;
				yield* M.drive();
			}
		}
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

rt.type(10404, "/obj/machinery/computer/pod/old/syndicate", "/obj/machinery/computer/pod/old", {
	title: "External Airlock Controls",
	name: "１ProComp Executive IIc",
	desc: "The Syndicate operate on a tight budget. Operates external airlocks.",
	req_access: null,
});

// pod.dm:133
rt.def("/obj/machinery/computer/pod/old/syndicate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(150);
	return f.dot;
});

// pod.dm:136
rt.def("/obj/machinery/computer/pod/old/syndicate/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!(yield* this.allowed(user))) {
		to_chat(user, "<span class='notice'>Access denied.</span>");
		return f.dot;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);
