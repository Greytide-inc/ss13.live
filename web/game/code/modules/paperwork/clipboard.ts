// Based on /tg/station's code/modules/paperwork/clipboard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7606, "/obj/item/weapon/clipboard", "/obj/item/weapon", {
	haspen: null,
	toppaper: null,
	throw_speed: 3,
	throw_range: 7,
	name: "clipboard",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "clipboard",
	item_state: "clipboard",
	throwforce: 0,
	w_class: 2,
	slot_flags: 512,
	resistance_flags: 4,
});

// clipboard.dm:16
rt.def("/obj/item/weapon/clipboard/proc/Initialize", function* Initialize(f: Frame) {
	yield* this.update_icon();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// clipboard.dm:20
rt.def("/obj/item/weapon/clipboard/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.haspen);
	this.haspen = null;
	yield* qdel(this.toppaper);
	this.toppaper = null;
	return (yield* parent_proc());
}, true);

// clipboard.dm:25
rt.def("/obj/item/weapon/clipboard/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (this.toppaper) {
		this.add_overlay(this.toppaper.icon_state);
		this.copy_overlays(this.toppaper);
	}
	if (this.haspen) {
		this.add_overlay("clipboard_pen");
	}
	this.add_overlay("clipboard_over");
	return f.dot;
});

// clipboard.dm:35
rt.def("/obj/item/weapon/clipboard/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/paper"))) {
		if (!(yield* user.transferItemToLoc(W, this))) {
			return f.dot;
		}
		this.toppaper = W;
		to_chat(user, fmt("<span class='notice'>You clip the paper onto ％！.</span>", [this]));
		yield* this.update_icon();
	} else {
		if (!this.toppaper) return f.dot;
		yield* this.toppaper.attackby(user.get_active_held_item(), user);
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// clipboard.dm:47
rt.def("/obj/item/weapon/clipboard/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let _P: Value = null;
	let dat: Value = "<title>Clipboard</title>";
	if (this.haspen) {
		dat += fmt("<A href='?src=＃;pen=1'>Remove Pen</A><BR><HR>", [this]);
	} else {
		dat += fmt("<A href='?src=＃;addpen=1'>Add Pen</A><BR><HR>", [this]);
	}
	if (this.toppaper) {
		_P = this.toppaper;
		dat += fmt("<A href='?src=＃;write=＃'>Write</A> <A href='?src=＃;remove=＃'>Remove</A> - <A href='?src=＃;read=＃'>＀</A><BR><HR>", [this, _P, this, _P, this, _P, _P.name]);
		for (_P of each(this, T("/obj/item/weapon/paper"))) {
			if (_P == this.toppaper) {
				continue;
			}
			dat += fmt("<A href='?src=＃;write=＃'>Write</A> <A href='?src=＃;remove=＃'>Remove</A> <A href='?src=＃;top=＃'>Move to top</A> - <A href='?src=＃;read=＃'>＀</A><BR>", [this, _P, this, _P, this, _P, this, _P, _P.name]);
		}
	}
	rt.op(f, "Browse", [], [user, dat, "window=clipboard"], false);
	onclose(user, "clipboard");
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true);

// clipboard.dm:68
rt.def("/obj/item/weapon/clipboard/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let held: Value = null, W: Value = null, _P: Value = null, newtop: Value = null;
	yield* parent_proc();
	if (f.usr.stat || f.usr.restrained()) {
		return f.dot;
	}
	if (!f.usr.contents.Find(this)) return f.dot;
	if (rt.at(href_list, "pen")) {
		if (this.haspen) {
			this.haspen.loc = f.usr.loc;
			yield* f.usr.put_in_hands(this.haspen);
			this.haspen = null;
		}
	}
	if (rt.at(href_list, "addpen")) {
		if (!this.haspen) {
			if (rt.istype((held = f.usr.get_active_held_item()), T("/obj/item/weapon/pen"))) {
				W = held;
				if (!(yield* f.usr.transferItemToLoc(W, this))) {
					return f.dot;
				}
				this.haspen = W;
				to_chat(f.usr, `<span class='notice'>You slot ${W} into ${this}.</span>`);
			}
		}
	}
	if (rt.at(href_list, "write")) {
		if (rt.istype((_P = rt.locateIn(f, rt.at(href_list, "write"), rt.world())), T("/obj/item")) && _P.loc == this) {
			if (f.usr.get_active_held_item()) {
				yield* _P.attackby(f.usr.get_active_held_item(), f.usr);
			}
		}
	}
	if (rt.at(href_list, "remove")) {
		if (rt.istype((_P = rt.locateIn(f, rt.at(href_list, "remove"), rt.world())), T("/obj/item")) && _P.loc == this) {
			_P.loc = f.usr.loc;
			yield* f.usr.put_in_hands(_P);
			if (_P == this.toppaper) {
				this.toppaper = null;
				if ((newtop = rt.locateIn(f, T("/obj/item/weapon/paper"), this)) && newtop != _P) {
					this.toppaper = newtop;
				} else {
					this.toppaper = null;
				}
			}
		}
	}
	if (rt.at(href_list, "read")) {
		if (rt.istype((_P = rt.locateIn(f, rt.at(href_list, "read"), rt.world())), T("/obj/item/weapon/paper")) && _P.loc == this) {
			yield* f.usr.examinate(_P);
		}
	}
	if (rt.at(href_list, "top")) {
		if (rt.istype((_P = rt.locateIn(f, rt.at(href_list, "top"), rt.world())), T("/obj/item")) && _P.loc == this) {
			this.toppaper = _P;
			to_chat(f.usr, `<span class='notice'>You move ${_P.name} to the top.</span>`);
		}
	}
	yield* this.attack_self(f.usr);
	yield* this.update_icon();
	return f.dot;
}, true);
