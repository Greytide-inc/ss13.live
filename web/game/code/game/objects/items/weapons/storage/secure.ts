// Based on /tg/station's code/game/objects/items/weapons/storage/secure.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(5582, "/obj/item/weapon/storage/secure", "/obj/item/weapon/storage", {
	icon_locking: "secureb",
	icon_sparking: "securespark",
	icon_opened: "secure0",
	locked: 1,
	code: "",
	l_code: null,
	l_set: 0,
	l_setshort: 0,
	l_hacking: 0,
	open: 0,
	name: "secstorage",
	w_class: 3,
	max_w_class: 2,
	max_combined_w_class: 14,
});

// secure.dm:30
rt.def("/obj/item/weapon/storage/secure/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `The service panel is ${this.open ? "open" : "closed"}.`);
	return f.dot;
}, false);

// secure.dm:35
rt.def("/obj/item/weapon/storage/secure/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (this.locked) {
		if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
			if (yield* do_after(user, 20 * W.toolspeed, { target: this })) {
				this.open = (!this.open ? 1 : 0);
				user.show_message(`<span class='notice'>You ${this.open ? "open" : "close"} the service panel.</span>`, 1);
			}
			return f.dot;
		}
		if (rt.istype(W, T("/obj/item/device/multitool")) && this.open == 1 && !this.l_hacking) {
			user.show_message("<span class='danger'>Now attempting to reset internal memory, please hold.</span>", 1);
			this.l_hacking = 1;
			if (yield* do_after(f.usr, 100 * W.toolspeed, { target: this })) {
				if (prob(33)) {
					this.l_setshort = 1;
					this.l_set = 0;
					user.show_message("<span class='danger'>Internal memory reset.  Please give it a few seconds to reinitialize.</span>", 1);
					yield* sleep(80);
					this.l_setshort = 0;
					this.l_hacking = 0;
				} else {
					user.show_message("<span class='danger'>Unable to reset internal memory.</span>", 1);
					this.l_hacking = 0;
				}
			} else {
				this.l_hacking = 0;
			}
			return f.dot;
		}
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// secure.dm:66
rt.def("/obj/item/weapon/storage/secure/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	if (this.locked) {
		yield* this.add_fingerprint(f.usr);
		to_chat(f.usr, "<span class='warning'>It's locked!</span>");
		return 0;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// secure.dm:72
rt.def("/obj/item/weapon/storage/secure/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* user.set_machine(this);
	let $0: any = this;
	let dat: Value = `<TT><B>${$0}</B><BR>\n\nLock Status: ${this.locked ? "LOCKED" : "UNLOCKED"}`;
	let message: Value = "Code";
	if (this.l_set == 0 && !this.l_setshort) {
		dat += "<p>\n<b>5-DIGIT PASSCODE NOT SET.<br>ENTER NEW PASSCODE.</b>";
	}
	if (this.l_setshort) {
		dat += "<p>\n<font color=red><b>ALERT: MEMORY SYSTEM ERROR - 6040 201</b></font>";
	}
	message = `${this.code}`;
	if (!this.locked) {
		message = "*****";
	}
	dat += fmt("<HR>\n>＀<BR>\n<A href='?src=＃;type=1'>1</A>-<A href='?src=＃;type=2'>2</A>-<A href='?src=＃;type=3'>3</A><BR>\n<A href='?src=＃;type=4'>4</A>-<A href='?src=＃;type=5'>5</A>-<A href='?src=＃;type=6'>6</A><BR>\n<A href='?src=＃;type=7'>7</A>-<A href='?src=＃;type=8'>8</A>-<A href='?src=＃;type=9'>9</A><BR>\n<A href='?src=＃;type=R'>R</A>-<A href='?src=＃;type=0'>0</A>-<A href='?src=＃;type=E'>E</A><BR>\n</TT>", [message, this, this, this, this, this, this, this, this, this, this, this, this]);
	rt.op(f, "Browse", [], [user, dat, "window=caselock;size=300x280"], false);
	return f.dot;
}, true);

// secure.dm:86
rt.def("/obj/item/weapon/storage/secure/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (f.usr.stat || f.usr.restrained() || get_dist(this, f.usr) > 1) {
		return f.dot;
	}
	if (rt.at(href_list, "type")) {
		if (rt.at(href_list, "type") == "E") {
			if (this.l_set == 0 && rt.length(this.code) == 5 && !this.l_setshort && this.code != "ERROR") {
				this.l_code = this.code;
				this.l_set = 1;
			} else if (this.code == this.l_code && this.l_set == 1) {
				this.locked = 0;
				this.cut_overlays();
				this.add_overlay(this.icon_opened);
				this.code = null;
			} else {
				this.code = "ERROR";
			}
		} else if (rt.at(href_list, "type") == "R" && !this.l_setshort) {
			this.locked = 1;
			this.cut_overlays();
			this.code = null;
			yield* this.close(f.usr);
		} else {
			rt.modField(f, this, "code", `${sanitize_text(rt.at(href_list, "type"))}`, add);
			if (rt.length(this.code) > 5) {
				this.code = "ERROR";
			}
		}
		yield* this.add_fingerprint(f.usr);
		for (M of each(viewers(1, this.loc), T("/mob"))) {
			if (M.client && M.machine == this) {
				yield* this.attack_self(M);
			}
			return f.dot;
		}
	}
	return f.dot;
}, true);

// secure.dm:120
rt.def("/obj/item/weapon/storage/secure/proc/storage_contents_dump_act", function* storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	if (this.locked) {
		to_chat(user, "<span class='warning'>It's locked!</span>");
		return 0;
	}
	return (yield* parent_proc());
}, true);

// secure.dm:127
rt.def("/obj/item/weapon/storage/secure/proc/can_be_inserted", function can_be_inserted(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (this.locked) {
		return 0;
	}
	return parent_proc();
}, false, { args: ["W", "stop_messages"] });

rt.type(5583, "/obj/item/weapon/storage/secure/briefcase", "/obj/item/weapon/storage/secure", {
	throw_speed: 2,
	throw_range: 4,
	name: "secure briefcase",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "secure",
	item_state: "sec-case",
	desc: "A large briefcase with a digital locking system.",
	force: 8,
	hitsound: "swing_hit",
	w_class: 4,
	max_w_class: 3,
	max_combined_w_class: 21,
	attack_verb: null,
});

// secure.dm:149
rt.def("/obj/item/weapon/storage/secure/briefcase/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/paper"), this);
	yield* new_(T("/obj/item/weapon/pen"), this);
	return f.dot;
}, true);

// secure.dm:153
rt.def("/obj/item/weapon/storage/secure/briefcase/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user && this.locked == 1) {
		to_chat(f.usr, `<span class='warning'>${this} is locked and cannot be opened!</span>`);
		yield* this.add_fingerprint(user);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(5584, "/obj/item/weapon/storage/secure/briefcase/syndie", "/obj/item/weapon/storage/secure/briefcase", {
	force: 15,
});

// secure.dm:164
rt.def("/obj/item/weapon/storage/secure/briefcase/syndie/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	let i: Value = 0;
	while (i < this.storage_slots - 2) {
		yield* new_(T("/obj/item/stack/spacecash/c1000"), this);
		i++;
	}
	return f.dot;
}, true);

rt.type(5585, "/obj/item/weapon/storage/secure/safe", "/obj/item/weapon/storage/secure", {
	icon_opened: "safe0",
	icon_locking: "safeb",
	icon_sparking: "safespark",
	anchored: 1,
	name: "secure safe",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "safe",
	force: 8,
	w_class: 6,
	max_w_class: 8,
	density: 0,
	cant_hold: null,
});

// secure.dm:185
rt.def("/obj/item/weapon/storage/secure/safe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cant_hold = list(T("/obj/item/weapon/storage/secure/briefcase"));
	return f.dot;
});

// secure.dm:188
rt.def("/obj/item/weapon/storage/secure/safe/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/paper"), this);
	yield* new_(T("/obj/item/weapon/pen"), this);
	return f.dot;
}, true);

// secure.dm:192
rt.def("/obj/item/weapon/storage/secure/safe/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	return (yield* this.attack_self(user));
}, true);
