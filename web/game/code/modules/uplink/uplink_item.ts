// Based on /tg/station's code/modules/uplink/uplink_item.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// uplink_item.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobaluplink_items", function InitGlobaluplink_items(f: Frame) {
	GLOB.uplink_items = list();
	this.gvars_datum_init_order += "uplink_items";
	return f.dot;
});

// uplink_item.dm:4
rt.def("/proc/initialize_global_uplink_items", function* initialize_global_uplink_items(f: Frame) {
	let item: Value = null, I: Value = null;
	GLOB.uplink_items = list();
	for (item of each(typesof(T("/datum/uplink_item")) - T("/datum/uplink_item"))) {
		if (!(I = (yield* new_(item))).item) {
			continue;
		}
		if (!rt.index(GLOB.uplink_items, I.category)) {
			rt.setAt(GLOB.uplink_items, I.category, list());
		}
		rt.setAt(rt.index(GLOB.uplink_items, I.category), I.name, I);
	}
	return f.dot;
}, true);

// uplink_item.dm:14
rt.def("/proc/get_uplink_items", function* get_uplink_items(f: Frame, gamemode: Value) {
	let category: Value = null, item: Value = null, I: Value = null, i: Value = null, I_3: Value = null, A: Value = null, discount: Value = null, disclaimer: Value = null;
	let $e: any;
	if (!rt.len(f, GLOB.uplink_items)) {
		yield* initialize_global_uplink_items();
	}
	let filtered_uplink_items: Value = list();
	let sale_items: Value = list();
	for (category of each(GLOB.uplink_items)) {
		item = null;
		for (item of each(rt.index(GLOB.uplink_items, category))) {
			if (!rt.istype((I = rt.index(rt.index(GLOB.uplink_items, category), item)), T("/datum/uplink_item"))) {
				continue;
			}
			if (rt.len(f, I.include_modes)) {
				if (!gamemode && GLOB.SSticker && !rt.isIn(f, GLOB.SSticker.mode.type, I.include_modes)) {
					continue;
				}
				if (gamemode && !rt.isIn(f, gamemode, I.include_modes)) {
					continue;
				}
			}
			if (rt.len(f, I.exclude_modes)) {
				if (!gamemode && GLOB.SSticker && rt.isIn(f, GLOB.SSticker.mode.type, I.exclude_modes)) {
					continue;
				}
				if (gamemode && rt.isIn(f, gamemode, I.exclude_modes)) {
					continue;
				}
			}
			if (I.player_minimum && I.player_minimum > rt.len(f, GLOB.joined_player_list)) {
				continue;
			}
			if (!rt.index(filtered_uplink_items, category)) {
				rt.setAt(filtered_uplink_items, category, list());
			}
			rt.setAt(rt.index(filtered_uplink_items, category), item, I);
			if (I.limited_stock < 0 && !I.cant_discount && I.item && I.cost > 1) {
				sale_items += I;
			}
		}
	}
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		I_3 = pick_n_take(sale_items);
		A = (yield* new_(I_3.type));
		discount = A.get_discount();
		disclaimer = list("Void where prohibited.", "Not recommended for children.", "Contains small parts.", "Check local laws for legality in region.", "Do not taunt.", "Not responsible for direct, indirect, incidental or consequential damages resulting from any defect, error or failure to perform.", "Keep away from fire or flames.", "Product is provided \"as is\" without any implied or expressed warranties.", "As seen on TV.", "For recreational use only.", "Use only as directed.", "16% sales tax will be charged for orders originating within Space Nebraska.");
		A.limited_stock = 1;
		I_3.refundable = 0;
		A.refundable = 0;
		if (A.cost >= 20) {
			discount *= 0.5;
		}
		A.cost = max(round(A.cost * discount), 1);
		A.category = "Discounted Gear";
		A.name += ` (${round((rt.initial(f, A, "cost") - A.cost) / rt.initial(f, A, "cost") * 100)}% off!)`;
		A.desc += ` Normally costs ${rt.initial(f, A, "cost")} TC. All sales final. ${pick(disclaimer)}`;
		A.item = I_3.item;
		if (!rt.index(filtered_uplink_items, A.category)) {
			rt.setAt(filtered_uplink_items, A.category, list());
		}
		rt.setAt(rt.index(filtered_uplink_items, A.category), A.name, A);
	}
	rt.endFor(f, 0);
	return filtered_uplink_items;
}, true);

rt.type(4244, "/datum/uplink_item", "/datum", {
	name: "item name",
	category: "item category",
	desc: "item description",
	item: null,
	refund_path: null,
	cost: 0,
	refund_amount: 0,
	refundable: 0,
	surplus: 100,
	cant_discount: 0,
	limited_stock: -1,
	include_modes: null,
	exclude_modes: null,
	restricted_roles: null,
	player_minimum: null,
	purchase_log_vis: 1,
});

// uplink_item.dm:83
rt.def("/datum/uplink_item/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list();

	this.exclude_modes = list();

	this.restricted_roles = list();
	return f.dot;
});

// uplink_item.dm:90
rt.def("/datum/uplink_item/proc/get_discount", function get_discount(f: Frame) {
	return rt.op(f, "PickWeighted", [3], [4, 0.75, 2, 0.5, 1, 0.25]);
});

// uplink_item.dm:94
rt.def("/datum/uplink_item/proc/spawn_item", function* spawn_item(f: Frame, loc: Value, U: Value) {
	if (!this.item) return f.dot;
	return (yield* new_(this.item, loc));
}, true);

// uplink_item.dm:98
rt.def("/datum/uplink_item/proc/buy", function* buy(f: Frame, user: Value, U: Value) {
	let B: Value = null, I: Value = null, H: Value = null;
	if (!rt.istype(U, T("/obj/item/device/uplink"))) {
		return f.dot;
	}
	if (!user || user.incapacitated()) {
		return f.dot;
	}
	if (U.telecrystals < this.cost || this.limited_stock == 0) {
		return f.dot;
	} else {
		U.telecrystals -= this.cost;
		U.spent_telecrystals += this.cost;
	}
	let A: Value = (yield* this.spawn_item(rt.getStep(f, user, 0), U));
	if (rt.istype((B = A), T("/obj/item/weapon/storage/box")) && rt.len(f, B.contents) > 0) {
		for (I of each(B, T("/obj/item"))) {
			U.purchase_log += `<big>${bicon(I)}</big>`;
		}
	} else if (this.purchase_log_vis) {
		U.purchase_log += `<big>${bicon(A)}</big>`;
	}
	if (this.limited_stock > 0) {
		this.limited_stock -= 1;
	}
	if (rt.istype(user, T("/mob/living/carbon/human")) && rt.istype(A, T("/obj/item"))) {
		if (yield* (H = user).put_in_hands(A)) {
			to_chat(H, `${A} materializes into your hands!`);
		} else {
			to_chat(H, fmt("＄！ materializes onto the floor.", [A]));
		}
	}
	return 1;
}, true);

// uplink_item.dm:130
rt.def("/datum/uplink_item/proc/Destroy", function* Destroy(f: Frame) {
	if (rt.isIn(f, this, GLOB.uplink_items)) {
		GLOB.uplink_items -= this;
	}
	return (yield* parent_proc());
}, true);

rt.type(4246, "/datum/uplink_item/nukeoffer", "/datum/uplink_item", {
	category: "Special Offers",
	surplus: 0,
	include_modes: null,
	cant_discount: 1,
});

// uplink_item.dm:142
rt.def("/datum/uplink_item/nukeoffer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4256, "/datum/uplink_item/dangerous/shotgun", "/datum/uplink_item/dangerous", {
	name: "Bulldog Shotgun",
	desc: "A fully-loaded semi-automatic drum-fed shotgun. Compatible with all 12g rounds. Designed for close quarter anti-personnel engagements.",
	cost: 8,
	surplus: 40,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog"),
});

// uplink_item.dm:210
rt.def("/datum/uplink_item/dangerous/shotgun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4257, "/datum/uplink_item/dangerous/smg", "/datum/uplink_item/dangerous", {
	name: "C-20r Submachine Gun",
	desc: "A fully-loaded Scarborough Arms bullpup submachine gun. The C-20r fires .45 rounds with a 20-round magazine and is compatible with suppressors.",
	cost: 10,
	surplus: 40,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/c20r"),
});

// uplink_item.dm:219
rt.def("/datum/uplink_item/dangerous/smg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4258, "/datum/uplink_item/dangerous/smg/unrestricted", "/datum/uplink_item/dangerous/smg", {
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/c20r/unrestricted"),
});

// uplink_item.dm:223
rt.def("/datum/uplink_item/dangerous/smg/unrestricted/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4259, "/datum/uplink_item/dangerous/machinegun", "/datum/uplink_item/dangerous", {
	name: "L6 Squad Automatic Weapon",
	desc: "A fully-loaded Aussec Armoury belt-fed machine gun. This deadly weapon has a massive 50-round magazine of devastating 1.95x129mm ammunition.",
	cost: 18,
	surplus: 0,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/l6_saw"),
});

// uplink_item.dm:232
rt.def("/datum/uplink_item/dangerous/machinegun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4260, "/datum/uplink_item/dangerous/grenadier", "/datum/uplink_item/dangerous", {
	name: "Grenadier's belt",
	desc: "A belt of a large variety of lethally dangerous and destructive grenades.",
	include_modes: null,
	cost: 22,
	surplus: 0,
	item: rt.typePath("/obj/item/weapon/storage/belt/grenade/full"),
});

// uplink_item.dm:238
rt.def("/datum/uplink_item/dangerous/grenadier/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4261, "/datum/uplink_item/dangerous/sniper", "/datum/uplink_item/dangerous", {
	name: "Sniper Rifle",
	desc: "Ranged fury, Syndicate style. Guaranteed to cause shock and awe or your TC back!",
	cost: 16,
	surplus: 25,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle/syndicate"),
});

// uplink_item.dm:248
rt.def("/datum/uplink_item/dangerous/sniper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4262, "/datum/uplink_item/dangerous/bolt_action", "/datum/uplink_item/dangerous", {
	name: "Surplus Rifle",
	desc: "A horribly outdated bolt action weapon. You've got to be desperate to use this.",
	cost: 2,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/shotgun/boltaction"),
});

// uplink_item.dm:255
rt.def("/datum/uplink_item/dangerous/bolt_action/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4263, "/datum/uplink_item/dangerous/crossbow", "/datum/uplink_item/dangerous", {
	name: "Miniature Energy Crossbow",
	desc: "A short bow mounted across a tiller in miniature. Small enough to fit into a pocket or slip into a bag unnoticed. It will synthesize and fire bolts tipped with a paralyzing toxin that will briefly stun targets and cause them to slur as if inebriated. It can produce an infinite number of bolts, but takes time to automatically recharge after each shot.",
	cost: 12,
	surplus: 50,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow"),
});

// uplink_item.dm:268
rt.def("/datum/uplink_item/dangerous/crossbow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4264, "/datum/uplink_item/dangerous/flamethrower", "/datum/uplink_item/dangerous", {
	name: "Flamethrower",
	desc: "A flamethrower, fueled by a portion of highly flammable biotoxins stolen previously from Nanotrasen stations. Make a statement by roasting the filth in their own greed. Use with caution.",
	cost: 4,
	surplus: 40,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/flamethrower/full/tank"),
});

// uplink_item.dm:277
rt.def("/datum/uplink_item/dangerous/flamethrower/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4266, "/datum/uplink_item/dangerous/doublesword", "/datum/uplink_item/dangerous", {
	name: "Double-Bladed Energy Sword",
	desc: "The double-bladed energy sword does slightly more damage than a standard energy sword and will deflect all energy projectiles, but requires two hands to wield.",
	player_minimum: 25,
	cost: 16,
	item: rt.typePath("/obj/item/weapon/twohanded/dualsaber"),
});

// uplink_item.dm:295
rt.def("/datum/uplink_item/dangerous/doublesword/proc/get_discount", function get_discount(f: Frame) {
	return rt.op(f, "PickWeighted", [3], [4, 0.8, 2, 0.65, 1, 0.5]);
});

rt.type(4270, "/datum/uplink_item/dangerous/foamsmg", "/datum/uplink_item/dangerous", {
	name: "Toy Submachine Gun",
	desc: "A fully-loaded Donksoft bullpup submachine gun that fires riot grade rounds with a 20-round magazine.",
	cost: 5,
	surplus: 0,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/c20r/toy"),
});

// uplink_item.dm:326
rt.def("/datum/uplink_item/dangerous/foamsmg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4271, "/datum/uplink_item/dangerous/foammachinegun", "/datum/uplink_item/dangerous", {
	name: "Toy Machine Gun",
	desc: "A fully-loaded Donksoft belt-fed machine gun. This weapon has a massive 50-round magazine of devastating riot grade darts, that can briefly incapacitate someone in just one volley.",
	cost: 10,
	surplus: 0,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/l6_saw/toy"),
});

// uplink_item.dm:335
rt.def("/datum/uplink_item/dangerous/foammachinegun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4272, "/datum/uplink_item/dangerous/viscerators", "/datum/uplink_item/dangerous", {
	name: "Viscerator Delivery Grenade",
	desc: "A unique grenade that deploys a swarm of viscerators upon activation, which will chase down and shred any non-operatives in the area.",
	cost: 5,
	surplus: 35,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/grenade/spawnergrenade/manhacks"),
});

// uplink_item.dm:344
rt.def("/datum/uplink_item/dangerous/viscerators/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4273, "/datum/uplink_item/dangerous/bioterrorfoam", "/datum/uplink_item/dangerous", {
	name: "Chemical Foam Grenade",
	desc: "A powerful chemical foam grenade which creates a deadly torrent of foam that will mute, blind, confuse, mutate, and irritate carbon lifeforms. Specially brewed by Tiger Cooperative chemical weapons specialists using additional spore toxin. Ensure suit is sealed before use.",
	cost: 5,
	surplus: 35,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/grenade/chem_grenade/bioterrorfoam"),
});

// uplink_item.dm:354
rt.def("/datum/uplink_item/dangerous/bioterrorfoam/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4274, "/datum/uplink_item/dangerous/bioterror", "/datum/uplink_item/dangerous", {
	name: "Biohazardous Chemical Sprayer",
	desc: "A chemical sprayer that allows a wide dispersal of selected chemicals. Especially tailored by the Tiger Cooperative, the deadly blend it comes stocked with will disorient, damage, and disable your foes... Use with extreme caution, to prevent exposure to yourself and your fellow operatives.",
	cost: 20,
	surplus: 0,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/reagent_containers/spray/chemsprayer/bioterror"),
});

// uplink_item.dm:364
rt.def("/datum/uplink_item/dangerous/bioterror/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4276, "/datum/uplink_item/stealthy_weapons/virus_grenade", "/datum/uplink_item/stealthy_weapons", {
	name: "Fungal Tuberculosis Grenade",
	desc: "A primed bio-grenade packed into a compact box. Comes with five Bio Virus Antidote Kit (BVAK) autoinjectors for rapid application on up to two targets each, a syringe, and a bottle containing the BVAK solution.",
	cost: 12,
	surplus: 35,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/tuberculosisgrenade"),
});

// uplink_item.dm:374
rt.def("/datum/uplink_item/stealthy_weapons/virus_grenade/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4297, "/datum/uplink_item/ammo/bolt_action", "/datum/uplink_item/ammo", {
	name: "Surplus Rifle Clip",
	desc: "A stripper clip used to quickly load bolt action rifles. Contains 5 rounds.",
	cost: 1,
	include_modes: null,
	item: rt.typePath("/obj/item/ammo_box/a762"),
});

// uplink_item.dm:411
rt.def("/datum/uplink_item/ammo/bolt_action/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4299, "/datum/uplink_item/ammo/shotgun", "/datum/uplink_item/ammo", {
	cost: 2,
	include_modes: null,
});

// uplink_item.dm:422
rt.def("/datum/uplink_item/ammo/shotgun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4302, "/datum/uplink_item/ammo/shotgun/stun", "/datum/uplink_item/ammo/shotgun", {
	name: "12g Stun Slug Drum",
	desc: "An alternative 8-round stun slug magazine for use with the Bulldog shotgun. Saying that they're completely non-lethal would be lying.",
	include_modes: null,
	item: rt.typePath("/obj/item/ammo_box/magazine/m12g"),
});

// uplink_item.dm:441
rt.def("/datum/uplink_item/ammo/shotgun/stun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4303, "/datum/uplink_item/ammo/shotgun/dragon", "/datum/uplink_item/ammo/shotgun", {
	name: "12g Dragon's Breath Drum",
	desc: "An alternative 8-round dragon's breath magazine for use in the Bulldog shotgun. 'I'm a fire starter, twisted fire starter!'",
	include_modes: null,
	item: rt.typePath("/obj/item/ammo_box/magazine/m12g/dragon"),
});

// uplink_item.dm:448
rt.def("/datum/uplink_item/ammo/shotgun/dragon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4304, "/datum/uplink_item/ammo/shotgun/breach", "/datum/uplink_item/ammo/shotgun", {
	name: "12g Breaching Shells",
	desc: "An economic variant of the CMC meteorshot slugs, not as effective for knocking down targets, but still great for blasting airlocks off their frames.",
	include_modes: null,
	item: rt.typePath("/obj/item/ammo_box/magazine/m12g/breach"),
});

// uplink_item.dm:455
rt.def("/datum/uplink_item/ammo/shotgun/breach/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4306, "/datum/uplink_item/ammo/smg", "/datum/uplink_item/ammo", {
	name: ".45 SMG Magazine",
	desc: "An additional 20-round .45 magazine suitable for use with the C-20r submachine gun. These bullets pack a lot of punch that can knock most targets down, but do limited overall damage.",
	cost: 3,
	include_modes: null,
	item: rt.typePath("/obj/item/ammo_box/magazine/smgm45"),
});

// uplink_item.dm:469
rt.def("/datum/uplink_item/ammo/smg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4307, "/datum/uplink_item/ammo/smg/bag", "/datum/uplink_item/ammo/smg", {
	name: ".45 Ammo Duffel Bag",
	desc: "A duffel bag filled with enough .45 ammo to supply an entire team, at a discounted price.",
	cost: 20,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo/smg"),
});

// uplink_item.dm:476
rt.def("/datum/uplink_item/ammo/smg/bag/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4308, "/datum/uplink_item/ammo/machinegun", "/datum/uplink_item/ammo", {
	cost: 6,
	surplus: 0,
	include_modes: null,
});

// uplink_item.dm:481
rt.def("/datum/uplink_item/ammo/machinegun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4314, "/datum/uplink_item/ammo/sniper", "/datum/uplink_item/ammo", {
	cost: 4,
	include_modes: null,
});

// uplink_item.dm:515
rt.def("/datum/uplink_item/ammo/sniper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4320, "/datum/uplink_item/ammo/bioterror", "/datum/uplink_item/ammo", {
	name: "Box of Bioterror Syringes",
	desc: "A box full of preloaded syringes, containing various chemicals that seize up the victim's motor and broca systems, making it impossible for them to move or speak for some time.",
	cost: 6,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/bioterror"),
});

// uplink_item.dm:554
rt.def("/datum/uplink_item/ammo/bioterror/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4321, "/datum/uplink_item/support", "/datum/uplink_item", {
	category: "Support and Mechanized Exosuits",
	surplus: 0,
	include_modes: null,
});

// uplink_item.dm:560
rt.def("/datum/uplink_item/support/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4277, "/datum/uplink_item/stealthy_weapons/martialarts", "/datum/uplink_item/stealthy_weapons", {
	name: "Martial Arts Scroll",
	desc: "This scroll contains the secrets of an ancient martial arts technique. You will master unarmed combat, deflecting all ranged weapon fire, but you also refuse to use dishonorable ranged weaponry.",
	cost: 17,
	surplus: 0,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/sleeping_carp_scroll"),
});

// uplink_item.dm:610
rt.def("/datum/uplink_item/stealthy_weapons/martialarts/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4278, "/datum/uplink_item/stealthy_weapons/cqc", "/datum/uplink_item/stealthy_weapons", {
	name: "CQC Manual",
	desc: "A manual that teaches a single user tactical Close-Quarters Combat before self-destructing.",
	include_modes: null,
	cost: 13,
	surplus: 0,
	item: rt.typePath("/obj/item/weapon/cqc_manual"),
});

// uplink_item.dm:616
rt.def("/datum/uplink_item/stealthy_weapons/cqc/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4281, "/datum/uplink_item/stealthy_weapons/foampistol", "/datum/uplink_item/stealthy_weapons", {
	name: "Toy Gun with Riot Darts",
	desc: "An innocent-looking toy pistol designed to fire foam darts. Comes loaded with riot-grade darts effective at incapacitating a target.",
	cost: 3,
	surplus: 10,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/toy/pistol/riot"),
});

// uplink_item.dm:640
rt.def("/datum/uplink_item/stealthy_weapons/foampistol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4282, "/datum/uplink_item/stealthy_weapons/sleepy_pen", "/datum/uplink_item/stealthy_weapons", {
	name: "Sleepy Pen",
	desc: "A syringe disguised as a functional pen, filled with a potent mix of drugs, including a strong anesthetic and a chemical that prevents the target from speaking. The pen holds one dose of the mixture, and cannot be refilled. Note that before the target falls asleep, they will be able to move and act.",
	cost: 4,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/pen/sleepy"),
});

// uplink_item.dm:650
rt.def("/datum/uplink_item/stealthy_weapons/sleepy_pen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4285, "/datum/uplink_item/stealthy_weapons/romerol_kit", "/datum/uplink_item/stealthy_weapons", {
	name: "Romerol",
	desc: "A highly experimental bioterror agent which creates dormant nodules to be etched into the grey matter of the brain. On death, these nodules take control of the dead body, causing limited revivification, along with slurred speech, aggression, and the ability to infect others with this agent.",
	cost: 25,
	cant_discount: 1,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/romerol"),
});

// uplink_item.dm:673
rt.def("/datum/uplink_item/stealthy_weapons/romerol_kit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4328, "/datum/uplink_item/stealthy_tools/chameleon", "/datum/uplink_item/stealthy_tools", {
	name: "Chameleon Kit",
	desc: "A set of items that contain chameleon technology allowing you to disguise as pretty much anything on the station, and more!",
	cost: 4,
	exclude_modes: null,
	player_minimum: 20,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/chameleon"),
});

// uplink_item.dm:730
rt.def("/datum/uplink_item/stealthy_tools/chameleon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4329, "/datum/uplink_item/stealthy_tools/chameleon/nuke", "/datum/uplink_item/stealthy_tools/chameleon", {
	cost: 6,
	exclude_modes: null,
	include_modes: null,
});

// uplink_item.dm:735
rt.def("/datum/uplink_item/stealthy_tools/chameleon/nuke/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list();

	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4330, "/datum/uplink_item/stealthy_tools/syndigaloshes", "/datum/uplink_item/stealthy_tools", {
	name: "No-Slip Chameleon Shoes",
	desc: "These shoes will allow the wearer to run on wet floors and slippery objects without falling down. They do not work on heavily lubricated surfaces.",
	cost: 2,
	exclude_modes: null,
	player_minimum: 20,
	item: rt.typePath("/obj/item/clothing/shoes/chameleon"),
});

// uplink_item.dm:744
rt.def("/datum/uplink_item/stealthy_tools/syndigaloshes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4331, "/datum/uplink_item/stealthy_tools/syndigaloshes/nuke", "/datum/uplink_item/stealthy_tools/syndigaloshes", {
	name: "Stealthy No-Slip Chameleon Shoes",
	desc: "These shoes will allow the wearer to run on wet floors and slippery objects without falling down. They do not work on heavily lubricated surfaces. The manufacturer claims they are much more stealthy than the normal brand.",
	cost: 4,
	exclude_modes: null,
	include_modes: null,
	item: rt.typePath("/obj/item/clothing/shoes/chameleon"),
});

// uplink_item.dm:762
rt.def("/datum/uplink_item/stealthy_tools/syndigaloshes/nuke/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list();

	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4334, "/datum/uplink_item/stealthy_tools/chameleon_proj", "/datum/uplink_item/stealthy_tools", {
	name: "Chameleon Projector",
	desc: "Projects an image across a user, disguising them as an object scanned with it, as long as they don't move the projector from their hand. Disguised users move slowly, and projectiles pass over them.",
	cost: 7,
	exclude_modes: null,
	item: rt.typePath("/obj/item/device/chameleon"),
});

// uplink_item.dm:781
rt.def("/datum/uplink_item/stealthy_tools/chameleon_proj/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4338, "/datum/uplink_item/stealthy_tools/mulligan", "/datum/uplink_item/stealthy_tools", {
	name: "Mulligan",
	desc: "Screwed up and have security on your tail? This handy syringe will give you a completely new identity and appearance.",
	cost: 4,
	surplus: 30,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/reagent_containers/syringe/mulligan"),
});

// uplink_item.dm:815
rt.def("/datum/uplink_item/stealthy_tools/mulligan/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4342, "/datum/uplink_item/suits", "/datum/uplink_item", {
	category: "Space Suits and Hardsuits",
	exclude_modes: null,
	surplus: 40,
});

// uplink_item.dm:843
rt.def("/datum/uplink_item/suits/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4344, "/datum/uplink_item/suits/hardsuit", "/datum/uplink_item/suits", {
	name: "Syndicate Hardsuit",
	desc: "The feared suit of a syndicate nuclear agent. Features slightly better armoring and a built in jetpack that runs off standard atmospheric tanks. When the built in helmet is deployed your identity will be protected, even in death, as the suit cannot be removed by outside forces. Toggling the suit in and out of combat mode will allow you all the mobility of a loose fitting uniform without sacrificing armoring. Additionally the suit is collapsible, making it small enough to fit within a backpack. Nanotrasen crew who spot these suits are known to panic.",
	cost: 8,
	exclude_modes: null,
	item: rt.typePath("/obj/item/clothing/suit/space/hardsuit/syndi"),
});

// uplink_item.dm:864
rt.def("/datum/uplink_item/suits/hardsuit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4345, "/datum/uplink_item/suits/hardsuit/elite", "/datum/uplink_item/suits/hardsuit", {
	name: "Elite Syndicate Hardsuit",
	desc: "An upgraded, elite version of the syndicate hardsuit. It features fireproofing, and also provides the user with superior armor and mobility compared to the standard syndicate hardsuit.",
	cost: 8,
	include_modes: null,
	exclude_modes: null,
	item: rt.typePath("/obj/item/clothing/suit/space/hardsuit/syndi/elite"),
});

// uplink_item.dm:872
rt.def("/datum/uplink_item/suits/hardsuit/elite/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));

	this.exclude_modes = list();
	return f.dot;
});

rt.type(4346, "/datum/uplink_item/suits/hardsuit/shielded", "/datum/uplink_item/suits/hardsuit", {
	name: "Shielded Syndicate Hardsuit",
	desc: "An upgraded version of the standard syndicate hardsuit. It features a built-in energy shielding system. The shields can handle up to three impacts within a short duration and will rapidly recharge while not under fire.",
	cost: 30,
	include_modes: null,
	exclude_modes: null,
	item: rt.typePath("/obj/item/clothing/suit/space/hardsuit/shielded/syndi"),
});

// uplink_item.dm:881
rt.def("/datum/uplink_item/suits/hardsuit/shielded/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));

	this.exclude_modes = list();
	return f.dot;
});

rt.type(4348, "/datum/uplink_item/device_tools/emag", "/datum/uplink_item/device_tools", {
	name: "Cryptographic Sequencer",
	desc: "The cryptographic sequencer, electromagnetic card, or emag, is a small card that unlocks hidden functions in electronic devices, subverts intended functions, and easily breaks security mechanisms.",
	cost: 6,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/card/emag"),
});

// uplink_item.dm:894
rt.def("/datum/uplink_item/device_tools/emag/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4351, "/datum/uplink_item/device_tools/military_belt", "/datum/uplink_item/device_tools", {
	name: "Chest Rig",
	desc: "A robust seven-slot set of webbing that is capable of holding all manner of tactical equipment.",
	cost: 1,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/belt/military"),
});

// uplink_item.dm:915
rt.def("/datum/uplink_item/device_tools/military_belt/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4352, "/datum/uplink_item/device_tools/medkit", "/datum/uplink_item/device_tools", {
	name: "Syndicate Combat Medic Kit",
	desc: "This first aid kit is a suspicious brown and red. Included is a combat stimulant injector for rapid healing, a medical HUD for quick identification of injured personnel, and other supplies helpful for a field medic.",
	cost: 4,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/firstaid/tactical"),
});

// uplink_item.dm:924
rt.def("/datum/uplink_item/device_tools/medkit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4359, "/datum/uplink_item/device_tools/briefcase_launchpad", "/datum/uplink_item/device_tools", {
	name: "Briefcase Launchpad",
	desc: "A briefcase containing a launchpad, a device able to teleport items and people to and from targets up to three tiles away from the briefcase. Also includes a remote control. Touch the briefcase with the remote to link it.",
	surplus: 0,
	cost: 6,
	item: rt.typePath("/obj/item/briefcase_launchpad"),
});

// uplink_item.dm:984
rt.def("/datum/uplink_item/device_tools/briefcase_launchpad/proc/buy", function* buy(f: Frame, user: Value, U: Value) {
	let H: Value = null;
	let L: Value = (yield* new_(T("/obj/item/device/launchpad_remote"), rt.getStep(f, user, 0)));
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if (yield* (H = user).put_in_hands(L)) {
			to_chat(H, `${L} materializes into your hands!`);
		} else {
			to_chat(H, fmt("＄！ materializes onto the floor.", [L]));
		}
	}
	return (yield* parent_proc());
}, true);

rt.type(4360, "/datum/uplink_item/device_tools/magboots", "/datum/uplink_item/device_tools", {
	name: "Blood-Red Magboots",
	desc: "A pair of magnetic boots with a Syndicate paintjob that assist with freer movement in space or on-station during gravitational generator failures. These reverse-engineered knockoffs of Nanotrasen's 'Advanced Magboots' slow you down in simulated-gravity environments much like the standard issue variety.",
	cost: 2,
	include_modes: null,
	item: rt.typePath("/obj/item/clothing/shoes/magboots/syndie"),
});

// uplink_item.dm:1000
rt.def("/datum/uplink_item/device_tools/magboots/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4365, "/datum/uplink_item/device_tools/singularity_beacon", "/datum/uplink_item/device_tools", {
	name: "Power Beacon",
	desc: "When screwed to wiring attached to an electric grid and activated, this large device pulls any active gravitational singularities or tesla balls towards it. This will not work when the engine is still in containment. Because of its size, it cannot be carried. Ordering this sends you a small beacon that will teleport the larger beacon to your location upon activation.",
	cost: 14,
	exclude_modes: null,
	item: rt.typePath("/obj/item/device/sbeacondrop"),
});

// uplink_item.dm:1041
rt.def("/datum/uplink_item/device_tools/singularity_beacon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4367, "/datum/uplink_item/device_tools/syndicate_detonator", "/datum/uplink_item/device_tools", {
	name: "Syndicate Detonator",
	desc: "The Syndicate detonator is a companion device to the Syndicate bomb. Simply press the included button and an encrypted radio frequency will instruct all live Syndicate bombs to detonate. Useful for when speed matters or you wish to synchronize multiple bomb blasts. Be sure to stand clear of the blast radius before using the detonator.",
	cost: 3,
	include_modes: null,
	item: rt.typePath("/obj/item/device/syndicatedetonator"),
});

// uplink_item.dm:1061
rt.def("/datum/uplink_item/device_tools/syndicate_detonator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4369, "/datum/uplink_item/device_tools/assault_pod", "/datum/uplink_item/device_tools", {
	name: "Assault Pod Targeting Device",
	desc: "Use to select the landing zone of your assault pod.",
	cost: 30,
	surplus: 0,
	include_modes: null,
	item: rt.typePath("/obj/item/device/assault_pod"),
});

// uplink_item.dm:1078
rt.def("/datum/uplink_item/device_tools/assault_pod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4370, "/datum/uplink_item/device_tools/shield", "/datum/uplink_item/device_tools", {
	name: "Energy Shield",
	desc: "An incredibly useful personal shield projector, capable of reflecting energy projectiles and defending against other attacks. Pair with an Energy Sword for a killer combination.",
	cost: 16,
	surplus: 20,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/shield/energy"),
});

// uplink_item.dm:1087
rt.def("/datum/uplink_item/device_tools/shield/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4371, "/datum/uplink_item/device_tools/medgun", "/datum/uplink_item/device_tools", {
	name: "Medbeam Gun",
	desc: "A wonder of Syndicate engineering, the Medbeam gun, or Medi-Gun enables a medic to keep his fellow operatives in the fight, even while under fire.",
	cost: 15,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/gun/medbeam"),
});

// uplink_item.dm:1095
rt.def("/datum/uplink_item/device_tools/medgun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4372, "/datum/uplink_item/device_tools/potion", "/datum/uplink_item/device_tools", {
	name: "Sentience Potion",
	desc: "A potion recovered at great risk by undercover syndicate operatives. Using it will make any animal sentient, and bound to serve you.",
	cost: 4,
	include_modes: null,
	item: rt.typePath("/obj/item/slimepotion/sentience"),
});

// uplink_item.dm:1102
rt.def("/datum/uplink_item/device_tools/potion/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4377, "/datum/uplink_item/device_tools/codespeak_manual", "/datum/uplink_item/device_tools", {
	name: "Codespeak Manual",
	desc: "Syndicate agents can be trained to use a series of codewords to convey complex information, which sounds like random concepts and drinks to anyone listening. This manual teaches you this Codespeak. You can also hit someone else with the manual in order to teach them. One use.",
	cost: 2,
	exclude_modes: null,
	item: rt.typePath("/obj/item/weapon/codespeak_manual"),
});

// uplink_item.dm:1138
rt.def("/datum/uplink_item/device_tools/codespeak_manual/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4378, "/datum/uplink_item/device_tools/codespeak_manual_deluxe", "/datum/uplink_item/device_tools", {
	name: "Deluxe Codespeak Manual",
	desc: "Syndicate agents can be trained to use a series of codewords to convey complex information, which sounds like random concepts and drinks to anyone listening. This manual teaches you this Codespeak. You can also hit someone else with the manual in order to teach them. This is the deluxe edition, which has unlimited uses.",
	cost: 8,
	include_modes: null,
});

// uplink_item.dm:1144
rt.def("/datum/uplink_item/device_tools/codespeak_manual_deluxe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4384, "/datum/uplink_item/implants/microbomb", "/datum/uplink_item/implants", {
	name: "Microbomb Implant",
	desc: "An implant injected into the body, and later activated either manually or automatically upon death. The more implants inside of you, the higher the explosive power. This will permanently destroy your body, however.",
	cost: 2,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/imp_microbomb"),
});

// uplink_item.dm:1188
rt.def("/datum/uplink_item/implants/microbomb/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4385, "/datum/uplink_item/implants/macrobomb", "/datum/uplink_item/implants", {
	name: "Macrobomb Implant",
	desc: "An implant injected into the body, and later activated either manually or automatically upon death. Upon death, releases a massive explosion that will wipe out everything nearby.",
	cost: 20,
	include_modes: null,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/imp_macrobomb"),
});

// uplink_item.dm:1196
rt.def("/datum/uplink_item/implants/macrobomb/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4386, "/datum/uplink_item/cyber_implants", "/datum/uplink_item", {
	category: "Cybernetic Implants",
	surplus: 0,
	include_modes: null,
});

// uplink_item.dm:1203
rt.def("/datum/uplink_item/cyber_implants/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.include_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

// uplink_item.dm:1207
rt.def("/datum/uplink_item/cyber_implants/proc/spawn_item", function* spawn_item(f: Frame, loc: Value, U: Value) {
	if (!this.item) return f.dot;
	if (rt.istype(this.item, T("/obj/item/organ"))) {
		return (yield* new_(T("/obj/item/weapon/storage/box/cyber_implants"), loc, this.item));
	}
	return (yield* parent_proc());
}, true);

rt.type(4392, "/datum/uplink_item/role_restricted", "/datum/uplink_item", {
	category: "Role-Restricted",
	exclude_modes: null,
	surplus: 0,
});

// uplink_item.dm:1248
rt.def("/datum/uplink_item/role_restricted/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/nuclear"));
	return f.dot;
});

rt.type(4393, "/datum/uplink_item/role_restricted/reverse_revolver", "/datum/uplink_item/role_restricted", {
	name: "Reverse Revolver",
	desc: "A revolver that always fires at its user. \"Accidentally\" drop your weapon, then watch as the greedy corporate pigs blow their own brains all over the wall. The revolver itself is actually real. Only clumsy people, and clowns, can fire it normally. Comes in a box of hugs. Honk.",
	cost: 14,
	restricted_roles: null,
	item: rt.typePath("/obj/item/weapon/storage/box/hug/reverse_revolver"),
});

// uplink_item.dm:1257
rt.def("/datum/uplink_item/role_restricted/reverse_revolver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_roles = list("Clown");
	return f.dot;
});

rt.type(4394, "/datum/uplink_item/role_restricted/mimery", "/datum/uplink_item/role_restricted", {
	name: "Guide to Advanced Mimery Series",
	desc: "The classical two part series on how to further hone your mime skills. Upon studying the series, the user should be able to make 3x1 invisible walls, and shoot bullets out of their fingers. Obviously only works for Mimes.",
	cost: 12,
	restricted_roles: null,
	surplus: 0,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/mimery"),
});

// uplink_item.dm:1264
rt.def("/datum/uplink_item/role_restricted/mimery/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_roles = list("Mime");
	return f.dot;
});

rt.type(4395, "/datum/uplink_item/role_restricted/ez_clean_bundle", "/datum/uplink_item/role_restricted", {
	name: "EZ Clean Grenade Bundle",
	desc: "A box with three cleaner grenades using the trademark Waffle Co. formula. Serves as a cleaner and causes acid damage to anyone standing nearby. The acid only affects carbon-based creatures.",
	cost: 6,
	surplus: 20,
	restricted_roles: null,
	item: rt.typePath("/obj/item/weapon/storage/box/syndie_kit/ez_clean"),
});

// uplink_item.dm:1273
rt.def("/datum/uplink_item/role_restricted/ez_clean_bundle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_roles = list("Janitor");
	return f.dot;
});

rt.type(4396, "/datum/uplink_item/role_restricted/his_grace", "/datum/uplink_item/role_restricted", {
	name: "His Grace",
	desc: "An incredibly dangerous weapon recovered from a station overcome by the grey tide. Once activated, He will thirst for blood and must be used to kill to sate that thirst. His Grace grants gradual regeneration and complete stun immunity to His wielder, but be wary: if He gets too hungry, He will become impossible to drop and eventually kill you if not fed. However, if left alone for long enough, He will fall back to slumber. To activate His Grace, simply unlatch Him.",
	cost: 20,
	restricted_roles: null,
	surplus: 5,
	item: rt.typePath("/obj/item/weapon/his_grace"),
});

// uplink_item.dm:1283
rt.def("/datum/uplink_item/role_restricted/his_grace/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_roles = list("Chaplain");
	return f.dot;
});

rt.type(4397, "/datum/uplink_item/role_restricted/pie_cannon", "/datum/uplink_item/role_restricted", {
	name: "Banana Cream Pie Cannon",
	desc: "A special pie cannon for a special clown, this gadget can hold up to 20 pies and automatically fabricates one every two seconds!",
	cost: 10,
	restricted_roles: null,
	surplus: 0,
	item: rt.typePath("/obj/item/weapon/pneumatic_cannon/pie/selfcharge"),
});

// uplink_item.dm:1291
rt.def("/datum/uplink_item/role_restricted/pie_cannon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_roles = list("Clown");
	return f.dot;
});

rt.type(4398, "/datum/uplink_item/role_restricted/ancient_jumpsuit", "/datum/uplink_item/role_restricted", {
	name: "Ancient Jumpsuit",
	desc: "A tattered old jumpsuit that will provide absolutely no benefit to you. It fills the wearer with a strange compulsion to blurt out 'glorf'.",
	cost: 20,
	restricted_roles: null,
	surplus: 0,
	item: rt.typePath("/obj/item/clothing/under/color/grey/glorf"),
});

// uplink_item.dm:1299
rt.def("/datum/uplink_item/role_restricted/ancient_jumpsuit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_roles = list("Assistant");
	return f.dot;
});

rt.type(4399, "/datum/uplink_item/role_restricted/haunted_magic_eightball", "/datum/uplink_item/role_restricted", {
	name: "Haunted Magic Eightball",
	desc: "Most magic eightballs are toys with dice inside. Although identical in appearance to the harmless toys, this occult device reaches into the spirit world to find its answers. Be warned, that spirits are often capricious or just little assholes. To use, simply speak your question aloud, then begin shaking.",
	cost: 2,
	restricted_roles: null,
	limited_stock: 1,
	item: rt.typePath("/obj/item/toy/eightball/haunted"),
});

// uplink_item.dm:1307
rt.def("/datum/uplink_item/role_restricted/haunted_magic_eightball/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_roles = list("Curator");
	return f.dot;
});

rt.type(4401, "/datum/uplink_item/role_restricted/pressure_mod", "/datum/uplink_item/role_restricted", {
	name: "Kinetic Accelerator Pressure Mod",
	desc: "A modification kit which allows Kinetic Accelerators to do greatly increased damage while indoors. Occupies 35% mod capacity.",
	cost: 5,
	limited_stock: 2,
	restricted_roles: null,
	item: rt.typePath("/obj/item/borg/upgrade/modkit/indoors"),
});

// uplink_item.dm:1323
rt.def("/datum/uplink_item/role_restricted/pressure_mod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_roles = list("Shaft Miner");
	return f.dot;
});

rt.type(4407, "/datum/uplink_item/badass/bundle", "/datum/uplink_item/badass", {
	name: "Syndicate Bundle",
	desc: "Syndicate Bundles are specialized groups of items that arrive in a plain box. These items are collectively worth more than 20 telecrystals, but you do not know which specialization you will receive.",
	cost: 20,
	exclude_modes: null,
	cant_discount: 1,
	item: rt.typePath("/obj/item/weapon/storage/box/syndicate"),
});

// uplink_item.dm:1368
rt.def("/datum/uplink_item/badass/bundle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang"));
	return f.dot;
});

rt.type(4408, "/datum/uplink_item/badass/surplus", "/datum/uplink_item/badass", {
	name: "Syndicate Surplus Crate",
	desc: "A dusty crate from the back of the Syndicate warehouse. Rumored to contain a valuable assortment of items, but you never know. Contents are sorted to always be worth 50 TC.",
	cost: 20,
	player_minimum: 25,
	exclude_modes: null,
	cant_discount: 1,
	item: rt.typePath("/obj/structure/closet/crate"),
});

// uplink_item.dm:1378
rt.def("/datum/uplink_item/badass/surplus/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exclude_modes = list(T("/datum/game_mode/nuclear"), T("/datum/game_mode/gang"));
	return f.dot;
});

// uplink_item.dm:1382
rt.def("/datum/uplink_item/badass/surplus/proc/spawn_item", function* spawn_item(f: Frame, loc: Value, U: Value) {
	let category: Value = null, item: Value = null, I: Value = null;
	let uplink_items: Value = (yield* get_uplink_items(GLOB.SSticker.mode));
	let crate_value: Value = 50;
	let C: Value = (yield* new_(T("/obj/structure/closet/crate"), loc));
	while (crate_value) {
		category = pick(uplink_items);
		item = pick(rt.index(uplink_items, category));
		if (!(I = rt.index(rt.index(uplink_items, category), item)).surplus || prob(100 - I.surplus)) {
			continue;
		}
		if (crate_value < I.cost) {
			continue;
		}
		crate_value -= I.cost;
		yield* new_(I.item, C);
		U.purchase_log += `<big>${bicon(I.item)}</big>`;
	}
	return C;
}, true);

rt.type(4409, "/datum/uplink_item/badass/random", "/datum/uplink_item/badass", {
	name: "Random Item",
	desc: "Picking this will purchase a random item. Useful if you have some TC to spare or if you haven't decided on a strategy yet.",
	cost: 0,
	cant_discount: 1,
	item: rt.typePath("/obj/item/weapon/paper"),
});

// uplink_item.dm:1410
rt.def("/datum/uplink_item/badass/random/proc/spawn_item", function* spawn_item(f: Frame, loc: Value, U: Value) {
	let category: Value = null, item: Value = null, I: Value = null;
	let uplink_items: Value = (yield* get_uplink_items(GLOB.SSticker.mode));
	let possible_items: Value = list();
	for (category of each(uplink_items)) {
		item = null;
		for (item of each(rt.index(uplink_items, category))) {
			I = rt.index(rt.index(uplink_items, category), item);
			if (this == I || !I.item) {
				continue;
			}
			if (U.telecrystals < I.cost) {
				continue;
			}
			possible_items += I;
		}
	}
	if (!rt.len(f, possible_items)) return f.dot;
	let I_2: Value = pick(possible_items);
	U.telecrystals -= I_2.cost;
	U.spent_telecrystals += I_2.cost;
	return (yield* new_(I_2.item, loc));
}, true);
