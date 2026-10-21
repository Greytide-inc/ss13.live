// Types declared in code/game/objects that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(5646, "/obj/item/weapon/antag_spawner", "/obj/item/weapon", {
	used: 0,
	throw_speed: 1,
	throw_range: 5,
	w_class: 1,
});
rt.type(5765, "/obj/item/weapon/restraints", "/obj/item/weapon", {
	breakouttime: 600,
});
rt.type(5766, "/obj/item/weapon/restraints/legcuffs", "/obj/item/weapon/restraints", {
	flags: 64,
	name: "leg cuffs",
	desc: "Use this to keep prisoners in line.",
	gender: "plural",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "handcuff",
	throwforce: 0,
	w_class: 3,
	origin_tech: "engineering=3;combat=3",
	slowdown: 7,
	breakouttime: 300,
});
rt.type(6671, "/obj/item/weapon/disk", "/obj/item/weapon", {
	icon: rt.rsc("icons/obj/module.dmi"),
	w_class: 1,
	item_state: "card-id",
	icon_state: "datadisk0",
});
rt.type(6673, "/obj/item/weapon/disk/fakenucleardisk", "/obj/item/weapon/disk", {
	name: "cheap plastic imitation of the nuclear authentication disk",
	desc: "Broken dreams and a faint odor of cheese.",
	icon_state: "nucleardisk",
});
rt.type(7051, "/obj/item/weapon/c_tube", "/obj/item/weapon", {
	throw_speed: 3,
	throw_range: 5,
	name: "cardboard tube",
	desc: "A tube... of cardboard.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "c_tube",
	throwforce: 0,
	w_class: 1,
});
rt.type(7129, "/obj/item/weapon/cigbutt", "/obj/item/weapon", {
	name: "cigarette butt",
	desc: "A manky old cigarette butt.",
	icon: rt.rsc("icons/obj/clothing/masks.dmi"),
	icon_state: "cigbutt",
	w_class: 1,
	throwforce: 0,
});
rt.type(7131, "/obj/item/weapon/cigbutt/cigarbutt", "/obj/item/weapon/cigbutt", {
	name: "cigar butt",
	desc: "A manky old cigar butt.",
	icon_state: "cigarbutt",
});
rt.type(7269, "/obj/item/weapon/kitchen", "/obj/item/weapon", {
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	origin_tech: "materials=1",
});
rt.type(7280, "/obj/item/weapon/kitchen/rollingpin", "/obj/item/weapon/kitchen", {
	throw_speed: 3,
	throw_range: 7,
	name: "rolling pin",
	desc: "Used to knock out the Bartender.",
	icon_state: "rolling_pin",
	force: 8,
	throwforce: 5,
	w_class: 3,
	attack_verb: null,
});
rt.type(7307, "/obj/item/weapon/caution", "/obj/item/weapon", {
	throw_speed: 2,
	throw_range: 5,
	desc: "Caution! Wet Floor!",
	name: "wet floor sign",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "caution",
	force: 1,
	throwforce: 3,
	w_class: 2,
	attack_verb: null,
});
rt.type(7392, "/obj/item/weapon/staff", "/obj/item/weapon", {
	throw_speed: 2,
	throw_range: 5,
	name: "wizard staff",
	desc: "Apparently a staff used by the wizard.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "staff",
	force: 3,
	throwforce: 5,
	w_class: 2,
	armour_penetration: 100,
	attack_verb: null,
	resistance_flags: 4,
});
rt.type(7393, "/obj/item/weapon/staff/broom", "/obj/item/weapon/staff", {
	name: "broom",
	desc: "Used for sweeping, and flying into the night while cackling. Black cat not included.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "broom",
	resistance_flags: 4,
});
rt.type(7394, "/obj/item/weapon/staff/stick", "/obj/item/weapon/staff", {
	throw_speed: 2,
	throw_range: 5,
	name: "stick",
	desc: "A great tool to drag someone else's drinks across the bar.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "stick",
	item_state: "stick",
	force: 3,
	throwforce: 5,
	w_class: 2,
});
rt.type(7398, "/obj/item/weapon/tailclub", "/obj/item/weapon", {
	throw_speed: 1,
	throw_range: 1,
	name: "tail club",
	desc: "For the beating to death of lizards with their own tails.",
	icon_state: "tailclub",
	force: 14,
	throwforce: 1,
	attack_verb: null,
});
rt.type(7481, "/obj/item/weapon/toy", "/obj/item/weapon", {});
rt.type(7488, "/obj/item/weapon/holo", "/obj/item/weapon", {
	damtype: "stamina",
});
rt.type(7515, "/obj/item/weapon/mining_voucher", "/obj/item/weapon", {
	name: "mining voucher",
	desc: "A token to redeem a piece of equipment. Use it on a mining equipment vendor.",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "mining_voucher",
	w_class: 1,
});
rt.type(7546, "/obj/item/weapon/oar", "/obj/item/weapon", {
	name: "oar",
	icon: rt.rsc("icons/obj/vehicles.dmi"),
	icon_state: "oar",
	item_state: "oar",
	desc: "Not to be confused with the kind Research hassles you for.",
	force: 12,
	w_class: 3,
	resistance_flags: 3,
});
rt.type(7550, "/obj/item/weapon/bloodcrawl", "/obj/item/weapon", {
	flags: 130,
	name: "blood crawl",
	desc: "You are unable to hold anything while in this form.",
	icon: rt.rsc("icons/effects/blood.dmi"),
});
rt.type(7643, "/obj/item/weapon/suppressor", "/obj/item/weapon", {
	oldsound: null,
	initial_w_class: null,
	name: "suppressor",
	desc: "A universal syndicate small-arms suppressor for maximum espionage.",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	icon_state: "suppressor",
	w_class: 2,
});
rt.type(7644, "/obj/item/weapon/suppressor/specialoffer", "/obj/item/weapon/suppressor", {
	name: "cheap suppressor",
	desc: "A foreign knock-off suppressor, it feels flimsy, cheap, and brittle. Still fits all weapons.",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	icon_state: "suppressor",
});
rt.type(7647, "/obj/item/weapon/research", "/obj/item/weapon", {
	name: "research",
	icon: rt.rsc("icons/obj/stock_parts.dmi"),
	icon_state: "capacitor",
	desc: "A debug item for research.",
	origin_tech: "materials=8;programming=8;magnets=8;powerstorage=8;bluespace=8;combat=8;biotech=8;syndicate=8;engineering=8;plasmatech=8;abductor=8",
});
rt.type(9114, "/obj/item/device", "/obj/item", {
	icon: rt.rsc("icons/obj/device.dmi"),
});
rt.type(9391, "/obj/item/device/extinguisher_refill", "/obj/item/device", {
	name: "envirosuit extinguisher cartridge",
	desc: "A cartridge loaded with a compressed extinguisher mix, used to refill the automatic extinguisher on plasma envirosuits.",
	icon_state: "plasmarefill",
	origin_tech: "materials=2;plasmatech=3;biotech=1",
});
rt.type(9420, "/obj/item/device/toner", "/obj/item/device", {
	charges: 5,
	max_charges: 5,
	name: "toner cartridge",
	icon_state: "tonercartridge",
});
rt.type(9421, "/obj/item/device/camera_film", "/obj/item/device", {
	name: "film cartridge",
	icon: rt.rsc("icons/obj/items.dmi"),
	desc: "A camera film cartridge. Insert it into a camera to reload it.",
	icon_state: "film",
	item_state: "electropack",
	w_class: 1,
	resistance_flags: 4,
});
rt.type(9556, "/obj/item/mecha_parts", "/obj/item", {
	flags: 64,
	name: "mecha part",
	icon: rt.rsc("icons/mecha/mech_construct.dmi"),
	icon_state: "blank",
	w_class: 6,
	origin_tech: "programming=2;materials=2;engineering=2",
});
rt.type(9567, "/obj/item/mecha_parts/part", "/obj/item/mecha_parts", {});
rt.type(9568, "/obj/item/mecha_parts/part/ripley_torso", "/obj/item/mecha_parts/part", {
	name: "１Ripley torso",
	desc: "A torso part of Ripley APLU. Contains power unit, processing core and life support systems.",
	icon_state: "ripley_harness",
	origin_tech: "programming=2;materials=2;biotech=2;engineering=2",
});
rt.type(9569, "/obj/item/mecha_parts/part/ripley_left_arm", "/obj/item/mecha_parts/part", {
	name: "１Ripley left arm",
	desc: "A Ripley APLU left arm. Data and power sockets are compatible with most exosuit tools.",
	icon_state: "ripley_l_arm",
});
rt.type(9570, "/obj/item/mecha_parts/part/ripley_right_arm", "/obj/item/mecha_parts/part", {
	name: "１Ripley right arm",
	desc: "A Ripley APLU right arm. Data and power sockets are compatible with most exosuit tools.",
	icon_state: "ripley_r_arm",
});
rt.type(9571, "/obj/item/mecha_parts/part/ripley_left_leg", "/obj/item/mecha_parts/part", {
	name: "１Ripley left leg",
	desc: "A Ripley APLU left leg. Contains somewhat complex servodrives and balance maintaining systems.",
	icon_state: "ripley_l_leg",
});
rt.type(9572, "/obj/item/mecha_parts/part/ripley_right_leg", "/obj/item/mecha_parts/part", {
	name: "１Ripley right leg",
	desc: "A Ripley APLU right leg. Contains somewhat complex servodrives and balance maintaining systems.",
	icon_state: "ripley_r_leg",
});
rt.type(9573, "/obj/item/mecha_parts/part/odysseus_head", "/obj/item/mecha_parts/part", {
	name: "１Odysseus head",
	desc: "An Odysseus head. Contains an integrated medical HUD scanner.",
	icon_state: "odysseus_head",
});
rt.type(9574, "/obj/item/mecha_parts/part/odysseus_torso", "/obj/item/mecha_parts/part", {
	name: "１Odysseus torso",
	desc: "A torso part of Odysseus. Contains power unit, processing core and life support systems along with an attachment port for a mounted sleeper.",
	icon_state: "odysseus_torso",
	origin_tech: "programming=2;materials=2;biotech=2;engineering=2",
});
rt.type(9575, "/obj/item/mecha_parts/part/odysseus_left_arm", "/obj/item/mecha_parts/part", {
	name: "１Odysseus left arm",
	desc: "An Odysseus left arm. Data and power sockets are compatible with specialized medical equipment.",
	icon_state: "odysseus_l_arm",
});
rt.type(9576, "/obj/item/mecha_parts/part/odysseus_right_arm", "/obj/item/mecha_parts/part", {
	name: "１Odysseus right arm",
	desc: "An Odysseus right arm. Data and power sockets are compatible with specialized medical equipment.",
	icon_state: "odysseus_r_arm",
});
rt.type(9577, "/obj/item/mecha_parts/part/odysseus_left_leg", "/obj/item/mecha_parts/part", {
	name: "１Odysseus left leg",
	desc: "An Odysseus left leg. Contains complex servodrives and balance maintaining systems to maintain stability for critical patients.",
	icon_state: "odysseus_l_leg",
});
rt.type(9578, "/obj/item/mecha_parts/part/odysseus_right_leg", "/obj/item/mecha_parts/part", {
	name: "１Odysseus right leg",
	desc: "A Odysseus right leg. Contains complex servodrives and balance maintaining systems to maintain stability for critical patients.",
	icon_state: "odysseus_r_leg",
});
rt.type(9579, "/obj/item/mecha_parts/part/gygax_torso", "/obj/item/mecha_parts/part", {
	name: "１Gygax torso",
	desc: "A torso part of Gygax. Contains power unit, processing core and life support systems.",
	icon_state: "gygax_harness",
	origin_tech: "programming=2;materials=4;biotech=3;engineering=3",
});
rt.type(9580, "/obj/item/mecha_parts/part/gygax_head", "/obj/item/mecha_parts/part", {
	name: "１Gygax head",
	desc: "A Gygax head. Houses advanced surveillance and targeting sensors.",
	icon_state: "gygax_head",
	origin_tech: "programming=2;materials=4;magnets=3;engineering=3",
});
rt.type(9581, "/obj/item/mecha_parts/part/gygax_left_arm", "/obj/item/mecha_parts/part", {
	name: "１Gygax left arm",
	desc: "A Gygax left arm. Data and power sockets are compatible with most exosuit tools and weapons.",
	icon_state: "gygax_l_arm",
	origin_tech: "programming=2;materials=4;engineering=3",
});
rt.type(9582, "/obj/item/mecha_parts/part/gygax_right_arm", "/obj/item/mecha_parts/part", {
	name: "１Gygax right arm",
	desc: "A Gygax right arm. Data and power sockets are compatible with most exosuit tools and weapons.",
	icon_state: "gygax_r_arm",
	origin_tech: "programming=2;materials=4;engineering=3",
});
rt.type(9583, "/obj/item/mecha_parts/part/gygax_left_leg", "/obj/item/mecha_parts/part", {
	name: "１Gygax left leg",
	desc: "A Gygax left leg. Constructed with advanced servomechanisms and actuators to enable faster speed.",
	icon_state: "gygax_l_leg",
	origin_tech: "programming=2;materials=4;engineering=3",
});
rt.type(9584, "/obj/item/mecha_parts/part/gygax_right_leg", "/obj/item/mecha_parts/part", {
	name: "１Gygax right leg",
	desc: "A Gygax right leg. Constructed with advanced servomechanisms and actuators to enable faster speed.",
	icon_state: "gygax_r_leg",
	origin_tech: "programming=2;materials=4;engineering=3",
});
rt.type(9585, "/obj/item/mecha_parts/part/gygax_armor", "/obj/item/mecha_parts/part", {
	gender: "plural",
	name: "１Gygax armor plates",
	desc: "A set of armor plates designed for the Gygax. Designed to effectively deflect damage with a lightweight construction.",
	icon_state: "gygax_armor",
	origin_tech: "materials=6;combat=4;engineering=4",
});
rt.type(9586, "/obj/item/mecha_parts/part/durand_torso", "/obj/item/mecha_parts/part", {
	name: "１Durand torso",
	desc: "A torso part of Durand. Contains power unit, processing core and life support systems within a robust protective frame.",
	icon_state: "durand_harness",
	origin_tech: "programming=2;materials=3;biotech=3;engineering=3",
});
rt.type(9587, "/obj/item/mecha_parts/part/durand_head", "/obj/item/mecha_parts/part", {
	name: "１Durand head",
	desc: "A Durand head. Houses advanced surveillance and targeting sensors.",
	icon_state: "durand_head",
	origin_tech: "programming=2;materials=3;magnets=3;engineering=3",
});
rt.type(9588, "/obj/item/mecha_parts/part/durand_left_arm", "/obj/item/mecha_parts/part", {
	name: "１Durand left arm",
	desc: "A Durand left arm. Data and power sockets are compatible with most exosuit tools and weapons. Packs a really mean punch as well.",
	icon_state: "durand_l_arm",
	origin_tech: "programming=2;materials=3;engineering=3",
});
rt.type(9589, "/obj/item/mecha_parts/part/durand_right_arm", "/obj/item/mecha_parts/part", {
	name: "１Durand right arm",
	desc: "A Durand right arm. Data and power sockets are compatible with most exosuit tools and weapons. Packs a really mean punch as well.",
	icon_state: "durand_r_arm",
	origin_tech: "programming=2;materials=3;engineering=3",
});
rt.type(9590, "/obj/item/mecha_parts/part/durand_left_leg", "/obj/item/mecha_parts/part", {
	name: "１Durand left leg",
	desc: "A Durand left leg. Built particlarly sturdy to support the Durand's heavy weight and defensive needs.",
	icon_state: "durand_l_leg",
	origin_tech: "programming=2;materials=3;engineering=3",
});
rt.type(9591, "/obj/item/mecha_parts/part/durand_right_leg", "/obj/item/mecha_parts/part", {
	name: "１Durand right leg",
	desc: "A Durand right leg. Built particlarly sturdy to support the Durand's heavy weight and defensive needs.",
	icon_state: "durand_r_leg",
	origin_tech: "programming=2;materials=3;engineering=3",
});
rt.type(9592, "/obj/item/mecha_parts/part/durand_armor", "/obj/item/mecha_parts/part", {
	gender: "plural",
	name: "１Durand armor plates",
	desc: "A set of armor plates for the Durand. Built heavy to resist an incredible amount of brute force.",
	icon_state: "durand_armor",
	origin_tech: "materials=5;combat=4;engineering=4",
});
rt.type(9593, "/obj/item/mecha_parts/part/honker_torso", "/obj/item/mecha_parts/part", {
	name: "１H.O.N.K torso",
	desc: "A torso part of H.O.N.K. Contains chuckle unit, bananium core and honk support systems.",
	icon_state: "honker_harness",
});
rt.type(9594, "/obj/item/mecha_parts/part/honker_head", "/obj/item/mecha_parts/part", {
	name: "１H.O.N.K head",
	desc: "A H.O.N.K head. Appears to lack a face plate.",
	icon_state: "honker_head",
});
rt.type(9595, "/obj/item/mecha_parts/part/honker_left_arm", "/obj/item/mecha_parts/part", {
	name: "１H.O.N.K left arm",
	desc: "A H.O.N.K left arm. With unique sockets that accept odd weaponry designed by clown scientists.",
	icon_state: "honker_l_arm",
});
rt.type(9596, "/obj/item/mecha_parts/part/honker_right_arm", "/obj/item/mecha_parts/part", {
	name: "１H.O.N.K right arm",
	desc: "A H.O.N.K right arm. With unique sockets that accept odd weaponry designed by clown scientists.",
	icon_state: "honker_r_arm",
});
rt.type(9597, "/obj/item/mecha_parts/part/honker_left_leg", "/obj/item/mecha_parts/part", {
	name: "１H.O.N.K left leg",
	desc: "A H.O.N.K left leg. The foot appears just large enough to fully accommodate a clown shoe.",
	icon_state: "honker_l_leg",
});
rt.type(9598, "/obj/item/mecha_parts/part/honker_right_leg", "/obj/item/mecha_parts/part", {
	name: "１H.O.N.K right leg",
	desc: "A H.O.N.K right leg. The foot appears just large enough to fully accommodate a clown shoe.",
	icon_state: "honker_r_leg",
});
rt.type(9599, "/obj/item/mecha_parts/part/phazon_torso", "/obj/item/mecha_parts/part", {
	name: "１Phazon torso",
	desc: "A Phazon torso part. The socket for the bluespace core that powers the exosuit's unique phase drives is located in the middle.",
	icon_state: "phazon_harness",
	origin_tech: "programming=4;materials=4;bluespace=4;plasmatech=5",
});
rt.type(9600, "/obj/item/mecha_parts/part/phazon_head", "/obj/item/mecha_parts/part", {
	name: "１Phazon head",
	desc: "A Phazon head. Its sensors are carefully calibrated to provide vision and data even when the exosuit is phasing.",
	icon_state: "phazon_head",
	origin_tech: "programming=3;materials=3;magnets=3",
});
rt.type(9601, "/obj/item/mecha_parts/part/phazon_left_arm", "/obj/item/mecha_parts/part", {
	name: "１Phazon left arm",
	desc: "A Phazon left arm. Several microtool arrays are located under the armor plating, which can be adjusted to the situation at hand.",
	icon_state: "phazon_l_arm",
	origin_tech: "materials=3;bluespace=3;magnets=3",
});
rt.type(9602, "/obj/item/mecha_parts/part/phazon_right_arm", "/obj/item/mecha_parts/part", {
	name: "１Phazon right arm",
	desc: "A Phazon right arm. Several microtool arrays are located under the armor plating, which can be adjusted to the situation at hand.",
	icon_state: "phazon_r_arm",
	origin_tech: "materials=3;bluespace=3;magnets=3",
});
rt.type(9603, "/obj/item/mecha_parts/part/phazon_left_leg", "/obj/item/mecha_parts/part", {
	name: "１Phazon left leg",
	desc: "A Phazon left leg. It contains the unique phase drives that allow the exosuit to phase through solid matter when engaged.",
	icon_state: "phazon_l_leg",
	origin_tech: "materials=3;bluespace=3;magnets=3",
});
rt.type(9604, "/obj/item/mecha_parts/part/phazon_right_leg", "/obj/item/mecha_parts/part", {
	name: "１Phazon right leg",
	desc: "A Phazon right leg. It contains the unique phase drives that allow the exosuit to phase through solid matter when engaged.",
	icon_state: "phazon_r_leg",
	origin_tech: "materials=3;bluespace=3;magnets=3",
});
rt.type(9605, "/obj/item/mecha_parts/part/phazon_armor", "/obj/item/mecha_parts/part", {
	name: "Phazon armor",
	desc: "Phazon armor plates. They are layered with plasma to protect the pilot from the stress of phasing and have unusual properties.",
	icon_state: "phazon_armor",
	origin_tech: "materials=4;bluespace=4;plasmatech=5",
});
rt.type(9661, "/obj/item/toy", "/obj/item", {
	throw_speed: 3,
	throw_range: 7,
	throwforce: 0,
	force: 0,
});
rt.type(9685, "/obj/item/toy/syndicateballoon", "/obj/item/toy", {
	throw_speed: 3,
	throw_range: 7,
	item_state: "syndballoon",
	w_class: 4,
	name: "syndicate balloon",
	desc: "There is a tag on the back that reads \"FUK NT!11!\".",
	throwforce: 0,
	force: 0,
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "syndballoon",
});
rt.type(9686, "/obj/item/toy/spinningtoy", "/obj/item/toy", {
	name: "gravitational singularity",
	desc: "\"Singulo\" brand spinning toy.",
	icon: rt.rsc("icons/obj/singularity.dmi"),
	icon_state: "singularity_s1",
});
rt.type(9688, "/obj/item/toy/ammo", "/obj/item/toy", {});
rt.type(9691, "/obj/item/toy/foamblade", "/obj/item/toy", {
	item_state: "arm_blade",
	attack_verb: null,
	w_class: 2,
	name: "foam armblade",
	desc: "it says \"Sternside Changs #1 fan\" on it. ",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "foamblade",
	resistance_flags: 4,
});
rt.type(9693, "/obj/item/toy/katana", "/obj/item/toy", {
	item_state: "katana",
	flags: 64,
	slot_flags: 1536,
	w_class: 3,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	name: "replica katana",
	desc: "Woefully underpowered in D20.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "katana",
	force: 5,
	throwforce: 5,
});
rt.type(9730, "/obj/item/toy/cattoy", "/obj/item/toy", {
	cooldown: 0,
	w_class: 2,
	name: "toy mouse",
	desc: "A colorful toy mouse!",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "toy_mouse",
	resistance_flags: 4,
});
rt.type(9769, "/obj/item/documents", "/obj/item", {
	item_state: "paper",
	w_class: 1,
	throw_range: 1,
	throw_speed: 1,
	pressure_resistance: 2,
	name: "secret documents",
	desc: "\"Top Secret\" documents.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "docs_generic",
	throwforce: 0,
	layer: 4,
	resistance_flags: 99,
});
rt.type(9770, "/obj/item/documents/nanotrasen", "/obj/item/documents", {
	desc: "\"Top Secret\" Nanotrasen documents, filled with complex diagrams and lists of names, dates and coordinates.",
	icon_state: "docs_verified",
});
rt.type(9771, "/obj/item/documents/syndicate", "/obj/item/documents", {
	desc: "\"Top Secret\" documents detailing sensitive Syndicate operational intelligence.",
});
rt.type(9772, "/obj/item/documents/syndicate/red", "/obj/item/documents/syndicate", {
	name: "red secret documents",
	desc: "\"Top Secret\" documents detailing sensitive Syndicate operational intelligence. These documents are verified with a red wax seal.",
	icon_state: "docs_red",
});
rt.type(9773, "/obj/item/documents/syndicate/blue", "/obj/item/documents/syndicate", {
	name: "blue secret documents",
	desc: "\"Top Secret\" documents detailing sensitive Syndicate operational intelligence. These documents are verified with a blue wax seal.",
	icon_state: "docs_blue",
});
rt.type(9774, "/obj/item/documents/syndicate/mining", "/obj/item/documents/syndicate", {
	desc: "\"Top Secret\" documents detailing Syndicate plasma mining operations.",
});
rt.type(9786, "/obj/item/trash", "/obj/item", {
	w_class: 1,
	icon: rt.rsc("icons/obj/janitor.dmi"),
	desc: "This is rubbish.",
	resistance_flags: 4,
});
rt.type(9787, "/obj/item/trash/raisins", "/obj/item/trash", {
	name: "１4no raisins",
	icon_state: "4no_raisins",
});
rt.type(9788, "/obj/item/trash/candy", "/obj/item/trash", {
	name: "candy",
	icon_state: "candy",
});
rt.type(9789, "/obj/item/trash/cheesie", "/obj/item/trash", {
	name: "cheesie honkers",
	icon_state: "cheesie_honkers",
});
rt.type(9790, "/obj/item/trash/chips", "/obj/item/trash", {
	name: "chips",
	icon_state: "chips",
});
rt.type(9791, "/obj/item/trash/popcorn", "/obj/item/trash", {
	name: "popcorn",
	icon_state: "popcorn",
});
rt.type(9792, "/obj/item/trash/sosjerky", "/obj/item/trash", {
	name: "１Scaredy's Private Reserve Beef Jerky",
	icon_state: "sosjerky",
});
rt.type(9793, "/obj/item/trash/syndi_cakes", "/obj/item/trash", {
	name: "syndi-cakes",
	icon_state: "syndi_cakes",
});
rt.type(9794, "/obj/item/trash/waffles", "/obj/item/trash", {
	name: "waffles tray",
	icon_state: "waffles",
});
rt.type(9795, "/obj/item/trash/plate", "/obj/item/trash", {
	name: "plate",
	icon_state: "plate",
	resistance_flags: 0,
});
rt.type(9796, "/obj/item/trash/pistachios", "/obj/item/trash", {
	name: "pistachios pack",
	icon_state: "pistachios_pack",
});
rt.type(9797, "/obj/item/trash/semki", "/obj/item/trash", {
	name: "semki pack",
	icon_state: "semki_pack",
});
rt.type(9798, "/obj/item/trash/tray", "/obj/item/trash", {
	name: "tray",
	icon_state: "tray",
	resistance_flags: 0,
});
rt.type(9799, "/obj/item/trash/candle", "/obj/item/trash", {
	name: "candle",
	icon: rt.rsc("icons/obj/candle.dmi"),
	icon_state: "candle4",
});
rt.type(9800, "/obj/item/trash/can", "/obj/item/trash", {
	name: "crushed can",
	icon_state: "cola",
	resistance_flags: 0,
});
rt.type(9802, "/obj/item/trash/deadmouse", "/obj/item/trash", {
	name: "dead mouse",
	desc: "It looks like somebody dropped the bass on it.",
	icon: rt.rsc("icons/mob/animal.dmi"),
	icon_state: "mouse_gray_dead",
});
rt.type(9803, "/obj/item/radio", "/obj/item", {});
rt.type(9806, "/obj/item/borg", "/obj/item", {
	icon: rt.rsc("icons/mob/robot_items.dmi"),
});
rt.type(9815, "/obj/item/borg/sight", "/obj/item/borg", {
	sight_mode: null,
});
rt.type(9816, "/obj/item/borg/sight/xray", "/obj/item/borg/sight", {
	sight_mode: 4,
	name: "０x-ray Vision",
	icon: rt.rsc("icons/obj/decals.dmi"),
	icon_state: "securearea",
});
rt.type(9817, "/obj/item/borg/sight/xray/truesight_lens", "/obj/item/borg/sight/xray", {
	name: "truesight lens",
	icon: rt.rsc("icons/obj/clockwork_objects.dmi"),
	icon_state: "truesight_lens",
});
rt.type(9818, "/obj/item/borg/sight/thermal", "/obj/item/borg/sight", {
	sight_mode: 2,
	name: "０thermal vision",
	icon_state: "thermal",
});
rt.type(9819, "/obj/item/borg/sight/meson", "/obj/item/borg/sight", {
	sight_mode: 1,
	name: "０meson vision",
	icon_state: "meson",
});
rt.type(9820, "/obj/item/borg/sight/material", "/obj/item/borg/sight", {
	sight_mode: 8,
	name: "０material vision",
	icon_state: "material",
});
rt.type(9821, "/obj/item/borg/sight/hud", "/obj/item/borg/sight", {
	hud: null,
	name: "hud",
});
rt.type(9862, "/obj/item/xenos_claw", "/obj/item", {
	origin_tech: null,
	name: "alien claw",
	desc: "The claw of a terrible creature.",
	icon: rt.rsc("icons/mob/alien.dmi"),
	icon_state: "claw",
});
rt.type(9863, "/obj/item/weed_extract", "/obj/item", {
	origin_tech: null,
	name: "weed extract",
	desc: "A piece of slimy, purplish weed.",
	icon: rt.rsc("icons/mob/alien.dmi"),
	icon_state: "weed_extract",
});
rt.type(9864, "/obj/item/storage", "/obj/item", {});
rt.type(9865, "/obj/item/storage/book", "/obj/item/storage", {});
rt.type(9866, "/obj/item/storage/book/bible", "/obj/item/storage/book", {});
rt.type(9867, "/obj/item/storage/book/bible/syndicate", "/obj/item/storage/book/bible", {});
rt.type(9868, "/obj/item/key", "/obj/item", {
	w_class: 1,
	name: "key",
	desc: "A small grey key.",
	icon: rt.rsc("icons/obj/vehicles.dmi"),
	icon_state: "key",
});
rt.type(9869, "/obj/item/key/displaycase", "/obj/item/key", {
	name: "display case key",
	desc: "The key to the curator's display cases.",
});
rt.type(9870, "/obj/item/key/janitor", "/obj/item/key", {
	desc: "A keyring with a small steel key, and a pink fob reading \"Pussy Wagon\".",
	icon_state: "keyjanitor",
});
rt.type(9871, "/obj/item/key/security", "/obj/item/key", {
	desc: "A keyring with a small steel key, and a rubber stun baton accessory.",
	icon_state: "keysec",
});
rt.type(9882, "/obj/item/assembly", "/obj/item", {});
rt.type(9973, "/obj/item/weaponcrafting", "/obj/item", {});
rt.type(9974, "/obj/item/weaponcrafting/receiver", "/obj/item/weaponcrafting", {
	name: "modular receiver",
	desc: "A prototype modular receiver and trigger assembly for a firearm.",
	icon: rt.rsc("icons/obj/improvised.dmi"),
	icon_state: "receiver",
});
rt.type(9975, "/obj/item/weaponcrafting/stock", "/obj/item/weaponcrafting", {
	name: "rifle stock",
	desc: "A classic rifle stock that doubles as a grip, roughly carved out of wood.",
	icon: rt.rsc("icons/obj/improvised.dmi"),
	icon_state: "riflestock",
});
rt.type(10115, "/obj/item/mushroom_bowl", "/obj/item", {
	w_class: 2,
	name: "mushroom bowl",
	desc: "A bowl made out of mushrooms. Not food, though it might have contained some at some point.",
	icon: rt.rsc("icons/obj/lavaland/ash_flora.dmi"),
	icon_state: "mushroom_bowl",
	resistance_flags: 4,
	obj_integrity: 200,
	max_integrity: 200,
});
rt.type(10131, "/obj/item/asteroid", "/obj/item", {});
rt.type(10133, "/obj/item/hand_labeler_refill", "/obj/item", {
	item_state: "electropack",
	w_class: 1,
	name: "hand labeler paper roll",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	desc: "A roll of paper. Use it on a hand labeler to refill it.",
	icon_state: "labeler_refill",
});
rt.type(10163, "/obj/item/spellpacket", "/obj/item", {});
rt.type(10204, "/obj/item/severedtail", "/obj/item", {
	markings: "Smooth",
	name: "tail",
	desc: "A severed tail. Somewhere, no doubt, a lizard hater is very pleased with themselves.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "severedtail",
	color: "#161",
});
rt.type(10205, "/obj/item/janiupgrade", "/obj/item", {
	origin_tech: "materials=3;engineering=4",
	name: "floor buffer upgrade",
	desc: "An upgrade for mobile janicarts.",
	icon: rt.rsc("icons/obj/vehicles.dmi"),
	icon_state: "upgrade",
});
rt.type(12470, "/obj/structure/flora", "/obj/structure", {
	anchored: 1,
	resistance_flags: 4,
	obj_integrity: 150,
	max_integrity: 150,
});
rt.type(12478, "/obj/structure/flora/grass", "/obj/structure/flora", {
	name: "grass",
	icon: rt.rsc("icons/obj/flora/snowflora.dmi"),
	gender: "plural",
});
rt.type(12549, "/obj/structure/gulag_beacon", "/obj/structure", {
	name: "labor camp bluespace beacon",
	desc: "A recieving beacon for bluespace teleportations.",
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "light_on-w",
});
rt.type(12751, "/obj/structure/festivus", "/obj/structure", {
	name: "festivus pole",
	icon: rt.rsc("icons/obj/flora/pinetrees.dmi"),
	icon_state: "festivus_pole",
	desc: "During last year's Feats of Strength the Research Director was able to suplex this passing immobile rod into a planter.",
});
rt.type(12926, "/obj/structure/c_transit_tube_pod", "/obj/structure", {
	anchored: 0,
	name: "unattached transit tube pod",
	icon: rt.rsc("icons/obj/atmospherics/pipes/transit_tube.dmi"),
	icon_state: "pod",
	density: 0,
});
rt.type(12928, "/obj/structure/artilleryplaceholder", "/obj/structure", {
	anchored: 1,
	name: "artillery",
	icon: rt.rsc("icons/obj/machines/artillery.dmi"),
	density: 1,
});
rt.type(12929, "/obj/structure/artilleryplaceholder/decorative", "/obj/structure/artilleryplaceholder", {
	density: 0,
});
rt.type(12961, "/obj/structure/tubes", "/obj/structure", {
	anchored: 1,
	icon_state: "tubes",
	icon: rt.rsc("icons/obj/lavaland/survival_pod.dmi"),
	name: "tubes",
	layer: 3.7,
	density: 0,
});
rt.type(13033, "/obj/structure/filler", "/obj/structure", {
	parent: null,
	anchored: 1,
	name: "big machinery part",
	density: 1,
	invisibility: 101,
});
