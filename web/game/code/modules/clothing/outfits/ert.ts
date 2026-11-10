// Based on /tg/station's code/modules/clothing/outfits/ert.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(651, "/datum/outfit/ert", "/datum/outfit", {
	name: "ERT Common",
	uniform: rt.typePath("/obj/item/clothing/under/rank/centcom_officer"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat/swat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_cent/alt"),
});

// ert.dm:13
rt.def("/datum/outfit/ert/proc/post_equip", function* post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let L: Value = null, R: Value = null, W: Value = null;
	visualsOnly ??= 0;
	if (visualsOnly) {
		return f.dot;
	}
	yield* (L = (yield* new_(T("/obj/item/weapon/implant/mindshield"), H))).implant(H, null, 1);
	yield* (R = H.ears).set_frequency(1337);
	R.freqlock = 1;
	(W = H.wear_id).registered_name = H.real_name;
	W.update_label(W.registered_name, W.assignment);
	return f.dot;
}, true);

rt.type(652, "/datum/outfit/ert/commander", "/datum/outfit/ert", {
	name: "ERT Commander",
	id: rt.typePath("/obj/item/weapon/card/id/ert"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/ert"),
	glasses: rt.typePath("/obj/item/clothing/glasses/hud/security/sunglasses"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/captain"),
	belt: rt.typePath("/obj/item/weapon/storage/belt/security/full"),
	backpack_contents: null,
	l_pocket: rt.typePath("/obj/item/weapon/switchblade"),
});

// ert.dm:32
rt.def("/datum/outfit/ert/commander/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/clothing/mask/gas/sechailer"), 1, T("/obj/item/weapon/gun/energy/e_gun"), 1]);
	return f.dot;
});

// ert.dm:39
rt.def("/datum/outfit/ert/commander/proc/post_equip", function* post_equip(f: Frame) {
	let R: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (f.args[1]) {
		return f.dot;
	}
	(R = f.args[0].ears).keyslot = (yield* new_(T("/obj/item/device/encryptionkey/heads/captain")));
	R.recalculateChannels();
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(653, "/datum/outfit/ert/commander/alert", "/datum/outfit/ert/commander", {
	name: "ERT Commander - High Alert",
	glasses: rt.typePath("/obj/item/clothing/glasses/thermal/eyepatch"),
	backpack_contents: null,
	l_pocket: rt.typePath("/obj/item/weapon/melee/energy/sword/saber"),
});

// ert.dm:51
rt.def("/datum/outfit/ert/commander/alert/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/clothing/mask/gas/sechailer/swat"), 1, T("/obj/item/weapon/gun/energy/pulse/pistol/loyalpin"), 1]);
	return f.dot;
});

rt.type(654, "/datum/outfit/ert/security", "/datum/outfit/ert", {
	name: "ERT Security",
	id: rt.typePath("/obj/item/weapon/card/id/ert/Security"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/ert/sec"),
	glasses: rt.typePath("/obj/item/clothing/glasses/hud/security/sunglasses"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/security"),
	belt: rt.typePath("/obj/item/weapon/storage/belt/security/full"),
	backpack_contents: null,
});

// ert.dm:65
rt.def("/datum/outfit/ert/security/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/storage/box/handcuffs"), 1, T("/obj/item/clothing/mask/gas/sechailer"), 1, T("/obj/item/weapon/gun/energy/e_gun/stun"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1]);
	return f.dot;
});

// ert.dm:72
rt.def("/datum/outfit/ert/security/proc/post_equip", function* post_equip(f: Frame) {
	let R: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (f.args[1]) {
		return f.dot;
	}
	(R = f.args[0].ears).keyslot = (yield* new_(T("/obj/item/device/encryptionkey/heads/hos")));
	R.recalculateChannels();
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(655, "/datum/outfit/ert/security/alert", "/datum/outfit/ert/security", {
	name: "ERT Security - High Alert",
	backpack_contents: null,
});

// ert.dm:84
rt.def("/datum/outfit/ert/security/alert/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/storage/box/handcuffs"), 1, T("/obj/item/clothing/mask/gas/sechailer/swat"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/weapon/gun/energy/pulse/carbine/loyalpin"), 1]);
	return f.dot;
});

rt.type(656, "/datum/outfit/ert/medic", "/datum/outfit/ert", {
	name: "ERT Medic",
	id: rt.typePath("/obj/item/weapon/card/id/ert/Medical"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/ert/med"),
	glasses: rt.typePath("/obj/item/clothing/glasses/hud/health"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/satchel/med"),
	belt: rt.typePath("/obj/item/weapon/storage/belt/medical"),
	r_hand: rt.typePath("/obj/item/weapon/storage/firstaid/regular"),
	backpack_contents: null,
});

// ert.dm:100
rt.def("/datum/outfit/ert/medic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/clothing/mask/gas/sechailer"), 1, T("/obj/item/weapon/gun/energy/e_gun"), 1, T("/obj/item/weapon/reagent_containers/hypospray/combat"), 1, T("/obj/item/weapon/gun/medbeam"), 1]);
	return f.dot;
});

// ert.dm:108
rt.def("/datum/outfit/ert/medic/proc/post_equip", function* post_equip(f: Frame) {
	let R: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (f.args[1]) {
		return f.dot;
	}
	(R = f.args[0].ears).keyslot = (yield* new_(T("/obj/item/device/encryptionkey/heads/cmo")));
	R.recalculateChannels();
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(657, "/datum/outfit/ert/medic/alert", "/datum/outfit/ert/medic", {
	name: "ERT Medic - High Alert",
	backpack_contents: null,
});

// ert.dm:120
rt.def("/datum/outfit/ert/medic/alert/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/clothing/mask/gas/sechailer/swat"), 1, T("/obj/item/weapon/gun/energy/pulse/pistol/loyalpin"), 1, T("/obj/item/weapon/reagent_containers/hypospray/combat/nanites"), 1, T("/obj/item/weapon/gun/medbeam"), 1]);
	return f.dot;
});

rt.type(658, "/datum/outfit/ert/engineer", "/datum/outfit/ert", {
	name: "ERT Engineer",
	id: rt.typePath("/obj/item/weapon/card/id/ert/Engineer"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/ert/engi"),
	glasses: rt.typePath("/obj/item/clothing/glasses/meson/engine"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/industrial"),
	belt: rt.typePath("/obj/item/weapon/storage/belt/utility/full"),
	l_pocket: rt.typePath("/obj/item/weapon/rcd_ammo/large"),
	r_hand: rt.typePath("/obj/item/weapon/storage/firstaid/regular"),
	backpack_contents: null,
});

// ert.dm:137
rt.def("/datum/outfit/ert/engineer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/clothing/mask/gas/sechailer"), 1, T("/obj/item/weapon/gun/energy/e_gun"), 1, T("/obj/item/weapon/construction/rcd/loaded"), 1]);
	return f.dot;
});

// ert.dm:144
rt.def("/datum/outfit/ert/engineer/proc/post_equip", function* post_equip(f: Frame) {
	let R: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (f.args[1]) {
		return f.dot;
	}
	(R = f.args[0].ears).keyslot = (yield* new_(T("/obj/item/device/encryptionkey/heads/ce")));
	R.recalculateChannels();
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(659, "/datum/outfit/ert/engineer/alert", "/datum/outfit/ert/engineer", {
	name: "ERT Engineer - High Alert",
	backpack_contents: null,
});

// ert.dm:156
rt.def("/datum/outfit/ert/engineer/alert/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/clothing/mask/gas/sechailer/swat"), 1, T("/obj/item/weapon/gun/energy/pulse/pistol/loyalpin"), 1, T("/obj/item/weapon/construction/rcd/combat"), 1]);
	return f.dot;
});

rt.type(660, "/datum/outfit/centcom_official", "/datum/outfit", {
	name: "Centcom Official",
	uniform: rt.typePath("/obj/item/clothing/under/rank/centcom_officer"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/black"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/black"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_cent"),
	glasses: rt.typePath("/obj/item/clothing/glasses/sunglasses"),
	belt: rt.typePath("/obj/item/weapon/gun/energy/e_gun"),
	l_pocket: rt.typePath("/obj/item/weapon/pen"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/satchel"),
	r_pocket: rt.typePath("/obj/item/device/pda/heads"),
	l_hand: rt.typePath("/obj/item/weapon/clipboard"),
	id: rt.typePath("/obj/item/weapon/card/id"),
});

// ert.dm:184
rt.def("/datum/outfit/centcom_official/proc/post_equip", function post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let pda: Value = null, W: Value = null;
	visualsOnly ??= 0;
	if (visualsOnly) {
		return f.dot;
	}
	(pda = H.r_store).owner = H.real_name;
	pda.ownjob = "Centcom Official";
	pda.update_label();
	(W = H.wear_id).icon_state = "centcom";
	W.access = get_centcom_access("Centcom Official");
	W.access += 66;
	W.assignment = "Centcom Official";
	W.registered_name = H.real_name;
	W.update_label();
	return f.dot;
});
