// Based on /tg/station's code/modules/clothing/masks/gasmask.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(8545, "/obj/item/clothing/mask/gas/welding", "/obj/item/clothing/mask/gas", {
	name: "welding mask",
	desc: "A gas mask with built-in welding goggles and a face shield. Looks like a skull - clearly designed by a nerd.",
	icon_state: "weldingmask",
	materials: null,
	flash_protect: 2,
	tint: 2,
	armor: null,
	origin_tech: "materials=2;engineering=3",
	actions_types: null,
	flags_inv: 224,
	flags_cover: 2,
	visor_flags_inv: 64,
	visor_flags_cover: 2,
	resistance_flags: 2,
});

// gasmask.dm:20
rt.def("/obj/item/clothing/mask/gas/welding/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 4000, "$glass", 2000]);
	this.armor = rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 55]);

	this.actions_types = list(T("/datum/action/item_action/toggle"));
	return f.dot;
});

// gasmask.dm:33
rt.def("/obj/item/clothing/mask/gas/welding/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.weldingvisortoggle(user);
	return f.dot;
}, true);

rt.type(8546, "/obj/item/clothing/mask/gas/plaguedoctor", "/obj/item/clothing/mask/gas", {
	name: "plague doctor mask",
	desc: "A modernised version of the classic design, this mask will not only filter out toxins but it can also be connected to an air supply.",
	icon_state: "plaguedoctor",
	item_state: "gas_mask",
	armor: null,
});

// gasmask.dm:44
rt.def("/obj/item/clothing/mask/gas/plaguedoctor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 2, "energy", 2, "bomb", 0, "bio", 75, "rad", 0, "fire", 0, "acid", 0]);
	return f.dot;
});

rt.type(8548, "/obj/item/clothing/mask/gas/clown_hat", "/obj/item/clothing/mask/gas", {
	flags: 8,
	name: "clown wig and mask",
	desc: "A true prankster's facial attire. A clown is incomplete without his wig and mask.",
	icon_state: "clown",
	item_state: "clown_hat",
	flags_cover: 2,
	resistance_flags: 4,
	actions_types: null,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/clown"),
});

// gasmask.dm:60
rt.def("/obj/item/clothing/mask/gas/clown_hat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/adjust"));
	return f.dot;
});

// gasmask.dm:64
rt.def("/obj/item/clothing/mask/gas/clown_hat/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value) {
	let options: Value = null, X: Value = null, A: Value = null;
	if (!rt.istype(user, T("/mob")) || user.incapacitated()) {
		return f.dot;
	}
	rt.setAt((options = list()), "True Form", "clown");
	rt.setAt(options, "The Feminist", "sexyclown");
	rt.setAt(options, "The Madman", "joker");
	rt.setAt(options, "The Rainbow Color", "rainbow");
	let choice: Value = (yield* g.op(f, "Prompt", [0], [null, "Morph Mask", "To what form do you wish to Morph this mask?", user, options]));
	if (!(this && choice && !user.incapacitated() && get_dist(user, this) <= 1)) return f.dot;
	this.icon_state = rt.index(options, choice);
	yield* user.update_inv_wear_mask();
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	to_chat(user, `<span class='notice'>Your Clown Mask has now morphed into ${choice}, all praise the Honkmother!</span>`);
	return 1;
}, true);

rt.type(8550, "/obj/item/clothing/mask/gas/mime", "/obj/item/clothing/mask/gas", {
	flags: 8,
	name: "mime mask",
	desc: "The traditional mime's mask. It has an eerie facial posture.",
	icon_state: "mime",
	item_state: "mime",
	flags_cover: 2,
	resistance_flags: 4,
	actions_types: null,
});

// gasmask.dm:101
rt.def("/obj/item/clothing/mask/gas/mime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/adjust"));
	return f.dot;
});

// gasmask.dm:105
rt.def("/obj/item/clothing/mask/gas/mime/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value) {
	let options: Value = null, X: Value = null, A: Value = null;
	if (!rt.istype(user, T("/mob")) || user.incapacitated()) {
		return f.dot;
	}
	rt.setAt((options = list()), "Blanc", "mime");
	rt.setAt(options, "Triste", "sadmime");
	rt.setAt(options, "Effrayé", "scaredmime");
	rt.setAt(options, "Excité", "sexymime");
	let choice: Value = (yield* g.op(f, "Prompt", [0], [null, "Morph Mask", "To what form do you wish to Morph this mask?", user, options]));
	if (!(this && choice && !user.incapacitated() && get_dist(user, this) <= 1)) return f.dot;
	this.icon_state = rt.index(options, choice);
	yield* user.update_inv_wear_mask();
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	to_chat(user, `<span class='notice'>Your Mime Mask has now morphed into ${choice}!</span>`);
	return 1;
}, true);

rt.type(8557, "/obj/item/clothing/mask/gas/tiki_mask", "/obj/item/clothing/mask/gas", {
	name: "tiki mask",
	desc: "A creepy wooden mask. Surprisingly expressive for a poorly carved bit of wood.",
	icon_state: "tiki_eyebrow",
	item_state: "tiki_eyebrow",
	resistance_flags: 4,
	obj_integrity: 100,
	max_integrity: 100,
	actions_types: null,
	dog_fashion: null,
});

// gasmask.dm:175
rt.def("/obj/item/clothing/mask/gas/tiki_mask/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/adjust"));
	return f.dot;
});

// gasmask.dm:181
rt.def("/obj/item/clothing/mask/gas/tiki_mask/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value) {
	let options: Value = null, X: Value = null, A: Value = null;
	let M: Value = f.usr;
	rt.setAt((options = list()), "Original Tiki", "tiki_eyebrow");
	rt.setAt(options, "Happy Tiki", "tiki_happy");
	rt.setAt(options, "Confused Tiki", "tiki_confused");
	rt.setAt(options, "Angry Tiki", "tiki_angry");
	let choice: Value = (yield* g.op(f, "Prompt", [0], [null, "Morph Mask", "To what form do you wish to change this mask?", M, options]));
	if (!(this && choice && !M.stat && get_dist(M, this) <= 1)) return f.dot;
	this.icon_state = rt.index(options, choice);
	yield* user.update_inv_wear_mask();
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	to_chat(M, `The Tiki Mask has now changed into the ${choice} Mask!`);
	return 1;
}, true);
