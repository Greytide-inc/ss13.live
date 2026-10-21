// From code/modules/clothing/outfits/ert.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(651, "/datum/outfit/ert", "/datum/outfit", {
	name: "ERT Common",
	uniform: rt.typePath("/obj/item/clothing/under/rank/centcom_officer"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat/swat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_cent/alt"),
});

// /datum/outfit/ert/proc/post_equip  (code/modules/clothing/outfits/ert.dm:13)  may sleep
rt.def("/datum/outfit/ert/proc/post_equip", function* post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let L: Value = null, R: Value = null, W: Value = null;
	f.vars = () => [H, visualsOnly, L, R, W];
	if (live(visualsOnly) === null) {
		visualsOnly = 0;
	}
	if (truthy(live(visualsOnly))) {
		return live(f.dot);
	}
	yield* g.callName(f, (L = (yield* g.new_(f, T("/obj/item/weapon/implant/mindshield"), [live(H)]))), "implant", [live(H), null, 1]);
	yield* g.callName(f, (R = rt.fv(f, "ears", live(H))), "set_frequency", [1337]);
	rt.setFv(f, "freqlock", live(R), 1);
	rt.setFv(f, "registered_name", (W = rt.fv(f, "wear_id", live(H))), rt.fv(f, "real_name", live(H)));
	yield* g.callName(f, live(W), "update_label", [rt.fv(f, "registered_name", live(W)), rt.fv(f, "assignment", live(W))]);
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

// /datum/outfit/ert/commander/proc/<init>  (code/modules/clothing/outfits/ert.dm:32)
rt.def("/datum/outfit/ert/commander/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/clothing/mask/gas/sechailer"), 1, T("/obj/item/weapon/gun/energy/e_gun"), 1]));
	return f.dot;
});

// /datum/outfit/ert/commander/proc/post_equip  (code/modules/clothing/outfits/ert.dm:39)  may sleep
rt.def("/datum/outfit/ert/commander/proc/post_equip", function* post_equip(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		return live(f.dot);
	}
	rt.setFv(f, "keyslot", (R = rt.fv(f, "ears", live(f.args[0]))), (yield* g.new_(f, T("/obj/item/device/encryptionkey/heads/captain"), [])));
	yield* g.callName(f, live(R), "recalculateChannels", []);
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(653, "/datum/outfit/ert/commander/alert", "/datum/outfit/ert/commander", {
	name: "ERT Commander - High Alert",
	glasses: rt.typePath("/obj/item/clothing/glasses/thermal/eyepatch"),
	backpack_contents: null,
	l_pocket: rt.typePath("/obj/item/weapon/melee/energy/sword/saber"),
});

// /datum/outfit/ert/commander/alert/proc/<init>  (code/modules/clothing/outfits/ert.dm:51)
rt.def("/datum/outfit/ert/commander/alert/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/clothing/mask/gas/sechailer/swat"), 1, T("/obj/item/weapon/gun/energy/pulse/pistol/loyalpin"), 1]));
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

// /datum/outfit/ert/security/proc/<init>  (code/modules/clothing/outfits/ert.dm:65)
rt.def("/datum/outfit/ert/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/storage/box/handcuffs"), 1, T("/obj/item/clothing/mask/gas/sechailer"), 1, T("/obj/item/weapon/gun/energy/e_gun/stun"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1]));
	return f.dot;
});

// /datum/outfit/ert/security/proc/post_equip  (code/modules/clothing/outfits/ert.dm:72)  may sleep
rt.def("/datum/outfit/ert/security/proc/post_equip", function* post_equip(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		return live(f.dot);
	}
	rt.setFv(f, "keyslot", (R = rt.fv(f, "ears", live(f.args[0]))), (yield* g.new_(f, T("/obj/item/device/encryptionkey/heads/hos"), [])));
	yield* g.callName(f, live(R), "recalculateChannels", []);
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(655, "/datum/outfit/ert/security/alert", "/datum/outfit/ert/security", {
	name: "ERT Security - High Alert",
	backpack_contents: null,
});

// /datum/outfit/ert/security/alert/proc/<init>  (code/modules/clothing/outfits/ert.dm:84)
rt.def("/datum/outfit/ert/security/alert/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/storage/box/handcuffs"), 1, T("/obj/item/clothing/mask/gas/sechailer/swat"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/weapon/gun/energy/pulse/carbine/loyalpin"), 1]));
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

// /datum/outfit/ert/medic/proc/<init>  (code/modules/clothing/outfits/ert.dm:100)
rt.def("/datum/outfit/ert/medic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/clothing/mask/gas/sechailer"), 1, T("/obj/item/weapon/gun/energy/e_gun"), 1, T("/obj/item/weapon/reagent_containers/hypospray/combat"), 1, T("/obj/item/weapon/gun/medbeam"), 1]));
	return f.dot;
});

// /datum/outfit/ert/medic/proc/post_equip  (code/modules/clothing/outfits/ert.dm:108)  may sleep
rt.def("/datum/outfit/ert/medic/proc/post_equip", function* post_equip(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		return live(f.dot);
	}
	rt.setFv(f, "keyslot", (R = rt.fv(f, "ears", live(f.args[0]))), (yield* g.new_(f, T("/obj/item/device/encryptionkey/heads/cmo"), [])));
	yield* g.callName(f, live(R), "recalculateChannels", []);
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(657, "/datum/outfit/ert/medic/alert", "/datum/outfit/ert/medic", {
	name: "ERT Medic - High Alert",
	backpack_contents: null,
});

// /datum/outfit/ert/medic/alert/proc/<init>  (code/modules/clothing/outfits/ert.dm:120)
rt.def("/datum/outfit/ert/medic/alert/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/clothing/mask/gas/sechailer/swat"), 1, T("/obj/item/weapon/gun/energy/pulse/pistol/loyalpin"), 1, T("/obj/item/weapon/reagent_containers/hypospray/combat/nanites"), 1, T("/obj/item/weapon/gun/medbeam"), 1]));
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

// /datum/outfit/ert/engineer/proc/<init>  (code/modules/clothing/outfits/ert.dm:137)
rt.def("/datum/outfit/ert/engineer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/clothing/mask/gas/sechailer"), 1, T("/obj/item/weapon/gun/energy/e_gun"), 1, T("/obj/item/weapon/construction/rcd/loaded"), 1]));
	return f.dot;
});

// /datum/outfit/ert/engineer/proc/post_equip  (code/modules/clothing/outfits/ert.dm:144)  may sleep
rt.def("/datum/outfit/ert/engineer/proc/post_equip", function* post_equip(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		return live(f.dot);
	}
	rt.setFv(f, "keyslot", (R = rt.fv(f, "ears", live(f.args[0]))), (yield* g.new_(f, T("/obj/item/device/encryptionkey/heads/ce"), [])));
	yield* g.callName(f, live(R), "recalculateChannels", []);
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(659, "/datum/outfit/ert/engineer/alert", "/datum/outfit/ert/engineer", {
	name: "ERT Engineer - High Alert",
	backpack_contents: null,
});

// /datum/outfit/ert/engineer/alert/proc/<init>  (code/modules/clothing/outfits/ert.dm:156)
rt.def("/datum/outfit/ert/engineer/alert/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/engineer"), 1, T("/obj/item/weapon/melee/baton/loaded"), 1, T("/obj/item/clothing/mask/gas/sechailer/swat"), 1, T("/obj/item/weapon/gun/energy/pulse/pistol/loyalpin"), 1, T("/obj/item/weapon/construction/rcd/combat"), 1]));
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

// /datum/outfit/centcom_official/proc/post_equip  (code/modules/clothing/outfits/ert.dm:184)
rt.def("/datum/outfit/centcom_official/proc/post_equip", function post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let pda: Value = null, W: Value = null;
	f.vars = () => [visualsOnly, pda, W];
	if (live(visualsOnly) === null) {
		visualsOnly = 0;
	}
	if (truthy(live(visualsOnly))) {
		return live(f.dot);
	}
	rt.setFv(f, "owner", (pda = rt.fv(f, "r_store", live(H))), rt.fv(f, "real_name", live(H)));
	rt.setFv(f, "ownjob", live(pda), "Centcom Official");
	rt.callName(f, live(pda), "update_label", []);
	rt.setFv(f, "icon_state", (W = rt.fv(f, "wear_id", live(H))), "centcom");
	rt.setFv(f, "access", live(W), rt.call(f, P("/proc/get_centcom_access"), null, ["Centcom Official"]));
	rt.modField(f, live(W), "access", 66, add);
	rt.setFv(f, "assignment", live(W), "Centcom Official");
	rt.setFv(f, "registered_name", live(W), rt.fv(f, "real_name", live(H)));
	rt.callName(f, live(W), "update_label", []);
	return f.dot;
});
