// Based on /tg/station's code/game/objects/items/weapons/airlock_painter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7087, "/obj/item/weapon/airlock_painter", "/obj/item/weapon", {
	ink: null,
	flags: 68,
	name: "airlock painter",
	desc: "An advanced autopainter preprogrammed with several paintjobs for airlocks. Use it on an airlock during or after construction to change the paintjob.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "paint sprayer",
	item_state: "paint sprayer",
	w_class: 2,
	materials: null,
	origin_tech: "engineering=2",
	slot_flags: 512,
});

// airlock_painter.dm:10
rt.def("/obj/item/weapon/airlock_painter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 50, "$glass", 50]);
	return f.dot;
});

// airlock_painter.dm:19
rt.def("/obj/item/weapon/airlock_painter/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.ink = (yield* new_(T("/obj/item/device/toner"), this));
	return f.dot;
}, true);

// airlock_painter.dm:25
rt.def("/obj/item/weapon/airlock_painter/proc/use", function use(f: Frame, user: Value) {
	if (this.can_use(user)) {
		this.ink.charges--;
		playsound(this.loc, rt.rsc("sound/effects/spray2.ogg"), 50, 1);
		return 1;
	} else {
		return 0;
	}
});

// airlock_painter.dm:36
rt.def("/obj/item/weapon/airlock_painter/proc/can_use", function can_use(f: Frame, user: Value) {
	if (!this.ink) {
		to_chat(user, `<span class='notice'>There is no toner cartridge installed in ${this}!</span>`);
		return 0;
	} else if (this.ink.charges < 1) {
		to_chat(user, `<span class='notice'>${this} is out of ink!</span>`);
		return 0;
	} else {
		return 1;
	}
});

// airlock_painter.dm:46
rt.def("/obj/item/weapon/airlock_painter/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let _T: Value = null;
	let L: Value = user.getorganslot("lungs");
	if (this.can_use(user) && L) {
		user.visible_message(`<span class='suicide'>${user} is inhaling toner from ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
		yield* this.use(user);
		if (!rt.istype((_T = rt.getStep(f, rt.getStep(f, this, 0), user.dir)), T("/turf/open"))) {
			_T = rt.getStep(f, this, 0);
		}
		if (!L) {
			return 8;
		}
		yield* L.Remove(user);
		yield* L.create_reagents(10);
		yield* L.reagents.add_reagent("colorful_reagent", 10);
		yield* L.reagents.reaction(L, TOUCH, 1);
		user.visible_message(`<span class='suicide'>${user} vomits out their ${L}!</span>`);
		playsound(user.loc, rt.rsc("sound/effects/splat.ogg"), 50, 1);
		yield* L.forceMove(_T);
		return 12;
	} else if (this.can_use(user) && !L) {
		user.visible_message(`<span class='suicide'>${user} is spraying toner on ${user.p_them()}self from ${this}! It looks like ${user.p_theyre()} trying to commit suicide.</span>`);
		yield* user.reagents.add_reagent("colorful_reagent", TOUCH);
		yield* user.reagents.reaction(user, TOUCH, 1);
		return 4;
	} else {
		user.visible_message(`<span class='suicide'>${user} is trying to inhale toner from ${this}! It might be a suicide attempt if ${this} had any toner.</span>`);
		return 16;
	}
}, true);

// airlock_painter.dm:93
rt.def("/obj/item/weapon/airlock_painter/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.ink) {
		to_chat(user, "<span class='notice'>It doesn't have a toner cartridge installed.</span>");
		return f.dot;
	}
	let ink_level: Value = "high";
	if (this.ink.charges < 1) {
		ink_level = "empty";
	} else if (this.ink.charges / this.ink.max_charges <= 0.25) {
		ink_level = "low";
	} else if (this.ink.charges / this.ink.max_charges > 1) {
		ink_level = "dangerously high";
	}
	to_chat(user, `<span class='notice'>Its ink levels look ${ink_level}.</span>`);
	return f.dot;
}, false);

// airlock_painter.dm:108
rt.def("/obj/item/weapon/airlock_painter/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/device/toner"))) {
		if (this.ink) {
			to_chat(user, fmt("<span class='notice'>＀ already contains ＇！.</span>", [this, this.ink]));
			return f.dot;
		}
		if (!(yield* user.transferItemToLoc(W, this))) {
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You install ${W} into ${this}.</span>`);
		this.ink = W;
		playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// airlock_painter.dm:122
rt.def("/obj/item/weapon/airlock_painter/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.ink) return f.dot;
	playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
	this.ink.loc = user.loc;
	yield* user.put_in_hands(this.ink);
	to_chat(user, `<span class='notice'>You remove ${this.ink} from ${this}.</span>`);
	this.ink = null;
	return f.dot;
}, true);
