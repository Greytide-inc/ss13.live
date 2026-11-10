// Based on /tg/station's code/modules/projectiles/guns/energy/special.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5183, "/obj/item/weapon/gun/energy/ionrifle", "/obj/item/weapon/gun/energy", {
	flags: 64,
	name: "ion rifle",
	desc: "A man-portable anti-armor weapon designed to disable mechanical threats at range.",
	icon_state: "ionrifle",
	item_state: null,
	origin_tech: "combat=4;magnets=4",
	can_flashlight: 1,
	w_class: 5,
	slot_flags: 1024,
	ammo_type: null,
	ammo_x_offset: 3,
	flight_x_offset: 17,
	flight_y_offset: 9,
});

// special.dm:11
rt.def("/obj/item/weapon/gun/energy/ionrifle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/ion"));
	return f.dot;
});

rt.type(5185, "/obj/item/weapon/gun/energy/decloner", "/obj/item/weapon/gun/energy", {
	name: "biological demolecularisor",
	desc: "A gun that discharges high amounts of controlled radiation to slowly break a target into component elements.",
	icon_state: "decloner",
	origin_tech: "combat=4;materials=4;biotech=5;plasmatech=6",
	ammo_type: null,
	ammo_x_offset: 1,
	pin: null,
});

// special.dm:35
rt.def("/obj/item/weapon/gun/energy/decloner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/declone"));
	return f.dot;
});

// special.dm:40
rt.def("/obj/item/weapon/gun/energy/decloner/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	let shot: Value = rt.index(this.ammo_type, this.select);
	if (!(this.cell.charge > shot.e_cost)) return f.dot;
	this.add_overlay("decloner_spin");
	return f.dot;
});

rt.type(5186, "/obj/item/weapon/gun/energy/floragun", "/obj/item/weapon/gun/energy", {
	modifystate: 1,
	selfcharge: 1,
	name: "floral somatoray",
	desc: "A tool that discharges controlled radiation which induces mutation in plant cells.",
	icon_state: "flora",
	item_state: "gun",
	ammo_type: null,
	origin_tech: "materials=2;biotech=4",
	ammo_x_offset: 1,
});

// special.dm:50
rt.def("/obj/item/weapon/gun/energy/floragun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/flora/yield"), T("/obj/item/ammo_casing/energy/flora/mut"));
	return f.dot;
});

rt.type(5187, "/obj/item/weapon/gun/energy/meteorgun", "/obj/item/weapon/gun/energy", {
	selfcharge: 1,
	name: "meteor gun",
	desc: "For the love of god, make sure you're aiming this the right way!",
	icon_state: "meteor_gun",
	item_state: "c20r",
	w_class: 4,
	ammo_type: null,
	cell_type: "/obj/item/weapon/stock_parts/cell/potato",
	clumsy_check: 0,
});

// special.dm:62
rt.def("/obj/item/weapon/gun/energy/meteorgun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/meteor"));
	return f.dot;
});

rt.type(5189, "/obj/item/weapon/gun/energy/mindflayer", "/obj/item/weapon/gun/energy", {
	name: "１Mind Flayer",
	desc: "A prototype weapon recovered from the ruins of Research-Station Epsilon.",
	icon_state: "xray",
	item_state: null,
	ammo_type: null,
	ammo_x_offset: 2,
});

// special.dm:82
rt.def("/obj/item/weapon/gun/energy/mindflayer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/mindflayer"));
	return f.dot;
});

rt.type(5169, "/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow", "/obj/item/weapon/gun/energy/kinetic_accelerator", {
	overheat_time: 20,
	holds_charge: 1,
	unique_frequency: 1,
	max_mod_capacity: 0,
	empty_state: null,
	name: "mini energy crossbow",
	desc: "A weapon favored by syndicate stealth specialists.",
	icon_state: "crossbow",
	item_state: "crossbow",
	w_class: 2,
	materials: null,
	origin_tech: "combat=4;magnets=4;syndicate=5",
	suppressed: 1,
	ammo_type: null,
	weapon_weight: 1,
	unique_rename: 0,
	can_flashlight: 0,
});

// special.dm:91
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 2000]);

	this.ammo_type = list(T("/obj/item/ammo_casing/energy/bolt"));
	return f.dot;
});

rt.type(5170, "/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/halloween", "/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow", {
	name: "candy corn crossbow",
	desc: "A weapon favored by Syndicate trick-or-treaters.",
	icon_state: "crossbow_halloween",
	item_state: "crossbow",
	ammo_type: null,
});

// special.dm:109
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/halloween/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/bolt/halloween"));
	return f.dot;
});

rt.type(5171, "/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/large", "/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow", {
	name: "energy crossbow",
	desc: "A reverse engineered weapon using syndicate technology.",
	icon_state: "crossbowlarge",
	w_class: 3,
	materials: null,
	origin_tech: "combat=4;magnets=4;syndicate=2",
	suppressed: 0,
	ammo_type: null,
	pin: null,
});

// special.dm:116
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/large/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 4000]);

	this.ammo_type = list(T("/obj/item/ammo_casing/energy/bolt/large"));
	return f.dot;
});

rt.type(5190, "/obj/item/weapon/gun/energy/plasmacutter", "/obj/item/weapon/gun/energy", {
	flags: 64,
	container_type: 4096,
	can_charge: 0,
	name: "plasma cutter",
	desc: "A mining tool capable of expelling concentrated plasma bursts. You could use it to cut limbs off xenos! Or, you know, mine stuff.",
	icon_state: "plasmacutter",
	item_state: "plasmacutter",
	origin_tech: "combat=1;materials=3;magnets=2;plasmatech=3;engineering=1",
	ammo_type: null,
	attack_verb: null,
	force: 12,
	sharpness: 1,
	heat: 3800,
	toolspeed: 0.7,
});

// special.dm:128
rt.def("/obj/item/weapon/gun/energy/plasmacutter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/plasma"));
	this.attack_verb = list("attacked", "slashed", "cut", "sliced");
	return f.dot;
});

// special.dm:139
rt.def("/obj/item/weapon/gun/energy/plasmacutter/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.cell) return f.dot;
	to_chat(user, `<span class='notice'>${this} is ${round(this.cell.percent())}% charged.</span>`);
	return f.dot;
}, false);

// special.dm:144
rt.def("/obj/item/weapon/gun/energy/plasmacutter/proc/attackby", function* attackby(f: Frame, A: Value, user: Value) {
	let S: Value = null;
	if (rt.istype(A, T("/obj/item/stack/sheet/mineral/plasma"))) {
		yield* (S = A).use(1);
		yield* this.cell.give(1000);
		yield* this.recharge_newshot(1);
		to_chat(user, `<span class='notice'>You insert ${A} in ${this}, recharging it.</span>`);
	} else if (rt.istype(A, T("/obj/item/weapon/ore/plasma"))) {
		yield* qdel(A);
		yield* this.cell.give(500);
		yield* this.recharge_newshot(1);
		to_chat(user, `<span class='notice'>You insert ${A} in ${this}, recharging it.</span>`);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(5191, "/obj/item/weapon/gun/energy/plasmacutter/adv", "/obj/item/weapon/gun/energy/plasmacutter", {
	name: "advanced plasma cutter",
	icon_state: "adv_plasmacutter",
	origin_tech: "combat=3;materials=4;magnets=3;plasmatech=4;engineering=2",
	force: 15,
	ammo_type: null,
});

// special.dm:166
rt.def("/obj/item/weapon/gun/energy/plasmacutter/adv/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/plasma/adv"));
	return f.dot;
});

rt.type(5192, "/obj/item/weapon/gun/energy/wormhole_projector", "/obj/item/weapon/gun/energy", {
	p_blue: null,
	p_orange: null,
	name: "bluespace wormhole projector",
	desc: "A projector that emits high density quantum-coupled bluespace beams.",
	ammo_type: null,
	item_state: null,
	icon_state: "wormhole_projector",
	origin_tech: "combat=4;bluespace=6;plasmatech=4;engineering=4",
});

// special.dm:171
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/wormhole"), T("/obj/item/ammo_casing/energy/wormhole/orange"));
	return f.dot;
});

// special.dm:179
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `${rt.initial(f, this, "icon_state")}${this.select}`;
	this.item_state = this.icon_state;
	return f.dot;
});

// special.dm:184
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/process_chamber", function* process_chamber(f: Frame) {
	yield* parent_proc();
	yield* this.select_fire();
	return f.dot;
}, true);

// special.dm:188
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/on_portal_destroy", function on_portal_destroy(f: Frame, _P: Value) {
	if (_P == this.p_blue) {
		this.p_blue = null;
	} else {
		if (_P != this.p_orange) return f.dot;
		this.p_orange = null;
	}
	return f.dot;
});

// special.dm:194
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/has_blue_portal", function has_blue_portal(f: Frame) {
	if (rt.istype(this.p_blue, T("/obj/effect/portal")) && !(!this.p_blue || this.p_blue.gc_destroyed)) {
		return 1;
	}
	return 0;
});

// special.dm:199
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/has_orange_portal", function has_orange_portal(f: Frame) {
	if (rt.istype(this.p_orange, T("/obj/effect/portal")) && !(!this.p_orange || this.p_orange.gc_destroyed)) {
		return 1;
	}
	return 0;
});

// special.dm:204
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/crosslink", function crosslink(f: Frame) {
	if (!this.has_blue_portal() && !this.has_orange_portal()) {
		return f.dot;
	}
	if (!this.has_blue_portal() && this.has_orange_portal()) {
		this.p_orange.link_portal(null);
		return f.dot;
	}
	if (!this.has_orange_portal() && this.has_blue_portal()) {
		this.p_blue.link_portal(null);
		return f.dot;
	}
	this.p_orange.link_portal(this.p_blue);
	this.p_blue.link_portal(this.p_orange);
	return f.dot;
});

// special.dm:216
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/create_portal", function* create_portal(f: Frame, W: Value, target: Value) {
	let _P: Value = (yield* new_(T("/obj/effect/portal"), target, this, 300, null, 0, null));
	if (rt.istype(W, T("/obj/item/projectile/beam/wormhole/orange"))) {
		yield* qdel(this.p_orange);
		this.p_orange = _P;
		_P.icon_state = "portal1";
	} else {
		yield* qdel(this.p_blue);
		this.p_blue = _P;
	}
	this.crosslink();
	return f.dot;
}, true);

rt.type(5193, "/obj/item/weapon/gun/energy/printer", "/obj/item/weapon/gun/energy", {
	can_charge: 0,
	use_cyborg_cell: 1,
	name: "cyborg lmg",
	desc: "A machinegun that fires 3d-printed flechettes slowly regenerated using a cyborg's internal power source.",
	icon_state: "l6closed0",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	cell_type: "/obj/item/weapon/stock_parts/cell/secborg",
	ammo_type: null,
});

// special.dm:234
rt.def("/obj/item/weapon/gun/energy/printer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/c3dbullet"));
	return f.dot;
});

rt.type(5194, "/obj/item/weapon/gun/energy/temperature", "/obj/item/weapon/gun/energy", {
	name: "temperature gun",
	icon_state: "freezegun",
	desc: "A gun that changes temperatures.",
	origin_tech: "combat=4;materials=4;powerstorage=3;magnets=2",
	ammo_type: null,
	cell_type: "/obj/item/weapon/stock_parts/cell/high",
	pin: null,
});

// special.dm:249
rt.def("/obj/item/weapon/gun/energy/temperature/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/temp"), T("/obj/item/ammo_casing/energy/temp/hot"));
	return f.dot;
});

rt.type(5148, "/obj/item/weapon/gun/energy/laser/instakill", "/obj/item/weapon/gun/energy/laser", {
	name: "instakill rifle",
	icon_state: "instagib",
	item_state: "instagib",
	desc: "A specialized ASMD laser-rifle, capable of flat-out disintegrating most targets in a single hit.",
	force: 60,
	origin_tech: "combat=7;magnets=6",
	ammo_type: null,
});

// special.dm:264
rt.def("/obj/item/weapon/gun/energy/laser/instakill/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/instakill"));
	return f.dot;
});

rt.type(5149, "/obj/item/weapon/gun/energy/laser/instakill/red", "/obj/item/weapon/gun/energy/laser/instakill", {
	desc: "A specialized ASMD laser-rifle, capable of flat-out disintegrating most targets in a single hit. This one has a red design.",
	icon_state: "instagibred",
	item_state: "instagibred",
	ammo_type: null,
});

// special.dm:272
rt.def("/obj/item/weapon/gun/energy/laser/instakill/red/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/instakill/red"));
	return f.dot;
});

rt.type(5150, "/obj/item/weapon/gun/energy/laser/instakill/blue", "/obj/item/weapon/gun/energy/laser/instakill", {
	desc: "A specialized ASMD laser-rifle, capable of flat-out disintegrating most targets in a single hit. This one has a blue design.",
	icon_state: "instagibblue",
	item_state: "instagibblue",
	ammo_type: null,
});

// special.dm:278
rt.def("/obj/item/weapon/gun/energy/laser/instakill/blue/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/instakill/blue"));
	return f.dot;
});

rt.type(5196, "/obj/item/weapon/gun/energy/gravity_gun", "/obj/item/weapon/gun/energy", {
	power: 4,
	name: "one-point bluespace-gravitational manipulator",
	desc: "An experimental, multi-mode device that fires bolts of Zero-Point Energy, causing local distortions in gravity.",
	ammo_type: null,
	origin_tech: "combat=4;magnets=4;materials=6;powerstorage=4;bluespace=4",
	item_state: null,
	icon_state: "gravity_gun",
});

// special.dm:286
rt.def("/obj/item/weapon/gun/energy/gravity_gun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/gravityrepulse"), T("/obj/item/ammo_casing/energy/gravityattract"), T("/obj/item/ammo_casing/energy/gravitychaos"));
	return f.dot;
});
