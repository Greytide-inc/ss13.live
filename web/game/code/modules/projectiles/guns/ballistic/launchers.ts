// Based on /tg/station's code/modules/projectiles/guns/ballistic/launchers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5265, "/obj/item/weapon/gun/ballistic/revolver/grenadelauncher", "/obj/item/weapon/gun/ballistic/revolver", {
	desc: "A break-operated grenade launcher.",
	name: "grenade launcher",
	icon_state: "dshotgun-sawn",
	item_state: "gun",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/grenadelauncher"),
	fire_sound: rt.rsc("sound/weapons/grenadelaunch.ogg"),
	w_class: 3,
	pin: rt.typePath("/obj/item/device/firing_pin/implant/pindicate"),
});

// launchers.dm:18
rt.def("/obj/item/weapon/gun/ballistic/revolver/grenadelauncher/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	yield* parent_proc();
	if (!(rt.istype(A, T("/obj/item/ammo_box")) || rt.istype(A, T("/obj/item/ammo_casing")))) return f.dot;
	yield* this.chamber_round();
	return f.dot;
}, true);

rt.type(5239, "/obj/item/weapon/gun/ballistic/automatic/gyropistol", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "gyrojet pistol",
	desc: "A prototype pistol designed to fire self propelled rockets.",
	icon_state: "gyropistol",
	fire_sound: rt.rsc("sound/weapons/grenadelaunch.ogg"),
	origin_tech: "combat=5",
	burst_size: 1,
	fire_delay: 0,
	actions_types: null,
	casing_ejector: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m75"),
});

// launchers.dm:42
rt.def("/obj/item/weapon/gun/ballistic/automatic/gyropistol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list();
	return f.dot;
});

// launchers.dm:46
rt.def("/obj/item/weapon/gun/ballistic/automatic/gyropistol/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = `${$0}${this.magazine ? "loaded" : ""}`;
	return f.dot;
});

rt.type(5240, "/obj/item/weapon/gun/ballistic/automatic/speargun", "/obj/item/weapon/gun/ballistic/automatic", {
	select: 0,
	name: "kinetic speargun",
	desc: "A weapon favored by carp hunters. Fires specialized spears using kinetic energy.",
	icon_state: "speargun",
	item_state: "speargun",
	w_class: 4,
	origin_tech: "combat=4;engineering=4",
	force: 10,
	can_suppress: 0,
	fire_sound: rt.rsc("sound/weapons/grenadelaunch.ogg"),
	burst_size: 1,
	fire_delay: 0,
	actions_types: null,
	casing_ejector: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/speargun"),
});

// launchers.dm:63
rt.def("/obj/item/weapon/gun/ballistic/automatic/speargun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list();
	return f.dot;
});

// launchers.dm:73
rt.def("/obj/item/weapon/gun/ballistic/automatic/speargun/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	let num_loaded: Value = null;
	if (!(num_loaded = (yield* this.magazine.attackby(A, user, params, 1)))) return f.dot;
	to_chat(user, fmt("<span class='notice'>You load ＀ spear５ into ％！.</span>", [num_loaded, this]));
	yield* this.update_icon();
	yield* this.chamber_round();
	return f.dot;
}, true);

rt.type(5241, "/obj/item/weapon/gun/ballistic/automatic/atlauncher", "/obj/item/weapon/gun/ballistic/automatic", {
	select: 0,
	desc: "A pre-loaded, single shot anti-armour launcher.",
	name: "anti-armour grenade launcher",
	icon_state: "rocketlauncher",
	item_state: "rocketlauncher",
	fire_sound: rt.rsc("sound/weapons/rocketlaunch.ogg"),
	w_class: 4,
	can_suppress: 0,
	burst_size: 1,
	fire_delay: 0,
	actions_types: null,
	casing_ejector: 0,
	weapon_weight: 3,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/rocketlauncher"),
});

// launchers.dm:91
rt.def("/obj/item/weapon/gun/ballistic/automatic/atlauncher/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list();
	return f.dot;
});

// launchers.dm:99
rt.def("/obj/item/weapon/gun/ballistic/automatic/atlauncher/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `rocketlauncher${this.magazine ? `-${this.get_ammo(1)}` : ""}`;
	return f.dot;
});
