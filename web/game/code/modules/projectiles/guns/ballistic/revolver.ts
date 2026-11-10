// Based on /tg/station's code/modules/projectiles/guns/ballistic/revolver.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5264, "/obj/item/weapon/gun/ballistic/revolver", "/obj/item/weapon/gun/ballistic", {
	casing_ejector: 0,
	name: "１.357 revolver",
	desc: "A suspicious revolver. Uses .357 ammo.",
	icon_state: "revolver",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/cylinder"),
	origin_tech: "combat=3;materials=2",
});

// revolver.dm:10
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (rt.istype(this.magazine, T("/obj/item/ammo_box/magazine/internal/cylinder"))) return f.dot;
	this.verbs -= P("/obj/item/weapon/gun/ballistic/revolver/verb/spin");
	return f.dot;
}, true);

// revolver.dm:16
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/chamber_round", function chamber_round(f: Frame, spin: Value) {
	spin ??= 1;
	if (spin) {
		this.chambered = this.magazine.get_round(1);
	} else {
		this.chambered = rt.index(this.magazine.stored_ammo, 1);
	}
	return f.dot;
});

// revolver.dm:21
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/shoot_with_empty_chamber", function shoot_with_empty_chamber(f: Frame, user: Value) {
	parent_proc();
	this.chamber_round(1);
	return f.dot;
}, false);

// revolver.dm:25
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	let num_loaded: Value = null;
	f.dot = (yield* parent_proc());
	if (f.dot) {
		return f.dot;
	}
	if (!(num_loaded = (yield* this.magazine.attackby(A, user, params, 1)))) return f.dot;
	to_chat(user, fmt("<span class='notice'>You load ＀ shell５ into ％！.</span>", [num_loaded, this]));
	playsound(user, rt.rsc("sound/weapons/bulletinsert.ogg"), 60, 1);
	yield* A.update_icon();
	yield* this.update_icon();
	yield* this.chamber_round(0);
	return f.dot;
}, true);

// revolver.dm:39
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let CB: Value = null;
	let num_unloaded: Value = 0;
	this.chambered = null;
	while (this.get_ammo() > 0) {
		CB = null;
		if (CB = this.magazine.get_round(0)) {
			CB.loc = rt.getStep(f, this.loc, 0);
			CB.SpinAnimation(10, 1);
			CB.update_icon();
			num_unloaded++;
		}
	}
	if (num_unloaded) {
		to_chat(user, fmt("<span class='notice'>You unload ＀ shell５ from ＀.</span>", [num_unloaded, this]));
		playsound(user, rt.rsc("sound/weapons/bulletremove.ogg"), 60, 1);
	} else {
		to_chat(user, `<span class='warning'>${this} is empty!</span>`);
	}
	return f.dot;
});

// revolver.dm:58
rt.def("/obj/item/weapon/gun/ballistic/revolver/verb/spin", function spin(f: Frame) {
	let M: Value = null;
	if ((M = f.usr).stat || !(get_dist(M, this) <= 1)) {
		return f.dot;
	}
	if (this.do_spin()) {
		f.usr.visible_message(`${f.usr} spins ${this}'s chamber.`, `<span class='notice'>You spin ${this}'s chamber.</span>`);
	} else {
		this.verbs -= P("/obj/item/weapon/gun/ballistic/revolver/verb/spin");
	}
	return f.dot;
}, false, { verb: { name: "Spin Chamber", category: "Object", desc: "Click to spin your revolver's chamber." } });

// revolver.dm:69
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/do_spin", function do_spin(f: Frame) {
	let C: Value = null;
	f.dot = (rt.istype((C = this.magazine), T("/obj/item/ammo_box/magazine/internal/cylinder")) ? 1 : 0);
	if (!f.dot) return f.dot;
	C.spin();
	this.chamber_round(0);
	return f.dot;
});

// revolver.dm:76
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/can_shoot", function can_shoot(f: Frame) {
	return this.get_ammo(0, 0);
});

// revolver.dm:80
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/get_ammo", function get_ammo(f: Frame, countchambered: Value, countempties: Value) {
	countchambered ??= 0;
	countempties ??= 1;
	let boolets: Value = 0;
	if (this.chambered && countchambered) {
		boolets++;
	}
	if (this.magazine) {
		boolets += this.magazine.ammo_count(countempties);
	}
	return boolets;
});

// revolver.dm:87
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `${this.get_ammo(0, 0)} of those are live rounds.`);
	return f.dot;
}, false);

rt.type(5268, "/obj/item/weapon/gun/ballistic/revolver/detective", "/obj/item/weapon/gun/ballistic/revolver", {
	name: "１.38 Mars Special",
	desc: "A cheap Martian knock-off of a classic law enforcement firearm. Uses .38-special rounds.",
	icon_state: "detective",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/cylinder/rev38"),
	unique_rename: 1,
	unique_reskin: null,
});

// revolver.dm:96
rt.def("/obj/item/weapon/gun/ballistic/revolver/detective/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.unique_reskin = rt.alist(f, ["Default", "detective", "Leopard Spots", "detective_leopard", "Black Panther", "detective_panther", "Gold Trim", "detective_gold", "The Peacemaker", "detective_peacemaker"]);
	return f.dot;
});

// revolver.dm:104
rt.def("/obj/item/weapon/gun/ballistic/revolver/detective/proc/process_fire", function* process_fire(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (f.args[4] === null) {
		f.args[4] = "";
	}
	if (this.magazine.caliber != rt.initial(f, this.magazine, "caliber")) {
		if (prob(70 - this.magazine.ammo_count() * 10)) {
			playsound(f.args[1], this.fire_sound, 50, 1);
			to_chat(f.args[1], `<span class='userdanger'>${this} blows up in your face!</span>`);
			yield* f.args[1].take_bodypart_damage(0, 20);
			yield* f.args[1].dropItemToGround(this);
			return 0;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["target", "user", "message", "params", "zone_override"] });

// revolver.dm:114
rt.def("/obj/item/weapon/gun/ballistic/revolver/detective/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	yield* parent_proc();
	if (!rt.istype(A, T("/obj/item/weapon/screwdriver"))) return f.dot;
	if (this.magazine.caliber == "38") {
		to_chat(user, `<span class='notice'>You begin to reinforce the barrel of ${this}...</span>`);
		if (this.magazine.ammo_count()) {
			yield* this.afterattack(user, user);
			user.visible_message(`<span class='danger'>${this} goes off!</span>`, `<span class='userdanger'>${this} goes off in your face!</span>`);
			return f.dot;
		}
		if (yield* do_after(user, 30 * A.toolspeed, { target: this })) {
			if (this.magazine.ammo_count()) {
				to_chat(user, "<span class='warning'>You can't modify it!</span>");
				return f.dot;
			}
			this.magazine.caliber = "357";
			this.desc = "The barrel and chamber assembly seems to have been modified.";
			to_chat(user, `<span class='notice'>You reinforce the barrel of ${this}. Now it will fire .357 rounds.</span>`);
		}
	} else {
		to_chat(user, `<span class='notice'>You begin to revert the modifications to ${this}...</span>`);
		if (this.magazine.ammo_count()) {
			yield* this.afterattack(user, user);
			user.visible_message(`<span class='danger'>${this} goes off!</span>`, `<span class='userdanger'>${this} goes off in your face!</span>`);
			return f.dot;
		}
		if (!(yield* do_after(user, 30 * A.toolspeed, { target: this }))) return f.dot;
		if (this.magazine.ammo_count()) {
			to_chat(user, "<span class='warning'>You can't modify it!</span>");
			return f.dot;
		}
		this.magazine.caliber = "38";
		this.desc = rt.initial(f, this, "desc");
		to_chat(user, `<span class='notice'>You remove the modifications on ${this}. Now it will fire .38 rounds.</span>`);
	}
	return f.dot;
}, true);

rt.type(5272, "/obj/item/weapon/gun/ballistic/revolver/russian", "/obj/item/weapon/gun/ballistic/revolver", {
	spun: 0,
	name: "１russian revolver",
	desc: "A Russian-made revolver for drinking games. Uses .357 ammo, and has a mechanism requiring you to spin the chamber before each trigger pull.",
	origin_tech: "combat=2;materials=2",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/cylinder/rus357"),
});

// revolver.dm:177
rt.def("/obj/item/weapon/gun/ballistic/revolver/russian/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.do_spin();
	this.spun = 1;
	yield* this.update_icon();
	return f.dot;
}, true);

// revolver.dm:183
rt.def("/obj/item/weapon/gun/ballistic/revolver/russian/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	yield* parent_proc();
	if (this.get_ammo() > 0) {
		yield* this.spin();
		this.spun = 1;
	}
	yield* this.update_icon();
	yield* A.update_icon();
	return f.dot;
}, true);

// revolver.dm:192
rt.def("/obj/item/weapon/gun/ballistic/revolver/russian/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!this.spun && this.can_shoot()) {
		this.spin();
		this.spun = 1;
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false);

// revolver.dm:200
rt.def("/obj/item/weapon/gun/ballistic/revolver/russian/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	let AC: Value = null, zone: Value = null, affecting: Value = null;
	if (flag) {
		if (!rt.isIn(f, target, user.contents) && ismob(target)) {
			if (user.a_intent == "harm") {
				return f.dot;
			}
		}
	}
	if (rt.istype(user, T("/mob/living"))) {
		if (!(yield* this.can_trigger_gun(user))) {
			return f.dot;
		}
	}
	if (target != user) {
		if (ismob(target)) {
			to_chat(user, "<span class='warning'>A mechanism prevents you from shooting anyone but yourself!</span>");
		}
		return f.dot;
	}
	if (!rt.istype(user, T("/mob/living/carbon/human"))) return f.dot;
	let H: Value = user;
	if (!this.spun) {
		to_chat(user, "<span class='warning'>You need to spin the revolver's chamber first!</span>");
		return f.dot;
	}
	this.spun = 0;
	if (this.chambered) {
		if (yield* (AC = this.chambered).fire_casing(user, user)) {
			playsound(user, this.fire_sound, 50, 1);
			zone = check_zone(user.zone_selected);
			affecting = H.get_bodypart(zone);
			if (zone == "head" || zone == "eyes" || zone == "mouth") {
				yield* this.shoot_self(user, affecting);
			} else {
				user.visible_message(`<span class='danger'>${user.name} cowardly fires ${this} at ${user.p_their()} ${affecting.name}!</span>`, `<span class='userdanger'>You cowardly fire ${this} at your ${affecting.name}!</span>`, "<span class='italics'>You hear a gunshot!</span>");
			}
			this.chambered = null;
			return f.dot;
		}
	}
	user.visible_message("<span class='danger'>*click*</span>");
	playsound(user, rt.rsc("sound/weapons/empty.ogg"), 100, 1);
	return f.dot;
}, true);

// revolver.dm:237
rt.def("/obj/item/weapon/gun/ballistic/revolver/russian/proc/shoot_self", function* shoot_self(f: Frame, user: Value, affecting: Value) {
	affecting ??= "head";
	yield* user.apply_damage(300, "brute", affecting);
	user.visible_message(`<span class='danger'>${user.name} fires ${this} at ${user.p_their()} head!</span>`, `<span class='userdanger'>You fire ${this} at your head!</span>`, "<span class='italics'>You hear a gunshot!</span>");
	return f.dot;
}, true);

rt.type(5273, "/obj/item/weapon/gun/ballistic/revolver/russian/soul", "/obj/item/weapon/gun/ballistic/revolver/russian", {
	name: "cursed russian revolver",
	desc: "To play with this revolver requires wagering your very soul.",
});

// revolver.dm:245
rt.def("/obj/item/weapon/gun/ballistic/revolver/russian/soul/proc/shoot_self", function* shoot_self(f: Frame, user: Value) {
	let SS: Value = null;
	yield* parent_proc();
	if (!(yield* (SS = (yield* new_(T("/obj/item/device/soulstone/anybody"), rt.getStep(f, this, 0)))).transfer_soul("FORCE", user))) {
		yield* qdel(SS);
		return f.dot;
	}
	user.visible_message(fmt("<span class='danger'>＀'s soul is captured by ％！!</span>", [user.name, this]), "<span class='userdanger'>You've lost the gamble! Your soul is forfiet!</span>");
	return f.dot;
}, true);

rt.type(5274, "/obj/item/weapon/gun/ballistic/revolver/doublebarrel", "/obj/item/weapon/gun/ballistic/revolver", {
	flags: 64,
	name: "double-barreled shotgun",
	desc: "A true classic.",
	icon_state: "dshotgun",
	item_state: "shotgun",
	w_class: 4,
	weapon_weight: 2,
	force: 10,
	slot_flags: 1024,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/dual"),
	sawn_desc: "Omar's coming!",
	unique_rename: 1,
	unique_reskin: null,
});

// revolver.dm:269
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.unique_reskin = rt.alist(f, ["Default", "dshotgun", "Dark Red Finish", "dshotgun-d", "Ash", "dshotgun-f", "Faded Grey", "dshotgun-g", "Maple", "dshotgun-1", "Rosewood", "dshotgun-p"]);
	return f.dot;
});

// revolver.dm:278
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	let W: Value = null;
	yield* parent_proc();
	if (rt.istype(A, T("/obj/item/ammo_box")) || rt.istype(A, T("/obj/item/ammo_casing"))) {
		yield* this.chamber_round();
	}
	if (rt.istype(A, T("/obj/item/weapon/melee/energy"))) {
		if ((W = A).active) {
			yield* this.sawoff(user);
		}
	}
	if (!(rt.istype(A, T("/obj/item/weapon/circular_saw")) || rt.istype(A, T("/obj/item/weapon/gun/energy/plasmacutter")))) return f.dot;
	yield* this.sawoff(user);
	return f.dot;
}, true);

// revolver.dm:290
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let CB: Value = null;
	let num_unloaded: Value = 0;
	while (this.get_ammo() > 0) {
		CB = this.magazine.get_round(0);
		this.chambered = null;
		CB.loc = rt.getStep(f, this.loc, 0);
		CB.update_icon();
		num_unloaded++;
	}
	if (num_unloaded) {
		to_chat(user, fmt("<span class='notice'>You break open ％！ and unload ＀ shell５.</span>", [this, num_unloaded]));
	} else {
		to_chat(user, `<span class='warning'>${this} is empty!</span>`);
	}
	return f.dot;
});

rt.type(5275, "/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised", "/obj/item/weapon/gun/ballistic/revolver/doublebarrel", {
	slung: 0,
	name: "improvised shotgun",
	desc: "Essentially a tube that aims shotgun shells.",
	icon_state: "ishotgun",
	item_state: "shotgun",
	w_class: 4,
	force: 10,
	slot_flags: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/improvised"),
	sawn_desc: "I'm just here for the gasoline.",
	unique_rename: 0,
	unique_reskin: null,
});

// revolver.dm:315
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.unique_reskin = null;
	return f.dot;
});

// revolver.dm:319
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	let C: Value = null;
	yield* parent_proc();
	if (!(rt.istype(A, T("/obj/item/stack/cable_coil")) && !this.sawn_state)) return f.dot;
	if (yield* (C = A).use(10)) {
		this.slot_flags = SLOT_BACK;
		to_chat(user, "<span class='notice'>You tie the lengths of cable to the shotgun, making a sling.</span>");
		this.slung = 1;
		yield* this.update_icon();
	} else {
		to_chat(user, "<span class='warning'>You need at least ten lengths of cable if you want to make a sling!</span>");
	}
	return f.dot;
}, true);

// revolver.dm:331
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (!this.slung) return f.dot;
	this.icon_state += "sling";
	return f.dot;
});

// revolver.dm:336
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/proc/sawoff", function* sawoff(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (!(f.dot && this.slung)) return f.dot;
	yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, this, 0), 10);
	this.slung = 0;
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(5277, "/obj/item/weapon/gun/ballistic/revolver/reverse", "/obj/item/weapon/gun/ballistic/revolver", {
	clumsy_check: 0,
});

// revolver.dm:356
rt.def("/obj/item/weapon/gun/ballistic/revolver/reverse/proc/can_trigger_gun", function* can_trigger_gun(f: Frame, user: Value) {
	if (rt.bitAnd(user.disabilities, 256) || user.mind && user.mind.assigned_role == "Clown") {
		return (yield* parent_proc());
	}
	if (!(yield* this.process_fire(user, user, 0, { zone_override: "head" }))) return f.dot;
	user.visible_message(`<span class='warning'>${user} somehow manages to shoot ${user.p_them()}self in the face!</span>`, "<span class='userdanger'>You somehow shoot yourself in the face! How the hell?!</span>");
	yield* user.emote("scream");
	yield* user.drop_item();
	yield* user.Knockdown(80);
	return f.dot;
}, true);
