// Based on /tg/station's code/modules/clothing/outfits/standard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(665, "/datum/outfit/tournament/janitor", "/datum/outfit/tournament", {
	name: "tournament janitor",
	suit: null,
	head: null,
	uniform: rt.typePath("/obj/item/clothing/under/rank/janitor"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	r_hand: rt.typePath("/obj/item/weapon/mop"),
	l_hand: rt.typePath("/obj/item/weapon/reagent_containers/glass/bucket"),
	r_pocket: rt.typePath("/obj/item/weapon/grenade/chem_grenade/cleaner"),
	l_pocket: rt.typePath("/obj/item/weapon/grenade/chem_grenade/cleaner"),
	backpack_contents: null,
});

// standard.dm:49
rt.def("/datum/outfit/tournament/janitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/stack/tile/plasteel"), 6]);
	return f.dot;
});

// standard.dm:55
rt.def("/datum/outfit/tournament/janitor/proc/post_equip", function* post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let bucket: Value = null;
	visualsOnly ??= 0;
	if (visualsOnly) {
		return f.dot;
	}
	yield* (bucket = H.get_item_for_held_index(1)).reagents.add_reagent("water", 70);
	return f.dot;
}, true);

rt.type(666, "/datum/outfit/laser_tag", "/datum/outfit", {
	name: "Laser Tag Red",
	uniform: rt.typePath("/obj/item/clothing/under/color/red"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/red"),
	head: rt.typePath("/obj/item/clothing/head/helmet/redtaghelm"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/red"),
	ears: rt.typePath("/obj/item/device/radio/headset"),
	suit: rt.typePath("/obj/item/clothing/suit/redtag"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	suit_store: rt.typePath("/obj/item/weapon/gun/energy/laser/redtag"),
	backpack_contents: null,
});

// standard.dm:69
rt.def("/datum/outfit/laser_tag/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box"), 1]);
	return f.dot;
});

rt.type(670, "/datum/outfit/tunnel_clown", "/datum/outfit", {
	name: "Tunnel Clown",
	uniform: rt.typePath("/obj/item/clothing/under/rank/clown"),
	shoes: rt.typePath("/obj/item/clothing/shoes/clown_shoes"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/black"),
	mask: rt.typePath("/obj/item/clothing/mask/gas/clown_hat"),
	ears: rt.typePath("/obj/item/device/radio/headset"),
	glasses: rt.typePath("/obj/item/clothing/glasses/thermal/monocle"),
	suit: rt.typePath("/obj/item/clothing/suit/hooded/chaplain_hoodie"),
	l_pocket: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"),
	r_pocket: rt.typePath("/obj/item/weapon/bikehorn"),
	id: rt.typePath("/obj/item/weapon/card/id"),
	r_hand: rt.typePath("/obj/item/weapon/twohanded/fireaxe"),
});

// standard.dm:115
rt.def("/datum/outfit/tunnel_clown/proc/post_equip", function post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let W: Value = null;
	visualsOnly ??= 0;
	if (visualsOnly) {
		return f.dot;
	}
	(W = H.wear_id).access = get_all_accesses();
	W.assignment = "Tunnel Clown!";
	W.registered_name = H.real_name;
	W.update_label(H.real_name);
	return f.dot;
});

rt.type(671, "/datum/outfit/psycho", "/datum/outfit", {
	name: "Masked Killer",
	uniform: rt.typePath("/obj/item/clothing/under/overalls"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/white"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/latex"),
	mask: rt.typePath("/obj/item/clothing/mask/surgical"),
	head: rt.typePath("/obj/item/clothing/head/welding"),
	ears: rt.typePath("/obj/item/device/radio/headset"),
	glasses: rt.typePath("/obj/item/clothing/glasses/thermal/monocle"),
	suit: rt.typePath("/obj/item/clothing/suit/apron"),
	l_pocket: rt.typePath("/obj/item/weapon/kitchen/knife"),
	r_pocket: rt.typePath("/obj/item/weapon/scalpel"),
	r_hand: rt.typePath("/obj/item/weapon/twohanded/fireaxe"),
});

// standard.dm:136
rt.def("/datum/outfit/psycho/proc/post_equip", function* post_equip(f: Frame, H: Value) {
	let carried_item: Value = null, I: Value = null;
	for (carried_item of each(H.get_equipped_items(), T("/obj/item"))) {
		yield* carried_item.add_mob_blood(H);
	}
	for (I of each(H.held_items, T("/obj/item"))) {
		yield* I.add_mob_blood(H);
	}
	yield* H.regenerate_icons();
	return f.dot;
}, true);

rt.type(672, "/datum/outfit/assassin", "/datum/outfit", {
	name: "Assassin",
	uniform: rt.typePath("/obj/item/clothing/under/suit_jacket"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/black"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/black"),
	ears: rt.typePath("/obj/item/device/radio/headset"),
	glasses: rt.typePath("/obj/item/clothing/glasses/sunglasses"),
	l_pocket: rt.typePath("/obj/item/weapon/melee/energy/sword/saber"),
	l_hand: rt.typePath("/obj/item/weapon/storage/secure/briefcase"),
	id: rt.typePath("/obj/item/weapon/card/id/syndicate"),
	belt: rt.typePath("/obj/item/device/pda/heads"),
});

// standard.dm:157
rt.def("/datum/outfit/assassin/proc/post_equip", function* post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let U: Value = null, briefcase_item: Value = null, i: Value = null, pda: Value = null, W: Value = null;
	let $e: any;
	visualsOnly ??= 0;
	yield* (U = H.w_uniform).attach_accessory((yield* new_(T("/obj/item/clothing/accessory/waistcoat"), H)));
	if (visualsOnly) {
		return f.dot;
	}
	let sec_briefcase: Value = H.get_item_for_held_index(1);
	for (briefcase_item of each(sec_briefcase, T("/obj/item"))) {
		yield* qdel(briefcase_item);
	}
	rt.forRange(f, 0, 3, 0, -1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* sec_briefcase.handle_item_insertion((yield* new_(T("/obj/item/stack/spacecash/c1000"))), 1);
	}
	rt.endFor(f, 0);
	yield* sec_briefcase.handle_item_insertion((yield* new_(T("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow"))), 1);
	yield* sec_briefcase.handle_item_insertion((yield* new_(T("/obj/item/weapon/gun/ballistic/revolver/mateba"))), 1);
	yield* sec_briefcase.handle_item_insertion((yield* new_(T("/obj/item/ammo_box/a357"))), 1);
	yield* sec_briefcase.handle_item_insertion((yield* new_(T("/obj/item/weapon/grenade/plastic/x4"))), 1);
	(pda = H.belt).owner = H.real_name;
	pda.ownjob = "Reaper";
	pda.update_label();
	(W = H.wear_id).access = get_all_accesses();
	W.assignment = "Reaper";
	W.registered_name = H.real_name;
	W.update_label(H.real_name);
	return f.dot;
}, true);

rt.type(673, "/datum/outfit/centcom_commander", "/datum/outfit", {
	name: "Centcom Commander",
	uniform: rt.typePath("/obj/item/clothing/under/rank/centcom_commander"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/bulletproof"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat/swat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_cent/commander"),
	glasses: rt.typePath("/obj/item/clothing/glasses/eyepatch"),
	mask: rt.typePath("/obj/item/clothing/mask/cigarette/cigar/cohiba"),
	head: rt.typePath("/obj/item/clothing/head/centhat"),
	belt: rt.typePath("/obj/item/weapon/gun/ballistic/revolver/mateba"),
	r_pocket: rt.typePath("/obj/item/weapon/lighter"),
	l_pocket: rt.typePath("/obj/item/ammo_box/a357"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/satchel/leather"),
	id: rt.typePath("/obj/item/weapon/card/id"),
});

// standard.dm:206
rt.def("/datum/outfit/centcom_commander/proc/post_equip", function post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let W: Value = null;
	visualsOnly ??= 0;
	if (visualsOnly) {
		return f.dot;
	}
	(W = H.wear_id).icon_state = "centcom";
	W.access = get_all_accesses();
	W.access += get_centcom_access("Centcom Commander");
	W.assignment = "Centcom Commander";
	W.registered_name = H.real_name;
	W.update_label();
	return f.dot;
});

rt.type(674, "/datum/outfit/spec_ops", "/datum/outfit", {
	name: "Special Ops Officer",
	uniform: rt.typePath("/obj/item/clothing/under/syndicate"),
	suit: rt.typePath("/obj/item/clothing/suit/space/officer"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat/swat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	glasses: rt.typePath("/obj/item/clothing/glasses/thermal/eyepatch"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_cent/commander"),
	mask: rt.typePath("/obj/item/clothing/mask/cigarette/cigar/havana"),
	head: rt.typePath("/obj/item/clothing/head/helmet/space/beret"),
	belt: rt.typePath("/obj/item/weapon/gun/energy/pulse/pistol/m1911"),
	r_pocket: rt.typePath("/obj/item/weapon/lighter"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/satchel/leather"),
	id: rt.typePath("/obj/item/weapon/card/id"),
});

// standard.dm:234
rt.def("/datum/outfit/spec_ops/proc/post_equip", function post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let W: Value = null, R: Value = null;
	visualsOnly ??= 0;
	if (visualsOnly) {
		return f.dot;
	}
	(W = H.wear_id).icon_state = "centcom";
	W.access = get_all_accesses();
	W.access += get_centcom_access("Special Ops Officer");
	W.assignment = "Special Ops Officer";
	W.registered_name = H.real_name;
	W.update_label();
	(R = H.ears).set_frequency(1337);
	R.freqlock = 1;
	return f.dot;
});

rt.type(644, "/datum/outfit/wizard", "/datum/outfit", {
	name: "Blue Wizard",
	uniform: rt.typePath("/obj/item/clothing/under/color/lightpurple"),
	suit: rt.typePath("/obj/item/clothing/suit/wizrobe"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sandal/magic"),
	ears: rt.typePath("/obj/item/device/radio/headset"),
	head: rt.typePath("/obj/item/clothing/head/wizard"),
	r_pocket: rt.typePath("/obj/item/weapon/teleportation_scroll"),
	r_hand: rt.typePath("/obj/item/weapon/spellbook"),
	l_hand: rt.typePath("/obj/item/weapon/staff"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	backpack_contents: null,
});

// standard.dm:266
rt.def("/datum/outfit/wizard/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box"), 1]);
	return f.dot;
});

rt.type(676, "/datum/outfit/soviet", "/datum/outfit", {
	name: "Soviet Admiral",
	uniform: rt.typePath("/obj/item/clothing/under/soviet"),
	head: rt.typePath("/obj/item/clothing/head/pirate/captain"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_cent"),
	glasses: rt.typePath("/obj/item/clothing/glasses/thermal/eyepatch"),
	suit: rt.typePath("/obj/item/clothing/suit/pirate/captain"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/satchel/leather"),
	belt: rt.typePath("/obj/item/weapon/gun/ballistic/revolver/mateba"),
	id: rt.typePath("/obj/item/weapon/card/id"),
});

// standard.dm:301
rt.def("/datum/outfit/soviet/proc/post_equip", function post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let W: Value = null;
	visualsOnly ??= 0;
	if (visualsOnly) {
		return f.dot;
	}
	(W = H.wear_id).icon_state = "centcom";
	W.access = get_all_accesses();
	W.access += get_centcom_access("Admiral");
	W.assignment = "Admiral";
	W.registered_name = H.real_name;
	W.update_label();
	return f.dot;
});

rt.type(677, "/datum/outfit/mobster", "/datum/outfit", {
	name: "Mobster",
	uniform: rt.typePath("/obj/item/clothing/under/suit_jacket/really_black"),
	head: rt.typePath("/obj/item/clothing/head/fedora"),
	shoes: rt.typePath("/obj/item/clothing/shoes/laceup"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/black"),
	ears: rt.typePath("/obj/item/device/radio/headset"),
	glasses: rt.typePath("/obj/item/clothing/glasses/sunglasses"),
	r_hand: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/tommygun"),
	id: rt.typePath("/obj/item/weapon/card/id"),
});

// standard.dm:325
rt.def("/datum/outfit/mobster/proc/post_equip", function post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let W: Value = null;
	visualsOnly ??= 0;
	if (visualsOnly) {
		return f.dot;
	}
	(W = H.wear_id).assignment = "Assistant";
	W.registered_name = H.real_name;
	W.update_label();
	return f.dot;
});

rt.type(679, "/datum/outfit/death_commando", "/datum/outfit", {
	name: "Death Commando",
	uniform: rt.typePath("/obj/item/clothing/under/color/green"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/shielded/swat"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat/swat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	mask: rt.typePath("/obj/item/clothing/mask/gas/sechailer/swat"),
	glasses: rt.typePath("/obj/item/clothing/glasses/hud/toggle/thermal"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/security"),
	l_pocket: rt.typePath("/obj/item/weapon/melee/energy/sword/saber"),
	r_pocket: rt.typePath("/obj/item/weapon/shield/energy"),
	suit_store: rt.typePath("/obj/item/weapon/tank/internals/emergency_oxygen"),
	belt: rt.typePath("/obj/item/weapon/gun/ballistic/revolver/mateba"),
	r_hand: rt.typePath("/obj/item/weapon/gun/energy/pulse/loyalpin"),
	id: rt.typePath("/obj/item/weapon/card/id"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_cent/alt"),
	backpack_contents: null,
});

// standard.dm:355
rt.def("/datum/outfit/death_commando/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box"), 1, T("/obj/item/ammo_box/a357"), 1, T("/obj/item/weapon/storage/firstaid/regular"), 1, T("/obj/item/weapon/storage/box/flashbangs"), 1, T("/obj/item/device/flashlight"), 1, T("/obj/item/weapon/grenade/plastic/x4"), 1]);
	return f.dot;
});

// standard.dm:367
rt.def("/datum/outfit/death_commando/proc/post_equip", function* post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let R: Value = null, L: Value = null, W: Value = null;
	visualsOnly ??= 0;
	if (visualsOnly) {
		return f.dot;
	}
	yield* (R = H.ears).set_frequency(1337);
	R.freqlock = 1;
	yield* (L = (yield* new_(T("/obj/item/weapon/implant/mindshield"), H))).implant(H, null, 1);
	(W = H.wear_id).icon_state = "centcom";
	W.access = get_all_accesses();
	W.access += get_centcom_access("Death Commando");
	W.assignment = "Death Commando";
	W.registered_name = H.real_name;
	W.update_label(W.registered_name, W.assignment);
	return f.dot;
}, true);
