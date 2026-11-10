// Based on /tg/station's code/game/objects/items/weapons/storage/backpack.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5447, "/obj/item/weapon/storage/backpack/holding", "/obj/item/weapon/storage/backpack", {
	pshoom: rt.rsc("sound/items/pshoom.ogg"),
	alt_sound: rt.rsc("sound/items/pshoom_2.ogg"),
	name: "bag of holding",
	desc: "A backpack that opens into a localized pocket of Blue Space.",
	origin_tech: "bluespace=5;materials=4;engineering=4;plasmatech=5",
	icon_state: "holdingpack",
	item_state: "holdingpack",
	max_w_class: 6,
	max_combined_w_class: 35,
	resistance_flags: 2,
	armor: null,
});

// backpack.dm:44
rt.def("/obj/item/weapon/storage/backpack/holding/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 60, "acid", 50]);
	return f.dot;
});

// backpack.dm:48
rt.def("/obj/item/weapon/storage/backpack/holding/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is jumping into ${this}! It looks like ${user.p_theyre()} trying to commit suicide.</span>`);
	yield* user.drop_item();
	yield* user.Stun(100, { ignore_canstun: 1 });
	yield* sleep(20);
	playsound(this, "rustle", 50, 1, -5);
	yield* qdel(user);
	return f.dot;
}, true);

// backpack.dm:57
rt.def("/obj/item/weapon/storage/backpack/holding/proc/content_can_dump", function* content_can_dump(f: Frame, dest_object: Value, user: Value) {
	if (this.Adjacent(user)) {
		if (get_dist(user, dest_object) < 8) {
			if (yield* dest_object.storage_contents_dump_act(this, user)) {
				if (this.alt_sound && prob(1)) {
					playsound(this, this.alt_sound, 40, 1);
				} else {
					playsound(this, this.pshoom, 40, 1);
				}
				yield* user.Beam(dest_object, { icon_state: "rped_upgrade", time: 5 });
				return 1;
			}
		}
		to_chat(user, `The ${this.name} buzzes.`);
		playsound(this, rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 0);
	}
	return 0;
}, true);

// backpack.dm:71
rt.def("/obj/item/weapon/storage/backpack/holding/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	let safety: Value = null, singulo: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (rt.istype(f.args[0], T("/obj/item/weapon/storage/backpack/holding")) || count_by_type(f.args[0].GetAllContents(), T("/obj/item/weapon/storage/backpack/holding"))) {
		if ((safety = (yield* alert(f.args[2], "Doing this will have extremely dire consequences for the station and its crew. Be sure you know what you're doing.", `Put in ${this.name}?`, "Proceed", "Abort"))) == "Abort" || !(get_dist(this, f.args[2]) <= 1) || !this || !f.args[0] || f.args[2].incapacitated()) {
			return f.dot;
		}
		this.investigate_log(`has become a singularity. Caused by ${f.args[2].key}`, "singulo");
		to_chat(f.args[2], "<span class='danger'>The Bluespace interfaces of the two devices catastrophically malfunction!</span>");
		yield* qdel(f.args[0]);
		(singulo = (yield* new_(T("/obj/singularity"), rt.getStep(f, this, 0)))).energy = 300;
		message_admins(`${key_name_admin(f.args[2])} detonated a bag of holding`);
		log_game(`${key_name(f.args[2])} detonated a bag of holding`);
		yield* qdel(this);
		yield* singulo.process();
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["W", "prevent_warning", "user"] });

// backpack.dm:88
rt.def("/obj/item/weapon/storage/backpack/holding/proc/singularity_act", function singularity_act(f: Frame, current_size: Value) {
	let dist: Value = max(current_size - 2, 1);
	explosion(this.loc, dist, dist * 2, dist * 4);
	return f.dot;
});

rt.type(5448, "/obj/item/weapon/storage/backpack/santabag", "/obj/item/weapon/storage/backpack", {
	name: "Santa's Gift Bag",
	desc: "Space Santa uses this to deliver toys to all the nice children in space in Christmas! Wow, it's pretty big!",
	icon_state: "giftbag0",
	item_state: "giftbag",
	w_class: 4,
	max_w_class: 3,
	max_combined_w_class: 60,
});

// backpack.dm:103
rt.def("/obj/item/weapon/storage/backpack/santabag/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} places ${this} over their head and pulls it tight! It looks like they aren't in the Christmas spirit...</span>`);
	return 8;
});

rt.type(5462, "/obj/item/weapon/storage/backpack/satchel", "/obj/item/weapon/storage/backpack", {
	name: "satchel",
	desc: "A trendy looking satchel.",
	icon_state: "satchel-norm",
	species_exception: null,
});

// backpack.dm:196
rt.def("/obj/item/weapon/storage/backpack/satchel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.species_exception = list(T("/datum/species/angel"));
	return f.dot;
});

rt.type(5464, "/obj/item/weapon/storage/backpack/satchel/leather/withwallet", "/obj/item/weapon/storage/backpack/satchel/leather", {});

// backpack.dm:205
rt.def("/obj/item/weapon/storage/backpack/satchel/leather/withwallet/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/storage/wallet/random"), this);
	return f.dot;
}, true);

rt.type(5475, "/obj/item/weapon/storage/backpack/satchel/flat", "/obj/item/weapon/storage/backpack/satchel", {
	level: 1,
	name: "smuggler's satchel",
	desc: "A very slim satchel that can easily fit into tight spaces.",
	icon_state: "satchel-flat",
	w_class: 3,
	max_combined_w_class: 15,
	cant_hold: null,
});

// backpack.dm:277
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cant_hold = list(T("/obj/item/weapon/storage/backpack/satchel/flat"));
	return f.dot;
});

// backpack.dm:283
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/proc/hide", function hide(f: Frame, intact: Value) {
	if (intact) {
		this.invisibility = INVISIBILITY_MAXIMUM;
		this.anchored = 1;
		this.icon_state = `${rt.initial(f, this, "icon_state")}2`;
	} else {
		this.invisibility = rt.initial(f, this, "invisibility");
		this.anchored = 0;
		this.icon_state = rt.initial(f, this, "icon_state");
	}
	return f.dot;
});

// backpack.dm:290
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	GLOB.SSpersistence.new_secret_satchels += this;
	return f.dot;
}, true);

// backpack.dm:294
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/stack/tile/plasteel"), this);
	yield* new_(T("/obj/item/weapon/crowbar"), this);
	return f.dot;
}, true);

// backpack.dm:298
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSpersistence.new_secret_satchels -= this;
	return (yield* parent_proc());
}, true);

rt.type(5476, "/obj/item/weapon/storage/backpack/satchel/flat/secret", "/obj/item/weapon/storage/backpack/satchel/flat", {
	reward_one_of_these: null,
	reward_all_of_these: null,
	revealed: 0,
});

// backpack.dm:302
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/secret/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reward_one_of_these = list();

	this.reward_all_of_these = list();
	return f.dot;
});

// backpack.dm:307
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/secret/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (!(rt.istype(this.loc, T("/turf/open/floor")) && !rt.istype(this.loc, T("/turf/open/floor/plating")))) return f.dot;
	yield* this.hide(1);
	return f.dot;
}, true);

// backpack.dm:313
rt.def("/obj/item/weapon/storage/backpack/satchel/flat/secret/proc/hide", function* hide(f: Frame, intact: Value) {
	let reward: Value = null, R: Value = null;
	yield* parent_proc();
	if (!(!intact && !this.revealed)) return f.dot;
	if (rt.len(f, this.reward_one_of_these) > 0) {
		reward = pick(this.reward_one_of_these);
		yield* new_(reward, this);
	}
	for (R of each(this.reward_all_of_these)) {
		yield* new_(R, this);
	}
	this.revealed = 1;
	return f.dot;
}, true);

rt.type(5480, "/obj/item/weapon/storage/backpack/duffelbag/med/surgery", "/obj/item/weapon/storage/backpack/duffelbag/med", {
	name: "surgical duffel bag",
	desc: "A large duffel bag for holding extra medical supplies - this one seems to be designed for holding surgical tools.",
});

// backpack.dm:348
rt.def("/obj/item/weapon/storage/backpack/duffelbag/med/surgery/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/scalpel"), this);
	yield* new_(T("/obj/item/weapon/hemostat"), this);
	yield* new_(T("/obj/item/weapon/retractor"), this);
	yield* new_(T("/obj/item/weapon/circular_saw"), this);
	yield* new_(T("/obj/item/weapon/surgicaldrill"), this);
	yield* new_(T("/obj/item/weapon/cautery"), this);
	yield* new_(T("/obj/item/weapon/surgical_drapes"), this);
	yield* new_(T("/obj/item/clothing/mask/surgical"), this);
	yield* new_(T("/obj/item/weapon/razor"), this);
	return f.dot;
}, true);

rt.type(5482, "/obj/item/weapon/storage/backpack/duffelbag/sec/surgery", "/obj/item/weapon/storage/backpack/duffelbag/sec", {
	name: "surgical duffel bag",
	desc: "A large duffel bag for holding extra supplies - this one has a material inlay with space for various sharp-looking tools.",
});

// backpack.dm:369
rt.def("/obj/item/weapon/storage/backpack/duffelbag/sec/surgery/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/scalpel"), this);
	yield* new_(T("/obj/item/weapon/hemostat"), this);
	yield* new_(T("/obj/item/weapon/retractor"), this);
	yield* new_(T("/obj/item/weapon/circular_saw"), this);
	yield* new_(T("/obj/item/weapon/surgicaldrill"), this);
	yield* new_(T("/obj/item/weapon/cautery"), this);
	yield* new_(T("/obj/item/weapon/surgical_drapes"), this);
	yield* new_(T("/obj/item/clothing/mask/surgical"), this);
	return f.dot;
}, true);

rt.type(5484, "/obj/item/weapon/storage/backpack/duffelbag/drone", "/obj/item/weapon/storage/backpack/duffelbag", {
	name: "drone duffel bag",
	desc: "A large duffel bag for holding tools and hats.",
	icon_state: "duffel-drone",
	item_state: "duffel-drone",
	resistance_flags: 2,
});

// backpack.dm:393
rt.def("/obj/item/weapon/storage/backpack/duffelbag/drone/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/screwdriver"), this);
	yield* new_(T("/obj/item/weapon/wrench"), this);
	yield* new_(T("/obj/item/weapon/weldingtool"), this);
	yield* new_(T("/obj/item/weapon/crowbar"), this);
	yield* new_(T("/obj/item/stack/cable_coil/random"), this);
	yield* new_(T("/obj/item/weapon/wirecutters"), this);
	yield* new_(T("/obj/item/device/multitool"), this);
	return f.dot;
}, true);

rt.type(5486, "/obj/item/weapon/storage/backpack/duffelbag/clown/cream_pie", "/obj/item/weapon/storage/backpack/duffelbag/clown", {});

// backpack.dm:408
rt.def("/obj/item/weapon/storage/backpack/duffelbag/clown/cream_pie/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/pie/cream"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5488, "/obj/item/weapon/storage/backpack/duffelbag/syndie/hitman", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {
	desc: "A large duffel bag for holding extra things. There is a NanoTrasen logo on the back.",
	icon_state: "duffel-syndieammo",
	item_state: "duffel-syndieammo",
});

// backpack.dm:426
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/hitman/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/under/lawyer/blacksuit"), this);
	yield* new_(T("/obj/item/clothing/accessory/waistcoat"), this);
	yield* new_(T("/obj/item/clothing/suit/toggle/lawyer/black"), this);
	yield* new_(T("/obj/item/clothing/shoes/laceup"), this);
	yield* new_(T("/obj/item/clothing/gloves/color/black"), this);
	yield* new_(T("/obj/item/clothing/glasses/sunglasses"), this);
	yield* new_(T("/obj/item/clothing/head/fedora"), this);
	return f.dot;
}, true);

rt.type(5492, "/obj/item/weapon/storage/backpack/duffelbag/syndie/surgery", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {
	name: "surgery duffel bag",
	desc: "A suspicious looking duffel bag for holding surgery tools.",
	icon_state: "duffel-syndiemed",
	item_state: "duffel-syndiemed",
});

// backpack.dm:447
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/surgery/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/scalpel"), this);
	yield* new_(T("/obj/item/weapon/hemostat"), this);
	yield* new_(T("/obj/item/weapon/retractor"), this);
	yield* new_(T("/obj/item/weapon/circular_saw"), this);
	yield* new_(T("/obj/item/weapon/surgicaldrill"), this);
	yield* new_(T("/obj/item/weapon/cautery"), this);
	yield* new_(T("/obj/item/weapon/surgical_drapes"), this);
	yield* new_(T("/obj/item/clothing/suit/straight_jacket"), this);
	yield* new_(T("/obj/item/clothing/mask/muzzle"), this);
	yield* new_(T("/obj/item/device/mmi/syndie"), this);
	return f.dot;
}, true);

rt.type(5494, "/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo/shotgun", "/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo", {
	desc: "A large duffel bag, packed to the brim with Bulldog shotgun ammo.",
});

// backpack.dm:468
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo/shotgun/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/ammo_box/magazine/m12g"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/ammo_box/magazine/m12g/buckshot"), this);
	yield* new_(T("/obj/item/ammo_box/magazine/m12g/slug"), this);
	yield* new_(T("/obj/item/ammo_box/magazine/m12g/dragon"), this);
	return f.dot;
}, true);

rt.type(5495, "/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo/smg", "/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo", {
	desc: "A large duffel bag, packed to the brim with C20r magazines.",
});

// backpack.dm:478
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo/smg/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 9, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/ammo_box/magazine/smgm45"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5496, "/obj/item/weapon/storage/backpack/duffelbag/syndie/c20rbundle", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {
	desc: "A large duffel bag containing a C20r, some magazines, and a cheap looking suppressor.",
});

// backpack.dm:485
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/c20rbundle/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/ammo_box/magazine/smgm45"), this);
	yield* new_(T("/obj/item/ammo_box/magazine/smgm45"), this);
	yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/c20r"), this);
	yield* new_(T("/obj/item/weapon/suppressor/specialoffer"), this);
	return f.dot;
}, true);

rt.type(5497, "/obj/item/weapon/storage/backpack/duffelbag/syndie/bulldogbundle", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {
	desc: "A large duffel bag containing a Bulldog, several drums, and a collapsed hardsuit.",
});

// backpack.dm:494
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/bulldogbundle/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/ammo_box/magazine/m12g"), this);
	yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog"), this);
	yield* new_(T("/obj/item/ammo_box/magazine/m12g/buckshot"), this);
	yield* new_(T("/obj/item/clothing/glasses/thermal/syndi"), this);
	return f.dot;
}, true);

rt.type(5490, "/obj/item/weapon/storage/backpack/duffelbag/syndie/med/medicalbundle", "/obj/item/weapon/storage/backpack/duffelbag/syndie/med", {
	desc: "A large duffel bag containing a medical equipment, a Donksoft machine gun, a big jumbo box of darts, and a knock-off pair of magboots.",
});

// backpack.dm:503
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/med/medicalbundle/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/shoes/magboots/syndie"), this);
	yield* new_(T("/obj/item/weapon/storage/firstaid/tactical"), this);
	yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/l6_saw/toy"), this);
	yield* new_(T("/obj/item/ammo_box/foambox/riot"), this);
	return f.dot;
}, true);

// backpack.dm:512
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/med/medicalbundle/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/shoes/magboots/syndie"), this);
	yield* new_(T("/obj/item/weapon/storage/firstaid/tactical"), this);
	yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/l6_saw/toy"), this);
	yield* new_(T("/obj/item/ammo_box/foambox/riot"), this);
	return f.dot;
}, true);

rt.type(5491, "/obj/item/weapon/storage/backpack/duffelbag/syndie/med/bioterrorbundle", "/obj/item/weapon/storage/backpack/duffelbag/syndie/med", {
	desc: "A large duffel bag containing a deadly chemicals, a chemical spray, chemical grenade, a Donksoft assault rifle, riot grade darts, a minature syringe gun, and a box of syringes",
});

// backpack.dm:521
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/med/bioterrorbundle/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/reagent_containers/spray/chemsprayer/bioterror"), this);
	yield* new_(T("/obj/item/weapon/storage/box/syndie_kit/chemical"), this);
	yield* new_(T("/obj/item/weapon/gun/syringe/syndicate"), this);
	yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/c20r/toy"), this);
	yield* new_(T("/obj/item/weapon/storage/box/syringes"), this);
	yield* new_(T("/obj/item/ammo_box/foambox/riot"), this);
	yield* new_(T("/obj/item/weapon/grenade/chem_grenade/bioterrorfoam"), this);
	return f.dot;
}, true);

rt.type(5498, "/obj/item/weapon/storage/backpack/duffelbag/syndie/c4", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {});

// backpack.dm:530
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/c4/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/grenade/plastic/c4"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5499, "/obj/item/weapon/storage/backpack/duffelbag/syndie/x4", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {});

// backpack.dm:534
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/x4/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/grenade/plastic/x4"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5500, "/obj/item/weapon/storage/backpack/duffelbag/syndie/firestarter", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {
	desc: "A large duffel bag containing New Russian pyro backpack sprayer, a pistol, a pipebomb, fireproof hardsuit, ammo, and other equipment.",
});

// backpack.dm:541
rt.def("/obj/item/weapon/storage/backpack/duffelbag/syndie/firestarter/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/under/syndicate/soviet"), this);
	yield* new_(T("/obj/item/weapon/watertank/operator"), this);
	yield* new_(T("/obj/item/clothing/suit/space/hardsuit/syndi/elite"), this);
	yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/pistol/APS"), this);
	yield* new_(T("/obj/item/ammo_box/magazine/pistolm9mm"), this);
	yield* new_(T("/obj/item/ammo_box/magazine/pistolm9mm"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka/badminka"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/syringe/stimulants"), this);
	yield* new_(T("/obj/item/weapon/grenade/syndieminibomb"), this);
	return f.dot;
}, true);
