// Based on /tg/station's code/modules/projectiles/guns/ballistic/bow.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5262, "/obj/item/weapon/gun/ballistic/bow", "/obj/item/weapon/gun/ballistic", {
	icon_state_loaded: "bow_loaded",
	icon_state_firing: "bow_firing",
	item_state_loaded: "bow",
	item_state_firing: "bow",
	draw_sound: rt.rsc("sound/weapons/draw_bow.ogg"),
	ready_to_fire: 0,
	slowdown_when_ready: 2,
	name: "bow",
	desc: "A sturdy bow made out of wood and reinforced with iron.",
	icon_state: "bow_unloaded",
	item_state: "bow",
	fire_sound: rt.rsc("sound/weapons/grenadelaunch.ogg"),
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/bow"),
	weapon_weight: 3,
});

// bow.dm:18
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "slows_while_in_hand", 1);
	return f.dot;
}, true);

// bow.dm:23
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/update_icon", function update_icon(f: Frame) {
	if (this.ready_to_fire) {
		this.icon_state = this.icon_state_firing;
		this.item_state = this.item_state_firing;
		this.slowdown = this.slowdown_when_ready;
	} else if (this.magazine.ammo_count() && !this.ready_to_fire) {
		this.icon_state = this.icon_state_loaded;
		this.item_state = this.item_state_loaded;
		this.slowdown = rt.initial(f, this, "slowdown");
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
		this.item_state = rt.initial(f, this, "item_state");
		this.slowdown = rt.initial(f, this, "slowdown");
	}
	return f.dot;
});

// bow.dm:36
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/dropped", function* dropped(f: Frame, user: Value) {
	if (!(this.magazine && this.magazine.ammo_count())) return f.dot;
	yield* this.magazine.empty_magazine();
	this.ready_to_fire = 0;
	yield* this.update_icon();
	return f.dot;
}, true);

// bow.dm:42
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!this.ready_to_fire && this.magazine.ammo_count()) {
		this.ready_to_fire = 1;
		playsound(user, this.draw_sound, 100, 1);
		this.update_icon();
	} else {
		this.ready_to_fire = 0;
		this.update_icon();
	}
	return f.dot;
});

// bow.dm:51
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	let num_loaded: Value = null;
	if (!(num_loaded = (yield* this.magazine.attackby(A, user, params, 1)))) return f.dot;
	to_chat(user, fmt("<span class='notice'>You ready ％！ into ％！.</span>", [A, this]));
	yield* this.update_icon();
	yield* this.chamber_round();
	return f.dot;
}, true);

// bow.dm:58
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/can_shoot", function can_shoot(f: Frame) {
	f.dot = parent_proc();
	if (this.ready_to_fire) return f.dot;
	return 0;
});

// bow.dm:66
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/process_chamber", function* process_chamber(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	f.dot = (yield* parent_proc());
	this.ready_to_fire = 0;
	yield* this.update_icon();
	return f.dot;
}, true, { args: ["eject_casing", "empty_chamber"] });

rt.type(5504, "/obj/item/weapon/storage/backpack/quiver", "/obj/item/weapon/storage/backpack", {
	name: "quiver",
	desc: "A quiver for holding arrows.",
	icon_state: "quiver",
	item_state: "quiver",
	storage_slots: 20,
	can_hold: null,
});

// bow.dm:102
rt.def("/obj/item/weapon/storage/backpack/quiver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/ammo_casing/caseless/arrow"));
	return f.dot;
});

rt.type(5505, "/obj/item/weapon/storage/backpack/quiver/full", "/obj/item/weapon/storage/backpack/quiver", {});

// bow.dm:107
rt.def("/obj/item/weapon/storage/backpack/quiver/full/proc/New", function* New(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, this.storage_slots, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/ammo_casing/caseless/arrow"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
