// Based on /tg/station's code/modules/projectiles/guns/syringe_gun.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5281, "/obj/item/weapon/gun/syringe", "/obj/item/weapon/gun", {
	syringes: null,
	max_syringes: 1,
	throw_speed: 3,
	throw_range: 7,
	clumsy_check: 0,
	fire_sound: rt.rsc("sound/items/syringeproj.ogg"),
	name: "syringe gun",
	desc: "A spring loaded rifle designed to fit syringes, used to incapacitate unruly patients from a distance.",
	icon_state: "syringegun",
	item_state: "syringegun",
	w_class: 3,
	force: 4,
	materials: null,
	origin_tech: "combat=2;biotech=3",
});

// syringe_gun.dm:14
rt.def("/obj/item/weapon/gun/syringe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.syringes = list();
	this.materials = rt.alist(f, ["$metal", 2000]);
	return f.dot;
});

// syringe_gun.dm:18
rt.def("/obj/item/weapon/gun/syringe/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.chambered = (yield* new_(T("/obj/item/ammo_casing/syringegun"), this));
	return f.dot;
}, true);

// syringe_gun.dm:22
rt.def("/obj/item/weapon/gun/syringe/proc/recharge_newshot", function* recharge_newshot(f: Frame) {
	if (!rt.len(f, this.syringes)) {
		return f.dot;
	}
	yield* this.chambered.newshot();
	return f.dot;
}, true);

// syringe_gun.dm:27
rt.def("/obj/item/weapon/gun/syringe/proc/can_shoot", function can_shoot(f: Frame) {
	return rt.len(f, this.syringes);
});

// syringe_gun.dm:30
rt.def("/obj/item/weapon/gun/syringe/proc/process_chamber", function* process_chamber(f: Frame) {
	if (!(this.chambered && !this.chambered.BB)) return f.dot;
	yield* this.recharge_newshot();
	return f.dot;
}, true);

// syringe_gun.dm:34
rt.def("/obj/item/weapon/gun/syringe/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, fmt("Can hold ＀ syringe５. Has ＀ syringe５ remaining.", [this.max_syringes, rt.len(f, this.syringes)]));
	return f.dot;
}, false);

// syringe_gun.dm:38
rt.def("/obj/item/weapon/gun/syringe/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let S: Value = null;
	if (!rt.len(f, this.syringes)) {
		to_chat(user, `<span class='warning'>${this} is empty!</span>`);
		return 0;
	}
	if (!(S = rt.index(this.syringes, rt.len(f, this.syringes)))) {
		return 0;
	}
	S.loc = user.loc;
	this.syringes.Remove(S);
	to_chat(user, fmt("<span class='notice'>You unload ＀ from ％！.</span>", [S, this]));
	return 1;
});

// syringe_gun.dm:53
rt.def("/obj/item/weapon/gun/syringe/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value, show_msg: Value) {
	show_msg ??= 1;
	if (rt.istype(A, T("/obj/item/weapon/reagent_containers/syringe"))) {
		if (rt.len(f, this.syringes) < this.max_syringes) {
			if (!(yield* user.transferItemToLoc(A, this))) {
				return 0;
			}
			to_chat(user, fmt("<span class='notice'>You load ＀ into ％！.</span>", [A, this]));
			this.syringes += A;
			yield* this.recharge_newshot();
			return 1;
		} else {
			to_chat(user, `<span class='warning'>${this} cannot hold more syringes!</span>`);
		}
	}
	return 0;
}, true);

rt.type(5284, "/obj/item/weapon/gun/syringe/dna", "/obj/item/weapon/gun/syringe", {
	name: "modified syringe gun",
	desc: "A syringe gun that has been modified to fit DNA injectors instead of normal syringes.",
	origin_tech: "combat=2;syndicate=2;biotech=3",
});

// syringe_gun.dm:88
rt.def("/obj/item/weapon/gun/syringe/dna/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.chambered = (yield* new_(T("/obj/item/ammo_casing/dnainjector"), this));
	return f.dot;
}, true);

// syringe_gun.dm:92
rt.def("/obj/item/weapon/gun/syringe/dna/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value, show_msg: Value) {
	let D: Value = null;
	show_msg ??= 1;
	if (rt.istype(A, T("/obj/item/weapon/dnainjector"))) {
		if ((D = A).used) {
			to_chat(user, "<span class='warning'>This injector is used up!</span>");
			return f.dot;
		}
		if (rt.len(f, this.syringes) < this.max_syringes) {
			if (!(yield* user.transferItemToLoc(D, this))) {
				return 0;
			}
			to_chat(user, fmt("<span class='notice'>You load ％！ into ％！.</span>", [D, this]));
			this.syringes += D;
			yield* this.recharge_newshot();
			return 1;
		} else {
			to_chat(user, `<span class='warning'>${this} cannot hold more syringes!</span>`);
		}
	}
	return 0;
}, true);
