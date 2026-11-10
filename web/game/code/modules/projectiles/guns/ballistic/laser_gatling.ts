// Based on /tg/station's code/modules/projectiles/guns/ballistic/laser_gatling.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7645, "/obj/item/weapon/minigunpack", "/obj/item/weapon", {
	gun: null,
	armed: 0,
	overheat: 0,
	overheat_max: 40,
	heat_diffusion: 1,
	name: "backpack power source",
	desc: "The massive external power source for the laser gatling gun",
	icon: rt.rsc("icons/obj/guns/minigun.dmi"),
	icon_state: "holstered",
	item_state: "backpack",
	slot_flags: 1024,
	w_class: 5,
});

// laser_gatling.dm:19
rt.def("/obj/item/weapon/minigunpack/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.gun = (yield* new_(T("/obj/item/weapon/gun/ballistic/minigun"), this));
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// laser_gatling.dm:24
rt.def("/obj/item/weapon/minigunpack/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// laser_gatling.dm:28
rt.def("/obj/item/weapon/minigunpack/proc/process", function process(f: Frame) {
	this.overheat = max(0, this.overheat - this.heat_diffusion);
	return f.dot;
}, false, { waitfor: false });

// laser_gatling.dm:31
rt.def("/obj/item/weapon/minigunpack/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user) {
		if (!this.armed) {
			if (user.get_item_by_slot(slot_back) == this) {
				this.armed = 1;
				if (!(yield* user.put_in_hands(this.gun))) {
					this.armed = 0;
					to_chat(user, "<span class='warning'>You need a free hand to hold the gun!</span>");
					return f.dot;
				}
				yield* this.update_icon();
				yield* this.gun.forceMove(user);
				user.update_inv_back();
			}
		} else {
			to_chat(user, "<span class='warning'>You are already holding the gun!</span>");
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// laser_gatling.dm:48
rt.def("/obj/item/weapon/minigunpack/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (W == this.gun) {
		yield* user.dropItemToGround(this.gun, 1);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// laser_gatling.dm:55
rt.def("/obj/item/weapon/minigunpack/proc/dropped", function* dropped(f: Frame, user: Value) {
	if (!this.armed) return f.dot;
	yield* user.dropItemToGround(this.gun, 1);
	return f.dot;
}, true);

// laser_gatling.dm:60
rt.def("/obj/item/weapon/minigunpack/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	if (this.armed) {
		return f.dot;
	}
	if (!rt.istype(f.usr, T("/mob/living/carbon"))) return f.dot;
	let M: Value = f.usr;
	if (!over_object) {
		return f.dot;
	}
	if (M.incapacitated()) return f.dot;
	if (!rt.istype(over_object, T("/obj/screen/inventory/hand"))) return f.dot;
	let H: Value = over_object;
	yield* M.putItemFromInventoryInHandIfPossible(this, H.held_index);
	return f.dot;
}, true);

// laser_gatling.dm:75
rt.def("/obj/item/weapon/minigunpack/proc/update_icon", function update_icon(f: Frame) {
	if (this.armed) {
		this.icon_state = "notholstered";
	} else {
		this.icon_state = "holstered";
	}
	return f.dot;
});

// laser_gatling.dm:80
rt.def("/obj/item/weapon/minigunpack/proc/attach_gun", function* attach_gun(f: Frame, user: Value) {
	if (!this.gun) {
		this.gun = (yield* new_(T("/obj/item/weapon/gun/ballistic/minigun"), this));
	}
	yield* this.gun.forceMove(this);
	this.armed = 0;
	if (user) {
		to_chat(user, `<span class='notice'>You attach the ${this.gun.name} to the ${this.name}.</span>`);
	} else {
		this.visible_message(`<span class='warning'>The ${this.gun.name} snaps back onto the ${this.name}!</span>`);
	}
	yield* this.update_icon();
	user.update_inv_back();
	return f.dot;
}, true);

rt.type(5263, "/obj/item/weapon/gun/ballistic/minigun", "/obj/item/weapon/gun/ballistic", {
	ammo_pack: null,
	flags: 64,
	automatic: 0,
	casing_ejector: 0,
	name: "laser gatling gun",
	desc: "An advanced laser cannon with an incredible rate of fire. Requires a bulky backpack power source to use.",
	icon: rt.rsc("icons/obj/guns/minigun.dmi"),
	icon_state: "minigun_spin",
	item_state: "minigun",
	origin_tech: "combat=6;powerstorage=5;magnets=4",
	slowdown: 1,
	slot_flags: null,
	w_class: 5,
	materials: null,
	burst_size: 3,
	fire_delay: 1,
	weapon_weight: 3,
	fire_sound: rt.rsc("sound/weapons/laser.ogg"),
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/minigun"),
});

// laser_gatling.dm:103
rt.def("/obj/item/weapon/gun/ballistic/minigun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

// laser_gatling.dm:114
rt.def("/obj/item/weapon/gun/ballistic/minigun/proc/Initialize", function* Initialize(f: Frame) {
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "slows_while_in_hand", 1);
	if (rt.istype(this.loc, T("/obj/item/weapon/minigunpack"))) {
		this.ammo_pack = this.loc;
	} else {
		return INITIALIZE_HINT_QDEL;
	}
	return (yield* parent_proc());
}, true);

// laser_gatling.dm:128
rt.def("/obj/item/weapon/gun/ballistic/minigun/proc/dropped", function* dropped(f: Frame, user: Value) {
	if (this.ammo_pack) {
		yield* this.ammo_pack.attach_gun(user);
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true);

// laser_gatling.dm:134
rt.def("/obj/item/weapon/gun/ballistic/minigun/proc/process_fire", function* process_fire(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (!this.ammo_pack) return f.dot;
	if (this.ammo_pack.overheat < this.ammo_pack.overheat_max) {
		this.ammo_pack.overheat += this.burst_size;
		yield* parent_proc();
	} else {
		to_chat(f.args[1], "The gun's heat sensor locked the trigger to prevent lens damage.");
	}
	return f.dot;
}, true, { args: ["target", "user", "message", "params", "zone_override"] });

// laser_gatling.dm:141
rt.def("/obj/item/weapon/gun/ballistic/minigun/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	if (!this.ammo_pack || this.ammo_pack.loc != user) {
		to_chat(user, "You need the backpack power source to fire the gun!");
	}
	yield* parent_proc();
	return f.dot;
}, true);

// laser_gatling.dm:146
rt.def("/obj/item/weapon/gun/ballistic/minigun/proc/dropped", function* dropped(f: Frame, user: Value) {
	yield* this.ammo_pack.attach_gun(user);
	return f.dot;
}, true);
