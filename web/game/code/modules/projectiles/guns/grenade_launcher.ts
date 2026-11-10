// Based on /tg/station's code/modules/projectiles/guns/grenade_launcher.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(5278, "/obj/item/weapon/gun/grenadelauncher", "/obj/item/weapon/gun", {
	max_grenades: 3,
	grenades: null,
	throw_speed: 2,
	throw_range: 7,
	name: "grenade launcher",
	desc: "a terrible, terrible thing. it's really awful!",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	icon_state: "riotgun",
	item_state: "riotgun",
	w_class: 4,
	force: 5,
	materials: null,
});

// grenade_launcher.dm:11
rt.def("/obj/item/weapon/gun/grenadelauncher/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.grenades = new_(T("/list"));
	this.materials = rt.alist(f, ["$metal", 2000]);
	return f.dot;
});

// grenade_launcher.dm:16
rt.def("/obj/item/weapon/gun/grenadelauncher/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `${rt.len(f, this.grenades)} / ${this.max_grenades} grenades loaded.`);
	return f.dot;
}, false);

// grenade_launcher.dm:21
rt.def("/obj/item/weapon/gun/grenadelauncher/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (!rt.istype(I, T("/obj/item/weapon/grenade"))) return f.dot;
	if (rt.len(f, this.grenades) < this.max_grenades) {
		if (!(yield* user.transferItemToLoc(I, this))) {
			return f.dot;
		}
		this.grenades += I;
		to_chat(user, "<span class='notice'>You put the grenade in the grenade launcher.</span>");
		to_chat(user, `<span class='notice'>${rt.len(f, this.grenades)} / ${this.max_grenades} Grenades.</span>`);
	} else {
		to_chat(f.usr, "<span class='danger'>The grenade launcher cannot hold more grenades.</span>");
	}
	return f.dot;
}, true);

// grenade_launcher.dm:32
rt.def("/obj/item/weapon/gun/grenadelauncher/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value) {
	if (target == user) {
		return f.dot;
	}
	if (rt.len(f, this.grenades)) {
		yield* this.fire_grenade(target, user);
	} else {
		to_chat(user, "<span class='danger'>The grenade launcher is empty.</span>");
	}
	return f.dot;
}, true);

// grenade_launcher.dm:41
rt.def("/obj/item/weapon/gun/grenadelauncher/proc/fire_grenade", function* fire_grenade(f: Frame, target: Value, user: Value) {
	let F: Value = null;
	user.visible_message(`<span class='danger'>${user} fired a grenade!</span>`, "<span class='danger'>You fire the grenade launcher!</span>");
	this.grenades -= (F = rt.index(this.grenades, 1));
	F.loc = user.loc;
	yield* F.throw_at(target, 30, 2, user);
	message_admins(`${key_name_admin(user)} fired a grenade (${F.name}) from a grenade launcher (${this.name}).`);
	log_game(`${key_name(user)} fired a grenade (${F.name}) from a grenade launcher (${this.name}).`);
	F.active = 1;
	F.icon_state = rt.initial(f, F, "icon_state") + "_active";
	playsound(user.loc, rt.rsc("sound/weapons/armbomb.ogg"), 75, 1, -3);
	yield* addtimer((yield* new_(T("/datum/callback"), F, P("/obj/item/weapon/grenade/proc/prime"))), 15);
	return f.dot;
}, true);
