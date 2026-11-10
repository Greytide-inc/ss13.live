// Based on /tg/station's code/modules/projectiles/box_magazine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9884, "/obj/item/ammo_box", "/obj/item", {
	stored_ammo: null,
	ammo_type: rt.typePath("/obj/item/ammo_casing"),
	max_ammo: 7,
	multiple_sprites: 0,
	caliber: null,
	multiload: 1,
	start_empty: 0,
	flags: 64,
	slot_flags: 512,
	item_state: "syringe_kit",
	materials: null,
	w_class: 1,
	throw_speed: 3,
	throw_range: 7,
	name: "ammo box (null_reference_exception)",
	desc: "A box of ammo.",
	icon_state: "357",
	icon: rt.rsc("icons/obj/ammo.dmi"),
	throwforce: 2,
});

// box_magazine.dm:10
rt.def("/obj/item/ammo_box/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 30000]);

	this.stored_ammo = list();
	return f.dot;
});

// box_magazine.dm:24
rt.def("/obj/item/ammo_box/proc/New", function* New(f: Frame) {
	let i: Value = null;
	yield* parent_proc();
	if (!this.start_empty) {
		i = 1;
		while (i <= this.max_ammo) {
			this.stored_ammo += (yield* new_(this.ammo_type, this));
			i++;
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// box_magazine.dm:31
rt.def("/obj/item/ammo_box/proc/get_round", function get_round(f: Frame, keep: Value) {
	let b: Value = null;
	keep ??= 0;
	if (!rt.len(f, this.stored_ammo)) {
		return null;
	}
	this.stored_ammo -= (b = rt.index(this.stored_ammo, rt.len(f, this.stored_ammo)));
	if (keep) {
		this.stored_ammo.Insert(1, b);
	}
	return b;
});

// box_magazine.dm:42
rt.def("/obj/item/ammo_box/proc/give_round", function* give_round(f: Frame, R: Value, replace_spent: Value) {
	let AC: Value = null;
	replace_spent ??= 0;
	if (!R || this.caliber && R.caliber != this.caliber || !this.caliber && R.type != this.ammo_type) {
		return 0;
	}
	if (rt.len(f, this.stored_ammo) < this.max_ammo) {
		this.stored_ammo += R;
		yield* R.forceMove(this);
		return 1;
	} else if (replace_spent) {
		for (AC of each(this.stored_ammo, T("/obj/item/ammo_casing"))) {
			if (!AC.BB) {
				this.stored_ammo -= AC;
				yield* AC.forceMove(rt.getStep(f, this.loc, 0));
				this.stored_ammo += R;
				yield* R.forceMove(this);
				return 1;
			}
		}
	}
	return 0;
}, true);

// box_magazine.dm:68
rt.def("/obj/item/ammo_box/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value, silent: Value, replace_spent: Value) {
	let AM: Value = null, AC: Value = null, did_load: Value = null, AC_1: Value = null;
	silent ??= 0;
	replace_spent ??= 0;
	let num_loaded: Value = 0;
	if (!this.can_load(user)) {
		return f.dot;
	}
	if (rt.istype(A, T("/obj/item/ammo_box"))) {
		AM = A;
		for (AC of each(AM.stored_ammo, T("/obj/item/ammo_casing"))) {
			if (did_load = (yield* this.give_round(AC, replace_spent))) {
				AM.stored_ammo -= AC;
				num_loaded++;
			}
			if (!did_load || !this.multiload) {
				break;
			}
		}
	}
	if (rt.istype(A, T("/obj/item/ammo_casing"))) {
		if (yield* this.give_round((AC_1 = A), replace_spent)) {
			yield* user.drop_item();
			yield* AC_1.forceMove(this);
			num_loaded++;
		}
	}
	if (num_loaded) {
		if (!silent) {
			to_chat(user, fmt("<span class='notice'>You load ＀ shell５ into ％！!</span>", [num_loaded, this]));
			playsound(user, rt.rsc("sound/weapons/bulletinsert.ogg"), 60, 1);
		}
		yield* A.update_icon();
		yield* this.update_icon();
	}
	return num_loaded;
}, true);

// box_magazine.dm:96
rt.def("/obj/item/ammo_box/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let A: Value = null;
	if (!(A = this.get_round())) return f.dot;
	yield* user.put_in_hands(A);
	to_chat(user, fmt("<span class='notice'>You remove a round from ％！!</span>", [this]));
	playsound(user, rt.rsc("sound/weapons/bulletremove.ogg"), 60, 1);
	yield* this.update_icon();
	return f.dot;
}, true);

// box_magazine.dm:104
rt.def("/obj/item/ammo_box/proc/update_icon", function update_icon(f: Frame) {
	if (this.multiple_sprites === 1) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-${rt.len(f, this.stored_ammo)}`;
	} else if (this.multiple_sprites === 2) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-${rt.len(f, this.stored_ammo) ? `${this.max_ammo}` : "0"}`;
	}
	this.desc = fmt("＀ There are ＀ shell５ left!", [rt.initial(f, this, "desc"), rt.len(f, this.stored_ammo)]);
	return f.dot;
});

rt.type(9885, "/obj/item/ammo_box/magazine", "/obj/item/ammo_box", {});

// box_magazine.dm:113
rt.def("/obj/item/ammo_box/magazine/proc/ammo_count", function ammo_count(f: Frame) {
	return rt.len(f, this.stored_ammo);
});

// box_magazine.dm:116
rt.def("/obj/item/ammo_box/magazine/proc/empty_magazine", function* empty_magazine(f: Frame) {
	let ammo: Value = null;
	let turf_mag: Value = rt.getStep(f, this, 0);
	for (ammo of each(this.stored_ammo, T("/obj/item"))) {
		yield* ammo.forceMove(turf_mag);
		this.stored_ammo -= ammo;
	}
	return f.dot;
}, true);
