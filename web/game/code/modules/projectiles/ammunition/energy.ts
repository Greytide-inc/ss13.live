// Based on /tg/station's code/modules/projectiles/ammunition/energy.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(8685, "/obj/item/ammo_casing/energy/chameleon", "/obj/item/ammo_casing/energy", {
	projectile_vars: null,
	e_cost: 0,
	projectile_type: rt.typePath("/obj/item/projectile/energy/chameleon"),
});

// energy.dm:14
rt.def("/obj/item/ammo_casing/energy/chameleon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.projectile_vars = list();
	return f.dot;
});

// energy.dm:17
rt.def("/obj/item/ammo_casing/energy/chameleon/proc/ready_proj", function* ready_proj(f: Frame) {
	let V: Value = null;
	f.dot = (yield* parent_proc());
	if (!this.BB) {
		yield* this.newshot();
	}
	for (V of each(this.projectile_vars)) {
		if (rt.index(this.BB.vars, V)) {
			rt.setAt(this.BB.vars, V, rt.index(this.projectile_vars, V));
		}
	}
	return f.dot;
}, true);

rt.type(8727, "/obj/item/ammo_casing/energy/gravityrepulse", "/obj/item/ammo_casing/energy", {
	gun: null,
	e_cost: 0,
	select_name: "repulse",
	projectile_type: rt.typePath("/obj/item/projectile/gravityrepulse"),
	fire_sound: rt.rsc("sound/weapons/wave.ogg"),
	delay: 50,
});

// energy.dm:217
rt.def("/obj/item/ammo_casing/energy/gravityrepulse/proc/New", function New(f: Frame, G: Value) {
	this.gun = G;
	return f.dot;
});

rt.type(8728, "/obj/item/ammo_casing/energy/gravityattract", "/obj/item/ammo_casing/energy", {
	gun: null,
	e_cost: 0,
	select_name: "attract",
	projectile_type: rt.typePath("/obj/item/projectile/gravityattract"),
	fire_sound: rt.rsc("sound/weapons/wave.ogg"),
	delay: 50,
});

// energy.dm:229
rt.def("/obj/item/ammo_casing/energy/gravityattract/proc/New", function New(f: Frame, G: Value) {
	this.gun = G;
	return f.dot;
});

rt.type(8729, "/obj/item/ammo_casing/energy/gravitychaos", "/obj/item/ammo_casing/energy", {
	gun: null,
	e_cost: 0,
	select_name: "chaos",
	projectile_type: rt.typePath("/obj/item/projectile/gravitychaos"),
	fire_sound: rt.rsc("sound/weapons/wave.ogg"),
	delay: 50,
});

// energy.dm:240
rt.def("/obj/item/ammo_casing/energy/gravitychaos/proc/New", function New(f: Frame, G: Value) {
	this.gun = G;
	return f.dot;
});
