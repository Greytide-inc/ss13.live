// Based on /tg/station's code/modules/projectiles/ammunition/caseless.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8669, "/obj/item/ammo_casing/caseless", "/obj/item/ammo_casing", {
	desc: "A caseless bullet casing.",
	firing_effect_type: null,
});

// caseless.dm:9
rt.def("/obj/item/ammo_casing/caseless/proc/fire_casing", function* fire_casing(f: Frame, target: Value, user: Value, params: Value, distro: Value, quiet: Value, zone_override: Value, spread: Value) {
	if (yield* parent_proc()) {
		this.loc = null;
		return 1;
	} else {
		return 0;
	}
}, true);

// caseless.dm:16
rt.def("/obj/item/ammo_casing/caseless/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `${rt.initial(f, this, "icon_state")}`;
	return f.dot;
});

rt.type(8680, "/obj/item/ammo_casing/caseless/foam_dart", "/obj/item/ammo_casing/caseless", {
	modified: 0,
	name: "foam dart",
	desc: "It's nerf or nothing! Ages 8 and up.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/reusable/foam_dart"),
	caliber: "foam_force",
	icon: rt.rsc("icons/obj/guns/toy.dmi"),
	icon_state: "foamdart",
});

// caseless.dm:66
rt.def("/obj/item/ammo_casing/caseless/foam_dart/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (this.modified) {
		this.icon_state = "foamdart_empty";
		this.desc = "It's nerf or nothing! ... Although, this one doesn't look too safe.";
		if (this.BB) {
			this.BB.icon_state = "foamdart_empty";
		}
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
		this.desc = "It's nerf or nothing! Ages 8 and up.";
		if (!this.BB) return f.dot;
		this.BB.icon_state = rt.initial(f, this.BB, "icon_state");
	}
	return f.dot;
});

// caseless.dm:80
rt.def("/obj/item/ammo_casing/caseless/foam_dart/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	let FD: Value = this.BB;
	if (rt.istype(A, T("/obj/item/weapon/screwdriver")) && !this.modified) {
		this.modified = 1;
		FD.modified = 1;
		FD.damage_type = "brute";
		to_chat(user, `<span class='notice'>You pop the safety cap off ${this}.</span>`);
		yield* this.update_icon();
	} else if (rt.istype(A, T("/obj/item/weapon/pen"))) {
		if (this.modified) {
			if (!FD.pen) {
				if (!(yield* user.transferItemToLoc(A, FD))) {
					return f.dot;
				}
				FD.pen = A;
				FD.damage = 5;
				FD.nodamage = 0;
				to_chat(user, `<span class='notice'>You insert ${A} into ${this}.</span>`);
			} else {
				to_chat(user, `<span class='warning'>There's already something in ${this}.</span>`);
			}
		} else {
			to_chat(user, `<span class='warning'>The safety cap prevents you from inserting ${A} into ${this}.</span>`);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// caseless.dm:104
rt.def("/obj/item/ammo_casing/caseless/foam_dart/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let FD: Value = null;
	if (!(FD = this.BB).pen) return f.dot;
	FD.damage = rt.initial(f, FD, "damage");
	FD.nodamage = rt.initial(f, FD, "nodamage");
	yield* user.put_in_hands(FD.pen);
	to_chat(user, `<span class='notice'>You remove ${FD.pen} from ${this}.</span>`);
	FD.pen = null;
	return f.dot;
}, true);
