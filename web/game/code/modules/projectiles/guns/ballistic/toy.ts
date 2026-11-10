// Based on /tg/station's code/modules/projectiles/guns/ballistic/toy.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5244, "/obj/item/weapon/gun/ballistic/automatic/toy/pistol", "/obj/item/weapon/gun/ballistic/automatic/toy", {
	name: "foam force pistol",
	desc: "A small, easily concealable toy handgun. Ages 8 and up.",
	icon_state: "pistol",
	w_class: 2,
	fire_sound: rt.rsc("sound/weapons/gunshot.ogg"),
	burst_size: 1,
	fire_delay: 0,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/toy/pistol"),
});

// toy.dm:29
rt.def("/obj/item/weapon/gun/ballistic/automatic/toy/pistol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list();
	return f.dot;
});

// toy.dm:32
rt.def("/obj/item/weapon/gun/ballistic/automatic/toy/pistol/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = `${$0}${this.chambered ? "" : "-e"}${this.suppressed ? "-suppressed" : ""}`;
	return f.dot;
});

rt.type(5245, "/obj/item/weapon/gun/ballistic/automatic/toy/pistol/riot", "/obj/item/weapon/gun/ballistic/automatic/toy/pistol", {
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/toy/pistol/riot"),
});

// toy.dm:39
rt.def("/obj/item/weapon/gun/ballistic/automatic/toy/pistol/riot/proc/Initialize", function* Initialize(f: Frame) {
	this.magazine = (yield* new_(T("/obj/item/ammo_box/magazine/toy/pistol/riot"), this));
	return (yield* parent_proc());
}, true);

rt.type(5259, "/obj/item/weapon/gun/ballistic/shotgun/toy", "/obj/item/weapon/gun/ballistic/shotgun", {
	name: "foam force shotgun",
	desc: "A toy shotgun with wood furniture and a four-shell capacity underneath. Ages 8 and up.",
	icon: rt.rsc("icons/obj/guns/toy.dmi"),
	force: 0,
	throwforce: 0,
	origin_tech: null,
	clumsy_check: 0,
	needs_permit: 0,
	casing_ejector: 0,
	can_suppress: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/toy"),
});

// toy.dm:62
rt.def("/obj/item/weapon/gun/ballistic/shotgun/toy/proc/process_chamber", function* process_chamber(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	yield* parent_proc();
	if (!(this.chambered && !this.chambered.BB)) return f.dot;
	yield* qdel(this.chambered);
	return f.dot;
}, true, { args: ["empty_chamber"] });
