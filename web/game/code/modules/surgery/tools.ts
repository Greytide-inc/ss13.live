// Based on /tg/station's code/modules/surgery/tools.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6661, "/obj/item/weapon/retractor", "/obj/item/weapon", {
	flags: 64,
	name: "retractor",
	desc: "Retracts stuff.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "retractor",
	materials: null,
	w_class: 1,
	origin_tech: "materials=1;biotech=1",
});

// tools.dm:6
rt.def("/obj/item/weapon/retractor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 6000, "$glass", 3000]);
	return f.dot;
});

rt.type(6658, "/obj/item/weapon/hemostat", "/obj/item/weapon", {
	flags: 64,
	name: "hemostat",
	desc: "You think you have seen this before.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "hemostat",
	materials: null,
	w_class: 1,
	origin_tech: "materials=1;biotech=1",
	attack_verb: null,
});

// tools.dm:17
rt.def("/obj/item/weapon/hemostat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 5000, "$glass", 2500]);
	this.attack_verb = list("attacked", "pinched");
	return f.dot;
});

rt.type(6667, "/obj/item/weapon/cautery", "/obj/item/weapon", {
	flags: 64,
	name: "cautery",
	desc: "This stops bleeding.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "cautery",
	materials: null,
	w_class: 1,
	origin_tech: "materials=1;biotech=1",
	attack_verb: null,
});

// tools.dm:29
rt.def("/obj/item/weapon/cautery/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 2500, "$glass", 750]);

	this.attack_verb = list("burnt");
	return f.dot;
});

rt.type(6665, "/obj/item/weapon/surgicaldrill", "/obj/item/weapon", {
	flags: 64,
	name: "surgical drill",
	desc: "You can drill using this item. You dig?",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "drill",
	hitsound: rt.rsc("sound/weapons/circsawhit.ogg"),
	materials: null,
	force: 15,
	w_class: 3,
	origin_tech: "materials=1;biotech=1",
	attack_verb: null,
});

// tools.dm:42
rt.def("/obj/item/weapon/surgicaldrill/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 10000, "$glass", 6000]);

	this.attack_verb = list("drilled");
	return f.dot;
});

rt.type(6655, "/obj/item/weapon/scalpel", "/obj/item/weapon", {
	flags: 64,
	throw_speed: 3,
	throw_range: 5,
	name: "scalpel",
	desc: "Cut, cut, and once more cut.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "scalpel",
	force: 10,
	w_class: 1,
	throwforce: 5,
	materials: null,
	origin_tech: "materials=1;biotech=1",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 2,
});

// tools.dm:60
rt.def("/obj/item/weapon/scalpel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 4000, "$glass", 1000]);
	this.attack_verb = list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut");
	return f.dot;
});

// tools.dm:67
rt.def("/obj/item/weapon/scalpel/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is slitting ${user.p_their()} ${pick("wrists", "throat", "stomach")} with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 1;
});

rt.type(6663, "/obj/item/weapon/circular_saw", "/obj/item/weapon", {
	flags: 64,
	throw_speed: 2,
	throw_range: 5,
	name: "circular saw",
	desc: "For heavy duty cutting.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "saw",
	hitsound: rt.rsc("sound/weapons/circsawhit.ogg"),
	throwhitsound: rt.rsc("sound/weapons/pierce.ogg"),
	force: 15,
	w_class: 3,
	throwforce: 9,
	materials: null,
	origin_tech: "biotech=1;combat=1",
	attack_verb: null,
	sharpness: 1,
});

// tools.dm:84
rt.def("/obj/item/weapon/circular_saw/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 10000, "$glass", 6000]);
	this.attack_verb = list("attacked", "slashed", "sawed", "cut");
	return f.dot;
});

rt.type(7648, "/obj/item/weapon/surgical_drapes", "/obj/item/weapon", {
	name: "surgical drapes",
	desc: "Nanotrasen brand surgical drapes provide optimal safety and infection control.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "surgical_drapes",
	w_class: 1,
	origin_tech: "biotech=1",
	attack_verb: null,
});

// tools.dm:96
rt.def("/obj/item/weapon/surgical_drapes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("slapped");
	return f.dot;
});

// tools.dm:99
rt.def("/obj/item/weapon/surgical_drapes/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (yield* attempt_initiate_surgery(this, M, user)) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7649, "/obj/item/weapon/organ_storage", "/obj/item/weapon", {
	name: "organ storage bag",
	desc: "A container for holding body parts.",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "evidenceobj",
});

// tools.dm:109
rt.def("/obj/item/weapon/organ_storage/proc/afterattack", function afterattack(f: Frame, I: Value, user: Value, proximity: Value) {
	let img: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (rt.len(f, this.contents)) {
		to_chat(user, `<span class='notice'>${this} already has something inside it.</span>`);
		return f.dot;
	}
	if (!rt.istype(I, T("/obj/item/organ")) && !rt.istype(I, T("/obj/item/bodypart"))) {
		to_chat(user, `<span class='notice'>${this} can only hold body parts!</span>`);
		return f.dot;
	}
	user.visible_message(`${user} puts ${I} into ${this}.`, `<span class='notice'>You put ${I} inside ${this}.</span>`);
	this.icon_state = "evidence";
	let xx: Value = I.pixel_x;
	let yy: Value = I.pixel_y;
	I.pixel_x = 0;
	I.pixel_y = 0;
	(img = image({ icon: I, layer: -1 })).plane = -32767;
	I.pixel_x = xx;
	I.pixel_y = yy;
	this.add_overlay(img);
	this.add_overlay("evidence");
	this.desc = `An organ storage container holding ${I}.`;
	I.loc = this;
	this.w_class = I.w_class;
	return f.dot;
});

// tools.dm:135
rt.def("/obj/item/weapon/organ_storage/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let I: Value = null;
	if (rt.len(f, this.contents)) {
		I = rt.index(this.contents, 1);
		user.visible_message(`${user} dumps ${I} from ${this}.`, `<span class='notice'>You dump ${I} from ${this}.</span>`);
		this.cut_overlays();
		yield* I.forceMove(rt.getStep(f, this, 0));
		this.icon_state = "evidenceobj";
		this.desc = "A container for holding body parts.";
	} else {
		to_chat(user, `${this} is empty.`);
	}
	return f.dot;
}, true);
