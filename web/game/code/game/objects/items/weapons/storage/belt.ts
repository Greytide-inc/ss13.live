// Based on /tg/station's code/game/objects/items/weapons/storage/belt.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5287, "/obj/item/weapon/storage/belt", "/obj/item/weapon/storage", {
	name: "belt",
	desc: "Can hold various things.",
	icon: rt.rsc("icons/obj/clothing/belts.dmi"),
	icon_state: "utilitybelt",
	item_state: "utility",
	slot_flags: 512,
	attack_verb: null,
	obj_integrity: 300,
	max_integrity: 300,
});

// belt.dm:13
rt.def("/obj/item/weapon/storage/belt/proc/update_icon", function update_icon(f: Frame) {
	let I: Value = null;
	this.cut_overlays();
	for (I of each(this.contents, T("/obj/item"))) {
		this.add_overlay(`${I.name}`);
	}
	parent_proc();
	return f.dot;
});

rt.type(5296, "/obj/item/weapon/storage/belt/utility", "/obj/item/weapon/storage/belt", {
	name: "toolbelt",
	desc: "Holds tools.",
	icon_state: "utilitybelt",
	item_state: "utility",
	can_hold: null,
});

// belt.dm:23
rt.def("/obj/item/weapon/storage/belt/utility/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/crowbar"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/weldingtool"), T("/obj/item/weapon/wirecutters"), T("/obj/item/weapon/wrench"), T("/obj/item/device/multitool"), T("/obj/item/device/flashlight"), T("/obj/item/stack/cable_coil"), T("/obj/item/device/t_scanner"), T("/obj/item/device/analyzer"), T("/obj/item/weapon/extinguisher/mini"), T("/obj/item/device/radio"), T("/obj/item/clothing/gloves"));
	return f.dot;
});

rt.type(5298, "/obj/item/weapon/storage/belt/utility/chief/full", "/obj/item/weapon/storage/belt/utility/chief", {});

// belt.dm:46
rt.def("/obj/item/weapon/storage/belt/utility/chief/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/screwdriver/power"), this);
	yield* new_(T("/obj/item/weapon/crowbar/power"), this);
	yield* new_(T("/obj/item/weapon/weldingtool/experimental"), this);
	yield* new_(T("/obj/item/device/multitool"), this);
	yield* new_(T("/obj/item/stack/cable_coil"), this, 30, pick("red", "yellow", "orange"));
	yield* new_(T("/obj/item/weapon/extinguisher/mini"), this);
	yield* new_(T("/obj/item/device/analyzer"), this);
	return f.dot;
}, true);

rt.type(5299, "/obj/item/weapon/storage/belt/utility/full", "/obj/item/weapon/storage/belt/utility", {});

// belt.dm:57
rt.def("/obj/item/weapon/storage/belt/utility/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/screwdriver"), this);
	yield* new_(T("/obj/item/weapon/wrench"), this);
	yield* new_(T("/obj/item/weapon/weldingtool"), this);
	yield* new_(T("/obj/item/weapon/crowbar"), this);
	yield* new_(T("/obj/item/weapon/wirecutters"), this);
	yield* new_(T("/obj/item/device/multitool"), this);
	yield* new_(T("/obj/item/stack/cable_coil"), this, 30, pick("red", "yellow", "orange"));
	return f.dot;
}, true);

rt.type(5300, "/obj/item/weapon/storage/belt/utility/full/engi", "/obj/item/weapon/storage/belt/utility/full", {});

// belt.dm:66
rt.def("/obj/item/weapon/storage/belt/utility/full/engi/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/screwdriver"), this);
	yield* new_(T("/obj/item/weapon/wrench"), this);
	yield* new_(T("/obj/item/weapon/weldingtool/largetank"), this);
	yield* new_(T("/obj/item/weapon/crowbar"), this);
	yield* new_(T("/obj/item/weapon/wirecutters"), this);
	yield* new_(T("/obj/item/device/multitool"), this);
	yield* new_(T("/obj/item/stack/cable_coil"), this, 30, pick("red", "yellow", "orange"));
	return f.dot;
}, true);

rt.type(5301, "/obj/item/weapon/storage/belt/utility/atmostech", "/obj/item/weapon/storage/belt/utility", {});

// belt.dm:76
rt.def("/obj/item/weapon/storage/belt/utility/atmostech/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/screwdriver"), this);
	yield* new_(T("/obj/item/weapon/wrench"), this);
	yield* new_(T("/obj/item/weapon/weldingtool"), this);
	yield* new_(T("/obj/item/weapon/crowbar"), this);
	yield* new_(T("/obj/item/weapon/wirecutters"), this);
	yield* new_(T("/obj/item/device/t_scanner"), this);
	yield* new_(T("/obj/item/weapon/extinguisher/mini"), this);
	return f.dot;
}, true);

rt.type(5302, "/obj/item/weapon/storage/belt/medical", "/obj/item/weapon/storage/belt", {
	name: "medical belt",
	desc: "Can hold various medical equipment.",
	icon_state: "medicalbelt",
	item_state: "medical",
	max_w_class: 4,
	can_hold: null,
});

// belt.dm:92
rt.def("/obj/item/weapon/storage/belt/medical/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/device/healthanalyzer"), T("/obj/item/weapon/dnainjector"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/reagent_containers/glass/bottle"), T("/obj/item/weapon/reagent_containers/pill"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/lighter"), T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/weapon/storage/pill_bottle"), T("/obj/item/stack/medical"), T("/obj/item/device/flashlight/pen"), T("/obj/item/weapon/extinguisher/mini"), T("/obj/item/weapon/reagent_containers/hypospray"), T("/obj/item/device/sensor_device"), T("/obj/item/device/radio"), T("/obj/item/clothing/gloves"), T("/obj/item/weapon/lazarus_injector"), T("/obj/item/weapon/bikehorn/rubberducky"), T("/obj/item/clothing/mask/surgical"), T("/obj/item/clothing/mask/breath"), T("/obj/item/clothing/mask/breath/medical"), T("/obj/item/weapon/surgical_drapes"), T("/obj/item/weapon/scalpel"), T("/obj/item/weapon/circular_saw"), T("/obj/item/weapon/surgicaldrill"), T("/obj/item/weapon/retractor"), T("/obj/item/weapon/cautery"), T("/obj/item/weapon/hemostat"), T("/obj/item/device/geiger_counter"), T("/obj/item/clothing/neck/stethoscope"), T("/obj/item/weapon/stamp"), T("/obj/item/clothing/glasses"), T("/obj/item/weapon/wrench/medical"), T("/obj/item/clothing/mask/muzzle"), T("/obj/item/weapon/storage/bag/chemistry"), T("/obj/item/weapon/storage/bag/bio"), T("/obj/item/weapon/reagent_containers/blood"), T("/obj/item/weapon/tank/internals/emergency_oxygen"));
	return f.dot;
});

rt.type(5303, "/obj/item/weapon/storage/belt/security", "/obj/item/weapon/storage/belt", {
	name: "security belt",
	desc: "Can hold security gear like handcuffs and flashes.",
	icon_state: "securitybelt",
	item_state: "security",
	storage_slots: 5,
	max_w_class: 3,
	can_hold: null,
});

// belt.dm:142
rt.def("/obj/item/weapon/storage/belt/security/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/melee/classic_baton"), T("/obj/item/weapon/grenade"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/device/assembly/flash/handheld"), T("/obj/item/clothing/glasses"), T("/obj/item/ammo_casing/shotgun"), T("/obj/item/ammo_box"), T("/obj/item/weapon/reagent_containers/food/snacks/donut"), T("/obj/item/weapon/reagent_containers/food/snacks/donut/jelly"), T("/obj/item/weapon/kitchen/knife/combat"), T("/obj/item/device/flashlight/seclite"), T("/obj/item/weapon/melee/classic_baton/telescopic"), T("/obj/item/device/radio"), T("/obj/item/clothing/gloves"), T("/obj/item/weapon/restraints/legcuffs/bola"));
	return f.dot;
});

rt.type(5304, "/obj/item/weapon/storage/belt/security/full", "/obj/item/weapon/storage/belt/security", {});

// belt.dm:163
rt.def("/obj/item/weapon/storage/belt/security/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/reagent_containers/spray/pepper"), this);
	yield* new_(T("/obj/item/weapon/restraints/handcuffs"), this);
	yield* new_(T("/obj/item/weapon/grenade/flashbang"), this);
	yield* new_(T("/obj/item/device/assembly/flash/handheld"), this);
	yield* new_(T("/obj/item/weapon/melee/baton/loaded"), this);
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(5305, "/obj/item/weapon/storage/belt/mining", "/obj/item/weapon/storage/belt", {
	name: "explorer's webbing",
	desc: "A versatile chest rig, cherished by miners and hunters alike.",
	icon_state: "explorer1",
	item_state: "explorer1",
	storage_slots: 6,
	w_class: 4,
	max_w_class: 4,
	max_combined_w_class: 20,
	can_hold: null,
});

// belt.dm:180
rt.def("/obj/item/weapon/storage/belt/mining/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/crowbar"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/weldingtool"), T("/obj/item/weapon/wirecutters"), T("/obj/item/weapon/wrench"), T("/obj/item/device/flashlight"), T("/obj/item/stack/cable_coil"), T("/obj/item/device/analyzer"), T("/obj/item/weapon/extinguisher/mini"), T("/obj/item/device/radio"), T("/obj/item/clothing/gloves"), T("/obj/item/weapon/resonator"), T("/obj/item/device/mining_scanner"), T("/obj/item/weapon/pickaxe"), T("/obj/item/stack/sheet/animalhide"), T("/obj/item/stack/sheet/sinew"), T("/obj/item/stack/sheet/bone"), T("/obj/item/weapon/lighter"), T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle"), T("/obj/item/stack/medical"), T("/obj/item/weapon/kitchen/knife"), T("/obj/item/weapon/reagent_containers/hypospray"), T("/obj/item/device/gps"), T("/obj/item/weapon/storage/bag/ore"), T("/obj/item/weapon/survivalcapsule"), T("/obj/item/device/t_scanner/adv_mining_scanner"), T("/obj/item/weapon/reagent_containers/pill"), T("/obj/item/weapon/storage/pill_bottle"), T("/obj/item/weapon/ore"), T("/obj/item/weapon/reagent_containers/food/drinks"), T("/obj/item/organ/regenerative_core"), T("/obj/item/device/wormhole_jaunter"), T("/obj/item/weapon/storage/bag/plants"), T("/obj/item/stack/marker_beacon"));
	return f.dot;
});

rt.type(5306, "/obj/item/weapon/storage/belt/mining/vendor", "/obj/item/weapon/storage/belt/mining", {
	contents: null,
});

// belt.dm:220
rt.def("/obj/item/weapon/storage/belt/mining/vendor/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.contents = list((yield* new_(T("/obj/item/weapon/survivalcapsule"))));
	return f.dot;
}, true);

rt.type(5309, "/obj/item/weapon/storage/belt/soulstone", "/obj/item/weapon/storage/belt", {
	name: "soul stone belt",
	desc: "Designed for ease of access to the shards during a fight, as to not let a single enemy spirit slip away",
	icon_state: "soulstonebelt",
	item_state: "soulstonebelt",
	storage_slots: 6,
	can_hold: null,
});

// belt.dm:239
rt.def("/obj/item/weapon/storage/belt/soulstone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/device/soulstone"));
	return f.dot;
});

rt.type(5310, "/obj/item/weapon/storage/belt/soulstone/full", "/obj/item/weapon/storage/belt/soulstone", {});

// belt.dm:244
rt.def("/obj/item/weapon/storage/belt/soulstone/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/device/soulstone"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5288, "/obj/item/weapon/storage/belt/champion", "/obj/item/weapon/storage/belt", {
	name: "championship belt",
	desc: "Proves to the world that you are the strongest!",
	icon_state: "championbelt",
	item_state: "champion",
	materials: null,
	storage_slots: 1,
	can_hold: null,
});

// belt.dm:252
rt.def("/obj/item/weapon/storage/belt/champion/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$gold", 400]);

	this.can_hold = list(T("/obj/item/clothing/mask/luchador"));
	return f.dot;
});

rt.type(5293, "/obj/item/weapon/storage/belt/military/abductor/full", "/obj/item/weapon/storage/belt/military/abductor", {});

// belt.dm:273
rt.def("/obj/item/weapon/storage/belt/military/abductor/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/screwdriver/abductor"), this);
	yield* new_(T("/obj/item/weapon/wrench/abductor"), this);
	yield* new_(T("/obj/item/weapon/weldingtool/abductor"), this);
	yield* new_(T("/obj/item/weapon/crowbar/abductor"), this);
	yield* new_(T("/obj/item/weapon/wirecutters/abductor"), this);
	yield* new_(T("/obj/item/device/multitool/abductor"), this);
	yield* new_(T("/obj/item/stack/cable_coil"), this, 30, "white");
	return f.dot;
}, true);

rt.type(5311, "/obj/item/weapon/storage/belt/grenade", "/obj/item/weapon/storage/belt", {
	name: "grenadier belt",
	desc: "A belt for holding grenades.",
	icon_state: "grenadebeltnew",
	item_state: "security",
	max_w_class: 4,
	display_contents_with_number: 1,
	storage_slots: 30,
	max_combined_w_class: 60,
	can_hold: null,
});

// belt.dm:304
rt.def("/obj/item/weapon/storage/belt/grenade/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/grenade"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/lighter"), T("/obj/item/device/multitool"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov"), T("/obj/item/weapon/grenade/plastic/c4"));
	return f.dot;
});

rt.type(5312, "/obj/item/weapon/storage/belt/grenade/full", "/obj/item/weapon/storage/belt/grenade", {});

// belt.dm:313
rt.def("/obj/item/weapon/storage/belt/grenade/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/grenade/flashbang"), this);
	yield* new_(T("/obj/item/weapon/grenade/smokebomb"), this);
	yield* new_(T("/obj/item/weapon/grenade/smokebomb"), this);
	yield* new_(T("/obj/item/weapon/grenade/smokebomb"), this);
	yield* new_(T("/obj/item/weapon/grenade/smokebomb"), this);
	yield* new_(T("/obj/item/weapon/grenade/empgrenade"), this);
	yield* new_(T("/obj/item/weapon/grenade/empgrenade"), this);
	yield* new_(T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), this);
	yield* new_(T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), this);
	yield* new_(T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), this);
	yield* new_(T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), this);
	yield* new_(T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), this);
	yield* new_(T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), this);
	yield* new_(T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), this);
	yield* new_(T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), this);
	yield* new_(T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), this);
	yield* new_(T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), this);
	yield* new_(T("/obj/item/weapon/grenade/gluon"), this);
	yield* new_(T("/obj/item/weapon/grenade/gluon"), this);
	yield* new_(T("/obj/item/weapon/grenade/gluon"), this);
	yield* new_(T("/obj/item/weapon/grenade/gluon"), this);
	yield* new_(T("/obj/item/weapon/grenade/chem_grenade/incendiary"), this);
	yield* new_(T("/obj/item/weapon/grenade/chem_grenade/incendiary"), this);
	yield* new_(T("/obj/item/weapon/grenade/chem_grenade/facid"), this);
	yield* new_(T("/obj/item/weapon/grenade/syndieminibomb"), this);
	yield* new_(T("/obj/item/weapon/grenade/syndieminibomb"), this);
	yield* new_(T("/obj/item/weapon/screwdriver"), this);
	yield* new_(T("/obj/item/device/multitool"), this);
	return f.dot;
}, true);

rt.type(5313, "/obj/item/weapon/storage/belt/wands", "/obj/item/weapon/storage/belt", {
	name: "wand belt",
	desc: "A belt designed to hold various rods of power. A veritable fanny pack of exotic magic.",
	icon_state: "soulstonebelt",
	item_state: "soulstonebelt",
	storage_slots: 6,
	can_hold: null,
});

// belt.dm:348
rt.def("/obj/item/weapon/storage/belt/wands/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/gun/magic/wand"));
	return f.dot;
});

rt.type(5314, "/obj/item/weapon/storage/belt/wands/full", "/obj/item/weapon/storage/belt/wands", {});

// belt.dm:353
rt.def("/obj/item/weapon/storage/belt/wands/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let W: Value = null;
	yield* new_(T("/obj/item/weapon/gun/magic/wand/death"), this);
	yield* new_(T("/obj/item/weapon/gun/magic/wand/resurrection"), this);
	yield* new_(T("/obj/item/weapon/gun/magic/wand/polymorph"), this);
	yield* new_(T("/obj/item/weapon/gun/magic/wand/teleport"), this);
	yield* new_(T("/obj/item/weapon/gun/magic/wand/door"), this);
	yield* new_(T("/obj/item/weapon/gun/magic/wand/fireball"), this);
	for (W of each(this.contents, T("/obj/item/weapon/gun/magic/wand"))) {
		W.max_charges = rt.initial(f, W, "max_charges");
		W.charges = W.max_charges;
	}
	return f.dot;
}, true);

rt.type(5315, "/obj/item/weapon/storage/belt/janitor", "/obj/item/weapon/storage/belt", {
	name: "janibelt",
	desc: "A belt used to hold most janitorial supplies.",
	icon_state: "janibelt",
	item_state: "janibelt",
	storage_slots: 6,
	max_w_class: 4,
	can_hold: null,
});

// belt.dm:371
rt.def("/obj/item/weapon/storage/belt/janitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/grenade/chem_grenade"), T("/obj/item/device/lightreplacer"), T("/obj/item/device/flashlight"), T("/obj/item/weapon/reagent_containers/spray"), T("/obj/item/weapon/soap"), T("/obj/item/weapon/holosign_creator"), T("/obj/item/key/janitor"), T("/obj/item/clothing/gloves"));
	return f.dot;
});

rt.type(5316, "/obj/item/weapon/storage/belt/bandolier", "/obj/item/weapon/storage/belt", {
	name: "bandolier",
	desc: "A bandolier for holding shotgun ammunition.",
	icon_state: "bandolier",
	item_state: "bandolier",
	storage_slots: 18,
	display_contents_with_number: 1,
	can_hold: null,
});

// belt.dm:389
rt.def("/obj/item/weapon/storage/belt/bandolier/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/ammo_casing/shotgun"));
	return f.dot;
});

rt.type(5317, "/obj/item/weapon/storage/belt/holster", "/obj/item/weapon/storage/belt", {
	name: "shoulder holster",
	desc: "A holster to carry a handgun and ammo. WARNING: Badasses only.",
	icon_state: "holster",
	item_state: "holster",
	storage_slots: 3,
	max_w_class: 3,
	alternate_worn_layer: 15,
	can_hold: null,
});

// belt.dm:400
rt.def("/obj/item/weapon/storage/belt/holster/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/gun/ballistic/automatic/pistol"), T("/obj/item/weapon/gun/ballistic/revolver"), T("/obj/item/ammo_box"));
	return f.dot;
});

rt.type(5318, "/obj/item/weapon/storage/belt/holster/full", "/obj/item/weapon/storage/belt/holster", {});

// belt.dm:408
rt.def("/obj/item/weapon/storage/belt/holster/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/gun/ballistic/revolver/detective"), this);
	yield* new_(T("/obj/item/ammo_box/c38"), this);
	yield* new_(T("/obj/item/ammo_box/c38"), this);
	return f.dot;
}, true);

rt.type(5330, "/obj/item/weapon/storage/belt/sabre", "/obj/item/weapon/storage/belt", {
	name: "sabre sheath",
	desc: "An ornate sheath designed to hold an officer's blade.",
	icon_state: "sheath",
	item_state: "sheath",
	storage_slots: 1,
	w_class: 4,
	max_w_class: 4,
	can_hold: null,
});

// belt.dm:478
rt.def("/obj/item/weapon/storage/belt/sabre/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/melee/sabre"));
	return f.dot;
});

// belt.dm:483
rt.def("/obj/item/weapon/storage/belt/sabre/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!rt.len(f, this.contents)) return f.dot;
	to_chat(user, "<span class='notice'>Alt-click it to quickly draw the blade.</span>");
	return f.dot;
}, false);

// belt.dm:488
rt.def("/obj/item/weapon/storage/belt/sabre/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	let I: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human")) || !(yield* user.canUseTopic(this, { be_close: 1 }))) {
		return f.dot;
	}
	if (rt.len(f, this.contents)) {
		I = rt.index(this.contents, 1);
		user.visible_message(`${user} takes ${I} out of ${this}.`, `<span class='notice'>You take ${I} out of ${this}.</span>`);
		yield* user.put_in_hands(I);
		yield* this.update_icon();
	} else {
		to_chat(user, `${this} is empty.`);
	}
	return f.dot;
}, true);

// belt.dm:500
rt.def("/obj/item/weapon/storage/belt/sabre/proc/update_icon", function* update_icon(f: Frame) {
	let L: Value = null;
	this.icon_state = "sheath";
	this.item_state = "sheath";
	if (rt.len(f, this.contents)) {
		this.icon_state += "-sabre";
		this.item_state += "-sabre";
	}
	if (this.loc && rt.istype(this.loc, T("/mob/living"))) {
		yield* (L = this.loc).regenerate_icons();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// belt.dm:512
rt.def("/obj/item/weapon/storage/belt/sabre/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/melee/sabre"), this);
	yield* this.update_icon();
	return f.dot;
}, true);
