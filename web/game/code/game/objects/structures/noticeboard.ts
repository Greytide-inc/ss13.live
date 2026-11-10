// Based on /tg/station's code/game/objects/structures/noticeboard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12820, "/obj/structure/noticeboard", "/obj/structure", {
	notices: 0,
	anchored: 1,
	name: "notice board",
	desc: "A board for pinning important notices upon.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "nboard00",
	density: 0,
	obj_integrity: 150,
	max_integrity: 150,
});

// noticeboard.dm:13
rt.def("/obj/structure/noticeboard/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	let I: Value = null;
	parent_proc();
	if (!mapload) {
		return f.dot;
	}
	for (I of each(this.loc, T("/obj/item"))) {
		if (this.notices > 4) {
			break;
		}
		if (rt.istype(I, T("/obj/item/weapon/paper"))) {
			I.loc = this;
			this.notices++;
		}
	}
	this.icon_state = `nboard0${this.notices}`;
	return f.dot;
}, false);

// noticeboard.dm:27
rt.def("/obj/structure/noticeboard/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/paper")) || rt.istype(O, T("/obj/item/weapon/photo"))) {
		if (!(yield* this.allowed(user))) {
			to_chat(user, "<span class='info'>You are not authorized to add notices</span>");
			return f.dot;
		}
		if (this.notices < 5) {
			if (!(yield* user.transferItemToLoc(O, this))) {
				return f.dot;
			}
			this.notices++;
			this.icon_state = `nboard0${this.notices}`;
			to_chat(user, `<span class='notice'>You pin the ${O} to the noticeboard.</span>`);
		} else {
			to_chat(user, "<span class='notice'>The notice board is full</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// noticeboard.dm:43
rt.def("/obj/structure/noticeboard/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	let _P: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	let auth: Value = this.allowed(user);
	let dat: Value = `<B>${this.name}</B><BR>`;
	for (_P of each(this, T("/obj/item"))) {
		if (rt.istype(_P, T("/obj/item/weapon/paper"))) {
			$0 = this;
			$1 = _P;
			$2 = _P.name;
			if (auth) {
				$3 = fmt("<A href='?src=＃;write=＃'>Write</A> <A href='?src=＃;remove=＃'>Remove</A>", [this, _P, this, _P]);
			} else {
				$3 = "";
			}
			dat += fmt("<A href='?src=＃;read=＃'>＀</A> ＀<BR>", [$0, $1, $2, $3]);
		} else {
			$0 = this;
			$1 = _P;
			$2 = _P.name;
			if (auth) {
				$3 = fmt("<A href='?src=＃;remove=＃'>Remove</A>", [this, _P]);
			} else {
				$3 = "";
			}
			dat += fmt("<A href='?src=＃;read=＃'>＀</A> ＀<BR>", [$0, $1, $2, $3]);
		}
	}
	rt.op(f, "Browse", [], [user, `<HEAD><TITLE>Notices</TITLE></HEAD>${dat}`, "window=noticeboard"], false);
	onclose(user, "noticeboard");
	return f.dot;
});

// noticeboard.dm:54
rt.def("/obj/structure/noticeboard/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let I: Value = null, _P: Value = null, I_1: Value = null;
	yield* parent_proc();
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "remove")) {
		if (f.usr.stat || f.usr.restrained()) {
			return f.dot;
		}
		if (rt.istype((I = rt.locateIn(f, rt.at(href_list, "remove"), this.contents)), T("/obj/item")) && I.loc == this) {
			I.loc = f.usr.loc;
			yield* f.usr.put_in_hands(I);
			this.notices--;
			this.icon_state = `nboard0${this.notices}`;
		}
	}
	if (rt.at(href_list, "write")) {
		if (f.usr.stat || f.usr.restrained()) {
			return f.dot;
		}
		if (rt.istype((_P = rt.locateIn(f, rt.at(href_list, "write"), this.contents)), T("/obj/item")) && _P.loc == this) {
			if (I_1 = f.usr.is_holding_item_of_type(T("/obj/item/weapon/pen"))) {
				yield* this.add_fingerprint(f.usr);
				yield* _P.attackby(I_1, f.usr);
			} else {
				to_chat(f.usr, "<span class='notice'>You'll need something to write with!</span>");
			}
		}
	}
	if (!rt.at(href_list, "read")) return f.dot;
	if (!(rt.istype((I = rt.locateIn(f, rt.at(href_list, "read"), this.contents)), T("/obj/item")) && I.loc == this)) return f.dot;
	yield* f.usr.examinate(I);
	return f.dot;
}, true);

// noticeboard.dm:84
rt.def("/obj/structure/noticeboard/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 1);
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12821, "/obj/structure/noticeboard/captain", "/obj/structure/noticeboard", {
	name: "Captain's Notice Board",
	desc: "Important notices from the Captain.",
	req_access: null,
});

// noticeboard.dm:93
rt.def("/obj/structure/noticeboard/captain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(20);
	return f.dot;
});

rt.type(12822, "/obj/structure/noticeboard/hop", "/obj/structure/noticeboard", {
	name: "Head of Personnel's Notice Board",
	desc: "Important notices from the Head of Personnel.",
	req_access: null,
});

// noticeboard.dm:98
rt.def("/obj/structure/noticeboard/hop/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(57);
	return f.dot;
});

rt.type(12823, "/obj/structure/noticeboard/ce", "/obj/structure/noticeboard", {
	name: "Chief Engineer's Notice Board",
	desc: "Important notices from the Chief Engineer.",
	req_access: null,
});

// noticeboard.dm:103
rt.def("/obj/structure/noticeboard/ce/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(56);
	return f.dot;
});

rt.type(12824, "/obj/structure/noticeboard/hos", "/obj/structure/noticeboard", {
	name: "Head of Security's Notice Board",
	desc: "Important notices from the Head of Security.",
	req_access: null,
});

// noticeboard.dm:108
rt.def("/obj/structure/noticeboard/hos/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(58);
	return f.dot;
});

rt.type(12825, "/obj/structure/noticeboard/cmo", "/obj/structure/noticeboard", {
	name: "Chief Medical Officer's Notice Board",
	desc: "Important notices from the Chief Medical Officer.",
	req_access: null,
});

// noticeboard.dm:113
rt.def("/obj/structure/noticeboard/cmo/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(40);
	return f.dot;
});

rt.type(12826, "/obj/structure/noticeboard/rd", "/obj/structure/noticeboard", {
	name: "Research Director's Notice Board",
	desc: "Important notices from the Research Director.",
	req_access: null,
});

// noticeboard.dm:118
rt.def("/obj/structure/noticeboard/rd/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(30);
	return f.dot;
});

rt.type(12827, "/obj/structure/noticeboard/qm", "/obj/structure/noticeboard", {
	name: "Quartermaster's Notice Board",
	desc: "Important notices from the Quartermaster.",
	req_access: null,
});

// noticeboard.dm:123
rt.def("/obj/structure/noticeboard/qm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(41);
	return f.dot;
});

rt.type(12828, "/obj/structure/noticeboard/staff", "/obj/structure/noticeboard", {
	name: "Staff Notice Board",
	desc: "Important notices from the heads of staff.",
	req_access: null,
});

// noticeboard.dm:128
rt.def("/obj/structure/noticeboard/staff/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(19);
	return f.dot;
});
