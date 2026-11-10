// Based on /tg/station's code/modules/projectiles/guns/ballistic/shotgun.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5248, "/obj/item/weapon/gun/ballistic/shotgun", "/obj/item/weapon/gun/ballistic", {
	recentpump: 0,
	flags: 64,
	name: "shotgun",
	desc: "A traditional shotgun with wood furniture and a four-shell capacity underneath.",
	icon_state: "shotgun",
	item_state: "shotgun",
	w_class: 4,
	force: 10,
	slot_flags: 1024,
	origin_tech: "combat=4;materials=2",
	casing_ejector: 0,
	weapon_weight: 2,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot"),
});

// shotgun.dm:17
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	let num_loaded: Value = null;
	f.dot = (yield* parent_proc());
	if (f.dot) {
		return f.dot;
	}
	if (!(num_loaded = (yield* this.magazine.attackby(A, user, params, 1)))) return f.dot;
	to_chat(user, fmt("<span class='notice'>You load ＀ shell５ into ％！!</span>", [num_loaded, this]));
	playsound(user, rt.rsc("sound/weapons/shotguninsert.ogg"), 60, 1);
	yield* A.update_icon();
	yield* this.update_icon();
	return f.dot;
}, true);

// shotgun.dm:28
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/process_chamber", function* process_chamber(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	return (yield* parent_proc());
}, true, { args: ["empty_chamber"] });

// shotgun.dm:34
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/can_shoot", function can_shoot(f: Frame) {
	if (!this.chambered) {
		return 0;
	}
	return this.chambered.BB ? 1 : 0;
});

// shotgun.dm:39
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (this.recentpump > rt.worldTime(f)) {
		return f.dot;
	}
	this.pump(user);
	this.recentpump = rt.worldTime(f) + 10;
	return f.dot;
});

// shotgun.dm:47
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/blow_up", function* blow_up(f: Frame, user: Value) {
	f.dot = 0;
	if (!(this.chambered && this.chambered.BB)) return f.dot;
	yield* this.process_fire(user, user, 0);
	f.dot = 1;
	return f.dot;
}, true);

// shotgun.dm:52
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/pump", function pump(f: Frame, M: Value) {
	playsound(M, rt.rsc("sound/weapons/shotgunpump.ogg"), 60, 1);
	this.pump_unload(M);
	this.pump_reload(M);
	this.update_icon();
	return 1;
});

// shotgun.dm:60
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/pump_unload", function pump_unload(f: Frame, M: Value) {
	if (!this.chambered) return f.dot;
	this.chambered.loc = rt.getStep(f, this, 0);
	this.chambered.SpinAnimation(5, 1);
	this.chambered = null;
	return f.dot;
});

// shotgun.dm:65
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/pump_reload", function pump_reload(f: Frame, M: Value) {
	let AC: Value = null;
	if (!this.magazine.ammo_count()) {
		return 0;
	}
	this.chambered = (AC = this.magazine.get_round());
	return f.dot;
});

// shotgun.dm:72
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.chambered) return f.dot;
	let $0: any = user;
	to_chat($0, `A ${this.chambered.BB ? "live" : "spent"} one is in the chamber.`);
	return f.dot;
}, false);

rt.type(5251, "/obj/item/weapon/gun/ballistic/shotgun/riot", "/obj/item/weapon/gun/ballistic/shotgun", {
	name: "riot shotgun",
	desc: "A sturdy shotgun with a longer magazine and a fixed tactical stock designed for non-lethal riot control.",
	icon_state: "riotshotgun",
	sawn_desc: "Come with me if you want to live.",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/riot"),
});

// shotgun.dm:89
rt.def("/obj/item/weapon/gun/ballistic/shotgun/riot/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	let W: Value = null;
	yield* parent_proc();
	if (rt.istype(A, T("/obj/item/weapon/circular_saw")) || rt.istype(A, T("/obj/item/weapon/gun/energy/plasmacutter"))) {
		yield* this.sawoff(user);
	}
	if (!rt.istype(A, T("/obj/item/weapon/melee/energy"))) return f.dot;
	if (!(W = A).active) return f.dot;
	yield* this.sawoff(user);
	return f.dot;
}, true);

rt.type(5252, "/obj/item/weapon/gun/ballistic/shotgun/boltaction", "/obj/item/weapon/gun/ballistic/shotgun", {
	bolt_open: 0,
	name: "１Mosin Nagant",
	desc: "This piece of junk looks like something that could have been used 700 years ago. It feels slightly moist.",
	icon_state: "moistnugget",
	item_state: "moistnugget",
	slot_flags: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/boltaction"),
});

// shotgun.dm:111
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/proc/pump", function pump(f: Frame, M: Value) {
	playsound(M, rt.rsc("sound/weapons/shotgunpump.ogg"), 60, 1);
	if (this.bolt_open) {
		this.pump_reload(M);
	} else {
		this.pump_unload(M);
	}
	this.bolt_open = (!this.bolt_open ? 1 : 0);
	this.update_icon();
	return 1;
});

// shotgun.dm:121
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	if (!this.bolt_open) {
		to_chat(user, "<span class='notice'>The bolt is closed!</span>");
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// shotgun.dm:127
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `The bolt is ${this.bolt_open ? "open" : "closed"}.`);
	return f.dot;
}, false);

rt.type(5253, "/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted", "/obj/item/weapon/gun/ballistic/shotgun/boltaction", {
	guns_left: 30,
	gun_type: null,
	name: "enchanted bolt action rifle",
	desc: "Careful not to lose your head.",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/boltaction/enchanted"),
});

// shotgun.dm:151
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.bolt_open = 1;
	this.pump();
	this.gun_type = this.type;
	return f.dot;
}, true);

// shotgun.dm:157
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/dropped", function* dropped(f: Frame) {
	yield* parent_proc();
	this.guns_left = 0;
	return f.dot;
}, true);

// shotgun.dm:161
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/discard_gun", function* discard_gun(f: Frame, user: Value) {
	yield* this.throw_at(pick(oview(7, rt.getStep(f, user, 0))), 1, 1);
	user.visible_message(`<span class='warning'>${user} tosses aside the spent rifle!</span>`);
	return f.dot;
}, true);

// shotgun.dm:171
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/shoot_live_shot", function* shoot_live_shot(f: Frame) {
	let GUN: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = null;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	yield* parent_proc();
	if (this.guns_left) {
		(GUN = (yield* new_(this.gun_type))).guns_left = this.guns_left - 1;
		yield* f.args[0].drop_item();
		f.args[0].swap_hand();
		yield* f.args[0].put_in_hands(GUN);
	} else {
		yield* f.args[0].drop_item();
	}
	yield* this.discard_gun(f.args[0]);
	return f.dot;
}, true, { args: ["user", "pointblank", "pbtarget", "message"] });

rt.type(5255, "/obj/item/weapon/gun/ballistic/shotgun/automatic", "/obj/item/weapon/gun/ballistic/shotgun", {});

// shotgun.dm:185
rt.def("/obj/item/weapon/gun/ballistic/shotgun/automatic/proc/shoot_live_shot", function shoot_live_shot(f: Frame, user: Value) {
	parent_proc();
	this.pump(user);
	return f.dot;
}, false);

rt.type(5258, "/obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube", "/obj/item/weapon/gun/ballistic/shotgun/automatic", {
	toggled: 0,
	alternate_magazine: null,
	name: "cycler shotgun",
	desc: "An advanced shotgun with two separate magazine tubes, allowing you to quickly toggle between ammo types.",
	icon_state: "cycler",
	origin_tech: "combat=4;materials=2",
	w_class: 5,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/tube"),
});

// shotgun.dm:217
rt.def("/obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.alternate_magazine) return f.dot;
	this.alternate_magazine = (yield* new_(this.mag_type, this));
	return f.dot;
}, true);

// shotgun.dm:222
rt.def("/obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!this.chambered && rt.len(f, this.magazine.contents)) {
		this.pump();
	} else {
		this.toggle_tube(user);
	}
	return f.dot;
});

// shotgun.dm:228
rt.def("/obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube/proc/toggle_tube", function toggle_tube(f: Frame, user: Value) {
	let alt_mag: Value = null;
	let current_mag: Value = this.magazine;
	this.magazine = (alt_mag = this.alternate_magazine);
	this.alternate_magazine = current_mag;
	this.toggled = (!this.toggled ? 1 : 0);
	if (this.toggled) {
		to_chat(user, "You switch to tube B.");
	} else {
		to_chat(user, "You switch to tube A.");
	}
	return f.dot;
});

// shotgun.dm:239
rt.def("/obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube/proc/AltClick", function AltClick(f: Frame, user: Value) {
	if (user.incapacitated() || !this.Adjacent(user) || !rt.istype(user, T("/mob/living"))) {
		return f.dot;
	}
	this.pump();
	return f.dot;
});
