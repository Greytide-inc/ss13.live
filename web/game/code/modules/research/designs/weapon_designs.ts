// Based on /tg/station's code/modules/research/designs/weapon_designs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(3330, "/datum/design/pin_testing", "/datum/design", {
	name: "Test-Range Firing Pin",
	desc: "This safety firing pin allows firearms to be operated within proximity to a firing range.",
	id: "pin_testing",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/firing_pin/test_range"),
});

// weapon_designs.dm:9
rt.def("/datum/design/pin_testing/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 2, "materials", 2]);
	this.materials = rt.alist(f, ["$metal", 500, "$glass", 300]);

	this.category = list("Firing Pins");
	return f.dot;
});

rt.type(3331, "/datum/design/pin_mindshield", "/datum/design", {
	name: "Mindshield Firing Pin",
	desc: "This is a security firing pin which only authorizes users who are mindshield-implanted.",
	id: "pin_loyalty",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/firing_pin/implant/mindshield"),
});

// weapon_designs.dm:19
rt.def("/datum/design/pin_mindshield/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 5, "materials", 6]);
	this.materials = rt.alist(f, ["$silver", 600, "$diamond", 600, "$uranium", 200]);

	this.category = list("Firing Pins");
	return f.dot;
});

rt.type(3332, "/datum/design/stunrevolver", "/datum/design", {
	name: "Tesla Revolver",
	desc: "A high-tech revolver that fires internal, reusable shock cartridges in a revolving cylinder. The cartridges can be recharged using conventional rechargers.",
	id: "stunrevolver",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/energy/tesla_revolver"),
});

// weapon_designs.dm:29
rt.def("/datum/design/stunrevolver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 4, "materials", 4, "powerstorage", 5]);
	this.materials = rt.alist(f, ["$metal", 10000, "$glass", 10000, "$silver", 10000]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3333, "/datum/design/nuclear_gun", "/datum/design", {
	name: "Advanced Energy Gun",
	desc: "An energy gun with an experimental miniaturized reactor.",
	id: "nuclear_gun",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/energy/e_gun/nuclear"),
});

// weapon_designs.dm:39
rt.def("/datum/design/nuclear_gun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 5, "magnets", 5, "powerstorage", 5]);
	this.materials = rt.alist(f, ["$metal", 10000, "$glass", 2000, "$uranium", 3000, "$titanium", 1000]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3334, "/datum/design/tele_shield", "/datum/design", {
	name: "Telescopic Riot Shield",
	desc: "An advanced riot shield made of lightweight materials that collapses for easy storage.",
	id: "tele_shield",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/shield/riot/tele"),
});

// weapon_designs.dm:49
rt.def("/datum/design/tele_shield/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 4, "materials", 3, "engineering", 4]);
	this.materials = rt.alist(f, ["$metal", 4000, "$glass", 4000, "$silver", 300, "$titanium", 200]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3335, "/datum/design/beamrifle", "/datum/design", {
	name: "Beam Marksman Rifle",
	desc: "A powerful long ranged anti-material rifle that fires charged particle beams to obliterate targets.",
	id: "beamrifle",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/energy/beam_rifle"),
});

// weapon_designs.dm:59
rt.def("/datum/design/beamrifle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 7, "magnets", 5, "powerstorage", 5, "materials", 7, "programming", 5]);
	this.materials = rt.alist(f, ["$metal", 10000, "$glass", 5000, "$diamond", 5000, "$uranium", 8000, "$silver", 4500, "$gold", 5000]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3336, "/datum/design/decloner", "/datum/design", {
	name: "Decloner",
	desc: "Your opponent will bubble into a messy pile of goop.",
	id: "decloner",
	req_tech: null,
	build_type: 2,
	materials: null,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/energy/decloner"),
});

// weapon_designs.dm:69
rt.def("/datum/design/decloner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 5, "materials", 5, "biotech", 6, "plasmatech", 7]);
	this.materials = rt.alist(f, ["$gold", 5000, "$uranium", 10000]);
	this.reagents_list = rt.alist(f, ["mutagen", 40]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3337, "/datum/design/rapidsyringe", "/datum/design", {
	name: "Rapid Syringe Gun",
	desc: "A gun that fires many syringes.",
	id: "rapidsyringe",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/syringe/rapidsyringe"),
});

// weapon_designs.dm:80
rt.def("/datum/design/rapidsyringe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 2, "biotech", 3]);
	this.materials = rt.alist(f, ["$metal", 5000, "$glass", 1000]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3338, "/datum/design/temp_gun", "/datum/design", {
	name: "Temperature Gun",
	desc: "A gun that shoots temperature bullet energythings to change temperature.",
	id: "temp_gun",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/energy/temperature"),
});

// weapon_designs.dm:90
rt.def("/datum/design/temp_gun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 4, "materials", 4, "powerstorage", 3, "magnets", 2]);
	this.materials = rt.alist(f, ["$metal", 5000, "$glass", 500, "$silver", 3000]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3339, "/datum/design/flora_gun", "/datum/design", {
	name: "Floral Somatoray",
	desc: "A tool that discharges controlled radiation which induces mutation in plant cells. Harmless to other organic life.",
	id: "flora_gun",
	req_tech: null,
	build_type: 2,
	materials: null,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/energy/floragun"),
});

// weapon_designs.dm:100
rt.def("/datum/design/flora_gun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["materials", 2, "biotech", 4]);
	this.materials = rt.alist(f, ["$metal", 2000, "$glass", 500]);
	this.reagents_list = rt.alist(f, ["radium", 20]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3340, "/datum/design/large_grenade", "/datum/design", {
	name: "Large Grenade",
	desc: "A grenade that affects a larger area and use larger containers.",
	id: "large_Grenade",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/grenade/chem_grenade/large"),
});

// weapon_designs.dm:111
rt.def("/datum/design/large_grenade/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 3, "engineering", 3]);
	this.materials = rt.alist(f, ["$metal", 3000]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3341, "/datum/design/pyro_grenade", "/datum/design", {
	name: "Pyro Grenade",
	desc: "An advanced grenade that is able to self ignite its mixture.",
	id: "pyro_Grenade",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/grenade/chem_grenade/pyro"),
});

// weapon_designs.dm:121
rt.def("/datum/design/pyro_grenade/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 4, "engineering", 4]);
	this.materials = rt.alist(f, ["$metal", 2000, "$plasma", 500]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3342, "/datum/design/adv_grenade", "/datum/design", {
	name: "Advanced Release Grenade",
	desc: "An advanced grenade that can be detonated several times, best used with a repeating igniter.",
	id: "adv_Grenade",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/grenade/chem_grenade/adv_release"),
});

// weapon_designs.dm:144
rt.def("/datum/design/adv_grenade/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 3, "engineering", 4]);
	this.materials = rt.alist(f, ["$metal", 3000, "$glass", 500]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3343, "/datum/design/xray", "/datum/design", {
	name: "Xray Laser Gun",
	desc: "Not quite as menacing as it sounds",
	id: "xray",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/energy/xray"),
});

// weapon_designs.dm:154
rt.def("/datum/design/xray/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 7, "magnets", 5, "biotech", 5, "powerstorage", 4]);
	this.materials = rt.alist(f, ["$gold", 5000, "$uranium", 4000, "$metal", 5000, "$titanium", 2000, "$bluespace", 2000]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3344, "/datum/design/ioncarbine", "/datum/design", {
	name: "Ion Carbine",
	desc: "How to dismantle a cyborg : The gun.",
	id: "ioncarbine",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/energy/ionrifle/carbine"),
});

// weapon_designs.dm:164
rt.def("/datum/design/ioncarbine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 5, "magnets", 4]);
	this.materials = rt.alist(f, ["$silver", 6000, "$metal", 8000, "$uranium", 2000]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3345, "/datum/design/wormhole_projector", "/datum/design", {
	name: "Bluespace Wormhole Projector",
	desc: "A projector that emits high density quantum-coupled bluespace beams.",
	id: "wormholeprojector",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/energy/wormhole_projector"),
});

// weapon_designs.dm:174
rt.def("/datum/design/wormhole_projector/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 5, "engineering", 5, "bluespace", 7, "plasmatech", 6]);
	this.materials = rt.alist(f, ["$silver", 2000, "$metal", 5000, "$diamond", 2000, "$bluespace", 3000]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3346, "/datum/design/mag_oldsmg", "/datum/design", {
	name: "WT-550 Auto Gun Magazine (4.6x30mm)",
	desc: "A 20 round magazine for the out of date security WT-550 Auto Rifle",
	id: "mag_oldsmg",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_box/magazine/wt550m9"),
});

// weapon_designs.dm:186
rt.def("/datum/design/mag_oldsmg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 1, "materials", 1]);
	this.materials = rt.alist(f, ["$metal", 4000]);

	this.category = list("Ammo");
	return f.dot;
});

rt.type(3347, "/datum/design/mag_oldsmg/ap_mag", "/datum/design/mag_oldsmg", {
	name: "WT-550 Auto Gun Armour Piercing Magazine (4.6x30mm AP)",
	desc: "A 20 round armour piercing magazine for the out of date security WT-550 Auto Rifle",
	id: "mag_oldsmg_ap",
	materials: null,
	build_path: rt.typePath("/obj/item/ammo_box/magazine/wt550m9/wtap"),
});

// weapon_designs.dm:196
rt.def("/datum/design/mag_oldsmg/ap_mag/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 6000, "$silver", 600]);
	return f.dot;
});

rt.type(3348, "/datum/design/mag_oldsmg/ic_mag", "/datum/design/mag_oldsmg", {
	name: "WT-550 Auto Gun Incendiary Magazine (4.6x30mm IC)",
	desc: "A 20 round armour piercing magazine for the out of date security WT-550 Auto Rifle",
	id: "mag_oldsmg_ic",
	materials: null,
	build_path: rt.typePath("/obj/item/ammo_box/magazine/wt550m9/wtic"),
});

// weapon_designs.dm:203
rt.def("/datum/design/mag_oldsmg/ic_mag/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 6000, "$silver", 600, "$glass", 1000]);
	return f.dot;
});

rt.type(3349, "/datum/design/mag_oldsmg/tx_mag", "/datum/design/mag_oldsmg", {
	name: "WT-550 Auto Gun Uranium Magazine (4.6x30mm TX)",
	desc: "A 20 round uranium tipped magazine for the out of date security WT-550 Auto Rifle",
	id: "mag_oldsmg_tx",
	materials: null,
	build_path: rt.typePath("/obj/item/ammo_box/magazine/wt550m9/wttx"),
});

// weapon_designs.dm:210
rt.def("/datum/design/mag_oldsmg/tx_mag/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 6000, "$silver", 600, "$uranium", 2000]);
	return f.dot;
});

rt.type(3350, "/datum/design/stunshell", "/datum/design", {
	name: "Stun Shell",
	desc: "A stunning shell for a shotgun.",
	id: "stunshell",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_casing/shotgun/stunslug"),
});

// weapon_designs.dm:217
rt.def("/datum/design/stunshell/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 3, "materials", 3]);
	this.materials = rt.alist(f, ["$metal", 200]);

	this.category = list("Ammo");
	return f.dot;
});

rt.type(3351, "/datum/design/techshell", "/datum/design", {
	name: "Unloaded Technological Shotshell",
	desc: "A high-tech shotgun shell which can be loaded with materials to produce unique effects.",
	id: "techshotshell",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/ammo_casing/shotgun/techshell"),
});

// weapon_designs.dm:227
rt.def("/datum/design/techshell/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 3, "materials", 3, "powerstorage", 4, "magnets", 3]);
	this.materials = rt.alist(f, ["$metal", 1000, "$glass", 200]);

	this.category = list("Ammo");
	return f.dot;
});

rt.type(3352, "/datum/design/suppressor", "/datum/design", {
	name: "Universal Suppressor",
	desc: "A reverse-engineered universal suppressor that fits on most small arms with threaded barrels.",
	id: "suppressor",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/suppressor"),
});

// weapon_designs.dm:237
rt.def("/datum/design/suppressor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 6, "engineering", 5, "syndicate", 3]);
	this.materials = rt.alist(f, ["$metal", 2000, "$silver", 500]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3353, "/datum/design/gravitygun", "/datum/design", {
	name: "One-point Bluespace-gravitational Manipulator",
	desc: "A multi-mode device that blasts one-point bluespace-gravitational bolts that locally distort gravity.",
	id: "gravitygun",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/energy/gravity_gun"),
});

// weapon_designs.dm:247
rt.def("/datum/design/gravitygun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 4, "materials", 5, "bluespace", 4, "powerstorage", 4, "magnets", 5]);
	this.materials = rt.alist(f, ["$silver", 8000, "$uranium", 8000, "$glass", 12000, "$metal", 12000, "$diamond", 3000, "$bluespace", 3000]);

	this.category = list("Weapons");
	return f.dot;
});

rt.type(3354, "/datum/design/largecrossbow", "/datum/design", {
	name: "Energy Crossbow",
	desc: "A reverse-engineered energy crossbow favored by syndicate infiltration teams and carp hunters.",
	id: "largecrossbow",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/large"),
});

// weapon_designs.dm:257
rt.def("/datum/design/largecrossbow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["combat", 5, "engineering", 3, "magnets", 5, "syndicate", 3]);
	this.materials = rt.alist(f, ["$metal", 5000, "$glass", 1500, "$uranium", 1500, "$silver", 1500]);

	this.category = list("Weapons");
	return f.dot;
});
