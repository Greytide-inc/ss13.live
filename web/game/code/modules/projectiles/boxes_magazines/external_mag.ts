// Based on /tg/station's code/modules/projectiles/boxes_magazines/external_mag.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { fmt } = rt;


rt.type(9893, "/obj/item/ammo_box/magazine/m10mm/rifle", "/obj/item/ammo_box/magazine/m10mm", {
	origin_tech: "combat=2",
	name: "rifle magazine (10mm)",
	desc: "A well-worn magazine fitted for the surplus rifle.",
	icon_state: "75-8",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c10mm"),
	caliber: "10mm",
	max_ammo: 10,
});

// external_mag.dm:26
rt.def("/obj/item/ammo_box/magazine/m10mm/rifle/proc/update_icon", function update_icon(f: Frame) {
	if (this.ammo_count()) {
		this.icon_state = "75-8";
	} else {
		this.icon_state = "75-0";
	}
	return f.dot;
});

rt.type(9897, "/obj/item/ammo_box/magazine/m45", "/obj/item/ammo_box/magazine", {
	name: "handgun magazine (.45)",
	icon_state: "45-8",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c45"),
	caliber: ".45",
	max_ammo: 8,
});

// external_mag.dm:58
rt.def("/obj/item/ammo_box/magazine/m45/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `45-${this.ammo_count() ? "8" : "0"}`;
	return f.dot;
});

rt.type(9898, "/obj/item/ammo_box/magazine/wt550m9", "/obj/item/ammo_box/magazine", {
	name: "wt550 magazine (4.6x30mm)",
	icon_state: "46x30mmt-20",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c46x30mm"),
	caliber: "4.6x30mm",
	max_ammo: 20,
});

// external_mag.dm:69
rt.def("/obj/item/ammo_box/magazine/wt550m9/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `46x30mmt-${round(this.ammo_count(), 4)}`;
	return f.dot;
});

rt.type(9899, "/obj/item/ammo_box/magazine/wt550m9/wtap", "/obj/item/ammo_box/magazine/wt550m9", {
	name: "wt550 magazine (Armour Piercing 4.6x30mm)",
	icon_state: "46x30mmtA-20",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c46x30mmap"),
});

// external_mag.dm:78
rt.def("/obj/item/ammo_box/magazine/wt550m9/wtap/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `46x30mmtA-${round(this.ammo_count(), 4)}`;
	return f.dot;
});

rt.type(9900, "/obj/item/ammo_box/magazine/wt550m9/wttx", "/obj/item/ammo_box/magazine/wt550m9", {
	name: "wt550 magazine (Toxin Tipped 4.6x30mm)",
	icon_state: "46x30mmtT-20",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c46x30mmtox"),
});

// external_mag.dm:87
rt.def("/obj/item/ammo_box/magazine/wt550m9/wttx/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `46x30mmtT-${round(this.ammo_count(), 4)}`;
	return f.dot;
});

rt.type(9901, "/obj/item/ammo_box/magazine/wt550m9/wtic", "/obj/item/ammo_box/magazine/wt550m9", {
	name: "wt550 magazine (Incindiary 4.6x30mm)",
	icon_state: "46x30mmtI-20",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c46x30mminc"),
});

// external_mag.dm:96
rt.def("/obj/item/ammo_box/magazine/wt550m9/wtic/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `46x30mmtI-${round(this.ammo_count(), 4)}`;
	return f.dot;
});

rt.type(9902, "/obj/item/ammo_box/magazine/uzim9mm", "/obj/item/ammo_box/magazine", {
	name: "uzi magazine (9mm)",
	icon_state: "uzi9mm-32",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c9mm"),
	caliber: "9mm",
	max_ammo: 32,
});

// external_mag.dm:107
rt.def("/obj/item/ammo_box/magazine/uzim9mm/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `uzi9mm-${round(this.ammo_count(), 4)}`;
	return f.dot;
});

rt.type(9903, "/obj/item/ammo_box/magazine/smgm9mm", "/obj/item/ammo_box/magazine", {
	name: "SMG magazine (9mm)",
	icon_state: "smg9mm-42",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c9mm"),
	caliber: "9mm",
	max_ammo: 21,
});

// external_mag.dm:118
rt.def("/obj/item/ammo_box/magazine/smgm9mm/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `smg9mm-${this.ammo_count() ? "42" : "0"}`;
	return f.dot;
});

rt.type(9907, "/obj/item/ammo_box/magazine/pistolm9mm", "/obj/item/ammo_box/magazine", {
	name: "pistol magazine (9mm)",
	icon_state: "9x19p-8",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c9mm"),
	caliber: "9mm",
	max_ammo: 15,
});

// external_mag.dm:141
rt.def("/obj/item/ammo_box/magazine/pistolm9mm/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `9x19p-${this.ammo_count() ? "8" : "0"}`;
	return f.dot;
});

rt.type(9908, "/obj/item/ammo_box/magazine/smgm45", "/obj/item/ammo_box/magazine", {
	origin_tech: "combat=2",
	name: "SMG magazine (.45)",
	icon_state: "c20r45-24",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c45nostamina"),
	caliber: ".45",
	max_ammo: 24,
});

// external_mag.dm:153
rt.def("/obj/item/ammo_box/magazine/smgm45/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `c20r45-${round(this.ammo_count(), 2)}`;
	return f.dot;
});

rt.type(9912, "/obj/item/ammo_box/magazine/m12g", "/obj/item/ammo_box/magazine", {
	origin_tech: "combat=3;syndicate=1",
	name: "shotgun magazine (12g taser slugs)",
	desc: "A drum magazine.",
	icon_state: "m12gs",
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun/stunslug"),
	caliber: "shotgun",
	max_ammo: 8,
});

// external_mag.dm:199
rt.def("/obj/item/ammo_box/magazine/m12g/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `${rt.initial(f, this, "icon_state")}-${Ceiling(this.ammo_count(0) / 8) * 8}`;
	return f.dot;
});

rt.type(9918, "/obj/item/ammo_box/magazine/sniper_rounds", "/obj/item/ammo_box/magazine", {
	origin_tech: "combat=6;syndicate=2",
	name: "sniper rounds (.50)",
	icon_state: ".50mag",
	ammo_type: rt.typePath("/obj/item/ammo_casing/point50"),
	max_ammo: 6,
	caliber: ".50",
});

// external_mag.dm:239
rt.def("/obj/item/ammo_box/magazine/sniper_rounds/proc/update_icon", function update_icon(f: Frame) {
	if (this.ammo_count()) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-ammo`;
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}`;
	}
	return f.dot;
});

rt.type(9924, "/obj/item/ammo_box/magazine/mm195x129", "/obj/item/ammo_box/magazine", {
	origin_tech: "combat=2",
	name: "box magazine (1.95x129mm)",
	icon_state: "a762-50",
	ammo_type: rt.typePath("/obj/item/ammo_casing/mm195x129"),
	caliber: "mm195129",
	max_ammo: 50,
});

// external_mag.dm:311
rt.def("/obj/item/ammo_box/magazine/mm195x129/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `a762-${round(this.ammo_count(), 10)}`;
	return f.dot;
});

rt.type(9930, "/obj/item/ammo_box/magazine/toy/smg", "/obj/item/ammo_box/magazine/toy", {
	name: "foam force SMG magazine",
	icon_state: "smg9mm-42",
	max_ammo: 20,
});

// external_mag.dm:330
rt.def("/obj/item/ammo_box/magazine/toy/smg/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (this.ammo_count()) {
		this.icon_state = "smg9mm-42";
	} else {
		this.icon_state = "smg9mm-0";
	}
	return f.dot;
});

rt.type(9934, "/obj/item/ammo_box/magazine/toy/smgm45", "/obj/item/ammo_box/magazine/toy", {
	name: "donksoft SMG magazine",
	caliber: "foam_force",
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/foam_dart/riot"),
	max_ammo: 20,
});

// external_mag.dm:355
rt.def("/obj/item/ammo_box/magazine/toy/smgm45/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `c20r45-${round(this.ammo_count(), 2)}`;
	return f.dot;
});

rt.type(9935, "/obj/item/ammo_box/magazine/toy/m762", "/obj/item/ammo_box/magazine/toy", {
	name: "donksoft box magazine",
	caliber: "foam_force",
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/foam_dart/riot"),
	max_ammo: 50,
});

// external_mag.dm:365
rt.def("/obj/item/ammo_box/magazine/toy/m762/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `a762-${round(this.ammo_count(), 10)}`;
	return f.dot;
});

rt.type(9888, "/obj/item/ammo_box/magazine/recharge", "/obj/item/ammo_box/magazine", {
	name: "power pack",
	desc: "A rechargeable, detachable battery that serves as a magazine for laser rifles.",
	icon_state: "oldrifle-20",
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/laser"),
	caliber: "laser",
	max_ammo: 20,
});

// external_mag.dm:382
rt.def("/obj/item/ammo_box/magazine/recharge/proc/update_icon", function update_icon(f: Frame) {
	this.desc = fmt("＀ It has ＀ shot５ left.", [rt.initial(f, this, "desc"), rt.len(f, this.stored_ammo)]);
	this.icon_state = `oldrifle-${round(this.ammo_count(), 4)}`;
	return f.dot;
});
