// Based on /tg/station's code/modules/projectiles/guns/energy/energy_gun.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5151, "/obj/item/weapon/gun/energy/e_gun", "/obj/item/weapon/gun/energy", {
	name: "energy gun",
	desc: "A basic hybrid energy gun with two settings: disable and kill.",
	icon_state: "energy",
	item_state: null,
	origin_tech: "combat=4;magnets=3",
	modifystate: 1,
	can_flashlight: 1,
	ammo_x_offset: 3,
	flight_x_offset: 15,
	flight_y_offset: 10,
	ammo_type: null,
});

// energy_gun.dm:6
rt.def("/obj/item/weapon/gun/energy/e_gun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/disabler"), T("/obj/item/ammo_casing/energy/laser"));
	return f.dot;
});

rt.type(5156, "/obj/item/weapon/gun/energy/e_gun/mini", "/obj/item/weapon/gun/energy/e_gun", {
	name: "miniature energy gun",
	desc: "A small, pistol-sized energy gun with a built-in flashlight. It has two settings: stun and kill.",
	icon_state: "mini",
	item_state: "gun",
	w_class: 2,
	ammo_x_offset: 2,
	charge_sections: 3,
	can_flashlight: 0,
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell"),
});

// energy_gun.dm:26
rt.def("/obj/item/weapon/gun/energy/e_gun/mini/proc/Initialize", function* Initialize(f: Frame) {
	this.gun_light = (yield* new_(T("/obj/item/device/flashlight/seclite"), this));
	return (yield* parent_proc());
}, true);

// energy_gun.dm:30
rt.def("/obj/item/weapon/gun/energy/e_gun/mini/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (!(this.gun_light && this.gun_light.on)) return f.dot;
	this.add_overlay("mini-light");
	return f.dot;
});

rt.type(5158, "/obj/item/weapon/gun/energy/e_gun/stun", "/obj/item/weapon/gun/energy/e_gun", {
	name: "tactical energy gun",
	desc: "Military issue energy gun, is able to fire stun rounds.",
	icon_state: "energytac",
	ammo_x_offset: 2,
	ammo_type: null,
});

// energy_gun.dm:39
rt.def("/obj/item/weapon/gun/energy/e_gun/stun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/electrode/spec"), T("/obj/item/ammo_casing/energy/disabler"), T("/obj/item/ammo_casing/energy/laser"));
	return f.dot;
});

rt.type(5159, "/obj/item/weapon/gun/energy/e_gun/old", "/obj/item/weapon/gun/energy/e_gun", {
	name: "prototype energy gun",
	desc: "NT-P:01 Prototype Energy Gun. Early stage development of a unique laser rifle that has multifaceted energy lens allowing the gun to alter the form of projectile it fires on command.",
	icon_state: "protolaser",
	ammo_x_offset: 2,
	ammo_type: null,
});

// energy_gun.dm:46
rt.def("/obj/item/weapon/gun/energy/e_gun/old/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/laser"), T("/obj/item/ammo_casing/energy/electrode/old"));
	return f.dot;
});

rt.type(5157, "/obj/item/weapon/gun/energy/e_gun/mini/practice_phaser", "/obj/item/weapon/gun/energy/e_gun/mini", {
	name: "practice phaser",
	desc: "A modified version of the basic phaser gun, this one fires less concentrated energy bolts designed for target practice.",
	icon_state: "decloner",
	ammo_type: null,
});

// energy_gun.dm:51
rt.def("/obj/item/weapon/gun/energy/e_gun/mini/practice_phaser/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/disabler"), T("/obj/item/ammo_casing/energy/laser/practice"));
	return f.dot;
});

rt.type(5160, "/obj/item/weapon/gun/energy/e_gun/hos", "/obj/item/weapon/gun/energy/e_gun", {
	name: "１X-01 MultiPhase Energy Gun",
	desc: "This is an expensive, modern recreation of an antique laser gun. This gun has several unique firemodes, but lacks the ability to recharge over time.",
	icon_state: "hoslaser",
	origin_tech: null,
	force: 10,
	ammo_x_offset: 4,
	resistance_flags: 99,
	ammo_type: null,
});

// energy_gun.dm:60
rt.def("/obj/item/weapon/gun/energy/e_gun/hos/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/electrode/hos"), T("/obj/item/ammo_casing/energy/laser/hos"), T("/obj/item/ammo_casing/energy/disabler"));
	return f.dot;
});

rt.type(5161, "/obj/item/weapon/gun/energy/e_gun/dragnet", "/obj/item/weapon/gun/energy/e_gun", {
	name: "１DRAGnet",
	desc: "The \"Dynamic Rapid-Apprehension of the Guilty\" net is a revolution in law enforcement technology.",
	icon_state: "dragnet",
	origin_tech: "combat=4;magnets=3;bluespace=4",
	can_flashlight: 0,
	ammo_x_offset: 1,
	ammo_type: null,
});

// energy_gun.dm:69
rt.def("/obj/item/weapon/gun/energy/e_gun/dragnet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/net"), T("/obj/item/ammo_casing/energy/trap"));
	return f.dot;
});

rt.type(5162, "/obj/item/weapon/gun/energy/e_gun/dragnet/snare", "/obj/item/weapon/gun/energy/e_gun/dragnet", {
	name: "Energy Snare Launcher",
	desc: "Fires an energy snare that slows the target down",
	ammo_type: null,
});

// energy_gun.dm:76
rt.def("/obj/item/weapon/gun/energy/e_gun/dragnet/snare/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/trap"));
	return f.dot;
});

rt.type(5152, "/obj/item/weapon/gun/energy/e_gun/turret", "/obj/item/weapon/gun/energy/e_gun", {
	name: "hybrid turret gun",
	desc: "A heavy hybrid energy cannon with two settings: Stun and kill.",
	icon_state: "turretlaser",
	item_state: "turretlaser",
	slot_flags: null,
	w_class: 5,
	weapon_weight: 3,
	can_flashlight: 0,
	trigger_guard: 0,
	ammo_x_offset: 2,
	ammo_type: null,
});

// energy_gun.dm:85
rt.def("/obj/item/weapon/gun/energy/e_gun/turret/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/electrode"), T("/obj/item/ammo_casing/energy/laser"));
	return f.dot;
});

rt.type(5163, "/obj/item/weapon/gun/energy/e_gun/nuclear", "/obj/item/weapon/gun/energy/e_gun", {
	fail_tick: 0,
	fail_chance: 0,
	name: "advanced energy gun",
	desc: "An energy gun with an experimental miniaturized nuclear reactor that automatically charges the internal power cell.",
	icon_state: "nucgun",
	item_state: "nucgun",
	origin_tech: "combat=4;magnets=4;powerstorage=4",
	charge_delay: 5,
	can_charge: 0,
	ammo_x_offset: 1,
	selfcharge: 1,
	pin: null,
	ammo_type: null,
});

// energy_gun.dm:101
rt.def("/obj/item/weapon/gun/energy/e_gun/nuclear/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/electrode"), T("/obj/item/ammo_casing/energy/laser"), T("/obj/item/ammo_casing/energy/disabler"));
	return f.dot;
});

// energy_gun.dm:107
rt.def("/obj/item/weapon/gun/energy/e_gun/nuclear/proc/process", function process(f: Frame) {
	if (this.fail_tick > 0) {
		this.fail_tick--;
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// energy_gun.dm:112
rt.def("/obj/item/weapon/gun/energy/e_gun/nuclear/proc/shoot_live_shot", function* shoot_live_shot(f: Frame) {
	yield* this.failcheck();
	yield* this.update_icon();
	yield* parent_proc();
	return f.dot;
}, true);

// energy_gun.dm:117
rt.def("/obj/item/weapon/gun/energy/e_gun/nuclear/proc/failcheck", function* failcheck(f: Frame) {
	if (!(prob(this.fail_chance) && rt.istype(this.loc, T("/mob/living")))) return f.dot;
	let M: Value = this.loc;
	if (rt.inRange(this.fail_tick, 0, 200)) {
		this.fail_tick += 2 * this.fail_chance;
		yield* M.rad_act(40);
		to_chat(M, `<span class='userdanger'>Your ${this.name} feels warmer.</span>`);
	} else if (rt.inRange(this.fail_tick, 201, 1e+31)) {
		yield* GLOB.SSobj.processing.Remove(this);
		yield* M.rad_act(80);
		this.crit_fail = 1;
		to_chat(M, `<span class='userdanger'>Your ${this.name}'s reactor overloads!</span>`);
	}
	return f.dot;
}, true);

// energy_gun.dm:131
rt.def("/obj/item/weapon/gun/energy/e_gun/nuclear/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* parent_proc();
	this.fail_chance = min(this.fail_chance + round(15 / severity), 100);
	return f.dot;
}, true);

// energy_gun.dm:135
rt.def("/obj/item/weapon/gun/energy/e_gun/nuclear/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (this.crit_fail) {
		this.add_overlay(`${this.icon_state}_fail_3`);
	} else if (this.fail_tick === 0) {
		this.add_overlay(`${this.icon_state}_fail_0`);
	} else if (rt.inRange(this.fail_tick, 1, 150)) {
		this.add_overlay(`${this.icon_state}_fail_1`);
	} else if (rt.inRange(this.fail_tick, 151, 1e+31)) {
		this.add_overlay(`${this.icon_state}_fail_2`);
	}
	return f.dot;
});
