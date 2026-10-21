// Types declared in code/modules/projectiles/guns/energy that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(5136, "/obj/item/weapon/gun/energy/laser/retro", "/obj/item/weapon/gun/energy/laser", {
	name: "retro laser gun",
	icon_state: "retro",
	desc: "An older model of the basic lasergun, no longer used by Nanotrasen's private security or military forces. Nevertheless, it is still quite deadly and easy to maintain, making it a favorite amongst pirates and other outlaws.",
	ammo_x_offset: 3,
});
rt.type(5137, "/obj/item/weapon/gun/energy/laser/retro/sc_retro", "/obj/item/weapon/gun/energy/laser/retro", {
	name: "retro laser",
	icon_state: "retro",
	desc: "An older model of the basic lasergun, no longer used by Nanotrasen's security or military forces.",
	clumsy_check: 0,
});
rt.type(5140, "/obj/item/weapon/gun/energy/laser/practice/sc_laser", "/obj/item/weapon/gun/energy/laser/practice", {
	name: "Old laser",
	desc: "A once potent weapon, years of dust have collected in the chamber and lens of this weapon, weakening the beam significantly.",
	clumsy_check: 0,
});
rt.type(5143, "/obj/item/weapon/gun/energy/laser/captain", "/obj/item/weapon/gun/energy/laser", {
	name: "antique laser gun",
	icon_state: "caplaser",
	item_state: "caplaser",
	desc: "This is an antique laser gun. All craftsmanship is of the highest quality. It is decorated with assistant leather and chrome. The object menaces with spikes of energy. On the item is an image of Space Station 13. The station is exploding.",
	force: 10,
	origin_tech: null,
	ammo_x_offset: 3,
	selfcharge: 1,
	resistance_flags: 99,
});
rt.type(5145, "/obj/item/weapon/gun/energy/laser/cyborg", "/obj/item/weapon/gun/energy/laser", {
	can_charge: 0,
	desc: "An energy-based laser gun that draws power from the cyborg's internal energy cell directly. So this is what freedom looks like?",
	origin_tech: null,
	use_cyborg_cell: 1,
});
rt.type(5155, "/obj/item/weapon/gun/energy/e_gun/advtaser/cyborg", "/obj/item/weapon/gun/energy/e_gun/advtaser", {
	name: "cyborg taser",
	desc: "An integrated hybrid taser that draws directly from a cyborg's power cell. The weapon contains a limiter to prevent the cyborg's power cell from overheating.",
	can_flashlight: 0,
	can_charge: 0,
	use_cyborg_cell: 1,
});
rt.type(5168, "/obj/item/weapon/gun/energy/kinetic_accelerator/cyborg", "/obj/item/weapon/gun/energy/kinetic_accelerator", {
	holds_charge: 1,
	unique_frequency: 1,
	max_mod_capacity: 80,
});
rt.type(5176, "/obj/item/weapon/gun/energy/pulse/loyalpin", "/obj/item/weapon/gun/energy/pulse", {
	pin: rt.typePath("/obj/item/device/firing_pin/implant/mindshield"),
});
rt.type(5177, "/obj/item/weapon/gun/energy/pulse/carbine", "/obj/item/weapon/gun/energy/pulse", {
	name: "pulse carbine",
	desc: "A compact variant of the pulse rifle with less firepower but easier storage.",
	w_class: 3,
	slot_flags: 512,
	icon_state: "pulse_carbine",
	item_state: null,
	cell_type: "/obj/item/weapon/stock_parts/cell/pulse/carbine",
	can_flashlight: 1,
	flight_x_offset: 18,
	flight_y_offset: 12,
});
rt.type(5178, "/obj/item/weapon/gun/energy/pulse/carbine/loyalpin", "/obj/item/weapon/gun/energy/pulse/carbine", {
	pin: rt.typePath("/obj/item/device/firing_pin/implant/mindshield"),
});
rt.type(5179, "/obj/item/weapon/gun/energy/pulse/pistol", "/obj/item/weapon/gun/energy/pulse", {
	name: "pulse pistol",
	desc: "A pulse rifle in an easily concealed handgun package with low capacity.",
	w_class: 2,
	slot_flags: 512,
	icon_state: "pulse_pistol",
	item_state: "gun",
	cell_type: "/obj/item/weapon/stock_parts/cell/pulse/pistol",
});
rt.type(5180, "/obj/item/weapon/gun/energy/pulse/pistol/loyalpin", "/obj/item/weapon/gun/energy/pulse/pistol", {
	pin: rt.typePath("/obj/item/device/firing_pin/implant/mindshield"),
});
rt.type(5181, "/obj/item/weapon/gun/energy/pulse/pistol/m1911", "/obj/item/weapon/gun/energy/pulse/pistol", {
	name: "１M1911-P",
	desc: "A compact pulse core in a classic handgun frame for Nanotrasen officers. It's not the size of the gun, it's the size of the hole it puts through people.",
	icon_state: "m1911",
	item_state: "gun",
	cell_type: "/obj/item/weapon/stock_parts/cell/infinite",
});
rt.type(5184, "/obj/item/weapon/gun/energy/ionrifle/carbine", "/obj/item/weapon/gun/energy/ionrifle", {
	name: "ion carbine",
	desc: "The MK.II Prototype Ion Projector is a lightweight carbine version of the larger ion rifle, built to be ergonomic and efficient.",
	icon_state: "ioncarbine",
	w_class: 3,
	slot_flags: 512,
	ammo_x_offset: 2,
	flight_x_offset: 18,
	flight_y_offset: 11,
	pin: null,
});
rt.type(5188, "/obj/item/weapon/gun/energy/meteorgun/pen", "/obj/item/weapon/gun/energy/meteorgun", {
	name: "meteor pen",
	desc: "The pen is mightier than the sword.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "pen",
	item_state: "pen",
	lefthand_file: rt.rsc("icons/mob/inhands/items_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/items_righthand.dmi"),
	w_class: 1,
});
rt.type(5195, "/obj/item/weapon/gun/energy/temperature/security", "/obj/item/weapon/gun/energy/temperature", {
	name: "security temperature gun",
	desc: "A weapon that can only be used to its full potential by the truly robust.",
	origin_tech: "combat=2;materials=2;powerstorage=1;magnets=1",
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5200, "/obj/item/weapon/gun/energy/disabler/cyborg", "/obj/item/weapon/gun/energy/disabler", {
	can_charge: 0,
	use_cyborg_cell: 1,
	name: "cyborg disabler",
	desc: "An integrated disabler that draws from a cyborg's power cell. This weapon contains a limiter to prevent the cyborg's power cell from overheating.",
});
rt.type(8897, "/obj/item/projectile/kinetic/miner", "/obj/item/projectile/kinetic", {
	damage: 20,
	speed: 0.9,
	icon_state: "ka_tracer",
	range: 4,
});
rt.type(9842, "/obj/item/borg/upgrade/modkit/range", "/obj/item/borg/upgrade/modkit", {
	modifier: 1,
	cost: 25,
	name: "range increase",
	desc: "Increases the range of a kinetic accelerator when installed.",
});
rt.type(9843, "/obj/item/borg/upgrade/modkit/damage", "/obj/item/borg/upgrade/modkit", {
	modifier: 10,
	name: "damage increase",
	desc: "Increases the damage of kinetic accelerator when installed.",
});
rt.type(9847, "/obj/item/borg/upgrade/modkit/aoe/turfs", "/obj/item/borg/upgrade/modkit/aoe", {
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/aoe/turfs"),
	turf_aoe: 1,
	name: "mining explosion",
	desc: "Causes the kinetic accelerator to destroy rock in an AoE.",
});
rt.type(9848, "/obj/item/borg/upgrade/modkit/aoe/turfs/andmobs", "/obj/item/borg/upgrade/modkit/aoe/turfs", {
	maximum_of_type: 3,
	modifier: 0.25,
	name: "offensive mining explosion",
	desc: "Causes the kinetic accelerator to destroy rock and damage mobs in an AoE.",
});
rt.type(9849, "/obj/item/borg/upgrade/modkit/aoe/mobs", "/obj/item/borg/upgrade/modkit/aoe", {
	modifier: 0.2,
	name: "offensive explosion",
	desc: "Causes the kinetic accelerator to damage mobs in an AoE.",
});
rt.type(9856, "/obj/item/borg/upgrade/modkit/chassis_mod/orange", "/obj/item/borg/upgrade/modkit/chassis_mod", {
	chassis_icon: "kineticgun_h",
	chassis_name: "hyper-kinetic accelerator",
	name: "hyper chassis",
	desc: "Makes your KA orange. All the fun of having explosive blasts without actually having explosive blasts.",
});
