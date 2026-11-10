// Based on /tg/station's code/modules/projectiles/guns/ballistic/automatic.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5202, "/obj/item/weapon/gun/ballistic/automatic", "/obj/item/weapon/gun/ballistic", {
	alarmed: 0,
	select: 1,
	origin_tech: "combat=4;materials=2",
	w_class: 3,
	can_suppress: 1,
	burst_size: 3,
	fire_delay: 2,
	actions_types: null,
});

// automatic.dm:9
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle_firemode"));
	return f.dot;
});

// automatic.dm:22
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/update_icon", function update_icon(f: Frame) {
	let $1: any;
	parent_proc();
	this.cut_overlays();
	if (!this.select) {
		this.add_overlay(`${rt.initial(f, this, "icon_state")}semi`);
	}
	if (this.select == 1) {
		this.add_overlay(`${rt.initial(f, this, "icon_state")}burst`);
	}
	let $0: any = rt.initial(f, this, "icon_state");
	if (this.magazine) {
		$1 = `-${this.magazine.max_ammo}`;
	} else {
		$1 = "";
	}
	this.icon_state = `${$0}${$1}${this.chambered ? "" : "-e"}${this.suppressed ? "-suppressed" : ""}`;
	return f.dot;
});

// automatic.dm:31
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	let AM: Value = null;
	f.dot = (yield* parent_proc());
	if (f.dot) {
		return f.dot;
	}
	if (!rt.istype(A, T("/obj/item/ammo_box/magazine"))) return f.dot;
	if (!rt.op(f, "IsType", [], [(AM = A), this.mag_type])) return f.dot;
	let oldmag: Value = this.magazine;
	if (yield* user.transferItemToLoc(AM, this)) {
		this.magazine = AM;
		if (oldmag) {
			to_chat(user, fmt("<span class='notice'>You perform a tactical reload on ％！, replacing the magazine.</span>", [this]));
			yield* oldmag.dropped();
			yield* oldmag.forceMove(rt.getStep(f, this.loc, 0));
			yield* oldmag.update_icon();
		} else {
			to_chat(user, fmt("<span class='notice'>You insert the magazine into ％！.</span>", [this]));
		}
		playsound(user, rt.rsc("sound/weapons/autoguninsert.ogg"), 60, 1);
		yield* this.chamber_round();
		yield* A.update_icon();
		yield* this.update_icon();
		return 1;
	} else {
		to_chat(user, fmt("<span class='warning'>You cannot seem to get ％！ out of your hands!</span>", [this]));
	}
	return f.dot;
}, true);

// automatic.dm:57
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* this.burst_select();
	return f.dot;
}, true);

// automatic.dm:60
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/burst_select", function* burst_select(f: Frame) {
	let X: Value = null, A: Value = null;
	let user: Value = f.usr;
	this.select = (!this.select ? 1 : 0);
	if (!this.select) {
		this.burst_size = 1;
		this.fire_delay = 0;
		to_chat(user, "<span class='notice'>You switch to semi-automatic.</span>");
	} else {
		this.burst_size = rt.initial(f, this, "burst_size");
		this.fire_delay = rt.initial(f, this, "fire_delay");
		to_chat(user, `<span class='notice'>You switch to ${this.burst_size}-rnd burst.</span>`);
	}
	playsound(user, rt.rsc("sound/weapons/empty.ogg"), 100, 1);
	yield* this.update_icon();
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);

// automatic.dm:78
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/can_shoot", function can_shoot(f: Frame) {
	return this.get_ammo();
});

// automatic.dm:81
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/empty_alarm", function empty_alarm(f: Frame) {
	if (!this.chambered && !this.get_ammo() && !this.alarmed) {
		playsound(this.loc, rt.rsc("sound/weapons/smg_empty_alarm.ogg"), 40, 1);
		this.update_icon();
		this.alarmed = 1;
	}
	return f.dot;
});

rt.type(5215, "/obj/item/weapon/gun/ballistic/automatic/c20r", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "１C-20r SMG",
	desc: "A bullpup two-round burst .45 SMG, designated 'C-20r'. Has a 'Scarborough Arms - Per falcis, per pravitas' buttstamp.",
	icon_state: "c20r",
	item_state: "c20r",
	origin_tech: "combat=5;materials=2;syndicate=6",
	fire_sound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	fire_delay: 2,
	burst_size: 2,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/smgm45"),
	pin: rt.typePath("/obj/item/device/firing_pin/implant/pindicate"),
});

// automatic.dm:103
rt.def("/obj/item/weapon/gun/ballistic/automatic/c20r/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.update_icon();
	return f.dot;
}, true);

// automatic.dm:107
rt.def("/obj/item/weapon/gun/ballistic/automatic/c20r/proc/afterattack", function* afterattack(f: Frame) {
	yield* parent_proc();
	this.empty_alarm();
	return f.dot;
}, true);

// automatic.dm:112
rt.def("/obj/item/weapon/gun/ballistic/automatic/c20r/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	parent_proc();
	if (this.magazine) {
		$0 = `-${Ceiling(this.get_ammo(0) / 4) * 4}`;
	} else {
		$0 = "";
	}
	this.icon_state = `c20r${$0}${this.chambered ? "" : "-e"}${this.suppressed ? "-suppressed" : ""}`;
	return f.dot;
});

rt.type(5222, "/obj/item/weapon/gun/ballistic/automatic/wt550", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "security auto rifle",
	desc: "An outdated personal defence weapon. Uses 4.6x30mm rounds and is designated the WT-550 Automatic Rifle.",
	icon_state: "wt550",
	item_state: "arg",
	fire_delay: 2,
	can_suppress: 0,
	burst_size: 0,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/wt550m9"),
});

// automatic.dm:124
rt.def("/obj/item/weapon/gun/ballistic/automatic/wt550/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list();
	return f.dot;
});

// automatic.dm:127
rt.def("/obj/item/weapon/gun/ballistic/automatic/wt550/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `wt550${this.magazine ? `-${Ceiling(this.get_ammo(0) / 4) * 4}` : ""}`;
	return f.dot;
});

rt.type(5224, "/obj/item/weapon/gun/ballistic/automatic/m90", "/obj/item/weapon/gun/ballistic/automatic", {
	underbarrel: null,
	name: "１M-90gl Carbine",
	desc: "A three-round burst 5.56 toploading carbine, designated 'M-90gl'. Has an attached underbarrel grenade launcher which can be toggled on and off.",
	icon_state: "m90",
	item_state: "m90",
	origin_tech: "combat=5;materials=2;syndicate=6",
	fire_sound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	can_suppress: 0,
	burst_size: 3,
	fire_delay: 2,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m556"),
	pin: rt.typePath("/obj/item/device/firing_pin/implant/pindicate"),
});

// automatic.dm:153
rt.def("/obj/item/weapon/gun/ballistic/automatic/m90/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.underbarrel = (yield* new_(T("/obj/item/weapon/gun/ballistic/revolver/grenadelauncher"), this));
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(5225, "/obj/item/weapon/gun/ballistic/automatic/m90/unrestricted", "/obj/item/weapon/gun/ballistic/automatic/m90", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});

// automatic.dm:161
rt.def("/obj/item/weapon/gun/ballistic/automatic/m90/unrestricted/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.underbarrel = (yield* new_(T("/obj/item/weapon/gun/ballistic/revolver/grenadelauncher/unrestricted"), this));
	yield* this.update_icon();
	return f.dot;
}, true);

// automatic.dm:166
rt.def("/obj/item/weapon/gun/ballistic/automatic/m90/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	if (this.select == 2) {
		yield* this.underbarrel.afterattack(target, user, flag, params);
	} else {
		yield* parent_proc();
		return f.dot;
	}
	return f.dot;
}, true);

// automatic.dm:172
rt.def("/obj/item/weapon/gun/ballistic/automatic/m90/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	if (rt.istype(A, T("/obj/item/ammo_casing"))) {
		if (rt.op(f, "IsType", [], [A, this.underbarrel.magazine.ammo_type])) {
			yield* this.underbarrel.attack_self();
			yield* this.underbarrel.attackby(A, user, params);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// automatic.dm:179
rt.def("/obj/item/weapon/gun/ballistic/automatic/m90/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.cut_overlays();
	if (this.select === 0) {
		this.add_overlay(`${rt.initial(f, this, "icon_state")}semi`);
	} else if (this.select === 1) {
		this.add_overlay(`${rt.initial(f, this, "icon_state")}burst`);
	} else if (this.select === 2) {
		this.add_overlay(`${rt.initial(f, this, "icon_state")}gren`);
	}
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = `${$0}${this.magazine ? "" : "-e"}`;
	return f.dot;
});

// automatic.dm:191
rt.def("/obj/item/weapon/gun/ballistic/automatic/m90/proc/burst_select", function burst_select(f: Frame) {
	let user: Value = f.usr;
	if (this.select === 0) {
		this.select = 1;
		this.burst_size = rt.initial(f, this, "burst_size");
		this.fire_delay = rt.initial(f, this, "fire_delay");
		to_chat(user, `<span class='notice'>You switch to ${this.burst_size}-rnd burst.</span>`);
	} else if (this.select === 1) {
		this.select = 2;
		to_chat(user, "<span class='notice'>You switch to grenades.</span>");
	} else if (this.select === 2) {
		this.select = 0;
		this.burst_size = 1;
		this.fire_delay = 0;
		to_chat(user, "<span class='notice'>You switch to semi-auto.</span>");
	}
	playsound(user, rt.rsc("sound/weapons/empty.ogg"), 100, 1);
	this.update_icon();
	return f.dot;
});

rt.type(5229, "/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog", "/obj/item/weapon/gun/ballistic/automatic/shotgun", {
	name: "１Bulldog Shotgun",
	desc: "A semi-auto, mag-fed shotgun for combat in narrow corridors, nicknamed 'Bulldog' by boarding parties. Compatible only with specialized 8-round drum magazines.",
	icon_state: "bulldog",
	item_state: "bulldog",
	w_class: 3,
	weapon_weight: 2,
	origin_tech: "combat=6;materials=4;syndicate=6",
	fire_sound: rt.rsc("sound/weapons/gunshot.ogg"),
	can_suppress: 0,
	burst_size: 1,
	fire_delay: 0,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m12g"),
	pin: rt.typePath("/obj/item/device/firing_pin/implant/pindicate"),
});

// automatic.dm:253
rt.def("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list();
	return f.dot;
});

// automatic.dm:259
rt.def("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.update_icon();
	return f.dot;
}, true);

// automatic.dm:263
rt.def("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (this.magazine) {
		this.add_overlay(`${this.magazine.icon_state}`);
	}
	this.icon_state = `bulldog${this.chambered ? "" : "-e"}`;
	return f.dot;
});

// automatic.dm:269
rt.def("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/proc/afterattack", function* afterattack(f: Frame) {
	yield* parent_proc();
	this.empty_alarm();
	return f.dot;
}, true);

rt.type(5231, "/obj/item/weapon/gun/ballistic/automatic/l6_saw", "/obj/item/weapon/gun/ballistic/automatic", {
	cover_open: 0,
	name: "１L6 SAW",
	desc: "A heavily modified 1.95x129mm light machine gun, designated 'L6 SAW'. Has 'Aussec Armoury - 2531' engraved on the receiver below the designation.",
	icon_state: "l6closed100",
	item_state: "l6closedmag",
	w_class: 5,
	slot_flags: 0,
	origin_tech: "combat=6;engineering=3;syndicate=6",
	weapon_weight: 3,
	fire_sound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	can_suppress: 0,
	burst_size: 3,
	fire_delay: 1,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/mm195x129"),
	pin: rt.typePath("/obj/item/device/firing_pin/implant/pindicate"),
});

// automatic.dm:299
rt.def("/obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/attack_self", function attack_self(f: Frame, user: Value) {
	this.cover_open = (!this.cover_open ? 1 : 0);
	let $0: any = user;
	to_chat($0, `<span class='notice'>You ${this.cover_open ? "open" : "close"} ${this}'s cover.</span>`);
	if (this.cover_open) {
		playsound(user, rt.rsc("sound/weapons/sawopen.ogg"), 60, 1);
	} else {
		playsound(user, rt.rsc("sound/weapons/sawclose.ogg"), 60, 1);
	}
	this.update_icon();
	return f.dot;
});

// automatic.dm:309
rt.def("/obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any;
	if (this.cover_open) {
		$0 = "open";
	} else {
		$0 = "closed";
	}
	if (this.magazine) {
		$1 = Ceiling(this.get_ammo(0) / 12.5) * 25;
	} else {
		$1 = "-empty";
	}
	this.icon_state = `l6${$0}${$1}${this.suppressed ? "-suppressed" : ""}`;
	this.item_state = `l6${this.cover_open ? "openmag" : "closedmag"}`;
	return f.dot;
});

// automatic.dm:315
rt.def("/obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	if (this.cover_open) {
		to_chat(user, `<span class='warning'>${this}'s cover is open! Close it before firing!</span>`);
	} else {
		yield* parent_proc();
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// automatic.dm:322
rt.def("/obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc != user) {
		yield* parent_proc();
		return f.dot;
	}
	if (!this.cover_open || this.cover_open && !this.magazine) {
		yield* parent_proc();
	} else {
		if (!(this.cover_open && this.magazine)) return f.dot;
		yield* this.magazine.update_icon();
		this.magazine.loc = rt.getStep(f, this.loc, 0);
		yield* user.put_in_hands(this.magazine);
		this.magazine = null;
		yield* this.update_icon();
		to_chat(user, `<span class='notice'>You remove the magazine from ${this}.</span>`);
		playsound(user, rt.rsc("sound/weapons/magout.ogg"), 60, 1);
	}
	return f.dot;
}, true);

// automatic.dm:339
rt.def("/obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	if (!this.cover_open && rt.op(f, "IsType", [], [A, this.mag_type])) {
		to_chat(user, `<span class='warning'>${this}'s cover is closed! You can't insert a new mag.</span>`);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(5235, "/obj/item/weapon/gun/ballistic/automatic/sniper_rifle", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "sniper rifle",
	desc: "A long ranged weapon that does significant damage. No, you can't quickscope.",
	icon_state: "sniper",
	item_state: "sniper",
	recoil: 2,
	weapon_weight: 3,
	fire_delay: 40,
	burst_size: 1,
	origin_tech: "combat=7",
	can_unsuppress: 1,
	can_suppress: 1,
	w_class: 3,
	zoomable: 1,
	zoom_amt: 7,
	slot_flags: 1024,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/sniper_rounds"),
});

// automatic.dm:365
rt.def("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list();
	return f.dot;
});

// automatic.dm:370
rt.def("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle/proc/update_icon", function update_icon(f: Frame) {
	if (this.magazine) {
		this.icon_state = "sniper-mag";
	} else {
		this.icon_state = "sniper";
	}
	return f.dot;
});

rt.type(5238, "/obj/item/weapon/gun/ballistic/automatic/surplus", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "Surplus Rifle",
	desc: "One of countless obsolete ballistic rifles that still sees use as a cheap deterrent. Uses 10mm ammo and its bulky frame prevents one-hand firing.",
	origin_tech: "combat=3;materials=2",
	icon_state: "surplus",
	item_state: "moistnugget",
	weapon_weight: 3,
	fire_delay: 30,
	burst_size: 1,
	can_unsuppress: 1,
	can_suppress: 1,
	w_class: 5,
	slot_flags: 1024,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m10mm/rifle"),
});

// automatic.dm:402
rt.def("/obj/item/weapon/gun/ballistic/automatic/surplus/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list();
	return f.dot;
});

// automatic.dm:406
rt.def("/obj/item/weapon/gun/ballistic/automatic/surplus/proc/update_icon", function update_icon(f: Frame) {
	if (this.magazine) {
		this.icon_state = "surplus";
	} else {
		this.icon_state = "surplus-e";
	}
	return f.dot;
});

rt.type(5211, "/obj/item/weapon/gun/ballistic/automatic/laser", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "laser rifle",
	desc: "Though sometimes mocked for the relatively weak firepower of their energy weapons, the logistic miracle of rechargable ammunition has given Nanotrasen a decisive edge over many a foe.",
	icon_state: "oldrifle",
	item_state: "arg",
	fire_delay: 2,
	can_suppress: 0,
	burst_size: 0,
	actions_types: null,
	fire_sound: rt.rsc("sound/weapons/laser.ogg"),
	casing_ejector: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/recharge"),
});

// automatic.dm:422
rt.def("/obj/item/weapon/gun/ballistic/automatic/laser/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list();
	return f.dot;
});

// automatic.dm:427
rt.def("/obj/item/weapon/gun/ballistic/automatic/laser/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `oldrifle${this.magazine ? `-${Ceiling(this.get_ammo(0) / 4) * 4}` : ""}`;
	return f.dot;
});
