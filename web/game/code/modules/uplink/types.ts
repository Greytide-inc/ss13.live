// Types declared in code/modules/uplink that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(4245, "/datum/uplink_item/discounts", "/datum/uplink_item", {
	category: "Discounted Gear",
});
rt.type(4247, "/datum/uplink_item/nukeoffer/c20r", "/datum/uplink_item/nukeoffer", {
	name: "C-20r bundle",
	desc: "Old faithful: The classic C-20r, bundled with two magazines, and a (surplus) suppressor at discount price.",
	cost: 14,
	item: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/syndie/c20rbundle"),
});
rt.type(4248, "/datum/uplink_item/nukeoffer/bulldog", "/datum/uplink_item/nukeoffer", {
	name: "Bulldog bundle",
	desc: "Lean and mean: Optimised for people that want to get up close and personal. Contains the popular Bulldog shotgun, two 12g drums, and a pair of Thermal imaging goggles.",
	cost: 13,
	item: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/syndie/bulldogbundle"),
});
rt.type(4249, "/datum/uplink_item/nukeoffer/medical", "/datum/uplink_item/nukeoffer", {
	name: "Medical bundle",
	desc: "The support specialist: Aid your fellow operatives with this medical bundle. Contains a Donksoft machine gun, a box of ammo, and a pair of magboots to rescue your friends in no-gravity environments.",
	cost: 15,
	item: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/syndie/med/medicalbundle"),
});
rt.type(4250, "/datum/uplink_item/nukeoffer/sniper", "/datum/uplink_item/nukeoffer", {
	name: "Sniper bundle",
	desc: "Elegant and refined: Contains a collapsed sniper rifle in an expensive carrying case, a hollow-point haemorrhage magazine, a soporific knockout magazine, a free surplus supressor, and a worn out suit and tie.",
	cost: 20,
	item: rt.typePath("/obj/item/weapon/storage/briefcase/sniperbundle"),
});
rt.type(4251, "/datum/uplink_item/nukeoffer/chemical", "/datum/uplink_item/nukeoffer", {
	name: "Bioterror bundle",
	desc: "For the madman: Contains Bioterror spray, Bioterror grenade, chemicals, syringe gun, box of syringes,Donksoft assault rifle, and some darts. Remember: Seal suit and equip internals before use.",
	cost: 30,
	item: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/syndie/med/bioterrorbundle"),
});
rt.type(4252, "/datum/uplink_item/nukeoffer/firestarter", "/datum/uplink_item/nukeoffer", {
	name: "Spetsnaz Pyro bundle",
	desc: "For systematic suppression of carbon lifeforms in close range: Contains a specialist Pyrotechnic equipment, foreign pistol, two magazines, a pipebomb, and a stimulant syringe.",
	cost: 30,
	item: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/syndie/firestarter"),
});
rt.type(4253, "/datum/uplink_item/dangerous", "/datum/uplink_item", {
	category: "Conspicuous and Dangerous Weapons",
});
rt.type(4254, "/datum/uplink_item/dangerous/pistol", "/datum/uplink_item/dangerous", {
	name: "Stechkin Pistol",
	desc: "A small, easily concealable handgun that uses 10mm auto rounds in 8-round magazines and is compatible with suppressors.",
	cost: 7,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/pistol"),
});
rt.type(4255, "/datum/uplink_item/dangerous/revolver", "/datum/uplink_item/dangerous", {
	name: "Syndicate Revolver",
	desc: "A brutally simple syndicate revolver that fires .357 Magnum rounds and has 7 chambers.",
	cost: 13,
	surplus: 50,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/revolver"),
});
rt.type(4265, "/datum/uplink_item/dangerous/sword", "/datum/uplink_item/dangerous", {
	name: "Energy Sword",
	desc: "The energy sword is an edged weapon with a blade of pure energy. The sword is small enough to be pocketed when inactive. Activating it produces a loud, distinctive noise.",
	cost: 8,
	item: rt.typePath("/obj/item/weapon/melee/energy/sword/saber"),
});
rt.type(4267, "/datum/uplink_item/dangerous/powerfist", "/datum/uplink_item/dangerous", {
	name: "Power Fist",
	desc: "The power-fist is a metal gauntlet with a built-in piston-ram powered by an external gas supply.Upon hitting a target, the piston-ram will extend forward to make contact for some serious damage. Using a wrench on the piston valve will allow you to tweak the amount of gas used per punch to deal extra damage and hit targets further. Use a screwdriver to take out any attached tanks.",
	cost: 8,
	item: rt.typePath("/obj/item/weapon/melee/powerfist"),
});
rt.type(4268, "/datum/uplink_item/dangerous/emp", "/datum/uplink_item/dangerous", {
	name: "EMP Grenades and Implanter Kit",
	desc: "A box that contains two EMP grenades and an EMP implant. Useful to disrupt communication, security's energy weapons, and silicon lifeforms when you're in a tight spot.",
	cost: 2,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/emp"),
});
rt.type(4269, "/datum/uplink_item/dangerous/syndicate_minibomb", "/datum/uplink_item/dangerous", {
	name: "Syndicate Minibomb",
	desc: "The minibomb is a grenade with a five-second fuse. Upon detonation, it will create a small hull breach in addition to dealing high amounts of damage to nearby personnel.",
	cost: 6,
	item: rt.typePath("/obj/item/weapon/grenade/syndieminibomb"),
});
rt.type(4275, "/datum/uplink_item/stealthy_weapons", "/datum/uplink_item", {
	category: "Stealthy and Inconspicuous Weapons",
});
rt.type(4279, "/datum/uplink_item/stealthy_weapons/throwingweapons", "/datum/uplink_item/stealthy_weapons", {
	name: "Box of Throwing Weapons",
	desc: "A box of shurikens and reinforced bolas from ancient Earth martial arts. They are highly effective throwing weapons. The bolas can knock a target down and the shurikens will embed into limbs.",
	cost: 3,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/throwing_weapons"),
});
rt.type(4280, "/datum/uplink_item/stealthy_weapons/edagger", "/datum/uplink_item/stealthy_weapons", {
	name: "Energy Dagger",
	desc: "A dagger made of energy that looks and functions as a pen when off.",
	cost: 2,
	item: rt.typePath("/obj/item/weapon/pen/edagger"),
});
rt.type(4283, "/datum/uplink_item/stealthy_weapons/soap", "/datum/uplink_item/stealthy_weapons", {
	name: "Syndicate Soap",
	desc: "A sinister-looking surfactant used to clean blood stains to hide murders and prevent DNA analysis. You can also drop it underfoot to slip people.",
	cost: 1,
	surplus: 50,
	item: rt.typePath("/obj/item/weapon/soap/syndie"),
});
rt.type(4284, "/datum/uplink_item/stealthy_weapons/traitor_chem_bottle", "/datum/uplink_item/stealthy_weapons", {
	name: "Poison Kit",
	desc: "An assortment of deadly chemicals packed into a compact box. Comes with a syringe for more precise application.",
	cost: 6,
	surplus: 50,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/chemical"),
});
rt.type(4286, "/datum/uplink_item/stealthy_weapons/dart_pistol", "/datum/uplink_item/stealthy_weapons", {
	name: "Dart Pistol",
	desc: "A miniaturized version of a normal syringe gun. It is very quiet when fired and can fit into any space a small item can.",
	cost: 4,
	surplus: 50,
	item: rt.typePath("/obj/item/weapon/gun/syringe/syndicate"),
});
rt.type(4287, "/datum/uplink_item/stealthy_weapons/detomatix", "/datum/uplink_item/stealthy_weapons", {
	name: "Detomatix PDA Cartridge",
	desc: "When inserted into a personal digital assistant, this cartridge gives you four opportunities to detonate PDAs of crewmembers who have their message feature enabled. The concussive effect from the explosion will knock the recipient out for a short period, and deafen them for longer. Beware, it has a chance to detonate your PDA.",
	cost: 6,
	item: rt.typePath("/obj/item/weapon/cartridge/virus/syndicate"),
});
rt.type(4288, "/datum/uplink_item/stealthy_weapons/suppressor", "/datum/uplink_item/stealthy_weapons", {
	name: "Universal Suppressor",
	desc: "Fitted for use on any small caliber weapon with a threaded barrel, this suppressor will silence the shots of the weapon for increased stealth and superior ambushing capability.",
	cost: 3,
	surplus: 10,
	item: rt.typePath("/obj/item/weapon/suppressor"),
});
rt.type(4289, "/datum/uplink_item/stealthy_weapons/pizza_bomb", "/datum/uplink_item/stealthy_weapons", {
	name: "Pizza Bomb",
	desc: "A pizza box with a bomb cunningly attached to the lid. The timer needs to be set by opening the box; afterwards, opening the box again will trigger the detonation after the timer has elapsed. Comes with free pizza, for you or your target!",
	cost: 6,
	surplus: 8,
	item: rt.typePath("/obj/item/pizzabox/bomb"),
});
rt.type(4290, "/datum/uplink_item/stealthy_weapons/dehy_carp", "/datum/uplink_item/stealthy_weapons", {
	name: "Dehydrated Space Carp",
	desc: "Looks like a plush toy carp, but just add water and it becomes a real-life space carp! Activate in your hand before use so it knows not to kill you.",
	cost: 1,
	item: rt.typePath("/obj/item/toy/carpplushie/dehy_carp"),
});
rt.type(4291, "/datum/uplink_item/stealthy_weapons/soap_clusterbang", "/datum/uplink_item/stealthy_weapons", {
	name: "Slipocalypse Clusterbang",
	desc: "A traditional clusterbang grenade with a payload consisting entirely of Syndicate soap. Useful in any scenario!",
	cost: 6,
	item: rt.typePath("/obj/item/weapon/grenade/clusterbuster/soap"),
});
rt.type(4292, "/datum/uplink_item/ammo", "/datum/uplink_item", {
	category: "Ammunition",
	surplus: 40,
});
rt.type(4293, "/datum/uplink_item/ammo/pistol", "/datum/uplink_item/ammo", {
	name: "10mm Handgun Magazine",
	desc: "An additional 8-round 10mm magazine; compatible with the Stechkin Pistol. These rounds are dirt cheap but are half as effective as .357 rounds.",
	cost: 1,
	item: rt.typePath("/obj/item/ammo_box/magazine/m10mm"),
});
rt.type(4294, "/datum/uplink_item/ammo/pistolap", "/datum/uplink_item/ammo", {
	name: "10mm Armour Piercing Magazine",
	desc: "An additional 8-round 10mm magazine; compatible with the Stechkin Pistol. These rounds are less effective at injuring the target but penetrate protective gear.",
	cost: 2,
	item: rt.typePath("/obj/item/ammo_box/magazine/m10mm/ap"),
});
rt.type(4295, "/datum/uplink_item/ammo/pistolfire", "/datum/uplink_item/ammo", {
	name: "10mm Incendiary Magazine",
	desc: "An additional 8-round 10mm magazine; compatible with the Stechkin Pistol. Loaded with incendiary rounds which ignite the target.",
	cost: 2,
	item: rt.typePath("/obj/item/ammo_box/magazine/m10mm/fire"),
});
rt.type(4296, "/datum/uplink_item/ammo/pistolhp", "/datum/uplink_item/ammo", {
	name: "10mm Hollow Point Magazine",
	desc: "An additional 8-round 10mm magazine; compatible with the Stechkin Pistol. These rounds are more damaging but ineffective against armour.",
	cost: 3,
	item: rt.typePath("/obj/item/ammo_box/magazine/m10mm/hp"),
});
rt.type(4298, "/datum/uplink_item/ammo/revolver", "/datum/uplink_item/ammo", {
	name: ".357 Speed Loader",
	desc: "A speed loader that contains seven additional .357 Magnum rounds; usable with the Syndicate revolver. For when you really need a lot of things dead.",
	cost: 4,
	item: rt.typePath("/obj/item/ammo_box/a357"),
});
rt.type(4300, "/datum/uplink_item/ammo/shotgun/buck", "/datum/uplink_item/ammo/shotgun", {
	name: "12g Buckshot Drum",
	desc: "An additional 8-round buckshot magazine for use with the Bulldog shotgun. Front towards enemy.",
	item: rt.typePath("/obj/item/ammo_box/magazine/m12g/buckshot"),
});
rt.type(4301, "/datum/uplink_item/ammo/shotgun/slug", "/datum/uplink_item/ammo/shotgun", {
	name: "12g Slug Drum",
	desc: "An additional 8-round slug magazine for use with the Bulldog shotgun. Now 8 times less likely to shoot your pals.",
	cost: 3,
	item: rt.typePath("/obj/item/ammo_box/magazine/m12g/slug"),
});
rt.type(4305, "/datum/uplink_item/ammo/shotgun/bag", "/datum/uplink_item/ammo/shotgun", {
	name: "12g Ammo Duffel Bag",
	desc: "A duffel bag filled with enough 12g ammo to supply an entire team, at a discounted price.",
	cost: 12,
	item: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo/shotgun"),
});
rt.type(4309, "/datum/uplink_item/ammo/machinegun/basic", "/datum/uplink_item/ammo/machinegun", {
	name: "1.95x129mm Box Magazine",
	desc: "A 50-round magazine of 1.95x129mm ammunition for use with the L6 SAW. By the time you need to use this, you'll already be on a pile of corpses.",
	item: rt.typePath("/obj/item/ammo_box/magazine/mm195x129"),
});
rt.type(4310, "/datum/uplink_item/ammo/machinegun/bleeding", "/datum/uplink_item/ammo/machinegun", {
	name: "1.95x129mm (Bleeding) Box Magazine",
	desc: "A 50-round magazine of 1.95x129mm ammunition for use in the L6 SAW; equipped with special properties to induce internal bleeding on targets.",
	item: rt.typePath("/obj/item/ammo_box/magazine/mm195x129/bleeding"),
});
rt.type(4311, "/datum/uplink_item/ammo/machinegun/hollow", "/datum/uplink_item/ammo/machinegun", {
	name: "1.95x129mm (Hollow-Point) Box Magazine",
	desc: "A 50-round magazine of 1.95x129mm ammunition for use in the L6 SAW; equipped with hollow-point tips to help with the unarmored masses of crew.",
	item: rt.typePath("/obj/item/ammo_box/magazine/mm195x129/hollow"),
});
rt.type(4312, "/datum/uplink_item/ammo/machinegun/ap", "/datum/uplink_item/ammo/machinegun", {
	name: "1.95x129mm (Armor Penetrating) Box Magazine",
	desc: "A 50-round magazine of 1.95x129mm ammunition for use in the L6 SAW; equipped with special properties to puncture even the most durable armor.",
	item: rt.typePath("/obj/item/ammo_box/magazine/mm195x129/ap"),
});
rt.type(4313, "/datum/uplink_item/ammo/machinegun/incen", "/datum/uplink_item/ammo/machinegun", {
	name: "1.95x129mm (Incendiary) Box Magazine",
	desc: "A 50-round magazine of 1.95x129mm ammunition for use in the L6 SAW; tipped with a special flammable mixture that'll ignite anyone struck by the bullet. Some men just want to watch the world burn.",
	item: rt.typePath("/obj/item/ammo_box/magazine/mm195x129/incen"),
});
rt.type(4315, "/datum/uplink_item/ammo/sniper/basic", "/datum/uplink_item/ammo/sniper", {
	name: ".50 Magazine",
	desc: "An additional standard 6-round magazine for use with .50 sniper rifles.",
	item: rt.typePath("/obj/item/ammo_box/magazine/sniper_rounds"),
});
rt.type(4316, "/datum/uplink_item/ammo/sniper/soporific", "/datum/uplink_item/ammo/sniper", {
	name: ".50 Soporific Magazine",
	desc: "A 3-round magazine of soporific ammo designed for use with .50 sniper rifles. Put your enemies to sleep today!",
	cost: 6,
	item: rt.typePath("/obj/item/ammo_box/magazine/sniper_rounds/soporific"),
});
rt.type(4317, "/datum/uplink_item/ammo/sniper/haemorrhage", "/datum/uplink_item/ammo/sniper", {
	name: ".50 Haemorrhage Magazine",
	desc: "A 5-round magazine of haemorrhage ammo designed for use with .50 sniper rifles; causes heavy bleeding in the target.",
	item: rt.typePath("/obj/item/ammo_box/magazine/sniper_rounds/haemorrhage"),
});
rt.type(4318, "/datum/uplink_item/ammo/sniper/penetrator", "/datum/uplink_item/ammo/sniper", {
	name: ".50 Penetrator Magazine",
	desc: "A 5-round magazine of penetrator ammo designed for use with .50 sniper rifles. Can pierce walls and multiple enemies.",
	cost: 5,
	item: rt.typePath("/obj/item/ammo_box/magazine/sniper_rounds/penetrator"),
});
rt.type(4319, "/datum/uplink_item/ammo/toydarts", "/datum/uplink_item/ammo", {
	name: "Box of Riot Darts",
	desc: "A box of 40 Donksoft foam riot darts, for reloading any compatible foam dart gun. Don't forget to share!",
	cost: 2,
	surplus: 0,
	item: rt.typePath("/obj/item/ammo_box/foambox/riot"),
});
rt.type(4322, "/datum/uplink_item/support/reinforcement", "/datum/uplink_item/support", {
	name: "Reinforcements",
	desc: "Call in an additional team member. They won't come with any gear, so you'll have to save some telecrystals to arm them as well.",
	cost: 25,
	refundable: 1,
	item: rt.typePath("/obj/item/weapon/antag_spawner/nuke_ops"),
});
rt.type(4323, "/datum/uplink_item/support/reinforcement/assault_borg", "/datum/uplink_item/support/reinforcement", {
	name: "Syndicate Assault Cyborg",
	desc: "A cyborg designed and programmed for systematic extermination of non-Syndicate personnel.",
	refundable: 1,
	cost: 65,
	item: rt.typePath("/obj/item/weapon/antag_spawner/nuke_ops/borg_tele/assault"),
});
rt.type(4324, "/datum/uplink_item/support/reinforcement/medical_borg", "/datum/uplink_item/support/reinforcement", {
	name: "Syndicate Medical Cyborg",
	desc: "A combat medic cyborg, with potent healing reagents and a medical beam gun, but limited offensive potential.",
	refundable: 1,
	cost: 35,
	item: rt.typePath("/obj/item/weapon/antag_spawner/nuke_ops/borg_tele/medical"),
});
rt.type(4325, "/datum/uplink_item/support/gygax", "/datum/uplink_item/support", {
	name: "Gygax Exosuit",
	desc: "A lightweight exosuit, painted in a dark scheme. Its speed and equipment selection make it excellent for hit-and-run style attacks. This model lacks a method of space propulsion, and therefore it is advised to utilize the drop pod if you wish to make use of it.",
	cost: 80,
	item: rt.typePath("/obj/mecha/combat/gygax/dark/loaded"),
});
rt.type(4326, "/datum/uplink_item/support/mauler", "/datum/uplink_item/support", {
	name: "Mauler Exosuit",
	desc: "A massive and incredibly deadly military-grade exosuit. Features long-range targeting, thrust vectoring, and deployable smoke.",
	cost: 140,
	item: rt.typePath("/obj/mecha/combat/marauder/mauler/loaded"),
});
rt.type(4327, "/datum/uplink_item/stealthy_tools", "/datum/uplink_item", {
	category: "Stealth and Camouflage Items",
});
rt.type(4332, "/datum/uplink_item/stealthy_tools/frame", "/datum/uplink_item/stealthy_tools", {
	name: "F.R.A.M.E. PDA Cartridge",
	desc: "When inserted into a personal digital assistant, this cartridge gives you five PDA viruses which when used cause the targeted PDA to become a new uplink with zero TCs, and immediately become unlocked.  You will receive the unlock code upon activating the virus, and the new uplink may be charged with telecrystals normally.",
	cost: 4,
	item: rt.typePath("/obj/item/weapon/cartridge/virus/frame"),
});
rt.type(4333, "/datum/uplink_item/stealthy_tools/agent_card", "/datum/uplink_item/stealthy_tools", {
	name: "Agent Identification Card",
	desc: "Agent cards prevent artificial intelligences from tracking the wearer, and can copy access from other identification cards. The access is cumulative, so scanning one card does not erase the access gained from another. In addition, they can be forged to display a new assignment and name. This can be done an unlimited amount of times. Some Syndicate areas and devices can only be accessed with these cards.",
	cost: 2,
	item: rt.typePath("/obj/item/weapon/card/id/syndicate"),
});
rt.type(4335, "/datum/uplink_item/stealthy_tools/camera_bug", "/datum/uplink_item/stealthy_tools", {
	name: "Camera Bug",
	desc: "Enables you to view all cameras on the network and track a target. Bugging cameras allows you to disable them remotely.",
	cost: 1,
	surplus: 90,
	item: rt.typePath("/obj/item/device/camera_bug"),
});
rt.type(4336, "/datum/uplink_item/stealthy_tools/smugglersatchel", "/datum/uplink_item/stealthy_tools", {
	name: "Smuggler's Satchel",
	desc: "This satchel is thin enough to be hidden in the gap between plating and tiling; great for stashing your stolen goods. Comes with a crowbar and a floor tile inside. Properly hidden satchels have been known to survive intact even beyond the current shift. ",
	cost: 2,
	surplus: 30,
	item: rt.typePath("/obj/item/weapon/storage/backpack/satchel/flat"),
});
rt.type(4337, "/datum/uplink_item/stealthy_tools/stimpack", "/datum/uplink_item/stealthy_tools", {
	name: "Stimpack",
	desc: "Stimpacks, the tool of many great heroes, make you nearly immune to stuns and knockdowns for about 5 minutes after injection.",
	cost: 5,
	surplus: 90,
	item: rt.typePath("/obj/item/weapon/reagent_containers/syringe/stimulants"),
});
rt.type(4339, "/datum/uplink_item/stealthy_tools/emplight", "/datum/uplink_item/stealthy_tools", {
	name: "EMP Flashlight",
	desc: "A small, self-charging, short-ranged EMP device disguised as a flashlight. Useful for disrupting headsets, cameras, and borgs during stealth operations.",
	cost: 2,
	surplus: 30,
	item: rt.typePath("/obj/item/device/flashlight/emp"),
});
rt.type(4340, "/datum/uplink_item/stealthy_tools/cutouts", "/datum/uplink_item/stealthy_tools", {
	name: "Adaptive Cardboard Cutouts",
	desc: "These cardboard cutouts are coated with a thin material that prevents discoloration and makes the images on them appear more lifelike. This pack contains three as well as a crayon for changing their appearances.",
	cost: 1,
	surplus: 20,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/cutouts"),
});
rt.type(4341, "/datum/uplink_item/stealthy_tools/fakenucleardisk", "/datum/uplink_item/stealthy_tools", {
	name: "Decoy Nuclear Authentication Disk",
	desc: "It's just a normal disk. Visually it's identical to the real deal, but it won't hold up under closer scrutiny. Don't try to give this to us to complete your objective, we know better!",
	cost: 1,
	surplus: 1,
	item: rt.typePath("/obj/item/weapon/disk/fakenucleardisk"),
});
rt.type(4343, "/datum/uplink_item/suits/space_suit", "/datum/uplink_item/suits", {
	name: "Syndicate Space Suit",
	desc: "This red and black syndicate space suit is less encumbering than Nanotrasen variants, fits inside bags, and has a weapon slot. Nanotrasen crew members are trained to report red space suit sightings, however.",
	cost: 4,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/space"),
});
rt.type(4347, "/datum/uplink_item/device_tools", "/datum/uplink_item", {
	category: "Devices and Tools",
});
rt.type(4349, "/datum/uplink_item/device_tools/toolbox", "/datum/uplink_item/device_tools", {
	name: "Full Syndicate Toolbox",
	desc: "The syndicate toolbox is a suspicious black and red. It comes loaded with a full tool set including a multitool and combat gloves that are resistant to shocks and heat.",
	cost: 1,
	item: rt.typePath("/obj/item/weapon/storage/toolbox/syndicate"),
});
rt.type(4350, "/datum/uplink_item/device_tools/surgerybag", "/datum/uplink_item/device_tools", {
	name: "Syndicate Surgery Duffel Bag",
	desc: "The Syndicate surgery duffel bag is a toolkit containing all surgery tools, surgical drapes, a Syndicate brand MMI, a straitjacket, and a muzzle.",
	cost: 3,
	item: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/syndie/surgery"),
});
rt.type(4353, "/datum/uplink_item/device_tools/syndietome", "/datum/uplink_item/device_tools", {
	name: "Syndicate Tome",
	desc: "Using rare artifacts acquired at great cost, the syndicate has reverse engineered the seemingly magical books of a certain cult. Though lacking the esoteric abilities of the originals, these inferior copies are still quite useful, being able to provide both weal and woe on the battlefield, even if they do occasionally bite off a finger.",
	cost: 9,
	item: rt.typePath("/obj/item/weapon/storage/book/bible/syndicate"),
});
rt.type(4354, "/datum/uplink_item/device_tools/thermal", "/datum/uplink_item/device_tools", {
	name: "Thermal Imaging Glasses",
	desc: "These goggles can be turned to resemble common eyewear found throughout the station. They allow you to see organisms through walls by capturing the upper portion of the infrared light spectrum, emitted as heat and light by objects. Hotter objects, such as warm bodies, cybernetic organisms and artificial intelligence cores emit more of this light than cooler objects like walls and airlocks.",
	cost: 4,
	item: rt.typePath("/obj/item/clothing/glasses/thermal/syndi"),
});
rt.type(4355, "/datum/uplink_item/device_tools/binary", "/datum/uplink_item/device_tools", {
	name: "Binary Translator Key",
	desc: "A key that, when inserted into a radio headset, allows you to listen to and talk with silicon-based lifeforms, such as AI units and cyborgs, over their private binary channel. Caution should be taken while doing this, as unless they are allied with you, they are programmed to report such intrusions.",
	cost: 5,
	surplus: 75,
	item: rt.typePath("/obj/item/device/encryptionkey/binary"),
});
rt.type(4356, "/datum/uplink_item/device_tools/encryptionkey", "/datum/uplink_item/device_tools", {
	name: "Syndicate Encryption Key",
	desc: "A key that, when inserted into a radio headset, allows you to listen to all station department channels as well as talk on an encrypted Syndicate channel with other agents that have the same key.",
	cost: 2,
	surplus: 75,
	item: rt.typePath("/obj/item/device/encryptionkey/syndicate"),
});
rt.type(4357, "/datum/uplink_item/device_tools/ai_detector", "/datum/uplink_item/device_tools", {
	name: "Artificial Intelligence Detector",
	desc: "A functional multitool that turns red when it detects an artificial intelligence watching it or its holder. Knowing when an artificial intelligence is watching you is useful for knowing when to maintain cover.",
	cost: 1,
	item: rt.typePath("/obj/item/device/multitool/ai_detect"),
});
rt.type(4358, "/datum/uplink_item/device_tools/hacked_module", "/datum/uplink_item/device_tools", {
	name: "Hacked AI Law Upload Module",
	desc: "When used with an upload console, this module allows you to upload priority laws to an artificial intelligence. Be careful with wording, as artificial intelligences may look for loopholes to exploit.",
	cost: 14,
	item: rt.typePath("/obj/item/weapon/aiModule/syndicate"),
});
rt.type(4361, "/datum/uplink_item/device_tools/c4", "/datum/uplink_item/device_tools", {
	name: "Composition C-4",
	desc: "C-4 is plastic explosive of the common variety Composition C. You can use it to breach walls, sabotage equipment, or connect an assembly to it in order to alter the way it detonates. It has a modifiable timer with a minimum setting of 10 seconds.",
	cost: 1,
	item: rt.typePath("/obj/item/weapon/grenade/plastic/c4"),
});
rt.type(4362, "/datum/uplink_item/device_tools/c4bag", "/datum/uplink_item/device_tools", {
	name: "Bag of C-4 explosives",
	desc: "Because sometimes quantity is quality. Contains 10 C-4 plastic explosives.",
	cost: 9,
	cant_discount: 1,
	item: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/syndie/c4"),
});
rt.type(4363, "/datum/uplink_item/device_tools/x4bag", "/datum/uplink_item/device_tools", {
	name: "Bag of X-4 explosives",
	desc: "Contains 3 X-4 plastic explosives. Similar, but more powerful than C-4. X-4 can be placed on a solid surface, such as a wall or window, and it will blast through the wall, injuring anything on the opposite side, while being safer to the user. For when you want a wider, deeper, hole.",
	cost: 4,
	cant_discount: 1,
	item: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/syndie/x4"),
});
rt.type(4364, "/datum/uplink_item/device_tools/powersink", "/datum/uplink_item/device_tools", {
	name: "Power Sink",
	desc: "When screwed to wiring attached to a power grid and activated, this large device places excessive load on the grid, causing a station-wide blackout. The sink is large and cannot be stored in most traditional bags and boxes.",
	cost: 6,
	item: rt.typePath("/obj/item/device/powersink"),
});
rt.type(4366, "/datum/uplink_item/device_tools/syndicate_bomb", "/datum/uplink_item/device_tools", {
	name: "Syndicate Bomb",
	desc: "The Syndicate bomb is a fearsome device capable of massive destruction. It has an adjustable timer, with a minimum of 60 seconds, and can be bolted to the floor with a wrench to prevent movement. The bomb is bulky and cannot be moved; upon ordering this item, a smaller beacon will be transported to you that will teleport the actual bomb to it upon activation. Note that this bomb can be defused, and some crew may attempt to do so.",
	cost: 11,
	item: rt.typePath("/obj/item/device/sbeacondrop/bomb"),
});
rt.type(4368, "/datum/uplink_item/device_tools/rad_laser", "/datum/uplink_item/device_tools", {
	name: "Radioactive Microlaser",
	desc: "A radioactive microlaser disguised as a standard Nanotrasen health analyzer. When used, it emits a powerful burst of radiation, which, after a short delay, can incapacitate all but the most protected of humanoids. It has two settings: intensity, which controls the power of the radiation, and wavelength, which controls how long the radiation delay is.",
	cost: 3,
	item: rt.typePath("/obj/item/device/healthanalyzer/rad_laser"),
});
rt.type(4373, "/datum/uplink_item/device_tools/telecrystal", "/datum/uplink_item/device_tools", {
	name: "Raw Telecrystal",
	desc: "A telecrystal in its rawest and purest form; can be utilized on active uplinks to increase their telecrystal count.",
	cost: 1,
	surplus: 0,
	cant_discount: 1,
	purchase_log_vis: 0,
	item: rt.typePath("/obj/item/stack/telecrystal"),
});
rt.type(4374, "/datum/uplink_item/device_tools/telecrystal/five", "/datum/uplink_item/device_tools/telecrystal", {
	name: "5 Raw Telecrystals",
	desc: "Five telecrystals in their rawest and purest form; can be utilized on active uplinks to increase their telecrystal count.",
	cost: 5,
	item: rt.typePath("/obj/item/stack/telecrystal/five"),
});
rt.type(4375, "/datum/uplink_item/device_tools/telecrystal/twenty", "/datum/uplink_item/device_tools/telecrystal", {
	name: "20 Raw Telecrystals",
	desc: "Twenty telecrystals in their rawest and purest form; can be utilized on active uplinks to increase their telecrystal count.",
	cost: 20,
	item: rt.typePath("/obj/item/stack/telecrystal/twenty"),
});
rt.type(4376, "/datum/uplink_item/device_tools/jammer", "/datum/uplink_item/device_tools", {
	name: "Radio Jammer",
	desc: "This device will disrupt any nearby outgoing radio communication when activated.",
	cost: 5,
	item: rt.typePath("/obj/item/device/jammer"),
});
rt.type(4379, "/datum/uplink_item/implants", "/datum/uplink_item", {
	category: "Implants",
	surplus: 50,
});
rt.type(4380, "/datum/uplink_item/implants/freedom", "/datum/uplink_item/implants", {
	name: "Freedom Implant",
	desc: "An implant injected into the body and later activated at the user's will. It will attempt to free the user from common restraints such as handcuffs.",
	cost: 5,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/imp_freedom"),
});
rt.type(4381, "/datum/uplink_item/implants/uplink", "/datum/uplink_item/implants", {
	name: "Uplink Implant",
	desc: "An implant injected into the body, and later activated at the user's will. Has no telecrystals, must be charged by the use of physical telecrystals. Undetectable (except via surgery), and excellent for escaping confinement.",
	cost: 4,
	surplus: 0,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/imp_uplink"),
});
rt.type(4382, "/datum/uplink_item/implants/adrenal", "/datum/uplink_item/implants", {
	name: "Adrenal Implant",
	desc: "An implant injected into the body, and later activated at the user's will. It will inject a chemical cocktail which has a mild healing effect along with removing all stuns and increasing movement speed.",
	cost: 8,
	player_minimum: 25,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/imp_adrenal"),
});
rt.type(4383, "/datum/uplink_item/implants/storage", "/datum/uplink_item/implants", {
	name: "Storage Implant",
	desc: "An implant injected into the body, and later activated at the user's will. It will open a small subspace pocket capable of storing two items.",
	cost: 8,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/imp_storage"),
});
rt.type(4387, "/datum/uplink_item/cyber_implants/thermals", "/datum/uplink_item/cyber_implants", {
	name: "Thermal Eyes",
	desc: "These cybernetic eyes will give you thermal vision. Comes with a free autosurgeon.",
	cost: 8,
	item: rt.typePath("/obj/item/device/autosurgeon/thermal_eyes"),
});
rt.type(4388, "/datum/uplink_item/cyber_implants/xray", "/datum/uplink_item/cyber_implants", {
	name: "X-Ray Vision Implant",
	desc: "These cybernetic eyes will give you X-ray vision. Comes with an autosurgeon.",
	cost: 10,
	item: rt.typePath("/obj/item/device/autosurgeon/xray_eyes"),
});
rt.type(4389, "/datum/uplink_item/cyber_implants/antistun", "/datum/uplink_item/cyber_implants", {
	name: "CNS Rebooter Implant",
	desc: "This implant will help you get back up on your feet faster after being stunned. Comes with an autosurgeon.",
	cost: 12,
	item: rt.typePath("/obj/item/device/autosurgeon/anti_stun"),
});
rt.type(4390, "/datum/uplink_item/cyber_implants/reviver", "/datum/uplink_item/cyber_implants", {
	name: "Reviver Implant",
	desc: "This implant will attempt to revive you if you lose consciousness. Comes with an autosurgeon.",
	cost: 8,
	item: rt.typePath("/obj/item/device/autosurgeon/reviver"),
});
rt.type(4391, "/datum/uplink_item/cyber_implants/bundle", "/datum/uplink_item/cyber_implants", {
	name: "Cybernetic Implants Bundle",
	desc: "A random selection of cybernetic implants. Guaranteed 5 high quality implants. Comes with an autosurgeon.",
	cost: 40,
	cant_discount: 1,
	item: rt.typePath("/obj/item/weapon/storage/box/cyber_implants"),
});
rt.type(4400, "/datum/uplink_item/role_restricted/modified_syringe_gun", "/datum/uplink_item/role_restricted", {
	name: "Modified Syringe Gun",
	desc: "A syringe gun that fires DNA injectors instead of normal syringes.",
	cost: 14,
	restricted_roles: null,
	item: rt.typePath("/obj/item/weapon/gun/syringe/dna"),
});
rt.type(4402, "/datum/uplink_item/badass", "/datum/uplink_item", {
	category: "(Pointless) Badassery",
	surplus: 0,
});
rt.type(4403, "/datum/uplink_item/badass/syndiecards", "/datum/uplink_item/badass", {
	name: "Syndicate Playing Cards",
	desc: "A special deck of space-grade playing cards with a mono-molecular edge and metal reinforcement, making them slightly more robust than a normal deck of cards. You can also play card games with them or leave them on your victims.",
	cost: 1,
	surplus: 40,
	item: rt.typePath("/obj/item/toy/cards/deck/syndicate"),
});
rt.type(4404, "/datum/uplink_item/badass/syndiecash", "/datum/uplink_item/badass", {
	name: "Syndicate Briefcase Full of Cash",
	desc: "A secure briefcase containing 5000 space credits. Useful for bribing personnel, or purchasing goods and services at lucrative prices. The briefcase also feels a little heavier to hold; it has been manufactured to pack a little bit more of a punch if your client needs some convincing.",
	cost: 1,
	item: rt.typePath("/obj/item/weapon/storage/secure/briefcase/syndie"),
});
rt.type(4405, "/datum/uplink_item/badass/syndiecigs", "/datum/uplink_item/badass", {
	name: "Syndicate Smokes",
	desc: "Strong flavor, dense smoke, infused with omnizine.",
	cost: 2,
	item: rt.typePath("/obj/item/weapon/storage/fancy/cigarettes/cigpack_syndicate"),
});
rt.type(4406, "/datum/uplink_item/badass/balloon", "/datum/uplink_item/badass", {
	name: "Syndicate Balloon",
	desc: "For showing that you are THE BOSS: A useless red balloon with the Syndicate logo on it. Can blow the deepest of covers.",
	cost: 20,
	cant_discount: 1,
	item: rt.typePath("/obj/item/toy/syndicateballoon"),
});
