// Based on /tg/station's code/modules/projectiles/guns/ballistic/pistol.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5203, "/obj/item/weapon/gun/ballistic/automatic/pistol", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "stechkin pistol",
	desc: "A small, easily concealable 10mm handgun. Has a threaded barrel for suppressors.",
	icon_state: "pistol",
	w_class: 2,
	origin_tech: "combat=3;materials=2;syndicate=4",
	can_suppress: 1,
	burst_size: 1,
	fire_delay: 0,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m10mm"),
});

// pistol.dm:11
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list();
	return f.dot;
});

// pistol.dm:14
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = `${$0}${this.chambered ? "" : "-e"}${this.suppressed ? "-suppressed" : ""}`;
	return f.dot;
});

rt.type(5204, "/obj/item/weapon/gun/ballistic/automatic/pistol/deagle", "/obj/item/weapon/gun/ballistic/automatic/pistol", {
	name: "desert eagle",
	desc: "A robust .50 AE handgun.",
	icon_state: "deagle",
	force: 14,
	can_suppress: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m50"),
});

// pistol.dm:35
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (this.magazine) {
		this.cut_overlays();
		this.add_overlay("deagle_magazine");
	} else {
		this.cut_overlays();
	}
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = `${$0}${this.chambered ? "" : "-e"}`;
	return f.dot;
});

rt.type(5209, "/obj/item/weapon/gun/ballistic/automatic/pistol/APS", "/obj/item/weapon/gun/ballistic/automatic/pistol", {
	name: "stechkin APS pistol",
	desc: "The original russian version of a widely used Syndicate sidearm. Uses 9mm ammo.",
	icon_state: "aps",
	w_class: 3,
	origin_tech: "combat=3;materials=2;syndicate=3",
	can_suppress: 0,
	burst_size: 3,
	fire_delay: 2,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/pistolm9mm"),
});

// pistol.dm:63
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/APS/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle_firemode"));
	return f.dot;
});

rt.type(5210, "/obj/item/weapon/gun/ballistic/automatic/pistol/stickman", "/obj/item/weapon/gun/ballistic/automatic/pistol", {
	name: "flat gun",
	desc: "A 2 dimensional gun.. what?",
	icon_state: "flatgun",
	origin_tech: "combat=3;materials=2;abductor=3",
});

// pistol.dm:72
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/stickman/proc/pickup", function* pickup(f: Frame, user: Value) {
	to_chat(user, `<span class='notice'>As you try to pick up ${this}, it slips out of your grip..</span>`);
	if (prob(50)) {
		to_chat(user, "<span class='notice'>..and vanishes from your vision! Where the hell did it go?</span>");
		yield* qdel(this);
		yield* user.update_icons();
	} else {
		to_chat(user, "<span class='notice'>..and falls into view. Whew, that was a close one.</span>");
		yield* user.dropItemToGround(this);
	}
	return f.dot;
}, true);
