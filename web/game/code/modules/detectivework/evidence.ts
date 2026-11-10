// Based on /tg/station's code/modules/detectivework/evidence.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7479, "/obj/item/weapon/evidencebag", "/obj/item/weapon", {
	name: "evidence bag",
	desc: "An empty evidence bag.",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "evidenceobj",
	item_state: "",
	w_class: 1,
});

// evidence.dm:12
rt.def("/obj/item/weapon/evidencebag/proc/afterattack", function* afterattack(f: Frame, I: Value, user: Value, proximity: Value) {
	if (!proximity || this.loc == I) {
		return f.dot;
	}
	yield* this.evidencebagEquip(I, user);
	return f.dot;
}, true);

// evidence.dm:17
rt.def("/obj/item/weapon/evidencebag/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (!(yield* this.evidencebagEquip(I, user))) return f.dot;
	return 1;
}, true);

// evidence.dm:21
rt.def("/obj/item/weapon/evidencebag/proc/evidencebagEquip", function* evidencebagEquip(f: Frame, I: Value, user: Value) {
	let U: Value = null, in_evidence: Value = null;
	if (!rt.istype(I, T("/obj/item")) || I.anchored == 1) {
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/evidencebag"))) {
		to_chat(user, "<span class='notice'>You find putting an evidence bag in another evidence bag to be slightly absurd.</span>");
		return 1;
	}
	if (I.w_class > WEIGHT_CLASS_NORMAL) {
		to_chat(user, `<span class='notice'>${I} won't fit in ${this}.</span>`);
		return f.dot;
	}
	if (rt.len(f, this.contents)) {
		to_chat(user, `<span class='notice'>${this} already has something inside it.</span>`);
		return f.dot;
	}
	if (!isturf(I.loc)) {
		if (rt.istype(I.loc, T("/obj/item/weapon/storage"))) {
			yield* (U = I.loc).remove_from_storage(I, this);
		}
		if (user.is_holding(I)) {
			yield* user.dropItemToGround(I);
		} else {
			return f.dot;
		}
	}
	user.visible_message(`${user} puts ${I} into ${this}.`, `<span class='notice'>You put ${I} inside ${this}.</span>`, "<span class='italics'>You hear a rustle as someone puts something into a plastic bag.</span>");
	this.icon_state = "evidence";
	(in_evidence = (yield* new_(T("/mutable_appearance"), I))).plane = -32767;
	in_evidence.layer = -1;
	in_evidence.pixel_x = 0;
	in_evidence.pixel_y = 0;
	this.add_overlay(in_evidence);
	this.add_overlay("evidence");
	this.desc = `An evidence bag containing ${I}. ${I.desc}`;
	I.loc = this;
	this.w_class = I.w_class;
	return 1;
}, true);

// evidence.dm:64
rt.def("/obj/item/weapon/evidencebag/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let I: Value = null;
	if (rt.len(f, this.contents)) {
		I = rt.index(this.contents, 1);
		user.visible_message(`${user} takes ${I} out of ${this}.`, `<span class='notice'>You take ${I} out of ${this}.</span>`, "<span class='italics'>You hear someone rustle around in a plastic bag, and remove something.</span>");
		this.cut_overlays();
		yield* user.put_in_hands(I);
		this.w_class = WEIGHT_CLASS_TINY;
		this.icon_state = "evidenceobj";
		this.desc = "An empty evidence bag.";
	} else {
		to_chat(user, `${this} is empty.`);
		this.icon_state = "evidenceobj";
	}
	return f.dot;
}, true);

rt.type(5439, "/obj/item/weapon/storage/box/evidence", "/obj/item/weapon/storage/box", {
	name: "evidence bag box",
	desc: "A box claiming to contain evidence bags.",
});

// evidence.dm:84
rt.def("/obj/item/weapon/storage/box/evidence/proc/New", function* New(f: Frame) {
	yield* new_(T("/obj/item/weapon/evidencebag"), this);
	yield* new_(T("/obj/item/weapon/evidencebag"), this);
	yield* new_(T("/obj/item/weapon/evidencebag"), this);
	yield* new_(T("/obj/item/weapon/evidencebag"), this);
	yield* new_(T("/obj/item/weapon/evidencebag"), this);
	yield* new_(T("/obj/item/weapon/evidencebag"), this);
	yield* parent_proc();
	return f.dot;
}, true);
