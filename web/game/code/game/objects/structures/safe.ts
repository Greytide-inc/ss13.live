// Based on /tg/station's code/game/objects/structures/safe.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12868, "/obj/structure/safe", "/obj/structure", {
	open: 0,
	tumbler_1_pos: null,
	tumbler_1_open: null,
	tumbler_2_pos: null,
	tumbler_2_open: null,
	dial: 0,
	space: 0,
	maxspace: 24,
	anchored: 1,
	name: "safe",
	desc: "A huge chunk of metal with a dial embedded in it. Fine print on the dial reads \"Scarborough Arms - 2 tumbler safe, guaranteed thermite resistant, explosion resistant, and assistant resistant.\"",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "safe",
	density: 1,
	resistance_flags: 99,
});

// safe.dm:27
rt.def("/obj/structure/safe/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.tumbler_1_pos = rand(0, 71);
	this.tumbler_1_open = rand(0, 71);
	this.tumbler_2_pos = rand(0, 71);
	this.tumbler_2_open = rand(0, 71);
	return f.dot;
}, true);

// safe.dm:36
rt.def("/obj/structure/safe/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	let I: Value = null;
	parent_proc();
	if (!mapload) {
		return f.dot;
	}
	for (I of each(this.loc, T("/obj/item"))) {
		if (this.space >= this.maxspace) {
			return f.dot;
		}
		if (I.w_class + this.space <= this.maxspace) {
			this.space += I.w_class;
			I.loc = this;
		}
	}
	return f.dot;
}, false);

// safe.dm:50
rt.def("/obj/structure/safe/proc/check_unlocked", function check_unlocked(f: Frame, user: Value, canhear: Value) {
	if (user && canhear) {
		if (this.tumbler_1_pos == this.tumbler_1_open) {
			to_chat(user, `<span class='italics'>You hear a ${pick("tonk", "krunk", "plunk")} from ${this}.</span>`);
		}
		if (this.tumbler_2_pos == this.tumbler_2_open) {
			to_chat(user, `<span class='italics'>You hear a ${pick("tink", "krink", "plink")} from ${this}.</span>`);
		}
	}
	if (this.tumbler_1_pos == this.tumbler_1_open && this.tumbler_2_pos == this.tumbler_2_open) {
		if (user) {
			this.visible_message(`<i><b>${pick("Spring", "Sprang", "Sproing", "Clunk", "Krunk")}!</b></i>`);
		}
		return 1;
	}
	return 0;
});

// safe.dm:62
rt.def("/obj/structure/safe/proc/decrement", function decrement(f: Frame, num: Value) {
	num -= 1;
	if (num < 0) {
		num = 71;
	}
	return num;
});

// safe.dm:69
rt.def("/obj/structure/safe/proc/increment", function increment(f: Frame, num: Value) {
	if ((num += 1) > 71) {
		num = 0;
	}
	return num;
});

// safe.dm:77
rt.def("/obj/structure/safe/proc/update_icon", function update_icon(f: Frame) {
	if (this.open) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-open`;
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
	}
	return f.dot;
});

// safe.dm:83
rt.def("/obj/structure/safe/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let i: Value = null, _P: Value = null;
	let $1: any;
	yield* user.set_machine(this);
	let dat: Value = "<center>";
	let $0: any = this;
	if (this.open) {
		$1 = "Close";
	} else {
		$1 = "Open";
	}
	dat += fmt("<a href='?src=＃;open=1'>＀ ＀</a> | <a href='?src=＃;decrement=1'>-</a> ＀ <a href='?src=＃;increment=1'>+</a>", [$0, $1, this, this, this.dial * 5, this]);
	if (this.open) {
		dat += "<table>";
		i = rt.len(f, this.contents);
		while (i >= 1) {
			_P = rt.index(this.contents, i);
			dat += fmt("<tr><td><a href='?src=＃;retrieve=＃'>＀</a></td></tr>", [this, _P, _P.name]);
			i--;
		}
		dat += "</table></center>";
	}
	rt.op(f, "Browse", [], [user, `<html><head><title>${this.name}</title></head><body>${dat}</body></html>`, "window=safe;size=350x300"], false);
	return f.dot;
}, true);

// safe.dm:96
rt.def("/obj/structure/safe/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (!rt.istype(f.usr, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	// Safe-cracking and opening need you next to the safe (an href can name it from anywhere).
	if (!(get_dist(this, f.usr) <= 1)) {
		return f.dot;
	}
	let user: Value = f.usr;
	let canhear: Value = 0;
	if (user.is_holding_item_of_type(T("/obj/item/clothing/neck/stethoscope"))) {
		canhear = 1;
	}
	if (rt.at(href_list, "open")) {
		if (this.check_unlocked()) {
			to_chat(user, `<span class='notice'>You ${this.open ? "close" : "open"} ${this}.</span>`);
			this.open = (!this.open ? 1 : 0);
			yield* this.update_icon();
			yield* this.updateUsrDialog();
			return f.dot;
		} else {
			to_chat(user, `<span class='warning'>You can't ${this.open ? "close" : "open"} ${this}, the lock is engaged!</span>`);
			return f.dot;
		}
	}
	if (rt.at(href_list, "decrement")) {
		this.dial = this.decrement(this.dial);
		if (this.dial == this.tumbler_1_pos + 1 || this.dial == this.tumbler_1_pos - 71) {
			this.tumbler_1_pos = this.decrement(this.tumbler_1_pos);
			if (canhear) {
				to_chat(user, `<span class='italics'>You hear a ${pick("clack", "scrape", "clank")} from ${this}.</span>`);
			}
			if (this.tumbler_1_pos == this.tumbler_2_pos + 37 || this.tumbler_1_pos == this.tumbler_2_pos - 35) {
				this.tumbler_2_pos = this.decrement(this.tumbler_2_pos);
				if (canhear) {
					to_chat(user, `<span class='italics'>You hear a ${pick("click", "chink", "clink")} from ${this}.</span>`);
				}
			}
			this.check_unlocked(user, canhear);
		}
		yield* this.updateUsrDialog();
		return f.dot;
	}
	if (rt.at(href_list, "increment")) {
		this.dial = this.increment(this.dial);
		if (this.dial == this.tumbler_1_pos - 1 || this.dial == this.tumbler_1_pos + 71) {
			this.tumbler_1_pos = this.increment(this.tumbler_1_pos);
			if (canhear) {
				to_chat(user, `<span class='italics'>You hear a ${pick("clack", "scrape", "clank")} from ${this}.</span>`);
			}
			if (this.tumbler_1_pos == this.tumbler_2_pos - 37 || this.tumbler_1_pos == this.tumbler_2_pos + 35) {
				this.tumbler_2_pos = this.increment(this.tumbler_2_pos);
				if (canhear) {
					to_chat(user, `<span class='italics'>You hear a ${pick("click", "chink", "clink")} from ${this}.</span>`);
				}
			}
			this.check_unlocked(user, canhear);
		}
		yield* this.updateUsrDialog();
		return f.dot;
	}
	if (!rt.at(href_list, "retrieve")) return f.dot;
	rt.op(f, "Browse", [], [user, "", "window=safe"], false);
	let _P: Value = rt.locateIn(f, rt.at(href_list, "retrieve"), this);
	if (!this.open) return f.dot;
	if (!(_P && get_dist(this, user) <= 1)) return f.dot;
	yield* user.put_in_hands(_P);
	this.space -= _P.w_class;
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// safe.dm:157
rt.def("/obj/structure/safe/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.open) {
		f.dot = 1;
		if (I.w_class + this.space <= this.maxspace) {
			this.space += I.w_class;
			if (!(yield* user.drop_item())) {
				to_chat(user, fmt("<span class='warning'>＄！ is stuck to your hand, you cannot put it in the safe!</span>", [I]));
				return f.dot;
			}
			yield* I.forceMove(this);
			to_chat(user, `<span class='notice'>You put ${I} in ${this}.</span>`);
			yield* this.updateUsrDialog();
			return f.dot;
		} else {
			to_chat(user, `<span class='notice'>${I} won't fit in ${this}.</span>`);
			return f.dot;
		}
	} else if (rt.istype(I, T("/obj/item/clothing/neck/stethoscope"))) {
		to_chat(user, `<span class='warning'>Hold ${I} in one of your hands while you manipulate the dial!</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// safe.dm:176
rt.def("/obj/structure/safe/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

rt.type(12869, "/obj/structure/safe/floor", "/obj/structure/safe", {
	level: 1,
	name: "floor safe",
	icon_state: "floorsafe",
	density: 0,
	layer: 2.5,
});

// safe.dm:195
rt.def("/obj/structure/safe/floor/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	let _T: Value = null;
	parent_proc();
	if (!mapload) return f.dot;
	this.hide((_T = this.loc).intact);
	return f.dot;
}, false);

// safe.dm:202
rt.def("/obj/structure/safe/floor/proc/hide", function hide(f: Frame, intact: Value) {
	this.invisibility = intact ? INVISIBILITY_MAXIMUM : 0;
	return f.dot;
});
